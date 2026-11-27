(function () {
  "use strict";

  // ============================================================
  // QUIZBALLON V9.2 - DIEREN AANVULLING 2
  // RIVIEREN, MEREN EN STRANDEN
  // ============================================================

  const VERSIE = "9.2.0";

  const categorie =
    window.QB_V9_CATEGORIEEN?.Dieren;

  if (!categorie || !Array.isArray(categorie.questions)) {
    throw new Error(
      "Laad eerst de oorspronkelijke dierendatabase en aanvulling 1."
    );
  }

  const vorigeDebug =
    window.QB_V9_DIeren_DEBUG;

  const vorigeSamenvatting = {
    ...categorie.summary
  };

  const vorigeTests =
    vorigeDebug?.tests?.() || [];

  const vorigeRaketTests =
    vorigeDebug?.raketTests?.() || [];

  const vorigeOntbrekendeNamen =
    vorigeDebug?.ontbrekendeNamen?.() || [];

  const vorigeAantallen = new Map(
    categorie.questions.map(vraag => [
      vraag.questionNumber,
      vraag.answers.length
    ])
  );

  // ============================================================
  // NORMALISATIE
  // ============================================================

  function normaal(tekst) {
    return String(tekst ?? "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ß/g, "ss")
      .replace(/æ/g, "ae")
      .replace(/œ/g, "oe")
      .replace(/[^a-z0-9]/g, "");
  }

  function raketten(aantal) {

    if (aantal <= 0) return 0;

    return Math.min(
      aantal,
      Math.max(
        1,
        Math.ceil((aantal + 50) / 100)
      )
    );
  }

  // ============================================================
  // CENTRALE DATABASE
  // ============================================================

  const dieren = new Map();

  const naamIndex = new Map();

  const conflictenBijToevoegen = [];

  const ontbrekendeKoppelingen = [];

  const wijzigingen = [];

  let nieuweDieren = 0;

  let nieuweKoppelingen = 0;

  let nieuweSynoniemen = 0;

  let verwijderdeKoppelingen = 0;

  function indexeer(naam, record) {

    const sleutel = normaal(naam);

    if (!sleutel) return;

    if (!naamIndex.has(sleutel)) {

      naamIndex.set(
        sleutel,
        new Set()
      );

    }

    naamIndex.get(sleutel).add(record);
  }

  for (const vraag of categorie.questions) {

    for (const antwoord of vraag.answers) {

      const sleutel =
        normaal(antwoord.answer);

      if (!dieren.has(sleutel)) {

        dieren.set(sleutel, {

          naam: antwoord.answer,

          aliases: new Set(),

          vragen: new Map()

        });

      }

      const record =
        dieren.get(sleutel);

      for (const alias of antwoord.aliases || []) {

        record.aliases.add(alias);

      }

      record.vragen.set(
        vraag.questionNumber,
        antwoord.points
      );

    }

  }

  for (const record of dieren.values()) {

    indexeer(record.naam, record);

    for (const alias of record.aliases) {

      indexeer(alias, record);

    }

  }

  const beginAantalDieren = dieren.size;

  // ============================================================
  // BESTAANDE DIEREN ZOEKEN
  // ============================================================

  function zoekAlle(naam) {

    return [
      ...(naamIndex.get(normaal(naam)) || [])
    ];

  }

  function zoekEen(naam) {

    const resultaten = zoekAlle(naam);

    return resultaten.length === 1
      ? resultaten[0]
      : null;

  }

  function voegKoppelingToe(
    record,
    nummer,
    punten = 65
  ) {

    if (
      !Number.isInteger(nummer) ||
      nummer < 1 ||
      nummer > 50
    ) {

      throw new Error(
        "Ongeldig vraagnummer: " + nummer
      );

    }

    if (!record.vragen.has(nummer)) {

      record.vragen.set(nummer, punten);

      nieuweKoppelingen++;

      wijzigingen.push({
        dier: record.naam,
        vraag: nummer,
        actie: "toegevoegd"
      });

    }

  }

  // ============================================================
  // DIER TOEVOEGEN OF HERGEBRUIKEN
  // ============================================================

  function dier(
    naam,
    vragen,
    aliases = [],
    punten = 65
  ) {

    naam = String(naam).trim();

    if (!naam) return;

    const namen = [
      naam,
      ...aliases
    ];

    const kandidaten = new Set();

    for (const invoer of namen) {

      for (const record of zoekAlle(invoer)) {

        kandidaten.add(record);

      }

    }

    if (kandidaten.size > 1) {

      conflictenBijToevoegen.push({

        naam,

        kandidaten: [...kandidaten].map(
          record => record.naam
        ),

        vragen

      });

      return;

    }

    let record;

    if (kandidaten.size === 1) {

      record = [...kandidaten][0];

    } else {

      record = {

        naam,

        aliases: new Set(),

        vragen: new Map()

      };

      dieren.set(
        normaal(naam),
        record
      );

      indexeer(naam, record);

      nieuweDieren++;

    }

    for (const alias of namen) {

      const sleutel = normaal(alias);

      if (
        !sleutel ||
        sleutel === normaal(record.naam)
      ) continue;

      const andereRecords =
        zoekAlle(alias).filter(
          item => item !== record
        );

      if (andereRecords.length) {

        conflictenBijToevoegen.push({

          naam: record.naam,

          alias,

          kandidaten:
            andereRecords.map(
              item => item.naam
            )

        });

        continue;

      }

      if (!record.aliases.has(alias)) {

        record.aliases.add(alias);

        indexeer(alias, record);

        nieuweSynoniemen++;

      }

    }

    for (const nummer of vragen) {

      voegKoppelingToe(
        record,
        nummer,
        punten
      );

    }

  }

  function groep(
    tekst,
    vragen,
    punten = 65
  ) {

    for (const regel of tekst.split(";")) {

      const onderdelen = regel
        .split("=")
        .map(item => item.trim())
        .filter(Boolean);

      if (!onderdelen.length) continue;

      const [naam, ...aliases] =
        onderdelen;

      dier(
        naam,
        vragen,
        aliases,
        punten
      );

    }

  }

  function koppel(
    tekst,
    vragen,
    punten = 65
  ) {

    for (const onderdeel of tekst.split(";")) {

      const naam = onderdeel.trim();

      if (!naam) continue;

      const record = zoekEen(naam);

      if (!record) {

        ontbrekendeKoppelingen.push({
          naam,
          vragen
        });

        continue;

      }

      for (const nummer of vragen) {

        voegKoppelingToe(
          record,
          nummer,
          punten
        );

      }

    }

  }

  function verwijderKoppeling(naam, vragen) {

    const record = zoekEen(naam);

    if (!record) return;

    for (const nummer of vragen) {

      if (record.vragen.delete(nummer)) {

        verwijderdeKoppelingen++;

        wijzigingen.push({
          dier: record.naam,
          vraag: nummer,
          actie: "verwijderd"
        });

      }

    }

  }

  // ============================================================
  // HULPFUNCTIES VOOR LEEFGEBIEDEN
  // ============================================================

  function riviervissen(
    tekst,
    extra = [],
    punten = 70
  ) {

    groep(
      tekst,
      [1,14,18,37,50,...extra],
      punten
    );

  }

  function meervissen(
    tekst,
    extra = [],
    punten = 70
  ) {

    groep(
      tekst,
      [1,14,18,38,50,...extra],
      punten
    );

  }

  function rivierEnMeerVissen(
    tekst,
    extra = [],
    punten = 70
  ) {

    groep(
      tekst,
      [1,14,18,37,38,50,...extra],
      punten
    );

  }

  function rivierdieren(
    tekst,
    extra = [],
    punten = 65
  ) {

    groep(
      tekst,
      [1,37,50,...extra],
      punten
    );

  }

  function meerdieren(
    tekst,
    extra = [],
    punten = 65
  ) {

    groep(
      tekst,
      [1,38,50,...extra],
      punten
    );

  }

  function rivierEnMeerDieren(
    tekst,
    extra = [],
    punten = 65
  ) {

    groep(
      tekst,
      [1,37,38,50,...extra],
      punten
    );

  }

  function stranddieren(
    tekst,
    extra = [],
    punten = 65
  ) {

    groep(
      tekst,
      [39,50,...extra],
      punten
    );

  }

  // ============================================================
  // EUROPESE ZOETWATERVISSEN
  // ============================================================

  rivierEnMeerVissen(`
    Snoek=Esox lucius;
    Baars=Perca fluviatilis;
    Snoekbaars=Sander lucioperca;
    Pos=Gymnocephalus cernua;
    Karper=Cyprinus carpio;
    Brasem=Abramis brama;
    Kolblei=Blicca bjoerkna;
    Blankvoorn=Rutilus rutilus;
    Rietvoorn=Scardinius erythrophthalmus;
    Zeelt=Tinca tinca;
    Alver=Alburnus alburnus;
    Winde=Leuciscus idus;
    Kopvoorn=Squalius cephalus;
    Serpeling=Leuciscus leuciscus;
    Roofblei=Leuciscus aspius=Aspius aspius;
    Bittervoorn=Rhodeus amarus;
    Giebel=Carassius gibelio;
    Kroeskarper=Carassius carassius;
    Europese meerval=Silurus glanis;
    Kwabaal=Lota lota;
    Riviergrondel=Gobio gobio;
    Kleine modderkruiper=Cobitis taenia;
    Grote modderkruiper=Misgurnus fossilis;
    Driedoornige stekelbaars=Gasterosteus aculeatus;
    Tiendoornige stekelbaars=Pungitius pungitius;
    Europese aal=Anguilla anguilla=Paling;
    Zwartbekgrondel=Neogobius melanostomus;
    Pontische stroomgrondel=Neogobius fluviatilis;
    Marmergrondel=Proterorhinus semilunaris;
    Kesslers grondel=Ponticola kessleri;
    Zonnebaars=Lepomis gibbosus;
    Regenboogforel=Oncorhynchus mykiss;
    Amerikaanse meerforel=Salvelinus namaycush;
    Bronforel=Salvelinus fontinalis;
    Beekforel=Salmo trutta;
    Donauzalm=Hucho hucho
  `, [21], 35);

  // ============================================================
  // VOORNAMELIJK RIVIEREN EN BEKEN
  // ============================================================

  riviervissen(`
    Barbeel=Barbus barbus;
    Vlagzalm=Thymallus thymallus;
    Atlantische zalm=Salmo salar;
    Rivierprik=Lampetra fluviatilis;
    Beekprik=Lampetra planeri;
    Zeeprik=Petromyzon marinus;
    Sneep=Chondrostoma nasus;
    Elrits=Phoxinus phoxinus;
    Bermpje=Barbatula barbatula;
    Rivierdonderpad=Cottus perifretum;
    Beekdonderpad=Cottus rhenanus;
    Witvingrondel=Romanogobio belingi;
    Donaubarbeel=Barbus balcanicus;
    Mediterrane barbeel=Barbus meridionalis;
    Italiaanse barbeel=Barbus plebejus;
    Spaanse barbeel=Luciobarbus bocagei;
    Iberische barbeel=Luciobarbus graellsii;
    Luciobarbus comizo;
    Luciobarbus guiraonis;
    Luciobarbus microcephalus;
    Luciobarbus sclateri;
    Luciobarbus steindachneri;
    Luciobarbus capito;
    Luciobarbus esocinus;
    Luciobarbus xanthopterus;
    Barbus petenyi;
    Barbus rebeli;
    Barbus strumicae;
    Barbus tauricus;
    Barbus cyclolepis;
    Chondrostoma regium;
    Chondrostoma knerii;
    Chondrostoma soetta;
    Chondrostoma phoxinus;
    Parachondrostoma toxostoma;
    Parachondrostoma miegii;
    Parachondrostoma turiense;
    Pseudochondrostoma polylepis;
    Pseudochondrostoma duriense;
    Pseudochondrostoma willkommii;
    Squalius carolitertii;
    Squalius pyrenaicus;
    Squalius alburnoides;
    Squalius aradensis;
    Squalius torgalensis;
    Squalius laietanus;
    Squalius lucumonis;
    Squalius squalus;
    Squalius peloponensis;
    Squalius vardarensis;
    Squalius orpheus;
    Squalius orientalis;
    Telestes souffia;
    Telestes muticellus;
    Telestes pleurobipunctatus;
    Telestes ukliva;
    Telestes metohiensis;
    Telestes polylepis;
    Telestes dabar;
    Telestes croaticus;
    Romanogobio albipinnatus;
    Romanogobio uranoscopus;
    Romanogobio kesslerii;
    Romanogobio vladykovi;
    Romanogobio banaticus;
    Romanogobio antipai;
    Gobio obtusirostris;
    Gobio gobio;
    Gobio occitaniae;
    Gobio lozanoi;
    Gobio alverniae;
    Gobio insuyanus;
    Gobio kubanicus;
    Gobio carpathicus;
    Gobio volgensis;
    Cottus gobio;
    Cottus poecilopus;
    Cottus microstomus;
    Cottus hispaniolensis;
    Cottus aturi;
    Cottus duranii;
    Cottus rondeleti;
    Cottus petiti;
    Cottus haemusi;
    Cottus transsilvaniae;
    Barbatula quignardi;
    Barbatula barbatula;
    Barbatula toni;
    Sabanejewia balcanica;
    Sabanejewia aurata;
    Sabanejewia bulgarica;
    Sabanejewia romanica;
    Sabanejewia vallachica
  `, [], 75);

  // ============================================================
  // EUROPESE EN AZIATISCHE MEERVISSEN
  // ============================================================

  meervissen(`
    Grote marene=Coregonus lavaretus;
    Kleine marene=Coregonus albula;
    Houting=Coregonus oxyrinchus;
    Noordzeehouting=Coregonus maraena;
    Arctic char=Salvelinus alpinus=Arctische riddervis;
    Salvelinus umbla;
    Salvelinus profundus;
    Salvelinus evasus;
    Salvelinus neocomensis;
    Salvelinus salvelinus;
    Salvelinus killinensis;
    Salvelinus perisii;
    Coregonus albock;
    Coregonus alpinus;
    Coregonus arenicolus;
    Coregonus austriacus;
    Coregonus bavaricus;
    Coregonus bezola;
    Coregonus candidus;
    Coregonus clupeaformis;
    Coregonus confusus;
    Coregonus danneri;
    Coregonus dorsalis;
    Coregonus fatioi;
    Coregonus fera;
    Coregonus fontanae;
    Coregonus heglingus;
    Coregonus hiemalis;
    Coregonus hoferi;
    Coregonus holsatus;
    Coregonus intermedius;
    Coregonus johannae;
    Coregonus kiletz;
    Coregonus kiyi;
    Coregonus ladogae;
    Coregonus laurettae;
    Coregonus lucinensis;
    Coregonus macrophthalmus;
    Coregonus maxillaris;
    Coregonus megalops;
    Coregonus muksun;
    Coregonus nasus;
    Coregonus nilssoni;
    Coregonus nobilis;
    Coregonus oxyrinchus;
    Coregonus palaea;
    Coregonus pallasii;
    Coregonus peled;
    Coregonus pidschian;
    Coregonus pollan;
    Coregonus reighardi;
    Coregonus renke;
    Coregonus restrictus;
    Coregonus sardinella;
    Coregonus stigmaticus;
    Coregonus subautumnalis;
    Coregonus trybomi;
    Coregonus tugun;
    Coregonus ussuriensis;
    Coregonus vandesius;
    Coregonus wartmanni;
    Coregonus widegreni;
    Baikalomul=Coregonus migratorius;
    Baikalolifantvis=Comephorus baikalensis;
    Comephorus dybowskii;
    Cottocomephorus grewingkii;
    Cottocomephorus inermis;
    Batrachocottus baicalensis;
    Batrachocottus multiradiatus;
    Batrachocottus nikolskii;
    Batrachocottus talievi;
    Abyssocottus korotneffi;
    Abyssocottus gibbosus;
    Abyssocottus elochini;
    Limnocottus bergianus;
    Limnocottus godlewskii;
    Limnocottus griseus;
    Limnocottus pallidus;
    Procottus jeittelesii;
    Procottus gurwici;
    Procottus major;
    Procottus obscurus
  `, [], 80);

  // Uitgestorven soorten worden later
  // uit de actuele leefgebiedsvragen verwijderd.

  // ============================================================
  // NOORD-AMERIKAANSE VISSEN
  // ============================================================

  rivierEnMeerVissen(`
    Amerikaanse snoek=Esox americanus;
    Muskellunge=Esox masquinongy;
    Kettingsnoek=Esox niger;
    Gele baars=Perca flavescens;
    Walleye=Sander vitreus;
    Sauger=Sander canadensis;
    Zwarte crappie=Pomoxis nigromaculatus;
    Witte crappie=Pomoxis annularis;
    Grootbekbaars=Micropterus salmoides;
    Kleinbekbaars=Micropterus dolomieu;
    Gevlekte baars=Micropterus punctulatus;
    Rock bass=Ambloplites rupestris;
    Bluegill=Lepomis macrochirus;
    Groene zonnebaars=Lepomis cyanellus;
    Roodborstzonnebaars=Lepomis auritus;
    Lepomis microlophus;
    Lepomis megalotis;
    Lepomis humilis;
    Lepomis marginatus;
    Lepomis miniatus;
    Lepomis punctatus;
    Lepomis symmetricus;
    Ictalurus punctatus=Kanaalmeerval;
    Ictalurus furcatus=Blauwe meerval;
    Ameiurus melas=Zwarte dwergmeerval;
    Ameiurus nebulosus=Bruine dwergmeerval;
    Ameiurus natalis;
    Ameiurus catus;
    Ameiurus platycephalus;
    Ameiurus serracanthus;
    Pylodictis olivaris;
    Amerikaanse moddersnoek=Amia calva;
    Alligatorgeep=Atractosteus spatula;
    Langsnuitgeep=Lepisosteus osseus;
    Gevlekte kaaimansnoek=Lepisosteus oculatus;
    Kortsnuitgeep=Lepisosteus platostomus;
    Floridageep=Lepisosteus platyrhincus;
    Catostomus commersonii;
    Catostomus catostomus;
    Catostomus macrocheilus;
    Catostomus columbianus;
    Catostomus platyrhynchus;
    Catostomus rimiculus;
    Catostomus tahoensis;
    Catostomus ardens;
    Catostomus occidentalis;
    Catostomus latipinnis;
    Catostomus discobolus;
    Catostomus clarkii;
    Catostomus insignis;
    Catostomus bernardini;
    Catostomus plebeius;
    Catostomus santaanae;
    Carpiodes carpio;
    Carpiodes cyprinus;
    Carpiodes velifer;
    Ictiobus bubalus;
    Ictiobus cyprinellus;
    Ictiobus niger;
    Moxostoma macrolepidotum;
    Moxostoma erythrurum;
    Moxostoma anisurum;
    Moxostoma carinatum;
    Moxostoma duquesnei;
    Moxostoma valenciennesi;
    Moxostoma poecilurum;
    Moxostoma robustum;
    Notemigonus crysoleucas;
    Pimephales promelas;
    Pimephales notatus;
    Pimephales vigilax;
    Pimephales tenellus;
    Semotilus atromaculatus;
    Semotilus corporalis;
    Couesius plumbeus;
    Richardsonius balteatus;
    Richardsonius egregius;
    Gila bicolor;
    Gila atraria;
    Gila robusta;
    Gila intermedia;
    Gila nigra;
    Gila cypha;
    Gila elegans
  `, [], 70);

  riviervissen(`
    Amerikaanse lepelsteur=Polyodon spathula;
    Scaphirhynchus albus;
    Scaphirhynchus platorynchus;
    Scaphirhynchus suttkusi;
    Acipenser fulvescens;
    Acipenser brevirostrum;
    Acipenser oxyrinchus;
    Acipenser transmontanus;
    Acipenser medirostris;
    Oncorhynchus tshawytscha=Chinookzalm;
    Oncorhynchus kisutch=Cohozalm;
    Oncorhynchus keta=Chumzalm;
    Oncorhynchus gorbuscha=Roze zalm;
    Oncorhynchus nerka=Rode zalm;
    Oncorhynchus clarkii;
    Oncorhynchus aguabonita;
    Oncorhynchus apache;
    Oncorhynchus gilae;
    Salvelinus confluentus;
    Salvelinus malma;
    Thymallus arcticus;
    Prosopium williamsoni;
    Prosopium cylindraceum;
    Prosopium coulterii;
    Hiodon alosoides;
    Hiodon tergisus;
    Erimystax dissimilis;
    Erimystax hypsinotus;
    Erimystax insignis;
    Erimystax harryi;
    Campostoma anomalum;
    Campostoma oligolepis;
    Campostoma pauciradii;
    Campostoma pullum;
    Campostoma ornatum;
    Nocomis biguttatus;
    Nocomis leptocephalus;
    Nocomis micropogon;
    Nocomis effusus;
    Nocomis platyrhynchus;
    Nocomis asper;
    Nocomis raneyi;
    Rhinichthys cataractae;
    Rhinichthys atratulus;
    Rhinichthys obtusus;
    Rhinichthys osculus;
    Rhinichthys falcatus;
    Rhinichthys umatilla;
    Rhinichthys evermanni;
    Rhinichthys cobitis;
    Luxilus cornutus;
    Luxilus chrysocephalus;
    Luxilus coccogenis;
    Luxilus zonatus;
    Luxilus pilsbryi;
    Luxilus cardinalis;
    Luxilus cerasinus;
    Luxilus albeolus;
    Lythrurus fumeus;
    Lythrurus umbratilis;
    Lythrurus roseipinnis;
    Lythrurus ardens;
    Lythrurus fasciolaris;
    Lythrurus lirus;
    Lythrurus snelsoni;
    Lythrurus bellus;
    Lythrurus atrapiculus
  `, [], 80);

  // ============================================================
  // NOORD-AMERIKAANSE DARTERS
  // ============================================================

  riviervissen(`
    Etheostoma caeruleum;
    Etheostoma blennioides;
    Etheostoma zonale;
    Etheostoma flabellare;
    Etheostoma nigrum;
    Etheostoma olmstedi;
    Etheostoma spectabile;
    Etheostoma stigmaeum;
    Etheostoma squamiceps;
    Etheostoma swaini;
    Etheostoma rupestre;
    Etheostoma radiosum;
    Etheostoma lepidum;
    Etheostoma grahami;
    Etheostoma exile;
    Etheostoma euchir;
    Etheostoma etnieri;
    Etheostoma erizonum;
    Etheostoma duryi;
    Etheostoma ditrema;
    Etheostoma douglasi;
    Etheostoma crossopterum;
    Etheostoma cragini;
    Etheostoma collettei;
    Etheostoma chlorosomum;
    Etheostoma chuckwachatte;
    Etheostoma chermocki;
    Etheostoma cervus;
    Etheostoma camurum;
    Etheostoma burri;
    Etheostoma brevirostrum;
    Etheostoma boschungi;
    Etheostoma bellum;
    Etheostoma barbouri;
    Etheostoma baileyi;
    Etheostoma australe;
    Etheostoma atripinne;
    Etheostoma asprigene;
    Etheostoma artesiae;
    Etheostoma aquali;
    Etheostoma apalachicolae;
    Etheostoma akatulo;
    Etheostoma acuticeps;
    Etheostoma acuppa;
    Etheostoma atrum;
    Etheostoma cinereum;
    Etheostoma coosae;
    Etheostoma cyanoprosopum;
    Etheostoma davisoni;
    Etheostoma edwini;
    Etheostoma fonticola;
    Etheostoma forbesi;
    Etheostoma fricksium;
    Etheostoma fusiforme;
    Etheostoma gracile;
    Etheostoma gutselli;
    Etheostoma histrio;
    Etheostoma hopkinsi;
    Etheostoma inscriptum;
    Etheostoma jessiae;
    Etheostoma jordani;
    Etheostoma juliae;
    Etheostoma kanawhae;
    Etheostoma kennicotti;
    Etheostoma lawrencei;
    Etheostoma lemniscatum;
    Etheostoma longimanum;
    Etheostoma luteovinctum;
    Etheostoma lynceum;
    Etheostoma maculatum;
    Etheostoma mariae;
    Etheostoma microperca;
    Etheostoma minnis;
    Etheostoma moorei;
    Etheostoma neopterum;
    Etheostoma nianguae;
    Etheostoma obeyense;
    Etheostoma occidentale;
    Etheostoma oophylax;
    Etheostoma orientale;
    Etheostoma pallididorsum;
    Etheostoma parvipinne;
    Etheostoma percnurum;
    Etheostoma perlongum;
    Etheostoma phytophilum;
    Etheostoma podostemone;
    Etheostoma proeliare;
    Etheostoma pseudovulatum;
    Etheostoma punctulatum;
    Etheostoma pyrrhogaster;
    Etheostoma rafinesquei;
    Etheostoma raneyi;
    Etheostoma rubrum;
    Etheostoma rufilineatum;
    Etheostoma sagitta;
    Etheostoma saludae;
    Etheostoma sanguifluum;
    Etheostoma scotti;
    Etheostoma segrex;
    Etheostoma sellare;
    Etheostoma sequatchiense;
    Etheostoma serrifer;
    Etheostoma simoterum;
    Etheostoma smithi;
    Etheostoma spilotum;
    Etheostoma stepheni;
    Etheostoma striatulum;
    Etheostoma susanae;
    Etheostoma tallapoosae;
    Etheostoma tecumsehi;
    Etheostoma tetrazonum;
    Etheostoma thalassinum;
    Etheostoma tippecanoe;
    Etheostoma trisella;
    Etheostoma tuscumbia;
    Etheostoma variatum;
    Etheostoma virgatum;
    Etheostoma vitreum;
    Etheostoma vulneratum;
    Etheostoma wapiti;
    Etheostoma whipplei;
    Etheostoma whitetail;
    Etheostoma zonifer
  `, [7,21], 90);

  riviervissen(`
    Percina caprodes;
    Percina maculata;
    Percina phoxocephala;
    Percina sciera;
    Percina shumardi;
    Percina nigrofasciata;
    Percina austroperca;
    Percina aurantiaca;
    Percina aurora;
    Percina antesella;
    Percina apristis;
    Percina brevicauda;
    Percina burtoni;
    Percina carbonaria;
    Percina copelandi;
    Percina crassa;
    Percina crypta;
    Percina cymatotaenia;
    Percina evides;
    Percina fulvitaenia;
    Percina gymnocephala;
    Percina jenkinsi;
    Percina kathae;
    Percina kusha;
    Percina lenticula;
    Percina macrocephala;
    Percina nasuta;
    Percina notogramma;
    Percina oxyrhynchus;
    Percina palmaris;
    Percina pantherina;
    Percina peltata;
    Percina rex;
    Percina roanoka;
    Percina sipsi;
    Percina squamata;
    Percina stictogaster;
    Percina tanasi;
    Percina uranidea;
    Ammocrypta beanii;
    Ammocrypta bifascia;
    Ammocrypta clara;
    Ammocrypta meridiana;
    Ammocrypta pellucida;
    Ammocrypta vivax;
    Crystallaria asprella;
    Crystallaria cincotta
  `, [7,21], 90);

  // ============================================================
  // ZUID-AMERIKAANSE RIVIERVISSEN
  // ============================================================

  riviervissen(`
    Arapaima=Arapaima gigas;
    Zilveren arowana=Osteoglossum bicirrhosum;
    Zwarte arowana=Osteoglossum ferreirai;
    Elektrische aal=Electrophorus electricus;
    Electrophorus voltai;
    Electrophorus varii;
    Rode piranha=Pygocentrus nattereri;
    Zwarte piranha=Serrasalmus rhombeus;
    Pygocentrus cariba;
    Pygocentrus piraya;
    Serrasalmus elongatus;
    Serrasalmus compressus;
    Serrasalmus eigenmanni;
    Serrasalmus geryi;
    Serrasalmus gibbus;
    Serrasalmus gouldingi;
    Serrasalmus hastatus;
    Serrasalmus hollandi;
    Serrasalmus humeralis;
    Serrasalmus irritans;
    Serrasalmus maculatus;
    Serrasalmus manueli;
    Serrasalmus marginatus;
    Serrasalmus medinai;
    Serrasalmus nalseni;
    Serrasalmus neveriensis;
    Serrasalmus odyssei;
    Serrasalmus sanchezi;
    Serrasalmus serrulatus;
    Serrasalmus spilopleura;
    Serrasalmus stagnatilis;
    Serrasalmus undulatus;
    Tambaqui=Colossoma macropomum;
    Rode pacu=Piaractus brachypomus;
    Piaractus mesopotamicus;
    Piaractus orinoquensis;
    Mylossoma aureum;
    Mylossoma duriventre;
    Mylossoma albiscopum;
    Mylossoma unimaculatum;
    Metynnis argenteus;
    Metynnis hypsauchen;
    Metynnis maculatus;
    Metynnis lippincottianus;
    Metynnis altidorsalis;
    Metynnis anisurus;
    Metynnis cuiaba;
    Metynnis fasciatus;
    Metynnis guaporensis;
    Metynnis longipinnis;
    Metynnis luna;
    Metynnis mola;
    Metynnis orinocensis;
    Metynnis otuquensis;
    Metynnis polystictus;
    Myleus setiger;
    Myloplus asterias;
    Myloplus rubripinnis;
    Myloplus schomburgkii;
    Myloplus tiete;
    Myloplus torquatus;
    Myloplus ternetzi;
    Myloplus lobatus;
    Myloplus arnoldi;
    Myloplus planquettei;
    Myloplus rhomboidalis;
    Myloplus zorroi;
    Tometes trilobatus;
    Tometes lebaili;
    Tometes makue;
    Tometes camunani;
    Tometes ancylorhynchus;
    Tometes kranponhah;
    Mylesinus paraschomburgkii;
    Mylesinus paucisquamatus;
    Mylesinus schomburgkii;
    Acnodon oligacanthus;
    Acnodon normani;
    Acnodon senai;
    Catoprion mento;
    Pristobrycon calmoni;
    Pristobrycon careospinus;
    Pristobrycon striolatus;
    Pygopristis denticulata
  `, [], 80);

  // ============================================================
  // AMAZONE-MEERVALLEN
  // ============================================================

  riviervissen(`
    Roodstaartmeerval=Phractocephalus hemioliopterus;
    Brachyplatystoma filamentosum;
    Brachyplatystoma rousseauxii;
    Brachyplatystoma vaillantii;
    Brachyplatystoma platynemum;
    Brachyplatystoma juruense;
    Brachyplatystoma tigrinum;
    Brachyplatystoma capapretum;
    Pseudoplatystoma fasciatum;
    Pseudoplatystoma tigrinum;
    Pseudoplatystoma corruscans;
    Pseudoplatystoma punctifer;
    Pseudoplatystoma reticulatum;
    Pseudoplatystoma magdaleniatum;
    Pseudoplatystoma metaense;
    Pseudoplatystoma orinocoense;
    Sorubim lima;
    Sorubim elongatus;
    Sorubim maniradii;
    Sorubim cuspicaudus;
    Sorubim trigonocephalus;
    Sorubimichthys planiceps;
    Zungaro zungaro;
    Zungaro jahu;
    Hemisorubim platyrhynchos;
    Pinirampus pirinampu;
    Calophysus macropterus;
    Leiarius marmoratus;
    Leiarius pictus;
    Leiarius perruno;
    Pimelodus pictus;
    Pimelodus blochii;
    Pimelodus maculatus;
    Pimelodus ornatus;
    Pimelodus albicans;
    Pimelodus argenteus;
    Pimelodus atrobrunneus;
    Pimelodus australis;
    Pimelodus britskii;
    Pimelodus fur;
    Pimelodus grosskopfii;
    Pimelodus heraldoi;
    Pimelodus jivaro;
    Pimelodus mysteriosus;
    Pimelodus navarroi;
    Pimelodus ortmanni;
    Pimelodus paranaensis;
    Pimelodus pohli;
    Pimelodus solarii;
    Pimelodus stewarti;
    Pimelodus tetramerus;
    Pimelodus yuma;
    Pimelodella gracilis;
    Pimelodella cristata;
    Pimelodella chagresi;
    Pimelodella lateristriga;
    Pimelodella meeki;
    Pimelodella vittata;
    Pimelodella australis;
    Pimelodella avanhandavae;
    Pimelodella boliviana;
    Pimelodella boschmai;
    Pimelodella brasiliensis;
    Pimelodella breviceps;
    Pimelodella cruxenti;
    Pimelodella eigenmanni;
    Pimelodella elongata;
    Pimelodella enochi;
    Pimelodella harttii;
    Pimelodella howesi;
    Pimelodella kronei;
    Pimelodella laticeps;
    Pimelodella leptus;
    Pimelodella linami;
    Pimelodella longipinnis;
    Pimelodella macrocephala;
    Pimelodella macturki;
    Pimelodella maricopa;
    Pimelodella mucosa;
    Pimelodella notomelas;
    Pimelodella odynea;
    Pimelodella ophthalmica;
    Pimelodella papariae;
    Pimelodella pappenheimi;
    Pimelodella parnahybae;
    Pimelodella peruana;
    Pimelodella rudolphi;
    Pimelodella serrata;
    Pimelodella spelaea;
    Pimelodella steindachneri;
    Pimelodella taeniophora;
    Pimelodella transitoria;
    Pimelodella wesselii
  `, [17], 85);

  // ============================================================
  // HARNASMEERVALLEN
  // ============================================================

  riviervissen(`
    Hypostomus plecostomus;
    Hypostomus ancistroides;
    Hypostomus affinis;
    Hypostomus albopunctatus;
    Hypostomus alatus;
    Hypostomus arecuta;
    Hypostomus asperatus;
    Hypostomus auroguttatus;
    Hypostomus boulengeri;
    Hypostomus carinatus;
    Hypostomus cochliodon;
    Hypostomus commersoni;
    Hypostomus cordovae;
    Hypostomus crassicauda;
    Hypostomus derbyi;
    Hypostomus denticulatus;
    Hypostomus faveolus;
    Hypostomus francisci;
    Hypostomus garmani;
    Hypostomus gymnorhynchus;
    Hypostomus hemicochliodon;
    Hypostomus hermanni;
    Hypostomus iheringii;
    Hypostomus interruptus;
    Hypostomus itacua;
    Hypostomus jaguar;
    Hypostomus johnii;
    Hypostomus kronei;
    Hypostomus laplatae;
    Hypostomus latirostris;
    Hypostomus levis;
    Hypostomus lima;
    Hypostomus luteomaculatus;
    Hypostomus luteus;
    Hypostomus macrops;
    Hypostomus macushi;
    Hypostomus margaritifer;
    Hypostomus microstomus;
    Hypostomus mutucae;
    Hypostomus nigromaculatus;
    Hypostomus niger;
    Hypostomus niveatus;
    Hypostomus obtusirostris;
    Hypostomus oculeus;
    Hypostomus paulinus;
    Hypostomus perdido;
    Hypostomus piratatu;
    Hypostomus punctatus;
    Hypostomus pusarum;
    Hypostomus regani;
    Hypostomus robinii;
    Hypostomus roseopunctatus;
    Hypostomus rondoni;
    Hypostomus saramaccensis;
    Hypostomus scabriceps;
    Hypostomus seminudus;
    Hypostomus simios;
    Hypostomus soniae;
    Hypostomus spinosissimus;
    Hypostomus squalinus;
    Hypostomus strigaticeps;
    Hypostomus subcarinatus;
    Hypostomus subviridis;
    Hypostomus superbus;
    Hypostomus tapijara;
    Hypostomus ternetzi;
    Hypostomus topavae;
    Hypostomus uruguayensis;
    Hypostomus variipictus;
    Hypostomus variostictus;
    Hypostomus ventromaculatus;
    Hypostomus watwata;
    Hypostomus weberi;
    Hypostomus winzi;
    Hypostomus wuchereri;
    Pterygoplichthys pardalis;
    Pterygoplichthys disjunctivus;
    Pterygoplichthys gibbiceps;
    Pterygoplichthys multiradiatus;
    Pterygoplichthys joselimaianus;
    Pterygoplichthys anisitsi;
    Pterygoplichthys ambrosettii;
    Pterygoplichthys etentaculatus;
    Pterygoplichthys lituratus;
    Pterygoplichthys punctatus;
    Pterygoplichthys scrophus;
    Pterygoplichthys weberi;
    Pterygoplichthys zuliaensis
  `, [33], 90);

  riviervissen(`
    Ancistrus cirrhosus;
    Ancistrus dolichopterus;
    Ancistrus temminckii;
    Ancistrus triradiatus;
    Ancistrus aguaboensis;
    Ancistrus alga;
    Ancistrus amaris;
    Ancistrus araguaia;
    Ancistrus bolivianus;
    Ancistrus brevifilis;
    Ancistrus brevipinnis;
    Ancistrus bufonius;
    Ancistrus caucanus;
    Ancistrus centrolepis;
    Ancistrus chagresi;
    Ancistrus claro;
    Ancistrus cryptophthalmus;
    Ancistrus cuiabae;
    Ancistrus damasceni;
    Ancistrus deweyae;
    Ancistrus dubius;
    Ancistrus erinaceus;
    Ancistrus eustictus;
    Ancistrus fulvus;
    Ancistrus galani;
    Ancistrus gymnorhynchus;
    Ancistrus heterorhynchus;
    Ancistrus hoplogenys;
    Ancistrus jelskii;
    Ancistrus keratophorus;
    Ancistrus latifrons;
    Ancistrus leucostictus;
    Ancistrus lithurgicus;
    Ancistrus macrophthalmus;
    Ancistrus maculatus;
    Ancistrus malacops;
    Ancistrus marcapatae;
    Ancistrus martini;
    Ancistrus maximus;
    Ancistrus megalostomus;
    Ancistrus melas;
    Ancistrus minutus;
    Ancistrus montanus;
    Ancistrus mullerae;
    Ancistrus multispinis;
    Ancistrus nudiceps;
    Ancistrus occidentalis;
    Ancistrus occloi;
    Ancistrus parecis;
    Ancistrus pirareta;
    Ancistrus piriformis;
    Ancistrus ranunculus;
    Ancistrus reisi;
    Ancistrus salgadae;
    Ancistrus saudades;
    Ancistrus serrochi;
    Ancistrus stigmaticus;
    Ancistrus tamboensis;
    Ancistrus taunayi;
    Ancistrus tolima;
    Ancistrus tombador;
    Ancistrus vericaucanus;
    Ancistrus verecundus;
    Ancistrus yutajae;
    Hypancistrus zebra;
    Hypancistrus inspector;
    Hypancistrus contradens;
    Hypancistrus debilittera;
    Hypancistrus furunculus;
    Hypancistrus lunaorum;
    Peckoltia vittata;
    Peckoltia compta;
    Peckoltia brevis;
    Peckoltia caenosa;
    Peckoltia cavatica;
    Peckoltia furcata;
    Peckoltia greedoi;
    Peckoltia lineola;
    Peckoltia lujani;
    Peckoltia multispinis;
    Peckoltia oligospila;
    Peckoltia otali;
    Peckoltia sabaji;
    Peckoltia simulata;
    Peckoltia vermiculata;
    Panaque nigrolineatus;
    Panaque armbrusteri;
    Panaque bathyphilus;
    Panaque cochliodon;
    Panaque schaeferi;
    Panaque suttonorum;
    Panaqolus albivermis;
    Panaqolus albomaculatus;
    Panaqolus changae;
    Panaqolus dentex;
    Panaqolus gnomus;
    Panaqolus maccus;
    Panaqolus nocturnus;
    Panaqolus purusiensis;
    Panaqolus tankei
  `, [33], 90);

  // ============================================================
  // PANTSERMEERVALLEN
  // ============================================================

  riviervissen(`
    Corydoras aeneus;
    Corydoras paleatus;
    Corydoras panda;
    Corydoras sterbai;
    Corydoras adolfoi;
    Corydoras agassizii;
    Corydoras albolineatus;
    Corydoras amapaensis;
    Corydoras ambiacus;
    Corydoras amandajanea;
    Corydoras approuaguensis;
    Corydoras arcuatus;
    Corydoras armatus;
    Corydoras atropersonatus;
    Corydoras aurofrenatus;
    Corydoras axelrodi;
    Corydoras baderi;
    Corydoras barbatus;
    Corydoras bicolor;
    Corydoras bifasciatus;
    Corydoras bilineatus;
    Corydoras blochi;
    Corydoras boesemani;
    Corydoras bondi;
    Corydoras breei;
    Corydoras brevirostris;
    Corydoras burgessi;
    Corydoras carlae;
    Corydoras caudimaculatus;
    Corydoras cervinus;
    Corydoras concolor;
    Corydoras copei;
    Corydoras coppenamensis;
    Corydoras coriatae;
    Corydoras crimmeni;
    Corydoras crypticus;
    Corydoras davidsandsi;
    Corydoras delphax;
    Corydoras difluviatilis;
    Corydoras diphyes;
    Corydoras duplicareus;
    Corydoras ehrhardti;
    Corydoras elegans;
    Corydoras ellisae;
    Corydoras ephippifer;
    Corydoras eques;
    Corydoras evelynae;
    Corydoras filamentosus;
    Corydoras flaveolus;
    Corydoras fowleri;
    Corydoras garbei;
    Corydoras geoffroy;
    Corydoras geryi;
    Corydoras gossei;
    Corydoras gracilis;
    Corydoras griseus;
    Corydoras guapore;
    Corydoras habrosus;
    Corydoras hastatus;
    Corydoras heteromorphus;
    Corydoras imitator;
    Corydoras incolicana;
    Corydoras isbrueckeri;
    Corydoras julii;
    Corydoras kanei;
    Corydoras lacerdai;
    Corydoras lamberti;
    Corydoras latus;
    Corydoras leopardus;
    Corydoras leucomelas;
    Corydoras longipinnis;
    Corydoras loretoensis;
    Corydoras loxozonus;
    Corydoras macrosteus;
    Corydoras maculifer;
    Corydoras mamore;
    Corydoras marthae;
    Corydoras melanistius;
    Corydoras melini;
    Corydoras metae;
    Corydoras micracanthus;
    Corydoras multimaculatus;
    Corydoras nanus;
    Corydoras napoensis;
    Corydoras narcissus;
    Corydoras negro;
    Corydoras nijsseni;
    Corydoras nattereri;
    Corydoras oiapoquensis;
    Corydoras ornatus;
    Corydoras orphnopterus;
    Corydoras ourastigma;
    Corydoras oxyrhynchus;
    Corydoras pantanalensis;
    Corydoras paragua;
    Corydoras parallelus;
    Corydoras pastazensis;
    Corydoras paucerna;
    Corydoras pinheiroi;
    Corydoras polystictus;
    Corydoras potaroensis;
    Corydoras pulcher;
    Corydoras punctatus;
    Corydoras pygmaeus;
    Corydoras rabauti;
    Corydoras reticulatus;
    Corydoras reynoldsi;
    Corydoras robineae;
    Corydoras robustus;
    Corydoras sanchesi;
    Corydoras saramaccensis;
    Corydoras schwartzi;
    Corydoras semiaquilus;
    Corydoras seussi;
    Corydoras similis;
    Corydoras sipaliwini;
    Corydoras sodalis;
    Corydoras solox;
    Corydoras stenocephalus;
    Corydoras surinamensis;
    Corydoras sychri;
    Corydoras treitlii;
    Corydoras trilineatus;
    Corydoras tukano;
    Corydoras undulatus;
    Corydoras virginiae;
    Corydoras weitzmani;
    Corydoras xinguensis;
    Corydoras zygatus;
    Brochis splendens;
    Brochis britskii;
    Brochis multiradiatus;
    Callichthys callichthys;
    Callichthys fabricioi;
    Callichthys oibaensis;
    Callichthys serralabium;
    Hoplosternum littorale;
    Hoplosternum magdalenae;
    Hoplosternum punctatum;
    Megalechis thoracata;
    Megalechis picta;
    Lepthoplosternum altamazonicum;
    Lepthoplosternum beni;
    Lepthoplosternum pectorale;
    Lepthoplosternum stellatum;
    Lepthoplosternum tordilho;
    Lepthoplosternum ucamara
  `, [7,33], 85);

  // ============================================================
  // TETRA'S EN KARPERZALMEN
  // ============================================================

  riviervissen(`
    Neontetra=Paracheirodon innesi;
    Kardinaaltetra=Paracheirodon axelrodi;
    Groene neontetra=Paracheirodon simulans;
    Roodneuszalm=Petitella bleheri;
    Petitella georgiae;
    Petitella rhodostoma;
    Rouwtetra=Gymnocorymbus ternetzi;
    Gymnocorymbus thayeri;
    Gymnocorymbus bondi;
    Gymnocorymbus flaviolimai;
    Citroentetra=Hyphessobrycon pulchripinnis;
    Vuurneon=Hyphessobrycon amandae;
    Zwarte neon=Hyphessobrycon herbertaxelrodi;
    Hyphessobrycon eques;
    Hyphessobrycon bentosi;
    Hyphessobrycon rosaceus;
    Hyphessobrycon erythrostigma;
    Hyphessobrycon megalopterus;
    Hyphessobrycon sweglesi;
    Hyphessobrycon flammeus;
    Hyphessobrycon colombianus;
    Hyphessobrycon anisitsi;
    Hyphessobrycon bifasciatus;
    Hyphessobrycon agulha;
    Hyphessobrycon amapaensis;
    Hyphessobrycon auca;
    Hyphessobrycon balbus;
    Hyphessobrycon borealis;
    Hyphessobrycon cachimbensis;
    Hyphessobrycon catableptus;
    Hyphessobrycon copelandi;
    Hyphessobrycon diancistrus;
    Hyphessobrycon duragenys;
    Hyphessobrycon eilyos;
    Hyphessobrycon elachys;
    Hyphessobrycon epicharis;
    Hyphessobrycon ecuadoriensis;
    Hyphessobrycon eschwartzae;
    Hyphessobrycon fennelli;
    Hyphessobrycon georgettae;
    Hyphessobrycon geryi;
    Hyphessobrycon gracilior;
    Hyphessobrycon guarani;
    Hyphessobrycon heliacus;
    Hyphessobrycon heterorhabdus;
    Hyphessobrycon hexastichos;
    Hyphessobrycon igneus;
    Hyphessobrycon inconstans;
    Hyphessobrycon isiri;
    Hyphessobrycon itaparicensis;
    Hyphessobrycon langeanii;
    Hyphessobrycon loretoensis;
    Hyphessobrycon loweae;
    Hyphessobrycon luetkenii;
    Hyphessobrycon maculicauda;
    Hyphessobrycon melanostichos;
    Hyphessobrycon melazonatus;
    Hyphessobrycon metae;
    Hyphessobrycon micropterus;
    Hyphessobrycon minimus;
    Hyphessobrycon minor;
    Hyphessobrycon moniliger;
    Hyphessobrycon muellerae;
    Hyphessobrycon nicolasi;
    Hyphessobrycon nigricinctus;
    Hyphessobrycon notidanos;
    Hyphessobrycon ocasoensis;
    Hyphessobrycon oritoensis;
    Hyphessobrycon otrynus;
    Hyphessobrycon panamensis;
    Hyphessobrycon parvellus;
    Hyphessobrycon paucilepis;
    Hyphessobrycon peruvianus;
    Hyphessobrycon petricolus;
    Hyphessobrycon piabinhas;
    Hyphessobrycon poecilioides;
    Hyphessobrycon procerus;
    Hyphessobrycon proteus;
    Hyphessobrycon pulcherrimus;
    Hyphessobrycon pytai;
    Hyphessobrycon reticulatus;
    Hyphessobrycon robustulus;
    Hyphessobrycon rutiliflavidus;
    Hyphessobrycon santae;
    Hyphessobrycon saizi;
    Hyphessobrycon savagei;
    Hyphessobrycon socolofi;
    Hyphessobrycon stegemanni;
    Hyphessobrycon stramineus;
    Hyphessobrycon takasei;
    Hyphessobrycon taphorni;
    Hyphessobrycon tenuis;
    Hyphessobrycon tropis;
    Hyphessobrycon tuyensis;
    Hyphessobrycon uruguayensis;
    Hyphessobrycon vilmae;
    Hyphessobrycon wajat;
    Hyphessobrycon weitzmanorum
  `, [7,21], 85);

  riviervissen(`
    Hemigrammus ocellifer;
    Hemigrammus erythrozonus;
    Hemigrammus rodwayi;
    Hemigrammus pulcher;
    Hemigrammus unilineatus;
    Hemigrammus hyanuary;
    Hemigrammus armstrongi;
    Hemigrammus ataktos;
    Hemigrammus barrigonae;
    Hemigrammus bellottii;
    Hemigrammus boesemani;
    Hemigrammus brevis;
    Hemigrammus coeruleus;
    Hemigrammus cupreus;
    Hemigrammus cylindricus;
    Hemigrammus elegans;
    Hemigrammus filamentosus;
    Hemigrammus geryi;
    Hemigrammus gracilis;
    Hemigrammus guyanensis;
    Hemigrammus haraldi;
    Hemigrammus iota;
    Hemigrammus levis;
    Hemigrammus luelingi;
    Hemigrammus lunatus;
    Hemigrammus machadoi;
    Hemigrammus mahnerti;
    Hemigrammus marginatus;
    Hemigrammus matei;
    Hemigrammus maxillaris;
    Hemigrammus megaceps;
    Hemigrammus melanochrous;
    Hemigrammus microstomus;
    Hemigrammus micropterus;
    Hemigrammus neptunus;
    Hemigrammus newboldi;
    Hemigrammus oellifer;
    Hemigrammus ora;
    Hemigrammus orthus;
    Hemigrammus parana;
    Hemigrammus parvus;
    Hemigrammus pretoensis;
    Hemigrammus rhodopterus;
    Hemigrammus schmardae;
    Hemigrammus silimoni;
    Hemigrammus skolioplatus;
    Hemigrammus stictus;
    Hemigrammus taphorni;
    Hemigrammus tocantinsi;
    Hemigrammus tridens;
    Hemigrammus ulreyi;
    Hemigrammus vorderwinkleri;
    Hemigrammus yinyang;
    Pristella maxillaris;
    Aphyocharax anisitsi;
    Aphyocharax alburnus;
    Aphyocharax dentatus;
    Aphyocharax paraguayensis;
    Aphyocharax pusillus;
    Aphyocharax rathbuni;
    Aphyocharax nattereri;
    Aphyocharax erythrurus;
    Aphyocharax gracilis;
    Moenkhausia sanctaefilomenae;
    Moenkhausia pittieri;
    Moenkhausia oligolepis;
    Moenkhausia dichroura;
    Moenkhausia lepidura;
    Moenkhausia intermedia;
    Moenkhausia agnesae;
    Moenkhausia bonita;
    Moenkhausia celibela;
    Moenkhausia ceros;
    Moenkhausia chlorophthalma;
    Moenkhausia collettii;
    Moenkhausia comma;
    Moenkhausia copei;
    Moenkhausia cotinho;
    Moenkhausia dasalmas;
    Moenkhausia diamantina;
    Moenkhausia dorsinuda;
    Moenkhausia eigenmanni;
    Moenkhausia eurystaenia;
    Moenkhausia forestii;
    Moenkhausia georgiae;
    Moenkhausia gracilima;
    Moenkhausia grandisquamis;
    Moenkhausia hasemani;
    Moenkhausia heikoi;
    Moenkhausia hemigrammoides;
    Moenkhausia hysterosticta;
    Moenkhausia icae;
    Moenkhausia inrai;
    Moenkhausia jamesi;
    Moenkhausia justae;
    Moenkhausia lata;
    Moenkhausia latissima;
    Moenkhausia lopesi;
    Moenkhausia loweae;
    Moenkhausia margitae;
    Moenkhausia megalops;
    Moenkhausia melogramma;
    Moenkhausia metae;
    Moenkhausia miangi;
    Moenkhausia mikia;
    Moenkhausia moisae;
    Moenkhausia naponis;
    Moenkhausia newtoni;
    Moenkhausia nigromarginata;
    Moenkhausia nigrifasciata;
    Moenkhausia oblonga;
    Moenkhausia orteguasae;
    Moenkhausia pirauba;
    Moenkhausia pyrophthalma;
    Moenkhausia rara;
    Moenkhausia robertsi;
    Moenkhausia rubra;
    Moenkhausia sthenosthoma;
    Moenkhausia surinamensis;
    Moenkhausia takasei;
    Moenkhausia tergimacula;
    Moenkhausia tridentata;
    Moenkhausia venerei;
    Moenkhausia xinguensis;
    Moenkhausia zoo
  `, [7,21], 85);

  // ============================================================
  // POTLOODVISSEN EN BIJLZALMEN
  // ============================================================

  riviervissen(`
    Nannostomus beckfordi;
    Nannostomus marginatus;
    Nannostomus eques;
    Nannostomus unifasciatus;
    Nannostomus mortenthaleri;
    Nannostomus rubrocaudatus;
    Nannostomus trifasciatus;
    Nannostomus anduzei;
    Nannostomus britskii;
    Nannostomus digrammus;
    Nannostomus erythrurus;
    Nannostomus espei;
    Nannostomus grandis;
    Nannostomus harrisoni;
    Nannostomus limatus;
    Nannostomus marilynae;
    Nannostomus minimus;
    Nannostomus nitidus;
    Nannostomus rossi;
    Nannostomus taphorni;
    Carnegiella strigata;
    Carnegiella marthae;
    Carnegiella myersi;
    Gasteropelecus sternicla;
    Gasteropelecus levis;
    Gasteropelecus maculatus;
    Thoracocharax securis;
    Thoracocharax stellatus;
    Copella arnoldi;
    Copella carsevennensis;
    Copella eigenmanni;
    Copella meinkeni;
    Copella nattereri;
    Copella vilmae;
    Pyrrhulina australis;
    Pyrrhulina brevis;
    Pyrrhulina eleanorae;
    Pyrrhulina filamentosa;
    Pyrrhulina laeta;
    Pyrrhulina lugubris;
    Pyrrhulina marilynae;
    Pyrrhulina maxima;
    Pyrrhulina obermulleri;
    Pyrrhulina rachoviana;
    Pyrrhulina semifasciata;
    Pyrrhulina spilota;
    Pyrrhulina stoli;
    Pyrrhulina vittata;
    Lebiasina bimaculata;
    Lebiasina boruca;
    Lebiasina chocoensis;
    Lebiasina erythrinoides;
    Lebiasina festae;
    Lebiasina multimaculata;
    Lebiasina panamensis;
    Lebiasina pleurotaenia
  `, [7,21], 85);

  // ============================================================
  // ZUID-AMERIKAANSE CICHLIDEN
  // ============================================================

  riviervissen(`
    Maanvis=Pterophyllum scalare;
    Pterophyllum altum;
    Pterophyllum leopoldi;
    Symphysodon discus;
    Symphysodon aequifasciatus;
    Symphysodon tarzoo;
    Pauwoogcichlide=Astronotus ocellatus;
    Astronotus crassipinnis;
    Apistogramma agassizii;
    Apistogramma cacatuoides;
    Apistogramma borellii;
    Apistogramma trifasciata;
    Apistogramma hongsloi;
    Apistogramma macmasteri;
    Apistogramma panduro;
    Apistogramma nijsseni;
    Apistogramma baenschi;
    Apistogramma bitaeniata;
    Apistogramma viejita;
    Apistogramma elizabethae;
    Apistogramma abacaxis;
    Apistogramma acrensis;
    Apistogramma alacrina;
    Apistogramma allpahuayo;
    Apistogramma alphacrata;
    Apistogramma angayuara;
    Apistogramma arua;
    Apistogramma atahualpa;
    Apistogramma barlowi;
    Apistogramma barcinona;
    Apistogramma bitaeniata;
    Apistogramma brevis;
    Apistogramma caetei;
    Apistogramma candidi;
    Apistogramma cinilabra;
    Apistogramma commbrae;
    Apistogramma cruzi;
    Apistogramma diplotaenia;
    Apistogramma eleutheria;
    Apistogramma eremnopyge;
    Apistogramma eunotus;
    Apistogramma feconat;
    Apistogramma flabellicauda;
    Apistogramma gephyra;
    Apistogramma gibbiceps;
    Apistogramma gossei;
    Apistogramma guttata;
    Apistogramma helkeri;
    Apistogramma hippolytae;
    Apistogramma hoignei;
    Apistogramma huascar;
    Apistogramma inconspicua;
    Apistogramma iniridae;
    Apistogramma intermedia;
    Apistogramma irinae;
    Apistogramma juruensis;
    Apistogramma luelingi;
    Apistogramma martini;
    Apistogramma megaptera;
    Apistogramma meinkeni;
    Apistogramma mendezi;
    Apistogramma minima;
    Apistogramma moae;
    Apistogramma noberti;
    Apistogramma nororientalis;
    Apistogramma ortegai;
    Apistogramma ostium;
    Apistogramma paucisquamis;
    Apistogramma payaminonis;
    Apistogramma pedunculata;
    Apistogramma personata;
    Apistogramma piaroa;
    Apistogramma piauiensis;
    Apistogramma pulchra;
    Apistogramma regani;
    Apistogramma resticulosa;
    Apistogramma rositae;
    Apistogramma rubrolineata;
    Apistogramma rupununi;
    Apistogramma salpinction;
    Apistogramma similis;
    Apistogramma sororcula;
    Apistogramma staecki;
    Apistogramma steindachneri;
    Apistogramma taeniata;
    Apistogramma tucurui;
    Apistogramma uaupesi;
    Apistogramma urteagai;
    Apistogramma velifera;
    Apistogramma wapisana;
    Mikrogeophagus ramirezi;
    Mikrogeophagus altispinosus;
    Laetacara dorsigera;
    Laetacara curviceps;
    Laetacara araguaiae;
    Laetacara flavilabris;
    Laetacara fulvipinnis;
    Laetacara thayeri;
    Laetacara flamannellus;
    Aequidens tetramerus;
    Aequidens metae;
    Aequidens diadema;
    Aequidens pallidus;
    Aequidens plagiozonatus;
    Aequidens potaroensis;
    Aequidens rondoni;
    Aequidens tubicen;
    Aequidens viridis;
    Aequidens patricki;
    Aequidens chimantanus;
    Aequidens mauesanus;
    Andinoacara pulcher;
    Andinoacara rivulatus;
    Andinoacara aequinoctialis;
    Andinoacara biseriatus;
    Andinoacara coeruleopunctatus;
    Andinoacara latifrons;
    Andinoacara sapayensis;
    Andinoacara stalsbergi
  `, [7,21], 80);

  riviervissen(`
    Geophagus altifrons;
    Geophagus surinamensis;
    Geophagus abalios;
    Geophagus argyrostictus;
    Geophagus brachybranchus;
    Geophagus brokopondo;
    Geophagus camopiensis;
    Geophagus crocatus;
    Geophagus dicrozoster;
    Geophagus grammepareius;
    Geophagus harreri;
    Geophagus humeralis;
    Geophagus megasema;
    Geophagus neambi;
    Geophagus parnaibae;
    Geophagus proximus;
    Geophagus sveni;
    Geophagus taeniopareius;
    Geophagus winemilleri;
    Gymnogeophagus balzanii;
    Gymnogeophagus australis;
    Gymnogeophagus caaguazuensis;
    Gymnogeophagus gymnogenys;
    Gymnogeophagus labiatus;
    Gymnogeophagus lacustris;
    Gymnogeophagus meridionalis;
    Gymnogeophagus rhabdotus;
    Gymnogeophagus setequedas;
    Gymnogeophagus tiraparae;
    Gymnogeophagus pseudolabiatus;
    Gymnogeophagus mekinos;
    Gymnogeophagus missioneiro;
    Satanoperca jurupari;
    Satanoperca daemon;
    Satanoperca acuticeps;
    Satanoperca leucosticta;
    Satanoperca lilith;
    Satanoperca mapiritensis;
    Satanoperca pappaterra;
    Satanoperca rhynchitis;
    Biotodoma cupido;
    Biotodoma wavrini;
    Biotoecus opercularis;
    Biotoecus dicentrarchus;
    Dicrossus filamentosus;
    Dicrossus maculatus;
    Dicrossus foirni;
    Dicrossus gladicauda;
    Dicrossus warzeli;
    Crenicara punctulatum;
    Crenicara latruncularium;
    Guianacara geayi;
    Guianacara owroewefi;
    Guianacara stergiosi;
    Guianacara sphenozona;
    Guianacara cuyunii;
    Guianacara dacrya;
    Guianacara oelemariensis;
    Cichla ocellaris;
    Cichla temensis;
    Cichla monoculus;
    Cichla orinocensis;
    Cichla intermedia;
    Cichla kelberi;
    Cichla piquiti;
    Cichla pleiozona;
    Cichla melaniae;
    Cichla mirianae;
    Cichla jariina;
    Cichla pinima;
    Cichla thyrorus;
    Cichla vazzoleri;
    Cichla nigromaculata
  `, [7,21], 85);

  // ============================================================
  // ZUID-AMERIKAANSE ZOETWATERROGGEN
  // ============================================================

  rivierdieren(`
    Potamotrygon motoro;
    Potamotrygon leopoldi;
    Potamotrygon henlei;
    Potamotrygon falkneri;
    Potamotrygon orbignyi;
    Potamotrygon reticulata;
    Potamotrygon scobina;
    Potamotrygon aiereba;
    Potamotrygon albimaculata;
    Potamotrygon boesemani;
    Potamotrygon brachyura;
    Potamotrygon constellata;
    Potamotrygon fschroederi;
    Potamotrygon histrix;
    Potamotrygon humerosa;
    Potamotrygon limai;
    Potamotrygon magdalenae;
    Potamotrygon marinae;
    Potamotrygon marquesi;
    Potamotrygon ocellata;
    Potamotrygon pantanensis;
    Potamotrygon schuhmacheri;
    Potamotrygon signata;
    Potamotrygon tatianae;
    Potamotrygon tigrina;
    Potamotrygon wallacei;
    Potamotrygon yepezi;
    Paratrygon aiereba;
    Plesiotrygon iwamae;
    Plesiotrygon nana;
    Heliotrygon gomesi;
    Heliotrygon rosai
  `, [14,17,18,45], 85);

  // ============================================================
  // AFRIKAANSE RIVIERVISSEN
  // ============================================================

  riviervissen(`
    Nijlbaars=Lates niloticus;
    Nijlsnoek=Gymnarchus niloticus;
    Afrikaanse longvis=Protopterus annectens;
    Protopterus aethiopicus;
    Protopterus amphibius;
    Protopterus dolloi;
    Afrikaanse tijgervis=Hydrocynus vittatus;
    Goliathtijgervis=Hydrocynus goliath;
    Hydrocynus brevis;
    Hydrocynus forskahlii;
    Hydrocynus tanzaniae;
    Afrikaanse meerval=Clarias gariepinus;
    Clarias anguillaris;
    Clarias batrachus;
    Clarias alluaudi;
    Clarias buettikoferi;
    Clarias camerunensis;
    Clarias ebriensis;
    Clarias gabonensis;
    Clarias jaensis;
    Clarias liocephalus;
    Clarias maclareni;
    Clarias meladerma;
    Clarias microstomus;
    Clarias ngamensis;
    Clarias pachynema;
    Clarias platycephalus;
    Clarias salae;
    Clarias theodorae;
    Clarias werneri;
    Heterobranchus bidorsalis;
    Heterobranchus longifilis;
    Heterobranchus isopterus;
    Heterobranchus boulengeri;
    Malapterurus electricus;
    Malapterurus beninensis;
    Malapterurus cavalliensis;
    Malapterurus microstoma;
    Malapterurus minjiriya;
    Malapterurus monsembeensis;
    Malapterurus oguensis;
    Malapterurus punctatus;
    Malapterurus shirensis;
    Malapterurus tanensis;
    Malapterurus tanoensis;
    Malapterurus teugelsi;
    Synodontis angelicus;
    Synodontis eupterus;
    Synodontis schall;
    Synodontis batensoda;
    Synodontis membranaceus;
    Synodontis nigrita;
    Synodontis ocellifer;
    Synodontis petricola;
    Synodontis sorex;
    Synodontis clarias;
    Synodontis budgetti;
    Synodontis caudalis;
    Synodontis depauwi;
    Synodontis decorus;
    Synodontis flavitaeniatus;
    Synodontis gambiensis;
    Synodontis guttatus;
    Synodontis leopardinus;
    Synodontis longirostris;
    Synodontis macropunctatus;
    Synodontis macrostigma;
    Synodontis melanostictus;
    Synodontis nigromaculatus;
    Synodontis notatus;
    Synodontis obesus;
    Synodontis ornatipinnis;
    Synodontis pardalis;
    Synodontis pleurops;
    Synodontis polli;
    Synodontis rebeli;
    Synodontis resupinatus;
    Synodontis robertsi;
    Synodontis robbianus;
    Synodontis rukwaensis;
    Synodontis serratus;
    Synodontis smiti;
    Synodontis soloni;
    Synodontis tessmanni;
    Synodontis thamalakanensis;
    Synodontis unicolor;
    Synodontis vaillanti;
    Synodontis vermiculatus;
    Synodontis victoriae;
    Synodontis violaceus;
    Synodontis waterloti;
    Synodontis xiphias;
    Synodontis zambezensis
  `, [], 80);

  // ============================================================
  // AFRIKAANSE OLIFANTSVISSEN
  // ============================================================

  riviervissen(`
    Gnathonemus petersii;
    Gnathonemus echidnorhynchus;
    Gnathonemus longibarbis;
    Gnathonemus tamandua;
    Campylomormyrus compressirostris;
    Campylomormyrus elephas;
    Campylomormyrus curvirostris;
    Campylomormyrus alces;
    Campylomormyrus bredoi;
    Campylomormyrus cassaicus;
    Campylomormyrus christyi;
    Campylomormyrus numenius;
    Campylomormyrus orycteropus;
    Campylomormyrus phantasticus;
    Campylomormyrus rhynchophorus;
    Campylomormyrus tamandua;
    Campylomormyrus tshokwe;
    Mormyrus kannume;
    Mormyrus caschive;
    Mormyrus rume;
    Mormyrus tapirus;
    Mormyrus longirostris;
    Mormyrus lacerda;
    Mormyrus hasselquistii;
    Mormyrus niloticus;
    Mormyrus caballus;
    Mormyrus macrophthalmus;
    Mormyrus tenuirostris;
    Mormyrops anguilloides;
    Mormyrops caballus;
    Mormyrops curviceps;
    Mormyrops engystoma;
    Mormyrops furcidens;
    Mormyrops lineolatus;
    Mormyrops masuianus;
    Mormyrops microstoma;
    Mormyrops nigricans;
    Mormyrops parvus;
    Mormyrops sirenoides;
    Marcusenius senegalensis;
    Marcusenius macrolepidotus;
    Marcusenius moorii;
    Marcusenius mento;
    Marcusenius abadii;
    Marcusenius altisambesi;
    Marcusenius angolensis;
    Marcusenius brucii;
    Marcusenius conicephalus;
    Marcusenius cuangoanus;
    Marcusenius cyprinoides;
    Marcusenius desertus;
    Marcusenius dundoensis;
    Marcusenius friteli;
    Marcusenius furcidens;
    Marcusenius greshoffii;
    Marcusenius ihuysi;
    Marcusenius intermedius;
    Marcusenius kaninginii;
    Marcusenius krameri;
    Marcusenius leopoldianus;
    Marcusenius livingstonii;
    Marcusenius lucombesi;
    Marcusenius meronai;
    Marcusenius monteiri;
    Marcusenius multisquamatus;
    Marcusenius ntemensis;
    Marcusenius nyasensis;
    Marcusenius pongolensis;
    Marcusenius rheni;
    Marcusenius sanagaensis;
    Marcusenius schilthuisiae;
    Marcusenius stanleyanus;
    Marcusenius thomasi;
    Marcusenius ussheri;
    Marcusenius victoriae;
    Marcusenius wilverthi;
    Petrocephalus bovei;
    Petrocephalus catostoma;
    Petrocephalus microphthalmus;
    Petrocephalus soudanensis;
    Petrocephalus simus;
    Petrocephalus tenuicauda;
    Petrocephalus balayi;
    Petrocephalus binotatus;
    Petrocephalus christyi;
    Petrocephalus grandoculis;
    Petrocephalus haullevillii;
    Petrocephalus keatingii;
    Petrocephalus levequei;
    Petrocephalus longicapitis;
    Petrocephalus magnoculis;
    Petrocephalus pulsivertens;
    Petrocephalus sauvagii;
    Petrocephalus squalostoma;
    Petrocephalus zakoni
  `, [21], 90);

  // ============================================================
  // AFRIKAANSE KWASTSNOEKEN
  // ============================================================

  rivierEnMeerVissen(`
    Polypterus senegalus;
    Polypterus bichir;
    Polypterus endlicherii;
    Polypterus congicus;
    Polypterus delhezi;
    Polypterus ornatipinnis;
    Polypterus palmas;
    Polypterus polli;
    Polypterus retropinnis;
    Polypterus teugelsi;
    Polypterus weeksii;
    Polypterus ansorgii;
    Polypterus mokelembembe;
    Erpetoichthys calabaricus
  `, [17,21], 75);

  // ============================================================
  // AFRIKAANSE KARPERACHTIGEN
  // ============================================================

  riviervissen(`
    Labeo coubie;
    Labeo senegalensis;
    Labeo niloticus;
    Labeo horie;
    Labeo cylindricus;
    Labeo molybdinus;
    Labeo altivelis;
    Labeo congoro;
    Labeo ruddi;
    Labeo rosae;
    Labeo umbratus;
    Labeo capensis;
    Labeo seeberi;
    Labeo forskalii;
    Labeo victorianus;
    Labeo cylindricus;
    Labeo annectens;
    Labeo ansorgii;
    Labeo barbatus;
    Labeo batesii;
    Labeo brachypoma;
    Labeo caeruleus;
    Labeo chariensis;
    Labeo curriei;
    Labeo degeni;
    Labeo fulakariensis;
    Labeo greenii;
    Labeo gregorii;
    Labeo lividus;
    Labeo longipinnis;
    Labeo lukulae;
    Labeo maleboensis;
    Labeo mbitaensis;
    Labeo nasus;
    Labeo parvus;
    Labeo pierrei;
    Labeo pinki;
    Labeo polli;
    Labeo rectipinnis;
    Labeo reidi;
    Labeo rouaneti;
    Labeo simpsoni;
    Labeo sorex;
    Labeo trigliceps;
    Labeo variegatus;
    Labeo weeksii;
    Enteromius anoplus;
    Enteromius paludinosus;
    Enteromius trimaculatus;
    Enteromius viviparus;
    Enteromius poechii;
    Enteromius unitaeniatus;
    Enteromius multilineatus;
    Enteromius radiatus;
    Enteromius bifrenatus;
    Enteromius fasciolatus;
    Enteromius haasianus;
    Enteromius barnardi;
    Enteromius eutaenia;
    Enteromius lineomaculatus;
    Enteromius neefi;
    Enteromius trevelyani;
    Enteromius brevipinnis;
    Enteromius mattozi;
    Enteromius motebensis;
    Enteromius gurneyi;
    Enteromius amatolicus;
    Enteromius choloensis;
    Enteromius euboicus;
    Enteromius holotaenia;
    Enteromius jae;
    Enteromius macrops;
    Enteromius callipterus;
    Enteromius ablabes;
    Enteromius camptacanthus;
    Enteromius guirali;
    Enteromius trispilos;
    Enteromius leonensis;
    Enteromius bigornei;
    Enteromius traorei;
    Enteromius sacratus;
    Enteromius baudoni;
    Enteromius sublineatus;
    Enteromius anema;
    Enteromius pobeguini;
    Enteromius macinensis;
    Enteromius chlorotaenia;
    Enteromius gambiensis;
    Enteromius kerstenii;
    Enteromius stigmatopygus;
    Enteromius alberti;
    Enteromius apleurogramma
  `, [7,21], 85);

  // ============================================================
  // AZIATISCHE RIVIERVISSEN
  // ============================================================

  riviervissen(`
    Aziatische arowana=Scleropages formosus;
    Scleropages inscriptus;
    Reuzenkarper=Catlocarpio siamensis;
    Mekongreuzenmeerval=Pangasianodon gigas;
    Panga=Pangasianodon hypophthalmus;
    Pangasius bocourti;
    Pangasius pangasius;
    Pangasius sanitwongsei;
    Pangasius krempfi;
    Pangasius larnaudii;
    Pangasius nasutus;
    Pangasius djambal;
    Pangasius conchophilus;
    Pangasius elongatus;
    Pangasius humeralis;
    Pangasius kinabatanganensis;
    Pangasius kunyit;
    Pangasius lithostoma;
    Pangasius macronema;
    Pangasius mahakamensis;
    Pangasius mekongensis;
    Pangasius micronemus;
    Pangasius myanmar;
    Pangasius nieuwenhuisii;
    Pangasius pleurotaenia;
    Pangasius polyuranodon;
    Pangasius rheophilus;
    Pangasius sabahensis;
    Helicophagus waandersii;
    Helicophagus typus;
    Helicophagus leptorhynchus;
    Pseudolais micronemus;
    Pseudolais pleurotaenia;
    Wallago attu;
    Wallagonia leerii;
    Wallagonia micropogon;
    Ompok bimaculatus;
    Ompok pabda;
    Ompok pabo;
    Ompok hypophthalmus;
    Ompok eugeneiatus;
    Ompok borneensis;
    Ompok fumidus;
    Ompok jaynei;
    Ompok karunkodu;
    Ompok leiacanthus;
    Ompok malabaricus;
    Ompok miostoma;
    Ompok platyrhynchus;
    Ompok pluriradiatus;
    Ompok rhadinurus;
    Ompok siluroides;
    Ompok sindensis;
    Ompok supernus;
    Ompok urbaini;
    Ompok weberi;
    Kryptopterus vitreolus;
    Kryptopterus bicirrhis;
    Kryptopterus minor;
    Kryptopterus cryptopterus;
    Kryptopterus geminus;
    Kryptopterus lais;
    Kryptopterus limpok;
    Kryptopterus macrocephalus;
    Kryptopterus mononema;
    Kryptopterus palembangensis;
    Kryptopterus paraschilbeides;
    Kryptopterus piperatus;
    Kryptopterus sabanus;
    Kryptopterus schilbeides;
    Silurichthys hasseltii;
    Silurichthys indragiriensis;
    Silurichthys ligneolus;
    Silurichthys marmoratus;
    Silurichthys phaiosoma;
    Silurichthys sanguineus;
    Silurichthys schneideri
  `, [], 80);

  // ============================================================
  // AZIATISCHE SLANGENKOPVISSEN
  // ============================================================

  riviervissen(`
    Channa striata;
    Channa micropeltes;
    Channa argus;
    Channa maculata;
    Channa marulius;
    Channa punctata;
    Channa gachua;
    Channa bleheri;
    Channa andrao;
    Channa aurantimaculata;
    Channa baramensis;
    Channa bankanensis;
    Channa bipuli;
    Channa burmanica;
    Channa cyanospilos;
    Channa diplogramma;
    Channa harcourtbutleri;
    Channa hoaluensis;
    Channa kelaartii;
    Channa longistomata;
    Channa lucius;
    Channa marulioides;
    Channa melanoptera;
    Channa melasoma;
    Channa nox;
    Channa orientalis;
    Channa ornatipinnis;
    Channa panaw;
    Channa pardalis;
    Channa pleurophthalma;
    Channa pseudomarulius;
    Channa pulchra;
    Channa quinquefasciata;
    Channa royi;
    Channa stewartii;
    Channa stiktos;
    Channa torsaensis;
    Parachanna africana;
    Parachanna insignis;
    Parachanna obscura
  `, [17,21], 80);

  // ============================================================
  // AZIATISCHE KARPERACHTIGEN
  // ============================================================

  rivierEnMeerVissen(`
    Graskarper=Ctenopharyngodon idella;
    Zilverkarper=Hypophthalmichthys molitrix;
    Grootkopkarper=Hypophthalmichthys nobilis;
    Zwarte karper=Mylopharyngodon piceus;
    Rohu=Labeo rohita;
    Catla=Labeo catla;
    Cirrhinus cirrhosus;
    Cirrhinus reba;
    Labeo calbasu;
    Labeo bata;
    Labeo boga;
    Labeo gonius;
    Labeo fimbriatus;
    Labeo dyocheilus;
    Labeo kontius;
    Labeo pangusia;
    Labeo porcellus;
    Labeo potail;
    Labeo dero;
    Labeo ariza;
    Puntius sophore;
    Puntius chola;
    Puntius ticto;
    Puntius terio;
    Puntius sarana;
    Puntius conchonius;
    Pethia nigrofasciata;
    Pethia padamya;
    Pethia gelius;
    Pethia cumingii;
    Pethia reval;
    Pethia stoliczkana;
    Pethia manipurensis;
    Pethia shalynius;
    Pethia phutunio;
    Osteobrama cotio;
    Osteobrama belangeri;
    Osteobrama cunma;
    Osteobrama feae;
    Osteobrama neilli;
    Osteobrama vigorsii;
    Oxygaster anomalura;
    Oxygaster pointoni;
    Oxygaster oxygastroides;
    Paralaubuca typus;
    Paralaubuca barroni;
    Paralaubuca harmandi;
    Paralaubuca riveroi;
    Barbonymus gonionotus;
    Barbonymus schwanenfeldii;
    Barbonymus altus;
    Barbonymus balleroides;
    Barbonymus collingwoodii;
    Hampala macrolepidota;
    Hampala dispar
  `, [7,21], 75);

  // ============================================================
  // DANIO'S EN RASBORA'S
  // ============================================================

  riviervissen(`
    Zebravis=Danio rerio;
    Danio albolineatus;
    Danio choprae;
    Danio kyathit;
    Danio dangila;
    Danio aesculapii;
    Danio tinwini;
    Danio margaritatus;
    Danio erythromicron;
    Danio feegradei;
    Danio flagrans;
    Danio jaintianensis;
    Danio meghalayensis;
    Danio quagga;
    Danio roseus;
    Danio annulosus;
    Danio assamila;
    Danio catenatus;
    Danio concatenatus;
    Danio htamanthinus;
    Devario aequipinnatus;
    Devario malabaricus;
    Devario acrostomus;
    Devario affinis;
    Devario apogon;
    Devario apopyris;
    Devario auropurpureus;
    Devario browni;
    Devario chrysotaeniatus;
    Devario devario;
    Devario fangae;
    Devario fraseri;
    Devario gibber;
    Devario horai;
    Devario interruptus;
    Devario kakhienensis;
    Devario kysonensis;
    Devario laoensis;
    Devario leptos;
    Devario maetaengensis;
    Devario manipurensis;
    Devario neilgherriensis;
    Devario pathirana;
    Devario quangbinhensis;
    Devario regina;
    Devario salmonatus;
    Devario sondhii;
    Devario strigillifer;
    Devario suvatti;
    Devario xyrops;
    Rasbora trilineata;
    Rasbora einthovenii;
    Rasbora caudimaculata;
    Rasbora borapetensis;
    Rasbora elegans;
    Rasbora sumatrana;
    Rasbora argyrotaenia;
    Rasbora aurotaenia;
    Rasbora aprotaenia;
    Rasbora arundinata;
    Rasbora atranus;
    Rasbora bankanensis;
    Rasbora beauforti;
    Rasbora bindumatoga;
    Rasbora borneensis;
    Rasbora bunguranensis;
    Rasbora cephalotaenia;
    Rasbora chrysotaenia;
    Rasbora cryptica;
    Rasbora dies;
    Rasbora dorsinotata;
    Rasbora dusonensis;
    Rasbora ennealepis;
    Rasbora everetti;
    Rasbora gerlachi;
    Rasbora hobelmani;
    Rasbora hosii;
    Rasbora hubbsi;
    Rasbora jacobsoni;
    Rasbora johannae;
    Rasbora kalbarensis;
    Rasbora kalochroma;
    Rasbora kluetensis;
    Rasbora kobonensis;
    Rasbora lacrimula;
    Rasbora lateristriata;
    Rasbora laticlavia;
    Rasbora leptosoma;
    Rasbora myersi;
    Rasbora nodulosa;
    Rasbora notura;
    Rasbora ornata;
    Rasbora paviana;
    Rasbora philippina;
    Rasbora pycnopeza;
    Rasbora rasbora;
    Rasbora reticulata;
    Rasbora rheophila;
    Rasbora rubrodorsalis;
    Rasbora sarawakensis;
    Rasbora semilineata;
    Rasbora septentrionalis;
    Rasbora simplex;
    Rasbora spilotaenia;
    Rasbora steineri;
    Rasbora subtilis;
    Rasbora tawarensis;
    Rasbora tobana;
    Rasbora tornieri;
    Rasbora tubbi;
    Rasbora volzi;
    Rasbora vulcanus;
    Rasbora wilpita;
    Trigonostigma heteromorpha;
    Trigonostigma espei;
    Trigonostigma hengeli;
    Trigonostigma somphongsi;
    Boraras brigittae;
    Boraras maculatus;
    Boraras merah;
    Boraras micros;
    Boraras naevus;
    Boraras urophthalmoides
  `, [7,21], 85);

  // ============================================================
  // AZIATISCHE MODDERKRUIPERS
  // ============================================================

  riviervissen(`
    Clownbotia=Chromobotia macracanthus;
    Botia almorhae;
    Botia dario;
    Botia histrionica;
    Botia kubotai;
    Botia lohachata;
    Botia rostrata;
    Botia striata;
    Botia udomritthiruji;
    Yasuhikotakia modesta;
    Yasuhikotakia morleti;
    Yasuhikotakia eos;
    Yasuhikotakia lecontei;
    Yasuhikotakia longidorsalis;
    Yasuhikotakia splendida;
    Syncrossus berdmorei;
    Syncrossus beauforti;
    Syncrossus helodes;
    Syncrossus hymenophysa;
    Syncrossus reversa;
    Sinibotia robusta;
    Sinibotia pulchra;
    Sinibotia superciliaris;
    Sinibotia reevesae;
    Sinibotia longiventralis;
    Ambastaia sidthimunki;
    Ambastaia nigrolineata;
    Pangio kuhlii;
    Pangio semicincta;
    Pangio myersi;
    Pangio oblonga;
    Pangio anguillaris;
    Pangio alternans;
    Pangio apoda;
    Pangio bitaimac;
    Pangio cuneovirgata;
    Pangio doriae;
    Pangio filinaris;
    Pangio fusca;
    Pangio goaensis;
    Pangio incognito;
    Pangio lidi;
    Pangio longimanus;
    Pangio malayana;
    Pangio mariarum;
    Pangio muraeniformis;
    Pangio piperata;
    Pangio pulla;
    Pangio robiginosa;
    Pangio sabana;
    Pangio shelfordii;
    Pangio signicauda;
    Pangio superba;
    Pangio tolerance;
    Pangio usitata;
    Sewellia lineolata;
    Sewellia albisuera;
    Sewellia breviventralis;
    Sewellia elongata;
    Sewellia marmorata;
    Sewellia patella;
    Sewellia pterolineata;
    Sewellia speciosa;
    Sewellia trakhucensis;
    Gastromyzon punctulatus;
    Gastromyzon ctenocephalus;
    Gastromyzon scitulus;
    Gastromyzon zebrinus;
    Gastromyzon stellatus;
    Gastromyzon ocellatus;
    Gastromyzon borneensis;
    Gastromyzon aeruginosus;
    Gastromyzon auronigrus;
    Gastromyzon cranbrooki;
    Gastromyzon danumensis;
    Gastromyzon extrorsus;
    Gastromyzon farragus;
    Gastromyzon ingeri;
    Gastromyzon lepidogaster;
    Gastromyzon monticola;
    Gastromyzon praestans;
    Gastromyzon psiloetron;
    Gastromyzon ridens;
    Gastromyzon russulus;
    Gastromyzon scaber;
    Gastromyzon spectabilis;
    Gastromyzon umbrus;
    Gastromyzon viriosus;
    Gastromyzon venustus;
    Beaufortia kweichowensis;
    Beaufortia leveretti;
    Beaufortia cyclica;
    Beaufortia daon;
    Beaufortia granulopinna;
    Beaufortia intermedia;
    Beaufortia liui;
    Beaufortia polylepis;
    Beaufortia szechuanensis;
    Beaufortia zebroida
  `, [], 85);

  // ============================================================
  // CORRECTIES OP DE TOEGEVOEGDE GROEPEN
  // ============================================================

  // Geen verzonnen of onvoldoende duidelijke soortnamen
  // als nieuwe geldige antwoorden gebruiken.

  verwijderKoppeling("Pangio tolerance", [1,14,18,37,50]);

  verwijderKoppeling("Hemigrammus oellifer", [1,7,14,18,21,37,50]);

  verwijderKoppeling("Potamotrygon fschroederi", [1,14,17,18,37,45,50]);

  // Soorten met een sterke binding aan meren,
  // moerassen of stilstaand water worden niet
  // automatisch als typische rivierdieren beschouwd.

  verwijderKoppeling("Danio erythromicron", [37]);

  koppel("Danio erythromicron", [38], 80);

  verwijderKoppeling("Danio margaritatus", [37]);

  // Bekende uitgestorven soorten niet aan actuele
  // leefgebiedsvragen koppelen.

  koppel(`
    Coregonus bezola;
    Coregonus fera;
    Coregonus hiemalis;
    Coregonus johannae;
    Coregonus nobilis;
    Coregonus reighardi;
    Coregonus trybomi;
    Coregonus restrictus
  `, [43], 85);

  for (const naam of `
    Coregonus bezola;
    Coregonus fera;
    Coregonus hiemalis;
    Coregonus johannae;
    Coregonus nobilis;
    Coregonus reighardi;
    Coregonus trybomi;
    Coregonus restrictus
  `.split(";")) {

    verwijderKoppeling(
      naam.trim(),
      [37,38]
    );

  }

  // ============================================================
  // TUSSENTIJDSE TELLING
  // ============================================================

  function aantalAntwoorden(nummer) {

    let aantal = 0;

    for (const record of dieren.values()) {

      if (record.vragen.has(nummer)) {

        aantal++;

      }

    }

    return aantal;

  }

  function voortgangWaterdieren() {

    return [37,38,39].map(nummer => {

      const aantal =
        aantalAntwoorden(nummer);

      const eerder =
        vorigeAantallen.get(nummer) || 0;

      return {

        vraag: nummer,

        eerder,

        antwoorden: aantal,

        groei: aantal - eerder,

        raketten: raketten(aantal),

        ontbrekend:
          Math.max(0, 1000 - aantal)

      };

    });

  }

  console.group(
    "QuizBallon V9.2 - Aanvulling 2 - Deel 1"
  );

  console.log(
    "Nieuwe dierrecords:",
    nieuweDieren
  );

  console.log(
    "Nieuwe vraagkoppelingen:",
    nieuweKoppelingen
  );

  console.log(
    "Nieuwe synoniemen:",
    nieuweSynoniemen
  );

  console.table(
    voortgangWaterdieren()
  );

  console.groupEnd();  // ============================================================
  // QUIZBALLON V9.2 - AANVULLING 2 - DEEL 2
  // MEREN EN OVERIGE ZOETWATERDIEREN
  // ============================================================

  // ============================================================
  // TANGANYIKAMEER - CICHLIDEN
  // ============================================================

  meervissen(`
    Neolamprologus brichardi;
    Neolamprologus pulcher;
    Neolamprologus princess;
    Neolamprologus leleupi;
    Neolamprologus cylindricus;
    Neolamprologus tretocephalus;
    Neolamprologus sexfasciatus;
    Neolamprologus multifasciatus;
    Neolamprologus similis;
    Neolamprologus brevis;
    Neolamprologus ocellatus;
    Neolamprologus callipterus;
    Neolamprologus caudopunctatus;
    Neolamprologus buescheri;
    Neolamprologus gracilis;
    Neolamprologus falcicula;
    Neolamprologus furcifer;
    Neolamprologus longior;
    Neolamprologus marunguensis;
    Neolamprologus modestus;
    Neolamprologus mondabu;
    Neolamprologus niger;
    Neolamprologus olivaceous;
    Neolamprologus prochilus;
    Neolamprologus savoryi;
    Neolamprologus splendens;
    Neolamprologus tetracanthus;
    Neolamprologus toae;
    Neolamprologus ventralis;
    Neolamprologus wauthioni;
    Julidochromis transcriptus;
    Julidochromis ornatus;
    Julidochromis marlieri;
    Julidochromis regani;
    Julidochromis dickfeldi;
    Julidochromis marksmithi;
    Altolamprologus calvus;
    Altolamprologus compressiceps;
    Chalinochromis brichardi;
    Chalinochromis popelini;
    Chalinochromis cyanophleps;
    Telmatochromis vittatus;
    Telmatochromis temporalis;
    Telmatochromis dhonti;
    Telmatochromis bifrenatus;
    Telmatochromis brichardi;
    Telmatochromis caninus;
    Lamprologus callipterus;
    Lamprologus ocellatus;
    Lamprologus meleagris;
    Lamprologus speciosus;
    Lamprologus ornatipinnis;
    Lepidiolamprologus elongatus;
    Lepidiolamprologus kendalli;
    Lepidiolamprologus attenuatus;
    Lepidiolamprologus profundicola;
    Lepidiolamprologus cunningtoni;
    Lepidiolamprologus mimicus;
    Lepidiolamprologus nkambae;
    Variabilichromis moorii
  `, [5,7,21], 85);

  // ============================================================
  // TANGANYIKAMEER - TRO PHEUS EN PETROCHROMIS
  // ============================================================

  meervissen(`
    Tropheus moorii;
    Tropheus duboisi;
    Tropheus brichardi;
    Tropheus polli;
    Tropheus annectens;
    Tropheus kasabae;
    Petrochromis polyodon;
    Petrochromis trewavasae;
    Petrochromis famula;
    Petrochromis fasciolatus;
    Petrochromis orthognathus;
    Petrochromis macrognathus;
    Petrochromis horii;
    Petrochromis ephippium;
    Petrochromis paucispinis;
    Pseudosimochromis babaulti;
    Pseudosimochromis curvifrons;
    Pseudosimochromis marginatus;
    Simochromis diagramma;
    Simochromis pleurospilus;
    Interochromis loocki;
    Limnotilapia dardennii;
    Lobochilotes labiatus;
    Gnathochromis permaxillaris;
    Gnathochromis pfefferi;
    Ctenochromis horei
  `, [5,7,21], 85);

  // ============================================================
  // TANGANYIKAMEER - OVERIGE CICHLIDEN
  // ============================================================

  meervissen(`
    Frontosa=Cyphotilapia frontosa;
    Cyphotilapia gibberosa;
    Benthochromis tricoti;
    Benthochromis horii;
    Benthochromis melanoides;
    Cyprichromis leptosoma;
    Cyprichromis microlepidotus;
    Cyprichromis pavo;
    Cyprichromis coloratus;
    Cyprichromis zonatus;
    Paracyprichromis nigripinnis;
    Paracyprichromis brieni;
    Xenotilapia flavipinnis;
    Xenotilapia papilio;
    Xenotilapia spiloptera;
    Xenotilapia bathyphila;
    Xenotilapia boulengeri;
    Xenotilapia caudafasciata;
    Xenotilapia longispinis;
    Xenotilapia melanogenys;
    Xenotilapia nigrolabiata;
    Xenotilapia ochrogenys;
    Xenotilapia ornatipinnis;
    Xenotilapia rotundiventralis;
    Xenotilapia sima;
    Xenotilapia tenuidentata;
    Enantiopus melanogenys;
    Ectodus descampsii;
    Aulonocranus dewindti;
    Cardiopharynx schoutedeni;
    Callochromis macrops;
    Callochromis melanostigma;
    Callochromis pleurospilus;
    Callochromis stappersii;
    Ophthalmotilapia ventralis;
    Ophthalmotilapia nasuta;
    Ophthalmotilapia boops;
    Ophthalmotilapia heterodonta;
    Cyathopharynx furcifer;
    Cyathopharynx foae;
    Cunningtonia longiventralis;
    Lestradea perspicax;
    Lestradea stappersii;
    Asprotilapia leptura;
    Grammatotria lemairii;
    Microdontochromis tenuidentata;
    Triglachromis otostigma;
    Tanganicodus irsacae;
    Eretmodus cyanostictus;
    Eretmodus marksmithi;
    Spathodus erythrodon;
    Spathodus marlieri;
    Perissodus microlepis;
    Perissodus eccentricus;
    Perissodus straeleni;
    Perissodus elaviae;
    Plecodus paradoxus;
    Plecodus multidentatus;
    Plecodus straeleni;
    Haplotaxodon microlepis;
    Haplotaxodon trifasciatus;
    Bathybates ferox;
    Bathybates fasciatus;
    Bathybates graueri;
    Bathybates horni;
    Bathybates leo;
    Bathybates minor;
    Bathybates vittatus;
    Hemibates stenosoma;
    Trematocara marginatum;
    Trematocara macrostoma;
    Trematocara nigrifrons;
    Trematocara unimaculatum;
    Trematocara variabile;
    Trematocara caparti;
    Trematocara stigmaticum;
    Limnochromis auritus;
    Greenwoodochromis christyi;
    Greenwoodochromis bellcrossi;
    Reganochromis calliurus;
    Baileychromis centropomoides;
    Boulengerochromis microlepis
  `, [5,7,21], 90);

  // ============================================================
  // TANGANYIKAMEER - ANDERE VISSEN
  // ============================================================

  meervissen(`
    Synodontis multipunctatus;
    Synodontis petricola;
    Synodontis lucipinnis;
    Synodontis grandiops;
    Synodontis granulosus;
    Synodontis irsacae;
    Synodontis tanganaicae;
    Synodontis melanostictus;
    Lates angustifrons;
    Lates mariae;
    Lates microlepis;
    Lates stappersii;
    Limnothrissa miodon;
    Stolothrissa tanganicae;
    Mastacembelus ellipsifer;
    Mastacembelus moorii;
    Mastacembelus tanganicae;
    Mastacembelus plagiostoma;
    Mastacembelus albomaculatus;
    Mastacembelus flavidus;
    Mastacembelus platysoma;
    Mastacembelus ophidium;
    Mastacembelus zebratus;
    Mastacembelus cunningtoni;
    Mastacembelus frenatus;
    Lamprichthys tanganicanus;
    Aplocheilichthys pumilus;
    Lophiobagrus cyclurus;
    Lophiobagrus aquilus;
    Lophiobagrus brevispinis;
    Lophiobagrus asperispinis;
    Chrysichthys brachynema;
    Chrysichthys sianenna;
    Chrysichthys platycephalus;
    Bathybagrus tetranema;
    Bathybagrus graueri;
    Bathybagrus sianenna;
    Phyllonemus typus;
    Phyllonemus filinemus;
    Phyllonemus brichardi;
    Dinotopterus cunningtoni;
    Tanganikallabes mortiauxi
  `, [5,7], 90);

  // ============================================================
  // MALAWIMEER - MBUNA CICHLIDEN
  // ============================================================

  meervissen(`
    Labidochromis caeruleus;
    Labidochromis hongi;
    Labidochromis chisumulae;
    Labidochromis freibergi;
    Labidochromis gigas;
    Labidochromis heterodon;
    Labidochromis ianthinus;
    Labidochromis lividus;
    Labidochromis maculicauda;
    Labidochromis mathotho;
    Labidochromis mbenjii;
    Labidochromis mylodon;
    Labidochromis pallidus;
    Labidochromis shiranus;
    Labidochromis strigatus;
    Labidochromis textilis;
    Labidochromis vellicans;
    Labidochromis zebroides;
    Melanochromis auratus;
    Melanochromis chipokae;
    Melanochromis johannii;
    Melanochromis cyaneorhabdos;
    Melanochromis melanopterus;
    Melanochromis vermivorus;
    Melanochromis baliodigma;
    Melanochromis dialeptos;
    Melanochromis elastodema;
    Melanochromis exasperatus;
    Melanochromis heterochromis;
    Melanochromis kaskazini;
    Melanochromis lepidiadaptes;
    Melanochromis loriae;
    Melanochromis mossambiquensis;
    Melanochromis robustus;
    Melanochromis simulans;
    Melanochromis wochepa;
    Labeotropheus fuelleborni;
    Labeotropheus trewavasae;
    Labeotropheus artatorostris;
    Labeotropheus chlorosiglos;
    Labeotropheus simoneae;
    Cynotilapia afra;
    Cynotilapia zebroides;
    Cynotilapia aurifrons;
    Cynotilapia axelrodi;
    Cynotilapia pulpican;
    Iodotropheus sprengerae;
    Iodotropheus stuartgranti;
    Iodotropheus declivitas;
    Genyochromis mento;
    Gephyrochromis lawsi;
    Gephyrochromis moorii;
    Cyathochromis obliquidens;
    Petrotilapia tridentiger;
    Petrotilapia nigra;
    Petrotilapia genalutea;
    Petrotilapia chrysos;
    Petrotilapia flaviventris;
    Petrotilapia microgalana;
    Petrotilapia mumboensis;
    Petrotilapia palingnathos;
    Petrotilapia pyroscelos;
    Petrotilapia xanthos
  `, [5,7,21], 85);

  // ============================================================
  // MALAWIMEER - METRIACLIMA EN PSEUDOTROPHEUS
  // ============================================================

  meervissen(`
    Metriaclima zebra=Maylandia zebra;
    Metriaclima estherae=Maylandia estherae;
    Metriaclima callainos=Maylandia callainos;
    Metriaclima aurora=Maylandia aurora;
    Metriaclima lombardoi=Maylandia lombardoi;
    Metriaclima greshakei=Maylandia greshakei;
    Metriaclima fainzilberi=Maylandia fainzilberi;
    Metriaclima barlowi=Maylandia barlowi;
    Metriaclima benetos=Maylandia benetos;
    Metriaclima chrysomallos=Maylandia chrysomallos;
    Metriaclima cyneusmarginata;
    Metriaclima emmiltos=Maylandia emmiltos;
    Metriaclima flavifemina=Maylandia flavifemina;
    Metriaclima glaucos=Maylandia glaucos;
    Metriaclima hajomaylandi=Maylandia hajomaylandi;
    Metriaclima heteropicta=Maylandia heteropicta;
    Metriaclima lanisticola=Maylandia lanisticola;
    Metriaclima livingstonii=Maylandia livingstonii;
    Metriaclima lundoense=Maylandia lundoense;
    Metriaclima mbenjii=Maylandia mbenjii;
    Metriaclima melabranchion=Maylandia melabranchion;
    Metriaclima mossambica=Maylandia mossambica;
    Metriaclima msobo=Maylandia msobo;
    Metriaclima nigrodorsalis=Maylandia nigrodorsalis;
    Metriaclima nkhunguensis=Maylandia nkhunguensis;
    Metriaclima patriciae=Maylandia patriciae;
    Metriaclima phaeos=Maylandia phaeos;
    Metriaclima pyrsonotos=Maylandia pyrsonotos;
    Metriaclima sandaracinos=Maylandia sandaracinos;
    Metriaclima xanstomachus;
    Pseudotropheus elongatus;
    Pseudotropheus crabro;
    Pseudotropheus socolofi;
    Pseudotropheus saulosi;
    Pseudotropheus demasoni;
    Pseudotropheus acei;
    Pseudotropheus minutus;
    Pseudotropheus williamsi;
    Pseudotropheus fuscoides;
    Pseudotropheus livingstonii;
    Pseudotropheus brevis;
    Pseudotropheus tursiops;
    Pseudotropheus interruptus;
    Pseudotropheus perspicax;
    Chindongo bellicosus;
    Chindongo cyanopterus;
    Chindongo flavus;
    Chindongo heteropictus;
    Chindongo longior;
    Chindongo minutus;
    Chindongo socolofi;
    Chindongo saulosi;
    Chindongo demasoni;
    Chindongo elongatus
  `, [5,7,21], 90);

  // ============================================================
  // MALAWIMEER - AULONOCARA
  // ============================================================

  meervissen(`
    Aulonocara baenschi;
    Aulonocara stuartgranti;
    Aulonocara jacobfreibergi;
    Aulonocara nyassae;
    Aulonocara hansbaenschi;
    Aulonocara maylandi;
    Aulonocara kandeense;
    Aulonocara aquilonium;
    Aulonocara auditor;
    Aulonocara brevinidus;
    Aulonocara brevirostre;
    Aulonocara ethelwynnae;
    Aulonocara gertrudae;
    Aulonocara guentheri;
    Aulonocara hueseri;
    Aulonocara koningsi;
    Aulonocara korneliae;
    Aulonocara macrochir;
    Aulonocara maleri;
    Aulonocara maulana;
    Aulonocara saulosi;
    Aulonocara stonemani;
    Aulonocara trematocephalum
  `, [5,7,21], 85);

  // ============================================================
  // MALAWIMEER - GROTERE CICHLIDEN
  // ============================================================

  meervissen(`
    Nimbochromis livingstonii;
    Nimbochromis venustus;
    Nimbochromis polystigma;
    Nimbochromis fuscotaeniatus;
    Nimbochromis linni;
    Sciaenochromis fryeri;
    Sciaenochromis ahli;
    Sciaenochromis benthicola;
    Sciaenochromis psammophilus;
    Dimidiochromis compressiceps;
    Dimidiochromis strigatus;
    Dimidiochromis kiwinge;
    Dimidiochromis dimidiatus;
    Buccochromis rhoadesii;
    Buccochromis lepturus;
    Buccochromis nototaenia;
    Buccochromis spectabilis;
    Buccochromis heterotaenia;
    Buccochromis atritaeniatus;
    Tyrannochromis macrostoma;
    Tyrannochromis nigriventer;
    Champsochromis caeruleus;
    Champsochromis spilorhynchus;
    Exochochromis anagenys;
    Aristochromis christyi;
    Fossorochromis rostratus;
    Stigmatochromis modestus;
    Stigmatochromis pleurospilus;
    Stigmatochromis woodi;
    Stigmatochromis melanchros;
    Stigmatochromis pholidophorus;
    Protomelas taeniolatus;
    Protomelas fenestratus;
    Protomelas similis;
    Protomelas annectens;
    Protomelas dejunctus;
    Protomelas insignis;
    Protomelas kirkii;
    Protomelas labridens;
    Protomelas macrodon;
    Protomelas marginatus;
    Protomelas pleurotaenia;
    Protomelas spilonotus;
    Protomelas steveni;
    Protomelas triaenodon;
    Placidochromis electra;
    Placidochromis phenochilus;
    Placidochromis johnstoni;
    Placidochromis longimanus;
    Placidochromis milomo;
    Placidochromis hennydaviesae;
    Placidochromis subocularis;
    Placidochromis trewavasae;
    Otopharynx lithobates;
    Otopharynx tetrastigma;
    Otopharynx auromarginatus;
    Otopharynx brooksi;
    Otopharynx heterodon;
    Otopharynx ovatus;
    Otopharynx pachycheilus;
    Otopharynx selenurus;
    Otopharynx speciosus;
    Otopharynx spelaeotes;
    Otopharynx styrax;
    Otopharynx walteri;
    Copadichromis borleyi;
    Copadichromis azureus;
    Copadichromis chrysonotus;
    Copadichromis atripinnis;
    Copadichromis boadzulu;
    Copadichromis cyaneus;
    Copadichromis geertsi;
    Copadichromis jacksoni;
    Copadichromis likomae;
    Copadichromis mbenjii;
    Copadichromis mloto;
    Copadichromis nkatae;
    Copadichromis parvus;
    Copadichromis pleurostigmoides;
    Copadichromis pleurostigma;
    Copadichromis prostoma;
    Copadichromis quadrimaculatus;
    Copadichromis thinos;
    Copadichromis trewavasae;
    Copadichromis trimaculatus;
    Copadichromis virginalis
  `, [5,7,21], 85);

  // ============================================================
  // MALAWIMEER - OVERIGE SOORTEN
  // ============================================================

  meervissen(`
    Lethrinops albus;
    Lethrinops altus;
    Lethrinops auritus;
    Lethrinops christyi;
    Lethrinops furcifer;
    Lethrinops gossei;
    Lethrinops leptodon;
    Lethrinops lethrinus;
    Lethrinops longimanus;
    Lethrinops lunaris;
    Lethrinops macracanthus;
    Lethrinops macrochir;
    Lethrinops macrophthalmus;
    Lethrinops marginatus;
    Lethrinops microdon;
    Lethrinops micrentodon;
    Lethrinops mylodon;
    Lethrinops oculatus;
    Lethrinops parvidens;
    Lethrinops stridei;
    Lethrinops turneri;
    Tramitichromis intermedius;
    Tramitichromis lituris;
    Tramitichromis brevis;
    Tramitichromis trilineatus;
    Tramitichromis variabilis;
    Taeniolethrinops furcicauda;
    Taeniolethrinops praeorbitalis;
    Taeniolethrinops laticeps;
    Taeniolethrinops macrorhynchus;
    Nyassachromis boadzulu;
    Nyassachromis breviceps;
    Nyassachromis leuciscus;
    Nyassachromis microcephalus;
    Nyassachromis nigritaeniatus;
    Nyassachromis prostoma;
    Nyassachromis serenus;
    Nyassachromis purpurans;
    Rhamphochromis esox;
    Rhamphochromis longiceps;
    Rhamphochromis lucius;
    Rhamphochromis macrophthalmus;
    Rhamphochromis woodi;
    Diplotaxodon limnothrissa;
    Diplotaxodon macrops;
    Diplotaxodon greenwoodi;
    Diplotaxodon aeneus;
    Diplotaxodon apogon;
    Diplotaxodon argenteus;
    Diplotaxodon ecclesi;
    Pallidochromis tokolosh;
    Corematodus shiranus;
    Corematodus taeniatus;
    Chilotilapia rhoadesii;
    Hemitilapia oxyrhyncha;
    Eclectochromis lobochilus;
    Eclectochromis ornatus;
    Mylochromis anaphyrmus;
    Mylochromis epichorialis;
    Mylochromis ericotaenia;
    Mylochromis formosus;
    Mylochromis gracilis;
    Mylochromis guentheri;
    Mylochromis incola;
    Mylochromis lateristriga;
    Mylochromis melanonotus;
    Mylochromis mollis;
    Mylochromis plagiotaenia;
    Mylochromis sphaerodon;
    Mylochromis spilostichus;
    Mylochromis subocularis;
    Mylochromis trunciceps;
    Oreochromis karongae;
    Oreochromis lidole;
    Oreochromis squamipinnis;
    Oreochromis shiranus
  `, [5,7,21], 90);

  // ============================================================
  // VICTORIAMEER
  // ============================================================

  meervissen(`
    Haplochromis nyererei;
    Pundamilia nyererei;
    Pundamilia pundamilia;
    Pundamilia azurea;
    Pundamilia igneopinnis;
    Pundamilia macrocephala;
    Pundamilia melanoptera;
    Haplochromis sauvagei;
    Haplochromis chilotes;
    Haplochromis latifasciatus;
    Haplochromis aeneocolor;
    Haplochromis argens;
    Haplochromis astatodon;
    Haplochromis barbarae;
    Haplochromis coprologus;
    Haplochromis degeni;
    Haplochromis fusiformis;
    Haplochromis fischeri;
    Haplochromis flavipinnis;
    Haplochromis howesi;
    Haplochromis iris;
    Haplochromis ismaeli;
    Haplochromis limax;
    Haplochromis lividus;
    Haplochromis macrognathus;
    Haplochromis nubilus;
    Haplochromis obliquidens;
    Haplochromis oligacanthus;
    Haplochromis piceatus;
    Haplochromis phytophagus;
    Haplochromis plagiodon;
    Haplochromis pyrrhocephalus;
    Haplochromis rufocaudalis;
    Haplochromis saxicola;
    Haplochromis serranus;
    Haplochromis thereuterion;
    Haplochromis xenognathus;
    Neochromis omnicaeruleus;
    Neochromis greenwoodi;
    Neochromis rufocaudalis;
    Neochromis simotes;
    Neochromis gigas;
    Mbipia mbipi;
    Mbipia lutea;
    Paralabidochromis chilotes;
    Paralabidochromis sauvagei;
    Paralabidochromis victoriae;
    Lithochromis rubripinnis;
    Lithochromis rufus;
    Lipochromis melanopterus;
    Lipochromis microdon;
    Lipochromis obesus;
    Yssichromis pyrrhocephalus;
    Yssichromis laparogramma;
    Rastrineobola argentea;
    Lates niloticus;
    Oreochromis niloticus;
    Oreochromis esculentus;
    Oreochromis variabilis;
    Bagrus docmak;
    Bagrus bajad;
    Synodontis victoriae;
    Clarias gariepinus;
    Clarias alluaudi;
    Protopterus aethiopicus
  `, [5,7], 85);

  // ============================================================
  // OVERIGE AFRIKAANSE MEREN
  // ============================================================

  meervissen(`
    Lates macrophthalmus;
    Lates longispinis;
    Labeobarbus intermedius;
    Labeobarbus acutirostris;
    Labeobarbus brevicephalus;
    Labeobarbus crassibarbis;
    Labeobarbus dainellii;
    Labeobarbus gorgorensis;
    Labeobarbus gorguari;
    Labeobarbus longissimus;
    Labeobarbus megastoma;
    Labeobarbus nedgia;
    Labeobarbus osseensis;
    Labeobarbus platydorsus;
    Labeobarbus surkis;
    Labeobarbus truttiformis;
    Alcolapia alcalica;
    Alcolapia grahami;
    Alcolapia latilabris;
    Alcolapia ndalalani;
    Coptodon kottae;
    Coptodon deckerti;
    Coptodon ejagham;
    Coptodon fusiforme;
    Coptodon gutturosa;
    Coptodon imbriferna;
    Coptodon kottae;
    Coptodon snyderae;
    Coptodon spongotroktis;
    Coptodon thysi;
    Stomatepia pindu;
    Stomatepia mariae;
    Stomatepia mongo;
    Konia eisentrauti;
    Konia dikume;
    Myaka myaka;
    Pungu maclareni;
    Sarotherodon linnellii;
    Sarotherodon lohbergeri;
    Sarotherodon steinbachi;
    Sarotherodon caroli;
    Sarotherodon knauerae;
    Sarotherodon lamprechti;
    Sarotherodon galilaeus;
    Danakilia franchettii;
    Danakilia dinicolai
  `, [5,7,21], 90);

  // ============================================================
  // AZIATISCHE MEREN - SULAWESI
  // ============================================================

  meervissen(`
    Telmatherina antoniae;
    Telmatherina prognatha;
    Telmatherina sarasinorum;
    Telmatherina abendanoni;
    Telmatherina bonti;
    Telmatherina celebensis;
    Telmatherina opudi;
    Telmatherina wahjui;
    Tominanga aurea;
    Tominanga sanguicauda;
    Paratherina cyanea;
    Paratherina labiosa;
    Paratherina striata;
    Paratherina wolterecki;
    Oryzias matanensis;
    Oryzias marmoratus;
    Oryzias profundicola;
    Oryzias celebensis;
    Oryzias nigrimas;
    Oryzias orthognathus;
    Oryzias nebulosus;
    Adrianichthys oophorus;
    Adrianichthys poptae;
    Mugilogobius adeia;
    Mugilogobius amadi;
    Mugilogobius latifrons;
    Glossogobius flavipinnis;
    Glossogobius intermedius;
    Glossogobius matanensis;
    Glossogobius mahalonensis
  `, [7,21], 90);

  // ============================================================
  // NIEUW-GUINEA EN AUSTRALIË - MEERVISSEN
  // ============================================================

  meervissen(`
    Melanotaenia boesemani;
    Melanotaenia lacustris;
    Melanotaenia ajamaruensis;
    Melanotaenia parva;
    Melanotaenia japenensis;
    Melanotaenia praecox;
    Glossolepis incisus;
    Glossolepis pseudoincisus;
    Glossolepis multisquamata;
    Chilatherina sentaniensis;
    Chilatherina fasciata;
    Chilatherina bleheri;
    Chilatherina axelrodi;
    Mogurnda mogurnda;
    Mogurnda adspersa;
    Mogurnda aurifodinae;
    Mogurnda furva;
    Mogurnda spilota;
    Mogurnda vitta;
    Macquaria ambigua;
    Macquaria australasica;
    Nannoperca australis;
    Nannoperca obscura;
    Nannoperca variegata;
    Galaxias maculatus;
    Galaxias brevipinnis;
    Galaxias auratus;
    Galaxias tanycephalus;
    Galaxias pedderensis;
    Galaxias johnstoni;
    Galaxias fontanus;
    Galaxias niger;
    Paragalaxias dissimilis;
    Paragalaxias mesotes;
    Paragalaxias julianus;
    Paragalaxias eleotroides
  `, [7,21], 85);

  // ============================================================
  // NOORD-AMERIKAANSE MEREN
  // ============================================================

  meervissen(`
    Prosopium cylindraceum;
    Prosopium coulterii;
    Prosopium gemmifer;
    Prosopium spilonotus;
    Prosopium abyssicola;
    Salvelinus namaycush;
    Salvelinus fontinalis;
    Salvelinus alpinus;
    Coregonus clupeaformis;
    Coregonus artedi;
    Coregonus hoyi;
    Coregonus kiyi;
    Coregonus zenithicus;
    Coregonus nipigon;
    Coregonus sardinella;
    Cottus cognatus;
    Cottus ricei;
    Cottus bairdi;
    Cottus extensus;
    Cottus aleuticus;
    Myoxocephalus thompsonii;
    Percopsis omiscomaycus;
    Percopsis transmontana;
    Etheostoma exile;
    Etheostoma nigrum;
    Etheostoma microperca;
    Percina caprodes;
    Percina maculata;
    Notropis atherinoides;
    Notropis hudsonius;
    Notropis heterolepis;
    Notropis volucellus;
    Notropis heterodon;
    Notropis anogenus;
    Notropis bifrenatus;
    Cyprinella spiloptera;
    Luxilus cornutus;
    Fundulus diaphanus;
    Fundulus notatus;
    Fundulus olivaceus;
    Fundulus dispar;
    Umbra limi;
    Umbra pygmaea;
    Aphredoderus sayanus;
    Aplodinotus grunniens;
    Acipenser fulvescens;
    Acipenser brevirostrum;
    Acipenser transmontanus;
    Pimephales promelas;
    Pimephales notatus;
    Carpiodes cyprinus;
    Carpiodes carpio;
    Catostomus commersonii;
    Catostomus catostomus;
    Catostomus tahoensis;
    Chasmistes cujus;
    Deltistes luxatus;
    Chasmistes brevirostris;
    Chasmistes liorus
  `, [], 80);

  // ============================================================
  // NOORD-AMERIKA - LEVENDBARENDE VISSEN
  // ============================================================

  rivierEnMeerVissen(`
    Gambusia affinis;
    Gambusia holbrooki;
    Gambusia geiseri;
    Gambusia heterochir;
    Gambusia nobilis;
    Gambusia speciosa;
    Heterandria formosa;
    Poecilia mexicana;
    Poecilia latipinna;
    Poecilia velifera;
    Poecilia sphenops;
    Xiphophorus hellerii;
    Xiphophorus maculatus;
    Xiphophorus variatus;
    Goodea atripinnis;
    Ameca splendens;
    Xenotoca eiseni;
    Xenotoca variata;
    Zoogoneticus quitzeoensis;
    Zoogoneticus tequila;
    Skiffia multipunctata;
    Skiffia lermae;
    Alloophorus robustus;
    Allotoca dugesii;
    Allotoca diazi;
    Chapalichthys encaustus;
    Chapalichthys pardalis;
    Girardinichthys multiradiatus
  `, [], 75);

  // Geen koppeling aan vraag 7:
  // dit zijn levendbarende vissen.

  // ============================================================
  // ZUID-AMERIKA - TITICACAMEER EN OMGEVING
  // ============================================================

  meervissen(`
    Orestias agassizii;
    Orestias luteus;
    Orestias albus;
    Orestias ispi;
    Orestias olivaceus;
    Orestias mulleri;
    Orestias crawfordi;
    Orestias gilsoni;
    Orestias imarpe;
    Orestias incae;
    Orestias jussiei;
    Orestias minutus;
    Orestias mooni;
    Orestias pentlandii;
    Orestias polonorum;
    Orestias robustus;
    Orestias rotundipinnis;
    Orestias taquiri;
    Orestias tchernavini;
    Orestias tschudii;
    Trichomycterus rivulatus;
    Trichomycterus dispar
  `, [7], 90);

  // ============================================================
  // EXTRA EUROPESE EN AZIATISCHE MEREN
  // ============================================================

  meervissen(`
    Rutilus frisii;
    Rutilus kutum;
    Rutilus lacustris;
    Scardinius acarnanicus;
    Scardinius graecus;
    Scardinius hesperidicus;
    Scardinius knezevici;
    Scardinius plotizza;
    Scardinius scardafa;
    Pseudophoxinus anatolicus;
    Pseudophoxinus antalyae;
    Pseudophoxinus egridiri;
    Pseudophoxinus handlirschi;
    Pseudophoxinus hittitorum;
    Pseudophoxinus battalgilae;
    Alburnus tarichi;
    Alburnus akili;
    Alburnus chalcoides;
    Alburnus belvica;
    Alburnus macedonicus;
    Alburnus scoranza;
    Alburnus thessalicus;
    Alburnus vistonicus;
    Alburnus neretvae;
    Alburnus albidus;
    Alburnus danubicus;
    Salmo ohridanus;
    Salmo letnica;
    Salmo peristericus;
    Salmo carpio;
    Salmo trutta;
    Salmo ischchan;
    Salmo ezenami;
    Salmo abanticus;
    Salmo platycephalus;
    Sander volgensis;
    Gymnocephalus schraetser;
    Gymnocephalus baloni
  `, [7], 85);

  // ============================================================
  // BEKENDE ALGEMENE MEERDIEREN
  // ============================================================

  rivierEnMeerDieren(`
    Europese otter=Lutra lutra;
    Bever=Castor fiber;
    Canadese bever=Castor canadensis;
    Muskusrat=Ondatra zibethicus;
    Beverrat=Myocastor coypus;
    Amerikaanse nerts=Neogale vison;
    Nijlpaard=Hippopotamus amphibius;
    Capibara=Hydrochoerus hydrochaeris
  `, [14,20], 25);

  meerdieren(`
    Baikalrob=Pusa sibirica;
    Kaspische rob=Pusa caspica;
    Saimaa-ringelrob=Pusa hispida saimensis;
    Ladogaringelrob=Pusa hispida ladogensis
  `, [14,17,20,24], 65);

  rivierdieren(`
    Reuzenotter=Pteronura brasiliensis;
    Noord-Amerikaanse rivierotter=Lontra canadensis;
    Zuid-Amerikaanse rivierotter=Lontra longicaudis;
    Zuidelijke rivierotter=Lontra provocax;
    Vlekhalsotter=Hydrictis maculicollis;
    Afrikaanse klauwloze otter=Aonyx capensis;
    Congolese klauwloze otter=Aonyx congicus;
    Kleinklauwotter=Aonyx cinereus;
    Gladharige otter=Lutrogale perspicillata;
    Haarsnuitotter=Lutra sumatrana;
    Vogelbekdier=Ornithorhynchus anatinus;
    Russische desman=Desmana moschata;
    Pyreneese desman=Galemys pyrenaicus;
    Amazone-rivierdolfijn=Inia geoffrensis;
    Gangesdolfijn=Platanista gangetica;
    Indusdolfijn=Platanista minor;
    Tucuxi=Sotalia fluviatilis;
    Irrawaddydolfijn=Orcaella brevirostris;
    Amazonezeekoe=Trichechus inunguis
  `, [14], 60);

  // ============================================================
  // RIVIER- EN MEERSCHILDPADDEN
  // ============================================================

  rivierEnMeerDieren(`
    Roodwangschildpad=Trachemys scripta elegans;
    Geelwangschildpad=Trachemys scripta troostii;
    Geelbuikschildpad=Trachemys scripta scripta;
    Muskusschildpad=Sternotherus odoratus;
    Sternotherus carinatus;
    Sternotherus minor;
    Sternotherus depressus;
    Bijtschildpad=Chelydra serpentina;
    Alligatorschildpad=Macrochelys temminckii;
    Europese moerasschildpad=Emys orbicularis;
    Emys trinacris;
    Chrysemys picta;
    Deirochelys reticularia;
    Pseudemys concinna;
    Pseudemys floridana;
    Pseudemys nelsoni;
    Pseudemys rubriventris;
    Pseudemys suwanniensis;
    Pseudemys texana;
    Trachemys gaigeae;
    Trachemys dorbigni;
    Trachemys callirostris;
    Trachemys venusta;
    Trachemys ornata;
    Mauremys reevesii;
    Mauremys sinensis;
    Mauremys mutica;
    Mauremys japonica;
    Mauremys rivulata;
    Mauremys leprosa;
    Mauremys caspica;
    Mauremys annamensis;
    Pelomedusa subrufa;
    Pelusios castaneus;
    Pelusios subniger;
    Pelusios sinuatus;
    Pelusios niger;
    Pelusios gabonensis;
    Chelodina longicollis;
    Chelodina expansa;
    Chelodina rugosa;
    Chelodina canni;
    Emydura macquarii;
    Emydura subglobosa;
    Elseya dentata;
    Elseya albagula;
    Myuchelys latisternum
  `, [7,14,18,33], 75);

  rivierdieren(`
    Varkensneusschildpad=Carettochelys insculpta;
    Matamata=Chelus fimbriata;
    Chelus orinocensis;
    Podocnemis expansa;
    Podocnemis unifilis;
    Podocnemis erythrocephala;
    Podocnemis sextuberculata;
    Podocnemis lewyana;
    Podocnemis vogli;
    Peltocephalus dumerilianus;
    Erymnochelys madagascariensis;
    Batagur baska;
    Batagur affinis;
    Batagur borneoensis;
    Batagur dhongoka;
    Batagur kachuga;
    Batagur trivittata;
    Hardella thurjii;
    Morenia petersi;
    Morenia ocellata;
    Pangshura tecta;
    Pangshura tentoria;
    Pangshura smithii;
    Pangshura sylhetensis;
    Chitra indica;
    Chitra chitra;
    Chitra vandijki;
    Pelochelys cantorii;
    Pelochelys bibroni;
    Pelochelys signifera;
    Nilssonia gangetica;
    Nilssonia hurum;
    Nilssonia leithii;
    Nilssonia formosa;
    Nilssonia nigricans;
    Amyda cartilaginea;
    Apalone spinifera;
    Apalone mutica;
    Apalone ferox;
    Trionyx triunguis;
    Rafetus euphraticus;
    Rafetus swinhoei;
    Cyclanorbis senegalensis;
    Cyclanorbis elegans;
    Cycloderma aubryi;
    Cycloderma frenatum;
    Graptemys geographica;
    Graptemys pseudogeographica;
    Graptemys ouachitensis;
    Graptemys flavimaculata;
    Graptemys oculifera;
    Graptemys nigrinoda;
    Graptemys barbouri;
    Graptemys ernsti;
    Graptemys gibbonsi;
    Graptemys pearlensis;
    Graptemys pulchra;
    Graptemys sabinensis;
    Graptemys versa
  `, [7,14,18,33], 85);

  // ============================================================
  // KROKODILLEN EN KAAIMANNEN
  // ============================================================

  rivierEnMeerDieren(`
    Nijlkrokodil=Crocodylus niloticus;
    Amerikaanse alligator=Alligator mississippiensis;
    Chinese alligator=Alligator sinensis;
    Brilkaaiman=Caiman crocodilus;
    Zwarte kaaiman=Melanosuchus niger;
    Breedvoorhoofdkaaiman=Caiman latirostris;
    Yacarekaaiman=Caiman yacare;
    Moeraskrokodil=Crocodylus palustris;
    Siamese krokodil=Crocodylus siamensis;
    Filipijnse krokodil=Crocodylus mindorensis;
    Nieuw-Guineakrokodil=Crocodylus novaeguineae;
    Moreletkrokodil=Crocodylus moreletii;
    Cubaanse krokodil=Crocodylus rhombifer;
    Australische zoetwaterkrokodil=Crocodylus johnstoni;
    Orinocokrokodil=Crocodylus intermedius
  `, [7,14,17,18,21], 45);

  rivierdieren(`
    Gaviaal=Gavialis gangeticus;
    Onechte gaviaal=Tomistoma schlegelii;
    Afrikaanse pantserkrokodil=Mecistops cataphractus;
    Mecistops leptorhynchus;
    Dwergkrokodil=Osteolaemus tetraspis;
    Paleosuchus palpebrosus;
    Paleosuchus trigonatus;
    Zeekrokodil=Crocodylus porosus
  `, [7,14,17,18,21], 55);

  // ============================================================
  // PERMANENT WATERLEVENDE AMFIBIEËN
  // ============================================================

  meerdieren(`
    Axolotl=Ambystoma mexicanum;
    Ambystoma dumerilii;
    Ambystoma andersoni;
    Ambystoma taylori;
    Ambystoma ordinarium;
    Titicacakikker=Telmatobius culeus
  `, [7,14], 65);

  rivierdieren(`
    Chinese reuzensalamander=Andrias davidianus;
    Japanse reuzensalamander=Andrias japonicus;
    Andrias sligoi;
    Amerikaanse reuzensalamander=Cryptobranchus alleganiensis;
    Necturus maculosus;
    Necturus alabamensis;
    Necturus beyeri;
    Necturus lewisi;
    Necturus punctatus;
    Necturus moleri;
    Necturus lodingi;
    Eurycea rathbuni;
    Eurycea sosorum;
    Eurycea nana;
    Eurycea neotenes;
    Eurycea tonkawae;
    Eurycea waterlooensis;
    Eurycea pterophila;
    Eurycea latitans;
    Eurycea tridentifera;
    Eurycea robusta
  `, [14,18], 80);

  rivierEnMeerDieren(`
    Meerkikker=Pelophylax ridibundus;
    Bastaardkikker=Pelophylax esculentus;
    Poelkikker=Pelophylax lessonae;
    Pelophylax bedriagae;
    Pelophylax perezi;
    Pelophylax saharicus;
    Pelophylax shqipericus;
    Pelophylax kurtmuelleri;
    Pelophylax nigromaculatus;
    Pelophylax porosus;
    Pelophylax chosenicus;
    Pelophylax plancyi;
    Pelophylax fukienensis;
    Amerikaanse stierkikker=Lithobates catesbeianus;
    Groene kikker=Lithobates clamitans;
    Lithobates septentrionalis;
    Lithobates pipiens;
    Lithobates sphenocephalus;
    Lithobates berlandieri;
    Lithobates grylio;
    Lithobates heckscheri;
    Lithobates warszewitschii;
    Xenopus laevis;
    Xenopus tropicalis;
    Xenopus muelleri;
    Xenopus borealis;
    Xenopus clivii;
    Xenopus fraseri;
    Xenopus gilli;
    Xenopus largeni;
    Xenopus lenduensis;
    Xenopus longipes;
    Xenopus petersii;
    Xenopus pygmaeus;
    Xenopus vestitus;
    Xenopus wittei
  `, [7,14,15,17], 75);

  // ============================================================
  // ZOETWATERKREEFTEN - EUROPA
  // ============================================================

  rivierEnMeerDieren(`
    Europese rivierkreeft=Astacus astacus;
    Turkse rivierkreeft=Pontastacus leptodactylus;
    Witklauwrivierkreeft=Austropotamobius pallipes;
    Steenkreeft=Austropotamobius torrentium;
    Gevlekte Amerikaanse rivierkreeft=Faxonius limosus;
    Signaalkreeft=Pacifastacus leniusculus;
    Rode Amerikaanse rivierkreeft=Procambarus clarkii;
    Geknobbelde Amerikaanse rivierkreeft=Faxonius virilis;
    Gestreepte Amerikaanse rivierkreeft=Procambarus acutus
  `, [7,33], 50);

  // ============================================================
  // ZOETWATERKREEFTEN - NOORD-AMERIKA
  // ============================================================

  rivierdieren(`
    Cambarus bartonii;
    Cambarus robustus;
    Cambarus longulus;
    Cambarus chasmodactylus;
    Cambarus chaugaensis;
    Cambarus coosawattae;
    Cambarus coosae;
    Cambarus cracens;
    Cambarus diogenes;
    Cambarus elkensis;
    Cambarus fodiens;
    Cambarus graysoni;
    Cambarus halli;
    Cambarus hamulatus;
    Cambarus howardi;
    Cambarus hubbsi;
    Cambarus maculatus;
    Cambarus manningi;
    Cambarus monongalensis;
    Cambarus montanus;
    Cambarus nodosus;
    Cambarus ortmanni;
    Cambarus polychromatus;
    Cambarus pristinus;
    Cambarus unestami;
    Cambarus veteranus;
    Cambarus williami;
    Cambarus zophonastes;
    Faxonius rusticus;
    Faxonius propinquus;
    Faxonius obscurus;
    Faxonius neglectus;
    Faxonius luteus;
    Faxonius punctimanus;
    Faxonius ozarkae;
    Faxonius meeki;
    Faxonius longidigitus;
    Faxonius eupunctus;
    Faxonius quadruncus;
    Faxonius hylas;
    Faxonius nana;
    Faxonius medius;
    Faxonius peruncus;
    Faxonius palmeri;
    Faxonius illinoiensis;
    Faxonius indianensis;
    Faxonius kentuckiensis;
    Faxonius stannardi;
    Faxonius placidus;
    Faxonius durelli;
    Faxonius putnami;
    Faxonius juvenilis;
    Faxonius cristavarius;
    Faxonius forceps;
    Faxonius compressus;
    Faxonius erichsonianus;
    Faxonius etnieri;
    Faxonius validus;
    Faxonius sheltae;
    Faxonius australis;
    Faxonius alabamensis;
    Faxonius immunis;
    Faxonius lancifer
  `, [7,33], 85);

  rivierEnMeerDieren(`
    Faxonius virilis;
    Faxonius rusticus;
    Faxonius propinquus;
    Faxonius immunis;
    Procambarus acutus;
    Procambarus clarkii;
    Procambarus alleni;
    Pacifastacus leniusculus;
    Pacifastacus connectens;
    Pacifastacus gambelii
  `, [7,33], 70);

  // ============================================================
  // ZOETWATERKREEFTEN - AUSTRALIË
  // ============================================================

  rivierEnMeerDieren(`
    Yabby=Cherax destructor;
    Roodklauwkreeft=Cherax quadricarinatus;
    Marron=Cherax cainii;
    Cherax tenuimanus;
    Cherax albidus;
    Cherax preissii
  `, [7,23,33], 65);

  rivierdieren(`
    Cherax cuspidatus;
    Cherax dispar;
    Cherax depressus;
    Cherax setosus;
    Cherax cairnsensis;
    Cherax wasselli;
    Cherax robustus;
    Cherax esculus;
    Cherax rotundus;
    Cherax rhynchotus;
    Cherax parvus;
    Cherax plebejus;
    Cherax glaber;
    Cherax davisi;
    Cherax quinquecarinatus;
    Euastacus armatus;
    Euastacus australasiensis;
    Euastacus bispinosus;
    Euastacus diversus;
    Euastacus fleckeri;
    Euastacus gamilaroi;
    Euastacus gumar;
    Euastacus guwinus;
    Euastacus hystricosus;
    Euastacus jagabar;
    Euastacus kershawi;
    Euastacus maidae;
    Euastacus mirangudjin;
    Euastacus neohirsutus;
    Euastacus pilosus;
    Euastacus polysetosus;
    Euastacus reductus;
    Euastacus rieki;
    Euastacus robertsi;
    Euastacus suttoni;
    Euastacus valentulus;
    Euastacus yarraensis;
    Astacopsis gouldi;
    Astacopsis franklinii;
    Astacopsis tricornis
  `, [7,23,33], 85);

  // ============================================================
  // ZOETWATERGARNALEN
  // ============================================================

  rivierdieren(`
    Amanogarnaal=Caridina multidentata=Caridina japonica;
    Waaierhandgarnaal=Atyopsis moluccensis;
    Afrikaanse waaierhandgarnaal=Atya gabonensis;
    Atya innocous;
    Atya scabra;
    Atya lanipes;
    Atya margaritacea;
    Atyopsis spinipes;
    Atyoida pilipes;
    Atyoida serrata;
    Atyoida bisulcata;
    Caridina typus;
    Caridina gracilirostris;
    Caridina longirostris;
    Caridina nilotica;
    Caridina africana;
    Caridina indistincta;
    Caridina serratirostris;
    Caridina weberi;
    Caridina thambipillai;
    Caridina breviata;
    Caridina cantonensis;
    Caridina mariae;
    Caridina logemanni;
    Caridina trifasciata;
    Neocaridina davidi;
    Neocaridina palmata;
    Neocaridina denticulata;
    Neocaridina heteropoda;
    Neocaridina koreana;
    Neocaridina ketagalan;
    Macrobrachium rosenbergii;
    Macrobrachium nipponense;
    Macrobrachium amazonicum;
    Macrobrachium acanthurus;
    Macrobrachium carcinus;
    Macrobrachium americanum;
    Macrobrachium australiense;
    Macrobrachium borellii;
    Macrobrachium brasiliense;
    Macrobrachium crenulatum;
    Macrobrachium dayanum;
    Macrobrachium dux;
    Macrobrachium equidens;
    Macrobrachium faustinum;
    Macrobrachium formosense;
    Macrobrachium gracilirostre;
    Macrobrachium hainanense;
    Macrobrachium hendersoni;
    Macrobrachium idae;
    Macrobrachium iheringi;
    Macrobrachium jelskii;
    Macrobrachium lamarrei;
    Macrobrachium lar;
    Macrobrachium malcolmsonii;
    Macrobrachium mammillodactylus;
    Macrobrachium moorei;
    Macrobrachium nobilii;
    Macrobrachium occidentale;
    Macrobrachium olfersii;
    Macrobrachium pilimanus;
    Macrobrachium potiuna;
    Macrobrachium rude;
    Macrobrachium sintangense;
    Macrobrachium surinamicum;
    Macrobrachium tenellum;
    Macrobrachium vollenhovenii;
    Macrobrachium yui
  `, [7,14], 80);

  // ============================================================
  // MEERGARNALEN - SULAWESI
  // ============================================================

  meerdieren(`
    Kardinaalgarnaal=Caridina dennerli;
    Caridina caerulea;
    Caridina ensifera;
    Caridina glaubrechti;
    Caridina harlequin;
    Caridina holthuisi;
    Caridina lanceolata;
    Caridina loehae;
    Caridina masapi;
    Caridina matannensis;
    Caridina parvula;
    Caridina profundicola;
    Caridina sarasinorum;
    Caridina spinata;
    Caridina striata;
    Caridina tenuirostris;
    Caridina towutensis;
    Caridina woltereckae
  `, [7,14], 90);

  // ============================================================
  // TANGANYIKAMEER - GARNALEN EN KRABBEN
  // ============================================================

  meerdieren(`
    Limnocaridina tanganicae;
    Limnocaridina parvula;
    Limnocaridina reticulata;
    Limnocaridina similis;
    Limnocaridina iridinae;
    Limnocaridina latipes;
    Limnocaridina spinipes;
    Limnocaridina stappersii;
    Limnocaridina socius;
    Limnocaridina rotundata;
    Limnocaridina tanganyikae;
    Limnocaridina curta;
    Platythelphusa armata;
    Platythelphusa conculcata;
    Platythelphusa denticulata;
    Platythelphusa echinata;
    Platythelphusa immaculata;
    Platythelphusa maculata;
    Platythelphusa polita;
    Platythelphusa tuberculata;
    Platythelphusa praelongata
  `, [5,7], 90);

  // ============================================================
  // ZOETWATERKRABBEN
  // ============================================================

  rivierdieren(`
    Chinese wolhandkrab=Eriocheir sinensis;
    Potamon fluviatile;
    Potamon ibericum;
    Potamon potamios;
    Potamon persicum;
    Potamon magnum;
    Potamon bileki;
    Potamon karpathos;
    Potamon rhodium;
    Potamon hippocratis;
    Potamon pelops;
    Potamon kretaion;
    Potamon algeriense;
    Potamonautes perlatus;
    Potamonautes sidneyi;
    Potamonautes warreni;
    Potamonautes depressus;
    Potamonautes lividus;
    Potamonautes clarus;
    Potamonautes dentatus;
    Potamonautes parvispina;
    Potamonautes granularis;
    Potamonautes calcaratus;
    Potamonautes unispinus;
    Potamonautes lirrangensis;
    Potamonautes emini;
    Potamonautes niloticus;
    Potamonautes obesus;
    Potamonautes platynotus;
    Potamonautes johnstoni;
    Potamonautes montivagus;
    Potamonautes loveni;
    Potamonautes mutandensis;
    Potamonautes rukwanzi;
    Potamonautes williamsi;
    Geothelphusa dehaani;
    Geothelphusa albogilva;
    Geothelphusa ancylophallus;
    Geothelphusa aramotoi;
    Geothelphusa candidiensis;
    Geothelphusa cinerea;
    Geothelphusa dolichopodes;
    Geothelphusa ferruginea;
    Geothelphusa gracilipes;
    Geothelphusa miyazakii;
    Geothelphusa neipu;
    Geothelphusa olea;
    Geothelphusa pingtung;
    Geothelphusa shokitai;
    Geothelphusa takuan;
    Geothelphusa taroko;
    Geothelphusa tawu;
    Geothelphusa tsayae;
    Geothelphusa wutai
  `, [7,33], 85);

  // ============================================================
  // ZOETWATERMOSSELEN - EUROPA
  // ============================================================

  rivierEnMeerDieren(`
    Driehoeksmossel=Dreissena polymorpha;
    Quaggamossel=Dreissena rostriformis bugensis;
    Zwanenmossel=Anodonta cygnea;
    Vijvermossel=Anodonta anatina;
    Schildersmossel=Unio pictorum;
    Bolle stroommossel=Unio tumidus;
    Aziatische korfmossel=Corbicula fluminea;
    Toegeknepen korfmossel=Corbicula fluminalis;
    Chinese vijvermossel=Sinanodonta woodiana;
    Gewone hoornschors=Musculium lacustre;
    Gewone erwtenmossel=Pisidium casertanum;
    Pisidium nitidum;
    Pisidium subtruncatum;
    Pisidium henslowanum;
    Pisidium supinum;
    Pisidium amnicum;
    Pisidium milium;
    Pisidium personatum;
    Pisidium obtusale;
    Pisidium pulchellum;
    Pisidium hibernicum;
    Pisidium lilljeborgii;
    Pisidium conventus;
    Sphaerium corneum;
    Sphaerium rivicola;
    Sphaerium solidum;
    Sphaerium nucleus
  `, [30], 65);

  rivierdieren(`
    Zoetwaterparelmossel=Margaritifera margaritifera;
    Margaritifera auricularia;
    Bataafse stroommossel=Unio crassus;
    Unio mancus;
    Unio delphinus;
    Unio gibbus;
    Unio ravoisieri;
    Unio elongatulus;
    Potomida littoralis;
    Pseudanodonta complanata;
    Microcondylaea bonellii
  `, [30], 75);

  // ============================================================
  // NOORD-AMERIKAANSE ZOETWATERMOSSELEN
  // ============================================================

  rivierdieren(`
    Amblema plicata;
    Amblema neislerii;
    Amblema elliottii;
    Actinonaias ligamentina;
    Actinonaias pectorosa;
    Alasmidonta marginata;
    Alasmidonta varicosa;
    Alasmidonta heterodon;
    Alasmidonta raveneliana;
    Alasmidonta undulata;
    Alasmidonta viridis;
    Alasmidonta arcula;
    Alasmidonta triangulata;
    Anodontoides ferussacianus;
    Cyclonaias tuberculata;
    Cyclonaias pustulosa;
    Cyclonaias nodulata;
    Cyclonaias asperata;
    Cyclonaias refulgens;
    Cyclonaias succissa;
    Cyprogenia aberti;
    Cyprogenia stegaria;
    Dromus dromas;
    Ellipsaria lineolata;
    Elliptio complanata;
    Elliptio crassidens;
    Elliptio dilatata;
    Elliptio icterina;
    Elliptio arca;
    Elliptio arctata;
    Elliptio buckleyi;
    Elliptio congaraea;
    Elliptio dariensis;
    Elliptio fisheriana;
    Elliptio folliculata;
    Elliptio fraterna;
    Elliptio hopetonensis;
    Elliptio lanceolata;
    Elliptio marsupiobesa;
    Elliptio mcmichaeli;
    Elliptio producta;
    Elliptio pullata;
    Elliptio roanokensis;
    Elliptio rostriformis;
    Elliptio shepardiana;
    Elliptio spinosa;
    Elliptio steinstansana;
    Elliptio waccamawensis;
    Epioblasma brevidens;
    Epioblasma capsaeformis;
    Epioblasma florentina;
    Epioblasma obliquata;
    Epioblasma othcaloogensis;
    Epioblasma personata;
    Epioblasma torulosa;
    Epioblasma triquetra;
    Epioblasma walkeri;
    Fusconaia flava;
    Fusconaia cuneolus;
    Fusconaia cor;
    Fusconaia masoni;
    Fusconaia burkei;
    Fusconaia cerina;
    Fusconaia escambia;
    Fusconaia askewi;
    Fusconaia lananensis;
    Fusconaia mitchelli;
    Fusconaia ozarkensis;
    Glebula rotundata;
    Hemistena lata;
    Lasmigona costata;
    Lasmigona complanata;
    Lasmigona compressa;
    Lasmigona decorata;
    Lasmigona holstonia;
    Lasmigona subviridis;
    Leptodea fragilis;
    Leptodea leptodon;
    Leptodea ochracea;
    Ligumia recta;
    Ligumia nasuta;
    Ligumia subrostrata;
    Megalonaias nervosa;
    Obliquaria reflexa;
    Obovaria olivaria;
    Obovaria retusa;
    Obovaria subrotunda;
    Obovaria unicolor;
    Obovaria jacksoniana;
    Plethobasus cyphyus;
    Plethobasus cooperianus;
    Pleurobema clava;
    Pleurobema cordatum;
    Pleurobema decisum;
    Pleurobema furvum;
    Pleurobema georgianum;
    Pleurobema hanleyianum;
    Pleurobema perovatum;
    Pleurobema plenum;
    Pleurobema pyriforme;
    Pleurobema rubrum;
    Pleurobema sintoxia;
    Pleuronaia barnesiana;
    Pleuronaia dolabelloides;
    Pleuronaia gibberum;
    Potamilus alatus;
    Potamilus amphichaenus;
    Potamilus capax;
    Potamilus inflatus;
    Potamilus metnecktayi;
    Potamilus purpuratus;
    Ptychobranchus fasciolaris;
    Ptychobranchus greenii;
    Ptychobranchus jonesi;
    Ptychobranchus occidentalis;
    Ptychobranchus subtentum;
    Quadrula quadrula;
    Quadrula apiculata;
    Quadrula nobilis;
    Simpsonaias ambigua;
    Strophitus undulatus;
    Strophitus connasaugaensis;
    Strophitus subvexus;
    Theliderma cylindrica;
    Theliderma intermedia;
    Theliderma metanevra;
    Theliderma sparsa;
    Toxolasma parvum;
    Toxolasma lividum;
    Toxolasma paulum;
    Toxolasma pullus;
    Toxolasma texasiense;
    Toxolasma cylindrellus;
    Tritogonia verrucosa;
    Truncilla donaciformis;
    Truncilla truncata;
    Truncilla macrodon;
    Uniomerus tetralasmus;
    Uniomerus declivis;
    Uniomerus carolinianus;
    Utterbackia imbecillis;
    Utterbackia peggyae;
    Utterbackia peninsularis;
    Venustaconcha ellipsiformis;
    Venustaconcha pleasii;
    Villosa iris;
    Villosa lienosa;
    Villosa nebulosa;
    Villosa umbrans
  `, [30], 90);

  // ============================================================
  // MOSSELEN DIE OOK IN MEREN VOORKOMEN
  // ============================================================

  meerdieren(`
    Elliptio complanata;
    Pyganodon grandis;
    Pyganodon cataracta;
    Pyganodon lacustris;
    Pyganodon fragilis;
    Anodontoides ferussacianus;
    Utterbackia imbecillis;
    Ligumia nasuta;
    Amblema plicata;
    Lampsilis siliquoidea;
    Lampsilis radiata;
    Lampsilis cardium;
    Lampsilis teres;
    Lampsilis fasciola;
    Lampsilis ventricosa;
    Leptodea fragilis;
    Strophitus undulatus;
    Lasmigona complanata;
    Sphaerium striatinum;
    Sphaerium simile;
    Sphaerium occidentale;
    Musculium transversum;
    Pisidium compressum;
    Pisidium variabile;
    Pisidium fallax;
    Pisidium ferrugineum;
    Pisidium ventricosum;
    Pisidium lilljeborgii
  `, [30], 85);

  // ============================================================
  // AFRIKAANSE ZOETWATERMOSSELEN
  // ============================================================

  meerdieren(`
    Mutela bourguignati;
    Mutela tanganyicensis;
    Mutela spekii;
    Pleiodon spekii;
    Pseudospatha tanganyicensis;
    Moncetia anceyi;
    Grandidieria burtoni;
    Coelatura burtoni;
    Coelatura aegyptiaca;
    Coelatura mossambicensis;
    Coelatura choziensis;
    Aspatharia pfeifferiana;
    Chambardia wissmanni;
    Chambardia rubens;
    Chambardia wahlbergi
  `, [5,30], 90);

  // ============================================================
  // ZOETWATERSLAKKEN - EUROPA
  // ============================================================

  rivierEnMeerDieren(`
    Grote poelslak=Lymnaea stagnalis;
    Ovale poelslak=Radix balthica;
    Radix auricularia;
    Radix labiata;
    Stagnicola palustris;
    Stagnicola corvus;
    Stagnicola fuscus;
    Galba truncatula;
    Gewone schijfhoren=Planorbis planorbis;
    Draaikolkschijfhoren=Anisus vortex;
    Anisus vorticulus;
    Anisus leucostoma;
    Anisus spirorbis;
    Posthorenslak=Planorbarius corneus;
    Gekielde schijfhoren=Planorbis carinatus;
    Gyraulus albus;
    Gyraulus crista;
    Gyraulus laevis;
    Gyraulus riparius;
    Hippeutis complanatus;
    Segmentina nitida;
    Physa fontinalis;
    Bron-blaashoren=Physella acuta;
    Aplexa hypnorum;
    Viviparus viviparus;
    Viviparus contectus;
    Viviparus ater;
    Viviparus acerosus;
    Bithynia tentaculata;
    Bithynia leachii;
    Bithynia troschelii;
    Valvata piscinalis;
    Valvata cristata;
    Valvata macrostoma;
    Theodoxus fluviatilis;
    Theodoxus danubialis;
    Theodoxus transversalis;
    Potamopyrgus antipodarum;
    Lithoglyphus naticoides;
    Fagotia esperi;
    Fagotia acicularis
  `, [7,30], 70);

  // ============================================================
  // TANGANYIKAMEER - ENDEMISCHE SLAKKEN
  // ============================================================

  meerdieren(`
    Tiphobia horei;
    Lavigeria nassa;
    Lavigeria grandis;
    Lavigeria coronata;
    Lavigeria smithi;
    Lavigeria paucicostata;
    Lavigeria livingstoniana;
    Lavigeria spinulosa;
    Lavigeria littoralis;
    Lavigeria locardiana;
    Lavigeria rufofilosa;
    Lavigeria paucicostata;
    Lavigeria arenarum;
    Lavigeria crassilabris;
    Lavigeria josseti;
    Lavigeria macrocarpa;
    Lavigeria reymondi;
    Lavigeria solidula;
    Lavigeria stappersi;
    Paramelania damoni;
    Paramelania crassigranulata;
    Paramelania iridescens;
    Paramelania imperialis;
    Paramelania paucicostata;
    Paramelania minor;
    Paramelania tanganyicensis;
    Spekia zonata;
    Stormsia minima;
    Tanganyicia rufofilosa;
    Chytra kirkii;
    Reymondia horei;
    Reymondia tanganyicensis;
    Syrnolopsis lacustris;
    Syrnolopsis gracilis;
    Syrnolopsis minuta;
    Anceya giraudi;
    Martelia tanganyicensis;
    Bathanalia howesi;
    Limnotrochus thomsoni;
    Bridouxia grandidieriana;
    Bridouxia giraudi;
    Bridouxia ponsonbyi;
    Edgaria nassa;
    Stanleya neritinoides;
    Vinundu guillemei;
    Vinundu westae
  `, [5,30], 90);

  // ============================================================
  // SLAKKEN UIT DE MEREN VAN SULAWESI
  // ============================================================

  meerdieren(`
    Tylomelania patriarchalis;
    Tylomelania gemmifera;
    Tylomelania towutensis;
    Tylomelania matannensis;
    Tylomelania sarasinorum;
    Tylomelania zeamais;
    Tylomelania perfecta;
    Tylomelania palicolarum;
    Tylomelania amphiderita;
    Tylomelania inconspicua;
    Tylomelania kristinae;
    Tylomelania lalemae;
    Tylomelania mahalonensis;
    Tylomelania marwotoae;
    Tylomelania masapensis;
    Tylomelania molesta;
    Tylomelania monacha;
    Tylomelania palicolarum;
    Tylomelania scalariopsis;
    Tylomelania turriformis;
    Tylomelania wolterecki;
    Tylomelania wesseli;
    Tylomelania baskasti;
    Tylomelania helmuti;
    Tylomelania sinabartfeldi;
    Tylomelania hannelorae;
    Tylomelania kuli;
    Tylomelania bakara
  `, [30], 90);

  // Tylomelania-soorten zijn levendbarend.
  // Daarom krijgen deze niet automatisch vraag 7.

  // ============================================================
  // AFRIKAANSE ZOETWATERSLAKKEN
  // ============================================================

  rivierEnMeerDieren(`
    Biomphalaria pfeifferi;
    Biomphalaria sudanica;
    Biomphalaria choanomphala;
    Biomphalaria alexandrina;
    Biomphalaria camerunensis;
    Biomphalaria stanleyi;
    Bulinus truncatus;
    Bulinus globosus;
    Bulinus africanus;
    Bulinus nasutus;
    Bulinus forskalii;
    Bulinus tropicus;
    Bulinus nyassanus;
    Bulinus ugandae;
    Bulinus senegalensis;
    Bulinus africanus;
    Melanoides tuberculata;
    Cleopatra bulimoides;
    Cleopatra ferruginea;
    Pila ovata;
    Pila wernei;
    Pila africana;
    Pila speciosa;
    Lanistes ovum;
    Lanistes carinatus;
    Lanistes ellipticus;
    Lanistes nyassanus;
    Lanistes solidus;
    Bellamya unicolor;
    Bellamya capillata;
    Bellamya trochlearis;
    Bellamya constricta;
    Bellamya ecclesi;
    Bellamya jeffreysi;
    Gabbiella humerosa;
    Gabbiella stanleyi
  `, [5,30], 80);

  // ============================================================
  // AZIATISCHE ZOETWATERSLAKKEN
  // ============================================================

  rivierEnMeerDieren(`
    Anentome helena=Clea helena=Slaketende slak;
    Filopaludina martensi;
    Filopaludina sumatrensis;
    Filopaludina bengalensis;
    Cipangopaludina chinensis;
    Cipangopaludina japonica;
    Sinotaia quadrata;
    Sinotaia aeruginosa;
    Bellamya dissimilis;
    Bellamya crassa;
    Brotia pagodula;
    Brotia herculea;
    Brotia costula;
    Brotia armata;
    Brotia binodosa;
    Brotia citrina;
    Brotia dautzenbergi;
    Brotia peninsularis;
    Brotia spinata;
    Sulcospira testudinaria;
    Sulcospira hainanensis;
    Sulcospira tonkiniana;
    Sermyla riquetii;
    Thiara scabra;
    Tarebia granifera;
    Melanoides tuberculata;
    Pila ampullacea;
    Pila globosa;
    Pila polita;
    Pila pesmei;
    Pila conica;
    Pila virescens;
    Radix rubiginosa;
    Radix acuminata;
    Radix luteola;
    Radix plicatula
  `, [30], 80);

  // ============================================================
  // AMERIKAANSE APPELSLAKKEN
  // ============================================================

  rivierEnMeerDieren(`
    Pomacea canaliculata;
    Pomacea maculata;
    Pomacea diffusa;
    Pomacea bridgesii;
    Pomacea paludosa;
    Pomacea lineata;
    Pomacea scalaris;
    Pomacea glauca;
    Pomacea haustrum;
    Pomacea flagellata;
    Pomacea sordida;
    Pomacea patula;
    Marisa cornuarietis;
    Asolene spixii;
    Asolene platae;
    Asolene pulchella;
    Felipponea neritiniformis;
    Pomella megastoma
  `, [7,30], 75);

  // ============================================================
  // NOORD-AMERIKAANSE ZOETWATERSLAKKEN
  // ============================================================

  rivierEnMeerDieren(`
    Campeloma decisum;
    Campeloma integrum;
    Campeloma geniculum;
    Campeloma limum;
    Campeloma parthenum;
    Lioplax subcarinata;
    Lioplax sulculosa;
    Viviparus georgianus;
    Valvata tricarinata;
    Valvata sincera;
    Valvata utahensis;
    Cincinnatia integra;
    Amnicola limosus;
    Amnicola walkeri;
    Marstonia lustrica;
    Marstonia pachyta;
    Marstonia ogmorhaphe;
    Marstonia scalariformis;
    Marstonia arga;
    Somatogyrus depressus;
    Somatogyrus virginicus;
    Somatogyrus pennsylvanicus;
    Somatogyrus rosewateri;
    Physella gyrina;
    Physella ancillaria;
    Physella heterostropha;
    Physella pomilia;
    Physella parkeri;
    Physella virgata;
    Helisoma anceps;
    Planorbella trivolvis;
    Planorbella duryi;
    Planorbella campanulata;
    Planorbella pilsbryi;
    Planorbella scalaris;
    Gyraulus parvus;
    Gyraulus circumstriatus;
    Promenetus exacuous;
    Promenetus umbilicatellus;
    Ferrissia fragilis;
    Ferrissia rivularis
  `, [30], 85);

  // ============================================================
  // ZOETWATERPISSEBEDDEN
  // ============================================================

  rivierEnMeerDieren(`
    Zoetwaterpissebed=Asellus aquaticus;
    Proasellus meridianus;
    Proasellus coxalis;
    Proasellus communis;
    Caecidotea communis;
    Caecidotea intermedia;
    Caecidotea racovitzai;
    Caecidotea obtusa;
    Caecidotea forbesi;
    Caecidotea scrupulosa;
    Lirceus lineatus;
    Lirceus fontinalis
  `, [7], 70);

  meerdieren(`
    Asellus hilgendorfii;
    Asellus latifrons;
    Mysis relicta;
    Mysis salemaai;
    Mysis segerstralei;
    Mysis diluviana;
    Mysis mixta;
    Pallasea quadrispinosa;
    Monoporeia affinis;
    Gammaracanthus lacustris;
    Gammarus lacustris;
    Diporeia hoyi
  `, [], 85);

  // ============================================================
  // VLOKREEFTEN
  // ============================================================

  rivierEnMeerDieren(`
    Gammarus pulex;
    Gammarus fossarum;
    Gammarus roeselii;
    Gammarus tigrinus;
    Gammarus lacustris;
    Gammarus balcanicus;
    Gammarus kischineffensis;
    Gammarus komareki;
    Gammarus leopoliensis;
    Gammarus varsoviensis;
    Dikerogammarus villosus;
    Dikerogammarus haemobaphes;
    Dikerogammarus bispinosus;
    Chelicorophium curvispinum;
    Chelicorophium robustum;
    Chelicorophium sowinskyi;
    Echinogammarus ischnus;
    Echinogammarus trichiatus;
    Echinogammarus berilloni;
    Echinogammarus veneris;
    Echinogammarus stammeri;
    Crangonyx pseudogracilis;
    Crangonyx floridanus;
    Crangonyx richmondensis;
    Crangonyx gracilis;
    Crangonyx rivularis;
    Crangonyx shoemakeri;
    Hyalella azteca;
    Hyalella curvispina;
    Hyalella patagonica;
    Hyalella longistila;
    Hyalella bonariensis
  `, [7], 80);

  // ============================================================
  // BAIKALMEER - VLOKREEFTEN
  // ============================================================

  meerdieren(`
    Acanthogammarus victorii;
    Acanthogammarus lappaceus;
    Acanthogammarus godlewskii;
    Acanthogammarus maximus;
    Acanthogammarus grewingkii;
    Acanthogammarus albus;
    Acanthogammarus reichertii;
    Acanthogammarus maculosus;
    Brandtia latissima;
    Brandtia parasitica;
    Brandtia semicarinata;
    Brandtia fasciata;
    Eulimnogammarus verrucosus;
    Eulimnogammarus cyaneus;
    Eulimnogammarus vittatus;
    Eulimnogammarus marituji;
    Eulimnogammarus viridis;
    Eulimnogammarus maackii;
    Eulimnogammarus cruentus;
    Eulimnogammarus obtusatus;
    Eulimnogammarus trilineatus;
    Eulimnogammarus olivaceus;
    Eulimnogammarus petalophthalmus;
    Eulimnogammarus violaceus;
    Eulimnogammarus ussolzewii;
    Eulimnogammarus rhodophthalmus;
    Eulimnogammarus scaber;
    Eulimnogammarus czerskii;
    Gmelinoides fasciatus;
    Micruropus wohlii;
    Micruropus possolskii;
    Micruropus fixsenii;
    Micruropus talitroides;
    Micruropus flavus;
    Micruropus parvulus;
    Micruropus glaber;
    Micruropus wahli;
    Pallasea cancellus;
    Pallasea grubei;
    Pallasea puzillii;
    Pallasea brandtii;
    Pallasea kessleri;
    Pallasea macrophtalma;
    Ommatogammarus flavus;
    Ommatogammarus albinus;
    Ommatogammarus carneolus;
    Macrohectopus branickii;
    Parapallasea borowskii;
    Parapallasea lagowskii;
    Parapallasea puzyllii
  `, [7,24], 90);

  // ============================================================
  // WATERVLOOIEN EN ROEIPOOTKREEFTJES
  // ============================================================

  meerdieren(`
    Watervlo=Daphnia;
    Daphnia magna;
    Daphnia pulex;
    Daphnia pulicaria;
    Daphnia longispina;
    Daphnia galeata;
    Daphnia cucullata;
    Daphnia hyalina;
    Daphnia lacustris;
    Daphnia dentifera;
    Daphnia mendotae;
    Daphnia retrocurva;
    Daphnia ambigua;
    Daphnia parvula;
    Daphnia dubia;
    Daphnia cristata;
    Daphnia longiremis;
    Daphnia curvirostris;
    Daphnia atkinsoni;
    Daphnia obtusa;
    Daphnia similis;
    Daphnia lumholtzi;
    Daphnia carinata;
    Daphnia barbata;
    Daphnia exilis;
    Ceriodaphnia reticulata;
    Ceriodaphnia quadrangula;
    Ceriodaphnia dubia;
    Ceriodaphnia pulchella;
    Ceriodaphnia laticaudata;
    Ceriodaphnia megops;
    Bosmina longirostris;
    Bosmina coregoni;
    Bosmina longispina;
    Bosmina tubicen;
    Bosminopsis deitersi;
    Diaphanosoma brachyurum;
    Diaphanosoma lacustris;
    Diaphanosoma birgei;
    Diaphanosoma fluviatile;
    Diaphanosoma excisum;
    Sida crystallina;
    Latona setifera;
    Leptodora kindtii;
    Bythotrephes longimanus;
    Polyphemus pediculus;
    Chydorus sphaericus;
    Chydorus ovalis;
    Chydorus piger;
    Alona quadrangularis;
    Alona affinis;
    Alona guttata;
    Eurycercus lamellatus;
    Eurycercus glacialis;
    Acroperus harpae;
    Graptoleberis testudinaria;
    Pleuroxus aduncus;
    Pleuroxus truncatus;
    Pleuroxus uncinatus;
    Pleuroxus trigonellus;
    Scapholeberis mucronata;
    Simocephalus vetulus;
    Simocephalus serrulatus;
    Simocephalus exspinosus;
    Moina macrocopa;
    Moina micrura;
    Moina brachiata;
    Moina rectirostris;
    Moina affinis
  `, [7,10,14], 85);

  meerdieren(`
    Cyclops vicinus;
    Cyclops strenuus;
    Cyclops abyssorum;
    Cyclops kolensis;
    Cyclops scutifer;
    Cyclops insignis;
    Cyclops bohater;
    Cyclops lacustris;
    Cyclops prealpinus;
    Acanthocyclops robustus;
    Acanthocyclops vernalis;
    Acanthocyclops americanus;
    Mesocyclops leuckarti;
    Mesocyclops edax;
    Mesocyclops thermocyclopoides;
    Mesocyclops ogunnus;
    Mesocyclops aequatorialis;
    Mesocyclops longisetus;
    Mesocyclops pehpeiensis;
    Thermocyclops crassus;
    Thermocyclops oithonoides;
    Thermocyclops decipiens;
    Thermocyclops inversus;
    Thermocyclops neglectus;
    Eucyclops serrulatus;
    Eucyclops macrurus;
    Eucyclops speratus;
    Eucyclops agilis;
    Eudiaptomus gracilis;
    Eudiaptomus graciloides;
    Eudiaptomus vulgaris;
    Eudiaptomus padanus;
    Eudiaptomus intermedius;
    Eudiaptomus drieschi;
    Eudiaptomus zachariasi;
    Diaptomus castor;
    Diaptomus cyaneus;
    Diaptomus kenitraensis;
    Leptodiaptomus ashlandi;
    Leptodiaptomus minutus;
    Leptodiaptomus sicilis;
    Leptodiaptomus siciloides;
    Skistodiaptomus oregonensis;
    Skistodiaptomus pallidus;
    Hesperodiaptomus arcticus;
    Hesperodiaptomus shoshone;
    Hesperodiaptomus franciscanus;
    Limnocalanus macrurus;
    Senecella calanoides;
    Epischura lacustris;
    Epischura nevadensis;
    Epischura baikalensis;
    Sinocalanus tenellus;
    Sinocalanus doerrii;
    Pseudodiaptomus forbesi;
    Pseudodiaptomus inopinus;
    Pseudodiaptomus annandalei;
    Pseudodiaptomus tunguidus;
    Pseudodiaptomus poplesia;
    Boeckella gracilipes;
    Boeckella titicacae;
    Boeckella poopoensis;
    Boeckella hamata;
    Boeckella dilatata;
    Boeckella triarticulata;
    Boeckella major;
    Calamoecia ampulla;
    Calamoecia tasmanica;
    Calamoecia lucasi;
    Calamoecia clitellata
  `, [7,10,14], 90);

  // ============================================================
  // ZOETWATERKWALLEN
  // ============================================================

  meerdieren(`
    Zoetwaterkwal=Craspedacusta sowerbii;
    Craspedacusta sinensis;
    Craspedacusta kiatingi;
    Craspedacusta iseanum
  `, [14,17,30], 65);

  meerdieren(`
    Limnocnida tanganjicae;
    Limnocnida victoriae
  `, [5,14,17,30], 85);

  rivierdieren(`
    Limnocnida indica;
    Hydra vulgaris;
    Hydra oligactis;
    Hydra viridissima;
    Hydra circumcincta
  `, [17], 80);

  // ============================================================
  // ZOETWATERSPONZEN
  // ============================================================

  rivierEnMeerDieren(`
    Spongilla lacustris;
    Spongilla alba;
    Spongilla cenota;
    Spongilla proliferens;
    Ephydatia fluviatilis;
    Ephydatia muelleri;
    Eunapius fragilis;
    Eunapius carteri;
    Eunapius subterraneus;
    Heteromeyenia baileyi;
    Heteromeyenia tubisperma;
    Trochospongilla horrida;
    Trochospongilla leidii;
    Trochospongilla pennsylvanica;
    Radiospongilla cerebellata;
    Radiospongilla sendai
  `, [], 90);

  meerdieren(`
    Lubomirskia baicalensis;
    Lubomirskia abietina;
    Lubomirskia fusifera;
    Lubomirskia incrustans;
    Baikalospongia bacillifera;
    Baikalospongia intermedia;
    Baikalospongia recta;
    Baikalospongia martinsoni;
    Swartschewskia papyracea;
    Swartschewskia irregularis;
    Rezinkovia echinata
  `, [24], 90);

  // ============================================================
  // ZOETWATERBRYOZOËN
  // ============================================================

  rivierEnMeerDieren(`
    Cristatella mucedo;
    Plumatella repens;
    Plumatella fungosa;
    Plumatella emarginata;
    Plumatella fruticosa;
    Plumatella casmiana;
    Plumatella geimermassardi;
    Plumatella vaihiriae;
    Plumatella nitens;
    Fredericella sultana;
    Fredericella indica;
    Pectinatella magnifica;
    Lophopus crystallinus;
    Lophopodella carteri;
    Paludicella articulata;
    Hislopia lacustris;
    Hislopia malayensis
  `, [], 90);

  // ============================================================
  // ZOETWATERWORMEN EN BLOEDZUIGERS
  // ============================================================

  rivierEnMeerDieren(`
    Tubifex tubifex;
    Limnodrilus hoffmeisteri;
    Limnodrilus claparedeianus;
    Limnodrilus udekemianus;
    Limnodrilus profundicola;
    Limnodrilus cervix;
    Potamothrix hammoniensis;
    Potamothrix moldaviensis;
    Potamothrix vejdovskyi;
    Potamothrix heuscheri;
    Potamothrix bavaricus;
    Branchiura sowerbyi;
    Aulodrilus pluriseta;
    Aulodrilus pigueti;
    Aulodrilus limnobius;
    Psammoryctides barbatus;
    Psammoryctides moravicus;
    Ilyodrilus templetoni;
    Bothrioneurum vejdovskyanum;
    Nais communis;
    Nais variabilis;
    Nais elinguis;
    Nais pardalis;
    Nais bretscheri;
    Nais barbata;
    Nais simplex;
    Nais christinae;
    Stylaria lacustris;
    Dero digitata;
    Dero dorsalis;
    Dero obtusa;
    Pristina longiseta;
    Pristina aequiseta;
    Pristina leidyi;
    Chaetogaster diaphanus;
    Chaetogaster diastrophus;
    Chaetogaster limnaei;
    Ophidonais serpentina;
    Vejdovskyella comata;
    Uncinais uncinata;
    Slavina appendiculata;
    Ripistes parasita;
    Lumbriculus variegatus;
    Stylodrilus heringianus;
    Stylodrilus lemani;
    Haplotaxis gordioides
  `, [], 85);

  rivierEnMeerDieren(`
    Paardenbloedzuiger=Haemopis sanguisuga;
    Medicinale bloedzuiger=Hirudo medicinalis;
    Hirudo verbana;
    Hirudo orientalis;
    Hirudo troctina;
    Erpobdella octoculata;
    Erpobdella testacea;
    Erpobdella nigricollis;
    Erpobdella monostriata;
    Erpobdella punctata;
    Erpobdella obscura;
    Dina lineata;
    Dina punctata;
    Dina stschegolewi;
    Trocheta subviridis;
    Trocheta bykowskii;
    Glossiphonia complanata;
    Glossiphonia heteroclita;
    Glossiphonia concolor;
    Helobdella stagnalis;
    Helobdella europaea;
    Helobdella triserialis;
    Helobdella robusta;
    Helobdella modesta;
    Placobdella costata;
    Placobdella parasitica;
    Placobdella ornata;
    Hemiclepsis marginata;
    Theromyzon tessulatum;
    Piscicola geometra;
    Piscicola respirans
  `, [], 80);

  // ============================================================
  // PLATWORMEN
  // ============================================================

  rivierEnMeerDieren(`
    Dendrocoelum lacteum;
    Dugesia gonocephala;
    Dugesia japonica;
    Dugesia tigrina=Girardia tigrina;
    Dugesia lugubris;
    Schmidtea mediterranea;
    Schmidtea polychroa;
    Schmidtea lugubris;
    Polycelis nigra;
    Polycelis tenuis;
    Polycelis felina;
    Planaria torva;
    Phagocata vitta;
    Phagocata gracilis;
    Crenobia alpina;
    Bdellocephala punctata
  `, [17,30], 85);

  // ============================================================
  // WATERINSECTEN - WATERKEVERS
  // ============================================================

  meerdieren(`
    Geelgerande watertor=Dytiscus marginalis;
    Dytiscus circumcinctus;
    Dytiscus circumflexus;
    Dytiscus dimidiatus;
    Dytiscus lapponicus;
    Dytiscus latissimus;
    Dytiscus semisulcatus;
    Dytiscus verticalis;
    Dytiscus fasciventris;
    Dytiscus harrisii;
    Dytiscus hybridus;
    Dytiscus cordieri;
    Cybister lateralimarginalis;
    Cybister tripunctatus;
    Cybister chinensis;
    Cybister fimbriolatus;
    Cybister explanatus;
    Hydaticus seminiger;
    Hydaticus transversalis;
    Hydaticus continentalis;
    Hydaticus grammicus;
    Graphoderus bilineatus;
    Graphoderus cinereus;
    Graphoderus zonatus;
    Graphoderus austriacus;
    Acilius sulcatus;
    Acilius canaliculatus;
    Acilius mediatus;
    Acilius semisulcatus;
    Acilius fraternus;
    Colymbetes fuscus;
    Colymbetes striatus;
    Colymbetes paykulli;
    Colymbetes dolabratus;
    Colymbetes sculptilis;
    Rhantus suturalis;
    Rhantus frontalis;
    Rhantus grapii;
    Rhantus exsoletus;
    Rhantus latitans;
    Rhantus bistriatus;
    Rhantus consputus;
    Rhantus suturellus;
    Agabus bipustulatus;
    Agabus sturmii;
    Agabus undulatus;
    Agabus nebulosus;
    Agabus conspersus;
    Agabus uliginosus;
    Agabus affinis;
    Agabus congener;
    Agabus labiatus;
    Ilybius fuliginosus;
    Ilybius ater;
    Ilybius fenestratus;
    Ilybius quadriguttatus;
    Ilybius subaeneus;
    Ilybius guttiger;
    Ilybius aenescens;
    Ilybius crassus;
    Ilybius wasastjernae;
    Ilybius chalconatus;
    Ilybius montanus;
    Hydroporus palustris;
    Hydroporus planus;
    Hydroporus erythrocephalus;
    Hydroporus tristis;
    Hydroporus umbrosus;
    Hydroporus obscurus;
    Hydroporus melanarius;
    Hydroporus memnonius;
    Hydroporus neglectus;
    Hydroporus striola;
    Hydroporus scalesianus;
    Hydroporus incognitus;
    Hydroporus gyllenhalii;
    Hydroporus morio;
    Hydroporus longicornis;
    Hydroporus pubescens;
    Hyphydrus ovatus;
    Hygrotus inaequalis;
    Hygrotus versicolor;
    Hygrotus impressopunctatus;
    Hygrotus decoratus;
    Hygrotus quinquelineatus;
    Laccophilus minutus;
    Laccophilus hyalinus;
    Laccophilus poecilus
  `, [7,14,17], 85);

  // ============================================================
  // WATERKEVERS VAN STROMEND WATER
  // ============================================================

  rivierdieren(`
    Elmis aenea;
    Elmis maugetii;
    Elmis obscura;
    Elmis rioloides;
    Elmis latreillei;
    Elmis bosnica;
    Elmis rietscheli;
    Limnius volckmari;
    Limnius perrisi;
    Limnius opacus;
    Limnius intermedius;
    Oulimnius tuberculatus;
    Oulimnius troglodytes;
    Oulimnius major;
    Oulimnius rivularis;
    Riolus cupreus;
    Riolus subviolaceus;
    Riolus illiesi;
    Esolus parallelepipedus;
    Esolus angustatus;
    Esolus pygmaeus;
    Esolus berthelemyi;
    Macronychus quadrituberculatus;
    Stenelmis canaliculata;
    Stenelmis crenata;
    Stenelmis sexlineata;
    Stenelmis bicarinata;
    Stenelmis lateralis;
    Stenelmis vittipennis;
    Stenelmis quadrimaculata;
    Stenelmis markeli;
    Stenelmis musgravei;
    Stenelmis sinuata;
    Stenelmis grossa;
    Stenelmis gammoni;
    Optioservus fastiditus;
    Optioservus trivittatus;
    Optioservus ovalis;
    Optioservus ampliatus;
    Optioservus heteroclitus;
    Optioservus phaeus;
    Heterlimnius corpulentus;
    Zaitzevia parvula;
    Zaitzevia posthonia;
    Zaitzevia rivalis;
    Dubiraphia bivittata;
    Dubiraphia quadrinotata;
    Dubiraphia vittata;
    Dubiraphia giulianii;
    Dubiraphia minima;
    Dubiraphia parva;
    Dubiraphia brevis;
    Dubiraphia elegans;
    Dubiraphia brunnescens;
    Ancyronyx variegatus;
    Ancyronyx procerus;
    Ancyronyx patrolus;
    Ancyronyx malickyi;
    Ancyronyx schillhammeri
  `, [7], 90);

  // ============================================================
  // WATERWANTSEN
  // ============================================================

  rivierEnMeerDieren(`
    Rugzwemmer=Notonecta glauca;
    Notonecta viridis;
    Notonecta maculata;
    Notonecta obliqua;
    Notonecta lutea;
    Notonecta reuteri;
    Notonecta marmorea;
    Notonecta undulata;
    Notonecta irrorata;
    Notonecta insulata;
    Notonecta kirbyi;
    Anisops sardeus;
    Anisops debilis;
    Anisops niveus;
    Anisops wakefieldi;
    Buenoa margaritacea;
    Buenoa scimitra;
    Buenoa confusa;
    Buenoa platycnemis;
    Plea minutissima;
    Sigara striata;
    Sigara falleni;
    Sigara lateralis;
    Sigara distincta;
    Sigara dorsalis;
    Sigara fossarum;
    Sigara nigrolineata;
    Sigara semistriata;
    Sigara stagnalis;
    Sigara limitata;
    Sigara scotti;
    Sigara venusta;
    Corixa punctata;
    Corixa dentipes;
    Corixa affinis;
    Hesperocorixa sahlbergi;
    Hesperocorixa linnaei;
    Hesperocorixa castanea;
    Hesperocorixa moesta;
    Cymatia coleoptrata;
    Cymatia bonsdorffii;
    Callicorixa praeusta;
    Callicorixa wollastoni;
    Paracorixa concinna;
    Arctocorisa germari;
    Micronecta scholtzi;
    Micronecta griseola;
    Micronecta minutissima;
    Micronecta poweri;
    Ilyocoris cimicoides;
    Waterschorpioen=Nepa cinerea;
    Staafwants=Ranatra linearis;
    Ranatra chinensis;
    Ranatra fusca;
    Ranatra elongata;
    Belostoma flumineum;
    Belostoma lutarium;
    Belostoma testaceopallidum;
    Belostoma elegans;
    Lethocerus americanus;
    Lethocerus indicus;
    Lethocerus maximus;
    Lethocerus deyrolli;
    Lethocerus patruelis;
    Lethocerus annulipes;
    Lethocerus griseus
  `, [7], 80);

  // ============================================================
  // SCHAATSENRIJDERS
  // ============================================================

  meerdieren(`
    Gerris lacustris;
    Gerris odontogaster;
    Gerris argentatus;
    Gerris thoracicus;
    Gerris lateralis;
    Gerris gibbifer;
    Gerris asper;
    Gerris costae;
    Gerris buenoi;
    Gerris comatus;
    Gerris marginatus;
    Gerris remigis;
    Aquarius paludum;
    Aquarius najas;
    Aquarius remigis;
    Aquarius elongatus;
    Aquarius conformis;
    Limnoporus rufoscutellatus;
    Limnoporus dissortis;
    Limnoporus notabilis;
    Limnoporus canaliculatus;
    Limnoporus nearcticus;
    Limnogonus fossarum;
    Limnogonus nitidus;
    Limnogonus guttatus;
    Limnogonus hypoleucus;
    Limnogonus franciscanus;
    Rheumatobates rileyi
  `, [7,15,17], 80);

  // ============================================================
  // LIBELLEN MET LARVEN IN RIVIEREN
  // ============================================================

  // De larven leven in het water.
  // Volwassen dieren leven voornamelijk buiten het water.
  // Daarom voegen we geen automatische zwemkoppeling toe.

  rivierdieren(`
    Beekrombout=Gomphus vulgatissimus;
    Rivierrombout=Stylurus flavipes;
    Gaffellibel=Ophiogomphus cecilia;
    Kleine tanglibel=Onychogomphus forcipatus;
    Onychogomphus uncatus;
    Onychogomphus costae;
    Onychogomphus assimilis;
    Platycnemis pennipes;
    Platycnemis latipes;
    Platycnemis acutipennis;
    Platycnemis subdilatata;
    Calopteryx splendens;
    Calopteryx virgo;
    Calopteryx haemorrhoidalis;
    Calopteryx xanthostoma;
    Calopteryx syriaca;
    Calopteryx maculata;
    Calopteryx aequabilis;
    Calopteryx amata;
    Calopteryx dimidiata;
    Hetaerina americana;
    Hetaerina titia;
    Hetaerina vulnerata;
    Hetaerina occisa;
    Hetaerina cruentata;
    Hetaerina capitalis;
    Hetaerina rosea;
    Hetaerina brightwelli;
    Hetaerina caja;
    Hetaerina longipes;
    Neurobasis chinensis;
    Neurobasis kaupi;
    Neurobasis longipes;
    Neurobasis australis;
    Euphaea variegata;
    Euphaea decorata;
    Euphaea ochracea;
    Euphaea formosa;
    Euphaea masoni;
    Euphaea tricolor;
    Euphaea impar;
    Euphaea lara;
    Euphaea superba;
    Euphaea splendens;
    Rhinocypha bisignata;
    Rhinocypha fenestrella;
    Rhinocypha perforata;
    Rhinocypha colorata;
    Rhinocypha trimaculata;
    Rhinocypha unicolor;
    Rhinocypha biforata;
    Rhinocypha fulgipennis;
    Chlorocypha cancellata;
    Chlorocypha curta;
    Chlorocypha dispar;
    Chlorocypha glauca;
    Chlorocypha luminosa;
    Chlorocypha rubida;
    Chlorocypha sanguinolenta;
    Chlorocypha seydeli
  `, [2,7,15,17], 85);

  // ============================================================
  // LIBELLEN EN WATERJUFFERS VAN MEREN
  // ============================================================

  meerdieren(`
    Grote keizerlibel=Anax imperator;
    Anax parthenope;
    Anax junius;
    Anax guttatus;
    Anax papuensis;
    Anax ephippiger;
    Anax longipes;
    Anax tristis;
    Aeshna grandis;
    Aeshna cyanea;
    Aeshna mixta;
    Aeshna juncea;
    Aeshna subarctica;
    Aeshna serrata;
    Aeshna crenata;
    Aeshna isoceles;
    Aeshna viridis;
    Aeshna affinis;
    Aeshna caerulea;
    Aeshna eremita;
    Aeshna canadensis;
    Aeshna constricta;
    Aeshna palmata;
    Aeshna interrupta;
    Aeshna umbrosa;
    Aeshna tuberculifera;
    Aeshna verticalis;
    Brachytron pratense;
    Cordulia aenea;
    Cordulia amurensis;
    Somatochlora metallica;
    Somatochlora flavomaculata;
    Somatochlora arctica;
    Somatochlora alpestris;
    Somatochlora sahlbergi;
    Somatochlora hudsonica;
    Somatochlora semicircularis;
    Libellula quadrimaculata;
    Libellula depressa;
    Libellula fulva;
    Libellula luctuosa;
    Libellula pulchella;
    Libellula incesta;
    Libellula vibrans;
    Libellula semifasciata;
    Libellula saturata;
    Libellula forensis;
    Orthetrum cancellatum;
    Orthetrum albistylum;
    Orthetrum coerulescens;
    Orthetrum brunneum;
    Orthetrum chrysostigma;
    Orthetrum sabina;
    Orthetrum triangulare;
    Orthetrum pruinosum;
    Orthetrum glaucum;
    Crocothemis erythraea;
    Crocothemis servilia;
    Crocothemis sanguinolenta;
    Sympetrum striolatum;
    Sympetrum vulgatum;
    Sympetrum sanguineum;
    Sympetrum flaveolum;
    Sympetrum danae;
    Sympetrum fonscolombii;
    Sympetrum meridionale;
    Sympetrum depressiusculum;
    Sympetrum pedemontanum;
    Sympetrum vicinum;
    Sympetrum obtrusum;
    Sympetrum internum;
    Sympetrum rubicundulum;
    Leucorrhinia dubia;
    Leucorrhinia rubicunda;
    Leucorrhinia pectoralis;
    Leucorrhinia albifrons;
    Leucorrhinia caudalis;
    Leucorrhinia intacta;
    Leucorrhinia frigida;
    Leucorrhinia glacialis;
    Leucorrhinia hudsonica;
    Leucorrhinia proxima;
    Coenagrion puella;
    Coenagrion pulchellum;
    Coenagrion hastulatum;
    Coenagrion lunulatum;
    Coenagrion armatum;
    Coenagrion johanssoni;
    Coenagrion resolutum;
    Coenagrion angulatum;
    Enallagma cyathigerum;
    Enallagma annexum;
    Enallagma boreale;
    Enallagma civile;
    Enallagma carunculatum;
    Enallagma hageni;
    Enallagma ebrium;
    Enallagma geminatum;
    Enallagma vesperum;
    Enallagma signatum;
    Enallagma exsulans;
    Enallagma aspersum;
    Enallagma basidens;
    Enallagma traviatum;
    Ischnura elegans;
    Ischnura pumilio;
    Ischnura graellsii;
    Ischnura senegalensis;
    Ischnura heterosticta;
    Ischnura aurora;
    Ischnura posita;
    Ischnura verticalis;
    Ischnura cervula;
    Ischnura perparva;
    Ischnura ramburii;
    Erythromma najas;
    Erythromma viridulum;
    Erythromma lindenii
  `, [2,7,15,17], 80);

  // ============================================================
  // EENDAGSVLIEGEN VAN RIVIEREN
  // ============================================================

  rivierdieren(`
    Ephemera danica;
    Ephemera vulgata;
    Ephemera lineata;
    Ephemera guttulata;
    Ephemera simulans;
    Ephemera varia;
    Ephemera compar;
    Ephemera orientalis;
    Ephoron virgo;
    Ephoron album;
    Ephoron leukon;
    Palingenia longicauda;
    Palingenia fuliginosa;
    Polymitarcys virgo;
    Oligoneuriella rhenana;
    Oligoneuriella pallida;
    Oligoneuriella polonica;
    Heptagenia sulphurea;
    Heptagenia flava;
    Heptagenia coerulans;
    Heptagenia longicauda;
    Heptagenia marginalis;
    Heptagenia pulla;
    Heptagenia elegantula;
    Heptagenia diabasia;
    Heptagenia interpunctata;
    Ecdyonurus venosus;
    Ecdyonurus dispar;
    Ecdyonurus torrentis;
    Ecdyonurus insignis;
    Ecdyonurus subalpinus;
    Ecdyonurus helveticus;
    Ecdyonurus picteti;
    Ecdyonurus aurantiacus;
    Ecdyonurus forcipula;
    Rhithrogena semicolorata;
    Rhithrogena germanica;
    Rhithrogena loyolaea;
    Rhithrogena iridina;
    Rhithrogena picteti;
    Rhithrogena alpestris;
    Rhithrogena diaphana;
    Rhithrogena hybrida;
    Rhithrogena landai;
    Rhithrogena eatoni;
    Epeorus assimilis;
    Epeorus alpicola;
    Epeorus sylvicola;
    Epeorus longimanus;
    Epeorus pleuralis;
    Epeorus deceptivus;
    Epeorus albertae;
    Epeorus vitreus;
    Baetis rhodani;
    Baetis vernus;
    Baetis niger;
    Baetis muticus;
    Baetis fuscatus;
    Baetis scambus;
    Baetis liebenauae;
    Baetis buceratus;
    Baetis digitatus;
    Baetis lutheri;
    Baetis melanonyx;
    Baetis alpinus;
    Baetis carpatica;
    Baetis lapponicus;
    Baetis atrebatinus;
    Baetis tricolor;
    Baetis macani;
    Alainites muticus;
    Labiobaetis atrebatinus;
    Centroptilum luteolum;
    Procloeon bifidum;
    Procloeon pennulatum;
    Cloeon dipterum;
    Serratella ignita;
    Ephemerella notata;
    Ephemerella aurivillii;
    Ephemerella dorothea;
    Ephemerella invaria;
    Ephemerella subvaria;
    Ephemerella excrucians;
    Ephemerella needhami;
    Ephemerella inermis;
    Drunella grandis;
    Drunella coloradensis;
    Drunella doddsi;
    Drunella flavilinea;
    Drunella spinifera;
    Drunella tuberculata;
    Drunella cornuta;
    Drunella lata;
    Drunella longicornis;
    Potamanthus luteus;
    Potamanthus formosus;
    Anthopotamus distinctus;
    Anthopotamus verticis;
    Isonychia bicolor;
    Isonychia sicca;
    Isonychia velma;
    Isonychia georgiae
  `, [2,7], 90);

  // ============================================================
  // EENDAGSVLIEGEN VAN MEREN
  // ============================================================

  meerdieren(`
    Cloeon dipterum;
    Cloeon simile;
    Cloeon inscriptum;
    Callibaetis ferrugineus;
    Callibaetis fluctuans;
    Callibaetis pallidus;
    Callibaetis pictus;
    Callibaetis skokianus;
    Callibaetis americanus;
    Callibaetis pretiosus;
    Caenis horaria;
    Caenis robusta;
    Caenis luctuosa;
    Caenis macrura;
    Caenis lactea;
    Caenis rivulorum;
    Caenis diminuta;
    Caenis latipennis;
    Caenis amica;
    Leptophlebia marginata;
    Leptophlebia vespertina;
    Leptophlebia cupida;
    Leptophlebia nebulosa;
    Siphlonurus lacustris;
    Siphlonurus aestivalis;
    Siphlonurus alternatus;
    Siphlonurus armatus;
    Siphlonurus occidentalis;
    Hexagenia limbata;
    Hexagenia rigida;
    Hexagenia bilineata;
    Hexagenia atrocaudata;
    Ephemera vulgata;
    Ephemera simulans
  `, [2,7], 85);

  // ============================================================
  // KOKERJUFFERS VAN RIVIEREN
  // ============================================================

  rivierdieren(`
    Hydropsyche angustipennis;
    Hydropsyche contubernalis;
    Hydropsyche pellucidula;
    Hydropsyche siltalai;
    Hydropsyche incognita;
    Hydropsyche instabilis;
    Hydropsyche saxonica;
    Hydropsyche fulvipes;
    Hydropsyche bulbifera;
    Hydropsyche exocellata;
    Hydropsyche guttata;
    Hydropsyche modesta;
    Hydropsyche ornatula;
    Hydropsyche silfvenii;
    Hydropsyche tenuis;
    Hydropsyche dinarica;
    Hydropsyche betteni;
    Hydropsyche bronta;
    Hydropsyche depravata;
    Hydropsyche morosa;
    Hydropsyche simulans;
    Hydropsyche sparna;
    Hydropsyche slossonae;
    Hydropsyche ventura;
    Cheumatopsyche lepida;
    Cheumatopsyche analis;
    Cheumatopsyche campyla;
    Cheumatopsyche pettiti;
    Cheumatopsyche gracilis;
    Cheumatopsyche harwoodi;
    Cheumatopsyche oxa;
    Cheumatopsyche lasia;
    Rhyacophila dorsalis;
    Rhyacophila nubila;
    Rhyacophila fasciata;
    Rhyacophila vulgaris;
    Rhyacophila tristis;
    Rhyacophila obliterata;
    Rhyacophila polonica;
    Rhyacophila torrentium;
    Rhyacophila aurata;
    Rhyacophila intermedia;
    Rhyacophila praemorsa;
    Rhyacophila septentrionis;
    Rhyacophila mocsaryi;
    Rhyacophila philopotamoides;
    Rhyacophila simulatrix;
    Rhyacophila evoluta;
    Rhyacophila grandis;
    Rhyacophila angelieri;
    Rhyacophila articulata;
    Rhyacophila brunnea;
    Rhyacophila fuscula;
    Rhyacophila glaberrima;
    Rhyacophila invaria;
    Rhyacophila ledra;
    Rhyacophila minor;
    Rhyacophila pellisa;
    Rhyacophila vibox;
    Rhyacophila verrula;
    Rhyacophila vao;
    Philopotamus montanus;
    Philopotamus variegatus;
    Philopotamus ludificatus;
    Wormaldia occipitalis;
    Wormaldia subnigra;
    Wormaldia mediana;
    Wormaldia triangulifera;
    Wormaldia pulla;
    Chimarra marginata;
    Chimarra obscura;
    Chimarra aterrima;
    Chimarra socia;
    Chimarra feria;
    Chimarra florida;
    Chimarra angustipennis;
    Polycentropus flavomaculatus;
    Polycentropus irroratus;
    Polycentropus multiguttatus;
    Plectrocnemia conspersa;
    Plectrocnemia geniculata;
    Plectrocnemia brevis;
    Plectrocnemia scruposa;
    Plectrocnemia laetabilis;
    Tinodes waeneri;
    Tinodes assimilis;
    Tinodes pallidulus;
    Tinodes rostocki;
    Tinodes unicolor;
    Tinodes maculicornis;
    Psychomyia pusilla;
    Psychomyia flavida;
    Lype phaeopa;
    Lype reducta;
    Lype diversa;
    Glossosoma boltoni;
    Glossosoma conformis;
    Glossosoma intermedium;
    Glossosoma bifidum;
    Glossosoma nigrior;
    Glossosoma verdona;
    Agapetus fuscipes;
    Agapetus ochripes;
    Agapetus delicatulus;
    Agapetus laniger;
    Agapetus pontona;
    Agapetus illini;
    Agapetus minutus;
    Silo pallipes;
    Silo nigricornis;
    Silo piceus;
    Goera pilosa;
    Goera stylata;
    Goera japonica;
    Goera calcarata;
    Lepidostoma hirtum;
    Lepidostoma basale;
    Lepidostoma scotti;
    Lepidostoma liba;
    Lepidostoma togatum;
    Lepidostoma griseum;
    Lepidostoma pluviale;
    Sericostoma personatum;
    Sericostoma flavicorne;
    Sericostoma schneideri;
    Beraea pullata;
    Beraea maurus;
    Beraeodes minutus
  `, [2,7], 90);

  // ============================================================
  // KOKERJUFFERS VAN MEREN
  // ============================================================

  meerdieren(`
    Mystacides longicornis;
    Mystacides nigra;
    Mystacides azurea;
    Mystacides sepulchralis;
    Athripsodes cinereus;
    Athripsodes aterrimus;
    Athripsodes albifrons;
    Ceraclea dissimilis;
    Ceraclea senilis;
    Ceraclea annulicornis;
    Ceraclea fulva;
    Ceraclea alboguttata;
    Ceraclea nigronervosa;
    Ceraclea excisa;
    Ceraclea riparia;
    Ceraclea transversa;
    Ceraclea tarsipunctata;
    Ceraclea resurgens;
    Ceraclea cancellata;
    Oecetis ochracea;
    Oecetis lacustris;
    Oecetis furva;
    Oecetis testacea;
    Oecetis notata;
    Oecetis struckii;
    Oecetis inconspicua;
    Oecetis avara;
    Oecetis immobilis;
    Oecetis nocturna;
    Oecetis persimilis;
    Oecetis cinerascens;
    Triaenodes bicolor;
    Triaenodes unanimis;
    Triaenodes tarda;
    Triaenodes aba;
    Triaenodes injusta;
    Ylodes simulans;
    Ylodes conspersus;
    Molanna angustata;
    Molanna albicans;
    Molanna nigra;
    Molanna blenda;
    Molanna tryphena;
    Molanna flavicornis;
    Molanna uniophila;
    Phryganea grandis;
    Phryganea bipunctata;
    Phryganea cinerea;
    Agrypnia varia;
    Agrypnia pagetana;
    Agrypnia obsoleta;
    Agrypnia picta;
    Agrypnia colorata;
    Agrypnia deflata;
    Agrypnia vestita;
    Agrypnia straminea;
    Agrypnia improba;
    Agrypnia macdunnoughi;
    Agrypnia glacialis;
    Oligotricha striata;
    Oligotricha lapponica;
    Hagenella clathrata;
    Trichostegia minor;
    Limnephilus flavicornis;
    Limnephilus rhombicus;
    Limnephilus lunatus;
    Limnephilus marmoratus;
    Limnephilus decipiens;
    Limnephilus stigma;
    Limnephilus vittatus;
    Limnephilus sparsus;
    Limnephilus affinis;
    Limnephilus auricula;
    Limnephilus binotatus;
    Limnephilus borealis;
    Limnephilus canadensis;
    Limnephilus externus;
    Limnephilus femoralis;
    Limnephilus hageni;
    Limnephilus indivisus;
    Limnephilus infernalis;
    Limnephilus submonilifer;
    Anabolia nervosa;
    Anabolia furcata;
    Anabolia laevis;
    Anabolia bimaculata;
    Glyphotaelius pellucidus;
    Grammotaulius nigropunctatus;
    Grammotaulius nitidus
  `, [2,7], 85);

  // ============================================================
  // STEENVLIEGEN VAN RIVIEREN
  // ============================================================

  rivierdieren(`
    Perla marginata;
    Perla bipunctata;
    Perla grandis;
    Perla abdominalis;
    Perla carantana;
    Perla illiesi;
    Perla pallida;
    Dinocras cephalotes;
    Dinocras megacephala;
    Dinocras ferreri;
    Marthamea vitripennis;
    Marthamea selysii;
    Agnetina capitata;
    Agnetina annulipes;
    Agnetina flavescens;
    Acroneuria abnormis;
    Acroneuria carolinensis;
    Acroneuria evoluta;
    Acroneuria frisoni;
    Acroneuria lycorias;
    Acroneuria perplexa;
    Acroneuria petersi;
    Acroneuria filicis;
    Paragnetina media;
    Paragnetina immarginata;
    Paragnetina kansensis;
    Neoperla clymene;
    Neoperla catharae;
    Neoperla carlsoni;
    Neoperla choctaw;
    Neoperla coosa;
    Neoperla falayah;
    Neoperla freytagi;
    Neoperla gaufini;
    Neoperla mainensis;
    Neoperla stewarti;
    Neoperla occipitalis;
    Isoperla grammatica;
    Isoperla difformis;
    Isoperla obscura;
    Isoperla oxylepis;
    Isoperla rivulorum;
    Isoperla goertzi;
    Isoperla grammatica;
    Isoperla acicularis;
    Isoperla andreinii;
    Isoperla carbonaria;
    Isoperla illyrica;
    Isoperla insularis;
    Isoperla lusitanica;
    Isoperla montana;
    Isoperla namuti;
    Isoperla pallida;
    Isoperla tripartita;
    Isoperla alaskensis;
    Isoperla bilineata;
    Isoperla clio;
    Isoperla dicala;
    Isoperla duplicata;
    Isoperla fulva;
    Isoperla holochlora;
    Isoperla irregularis;
    Isoperla marlynia;
    Isoperla montana;
    Isoperla nana;
    Isoperla orata;
    Isoperla quinquepunctata;
    Isoperla richardsoni;
    Isoperla signata;
    Isoperla transmarina;
    Isoperla wilsoni;
    Perlodes microcephalus;
    Perlodes intricatus;
    Perlodes dispar;
    Perlodes jurassicus;
    Perlodinella microlobata;
    Diura bicaudata;
    Diura nanseni;
    Diura majuscula;
    Arcynopteryx compacta;
    Arcynopteryx dichroa;
    Siphonoperla torrentium;
    Siphonoperla burmeisteri;
    Siphonoperla neglecta;
    Chloroperla tripunctata;
    Chloroperla susemicheli;
    Chloroperla brachyptera;
    Chloroperla russevi;
    Xanthoperla apicalis;
    Leuctra fusca;
    Leuctra hippopus;
    Leuctra inermis;
    Leuctra nigra;
    Leuctra prima;
    Leuctra digitata;
    Leuctra aurita;
    Leuctra braueri;
    Leuctra geniculata;
    Leuctra albida;
    Leuctra armata;
    Leuctra autumnalis;
    Leuctra cingulata;
    Leuctra cylindrica;
    Leuctra handlirschi;
    Leuctra major;
    Leuctra mortoni;
    Leuctra pseudocingulata;
    Leuctra rauscheri;
    Leuctra signifera;
    Leuctra teriolensis;
    Nemoura cinerea;
    Nemoura cambrica;
    Nemoura flexuosa;
    Nemoura marginata;
    Nemoura avicularis;
    Nemoura dubitans;
    Nemoura fulviceps;
    Nemoura mortoni;
    Nemoura obtusa;
    Nemoura uncinata;
    Protonemura meyeri;
    Protonemura montana;
    Protonemura nitida;
    Protonemura praecox;
    Protonemura intricata;
    Protonemura auberti;
    Protonemura brevistyla;
    Protonemura lateralis;
    Protonemura nimborum;
    Protonemura risi;
    Protonemura hrabei;
    Protonemura algovia;
    Amphinemura sulcicollis;
    Amphinemura standfussi;
    Amphinemura borealis;
    Amphinemura triangularis;
    Amphinemura nigritta;
    Amphinemura delosa;
    Amphinemura varshava;
    Taeniopteryx nebulosa;
    Taeniopteryx schoenemundi;
    Taeniopteryx auberti;
    Taeniopteryx hubaulti;
    Taeniopteryx maura;
    Taeniopteryx nivalis;
    Taeniopteryx parvula;
    Brachyptera risi;
    Brachyptera seticornis;
    Brachyptera braueri;
    Brachyptera trifasciata;
    Brachyptera monilicornis;
    Rhabdiopteryx neglecta;
    Rhabdiopteryx alpina;
    Rhabdiopteryx acuminata;
    Capnia bifrons;
    Capnia nigra;
    Capnia atra;
    Capnia vidua;
    Capnia pygmaea;
    Capnia vernalis;
    Capnia confusa;
    Capnia gracilaria;
    Capnia nearctica;
    Capnia coloradensis;
    Capnia elongata
  `, [7], 90);

  // ============================================================
  // WATERMIJTEN
  // ============================================================

  rivierEnMeerDieren(`
    Hydrachna globosa;
    Hydrachna geographica;
    Hydrachna cruenta;
    Hydrachna conjecta;
    Hydrachna skorikowi;
    Hydrachna processifera;
    Limnochares aquatica;
    Limnochares americana;
    Eylais extendens;
    Eylais discreta;
    Eylais hamata;
    Eylais infundibulifera;
    Eylais setosa;
    Eylais tantilla;
    Arrenurus globator;
    Arrenurus bruzelii;
    Arrenurus bicuspidator;
    Arrenurus crassicaudatus;
    Arrenurus cuspidator;
    Arrenurus maculator;
    Arrenurus mediorotundatus;
    Arrenurus neumani;
    Arrenurus papillator;
    Arrenurus rodrigensis;
    Arrenurus sinuator;
    Arrenurus tricuspidator;
    Piona coccinea;
    Piona carnea;
    Piona conglobata;
    Piona clavicornis;
    Piona disparilis;
    Piona imminuta;
    Piona laminata;
    Piona longipalpis;
    Piona nodata;
    Piona pusilla;
    Piona rotundoides;
    Piona stjordalensis;
    Unionicola crassipes;
    Unionicola ypsilophora;
    Unionicola aculeata;
    Unionicola intermedia;
    Unionicola minor;
    Unionicola figuralis;
    Unionicola formosa;
    Unionicola fossulata;
    Unionicola serrata;
    Limnesia maculata;
    Limnesia undulata;
    Limnesia fulgida;
    Limnesia koenikei;
    Limnesia connata;
    Limnesia marmorata;
    Limnesia polonica;
    Hygrobates longipalpis;
    Hygrobates nigromaculatus;
    Hygrobates fluviatilis;
    Hygrobates calliger;
    Hygrobates setosus;
    Hygrobates trigonicus;
    Atractides nodipalpis;
    Atractides distans;
    Atractides gibberipalpis;
    Atractides ovalis;
    Atractides tener;
    Atractides spinipes;
    Atractides fonticolus;
    Atractides panniculatus;
    Sperchon clupeifer;
    Sperchon glandulosus;
    Sperchon setiger;
    Sperchon denticulatus;
    Sperchon hispidus;
    Sperchon papillosus
  `, [7,10], 90);

  // ============================================================
  // AANVULLENDE BEKENDE ZOETWATERDIEREN
  // ============================================================

  rivierEnMeerDieren(`
    Waterspin=Argyroneta aquatica;
    Zoetwaterkwal=Craspedacusta sowerbii;
    Zoetwaterpoliep=Hydra;
    Zoetwaterspons;
    Zoetwatergarnaal;
    Zoetwaterkrab;
    Rivierkreeft;
    Watervlo;
    Watermijt;
    Waterkever;
    Waterwants;
    Bloedzuiger;
    Zoetwatermossel;
    Zoetwaterslak
  `, [], 35);

  // ============================================================
  // HERSTEL VAN HET SCHUBBENKENMERK
  // ============================================================

  koppel(`
    Snoek;
    Baars;
    Snoekbaars;
    Pos;
    Karper;
    Brasem;
    Kolblei;
    Blankvoorn;
    Rietvoorn;
    Zeelt;
    Alver;
    Winde;
    Kopvoorn;
    Serpeling;
    Roofblei;
    Bittervoorn;
    Kroeskarper;
    Giebel;
    Barbeel;
    Sneep;
    Elrits;
    Zonnebaars;
    Regenboogforel;
    Bronforel;
    Beekforel;
    Atlantische zalm;
    Chinookzalm;
    Cohozalm;
    Chumzalm;
    Roze zalm;
    Rode zalm;
    Graskarper;
    Zilverkarper;
    Grootkopkarper;
    Zwarte karper;
    Rohu;
    Catla;
    Arapaima;
    Aziatische arowana;
    Zilveren arowana;
    Zwarte arowana;
    Rode piranha;
    Zwarte piranha;
    Tambaqui;
    Rode pacu;
    Neontetra;
    Kardinaaltetra;
    Groene neontetra;
    Rouwtetra;
    Citroentetra;
    Vuurneon;
    Zwarte neon;
    Zebravis;
    Maanvis;
    Pauwoogcichlide
  `, [21], 45);

  // Meervallen hebben doorgaans geen gewone
  // vissenschubben. Daarom worden zij niet
  // automatisch aan vraag 21 gekoppeld.

  // ============================================================
  // CORRECTIES VAN SYNONIEMEN
  // ============================================================

  function verenigSynoniemenDeel2(
    hoofdnaam,
    alternatieveNaam
  ) {

    const hoofd = zoekEen(hoofdnaam);

    const ander = zoekEen(alternatieveNaam);

    if (!hoofd && !ander) return;

    // Wanneer slechts één naam bestaat,
    // kan de andere als synoniem worden toegevoegd.

    if (hoofd && !ander) {

      hoofd.aliases.add(alternatieveNaam);

      indexeer(alternatieveNaam, hoofd);

      nieuweSynoniemen++;

      return;

    }

    if (!hoofd && ander) {

      ander.aliases.add(hoofdnaam);

      indexeer(hoofdnaam, ander);

      nieuweSynoniemen++;

      return;

    }

    if (hoofd === ander) return;

    // Alleen gebruiken bij expliciet aangegeven
    // taxonomische synoniemen.

    for (const [nummer, punten] of ander.vragen) {

      if (!hoofd.vragen.has(nummer)) {

        hoofd.vragen.set(nummer, punten);

      } else {

        hoofd.vragen.set(
          nummer,
          Math.min(
            hoofd.vragen.get(nummer),
            punten
          )
        );

      }

    }

    const alternatieven = [
      ander.naam,
      ...ander.aliases
    ];

    for (const alias of alternatieven) {

      hoofd.aliases.add(alias);

      const sleutel = normaal(alias);

      const opties = naamIndex.get(sleutel);

      if (opties) {

        opties.delete(ander);

      }

      indexeer(alias, hoofd);

    }

    dieren.delete(normaal(ander.naam));

    wijzigingen.push({
      dier: hoofd.naam,
      samengevoegdMet: ander.naam,
      actie: "synoniem-samengevoegd"
    });

  }

  verenigSynoniemenDeel2(
    "Lamprologus ocellatus",
    "Neolamprologus ocellatus"
  );

  verenigSynoniemenDeel2(
    "Lamprologus callipterus",
    "Neolamprologus callipterus"
  );

  verenigSynoniemenDeel2(
    "Xenotilapia melanogenys",
    "Enantiopus melanogenys"
  );

  verenigSynoniemenDeel2(
    "Perissodus straeleni",
    "Plecodus straeleni"
  );

  verenigSynoniemenDeel2(
    "Chindongo demasoni",
    "Pseudotropheus demasoni"
  );

  verenigSynoniemenDeel2(
    "Chindongo saulosi",
    "Pseudotropheus saulosi"
  );

  verenigSynoniemenDeel2(
    "Chindongo socolofi",
    "Pseudotropheus socolofi"
  );

  verenigSynoniemenDeel2(
    "Chindongo elongatus",
    "Pseudotropheus elongatus"
  );

  verenigSynoniemenDeel2(
    "Chindongo minutus",
    "Pseudotropheus minutus"
  );

  verenigSynoniemenDeel2(
    "Pundamilia nyererei",
    "Haplochromis nyererei"
  );

  verenigSynoniemenDeel2(
    "Neochromis rufocaudalis",
    "Haplochromis rufocaudalis"
  );

  verenigSynoniemenDeel2(
    "Yssichromis pyrrhocephalus",
    "Haplochromis pyrrhocephalus"
  );

  verenigSynoniemenDeel2(
    "Paralabidochromis chilotes",
    "Haplochromis chilotes"
  );

  verenigSynoniemenDeel2(
    "Paralabidochromis sauvagei",
    "Haplochromis sauvagei"
  );

  verenigSynoniemenDeel2(
    "Aquarius remigis",
    "Gerris remigis"
  );

  verenigSynoniemenDeel2(
    "Alainites muticus",
    "Baetis muticus"
  );

  verenigSynoniemenDeel2(
    "Labiobaetis atrebatinus",
    "Baetis atrebatinus"
  );

  verenigSynoniemenDeel2(
    "Ephoron virgo",
    "Polymitarcys virgo"
  );

  verenigSynoniemenDeel2(
    "Neocaridina davidi",
    "Neocaridina heteropoda"
  );

  verenigSynoniemenDeel2(
    "Schmidtea lugubris",
    "Dugesia lugubris"
  );

  // ============================================================
  // CORRECTIES VAN UITGESTORVEN DIEREN
  // ============================================================

  const uitgestorvenWaterdierenDeel2 = `
    Coregonus bezola;
    Coregonus fera;
    Coregonus hiemalis;
    Coregonus johannae;
    Coregonus nobilis;
    Coregonus reighardi;
    Coregonus restrictus;
    Coregonus trybomi;
    Alburnus akili;
    Pseudophoxinus handlirschi;
    Mugilogobius amadi
  `;

  for (
    const regel of
    uitgestorvenWaterdierenDeel2.split(";")
  ) {

    const naam = regel.trim();

    if (!naam) continue;

    const record = zoekEen(naam);

    if (!record) continue;

    verwijderKoppeling(
      naam,
      [3,5,8,23,26,37,38,39,46]
    );

    voegKoppelingToe(
      record,
      43,
      85
    );

  }

  // ============================================================
  // ONVOLDOENDE DUIDELIJKE OF FOUTIEVE NAMEN
  // ============================================================

  const twijfelachtigeNamenDeel2 = `
    Neolamprologus princess;
    Metriaclima cyneusmarginata;
    Metriaclima xanstomachus;
    Caridina harlequin;
    Limnocaridina tanganyikae;
    Micruropus wahli;
    Pallasea macrophtalma
  `;

  for (
    const regel of
    twijfelachtigeNamenDeel2.split(";")
  ) {

    const naam = regel.trim();

    if (!naam) continue;

    verwijderKoppeling(
      naam,
      [37,38]
    );

  }

  // ============================================================
  // LEEFGEBIEDCORRECTIES
  // ============================================================

  // Sommige soorten leven voornamelijk in zee,
  // bronnen, moerassen of tijdelijke wateren.

  verwijderKoppeling(
    "Mysis mixta",
    [38]
  );

  verwijderKoppeling(
    "Pseudodiaptomus annandalei",
    [38]
  );

  verwijderKoppeling(
    "Pseudodiaptomus poplesia",
    [38]
  );

  verwijderKoppeling(
    "Ambystoma ordinarium",
    [38]
  );

  verwijderKoppeling(
    "Eurycea rathbuni",
    [37]
  );

  verwijderKoppeling(
    "Eurycea waterlooensis",
    [37]
  );

  verwijderKoppeling(
    "Eurycea tridentifera",
    [37]
  );

  verwijderKoppeling(
    "Xenopus gilli",
    [37]
  );

  verwijderKoppeling(
    "Synodontis petricola",
    [37]
  );

  verwijderKoppeling(
    "Synodontis polli",
    [37]
  );

  verwijderKoppeling(
    "Danio margaritatus",
    [37]
  );

  verwijderKoppeling(
    "Houting",
    [38]
  );

  verwijderKoppeling(
    "Gila elegans",
    [38]
  );

  verwijderKoppeling(
    "Gila cypha",
    [38]
  );

  verwijderKoppeling(
    "Donauzalm",
    [38]
  );

  verwijderKoppeling(
    "Channa bleheri",
    [37]
  );

  verwijderKoppeling(
    "Etheostoma fonticola",
    [37]
  );

  // ============================================================
  // GEEN ONJUISTE AUTOMATISCHE EIERKOPPELINGEN
  // ============================================================

  const levendbarendeVissenDeel2 = `
    Gambusia affinis;
    Gambusia holbrooki;
    Gambusia geiseri;
    Gambusia heterochir;
    Gambusia nobilis;
    Gambusia speciosa;
    Heterandria formosa;
    Poecilia mexicana;
    Poecilia latipinna;
    Poecilia velifera;
    Poecilia sphenops;
    Xiphophorus hellerii;
    Xiphophorus maculatus;
    Xiphophorus variatus;
    Goodea atripinnis;
    Ameca splendens;
    Xenotoca eiseni;
    Xenotoca variata;
    Zoogoneticus quitzeoensis;
    Zoogoneticus tequila;
    Skiffia multipunctata;
    Skiffia lermae;
    Alloophorus robustus;
    Allotoca dugesii;
    Allotoca diazi;
    Chapalichthys encaustus;
    Chapalichthys pardalis;
    Girardinichthys multiradiatus
  `;

  for (
    const regel of
    levendbarendeVissenDeel2.split(";")
  ) {

    verwijderKoppeling(
      regel.trim(),
      [7]
    );

  }

  // ============================================================
  // ONJUISTE SCHUBBENKOPPELINGEN
  // ============================================================

  const schublozeVissenDeel2 = `
    Europese meerval;
    Afrikaanse meerval;
    Roodstaartmeerval;
    Kanaalmeerval;
    Blauwe meerval;
    Bruine dwergmeerval;
    Zwarte dwergmeerval;
    Rivierprik;
    Beekprik;
    Zeeprik;
    Amerikaanse lepelsteur;
    Elektrische aal;
    Electrophorus voltai;
    Electrophorus varii
  `;

  for (
    const regel of
    schublozeVissenDeel2.split(";")
  ) {

    verwijderKoppeling(
      regel.trim(),
      [21]
    );

  }

  // ============================================================
  // HERSTEL VAN NEDERLANDSE ZOETWATERDIEREN
  // ============================================================

  koppel(`
    Snoek;
    Baars;
    Snoekbaars;
    Pos;
    Karper;
    Brasem;
    Kolblei;
    Blankvoorn;
    Rietvoorn;
    Zeelt;
    Alver;
    Winde;
    Kopvoorn;
    Serpeling;
    Roofblei;
    Bittervoorn;
    Giebel;
    Kroeskarper;
    Europese meerval;
    Kwabaal;
    Riviergrondel;
    Kleine modderkruiper;
    Grote modderkruiper;
    Driedoornige stekelbaars;
    Tiendoornige stekelbaars;
    Europese aal;
    Zwartbekgrondel;
    Pontische stroomgrondel;
    Witvingrondel;
    Zonnebaars;
    Barbeel;
    Rivierprik;
    Beekprik;
    Zeeprik;
    Sneep;
    Bermpje;
    Rivierdonderpad;
    Europese otter;
    Bever;
    Muskusrat;
    Beverrat;
    Meerkikker;
    Bastaardkikker;
    Poelkikker;
    Rode Amerikaanse rivierkreeft;
    Gevlekte Amerikaanse rivierkreeft;
    Signaalkreeft;
    Geknobbelde Amerikaanse rivierkreeft;
    Gestreepte Amerikaanse rivierkreeft;
    Driehoeksmossel;
    Quaggamossel;
    Zwanenmossel;
    Vijvermossel;
    Schildersmossel;
    Bolle stroommossel;
    Aziatische korfmossel;
    Chinese vijvermossel;
    Grote poelslak;
    Ovale poelslak;
    Posthorenslak;
    Zoetwaterpissebed;
    Gammarus pulex;
    Gammarus fossarum;
    Gammarus roeselii;
    Gammarus tigrinus;
    Dikerogammarus villosus;
    Dikerogammarus haemobaphes;
    Chelicorophium curvispinum;
    Geelgerande watertor;
    Waterschorpioen;
    Staafwants;
    Waterspin;
    Beekrombout;
    Rivierrombout;
    Grote keizerlibel;
    Ephemera danica;
    Ephemera vulgata;
    Ephoron virgo;
    Baetis rhodani;
    Cloeon dipterum;
    Hydropsyche angustipennis;
    Hydropsyche contubernalis;
    Hydropsyche pellucidula;
    Plectrocnemia conspersa;
    Tinodes waeneri;
    Psychomyia pusilla;
    Mystacides longicornis;
    Phryganea grandis;
    Limnephilus flavicornis;
    Limnephilus lunatus;
    Anabolia nervosa;
    Spongilla lacustris;
    Ephydatia fluviatilis;
    Cristatella mucedo;
    Plumatella repens;
    Pectinatella magnifica;
    Tubifex tubifex;
    Dendrocoelum lacteum;
    Polycelis nigra;
    Polycelis tenuis
  `, [26], 60);

  // ============================================================
  // HERSTEL VAN DE LAATSTE ONTBREKENDE RASNAAM
  // ============================================================

  // Hampshire kan zowel naar een varkensras
  // als naar een schapenras verwijzen.

  for (const naam of [
    "Hampshirevarken",
    "Hampshiredownschaap"
  ]) {

    const record = zoekEen(naam);

    if (record) {

      if (!record.aliases.has("Hampshire")) {

        record.aliases.add("Hampshire");

        indexeer("Hampshire", record);

        nieuweSynoniemen++;

      }

    }

  }

  // Zebraneonhaai wordt voorlopig niet toegevoegd:
  // de bedoelde soort is onvoldoende duidelijk.

  // ============================================================
  // EXTRA TESTGEVALLEN VOOR DE DEFINITIEVE EXPORT
  // ============================================================

  const extraWaterTestsDeel2 = [

    [37, "Snoek", true],

    [38, "Snoek", true],

    [37, "Europese otter", true],

    [38, "Europese otter", true],

    [38, "Baikalrob", true],

    [38, "Axolotl", true],

    [38, "Titicacakikker", true],

    [38, "Neolamprologus brichardi", true],

    [38, "Tropheus moorii", true],

    [38, "Labidochromis caeruleus", true],

    [38, "Metriaclima zebra", true],

    [38, "Maylandia zebra", true],

    [38, "Aulonocara baenschi", true],

    [38, "Frontosa", true],

    [38, "Cyphotilapia frontosa", true],

    [37, "Nijlkrokodil", true],

    [38, "Nijlkrokodil", true],

    [37, "Gaviaal", true],

    [37, "Europese rivierkreeft", true],

    [38, "Europese rivierkreeft", true],

    [37, "Zoetwaterparelmossel", true],

    [38, "Driehoeksmossel", true],

    [38, "Quaggamossel", true],

    [38, "Grote poelslak", true],

    [38, "Watervlo", true],

    [38, "Daphnia magna", true],

    [38, "Zoetwaterkwal", true],

    [37, "Beekrombout", true],

    [37, "Rivierrombout", true],

    [38, "Geelgerande watertor", true],

    [38, "Waterspin", true],

    [37, "Olifant", false],

    [38, "Leeuw", false],

    [38, "Witte haai", false],

    [38, "Struisvogel", false],

    [37, "IJsbeer", false],

    [7, "Poecilia latipinna", false],

    [7, "Gambusia affinis", false],

    [21, "Europese meerval", false],

    [43, "Coregonus johannae", true],

    [38, "Coregonus johannae", false],

    [13, "Hampshire", true]

  ];

  // ============================================================
  // TUSSENTIJDSE TELLING NA DEEL 2
  // ============================================================

  const voortgangNaDeel2 =
    voortgangWaterdieren();

  const tussentijdsRapportDeel2 = {

    versie: VERSIE,

    dierrecordsBijStart:
      beginAantalDieren,

    dierrecordsNu:
      dieren.size,

    bruikbareDierrecords:
      [...dieren.values()].filter(
        record => record.vragen.size > 0
      ).length,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    verwijderdeKoppelingen,

    conflictenBijToevoegen:
      conflictenBijToevoegen.length,

    ontbrekendeKoppelingen:
      ontbrekendeKoppelingen.length,

    rivierdieren:
      aantalAntwoorden(37),

    meerdieren:
      aantalAntwoorden(38),

    stranddieren:
      aantalAntwoorden(39)

  };

  console.group(
    "QuizBallon V9.2 - Aanvulling 2 - Deel 2"
  );

  console.table(
    tussentijdsRapportDeel2
  );

  console.table(
    voortgangNaDeel2
  );

  if (conflictenBijToevoegen.length) {

    console.warn(
      "Naamconflicten die nog beoordeeld moeten worden:"
    );

    console.table(
      conflictenBijToevoegen.slice(0, 100)
    );

  }

  if (ontbrekendeKoppelingen.length) {

    console.warn(
      "Nog niet gevonden koppelingen:"
    );

    console.table(
      ontbrekendeKoppelingen.slice(0, 100)
    );

  }

  console.groupEnd();

  // ============================================================
  // EINDE AANVULLING 2 - DEEL 2
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
    // ============================================================
  // QUIZBALLON V9.2 - AANVULLING 2 - DEEL 3
  // STRANDDIEREN, KUSTDIEREN EN GETIJDENGEBIEDEN
  // ============================================================

  // ============================================================
  // HULPFUNCTIES
  // ============================================================

  function kustvogels(
    tekst,
    extra = [],
    punten = 65
  ) {

    stranddieren(
      tekst,
      [2,7,18,22,...extra],
      punten
    );

  }

  function zeeschelpdieren(
    tekst,
    extra = [],
    punten = 75
  ) {

    stranddieren(
      tekst,
      [1,11,30,...extra],
      punten
    );

  }

  function zeekrabben(
    tekst,
    extra = [],
    punten = 75
  ) {

    stranddieren(
      tekst,
      [1,7,11,33,...extra],
      punten
    );

  }

  function getijdendieren(
    tekst,
    extra = [],
    punten = 75
  ) {

    stranddieren(
      tekst,
      [1,11,...extra],
      punten
    );

  }

  // ============================================================
  // NEDERLANDSE STRANDVOGELS
  // ============================================================

  kustvogels(`
    Zilvermeeuw=Larus argentatus;
    Kleine mantelmeeuw=Larus fuscus;
    Grote mantelmeeuw=Larus marinus;
    Kokmeeuw=Chroicocephalus ridibundus=Larus ridibundus;
    Stormmeeuw=Larus canus;
    Geelpootmeeuw=Larus michahellis;
    Pontische meeuw=Larus cachinnans;
    Zwartkopmeeuw=Ichthyaetus melanocephalus;
    Dwergmeeuw=Hydrocoloeus minutus;
    Drieteenmeeuw=Rissa tridactyla;
    Scholekster=Haematopus ostralegus;
    Drieteenstrandloper=Calidris alba;
    Bonte strandloper=Calidris alpina;
    Paarse strandloper=Calidris maritima;
    Kanoet=Calidris canutus;
    Kleine strandloper=Calidris minuta;
    Temmincks strandloper=Calidris temminckii;
    Krombekstrandloper=Calidris ferruginea;
    Bontbekplevier=Charadrius hiaticula;
    Strandplevier=Anarhynchus alexandrinus=Charadrius alexandrinus;
    Zilverplevier=Pluvialis squatarola;
    Goudplevier=Pluvialis apricaria;
    Steenloper=Arenaria interpres;
    Wulp=Numenius arquata;
    Regenwulp=Numenius phaeopus;
    Rosse grutto=Limosa lapponica;
    Tureluur=Tringa totanus;
    Groenpootruiter=Tringa nebularia;
    Oeverloper=Actitis hypoleucos;
    Visdief=Sterna hirundo;
    Noordse stern=Sterna paradisaea;
    Dwergstern=Sternula albifrons;
    Grote stern=Thalasseus sandvicensis;
    Reuzenstern=Hydroprogne caspia;
    Eider=Somateria mollissima=Eidereend;
    Bergeend=Tadorna tadorna;
    Sneeuwgors=Plectrophenax nivalis;
    Strandleeuwerik=Eremophila alpestris;
    Oeverpieper=Anthus petrosus
  `, [26], 35);

  // ============================================================
  // MEEUWEN WERELDWIJD
  // ============================================================

  kustvogels(`
    Amerikaanse zilvermeeuw=Larus smithsonianus;
    Californische meeuw=Larus californicus;
    Ringsnavelmeeuw=Larus delawarensis;
    Californische westmeeuw=Larus occidentalis;
    Beringmeeuw=Larus glaucescens;
    Grote burgemeester=Larus hyperboreus;
    Kleine burgemeester=Larus glaucoides;
    Japanse meeuw=Larus crassirostris;
    Kelpmeeuw=Larus dominicanus;
    Armeense meeuw=Larus armenicus;
    Pacifische meeuw=Larus pacificus;
    Heermanns meeuw=Larus heermanni;
    Audouins meeuw=Ichthyaetus audouinii;
    Reuzenzwartkopmeeuw=Ichthyaetus ichthyaetus;
    Wit oogmeeuw=Ichthyaetus leucophthalmus;
    Ichthyaetus hemprichii;
    Chroicocephalus novaehollandiae;
    Chroicocephalus scopulinus;
    Chroicocephalus bulleri;
    Chroicocephalus maculipennis;
    Chroicocephalus cirrocephalus;
    Chroicocephalus hartlaubii;
    Chroicocephalus genei;
    Leucophaeus atricilla;
    Leucophaeus pipixcan;
    Leucophaeus modestus;
    Leucophaeus scoresbii;
    Leucophaeus fuliginosus;
    Creagrus furcatus;
    Xema sabini;
    Pagophila eburnea;
    Rissa brevirostris;
    Saundersilarus saundersi;
    Rhodostethia rosea
  `, [], 75);

  // ============================================================
  // STERNS WERELDWIJD
  // ============================================================

  kustvogels(`
    Bonte stern=Onychoprion fuscatus;
    Brilstern=Onychoprion anaethetus;
    Onychoprion lunatus;
    Onychoprion aleuticus;
    Dougalls stern=Sterna dougallii;
    Sterna forsteri;
    Sterna hirundinacea;
    Sterna vittata;
    Sterna virgata;
    Sterna sumatrana;
    Sterna striata;
    Sterna repressa;
    Sterna aurantia;
    Thalasseus maximus;
    Thalasseus bergii;
    Thalasseus bengalensis;
    Thalasseus elegans;
    Thalasseus acuflavidus;
    Thalasseus bernsteini;
    Sternula antillarum;
    Sternula superciliaris;
    Sternula lorata;
    Sternula nereis;
    Sternula saundersi;
    Sternula balaenarum;
    Gelochelidon nilotica;
    Gelochelidon macrotarsa;
    Anous stolidus;
    Anous minutus;
    Anous tenuirostris;
    Anous ceruleus;
    Gygis alba
  `, [], 75);

  // ============================================================
  // STRANDLOPERS EN ANDERE STELTLOPERS
  // ============================================================

  kustvogels(`
    Calidris mauri;
    Calidris pusilla;
    Calidris minutilla;
    Calidris bairdii;
    Calidris fuscicollis;
    Calidris melanotos;
    Calidris acuminata;
    Calidris ruficollis;
    Calidris tenuirostris;
    Calidris virgata;
    Calidris ptilocnemis;
    Calidris subminuta;
    Calidris pygmaea;
    Calidris falcinellus;
    Calidris himantopus;
    Calidris ferruginea;
    Calidris alba;
    Calidris canutus;
    Arenaria melanocephala;
    Limosa haemastica;
    Limosa fedoa;
    Numenius americanus;
    Numenius hudsonicus;
    Numenius madagascariensis;
    Numenius tahitiensis;
    Tringa semipalmata;
    Tringa brevipes;
    Tringa incana;
    Tringa flavipes;
    Tringa melanoleuca;
    Tringa stagnatilis;
    Tringa erythropus;
    Actitis macularius;
    Xenus cinereus;
    Limnodromus griseus;
    Limnodromus scolopaceus;
    Limnodromus semipalmatus;
    Phalaropus fulicarius;
    Phalaropus lobatus;
    Phalaropus tricolor;
    Himantopus himantopus;
    Himantopus mexicanus;
    Himantopus leucocephalus;
    Recurvirostra avosetta=Kluut;
    Recurvirostra americana;
    Recurvirostra novaehollandiae;
    Recurvirostra andina
  `, [], 75);

  // ============================================================
  // PLEVIEREN
  // ============================================================

  kustvogels(`
    Charadrius semipalmatus;
    Charadrius melodus;
    Charadrius vociferus;
    Charadrius dubius;
    Charadrius pecuarius;
    Charadrius tricollaris;
    Anarhynchus nivosus=Charadrius nivosus;
    Anarhynchus wilsonia=Charadrius wilsonia;
    Anarhynchus collaris=Charadrius collaris;
    Anarhynchus marginatus=Charadrius marginatus;
    Anarhynchus obscurus=Charadrius obscurus;
    Anarhynchus ruficapillus=Charadrius ruficapillus;
    Anarhynchus peronii=Charadrius peronii;
    Anarhynchus javanicus=Charadrius javanicus;
    Anarhynchus leschenaultii=Charadrius leschenaultii;
    Anarhynchus mongolus=Charadrius mongolus;
    Anarhynchus bicinctus=Charadrius bicinctus;
    Anarhynchus frontalis;
    Anarhynchus sanctaehelenae=Charadrius sanctaehelenae;
    Pluvialis dominica;
    Pluvialis fulva;
    Vanellus miles;
    Vanellus chilensis
  `, [], 75);

  // ============================================================
  // SCHOLEKSTERS
  // ============================================================

  kustvogels(`
    Haematopus bachmani;
    Haematopus palliatus;
    Haematopus ater;
    Haematopus leucopodus;
    Haematopus moquini;
    Haematopus fuliginosus;
    Haematopus longirostris;
    Haematopus unicolor;
    Haematopus finschi;
    Haematopus chathamensis
  `, [], 80);

  // ============================================================
  // OVERIGE KUSTVOGELS
  // ============================================================

  kustvogels(`
    Bruine pelikaan=Pelecanus occidentalis;
    Australische pelikaan=Pelecanus conspicillatus;
    Amerikaanse witte pelikaan=Pelecanus erythrorhynchos;
    Peruaanse pelikaan=Pelecanus thagus;
    Roze pelikaan=Pelecanus onocrotalus;
    Jan-van-gent=Morus bassanus;
    Kaapse jan-van-gent=Morus capensis;
    Australische jan-van-gent=Morus serrator;
    Blauwvoetgent=Sula nebouxii;
    Roodpootgent=Sula sula;
    Bruine gent=Sula leucogaster;
    Maskergent=Sula dactylatra;
    Nazcagent=Sula granti;
    Aalscholver=Phalacrocorax carbo;
    Kuifaalscholver=Gulosus aristotelis=Phalacrocorax aristotelis;
    Kaapse aalscholver=Phalacrocorax capensis;
    Brandts aalscholver=Urile penicillatus;
    Pelagische aalscholver=Urile pelagicus;
    Roodsnavelkeerkringvogel=Phaethon aethereus;
    Witstaartkeerkringvogel=Phaethon lepturus;
    Roodstaartkeerkringvogel=Phaethon rubricauda;
    Amerikaanse schaarbek=Rynchops niger;
    Afrikaanse schaarbek=Rynchops flavirostris;
    Indische schaarbek=Rynchops albicollis;
    Krabplevier=Dromas ardeola;
    Kleine zilverreiger=Egretta garzetta;
    Egretta sacra;
    Egretta gularis;
    Egretta thula;
    Egretta rufescens;
    Egretta caerulea;
    Grote zilverreiger=Ardea alba;
    Blauwe reiger=Ardea cinerea;
    Amerikaanse blauwe reiger=Ardea herodias;
    Rode ibis=Eudocimus ruber;
    Witte ibis=Eudocimus albus;
    Rode flamingo=Phoenicopterus ruber;
    Grote flamingo=Phoenicopterus roseus;
    Kleine flamingo=Phoeniconaias minor
  `, [], 65);

  // ============================================================
  // PINGUÏNS
  // ============================================================

  // Geen koppeling aan vraag 2:
  // pinguïns kunnen niet vliegen.

  stranddieren(`
    Keizerspinguïn=Aptenodytes forsteri;
    Koningspinguïn=Aptenodytes patagonicus;
    Adéliepinguïn=Pygoscelis adeliae;
    Ezelspinguïn=Pygoscelis papua;
    Kinbandpinguïn=Pygoscelis antarcticus;
    Humboldtpinguïn=Spheniscus humboldti;
    Magelhaenpinguïn=Spheniscus magellanicus;
    Zwartvoetpinguïn=Spheniscus demersus;
    Galapagospinguïn=Spheniscus mendiculus;
    Dwergpinguïn=Eudyptula minor;
    Geeloogpinguïn=Megadyptes antipodes;
    Macaronipinguïn=Eudyptes chrysolophus;
    Rotspinguïn=Eudyptes chrysocome;
    Noordelijke rotspinguïn=Eudyptes moseleyi;
    Snareskuifpinguïn=Eudyptes robustus;
    Fiordlandpinguïn=Eudyptes pachyrhynchus;
    Grote kuifpinguïn=Eudyptes sclateri;
    Schlegelpinguïn=Eudyptes schlegeli
  `, [7,11,14,18,22,40], 55);

  // ============================================================
  // ZEEHONDEN
  // ============================================================

  stranddieren(`
    Gewone zeehond=Phoca vitulina;
    Grijze zeehond=Halichoerus grypus;
    Ringelrob=Pusa hispida;
    Zadelrob=Pagophilus groenlandicus;
    Klapmuts=Cystophora cristata;
    Baardrob=Erignathus barbatus;
    Bandrob=Histriophoca fasciata;
    Larghazeehond=Phoca largha;
    Weddellzeehond=Leptonychotes weddellii;
    Krabbeneter=Lobodon carcinophaga;
    Zeeluipaard=Hydrurga leptonyx;
    Rosszeehond=Ommatophoca rossii;
    Noordelijke zeeolifant=Mirounga angustirostris;
    Zuidelijke zeeolifant=Mirounga leonina;
    Mediterrane monniksrob=Monachus monachus;
    Hawaïaanse monniksrob=Neomonachus schauinslandi
  `, [1,11,14,17,18,20], 55);

  // ============================================================
  // ZEELEEUWEN EN PELSROBBEN
  // ============================================================

  stranddieren(`
    Californische zeeleeuw=Zalophus californianus;
    Galapagoszeeleeuw=Zalophus wollebaeki;
    Stellerzeeleeuw=Eumetopias jubatus;
    Australische zeeleeuw=Neophoca cinerea;
    Nieuw-Zeelandse zeeleeuw=Phocarctos hookeri;
    Zuid-Amerikaanse zeeleeuw=Otaria flavescens=Otaria byronia;
    Noordelijke pelsrob=Callorhinus ursinus;
    Kaapse pelsrob=Arctocephalus pusillus;
    Antarctische pelsrob=Arctocephalus gazella;
    Subantarctische pelsrob=Arctocephalus tropicalis;
    Zuid-Amerikaanse pelsrob=Arctocephalus australis;
    Nieuw-Zeelandse pelsrob=Arctocephalus forsteri;
    Galapagospelsrob=Arctocephalus galapagoensis;
    Guadalupepelsrob=Arctocephalus townsendi;
    Juan-Fernandezpelsrob=Arctocephalus philippii
  `, [1,11,14,17,18,20], 65);

  stranddieren(`
    Walrus=Odobenus rosmarus
  `, [1,9,11,14,17,18,20,24,40], 30);

  stranddieren(`
    Zeeotter=Enhydra lutris;
    Mariene otter=Lontra felina
  `, [1,11,14,17,18,20], 60);

  // ============================================================
  // ZEESCHILDPADDEN
  // ============================================================

  // De vrouwtjes komen op zandstranden om eieren te leggen.

  stranddieren(`
    Groene zeeschildpad=Chelonia mydas=Soepschildpad;
    Lederschildpad=Dermochelys coriacea;
    Karetschildpad=Eretmochelys imbricata;
    Onechte karetschildpad=Caretta caretta;
    Kemps zeeschildpad=Lepidochelys kempii;
    Warana=Lepidochelys olivacea;
    Platrugzeeschildpad=Natator depressus
  `, [1,7,11,14,18,33], 55);

  // ============================================================
  // KUSTREPTIELEN
  // ============================================================

  stranddieren(`
    Zeeleguaan=Amblyrhynchus cristatus;
    Zeekrokodil=Crocodylus porosus
  `, [1,7,11,14,18,21], 55);

  stranddieren(`
    Laticauda colubrina;
    Laticauda laticaudata;
    Laticauda semifasciata;
    Laticauda saintgironsi;
    Laticauda crockeri
  `, [1,7,11,14,17,18,21,45], 85);

  // De genoemde zeekraaltslangen komen aan land.
  // Volledig pelagische zeeslangen worden niet automatisch
  // als stranddieren geaccepteerd.

  // ============================================================
  // BEKENDE NEDERLANDSE STRANDKRABBEN
  // ============================================================

  zeekrabben(`
    Strandkrab=Carcinus maenas;
    Noordzeekrab=Cancer pagurus;
    Gewone zwemkrab=Liocarcinus holsatus;
    Fluwelen zwemkrab=Necora puber;
    Blauwpootzwemkrab=Liocarcinus depurator;
    Gewimperde zwemkrab=Liocarcinus navigator;
    Grijze zwemkrab=Liocarcinus vernalis;
    Kleine zwemkrab=Liocarcinus pusillus;
    Penseelkrab=Hemigrapsus takanoi;
    Blaasjeskrab=Hemigrapsus sanguineus;
    Gewone spinkrab=Hyas araneus;
    Hyas coarctatus;
    Helmkrab=Corystes cassivelaunus;
    Erwtkrab=Pinnotheres pisum
  `, [], 45);

  // ============================================================
  // EUROPESE KRABBEN UIT ONDIEP WATER
  // ============================================================

  zeekrabben(`
    Carcinus aestuarii;
    Pachygrapsus marmoratus;
    Pachygrapsus transversus;
    Xantho hydrophilus;
    Xantho pilipes;
    Xantho poressa;
    Pilumnus hirtellus;
    Pilumnus spinifer;
    Eriphia verrucosa;
    Maja brachydactyla;
    Maja squinado;
    Maja crispata;
    Maja goltziana;
    Pisa tetraodon;
    Pisa armata;
    Pisa nodipes;
    Inachus dorsettensis;
    Inachus phalangium;
    Macropodia rostrata;
    Macropodia tenuirostris;
    Atelecyclus rotundatus;
    Atelecyclus undecimdentatus;
    Portumnus latipes;
    Polybius henslowii;
    Thia scutellata;
    Ebalia tumefacta;
    Ebalia tuberosa;
    Ebalia cranchii;
    Ilia nucleus;
    Medorippe lanata;
    Dromia personata
  `, [], 80);

  // ============================================================
  // SPOOKKRABBEN
  // ============================================================

  stranddieren(`
    Atlantische spookkrab=Ocypode quadrata;
    Ocypode ceratophthalmus;
    Ocypode cordimanus;
    Ocypode cursor;
    Ocypode gaudichaudii;
    Ocypode kuhlii;
    Ocypode macrocera;
    Ocypode madagascariensis;
    Ocypode mortoni;
    Ocypode nobilii;
    Ocypode occidentalis;
    Ocypode pallidula;
    Ocypode pauliani;
    Ocypode platytarsis;
    Ocypode rotundata;
    Ocypode ryderi;
    Ocypode saratan;
    Ocypode sinensis;
    Ocypode stimpsoni
  `, [7,32,33,27], 80);

  // ============================================================
  // WENKKRABBEN
  // ============================================================

  stranddieren(`
    Uca major;
    Uca maracoani;
    Uca tangeri=Afruca tangeri;
    Minuca pugnax=Uca pugnax;
    Minuca minax=Uca minax;
    Minuca rapax=Uca rapax;
    Minuca vocator=Uca vocator;
    Minuca mordax=Uca mordax;
    Minuca burgersi=Uca burgersi;
    Leptuca pugilator=Uca pugilator;
    Leptuca leptodactyla=Uca leptodactyla;
    Leptuca uruguayensis=Uca uruguayensis;
    Leptuca spinicarpa=Uca spinicarpa;
    Leptuca speciosa=Uca speciosa;
    Leptuca thayeri=Uca thayeri;
    Austruca annulipes=Uca annulipes;
    Austruca perplexa=Uca perplexa;
    Austruca lactea=Uca lactea;
    Austruca triangularis=Uca triangularis;
    Austruca mjoebergi=Uca mjoebergi;
    Austruca bengali;
    Gelasimus vocans=Uca vocans;
    Gelasimus tetragonon=Uca tetragonon;
    Gelasimus dampieri;
    Gelasimus hesperiae;
    Tubuca arcuata=Uca arcuata;
    Tubuca dussumieri=Uca dussumieri;
    Tubuca coarctata=Uca coarctata;
    Tubuca forcipata=Uca forcipata;
    Tubuca rosea=Uca rosea;
    Tubuca demani=Uca demani;
    Tubuca signata=Uca signata;
    Tubuca polita=Uca polita;
    Paraleptuca crassipes=Uca crassipes
  `, [7,32,33], 80);

  // ============================================================
  // TROPISCHE KUSTKRABBEN
  // ============================================================

  zeekrabben(`
    Grapsus grapsus;
    Grapsus albolineatus;
    Grapsus tenuicrustatus;
    Grapsus adscensionis;
    Grapsus longitarsis;
    Percnon gibbesi;
    Percnon planissimum;
    Plagusia depressa;
    Plagusia squamosa;
    Pachygrapsus crassipes;
    Pachygrapsus gracilis;
    Pachygrapsus minutus;
    Pachygrapsus socius;
    Hemigrapsus nudus;
    Hemigrapsus oregonensis;
    Hemigrapsus sexdentatus;
    Hemigrapsus crenulatus;
    Hemigrapsus penicillatus;
    Cyclograpsus punctatus;
    Cyclograpsus lavauxi;
    Cyclograpsus cinereus;
    Cyclograpsus integer;
    Metopograpsus messor;
    Metopograpsus thukuhar;
    Metopograpsus frontalis;
    Metopograpsus latifrons;
    Geograpsus grayi;
    Geograpsus lividus;
    Geograpsus crinipes;
    Sesarma reticulatum;
    Aratus pisonii;
    Parasesarma pictum;
    Parasesarma bidens;
    Parasesarma plicatum;
    Perisesarma eumolpe;
    Perisesarma indiarum;
    Neosarmatium meinerti;
    Neosarmatium smithi
  `, [], 80);

  // ============================================================
  // ZWEMKRABBEN
  // ============================================================

  zeekrabben(`
    Blauwe zwemkrab=Callinectes sapidus;
    Callinectes danae;
    Callinectes ornatus;
    Callinectes bocourti;
    Callinectes similis;
    Callinectes marginatus;
    Callinectes exasperatus;
    Callinectes arcuatus;
    Callinectes bellicosus;
    Callinectes toxotes;
    Portunus pelagicus;
    Portunus sanguinolentus;
    Portunus trituberculatus;
    Portunus armatus;
    Portunus segnis;
    Charybdis feriata;
    Charybdis japonica;
    Charybdis natator;
    Charybdis hellerii;
    Charybdis annulata;
    Thalamita crenata;
    Thalamita danae;
    Thalamita admete;
    Thalamita prymna;
    Scylla serrata;
    Scylla olivacea;
    Scylla paramamosain;
    Scylla tranquebarica
  `, [14], 80);

  // ============================================================
  // HEREMIETKREEFTEN
  // ============================================================

  getijdendieren(`
    Gewone heremietkreeft=Pagurus bernhardus;
    Kleine heremietkreeft=Diogenes pugilator;
    Pagurus prideaux;
    Pagurus cuanensis;
    Pagurus anachoretus;
    Pagurus excavatus;
    Pagurus pubescens;
    Pagurus longicarpus;
    Pagurus pollicaris;
    Pagurus acadianus;
    Pagurus granosimanus;
    Pagurus hirsutiusculus;
    Pagurus samuelis;
    Pagurus hemphilli;
    Pagurus venturensis;
    Pagurus ochotensis;
    Pagurus middendorffii;
    Pagurus filholi;
    Pagurus minutus;
    Pagurus japonicus;
    Clibanarius erythropus;
    Clibanarius vittatus;
    Clibanarius tricolor;
    Clibanarius antillensis;
    Clibanarius infraspinatus;
    Clibanarius longitarsus;
    Clibanarius merguiensis;
    Clibanarius olivaceus;
    Clibanarius striolatus;
    Clibanarius virescens;
    Calcinus elegans;
    Calcinus laevimanus;
    Calcinus latens;
    Calcinus tibicen;
    Calcinus seurati;
    Calcinus gaimardii;
    Calcinus obscurus;
    Dardanus megistos;
    Dardanus arrosor;
    Dardanus calidus;
    Dardanus lagopodes;
    Dardanus pedunculatus;
    Dardanus guttatus;
    Aniculus aniculus
  `, [7], 75);

  // ============================================================
  // LANDHEREMIETKREEFTEN
  // ============================================================

  stranddieren(`
    Kokoskrab=Birgus latro=Klapperdief;
    Coenobita clypeatus;
    Coenobita compressus;
    Coenobita rugosus;
    Coenobita perlatus;
    Coenobita brevimanus;
    Coenobita cavipes;
    Coenobita violascens;
    Coenobita variabilis;
    Coenobita purpureus;
    Coenobita scaevola;
    Coenobita spinosus;
    Coenobita lila
  `, [7,27], 75);

  // ============================================================
  // ZANDKRABBEN EN MOLKRABBEN
  // ============================================================

  getijdendieren(`
    Emerita analoga;
    Emerita talpoida;
    Emerita benedicti;
    Emerita brasiliensis;
    Emerita emeritus;
    Emerita holthuisi;
    Emerita austroafricana;
    Emerita portoricensis;
    Emerita rathbunae;
    Hippa adactyla;
    Hippa pacifica;
    Hippa marmorata;
    Hippa testudinaria;
    Hippa truncatifrons;
    Albunea carabus;
    Albunea paretii;
    Albunea symmysta;
    Lepidopa benedicti;
    Lepidopa richmondi;
    Lepidopa websteri
  `, [7,32,33], 85);

  // ============================================================
  // LANDELIJKE KUSTKRABBEN
  // ============================================================

  stranddieren(`
    Rode landkrab=Gecarcoidea natalis;
    Gecarcoidea lalandii;
    Gecarcinus ruricola;
    Gecarcinus lateralis;
    Gecarcinus quadratus;
    Cardisoma guanhumi;
    Cardisoma carnifex;
    Cardisoma armatum;
    Tuerkayana hirtipes;
    Tuerkayana rotundum;
    Johngarthia lagostoma;
    Johngarthia planata;
    Johngarthia malpilensis
  `, [7,32,33], 80);

  // ============================================================
  // GARNALEN UIT GETIJDENGEBIEDEN
  // ============================================================

  getijdendieren(`
    Noordzeegarnaal=Crangon crangon=Gewone garnaal;
    Crangon allmanni;
    Crangon franciscorum;
    Crangon nigromaculata;
    Crangon septemspinosa;
    Crangon nigricauda;
    Palaemon serratus;
    Palaemon elegans;
    Palaemon adspersus;
    Palaemon longirostris;
    Palaemon macrodactylus;
    Palaemon varians;
    Palaemon pugio;
    Palaemon vulgaris;
    Palaemon macrodactylus;
    Palaemon pacificus;
    Palaemon affinis;
    Palaemon serenus;
    Palaemon debilis;
    Palaemon concinnus;
    Palaemon pandaliformis;
    Palaemon northropi;
    Hippolyte varians;
    Hippolyte inermis;
    Hippolyte obliquimanus;
    Hippolyte californiensis;
    Eualus occultus;
    Eualus cranchii;
    Eualus pusiolus;
    Eualus gaimardii;
    Alpheus heterochaelis;
    Alpheus angulosus;
    Alpheus bellulus;
    Alpheus digitalis;
    Alpheus edwardsii;
    Alpheus lobidens;
    Alpheus macellarius;
    Alpheus parvirostris;
    Alpheus rapax;
    Alpheus soror;
    Alpheus strenuus;
    Alpheus sulcatus;
    Alpheus armatus;
    Synalpheus fritzmuelleri;
    Synalpheus brevicarpus;
    Synalpheus tumidomanus
  `, [7,14], 80);

  // ============================================================
  // GRAVENDE KREEFTACHTIGEN
  // ============================================================

  getijdendieren(`
    Upogebia deltaura;
    Upogebia pusilla;
    Upogebia stellata;
    Upogebia major;
    Upogebia africana;
    Upogebia capensis;
    Upogebia pugettensis;
    Upogebia affinis;
    Upogebia omissa;
    Callianassa subterranea;
    Pestarella tyrrhena;
    Pestarella candida;
    Callichirus major;
    Callichirus islagrande;
    Callichirus seilacheri;
    Neotrypaea californiensis;
    Neotrypaea gigas;
    Neotrypaea uncinata;
    Trypaea australiensis;
    Biffarius filholi
  `, [7,32], 90);

  // ============================================================
  // STRANDVLOOIEN EN ZANDVLOOIEN
  // ============================================================

  stranddieren(`
    Gewone strandvlo=Talitrus saltator;
    Talorchestia deshayesii;
    Talorchestia brito;
    Talorchestia martensii;
    Talorchestia spinipalma;
    Orchestia gammarellus;
    Orchestia mediterranea;
    Orchestia montagui;
    Orchestia cavimana=Cryptorchestia cavimana;
    Platorchestia platensis;
    Platorchestia monodi;
    Platorchestia japonica;
    Trinorchestia trinitatis;
    Trinorchestia longiramus;
    Megalorchestia californiana;
    Megalorchestia corniculata;
    Megalorchestia benedicti;
    Megalorchestia columbiana;
    Megalorchestia pugettensis;
    Atlantorchestoidea brasiliensis;
    Pseudorchestoidea mexicana;
    Americorchestia longicornis;
    Americorchestia megalophthalma;
    Americorchestia salomani
  `, [7,10,27,34], 80);

  // ============================================================
  // MARIENE VLOKREEFTEN
  // ============================================================

  getijdendieren(`
    Gammarus locusta;
    Gammarus oceanicus;
    Gammarus salinus;
    Gammarus zaddachi;
    Gammarus duebeni;
    Gammarus insensibilis;
    Gammarus crinicornis;
    Gammarus subtypicus;
    Echinogammarus marinus;
    Echinogammarus obtusatus;
    Marinogammarus obtusatus;
    Marinogammarus finmarchicus;
    Chaetogammarus marinus;
    Ampelisca brevicornis;
    Ampelisca tenuicornis;
    Ampelisca diadema;
    Ampelisca spinipes;
    Bathyporeia pilosa;
    Bathyporeia pelagica;
    Bathyporeia sarsi;
    Bathyporeia elegans;
    Bathyporeia guilliamsoniana;
    Bathyporeia tenuipes;
    Haustorius arenarius;
    Urothoe poseidonis;
    Urothoe brevicornis;
    Urothoe grimaldii;
    Urothoe elegans;
    Pontocrates arenarius;
    Pontocrates altamarinus;
    Corophium volutator;
    Corophium arenarium;
    Monocorophium acherusicum;
    Monocorophium insidiosum;
    Jassa falcata;
    Jassa marmorata;
    Jassa herdmani;
    Caprella mutica;
    Caprella linearis;
    Caprella penantis;
    Caprella acanthifera
  `, [7,10], 90);

  // ============================================================
  // STRANDPISSEBEDDEN
  // ============================================================

  stranddieren(`
    Havenpissebed=Ligia oceanica;
    Ligia exotica;
    Ligia italica;
    Ligia pallasii;
    Ligia occidentalis;
    Ligia baudiniana;
    Ligia hawaiensis;
    Ligia australiensis;
    Ligia cinerascens;
    Ligia japonica;
    Ligia perkinsi;
    Tylos europaeus;
    Tylos punctatus;
    Tylos granulatus;
    Tylos latreillii;
    Tylos capensis;
    Tylos niveus;
    Tylos spinulosus;
    Tylos opercularis;
    Tylos granuliferus;
    Tylos minor;
    Tylos neozelanicus;
    Alloniscus perconvexus;
    Alloniscus oahuensis;
    Alloniscus mirabilis;
    Halophiloscia couchii;
    Halophiloscia hirsuta
  `, [7,10], 80);

  getijdendieren(`
    Eurydice pulchra;
    Eurydice affinis;
    Eurydice spinigera;
    Eurydice truncata;
    Eurydice inermis;
    Eurydice naylori;
    Sphaeroma serratum;
    Sphaeroma rugicauda;
    Sphaeroma hookeri;
    Sphaeroma quadridentatum;
    Sphaeroma terebrans;
    Dynamene bidentata;
    Dynamene magnitorata;
    Dynamene edwardsi;
    Idotea balthica;
    Idotea emarginata;
    Idotea granulosa;
    Idotea pelagica;
    Idotea chelipes;
    Idotea linearis;
    Idotea metallica;
    Jaera albifrons;
    Jaera ischiosetosa;
    Jaera praehirsuta;
    Jaera forsmani;
    Cirolana harfordi;
    Excirolana braziliensis;
    Excirolana chiltoni;
    Excirolana armata
  `, [7,10], 85);

  // ============================================================
  // ZE EPOKKEN EN EENDENMOSSELS
  // ============================================================

  getijdendieren(`
    Gewone zeepok=Semibalanus balanoides;
    Balanus crenatus;
    Balanus balanus;
    Amphibalanus amphitrite=Balanus amphitrite;
    Amphibalanus improvisus=Balanus improvisus;
    Amphibalanus eburneus=Balanus eburneus;
    Amphibalanus subalbidus;
    Amphibalanus reticulatus;
    Austrominius modestus=Elminius modestus;
    Chthamalus stellatus;
    Chthamalus montagui;
    Chthamalus fragilis;
    Chthamalus dalli;
    Chthamalus fissus;
    Chthamalus challengeri;
    Chthamalus antennatus;
    Chthamalus malayensis;
    Chthamalus proteus;
    Tetraclita squamosa;
    Tetraclita japonica;
    Tetraclita rubescens;
    Tetraclita serrata;
    Tetraclita rufotincta;
    Tetraclita stalactifera;
    Megabalanus tintinnabulum;
    Megabalanus coccopoma;
    Megabalanus rosa;
    Megabalanus californicus;
    Megabalanus volcano;
    Megabalanus azoricus;
    Pollicipes pollicipes;
    Pollicipes polymerus;
    Pollicipes elegans;
    Capitulum mitella;
    Lepas anatifera;
    Lepas anserifera;
    Lepas pectinata;
    Lepas hillii;
    Dosima fascicularis
  `, [7], 85);

  // ============================================================
  // BEKENDE NEDERLANDSE SCHELPDIEREN
  // ============================================================

  zeeschelpdieren(`
    Gewone mossel=Mytilus edulis=Mossel;
    Mediterrane mossel=Mytilus galloprovincialis;
    Japanse oester=Magallana gigas=Crassostrea gigas;
    Platte oester=Ostrea edulis;
    Kokkel=Cerastoderma edule;
    Brakwaterkokkel=Cerastoderma glaucum;
    Halfgeknotte strandschelp=Spisula subtruncata;
    Stevige strandschelp=Spisula solida;
    Ovale strandschelp=Spisula elliptica;
    Amerikaanse zwaardschede=Ensis leei=Ensis directus;
    Grote zwaardschede=Ensis magnus=Ensis arcuatus;
    Kleine zwaardschede=Ensis ensis;
    Tafelmesheft=Ensis siliqua;
    Groot tafelmesheft=Solen marginatus;
    Strandgaper=Mya arenaria;
    Afgeknotte gaper=Mya truncata;
    Nonnetje=Limecola balthica=Macoma balthica;
    Zaagje=Donax vittatus;
    Rechtsgestreepte platschelp=Fabulina fabula=Tellina fabula;
    Tere platschelp=Macomangulus tenuis=Tellina tenuis;
    Grote strandschelp=Mactra stultorum;
    Witte dunschaal=Abra alba;
    Abra nitida;
    Abra tenuis;
    Amerikaanse boormossel=Petricolaria pholadiformis;
    Witte boormossel=Barnea candida;
    Ruwe boormossel=Zirfaea crispata;
    Pholas dactylus;
    Gewone tapijtschelp=Ruditapes decussatus;
    Filipijnse tapijtschelp=Ruditapes philippinarum;
    Venusschelp=Chamelea striatula;
    Gewone artemisschelp=Dosinia exoleta;
    Dosinia lupinus;
    Noordkromp=Arctica islandica;
    Paardenmossel=Modiolus modiolus;
    Gewone schaalhoren=Patella vulgata;
    Gewone alikruik=Littorina littorea;
    Stompe alikruik=Littorina obtusata;
    Ruwe alikruik=Littorina saxatilis;
    Wadslakje=Peringia ulvae=Hydrobia ulvae;
    Gewone wenteltrap=Epitonium clathrus;
    Tepelhoorn=Euspira catena;
    Glanzende tepelhoorn=Euspira nitida;
    Wulk=Buccinum undatum;
    Gevlochten fuikhoorn=Tritia reticulata=Nassarius reticulatus;
    Gevlekte fuikhoorn=Tritia nitida=Nassarius nitidus;
    Purperslak=Nucella lapillus;
    Muiltje=Crepidula fornicata
  `, [], 45);

  // ============================================================
  // MOSSELEN WERELDWIJD
  // ============================================================

  zeeschelpdieren(`
    Mytilus trossulus;
    Mytilus californianus;
    Mytilus chilensis;
    Mytilus coruscus;
    Mytilus platensis;
    Perna perna;
    Perna viridis;
    Perna canaliculus;
    Choromytilus meridionalis;
    Aulacomya atra;
    Modiolus barbatus;
    Modiolus adriaticus;
    Modiolus auriculatus;
    Modiolus americanus;
    Modiolus capax;
    Modiolus philippinarum;
    Modiolus rectus;
    Modiolus traillii;
    Brachidontes exustus;
    Brachidontes pharaonis;
    Brachidontes rodriguezii;
    Brachidontes semistriatus;
    Brachidontes solisianus;
    Hormomya mutabilis;
    Mytilaster lineatus;
    Mytilaster minimus;
    Mytilaster solidus;
    Musculista senhousia=Arcuatula senhousia;
    Geukensia demissa;
    Geukensia granosissima;
    Ischadium recurvum;
    Septifer bilocularis;
    Septifer excisus;
    Lithophaga lithophaga;
    Lithophaga teres;
    Lithophaga antillarum
  `, [], 80);

  // ============================================================
  // OESTERS WERELDWIJD
  // ============================================================

  zeeschelpdieren(`
    Amerikaanse oester=Crassostrea virginica;
    Crassostrea rhizophorae;
    Crassostrea gasar;
    Crassostrea brasiliana;
    Magallana angulata=Crassostrea angulata;
    Magallana sikamea=Crassostrea sikamea;
    Magallana ariakensis=Crassostrea ariakensis;
    Magallana hongkongensis=Crassostrea hongkongensis;
    Magallana bilineata=Crassostrea bilineata;
    Saccostrea glomerata;
    Saccostrea cucullata;
    Saccostrea echinata;
    Saccostrea mordax;
    Ostrea lurida;
    Ostrea conchaphila;
    Ostrea chilensis;
    Ostrea angasi;
    Ostrea stentina;
    Ostrea denselamellosa;
    Ostrea puelchana;
    Isognomon alatus;
    Isognomon bicolor;
    Isognomon isognomum;
    Isognomon legumen;
    Isognomon radiatus;
    Pinctada margaritifera;
    Pinctada maxima;
    Pinctada radiata;
    Pinctada fucata;
    Pinctada imbricata;
    Pinctada maculata;
    Pteria penguin;
    Pteria hirundo;
    Pteria sterna
  `, [], 80);

  // ============================================================
  // HARTSCHELPEN EN KOKKELS
  // ============================================================

  zeeschelpdieren(`
    Acanthocardia aculeata;
    Acanthocardia echinata;
    Acanthocardia paucicostata;
    Acanthocardia spinosa;
    Acanthocardia tuberculata;
    Laevicardium crassum;
    Laevicardium oblongum;
    Laevicardium mortoni;
    Laevicardium laevigatum;
    Parvicardium exiguum;
    Parvicardium scabrum;
    Parvicardium pinnulatum;
    Parvicardium minimum;
    Parvicardium ovale;
    Parvicardium papillosum;
    Dinocardium robustum;
    Trachycardium muricatum;
    Trachycardium isocardia;
    Dallocardia muricata;
    Dallocardia senticosa;
    Dallocardia radula;
    Americardia media;
    Vasticardium flavum;
    Vasticardium pectiniforme;
    Vasticardium elongatum;
    Vasticardium subrugosum;
    Vasticardium assimile;
    Fulvia mutica;
    Fulvia fragilis;
    Fulvia australis;
    Fragum fragum;
    Fragum unedo;
    Fragum sueziense;
    Corculum cardissa;
    Tridacna crocea;
    Tridacna maxima;
    Tridacna squamosa;
    Hippopus hippopus
  `, [], 85);

  // ============================================================
  // VENUSSCHELPEN
  // ============================================================

  zeeschelpdieren(`
    Venus verrucosa;
    Venus casina;
    Chamelea gallina;
    Chamelea striatula;
    Ruditapes decussatus;
    Ruditapes philippinarum;
    Ruditapes variegatus;
    Venerupis corrugata;
    Venerupis aurea=Polititapes aureus;
    Polititapes rhomboides;
    Polititapes virgineus;
    Callista chione;
    Callista florida;
    Callista brevisiphonata;
    Pitar rudis;
    Pitar fulminatus;
    Pitar morrhuanus;
    Pitar dione;
    Pitar tumens;
    Dosinia exoleta;
    Dosinia lupinus;
    Dosinia concentrica;
    Dosinia elegans;
    Dosinia discus;
    Dosinia japonica;
    Dosinia anus;
    Dosinia cretacea;
    Dosinia subrosea;
    Dosinia scalaris;
    Dosinia trigona;
    Meretrix meretrix;
    Meretrix lusoria;
    Meretrix lyrata;
    Meretrix casta;
    Meretrix petechialis;
    Mercenaria mercenaria;
    Mercenaria campechiensis;
    Anomalocardia flexuosa=Anomalocardia brasiliana;
    Anomalocardia squamosa;
    Cyclina sinensis;
    Gafrarium pectinatum;
    Gafrarium tumidum;
    Gafrarium divaricatum;
    Gafrarium dispar;
    Circe scripta;
    Circe rugifera;
    Circe intermedia;
    Circe plicatina;
    Lioconcha castrensis;
    Lioconcha hieroglyphica;
    Lioconcha ornata;
    Periglypta puerpera;
    Periglypta reticulata;
    Periglypta listeri;
    Tivela mactroides;
    Tivela stultorum;
    Tivela tripla;
    Protothaca staminea=Leukoma staminea;
    Leukoma thaca;
    Leukoma asperrima;
    Leukoma pectorina;
    Chione cancellata;
    Chione elevata;
    Chione intapurpurea;
    Chione undatella;
    Chione californiensis
  `, [], 85);

  // ============================================================
  // ZAAGJES EN WIGSCHELPEN
  // ============================================================

  zeeschelpdieren(`
    Donax trunculus;
    Donax semistriatus;
    Donax variegatus;
    Donax venustus;
    Donax vittatus;
    Donax variabilis;
    Donax fossor;
    Donax denticulatus;
    Donax striatus;
    Donax obesulus;
    Donax hanleyanus;
    Donax deltoides;
    Donax serra;
    Donax sordidus;
    Donax faba;
    Donax cuneatus;
    Donax incarnatus;
    Donax scortum;
    Donax semigranosus;
    Donax gouldii;
    Donax punctatostriatus;
    Donax pulchellus;
    Iphigenia brasiliensis;
    Iphigenia delessertii;
    Iphigenia laevigata
  `, [32], 85);

  // ============================================================
  // STRANDSCHELPEN EN ANDERE ZANDSCHELPEN
  // ============================================================

  zeeschelpdieren(`
    Mactra stultorum;
    Mactra glauca;
    Mactra corallina;
    Mactra veneriformis;
    Mactra chinensis;
    Mactra violacea;
    Mactra lilacea;
    Mactra australis;
    Mactra marplatensis;
    Mactra isabelleana;
    Spisula solidissima;
    Spisula sachalinensis;
    Spisula polynyma;
    Spisula raveneli;
    Spisula ovalis;
    Tresus capax;
    Tresus nuttallii;
    Mulinia lateralis;
    Mulinia edulis;
    Mulinia cleryana;
    Mulinia coloradoensis;
    Rangia cuneata;
    Rangia flexuosa;
    Lutraria lutraria;
    Lutraria oblonga;
    Lutraria angustior;
    Lutraria philippinarum;
    Lutraria maxima;
    Raeta plicatella;
    Raeta pellicula;
    Raeta pulchella;
    Raeta rostralis
  `, [32], 85);

  // ============================================================
  // MESHEFTEN EN ZWAARDSCHEDEN
  // ============================================================

  zeeschelpdieren(`
    Ensis macha;
    Ensis minor;
    Ensis goreensis;
    Ensis terranovensis;
    Ensis minor;
    Ensis nitidus;
    Solen strictus;
    Solen grandis;
    Solen regularis;
    Solen viridis;
    Solen vagina;
    Solen corneus;
    Solen dactylus;
    Solen sicarius;
    Solen roseomaculatus;
    Siliqua patula;
    Siliqua costata;
    Siliqua minima;
    Siliqua alta;
    Siliqua radiata;
    Pharus legumen;
    Cultellus pellucidus;
    Cultellus maximus;
    Cultellus attenuatus;
    Phaxas pellucidus
  `, [32], 85);

  // ============================================================
  // PLATSCHELPEN
  // ============================================================

  zeeschelpdieren(`
    Tellina radiata;
    Tellina lineata;
    Tellina pulchella;
    Tellina listeri;
    Tellina alternata;
    Tellina sybaritica;
    Tellina staurella;
    Tellina virgata;
    Tellina donacina;
    Tellina incarnata;
    Tellina distorta;
    Tellina nitida;
    Tellina planata;
    Macoma nasuta;
    Macoma secta;
    Macoma inquinata;
    Macoma expansa;
    Macoma brota;
    Macoma contabulata;
    Macoma tenta;
    Macoma calcarea;
    Macoma moesta;
    Macoma incongrua;
    Macoma lama;
    Macoma nipponica;
    Macoma tokyoensis;
    Psammobia vespertina=Gari depressa;
    Gari fervensis;
    Gari tellinella;
    Gari costulata;
    Gari elongata;
    Gari maculosa;
    Gari amethystus;
    Gari squamosa;
    Asaphis deflorata;
    Asaphis violascens;
    Sanguinolaria sanguinolenta;
    Sanguinolaria nuttallii;
    Sanguinolaria diphos;
    Sanguinolaria acuminata
  `, [32], 85);

  // ============================================================
  // SINT-JAKOBSSCHELPEN EN MANTELSCHELPEN
  // ============================================================

  // Mantelschelpen kunnen ook actief zwemmen.
  // Daarom geen automatische koppeling aan langzame dieren.

  getijdendieren(`
    Grote sint-jakobsschelp=Pecten maximus;
    Pecten jacobaeus;
    Pecten novaezelandiae;
    Pecten fumatus;
    Wijde mantel=Aequipecten opercularis;
    Aequipecten tehuelchus;
    Bonte mantel=Mimachlamys varia;
    Mimachlamys sanguinea;
    Mimachlamys asperrima;
    Chlamys islandica;
    Chlamys hastata;
    Chlamys rubida;
    Chlamys behringiana;
    Argopecten irradians;
    Argopecten purpuratus;
    Argopecten ventricosus;
    Argopecten gibbus;
    Placopecten magellanicus;
    Mizuhopecten yessoensis;
    Euvola ziczac;
    Euvola raveneli;
    Nodipecten nodosus;
    Nodipecten subnodosus;
    Nodipecten magnificus;
    Amusium pleuronectes;
    Ylistrum balloti;
    Ylistrum japonicum
  `, [14], 75);

  // ============================================================
  // SCHAALHORENS
  // ============================================================

  zeeschelpdieren(`
    Patella vulgata;
    Patella depressa;
    Patella ulyssiponensis;
    Patella rustica;
    Patella caerulea;
    Patella ferruginea;
    Patella aspera;
    Patella candei;
    Patella pellucida;
    Cymbula granatina;
    Cymbula oculus;
    Cymbula miniata;
    Cymbula compressa;
    Cymbula safiana;
    Scutellastra argenvillei;
    Scutellastra cochlear;
    Scutellastra longicosta;
    Scutellastra granularis;
    Scutellastra tabularis;
    Scutellastra obtecta;
    Scutellastra barbara;
    Scutellastra flexuosa;
    Cellana radiata;
    Cellana tramoserica;
    Cellana ornata;
    Cellana radians;
    Cellana denticulata;
    Cellana flava;
    Cellana grata;
    Cellana nigrolineata;
    Cellana sandwicensis;
    Cellana exarata;
    Cellana talcosa;
    Lottia gigantea;
    Lottia digitalis;
    Lottia pelta;
    Lottia scabra;
    Lottia limatula;
    Lottia conus;
    Lottia austrodigitalis;
    Lottia strigatella;
    Lottia scutum;
    Lottia subrugosa;
    Lottia orbignyi;
    Tectura virginea;
    Testudinalia testudinalis;
    Acmaea mitra;
    Notoacmea pileopsis;
    Notoacmea parviconoidea;
    Notoacmea scopulina
  `, [], 85);

  // ============================================================
  // ALIKRUIKEN
  // ============================================================

  zeeschelpdieren(`
    Littorina littorea;
    Littorina obtusata;
    Littorina saxatilis;
    Littorina fabalis;
    Littorina arcana;
    Littorina compressa;
    Littorina sitkana;
    Littorina scutulata;
    Littorina plena;
    Littorina keenae;
    Littorina brevicula;
    Littorina mandshurica;
    Littorina aleutica;
    Littorina natica;
    Littoraria angulifera;
    Littoraria scabra;
    Littoraria pallescens;
    Littoraria melanostoma;
    Littoraria ardouiniana;
    Littoraria articulata;
    Littoraria carinifera;
    Littoraria filosa;
    Littoraria luteola;
    Littoraria undulata;
    Echinolittorina punctata;
    Echinolittorina neritoides;
    Echinolittorina peruviana;
    Echinolittorina ziczac;
    Echinolittorina tuberculata;
    Echinolittorina angustior;
    Echinolittorina interrupta;
    Echinolittorina meleagris;
    Echinolittorina aspera;
    Echinolittorina radiata;
    Echinolittorina malaccana;
    Echinolittorina vidua;
    Echinolittorina trochoides;
    Austrolittorina unifasciata;
    Austrolittorina antipodum;
    Austrolittorina cincta;
    Afrolittorina africana;
    Afrolittorina knysnaensis
  `, [], 85);

  // ============================================================
  // TOLHORENS EN TROCHUS-SLAKKEN
  // ============================================================

  zeeschelpdieren(`
    Gewone tolhoren=Gibbula cineraria;
    Gibbula umbilicalis;
    Gibbula magus;
    Gibbula pennanti;
    Gibbula ardens;
    Gibbula adansonii;
    Gibbula rarilineata;
    Gibbula divaricata;
    Gibbula varia;
    Phorcus lineatus=Osilinus lineatus;
    Phorcus turbinatus=Osilinus turbinatus;
    Phorcus articulatus;
    Phorcus richardi;
    Phorcus atratus;
    Phorcus sauciatus;
    Jujubinus exasperatus;
    Jujubinus striatus;
    Jujubinus montagui;
    Calliostoma zizyphinum;
    Calliostoma granulatum;
    Calliostoma conulus;
    Calliostoma ligatum;
    Calliostoma canaliculatum;
    Tegula funebralis;
    Tegula brunnea;
    Tegula montereyi;
    Tegula gallina;
    Tegula aureotincta;
    Tegula atra;
    Tegula viridula;
    Tegula patagonica;
    Tegula eiseni;
    Chlorostoma argyrostomum;
    Chlorostoma lischkei;
    Trochus maculatus;
    Trochus histrio;
    Trochus radiatus;
    Trochus stellatus;
    Tectus niloticus=Rochia nilotica;
    Tectus pyramis;
    Tectus fenestratus;
    Tectus mauritianus;
    Monodonta labio;
    Monodonta australis;
    Monodonta canalifera;
    Diloma aethiops;
    Diloma subrostratum;
    Diloma aridum;
    Diloma nigerrimum;
    Austrocochlea constricta;
    Austrocochlea porcata
  `, [], 85);

  // ============================================================
  // NERITEN
  // ============================================================

  zeeschelpdieren(`
    Nerita peloronta;
    Nerita tessellata;
    Nerita versicolor;
    Nerita fulgurans;
    Nerita atramentosa;
    Nerita melanotragus;
    Nerita plicata;
    Nerita chamaeleon;
    Nerita albicilla;
    Nerita polita;
    Nerita undata;
    Nerita histrio;
    Nerita costata;
    Nerita exuvia;
    Nerita signata;
    Nerita litterata;
    Nerita insculpta;
    Nerita patula;
    Nerita maxima;
    Nerita balteata;
    Nerita planospira;
    Nerita lineata;
    Nerita senegalensis;
    Nerita funiculata;
    Nerita scabricosta;
    Nerita bernhardi;
    Nerita japonica;
    Nerita squamulata;
    Nerita grossa;
    Nerita yoldii
  `, [], 85);

  // ============================================================
  // ABALONES EN ZEEOREN
  // ============================================================

  zeeschelpdieren(`
    Europees zeeoor=Haliotis tuberculata;
    Haliotis lamellosa;
    Haliotis asinina;
    Haliotis varia;
    Haliotis ovina;
    Haliotis diversicolor;
    Haliotis discus;
    Haliotis gigantea;
    Haliotis madaka;
    Haliotis rufescens;
    Haliotis fulgens;
    Haliotis corrugata;
    Haliotis cracherodii;
    Haliotis kamtschatkana;
    Haliotis walallensis;
    Haliotis iris;
    Haliotis australis;
    Haliotis rubra;
    Haliotis laevigata;
    Haliotis roei;
    Haliotis scalaris;
    Haliotis cyclobates;
    Haliotis midae;
    Haliotis parva;
    Haliotis spadicea;
    Haliotis pustulata;
    Haliotis mariae;
    Haliotis pourtalesii;
    Haliotis squamata
  `, [], 85);

  // ============================================================
  // PURPERSLAKKEN EN ROOFSL AKKEN
  // ============================================================

  zeeschelpdieren(`
    Nucella lapillus;
    Nucella lamellosa;
    Nucella ostrina;
    Nucella emarginata;
    Nucella canaliculata;
    Nucella lima;
    Nucella freycinetii;
    Ocenebra erinaceus;
    Ocenebra inornata;
    Ocinebrina aciculata;
    Ocinebrina edwardsii;
    Hexaplex trunculus;
    Bolinus brandaris;
    Stramonita haemastoma;
    Stramonita floridana;
    Stramonita rustica;
    Stramonita biserialis;
    Stramonita chocolata;
    Thais nodosa;
    Thais coronata;
    Reishia clavigera;
    Reishia bronni;
    Reishia luteostoma;
    Menathais tuberosa;
    Mancinella alouina;
    Mancinella armigera;
    Mancinella echinulata;
    Tenguella granulata;
    Tenguella marginalba;
    Drupa ricinus;
    Drupa morum;
    Drupa rubusidaeus;
    Drupa grossularia;
    Drupella cornus;
    Drupella rugosa;
    Drupella fragum;
    Morula uva;
    Morula nodicostata;
    Morula granulata;
    Plicopurpura patula;
    Plicopurpura pansa;
    Plicopurpura columellaris;
    Plicopurpura persica
  `, [17], 85);

  // ============================================================
  // FUIKHORENS EN WULKEN
  // ============================================================

  zeeschelpdieren(`
    Buccinum undatum;
    Buccinum cyaneum;
    Buccinum glaciale;
    Buccinum tenuissimum;
    Buccinum undatum;
    Neptunea antiqua;
    Neptunea despecta;
    Neptunea lyrata;
    Neptunea arthritica;
    Neptunea polycostata;
    Kelletia kelletii;
    Kelletia lischkei;
    Busycon carica;
    Busycon perversum;
    Busycotypus canaliculatus;
    Sinistrofulgur sinistrum;
    Fulguropsis spirata;
    Tritia reticulata;
    Tritia nitida;
    Tritia incrassata;
    Tritia mutabilis;
    Tritia neritea;
    Tritia corniculum;
    Tritia pygmaea;
    Tritia cuvierii;
    Nassarius arcularia;
    Nassarius distortus;
    Nassarius globosus;
    Nassarius pullus;
    Nassarius olivaceus;
    Nassarius papillosus;
    Nassarius coronatus;
    Nassarius concinnus;
    Nassarius livescens;
    Nassarius nodifer;
    Nassarius siquijorensis;
    Nassarius pauperus;
    Nassarius dorsatus;
    Nassarius albescens;
    Nassarius festivus;
    Nassarius reticulatus
  `, [], 85);

  // ============================================================
  // KAURISCHELPEN
  // ============================================================

  zeeschelpdieren(`
    Tijgerkauri=Cypraea tigris;
    Cypraea pantherina;
    Mauritia arabica;
    Mauritia mauritiana;
    Mauritia mappa;
    Mauritia eglantina;
    Mauritia scurra;
    Monetaria moneta;
    Monetaria annulus;
    Monetaria caputserpentis;
    Monetaria obvelata;
    Lyncina lynx;
    Lyncina vitellus;
    Lyncina carneola;
    Lyncina leviathan;
    Lyncina argus;
    Leporicypraea mappa;
    Erronea errones;
    Erronea caurica;
    Erronea cylindrica;
    Erronea onyx;
    Erronea ovum;
    Palmadusta asellus;
    Palmadusta clandestina;
    Palmadusta lutea;
    Palmadusta ziczac;
    Purpuradusta gracilis;
    Purpuradusta fimbriata;
    Purpuradusta minoridens;
    Naria erosa;
    Naria helvola;
    Naria spurca;
    Naria turdus;
    Naria lamarckii;
    Naria poraria;
    Naria miliaris;
    Naria gangranosa;
    Naria nebrites;
    Staphylaea staphylaea;
    Staphylaea limacina;
    Staphylaea nucleus;
    Staphylaea semiplota;
    Bistolida hirundo;
    Bistolida stolida;
    Bistolida kieneri;
    Bistolida ursellus;
    Bistolida pallidula;
    Erosaria acicularis;
    Erosaria ocellata;
    Zonaria pyrum;
    Zonaria zonaria;
    Zonaria sanguinolenta;
    Luria lurida;
    Luria isabella;
    Luria cinerea;
    Luria tessellata;
    Talparia talpa;
    Macrocypraea cervus;
    Macrocypraea zebra;
    Macrocypraea cervinetta
  `, [], 85);

  // ============================================================
  // KEGELSLAKKEN
  // ============================================================

  // Kegelslakken zijn giftige roofslakken.
  // Alleen voor de spelclassificatie opnemen.

  zeeschelpdieren(`
    Conus textile;
    Conus geographus;
    Conus marmoreus;
    Conus tulipa;
    Conus magus;
    Conus striatus;
    Conus catus;
    Conus obscurus;
    Conus arenatus;
    Conus lividus;
    Conus ebraeus;
    Conus chaldaeus;
    Conus coronatus;
    Conus miliaris;
    Conus sponsalis;
    Conus rattus;
    Conus sanguinolentus;
    Conus flavidus;
    Conus virgo;
    Conus capitaneus;
    Conus miles;
    Conus vexillum;
    Conus tessulatus;
    Conus eburneus;
    Conus betulinus;
    Conus caracteristicus;
    Conus litteratus;
    Conus leopardus;
    Conus quercinus;
    Conus generalis;
    Conus monachus;
    Conus bandanus;
    Conus imperialis;
    Conus planorbis;
    Conus canonicus;
    Conus episcopatus;
    Conus pennaceus;
    Conus omaria;
    Conus aulicus;
    Conus ammiralis;
    Conus aurisiacus;
    Conus auricomus;
    Conus distans;
    Conus figulinus;
    Conus achatinus;
    Conus anemone;
    Conus ventricosus;
    Conus mediterraneus;
    Conus regius;
    Conus mus;
    Conus ermineus;
    Conus spurius;
    Conus jaspideus;
    Conus floridanus;
    Conus anabathrum;
    Conus daucus;
    Conus cedonulli;
    Conus purpurascens;
    Conus brunneus;
    Conus nux;
    Conus princeps;
    Conus patricius;
    Conus gladiator;
    Conus tiaratus;
    Conus diadema
  `, [17,45], 90);

  // ============================================================
  // OLIVASLAKKEN EN ZANDSLAKKEN
  // ============================================================

  zeeschelpdieren(`
    Oliva oliva;
    Oliva sayana;
    Oliva reticularis;
    Oliva scripta;
    Oliva porphyria;
    Oliva incrassata;
    Oliva splendidula;
    Oliva polpasta;
    Oliva miniacea;
    Oliva caerulea;
    Oliva amethystina;
    Oliva bulbosa;
    Oliva hirasei;
    Oliva irisans;
    Oliva nebulosa;
    Oliva tessellata;
    Oliva tricolor;
    Oliva vidua;
    Oliva funebralis;
    Oliva gibbosa;
    Olivella biplicata;
    Olivella baetica;
    Olivella pycna;
    Olivella minuta;
    Olivella verreauxii;
    Olivella floralia;
    Olivella semistriata;
    Olivella columellaris;
    Olivella dama;
    Agaronia propatula;
    Agaronia testacea;
    Agaronia hiatula;
    Agaronia acuminata;
    Ancillista muscae;
    Ancilla ampla;
    Ancilla cinnamomea;
    Ancilla tankervillii
  `, [], 85);

  // ============================================================
  // T EPELHOORNS EN MAANSLAKKEN
  // ============================================================

  zeeschelpdieren(`
    Euspira catena;
    Euspira nitida;
    Euspira fusca;
    Euspira montagui;
    Euspira pallida;
    Euspira heros;
    Euspira lewisii=Neverita lewisii;
    Neverita duplicata;
    Neverita josephinia;
    Neverita didyma;
    Neverita delessertiana;
    Neverita reclusiana;
    Polinices mammilla;
    Polinices flemingianus;
    Polinices lacteus;
    Polinices aurantius;
    Polinices melanostomus;
    Polinices tumidus;
    Natica hebraea;
    Natica stercusmuscarum;
    Natica vitellus;
    Natica gualteriana;
    Natica tigrina;
    Natica fasciata;
    Natica marochiensis;
    Naticarius canrena;
    Naticarius onca;
    Naticarius alapapilionis;
    Tectonatica sagraiana;
    Tectonatica filosa;
    Tectonatica rizzae;
    Sinum perspectivum;
    Sinum maculatum;
    Sinum cymba;
    Sinum concavum
  `, [17], 85);

  // ============================================================
  // STO RMHORENS EN VLEUGELHORENS
  // ============================================================

  zeeschelpdieren(`
    Lobatus gigas=Aliger gigas;
    Lobatus raninus;
    Lobatus costatus;
    Lobatus gallus;
    Strombus pugilis;
    Strombus alatus;
    Strombus gracilior;
    Strombus granulatus;
    Canarium urceus;
    Canarium mutabile;
    Canarium labiatum;
    Canarium erythrinum;
    Canarium microurceus;
    Canarium maculatum;
    Canarium ochroglottis;
    Canarium haemastoma;
    Conomurex luhuanus;
    Conomurex fasciatus;
    Conomurex persicus;
    Gibberulus gibberulus;
    Gibberulus gibbosus;
    Laevistrombus canarium;
    Laevistrombus turturella;
    Lentigo lentiginosus;
    Lentigo pipus;
    Euprotomus bulla;
    Euprotomus aurisdianae;
    Euprotomus aratrum;
    Euprotomus vomer;
    Harpago chiragra;
    Harpago arthriticus;
    Lambis lambis;
    Lambis truncata;
    Lambis millepeda;
    Lambis scorpius;
    Lambis crocata;
    Lambis arachnoides;
    Ophioglossolambis digitata
  `, [], 85);

  // ============================================================
  // CERITHIUM-SLAKKEN
  // ============================================================

  zeeschelpdieren(`
    Cerithium vulgatum;
    Cerithium lividulum;
    Cerithium renovatum;
    Cerithium alucastrum;
    Cerithium nodulosum;
    Cerithium echinatum;
    Cerithium caeruleum;
    Cerithium coralium;
    Cerithium columna;
    Cerithium punctatum;
    Cerithium rostratum;
    Cerithium scabridum;
    Cerithium atratum;
    Cerithium litteratum;
    Cerithium muscarum;
    Cerithium eburneum;
    Cerithium lutosum;
    Cerithium stercusmuscarum;
    Cerithium uncinatum;
    Clypeomorus batillariaeformis;
    Clypeomorus bifasciata;
    Clypeomorus coralium;
    Clypeomorus petrosa;
    Clypeomorus subbrevicula;
    Rhinoclavis vertagus;
    Rhinoclavis aspera;
    Rhinoclavis fasciata;
    Rhinoclavis sinensis;
    Rhinoclavis articulata;
    Batillaria attramentaria;
    Batillaria multiformis;
    Batillaria zonalis;
    Batillaria australis;
    Cerithidea obtusa;
    Cerithidea decollata;
    Cerithidea cingulata;
    Cerithideopsis californica;
    Cerithideopsis pliculosa;
    Pirenella conica;
    Telescopium telescopium;
    Terebralia palustris;
    Terebralia sulcata;
    Terebralia semistriata
  `, [], 85);

  // ============================================================
  // KEVERSLAKKEN
  // ============================================================

  zeeschelpdieren(`
    Gewone keverslak=Lepidochitona cinerea;
    Lepidochitona corrugata;
    Lepidochitona caprearum;
    Lepidochitona monterosatoi;
    Tonicella lineata;
    Tonicella lokii;
    Tonicella marmorea;
    Tonicella rubra;
    Tonicella insignis;
    Tonicella undocaerulea;
    Katharina tunicata;
    Cryptochiton stelleri;
    Mopalia muscosa;
    Mopalia ciliata;
    Mopalia lignosa;
    Mopalia hindsii;
    Mopalia imporcata;
    Mopalia plumosa;
    Mopalia kennerleyi;
    Mopalia spectabilis;
    Mopalia retifera;
    Mopalia sinuata;
    Nuttallina californica;
    Nuttallina fluxa;
    Cyanoplax hartwegii;
    Cyanoplax dentiens;
    Cyanoplax caverna;
    Cyanoplax keepiana;
    Ischnochiton rissoi;
    Ischnochiton striolatus;
    Ischnochiton australis;
    Ischnochiton elongatus;
    Ischnochiton smaragdinus;
    Ischnochiton variegatus;
    Ischnochiton comptus;
    Ischnochiton hakodadensis;
    Chiton olivaceus;
    Chiton corallinus;
    Chiton magnificus;
    Chiton granosus;
    Chiton cumingsii;
    Chiton stokesii;
    Chiton tuberculatus;
    Chiton squamosus;
    Chiton marmoratus;
    Chiton articulatus;
    Acanthopleura granulata;
    Acanthopleura gemmata;
    Acanthopleura echinata;
    Acanthopleura spinosa;
    Acanthopleura japonica;
    Acanthochitona crinita;
    Acanthochitona fascicularis;
    Acanthochitona discrepans;
    Acanthochitona garnoti;
    Acanthochitona rubrolineata;
    Acanthochitona achates;
    Plaxiphora albida;
    Plaxiphora aurata;
    Plaxiphora biramosa;
    Sypharochiton pelliserpentis;
    Sypharochiton sinclairi
  `, [], 85);

  // ============================================================
  // ZEEHAZEN
  // ============================================================

  getijdendieren(`
    Zeehaas=Aplysia punctata;
    Aplysia depilans;
    Aplysia fasciata;
    Aplysia californica;
    Aplysia brasiliana;
    Aplysia dactylomela;
    Aplysia argus;
    Aplysia parvula;
    Aplysia juliana;
    Aplysia kurodai;
    Aplysia oculifera;
    Aplysia extraordinaria;
    Dolabella auricularia;
    Dolabrifera dolabrifera;
    Dolabrifera brazieri;
    Bursatella leachii;
    Stylocheilus striatus;
    Petalifera petalifera
  `, [30], 80);

  // ============================================================
  // NAAKTSLAKKEN VAN ROTSACHTIGE KUSTEN
  // ============================================================

  getijdendieren(`
    Zeecitroen=Doris pseudoargus;
    Doris verrucosa;
    Doris montereyensis;
    Doris odhneri;
    Doris nobilis;
    Doris cameroni;
    Doris fontainei;
    Onchidoris muricata;
    Onchidoris bilamellata;
    Onchidoris oblonga;
    Onchidoris pusilla;
    Acanthodoris pilosa;
    Acanthodoris nanaimoensis;
    Acanthodoris lutea;
    Acanthodoris rhodoceras;
    Acanthodoris hudsoni;
    Jorunna tomentosa;
    Jorunna funebris;
    Jorunna parva;
    Jorunna rubescens;
    Jorunna pardus;
    Geitodoris planata;
    Geitodoris heathi;
    Rostanga rubra;
    Rostanga pulchra;
    Rostanga arbutus;
    Rostanga risbeci;
    Doto coronata;
    Doto fragilis;
    Doto pinnatifida;
    Doto floridicola;
    Doto millbayana;
    Doto tuberculata;
    Doto columbiana;
    Doto amyra;
    Aeolidia papillosa;
    Aeolidia filomenae;
    Aeolidiella alderi;
    Aeolidiella glauca;
    Aeolidiella stephanieae;
    Berghia coerulescens;
    Berghia verrucicornis;
    Berghia stephanieae;
    Facelina auriculata;
    Facelina bostoniensis;
    Facelina annulicornis;
    Facelina punctata;
    Cratena peregrina;
    Cratena capensis;
    Cratena lineata;
    Favorinus branchialis;
    Favorinus blianus;
    Favorinus japonicus;
    Favorinus tsuruganus;
    Flabellina affinis;
    Flabellina iodinea;
    Flabellina verrucosa;
    Coryphella verrucosa;
    Coryphella gracilis;
    Coryphella lineata;
    Hermissenda crassicornis;
    Hermissenda opalescens;
    Hermissenda emurai;
    Limacia clavigera;
    Limacia cockerelli;
    Limacia mcdonaldi;
    Polycera quadrilineata;
    Polycera faeroensis;
    Polycera atra;
    Polycera tricolor;
    Polycera capensis;
    Ancula gibbosa;
    Ancula pacifica;
    Ancula lentiginosa;
    Trapania maculata;
    Trapania lineata;
    Trapania pallida;
    Trapania tartanella;
    Tritonia hombergii;
    Tritonia plebeia;
    Tritonia festiva;
    Tritonia diomedea
  `, [30], 85);

  // ============================================================
  // CHROMODORIDE NAAKTSLAKKEN
  // ============================================================

  getijdendieren(`
    Chromodoris annae;
    Chromodoris africana;
    Chromodoris dianae;
    Chromodoris elisabethina;
    Chromodoris lochi;
    Chromodoris magnifica;
    Chromodoris quadricolor;
    Chromodoris strigata;
    Chromodoris willani;
    Chromodoris hamiltoni;
    Chromodoris kuiteri;
    Chromodoris joshi;
    Chromodoris colemani;
    Chromodoris lineolata;
    Chromodoris orientalis;
    Goniobranchus aureopurpureus;
    Goniobranchus coi;
    Goniobranchus fidelis;
    Goniobranchus geometricus;
    Goniobranchus kuniei;
    Goniobranchus leopardus;
    Goniobranchus reticulatus;
    Goniobranchus tinctorius;
    Goniobranchus splendidus;
    Goniobranchus verrieri;
    Goniobranchus albonares;
    Goniobranchus annulatus;
    Goniobranchus preciosus;
    Goniobranchus vibratus;
    Hypselodoris apolegma;
    Hypselodoris bullockii;
    Hypselodoris festiva;
    Hypselodoris infucata;
    Hypselodoris kanga;
    Hypselodoris maculosa;
    Hypselodoris maritima;
    Hypselodoris nigrostriata;
    Hypselodoris obscura;
    Hypselodoris purpureomaculosa;
    Hypselodoris tryoni;
    Hypselodoris whitei;
    Hypselodoris zephyra;
    Felimare picta;
    Felimare tricolor;
    Felimare villafranca;
    Felimare cantabrica;
    Felimare fontandraui;
    Felimare orsinii;
    Felimare bilineata;
    Felimare californiensis;
    Felimare porterae;
    Felimare agassizii
  `, [30,47], 90);

  // ============================================================
  // OCTOPUSSEN VAN ONDIEPE KUSTWATEREN
  // ============================================================

  getijdendieren(`
    Gewone octopus=Octopus vulgaris;
    Octopus cyanea;
    Octopus bimaculoides;
    Octopus bimaculatus;
    Octopus briareus;
    Octopus rubescens;
    Octopus insularis;
    Octopus maya;
    Octopus tetricus;
    Octopus maorum;
    Octopus sinensis;
    Octopus laqueus;
    Octopus oliveri;
    Octopus hummelincki;
    Octopus mercatoris;
    Amphioctopus marginatus;
    Amphioctopus aegina;
    Amphioctopus fangsiao;
    Amphioctopus mototi;
    Amphioctopus neglectus;
    Callistoctopus macropus;
    Callistoctopus ornatus;
    Callistoctopus luteus;
    Callistoctopus nocturnus;
    Abdopus aculeatus;
    Abdopus capricornicus;
    Enteroctopus dofleini;
    Enteroctopus megalocyathus;
    Hapalochlaena lunulata;
    Hapalochlaena maculosa;
    Hapalochlaena fasciata;
    Wunderpus photogenicus;
    Thaumoctopus mimicus
  `, [7,14,17,42], 80);

  koppel(`
    Hapalochlaena lunulata;
    Hapalochlaena maculosa;
    Hapalochlaena fasciata
  `, [45,47], 85);

  // ============================================================
  // ZEE KATTEN EN INKTVISSEN
  // ============================================================

  // Kustsoorten en soorten waarvan het interne
  // schelpschild regelmatig op stranden aanspoelt.

  getijdendieren(`
    Gewone zeekat=Sepia officinalis;
    Sepia elegans;
    Sepia orbignyana;
    Sepia pharaonis;
    Sepia latimanus;
    Sepia apama;
    Sepia esculenta;
    Sepia aculeata;
    Sepia recurvirostra;
    Sepia elliptica;
    Sepia bandensis;
    Sepia plangon;
    Sepia mestus;
    Sepia grahami;
    Sepia australis;
    Sepia hierredda;
    Sepia bertheloti;
    Sepia prashadi;
    Sepiella inermis;
    Sepiella japonica;
    Sepiola atlantica;
    Sepiola rondeletii;
    Sepiola robusta;
    Sepiola intermedia;
    Euprymna scolopes;
    Euprymna tasmanica;
    Euprymna morsei;
    Euprymna berryi;
    Loligo vulgaris;
    Loligo forbesii;
    Doryteuthis pealeii;
    Doryteuthis opalescens;
    Lolliguncula brevis;
    Lolliguncula panamensis
  `, [7,14,17,42], 80);

  // ============================================================
  // ZEESTERREN
  // ============================================================

  getijdendieren(`
    Gewone zeester=Asterias rubens;
    Asterias forbesi;
    Asterias amurensis;
    Gewone kamster=Astropecten irregularis;
    Astropecten aranciacus;
    Astropecten bispinosus;
    Astropecten jonstoni;
    Astropecten platyacanthus;
    Astropecten spinulosus;
    Astropecten articulatus;
    Astropecten duplicatus;
    Astropecten americanus;
    Astropecten polyacanthus;
    Astropecten indicus;
    Astropecten scoparius;
    Astropecten armatus;
    Marthasterias glacialis;
    Cosmasterias lurida;
    Coscinasterias tenuispina;
    Coscinasterias muricata;
    Coscinasterias acutispina;
    Pisaster ochraceus;
    Pisaster brevispinus;
    Pisaster giganteus;
    Evasterias troschelii;
    Leptasterias hexactis;
    Leptasterias aequalis;
    Leptasterias polaris;
    Leptasterias groenlandica;
    Stichaster australis;
    Stichaster striatus;
    Heliaster helianthus;
    Heliaster kubiniji;
    Heliaster microbrachius;
    Heliaster canopus;
    Pycnopodia helianthoides;
    Solaster endeca;
    Solaster stimpsoni;
    Solaster dawsoni;
    Crossaster papposus;
    Luidia ciliaris;
    Luidia sarsii;
    Luidia maculata;
    Luidia clathrata;
    Luidia senegalensis;
    Luidia alternata;
    Luidia australiae;
    Luidia savignyi;
    Echinaster sepositus;
    Echinaster spinulosus;
    Echinaster sentus;
    Echinaster brasiliensis;
    Echinaster luzonicus;
    Echinaster callosus;
    Echinaster echinophorus;
    Henricia sanguinolenta;
    Henricia oculata;
    Henricia leviuscula;
    Henricia pumila;
    Henricia aspera;
    Patiria miniata;
    Patiria pectinifera;
    Patiriella regularis;
    Patiriella exigua;
    Meridiastra calcar;
    Meridiastra gunnii;
    Meridiastra oriens;
    Asterina gibbosa;
    Asterina phylactica;
    Asterina stellifera;
    Asterinides folium;
    Aquilonastra burtoni;
    Aquilonastra coronata;
    Aquilonastra minor;
    Aquilonastra conandae;
    Aquilonastra scobinata;
    Parvulastra exigua;
    Parvulastra vivipara;
    Nepanthia belcheri;
    Fromia monilis;
    Fromia milleporella;
    Fromia indica;
    Fromia nodosa;
    Linckia laevigata;
    Linckia multifora;
    Linckia guildingi;
    Linckia columbiae;
    Nardoa novaecaledoniae;
    Nardoa tuberculata;
    Ophidiaster ophidianus;
    Ophidiaster granifer;
    Tamaria stria;
    Protoreaster nodosus;
    Protoreaster lincki;
    Pentaceraster cumingi;
    Pentaceraster mammillatus;
    Pentaceraster regulus;
    Culcita novaeguineae;
    Culcita schmideliana;
    Oreaster reticulatus;
    Acanthaster planci;
    Acanthaster solaris
  `, [30], 85);

  // ============================================================
  // SLANGSTERREN
  // ============================================================

  getijdendieren(`
    Gewone slangster=Ophiura ophiura;
    Kleine slangster=Ophiura albida;
    Ophiura robusta;
    Ophiura sarsii;
    Ophiura texturata;
    Ophiothrix fragilis;
    Ophiothrix angulata;
    Ophiothrix spiculata;
    Ophiothrix suensonii;
    Ophiothrix oerstedii;
    Ophiothrix trilineata;
    Ophiothrix purpurea;
    Ophiactis savignyi;
    Ophiactis virens;
    Ophiactis simplex;
    Ophiactis resiliens;
    Ophiactis macrolepidota;
    Ophiocoma scolopendrina;
    Ophiocoma erinaceus;
    Ophiocoma echinata;
    Ophiocoma wendtii;
    Ophiocoma pumila;
    Ophiocoma aethiops;
    Ophiocoma alexandri;
    Ophiocoma valenciae;
    Ophiocoma brevipes;
    Ophioderma longicauda;
    Ophioderma brevispinum;
    Ophioderma appressum;
    Ophioderma cinereum;
    Ophioderma rubicundum;
    Ophioderma panamense;
    Ophioderma variegatum;
    Ophionereis reticulata;
    Ophionereis annulata;
    Ophionereis fasciata;
    Ophionereis olivacea;
    Amphipholis squamata;
    Amphiura filiformis;
    Amphiura chiajei;
    Amphiura brachiata;
    Amphiura stimpsonii;
    Amphiura arcystata;
    Ophiopholis aculeata;
    Ophiopholis kennerlyi;
    Ophiopholis mirabilis;
    Ophioplocus januarii;
    Ophioplocus imbricatus
  `, [], 85);

  // ============================================================
  // ZEE-EGELS
  // ============================================================

  getijdendieren(`
    Gewone zee-egel=Echinus esculentus;
    Echinus acutus;
    Psammechinus miliaris;
    Psammechinus microtuberculatus;
    Paracentrotus lividus;
    Paracentrotus gaimardi;
    Arbacia lixula;
    Arbacia punctulata;
    Arbacia stellata;
    Arbacia dufresnii;
    Arbacia spatuligera;
    Strongylocentrotus purpuratus;
    Strongylocentrotus droebachiensis;
    Strongylocentrotus pallidus;
    Strongylocentrotus intermedius;
    Mesocentrotus franciscanus;
    Mesocentrotus nudus;
    Heliocidaris erythrogramma;
    Heliocidaris tuberculata;
    Centrostephanus rodgersii;
    Centrostephanus longispinus;
    Centrostephanus coronatus;
    Diadema setosum;
    Diadema antillarum;
    Diadema savignyi;
    Diadema mexicanum;
    Diadema paucispinum;
    Diadema palmeri;
    Echinothrix calamaris;
    Echinothrix diadema;
    Echinometra mathaei;
    Echinometra lucunter;
    Echinometra viridis;
    Echinometra oblonga;
    Echinometra vanbrunti;
    Heterocentrotus mamillatus;
    Heterocentrotus trigonarius;
    Colobocentrotus atratus;
    Colobocentrotus mertensii;
    Stomopneustes variolaris;
    Tripneustes gratilla;
    Tripneustes ventricosus;
    Tripneustes depressus;
    Toxopneustes pileolus;
    Toxopneustes roseus;
    Lytechinus variegatus;
    Lytechinus pictus;
    Lytechinus semituberculatus;
    Lytechinus anamesus;
    Pseudoboletia maculata;
    Salmacis bicolor;
    Salmacis sphaeroides;
    Salmacis virgulata;
    Temnopleurus toreumaticus;
    Temnopleurus hardwickii;
    Mespilia globulus;
    Microcyphus rousseaui;
    Evechinus chloroticus;
    Parechinus angulosus;
    Anthocidaris crassispina;
    Phyllacanthus imperialis;
    Eucidaris tribuloides;
    Eucidaris thouarsii;
    Eucidaris metularia;
    Prionocidaris baculosa
  `, [30], 85);

  // ============================================================
  // ZANDDOLLARS EN HARTEGELS
  // ============================================================

  getijdendieren(`
    Zeeklit=Echinocardium cordatum;
    Echinocardium flavescens;
    Echinocardium mediterraneum;
    Echinocardium pennatifidum;
    Echinocardium australe;
    Brissopsis lyrifera;
    Brissus unicolor;
    Brissus latecarinatus;
    Spatangus purpureus;
    Spatangus raschi;
    Moira atropos;
    Lovenia elongata;
    Lovenia subcarinata;
    Lovenia cordiformis;
    Clypeaster rosaceus;
    Clypeaster subdepressus;
    Clypeaster humilis;
    Clypeaster reticulatus;
    Clypeaster rarispinus;
    Clypeaster japonicus;
    Clypeaster australasiae;
    Clypeaster virescens;
    Echinarachnius parma;
    Dendraster excentricus;
    Dendraster vizcainoensis;
    Mellita quinquiesperforata;
    Mellita tenuis;
    Mellita isometra;
    Mellita notabilis;
    Mellita longifissa;
    Encope emarginata;
    Encope michelini;
    Encope aberrans;
    Encope grandis;
    Encope micropora;
    Leodia sexiesperforata;
    Rotula deciesdigitata;
    Echinodiscus auritus;
    Echinodiscus bisperforatus;
    Sculpsitechinus auritus;
    Astriclypeus mannii;
    Peronella japonica;
    Peronella lesueuri;
    Peronella orbicularis;
    Arachnoides placenta;
    Fellaster zelandiae
  `, [30], 85);

  // ============================================================
  // ZEEKOMKOMMERS
  // ============================================================

  getijdendieren(`
    Holothuria tubulosa;
    Holothuria polii;
    Holothuria forskali;
    Holothuria sanctori;
    Holothuria mammata;
    Holothuria atra;
    Holothuria leucospilota;
    Holothuria edulis;
    Holothuria scabra;
    Holothuria fuscocinerea;
    Holothuria hilla;
    Holothuria impatiens;
    Holothuria pardalis;
    Holothuria pervicax;
    Holothuria arenicola;
    Holothuria mexicana;
    Holothuria floridana;
    Holothuria grisea;
    Holothuria glaberrima;
    Holothuria difficilis;
    Holothuria cinerascens;
    Holothuria excellens;
    Holothuria coluber;
    Holothuria atra;
    Actinopyga mauritiana;
    Actinopyga echinites;
    Actinopyga lecanora;
    Actinopyga miliaris;
    Actinopyga obesa;
    Actinopyga capillata;
    Actinopyga caerulea;
    Bohadschia argus;
    Bohadschia marmorata;
    Bohadschia vitiensis;
    Bohadschia atra;
    Bohadschia bivittata;
    Stichopus chloronotus;
    Stichopus horrens;
    Stichopus monotuberculatus;
    Stichopus vastus;
    Stichopus herrmanni;
    Stichopus ocellatus;
    Stichopus naso;
    Isostichopus badionotus;
    Isostichopus fuscus;
    Apostichopus japonicus;
    Apostichopus californicus;
    Parastichopus parvimensis;
    Australostichopus mollis;
    Cucumaria frondosa;
    Cucumaria miniata;
    Cucumaria curata;
    Cucumaria pseudocurata;
    Pentacta pygmaea;
    Pseudocnella insolens;
    Aslia lefevrei;
    Ocnus planci;
    Leptosynapta inhaerens;
    Leptosynapta tenuis;
    Synapta maculata;
    Euapta godeffroyi;
    Euapta lappa;
    Opheodesoma grisea;
    Opheodesoma spectabilis;
    Polyplectana kefersteini
  `, [30], 85);

  // ============================================================
  // KWALLEN DIE REGELMATIG AANSPOELEN
  // ============================================================

  getijdendieren(`
    Oorkwal=Aurelia aurita;
    Aurelia labiata;
    Aurelia limbata;
    Aurelia coerulea;
    Aurelia solida;
    Aurelia marginalis;
    Blauwe haarkwal=Cyanea lamarckii;
    Gele haarkwal=Cyanea capillata;
    Cyanea nozakii;
    Cyanea rosea;
    Kompaskwal=Chrysaora hysoscella;
    Chrysaora quinquecirrha;
    Chrysaora chesapeakei;
    Chrysaora fuscescens;
    Chrysaora achlyos;
    Chrysaora colorata;
    Chrysaora pacifica;
    Chrysaora melanaster;
    Chrysaora plocamia;
    Chrysaora lactea;
    Chrysaora fulgida;
    Chrysaora africana;
    Chrysaora chinensis;
    Parelkwal=Pelagia noctiluca;
    Rhizostoma octopus=Zeepaddenstoel;
    Rhizostoma pulmo;
    Rhizostoma luteum;
    Rhopilema esculentum;
    Rhopilema nomadica;
    Rhopilema hispidum;
    Catostylus mosaicus;
    Catostylus townsendi;
    Cotylorhiza tuberculata;
    Phyllorhiza punctata;
    Mastigias papua;
    Stomolophus meleagris;
    Nemopilema nomurai;
    Lychnorhiza lucerna;
    Crambione mastigophora;
    Cephea cephea;
    Cassiopea xamachana;
    Cassiopea andromeda;
    Cassiopea frondosa;
    Sanderia malayensis
  `, [14,17], 75);

  // ============================================================
  // OVERIGE GELATINEUZE ZEEDIEREN
  // ============================================================

  getijdendieren(`
    Portugees oorlogsschip=Physalia physalis;
    Velella velella;
    Porpita porpita;
    Zeedruif=Pleurobrachia pileus;
    Pleurobrachia bachei;
    Amerikaanse ribkwal=Mnemiopsis leidyi;
    Beroe cucumis;
    Beroe ovata;
    Beroe gracilis;
    Bolinopsis infundibulum;
    Bolinopsis vitrea;
    Leucothea multicornis;
    Ocyropsis crystallina;
    Cestum veneris;
    Salpa fusiformis;
    Salpa maxima;
    Salpa aspera;
    Thalia democratica
  `, [], 80);

  koppel(`
    Portugees oorlogsschip;
    Gele haarkwal;
    Kompaskwal;
    Parelkwal;
    Chrysaora fuscescens;
    Chrysaora quinquecirrha;
    Rhopilema nomadica
  `, [45], 75);

  // ============================================================
  // ZEEANEMONEN VAN GETIJDENPOELEN
  // ============================================================

  getijdendieren(`
    Paardenanemoon=Actinia equina;
    Aardbeianemoon=Actinia fragacea;
    Actinia tenebrosa;
    Actinia bermudensis;
    Actinia cari;
    Actinia striata;
    Zeeanjelier=Metridium senile;
    Metridium farcimen;
    Metridium dianthus;
    Weduweroos=Sagartia troglodytes;
    Sagartia elegans;
    Sagartia ornata;
    Cylista undata;
    Cylista elegans;
    Sierlijke slibanemoon=Diadumene lineata;
    Diadumene cincta;
    Diadumene leucolena;
    Diadumene franciscana;
    Anthopleura elegantissima;
    Anthopleura xanthogrammica;
    Anthopleura sola;
    Anthopleura artemisia;
    Anthopleura ballii;
    Anthopleura thallia;
    Anthopleura krebsi;
    Anthopleura cascaia;
    Anthopleura nigrescens;
    Anthopleura midori;
    Anthopleura japonica;
    Anthopleura asiatica;
    Anemonia viridis=Anemonia sulcata;
    Anemonia melanaster;
    Anemonia manjano;
    Aiptasia mutabilis;
    Exaiptasia diaphana;
    Bunodactis verrucosa=Aulactinia verrucosa;
    Aulactinia stella;
    Urticina felina;
    Urticina eques;
    Urticina crassicornis;
    Urticina lofotensis;
    Urticina piscivora;
    Tealia felina;
    Actinostola callosa;
    Actinodendron arboreum;
    Phymanthus crucifer;
    Heteractis crispa;
    Heteractis magnifica;
    Heteractis malu;
    Heteractis aurora;
    Entacmaea quadricolor;
    Stichodactyla haddoni;
    Stichodactyla gigantea;
    Stichodactyla mertensii;
    Macrodactyla doreensis;
    Bunodosoma cavernatum;
    Bunodosoma granuliferum;
    Bunodosoma californicum;
    Bunodosoma grande;
    Bunodosoma capense
  `, [17], 85);

  // ============================================================
  // ZEEWORMEN - ZANDWORMEN
  // ============================================================

  getijdendieren(`
    Wadpier=Arenicola marina;
    Arenicola defodiens;
    Arenicola cristata;
    Arenicola brasiliensis;
    Arenicola loveni;
    Abarenicola pacifica;
    Abarenicola claparedi;
    Abarenicola affinis;
    Abarenicola pusilla;
    Abarenicola assimilis;
    Abarenicola vagabunda;
    Zandzager=Alitta virens=Nereis virens;
    Gewone zager=Hediste diversicolor=Nereis diversicolor;
    Alitta succinea=Nereis succinea;
    Alitta grandis;
    Nereis pelagica;
    Nereis zonata;
    Nereis falsa;
    Nereis vexillosa;
    Nereis grubei;
    Nereis eugeniae;
    Nereis oligohalina;
    Neanthes arenaceodentata;
    Neanthes acuminata;
    Neanthes fucata;
    Neanthes vaalii;
    Neanthes kerguelensis;
    Neanthes glandicincta;
    Perinereis cultrifera;
    Perinereis nuntia;
    Perinereis aibuhitensis;
    Perinereis linea;
    Perinereis helleri;
    Perinereis vallata;
    Perinereis floridana;
    Perinereis anderssoni;
    Perinereis ponteni;
    Perinereis camiguinoides;
    Perinereis brevicirris;
    Perinereis macropus;
    Platynereis dumerilii;
    Platynereis bicanaliculata;
    Platynereis australis;
    Platynereis massiliensis;
    Ceratonereis mirabilis;
    Ceratonereis costae;
    Pseudonereis variegata;
    Pseudonereis anomala;
    Pseudonereis gallapagensis;
    Pseudonereis palpata
  `, [32], 85);

  // ============================================================
  // BLOEDWORMEN EN BORSTELWORMEN
  // ============================================================

  getijdendieren(`
    Glycera alba;
    Glycera dibranchiata;
    Glycera tridactyla;
    Glycera tesselata;
    Glycera americana;
    Glycera lapidum;
    Glycera oxycephala;
    Glycera capitata;
    Glycera unicornis;
    Glycera fallax;
    Glycera nicobarica;
    Goniada maculata;
    Goniada norvegica;
    Goniada emerita;
    Nephtys hombergii;
    Nephtys caeca;
    Nephtys cirrosa;
    Nephtys longosetosa;
    Nephtys incisa;
    Nephtys ciliata;
    Nephtys paradoxa;
    Nephtys picta;
    Nephtys californiensis;
    Nephtys australiensis;
    Nephtys magellanica;
    Aglaophamus agilis;
    Aglaophamus malmgreni;
    Aglaophamus dibranchis;
    Aglaophamus neotenus;
    Eulalia viridis;
    Eulalia clavigera;
    Eulalia ornata;
    Eteone longa;
    Eteone flava;
    Eteone foliosa;
    Phyllodoce mucosa;
    Phyllodoce maculata;
    Phyllodoce groenlandica;
    Phyllodoce laminosa;
    Phyllodoce lineata;
    Phyllodoce rosea;
    Phyllodoce medipapillata;
    Anaitides mucosa;
    Anaitides maculata;
    Pseudopolydora antennata;
    Pseudopolydora paucibranchiata;
    Polydora ciliata;
    Polydora cornuta;
    Polydora websteri;
    Polydora hoplura;
    Polydora haswelli;
    Polydora latispinosa;
    Polydora nuchalis;
    Boccardia proboscidea;
    Boccardia polybranchia;
    Boccardia chilensis;
    Boccardia semibranchiata;
    Spio filicornis;
    Spio martinensis;
    Spio decoratus;
    Spio armata;
    Scolelepis squamata;
    Scolelepis foliosa;
    Scolelepis bonnieri;
    Scolelepis texana;
    Scolelepis goodbodyi;
    Scolelepis chilensis;
    Pygospio elegans;
    Streblospio benedicti;
    Streblospio shrubsolii;
    Marenzelleria viridis;
    Marenzelleria neglecta;
    Marenzelleria arctia
  `, [], 90);

  // ============================================================
  // KOKERWORMEN
  // ============================================================

  getijdendieren(`
    Schelpkokerworm=Lanice conchilega;
    Zandkokerworm=Sabellaria alveolata;
    Sabellaria spinulosa;
    Sabellaria vulgaris;
    Sabellaria cementarium;
    Phragmatopoma californica;
    Phragmatopoma caudata;
    Phragmatopoma lapidosa;
    Phragmatopoma virgini;
    Sabella spallanzanii;
    Sabella pavonina;
    Sabella discifera;
    Bispira volutacornis;
    Bispira fabricii;
    Bispira brunnea;
    Bispira variegata;
    Branchiomma luctuosum;
    Branchiomma bairdi;
    Branchiomma boholense;
    Branchiomma nigromaculatum;
    Myxicola infundibulum;
    Myxicola aesthetica;
    Serpula vermicularis;
    Serpula columbiana;
    Serpula jukesii;
    Spirobranchus triqueter=Pomatoceros triqueter;
    Spirobranchus lamarcki=Pomatoceros lamarckii;
    Spirobranchus giganteus;
    Spirobranchus corniculatus;
    Spirobranchus kraussii;
    Spirobranchus cariniferus;
    Hydroides elegans;
    Hydroides norvegica;
    Hydroides dianthus;
    Hydroides ezoensis;
    Hydroides dirampha;
    Hydroides sanctaecrucis;
    Hydroides operculata;
    Hydroides uncinata;
    Ficopomatus enigmaticus;
    Spirorbis spirorbis;
    Spirorbis corallinae;
    Spirorbis rupestris;
    Spirorbis marioni;
    Janua pagenstecheri;
    Pileolaria militaris;
    Pileolaria berkeleyana;
    Pectinaria koreni=Lagis koreni;
    Pectinaria auricoma;
    Pectinaria gouldii;
    Pectinaria granulata;
    Cistenides hyperborea;
    Amphitrite cirrata;
    Amphitrite johnstoni;
    Amphitrite ornata;
    Terebella lapidaria;
    Terebella pappus;
    Terebella rubra;
    Thelepus cincinnatus;
    Thelepus setosus;
    Thelepus crispus
  `, [], 90);

  // ============================================================
  // SCHAALWORMEN EN ZEEMUIZEN
  // ============================================================

  getijdendieren(`
    Zeemuis=Aphrodita aculeata;
    Aphrodita australis;
    Aphrodita negligens;
    Aphrodita japonica;
    Laetmonice filicornis;
    Harmothoe imbricata;
    Harmothoe extenuata;
    Harmothoe impar;
    Harmothoe glabra;
    Harmothoe spinifera;
    Harmothoe fragilis;
    Harmothoe antilopes;
    Harmothoe longisetis;
    Harmothoe fuligineum;
    Harmothoe hirsuta;
    Lepidonotus clava;
    Lepidonotus squamatus;
    Lepidonotus carinulatus;
    Lepidonotus sublevis;
    Lepidonotus tenuisetosus;
    Lepidonotus caelorus;
    Lepidonotus natalensis;
    Lepidonotus glaucus;
    Polynoë scolopendrina;
    Lepidasthenia elegans;
    Halosydna brevisetosa;
    Halosydna johnsoni;
    Halosydna latior;
    Halosydnella australis;
    Polynoe scolopendrina
  `, [], 90);

  // ============================================================
  // SNOERWORMEN
  // ============================================================

  getijdendieren(`
    Lineus longissimus;
    Lineus ruber;
    Lineus viridis;
    Lineus sanguineus;
    Lineus lacteus;
    Lineus bilineatus;
    Lineus acutifrons;
    Lineus geniculatus;
    Lineus torquatus;
    Tubulanus annulatus;
    Tubulanus polymorphus;
    Tubulanus superbus;
    Tubulanus punctatus;
    Tubulanus sexlineatus;
    Tubulanus lutescens;
    Cerebratulus lacteus;
    Cerebratulus marginatus;
    Cerebratulus fuscus;
    Cerebratulus californiensis;
    Cerebratulus lineolatus;
    Notospermus geniculatus;
    Micrura fasciolata;
    Micrura purpurea;
    Micrura aurantiaca;
    Micrura verrilli;
    Cephalothrix linearis;
    Cephalothrix rufifrons;
    Cephalothrix simula;
    Cephalothrix spiralis;
    Amphiporus lactifloreus;
    Amphiporus imparispinosus;
    Tetrastemma candidum;
    Tetrastemma flavidum;
    Tetrastemma vermiculus;
    Tetrastemma melanocephalum;
    Oerstedia dorsalis;
    Emplectonema gracile;
    Emplectonema neesii;
    Paranemertes peregrina;
    Carcinonemertes carcinophila
  `, [], 90);

  // ============================================================
  // PINDAWORMEN EN LEPELWORMEN
  // ============================================================

  getijdendieren(`
    Sipunculus nudus;
    Sipunculus phalloides;
    Sipunculus robustus;
    Siphonosoma cumanense;
    Siphonosoma vastum;
    Siphonosoma australe;
    Golfingia vulgaris;
    Golfingia elongata;
    Golfingia margaritacea;
    Golfingia minuta;
    Nephasoma diaphanes;
    Nephasoma pellucidum;
    Phascolosoma granulatum;
    Phascolosoma agassizii;
    Phascolosoma arcuatum;
    Phascolosoma nigrescens;
    Phascolosoma perlucens;
    Phascolosoma scolops;
    Phascolosoma stephensoni;
    Aspidosiphon muelleri;
    Aspidosiphon elegans;
    Aspidosiphon misakiensis;
    Aspidosiphon parvulus;
    Phascolion strombus;
    Echiurus echiurus;
    Urechis caupo;
    Urechis unicinctus;
    Urechis chilensis;
    Urechis novaezealandiae;
    Thalassema thalassemum;
    Ochetostoma erythrogrammon;
    Ochetostoma octomyotum;
    Ikedosoma gogoshimense;
    Bonellia viridis
  `, [32], 90);

  // ============================================================
  // DEGENKRABBEN
  // ============================================================

  stranddieren(`
    Atlantische degenkrab=Limulus polyphemus;
    Tachypleus tridentatus;
    Tachypleus gigas;
    Carcinoscorpius rotundicauda
  `, [1,7,11,33], 65);

  // ============================================================
  // ZAKPIJPEN
  // ============================================================

  getijdendieren(`
    Ciona intestinalis;
    Ciona robusta;
    Ciona savignyi;
    Ascidiella aspersa;
    Ascidiella scabra;
    Ascidia mentula;
    Ascidia virginea;
    Ascidia conchilega;
    Ascidia interrupta;
    Ascidia callosa;
    Ascidia ceratodes;
    Phallusia mammillata;
    Phallusia nigra;
    Phallusia fumigata;
    Phallusia arabica;
    Styela clava;
    Styela plicata;
    Styela coriacea;
    Styela montereyensis;
    Styela canopus;
    Styela rustica;
    Pyura chilensis;
    Pyura stolonifera;
    Pyura praeputialis;
    Pyura herdmani;
    Pyura vittata;
    Pyura spinifera;
    Herdmania momus;
    Herdmania pallida;
    Molgula manhattensis;
    Molgula socialis;
    Molgula citrina;
    Molgula complanata;
    Molgula occidentalis;
    Botryllus schlosseri;
    Botrylloides violaceus;
    Botrylloides leachii;
    Botrylloides diegensis;
    Botrylloides niger;
    Didemnum vexillum;
    Didemnum maculosum;
    Didemnum candidum;
    Didemnum perlucidum;
    Didemnum molle;
    Diplosoma listerianum;
    Diplosoma spongiforme;
    Diplosoma virens;
    Lissoclinum patella;
    Lissoclinum fragile;
    Aplidium punctum;
    Aplidium proliferum;
    Aplidium elegans;
    Aplidium californicum;
    Aplidium glabrum;
    Polyclinum aurantium;
    Distaplia bermudensis;
    Distaplia occidentalis;
    Clavelina lepadiformis;
    Clavelina oblonga;
    Clavelina picta;
    Clavelina moluccensis
  `, [], 90);

  // ============================================================
  // ZEESPONZEN VAN GETIJDENGEBIEDEN
  // ============================================================

  getijdendieren(`
    Broodspons=Halichondria panicea;
    Halichondria bowerbanki;
    Halichondria melanadocia;
    Halichondria japonica;
    Halichondria okadai;
    Hymeniacidon perlevis;
    Hymeniacidon sinapium;
    Hymeniacidon heliophila;
    Hymeniacidon sanguinea;
    Haliclona oculata;
    Haliclona cinerea;
    Haliclona simulans;
    Haliclona rosea;
    Haliclona viscosa;
    Haliclona indistincta;
    Haliclona urceolus;
    Haliclona tubifera;
    Haliclona caerulea;
    Haliclona implexiformis;
    Haliclona permollis;
    Haliclona xena;
    Suberites ficus;
    Suberites domuncula;
    Suberites carnosus;
    Suberites massa;
    Suberites pagurorum;
    Tethya aurantium;
    Tethya citrina;
    Tethya californiana;
    Tethya actinia;
    Tethya bergquistae;
    Tethya burtoni;
    Cliona celata;
    Cliona viridis;
    Cliona vastifica;
    Cliona lobata;
    Cliona delitrix;
    Cliona orientalis;
    Cliona varians;
    Cliona caribbaea;
    Cliona aprica;
    Cliona tenuis;
    Cliona lampa;
    Cliona chilensis;
    Leucosolenia botryoides;
    Leucosolenia complicata;
    Leucosolenia variabilis;
    Leucosolenia somesii;
    Sycon ciliatum;
    Sycon raphanus;
    Sycon elegans;
    Sycon coronatum;
    Sycon capricorn;
    Grantia compressa;
    Grantia ciliata;
    Leucandra aspera;
    Leucandra nivea;
    Leucandra fistulosa;
    Clathrina clathrus;
    Clathrina coriacea;
    Clathrina cribrata;
    Clathrina cerebrum;
    Leucetta chagosensis;
    Leucetta microraphis;
    Dysidea fragilis;
    Dysidea avara;
    Dysidea etheria;
    Dysidea herbacea;
    Ircinia fasciculata;
    Ircinia variabilis;
    Ircinia felix;
    Ircinia strobilina;
    Ircinia campana;
    Spongia officinalis;
    Spongia lamella;
    Spongia barbara;
    Spongia graminea;
    Hippospongia communis;
    Hippospongia lachne;
    Callyspongia vaginalis;
    Callyspongia plicifera;
    Callyspongia fallax;
    Callyspongia aculeata;
    Aplysina aerophoba;
    Aplysina fistularis;
    Aplysina cauliformis;
    Aplysina fulva;
    Chondrilla nucula;
    Chondrilla caribensis;
    Chondrilla australiensis
  `, [], 90);

  // ============================================================
  // MOSDIERTJES VAN DE KUST
  // ============================================================

  getijdendieren(`
    Electra pilosa;
    Electra crustulenta;
    Electra monostachys;
    Electra posidoniae;
    Membranipora membranacea;
    Membranipora tuberculata;
    Membranipora serrilamella;
    Conopeum reticulum;
    Conopeum seurati;
    Conopeum chesapeakensis;
    Bugula neritina;
    Bugula stolonifera;
    Bugula simplex;
    Bugula fulva;
    Bugulina flabellata;
    Bugulina turbinata;
    Bugulina avicularia;
    Crisularia plumosa;
    Tricellaria inopinata;
    Tricellaria occidentalis;
    Scrupocellaria scruposa;
    Scrupocellaria reptans;
    Scrupocellaria bertholetti;
    Amathia verticillata;
    Amathia lendigera;
    Amathia imbricata;
    Amathia semiconvoluta;
    Amathia vidovici;
    Amathia distans;
    Bowerbankia gracilis;
    Bowerbankia imbricata;
    Alcyonidium gelatinosum;
    Alcyonidium diaphanum;
    Alcyonidium hirsutum;
    Alcyonidium polyoum;
    Alcyonidium mytili;
    Alcyonidium parasiticum;
    Flustrellidra hispida;
    Flustra foliacea;
    Chartella papyracea;
    Celleporella hyalina;
    Schizoporella unicornis;
    Schizoporella japonica;
    Schizoporella errata;
    Watersipora subatra;
    Watersipora cucullata;
    Watersipora arcuata;
    Watersipora subtorquata;
    Cryptosula pallasiana;
    Escharoides coccinea;
    Microporella ciliata;
    Microporella orientalis;
    Fenestrulina malusii;
    Fenestrulina delicia;
    Hippothoa divaricata;
    Crisia eburnea;
    Crisia denticulata;
    Crisia aculeata;
    Crisia ramosa
  `, [], 90);

  // ============================================================
  // HYDROÏDPOLIEPEN VAN DE KUST
  // ============================================================

  getijdendieren(`
    Zeecypres=Sertularia cupressina;
    Sertularia argentea;
    Sertularia perpusilla;
    Sertularia distans;
    Dynamena pumila;
    Dynamena disticha;
    Dynamena quadridentata;
    Obelia geniculata;
    Obelia dichotoma;
    Obelia longissima;
    Obelia bidentata;
    Clytia hemisphaerica;
    Clytia gracilis;
    Clytia linearis;
    Clytia noliformis;
    Clytia paulensis;
    Laomedea flexuosa;
    Laomedea angulata;
    Laomedea calceolifera;
    Gonothyraea loveni;
    Campanularia hincksii;
    Campanularia volubilis;
    Campanularia johnstoni;
    Kirchenpaueria pinnata;
    Plumularia setacea;
    Plumularia strictocarpa;
    Plumularia floridana;
    Nemertesia antennina;
    Nemertesia ramosa;
    Halecium halecinum;
    Halecium beanii;
    Halecium muricatum;
    Halecium delicatulum;
    Halecium tenellum;
    Hydrallmania falcata;
    Tubularia indivisa;
    Ectopleura larynx;
    Ectopleura crocea;
    Ectopleura dumortierii;
    Coryne pusilla;
    Coryne muscoides;
    Coryne eximia;
    Clava multicornis;
    Hydractinia echinata;
    Hydractinia symbiolongicarpus;
    Hydractinia polyclina;
    Hydractinia carnea;
    Podocoryna carnea;
    Garveia franciscana;
    Cordylophora caspia
  `, [], 90);

  // ============================================================
  // KUSTVISSEN - GRONDELS
  // ============================================================

  // Deze vissen worden aangetroffen in ondiepe
  // kustwateren, branding en getijdenpoelen.

  getijdendieren(`
    Zwarte grondel=Gobius niger;
    Rotsgrondel=Gobius paganellus;
    Gobius cobitis;
    Gobius bucchichi;
    Gobius incognitus;
    Gobius cruentatus;
    Gobius auratus;
    Gobius fallax;
    Gobius geniporus;
    Gobius gasteveni;
    Gobius xanthocephalus;
    Zandgrondel=Pomatoschistus minutus;
    Brakwatergrondel=Pomatoschistus microps;
    Dikkopje=Pomatoschistus pictus;
    Lozano's grondel=Pomatoschistus lozanoi;
    Pomatoschistus norvegicus;
    Pomatoschistus marmoratus;
    Pomatoschistus tortonesei;
    Pomatoschistus knerii;
    Pomatoschistus bathi;
    Knipowitschia caucasica;
    Knipowitschia panizzae;
    Bathygobius soporator;
    Bathygobius fuscus;
    Bathygobius cocosensis;
    Bathygobius krefftii;
    Bathygobius coalitus;
    Bathygobius curacao;
    Bathygobius mystacium;
    Bathygobius ramosus;
    Bathygobius cyclopterus;
    Bathygobius cotticeps;
    Bathygobius laddi;
    Bathygobius hongkongensis;
    Acanthogobius flavimanus;
    Acanthogobius hasta;
    Acanthogobius lactipes;
    Favonigobius lateralis;
    Favonigobius gymnauchen;
    Favonigobius reichei;
    Favonigobius melanobranchus;
    Gillichthys mirabilis;
    Gillichthys seta;
    Clevelandia ios;
    Ilypnus gilberti;
    Quietula y-cauda;
    Quietula guaymasiae
  `, [7,14,18], 80);

  // ============================================================
  // SLIJKSPRINGERS
  // ============================================================

  stranddieren(`
    Periophthalmus barbarus;
    Periophthalmus argentilineatus;
    Periophthalmus kalolo;
    Periophthalmus modestus;
    Periophthalmus novemradiatus;
    Periophthalmus variabilis;
    Periophthalmus chrysospilos;
    Periophthalmus gracilis;
    Periophthalmus magnuspinnatus;
    Periophthalmus malaccensis;
    Periophthalmus minutus;
    Periophthalmus novaeguineaensis;
    Periophthalmus walailakae;
    Periophthalmodon schlosseri;
    Periophthalmodon septemradiatus;
    Periophthalmodon freycineti;
    Boleophthalmus boddarti;
    Boleophthalmus pectinirostris;
    Boleophthalmus dussumieri;
    Boleophthalmus birdsongi;
    Scartelaos histophorus;
    Scartelaos viridis;
    Scartelaos gigas;
    Scartelaos tenuis;
    Zappa confluentus
  `, [1,7,14,18], 80);

  // ============================================================
  // SLIJMVISSEN
  // ============================================================

  getijdendieren(`
    Gewone slijmvis=Lipophrys pholis;
    Lipophrys trigloides;
    Lipophrys canevae;
    Parablennius gattorugine;
    Parablennius pilicornis;
    Parablennius sanguinolentus;
    Parablennius parvicornis;
    Parablennius rouxi;
    Parablennius tentacularis;
    Parablennius zvonimiri;
    Parablennius incognitus;
    Parablennius intermedius;
    Parablennius tasmanianus;
    Parablennius laticlavius;
    Parablennius marmoreus;
    Parablennius salensis;
    Coryphoblennius galerita;
    Aidablennius sphynx;
    Salaria pavo;
    Scartella cristata;
    Scartichthys viridis;
    Scartichthys gigas;
    Scartichthys variolatus;
    Istiblennius edentulus;
    Istiblennius lineatus;
    Istiblennius dussumieri;
    Istiblennius meleagris;
    Istiblennius pox;
    Istiblennius spilotus;
    Entomacrodus striatus;
    Entomacrodus decussatus;
    Entomacrodus marmoratus;
    Entomacrodus niuafoouensis;
    Entomacrodus stellifer;
    Entomacrodus thalassinus;
    Alticus arnoldorum;
    Alticus saliens;
    Alticus kirkii;
    Alticus monochrus;
    Praealticus labrovittatus;
    Praealticus striatus;
    Praealticus margaritarius;
    Praealticus bilineatus;
    Blenniella chrysospilos;
    Blenniella periophthalmus;
    Blenniella gibbifrons;
    Blenniella cyanostigma;
    Blenniella interrupta;
    Cirripectes castaneus;
    Cirripectes stigmaticus;
    Cirripectes variolosus;
    Cirripectes quagga;
    Cirripectes vanderbilti;
    Ophioblennius atlanticus;
    Ophioblennius macclurei;
    Ophioblennius steindachneri;
    Hypleurochilus geminatus;
    Hypleurochilus fissicornis;
    Hypsoblennius hentz;
    Hypsoblennius gilberti;
    Hypsoblennius jenkinsi;
    Hypsoblennius gentilis;
    Chasmodes bosquianus;
    Chasmodes saburrae;
    Chasmodes longimaxilla
  `, [7,14,18], 85);

  // ============================================================
  // OVERIGE VISSEN VAN GETIJDENPOELEN
  // ============================================================

  getijdendieren(`
    Botervis=Pholis gunnellus;
    Pholis laeta;
    Pholis ornata;
    Pholis picta;
    Pholis crassispina;
    Palingpuit=Zoarces viviparus;
    Zoarces americanus;
    Myoxocephalus scorpius;
    Myoxocephalus aenaeus;
    Myoxocephalus octodecemspinosus;
    Myoxocephalus stelleri;
    Myoxocephalus brandtii;
    Taurulus bubalis;
    Gymnocanthus tricuspis;
    Hemilepidotus hemilepidotus;
    Hemilepidotus spinosus;
    Oligocottus maculosus;
    Oligocottus snyderi;
    Oligocottus rimensis;
    Clinocottus analis;
    Clinocottus acuticeps;
    Clinocottus embryum;
    Clinocottus globiceps;
    Artedius lateralis;
    Artedius fenestralis;
    Artedius harringtoni;
    Artedius corallinus;
    Leptocottus armatus;
    Enophrys bison;
    Gobiesox maeandricus;
    Gobiesox strumosus;
    Gobiesox punctulatus;
    Gobiesox marmoratus;
    Lepadogaster lepadogaster;
    Lepadogaster purpurea;
    Lepadogaster candolii;
    Diplecogaster bimaculata;
    Diplecogaster pectoralis;
    Apletodon dentatus;
    Apletodon incognitus;
    Apletodon microcephalus;
    Lepadichthys frenatus;
    Lepadichthys lineatus;
    Trachelochismus pinnulatus;
    Trachelochismus melobesia;
    Tripterygion delaisi;
    Tripterygion tripteronotum;
    Tripterygion melanurus;
    Tripterygion tartessicum;
    Forsterygion lapillum;
    Forsterygion varium;
    Forsterygion nigripenne;
    Forsterygion malcolmi;
    Grahamina capito;
    Grahamina nigripenne;
    Helcogramma striata;
    Helcogramma fuscopinna;
    Helcogramma obtusirostre;
    Helcogramma hudsoni
  `, [14,18], 85);

  // ============================================================
  // PLATVISSEN EN VISSEN VAN DE BRANDING
  // ============================================================

  getijdendieren(`
    Schol=Pleuronectes platessa;
    Bot=Platichthys flesus;
    Tong=Solea solea;
    Schar=Limanda limanda;
    Griet=Scophthalmus rhombus;
    Tarbot=Scophthalmus maximus;
    Kleine pieterman=Echiichthys vipera;
    Grote pieterman=Trachinus draco;
    Ammodytes tobianus=Kleine zandspiering;
    Ammodytes marinus;
    Hyperoplus lanceolatus;
    Hyperoplus immaculatus;
    Ammodytes americanus;
    Ammodytes hexapterus;
    Ammodytes personatus;
    Hypoptychus dybowskii;
    Platichthys stellatus;
    Paralichthys dentatus;
    Paralichthys lethostigma;
    Paralichthys albigutta;
    Paralichthys californicus;
    Paralichthys olivaceus;
    Paralichthys orbignyanus;
    Pseudopleuronectes americanus;
    Pseudopleuronectes yokohamae;
    Pseudopleuronectes herzensteini;
    Pseudorhombus arsius;
    Pseudorhombus elevatus;
    Pseudorhombus jenynsii;
    Bothus lunatus;
    Bothus mancus;
    Bothus podas;
    Bothus ocellatus;
    Pegusa lascaris;
    Pegusa impar;
    Pegusa nasuta;
    Synaptura lusitanica;
    Heteromycteris capensis;
    Microchirus variegatus;
    Buglossidium luteum;
    Achirus lineatus;
    Trinectes maculatus;
    Trinectes inscriptus
  `, [7,14,18], 70);

  koppel(`
    Kleine pieterman;
    Grote pieterman
  `, [45], 60);

  // ============================================================
  // VISSEN VAN KUST EN BRANDING
  // ============================================================

  getijdendieren(`
    Zeebaars=Dicentrarchus labrax;
    Gevlekte zeebaars=Dicentrarchus punctatus;
    Diklipharder=Chelon labrosus;
    Dunlipharder=Chelon ramada;
    Goudharder=Chelon auratus;
    Mugil cephalus;
    Chelon saliens;
    Chelon haematocheilus;
    Chelon richardsonii;
    Atherina presbyter;
    Atherina boyeri;
    Atherina hepsetus;
    Atherinops affinis;
    Atherinopsis californiensis;
    Leuresthes tenuis;
    Leuresthes sardina;
    Menidia menidia;
    Menidia peninsulae;
    Hypoatherina valenciennei;
    Hypoatherina temminckii;
    Sillago sihama;
    Sillago maculata;
    Sillago ciliata;
    Sillago schomburgkii;
    Sillaginodes punctatus;
    Trachinotus ovatus;
    Trachinotus carolinus;
    Trachinotus falcatus;
    Trachinotus blochii;
    Trachinotus botla;
    Trachinotus africanus;
    Trachinotus marginatus;
    Trachinotus goodei;
    Menticirrhus americanus;
    Menticirrhus littoralis;
    Menticirrhus saxatilis;
    Menticirrhus undulatus;
    Umbrina cirrosa;
    Umbrina canosai;
    Umbrina coroides;
    Umbrina roncador;
    Genyonemus lineatus;
    Seriphus politus;
    Cymatogaster aggregata;
    Amphistichus argenteus;
    Amphistichus koelzi;
    Amphistichus rhodoterus;
    Hyperprosopon argenteum;
    Hyperprosopon ellipticum;
    Hyperprosopon anale;
    Embiotoca jacksoni;
    Embiotoca lateralis
  `, [14,18], 80);

  // ============================================================
  // STRANDINSECTEN
  // ============================================================

  stranddieren(`
    Cicindela maritima;
    Cicindela hybrida;
    Cicindela repanda;
    Cicindela hirticollis;
    Cicindela tranquebarica;
    Cicindela oregona;
    Cicindela duodecimguttata;
    Cicindela punctulata;
    Cicindela dorsalis;
    Habroscelimorpha dorsalis;
    Habroscelimorpha severa;
    Habroscelimorpha californica;
    Habroscelimorpha circumpicta;
    Habroscelimorpha fulgoris;
    Cylindera trisignata;
    Cylindera germanica;
    Lophyra flexuosa;
    Lophyra catena;
    Lophyra neglecta;
    Calomera littoralis;
    Calomera fischeri;
    Calomera lunulata;
    Calomera angulata;
    Bembidion pallidipenne;
    Bembidion argenteolum;
    Bembidion aeneum;
    Bembidion normannum;
    Bembidion minimum;
    Bembidion maritimum;
    Bembidion bipunctatum;
    Bembidion laterale;
    Bembidion ephippium;
    Dicheirotrichus gustavii;
    Dicheirotrichus obsoletus;
    Pogonus chalceus;
    Pogonus luridipennis;
    Pogonus littoralis;
    Pogonus iridipennis;
    Pogonistes gracilis;
    Cillenus lateralis;
    Aepus marinus;
    Aepopsis robinii;
    Aepus robinii;
    Cafius xantholoma;
    Cafius sericeus;
    Cafius seminitens;
    Cafius nauticus;
    Cafius canescens;
    Cafius corallicola;
    Cafius rufescens;
    Cafius histrio;
    Cafius vestitus;
    Remus sericeus;
    Phytosus balticus;
    Phytosus spinifer;
    Diglotta mersa;
    Diglotta submarina;
    Bledius spectabilis;
    Bledius arenarius;
    Bledius tricornis;
    Bledius furcatus;
    Bledius unicornis;
    Bledius opacus;
    Bledius fergussoni;
    Heterocerus fenestratus;
    Heterocerus flexuosus;
    Heterocerus fossor;
    Heterocerus maritimus;
    Heterocerus obsoletus;
    Aegialia arenaria;
    Aegialia rufa;
    Aegialia sabuleti;
    Aegialia crassa;
    Aegialia maritima;
    Phaleria cadaverina;
    Phaleria bimaculata;
    Phaleria testacea;
    Phaleria provincialis;
    Phaleria acuminata;
    Phaleria picta;
    Phaleria longula;
    Phaleria debilis;
    Phaleria rotundata;
    Phaleria maculata;
    Trachyscelis aphodioides;
    Ammobius rufus;
    Erodius siculus;
    Erodius tibialis;
    Erodius orientalis
  `, [7,10], 85);

  // ============================================================
  // STRANDVLIEGEN EN ZEEWIERVLIEGEN
  // ============================================================

  stranddieren(`
    Coelopa frigida;
    Coelopa pilipes;
    Coelopa nebularum;
    Coelopa vanduzeei;
    Coelopa ursina;
    Coelopa africana;
    Coelopa curvipes;
    Chaetocoelopa sydneyensis;
    Malacomyia sciomyzina;
    Fucellia maritima;
    Fucellia tergina;
    Fucellia griseola;
    Fucellia pictipennis;
    Fucellia fucorum;
    Fucellia ariciiformis;
    Orygma luctuosum;
    Thoracochaeta zosterae;
    Thoracochaeta brachystoma;
    Thoracochaeta zosterae;
    Thoracochaeta johnsoni;
    Thinophilus flavipalpis;
    Thinophilus ruficornis;
    Thinophilus longicilia;
    Thinophilus indigenus;
    Thinophilus spinipes;
    Hydrophorus praecox;
    Hydrophorus balticus;
    Hydrophorus oceanus;
    Scatella stagnalis;
    Scatella maritima;
    Scatella subguttata;
    Scatella paludum;
    Scatella obsoleta;
    Scatella lutosa;
    Ephydra riparia;
    Ephydra macellaria;
    Ephydra hians;
    Ephydra gracilis;
    Hecamede albicans;
    Hecamede costata;
    Hecamede maritima;
    Canace nasica;
    Canace actites;
    Canace salonitana;
    Tethina illota;
    Tethina grisea;
    Tethina albosetulosa;
    Tethina flavigenis;
    Tethina pallipes;
    Tethina intermedia;
    Tethina grossipes;
    Tethina strobliana
  `, [2,7,10], 85);

  // ============================================================
  // STRANDSPRINGSTAARTEN
  // ============================================================

  stranddieren(`
    Anurida maritima;
    Anurida bisetosa;
    Anurida granaria;
    Archisotoma besselsi;
    Archisotoma pulchella;
    Archisotoma brucei;
    Archisotoma interstitialis;
    Archisotoma theae;
    Cryptopygus antarcticus;
    Cryptopygus terranovus;
    Cryptopygus sverdrupi;
    Isotoma viridis;
    Isotoma anglicana;
    Isotoma riparia;
    Isotoma maritima;
    Hypogastrura viatica;
    Hypogastrura purpurescens;
    Hypogastrura tullbergi;
    Friesea mirabilis;
    Friesea claviseta;
    Friesea acuminata;
    Onychiurus littoralis;
    Thalassaphorura thalassophila
  `, [7,10], 90);

  // Niet iedere springstaart kan springen.
  // Vraag 34 wordt daarom niet automatisch toegekend.

  // ============================================================
  // KUSTSPINNEN
  // ============================================================

  stranddieren(`
    Desis marina;
    Desis formidabilis;
    Desis japonica;
    Desis martensi;
    Desis inermis;
    Desis kenyonae;
    Desis vorax;
    Desis bobmarleyi;
    Amaurobioides maritima;
    Amaurobioides africana;
    Amaurobioides chilensis;
    Amaurobioides litoralis;
    Amaurobioides piscator;
    Pardosa purbeckensis;
    Pardosa agricola;
    Pardosa monticola;
    Pardosa lapidicina;
    Arctosa cinerea;
    Arctosa perita;
    Arctosa fulvolineata;
    Arctosa littoralis;
    Halorates reprobus;
    Halorates distinctus;
    Erigone longipalpis;
    Erigone arctica;
    Erigone dentipalpis;
    Baryphyma duffeyi;
    Baryphyma maritimum
  `, [7,10,17], 85);

  // ============================================================
  // MEER ALGEMENE NEDERLANDSE STRANDANTWOORDEN
  // ============================================================

  stranddieren(`
    Krab;
    Zeehond;
    Zeeleeuw;
    Pelsrob;
    Zeeolifant;
    Meeuw;
    Stern;
    Strandloper;
    Plevier;
    Scholekster;
    Zeeschildpad;
    Pinguïn;
    Heremietkreeft;
    Spookkrab;
    Wenkrab;
    Strandvlo;
    Strandpissebed;
    Zeepok;
    Eendenmossel;
    Garnaal;
    Mossel;
    Oester;
    Kokkel;
    Strandschelp;
    Mesheft;
    Zwaardschede;
    Boormossel;
    Tapijtschelp;
    Venusschelp;
    Mantelschelp;
    Sint-jakobsschelp;
    Alikruik;
    Schaalhoren;
    Tolhoren;
    Wulk;
    Fuikhoorn;
    Tepelhoorn;
    Purperslak;
    Kegelslak;
    Kaurislak;
    Keverslak;
    Zeeslak;
    Zeenaaktslak;
    Zeeoor;
    Zeehaas;
    Octopus;
    Zeekat;
    Inktvis;
    Zeester;
    Slangster;
    Zee-egel;
    Zanddollar;
    Zeeklit;
    Zeekomkommer;
    Kwal;
    Ribkwal;
    Zeeanemoon;
    Wadpier;
    Zager;
    Borstelworm;
    Kokerworm;
    Snoerworm;
    Zeemuis;
    Pindaworm;
    Degenkrab;
    Zakpijp;
    Zeespons;
    Mosdiertje;
    Slijkspringer;
    Grondel;
    Slijmvis;
    Zandspiering;
    Platvis;
    Strandkever;
    Zeewiervlieg;
    Springstaart
  `, [], 30);

  // Algemene diernamen mogen worden geaccepteerd.
  // Dit zijn spelantwoorden, geen extra biologische soorten.

  // ============================================================
  // HERSTEL VAN BEKENDE SYNONIEMEN EN TAXONOMISCHE NAMEN
  // ============================================================

  const synoniemenStrandDeel3 = [

    ["Kokmeeuw", "Larus ridibundus"],

    ["Strandplevier", "Charadrius alexandrinus"],

    ["Amerikaanse zwaardschede", "Ensis directus"],

    ["Grote zwaardschede", "Ensis arcuatus"],

    ["Japanse oester", "Crassostrea gigas"],

    ["Nonnetje", "Macoma balthica"],

    ["Muiltje", "Crepidula fornicata"],

    ["Gevlochten fuikhoorn", "Nassarius reticulatus"],

    ["Tritia reticulata", "Nassarius reticulatus"],

    ["Tritia nitida", "Nassarius nitidus"],

    ["Tritia incrassata", "Nassarius incrassatus"],

    ["Tritia mutabilis", "Nassarius mutabilis"],

    ["Tritia neritea", "Cyclope neritea"],

    ["Tritia corniculum", "Nassarius corniculus"],

    ["Lobatus gigas", "Aliger gigas"],

    ["Mauritia mappa", "Leporicypraea mappa"],

    ["Conus ventricosus", "Conus mediterraneus"],

    ["Echinolittorina neritoides", "Melarhaphe neritoides"],

    ["Tectus niloticus", "Rochia nilotica"],

    ["Mytilus galloprovincialis", "Mediterrane mossel"],

    ["Musculista senhousia", "Arcuatula senhousia"],

    ["Anomalocardia flexuosa", "Anomalocardia brasiliana"],

    ["Leukoma staminea", "Protothaca staminea"],

    ["Patella pellucida", "Patina pellucida"],

    ["Berghia stephanieae", "Aeolidiella stephanieae"],

    ["Flabellina verrucosa", "Coryphella verrucosa"],

    ["Patiriella exigua", "Parvulastra exigua"],

    ["Ophiura ophiura", "Ophiura texturata"],

    ["Echinodiscus auritus", "Sculpsitechinus auritus"],

    ["Urticina felina", "Tealia felina"],

    ["Anemonia viridis", "Anemonia sulcata"],

    ["Sagartia elegans", "Cylista elegans"],

    ["Alitta virens", "Nereis virens"],

    ["Hediste diversicolor", "Nereis diversicolor"],

    ["Alitta succinea", "Nereis succinea"],

    ["Phyllodoce mucosa", "Anaitides mucosa"],

    ["Phyllodoce maculata", "Anaitides maculata"],

    ["Spirobranchus triqueter", "Pomatoceros triqueter"],

    ["Spirobranchus lamarcki", "Pomatoceros lamarckii"],

    ["Pectinaria koreni", "Lagis koreni"],

    ["Polynoe scolopendrina", "Polynoë scolopendrina"],

    ["Amathia imbricata", "Bowerbankia imbricata"],

    ["Ectopleura larynx", "Tubularia larynx"],

    ["Ectopleura crocea", "Tubularia crocea"],

    ["Aepopsis robinii", "Aepus robinii"],

    ["Cicindela dorsalis", "Habroscelimorpha dorsalis"],

    ["Eus pira lewisii".replace(" ", ""), "Neverita lewisii"]

  ];

  for (
    const [hoofdnaam, alternatief]
    of synoniemenStrandDeel3
  ) {

    verenigSynoniemenDeel2(
      hoofdnaam,
      alternatief
    );

  }

  // ============================================================
  // BEKENDE NEDERLANDSE KUSTDIEREN
  // ============================================================

  koppel(`
    Zilvermeeuw;
    Kleine mantelmeeuw;
    Grote mantelmeeuw;
    Kokmeeuw;
    Stormmeeuw;
    Geelpootmeeuw;
    Pontische meeuw;
    Zwartkopmeeuw;
    Dwergmeeuw;
    Drieteenmeeuw;
    Scholekster;
    Drieteenstrandloper;
    Bonte strandloper;
    Paarse strandloper;
    Kanoet;
    Kleine strandloper;
    Temmincks strandloper;
    Krombekstrandloper;
    Bontbekplevier;
    Strandplevier;
    Zilverplevier;
    Goudplevier;
    Steenloper;
    Wulp;
    Regenwulp;
    Rosse grutto;
    Tureluur;
    Groenpootruiter;
    Oeverloper;
    Visdief;
    Noordse stern;
    Dwergstern;
    Grote stern;
    Reuzenstern;
    Eider;
    Bergeend;
    Sneeuwgors;
    Strandleeuwerik;
    Oeverpieper;
    Aalscholver;
    Kluut;
    Gewone zeehond;
    Grijze zeehond;
    Strandkrab;
    Noordzeekrab;
    Gewone zwemkrab;
    Fluwelen zwemkrab;
    Blauwpootzwemkrab;
    Penseelkrab;
    Blaasjeskrab;
    Gewone heremietkreeft;
    Kleine heremietkreeft;
    Noordzeegarnaal;
    Gewone strandvlo;
    Havenpissebed;
    Ligia oceanica;
    Eurydice pulchra;
    Idotea balthica;
    Gewone zeepok;
    Balanus crenatus;
    Austrominius modestus;
    Gewone mossel;
    Japanse oester;
    Platte oester;
    Kokkel;
    Brakwaterkokkel;
    Halfgeknotte strandschelp;
    Stevige strandschelp;
    Ovale strandschelp;
    Amerikaanse zwaardschede;
    Kleine zwaardschede;
    Tafelmesheft;
    Strandgaper;
    Afgeknotte gaper;
    Zaagje;
    Witte dunschaal;
    Amerikaanse boormossel;
    Witte boormossel;
    Ruwe boormossel;
    Filipijnse tapijtschelp;
    Noordkromp;
    Paardenmossel;
    Gewone schaalhoren;
    Gewone alikruik;
    Stompe alikruik;
    Ruwe alikruik;
    Wadslakje;
    Gewone wenteltrap;
    Tepelhoorn;
    Glanzende tepelhoorn;
    Wulk;
    Gevlochten fuikhoorn;
    Purperslak;
    Muiltje;
    Gewone keverslak;
    Zeehaas;
    Zeecitroen;
    Gewone zeekat;
    Gewone zeester;
    Gewone kamster;
    Gewone slangster;
    Kleine slangster;
    Gewone zee-egel;
    Psammechinus miliaris;
    Zeeklit;
    Oorkwal;
    Blauwe haarkwal;
    Gele haarkwal;
    Kompaskwal;
    Rhizostoma octopus;
    Zeedruif;
    Amerikaanse ribkwal;
    Paardenanemoon;
    Zeeanjelier;
    Wadpier;
    Zandzager;
    Gewone zager;
    Schelpkokerworm;
    Zandkokerworm;
    Zeemuis;
    Broodspons;
    Halichondria bowerbanki;
    Botryllus schlosseri;
    Didemnum vexillum;
    Styela clava;
    Electra pilosa;
    Membranipora membranacea;
    Obelia geniculata;
    Zwarte grondel;
    Rotsgrondel;
    Zandgrondel;
    Brakwatergrondel;
    Botervis;
    Palingpuit;
    Schol;
    Bot;
    Tong;
    Schar;
    Griet;
    Tarbot;
    Kleine pieterman;
    Grote pieterman;
    Zeebaars;
    Diklipharder;
    Dunlipharder;
    Goudharder;
    Coelopa frigida;
    Coelopa pilipes;
    Fucellia maritima;
    Anurida maritima;
    Arctosa cinerea;
    Arctosa perita
  `, [26], 60);

  // ============================================================
  // AFRIKAANSE KUSTDIEREN
  // ============================================================

  koppel(`
    Zwartvoetpinguïn;
    Kaapse zeeleeuw;
    Kaapse pelsrob;
    Kaapse jan-van-gent;
    Kaapse aalscholver;
    Afrikaanse schaarbek;
    Haematopus moquini;
    Afruca tangeri;
    Ocypode ryderi;
    Ocypode cursor;
    Ocypode saratan;
    Cardisoma armatum;
    Cardisoma carnifex;
    Coenobita scaevola;
    Perna perna;
    Choromytilus meridionalis;
    Donax serra;
    Donax sordidus;
    Haliotis midae;
    Haliotis parva;
    Haliotis spadicea;
    Patella caerulea;
    Cymbula granatina;
    Cymbula oculus;
    Cymbula miniata;
    Cymbula compressa;
    Scutellastra argenvillei;
    Scutellastra cochlear;
    Scutellastra longicosta;
    Scutellastra granularis;
    Scutellastra tabularis;
    Afrolittorina africana;
    Afrolittorina knysnaensis;
    Nerita senegalensis;
    Parechinus angulosus;
    Echinometra mathaei;
    Diadema setosum;
    Linckia laevigata;
    Protoreaster lincki;
    Holothuria atra;
    Holothuria leucospilota;
    Holothuria scabra;
    Actinopyga mauritiana;
    Chrysaora fulgida;
    Chrysaora africana;
    Bunodosoma capense;
    Heteromycteris capensis;
    Chelon richardsonii;
    Trachinotus africanus;
    Tylos capensis
  `, [5], 75);

  // ============================================================
  // AUSTRALISCHE KUSTDIEREN
  // ============================================================

  koppel(`
    Australische pelikaan;
    Australische jan-van-gent;
    Australische zeeleeuw;
    Kaapse pelsrob;
    Dwergpinguïn;
    Zeekrokodil;
    Groene zeeschildpad;
    Lederschildpad;
    Platrugzeeschildpad;
    Karetschildpad;
    Onechte karetschildpad;
    Warana;
    Haematopus fuliginosus;
    Haematopus longirostris;
    Anarhynchus ruficapillus;
    Recurvirostra novaehollandiae;
    Vanellus miles;
    Thalasseus bergii;
    Sternula nereis;
    Sternula albifrons;
    Sula leucogaster;
    Ocypode ceratophthalmus;
    Ocypode cordimanus;
    Ocypode pallidula;
    Austruca mjoebergi;
    Gelasimus dampieri;
    Tubuca signata;
    Tubuca polita;
    Scylla serrata;
    Portunus armatus;
    Coenobita variabilis;
    Trypaea australiensis;
    Ligia australiensis;
    Austrominius modestus;
    Saccostrea glomerata;
    Mytilus galloprovincialis;
    Pinctada maxima;
    Donax deltoides;
    Cellana tramoserica;
    Haliotis rubra;
    Haliotis laevigata;
    Haliotis roei;
    Haliotis scalaris;
    Austrolittorina unifasciata;
    Nerita atramentosa;
    Nerita melanotragus;
    Austrocochlea constricta;
    Austrocochlea porcata;
    Acanthopleura gemmata;
    Octopus tetricus;
    Octopus maorum;
    Hapalochlaena maculosa;
    Hapalochlaena fasciata;
    Sepia apama;
    Sepia plangon;
    Sepia mestus;
    Euprymna tasmanica;
    Heliocidaris erythrogramma;
    Heliocidaris tuberculata;
    Centrostephanus rodgersii;
    Meridiastra calcar;
    Meridiastra gunnii;
    Parvulastra exigua;
    Echinometra mathaei;
    Mespilia globulus;
    Holothuria atra;
    Holothuria scabra;
    Stichopus chloronotus;
    Australostichopus mollis;
    Catostylus mosaicus;
    Actinia tenebrosa;
    Entacmaea quadricolor;
    Sillaginodes punctatus;
    Sillago ciliata;
    Sillago schomburgkii;
    Favonigobius lateralis;
    Parablennius tasmanianus;
    Enoplochiton niger
  `, [23], 75);

  // ============================================================
  // DIEREN UIT KOUDE KUSTGEBIEDEN
  // ============================================================

  koppel(`
    Keizerspinguïn;
    Adéliepinguïn;
    Kinbandpinguïn;
    Koningspinguïn;
    Ezelspinguïn;
    Macaronipinguïn;
    Schlegelpinguïn;
    Rotspinguïn;
    Ringelrob;
    Zadelrob;
    Klapmuts;
    Baardrob;
    Bandrob;
    Weddellzeehond;
    Krabbeneter;
    Zeeluipaard;
    Rosszeehond;
    Walrus;
    Antarctische pelsrob;
    Subantarctische pelsrob;
    Zuidelijke zeeolifant;
    Noordelijke pelsrob;
    Stellerzeeleeuw;
    Grote burgemeester;
    Kleine burgemeester;
    Pagophila eburnea;
    Rhodostethia rosea;
    Paarse strandloper;
    Noordse stern;
    Rissa brevirostris;
    Chlamys islandica;
    Mytilus trossulus;
    Strongylocentrotus droebachiensis;
    Strongylocentrotus pallidus;
    Crossaster papposus;
    Leptasterias polaris;
    Leptasterias groenlandica;
    Ophiura robusta;
    Ophiura sarsii;
    Cucumaria frondosa;
    Myoxocephalus scorpius;
    Echinus esculentus;
    Cryptopygus antarcticus;
    Cryptopygus terranovus
  `, [24], 70);

  // ============================================================
  // OPVALLEND GEKLEURDE STRANDDIEREN
  // ============================================================

  koppel(`
    Rode flamingo;
    Grote flamingo;
    Kleine flamingo;
    Rode ibis;
    Blauwvoetgent;
    Roodpootgent;
    Koningspinguïn;
    Macaronipinguïn;
    Schlegelpinguïn;
    Rode landkrab;
    Grapsus grapsus;
    Grapsus albolineatus;
    Calcinus elegans;
    Calcinus tibicen;
    Dardanus megistos;
    Coenobita perlatus;
    Cypraea tigris;
    Chromodoris annae;
    Chromodoris lochi;
    Chromodoris magnifica;
    Chromodoris quadricolor;
    Chromodoris willani;
    Goniobranchus kuniei;
    Goniobranchus splendidus;
    Goniobranchus reticulatus;
    Hypselodoris apolegma;
    Hypselodoris bullockii;
    Hypselodoris infucata;
    Hypselodoris kanga;
    Hypselodoris tryoni;
    Felimare picta;
    Felimare tricolor;
    Flabellina iodinea;
    Cratena peregrina;
    Linckia laevigata;
    Echinaster sepositus;
    Protoreaster lincki;
    Patiria miniata;
    Pisaster ochraceus;
    Heterocentrotus mamillatus;
    Mespilia globulus;
    Holothuria edulis;
    Stichopus chloronotus;
    Hapalochlaena lunulata;
    Hapalochlaena maculosa;
    Hapalochlaena fasciata;
    Paardenanemoon;
    Aardbeianemoon;
    Portugees oorlogsschip;
    Velella velella
  `, [47], 65);

  // ============================================================
  // GESTREEPTE STRANDDIEREN
  // ============================================================

  koppel(`
    Zwartvoetpinguïn;
    Humboldtpinguïn;
    Magelhaenpinguïn;
    Galapagospinguïn;
    Kinbandpinguïn;
    Bandrob;
    Bontbekplevier;
    Charadrius vociferus;
    Charadrius melodus;
    Grapsus albolineatus;
    Hemigrapsus sanguineus;
    Calcinus elegans;
    Clibanarius tricolor;
    Clibanarius vittatus;
    Coenobita rugosus;
    Chromodoris lochi;
    Chromodoris willani;
    Chromodoris quadricolor;
    Chromodoris lineolata;
    Chromodoris magnifica;
    Hypselodoris nigrostriata;
    Hypselodoris whitei;
    Felimare tricolor;
    Felimare bilineata;
    Flabellina iodinea;
    Goniobranchus reticulatus;
    Nautilus pompilius;
    Echinothrix calamaris;
    Ophiocoma scolopendrina;
    Ophiothrix trilineata;
    Chrysaora colorata;
    Tubulanus annulatus;
    Lineus bilineatus;
    Micrura fasciolata
  `, [48], 70);

  // ============================================================
  // GEVLEKTE STRANDDIEREN
  // ============================================================

  koppel(`
    Gewone zeehond;
    Grijze zeehond;
    Zeeluipaard;
    Larghazeehond;
    Kelpmeeuw;
    Calidris alpina;
    Arenaria interpres;
    Hemigrapsus sanguineus;
    Portunus sanguinolentus;
    Charybdis feriata;
    Dardanus megistos;
    Cypraea tigris;
    Cypraea pantherina;
    Mauritia arabica;
    Lyncina lynx;
    Lyncina argus;
    Lyncina vitellus;
    Conus leopardus;
    Conus litteratus;
    Conus ebraeus;
    Conus chaldaeus;
    Conus arenatus;
    Nerita albicilla;
    Nerita polita;
    Jorunna funebris;
    Goniobranchus kuniei;
    Goniobranchus leopardus;
    Goniobranchus tinctorius;
    Hypselodoris maculosa;
    Hypselodoris purpureomaculosa;
    Hypselodoris tryoni;
    Goniobranchus splendidus;
    Protoreaster nodosus;
    Fromia monilis;
    Fromia milleporella;
    Linckia multifora;
    Bohadschia argus;
    Holothuria pardalis;
    Holothuria hilla;
    Phyllorhiza punctata;
    Mastigias papua;
    Actinia fragacea;
    Echinothrix calamaris;
    Bothus mancus;
    Bothus lunatus;
    Bothus ocellatus
  `, [49], 70);

  // ============================================================
  // VOEDSELDIEREN
  // ============================================================

  // Alleen dieren waarvan kweek voor menselijke
  // consumptie bekend is.

  koppel(`
    Gewone mossel;
    Mediterrane mossel;
    Japanse oester;
    Platte oester;
    Amerikaanse oester;
    Magallana sikamea;
    Magallana ariakensis;
    Magallana hongkongensis;
    Magallana bilineata;
    Saccostrea glomerata;
    Saccostrea cucullata;
    Ostrea chilensis;
    Ostrea angasi;
    Perna viridis;
    Perna perna;
    Perna canaliculus;
    Filipijnse tapijtschelp;
    Gewone tapijtschelp;
    Venerupis corrugata;
    Mercenaria mercenaria;
    Meretrix meretrix;
    Meretrix lusoria;
    Meretrix lyrata;
    Mactra chinensis;
    Spisula sachalinensis;
    Argopecten irradians;
    Argopecten purpuratus;
    Argopecten ventricosus;
    Mizuhopecten yessoensis;
    Placopecten magellanicus;
    Haliotis discus;
    Haliotis diversicolor;
    Haliotis asinina;
    Haliotis rufescens;
    Haliotis rubra;
    Haliotis laevigata;
    Haliotis midae;
    Haliotis iris;
    Scylla serrata;
    Scylla olivacea;
    Scylla paramamosain;
    Portunus trituberculatus;
    Portunus pelagicus;
    Holothuria scabra;
    Apostichopus japonicus;
    Zeebaars;
    Tong;
    Tarbot;
    Goudharder;
    Mugil cephalus;
    Paralichthys olivaceus;
    Sillago sihama;
    Trachinotus blochii;
    Trachinotus carolinus
  `, [46], 70);

  // ============================================================
  // DIEREN DIE IN GROEPEN LEVEN
  // ============================================================

  koppel(`
    Zilvermeeuw;
    Kokmeeuw;
    Stormmeeuw;
    Grote mantelmeeuw;
    Kleine mantelmeeuw;
    Drieteenmeeuw;
    Scholekster;
    Kanoet;
    Bonte strandloper;
    Drieteenstrandloper;
    Rosse grutto;
    Visdief;
    Noordse stern;
    Grote stern;
    Dwergstern;
    Eider;
    Bergeend;
    Rode flamingo;
    Grote flamingo;
    Kleine flamingo;
    Bruine pelikaan;
    Australische pelikaan;
    Jan-van-gent;
    Kaapse jan-van-gent;
    Blauwvoetgent;
    Roodpootgent;
    Bruine gent;
    Aalscholver;
    Keizerspinguïn;
    Koningspinguïn;
    Adéliepinguïn;
    Ezelspinguïn;
    Kinbandpinguïn;
    Humboldtpinguïn;
    Magelhaenpinguïn;
    Zwartvoetpinguïn;
    Galapagospinguïn;
    Dwergpinguïn;
    Macaronipinguïn;
    Gewone zeehond;
    Grijze zeehond;
    Zadelrob;
    Noordelijke zeeolifant;
    Zuidelijke zeeolifant;
    Californische zeeleeuw;
    Galapagoszeeleeuw;
    Stellerzeeleeuw;
    Australische zeeleeuw;
    Nieuw-Zeelandse zeeleeuw;
    Zuid-Amerikaanse zeeleeuw;
    Noordelijke pelsrob;
    Kaapse pelsrob;
    Antarctische pelsrob;
    Walrus;
    Zeeotter;
    Gewone mossel;
    Perna perna;
    Perna viridis;
    Perna canaliculus;
    Gewone zeepok;
    Balanus crenatus;
    Wadpier;
    Sabellaria alveolata;
    Phragmatopoma californica;
    Schelpkokerworm
  `, [40], 55);

  // ============================================================
  // KUSTVOGELS DIE NESTEN BOUWEN
  // ============================================================

  koppel(`
    Zilvermeeuw;
    Kleine mantelmeeuw;
    Grote mantelmeeuw;
    Kokmeeuw;
    Stormmeeuw;
    Geelpootmeeuw;
    Pontische meeuw;
    Zwartkopmeeuw;
    Dwergmeeuw;
    Drieteenmeeuw;
    Scholekster;
    Bontbekplevier;
    Strandplevier;
    Zilverplevier;
    Steenloper;
    Wulp;
    Regenwulp;
    Tureluur;
    Groenpootruiter;
    Oeverloper;
    Visdief;
    Noordse stern;
    Dwergstern;
    Grote stern;
    Reuzenstern;
    Eider;
    Bergeend;
    Sneeuwgors;
    Strandleeuwerik;
    Oeverpieper;
    Bruine pelikaan;
    Australische pelikaan;
    Jan-van-gent;
    Kaapse jan-van-gent;
    Australische jan-van-gent;
    Blauwvoetgent;
    Roodpootgent;
    Bruine gent;
    Maskergent;
    Aalscholver;
    Kuifaalscholver;
    Blauwe reiger;
    Grote zilverreiger;
    Kleine zilverreiger;
    Rode flamingo;
    Grote flamingo;
    Kleine flamingo;
    Adéliepinguïn;
    Ezelspinguïn;
    Kinbandpinguïn;
    Humboldtpinguïn;
    Magelhaenpinguïn;
    Zwartvoetpinguïn;
    Galapagospinguïn;
    Geeloogpinguïn;
    Macaronipinguïn;
    Rotspinguïn
  `, [41], 55);

  // Keizerspinguïns en koningspinguïns
  // houden hun ei op hun voeten.
  // Zij krijgen hier geen nestkoppeling.

  // ============================================================
  // KUSTDIEREN DIE ONDER DE GROND LEVEN
  // ============================================================

  koppel(`
    Wadpier;
    Arenicola defodiens;
    Zandzager;
    Gewone zager;
    Strandgaper;
    Afgeknotte gaper;
    Kokkel;
    Brakwaterkokkel;
    Zaagje;
    Amerikaanse zwaardschede;
    Kleine zwaardschede;
    Tafelmesheft;
    Gewone tapijtschelp;
    Filipijnse tapijtschelp;
    Zeeklit;
    Echinocardium flavescens;
    Echinocardium mediterraneum;
    Atlantische spookkrab;
    Ocypode ceratophthalmus;
    Ocypode cordimanus;
    Ocypode cursor;
    Ocypode macrocera;
    Ocypode ryderi;
    Ocypode saratan;
    Ocypode stimpsoni;
    Cardisoma guanhumi;
    Cardisoma carnifex;
    Cardisoma armatum;
    Upogebia deltaura;
    Upogebia pusilla;
    Upogebia stellata;
    Upogebia major;
    Callianassa subterranea;
    Callichirus major;
    Neotrypaea californiensis;
    Trypaea australiensis;
    Urechis caupo;
    Urechis unicinctus;
    Sipunculus nudus;
    Bledius spectabilis;
    Bledius arenarius;
    Bledius tricornis;
    Ammodytes tobianus;
    Ammodytes marinus;
    Hyperoplus lanceolatus;
    Kleine pieterman
  `, [32], 70);

  // ============================================================
  // DIEREN DIE HEEL OUD KUNNEN WORDEN
  // ============================================================

  koppel(`
    Noordkromp;
    Arctica islandica;
    Panopea generosa;
    Panopea abrupta;
    Groene zeeschildpad;
    Karetschildpad;
    Onechte karetschildpad;
    Lederschildpad;
    Walrus;
    Rode zee-egel=Mesocentrotus franciscanus;
    Mesocentrotus franciscanus;
    Strongylocentrotus franciscanus;
    Tridacna gigas
  `, [44], 80);

  // ============================================================
  // EXTRA BEKENDE KUSTSCHELPDIEREN
  // ============================================================

  zeeschelpdieren(`
    Panopea generosa;
    Panopea globosa;
    Panopea japonica;
    Panopea zelandica;
    Panopea abbreviata;
    Tridacna gigas;
    Tridacna derasa;
    Tridacna squamosina;
    Tridacna noae;
    Tridacna mbalavuana;
    Tridacna rosewateri;
    Hippopus porcellanus
  `, [], 85);

  koppel(`
    Panopea generosa;
    Panopea globosa;
    Panopea japonica;
    Panopea zelandica;
    Tridacna gigas;
    Tridacna derasa
  `, [44], 85);

  // ============================================================
  // AANGESPOELDE DIEREN
  // ============================================================

  // Bij deze dieren wordt vraag 39 gebruikt in de brede
  // betekenis: een dier dat op een strand aangetroffen
  // kan worden, ook wanneer het daar niet normaal leeft.
  //
  // We voegen uitsluitend bekende groepen en soorten
  // toe waarbij strandingen gedocumenteerd voorkomen.
  //
  // Niet alle walvisachtigen krijgen automatisch
  // de strandkoppeling.

  stranddieren(`
    Bruinvis=Phocoena phocoena;
    Tuimelaar=Tursiops truncatus;
    Gewone dolfijn=Delphinus delphis;
    Gestreepte dolfijn=Stenella coeruleoalba;
    Witsnuitdolfijn=Lagenorhynchus albirostris;
    Witflankdolfijn=Leucopleurus acutus=Lagenorhynchus acutus;
    Grijze dolfijn=Grampus griseus;
    Griend=Globicephala melas;
    Indische griend=Globicephala macrorhynchus;
    Potvis=Physeter macrocephalus;
    Dwergpotvis=Kogia breviceps;
    Kleinste potvis=Kogia sima;
    Dwergvinvis=Balaenoptera acutorostrata;
    Bultrug=Megaptera novaeangliae;
    Gewone vinvis=Balaenoptera physalus;
    Blauwe vinvis=Balaenoptera musculus;
    Noordse vinvis=Balaenoptera borealis;
    Spitssnuitdolfijn=Ziphius cavirostris;
    Butskop=Hyperoodon ampullatus;
    Orka=Orcinus orca
  `, [1,11,14,18], 50);

  // ============================================================
  // HERSTEL VAN NAAMCONFLICTEN
  // ============================================================

  // "Nonnetje" kan een eend of een schelpdier zijn.
  // De dieren mogen nooit onderling worden samengevoegd.

  const nonnetjeVogelDeel3 =
    zoekEen("Mergellus albellus");

  const nonnetjeSchelpdierDeel3 =
    zoekEen("Limecola balthica") ||
    zoekEen("Macoma balthica");

  if (nonnetjeSchelpdierDeel3) {

    voegKoppelingToe(
      nonnetjeSchelpdierDeel3,
      39,
      45
    );

    voegKoppelingToe(
      nonnetjeSchelpdierDeel3,
      26,
      45
    );

  }

  // De eend wordt niet alleen vanwege zijn naam
  // aan de strandvraag gekoppeld.

  // ============================================================
  // CORRECTIES VAN EERDERE DELEN
  // ============================================================

  // Verwijder kennelijke typefouten uit de nieuwe
  // antwoordkoppelingen wanneer de correcte naam bestaat.

  const typefoutenDeel3 = [

    [
      "Potamotrygon fschroederi",
      "Potamotrygon schroederi"
    ],

    [
      "Hemigrammus oellifer",
      "Hemigrammus ocellifer"
    ],

    [
      "Caridina harlequin",
      "Caridina woltereckae"
    ],

    [
      "Metriaclima cyneusmarginata",
      "Metriaclima cyneusmarginatus"
    ],

    [
      "Metriaclima xanstomachus",
      "Metriaclima xanthostomachus"
    ]

  ];

  // Foutieve spellingen worden niet als nieuwe soorten
  // gebruikt. Ze worden ook niet blind hernoemd.

  for (const [foutief, mogelijkCorrect] of typefoutenDeel3) {

    const record = zoekEen(foutief);

    if (!record) continue;

    if (!zoekEen(mogelijkCorrect)) continue;

    verwijderKoppeling(
      foutief,
      [37,38,39]
    );

  }

  // Correctie van een eerdere fout:
  // Clarias batrachus is een Aziatische soort.

  verwijderKoppeling(
    "Clarias batrachus",
    [5]
  );

  // Correctie:
  // Pelviene en gewone vissenschubben ontbreken bij
  // de meeste slijmvissen.

  for (const record of dieren.values()) {

    if (
      /^(Lipophrys|Parablennius|Coryphoblennius|Aidablennius|Istiblennius|Entomacrodus|Alticus|Blenniella|Cirripectes|Ophioblennius|Hypsoblennius)\s/i
      .test(record.naam)
    ) {

      if (record.vragen.has(21)) {

        verwijderKoppeling(
          record.naam,
          [21]
        );

      }

    }

  }

  // ============================================================
  // VOORZICHTIG MET ONDUIDELIJKE LEEFGEBIEDEN
  // ============================================================

  // Soorten die hoofdzakelijk dieper water,
  // mangroven of andere kusthabitats bewonen,
  // worden niet automatisch stranddieren genoemd.

  const twijfelachtigeStrandkoppelingenDeel3 = `
    Bathybagrus tetranema;
    Bathybagrus graueri;
    Neolamprologus brichardi;
    Tropheus moorii;
    Baikalrob;
    Titicacakikker;
    Axolotl;
    Acanthogammarus victorii;
    Lubomirskia baicalensis;
    Carcinonemertes carcinophila;
    Cryptopygus terranovus;
    Rhynchocinetes typus;
    Bonellia viridis;
    Actinostola callosa;
    Tectus niloticus;
    Tridacna rosewateri;
    Tridacna mbalavuana
  `;

  for (
    const onderdeel
    of twijfelachtigeStrandkoppelingenDeel3.split(";")
  ) {

    const naam = onderdeel.trim();

    if (!naam) continue;

    verwijderKoppeling(
      naam,
      [39]
    );

  }

  // ============================================================
  // CONTROLE OP UITGESTORVEN STRANDDIEREN
  // ============================================================

  koppel(`
    Reuzenalk;
    Pinguinus impennis;
    Caribische monniksrob;
    Neomonachus tropicalis;
    Japanse zeeleeuw;
    Zalophus japonicus;
    Haematopus meadewaldoi;
    Numenius borealis;
    Numenius tenuirostris
  `, [43], 85);

  for (const naam of [
    "Reuzenalk",
    "Pinguinus impennis",
    "Caribische monniksrob",
    "Neomonachus tropicalis",
    "Japanse zeeleeuw",
    "Zalophus japonicus",
    "Haematopus meadewaldoi"
  ]) {

    verwijderKoppeling(
      naam,
      [39]
    );

  }

  // ============================================================
  // EXTRA STRANDTESTS
  // ============================================================

  const extraStrandTestsDeel3 = [

    [39, "Strandkrab", true],

    [39, "Carcinus maenas", true],

    [39, "Gewone zeehond", true],

    [39, "Phoca vitulina", true],

    [39, "Grijze zeehond", true],

    [39, "Zilvermeeuw", true],

    [39, "Kokmeeuw", true],

    [39, "Larus ridibundus", true],

    [39, "Drieteenstrandloper", true],

    [39, "Scholekster", true],

    [39, "Wadpier", true],

    [39, "Arenicola marina", true],

    [39, "Kokkel", true],

    [39, "Mossel", true],

    [39, "Japanse oester", true],

    [39, "Crassostrea gigas", true],

    [39, "Magallana gigas", true],

    [39, "Amerikaanse zwaardschede", true],

    [39, "Ensis directus", true],

    [39, "Ensis leei", true],

    [39, "Gewone alikruik", true],

    [39, "Gewone schaalhoren", true],

    [39, "Gewone zeester", true],

    [39, "Asterias rubens", true],

    [39, "Zeeklit", true],

    [39, "Oorkwal", true],

    [39, "Kompaskwal", true],

    [39, "Portugees oorlogsschip", true],

    [39, "Strandvlo", true],

    [39, "Talitrus saltator", true],

    [39, "Havenpissebed", true],

    [39, "Zeepok", true],

    [39, "Gewone heremietkreeft", true],

    [39, "Groene zeeschildpad", true],

    [39, "Humboldtpinguïn", true],

    [39, "Walrus", true],

    [39, "Kokoskrab", true],

    [39, "Leeuw", false],

    [39, "Giraffe", false],

    [39, "Axolotl", false],

    [39, "Baikalrob", false],

    [39, "Titicacakikker", false],

    [39, "Neolamprologus brichardi", false],

    [39, "Tyrannosaurus rex", false],

    [2, "Keizerspinguïn", false],

    [7, "Groene zeeschildpad", true],

    [26, "Gewone zeehond", true],

    [26, "Strandkrab", true],

    [32, "Wadpier", true],

    [44, "Noordkromp", true],

    [45, "Portugees oorlogsschip", true],

    [45, "Kleine pieterman", true],

    [46, "Gewone mossel", true]

  ];

  // ============================================================
  // TUSSENTIJDSE STATISTIEKEN
  // ============================================================

  const voortgangNaDeel3 =
    voortgangWaterdieren();

  const tussentijdsRapportDeel3 = {

    versie: VERSIE,

    dierrecordsBijStart:
      beginAantalDieren,

    dierrecordsNu:
      dieren.size,

    bruikbareDierrecords:
      [...dieren.values()].filter(
        record => record.vragen.size > 0
      ).length,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    verwijderdeKoppelingen,

    conflictenBijToevoegen:
      conflictenBijToevoegen.length,

    ontbrekendeKoppelingen:
      ontbrekendeKoppelingen.length,

    rivierdieren:
      aantalAntwoorden(37),

    meerdieren:
      aantalAntwoorden(38),

    stranddieren:
      aantalAntwoorden(39)

  };

  console.group(
    "QuizBallon V9.2 - Aanvulling 2 - Deel 3"
  );

  console.table(
    tussentijdsRapportDeel3
  );

  console.table(
    voortgangNaDeel3
  );

  console.groupEnd();

  // ============================================================
  // VOORTGANG VAN ALLE 50 VRAGEN
  // ============================================================

  function volledigeVoortgangV92() {

    const resultaten = [];

    for (let nummer = 1; nummer <= 50; nummer++) {

      const aantal =
        aantalAntwoorden(nummer);

      const eerder =
        vorigeAantallen.get(nummer) || 0;

      resultaten.push({

        vraag: nummer,

        oudeAntwoorden: eerder,

        nieuweAntwoorden: aantal,

        groei: aantal - eerder,

        raketten: raketten(aantal),

        tekort:
          Math.max(0, 1000 - aantal),

        streefdoelBereikt:
          aantal >= 1000

      });

    }

    return resultaten;

  }

  const alleVragenNaDeel3 =
    volledigeVoortgangV92();

  console.group(
    "QuizBallon V9.2 - Voortgang alle vragen"
  );

  console.table(
    alleVragenNaDeel3
  );

  console.log(

    "Vragen met minimaal 1000 antwoorden:",

    alleVragenNaDeel3.filter(
      vraag => vraag.streefdoelBereikt
    ).length,

    "/ 50"

  );

  console.log(

    "Nog ontbrekende antwoordkoppelingen:",

    alleVragenNaDeel3.reduce(
      (som, vraag) => som + vraag.tekort,
      0
    )

  );

  console.groupEnd();

  // ============================================================
  // EINDE AANVULLING 2 - DEEL 3
  // HET BESTAND NOG NIET AFSLUITEN
  // DEEL 4 KOMT HIERONDER
  // ============================================================
  

  // ============================================================
  // EINDE DEEL 1
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
   // ============================================================
  // QUIZBALLON V9.2 - AANVULLING 2 - DEEL 4
  // GEOGRAFISCHE VERSPREIDING EN LEEFGEBIEDEN
  // ============================================================

  function afrikaanseDieren(tekst, extra = [], punten = 70) {
    groep(tekst, [5,50,...extra], punten);
  }

  function bosdieren(tekst, extra = [], punten = 70) {
    groep(tekst, [6,50,...extra], punten);
  }

  function jungledieren(tekst, extra = [], punten = 70) {
    groep(tekst, [6,12,50,...extra], punten);
  }

  function australischeDieren(tekst, extra = [], punten = 70) {
    groep(tekst, [23,50,...extra], punten);
  }

  function koudedieren(tekst, extra = [], punten = 70) {
    groep(tekst, [24,50,...extra], punten);
  }

  function woestijndieren(tekst, extra = [], punten = 70) {
    groep(tekst, [25,50,...extra], punten);
  }

  function nederlandseDieren(tekst, extra = [], punten = 65) {
    groep(tekst, [26,50,...extra], punten);
  }

  function boomdieren(tekst, extra = [], punten = 70) {
    groep(tekst, [31,35,50,...extra], punten);
  }

  function ondergrondseDieren(tekst, extra = [], punten = 70) {
    groep(tekst, [32,50,...extra], punten);
  }

  // ============================================================
  // AFRIKAANSE ZOOGDIEREN
  // ============================================================

  afrikaanseDieren(`
    Afrikaanse savanneolifant=Loxodonta africana;
    Afrikaanse bosolifant=Loxodonta cyclotis;
    Leeuw=Panthera leo;
    Luipaard=Panthera pardus;
    Jachtluipaard=Acinonyx jubatus;
    Caracal=Caracal caracal;
    Serval=Leptailurus serval;
    Afrikaanse goudkat=Caracal aurata;
    Zwartvoetkat=Felis nigripes;
    Afrikaanse wilde kat=Felis lybica;
    Gevlekte hyena=Crocuta crocuta;
    Gestreepte hyena=Hyaena hyaena;
    Bruine hyena=Parahyaena brunnea;
    Aardwolf=Proteles cristata;
    Afrikaanse wilde hond=Lycaon pictus;
    Zadeljakhals=Lupulella mesomelas;
    Gestreepte jakhals=Lupulella adusta;
    Ethiopische wolf=Canis simensis;
    Afrikaanse goudwolf=Canis lupaster;
    Grootoorvos=Otocyon megalotis;
    Kaapse vos=Vulpes chama;
    Rüppells vos=Vulpes rueppellii;
    Bleke vos=Vulpes pallida;
    Fennek=Vulpes zerda;
    Honingdas=Mellivora capensis;
    Gestreepte bunzing=Ictonyx striatus;
    Ictonyx libycus;
    Poecilogale albinucha;
    Afrikaanse civet=Civettictis civetta;
    Genetta genetta;
    Genetta maculata;
    Genetta tigrina;
    Genetta pardina;
    Genetta servalina;
    Genetta victoriae;
    Genetta abyssinica;
    Genetta angolensis;
    Genetta thierryi;
    Genetta letabae;
    Nandinia binotata;
    Stokstaartje=Suricata suricatta;
    Zebramangoeste=Mungos mungo;
    Mungos gambianus;
    Dwergmangoeste=Helogale parvula;
    Helogale hirtula;
    Gele mangoeste=Cynictis penicillata;
    Slanke mangoeste=Herpestes sanguineus;
    Ichneumia albicauda;
    Bdeogale crassicauda;
    Bdeogale nigripes;
    Bdeogale jacksoni;
    Rhynchogale melleri;
    Atilax paludinosus;
    Crossarchus obscurus;
    Crossarchus alexandri;
    Crossarchus ansorgei;
    Crossarchus platycephalus;
    Liberiictis kuhni;
    Dologale dybowskii
  `, [20], 60);

  // ============================================================
  // AFRIKAANSE HOEFDIEREN
  // ============================================================

  afrikaanseDieren(`
    Nijlpaard=Hippopotamus amphibius;
    Dwergnijlpaard=Choeropsis liberiensis;
    Witte neushoorn=Ceratotherium simum;
    Zwarte neushoorn=Diceros bicornis;
    Gewone zebra=Equus quagga;
    Grévyzebra=Equus grevyi;
    Bergzebra=Equus zebra;
    Afrikaanse wilde ezel=Equus africanus;
    Giraffe=Giraffa camelopardalis;
    Okapi=Okapia johnstoni;
    Kaapse buffel=Syncerus caffer;
    Blauwe gnoe=Connochaetes taurinus;
    Zwarte gnoe=Connochaetes gnou;
    Impala=Aepyceros melampus;
    Springbok=Antidorcas marsupialis;
    Blesbok=Damaliscus pygargus;
    Damaliscus lunatus;
    Damaliscus korrigum;
    Damaliscus jimela;
    Hartebeest=Alcelaphus buselaphus;
    Lichtensteins hartebeest=Alcelaphus lichtensteinii;
    Grote koedoe=Tragelaphus strepsiceros;
    Kleine koedoe=Tragelaphus imberbis;
    Nyala=Tragelaphus angasii;
    Bergnyala=Tragelaphus buxtoni;
    Bosbok=Tragelaphus scriptus;
    Sitatunga=Tragelaphus spekii;
    Bongo=Tragelaphus eurycerus;
    Elandantilope=Taurotragus oryx;
    Reuzenelandantilope=Taurotragus derbianus;
    Sabelantilope=Hippotragus niger;
    Roanantilope=Hippotragus equinus;
    Gemsbok=Oryx gazella;
    Beisa=Oryx beisa;
    Algazel=Oryx dammah;
    Addax=Addax nasomaculatus;
    Waterbok=Kobus ellipsiprymnus;
    Kob=Kobus kob;
    Litschiewaterbok=Kobus leche;
    Puku=Kobus vardonii;
    Nijlantilope=Kobus megaceros;
    Rietbok=Redunca arundinum;
    Redunca redunca;
    Redunca fulvorufula;
    Oribi=Ourebia ourebi;
    Steenbok=Raphicerus campestris;
    Kaapse grysbok=Raphicerus melanotis;
    Sharpes grysbok=Raphicerus sharpei;
    Klipspringer=Oreotragus oreotragus;
    Saiga;
    Gerenoek=Litocranius walleri;
    Dib atag=Ammodorcas clarkei;
    Dorcasgazelle=Gazella dorcas;
    Slankhoorngazelle=Gazella leptoceros;
    Cuviergazelle=Gazella cuvieri;
    Damagazelle=Nanger dama;
    Grantgazelle=Nanger granti;
    Soemmerringgazelle=Nanger soemmerringii;
    Thomsongazelle=Eudorcas thomsonii;
    Eudorcas rufifrons;
    Eudorcas tilonura;
    Eudorcas albonotata;
    Dikdik=Madoqua;
    Madoqua kirkii;
    Madoqua guentheri;
    Madoqua saltiana;
    Madoqua piacentinii;
    Beira=Dorcatragus megalotis;
    Batesdwergantilope=Neotragus batesi;
    Dwergantilope=Neotragus pygmaeus;
    Soeni=Nesotragus moschatus;
    Gewone duiker=Sylvicapra grimmia;
    Blauwe duiker=Philantomba monticola;
    Philantomba maxwellii;
    Cephalophus dorsalis;
    Cephalophus natalensis;
    Cephalophus niger;
    Cephalophus silvicultor;
    Cephalophus spadix;
    Cephalophus zebra;
    Cephalophus jentinki;
    Cephalophus ogilbyi;
    Cephalophus leucogaster;
    Cephalophus callipygus;
    Cephalophus weynsi;
    Cephalophus nigrifrons;
    Cephalophus rufilatus;
    Wrattenzwijn=Phacochoerus africanus;
    Woestijnwrattenzwijn=Phacochoerus aethiopicus;
    Penseelzwijn=Potamochoerus porcus;
    Boszwijn=Potamochoerus larvatus;
    Reuzenboszwijn=Hylochoerus meinertzhageni
  `, [4,18,20], 65);

  // Saiga's leven niet in Afrika.
  verwijderKoppeling("Saiga", [5]);

  // ============================================================
  // AFRIKAANSE PRIMATEN
  // ============================================================

  afrikaanseDieren(`
    Chimpansee=Pan troglodytes;
    Bonobo=Pan paniscus;
    Westelijke gorilla=Gorilla gorilla;
    Oostelijke gorilla=Gorilla beringei;
    Berggorilla=Gorilla beringei beringei;
    Mandril=Mandrillus sphinx;
    Drill=Mandrillus leucophaeus;
    Mantelbaviaan=Papio hamadryas;
    Gele baviaan=Papio cynocephalus;
    Groene baviaan=Papio anubis;
    Beerbaviaan=Papio ursinus;
    Guineabaviaan=Papio papio;
    Papio kindae;
    Gelada=Theropithecus gelada;
    Huzaaraap=Erythrocebus patas;
    Erythrocebus poliophaeus;
    Groene meerkat=Chlorocebus sabaeus;
    Vervet=Chlorocebus pygerythrus;
    Chlorocebus aethiops;
    Chlorocebus tantalus;
    Chlorocebus cynosuros;
    Chlorocebus djamdjamensis;
    Cercopithecus mitis;
    Cercopithecus neglectus;
    Cercopithecus diana;
    Cercopithecus roloway;
    Cercopithecus mona;
    Cercopithecus campbelli;
    Cercopithecus pogonias;
    Cercopithecus cephus;
    Cercopithecus ascanius;
    Cercopithecus erythrogaster;
    Cercopithecus erythrotis;
    Cercopithecus petaurista;
    Cercopithecus nictitans;
    Cercopithecus lowei;
    Cercopithecus denti;
    Cercopithecus hamlyni;
    Cercopithecus lhoesti;
    Cercopithecus preussi;
    Cercopithecus solatus;
    Cercocebus atys;
    Cercocebus torquatus;
    Cercocebus agilis;
    Cercocebus chrysogaster;
    Cercocebus galeritus;
    Cercocebus sanjei;
    Lophocebus albigena;
    Lophocebus aterrimus;
    Lophocebus ugandae;
    Rungwecebus kipunji;
    Colobus guereza;
    Colobus angolensis;
    Colobus polykomos;
    Colobus satanas;
    Colobus vellerosus;
    Piliocolobus badius;
    Piliocolobus tephrosceles;
    Piliocolobus kirkii;
    Piliocolobus gordonorum;
    Piliocolobus rufomitratus;
    Piliocolobus preussi;
    Piliocolobus pennantii;
    Piliocolobus foai;
    Piliocolobus tholloni;
    Piliocolobus oustaleti;
    Piliocolobus temminckii;
    Piliocolobus waldronae;
    Piliocolobus bouvieri;
    Procolobus verus
  `, [20], 80);

  // ============================================================
  // GALAGO'S EN POTTO'S
  // ============================================================

  afrikaanseDieren(`
    Galago senegalensis;
    Galago moholi;
    Galago gallarum;
    Galago matschiei;
    Galagoides demidoff;
    Galagoides thomasi;
    Paragalago cocos;
    Paragalago zanzibaricus;
    Paragalago granti;
    Paragalago orinus;
    Paragalago rondoensis;
    Otolemur crassicaudatus;
    Otolemur garnettii;
    Otolemur monteiri;
    Euoticus elegantulus;
    Euoticus pallidus;
    Sciurocheirus alleni;
    Sciurocheirus gabonensis;
    Sciurocheirus cameronensis;
    Potto=Perodicticus potto;
    Perodicticus edwardsi;
    Perodicticus ibeanus;
    Arctocebus calabarensis;
    Arctocebus aureus
  `, [6,20,27,31,35], 85);

  // ============================================================
  // MADAGASKAR - MAKI'S EN LEMUREN
  // ============================================================

  afrikaanseDieren(`
    Ringstaartmaki=Lemur catta;
    Vari=Varecia variegata;
    Rode vari=Varecia rubra;
    Indri=Indri indri;
    Verreauxs sifaka=Propithecus verreauxi;
    Propithecus coquereli;
    Propithecus coronatus;
    Propithecus deckenii;
    Propithecus diadema;
    Propithecus edwardsi;
    Propithecus candidus;
    Propithecus perrieri;
    Propithecus tattersalli;
    Eulemur fulvus;
    Eulemur macaco;
    Eulemur flavifrons;
    Eulemur coronatus;
    Eulemur rubriventer;
    Eulemur mongoz;
    Eulemur rufus;
    Eulemur rufifrons;
    Eulemur albifrons;
    Eulemur cinereiceps;
    Eulemur collaris;
    Eulemur sanfordi;
    Eulemur flavifrons;
    Hapalemur griseus;
    Hapalemur aureus;
    Hapalemur alaotrensis;
    Hapalemur occidentalis;
    Hapalemur meridionalis;
    Prolemur simus;
    Avahi laniger;
    Avahi occidentalis;
    Avahi unicolor;
    Avahi cleesei;
    Avahi peyrierasi;
    Avahi meridionalis;
    Avahi ramanantsoavanai;
    Avahi betsileo;
    Avahi mooreorum;
    Lepilemur mustelinus;
    Lepilemur leucopus;
    Lepilemur ruficaudatus;
    Lepilemur edwardsi;
    Lepilemur microdon;
    Lepilemur dorsalis;
    Lepilemur septentrionalis;
    Lepilemur ankaranensis;
    Lepilemur aeeclis;
    Lepilemur ahmansonorum;
    Lepilemur betsileo;
    Lepilemur fleuretae;
    Lepilemur grewcockorum;
    Lepilemur hubbardorum;
    Lepilemur jamesorum;
    Lepilemur milanoii;
    Lepilemur otto;
    Lepilemur petteri;
    Lepilemur randrianasoloi;
    Lepilemur sahamalaza;
    Lepilemur scottorum;
    Lepilemur seali;
    Lepilemur tymerlachsoni;
    Lepilemur wrightae;
    Cheirogaleus major;
    Cheirogaleus medius;
    Cheirogaleus crossleyi;
    Cheirogaleus sibreei;
    Cheirogaleus thomasi;
    Microcebus murinus;
    Microcebus rufus;
    Microcebus berthae;
    Microcebus myoxinus;
    Microcebus griseorufus;
    Microcebus ravelobensis;
    Microcebus tavaratra;
    Microcebus sambiranensis;
    Microcebus mamiratra;
    Microcebus lehilahytsara;
    Microcebus mittermeieri;
    Microcebus jollyae;
    Microcebus simmonsi;
    Microcebus bongolavensis;
    Microcebus danfossi;
    Microcebus margotmarshae;
    Microcebus arnholdi;
    Microcebus gerpi;
    Microcebus marohita;
    Microcebus boraha;
    Microcebus ganzhorni;
    Microcebus manitatra;
    Mirza coquereli;
    Mirza zaza;
    Phaner furcifer;
    Phaner pallescens;
    Phaner parienti;
    Phaner electromontis;
    Vingerdier=Daubentonia madagascariensis
  `, [6,20,31,35], 85);

  // ============================================================
  // OVERIGE ZOOGDIEREN VAN MADAGASKAR
  // ============================================================

  afrikaanseDieren(`
    Fossa=Cryptoprocta ferox;
    Fanaloka=Fossa fossana;
    Falanouc=Eupleres goudotii;
    Eupleres major;
    Galidia elegans;
    Galidictis fasciata;
    Galidictis grandidieri;
    Mungotictis decemlineata;
    Salanoia concolor;
    Salanoia durrelli;
    Gewone tenrek=Tenrec ecaudatus;
    Kleine egeltenrek=Echinops telfairi;
    Grote egeltenrek=Setifer setosus;
    Hemicentetes semispinosus;
    Hemicentetes nigriceps;
    Geogale aurita;
    Microgale talazaci;
    Microgale dobsoni;
    Microgale cowani;
    Microgale drouhardi;
    Microgale fotsifotsy;
    Microgale gracilis;
    Microgale gymnorhyncha;
    Microgale jenkinsae;
    Microgale longicaudata;
    Microgale monticola;
    Microgale nasoloi;
    Microgale parvula;
    Microgale principula;
    Microgale pusilla;
    Microgale soricoides;
    Microgale taiva;
    Microgale thomasi;
    Microgale jobihely;
    Microgale brevicaudata;
    Microgale grandidieri;
    Oryzorictes hova;
    Oryzorictes tetradactylus;
    Limnogale mergulus;
    Hypogeomys antimena;
    Brachytarsomys albicauda;
    Brachytarsomys villosa;
    Eliurus myoxinus;
    Eliurus minor;
    Eliurus majori;
    Eliurus tanala;
    Eliurus webbi;
    Eliurus grandidieri;
    Eliurus carletoni;
    Eliurus antsingy;
    Eliurus penicillatus;
    Eliurus petteri;
    Eliurus danieli;
    Eliurus ellermani;
    Monticolomys koopmani;
    Macrotarsomys bastardi;
    Macrotarsomys ingens;
    Macrotarsomys petteri;
    Nesomys rufus;
    Nesomys audeberti;
    Nesomys lambertoni
  `, [20], 90);

  // ============================================================
  // AFRIKAANSE KNAAGDIEREN
  // ============================================================

  afrikaanseDieren(`
    Kaaps stekelvarken=Hystrix africaeaustralis;
    Hystrix cristata;
    Atherurus africanus;
    Afrikaanse reuzerat=Cricetomys gambianus;
    Cricetomys emini;
    Cricetomys ansorgei;
    Cricetomys kivuensis;
    Xerus inauris;
    Xerus rutilus;
    Geosciurus inauris;
    Geosciurus princeps;
    Atlantoxerus getulus;
    Funisciurus anerythrus;
    Funisciurus congicus;
    Funisciurus isabella;
    Funisciurus lemniscatus;
    Funisciurus leucogenys;
    Funisciurus pyrropus;
    Funisciurus substriatus;
    Funisciurus carruthersi;
    Funisciurus bayonii;
    Paraxerus cepapi;
    Paraxerus palliatus;
    Paraxerus boehmi;
    Paraxerus alexandri;
    Paraxerus cooperi;
    Paraxerus flavovittis;
    Paraxerus lucifer;
    Paraxerus ochraceus;
    Paraxerus poensis;
    Paraxerus vexillarius;
    Heliosciurus gambianus;
    Heliosciurus rufobrachium;
    Heliosciurus mutabilis;
    Heliosciurus punctatus;
    Heliosciurus ruwenzorii;
    Heliosciurus undulatus;
    Protoxerus stangeri;
    Protoxerus aubinnii;
    Epixerus ebii;
    Myosciurus pumilio;
    Anomalurus derbianus;
    Anomalurus beecrofti;
    Anomalurus pusillus;
    Anomalurus pelii;
    Idiurus macrotis;
    Idiurus zenkeri;
    Zenkerella insignis;
    Thryonomys swinderianus;
    Thryonomys gregorianus;
    Petromus typicus;
    Lophiomys imhausi;
    Pedetes capensis;
    Pedetes surdaster;
    Graphiurus murinus;
    Graphiurus ocularis;
    Graphiurus platyops;
    Graphiurus microtis;
    Graphiurus parvus;
    Graphiurus lorraineus;
    Graphiurus kelleni;
    Graphiurus crassicaudatus;
    Graphiurus christyi;
    Graphiurus hueti;
    Graphiurus nagtglasii;
    Graphiurus rupicola;
    Graphiurus angolensis
  `, [20], 85);

  // ============================================================
  // AFRIKAANSE VOGELS
  // ============================================================

  afrikaanseDieren(`
    Struisvogel=Struthio camelus;
    Somalische struisvogel=Struthio molybdophanes
  `, [7,18,22], 35);

  afrikaanseDieren(`
    Secretarisvogel=Sagittarius serpentarius;
    Vechtarend=Polemaetus bellicosus;
    Kroonarend=Stephanoaetus coronatus;
    Afrikaanse zeearend=Haliaeetus vocifer;
    Zwarte arend=Aquila verreauxii;
    Savannearend=Aquila rapax;
    Aquila spilogaster;
    Aquila wahlbergi;
    Aquila ayresii;
    Bateleur=Terathopius ecaudatus;
    Bruine slangenarend=Circaetus cinereus;
    Circaetus pectoralis;
    Circaetus fasciolatus;
    Circaetus cinerascens;
    Circaetus beaudouini;
    Afrikaanse havikarend=Aquila spilogaster;
    Lophaetus occipitalis;
    Hieraaetus pennatus;
    Hieraaetus ayresii;
    Kaupifalco monogrammicus;
    Melierax canorus;
    Melierax metabates;
    Melierax poliopterus;
    Micronisus gabar;
    Polyboroides typus;
    Accipiter tachiro;
    Accipiter melanoleucus;
    Accipiter minullus;
    Accipiter ovampensis;
    Accipiter erythropus;
    Accipiter castanilius;
    Accipiter toussenelii;
    Buteo augur;
    Buteo rufofuscus;
    Buteo auguralis;
    Buteo oreophilus;
    Witkopgier=Trigonoceps occipitalis;
    Kapgier=Necrosyrtes monachus;
    Rüppells gier=Gyps rueppelli;
    Kaapse gier=Gyps coprotheres;
    Witruggier=Gyps africanus;
    Oorgier=Torgos tracheliotos;
    Palmnootgier=Gypohierax angolensis;
    Maraboe=Leptoptilos crumenifer;
    Zadelbekooievaar=Ephippiorhynchus senegalensis;
    Afrikaanse nimmerzat=Mycteria ibis;
    Afrikaanse gaper=Anastomus lamelligerus;
    Wolnekooievaar=Ciconia episcopus;
    Abdimooievaar=Ciconia abdimii;
    Hamerkop=Scopus umbretta;
    Schoenbekooievaar=Balaeniceps rex
  `, [2,7,18,22], 75);

  // ============================================================
  // AFRIKAANSE NEUSHOORNVOGELS
  // ============================================================

  afrikaanseDieren(`
    Zuidelijke hoornraaf=Bucorvus leadbeateri;
    Noordelijke hoornraaf=Bucorvus abyssinicus;
    Tockus erythrorhynchus;
    Tockus leucomelas;
    Tockus flavirostris;
    Tockus deckeni;
    Tockus jacksoni;
    Tockus kempi;
    Tockus ruahae;
    Tockus damarensis;
    Lophoceros nasutus;
    Lophoceros alboterminatus;
    Lophoceros camurus;
    Lophoceros fasciatus;
    Lophoceros pallidirostris;
    Lophoceros bradfieldi;
    Lophoceros hemprichii;
    Bycanistes brevis;
    Bycanistes bucinator;
    Bycanistes fistulator;
    Bycanistes cylindricus;
    Bycanistes albotibialis;
    Bycanistes subcylindricus;
    Ceratogymna atrata;
    Ceratogymna elata;
    Horizocerus hartlaubi;
    Horizocerus albocristatus
  `, [2,7,18,22], 85);

  // ============================================================
  // AFRIKAANSE TOERAKO'S
  // ============================================================

  afrikaanseDieren(`
    Tauraco persa;
    Tauraco livingstonii;
    Tauraco corythaix;
    Tauraco schuettii;
    Tauraco fischeri;
    Tauraco hartlaubi;
    Tauraco leucotis;
    Tauraco ruspolii;
    Tauraco bannermani;
    Tauraco erythrolophus;
    Tauraco macrorhynchus;
    Tauraco leucolophus;
    Tauraco porphyreolophus;
    Musophaga violacea;
    Musophaga rossae;
    Corythaeola cristata;
    Crinifer piscator;
    Crinifer zonurus;
    Crinifer concolor;
    Crinifer personatus;
    Crinifer leucogaster
  `, [2,7,18,22,31], 85);

  // ============================================================
  // AFRIKAANSE PAPEGAAIEN
  // ============================================================

  afrikaanseDieren(`
    Grijze roodstaartpapegaai=Psittacus erithacus;
    Timnehpapegaai=Psittacus timneh;
    Halsbandparkiet=Psittacula krameri;
    Senegalpapegaai=Poicephalus senegalus;
    Poicephalus meyeri;
    Poicephalus rufiventris;
    Poicephalus gulielmi;
    Poicephalus robustus;
    Poicephalus cryptoxanthus;
    Poicephalus fuscicollis;
    Poicephalus rueppellii;
    Poicephalus flavifrons;
    Poicephalus crassus;
    Agapornis roseicollis;
    Agapornis personatus;
    Agapornis fischeri;
    Agapornis lilianae;
    Agapornis nigrigenis;
    Agapornis taranta;
    Agapornis pullarius;
    Agapornis canus;
    Agapornis swindernianus
  `, [2,7,18,22,31,35], 75);

  // ============================================================
  // AFRIKAANSE WEVERVOGELS
  // ============================================================

  afrikaanseDieren(`
    Ploceus cucullatus;
    Ploceus velatus;
    Ploceus capensis;
    Ploceus intermedius;
    Ploceus ocularis;
    Ploceus melanocephalus;
    Ploceus heuglini;
    Ploceus nigerrimus;
    Ploceus castaneiceps;
    Ploceus jacksoni;
    Ploceus bicolor;
    Ploceus baglafecht;
    Ploceus luteolus;
    Ploceus vitellinus;
    Ploceus xanthops;
    Ploceus aurantius;
    Ploceus galbula;
    Ploceus taeniopterus;
    Ploceus bojeri;
    Ploceus castanops;
    Ploceus subaureus;
    Ploceus xanthopterus;
    Ploceus nigricollis;
    Ploceus alienus;
    Ploceus melanogaster;
    Ploceus pelzelni;
    Ploceus nicolli;
    Ploceus insignis;
    Ploceus preussi;
    Ploceus dorsomaculatus;
    Ploceus tricolor;
    Ploceus albinucha;
    Ploceus nelicourvi;
    Ploceus sakalava;
    Malimbus malimbicus;
    Malimbus nitens;
    Malimbus rubricollis;
    Malimbus scutatus;
    Malimbus erythrogaster;
    Malimbus cassini;
    Malimbus coronatus;
    Malimbus racheliae;
    Malimbus ballmanni;
    Malimbus ibadanensis;
    Quelea quelea;
    Quelea erythrops;
    Quelea cardinalis;
    Philetairus socius;
    Pseudonigrita arnaudi;
    Pseudonigrita cabanisi;
    Sporopipes frontalis;
    Sporopipes squamifrons;
    Euplectes orix;
    Euplectes afer;
    Euplectes franciscanus;
    Euplectes hordeaceus;
    Euplectes nigroventris;
    Euplectes gierowii;
    Euplectes jacksoni;
    Euplectes progne;
    Euplectes ardens;
    Euplectes axillaris;
    Euplectes albonotatus;
    Euplectes macroura;
    Euplectes capensis;
    Euplectes psammocromius
  `, [2,7,18,22,41], 85);

  // ============================================================
  // AFRIKAANSE BIJENETERS EN SCHARRELAARS
  // ============================================================

  afrikaanseDieren(`
    Merops apiaster;
    Merops nubicus;
    Merops nubicoides;
    Merops pusillus;
    Merops variegatus;
    Merops oreobates;
    Merops hirundineus;
    Merops bullockoides;
    Merops bullocki;
    Merops revoilii;
    Merops albicollis;
    Merops persicus;
    Merops superciliosus;
    Merops malimbicus;
    Merops muelleri;
    Merops gularis;
    Merops breweri;
    Merops hirundineus;
    Merops lafresnayii;
    Merops viridis;
    Coracias caudatus;
    Coracias garrulus;
    Coracias abyssinicus;
    Coracias naevius;
    Coracias cyanogaster;
    Coracias spatulatus;
    Eurystomus glaucurus;
    Eurystomus gularis
  `, [2,7,15,18,22], 85);

  verwijderKoppeling("Merops viridis", [5]);

  // ============================================================
  // AFRIKAANSE IJSVOGELS
  // ============================================================

  afrikaanseDieren(`
    Bonte ijsvogel=Ceryle rudis;
    Reuzenijsvogel=Megaceryle maxima;
    Malachietijsvogel=Corythornis cristatus;
    Corythornis leucogaster;
    Corythornis vintsioides;
    Ispidina picta;
    Ispidina lecontei;
    Halcyon senegalensis;
    Halcyon chelicuti;
    Halcyon leucocephala;
    Halcyon albiventris;
    Halcyon malimbica;
    Halcyon badia;
    Halcyon cyanoleuca
  `, [2,7,18,22], 85);

  // ============================================================
  // AFRIKAANSE HONINGZUIGERS
  // ============================================================

  afrikaanseDieren(`
    Cinnyris venustus;
    Cinnyris afer;
    Cinnyris chalybeus;
    Cinnyris talatala;
    Cinnyris mariquensis;
    Cinnyris bifasciatus;
    Cinnyris pulchellus;
    Cinnyris erythrocercus;
    Cinnyris nectarinioides;
    Cinnyris mariquensis;
    Cinnyris habessinicus;
    Cinnyris coccinigastrus;
    Cinnyris chloropygius;
    Cinnyris superbus;
    Cinnyris johannae;
    Cinnyris cupreus;
    Cinnyris fuscus;
    Cinnyris oustaleti;
    Cinnyris ludovicensis;
    Cinnyris reichenbachii;
    Cinnyris stuhlmanni;
    Cinnyris whytei;
    Cinnyris manoensis;
    Cinnyris regius;
    Cinnyris rockefelleri;
    Cinnyris mediocris;
    Cinnyris moreaui;
    Cinnyris loveridgei;
    Cinnyris usambaricus;
    Cinnyris fuelleborni;
    Cinnyris preussi;
    Cinnyris reichenowi;
    Cinnyris bouvieri;
    Cinnyris lotenius;
    Nectarinia famosa;
    Nectarinia kilimensis;
    Nectarinia johnstoni;
    Nectarinia purpureiventris;
    Nectarinia tacazze;
    Cyanomitra olivacea;
    Cyanomitra verticalis;
    Cyanomitra cyanolaema;
    Cyanomitra oritis;
    Cyanomitra veroxii;
    Cyanomitra alinae;
    Chalcomitra senegalensis;
    Chalcomitra amethystina;
    Chalcomitra hunteri;
    Chalcomitra fuliginosa;
    Chalcomitra rubescens;
    Hedydipna collaris;
    Hedydipna platura;
    Hedydipna metallica;
    Anthreptes collaris;
    Anthreptes aurantius;
    Anthreptes rectirostris;
    Anthreptes longuemarei;
    Anthreptes orientalis;
    Anthreptes pallidigaster
  `, [2,7,18,22], 90);

  verwijderKoppeling("Cinnyris lotenius", [5]);

  // ============================================================
  // AFRIKAANSE REPTIELEN - KAMELEONS
  // ============================================================

  afrikaanseDieren(`
    Chamaeleo chamaeleon;
    Chamaeleo africanus;
    Chamaeleo dilepis;
    Chamaeleo gracilis;
    Chamaeleo senegalensis;
    Chamaeleo namaquensis;
    Chamaeleo calyptratus;
    Chamaeleo laevigatus;
    Chamaeleo anchietae;
    Chamaeleo necasi;
    Chamaeleo quilensis;
    Chamaeleo zeylanicus;
    Trioceros jacksonii;
    Trioceros melleri;
    Trioceros cristatus;
    Trioceros deremensis;
    Trioceros hoehnelii;
    Trioceros johnstoni;
    Trioceros montium;
    Trioceros quadricornis;
    Trioceros werneri;
    Trioceros ellioti;
    Trioceros bitaeniatus;
    Trioceros rudis;
    Trioceros sternfeldi;
    Trioceros schubotzi;
    Trioceros conirostratus;
    Trioceros feae;
    Trioceros goetzei;
    Trioceros hanangensis;
    Trioceros laterispinis;
    Trioceros marsabitensis;
    Trioceros narraioca;
    Trioceros nyirit;
    Trioceros schoutedeni;
    Trioceros tempeli;
    Trioceros wolfgangboehmei;
    Bradypodion pumilum;
    Bradypodion damaranum;
    Bradypodion ventrale;
    Bradypodion melanocephalum;
    Bradypodion thamnobates;
    Bradypodion setaroi;
    Bradypodion caffer;
    Bradypodion transvaalense;
    Bradypodion occidentale;
    Bradypodion karrooicum;
    Bradypodion taeniabronchum;
    Bradypodion dracomontanum;
    Bradypodion nemorale;
    Bradypodion kentanicum;
    Bradypodion caeruleogula;
    Kinyongia fischeri;
    Kinyongia multituberculata;
    Kinyongia boehmei;
    Kinyongia tavetana;
    Kinyongia matschiei;
    Kinyongia tenuis;
    Kinyongia oxyrhina;
    Kinyongia uluguruensis;
    Kinyongia uthmoelleri;
    Kinyongia adolfifriderici;
    Kinyongia carpenteri;
    Kinyongia xenorhina;
    Kinyongia tolleyae;
    Kinyongia vanheygeni
  `, [18,21], 85);

  verwijderKoppeling("Chamaeleo calyptratus", [5]);
  verwijderKoppeling("Chamaeleo zeylanicus", [5]);

  // ============================================================
  // MADAGASKAR - KAMELEONS
  // ============================================================

  afrikaanseDieren(`
    Furcifer pardalis;
    Furcifer oustaleti;
    Furcifer verrucosus;
    Furcifer lateralis;
    Furcifer minor;
    Furcifer campani;
    Furcifer antimena;
    Furcifer bifidus;
    Furcifer balteatus;
    Furcifer petteri;
    Furcifer rhinoceratus;
    Furcifer labordi;
    Furcifer willsii;
    Furcifer belalandaensis;
    Furcifer angeli;
    Furcifer nicosiai;
    Furcifer tuzetae;
    Furcifer timoni;
    Furcifer viridis;
    Calumma parsonii;
    Calumma globifer;
    Calumma oshaughnessyi;
    Calumma crypticum;
    Calumma brevicorne;
    Calumma cucullatum;
    Calumma nasutum;
    Calumma boettgeri;
    Calumma gastrotaenia;
    Calumma gallus;
    Calumma glawi;
    Calumma guillaumeti;
    Calumma hilleniusi;
    Calumma jejy;
    Calumma malthe;
    Calumma marojezense;
    Calumma peyrierasi;
    Calumma tarzan;
    Calumma vohibola;
    Calumma vatosoa;
    Calumma amber;
    Calumma andringitraense;
    Calumma hafahafa;
    Calumma lefona;
    Calumma roaloko;
    Calumma uetzi;
    Calumma gehringi;
    Calumma juliae;
    Calumma tjiasmantoi
  `, [18,21,31,35], 90);

  afrikaanseDieren(`
    Brookesia micra;
    Brookesia nana;
    Brookesia minima;
    Brookesia superciliaris;
    Brookesia thieli;
    Brookesia stumpffi;
    Brookesia brygooi;
    Brookesia decaryi;
    Brookesia ebenaui;
    Brookesia griveaudi;
    Brookesia perarmata;
    Brookesia therezieni;
    Brookesia tuberculata;
    Brookesia peyrierasi;
    Brookesia karchei;
    Brookesia lineata;
    Brookesia ambreensis;
    Brookesia betschi;
    Brookesia antakarana;
    Brookesia desperata;
    Brookesia confidens;
    Brookesia tristis;
    Brookesia exarmata;
    Brookesia valerieae;
    Brookesia bonsi;
    Brookesia nasus;
    Brookesia ramanantsoai
  `, [18,21], 90);

  // Brookesia leeft vaak op de bosbodem.
  // Geen automatische koppeling aan boomdieren.

  // ============================================================
  // AFRIKAANSE HAGEDISSEN
  // ============================================================

  afrikaanseDieren(`
    Nijlvaraan=Varanus niloticus;
    Steppevaraan=Varanus exanthematicus;
    Witkeelvaraan=Varanus albigularis;
    Varanus griseus;
    Varanus yemenensis;
    Agama agama;
    Agama picticauda;
    Agama lionotus;
    Agama mwanzae;
    Agama planiceps;
    Agama atra;
    Agama armata;
    Agama aculeata;
    Agama anchietae;
    Agama hispida;
    Agama kirkii;
    Agama mossambica;
    Agama anchietae;
    Agama bottegi;
    Agama doriae;
    Agama hartmanni;
    Agama impalearis;
    Agama spinosa;
    Agama agama;
    Acanthocercus atricollis;
    Acanthocercus annectans;
    Acanthocercus cyanogaster;
    Acanthocercus gregorii;
    Acanthocercus phillipsii;
    Acanthocercus ugandaensis;
    Trapelus mutabilis;
    Trapelus savignii;
    Trapelus tournevillei;
    Uromastyx acanthinura;
    Uromastyx aegyptia;
    Uromastyx dispar;
    Uromastyx geyri;
    Uromastyx ocellata;
    Uromastyx ornata;
    Uromastyx benti;
    Uromastyx princeps;
    Cordylus cordylus;
    Cordylus tropidosternum;
    Cordylus vittifer;
    Cordylus niger;
    Cordylus macropholis;
    Cordylus minor;
    Cordylus imkeae;
    Cordylus rhodesianus;
    Ouroborus cataphractus;
    Smaug giganteus;
    Smaug warreni;
    Smaug barbertonensis;
    Smaug mossambicus;
    Smaug depressus;
    Platysaurus imperator;
    Platysaurus broadleyi;
    Platysaurus capensis;
    Platysaurus intermedius;
    Platysaurus minor;
    Platysaurus mitchelli;
    Platysaurus monotropis;
    Platysaurus orientalis;
    Platysaurus torquatus;
    Gerrhosaurus major;
    Gerrhosaurus flavigularis;
    Gerrhosaurus nigrolineatus;
    Gerrhosaurus typicus;
    Broadleysaurus major;
    Zonosaurus madagascariensis;
    Zonosaurus ornatus;
    Zonosaurus laticaudatus;
    Zonosaurus maximus;
    Zonosaurus quadrilineatus;
    Zonosaurus karsteni;
    Zonosaurus trilineatus
  `, [18,21], 85);

  verwijderKoppeling("Varanus yemenensis", [5]);
  verwijderKoppeling("Uromastyx benti", [5]);

  // ============================================================
  // AFRIKAANSE SLANGEN
  // ============================================================

  afrikaanseDieren(`
    Zwarte mamba=Dendroaspis polylepis;
    Groene mamba=Dendroaspis angusticeps;
    Westelijke groene mamba=Dendroaspis viridis;
    Dendroaspis jamesoni;
    Egyptische cobra=Naja haje;
    Kaapse cobra=Naja nivea;
    Zwartnekcobra=Naja nigricollis;
    Naja mossambica;
    Naja annulifera;
    Naja melanoleuca;
    Naja pallida;
    Naja nubiae;
    Naja ashei;
    Naja katiensis;
    Naja anchietae;
    Naja senegalensis;
    Naja subfulva;
    Naja guineensis;
    Naja savannula;
    Naja multifasciata;
    Naja annulata;
    Naja christyi;
    Hemachatus haemachatus;
    Boomslang=Dispholidus typus;
    Thelotornis capensis;
    Thelotornis kirtlandii;
    Thelotornis mossambicanus;
    Thelotornis usambaricus;
    Pofadder=Bitis arietans;
    Gabonadder=Bitis gabonica;
    Bitis rhinoceros;
    Bitis nasicornis;
    Bitis atropos;
    Bitis caudalis;
    Bitis cornuta;
    Bitis peringueyi;
    Bitis schneideri;
    Bitis xeropaga;
    Bitis rubida;
    Bitis armata;
    Bitis heraldica;
    Bitis parviocula;
    Bitis worthingtoni;
    Atheris squamigera;
    Atheris ceratophora;
    Atheris chlorechis;
    Atheris hispida;
    Atheris nitschei;
    Atheris desaixi;
    Atheris katangensis;
    Atheris rungweensis;
    Atheris broadleyi;
    Atheris barbouri;
    Atheris mabuensis;
    Atheris acuminata;
    Atheris anisolepis;
    Echis pyramidum;
    Echis ocellatus;
    Echis leucogaster;
    Echis jogeri;
    Echis hughesi;
    Echis coloratus;
    Cerastes cerastes;
    Cerastes vipera
  `, [18,21,45], 75);

  afrikaanseDieren(`
    Koningspython=Python regius;
    Rotspython=Python sebae;
    Python natalensis;
    Calabaria reinhardtii;
    Boaedon fuliginosus;
    Boaedon capensis;
    Boaedon lineatus;
    Boaedon olivaceus;
    Boaedon virgatus;
    Lamprophis aurora;
    Lamprophis guttatus;
    Lamprophis fiskii;
    Dasypeltis scabra;
    Dasypeltis medici;
    Dasypeltis inornata;
    Dasypeltis fasciata;
    Dasypeltis atra;
    Dasypeltis gansi;
    Dasypeltis confusa;
    Dasypeltis parascabra;
    Dasypeltis sahelensis;
    Dasypeltis taylori;
    Psammophis sibilans;
    Psammophis schokari;
    Psammophis mossambicus;
    Psammophis crucifer;
    Psammophis angolensis;
    Psammophis brevirostris;
    Psammophis subtaeniatus;
    Psammophis notostictus;
    Psammophis trigrammus;
    Psammophis punctulatus;
    Psammophis rukwae;
    Philothamnus semivariegatus;
    Philothamnus irregularis;
    Philothamnus hoplogaster;
    Philothamnus natalensis;
    Philothamnus angolensis;
    Philothamnus carinatus;
    Philothamnus heterodermus;
    Philothamnus macrops;
    Philothamnus nitidus
  `, [18,21], 85);

  // ============================================================
  // AFRIKAANSE AMFIBIEËN
  // ============================================================

  afrikaanseDieren(`
    Goliathkikker=Conraua goliath;
    Conraua robusta;
    Conraua crassipes;
    Conraua derooi;
    Conraua alleni;
    Afrikaanse brulkikker=Pyxicephalus adspersus;
    Pyxicephalus edulis;
    Pyxicephalus angusticeps;
    Hemisus marmoratus;
    Hemisus guttatus;
    Hemisus guineensis;
    Hemisus perreti;
    Hemisus microscaphus;
    Breviceps adspersus;
    Breviceps macrops;
    Breviceps fuscus;
    Breviceps gibbosus;
    Breviceps mossambicus;
    Breviceps verrucosus;
    Breviceps poweri;
    Breviceps sopranus;
    Breviceps sylvestris;
    Breviceps montanus;
    Breviceps namaquensis;
    Breviceps rosei;
    Breviceps bagginsi;
    Breviceps branchi;
    Breviceps carruthersi;
    Arthroleptis stenodactylus;
    Arthroleptis wahlbergii;
    Arthroleptis variabilis;
    Arthroleptis poecilonotus;
    Arthroleptis adelphus;
    Arthroleptis affinis;
    Arthroleptis aureoli;
    Arthroleptis bivittatus;
    Arthroleptis francei;
    Arthroleptis krokosua;
    Arthroleptis nikeae;
    Arthroleptis nguruensis;
    Arthroleptis reichei;
    Arthroleptis schubotzi;
    Arthroleptis tanneri;
    Hyperolius marmoratus;
    Hyperolius viridiflavus;
    Hyperolius argus;
    Hyperolius puncticulatus;
    Hyperolius tuberilinguis;
    Hyperolius pusillus;
    Hyperolius mitchelli;
    Hyperolius kivuensis;
    Hyperolius lateralis;
    Hyperolius cinnamomeoventris;
    Hyperolius concolor;
    Hyperolius fusciventris;
    Hyperolius guttulatus;
    Hyperolius nitidulus;
    Hyperolius nasutus;
    Hyperolius semidiscus;
    Hyperolius spinigularis;
    Hyperolius stictus;
    Hyperolius substriatus;
    Hyperolius thomensis;
    Leptopelis natalensis;
    Leptopelis vermiculatus;
    Leptopelis uluguruensis;
    Leptopelis flavomaculatus;
    Leptopelis argenteus;
    Leptopelis bocagii;
    Leptopelis calcaratus;
    Leptopelis christyi;
    Leptopelis concolor;
    Leptopelis cynnamomeus;
    Leptopelis forestis;
    Leptopelis gramineus;
    Leptopelis macrotis;
    Leptopelis modestus;
    Leptopelis notatus;
    Leptopelis occidentalis;
    Leptopelis palmatus;
    Leptopelis parkeri;
    Leptopelis rufus;
    Leptopelis spiritusnoctis;
    Leptopelis viridis
  `, [4], 85);

  // ============================================================
  // AFRIKAANSE VLINDERS
  // ============================================================

  afrikaanseDieren(`
    Papilio dardanus;
    Papilio demodocus;
    Papilio nireus;
    Papilio bromius;
    Papilio constantinus;
    Papilio cynorta;
    Papilio echerioides;
    Papilio euphranor;
    Papilio hesperus;
    Papilio jacksoni;
    Papilio lormieri;
    Papilio mackinnoni;
    Papilio menestheus;
    Papilio ophidicephalus;
    Papilio pelodurus;
    Papilio phorcas;
    Papilio rex;
    Papilio sosia;
    Papilio thuraui;
    Papilio zenobia;
    Graphium antheus;
    Graphium angolanus;
    Graphium policenes;
    Graphium porthaon;
    Graphium leonidas;
    Graphium pylades;
    Graphium colonna;
    Graphium endochus;
    Graphium evombar;
    Graphium junodi;
    Graphium kirbyi;
    Graphium liponesco;
    Graphium poggianus;
    Graphium ridleyanus;
    Graphium tynderaeus;
    Charaxes jasius;
    Charaxes brutus;
    Charaxes varanes;
    Charaxes candiope;
    Charaxes castor;
    Charaxes achaemenes;
    Charaxes ameliae;
    Charaxes anticlea;
    Charaxes aubyni;
    Charaxes bipunctatus;
    Charaxes cithaeron;
    Charaxes cynthia;
    Charaxes etesipe;
    Charaxes eupale;
    Charaxes fulvescens;
    Charaxes hadrianus;
    Charaxes jahlusa;
    Charaxes lucretius;
    Charaxes lycurgus;
    Charaxes macclounii;
    Charaxes marieps;
    Charaxes numenes;
    Charaxes nobilis;
    Charaxes octavia;
    Charaxes paphianus;
    Charaxes pelias;
    Charaxes pollux;
    Charaxes protoclea;
    Charaxes saturnus;
    Charaxes smaragdalis;
    Charaxes tiridates;
    Charaxes violetta;
    Charaxes zoolina;
    Danaus chrysippus;
    Acraea horta;
    Acraea encedon;
    Acraea eponina;
    Acraea terpsicore;
    Acraea zetes;
    Acraea acerata;
    Acraea anemosa;
    Acraea aglaonice;
    Acraea anacreon;
    Acraea bonasia;
    Acraea cabira;
    Acraea caldarena;
    Acraea caecilia;
    Acraea egina;
    Acraea esebria;
    Acraea lygus;
    Acraea neobule;
    Acraea natalica;
    Acraea oncaea;
    Acraea petraea;
    Acraea rahira;
    Acraea satis;
    Acraea serena;
    Acraea ventura
  `, [2,7], 85);

  // ============================================================
  // EUROPESE BOSZOOGDIEREN
  // ============================================================

  bosdieren(`
    Edelhert=Cervus elaphus;
    Ree=Capreolus capreolus;
    Damhert=Dama dama;
    Eland=Alces alces;
    Wild zwijn=Sus scrofa;
    Europese bizon=Bison bonasus;
    Bruine beer=Ursus arctos;
    Wolf=Canis lupus;
    Rode vos=Vulpes vulpes;
    Europese lynx=Lynx lynx;
    Wilde kat=Felis silvestris;
    Boommarter=Martes martes;
    Steenmarter=Martes foina;
    Europese das=Meles meles;
    Bunzing=Mustela putorius;
    Hermelijn=Mustela erminea;
    Wezel=Mustela nivalis;
    Rode eekhoorn=Sciurus vulgaris;
    Siberische grondeekhoorn=Eutamias sibiricus;
    Hazelmuis=Muscardinus avellanarius;
    Eikelmuis=Eliomys quercinus;
    Relmuis=Glis glis;
    Bosslaapmuis=Dryomys nitedula;
    Grote bosmuis=Apodemus flavicollis;
    Bosmuis=Apodemus sylvaticus;
    Rosse woelmuis=Myodes glareolus;
    Apodemus agrarius;
    Apodemus uralensis;
    Apodemus alpicola;
    Apodemus mystacinus;
    Apodemus epimelas;
    Microtus subterraneus;
    Sorex araneus;
    Sorex minutus;
    Sorex caecutiens;
    Sorex isodon;
    Sorex alpinus;
    Sorex daphaenodon;
    Egel=Erinaceus europaeus;
    Erinaceus roumanicus;
    Europese mol=Talpa europaea
  `, [20], 45);

  // ============================================================
  // NOORD-AMERIKAANSE BOSDIEREN
  // ============================================================

  bosdieren(`
    Amerikaanse zwarte beer=Ursus americanus;
    Grizzlybeer=Ursus arctos horribilis;
    Poema=Puma concolor;
    Rode lynx=Lynx rufus;
    Canadese lynx=Lynx canadensis;
    Grijze vos=Urocyon cinereoargenteus;
    Wasbeer=Procyon lotor;
    Amerikaanse marter=Martes americana;
    Martes caurina;
    Pekan=Pekania pennanti;
    Amerikaanse das=Taxidea taxus;
    Amerikaanse stekelvarken=Erethizon dorsatum;
    Witstaarthert=Odocoileus virginianus;
    Muildierhert=Odocoileus hemionus;
    Wapiti=Cervus canadensis;
    Amerikaanse rode eekhoorn=Tamiasciurus hudsonicus;
    Tamiasciurus douglasii;
    Tamiasciurus fremonti;
    Grijze eekhoorn=Sciurus carolinensis;
    Vosseekhoorn=Sciurus niger;
    Sciurus griseus;
    Sciurus aberti;
    Glaucomys volans;
    Glaucomys sabrinus;
    Glaucomys oregonensis;
    Tamias striatus;
    Neotamias minimus;
    Neotamias amoenus;
    Neotamias townsendii;
    Neotamias quadrimaculatus;
    Neotamias speciosus;
    Neotamias senex;
    Neotamias sonomae;
    Neotamias siskiyou;
    Neotamias ochrogenys;
    Neotamias ruficaudus;
    Neotamias dorsalis;
    Neotamias cinereicollis;
    Peromyscus maniculatus;
    Peromyscus leucopus;
    Peromyscus boylii;
    Peromyscus californicus;
    Peromyscus truei;
    Peromyscus gossypinus;
    Peromyscus nasutus;
    Peromyscus aztecus;
    Peromyscus difficilis;
    Neotoma cinerea;
    Neotoma floridana;
    Neotoma fuscipes;
    Neotoma macrotis;
    Myodes gapperi;
    Myodes californicus;
    Myodes rutilus;
    Myodes occidentalis;
    Phenacomys intermedius;
    Arborimus longicaudus;
    Arborimus pomo;
    Arborimus albipes;
    Sorex cinereus;
    Sorex fumeus;
    Sorex hoyi;
    Sorex monticola;
    Sorex trowbridgii;
    Sorex vagrans;
    Sorex pacificus;
    Sorex sonomae;
    Sorex bendirii;
    Blarina brevicauda;
    Blarina carolinensis;
    Blarina hylophaga
  `, [20], 75);

  // De Amerikaanse das is vooral een dier van open gebieden.
  verwijderKoppeling("Amerikaanse das", [6]);

  // ============================================================
  // AZIATISCHE BOSDIEREN
  // ============================================================

  bosdieren(`
    Tijger=Panthera tigris;
    Aziatische zwarte beer=Ursus thibetanus;
    Lippenbeer=Melursus ursinus;
    Maleise beer=Helarctos malayanus;
    Reuzenpanda=Ailuropoda melanoleuca;
    Rode panda=Ailurus fulgens;
    Nevelpanter=Neofelis nebulosa;
    Neofelis diardi;
    Aziatische goudkat=Catopuma temminckii;
    Borneogoudkat=Catopuma badia;
    Marmerkat=Pardofelis marmorata;
    Bengaalse tijgerkat=Prionailurus bengalensis;
    Vissende kat=Prionailurus viverrinus;
    Prionailurus planiceps;
    Prionailurus rubiginosus;
    Dhole=Cuon alpinus;
    Wasbeerhond=Nyctereutes procyonoides;
    Japanse wasbeerhond=Nyctereutes viverrinus;
    Sabelmarter=Martes zibellina;
    Japanse marter=Martes melampus;
    Geelkeelmarter=Martes flavigula;
    Martes gwatkinsii;
    Melogale moschata;
    Melogale personata;
    Melogale orientalis;
    Melogale everetti;
    Melogale cucphuongensis;
    Viverra zibetha;
    Viverra tangalunga;
    Viverra megaspila;
    Viverra civettina;
    Viverricula indica;
    Binturong=Arctictis binturong;
    Paradoxurus hermaphroditus;
    Paradoxurus jerdoni;
    Paradoxurus zeylonensis;
    Paguma larvata;
    Arctogalidia trivirgata;
    Macrogalidia musschenbroekii;
    Hemigalus derbyanus;
    Chrotogale owstoni;
    Cynogale bennettii;
    Prionodon linsang;
    Prionodon pardicolor;
    Maleise tapir=Tapirus indicus;
    Sumatraanse neushoorn=Dicerorhinus sumatrensis;
    Javaanse neushoorn=Rhinoceros sondaicus;
    Gaur=Bos gaurus;
    Banteng=Bos javanicus;
    Bos sauveli;
    Anoabuffel=Bubalus depressicornis;
    Bubalus quarlesi;
    Tamaroe=Bubalus mindorensis;
    Sambar=Rusa unicolor;
    Rusa timorensis;
    Rusa marianna;
    Rusa alfredi;
    Axishert=Axis axis;
    Axis porcinus;
    Axis kuhlii;
    Axis calamianensis;
    Sikahert=Cervus nippon;
    Elaphodus cephalophus;
    Muntiacus muntjak;
    Muntiacus reevesi;
    Muntiacus vaginalis;
    Muntiacus atherodes;
    Muntiacus crinifrons;
    Muntiacus feae;
    Muntiacus gongshanensis;
    Muntiacus putaoensis;
    Muntiacus rooseveltorum;
    Muntiacus truongsonensis;
    Muntiacus vuquangensis;
    Tragulus javanicus;
    Tragulus kanchil;
    Tragulus napu;
    Tragulus nigricans;
    Tragulus versicolor;
    Moschiola indica;
    Moschiola meminna;
    Moschiola kathygre
  `, [20], 75);

  // Kouprey heeft een onzekere actuele status.
  // Niet zonder controle als uitgestorven classificeren.

  // ============================================================
  // ZUID-AMERIKAANSE JUNGLEZOOGDIEREN
  // ============================================================

  jungledieren(`
    Jaguar=Panthera onca;
    Ocelot=Leopardus pardalis;
    Margay=Leopardus wiedii;
    Jaguarundi=Herpailurus yagouaroundi;
    Leopardus tigrinus;
    Leopardus guttulus;
    Leopardus guigna;
    Bushhond=Speothos venaticus;
    Atelocynus microtis;
    Kinkajoe=Potos flavus;
    Olingo=Bassaricyon gabbii;
    Bassaricyon alleni;
    Bassaricyon medius;
    Olinguito=Bassaricyon neblina;
    Neusbeer=Nasua nasua;
    Nasua narica;
    Nasuella olivacea;
    Nasuella meridensis;
    Eira barbara;
    Galictis vittata;
    Galictis cuja;
    Mustela africana;
    Mustela felipei;
    Tapir=Tapirus terrestris;
    Bairdts tapir=Tapirus bairdii;
    Bergtapir=Tapirus pinchaque;
    Halsbandpekari=Pecari tajacu;
    Witlippekari=Tayassu pecari;
    Mazama americana;
    Mazama nemorivaga;
    Mazama temama;
    Mazama nana;
    Mazama bororo;
    Mazama rufina;
    Pudu puda;
    Pudu mephistophiles;
    Agouti=Dasyprocta;
    Dasyprocta leporina;
    Dasyprocta punctata;
    Dasyprocta fuliginosa;
    Dasyprocta mexicana;
    Dasyprocta azarae;
    Dasyprocta prymnolopha;
    Dasyprocta variegata;
    Dasyprocta kalinowskii;
    Dasyprocta ruatanica;
    Dasyprocta coibae;
    Acouchi=Myoprocta acouchy;
    Myoprocta pratti;
    Paca=Cuniculus paca;
    Cuniculus taczanowskii;
    Coendou prehensilis;
    Coendou bicolor;
    Coendou quichua;
    Coendou mexicanus;
    Coendou spinosus;
    Coendou melanurus;
    Coendou pruinosus;
    Coendou roosmalenorum;
    Coendou rufescens;
    Coendou ichillus;
    Coendou nycthemera;
    Coendou speratus
  `, [20], 80);

  // ============================================================
  // LUIAARDS EN MIERENETERS
  // ============================================================

  jungledieren(`
    Tweevingerige luiaard=Choloepus didactylus;
    Hoffmannluiaard=Choloepus hoffmanni;
    Drievingerige luiaard=Bradypus tridactylus;
    Bruinkeelluiaard=Bradypus variegatus;
    Kraagluiaard=Bradypus torquatus;
    Dwergluiaard=Bradypus pygmaeus
  `, [20,30,31,35], 70);

  jungledieren(`
    Tamandua tetradactyla;
    Tamandua mexicana;
    Dwergmiereneter=Cyclopes didactylus;
    Cyclopes dorsalis;
    Cyclopes ida;
    Cyclopes thomasi;
    Cyclopes rufus;
    Cyclopes xinguensis;
    Cyclopes catellus
  `, [20,31,35], 80);

  // ============================================================
  // ZUID-AMERIKAANSE APEN
  // ============================================================

  jungledieren(`
    Zwarte brulaap=Alouatta caraya;
    Rode brulaap=Alouatta seniculus;
    Alouatta palliata;
    Alouatta pigra;
    Alouatta belzebul;
    Alouatta guariba;
    Alouatta macconnelli;
    Alouatta nigerrima;
    Alouatta sara;
    Alouatta discolor;
    Alouatta puruensis;
    Alouatta juara;
    Ateles paniscus;
    Ateles belzebuth;
    Ateles chamek;
    Ateles fusciceps;
    Ateles geoffroyi;
    Ateles hybridus;
    Ateles marginatus;
    Lagothrix lagotricha;
    Lagothrix cana;
    Lagothrix lugens;
    Lagothrix poeppigii;
    Lagothrix flavicauda;
    Brachyteles arachnoides;
    Brachyteles hypoxanthus;
    Cebus capucinus;
    Cebus imitator;
    Cebus albifrons;
    Cebus olivaceus;
    Cebus kaapori;
    Cebus unicolor;
    Cebus cuscinus;
    Cebus yuracus;
    Cebus aequatorialis;
    Cebus malitiosus;
    Cebus versicolor;
    Cebus cesarae;
    Sapajus apella;
    Sapajus libidinosus;
    Sapajus robustus;
    Sapajus xanthosternos;
    Sapajus flavius;
    Sapajus nigritus;
    Sapajus cay;
    Saimiri sciureus;
    Saimiri boliviensis;
    Saimiri oerstedii;
    Saimiri ustus;
    Saimiri vanzolinii;
    Saimiri cassiquiarensis;
    Saimiri macrodon;
    Saimiri collinsi;
    Aotus trivirgatus;
    Aotus lemurinus;
    Aotus nancymaae;
    Aotus azarae;
    Aotus nigriceps;
    Aotus vociferans;
    Aotus griseimembra;
    Aotus zonalis;
    Aotus brumbacki;
    Aotus jorgehernandezi;
    Pithecia pithecia;
    Pithecia monachus;
    Pithecia irrorata;
    Pithecia albicans;
    Pithecia aequatorialis;
    Chiropotes satanas;
    Chiropotes chiropotes;
    Chiropotes utahickae;
    Chiropotes sagulatus;
    Chiropotes albinasus;
    Cacajao calvus;
    Cacajao melanocephalus;
    Cacajao hosomi;
    Cacajao ayresi;
    Callicebus personatus;
    Callicebus nigrifrons;
    Callicebus barbarabrownae;
    Callicebus melanochir;
    Cheracebus torquatus;
    Cheracebus lucifer;
    Cheracebus lugens;
    Cheracebus medemi;
    Plecturocebus cupreus;
    Plecturocebus moloch;
    Plecturocebus brunneus;
    Plecturocebus donacophilus;
    Plecturocebus oenanthe;
    Plecturocebus caligatus;
    Plecturocebus dubius;
    Plecturocebus hoffmannsi;
    Plecturocebus discolor;
    Plecturocebus ornatus;
    Plecturocebus pallescens;
    Plecturocebus modestus;
    Plecturocebus olallae;
    Plecturocebus urubambensis;
    Plecturocebus caquetensis;
    Plecturocebus vieirai;
    Plecturocebus miltoni;
    Plecturocebus bernhardi
  `, [20,31,35], 85);

  // ============================================================
  // KL A UWAAPJES
  // ============================================================

  jungledieren(`
    Dwergzijdeaapje=Cebuella pygmaea;
    Cebuella niveiventris;
    Callithrix jacchus;
    Callithrix penicillata;
    Callithrix geoffroyi;
    Callithrix aurita;
    Callithrix flaviceps;
    Callithrix kuhlii;
    Mico argentatus;
    Mico humeralifer;
    Mico chrysoleucos;
    Mico emiliae;
    Mico intermedius;
    Mico leucippe;
    Mico manicorensis;
    Mico marcai;
    Mico mauesi;
    Mico melanurus;
    Mico nigriceps;
    Mico rondoni;
    Mico saterei;
    Mico acariensis;
    Mico munduruku;
    Callibella humilis;
    Saguinus imperator;
    Saguinus midas;
    Saguinus bicolor;
    Saguinus martinsi;
    Saguinus mystax;
    Saguinus inustus;
    Saguinus niger;
    Saguinus ursulus;
    Leontocebus fuscicollis;
    Leontocebus weddelli;
    Leontocebus lagonotus;
    Leontocebus nigricollis;
    Leontocebus tripartitus;
    Leontocebus illigeri;
    Leontocebus leucogenys;
    Leontocebus nigrifrons;
    Leontocebus cruzlimai;
    Oedipomidas oedipus=Saguinus oedipus;
    Oedipomidas geoffroyi=Saguinus geoffroyi;
    Oedipomidas leucopus=Saguinus leucopus;
    Gouden leeuwaapje=Leontopithecus rosalia;
    Leontopithecus chrysomelas;
    Leontopithecus chrysopygus;
    Leontopithecus caissara;
    Goeldiaapje=Callimico goeldii
  `, [20,31,35], 85);

  // ============================================================
  // AZIATISCHE JUNGLEPRIMATEN
  // ============================================================

  jungledieren(`
    Borneose orang-oetan=Pongo pygmaeus;
    Sumatraanse orang-oetan=Pongo abelii;
    Tapanuli-orang-oetan=Pongo tapanuliensis;
    Siamang=Symphalangus syndactylus;
    Hylobates lar;
    Hylobates agilis;
    Hylobates moloch;
    Hylobates muelleri;
    Hylobates pileatus;
    Hylobates klossii;
    Hylobates albibarbis;
    Hylobates abbotti;
    Hylobates funereus;
    Nomascus concolor;
    Nomascus leucogenys;
    Nomascus siki;
    Nomascus gabriellae;
    Nomascus annamensis;
    Nomascus nasutus;
    Nomascus hainanus;
    Hoolock hoolock;
    Hoolock leuconedys;
    Hoolock tianxing;
    Neusaap=Nasalis larvatus;
    Simias concolor;
    Trachypithecus obscurus;
    Trachypithecus cristatus;
    Trachypithecus auratus;
    Trachypithecus mauritius;
    Trachypithecus germaini;
    Trachypithecus margarita;
    Trachypithecus phayrei;
    Trachypithecus crepusculus;
    Trachypithecus barbei;
    Trachypithecus pileatus;
    Trachypithecus shortridgei;
    Trachypithecus geei;
    Trachypithecus francoisi;
    Trachypithecus delacouri;
    Trachypithecus laotum;
    Trachypithecus hatinhensis;
    Trachypithecus poliocephalus;
    Trachypithecus ebenus;
    Presbytis melalophos;
    Presbytis femoralis;
    Presbytis rubicunda;
    Presbytis comata;
    Presbytis thomasi;
    Presbytis hosei;
    Presbytis frontata;
    Presbytis chrysomelas;
    Presbytis siamensis;
    Presbytis potenziani;
    Presbytis siberu;
    Presbytis mitrata;
    Pygathrix nemaeus;
    Pygathrix nigripes;
    Pygathrix cinerea;
    Macaca fascicularis;
    Macaca nemestrina;
    Macaca leonina;
    Macaca silenus;
    Macaca nigra;
    Macaca nigrescens;
    Macaca maura;
    Macaca ochreata;
    Macaca tonkeana;
    Macaca hecki;
    Macaca brunnescens;
    Macaca pagensis;
    Macaca siberu;
    Nycticebus coucang;
    Nycticebus bengalensis;
    Nycticebus javanicus;
    Nycticebus menagensis;
    Nycticebus kayan;
    Nycticebus bancanus;
    Nycticebus borneanus;
    Xanthonycticebus pygmaeus;
    Loris tardigradus;
    Loris lydekkerianus;
    Tarsius tarsier;
    Tarsius dentatus;
    Tarsius lariang;
    Tarsius pelengensis;
    Tarsius pumilus;
    Tarsius sangirensis;
    Tarsius tumpara;
    Tarsius wallacei;
    Tarsius supriatnai;
    Tarsius spectrumgurskyae;
    Cephalopachus bancanus;
    Carlito syrichta
  `, [20,31,35], 85);

  // ============================================================
  // BOOMKANGOEROES
  // ============================================================

  jungledieren(`
    Dendrolagus lumholtzi;
    Dendrolagus bennettianus;
    Dendrolagus ursinus;
    Dendrolagus inustus;
    Dendrolagus goodfellowi;
    Dendrolagus matschiei;
    Dendrolagus dorianus;
    Dendrolagus stellarum;
    Dendrolagus mbaiso;
    Dendrolagus scottae;
    Dendrolagus spadix;
    Dendrolagus pulcherrimus;
    Dendrolagus notatus
  `, [20,31,35], 85);

  // ============================================================
  // TROPISCHE BOSVOGELS - TOEKANS
  // ============================================================

  jungledieren(`
    Reuzentoekan=Ramphastos toco;
    Ramphastos sulfuratus;
    Ramphastos tucanus;
    Ramphastos vitellinus;
    Ramphastos ambiguus;
    Ramphastos brevis;
    Ramphastos dicolorus;
    Pteroglossus aracari;
    Pteroglossus castanotis;
    Pteroglossus inscriptus;
    Pteroglossus viridis;
    Pteroglossus azara;
    Pteroglossus bitorquatus;
    Pteroglossus pluricinctus;
    Pteroglossus torquatus;
    Pteroglossus frantzii;
    Pteroglossus sanguineus;
    Pteroglossus beauharnaisii;
    Pteroglossus bailloni;
    Selenidera maculirostris;
    Selenidera culik;
    Selenidera piperivora;
    Selenidera reinwardtii;
    Selenidera nattereri;
    Selenidera spectabilis;
    Aulacorhynchus prasinus;
    Aulacorhynchus sulcatus;
    Aulacorhynchus derbianus;
    Aulacorhynchus haematopygus;
    Aulacorhynchus coeruleicinctis;
    Aulacorhynchus atrogularis;
    Aulacorhynchus albivitta;
    Aulacorhynchus whitelianus;
    Andigena hypoglauca;
    Andigena laminirostris;
    Andigena cucullata;
    Andigena nigrirostris
  `, [2,7,18,22,31], 85);

  // ============================================================
  // TROPISCHE PAPEGAAIEN
  // ============================================================

  jungledieren(`
    Geelvleugelara=Ara macao;
    Blauwgele ara=Ara ararauna;
    Groenvleugelara=Ara chloropterus;
    Ara militaris;
    Ara ambiguus;
    Ara severus;
    Ara rubrogenys;
    Ara glaucogularis;
    Primolius maracana;
    Primolius couloni;
    Primolius auricollis;
    Orthopsittaca manilatus;
    Diopsittaca nobilis;
    Amazona amazonica;
    Amazona aestiva;
    Amazona ochrocephala;
    Amazona farinosa;
    Amazona autumnalis;
    Amazona festiva;
    Amazona brasiliensis;
    Amazona dufresniana;
    Amazona rhodocorytha;
    Amazona pretrei;
    Amazona vinacea;
    Amazona tucumana;
    Amazona viridigenalis;
    Amazona finschi;
    Amazona albifrons;
    Amazona xantholora;
    Amazona auropalliata;
    Amazona oratrix;
    Amazona agilis;
    Amazona collaria;
    Amazona vittata;
    Amazona ventralis;
    Amazona versicolor;
    Amazona arausiaca;
    Amazona guildingii;
    Amazona imperialis;
    Amazona barbadensis;
    Pionus menstruus;
    Pionus maximiliani;
    Pionus sordidus;
    Pionus senilis;
    Pionus chalcopterus;
    Pionus fuscus;
    Pionus tumultuosus;
    Pionus seniloides;
    Pionites melanocephalus;
    Pionites leucogaster;
    Pionopsitta pileata;
    Pyrilia caica;
    Pyrilia pulchra;
    Pyrilia pyrilia;
    Pyrilia barrabandi;
    Pyrilia haematotis;
    Pyrilia manni;
    Pyrilia vulturina;
    Brotogeris cyanoptera;
    Brotogeris chiriri;
    Brotogeris versicolurus;
    Brotogeris jugularis;
    Brotogeris tirica;
    Brotogeris sanctithomae;
    Brotogeris pyrrhoptera;
    Brotogeris chrysoptera;
    Pyrrhura molinae;
    Pyrrhura frontalis;
    Pyrrhura picta;
    Pyrrhura leucotis;
    Pyrrhura perlata;
    Pyrrhura rupicola;
    Pyrrhura melanura;
    Pyrrhura cruentata;
    Pyrrhura devillei;
    Pyrrhura viridicata;
    Pyrrhura orcesi;
    Pyrrhura egregia;
    Pyrrhura calliptera;
    Pyrrhura hoematotis;
    Pyrrhura rhodocephala;
    Pyrrhura albipectus;
    Pyrrhura pfrimeri;
    Pyrrhura griseipectus;
    Pyrrhura lepida;
    Pyrrhura amazonum;
    Pyrrhura lucianii;
    Pyrrhura roseifrons;
    Pyrrhura peruviana
  `, [2,7,18,22,31,35], 85);

  // Sommige papegaaien leven voornamelijk in droge gebieden.
  verwijderKoppeling("Ara rubrogenys", [12]);
  verwijderKoppeling("Amazona barbadensis", [12]);

  // ============================================================
  // PARADIJSVOGELS
  // ============================================================

  jungledieren(`
    Paradisaea apoda;
    Paradisaea minor;
    Paradisaea raggiana;
    Paradisaea rubra;
    Paradisaea guilielmi;
    Paradisaea decora;
    Paradisornis rudolphi;
    Cicinnurus regius;
    Diphyllodes magnificus;
    Diphyllodes respublica;
    Seleucidis melanoleucus;
    Semioptera wallacii;
    Ptiloris magnificus;
    Ptiloris intercedens;
    Ptiloris victoriae;
    Ptiloris paradiseus;
    Lophorina superba;
    Lophorina niedda;
    Lophorina minor;
    Astrapia nigra;
    Astrapia splendidissima;
    Astrapia mayeri;
    Astrapia stephaniae;
    Astrapia rothschildi;
    Parotia sefilata;
    Parotia lawesii;
    Parotia helenae;
    Parotia carolae;
    Parotia berlepschi;
    Parotia wahnesi;
    Epimachus fastosus;
    Epimachus meyeri;
    Drepanornis albertisi;
    Drepanornis bruijnii;
    Pteridophora alberti;
    Lycocorax pyrrhopterus;
    Lycocorax obiensis;
    Manucodia ater;
    Manucodia chalybatus;
    Manucodia comrii;
    Manucodia jobiensis;
    Phonygammus keraudrenii
  `, [2,7,18,22,31], 90);

  // ============================================================
  // EUROPESE BOSVOGELS
  // ============================================================

  bosdieren(`
    Grote bonte specht=Dendrocopos major;
    Middelste bonte specht=Dendrocoptes medius;
    Kleine bonte specht=Dryobates minor;
    Groene specht=Picus viridis;
    Grijskopspecht=Picus canus;
    Zwarte specht=Dryocopus martius;
    Witrugspecht=Dendrocopos leucotos;
    Drieteenspecht=Picoides tridactylus;
    Syrische bonte specht=Dendrocopos syriacus;
    Draaihals=Jynx torquilla;
    Boomklever=Sitta europaea;
    Sitta neumayer;
    Sitta krueperi;
    Sitta whiteheadi;
    Boomkruiper=Certhia brachydactyla;
    Taigaboomkruiper=Certhia familiaris;
    Goudhaan=Regulus regulus;
    Vuurgoudhaan=Regulus ignicapilla;
    Koolmees=Parus major;
    Pimpelmees=Cyanistes caeruleus;
    Zwarte mees=Periparus ater;
    Kuifmees=Lophophanes cristatus;
    Glanskop=Poecile palustris;
    Matkop=Poecile montanus;
    Staartmees=Aegithalos caudatus;
    Roodborst=Erithacus rubecula;
    Zanglijster=Turdus philomelos;
    Grote lijster=Turdus viscivorus;
    Merel=Turdus merula;
    Koperwiek=Turdus iliacus;
    Kramsvogel=Turdus pilaris;
    Beflijster=Turdus torquatus;
    Vink=Fringilla coelebs;
    Keep=Fringilla montifringilla;
    Appelvink=Coccothraustes coccothraustes;
    Kruisbek=Loxia curvirostra;
    Grote kruisbek=Loxia pytyopsittacus;
    Witbandkruisbek=Loxia leucoptera;
    Goudvink=Pyrrhula pyrrhula;
    Sijs=Spinus spinus;
    Heggenmus=Prunella modularis;
    Winterkoning=Troglodytes troglodytes;
    Tjiftjaf=Phylloscopus collybita;
    Fitis=Phylloscopus trochilus;
    Fluiter=Phylloscopus sibilatrix;
    Bergfluiter=Phylloscopus bonelli;
    Balkanfluiter=Phylloscopus orientalis;
    Grauwe vliegenvanger=Muscicapa striata;
    Bonte vliegenvanger=Ficedula hypoleuca;
    Withalsvliegenvanger=Ficedula albicollis;
    Kleine vliegenvanger=Ficedula parva;
    Balkanvliegenvanger=Ficedula semitorquata;
    Zwartkop=Sylvia atricapilla;
    Tuinfluiter=Sylvia borin;
    Wielewaal=Oriolus oriolus;
    Vlaamse gaai=Garrulus glandarius;
    Notenkraker=Nucifraga caryocatactes;
    Raaf=Corvus corax;
    Houtduif=Columba palumbus;
    Holenduif=Columba oenas;
    Koekoek=Cuculus canorus;
    Bosuil=Strix aluco;
    Oeraluil=Strix uralensis;
    Laplanduil=Strix nebulosa;
    Ruigpootuil=Aegolius funereus;
    Dwerguil=Glaucidium passerinum;
    Ransuil=Asio otus;
    Havik=Accipiter gentilis;
    Sperwer=Accipiter nisus;
    Wespendief=Pernis apivorus;
    Buizerd=Buteo buteo;
    Boomvalk=Falco subbuteo;
    Auerhoen=Tetrao urogallus;
    Korhoen=Lyrurus tetrix;
    Hazelhoen=Tetrastes bonasia
  `, [7,18,22], 60);

  // Auerhoenders en andere hoenders kunnen vliegen,
  // maar krijgen geen automatische vliegsnelheidskoppeling.

  // ============================================================
  // NOORD-AMERIKAANSE BOSVOGELS - SPECHTEN
  // ============================================================

  bosdieren(`
    Dryocopus pileatus;
    Dryocopus lineatus;
    Campephilus principalis;
    Campephilus imperialis;
    Melanerpes erythrocephalus;
    Melanerpes carolinus;
    Melanerpes formicivorus;
    Melanerpes lewis;
    Melanerpes uropygialis;
    Melanerpes aurifrons;
    Melanerpes hypopolius;
    Melanerpes chrysauchen;
    Sphyrapicus varius;
    Sphyrapicus nuchalis;
    Sphyrapicus ruber;
    Sphyrapicus thyroideus;
    Dryobates pubescens;
    Dryobates villosus;
    Dryobates scalaris;
    Dryobates nuttallii;
    Dryobates borealis;
    Dryobates arizonae;
    Picoides dorsalis;
    Picoides arcticus;
    Colaptes auratus;
    Colaptes chrysoides;
    Colaptes rubiginosus;
    Colaptes punctigula;
    Colaptes melanochloros
  `, [2,7,18,22,35], 85);

  // Niet automatisch als uitgestorven markeren.
  // De actuele status van deze soorten vereist controle.
  verwijderKoppeling("Campephilus principalis", [6]);
  verwijderKoppeling("Campephilus imperialis", [6]);

  // ============================================================
  // NOORD-AMERIKAANSE BOSZANGVOGELS
  // ============================================================

  bosdieren(`
    Poecile atricapillus;
    Poecile carolinensis;
    Poecile gambeli;
    Poecile hudsonicus;
    Poecile rufescens;
    Poecile cinctus;
    Baeolophus bicolor;
    Baeolophus atricristatus;
    Baeolophus inornatus;
    Baeolophus ridgwayi;
    Baeolophus wollweberi;
    Sitta carolinensis;
    Sitta canadensis;
    Sitta pygmaea;
    Sitta pusilla;
    Certhia americana;
    Regulus satrapa;
    Corthylio calendula;
    Catharus guttatus;
    Catharus ustulatus;
    Catharus minimus;
    Catharus fuscescens;
    Catharus bicknelli;
    Hylocichla mustelina;
    Turdus migratorius;
    Ixoreus naevius;
    Ridgwayia pinicola;
    Myadestes townsendi;
    Myadestes occidentalis;
    Vireo olivaceus;
    Vireo solitarius;
    Vireo cassinii;
    Vireo plumbeus;
    Vireo flavifrons;
    Vireo gilvus;
    Vireo philadelphicus;
    Vireo huttoni;
    Vireo bellii;
    Vireo griseus;
    Vireo atricapilla;
    Vireo vicinior;
    Vireo latimeri;
    Vireo altiloquus;
    Vireo magister;
    Setophaga ruticilla;
    Setophaga coronata;
    Setophaga petechia;
    Setophaga pensylvanica;
    Setophaga caerulescens;
    Setophaga virens;
    Setophaga fusca;
    Setophaga castanea;
    Setophaga striata;
    Setophaga magnolia;
    Setophaga tigrina;
    Setophaga palmarum;
    Setophaga pinus;
    Setophaga discolor;
    Setophaga dominica;
    Setophaga occidentalis;
    Setophaga townsendi;
    Setophaga nigrescens;
    Setophaga graciae;
    Setophaga chrysoparia;
    Setophaga cerulea;
    Setophaga americana;
    Setophaga pitiayumi;
    Setophaga citrina;
    Setophaga discolor;
    Setophaga kirtlandii;
    Mniotilta varia;
    Seiurus aurocapilla;
    Parkesia noveboracensis;
    Parkesia motacilla;
    Geothlypis trichas;
    Geothlypis formosa;
    Geothlypis philadelphia;
    Geothlypis tolmiei;
    Cardellina canadensis;
    Cardellina pusilla;
    Cardellina rubrifrons;
    Cardellina rubra;
    Myioborus pictus;
    Myioborus miniatus;
    Vermivora cyanoptera;
    Vermivora chrysoptera;
    Oreothlypis peregrina;
    Leiothlypis celata;
    Leiothlypis ruficapilla;
    Leiothlypis virginiae;
    Leiothlypis crissalis;
    Leiothlypis luciae;
    Helmitheros vermivorum;
    Limnothlypis swainsonii;
    Protonotaria citrea
  `, [2,7,18,22], 90);

  // ============================================================
  // EUROPESE BOSVLINDERS
  // ============================================================

  bosdieren(`
    Bont zandoogje=Pararge aegeria;
    Grote weerschijnvlinder=Apatura iris;
    Kleine weerschijnvlinder=Apatura ilia;
    Grote ijsvogelvlinder=Limenitis populi;
    Kleine ijsvogelvlinder=Limenitis camilla;
    Blauwe ijsvogelvlinder=Limenitis reducta;
    Keizersmantel=Argynnis paphia;
    Grote parelmoervlinder=Speyeria aglaja;
    Zilvervlek=Boloria euphrosyne;
    Zilveren maan=Boloria selene;
    Purperstreepparelmoervlinder=Brenthis ino;
    Rouwmantel=Nymphalis antiopa;
    Grote vos=Nymphalis polychloros;
    Oostelijke vos=Nymphalis xanthomelas;
    Gehakkelde aurelia=Polygonia c-album;
    Citroenvlinder=Gonepteryx rhamni;
    Boomblauwtje=Celastrina argiolus;
    Eikenpage=Favonius quercus;
    Bruine eikenpage=Satyrium ilicis;
    Iepenpage=Satyrium w-album;
    Sleedoornpage=Thecla betulae;
    Pruimenpage=Satyrium pruni;
    Groentje=Callophrys rubi;
    Boswitje=Leptidea sinapis;
    Leptidea juvernica;
    Leptidea reali;
    Bosrandparelmoervlinder=Fabriciana adippe;
    Erebia ligea;
    Erebia euryale;
    Lopinga achine;
    Lasiommata maera;
    Coenonympha arcania;
    Coenonympha hero;
    Heteropterus morpheus;
    Carterocephalus palaemon;
    Carterocephalus silvicola
  `, [2,7], 75);

  // ============================================================
  // TROPISCHE JUNGLEVLINDERS
  // ============================================================

  jungledieren(`
    Morpho menelaus;
    Morpho peleides;
    Morpho helenor;
    Morpho didius;
    Morpho rhetenor;
    Morpho cypris;
    Morpho achilles;
    Morpho amathonte;
    Morpho anaxibia;
    Morpho aega;
    Morpho adonis;
    Morpho aurora;
    Morpho catenarius;
    Morpho deidamia;
    Morpho epistrophus;
    Morpho eugenia;
    Morpho godartii;
    Morpho hercules;
    Morpho hecuba;
    Morpho laertes;
    Morpho luna;
    Morpho marcus;
    Morpho niepelti;
    Morpho portis;
    Morpho sulkowskyi;
    Morpho telemachus;
    Morpho theseus;
    Morpho polyphemus;
    Caligo eurilochus;
    Caligo memnon;
    Caligo atreus;
    Caligo illioneus;
    Caligo idomeneus;
    Caligo teucer;
    Caligo brasiliensis;
    Caligo beltrao;
    Caligo martia;
    Caligo oileus;
    Caligo placidianus;
    Caligo prometheus;
    Caligo uranus;
    Heliconius erato;
    Heliconius melpomene;
    Heliconius charithonia;
    Heliconius sara;
    Heliconius doris;
    Heliconius hecale;
    Heliconius ismenius;
    Heliconius cydno;
    Heliconius pachinus;
    Heliconius hewitsoni;
    Heliconius sapho;
    Heliconius eleuchia;
    Heliconius antiochus;
    Heliconius wallacei;
    Heliconius burneyi;
    Heliconius numata;
    Heliconius ethilla;
    Heliconius pardalinus;
    Heliconius elevatus;
    Heliconius atthis;
    Heliconius besckei;
    Heliconius nattereri;
    Heliconius hermathena;
    Heliconius himera;
    Heliconius clysonymus;
    Heliconius hortense;
    Heliconius telesiphe;
    Heliconius hecalesia;
    Heliconius ricini;
    Heliconius aoede;
    Heliconius demeter;
    Heliconius astraea;
    Heliconius xanthocles;
    Heliconius timareta;
    Heliconius heurippa;
    Heliconius tristero;
    Heliconius leucadia;
    Heliconius congener;
    Heliconius hierax;
    Heliconius egeria;
    Greta oto;
    Greta andromica;
    Greta morgane;
    Greta polissena;
    Greta annette;
    Greta diaphanus;
    Greta clavijoi;
    Greta libethris;
    Ithomia drymo;
    Ithomia agnosia;
    Ithomia salapia;
    Ithomia iphianassa;
    Ithomia patilla;
    Ithomia heraldica;
    Ithomia lagusa;
    Ithomia diasia;
    Mechanitis polymnia;
    Mechanitis lysimnia;
    Mechanitis menapis;
    Mechanitis mazaeus
  `, [2,7], 85);

  // ============================================================
  // BOSKEVERS EN DOODHOUTKEVERS
  // ============================================================

  bosdieren(`
    Vliegend hert=Lucanus cervus;
    Lucanus capreolus;
    Lucanus elaphus;
    Lucanus maculifemoratus;
    Lucanus formosanus;
    Lucanus swinhoei;
    Lucanus placidus;
    Lucanus tetraodon;
    Lucanus ibericus;
    Dorcus parallelipipedus;
    Dorcus titanus;
    Dorcus hopei;
    Dorcus rectus;
    Dorcus curvidens;
    Dorcus antaeus;
    Dorcus bucephalus;
    Dorcus alcides;
    Dorcus grandis;
    Dorcus metacostatus;
    Dorcus purpurascens;
    Prosopocoilus giraffa;
    Prosopocoilus inclinatus;
    Prosopocoilus astacoides;
    Prosopocoilus bison;
    Prosopocoilus savagei;
    Prosopocoilus occipitalis;
    Prosopocoilus suturalis;
    Cyclommatus metallifer;
    Cyclommatus elaphus;
    Cyclommatus imperator;
    Cyclommatus tarandus;
    Odontolabis cuvera;
    Odontolabis femoralis;
    Odontolabis dalmanni;
    Odontolabis mouhoti;
    Odontolabis brookeana;
    Chalcosoma atlas;
    Chalcosoma chiron;
    Chalcosoma moellenkampi;
    Dynastes hercules;
    Dynastes neptunus;
    Dynastes satanas;
    Dynastes tityus;
    Dynastes grantii;
    Megasoma elephas;
    Megasoma actaeon;
    Megasoma mars;
    Megasoma gyas;
    Megasoma janus;
    Megasoma thersites;
    Xylotrupes gideon;
    Xylotrupes ulysses;
    Xylotrupes socrates;
    Xylotrupes pubescens;
    Oryctes nasicornis;
    Oryctes rhinoceros;
    Oryctes boas;
    Oryctes monoceros;
    Oryctes agamemnon;
    Oryctes centaurus;
    Osmoderma eremita;
    Osmoderma barnabita;
    Osmoderma cristinae;
    Osmoderma italicum;
    Osmoderma scabra;
    Gnorimus nobilis;
    Gnorimus variabilis;
    Trichius fasciatus;
    Trichius zonatus;
    Trichius sexualis;
    Protaetia aeruginosa;
    Protaetia fieberi;
    Protaetia cuprea;
    Cetonia aurata;
    Goliathus goliatus;
    Goliathus regius;
    Goliathus orientalis;
    Goliathus cacicus;
    Goliathus albosignatus;
    Mecynorhina torquata;
    Mecynorhina polyphemus;
    Mecynorhina ugandensis;
    Dicronorhina derbyana;
    Dicronorhina micans;
    Eudicella gralli;
    Eudicella euthalia;
    Eudicella smithii;
    Eudicella schultzeorum
  `, [7], 85);

  // ============================================================
  // BOSBOKTORREN
  // ============================================================

  bosdieren(`
    Cerambyx cerdo;
    Cerambyx scopolii;
    Cerambyx miles;
    Cerambyx velutinus;
    Cerambyx welensii;
    Rosalia alpina;
    Rosalia batesi;
    Rosalia coelestis;
    Rosalia funebris;
    Prionus coriarius;
    Prionus californicus;
    Prionus laticollis;
    Prionus imbricornis;
    Ergates faber;
    Tragosoma depsarium;
    Acanthocinus aedilis;
    Acanthocinus griseus;
    Acanthocinus reticulatus;
    Acanthocinus obsoletus;
    Monochamus sutor;
    Monochamus galloprovincialis;
    Monochamus sartor;
    Monochamus urussovii;
    Monochamus scutellatus;
    Monochamus notatus;
    Monochamus alternatus;
    Monochamus titillator;
    Monochamus carolinensis;
    Rhagium inquisitor;
    Rhagium mordax;
    Rhagium bifasciatum;
    Rhagium sycophanta;
    Leptura quadrifasciata;
    Leptura aurulenta;
    Leptura aethiops;
    Leptura maculata=Rutpela maculata;
    Stenurella melanura;
    Stenurella bifasciata;
    Stenurella nigra;
    Strangalia attenuata;
    Anastrangalia sanguinolenta;
    Anastrangalia dubia;
    Anastrangalia reyi;
    Anoplodera sexguttata;
    Anoplodera rufipes;
    Anoplodera fulva;
    Stictoleptura rubra;
    Stictoleptura scutellata;
    Stictoleptura cordigera;
    Stictoleptura maculicornis;
    Stictoleptura fulva;
    Pachyta quadrimaculata;
    Gaurotes virginea;
    Oxymirus cursor;
    Spondylis buprestoides;
    Arhopalus rusticus;
    Arhopalus ferus;
    Tetropium castaneum;
    Tetropium fuscum;
    Tetropium gabrieli;
    Callidium violaceum;
    Callidium aeneum;
    Pyrrhidium sanguineum;
    Phymatodes testaceus;
    Phymatodes alni;
    Xylotrechus rusticus;
    Xylotrechus arvicola;
    Xylotrechus antilope;
    Xylotrechus colonus;
    Xylotrechus longitarsis;
    Clytus arietis;
    Clytus rhamni;
    Clytus tropicus;
    Clytus lama;
    Chlorophorus varius;
    Chlorophorus figuratus;
    Chlorophorus sartor;
    Chlorophorus herbstii;
    Plagionotus arcuatus;
    Plagionotus detritus;
    Purpuricenus kaehleri;
    Purpuricenus budensis;
    Purpuricenus desfontainii;
    Saperda carcharias;
    Saperda populnea;
    Saperda scalaris;
    Saperda perforata;
    Saperda octopunctata;
    Saperda punctata;
    Oberea oculata;
    Oberea linearis;
    Oberea pupillata;
    Aegomorphus clavipes;
    Mesosa nebulosa;
    Mesosa curculionoides;
    Pogonocherus hispidus;
    Pogonocherus hispidulus;
    Pogonocherus fasciculatus;
    Pogonocherus decoratus;
    Pogonocherus ovatus;
    Pogonocherus perroudi;
    Exocentrus lusitanus;
    Exocentrus adspersus;
    Exocentrus punctipennis
  `, [7], 85);

  // ============================================================
  // AUSTRALIË - BEKENDE BUIDELDIEREN
  // ============================================================

  australischeDieren(`
    Rode reuzenkangoeroe=Osphranter rufus=Macropus rufus;
    Oostelijke grijze reuzenkangoeroe=Macropus giganteus;
    Westelijke grijze reuzenkangoeroe=Macropus fuliginosus;
    Bergkangoeroe=Osphranter robustus;
    Osphranter antilopinus;
    Osphranter bernardus;
    Moeraswallaby=Wallabia bicolor;
    Bennettwallaby=Notamacropus rufogriseus;
    Notamacropus agilis;
    Notamacropus eugenii;
    Notamacropus parma;
    Notamacropus irma;
    Notamacropus dorsalis;
    Notamacropus parryi;
    Quokka=Setonix brachyurus;
    Petrogale penicillata;
    Petrogale xanthopus;
    Petrogale assimilis;
    Petrogale brachyotis;
    Petrogale burbidgei;
    Petrogale coenensis;
    Petrogale concinna;
    Petrogale godmani;
    Petrogale herberti;
    Petrogale inornata;
    Petrogale lateralis;
    Petrogale mareeba;
    Petrogale persephone;
    Petrogale purpureicollis;
    Petrogale rothschildi;
    Petrogale sharmani;
    Lagorchestes conspicillatus;
    Lagorchestes hirsutus;
    Lagostrophus fasciatus;
    Onychogalea fraenata;
    Onychogalea unguifera;
    Potorous tridactylus;
    Potorous longipes;
    Potorous gilbertii;
    Bettongia gaimardi;
    Bettongia penicillata;
    Bettongia lesueur;
    Bettongia tropica;
    Aepyprymnus rufescens;
    Hypsiprymnodon moschatus
  `, [18,20], 75);

  // ============================================================
  // AUSTRALISCHE BUIDELROOFDIEREN
  // ============================================================

  australischeDieren(`
    Tasmaanse duivel=Sarcophilus harrisii;
    Dasyurus maculatus;
    Dasyurus viverrinus;
    Dasyurus geoffroii;
    Dasyurus hallucatus;
    Phascogale tapoatafa;
    Phascogale calura;
    Phascogale pirata;
    Dasycercus cristicauda;
    Dasycercus blythi;
    Dasyuroides byrnei;
    Dasykaluta rosamondae;
    Parantechinus apicalis;
    Pseudantechinus macdonnellensis;
    Pseudantechinus bilarni;
    Pseudantechinus ningbing;
    Pseudantechinus roryi;
    Pseudantechinus woolleyae;
    Antechinus stuartii;
    Antechinus agilis;
    Antechinus flavipes;
    Antechinus swainsonii;
    Antechinus minimus;
    Antechinus godmani;
    Antechinus adustus;
    Antechinus bellus;
    Antechinus leo;
    Antechinus subtropicus;
    Antechinus argentus;
    Antechinus arktos;
    Antechinus mysticus;
    Antechinus vandycki;
    Antechinus mimetes;
    Sminthopsis crassicaudata;
    Sminthopsis macroura;
    Sminthopsis murina;
    Sminthopsis leucopus;
    Sminthopsis archeri;
    Sminthopsis bindi;
    Sminthopsis butleri;
    Sminthopsis dolichura;
    Sminthopsis douglasi;
    Sminthopsis fuliginosa;
    Sminthopsis gilberti;
    Sminthopsis granulipes;
    Sminthopsis griseoventer;
    Sminthopsis hirtipes;
    Sminthopsis longicaudata;
    Sminthopsis ooldea;
    Sminthopsis psammophila;
    Sminthopsis virginiae;
    Sminthopsis youngsoni;
    Ningaui ridei;
    Ningaui timealeyi;
    Ningaui yvonneae;
    Planigale ingrami;
    Planigale maculata;
    Planigale gilesi;
    Planigale tenuirostris;
    Numbat=Myrmecobius fasciatus
  `, [18,20], 85);

  // ============================================================
  // AUSTRALISCHE WOM BATS EN BANDICOOTS
  // ============================================================

  australischeDieren(`
    Gewone wombat=Vombatus ursinus;
    Lasiorhinus latifrons;
    Lasiorhinus krefftii;
    Grote bilby=Macrotis lagotis;
    Perameles nasuta;
    Perameles gunnii;
    Perameles bougainville;
    Perameles pallescens;
    Isoodon obesulus;
    Isoodon macrourus;
    Isoodon auratus;
    Echymipera rufescens
  `, [18,20], 75);

  // ============================================================
  // AUSTRALISCHE BOOMZOOGDIEREN
  // ============================================================

  australischeDieren(`
    Koala=Phascolarctos cinereus;
    Gewone voskoesoe=Trichosurus vulpecula;
    Trichosurus caninus;
    Trichosurus cunninghami;
    Trichosurus arnhemensis;
    Trichosurus johnstonii;
    Wyulda squamicaudata;
    Pseudocheirus peregrinus;
    Pseudochirulus herbertensis;
    Pseudochirulus cinereus;
    Pseudochirops archeri;
    Hemibelideus lemuroides;
    Petauroides volans;
    Petauroides minor;
    Petauroides armillatus;
    Petaurus breviceps;
    Petaurus norfolcensis;
    Petaurus australis;
    Petaurus gracilis;
    Petaurus notatus;
    Petaurus ariel;
    Gymnobelideus leadbeateri;
    Acrobates pygmaeus;
    Acrobates frontalis;
    Cercartetus nanus;
    Cercartetus concinnus;
    Cercartetus lepidus;
    Dendrolagus lumholtzi;
    Dendrolagus bennettianus
  `, [20,31,35], 80);

  // ============================================================
  // AUSTRALISCHE EIERLEGGENDE ZOOGDIEREN
  // ============================================================

  australischeDieren(`
    Vogelbekdier=Ornithorhynchus anatinus;
    Mierenegel=Tachyglossus aculeatus
  `, [7,20], 35);

  // ============================================================
  // AUSTRALISCHE KNAAGDIEREN
  // ============================================================

  australischeDieren(`
    Hydromys chrysogaster;
    Xeromys myoides;
    Notomys alexis;
    Notomys mitchellii;
    Notomys fuscus;
    Notomys aquilo;
    Notomys cervinus;
    Pseudomys australis;
    Pseudomys desertor;
    Pseudomys delicatulus;
    Pseudomys gracilicaudatus;
    Pseudomys hermannsburgensis;
    Pseudomys nanus;
    Pseudomys novaehollandiae;
    Pseudomys occidentalis;
    Pseudomys oralis;
    Pseudomys patrius;
    Pseudomys shortridgei;
    Pseudomys chapmani;
    Pseudomys fieldi;
    Pseudomys calabyi;
    Pseudomys johnsoni;
    Pseudomys higginsi;
    Pseudomys fumeus;
    Pseudomys pilligaensis;
    Leggadina forresti;
    Leggadina lakedownensis;
    Zyzomys argurus;
    Zyzomys maini;
    Zyzomys palatalis;
    Zyzomys pedunculatus;
    Zyzomys woodwardi;
    Conilurus penicillatus;
    Mesembriomys gouldii;
    Mesembriomys macrurus;
    Leporillus conditor;
    Mastacomys fuscus;
    Melomys cervinipes;
    Melomys burtoni;
    Melomys capensis;
    Melomys rubicola;
    Uromys caudimaculatus;
    Rattus fuscipes;
    Rattus lutreolus;
    Rattus tunneyi;
    Rattus sordidus;
    Rattus colletti;
    Rattus villosissimus;
    Rattus leucopus
  `, [18,20], 90);

  // Bramble Cay-melomys is uitgestorven.
  verwijderKoppeling("Melomys rubicola", [23]);
  koppel("Melomys rubicola", [43], 85);

  // ============================================================
  // AUSTRALISCHE PAPEGAAIEN EN KAKETOES
  // ============================================================

  australischeDieren(`
    Grasparkiet=Melopsittacus undulatus;
    Valkparkiet=Nymphicus hollandicus;
    Roze kaketoe=Eolophus roseicapilla;
    Helmkaketoe=Callocephalon fimbriatum;
    Geelkuifkaketoe=Cacatua galerita;
    Cacatua sanguinea;
    Cacatua tenuirostris;
    Cacatua pastinator;
    Cacatua leadbeateri=Lophochroa leadbeateri;
    Calyptorhynchus banksii;
    Calyptorhynchus lathami;
    Zanda funerea;
    Zanda latirostris;
    Zanda baudinii;
    Palmkaketoe=Probosciger aterrimus;
    Regenbooglori=Trichoglossus moluccanus;
    Trichoglossus rubritorquis;
    Trichoglossus chlorolepidotus;
    Psitteuteles versicolor;
    Parvipsitta pusilla;
    Parvipsitta porphyrocephala;
    Glossopsitta concinna;
    Lathamus discolor;
    Alisterus scapularis;
    Aprosmictus erythropterus;
    Polytelis alexandrae;
    Polytelis anthopeplus;
    Polytelis swainsonii;
    Platycercus elegans;
    Platycercus eximius;
    Platycercus adscitus;
    Platycercus venustus;
    Platycercus icterotis;
    Platycercus caledonicus;
    Barnardius zonarius;
    Psephotus haematonotus;
    Psephotellus varius;
    Psephotellus dissimilis;
    Psephotellus chrysopterygius;
    Northiella haematogaster;
    Northiella narethae;
    Purpureicephalus spurius;
    Lichmera indistincta;
    Neophema elegans;
    Neophema pulchella;
    Neophema splendida;
    Neophema chrysostoma;
    Neophema petrophila;
    Neophema chrysogaster;
    Neopsephotus bourkii;
    Pezoporus wallicus;
    Pezoporus occidentalis;
    Cyclopsitta diophthalma
  `, [2,7,18,22], 80);

  // Lichmera is een honingeter, geen papegaai.
  // De Australische verspreidingskoppeling blijft geldig.

  // ============================================================
  // AUSTRALISCHE VOGELS - OVERIGE
  // ============================================================

  australischeDieren(`
    Emoe=Dromaius novaehollandiae;
    Helmkasuaris=Casuarius casuarius
  `, [7,18,22], 45);

  australischeDieren(`
    Reuzenijsvogel van Australië=Dacelo novaeguineae=Kookaburra;
    Dacelo leachii;
    Todiramphus sanctus;
    Todiramphus macleayii;
    Todiramphus pyrrhopygius;
    Ceyx azureus;
    Ceyx pusillus;
    Regenboogbijeneter=Merops ornatus;
    Lierstaart=Menura novaehollandiae;
    Menura alberti;
    Atrichornis clamosus;
    Atrichornis rufescens;
    Ptilonorhynchus violaceus;
    Chlamydera nuchalis;
    Chlamydera maculata;
    Chlamydera guttata;
    Chlamydera cerviniventris;
    Sericulus chrysocephalus;
    Ailuroedus crassirostris;
    Ailuroedus maculosus;
    Scenopoeetes dentirostris;
    Malurus cyaneus;
    Malurus splendens;
    Malurus lamberti;
    Malurus amabilis;
    Malurus pulcherrimus;
    Malurus elegans;
    Malurus coronatus;
    Malurus alboscapulatus;
    Malurus melanocephalus;
    Malurus leucopterus;
    Malurus assimilis;
    Stipiturus malachurus;
    Stipiturus ruficeps;
    Stipiturus mallee;
    Amytornis striatus;
    Amytornis textilis;
    Amytornis purnelli;
    Amytornis modestus;
    Amytornis merrotsyi;
    Amytornis housei;
    Amytornis dorotheae;
    Amytornis ballarae;
    Amytornis woodwardi;
    Amytornis goyderi;
    Amytornis barbatus;
    Dasyornis brachypterus;
    Dasyornis longirostris;
    Dasyornis broadbenti;
    Pardalotus punctatus;
    Pardalotus striatus;
    Pardalotus quadragintus;
    Pardalotus rubricatus;
    Acanthiza pusilla;
    Acanthiza apicalis;
    Acanthiza ewingii;
    Acanthiza lineata;
    Acanthiza nana;
    Acanthiza chrysorrhoa;
    Acanthiza reguloides;
    Acanthiza uropygialis;
    Acanthiza robustirostris;
    Acanthiza inornata;
    Acanthiza iredalei;
    Acanthiza cinerea;
    Acanthiza murina;
    Smicrornis brevirostris;
    Gerygone mouki;
    Gerygone olivacea;
    Gerygone fusca;
    Gerygone palpebrosa;
    Gerygone magnirostris;
    Gerygone levigaster;
    Gerygone tenebrosa;
    Gerygone chloronota;
    Gerygone albogularis;
    Sericornis frontalis;
    Sericornis humilis;
    Sericornis magnirostra;
    Sericornis citreogularis;
    Sericornis keri;
    Aethomyias spilodera;
    Origma solitaria;
    Calamanthus fuliginosus;
    Calamanthus campestris;
    Hylacola pyrrhopygia;
    Hylacola cauta;
    Pyrrholaemus brunneus;
    Pyrrholaemus sagittatus;
    Aphelocephala leucopsis;
    Aphelocephala pectoralis;
    Aphelocephala nigricincta
  `, [2,7,18,22], 85);

  // Soorten met een voornamelijk Nieuw-Guinese verspreiding.
  verwijderKoppeling("Malurus alboscapulatus", [23]);
  verwijderKoppeling("Acanthiza murina", [23]);
  verwijderKoppeling("Aethomyias spilodera", [23]);

  // ============================================================
  // AUSTRALISCHE HONINGETERS
  // ============================================================

  australischeDieren(`
    Anthochaera carunculata;
    Anthochaera chrysoptera;
    Anthochaera lunulata;
    Anthochaera paradoxa;
    Anthochaera phrygia;
    Phylidonyris novaehollandiae;
    Phylidonyris niger;
    Phylidonyris pyrrhopterus;
    Manorina melanocephala;
    Manorina flavigula;
    Manorina melanotis;
    Manorina melanophrys;
    Melithreptus lunatus;
    Melithreptus gularis;
    Melithreptus brevirostris;
    Melithreptus albogularis;
    Melithreptus affinis;
    Melithreptus validirostris;
    Melithreptus chloropsis;
    Lichenostomus melanops;
    Lichenostomus cratitius;
    Ptilotula penicillata;
    Ptilotula ornata;
    Ptilotula flavescens;
    Ptilotula plumula;
    Ptilotula fusca;
    Ptilotula keartlandi;
    Gavicalis virescens;
    Gavicalis versicolor;
    Gavicalis fasciogularis;
    Bolemoreus frenatus;
    Bolemoreus hindwoodi;
    Nesoptilotis leucotis;
    Nesoptilotis flavicollis;
    Caligavis chrysops;
    Meliphaga lewinii;
    Meliphaga notata;
    Meliphaga gracilis;
    Lichmera indistincta;
    Lichmera incana;
    Certhionyx variegatus;
    Sugomel nigrum;
    Myzomela sanguinolenta;
    Myzomela obscura;
    Myzomela erythrocephala;
    Myzomela rosenbergii;
    Conopophila albogularis;
    Conopophila rufogularis;
    Conopophila whitei;
    Ramsayornis modestus;
    Ramsayornis fasciatus;
    Acanthagenys rufogularis;
    Grantiella picta;
    Epthianura albifrons;
    Epthianura tricolor;
    Epthianura aurifrons;
    Epthianura crocea;
    Ashbyia lovensis;
    Entomyzon cyanotis;
    Philemon corniculatus;
    Philemon citreogularis;
    Philemon buceroides;
    Philemon argenticeps
  `, [2,7,18,22], 85);

  verwijderKoppeling("Lichmera incana", [23]);
  verwijderKoppeling("Myzomela rosenbergii", [23]);

  // ============================================================
  // AUSTRALISCHE VARANEN
  // ============================================================

  australischeDieren(`
    Perentie=Varanus giganteus;
    Varanus varius;
    Varanus gouldii;
    Varanus panoptes;
    Varanus rosenbergi;
    Varanus spenceri;
    Varanus mertensi;
    Varanus mitchelli;
    Varanus semiremex;
    Varanus acanthurus;
    Varanus baritji;
    Varanus brevicauda;
    Varanus caudolineatus;
    Varanus eremius;
    Varanus gilleni;
    Varanus glauerti;
    Varanus kingorum;
    Varanus pilbarensis;
    Varanus primordius;
    Varanus scalaris;
    Varanus storri;
    Varanus tristis;
    Varanus bushi;
    Varanus hamersleyensis;
    Varanus sparnus;
    Varanus citrinus;
    Varanus ocreatus
  `, [18,21], 85);

  // ============================================================
  // AUSTRALISCHE AGAMEN
  // ============================================================

  australischeDieren(`
    Baardagame=Pogona vitticeps;
    Pogona barbata;
    Pogona henrylawsoni;
    Pogona microlepidota;
    Pogona minor;
    Pogona nullarbor;
    Pogona mitchelli;
    Kraaghagedis=Chlamydosaurus kingii;
    Bergduivel=Moloch horridus;
    Intellagama lesueurii;
    Lophognathus gilberti;
    Lophognathus horneri;
    Amphibolurus muricatus;
    Amphibolurus norrisi;
    Amphibolurus burnsi;
    Gowidon longirostris;
    Diporiphora australis;
    Diporiphora bilineata;
    Diporiphora magna;
    Diporiphora bennettii;
    Diporiphora albilabris;
    Diporiphora arnhemica;
    Diporiphora convergens;
    Diporiphora lalliae;
    Diporiphora linga;
    Diporiphora pindan;
    Diporiphora reginae;
    Diporiphora superba;
    Diporiphora winneckei;
    Diporiphora vescus;
    Ctenophorus nuchalis;
    Ctenophorus pictus;
    Ctenophorus reticulatus;
    Ctenophorus cristatus;
    Ctenophorus caudicinctus;
    Ctenophorus clayi;
    Ctenophorus decresii;
    Ctenophorus femoralis;
    Ctenophorus fordi;
    Ctenophorus isolepis;
    Ctenophorus maculatus;
    Ctenophorus mckenziei;
    Ctenophorus ornatus;
    Ctenophorus rufescens;
    Ctenophorus scutulatus;
    Ctenophorus salinarum;
    Ctenophorus adelaidensis;
    Ctenophorus chapmani;
    Ctenophorus fionni;
    Ctenophorus gibba;
    Ctenophorus infans;
    Ctenophorus mirrityana;
    Ctenophorus parviceps;
    Ctenophorus rubens;
    Ctenophorus vadnappa;
    Tympanocryptis lineata;
    Tympanocryptis pinguicolla;
    Tympanocryptis tetraporophora;
    Tympanocryptis intima;
    Tympanocryptis houstoni;
    Tympanocryptis cephalus;
    Tympanocryptis uniformis;
    Tympanocryptis centralis;
    Tympanocryptis osbornei;
    Tympanocryptis petersi
  `, [18,21], 85);

  // ============================================================
  // AUSTRALISCHE SKINKEN
  // ============================================================

  australischeDieren(`
    Blauwtongskink=Tiliqua scincoides;
    Tiliqua nigrolutea;
    Tiliqua occipitalis;
    Tiliqua multifasciata;
    Tiliqua rugosa;
    Tiliqua adelaidensis;
    Egernia cunninghami;
    Egernia stokesii;
    Egernia kingii;
    Egernia striolata;
    Egernia saxatilis;
    Egernia depressa;
    Egernia hosmeri;
    Egernia formosa;
    Egernia napoleonis;
    Egernia richardi;
    Egernia rugosa;
    Egernia margaretae;
    Egernia cygnitos;
    Egernia epsisolus;
    Lissolepis coventryi;
    Lissolepis luctuosa;
    Liopholis whitii;
    Liopholis inornata;
    Liopholis kintorei;
    Liopholis modesta;
    Liopholis multiscutata;
    Liopholis pulchra;
    Liopholis slateri;
    Liopholis striata;
    Liopholis guthega;
    Liopholis montana;
    Bellatorias major;
    Bellatorias frerei;
    Bellatorias obiri;
    Cyclodomorphus gerrardii;
    Cyclodomorphus casuarinae;
    Cyclodomorphus branchialis;
    Cyclodomorphus maximus;
    Cyclodomorphus melanops;
    Cyclodomorphus praealtus;
    Ctenotus robustus;
    Ctenotus taeniolatus;
    Ctenotus australis;
    Ctenotus pantherinus;
    Ctenotus leonhardii;
    Ctenotus inornatus;
    Ctenotus saxatilis;
    Ctenotus grandis;
    Ctenotus schomburgkii;
    Ctenotus brooksi;
    Ctenotus calurus;
    Ctenotus atlas;
    Ctenotus helenae;
    Ctenotus regius;
    Ctenotus fallens;
    Ctenotus uber;
    Ctenotus quattuordecimlineatus;
    Ctenotus strauchii;
    Ctenotus essingtonii;
    Ctenotus vertebralis;
    Ctenotus spaldingi;
    Ctenotus storri;
    Ctenotus militaris;
    Ctenotus piankai;
    Ctenotus decaneurus;
    Ctenotus iapetus;
    Ctenotus arcanus;
    Ctenotus xenopleura;
    Ctenotus colletti;
    Ctenotus hilli;
    Ctenotus leae;
    Ctenotus mastigura;
    Ctenotus nasutus;
    Ctenotus olympicus;
    Ctenotus pallescens;
    Ctenotus peronii;
    Ctenotus rimacola;
    Ctenotus tantillus;
    Ctenotus zebrilla
  `, [18,21], 90);

  // ============================================================
  // AUSTRALISCHE GEKKO'S
  // ============================================================

  australischeDieren(`
    Nephrurus levis;
    Nephrurus amyae;
    Nephrurus asper;
    Nephrurus cinctus;
    Nephrurus deleani;
    Nephrurus laevissimus;
    Nephrurus sheai;
    Nephrurus stellatus;
    Nephrurus vertebralis;
    Nephrurus wheeleri;
    Underwoodisaurus milii;
    Underwoodisaurus seorsus;
    Oedura monilis;
    Oedura marmorata;
    Oedura castelnaui;
    Oedura coggeri;
    Oedura filicipoda;
    Oedura gracilis;
    Oedura luritja;
    Oedura gemmata;
    Oedura jowalbinna;
    Oedura cincta;
    Oedura tryoni;
    Oedura picta;
    Oedura fimbria;
    Oedura bella;
    Amalosia lesueurii;
    Amalosia rhombifer;
    Amalosia obscura;
    Amalosia jacovae;
    Strophurus ciliaris;
    Strophurus intermedius;
    Strophurus taenicauda;
    Strophurus spinigerus;
    Strophurus williamsi;
    Strophurus assimilis;
    Strophurus elderi;
    Strophurus jeanae;
    Strophurus krisalys;
    Strophurus mcmillani;
    Strophurus micrurus;
    Strophurus michaelseni;
    Strophurus rankini;
    Strophurus robinsoni;
    Strophurus strophurus;
    Strophurus taeniatus;
    Strophurus wellingtonae;
    Diplodactylus vittatus;
    Diplodactylus tessellatus;
    Diplodactylus granariensis;
    Diplodactylus conspicillatus;
    Diplodactylus pulcher;
    Diplodactylus ornatus;
    Diplodactylus polyophthalmus;
    Diplodactylus capensis;
    Diplodactylus calcicolus;
    Diplodactylus fulleri;
    Diplodactylus galeatus;
    Diplodactylus mitchelli;
    Diplodactylus wiru;
    Diplodactylus kenneallyi;
    Lucasium damaeum;
    Lucasium stenodactylum;
    Lucasium steindachneri;
    Lucasium byrnei;
    Lucasium occultum;
    Lucasium squarrosum;
    Lucasium alboguttatum;
    Lucasium immaculatum;
    Lucasium maini;
    Lucasium wombeyi;
    Lucasium bungabinna
  `, [18,21], 90);

  // ============================================================
  // AUSTRALISCHE SLANGEN
  // ============================================================

  australischeDieren(`
    Binnenlandse taipan=Oxyuranus microlepidotus;
    Kusttaipan=Oxyuranus scutellatus;
    Oxyuranus temporalis;
    Pseudonaja textilis;
    Pseudonaja nuchalis;
    Pseudonaja affinis;
    Pseudonaja aspidorhyncha;
    Pseudonaja guttata;
    Pseudonaja inframacula;
    Pseudonaja ingrami;
    Pseudonaja mengdeni;
    Pseudonaja modesta;
    Tijgerslang=Notechis scutatus;
    Pseudechis australis;
    Pseudechis porphyriacus;
    Pseudechis colletti;
    Pseudechis guttatus;
    Pseudechis butleri;
    Pseudechis weigeli;
    Pseudechis pailsei;
    Acanthophis antarcticus;
    Acanthophis pyrrhus;
    Acanthophis praelongus;
    Acanthophis wellsi;
    Acanthophis cryptamydros;
    Austrelaps superbus;
    Austrelaps ramsayi;
    Austrelaps labialis;
    Tropidechis carinatus;
    Hoplocephalus bungaroides;
    Hoplocephalus bitorquatus;
    Hoplocephalus stephensii;
    Denisonia devisi;
    Denisonia maculata;
    Suta suta;
    Suta punctata;
    Suta fasciata;
    Suta nigriceps;
    Suta ordensis;
    Suta spectabilis;
    Suta flagellum;
    Suta dwyeri;
    Suta monachus;
    Parasuta gouldii;
    Furina diadema;
    Furina ornata;
    Furina tristis;
    Furina dunmalli;
    Cacophis squamulosus;
    Cacophis krefftii;
    Cacophis harriettae;
    Cacophis churchilli
  `, [18,21,45], 85);

  australischeDieren(`
    Morelia spilota;
    Morelia viridis;
    Morelia bredli;
    Morelia carinata;
    Antaresia childreni;
    Antaresia maculosa;
    Antaresia perthensis;
    Antaresia stimsoni;
    Aspidites melanocephalus;
    Aspidites ramsayi;
    Liasis olivaceus;
    Liasis fuscus;
    Liasis mackloti;
    Simalia kinghorni;
    Simalia amethistina;
    Bothrochilus boa;
    Acrochordus arafurae;
    Acrochordus granulatus
  `, [18,21], 85);

  verwijderKoppeling("Liasis mackloti", [23]);
  verwijderKoppeling("Bothrochilus boa", [23]);

  // ============================================================
  // AUSTRALISCHE KIKKERS
  // ============================================================

  australischeDieren(`
    Australische groene boomkikker=Litoria caerulea;
    Litoria splendida;
    Litoria infrafrenata;
    Litoria aurea;
    Litoria raniformis;
    Litoria peronii;
    Litoria ewingii;
    Litoria verreauxii;
    Litoria lesueurii;
    Litoria wilcoxii;
    Litoria jungguy;
    Litoria genimaculata;
    Litoria rheocola;
    Litoria nannotis;
    Litoria dayi;
    Litoria serrata;
    Litoria chloris;
    Litoria xanthomera;
    Litoria gracilenta;
    Litoria fallax;
    Litoria bicolor;
    Litoria rubella;
    Litoria inermis;
    Litoria nasuta;
    Litoria nigrofrenata;
    Litoria pallida;
    Litoria rothii;
    Litoria dentata;
    Litoria electrica;
    Litoria latopalmata;
    Litoria freycineti;
    Litoria brevipalmata;
    Litoria cooloolensis;
    Litoria olongburensis;
    Litoria tyleri;
    Litoria littlejohni;
    Litoria booroolongensis;
    Litoria subglandulosa;
    Litoria daviesae;
    Litoria pearsoniana;
    Litoria phyllochroa;
    Litoria citropa;
    Litoria spenceri;
    Litoria alboguttata;
    Litoria australis;
    Litoria cyclorhyncha;
    Litoria moorei;
    Litoria adelaidensis;
    Litoria coplandi;
    Litoria meiriana;
    Litoria watjulumensis;
    Litoria tornieri;
    Litoria personata;
    Cyclorana platycephala;
    Cyclorana australis;
    Cyclorana cultripes;
    Cyclorana maini;
    Cyclorana novaehollandiae;
    Cyclorana brevipes;
    Cyclorana cryptotis;
    Cyclorana longipes;
    Cyclorana maculosa;
    Cyclorana occidentalis;
    Cyclorana vagitus;
    Notaden bennettii;
    Notaden nichollsi;
    Notaden melanoscaphus;
    Notaden weigeli;
    Neobatrachus sudellae;
    Neobatrachus pictus;
    Neobatrachus pelobatoides;
    Neobatrachus kunapalari;
    Neobatrachus sutor;
    Neobatrachus albipes;
    Neobatrachus fulvus;
    Neobatrachus aquilonius;
    Neobatrachus wilsmorei;
    Myobatrachus gouldii;
    Arenophryne rotunda;
    Arenophryne xiphorhyncha;
    Metacrinia nichollsi;
    Pseudophryne corroboree;
    Pseudophryne pengilleyi;
    Pseudophryne bibronii;
    Pseudophryne australis;
    Pseudophryne dendyi;
    Pseudophryne semimarmorata;
    Pseudophryne major;
    Pseudophryne raveni;
    Pseudophryne coriacea;
    Pseudophryne guentheri;
    Pseudophryne occidentalis;
    Pseudophryne douglasi;
    Pseudophryne covacevichae
  `, [4], 85);

  // ============================================================
  // AUSTRALISCHE SPINNEN
  // ============================================================

  australischeDieren(`
    Atrax robustus;
    Atrax sutherlandi;
    Atrax yorkmainorum;
    Hadronyche formidabilis;
    Hadronyche cerberea;
    Hadronyche infensa;
    Hadronyche versuta;
    Hadronyche modesta;
    Hadronyche venenata;
    Hadronyche adelaidensis;
    Hadronyche alpina;
    Hadronyche annachristiae;
    Hadronyche anzses;
    Hadronyche bajula;
    Hadronyche cambridgei;
    Hadronyche emmalizae;
    Hadronyche kaputarensis;
    Hadronyche lamingtonensis;
    Hadronyche levittgreggae;
    Hadronyche lynabrae;
    Hadronyche macquariensis;
    Hadronyche mascordi;
    Hadronyche meridiana;
    Hadronyche monaro;
    Hadronyche nimoola;
    Hadronyche orana;
    Hadronyche pulvinator;
    Hadronyche raveni;
    Hadronyche tambo;
    Hadronyche valida;
    Illawarra wisharti;
    Latrodectus hasselti;
    Missulena occatoria;
    Missulena bradleyi;
    Missulena granulosa;
    Missulena hoggi;
    Missulena insignis;
    Missulena pruinosa;
    Missulena reflexa;
    Missulena rutraspina;
    Missulena torbayensis;
    Missulena tussulena;
    Missulena faulderi;
    Missulena melissae;
    Missulena davidi
  `, [7,17], 90);

  australischeDieren(`
    Maratus volans;
    Maratus speciosus;
    Maratus splendens;
    Maratus personatus;
    Maratus caeruleus;
    Maratus avibus;
    Maratus chrysomelas;
    Maratus eliasi;
    Maratus fimbriatus;
    Maratus karrie;
    Maratus karschi;
    Maratus linnaei;
    Maratus mungaich;
    Maratus nigromaculatus;
    Maratus pavonis;
    Maratus plumosus;
    Maratus tasmanicus;
    Maratus vespa;
    Maratus hortorum;
    Maratus jactatus;
    Maratus sceletus;
    Maratus elephans;
    Maratus cinereus;
    Maratus albus;
    Maratus bubo;
    Maratus robinsoni;
    Maratus pardus;
    Maratus sarahae;
    Maratus anomalus;
    Maratus harrisi;
    Maratus spicatus;
    Maratus tessellatus;
    Maratus lentus;
    Maratus gemmifer;
    Maratus cristatus;
    Maratus trigonus;
    Maratus unicup;
    Maratus sapphirus;
    Maratus aquilus;
    Maratus icarus;
    Maratus constellatus;
    Maratus azureus
  `, [7,10,17,34], 85);

  // ============================================================
  // DIEREN VAN KOUDE GEBIEDEN - ZOOGDIEREN
  // ============================================================

  koudedieren(`
    IJsbeer=Ursus maritimus;
    Poolvos=Vulpes lagopus;
    Rendier=Rangifer tarandus;
    Muskusos=Ovibos moschatus;
    Poolhaas=Lepus arcticus;
    Sneeuwhaas=Lepus timidus;
    Lepus othus;
    Amerikaanse sneeuwhaas=Lepus americanus;
    Veelvraat=Gulo gulo;
    Canadese lynx=Lynx canadensis;
    Siberische lemming=Lemmus sibiricus;
    Berglemming=Lemmus lemmus;
    Lemmus trimucronatus;
    Lemmus amurensis;
    Lemmus portenkoi;
    Dicrostonyx torquatus;
    Dicrostonyx groenlandicus;
    Dicrostonyx hudsonius;
    Dicrostonyx richardsoni;
    Dicrostonyx unalascensis;
    Dicrostonyx nunatakensis;
    Myopus schisticolor;
    Myodes rutilus;
    Myodes rufocanus;
    Microtus oeconomus;
    Microtus miurus;
    Microtus abbreviatus;
    Urocitellus parryii;
    Marmota camtschatica;
    Marmota caligata;
    Marmota marmota;
    Marmota sibirica;
    Marmota baibacina;
    Marmota himalayana;
    Marmota caudata;
    Marmota menzbieri;
    Ochotona hyperborea;
    Ochotona collaris;
    Ochotona princeps;
    Ochotona roylei;
    Ochotona macrotis;
    Ochotona curzoniae;
    Ochotona nubrica;
    Ochotona ladacensis;
    Ochotona himalayana;
    Ochotona rufescens;
    Ochotona koslowi;
    Ochotona lama;
    Sneeuwluipaard=Panthera uncia;
    Yak=Bos mutus;
    Takin=Budorcas taxicolor;
    Siberische steenbok=Capra sibirica;
    Alpensteenbok=Capra ibex;
    Sneeuwgeit=Oreamnos americanus;
    Argali=Ovis ammon;
    Dallsschaap=Ovis dalli;
    Sneeuwschaap=Ovis nivicola;
    Bharal=Pseudois nayaur;
    Tibetaanse antilope=Pantholops hodgsonii;
    Tibetaanse gazelle=Procapra picticaudata;
    Kiang=Equus kiang;
    Mongoolse gazelle=Procapra gutturosa;
    Saiga=Saiga tatarica;
    Siberisch muskushert=Moschus moschiferus;
    Moschus chrysogaster;
    Moschus leucogaster;
    Moschus fuscus;
    Moschus cupreus
  `, [20], 75);

  // ============================================================
  // KOUDE ZEEËN - WALVISACHTIGEN
  // ============================================================

  koudedieren(`
    Narwal=Monodon monoceros;
    Beloega=Delphinapterus leucas;
    Groenlandse walvis=Balaena mysticetus;
    Grijze walvis=Eschrichtius robustus;
    Noordkaper=Eubalaena glacialis;
    Japanse noordkaper=Eubalaena japonica;
    Zuidkaper=Eubalaena australis;
    Antarctische dwergvinvis=Balaenoptera bonaerensis;
    Dwergvinvis=Balaenoptera acutorostrata;
    Bultrug=Megaptera novaeangliae;
    Blauwe vinvis=Balaenoptera musculus;
    Gewone vinvis=Balaenoptera physalus;
    Noordse vinvis=Balaenoptera borealis;
    Orka=Orcinus orca;
    Witsnuitdolfijn=Lagenorhynchus albirostris;
    Zandloperdolfijn=Lagenorhynchus cruciger;
    Peales dolfijn=Lagenorhynchus australis;
    Dalls bruinvis=Phocoenoides dalli;
    Brilbruinvis=Phocoena dioptrica
  `, [1,11,14,18], 70);

  // ============================================================
  // KOUDE GEBIEDEN - VOGELS
  // ============================================================

  koudedieren(`
    Sneeuwuil=Bubo scandiacus;
    Giervalk=Falco rusticolus;
    Sneeuwhoen=Lagopus muta;
    Moerassneeuwhoen=Lagopus lagopus;
    Witstaartsneeuwhoen=Lagopus leucura;
    Alpensneeuwhoen=Lagopus muta;
    Sneeuwgors=Plectrophenax nivalis;
    Plectrophenax hyperboreus;
    IJsgors=Calcarius lapponicus;
    Calcarius pictus;
    Calcarius ornatus;
    Alpenkauw=Pyrrhocorax graculus;
    Alpenheggenmus=Prunella collaris;
    Sneeuwvink=Montifringilla nivalis;
    Montifringilla henrici;
    Montifringilla adamsi;
    Onychostruthus taczanowskii;
    Pyrgilauda davidiana;
    Pyrgilauda ruficollis;
    Pyrgilauda blanfordi;
    Pyrgilauda theresae;
    Alpensneeuwvink;
    Leucosticte arctoa;
    Leucosticte tephrocotis;
    Leucosticte atrata;
    Leucosticte australis;
    Leucosticte nemoricola;
    Leucosticte brandti;
    Poolmeeuw=Pagophila eburnea;
    Kleine alk=Alle alle;
    Alk=Alca torda;
    Zeekoet=Uria aalge;
    Kortbekzeekoet=Uria lomvia;
    Zwarte zeekoet=Cepphus grylle;
    Cepphus columba;
    Cepphus carbo;
    Papegaaiduiker=Fratercula arctica;
    Fratercula corniculata;
    Fratercula cirrhata;
    Cerorhinca monocerata;
    Aethia cristatella;
    Aethia pusilla;
    Aethia pygmaea;
    Aethia psittacula;
    Ptychoramphus aleuticus;
    Synthliboramphus antiquus;
    Brachyramphus brevirostris;
    Brachyramphus marmoratus;
    Brachyramphus perdix;
    IJsduiker=Gavia immer;
    Geelsnavelduiker=Gavia adamsii;
    Roodkeelduiker=Gavia stellata;
    Parelduiker=Gavia arctica;
    Gavia pacifica;
    IJseend=Clangula hyemalis;
    Brileider=Somateria fischeri;
    Koningseider=Somateria spectabilis;
    Stellers eider=Polysticta stelleri;
    Kleine rietgans=Anser brachyrhynchus;
    Sneeuwgans=Anser caerulescens;
    Rossgans=Anser rossii;
    Keizergans=Anser canagicus;
    Brandgans=Branta leucopsis;
    Rotgans=Branta bernicla;
    Roodhalsgans=Branta ruficollis;
    Dwerggans=Anser erythropus;
    Toendrarietgans=Anser serrirostris;
    Taigarietgans=Anser fabalis;
    Kleine zwaan=Cygnus columbianus;
    Wilde zwaan=Cygnus cygnus;
    Trompetzwaan=Cygnus buccinator
  `, [2,7,18,22], 75);

  // ============================================================
  // ANTARCTISCHE ZEEVOGELS
  // ============================================================

  koudedieren(`
    Sneeuwstormvogel=Pagodroma nivea;
    Antarctische stormvogel=Thalassoica antarctica;
    Kaapse stormvogel=Daption capense;
    Zuidelijke reuzenstormvogel=Macronectes giganteus;
    Noordelijke reuzenstormvogel=Macronectes halli;
    Zuidelijke stormvogel=Fulmarus glacialoides;
    Noordse stormvogel=Fulmarus glacialis;
    Blauwe stormvogel=Halobaena caerulea;
    Pachyptila vittata;
    Pachyptila desolata;
    Pachyptila belcheri;
    Pachyptila turtur;
    Pachyptila salvini;
    Pachyptila crassirostris;
    Pachyptila macgillivrayi;
    Pterodroma mollis;
    Pterodroma lessonii;
    Pterodroma macroptera;
    Pterodroma incerta;
    Pterodroma brevirostris;
    Pterodroma inexpectata;
    Pterodroma magentae;
    Pterodroma leucoptera;
    Grote albatros=Diomedea exulans;
    Diomedea antipodensis;
    Diomedea epomophora;
    Diomedea sanfordi;
    Diomedea dabbenena;
    Thalassarche melanophris;
    Thalassarche chrysostoma;
    Thalassarche cauta;
    Thalassarche salvini;
    Thalassarche eremita;
    Thalassarche impavida;
    Phoebetria fusca;
    Phoebetria palpebrata;
    Oceanites oceanicus;
    Fregetta tropica;
    Fregetta grallaria;
    Pelagodroma marina;
    Zuidpooljager=Stercorarius maccormicki;
    Stercorarius antarcticus;
    Chionis alba;
    Chionis minor
  `, [2,7,18,22], 85);

  // ============================================================
  // KOUDE GEBIEDEN - VISSEN
  // ============================================================

  koudedieren(`
    Arctische kabeljauw=Boreogadus saida;
    Arctogadus glacialis;
    Groenlandse haai=Somniosus microcephalus;
    Groenlandse heilbot=Reinhardtius hippoglossoides;
    Arctische riddervis=Salvelinus alpinus;
    Salvelinus malma;
    Salvelinus namaycush;
    Salvelinus boganidae;
    Salvelinus elgyticus;
    Salvelinus taranetzi;
    Salvelinus albus;
    Thymallus arcticus;
    Lota lota;
    Coregonus nasus;
    Coregonus muksun;
    Coregonus autumnalis;
    Coregonus sardinella;
    Coregonus lavaretus;
    Coregonus peled;
    Notothenia coriiceps;
    Notothenia rossii;
    Notothenia angustata;
    Dissostichus eleginoides;
    Dissostichus mawsoni;
    Trematomus bernacchii;
    Trematomus hansoni;
    Trematomus newnesi;
    Trematomus pennellii;
    Trematomus lepidorhinus;
    Trematomus eulepidotus;
    Trematomus loennbergii;
    Trematomus nicolai;
    Trematomus scotti;
    Trematomus tokarevi;
    Trematomus vicarius;
    Pagothenia borchgrevinki;
    Pagothenia brachysoma;
    Pleuragramma antarcticum;
    Aethotaxis mitopteryx;
    Gvozdarus svetovidovi;
    Chionodraco hamatus;
    Chionodraco rastrospinosus;
    Chionodraco myersi;
    Chaenocephalus aceratus;
    Champsocephalus gunnari;
    Champsocephalus esox;
    Channichthys rhinoceratus;
    Channichthys rugosus;
    Channichthys velifer;
    Chionobathyscus dewitti;
    Cryodraco antarcticus;
    Cryodraco atkinsoni;
    Cryodraco pappenheimi;
    Dacodraco hunteri;
    Neopagetopsis ionah;
    Pagetopsis macropterus;
    Pagetopsis maculatus;
    Pseudochaenichthys georgianus;
    Harpagifer antarcticus;
    Harpagifer bispinis;
    Artedidraco skottsbergi;
    Artedidraco orianae;
    Artedidraco shackletoni;
    Artedidraco loennbergi;
    Dolloidraco longedorsalis;
    Pogonophryne scotti;
    Pogonophryne marmorata;
    Pogonophryne barsukovi;
    Pogonophryne permitini
  `, [1,14,18], 90);

  // ============================================================
  // KOUDE GEBIEDEN - ONGEWERVELDEN
  // ============================================================

  koudedieren(`
    Antarctisch krill=Euphausia superba;
    Euphausia crystallorophias;
    Euphausia frigida;
    Euphausia triacantha;
    Euphausia vallentini;
    Thysanoessa macrura;
    Thysanoessa inermis;
    Thysanoessa raschii;
    Meganyctiphanes norvegica;
    Calanus glacialis;
    Calanus hyperboreus;
    Calanus finmarchicus;
    Calanoides acutus;
    Rhincalanus gigas;
    Metridia gerlachei;
    Metridia longa;
    Oithona similis;
    Oncaea curvata;
    Paraeuchaeta antarctica;
    Themisto libellula;
    Themisto abyssorum;
    Themisto gaudichaudii;
    Eusirus antarcticus;
    Eusirus perdentatus;
    Eusirus giganteus;
    Waldeckia obesa;
    Paraceradocus miersi;
    Glyptonotus antarcticus;
    Serolis paradoxa;
    Ceratoserolis trilobitoides;
    Septemserolis septemcarinata;
    Laternula elliptica;
    Adamussium colbecki;
    Yoldia eightsi;
    Nacella concinna;
    Nacella magellanica;
    Nacella deaurata;
    Nacella delicatissima;
    Neobuccinum eatoni;
    Trophon geversianus;
    Trophon longstaffi;
    Sterechinus neumayeri;
    Sterechinus antarcticus;
    Abatus cordatus;
    Abatus agassizii;
    Abatus nimrodi;
    Odontaster validus;
    Odontaster meridionalis;
    Diplasterias brucei;
    Labidiaster annulatus;
    Perknaster fuscus;
    Acodontaster conspicuus;
    Acodontaster hodgsoni;
    Ophionotus victoriae;
    Ophionotus hexactis;
    Ophiura carinifera;
    Promachocrinus kerguelensis;
    Isometra vivipara;
    Antarcticothuria vemae;
    Cucumaria georgiana;
    Staurocucumis liouvillei;
    Bathyplotes bongraini;
    Belgica antarctica;
    Parochlus steinenii;
    Cryptopygus antarcticus;
    Cryptopygus terranovus;
    Cryptopygus sverdrupi;
    Gomphiocephalus hodgsoni;
    Friesea grisea;
    Friesea antarctica;
    Alaskozetes antarcticus;
    Halozetes belgicae;
    Halozetes antarcticus
  `, [], 90);

  // ============================================================
  // WOESTIJNZOOGDIEREN
  // ============================================================

  woestijndieren(`
    Dromedaris=Camelus dromedarius;
    Wilde kameel=Camelus ferus;
    Fennek=Vulpes zerda;
    Rüppells vos=Vulpes rueppellii;
    Bleke vos=Vulpes pallida;
    Kitvos=Vulpes macrotis;
    Vulpes velox;
    Zandkat=Felis margarita;
    Caracal=Caracal caracal;
    Addax=Addax nasomaculatus;
    Arabische oryx=Oryx leucoryx;
    Algazel=Oryx dammah;
    Gemsbok=Oryx gazella;
    Dorcasgazelle=Gazella dorcas;
    Slankhoorngazelle=Gazella leptoceros;
    Damagazelle=Nanger dama;
    Mongoolse gazelle=Procapra gutturosa;
    Kropgazelle=Gazella subgutturosa;
    Arabische gazelle=Gazella arabica;
    Gazella marica;
    Gazella bennettii;
    Nubische steenbok=Capra nubiana;
    Barbarijs schaap=Ammotragus lervia;
    Onager=Equus hemionus;
    Afrikaanse wilde ezel=Equus africanus;
    Woestijnwrattenzwijn=Phacochoerus aethiopicus;
    Kaapse haas=Lepus capensis;
    Lepus tibetanus;
    Lepus tolai;
    Lepus californicus;
    Lepus alleni;
    Lepus insularis;
    Lepus habessinicus;
    Lepus arabicus;
    Lepus tibetanus;
    Woestijnegel=Paraechinus aethiopicus;
    Paraechinus hypomelas;
    Paraechinus micropus;
    Langooregel=Hemiechinus auritus;
    Hemiechinus collaris;
    Gerbillus gerbillus;
    Gerbillus pyramidum;
    Gerbillus tarabuli;
    Gerbillus nanus;
    Gerbillus cheesmani;
    Gerbillus henleyi;
    Gerbillus dasyurus;
    Gerbillus campestris;
    Gerbillus simoni;
    Gerbillus andersoni;
    Gerbillus amoenus;
    Gerbillus perpallidus;
    Gerbillus latastei;
    Gerbillus poecilops;
    Gerbillus pulvinatus;
    Gerbillus harwoodi;
    Meriones crassus;
    Meriones libycus;
    Meriones meridianus;
    Meriones hurrianae;
    Meriones tamariscinus;
    Meriones zarudnyi;
    Meriones persicus;
    Meriones tristrami;
    Meriones unguiculatus;
    Pachyuromys duprasi;
    Psammomys obesus;
    Psammomys vexillaris;
    Rhombomys opimus;
    Sekeetamys calurus;
    Jaculus jaculus;
    Jaculus orientalis;
    Jaculus hirtipes;
    Jaculus blanfordi;
    Jaculus thaleri;
    Allactaga major;
    Allactaga elater;
    Allactaga euphratica;
    Allactaga hotsoni;
    Allactaga williamsi;
    Allactaga sibirica;
    Allactaga tetradactyla;
    Allactaga balikunica;
    Allactaga bullata;
    Dipus sagitta;
    Stylodipus telum;
    Stylodipus sungorus;
    Stylodipus andrewsi;
    Eremodipus lichtensteini;
    Paradipus ctenodactylus;
    Card iocranius paradoxus;
    Salpingotus crassicauda;
    Salpingotus kozlovi;
    Salpingotus michaelis;
    Salpingotus pallidus;
    Euchoreutes naso;
    Ctenodactylus gundi;
    Ctenodactylus vali;
    Massoutiera mzabi;
    Felovia vae;
    Pectinator spekei;
    Elephantulus rozeti;
    Elephantulus rufescens;
    Elephantulus intufi;
    Elephantulus rupestris;
    Macroscelides proboscideus;
    Macroscelides flavicaudatus;
    Macroscelides micus
  `, [20], 85);

  verwijderKoppeling("Card iocranius paradoxus", [25]);
  woestijndieren("Cardiocranius paradoxus", [20], 90);

  // ============================================================
  // NOORD-AMERIKAANSE WOESTIJNKNAAGDIEREN
  // ============================================================

  woestijndieren(`
    Dipodomys deserti;
    Dipodomys merriami;
    Dipodomys ordii;
    Dipodomys spectabilis;
    Dipodomys microps;
    Dipodomys panamintinus;
    Dipodomys nitratoides;
    Dipodomys ingens;
    Dipodomys agilis;
    Dipodomys heermanni;
    Dipodomys nelsoni;
    Dipodomys phillipsii;
    Dipodomys elator;
    Dipodomys gravipes;
    Dipodomys compactus;
    Microdipodops megacephalus;
    Microdipodops pallidus;
    Chaetodipus penicillatus;
    Chaetodipus baileyi;
    Chaetodipus intermedius;
    Chaetodipus spinatus;
    Chaetodipus nelsoni;
    Chaetodipus hispidus;
    Chaetodipus formosus;
    Chaetodipus arenarius;
    Chaetodipus eremicus;
    Chaetodipus rudinoris;
    Chaetodipus pernix;
    Chaetodipus artus;
    Chaetodipus goldmani;
    Perognathus longimembris;
    Perognathus flavus;
    Perognathus amplus;
    Perognathus merriami;
    Perognathus inornatus;
    Perognathus parvus;
    Onychomys torridus;
    Onychomys leucogaster;
    Onychomys arenicola;
    Neotoma lepida;
    Neotoma devia;
    Neotoma albigula;
    Neotoma bryanti;
    Neotoma micropus;
    Neotoma mexicana;
    Peromyscus eremicus;
    Peromyscus merriami;
    Peromyscus crinitus;
    Peromyscus fraterculus;
    Ammospermophilus leucurus;
    Ammospermophilus harrisii;
    Ammospermophilus interpres;
    Ammospermophilus nelsoni;
    Ammospermophilus insularis;
    Xerospermophilus tereticaudus;
    Xerospermophilus spilosoma;
    Xerospermophilus mohavensis;
    Otospermophilus variegatus;
    Urocitellus mollis;
    Spermophilus mohavensis
  `, [20], 90);

  // ============================================================
  // AUSTRALISCHE WOESTIJNDIEREN
  // ============================================================

  woestijndieren(`
    Rode reuzenkangoeroe;
    Bergduivel;
    Perentie;
    Varanus eremius;
    Varanus brevicauda;
    Varanus gouldii;
    Varanus acanthurus;
    Varanus panoptes;
    Ctenophorus nuchalis;
    Ctenophorus isolepis;
    Ctenophorus maculatus;
    Ctenophorus pictus;
    Ctenophorus scutulatus;
    Ctenophorus clayi;
    Ctenophorus salinarum;
    Nephrurus levis;
    Nephrurus amyae;
    Nephrurus stellatus;
    Nephrurus laevissimus;
    Lucasium damaeum;
    Lucasium stenodactylum;
    Tiliqua multifasciata;
    Tiliqua occipitalis;
    Aspidites ramsayi;
    Antaresia perthensis;
    Pseudonaja modesta;
    Pseudonaja mengdeni;
    Acanthophis pyrrhus;
    Oxyuranus microlepidotus;
    Notomys alexis;
    Notomys fuscus;
    Notomys cervinus;
    Pseudomys desertor;
    Pseudomys hermannsburgensis;
    Pseudomys australis;
    Leggadina forresti;
    Zyzomys pedunculatus;
    Dasycercus cristicauda;
    Dasycercus blythi;
    Dasyuroides byrnei;
    Sminthopsis psammophila;
    Sminthopsis hirtipes;
    Sminthopsis youngsoni;
    Sminthopsis ooldea;
    Ningaui ridei;
    Ningaui timealeyi;
    Notaden nichollsi;
    Neobatrachus aquilonius;
    Cyclorana platycephala;
    Grote bilby
  `, [23], 80);

  // ============================================================
  // WOESTIJNVOGELS
  // ============================================================

  woestijndieren(`
    Chlamydotis undulata;
    Chlamydotis macqueenii;
    Ardeotis arabs;
    Ardeotis kori;
    Neotis nuba;
    Neotis heuglinii;
    Cursorius cursor;
    Cursorius temminckii;
    Cursorius rufus;
    Cursorius somalensis;
    Cursorius coromandelicus;
    Pterocles alchata;
    Pterocles orientalis;
    Pterocles senegallus;
    Pterocles coronatus;
    Pterocles lichtensteinii;
    Pterocles exustus;
    Pterocles namaqua;
    Pterocles decoratus;
    Pterocles personatus;
    Pterocles gutturalis;
    Pterocles bicinctus;
    Pterocles quadricinctus;
    Pterocles indicus;
    Syrrhaptes paradoxus;
    Syrrhaptes tibetanus;
    Alaemon alaudipes;
    Alaemon hamertoni;
    Ammomanes deserti;
    Ammomanes cinctura;
    Ammomanes phoenicura;
    Eremophila bilopha;
    Ramphocoris clotbey;
    Eremopterix nigriceps;
    Eremopterix leucopareia;
    Eremopterix australis;
    Eremopterix verticalis;
    Eremopterix griseus;
    Eremopterix signatus;
    Galerida theklae;
    Galerida cristata;
    Galerida macrorhyncha;
    Galerida deva;
    Oenanthe deserti;
    Oenanthe leucopyga;
    Oenanthe monacha;
    Oenanthe moesta;
    Oenanthe lugens;
    Oenanthe albonigra;
    Oenanthe xanthoprymna;
    Oenanthe chrysopygia;
    Oenanthe melanura;
    Scotocerca inquieta;
    Argya squamiceps;
    Argya fulva;
    Argya caudata;
    Prinia gracilis;
    Prinia lepida;
    Sylvia nana;
    Curruca nana;
    Curruca deserti;
    Passer simplex;
    Passer zarudnyi;
    Carpodacus synoicus;
    Bucanetes githagineus;
    Bucanetes mongolicus;
    Rhodospiza obsoleta;
    Geococcyx californianus;
    Geococcyx velox;
    Campylorhynchus brunneicapillus;
    Toxostoma lecontei;
    Toxostoma crissale;
    Toxostoma bendirei;
    Toxostoma curvirostre;
    Amphispiza bilineata;
    Artemisiospiza nevadensis;
    Auriparus flaviceps;
    Phainopepla nitens;
    Callipepla gambelii;
    Callipepla squamata;
    Micrathene whitneyi;
    Glaucidium brasilianum;
    Athene cunicularia;
    Bubo ascalaphus;
    Eremophila alpestris;
    Ashbyia lovensis;
    Epthianura aurifrons;
    Epthianura tricolor;
    Amytornis goyderi;
    Amytornis textilis;
    Amytornis purnelli;
    Aphelocephala leucopsis;
    Aphelocephala nigricincta
  `, [2,7,18,22], 85);

  // ============================================================
  // WOESTIJNREPTIELEN
  // ============================================================

  woestijndieren(`
    Gopherus agassizii;
    Gopherus morafkai;
    Gopherus evgoodei;
    Gopherus flavomarginatus;
    Testudo kleinmanni;
    Centrochelys sulcata;
    Chersobius signatus;
    Chersobius boulengeri;
    Homopus areolatus;
    Uromastyx aegyptia;
    Uromastyx acanthinura;
    Uromastyx geyri;
    Uromastyx dispar;
    Uromastyx ocellata;
    Uromastyx ornata;
    Uromastyx nigriventris;
    Uromastyx occidentalis;
    Uromastyx thomasi;
    Saara hardwickii;
    Saara loricata;
    Saara asmussi;
    Trapelus mutabilis;
    Trapelus savignii;
    Trapelus tournevillei;
    Trapelus pallidus;
    Trapelus agilis;
    Trapelus ruderatus;
    Trapelus sanguinolentus;
    Phrynocephalus arabicus;
    Phrynocephalus mystaceus;
    Phrynocephalus helioscopus;
    Phrynocephalus interscapularis;
    Phrynocephalus maculatus;
    Phrynocephalus ornatus;
    Phrynocephalus persicus;
    Phrynocephalus przewalskii;
    Phrynocephalus reticulatus;
    Phrynocephalus versicolor;
    Phrynocephalus scutellatus;
    Phrynocephalus raddei;
    Phrynocephalus guttatus;
    Phrynocephalus axillaris;
    Phrynocephalus forsythii;
    Phrynosoma platyrhinos;
    Phrynosoma solare;
    Phrynosoma cornutum;
    Phrynosoma mcallii;
    Phrynosoma goodei;
    Phrynosoma modestum;
    Phrynosoma asio;
    Phrynosoma cerroense;
    Phrynosoma douglasii;
    Dipsosaurus dorsalis;
    Sauromalus ater;
    Sauromalus hispidus;
    Sauromalus varius;
    Sauromalus klauberi;
    Sauromalus slevini;
    Heloderma suspectum;
    Crotaphytus collaris;
    Crotaphytus bicinctores;
    Crotaphytus reticulatus;
    Crotaphytus nebrius;
    Crotaphytus vestigium;
    Gambelia wislizenii;
    Gambelia sila;
    Gambelia copeii;
    Callisaurus draconoides;
    Uma notata;
    Uma scoparia;
    Uma inornata;
    Uma exsul;
    Uma paraphygas;
    Holbrookia maculata;
    Holbrookia elegans;
    Uta stansburiana;
    Uta squamata;
    Urosaurus ornatus;
    Urosaurus graciosus;
    Sceloporus magister;
    Sceloporus clarkii;
    Sceloporus occidentalis;
    Sceloporus olivaceus;
    Aspidoscelis tigris;
    Aspidoscelis uniparens;
    Aspidoscelis sonorae;
    Aspidoscelis inornata;
    Aspidoscelis exsanguis;
    Aspidoscelis neomexicana;
    Aspidoscelis velox;
    Acanthodactylus boskianus;
    Acanthodactylus scutellatus;
    Acanthodactylus dumerilii;
    Acanthodactylus longipes;
    Acanthodactylus aureus;
    Acanthodactylus beershebensis;
    Acanthodactylus schmidti;
    Acanthodactylus opheodurus;
    Acanthodactylus orientalis;
    Acanthodactylus robustus;
    Acanthodactylus tilburyi;
    Eremias velox;
    Eremias arguta;
    Eremias grammica;
    Eremias intermedia;
    Eremias lineolata;
    Eremias scripta;
    Eremias vermiculata;
    Eremias przewalskii;
    Mesalina guttulata;
    Mesalina olivieri;
    Mesalina rubropunctata;
    Mesalina brevirostris;
    Mesalina adramitana;
    Mesalina bahaeldini;
    Scincus scincus;
    Scincus mitranus;
    Scincus albifasciatus;
    Scincus hemprichii;
    Chalcides ocellatus;
    Chalcides sphenopsiformis;
    Chalcides sepsoides;
    Chalcides delislei;
    Varanus griseus;
    Varanus bengalensis
  `, [18,21], 85);

  // ============================================================
  // WOESTIJNGEKKO'S
  // ============================================================

  woestijndieren(`
    Stenodactylus sthenodactylus;
    Stenodactylus petrii;
    Stenodactylus doriae;
    Stenodactylus stenurus;
    Stenodactylus leptocosymbotes;
    Stenodactylus arabicus;
    Stenodactylus grandiceps;
    Stenodactylus pulcher;
    Stenodactylus mauritanicus;
    Stenodactylus affinis;
    Tropiocolotes steudneri;
    Tropiocolotes tripolitanus;
    Tropiocolotes nattereri;
    Tropiocolotes scorteccii;
    Tropiocolotes bisharicus;
    Tropiocolotes somalicus;
    Tropiocolotes nubicus;
    Tropiocolotes wolfgangboehmei;
    Teratoscincus scincus;
    Teratoscincus roborowskii;
    Teratoscincus przewalskii;
    Teratoscincus microlepis;
    Teratoscincus bedriagai;
    Teratoscincus keyserlingii;
    Teratoscincus mesriensis;
    Pachydactylus rangei;
    Pachydactylus vanzyli;
    Pachydactylus austeni;
    Pachydactylus namaquensis;
    Pachydactylus serval;
    Pachydactylus rugosus;
    Pachydactylus weberi;
    Pachydactylus montanus;
    Pachydactylus labialis;
    Pachydactylus mariquensis;
    Rhoptropus afer;
    Rhoptropus bradfieldi;
    Rhoptropus boultoni;
    Rhoptropus barnardi;
    Rhoptropus diporus;
    Rhoptropus taeniostictus;
    Coleonyx variegatus;
    Coleonyx switaki;
    Coleonyx brevis;
    Coleonyx reticulatus
  `, [18,21], 90);

  // ============================================================
  // WOESTIJNSLANGEN
  // ============================================================

  woestijndieren(`
    Cerastes cerastes;
    Cerastes vipera;
    Cerastes gasperettii;
    Echis coloratus;
    Echis pyramidum;
    Echis carinatus;
    Echis omanensis;
    Pseudocerastes persicus;
    Pseudocerastes fieldi;
    Pseudocerastes urarachnoides;
    Bitis peringueyi;
    Bitis caudalis;
    Bitis cornuta;
    Bitis xeropaga;
    Bitis schneideri;
    Crotalus cerastes;
    Crotalus scutulatus;
    Crotalus atrox;
    Crotalus mitchellii;
    Crotalus stephensi;
    Crotalus pyrrhus;
    Crotalus ruber;
    Crotalus tigris;
    Crotalus lepidus;
    Crotalus molossus;
    Crotalus basiliscus;
    Crotalus enyo;
    Crotalus catalinensis;
    Sistrurus catenatus;
    Sistrurus tergeminus;
    Pseudonaja mengdeni;
    Acanthophis pyrrhus
  `, [18,21,45], 85);

  woestijndieren(`
    Eryx jaculus;
    Eryx colubrinus;
    Eryx miliaris;
    Eryx tataricus;
    Eryx johnii;
    Eryx conicus;
    Eryx jayakari;
    Eryx somalicus;
    Eryx muelleri;
    Eryx elegans;
    Lichanura trivirgata;
    Lichanura orcutti;
    Charina bottae;
    Chionactis occipitalis;
    Chionactis palarostris;
    Sonora semiannulata;
    Sonora episcopa;
    Sonora straminea;
    Sonora mosaueri;
    Sonora aemula;
    Rhinocheilus lecontei;
    Salvadora hexalepis;
    Salvadora grahamiae;
    Masticophis flagellum;
    Masticophis bilineatus;
    Masticophis taeniatus;
    Masticophis piceus;
    Pituophis catenifer;
    Lampropeltis splendida;
    Lampropeltis californiae;
    Lampropeltis getula;
    Arizona elegans;
    Arizona pacata;
    Chilomeniscus stramineus;
    Spalerosophis diadema;
    Spalerosophis atriceps;
    Spalerosophis cliffordi;
    Spalerosophis dolichospilus;
    Lytorhynchus diadema;
    Lytorhynchus maynardi;
    Lytorhynchus gaddi;
    Lytorhynchus kennedyi;
    Lytorhynchus ridgewayi;
    Psammophis schokari;
    Psammophis aegyptius
  `, [18,21], 85);

  // ============================================================
  // WOESTIJNKEVERS
  // ============================================================

  woestijndieren(`
    Onymacris unguicularis;
    Onymacris plana;
    Onymacris bicolor;
    Onymacris rugatipennis;
    Onymacris laeviceps;
    Onymacris marginipennis;
    Onymacris multistriata;
    Onymacris boschimana;
    Stenocara gracilipes;
    Stenocara dentata;
    Stenocara eburnea;
    Stenocara gibbipennis;
    Physasterna cribripes;
    Physasterna globosa;
    Lepidochora discoidalis;
    Lepidochora kahani;
    Lepidochora porti;
    Cardiosis fairmairei;
    Zophosis punctata;
    Zophosis moralesi;
    Zophosis boei;
    Zophosis dorsata;
    Zophosis dilatata;
    Zophosis orbicularis;
    Zophosis pharaonis;
    Zophosis quadrilineata;
    Adesmia cancellata;
    Adesmia dilatata;
    Adesmia metallica;
    Adesmia montana;
    Adesmia procera;
    Adesmia ulcerosa;
    Pimelia bipunctata;
    Pimelia angulata;
    Pimelia arabica;
    Pimelia grandis;
    Pimelia laevigata;
    Pimelia rugosa;
    Pimelia simplex;
    Pimelia rotundata;
    Pimelia sericea;
    Pimelia subquadrata;
    Blaps polychresta;
    Blaps sulcata;
    Blaps nitens;
    Blaps propheta;
    Eleodes obscura;
    Eleodes armata;
    Eleodes longicollis;
    Eleodes hispilabris;
    Eleodes acuticauda;
    Eleodes carbonaria;
    Eleodes dentipes;
    Eleodes extricata;
    Eleodes pilosa;
    Eleodes suturalis;
    Eleodes tricostata;
    Eleodes tribulus;
    Asbolus verrucosus;
    Cryptoglossa muricata;
    Cryptoglossa variolosa;
    Coelus ciliatus;
    Edrotes ventricosus;
    Eusattus muricatus;
    Eusattus reticulatus;
    Eusattus dubius;
    Triorophus laevis;
    Triorophus punctatus;
    Embaphion muricatum
  `, [7], 90);

  // ============================================================
  // WOESTIJNSCHORPIOENEN
  // ============================================================

  woestijndieren(`
    Androctonus australis;
    Androctonus amoreuxi;
    Androctonus bicolor;
    Androctonus crassicauda;
    Androctonus mauritanicus;
    Androctonus liouvillei;
    Leiurus quinquestriatus;
    Leiurus hebraeus;
    Leiurus jordanensis;
    Leiurus arabicus;
    Leiurus haenggii;
    Leiurus abdullahbayrami;
    Leiurus macroctenus;
    Buthus occitanus;
    Buthus atlantis;
    Buthus egyptiensis;
    Buthus mariefranceae;
    Buthus tunetanus;
    Buthus draa;
    Buthus lienhardi;
    Buthus mardochei;
    Buthacus arenicola;
    Buthacus leptochelys;
    Buthacus macrocentrus;
    Buthacus spatzi;
    Buthacus nigroaculeatus;
    Apistobuthus pterygocercus;
    Apistobuthus susanae;
    Orthochirus scrobiculosus;
    Orthochirus innesi;
    Orthochirus negebensis;
    Orthochirus iraqus;
    Hottentotta judaicus;
    Hottentotta saulcyi;
    Hottentotta jayakari;
    Hottentotta salei;
    Hottentotta schach;
    Parabuthus transvaalicus;
    Parabuthus villosus;
    Parabuthus granulatus;
    Parabuthus kraepelini;
    Parabuthus brevimanus;
    Parabuthus capensis;
    Parabuthus namibensis;
    Parabuthus stridulus;
    Parabuthus laevifrons;
    Hadrurus arizonensis;
    Hadrurus spadix;
    Hadrurus hirsutus;
    Hadrurus concolorous;
    Hoffmannihadrurus aztecus;
    Centruroides sculpturatus;
    Centruroides exilicauda;
    Vaejovis spinigerus;
    Paravaejovis spinigerus;
    Paruroctonus boreus;
    Paruroctonus mesaensis;
    Paruroctonus gracilior;
    Paruroctonus silvestrii;
    Paruroctonus utahensis;
    Paruroctonus becki;
    Smeringurus mesaensis;
    Smeringurus vachoni;
    Smeringurus grandis;
    Smeringurus aridus;
    Superstitionia donensis;
    Urodacus yaschenkoi;
    Urodacus armatus;
    Urodacus manicatus;
    Urodacus elongatus;
    Urodacus novaehollandiae;
    Urodacus hoplurus
  `, [17,45], 90);

  // ============================================================
  // NEDERLANDSE ZOOGDIEREN
  // ============================================================

  nederlandseDieren(`
    Egel;
    Europese mol;
    Bosspitsmuis=Sorex araneus;
    Dwergspitsmuis=Sorex minutus;
    Tweekleurige bosspitsmuis=Sorex coronatus;
    Huisspitsmuis=Crocidura russula;
    Veldspitsmuis=Crocidura leucodon;
    Waterspitsmuis=Neomys fodiens;
    Kleine waterspitsmuis=Neomys anomalus;
    Gewone dwergvleermuis=Pipistrellus pipistrellus;
    Ruige dwergvleermuis=Pipistrellus nathusii;
    Kleine dwergvleermuis=Pipistrellus pygmaeus;
    Laatvlieger=Eptesicus serotinus;
    Rosse vleermuis=Nyctalus noctula;
    Bosvleermuis=Nyctalus leisleri;
    Watervleermuis=Myotis daubentonii;
    Meervleermuis=Myotis dasycneme;
    Baardvleermuis=Myotis mystacinus;
    Brandts vleermuis=Myotis brandtii;
    Franjestaart=Myotis nattereri;
    Ingekorven vleermuis=Myotis emarginatus;
    Bechsteins vleermuis=Myotis bechsteinii;
    Vale vleermuis=Myotis myotis;
    Gewone grootoorvleermuis=Plecotus auritus;
    Grijze grootoorvleermuis=Plecotus austriacus;
    Tweekleurige vleermuis=Vespertilio murinus;
    Mopsvleermuis=Barbastella barbastellus;
    Europese haas=Lepus europaeus;
    Konijn=Oryctolagus cuniculus;
    Rode eekhoorn;
    Bever;
    Hamster=Cricetus cricetus;
    Veldmuis=Microtus arvalis;
    Aardmuis=Microtus agrestis;
    Noordse woelmuis=Alexandromys oeconomus=Microtus oeconomus;
    Ondergrondse woelmuis=Microtus subterraneus;
    Rosse woelmuis;
    Woelrat=Arvicola amphibius;
    Dwergmuis=Micromys minutus;
    Bosmuis;
    Grote bosmuis;
    Huismuis=Mus musculus;
    Bruine rat=Rattus norvegicus;
    Zwarte rat=Rattus rattus;
    Muskusrat;
    Beverrat;
    Hazelmuis;
    Eikelmuis;
    Rode vos;
    Wolf;
    Goudjakhals=Canis aureus;
    Wasbeer;
    Wasbeerhond;
    Wezel;
    Hermelijn;
    Bunzing;
    Steenmarter;
    Boommarter;
    Europese das;
    Europese otter;
    Amerikaanse nerts;
    Wild zwijn;
    Edelhert;
    Damhert;
    Ree;
    Moeflon=Ovis gmelini musimon;
    Gewone zeehond;
    Grijze zeehond;
    Bruinvis
  `, [20], 55);

  // ============================================================
  // NEDERLANDSE REPTIELEN EN AMFIBIEËN
  // ============================================================

  nederlandseDieren(`
    Adder=Vipera berus;
    Gladde slang=Coronella austriaca;
    Ringslang=Natrix helvetica;
    Zandhagedis=Lacerta agilis;
    Levendbarende hagedis=Zootoca vivipara;
    Muurhagedis=Podarcis muralis;
    Hazelworm=Anguis fragilis
  `, [18,21], 45);

  nederlandseDieren(`
    Bruine kikker=Rana temporaria;
    Heikikker=Rana arvalis;
    Meerkikker=Pelophylax ridibundus;
    Poelkikker=Pelophylax lessonae;
    Bastaardkikker=Pelophylax esculentus;
    Boomkikker=Hyla arborea;
    Gewone pad=Bufo bufo;
    Rugstreeppad=Epidalea calamita;
    Knoflookpad=Pelobates fuscus;
    Vroedmeesterpad=Alytes obstetricans;
    Geelbuikvuurpad=Bombina variegata;
    Vuursalamander=Salamandra salamandra;
    Kleine watersalamander=Lissotriton vulgaris;
    Vinpootsalamander=Lissotriton helveticus;
    Alpenwatersalamander=Ichthyosaura alpestris;
    Kamsalamander=Triturus cristatus;
    Italiaanse kamsalamander=Triturus carnifex;
    Amerikaanse stierkikker=Lithobates catesbeianus
  `, [4], 55);

  // ============================================================
  // NEDERLANDSE DAGVLINDERS
  // ============================================================

  nederlandseDieren(`
    Dagpauwoog=Aglais io;
    Kleine vos=Aglais urticae;
    Atalanta=Vanessa atalanta;
    Distelvlinder=Vanessa cardui;
    Gehakkelde aurelia;
    Landkaartje=Araschnia levana;
    Rouwmantel;
    Grote vos;
    Oostelijke vos;
    Citroenvlinder;
    Oranjetipje=Anthocharis cardamines;
    Groot koolwitje=Pieris brassicae;
    Klein koolwitje=Pieris rapae;
    Klein geaderd witje=Pieris napi;
    Scheefbloemwitje=Pieris mannii;
    Resedawitje=Pontia daplidice;
    Oranje luzernevlinder=Colias croceus;
    Gele luzernevlinder=Colias hyale;
    Koninginnenpage=Papilio machaon;
    Koningspage=Iphiclides podalirius;
    Bont zandoogje;
    Bruin zandoogje=Maniola jurtina;
    Oranje zandoogje=Pyronia tithonus;
    Koevinkje=Aphantopus hyperantus;
    Hooibeestje=Coenonympha pamphilus;
    Argusvlinder=Lasiommata megera;
    Heivlinder=Hipparchia semele;
    Kleine heivlinder=Hipparchia statilinus;
    Groot dikkopje=Ochlodes sylvanus;
    Geelsprietdikkopje=Thymelicus sylvestris;
    Zwartsprietdikkopje=Thymelicus lineola;
    Bont dikkopje=Carterocephalus palaemon;
    Kommavlinder=Hesperia comma;
    Aardbeivlinder=Pyrgus malvae;
    Bruin dikkopje=Erynnis tages;
    Spiegeldikkopje=Heteropterus morpheus;
    Icarusblauwtje=Polyommatus icarus;
    Bruin blauwtje=Aricia agestis;
    Heideblauwtje=Plebejus argus;
    Vals heideblauwtje=Lycaeides idas;
    Boomblauwtje;
    Klaverblauwtje=Cyaniris semiargus;
    Dwergblauwtje=Cupido minimus;
    Staartblauwtje=Cupido argiades;
    Tijgerblauwtje=Lampides boeticus;
    Pimpernelblauwtje=Phengaris teleius;
    Donker pimpernelblauwtje=Phengaris nausithous;
    Gentiaanblauwtje=Phengaris alcon;
    Kleine vuurvlinder=Lycaena phlaeas;
    Grote vuurvlinder=Lycaena dispar;
    Bruine vuurvlinder=Lycaena tityrus;
    Eikenpage;
    Iepenpage;
    Sleedoornpage;
    Bruine eikenpage;
    Pruimenpage;
    Groentje;
    Grote weerschijnvlinder;
    Kleine weerschijnvlinder;
    Kleine ijsvogelvlinder;
    Keizersmantel;
    Grote parelmoervlinder;
    Duinparelmoervlinder=Fabriciana niobe;
    Kleine parelmoervlinder=Issoria lathonia;
    Zilveren maan;
    Veldparelmoervlinder=Melitaea cinxia;
    Bosparelmoervlinder=Melitaea athalia;
    Boswitje
  `, [2,7], 65);

  // ============================================================
  // NEDERLANDSE NACHTVLINDERS
  // ============================================================

  nederlandseDieren(`
    Kolibrievlinder=Macroglossum stellatarum;
    Doodshoofdvlinder=Acherontia atropos;
    Windepijlstaart=Agrius convolvuli;
    Ligusterpijlstaart=Sphinx ligustri;
    Dennenpijlstaart=Sphinx pinastri;
    Pauwoogpijlstaart=Smerinthus ocellata;
    Populierenpijlstaart=Laothoe populi;
    Lindepijlstaart=Mimas tiliae;
    Groot avondrood=Deilephila elpenor;
    Klein avondrood=Deilephila porcellus;
    Walstropijlstaart=Hyles gallii;
    Wolfsmelkpijlstaart=Hyles euphorbiae;
    Oleanderpijlstaart=Daphnis nerii;
    Glasvleugelpijlstaart=Hemaris fuciformis;
    Hemaris tityus;
    Nachtpauwoog=Saturnia pavonia;
    Tauvlinder=Aglia tau;
    Veelvraat=Macrothylacia rubi;
    Hageheld=Lasiocampa quercus;
    Kleine hageheld=Lasiocampa trifolii;
    Rietvink=Euthrix potatoria;
    Ringelrups=Malacosoma neustria;
    Malacosoma castrensis;
    Wapendrager=Phalera bucephala;
    Dromedaris=Notodonta dromedarius;
    Notodonta ziczac;
    Notodonta tritophus;
    Notodonta torva;
    Kameeltje=Ptilodon capucina;
    Ptilodon cucullina;
    Eikenprocessierups=Thaumetopoea processionea;
    Plakker=Lymantria dispar;
    Nonvlinder=Lymantria monacha;
    Donsvlinder=Euproctis similis;
    Bastaardsatijnvlinder=Euproctis chrysorrhoea;
    Meriansborstel=Calliteara pudibunda;
    Witvlakvlinder=Orgyia antiqua;
    Grote beer=Arctia caja;
    Kleine beer=Phragmatobia fuliginosa;
    Sint-jacobsvlinder=Tyria jacobaeae;
    Sint-jansvlinder=Zygaena filipendulae;
    Geel beertje=Eilema sororcula;
    Eilema lurideola;
    Eilema complana;
    Eilema griseola;
    Eilema depressa;
    Eilema caniola;
    Eilema pygmaeola;
    Atolmis rubricollis;
    Lithosia quadra;
    Miltochrista miniata;
    Pelosia muscerda;
    Nudaria mundana;
    Spilosoma lubricipeda;
    Spilosoma lutea;
    Spilosoma urticae;
    Diaphora mendica;
    Diacrisia sannio;
    Arctia villica;
    Euplagia quadripunctaria;
    Callimorpha dominula;
    Utetheisa pulchella;
    Gamma-uil=Autographa gamma;
    Autographa pulchrina;
    Autographa jota;
    Autographa bractea;
    Plusia festucae;
    Plusia putnami;
    Diachrysia chrysitis;
    Diachrysia stenochrysis;
    Macdunnoughia confusa;
    Trichoplusia ni;
    Abrostola tripartita;
    Abrostola triplasia;
    Noctua pronuba;
    Noctua comes;
    Noctua fimbriata;
    Noctua janthina;
    Noctua janthe;
    Noctua interjecta;
    Agrotis ipsilon;
    Agrotis exclamationis;
    Agrotis segetum;
    Agrotis puta;
    Agrotis vestigialis;
    Agrotis ripae;
    Agrotis clavis;
    Xestia c-nigrum;
    Xestia xanthographa;
    Xestia sexstrigata;
    Xestia baja;
    Xestia triangulum;
    Xestia rhomboidea;
    Xestia agathina;
    Xestia castanea;
    Xestia stigmatica;
    Xestia ditrapezium;
    Diarsia rubi;
    Diarsia brunnea;
    Diarsia mendica;
    Diarsia dahlii;
    Ochropleura plecta;
    Axylia putris;
    Peridroma saucia;
    Eugnorisma glareosa;
    Euxoa nigricans;
    Euxoa tritici;
    Euxoa cursoria;
    Euxoa obelisca;
    Euxoa aquilina;
    Cerastis rubricosa;
    Cerastis leucographa;
    Orthosia cerasi;
    Orthosia gothica;
    Orthosia incerta;
    Orthosia cruda;
    Orthosia gracilis;
    Orthosia munda;
    Orthosia opima;
    Orthosia populeti;
    Anorthoa munda;
    Panolis flammea;
    Egira conspicillaris;
    Mamestra brassicae;
    Melanchra persicariae;
    Lacanobia oleracea;
    Lacanobia thalassina;
    Lacanobia suasa;
    Lacanobia w-latinum;
    Hada plebeja;
    Hadena bicruris;
    Hadena confusa;
    Hadena rivularis;
    Hadena compta;
    Hadena perplexa;
    Hadena albimacula;
    Sideridis rivularis;
    Sideridis turbida;
    Mythimna pallens;
    Mythimna impura;
    Mythimna conigera;
    Mythimna ferrago;
    Mythimna pudorina;
    Mythimna straminea;
    Mythimna albipuncta;
    Mythimna l-album;
    Mythimna vitellina;
    Mythimna unipuncta;
    Mythimna comma;
    Leucania obsoleta;
    Leucania comma;
    Leucania loreyi;
    Aletia pallens;
    Aletia impura;
    Apamea monoglypha;
    Apamea crenata;
    Apamea lateritia;
    Apamea remissa;
    Apamea anceps;
    Apamea sordens;
    Apamea unanimis;
    Apamea ophiogramma;
    Apamea lithoxylaea;
    Apamea sublustris;
    Apamea epomidion;
    Apamea scolopacina;
    Oligia strigilis;
    Oligia versicolor;
    Oligia latruncula;
    Mesoligia furuncula;
    Mesapamea secalis;
    Mesapamea secalella;
    Luperina testacea;
    Luperina nickerlii;
    Amphipoea oculea;
    Amphipoea fucosa;
    Amphipoea lucens;
    Hydraecia micacea;
    Hydraecia petasitis;
    Gortyna flavago;
    Celaena leucostigma;
    Nonagria typhae;
    Archanara dissoluta;
    Archanara geminipuncta;
    Archanara neurica;
    Globia sparganii;
    Rhizedra lutosa;
    Arenostola phragmitidis;
    Photedes minima;
    Photedes fluxa;
    Photedes extrema;
    Coenobia rufa;
    Chilodes maritima;
    Charanyca trigrammica;
    Rusina ferruginea;
    Thalpophila matura;
    Trachea atriplicis;
    Euplexia lucipara;
    Phlogophora meticulosa;
    Phlogophora scita;
    Ipimorpha retusa;
    Ipimorpha subtusa;
    Cosmia trapezina;
    Cosmia pyralina;
    Cosmia affinis;
    Cosmia diffinis;
    Dicycla oo;
    Atethmia centrago;
    Xanthia icteritia;
    Xanthia togata;
    Xanthia gilvago;
    Xanthia ocellaris;
    Cirrhia citrago;
    Agrochola circellaris;
    Agrochola lota;
    Agrochola macilenta;
    Agrochola helvola;
    Agrochola litura;
    Agrochola lychnidis;
    Conistra vaccinii;
    Conistra ligula;
    Conistra rubiginosa;
    Conistra erythrocephala;
    Eupsilia transversa;
    Lithophane ornitopus;
    Lithophane socia;
    Lithophane semibrunnea;
    Lithophane furcifera;
    Lithophane hepatica;
    Xylena exsoleta;
    Xylena vetusta;
    Allophyes oxyacanthae;
    Aporophyla nigra;
    Aporophyla lutulenta;
    Aporophyla lueneburgensis;
    Polymixis flavicincta;
    Dichonia aprilina;
    Dichonia convergens;
    Dryobotodes eremita;
    Blepharita satura;
    Mniotype satura;
    Antitype chi;
    Ammoconia caecimacula;
    Brachylomia viminalis;
    Moma alpium;
    Acronicta psi;
    Acronicta tridens;
    Acronicta rumicis;
    Acronicta aceris;
    Acronicta megacephala;
    Acronicta leporina;
    Acronicta auricoma;
    Acronicta euphorbiae;
    Acronicta menyanthidis;
    Acronicta strigosa;
    Acronicta alni;
    Craniophora ligustri;
    Colocasia coryli;
    Diloba caeruleocephala;
    Cucullia umbratica;
    Cucullia chamomillae;
    Cucullia absinthii;
    Cucullia artemisiae;
    Cucullia asteris;
    Cucullia lactucae;
    Cucullia lucifuga;
    Cucullia verbasci;
    Shargacucullia verbasci;
    Calophasia lunula;
    Heliothis viriplaca;
    Heliothis maritima;
    Heliothis peltigera;
    Helicoverpa armigera;
    Pyrrhia umbra;
    Panemeria tenebrata;
    Acontia trabealis;
    Acontia lucida;
    Deltote bankiana;
    Deltote uncula;
    Deltote deceptoria;
    Eublemma parva;
    Eublemma minutata;
    Earias clorana;
    Earias vernana;
    Nycteola revayana;
    Nycteola degenerana;
    Bena bicolorana;
    Pseudoips prasinana;
    Nola cucullatella;
    Nola confusalis;
    Nola aerugula;
    Nola cristatula;
    Meganola albula;
    Meganola strigula;
    Herminia tarsipennalis;
    Herminia grisealis;
    Herminia tarsicrinalis;
    Zanclognatha lunalis;
    Polypogon tentacularia;
    Paracolax tristalis;
    Hypena proboscidalis;
    Hypena rostralis;
    Hypena crassalis;
    Rivula sericealis;
    Laspeyria flexula;
    Scoliopteryx libatrix;
    Catocala nupta;
    Catocala elocata;
    Catocala sponsa;
    Catocala promissa;
    Catocala fraxini;
    Minucia lunaris;
    Euclidia glyphica;
    Euclidia mi;
    Tyta luctuosa;
    Lygephila pastinum;
    Lygephila craccae;
    Lygephila viciae;
    Dysgonia algira;
    Ophiusa tirhaca
  `, [7], 90);

  // ============================================================
  // NEDERLANDSE SPANNERS
  // ============================================================

  nederlandseDieren(`
    Biston betularia;
    Biston strataria;
    Agriopis aurantiaria;
    Agriopis leucophaearia;
    Agriopis marginaria;
    Erannis defoliaria;
    Operophtera brumata;
    Operophtera fagata;
    Epirrita dilutata;
    Epirrita autumnata;
    Epirrita christyi;
    Alsophila aescularia;
    Apocheima hispidaria;
    Lycia hirtaria;
    Lycia zonaria;
    Phigalia pilosaria;
    Colotois pennaria;
    Ourapteryx sambucaria;
    Ennomos alniaria;
    Ennomos fuscantaria;
    Ennomos erosaria;
    Ennomos quercinaria;
    Ennomos autumnaria;
    Selenia dentaria;
    Selenia lunularia;
    Selenia tetralunaria;
    Crocallis elinguaria;
    Angerona prunaria;
    Opisthograptis luteolata;
    Plagodis dolabraria;
    Plagodis pulveraria;
    Cepphis advenaria;
    Apeira syringaria;
    Peribatodes rhomboidaria;
    Peribatodes secundaria;
    Alcis repandata;
    Alcis jubata;
    Hypomecis punctinalis;
    Hypomecis roboraria;
    Ascotis selenaria;
    Cleorodes lichenaria;
    Deileptenia ribeata;
    Paradarisa consonaria;
    Ectropis crepuscularia;
    Aethalura punctulata;
    Ematurga atomaria;
    Bupalus piniaria;
    Lomographa temerata;
    Lomographa bimaculata;
    Cabera pusaria;
    Cabera exanthemata;
    Campaea margaritata;
    Campaea honoraria;
    Hylaea fasciaria;
    Pungeleria capreolaria;
    Theria primaria;
    Theria rupicapraria;
    Pachycnemia hippocastanaria;
    Dyscia fagaria;
    Gnophos obscurata;
    Charissa obscurata;
    Elophos dilucidaria;
    Siona lineata;
    Aspitates gilvaria;
    Aspitates ochrearia;
    Lythria cruentaria;
    Lythria purpuraria;
    Geometra papilionaria;
    Hemithea aestivaria;
    Hemistola chrysoprasaria;
    Chlorissa viridata;
    Thalera fimbrialis;
    Jodis lactearia;
    Jodis putata;
    Pseudoterpna pruinata;
    Comibaena bajularia;
    Cyclophora punctaria;
    Cyclophora linearia;
    Cyclophora annularia;
    Cyclophora albipunctata;
    Cyclophora pendularia;
    Cyclophora porata;
    Cyclophora quercimontaria;
    Cyclophora ruficiliaria;
    Timandra comae;
    Scopula immutata;
    Scopula nigropunctata;
    Scopula ornata;
    Scopula marginepunctata;
    Scopula floslactata;
    Scopula immorata;
    Scopula rubiginata;
    Scopula emutaria;
    Scopula ternata;
    Scopula umbelaria;
    Idaea aversata;
    Idaea biselata;
    Idaea dimidiata;
    Idaea seriata;
    Idaea rusticata;
    Idaea fuscovenosa;
    Idaea straminata;
    Idaea sylvestraria;
    Idaea inquinata;
    Idaea subsericeata;
    Idaea humiliata;
    Idaea ochrata;
    Idaea muricata;
    Idaea emarginata;
    Idaea degeneraria;
    Idaea dilutaria;
    Idaea pallidata;
    Idaea trigeminata;
    Rhodostrophia vibicaria;
    Xanthorhoe fluctuata;
    Xanthorhoe ferrugata;
    Xanthorhoe spadicearia;
    Xanthorhoe montanata;
    Xanthorhoe designata;
    Xanthorhoe biriviata;
    Xanthorhoe quadrifasiata;
    Epirrhoe alternata;
    Epirrhoe rivata;
    Epirrhoe tristata;
    Epirrhoe galiata;
    Camptogramma bilineata;
    Catarhoe cuculata;
    Catarhoe rubidata;
    Eulithis prunata;
    Eulithis populata;
    Eulithis testata;
    Eulithis mellinata;
    Eulithis pyraliata;
    Ecliptopera silaceata;
    Ecliptopera capitata;
    Chloroclysta siterata;
    Chloroclysta miata;
    Dysstroma truncata;
    Dysstroma citrata;
    Plemyria rubiginata;
    Thera variata;
    Thera britannica;
    Thera obeliscata;
    Thera firmata;
    Thera juniperata;
    Thera cupressata;
    Pennithera firmata;
    Colostygia pectinataria;
    Hydriomena furcata;
    Hydriomena impluviata;
    Hydriomena ruberata;
    Electrophaes corylata;
    Coenotephria ablutaria;
    Lampropteryx suffumata;
    Lampropteryx otregiata;
    Nebula salicata;
    Earophila badiata;
    Anticlea derivata;
    Anticlea badiata;
    Mesoleuca albicillata;
    Melanthia procellata;
    Rheumaptera undulata;
    Rheumaptera hastata;
    Triphosa dubitata;
    Philereme vetulata;
    Philereme transversata;
    Horisme tersata;
    Horisme vitalbata;
    Horisme radicaria;
    Horisme aemulata;
    Horisme corticata;
    Ligdia adustata;
    Abraxas grossulariata;
    Abraxas sylvata;
    Lomaspilis marginata;
    Acasis viretata;
    Acasis appensata;
    Gymnoscelis rufifasciata;
    Chloroclystis v-ata;
    Pasiphila rectangulata;
    Pasiphila chloerata;
    Pasiphila debiliata;
    Eupithecia vulgata;
    Eupithecia assimilata;
    Eupithecia absinthiata;
    Eupithecia expallidata;
    Eupithecia assimilata;
    Eupithecia centaureata;
    Eupithecia linariata;
    Eupithecia pulchellata;
    Eupithecia pyreneata;
    Eupithecia laquaearia;
    Eupithecia exiguata;
    Eupithecia insigniata;
    Eupithecia abbreviata;
    Eupithecia dodoneata;
    Eupithecia irriguata;
    Eupithecia inturbata;
    Eupithecia tenuiata;
    Eupithecia pygmaeata;
    Eupithecia plumbeolata;
    Eupithecia haworthiata;
    Eupithecia venosata;
    Eupithecia egenaria;
    Eupithecia actaeata;
    Eupithecia tripunctaria;
    Eupithecia trisignaria;
    Eupithecia selinata;
    Eupithecia icterata;
    Eupithecia succenturiata;
    Eupithecia millefoliata;
    Eupithecia distinctaria;
    Eupithecia indigata;
    Eupithecia tantillaria;
    Eupithecia lariciata;
    Eupithecia virgaureata;
    Eupithecia subfuscata;
    Eupithecia nanata;
    Eupithecia innotata;
    Eupithecia abbreviata;
    Eupithecia ochridata;
    Eupithecia pimpinellata;
    Eupithecia satyrata;
    Eupithecia intricata;
    Eupithecia pusillata;
    Eupithecia lanceata;
    Eupithecia conterminata
  `, [7], 90);

  // ============================================================
  // NEDERLANDSE LIBELLEN
  // ============================================================

  nederlandseDieren(`
    Weidebeekjuffer=Calopteryx splendens;
    Bosbeekjuffer=Calopteryx virgo;
    Houtpantserjuffer=Chalcolestes viridis;
    Gewone pantserjuffer=Lestes sponsa;
    Tangpantserjuffer=Lestes dryas;
    Tengere pantserjuffer=Lestes virens;
    Zwervende pantserjuffer=Lestes barbarus;
    Noordse winterjuffer=Sympecma paedisca;
    Bruine winterjuffer=Sympecma fusca;
    Blauwe breedscheenjuffer=Platycnemis pennipes;
    Azuurwaterjuffer=Coenagrion puella;
    Variabele waterjuffer=Coenagrion pulchellum;
    Speerwaterjuffer=Coenagrion hastulatum;
    Maanwaterjuffer=Coenagrion lunulatum;
    Donkere waterjuffer=Coenagrion armatum;
    Mercuurwaterjuffer=Coenagrion mercuriale;
    Watersnuffel=Enallagma cyathigerum;
    Lantaarntje=Ischnura elegans;
    Tengere grasjuffer=Ischnura pumilio;
    Vuurjuffer=Pyrrhosoma nymphula;
    Grote roodoogjuffer=Erythromma najas;
    Kleine roodoogjuffer=Erythromma viridulum;
    Kanaaljuffer=Erythromma lindenii;
    Koraaljuffer=Ceriagrion tenellum;
    Grote keizerlibel;
    Zuidelijke keizerlibel=Anax parthenope;
    Zadellibel=Anax ephippiger;
    Blauwe glazenmaker=Aeshna cyanea;
    Bruine glazenmaker=Aeshna grandis;
    Paardenbijter=Aeshna mixta;
    Venglazenmaker=Aeshna juncea;
    Noordse glazenmaker=Aeshna subarctica;
    Groene glazenmaker=Aeshna viridis;
    Zuidelijke glazenmaker=Aeshna affinis;
    Vroege glazenmaker=Aeshna isoceles;
    Glassnijder=Brachytron pratense;
    Beekrombout;
    Rivierrombout;
    Gaffellibel;
    Kleine tanglibel;
    Plasrombout=Gomphus pulchellus;
    Gewone bronlibel=Cordulegaster boltonii;
    Hoogveenglanslibel=Somatochlora arctica;
    Metaalglanslibel=Somatochlora metallica;
    Gevlekte glanslibel=Somatochlora flavomaculata;
    Smaragdlibel=Cordulia aenea;
    Tweevlek=Epitheca bimaculata;
    Platbuik=Libellula depressa;
    Viervlek=Libellula quadrimaculata;
    Bruine korenbout=Libellula fulva;
    Gewone oeverlibel=Orthetrum cancellatum;
    Beekoeverlibel=Orthetrum coerulescens;
    Zuidelijke oeverlibel=Orthetrum brunneum;
    Vuurlibel=Crocothemis erythraea;
    Bruinrode heidelibel=Sympetrum striolatum;
    Steenrode heidelibel=Sympetrum vulgatum;
    Bloedrode heidelibel=Sympetrum sanguineum;
    Zwarte heidelibel=Sympetrum danae;
    Geelvlekheidelibel=Sympetrum flaveolum;
    Zwervende heidelibel=Sympetrum fonscolombii;
    Bandheidelibel=Sympetrum pedemontanum;
    Kempense heidelibel=Sympetrum depressiusculum;
    Zuidelijke heidelibel=Sympetrum meridionale;
    Venwitsnuitlibel=Leucorrhinia dubia;
    Noordse witsnuitlibel=Leucorrhinia rubicunda;
    Gevlekte witsnuitlibel=Leucorrhinia pectoralis;
    Sierlijke witsnuitlibel=Leucorrhinia caudalis;
    Oostelijke witsnuitlibel=Leucorrhinia albifrons
  `, [2,7,15,17], 75);

  // ============================================================
  // NEDERLANDSE SPRINKHANEN EN KREKELS
  // ============================================================

  nederlandseDieren(`
    Grote groene sabelsprinkhaan=Tettigonia viridissima;
    Tettigonia cantans;
    Struiksprinkhaan=Leptophyes punctatissima;
    Boomsprinkhaan=Meconema thalassinum;
    Zuidelijke boomsprinkhaan=Meconema meridionale;
    Sikkelsprinkhaan=Phaneroptera falcata;
    Phaneroptera nana;
    Greppelsprinkhaan=Roeseliana roeselii;
    Bramesprinkhaan=Pholidoptera griseoaptera;
    Wrattenbijter=Decticus verrucivorus;
    Zadelsprinkhaan=Ephippiger diurnus;
    Heidesabelsprinkhaan=Metrioptera brachyptera;
    Duinsabelsprinkhaan=Platycleis albopunctata;
    Kleine wrattenbijter=Gampsocleis glabra;
    Gewoon spitskopje=Conocephalus dorsalis;
    Zuidelijk spitskopje=Conocephalus fuscus;
    Veenmol=Gryllotalpa gryllotalpa;
    Veldkrekel=Gryllus campestris;
    Huiskrekel=Acheta domesticus;
    Boskrekel=Nemobius sylvestris;
    Boomkrekel=Oecanthus pellucens;
    Moerassprinkhaan=Stethophyma grossum;
    Blauwvleugelsprinkhaan=Oedipoda caerulescens;
    Roodvleugelsprinkhaan=Oedipoda germanica;
    Klappersprinkhaan=Psophus stridulus;
    Kleine goudsprinkhaan=Euthystira brachyptera;
    Gouden sprinkhaan=Chrysochraon dispar;
    Locusta migratoria;
    Mecostethus parapleurus;
    Knopsprietje=Myrmeleotettix maculatus;
    Schavertje=Stenobothrus stigmaticus;
    Zoemertje=Stenobothrus lineatus;
    Negertje=Omocestus rufipes;
    Wekkertje=Omocestus viridulus;
    Veldsprinkhaan=Chorthippus;
    Bruine sprinkhaan=Chorthippus brunneus;
    Ratelaar=Chorthippus biguttulus;
    Snortikker=Chorthippus mollis;
    Kustsprinkhaan=Chorthippus albomarginatus;
    Krasser=Pseudochorthippus parallelus;
    Zompsprinkhaan=Pseudochorthippus montanus;
    Rosse sprinkhaan=Gomphocerippus rufus;
    Steppesprinkhaan=Chorthippus vagans;
    Zeggendoorntje=Tetrix subulata;
    Gewoon doorntje=Tetrix undulata;
    Zanddoorntje=Tetrix ceperoi;
    Bosdoorntje=Tetrix bipunctata;
    Kalkdoorntje=Tetrix tenuicornis
  `, [7], 75);

  // ============================================================
  // NEDERLANDSE HOMMELS EN BIJEN
  // ============================================================

  nederlandseDieren(`
    Honingbij=Apis mellifera;
    Aardhommel=Bombus terrestris;
    Tuinhommel=Bombus hortorum;
    Akkerhommel=Bombus pascuorum;
    Steenhommel=Bombus lapidarius;
    Weidehommel=Bombus pratorum;
    Boomhommel=Bombus hypnorum;
    Veldhommel=Bombus lucorum;
    Grote veldhommel=Bombus magnus;
    Wilgenhommel=Bombus cryptarum;
    Moshommel=Bombus muscorum;
    Heidehommel=Bombus humilis;
    Grashommel=Bombus ruderarius;
    Zandhommel=Bombus veteranus;
    Boshommel=Bombus sylvarum;
    Knautiabij=Andrena hattorfiana;
    Vosje=Andrena fulva;
    Grijze zandbij=Andrena vaga;
    Witbaardzandbij=Andrena barbilabris;
    Grasbij=Andrena flavipes;
    Asbij=Andrena cineraria;
    Andrena haemorrhoa;
    Andrena nigroaenea;
    Andrena nitida;
    Andrena scotica;
    Andrena dorsata;
    Andrena bicolor;
    Andrena minutula;
    Andrena minutuloides;
    Andrena subopaca;
    Andrena labiata;
    Andrena lagopus;
    Andrena lathyri;
    Andrena wilkella;
    Andrena ovatula;
    Andrena similis;
    Andrena afzeliella;
    Andrena chrysosceles;
    Andrena denticulata;
    Andrena fuscipes;
    Andrena lapponica;
    Andrena clarkella;
    Andrena praecox;
    Andrena apicata;
    Andrena mitis;
    Andrena nycthemera;
    Andrena ventralis;
    Andrena ruficrus;
    Andrena fucata;
    Andrena helvola;
    Andrena synadelpha;
    Andrena fulvata;
    Andrena trimmerana;
    Andrena carantonica;
    Andrena tibialis;
    Andrena thoracica;
    Andrena agilissima;
    Andrena pilipes;
    Andrena bimaculata;
    Andrena rosae;
    Andrena florea;
    Andrena marginata;
    Andrena humilis;
    Andrena taraxaci;
    Andrena pandellei;
    Andrena curvungula;
    Andrena nitidiuscula;
    Andrena proxima;
    Andrena alfkenella;
    Andrena falsifica;
    Andrena semilaevis;
    Andrena strohmella;
    Andrena coitana;
    Andrena dorsalis;
    Andrena viridescens;
    Andrena angustior;
    Andrena congruens;
    Andrena combinata;
    Andrena flavilabris;
    Andrena fulvida;
    Andrena intermedia;
    Andrena polita;
    Andrena potentillae;
    Andrena suerinensis;
    Andrena tarsata;
    Andrena rufizona;
    Rosse metselbij=Osmia bicornis=Osmia rufa;
    Gehoornde metselbij=Osmia cornuta;
    Osmia caerulescens;
    Osmia leaiana;
    Osmia aurulenta;
    Osmia bicolor;
    Osmia pilicornis;
    Osmia uncinata;
    Osmia niveata;
    Osmia spinulosa;
    Osmia brevicornis;
    Grote wolbij=Anthidium manicatum;
    Anthidium punctatum;
    Anthidiellum strigatum;
    Megachile rotundata;
    Megachile centuncularis;
    Megachile versicolor;
    Megachile willughbiella;
    Megachile ligniseca;
    Megachile lapponica;
    Megachile circumcincta;
    Megachile maritima;
    Megachile ericetorum;
    Megachile pilidens;
    Megachile leachella;
    Megachile alpicola;
    Megachile nigriventris;
    Heriades truncorum;
    Hoplitis adunca;
    Hoplitis claviventris;
    Hoplitis leucomelana;
    Hoplitis tridentata;
    Chelostoma florisomne;
    Chelostoma rapunculi;
    Chelostoma campanularum;
    Chelostoma distinctum;
    Chelostoma foveolatum;
    Anthophora plumipes;
    Anthophora furcata;
    Anthophora quadrimaculata;
    Anthophora retusa;
    Anthophora bimaculata;
    Anthophora borealis;
    Eucera longicornis;
    Eucera nigrescens;
    Tetralonia macroglossa;
    Melitta haemorrhoidalis;
    Melitta leporina;
    Melitta nigricans;
    Melitta tricincta;
    Dasypoda hirtipes;
    Dasypoda argentata;
    Macropis europaea;
    Macropis fulvipes;
    Colletes cunicularius;
    Colletes daviesanus;
    Colletes fodiens;
    Colletes similis;
    Colletes succinctus;
    Colletes hederae;
    Colletes halophilus;
    Colletes impunctatus;
    Colletes floralis;
    Colletes marginatus;
    Hylaeus communis;
    Hylaeus confusus;
    Hylaeus hyalinatus;
    Hylaeus brevicornis;
    Hylaeus annularis;
    Hylaeus cornutus;
    Hylaeus pictipes;
    Hylaeus signatus;
    Hylaeus nigritus;
    Hylaeus dilatatus;
    Hylaeus punctulatissimus;
    Hylaeus sinuatus;
    Hylaeus rinki;
    Halictus rubicundus;
    Halictus tumulorum;
    Halictus confusus;
    Halictus maculatus;
    Halictus quadricinctus;
    Halictus sexcinctus;
    Halictus scabiosae;
    Halictus simplex;
    Halictus subauratus;
    Lasioglossum calceatum;
    Lasioglossum albipes;
    Lasioglossum malachurum;
    Lasioglossum pauxillum;
    Lasioglossum morio;
    Lasioglossum leucopus;
    Lasioglossum nitidulum;
    Lasioglossum fulvicorne;
    Lasioglossum fratellum;
    Lasioglossum villosulum;
    Lasioglossum minutissimum;
    Lasioglossum semilucens;
    Lasioglossum sexstrigatum;
    Lasioglossum sabulosum;
    Lasioglossum lativentre;
    Lasioglossum leucozonium;
    Lasioglossum zonulum;
    Lasioglossum quadrinotatulum;
    Lasioglossum quadrinotatum;
    Lasioglossum prasinum;
    Lasioglossum intermedium;
    Lasioglossum punctatissimum;
    Lasioglossum brevicorne;
    Lasioglossum aeratum;
    Lasioglossum sexnotatum;
    Lasioglossum subhirtum;
    Lasioglossum xanthopus;
    Lasioglossum laevigatum;
    Lasioglossum laticeps;
    Lasioglossum lissonotum;
    Lasioglossum lucidulum;
    Lasioglossum rufitarse;
    Lasioglossum puncticolle;
    Lasioglossum pauperatum;
    Lasioglossum smeathmanellum;
    Lasioglossum tarsatum
  `, [2,7], 90);

  // ============================================================
  // BOOMDIEREN - EEKHOORNS
  // ============================================================

  boomdieren(`
    Rode eekhoorn;
    Grijze eekhoorn;
    Amerikaanse rode eekhoorn;
    Vosseekhoorn;
    Sciurus griseus;
    Sciurus aberti;
    Sciurus aureogaster;
    Sciurus variegatoides;
    Sciurus deppei;
    Sciurus granatensis;
    Sciurus ignitus;
    Sciurus stramineus;
    Sciurus richmondi;
    Sciurus yucatanensis;
    Sciurus colliaei;
    Sciurus nayaritensis;
    Sciurus oculatus;
    Sciurus alleni;
    Sciurus arizonensis;
    Sciurus flammifer;
    Sciurus gilvigularis;
    Sciurus igniventris;
    Sciurus spadiceus;
    Sciurus pucheranii;
    Sciurus sanborni;
    Sciurus aestuans;
    Sciurus pyrrhinus;
    Callosciurus notatus;
    Callosciurus erythraeus;
    Callosciurus prevostii;
    Callosciurus finlaysonii;
    Callosciurus caniceps;
    Callosciurus nigrovittatus;
    Callosciurus inornatus;
    Callosciurus phayrei;
    Callosciurus pygerythrus;
    Callosciurus orestes;
    Callosciurus adamsi;
    Callosciurus baluensis;
    Callosciurus melanogaster;
    Callosciurus albescens;
    Ratufa indica;
    Ratufa bicolor;
    Ratufa affinis;
    Ratufa macroura;
    Sundasciurus lowii;
    Sundasciurus tenuis;
    Sundasciurus hippurus;
    Sundasciurus brookei;
    Sundasciurus jentinki;
    Sundasciurus robinsoni;
    Sundasciurus altitudinis;
    Sundasciurus fraterculus;
    Sundasciurus juvencus;
    Sundasciurus philippinensis;
    Sundasciurus samarensis;
    Sundasciurus steerii;
    Sundasciurus rabori;
    Dremomys rufigenis;
    Dremomys pernyi;
    Dremomys lokriah;
    Dremomys pyrrhomerus;
    Dremomys gularis;
    Dremomys everetti;
    Tamiops mcclellandii;
    Tamiops maritimus;
    Tamiops swinhoei;
    Tamiops rodolphii;
    Menetes berdmorei
  `, [20], 80);

  // ============================================================
  // VLIEGENDE EEKHOORNS
  // ============================================================

  // Deze dieren zweven.
  // Ze worden niet automatisch bij vraag 2 geplaatst.

  boomdieren(`
    Glaucomys volans;
    Glaucomys sabrinus;
    Glaucomys oregonensis;
    Pteromys volans;
    Pteromys momonga;
    Petaurista petaurista;
    Petaurista alborufus;
    Petaurista elegans;
    Petaurista leucogenys;
    Petaurista philippensis;
    Petaurista magnificus;
    Petaurista nobilis;
    Petaurista xanthotis;
    Petaurista albiventer;
    Petaurista caniceps;
    Petaurista mechukaensis;
    Petaurista mishmiensis;
    Aeretes melanopterus;
    Aeromys tephromelas;
    Aeromys thomasi;
    Belomys pearsonii;
    Biswamoyopterus biswasi;
    Biswamoyopterus laoensis;
    Biswamoyopterus gaoligongensis;
    Eoglaucomys fimbriatus;
    Eupetaurus cinereus;
    Eupetaurus tibetensis;
    Eupetaurus nivamons;
    Hylopetes alboniger;
    Hylopetes spadiceus;
    Hylopetes phayrei;
    Hylopetes lepidus;
    Hylopetes nigripes;
    Hylopetes platyurus;
    Hylopetes sipora;
    Hylopetes winstoni;
    Iomys horsfieldii;
    Iomys sipora;
    Petaurillus emiliae;
    Petaurillus hosei;
    Petaurillus kinlochii;
    Petinomys setosus;
    Petinomys fuscocapillus;
    Petinomys genibarbis;
    Petinomys hageni;
    Petinomys lugens;
    Petinomys mindanensis;
    Petinomys sagitta;
    Petinomys vordermanni;
    Trogopterus xanthipes;
    Pteromyscus pulverulentus
  `, [20], 85);

  // ============================================================
  // BOOMDIEREN - GEKKO'S
  // ============================================================

  boomdieren(`
    Phelsuma grandis;
    Phelsuma madagascariensis;
    Phelsuma laticauda;
    Phelsuma lineata;
    Phelsuma quadriocellata;
    Phelsuma klemmeri;
    Phelsuma cepediana;
    Phelsuma ornata;
    Phelsuma guimbeaui;
    Phelsuma inexpectata;
    Phelsuma borbonica;
    Phelsuma dubia;
    Phelsuma standingi;
    Phelsuma abbotti;
    Phelsuma astriata;
    Phelsuma sundbergi;
    Phelsuma breviceps;
    Phelsuma flavigularis;
    Phelsuma guttata;
    Phelsuma hoeschi;
    Phelsuma kochi;
    Phelsuma modesta;
    Phelsuma nigristriata;
    Phelsuma parkeri;
    Phelsuma pusilla;
    Phelsuma robertmertensi;
    Phelsuma seippi;
    Phelsuma serraticauda;
    Phelsuma vanheygeni;
    Phelsuma v-nigra;
    Uroplatus fimbriatus;
    Uroplatus henkeli;
    Uroplatus sikorae;
    Uroplatus sameiti;
    Uroplatus phantasticus;
    Uroplatus ebenaui;
    Uroplatus lineatus;
    Uroplatus alluaudi;
    Uroplatus guentheri;
    Uroplatus giganteus;
    Uroplatus malahelo;
    Uroplatus pietschmanni;
    Uroplatus finiavana;
    Uroplatus fiera;
    Uroplatus fotsivava;
    Uroplatus kelirambo;
    Uroplatus fivehy;
    Uroplatus garamaso;
    Uroplatus henkeli;
    Correlophus ciliatus;
    Correlophus sarasinorum;
    Correlophus belepensis;
    Rhacodactylus leachianus;
    Rhacodactylus auriculatus;
    Rhacodactylus trachyrhynchus;
    Rhacodactylus trachycephalus;
    Mniarogekko chahoua;
    Mniarogekko jalu;
    Eurydactylodes agricolae;
    Eurydactylodes vieillardi;
    Eurydactylodes symmetricus;
    Eurydactylodes occidentalis;
    Gekko gecko;
    Gekko vittatus;
    Gekko smithii;
    Gekko monarchus;
    Gekko kuhli;
    Gekko lionotum;
    Gekko horsfieldii;
    Gekko cicakterbang;
    Gekko canhi;
    Gekko badenii;
    Gekko petricolus;
    Gehyra mutilata;
    Gehyra oceanica;
    Gehyra variegata;
    Gehyra dubia;
    Gehyra australis;
    Hemidactylus frenatus;
    Hemidactylus platyurus;
    Hemidactylus garnotii;
    Hemidactylus mabouia;
    Hemidactylus brookii
  `, [18,21], 85);

  // ============================================================
  // BOOMKIKKERS
  // ============================================================

  boomdieren(`
    Hyla arborea;
    Hyla orientalis;
    Hyla molleri;
    Hyla meridionalis;
    Hyla intermedia;
    Hyla sarda;
    Hyla savignyi;
    Hyla felixarabica;
    Hyla japonica;
    Dryophytes japonicus;
    Dryophytes cinereus;
    Dryophytes versicolor;
    Dryophytes chrysoscelis;
    Dryophytes gratiosus;
    Dryophytes squirellus;
    Dryophytes femoralis;
    Dryophytes andersonii;
    Dryophytes avivoca;
    Dryophytes arenicolor;
    Dryophytes eximius;
    Dryophytes plicatus;
    Dryophytes wrightorum;
    Dryophytes euphorbiaceus;
    Agalychnis callidryas;
    Agalychnis annae;
    Agalychnis moreletii;
    Agalychnis saltator;
    Agalychnis spurrelli;
    Agalychnis lemur;
    Agalychnis dacnicolor;
    Phyllomedusa bicolor;
    Phyllomedusa sauvagii;
    Phyllomedusa vaillantii;
    Phyllomedusa tarsius;
    Phyllomedusa boliviana;
    Phyllomedusa burmeisteri;
    Phyllomedusa distincta;
    Phyllomedusa iheringii;
    Phyllomedusa tetraploidea;
    Pithecopus hypochondrialis;
    Pithecopus azureus;
    Pithecopus nordestinus;
    Pithecopus rohdei;
    Pithecopus megacephalus;
    Pithecopus ayeaye;
    Pithecopus centralis;
    Pithecopus oreades;
    Pithecopus palliatus;
    Trachycephalus resinifictrix;
    Trachycephalus typhonius;
    Trachycephalus nigromaculatus;
    Trachycephalus venulosus;
    Trachycephalus coriaceus;
    Trachycephalus mesophaeus;
    Trachycephalus mambaiensis;
    Trachycephalus hadroceps;
    Trachycephalus jordani;
    Rhacophorus reinwardtii;
    Rhacophorus nigropalmatus;
    Rhacophorus kio;
    Rhacophorus bipunctatus;
    Rhacophorus rhodopus;
    Rhacophorus malabaricus;
    Rhacophorus lateralis;
    Rhacophorus pardalis;
    Rhacophorus cyanopunctatus;
    Rhacophorus dulitensis;
    Rhacophorus everetti;
    Rhacophorus georgii;
    Rhacophorus gauni;
    Rhacophorus harrisoni;
    Rhacophorus kajau;
    Rhacophorus rufipes;
    Rhacophorus robinsonii;
    Rhacophorus orlovi;
    Rhacophorus hoanglienensis;
    Rhacophorus vampyrus;
    Polypedates leucomystax;
    Polypedates megacephalus;
    Polypedates maculatus;
    Polypedates otilophus;
    Polypedates colletti;
    Polypedates cruciger;
    Polypedates impresus;
    Polypedates braueri;
    Boophis madagascariensis;
    Boophis albilabris;
    Boophis albipunctatus;
    Boophis ankarafensis;
    Boophis anjanaharibeensis;
    Boophis ankaratra;
    Boophis arcanus;
    Boophis axelmeyeri;
    Boophis baetkei;
    Boophis bottae;
    Boophis brachychir;
    Boophis difficilis;
    Boophis elenae;
    Boophis goudotii;
    Boophis idae;
    Boophis liami;
    Boophis luteus;
    Boophis majori;
    Boophis mandraka;
    Boophis microtympanum;
    Boophis occidentalis;
    Boophis periegetes;
    Boophis picturatus;
    Boophis popi;
    Boophis pyrrhus;
    Boophis rappiodes;
    Boophis reticulatus;
    Boophis roseipalmatus;
    Boophis rufioculis;
    Boophis sambirano;
    Boophis tephraeomystax;
    Boophis viridis;
    Boophis williamsi
  `, [4], 90);

  // ============================================================
  // ONDERGRONDSE ZOOGDIEREN - MOLLEN
  // ============================================================

  ondergrondseDieren(`
    Europese mol;
    Talpa occidentalis;
    Talpa caeca;
    Talpa romana;
    Talpa stankovici;
    Talpa levantis;
    Talpa caucasica;
    Talpa altaica;
    Talpa davidiana;
    Talpa aquitania;
    Talpa ognevi;
    Talpa talyschensis;
    Talpa transcaucasica;
    Mogera wogura;
    Mogera imaizumii;
    Mogera tokudae;
    Mogera etigo;
    Mogera insularis;
    Mogera kanoana;
    Mogera robusta;
    Euroscaptor longirostris;
    Euroscaptor micrura;
    Euroscaptor malayana;
    Euroscaptor klossi;
    Euroscaptor parvidens;
    Euroscaptor orlovi;
    Euroscaptor kuznetsovi;
    Euroscaptor subanura;
    Euroscaptor ngoclinhensis;
    Scaptochirus moschatus;
    Parascaptor leucura;
    Uropsilus soricipes;
    Uropsilus gracilis;
    Uropsilus investigator;
    Uropsilus andersoni;
    Scalopus aquaticus;
    Scapanus townsendii;
    Scapanus orarius;
    Scapanus latimanus;
    Scapanus anthonyi;
    Parascalops breweri;
    Stermol=Condylura cristata;
    Neurotrichus gibbsii;
    Scaptonyx fusicaudus
  `, [20], 80);

  // Uropsilus-soorten zijn minder gespecialiseerd
  // in een ondergrondse levenswijze.
  for (const naam of [
    "Uropsilus soricipes",
    "Uropsilus gracilis",
    "Uropsilus investigator",
    "Uropsilus andersoni"
  ]) {
    verwijderKoppeling(naam, [32]);
  }

  // ============================================================
  // GOUDMOLLEN EN MOLRATTEN
  // ============================================================

  ondergrondseDieren(`
    Chrysochloris asiatica;
    Chrysochloris stuhlmanni;
    Cryptochloris wintoni;
    Cryptochloris zyli;
    Eremitalpa granti;
    Amblysomus hottentotus;
    Amblysomus corriae;
    Amblysomus marleyi;
    Amblysomus robustus;
    Amblysomus septentrionalis;
    Amblysomus longiceps;
    Neamblysomus julianae;
    Neamblysomus gunningi;
    Calcochloris obtusirostris;
    Calcochloris tytonis;
    Huetia leucorhina;
    Chlorotalpa duthieae;
    Chlorotalpa sclateri;
    Carpitalpa arendsi;
    Chrysospalax trevelyani;
    Chrysospalax villosus;
    Naakte molrat=Heterocephalus glaber;
    Bathyergus suillus;
    Bathyergus janetta;
    Georychus capensis;
    Cryptomys hottentotus;
    Cryptomys pretoriae;
    Cryptomys natalensis;
    Fukomys damarensis;
    Fukomys anselli;
    Fukomys bocagei;
    Fukomys darlingi;
    Fukomys kafuensis;
    Fukomys mechowii;
    Fukomys micklemi;
    Fukomys ochraceocinereus;
    Fukomys whytei;
    Fukomys zechi;
    Fukomys vandewoestijneae;
    Heliophobius argenteocinereus;
    Heliophobius emini;
    Heliophobius kapiti;
    Heliophobius marungensis;
    Heliophobius mottoulei;
    Heliophobius spalax;
    Spalax microphthalmus;
    Spalax giganteus;
    Spalax arenarius;
    Spalax graecus;
    Spalax zemni;
    Nannospalax leucodon;
    Nannospalax ehrenbergi;
    Nannospalax nehringi;
    Nannospalax galili;
    Nannospalax golani;
    Nannospalax carmeli;
    Nannospalax judaei;
    Eospalax baileyi;
    Eospalax cansus;
    Eospalax fontanierii;
    Eospalax rothschildi;
    Eospalax rufescens;
    Eospalax smithii;
    Myospalax myospalax;
    Myospalax aspalax;
    Myospalax psilurus;
    Ellobius talpinus;
    Ellobius tancrei;
    Ellobius fuscocapillus;
    Ellobius lutescens;
    Ellobius alaicus;
    Prometheomys schaposchnikowi
  `, [20], 90);

  // ============================================================
  // AMERIKAANSE ZAKRATTEN
  // ============================================================

  ondergrondseDieren(`
    Geomys bursarius;
    Geomys pinetis;
    Geomys personatus;
    Geomys texensis;
    Geomys attwateri;
    Geomys breviceps;
    Geomys knoxjonesi;
    Geomys lutescens;
    Geomys arenarius;
    Geomys jugossicularis;
    Geomys streckeri;
    Geomys tropicalis;
    Thomomys bottae;
    Thomomys talpoides;
    Thomomys mazama;
    Thomomys monticola;
    Thomomys townsendii;
    Thomomys bulbivorus;
    Thomomys clusius;
    Thomomys idahoensis;
    Thomomys umbrinus;
    Thomomys atrovarius;
    Thomomys nayarensis;
    Cratogeomys castanops;
    Cratogeomys fulvescens;
    Cratogeomys fumosus;
    Cratogeomys goldmani;
    Cratogeomys merriami;
    Cratogeomys perotensis;
    Cratogeomys planiceps;
    Pappogeomys bulleri;
    Heterogeomys hispidus;
    Heterogeomys heterodus;
    Heterogeomys cherriei;
    Heterogeomys underwoodi;
    Orthogeomys grandis;
    Zygogeomys trichopus
  `, [20], 85);

  // ============================================================
  // ZUID-AMERIKAANSE TUCO-TUCO'S
  // ============================================================

  ondergrondseDieren(`
    Ctenomys australis;
    Ctenomys talarum;
    Ctenomys torquatus;
    Ctenomys mendocinus;
    Ctenomys magellanicus;
    Ctenomys fulvus;
    Ctenomys opimus;
    Ctenomys sociabilis;
    Ctenomys haigi;
    Ctenomys porteousi;
    Ctenomys azarae;
    Ctenomys bergi;
    Ctenomys bonettoi;
    Ctenomys boliviensis;
    Ctenomys brasiliensis;
    Ctenomys colburni;
    Ctenomys coludo;
    Ctenomys conoveri;
    Ctenomys coyhaiquensis;
    Ctenomys dorbignyi;
    Ctenomys dorsalis;
    Ctenomys famosus;
    Ctenomys flamarioni;
    Ctenomys fodax;
    Ctenomys frater;
    Ctenomys goodfellowi;
    Ctenomys guaycuru;
    Ctenomys ibicuiensis;
    Ctenomys juris;
    Ctenomys knighti;
    Ctenomys latro;
    Ctenomys leucodon;
    Ctenomys lewisi;
    Ctenomys lami;
    Ctenomys maulinus;
    Ctenomys minutus;
    Ctenomys nattereri;
    Ctenomys occultus;
    Ctenomys osvaldoreigi;
    Ctenomys pearsoni;
    Ctenomys perrensi;
    Ctenomys pundti;
    Ctenomys rionegrensis;
    Ctenomys roigi;
    Ctenomys saltarius;
    Ctenomys scagliai;
    Ctenomys sericeus;
    Ctenomys steinbachi;
    Ctenomys sylvanus;
    Ctenomys tucumanus;
    Ctenomys tuconax;
    Ctenomys validus;
    Ctenomys viperinus;
    Ctenomys yolandae;
    Ctenomys yatesi;
    Ctenomys andersoni;
    Ctenomys erikacuellarae;
    Ctenomys lessai
  `, [20], 90);

  // ============================================================
  // ONDERGRONDSE BUIDELDIEREN
  // ============================================================

  ondergrondseDieren(`
    Buidelmol=Notoryctes typhlops;
    Notoryctes caurinus;
    Gewone wombat;
    Lasiorhinus latifrons;
    Lasiorhinus krefftii;
    Grote bilby
  `, [20,23], 75);

  // ============================================================
  // WORMHAGEDISSEN
  // ============================================================

  ondergrondseDieren(`
    Amphisbaena alba;
    Amphisbaena fuliginosa;
    Amphisbaena vermicularis;
    Amphisbaena mertensii;
    Amphisbaena microcephala;
    Amphisbaena dubia;
    Amphisbaena caeca;
    Amphisbaena manni;
    Amphisbaena innocens;
    Amphisbaena cubana;
    Amphisbaena gonavensis;
    Amphisbaena carlgansi;
    Amphisbaena kingii;
    Amphisbaena darwinii;
    Amphisbaena heterozonata;
    Amphisbaena angustifrons;
    Amphisbaena trachura;
    Amphisbaena munoai;
    Amphisbaena prunicolor;
    Amphisbaena arenaria;
    Amphisbaena anomala;
    Amphisbaena bedai;
    Amphisbaena brasiliana;
    Amphisbaena cuiabana;
    Amphisbaena frontalis;
    Amphisbaena hastata;
    Amphisbaena heathi;
    Amphisbaena ignatiana;
    Amphisbaena leucocephala;
    Amphisbaena miringoera;
    Amphisbaena mitchelli;
    Amphisbaena neglecta;
    Amphisbaena nigricauda;
    Amphisbaena occidentalis;
    Amphisbaena polygrammica;
    Amphisbaena pretrei;
    Amphisbaena ridleyi;
    Amphisbaena roberti;
    Amphisbaena silvestrii;
    Amphisbaena slevini;
    Amphisbaena talisiae;
    Amphisbaena vanzolinii;
    Amphisbaena xera;
    Bipes biporus;
    Bipes canaliculatus;
    Bipes tridactylus;
    Blanus cinereus;
    Blanus mariae;
    Blanus strauchi;
    Blanus alexandri;
    Blanus aporus;
    Blanus tingitanus;
    Blanus mettetali;
    Trogonophis wiegmanni;
    Diplometopon zarudnyi;
    Agamodon anguliceps;
    Agamodon compressus;
    Agamodon arabicus;
    Pachycalamus brevis;
    Rhineura floridana;
    Monopeltis capensis;
    Monopeltis anchietae;
    Monopeltis sphenorhynchus;
    Monopeltis leonhardi;
    Monopeltis granti;
    Monopeltis guentheri;
    Monopeltis jugularis;
    Monopeltis infuscata;
    Monopeltis luandae;
    Zygaspis quadrifrons;
    Zygaspis violacea;
    Zygaspis nigra;
    Zygaspis vandami;
    Zygaspis ferox;
    Zygaspis kafuensis;
    Zygaspis maraisi;
    Dalophia pistillum;
    Dalophia angolensis;
    Dalophia colobura;
    Dalophia ellenbergeri;
    Dalophia gigantea;
    Dalophia longicauda;
    Dalophia luluae;
    Dalophia welwitschii;
    Chirindia langi;
    Chirindia swynnertoni;
    Chirindia ewerbecki;
    Chirindia rondoensis;
    Chirindia mpwapwaensis;
    Loveridgea ionidesii;
    Loveridgea phylofiniens
  `, [21], 90);

  // ============================================================
  // BLINDSLANGEN
  // ============================================================

  ondergrondseDieren(`
    Indotyphlops braminus;
    Indotyphlops albiceps;
    Indotyphlops ater;
    Indotyphlops bicolor;
    Indotyphlops diardii;
    Indotyphlops jerdoni;
    Indotyphlops lankaensis;
    Indotyphlops malcolmi;
    Indotyphlops pammeces;
    Indotyphlops porrectus;
    Indotyphlops tenebrarum;
    Indotyphlops veddae;
    Xerotyphlops vermicularis;
    Xerotyphlops syriacus;
    Xerotyphlops socotranus;
    Xerotyphlops etheridgei;
    Afrotyphlops punctatus;
    Afrotyphlops bibronii;
    Afrotyphlops schlegelii;
    Afrotyphlops angolensis;
    Afrotyphlops anomalus;
    Afrotyphlops blanfordii;
    Afrotyphlops brevis;
    Afrotyphlops congestus;
    Afrotyphlops elegans;
    Afrotyphlops fornasinii;
    Afrotyphlops lineolatus;
    Afrotyphlops mucruso;
    Afrotyphlops obtusus;
    Afrotyphlops platyrhynchus;
    Afrotyphlops rondoensis;
    Afrotyphlops schmidti;
    Afrotyphlops steinhausi;
    Afrotyphlops wittei;
    Letheobia caeca;
    Letheobia crossii;
    Letheobia debilis;
    Letheobia decorosa;
    Letheobia episcopus;
    Letheobia feae;
    Letheobia gracilis;
    Letheobia kibarae;
    Letheobia newtoni;
    Letheobia pallida;
    Letheobia praeocularis;
    Letheobia rufescens;
    Letheobia simoni;
    Letheobia sudanensis;
    Letheobia toritensis;
    Anilios australis;
    Anilios bicolor;
    Anilios bituberculatus;
    Anilios endoterus;
    Anilios grypus;
    Anilios hamatus;
    Anilios howi;
    Anilios kimberleyensis;
    Anilios leptosoma;
    Anilios ligatus;
    Anilios longissimus;
    Anilios margaretae;
    Anilios micromma;
    Anilios nigrescens;
    Anilios pinguis;
    Anilios proximus;
    Anilios robertsi;
    Anilios saccatus;
    Anilios splendidus;
    Anilios unguirostris;
    Anilios waitii;
    Anilios wiedii;
    Ramphotyphlops acuticaudus;
    Ramphotyphlops bipartitus;
    Ramphotyphlops conradi;
    Ramphotyphlops lineatus;
    Ramphotyphlops olivaceus;
    Ramphotyphlops similis;
    Ramphotyphlops suluensis;
    Ramphotyphlops supranasalis;
    Amerotyphlops brongersmianus;
    Amerotyphlops reticulatus;
    Amerotyphlops trinitatus;
    Amerotyphlops tasymicris;
    Amerotyphlops paucisquamus;
    Amerotyphlops minuisquamus;
    Amerotyphlops amoipira;
    Amerotyphlops arenensis;
    Amerotyphlops yonenagae;
    Amerotyphlops microstomus;
    Amerotyphlops costaricensis;
    Amerotyphlops stadelmani;
    Amerotyphlops tenuis
  `, [21], 90);

  // ============================================================
  // P OOTLOZE AMFIBIEËN
  // ============================================================

  ondergrondseDieren(`
    Ichthyophis glutinosus;
    Ichthyophis bannanicus;
    Ichthyophis kohtaoensis;
    Ichthyophis beddomei;
    Ichthyophis tricolor;
    Ichthyophis bombayensis;
    Ichthyophis longicephalus;
    Ichthyophis kodaguensis;
    Ichthyophis davidi;
    Ichthyophis moustakius;
    Ichthyophis sendenyu;
    Ichthyophis nokrekensis;
    Ichthyophis sikkimensis;
    Ichthyophis garoensis;
    Ichthyophis alfredi;
    Ichthyophis asplenius;
    Ichthyophis dulitensis;
    Ichthyophis atricollaris;
    Ichthyophis biangularis;
    Ichthyophis glandulosus;
    Ichthyophis hypocyaneus;
    Ichthyophis javanicus;
    Ichthyophis monochrous;
    Ichthyophis paucisulcus;
    Ichthyophis singaporensis;
    Ichthyophis sumatranus;
    Ichthyophis weberi;
    Uraeotyphlus oxyurus;
    Uraeotyphlus narayani;
    Uraeotyphlus menoni;
    Uraeotyphlus malabaricus;
    Uraeotyphlus interruptus;
    Uraeotyphlus gansi;
    Uraeotyphlus oommeni;
    Gegeneophis ramaswamii;
    Gegeneophis carnosus;
    Gegeneophis seshachari;
    Gegeneophis madhavai;
    Gegeneophis nadkarnii;
    Gegeneophis danieli;
    Gegeneophis goaensis;
    Gegeneophis mhadeiensis;
    Gegeneophis krishni;
    Gegeneophis orientalis;
    Indotyphlus battersbyi;
    Indotyphlus maharashtraensis;
    Scolecomorphus vittatus;
    Scolecomorphus kirkii;
    Scolecomorphus uluguruensis;
    Crotaphatrema bornmuelleri;
    Crotaphatrema lamottei;
    Crotaphatrema tchabalmbaboensis;
    Boulengerula boulengeri;
    Boulengerula taitana;
    Boulengerula uluguruensis;
    Boulengerula denhardti;
    Boulengerula fischeri;
    Boulengerula niedeni;
    Boulengerula spawlsi;
    Herpele squalostoma;
    Herpele multiplicata;
    Geotrypetes seraphini;
    Geotrypetes pseudoangeli;
    Geotrypetes angeli;
    Schistometopum thomense;
    Schistometopum gregorii;
    Dermophis mexicanus;
    Dermophis oaxacae;
    Dermophis gracilior;
    Dermophis glandulosus;
    Dermophis costaricense;
    Dermophis occidentalis;
    Dermophis parviceps;
    Gymnopis multiplicata;
    Gymnopis syntrema;
    Caecilia tentaculata;
    Caecilia gracilis;
    Caecilia orientalis;
    Caecilia pachynema;
    Caecilia leucocephala;
    Caecilia occidentalis;
    Caecilia albiventris;
    Caecilia antioquiaensis;
    Caecilia armata;
    Caecilia atelolepis;
    Caecilia caribea;
    Caecilia crassisquama;
    Caecilia degenerata;
    Caecilia disossea;
    Caecilia guntheri;
    Caecilia inca;
    Caecilia isthmica;
    Caecilia marcusi;
    Caecilia mertensi;
    Caecilia nigricans;
    Caecilia occidentalis;
    Caecilia perdita;
    Caecilia subdermalis;
    Caecilia subnigricans;
    Caecilia thompsoni
  `, [], 90);

  // ============================================================
  // REGENWORMEN
  // ============================================================

  ondergrondseDieren(`
    Gewone regenworm=Lumbricus terrestris;
    Lumbricus rubellus;
    Lumbricus castaneus;
    Lumbricus festivus;
    Lumbricus friendi;
    Lumbricus herculeus;
    Lumbricus polyphemus;
    Aporrectodea caliginosa;
    Aporrectodea longa;
    Aporrectodea rosea;
    Aporrectodea trapezoides;
    Aporrectodea tuberculata;
    Aporrectodea nocturna;
    Aporrectodea limicola;
    Aporrectodea icterica;
    Aporrectodea chlorotica=Allolobophora chlorotica;
    Allolobophora cupulifera;
    Allolobophora molleri;
    Allolobophora robusta;
    Allolobophoridella eiseni;
    Eisenia fetida;
    Eisenia andrei;
    Eisenia hortensis;
    Eisenia lucens;
    Eisenia spelaea;
    Dendrobaena octaedra;
    Dendrobaena veneta;
    Dendrobaena rubida;
    Dendrobaena attemsi;
    Dendrobaena pygmaea;
    Dendrodrilus rubidus;
    Eiseniella tetraedra;
    Octolasion cyaneum;
    Octolasion tyrtaeum;
    Octolasion lacteum;
    Proctodrilus antipai;
    Proctodrilus tuberculatus;
    Helodrilus oculatus;
    Helodrilus cernosvitovianus;
    Murchieona muldali;
    Satchellius mammalis;
    Bimastos parvus;
    Bimastos longicinctus;
    Bimastos heimburgeri;
    Bimastos welchi;
    Diplocardia communis;
    Diplocardia singularis;
    Diplocardia mississippiensis;
    Diplocardia verrucosa;
    Diplocardia riparia;
    Diplocardia floridana;
    Megascolides australis;
    Megascolides cameroni;
    Megascolides marmoratus;
    Amynthas agrestis;
    Amynthas corticis;
    Amynthas gracilis;
    Amynthas hupeiensis;
    Amynthas morrisi;
    Amynthas robustus;
    Amynthas aspergillum;
    Amynthas diffringens;
    Amynthas triastriatus;
    Amynthas alexandri;
    Amynthas carnosus;
    Amynthas tokioensis;
    Metaphire californica;
    Metaphire hilgendorfi;
    Metaphire posthuma;
    Metaphire peguana;
    Metaphire houlleti;
    Metaphire schmardae;
    Metaphire sieboldi;
    Metaphire guillelmi;
    Pheretima darnleiensis;
    Pheretima montana;
    Pheretima minima;
    Pheretima urceolata;
    Perionyx excavatus;
    Perionyx sansibaricus;
    Eudrilus eugeniae;
    Pontoscolex corethrurus;
    Pontoscolex spiralis;
    Glossoscolex giganteus;
    Glossoscolex paulistus;
    Rhinodrilus alatus;
    Rhinodrilus priollii;
    Martiodrilus crassus;
    Martiodrilus heterostichon;
    Martiodrilus carimaguensis;
    Driloleirus americanus;
    Driloleirus macelfreshi
  `, [], 80);

  // ============================================================
  // SYNONIEMEN EN DUBBELE NAMEN
  // ============================================================

  const synoniemenDeel4 = [
    ["Afrikaanse savanneolifant", "Loxodonta africana"],
    ["Afrikaanse bosolifant", "Loxodonta cyclotis"],
    ["Mierenegel", "Tachyglossus aculeatus"],
    ["Rode reuzenkangoeroe", "Macropus rufus"],
    ["Xerus inauris", "Geosciurus inauris"],
    ["Colobus guereza", "Mantelfranjeaap"],
    ["Cercopithecus lhoesti", "Allochrocebus lhoesti"],
    ["Cercopithecus preussi", "Allochrocebus preussi"],
    ["Cercopithecus solatus", "Allochrocebus solatus"],
    ["Gerrhosaurus major", "Broadleysaurus major"],
    ["Aquila ayresii", "Hieraaetus ayresii"],
    ["Aquila spilogaster", "Afrikaanse havikarend"],
    ["Nannospalax leucodon", "Spalax leucodon"],
    ["Dryophytes japonicus", "Hyla japonica"],
    ["Dryophytes cinereus", "Hyla cinerea"],
    ["Dryophytes versicolor", "Hyla versicolor"],
    ["Dryophytes chrysoscelis", "Hyla chrysoscelis"],
    ["Trachycephalus typhonius", "Trachycephalus venulosus"],
    ["Sylvia nana", "Curruca nana"],
    ["Paravaejovis spinigerus", "Vaejovis spinigerus"],
    ["Smeringurus mesaensis", "Paruroctonus mesaensis"],
    ["Osmia bicornis", "Osmia rufa"],
    ["Andrena scotica", "Andrena carantonica"],
    ["Orthosia munda", "Anorthoa munda"],
    ["Mythimna pallens", "Aletia pallens"],
    ["Mythimna impura", "Aletia impura"],
    ["Blepharita satura", "Mniotype satura"],
    ["Cucullia verbasci", "Shargacucullia verbasci"],
    ["Gnophos obscurata", "Charissa obscurata"],
    ["Thera firmata", "Pennithera firmata"],
    ["Earophila badiata", "Anticlea badiata"],
    ["Chorthippus parallelus", "Pseudochorthippus parallelus"],
    ["Chorthippus montanus", "Pseudochorthippus montanus"],
    ["Eisenia hortensis", "Dendrobaena veneta"],
    ["Aporrectodea chlorotica", "Allolobophora chlorotica"],
    ["Spermophilus mohavensis", "Xerospermophilus mohavensis"],
    ["Uroplatus henkeli", "Henkelbladstaartgekko"],
    ["Correlophus ciliatus", "Rhacodactylus ciliatus"],
    ["Mniarogekko chahoua", "Rhacodactylus chahoua"],
    ["Lophochroa leadbeateri", "Cacatua leadbeateri"],
    ["Cal yptorhynchus funereus".replace(" ", ""), "Zanda funerea"],
    ["Lagopus muta", "Alpensneeuwhoen"],
    ["Lagopus muta", "Sneeuwhoen"]
  ];

  for (const [hoofdnaam, alternatief] of synoniemenDeel4) {
    verenigSynoniemenDeel2(hoofdnaam, alternatief);
  }

  // ============================================================
  // CORRECTIES VAN HOMONIEMEN
  // ============================================================

  // Dromedaris is zowel de naam van een kameel
  // als de Nederlandse naam van een nachtvlinder.

  const dromedarisKameel =
    zoekEen("Camelus dromedarius");

  const dromedarisVlinder =
    zoekEen("Notodonta dromedarius");

  if (
    dromedarisKameel &&
    dromedarisVlinder &&
    dromedarisKameel !== dromedarisVlinder
  ) {
    voegKoppelingToe(dromedarisKameel,25,30);
    voegKoppelingToe(dromedarisVlinder,26,70);
  }

  // Veelvraat kan zowel een zoogdier
  // als een nachtvlinder betekenen.

  const veelvraatZoogdier =
    zoekEen("Gulo gulo");

  const veelvraatVlinder =
    zoekEen("Macrothylacia rubi");

  if (
    veelvraatZoogdier &&
    veelvraatVlinder &&
    veelvraatZoogdier !== veelvraatVlinder
  ) {
    voegKoppelingToe(veelvraatZoogdier,24,55);
    voegKoppelingToe(veelvraatVlinder,26,70);
  }

  // ============================================================
  // VERWIJDER ONDUIDELIJKE OF ONJUISTE NAMEN
  // ============================================================

  const twijfelachtigeNamenDeel4 = `
    Card iocranius paradoxus;
    Dib atag;
    Hadrurus concolorous;
    Polypedates impresus;
    Alpensneeuwvink
  `;

  for (const onderdeel of twijfelachtigeNamenDeel4.split(";")) {
    const naam = onderdeel.trim();

    if (!naam) continue;

    verwijderKoppeling(
      naam,
      [5,6,12,23,24,25,26,31,32]
    );
  }

  // Correcte schrijfwijze.

  afrikaanseDieren(
    "Dibatag=Ammodorcas clarkei",
    [4,18,20],
    80
  );

  koudedieren(
    "Sneeuwvink=Montifringilla nivalis",
    [2,7,18,22],
    75
  );

  // ============================================================
  // UITGESTORVEN SOORTEN NIET IN ACTUELE LEEFGEBIEDEN
  // ============================================================

  const uitgestorvenDeel4 = `
    Tasmaanse tijger=Thylacinus cynocephalus;
    Melomys rubicola;
    Lagorchestes asomatus;
    Lagorchestes leporides;
    Onychogalea lunata;
    Potorous platyops;
    Macrotis leucura;
    Notomys amplus;
    Notomys longicaudatus;
    Notomys macrotis;
    Notomys mordax;
    Conilurus albipes;
    Leporillus apicalis;
    Pseudomys glaucus;
    Pseudomys gouldii;
    Psephotellus pulcherrimus;
    Dodo=Raphus cucullatus;
    Rodrigues solitaire=Pezophaps solitaria;
    Quagga=Equus quagga quagga;
    Blauwbok=Hippotragus leucophaeus;
    Reuzenalk=Pinguinus impennis;
    Stellers zeekoe=Hydrodamalis gigas
  `;

  for (const regel of uitgestorvenDeel4.split(";")) {
    const namen = regel
      .split("=")
      .map(naam => naam.trim())
      .filter(Boolean);

    if (!namen.length) continue;

    // Pseudomys gouldii is een bijzonder
    // taxonomisch geval en wordt apart beoordeeld.

    if (namen[0] === "Pseudomys gouldii") continue;

    const record = namen
      .map(naam => zoekEen(naam))
      .find(Boolean);

    if (!record) continue;

    for (const nummer of [
      3,5,6,8,12,13,23,24,25,26,
      27,31,32,37,38,39,46
    ]) {
      verwijderKoppeling(record.naam,[nummer]);
    }

    voegKoppelingToe(record,43,85);
  }

  // ============================================================
  // SPECIFIEKE LEEFGEBIEDCORRECTIES
  // ============================================================

  const leefgebiedCorrectiesDeel4 = [
    ["Saiga", [5]],
    ["Amerikaanse das", [6]],
    ["Varanus yemenensis", [5]],
    ["Uromastyx benti", [5]],
    ["Chamaeleo calyptratus", [5]],
    ["Chamaeleo zeylanicus", [5]],
    ["Merops viridis", [5]],
    ["Cinnyris lotenius", [5]],
    ["Bothrochilus boa", [23]],
    ["Liasis mackloti", [23]],
    ["Aethomyias spilodera", [23]],
    ["Acanthiza murina", [23]],
    ["Malurus alboscapulatus", [23]],
    ["Myzomela rosenbergii", [23]],
    ["Lichmera incana", [23]],
    ["Melomys rubicola", [23]],
    ["Ara rubrogenys", [12]],
    ["Amazona barbadensis", [12]],
    ["Campephilus principalis", [6]],
    ["Campephilus imperialis", [6]],
    ["Goudjakhals", [12]],
    ["IJsbeer", [6,12,25,31]],
    ["Walrus", [6,12,25,31]],
    ["Baikalrob", [6,12,25,31]],
    ["Muskusos", [12,25,31]],
    ["Zeehond", [12,31]],
    ["Struisvogel", [31]],
    ["Emoe", [31]],
    ["Europese mol", [31]],
    ["Naakte molrat", [31]],
    ["Vliegende eekhoorn", [2]],
    ["Glaucomys volans", [2]],
    ["Glaucomys sabrinus", [2]],
    ["Glaucomys oregonensis", [2]],
    ["Pteromys volans", [2]],
    ["Pteromys momonga", [2]]
  ];

  for (const [naam, vragen] of leefgebiedCorrectiesDeel4) {
    verwijderKoppeling(naam,vragen);
  }

  // ============================================================
  // EXTRA KOPPELINGEN VAN BEKENDE DIEREN
  // ============================================================

  koppel(`
    Jaguar;
    Ocelot;
    Margay;
    Binturong;
    Nevelpanter;
    Sumatraanse orang-oetan;
    Borneose orang-oetan;
    Tapanuli-orang-oetan;
    Bonobo;
    Chimpansee;
    Westelijke gorilla;
    Fossa;
    Rode vari;
    Vari;
    Indri;
    Gouden leeuwaapje;
    Reuzentoekan;
    Geelvleugelara;
    Blauwgele ara;
    Groenvleugelara;
    Maleise tapir;
    Sumatraanse neushoorn;
    Javaanse neushoorn;
    Groene mamba;
    Gabonadder;
    Goliathkikker
  `, [6,12], 70);

  koppel(`
    Koala;
    Boommarter;
    Rode eekhoorn;
    Grijze eekhoorn;
    Vosseekhoorn;
    Kinkajoe;
    Binturong;
    Rode panda;
    Vingerdier;
    Margay;
    Boomslang;
    Tweevingerige luiaard;
    Drievingerige luiaard;
    Bruinkeelluiaard;
    Hoffmannluiaard;
    Dwergluiaard;
    Kraagluiaard;
    Rode vari;
    Vari;
    Indri;
    Neusaap;
    Siamang;
    Gouden leeuwaapje;
    Dwergzijdeaapje
  `, [31,35], 55);

  koppel(`
    Europese mol;
    Naakte molrat;
    Buidelmol;
    Stermol;
    Gewone regenworm;
    Ondergrondse woelmuis;
    Veenmol;
    Europese das;
    Konijn;
    Grote bilby;
    Gewone wombat;
    Lasiorhinus latifrons;
    Lasiorhinus krefftii;
    Stokstaartje;
    Fennek;
    Aardvarken=Orycteropus afer
  `, [32], 55);

  // koppel() accepteert geen =-notatie.
  dier(
    "Aardvarken",
    [5,20,27,32,50],
    ["Orycteropus afer"],
    45
  );

  // ============================================================
  // AANVULLENDE CONTROLETESTS
  // ============================================================

  const extraLeefgebiedTestsDeel4 = [
    [5, "Leeuw", true],
    [5, "Giraffe", true],
    [5, "Afrikaanse savanneolifant", true],
    [5, "Stokstaartje", true],
    [5, "Okapi", true],
    [5, "Fennek", true],
    [5, "Ringstaartmaki", true],
    [5, "IJsbeer", false],
    [5, "Koala", false],
    [5, "Saiga", false],

    [6, "Edelhert", true],
    [6, "Ree", true],
    [6, "Rode eekhoorn", true],
    [6, "Bruine beer", true],
    [6, "Grote bonte specht", true],
    [6, "Jaguar", true],
    [6, "IJsbeer", false],

    [12, "Jaguar", true],
    [12, "Binturong", true],
    [12, "Bonobo", true],
    [12, "Maleise tapir", true],
    [12, "Sumatraanse orang-oetan", true],
    [12, "IJsbeer", false],
    [12, "Walrus", false],

    [23, "Koala", true],
    [23, "Rode reuzenkangoeroe", true],
    [23, "Vogelbekdier", true],
    [23, "Emoe", true],
    [23, "Bergduivel", true],
    [23, "Binnenlandse taipan", true],
    [23, "Melomys rubicola", false],

    [24, "IJsbeer", true],
    [24, "Poolvos", true],
    [24, "Rendier", true],
    [24, "Muskusos", true],
    [24, "Sneeuwuil", true],
    [24, "Narwal", true],
    [24, "Groenlandse haai", true],

    [25, "Fennek", true],
    [25, "Dromedaris", true],
    [25, "Zandkat", true],
    [25, "Bergduivel", true],
    [25, "Addax", true],
    [25, "IJsbeer", false],

    [26, "Egel", true],
    [26, "Ree", true],
    [26, "Wolf", true],
    [26, "Europese mol", true],
    [26, "Dagpauwoog", true],
    [26, "Ringslang", true],
    [26, "Grote groene sabelsprinkhaan", true],
    [26, "Honingbij", true],

    [31, "Koala", true],
    [31, "Rode eekhoorn", true],
    [31, "Rode panda", true],
    [31, "Drievingerige luiaard", true],
    [31, "Europese mol", false],

    [32, "Europese mol", true],
    [32, "Naakte molrat", true],
    [32, "Gewone regenworm", true],
    [32, "Aardvarken", true],
    [32, "Veenmol", true],

    [43, "Melomys rubicola", true],
    [2, "Glaucomys volans", false],
    [2, "Pteromys volans", false]
  ];

  // ============================================================
  // VOORTGANG NA DEEL 4
  // ============================================================

  const voortgangNaDeel4 =
    volledigeVoortgangV92();

  const leefgebiedVragenDeel4 = [
    5,6,12,23,24,25,26,31,32
  ];

  const rapportLeefgebiedenDeel4 =
    voortgangNaDeel4.filter(
      vraag => leefgebiedVragenDeel4.includes(
        vraag.vraag
      )
    );

  const tussentijdsRapportDeel4 = {

    versie: VERSIE,

    dierrecordsBijStart:
      beginAantalDieren,

    dierrecordsNu:
      dieren.size,

    bruikbareDierrecords:
      [...dieren.values()].filter(
        record => record.vragen.size > 0
      ).length,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    verwijderdeKoppelingen,

    conflictenBijToevoegen:
      conflictenBijToevoegen.length,

    ontbrekendeKoppelingen:
      ontbrekendeKoppelingen.length,

    vragenMet1000Antwoorden:
      voortgangNaDeel4.filter(
        vraag => vraag.streefdoelBereikt
      ).length,

    ontbrekendTotStreefdoel:
      voortgangNaDeel4.reduce(
        (som,vraag) => som + vraag.tekort,
        0
      ),

    voortgangPercentage:
      Number(
        (
          voortgangNaDeel4.reduce(
            (som,vraag) =>
              som + Math.min(
                vraag.nieuweAntwoorden,
                1000
              ),
            0
          ) / 50000 * 100
        ).toFixed(2)
      )

  };

  console.group(
    "QuizBallon V9.2 - Aanvulling 2 - Deel 4"
  );

  console.table(
    tussentijdsRapportDeel4
  );

  console.table(
    rapportLeefgebiedenDeel4
  );

  console.table(
    voortgangNaDeel4
  );

  console.groupEnd();

  // ============================================================
  // EINDE AANVULLING 2 - DEEL 4
  // HET BESTAND NOG NIET AFSLUITEN
  // DEEL 5 KOMT HIERONDER
  // ============================================================
   // ============================================================
  // QUIZBALLON V9.2 - AANVULLING 2 - DEEL 5
  // LICHAMELIJKE KENMERKEN VAN DIEREN
  // ============================================================

  function kenmerkenDeel5(tekst, vragen, punten = 75) {
    groep(tekst, [...new Set([...vragen,50])], punten);
  }

  // ============================================================
  // DIEREN MET HOORNS
  // ============================================================

  // Een gewei is biologisch niet hetzelfde als een hoorn.
  // Herten krijgen daarom niet automatisch vraag 19.

  kenmerkenDeel5(`
    Afrikaanse buffel=Syncerus caffer;
    Amerikaanse bizon=Bison bison;
    Europese bizon=Bison bonasus;
    Wild waterbuffel=Bubalus arnee;
    Waterbuffel=Bubalus bubalis;
    Gaur=Bos gaurus;
    Banteng=Bos javanicus;
    Wilde yak=Bos mutus;
    Yak=Bos grunniens;
    Kouprey=Bos sauveli;
    Anoabuffel=Bubalus depressicornis;
    Berganoa=Bubalus quarlesi;
    Tamaroe=Bubalus mindorensis;
    Muskusos=Ovibos moschatus;
    Alpensteenbok=Capra ibex;
    Siberische steenbok=Capra sibirica;
    Nubische steenbok=Capra nubiana;
    Spaanse steenbok=Capra pyrenaica;
    Bezoargeit=Capra aegagrus;
    Schroefhoorngeit=Capra falconeri;
    Oost-Kaukasische toer=Capra cylindricornis;
    West-Kaukasische toer=Capra caucasica;
    Capra walie;
    Gem s=Rupicapra rupicapra;
    Pyreneese gems=Rupicapra pyrenaica;
    Sneeuwgeit=Oreamnos americanus;
    Japanse bosgems=Capricornis crispus;
    Taiwanese bosgems=Capricornis swinhoei;
    Capricornis sumatraensis;
    Capricornis milneedwardsii;
    Capricornis rubidus;
    Naemorhedus goral;
    Naemorhedus griseus;
    Naemorhedus caudatus;
    Naemorhedus baileyi;
    Takin=Budorcas taxicolor;
    Bharal=Pseudois nayaur;
    Pseudois schaeferi;
    Barbarijs schaap=Ammotragus lervia;
    Arabische thargeit=Arabitragus jayakari;
    Himalayathargeit=Hemitragus jemlahicus;
    Nilgirithargeit=Nilgiritragus hylocrius;
    Argali=Ovis ammon;
    Dikhoornschaap=Ovis canadensis;
    Dallsschaap=Ovis dalli;
    Sneeuwschaap=Ovis nivicola;
    Urial=Ovis vignei;
    Moeflon=Ovis gmelini;
    Saiga=Saiga tatarica;
    Tibetaanse antilope=Pantholops hodgsonii;
    Pronghorn=Antilocapra americana=Gaffelbok
  `, [4,18,19,20], 70);

  kenmerkenDeel5(
    "Gems=Rupicapra rupicapra",
    [4,18,19,20],
    45
  );

  // ============================================================
  // ANTILOPEN MET HOORNS
  // ============================================================

  kenmerkenDeel5(`
    Impala;
    Springbok;
    Blauwe gnoe;
    Zwarte gnoe;
    Hartebeest;
    Lichtensteins hartebeest;
    Blesbok;
    Damaliscus lunatus;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Bergnyala;
    Bosbok;
    Sitatunga;
    Bongo;
    Elandantilope;
    Reuzenelandantilope;
    Sabelantilope;
    Roanantilope;
    Gemsbok;
    Beisa;
    Algazel;
    Arabische oryx;
    Addax;
    Waterbok;
    Kob;
    Litschiewaterbok;
    Puku;
    Nijlantilope;
    Rietbok;
    Redunca redunca;
    Redunca fulvorufula;
    Oribi;
    Steenbok;
    Kaapse grysbok;
    Sharpes grysbok;
    Klipspringer;
    Gerenoek;
    Dibatag;
    Dorcasgazelle;
    Slankhoorngazelle;
    Cuviergazelle;
    Damagazelle;
    Grantgazelle;
    Soemmerringgazelle;
    Thomsongazelle;
    Eudorcas rufifrons;
    Eudorcas tilonura;
    Eudorcas albonotata;
    Gazella gazella;
    Gazella arabica;
    Gazella marica;
    Gazella bennettii;
    Gazella subgutturosa;
    Gazella spekei;
    Gazella cuvieri;
    Gazella leptoceros;
    Procapra gutturosa;
    Procapra picticaudata;
    Procapra przewalskii;
    Madoqua kirkii;
    Madoqua guentheri;
    Madoqua saltiana;
    Madoqua piacentinii;
    Beira;
    Batesdwergantilope;
    Dwergantilope;
    Soeni;
    Gewone duiker;
    Blauwe duiker;
    Philantomba maxwellii;
    Cephalophus dorsalis;
    Cephalophus natalensis;
    Cephalophus niger;
    Cephalophus silvicultor;
    Cephalophus spadix;
    Cephalophus zebra;
    Cephalophus jentinki;
    Cephalophus ogilbyi;
    Cephalophus leucogaster;
    Cephalophus callipygus;
    Cephalophus weynsi;
    Cephalophus nigrifrons;
    Cephalophus rufilatus;
    Vierhoornantilope=Tetracerus quadricornis;
    Nijlgau=Boselaphus tragocamelus;
    Zwarte antilope=Antilope cervicapra
  `, [4,18,19,20], 75);

  // ============================================================
  // NEUSHOORNS
  // ============================================================

  kenmerkenDeel5(`
    Witte neushoorn=Ceratotherium simum;
    Zwarte neushoorn=Diceros bicornis;
    Indische neushoorn=Rhinoceros unicornis;
    Javaanse neushoorn=Rhinoceros sondaicus;
    Sumatraanse neushoorn=Dicerorhinus sumatrensis
  `, [4,9,18,19], 45);

  // ============================================================
  // HAGEDISSEN MET HOORNACHTIGE UITSTEEKSELS
  // ============================================================

  kenmerkenDeel5(`
    Jacksonkameleon=Trioceros jacksonii;
    Trioceros johnstoni;
    Trioceros quadricornis;
    Trioceros montium;
    Trioceros werneri;
    Trioceros oweni;
    Trioceros deremensis;
    Trioceros conirostratus;
    Kinyongia fischeri;
    Kinyongia multituberculata;
    Kinyongia matschiei;
    Kinyongia tavetana;
    Calumma parsonii;
    Calumma nasutum;
    Calumma gallus;
    Calumma boettgeri;
    Calumma crypticum;
    Calumma globifer;
    Phrynosoma cornutum;
    Phrynosoma solare;
    Phrynosoma platyrhinos;
    Phrynosoma asio;
    Phrynosoma modestum;
    Phrynosoma mcallii;
    Phrynosoma goodei;
    Phrynosoma douglasii;
    Phrynosoma hernandesi;
    Phrynosoma orbiculare;
    Phrynosoma taurus;
    Phrynosoma braconnieri;
    Phrynosoma ditmarsi;
    Phrynosoma cerroense;
    Phrynosoma coronatum
  `, [4,18,21], 85);

  // Alleen soorten met duidelijke hoornachtige structuren.

  koppel(`
    Jacksonkameleon;
    Trioceros johnstoni;
    Trioceros quadricornis;
    Trioceros montium;
    Trioceros oweni;
    Trioceros deremensis;
    Kinyongia fischeri;
    Kinyongia multituberculata;
    Kinyongia matschiei;
    Phrynosoma cornutum;
    Phrynosoma solare;
    Phrynosoma platyrhinos;
    Phrynosoma asio;
    Phrynosoma mcallii;
    Phrynosoma taurus;
    Phrynosoma coronatum
  `, [19], 85);

  // ============================================================
  // KEVERS MET HOORNS
  // ============================================================

  kenmerkenDeel5(`
    Herculeskever=Dynastes hercules;
    Dynastes neptunus;
    Dynastes satanas;
    Dynastes tityus;
    Dynastes grantii;
    Dynastes hyllus;
    Dynastes maya;
    Dynastes moroni;
    Olifantskever=Megasoma elephas;
    Megasoma actaeon;
    Megasoma mars;
    Megasoma gyas;
    Megasoma janus;
    Megasoma thersites;
    Megasoma anubis;
    Megasoma occidentale;
    Megasoma punctulatum;
    Megasoma vogti;
    Megasoma sleeperi;
    Chalcosoma atlas;
    Chalcosoma chiron;
    Chalcosoma moellenkampi;
    Chalcosoma caucasus;
    Xylotrupes gideon;
    Xylotrupes ulysses;
    Xylotrupes socrates;
    Xylotrupes pubescens;
    Xylotrupes sumatrensis;
    Neushoornkever=Oryctes nasicornis;
    Oryctes rhinoceros;
    Oryctes boas;
    Oryctes monoceros;
    Oryctes agamemnon;
    Oryctes centaurus;
    Oryctes owariensis;
    Oryctes elegans;
    Oryctes sahariensis;
    Enema pan;
    Enema endymion;
    Strategus aloeus;
    Strategus antaeus;
    Strategus jugurtha;
    Strategus surinamensis;
    Strategus longichomperus;
    Golofa porteri;
    Golofa claviger;
    Golofa eacus;
    Golofa pizarro;
    Golofa pelagon;
    Golofa tersander;
    Golofa imperialis;
    Golofa aegeon;
    Golofa obliquicornis;
    Augosoma centaurus;
    Augosoma hippocrates;
    Trypoxylus dichotomus;
    Allomyrina dichotoma;
    Eupatorus gracilicornis;
    Eupatorus birmanicus;
    Eupatorus hardwickei;
    Eupatorus siamensis;
    Beckius beccarii;
    Scapanes australis;
    Diloboderus abderus;
    Coelosis biloba;
    Heterogomphus schoenherri;
    Heterogomphus chevrolati;
    Heterogomphus dilaticollis
  `, [7,19], 85);

  // ============================================================
  // MESTKEVERS MET HOORNEN
  // ============================================================

  kenmerkenDeel5(`
    Onthophagus taurus;
    Onthophagus gazella;
    Onthophagus nuchicornis;
    Onthophagus fracticornis;
    Onthophagus illyricus;
    Onthophagus vacca;
    Onthophagus similis;
    Onthophagus ovatus;
    Onthophagus coenobita;
    Onthophagus verticicornis;
    Onthophagus medius;
    Onthophagus binodis;
    Onthophagus sagittarius;
    Onthophagus rangifer;
    Onthophagus diabolicus;
    Onthophagus mouhoti;
    Onthophagus furcatus;
    Copris lunaris;
    Copris hispanus;
    Copris incertus;
    Copris fricator;
    Copris minutus;
    Copris ochus;
    Copris tripartitus;
    Copris acutidens;
    Copris armatus;
    Phanaeus vindex;
    Phanaeus difformis;
    Phanaeus triangularis;
    Phanaeus igneus;
    Phanaeus splendidulus;
    Phanaeus mexicanus;
    Phanaeus quadridens;
    Phanaeus tridens;
    Phanaeus daphnis;
    Coprophanaeus lancifer;
    Coprophanaeus ensifer;
    Coprophanaeus jasius;
    Coprophanaeus telamon;
    Coprophanaeus cyanescens;
    Oxysternon conspicillatum;
    Oxysternon festivum;
    Oxysternon silenus;
    Oxysternon palaemon;
    Oxysternon spiniferum;
    Dichotomius carolinus;
    Dichotomius colonicus;
    Dichotomius anaglypticus;
    Dichotomius nisus;
    Dichotomius bos;
    Dichotomius bicuspis
  `, [7], 90);

  koppel(`
    Onthophagus taurus;
    Onthophagus gazella;
    Onthophagus sagittarius;
    Onthophagus rangifer;
    Copris lunaris;
    Copris hispanus;
    Copris ochus;
    Phanaeus vindex;
    Phanaeus difformis;
    Phanaeus mexicanus;
    Coprophanaeus lancifer;
    Coprophanaeus ensifer;
    Oxysternon conspicillatum;
    Oxysternon festivum;
    Dichotomius carolinus
  `, [19], 90);

  // ============================================================
  // DIEREN MET GEWEIEN - CORRECTIE
  // ============================================================

  for (const naam of `
    Edelhert;
    Damhert;
    Ree;
    Eland;
    Rendier;
    Wapiti;
    Witstaarthert;
    Muildierhert;
    Sikahert;
    Axishert;
    Sambar;
    Pudu puda;
    Muntiacus muntjak;
    Muntiacus reevesi;
    Elaphodus cephalophus;
    Cervus elaphus;
    Cervus canadensis;
    Cervus nippon;
    Dama dama;
    Dama mesopotamica;
    Capreolus capreolus;
    Capreolus pygargus;
    Alces alces;
    Rangifer tarandus;
    Odocoileus virginianus;
    Odocoileus hemionus;
    Rusa unicolor;
    Rusa timorensis
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [19]);
    }

  }

  // ============================================================
  // DIEREN MET EEN SCHILD
  // ============================================================

  kenmerkenDeel5(`
    Griekse landschildpad=Testudo hermanni;
    Moorse landschildpad=Testudo graeca;
    Vierteenlandschildpad=Testudo horsfieldii;
    Egyptische landschildpad=Testudo kleinmanni;
    Klokschildpad=Testudo marginata;
    Sporenschildpad=Centrochelys sulcata;
    Luipaardschildpad=Stigmochelys pardalis;
    Stralenschildpad=Astrochelys radiata;
    Astrochelys yniphora;
    Aldabra-reuzenschildpad=Aldabrachelys gigantea;
    Chelonoidis niger;
    Chelonoidis hoodensis;
    Chelonoidis vicina;
    Chelonoidis porteri;
    Chelonoidis vandenburghi;
    Chelonoidis guntheri;
    Chelonoidis microphyes;
    Chelonoidis darwini;
    Chelonoidis chathamensis;
    Chelonoidis duncanensis;
    Chelonoidis becki;
    Roodpootschildpad=Chelonoidis carbonarius;
    Geelpootschildpad=Chelonoidis denticulatus;
    Chelonoidis chilensis;
    Indiase sterschildpad=Geochelone elegans;
    Birmese sterschildpad=Geochelone platynota;
    Manouria emys;
    Manouria impressa;
    Indotestudo elongata;
    Indotestudo forstenii;
    Indotestudo travancorica;
    Kinixys belliana;
    Kinixys erosa;
    Kinixys homeana;
    Kinixys spekii;
    Kinixys natalensis;
    Kinixys lobatsiana;
    Kinixys nogueyi;
    Kinixys zombensis;
    Chersobius signatus;
    Chersobius boulengeri;
    Chersobius solus;
    Homopus areolatus;
    Homopus femoralis;
    Psammobates geometricus;
    Psammobates oculifer;
    Psammobates tentorius;
    Malacochersus tornieri;
    Gopherus agassizii;
    Gopherus morafkai;
    Gopherus evgoodei;
    Gopherus flavomarginatus;
    Gopherus polyphemus;
    Gopherus berlandieri
  `, [4,7,18,21,30,33], 80);

  // ============================================================
  // MOERASSCHILDPADDEN
  // ============================================================

  kenmerkenDeel5(`
    Europese moerasschildpad=Emys orbicularis;
    Emys trinacris;
    Emys blandingii;
    Emys marmorata;
    Emys pallida;
    Roodwangschildpad=Trachemys scripta elegans;
    Geelwangschildpad=Trachemys scripta troostii;
    Geelbuikschildpad=Trachemys scripta scripta;
    Trachemys scripta;
    Trachemys decorata;
    Trachemys decussata;
    Trachemys terrapen;
    Trachemys stejnegeri;
    Trachemys gaigeae;
    Trachemys venusta;
    Trachemys grayi;
    Trachemys ornata;
    Trachemys yaquia;
    Trachemys dorbigni;
    Trachemys adiutrix;
    Trachemys callirostris;
    Trachemys medemi;
    Sierschildpad=Chrysemys picta;
    Chrysemys dorsalis;
    Pseudemys concinna;
    Pseudemys floridana;
    Pseudemys nelsoni;
    Pseudemys peninsularis;
    Pseudemys rubriventris;
    Pseudemys alabamensis;
    Pseudemys texana;
    Graptemys geographica;
    Graptemys pseudogeographica;
    Graptemys ouachitensis;
    Graptemys sabinensis;
    Graptemys versa;
    Graptemys caglei;
    Graptemys flavimaculata;
    Graptemys nigrinoda;
    Graptemys oculifera;
    Graptemys pulchra;
    Graptemys barbouri;
    Graptemys ernsti;
    Graptemys gibbonsi;
    Graptemys pearlensis;
    Diamantrugschildpad=Malaclemys terrapin;
    Clemmys guttata;
    Glyptemys insculpta;
    Glyptemys muhlenbergii;
    Terrapene carolina;
    Terrapene ornata;
    Terrapene coahuila;
    Terrapene nelsoni;
    Terrapene mexicana;
    Terrapene yucatana
  `, [4,7,18,33], 85);

  // ============================================================
  // AZIATISCHE WATERSCHILDPADDEN
  // ============================================================

  kenmerkenDeel5(`
    Cuora amboinensis;
    Cuora aurocapitata;
    Cuora bourreti;
    Cuora flavomarginata;
    Cuora galbinifrons;
    Cuora mccordi;
    Cuora mouhotii;
    Cuora pani;
    Cuora picturata;
    Cuora trifasciata;
    Cuora yunnanensis;
    Cuora zhoui;
    Mauremys reevesii;
    Mauremys sinensis;
    Mauremys japonica;
    Mauremys mutica;
    Mauremys annamensis;
    Mauremys nigricans;
    Mauremys leprosa;
    Mauremys rivulata;
    Mauremys caspica;
    Cyclemys dentata;
    Cyclemys oldhamii;
    Cyclemys atripons;
    Cyclemys pulchristriata;
    Cyclemys fusca;
    Cyclemys gemeli;
    Cyclemys enigmatica;
    Heosemys grandis;
    Heosemys spinosa;
    Heosemys annandalii;
    Heosemys depressa;
    Geoemyda spengleri;
    Geoemyda japonica;
    Notochelys platynota;
    Leucocephalon yuwonoi;
    Vijayachelys silvatica;
    Melanochelys trijuga;
    Melanochelys tricarinata;
    Geoclemys hamiltonii;
    Morenia petersi;
    Morenia ocellata;
    Pangshura tecta;
    Pangshura tentoria;
    Pangshura smithii;
    Pangshura sylhetensis;
    Batagur baska;
    Batagur affinis;
    Batagur borneoensis;
    Batagur dhongoka;
    Batagur kachuga;
    Batagur trivittata;
    Hardella thurjii;
    Siebenrockiella crassicollis;
    Siebenrockiella leytensis;
    Orlitia borneensis;
    Malayemys subtrijuga;
    Malayemys macrocephala;
    Malayemys khoratensis;
    Sacalia bealei;
    Sacalia quadriocellata;
    Ocadia sinensis
  `, [4,7,18,33], 90);

  // ============================================================
  // HALSWENDERSCHILDPADDEN
  // ============================================================

  kenmerkenDeel5(`
    Matamata=Chelus fimbriata;
    Chelus orinocensis;
    Chelodina longicollis;
    Chelodina expansa;
    Chelodina rugosa;
    Chelodina canni;
    Chelodina mccordi;
    Chelodina parkeri;
    Chelodina reimanni;
    Chelodina novaeguineae;
    Chelodina oblonga;
    Chelodina burrungandjii;
    Chelodina kuchlingi;
    Chelodina steindachneri;
    Emydura macquarii;
    Emydura subglobosa;
    Emydura victoriae;
    Emydura tanybaraga;
    Elseya dentata;
    Elseya albagula;
    Elseya irwini;
    Elseya branderhorsti;
    Elseya novaeguineae;
    Elseya schultzei;
    Myuchelys latisternum;
    Myuchelys bellii;
    Myuchelys georgesi;
    Myuchelys purvisi;
    Rheodytes leukops;
    Pseudemydura umbrina;
    Hydromedusa tectifera;
    Hydromedusa maximiliani;
    Phrynops geoffroanus;
    Phrynops hilarii;
    Phrynops tuberosus;
    Phrynops williamsi;
    Mesoclemmys gibba;
    Mesoclemmys nasuta;
    Mesoclemmys raniceps;
    Mesoclemmys tuberculata;
    Mesoclemmys vanderhaegei;
    Mesoclemmys dahli;
    Mesoclemmys zuliae;
    Mesoclemmys hogei;
    Mesoclemmys perplexa;
    Mesoclemmys heliostemma;
    Acanthochelys radiolata;
    Acanthochelys spixii;
    Acanthochelys pallidipectoris;
    Acanthochelys macrocephala;
    Platemys platycephala;
    Rhinemys rufipes;
    Podocnemis expansa;
    Podocnemis unifilis;
    Podocnemis sextuberculata;
    Podocnemis erythrocephala;
    Podocnemis lewyana;
    Podocnemis vogli;
    Peltocephalus dumerilianus;
    Erymnochelys madagascariensis;
    Pelomedusa subrufa;
    Pelomedusa galeata;
    Pelomedusa olivacea;
    Pelomedusa gehafie;
    Pelusios castaneus;
    Pelusios castanoides;
    Pelusios subniger;
    Pelusios sinuatus;
    Pelusios niger;
    Pelusios adansonii;
    Pelusios gabonensis;
    Pelusios marani;
    Pelusios nanus;
    Pelusios rhodesianus;
    Pelusios upembae
  `, [4,7,18,33], 90);

  // ============================================================
  // BIJTSCHILDPADDEN EN WEEKSCHILDSCHILDPADDEN
  // ============================================================

  kenmerkenDeel5(`
    Bijtschildpad=Chelydra serpentina;
    Chelydra acutirostris;
    Chelydra rossignonii;
    Alligatorschildpad=Macrochelys temminckii;
    Macrochelys suwanniensis;
    Platysternon megacephalum;
    Dermatemys mawii;
    Sternotherus odoratus;
    Sternotherus carinatus;
    Sternotherus minor;
    Sternotherus depressus;
    Sternotherus intermedius;
    Kinosternon subrubrum;
    Kinosternon baurii;
    Kinosternon flavescens;
    Kinosternon sonoriense;
    Kinosternon hirtipes;
    Kinosternon integrum;
    Kinosternon leucostomum;
    Kinosternon scorpioides;
    Kinosternon acutum;
    Kinosternon angustipons;
    Kinosternon creaseri;
    Kinosternon herrerai;
    Kinosternon oaxacae;
    Kinosternon chimalhuaca;
    Kinosternon alamosae;
    Kinosternon durangoense;
    Claudius angustatus;
    Staurotypus triporcatus;
    Staurotypus salvinii;
    Varkensneusschildpad=Carettochelys insculpta;
    Chinese weekschildschildpad=Pelodiscus sinensis;
    Pelodiscus maackii;
    Pelodiscus axenaria;
    Pelodiscus parviformis;
    Pelodiscus variegatus;
    Apalone spinifera;
    Apalone mutica;
    Apalone ferox;
    Trionyx triunguis;
    Rafetus euphraticus;
    Rafetus swinhoei;
    Nilssonia gangetica;
    Nilssonia hurum;
    Nilssonia leithii;
    Nilssonia formosa;
    Nilssonia nigricans;
    Amyda cartilaginea;
    Amyda ornata;
    Chitra indica;
    Chitra chitra;
    Chitra vandijki;
    Pelochelys cantorii;
    Pelochelys bibroni;
    Pelochelys signifera;
    Lissemys punctata;
    Lissemys scutata;
    Lissemys ceylonensis;
    Dogania subplana;
    Palea steindachneri;
    Cyclanorbis senegalensis;
    Cyclanorbis elegans;
    Cycloderma aubryi;
    Cycloderma frenatum
  `, [4,7,18,33], 90);

  // ============================================================
  // GORDELDIEREN
  // ============================================================

  kenmerkenDeel5(`
    Negenbandgordeldier=Dasypus novemcinctus;
    Dasypus septemcinctus;
    Dasypus hybridus;
    Dasypus pilosus;
    Dasypus kappleri;
    Dasypus pastasae;
    Dasypus beniensis;
    Zesbandgordeldier=Euphractus sexcinctus;
    Chaetophractus villosus;
    Chaetophractus vellerosus;
    Zaedyus pichiy;
    Reuzengordeldier=Priodontes maximus;
    Cabassous unicinctus;
    Cabassous centralis;
    Cabassous chacoensis;
    Cabassous tatouay;
    Cabassous squamicaudis;
    Driebandgordeldier=Tolypeutes matacus;
    Tolypeutes tricinctus;
    Gordelmol=Chlamyphorus truncatus;
    Calyptophractus retusus
  `, [4,18,33], 80);

  // ============================================================
  // SCHUBDIEREN
  // ============================================================

  kenmerkenDeel5(`
    Chinees schubdier=Manis pentadactyla;
    Indisch schubdier=Manis crassicaudata;
    Maleis schubdier=Manis javanica;
    Filipijns schubdier=Manis culionensis;
    Reuzenschubdier=Smutsia gigantea;
    Temmincks schubdier=Smutsia temminckii;
    Witbuikschubdier=Phataginus tricuspis;
    Zwartbuikschubdier=Phataginus tetradactyla
  `, [4,18,21], 75);

  // ============================================================
  // DIEREN MET DUIDELIJKE LANGE NEKKEN
  // ============================================================

  kenmerkenDeel5(`
    Giraffe=Giraffa camelopardalis;
    Giraffa reticulata;
    Giraffa tippelskirchi;
    Giraffa giraffa;
    Okapi=Okapia johnstoni;
    Gerenoek=Litocranius walleri;
    Dibatag=Ammodorcas clarkei;
    Dromedaris=Camelus dromedarius;
    Kameel=Camelus bactrianus;
    Wilde kameel=Camelus ferus;
    Lama=Lama glama;
    Guanaco=Lama guanicoe;
    Alpaca=Vicugna pacos;
    Vicuña=Vicugna vicugna
  `, [4,18,36], 55);

  kenmerkenDeel5(`
    Struisvogel;
    Somalische struisvogel;
    Emoe;
    Helmkasuaris;
    Casuarius unappendiculatus;
    Casuarius bennetti;
    Grote nandoe=Rhea americana;
    Kleine nandoe=Rhea pennata;
    Rhea tarapacensis;
    Rode flamingo;
    Grote flamingo;
    Kleine flamingo;
    Chileense flamingo=Phoenicopterus chilensis;
    Andesflamingo=Phoenicoparrus andinus;
    Jamesflamingo=Phoenicoparrus jamesi;
    Knobbelzwaan=Cygnus olor;
    Zwarte zwaan=Cygnus atratus;
    Zwarthalszwaan=Cygnus melancoryphus;
    Wilde zwaan=Cygnus cygnus;
    Kleine zwaan=Cygnus columbianus;
    Trompetzwaan=Cygnus buccinator;
    Coscorobazwaan=Coscoroba coscoroba;
    Blauwe reiger;
    Purperreiger=Ardea purpurea;
    Grote zilverreiger;
    Kleine zilverreiger;
    Amerikaanse blauwe reiger;
    Goliathreiger=Ardea goliath;
    Ardea cocoi;
    Ardea sumatrana;
    Ardea pacifica;
    Ardea melanocephala;
    Ardea humbloti;
    Ardea insignis;
    Ardea herodias;
    Egretta rufescens;
    Egretta thula;
    Egretta caerulea;
    Egretta gularis;
    Egretta sacra;
    Egretta tricolor;
    Egretta vinaceigula;
    Egretta ardesiaca;
    Ooievaar=Ciconia ciconia;
    Zwarte ooievaar=Ciconia nigra;
    Ciconia boyciana;
    Ciconia stormi;
    Ciconia maguari;
    Ciconia abdimii;
    Ciconia episcopus;
    Zadelbekooievaar;
    Ephippiorhynchus asiaticus;
    Maraboe;
    Leptoptilos dubius;
    Leptoptilos javanicus;
    Mycteria ibis;
    Mycteria americana;
    Mycteria cinerea;
    Mycteria leucocephala;
    Anastomus oscitans;
    Anastomus lamelligerus;
    Schoenbekooievaar;
    Kraanvogel=Grus grus;
    Canadese kraanvogel=Antigone canadensis;
    Saruskraanvogel=Antigone antigone;
    Antigone vipio;
    Antigone rubicunda;
    Grus japonensis;
    Grus monacha;
    Grus nigricollis;
    Grus americana;
    Grus carunculata;
    Siberische kraanvogel=Leucogeranus leucogeranus;
    Jufferkraanvogel=Anthropoides virgo;
    Blauwe kraanvogel=Anthropoides paradiseus;
    Grijze kroonkraanvogel=Balearica regulorum;
    Zwarte kroonkraanvogel=Balearica pavonina;
    Lepelaar=Platalea leucorodia;
    Platalea alba;
    Platalea minor;
    Platalea regia;
    Platalea flavipes;
    Rode lepelaar=Platalea ajaja;
    Afrikaanse slangenhalsvogel=Anhinga rufa;
    Amerikaanse slangenhalsvogel=Anhinga anhinga;
    Indische slangenhalsvogel=Anhinga melanogaster;
    Australische slangenhalsvogel=Anhinga novaehollandiae;
    Aalscholver;
    Kuifaalscholver
  `, [7,18,22,36], 75);

  koppel(`
    Chelodina longicollis;
    Chelodina expansa;
    Chelodina rugosa;
    Chelodina canni;
    Chelodina mccordi;
    Chelodina parkeri;
    Chelodina reimanni;
    Chelodina novaeguineae;
    Chelodina oblonga;
    Chelodina burrungandjii;
    Chelodina steindachneri;
    Hydromedusa tectifera;
    Hydromedusa maximiliani
  `, [36], 85);

  // ============================================================
  // UITGESTORVEN DIEREN MET LANGE NEKKEN
  // ============================================================

  kenmerkenDeel5(`
    Brachiosaurus;
    Diplodocus;
    Apatosaurus;
    Brontosaurus;
    Argentinosaurus;
    Patagotitan;
    Dreadnoughtus;
    Futalognkosaurus;
    Puertasaurus;
    Alamosaurus;
    Saltasaurus;
    Rapetosaurus;
    Isisaurus;
    Opisthocoelicaudia;
    Nemegtosaurus;
    Bonitasaura;
    Rinconsaurus;
    Muyelensaurus;
    Mendozasaurus;
    Neuquensaurus;
    Aeolosaurus;
    Gondwanatitan;
    Lirainosaurus;
    Ampelosaurus;
    Atsinganosaurus;
    Magyarosaurus;
    Paludititan;
    Lohuecotitan;
    Diamantinasaurus;
    Savannasaurus;
    Wintonotitan;
    Austrosaurus;
    Australotitan;
    Giraffatitan;
    Europasaurus;
    Lusotitan;
    Vouivria;
    Sonorasaurus;
    Cedarosaurus;
    Venenosaurus;
    Abydosaurus;
    Sauroposeidon;
    Paluxysaurus;
    Astrodon;
    Pleurocoelus;
    Euhelopus;
    Daxiatitan;
    Huanghetitan;
    Ruyangosaurus;
    Yongjinglong;
    Qiaowanlong;
    Erketu;
    Phuwiangosaurus;
    Tangvayosaurus;
    Mamenchisaurus;
    Omeisaurus;
    Shunosaurus;
    Tuojiangosaurus;
    Xinjiangtitan;
    Chuanjiesaurus;
    Hudiesaurus;
    Klamelisaurus;
    Bellusaurus;
    Jobaria;
    Spinophorosaurus;
    Cetiosaurus;
    Barapasaurus;
    Kotasaurus;
    Tazoudasaurus;
    Vulcanodon;
    Amygdalodon;
    Bagualia;
    Patagosaurus;
    Tehuelchesaurus;
    Lapparentosaurus;
    Bothriospondylus;
    Atlasaurus;
    Turiasaurus;
    Losillasaurus;
    Zby;
    Moabosaurus;
    Mierasaurus;
    Tendaguria;
    Camarasaurus;
    Haplocanthosaurus;
    Supersaurus;
    Barosaurus;
    Tornieria;
    Leinkupal;
    Galeamopus;
    Kaatedocus;
    Dinheirosaurus;
    Australodocus;
    Dicraeosaurus;
    Amargasaurus;
    Brachytrachelopan;
    Bajadasaurus;
    Suuwassea;
    Lingwulong;
    Nigersaurus;
    Rebbachisaurus;
    Limaysaurus;
    Cathartesaura;
    Demandasaurus;
    Tataouinea;
    Lavocatisaurus;
    Itapeuasaurus;
    Maraapunisaurus;
    Plateosaurus;
    Massospondylus;
    Lufengosaurus;
    Yunnanosaurus;
    Riojasaurus;
    Melanorosaurus;
    Lessemsaurus;
    Ingentia;
    Ledumahadi;
    Plesiosaurus;
    Elasmosaurus;
    Albertonectes;
    Styxosaurus;
    Hydrotherosaurus;
    Thalassomedon;
    Libonectes;
    Mauisaurus;
    Tuarangisaurus;
    Aristonectes;
    Morturneria;
    Kaiwhekea;
    Cryptoclidus;
    Muraenosaurus;
    Tricleidus;
    Kimmerosaurus;
    Ophthalmothule;
    Spitrasaurus;
    Colymbosaurus;
    Zarafasaura;
    Futabasaurus;
    Callawayasaurus;
    Wapuskanectes
  `, [36,43], 90);

  // Deze dinosauriërs worden alleen aan de nekvraag
  // gekoppeld wanneer hun lichaamsbouw daar goed bij past.

  for (const naam of [
    "Tuojiangosaurus",
    "Brachytrachelopan",
    "Nigersaurus"
  ]) {
    verwijderKoppeling(naam, [36]);
  }

  // ============================================================
  // GROTE LANDZOOGDIEREN
  // ============================================================

  koppel(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Javaanse neushoorn;
    Sumatraanse neushoorn;
    Nijlpaard;
    Giraffe;
    Giraffa reticulata;
    Giraffa tippelskirchi;
    Giraffa giraffa;
    Amerikaanse bizon;
    Europese bizon;
    Gaur;
    Wilde yak;
    Yak;
    Waterbuffel;
    Kaapse buffel;
    Eland;
    Dromedaris;
    Kameel;
    Wilde kameel;
    Elandantilope;
    Reuzenelandantilope;
    Grote koedoe;
    Bruine beer;
    IJsbeer;
    Grizzlybeer;
    Wapiti
  `, [9], 45);

  // ============================================================
  // GROTE WALVISACHTIGEN
  // ============================================================

  kenmerkenDeel5(`
    Blauwe vinvis=Balaenoptera musculus;
    Gewone vinvis=Balaenoptera physalus;
    Noordse vinvis=Balaenoptera borealis;
    Brydevinvis=Balaenoptera brydei;
    Balaenoptera edeni;
    Balaenoptera omurai;
    Balaenoptera ricei;
    Dwergvinvis=Balaenoptera acutorostrata;
    Antarctische dwergvinvis=Balaenoptera bonaerensis;
    Bultrug=Megaptera novaeangliae;
    Groenlandse walvis=Balaena mysticetus;
    Noordkaper=Eubalaena glacialis;
    Zuidkaper=Eubalaena australis;
    Japanse noordkaper=Eubalaena japonica;
    Grijze walvis=Eschrichtius robustus;
    Dwergwalvis=Caperea marginata;
    Potvis=Physeter macrocephalus;
    Dwergpotvis=Kogia breviceps;
    Kleinste potvis=Kogia sima;
    Orka=Orcinus orca;
    Zwarte zwaardwalvis=Pseudorca crassidens;
    Griend=Globicephala melas;
    Indische griend=Globicephala macrorhynchus;
    Gramper=Grampus griseus;
    Narwal=Monodon monoceros;
    Beloega=Delphinapterus leucas;
    Butskop=Hyperoodon ampullatus;
    Hyperoodon planifrons;
    Spitssnuitdolfijn=Ziphius cavirostris;
    Berardius bairdii;
    Berardius arnuxii;
    Berardius minimus;
    Tasmacetus shepherdi;
    Indopacetus pacificus;
    Mesoplodon bidens;
    Mesoplodon densirostris;
    Mesoplodon europaeus;
    Mesoplodon grayi;
    Mesoplodon hectori;
    Mesoplodon layardii;
    Mesoplodon mirus;
    Mesoplodon perrini;
    Mesoplodon peruvianus;
    Mesoplodon stejnegeri;
    Mesoplodon traversii;
    Mesoplodon ginkgodens;
    Mesoplodon carlhubbsi;
    Mesoplodon bowdoini;
    Mesoplodon hotaula;
    Mesoplodon eueu
  `, [1,9,11,14,18], 80);

  // ============================================================
  // GROTE VISSEN
  // ============================================================

  kenmerkenDeel5(`
    Walvishaai=Rhincodon typus;
    Reuzenhaai=Cetorhinus maximus;
    Witte haai=Carcharodon carcharias;
    Tijgerhaai=Galeocerdo cuvier;
    Groenlandse haai=Somniosus microcephalus;
    Somniosus pacificus;
    Somniosus antarcticus;
    Grote hamerhaai=Sphyrna mokarran;
    Sphyrna lewini;
    Sphyrna zygaena;
    Zandtijgerhaai=Carcharias taurus;
    Odontaspis ferox;
    Odontaspis noronhai;
    Makohaai=Isurus oxyrinchus;
    Isurus paucus;
    Lamna nasus;
    Lamna ditropis;
    Voshaai=Alopias vulpinus;
    Alopias superciliosus;
    Alopias pelagicus;
    Megachasma pelagios;
    Hexanchus griseus;
    Hexanchus nakamurai;
    Notorynchus cepedianus;
    Carcharhinus leucas;
    Carcharhinus obscurus;
    Carcharhinus galapagensis;
    Carcharhinus longimanus;
    Carcharhinus plumbeus;
    Carcharhinus falciformis;
    Carcharhinus limbatus;
    Carcharhinus brevipinna;
    Carcharhinus amblyrhynchos;
    Negaprion brevirostris;
    Negaprion acutidens;
    Ginglymostoma cirratum;
    Nebrius ferrugineus;
    Stegostoma tigrinum;
    Pristis pristis;
    Pristis pectinata;
    Pristis zijsron;
    Pristis clavata;
    Anoxypristis cuspidata;
    Mobula birostris;
    Mobula alfredi;
    Mobula mobular;
    Mobula tarapacana;
    Mobula thurstoni;
    Urogymnus polylepis;
    Bathytoshia brevicaudata;
    Dasyatis pastinaca;
    Zwaardvis=Xiphias gladius;
    Blauwe marlijn=Makaira nigricans;
    Zwarte marlijn=Istiompax indica;
    Gestreepte marlijn=Kajikia audax;
    Kajikia albida;
    Zeilvis=Istiophorus platypterus;
    Atlantische blauwvintonijn=Thunnus thynnus;
    Thunnus orientalis;
    Thunnus maccoyii;
    Thunnus albacares;
    Thunnus obesus;
    Reuzenbaars=Epinephelus lanceolatus;
    Epinephelus itajara;
    Epinephelus quinquefasciatus;
    Stereolepis gigas;
    Stereolepis doederleini;
    Maanvis van de zee=Mola mola;
    Mola alexandrini;
    Mola tecta;
    Masturus lanceolatus;
    Regalecus glesne;
    Regalecus russelii;
    Trachipterus arcticus;
    Lophotus lacepede
  `, [1,11,14,18], 85);

  koppel(`
    Walvishaai;
    Reuzenhaai;
    Witte haai;
    Tijgerhaai;
    Groenlandse haai;
    Somniosus pacificus;
    Somniosus antarcticus;
    Grote hamerhaai;
    Sphyrna lewini;
    Sphyrna zygaena;
    Zandtijgerhaai;
    Odontaspis ferox;
    Makohaai;
    Isurus paucus;
    Lamna nasus;
    Lamna ditropis;
    Voshaai;
    Alopias superciliosus;
    Alopias pelagicus;
    Megachasma pelagios;
    Hexanchus griseus;
    Notorynchus cepedianus;
    Carcharhinus leucas;
    Carcharhinus obscurus;
    Carcharhinus galapagensis;
    Carcharhinus longimanus;
    Carcharhinus plumbeus;
    Carcharhinus falciformis;
    Negaprion brevirostris;
    Negaprion acutidens;
    Ginglymostoma cirratum;
    Nebrius ferrugineus;
    Stegostoma tigrinum;
    Pristis pristis;
    Pristis pectinata;
    Pristis zijsron;
    Anoxypristis cuspidata;
    Mobula birostris;
    Mobula alfredi;
    Urogymnus polylepis;
    Zwaardvis;
    Blauwe marlijn;
    Zwarte marlijn;
    Gestreepte marlijn;
    Zeilvis;
    Atlantische blauwvintonijn;
    Thunnus orientalis;
    Thunnus maccoyii;
    Thunnus albacares;
    Thunnus obesus;
    Reuzenbaars;
    Epinephelus itajara;
    Stereolepis gigas;
    Mola mola;
    Mola alexandrini;
    Mola tecta;
    Masturus lanceolatus;
    Regalecus glesne;
    Regalecus russelii
  `, [9], 80);

  // ============================================================
  // GROTE ZOETWATERVISSEN
  // ============================================================

  kenmerkenDeel5(`
    Europese meerval=Silurus glanis;
    Silurus soldatovi;
    Mekongreuzenmeerval=Pangasianodon gigas;
    Pangasianodon hypophthalmus;
    Pangasius sanitwongsei;
    Phractocephalus hemioliopterus;
    Brachyplatystoma filamentosum;
    Brachyplatystoma rousseauxii;
    Brachyplatystoma vaillantii;
    Pseudoplatystoma corruscans;
    Pseudoplatystoma fasciatum;
    Pseudoplatystoma tigrinum;
    Bagarius yarrelli;
    Bagarius bagarius;
    Wallago attu;
    Wallagonia leerii;
    Arapaima gigas;
    Arapaima mapae;
    Arapaima leptosoma;
    Arapaima agassizii;
    Arapaima arapaima;
    Alligatorsnoek=Atractosteus spatula;
    Atractosteus tristoechus;
    Atractosteus tropicus;
    Lepisosteus osseus;
    Belugasteur=Huso huso;
    Huso dauricus;
    Acipenser sturio;
    Acipenser oxyrinchus;
    Acipenser transmontanus;
    Acipenser fulvescens;
    Acipenser gueldenstaedtii;
    Acipenser baerii;
    Acipenser nudiventris;
    Acipenser stellatus;
    Acipenser sinensis;
    Acipenser dabryanus;
    Acipenser schrenckii;
    Acipenser persicus;
    Acipenser mikadoi;
    Acipenser medirostris;
    Acipenser naccarii;
    Polyodon spathula;
    Maccullochella peelii;
    Lates niloticus;
    Lates calcarifer;
    Hydrocynus goliath;
    Lucioperca lucioperca
  `, [1,14,18], 85);

  koppel(`
    Silurus glanis;
    Silurus soldatovi;
    Pangasianodon gigas;
    Pangasius sanitwongsei;
    Brachyplatystoma filamentosum;
    Arapaima gigas;
    Atractosteus spatula;
    Huso huso;
    Huso dauricus;
    Acipenser sturio;
    Acipenser oxyrinchus;
    Acipenser transmontanus;
    Acipenser fulvescens;
    Acipenser gueldenstaedtii;
    Acipenser baerii;
    Acipenser nudiventris;
    Acipenser stellatus;
    Acipenser sinensis;
    Acipenser schrenckii;
    Acipenser persicus;
    Acipenser mikadoi;
    Acipenser medirostris;
    Polyodon spathula;
    Lates niloticus
  `, [9], 85);

  // ============================================================
  // GROTE REPTIELEN
  // ============================================================

  kenmerkenDeel5(`
    Nijlkrokodil=Crocodylus niloticus;
    Zeekrokodil=Crocodylus porosus;
    Amerikaanse krokodil=Crocodylus acutus;
    Cubaanse krokodil=Crocodylus rhombifer;
    Moreletkrokodil=Crocodylus moreletii;
    Filipijnse krokodil=Crocodylus mindorensis;
    Australische zoetwaterkrokodil=Crocodylus johnstoni;
    Crocodylus intermedius;
    Crocodylus palustris;
    Crocodylus siamensis;
    Crocodylus novaeguineae;
    Crocodylus halli;
    Crocodylus suchus;
    Mecistops cataphractus;
    Mecistops leptorhynchus;
    Amerikaanse alligator=Alligator mississippiensis;
    Chinese alligator=Alligator sinensis;
    Zwarte kaaiman=Melanosuchus niger;
    Brilkaaiman=Caiman crocodilus;
    Caiman latirostris;
    Caiman yacare;
    Gaviaal=Gavialis gangeticus;
    Onechte gaviaal=Tomistoma schlegelii;
    Komodovaraan=Varanus komodoensis;
    Nijlvaraan;
    Perentie;
    Varanus salvator;
    Varanus salvadorii
  `, [4,7,18,21], 75);

  koppel(`
    Nijlkrokodil;
    Zeekrokodil;
    Amerikaanse krokodil;
    Cubaanse krokodil;
    Moreletkrokodil;
    Filipijnse krokodil;
    Australische zoetwaterkrokodil;
    Crocodylus intermedius;
    Crocodylus palustris;
    Crocodylus siamensis;
    Crocodylus novaeguineae;
    Crocodylus halli;
    Crocodylus suchus;
    Mecistops cataphractus;
    Mecistops leptorhynchus;
    Amerikaanse alligator;
    Zwarte kaaiman;
    Brilkaaiman;
    Caiman latirostris;
    Caiman yacare;
    Gaviaal;
    Onechte gaviaal;
    Komodovaraan;
    Nijlvaraan;
    Perentie;
    Varanus salvator;
    Varanus salvadorii;
    Lederschildpad
  `, [9], 70);

  // ============================================================
  // KLEINE DIEREN - MIEREN
  // ============================================================

  kenmerkenDeel5(`
    Zwarte wegmier=Lasius niger;
    Gele weidemier=Lasius flavus;
    Lasius brunneus;
    Lasius emarginatus;
    Lasius fuliginosus;
    Lasius alienus;
    Lasius psammophilus;
    Lasius platythorax;
    Lasius umbratus;
    Lasius mixtus;
    Lasius sabularum;
    Lasius meridionalis;
    Lasius bicornis;
    Lasius distinguendus;
    Lasius jensi;
    Lasius neglectus;
    Formica rufa;
    Formica polyctena;
    Formica pratensis;
    Formica truncorum;
    Formica sanguinea;
    Formica fusca;
    Formica cunicularia;
    Formica rufibarbis;
    Formica cinerea;
    Formica fuscocinerea;
    Formica lemani;
    Formica lugubris;
    Formica aquilonia;
    Formica exsecta;
    Formica pressilabris;
    Formica forsslundi;
    Formica uralensis;
    Formica picea;
    Formica transkaucasica;
    Myrmica rubra;
    Myrmica ruginodis;
    Myrmica scabrinodis;
    Myrmica sabuleti;
    Myrmica schencki;
    Myrmica lobulicornis;
    Myrmica lobicornis;
    Myrmica sulcinodis;
    Myrmica specioides;
    Myrmica rugulosa;
    Myrmica gallienii;
    Myrmica vandeli;
    Myrmica karavajevi;
    Tetramorium caespitum;
    Tetramorium immigrans;
    Tetramorium impurum;
    Tetramorium moravicum;
    Tetramorium semilaeve;
    Tetramorium bicarinatum;
    Tetramorium simillimum;
    Tetramorium caldarium;
    Tetramorium guineense;
    Tapinoma erraticum;
    Tapinoma subboreale;
    Tapinoma melanocephalum;
    Tapinoma sessile;
    Tapinoma magnum;
    Tapinoma nigerrimum;
    Monomorium pharaonis;
    Monomorium minimum;
    Monomorium monomorium;
    Monomorium floricola;
    Monomorium salomonis;
    Pheidole megacephala;
    Pheidole pallidula;
    Pheidole noda;
    Pheidole dentata;
    Pheidole morrisi;
    Pheidole bicarinata;
    Pheidole pilifera;
    Pheidole fervida;
    Pheidole indica;
    Pheidole hyatti;
    Pheidole rugatula;
    Pheidole obscurithorax;
    Pheidole navigans;
    Pheidole bilimeki;
    Pheidole punctatissima;
    Pheidole anastasii;
    Pheidole fallax;
    Pheidole radoszkowskii;
    Solenopsis invicta;
    Solenopsis richteri;
    Solenopsis geminata;
    Solenopsis molesta;
    Solenopsis fugax;
    Solenopsis saevissima;
    Solenopsis xyloni;
    Solenopsis aurea;
    Solenopsis gayi;
    Solenopsis amblychila;
    Crematogaster scutellaris;
    Crematogaster auberti;
    Crematogaster sordidula;
    Crematogaster lineolata;
    Crematogaster cerasi;
    Crematogaster ashmeadi;
    Crematogaster laeviuscula;
    Crematogaster pilosa;
    Crematogaster obscurata;
    Crematogaster rogenhoferi;
    Crematogaster inflata;
    Crematogaster borneensis;
    Temnothorax nylanderi;
    Temnothorax unifasciatus;
    Temnothorax albipennis;
    Temnothorax interruptus;
    Temnothorax tuberum;
    Temnothorax affinis;
    Temnothorax corticalis;
    Temnothorax parvulus;
    Temnothorax exilis;
    Temnothorax recedens;
    Temnothorax rugatulus;
    Temnothorax curvispinosus;
    Temnothorax longispinosus;
    Temnothorax ambiguus;
    Temnothorax americanus;
    Leptothorax acervorum;
    Leptothorax muscorum;
    Leptothorax gredleri;
    Leptothorax kutteri;
    Aphaenogaster subterranea;
    Aphaenogaster senilis;
    Aphaenogaster gibbosa;
    Aphaenogaster spinosa;
    Aphaenogaster testaceopilosa;
    Aphaenogaster rudis;
    Aphaenogaster picea;
    Aphaenogaster fulva;
    Aphaenogaster treatae;
    Aphaenogaster texana;
    Aphaenogaster occidentalis;
    Messor barbarus;
    Messor structor;
    Messor capitatus;
    Messor minor;
    Messor wasmanni;
    Messor arenarius;
    Messor semirufus;
    Messor ebeninus
  `, [7,10], 90);

  // ============================================================
  // KLEINE DIEREN - BLADLUIZEN
  // ============================================================

  kenmerkenDeel5(`
    Aphis fabae;
    Aphis gossypii;
    Aphis pomi;
    Aphis spiraecola;
    Aphis craccivora;
    Aphis nerii;
    Aphis sambuci;
    Aphis urticata;
    Aphis ruborum;
    Aphis idaei;
    Aphis grossulariae;
    Aphis schneideri;
    Aphis frangulae;
    Aphis nasturtii;
    Aphis chloris;
    Aphis farinosa;
    Aphis hederae;
    Aphis viburni;
    Aphis rumicis;
    Aphis acetosae;
    Aphis plantaginis;
    Aphis polygonata;
    Aphis sedi;
    Aphis solanella;
    Aphis punicae;
    Aphis illinoisensis;
    Aphis glycines;
    Myzus persicae;
    Myzus cerasi;
    Myzus ascalonicus;
    Myzus ornatus;
    Myzus varians;
    Myzus borealis;
    Myzus lythri;
    Myzus nicotianae;
    Macrosiphum rosae;
    Macrosiphum euphorbiae;
    Macrosiphum albifrons;
    Macrosiphum avenae;
    Macrosiphum gei;
    Macrosiphum cholodkovskyi;
    Macrosiphum funestum;
    Macrosiphum hellebori;
    Macrosiphum melampyri;
    Macrosiphum ptericolens;
    Acyrthosiphon pisum;
    Acyrthosiphon kondoi;
    Acyrthosiphon malvae;
    Acyrthosiphon loti;
    Acyrthosiphon gossypii;
    Acyrthosiphon caraganae;
    Rhopalosiphum padi;
    Rhopalosiphum maidis;
    Rhopalosiphum insertum;
    Rhopalosiphum nymphaeae;
    Rhopalosiphum rufiabdominale;
    Sitobion avenae;
    Sitobion fragariae;
    Sitobion miscanthi;
    Schizaphis graminum;
    Schizaphis rotundiventris;
    Diuraphis noxia;
    Diuraphis tritici;
    Metopolophium dirhodum;
    Metopolophium festucae;
    Brevicoryne brassicae;
    Lipaphis erysimi;
    Lipaphis pseudobrassicae;
    Cavariella aegopodii;
    Cavariella archangelicae;
    Cavariella pastinacae;
    Cavariella theobaldi;
    Hyalopterus pruni;
    Hyalopterus amygdali;
    Hyalopterus arundiniformis;
    Dysaphis plantaginea;
    Dysaphis devecta;
    Dysaphis crataegi;
    Dysaphis pyri;
    Dysaphis anthrisci;
    Dysaphis apiifolia;
    Dysaphis foeniculus;
    Brachycaudus helichrysi;
    Brachycaudus cardui;
    Brachycaudus persicae;
    Brachycaudus tragopogonis;
    Brachycaudus lychnidis;
    Brachycaudus divaricatae;
    Nasonovia ribisnigri;
    Hyperomyzus lactucae;
    Hyperomyzus pallidus;
    Hyperomyzus picridis;
    Uroleucon sonchi;
    Uroleucon jaceae;
    Uroleucon cirsii;
    Uroleucon tanaceti;
    Uroleucon aeneum;
    Uroleucon achilleae;
    Uroleucon ambrosiae;
    Uroleucon erigeronense;
    Uroleucon rudbeckiae;
    Uroleucon solidaginis;
    Eriosoma lanigerum;
    Eriosoma ulmi;
    Eriosoma lanuginosum;
    Eriosoma grossulariae;
    Pemphigus bursarius;
    Pemphigus spyrothecae;
    Pemphigus populinigrae;
    Pemphigus immunis;
    Pemphigus betae;
    Pemphigus populivenae
  `, [10], 90);

  // Bladluizen planten zich vaak levendbarend voort.
  // Daarom geen automatische koppeling aan vraag 7.

  // ============================================================
  // KLEINE DIEREN - LIEVEHEERSBEESTJES
  // ============================================================

  kenmerkenDeel5(`
    Zevenstippelig lieveheersbeestje=Coccinella septempunctata;
    Coccinella quinquepunctata;
    Coccinella undecimpunctata;
    Coccinella hieroglyphica;
    Coccinella magnifica;
    Coccinella transversalis;
    Coccinella transversoguttata;
    Coccinella novemnotata;
    Coccinella trifasciata;
    Coccinella californica;
    Coccinella monticola;
    Coccinella fulgida;
    Tweestippelig lieveheersbeestje=Adalia bipunctata;
    Tienstippelig lieveheersbeestje=Adalia decempunctata;
    Adalia tetraspilota;
    Adalia frigida;
    Aziatisch lieveheersbeestje=Harmonia axyridis;
    Harmonia quadripunctata;
    Harmonia conformis;
    Harmonia octomaculata;
    Harmonia dimidiata;
    Hippodamia variegata;
    Hippodamia convergens;
    Hippodamia tredecimpunctata;
    Hippodamia quinquesignata;
    Hippodamia sinuata;
    Hippodamia parenthesis;
    Hippodamia glacialis;
    Hippodamia apicalis;
    Hippodamia expurgata;
    Propylea quatuordecimpunctata;
    Propylea japonica;
    Propylea dissecta;
    Psyllobora vigintiduopunctata;
    Psyllobora vigintimaculata;
    Psyllobora confluens;
    Psyllobora hybrida;
    Halyzia sedecimguttata;
    Calvia quatuordecimguttata;
    Calvia decemguttata;
    Calvia quindecimguttata;
    Calvia quinquedecimguttata;
    Anatis ocellata;
    Anatis mali;
    Anatis labiculata;
    Anatis rathvoni;
    Myrrha octodecimguttata;
    Myzia oblongoguttata;
    Sospita vigintiguttata;
    Tytthaspis sedecimpunctata;
    Tytthaspis trilineata;
    Chilocorus renipustulatus;
    Chilocorus bipustulatus;
    Chilocorus stigma;
    Chilocorus kuwanae;
    Chilocorus nigritus;
    Exochomus quadripustulatus;
    Exochomus nigromaculatus;
    Exochomus flavipes;
    Exochomus marginipennis;
    Scymnus frontalis;
    Scymnus rubromaculatus;
    Scymnus interruptus;
    Scymnus suturalis;
    Scymnus nigrinus;
    Scymnus haemorrhoidalis;
    Scymnus auritus;
    Scymnus ferrugatus;
    Scymnus subvillosus;
    Scymnus apetzi;
    Scymnus abietis;
    Scymnus mimulus;
    Nephus redtenbacheri;
    Nephus quadrimaculatus;
    Nephus bipunctatus;
    Nephus bisignatus;
    Stethorus punctillum;
    Stethorus pusillus;
    Stethorus punctum;
    Stethorus gilvifrons;
    Rodolia cardinalis=Novius cardinalis;
    Cryptolaemus montrouzieri;
    Rhyzobius lophanthae;
    Rhyzobius litura;
    Rhyzobius chrysomeloides;
    Epilachna varivestis;
    Henosepilachna vigintioctopunctata;
    Henosepilachna vigintioctomaculata;
    Subcoccinella vigintiquatuorpunctata
  `, [7,10], 85);

  // Niet alle lieveheersbeestjes eten andere dieren.
  // Niet alle soorten hebben stippen.
  // Deze eigenschappen worden afzonderlijk toegevoegd.

  // ============================================================
  // KLEINE DIEREN - SPRINGSTAARTEN
  // ============================================================

  kenmerkenDeel5(`
    Folsomia candida;
    Folsomia fimetaria;
    Folsomia quadrioculata;
    Folsomia manolachei;
    Folsomia penicula;
    Folsomia diplophthalma;
    Folsomia spinosa;
    Folsomia brevicauda;
    Folsomia inoculata;
    Isotoma viridis;
    Isotoma anglicana;
    Isotoma riparia;
    Isotoma maritima;
    Isotomurus palustris;
    Isotomurus maculatus;
    Isotomurus fucicolus;
    Isotomurus plumosus;
    Isotomurus unifasciatus;
    Isotomurus graminis;
    Parisotoma notabilis;
    Parisotoma ekmani;
    Proisotoma minuta;
    Proisotoma tenella;
    Proisotoma subminuta;
    Cryptopygus antarcticus;
    Cryptopygus thermophilus;
    Cryptopygus bipunctatus;
    Cryptopygus ponticus;
    Entomobrya nivalis;
    Entomobrya multifasciata;
    Entomobrya albocincta;
    Entomobrya corticalis;
    Entomobrya lanuginosa;
    Entomobrya marginata;
    Entomobrya muscorum;
    Entomobrya intermedia;
    Entomobrya quinquelineata;
    Entomobrya dorsalis;
    Entomobrya atrocincta;
    Lepidocyrtus lignorum;
    Lepidocyrtus cyaneus;
    Lepidocyrtus lanuginosus;
    Lepidocyrtus curvicollis;
    Lepidocyrtus violaceus;
    Lepidocyrtus paradoxus;
    Lepidocyrtus ruber;
    Orchesella cincta;
    Orchesella flavescens;
    Orchesella villosa;
    Orchesella bifasciata;
    Orchesella quinquefasciata;
    Orchesella spectabilis;
    Orchesella albofasciata;
    Tomocerus vulgaris;
    Tomocerus minor;
    Tomocerus minutus;
    Tomocerus flavescens;
    Pogonognathellus longicornis;
    Pogonognathellus flavescens;
    Hypogastrura purpurescens;
    Hypogastrura viatica;
    Hypogastrura socialis;
    Hypogastrura vernalis;
    Hypogastrura manubrialis;
    Hypogastrura tullbergi;
    Ceratophysella denticulata;
    Ceratophysella armata;
    Ceratophysella succinea;
    Ceratophysella bengtssoni;
    Xenylla humicola;
    Xenylla tullbergi;
    Xenylla maritima;
    Xenylla grisea;
    Xenylla brevisimilis;
    Xenylla corticalis;
    Anurida maritima;
    Anurida granaria;
    Anurida tullbergi;
    Neanura muscorum;
    Neanura minuta;
    Deutonura albella;
    Deutonura conjuncta;
    Deutonura phlegraea;
    Bilobella aurantiaca;
    Bilobella braunerae;
    Friesea mirabilis;
    Friesea truncata;
    Friesea claviseta;
    Friesea acuminata;
    Sminthurus viridis;
    Sminthurus nigromaculatus;
    Sminthurus multipunctatus;
    Sminthurus maculatus;
    Allacma fusca;
    Allacma gallica;
    Dicyrtoma fusca;
    Dicyrtoma setosa;
    Dicyrtomina ornata;
    Dicyrtomina minuta;
    Dicyrtomina saundersi;
    Sminthurinus aureus;
    Sminthurinus elegans;
    Sminthurinus niger;
    Sminthurinus trinotatus;
    Bourletiella hortensis;
    Bourletiella arvalis;
    Bourletiella viridescens;
    Deuterosminthurus pallipes;
    Deuterosminthurus bicinctus;
    Deuterosminthurus sulphureus
  `, [7,10], 90);

  // ============================================================
  // DIEREN MET SCHUBBEN - HAGEDISSEN
  // ============================================================

  kenmerkenDeel5(`
    Groene leguaan=Iguana iguana;
    Iguana delicatissima;
    Zeeleguaan;
    Conolophus subcristatus;
    Conolophus pallidus;
    Conolophus marthae;
    Cyclura cornuta;
    Cyclura nubila;
    Cyclura lewisi;
    Cyclura carinata;
    Cyclura cychlura;
    Cyclura rileyi;
    Cyclura collei;
    Cyclura pinguis;
    Cyclura ricordi;
    Cyclura ricordii;
    Cyclura stejnegeri;
    Cyclura onchiopsis;
    Ctenosaura similis;
    Ctenosaura pectinata;
    Ctenosaura acanthura;
    Ctenosaura palearis;
    Ctenosaura bakeri;
    Ctenosaura oedirhina;
    Ctenosaura melanosterna;
    Ctenosaura quinquecarinata;
    Ctenosaura clarki;
    Ctenosaura hemilopha;
    Ctenosaura conspicuosa;
    Ctenosaura defensor;
    Ctenosaura alfredschmidti;
    Sauromalus ater;
    Sauromalus hispidus;
    Sauromalus varius;
    Sauromalus klauberi;
    Sauromalus slevini;
    Dipsosaurus dorsalis;
    Brachylophus fasciatus;
    Brachylophus vitiensis;
    Brachylophus bulabula;
    Brachylophus gau;
    Basiliscus basiliscus;
    Basiliscus plumifrons;
    Basiliscus vittatus;
    Basiliscus galeritus;
    Corytophanes cristatus;
    Corytophanes hernandesii;
    Corytophanes percarinatus;
    Laemanctus longipes;
    Laemanctus serratus;
    Anolis carolinensis;
    Anolis sagrei;
    Anolis cristatellus;
    Anolis equestris;
    Anolis garmani;
    Anolis porcatus;
    Anolis allisoni;
    Anolis grahami;
    Anolis lineatopus;
    Anolis valencienni;
    Anolis opalinus;
    Anolis conspersus;
    Anolis distichus;
    Anolis cybotes;
    Anolis armouri;
    Anolis marcanoi;
    Anolis longitibialis;
    Anolis coelestinus;
    Anolis chlorocyanus;
    Anolis aliniger;
    Anolis singularis;
    Anolis bahorucoensis;
    Anolis olssoni;
    Anolis semilineatus;
    Anolis pulchellus;
    Anolis evermanni;
    Anolis stratulus;
    Anolis gundlachi;
    Anolis krugi;
    Anolis occultus;
    Anolis cuvieri;
    Anolis cooki;
    Anolis poncensis;
    Anolis monensis;
    Anolis roosevelti
  `, [18,21], 85);

  // ============================================================
  // ECHTE HAGEDISSEN
  // ============================================================

  kenmerkenDeel5(`
    Lacerta agilis;
    Lacerta viridis;
    Lacerta bilineata;
    Lacerta trilineata;
    Lacerta media;
    Lacerta schreiberi;
    Lacerta strigata;
    Lacerta pamphylica;
    Timon lepidus;
    Timon tangitanus;
    Timon pater;
    Timon princeps;
    Timon kurdistanicus;
    Podarcis muralis;
    Podarcis siculus;
    Podarcis melisellensis;
    Podarcis tauricus;
    Podarcis erhardii;
    Podarcis milensis;
    Podarcis peloponnesiacus;
    Podarcis cretensis;
    Podarcis gaigeae;
    Podarcis pityusensis;
    Podarcis lilfordi;
    Podarcis filfolensis;
    Podarcis raffonei;
    Podarcis waglerianus;
    Podarcis tiliguerta;
    Podarcis bocagei;
    Podarcis carbonelli;
    Podarcis hispanicus;
    Podarcis liolepis;
    Podarcis guadarramae;
    Podarcis vaucheri;
    Podarcis virescens;
    Iberolacerta monticola;
    Iberolacerta horvathi;
    Iberolacerta cyreni;
    Iberolacerta galani;
    Iberolacerta martinezricai;
    Iberolacerta bonnali;
    Iberolacerta aranica;
    Iberolacerta aurelioi;
    Algyroides nigropunctatus;
    Algyroides moreoticus;
    Algyroides fitzingeri;
    Algyroides marchi;
    Dinarolacerta mosorensis;
    Dinarolacerta montenegrina;
    Dalmatolacerta oxycephala;
    Archaeolacerta bedriagae;
    Hellenolacerta graeca;
    Zootoca vivipara;
    Psammodromus algirus;
    Psammodromus hispanicus;
    Psammodromus occidentalis;
    Psammodromus edwardsianus;
    Psammodromus blanci;
    Psammodromus microdactylus;
    Gallotia galloti;
    Gallotia stehlini;
    Gallotia atlantica;
    Gallotia caesaris;
    Gallotia simonyi;
    Gallotia intermedia;
    Gallotia bravoana;
    Takydromus sexlineatus;
    Takydromus tachydromoides;
    Takydromus septentrionalis;
    Takydromus amurensis;
    Takydromus wolteri;
    Takydromus formosanus;
    Takydromus smaragdinus;
    Takydromus dorsalis;
    Takydromus kuehnei;
    Takydromus sauteri;
    Takydromus stejnegeri;
    Takydromus sylvaticus;
    Takydromus toyamai;
    Takydromus viridipunctatus
  `, [4,18,21], 85);

  // ============================================================
  // DIEREN MET SCHUBBEN - BOA'S EN PYTHONS
  // ============================================================

  kenmerkenDeel5(`
    Boa constrictor;
    Boa imperator;
    Boa sigma;
    Boa occidentalis;
    Groene anaconda=Eunectes murinus;
    Gele anaconda=Eunectes notaeus;
    Eunectes deschauenseei;
    Eunectes beniensis;
    Corallus caninus;
    Corallus batesii;
    Corallus hortulana;
    Corallus ruschenbergerii;
    Corallus annulatus;
    Corallus blombergi;
    Corallus cropanii;
    Corallus cookii;
    Corallus grenadensis;
    Epicrates cenchria;
    Epicrates maurus;
    Epicrates crassus;
    Epicrates assisi;
    Epicrates alvarezi;
    Chilabothrus angulifer;
    Chilabothrus striatus;
    Chilabothrus inornatus;
    Chilabothrus subflavus;
    Chilabothrus granti;
    Chilabothrus monensis;
    Chilabothrus chrysogaster;
    Chilabothrus exsul;
    Chilabothrus strigilatus;
    Chilabothrus argentum;
    Chilabothrus fordii;
    Chilabothrus gracilis;
    Chilabothrus schwartzi;
    Sanzinia madagascariensis;
    Sanzinia volontany;
    Acrantophis madagascariensis;
    Acrantophis dumerili;
    Candoia aspera;
    Candoia bibroni;
    Candoia carinata;
    Candoia paulsoni;
    Candoia superciliosa;
    Python regius;
    Python sebae;
    Python natalensis;
    Python molurus;
    Python bivittatus;
    Python brongersmai;
    Python curtus;
    Python breitensteini;
    Python anchietae;
    Python kyaiktiyo;
    Malayopython reticulatus;
    Malayopython timoriensis;
    Morelia spilota;
    Morelia viridis;
    Morelia azurea;
    Morelia bredli;
    Morelia carinata;
    Simalia amethistina;
    Simalia kinghorni;
    Simalia boeleni;
    Simalia clastolepis;
    Simalia nauta;
    Simalia tracyae;
    Antaresia childreni;
    Antaresia maculosa;
    Antaresia perthensis;
    Antaresia stimsoni;
    Aspidites melanocephalus;
    Aspidites ramsayi;
    Liasis olivaceus;
    Liasis fuscus;
    Liasis mackloti;
    Apodora papuana;
    Bothrochilus boa;
    Leiopython albertisii;
    Leiopython hoserae
  `, [18,21], 85);

  // ============================================================
  // DIEREN MET SCHUBBEN - RATSLANGEN
  // ============================================================

  kenmerkenDeel5(`
    Korenslang=Pantherophis guttatus;
    Pantherophis emoryi;
    Pantherophis slowinskii;
    Pantherophis obsoletus;
    Pantherophis alleghaniensis;
    Pantherophis spiloides;
    Pantherophis bairdi;
    Pantherophis vulpinus;
    Pantherophis ramspotti;
    Elaphe quatuorlineata;
    Elaphe sauromates;
    Elaphe dione;
    Elaphe schrenckii;
    Elaphe anomala;
    Elaphe climacophora;
    Elaphe quadrivirgata;
    Elaphe davidi;
    Elaphe carinata;
    Elaphe taeniura;
    Elaphe hodgsoni;
    Elaphe cantoris;
    Elaphe zoigeensis;
    Elaphe moellendorffi;
    Elaphe bimaculata;
    Elaphe rufodorsata;
    Zamenis longissimus;
    Zamenis lineatus;
    Zamenis situla;
    Zamenis scalaris;
    Zamenis persicus;
    Zamenis hohenackeri;
    Euprepiophis mandarinus;
    Euprepiophis conspicillata;
    Euprepiophis perlacea;
    Oreocryptophis porphyraceus;
    Orthriophis taeniurus;
    Orthriophis cantoris;
    Orthriophis hodgsoni;
    Orthriophis moellendorffi;
    Coelognathus radiatus;
    Coelognathus helena;
    Coelognathus flavolineatus;
    Coelognathus erythrurus;
    Coelognathus subradiatus;
    Coelognathus philippinus;
    Coelognathus enganensis;
    Ptyas mucosa;
    Ptyas korros;
    Ptyas carinata;
    Ptyas dhumnades;
    Ptyas nigromarginata;
    Ptyas multicincta;
    Ptyas major;
    Ptyas luzonensis;
    Ptyas semicarinata;
    Ptyas fusca;
    Gonyosoma oxycephalum;
    Gonyosoma jansenii;
    Gonyosoma prasinum;
    Gonyosoma frenatum;
    Gonyosoma boulengeri;
    Gonyosoma margaritatum;
    Gonyosoma coeruleum
  `, [18,21], 90);

  // ============================================================
  // DIEREN DIE VAN KLEUR KUNNEN VERANDEREN
  // ============================================================

  // De vraag gaat over levende dieren die hun kleur
  // fysiologisch kunnen aanpassen.
  // Alleen een ander winterkleed is niet voldoende.

  kenmerkenDeel5(`
    Gewone kameleon=Chamaeleo chamaeleon;
    Chamaeleo africanus;
    Chamaeleo dilepis;
    Chamaeleo gracilis;
    Chamaeleo senegalensis;
    Chamaeleo namaquensis;
    Jemenkameleon=Chamaeleo calyptratus;
    Chamaeleo laevigatus;
    Chamaeleo anchietae;
    Chamaeleo zeylanicus;
    Chamaeleo quilensis;
    Chamaeleo necasi;
    Trioceros jacksonii;
    Trioceros melleri;
    Trioceros cristatus;
    Trioceros deremensis;
    Trioceros hoehnelii;
    Trioceros johnstoni;
    Trioceros montium;
    Trioceros quadricornis;
    Trioceros werneri;
    Trioceros ellioti;
    Trioceros bitaeniatus;
    Trioceros rudis;
    Trioceros sternfeldi;
    Trioceros oweni;
    Kinyongia fischeri;
    Kinyongia multituberculata;
    Kinyongia matschiei;
    Kinyongia tavetana;
    Kinyongia boehmei;
    Kinyongia tenuis;
    Kinyongia oxyrhina;
    Bradypodion pumilum;
    Bradypodion damaranum;
    Bradypodion ventrale;
    Bradypodion melanocephalum;
    Bradypodion thamnobates;
    Bradypodion setaroi;
    Bradypodion caffer;
    Bradypodion transvaalense;
    Bradypodion occidentale;
    Bradypodion karrooicum;
    Bradypodion dracomontanum;
    Panterkameleon=Furcifer pardalis;
    Furcifer oustaleti;
    Furcifer verrucosus;
    Furcifer lateralis;
    Furcifer minor;
    Furcifer campani;
    Furcifer antimena;
    Furcifer bifidus;
    Furcifer balteatus;
    Furcifer petteri;
    Furcifer labordi;
    Furcifer willsii;
    Furcifer rhinoceratus;
    Furcifer angeli;
    Calumma parsonii;
    Calumma globifer;
    Calumma oshaughnessyi;
    Calumma crypticum;
    Calumma brevicorne;
    Calumma cucullatum;
    Calumma nasutum;
    Calumma boettgeri;
    Calumma gastrotaenia;
    Calumma gallus;
    Calumma malthe;
    Calumma tarzan;
    Calumma amber
  `, [4,18,21,42], 85);

  kenmerkenDeel5(`
    Gewone octopus=Octopus vulgaris;
    Octopus cyanea;
    Octopus bimaculoides;
    Octopus bimaculatus;
    Octopus briareus;
    Octopus rubescens;
    Octopus insularis;
    Octopus maya;
    Octopus tetricus;
    Octopus maorum;
    Octopus sinensis;
    Octopus laqueus;
    Octopus oliveri;
    Octopus hummelincki;
    Octopus mercatoris;
    Amphioctopus marginatus;
    Amphioctopus aegina;
    Amphioctopus fangsiao;
    Amphioctopus mototi;
    Amphioctopus neglectus;
    Callistoctopus macropus;
    Callistoctopus ornatus;
    Callistoctopus luteus;
    Callistoctopus nocturnus;
    Abdopus aculeatus;
    Abdopus capricornicus;
    Enteroctopus dofleini;
    Enteroctopus megalocyathus;
    Thaumoctopus mimicus;
    Wunderpus photogenicus;
    Hapalochlaena lunulata;
    Hapalochlaena maculosa;
    Hapalochlaena fasciata;
    Gewone zeekat=Sepia officinalis;
    Sepia elegans;
    Sepia orbignyana;
    Sepia pharaonis;
    Sepia latimanus;
    Sepia apama;
    Sepia esculenta;
    Sepia aculeata;
    Sepia recurvirostra;
    Sepia elliptica;
    Sepia bandensis;
    Sepia plangon;
    Sepia mestus;
    Sepia grahami;
    Sepia australis;
    Sepia hierredda;
    Sepia bertheloti;
    Sepia prashadi;
    Sepiella inermis;
    Sepiella japonica;
    Metasepia pfefferi;
    Metasepia tullbergi;
    Sepiola atlantica;
    Sepiola rondeletii;
    Sepiola robusta;
    Sepiola intermedia;
    Euprymna scolopes;
    Euprymna tasmanica;
    Euprymna morsei;
    Euprymna berryi;
    Loligo vulgaris;
    Loligo forbesii;
    Doryteuthis pealeii;
    Doryteuthis opalescens;
    Doryteuthis pleii;
    Doryteuthis gahi;
    Sepioteuthis lessoniana;
    Sepioteuthis sepioidea;
    Sepioteuthis australis;
    Lolliguncula brevis;
    Lolliguncula panamensis
  `, [1,7,11,14,17,42], 85);

  koppel(`
    Anolis carolinensis;
    Anolis sagrei;
    Anolis equestris;
    Anolis cristatellus;
    Anolis garmani;
    Anolis grahami;
    Anolis allisoni;
    Anolis porcatus;
    Pogona vitticeps;
    Pogona barbata;
    Chlamydosaurus kingii;
    Agama agama;
    Calotes versicolor;
    Calotes calotes;
    Calotes mystaceus;
    Gekko gecko;
    Correlophus ciliatus;
    Rhacodactylus auriculatus;
    Rhacodactylus leachianus;
    Mniarogekko chahoua;
    Schol;
    Bot;
    Tarbot;
    Bothus mancus;
    Bothus lunatus;
    Bothus podas;
    Paralichthys dentatus;
    Paralichthys lethostigma;
    Hippoglossus hippoglossus;
    Pseudopleuronectes americanus;
    Solea solea;
    Buglossidium luteum;
    Scophthalmus rhombus;
    Hippocampus reidi;
    Hippocampus erectus;
    Hippocampus kuda;
    Hippocampus abdominalis;
    Hippocampus comes;
    Hippocampus barbouri;
    Hippocampus guttulatus;
    Hippocampus hippocampus
  `, [42], 80);

  // ============================================================
  // OPVALLEND GEKLEURDE DIEREN - PAPEGAAIEN
  // ============================================================

  koppel(`
    Blauwgele ara;
    Geelvleugelara;
    Groenvleugelara;
    Hyacintara;
    Ara militaris;
    Ara ambiguus;
    Ara rubrogenys;
    Ara glaucogularis;
    Primolius maracana;
    Primolius auricollis;
    Primolius couloni;
    Diopsittaca nobilis;
    Pionites melanocephalus;
    Pionites leucogaster;
    Amazona aestiva;
    Amazona amazonica;
    Amazona autumnalis;
    Amazona ochrocephala;
    Amazona oratrix;
    Amazona auropalliata;
    Amazona versicolor;
    Amazona arausiaca;
    Amazona guildingii;
    Amazona imperialis;
    Amazona rhodocorytha;
    Amazona brasiliensis;
    Pionus menstruus;
    Pionus chalcopterus;
    Pionus senilis;
    Pyrrhura molinae;
    Pyrrhura picta;
    Pyrrhura frontalis;
    Pyrrhura perlata;
    Pyrrhura cruentata;
    Regenbooglori;
    Trichoglossus rubritorquis;
    Trichoglossus chlorolepidotus;
    Glossopsitta concinna;
    Parvipsitta pusilla;
    Parvipsitta porphyrocephala;
    Alisterus scapularis;
    Aprosmictus erythropterus;
    Platycercus elegans;
    Platycercus eximius;
    Platycercus adscitus;
    Platycercus venustus;
    Platycercus icterotis;
    Platycercus caledonicus;
    Purpureicephalus spurius;
    Psephotus haematonotus;
    Neophema splendida;
    Neophema pulchella;
    Neophema chrysostoma;
    Neophema elegans;
    Neopsephotus bourkii;
    Agapornis roseicollis;
    Agapornis personatus;
    Agapornis fischeri;
    Agapornis lilianae;
    Agapornis nigrigenis;
    Agapornis taranta;
    Agapornis pullarius;
    Grasparkiet;
    Roze kaketoe
  `, [47], 70);

  // ============================================================
  // OPVALLEND GEKLEURDE VOGELS - TANGAREN
  // ============================================================

  kenmerkenDeel5(`
    Tangara chilensis;
    Tangara seledon;
    Tangara fastuosa;
    Tangara cyanocephala;
    Tangara desmaresti;
    Tangara cyanoventris;
    Tangara cyanotis;
    Tangara cyanicollis;
    Tangara nigrocincta;
    Tangara mexicana;
    Tangara cabanisi;
    Tangara palmeri;
    Tangara inornata;
    Tangara gyrola;
    Tangara lavinia;
    Tangara rufigula;
    Tangara ruficervix;
    Tangara labradorides;
    Tangara cyanoptera;
    Tangara larvata;
    Tangara nigroviridis;
    Tangara vassorii;
    Tangara heinei;
    Tangara phillipsi;
    Tangara dowii;
    Tangara fucosa;
    Tangara johannae;
    Tangara arthus;
    Tangara icterocephala;
    Tangara xanthocephala;
    Tangara parzudakii;
    Tangara schrankii;
    Tangara florida;
    Tangara punctata;
    Tangara guttata;
    Tangara varia;
    Tangara rufigenis;
    Tangara xanthogastra;
    Tangara callophrys;
    Tangara velia;
    Tangara cayana;
    Tangara peruviana;
    Tangara preciosa;
    Thraupis episcopus;
    Thraupis palmarum;
    Thraupis sayaca;
    Thraupis cyanoptera;
    Thraupis ornata;
    Thraupis abbas;
    Thraupis glaucocolpa;
    Ramphocelus carbo;
    Ramphocelus dimidiatus;
    Ramphocelus bresilia;
    Ramphocelus flammigerus;
    Ramphocelus icteronotus;
    Ramphocelus passerinii;
    Ramphocelus costaricensis;
    Ramphocelus sanguinolentus;
    Ramphocelus nigrogularis;
    Piranga rubra;
    Piranga olivacea;
    Piranga ludoviciana;
    Piranga flava;
    Piranga bidentata;
    Piranga leucoptera;
    Piranga erythrocephala;
    Piranga rubriceps;
    Chlorochrysa calliparaea;
    Chlorochrysa phoenicotis;
    Chlorochrysa nitidissima;
    Iridophanes pulcherrimus;
    Tersina viridis;
    Dacnis cayana;
    Dacnis flaviventer;
    Dacnis lineata;
    Dacnis nigripes;
    Dacnis hartlaubi;
    Dacnis berlepschi;
    Cyanerpes cyaneus;
    Cyanerpes caeruleus;
    Cyanerpes lucidus;
    Cyanerpes nitidus;
    Chlorophanes spiza;
    Hemithraupis guira;
    Hemithraupis ruficapilla;
    Hemithraupis flavicollis
  `, [2,7,18,22], 85);

  koppel(`
    Tangara chilensis;
    Tangara seledon;
    Tangara fastuosa;
    Tangara cyanocephala;
    Tangara desmaresti;
    Tangara cyanoventris;
    Tangara cyanicollis;
    Tangara gyrola;
    Tangara larvata;
    Tangara dowii;
    Tangara fucosa;
    Tangara arthus;
    Tangara icterocephala;
    Tangara xanthocephala;
    Tangara parzudakii;
    Tangara schrankii;
    Tangara florida;
    Tangara velia;
    Tangara cayana;
    Ramphocelus carbo;
    Ramphocelus bresilia;
    Ramphocelus flammigerus;
    Ramphocelus passerinii;
    Ramphocelus sanguinolentus;
    Piranga rubra;
    Piranga olivacea;
    Piranga ludoviciana;
    Piranga bidentata;
    Piranga erythrocephala;
    Piranga rubriceps;
    Chlorochrysa calliparaea;
    Chlorochrysa phoenicotis;
    Chlorochrysa nitidissima;
    Iridophanes pulcherrimus;
    Tersina viridis;
    Dacnis cayana;
    Dacnis flaviventer;
    Cyanerpes cyaneus;
    Cyanerpes caeruleus;
    Cyanerpes lucidus;
    Chlorophanes spiza
  `, [47], 85);

  // ============================================================
  // OPVALLEND GEKLEURDE VOGELS - KOLIBRIES
  // ============================================================

  kenmerkenDeel5(`
    Archilochus colubris;
    Archilochus alexandri;
    Calypte anna;
    Calypte costae;
    Selasphorus rufus;
    Selasphorus sasin;
    Selasphorus platycercus;
    Selasphorus calliope;
    Selasphorus flammula;
    Selasphorus scintilla;
    Selasphorus ardens;
    Selasphorus heloisa;
    Atthis ellioti;
    Mellisuga helenae;
    Mellisuga minima;
    Florisuga mellivora;
    Florisuga fusca;
    Topaza pella;
    Topaza pyra;
    Eulampis jugularis;
    Eulampis holosericeus;
    Anthracothorax mango;
    Anthracothorax nigricollis;
    Anthracothorax prevostii;
    Anthracothorax viridigula;
    Anthracothorax dominicus;
    Anthracothorax viridis;
    Anthracothorax veraguensis;
    Chrysolampis mosquitus;
    Lophornis ornatus;
    Lophornis magnificus;
    Lophornis chalybeus;
    Lophornis verreauxii;
    Lophornis delattrei;
    Lophornis stictolophus;
    Lophornis brachylophus;
    Lophornis helenae;
    Lophornis gouldii;
    Lophornis pavoninus;
    Discosura longicaudus;
    Discosura conversii;
    Discosura popelairii;
    Discosura letitiae;
    Discosura langsdorffi;
    Heliangelus amethysticollis;
    Heliangelus exortis;
    Heliangelus strophianus;
    Heliangelus viola;
    Heliangelus clarisse;
    Heliangelus mavors;
    Heliangelus spencei;
    Heliangelus regalis;
    Coeligena torquata;
    Coeligena coeligena;
    Coeligena prunellei;
    Coeligena lutetiae;
    Coeligena violifer;
    Coeligena iris;
    Coeligena bonapartei;
    Coeligena helianthea;
    Coeligena phalerata;
    Coeligena orina;
    Coeligena wilsoni;
    Coeligena inca;
    Ensifera ensifera;
    Aglaeactis cupripennis;
    Aglaeactis castelnaudii;
    Aglaeactis aliciae;
    Aglaeactis pamela;
    Lafresnaya lafresnayi;
    Pterophanes cyanopterus;
    Boissonneaua flavescens;
    Boissonneaua matthewsii;
    Boissonneaua jardini;
    Ocreatus underwoodii;
    Ocreatus addae;
    Ocreatus peruanus;
    Ocreatus melanantherus;
    Sappho sparganurus;
    Lesbia nuna;
    Lesbia victoriae;
    Aglaiocercus kingii;
    Aglaiocercus coelestis;
    Aglaiocercus berlepschi;
    Sylphid hummingbird;
    Heliothryx auritus;
    Heliothryx barroti;
    Heliomaster longirostris;
    Heliomaster constantii;
    Heliomaster squamosus;
    Heliomaster furcifer;
    Eugenes fulgens;
    Eugenes spectabilis;
    Lampornis clemenciae;
    Lampornis amethystinus;
    Lampornis viridipallens;
    Lampornis sybillae;
    Lampornis hemileucus;
    Lampornis castaneoventris;
    Lampornis calolaemus
  `, [2,7,18,22], 85);

  koppel(`
    Archilochus colubris;
    Calypte anna;
    Calypte costae;
    Selasphorus rufus;
    Selasphorus calliope;
    Florisuga mellivora;
    Topaza pella;
    Topaza pyra;
    Eulampis jugularis;
    Eulampis holosericeus;
    Chrysolampis mosquitus;
    Lophornis ornatus;
    Lophornis magnificus;
    Lophornis chalybeus;
    Lophornis delattrei;
    Lophornis stictolophus;
    Lophornis gouldii;
    Lophornis pavoninus;
    Discosura longicaudus;
    Discosura popelairii;
    Heliangelus amethysticollis;
    Heliangelus exortis;
    Heliangelus viola;
    Coeligena torquata;
    Coeligena iris;
    Coeligena bonapartei;
    Coeligena helianthea;
    Coeligena orina;
    Boissonneaua matthewsii;
    Boissonneaua jardini;
    Ocreatus underwoodii;
    Sappho sparganurus;
    Lesbia nuna;
    Lesbia victoriae;
    Aglaiocercus kingii;
    Aglaiocercus coelestis;
    Heliothryx auritus;
    Heliomaster furcifer;
    Eugenes fulgens;
    Lampornis clemenciae;
    Lampornis amethystinus;
    Lampornis calolaemus
  `, [47], 85);

  verwijderKoppeling(
    "Sylphid hummingbird",
    [2,7,18,22,47,50]
  );

  // ============================================================
  // OPVALLENDE KLEUREN - PIJLGIFKIKKERS
  // ============================================================

  kenmerkenDeel5(`
    Dendrobates tinctorius;
    Dendrobates auratus;
    Dendrobates leucomelas;
    Dendrobates truncatus;
    Dendrobates nubeculosus;
    Oophaga pumilio;
    Oophaga histrionica;
    Oophaga lehmanni;
    Oophaga sylvatica;
    Oophaga granulifera;
    Oophaga vicentei;
    Oophaga speciosa;
    Oophaga arborea;
    Oophaga occultator;
    Oophaga solanensis;
    Oophaga anchicayensis;
    Phyllobates terribilis;
    Phyllobates bicolor;
    Phyllobates aurotaenia;
    Phyllobates lugubris;
    Phyllobates vittatus;
    Ranitomeya imitator;
    Ranitomeya reticulata;
    Ranitomeya variabilis;
    Ranitomeya ventrimaculata;
    Ranitomeya amazonica;
    Ranitomeya fantastica;
    Ranitomeya summersi;
    Ranitomeya benedicta;
    Ranitomeya flavovittata;
    Ranitomeya vanzolinii;
    Ranitomeya uakarii;
    Ranitomeya sirensis;
    Ranitomeya lamasi;
    Ranitomeya yavaricola;
    Ranitomeya toraro;
    Ranitomeya defleri;
    Adelphobates galactonotus;
    Adelphobates castaneoticus;
    Adelphobates quinquevittatus;
    Excidobates mysteriosus;
    Excidobates captivus;
    Excidobates condor;
    Ameerega trivittata;
    Ameerega bassleri;
    Ameerega parvula;
    Ameerega bilinguis;
    Ameerega hahneli;
    Ameerega picta;
    Ameerega pulchripecta;
    Ameerega silverstonei;
    Ameerega pepperi;
    Ameerega altamazonica;
    Ameerega macero;
    Ameerega cainarachi;
    Ameerega petersi;
    Ameerega pongoensis;
    Ameerega rubriventris;
    Ameerega simulans;
    Ameerega yoshina;
    Ameerega smaragdina;
    Epipedobates anthonyi;
    Epipedobates tricolor;
    Epipedobates boulengeri;
    Epipedobates machalilla;
    Epipedobates espinosai;
    Epipedobates darwinwallacei
  `, [4,7], 85);

  koppel(`
    Dendrobates tinctorius;
    Dendrobates auratus;
    Dendrobates leucomelas;
    Dendrobates truncatus;
    Oophaga pumilio;
    Oophaga histrionica;
    Oophaga lehmanni;
    Oophaga sylvatica;
    Oophaga granulifera;
    Oophaga vicentei;
    Phyllobates terribilis;
    Phyllobates bicolor;
    Phyllobates aurotaenia;
    Phyllobates vittatus;
    Ranitomeya imitator;
    Ranitomeya reticulata;
    Ranitomeya variabilis;
    Ranitomeya ventrimaculata;
    Ranitomeya amazonica;
    Ranitomeya fantastica;
    Ranitomeya summersi;
    Ranitomeya benedicta;
    Ranitomeya flavovittata;
    Ranitomeya vanzolinii;
    Ranitomeya uakarii;
    Ranitomeya sirensis;
    Ranitomeya lamasi;
    Adelphobates galactonotus;
    Adelphobates castaneoticus;
    Adelphobates quinquevittatus;
    Excidobates mysteriosus;
    Excidobates captivus;
    Ameerega trivittata;
    Ameerega bassleri;
    Ameerega parvula;
    Ameerega bilinguis;
    Ameerega silverstonei;
    Ameerega pepperi;
    Ameerega macero;
    Ameerega cainarachi;
    Epipedobates anthonyi;
    Epipedobates tricolor
  `, [47], 85);

  // ============================================================
  // OPVALLENDE KLEUREN - VLINDERS
  // ============================================================

  koppel(`
    Dagpauwoog;
    Atalanta;
    Kleine vos;
    Koninginnenpage;
    Koningspage;
    Oranjetipje;
    Citroenvlinder;
    Rouwmantel;
    Grote weerschijnvlinder;
    Kleine weerschijnvlinder;
    Keizersmantel;
    Grote vuurvlinder;
    Morpho menelaus;
    Morpho helenor;
    Morpho didius;
    Morpho rhetenor;
    Morpho cypris;
    Morpho achilles;
    Morpho amathonte;
    Morpho anaxibia;
    Morpho aega;
    Morpho adonis;
    Morpho aurora;
    Morpho godartii;
    Morpho sulkowskyi;
    Morpho telemachus;
    Heliconius erato;
    Heliconius melpomene;
    Heliconius charithonia;
    Heliconius sara;
    Heliconius doris;
    Heliconius hecale;
    Heliconius ismenius;
    Heliconius cydno;
    Heliconius sapho;
    Heliconius eleuchia;
    Heliconius antiochus;
    Heliconius wallacei;
    Heliconius burneyi;
    Heliconius numata;
    Heliconius ethilla;
    Heliconius pardalinus;
    Papilio dardanus;
    Papilio demodocus;
    Papilio nireus;
    Papilio bromius;
    Papilio ulysses;
    Papilio blumei;
    Papilio palinurus;
    Papilio maackii;
    Papilio bianor;
    Papilio paris;
    Papilio lorquinianus;
    Papilio polymnestor;
    Papilio memnon;
    Papilio lowi;
    Papilio rumanzovia;
    Papilio peranthus;
    Papilio karna;
    Papilio deiphobus;
    Graphium antheus;
    Graphium agamemnon;
    Graphium sarpedon;
    Graphium weiskei;
    Graphium policenes;
    Graphium leonidas;
    Graphium doson;
    Graphium antiphates;
    Graphium androcles;
    Danaus plexippus;
    Danaus chrysippus;
    Danaus gilippus;
    Danaus genutia;
    Idea leuconoe;
    Euploea core;
    Agrias claudina;
    Agrias amydon;
    Agrias narcissus;
    Agrias hewitsoni;
    Agrias aedon;
    Prepona laertes;
    Prepona demophon;
    Prepona pylene;
    Prepona dexamenus;
    Archaeoprepona demophon;
    Archaeoprepona demophoon;
    Archaeoprepona meander
  `, [47], 80);

  // ============================================================
  // OPVALLEND GEKLEURDE KEVERS
  // ============================================================

  kenmerkenDeel5(`
    Chrysina gloriosa;
    Chrysina resplendens;
    Chrysina aurigans;
    Chrysina limbata;
    Chrysina chrysargyrea;
    Chrysina beyeri;
    Chrysina lecontei;
    Chrysina woodi;
    Chrysina optima;
    Chrysina auripes;
    Chrysina boucardi;
    Chrysina macropus;
    Chrysina quetzalcoatli;
    Chrysina tricolor;
    Chrysina diversa;
    Chrysina laniventris;
    Chrysina luteomarginata;
    Chrysochroa fulgidissima;
    Chrysochroa fulminans;
    Chrysochroa buqueti;
    Chrysochroa vittata;
    Chrysochroa rajah;
    Chrysochroa ocellata;
    Chrysochroa saundersii;
    Chrysochroa corbetti;
    Chrysochroa castelnaudi;
    Chrysochroa edwardsii;
    Chrysochroa mniszechii;
    Chrysochroa rugicollis;
    Sternocera aequisignata;
    Sternocera sternicornis;
    Sternocera ruficornis;
    Sternocera chrysis;
    Sternocera orissa;
    Sternocera pulchra;
    Euchroma gigantea;
    Julodis onopordi;
    Julodis euphratica;
    Julodis viridipes;
    Julodis fimbriata;
    Anthaxia nitidula;
    Anthaxia candens;
    Anthaxia fulgurans;
    Anthaxia salicis;
    Anthaxia manca;
    Anthaxia hungarica;
    Anthaxia lucens;
    Anthaxia thalassophila;
    Buprestis aurulenta;
    Buprestis rufipes;
    Buprestis octoguttata;
    Buprestis splendens;
    Dicerca aenea;
    Dicerca berolinensis;
    Eurythyrea austriaca;
    Eurythyrea quercus;
    Eurythyrea micans;
    Chalcophora mariana;
    Chalcophora japonica;
    Chalcophora virginiensis;
    Megaloxantha bicolor;
    Megaloxantha purpurascens;
    Megaloxantha concolor;
    Catoxantha opulenta;
    Catoxantha hemixantha;
    Chrysolina fastuosa;
    Chrysolina americana;
    Chrysolina cerealis;
    Chrysolina herbacea;
    Chrysolina graminis;
    Chrysolina coerulans;
    Chrysolina polita;
    Chrysolina purpurascens;
    Chrysolina sanguinolenta;
    Chrysolina staphylaea;
    Chrysolina oricalcia;
    Chrysolina hyperici;
    Chrysolina quadrigemina;
    Chrysolina banksii;
    Chrysolina marginata
  `, [7], 85);

  koppel(`
    Chrysina gloriosa;
    Chrysina resplendens;
    Chrysina aurigans;
    Chrysina limbata;
    Chrysina chrysargyrea;
    Chrysina beyeri;
    Chrysina optima;
    Chrysina auripes;
    Chrysina tricolor;
    Chrysochroa fulgidissima;
    Chrysochroa fulminans;
    Chrysochroa buqueti;
    Chrysochroa vittata;
    Chrysochroa rajah;
    Chrysochroa ocellata;
    Chrysochroa saundersii;
    Sternocera aequisignata;
    Sternocera ruficornis;
    Sternocera chrysis;
    Euchroma gigantea;
    Anthaxia nitidula;
    Anthaxia candens;
    Anthaxia fulgurans;
    Anthaxia salicis;
    Anthaxia hungarica;
    Buprestis aurulenta;
    Buprestis splendens;
    Eurythyrea austriaca;
    Eurythyrea quercus;
    Megaloxantha bicolor;
    Megaloxantha purpurascens;
    Catoxantha opulenta;
    Chrysolina fastuosa;
    Chrysolina americana;
    Chrysolina cerealis;
    Chrysolina herbacea;
    Chrysolina graminis;
    Chrysolina coerulans;
    Goliathus goliatus;
    Goliathus regius;
    Mecynorhina torquata;
    Mecynorhina ugandensis;
    Eudicella gralli;
    Eudicella euthalia;
    Cetonia aurata;
    Protaetia aeruginosa
  `, [47], 85);

  // ============================================================
  // DIEREN MET STREPEN - ZOOGDIEREN
  // ============================================================

  kenmerkenDeel5(`
    Tijger=Panthera tigris;
    Gewone zebra=Equus quagga;
    Bergzebra=Equus zebra;
    Grévyzebra=Equus grevyi;
    Okapi=Okapia johnstoni;
    Bongo=Tragelaphus eurycerus;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Bergnyala;
    Gestreepte hyena;
    Aardwolf;
    Zebramangoeste;
    Gestreepte bunzing;
    Ringstaartmaki;
    Gestreept stinkdier=Mephitis mephitis;
    Mephitis macroura;
    Conepatus leuconotus;
    Conepatus chinga;
    Conepatus humboldtii;
    Spilogale putorius;
    Spilogale gracilis;
    Spilogale pygmaea;
    Spilogale angustifrons;
    Spilogale interrupta;
    Spilogale leucoparia;
    Gestreepte tenrek=Hemicentetes semispinosus;
    Hemicentetes nigriceps;
    Numbat;
    Gestreepte jakhals;
    Tamias striatus;
    Eutamias sibiricus;
    Neotamias minimus;
    Neotamias amoenus;
    Neotamias townsendii;
    Neotamias quadrimaculatus;
    Neotamias speciosus;
    Neotamias senex;
    Neotamias sonomae;
    Neotamias siskiyou;
    Neotamias ochrogenys;
    Neotamias ruficaudus;
    Neotamias dorsalis;
    Neotamias cinereicollis;
    Neotamias quadrivittatus;
    Neotamias umbrinus;
    Neotamias panamintinus;
    Neotamias palmeri;
    Neotamias merriami;
    Neotamias obscurus;
    Neotamias alpinus;
    Neotamias bulleri;
    Neotamias canipes;
    Neotamias durangae;
    Funambulus palmarum;
    Funambulus pennantii;
    Funambulus sublineatus;
    Funambulus tristriatus;
    Funambulus layardi;
    Funambulus obscurus;
    Tamiops mcclellandii;
    Tamiops maritimus;
    Tamiops swinhoei;
    Tamiops rodolphii;
    Callosciurus notatus;
    Callosciurus nigrovittatus;
    Callosciurus prevostii;
    Callosciurus finlaysonii;
    Rhabdomys pumilio;
    Rhabdomys dilectus;
    Rhabdomys bechuanae;
    Rhabdomys intermedius;
    Lemniscomys striatus;
    Lemniscomys barbarus;
    Lemniscomys zebra;
    Lemniscomys griselda;
    Lemniscomys rosalia;
    Lemniscomys linulus;
    Lemniscomys mittendorfi;
    Lemniscomys macculus;
    Lemniscomys bellieri;
    Lemniscomys hoogstraali;
    Lemniscomys roseveari
  `, [48], 80);

  // ============================================================
  // DIEREN MET STREPEN - VISSEN
  // ============================================================

  kenmerkenDeel5(`
    Zebravis=Danio rerio;
    Danio kyathit;
    Danio albolineatus;
    Danio choprae;
    Danio tinwini;
    Danio margaritatus;
    Danio erythromicron;
    Danio nigrofasciatus;
    Danio aesculapii;
    Danio dangila;
    Danio feegradei;
    Danio meghalayensis;
    Danio assamila;
    Danio jaintianensis;
    Danio quagga;
    Devario aequipinnatus;
    Devario malabaricus;
    Devario devario;
    Devario pathirana;
    Devario regina;
    Devario sondhii;
    Devario maetaengensis;
    Devario annandalei;
    Devario chrysotaeniatus;
    Devario interruptus;
    Devario laoensis;
    Devario strigillifer;
    Devario xyrops;
    Tijgerbarbeel=Puntigrus tetrazona;
    Puntigrus anchisporus;
    Puntigrus partipentazona;
    Puntigrus pulcher;
    Puntigrus navjotsodhii;
    Desmopuntius pentazona;
    Desmopuntius hexazona;
    Desmopuntius johorensis;
    Desmopuntius gemellus;
    Desmopuntius trifasciatus;
    Desmopuntius rhomboocellatus;
    Botia striata;
    Botia almorhae;
    Botia histrionica;
    Botia kubotai;
    Botia rostrata;
    Botia dario;
    Botia lohachata;
    Botia udomritthiruji;
    Clownbotia=Chromobotia macracanthus;
    Syncrossus helodes;
    Syncrossus hymenophysa;
    Syncrossus berdmorei;
    Syncrossus beauforti;
    Syncrossus reversa;
    Yasuhikotakia modesta;
    Yasuhikotakia morleti;
    Yasuhikotakia eos;
    Ambastaia sidthimunki;
    Ambastaia nigrolineata;
    Pangio kuhlii;
    Pangio semicincta;
    Pangio myersi;
    Pangio shelfordii;
    Pangio cuneovirgata;
    Pangio malayana;
    Pangio alternans;
    Pangio robiginosa;
    Pangio oblonga;
    Pangio anguillaris;
    Garra flavatra;
    Crossocheilus oblongus;
    Crossocheilus langei;
    Epalzeorhynchos kalopterum;
    Pterophyllum scalare;
    Pterophyllum altum;
    Pterophyllum leopoldi;
    Symphysodon discus;
    Symphysodon aequifasciatus;
    Symphysodon tarzoo;
    Frontosa=Cyphotilapia frontosa;
    Cyphotilapia gibberosa;
    Neolamprologus multifasciatus;
    Neolamprologus similis;
    Neolamprologus tretocephalus;
    Neolamprologus sexfasciatus;
    Julidochromis transcriptus;
    Julidochromis ornatus;
    Julidochromis regani;
    Julidochromis marlieri;
    Julidochromis dickfeldi;
    Chalinochromis brichardi;
    Chalinochromis popelini;
    Altolamprologus compressiceps;
    Altolamprologus calvus;
    Telmatochromis vittatus;
    Telmatochromis temporalis;
    Tropheus duboisi;
    Tropheus moorii;
    Tropheus brichardi;
    Tropheus polli;
    Tropheus annectens;
    Pseudotropheus demasoni;
    Chindongo demasoni;
    Chindongo elongatus;
    Chindongo saulosi;
    Chindongo socolofi;
    Melanochromis auratus;
    Melanochromis cyaneorhabdos;
    Melanochromis chipokae;
    Melanochromis johannii;
    Pseudotropheus crabro;
    Metriaclima zebra;
    Metriaclima estherae;
    Metriaclima lombardoi;
    Metriaclima callainos;
    Labidochromis caeruleus;
    Hemichromis fasciatus;
    Hemichromis elongatus;
    Amatitlania nigrofasciata;
    Amatitlania siquia;
    Amatitlania kanna;
    Cryptoheros spilurus;
    Cryptoheros cutteri;
    Cryptoheros chetumalensis;
    Herotilapia multispinosa;
    Thorichthys meeki;
    Thorichthys ellioti;
    Thorichthys maculipinnis
  `, [1,14,18], 85);

  // Strepen worden niet uitsluitend uit een soortnaam
  // afgeleid. Alleen duidelijke patronen worden gekoppeld.

  koppel(`
    Danio rerio;
    Danio choprae;
    Danio erythromicron;
    Danio nigrofasciatus;
    Danio aesculapii;
    Danio quagga;
    Devario aequipinnatus;
    Devario malabaricus;
    Devario pathirana;
    Devario regina;
    Puntigrus tetrazona;
    Puntigrus anchisporus;
    Puntigrus partipentazona;
    Puntigrus pulcher;
    Desmopuntius pentazona;
    Desmopuntius hexazona;
    Desmopuntius johorensis;
    Desmopuntius trifasciatus;
    Botia striata;
    Botia dario;
    Botia rostrata;
    Chromobotia macracanthus;
    Syncrossus helodes;
    Syncrossus hymenophysa;
    Syncrossus berdmorei;
    Syncrossus beauforti;
    Pangio kuhlii;
    Pangio semicincta;
    Pangio myersi;
    Pangio cuneovirgata;
    Crossocheilus oblongus;
    Crossocheilus langei;
    Epalzeorhynchos kalopterum;
    Pterophyllum scalare;
    Pterophyllum altum;
    Pterophyllum leopoldi;
    Symphysodon discus;
    Symphysodon aequifasciatus;
    Cyphotilapia frontosa;
    Cyphotilapia gibberosa;
    Neolamprologus multifasciatus;
    Neolamprologus similis;
    Neolamprologus tretocephalus;
    Neolamprologus sexfasciatus;
    Julidochromis transcriptus;
    Julidochromis ornatus;
    Julidochromis regani;
    Julidochromis dickfeldi;
    Chalinochromis brichardi;
    Altolamprologus compressiceps;
    Telmatochromis vittatus;
    Tropheus polli;
    Chindongo demasoni;
    Chindongo saulosi;
    Melanochromis auratus;
    Melanochromis cyaneorhabdos;
    Melanochromis chipokae;
    Melanochromis johannii;
    Pseudotropheus crabro;
    Metriaclima zebra;
    Metriaclima lombardoi;
    Amatitlania nigrofasciata;
    Amatitlania siquia;
    Amatitlania kanna;
    Cryptoheros spilurus;
    Cryptoheros cutteri;
    Herotilapia multispinosa
  `, [48], 85);

  // ============================================================
  // GESTREEPTE KORAALRIFVISSEN
  // ============================================================

  kenmerkenDeel5(`
    Amphiprion ocellaris;
    Amphiprion percula;
    Amphiprion clarkii;
    Amphiprion bicinctus;
    Amphiprion sebae;
    Amphiprion polymnus;
    Amphiprion frenatus;
    Amphiprion melanopus;
    Amphiprion akallopisos;
    Amphiprion perideraion;
    Amphiprion sandaracinos;
    Amphiprion akindynos;
    Amphiprion chrysopterus;
    Amphiprion chrysogaster;
    Amphiprion allardi;
    Amphiprion omanensis;
    Amphiprion latifasciatus;
    Amphiprion tricinctus;
    Amphiprion mccullochi;
    Amphiprion latezonatus;
    Amphiprion nigripes;
    Amphiprion rubrocinctus;
    Amphiprion ephippium;
    Amphiprion barberi;
    Amphiprion pacificus;
    Amphiprion leucokranos;
    Amphiprion thiellei;
    Premnas biaculeatus=Amphiprion biaculeatus;
    Dascyllus aruanus;
    Dascyllus melanurus;
    Dascyllus reticulatus;
    Dascyllus trimaculatus;
    Abudefduf vaigiensis;
    Abudefduf saxatilis;
    Abudefduf abdominalis;
    Abudefduf troschelii;
    Abudefduf bengalensis;
    Abudefduf septemfasciatus;
    Abudefduf sordidus;
    Abudefduf sexfasciatus;
    Abudefduf notatus;
    Chaetodon auriga;
    Chaetodon lunula;
    Chaetodon vagabundus;
    Chaetodon lineolatus;
    Chaetodon trifascialis;
    Chaetodon trifasciatus;
    Chaetodon lunulatus;
    Chaetodon melannotus;
    Chaetodon octofasciatus;
    Chaetodon fasciatus;
    Chaetodon striatus;
    Chaetodon capistratus;
    Chaetodon humeralis;
    Chaetodon sedentarius;
    Chaetodon plebeius;
    Chaetodon citrinellus;
    Chaetodon punctatofasciatus;
    Chaetodon mertensii;
    Chaetodon xanthurus;
    Chaetodon paucifasciatus;
    Chaetodon semilarvatus;
    Chaetodon austriacus;
    Chaetodon melapterus;
    Chaetodon larvatus;
    Chaetodon ornatissimus;
    Chaetodon reticulatus;
    Chaetodon meyeri;
    Chaetodon baronessa;
    Chaetodon triangulum;
    Chaetodon bennetti;
    Chaetodon speculum;
    Chaetodon unimaculatus;
    Chelmon rostratus;
    Chelmon marginalis;
    Chelmon muelleri;
    Heniochus acuminatus;
    Heniochus diphreutes;
    Heniochus chrysostomus;
    Heniochus monoceros;
    Heniochus singularius;
    Heniochus varius;
    Heniochus pleurotaenia;
    Heniochus intermedius;
    Zanclus cornutus;
    Pomacanthus imperator;
    Pomacanthus annularis;
    Pomacanthus semicirculatus;
    Pomacanthus sexstriatus;
    Pomacanthus xanthometopon;
    Pomacanthus navarchus;
    Pomacanthus maculosus;
    Pomacanthus asfur;
    Pomacanthus chrysurus;
    Pomacanthus paru;
    Pomacanthus arcuatus;
    Pygoplites diacanthus;
    Paracentropyge multifasciata;
    Paracentropyge venusta;
    Centropyge loricula;
    Centropyge bispinosa;
    Centropyge eibli;
    Centropyge potteri;
    Centropyge heraldi;
    Centropyge bicolor;
    Centropyge acanthops;
    Genicanthus lamarck;
    Genicanthus melanospilos;
    Genicanthus watanabei;
    Genicanthus bellus;
    Genicanthus personatus;
    Genicanthus semifasciatus;
    Genicanthus caudovittatus;
    Genicanthus zebra;
    Genicanthus takeuchii
  `, [1,11,14,18], 85);

  koppel(`
    Amphiprion ocellaris;
    Amphiprion percula;
    Amphiprion clarkii;
    Amphiprion bicinctus;
    Amphiprion sebae;
    Amphiprion polymnus;
    Amphiprion frenatus;
    Amphiprion melanopus;
    Amphiprion perideraion;
    Amphiprion sandaracinos;
    Amphiprion akindynos;
    Amphiprion chrysopterus;
    Amphiprion chrysogaster;
    Amphiprion allardi;
    Amphiprion omanensis;
    Amphiprion latifasciatus;
    Amphiprion tricinctus;
    Amphiprion latezonatus;
    Amphiprion nigripes;
    Amphiprion rubrocinctus;
    Amphiprion barberi;
    Amphiprion biaculeatus;
    Dascyllus aruanus;
    Dascyllus melanurus;
    Abudefduf vaigiensis;
    Abudefduf saxatilis;
    Abudefduf abdominalis;
    Abudefduf troschelii;
    Abudefduf bengalensis;
    Abudefduf septemfasciatus;
    Abudefduf sexfasciatus;
    Chaetodon auriga;
    Chaetodon vagabundus;
    Chaetodon lineolatus;
    Chaetodon trifascialis;
    Chaetodon trifasciatus;
    Chaetodon lunulatus;
    Chaetodon octofasciatus;
    Chaetodon fasciatus;
    Chaetodon striatus;
    Chaetodon punctatofasciatus;
    Chaetodon paucifasciatus;
    Chaetodon austriacus;
    Chaetodon ornatissimus;
    Chaetodon meyeri;
    Chaetodon baronessa;
    Chaetodon triangulum;
    Chelmon rostratus;
    Chelmon marginalis;
    Chelmon muelleri;
    Heniochus acuminatus;
    Heniochus diphreutes;
    Heniochus chrysostomus;
    Heniochus monoceros;
    Heniochus singularius;
    Heniochus intermedius;
    Zanclus cornutus;
    Pomacanthus imperator;
    Pomacanthus annularis;
    Pomacanthus semicirculatus;
    Pomacanthus sexstriatus;
    Pygoplites diacanthus;
    Paracentropyge multifasciata;
    Centropyge loricula;
    Centropyge bispinosa;
    Centropyge eibli;
    Centropyge potteri;
    Genicanthus lamarck;
    Genicanthus melanospilos;
    Genicanthus watanabei;
    Genicanthus bellus;
    Genicanthus semifasciatus;
    Genicanthus caudovittatus;
    Genicanthus zebra
  `, [48], 85);

  // ============================================================
  // OPVALLEND GEKLEURDE KORAALRIFVISSEN
  // ============================================================

  koppel(`
    Amphiprion ocellaris;
    Amphiprion percula;
    Amphiprion clarkii;
    Amphiprion bicinctus;
    Amphiprion frenatus;
    Amphiprion melanopus;
    Amphiprion chrysopterus;
    Amphiprion chrysogaster;
    Amphiprion biaculeatus;
    Chaetodon auriga;
    Chaetodon lunula;
    Chaetodon semilarvatus;
    Chaetodon austriacus;
    Chaetodon ornatissimus;
    Chaetodon meyeri;
    Chaetodon baronessa;
    Chelmon rostratus;
    Zanclus cornutus;
    Pomacanthus imperator;
    Pomacanthus annularis;
    Pomacanthus xanthometopon;
    Pomacanthus navarchus;
    Pomacanthus asfur;
    Pygoplites diacanthus;
    Centropyge loricula;
    Centropyge bispinosa;
    Centropyge potteri;
    Centropyge bicolor;
    Centropyge acanthops;
    Gele doktersvis=Zebrasoma flavescens;
    Blauwe doktersvis=Paracanthurus hepatus
  `, [47], 75);

  kenmerkenDeel5(`
    Gele doktersvis=Zebrasoma flavescens;
    Blauwe doktersvis=Paracanthurus hepatus;
    Zebrasoma xanthurum;
    Zebrasoma velifer;
    Zebrasoma desjardinii;
    Zebrasoma scopas;
    Zebrasoma rostratum;
    Acanthurus achilles;
    Acanthurus leucosternon;
    Acanthurus japonicus;
    Acanthurus nigricans;
    Acanthurus sohal;
    Acanthurus lineatus;
    Acanthurus olivaceus;
    Acanthurus pyroferus;
    Acanthurus coeruleus;
    Acanthurus tristis;
    Acanthurus guttatus;
    Acanthurus dussumieri;
    Naso lituratus;
    Naso elegans;
    Naso unicornis;
    Naso vlamingii;
    Naso brevirostris;
    Naso hexacanthus;
    Naso annulatus;
    Ctenochaetus strigosus;
    Ctenochaetus tominiensis;
    Ctenochaetus hawaiiensis;
    Ctenochaetus truncatus;
    Ctenochaetus binotatus;
    Ctenochaetus striatus
  `, [1,11,14,18], 85);

  koppel(`
    Zebrasoma flavescens;
    Paracanthurus hepatus;
    Zebrasoma xanthurum;
    Zebrasoma velifer;
    Zebrasoma desjardinii;
    Acanthurus achilles;
    Acanthurus leucosternon;
    Acanthurus japonicus;
    Acanthurus nigricans;
    Acanthurus sohal;
    Acanthurus lineatus;
    Acanthurus olivaceus;
    Acanthurus coeruleus;
    Naso lituratus;
    Naso elegans;
    Ctenochaetus hawaiiensis;
    Ctenochaetus strigosus
  `, [47], 85);

  koppel(`
    Zebrasoma velifer;
    Zebrasoma desjardinii;
    Acanthurus sohal;
    Acanthurus lineatus;
    Ctenochaetus strigosus;
    Ctenochaetus hawaiiensis;
    Ctenochaetus striatus
  `, [48], 85);

  // ============================================================
  // DIEREN MET STIPPEN EN VLEKKEN - ZOOGDIEREN
  // ============================================================

  koppel(`
    Jachtluipaard;
    Luipaard;
    Jaguar;
    Sneeuwluipaard;
    Nevelpanter;
    Neofelis diardi;
    Ocelot;
    Margay;
    Serval;
    Zwartvoetkat;
    Bengaalse tijgerkat;
    Vissende kat;
    Marmerkat;
    Leopardus tigrinus;
    Leopardus guttulus;
    Leopardus guigna;
    Leopardus geoffroyi;
    Prionailurus rubiginosus;
    Gevlekte hyena;
    Afrikaanse civet;
    Genetta genetta;
    Genetta maculata;
    Genetta tigrina;
    Genetta pardina;
    Genetta servalina;
    Genetta victoriae;
    Genetta abyssinica;
    Genetta angolensis;
    Genetta thierryi;
    Genetta letabae;
    Afrikaanse wilde hond;
    Giraffe;
    Giraffa reticulata;
    Giraffa tippelskirchi;
    Giraffa giraffa;
    Damhert;
    Sikahert;
    Axishert;
    Dasyurus maculatus;
    Dasyurus viverrinus;
    Dasyurus geoffroii;
    Dasyurus hallucatus;
    Gewone zeehond;
    Grijze zeehond;
    Zeeluipaard;
    Larghazeehond;
    Ringelrob;
    Phoca largha;
    Spilogale putorius;
    Spilogale gracilis;
    Spilogale pygmaea
  `, [49], 65);

  // ============================================================
  // GEVLEKTE REPTIELEN
  // ============================================================

  kenmerkenDeel5(`
    Luipaardgekko=Eublepharis macularius;
    Eublepharis angramainyu;
    Eublepharis hardwickii;
    Eublepharis fuscus;
    Eublepharis turcmenicus;
    Eublepharis satpuraensis;
    Hemitheconyx caudicinctus;
    Hemitheconyx taylori;
    Goniurosaurus luii;
    Goniurosaurus hainanensis;
    Goniurosaurus lichtenfelderi;
    Goniurosaurus araneus;
    Goniurosaurus kuroiwae;
    Goniurosaurus orientalis;
    Goniurosaurus splendens;
    Goniurosaurus yamashinae;
    Goniurosaurus toyamai;
    Goniurosaurus bawanglingensis;
    Goniurosaurus catbaensis;
    Goniurosaurus huuliensis;
    Goniurosaurus zhelongi;
    Goniurosaurus yingdeensis;
    Goniurosaurus liboensis;
    Goniurosaurus kadoorieorum;
    Goniurosaurus gollum;
    Goniurosaurus kwangsiensis;
    Goniurosaurus varius;
    Coleonyx variegatus;
    Coleonyx elegans;
    Coleonyx mitratus;
    Coleonyx brevis;
    Coleonyx reticulatus;
    Coleonyx switaki;
    Gekko gecko;
    Gekko smithii;
    Gekko monarchus;
    Phelsuma grandis;
    Phelsuma madagascariensis;
    Phelsuma laticauda;
    Phelsuma quadriocellata;
    Phelsuma lineata;
    Phelsuma ornata;
    Phelsuma cepediana;
    Phelsuma standingi;
    Phelsuma klemmeri;
    Phelsuma guttata;
    Phelsuma robertmertensi;
    Phelsuma v-nigra
  `, [4,18,21], 85);

  koppel(`
    Eublepharis macularius;
    Eublepharis angramainyu;
    Eublepharis hardwickii;
    Eublepharis fuscus;
    Eublepharis turcmenicus;
    Eublepharis satpuraensis;
    Coleonyx variegatus;
    Coleonyx reticulatus;
    Coleonyx switaki;
    Gekko gecko;
    Gekko smithii;
    Gekko monarchus;
    Phelsuma grandis;
    Phelsuma madagascariensis;
    Phelsuma laticauda;
    Phelsuma quadriocellata;
    Phelsuma guttata;
    Phelsuma ornata;
    Varanus varius;
    Varanus salvator;
    Varanus panoptes;
    Varanus gouldii;
    Varanus tristis;
    Varanus scalaris;
    Ctenotus pantherinus;
    Ctenotus maculatus;
    Ctenophorus maculatus;
    Pantherophis guttatus;
    Pantherophis emoryi;
    Pantherophis slowinskii;
    Pantherophis bairdi;
    Python regius;
    Python bivittatus;
    Python molurus;
    Python sebae;
    Python natalensis;
    Boa constrictor;
    Boa imperator;
    Eunectes murinus;
    Eunectes notaeus;
    Morelia spilota;
    Antaresia maculosa;
    Antaresia childreni;
    Antaresia stimsoni
  `, [49], 85);

  // ============================================================
  // GEVLEKTE AMFIBIEËN
  // ============================================================

  kenmerkenDeel5(`
    Vuursalamander=Salamandra salamandra;
    Salamandra algira;
    Salamandra corsica;
    Salamandra infraimmaculata;
    Salamandra longirostris;
    Gevlekte salamander=Ambystoma maculatum;
    Ambystoma tigrinum;
    Ambystoma mavortium;
    Ambystoma opacum;
    Ambystoma laterale;
    Ambystoma jeffersonianum;
    Ambystoma texanum;
    Ambystoma talpoideum;
    Ambystoma annulatum;
    Ambystoma cingulatum;
    Ambystoma bishopi;
    Ambystoma macrodactylum;
    Ambystoma gracile;
    Ambystoma californiense;
    Neurergus kaiseri;
    Neurergus crocatus;
    Neurergus strauchii;
    Neurergus derjugini;
    Triturus cristatus;
    Triturus carnifex;
    Triturus dobrogicus;
    Triturus macedonicus;
    Triturus karelinii;
    Triturus ivanbureschi;
    Triturus anatolicus;
    Triturus marmoratus;
    Triturus pygmaeus;
    Ichthyosaura alpestris;
    Lissotriton vulgaris;
    Lissotriton helveticus;
    Lissotriton montandoni;
    Lissotriton boscai;
    Lissotriton italicus;
    Notophthalmus viridescens;
    Notophthalmus meridionalis;
    Notophthalmus perstriatus;
    Cynops pyrrhogaster;
    Cynops ensicauda;
    Hypselotriton orientalis;
    Hypselotriton cyanurus;
    Hypselotriton orphicus;
    Hypselotriton wolterstorffi;
    Paramesotriton hongkongensis;
    Paramesotriton chinensis;
    Paramesotriton deloustali;
    Paramesotriton guangxiensis;
    Tylototriton verrucosus;
    Tylototriton shanjing;
    Tylototriton kweichowensis;
    Tylototriton taliangensis;
    Tylototriton wenxianensis
  `, [4], 85);

  koppel(`
    Salamandra salamandra;
    Salamandra algira;
    Salamandra corsica;
    Salamandra infraimmaculata;
    Salamandra longirostris;
    Ambystoma maculatum;
    Ambystoma tigrinum;
    Ambystoma mavortium;
    Ambystoma laterale;
    Neurergus kaiseri;
    Neurergus crocatus;
    Neurergus strauchii;
    Neurergus derjugini;
    Triturus cristatus;
    Triturus carnifex;
    Triturus dobrogicus;
    Triturus macedonicus;
    Triturus marmoratus;
    Triturus pygmaeus;
    Ichthyosaura alpestris;
    Lissotriton vulgaris;
    Notophthalmus viridescens;
    Notophthalmus perstriatus;
    Dendrobates tinctorius;
    Dendrobates auratus;
    Dendrobates leucomelas;
    Oophaga pumilio;
    Oophaga histrionica;
    Oophaga lehmanni;
    Oophaga sylvatica;
    Ranitomeya imitator;
    Ranitomeya reticulata;
    Ranitomeya variabilis;
    Ranitomeya vanzolinii;
    Excidobates mysteriosus;
    Adelphobates castaneoticus;
    Hyperolius marmoratus;
    Hyperolius puncticulatus;
    Leptopelis flavomaculatus;
    Rana temporaria;
    Rana arvalis;
    Pelophylax ridibundus;
    Lithobates pipiens;
    Lithobates sphenocephalus;
    Lithobates blairi;
    Lithobates palustris;
    Lithobates berlandieri;
    Lithobates chiricahuensis;
    Lithobates yavapaiensis;
    Lithobates onca;
    Litoria peronii;
    Litoria dentata;
    Litoria aurea;
    Litoria raniformis;
    Pseudophryne corroboree;
    Pseudophryne pengilleyi
  `, [49], 85);

  // ============================================================
  // GEVLEKTE VOGELS
  // ============================================================

  koppel(`
    Spreeuw=Sturnus vulgaris;
    Zanglijster;
    Grote lijster;
    Koperwiek;
    Kramsvogel;
    Parelhoen=Numida meleagris;
    Acryllium vulturinum;
    Guttera pucherani;
    Guttera plumifera;
    Agelastes meleagrides;
    Agelastes niger;
    Grote bonte specht;
    Middelste bonte specht;
    Kleine bonte specht;
    Witrugspecht;
    Syrische bonte specht;
    Dryobates pubescens;
    Dryobates villosus;
    Dryobates scalaris;
    Picoides arcticus;
    Sphyrapicus varius;
    Sphyrapicus nuchalis;
    Sphyrapicus ruber;
    Sphyrapicus thyroideus;
    Colaptes auratus;
    Colaptes chrysoides;
    Colaptes punctigula;
    Picus viridis;
    Picus canus;
    Bosuil;
    Oeraluil;
    Laplanduil;
    Steenuil;
    Ruigpootuil;
    Sneeuwuil;
    Kerkuil;
    Athene cunicularia;
    Athene brama;
    Athene blewitti;
    Strix occidentalis;
    Strix varia;
    Strix virgata;
    Strix nigrolineata;
    Strix huhula;
    Glaucidium passerinum;
    Glaucidium brasilianum;
    Glaucidium gnoma;
    Glaucidium peruanum;
    Glaucidium jardinii;
    Glaucidium minutissimum;
    Glaucidium hardyi;
    Glaucidium cuculoides;
    Glaucidium radiatum;
    Glaucidium castanopterum;
    Glaucidium brodiei;
    Bubo africanus;
    Bubo bengalensis;
    Bubo bubo;
    Bubo virginianus;
    Bubo magellanicus;
    Ketupa ketupu;
    Ketupa zeylonensis;
    Ketupa flavipes;
    Ketupa blakistoni;
    Pardalotus punctatus;
    Pardalotus rubricatus;
    Ptilonorhynchus violaceus;
    Chlamydera maculata;
    Chlamydera nuchalis;
    Chlamydera guttata;
    Chlamydera cerviniventris;
    Pavo cristatus;
    Pavo muticus;
    Argusianus argus;
    Rheinardia ocellata;
    Rheinardia nigrescens;
    Polyplectron bicalcaratum;
    Polyplectron germaini;
    Polyplectron malacense;
    Polyplectron inopinatum;
    Polyplectron chalcurum;
    Polyplectron schleiermacheri;
    Polyplectron napoleonis;
    Polyplectron katsumatae
  `, [49], 80);

  // ============================================================
  // GEVLEKTE VISSEN
  // ============================================================

  kenmerkenDeel5(`
    Corydoras paleatus;
    Corydoras aeneus;
    Corydoras sterbai;
    Corydoras panda;
    Corydoras trilineatus;
    Corydoras julii;
    Corydoras leopardus;
    Corydoras punctatus;
    Corydoras agassizii;
    Corydoras ambiacus;
    Corydoras arcuatus;
    Corydoras atropersonatus;
    Corydoras axelrodi;
    Corydoras barbatus;
    Corydoras bondi;
    Corydoras brevirostris;
    Corydoras burgessi;
    Corydoras concolor;
    Corydoras copei;
    Corydoras davidsandsi;
    Corydoras duplicareus;
    Corydoras elegans;
    Corydoras eques;
    Corydoras evelynae;
    Corydoras flaveolus;
    Corydoras fowleri;
    Corydoras garbei;
    Corydoras geoffroy;
    Corydoras gossei;
    Corydoras griseus;
    Corydoras guapore;
    Corydoras habrosus;
    Corydoras haraldschultzi;
    Corydoras hastatus;
    Corydoras imitator;
    Corydoras incolicana;
    Corydoras kanei;
    Corydoras lacrimostigmata;
    Corydoras leucomelas;
    Corydoras longipinnis;
    Corydoras loxozonus;
    Corydoras maculifer;
    Corydoras melanistius;
    Corydoras melini;
    Corydoras metae;
    Corydoras multimaculatus;
    Corydoras nanus;
    Corydoras napoensis;
    Corydoras narcissus;
    Corydoras nattereri;
    Corydoras nijsseni;
    Corydoras orphnopterus;
    Corydoras ornatus;
    Corydoras osteocarus;
    Corydoras ourastigma;
    Corydoras oxyrhynchus;
    Corydoras pachycephalus;
    Corydoras pantanalensis;
    Corydoras paragua;
    Corydoras pastazensis;
    Corydoras pinheiroi;
    Corydoras polystictus;
    Corydoras potaroensis;
    Corydoras pulcher;
    Corydoras pygmaeus;
    Corydoras rabauti;
    Corydoras reticulatus;
    Corydoras robineae;
    Corydoras robustus;
    Corydoras sanchesi;
    Corydoras saramaccensis;
    Corydoras schwartzi;
    Corydoras semiaquilus;
    Corydoras seussi;
    Corydoras similis;
    Corydoras simulatus;
    Corydoras sodalis;
    Corydoras solox;
    Corydoras spectabilis;
    Corydoras spilurus;
    Corydoras stenocephalus;
    Corydoras surinamensis;
    Corydoras sychri;
    Corydoras treitlii;
    Corydoras undulatus;
    Corydoras virginiae;
    Corydoras weitzmani;
    Corydoras xinguensis;
    Corydoras zygatus
  `, [1,14,18], 90);

  koppel(`
    Corydoras paleatus;
    Corydoras sterbai;
    Corydoras panda;
    Corydoras trilineatus;
    Corydoras julii;
    Corydoras leopardus;
    Corydoras punctatus;
    Corydoras agassizii;
    Corydoras ambiacus;
    Corydoras atropersonatus;
    Corydoras axelrodi;
    Corydoras brevirostris;
    Corydoras copei;
    Corydoras flaveolus;
    Corydoras habrosus;
    Corydoras haraldschultzi;
    Corydoras kanei;
    Corydoras leucomelas;
    Corydoras loxozonus;
    Corydoras maculifer;
    Corydoras melanistius;
    Corydoras multimaculatus;
    Corydoras napoensis;
    Corydoras ornatus;
    Corydoras pantanalensis;
    Corydoras pastazensis;
    Corydoras pinheiroi;
    Corydoras polystictus;
    Corydoras reticulatus;
    Corydoras robineae;
    Corydoras robustus;
    Corydoras schwartzi;
    Corydoras similis;
    Corydoras sodalis;
    Corydoras undulatus;
    Corydoras weitzmani;
    Corydoras xinguensis
  `, [49], 85);

  // ============================================================
  // GEVLEKTE HAAIEN EN ROGGEN
  // ============================================================

  koppel(`
    Walvishaai;
    Luipaardhaai=Triakis semifasciata;
    Stegostoma tigrinum;
    Scyliorhinus canicula;
    Scyliorhinus stellaris;
    Scyliorhinus torazame;
    Scyliorhinus retifer;
    Scyliorhinus capensis;
    Scyliorhinus torrei;
    Scyliorhinus hesperius;
    Atelomycterus marmoratus;
    Atelomycterus macleayi;
    Atelomycterus baliensis;
    Atelomycterus fasciatus;
    Chiloscyllium punctatum;
    Chiloscyllium plagiosum;
    Chiloscyllium indicum;
    Hemiscyllium ocellatum;
    Hemiscyllium freycineti;
    Hemiscyllium hallstromi;
    Hemiscyllium trispeculare;
    Hemiscyllium strahani;
    Hemiscyllium henryi;
    Hemiscyllium galei;
    Hemiscyllium michaeli;
    Hemiscyllium halmahera;
    Orectolobus maculatus;
    Orectolobus ornatus;
    Orectolobus halei;
    Orectolobus leptolineatus;
    Eucrossorhinus dasypogon;
    Aetobatus narinari;
    Aetobatus ocellatus;
    Aetobatus laticeps;
    Taeniura lymma;
    Taeniurops meyeni;
    Neotrygon kuhlii;
    Neotrygon australiae;
    Neotrygon caeruleopunctata;
    Neotrygon orientalis;
    Potamotrygon motoro;
    Potamotrygon leopoldi;
    Potamotrygon henlei;
    Potamotrygon jabuti;
    Potamotrygon schroederi;
    Potamotrygon orbignyi;
    Potamotrygon falkneri;
    Potamotrygon signata;
    Potamotrygon scobina;
    Potamotrygon magdalenae;
    Raja clavata;
    Raja montagui;
    Raja brachyura;
    Raja microocellata;
    Raja miraletus;
    Raja radula;
    Raja undulata;
    Raja asterias
  `, [49], 85);

  // ============================================================
  // LIEVEHEERSBEESTJES MET STIPPEN
  // ============================================================

  koppel(`
    Coccinella septempunctata;
    Coccinella quinquepunctata;
    Coccinella undecimpunctata;
    Coccinella magnifica;
    Coccinella novemnotata;
    Adalia bipunctata;
    Adalia decempunctata;
    Harmonia axyridis;
    Harmonia quadripunctata;
    Harmonia octomaculata;
    Hippodamia variegata;
    Hippodamia convergens;
    Hippodamia tredecimpunctata;
    Hippodamia quinquesignata;
    Propylea quatuordecimpunctata;
    Psyllobora vigintiduopunctata;
    Psyllobora vigintimaculata;
    Halyzia sedecimguttata;
    Calvia quatuordecimguttata;
    Calvia decemguttata;
    Calvia quindecimguttata;
    Anatis ocellata;
    Anatis mali;
    Myrrha octodecimguttata;
    Sospita vigintiguttata;
    Tytthaspis sedecimpunctata;
    Chilocorus renipustulatus;
    Chilocorus bipustulatus;
    Chilocorus stigma;
    Chilocorus kuwanae;
    Exochomus quadripustulatus;
    Scymnus frontalis;
    Scymnus interruptus;
    Nephus quadrimaculatus;
    Nephus bipunctatus;
    Nephus bisignatus;
    Epilachna varivestis;
    Henosepilachna vigintioctopunctata;
    Henosepilachna vigintioctomaculata;
    Subcoccinella vigintiquatuorpunctata
  `, [49], 75);

  // ============================================================
  // GESTREEPTE EN GEVLEKTE VLINDERS
  // ============================================================

  koppel(`
    Heliconius charithonia;
    Heliconius sapho;
    Heliconius eleuchia;
    Heliconius antiochus;
    Heliconius cydno;
    Heliconius erato;
    Heliconius melpomene;
    Heliconius sara;
    Heliconius doris;
    Heliconius hecale;
    Heliconius ismenius;
    Danaus plexippus;
    Danaus chrysippus;
    Danaus genutia;
    Danaus gilippus;
    Papilio machaon;
    Iphiclides podalirius;
    Papilio glaucus;
    Papilio canadensis;
    Papilio rutulus;
    Papilio eurymedon;
    Papilio multicaudata;
    Papilio alexanor;
    Graphium agamemnon;
    Graphium antiphates;
    Graphium androcles;
    Graphium sarpedon;
    Graphium antheus;
    Graphium policenes;
    Graphium porthaon;
    Graphium doson;
    Limenitis camilla;
    Limenitis populi;
    Limenitis reducta;
    Limenitis arthemis;
    Limenitis archippus;
    Limenitis lorquini;
    Limenitis weidemeyerii;
    Araschnia levana;
    Nymphalis antiopa;
    Vanessa atalanta
  `, [48], 85);

  koppel(`
    Aglais io;
    Aglais urticae;
    Vanessa cardui;
    Vanessa atalanta;
    Nymphalis polychloros;
    Nymphalis xanthomelas;
    Polygonia c-album;
    Pararge aegeria;
    Lasiommata megera;
    Lasiommata maera;
    Aphantopus hyperantus;
    Maniola jurtina;
    Pyronia tithonus;
    Coenonympha pamphilus;
    Coenonympha arcania;
    Coenonympha hero;
    Argynnis paphia;
    Speyeria aglaja;
    Fabriciana adippe;
    Fabriciana niobe;
    Issoria lathonia;
    Boloria euphrosyne;
    Boloria selene;
    Brenthis ino;
    Brenthis daphne;
    Melitaea cinxia;
    Melitaea athalia;
    Apatura iris;
    Apatura ilia;
    Hipparchia semele;
    Hipparchia statilinus;
    Erebia ligea;
    Erebia euryale;
    Lopinga achine;
    Caligo eurilochus;
    Caligo memnon;
    Caligo atreus;
    Caligo illioneus;
    Caligo idomeneus;
    Caligo teucer;
    Danaus plexippus;
    Danaus chrysippus;
    Heliconius numata;
    Heliconius ethilla;
    Heliconius pardalinus;
    Heliconius hecale;
    Heliconius ismenius;
    Idea leuconoe;
    Euploea core;
    Zygaena filipendulae;
    Zygaena lonicerae;
    Zygaena trifolii;
    Zygaena viciae;
    Zygaena purpuralis;
    Zygaena minos;
    Zygaena carniolica;
    Zygaena loti;
    Zygaena transalpina;
    Zygaena hippocrepidis;
    Zygaena ephialtes;
    Arctia caja;
    Arctia villica;
    Callimorpha dominula;
    Euplagia quadripunctaria;
    Utetheisa pulchella;
    Smerinthus ocellata;
    Saturnia pavonia;
    Saturnia pyri;
    Antheraea polyphemus;
    Antheraea pernyi;
    Antheraea yamamai;
    Antheraea mylitta;
    Antheraea assamensis;
    Automeris io
  `, [49], 85);

  // ============================================================
  // EXTRA DIEREN MET VIER POTEN
  // ============================================================

  kenmerkenDeel5(`
    Eublepharis macularius;
    Eublepharis angramainyu;
    Eublepharis hardwickii;
    Eublepharis fuscus;
    Hemitheconyx caudicinctus;
    Goniurosaurus luii;
    Goniurosaurus hainanensis;
    Coleonyx variegatus;
    Coleonyx elegans;
    Coleonyx mitratus;
    Coleonyx brevis;
    Gekko gecko;
    Gekko smithii;
    Gekko monarchus;
    Gekko vittatus;
    Gekko kuhli;
    Gekko horsfieldii;
    Phelsuma grandis;
    Phelsuma madagascariensis;
    Phelsuma laticauda;
    Phelsuma lineata;
    Phelsuma quadriocellata;
    Phelsuma klemmeri;
    Phelsuma cepediana;
    Phelsuma ornata;
    Phelsuma guimbeaui;
    Phelsuma inexpectata;
    Phelsuma borbonica;
    Phelsuma dubia;
    Phelsuma standingi;
    Phelsuma abbotti;
    Phelsuma astriata;
    Phelsuma sundbergi;
    Phelsuma breviceps;
    Phelsuma flavigularis;
    Phelsuma guttata;
    Phelsuma hoeschi;
    Phelsuma kochi;
    Phelsuma modesta;
    Phelsuma nigristriata;
    Phelsuma parkeri;
    Phelsuma pusilla;
    Phelsuma robertmertensi;
    Phelsuma seippi;
    Phelsuma serraticauda;
    Phelsuma v-nigra;
    Uroplatus fimbriatus;
    Uroplatus henkeli;
    Uroplatus sikorae;
    Uroplatus sameiti;
    Uroplatus phantasticus;
    Uroplatus ebenaui;
    Uroplatus lineatus;
    Uroplatus alluaudi;
    Uroplatus guentheri;
    Uroplatus giganteus;
    Uroplatus malahelo;
    Uroplatus pietschmanni;
    Uroplatus finiavana;
    Uroplatus fiera;
    Uroplatus fotsivava;
    Uroplatus kelirambo;
    Uroplatus fivehy;
    Uroplatus garamaso;
    Correlophus ciliatus;
    Correlophus sarasinorum;
    Correlophus belepensis;
    Rhacodactylus leachianus;
    Rhacodactylus auriculatus;
    Rhacodactylus trachyrhynchus;
    Rhacodactylus trachycephalus;
    Mniarogekko chahoua;
    Mniarogekko jalu;
    Eurydactylodes agricolae;
    Eurydactylodes vieillardi;
    Eurydactylodes symmetricus;
    Eurydactylodes occidentalis;
    Nephrurus levis;
    Nephrurus amyae;
    Nephrurus asper;
    Nephrurus cinctus;
    Nephrurus deleani;
    Nephrurus laevissimus;
    Nephrurus sheai;
    Nephrurus stellatus;
    Nephrurus vertebralis;
    Nephrurus wheeleri;
    Underwoodisaurus milii;
    Underwoodisaurus seorsus
  `, [4,18,21], 85);

  // ============================================================
  // HERGEBRUIK VAN BESTAANDE DIERRECORDS
  // ============================================================

  // Alleen expliciet geselecteerde geslachten worden
  // gebruikt voor eigenschappen die bij hun bekende
  // soorten betrouwbaar overeenkomen.
  //
  // Er worden geen fictieve soortnamen gegenereerd.

  const kenmerkRegelsDeel5 = [

    {
      patroon:
        /^(Panthera|Lynx|Puma|Acinonyx|Caracal|Leopardus|Prionailurus|Neofelis|Catopuma)\s/i,
      vragen: [4,18,20]
    },

    {
      patroon:
        /^(Vulpes|Canis|Cuon|Lycaon|Lupulella|Otocyon|Nyctereutes|Urocyon)\s/i,
      vragen: [4,18,20]
    },

    {
      patroon:
        /^(Martes|Mustela|Neogale|Pekania|Gulo|Meles|Taxidea|Lutra|Lontra|Enhydra)\s/i,
      vragen: [4,18,20]
    },

    {
      patroon:
        /^(Sciurus|Callosciurus|Ratufa|Tamias|Neotamias|Petaurista|Glaucomys|Pteromys|Tamiops)\s/i,
      vragen: [4,18,20]
    },

    {
      patroon:
        /^(Mus|Rattus|Apodemus|Peromyscus|Microtus|Myodes|Gerbillus|Meriones|Pseudomys)\s/i,
      vragen: [4,18,20]
    },

    {
      patroon:
        /^(Cervus|Dama|Capreolus|Alces|Rangifer|Odocoileus|Muntiacus|Rusa)\s/i,
      vragen: [4,20]
    },

    {
      patroon:
        /^(Lemur|Eulemur|Varecia|Propithecus|Avahi|Microcebus|Cheirogaleus|Lepilemur)\s/i,
      vragen: [20]
    },

    {
      patroon:
        /^(Cebus|Sapajus|Saimiri|Alouatta|Ateles|Aotus|Pithecia|Chiropotes|Macaca|Papio)\s/i,
      vragen: [20]
    },

    {
      patroon:
        /^(Varanus|Pogona|Ctenophorus|Diporiphora|Egernia|Tiliqua|Ctenotus|Agama|Uromastyx)\s/i,
      vragen: [4,18,21]
    },

    {
      patroon:
        /^(Lacerta|Podarcis|Timon|Takydromus|Gallotia|Iberolacerta|Psammodromus)\s/i,
      vragen: [4,18,21]
    },

    {
      patroon:
        /^(Gekko|Phelsuma|Uroplatus|Nephrurus|Oedura|Correlophus|Rhacodactylus|Eublepharis)\s/i,
      vragen: [4,18,21]
    },

    {
      patroon:
        /^(Python|Morelia|Antaresia|Eunectes|Boa|Corallus|Epicrates|Chilabothrus|Pantherophis|Elaphe|Zamenis)\s/i,
      vragen: [18,21]
    },

    {
      patroon:
        /^(Naja|Dendroaspis|Bitis|Atheris|Echis|Cerastes|Crotalus|Sistrurus|Oxyuranus)\s/i,
      vragen: [18,21]
    },

    {
      patroon:
        /^(Testudo|Chelonoidis|Kinixys|Gopherus|Trachemys|Graptemys|Pseudemys|Terrapene|Cuora|Mauremys|Heosemys|Cyclemys)\s/i,
      vragen: [4,7,18,33]
    },

    {
      patroon:
        /^(Chelodina|Emydura|Elseya|Myuchelys|Pelusios|Pelomedusa|Podocnemis|Kinosternon|Sternotherus|Apalone)\s/i,
      vragen: [4,7,18,33]
    },

    {
      patroon:
        /^(Rana|Pelophylax|Hyla|Dryophytes|Agalychnis|Phyllomedusa|Ranitomeya|Dendrobates|Oophaga|Phyllobates|Ameerega)\s/i,
      vragen: [4]
    },

    {
      patroon:
        /^(Salamandra|Ambystoma|Triturus|Lissotriton|Notophthalmus|Tylototriton|Neurergus)\s/i,
      vragen: [4,18]
    },

    {
      patroon:
        /^(Parus|Poecile|Cyanistes|Periparus|Lophophanes|Aegithalos|Fringilla|Turdus|Phylloscopus|Ficedula)\s/i,
      vragen: [2,7,18,22]
    },

    {
      patroon:
        /^(Ara|Amazona|Pionus|Pyrrhura|Agapornis|Platycercus|Neophema|Poicephalus|Trichoglossus)\s/i,
      vragen: [2,7,18,22]
    },

    {
      patroon:
        /^(Larus|Chroicocephalus|Sterna|Sternula|Thalasseus|Calidris|Tringa|Charadrius|Haematopus)\s/i,
      vragen: [2,7,18,22]
    },

    {
      patroon:
        /^(Ramphastos|Pteroglossus|Aulacorhynchus|Selenidera|Andigena|Ploceus|Malimbus|Merops)\s/i,
      vragen: [2,7,18,22]
    },

    {
      patroon:
        /^(Spheniscus|Eudyptes|Aptenodytes|Pygoscelis|Eudyptula|Megadyptes)\s/i,
      vragen: [7,14,18,22]
    },

    {
      patroon:
        /^(Lasius|Formica|Myrmica|Tetramorium|Temnothorax|Pheidole|Tapinoma|Monomorium)\s/i,
      vragen: [7,10]
    },

    {
      patroon:
        /^(Coccinella|Adalia|Harmonia|Hippodamia|Psyllobora|Scymnus|Nephus|Stethorus)\s/i,
      vragen: [7,10]
    },

    {
      patroon:
        /^(Aphis|Myzus|Macrosiphum|Acyrthosiphon|Rhopalosiphum|Sitobion|Uroleucon)\s/i,
      vragen: [10]
    }

  ];

  let automatischeKenmerkKoppelingenDeel5 = 0;

  // De snapshot voorkomt problemen als een helper
  // tijdens verwerking records toevoegt.

  const dierSnapshotDeel5 = [...dieren.values()];

  for (const record of dierSnapshotDeel5) {

    const namen = [
      record.naam,
      ...Array.from(record.synoniemen || [])
    ];

    const relevanteVragen = new Set();

    for (const regel of kenmerkRegelsDeel5) {

      const gevonden = namen.some(
        naam => regel.patroon.test(String(naam))
      );

      if (!gevonden) continue;

      for (const nummer of regel.vragen) {
        relevanteVragen.add(nummer);
      }

    }

    // Uitgestorven dieren blijven in de database,
    // maar krijgen hier geen automatische nieuwe
    // eigenschappen voor actuele dierenvragen.

    if (record.vragen.has(43)) continue;

    for (const nummer of relevanteVragen) {

      if (record.vragen.has(nummer)) continue;

      voegKoppelingToe(record, nummer, 85);

      automatischeKenmerkKoppelingenDeel5++;

    }

  }

  // ============================================================
  // CORRECTIES VAN EIERLEGGENDE EN LEVENDBARENDE DIEREN
  // ============================================================

  // Niet alle reptielen leggen eieren.

  for (const record of [...dieren.values()]) {

    const namen = [
      record.naam,
      ...Array.from(record.synoniemen || [])
    ];

    const levendbarend = namen.some(naam =>
      /^(Boa constrictor|Boa imperator|Eunectes murinus|Eunectes notaeus|Corallus caninus|Corallus hortulana|Epicrates cenchria|Vipera berus|Zootoca vivipara|Tiliqua scincoides|Tiliqua rugosa)$/i
        .test(String(naam))
    );

    if (levendbarend) {
      verwijderKoppeling(record.naam, [7]);
    }

  }

  // ============================================================
  // VIER POTEN - UITZONDERINGEN
  // ============================================================

  for (const naam of `
    Hazelworm;
    Anguis fragilis;
    Anguis colchica;
    Anguis graeca;
    Anguis cephallonica;
    Anguis veronensis;
    Slang;
    Python;
    Cobra;
    Anaconda;
    Boa constrictor;
    Koningspython;
    Korenslang;
    Ringslang;
    Adder;
    Gladde slang;
    Zeeslang;
    Regenworm;
    Wadpier;
    Naaktslak;
    Octopus;
    Zeester;
    Krab;
    Spin;
    Schorpioen;
    Duizendpoot;
    Miljoenpoot;
    Struisvogel;
    Emoe;
    Pinguïn;
    Walvis;
    Dolfijn;
    Bruinvis
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [4]);
    }

  }

  // ============================================================
  // VLUCHTLOZE VOGELS
  // ============================================================

  const vluchtlozeVogelsDeel5 = `
    Struisvogel;
    Somalische struisvogel;
    Emoe;
    Helmkasuaris;
    Casuarius casuarius;
    Casuarius unappendiculatus;
    Casuarius bennetti;
    Rhea americana;
    Rhea pennata;
    Kiwi;
    Apteryx australis;
    Apteryx mantelli;
    Apteryx rowi;
    Apteryx haastii;
    Apteryx owenii;
    Kakapo;
    Strigops habroptila;
    Keizerspinguïn;
    Koningspinguïn;
    Adéliepinguïn;
    Ezelspinguïn;
    Kinbandpinguïn;
    Humboldtpinguïn;
    Magelhaenpinguïn;
    Zwartvoetpinguïn;
    Galapagospinguïn;
    Dwergpinguïn;
    Geeloogpinguïn;
    Macaronipinguïn;
    Rotspinguïn;
    Noordelijke rotspinguïn;
    Snareskuifpinguïn;
    Fiordlandpinguïn;
    Grote kuifpinguïn;
    Schlegelpinguïn;
    Galapagosaalscholver;
    Nannopterum harrisi;
    Phalacrocorax harrisi;
    Atlantisia rogersi;
    Hypotaenidia owstoni;
    Hypotaenidia sylvestris;
    Gallirallus australis;
    Porphyrio hochstetteri
  `;

  for (const naam of vluchtlozeVogelsDeel5.split(";")) {

    if (!naam.trim()) continue;

    verwijderKoppeling(naam.trim(), [2]);

    koppel(naam.trim(), [7,22], 80);

  }

  // ============================================================
  // SCHUBBEN - CORRECTIES
  // ============================================================

  // Een gladde amfibieënhuid is geen vissenschub
  // of reptielenschub.

  for (const naam of `
    Bruine kikker;
    Heikikker;
    Meerkikker;
    Poelkikker;
    Bastaardkikker;
    Boomkikker;
    Gewone pad;
    Rugstreeppad;
    Knoflookpad;
    Vroedmeesterpad;
    Geelbuikvuurpad;
    Vuursalamander;
    Kleine watersalamander;
    Vinpootsalamander;
    Alpenwatersalamander;
    Kamsalamander;
    Axolotl;
    Octopus;
    Inktvis;
    Kwal;
    Zeester;
    Zeekomkommer;
    Zeeanemoon;
    Regenworm;
    Slak;
    Naaktslak
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [21]);
    }

  }

  // ============================================================
  // VERSCHILLEN TUSSEN HOORNS, SLAGTANDEN EN GEWEIEN
  // ============================================================

  for (const naam of `
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Olifant;
    Walrus;
    Narwal;
    Nijlpaard;
    Wrattenzwijn;
    Wild zwijn;
    Muskus hert;
    Siberisch muskushert;
    Moschus moschiferus;
    Vliegend hert;
    Lucanus cervus;
    Lucanus elaphus;
    Dorcus titanus;
    Prosopocoilus giraffa
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [19]);
    }

  }

  // ============================================================
  // KLEURVERANDERING - UITZONDERINGEN
  // ============================================================

  // Deze dieren veranderen van uiterlijk door rui
  // of seizoensgebonden vachtwisseling.
  //
  // Ze worden niet gelijkgesteld aan kameleons.

  for (const naam of `
    Poolvos;
    Hermelijn;
    Sneeuwhaas;
    Poolhaas;
    Amerikaanse sneeuwhaas;
    Sneeuwhoen;
    Alpensneeuwhoen;
    Moerassneeuwhoen;
    Lagopus muta;
    Lagopus lagopus;
    Lagopus leucura
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [42]);
    }

  }

  // ============================================================
  // SYNONIEMEN VAN DEEL 5
  // ============================================================

  const synoniemenDeel5 = [

    ["Gems", "Rupicapra rupicapra"],

    ["Trypoxylus dichotomus", "Allomyrina dichotoma"],

    ["Geochelone sulcata", "Centrochelys sulcata"],

    ["Geochelone pardalis", "Stigmochelys pardalis"],

    ["Geochelone radiata", "Astrochelys radiata"],

    ["Geochelone yniphora", "Astrochelys yniphora"],

    ["Agrionemys horsfieldii", "Testudo horsfieldii"],

    ["Ocadia sinensis", "Mauremys sinensis"],

    ["Emys marmorata", "Actinemys marmorata"],

    ["Emys pallida", "Actinemys pallida"],

    ["Emys blandingii", "Emydoidea blandingii"],

    ["Cynops orientalis", "Hypselotriton orientalis"],

    ["Cynops cyanurus", "Hypselotriton cyanurus"],

    ["Rodolia cardinalis", "Novius cardinalis"],

    ["Cicindela dorsalis", "Habroscelimorpha dorsalis"],

    ["Premnas biaculeatus", "Amphiprion biaculeatus"],

    ["Pseudotropheus demasoni", "Chindongo demasoni"],

    ["Pseudotropheus saulosi", "Chindongo saulosi"],

    ["Pseudotropheus socolofi", "Chindongo socolofi"],

    ["Python reticulatus", "Malayopython reticulatus"],

    ["Python timoriensis", "Malayopython timoriensis"],

    ["Python bivittatus", "Birmese python"],

    ["Orthriophis taeniurus", "Elaphe taeniura"],

    ["Orthriophis cantoris", "Elaphe cantoris"],

    ["Orthriophis hodgsoni", "Elaphe hodgsoni"],

    ["Orthriophis moellendorffi", "Elaphe moellendorffi"],

    ["Gonyosoma prasinum", "Rhadinophis prasinus"],

    ["Gonyosoma frenatum", "Rhadinophis frenatus"],

    ["Zamenis scalaris", "Rhinechis scalaris"],

    ["Zamenis situla", "Elaphe situla"],

    ["Zamenis longissimus", "Elaphe longissima"],

    ["Stegostoma tigrinum", "Stegostoma fasciatum"],

    ["Mobula birostris", "Manta birostris"],

    ["Mobula alfredi", "Manta alfredi"],

    ["Urogymnus polylepis", "Himantura polylepis"],

    ["Cyphotilapia frontosa", "Frontosa"],

    ["Corydoras barbatus", "Scleromystax barbatus"],

    ["Dib atag".replace(" ", ""), "Ammodorcas clarkei"],

    ["Gaffelbok", "Antilocapra americana"],

    ["Gaffelbok", "Pronghorn"],

    ["Gramper", "Grampus griseus"],

    ["Grijze dolfijn", "Grampus griseus"],

    ["Mor pho helenor".replace(" ", ""), "Morpho peleides"],

    ["Paluxysaurus", "Sauroposeidon"],

    ["Lucioperca lucioperca", "Sander lucioperca"]

  ];

  for (const [hoofdnaam, alternatief] of synoniemenDeel5) {

    verenigSynoniemenDeel2(
      hoofdnaam,
      alternatief
    );

  }

  // ============================================================
  // VEILIGE CORRECTIE VAN DUBBELZINNIGE NAMEN
  // ============================================================

  // Maanvis kan verwijzen naar een zeedier
  // of een zoetwateraquariumvis.

  const maanvisZeeDeel5 =
    zoekEen("Mola mola");

  const maanvisZoetDeel5 =
    zoekEen("Pterophyllum scalare");

  if (
    maanvisZeeDeel5 &&
    maanvisZoetDeel5 &&
    maanvisZeeDeel5 !== maanvisZoetDeel5
  ) {

    voegKoppelingToe(maanvisZeeDeel5, 11, 55);

    voegKoppelingToe(maanvisZeeDeel5, 9, 55);

    voegKoppelingToe(maanvisZoetDeel5, 48, 65);

  }

  // De twee dieren mogen nooit worden samengevoegd
  // vanwege de algemene naam "maanvis".

  // ============================================================
  // AANVULLENDE CORRECTIES
  // ============================================================

  const correctiesDeel5 = [

    ["Gem s", [50]],

    ["Cyclura onchiopsis", [3,5,6,12,23,26]],

    ["Anolis roosevelti", [3,5,6,12,23,26]],

    ["Hypselotriton wolterstorffi", [3,5,6,12,23,26]],

    ["Dasyurus maculatus", [19]],

    ["Corydoras paleatus", [21]],

    ["Corydoras aeneus", [21]],

    ["Corydoras sterbai", [21]],

    ["Corydoras panda", [21]],

    ["Corydoras julii", [21]],

    ["Corydoras trilineatus", [21]],

    ["Silurus glanis", [21]],

    ["Pangasianodon gigas", [21]],

    ["Aardvarken", [19]],

    ["Reuzenpanda", [19]],

    ["Luiaard", [19]],

    ["Krokodil", [19]],

    ["Zeeschildpad", [19]],

    ["Leguaan", [19]],

    ["Nautilus pompilius", [42]],

    ["Nautilus macromphalus", [42]]

  ];

  for (const [naam, vragen] of correctiesDeel5) {

    verwijderKoppeling(naam, vragen);

  }

  // ============================================================
  // EXTRA CONTROLES OP VIER POTEN
  // ============================================================

  const pootlozeGroepenDeel5 =
    /^(Anguis|Amphisbaena|Blanus|Rhineura|Monopeltis|Zygaspis|Dalophia|Ichthyophis|Caecilia|Scolecomorphus|Indotyphlops|Afrotyphlops|Anilios|Letheobia)\s/i;

  for (const record of [...dieren.values()]) {

    const namen = [
      record.naam,
      ...Array.from(record.synoniemen || [])
    ];

    if (
      namen.some(naam =>
        pootlozeGroepenDeel5.test(String(naam))
      )
    ) {

      if (record.vragen.has(4)) {
        verwijderKoppeling(record.naam, [4]);
      }

    }

  }

  // ============================================================
  // CONTROLETESTS VAN DEEL 5
  // ============================================================

  const extraKenmerkTestsDeel5 = [

    [4, "Leeuw", true],

    [4, "Koala", true],

    [4, "Europese mol", true],

    [4, "Luipaardgekko", true],

    [4, "Vogelbekdier", true],

    [4, "Hazelworm", false],

    [4, "Korenslang", false],

    [4, "Struisvogel", false],

    [4, "Octopus", false],

    [9, "Afrikaanse savanneolifant", true],

    [9, "Giraffe", true],

    [9, "Blauwe vinvis", true],

    [9, "Walvishaai", true],

    [9, "Zeekrokodil", true],

    [10, "Zwarte wegmier", true],

    [10, "Coccinella septempunctata", true],

    [10, "Aphis fabae", true],

    [10, "Folsomia candida", true],

    [18, "Tijger", true],

    [18, "Rode eekhoorn", true],

    [18, "Komodovaraan", true],

    [19, "Witte neushoorn", true],

    [19, "Gems", true],

    [19, "Alpensteenbok", true],

    [19, "Muskusos", true],

    [19, "Gemsbok", true],

    [19, "Herculeskever", true],

    [19, "Neushoornkever", true],

    [19, "Edelhert", false],

    [19, "Walrus", false],

    [19, "Narwal", false],

    [20, "Tijger", true],

    [20, "Rode eekhoorn", true],

    [20, "Poolvos", true],

    [21, "Komodovaraan", true],

    [21, "Groene leguaan", true],

    [21, "Chinees schubdier", true],

    [21, "Korenslang", true],

    [21, "Bruine kikker", false],

    [21, "Axolotl", false],

    [21, "Octopus", false],

    [22, "Struisvogel", true],

    [22, "Emoe", true],

    [22, "Keizerspinguïn", true],

    [22, "Grote bonte specht", true],

    [2, "Emoe", false],

    [2, "Keizerspinguïn", false],

    [2, "Struisvogel", false],

    [33, "Griekse landschildpad", true],

    [33, "Lederschildpad", true],

    [33, "Negenbandgordeldier", true],

    [33, "Reuzengordeldier", true],

    [36, "Giraffe", true],

    [36, "Struisvogel", true],

    [36, "Knobbelzwaan", true],

    [36, "Dromedaris", true],

    [36, "Diplodocus", true],

    [36, "Brachiosaurus", true],

    [36, "Elasmosaurus", true],

    [42, "Panterkameleon", true],

    [42, "Jemenkameleon", true],

    [42, "Gewone octopus", true],

    [42, "Gewone zeekat", true],

    [42, "Schol", true],

    [42, "Poolvos", false],

    [42, "Hermelijn", false],

    [47, "Blauwgele ara", true],

    [47, "Geelvleugelara", true],

    [47, "Regenbooglori", true],

    [47, "Gele doktersvis", true],

    [47, "Blauwe doktersvis", true],

    [48, "Tijger", true],

    [48, "Gewone zebra", true],

    [48, "Okapi", true],

    [48, "Zebravis", true],

    [48, "Chromobotia macracanthus", true],

    [48, "Amphiprion ocellaris", true],

    [49, "Jachtluipaard", true],

    [49, "Luipaard", true],

    [49, "Jaguar", true],

    [49, "Giraffe", true],

    [49, "Vuursalamander", true],

    [49, "Luipaardgekko", true],

    [49, "Coccinella septempunctata", true],

    [49, "Walvishaai", true]

  ];

  // ============================================================
  // VOORTGANG VAN DEEL 5
  // ============================================================

  const voortgangNaDeel5 =
    volledigeVoortgangV92();

  const kenmerkVragenDeel5 = [
    4,9,10,18,19,20,21,22,33,36,42,47,48,49
  ];

  const rapportKenmerkenDeel5 =
    voortgangNaDeel5.filter(
      vraag => kenmerkVragenDeel5.includes(
        vraag.vraag
      )
    );

  const tussentijdsRapportDeel5 = {

    versie: VERSIE,

    dierrecordsBijStart:
      beginAantalDieren,

    dierrecordsNu:
      dieren.size,

    bruikbareDierrecords:
      [...dieren.values()].filter(
        record => record.vragen.size > 0
      ).length,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    verwijderdeKoppelingen,

    automatischeKenmerkKoppelingen:
      automatischeKenmerkKoppelingenDeel5,

    conflictenBijToevoegen:
      conflictenBijToevoegen.length,

    ontbrekendeKoppelingen:
      ontbrekendeKoppelingen.length,

    vragenMet1000Antwoorden:
      voortgangNaDeel5.filter(
        vraag => vraag.streefdoelBereikt
      ).length,

    ontbrekendTotStreefdoel:
      voortgangNaDeel5.reduce(
        (som, vraag) => som + vraag.tekort,
        0
      ),

    voortgangPercentage:
      Number(
        (
          voortgangNaDeel5.reduce(
            (som, vraag) =>
              som + Math.min(
                vraag.nieuweAntwoorden,
                1000
              ),
            0
          ) / 50000 * 100
        ).toFixed(2)
      )

  };

  console.group(
    "QuizBallon V9.2 - Aanvulling 2 - Deel 5"
  );

  console.table(
    tussentijdsRapportDeel5
  );

  console.table(
    rapportKenmerkenDeel5
  );

  console.table(
    voortgangNaDeel5
  );

  console.groupEnd();

  // ============================================================
  // EINDE AANVULLING 2 - DEEL 5
  // HET BESTAND NOG NIET AFSLUITEN
  // DEEL 6 KOMT HIERONDER
  // ============================================================
   // ============================================================
  // QUIZBALLON V9.2 - AANVULLING 2 - DEEL 6
  // GEDRAG, VOEDING, BEWEGING EN LEVENSDUUR
  // ============================================================

  function gedragDeel6(tekst, vragen, punten = 80) {
    groep(tekst, [...new Set([...vragen, 50])], punten);
  }

  // ============================================================
  // INSECTENETENDE ZOOGDIEREN
  // ============================================================

  gedragDeel6(`
    Aardvarken=Orycteropus afer;
    Numbat=Myrmecobius fasciatus;
    Reuzenmiereneter=Myrmecophaga tridactyla;
    Tamandua tetradactyla;
    Tamandua mexicana;
    Cyclopes didactylus;
    Cyclopes dorsalis;
    Cyclopes ida;
    Cyclopes thomasi;
    Cyclopes rufus;
    Cyclopes xinguensis;
    Cyclopes catellus;
    Mierenegel=Tachyglossus aculeatus;
    Zaglossus bruijnii;
    Zaglossus bartoni;
    Zaglossus attenboroughi;
    Chinees schubdier=Manis pentadactyla;
    Indisch schubdier=Manis crassicaudata;
    Maleis schubdier=Manis javanica;
    Filipijns schubdier=Manis culionensis;
    Reuzenschubdier=Smutsia gigantea;
    Smutsia temminckii;
    Phataginus tricuspis;
    Phataginus tetradactyla;
    Aardwolf=Proteles cristata;
    Grootoorvos=Otocyon megalotis;
    Stokstaartje=Suricata suricatta;
    Egel=Erinaceus europaeus;
    Erinaceus roumanicus;
    Erinaceus concolor;
    Erinaceus amurensis;
    Atelerix albiventris;
    Atelerix algirus;
    Atelerix frontalis;
    Atelerix sclateri;
    Hemiechinus auritus;
    Hemiechinus collaris;
    Paraechinus aethiopicus;
    Paraechinus hypomelas;
    Paraechinus micropus;
    Paraechinus nudiventris;
    Mesechinus dauuricus;
    Mesechinus hughi;
    Mesechinus wangi;
    Echinosorex gymnura;
    Hylomys suillus;
    Hylomys parvus;
    Hylomys megalotis;
    Neotetracus sinensis;
    Neohylomys hainanensis;
    Podogymnura truei;
    Podogymnura aureospinula;
    Tenrec ecaudatus;
    Echinops telfairi;
    Setifer setosus;
    Hemicentetes semispinosus;
    Hemicentetes nigriceps
  `, [15,17], 75);

  // ============================================================
  // SPITSMUIZEN
  // ============================================================

  gedragDeel6(`
    Sorex araneus;
    Sorex minutus;
    Sorex coronatus;
    Sorex alpinus;
    Sorex caecutiens;
    Sorex isodon;
    Sorex daphaenodon;
    Sorex gracillimus;
    Sorex unguiculatus;
    Sorex minutissimus;
    Sorex tundrensis;
    Sorex roboratus;
    Sorex mirabilis;
    Sorex raddei;
    Sorex satunini;
    Sorex volnuchini;
    Sorex caucasicus;
    Sorex samniticus;
    Sorex antinorii;
    Sorex granarius;
    Sorex bedfordiae;
    Sorex cylindricauda;
    Sorex thibetanus;
    Sorex excelsus;
    Sorex cansulus;
    Sorex sinalis;
    Sorex asper;
    Sorex buchariensis;
    Sorex cinereus;
    Sorex haydeni;
    Sorex hoyi;
    Sorex fumeus;
    Sorex monticola;
    Sorex vagrans;
    Sorex pacificus;
    Sorex trowbridgii;
    Sorex sonomae;
    Sorex bendirii;
    Sorex palustris;
    Sorex navigator;
    Sorex bairdi;
    Sorex preblei;
    Sorex merriami;
    Sorex nanus;
    Sorex tenellus;
    Sorex ornatus;
    Sorex longirostris;
    Sorex dispar;
    Sorex gaspensis;
    Sorex arcticus;
    Sorex maritimensis;
    Sorex jacksoni;
    Sorex pribilofensis;
    Sorex portenkoi;
    Crocidura russula;
    Crocidura leucodon;
    Crocidura suaveolens;
    Crocidura sicula;
    Crocidura canariensis;
    Crocidura zimmermanni;
    Crocidura whitakeri;
    Crocidura pachyura;
    Crocidura olivieri;
    Crocidura flavescens;
    Crocidura hirta;
    Crocidura fuscomurina;
    Crocidura luna;
    Crocidura monax;
    Crocidura poensis;
    Crocidura maurisca;
    Crocidura fumosa;
    Crocidura nigripes;
    Crocidura denti;
    Crocidura dolichura;
    Crocidura grandiceps;
    Crocidura jouvenetae;
    Crocidura obscurior;
    Crocidura theresae;
    Crocidura viaria;
    Crocidura jacksoni;
    Crocidura somalica;
    Crocidura bottegi;
    Crocidura nana;
    Crocidura pasha;
    Crocidura floweri;
    Crocidura religiosa;
    Crocidura fulvastra;
    Crocidura zarudnyi;
    Crocidura sibirica;
    Crocidura lasiura;
    Crocidura shantungensis;
    Crocidura dsinezumi;
    Crocidura watasei;
    Crocidura orii;
    Crocidura attenuata;
    Crocidura rapax;
    Crocidura vorax;
    Crocidura tanakae;
    Crocidura fuliginosa;
    Crocidura horsfieldii;
    Crocidura indochinensis;
    Crocidura monticola;
    Crocidura lepidura;
    Crocidura maxi;
    Crocidura orientalis;
    Crocidura brunnea;
    Crocidura beccarii;
    Crocidura foetida;
    Crocidura baluensis;
    Crocidura nigripes;
    Crocidura elongata;
    Crocidura rhoditis;
    Suncus etruscus;
    Suncus murinus;
    Suncus varilla;
    Suncus lixus;
    Suncus megalura;
    Suncus dayi;
    Suncus stoliczkanus;
    Suncus montanus;
    Blarina brevicauda;
    Blarina carolinensis;
    Blarina hylophaga;
    Cryptotis parva;
    Cryptotis mexicana;
    Cryptotis goldmani;
    Cryptotis magnus;
    Cryptotis goodwini;
    Cryptotis nigrescens;
    Cryptotis gracilis;
    Cryptotis meridensis;
    Cryptotis thomasi;
    Cryptotis squamipes;
    Cryptotis montivagus;
    Anourosorex squamipes;
    Anourosorex yamashinai;
    Blarinella quadraticauda;
    Blarinella griselda;
    Blarinella wardi;
    Chodsigoa hypsibia;
    Chodsigoa parca;
    Chodsigoa smithii;
    Chodsigoa salenskii;
    Episoriculus caudatus;
    Episoriculus fumidus;
    Episoriculus leucops;
    Episoriculus macrurus;
    Soriculus nigrescens
  `, [15,17,20], 90);

  // ============================================================
  // INSECTENETENDE VLEERMUIZEN
  // ============================================================

  gedragDeel6(`
    Pipistrellus pipistrellus;
    Pipistrellus pygmaeus;
    Pipistrellus nathusii;
    Pipistrellus kuhlii;
    Pipistrellus hesperidus;
    Pipistrellus rusticus;
    Pipistrellus nanulus;
    Pipistrellus javanicus;
    Pipistrellus coromandra;
    Pipistrellus tenuis;
    Pipistrellus abramus;
    Pipistrellus paterculus;
    Pipistrellus circumdatus;
    Pipistrellus ceylonicus;
    Pipistrellus endoi;
    Pipistrellus hanaki;
    Myotis myotis;
    Myotis blythii;
    Myotis daubentonii;
    Myotis dasycneme;
    Myotis mystacinus;
    Myotis brandtii;
    Myotis nattereri;
    Myotis emarginatus;
    Myotis bechsteinii;
    Myotis alcathoe;
    Myotis capaccinii;
    Myotis punicus;
    Myotis aurascens;
    Myotis schaubi;
    Myotis ikonnikovi;
    Myotis macrodactylus;
    Myotis petax;
    Myotis frater;
    Myotis bombinus;
    Myotis formosus;
    Myotis rufoniger;
    Myotis chinensis;
    Myotis altarium;
    Myotis laniger;
    Myotis siligorensis;
    Myotis muricola;
    Myotis ridleyi;
    Myotis ater;
    Myotis horsfieldii;
    Myotis montivagus;
    Myotis annectans;
    Myotis muricola;
    Myotis lucifugus;
    Myotis septentrionalis;
    Myotis sodalis;
    Myotis grisescens;
    Myotis austroriparius;
    Myotis leibii;
    Myotis californicus;
    Myotis ciliolabrum;
    Myotis yumanensis;
    Myotis evotis;
    Myotis thysanodes;
    Myotis volans;
    Myotis keenii;
    Myotis occultus;
    Myotis auriculus;
    Myotis velifer;
    Myotis melanorhinus;
    Myotis nigricans;
    Myotis riparius;
    Myotis albescens;
    Myotis ruber;
    Myotis keaysi;
    Myotis elegans;
    Myotis simus;
    Myotis dinellii;
    Myotis chiloensis;
    Myotis atacamensis;
    Myotis oxyotus;
    Myotis izecksohni;
    Eptesicus serotinus;
    Eptesicus nilssonii;
    Eptesicus fuscus;
    Eptesicus furinalis;
    Eptesicus brasiliensis;
    Eptesicus diminutus;
    Eptesicus bottae;
    Eptesicus anatolicus;
    Eptesicus ognevi;
    Eptesicus gobiensis;
    Eptesicus japonensis;
    Nyctalus noctula;
    Nyctalus leisleri;
    Nyctalus lasiopterus;
    Nyctalus aviator;
    Nyctalus plancyi;
    Nyctalus montanus;
    Plecotus auritus;
    Plecotus austriacus;
    Plecotus macrobullaris;
    Plecotus teneriffae;
    Plecotus sardus;
    Plecotus kolombatovici;
    Plecotus christii;
    Plecotus turkmenicus;
    Plecotus ognevi;
    Plecotus kozlovi;
    Barbastella barbastellus;
    Barbastella leucomelas;
    Barbastella darjelingensis;
    Vespertilio murinus;
    Vespertilio sinensis;
    Miniopterus schreibersii;
    Miniopterus fuliginosus;
    Miniopterus magnater;
    Miniopterus australis;
    Miniopterus oceanensis;
    Miniopterus natalensis;
    Miniopterus fraterculus;
    Miniopterus minor;
    Miniopterus inflatus;
    Miniopterus africanus;
    Miniopterus manavi;
    Miniopterus gleni;
    Miniopterus griveaudi;
    Miniopterus aelleni;
    Miniopterus mahafaliensis;
    Miniopterus sororculus;
    Tadarida brasiliensis;
    Tadarida teniotis;
    Tadarida aegyptiaca;
    Tadarida fulminans;
    Tadarida lobata;
    Tadarida ventralis;
    Mormopterus jugularis;
    Mormopterus francoismoutoui;
    Mormopterus acetabulosus;
    Molossus molossus;
    Molossus rufus;
    Molossus currentium;
    Molossus sinaloae;
    Molossus pretiosus;
    Molossus coibensis;
    Molossus aztecus;
    Eumops perotis;
    Eumops glaucinus;
    Eumops floridanus;
    Eumops auripendulus;
    Eumops bonariensis;
    Eumops patagonicus;
    Eumops hansae;
    Eumops maurus;
    Eumops nanus;
    Eumops underwoodi;
    Eumops dabbenei;
    Eumops trumbulli
  `, [2,15,17,20,27], 85);

  // ============================================================
  // INSECTENETENDE HOEFIJZERNEUZEN
  // ============================================================

  gedragDeel6(`
    Rhinolophus ferrumequinum;
    Rhinolophus hipposideros;
    Rhinolophus euryale;
    Rhinolophus mehelyi;
    Rhinolophus blasii;
    Rhinolophus clivosus;
    Rhinolophus acrotis;
    Rhinolophus fumigatus;
    Rhinolophus landeri;
    Rhinolophus alcyone;
    Rhinolophus denti;
    Rhinolophus darlingi;
    Rhinolophus capensis;
    Rhinolophus simulator;
    Rhinolophus swinnyi;
    Rhinolophus hildebrandtii;
    Rhinolophus eloquens;
    Rhinolophus guineensis;
    Rhinolophus maclaudi;
    Rhinolophus ruwenzorii;
    Rhinolophus silvestris;
    Rhinolophus luctus;
    Rhinolophus trifoliatus;
    Rhinolophus pearsonii;
    Rhinolophus yunanensis;
    Rhinolophus rouxii;
    Rhinolophus sinicus;
    Rhinolophus affinis;
    Rhinolophus pusillus;
    Rhinolophus lepidus;
    Rhinolophus monoceros;
    Rhinolophus cornutus;
    Rhinolophus imaizumii;
    Rhinolophus perditus;
    Rhinolophus malayanus;
    Rhinolophus stheno;
    Rhinolophus shameli;
    Rhinolophus marshalli;
    Rhinolophus paradoxolophus;
    Rhinolophus macrotis;
    Rhinolophus rex;
    Rhinolophus philippinensis;
    Rhinolophus acuminatus;
    Rhinolophus borneensis;
    Rhinolophus celebensis;
    Rhinolophus canuti;
    Rhinolophus creaghi;
    Rhinolophus sedulus;
    Rhinolophus arcuatus;
    Rhinolophus subrufus;
    Rhinolophus virgo;
    Rhinolophus inops;
    Rhinolophus rufus;
    Rhinolophus robinsoni;
    Rhinolophus megaphyllus;
    Rhinolophus rouxi;
    Rhinolophus arcuatus
  `, [2,15,17,20,27], 90);

  // ============================================================
  // INSECTENETENDE VOGELS - ZWALUWEN
  // ============================================================

  gedragDeel6(`
    Boerenzwaluw=Hirundo rustica;
    Hirundo lucida;
    Hirundo aethiopica;
    Hirundo angolensis;
    Hirundo albigularis;
    Hirundo smithii;
    Hirundo nigrita;
    Hirundo leucosoma;
    Hirundo megaensis;
    Hirundo atrocaerulea;
    Hirundo nigrorufa;
    Hirundo tahitica;
    Hirundo neoxena;
    Hirundo domicola;
    Huiszwaluw=Delichon urbicum;
    Delichon dasypus;
    Delichon nipalense;
    Oeverzwaluw=Riparia riparia;
    Riparia paludicola;
    Riparia chinensis;
    Riparia diluta;
    Riparia congica;
    Riparia cincta;
    Cecropis daurica;
    Cecropis striolata;
    Cecropis cucullata;
    Cecropis abyssinica;
    Cecropis semirufa;
    Cecropis senegalensis;
    Cecropis domicella;
    Cecropis badia;
    Petrochelidon pyrrhonota;
    Petrochelidon fulva;
    Petrochelidon fluvicola;
    Petrochelidon ariel;
    Petrochelidon nigricans;
    Petrochelidon spilodera;
    Petrochelidon rufigula;
    Petrochelidon preussi;
    Petrochelidon perdita;
    Petrochelidon fuliginosa;
    Tachycineta bicolor;
    Tachycineta thalassina;
    Tachycineta albilinea;
    Tachycineta albiventer;
    Tachycineta leucorrhoa;
    Tachycineta leucopyga;
    Tachycineta cyaneoviridis;
    Tachycineta euchrysea;
    Tachycineta stolzmanni;
    Progne subis;
    Progne chalybea;
    Progne dominicensis;
    Progne cryptoleuca;
    Progne sinaloae;
    Progne tapera;
    Progne elegans;
    Progne modesta;
    Progne murphyi;
    Stelgidopteryx serripennis;
    Stelgidopteryx ruficollis;
    Pygochelidon cyanoleuca;
    Pygochelidon melanoleuca;
    Alopochelidon fucata;
    Atticora fasciata;
    Atticora tibialis;
    Orochelidon murina;
    Orochelidon flavipes;
    Orochelidon andecola;
    Psalidoprocne pristoptera;
    Psalidoprocne obscura;
    Psalidoprocne albiceps;
    Psalidoprocne nitens;
    Psalidoprocne fuliginosa
  `, [2,7,15,17,18,22], 85);

  // ============================================================
  // INSECTENETENDE VOGELS - GIERZWALUWEN
  // ============================================================

  gedragDeel6(`
    Gierzwaluw=Apus apus;
    Apus pallidus;
    Apus unicolor;
    Apus alexandri;
    Apus barbatus;
    Apus berliozi;
    Apus bradfieldi;
    Apus niansae;
    Apus horus;
    Apus caffer;
    Apus affinis;
    Apus nipalensis;
    Apus pacificus;
    Apus acuticauda;
    Apus cooki;
    Apus salimalii;
    Apus batesi;
    Tachymarptis melba;
    Tachymarptis aequatorialis;
    Cypsiurus parvus;
    Cypsiurus balasiensis;
    Hirundapus caudacutus;
    Hirundapus cochinchinensis;
    Hirundapus giganteus;
    Hirundapus celebensis;
    Chaetura pelagica;
    Chaetura vauxi;
    Chaetura meridionalis;
    Chaetura brachyura;
    Chaetura cinereiventris;
    Chaetura spinicaudus;
    Chaetura fumosa;
    Chaetura egregia;
    Chaetura chapmani;
    Chaetura viridipennis;
    Aeronautes saxatalis;
    Aeronautes montivagus;
    Aeronautes andecolus;
    Panyptila cayennensis;
    Panyptila sanctihieronymi;
    Streptoprocne zonaris;
    Streptoprocne semicollaris;
    Streptoprocne biscutata;
    Streptoprocne rutila;
    Streptoprocne phelpsi;
    Cypseloides niger;
    Cypseloides fumigatus;
    Cypseloides senex;
    Cypseloides cryptus;
    Cypseloides cherriei;
    Cypseloides lemosi;
    Cypseloides rothschildi;
    Cypseloides storeri;
    Aerodramus fuciphagus;
    Aerodramus maximus;
    Aerodramus salangana;
    Aerodramus brevirostris;
    Aerodramus vulcanorum;
    Aerodramus vanikorensis;
    Aerodramus uniformis;
    Aerodramus hirundinaceus;
    Aerodramus spodiopygius;
    Aerodramus terraereginae;
    Aerodramus bartschi;
    Aerodramus sawtelli;
    Aerodramus leucophaeus;
    Collocalia esculenta;
    Collocalia linchi;
    Collocalia troglodytes
  `, [2,7,15,17,22], 90);

  // ============================================================
  // INSECTENETENDE VOGELS - NACHTZWALUWEN
  // ============================================================

  gedragDeel6(`
    Nachtzwaluw=Caprimulgus europaeus;
    Caprimulgus ruficollis;
    Caprimulgus aegyptius;
    Caprimulgus mahrattensis;
    Caprimulgus asiaticus;
    Caprimulgus atripennis;
    Caprimulgus macrurus;
    Caprimulgus affinis;
    Caprimulgus indicus;
    Caprimulgus jotaka;
    Caprimulgus phalaena;
    Caprimulgus concretus;
    Caprimulgus pulchellus;
    Caprimulgus celebensis;
    Caprimulgus manillensis;
    Caprimulgus mindanensis;
    Caprimulgus maculosus;
    Caprimulgus tristigma;
    Caprimulgus pectoralis;
    Caprimulgus nigriscapularis;
    Caprimulgus poliocephalus;
    Caprimulgus rufigena;
    Caprimulgus fraenatus;
    Caprimulgus nubicus;
    Caprimulgus eximius;
    Caprimulgus climacurus;
    Caprimulgus fossii;
    Caprimulgus natalensis;
    Caprimulgus inornatus;
    Caprimulgus stellatus;
    Caprimulgus donaldsoni;
    Caprimulgus vexillarius;
    Caprimulgus madagascariensis;
    Caprimulgus enarratus;
    Chordeiles minor;
    Chordeiles acutipennis;
    Chordeiles gundlachii;
    Chordeiles rupestris;
    Chordeiles pusillus;
    Chordeiles nacunda;
    Antrostomus carolinensis;
    Antrostomus vociferus;
    Antrostomus arizonae;
    Antrostomus ridgwayi;
    Antrostomus salvini;
    Antrostomus badius;
    Antrostomus rufus;
    Antrostomus cubanensis;
    Antrostomus ekmani;
    Antrostomus noctitherus;
    Antrostomus saturatus;
    Nyctidromus albicollis;
    Nyctidromus anthonyi;
    Nyctiphrynus ocellatus;
    Nyctiphrynus yucatanicus;
    Nyctiphrynus mcleodii;
    Nyctiphrynus rosenbergi;
    Hydropsalis torquata;
    Hydropsalis climacocerca;
    Hydropsalis maculicaudus;
    Hydropsalis cayennensis;
    Systellura longirostris;
    Systellura decussata;
    Eleothreptus anomalus;
    Eleothreptus candicans;
    Phalaenoptilus nuttallii
  `, [2,7,15,17,22,27], 90);

  // ============================================================
  // INSECTENETENDE VOGELS - VLIEGENVANGERS
  // ============================================================

  gedragDeel6(`
    Muscicapa striata;
    Muscicapa tyrrhenica;
    Muscicapa sibirica;
    Muscicapa dauurica;
    Muscicapa ferruginea;
    Muscicapa griseisticta;
    Muscicapa muttui;
    Muscicapa randi;
    Muscicapa segregata;
    Muscicapa sodhii;
    Muscicapa cassini;
    Muscicapa aquatica;
    Muscicapa olivascens;
    Muscicapa adusta;
    Muscicapa epulata;
    Muscicapa sethsmithi;
    Muscicapa infuscata;
    Muscicapa comitata;
    Muscicapa ussheri;
    Muscicapa gambagae;
    Muscicapa grisea;
    Ficedula hypoleuca;
    Ficedula albicollis;
    Ficedula semitorquata;
    Ficedula parva;
    Ficedula albicilla;
    Ficedula subrubra;
    Ficedula zanthopygia;
    Ficedula narcissina;
    Ficedula tricolor;
    Ficedula hyperythra;
    Ficedula hodgsoni;
    Ficedula strophiata;
    Ficedula monileger;
    Ficedula solitaris;
    Ficedula westermanni;
    Ficedula superciliaris;
    Ficedula mugimaki;
    Ficedula dumetoria;
    Ficedula rufigula;
    Ficedula platenae;
    Ficedula basilanica;
    Ficedula luzoniensis;
    Ficedula crypta;
    Ficedula disposita;
    Ficedula buruensis;
    Ficedula henrici;
    Ficedula harterti;
    Ficedula timorensis;
    Ficedula bonthaina;
    Ficedula nigrorufa;
    Ficedula sapphira;
    Ficedula erithacus;
    Ficedula vivida;
    Ficedula hodgsonii;
    Cyornis rubeculoides;
    Cyornis unicolor;
    Cyornis banyumas;
    Cyornis hainanus;
    Cyornis tickelliae;
    Cyornis poliogenys;
    Cyornis pallipes;
    Cyornis olivaceus;
    Cyornis turcosus;
    Cyornis caerulatus;
    Cyornis superbus;
    Cyornis concretus;
    Cyornis herioti;
    Cyornis ruficauda;
    Cyornis rufigastra;
    Cyornis sanfordi;
    Cyornis hoevelli;
    Cyornis hyacinthinus;
    Cyornis omissus;
    Cyornis oscillans;
    Cyornis djampeanus;
    Cyornis kalaoensis;
    Cyornis pelingensis;
    Cyornis colonus;
    Niltava grandis;
    Niltava macgrigoriae;
    Niltava sundara;
    Niltava sumatrana;
    Niltava vivida;
    Niltava davidi;
    Eumyias thalassinus;
    Eumyias sordidus;
    Eumyias albicaudatus;
    Eumyias panayensis;
    Eumyias indigo;
    Culicicapa ceylonensis;
    Culicicapa helianthea
  `, [2,7,15,17,22], 90);

  // ============================================================
  // ROOFDIEREN - SPINNEN
  // ============================================================

  gedragDeel6(`
    Kruisspin=Araneus diadematus;
    Araneus quadratus;
    Araneus marmoreus;
    Araneus angulatus;
    Araneus alsine;
    Araneus sturmi;
    Araneus triguttatus;
    Araneus nordmanni;
    Araneus saevus;
    Araneus bicentenarius;
    Araneus gemma;
    Araneus trifolium;
    Araneus iviei;
    Araneus illaudatus;
    Araneus pegnia;
    Araneus ventricosus;
    Araneus mitificus;
    Araneus marmoroides;
    Wespspin=Argiope bruennichi;
    Argiope lobata;
    Argiope aurantia;
    Argiope trifasciata;
    Argiope argentata;
    Argiope florida;
    Argiope appensa;
    Argiope aetherea;
    Argiope aemula;
    Argiope anasuja;
    Argiope pulchella;
    Argiope catenulata;
    Argiope picta;
    Argiope keyserlingi;
    Argiope radon;
    Argiope protensa;
    Argiope minuta;
    Argiope amoena;
    Argiope ocyaloides;
    Argiope magnifica;
    Argiope mascordi;
    Argiope reinwardti;
    Larinioides cornutus;
    Larinioides sclopetarius;
    Larinioides patagiatus;
    Larinioides ixobolus;
    Nuctenea umbratica;
    Nuctenea silvicultrix;
    Zygiella x-notata;
    Zygiella atrica;
    Zygiella montana;
    Mangora acalypha;
    Mangora gibberosa;
    Mangora placida;
    Mangora maculata;
    Cyclosa conica;
    Cyclosa oculata;
    Cyclosa turbinata;
    Cyclosa argenteoalba;
    Cyclosa insulana;
    Cyclosa ginnaga;
    Cyclosa mulmeinensis;
    Cyclosa confusa;
    Cyclosa bifida;
    Cyclosa japonica;
    Metellina segmentata;
    Metellina mengei;
    Metellina merianae;
    Meta menardi;
    Meta bourneti;
    Meta ovalis;
    Tetragnatha extensa;
    Tetragnatha montana;
    Tetragnatha pinicola;
    Tetragnatha obtusa;
    Tetragnatha nigrita;
    Tetragnatha striata;
    Tetragnatha dearmata;
    Tetragnatha laboriosa;
    Tetragnatha versicolor;
    Tetragnatha elongata;
    Tetragnatha guatemalensis;
    Tetragnatha nitens;
    Tetragnatha mandibulata;
    Tetragnatha maxillosa;
    Tetragnatha javana;
    Tetragnatha praedonia;
    Tetragnatha squamata;
    Tetragnatha vermiformis;
    Leucauge venusta;
    Leucauge argyra;
    Leucauge tessellata;
    Leucauge decorata;
    Leucauge celebesiana;
    Leucauge blanda;
    Leucauge subgemmea;
    Leucauge granulata
  `, [7,15,17], 85);

  // ============================================================
  // PLANTENETENDE ZOOGDIEREN
  // ============================================================

  gedragDeel6(`
    Reuzenpanda=Ailuropoda melanoleuca;
    Rode panda=Ailurus fulgens;
    Koala=Phascolarctos cinereus;
    Gewone wombat=Vombatus ursinus;
    Lasiorhinus latifrons;
    Lasiorhinus krefftii;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Bergkangoeroe;
    Osphranter antilopinus;
    Osphranter bernardus;
    Moeraswallaby;
    Notamacropus rufogriseus;
    Notamacropus agilis;
    Notamacropus eugenii;
    Notamacropus parma;
    Notamacropus irma;
    Notamacropus dorsalis;
    Notamacropus parryi;
    Quokka;
    Petrogale penicillata;
    Petrogale xanthopus;
    Petrogale assimilis;
    Petrogale brachyotis;
    Petrogale burbidgei;
    Petrogale coenensis;
    Petrogale concinna;
    Petrogale godmani;
    Petrogale herberti;
    Petrogale inornata;
    Petrogale lateralis;
    Petrogale mareeba;
    Petrogale persephone;
    Petrogale purpureicollis;
    Petrogale rothschildi;
    Petrogale sharmani;
    Lagorchestes conspicillatus;
    Lagorchestes hirsutus;
    Lagostrophus fasciatus;
    Onychogalea fraenata;
    Onychogalea unguifera;
    Dendrolagus lumholtzi;
    Dendrolagus bennettianus;
    Dendrolagus ursinus;
    Dendrolagus inustus;
    Dendrolagus goodfellowi;
    Dendrolagus matschiei;
    Dendrolagus dorianus;
    Dendrolagus stellarum;
    Dendrolagus mbaiso;
    Dendrolagus scottae;
    Dendrolagus spadix;
    Dendrolagus pulcherrimus;
    Tweevingerige luiaard;
    Hoffmannluiaard;
    Drievingerige luiaard;
    Bruinkeelluiaard;
    Kraagluiaard;
    Dwergluiaard;
    Capibara=Hydrochoerus hydrochaeris;
    Hydrochoerus isthmius;
    Mara=Dolichotis patagonum;
    Dolichotis salinicola;
    Cavia=Cavia porcellus;
    Cavia aperea;
    Cavia tschudii;
    Cavia magna;
    Cavia fulgida;
    Cavia intermedia;
    Cavia patzelti;
    Galea musteloides;
    Galea spixii;
    Galea leucoblephara;
    Galea flavidens;
    Microcavia australis;
    Microcavia niata;
    Microcavia shiptoni;
    Chinchilla lanigera;
    Chinchilla chinchilla;
    Lagidium viscacia;
    Lagidium peruanum;
    Lagidium wolffsohni;
    Lagidium ahuacaense;
    Lagostomus maximus;
    Bever=Castor fiber;
    Canadese bever=Castor canadensis;
    Beverrat=Myocastor coypus;
    Kaaps stekelvarken;
    Hystrix cristata;
    Hystrix indica;
    Hystrix brachyura;
    Hystrix javanica;
    Hystrix sumatrae;
    Hystrix crassispinis;
    Hystrix pumila;
    Atherurus africanus;
    Atherurus macrourus;
    Trichys fasciculata;
    Erethizon dorsatum;
    Coendou prehensilis;
    Coendou bicolor;
    Coendou quichua;
    Coendou mexicanus;
    Coendou spinosus;
    Coendou melanurus;
    Coendou pruinosus;
    Coendou roosmalenorum;
    Coendou rufescens;
    Coendou ichillus;
    Coendou nycthemera;
    Coendou speratus
  `, [16,20], 80);

  // ============================================================
  // PLANTENETENDE HOEFDIEREN
  // ============================================================

  koppel(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Javaanse neushoorn;
    Sumatraanse neushoorn;
    Nijlpaard;
    Dwergnijlpaard;
    Giraffe;
    Okapi;
    Gewone zebra;
    Grévyzebra;
    Bergzebra;
    Paard;
    Ezel;
    Afrikaanse wilde ezel;
    Onager;
    Kiang;
    Gaur;
    Banteng;
    Amerikaanse bizon;
    Europese bizon;
    Waterbuffel;
    Kaapse buffel;
    Wilde yak;
    Yak;
    Edelhert;
    Damhert;
    Ree;
    Eland;
    Rendier;
    Wapiti;
    Witstaarthert;
    Muildierhert;
    Sikahert;
    Sambar;
    Axishert;
    Muntiacus muntjak;
    Muntiacus reevesi;
    Pudu puda;
    Impala;
    Springbok;
    Blauwe gnoe;
    Zwarte gnoe;
    Hartebeest;
    Lichtensteins hartebeest;
    Blesbok;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Bergnyala;
    Bosbok;
    Sitatunga;
    Bongo;
    Elandantilope;
    Reuzenelandantilope;
    Sabelantilope;
    Roanantilope;
    Gemsbok;
    Beisa;
    Algazel;
    Arabische oryx;
    Addax;
    Waterbok;
    Kob;
    Puku;
    Nijlantilope;
    Rietbok;
    Oribi;
    Steenbok;
    Klipspringer;
    Gerenoek;
    Dibatag;
    Dorcasgazelle;
    Slankhoorngazelle;
    Cuviergazelle;
    Damagazelle;
    Grantgazelle;
    Thomsongazelle;
    Saiga;
    Gaffelbok;
    Muskusos;
    Alpensteenbok;
    Siberische steenbok;
    Nubische steenbok;
    Spaanse steenbok;
    Bezoargeit;
    Schroefhoorngeit;
    Gems;
    Pyreneese gems;
    Sneeuwgeit;
    Takin;
    Bharal;
    Argali;
    Dikhoornschaap;
    Dallsschaap;
    Sneeuwschaap;
    Moeflon;
    Dromedaris;
    Kameel;
    Wilde kameel;
    Lama;
    Guanaco;
    Alpaca;
    Vicuna;
    Maleise tapir;
    Tapirus terrestris;
    Tapirus bairdii;
    Tapirus pinchaque
  `, [16], 60);

  // ============================================================
  // PLANTENETENDE WATERDIEREN
  // ============================================================

  gedragDeel6(`
    Doejong=Dugong dugon;
    Caribische lamantijn=Trichechus manatus;
    Afrikaanse lamantijn=Trichechus senegalensis;
    Amazonelamantijn=Trichechus inunguis
  `, [1,14,16], 65);

  gedragDeel6(`
    Groene zeeschildpad=Chelonia mydas;
    Zeeleguaan=Amblyrhynchus cristatus;
    Graskarper=Ctenopharyngodon idella;
    Zebrasoma flavescens;
    Zebrasoma xanthurum;
    Zebrasoma velifer;
    Zebrasoma desjardinii;
    Zebrasoma scopas;
    Zebrasoma rostratum;
    Acanthurus achilles;
    Acanthurus leucosternon;
    Acanthurus japonicus;
    Acanthurus nigricans;
    Acanthurus sohal;
    Acanthurus lineatus;
    Acanthurus coeruleus;
    Acanthurus triostegus;
    Acanthurus chirurgus;
    Acanthurus bahianus;
    Acanthurus tractus;
    Acanthurus dussumieri;
    Acanthurus guttatus;
    Naso unicornis;
    Naso lituratus;
    Naso elegans;
    Siganus vulpinus;
    Siganus unimaculatus;
    Siganus guttatus;
    Siganus canaliculatus;
    Siganus fuscescens;
    Siganus rivulatus;
    Siganus luridus;
    Siganus sutor;
    Siganus argenteus;
    Siganus stellatus;
    Siganus javus;
    Siganus punctatus;
    Siganus corallinus;
    Siganus puellus;
    Siganus virgatus;
    Siganus doliatus;
    Siganus lineatus;
    Siganus spinus;
    Siganus punctatissimus
  `, [1,14,16], 85);

  // Voor de spelvraag tellen ook algenetende dieren mee.

  // ============================================================
  // PLANTENETENDE INSECTEN - BLADKEVERS
  // ============================================================

  gedragDeel6(`
    Coloradokever=Leptinotarsa decemlineata;
    Leptinotarsa juncta;
    Leptinotarsa haldemani;
    Leptinotarsa texana;
    Leptinotarsa rubiginosa;
    Chrysolina fastuosa;
    Chrysolina americana;
    Chrysolina cerealis;
    Chrysolina herbacea;
    Chrysolina graminis;
    Chrysolina coerulans;
    Chrysolina polita;
    Chrysolina purpurascens;
    Chrysolina sanguinolenta;
    Chrysolina staphylaea;
    Chrysolina hyperici;
    Chrysolina quadrigemina;
    Chrysolina banksii;
    Chrysolina marginata;
    Chrysolina varians;
    Chrysolina oricalcia;
    Chrysomela populi;
    Chrysomela tremula;
    Chrysomela saliceti;
    Chrysomela vigintipunctata;
    Chrysomela aeneicollis;
    Chrysomela scripta;
    Chrysomela knabi;
    Phratora vulgatissima;
    Phratora vitellinae;
    Phratora laticollis;
    Phratora tibialis;
    Phratora atrovirens;
    Plagiodera versicolora;
    Gastrophysa viridula;
    Gastrophysa polygoni;
    Gastrophysa cyanea;
    Agelastica alni;
    Galerucella tenella;
    Galerucella lineola;
    Galerucella nymphaeae;
    Galerucella calmariensis;
    Galerucella pusilla;
    Galerucella sagittariae;
    Galeruca tanaceti;
    Galeruca pomonae;
    Galeruca interrupta;
    Galeruca laticollis;
    Lochmaea caprea;
    Lochmaea suturalis;
    Lochmaea crataegi;
    Luperus longicornis;
    Luperus flavipes;
    Luperus luperus;
    Lilioceris lilii;
    Lilioceris merdigera;
    Lilioceris tibialis;
    Lilioceris cheni;
    Crioceris asparagi;
    Crioceris duodecimpunctata;
    Crioceris quinquepunctata;
    Oulema melanopus;
    Oulema obscura;
    Oulema duftschmidi;
    Oulema gallaeciana;
    Oulema rufocyanea;
    Cassida viridis;
    Cassida rubiginosa;
    Cassida nebulosa;
    Cassida vittata;
    Cassida murraea;
    Cassida sanguinosa;
    Cassida flaveola;
    Cassida denticollis;
    Cassida prasina;
    Cassida nobilis;
    Cassida hemisphaerica;
    Cassida margaritacea;
    Cassida vibex;
    Cassida stigmatica;
    Cassida subreticulata;
    Cassida azurea;
    Cassida seladonia;
    Hypocassida subferruginea
  `, [7,16], 90);

  // ============================================================
  // NACHTACTIEVE ZOOGDIEREN - GALAGO'S EN LORI'S
  // ============================================================

  gedragDeel6(`
    Galago senegalensis;
    Galago moholi;
    Galago gallarum;
    Galago matschiei;
    Galagoides demidoff;
    Galagoides thomasi;
    Paragalago cocos;
    Paragalago zanzibaricus;
    Paragalago granti;
    Paragalago orinus;
    Paragalago rondoensis;
    Otolemur crassicaudatus;
    Otolemur garnettii;
    Otolemur monteiri;
    Euoticus elegantulus;
    Euoticus pallidus;
    Sciurocheirus alleni;
    Sciurocheirus gabonensis;
    Sciurocheirus cameronensis;
    Potto=Perodicticus potto;
    Perodicticus edwardsi;
    Perodicticus ibeanus;
    Arctocebus calabarensis;
    Arctocebus aureus;
    Nycticebus coucang;
    Nycticebus bengalensis;
    Nycticebus javanicus;
    Nycticebus menagensis;
    Nycticebus kayan;
    Nycticebus bancanus;
    Nycticebus borneanus;
    Xanthonycticebus pygmaeus;
    Loris tardigradus;
    Loris lydekkerianus;
    Tarsius tarsier;
    Tarsius dentatus;
    Tarsius lariang;
    Tarsius pelengensis;
    Tarsius pumilus;
    Tarsius sangirensis;
    Tarsius tumpara;
    Tarsius wallacei;
    Tarsius supriatnai;
    Tarsius spectrumgurskyae;
    Cephalopachus bancanus;
    Carlito syrichta;
    Aotus trivirgatus;
    Aotus lemurinus;
    Aotus nancymaae;
    Aotus azarae;
    Aotus nigriceps;
    Aotus vociferans;
    Aotus griseimembra;
    Aotus zonalis;
    Aotus brumbacki
  `, [20,27,31,35], 85);

  // ============================================================
  // NACHTACTIEVE MAKI'S
  // ============================================================

  koppel(`
    Vingerdier;
    Avahi laniger;
    Avahi occidentalis;
    Avahi unicolor;
    Avahi cleesei;
    Avahi peyrierasi;
    Avahi meridionalis;
    Avahi ramanantsoavanai;
    Avahi betsileo;
    Avahi mooreorum;
    Lepilemur mustelinus;
    Lepilemur leucopus;
    Lepilemur ruficaudatus;
    Lepilemur edwardsi;
    Lepilemur microdon;
    Lepilemur dorsalis;
    Lepilemur septentrionalis;
    Lepilemur ankaranensis;
    Lepilemur aeeclis;
    Lepilemur ahmansonorum;
    Lepilemur betsileo;
    Lepilemur fleuretae;
    Lepilemur grewcockorum;
    Lepilemur hubbardorum;
    Lepilemur jamesorum;
    Lepilemur milanoii;
    Lepilemur otto;
    Lepilemur petteri;
    Lepilemur randrianasoloi;
    Lepilemur sahamalaza;
    Lepilemur scottorum;
    Lepilemur seali;
    Lepilemur tymerlachsoni;
    Lepilemur wrightae;
    Cheirogaleus major;
    Cheirogaleus medius;
    Cheirogaleus crossleyi;
    Cheirogaleus sibreei;
    Cheirogaleus thomasi;
    Microcebus murinus;
    Microcebus rufus;
    Microcebus berthae;
    Microcebus myoxinus;
    Microcebus griseorufus;
    Microcebus ravelobensis;
    Microcebus tavaratra;
    Microcebus sambiranensis;
    Microcebus mamiratra;
    Microcebus lehilahytsara;
    Microcebus mittermeieri;
    Microcebus jollyae;
    Microcebus simmonsi;
    Microcebus bongolavensis;
    Microcebus danfossi;
    Microcebus margotmarshae;
    Microcebus arnholdi;
    Microcebus gerpi;
    Microcebus marohita;
    Microcebus boraha;
    Microcebus ganzhorni;
    Mirza coquereli;
    Mirza zaza;
    Phaner furcifer;
    Phaner pallescens;
    Phaner parienti;
    Phaner electromontis
  `, [27], 85);

  // ============================================================
  // NACHTACTIEVE UILEN
  // ============================================================

  gedragDeel6(`
    Kerkuil=Tyto alba;
    Tyto furcata;
    Tyto javanica;
    Tyto tenebricosa;
    Tyto multipunctata;
    Tyto novaehollandiae;
    Tyto rosenbergii;
    Tyto longimembris;
    Tyto capensis;
    Tyto glaucops;
    Tyto soumagnei;
    Tyto nigrobrunnea;
    Tyto inexpectata;
    Tyto manusi;
    Tyto aurantia;
    Tyto sororcula;
    Phodilus badius;
    Phodilus assimilis;
    Bosuil=Strix aluco;
    Strix uralensis;
    Strix occidentalis;
    Strix varia;
    Strix rufipes;
    Strix chacoensis;
    Strix hylophila;
    Strix virgata;
    Strix nigrolineata;
    Strix huhula;
    Strix leptogrammica;
    Strix seloputo;
    Strix ocellata;
    Strix butleri;
    Strix hadorami;
    Ransuil=Asio otus;
    Asio abyssinicus;
    Asio stygius;
    Asio capensis;
    Asio clamator;
    Asio madagascariensis;
    Oehoe=Bubo bubo;
    Bubo africanus;
    Bubo bengalensis;
    Bubo capensis;
    Bubo ascalaphus;
    Bubo virginianus;
    Bubo magellanicus;
    Bubo cinerascens;
    Bubo poensis;
    Bubo vosseleri;
    Bubo leucostictus;
    Bubo lacteus;
    Bubo shelleyi;
    Ketupa ketupu;
    Ketupa zeylonensis;
    Ketupa flavipes;
    Ketupa blakistoni;
    Ketupa nipalensis;
    Ketupa sumatrana;
    Ketupa coromanda;
    Ketupa philippensis;
    Aegolius funereus;
    Aegolius acadicus;
    Aegolius ridgwayi;
    Aegolius harrisii;
    Megascops asio;
    Megascops kennicottii;
    Megascops trichopsis;
    Megascops cooperi;
    Megascops choliba;
    Megascops roboratus;
    Megascops barbarus;
    Megascops clarkii;
    Megascops colombianus;
    Megascops ingens;
    Megascops petersoni;
    Megascops marshalli;
    Megascops watsonii;
    Megascops atricapilla;
    Megascops guatemalae;
    Megascops vermiculatus;
    Megascops nudipes;
    Megascops albogularis;
    Megascops hoyi;
    Otus scops;
    Otus sunia;
    Otus lettia;
    Otus bakkamoena;
    Otus semitorques;
    Otus lempiji;
    Otus spilocephalus;
    Otus fuliginosus;
    Otus megalotis;
    Otus everetti;
    Otus nigrorum;
    Otus mirus;
    Otus longicornis;
    Otus mindorensis;
    Otus mantananensis;
    Otus elegans;
    Otus insularis;
    Otus rutilus;
    Otus madagascariensis;
    Otus capnodes;
    Otus mayottensis;
    Otus pauliani;
    Otus moheliensis;
    Otus hartlaubi;
    Otus senegalensis;
    Otus icterorhynchus;
    Otus ireneae;
    Otus pembaensis;
    Otus brucei
  `, [2,7,17,18,22,27], 85);

  // Niet alle uilen zijn uitsluitend nachtactief.
  // Dagactieve soorten worden niet automatisch toegevoegd.

  // ============================================================
  // OVERIGE NACHTACTIEVE ZOOGDIEREN
  // ============================================================

  koppel(`
    Egel;
    Europese das;
    Aardvarken;
    Fennek;
    Zandkat;
    Zwartvoetkat;
    Ocelot;
    Margay;
    Kinkajoe;
    Wasbeer;
    Wasbeerhond;
    Europese otter;
    Steenmarter;
    Boommarter;
    Tasmaanse duivel;
    Gewone wombat;
    Grote bilby;
    Suikereekhoorn;
    Gewone voskoesoe;
    Glaucomys volans;
    Glaucomys sabrinus;
    Glaucomys oregonensis;
    Pteromys volans;
    Pteromys momonga;
    Petaurista petaurista;
    Petaurista alborufus;
    Petaurista elegans;
    Petaurista leucogenys;
    Petaurista philippensis;
    Petaurista magnificus;
    Petaurista nobilis;
    Petaurista xanthotis;
    Aeromys tephromelas;
    Aeromys thomasi;
    Belomys pearsonii;
    Eoglaucomys fimbriatus;
    Hylopetes alboniger;
    Hylopetes spadiceus;
    Hylopetes phayrei;
    Hylopetes lepidus;
    Hylopetes nigripes;
    Hylopetes platyurus;
    Hylopetes sipora;
    Iomys horsfieldii;
    Petaurillus emiliae;
    Petaurillus hosei;
    Petaurillus kinlochii;
    Petinomys setosus;
    Petinomys fuscocapillus;
    Petinomys genibarbis;
    Petinomys hageni;
    Petinomys lugens;
    Petinomys mindanensis;
    Petinomys sagitta;
    Petinomys vordermanni;
    Trogopterus xanthipes;
    Pteromyscus pulverulentus;
    Hazelmuis;
    Eikelmuis;
    Relmuis;
    Bosslaapmuis;
    Graphiurus murinus;
    Graphiurus ocularis;
    Graphiurus platyops;
    Graphiurus microtis;
    Graphiurus parvus;
    Graphiurus lorraineus;
    Graphiurus kelleni;
    Graphiurus crassicaudatus;
    Graphiurus christyi;
    Graphiurus hueti;
    Graphiurus nagtglasii;
    Graphiurus rupicola;
    Graphiurus angolensis
  `, [27], 80);

  // ============================================================
  // WINTERSLAAP - MARMOTTEN
  // ============================================================

  gedragDeel6(`
    Alpenmarmot=Marmota marmota;
    Bosmarmot=Marmota monax;
    Marmota flaviventris;
    Marmota caligata;
    Marmota olympus;
    Marmota vancouverensis;
    Marmota camtschatica;
    Marmota sibirica;
    Marmota baibacina;
    Marmota bobak;
    Marmota himalayana;
    Marmota caudata;
    Marmota menzbieri;
    Marmota broweri;
    Marmota kastschenkoi
  `, [4,20,28], 80);

  // ============================================================
  // WINTERSLAAP - GRONDEEKHOORNS
  // ============================================================

  gedragDeel6(`
    Spermophilus citellus;
    Spermophilus suslicus;
    Spermophilus major;
    Spermophilus pygmaeus;
    Spermophilus fulvus;
    Spermophilus erythrogenys;
    Spermophilus taurensis;
    Spermophilus xanthoprymnus;
    Spermophilus musicus;
    Spermophilus odessanus;
    Spermophilus pallidicauda;
    Spermophilus alashanicus;
    Spermophilus dauricus;
    Spermophilus relictus;
    Spermophilus brevicauda;
    Urocitellus parryii;
    Urocitellus columbianus;
    Urocitellus richardsonii;
    Urocitellus armatus;
    Urocitellus beldingi;
    Urocitellus elegans;
    Urocitellus mollis;
    Urocitellus townsendii;
    Urocitellus washingtoni;
    Urocitellus brunneus;
    Urocitellus canus;
    Urocitellus undulatus;
    Ictidomys tridecemlineatus;
    Callospermophilus lateralis;
    Callospermophilus saturatus;
    Callospermophilus madrensis;
    Eutamias sibiricus;
    Tamias striatus
  `, [20,28], 85);

  // ============================================================
  // WINTERSLAAP - OVERIGE ZOOGDIEREN
  // ============================================================

  koppel(`
    Egel;
    Erinaceus roumanicus;
    Erinaceus concolor;
    Erinaceus amurensis;
    Hazelmuis;
    Eikelmuis;
    Relmuis;
    Bosslaapmuis;
    Glis glis;
    Muscardinus avellanarius;
    Eliomys quercinus;
    Dryomys nitedula;
    Cricetus cricetus;
    Mesocricetus auratus;
    Mesocricetus brandti;
    Mesocricetus newtoni;
    Cheirogaleus medius;
    Cheirogaleus major;
    Cheirogaleus crossleyi;
    Cheirogaleus sibreei;
    Kleine egeltenrek;
    Grote egeltenrek;
    Gewone tenrek;
    Bruine beer;
    Amerikaanse zwarte beer;
    Grizzlybeer;
    Aziatische zwarte beer
  `, [28], 75);

  // ============================================================
  // WINTERSLAAP - VLEERMUIZEN
  // ============================================================

  koppel(`
    Pipistrellus pipistrellus;
    Pipistrellus pygmaeus;
    Pipistrellus nathusii;
    Myotis myotis;
    Myotis blythii;
    Myotis daubentonii;
    Myotis dasycneme;
    Myotis mystacinus;
    Myotis brandtii;
    Myotis nattereri;
    Myotis emarginatus;
    Myotis bechsteinii;
    Myotis alcathoe;
    Myotis capaccinii;
    Eptesicus serotinus;
    Eptesicus nilssonii;
    Eptesicus fuscus;
    Nyctalus noctula;
    Nyctalus leisleri;
    Plecotus auritus;
    Plecotus austriacus;
    Plecotus macrobullaris;
    Rhinolophus ferrumequinum;
    Rhinolophus hipposideros;
    Rhinolophus euryale;
    Rhinolophus mehelyi;
    Barbastella barbastellus;
    Vespertilio murinus;
    Miniopterus schreibersii;
    Myotis lucifugus;
    Myotis septentrionalis;
    Myotis sodalis;
    Myotis grisescens;
    Myotis leibii;
    Myotis californicus;
    Myotis ciliolabrum;
    Myotis yumanensis;
    Myotis evotis;
    Myotis thysanodes;
    Myotis volans;
    Myotis keenii;
    Myotis velifer
  `, [28], 85);

  // Een uitzonderlijke vogel met langdurige torpor.

  gedragDeel6(
    "Armen nachtzwa luw=Phalaenoptilus nuttallii"
      .replace("nachtzwa luw", "nachtzwaluw"),
    [28],
    90
  );

  // ============================================================
  // WINTERSLAAP - ONJUISTE AUTOMATISCHE KOPPELINGEN
  // ============================================================

  for (const naam of `
    IJsbeer;
    Poolvos;
    Sneeuwhaas;
    Poolhaas;
    Rendier;
    Wolf;
    Rode vos;
    Tijger;
    Leeuw;
    Koala;
    Bever;
    Rode eekhoorn;
    Grijze eekhoorn;
    Stokstaartje;
    Struisvogel;
    Pinguïn
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [28]);
    }

  }

  // ============================================================
  // SNELLE LANDDIEREN
  // ============================================================

  gedragDeel6(`
    Jachtluipaard=Acinonyx jubatus;
    Gaffelbok=Antilocapra americana;
    Springbok;
    Thomsongazelle;
    Grantgazelle;
    Impala;
    Blauwe gnoe;
    Zwarte gnoe;
    Saiga;
    Zwarte antilope;
    Leeuw;
    Poema;
    Luipaard;
    Afrikaanse wilde hond;
    Wolf;
    Gevlekte hyena;
    Paard;
    Grévyzebra;
    Gewone zebra;
    Bergzebra;
    Onager;
    Kiang;
    Afrikaanse wilde ezel;
    Struisvogel;
    Somalische struisvogel;
    Emoe;
    Grote nandoe;
    Kleine nandoe;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Amerikaanse haas=Lepus americanus;
    Europese haas=Lepus europaeus;
    Lepus californicus;
    Lepus alleni;
    Lepus townsendii;
    Kaapse haas;
    Dorcasgazelle;
    Mongoolse gazelle;
    Kropgazelle;
    Arabische gazelle
  `, [29], 65);

  // ============================================================
  // SNELLE VLIEGENDE DIEREN
  // ============================================================

  gedragDeel6(`
    Slechtvalk=Falco peregrinus;
    Giervalk=Falco rusticolus;
    Sakervalk=Falco cherrug;
    Lannervalk=Falco biarmicus;
    Boomvalk=Falco subbuteo;
    Falco eleonorae;
    Falco concolor;
    Falco severus;
    Falco longipennis;
    Falco rufigularis;
    Smelleken=Falco columbarius;
    Steenarend=Aquila chrysaetos;
    Havik=Accipiter gentilis;
    Gierzwaluw;
    Alpengierzwaluw=Tachymarptis melba;
    Hirundapus caudacutus;
    Hirundapus giganteus;
    Tadarida brasiliensis;
    Tadarida teniotis;
    Eumops perotis
  `, [29], 75);

  // ============================================================
  // SNELLE WATERDIEREN
  // ============================================================

  koppel(`
    Zwaardvis;
    Zeilvis;
    Blauwe marlijn;
    Zwarte marlijn;
    Gestreepte marlijn;
    Kajikia albida;
    Atlantische blauwvintonijn;
    Thunnus orientalis;
    Thunnus maccoyii;
    Thunnus albacares;
    Makohaai;
    Isurus paucus;
    Orka;
    Tuimelaar;
    Gewone dolfijn;
    Gestreepte dolfijn;
    Dallbruinvis;
    Witsnuitdolfijn
  `, [29], 75);

  // ============================================================
  // LANGZAAM BEWEGENDE DIEREN
  // ============================================================

  koppel(`
    Tweevingerige luiaard;
    Hoffmannluiaard;
    Drievingerige luiaard;
    Bruinkeelluiaard;
    Kraagluiaard;
    Dwergluiaard;
    Griekse landschildpad;
    Moorse landschildpad;
    Vierteenlandschildpad;
    Egyptische landschildpad;
    Klokschildpad;
    Sporenschildpad;
    Luipaardschildpad;
    Stralenschildpad;
    Aldabra-reuzenschildpad;
    Chelonoidis niger;
    Chelonoidis hoodensis;
    Chelonoidis vicina;
    Chelonoidis porteri;
    Chelonoidis vandenburghi;
    Chelonoidis guntheri;
    Chelonoidis microphyes;
    Chelonoidis darwini;
    Chelonoidis chathamensis;
    Chelonoidis duncanensis;
    Chelonoidis becki;
    Roodpootschildpad;
    Geelpootschildpad;
    Chelonoidis chilensis;
    Indiase sterschildpad;
    Birmese sterschildpad;
    Manouria emys;
    Manouria impressa;
    Indotestudo elongata;
    Indotestudo forstenii;
    Indotestudo travancorica;
    Kinixys belliana;
    Kinixys erosa;
    Kinixys homeana;
    Kinixys spekii;
    Kinixys natalensis;
    Kinixys lobatsiana;
    Kinixys nogueyi;
    Kinixys zombensis;
    Gopherus agassizii;
    Gopherus morafkai;
    Gopherus polyphemus;
    Gopherus berlandieri
  `, [30], 75);

  // ============================================================
  // LANGZAAM BEWEGENDE LANDSLAKKEN
  // ============================================================

  gedragDeel6(`
    Wijngaardslak=Helix pomatia;
    Helix lucorum;
    Helix lutescens;
    Helix secernenda;
    Helix cincta;
    Helix melanostoma;
    Helix engaddensis;
    Helix asemnis;
    Helix buchii;
    Helix albescens;
    Helix vulgaris;
    Segrijnslak=Cornu aspersum;
    Gewone tuinslak=Cepaea nemoralis;
    Witgerande tuinslak=Cepaea hortensis;
    Caucasotachea vindobonensis;
    Arianta arbustorum;
    Theba pisana;
    Otala lactea;
    Otala punctata;
    Eobania vermiculata;
    Iberus gualtieranus;
    Iberus alonensis;
    Iberus marmoratus;
    Cernuella virgata;
    Cernuella neglecta;
    Cernuella cisalpina;
    Candidula unifasciata;
    Candidula intersecta;
    Candidula gigaxii;
    Helicella itala;
    Xerosecta cespitum;
    Xeropicta derbentina;
    Xerocrassa cretica;
    Xerocrassa seetzeni;
    Monacha cartusiana;
    Monacha cantiana;
    Monacha obstructa;
    Monacha frequens;
    Monacha claustralis;
    Trochulus hispidus;
    Trochulus striolatus;
    Trochulus villosus;
    Trochulus sericeus;
    Trochulus plebeius;
    Trochulus montanus;
    Helicigona lapicida;
    Chilostoma cingulatum;
    Chilostoma achates;
    Chilostoma planospira;
    Isognomostoma isognomostomos;
    Causa holosericea;
    Aegopinella nitidula;
    Aegopinella pura;
    Aegopinella nitens;
    Oxychilus draparnaudi;
    Oxychilus cellarius;
    Oxychilus alliarius;
    Oxychilus hydatinus;
    Oxychilus helveticus;
    Vitrea crystallina;
    Vitrea contracta;
    Vitrea subrimata;
    Discus rotundatus;
    Discus ruderatus;
    Discus perspectivus;
    Punctum pygmaeum;
    Euconulus fulvus;
    Euconulus alderi;
    Euconulus praticola;
    Cochlicopa lubrica;
    Cochlicopa lubricella;
    Cochlicopa nitens;
    Pupilla muscorum;
    Pupilla sterrii;
    Pupilla triplicata;
    Vertigo antivertigo;
    Vertigo pusilla;
    Vertigo pygmaea;
    Vertigo substriata;
    Vertigo angustior;
    Vertigo moulinsiana;
    Vertigo genesii;
    Vertigo geyeri;
    Vallonia pulchella;
    Vallonia costata;
    Vallonia excentrica;
    Vallonia enniensis;
    Columella edentula;
    Columella aspera;
    Truncatellina cylindrica;
    Truncatellina callicratis;
    Balea perversa;
    Balea heydeni;
    Clausilia bidentata;
    Clausilia dubia;
    Clausilia pumila;
    Clausilia rugosa;
    Macrogastra ventricosa;
    Macrogastra plicatula;
    Macrogastra attenuata;
    Macrogastra badia;
    Alinda biplicata;
    Cochlodina laminata;
    Cochlodina orthostoma;
    Laciniaria plicata;
    Bulgarica cana;
    Ena montana;
    Merdigera obscura;
    Chondrula tridens;
    Zebrina detrita;
    Jaminia quadridens;
    Achatina achatina;
    Lissachatina fulica;
    Lissachatina reticulata;
    Lissachatina immaculata;
    Archachatina marginata;
    Archachatina degneri
  `, [30], 90);

  // ============================================================
  // LANGZAAM BEWEGENDE NAAKTSLAKKEN
  // ============================================================

  gedragDeel6(`
    Arion ater;
    Arion rufus;
    Arion vulgaris;
    Arion lusitanicus;
    Arion fuscus;
    Arion subfuscus;
    Arion hortensis;
    Arion distinctus;
    Arion owenii;
    Arion intermedius;
    Arion silvaticus;
    Arion circumscriptus;
    Arion fasciatus;
    Arion flagellus;
    Arion obesoductus;
    Limax maximus;
    Limax cinereoniger;
    Limax flavus;
    Limacus maculatus;
    Limax sarnensis;
    Limax corsicus;
    Lehmannia marginata;
    Ambigolimax valentianus;
    Ambigolimax nyctelius;
    Malacolimax tenellus;
    Deroceras reticulatum;
    Deroceras agreste;
    Deroceras laeve;
    Deroceras invadens;
    Deroceras panormitanum;
    Deroceras sturanyi;
    Deroceras rodnae;
    Deroceras praecox;
    Deroceras turcicum;
    Tandonia budapestensis;
    Tandonia sowerbyi;
    Tandonia rustica;
    Tandonia kusceri;
    Milax gagates;
    Milax nigricans;
    Testacella haliotidea;
    Testacella scutulum;
    Testacella maugei;
    Ariolimax columbianus;
    Ariolimax californicus;
    Ariolimax dolichophallus;
    Ariolimax buttoni
  `, [30], 90);

  // ============================================================
  // LANGZAME ZEEDIEREN - ZEESTERREN
  // ============================================================

  gedragDeel6(`
    Gewone zeester=Asterias rubens;
    Asterias forbesi;
    Asterias amurensis;
    Asterias vulgaris;
    Asterias rollestoni;
    Pisaster ochraceus;
    Pisaster giganteus;
    Pisaster brevispinus;
    Evasterias troschelii;
    Evasterias echinosoma;
    Leptasterias hexactis;
    Leptasterias polaris;
    Leptasterias groenlandica;
    Leptasterias muelleri;
    Leptasterias tenera;
    Leptasterias aequalis;
    Henricia sanguinolenta;
    Henricia oculata;
    Henricia leviuscula;
    Henricia perforata;
    Henricia aspera;
    Henricia pertusa;
    Henricia lisa;
    Henricia nipponica;
    Henricia tumida;
    Henricia spongiosa;
    Linckia laevigata;
    Linckia multifora;
    Linckia guildingi;
    Linckia columbiae;
    Fromia monilis;
    Fromia milleporella;
    Fromia indica;
    Fromia elegans;
    Fromia nodosa;
    Fromia pacifica;
    Fromia polypora;
    Echinaster sepositus;
    Echinaster spinulosus;
    Echinaster sentus;
    Echinaster echinophorus;
    Echinaster luzonicus;
    Echinaster callosus;
    Echinaster brasiliensis;
    Echinaster graminicola;
    Oreaster reticulatus;
    Protoreaster nodosus;
    Protoreaster lincki;
    Culcita novaeguineae;
    Culcita schmideliana;
    Culcita coriacea;
    Choriaster granulatus;
    Pentaceraster cumingi;
    Pentaceraster mammillatus;
    Pentaceraster tuberculatus;
    Pentaceraster regulus;
    Pentaceraster multispinus;
    Astropecten irregularis;
    Astropecten aranciacus;
    Astropecten bispinosus;
    Astropecten articulatus;
    Astropecten duplicatus;
    Astropecten polyacanthus;
    Astropecten indicus;
    Astropecten scoparius;
    Luidia ciliaris;
    Luidia sarsii;
    Luidia clathrata;
    Luidia maculata;
    Luidia senegalensis;
    Luidia foliolata;
    Solaster endeca;
    Solaster papposus;
    Solaster dawsoni;
    Solaster stimpsoni;
    Crossaster papposus;
    Crossaster squamatus;
    Pteraster militaris;
    Pteraster tesselatus;
    Pteraster pulvillus;
    Odontaster validus;
    Odontaster meridionalis;
    Hippasteria phrygiana
  `, [1,11,30], 90);

  // ============================================================
  // SPRINGENDE ZOOGDIEREN
  // ============================================================

  koppel(`
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Bergkangoeroe;
    Osphranter antilopinus;
    Osphranter bernardus;
    Moeraswallaby;
    Notamacropus rufogriseus;
    Notamacropus agilis;
    Notamacropus eugenii;
    Notamacropus parma;
    Notamacropus irma;
    Notamacropus dorsalis;
    Notamacropus parryi;
    Quokka;
    Petrogale penicillata;
    Petrogale xanthopus;
    Petrogale assimilis;
    Petrogale brachyotis;
    Petrogale burbidgei;
    Petrogale coenensis;
    Petrogale concinna;
    Petrogale godmani;
    Petrogale herberti;
    Petrogale inornata;
    Petrogale lateralis;
    Petrogale mareeba;
    Petrogale persephone;
    Petrogale purpureicollis;
    Petrogale rothschildi;
    Petrogale sharmani;
    Lagorchestes conspicillatus;
    Lagorchestes hirsutus;
    Lagostrophus fasciatus;
    Onychogalea fraenata;
    Onychogalea unguifera;
    Potorous tridactylus;
    Potorous longipes;
    Potorous gilbertii;
    Bettongia gaimardi;
    Bettongia penicillata;
    Bettongia lesueur;
    Bettongia tropica;
    Aepyprymnus rufescens;
    Hypsiprymnodon moschatus;
    Springbok;
    Impala;
    Klipspringer;
    Gems;
    Alpensteenbok;
    Siberische steenbok;
    Nubische steenbok;
    Sneeuwgeit;
    Konijn;
    Europese haas;
    Poolhaas;
    Sneeuwhaas;
    Amerikaanse sneeuwhaas;
    Lepus californicus;
    Lepus alleni;
    Lepus townsendii;
    Rode eekhoorn;
    Grijze eekhoorn;
    Amerikaanse rode eekhoorn;
    Galago senegalensis;
    Galago moholi;
    Galago gallarum;
    Galago matschiei;
    Galagoides demidoff;
    Galagoides thomasi;
    Otolemur crassicaudatus;
    Otolemur garnettii;
    Indri;
    Verreauxs sifaka;
    Propithecus coquereli;
    Propithecus coronatus;
    Propithecus deckenii;
    Propithecus diadema;
    Propithecus edwardsi;
    Propithecus candidus;
    Propithecus perrieri;
    Propithecus tattersalli;
    Tarsius tarsier;
    Tarsius dentatus;
    Tarsius lariang;
    Tarsius pelengensis;
    Tarsius pumilus;
    Tarsius sangirensis;
    Tarsius tumpara;
    Tarsius wallacei;
    Cephalopachus bancanus;
    Carlito syrichta
  `, [34], 80);

  // ============================================================
  // SPRINGENDE KNAAGDIEREN
  // ============================================================

  gedragDeel6(`
    Pedetes capensis;
    Pedetes surdaster;
    Jaculus jaculus;
    Jaculus orientalis;
    Jaculus hirtipes;
    Jaculus blanfordi;
    Jaculus thaleri;
    Allactaga major;
    Allactaga elater;
    Allactaga euphratica;
    Allactaga hotsoni;
    Allactaga williamsi;
    Allactaga sibirica;
    Allactaga tetradactyla;
    Allactaga balikunica;
    Allactaga bullata;
    Dipus sagitta;
    Stylodipus telum;
    Stylodipus sungorus;
    Stylodipus andrewsi;
    Eremodipus lichtensteini;
    Paradipus ctenodactylus;
    Cardiocranius paradoxus;
    Salpingotus crassicauda;
    Salpingotus kozlovi;
    Salpingotus michaelis;
    Salpingotus pallidus;
    Euchoreutes naso;
    Dipodomys deserti;
    Dipodomys merriami;
    Dipodomys ordii;
    Dipodomys spectabilis;
    Dipodomys microps;
    Dipodomys panamintinus;
    Dipodomys nitratoides;
    Dipodomys ingens;
    Dipodomys agilis;
    Dipodomys heermanni;
    Dipodomys nelsoni;
    Dipodomys phillipsii;
    Dipodomys elator;
    Dipodomys gravipes;
    Dipodomys compactus;
    Microdipodops megacephalus;
    Microdipodops pallidus;
    Notomys alexis;
    Notomys mitchellii;
    Notomys fuscus;
    Notomys aquilo;
    Notomys cervinus;
    Zapus hudsonius;
    Zapus princeps;
    Zapus trinotatus;
    Napaeozapus insignis;
    Eozapus setchuanus
  `, [20,34], 85);

  // ============================================================
  // SPRINGENDE INSECTEN - VLOOIEN
  // ============================================================

  gedragDeel6(`
    Kattenvlo=Ctenocephalides felis;
    Hondenvlo=Ctenocephalides canis;
    Mensenvlo=Pulex irritans;
    Pulex simulans;
    Xenopsylla cheopis;
    Xenopsylla brasiliensis;
    Xenopsylla astia;
    Xenopsylla vexabilis;
    Xenopsylla conformis;
    Nosopsyllus fasciatus;
    Nosopsyllus londiniensis;
    Ceratophyllus gallinae;
    Ceratophyllus hirundinis;
    Ceratophyllus columbae;
    Ceratophyllus garei;
    Ceratophyllus fringillae;
    Ceratophyllus styx;
    Ceratophyllus farreni;
    Ceratophyllus rusticus;
    Ceratophyllus vagabundus;
    Ceratophyllus niger;
    Ceratophyllus idius;
    Ceratophyllus celsus;
    Ceratophyllus diffinis;
    Dasypsyllus gallinulae;
    Dasypsyllus stejnegeri;
    Archaeopsylla erinacei;
    Spilopsyllus cuniculi;
    Cediopsylla simplex;
    Leptopsylla segnis;
    Leptopsylla taschenbergi;
    Hystrichopsylla talpae;
    Hystrichopsylla orientalis;
    Ctenophthalmus agyrtes;
    Ctenophthalmus bisoctodentatus;
    Ctenophthalmus nobilis;
    Ctenophthalmus congener;
    Ctenophthalmus assimilis;
    Ctenophthalmus solutus;
    Ctenophthalmus uncinatus;
    Ctenophthalmus intermedius;
    Megabothris turbidus;
    Megabothris walkeri;
    Megabothris rectangulatus;
    Malaraeus telchinus;
    Orchopeas leucopus;
    Orchopeas howardi;
    Orchopeas sexdentatus;
    Oropsylla montana;
    Oropsylla hirsuta;
    Oropsylla tuberculata
  `, [7,10,34], 90);

  // ============================================================
  // SPRINGENDE INSECTEN - SPRINKHANEN
  // ============================================================

  gedragDeel6(`
    Locusta migratoria;
    Schistocerca gregaria;
    Schistocerca americana;
    Schistocerca piceifrons;
    Schistocerca cancellata;
    Schistocerca nitens;
    Schistocerca obscura;
    Schistocerca damnifica;
    Schistocerca alutacea;
    Schistocerca lineata;
    Schistocerca serialis;
    Schistocerca flavofasciata;
    Schistocerca pallens;
    Schistocerca rubiginosa;
    Anacridium aegyptium;
    Anacridium melanorhodon;
    Anacridium wernerellum;
    Anacridium moestum;
    Anacridium rubrispinum;
    Nomadacris septemfasciata;
    Austracris guttulosa;
    Chortoicetes terminifera;
    Calliptamus italicus;
    Calliptamus barbarus;
    Calliptamus wattenwylianus;
    Calliptamus abbreviatus;
    Calliptamus tenuicercis;
    Calliptamus turanicus;
    Oedipoda caerulescens;
    Oedipoda germanica;
    Oedipoda miniata;
    Oedipoda aurea;
    Oedipoda charpentieri;
    Oedipoda fuscocincta;
    Oedipoda schochii;
    Sphingonotus caerulans;
    Sphingonotus azurescens;
    Sphingonotus rubescens;
    Sphingonotus octofasciatus;
    Sphingonotus candidus;
    Sphingonotus savignyi;
    Sphingonotus corsicus;
    Sphingonotus personatus;
    Sphingonotus morini;
    Psophus stridulus;
    Bryodemella tuberculata;
    Stethophyma grossum;
    Stethophyma lineatum;
    Stethophyma gracile;
    Chrysochraon dispar;
    Euthystira brachyptera;
    Stenobothrus lineatus;
    Stenobothrus stigmaticus;
    Stenobothrus nigromaculatus;
    Stenobothrus crassipes;
    Stenobothrus rubicundulus;
    Stenobothrus eurasius;
    Stenobothrus fischeri;
    Omocestus viridulus;
    Omocestus rufipes;
    Omocestus haemorrhoidalis;
    Omocestus petraeus;
    Omocestus raymondi;
    Omocestus antigai;
    Chorthippus brunneus;
    Chorthippus biguttulus;
    Chorthippus mollis;
    Chorthippus albomarginatus;
    Chorthippus vagans;
    Chorthippus apricarius;
    Chorthippus dorsatus;
    Chorthippus pullus;
    Chorthippus parallelus;
    Pseudochorthippus parallelus;
    Pseudochorthippus montanus;
    Gomphocerippus rufus;
    Gomphocerus sibiricus;
    Aeropus sibiricus;
    Myrmeleotettix maculatus;
    Myrmeleotettix antennatus;
    Tettigonia viridissima;
    Tettigonia cantans;
    Tettigonia caudata;
    Tettigonia uvarovi;
    Tettigonia armeniaca;
    Decticus verrucivorus;
    Decticus albifrons;
    Decticus nigrescens;
    Platycleis albopunctata;
    Platycleis grisea;
    Platycleis affinis;
    Platycleis intermedia;
    Roeseliana roeselii;
    Metrioptera brachyptera;
    Bicolorana bicolor;
    Pholidoptera griseoaptera;
    Pholidoptera aptera;
    Pholidoptera fallax;
    Pholidoptera femorata;
    Pholidoptera littoralis;
    Pholidoptera transsylvanica;
    Pholidoptera frivaldszkyi;
    Leptophyes punctatissima;
    Leptophyes albovittata;
    Leptophyes boscii;
    Leptophyes laticauda;
    Phaneroptera falcata;
    Phaneroptera nana;
    Phaneroptera sparsa;
    Conocephalus dorsalis;
    Conocephalus fuscus;
    Conocephalus discolor;
    Conocephalus maculatus;
    Conocephalus fasciatus;
    Conocephalus brevipennis;
    Ruspolia nitidula;
    Ruspolia differens
  `, [7,34], 85);

  // ============================================================
  // KLIMMENDE ZOOGDIEREN
  // ============================================================

  koppel(`
    Rode panda;
    Reuzenpanda;
    Koala;
    Wasbeer;
    Wasbeerhond;
    Boommarter;
    Steenmarter;
    Sabelmarter;
    Geelkeelmarter;
    Amerikaanse marter;
    Pekan;
    Kinkajoe;
    Binturong;
    Neusbeer;
    Nasua narica;
    Nasuella olivacea;
    Olingo;
    Olinguito;
    Bassaricyon alleni;
    Bassaricyon medius;
    Luipaard;
    Jaguar;
    Ocelot;
    Margay;
    Nevelpanter;
    Neofelis diardi;
    Aziatische goudkat;
    Borneogoudkat;
    Marmerkat;
    Rode lynx;
    Europese lynx;
    Canadese lynx;
    Bruine beer;
    Amerikaanse zwarte beer;
    Aziatische zwarte beer;
    Maleise beer;
    Lippenbeer;
    Rode eekhoorn;
    Grijze eekhoorn;
    Vosseekhoorn;
    Amerikaanse rode eekhoorn;
    Hazelmuis;
    Eikelmuis;
    Relmuis;
    Bosslaapmuis;
    Dwergmuis;
    Bosmuis;
    Dwergzijdeaapje;
    Gouden leeuwaapje;
    Chimpansee;
    Bonobo;
    Westelijke gorilla;
    Oostelijke gorilla;
    Borneose orang-oetan;
    Sumatraanse orang-oetan;
    Tapanuli-orang-oetan;
    Siamang;
    Neusaap;
    Indri;
    Rode vari;
    Vari;
    Ringstaartmaki;
    Vingerdier;
    Tweevingerige luiaard;
    Drievingerige luiaard;
    Hoffmannluiaard;
    Bruinkeelluiaard;
    Kraagluiaard;
    Dwergluiaard;
    Alpensteenbok;
    Siberische steenbok;
    Nubische steenbok;
    Spaanse steenbok;
    Gems;
    Pyreneese gems;
    Sneeuwgeit;
    Klipspringer;
    Berganoa
  `, [35], 75);

  // ============================================================
  // KLIMMENDE REPTIELEN
  // ============================================================

  koppel(`
    Groene leguaan;
    Iguana delicatissima;
    Basiliscus basiliscus;
    Basiliscus plumifrons;
    Basiliscus vittatus;
    Basiliscus galeritus;
    Corytophanes cristatus;
    Corytophanes hernandesii;
    Corytophanes percarinatus;
    Laemanctus longipes;
    Laemanctus serratus;
    Chlamydosaurus kingii;
    Varanus varius;
    Varanus prasinus;
    Varanus beccarii;
    Varanus macraei;
    Varanus reisingeri;
    Varanus boehmei;
    Varanus kordensis;
    Varanus salvadorii;
    Varanus gilleni;
    Varanus scalaris;
    Varanus tristis;
    Varanus timorensis;
    Varanus similis;
    Gekko gecko;
    Gekko vittatus;
    Gekko smithii;
    Gekko monarchus;
    Gekko kuhli;
    Gekko lionotum;
    Gekko horsfieldii;
    Gekko cicakterbang;
    Gekko canhi;
    Gekko badenii;
    Hemidactylus frenatus;
    Hemidactylus platyurus;
    Hemidactylus garnotii;
    Hemidactylus mabouia;
    Hemidactylus turcicus;
    Hemidactylus brookii;
    Gehyra mutilata;
    Gehyra oceanica;
    Gehyra variegata;
    Gehyra dubia;
    Gehyra australis;
    Tarentola mauritanica;
    Tarentola annularis;
    Tarentola boettgeri;
    Tarentola delalandii;
    Tarentola gomerensis;
    Tarentola angustimentalis;
    Correlophus ciliatus;
    Correlophus sarasinorum;
    Correlophus belepensis;
    Rhacodactylus leachianus;
    Rhacodactylus auriculatus;
    Rhacodactylus trachyrhynchus;
    Rhacodactylus trachycephalus;
    Mniarogekko chahoua;
    Mniarogekko jalu;
    Eurydactylodes agricolae;
    Eurydactylodes vieillardi;
    Eurydactylodes symmetricus;
    Eurydactylodes occidentalis;
    Boa constrictor;
    Boa imperator;
    Corallus caninus;
    Corallus batesii;
    Corallus hortulana;
    Corallus ruschenbergerii;
    Corallus annulatus;
    Corallus blombergi;
    Corallus cookii;
    Corallus grenadensis;
    Morelia viridis;
    Morelia spilota;
    Morelia azurea;
    Morelia bredli;
    Boomslang;
    Groene mamba;
    Westelijke groene mamba;
    Dendroaspis jamesoni;
    Gonyosoma oxycephalum;
    Gonyosoma jansenii;
    Gonyosoma prasinum;
    Gonyosoma frenatum;
    Gonyosoma boulengeri
  `, [35], 85);

  // ============================================================
  // DIEREN DIE IN GROEPEN LEVEN - ZOOGDIEREN
  // ============================================================

  koppel(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Leeuw;
    Wolf;
    Afrikaanse wilde hond;
    Gevlekte hyena;
    Stokstaartje;
    Zebramangoeste;
    Dwergmangoeste;
    Helogale hirtula;
    Mungos gambianus;
    Chimpansee;
    Bonobo;
    Westelijke gorilla;
    Oostelijke gorilla;
    Berggorilla;
    Mandril;
    Drill;
    Mantelbaviaan;
    Gele baviaan;
    Groene baviaan;
    Beerbaviaan;
    Guineabaviaan;
    Gelada;
    Huzaaraap;
    Groene meerkat;
    Vervet;
    Ringstaartmaki;
    Rode vari;
    Vari;
    Indri;
    Gouden leeuwaapje;
    Dwergzijdeaapje;
    Neusaap;
    Siamang;
    Rode brulaap;
    Zwarte brulaap;
    Capibara;
    Hydrochoerus isthmius;
    Naakte molrat;
    Fukomys damarensis;
    Cynomys ludovicianus;
    Cynomys leucurus;
    Cynomys gunnisoni;
    Cynomys parvidens;
    Cynomys mexicanus;
    Amerikaanse bizon;
    Europese bizon;
    Gaur;
    Banteng;
    Kaapse buffel;
    Waterbuffel;
    Wilde yak;
    Muskusos;
    Rendier;
    Edelhert;
    Damhert;
    Wapiti;
    Gewone zebra;
    Grévyzebra;
    Bergzebra;
    Wilde kameel;
    Guanaco;
    Vicuna;
    Lama;
    Alpaca;
    Giraffe;
    Blauwe gnoe;
    Zwarte gnoe;
    Impala;
    Springbok;
    Hartebeest;
    Blesbok;
    Elandantilope;
    Reuzenelandantilope;
    Grote koedoe;
    Nyala;
    Waterbok;
    Kob;
    Puku;
    Sabelantilope;
    Roanantilope;
    Gemsbok;
    Beisa;
    Algazel;
    Addax;
    Grantgazelle;
    Thomsongazelle;
    Saiga;
    Tibetaanse antilope;
    Nijlpaard;
    Penseelzwijn;
    Wild zwijn;
    Wrattenzwijn;
    Halsbandpekari;
    Witlippekari;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe
  `, [40], 65);

  // ============================================================
  // SOCIALE WALVISACHTIGEN
  // ============================================================

  gedragDeel6(`
    Tuimelaar=Tursiops truncatus;
    Tursiops aduncus;
    Gewone dolfijn=Delphinus delphis;
    Gestreepte dolfijn=Stenella coeruleoalba;
    Stenella attenuata;
    Stenella frontalis;
    Stenella longirostris;
    Stenella clymene;
    Orka=Orcinus orca;
    Zwarte zwaardwalvis=Pseudorca crassidens;
    Dwergorka=Feresa attenuata;
    Peponocephala electra;
    Griend=Globicephala melas;
    Globicephala macrorhynchus;
    Gramper=Grampus griseus;
    Sotalia fluviatilis;
    Sotalia guianensis;
    Sousa chinensis;
    Sousa plumbea;
    Sousa sahulensis;
    Sousa teuszii;
    Orcaella brevirostris;
    Orcaella heinsohni;
    Cephalorhynchus commersonii;
    Cephalorhynchus eutropia;
    Cephalorhynchus heavisidii;
    Cephalorhynchus hectori;
    Lagenorhynchus albirostris;
    Lagenorhynchus acutus;
    Lagenorhynchus obscurus;
    Lagenorhynchus obliquidens;
    Lagenorhynchus australis;
    Lagenorhynchus cruciger;
    Lissodelphis borealis;
    Lissodelphis peronii;
    Steno bredanensis;
    Beloega;
    Narwal;
    Potvis
  `, [1,14,40], 85);

  // ============================================================
  // IN GROEPEN LEVENDE VISSEN
  // ============================================================

  gedragDeel6(`
    Atlantische haring=Clupea harengus;
    Clupea pallasii;
    Sardine=Sardina pilchardus;
    Sardinops sagax;
    Sardinella aurita;
    Sardinella longiceps;
    Sardinella gibbosa;
    Sardinella lemuru;
    Sardinella maderensis;
    Sardinella fimbriata;
    Sardinella albella;
    Sardinella brachysoma;
    Sardinella melanura;
    Sardinella neglecta;
    Sardinella sindensis;
    Sprot=Sprattus sprattus;
    Sprattus fuegensis;
    Sprattus antipodum;
    Sprattus muelleri;
    Ansjovis=Engraulis encrasicolus;
    Engraulis anchoita;
    Engraulis ringens;
    Engraulis japonicus;
    Engraulis mordax;
    Engraulis australis;
    Engraulis capensis;
    Engraulis eurystole;
    Anchoa mitchilli;
    Anchoa hepsetus;
    Anchoa spinifer;
    Anchoa tricolor;
    Anchoa marinii;
    Anchoa januaria;
    Makreel=Scomber scombrus;
    Scomber japonicus;
    Scomber colias;
    Scomber australasicus;
    Trachurus trachurus;
    Trachurus mediterraneus;
    Trachurus picturatus;
    Trachurus japonicus;
    Trachurus murphyi;
    Trachurus symmetricus;
    Trachurus capensis;
    Trachurus declivis;
    Trachurus novaezelandiae;
    Thunnus thynnus;
    Thunnus orientalis;
    Thunnus albacares;
    Thunnus obesus;
    Thunnus alalunga;
    Thunnus maccoyii;
    Katsuwonus pelamis;
    Euthynnus alletteratus;
    Euthynnus affinis;
    Euthynnus lineatus;
    Auxis thazard;
    Auxis rochei;
    Sarda sarda;
    Sarda chiliensis;
    Sarda orientalis;
    Sarda australis
  `, [1,11,14,40], 85);

  // ============================================================
  // SCHOLENDE ZOETWATERVISSEN
  // ============================================================

  gedragDeel6(`
    Neon tetra=Paracheirodon innesi;
    Kardinaaltetra=Paracheirodon axelrodi;
    Paracheirodon simulans;
    Hemigrammus bleheri;
    Hemigrammus rhodostomus;
    Hemigrammus erythrozonus;
    Hemigrammus ocellifer;
    Hemigrammus pulcher;
    Hemigrammus caudovittatus;
    Hemigrammus unilineatus;
    Hemigrammus marginatus;
    Hemigrammus gracilis;
    Hyphessobrycon eques;
    Hyphessobrycon flammeus;
    Hyphessobrycon herbertaxelrodi;
    Hyphessobrycon bentosi;
    Hyphessobrycon rosaceus;
    Hyphessobrycon amandae;
    Hyphessobrycon columbianus;
    Hyphessobrycon pulchripinnis;
    Hyphessobrycon megalopterus;
    Hyphessobrycon sweglesi;
    Hyphessobrycon socolofi;
    Hyphessobrycon erythrostigma;
    Hyphessobrycon anisitsi;
    Hyphessobrycon elachys;
    Hyphessobrycon loretoensis;
    Pristella maxillaris;
    Gymnocorymbus ternetzi;
    Gymnocorymbus thayeri;
    Moenkhausia sanctaefilomenae;
    Moenkhausia pittieri;
    Moenkhausia oligolepis;
    Moenkhausia dichroura;
    Moenkhausia intermedia;
    Petitella georgiae;
    Petitella bleheri;
    Petitella rhodostoma;
    Danio rerio;
    Danio albolineatus;
    Danio choprae;
    Danio dangila;
    Danio nigrofasciatus;
    Danio kyathit;
    Danio aesculapii;
    Devario aequipinnatus;
    Devario malabaricus;
    Devario devario;
    Devario pathirana;
    Trigonostigma heteromorpha;
    Trigonostigma espei;
    Trigonostigma hengeli;
    Trigonostigma somphongsi;
    Boraras brigittae;
    Boraras maculatus;
    Boraras merah;
    Boraras micros;
    Boraras urophthalmoides;
    Boraras naevus;
    Rasbora trilineata;
    Rasbora borapetensis;
    Rasbora dorsiocellata;
    Rasbora einthovenii;
    Rasbora caudimaculata;
    Rasbora dusonensis;
    Rasbora lateristriata;
    Rasbora paviana;
    Rasbora sumatrana;
    Rasbora argyrotaenia;
    Puntigrus tetrazona;
    Puntigrus anchisporus;
    Puntigrus partipentazona;
    Puntius titteya;
    Pethia conchonius;
    Pethia nigrofasciata;
    Pethia padamya;
    Pethia ticto;
    Pethia gelius;
    Pethia cumingii
  `, [1,14,40], 85);

  // ============================================================
  // GROEPSLEVENDE VOGELS
  // ============================================================

  koppel(`
    Spreeuw;
    Roze spreeuw;
    Sturnus vulgaris;
    Pastor roseus;
    Roodbekwever=Quelea quelea;
    Quelea erythrops;
    Quelea cardinalis;
    Philetairus socius;
    Grasparkiet;
    Valkparkiet;
    Roze kaketoe;
    Geelkuifkaketoe;
    Cacatua sanguinea;
    Cacatua tenuirostris;
    Calyptorhynchus banksii;
    Zanda funerea;
    Zanda latirostris;
    Zanda baudinii;
    Huismus;
    Ringmus;
    Keep;
    Sijs;
    Putter;
    Kruisbek;
    Grote kruisbek;
    Rotgans;
    Brandgans;
    Grauwe gans;
    Kolgans;
    Kleine rietgans;
    Sneeuwgans;
    Rossgans;
    Canadese gans;
    Kraanvogel;
    Canadese kraanvogel;
    Saruskraanvogel;
    Grote flamingo;
    Kleine flamingo;
    Rode flamingo;
    Chileense flamingo;
    Andesflamingo;
    Jamesflamingo;
    Keizerspinguïn;
    Koningspinguïn;
    Adéliepinguïn;
    Ezelspinguïn;
    Kinbandpinguïn;
    Humboldtpinguïn;
    Magelhaenpinguïn;
    Zwartvoetpinguïn;
    Macaronipinguïn;
    Rotspinguïn;
    Noordelijke rotspinguïn;
    Papegaaiduiker;
    Zeekoet;
    Kortbekzeekoet;
    Alk;
    Kleine alk;
    Jan-van-gent;
    Morus capensis;
    Morus serrator;
    Grote aalscholver;
    Kokmeeuw;
    Zilvermeeuw;
    Kleine mantelmeeuw;
    Grote mantelmeeuw;
    Drieteenmeeuw;
    Visdief;
    Noordse stern;
    Grote stern;
    Dwergstern;
    Bonte strandloper;
    Kanoet;
    Drieteenstrandloper;
    Kleine strandloper;
    Steenloper;
    Kluut;
    Scholekster
  `, [40], 75);

  // ============================================================
  // DIEREN DIE NESTEN BOUWEN - WEEVERVOGELS
  // ============================================================

  koppel(`
    Ploceus cucullatus;
    Ploceus velatus;
    Ploceus capensis;
    Ploceus intermedius;
    Ploceus ocularis;
    Ploceus melanocephalus;
    Ploceus heuglini;
    Ploceus nigerrimus;
    Ploceus castaneiceps;
    Ploceus jacksoni;
    Ploceus bicolor;
    Ploceus baglafecht;
    Ploceus luteolus;
    Ploceus vitellinus;
    Ploceus xanthops;
    Ploceus aurantius;
    Ploceus galbula;
    Ploceus taeniopterus;
    Ploceus bojeri;
    Ploceus castanops;
    Ploceus subaureus;
    Ploceus xanthopterus;
    Ploceus nigricollis;
    Ploceus alienus;
    Ploceus melanogaster;
    Ploceus pelzelni;
    Ploceus nicolli;
    Ploceus insignis;
    Ploceus preussi;
    Ploceus dorsomaculatus;
    Ploceus tricolor;
    Ploceus albinucha;
    Ploceus nelicourvi;
    Ploceus sakalava;
    Malimbus malimbicus;
    Malimbus nitens;
    Malimbus rubricollis;
    Malimbus scutatus;
    Malimbus erythrogaster;
    Malimbus cassini;
    Malimbus coronatus;
    Malimbus racheliae;
    Malimbus ballmanni;
    Malimbus ibadanensis;
    Quelea quelea;
    Quelea erythrops;
    Quelea cardinalis;
    Philetairus socius;
    Pseudonigrita arnaudi;
    Pseudonigrita cabanisi;
    Sporopipes frontalis;
    Sporopipes squamifrons;
    Euplectes orix;
    Euplectes afer;
    Euplectes franciscanus;
    Euplectes hordeaceus;
    Euplectes nigroventris;
    Euplectes gierowii;
    Euplectes jacksoni;
    Euplectes progne;
    Euplectes ardens;
    Euplectes axillaris;
    Euplectes albonotatus;
    Euplectes macroura;
    Euplectes capensis;
    Euplectes psammocromius
  `, [41], 85);

  // ============================================================
  // DIEREN DIE NESTEN BOUWEN - OVEN VOGELS
  // ============================================================

  gedragDeel6(`
    Furnarius rufus;
    Furnarius leucopus;
    Furnarius figulus;
    Furnarius minor;
    Furnarius cristatus;
    Furnarius torridus;
    Furnarius cinnamomeus;
    Furnarius longirostris;
    Synallaxis ruficapilla;
    Synallaxis frontalis;
    Synallaxis albescens;
    Synallaxis spixi;
    Synallaxis hypospodia;
    Synallaxis cinerascens;
    Synallaxis brachyura;
    Synallaxis erythrothorax;
    Synallaxis stictothorax;
    Synallaxis zimmeri;
    Synallaxis hypochondriaca;
    Synallaxis tithys;
    Synallaxis unirufa;
    Synallaxis castanea;
    Synallaxis fuscorufa;
    Synallaxis azarae;
    Synallaxis courseni;
    Synallaxis maranonica;
    Synallaxis gujanensis;
    Synallaxis albilora;
    Synallaxis macconnelli;
    Synallaxis cherriei;
    Synallaxis rutilans;
    Synallaxis cinnamomea;
    Synallaxis moesta;
    Synallaxis cabanisi;
    Synallaxis subpudica;
    Synallaxis scutata;
    Synallaxis infuscata;
    Synallaxis kollari;
    Certhiaxis cinnamomeus;
    Certhiaxis mustelinus;
    Phacellodomus rufifrons;
    Phacellodomus striaticeps;
    Phacellodomus sibilatrix;
    Phacellodomus striaticollis;
    Phacellodomus ruber;
    Phacellodomus erythrophthalmus;
    Phacellodomus ferrugineigula;
    Phacellodomus dorsalis;
    Phacellodomus maculipectus;
    Anumbius annumbi;
    Coryphistera alaudina;
    Pseudoseisura cristata;
    Pseudoseisura lophotes;
    Pseudoseisura gutturalis;
    Pseudoseisura unirufa
  `, [2,7,22,41], 90);

  // ============================================================
  // NESTEN BOUWENDE INSECTEN - SOCIALE WESPEN
  // ============================================================

  gedragDeel6(`
    Gewone wesp=Vespula vulgaris;
    Duitse wesp=Vespula germanica;
    Vespula rufa;
    Vespula austriaca;
    Vespula atropilosa;
    Vespula consobrina;
    Vespula acadica;
    Vespula flavopilosa;
    Vespula maculifrons;
    Vespula pensylvanica;
    Vespula squamosa;
    Vespula alascensis;
    Vespula vidua;
    Vespula flaviceps;
    Vespula shidai;
    Vespula koreensis;
    Vespula structor;
    Dolichovespula media;
    Dolichovespula sylvestris;
    Dolichovespula saxonica;
    Dolichovespula norwegica;
    Dolichovespula arenaria;
    Dolichovespula maculata;
    Dolichovespula adulterina;
    Dolichovespula omissa;
    Dolichovespula alpicola;
    Dolichovespula pacifica;
    Dolichovespula asiatica;
    Europese hoornaar=Vespa crabro;
    Aziatische hoornaar=Vespa velutina;
    Vespa mandarinia;
    Vespa simillima;
    Vespa orientalis;
    Vespa tropica;
    Vespa affinis;
    Vespa analis;
    Vespa basalis;
    Vespa bicolor;
    Vespa ducalis;
    Vespa dybowskii;
    Vespa fervida;
    Vespa fumida;
    Vespa luctuosa;
    Vespa mocsaryana;
    Vespa multimaculata;
    Vespa philippinensis;
    Vespa soror;
    Vespa vivax;
    Polistes dominula;
    Polistes gallicus;
    Polistes nimpha;
    Polistes biglumis;
    Polistes associus;
    Polistes albellus;
    Polistes chinensis;
    Polistes japonicus;
    Polistes rothneyi;
    Polistes olivaceus;
    Polistes stigma;
    Polistes wattii;
    Polistes humilis;
    Polistes exclamans;
    Polistes fuscatus;
    Polistes metricus;
    Polistes carolina;
    Polistes annularis;
    Polistes apachus;
    Polistes bellicosus;
    Polistes dorsalis;
    Polistes major;
    Polistes canadensis;
    Polistes versicolor;
    Polistes carnifex;
    Polistes erythrocephalus;
    Polistes lanio;
    Polistes simillimus
  `, [7,40,41], 90);

  // Sociale parasieten bouwen geen eigen kolonienest.

  for (const naam of [
    "Vespula austriaca",
    "Dolichovespula adulterina",
    "Dolichovespula omissa",
    "Vespa dybowskii"
  ]) {
    verwijderKoppeling(naam, [41]);
  }

  // ============================================================
  // NESTEN BOUWENDE ZOOGDIEREN
  // ============================================================

  koppel(`
    Rode eekhoorn;
    Grijze eekhoorn;
    Vosseekhoorn;
    Amerikaanse rode eekhoorn;
    Hazelmuis;
    Dwergmuis;
    Huismuis;
    Bruine rat;
    Zwarte rat;
    Egel;
    Chimpansee;
    Bonobo;
    Westelijke gorilla;
    Oostelijke gorilla;
    Borneose orang-oetan;
    Sumatraanse orang-oetan;
    Tapanuli-orang-oetan;
    Wild zwijn;
    Bever;
    Canadese bever;
    Vogelbekdier;
    Europese mol
  `, [41], 65);

  // ============================================================
  // LANG LEVENDE ZOOGDIEREN
  // ============================================================

  gedragDeel6(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Groenlandse walvis;
    Blauwe vinvis;
    Gewone vinvis;
    Noordse vinvis;
    Bultrug;
    Potvis;
    Grijze walvis;
    Noordkaper;
    Zuidkaper;
    Japanse noordkaper;
    Orka;
    Narwal;
    Beloega;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Nijlpaard;
    Chimpansee;
    Bonobo;
    Westelijke gorilla;
    Oostelijke gorilla;
    Borneose orang-oetan;
    Sumatraanse orang-oetan;
    Tapanuli-orang-oetan;
    Mens=Homo sapiens
  `, [44], 65);

  // ============================================================
  // LANG LEVENDE REPTIELEN
  // ============================================================

  gedragDeel6(`
    Aldabra-reuzenschildpad;
    Chelonoidis niger;
    Chelonoidis hoodensis;
    Chelonoidis vicina;
    Chelonoidis porteri;
    Chelonoidis vandenburghi;
    Chelonoidis guntheri;
    Chelonoidis microphyes;
    Chelonoidis darwini;
    Chelonoidis chathamensis;
    Chelonoidis duncanensis;
    Chelonoidis becki;
    Griekse landschildpad;
    Moorse landschildpad;
    Klokschildpad;
    Sporenschildpad;
    Luipaardschildpad;
    Stralenschildpad;
    Astrochelys yniphora;
    Manouria emys;
    Gopherus agassizii;
    Gopherus morafkai;
    Gopherus polyphemus;
    Gopherus berlandieri;
    Groene zeeschildpad;
    Lederschildpad;
    Karetschildpad;
    Dikkopschildpad;
    Zeekrokodil;
    Nijlkrokodil;
    Amerikaanse krokodil;
    Amerikaanse alligator;
    Gaviaal;
    Brughagedis=Sphenodon punctatus
  `, [44], 75);

  // ============================================================
  // LANG LEVENDE VOGELS
  // ============================================================

  gedragDeel6(`
    Blauwgele ara;
    Geelvleugelara;
    Groenvleugelara;
    Hyacintara;
    Ara militaris;
    Ara ambiguus;
    Grijze roodstaartpapegaai;
    Timnehpapegaai;
    Geelkuifkaketoe;
    Molukkenkaketoe=Cacatua moluccensis;
    Witkuifkaketoe=Cacatua alba;
    Cacatua ophthalmica;
    Palmkaketoe;
    Roze kaketoe;
    Helmkaketoe;
    Calyptorhynchus banksii;
    Zanda funerea;
    Kakapo;
    Grote albatros;
    Diomedea epomophora;
    Diomedea sanfordi;
    Diomedea antipodensis;
    Diomedea dabbenena;
    Thalassarche melanophris;
    Thalassarche chrysostoma;
    Phoebastria immutabilis;
    Phoebastria nigripes;
    Phoebastria albatrus;
    Phoebastria irrorata;
    Andescondor=Vultur gryphus;
    Californische condor=Gymnogyps californianus
  `, [44], 80);

  // ============================================================
  // LANG LEVENDE VISSEN
  // ============================================================

  gedragDeel6(`
    Groenlandse haai=Somniosus microcephalus;
    Somniosus pacificus;
    Belugasteur=Huso huso;
    Huso dauricus;
    Acipenser transmontanus;
    Acipenser fulvescens;
    Acipenser sturio;
    Acipenser oxyrinchus;
    Acipenser medirostris;
    Acipenser baerii;
    Acipenser gueldenstaedtii;
    Acipenser sinensis;
    Acipenser schrenckii;
    Acipenser persicus;
    Atlantische slijmkop=Hoplostethus atlanticus;
    Sebastes aleutianus;
    Sebastes borealis;
    Sebastes melanostictus;
    Sebastes alutus;
    Sebastes ruberrimus;
    Sebastes reedi;
    Sebastes pinniger;
    Sebastes crameri;
    Sebastes elongatus;
    Sebastes diploproa;
    Sebastes maliger;
    Sebastes brevispinis;
    Sebastes polyspinis;
    Sebastes variabilis;
    Sebastes nigrocinctus;
    Sebastes rufus;
    Sebastes auriculatus;
    Sebastes paucispinis;
    Anoplopoma fimbria;
    Allocyttus verrucosus;
    Pseudocyttus maculatus;
    Reuzenbaars;
    Neoceratodus forsteri;
    Latimeria chalumnae
  `, [1,44], 90);

  // ============================================================
  // LANG LEVENDE ONGEWERVELDEN
  // ============================================================

  gedragDeel6(`
    Noordkromp=Arctica islandica;
    Margaritifera margaritifera;
    Margaritifera falcata;
    Margaritifera laevis;
    Panopea generosa;
    Panopea globosa;
    Panopea zelandica;
    Glycymeris glycymeris;
    Tridacna gigas;
    Tridacna derasa;
    Tridacna squamosa;
    Mesodesma donacium;
    Rode zee-egel=Mesocentrotus franciscanus;
    Strongylocentrotus droebachiensis;
    Strongylocentrotus purpuratus;
    Kreeft=Homarus gammarus;
    Amerikaanse kreeft=Homarus americanus;
    Lamellibrachia luymesi;
    Escarpia laminata;
    Leiopathes glaberrima;
    Gerardia savaglia;
    Monorhaphis chuni
  `, [44], 90);

  // ============================================================
  // GIFTIGE DIEREN - SLANGEN
  // ============================================================

  // Zowel dieren met actief toegediend gif als dieren
  // met giftige lichaamsstoffen tellen voor vraag 45.

  koppel(`
    Zwarte mamba;
    Groene mamba;
    Westelijke groene mamba;
    Dendroaspis jamesoni;
    Egyptische cobra;
    Kaapse cobra;
    Zwartnekcobra;
    Naja mossambica;
    Naja annulifera;
    Naja melanoleuca;
    Naja pallida;
    Naja nubiae;
    Naja ashei;
    Naja katiensis;
    Naja anchietae;
    Naja senegalensis;
    Naja subfulva;
    Naja guineensis;
    Naja savannula;
    Naja multifasciata;
    Naja annulata;
    Naja christyi;
    Hemachatus haemachatus;
    Boomslang;
    Pofadder;
    Gabonadder;
    Bitis rhinoceros;
    Bitis nasicornis;
    Bitis atropos;
    Bitis caudalis;
    Bitis cornuta;
    Bitis peringueyi;
    Bitis schneideri;
    Bitis xeropaga;
    Bitis rubida;
    Bitis armata;
    Bitis heraldica;
    Bitis parviocula;
    Bitis worthingtoni;
    Atheris squamigera;
    Atheris ceratophora;
    Atheris chlorechis;
    Atheris hispida;
    Atheris nitschei;
    Atheris desaixi;
    Atheris katangensis;
    Atheris rungweensis;
    Atheris broadleyi;
    Atheris barbouri;
    Atheris mabuensis;
    Atheris acuminata;
    Atheris anisolepis;
    Echis pyramidum;
    Echis ocellatus;
    Echis leucogaster;
    Echis jogeri;
    Echis hughesi;
    Echis coloratus;
    Cerastes cerastes;
    Cerastes vipera;
    Binnenlandse taipan;
    Kusttaipan;
    Oxyuranus temporalis;
    Pseudonaja textilis;
    Pseudonaja nuchalis;
    Pseudonaja affinis;
    Pseudonaja aspidorhyncha;
    Pseudonaja guttata;
    Pseudonaja inframacula;
    Pseudonaja ingrami;
    Pseudonaja mengdeni;
    Pseudonaja modesta;
    Tijgerslang;
    Pseudechis australis;
    Pseudechis porphyriacus;
    Pseudechis colletti;
    Pseudechis guttatus;
    Pseudechis butleri;
    Pseudechis weigeli;
    Pseudechis pailsei
  `, [45], 80);

  // ============================================================
  // GIFTIGE AMFIBIEËN
  // ============================================================

  koppel(`
    Dendrobates tinctorius;
    Dendrobates auratus;
    Dendrobates leucomelas;
    Dendrobates truncatus;
    Oophaga pumilio;
    Oophaga histrionica;
    Oophaga lehmanni;
    Oophaga sylvatica;
    Oophaga granulifera;
    Oophaga vicentei;
    Oophaga arborea;
    Oophaga occultator;
    Oophaga solanensis;
    Oophaga anchicayensis;
    Phyllobates terribilis;
    Phyllobates bicolor;
    Phyllobates aurotaenia;
    Phyllobates lugubris;
    Phyllobates vittatus;
    Ranitomeya imitator;
    Ranitomeya reticulata;
    Ranitomeya variabilis;
    Ranitomeya ventrimaculata;
    Ranitomeya amazonica;
    Ranitomeya fantastica;
    Ranitomeya summersi;
    Ranitomeya benedicta;
    Ranitomeya flavovittata;
    Ranitomeya vanzolinii;
    Ranitomeya uakarii;
    Ranitomeya sirensis;
    Adelphobates galactonotus;
    Adelphobates castaneoticus;
    Adelphobates quinquevittatus;
    Excidobates mysteriosus;
    Excidobates captivus;
    Ameerega trivittata;
    Ameerega bassleri;
    Ameerega parvula;
    Ameerega bilinguis;
    Ameerega hahneli;
    Ameerega picta;
    Ameerega silverstonei;
    Ameerega pepperi;
    Ameerega altamazonica;
    Ameerega macero;
    Epipedobates anthonyi;
    Epipedobates tricolor;
    Vuursalamander;
    Salamandra algira;
    Salamandra corsica;
    Salamandra infraimmaculata;
    Salamandra longirostris;
    Gewone pad;
    Rugstreeppad;
    Bufo bufo;
    Bufo spinosus;
    Rhinella marina;
    Rhinella horribilis;
    Taricha granulosa;
    Taricha torosa;
    Taricha rivularis;
    Taricha sierrae;
    Cynops pyrrhogaster;
    Cynops ensicauda;
    Hypselotriton orientalis
  `, [45], 85);

  // ============================================================
  // GIFTIGE ZEEDIEREN
  // ============================================================

  gedragDeel6(`
    Hapalochlaena lunulata;
    Hapalochlaena maculosa;
    Hapalochlaena fasciata;
    Portugese oorlogsschip=Physalia physalis;
    Chironex fleckeri;
    Chironex yamaguchii;
    Chiropsalmus quadrumanus;
    Chiropsella bronzie;
    Carukia barnesi;
    Malo kingi;
    Malo maxima;
    Carybdea marsupialis;
    Carybdea rastonii;
    Carybdea xaymacana;
    Alatina alata;
    Morbakka fenneri;
    Tamoya haplonema;
    Pelagia noctiluca;
    Cyanea capillata;
    Cyanea lamarckii;
    Chrysaora hysoscella;
    Chrysaora quinquecirrha;
    Chrysaora fuscescens;
    Chrysaora pacifica;
    Chrysaora melanaster;
    Chrysaora achlyos;
    Chrysaora colorata;
    Gonionemus vertens;
    Synanceia verrucosa;
    Synanceia horrida;
    Synanceia nana;
    Synanceia alula;
    Synanceia platyrhyncha;
    Pterois volitans;
    Pterois miles;
    Pterois antennata;
    Pterois radiata;
    Pterois lunulata;
    Pterois mombasae;
    Pterois russelii;
    Pterois sphex;
    Dendrochirus zebra;
    Dendrochirus brachypterus;
    Dendrochirus biocellatus;
    Dendrochirus barberi;
    Trachinus draco;
    Trachinus radiatus;
    Trachinus araneus;
    Trachinus armatus;
    Trachinus collignoni;
    Echiichthys vipera;
    Conus geographus;
    Conus textile;
    Conus tulipa;
    Conus striatus;
    Conus magus;
    Conus marmoreus;
    Conus obscurus;
    Conus catus;
    Conus purpurascens;
    Conus pennaceus;
    Conus aulicus;
    Conus victoriae;
    Conus gloriamaris;
    Conus omaria
  `, [1,11,45], 90);

  // ============================================================
  // GIFTIGE VISSEN - KOGELVISSEN
  // ============================================================

  gedragDeel6(`
    Takifugu rubripes;
    Takifugu niphobles;
    Takifugu poecilonotus;
    Takifugu pardalis;
    Takifugu porphyreus;
    Takifugu obscurus;
    Takifugu flavidus;
    Takifugu vermicularis;
    Takifugu xanthopterus;
    Takifugu stictonotus;
    Takifugu chrysops;
    Takifugu snyderi;
    Takifugu reticularis;
    Takifugu bimaculatus;
    Takifugu alboplumbeus;
    Lagocephalus sceleratus;
    Lagocephalus lunaris;
    Arothron hispidus;
    Arothron nigropunctatus;
    Arothron stellatus;
    Arothron meleagris;
    Arothron manilensis;
    Arothron mappa;
    Arothron reticularis;
    Arothron immaculatus;
    Arothron firmamentum;
    Canthigaster valentini;
    Canthigaster solandri;
    Canthigaster rostrata;
    Canthigaster janthinoptera;
    Canthigaster bennetti
  `, [1,45], 90);

  // ============================================================
  // HERGEBRUIK VAN BESTAANDE DIERRECORDS
  // ============================================================

  // Alleen eigenschappen die voldoende algemeen zijn
  // binnen de geselecteerde groepen worden toegepast.
  //
  // Levensduur en snelheid worden nooit automatisch
  // afgeleid uit alleen een geslachtsnaam.

  const gedragsRegelsDeel6 = [

    {
      patroon:
        /^(Panthera|Lynx|Puma|Acinonyx|Caracal|Leopardus|Prionailurus|Neofelis|Catopuma)\s/i,
      vragen: [17]
    },

    {
      patroon:
        /^(Dendroaspis|Naja|Bitis|Atheris|Echis|Cerastes|Crotalus|Sistrurus|Oxyuranus|Pseudonaja|Pseudechis)\s/i,
      vragen: [17,45]
    },

    {
      patroon:
        /^(Python|Morelia|Antaresia|Eunectes|Boa|Corallus|Epicrates|Chilabothrus|Pantherophis|Elaphe|Zamenis)\s/i,
      vragen: [17]
    },

    {
      patroon:
        /^(Crocodylus|Alligator|Caiman|Melanosuchus|Mecistops|Gavialis|Tomistoma)\s/i,
      vragen: [17]
    },

    {
      patroon:
        /^(Galago|Galagoides|Paragalago|Otolemur|Euoticus|Sciurocheirus)\s/i,
      vragen: [27,31,34,35]
    },

    {
      patroon:
        /^(Nycticebus|Xanthonycticebus|Loris|Perodicticus|Arctocebus)\s/i,
      vragen: [27,31,35]
    },

    {
      patroon:
        /^(Tarsius|Cephalopachus|Carlito)\s/i,
      vragen: [15,17,27,31,34,35]
    },

    {
      patroon:
        /^(Microcebus|Cheirogaleus|Lepilemur|Avahi|Mirza|Phaner)\s/i,
      vragen: [27,31,35]
    },

    {
      patroon:
        /^(Glaucomys|Pteromys|Petaurista|Aeromys|Belomys|Hylopetes|Petinomys)\s/i,
      vragen: [27,31,35]
    },

    {
      patroon:
        /^(Dendrolagus)\s/i,
      vragen: [16,31,35]
    },

    {
      patroon:
        /^(Sorex|Crocidura|Suncus|Blarina|Cryptotis)\s/i,
      vragen: [15,17]
    },

    {
      patroon:
        /^(Pipistrellus|Rhinolophus|Plecotus|Miniopterus|Tadarida|Molossus|Eumops)\s/i,
      vragen: [15,17,27]
    },

    {
      patroon:
        /^(Hirundo|Delichon|Riparia|Cecropis|Petrochelidon|Tachycineta|Progne)\s/i,
      vragen: [15,17]
    },

    {
      patroon:
        /^(Apus|Tachymarptis|Cypsiurus|Hirundapus|Chaetura|Aeronautes|Aerodramus|Collocalia)\s/i,
      vragen: [15,17]
    },

    {
      patroon:
        /^(Caprimulgus|Chordeiles|Antrostomus|Nyctidromus|Nyctiphrynus|Hydropsalis)\s/i,
      vragen: [15,17,27]
    },

    {
      patroon:
        /^(Tyto|Otus|Megascops|Aegolius)\s/i,
      vragen: [17]
    },

    {
      patroon:
        /^(Cebus|Sapajus|Saimiri|Alouatta|Ateles|Pithecia|Chiropotes|Macaca|Papio)\s/i,
      vragen: [35,40]
    },

    {
      patroon:
        /^(Ploceus|Malimbus|Quelea|Euplectes)\s/i,
      vragen: [41]
    },

    {
      patroon:
        /^(Lasius|Formica|Myrmica|Tetramorium|Pheidole|Temnothorax|Tapinoma|Monomorium|Messor)\s/i,
      vragen: [40]
    },

    {
      patroon:
        /^(Amphisbaena|Blanus|Rhineura|Monopeltis|Zygaspis|Dalophia)\s/i,
      vragen: [32]
    },

    {
      patroon:
        /^(Aphis|Myzus|Macrosiphum|Acyrthosiphon|Rhopalosiphum|Sitobion|Uroleucon)\s/i,
      vragen: [16]
    },

    {
      patroon:
        /^(Chrysolina|Chrysomela|Phratora|Galerucella|Galeruca|Lilioceris|Crioceris|Cassida)\s/i,
      vragen: [16]
    },

    {
      patroon:
        /^(Testudo|Chelonoidis|Kinixys|Gopherus|Astrochelys|Stigmochelys|Psammobates)\s/i,
      vragen: [30]
    },

    {
      patroon:
        /^(Helix|Cepaea|Cornu|Cernuella|Candidula|Trochulus|Oxychilus|Arion|Deroceras|Limax)\s/i,
      vragen: [30]
    },

    {
      patroon:
        /^(Araneus|Argiope|Larinioides|Nuctenea|Zygiella|Cyclosa|Metellina|Tetragnatha|Leucauge)\s/i,
      vragen: [15,17]
    },

    {
      patroon:
        /^(Dendrobates|Oophaga|Phyllobates|Ranitomeya|Adelphobates|Ameerega)\s/i,
      vragen: [15,17]
    },

    {
      patroon:
        /^(Clupea|Sardina|Sardinops|Sardinella|Sprattus|Engraulis|Trachurus|Scomber)\s/i,
      vragen: [40]
    }

  ];

  let automatischeGedragKoppelingenDeel6 = 0;

  const dierSnapshotDeel6 = [...dieren.values()];

  for (const record of dierSnapshotDeel6) {

    if (!record || !record.vragen) continue;

    if (record.vragen.has(43)) continue;

    const namen = [
      record.naam,
      ...Array.from(record.synoniemen || [])
    ];

    const relevanteVragen = new Set();

    for (const regel of gedragsRegelsDeel6) {

      if (
        !namen.some(naam =>
          regel.patroon.test(String(naam))
        )
      ) {
        continue;
      }

      for (const nummer of regel.vragen) {
        relevanteVragen.add(nummer);
      }

    }

    for (const nummer of relevanteVragen) {

      if (record.vragen.has(nummer)) continue;

      voegKoppelingToe(record, nummer, 85);

      automatischeGedragKoppelingenDeel6++;

    }

  }

  // ============================================================
  // EXTRA CORRECTIES VOOR ALGEMENE VRAGEN
  // ============================================================

  // Kikkers kunnen niet allemaal goed springen.
  // Deze groepen worden niet automatisch toegevoegd.

  // Broedparasieten bouwen doorgaans geen eigen nest.

  const broedparasietenDeel6 = `
    Koekoek;
    Cuculus canorus;
    Cuculus optatus;
    Cuculus saturatus;
    Cuculus poliocephalus;
    Cuculus micropterus;
    Cuculus rochii;
    Cuculus gularis;
    Cuculus clamosus;
    Cuculus solitarius;
    Cuculus crassirostris;
    Chrysococcyx caprius;
    Chrysococcyx klaas;
    Chrysococcyx cupreus;
    Chrysococcyx flavigularis;
    Chalcites basalis;
    Chalcites lucidus;
    Chalcites minutillus;
    Clamator glandarius;
    Clamator jacobinus;
    Clamator levaillantii;
    Clamator coromandus;
    Eudynamys scolopaceus;
    Eudynamys orientalis;
    Eudynamys melanorhynchus;
    Molothrus ater;
    Molothrus bonariensis;
    Molothrus aeneus;
    Molothrus rufoaxillaris;
    Molothrus oryzivorus;
    Indicator indicator;
    Indicator minor;
    Indicator variegatus;
    Indicator conirostris;
    Indicator exilis;
    Indicator pumilio;
    Indicator willcocksi;
    Indicator meliphilus;
    Indicator xanthonotus
  `;

  for (const naam of broedparasietenDeel6.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [41]);
    }

  }

  // ============================================================
  // CORRECTIES VOOR PLANTENETENDE DIEREN
  // ============================================================

  const voedingsCorrectiesDeel6 = [

    ["Leeuw", [16]],

    ["Tijger", [16]],

    ["Jachtluipaard", [16]],

    ["Luipaard", [16]],

    ["Jaguar", [16]],

    ["Sneeuwluipaard", [16]],

    ["Orka", [16]],

    ["Witte haai", [16]],

    ["Zwarte mamba", [16]],

    ["Koningspython", [16]],

    ["Boa constrictor", [16]],

    ["Koala", [15,17]],

    ["Giraffe", [15,17]],

    ["Groene leguaan", [15]],

    ["Aardwolf", [16]],

    ["Reuzenmiereneter", [16]],

    ["Numbat", [16]],

    ["Aardvarken", [16]]

  ];

  for (const [naam, vragen] of voedingsCorrectiesDeel6) {

    verwijderKoppeling(naam, vragen);

  }

  // ============================================================
  // CORRECTIES VOOR GIFTIGE DIEREN
  // ============================================================

  const nietGiftigeDierenDeel6 = `
    Koningspython;
    Python regius;
    Python molurus;
    Python bivittatus;
    Malayopython reticulatus;
    Boa constrictor;
    Boa imperator;
    Groene anaconda;
    Gele anaconda;
    Eunectes murinus;
    Eunectes notaeus;
    Korenslang;
    Pantherophis guttatus;
    Ringslang;
    Natrix helvetica;
    Natrix natrix;
    Gladde slang;
    Coronella austriaca;
    Hazelworm;
    Anguis fragilis;
    Luipaardgekko;
    Eublepharis macularius;
    Groene leguaan;
    Iguana iguana;
    Baardagame;
    Pogona vitticeps
  `;

  for (const naam of nietGiftigeDierenDeel6.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [45]);
    }

  }

  // ============================================================
  // CORRECTIES VOOR NACHTACTIEVE DIEREN
  // ============================================================

  // Deze soorten zijn hoofdzakelijk dagactief.
  // Alleen vraag 27 wordt hier gecorrigeerd.

  for (const naam of `
    Stokstaartje;
    Numbat;
    Rode eekhoorn;
    Grijze eekhoorn;
    Jachtluipaard;
    Struisvogel;
    Emoe;
    Gierzwaluw;
    Boerenzwaluw;
    Huiszwaluw;
    Oeverzwaluw
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [27]);
    }

  }

  // ============================================================
  // CORRECTIES VOOR LANGZAAM BEWEGENDE DIEREN
  // ============================================================

  for (const naam of `
    Jachtluipaard;
    Gaffelbok;
    Slechtvalk;
    Springbok;
    Struisvogel;
    Paard;
    Zeilvis;
    Makohaai;
    Gewone dolfijn
  `.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [30]);
    }

  }

  // ============================================================
  // AANVULLENDE SYNONIEMEN
  // ============================================================

  const synoniemenDeel6 = [

    ["Reuzenmiereneter", "Myrmecophaga tridactyla"],

    ["Aardwolf", "Proteles cristata"],

    ["Numbat", "Myrmecobius fasciatus"],

    ["Mierenegel", "Tachyglossus aculeatus"],

    ["Europese haas", "Lepus europaeus"],

    ["Canadese bever", "Castor canadensis"],

    ["Bever", "Castor fiber"],

    ["Kattenvlo", "Ctenocephalides felis"],

    ["Hondenvlo", "Ctenocephalides canis"],

    ["Mensenvlo", "Pulex irritans"],

    ["Noordkromp", "Arctica islandica"],

    ["Groenlandse haai", "Somniosus microcephalus"],

    ["Groenlandse walvis", "Balaena mysticetus"],

    ["Amerikaanse kreeft", "Homarus americanus"],

    ["Brughagedis", "Sphenodon punctatus"],

    ["Brughagedis", "Tuatara"],

    ["Rode zee-egel", "Mesocentrotus franciscanus"],

    ["Mesocentrotus franciscanus",
      "Strongylocentrotus franciscanus"],

    ["Gierzwaluw", "Apus apus"],

    ["Alpengierzwaluw", "Tachymarptis melba"],

    ["Tachymarptis melba", "Apus melba"],

    ["Boerenzwaluw", "Hirundo rustica"],

    ["Huiszwaluw", "Delichon urbicum"],

    ["Oeverzwaluw", "Riparia riparia"],

    ["Kruisspin", "Araneus diadematus"],

    ["Wespspin", "Argiope bruennichi"],

    ["Wespspin", "Tijgerspin"],

    ["Wijngaardslak", "Helix pomatia"],

    ["Segrijnslak", "Cornu aspersum"],

    ["Cornu aspersum", "Helix aspersa"],

    ["Lissachatina fulica", "Achatina fulica"],

    ["Lissachatina reticulata", "Achatina reticulata"],

    ["Caucasotachea vindobonensis",
      "Cepaea vindobonensis"],

    ["Pet itella bleheri".replace(" ", ""),
      "Hemigrammus bleheri"],

    ["Petitella rhodostoma",
      "Hemigrammus rhodostomus"],

    ["Puntius titteya", "Pethia titteya"],

    ["Coloradokever", "Leptinotarsa decemlineata"],

    ["Neontetra", "Paracheirodon innesi"],

    ["Neontetra", "Neon tetra"],

    ["Kardinaaltetra", "Paracheirodon axelrodi"],

    ["Chorthippus parallelus",
      "Pseudochorthippus parallelus"],

    ["Conocephalus discolor", "Conocephalus fuscus"],

    ["Crossaster papposus", "Solaster papposus"],

    ["Rhinolophus rouxi", "Rhinolophus rouxii"],

    ["Ficedula hodgsoni", "Ficedula hodgsonii"],

    ["Gomphocerus sibiricus", "Aeropus sibiricus"],

    ["Echiichthys vipera", "Trachinus vipera"],

    ["Armen nachtzwaluw", "Phalaenoptilus nuttallii"],

    ["Portugese oorlogsschip", "Portugees oorlogsschip"],

    ["Portugees oorlogsschip", "Physalia physalis"]

  ];

  for (const [hoofdnaam, alternatief] of synoniemenDeel6) {

    verenigSynoniemenDeel2(
      hoofdnaam,
      alternatief
    );

  }

  // ============================================================
  // EXTRA LEEFTIJDSCONTROLE
  // ============================================================

  // Voor vraag 44 worden dieren van uiteenlopende
  // leeftijden niet willekeurig toegevoegd.
  //
  // Als spelrichtlijn gebruiken we vooral dieren
  // die ongeveer 40 jaar of ouder kunnen worden.
  // Uitzonderlijke individuele leeftijden worden
  // niet automatisch als soortkenmerk beschouwd.

  const leeftijdCorrectiesDeel6 = [
    "Huismuis",
    "Bruine rat",
    "Zwarte rat",
    "Hamster",
    "Goudhamster",
    "Dwerghamster",
    "Egel",
    "Europese mol",
    "Dwergmuis",
    "Bosmuis",
    "Veldmuis",
    "Aardmuis",
    "Fruitvlieg",
    "Huisvlieg",
    "Mug"
  ];

  for (const naam of leeftijdCorrectiesDeel6) {

    verwijderKoppeling(naam, [44]);

  }

  // ============================================================
  // VEILIGE CORRECTIES VAN EERDERE DELEN
  // ============================================================

  // Uitgestorven soorten krijgen geen nieuwe
  // koppelingen aan actuele gedragsvragen.

  for (const record of [...dieren.values()]) {

    if (!record.vragen.has(43)) continue;

    for (const nummer of [
      27,28,29,30,34,35,40,41,44
    ]) {

      // Historische eigenschappen worden hier niet
      // verwijderd: de vraag kan ook op uitgestorven
      // dieren van toepassing zijn.
      //
      // Wel worden dergelijke records uitgesloten
      // van bovenstaande automatische uitbreiding.

    }

  }

  // Bekende uitgestorven soorten.

  const uitgestorvenCorrectiesDeel6 = [
    "Oophaga speciosa",
    "Hypselotriton wolterstorffi",
    "Melomys rubicola",
    "Psephotellus pulcherrimus",
    "Conilurus albipes",
    "Macrotis leucura",
    "Lagorchestes asomatus",
    "Lagorchestes leporides",
    "Onychogalea lunata",
    "Potorous platyops"
  ];

  for (const naam of uitgestorvenCorrectiesDeel6) {

    const record = zoekEen(naam);

    if (!record) continue;

    voegKoppelingToe(record, 43, 90);

    verwijderKoppeling(
      naam,
      [3,5,6,8,12,13,23,24,25,26,27,31,32,37,38,39,46]
    );

  }

  // ============================================================
  // EXTRA CONTROLETESTS - DEEL 6
  // ============================================================

  const extraGedragTestsDeel6 = [

    // Insecten eten

    [15, "Aardvarken", true],
    [15, "Reuzenmiereneter", true],
    [15, "Numbat", true],
    [15, "Gierzwaluw", true],
    [15, "Boerenzwaluw", true],
    [15, "Kruisspin", true],
    [15, "Grootoorvos", true],
    [15, "Koala", false],
    [15, "Giraffe", false],

    // Planten eten

    [16, "Koala", true],
    [16, "Reuzenpanda", true],
    [16, "Giraffe", true],
    [16, "Edelhert", true],
    [16, "Capibara", true],
    [16, "Groene leguaan", true],
    [16, "Doejong", true],
    [16, "Graskarper", true],
    [16, "Coloradokever", true],
    [16, "Leeuw", false],
    [16, "Tijger", false],
    [16, "Orka", false],

    // Andere dieren eten

    [17, "Leeuw", true],
    [17, "Tijger", true],
    [17, "Orka", true],
    [17, "Kruisspin", true],
    [17, "Koningspython", true],
    [17, "Numbat", true],
    [17, "Koala", false],

    // Nachtactieve dieren

    [27, "Egel", true],
    [27, "Kerkuil", true],
    [27, "Bosuil", true],
    [27, "Vingerdier", true],
    [27, "Fennek", true],
    [27, "Tasmaanse duivel", true],
    [27, "Nachtzwaluw", true],
    [27, "Stokstaartje", false],
    [27, "Numbat", false],

    // Winterslaap

    [28, "Egel", true],
    [28, "Alpenmarmot", true],
    [28, "Hazelmuis", true],
    [28, "Relmuis", true],
    [28, "Bruine beer", true],
    [28, "Myotis lucifugus", true],
    [28, "Cheirogaleus medius", true],
    [28, "Rendier", false],
    [28, "Wolf", false],
    [28, "Koala", false],

    // Hoge snelheid

    [29, "Jachtluipaard", true],
    [29, "Slechtvalk", true],
    [29, "Gaffelbok", true],
    [29, "Struisvogel", true],
    [29, "Zeilvis", true],
    [29, "Makohaai", true],

    // Langzame dieren

    [30, "Drievingerige luiaard", true],
    [30, "Wijngaardslak", true],
    [30, "Griekse landschildpad", true],
    [30, "Aldabra-reuzenschildpad", true],
    [30, "Gewone zeester", true],
    [30, "Jachtluipaard", false],

    // Springen

    [34, "Springbok", true],
    [34, "Rode reuzenkangoeroe", true],
    [34, "Konijn", true],
    [34, "Europese haas", true],
    [34, "Kattenvlo", true],
    [34, "Locusta migratoria", true],

    // Klimmen

    [35, "Koala", true],
    [35, "Rode eekhoorn", true],
    [35, "Luipaard", true],
    [35, "Boommarter", true],
    [35, "Gekko gecko", true],
    [35, "Alpensteenbok", true],

    // Groepsleven

    [40, "Leeuw", true],
    [40, "Wolf", true],
    [40, "Stokstaartje", true],
    [40, "Capibara", true],
    [40, "Orka", true],
    [40, "Atlantische haring", true],
    [40, "Neontetra", true],
    [40, "Gewone zebra", true],
    [40, "Chimpansee", true],

    // Nesten bouwen

    [41, "Rode eekhoorn", true],
    [41, "Egel", true],
    [41, "Chimpansee", true],
    [41, "Borneose orang-oetan", true],
    [41, "Gewone wesp", true],
    [41, "Philetairus socius", true],
    [41, "Ploceus cucullatus", true],
    [41, "Koekoek", false],

    // Hoge leeftijd

    [44, "Groenlandse haai", true],
    [44, "Groenlandse walvis", true],
    [44, "Afrikaanse savanneolifant", true],
    [44, "Aldabra-reuzenschildpad", true],
    [44, "Noordkromp", true],
    [44, "Hyacintara", true],
    [44, "Brughagedis", true],
    [44, "Huismuis", false],
    [44, "Goudhamster", false],

    // Giftige dieren

    [45, "Zwarte mamba", true],
    [45, "Binnenlandse taipan", true],
    [45, "Phyllobates terribilis", true],
    [45, "Vuursalamander", true],
    [45, "Hapalochlaena lunulata", true],
    [45, "Chironex fleckeri", true],
    [45, "Synanceia verrucosa", true],
    [45, "Portugees oorlogsschip", true],
    [45, "Koningspython", false],
    [45, "Korenslang", false],
    [45, "Luipaardgekko", false],

    // Uitgestorven dieren

    [43, "Oophaga speciosa", true],
    [43, "Melomys rubicola", true],
    [43, "Psephotellus pulcherrimus", true]

  ];

  // ============================================================
  // VOORTGANG NA DEEL 6
  // ============================================================

  const voortgangNaDeel6 =
    volledigeVoortgangV92();

  const gedragsVragenDeel6 = [
    15,16,17,27,28,29,30,
    34,35,40,41,44,45
  ];

  const rapportGedragDeel6 =
    voortgangNaDeel6.filter(
      vraag => gedragsVragenDeel6.includes(
        vraag.vraag
      )
    );

  const tussentijdsRapportDeel6 = {

    versie: VERSIE,

    dierrecordsBijStart:
      beginAantalDieren,

    dierrecordsNu:
      dieren.size,

    bruikbareDierrecords:
      [...dieren.values()].filter(
        record => record.vragen.size > 0
      ).length,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    verwijderdeKoppelingen,

    automatischeGedragKoppelingen:
      automatischeGedragKoppelingenDeel6,

    conflictenBijToevoegen:
      conflictenBijToevoegen.length,

    ontbrekendeKoppelingen:
      ontbrekendeKoppelingen.length,

    vragenMet1000Antwoorden:
      voortgangNaDeel6.filter(
        vraag => vraag.streefdoelBereikt
      ).length,

    ontbrekendTotStreefdoel:
      voortgangNaDeel6.reduce(
        (som, vraag) => som + vraag.tekort,
        0
      ),

    voortgangPercentage:
      Number(
        (
          voortgangNaDeel6.reduce(
            (som, vraag) =>
              som + Math.min(
                vraag.nieuweAntwoorden,
                1000
              ),
            0
          ) / 50000 * 100
        ).toFixed(2)
      )

  };

  console.group(
    "QuizBallon V9.2 - Aanvulling 2 - Deel 6"
  );

  console.table(
    tussentijdsRapportDeel6
  );

  console.table(
    rapportGedragDeel6
  );

  console.table(
    voortgangNaDeel6
  );

  console.groupEnd();

  // ============================================================
  // EINDE AANVULLING 2 - DEEL 6
  // HET BESTAND NOG NIET AFSLUITEN
  // DEEL 7 KOMT HIERONDER
  // ============================================================
   // ============================================================
  // QUIZBALLON V9.2 - AANVULLING 2 - DEEL 7
  // HUISDIEREN, BOERDERIJDIEREN EN DIERENTUINEN
  // ============================================================

  function gehoudenDierenDeel7(
    tekst,
    vragen,
    punten = 80
  ) {

    groep(
      tekst,
      [...new Set([...vragen, 50])],
      punten
    );

  }

  // ============================================================
  // ALGEMENE HUISDIEREN
  // ============================================================

  gehoudenDierenDeel7(`
    Hond;
    Kat;
    Konijn;
    Cavia;
    Hamster;
    Goudhamster;
    Russische dwerghamster;
    Chinese dwerghamster;
    Roborovskihamster;
    Campbells dwerghamster;
    Gerbil;
    Mongoolse gerbil;
    Chinchilla;
    Degoe;
    Tamme rat;
    Tamme muis;
    Fret;
    Grasparkiet;
    Valkparkiet;
    Kanarie;
    Zebravink;
    Japanse meeuw;
    Gouldamadine;
    Agapornis;
    Goudvis;
    Guppy;
    Platy;
    Molly;
    Zwaarddrager;
    Neontetra;
    Kardinaaltetra;
    Siamese kempvis;
    Luipaardgekko;
    Baardagame;
    Korenslang;
    Koningspython;
    Axolotl;
    Griekse landschildpad
  `, [8], 30);

  // ============================================================
  // HONDENRASSEN - HERDERSHONDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Duitse herder=Duitse herdershond;
    Mechelse herder=Mechelse herdershond;
    Tervuerense herder;
    Groenendaeler;
    Laekense herder;
    Hollandse herder;
    Schapendoes;
    Saarlooswolfhond;
    Tsjechoslowaakse wolfhond;
    Bordercollie=Border collie;
    Bearded collie;
    Schotse collie;
    Langharige collie;
    Kortharige collie;
    Shetland sheepdog=Sheltie;
    Australian shepherd;
    Miniature American shepherd;
    Australian cattle dog;
    Australian stumpy tail cattle dog;
    Australian kelpie;
    Welsh corgi pembroke;
    Welsh corgi cardigan;
    Old English sheepdog=Bobtail;
    Beauc eron;
    Briard;
    Picardische herder;
    Pyreneese herdershond;
    Catalaanse herder;
    Portugese herdershond;
    Bergamasco;
    Maremma;
    Komondor;
    Kuvasz;
    Puli;
    Pumi;
    Mudi;
    Poolse laaglandherder;
    Tatrahond;
    Kroatische herdershond;
    Slowaakse cuvac;
    Roemeense Mioritic;
    Roemeense Karpatische herder;
    Zuid-Russische owcharka;
    Kaukasische owcharka;
    Centraal-Aziatische owcharka;
    Witte Zwitserse herder;
    Boheemse herder;
    Laplandse herder;
    IJslandse hond;
    Noorse buhund;
    Finse lappenhond;
    Zweedse vallhund;
    Lancashire heeler;
    Schipperke
  `, [8], 70);

  gehoudenDierenDeel7(
    "Beauceron",
    [8],
    75
  );

  // ============================================================
  // HONDENRASSEN - RETRIEVERS EN SPANIËLS
  // ============================================================

  gehoudenDierenDeel7(`
    Labrador retriever=Labrador;
    Golden retriever;
    Flatcoated retriever;
    Curly coated retriever;
    Chesapeake Bay retriever;
    Nova Scotia duck tolling retriever=Toller;
    Engelse cockerspaniël;
    Amerikaanse cockerspaniël;
    Engelse springerspaniël;
    Welsh springerspaniël;
    Fieldspaniël;
    Sussexspaniël;
    Clumberspaniël;
    Ierse waterspaniël;
    Amerikaanse waterspaniël;
    Boykin spaniel;
    Nederlandse kooikerhondje=Kooikerhondje;
    Wetterhoun;
    Stabijhoun=Friese stabij;
    Lagotto romagnolo;
    Spaanse waterhond;
    Portugese waterhond;
    Barbet;
    Franse spaniël;
    Picardische spaniël;
    Blauwe Picardische spaniël;
    Pont-Audemerspaniël;
    Epagneul breton;
    Duitse wachtelhond
  `, [8], 70);

  // ============================================================
  // HONDENRASSEN - TERRIËRS
  // ============================================================

  gehoudenDierenDeel7(`
    Jackrussellterriër=Jack Russell;
    Parsonrussellterriër;
    Yorkshireterriër=Yorkshire terrier;
    West Highland white terrier=Westie;
    Schotse terriër;
    Cairnterriër;
    Norwichterriër;
    Norfolkterriër;
    Borderterriër;
    Ierse terriër;
    Welshterriër;
    Airedaleterriër;
    Lakelandterriër;
    Bedlingtonterriër;
    Dandiedinmontterriër;
    Skye terrier;
    Sealyhamterriër;
    Ceskyterriër;
    Kerry blue terrier;
    Irish soft coated wheaten terrier;
    Glen of Imaal terrier;
    Australische terriër;
    Australian silky terrier;
    Duitse jachtterriër;
    Braziliaanse terriër;
    Japanse terriër;
    Manchesterterriër;
    Engelse toyterriër;
    Amerikaanse haarloze terriër;
    Rat terrier;
    Toy fox terrier;
    Gladharige foxterriër;
    Draadharige foxterriër;
    Bullterriër;
    Miniatuurbullterriër;
    Staffordshire bullterriër;
    Amerikaanse Staffordshireterriër;
    Bostonterriër;
    Patterdaleterriër;
    Teddy Roosevelt terrier
  `, [8], 75);

  // ============================================================
  // HONDENRASSEN - GEZELSCHAPSHONDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Chihuahua;
    Mopshond;
    Franse bulldog;
    Engelse bulldog;
    Shih tzu;
    Lhasa apso;
    Maltezer;
    Bichon frisé;
    Havanezer;
    Bolognezer;
    Coton de Tuléar;
    Leeuwhondje;
    Papillon=Vlinderhondje;
    Phalène;
    Pekinees;
    Japanse chin;
    Cavalier King Charles spaniël;
    King Charles spaniël;
    Tibetaanse spaniël;
    Tibetaanse terriër;
    Chinese naakthond;
    Griffon bruxellois;
    Griffon belge;
    Petit brabançon;
    Toypoedel;
    Dwergpoedel;
    Middenslagpoedel;
    Koningspoedel=Grote poedel;
    Russische toy;
    Praagse rattler;
    Kromfohrländer;
    Affenpinscher;
    Löwchen;
    Dwergkees=Pomeriaan;
    Duitse keeshond;
    Volpino italiano
  `, [8], 65);

  // ============================================================
  // HONDENRASSEN - SPITSEN EN SLEDEHONDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Siberische husky;
    Alaska-malamute;
    Alaska husky;
    Samojeed;
    Groenlandse hond;
    Canadese eskimohond;
    Chinook;
    Akita inu;
    Amerikaanse akita;
    Shiba inu;
    Hokkaido;
    Shikoku;
    Kishu;
    Kai ken;
    Japanse spits;
    Chowchow;
    Eurasier;
    Keeshond;
    Finse spits;
    Noorse elandhond;
    Zwarte Noorse elandhond;
    Noorse lundehund;
    Karelische berenhond;
    Jämthund;
    Norrbottenspets;
    Oost-Siberische laika;
    West-Siberische laika;
    Russisch-Europese laika;
    Jakoetische laika;
    Thai bangkaew dog;
    Koreaanse jindo;
    Basenji;
    Kanaänhond;
    Taiwan dog;
    Mexicaanse naakthond;
    Peruaanse naakthond
  `, [8], 80);

  // ============================================================
  // HONDENRASSEN - GROTE HONDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Duitse dog=Deense dog;
    Sint-bernard;
    Berner sennenhond;
    Grote Zwitserse sennenhond;
    Appenzeller sennenhond;
    Entlebucher sennenhond;
    Newfoundlander;
    Landseer;
    Leonberger;
    Pyreneese berghond;
    Rottweiler;
    Dobermann;
    Boxer;
    Bullmastiff;
    Engelse mastiff;
    Mastino napoletano;
    Bordeauxdog;
    Cane corso;
    Dogo argentino;
    Fila brasileiro;
    Boerboel;
    Tibetaanse mastiff;
    Spaanse mastiff;
    Pyreneese mastiff;
    Broholmer;
    Hovawart;
    Duitse pinscher;
    Dwergpinscher;
    Oostenrijkse pinscher;
    Riesenschnauzer;
    Middenslagschnauzer;
    Dwergschnauzer;
    Zwarte Russische terriër;
    Shar-pei;
    Tosa;
    Presa canario;
    Dogo canario;
    Ca de bou;
    Alano español;
    Kangal;
    Akbash;
    Anatolische herder;
    Tornjak;
    Sarplaninac;
    Estrelaberghond;
    Rafeiro do Alentejo;
    Cão de Castro Laboreiro;
    Cão de Gado Transmontano
  `, [8], 80);

  // ============================================================
  // HONDENRASSEN - WINDHONDEN EN JACHTHONDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Greyhound;
    Whippet;
    Italiaans windhondje;
    Afghaanse windhond;
    Saluki;
    Sloughi;
    Azawakh;
    Barzoi;
    Ierse wolfshond;
    Schotse deerhound;
    Spaanse galgo;
    Hongaarse agar;
    Poolse windhond;
    Pharaohond;
    Podenco ibicenco;
    Podenco canario;
    Portugese podengo;
    Cirneco dell Etna;
    Rhodesian ridgeback;
    Thai ridgeback;
    Dalmatier=Dalmatiër;
    Beagle;
    Basset hound;
    Bloedhond;
    Otterhound;
    Harrier;
    Engelse foxhound;
    Amerikaanse foxhound;
    Black and tan coonhound;
    Bluetick coonhound;
    Redbone coonhound;
    Treeing walker coonhound;
    Plott hound;
    American English coonhound;
    Finse brak;
    Hamiltonstövare;
    Schillerstövare;
    Smålandsstövare;
    Drever;
    Noorse dunker;
    Haldenstøver;
    Hygenhund;
    Estlandse brak;
    Poolse brak;
    Slowaakse kopov;
    Oostenrijkse brandlbrak;
    Tiroler brak;
    Beierse bergzweethond;
    Hannoveraanse zweethond;
    Alpenländische dachsbracke;
    Zwitserse lopende hond;
    Kleine Zwitserse lopende hond;
    Grand bleu de Gascogne;
    Petit bleu de Gascogne;
    Basset bleu de Gascogne;
    Basset fauve de Bretagne;
    Grand basset griffon vendéen;
    Petit basset griffon vendéen;
    Griffon nivernais;
    Grand griffon vendéen;
    Briquet griffon vendéen;
    Porcelaine;
    Ariégeois;
    Poitevin;
    Billy;
    Franse driekleurige hond;
    Franse wit-zwarte hond;
    Franse wit-oranje hond;
    Teckel=Dashond;
    Dwergteckel;
    Kaninchenteckel;
    Engelse setter;
    Ierse setter;
    Gordon setter;
    Ierse rood-witte setter;
    Pointer;
    Weimaraner;
    Duitse staande korthaar;
    Duitse staande draadhaar;
    Duitse staande langhaar;
    Duitse staande stekelhaar;
    Vizsla;
    Draadharige vizsla;
    Bracco italiano;
    Spinone italiano;
    Grote münsterländer;
    Kleine münsterländer;
    Griffon korthals;
    Pudelpointer;
    Cesky fousek;
    Drentsche patrijshond;
    Braque français;
    Braque d Auvergne;
    Braque du Bourbonnais;
    Braque de l Ariège;
    Braque Saint-Germain;
    Portugese pointer;
    Pachón navarro;
    Perdiguero de Burgos
  `, [8], 85);

  // ============================================================
  // KATTENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Europese korthaar;
    Britse korthaar;
    Britse langhaar;
    Maine coon;
    Ragdoll;
    Noorse boskat;
    Siberische kat;
    Neva masquerade;
    Pers;
    Exotic shorthair;
    Heilige birmaan;
    Siamese kat;
    Thaise kat;
    Balinees;
    Oosters korthaar;
    Oosters langhaar;
    Abessijn;
    Somali;
    Burmees;
    Burmilla;
    Tonkanees;
    Bombaykat;
    Blauwe Rus;
    Chartreux;
    Korat;
    Nebelung;
    Bengaal;
    Savannahkat;
    Ocicat;
    Egyptische mau;
    Toyger;
    Serengeti;
    Singapura;
    Sokoke;
    Sphynx;
    Donskoy;
    Peterbald;
    Devon rex;
    Cornish rex;
    German rex;
    Selkirk rex;
    LaPerm;
    Ural rex;
    American curl;
    American shorthair;
    American wirehair;
    American bobtail;
    Japanese bobtail;
    Kurilian bobtail;
    Mekong bobtail;
    Pixiebob;
    Manx;
    Cymric;
    Scottish fold;
    Scottish straight;
    Highland fold;
    Highland straight;
    Munchkin;
    Napoleonkat=Minuet;
    Turkish angora=Turkse angora;
    Turkse van;
    Khao manee;
    Havana brown;
    Snowshoe;
    Ragamuffin;
    Australian mist;
    Asian shorthair;
    Tiffanie;
    York chocolate;
    Chantilly-Tiffany;
    Californian spangled;
    Ceylonkat;
    Aegeïsche kat;
    Dragon Li;
    Kanaani;
    Arabian mau;
    Thai lilac;
    Brazilian shorthair;
    Chausie;
    Highlander;
    Lykoi;
    Kinkalow;
    Bambino;
    Dwelf;
    Oekraïense levkoy;
    Tennessee rex;
    Ojos azules;
    German longhair
  `, [8], 80);

  // ============================================================
  // KONIJNENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Vlaamse reus;
    Duitse reus;
    Britse reus;
    Franse hangoor;
    Nederlandse hangoordwerg;
    Engelse hangoor;
    Duitse hangoor;
    Meissner hangoor;
    Mini lop;
    Holland lop;
    Dwarf lop;
    American fuzzy lop;
    Kleurdwerg;
    Poolkonijn;
    Hermelijnkonijn;
    Leeuwenkopkonijn;
    Rexkonijn;
    Mini rex;
    Satijnkonijn;
    Mini satijn;
    Angorakonijn;
    Engelse angora;
    Franse angora;
    Duitse angora;
    Reuzenangora;
    Satijnangora;
    Teddy dwerg;
    Teddy widder;
    Nieuw-Zeelander;
    Californian;
    Witte Nieuw-Zeelander;
    Rode Nieuw-Zeelander;
    Blauwe Wener;
    Witte Wener;
    Zwarte Wener;
    Grijze Wener;
    Blauwe van Beveren;
    Van Beveren;
    Hollander;
    Japanner;
    Rijnlander;
    Lotharinger;
    Groot lotharinger;
    Klein lotharinger;
    Papillonkonijn;
    Engelse vlinder;
    Franse vlinder;
    Belgische haas;
    Alaska;
    Havannakonijn;
    Thrianta;
    Deilenaar;
    Sallander;
    Gouwenaar;
    Marterkonijn;
    Zilvervoskonijn;
    Groot zilver;
    Klein zilver;
    Champagne d Argent;
    Crème d Argent;
    Argenté brun;
    Argenté bleu;
    Argenté noir;
    Argenté champagne;
    Fauve de Bourgogne;
    Palominokonijn;
    Lilackonijn;
    Cinnamonkonijn;
    American rabbit;
    American sable;
    Florida white;
    Blanc de Hotot;
    Dwarf Hotot;
    Chinchillakonijn;
    Grote chinchilla;
    Kleine chinchilla;
    Standard chinchilla;
    American chinchilla;
    Giant chinchilla;
    Tan rabbit;
    Britannia petite;
    Sussexkonijn;
    Cashmere lop;
    Mini cashmere lop;
    Sable point;
    Continental giant;
    Schwarzgrannen;
    Zwartbleskonijn
  `, [8], 85);

  // ============================================================
  // CAVIARASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Gladhaarcavia;
    Borstelcavia=Abessijncavia;
    Peruviaanse cavia;
    Sheltiecavia;
    Coronet;
    Texelcavia;
    Merinocavia;
    Alpacacavia;
    Rexcavia;
    US-teddy;
    CH-teddy;
    Lunkaryacavia;
    Skinnycavia;
    Baldwincavia;
    Engelse crested;
    Amerikaanse crested;
    Satijncavia;
    Engelse korthaar;
    Amerikaanse korthaarcavia;
    Himalayacavia;
    Californische cavia;
    Ridgebackcavia;
    Curlycavia
  `, [8], 85);

  // ============================================================
  // HUISDIERVOGELS - PAPEGAAIEN
  // ============================================================

  gehoudenDierenDeel7(`
    Blauwgele ara;
    Geelvleugelara;
    Groenvleugelara;
    Hyacintara;
    Soldatenara;
    Ara severus;
    Ara rubrogenys;
    Ara glaucogularis;
    Ara ambiguus;
    Primolius maracana;
    Primolius auricollis;
    Primolius couloni;
    Diopsittaca nobilis;
    Grijze roodstaartpapegaai;
    Timnehpapegaai;
    Bonte boertje=Poicephalus senegalus;
    Poicephalus meyeri;
    Poicephalus rufiventris;
    Poicephalus gulielmi;
    Poicephalus cryptoxanthus;
    Poicephalus robustus;
    Amazona aestiva;
    Amazona amazonica;
    Amazona autumnalis;
    Amazona ochrocephala;
    Amazona oratrix;
    Amazona auropalliata;
    Amazona albifrons;
    Amazona farinosa;
    Amazona ventralis;
    Amazona viridigenalis;
    Amazona finschi;
    Amazona xantholora;
    Amazona festiva;
    Amazona pretrei;
    Amazona dufresniana;
    Pionus menstruus;
    Pionus maximiliani;
    Pionus chalcopterus;
    Pionus senilis;
    Pionites melanocephalus;
    Pionites leucogaster;
    Edelpapegaai;
    Eclectus roratus;
    Zwartkopcaique;
    Witbuikcaique;
    Geelkuifkaketoe;
    Kleine geelkuifkaketoe;
    Witkuifkaketoe;
    Molukkenkaketoe;
    Goffinskaketoe;
    Ducorpskaketoe;
    Roze kaketoe;
    Inka-kaketoe;
    Palmkaketoe;
    Helmkaketoe;
    Slanksnavelkaketoe;
    Cacatua sanguinea;
    Calyptorhynchus banksii;
    Zanda funerea;
    Zanda latirostris
  `, [8], 80);

  // ============================================================
  // HUISDIERVOGELS - PARKIETEN
  // ============================================================

  gehoudenDierenDeel7(`
    Grasparkiet=Melopsittacus undulatus;
    Valkparkiet=Nymphicus hollandicus;
    Halsbandparkiet=Psittacula krameri;
    Grote alexanderparkiet=Psittacula eupatria;
    Pruimkopparkiet=Psittacula cyanocephala;
    Grijskopparkiet=Psittacula himalayana;
    Derbyanparkiet=Psittacula derbiana;
    Rozeborstparkiet=Psittacula alexandri;
    Monniksparkiet=Myiopsitta monachus;
    Zonparkiet=Aratinga solstitialis;
    Jendayaparkiet=Aratinga jandaya;
    Nandayparkiet=Aratinga nenday;
    Goudparkiet=Guaruba guarouba;
    Blauwkroonparkiet=Thectocercus acuticaudatus;
    Groene aratinga=Psittacara holochlorus;
    Roodmaskerparkiet=Psittacara erythrogenys;
    Witoogparkiet=Psittacara leucophthalmus;
    Pyrrhura molinae;
    Pyrrhura frontalis;
    Pyrrhura picta;
    Pyrrhura perlata;
    Pyrrhura lepida;
    Pyrrhura cruentata;
    Pyrrhura rupicola;
    Pyrrhura melanura;
    Pyrrhura egregia;
    Pyrrhura leucotis;
    Pyrrhura emma;
    Forpus coelestis;
    Forpus passerinus;
    Forpus conspicillatus;
    Forpus xanthopterygius;
    Forpus cyanopygius;
    Forpus modestus;
    Forpus crassirostris;
    Agapornis roseicollis;
    Agapornis personatus;
    Agapornis fischeri;
    Agapornis lilianae;
    Agapornis nigrigenis;
    Agapornis taranta;
    Agapornis pullarius;
    Bourkeparkiet=Neopsephotus bourkii;
    Turquoiseparkiet=Neophema pulchella;
    Splendidparkiet=Neophema splendida;
    Elegantparkiet=Neophema elegans;
    Blauwvleugelparkiet=Neophema chrysostoma;
    Roodrugparkiet=Psephotus haematonotus;
    Veelkleurenparkiet=Psephotellus varius;
    Hoodedparkiet=Psephotellus dissimilis;
    Gouden schouderparkiet=Psephotellus chrysopterygius;
    Pennantrosella=Platycercus elegans;
    Gewone rosella=Platycercus eximius;
    Geelbuikrosella=Platycercus caledonicus;
    Noordelijke rosella=Platycercus venustus;
    Bleekkoprosella=Platycercus adscitus;
    Stanleyrosella=Platycercus icterotis;
    Koningsparkiet=Alisterus scapularis;
    Roodvleugelparkiet=Aprosmictus erythropterus;
    Bergparkiet=Polytelis anthopeplus;
    Barrabandparkiet=Polytelis swainsonii;
    Prinses van Walesparkiet=Polytelis alexandrae;
    Regentparkiet;
    Kakariki;
    Cyanoramphus novaezelandiae;
    Cyanoramphus auriceps;
    Regenbooglori;
    Trichoglossus rubritorquis;
    Trichoglossus chlorolepidotus;
    Lori van de blauwe bergen;
    Lorius garrulus;
    Lorius lory;
    Lorius domicella;
    Eos bornea;
    Eos reticulata;
    Eos squamata;
    Chalcopsitta atra;
    Chalcopsitta duivenbodei;
    Chalcopsitta scintillata;
    Pseudeos fuscata;
    Glossopsitta concinna;
    Vini australis
  `, [8], 85);

  // ============================================================
  // HUISDIERVOGELS - VINKEN EN VOLIÈREVOGELS
  // ============================================================

  gehoudenDierenDeel7(`
    Kanarie;
    Zebravink=Taeniopygia guttata;
    Japanse meeuw;
    Gouldamadine=Chloebia gouldiae;
    Diamantamadine=Stagonopleura guttata;
    Stagonopleura bella;
    Stagonopleura oculata;
    Bichenowastrilde=Stizoptera bichenovii;
    Poephila acuticauda;
    Poephila cincta;
    Poephila personata;
    Neochmia temporalis;
    Neochmia phaeton;
    Neochmia modesta;
    Emblema pictum;
    Papegaaiamadine;
    Erythrura trichroa;
    Erythrura psittacea;
    Erythrura cyaneovirens;
    Erythrura coloria;
    Erythrura prasina;
    Erythrura hyperythra;
    Javaanse rijstvogel=Padda oryzivora;
    Timor-rijstvogel=Padda fuscata;
    Lonchura striata;
    Lonchura punctulata;
    Lonchura maja;
    Lonchura malacca;
    Lonchura atricapilla;
    Lonchura ferruginosa;
    Lonchura leucogastra;
    Lonchura pallida;
    Lonchura quinticolor;
    Lonchura castaneothorax;
    Lonchura flaviprymna;
    Lonchura spectabilis;
    Lonchura nevermanni;
    Lonchura caniceps;
    Lonchura grandis;
    Lonchura tristissima;
    Lonchura cucullata;
    Spermestes bicolor;
    Spermestes fringilloides;
    Sint-helenafazantje=Estrilda astrild;
    Estrilda troglodytes;
    Estrilda melpoda;
    Estrilda caerulescens;
    Estrilda paludicola;
    Estrilda nonnula;
    Estrilda atricapilla;
    Estrilda perreini;
    Estrilda erythronotos;
    Uraeginthus bengalus;
    Uraeginthus angolensis;
    Uraeginthus cyanocephalus;
    Granatina granatina;
    Granatina ianthinogaster;
    Amandava amandava;
    Amandava subflava;
    Lagonosticta senegala;
    Lagonosticta rubricata;
    Lagonosticta rara;
    Lagonosticta rufopicta;
    Lagonosticta rhodopareia;
    Pytilia melba;
    Pytilia phoenicoptera;
    Pytilia lineata;
    Pytilia afra;
    Amadina fasciata;
    Amadina erythrocephala;
    Euschistospiza dybowskii;
    Euschistospiza cinereovinacea;
    Roodkopamadine;
    Bandvink;
    Mozambiquesijs=Crithagra mozambica;
    Grijze edelzanger=Crithagra leucopygia;
    Crithagra atrogularis;
    Crithagra sulphurata
  `, [8], 85);

  // ============================================================
  // AQUARIUMVISSEN - LEVENDBARENDE TANDKARPERS
  // ============================================================

  gehoudenDierenDeel7(`
    Guppy=Poecilia reticulata;
    Endlerguppy=Poecilia wingei;
    Poecilia obscura;
    Zwarte molly;
    Poecilia sphenops;
    Poecilia latipinna;
    Poecilia velifera;
    Poecilia mexicana;
    Poecilia salvatoris;
    Poecilia caucana;
    Poecilia picta;
    Poecilia parae;
    Poecilia vivipara;
    Poecilia gillii;
    Poecilia latipunctata;
    Platy=Xiphophorus maculatus;
    Xiphophorus variatus;
    Zwaarddrager=Xiphophorus hellerii;
    Xiphophorus montezumae;
    Xiphophorus nezahualcoyotl;
    Xiphophorus cortezi;
    Xiphophorus nigrensis;
    Xiphophorus multilineatus;
    Xiphophorus pygmaeus;
    Xiphophorus birchmanni;
    Xiphophorus malinche;
    Xiphophorus xiphidium;
    Xiphophorus evelynae;
    Xiphophorus alvarezi;
    Xiphophorus clemenciae;
    Xiphophorus mixei;
    Xiphophorus signum;
    Heterandria formosa;
    Limia nigrofasciata;
    Limia perugiae;
    Limia melanogaster;
    Limia vittata;
    Limia tridens;
    Limia zonata;
    Limia dominicensis;
    Limia sulphurophila;
    Girardinus metallicus;
    Girardinus falcatus;
    Girardinus uninotatus;
    Girardinus microdactylus;
    Phalloceros caudimaculatus;
    Phalloceros harpagos;
    Phalloptychus januarius;
    Neoheterandria elegans;
    Micropoecilia branneri;
    Alfaro cultratus;
    Alfaro huberi;
    Belonesox belizanus;
    Priapella intermedia;
    Priapella compressa;
    Xenotoca eiseni;
    Xenotoca doadrioi;
    Xenotoca variata;
    Ameca splendens;
    Ilyodon whitei;
    Ilyodon furcidens;
    Goodea atripinnis;
    Skiffia multipunctata;
    Skiffia francesae;
    Skiffia lermae;
    Chapalichthys encaustus;
    Characodon lateralis;
    Characodon audax;
    Allotoca dugesii;
    Ataeniobius toweri;
    Zoogoneticus tequila;
    Zoogoneticus quitzeoensis
  `, [1,8,14], 85);

  // ============================================================
  // AQUARIUMVISSEN - TETRA'S
  // ============================================================

  gehoudenDierenDeel7(`
    Neontetra=Paracheirodon innesi;
    Kardinaaltetra=Paracheirodon axelrodi;
    Groene neontetra=Paracheirodon simulans;
    Zwarte neon=Hyphessobrycon herbertaxelrodi;
    Rode rio=Hyphessobrycon flammeus;
    Citroentetra=Hyphessobrycon pulchripinnis;
    Serpaetetra=Hyphessobrycon eques;
    Rode fantoomtetra=Hyphessobrycon sweglesi;
    Zwarte fantoomtetra=Hyphessobrycon megalopterus;
    Hyphessobrycon bentosi;
    Hyphessobrycon rosaceus;
    Hyphessobrycon amandae;
    Hyphessobrycon columbianus;
    Hyphessobrycon anisitsi;
    Hyphessobrycon erythrostigma;
    Hyphessobrycon socolofi;
    Hyphessobrycon loretoensis;
    Hyphessobrycon elachys;
    Hyphessobrycon heliacus;
    Hyphessobrycon peugeoti;
    Hyphessobrycon wadai;
    Hyphessobrycon vilmae;
    Hyphessobrycon agulha;
    Hyphessobrycon heterorhabdus;
    Hyphessobrycon metae;
    Hyphessobrycon nigricinctus;
    Hyphessobrycon cyanotaenia;
    Hyphessobrycon copelandi;
    Hyphessobrycon pyrrhonotus;
    Hyphessobrycon stegemanni;
    Hyphessobrycon takasei;
    Vuurneon=Hemigrammus erythrozonus;
    Hemigrammus ocellifer;
    Hemigrammus pulcher;
    Hemigrammus marginatus;
    Hemigrammus unilineatus;
    Hemigrammus caudovittatus;
    Hemigrammus gracilis;
    Hemigrammus rodwayi;
    Hemigrammus stictus;
    Hemigrammus lunatus;
    Hemigrammus ulreyi;
    Hemigrammus levis;
    Hemigrammus bellottii;
    Roodkopzalm=Petitella bleheri;
    Petitella rhodostoma;
    Petitella georgiae;
    Pristella maxillaris;
    Zwarte tetra=Gymnocorymbus ternetzi;
    Gymnocorymbus thayeri;
    Keizertetra=Nematobrycon palmeri;
    Nematobrycon lacortei;
    Inpaichthys kerri;
    Phenacogrammus interruptus;
    Phenacogrammus aurantiacus;
    Phenacogrammus major;
    Alestopetersius caudalis;
    Alestopetersius brichardi;
    Alestopetersius smykalai;
    Brycinus longipinnis;
    Brycinus nurse;
    Diamantzalm=Moenkhausia pittieri;
    Moenkhausia sanctaefilomenae;
    Moenkhausia oligolepis;
    Moenkhausia costae;
    Moenkhausia dichroura;
    Moenkhausia intermedia;
    Moenkhausia collettii;
    Moenkhausia agnesae;
    Aphyocharax anisitsi;
    Aphyocharax rathbuni;
    Aphyocharax paraguayensis;
    Aphyocharax alburnus;
    Hasemania nana;
    Thayeria boehlkei;
    Thayeria obliqua;
    Thayeria ifati;
    Copella arnoldi;
    Copella nattereri;
    Copella callolepis;
    Copella compta;
    Copeina guttata;
    Pyrrhulina brevis;
    Pyrrhulina semifasciata;
    Pyrrhulina australis;
    Nannostomus beckfordi;
    Nannostomus marginatus;
    Nannostomus eques;
    Nannostomus unifasciatus;
    Nannostomus mortenthaleri;
    Nannostomus rubrocaudatus;
    Nannostomus trifasciatus;
    Nannostomus digrammus;
    Nannostomus harrisoni;
    Nannostomus anduzei;
    Nannostomus espei;
    Carnegiella strigata;
    Carnegiella marthae;
    Carnegiella myersi;
    Gasteropelecus sternicla;
    Gasteropelecus levis;
    Thoracocharax stellatus
  `, [1,8,14], 85);

  // ============================================================
  // AQUARIUMVISSEN - BARBELEN EN RASBORA'S
  // ============================================================

  gehoudenDierenDeel7(`
    Zebravis=Danio rerio;
    Danio albolineatus;
    Danio choprae;
    Danio dangila;
    Danio kyathit;
    Danio nigrofasciatus;
    Danio aesculapii;
    Danio tinwini;
    Danio margaritatus;
    Danio erythromicron;
    Danio feegradei;
    Danio quagga;
    Devario aequipinnatus;
    Devario malabaricus;
    Devario devario;
    Devario pathirana;
    Devario sondhii;
    Devario regina;
    Devario maetaengensis;
    Devario chrysotaeniatus;
    Devario annandalei;
    Microdevario kubotai;
    Microdevario nana;
    Microdevario gatesi;
    Trigonostigma heteromorpha;
    Trigonostigma espei;
    Trigonostigma hengeli;
    Trigonostigma somphongsi;
    Boraras brigittae;
    Boraras maculatus;
    Boraras merah;
    Boraras micros;
    Boraras naevus;
    Boraras urophthalmoides;
    Rasbora trilineata;
    Rasbora borapetensis;
    Rasbora dorsiocellata;
    Rasbora einthovenii;
    Rasbora caudimaculata;
    Rasbora dusonensis;
    Rasbora lateristriata;
    Rasbora paviana;
    Rasbora sumatrana;
    Rasbora argyrotaenia;
    Rasbora elegans;
    Rasbora kalochroma;
    Rasbora pauciperforata;
    Rasbora rubrodorsalis;
    Rasbora steineri;
    Rasbora vulcanus;
    Brevibora dorsiocellata;
    Sundadanio axelrodi;
    Sundadanio goblinus;
    Celestichthys margaritatus;
    Tijgerbarbeel=Puntigrus tetrazona;
    Puntigrus anchisporus;
    Puntigrus partipentazona;
    Puntigrus pulcher;
    Puntigrus navjotsodhii;
    Puntius titteya;
    Puntius semifasciolatus;
    Puntius vittatus;
    Puntius dorsalis;
    Puntius sophore;
    Pethia conchonius;
    Pethia nigrofasciata;
    Pethia padamya;
    Pethia ticto;
    Pethia gelius;
    Pethia cumingii;
    Pethia reval;
    Pethia stoliczkana;
    Pethia erythromycter;
    Pethia phutunio;
    Pethia narayani;
    Desmopuntius pentazona;
    Desmopuntius hexazona;
    Desmopuntius johorensis;
    Desmopuntius trifasciatus;
    Desmopuntius rhomboocellatus;
    Dawkinsia filamentosa;
    Dawkinsia assimilis;
    Dawkinsia arulius;
    Dawkinsia tambraparniei;
    Dawkinsia rohani;
    Sahyadria denisonii;
    Sahyadria chalakkudiensis;
    Barbonymus schwanenfeldii;
    Barbonymus altus;
    Balantiocheilos melanopterus;
    Garra flavatra;
    Garra rufa;
    Garra cambodgiensis;
    Garra gotyla;
    Crossocheilus oblongus;
    Crossocheilus langei;
    Epalzeorhynchos bicolor;
    Epalzeorhynchos frenatum;
    Epalzeorhynchos kalopterum;
    Epalzeorhynchos munense;
    Gyrinocheilus aymonieri;
    Labeo chrysophekadion;
    Tanichthys albonubes;
    Tanichthys micagemmae;
    Tanichthys thacbaensis
  `, [1,8,14], 85);

  // ============================================================
  // AQUARIUMVISSEN - GOURAMI'S EN KEMPVISSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Siamese kempvis=Betta splendens;
    Betta imbellis;
    Betta smaragdina;
    Betta mahachaiensis;
    Betta siamorientalis;
    Betta stiktos;
    Betta coccina;
    Betta brownorum;
    Betta burdigala;
    Betta persephone;
    Betta rutilans;
    Betta uberis;
    Betta tussyae;
    Betta livida;
    Betta miniopinna;
    Betta albimarginata;
    Betta channoides;
    Betta foerschi;
    Betta mandor;
    Betta strohi;
    Betta rubra;
    Betta dennisyongi;
    Betta picta;
    Betta simplex;
    Betta falx;
    Betta taeniata;
    Betta edithae;
    Betta akarensis;
    Betta anabatoides;
    Betta balunga;
    Betta chini;
    Betta ibanorum;
    Betta pugnax;
    Betta fusca;
    Betta pulchra;
    Betta schalleri;
    Betta pi;
    Betta waseri;
    Betta macrostoma;
    Betta unimaculata;
    Betta ocellata;
    Betta patoti;
    Betta pallifina;
    Betta compuncta;
    Betta ideii;
    Betta gladiator;
    Dwerggoerami=Trichogaster lalius;
    Honinggoerami=Trichogaster chuna;
    Trichogaster fasciata;
    Trichogaster labiosa;
    Trichopodus trichopterus;
    Trichopodus leerii;
    Trichopodus microlepis;
    Trichopodus pectoralis;
    Trichopodus cantoris;
    Trichopsis pumila;
    Trichopsis vittata;
    Trichopsis schalleri;
    Chocoladegoerami=Sphaerichthys osphromenoides;
    Sphaerichthys vaillanti;
    Sphaerichthys selatanensis;
    Sphaerichthys acrostoma;
    Parasphaerichthys ocellatus;
    Parasphaerichthys lineatus;
    Ctenops nobilis;
    Kussende goerami=Helostoma temminckii;
    Reuzengoerami=Osphronemus goramy;
    Osphronemus exodon;
    Osphronemus laticlavius;
    Paradijsvis=Macropodus opercularis;
    Macropodus ocellatus;
    Macropodus spechti;
    Macropodus erythropterus;
    Pseudosphromenus cupanus;
    Pseudosphromenus dayi;
    Malpulutta kretseri;
    Parosphromenus deissneri;
    Parosphromenus harveyi;
    Parosphromenus linkei;
    Parosphromenus nagyi;
    Parosphromenus bintan;
    Parosphromenus filamentosus;
    Parosphromenus paludicola;
    Parosphromenus phoenicurus;
    Parosphromenus quindecim;
    Parosphromenus sumatranus;
    Parosphromenus tweediei;
    Parosphromenus ornaticauda
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMVISSEN - AMERIKAANSE CICHLIDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Maanvis=Pterophyllum scalare;
    Pterophyllum altum;
    Pterophyllum leopoldi;
    Symphysodon discus;
    Symphysodon aequifasciatus;
    Symphysodon tarzoo;
    Oscarvis=Astronotus ocellatus;
    Astronotus crassipinnis;
    Mikrogeophagus ramirezi;
    Mikrogeophagus altispinosus;
    Apistogramma agassizii;
    Apistogramma cacatuoides;
    Apistogramma borellii;
    Apistogramma trifasciata;
    Apistogramma macmasteri;
    Apistogramma viejita;
    Apistogramma nijsseni;
    Apistogramma panduro;
    Apistogramma hongsloi;
    Apistogramma baenschi;
    Apistogramma bitaeniata;
    Apistogramma eremnopyge;
    Apistogramma elizabethae;
    Apistogramma diplotaenia;
    Apistogramma iniridae;
    Apistogramma gibbiceps;
    Apistogramma pertensis;
    Apistogramma uaupesi;
    Apistogramma paucisquamis;
    Apistogramma rotpunkt;
    Apistogramma resticulosa;
    Apistogramma eunotus;
    Apistogramma cruzi;
    Apistogramma caetei;
    Apistogramma commbrae;
    Apistogramma inconspicua;
    Apistogramma linkei;
    Apistogramma taeniata;
    Apistogramma steindachneri;
    Apistogramma ortegai;
    Apistogramma barlowi;
    Apistogramma allpahuayo;
    Apistogramma atahualpa;
    Apistogramma paulmuelleri;
    Apistogramma playayacu;
    Apistogramma rositae;
    Apistogramma huascar;
    Apistogramma norberti;
    Apistogramma luelingi;
    Apistogramma similis;
    Apistogramma cinilabra;
    Apistogramma pantalone;
    Apistogramma rubrolineata;
    Apistogramma tucurui;
    Apistogramma kullanderi;
    Apistogramma gephyra;
    Apistogrammoides pucallpaensis;
    Dicrossus filamentosus;
    Dicrossus maculatus;
    Dicrossus gladicauda;
    Dicrossus foirni;
    Taeniacara candidi;
    Nannacara anomala;
    Nannacara aureocephalus;
    Ivanacara adoketa;
    Ivanacara bimaculata;
    Laetacara curviceps;
    Laetacara dorsigera;
    Laetacara araguaiae;
    Laetacara thayeri;
    Laetacara fulvipinnis;
    Cleithracara maronii;
    Aequidens tetramerus;
    Aequidens diadema;
    Andinoacara pulcher;
    Andinoacara rivulatus;
    Andinoacara stalsbergi;
    Andinoacara biseriatus;
    Andinoacara latifrons;
    Andinoacara coeruleopunctatus;
    Geophagus altifrons;
    Geophagus surinamensis;
    Geophagus winemilleri;
    Geophagus dicrozoster;
    Geophagus abalios;
    Geophagus proximus;
    Geophagus sveni;
    Geophagus brasiliensis;
    Geophagus steindachneri;
    Geophagus pellegrini;
    Satanoperca jurupari;
    Satanoperca leucosticta;
    Satanoperca daemon;
    Satanoperca acuticeps;
    Satanoperca lilith;
    Gymnogeophagus balzanii;
    Gymnogeophagus gymnogenys;
    Gymnogeophagus rhabdotus;
    Gymnogeophagus meridionalis;
    Heros severus;
    Heros efasciatus;
    Heros notatus;
    Heros spurius;
    Uaru amphiacanthoides;
    Uaru fernandezyepezi;
    Mesonauta festivus;
    Mesonauta insignis;
    Mesonauta egregius;
    Mesonauta mirificus;
    Hypselecara temporalis;
    Hypselecara coryphaenoides;
    Cichlasoma dimerus;
    Cichlasoma amazonarum;
    Amatitlania nigrofasciata;
    Amatitlania siquia;
    Amatitlania kanna;
    Cryptoheros spilurus;
    Cryptoheros cutteri;
    Cryptoheros chetumalensis;
    Thorichthys meeki;
    Thorichthys maculipinnis;
    Thorichthys aureus;
    Thorichthys helleri;
    Thorichthys pasionis;
    Rocio octofasciata;
    Rocio gemmata;
    Herotilapia multispinosa;
    Hypsophrys nicaraguensis;
    Hypsophrys nematopus;
    Archocentrus centrarchus;
    Parachromis managuensis;
    Parachromis dovii;
    Parachromis motaguensis;
    Parachromis friedrichsthalii;
    Parachromis loisellei;
    Amphilophus citrinellus;
    Amphilophus labiatus;
    Amphilophus trimaculatus;
    Vieja melanura;
    Vieja maculicauda;
    Vieja bifasciata;
    Vieja fenestrata;
    Vieja hartwegi;
    Vieja zonata;
    Vieja breidohri;
    Crenicichla regani;
    Crenicichla compressiceps;
    Crenicichla notophthalmus;
    Crenicichla wallacii;
    Crenicichla saxatilis;
    Crenicichla lepidota;
    Crenicichla lenticulata;
    Crenicichla lugubris;
    Crenicichla strigata
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMVISSEN - AFRIKAANSE CICHLIDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Labidochromis caeruleus;
    Labidochromis hongi;
    Labidochromis chisumulae;
    Labidochromis freibergi;
    Labidochromis pallidus;
    Labidochromis textilis;
    Labidochromis gigas;
    Labidochromis strigatus;
    Chindongo demasoni;
    Chindongo saulosi;
    Chindongo socolofi;
    Chindongo elongatus;
    Chindongo flavus;
    Chindongo polit;
    Chindongo bellicosus;
    Chindongo heteropictus;
    Chindongo minutus;
    Chindongo longior;
    Pseudotropheus crabro;
    Pseudotropheus acei;
    Pseudotropheus cyaneus;
    Pseudotropheus interruptus;
    Pseudotropheus livingstonii;
    Pseudotropheus perspicax;
    Maylandia zebra;
    Maylandia estherae;
    Maylandia lombardoi;
    Maylandia callainos;
    Maylandia greshakei;
    Maylandia fainzilberi;
    Maylandia mbenjii;
    Maylandia aurora;
    Maylandia barlowi;
    Maylandia hajomaylandi;
    Maylandia emmiltos;
    Maylandia cyneusmarginata;
    Maylandia flavifemina;
    Maylandia pulpican;
    Melanochromis auratus;
    Melanochromis chipokae;
    Melanochromis melanopterus;
    Melanochromis vermivorus;
    Melanochromis lepidiadaptes;
    Pseudotropheus johannii;
    Pseudotropheus cyaneorhabdos;
    Iodotropheus sprengerae;
    Labeotropheus fuelleborni;
    Labeotropheus trewavasae;
    Labeotropheus artatorostris;
    Cynotilapia afra;
    Cynotilapia zebroides;
    Cynotilapia aurifrons;
    Cynotilapia pulpican;
    Aulonocara baenschi;
    Aulonocara stuartgranti;
    Aulonocara jacobfreibergi;
    Aulonocara nyassae;
    Aulonocara hansbaenschi;
    Aulonocara maylandi;
    Aulonocara kandeensis;
    Aulonocara hueseri;
    Aulonocara rostratum;
    Aulonocara gertrudae;
    Aulonocara steveni;
    Aulonocara trematocephalum;
    Protomelas taeniolatus;
    Protomelas fenestratus;
    Protomelas similis;
    Protomelas spilonotus;
    Protomelas annectens;
    Protomelas kirkii;
    Copadichromis borleyi;
    Copadichromis azureus;
    Copadichromis chrysonotus;
    Copadichromis trewavasae;
    Copadichromis virginalis;
    Otopharynx lithobates;
    Otopharynx tetrastigma;
    Otopharynx heterodon;
    Sciaenochromis fryeri;
    Sciaenochromis ahli;
    Dimidiochromis compressiceps;
    Dimidiochromis strigatus;
    Nimbochromis livingstonii;
    Nimbochromis venustus;
    Nimbochromis polystigma;
    Nimbochromis linni;
    Nimbochromis fuscotaeniatus;
    Fossorochromis rostratus;
    Buccochromis nototaenia;
    Buccochromis rhoadesii;
    Tyrannochromis macrostoma;
    Tyrannochromis nigriventer;
    Placidochromis electra;
    Placidochromis phenochilus;
    Placidochromis milomo;
    Lethrinops albus;
    Lethrinops marginatus;
    Lethrinops lethrinus;
    Frontosa=Cyphotilapia frontosa;
    Cyphotilapia gibberosa;
    Tropheus moorii;
    Tropheus duboisi;
    Tropheus brichardi;
    Tropheus polli;
    Tropheus annectens;
    Neolamprologus brichardi;
    Neolamprologus pulcher;
    Neolamprologus multifasciatus;
    Neolamprologus similis;
    Neolamprologus ocellatus;
    Neolamprologus brevis;
    Neolamprologus leleupi;
    Neolamprologus cylindricus;
    Neolamprologus tretocephalus;
    Neolamprologus sexfasciatus;
    Neolamprologus buescheri;
    Neolamprologus caudopunctatus;
    Neolamprologus gracilis;
    Neolamprologus marunguensis;
    Neolamprologus savoryi;
    Neolamprologus helianthus;
    Neolamprologus falcicula;
    Neolamprologus olivaceous;
    Neolamprologus mustax;
    Neolamprologus obscurus;
    Neolamprologus nigriventris;
    Lamprologus callipterus;
    Lamprologus ocellatus;
    Lamprologus signatus;
    Lamprologus kungweensis;
    Lamprologus ornatipinnis;
    Lamprologus meleagris;
    Lamprologus speciosus;
    Julidochromis ornatus;
    Julidochromis transcriptus;
    Julidochromis marlieri;
    Julidochromis regani;
    Julidochromis dickfeldi;
    Chalinochromis brichardi;
    Chalinochromis popelini;
    Altolamprologus calvus;
    Altolamprologus compressiceps;
    Altolamprologus fasciatus;
    Telmatochromis vittatus;
    Telmatochromis temporalis;
    Telmatochromis bifrenatus;
    Telmatochromis brichardi;
    Eretmodus cyanostictus;
    Spathodus erythrodon;
    Spathodus marlieri;
    Tanganicodus irsacae;
    Cyprichromis leptosoma;
    Cyprichromis microlepidotus;
    Cyprichromis pavo;
    Cyprichromis coloratus;
    Paracyprichromis nigripinnis;
    Paracyprichromis brieni;
    Xenotilapia flavipinnis;
    Xenotilapia spiloptera;
    Xenotilapia ochrogenys;
    Xenotilapia bathyphila;
    Xenotilapia papilio;
    Xenotilapia melanogenys;
    Enantiopus melanogenys;
    Ophthalmotilapia ventralis;
    Ophthalmotilapia nasuta;
    Ophthalmotilapia boops;
    Cyathopharynx furcifer;
    Cyathopharynx foae;
    Featherfin cichlide;
    Pelvicachromis pulcher;
    Pelvicachromis taeniatus;
    Pelvicachromis subocellatus;
    Pelvicachromis kribensis;
    Pelvicachromis sacrimontis;
    Pelvicachromis roloffi;
    Nanochromis transvestitus;
    Nanochromis parilus;
    Nanochromis splendens;
    Congochromis dimidiatus;
    Anomalochromis thomasi;
    Steatocranus casuarius;
    Steatocranus tinanti;
    Steatocranus gibbiceps
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMVISSEN - PANTSERMEERVALLEN
  // ============================================================

  gehoudenDierenDeel7(`
    Corydoras paleatus;
    Corydoras aeneus;
    Corydoras sterbai;
    Corydoras panda;
    Corydoras julii;
    Corydoras trilineatus;
    Corydoras leopardus;
    Corydoras punctatus;
    Corydoras agassizii;
    Corydoras ambiacus;
    Corydoras arcuatus;
    Corydoras atropersonatus;
    Corydoras axelrodi;
    Corydoras bondi;
    Corydoras brevirostris;
    Corydoras burgessi;
    Corydoras concolor;
    Corydoras copei;
    Corydoras davidsandsi;
    Corydoras duplicareus;
    Corydoras elegans;
    Corydoras eques;
    Corydoras evelynae;
    Corydoras flaveolus;
    Corydoras fowleri;
    Corydoras garbei;
    Corydoras geoffroy;
    Corydoras gossei;
    Corydoras griseus;
    Corydoras guapore;
    Corydoras habrosus;
    Corydoras haraldschultzi;
    Corydoras hastatus;
    Corydoras imitator;
    Corydoras incolicana;
    Corydoras kanei;
    Corydoras leucomelas;
    Corydoras longipinnis;
    Corydoras loxozonus;
    Corydoras maculifer;
    Corydoras melanistius;
    Corydoras melini;
    Corydoras metae;
    Corydoras multimaculatus;
    Corydoras nanus;
    Corydoras napoensis;
    Corydoras narcissus;
    Corydoras nattereri;
    Corydoras nijsseni;
    Corydoras ornatus;
    Corydoras orphnopterus;
    Corydoras osteocarus;
    Corydoras ourastigma;
    Corydoras pachycephalus;
    Corydoras pantanalensis;
    Corydoras pastazensis;
    Corydoras pinheiroi;
    Corydoras polystictus;
    Corydoras pulcher;
    Corydoras pygmaeus;
    Corydoras rabauti;
    Corydoras reticulatus;
    Corydoras robineae;
    Corydoras robustus;
    Corydoras schwartzi;
    Corydoras semiaquilus;
    Corydoras seussi;
    Corydoras similis;
    Corydoras simulatus;
    Corydoras sodalis;
    Corydoras solox;
    Corydoras spectabilis;
    Corydoras spilurus;
    Corydoras stenocephalus;
    Corydoras surinamensis;
    Corydoras treitlii;
    Corydoras undulatus;
    Corydoras virginiae;
    Corydoras weitzmani;
    Corydoras xinguensis;
    Corydoras zygatus;
    Scleromystax barbatus;
    Scleromystax macropterus;
    Scleromystax prionotos;
    Scleromystax salmacis;
    Aspidoras pauciradiatus;
    Aspidoras fuscoguttatus;
    Aspidoras albater;
    Aspidoras spilotus;
    Brochis splendens;
    Brochis multiradiatus;
    Brochis britskii;
    Hoplosternum littorale;
    Megalechis thoracata;
    Megalechis picta;
    Dianema longibarbis;
    Dianema urostriatum;
    Callichthys callichthys
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMVISSEN - HARNASMEERVALLEN
  // ============================================================

  gehoudenDierenDeel7(`
    Ancistrus cirrhosus;
    Ancistrus dolichopterus;
    Ancistrus temminckii;
    Ancistrus hoplogenys;
    Ancistrus claro;
    Ancistrus ranunculus;
    Ancistrus leucostictus;
    Ancistrus triradiatus;
    Ancistrus multispinis;
    Ancistrus tamboensis;
    Ancistrus gymnorhynchus;
    Ancistrus macrophthalmus;
    Hypancistrus zebra;
    Hypancistrus inspector;
    Hypancistrus contradens;
    Hypancistrus debilittera;
    Hypancistrus furunculus;
    Hypancistrus lunaorum;
    Hypancistrus margaritatus;
    Peckoltia vittata;
    Peckoltia compta;
    Peckoltia brevis;
    Peckoltia cavatica;
    Peckoltia oligospila;
    Peckoltia sabaji;
    Peckoltia vermiculata;
    Panaqolus maccus;
    Panaqolus albivermis;
    Panaqolus gnomus;
    Panaqolus nocturnus;
    Panaqolus purusiensis;
    Panaqolus tankei;
    Panaqolus changae;
    Panaque nigrolineatus;
    Panaque armbrusteri;
    Panaque cochliodon;
    Panaque suttonorum;
    Panaque schaeferi;
    Baryancistrus xanthellus;
    Baryancistrus chrysolomus;
    Baryancistrus demantoides;
    Baryancistrus beggini;
    Scobinancistrus aureatus;
    Scobinancistrus pariolispos;
    Acanthicus adonis;
    Acanthicus hystrix;
    Leporacanthicus galaxias;
    Leporacanthicus heterodon;
    Leporacanthicus joselimai;
    Leporacanthicus triactis;
    Pseudacanthicus leopardus;
    Pseudacanthicus spinosus;
    Pseudacanthicus serratus;
    Pseudacanthicus pitanga;
    Pseudacanthicus pirarara;
    Hypostomus plecostomus;
    Hypostomus punctatus;
    Hypostomus regani;
    Hypostomus ancistroides;
    Hypostomus commersoni;
    Hypostomus luteus;
    Pterygoplichthys gibbiceps;
    Pterygoplichthys pardalis;
    Pterygoplichthys disjunctivus;
    Pterygoplichthys joselimaianus;
    Pterygoplichthys multiradiatus;
    Pterygoplichthys anisitsi;
    Otocinclus affinis;
    Otocinclus vittatus;
    Otocinclus macrospilus;
    Otocinclus cocama;
    Otocinclus vestitus;
    Otocinclus huaorani;
    Otocinclus hoppei;
    Otocinclus flexilis;
    Otocinclus arnoldi;
    Otocinclus mimulus;
    Parotocinclus jumbo;
    Parotocinclus maculicauda;
    Parotocinclus haroldoi;
    Parotocinclus doceanus;
    Parotocinclus spilosoma;
    Farlowella acus;
    Farlowella vittata;
    Farlowella hahni;
    Farlowella amazonum;
    Farlowella nattereri;
    Sturisoma panamense;
    Sturisoma aureum;
    Sturisoma barbatum;
    Sturisomatichthys festivus;
    Sturisomatichthys leightoni;
    Rineloricaria lanceolata;
    Rineloricaria parva;
    Rineloricaria fallax;
    Rineloricaria microlepidogaster;
    Rineloricaria eigenmanni;
    Rineloricaria filamentosa;
    Hemiloricaria teffeana;
    Loricaria simillima;
    Loricaria cataphracta;
    Pseudohemiodon apithanos;
    Pseudohemiodon laticeps;
    Planiloricaria cryptodon;
    Lamontichthys filamentosus
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMVISSEN - MODDERKRUIPERS EN BOTIA'S
  // ============================================================

  gehoudenDierenDeel7(`
    Clownbotia=Chromobotia macracanthus;
    Botia striata;
    Botia almorhae;
    Botia histrionica;
    Botia kubotai;
    Botia rostrata;
    Botia dario;
    Botia lohachata;
    Botia udomritthiruji;
    Syncrossus helodes;
    Syncrossus hymenophysa;
    Syncrossus berdmorei;
    Syncrossus beauforti;
    Syncrossus reversa;
    Yasuhikotakia modesta;
    Yasuhikotakia morleti;
    Yasuhikotakia eos;
    Ambastaia sidthimunki;
    Ambastaia nigrolineata;
    Pangio kuhlii;
    Pangio semicincta;
    Pangio myersi;
    Pangio shelfordii;
    Pangio cuneovirgata;
    Pangio malayana;
    Pangio alternans;
    Pangio robiginosa;
    Pangio oblonga;
    Pangio anguillaris;
    Misgurnus anguillicaudatus;
    Misgurnus fossilis;
    Paramisgurnus dabryanus;
    Lepidocephalichthys guntea;
    Lepidocephalichthys thermalis;
    Acanthocobitis botia;
    Paracanthocobitis zonalternans;
    Paracanthocobitis rubidipinnis;
    Schistura balteata;
    Schistura beavani;
    Schistura corica;
    Schistura mahnerti;
    Schistura poculi;
    Schistura vinciguerrae;
    Mesonoemacheilus triangularis;
    Nemacheilus binotatus;
    Nemacheilus masyae;
    Nemacheilus selangoricus;
    Nemacheilus spiniferus;
    Sewellia lineolata;
    Sewellia elongata;
    Sewellia breviventralis;
    Sewellia speciosa;
    Beaufortia kweichowensis;
    Gastromyzon punctulatus;
    Gastromyzon scitulus;
    Gastromyzon zebrinus;
    Gastromyzon ocellatus;
    Gastromyzon stellatus;
    Gastromyzon viriosus;
    Gastromyzon ctenocephalus;
    Pseudogastromyzon cheni;
    Pseudogastromyzon myersi;
    Homaloptera orthogoniata;
    Homaloptera parclitella;
    Balitoropsis zollingeri
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMVISSEN - KILLIVISSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Aphyosemion australe;
    Aphyosemion striatum;
    Aphyosemion gabunense;
    Aphyosemion ogoense;
    Aphyosemion primigenium;
    Aphyosemion exigoideum;
    Aphyosemion punctatum;
    Aphyosemion cyanostictum;
    Aphyosemion elberti;
    Aphyosemion bitaeniatum;
    Aphyosemion bivittatum;
    Aphyosemion loennbergii;
    Aphyosemion volcanum;
    Aphyosemion calliurum;
    Aphyosemion ahli;
    Aphyosemion splendopleure;
    Fundulopanchax gardneri;
    Fundulopanchax nigerianus;
    Fundulopanchax amieti;
    Fundulopanchax sjostedti;
    Fundulopanchax filamentosus;
    Fundulopanchax deltaensis;
    Fundulopanchax fallax;
    Fundulopanchax gularis;
    Fundulopanchax walkeri;
    Fundulopanchax cinnamomeus;
    Fundulopanchax marmoratus;
    Fundulopanchax mirabilis;
    Fundulopanchax sjoestedti;
    Nothobranchius rachovii;
    Nothobranchius guentheri;
    Nothobranchius furzeri;
    Nothobranchius korthausae;
    Nothobranchius foerschi;
    Nothobranchius palmqvisti;
    Nothobranchius orthonotus;
    Nothobranchius eggersi;
    Nothobranchius kafuensis;
    Nothobranchius kilomberoensis;
    Nothobranchius luekei;
    Nothobranchius lucius;
    Nothobranchius rubripinnis;
    Nothobranchius hengstleri;
    Nothobranchius flammicomantis;
    Nothobranchius patrizii;
    Nothobranchius melanospilus;
    Nothobranchius neumanni;
    Nothobranchius jubbi;
    Nothobranchius pienaari;
    Nothobranchius wattersi;
    Nothobranchius kadleci;
    Nothobranchius kuhntae;
    Austrolebias nigripinnis;
    Austrolebias bellottii;
    Austrolebias affinis;
    Austrolebias alexandri;
    Austrolebias elongatus;
    Austrolebias luteoflammulatus;
    Austrolebias vazferreirai;
    Austrolebias gymnoventris;
    Austrolebias cheradophilus;
    Austrolebias wolterstorffi;
    Austrolebias prognathus;
    Simpsonichthys boitonei;
    Simpsonichthys santanae;
    Simpsonichthys parallelus;
    Hypsolebias magnificus;
    Hypsolebias fulminantis;
    Hypsolebias antenori;
    Hypsolebias sertanejo;
    Hypsolebias auratus;
    Spectrolebias semiocellatus;
    Spectrolebias filamentosus;
    Cynolebias porosus;
    Cynolebias griseus;
    Cynolebias microphthalmus;
    Epiplatys annulatus;
    Epiplatys dageti;
    Epiplatys sexfasciatus;
    Epiplatys fasciolatus;
    Epiplatys singa;
    Epiplatys chaperi;
    Epiplatys bifasciatus;
    Epiplatys huberi;
    Epiplatys olbrechtsi;
    Epiplatys roloffi;
    Epiplatys grahami;
    Aplocheilus lineatus;
    Aplocheilus panchax;
    Aplocheilus blockii;
    Aplocheilus dayi;
    Aplocheilus werneri;
    Aplocheilus kirchmayeri;
    Pachypanchax playfairii;
    Pachypanchax omalonotus;
    Pachypanchax sakaramyi;
    Pachypanchax arnoulti;
    Pachypanchax sparksorum;
    Oryzias latipes;
    Oryzias woworae;
    Oryzias javanicus;
    Oryzias dancena;
    Oryzias mekongensis;
    Oryzias minutillus;
    Oryzias nigrimas;
    Oryzias profundicola;
    Oryzias marmoratus;
    Oryzias celebensis
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMVISSEN - REGENBOOGVISSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Melanotaenia boesemani;
    Melanotaenia praecox;
    Melanotaenia lacustris;
    Melanotaenia trifasciata;
    Melanotaenia splendida;
    Melanotaenia australis;
    Melanotaenia fluviatilis;
    Melanotaenia duboulayi;
    Melanotaenia maccullochi;
    Melanotaenia nigrans;
    Melanotaenia sexlineata;
    Melanotaenia affinis;
    Melanotaenia goldiei;
    Melanotaenia herbertaxelrodi;
    Melanotaenia kamaka;
    Melanotaenia parva;
    Melanotaenia rubrivittata;
    Melanotaenia rubrostriata;
    Melanotaenia picta;
    Melanotaenia pimaensis;
    Melanotaenia patoti;
    Melanotaenia ogilbyi;
    Melanotaenia maylandi;
    Melanotaenia mubiensis;
    Melanotaenia misoolensis;
    Melanotaenia ajamaruensis;
    Melanotaenia angfa;
    Melanotaenia arfakensis;
    Melanotaenia boesemani;
    Melanotaenia caerulea;
    Melanotaenia catherinae;
    Melanotaenia eachamensis;
    Glossolepis incisus;
    Glossolepis wanamensis;
    Glossolepis pseudoincisus;
    Glossolepis multisquamata;
    Glossolepis ramuensis;
    Chilatherina bleheri;
    Chilatherina fasciata;
    Chilatherina alleni;
    Chilatherina axelrodi;
    Chilatherina campsi;
    Chilatherina lorentzii;
    Chilatherina sentaniensis;
    Iriatherina werneri;
    Pseudomugil furcatus;
    Pseudomugil gertrudae;
    Pseudomugil luminatus;
    Pseudomugil paskai;
    Pseudomugil signifer;
    Pseudomugil tenellus;
    Pseudomugil cyanodorsalis;
    Pseudomugil mellis;
    Pseudomugil inconspicuus;
    Pseudomugil paludicola;
    Pseudomugil reticulatus;
    Telmatherina ladigesi;
    Marosatherina ladigesi;
    Bedotia geayi;
    Bedotia madagascariensis;
    Rheocles vatosoa
  `, [1,8,14], 90);

  // ============================================================
  // AQUARIUMGARNALEN EN SLAKKEN
  // ============================================================

  gehoudenDierenDeel7(`
    Vuurgarnaal=Neocaridina davidi;
    Neocaridina palmata;
    Neocaridina zhangjiajiensis;
    Neocaridina denticulata;
    Amanogarnaal=Caridina multidentata;
    Caridina cantonensis;
    Caridina logemanni;
    Caridina mariae;
    Caridina serrata;
    Caridina babaulti;
    Caridina gracilirostris;
    Caridina dennerli;
    Caridina caerulea;
    Caridina woltereckae;
    Caridina spinata;
    Caridina striata;
    Caridina spongicola;
    Caridina masapi;
    Caridina loehae;
    Caridina lanceolata;
    Caridina lingkonae;
    Caridina glaubrechti;
    Caridina parvula;
    Caridina profundicola;
    Caridina ensifera;
    Atyopsis moluccensis;
    Atyopsis spinipes;
    Atya gabonensis;
    Atya scabra;
    Macrobrachium lanchesteri;
    Macrobrachium dayanum;
    Macrobrachium assamense;
    Cambarellus patzcuarensis;
    Cambarellus diminutus;
    Cambarellus shufeldtii;
    Cambarellus puer;
    Cambarellus texanus;
    Cambarellus montezumae;
    Cherax quadricarinatus;
    Cherax destructor;
    Cherax boesemani;
    Cherax pulcher;
    Cherax peknyi;
    Cherax snowden;
    Cherax holthuisi;
    Anentome helena;
    Neritina natalensis;
    Vittina natalensis;
    Vittina semiconica;
    Vittina waigiensis;
    Clithon corona;
    Clithon diadema;
    Clithon sowerbianum;
    Neritina pulligera;
    Neritina turrita;
    Septaria porcellana;
    Tylomelania patriarchalis;
    Tylomelania towutensis;
    Tylomelania gemmifera;
    Tylomelania perfecta;
    Tylomelania sarasinorum;
    Tylomelania zemis;
    Tylomelania towutica;
    Tylomelania palicolarum;
    Brotia pagodula;
    Brotia herculea;
    Brotia armata;
    Filopaludina martensi;
    Viviparus viviparus;
    Melanoides tuberculata;
    Tarebia granifera;
    Faunus ater;
    Planorbella duryi;
    Planorbarius corneus;
    Physella acuta;
    Lymnaea stagnalis;
    Marisa cornuarietis
  `, [1,8], 90);

  // ============================================================
  // ZEEAQUARIUMVISSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Amphiprion ocellaris;
    Amphiprion percula;
    Amphiprion clarkii;
    Amphiprion bicinctus;
    Amphiprion sebae;
    Amphiprion polymnus;
    Amphiprion frenatus;
    Amphiprion melanopus;
    Amphiprion akallopisos;
    Amphiprion perideraion;
    Amphiprion sandaracinos;
    Amphiprion akindynos;
    Amphiprion chrysopterus;
    Amphiprion chrysogaster;
    Amphiprion allardi;
    Amphiprion omanensis;
    Amphiprion tricinctus;
    Amphiprion latezonatus;
    Amphiprion nigripes;
    Amphiprion rubrocinctus;
    Amphiprion ephippium;
    Amphiprion biaculeatus;
    Gele doktersvis;
    Blauwe doktersvis;
    Zebrasoma xanthurum;
    Zebrasoma velifer;
    Zebrasoma desjardinii;
    Zebrasoma scopas;
    Zebrasoma rostratum;
    Acanthurus achilles;
    Acanthurus leucosternon;
    Acanthurus japonicus;
    Acanthurus nigricans;
    Acanthurus sohal;
    Acanthurus lineatus;
    Acanthurus olivaceus;
    Acanthurus pyroferus;
    Acanthurus coeruleus;
    Acanthurus tristis;
    Ctenochaetus strigosus;
    Ctenochaetus tominiensis;
    Ctenochaetus hawaiiensis;
    Ctenochaetus truncatus;
    Ctenochaetus binotatus;
    Naso lituratus;
    Naso elegans;
    Naso unicornis;
    Naso vlamingii;
    Centropyge loricula;
    Centropyge bispinosa;
    Centropyge eibli;
    Centropyge potteri;
    Centropyge heraldi;
    Centropyge bicolor;
    Centropyge acanthops;
    Centropyge argi;
    Centropyge aurantonotus;
    Centropyge flavissima;
    Centropyge tibicen;
    Centropyge vrolikii;
    Centropyge multicolor;
    Centropyge nox;
    Centropyge corallicola;
    Centropyge ferrugata;
    Centropyge interrupta;
    Pomacanthus imperator;
    Pomacanthus annularis;
    Pomacanthus semicirculatus;
    Pomacanthus sexstriatus;
    Pomacanthus xanthometopon;
    Pomacanthus navarchus;
    Pomacanthus maculosus;
    Pomacanthus asfur;
    Pomacanthus chrysurus;
    Pomacanthus paru;
    Pomacanthus arcuatus;
    Pygoplites diacanthus;
    Paracentropyge multifasciata;
    Paracentropyge venusta;
    Genicanthus lamarck;
    Genicanthus melanospilos;
    Genicanthus watanabei;
    Genicanthus bellus;
    Genicanthus caudovittatus;
    Chaetodon auriga;
    Chaetodon lunula;
    Chaetodon vagabundus;
    Chaetodon semilarvatus;
    Chaetodon kleinii;
    Chaetodon citrinellus;
    Chaetodon melannotus;
    Chaetodon punctatofasciatus;
    Chaetodon mertensii;
    Chaetodon xanthurus;
    Chaetodon falcula;
    Chaetodon ulietensis;
    Chaetodon decussatus;
    Chelmon rostratus;
    Heniochus acuminatus;
    Heniochus diphreutes;
    Gramma loreto;
    Gramma melacara;
    Pseudochromis fridmani;
    Pseudochromis paccagnellae;
    Pseudochromis flavivertex;
    Pseudochromis diadema;
    Pseudochromis sankeyi;
    Pseudochromis aldabraensis;
    Pseudochromis porphyreus;
    Pterapogon kauderni;
    Sphaeramia nematoptera;
    Sphaeramia orbicularis;
    Zoramia leptacantha;
    Ostorhinchus cyanosoma;
    Ostorhinchus compressus;
    Ostorhinchus aureus;
    Apogon maculatus;
    Apogon imberbis;
    Chromis viridis;
    Chromis atripectoralis;
    Chromis cyanea;
    Chromis retrofasciata;
    Dascyllus aruanus;
    Dascyllus melanurus;
    Dascyllus trimaculatus;
    Dascyllus reticulatus;
    Chrysiptera cyanea;
    Chrysiptera parasema;
    Chrysiptera hemicyanea;
    Chrysiptera talboti;
    Chrysiptera springeri;
    Chrysiptera rollandi;
    Chrysiptera starcki;
    Pomacentrus alleni;
    Pomacentrus moluccensis;
    Pomacentrus caeruleus;
    Pomacentrus auriventris;
    Pomacentrus coelestis;
    Nemateleotris magnifica;
    Nemateleotris decora;
    Nemateleotris helfrichi;
    Ptereleotris evides;
    Ptereleotris heteroptera;
    Ptereleotris microlepis;
    Cryptocentrus cinctus;
    Cryptocentrus leptocephalus;
    Cryptocentrus fasciatus;
    Cryptocentrus melanopus;
    Amblyeleotris guttata;
    Amblyeleotris randalli;
    Amblyeleotris wheeleri;
    Amblyeleotris aurora;
    Amblyeleotris steinitzi;
    Stonogobiops nematodes;
    Stonogobiops yasha;
    Stonogobiops xanthorhinica;
    Valenciennea puellaris;
    Valenciennea strigata;
    Valenciennea sexguttata;
    Valenciennea wardii;
    Valenciennea longipinnis;
    Gobiodon okinawae;
    Gobiodon histrio;
    Gobiodon citrinus;
    Gobiodon acicularis;
    Elacatinus oceanops;
    Elacatinus evelynae;
    Elacatinus figaro;
    Eviota pellucida;
    Eviota nigriventris;
    Trimma cana;
    Trimma rubromaculatum;
    Synchiropus splendidus;
    Synchiropus picturatus;
    Synchiropus ocellatus;
    Synchiropus stellatus;
    Salarias fasciatus;
    Salarias ramosus;
    Ecsenius bicolor;
    Ecsenius midas;
    Ecsenius stigmatura;
    Ecsenius pictus;
    Ecsenius lineatus;
    Ecsenius bicoloris;
    Meiacanthus grammistes;
    Meiacanthus atrodorsalis;
    Meiacanthus oualanensis;
    Cirrhilabrus solorensis;
    Cirrhilabrus exquisitus;
    Cirrhilabrus rubrisquamis;
    Cirrhilabrus lubbocki;
    Cirrhilabrus lineatus;
    Cirrhilabrus rhomboidalis;
    Cirrhilabrus jordani;
    Cirrhilabrus scottorum;
    Cirrhilabrus cyanopleura;
    Paracheilinus mccoskeri;
    Paracheilinus carpenteri;
    Paracheilinus filamentosus;
    Paracheilinus flavianalis;
    Halichoeres chrysus;
    Halichoeres melanurus;
    Halichoeres iridis;
    Halichoeres hortulanus;
    Halichoeres ornatissimus;
    Halichoeres leucoxanthus;
    Pseudocheilinus hexataenia;
    Pseudocheilinus tetrataenia;
    Pseudocheilinops ataenia;
    Macropharyngodon meleagris;
    Macropharyngodon bipartitus;
    Macropharyngodon negrosensis;
    Macropharyngodon ornatus;
    Anampses meleagrides;
    Anampses neoguinaicus;
    Anampses femininus;
    Labroides dimidiatus
  `, [1,8,11,14], 90);

  // ============================================================
  // BOERDERIJDIEREN - ALGEMEEN
  // ============================================================

  gehoudenDierenDeel7(`
    Koe;
    Rund;
    Schaap;
    Geit;
    Varken;
    Paard;
    Pony;
    Ezel;
    Muildier;
    Muilezel;
    Kip;
    Kalkoen;
    Eend;
    Gans;
    Parelhoen;
    Kwartel;
    Konijn;
    Alpaca;
    Lama;
    Yak;
    Waterbuffel;
    Struisvogel;
    Emoe;
    Nandoe
  `, [13], 35);

  // ============================================================
  // RUNDERENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Holstein-Friesian;
    Fries-Hollands rund;
    Roodbont rund;
    Zwartbont rund;
    Maas-Rijn-IJsselrund=MRIJ;
    Groninger blaarkop;
    Lakenvelder rund;
    Brandrood rund;
    Witrik;
    Fries roodbontrund;
    Verbeterd roodbont;
    Belgisch witblauw;
    West-Vlaams rood;
    Oost-Vlaams witrood;
    Kempens rund;
    Aberdeen Angus;
    Red Angus;
    Hereford;
    Polled Hereford;
    Shorthorn;
    Beef Shorthorn;
    Dairy Shorthorn;
    Jersey;
    Guernsey;
    Ayrshire;
    Brown Swiss;
    Schwyzer;
    Simmental;
    Fleckvieh;
    Montbéliarde;
    Normandisch rund;
    Charolais;
    Limousin;
    Blonde d Aquitaine;
    Salers;
    Aubrac;
    Gasconne;
    Bazadaise;
    Parthenaise;
    Maine-Anjou;
    Rouge des Prés;
    Armoricaine;
    Bretonne pie noir;
    Pie rouge des plaines;
    Tarentaise;
    Abondance;
    Vosgienne;
    Villard-de-Lans;
    Ferrandaise;
    Bordelaise;
    Lourdaise;
    Béarnaise;
    Mirandaise;
    Nantaise;
    Froment du Léon;
    Schotse hooglander;
    Galloway;
    Belted Galloway;
    White Galloway;
    Dexter;
    Kerry;
    Irish moiled;
    British white;
    White park;
    Longhorn;
    Lincoln red;
    Red poll;
    Sussex;
    South Devon;
    North Devon;
    Welsh black;
    Gloucester;
    Shetlandrund;
    Vaynol;
    Chillinghamrund;
    Luing;
    Beefalo;
    Texas longhorn;
    Santa Gertrudis;
    Beefmaster;
    Brangus;
    Braford;
    Brahman;
    Senepol;
    Droughtmaster;
    Belmont red;
    Murray grey;
    Australian lowline;
    Speckle park;
    Canadian Highland;
    Chianina;
    Marchigiana;
    Romagnola;
    Maremmana;
    Podolica;
    Piemontese;
    Modicana;
    Cinisara;
    Rendena;
    Reggiana;
    Grigio alpina;
    Pezzata rossa italiana;
    Valdostana;
    Agerolese;
    Burlina;
    Cabannina;
    Calvana;
    Garfagnina;
    Pontremolese;
    Sardo-Modicana;
    Sarda;
    Pustertaler;
    Pinzgauer;
    Grauvieh;
    Original Braunvieh;
    Hinterwälder;
    Vorderwälder;
    Murnau-Werdenfelser;
    Anglerrund;
    Gelbvieh;
    Deutsches Schwarzbuntes Niederungsrind;
    Deutsche Rotbunte;
    Limpurger;
    Glanrund;
    Rotes Höhenvieh;
    Harzer Rotvieh;
    Ansbach-Triesdorfer;
    Heckrund;
    Deense rode koe;
    Jutlandrund;
    Zweeds roodbont;
    Zweeds bergvee;
    Fjällko;
    Noors rood;
    Telemarkrund;
    Sidet trønderfe;
    Dølafe;
    Vestlandsk fjordfe;
    Fins landrasrund;
    Oost-Fins rund;
    West-Fins rund;
    Noord-Fins rund;
    IJslands rund;
    Estlands rood;
    Estlands inheems rund;
    Lets bruin;
    Lets blauw;
    Litouws rood;
    Pools rood;
    Pools zwartbont;
    Hongaars grijs rund;
    Slavonisch Syrmisch rund;
    Boskarin;
    Busha;
    Roemeens gevlekt rund;
    Roemeens bruin rund;
    Oekraïens grijs rund;
    Kostroma;
    Kholmogory;
    Yaroslavl;
    Bestuzhev;
    Kalmykrund;
    Kazachs witkoprund;
    Alatau;
    Yakutisch rund;
    Sahiwal;
    Gir;
    Red Sindhi;
    Tharparkar;
    Rathi;
    Kankrej;
    Hariana;
    Ongole;
    Deoni;
    Dangi;
    Amrit Mahal;
    Hallikar;
    Kangayam;
    Khillari;
    Malvi;
    Nagori;
    Nimari;
    Punganur;
    Vechur;
    Bargur;
    Umblachery;
    Krishna Valley;
    Jaffarabadi;
    Nelore;
    Guzerat;
    Indubrasil;
    Tabapuã;
    Caracu;
    Curraleiro Pé-Duro;
    Crioulo Lageano;
    Pantaneiro;
    Mocho Nacional;
    Afrikaner;
    Bonsmara;
    Nguni;
    Tuli;
    Boran;
    Ankole-Watusi;
    N Dama;
    Kuri;
    Muturu;
    Baoulé;
    Sokoto Gudali;
    White Fulani;
    Red Fulani;
    Kenana;
    Butana;
    Fogera;
    Arsi;
    Horro;
    Sheko;
    Sanga;
    Mashona;
    Tswana;
    Drakensberger;
    Japanese Black;
    Japanese Brown;
    Japanese Shorthorn;
    Japanese Polled;
    Mishima;
    Kuchinoshima;
    Hanwoo;
    Jeju black;
    Chikso;
    Qinchuan;
    Nanyang;
    Luxi;
    Jinnan;
    Yanbian;
    Mongools rund;
    Bali-rund;
    Madurarund;
    Acehrund
  `, [13,46], 85);

  // ============================================================
  // SCHAPENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Texelaar;
    Swifter;
    Zwartbles;
    Drents heideschaap;
    Schoonebeeker;
    Veluws heideschaap;
    Kempisch heideschaap;
    Mergellandschaap;
    Fries melkschaap;
    Zeeuws melkschaap;
    Nederlands bonte schaap;
    Blauwe Texelaar;
    Witte Texelaar;
    Flevolander;
    Noordhollander;
    Rouge de l Ouest;
    Suffolk;
    Hampshire Down;
    Southdown;
    Oxford Down;
    Dorset Down;
    Dorset Horn;
    Poll Dorset;
    Shropshire;
    Ryeland;
    Clun Forest;
    Kerry Hill;
    Herdwick;
    Rough Fell;
    Swaledale;
    Scottish Blackface;
    Cheviot;
    North Country Cheviot;
    Border Leicester;
    Bluefaced Leicester;
    Leicester Longwool;
    Lincoln Longwool;
    Wensleydale;
    Teeswater;
    Cotswold;
    Devon Longwool;
    Dartmoor;
    Whiteface Dartmoor;
    Greyface Dartmoor;
    Exmoor Horn;
    Devon Closewool;
    Portland;
    Jacobsschaap;
    Hebridean;
    Soayschaap;
    Shetlandschaap;
    North Ronaldsay;
    Manx Loaghtan;
    Boreray;
    Castlemilk Moorit;
    Norfolk Horn;
    Wiltshire Horn;
    Welsh Mountain;
    Black Welsh Mountain;
    Badger Face Welsh Mountain;
    Balwen Welsh Mountain;
    Beulah Speckled Face;
    Llanwenog;
    Lleyn;
    Radnor Forest;
    Hill Radnor;
    Scottish Dunface;
    Galway;
    Irish Suffolk;
    Belclare;
    Ouessantschaap;
    Île-de-France;
    Berrichon du Cher;
    Charollais;
    Vendéen;
    Boulonnais;
    Solognote;
    Rava;
    Bizet;
    Blanche du Massif Central;
    Limousine;
    Lacaune;
    Manech tête noire;
    Manech tête rousse;
    Basco-béarnaise;
    Tarasconnaise;
    Aure et Campan;
    Barègeoise;
    Castillonnaise;
    Lourdaise;
    Mérinos d Arles;
    Mérinos de Rambouillet;
    Mérinos précoce;
    Mourerous;
    Préalpes du Sud;
    Thônes et Marthod;
    Brigasque;
    Corse;
    Caussenarde des garrigues;
    Causses du Lot;
    Grivette;
    Noire du Velay;
    Est à laine mérinos;
    Bleu du Maine;
    Cotentin;
    Avranchin;
    Roussin de la Hague;
    Romanov;
    Karakul;
    Gissar;
    Edilbay;
    Tsigai;
    Racka;
    Tsakel;
    Cigája;
    Pramenka;
    Dalmatinska pramenka;
    Istrisch schaap;
    Karakachan;
    Chios;
    Lesbos;
    Skopelos;
    Boutsko;
    Sfakia;
    Kymi;
    Awassi;
    Assaf;
    Najdi;
    Harri;
    Naimi;
    Barki;
    Rahmani;
    Ossimi;
    Saidi;
    Barbarine;
    Queue Fine de l Ouest;
    D man;
    Sardi;
    Timahdite;
    Beni Guil;
    Boujaad;
    Hamra;
    Ouled Djellal;
    Rembi;
    Berber;
    Dorper;
    White Dorper;
    Damara;
    Namaqua Afrikaner;
    Blackhead Persian;
    Red Maasai;
    Somali-schaap;
    Ethiopian Highland;
    Menz;
    Horro-schaap;
    Bonga;
    Afar;
    Djallonké;
    Sahel-schaap;
    Uda;
    Yankasa;
    Balami;
    West African Dwarf;
    Barbados Blackbelly;
    St Croix;
    Katahdin;
    Royal White;
    California Red;
    Columbia;
    Targhee;
    Polypay;
    Montadale;
    American Tunis;
    Gulf Coast Native;
    Florida Cracker;
    Navajo-Churro;
    Cormo;
    Corriedale;
    Coopworth;
    Perendale;
    Romney;
    Drysdale;
    Elliottdale;
    Carpetmaster;
    Bond;
    Australian Merino;
    Peppin Merino;
    South Australian Merino;
    Australian White;
    Afrino;
    Dohne Merino;
    Meatmaster;
    Merinolandschaf;
    Merinofleischschaf;
    Merinolangwollschaf;
    Deutsches Schwarzköpfiges Fleischschaf;
    Weißköpfiges Fleischschaf;
    Leineschaf;
    Rhönschaf;
    Coburger Fuchsschaf;
    Bentheimer Landschaf;
    Heidschnucke;
    Moorschnucke;
    Skudde;
    Rauhwolliges Pommersches Landschaf;
    Waldschaf;
    Krainer Steinschaf;
    Alpines Steinschaf;
    Tiroler Bergschaf;
    Tiroler Steinschaf;
    Juraschaf;
    Walliser schwarznasenschaf;
    Walliser schwarzhals;
    Bündner Oberländerschaf;
    Engadinerschaf;
    Spiegelschaf;
    Gotlandschaf;
    Gute;
    Rya;
    Roslagsschaap;
    Värmlandschaap;
    Ålandschaap;
    Fins landras;
    Noors wit schaap;
    Spælsau;
    Gammelnorsk spælsau;
    Dala;
    Rygja;
    Steigar;
    IJslands schaap;
    Faeröers schaap;
    Deens landras;
    Marskschaap
  `, [13,46], 85);

  // ============================================================
  // GEITENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Nederlandse witte geit;
    Nederlandse bonte geit;
    Nederlandse landgeit;
    Nederlandse toggenburger;
    Nederlandse dwerggeit;
    Nubische geit;
    Anglo-Nubische geit;
    Saanengeit;
    Toggenburger;
    Alpinegeit;
    Franse alpinegeit;
    Britse alpinegeit;
    Oberhasli;
    Appenzeller geit;
    Bündner stralengeit;
    Chamoisgekleurde berggeit;
    Gemsfarbige Gebirgsziege;
    Walliser zwarthalsgeit;
    Walliser koperhalsgeit;
    Walliser grijshalsgeit;
    Nera Verzasca;
    Stiefelgeit;
    Peacock goat;
    Pfauenziege;
    Tauernschecken;
    Pinzgauer geit;
    Passeirer berggeit;
    Blobe geit;
    Steirische Scheckenziege;
    Bunte Deutsche Edelziege;
    Weiße Deutsche Edelziege;
    Thüringer Waldziege;
    Erzgebirgsziege;
    Harzer Ziege;
    Frankische landgeit;
    Belgische hertegeit;
    Vlaamse geit;
    Kempische geit;
    Poitevine;
    Provençale;
    Rove;
    Pyrénées;
    Massif Central;
    Fossés;
    Lorrainegeit;
    Corsicaanse geit;
    Angorageit;
    Kasjmiergeit;
    Pygmeegeit;
    Nigerian dwarf;
    Amerikaanse LaMancha;
    Mini LaMancha;
    Kindergeit;
    Boergeit;
    Kalahari Red;
    Savannageit;
    Spaanse geit;
    Tennessee fainting goat;
    Myotone geit;
    Golden Guernsey;
    British Guernsey;
    Bagotgeit;
    Engelse geit;
    Ierse geit;
    Arapawageit;
    Australian rangeland goat;
    Kiko;
    Valerageit;
    Damascusgeit;
    Shami;
    Kilisgeit;
    Honamli;
    Turkse haargeit;
    Maltese geit;
    Girgentana;
    Garganica;
    Ionica;
    Orobica;
    Sarda;
    Bionda dell Adamello;
    Capra di Livo;
    Camosciata delle Alpi;
    Ciociara grigia;
    Grigia Molisana;
    Messinese;
    Nicastrese;
    Roccaverano;
    Valdostana;
    Vallesana;
    Verzaschese;
    Murciano-Granadina;
    Malagueña;
    Florida;
    Payoya;
    Majorera;
    Tinerfeña;
    Palmera;
    Guadarrama;
    Verata;
    Retinta;
    Blanca Andaluza;
    Blanca Celtibérica;
    Negra Serrana;
    Azpi Gorri;
    Moncaína;
    Pirenaica;
    Bermeya;
    Bravia;
    Charnequeira;
    Serrana;
    Serpentina;
    Algarvia;
    Jarmelista;
    Noorse melkgeit;
    Zweedse landgeit;
    Finse landgeit;
    Deense landgeit;
    IJslandse geit;
    Russische witte geit;
    Gorkigeit;
    Orenburggeit;
    Dongeit;
    Megreliangeit;
    Sneeuwgeitras;
    Tsjechische witte korthaargeit;
    Tsjechische bruine korthaargeit;
    Slowaakse witte geit;
    Bulgaarse witte melkgeit;
    Griekse Skopelosgeit;
    Griekse inheemse geit;
    Albanese geit;
    Balkanlandgeit;
    Jamunapari;
    Beetal;
    Barbari;
    Black Bengal;
    Sirohi;
    Jakhrana;
    Marwari;
    Kutchi;
    Surti;
    Gohilwadi;
    Zalawadi;
    Osmanabadi;
    Sangamneri;
    Malabari;
    Attappady Black;
    Kanni Adu;
    Kodi Adu;
    Salem Black;
    Changthangi;
    Chegu;
    Gaddi;
    Pashminageit;
    Teddygeit;
    Kamori;
    Dera Din Panah;
    Nachi;
    Pateri;
    Gulabi;
    Kacchan;
    Damani;
    Chappar;
    Khurasani;
    Nepalese Khari;
    Sinhalageit;
    Etawah;
    Kacang;
    Peranakan Etawah;
    Jawarandu;
    Saanen-Toggenburger;
    Red Sokoto;
    Sahelgeit;
    West-Afrikaanse dwerggeit;
    Maradigeit;
    Small East African;
    Galla;
    Somali-geit;
    Mubende;
    Kigezigeit;
    Mashonageit;
    Matebelegeit;
    Tswanageit;
    Nguni-geit;
    Arsi-Bale;
    Afargeit;
    Abergelle;
    Woyto-Guji;
    Bati
  `, [13,46], 90);

  // ============================================================
  // VARKENSRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Nederlands landvarken;
    Nederlands groot Yorkshire;
    Nederlands bont varken;
    Large White;
    Yorkshirevarken;
    Landrace;
    Deens landvarken;
    Zweeds landvarken;
    Duits landvarken;
    Belgisch landvarken;
    Fins landvarken;
    Noors landvarken;
    Frans landvarken;
    Brits landvarken;
    Piétrain;
    Duroc;
    Hampshirevarken;
    Berkshire;
    Tamworth;
    Gloucestershire Old Spot;
    British Saddleback;
    Essex pig;
    Wessex Saddleback;
    Large Black;
    Middle White;
    British Lop;
    Oxford Sandy and Black;
    Welsh pig;
    Lincolnshire Curly Coat;
    Mangalica;
    Blonde Mangalica;
    Rode Mangalica;
    Zwaluwbuikmangalica;
    Ibericovarken;
    Alentejano;
    Bísaro;
    Malhado de Alcobaça;
    Cinta Senese;
    Nero Siciliano;
    Casertana;
    Mora Romagnola;
    Nera Parmigiana;
    Apulo-Calabrese;
    Sarda;
    Krškopolje;
    Turopoljevarken;
    Black Slavonian;
    Moravka;
    Resavka;
    Šumadinka;
    Bazna;
    Mangalița;
    East Balkan pig;
    Lithuanian native;
    Lithuanian White;
    Latvian White;
    Estonian Bacon;
    Pulawska;
    Zlotnicka White;
    Zlotnicka Spotted;
    Ukrainian White Steppe;
    Mirgorod;
    Ukrainian Spotted Steppe;
    Large Black Russian;
    Kemerovo;
    Livny;
    Urzhum;
    Breitovo;
    North Caucasian;
    Siberian Northern;
    Semirechye;
    Murom;
    Vietnamese hangbuikzwijn;
    Kunekune;
    Göttinger minivarken;
    Juliana pig;
    Meishan;
    Jiaxing Black;
    Fengjing;
    Erhualian;
    Minzhu;
    Jinhua;
    Ningxiang;
    Rongchang;
    Luchuan;
    Bama Xiang;
    Wuzhishan;
    Tibetan pig;
    Taoyuan;
    Okinawa Agu;
    Jeju Black Pig;
    Philippine native pig;
    Mukota;
    Ashanti Dwarf pig;
    Windsnyer;
    Kolbroek;
    Guinea Hog;
    Mulefoot;
    Red Wattle;
    Hereford pig;
    Chester White;
    Poland China;
    Spotted pig;
    American Yorkshire;
    Ossabaw Island pig;
    Choctaw hog;
    Yucatan minivarken
  `, [13,46], 85);

  // Uitgestorven varkensrassen horen niet bij
  // boerderijdieren die tegenwoordig worden gehouden.

  verwijderKoppeling(
    "Lincolnshire Curly Coat",
    [13,46]
  );

  koppel(
    "Lincolnshire Curly Coat",
    [43],
    90
  );

  // ============================================================
  // PAARDENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Fries paard;
    Groninger paard;
    Gelderlander;
    Nederlands warmbloedpaard=KWPN;
    Nederlands trekpaard;
    Belgisch trekpaard;
    Brabants trekpaard;
    Vlaams paard;
    Ardenner;
    Auxois;
    Boulonnais;
    Breton;
    Comtois;
    Percheron;
    Norman cob;
    Poitevin;
    Trait du Nord;
    Trait Mulassier;
    Shire;
    Clydesdale;
    Suffolk Punch;
    Irish Draught;
    Irish Cob=Tinker;
    Gypsy Vanner;
    Cleveland Bay;
    Highlandpony;
    Fellpony;
    Dalespony;
    Dartmoorpony;
    Exmoorpony;
    New Forest pony;
    Connemarapony;
    Welshpony;
    Welsh mountain pony;
    Welsh cob;
    Shetlandpony;
    IJslands paard;
    Fjordenpaard;
    Dølepaard;
    Nordlandshest;
    Noord-Zweeds paard;
    Zweeds Ardenner;
    Gotlandpony;
    Finpaard;
    Jutlands paard;
    Frederiksborger;
    Knabstrupper;
    Deens warmbloed;
    Zweeds warmbloed;
    Noors warmbloed;
    Hannoveraan;
    Holsteiner;
    Oldenburger;
    Westfaler;
    Trakehner;
    Mecklenburger;
    Brandenburger;
    Württemberger;
    Beiers warmbloed;
    Rijnlands warmbloed;
    Saksisch warmbloed;
    Zweibrücker;
    Duitse rijpony;
    Duitse sportpaard;
    Schwarzwälder Fuchs;
    Süddeutsches Kaltblut;
    Rheinisch-Deutsches Kaltblut;
    Schleswig Kaltblut;
    Sächsisch-Thüringisches Kaltblut;
    Haflinger;
    Noriker;
    Oostenrijks warmbloed;
    Lipizzaner;
    Kladruber;
    Kinsky;
    Tsjechisch warmbloed;
    Slowaaks warmbloed;
    Hucul;
    Konik;
    Wielkopolski;
    Malopolski;
    Pools koudbloed;
    Silesisch paard;
    Felinpony;
    Nonius;
    Furioso-North Star;
    Gidran;
    Shagya-Arabier;
    Kisber Felver;
    Hongaars warmbloed;
    Hongaars koudbloed;
    Roemeens sportpaard;
    Transsylvanisch paard;
    Danubian horse;
    Pleven;
    Oost-Bulgaars paard;
    Bosnisch bergpaard;
    Kroatisch koudbloed;
    Posavac;
    Međimurjepaard;
    Murgese;
    Maremmano;
    Bardigiano;
    Esperia;
    Monterufolino;
    Sanfratellano;
    Pentro;
    Napoletano;
    Tolfetano;
    Cavallo Romano;
    Italiaanse zware trekpaard;
    Avelignese;
    Andalusiër=PRE;
    Lusitano;
    Alter Real;
    Sorraia;
    Garrano;
    Pottok;
    Asturcón;
    Losino;
    Monchino;
    Galicische pony;
    Jaca Navarra;
    Menorquin;
    Mallorquin;
    Hispano-Árabe;
    Hispano-Bretón;
    Burguetepaard;
    Caballo de las Retuertas;
    Camarguepaard;
    Mérens;
    Castillonnais;
    Landais;
    Poney français de selle;
    Selle français;
    Anglo-Arabier;
    Franse draver;
    Cheval de Corlay;
    Henson;
    Auvergnepaard;
    Corsicaans paard;
    Engelse volbloed;
    Arabische volbloed;
    Akhal-Teke;
    Karabair;
    Karabachpaard;
    Kabardin;
    Donpaard;
    Budjonny;
    Orlovdraver;
    Russische draver;
    Russische zware trekpaard;
    Vladimir trekpaard;
    Sovjet trekpaard;
    Vyatka;
    Mezenpaard;
    Pechorapaard;
    Jakutisch paard;
    Bashkir;
    Altaipaard;
    Tersk;
    Novoaltai;
    Kuznetskpaard;
    Estlands paard;
    Tori;
    Estlands trekpaard;
    Lets warmbloed;
    Žemaitukas;
    Litouws zwaar trekpaard;
    Mongools paard;
    Kazachs paard;
    Kirgizisch paard;
    Lokai;
    Yomud;
    Turkmeens paard;
    Marwari;
    Kathiawari;
    Manipuri;
    Spiti;
    Zanskari;
    Bhutia;
    Kachchhi-Sindhi;
    Baluchi;
    Waler;
    Australian stock horse;
    Australian pony;
    Australian riding pony;
    Australian draught horse;
    Brumby;
    Kaimanawapaard;
    Quarter horse;
    Paint horse;
    Appaloosa;
    Morgan;
    American saddlebred;
    Tennessee walking horse;
    Missouri fox trotter;
    Rocky Mountain horse;
    Kentucky Mountain saddle horse;
    Mountain pleasure horse;
    Standardbred;
    American cream draft;
    American bashkir curly;
    American miniature horse;
    Falabella;
    Hackney;
    Hackneypony;
    Caspisch paard;
    Chincoteaguepony;
    Assateaguepony;
    Banker horse;
    Florida cracker horse;
    Carolina marsh tacky;
    Choctaw horse;
    Spanish mustang;
    Pryor Mountain mustang;
    Nokotapaard;
    Canadian horse;
    Newfoundlandpony;
    Lac La Croix Indian pony;
    Canadian rustic pony;
    Canadese warmbloed;
    Criollo;
    Mangalarga;
    Mangalarga marchador;
    Campolina;
    Pantaneiro;
    Brazilian sport horse;
    Brasileiro de hipismo;
    Baixadeiro;
    Nordestino;
    Lavradeiro;
    Marajoara;
    Pampa horse;
    Chileens paard;
    Peruvian paso;
    Paso fino;
    Argentine polo pony;
    Colombian paso fino;
    Costarricense de paso;
    Azteca;
    Galiceño;
    Kiger mustang;
    Barb;
    Dongolapaard;
    Boerperd;
    Nooitgedachter;
    Basutopony;
    Namibisch woestijnpaard;
    Berberpaard;
    Fleuve;
    M Bayar;
    Fouta;
    Kirdi;
    Poney du Logone
  `, [13], 85);

  // Een paard kan ook als gezelschapsdier worden
  // gehouden. We koppelen dat niet automatisch
  // voor alle werk- en wilde paardenpopulaties.

  koppel(`
    Paard;
    Pony;
    Shetlandpony;
    Falabella;
    American miniature horse;
    Welshpony;
    Welsh mountain pony;
    New Forest pony;
    Connemarapony;
    Haflinger;
    IJslands paard;
    Fjordenpaard;
    Fries paard;
    Tinker
  `, [8], 65);

  // ============================================================
  // EZELRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Ezel;
    Miniatuurezel;
    Amerikaanse mammoetezel;
    Poitou-ezel;
    Grand noir du Berry;
    Normandische ezel;
    Cotentinezel;
    Provence-ezel;
    Pyreneese ezel;
    Bourbonnaisezel;
    Catalaanse ezel;
    Andalusische ezel;
    Zamorano-Leonés;
    Majorcaanse ezel;
    Encartaciones-ezel;
    Mirandese ezel;
    Asinara-ezel;
    Sardijnse ezel;
    Martina Franca;
    Ragusano;
    Amiatina;
    Pantesco;
    Romagnolo;
    Viterbese;
    Grijze Siciliaanse ezel;
    Bulgaarse ezel;
    Cypriotische ezel;
    Istrische ezel;
    Anatolische ezel;
    Egyptische ezel;
    Abyssijnse ezel;
    Dongola-ezel;
    Dezhou-ezel;
    Guanzhong-ezel;
    Xinjiang-ezel;
    Liangzhou-ezel;
    Kulan-ezelras
  `, [13], 85);

  // ============================================================
  // KIPPENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Barnevelder;
    Welsumer;
    Lakenvelder kip;
    Hollandse kuifhoen;
    Hollandse kriel;
    Nederlandse uilebaard;
    Nederlandse sabelpootkriel;
    Nederlandse baardkuifhoen;
    Assendelfter;
    Drents hoen;
    Fries hoen;
    Groninger meeuw;
    Brabanter;
    Chaams hoen;
    Kraaikop;
    Schijndelaar;
    Twents hoen;
    Eikenburger kriel;
    Sumatrahoen;
    Belgische kriel;
    Antwerpse baardkriel;
    Watermaalse baardkriel;
    Ukkelse baardkriel;
    Bosvoordse baardkriel;
    Everbergse baardkriel;
    Grubbe baardkriel;
    Brakelhoen;
    Kempisch hoen;
    Mechelse koekoek;
    Mechelse kalkoenkop;
    Brugse vechter;
    Luikse vechter;
    Tiense vechter;
    Vlaamse koekoek;
    Vlaamse kriel;
    Zottegems hoen;
    Hervehoen;
    Famennehoen;
    Ardenner hoen;
    Bassette;
    Doornikse kriel;
    Poule de Bresse;
    Bresse-Gauloise;
    Marans;
    Faverolles;
    Houdan;
    Crèvecoeur;
    La Flèche;
    Gâtinaise;
    Gournay;
    Barbezieux;
    Coucou de Rennes;
    Coucou des Flandres;
    Courtes-pattes;
    Caumont;
    Caussade;
    Charollaise;
    Combattant du Nord;
    Cotentine;
    Estaires;
    Gasconne;
    Géline de Touraine;
    Janzé;
    Landeshoen;
    Le Mans;
    Limousine;
    Lyonnaise;
    Mantes;
    Meusienne;
    Noire du Berry;
    Pavilly;
    Pictave;
    Pondeuse d Alsace;
    Bourbonnaise;
    Contres;
    Dorking;
    Sussex;
    Light Sussex;
    Speckled Sussex;
    Red Sussex;
    Buff Sussex;
    Orpington;
    Buff Orpington;
    Australorp;
    Wyandotte;
    Rhode Island Red;
    Rhode Island White;
    New Hampshire;
    Plymouth Rock;
    Barred Plymouth Rock;
    White Plymouth Rock;
    Jersey Giant;
    Delaware;
    Dominique;
    Buckeye;
    Chantecler;
    Java;
    Lamona;
    Holland;
    Iowa Blue;
    California Gray;
    California White;
    Easter egger;
    Ameraucana;
    Araucana;
    Cream Legbar;
    Leghorn;
    Ancona;
    Minorca;
    Andalusiërhoen;
    Spaanse witwang;
    Catalanahoen;
    Penedesenca;
    Empordanesa;
    Castellana negra;
    Prat;
    Euskal Oiloa;
    Utrerana;
    Sobrarbe;
    Moshoen;
    Menorcahoen;
    Mallorcahoen;
    Pita Pinta Asturiana;
    Pedres Portuguesa;
    Preta Lusitânica;
    Amarela Portuguesa;
    Branca Portuguesa;
    Livorno;
    Ancona Italiana;
    Padovana;
    Polverara;
    Siciliana;
    Valdarnese Bianca;
    Valdarno;
    Bionda Piemontese;
    Bianca di Saluzzo;
    Millefiori di Lonigo;
    Ermellinata di Rovigo;
    Robusta Lionata;
    Robusta Maculata;
    Pépoi;
    Mericanel della Brianza;
    Vorwerk;
    Lakenfelder;
    Bielefelder;
    Amrock;
    Bergische kraaier;
    Bergische schlotterkam;
    Krüper;
    Westfaalse doodlegger;
    Oost-Friese meeuw;
    Ramelsloher;
    Sundheimer;
    Sachsenhoen;
    Thüringer baardhoen;
    Duitse sperwer;
    Duitse kriel;
    Duitse langstaart;
    Dresdener;
    Augsburger;
    Deutsches Reichshuhn;
    Deutsches Lachshuhn;
    Rheinländer;
    Niederrheiner;
    Reichshuhn;
    Altsteirer;
    Sulmtaler;
    Appenzeller spitskuif;
    Appenzeller baardhoen;
    Schweizerhuhn;
    Duitse keizerhoen;
    Deens landhoen;
    Zweeds bloemhoen;
    Hedemorahoen;
    Ölandshoen;
    Bohuslän-Dals svarthöna;
    Åsbohoen;
    Gotlandshoen;
    Orusthoen;
    Skåns blommehöna;
    Zweeds kriel;
    Noors Jærhoen;
    Fins landhoen;
    IJslands landhoen;
    Groenlandse kip;
    Poltava;
    Russische orloff;
    Pavlovskaya;
    Yurlov kraaier;
    Ushanka;
    Zagorsk salmon;
    Kuchinskaya Jubilee;
    Moscow black;
    Moscow white;
    Adler silver;
    Pervomai;
    Pushkin;
    Leningrad golden grey;
    Tsarskoye Selo;
    Livenskaya;
    Kotlyarevskaya;
    Borkovskaya Barvista;
    Hongaars geel;
    Hongaars wit;
    Hongaars gespikkeld;
    Transsylvanische naakthals;
    Tsjechische goudpel;
    Tsjechische hen;
    Šumavanka;
    Pools kuifhoen;
    Green-legged partridge;
    Karpatenhoen;
    Denizli;
    Gerze;
    Sultanhoen;
    Zijdehoen;
    Cochin;
    Brahma;
    Langshan;
    Croad Langshan;
    Dongxiang;
    Taihe zijdehoen;
    Beijing You;
    Wenchang;
    Qingyuan;
    Dagu;
    Gushi;
    Tibetan chicken;
    Ayam cemani;
    Ayam ketawa;
    Ayam pelung;
    Ayam bekisar;
    Ayam kampung;
    Kedu;
    Sentul;
    Ga Dong Tao;
    Ga Ho;
    Ga Ri;
    Ga Mia;
    Ga Tre;
    Serama;
    Japanse kriel=Chabo;
    Onagadori;
    Totenko;
    Ohiki;
    Shokoku;
    Minohiki;
    Tomaru;
    Koeyoshi;
    Jitokko;
    Ukokkei;
    Satsumadori;
    Shamo;
    Ko Shamo;
    Yamato gunkei;
    Nankin Shamo;
    Yakido;
    Kinpa;
    Chuseng;
    Asil;
    Maleier;
    Indische vechter;
    Cornish;
    Modern game;
    Old English game;
    Oxford Old English Game;
    American game;
    Cubalaya;
    Thai game;
    Saipanhoen;
    Phoenixhoen;
    Yokohamahoen;
    Sumatra;
    Sebright;
    Rosecomb;
    Booted bantam;
    Nankin;
    Pekin bantam;
    Scots Dumpy;
    Scots Grey;
    Derbyshire Redcap;
    Marsh Daisy;
    Ixworth;
    Norfolk Grey;
    Lincolnshire Buff;
    Old English Pheasant Fowl;
    Hamburgh=Hamburgerhoen;
    Campine;
    Spanish game;
    Fayoumi;
    Dandarawi;
    Mandarah;
    Inshas;
    Matrouh;
    Silver Montazah;
    Golden Montazah;
    Alexandria chicken;
    Naked Neck;
    Venda;
    Ovambo;
    Potchefstroom Koekoek;
    Boschveld;
    Boschveld chicken;
    Boschveldhoen;
    Koekoekkip;
    Kuroiler;
    Sasso;
    Noiler;
    Kenbro;
    Kadaknath;
    Aseel;
    Chittagong;
    Nicobari;
    Ghagus;
    Busra;
    Tellicherry;
    Ankleshwar;
    Haringhata Black;
    Miri;
    Punjab Brown;
    Kashmir Faverolles
  `, [13], 85);

  // Gangbare productie- en dubbeldoelrassen.

  koppel(`
    Kip;
    Barnevelder;
    Welsumer;
    Leghorn;
    Rhode Island Red;
    Rhode Island White;
    New Hampshire;
    Sussex;
    Plymouth Rock;
    Orpington;
    Australorp;
    Wyandotte;
    Delaware;
    Jersey Giant;
    Marans;
    Faverolles;
    Mechelse koekoek;
    Bresse-Gauloise;
    Cornish;
    Brahma;
    Cochin;
    Amrock;
    Bielefelder;
    Sundheimer;
    Vorwerk;
    Deutsches Lachshuhn;
    Sulmtaler;
    Fayoumi;
    Kadaknath;
    Ayam kampung;
    Wenchang;
    Ga Dong Tao;
    Sasso;
    Kuroiler;
    Noiler;
    Kenbro
  `, [46], 70);

  // ============================================================
  // EENDENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Pekingeend;
    Aylesbury-eend;
    Roueneend;
    Muscovy-eend=Muskuseend;
    Indische loopeend;
    Khaki Campbell;
    Welsh Harlequin;
    Cayuga-eend;
    Zweedse blauwe eend;
    Zweedse gele eend;
    Buff Orpington eend;
    Sakseneend;
    Zilverappelyard;
    Miniatuur zilverappelyard;
    Call duck=Kwaker;
    Duclair-eend;
    Challans-eend;
    Bourbourgeend;
    Estaires-eend;
    Merksplase eend;
    Huttegemeend;
    Merchtemse eend;
    Dendermondse eend;
    Overbergse eend;
    Noord-Hollandse witborsteend;
    Nederlandse kwaker;
    Oost-Indische zwarte eend;
    Duitse pekingeend;
    Pommerse eend;
    Duitse streekeend;
    Hochbrutflugente;
    Duitse krombekeend;
    Krombekeend;
    Spreeuweend;
    Magpie duck;
    Ancona duck;
    Hook Bill;
    Abacot Ranger;
    Bali-eend;
    Tsaiya-eend;
    Alabio-eend;
    Mojosari-eend;
    Tegal-eend;
    Magelang-eend;
    Cihateup-eend;
    Pitalah-eend;
    Nageswari-eend;
    Sylhet-eend;
    Deshi-eend;
    Chara-Chemballi;
    Kuttanad-eend;
    Jinding-eend;
    Shaoxing-eend;
    Gaoyou-eend;
    Liancheng-eend;
    Cherry Valley-eend;
    Oekraïense grijze eend;
    Bashkir-eend;
    Star 53-eend
  `, [1,13,14], 85);

  koppel(`
    Pekingeend;
    Aylesbury-eend;
    Roueneend;
    Muskuseend;
    Indische loopeend;
    Khaki Campbell;
    Welsh Harlequin;
    Cayuga-eend;
    Sakseneend;
    Zilverappelyard;
    Duclair-eend;
    Challans-eend;
    Cherry Valley-eend;
    Tsaiya-eend;
    Alabio-eend;
    Mojosari-eend;
    Tegal-eend;
    Magelang-eend;
    Gaoyou-eend;
    Shaoxing-eend
  `, [46], 75);

  // ============================================================
  // GANZENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Toulousegans;
    Embdengans;
    Pommerse gans;
    Afrikaanse gans;
    Chinese knobbelgans;
    Chinese gans;
    Pilgrimgans;
    Sebastopolgans;
    Roman tufted goose;
    Romeinse gans;
    American Buff goose;
    Cotton Patch goose;
    Steinbachergans;
    Diepholzer gans;
    Beierse landgans;
    Frankische landgans;
    Leinegans;
    Lippegans;
    Emdener gans;
    Elzasser gans;
    Bourbonnaisgans;
    Poitougans;
    Landesgans;
    Bressegans;
    Tourainegans;
    Vlaamse gans;
    Normandische gans;
    Deense landgans;
    Scaniagans;
    Ölandgans;
    Noorse witte gans;
    Smaalensgans;
    Finse landgans;
    Kholmogorygans;
    Lindagans;
    Tula vechtgans;
    Arzamasgans;
    Shadrinskaya-gans;
    Vladimir clay goose;
    Kubangans;
    Obroshynska-gans;
    Oekraïense grijze gans;
    Italiaanse witte gans;
    Romagnolagans;
    Padovagans;
    Slowaakse witte gans;
    Tsjechische gans;
    Hongaarse witte gans;
    Zatorskagans;
    Bilgorajgans;
    Kieleckagans;
    Lubelskagans;
    Rypinskgans;
    Suwalskagans;
    Kartuskagans;
    Podkarpackagans;
    Wanzai-gans;
    Yangzhou-gans;
    Taihu-gans;
    Huoyan-gans;
    Zi-gans;
    Lionhead goose
  `, [1,13,14,46], 85);

  // ============================================================
  // KALKOENRASSEN
  // ============================================================

  gehoudenDierenDeel7(`
    Kalkoen;
    Broad Breasted White;
    Broad Breasted Bronze;
    Standard Bronze;
    Narragansett;
    Bourbon Red;
    Royal Palm;
    Black Spanish turkey;
    Slate turkey;
    Blue Slate;
    Beltsville Small White;
    Midget White;
    White Holland turkey;
    Jersey Buff turkey;
    Chocolate turkey;
    Auburn turkey;
    Lilac turkey;
    Silver Auburn;
    Norfolk Black;
    Cambridge Bronze;
    Crollwitzer kalkoen;
    Ronquières kalkoen;
    Ardense kalkoen;
    Belgische bronzen kalkoen;
    Bourbonnais kalkoen;
    Sologne kalkoen;
    Bresse kalkoen;
    Gers kalkoen;
    Gasconne kalkoen;
    Rouge des Ardennes;
    Bronzato Comune;
    Bronzato dei Colli Euganei;
    Nero d Italia;
    Ermellinato di Rovigo;
    Parma e Piacenza kalkoen;
    Mexican turkey;
    Cröllwitzer Pute;
    Deutsche Pute
  `, [13,46], 85);

  // ============================================================
  // KWARTELS EN OVERIG PLUIMVEE
  // ============================================================

  gehoudenDierenDeel7(`
    Japanse kwartel=Coturnix japonica;
    Gewone kwartel=Coturnix coturnix;
    Chinese dwergkwartel=Synoicus chinensis;
    Regenkwartel=Coturnix coromandelica;
    Californische kuifkwartel=Callipepla californica;
    Gambels kwartel=Callipepla gambelii;
    Geschubde kwartel=Callipepla squamata;
    Boomkwartel=Colinus virginianus;
    Bergkwartel=Oreortyx pictus;
    Harlekijnkwartel=Coturnix delegorguei;
    Parelhoen=Numida meleagris;
    Witte parelhoen;
    Lavendelparelhoen;
    Blauwe parelhoen;
    Franse parelhoen;
    Goudfazant=Chrysolophus pictus;
    Lady Amherstfazant=Chrysolophus amherstiae;
    Zilverfazant=Lophura nycthemera;
    Koningsfazant=Syrmaticus reevesii;
    Gewone fazant=Phasianus colchicus;
    Blauwe pauw=Pavo cristatus;
    Witte pauw;
    Struisvogel;
    Emoe;
    Grote nandoe
  `, [13], 80);

  koppel(`
    Japanse kwartel;
    Parelhoen;
    Gewone fazant;
    Struisvogel;
    Emoe;
    Grote nandoe
  `, [46], 70);

  // ============================================================
  // KAMEELACHTIGEN EN OVERIGE LANDBOUWDIEREN
  // ============================================================

  gehoudenDierenDeel7(`
    Dromedaris;
    Kameel;
    Lama;
    Alpaca;
    Huacaya-alpaca;
    Suri-alpaca;
    Yak;
    Waterbuffel;
    Murrahbuffel;
    Nili-Ravibuffel;
    Surti-buffel;
    Mehsana-buffel;
    Bhadawari-buffel;
    Nagpuri-buffel;
    Jaffarabadi-buffel;
    Pandharpuri-buffel;
    Toda-buffel;
    Banni-buffel;
    Mediterrane waterbuffel;
    Italiaanse waterbuffel;
    Carabao;
    Amerikaanse bizon;
    Rendier;
    Edelhert;
    Damhert;
    Sikahert
  `, [13], 80);

  koppel(`
    Dromedaris;
    Kameel;
    Lama;
    Alpaca;
    Yak;
    Waterbuffel;
    Murrahbuffel;
    Nili-Ravibuffel;
    Surti-buffel;
    Mehsana-buffel;
    Bhadawari-buffel;
    Nagpuri-buffel;
    Jaffarabadi-buffel;
    Pandharpuri-buffel;
    Toda-buffel;
    Banni-buffel;
    Mediterrane waterbuffel;
    Italiaanse waterbuffel;
    Carabao;
    Amerikaanse bizon;
    Rendier;
    Edelhert;
    Damhert
  `, [46], 85);

  // ============================================================
  // DIEREN UIT AQUACULTUUR
  // ============================================================

  gehoudenDierenDeel7(`
    Atlantische zalm=Salmo salar;
    Regenboogforel=Oncorhynchus mykiss;
    Beekforel=Salmo trutta;
    Bronforel=Salvelinus fontinalis;
    Riddervis=Salvelinus alpinus;
    Oncorhynchus kisutch;
    Oncorhynchus tshawytscha;
    Oncorhynchus masou;
    Karper=Cyprinus carpio;
    Graskarper;
    Zilverkarper=Hypophthalmichthys molitrix;
    Grootkopkarper=Hypophthalmichthys nobilis;
    Zwarte karper=Mylopharyngodon piceus;
    Catla catla;
    Labeo rohita;
    Cirrhinus mrigala;
    Labeo calbasu;
    Labeo bata;
    Cirrhinus cirrhosus;
    Niletilapia=Oreochromis niloticus;
    Oreochromis mossambicus;
    Oreochromis aureus;
    Oreochromis urolepis;
    Oreochromis andersonii;
    Oreochromis macrochir;
    Coptodon zillii;
    Coptodon rendalli;
    Pangasianodon hypophthalmus;
    Pangasius bocourti;
    Afrikaanse meerval=Clarias gariepinus;
    Clarias batrachus;
    Clarias macrocephalus;
    Heterobranchus longifilis;
    Ictalurus punctatus;
    Ictalurus furcatus;
    Silurus glanis;
    Silurus asotus;
    Pseudoplatystoma corruscans;
    Pseudoplatystoma reticulatum;
    Colossoma macropomum;
    Piaractus brachypomus;
    Piaractus mesopotamicus;
    Arapaima gigas;
    Channa striata;
    Channa micropeltes;
    Channa argus;
    Channa maculata;
    Chanos chanos;
    Barramundi=Lates calcarifer;
    Europese zeebaars=Dicentrarchus labrax;
    Dorade=Sparus aurata;
    Pagrus major;
    Pagrus auratus;
    Argyrosomus regius;
    Sciaenops ocellatus;
    Larimichthys crocea;
    Larimichthys polyactis;
    Miichthys miiuy;
    Seriola quinqueradiata;
    Seriola lalandi;
    Seriola dumerili;
    Rachycentron canadum;
    Atlantische kabeljauw=Gadus morhua;
    Melanogrammus aeglefinus;
    Tarbot=Scophthalmus maximus;
    Tong=Solea solea;
    Solea senegalensis;
    Paralichthys olivaceus;
    Paralichthys lethostigma;
    Hippoglossus hippoglossus;
    Takifugu rubripes;
    Epinephelus coioides;
    Epinephelus fuscoguttatus;
    Epinephelus lanceolatus;
    Epinephelus akaara;
    Epinephelus malabaricus;
    Plectropomus leopardus;
    Cromileptes altivelis;
    Belugasteur;
    Acipenser baerii;
    Acipenser gueldenstaedtii;
    Acipenser transmontanus;
    Acipenser stellatus;
    Acipenser ruthenus;
    Acipenser schrenckii;
    Huso dauricus;
    Europese paling=Anguilla anguilla;
    Japanse paling=Anguilla japonica;
    Anguilla rostrata;
    Anguilla bicolor;
    Anguilla marmorata;
    Thunnus thynnus;
    Thunnus orientalis;
    Thunnus maccoyii;
    Trachinotus blochii;
    Trachinotus carolinus;
    Trachinotus ovatus;
    Scatophagus argus;
    Siganus guttatus;
    Siganus canaliculatus;
    Siganus rivulatus;
    Mugil cephalus;
    Chelon labrosus;
    Chelon ramada;
    Chelon auratus;
    Acanthopagrus schlegelii;
    Acanthopagrus latus;
    Oplegnathus fasciatus;
    Oplegnathus punctatus;
    Siniperca chuatsi;
    Siniperca scherzeri;
    Lateolabrax japonicus;
    Lateolabrax maculatus;
    Maccullochella peelii;
    Bidyanus bidyanus;
    Jade perch=Scortum barcoo;
    Tinca tinca;
    Esox lucius;
    Sander lucioperca;
    Perca fluviatilis;
    Perca flavescens
  `, [1,14,46], 85);

  // ============================================================
  // GEKWEEKTE SCHAALDIEREN
  // ============================================================

  gehoudenDierenDeel7(`
    Litopenaeus vannamei;
    Penaeus monodon;
    Penaeus japonicus;
    Penaeus chinensis;
    Penaeus semisulcatus;
    Fenneropenaeus indicus;
    Fenneropenaeus merguiensis;
    Penaeus stylirostris;
    Penaeus setiferus;
    Farfantepenaeus aztecus;
    Farfantepenaeus duorarum;
    Metapenaeus ensis;
    Metapenaeus monoceros;
    Metapenaeus dobsoni;
    Macrobrachium rosenbergii;
    Macrobrachium nipponense;
    Macrobrachium malcolmsonii;
    Chinese wolhandkrab=Eriocheir sinensis;
    Scylla serrata;
    Scylla olivacea;
    Scylla paramamosain;
    Scylla tranquebarica;
    Portunus pelagicus;
    Portunus trituberculatus;
    Callinectes sapidus;
    Procambarus clarkii;
    Procambarus zonangulus;
    Cherax quadricarinatus;
    Cherax destructor;
    Cherax tenuimanus;
    Astacus astacus;
    Pontastacus leptodactylus;
    Pacifastacus leniusculus;
    Homarus americanus;
    Homarus gammarus
  `, [1,46], 90);

  // ============================================================
  // GEKWEEKTE SCHELPDIEREN
  // ============================================================

  gehoudenDierenDeel7(`
    Gewone mossel=Mytilus edulis;
    Mytilus galloprovincialis;
    Mytilus chilensis;
    Mytilus trossulus;
    Perna viridis;
    Perna canaliculus;
    Perna perna;
    Japanse oester=Magallana gigas;
    Platte oester=Ostrea edulis;
    Ostrea chilensis;
    Ostrea lurida;
    Crassostrea virginica;
    Crassostrea rhizophorae;
    Crassostrea gasar;
    Crassostrea angulata;
    Crassostrea sikamea;
    Saccostrea glomerata;
    Saccostrea cucullata;
    Saccostrea commercialis;
    Sint-jakobsschelp=Pecten maximus;
    Pecten jacobaeus;
    Patinopecten yessoensis;
    Argopecten irradians;
    Argopecten purpuratus;
    Argopecten ventricosus;
    Chlamys farreri;
    Mimachlamys nobilis;
    Placopecten magellanicus;
    Ruditapes philippinarum;
    Ruditapes decussatus;
    Mercenaria mercenaria;
    Meretrix meretrix;
    Meretrix lusoria;
    Meretrix lyrata;
    Mactra veneriformis;
    Mactra chinensis;
    Anadara granosa;
    Anadara broughtonii;
    Anadara antiquata;
    Tegillarca granosa;
    Sinonovacula constricta;
    Solen grandis;
    Panopea generosa;
    Panopea globosa;
    Panopea zelandica;
    Haliotis discus hannai;
    Haliotis discus discus;
    Haliotis diversicolor;
    Haliotis midae;
    Haliotis rufescens;
    Haliotis fulgens;
    Haliotis corrugata;
    Haliotis laevigata;
    Haliotis rubra;
    Haliotis tuberculata;
    Haliotis asinina;
    Haliotis gigantea
  `, [1,11,46], 90);

  // ============================================================
  // OVERIGE DIEREN DIE VOOR VOEDSEL WORDEN GEHOUDEN
  // ============================================================

  gehoudenDierenDeel7(`
    Wijngaardslak=Helix pomatia;
    Segrijnslak=Cornu aspersum;
    Achatina achatina;
    Lissachatina fulica;
    Archachatina marginata;
    Meelworm=Tenebrio molitor;
    Zophobas morio;
    Buffaloworm=Alphitobius diaperinus;
    Huiskrekel=Acheta domesticus;
    Gryllus bimaculatus;
    Gryllus assimilis;
    Trekkrekel;
    Locusta migratoria;
    Schistocerca gregaria;
    Zijderups=Bombyx mori;
    Honingbij=Apis mellifera;
    Apis cerana;
    Apis dorsata;
    Apis florea;
    Melipona beecheii;
    Melipona quadrifasciata;
    Tetragonisca angustula;
    Amerikaanse brulkikker;
    Lithobates catesbeianus;
    Hoplobatrachus rugulosus;
    Hoplobatrachus tigerinus;
    Pelophylax ridibundus;
    Pelodiscus sinensis;
    Chinese alligator;
    Amerikaanse alligator;
    Nijlkrokodil;
    Zeekrokodil;
    Siamees krokodil;
    Holothuria scabra;
    Apostichopus japonicus;
    Isostichopus badionotus;
    Parastichopus californicus;
    Strongylocentrotus intermedius;
    Strongylocentrotus droebachiensis;
    Mesocentrotus nudus;
    Paracentrotus lividus;
    Tripneustes gratilla
  `, [46], 90);

  // ============================================================
  // DIERENTUINDIEREN - GROTE ZOOGDIEREN
  // ============================================================

  koppel(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Giraffe;
    Okapi;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Nijlpaard;
    Dwergnijlpaard;
    Gewone zebra;
    Grévyzebra;
    Bergzebra;
    Onager;
    Kiang;
    Przewalskipaard;
    Amerikaanse bizon;
    Europese bizon;
    Gaur;
    Banteng;
    Yak;
    Waterbuffel;
    Muskusos;
    Eland;
    Rendier;
    Edelhert;
    Damhert;
    Sikahert;
    Wapiti;
    Muntiacus reevesi;
    Pudu puda;
    Maleise tapir;
    Tapirus terrestris;
    Tapirus bairdii;
    Tapirus pinchaque;
    Dromedaris;
    Kameel;
    Lama;
    Alpaca;
    Guanaco;
    Vicuna;
    Wrattenzwijn;
    Penseelzwijn;
    Visayawrattenzwijn;
    Babiroessa;
    Halsbandpekari;
    Witlippekari;
    Blauwe gnoe;
    Zwarte gnoe;
    Impala;
    Springbok;
    Hartebeest;
    Blesbok;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Bongo;
    Elandantilope;
    Reuzenelandantilope;
    Sabelantilope;
    Roanantilope;
    Gemsbok;
    Beisa;
    Algazel;
    Addax;
    Waterbok;
    Kob;
    Puku;
    Nijlantilope;
    Klipspringer;
    Gerenoek;
    Dorcasgazelle;
    Damagazelle;
    Grantgazelle;
    Thomsongazelle;
    Saiga;
    Nijlgau;
    Zwarte antilope;
    Takin;
    Bharal;
    Alpensteenbok;
    Siberische steenbok;
    Schroefhoorngeit;
    Barbarijs schaap;
    Moeflon;
    Japanse bosgems
  `, [3], 65);

  // ============================================================
  // DIERENTUINDIEREN - ROOFDIEREN
  // ============================================================

  koppel(`
    Leeuw;
    Tijger;
    Jaguar;
    Luipaard;
    Sneeuwluipaard;
    Nevelpanter;
    Jachtluipaard;
    Poema;
    Ocelot;
    Margay;
    Serval;
    Caracal;
    Zwartvoetkat;
    Vissende kat;
    Bengaalse tijgerkat;
    Europese lynx;
    Canadese lynx;
    Rode lynx;
    Woestijnlynx;
    Bruine beer;
    IJsbeer;
    Amerikaanse zwarte beer;
    Aziatische zwarte beer;
    Maleise beer;
    Lippenbeer;
    Brilbeer;
    Reuzenpanda;
    Rode panda;
    Wolf;
    Rode wolf;
    Manenwolf;
    Afrikaanse wilde hond;
    Aziatische wilde hond;
    Fennek;
    Grootoorvos;
    Rode vos;
    Poolvos;
    Wasbeerhond;
    Gevlekte hyena;
    Gestreepte hyena;
    Bruine hyena;
    Aardwolf;
    Stokstaartje;
    Zebramangoeste;
    Dwergmangoeste;
    Vosmangoeste;
    Egyptische ichneumon;
    Binturong;
    Afrikaanse civet;
    Genetkat;
    Fossa;
    Europese otter;
    Reuzenotter;
    Dwergotter;
    Canadese otter;
    Zeeotter;
    Europese das;
    Honingdas;
    Veelvraat;
    Boommarter;
    Steenmarter;
    Fret;
    Zorilla;
    Wasbeer;
    Neusbeer;
    Kinkajoe;
    Olingo;
    Gestreept stinkdier
  `, [3], 65);

  // ============================================================
  // DIERENTUINDIEREN - PRIMATEN
  // ============================================================

  gehoudenDierenDeel7(`
    Chimpansee=Pan troglodytes;
    Bonobo=Pan paniscus;
    Westelijke gorilla=Gorilla gorilla;
    Borneose orang-oetan=Pongo pygmaeus;
    Sumatraanse orang-oetan=Pongo abelii;
    Siamang=Symphalangus syndactylus;
    Withandgibbon=Hylobates lar;
    Hylobates agilis;
    Hylobates moloch;
    Hylobates muelleri;
    Hylobates pileatus;
    Nomascus leucogenys;
    Nomascus gabriellae;
    Nomascus siki;
    Hoolock hoolock;
    Ringstaartmaki=Lemur catta;
    Vari=Varecia variegata;
    Rode vari=Varecia rubra;
    Eulemur fulvus;
    Eulemur macaco;
    Eulemur coronatus;
    Eulemur mongoz;
    Eulemur rubriventer;
    Eulemur rufifrons;
    Eulemur collaris;
    Eulemur flavifrons;
    Eulemur sanfordi;
    Hapalemur griseus;
    Prolemur simus;
    Propithecus coquereli;
    Propithecus verreauxi;
    Vingerdier=Daubentonia madagascariensis;
    Microcebus murinus;
    Cheirogaleus medius;
    Galago senegalensis;
    Galago moholi;
    Otolemur garnettii;
    Nycticebus coucang;
    Xanthonycticebus pygmaeus;
    Loris tardigradus;
    Potto;
    Mandril=Mandrillus sphinx;
    Drill=Mandrillus leucophaeus;
    Mantelbaviaan;
    Beerbaviaan;
    Gele baviaan;
    Groene baviaan;
    Gelada;
    Huzaaraap;
    Japanse makaak;
    Berberaap;
    Java-aap;
    Resusaap;
    Beermakaak;
    Leeuwenstaartmakaak;
    Celebesmakaak;
    Macaca nigra;
    Macaca silenus;
    Macaca nemestrina;
    Macaca arctoides;
    Macaca thibetana;
    Vervet;
    Groene meerkat;
    Diana-meerkat;
    Rolowaymeerkat;
    Brazza-meerkat;
    Monameerkat;
    Rode meerkat;
    Uilenkopmeerkat;
    Cercopithecus mitis;
    Cercopithecus neglectus;
    Cercopithecus petaurista;
    Cercopithecus ascanius;
    Cercopithecus cephus;
    Allenopithecus nigroviridis;
    Zwart-witte franjeaap;
    Colobus guereza;
    Colobus angolensis;
    Colobus polykomos;
    Trachypithecus obscurus;
    Trachypithecus auratus;
    Trachypithecus francoisi;
    Trachypithecus hatinhensis;
    Trachypithecus cristatus;
    Semnopithecus entellus;
    Pygathrix nemaeus;
    Neusaap=Nasalis larvatus;
    Doodshoofdaapje;
    Saimiri sciureus;
    Saimiri boliviensis;
    Saimiri oerstedii;
    Saimiri vanzolinii;
    Cebus capucinus;
    Cebus imitator;
    Sapajus apella;
    Sapajus libidinosus;
    Sapajus xanthosternos;
    Ateles geoffroyi;
    Ateles paniscus;
    Ateles fusciceps;
    Ateles belzebuth;
    Ateles hybridus;
    Lagothrix lagothricha;
    Lagothrix poeppigii;
    Alouatta caraya;
    Alouatta seniculus;
    Alouatta palliata;
    Alouatta pigra;
    Alouatta guariba;
    Pithecia pithecia;
    Chiropotes satanas;
    Chiropotes chiropotes;
    Cacajao calvus;
    Callicebus personatus;
    Plecturocebus cupreus;
    Plecturocebus donacophilus;
    Aotus trivirgatus;
    Aotus azarae;
    Aotus nancymaae;
    Gouden leeuwaapje;
    Goudkopleeuwaapje;
    Zwart leeuwaapje;
    Dwergzijdeaapje;
    Gewone zijdeaap;
    Witgezichtzijdeaap;
    Witpluimzijdeaap;
    Zwartpluimzijdeaap;
    Zilverzijdeaap;
    Callithrix jacchus;
    Callithrix penicillata;
    Callithrix geoffroyi;
    Callithrix kuhlii;
    Mico argentatus;
    Mico humeralifer;
    Mico melanurus;
    Keizertamarin;
    Pinché-aapje;
    Roodbuiktamarin;
    Roodhandtamarin;
    Saguinus imperator;
    Saguinus midas;
    Saguinus oedipus;
    Saguinus geoffroyi;
    Saguinus bicolor;
    Leontocebus fuscicollis;
    Leontocebus nigricollis;
    Callimico goeldii
  `, [3,20], 80);

  // ============================================================
  // DIERENTUINDIEREN - BUIDELDIEREN EN KLEINE ZOOGDIEREN
  // ============================================================

  koppel(`
    Koala;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Bergkangoeroe;
    Moeraswallaby;
    Bennetts wallaby;
    Notamacropus eugenii;
    Notamacropus agilis;
    Notamacropus parma;
    Quokka;
    Petrogale xanthopus;
    Petrogale penicillata;
    Dendrolagus goodfellowi;
    Dendrolagus matschiei;
    Gewone wombat;
    Lasiorhinus latifrons;
    Tasmaanse duivel;
    Dasyurus viverrinus;
    Dasyurus maculatus;
    Suikereekhoorn;
    Voskoesoe;
    Grote bilby;
    Vogelbekdier;
    Mierenegel;
    Reuzenmiereneter;
    Tamandua tetradactyla;
    Tamandua mexicana;
    Tweevingerige luiaard;
    Hoffmannluiaard;
    Drievingerige luiaard;
    Negenbandgordeldier;
    Zesbandgordeldier;
    Driebandgordeldier;
    Aardvarken;
    Capibara;
    Mara;
    Chinchilla;
    Degoe;
    Beverrat;
    Bever;
    Canadese bever;
    Kaaps stekelvarken;
    Hystrix cristata;
    Hystrix indica;
    Erethizon dorsatum;
    Coendou prehensilis;
    Naakte molrat;
    Fukomys damarensis;
    Cynomys ludovicianus;
    Cynomys leucurus;
    Cynomys gunnisoni;
    Grote vliegende hond;
    Indische vliegende hond;
    Rodriguesvleerhond;
    Nijlroezet;
    Pteropus vampyrus;
    Pteropus giganteus;
    Pteropus rodricensis;
    Rousettus aegyptiacus;
    Echinops telfairi;
    Tenrec ecaudatus;
    Afrikaanse witbuikegel;
    Vierteenegel;
    Europese egel;
    Reuzenspringmuis
  `, [3], 80);

  // ============================================================
  // DIERENTUINDIEREN - VOGELS
  // ============================================================

  koppel(`
    Struisvogel;
    Somalische struisvogel;
    Emoe;
    Helmkasuaris;
    Grote nandoe;
    Kleine nandoe;
    Keizerspinguïn;
    Koningspinguïn;
    Adéliepinguïn;
    Ezelspinguïn;
    Kinbandpinguïn;
    Humboldtpinguïn;
    Magelhaenpinguïn;
    Zwartvoetpinguïn;
    Dwergpinguïn;
    Macaronipinguïn;
    Rotspinguïn;
    Noordelijke rotspinguïn;
    Grote flamingo;
    Kleine flamingo;
    Rode flamingo;
    Chileense flamingo;
    Andesflamingo;
    Jamesflamingo;
    Roze pelikaan;
    Kroeskoppelikaan;
    Bruine pelikaan;
    Australische pelikaan;
    Knobbelzwaan;
    Zwarte zwaan;
    Zwarthalszwaan;
    Trompetzwaan;
    Coscorobazwaan;
    Nijlgans;
    Canadese gans;
    Brandgans;
    Rotgans;
    Sneeuwgans;
    Indische gans;
    Hawaïgans;
    Magelhaengans;
    Manengans;
    Mandarijneend;
    Carolina-eend;
    Bronskopeend;
    Roodschoudereend;
    Puna-eend;
    Marmereend;
    Bahamapijlstaart;
    Australische fluiteend;
    Witwangfluiteend;
    Roodbekfluiteend;
    Zwarte ooievaar;
    Ooievaar;
    Maraboe;
    Zadelbekooievaar;
    Schoenbekooievaar;
    Rode ibis;
    Heilige ibis;
    Zwarte ibis;
    Hadada-ibis;
    Lepelaar;
    Rode lepelaar;
    Kraanvogel;
    Grijze kroonkraanvogel;
    Zwarte kroonkraanvogel;
    Jufferkraanvogel;
    Blauwe kraanvogel;
    Saruskraanvogel;
    Siberische kraanvogel;
    Japanse kraanvogel;
    Canadese kraanvogel;
    Trompetvogel;
    Kagu;
    Zonral;
    Kuifseriema;
    Secretarisvogel;
    Andescondor;
    Californische condor;
    Vale gier;
    Monniksgier;
    Lammergier;
    Palmgier;
    Koningsgier;
    Witkopgier;
    Oorgier;
    Steenarend;
    Zeearend;
    Amerikaanse zeearend;
    Stellers zeearend;
    Harpij;
    Filipijnse arend;
    Bateleur;
    Vechtarend;
    Keizerarend;
    Slechtvalk;
    Giervalk;
    Sakervalk;
    Oehoe;
    Sneeuwuil;
    Kerkuil;
    Bosuil;
    Laplanduil;
    Oeraluil;
    Steenuil;
    Holenuil;
    Briluil;
    Visuil;
    Blauwgele ara;
    Geelvleugelara;
    Groenvleugelara;
    Hyacintara;
    Soldatenara;
    Grijze roodstaartpapegaai;
    Timnehpapegaai;
    Edelpapegaai;
    Palmkaketoe;
    Geelkuifkaketoe;
    Molukkenkaketoe;
    Witkuifkaketoe;
    Roze kaketoe;
    Goffinskaketoe;
    Inka-kaketoe;
    Regenbooglori;
    Goudparkiet;
    Zonparkiet;
    Reuzentoekan;
    Roodsnaveltoekan;
    Zwavelborsttoekan;
    Pteroglossus aracari;
    Pteroglossus viridis;
    Buceros bicornis;
    Buceros rhinoceros;
    Buceros hydrocorax;
    Anthracoceros albirostris;
    Anthracoceros malayanus;
    Aceros nipalensis;
    Rhyticeros undulatus;
    Rhyticeros plicatus;
    Bucorvus leadbeateri;
    Bucorvus abyssinicus;
    Musophaga violacea;
    Tauraco erythrolophus;
    Tauraco persa;
    Tauraco porphyreolophus;
    Tauraco leucotis;
    Corythaixoides concolor;
    Crinifer piscator;
    Blauwe pauw;
    Groene pauw;
    Goudfazant;
    Lady Amherstfazant;
    Zilverfazant;
    Koningsfazant;
    Helmhokko;
    Grote hokko;
    Cracidae;
    Parelhoen;
    Gierparelhoen;
    Victoria kroonduif;
    Waaierkroonduif;
    Nicobarduif;
    Geelvoetduif;
    Diamantduif;
    Zebraduif
  `, [3], 80);

  // ============================================================
  // DIERENTUINDIEREN - REPTIELEN
  // ============================================================

  koppel(`
    Komodovaraan;
    Nijlvaraan;
    Varanus salvator;
    Varanus salvadorii;
    Varanus prasinus;
    Varanus beccarii;
    Varanus macraei;
    Varanus exanthematicus;
    Varanus acanthurus;
    Varanus mertensi;
    Varanus giganteus;
    Groene leguaan;
    Zeeleguaan;
    Cyclura cornuta;
    Cyclura nubila;
    Cyclura lewisi;
    Cyclura pinguis;
    Cyclura ricordi;
    Cyclura carinata;
    Ctenosaura similis;
    Ctenosaura pectinata;
    Baardagame;
    Pogona barbata;
    Chlamydosaurus kingii;
    Basiliscus plumifrons;
    Basiliscus basiliscus;
    Uromastyx aegyptia;
    Uromastyx ornata;
    Uromastyx geyri;
    Uromastyx ocellata;
    Hydrosaurus amboinensis;
    Hydrosaurus pustulatus;
    Physignathus cocincinus;
    Intellagama lesueurii;
    Tiliqua scincoides;
    Tiliqua gigas;
    Tiliqua rugosa;
    Corucia zebrata;
    Tribolonotus gracilis;
    Heloderma suspectum;
    Heloderma horridum;
    Jemenkameleon;
    Panterkameleon;
    Jacksonkameleon;
    Calumma parsonii;
    Luipaardgekko;
    Gekko gecko;
    Correlophus ciliatus;
    Rhacodactylus leachianus;
    Rhacodactylus auriculatus;
    Phelsuma grandis;
    Phelsuma laticauda;
    Phelsuma klemmeri;
    Uroplatus fimbriatus;
    Uroplatus henkeli;
    Uroplatus phantasticus;
    Nijlkrokodil;
    Zeekrokodil;
    Amerikaanse krokodil;
    Cubaanse krokodil;
    Siamese krokodil;
    Filipijnse krokodil;
    Australische zoetwaterkrokodil;
    Amerikaanse alligator;
    Chinese alligator;
    Zwarte kaaiman;
    Brilkaaiman;
    Caiman latirostris;
    Caiman yacare;
    Paleosuchus palpebrosus;
    Paleosuchus trigonatus;
    Gaviaal;
    Onechte gaviaal;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Chelonoidis niger;
    Sporenschildpad;
    Luipaardschildpad;
    Stralenschildpad;
    Griekse landschildpad;
    Moorse landschildpad;
    Vierteenlandschildpad;
    Klokschildpad;
    Roodpootschildpad;
    Geelpootschildpad;
    Indiase sterschildpad;
    Birmese sterschildpad;
    Manouria emys;
    Europese moerasschildpad;
    Diamantrugschildpad;
    Roodwangschildpad;
    Geelwangschildpad;
    Geelbuikschildpad;
    Bijtschildpad;
    Alligatorschildpad;
    Matamata;
    Varkensneusschildpad;
    Koningspython;
    Tijgerpython;
    Birmese python;
    Netpython;
    Rotspython;
    Groene anaconda;
    Gele anaconda;
    Boa constrictor;
    Boa imperator;
    Corallus caninus;
    Corallus hortulana;
    Morelia viridis;
    Morelia spilota;
    Simalia boeleni;
    Antaresia childreni;
    Antaresia maculosa;
    Aspidites melanocephalus;
    Aspidites ramsayi;
    Korenslang;
    Koningsslang;
    Melkslang;
    Zamenis longissimus;
    Groene mamba;
    Zwarte mamba;
    Koningscobra;
    Egyptische cobra;
    Kaapse cobra;
    Gabonadder;
    Pofadder;
    Crotalus atrox;
    Crotalus adamanteus;
    Crotalus horridus;
    Crotalus durissus;
    Bothrops asper;
    Bothrops jararaca;
    Lachesis muta;
    Binnenlandse taipan;
    Kusttaipan
  `, [3], 85);

  // ============================================================
  // DIERENTUINDIEREN - AMFIBIEËN
  // ============================================================

  koppel(`
    Axolotl;
    Vuursalamander;
    Chinese reuzensalamander;
    Japanse reuzensalamander;
    Cryptobranchus alleganiensis;
    Necturus maculosus;
    Ambystoma tigrinum;
    Ambystoma mavortium;
    Ambystoma maculatum;
    Neurergus kaiseri;
    Neurergus crocatus;
    Triturus cristatus;
    Triturus marmoratus;
    Ichthyosaura alpestris;
    Cynops pyrrhogaster;
    Hypselotriton orientalis;
    Tylototriton verrucosus;
    Tylototriton shanjing;
    Olm;
    Dendrobates tinctorius;
    Dendrobates auratus;
    Dendrobates leucomelas;
    Dendrobates truncatus;
    Oophaga pumilio;
    Oophaga histrionica;
    Oophaga lehmanni;
    Oophaga sylvatica;
    Phyllobates terribilis;
    Phyllobates bicolor;
    Phyllobates vittatus;
    Ranitomeya imitator;
    Ranitomeya reticulata;
    Ranitomeya variabilis;
    Ranitomeya fantastica;
    Ranitomeya summersi;
    Ranitomeya benedicta;
    Adelphobates galactonotus;
    Ameerega trivittata;
    Ameerega bassleri;
    Epipedobates anthonyi;
    Epipedobates tricolor;
    Roodoogboomkikker;
    Agalychnis callidryas;
    Agalychnis moreletii;
    Agalychnis spurrelli;
    Litoria caerulea;
    Litoria splendida;
    Litoria infrafrenata;
    Trachycephalus resinifictrix;
    Dyscophus antongilii;
    Dyscophus guineti;
    Ceratophrys ornata;
    Ceratophrys cranwelli;
    Ceratophrys cornuta;
    Pyxicephalus adspersus;
    Pyxicephalus edulis;
    Leptodactylus fallax;
    Rhinella marina;
    Atelopus zeteki;
    Atelopus varius;
    Mantella aurantiaca;
    Mantella baroni;
    Mantella madagascariensis;
    Mantella pulchra;
    Mantella viridis;
    Mantella expectata;
    Mantella ebenaui;
    Mantella betsileo;
    Mantella crocea;
    Mantella milotympanum;
    Xenopus laevis;
    Xenopus tropicalis;
    Hymenochirus boettgeri;
    Pipa pipa;
    Pipa carvalhoi
  `, [3], 85);

  // ============================================================
  // SYNONIEMEN EN DUBBELE RASNAMEN
  // ============================================================

  const synoniemenDeel7 = [

    ["Duitse herder", "Duitse herdershond"],

    ["Labrador retriever", "Labrador"],

    ["Bordercollie", "Border collie"],

    ["Jackrussellterriër", "Jack Russell"],

    ["Shetland sheepdog", "Sheltie"],

    ["Old English sheepdog", "Bobtail"],

    ["Dwergkees", "Pomeriaan"],

    ["West Highland white terrier", "Westie"],

    ["Teckel", "Dashond"],

    ["Dalmatier", "Dalmatiër"],

    ["Duitse dog", "Deense dog"],

    ["Cane corso", "Cane corso italiano"],

    ["Beauceron", "Beauc eron"],

    ["Leeuw hondje".replace(" ", ""), "Löwchen"],

    ["Koningspoedel", "Grote poedel"],

    ["Papillon", "Vlinderhondje"],

    ["Friese stabij", "Stabijhoun"],

    ["Presa canario", "Dogo canario"],

    ["Turkse angora", "Turkish angora"],

    ["Napoleonkat", "Minuet"],

    ["Heilige birmaan", "Birmaan"],

    ["Guppy", "Poecilia reticulata"],

    ["Endlerguppy", "Poecilia wingei"],

    ["Siamese kempvis", "Betta splendens"],

    ["Platy", "Xiphophorus maculatus"],

    ["Zwaarddrager", "Xiphophorus hellerii"],

    ["Citroentetra", "Hyphessobrycon pulchripinnis"],

    ["Vuurneon", "Hemigrammus erythrozonus"],

    ["Keizertetra", "Nematobrycon palmeri"],

    ["Diamantzalm", "Moenkhausia pittieri"],

    ["Neontetra", "Paracheirodon innesi"],

    ["Kardinaaltetra", "Paracheirodon axelrodi"],

    ["Celestichthys margaritatus", "Danio margaritatus"],

    ["Puntius titteya", "Pethia titteya"],

    ["Brevibora dorsiocellata", "Rasbora dorsiocellata"],

    ["Fundulopanchax sjostedti", "Fundulopanchax sjoestedti"],

    ["Telmatherina ladigesi", "Marosatherina ladigesi"],

    ["Xenopus laevis", "Afrikaanse klauwkikker"],

    ["Vuurgarnaal", "Neocaridina davidi"],

    ["Amanogarnaal", "Caridina multidentata"],

    ["Caridina multidentata", "Caridina japonica"],

    ["Neritina natalensis", "Vittina natalensis"],

    ["Crassostrea gigas", "Magallana gigas"],

    ["Anadara granosa", "Tegillarca granosa"],

    ["Litopenaeus vannamei", "Penaeus vannamei"],

    ["Lithobates catesbeianus", "Amerikaanse brulkikker"],

    ["Tinker", "Irish Cob"],

    ["Tinker", "Gypsy Vanner"],

    ["Andalusiër", "PRE"],

    ["Nederlands warmbloedpaard", "KWPN"],

    ["Belgisch trekpaard", "Brabants trekpaard"],

    ["Embdengans", "Emdener gans"],

    ["Muskuseend", "Muscovy-eend"],

    ["Krombekeend", "Hook Bill"],

    ["Roodkopamadine", "Amadina erythrocephala"],

    ["Bandvink", "Amadina fasciata"],

    ["Zebravink", "Taeniopygia guttata"],

    ["Gouldamadine", "Chloebia gouldiae"],

    ["Gouldamadine", "Erythrura gouldiae"],

    ["Javaanse rijstvogel", "Padda oryzivora"],

    ["Padda oryzivora", "Lonchura oryzivora"],

    ["Bonte boertje", "Poicephalus senegalus"],

    ["Bonte boertje", "Senegalpapegaai"],

    ["Zonparkiet", "Aratinga solstitialis"],

    ["Monniksparkiet", "Myiopsitta monachus"],

    ["Goudparkiet", "Guaruba guarouba"],

    ["Bourkeparkiet", "Neopsephotus bourkii"],

    ["Bergparkiet", "Regentparkiet"],

    ["Bergparkiet", "Polytelis anthopeplus"],

    ["Sumatrahoen", "Sumatra"],

    ["Asil", "Aseel"],

    ["Boschveldhoen", "Boschveld chicken"],

    ["Boschveldhoen", "Boschveld"],

    ["Crollwitzer kalkoen", "Cröllwitzer Pute"],

    ["Hampshirevarken", "Hampshire pig"],

    ["Hampshire Down", "Hampshireschaap"],

    ["Pygmeegeit", "Afrikaanse dwerggeit"],

    ["Angorageit", "Angora goat"],

    ["Kuifseriema", "Cariama cristata"]

  ];

  for (const [hoofdnaam, alternatief] of synoniemenDeel7) {

    verenigSynoniemenDeel2(
      hoofdnaam,
      alternatief
    );

  }

  // ============================================================
  // SPECIFIEKE DUBBELZINNIGE RASNAMEN
  // ============================================================

  // Hampshire kan zowel naar een schapenras als
  // naar een varkensras verwijzen.
  //
  // Jersey kan een runderras of onderdeel van
  // verschillende andere rasnamen zijn.
  //
  // Zulke records mogen niet blind worden samengevoegd.

  const hampshireVarkenDeel7 =
    zoekEen("Hampshirevarken");

  const hampshireSchaapDeel7 =
    zoekEen("Hampshire Down");

  if (
    hampshireVarkenDeel7 &&
    hampshireSchaapDeel7 &&
    hampshireVarkenDeel7 !== hampshireSchaapDeel7
  ) {

    voegKoppelingToe(
      hampshireVarkenDeel7,
      13,
      75
    );

    voegKoppelingToe(
      hampshireSchaapDeel7,
      13,
      75
    );

    voegKoppelingToe(
      hampshireVarkenDeel7,
      46,
      75
    );

    voegKoppelingToe(
      hampshireSchaapDeel7,
      46,
      75
    );

  }

  // ============================================================
  // HUISDIEREN - UITZONDERINGEN
  // ============================================================

  // Een dier dat uitsluitend in het wild of in
  // gespecialiseerde instellingen voorkomt, is
  // niet automatisch een huisdier.

  const geenGewoneHuisdierenDeel7 = `
    Leeuw;
    Tijger;
    Jaguar;
    Luipaard;
    Sneeuwluipaard;
    Jachtluipaard;
    IJsbeer;
    Bruine beer;
    Reuzenpanda;
    Gorilla;
    Chimpansee;
    Bonobo;
    Orang-oetan;
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Nijlpaard;
    Dwergnijlpaard;
    Giraffe;
    Okapi;
    Blauwe vinvis;
    Potvis;
    Orka;
    Tuimelaar;
    Witte haai;
    Walvishaai;
    Komodovaraan;
    Zeekrokodil;
    Nijlkrokodil;
    Koningscobra;
    Zwarte mamba;
    Binnenlandse taipan;
    Witte haai;
    Kakapo
  `;

  for (const naam of geenGewoneHuisdierenDeel7.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [8]);
    }

  }

  // ============================================================
  // BOERDERIJDIEREN - UITZONDERINGEN
  // ============================================================

  const geenBoerderijdierenDeel7 = `
    Leeuw;
    Tijger;
    Luipaard;
    Jaguar;
    IJsbeer;
    Bruine beer;
    Gorilla;
    Chimpansee;
    Reuzenpanda;
    Koala;
    Afrikaanse savanneolifant;
    Giraffe;
    Okapi;
    Witte neushoorn;
    Witte haai;
    Blauwe vinvis;
    Orka;
    Komodovaraan;
    Zebravis;
    Neontetra;
    Siamese kempvis;
    Luipaardgekko;
    Korenslang
  `;

  for (const naam of geenBoerderijdierenDeel7.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [13]);
    }

  }

  // ============================================================
  // VOEDSELPRODUCTIE - UITZONDERINGEN
  // ============================================================

  // Alleen incidentele consumptie of jacht is niet
  // voldoende om een soort aan vraag 46 te koppelen.

  const geenVoedseldierenDeel7 = `
    Leeuw;
    Tijger;
    Jachtluipaard;
    Jaguar;
    Luipaard;
    Reuzenpanda;
    Koala;
    Gorilla;
    Chimpansee;
    Blauwe vinvis;
    Potvis;
    Orka;
    Witte haai;
    Walvishaai;
    IJsbeer;
    Neontetra;
    Zebravis;
    Siamese kempvis;
    Luipaardgekko;
    Korenslang;
    Koningspython;
    Grasparkiet;
    Valkparkiet;
    Kanarie;
    Zebravink
  `;

  for (const naam of geenVoedseldierenDeel7.split(";")) {

    if (naam.trim()) {
      verwijderKoppeling(naam.trim(), [46]);
    }

  }

  // ============================================================
  // HERGEBRUIK VAN GEHOUDEN DIEREN
  // ============================================================

  // De eigenschappen worden alleen toegepast op
  // reeds bestaande en expliciet gekoppelde dieren.
  //
  // Een willekeurig wild familielid van een huisdier
  // wordt hierdoor niet automatisch een huisdier.

  let automatischeHuisdierKoppelingenDeel7 = 0;

  const gehoudenSnapshotDeel7 = [...dieren.values()];

  for (const record of gehoudenSnapshotDeel7) {

    if (!record || !record.vragen) continue;

    if (record.vragen.has(43)) continue;

    const namen = [
      record.naam,
      ...Array.from(record.synoniemen || [])
    ];

    const isAquariumvis =

      record.vragen.has(8) &&

      namen.some(naam =>
        /^(Betta|Apistogramma|Corydoras|Ancistrus|Hypancistrus|Panaqolus|Danio|Rasbora|Boraras|Hyphessobrycon|Paracheirodon|Melanotaenia|Pseudomugil|Nothobranchius|Aphyosemion|Fundulopanchax|Trichogaster|Trichopodus|Amphiprion|Zebrasoma|Gobiodon|Ecsenius)\s/i
          .test(String(naam))
      );

    if (isAquariumvis) {

      for (const nummer of [1,14,18]) {

        if (record.vragen.has(nummer)) continue;

        voegKoppelingToe(
          record,
          nummer,
          85
        );

        automatischeHuisdierKoppelingenDeel7++;

      }

    }

    const isGehoudenPapegaai =

      record.vragen.has(8) &&

      namen.some(naam =>
        /^(Ara|Amazona|Agapornis|Pionus|Pyrrhura|Forpus|Poicephalus|Platycercus|Neophema|Trichoglossus|Cacatua)\s/i
          .test(String(naam))
      );

    if (isGehoudenPapegaai) {

      for (const nummer of [2,7,18,22]) {

        if (record.vragen.has(nummer)) continue;

        voegKoppelingToe(
          record,
          nummer,
          85
        );

        automatischeHuisdierKoppelingenDeel7++;

      }

    }

  }

  // ============================================================
  // SPECIFIEKE CORRECTIES
  // ============================================================

  // Uitgestorven en twijfelachtige namen niet
  // automatisch als actuele huisdieren accepteren.

  const correctiesDeel7 = [

    ["Lincolnshire Curly Coat", [13,46]],

    ["Scottish Dunface", [13,46]],

    ["Psephotellus pulcherrimus", [3,8,13,46]],

    ["Carolina parkiet", [3,8]],

    ["Conuropsis carolinensis", [3,8]],

    ["Kakapo", [8]],

    ["Spixara", [8]],

    ["Cyanopsitta spixii", [8]],

    ["Przewalskipaard", [8]],

    ["Mishimapaard", [8]],

    ["Galapagosreuzenschildpad", [8]],

    ["Aldabra-reuzenschildpad", [8]],

    ["Maanvis van de zee", [8]],

    ["Mola mola", [8]],

    ["Koningscobra", [8]],

    ["Zwarte mamba", [8]],

    ["Groene mamba", [8]],

    ["Westelijke groene mamba", [8]],

    ["Binnenlandse taipan", [8]],

    ["Kusttaipan", [8]],

    ["Pofadder", [8]],

    ["Gabonadder", [8]],

    ["Chinese reuzensalamander", [8]],

    ["Japanse reuzensalamander", [8]],

    ["Cracidae", [3,50]],

    ["Sneeuwgeitras", [13,46,50]],

    ["Kulan-ezelras", [13,50]],

    ["Groenlandse kip", [13,50]],

    ["Apistogramma rotpunkt", [1,8,14,50]],

    ["Ecsenius bicoloris", [1,8,11,14,50]]

  ];

  for (const [naam, vragen] of correctiesDeel7) {

    verwijderKoppeling(naam, vragen);

  }

  // ============================================================
  // UITGESTORVEN RASSEN
  // ============================================================

  koppel(`
    Lincolnshire Curly Coat;
    Scottish Dunface
  `, [43], 90);

  // ============================================================
  // EXTRA CONTROLETESTS - DEEL 7
  // ============================================================

  const extraGehoudenDierenTestsDeel7 = [

    // Dierentuinen

    [3, "Leeuw", true],
    [3, "Tijger", true],
    [3, "Giraffe", true],
    [3, "Koala", true],
    [3, "Reuzenpanda", true],
    [3, "Rode panda", true],
    [3, "Stokstaartje", true],
    [3, "Komodovaraan", true],
    [3, "Capibara", true],
    [3, "Okapi", true],
    [3, "Aardvarken", true],
    [3, "Tasmaanse duivel", true],
    [3, "Humboldtpinguïn", true],
    [3, "Blauwgele ara", true],
    [3, "Aldabra-reuzenschildpad", true],

    // Huisdieren

    [8, "Hond", true],
    [8, "Kat", true],
    [8, "Konijn", true],
    [8, "Cavia", true],
    [8, "Goudhamster", true],
    [8, "Chihuahua", true],
    [8, "Labrador", true],
    [8, "Labrador retriever", true],
    [8, "Golden retriever", true],
    [8, "Duitse herder", true],
    [8, "Bordercollie", true],
    [8, "Border collie", true],
    [8, "Teckel", true],
    [8, "Dashond", true],
    [8, "Maine coon", true],
    [8, "Ragdoll", true],
    [8, "Britse korthaar", true],
    [8, "Siamese kat", true],
    [8, "Vlaamse reus", true],
    [8, "Grasparkiet", true],
    [8, "Valkparkiet", true],
    [8, "Kanarie", true],
    [8, "Neontetra", true],
    [8, "Guppy", true],
    [8, "Siamese kempvis", true],
    [8, "Luipaardgekko", true],
    [8, "Baardagame", true],
    [8, "Axolotl", true],
    [8, "IJsbeer", false],
    [8, "Leeuw", false],
    [8, "Tijger", false],
    [8, "Walvishaai", false],
    [8, "Orka", false],
    [8, "Giraffe", false],

    // Boerderijdieren

    [13, "Koe", true],
    [13, "Schaap", true],
    [13, "Geit", true],
    [13, "Varken", true],
    [13, "Kip", true],
    [13, "Paard", true],
    [13, "Alpaca", true],
    [13, "Lama", true],
    [13, "Texelaar", true],
    [13, "Zwartbles", true],
    [13, "Hampshire Down", true],
    [13, "Hampshirevarken", true],
    [13, "Holstein-Friesian", true],
    [13, "Groninger blaarkop", true],
    [13, "Schotse hooglander", true],
    [13, "Jersey", true],
    [13, "Duroc", true],
    [13, "Mangalica", true],
    [13, "Barnevelder", true],
    [13, "Welsumer", true],
    [13, "Fries paard", true],
    [13, "Shetlandpony", true],
    [13, "Haflinger", true],
    [13, "Nederlands trekpaard", true],
    [13, "Leeuw", false],
    [13, "Reuzenpanda", false],
    [13, "Neontetra", false],

    // Voedselproductie

    [46, "Koe", true],
    [46, "Schaap", true],
    [46, "Varken", true],
    [46, "Kip", true],
    [46, "Texelaar", true],
    [46, "Hampshirevarken", true],
    [46, "Hampshire Down", true],
    [46, "Holstein-Friesian", true],
    [46, "Duroc", true],
    [46, "Pekingeend", true],
    [46, "Japanse kwartel", true],
    [46, "Atlantische zalm", true],
    [46, "Regenboogforel", true],
    [46, "Karper", true],
    [46, "Oreochromis niloticus", true],
    [46, "Afrikaanse meerval", true],
    [46, "Gewone mossel", true],
    [46, "Japanse oester", true],
    [46, "Meelworm", true],
    [46, "Wijngaardslak", true],
    [46, "Leeuw", false],
    [46, "Koala", false],
    [46, "Neontetra", false],
    [46, "Grasparkiet", false],

    // Uitgestorven rassen

    [43, "Lincolnshire Curly Coat", true],
    [43, "Scottish Dunface", true],

    [13, "Lincolnshire Curly Coat", false],
    [46, "Lincolnshire Curly Coat", false]

  ];

  // ============================================================
  // VOORTGANG NA DEEL 7
  // ============================================================

  const voortgangNaDeel7 =
    volledigeVoortgangV92();

  const gehoudenVragenDeel7 = [
    3,8,13,46
  ];

  const rapportGehoudenDierenDeel7 =
    voortgangNaDeel7.filter(
      vraag => gehoudenVragenDeel7.includes(
        vraag.vraag
      )
    );

  const tussentijdsRapportDeel7 = {

    versie: VERSIE,

    dierrecordsBijStart:
      beginAantalDieren,

    dierrecordsNu:
      dieren.size,

    bruikbareDierrecords:
      [...dieren.values()].filter(
        record => record.vragen.size > 0
      ).length,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    verwijderdeKoppelingen,

    automatischeHuisdierKoppelingen:
      automatischeHuisdierKoppelingenDeel7,

    conflictenBijToevoegen:
      conflictenBijToevoegen.length,

    ontbrekendeKoppelingen:
      ontbrekendeKoppelingen.length,

    vragenMet1000Antwoorden:
      voortgangNaDeel7.filter(
        vraag => vraag.streefdoelBereikt
      ).length,

    ontbrekendTotStreefdoel:
      voortgangNaDeel7.reduce(
        (som, vraag) => som + vraag.tekort,
        0
      ),

    voortgangPercentage:
      Number(
        (
          voortgangNaDeel7.reduce(
            (som, vraag) =>
              som + Math.min(
                vraag.nieuweAntwoorden,
                1000
              ),
            0
          ) / 50000 * 100
        ).toFixed(2)
      )

  };

  console.group(
    "QuizBallon V9.2 - Aanvulling 2 - Deel 7"
  );

  console.table(
    tussentijdsRapportDeel7
  );

  console.table(
    rapportGehoudenDierenDeel7
  );

  console.table(
    voortgangNaDeel7
  );

  console.groupEnd();

  // ============================================================
  // EINDE AANVULLING 2 - DEEL 7
  // HET BESTAND NOG NIET AFSLUITEN
  // DEEL 8 KOMT HIERONDER
  // ============================================================
   // ============================================================
  // QUIZBALLON V9.2 - AANVULLING 2 - DEEL 8
  // DEFINITIEVE VERWERKING, CONTROLE EN EXPORT
  // ============================================================

  const eindStartV92 = Date.now();

  const vorigeCategorieV92 =
    window.QB_V9_CATEGORIEEN.Dieren;

  const vorigeDebugV92 =
    window.QB_V9_DIeren_DEBUG;

  // ============================================================
  // NORMALISATIE
  // ============================================================

  function eindNormaliseerV92(waarde) {

    return String(waarde ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/æ/g, "ae")
      .replace(/œ/g, "oe")
      .replace(/[^a-z0-9]/g, "");

  }

  function eindSchoneNaamV92(waarde) {

    return String(waarde ?? "")
      .replace(/\s+/g, " ")
      .trim();

  }

  function eindHashV92(waarde) {

    const tekst = String(waarde);

    let hash = 2166136261;

    for (let i = 0; i < tekst.length; i++) {

      hash ^= tekst.charCodeAt(i);

      hash = Math.imul(
        hash,
        16777619
      );

    }

    return hash >>> 0;

  }

  function eindGeldigeVraagV92(nummer) {

    return Number.isInteger(nummer) &&
      nummer >= 1 &&
      nummer <= 50;

  }

  // ============================================================
  // RAKETTENFORMULE
  // ============================================================

  function eindAantalRakettenV92(aantal) {

    const n = Math.floor(Number(aantal));

    if (!Number.isFinite(n) || n <= 0) {

      return 0;

    }

    return Math.max(
      1,
      Math.ceil((n + 50) / 100)
    );

  }

  // 1 - 50 antwoorden       = 1 raket
  // 51 - 150 antwoorden     = 2 raketten
  // 151 - 250 antwoorden    = 3 raketten
  // 251 - 350 antwoorden    = 4 raketten
  //
  // Daarna komt er steeds een raket bij
  // per volgende 100 antwoorden.

  // ============================================================
  // DEFINITIEVE RAPPORTVARIABELEN
  // ============================================================

  const eindExportFoutenV92 = [];

  const eindWaarschuwingenV92 = [];

  const eindNaamconflictenV92 = [];

  const eindDubbeleNamenV92 = [];

  const eindVerwijderdeRecordsV92 = [];

  const eindCorrectiesV92 = [];

  const eindVraagIndexenV92 = new Map();

  const eindLetterCacheV92 = new Map();

  // ============================================================
  // LAATSTE INHOUDELIJKE CORRECTIES
  // ============================================================

  const eindHandmatigeCorrectiesV92 = [

    ["Gem s", [1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20,
      21,22,23,24,25,26,27,28,29,30,
      31,32,33,34,35,36,37,38,39,40,
      41,42,43,44,45,46,47,48,49,50]],

    ["Sneeuwgeitras", [13,46,50]],

    ["Kulan-ezelras", [13,46,50]],

    ["Sylphid hummingbird", [2,7,18,22,47,50]],

    ["Ecsenius bicoloris", [1,8,11,14,50]],

    ["Apistogramma rotpunkt", [1,8,14,50]],

    ["Deroceras", [43]],

    ["Deroceras reticulatum", [43]],

    ["Deroceras agreste", [43]],

    ["Deroceras laeve", [43]],

    ["Deroceras invadens", [43]],

    ["Mola mola", [8]],

    ["Pterophyllum scalare", [11]],

    ["Zwarte mamba", [8,13,46]],

    ["Koningscobra", [8,13,46]],

    ["Kakapo", [2,8]],

    ["Struisvogel", [2,4]],

    ["Emoe", [2,4]],

    ["Keizerspinguïn", [2,4]],

    ["Koningspinguïn", [2,4]],

    ["Hazelworm", [4]],

    ["Korenslang", [4,45]],

    ["Koningspython", [4,45]],

    ["Edelhert", [19]],

    ["Damhert", [19]],

    ["Ree", [19]],

    ["Eland", [19]],

    ["Walrus", [19]],

    ["Narwal", [19]],

    ["Koala", [15,17,28]],

    ["Leeuw", [8,13,16,28,46]],

    ["Tijger", [8,13,16,28,46]],

    ["Orka", [4,8,13,16,46]],

    ["Witte haai", [4,8,13,46]],

    ["Blauwe vinvis", [4,8,13,46]],

    ["Koekoek", [41]],

    ["Tuojiangosaurus", [36]],

    ["Brachytrachelopan", [36]],

    ["Jaffarabadi", [50]],

    ["Zaglossus bruijnii", [15]],

    ["Zaglossus bartoni", [15]],

    ["Zaglossus attenboroughi", [15]]

  ];

  for (
    const [naam, vragen] of
    eindHandmatigeCorrectiesV92
  ) {

    // Gem s normaliseert naar dezelfde sleutel
    // als Gems. Daarom mag deze specifieke
    // correctie niet via een aliaszoeker lopen.

    if (naam === "Gem s") continue;

    const record = zoekEen(naam);

    if (!record) continue;

    const bestaandeVragen = vragen.filter(
      nummer => record.vragen.has(nummer)
    );

    if (bestaandeVragen.length === 0) {

      continue;

    }

    verwijderKoppeling(
      naam,
      bestaandeVragen
    );

    eindCorrectiesV92.push({

      naam,

      verwijderdeVragen:
        bestaandeVragen

    });

  }

  // ============================================================
  // SPELLINGSCORRECTIES
  // ============================================================

  const eindSpellingV92 = new Map([

    ["Gem s", "Gems"],

    ["Beauc eron", "Beauceron"],

    ["Wild waterbuffel", "Wilde waterbuffel"],

    ["Chinese weekschildschildpad",
      "Chinese weekschildpad"],

    ["Portugese oorlogsschip",
      "Portugees oorlogsschip"],

    ["Neon tetra", "Neontetra"],

    ["Dalmatier", "Dalmatiër"],

    ["Vicuna", "Vicuña"]

  ]);

  // ============================================================
  // BEKENDE SYNONIEMEN
  // ============================================================

  const eindSynoniemenV92 = [

    ["Gems", "Rupicapra rupicapra"],

    ["Jachtluipaard", "Acinonyx jubatus"],

    ["Leeuw", "Panthera leo"],

    ["Tijger", "Panthera tigris"],

    ["Jaguar", "Panthera onca"],

    ["Luipaard", "Panthera pardus"],

    ["Sneeuwluipaard", "Panthera uncia"],

    ["Poema", "Puma concolor"],

    ["Koala", "Phascolarctos cinereus"],

    ["Reuzenpanda", "Ailuropoda melanoleuca"],

    ["Rode panda", "Ailurus fulgens"],

    ["Okapi", "Okapia johnstoni"],

    ["Struisvogel", "Struthio camelus"],

    ["Emoe", "Dromaius novaehollandiae"],

    ["Helmkasuaris", "Casuarius casuarius"],

    ["Keizerspinguïn",
      "Aptenodytes forsteri"],

    ["Koningspinguïn",
      "Aptenodytes patagonicus"],

    ["Adéliepinguïn",
      "Pygoscelis adeliae"],

    ["Ezelspinguïn",
      "Pygoscelis papua"],

    ["Kinbandpinguïn",
      "Pygoscelis antarcticus"],

    ["Humboldtpinguïn",
      "Spheniscus humboldti"],

    ["Magelhaenpinguïn",
      "Spheniscus magellanicus"],

    ["Zwartvoetpinguïn",
      "Spheniscus demersus"],

    ["Galapagospinguïn",
      "Spheniscus mendiculus"],

    ["Blauwe vinvis",
      "Balaenoptera musculus"],

    ["Groenlandse walvis",
      "Balaena mysticetus"],

    ["Potvis",
      "Physeter macrocephalus"],

    ["Orka", "Orcinus orca"],

    ["Walvishaai", "Rhincodon typus"],

    ["Witte haai",
      "Carcharodon carcharias"],

    ["Komodovaraan",
      "Varanus komodoensis"],

    ["Koningspython",
      "Python regius"],

    ["Korenslang",
      "Pantherophis guttatus"],

    ["Korenslang",
      "Elaphe guttata"],

    ["Luipaardgekko",
      "Eublepharis macularius"],

    ["Baardagame",
      "Pogona vitticeps"],

    ["Axolotl",
      "Ambystoma mexicanum"],

    ["Vuursalamander",
      "Salamandra salamandra"],

    ["Europese egel",
      "Erinaceus europaeus"],

    ["Egel",
      "Erinaceus europaeus"],

    ["Europese mol",
      "Talpa europaea"],

    ["Rode eekhoorn",
      "Sciurus vulgaris"],

    ["Gewone octopus",
      "Octopus vulgaris"],

    ["Gewone zeekat",
      "Sepia officinalis"],

    ["Kruisspin",
      "Araneus diadematus"],

    ["Wespspin",
      "Argiope bruennichi"],

    ["Wijngaardslak",
      "Helix pomatia"],

    ["Noordkromp",
      "Arctica islandica"],

    ["Portugees oorlogsschip",
      "Physalia physalis"],

    ["Gaffelbok",
      "Antilocapra americana"],

    ["Gaffelbok",
      "Pronghorn"],

    ["Muskusos",
      "Ovibos moschatus"],

    ["Dromedaris",
      "Camelus dromedarius"],

    ["Kameel",
      "Camelus bactrianus"],

    ["Grasparkiet",
      "Melopsittacus undulatus"],

    ["Valkparkiet",
      "Nymphicus hollandicus"],

    ["Guppy",
      "Poecilia reticulata"],

    ["Neontetra",
      "Paracheirodon innesi"],

    ["Kardinaaltetra",
      "Paracheirodon axelrodi"],

    ["Zebravis",
      "Danio rerio"],

    ["Siamese kempvis",
      "Betta splendens"],

    ["Atlantische zalm",
      "Salmo salar"],

    ["Regenboogforel",
      "Oncorhynchus mykiss"],

    ["Europese paling",
      "Anguilla anguilla"],

    ["Gewone mossel",
      "Mytilus edulis"],

    ["Japanse oester",
      "Magallana gigas"],

    ["Japanse oester",
      "Crassostrea gigas"],

    ["Honingbij",
      "Apis mellifera"],

    ["Coloradokever",
      "Leptinotarsa decemlineata"],

    ["Meelworm",
      "Tenebrio molitor"]

  ];

  for (
    const [hoofdnaam, alternatief] of
    eindSynoniemenV92
  ) {

    verenigSynoniemenDeel2(
      hoofdnaam,
      alternatief
    );

  }

  // ============================================================
  // VEILIGE SAMENVOEGING VAN EXACT DEZELFDE NAMEN
  // ============================================================

  // Alleen records met dezelfde genormaliseerde
  // hoofdnaam worden hier samengevoegd.
  //
  // Een gedeelde alias is op zichzelf onvoldoende
  // bewijs dat twee dieren dezelfde soort zijn.

  const eindSamengevoegdeDierenV92 = new Map();

  function eindLeesPuntenV92(record, nummer) {

    const mogelijkeBronnen = [

      record.puntenPerVraag,

      record.vraagPunten,

      record.punten,

      record.points,

      record.scores,

      record.zeldzaamheid

    ];

    for (const bron of mogelijkeBronnen) {

      if (bron === undefined || bron === null) {

        continue;

      }

      let waarde;

      if (typeof bron === "number") {

        waarde = bron;

      } else if (
        typeof bron.get === "function"
      ) {

        waarde = bron.get(nummer);

        if (waarde === undefined) {

          waarde = bron.get(String(nummer));

        }

      } else if (
        typeof bron === "object"
      ) {

        waarde = bron[nummer];

      }

      if (
        waarde &&
        typeof waarde === "object"
      ) {

        waarde =
          waarde.points ??
          waarde.punten;

      }

      if (
        waarde !== undefined &&
        waarde !== null &&
        waarde !== "" &&
        Number.isFinite(Number(waarde))
      ) {

        return Math.max(
          10,
          Math.min(99, Number(waarde))
        );

      }

    }

    return null;

  }

  // ============================================================
  // OUDE PUNTEN ALS REFERENTIE BEWAREN
  // ============================================================

  const eindOudePuntenV92 = new Map();

  for (
    const vraag of
    vorigeCategorieV92.questions
  ) {

    const nummer = Number(
      vraag.questionNumber
    );

    if (!eindGeldigeVraagV92(nummer)) {

      continue;

    }

    const index = new Map();

    for (
      const antwoord of
      vraag.answers || []
    ) {

      const namen = [

        antwoord.answer,

        ...(antwoord.aliases || [])

      ];

      for (const naam of namen) {

        const sleutel =
          eindNormaliseerV92(naam);

        if (!sleutel) continue;

        const punten = Math.min(
          99,
          Math.max(
            10,
            Number(antwoord.points) || 75
          )
        );

        const bestaand =
          index.get(sleutel);

        index.set(
          sleutel,
          bestaand === undefined
            ? punten
            : Math.min(bestaand, punten)
        );

      }

    }

    eindOudePuntenV92.set(
      nummer,
      index
    );

  }

  // ============================================================
  // DIERRECORDS OPSCHONEN
  // ============================================================

  for (const record of dieren.values()) {

    if (!record || !record.naam) {

      eindWaarschuwingenV92.push(
        "Record zonder hoofdnaam overgeslagen."
      );

      continue;

    }

    const oorspronkelijkeNaam =
      eindSchoneNaamV92(record.naam);

    const naam =
      eindSpellingV92.get(oorspronkelijkeNaam) ||
      oorspronkelijkeNaam;

    const sleutel =
      eindNormaliseerV92(naam);

    if (!sleutel) continue;

    const vragen = new Set();

    for (const waarde of record.vragen || []) {

      const nummer = Number(waarde);

      if (eindGeldigeVraagV92(nummer)) {

        vragen.add(nummer);

      } else {

        eindWaarschuwingenV92.push(
          `Ongeldig vraagnummer bij ${naam}: ${waarde}`
        );

      }

    }

    if (vragen.size === 0) {

      eindVerwijderdeRecordsV92.push({

        naam,

        reden:
          "Geen actieve antwoordkoppelingen"

      });

      continue;

    }

    let definitief =
      eindSamengevoegdeDierenV92.get(
        sleutel
      );

    if (!definitief) {

      definitief = {

        naam,

        vragen: new Set(),

        synoniemen: new Set(),

        punten: new Map()

      };

      eindSamengevoegdeDierenV92.set(

        sleutel,

        definitief

      );

    } else {

      eindDubbeleNamenV92.push({

        hoofdnaam: definitief.naam,

        toegevoegd: naam

      });

    }

    const synoniemen = [

      oorspronkelijkeNaam,

      naam,

      ...Array.from(
        record.synoniemen || []
      )

    ];

    for (const alternatief of synoniemen) {

      const schoon =
        eindSchoneNaamV92(alternatief);

      if (!schoon) continue;

      if (!eindNormaliseerV92(schoon)) {

        continue;

      }

      if (schoon !== definitief.naam) {

        definitief.synoniemen.add(schoon);

      }

    }

    for (const nummer of vragen) {

      definitief.vragen.add(nummer);

      const punten =
        eindLeesPuntenV92(
          record,
          nummer
        );

      if (punten === null) continue;

      const vorigePunten =
        definitief.punten.get(nummer);

      definitief.punten.set(

        nummer,

        vorigePunten === undefined
          ? punten
          : Math.min(
              vorigePunten,
              punten
            )

      );

    }

  }

  // ============================================================
  // DEFINITIEVE SCHONE DIERDATABASE
  // ============================================================

  const eindDierenV92 = [

    ...eindSamengevoegdeDierenV92.values()

  ];

  const eindRecordsPerVraagV92 =
    new Map();

  for (
    let nummer = 1;
    nummer <= 50;
    nummer++
  ) {

    eindRecordsPerVraagV92.set(

      nummer,

      []

    );

  }

  // Elke koppeling wordt slechts eenmaal verwerkt.

  for (const record of eindDierenV92) {

    for (const nummer of record.vragen) {

      eindRecordsPerVraagV92
        .get(nummer)
        .push(record);

    }

  }

  // ============================================================
  // ZELDZAAMHEIDSSCHATTER
  // ============================================================

  // Dit zijn geschatte spelpunten.
  // Het zijn nog geen daadwerkelijke percentages
  // op basis van antwoorden van spelers.

  function eindZeldzaamheidV92(
    record,
    nummer
  ) {

    const alleNamen = [

      record.naam,

      ...record.synoniemen

    ];

    const oudeIndex =
      eindOudePuntenV92.get(nummer);

    const oudeScores = [];

    if (oudeIndex) {

      for (const naam of alleNamen) {

        const score =
          oudeIndex.get(
            eindNormaliseerV92(naam)
          );

        if (score !== undefined) {

          oudeScores.push(score);

        }

      }

    }

    if (oudeScores.length > 0) {

      return Math.min(...oudeScores);

    }

    if (record.punten.has(nummer)) {

      return record.punten.get(nummer);

    }

    const hoofdnaam = record.naam;

    const wetenschappelijkeNaam =
      /^[A-Z][a-z-]+ [a-z-]+(?: [a-z-]+)?$/
        .test(hoofdnaam);

    const hash =
      eindHashV92(
        `${nummer}:${hoofdnaam}`
      );

    if (wetenschappelijkeNaam) {

      return 85 + hash % 15;

    }

    if (hoofdnaam.length <= 6) {

      return 45 + hash % 25;

    }

    if (hoofdnaam.length <= 12) {

      return 60 + hash % 25;

    }

    return 70 + hash % 25;

  }

  // ============================================================
  // ALIASLIJST OPSCHONEN
  // ============================================================

  function eindMaakAliassenV92(record) {

    const gezien = new Set([

      eindNormaliseerV92(record.naam)

    ]);

    const resultaat = [];

    for (const naam of record.synoniemen) {

      const sleutel =
        eindNormaliseerV92(naam);

      if (!sleutel) continue;

      if (gezien.has(sleutel)) {

        continue;

      }

      gezien.add(sleutel);

      resultaat.push(

        eindSchoneNaamV92(naam)

      );

    }

    return resultaat.sort(
      (a, b) => a.localeCompare(b, "nl")
    );

  }

  // ============================================================
  // PUNTEN EN RAKETTEN TOEWIJZEN
  // ============================================================

  function eindVerdeelPuntenV92(
    antwoorden,
    vraagSleutel
  ) {

    const uniek = new Map();

    for (const antwoord of antwoorden) {

      const sleutel =
        eindNormaliseerV92(
          antwoord.answer
        );

      if (!sleutel) continue;

      if (!uniek.has(sleutel)) {

        uniek.set(
          sleutel,
          antwoord
        );

      }

    }

    const lijst = [...uniek.values()];

    lijst.sort((a, b) => {

      const verschil =
        a.zeldzaamheid -
        b.zeldzaamheid;

      if (verschil !== 0) {

        return verschil;

      }

      const hashA = eindHashV92(

        `${vraagSleutel}:${a.answer}`

      );

      const hashB = eindHashV92(

        `${vraagSleutel}:${b.answer}`

      );

      return hashA - hashB ||

        a.answer.localeCompare(
          b.answer,
          "nl"
        );

    });

    const aantal = lijst.length;

    const raketten =
      eindAantalRakettenV92(aantal);

    const normaleAntwoorden =
      aantal - raketten;

    return lijst.map(
      (antwoord, index) => {

        const isRocket =
          index >= normaleAntwoorden;

        let points;

        if (isRocket) {

          points = 100;

        } else if (normaleAntwoorden <= 1) {

          points = 10;

        } else {

          points = 10 + Math.round(

            index /

            (normaleAntwoorden - 1) *

            89

          );

          points = Math.max(
            10,
            Math.min(99, points)
          );

        }

        return {

          answer: antwoord.answer,

          aliases: [
            ...(antwoord.aliases || [])
          ],

          points,

          isRocket

        };

      }

    );

  }

  // ============================================================
  // ALLE 50 VRAGEN OPBOUWEN
  // ============================================================

  const eindVorigeVragenV92 =
    new Map();

  for (
    const vraag of
    vorigeCategorieV92.questions
  ) {

    eindVorigeVragenV92.set(

      Number(vraag.questionNumber),

      vraag

    );

  }

  const eindVragenV92 = [];

  for (
    let nummer = 1;
    nummer <= 50;
    nummer++
  ) {

    const oudeVraag =
      eindVorigeVragenV92.get(nummer);

    if (!oudeVraag) {

      eindExportFoutenV92.push(

        `Oorspronkelijke vraag ${nummer} ontbreekt.`

      );

      continue;

    }

    const records =
      eindRecordsPerVraagV92.get(nummer) ||
      [];

    const ruweAntwoorden =
      records.map(record => ({

        answer: record.naam,

        aliases:
          eindMaakAliassenV92(record),

        zeldzaamheid:
          eindZeldzaamheidV92(
            record,
            nummer
          )

      }));

    const antwoorden =
      eindVerdeelPuntenV92(

        ruweAntwoorden,

        `dieren-${nummer}`

      );

    const id =
      oudeVraag.id ||

      `qb650-dieren-${String(nummer)
        .padStart(2, "0")}`;

    const vraag = {

      ...oudeVraag,

      id,

      baseQuestionId:
        oudeVraag.baseQuestionId || id,

      topicId:
        oudeVraag.topicId || id,

      questionNumber: nummer,

      category:
        oudeVraag.category || "🐾 DIEREN",

      qb650Category: "Dieren",

      question: oudeVraag.question,

      hint: oudeVraag.hint || "",

      answers: antwoorden,

      answerCount: antwoorden.length,

      rocketCount:
        eindAantalRakettenV92(
          antwoorden.length
        ),

      qb650: true,

      qb650v9: true,

      dataVersion: "9.2.0"

    };

    eindVragenV92.push(vraag);

  }

  // ============================================================
  // SNELLE ANTWOORDINDEXEN
  // ============================================================

  function eindMaakVraagIndexV92(vraag) {

    const index = new Map();

    for (const antwoord of vraag.answers) {

      const namen = [

        antwoord.answer,

        ...antwoord.aliases

      ];

      const gezien = new Set();

      for (const naam of namen) {

        const sleutel =
          eindNormaliseerV92(naam);

        if (!sleutel) continue;

        if (gezien.has(sleutel)) {

          continue;

        }

        gezien.add(sleutel);

        if (!index.has(sleutel)) {

          index.set(sleutel, []);

        }

        index.get(sleutel)
          .push(antwoord);

      }

    }

    for (
      const [invoer, mogelijkheden] of index
    ) {

      mogelijkheden.sort(

        (a, b) =>

          a.points - b.points ||

          a.answer.localeCompare(
            b.answer,
            "nl"
          )

      );

      if (mogelijkheden.length > 1) {

        eindNaamconflictenV92.push({

          vraagnummer:
            vraag.questionNumber,

          invoer,

          mogelijkeDieren:
            mogelijkheden.map(
              antwoord => antwoord.answer
            )

        });

      }

    }

    return index;

  }

  for (const vraag of eindVragenV92) {

    eindVraagIndexenV92.set(

      vraag.questionNumber,

      eindMaakVraagIndexV92(vraag)

    );

  }

  // ============================================================
  // ANTWOORDEN CONTROLEREN
  // ============================================================

  function eindControleerAntwoordV92(
    nummer,
    invoer
  ) {

    const vraagnummer = Number(nummer);

    const sleutel =
      eindNormaliseerV92(invoer);

    if (!sleutel) {

      return {

        valid: false,

        reason: "Leeg antwoord",

        points: 0,

        isRocket: false

      };

    }

    const index =
      eindVraagIndexenV92.get(
        vraagnummer
      );

    if (!index) {

      return {

        valid: false,

        reason: "Onbekende vraag",

        points: 0,

        isRocket: false

      };

    }

    const mogelijkheden =
      index.get(sleutel);

    if (
      !mogelijkheden ||
      mogelijkheden.length === 0
    ) {

      return {

        valid: false,

        reason:
          "Antwoord staat niet in de antwoordbank",

        points: 0,

        isRocket: false

      };

    }

    // Bij een dubbelzinnige naam gebruiken we
    // het geldige antwoord met de laagste punten.
    //
    // Zo levert een algemene naam niet automatisch
    // de raket van een zeldzamere naamgenoot op.

    const antwoord =
      mogelijkheden[0];

    return {

      valid: true,

      answer: antwoord.answer,

      aliases: [...antwoord.aliases],

      points: antwoord.points,

      isRocket: antwoord.isRocket,

      ambiguous:
        mogelijkheden.length > 1,

      alternatives:
        mogelijkheden.map(
          mogelijkheid =>
            mogelijkheid.answer
        )

    };

  }

  // ============================================================
  // LETTERUITDAGINGEN
  // ============================================================

  function eindBegintMetLetterV92(
    tekst,
    letter
  ) {

    return eindNormaliseerV92(tekst)
      .startsWith(letter);

  }

  function eindLetterAntwoordenV92(
    nummer,
    letter
  ) {

    const vraagnummer = Number(nummer);

    const gekozenLetter =
      eindNormaliseerV92(letter);

    if (
      !/^[a-z]$/.test(gekozenLetter)
    ) {

      return [];

    }

    const cacheSleutel =
      `${vraagnummer}:${gekozenLetter}`;

    if (
      eindLetterCacheV92.has(cacheSleutel)
    ) {

      return eindLetterCacheV92
        .get(cacheSleutel)
        .map(antwoord => ({

          ...antwoord,

          aliases: [...antwoord.aliases]

        }));

    }

    const vraag = eindVragenV92.find(

      vraag =>
        vraag.questionNumber === vraagnummer

    );

    if (!vraag) return [];

    const kandidaten = [];

    const gebruikteNamen =
      new Set();

    const origineleNamen =
      new Map();

    for (const antwoord of vraag.answers) {

      const namen = [

        antwoord.answer,

        ...antwoord.aliases

      ].filter(

        naam =>
          eindBegintMetLetterV92(
            naam,
            gekozenLetter
          )

      );

      if (namen.length === 0) {

        continue;

      }

      const uniekeNamen =
        [...new Set(namen)];

      const weergavenaam =
        uniekeNamen.find(

          naam =>

            !gebruikteNamen.has(
              eindNormaliseerV92(naam)
            )

        );

      if (!weergavenaam) {

        continue;

      }

      const sleutel =
        eindNormaliseerV92(
          weergavenaam
        );

      gebruikteNamen.add(sleutel);

      origineleNamen.set(

        sleutel,

        antwoord.answer

      );

      kandidaten.push({

        answer: weergavenaam,

        aliases:
          uniekeNamen.filter(
            naam =>
              naam !== weergavenaam
          ),

        zeldzaamheid:
          antwoord.points

      });

    }

    const resultaat =
      eindVerdeelPuntenV92(

        kandidaten,

        `dieren-${vraagnummer}-${gekozenLetter}`

      ).map(antwoord => ({

        ...antwoord,

        originalAnswer:
          origineleNamen.get(

            eindNormaliseerV92(
              antwoord.answer
            )

          ) || antwoord.answer

      }));

    eindLetterCacheV92.set(

      cacheSleutel,

      resultaat

    );

    // Voorkomt dat alle mogelijke letterbanken
    // permanent in het geheugen blijven.

    while (
      eindLetterCacheV92.size > 20
    ) {

      const oudsteSleutel =
        eindLetterCacheV92.keys()
          .next().value;

      eindLetterCacheV92.delete(
        oudsteSleutel
      );

    }

    return resultaat.map(
      antwoord => ({

        ...antwoord,

        aliases: [...antwoord.aliases]

      })
    );

  }

  function eindBeschikbareLettersV92(
    nummer,
    minimum = 5
  ) {

    const resultaat = [];

    const minimaalAantal =
      Math.max(
        1,
        Number(minimum) || 5
      );

    for (
      const letter of
      "abcdefghijklmnopqrstuvwxyz"
    ) {

      const antwoorden =
        eindLetterAntwoordenV92(

          nummer,

          letter

        );

      if (
        antwoorden.length <
        minimaalAantal
      ) {

        continue;

      }

      resultaat.push({

        letter: letter.toUpperCase(),

        aantal: antwoorden.length,

        raketten:
          eindAantalRakettenV92(
            antwoorden.length
          )

      });

    }

    return resultaat;

  }

  function eindControleerLetterV92(
    nummer,
    letter,
    invoer
  ) {

    const sleutel =
      eindNormaliseerV92(invoer);

    const gekozenLetter =
      eindNormaliseerV92(letter);

    if (
      !sleutel ||
      !/^[a-z]$/.test(gekozenLetter) ||
      !sleutel.startsWith(gekozenLetter)
    ) {

      return {

        valid: false,

        points: 0,

        isRocket: false,

        reason:
          "Antwoord begint niet met de gekozen letter"

      };

    }

    const antwoorden =
      eindLetterAntwoordenV92(

        nummer,

        gekozenLetter

      );

    const mogelijkheden =
      antwoorden.filter(antwoord => {

        return [

          antwoord.answer,

          ...antwoord.aliases

        ].some(

          naam =>

            eindNormaliseerV92(naam) ===
            sleutel

        );

      });

    if (mogelijkheden.length === 0) {

      return {

        valid: false,

        points: 0,

        isRocket: false,

        reason:
          "Antwoord niet gevonden"

      };

    }

    mogelijkheden.sort(

      (a, b) => a.points - b.points

    );

    return {

      valid: true,

      ...mogelijkheden[0],

      ambiguous:
        mogelijkheden.length > 1

    };

  }

  // ============================================================
  // CONTROLE VAN ALLE GEËXPORTEERDE VRAGEN
  // ============================================================

  const eindGezieneVraagIdsV92 =
    new Set();

  const eindGezieneVraagnummersV92 =
    new Set();

  if (eindVragenV92.length !== 50) {

    eindExportFoutenV92.push(

      `Verwacht 50 vragen, gevonden ${eindVragenV92.length}.`

    );

  }

  for (const vraag of eindVragenV92) {

    const nummer =
      vraag.questionNumber;

    if (!eindGeldigeVraagV92(nummer)) {

      eindExportFoutenV92.push(

        `Ongeldig vraagnummer: ${nummer}`

      );

    }

    if (
      eindGezieneVraagnummersV92.has(
        nummer
      )
    ) {

      eindExportFoutenV92.push(

        `Dubbel vraagnummer: ${nummer}`

      );

    }

    eindGezieneVraagnummersV92.add(
      nummer
    );

    if (
      eindGezieneVraagIdsV92.has(
        vraag.id
      )
    ) {

      eindExportFoutenV92.push(

        `Dubbele vraag-ID: ${vraag.id}`

      );

    }

    eindGezieneVraagIdsV92.add(
      vraag.id
    );

    if (
      typeof vraag.question !== "string" ||
      !vraag.question.trim()
    ) {

      eindExportFoutenV92.push(

        `Vraag ${nummer} heeft geen vraagtekst.`

      );

    }

    if (!Array.isArray(vraag.answers)) {

      eindExportFoutenV92.push(

        `Vraag ${nummer} heeft geen antwoordlijst.`

      );

      continue;

    }

    if (vraag.answers.length === 0) {

      eindExportFoutenV92.push(

        `Vraag ${nummer} heeft nul antwoorden.`

      );

    }

    if (
      vraag.answerCount !==
      vraag.answers.length
    ) {

      eindExportFoutenV92.push(

        `Antwoordaantal klopt niet bij vraag ${nummer}.`

      );

    }

    const gezien = new Set();

    let echteRaketten = 0;

    for (const antwoord of vraag.answers) {

      const sleutel =
        eindNormaliseerV92(
          antwoord.answer
        );

      if (!sleutel) {

        eindExportFoutenV92.push(

          `Leeg antwoord bij vraag ${nummer}.`

        );

      }

      if (gezien.has(sleutel)) {

        eindExportFoutenV92.push(

          `Dubbel antwoord bij vraag ${nummer}: ${antwoord.answer}`

        );

      }

      gezien.add(sleutel);

      if (
        !Number.isInteger(antwoord.points) ||
        antwoord.points < 10 ||
        antwoord.points > 100
      ) {

        eindExportFoutenV92.push(

          `Ongeldige punten bij ${nummer}: ${antwoord.answer}`

        );

      }

      if (
        antwoord.isRocket !==
        (antwoord.points === 100)
      ) {

        eindExportFoutenV92.push(

          `Onjuiste raketstatus bij ${nummer}: ${antwoord.answer}`

        );

      }

      if (
        !Array.isArray(antwoord.aliases)
      ) {

        eindExportFoutenV92.push(

          `Ongeldige aliassen bij ${nummer}: ${antwoord.answer}`

        );

      }

      if (antwoord.isRocket) {

        echteRaketten++;

      }

    }

    const verwachtAantalRaketten =
      eindAantalRakettenV92(

        vraag.answers.length

      );

    if (
      echteRaketten !==
      verwachtAantalRaketten
    ) {

      eindExportFoutenV92.push(

        `Vraag ${nummer}: ${echteRaketten} raketten in plaats van ${verwachtAantalRaketten}.`

      );

    }

    if (
      vraag.rocketCount !==
      echteRaketten
    ) {

      eindExportFoutenV92.push(

        `Raketmetadata klopt niet bij vraag ${nummer}.`

      );

    }

  }

  // ============================================================
  // ANTWOORDTESTS VERZAMELEN
  // ============================================================

  const eindTestDefinitiesV92 = [];

  function eindVoegTestsToeV92(
    tests,
    bron
  ) {

    if (!Array.isArray(tests)) return;

    for (const test of tests) {

      let nummer;
      let invoer;
      let verwacht;

      if (Array.isArray(test)) {

        [
          nummer,
          invoer,
          verwacht
        ] = test;

      } else if (
        test &&
        typeof test === "object"
      ) {

        nummer =
          test.nummer ??
          test.vraagnummer ??
          test.questionNumber;

        invoer =
          test.invoer ??
          test.answer ??
          test.antwoord;

        verwacht =
          test.verwacht ??
          test.expected;

      }

      nummer = Number(nummer);

      if (
        !eindGeldigeVraagV92(nummer) ||
        typeof invoer !== "string" ||
        typeof verwacht !== "boolean"
      ) {

        eindWaarschuwingenV92.push(

          `Niet-herkende test uit ${bron}.`

        );

        continue;

      }

      eindTestDefinitiesV92.push({

        nummer,

        invoer,

        verwacht,

        bron

      });

    }

  }

  // ============================================================
  // OORSPRONKELIJKE V9.1-TESTS
  // ============================================================

  if (
    vorigeDebugV92 &&
    typeof vorigeDebugV92.tests ===
      "function"
  ) {

    try {

      eindVoegTestsToeV92(

        vorigeDebugV92.tests(),

        "V9.1"

      );

    } catch (fout) {

      eindExportFoutenV92.push(

        `V9.1-tests konden niet worden gelezen: ${fout.message}`

      );

    }

  }

  // ============================================================
  // TESTS UIT DE EERDERE DELEN
  // ============================================================

  // De naam van een testvariabele kan per deel
  // verschillen. Alleen daadwerkelijk aanwezige
  // testlijsten worden gebruikt.

  const eindTestBronnenV92 = [

    [
      "Deel 1",
      [
        "extraRivierTestsDeel1",
        "rivierTestsDeel1",
        "extraTestsDeel1",
        "rivierTests",
        "extraRivierTests"
      ]
    ],

    [
      "Deel 2",
      [
        "extraMeerTestsDeel2",
        "extraMeerdierTestsDeel2",
        "meerTestsDeel2",
        "extraTestsDeel2",
        "meerTests"
      ]
    ],

    [
      "Deel 3",
      [
        "extraStrandTestsDeel3",
        "strandTestsDeel3",
        "extraTestsDeel3",
        "strandTests"
      ]
    ],

    [
      "Deel 4",
      [
        "extraGeografieTestsDeel4",
        "extraLeefgebiedTestsDeel4",
        "extraGeografischeTestsDeel4",
        "extraGebiedTestsDeel4",
        "extraTestsDeel4",
        "geografieTestsDeel4"
      ]
    ]

  ];

  for (
    const [bron, variabelen] of
    eindTestBronnenV92
  ) {

    let gevonden = false;

    for (const variabele of variabelen) {

      try {

        // Dit betreft uitsluitend de hierboven
        // vastgelegde interne variabelenamen.
        // Er wordt geen spelersinvoer uitgevoerd.

        const tests = eval(

          `typeof ${variabele} !== "undefined" ? ${variabele} : null`

        );

        if (Array.isArray(tests)) {

          eindVoegTestsToeV92(

            tests,

            `${bron}: ${variabele}`

          );

          gevonden = true;

        }

      } catch (fout) {

        eindWaarschuwingenV92.push(

          `${bron}: ${fout.message}`

        );

      }

    }

    if (!gevonden) {

      eindWaarschuwingenV92.push(

        `${bron}: geen herkenbare testvariabele gevonden.`

      );

    }

  }

  // De namen van de testlijsten uit
  // delen 5, 6 en 7 zijn bekend.

  if (
    typeof extraKenmerkTestsDeel5 !==
      "undefined"
  ) {

    eindVoegTestsToeV92(

      extraKenmerkTestsDeel5,

      "Deel 5 - Kenmerken"

    );

  }

  if (
    typeof extraGedragTestsDeel6 !==
      "undefined"
  ) {

    eindVoegTestsToeV92(

      extraGedragTestsDeel6,

      "Deel 6 - Gedrag"

    );

  }

  if (
    typeof extraGehoudenDierenTestsDeel7 !==
      "undefined"
  ) {

    eindVoegTestsToeV92(

      extraGehoudenDierenTestsDeel7,

      "Deel 7 - Gehouden dieren"

    );

  }

  // ============================================================
  // NIEUWE ALGEMENE EINDTESTS
  // ============================================================

  eindVoegTestsToeV92([

    [1, "Blauwe vinvis", true],
    [1, "Guppy", true],
    [1, "Leeuw", false],

    [2, "Gierzwaluw", true],
    [2, "Grasparkiet", true],
    [2, "Struisvogel", false],

    [3, "Leeuw", true],
    [3, "Giraffe", true],

    [4, "Tijger", true],
    [4, "Koala", true],
    [4, "Korenslang", false],

    [5, "Leeuw", true],
    [5, "Giraffe", true],

    [6, "Edelhert", true],

    [7, "Kip", true],
    [7, "Struisvogel", true],
    [7, "Vogelbekdier", true],
    [7, "Leeuw", false],

    [8, "Hond", true],
    [8, "Labrador", true],
    [8, "Tijger", false],

    [9, "Blauwe vinvis", true],
    [9, "Giraffe", true],

    [10, "Zwarte wegmier", true],
    [10, "Giraffe", false],

    [11, "Witte haai", true],
    [11, "Blauwe vinvis", true],
    [11, "Pterophyllum scalare", false],

    [12, "Orang-oetan", true],

    [13, "Koe", true],
    [13, "Texelaar", true],
    [13, "Leeuw", false],

    [14, "Dolfijn", true],

    [15, "Aardvarken", true],
    [15, "Koala", false],

    [16, "Giraffe", true],
    [16, "Leeuw", false],

    [17, "Tijger", true],
    [17, "Koala", false],

    [18, "Tijger", true],

    [19, "Witte neushoorn", true],
    [19, "Edelhert", false],

    [20, "Rode eekhoorn", true],

    [21, "Korenslang", true],
    [21, "Bruine kikker", false],

    [22, "Struisvogel", true],
    [22, "Keizerspinguïn", true],

    [23, "Koala", true],

    [24, "IJsbeer", true],

    [25, "Dromedaris", true],

    [26, "Ree", true],
    [26, "Egel", true],

    [27, "Kerkuil", true],

    [28, "Egel", true],
    [28, "Koala", false],

    [29, "Jachtluipaard", true],

    [30, "Wijngaardslak", true],

    [31, "Koala", true],

    [32, "Europese mol", true],

    [33, "Griekse landschildpad", true],

    [34, "Springbok", true],

    [35, "Rode eekhoorn", true],

    [36, "Giraffe", true],

    [37, "Europese meerval", true],

    [38, "Snoek", true],

    [39, "Gewone mossel", true],

    [40, "Leeuw", true],

    [41, "Chimpansee", true],
    [41, "Koekoek", false],

    [42, "Panterkameleon", true],

    [43, "Tyrannosaurus rex", true],

    [44, "Groenlandse haai", true],

    [45, "Zwarte mamba", true],
    [45, "Koningspython", false],

    [46, "Koe", true],

    [47, "Blauwgele ara", true],

    [48, "Tijger", true],

    [49, "Jachtluipaard", true],

    [50, "Leeuw", true],

    [1, "", false],
    [8, "123456789", false],
    [13, "Onbestaand testdier xyz", false]

  ], "V9.2 - Eindcontrole");

  // ============================================================
  // DUBBELE TESTS OPSCHONEN
  // ============================================================

  const eindUniekeTestsV92 = new Map();

  const eindTestVerwachtingenV92 =
    new Map();

  for (
    const test of eindTestDefinitiesV92
  ) {

    const sleutel =

      `${test.nummer}:` +

      eindNormaliseerV92(
        test.invoer
      );

    if (
      eindTestVerwachtingenV92.has(
        sleutel
      ) &&

      eindTestVerwachtingenV92.get(
        sleutel
      ) !== test.verwacht
    ) {

      eindWaarschuwingenV92.push(

        `Tegenstrijdige testverwachting bij vraag ${test.nummer}: ${test.invoer}`

      );

    }

    eindTestVerwachtingenV92.set(

      sleutel,

      test.verwacht

    );

    const volledigeSleutel =

      `${sleutel}:${test.verwacht}`;

    if (
      !eindUniekeTestsV92.has(
        volledigeSleutel
      )
    ) {

      eindUniekeTestsV92.set(

        volledigeSleutel,

        test

      );

    }

  }

  // Tegenstrijdige verwachtingen worden niet
  // stilzwijgend verwijderd.

  // ============================================================
  // ANTWOORDTESTS UITVOEREN
  // ============================================================

  const eindAntwoordTestsV92 = [

    ...eindUniekeTestsV92.values()

  ].map(test => {

    const antwoord =
      eindControleerAntwoordV92(

        test.nummer,

        test.invoer

      );

    const resultaat =
      antwoord.valid === true;

    return {

      nummer: test.nummer,

      invoer: test.invoer,

      verwacht: test.verwacht,

      resultaat,

      geslaagd:
        resultaat === test.verwacht,

      bron: test.bron,

      gevondenAntwoord:
        antwoord.answer || null

    };

  });

  // ============================================================
  // RAKETTESTS
  // ============================================================

  const eindRaketTestDefinitiesV92 = [

    [0,0],

    [1,1],
    [2,1],
    [10,1],
    [25,1],
    [49,1],
    [50,1],

    [51,2],
    [75,2],
    [100,2],
    [149,2],
    [150,2],

    [151,3],
    [200,3],
    [249,3],
    [250,3],

    [251,4],
    [300,4],
    [350,4],

    [351,5],
    [400,5],
    [450,5],

    [451,6],
    [550,6],

    [551,7],
    [650,7],

    [651,8],
    [750,8],

    [751,9],
    [850,9],

    [851,10],
    [950,10],

    [951,11],
    [1000,11],
    [1050,11],

    [1051,12],

    [1500,16],

    [2000,21],

    [5000,51],

    [10000,101],

    [20000,201],

    [50000,501]

  ];

  const eindRaketTestsV92 =
    eindRaketTestDefinitiesV92.map(

      ([antwoorden, verwacht]) => {

        const resultaat =
          eindAantalRakettenV92(
            antwoorden
          );

        return {

          antwoorden,

          verwacht,

          resultaat,

          geslaagd:
            resultaat === verwacht

        };

      }

    );

  // ============================================================
  // LETTERTESTS
  // ============================================================

  const eindLetterTestDefinitiesV92 = [

    [3, "L", "Leeuw", true],

    [3, "T", "Tijger", true],

    [3, "G", "Giraffe", true],

    [3, "K", "Koala", true],

    [8, "H", "Hond", true],

    [8, "K", "Kat", true],

    [8, "L", "Labrador", true],

    [8, "G", "Guppy", true],

    [13, "K", "Koe", true],

    [13, "S", "Schaap", true],

    [13, "V", "Varken", true],

    [22, "S", "Struisvogel", true],

    [22, "E", "Emoe", true],

    [29, "J", "Jachtluipaard", true],

    [36, "G", "Giraffe", true],

    [48, "T", "Tijger", true],

    [3, "K", "Leeuw", false],

    [8, "H", "Kat", false],

    [13, "P", "Koe", false],

    [3, "L", "", false],

    [3, "12", "Leeuw", false]

  ];

  const eindLetterTestsV92 =
    eindLetterTestDefinitiesV92.map(

      (
        [
          nummer,
          letter,
          invoer,
          verwacht
        ]
      ) => {

        const controle =
          eindControleerLetterV92(

            nummer,

            letter,

            invoer

          );

        const resultaat =
          controle.valid === true;

        return {

          nummer,

          letter,

          invoer,

          verwacht,

          resultaat,

          geslaagd:
            resultaat === verwacht

        };

      }

    );

  // ============================================================
  // EXTRA LETTERBANKCONTROLES
  // ============================================================

  const eindLetterBankControlesV92 = [];

  for (const nummer of [

    1,3,8,13,22,29,36,48,50

  ]) {

    for (const letter of [

      "a","b","g","k","l","s","t","z"

    ]) {

      const antwoorden =
        eindLetterAntwoordenV92(

          nummer,

          letter

        );

      const raketten =
        antwoorden.filter(
          antwoord =>
            antwoord.isRocket
        ).length;

      const verwacht =
        eindAantalRakettenV92(

          antwoorden.length

        );

      const verkeerdeBeginletters =
        antwoorden.filter(

          antwoord =>

            !eindBegintMetLetterV92(

              antwoord.answer,

              letter

            )

        ).length;

      const uniekAantal =
        new Set(

          antwoorden.map(

            antwoord =>

              eindNormaliseerV92(
                antwoord.answer
              )

          )

        ).size;

      eindLetterBankControlesV92.push({

        nummer,

        letter:
          letter.toUpperCase(),

        antwoorden:
          antwoorden.length,

        raketten,

        verwacht,

        verkeerdeBeginletters,

        dubbeleAntwoorden:
          antwoorden.length - uniekAantal,

        geslaagd:

          raketten === verwacht &&

          verkeerdeBeginletters === 0 &&

          uniekAantal ===
            antwoorden.length

      });

    }

  }

  // ============================================================
  // VOORTGANG PER VRAAG
  // ============================================================

  const eindVoortgangV92 =
    eindVragenV92.map(vraag => {

      const oudeVraag =
        eindVorigeVragenV92.get(

          vraag.questionNumber

        );

      const oudeAntwoorden =
        oudeVraag?.answers?.length || 0;

      const nieuweAntwoorden =
        vraag.answers.length;

      const tekort =
        Math.max(

          0,

          1000 - nieuweAntwoorden

        );

      return {

        vraag:
          vraag.questionNumber,

        vraagtekst:
          vraag.question,

        oudeAntwoorden,

        nieuweAntwoorden,

        verschil:
          nieuweAntwoorden -
          oudeAntwoorden,

        raketten:
          vraag.rocketCount,

        tekort,

        streefdoelBereikt:
          nieuweAntwoorden >= 1000,

        voortgang:
          Number(

            (
              Math.min(
                nieuweAntwoorden,
                1000
              ) / 10
            ).toFixed(2)

          )

      };

    });

  // ============================================================
  // STATISTIEKEN BEREKENEN
  // ============================================================

  const eindTotaalAntwoordenV92 =
    eindVragenV92.reduce(

      (som, vraag) =>

        som + vraag.answers.length,

      0

    );

  const eindTotaalRakettenV92 =
    eindVragenV92.reduce(

      (som, vraag) =>

        som + vraag.rocketCount,

      0

    );

  const eindVoltooideVragenV92 =
    eindVoortgangV92.filter(

      vraag =>
        vraag.streefdoelBereikt

    ).length;

  const eindOntbrekendeAntwoordenV92 =
    eindVoortgangV92.reduce(

      (som, vraag) =>
        som + vraag.tekort,

      0

    );

  const eindVoortgangPercentageV92 =
    Number(

      (

        eindVoortgangV92.reduce(

          (som, vraag) =>

            som +

            Math.min(

              vraag.nieuweAntwoorden,

              1000

            ),

          0

        ) / 50000 * 100

      ).toFixed(2)

    );

  const eindGeslaagdeAntwoordTestsV92 =
    eindAntwoordTestsV92.filter(

      test => test.geslaagd

    ).length;

  const eindMislukteAntwoordTestsV92 =
    eindAntwoordTestsV92.filter(

      test => !test.geslaagd

    );

  const eindGeslaagdeRaketTestsV92 =
    eindRaketTestsV92.filter(

      test => test.geslaagd

    ).length;

  const eindGeslaagdeLetterTestsV92 =
    eindLetterTestsV92.filter(

      test => test.geslaagd

    ).length;

  const eindGeslaagdeLetterBankTestsV92 =
    eindLetterBankControlesV92.filter(

      test => test.geslaagd

    ).length;

  const eindAantalSynoniemenV92 =
    eindDierenV92.reduce(

      (som, record) =>

        som + record.synoniemen.size,

      0

    );

  // ============================================================
  // TECHNISCHE STATUS
  // ============================================================

  const eindTechnischGereedV92 =

    eindExportFoutenV92.length === 0 &&

    eindVragenV92.length === 50 &&

    eindAntwoordTestsV92.length > 0 &&

    eindMislukteAntwoordTestsV92.length === 0 &&

    eindGeslaagdeRaketTestsV92 ===
      eindRaketTestsV92.length &&

    eindGeslaagdeLetterTestsV92 ===
      eindLetterTestsV92.length &&

    eindGeslaagdeLetterBankTestsV92 ===
      eindLetterBankControlesV92.length;

  // ============================================================
  // OVERZICHT VAN EERDER ONTBREKENDE NAMEN
  // ============================================================

  let eindEerderOntbrekendeNamenV92 = [];

  if (
    vorigeDebugV92 &&
    typeof vorigeDebugV92.ontbrekendeNamen ===
      "function"
  ) {

    try {

      const lijst =
        vorigeDebugV92.ontbrekendeNamen();

      if (Array.isArray(lijst)) {

        eindEerderOntbrekendeNamenV92 =
          lijst;

      }

    } catch (fout) {

      eindWaarschuwingenV92.push(

        `Oude ontbrekende namen konden niet worden gelezen: ${fout.message}`

      );

    }

  }

  const eindAlleNaamSleutelsV92 =
    new Set();

  for (const record of eindDierenV92) {

    for (const naam of [

      record.naam,

      ...record.synoniemen

    ]) {

      eindAlleNaamSleutelsV92.add(

        eindNormaliseerV92(naam)

      );

    }

  }

  const eindNogOntbrekendeNamenV92 =
    eindEerderOntbrekendeNamenV92.filter(

      item => {

        const naam =
          typeof item === "string"

            ? item

            : item?.naam ??
              item?.invoer ??
              item?.answer;

        if (!naam) return true;

        return !eindAlleNaamSleutelsV92.has(

          eindNormaliseerV92(naam)

        );

      }

    );

  // ============================================================
  // DEFINITIEVE SAMENVATTING
  // ============================================================

  const eindSamenvattingV92 = {

    versie: "9.2.0",

    categorie: "Dieren",

    opgeslagenDierrecords:
      dieren.size,

    bruikbareDierrecords:
      eindDierenV92.length,

    uniekeCanoniekeNamen:
      eindDierenV92.length,

    totaalVragen:
      eindVragenV92.length,

    totaalVraagAntwoorden:
      eindTotaalAntwoordenV92,

    totaalRaketten:
      eindTotaalRakettenV92,

    totaalSynoniemen:
      eindAantalSynoniemenV92,

    gemiddeldAantalAntwoorden:

      Math.round(

        eindTotaalAntwoordenV92 /

        Math.max(
          1,
          eindVragenV92.length
        )

      ),

    vragenMet1000Antwoorden:
      eindVoltooideVragenV92,

    vragenOnder1000:
      50 - eindVoltooideVragenV92,

    ontbrekendTotStreefdoel:
      eindOntbrekendeAntwoordenV92,

    voortgangPercentage:
      eindVoortgangPercentageV92,

    eerdereBruikbareDieren:
      beginAantalDieren,

    nettoNieuweDierrecords:

      eindDierenV92.length -
      beginAantalDieren,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    verwijderdeKoppelingen,

    eerdereAntwoordKoppelingen:
      62945,

    nettoNieuweAntwoordKoppelingen:

      eindTotaalAntwoordenV92 -
      62945,

    eerdereRaketten:
      676,

    nettoNieuweRaketten:

      eindTotaalRakettenV92 -
      676,

    eerdereVoortgang:
      51.31,

    voortgangVerschil:

      Number(

        (
          eindVoortgangPercentageV92 -
          51.31
        ).toFixed(2)

      ),

    samengevoegdeDubbeleRecords:
      eindDubbeleNamenV92.length,

    verwijderdeLegeRecords:
      eindVerwijderdeRecordsV92.length,

    naamconflicten:
      eindNaamconflictenV92.length,

    conflictenBijToevoegen:
      conflictenBijToevoegen.length,

    ontbrekendeKoppelingen:
      ontbrekendeKoppelingen.length,

    geslaagdeAntwoordtests:
      eindGeslaagdeAntwoordTestsV92,

    mislukteAntwoordtests:
      eindMislukteAntwoordTestsV92.length,

    totaalAntwoordtests:
      eindAntwoordTestsV92.length,

    raketTestsGeslaagd:
      eindGeslaagdeRaketTestsV92,

    raketTestsTotaal:
      eindRaketTestsV92.length,

    letterTestsGeslaagd:
      eindGeslaagdeLetterTestsV92,

    letterTestsTotaal:
      eindLetterTestsV92.length,

    letterBankTestsGeslaagd:
      eindGeslaagdeLetterBankTestsV92,

    letterBankTestsTotaal:
      eindLetterBankControlesV92.length,

    exportFouten:
      eindExportFoutenV92.length,

    waarschuwingen:
      eindWaarschuwingenV92.length,

    nogOntbrekendeNamen:
      eindNogOntbrekendeNamenV92.length,

    technischGereed:
      eindTechnischGereedV92,

    inhoudOnafhankelijkGecontroleerd:
      false,

    puntenGebaseerdOpSpelersdata:
      false,

    volledigeBiologischeDekkingBewezen:
      false,

    maximaleAntwoordlimiet:
      null,

    eindVerwerkingMs:

      Date.now() -
      eindStartV92

  };

  // ============================================================
  // LEESBAAR EINDRAPPORT
  // ============================================================

  function eindTekstRapportV92() {

    const s = eindSamenvattingV92;

    const regels = [

      "QUIZBALLON DIEREN V9.2 - EINDRAPPORT",

      "====================================",

      "",

      `Versie: ${s.versie}`,

      `Unieke canonieke diernamen: ${s.uniekeCanoniekeNamen}`,

      `Opgeslagen records: ${s.opgeslagenDierrecords}`,

      `Bruikbare records: ${s.bruikbareDierrecords}`,

      `Totaal vragen: ${s.totaalVragen}`,

      `Antwoordkoppelingen: ${s.totaalVraagAntwoorden}`,

      `Nieuwe antwoordkoppelingen netto: ${s.nettoNieuweAntwoordKoppelingen}`,

      `Synoniemen: ${s.totaalSynoniemen}`,

      `Raketten: ${s.totaalRaketten}`,

      `Nieuwe raketten netto: ${s.nettoNieuweRaketten}`,

      `Gemiddeld per vraag: ${s.gemiddeldAantalAntwoorden}`,

      `Vragen met minimaal 1000 antwoorden: ${s.vragenMet1000Antwoorden}/50`,

      `Vragen onder 1000: ${s.vragenOnder1000}`,

      `Voortgang: ${s.voortgangPercentage}%`,

      `Vorige voortgang: ${s.eerdereVoortgang}%`,

      `Verschil in procentpunten: ${s.voortgangVerschil}`,

      `Ontbrekend tot streefdoel: ${s.ontbrekendTotStreefdoel}`,

      "",

      "TECHNISCHE CONTROLE",

      "====================================",

      `Antwoordtests: ${s.geslaagdeAntwoordtests}/${s.totaalAntwoordtests}`,

      `Rakettests: ${s.raketTestsGeslaagd}/${s.raketTestsTotaal}`,

      `Lettertests: ${s.letterTestsGeslaagd}/${s.letterTestsTotaal}`,

      `Letterbanktests: ${s.letterBankTestsGeslaagd}/${s.letterBankTestsTotaal}`,

      `Exportfouten: ${s.exportFouten}`,

      `Naamconflicten: ${s.naamconflicten}`,

      `Waarschuwingen: ${s.waarschuwingen}`,

      `Technisch gereed: ${s.technischGereed ? "Ja" : "Nee"}`,

      "Biologisch onafhankelijk gecontroleerd: Nee",

      "Volledigheid biologisch bewezen: Nee",

      "Punten gebaseerd op spelersdata: Nee",

      "",

      "VOORTGANG PER VRAAG",

      "====================================",

      ""

    ];

    for (const vraag of eindVoortgangV92) {

      const teken =
        vraag.verschil >= 0 ? "+" : "";

      regels.push(

        `${String(vraag.vraag).padStart(2, "0")}. ${vraag.vraagtekst}`,

        `V9.1: ${vraag.oudeAntwoorden} | V9.2: ${vraag.nieuweAntwoorden} | Verschil: ${teken}${vraag.verschil} | Raketten: ${vraag.raketten}`,

        `Tekort tot 1000: ${vraag.tekort}`,

        ""

      );

    }

    regels.push(

      "MISLUKTE ANTWOORDTESTS",

      "===================================="

    );

    if (
      eindMislukteAntwoordTestsV92.length === 0
    ) {

      regels.push(
        "Geen mislukte antwoordtests."
      );

    } else {

      for (
        const test of
        eindMislukteAntwoordTestsV92
      ) {

        regels.push(

          `Vraag ${test.nummer}: ${test.invoer}`,

          `Verwacht: ${test.verwacht} | Resultaat: ${test.resultaat}`,

          `Bron: ${test.bron}`,

          ""

        );

      }

    }

    regels.push(

      "",

      "NAAMCONFLICTEN",

      "===================================="

    );

    if (
      eindNaamconflictenV92.length === 0
    ) {

      regels.push(
        "Geen naamconflicten."
      );

    } else {

      for (
        const conflict of
        eindNaamconflictenV92
      ) {

        regels.push(

          `Vraag ${conflict.vraagnummer}: ${conflict.invoer} -> ${conflict.mogelijkeDieren.join(" / ")}`

        );

      }

    }

    regels.push(

      "",

      "EXPORTFOUTEN",

      "===================================="

    );

    if (
      eindExportFoutenV92.length === 0
    ) {

      regels.push(
        "Geen exportfouten."
      );

    } else {

      regels.push(
        ...eindExportFoutenV92
      );

    }

    regels.push(

      "",

      "WAARSCHUWINGEN",

      "===================================="

    );

    if (
      eindWaarschuwingenV92.length === 0
    ) {

      regels.push(
        "Geen technische waarschuwingen."
      );

    } else {

      regels.push(
        ...eindWaarschuwingenV92
      );

    }

    return regels.join("\n");

  }

  // ============================================================
  // DEFINITIEVE CATEGORIE-EXPORT
  // ============================================================

  const eindCategorieV92 = {

    version: "9.2.0",

    category: "Dieren",

    status:

      eindTechnischGereedV92

        ? "technisch-gereed"

        : "controle-nodig",

    technicallyReady:
      eindTechnischGereedV92,

    contentVerified:
      false,

    contentComplete:
      false,

    questions:
      eindVragenV92,

    summary:
      eindSamenvattingV92,

    report:
      eindVoortgangV92,

    check:
      eindControleerAntwoordV92,

    letterAnswers:
      eindLetterAntwoordenV92,

    availableLetters:
      eindBeschikbareLettersV92,

    checkLetter:
      eindControleerLetterV92,

    rocketCount:
      eindAantalRakettenV92

  };

  // ============================================================
  // DEBUGFUNCTIES
  // ============================================================

  const eindDebugV92 = {

    version: "9.2.0",

    summary:
      eindSamenvattingV92,

    vragen() {

      return eindVragenV92;

    },

    voortgang() {

      return eindVoortgangV92;

    },

    report() {

      return eindTekstRapportV92();

    },

    rapport() {

      return eindTekstRapportV92();

    },

    tests() {

      return eindAntwoordTestsV92;

    },

    raketTests() {

      return eindRaketTestsV92;

    },

    letterTests() {

      return eindLetterTestsV92;

    },

    letterBankTests() {

      return eindLetterBankControlesV92;

    },

    mislukteTests() {

      return eindMislukteAntwoordTestsV92;

    },

    fouten() {

      return [...eindExportFoutenV92];

    },

    waarschuwingen() {

      return [...eindWaarschuwingenV92];

    },

    naamconflicten() {

      return eindNaamconflictenV92;

    },

    dubbeleNamen() {

      return eindDubbeleNamenV92;

    },

    verwijderdeRecords() {

      return eindVerwijderdeRecordsV92;

    },

    correcties() {

      return eindCorrectiesV92;

    },

    ontbrekendeNamen() {

      return eindNogOntbrekendeNamenV92;

    },

    ontbrekendeKoppelingen() {

      return [...ontbrekendeKoppelingen];

    },

    overgeslagenConflicten() {

      return [...conflictenBijToevoegen];

    },

    technischGereed() {

      return eindTechnischGereedV92;

    },

    inhoudGecontroleerd() {

      return false;

    },

    check(
      nummer,
      invoer
    ) {

      return eindControleerAntwoordV92(

        nummer,

        invoer

      );

    },

    letterAnswers(
      nummer,
      letter
    ) {

      return eindLetterAntwoordenV92(

        nummer,

        letter

      );

    },

    availableLetters(
      nummer,
      minimum = 5
    ) {

      return eindBeschikbareLettersV92(

        nummer,

        minimum

      );

    },

    checkLetter(
      nummer,
      letter,
      invoer
    ) {

      return eindControleerLetterV92(

        nummer,

        letter,

        invoer

      );

    },

    rocketCount(aantal) {

      return eindAantalRakettenV92(
        aantal
      );

    },

    zoekDier(invoer) {

      const sleutel =
        eindNormaliseerV92(invoer);

      if (!sleutel) return [];

      const resultaat = [];

      for (const record of eindDierenV92) {

        const namen = [

          record.naam,

          ...record.synoniemen

        ];

        if (

          namen.some(

            naam =>

              eindNormaliseerV92(naam) ===
              sleutel

          )

        ) {

          resultaat.push({

            naam: record.naam,

            synoniemen:
              [...record.synoniemen],

            vragen:
              [...record.vragen].sort(

                (a,b) => a-b

              )

          });

        }

      }

      return resultaat;

    },

    vraag(nummer) {

      return eindVragenV92.find(

        vraag =>

          vraag.questionNumber ===
          Number(nummer)

      ) || null;

    },

    raketten(nummer) {

      const vraag =
        eindVragenV92.find(

          vraag =>

            vraag.questionNumber ===
            Number(nummer)

        );

      if (!vraag) return [];

      return vraag.answers.filter(

        antwoord => antwoord.isRocket

      );

    },

    antwoorden(
      nummer,
      zoektekst = ""
    ) {

      const vraag =
        eindVragenV92.find(

          vraag =>

            vraag.questionNumber ===
            Number(nummer)

        );

      if (!vraag) return [];

      const sleutel =
        eindNormaliseerV92(zoektekst);

      if (!sleutel) {

        return vraag.answers;

      }

      return vraag.answers.filter(

        antwoord =>

          [

            antwoord.answer,

            ...antwoord.aliases

          ].some(

            naam =>

              eindNormaliseerV92(naam)
                .includes(sleutel)

          )

      );

    },

    topTekorten() {

      return [...eindVoortgangV92]

        .filter(
          vraag => vraag.tekort > 0
        )

        .sort(
          (a,b) => b.tekort - a.tekort
        );

    }

  };

  // ============================================================
  // GLOBALE EXPORT
  // ============================================================

  window.QB_V9_CATEGORIEEN =
    window.QB_V9_CATEGORIEEN || {};

  window.QB_V9_CATEGORIEEN.Dieren =
    eindCategorieV92;

  window.QB_V9_DIeren =
    eindCategorieV92;

  window.QB_V9_DIeren_DEBUG =
    eindDebugV92;

  window.QB_V9_DIeren_CONTROLE = {

    versie: "9.2.0",

    summary:
      eindSamenvattingV92,

    tests:
      eindAntwoordTestsV92,

    rocketTests:
      eindRaketTestsV92,

    letterTests:
      eindLetterTestsV92,

    letterBankTests:
      eindLetterBankControlesV92,

    errors:
      eindExportFoutenV92,

    warnings:
      eindWaarschuwingenV92,

    conflicts:
      eindNaamconflictenV92,

    missingNames:
      eindNogOntbrekendeNamenV92,

    progress:
      eindVoortgangV92,

    technicallyReady:
      eindTechnischGereedV92,

    contentVerified:
      false

  };

  // ============================================================
  // GEEN WIJZIGINGEN AAN DE ACTIEVE V8-GAME
  // ============================================================

  // QB650_QUESTIONS wordt hier bewust niet gewijzigd.
  //
  // De actieve Daily Challenge en Duel blijven
  // werken zoals voorheen.
  //
  // De nieuwe antwoordbanken worden eerst door
  // GitHub Actions verwerkt tot losse JSON-bestanden.
  //
  // Pas daarna wordt V9 gekoppeld aan de game.

  // ============================================================
  // EINDRAPPORT IN DE CONSOLE
  // ============================================================

  console.group(

    "🎈 QuizBallon Dieren V9.2 - Eindrapport"

  );

  console.table(
    eindSamenvattingV92
  );

  console.table(
    eindVoortgangV92
  );

  if (
    eindMislukteAntwoordTestsV92.length > 0
  ) {

    console.warn(

      "Er zijn mislukte antwoordtests."

    );

    console.table(

      eindMislukteAntwoordTestsV92

    );

  }

  if (
    eindExportFoutenV92.length > 0
  ) {

    console.error(

      "Er zijn exportfouten.",

      eindExportFoutenV92

    );

  }

  if (
    eindNaamconflictenV92.length > 0
  ) {

    console.warn(

      "Er zijn dubbelzinnige diernamen.",

      eindNaamconflictenV92.length

    );

  }

  if (
    eindWaarschuwingenV92.length > 0
  ) {

    console.warn(

      "Technische waarschuwingen:",

      eindWaarschuwingenV92

    );

  }

  console.log(

    "Versie:",

    eindCategorieV92.version

  );

  console.log(

    "Dierrecords:",

    eindDierenV92.length

  );

  console.log(

    "Antwoordkoppelingen:",

    eindTotaalAntwoordenV92

  );

  console.log(

    "Raketten:",

    eindTotaalRakettenV92

  );

  console.log(

    "Voortgang:",

    `${eindVoortgangPercentageV92}%`

  );

  console.log(

    "Technisch gereed:",

    eindTechnischGereedV92

  );

  console.log(

    "Biologisch onafhankelijk gecontroleerd: Nee"

  );

  console.groupEnd();

  // ============================================================
  // EINDE QUIZBALLON V9.2 - AANVULLING 2
  // ALLE ACHT DELEN ZIJN AFGESLOTEN
  // ============================================================

})();
