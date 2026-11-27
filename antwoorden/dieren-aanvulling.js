(function () {
  "use strict";

  // ============================================================
  // QUIZBALLON V9 - DIEREN AANVULLING 1
  // HERSTEL VAN ONTBREKENDE DIERNAMEN
  // ============================================================

  const VERSIE = "9.1.0";

  const categorie =
    window.QB_V9_CATEGORIEEN?.Dieren;

  if (!categorie || !Array.isArray(categorie.questions)) {
    console.error(
      "Laad antwoorden/dieren.js vóór dieren-aanvulling.js."
    );
    return;
  }

  const oudDebug = window.QB_V9_DIeren_DEBUG;

  const oudeTests =
    oudDebug?.tests?.() || [];

  const oudeRaketTests =
    oudDebug?.raketTests?.() || [];

  const oudeOntbrekendeNamen =
    oudDebug?.ontbrekendeNamen?.() || [];

  const oudeAantallen =
    categorie.questions.map(vraag => vraag.answers.length);

  const oudeSamenvatting = {
    ...categorie.summary
  };

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
      Math.max(1, Math.ceil((aantal + 50) / 100))
    );
  }

  function hash(tekst) {
    let resultaat = 2166136261;

    for (const teken of String(tekst)) {
      resultaat ^= teken.charCodeAt(0);
      resultaat = Math.imul(resultaat, 16777619);
    }

    return resultaat >>> 0;
  }

  // ============================================================
  // BESTAANDE DATABASE INLEZEN
  // ============================================================

  const dieren = new Map();
  const naamIndex = new Map();

  function indexeer(naam, record) {
    const sleutel = normaal(naam);

    if (!sleutel) return;

    if (!naamIndex.has(sleutel)) {
      naamIndex.set(sleutel, new Set());
    }

    naamIndex.get(sleutel).add(record);
  }

  for (const vraag of categorie.questions) {

    const nummer = vraag.questionNumber;

    for (const antwoord of vraag.answers) {

      const sleutel = normaal(antwoord.answer);

      if (!dieren.has(sleutel)) {
        dieren.set(sleutel, {
          naam: antwoord.answer,
          aliases: new Set(),
          vragen: new Map()
        });
      }

      const record = dieren.get(sleutel);

      for (const alias of antwoord.aliases || []) {
        record.aliases.add(alias);
      }

      record.vragen.set(nummer, antwoord.points);
    }
  }

  for (const record of dieren.values()) {
    indexeer(record.naam, record);

    for (const alias of record.aliases) {
      indexeer(alias, record);
    }
  }

  const eersteAantalDieren = dieren.size;

  let nieuweDieren = 0;
  let nieuweKoppelingen = 0;
  let nieuweSynoniemen = 0;

  const overgeslagenConflicten = [];

  // ============================================================
  // DIEREN TOEVOEGEN ZONDER ONNODIGE DUBBELEN
  // ============================================================

  function zoek(naam) {
    const sleutel = normaal(naam);

    if (dieren.has(sleutel)) {
      return dieren.get(sleutel);
    }

    const opties = naamIndex.get(sleutel);

    if (opties?.size === 1) {
      return [...opties][0];
    }

    return null;
  }

  function voegToe(naam, vragen, aliases = [], punten = 45) {

    const namen = [naam, ...aliases];

    const kandidaten = new Set();

    for (const invoer of namen) {
      const opties = naamIndex.get(normaal(invoer));

      if (opties) {
        for (const record of opties) {
          kandidaten.add(record);
        }
      }
    }

    if (kandidaten.size > 1) {

      overgeslagenConflicten.push({
        naam,
        kandidaten: [...kandidaten].map(dier => dier.naam)
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

      dieren.set(normaal(naam), record);
      indexeer(naam, record);

      nieuweDieren++;
    }

    for (const alias of namen) {

      if (
        normaal(alias) === normaal(record.naam)
      ) continue;

      if (!record.aliases.has(alias)) {

        record.aliases.add(alias);
        indexeer(alias, record);

        nieuweSynoniemen++;
      }
    }

    for (const nummer of vragen) {

      if (
        !Number.isInteger(nummer) ||
        nummer < 1 ||
        nummer > 50
      ) continue;

      if (!record.vragen.has(nummer)) {

        record.vragen.set(nummer, punten);

        nieuweKoppelingen++;
      }
    }
  }

  function groep(tekst, vragen, punten = 45) {

    for (const regel of tekst.split(";")) {

      const onderdelen = regel
        .split("=")
        .map(item => item.trim())
        .filter(Boolean);

      if (!onderdelen.length) continue;

      const [naam, ...aliases] = onderdelen;

      voegToe(naam, vragen, aliases, punten);
    }
  }

  function verwijderKoppeling(naam, vragen) {

    const record = zoek(naam);

    if (!record) return;

    for (const nummer of vragen) {
      record.vragen.delete(nummer);
    }
  }

  // ============================================================
  // LOOPVOGELS
  // ============================================================

  groep(`
    Struisvogel=Struthio camelus=Gewone struisvogel;
    Emoe=Dromaius novaehollandiae;
    Nandoe=Rhea americana=Grote nandoe
  `, [3,7,9,18,22,29,36,50], 25);

  groep(`
    Struisvogel
  `, [5,13,16,25,40,41,46], 20);

  groep(`
    Emoe
  `, [13,16,23,40,41,46], 35);

  groep(`
    Kasuaris=Helmkasuaris=Casuarius casuarius
  `, [3,7,9,12,16,18,22,23,50], 45);

  groep(`
    Kleine kasuaris=Casuarius bennetti;
    Oranjehalskasuaris=Casuarius unappendiculatus
  `, [7,12,16,18,22,50], 75);

  groep(`
    Kiwi;
    Noordereilandbruine kiwi=Apteryx mantelli;
    Zuidereilandbruine kiwi=Apteryx australis;
    Grote grijze kiwi=Apteryx haastii;
    Kleine grijze kiwi=Apteryx owenii;
    Rowiki=Apteryx rowi
  `, [6,7,15,17,22,27,50], 55);

  groep(`
    Kakapo=Strigops habroptilus=Uilpapegaai
  `, [6,7,16,18,22,27,35,44,47,50], 60);

  for (const naam of [
    "Struisvogel",
    "Emoe",
    "Nandoe",
    "Kasuaris",
    "Kleine kasuaris",
    "Oranjehalskasuaris",
    "Kiwi",
    "Kakapo"
  ]) {
    verwijderKoppeling(naam, [2]);
  }

  // ============================================================
  // ONTBREKENDE ROOFDIEREN
  // ============================================================

  groep(`
    Afrikaanse leeuw
  `, [3,4,5,9,17,18,20,27,29,40,50], 20);

  groep(`
    Aziatische leeuw=Indische leeuw
  `, [3,4,9,17,18,20,27,40,50], 45);

  groep(`
    Amoerluipaard=Panthera pardus orientalis
  `, [3,4,6,17,18,20,24,27,34,35,49,50], 60);

  groep(`
    Jaguarundi=Herpailurus yagouaroundi=Puma yagouaroundi
  `, [4,6,12,17,18,20,34,35,50], 70);

  groep(`
    Jakhals;
    Goudjakhals=Canis aureus
  `, [4,15,17,18,20,27,29,50], 35);

  groep(`
    Grijze wolf=Canis lupus=Wolf
  `, [3,4,6,17,18,20,24,26,27,29,40,50], 20);

  groep(`
    Poolwolf=Canis lupus arctos
  `, [4,17,18,20,24,27,29,40,50], 40);

  groep(`
    Zwarte beer=Amerikaanse zwarte beer=Ursus americanus
  `, [3,4,6,15,16,17,20,28,35,50], 35);

  groep(`
    Hyenahond=Afrikaanse wilde hond=Lycaon pictus
  `, [3,4,5,17,18,20,29,40,49,50], 45);

  groep(`
    Dwergmangoeste=Helogale parvula;
    Zebramangoeste=Mungos mungo
  `, [3,4,5,15,17,18,20,32,40,50], 60);

  groep(`
    Zebramangoeste
  `, [48], 55);

  groep(`
    Egyptische mangoeste=Herpestes ichneumon;
    Mangoeste
  `, [4,5,15,17,18,20,50], 50);

  groep(`
    Binturong=Arctictis binturong=Beermarter
  `, [3,4,6,12,16,17,18,20,27,31,35,50], 65);

  groep(`
    Quoll=Buidelmarter
  `, [4,17,18,20,23,27,49,50], 65);

  // ============================================================
  // HOEFDIEREN EN GROTE ZOOGDIEREN
  // ============================================================

  groep(`
    Bosolifant=Afrikaanse bosolifant=Loxodonta cyclotis
  `, [3,4,5,6,9,12,14,16,18,40,44,50], 40);

  groep(`
    Bizon;
    Buffel
  `, [3,4,9,16,18,19,20,40,50], 25);

  groep(`
    Anoa;
    Laaglandanoa=Bubalus depressicornis;
    Berganoa=Bubalus quarlesi
  `, [3,4,6,12,16,18,19,20,50], 65);

  groep(`
    Argali=Ovis ammon;
    Dalls schaap=Ovis dalli;
    Sneeuwgeit=Oreamnos americanus=Berggeit
  `, [4,16,18,19,20,24,35,40,50], 60);

  groep(`
    Gaffelbok=Antilocapra americana=Pronghorn
  `, [4,16,18,19,20,29,40,50], 60);

  groep(`
    Duiker=Duikerantilope;
    Koedoe;
    Grote koedoe=Tragelaphus strepsiceros;
    Kleine koedoe=Tragelaphus imberbis;
    Paardantilope=Hippotragus equinus;
    Oryx;
    Zwartbok=Antilope cervicapra
  `, [4,16,18,19,20,50], 55);

  groep(`
    Grote koedoe;
    Kleine koedoe;
    Paardantilope;
    Duiker
  `, [5], 50);

  groep(`
    Muntjak
  `, [3,4,6,16,18,20,50], 45);

  groep(`
    Serow
  `, [4,6,16,18,19,20,35,50], 65);

  groep(`
    Tibetaanse gazelle=Procapra picticaudata
  `, [4,16,18,19,20,24,40,50], 65);

  groep(`
    Maleise tapir=Tapirus indicus=Indische tapir
  `, [3,4,6,9,12,14,16,18,20,27,50], 45);

  // ============================================================
  // PRIMATEN
  // ============================================================

  groep(`
    Katta=Ringstaartmaki=Lemur catta
  `, [3,4,5,6,16,18,20,31,34,35,40,48,50], 35);

  groep(`
    Vari=Varecia
  `, [3,4,5,6,12,16,18,20,31,34,35,40,50], 55);

  groep(`
    Groene baviaan=Papio anubis=Anubisbaviaan
  `, [3,4,5,15,16,17,18,20,35,40,50], 50);

  groep(`
    Franjeaap=Colobus
  `, [3,4,5,6,12,16,18,20,31,34,35,40,50], 55);

  groep(`
    Rode franjeaap=Piliocolobus
  `, [4,5,6,12,16,18,20,31,34,35,40,50], 65);

  groep(`
    Tamarin;
    Penseelaapje;
    Pinchéaapje=Saguinus oedipus
  `, [3,4,6,12,15,16,17,18,20,31,34,35,40,50], 50);

  groep(`
    Witwanggibbon=Nomascus leucogenys
  `, [3,6,12,16,20,31,34,35,40,50], 55);

  // ============================================================
  // KNAAGDIEREN
  // ============================================================

  groep(`
    Agoeti=Dasyprocta;
    Paka=Cuniculus paca
  `, [3,4,6,12,16,20,50], 55);

  groep(`
    Kaaps stekelvarken=Hystrix africaeaustralis
  `, [3,4,5,16,18,27,32,50], 55);

  groep(`
    Gambiahamsterrat=Cricetomys gambianus
  `, [4,5,16,17,18,20,27,32,50], 65);

  groep(`
    Hazelmuis=Muscardinus avellanarius;
    Relmuis=Glis glis;
    Eikelmuis=Eliomys quercinus;
    Bosrelmuis=Dryomys nitedula
  `, [4,6,15,16,17,18,20,27,28,31,35,50], 55);

  groep(`
    Hazelmuis;
    Eikelmuis
  `, [26], 55);

  groep(`
    Europese grondeekhoorn=Spermophilus citellus
  `, [4,16,18,20,28,32,34,40,50], 65);

  groep(`
    Vliegende eekhoorn;
    Grote vliegende eekhoorn=Petaurista
  `, [4,6,16,18,20,27,31,34,35,50], 60);

  groep(`
    Gestreepte boomeekhoorn
  `, [4,6,18,20,31,34,35,48,50], 65);

  groep(`
    Zwartkopmarmot=Marmota camtschatica;
    Hoary marmot=Marmota caligata=Grijze marmot
  `, [4,16,18,20,24,28,32,50], 65);

  groep(`
    Springmuis;
    Grote springmuis=Allactaga major;
    Kleine springmuis=Allactaga elater
  `, [4,16,18,20,25,27,32,34,50], 60);

  groep(`
    Woestijnhamster=Phodopus roborovskii=Roborovskihamster
  `, [4,8,16,18,20,25,27,32,50], 50);

  groep(`
    Tamme muis;
    Tamme rat
  `, [4,8,15,16,17,18,20,27,34,35], 25);

  // ============================================================
  // OVERIGE ZOOGDIEREN
  // ============================================================

  groep(`
    Bosspitsmuis=Sorex araneus
  `, [4,6,10,15,17,18,20,26,27,50], 45);

  groep(`
    Stermol=Condylura cristata
  `, [4,15,17,18,20,27,32,50], 60);

  groep(`
    Noordelijke witborstegel=Erinaceus roumanicus
  `, [4,15,17,20,27,28,50], 65);

  groep(`
    Olifantspitsmuis
  `, [4,5,15,17,18,20,29,50], 55);

  groep(`
    Langsnuitmierenegel=Zaglossus
  `, [4,7,15,17,27,50], 70);

  groep(`
    Tamandoea=Tamandua
  `, [3,4,6,12,15,17,18,20,31,35,50], 60);

  groep(`
    Boomschubdier=Phataginus tricuspis
  `, [4,5,6,12,15,17,18,21,27,31,35,50], 65);

  groep(`
    Roze gordeldier=Chlamyphorus truncatus
  `, [4,15,17,18,27,32,33,50], 70);

  groep(`
    Vleerhond
  `, [2,6,12,16,20,27,31,40,50], 45);

  groep(`
    Grootoorvleermuis=Plecotus
  `, [2,15,17,20,27,28,50], 45);

  // ============================================================
  // AUSTRALISCHE BUIDELDIEREN
  // ============================================================

  groep(`
    Grote bilby=Macrotis lagotis
  `, [4,15,16,17,18,20,23,25,27,32,50], 60);

  groep(`
    Buidelmuis
  `, [4,15,17,18,20,23,50], 55);

  groep(`
    Grote suikereekhoorn=Petaurus australis
  `, [4,6,16,18,20,23,27,31,34,35,50], 65);

  groep(`
    Wallaroe=Osphranter robustus;
    Grijze reuzenkangoeroe
  `, [3,16,18,20,23,29,34,40,50], 45);

  // ============================================================
  // WATERZOOGDIEREN
  // ============================================================

  groep(`
    Amazone-rivierdolfijn=Inia geoffrensis=Amazonedolfijn
  `, [1,9,14,17,18,37,40,50], 55);

  groep(`
    Irrawaddydolfijn=Orcaella brevirostris
  `, [1,11,14,17,18,37,40,50], 65);

  groep(`
    Kleine orka=Pseudorca crassidens=Zwarte zwaardwalvis
  `, [1,9,11,14,17,18,40,50], 60);

  groep(`
    Noordkaper=Eubalaena glacialis
  `, [1,9,11,14,17,18,44,50], 65);

  groep(`
    Amazonezeekoe=Trichechus inunguis
  `, [1,9,14,16,18,37,38,50], 65);

  groep(`
    Lamantijn=Zeekoe
  `, [1,9,14,16,18,50], 45);

  groep(`
    Baikalrob=Pusa sibirica
  `, [1,14,17,20,24,38,50], 65);

  groep(`
    Kaspische rob=Pusa caspica
  `, [1,14,17,20,38,50], 65);

  groep(`
    Saimaa-ringelrob=Pusa hispida saimensis
  `, [1,14,17,20,24,38,50], 75);

  groep(`
    Pelsrob
  `, [1,3,11,14,17,20,39,40,50], 45);

  groep(`
    Zeeolifant
  `, [1,9,11,14,17,18,24,39,40,50], 40);

  // ============================================================
  // PAPEGAAIEN EN SIERVOGELS
  // ============================================================

  groep(`
    Catharinaparkiet=Bolborhynchus lineola;
    Turquoisineparkiet=Neophema pulchella;
    Senegalpapegaai=Poicephalus senegalus;
    Inkapapegaai=Cacatua leadbeateri=Major Mitchell-kaketoe;
    Geelkuifkaketoe
  `, [2,3,7,8,18,22,47,50], 55);

  groep(`
    Neophema;
    Rosella;
    Blauwe ara
  `, [2,7,8,18,22,47,50], 50);

  groep(`
    Gouldamadine=Chloebia gouldiae=Erythrura gouldiae;
    Diamantvink=Stagonopleura guttata;
    Zebravink=Taeniopygia guttata
  `, [2,3,7,8,18,22,23,40,41,47,50], 45);

  groep(`
    Japanse meeuw=Lonchura striata domestica
  `, [2,7,8,18,22,40,41], 50);

  groep(`
    Blauwe pauw=Pavo cristatus=Pauw;
    Lady Amherstfazant=Chrysolophus amherstiae;
    Argusfazant=Argusianus argus
  `, [3,7,18,22,47,50], 45);

  groep(`
    Parelhoen;
    Helmparelhoen=Numida meleagris
  `, [2,3,5,7,13,18,22,40,46,49,50], 40);

  groep(`
    Bijenkolibrie=Mellisuga helenae
  `, [2,7,10,18,22,41,47,50], 60);

  // ============================================================
  // ROOFVOGELS
  // ============================================================

  groep(`
    Filipijnse arend=Pithecophaga jefferyi;
    Gevlekte zeearend=Icthyophaga ichthyaetus
  `, [2,6,7,17,18,22,41,50], 65);

  groep(`
    Filipijnse arend
  `, [12], 65);

  groep(`
    Secretarisvogel=Sagittarius serpentarius
  `, [2,3,5,7,15,17,18,22,41,50], 50);

  // ============================================================
  // WATERVOGELS
  // ============================================================

  groep(`
    Grijze kraanvogel=Grus grus=Kraanvogel;
    Kroonkraanvogel=Balearica
  `, [2,3,7,18,22,36,40,41,50], 45);

  groep(`
    Australische ibis=Threskiornis molucca=Australische witte ibis
  `, [2,7,15,17,18,22,23,40,41,50], 60);

  groep(`
    Hamerkop=Scopus umbretta
  `, [2,5,7,15,17,18,22,41,50], 60);

  groep(`
    Schoenbekooievaar=Balaeniceps rex=Schoenbek
  `, [2,3,5,7,17,18,22,41,50], 55);

  groep(`
    Zilverreiger
  `, [2,7,17,18,22,26,36,41,50], 35);

  groep(`
    Waterral=Rallus aquaticus
  `, [2,7,15,17,18,22,26,50], 50);

  groep(`
    Burgemeester=Grote burgemeester=Larus hyperboreus;
    Grote jager=Stercorarius skua;
    Kleine jager=Stercorarius parasiticus
  `, [2,7,11,17,18,22,24,39,50], 55);

  groep(`
    Poolstern=Sterna paradisaea
  `, [2,7,11,17,18,22,24,39,40,41,50], 55);

  groep(`
    Dikbekzeekoet=Uria lomvia
  `, [1,2,7,11,14,17,18,22,24,40,50], 60);

  groep(`
    Kinbandpinguïn=Pygoscelis antarcticus
  `, [1,7,11,14,17,18,22,24,40,41,50], 50);

  // ============================================================
  // ZANGVOGELS EN OVERIGE VOGELS
  // ============================================================

  groep(`
    Hop=Upupa epops;
    Europese scharrelaar=Coracias garrulus
  `, [2,7,15,17,18,22,47,50], 45);

  groep(`
    Australische ekster=Gymnorhina tibicen;
    Zwarte currawong=Strepera fuliginosa
  `, [2,7,15,17,18,22,23,41,50], 65);

  groep(`
    Bonte kraaivogel=Strepera graculina
  `, [2,7,15,17,18,22,23,41,50], 65);

  groep(`
    Liervogel;
    Prachtliervogel=Menura novaehollandiae
  `, [2,6,7,15,17,18,22,23,41,50], 60);

  groep(`
    Arassari;
    Hoornraaf;
    Timalia
  `, [2,7,18,22,50], 65);

  groep(`
    Taigagaai=Perisoreus infaustus
  `, [2,6,7,15,17,18,22,24,41,50], 65);

  groep(`
    IJsgors=Calcarius lapponicus;
    Sneeuwgors=Plectrophenax nivalis
  `, [2,7,18,22,24,26,41,50], 55);

  groep(`
    Wevervogel;
    Maskerwever=Ploceus velatus;
    Republikeinwever=Philetairus socius;
    Roodbekwever=Quelea quelea
  `, [2,5,7,16,18,22,40,41,50], 65);

  groep(`
    Bayawever=Ploceus philippinus
  `, [2,7,16,18,22,40,41,50], 65);

  groep(`
    Kleermakersvogel=Orthotomus sutorius;
    Ovenvogel=Furnarius rufus
  `, [2,7,15,17,18,22,41,50], 65);

  groep(`
    Tortelduif
  `, [2,7,16,18,22,41,50], 35);

  groep(`
    Woestijntapuit=Oenanthe deserti;
    Renvogel=Cursorius cursor
  `, [2,7,15,17,18,22,25,50], 65);

  groep(`
    Zandhoen;
    Kroonzandhoen=Pterocles coronatus
  `, [2,7,16,18,22,25,40,50], 65);

  groep(`
    Kraagtrap=Chlamydotis undulata=Houbara
  `, [2,7,15,16,17,18,22,25,50], 65);

  groep(`
    Kori-trap=Ardeotis kori=Koritrap
  `, [2,5,7,15,16,17,18,22,50], 65);

  // ============================================================
  // BOERDERIJDIEREN EN ALGEMENE NAMEN
  // ============================================================

  groep(`
    Big;
    Zeug;
    Kalf;
    Melkkoe;
    Vleeskoe;
    Bok;
    Ram;
    Lam
  `, [4,13,18,20,46], 15);

  groep(`
    Hen
  `, [7,13,18,22,46], 15);

  groep(`
    Kuiken
  `, [13,18,22], 15);

  groep(`
    Veulen
  `, [4,13,16,18,20,34], 20);

  groep(`
    Boerenkat
  `, [4,8,13,17,18,20,27,34,35], 20);

  groep(`
    Melkkoe;
    Vleeskoe;
    Bok;
    Ram;
    Lam
  `, [16], 15);

  // ============================================================
  // RUNDER RASSEN
  // ============================================================

  groep(`
    Belgisch witblauw=Belgian Blue;
    Blaarkop=Groninger blaarkop;
    Fries-Hollands=Fries-Hollands rund;
    Guernsey=Guernseykoe;
    Jersey=Jerseykoe;
    Watusirund=Ankole-Watusi
  `, [4,13,16,18,20,40,46], 45);

  groep(`
    Watusirund
  `, [19,5], 55);

  // ============================================================
  // SCHAPEN, GEITEN EN VARKENSRASSEN
  // ============================================================

  groep(`
    Merino=Merinoschaap;
    Zwartbles
  `, [4,13,16,18,20,40,46], 45);

  groep(`
    Toggenburger=Toggenburger geit
  `, [4,13,16,18,20,35,40,46], 50);

  groep(`
    Hampshirevarken
  `, [4,13,16,18,20,46], 50);

  groep(`
    Hampshiredownschaap=Hampshire Down
  `, [4,13,16,18,20,40,46], 50);

  // ============================================================
  // PAARDEN- EN HONDENRASSEN
  // ============================================================

  groep(`
    Arabisch volbloed=Arabier;
    Engels volbloed=Thoroughbred;
    Fjord=Fjordenpaard
  `, [4,8,13,16,18,20,34,40], 40);

  groep(`
    Arabisch volbloed;
    Engels volbloed
  `, [29], 40);

  groep(`
    Windhond
  `, [4,8,17,18,20,29,34], 30);

  // ============================================================
  // KIPPENRASSEN
  // ============================================================

  groep(`
    Barnevelder;
    Brahma=Brahmakip;
    Cochin=Cochinkip;
    Hollandse kuifhoen=Hollands kuifhoen;
    Leghorn;
    Marans;
    Orpington;
    Plymouth Rock;
    Rhode Island Red;
    Sussex=Sussexkip;
    Welsumer;
    Wyandotte;
    Zijdehoen
  `, [7,8,13,18,22,40,46], 45);

  // ============================================================
  // EENDEN- EN GANZENRASSEN
  // ============================================================

  groep(`
    Cayuga=Cayuga-eend;
    Indische loopeend;
    Kwakereend;
    Pekingeend;
    Roueneend
  `, [7,8,13,14,18,22,40,46], 45);

  groep(`
    Chinese knobbelgans;
    Embdener gans=Emdener gans;
    Pommerse gans;
    Toulousegans
  `, [7,8,13,14,16,18,22,40,46], 50);

  // ============================================================
  // ZOETWATERVISSEN
  // ============================================================

  groep(`
    Alver=Alburnus alburnus;
    Voorn;
    Witvingrondel=Romanogobio belingi
  `, [1,7,14,18,21,26,37,50], 40);

  groep(`
    Alver;
    Voorn
  `, [38], 40);

  groep(`
    Meerzalm
  `, [1,7,14,17,18,21,38,50], 55);

  groep(`
    Arowana
  `, [1,8,14,17,18,21,37,50], 50);

  groep(`
    Apistogramma;
    Corydoras=Pantsermeerval
  `, [1,7,8,14,18,37,50], 50);

  groep(`
    Chinese danio=Tanichthys albonubes=Chinese kardinaalvis;
    Diamantgoerami=Trichopodus leerii;
    Kegelvlekbarbeel=Trigonostigma heteromorpha;
    Purperkopbarbeel=Pethia nigrofasciata;
    Kongozalm=Phenacogrammus interruptus=Congo zalm;
    Rouwtetra=Gymnocorymbus ternetzi;
    Vuurneon=Hyphessobrycon amandae;
    Zwarte neon=Hyphessobrycon herbertaxelrodi
  `, [1,7,8,14,18,21,40,50], 55);

  groep(`
    Schuberti=Goudbarbeel
  `, [1,7,8,14,18,21,40], 55);

  groep(`
    Maanvis=Pterophyllum scalare
  `, [1,7,8,14,17,18,21,37,48,50], 35);

  groep(`
    Rode piranha=Pygocentrus nattereri
  `, [1,7,8,14,17,18,21,37,40,50], 45);

  groep(`
    Redtail catfish=Phractocephalus hemioliopterus=Roodstaartmeerval;
    Tijgershovelnosemeerval=Pseudoplatystoma
  `, [1,7,14,17,18,37,50], 65);

  groep(`
    Panga=Pangasianodon hypophthalmus
  `, [1,7,14,18,37,40,46,50], 45);

  groep(`
    Sluierstaart
  `, [1,7,8,14,18,21,47], 25);

  groep(`
    Tijgervis=Hydrocynus
  `, [1,5,7,14,17,18,21,37,50], 55);

  groep(`
    Zebrabarbeel=Desmopuntius johorensis
  `, [1,7,8,14,18,21,40,48,50], 65);

  // ============================================================
  // ZEEVISSEN
  // ============================================================

  groep(`
    Europese zeebaars=Dicentrarchus labrax=Zeebaars
  `, [1,7,11,14,17,18,21,26,46,50], 35);

  groep(`
    Blauwgevlekte pijlstaartrog=Taeniura lymma
  `, [1,11,14,17,18,45,47,49,50], 60);

  groep(`
    Sidderrog
  `, [1,11,14,17,18,50], 55);

  groep(`
    Zee-engel=Engelhaai
  `, [1,11,14,17,18,50], 55);

  groep(`
    Zandhaai=Odontaspis ferox
  `, [1,11,14,17,18,50], 55);

  groep(`
    Marlijn
  `, [1,7,9,11,14,17,18,29,50], 50);

  groep(`
    Kongeraal=Congeraal=Zeepaling=Conger conger
  `, [1,7,11,14,17,18,50], 55);

  groep(`
    Gestreepte zeepaardje=Hippocampus erectus
  `, [1,11,14,17,18,48,50], 65);

  groep(`
    Zeedraak
  `, [1,11,14,17,18,50], 60);

  groep(`
    Zebraneonhaai
  `, [], 65);

  // Zebraneonhaai blijft zonder vraagkoppelingen
  // totdat duidelijk is welke soort bedoeld wordt.

  // ============================================================
  // SCHILDPADDEN
  // ============================================================

  groep(`
    Dikkopschildpad=Caretta caretta=Onechte karetschildpad
  `, [1,7,11,14,17,18,33,39,44,50], 45);

  groep(`
    Muskusschildpad=Sternotherus odoratus
  `, [1,4,7,8,14,17,18,33,37,38,50], 55);

  groep(`
    Slangenhalsschildpad=Chelodina
  `, [1,4,7,14,17,18,33,36,37,38,50], 60);

  // ============================================================
  // SCHAALDIEREN
  // ============================================================

  groep(`
    Amerikaanse rivierkreeft;
    Zoetwatergarnaal;
    Zoetwaterpissebed=Asellus aquaticus
  `, [1,7,37,38,50], 45);

  groep(`
    Amerikaanse rivierkreeft;
    Zoetwatergarnaal
  `, [14], 45);

  groep(`
    Neocaridina;
    Crystal Red-garnaal
  `, [1,7,8,10,14], 55);

  groep(`
    Witpootgarnaal=Litopenaeus vannamei=Penaeus vannamei
  `, [1,7,11,14,46,50], 55);

  groep(`
    Koningskrab;
    Zwemkrab
  `, [1,7,11,17,50], 45);

  groep(`
    Zwemkrab
  `, [14], 45);

  groep(`
    Wenkerkrab
  `, [1,7,39,50], 55);

  groep(`
    Kokoskrab=Birgus latro=Klapperdief
  `, [7,27,35,39,50], 55);

  groep(`
    Strandvlo=Talitrus saltator
  `, [7,10,26,34,39,50], 45);

  groep(`
    Pekelkreeftje=Artemia;
    Cyclops
  `, [1,7,10,14,50], 55);

  // ============================================================
  // WEEKDIEREN EN WORMEN
  // ============================================================

  groep(`
    Gewone zeekat=Sepia officinalis=Zeekat
  `, [1,7,11,14,17,26,42,50], 45);

  groep(`
    Patella=Schaalhoren
  `, [1,7,11,16,30,39,50], 55);

  groep(`
    Moerasslak
  `, [1,7,30,37,38,50], 55);

  groep(`
    Riviermossel
  `, [1,30,37,50], 45);

  groep(`
    Wadpier=Arenicola marina
  `, [1,7,11,26,32,39,50], 45);

  groep(`
    Tubifex
  `, [1,7,10,37,38,50], 60);

  // ============================================================
  // INSECTEN
  // ============================================================

  groep(`
    Bosmier
  `, [6,7,10,15,17,26,32,35,40,41,50], 35);

  groep(`
    Bromvlieg
  `, [2,7,10,26,50], 20);

  groep(`
    Geelgerande watertor=Dytiscus marginalis
  `, [1,2,7,10,14,15,17,26,38,50], 50);

  groep(`
    Rugzwemmer=Notonecta
  `, [1,2,7,10,14,15,17,26,38,50], 50);

  groep(`
    Sabelsprinkhaan;
    Wrattenbijter=Decticus verrucivorus
  `, [7,10,15,16,17,26,34,50], 50);

  groep(`
    Avondrood=Deilephila elpenor=Groot avondrood
  `, [2,7,18,26,27,47,50], 50);

  groep(`
    Morpho
  `, [2,7,12,47,50], 55);

  groep(`
    Pyjamawants=Graphosoma italicum=Gestreepte pyjamawants
  `, [7,10,16,26,47,48,50], 50);

  groep(`
    Tijgerzandloopkever
  `, [7,10,15,17,29,50], 60);

  // ============================================================
  // UITGESTORVEN DIEREN
  // ============================================================

  groep(`
    Sauroposeidon=Sauroposeidon proteles
  `, [4,7,9,16,18,36,43,50], 65);

  // ============================================================
  // EXTRA HERSTEL VAN ALGEMENE DIERNAMEN
  // ============================================================

  groep(`
    Vis
  `, [1,14,18,37,38,50], 10);

  groep(`
    Vogel
  `, [7,18,22,41,50], 10);

  groep(`
    Aap
  `, [3,6,12,16,20,31,34,35,40,50], 15);

  groep(`
    Miereneter
  `, [4,15,17,18,20,50], 20);

  groep(`
    Kever
  `, [7,50], 15);

  // ============================================================
  // HERSTEL VAN BEKENDE ONJUISTE KOPPELINGEN
  // ============================================================

  verwijderKoppeling("Maanvis", [11]);

  verwijderKoppeling("Zebravink", [11]);

  verwijderKoppeling("Kokoskrab", [1,11,14]);

  verwijderKoppeling("Haan", [7]);

  verwijderKoppeling("Gorilla", [18]);

  verwijderKoppeling("Chimpansee", [18]);

  verwijderKoppeling("Bonobo", [18]);

  verwijderKoppeling("Orang-oetan", [18]);

  verwijderKoppeling("Vliegende eekhoorn", [2]);

  verwijderKoppeling("Grote vliegende eekhoorn", [2]);

  verwijderKoppeling("Kiwi", [2]);

  verwijderKoppeling("Kakapo", [2]);

  verwijderKoppeling("Struisvogel", [2]);

  verwijderKoppeling("Emoe", [2]);

  verwijderKoppeling("Nandoe", [2]);

  verwijderKoppeling("Kasuaris", [2]);

  verwijderKoppeling("Tasmaanse duivel", [43]);

  verwijderKoppeling("Axolotl", [43]);

  verwijderKoppeling("Goudvis", [11]);

  // ============================================================
  // LOGISCHE KOPPELINGEN
  // ============================================================

  for (const record of dieren.values()) {

    if (
      record.vragen.has(11) ||
      record.vragen.has(37) ||
      record.vragen.has(38)
    ) {

      if (!record.vragen.has(1)) {
        record.vragen.set(1, 50);
        nieuweKoppelingen++;
      }
    }

    if (
      record.vragen.has(15) &&
      !record.vragen.has(17)
    ) {

      record.vragen.set(
        17,
        record.vragen.get(15)
      );

      nieuweKoppelingen++;
    }
  }

  // ============================================================
  // VERWIJDER ONJUISTE SYNONIEMEN
  // ============================================================

  function verwijderAlias(naam, alias) {

    const record = dieren.get(normaal(naam));

    if (!record) return;

    for (const item of [...record.aliases]) {

      if (normaal(item) === normaal(alias)) {
        record.aliases.delete(item);
      }
    }
  }

  // Woorden met meerdere echte betekenissen
  // mogen dubbelzinnig blijven.

  // Meerkat is in het Nederlands niet
  // automatisch hetzelfde als stokstaartje.

  verwijderAlias("Stokstaartje", "Meerkat");

  // ============================================================
  // EXPORT OPNIEUW OPBOUWEN
  // ============================================================

  function verdeelPunten(records) {

    const gesorteerd = [...records].sort(
      (a, b) =>
        a.score - b.score ||
        hash(a.answer) - hash(b.answer) ||
        a.answer.localeCompare(b.answer, "nl")
    );

    const aantal = gesorteerd.length;

    const aantalRaketten = raketten(aantal);

    const aantalNormaal =
      aantal - aantalRaketten;

    return gesorteerd.map((record, index) => {

      const isRocket =
        index >= aantalNormaal;

      const points =
        isRocket
          ? 100
          : aantalNormaal <= 1
            ? 10
            : 10 + Math.round(
                index /
                (aantalNormaal - 1) * 89
              );

      const {
        score,
        ...antwoord
      } = record;

      return {
        ...antwoord,
        points,
        isRocket
      };
    });
  }

  const vragen = categorie.questions.map(vraag => {

    const nummer = vraag.questionNumber;

    const antwoorden = [];

    for (const record of dieren.values()) {

      if (!record.vragen.has(nummer)) continue;

      antwoorden.push({
        answer: record.naam,
        aliases: [...record.aliases],
        score: record.vragen.get(nummer)
      });
    }

    const answers = verdeelPunten(antwoorden)
      .sort((a, b) =>
        a.answer.localeCompare(b.answer, "nl")
      );

    return {
      ...vraag,
      answers,
      answerCount: answers.length,
      rocketCount: answers.filter(
        antwoord => antwoord.isRocket
      ).length,
      dataVersion: VERSIE
    };
  });

  // ============================================================
  // NIEUWE ZOEKINDEX
  // ============================================================

  const zoekIndex = new Map();
  const naamconflicten = [];

  for (const vraag of vragen) {

    const index = new Map();

    for (const antwoord of vraag.answers) {

      for (const naam of [
        antwoord.answer,
        ...antwoord.aliases
      ]) {

        const sleutel = normaal(naam);

        if (!sleutel) continue;

        if (!index.has(sleutel)) {
          index.set(sleutel, []);
        }

        const opties = index.get(sleutel);

        if (!opties.includes(antwoord)) {
          opties.push(antwoord);
        }
      }
    }

    for (const [invoer, opties] of index) {

      opties.sort(
        (a, b) =>
          a.points - b.points ||
          a.answer.localeCompare(b.answer, "nl")
      );

      if (opties.length > 1) {

        naamconflicten.push({
          vraagnummer: vraag.questionNumber,
          invoer,
          mogelijkeDieren: opties.map(
            antwoord => antwoord.answer
          )
        });
      }
    }

    zoekIndex.set(
      vraag.questionNumber,
      index
    );
  }

  function check(nummer, invoer) {

    const index =
      zoekIndex.get(Number(nummer));

    if (!index) {
      return {
        valid: false,
        reason: "unknown-question"
      };
    }

    const opties = index.get(normaal(invoer));

    if (!opties?.length) {
      return {
        valid: false,
        reason: "unknown-answer"
      };
    }

    return {
      valid: true,
      ...opties[0],
      ambiguous: opties.length > 1,
      alternatives: opties.map(
        antwoord => antwoord.answer
      )
    };
  }

  // ============================================================
  // LETTERREGELS
  // ============================================================

  function letterAnswers(nummer, letter) {

    const vraag = vragen.find(
      item =>
        item.questionNumber === Number(nummer)
    );

    const beginletter = normaal(letter);

    if (
      !vraag ||
      !/^[a-z]$/.test(beginletter)
    ) return [];

    const resultaten = [];

    for (const antwoord of vraag.answers) {

      const passendeNamen = [
        antwoord.answer,
        ...antwoord.aliases
      ].filter(
        naam =>
          normaal(naam).startsWith(beginletter)
      );

      if (!passendeNamen.length) continue;

      resultaten.push({
        answer: passendeNamen[0],
        aliases: passendeNamen.slice(1),
        originalAnswer: antwoord.answer,
        score: antwoord.points
      });
    }

    return verdeelPunten(resultaten);
  }

  function availableLetters(nummer, minimum = 5) {

    return [..."abcdefghijklmnopqrstuvwxyz"]
      .map(letter => {

        const antwoorden =
          letterAnswers(nummer, letter);

        return {
          letter: letter.toUpperCase(),
          aantal: antwoorden.length,
          raketten: raketten(antwoorden.length)
        };
      })
      .filter(
        item => item.aantal >= minimum
      );
  }

  // ============================================================
  // ANTWOORDTESTEN OPNIEUW UITVOEREN
  // ============================================================

  const extraTests = [
    {nummer:2,invoer:"Struisvogel",verwacht:false},
    {nummer:7,invoer:"Struisvogel",verwacht:true},
    {nummer:22,invoer:"Struisvogel",verwacht:true},
    {nummer:22,invoer:"Emoe",verwacht:true},
    {nummer:22,invoer:"Kiwi",verwacht:true},
    {nummer:22,invoer:"Kasuaris",verwacht:true},
    {nummer:22,invoer:"Kakapo",verwacht:true},
    {nummer:22,invoer:"Zebravink",verwacht:true},
    {nummer:8,invoer:"Zebravink",verwacht:true},
    {nummer:2,invoer:"Kakapo",verwacht:false},
    {nummer:23,invoer:"Emoe",verwacht:true},
    {nummer:38,invoer:"Baikalrob",verwacht:true},
    {nummer:37,invoer:"Amazone-rivierdolfijn",verwacht:true},
    {nummer:33,invoer:"Muskusschildpad",verwacht:true},
    {nummer:43,invoer:"Sauroposeidon",verwacht:true},
    {nummer:39,invoer:"Wadpier",verwacht:true},
    {nummer:48,invoer:"Pyjamawants",verwacht:true},
    {nummer:11,invoer:"Goudvis",verwacht:false}
  ];

  const testIndex = new Map();

  for (const test of [
    ...oudeTests,
    ...extraTests
  ]) {

    const invoer =
      test.invoer || test.antwoord;

    const sleutel =
      test.nummer + ":" + normaal(invoer);

    testIndex.set(sleutel, {
      nummer: test.nummer,
      invoer,
      verwacht: test.verwacht
    });
  }

  const tests = [...testIndex.values()]
    .map(test => {

      const resultaat =
        check(test.nummer, test.invoer).valid;

      return {
        ...test,
        resultaat,
        geslaagd: resultaat === test.verwacht
      };
    });

  const mislukteTests =
    tests.filter(test => !test.geslaagd);

  const raketTests = oudeRaketTests.map(test => {

    const resultaat = raketten(test.antwoorden);

    return {
      ...test,
      resultaat,
      geslaagd: resultaat === test.verwacht
    };
  });

  // ============================================================
  // NIEUW RAPPORT
  // ============================================================

  const rapport = vragen.map(vraag => ({

    nummer: vraag.questionNumber,

    vraag: vraag.question,

    antwoorden: vraag.answers.length,

    normaal:
      vraag.answers.length - vraag.rocketCount,

    raketten: vraag.rocketCount,

    eerder:
      oudeAantallen[vraag.questionNumber - 1],

    toegevoegd:
      vraag.answers.length -
      oudeAantallen[vraag.questionNumber - 1],

    ontbrekend:
      Math.max(0, 1000 - vraag.answers.length),

    doelBereikt:
      vraag.answers.length >= 1000

  }));

  const ontbrekendeNamen =
    oudeOntbrekendeNamen.filter(naam => {

      return !vragen.some(vraag =>
        check(vraag.questionNumber, naam).valid
      );
    });

  const fouten = [];

  if (vragen.length !== 50) {
    fouten.push({
      fout: "Aantal vragen is niet 50"
    });
  }

  for (const vraag of vragen) {

    const namen = new Set();

    if (vraag.answers.length === 0) {

      fouten.push({
        vraag: vraag.questionNumber,
        fout: "Geen antwoorden"
      });
    }

    if (
      vraag.rocketCount !==
      raketten(vraag.answers.length)
    ) {

      fouten.push({
        vraag: vraag.questionNumber,
        fout: "Onjuist aantal raketten"
      });
    }

    for (const antwoord of vraag.answers) {

      const sleutel = normaal(antwoord.answer);

      if (namen.has(sleutel)) {

        fouten.push({
          vraag: vraag.questionNumber,
          antwoord: antwoord.answer,
          fout: "Dubbel antwoord"
        });
      }

      namen.add(sleutel);

      if (
        !Number.isInteger(antwoord.points) ||
        antwoord.points < 10 ||
        antwoord.points > 100 ||
        antwoord.isRocket !== (antwoord.points === 100)
      ) {

        fouten.push({
          vraag: vraag.questionNumber,
          antwoord: antwoord.answer,
          fout: "Ongeldige punten"
        });
      }
    }
  }

  const bruikbareDieren =
    [...dieren.values()].filter(
      record => record.vragen.size > 0
    ).length;

  const totaalAntwoorden =
    rapport.reduce(
      (som, vraag) => som + vraag.antwoorden,
      0
    );

  const totaalRaketten =
    rapport.reduce(
      (som, vraag) => som + vraag.raketten,
      0
    );

  const technischGereed =
    fouten.length === 0 &&
    mislukteTests.length === 0 &&
    raketTests.every(test => test.geslaagd);

  const summary = {

    ...oudeSamenvatting,

    versie: VERSIE,

    categorie: "Dieren",

    vragen: vragen.length,

    opgeslagenDierrecords:
      dieren.size,

    bruikbareDierrecords:
      bruikbareDieren,

    totaalVraagAntwoorden:
      totaalAntwoorden,

    totaalRaketten,

    gemiddeldAantalAntwoorden:
      Math.round(totaalAntwoorden / 50),

    vragenMet1000Antwoorden:
      rapport.filter(vraag => vraag.doelBereikt).length,

    vragenOnder1000:
      rapport.filter(vraag => !vraag.doelBereikt).length,

    geslaagdeAntwoordtests:
      tests.filter(test => test.geslaagd).length,

    mislukteAntwoordtests:
      mislukteTests.length,

    raketTestsGeslaagd:
      raketTests.every(test => test.geslaagd),

    exportFouten:
      fouten.length,

    naamconflicten:
      naamconflicten.length,

    nieuweDieren,

    nieuweKoppelingen,

    nieuweSynoniemen,

    eerdereBruikbareDieren:
      eersteAantalDieren,

    hersteldeOntbrekendeNamen:
      oudeOntbrekendeNamen.length -
      ontbrekendeNamen.length,

    nogOntbrekendeNamen:
      ontbrekendeNamen.length,

    overgeslagenConflicten:
      overgeslagenConflicten.length,

    inhoudOnafhankelijkGecontroleerd:
      false,

    puntenGebaseerdOpSpelersdata:
      false

  };

  // ============================================================
  // V9 CATEGORIE VERVANGEN
  // ============================================================

  Object.assign(categorie, {

    version: VERSIE,

    status: "concept",

    technicallyReady: technischGereed,

    contentVerified: false,

    questions: vragen,

    summary,

    report: rapport,

    check,

    letterAnswers,

    availableLetters

  });

  window.QB_V9_DIeren = {

    version: VERSIE,

    questions: vragen,

    summary,

    check,

    letterAnswers,

    availableLetters

  };

  // ============================================================
  // DEBUGFUNCTIES VERNIEUWEN
  // ============================================================

  window.QB_V9_DIeren_DEBUG = {

    samenvatting() {
      console.table(summary);
      return summary;
    },

    rapport() {
      console.table(rapport);
      return rapport;
    },

    tekorten() {
      return [...rapport]
        .filter(vraag => vraag.ontbrekend > 0)
        .sort(
          (a, b) => b.ontbrekend - a.ontbrekend
        );
    },

    grootsteVragen() {
      return [...rapport].sort(
        (a, b) => b.antwoorden - a.antwoorden
      );
    },

    kleinsteVragen() {
      return [...rapport].sort(
        (a, b) => a.antwoorden - b.antwoorden
      );
    },

    vraag(nummer) {
      return vragen.find(
        vraag =>
          vraag.questionNumber === Number(nummer)
      ) || null;
    },

    antwoorden(nummer) {
      return this.vraag(nummer)?.answers || [];
    },

    raketten(nummer) {
      return this.antwoorden(nummer).filter(
        antwoord => antwoord.isRocket
      );
    },

    punten(nummer) {
      return [...this.antwoorden(nummer)]
        .sort((a, b) => a.points - b.points);
    },

    check,

    letters: availableLetters,

    letter: letterAnswers,

    tests() {
      return tests;
    },

    mislukteTests() {
      return mislukteTests;
    },

    raketTests() {
      return raketTests;
    },

    fouten() {
      return fouten;
    },

    naamconflicten() {
      return naamconflicten;
    },

    ontbrekendeNamen() {
      return ontbrekendeNamen;
    },

    overgeslagenConflicten() {
      return overgeslagenConflicten;
    },

    technischGereed() {
      return technischGereed;
    }

  };

  window.QB_V9_DIeren_CONTROLE = {

    totaalDieren() {
      return dieren.size;
    },

    totaalKoppelingen() {
      return totaalAntwoorden;
    },

    voortgang() {
      return rapport;
    },

    controleerAntwoord(nummer, invoer) {

      const resultaat = check(nummer, invoer);

      return {
        geldig: resultaat.valid,
        ...resultaat
      };
    },

    antwoorden(nummer) {

      return vragen.find(
        vraag =>
          vraag.questionNumber === Number(nummer)
      )?.answers || [];
    },

    ontbrekendeNamen() {
      return ontbrekendeNamen;
    }

  };

  // ============================================================
  // RAPPORTAGE AANVULLING
  // ============================================================

  console.group("🎈 QuizBallon V9 - Dieren aanvulling 1");

  console.table(summary);

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

  console.log(
    "Nog ontbrekende namen:",
    ontbrekendeNamen.length
  );

  console.table(
    rapport.filter(
      vraag => vraag.toegevoegd !== 0
    )
  );

  if (overgeslagenConflicten.length) {
    console.warn("Handmatig te beoordelen naamconflicten:");
    console.table(overgeslagenConflicten);
  }

  if (mislukteTests.length) {
    console.warn("Mislukte antwoordtests:");
    console.table(mislukteTests);
  }

  if (fouten.length) {
    console.error("Technische fouten:");
    console.table(fouten);
  }

  console.log(
    "Struisvogeltest:",
    check(22, "Struisvogel")
  );

  console.log(
    "Technisch gereed:",
    technischGereed
  );

  console.log(
    "Biologische inhoud nog niet volledig geverifieerd."
  );

  console.groupEnd();

  // ============================================================
  // EINDE AANVULLING 1
  // ============================================================

})();
