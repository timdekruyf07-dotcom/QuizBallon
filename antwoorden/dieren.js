/* ============================================================
   QUIZBALLON V9
   CATEGORIE: DIEREN
   Bestand: antwoorden/dieren.js

   Iedere unieke diernaam wordt één keer opgeslagen.
   Een dier kan bij meerdere vragen een geldig antwoord zijn.
   Synoniemen tellen niet als afzonderlijke antwoorden.
   ============================================================ */

(function () {
  "use strict";

  const database = new Map();

  function normaliseer(tekst) {
    return String(tekst)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]/gu, "");
  }

  function dier(naam, vraagnummers, synoniemen = []) {
    const sleutel = normaliseer(naam);

    if (!sleutel) return;

    if (!database.has(sleutel)) {
      database.set(sleutel, {
        naam,
        vragen: new Set(),
        synoniemen: new Set()
      });
    }

    const record = database.get(sleutel);

    for (const nummer of vraagnummers) {
      if (!Number.isInteger(nummer) || nummer < 1 || nummer > 50) {
        throw new Error("Ongeldig vraagnummer: " + nummer);
      }

      record.vragen.add(nummer);
    }

    for (const synoniem of synoniemen) {
      if (normaliseer(synoniem) !== sleutel) {
        record.synoniemen.add(synoniem);
      }
    }
  }

  function groep(tekst, vragen) {
    tekst.split(";")
      .map(x => x.trim())
      .filter(Boolean)
      .forEach(regel => {
        const [naam, ...synoniemen] = regel
          .split("=")
          .map(x => x.trim());

        dier(naam, vragen, synoniemen);
      });
  }

  const vragen = [
    "Noem een dier dat in het water leeft.",
    "Noem een dier dat kan vliegen.",
    "Noem een dier dat je in een dierentuin kunt zien.",
    "Noem een dier dat vier poten heeft.",
    "Noem een dier dat in Afrika leeft.",
    "Noem een dier dat in een bos leeft.",
    "Noem een dier dat eieren legt.",
    "Noem een dier dat mensen als huisdier houden.",
    "Noem een dier dat groter is dan een mens.",
    "Noem een dier dat kleiner is dan een muis.",
    "Noem een dier dat in de zee leeft.",
    "Noem een dier dat in de jungle leeft.",
    "Noem een dier dat op een boerderij voorkomt.",
    "Noem een dier dat kan zwemmen.",
    "Noem een dier dat insecten eet.",
    "Noem een dier dat planten eet.",
    "Noem een dier dat andere dieren eet.",
    "Noem een dier met een staart.",
    "Noem een dier met hoorns.",
    "Noem een dier met een vacht.",
    "Noem een dier met schubben.",
    "Noem een dier met veren.",
    "Noem een dier dat in Australië leeft.",
    "Noem een dier dat in koude gebieden leeft.",
    "Noem een dier dat in de woestijn leeft.",
    "Noem een dier dat in Nederland in het wild voorkomt.",
    "Noem een dier dat je 's nachts kunt tegenkomen.",
    "Noem een dier dat een winterslaap houdt.",
    "Noem een dier dat heel snel kan bewegen.",
    "Noem een dier dat bijzonder langzaam beweegt.",
    "Noem een dier dat in een boom leeft.",
    "Noem een dier dat onder de grond leeft.",
    "Noem een dier dat een schild heeft.",
    "Noem een dier dat kan springen.",
    "Noem een dier dat kan klimmen.",
    "Noem een dier dat een lange nek heeft.",
    "Noem een dier dat in een rivier leeft.",
    "Noem een dier dat in een meer leeft.",
    "Noem een dier dat je op het strand kunt vinden.",
    "Noem een dier dat in groepen leeft.",
    "Noem een dier dat nesten bouwt.",
    "Noem een dier dat zijn kleur kan veranderen.",
    "Noem een dier dat uitgestorven is.",
    "Noem een dier dat heel oud kan worden.",
    "Noem een dier dat giftig is.",
    "Noem een dier dat mensen voor voedsel houden.",
    "Noem een dier dat een opvallende kleur heeft.",
    "Noem een dier met strepen.",
    "Noem een dier met stippen of vlekken.",
    "Noem een dier dat je in een natuurdocumentaire kunt zien."
  ];

  // ============================================================
  // WATERDIEREN
  // ============================================================

  // ALGEMENE ANTWOORDEN

  groep(`
    Vis=Fish;
    Waterzoogdier;
    Schaaldier;
    Weekdier;
    Zeedier;
    Zoetwatervis;
    Zeevis;
    Koraalvis;
    Diepzeevis;
    Watervogel;
    Waterinsect
  `, [1, 50]);

  // HAAIEN

  groep(`
    Haai=Shark;
    Witte haai=Carcharodon carcharias=Great white shark;
    Tijgerhaai=Galeocerdo cuvier=Tiger shark;
    Walvishaai=Rhincodon typus=Whale shark;
    Reuzenhaai=Cetorhinus maximus=Basking shark;
    Stierhaai=Carcharhinus leucas=Bull shark;
    Blauwe haai=Prionace glauca=Blue shark;
    Citroenhaai=Negaprion brevirostris;
    Makreelhaai=Isurus oxyrinchus;
    Langvinmakreelhaai=Isurus paucus;
    Haringhaai=Lamna nasus;
    Zalmhaai=Lamna ditropis;
    Zandtijgerhaai=Carcharias taurus;
    Zandbankhaai=Carcharhinus plumbeus;
    Zwartpunthaai=Carcharhinus limbatus;
    Zwartpuntrifhaai=Carcharhinus melanopterus;
    Witpuntrifhaai=Triaenodon obesus;
    Oceanische witpunthaai=Carcharhinus longimanus;
    Grijze rifhaai=Carcharhinus amblyrhynchos;
    Caribische rifhaai=Carcharhinus perezi;
    Zijdehaai=Carcharhinus falciformis;
    Galapagoshaai=Carcharhinus galapagensis;
    Grote hamerhaai=Sphyrna mokarran;
    Geschulpte hamerhaai=Sphyrna lewini;
    Gladde hamerhaai=Sphyrna zygaena;
    Hamerhaai;
    Kaphamerhaai=Sphyrna tiburo;
    Vleugelkophaai=Eusphyra blochii;
    Verpleegsterhaai=Ginglymostoma cirratum;
    Zebrahaai=Stegostoma tigrinum;
    Luipaardhaai=Triakis semifasciata;
    Epaulethaai=Hemiscyllium ocellatum;
    Bamboehaai;
    Bruingebande bamboehaai=Chiloscyllium punctatum;
    Witgevlekte bamboehaai=Chiloscyllium plagiosum;
    Hondshaai=Scyliorhinus canicula;
    Kathaai;
    Koraalkathaai=Atelomycterus marmoratus;
    Doornhaai=Squalus acanthias;
    Groenlandse haai=Somniosus microcephalus;
    Pacifische sluimerhaai=Somniosus pacificus;
    Zeskieuwshaai=Hexanchus griseus;
    Zevenkieuwshaai=Notorynchus cepedianus;
    Franjehaai=Chlamydoselachus anguineus;
    Koboldhaai=Mitsukurina owstoni;
    Reuzenbekhaai=Megachasma pelagios;
    Voshaai=Alopias vulpinus;
    Grootoogvoshaai=Alopias superciliosus;
    Pelagische voshaai=Alopias pelagicus;
    Koekjeshaai=Isistius brasiliensis;
    Engelhaai=Squatina squatina;
    Japanse engelhaai=Squatina japonica;
    Zaaghaai;
    Langsnuitzaaghaai=Pristiophorus cirratus;
    Australische stierkophaai=Heterodontus portusjacksoni;
    Hoornhaai=Heterodontus francisci;
    Wobbegong;
    Gevlekte wobbegong=Orectolobus maculatus;
    Gebaarde wobbegong=Eucrossorhinus dasypogon;
    Pajamahaai=Poroderma africanum;
    Luipaardkathaai=Poroderma pantherinum;
    Kleine lantaarnhaai=Etmopterus perryi;
    Zwarte doornhaai=Centroscyllium fabricii;
    Portugese ijshaai=Centroscymnus coelolepis
  `, [1, 11, 14, 17, 18, 50]);

  // ROGGEN

  groep(`
    Rog=Ray;
    Mantarog=Manta;
    Reuzenmanta=Mobula birostris;
    Rifmanta=Mobula alfredi;
    Pijlstaartrog=Stingray;
    Blauwpijlstaartrog=Taeniura lymma;
    Gevlekte adelaarsrog=Aetobatus narinari;
    Adelaarsrog=Myliobatis aquila;
    Koeneusrog=Rhinoptera bonasus;
    Stekelrog=Raja clavata;
    Sterrog=Amblyraja radiata;
    Blonde rog=Raja brachyura;
    Golfrog=Raja undulata;
    Gevlekte rog=Raja montagui;
    Kleinoogrog=Raja microocellata;
    Vleet;
    Elektrische rog;
    Gemarmerde sidderrog=Torpedo marmorata;
    Zwarte sidderrog=Tetronarce nobiliana;
    Gewone sidderrog=Torpedo torpedo;
    Gitaarrog;
    Gewone gitaarrog=Rhinobatos rhinobatos;
    Zaagvis;
    Kleintandzaagvis=Pristis pectinata;
    Groene zaagvis=Pristis zijsron;
    Dwergzaagvis=Pristis clavata;
    Langkamzaagvis=Anoxypristis cuspidata;
    Vlinderrog;
    Stekelvlinderrog=Gymnura altavela
  `, [1, 11, 14, 17, 18, 50]);

  // KABELJAUWACHTIGEN

  groep(`
    Kabeljauw=Gadus morhua=Cod;
    Pacifische kabeljauw=Gadus macrocephalus;
    Groenlandse kabeljauw=Gadus ogac;
    Schelvis=Melanogrammus aeglefinus;
    Wijting=Merlangius merlangus;
    Pollak=Pollachius pollachius;
    Koolvis=Pollachius virens;
    Blauwe wijting=Micromesistius poutassou;
    Zuidelijke blauwe wijting=Micromesistius australis;
    Leng=Molva molva;
    Blauwe leng=Molva dypterygia;
    Lom=Brosme brosme;
    Steenbolk=Trisopterus luscus;
    Dwergbolk=Trisopterus minutus;
    Kever=Trisopterus esmarkii;
    Europese heek=Merluccius merluccius;
    Kaapse heek=Merluccius capensis;
    Zilverheek=Merluccius bilinearis;
    Argentijnse heek=Merluccius hubbsi;
    Alaska koolvis=Gadus chalcogrammus;
    Poolkabeljauw=Boreogadus saida;
    Vierdradige meun=Enchelyopus cimbrius;
    Vijfdradige meun=Ciliata mustela;
    Driedradige meun=Gaidropsarus vulgaris;
    Grenadiervis;
    Rondneusgrenadiervis=Coryphaenoides rupestris
  `, [1, 7, 11, 14, 18, 50]);

  // HARINGEN, SARDINES EN ANSJOVISSEN

  groep(`
    Haring=Clupea harengus;
    Pacifische haring=Clupea pallasii;
    Sprot=Sprattus sprattus;
    Sardine=Sardina pilchardus;
    Ansjovis=Engraulis encrasicolus;
    Japanse ansjovis=Engraulis japonicus;
    Californische ansjovis=Engraulis mordax;
    Peruaanse ansjovis=Engraulis ringens;
    Elft=Alosa alosa;
    Fint=Alosa fallax;
    Amerikaanse elft=Alosa sapidissima;
    Ronde sardinella=Sardinella aurita;
    Platte sardinella=Sardinella maderensis;
    Pacifische sardine=Sardinops sagax;
    Menhaden=Brevoortia tyrannus;
    Atlantische menhaden;
    Golfmenhaden=Brevoortia patronus
  `, [1, 7, 11, 14, 18, 50]);

  // TONIJNEN EN MAKRELEN

  groep(`
    Tonijn;
    Blauwvintonijn=Thunnus thynnus;
    Pacifische blauwvintonijn=Thunnus orientalis;
    Zuidelijke blauwvintonijn=Thunnus maccoyii;
    Geelvintonijn=Thunnus albacares;
    Grootoogtonijn=Thunnus obesus;
    Witte tonijn=Albacore=Thunnus alalunga;
    Langstaarttonijn=Thunnus tonggol;
    Zwartvintonijn=Thunnus atlanticus;
    Skipjacktonijn=Katsuwonus pelamis;
    Atlantische bonito=Sarda sarda;
    Pacifische bonito=Sarda chiliensis;
    Makreel=Scomber scombrus;
    Spaanse makreel;
    Koningsmakreel=Scomberomorus cavalla;
    Indische makreel=Rastrelliger kanagurta;
    Wahoo=Acanthocybium solandri;
    Horsmakreel=Trachurus trachurus;
    Mediterrane horsmakreel=Trachurus mediterraneus;
    Blauwe horsmakreel=Trachurus picturatus
  `, [1, 7, 11, 14, 17, 18, 50]);

  // GROTE PELAGISCHE VISSEN

  groep(`
    Zwaardvis=Xiphias gladius;
    Blauwe marlijn=Makaira nigricans;
    Zwarte marlijn=Istiompax indica;
    Gestreepte marlijn=Kajikia audax;
    Witte marlijn=Kajikia albida;
    Zeilvis=Istiophorus platypterus;
    Speervis;
    Goudmakreel=Coryphaena hippurus=Mahi mahi;
    Kleine goudmakreel=Coryphaena equiselis;
    Grote barracuda=Sphyraena barracuda;
    Barracuda;
    Europese barracuda=Sphyraena sphyraena;
    Remora;
    Zuigvis=Echeneis naucrates;
    Loodsmannetje=Naucrates ductor;
    Cobia=Rachycentron canadum;
    Koningsvis=Seriola lalandi;
    Grote amberjack=Seriola dumerili;
    Japanse amberjack=Seriola quinqueradiata;
    Grote horsmakreel=Caranx ignobilis;
    Blauwvintrevally=Caranx melampygus;
    Gouden trevally=Gnathanodon speciosus;
    Pompano=Trachinotus carolinus
  `, [1, 7, 11, 14, 18, 50]);

  // PLATVISSEN

  groep(`
    Platvis;
    Schol=Pleuronectes platessa;
    Tong=Solea solea;
    Tarbot=Scophthalmus maximus;
    Griet=Scophthalmus rhombus;
    Schar=Limanda limanda;
    Bot=Platichthys flesus;
    Tongschar=Microstomus kitt;
    Heilbot=Hippoglossus hippoglossus;
    Pacifische heilbot=Hippoglossus stenolepis;
    Groenlandse heilbot=Reinhardtius hippoglossoides;
    Lange schar=Hippoglossoides platessoides;
    Hondstong=Glyptocephalus cynoglossus;
    Dwergtong=Buglossidium luteum;
    Franse tong=Pegusa lascaris;
    Gele tong=Pegusa impar;
    Zandspieringbot;
    Japanse bot=Paralichthys olivaceus;
    Californische heilbot=Paralichthys californicus;
    Zomerbot=Paralichthys dentatus;
    Winterbot=Pseudopleuronectes americanus;
    Pauwbot=Bothus mancus;
    Luipaardbot=Bothus pantherinus
  `, [1, 7, 11, 14, 18, 50]);

  // PALINGEN EN MURENEN

  groep(`
    Murene;
    Groene murene=Gymnothorax funebris;
    Reuzenmurene=Gymnothorax javanicus;
    Zebramurene=Gymnomuraena zebra;
    Sneeuwvlokmurene=Echidna nebulosa;
    Honingraatmurene=Gymnothorax favagineus;
    Geelkopmurene=Gymnothorax fimbriatus;
    Californische murene=Gymnothorax mordax;
    Mediterrane murene=Muraena helena;
    Drakenmurene=Enchelycore pardalis;
    Lintmurene=Rhinomuraena quaesita;
    Zeepaling=Congeraal=Conger conger;
    Tuinaal;
    Gevlekte tuinaal=Heteroconger hassi;
    Prachtige tuinaal=Gorgasia preclara;
    Pelikaanaal=Eurypharynx pelecanoides;
    Slangenaal;
    Grote zandspiering=Hyperoplus lanceolatus;
    Kleine zandspiering=Ammodytes tobianus
  `, [1, 7, 11, 14, 18, 50]);

  // ANEMOONVISSEN

  groep(`
    Clownvis=Anemoonvis;
    Gewone clownvis=Amphiprion ocellaris;
    Driebandanemoonvis=Amphiprion percula;
    Tomaatanemoonvis=Amphiprion frenatus;
    Rode anemoonvis=Amphiprion melanopus;
    Roze anemoonvis=Amphiprion perideraion;
    Zadelanemoonvis=Amphiprion polymnus;
    Clark-anemoonvis=Amphiprion clarkii;
    Oranje anemoonvis=Amphiprion sandaracinos;
    Maledivenanemoonvis=Amphiprion nigripes;
    Omananemoonvis=Amphiprion omanensis;
    Rode Zee-anemoonvis=Amphiprion bicinctus;
    Chocoladeanemoonvis=Amphiprion akindynos;
    Mauritiusanemoonvis=Amphiprion chrysogaster;
    Goudstreepclownvis=Amphiprion chrysopterus;
    Bordeauxclownvis=Premnas biaculeatus
  `, [1, 7, 11, 14, 18, 47, 50]);

  // DOKTERSVISSEN

  groep(`
    Doktersvis;
    Blauwe doktersvis=Paracanthurus hepatus;
    Gele doktersvis=Zebrasoma flavescens;
    Zwarte doktersvis=Zebrasoma rostratum;
    Paarse doktersvis=Zebrasoma xanthurum;
    Zeilvindoktersvis=Zebrasoma veliferum;
    Geeloogdoktersvis=Ctenochaetus strigosus;
    Bruine doktersvis=Zebrasoma scopas;
    Witborstdoktersvis=Acanthurus leucosternon;
    Achillesdoktersvis=Acanthurus achilles;
    Picasso doktersvis=Acanthurus triostegus;
    Gezichtsmaskerdoktersvis=Acanthurus japonicus;
    Sohaldoktersvis=Acanthurus sohal;
    Clowndoktersvis=Acanthurus lineatus;
    Atlantische blauwe doktersvis=Acanthurus coeruleus;
    Eenhoornvis;
    Blauwrugneushoornvis=Naso unicornis;
    Oranjestekeldoktersvis=Naso lituratus
  `, [1, 7, 11, 14, 18, 50]);

  // VLINDERVISSEN

  groep(`
    Vlindervis;
    Koperbandvlindervis=Chelmon rostratus;
    Vieroogvlindervis=Chaetodon capistratus;
    Draadvinvlindervis=Chaetodon auriga;
    Maskervlindervis=Chaetodon semilarvatus;
    Wasbeervlindervis=Chaetodon lunula;
    Citroenvlindervis=Chaetodon citrinellus;
    Zadelvlindervis=Chaetodon ephippium;
    Oranjevlekvlindervis=Chaetodon kleinii;
    Dubbelzadelvlindervis=Chaetodon ulietensis;
    Koraalvlindervis=Chaetodon trifascialis;
    Driebandvlindervis=Chaetodon trifasciatus;
    Bennettvlindervis=Chaetodon bennetti;
    Picasso vlindervis=Chaetodon ornatissimus;
    Langsnuitvlindervis=Forcipiger flavissimus;
    Grote langsnuitvlindervis=Forcipiger longirostris;
    Wimpelvis=Heniochus acuminatus;
    Schoolwimpelvis=Heniochus diphreutes
  `, [1, 7, 11, 14, 18, 47, 50]);

  // KEIZERSVISSEN

  groep(`
    Keizersvis;
    Keizerkeizersvis=Pomacanthus imperator;
    Franse keizersvis=Pomacanthus paru;
    Grijze keizersvis=Pomacanthus arcuatus;
    Blauwringkeizersvis=Pomacanthus annularis;
    Geelbandkeizersvis=Pomacanthus maculosus;
    Halvemaanvis=Pomacanthus semicirculatus;
    Koranvis;
    Koninginnenkeizersvis=Holacanthus ciliaris;
    Blauwe keizersvis=Holacanthus bermudensis;
    Rotskeizersvis=Holacanthus tricolor;
    Koningskeizersvis=Pygoplites diacanthus;
    Vlamkeizersvis=Centropyge loricula;
    Citroendwergkeizersvis=Centropyge flavissima;
    Koraalduivelkeizersvis=Centropyge bispinosa;
    Geelstaartdwergkeizersvis=Centropyge flavicauda;
    Potterdwergkeizersvis=Centropyge potteri;
    Japanse dwergkeizersvis=Centropyge interrupta;
    Heralddwergkeizersvis=Centropyge heraldi;
    Afrikaanse vlamrugkeizersvis=Centropyge acanthops;
    Zwartbandkeizersvis=Apolemichthys arcuatus
  `, [1, 7, 11, 14, 18, 47, 50]);

  // LIPVISSEN

  groep(`
    Lipvis;
    Napoleonvis=Cheilinus undulatus;
    Poetslipvis=Labroides dimidiatus;
    Hawaiiaanse poetslipvis=Labroides phthirophagus;
    Zesstreeplipvis=Pseudocheilinus hexataenia;
    Regenbooglipvis=Coris julis;
    Pauwlipvis=Symphodus tinca;
    Groene lipvis=Labrus viridis;
    Gevlekte lipvis=Labrus bergylta;
    Koekoekslipvis=Labrus mixtus;
    Goudsinellipvis;
    Gele lipvis=Halichoeres chrysus;
    Kerstlipvis=Halichoeres ornatissimus;
    Drievleklipvis=Halichoeres trimaculatus;
    Drakenlipvis=Novaculichthys taeniourus;
    Vogellipvis=Gomphosus varius;
    Varkensvis=Bodianus rufus;
    Californische schaapskop=Semicossyphus pulcher;
    Aziatische schaapskoplipvis=Semicossyphus reticulatus;
    Luipaardlipvis=Macropharyngodon meleagris;
    Pauwooglipvis;
    Poetsvis
  `, [1, 7, 11, 14, 18, 50]);

  // PAPEGAAIVISSEN

  groep(`
    Papegaaivis;
    Blauwe papegaaivis=Scarus coeruleus;
    Regenboogpapegaaivis=Scarus guacamaia;
    Koninginnenpapegaaivis=Scarus vetula;
    Stoplichtpapegaaivis=Sparisoma viride;
    Roodbandpapegaaivis=Sparisoma aurofrenatum;
    Mediterrane papegaaivis=Sparisoma cretense;
    Bultkoppapegaaivis=Bolbometopon muricatum;
    Groenkoppapegaaivis;
    Geelbandpapegaaivis;
    Papegaaivis met steile kop=Chlorurus microrhinos
  `, [1, 7, 11, 14, 18, 50]);

  // KOGELVISSEN EN KOFFERVISSEN

  groep(`
    Kogelvis=Pufferfish;
    Sterrenkogelvis=Arothron stellatus;
    Maskerkogelvis=Arothron diadematus;
    Zwartgevlekte kogelvis=Arothron nigropunctatus;
    Witgevlekte kogelvis=Arothron hispidus;
    Gestreepte kogelvis=Arothron manilensis;
    Goudringkogelvis=Arothron meleagris;
    Valentijnkogelvis=Canthigaster valentini;
    Blauwvlekkogelvis=Canthigaster solandri;
    Zwartzadelkogelvis;
    Japanse kogelvis=Takifugu rubripes;
    Egelvis=Porcupinefish;
    Langstekelige egelvis=Diodon holocanthus;
    Grote egelvis=Diodon hystrix;
    Koffervis;
    Gele koffervis=Ostracion cubicus;
    Blauwe koffervis=Ostracion meleagris;
    Hoornkoffervis=Lactoria cornuta;
    Bultkoffervis=Tetrosomus gibbosus;
    Gladde koffervis=Lactophrys triqueter;
    Driehoekskoffervis
  `, [1, 7, 11, 14, 18, 50]);

  // TREKKERVISSEN EN VIJLVISSEN

  groep(`
    Trekkervis;
    Blauwe trekkervis=Odonus niger;
    Clowntrekkervis=Balistoides conspicillum;
    Titanentrekkervis=Balistoides viridescens;
    Picassotrekkervis=Rhinecanthus aculeatus;
    Rechthoekige trekkervis=Rhinecanthus rectangulus;
    Grijze trekkervis=Balistes capriscus;
    Koninginnentrekkervis=Balistes vetula;
    Geelrandtrekkervis=Pseudobalistes flavimarginatus;
    Roze staarttrekkervis=Melichthys vidua;
    Zwarte trekkervis=Melichthys niger;
    Vijlv is=Vijlvis;
    Harlekijnvijlvis=Oxymonacanthus longirostris;
    Aiptasiavijlvis=Acreichthys tomentosus;
    Gekrabbelde vijlvis=Aluterus scriptus;
    Oranje vijlvis=Aluterus schoepfii
  `, [1, 7, 11, 14, 18, 50]);

  // ZEEPAARDJES EN ZEENAALDEN

  groep(`
    Zeepaardje=Seahorse;
    Kortsnuitzeepaardje=Hippocampus hippocampus;
    Langsnuitzeepaardje=Hippocampus guttulatus;
    Dwergzeepaardje=Hippocampus zosterae;
    Geel zeepaardje=Hippocampus kuda;
    Groot zeepaardje=Hippocampus abdominalis;
    Tijgerstaartzeepaardje=Hippocampus comes;
    Bargibants dwergzeepaardje=Hippocampus bargibanti;
    Denises dwergzeepaardje=Hippocampus denise;
    Japanse dwergzeepaardje=Hippocampus japapigu;
    Zeenaald;
    Grote zeenaald=Syngnathus acus;
    Kleine zeenaald=Syngnathus rostellatus;
    Adderzeenaald=Entelurus aequoreus;
    Trompetzeenaald=Syngnathus typhle;
    Dikkopzeenaald;
    Bladzeedraak=Phycodurus eques;
    Gewone zeedraak=Phyllopteryx taeniolatus;
    Robijnzeedraak=Phyllopteryx dewysea;
    Trompetvis=Aulostomus maculatus;
    Fluitvis=Fistularia commersonii
  `, [1, 11, 14, 50]);

  // SCHORPIOENVISSEN EN KORAALDUIVELS

  groep(`
    Schorpioenvis;
    Rode schorpioenvis=Scorpaena scrofa;
    Zwarte schorpioenvis=Scorpaena porcus;
    Kleine schorpioenvis=Scorpaena notata;
    Koraalduivel=Lionfish;
    Rode koraalduivel=Pterois volitans;
    Gewone koraalduivel=Pterois miles;
    Dwergkoraalduivel=Dendrochirus brachypterus;
    Zebrakoraalduivel=Dendrochirus zebra;
    Fuzzy dwergkoraalduivel;
    Steenvis=Stonefish;
    Rifsteenvis=Synanceia verrucosa;
    Estuariumsteenvis=Synanceia horrida;
    Bladschorpioenvis=Taenianotus triacanthus;
    Neusvis=Rhinopias;
    Duivelsvis=Inimicus didactylus
  `, [1, 7, 11, 14, 17, 45, 50]);

  // GRONDELS EN SLIJMVISSEN

  groep(`
    Grondel;
    Zwarte grondel=Gobius niger;
    Zandgrondel=Pomatoschistus minutus;
    Lozano's grondel=Pomatoschistus lozanoi;
    Dikkopje=Pomatoschistus microps;
    Glasgrondel=Aphia minuta;
    Rotsgrondel=Gobius paganellus;
    Luipaardgrondel=Thorogobius ephippiatus;
    Neongrondel=Elacatinus oceanops;
    Gele koraalgrondel=Gobiodon okinawae;
    Groene koraalgrondel=Gobiodon histrio;
    Diamantgrondel=Valenciennea puellaris;
    Goudkopgrondel=Valenciennea strigata;
    Vuurvis=Nemateleotris magnifica;
    Paarse vuurvis=Nemateleotris decora;
    Garnalengrondel;
    Slijmvis;
    Gehoornde slijmvis=Parablennius gattorugine;
    Pauwslijmvis=Salaria pavo;
    Gewone slijmvis=Lipophrys pholis;
    Grasmaaierslijmvis=Salarias fasciatus;
    Midasblenny=Ecsenius midas;
    Bicolorblenny=Ecsenius bicolor;
    Mandarijnpitvis=Synchiropus splendidus;
    Gevlekte mandarijnpitvis=Synchiropus picturatus
  `, [1, 7, 11, 14, 50]);

  // DIEPZEEVISSEN EN ANDERE BIJZONDERE ZEEVISSEN

  groep(`
    Hengelvis;
    Zeeduivel=Lophius piscatorius;
    Zwartbuikzeeduivel=Lophius budegassa;
    Diepzeehengelvis;
    Zwarte hengelvis=Melanocetus johnsonii;
    Lantaarnvis;
    Draakvis;
    Zwarte draakvis=Idiacanthus atlanticus;
    Addertandvis=Chauliodus sloani;
    Grote addertandvis=Chauliodus macouni;
    Diepzeebijlvis;
    Zilveren bijlvis=Argyropelecus aculeatus;
    Telescoopvis;
    Blobvis=Psychrolutes marcidus;
    Riemvis=Regalecus glesne;
    Kleine riemvis=Regalecus russelii;
    Coelacant=Latimeria chalumnae;
    Indonesische coelacant=Latimeria menadoensis;
    Vliegende vis;
    Zeewolf=Anarhichas lupus;
    Gevlekte zeewolf=Anarhichas minor;
    Blauwe zeewolf=Anarhichas denticulatus;
    Rode poon=Chelidonichthys lucerna;
    Grauwe poon=Eutrigla gurnardus;
    Engelse poon=Chelidonichthys cuculus;
    Vliegende poon=Dactylopterus volitans;
    Pieterman=Trachinus draco;
    Kleine pieterman=Echiichthys vipera;
    Zonnevis=Zeus faber;
    Mola mola=Oceaanmaanvis;
    Reuzenmaanvis=Mola alexandrini;
    Slanke maanvis=Ranzania laevis;
    Snotolf=Cyclopterus lumpus;
    Slakdolf=Liparis liparis;
    Harnasmannetje=Agonus cataphractus;
    Zeedonderpad=Myoxocephalus scorpius;
    Groene zeedonderpad=Taurulus bubalis;
    Gewone siddermeerval;
    Opah=Koningsvis=Lampris guttatus
  `, [1, 11, 14, 50]);

  // ZOETWATERVISSEN: KARPERACHTIGEN

  groep(`
    Karper=Cyprinus carpio;
    Goudvis=Carassius auratus;
    Koi;
    Schubkarper;
    Spiegelkarper;
    Lederkarper;
    Graskarper=Ctenopharyngodon idella;
    Zilverkarper=Hypophthalmichthys molitrix;
    Grootkopkarper=Hypophthalmichthys nobilis;
    Kroeskarper=Carassius carassius;
    Giebel=Carassius gibelio;
    Zeelt=Tinca tinca;
    Brasem=Abramis brama;
    Kolblei=Blicca bjoerkna;
    Blankvoorn=Rutilus rutilus;
    Ruisvoorn=Scardinius erythrophthalmus;
    Kopvoorn=Squalius cephalus;
    Serpeling=Leuciscus leuciscus;
    Winde=Leuciscus idus;
    Sneep=Chondrostoma nasus;
    Barbeel=Barbus barbus;
    Bittervoorn=Rhodeus amarus;
    Elrits=Phoxinus phoxinus;
    Riviergrondel=Gobio gobio;
    Roofblei=Leuciscus aspius;
    Blauwband=Pseudorasbora parva;
    Zebravis=Danio rerio;
    Pareldanio=Danio albolineatus;
    Luipaarddanio;
    Hemelse pareldanio=Danio margaritatus;
    Reuzendanio=Devario aequipinnatus;
    Kersenbarbeel=Puntius titteya;
    Tijgerbarbeel=Puntigrus tetrazona;
    Sumatraan;
    Rosy barbeel=Pethia conchonius;
    Zwarte robijnbarbeel=Pethia nigrofasciata;
    Gouden barbeel;
    Clownbarbeel;
    Vijfstreepbarbeel=Desmopuntius pentazona;
    Denisonbarbeel=Sahyadria denisonii;
    Harlekijnrasbora=Trigonostigma heteromorpha;
    Espeirasbora=Trigonostigma espei;
    Hengelrasbora=Trigonostigma hengeli;
    Chili rasbora=Boraras brigittae;
    Dwerg rasbora=Boraras maculatus;
    Schaarstaart rasbora=Rasbora trilineata;
    Grote rasbora
  `, [1, 7, 14, 18, 50]);

  // ZOETWATERVISSEN: BAARZEN EN SNOEKEN

  groep(`
    Baars=Perca fluviatilis;
    Gele baars=Perca flavescens;
    Snoek=Esox lucius;
    Muskie=Esox masquinongy;
    Amerikaanse kettingsnoek=Esox niger;
    Snoekbaars=Sander lucioperca;
    Amerikaanse snoekbaars=Sander vitreus;
    Pos=Gymnocephalus cernua;
    Zonnebaars=Lepomis gibbosus;
    Blauwkieuwzonnebaars=Lepomis macrochirus;
    Grootbekbaars=Micropterus salmoides;
    Kleinbekbaars=Micropterus dolomieu;
    Gestreepte baars=Morone saxatilis;
    Witte baars=Morone chrysops;
    Zwarte crappie=Pomoxis nigromaculatus;
    Witte crappie=Pomoxis annularis;
    Nijlbaars=Lates niloticus;
    Kwabaal=Lota lota
  `, [1, 7, 14, 17, 18, 50]);

  // ZALMEN EN FORELLEN

  groep(`
    Zalm;
    Atlantische zalm=Salmo salar;
    Koningszalm=Oncorhynchus tshawytscha;
    Rode zalm=Oncorhynchus nerka;
    Zilverzalm=Oncorhynchus kisutch;
    Roze zalm=Oncorhynchus gorbuscha;
    Chumzalm=Oncorhynchus keta;
    Masuzalm=Oncorhynchus masou;
    Forel;
    Regenboogforel=Oncorhynchus mykiss;
    Bruine forel=Salmo trutta;
    Beekforel;
    Meerforel;
    Zeeforel;
    Bronforel=Salvelinus fontinalis;
    Canadese meerforel=Salvelinus namaycush;
    Arctische riddervis=Salvelinus alpinus;
    Vlagzalm=Thymallus thymallus;
    Siberische vlagzalm=Thymallus arcticus;
    Houting;
    Marene=Coregonus lavaretus;
    Kleine marene=Coregonus albula;
    Omul=Coregonus migratorius;
    Donauzalm=Hucho hucho;
    Taimen=Hucho taimen;
    Lenok=Brachymystax lenok;
    Spiering=Osmerus eperlanus
  `, [1, 7, 14, 18, 50]);

  // STEUREN EN ANDERE OUDE VISGROEPEN

  groep(`
    Steur;
    Europese steur=Acipenser sturio;
    Atlantische steur=Acipenser oxyrinchus;
    Russische steur=Acipenser gueldenstaedtii;
    Siberische steur=Acipenser baerii;
    Sterlet=Acipenser ruthenus;
    Witte steur=Acipenser transmontanus;
    Meersteur=Acipenser fulvescens;
    Kortsnuitsteur=Acipenser brevirostrum;
    Groene steur=Acipenser medirostris;
    Belugasteur=Huso huso;
    Kalugasteur=Huso dauricus;
    Lepelsteur=Polyodon spathula;
    Longvis;
    Australische longvis=Neoceratodus forsteri;
    Zuid-Amerikaanse longvis=Lepidosiren paradoxa;
    Afrikaanse longvis;
    Marmerlongvis=Protopterus aethiopicus;
    Senegalese kwastsnoek=Polypterus senegalus;
    Prachtkwastsnoek=Polypterus ornatipinnis;
    Kwastsnoek;
    Rietvis=Erpetoichthys calabaricus;
    Beensnoek;
    Alligatorgeep=Atractosteus spatula;
    Gevlekte beensnoek=Lepisosteus oculatus;
    Langsnuitbeensnoek=Lepisosteus osseus;
    Kaaimansnoek;
    Moddersnoek=Amia calva
  `, [1, 7, 14, 50]);

  // MEERVALLEN

  groep(`
    Meerval;
    Europese meerval=Silurus glanis;
    Griekse meerval=Silurus aristotelis;
    Afrikaanse meerval=Clarias gariepinus;
    Wandelende meerval=Clarias batrachus;
    Kanaalmeerval=Ictalurus punctatus;
    Blauwe meerval=Ictalurus furcatus;
    Bruine dwergmeerval=Ameiurus nebulosus;
    Zwarte dwergmeerval=Ameiurus melas;
    Gele dwergmeerval=Ameiurus natalis;
    Plattekopmeerval=Pylodictis olivaris;
    Roodstaartmeerval=Phractocephalus hemioliopterus;
    Tijgerspadebekmeerval=Pseudoplatystoma tigrinum;
    Pangasius=Pangasianodon hypophthalmus;
    Mekongreuzenmeerval=Pangasianodon gigas;
    Glasmeerval=Kryptopterus vitreolus;
    Siddermeerval=Malapterurus electricus;
    Pantsermeerval;
    Harnasmeerval;
    Borstelneusmeerval=Ancistrus;
    Zebrameerval=Hypancistrus zebra;
    Koningspleco=Panaque nigrolineatus;
    Pleco;
    Clownpleco=Panaqolus maccus;
    Goudklompmeerval=Baryancistrus xanthellus;
    Otocinclus;
    Peperpantsermeerval=Corydoras paleatus;
    Pandapantsermeerval=Corydoras panda;
    Bronzen pantsermeerval=Corydoras aeneus;
    Dwergpantsermeerval=Corydoras pygmaeus;
    Julii-pantsermeerval=Corydoras julii;
    Sterbai-pantsermeerval=Corydoras sterbai;
    Omgekeerde meerval=Synodontis nigriventris;
    Koekoeksmeerval=Synodontis multipunctatus;
    Veervinmeerval=Synodontis eupterus;
    Pratende meerval=Platydoras armatulus;
    Gevlekte Raphaelmeerval=Agamyxis pectinifrons;
    Zuigmeerval
  `, [1, 7, 14, 50]);

  // TROPISCHE ZOETWATERVISSEN

  groep(`
    Piranha;
    Roodbuikpiranha=Pygocentrus nattereri;
    Zwarte piranha=Serrasalmus rhombeus;
    Pacu;
    Rode pacu=Piaractus brachypomus;
    Zwarte pacu=Colossoma macropomum;
    Zilverdollarvis=Metynnis;
    Zilveren arowana=Osteoglossum bicirrhosum;
    Zwarte arowana=Osteoglossum ferreirai;
    Aziatische arowana=Scleropages formosus;
    Australische arowana=Scleropages jardinii;
    Arapaima=Arapaima gigas;
    Afrikaanse beentong=Heterotis niloticus;
    Sidderaal=Electrophorus electricus;
    Voltas sidderaal=Electrophorus voltai;
    Zwarte mesvis=Apteronotus albifrons;
    Bruine mesvis=Apteronotus leptorhynchus;
    Clownmesvis=Chitala ornata;
    Afrikaanse mesvis=Xenomystus nigri;
    Olifantsvis=Gnathonemus petersii;
    Vlindervis uit Afrika=Pantodon buchholzi;
    Afrikaanse tijgervis=Hydrocynus vittatus;
    Goliathtijgervis=Hydrocynus goliath;
    Payara=Hydrolycus scomberoides;
    Zilveren tandkarper;
    Zoetwaterbarracuda=Ctenolucius hujeta
  `, [1, 14, 50]);

  // TETRA'S

  groep(`
    Tetra;
    Neontetra=Paracheirodon innesi;
    Kardinaaltetra=Paracheirodon axelrodi;
    Groene neontetra=Paracheirodon simulans;
    Zwarte neontetra=Hyphessobrycon herbertaxelrodi;
    Zwarte tetra=Gymnocorymbus ternetzi;
    Citroentetra=Hyphessobrycon pulchripinnis;
    Vuurtetra=Hyphessobrycon amandae;
    Fantoomtetra;
    Zwarte fantoomtetra=Hyphessobrycon megalopterus;
    Rode fantoomtetra=Hyphessobrycon sweglesi;
    Diamanttetra=Moenkhausia pittieri;
    Roodogentetra=Moenkhausia sanctaefilomenae;
    Keizertetra=Nematobrycon palmeri;
    Regenboogtetra=Nematobrycon lacortei;
    Kongotetra=Phenacogrammus interruptus;
    Afrikaanse roodogentetra;
    Serpaetetra=Hyphessobrycon eques;
    Pristellatetra=Pristella maxillaris;
    Bloedvlektetra=Hyphessobrycon erythrostigma;
    Zilvertiptetra=Hasemania nana;
    Koperzalm;
    Gloeilichttetra=Hemigrammus erythrozonus;
    Roodkopzalm;
    Roodneustetra;
    Buenos Airestetra=Hyphessobrycon anisitsi;
    Keeltetra;
    Grottetra=Astyanax mexicanus;
    Blinde holenvis;
    Bijlzalm;
    Marmeren bijlzalm=Carnegiella strigata;
    Zilveren bijlzalm=Gasteropelecus sternicla
  `, [1, 7, 14, 50]);

  // LEVENDBARENDE AQUARIUMVISSEN

  groep(`
    Guppy=Poecilia reticulata;
    Endlerguppy=Poecilia wingei;
    Molly;
    Zwarte molly;
    Zeilvinmolly=Poecilia latipinna;
    Grote zeilvinmolly=Poecilia velifera;
    Platy=Xiphophorus maculatus;
    Zwaarddrager=Xiphophorus hellerii;
    Variatusplaty=Xiphophorus variatus;
    Muskietenvis=Gambusia affinis;
    Oostelijke muskietenvis=Gambusia holbrooki;
    Dwergtandkarper=Heterandria formosa;
    Vieroogvis=Anableps anableps;
    Amecaprachtkarper=Ameca splendens;
    Goodeide
  `, [1, 14, 50]);

  // CICHLIDEN

  groep(`
    Cichlide;
    Discusvis=Discus;
    Groene discusvis=Symphysodon tarzoo;
    Heckeldiscus=Symphysodon discus;
    Zoetwatermaanvis=Pterophyllum scalare;
    Altummaanvis=Pterophyllum altum;
    Leopolds maanvis=Pterophyllum leopoldi;
    Oscarvis=Astronotus ocellatus;
    Ramirezi=Mikrogeophagus ramirezi;
    Boliviaanse ramirezi=Mikrogeophagus altispinosus;
    Kersenbuikcichlide=Pelvicachromis pulcher;
    Kaketoedwergcichlide=Apistogramma cacatuoides;
    Agassizdwergcichlide=Apistogramma agassizii;
    Borellidwergcichlide=Apistogramma borellii;
    Blauwe acara=Andinoacara pulcher;
    Groene terreurcichlide=Andinoacara rivulatus;
    Vuurkeelcichlide=Thorichthys meeki;
    Jaguarcichlide=Parachromis managuensis;
    Zebracichlide=Amatitlania nigrofasciata;
    Citroencichlide=Amphilophus citrinellus;
    Rode duivelscichlide=Amphilophus labiatus;
    Jack Dempseycichlide=Rocio octofasciata;
    Texas cichlide=Herichthys cyanoguttatus;
    Regenboogcichlide=Herotilapia multispinosa;
    Severumcichlide=Heros severus;
    Sleutelgatcichlide=Cleithracara maronii;
    Chocoladecichlide=Hypselecara temporalis;
    Uarucichlide=Uaru amphiacanthoides;
    Pauwoogcichlide;
    Nijltilapia=Oreochromis niloticus;
    Mozambiquetilapia=Oreochromis mossambicus;
    Blauwe tilapia=Oreochromis aureus;
    Tilapia;
    Juweelcichlide;
    Vijfstreepcichlide=Neolamprologus tretocephalus;
    Prinses van Burundi=Neolamprologus brichardi;
    Slakkenhuiscichlide=Neolamprologus multifasciatus;
    Frontosacichlide=Cyphotilapia frontosa;
    Citroenlamprologus=Neolamprologus leleupi;
    Julidochromis;
    Tropheus;
    Tropheus moorii;
    Gele labidochromis=Labidochromis caeruleus;
    Blauwe zebracichlide=Maylandia zebra;
    Demasonicichlide=Chindongo demasoni;
    Electric blue hap=Sciaenochromis fryeri;
    Venustuscichlide=Nimbochromis venustus;
    Livingstoncichlide=Nimbochromis livingstonii;
    Pauwcichlide=Aulonocara;
    Keizercichlide;
    Mbuna
  `, [1, 7, 14, 50]);

  // GOERAMI'S EN LABYRINTVISSEN

  groep(`
    Goerami;
    Dwerggoerami=Trichogaster lalius;
    Honinggoerami=Trichogaster chuna;
    Parelgoerami=Trichopodus leerii;
    Blauwe goerami=Trichopodus trichopterus;
    Mozaïekgoerami;
    Maanlichtgoerami=Trichopodus microlepis;
    Slangenhuidgoerami=Trichopodus pectoralis;
    Kussende goerami=Helostoma temminckii;
    Reuzengoerami=Osphronemus goramy;
    Chocoladegoerami=Sphaerichthys osphromenoides;
    Knorrende goerami=Trichopsis vittata;
    Dwergknorgoerami=Trichopsis pumila;
    Paradijsvis=Macropodus opercularis;
    Siamese kempvis=Betta splendens;
    Kli mbaars=Klimbaars=Anabas testudineus;
    Betta imbellis;
    Betta smaragdina;
    Betta mahachaiensis
  `, [1, 7, 14, 50]);

  // MODDERKRUIPERS EN BOTIA'S

  groep(`
    Modderkruiper;
    Grote modderkruiper=Misgurnus fossilis;
    Kleine modderkruiper=Cobitis taenia;
    Bermpje=Barbatula barbatula;
    Oosterse modderkruiper=Misgurnus anguillicaudatus;
    Kuhli=Indische modderkruiper=Pangio kuhlii;
    Zwarte kuhli=Pangio oblonga;
    Clownbotia=Chromobotia macracanthus;
    Zebrabotia=Botia striata;
    Yoyobotia=Botia almorhae;
    Schakenbordbotia=Ambastaia sidthimunki;
    Blauwe botia=Yasuhikotakia modesta;
    Paardekopmodderkruiper=Acantopsis dialuzona;
    Riviermodderkruiper;
    Borneozuigkruiper=Gastromyzon;
    Chinese algeneter=Gyrinocheilus aymonieri;
    Siamese algeneter;
    Sewellia lineolata
  `, [1, 7, 14, 50]);

  // REGENBOOGVISSEN

  groep(`
    Regenboogvis;
    Boesemans regenboogvis=Melanotaenia boesemani;
    Rode regenboogvis=Glossolepis incisus;
    Dwergregenboogvis=Melanotaenia praecox;
    Driebandsregenboogvis=Melanotaenia trifasciata;
    Turkooizen regenboogvis=Melanotaenia lacustris;
    Oostelijke regenboogvis=Melanotaenia splendida;
    Westelijke regenboogvis=Melanotaenia australis;
    Threadfin regenboogvis=Iriatherina werneri;
    Celebesregenboogvis=Marosatherina ladigesi;
    Vorkstaartblauwoog=Pseudomugil furcatus;
    Gertrudes blauwoog=Pseudomugil gertrudae;
    Rode neonblauwoog=Pseudomugil luminatus
  `, [1, 7, 14, 50]);

  // WALVISSEN

  groep(`
    Walvis=Whale;
    Blauwe vinvis=Balaenoptera musculus=Blue whale;
    Gewone vinvis=Balaenoptera physalus;
    Noordse vinvis=Balaenoptera borealis;
    Brydevinvis=Balaenoptera brydei;
    Edenvinvis=Balaenoptera edeni;
    Omuravinvis=Balaenoptera omurai;
    Dwergvinvis=Balaenoptera acutorostrata;
    Antarctische dwergvinvis=Balaenoptera bonaerensis;
    Bultrug=Megaptera novaeangliae=Humpback whale;
    Grijze walvis=Eschrichtius robustus;
    Groenlandse walvis=Balaena mysticetus;
    Noord-Atlantische noordkaper=Eubalaena glacialis;
    Noord-Pacifische noordkaper=Eubalaena japonica;
    Zuidkaper=Eubalaena australis;
    Dwergwalvis=Caperea marginata;
    Potvis=Physeter macrocephalus=Sperm whale;
    Dwergpotvis=Kogia breviceps;
    Kleine potvis=Kogia sima;
    Narwal=Monodon monoceros;
    Beloega=Beluga=Witte walvis=Delphinapterus leucas;
    Orka=Orcinus orca=Killer whale;
    Zwarte zwaardwalvis=Pseudorca crassidens;
    Dwergzwaardwalvis=Feresa attenuata;
    Griend=Globicephala melas;
    Indische griend=Globicephala macrorhynchus;
    Meloenkopdolfijn=Peponocephala electra;
    Noordelijke butskop=Hyperoodon ampullatus;
    Zuidelijke butskop=Hyperoodon planifrons;
    Spitssnuitdolfijn;
    Gewone spitssnuitdolfijn=Ziphius cavirostris;
    Arnouxspitssnuitdolfijn=Berardius arnuxii;
    Bairdspitssnuitdolfijn=Berardius bairdii;
    Stejnegers spitssnuitdolfijn=Mesoplodon stejnegeri;
    Blainvilles spitssnuitdolfijn=Mesoplodon densirostris;
    Gervaisspitssnuitdolfijn=Mesoplodon europaeus;
    True-spitssnuitdolfijn=Mesoplodon mirus;
    Grays spitssnuitdolfijn=Mesoplodon grayi;
    Sowerbyspitssnuitdolfijn=Mesoplodon bidens;
    Hectors spitssnuitdolfijn=Mesoplodon hectori;
    Ginkgo-spitssnuitdolfijn=Mesoplodon ginkgodens;
    Deraniyagala-spitssnuitdolfijn=Mesoplodon hotaula;
    Perrin-spitssnuitdolfijn=Mesoplodon perrini;
    Dwergspitssnuitdolfijn=Mesoplodon peruvianus;
    Longmans spitssnuitdolfijn=Indopacetus pacificus
  `, [1, 11, 14, 17, 18, 50]);

  // DOLFIJNEN EN BRUINVISSEN

  groep(`
    Dolfijn=Dolphin;
    Tuimelaar=Tursiops truncatus=Bottlenose dolphin;
    Indische tuimelaar=Tursiops aduncus;
    Gewone dolfijn=Delphinus delphis;
    Gestreepte dolfijn=Stenella coeruleoalba;
    Atlantische gevlekte dolfijn=Stenella frontalis;
    Pantropische gevlekte dolfijn=Stenella attenuata;
    Spinnerdolfijn=Stenella longirostris;
    Clymenedolfijn=Stenella clymene;
    Witflankdolfijn=Leucopleurus acutus;
    Witsnuitdolfijn=Lagenorhynchus albirostris;
    Witgestreepte dolfijn=Sagmatias obliquidens;
    Donkergestreepte dolfijn=Sagmatias obscurus;
    Zandloperdolfijn=Sagmatias cruciger;
    Peales dolfijn=Pealesdolfijn;
    Grijze dolfijn=Grampus griseus;
    Langsnuitdolfijn=Steno bredanensis;
    Atlantische bultrugdolfijn=Sousa teuszii;
    Indische bultrugdolfijn=Sousa plumbea;
    Chinese witte dolfijn=Sousa chinensis;
    Australische bultrugdolfijn=Sousa sahulensis;
    Australische snubvindolfijn=Orcaella heinsohni;
    Hectordolfijn=Cephalorhynchus hectori;
    Mauidolfijn;
    Commersondolfijn=Cephalorhynchus commersonii;
    Chileense dolfijn=Cephalorhynchus eutropia;
    Heavisidedolfijn=Cephalorhynchus heavisidii;
    Noordelijke gladde dolfijn=Lissodelphis borealis;
    Zuidelijke gladde dolfijn=Lissodelphis peronii;
    Fraser-dolfijn=Lagenodelphis hosei;
    Bruinvis=Phocoena phocoena;
    Californische bruinvis=Vaquita=Phocoena sinus;
    Burmeisters bruinvis=Phocoena spinipinnis;
    Brilbruinvis=Phocoena dioptrica;
    Dallbruinvis=Phocoenoides dalli;
    Indische bruinvis=Neophocaena phocaenoides;
    Smalrugbruinvis=Neophocaena asiaeorientalis
  `, [1, 11, 14, 17, 18, 50]);

  // ZEEHONDEN, ZEELEEUWEN EN WALRUSSEN

  groep(`
    Zeehond=Seal;
    Gewone zeehond=Phoca vitulina;
    Grijze zeehond=Halichoerus grypus;
    Ringelrob=Pusa hispida;
    Baardrob=Erignathus barbatus;
    Zadelrob=Pagophilus groenlandicus;
    Klapmuts=Cystophora cristata;
    Lintrob=Histriophoca fasciata;
    Larghazeehond=Phoca largha;
    Weddellzeehond=Leptonychotes weddellii;
    Rosszeehond=Ommatophoca rossii;
    Krabbeneter=Lobodon carcinophaga;
    Zeeluipaard=Hydrurga leptonyx;
    Noordelijke zeeolifant=Mirounga angustirostris;
    Zuidelijke zeeolifant=Mirounga leonina;
    Mediterrane monniksrob=Monachus monachus;
    Hawaiiaanse monniksrob=Neomonachus schauinslandi;
    Zeeleeuw=Sea lion;
    Californische zeeleeuw=Zalophus californianus;
    Stellerzeeleeuw=Eumetopias jubatus;
    Australische zeeleeuw=Neophoca cinerea;
    Nieuw-Zeelandse zeeleeuw=Phocarctos hookeri;
    Zuid-Amerikaanse zeeleeuw=Otaria flavescens;
    Galapagoszeeleeuw=Zalophus wollebaeki;
    Noordelijke pelsrob=Callorhinus ursinus;
    Antarctische pelsrob=Arctocephalus gazella;
    Kaapse pelsrob=Arctocephalus pusillus;
    Nieuw-Zeelandse pelsrob=Arctocephalus forsteri;
    Zuid-Amerikaanse pelsrob=Arctocephalus australis;
    Galapagospelsrob=Arctocephalus galapagoensis;
    Guadalupepelsrob=Arctocephalus townsendi;
    Subantarctische pelsrob=Arctocephalus tropicalis;
    Juan Fernandez-pelsrob=Arctocephalus philippii;
    Walrus=Odobenus rosmarus
  `, [1, 11, 14, 17, 50]);

  // ZEESCHILDPADDEN

  groep(`
    Zeeschildpad;
    Groene zeeschildpad=Soepschildpad=Chelonia mydas;
    Lederschildpad=Dermochelys coriacea;
    Karetschildpad=Eretmochelys imbricata;
    Onechte karetschildpad=Caretta caretta;
    Warana=Lepidochelys olivacea;
    Kemps zeeschildpad=Lepidochelys kempii;
    Platrugzeeschildpad=Natator depressus
  `, [1, 7, 11, 14, 18, 50]);

  // ZEESLANGEN EN ANDERE ZEEREPTIELEN

  groep(`
    Zeeslang;
    Geelbuikzeeslang=Hydrophis platurus;
    Geelgestreepte zeeslang=Hydrophis cyanocinctus;
    Sierlijke zeeslang=Hydrophis elegans;
    Olijfzeeslang=Aipysurus laevis;
    Gebande zeekrait=Laticauda colubrina;
    Blauwgestreepte zeekrait=Laticauda laticaudata;
    Zeekrait;
    Duboiszeeslang=Aipysurus duboisii;
    Kortneuszeeslang=Aipysurus apraefrontalis;
    Bladschubzeeslang=Aipysurus foliosquama
  `, [1, 11, 14, 17, 18, 21, 50]);

  groep(`
    Zeeleguaan=Amblyrhynchus cristatus=Marine iguana;
    Zeekrokodil=Crocodylus porosus;
    Amerikaanse krokodil=Crocodylus acutus
  `, [1, 4, 7, 11, 14, 18, 21, 50]);

  // LAMANTIJNEN EN ZEEKOEIEN

  groep(`
    Zeekoe;
    Doegong=Dugong dugon;
    Caribische lamantijn=Trichechus manatus;
    Afrikaanse lamantijn=Trichechus senegalensis
  `, [1, 11, 14, 16, 50]);

  groep(`
    Amazonelamantijn=Trichechus inunguis
  `, [1, 14, 16, 37, 50]);

  // ZOETWATERZOOGDIEREN

  groep(`
    Bever;
    Europese bever=Castor fiber;
    Canadese bever=Castor canadensis;
    Muskusrat=Ondatra zibethicus;
    Beverrat=Myocastor coypus;
    Capibara=Hydrochoerus hydrochaeris;
    Kleine capibara=Hydrochoerus isthmius;
    Nijlpaard=Hippopotamus amphibius;
    Dwergnijlpaard=Choeropsis liberiensis;
    Otter;
    Europese otter=Lutra lutra;
    Reuzenotter=Pteronura brasiliensis;
    Dwergotter=Aonyx cinereus;
    Canadese rivierotter=Lontra canadensis;
    Neotropische otter=Lontra longicaudis;
    Afrikaanse klauwloze otter=Aonyx capensis;
    Congolese klauwloze otter=Aonyx congicus;
    Gevlekte otter=Hydrictis maculicollis;
    Gladharige otter=Lutrogale perspicillata;
    Sumatraanse otter=Lutra sumatrana;
    Wateropossum=Chironectes minimus;
    Pyreneese desman=Galemys pyrenaicus;
    Russische desman=Desmana moschata;
    Waterspitsmuis=Neomys fodiens;
    Vogelbekdier=Ornithorhynchus anatinus;
    Watermuis;
    Australische waterrat=Hydromys chrysogaster
  `, [1, 14, 50]);

  groep(`
    Amazonegebiedsdolfijn=Boto=Inia geoffrensis;
    Boliviaanse rivierdolfijn=Inia boliviensis;
    Gangesdolfijn=Platanista gangetica;
    Indusdolfijn=Platanista minor;
    Tucuxi=Sotalia fluviatilis
  `, [1, 14, 17, 18, 37, 50]);

  groep(`
    Irawadidolfijn=Orcaella brevirostris;
    Guyanadolfijn=Sotalia guianensis;
    Zeeotter=Enhydra lutris;
    Mariene otter=Lontra felina
  `, [1, 11, 14, 17, 50]);

  // KWALLEN EN ANDERE NETELDIEREN

  groep(`
    Kwal=Jellyfish;
    Oorkwal=Aurelia aurita;
    Gele haarkwal=Cyanea capillata;
    Blauwe haarkwal=Cyanea lamarckii;
    Kompaskwal=Chrysaora hysoscella;
    Zeepaddenstoel=Rhizostoma octopus;
    Middellandse zeepaddenstoel=Rhizostoma pulmo;
    Lichtende kwal=Pelagia noctiluca;
    Witte stippenkwal=Phyllorhiza punctata;
    Eierdooierkwal=Cotylorhiza tuberculata;
    Onderstebovenkwal=Cassiopea;
    Gouden kwal=Mastigias papua;
    Dooskwal;
    Zeewesp=Chironex fleckeri;
    Irukandjikwal=Carukia barnesi;
    Portugees oorlogsschip=Physalia physalis;
    Zeilkwal=Velella velella;
    Blauwe knoop=Porpita porpita;
    Kanonskogelkwal=Stomolophus meleagris;
    Maankwal;
    Atollakwal=Atolla wyvillei;
    Reuzenspookkwal=Stygiomedusa gigantea;
    Kroonkwal;
    Nomurakwal=Nemopilema nomurai;
    Zeeanemoon;
    Paardenanemoon=Actinia equina;
    Wasroos=Anemonia viridis;
    Zeeanjelier=Metridium senile;
    Dahliaanemoon=Urticina felina;
    Aardbeianemoon=Actinia fragacea;
    Slanke anemoon=Exaiptasia diaphana;
    Tapijtanemoon=Stichodactyla haddoni;
    Reuzentapijtanemoon=Stichodactyla gigantea;
    Blaasjesanemoon=Entacmaea quadricolor;
    Prachtanemoon=Heteractis magnifica;
    Lederanemoon=Heteractis crispa;
    Kokeranemoon=Cerianthus membranaceus
  `, [1, 11, 17, 50]);

  // KORALEN

  groep(`
    Koraal;
    Koraalpoliep;
    Steenkoraal;
    Zacht koraal;
    Zwart koraal;
    Waaierkoraal;
    Hersenkoraal;
    Rood koraal=Corallium rubrum;
    Elandgeweikoraal=Acropora palmata;
    Hertengeweikoraal=Acropora cervicornis;
    Tafelkoraal;
    Bloemkoolkoraal=Pocillopora damicornis;
    Sterkoraal;
    Pilaarkoraal=Dendrogyra cylindrus;
    Bellenkoraal=Plerogyra sinuosa;
    Hammerkoraal=Euphyllia ancora;
    Fakkelkoraal=Euphyllia glabrescens;
    Druivenkoraal;
    Zonnecor aal=Zonnekoraal=Tubastraea;
    Paddenstoelkoraal;
    Lederkoraal;
    Orgelpijpkoraal=Tubipora musica;
    Blauw koraal=Heliopora coerulea;
    Vuurkoraal=Millepora;
    Zeepen;
    Gewone zeepen=Pennatula phosphorea;
    Zeekurk=Alcyonium digitatum;
    Dodemansduim;
    Gorgoon;
    Zweepkoraal;
    Bamboekoraal
  `, [1, 11, 50]);

  // OCTOPUSSEN, INKTVISSEN EN NAUTILUSSEN

  groep(`
    Octopus;
    Gewone octopus=Octopus vulgaris;
    Reuzenoctopus=Enteroctopus dofleini;
    Blauwringoctopus=Hapalochlaena;
    Grote blauwringoctopus=Hapalochlaena lunulata;
    Zuidelijke blauwringoctopus=Hapalochlaena maculosa;
    Mimic octopus=Thaumoctopus mimicus;
    Kokosnootoctopus=Amphioctopus marginatus;
    Wonderoctopus;
    Dekenoctopus=Tremoctopus;
    Dumbo-octopus=Grimpoteuthis;
    Glazen octopus=Vitreledonella richardi;
    Kleine octopus=Eledone cirrhosa;
    Muskusoctopus=Eledone moschata;
    Caribische rifoctopus=Octopus briareus;
    Californische tweevleksoctopus=Octopus bimaculoides;
    Argonaut=Argonauta argo;
    Inktvis;
    Pijlinktvis;
    Gewone pijlinktvis=Loligo vulgaris;
    Noordse pijlinktvis=Loligo forbesii;
    Reuzeninktvis=Architeuthis dux;
    Kolossale inktvis=Mesonychoteuthis hamiltoni;
    Humboldtinktvis=Dosidicus gigas;
    Japanse vliegende inktvis=Todarodes pacificus;
    Caribische rifinktvis=Sepioteuthis sepioidea;
    Grootvinrifinktvis=Sepioteuthis lessoniana;
    Vuurvlieginktvis=Watasenia scintillans;
    Glazen inktvis;
    Vampierinktvis=Vampyroteuthis infernalis;
    Zeekat=Sepia officinalis;
    Reuzenzeekat=Sepia apama;
    Kleine zeekat=Sepia elegans;
    Roze zeekat=Sepia orbignyana;
    Flamboyante zeekat=Metasepia pfefferi;
    Dwergzeekat;
    Sepiola=Sepiola atlantica;
    Hawaïaanse bobtailinktvis=Euprymna scolopes;
    Nautilus=Nautilus pompilius;
    Palau-nautilus=Nautilus belauensis;
    Witgevlekte nautilus=Nautilus macromphalus
  `, [1, 7, 11, 14, 17, 50]);

  // KREEFTEN

  groep(`
    Kreeft;
    Europese zeekreeft=Homarus gammarus;
    Amerikaanse zeekreeft=Homarus americanus;
    Langoustine=Noorse kreeft=Nephrops norvegicus;
    Langoest;
    Europese langoest=Palinurus elephas;
    Caribische langoest=Panulirus argus;
    Californische langoest=Panulirus interruptus;
    Sierlangoest=Panulirus ornatus;
    Geschilderde langoest=Panulirus versicolor;
    Japanse langoest=Panulirus japonicus;
    Modderlangoest=Panulirus polyphagus;
    Kaapse langoest=Jasus lalandii;
    Zuidelijke rotskreeft=Jasus edwardsii;
    Beerkreeft=Scyllarides latus;
    Slipperkreeft;
    Bidsprinkhaankreeft;
    Pauwbidsprinkhaankreeft=Odontodactylus scyllarus;
    Gewone bidsprinkhaankreeft=Squilla mantis;
    Zebrabidsprinkhaankreeft=Lysiosquillina maculata;
    Hurkkreeft;
    Porseleinkrab;
    Heremietkreeft;
    Gewone heremietkreeft=Pagurus bernhardus;
    Kleine heremietkreeft=Pagurus cuanensis;
    Blauwpoot heremietkreeft=Clibanarius tricolor;
    Rode heremietkreeft=Paguristes cadenati;
    Halloweenheremietkreeft=Ciliopagurus strigatus
  `, [1, 7, 11, 50]);

  // KRABBEN

  groep(`
    Krab;
    Noordzeekrab=Gewone zeekrab=Cancer pagurus;
    Strandkrab=Carcinus maenas;
    Mediterrane strandkrab=Carcinus aestuarii;
    Fluwelen zwemkrab=Necora puber;
    Blauwe zwemkrab=Callinectes sapidus;
    Bloemkrab=Portunus pelagicus;
    Drievlekzwemkrab=Portunus sanguinolentus;
    Spinkrab;
    Gewone spinkrab=Maja brachydactyla;
    Mediterrane spinkrab=Maja squinado;
    Japanse reuzenkrab=Macrocheira kaempferi;
    Rode koningskrab=Paralithodes camtschaticus;
    Blauwe koningskrab=Paralithodes platypus;
    Gouden koningskrab=Lithodes aequispinus;
    Sneeuwkrab=Chionoecetes opilio;
    Tannerkrab=Chionoecetes bairdi;
    Dungenesskrab=Metacarcinus magister;
    Rode rotskrab=Cancer productus;
    Florida-steenkrab=Menippe mercenaria;
    Modderkrab=Scylla serrata;
    Harige krab;
    Chinese wolhandkrab=Eriocheir sinensis;
    Maskerkrab=Corystes cassivelaunus;
    Helmkrab;
    Erwtkrab=Pinnotheres pisum;
    Gewone hooiwagenkrab=Macropodia rostrata;
    Gezaagde steurgarnaalkrab;
    Ronde krab=Atelecyclus rotundatus;
    Schaarloze krab;
    Bokserkrab=Lybia tessellata;
    Decorateurkrab;
    Oranjerode Sally Lightfootkrab=Grapsus grapsus;
    Smaragdkrab=Mithraculus sculptus;
    Pijlpuntkrab=Stenorhynchus seticornis;
    Spookkrab;
    Atlantische spookkrab=Ocypode quadrata;
    Wenkrab;
    Zandkrab;
    Molkrab=Emerita
  `, [1, 7, 50]);

  // GARNALEN

  groep(`
    Garnaal;
    Noordzeegarnaal=Crangon crangon;
    Roze garnaal=Pandalus borealis;
    Gewone steurgarnaal=Palaemon serratus;
    Brakwatersteurgarnaal=Palaemon varians;
    Rotsgarnaal;
    Tijgergarnaal=Penaeus monodon;
    Witte pootgarnaal=Litopenaeus vannamei;
    Indische witte garnaal=Fenneropenaeus indicus;
    Japanse garnaal=Marsupenaeus japonicus;
    Diepzeegarnaal;
    Rode diepzeegarnaal=Aristaeomorpha foliacea;
    Blauwe en rode garnaal=Aristeus antennatus;
    Poetsgarnaal;
    Gewone poetsgarnaal=Lysmata amboinensis;
    Bloedgarnaal=Lysmata debelius;
    Pepermuntgarnaal=Lysmata wurdemanni;
    Kameelgarnaal=Rhynchocinetes durbanensis;
    Harlekijngarnaal=Hymenocera picta;
    Keizersgarnaal=Zenopontonia rex;
    Anemoongarnaal;
    Sexy garnaal=Thor amboinensis;
    Pistoolgarnaal;
    Tijgerpistoolgarnaal=Alpheus bellulus;
    Randallpistoolgarnaal=Alpheus randalli;
    Knalg arnaal=Knalgarnaal;
    Krill;
    Antarctisch krill=Euphausia superba;
    Noordelijk krill=Meganyctiphanes norvegica
  `, [1, 7, 11, 50]);

  // ZOETWATERKREEFTEN EN GARNALEN

  groep(`
    Rivierkreeft;
    Europese rivierkreeft=Astacus astacus;
    Turkse rivierkreeft=Pontastacus leptodactylus;
    Signaalkreeft=Pacifastacus leniusculus;
    Rode Amerikaanse rivierkreeft=Procambarus clarkii;
    Gevlekte Amerikaanse rivierkreeft=Faxonius limosus;
    Geknobbelde Amerikaanse rivierkreeft=Faxonius virilis;
    Marmerkreeft=Procambarus virginalis;
    Blauwe Floridakreeft=Procambarus alleni;
    Mexicaanse dwergkreeft=Cambarellus patzcuarensis;
    Australische roodklauwkreeft=Cherax quadricarinatus;
    Yabby=Cherax destructor;
    Marron=Cherax cainii;
    Tasmaanse reuzenrivierkreeft=Astacopsis gouldi;
    Vuurgarnaal=Neocaridina davidi;
    Amanogarnaal=Caridina multidentata;
    Bijengarnaal=Caridina cantonensis;
    Kristalrode garnaal;
    Blauwe tijgergarnaal;
    Kardinaalgarnaal=Caridina dennerli;
    Waaierhandgarnaal=Atyopsis moluccensis;
    Vampiergarnaal=Atya gabonensis;
    Reuzenzoetwatergarnaal=Macrobrachium rosenbergii;
    Glasgarnaal;
    Zoetwatervlokreeft=Gammarus pulex;
    Waterpissebed=Asellus aquaticus;
    Watervlo=Daphnia;
    Grote watervlo=Daphnia magna;
    Kleine watervlo=Daphnia pulex;
    Een oogkreeftje=Eenoogkreeftje;
    Mosselkreeftje;
    Kieuwpootkreeftje;
    Triops=Triops cancriformis
  `, [1, 7, 50]);

  // TWEEKLEPPIGE WEEKDIEREN

  groep(`
    Mossel;
    Blauwe mossel=Mytilus edulis;
    Mediterrane mossel=Mytilus galloprovincialis;
    Pacifische blauwe mossel=Mytilus trossulus;
    Nieuw-Zeelandse groenlipmossel=Perna canaliculus;
    Aziatische groenmossel=Perna viridis;
    Bruine mossel=Perna perna;
    Paardenmossel=Modiolus modiolus;
    Oester;
    Platte oester=Ostrea edulis;
    Japanse oester=Magallana gigas;
    Amerikaanse oester=Crassostrea virginica;
    Portugese oester=Magallana angulata;
    Olympia-oester=Ostrea lurida;
    Parelmoeroester;
    Zwartlippareloester=Pinctada margaritifera;
    Goudlippareloester=Pinctada maxima;
    Akoyapareloester=Pinctada fucata;
    Kokkel=Cerastoderma edule;
    Brakwaterkokkel=Cerastoderma glaucum;
    Hartschelp;
    Noordkromp=Arctica islandica;
    Venusschelp;
    Tapijtschelp;
    Filipijnse tapijtschelp=Ruditapes philippinarum;
    Gewone tapijtschelp=Ruditapes decussatus;
    Strandgaper=Mya arenaria;
    Afgeknotte gaper=Mya truncata;
    Nonnetje=Limecola balthica;
    Zaagje=Donax vittatus;
    Halfgeknotte strandschelp=Spisula subtruncata;
    Stevige strandschelp=Spisula solida;
    Ovale strandschelp=Spisula elliptica;
    Amerikaanse zwaardschede=Ensis leei;
    Grote zwaardschede=Ensis magnus;
    Kleine zwaardschede=Ensis ensis;
    Mesheft;
    Tafelmesheft=Ensis siliqua;
    Sint-jakobsschelp=Pecten maximus;
    Mediterrane sint-jakobsschelp=Pecten jacobaeus;
    Bonte mantel=Mimachlamys varia;
    Wijde mantel=Aequipecten opercularis;
    IJslandse mantel=Chlamys islandica;
    Reuzenmantel=Placopecten magellanicus;
    Mantelschelp;
    Doopvontschelp;
    Reuzendoopvontschelp=Tridacna gigas;
    Schubbendoopvontschelp=Tridacna squamosa;
    Kleine doopvontschelp=Tridacna maxima;
    Croceadoopvontschelp=Tridacna crocea;
    Berenpootschelp=Hippopus hippopus;
    Grote steekmossel=Pinna nobilis;
    Steekmossel;
    Paalworm=Teredo navalis;
    Scheepsworm;
    Geoduck=Panopea generosa
  `, [1, 11, 50]);

  // ZEESLAKKEN

  groep(`
    Zeeslak;
    Wulk=Buccinum undatum;
    Alikruik=Littorina littorea;
    Ruwe alikruik=Littorina saxatilis;
    Stompe alikruik=Littorina obtusata;
    Schaalhoren=Patella vulgata;
    Blauwe schaalhoren=Patella pellucida;
    Kegelslak;
    Geografische kegelslak=Conus geographus;
    Textielkegelslak=Conus textile;
    Marmerkegelslak=Conus marmoreus;
    Tulp kegelslak=Conus tulipa;
    Kaurislak;
    Tijgerkauri=Cypraea tigris;
    Geldkauri=Monetaria moneta;
    Ringkauri=Monetaria annulus;
    Arabische kauri=Mauritia arabica;
    Zeeoor;
    Rood zeeoor=Haliotis rufescens;
    Groen zeeoor=Haliotis fulgens;
    Zwart zeeoor=Haliotis cracherodii;
    Europees zeeoor=Haliotis tuberculata;
    Paua=Haliotis iris;
    Trompetslak;
    Tritonshoren=Charonia tritonis;
    Koninginnenslak=Aliger gigas;
    Pelikaansvoet=Aporrhais pespelecani;
    Purperslak=Nucella lapillus;
    Gevlochten fuikhoren=Tritia reticulata;
    Gevlekte fuikhoren=Tritia incrassata;
    Muiltje=Crepidula fornicata;
    Wenteltrap=Epitonium clathrus;
    Navelhoren;
    Tepelhoren=Euspira catena;
    Glanzende tepelhoren=Euspira nitida;
    Vliezige drijfhoren=Janthina janthina;
    Olijfslak;
    Murexslak;
    Venus-kamslak=Murex pecten;
    Appelhoren;
    Turboslak;
    Troschelp;
    Tolschelp;
    Zeetand
  `, [1, 11, 50]);

  // ZEENAAKTSLAKKEN EN ZEEHAZEN

  groep(`
    Zeenaaktslak;
    Zeehaas;
    Gewone zeehaas=Aplysia punctata;
    Californische zeehaas=Aplysia californica;
    Zwarte zeehaas=Aplysia vaccaria;
    Blauwe draak=Glaucus atlanticus;
    Kleine blauwe draak=Glaucus marginatus;
    Spaanse danseres=Hexabranchus sanguineus;
    Zeeschaapje=Costasiella kuroshimae;
    Zeekonijntje=Jorunna parva;
    Zeeschaap;
    Elysia chlorotica;
    Elysia crispata;
    Elysia viridis;
    Chromodoris lochi;
    Chromodoris annae;
    Chromodoris magnifica;
    Chromodoris willani;
    Goniobranchus splendidus;
    Goniobranchus coi;
    Goniobranchus leopardus;
    Goniobranchus geometricus;
    Hypselodoris bullockii;
    Hypselodoris apolegma;
    Hypselodoris tryoni;
    Hypselodoris infucata;
    Nembrotha kubaryana;
    Nembrotha cristata;
    Nembrotha chamberlaini;
    Phyllidia varicosa;
    Phyllidia ocellata;
    Phyllidiella pustulosa;
    Flabellina;
    Paarse waaierslak=Flabellina affinis;
    Grote vlokslak=Aeolidia papillosa;
    Kleine vlokslak;
    Boompjesslak=Dendronotus frondosus;
    Gekroonde ringsprietslak=Facelina auriculata;
    Harlekijnslak=Polycera quadrilineata;
    Citroenslak=Doris pseudoargus;
    Wrattige mosdierslak=Onchidoris bilamellata;
    Groene wierslak=Elysia viridis
  `, [1, 11, 50]);

  // STEKELHUIDIGEN

  groep(`
    Zeester;
    Gewone zeester=Asterias rubens;
    Noord-Pacifische zeester=Asterias amurensis;
    Blauwe zeester=Linckia laevigata;
    Rode zeester=Echinaster sepositus;
    Kamster=Astropecten irregularis;
    Gewone kamster;
    Kussenster;
    Gewone kussenster=Asterina gibbosa;
    Chocoladeschilferzeester=Protoreaster nodosus;
    Doornenkroon=Acanthaster;
    Zonnebloemzeester=Pycnopodia helianthoides;
    Zonnester=Crossaster papposus;
    Zevengestr aal de zeester=Luidia ciliaris;
    Slangster;
    Gewone slangster=Ophiura ophiura;
    Kleine slangster=Ophiura albida;
    Brokkelster=Ophiothrix fragilis;
    Zwarte slangster=Ophiocomina nigra;
    Mandster=Gorgonocephalus;
    Zee-egel;
    Gewone zee-egel=Echinus esculentus;
    Paarse zee-egel=Paracentrotus lividus;
    Californische paarse zee-egel=Strongylocentrotus purpuratus;
    Groene zee-egel=Strongylocentrotus droebachiensis;
    Rode zee-egel=Mesocentrotus franciscanus;
    Zwarte zee-egel=Arbacia lixula;
    Diadeemzee-egel=Diadema setosum;
    Langstekelige zee-egel=Diadema antillarum;
    Potloodzee-egel=Heterocentrotus mammillatus;
    Vuurzee-egel=Asthenosoma varium;
    Bloemzee-egel=Toxopneustes pileolus;
    Hartzee-egel;
    Zeeklit=Echinocardium cordatum;
    Zanddollar;
    Platte zee-egel;
    Zeekomkommer;
    Gewone zeekomkommer=Holothuria forskali;
    Zwarte zeekomkommer=Holothuria atra;
    Bruine zeekomkommer=Isostichopus badionotus;
    Japanse zeekomkommer=Apostichopus japonicus;
    Californische zeekomkommer=Apostichopus californicus;
    Ananaszeekomkommer=Thelenota ananas;
    Reuzenzeekomkommer=Thelenota anax;
    Zeekomkommerappel=Pseudocolochirus violaceus;
    Zeelie lie=Zeelelie;
    Vederster;
    Mediterrane vederster=Antedon mediterranea;
    Gewone vederster=Antedon bifida
  `, [1, 11, 50]);

  // SPONZEN EN ZAKPIJPEN

  groep(`
    Spons;
    Zeespons;
    Badspons=Spongia officinalis;
    Olifantsoorspons;
    Gele buisspons=Aplysina fistularis;
    Paarse buisspons;
    Reuzenvatspons=Xestospongia muta;
    Geweizwamp;
    Broodspons=Halichondria panicea;
    Geweispons=Haliclona oculata;
    Boorspons=Cliona celata;
    Vijgspons=Suberites ficus;
    Zakspons;
    Glasspons;
    Venusbloemenmandje=Euplectella aspergillum;
    Glazen spons;
    Kalkspons;
    Zakpijp;
    Zeeschede;
    Doorschijnende zakpijp=Ciona intestinalis;
    Ruwe zakpijp=Ascidiella aspersa;
    Japanse zakpijp=Styela clava;
    Gesterde geleikorst=Botryllus schlosseri;
    Druipzakpijp=Didemnum vexillum;
    Gouden zakpijp=Polycarpa aurata;
    Zeevijg=Microcosmus sabatieri;
    Rode zakpijp=Halocynthia papillosa;
    Salp;
    Pyrosoom;
    Appendicularia
  `, [1, 11, 50]);

  // ZEEWORMEN EN OVERIGE ONGEWERVELDEN

  groep(`
    Borstelworm;
    Zandworm=Zeepier=Arenicola marina;
    Zwarte zeepier=Arenicola defodiens;
    Zeeduizendpoot=Hediste diversicolor;
    Zager=Alitta virens;
    Zeemuis=Aphrodita aculeata;
    Vuurworm=Hermodice carunculata;
    Pauwstaartworm=Sabella pavonina;
    Kerstboomworm=Spirobranchus giganteus;
    Kokerworm;
    Schelpkokerworm=Lanice conchilega;
    Goudkammetje=Pectinaria koreni;
    Pauwenstaartkokerworm;
    Reuzenkokerworm=Riftia pachyptila;
    Bobbitworm=Eunice aphroditois;
    Platte zeeworm;
    Lintworm uit zee;
    Snoerworm;
    Langste snoerworm=Lineus longissimus;
    Pindaworm;
    Lepelworm;
    Eikelworm;
    Pijlworm;
    Ribkwal;
    Zeedruif=Pleurobrachia pileus;
    Amerikaanse ribkwal=Mnemiopsis leidyi;
    Zeenoot=Beroe;
    Venusgordel=Cestum veneris;
    Doliolide;
    Zeevonk;
    Zeepok;
    Gewone zeepok=Semibalanus balanoides;
    Nieuw-Zeelandse zeepok=Austrominius modestus;
    Eendenmossel=Lepas anatifera;
    Gewone eendenmossel;
    Hoefijzerkrab=Limulus polyphemus;
    Degenkrab;
    Japanse hoefijzerkrab=Tachypleus tridentatus;
    Mangrovehoefijzerkrab=Carcinoscorpius rotundicauda;
    Reuzenpissebed=Bathynomus giganteus;
    Zeepissebed=Idotea balthica;
    Zeespin;
    Zeecicade;
    Mosdiertje;
    Zeevinger=Alcyonidium diaphanum;
    Zeekant=Flustra foliacea
  `, [1, 11, 50]);

  // ZOETWATERWEEKDIEREN

  groep(`
    Poelslak;
    Grote poelslak=Lymnaea stagnalis;
    Ovale poelslak=Radix balthica;
    Oorvormige poelslak=Radix auricularia;
    Moeraspoelslak=Stagnicola palustris;
    Posthoornslak=Planorbarius corneus;
    Gewone schijfhoren=Planorbis planorbis;
    Draaikolk-schijfhoren=Anisus vortex;
    Bronblaashoren=Physa fontinalis;
    Puntige blaashoren=Physella acuta;
    Appelslak;
    Gouden appelslak=Pomacea diffusa;
    Reuzenappelslak=Pomacea maculata;
    Slakkenetende slak=Anentome helena;
    Torenslak=Melanoides tuberculata;
    Konijnenslak=Tylomelania;
    Nerietslak;
    Zebranerietslak;
    Geweislak=Clithon;
    Vijvermossel=Anodonta anatina;
    Zwanenmossel=Anodonta cygnea;
    Schildersmossel=Unio pictorum;
    Bolle stroommossel=Unio tumidus;
    Bataafse stroommossel=Unio crassus;
    Zoetwaterparelmossel=Margaritifera margaritifera;
    Driehoeksmossel=Dreissena polymorpha;
    Quaggamossel=Dreissena rostriformis bugensis;
    Aziatische korfmossel=Corbicula fluminea;
    Erwtenmossel=Pisidium;
    Hoornschalen
  `, [1, 50]);

  // WATERINSECTEN

  groep(`
    Schaatsenrijder;
    Gewone schaatsenrijder=Gerris lacustris;
    Vijverloper;
    Beekschrijvertje;
    Schrijvertje=Gyrinus natator;
    Geelgerande waterroofkever=Dytiscus marginalis;
    Brede geelgerande waterroofkever=Dytiscus latissimus;
    Grote spinnende watertor=Hydrophilus piceus;
    Kleine spinnende watertor=Hydrochara caraboides;
    Duikerwants;
    Bootsman=Notonecta glauca;
    Ruggenzwemmer;
    Waterschorpioen=Nepa cinerea;
    Staafwants=Ranatra linearis;
    Reuzenwaterwants=Lethocerus;
    Watertreder;
    Waterkever;
    Waterroofkever;
    Waterjufferlarve;
    Libellenlarve;
    Muggenlarve;
    Dansmuglarve;
    Steekmuglarve;
    Eendagsvlieglarve;
    Steenvlieglarve;
    Kokerjuffer;
    Schietmotlarve;
    Watervlinderlarve;
    Watermijt;
    Waterspin=Argyroneta aquatica
  `, [1, 50]);

  // AMFIBIEËN MET EEN STERKE BINDING AAN WATER

  groep(`
    Groene kikker;
    Bruine kikker=Rana temporaria;
    Meerkikker=Pelophylax ridibundus;
    Poelkikker=Pelophylax lessonae;
    Bastaardkikker=Pelophylax kl. esculentus;
    Amerikaanse brulkikker=Lithobates catesbeianus;
    Groene Amerikaanse kikker=Lithobates clamitans;
    Luipaardkikker;
    Noordelijke luipaardkikker=Lithobates pipiens;
    Afrikaanse klauwkikker=Xenopus laevis;
    Dwergklauwkikker=Hymenochirus;
    Surinaamse pad=Pipa pipa;
    Titicacakikker=Telmatobius culeus;
    Harige kikker=Trichobatrachus robustus;
    Vuurbuikpad=Bombina bombina;
    Geelbuikvuurpad=Bombina variegata;
    Oosterse vuurbuikpad=Bombina orientalis;
    Watersalamander;
    Kleine watersalamander=Lissotriton vulgaris;
    Vinpootsalamander=Lissotriton helveticus;
    Alpenwatersalamander=Ichthyosaura alpestris;
    Kamsalamander=Triturus cristatus;
    Italiaanse kamsalamander=Triturus carnifex;
    Marmersalamander=Triturus marmoratus;
    Spaanse ribbensalamander=Pleurodeles waltl;
    Chinese vuurbuiksalamander=Hypselotriton orientalis;
    Japanse vuurbuiksalamander=Cynops pyrrhogaster;
    Axolotl=Ambystoma mexicanum;
    Olm=Proteus anguinus;
    Chinese reuzensalamander=Andrias davidianus;
    Japanse reuzensalamander=Andrias japonicus;
    Amerikaanse reuzensalamander=Cryptobranchus alleganiensis;
    Modderduivel;
    Waterhond=Necturus maculosus;
    Grote sirene=Siren lacertina;
    Kleine sirene=Siren intermedia;
    Aalsalamander=Amphiuma
  `, [1, 4, 7, 14, 18, 50]);

  // ZOETWATERREPTIELEN

  groep(`
    Krokodil;
    Nijlkrokodil=Crocodylus niloticus;
    West-Afrikaanse krokodil=Crocodylus suchus;
    Dwergkrokodil=Osteolaemus tetraspis;
    Australische zoetwaterkrokodil=Crocodylus johnstoni;
    Siamese krokodil=Crocodylus siamensis;
    Filipijnse krokodil=Crocodylus mindorensis;
    Moeraskrokodil=Crocodylus palustris;
    Orinocokrokodil=Crocodylus intermedius;
    Cubaanse krokodil=Crocodylus rhombifer;
    Moreletkrokodil=Crocodylus moreletii;
    Alligator;
    Mississippialligator=Alligator mississippiensis;
    Chinese alligator=Alligator sinensis;
    Kaaiman;
    Brilkaaiman=Caiman crocodilus;
    Breedsnuitkaaiman=Caiman latirostris;
    Yacarekaaiman=Caiman yacare;
    Zwarte kaaiman=Melanosuchus niger;
    Dwergkaaiman=Paleosuchus palpebrosus;
    Gladde kaaiman=Paleosuchus trigonatus;
    Gaviaal=Gavialis gangeticus;
    Onechte gaviaal=Tomistoma schlegelii
  `, [1, 4, 7, 14, 17, 18, 21, 50]);

  groep(`
    Waterschildpad;
    Roodwangschildpad;
    Geelwangschildpad;
    Geelbuikschildpad;
    Lettersierschildpad=Trachemys scripta;
    Europese moerasschildpad=Emys orbicularis;
    Geschilderde schildpad=Chrysemys picta;
    Diamantrugschildpad=Malaclemys terrapin;
    Landkaartschildpad=Graptemys;
    Mississippi-landkaartschildpad=Graptemys pseudogeographica;
    Bijtschildpad=Chelydra serpentina;
    Alligatorschildpad=Macrochelys temminckii;
    Matamata=Chelus fimbriata;
    Orinoco-matamata=Chelus orinocensis;
    Weekschildpad;
    Chinese weekschildpad=Pelodiscus sinensis;
    Florid a-weekschildpad=Apalone ferox;
    Stekelweekschildpad=Apalone spinifera;
    Indische klepschildpad=Lissemys punctata;
    Afrikaanse drieklauw=Trionyx triunguis;
    Varkensneusschildpad=Carettochelys insculpta;
    Gewone muskusschildpad=Sternotherus odoratus;
    Kielmuskusschildpad=Sternotherus carinatus;
    Modderschildpad=Kinosternon;
    Australische slangenhalsschildpad=Chelodina longicollis;
    Nieuw-Guinese slangenhalsschildpad=Chelodina novaeguineae;
    Roodbuikspitskopschildpad=Emydura subglobosa;
    Geelgevlekte rivierschildpad=Podocnemis unifilis;
    Arrauschildpad=Podocnemis expansa;
    Reuzenmoerasschildpad=Orlitia borneensis;
    Maleise doosschildpad=Cuora amboinensis;
    Chinese driekielschildpad=Mauremys reevesii;
    Chinese gestreepte schildpad=Mauremys sinensis
  `, [1, 4, 7, 14, 18, 33, 50]);

  // ============================================================
  // EINDE VAN DIT GEDEELTE
  // De database blijft open voor aanvullende dieren,
  // eigenschapskoppelingen, correcties en de eindcontrole.
  // ============================================================
   // ============================================================
  // DEEL 2
  // AANVULLING WATERDIEREN
  // ============================================================

  // AANVULLENDE HAAIEN

  groep(`
    Australische zwartpunthaai=Carcharhinus tilstoni;
    Koperhaai=Carcharhinus brachyurus;
    Zwartneushaai=Carcharhinus acronotus;
    Fijn tandhaai=Carcharhinus isodon;
    Spinnerhaai=Carcharhinus brevipinna;
    Zwartstaarthaai=Carcharhinus sorrah;
    Witwanghaai=Carcharhinus dussumieri;
    Borneohaai=Carcharhinus borneensis;
    Gangeshaai=Glyphis gangeticus;
    Speertandhaai=Glyphis glyphis;
    Noordelijke rivierhaai=Glyphis garricki;
    Sikkelvincitroenhaai=Negaprion acutidens;
    Melkhaai=Rhizoprionodon acutus;
    Atlantische scherpsnuithaai=Rhizoprionodon terraenovae;
    Braziliaanse scherpsnuithaai=Rhizoprionodon lalandii;
    Australische scherpsnuithaai=Rhizoprionodon taylori;
    Grijze gladde haai=Mustelus mustelus;
    Gevlekte gladde haai=Mustelus asterias;
    Californische gladde haai=Mustelus californicus;
    Japanse gladde haai=Mustelus manazo;
    Zwartvingladdehaai=Mustelus lunulatus;
    Toonhaai=Galeorhinus galeus;
    Krokodilhaai=Pseudocarcharias kamoharai;
    Zwartbuiklantaarnhaai=Etmopterus spinax;
    Grote lantaarnhaai=Etmopterus princeps;
    Fluwelen lantaarnhaai=Etmopterus molleri;
    Dwerglantaarnhaai=Etmopterus perryi;
    Braziliaanse lantaarnhaai=Etmopterus bigelowi;
    Stekelhaai=Echinorhinus brucus;
    Pacifische stekelhaai=Echinorhinus cookei;
    Valse kathaai=Pseudotriakis microdon;
    Dwergkathaai;
    Grote kathaai=Scyliorhinus stellaris;
    Kettingkathaai=Scyliorhinus retifer;
    Kleingevlekte kathaai;
    Australische tapijthaai;
    Japanse stierkophaai=Heterodontus japonicus;
    Zebrakophoornhaai=Heterodontus zebra;
    Galapagosstierkophaai=Heterodontus quoyi;
    Afrikaanse zaaghaai=Pristiophorus nancyae;
    Japanse zaaghaai=Pristiophorus japonicus;
    Zeskieuwzaaghaai=Pliotrema warreni;
    Bahamazaaghaai=Pristiophorus schroederi;
    Afrikaanse engelhaai=Squatina africana;
    Californische engelhaai=Squatina californica;
    Argentijnse engelhaai=Squatina argentina;
    Australische engelhaai=Squatina australis;
    Gevlekte engelhaai=Squatina tergocellata;
    Geelbruine verpleegsterhaai=Nebrius ferrugineus
  `, [1, 11, 14, 17, 18, 50]);

  // AANVULLENDE ROGGEN

  groep(`
    Bruine rog=Raja miraletus;
    Zwartbuikrog=Raja melanura;
    Noorse rog=Dipturus nidarosiensis;
    Langsnuitrog=Dipturus oxyrinchus;
    Zandrog=Leucoraja circularis;
    Koekoeksrog=Leucoraja naevus;
    Shagreenrog=Leucoraja fullonica;
    Arctische rog=Amblyraja hyperborea;
    Antarctische rog=Amblyraja georgiana;
    Californische rog=Beringraja inornata;
    Grote rog=Beringraja binoculata;
    Langsnuitvleet=Beringraja rhina;
    Winterrog=Leucoraja ocellata;
    Kleine rog=Leucoraja erinacea;
    Stekelstaartrog=Bathytoshia centroura;
    Gewone pijlstaartrog=Dasyatis pastinaca;
    Pelagische pijlstaartrog=Pteroplatytrygon violacea;
    Zuidelijke pijlstaartrog=Hypanus americanus;
    Atlantische pijlstaartrog=Hypanus sabinus;
    Ruwe pijlstaartrog=Urogymnus asperrimus;
    Koeienstaartrog=Pastinachus sephen;
    Zwarte pijlstaartrog=Taeniurops meyeni;
    Zandpijlstaartrog;
    Blauwvlekrog;
    Gevlekte gitaarrog=Rhinobatos punctifer;
    Reuzengitaarrog=Glaucostegus typus;
    Strikrog=Rhina ancylostoma;
    Witte wigrog=Rhynchobatus djiddensis;
    Gevlekte wigrog=Rhynchobatus australiae;
    Klein tandgitaarrog;
    Kleine duivelsrog=Mobula hypostoma;
    Reuzenduivelsrog=Mobula mobular;
    Chileense duivelsrog=Mobula tarapacana;
    Atlantische duivelsrog;
    Kortvinduivelsrog=Mobula kuhlii;
    Dwergduivelsrog=Mobula eregoodoo;
    Braziliaanse elektrische rog=Narcine brasiliensis;
    Kleine elektrische rog=Narcine bancroftii;
    Pacifische elektrische rog=Tetronarce californica
  `, [1, 11, 14, 17, 18, 50]);

  // ZOETWATERROGGEN

  groep(`
    Zoetwaterpijlstaartrog;
    Pauwoogrog=Potamotrygon motoro;
    Zwartgevlekte zoetwaterrog=Potamotrygon leopoldi;
    Zwart-witte zoetwaterrog=Potamotrygon henlei;
    Porseleinrog=Potamotrygon scobina;
    Amazonepijlstaartrog=Potamotrygon orbignyi;
    Tijgerzoetwaterrog=Potamotrygon tigrina;
    Reuzenzoetwaterpijlstaartrog=Urogymnus polylepis;
    Antennerog=Plesiotrygon iwamae
  `, [1, 14, 17, 18, 37, 50]);

  // ZEEBAARZEN EN TAND BAARZEN

  groep(`
    Zeebaars=Dicentrarchus labrax;
    Gevlekte zeebaars=Dicentrarchus punctatus;
    Japanse zeebaars=Lateolabrax japonicus;
    Zwarte zeebaars=Centropristis striata;
    Chileense zeebaars=Dissostichus eleginoides;
    Antarctische tandvis=Dissostichus mawsoni;
    Tandbaars;
    Bruine tandbaars=Epinephelus marginatus;
    Reuzentandbaars=Epinephelus lanceolatus;
    Atlantische reuzentandbaars=Epinephelus itajara;
    Rode tandbaars=Epinephelus morio;
    Zwartpunttandbaars=Epinephelus fasciatus;
    Oranjegevlekte tandbaars=Epinephelus coioides;
    Zesbandtandbaars=Epinephelus sexfasciatus;
    Camouflagetandbaars=Epinephelus polyphekadion;
    Aardappeltandbaars=Epinephelus tukula;
    Honingraattandbaars=Epinephelus merra;
    Malabartandbaars=Epinephelus malabaricus;
    Nassau-tandbaars=Epinephelus striatus;
    Rode koraalbaars=Cephalopholis miniata;
    Blauwvlekkoraalbaars=Cephalopholis argus;
    Zwartpuntkoraalbaars=Cephalopholis urodeta;
    Zadelkoraalbaars=Plectropomus laevis;
    Luipaardkoraalbaars=Plectropomus leopardus;
    Gevlekte koraalbaars=Plectropomus maculatus;
    Rode vlaggenbaars;
    Juweelbaars=Pseudanthias squamipinnis;
    Paarse vlaggenbaars=Pseudanthias tuka;
    Roze vlaggenbaars=Pseudanthias dispar;
    Koningsgramma=Gramma loreto;
    Zwartkapgramma=Gramma melacara
  `, [1, 7, 11, 14, 17, 18, 50]);

  // ZEEBRASEMS

  groep(`
    Zeebrasem;
    Goudbrasem=Dorade=Sparus aurata;
    Rode zeebrasem=Pagellus bogaraveo;
    Gewone zeebrasem=Pagellus erythrinus;
    Axillaire zeebrasem=Pagellus acarne;
    Tandbrasem=Dentex dentex;
    Roze tandbrasem=Dentex gibbosus;
    Zwartkopzeebrasem=Diplodus vulgaris;
    Witte zeebrasem=Diplodus sargus;
    Zadelzeebrasem=Oblada melanura;
    Zwartstaartzeebrasem;
    Gestreepte zeebrasem=Lithognathus mormyrus;
    Salema=Sarpa salpa;
    Rode pagrus=Pagrus pagrus;
    Japanse rode zeebrasem=Pagrus major;
    Zwarte zeebrasem=Spondyliosoma cantharus;
    Kaapse steenbras=Lithognathus lithognathus;
    Zilverzeebrasem;
    Australische zwarte zeebrasem=Acanthopagrus butcheri;
    Geelvinzeebrasem=Acanthopagrus australis
  `, [1, 7, 11, 14, 18, 50]);

  // SNAPPERS

  groep(`
    Snapper;
    Rode snapper=Lutjanus campechanus;
    Geelstaartsnapper=Ocyurus chrysurus;
    Grijze snapper=Lutjanus griseus;
    Hondssnapper=Lutjanus jocu;
    Cuberasnapper=Lutjanus cyanopterus;
    Schoolmastersnapper=Lutjanus apodus;
    Muttonsnapper=Lutjanus analis;
    Mahoniesnapper=Lutjanus mahogoni;
    Keizersnapper=Lutjanus sebae;
    Blauwlijnsnapper=Lutjanus kasmira;
    Vijflijnsnapper=Lutjanus quinquelineatus;
    Zwartvleksnapper=Lutjanus fulviflamma;
    Tweevleksnapper=Lutjanus bohar;
    Mangrovesnapper=Lutjanus argentimaculatus;
    Roze snapper=Pristipomoides filamentosus;
    Diepzeesnapper=Etelis coruscans;
    Robijnsnapper=Etelis carbunculus
  `, [1, 7, 11, 14, 17, 18, 50]);

  // JUFFERVISSEN

  groep(`
    Juffervis;
    Blauwe juffervis=Chrysiptera cyanea;
    Geelstaartjuffervis=Chrysiptera parasema;
    Geelbuikjuffervis=Chrysiptera hemicyanea;
    Fiji-juffervis=Chrysiptera talboti;
    Azuurjuffervis;
    Blauwe rifjuffervis=Chromis cyanea;
    Groene rifjuffervis=Chromis viridis;
    Zwartokseljuffervis=Chromis atripectoralis;
    Mediterrane monniksvis=Chromis chromis;
    Sergeant-majoor=Abudefduf saxatilis;
    Indo-Pacifische sergeant-majoor=Abudefduf vaigiensis;
    Sergeant-majoor uit de Stille Oceaan=Abudefduf troschelii;
    Driebandjuffervis=Dascyllus aruanus;
    Drievlekjuffervis=Dascyllus trimaculatus;
    Vierbandjuffervis=Dascyllus melanurus;
    Zwartstaartjuffervis=Dascyllus reticulatus;
    Garibaldivis=Hypsypops rubicundus;
    Australische garibaldi;
    Ambonjuffervis=Pomacentrus amboinensis;
    Citroenjuffervis=Pomacentrus moluccensis;
    Zwartneonjuffervis=Neoglyphidodon oxyodon
  `, [1, 7, 11, 14, 18, 50]);

  // BARBEELVISSEN UIT ZEE

  groep(`
    Zeebarbeel;
    Rode mul=Mullus barbatus;
    Gestreepte mul=Mullus surmuletus;
    Gele zeebarbeel=Parupeneus cyclostomus;
    Dubbelvlekzeebarbeel=Parupeneus bifasciatus;
    Drievlekzeebarbeel=Parupeneus trifasciatus;
    Zwarte zeebarbeel=Parupeneus barberinus;
    Geelstreepzeebarbeel=Mulloidichthys flavolineatus;
    Geelvinzeebarbeel=Mulloidichthys vanicolensis;
    Gevlekte zeebarbeel=Pseudupeneus maculatus
  `, [1, 7, 11, 14, 18, 50]);

  // HARDERS EN KONIJNVISSEN

  groep(`
    Harder;
    Diklipharder=Chelon labrosus;
    Dunlipharder=Chelon ramada;
    Goudharder=Chelon auratus;
    Grootkopharder=Mugil cephalus;
    Witte harder=Mugil curema;
    Konijnvis;
    Vossenkopkonijnvis=Siganus vulpinus;
    Gevlekte vossenkop=Siganus unimaculatus;
    Goudgevlekte konijnvis=Siganus guttatus;
    Gestreepte konijnvis=Siganus lineatus;
    Gemarmerde konijnvis=Siganus rivulatus;
    Donkere konijnvis=Siganus luridus;
    Zilverkonijnvis=Siganus argenteus;
    Blauwlijnkonijnvis=Siganus doliatus;
    Gevlekte konijnvis=Siganus punctatus
  `, [1, 7, 11, 14, 18, 50]);

  // GEWEERVISSEN EN ANDERE BIJZONDERE VISSEN

  groep(`
    Schuttersvis;
    Gebande schuttersvis=Toxotes jaculatrix;
    Gevlekte schuttersvis=Toxotes chatareus;
    Birmese schuttersvis=Toxotes blythii;
    Slijkspringer;
    Atlantische slijkspringer=Periophthalmus barbarus;
    Indische slijkspringer=Periophthalmus novemradiatus;
    Grote slijkspringer=Periophthalmodon schlosseri;
    Blauwgevlekte slijkspringer=Boleophthalmus boddarti;
    Melkvis=Chanos chanos;
    Barramundi=Lates calcarifer;
    Tarpon;
    Atlantische tarpon=Megalops atlanticus;
    Indo-Pacifische tarpon=Megalops cyprinoides;
    Beenv is=Albula vulpes;
    Soldatenvis;
    Rood soldatenvisje=Myripristis murdjan;
    Zwartband soldatenvis=Myripristis jacobus;
    Eekhoornvis;
    Rode eekhoornvis=Holocentrus adscensionis;
    Langsnuit-eekhoornvis=Holocentrus rufus;
    Kroon eekhoornvis=Sargocentron diadema;
    Grootogige eekhoornvis=Sargocentron spiniferum
  `, [1, 7, 14, 18, 50]);

  // PRIKKEN EN SLIJMPALINGEN

  groep(`
    Prik;
    Zeeprik=Petromyzon marinus;
    Rivierprik=Lampetra fluviatilis;
    Beekprik=Lampetra planeri;
    Pacifische prik=Entosphenus tridentatus;
    Arctische prik=Lethenteron camtschaticum;
    Amerikaanse beekprik=Lethenteron appendix;
    Zuidelijke beekprik;
    Australische prik=Geotria australis;
    Slijmprik;
    Slijmpaling=Myxine glutinosa;
    Pacifische slijmpaling=Eptatretus stoutii;
    Zwarte slijmpaling=Eptatretus deani;
    Japanse slijmpaling=Eptatretus burgeri
  `, [1, 14, 50]);

  // ZOETWATERKOGELVISSEN

  groep(`
    Zoetwaterkogelvis;
    Dwergkogelvis=Carinotetraodon travancoricus;
    Roodoogkogelvis=Carinotetraodon lorteti;
    Roodstaartkogelvis=Carinotetraodon irrubesco;
    Fahakakogelvis=Tetraodon lineatus;
    Mbukogelvis=Tetraodon mbu;
    Congokogelvis=Tetraodon miurus;
    Schoutedens kogelvis=Tetraodon schoutedeni;
    Zuid-Amerikaanse kogelvis=Colomesus asellus;
    Harenkogelvis=Pao baileyi;
    Pijlpuntkogelvis=Pao suvattii;
    Mekongkogelvis=Pao cochinchinensis;
    Gevlekte groene kogelvis=Dichotomyctere nigroviridis;
    Achtvormige kogelvis=Dichotomyctere ocellatus
  `, [1, 7, 14, 50]);

  // AANVULLENDE TROPISCHE AQUARIUMVISSEN

  groep(`
    Killi vis=Killivis;
    Kaap Lopez-killivis=Aphyosemion australe;
    Blauwe gularis=Fundulopanchax sjoestedti;
    Gardners killivis=Fundulopanchax gardneri;
    Rachovs killivis=Nothobranchius rachovii;
    Günthers killivis=Nothobranchius guentheri;
    Turquoise killivis=Nothobranchius furzeri;
    Vuurstaarttandkarper;
    Gestreepte panchax=Aplocheilus lineatus;
    Blauwe panchax=Aplocheilus panchax;
    Clownkillivis=Epiplatys annulatus;
    Normans lichtoogje=Poropanchax normani;
    Japanse rijstvis=Oryzias latipes;
    Indonesische rijstvis=Oryzias woworae;
    Celebesrijstvis=Oryzias celebensis;
    Indische glasbaars=Parambassis ranga;
    Birmese glasbaars=Parambassis pulcinella;
    Afrikaanse bladvis=Polycentropsis abbreviata;
    Zuid-Amerikaanse bladvis=Monocirrhus polyacanthus;
    Luipaardklimbaars=Ctenopoma acutirostre;
    Afrikaanse struikvis;
    Indische badis=Badis badis;
    Scharlakenbadis=Dario dario;
    Zwarte roodstaartlabeo=Epalzeorhynchos bicolor;
    Regenbooglabeo=Epalzeorhynchos frenatum;
    Zilveren haai=Balantiocheilos melanopterus;
    Zwarte haai=Labeo chrysophekadion;
    Chinese hoogvinzuigkarper=Myxocyprinus asiaticus;
    Birmese rode lijngrondel;
    Pauwgrondel=Tateurndina ocellicauda;
    Hommelgrondel;
    Marmergrondel=Oxyeleotris marmorata;
    Rode regenbooggrondel;
    Blauwe neon grondel;
    Stiphodon;
    Stiphodon semoni;
    Rode stiphodon=Stiphodon rutilaureus;
    Woestijngrondel=Chlamydogobius eremius;
    Zoetwaternaaldvis;
    Zoetwatermurene=Gymnothorax tile;
    Indische slangenaal=Macrognathus pancalus;
    Vuurstaarta al=Vuuraal=Mastacembelus erythrotaenia;
    Bandspiny-eel=Mastacembelus armatus;
    Pauwoogaal=Macrognathus siamensis;
    Rode slangenaal;
    Zwarte slangenaal;
    Afrikaanse vlindercichlide;
    Bengaalse danio;
    Prachtbarbeel;
    Pentazonabarbeel;
    Odessa-barbeel=Pethia padamya;
    Panda-barbeel;
    Achtstreepbarbeel;
    Gouden rasbora;
    Blauwe rasbora;
    Smaragdgroene dwergrasbora;
    Rode dwergdanio=Danio erythromicron
  `, [1, 14, 50]);

  // MEER ZOETWATERVISSEN UIT EUROPA

  groep(`
    Europese paling=Anguilla anguilla;
    Amerikaanse paling=Anguilla rostrata;
    Japanse paling=Anguilla japonica;
    Australische langvinpaling=Anguilla reinhardtii;
    Nieuw-Zeelandse langvinpaling=Anguilla dieffenbachii;
    Kortvinpaling=Anguilla australis;
    Marmerpaling=Anguilla marmorata;
    Driedoornige stekelbaars=Gasterosteus aculeatus;
    Tiendoornige stekelbaars=Pungitius pungitius;
    Beekdonderpad=Cottus rhenanus;
    Rivierdonderpad=Cottus perifretum;
    Alpen rivierdonderpad;
    Zwartbekgrondel=Neogobius melanostomus;
    Kesslers grondel=Ponticola kessleri;
    Pontische stroomgrondel=Neogobius fluviatilis;
    Marmergrondel=Proterorhinus semilunaris;
    Amoergrondel=Perccottus glenii;
    Amerikaanse hondsvis=Umbra pygmaea;
    Europese hondsvis=Umbra krameri;
    Oost-Amerikaanse hondsvis=Umbra limi;
    Europese mudminnow;
    Oostelijke moddervis;
    Italiaanse barbeel=Barbus plebejus;
    Spaanse barbeel=Luciobarbus bocagei;
    Italiaanse sneep=Protochondrostoma genei;
    Franse sneep=Parachondrostoma toxostoma;
    Italiaanse kopvoorn=Squalius squalus;
    Adriatische forel=Salmo obtusirostris;
    Marmerforel=Salmo marmoratus
  `, [1, 14, 50]);

  // VOGELS MET EEN STERKE BINDING AAN WATER
  //
  // Bij vraag 1 nemen we ook vogels op die een groot
  // gedeelte van hun leven op of in water doorbrengen.
  // Uitsluitend vogels bij het water zijn niet genoeg.

  groep(`
    Eend;
    Wilde eend=Anas platyrhynchos;
    Krakeend=Mareca strepera;
    Slobeend=Spatula clypeata;
    Wintertaling=Anas crecca;
    Zomertaling=Spatula querquedula;
    Smient=Mareca penelope;
    Amerikaanse smient=Mareca americana;
    Pijlstaart=Anas acuta;
    Kuifeend=Aythya fuligula;
    Tafeleend=Aythya ferina;
    Witoogeend=Aythya nyroca;
    Krooneend=Netta rufina;
    Topper=Aythya marila;
    Kleine topper=Aythya affinis;
    Brilduiker=Bucephala clangula;
    IJslandse brilduiker=Bucephala islandica;
    Buffelkopeend=Bucephala albeola;
    Eidereend=Somateria mollissima;
    Koningseider=Somateria spectabilis;
    Brileider=Somateria fischeri;
    Stellers eider=Polysticta stelleri;
    IJseend=Clangula hyemalis;
    Zwarte zee-eend=Melanitta nigra;
    Grote zee-eend=Melanitta fusca;
    Amerikaanse zee-eend=Melanitta americana;
    Brilzee-eend=Melanitta perspicillata;
    Siberische zee-eend=Melanitta stejnegeri;
    Witvleugelzee-eend=Melanitta deglandi;
    Harlekijneend=Histrionicus histrionicus;
    Rosse stekelstaart=Oxyura jamaicensis;
    Witkopeend=Oxyura leucocephala;
    Blauwsnavelstekelstaart=Oxyura australis;
    Argentijnse stekelstaart=Oxyura vittata;
    Afrikaanse stekelstaart=Oxyura maccoa;
    Mandarijneend=Aix galericulata;
    Carolina-eend=Aix sponsa;
    Muskuseend=Cairina moschata;
    Bergeend=Tadorna tadorna;
    Casarca=Tadorna ferruginea;
    Paradijscasarca=Tadorna variegata;
    Australische bergeend=Tadorna tadornoides;
    Kaapse bergeend=Tadorna cana;
    Kaapse taling=Anas capensis;
    Roodbekpijlstaart=Anas erythrorhyncha;
    Kaneeltaling=Spatula cyanoptera;
    Blauwvleugeltaling=Spatula discors;
    Groenvleugeltaling=Anas carolinensis;
    Australische slobeend=Spatula rhynchotis;
    Australische grondeleend=Anas superciliosa;
    Rozeooreend=Malacorhynchus membranaceus;
    Manengans=Chenonetta jubata;
    Bleshoen=Biziura lobata;
    Grote zaagbek=Mergus merganser;
    Middelste zaagbek=Mergus serrator;
    Nonnetje=Mergellus albellus;
    Braziliaanse zaagbek=Mergus octosetaceus;
    Geschubde zaagbek=Mergus squamatus;
    Amerikaanse krooneend=Netta erythrophthalma;
    Roodkopeend=Aythya americana;
    Grote tafeleend=Aythya valisineria;
    Ringsnaveleend=Aythya collaris;
    Nieuw-Zeelandse toppereend=Aythya novaeseelandiae;
    Madagascarwitoogeend=Aythya innotata;
    Marmereend=Marmaronetta angustirostris;
    Bronsvleugeleend=Speculanas specularis;
    Geelsnaveleend=Anas undulata;
    Mellers eend=Anas melleri;
    Afrikaanse zwarte eend=Anas sparsa;
    Filippijnse eend=Anas luzonica;
    Hawaiieend=Anas wyvilliana;
    Laysaneend=Anas laysanensis;
    Geelbekpijlstaart=Anas georgica;
    Roodschoudereend=Callonetta leucophrys;
    Grijze taling=Anas gracilis;
    Bruine taling=Anas chlorotis;
    Kastanjetaling=Anas castanea;
    Puna-taling=Spatula puna;
    Zilvertaling=Spatula versicolor;
    Zwartkopeend=Heteronetta atricapilla;
    Coscorobazwaan=Coscoroba coscoroba;
    Zwaan;
    Knobbelzwaan=Cygnus olor;
    Wilde zwaan=Cygnus cygnus;
    Kleine zwaan=Cygnus columbianus bewickii;
    Fluitzwaan=Cygnus columbianus;
    Zwarte zwaan=Cygnus atratus;
    Zwarthalszwaan=Cygnus melancoryphus;
    Trompetzwaan=Cygnus buccinator
  `, [1, 2, 14, 18, 22, 50]);

  // GANZEN

  groep(`
    Gans;
    Grauwe gans=Anser anser;
    Kolgans=Anser albifrons;
    Dwerggans=Anser erythropus;
    Toendrarietgans=Anser serrirostris;
    Taigarietgans=Anser fabalis;
    Kleine rietgans=Anser brachyrhynchus;
    Sneeuwgans=Anser caerulescens;
    Rossgans=Anser rossii;
    Keizergans=Anser canagicus;
    Indische gans=Anser indicus;
    Zwaangans=Anser cygnoides;
    Canadese gans=Branta canadensis;
    Kleine Canadese gans=Branta hutchinsii;
    Brandgans=Branta leucopsis;
    Rotgans=Branta bernicla;
    Roodhalsgans=Branta ruficollis;
    Nijlgans=Alopochen aegyptiaca;
    Spoorwiekgans=Plectropterus gambensis;
    Ekstergans=Anseranas semipalmata
  `, [1, 2, 7, 14, 18, 22, 50]);

  // FUTEN EN DUIKERS

  groep(`
    Fuut=Podiceps cristatus;
    Dodaars=Tachybaptus ruficollis;
    Kuifduiker=Podiceps auritus;
    Geoorde fuut=Podiceps nigricollis;
    Roodhalsfuut=Podiceps grisegena;
    Grote fuut=Podiceps major;
    Zilverfuut=Podiceps occipitalis;
    Titicacafuut=Rollandia microptera;
    Witwangfuut=Rollandia rolland;
    Zwartkopfuut=Poliocephalus poliocephalus;
    Nieuw-Zeelandse fuut=Poliocephalus rufopectus;
    Australische dodaars=Tachybaptus novaehollandiae;
    Madagaskardodaars=Tachybaptus pelzelnii;
    Dikbekfuut=Podilymbus podiceps;
    Zwanenhalsfuut=Aechmophorus occidentalis;
    Clarks fuut=Aechmophorus clarkii;
    Roodkeelduiker=Gavia stellata;
    Parelduiker=Gavia arctica;
    IJsduiker=Gavia immer;
    Geelsnavelduiker=Gavia adamsii;
    Pacifische parelduiker=Gavia pacifica
  `, [1, 7, 14, 17, 18, 22, 50]);

  // AALSCHOLVERS EN SLANGENHALSVOGELS

  groep(`
    Aalscholver;
    Grote aalscholver=Phalacrocorax carbo;
    Kuifaalscholver=Gulosus aristotelis;
    Dwergaalscholver=Microcarbo pygmaeus;
    Kleine aalscholver=Microcarbo niger;
    Kleine bonte aalscholver=Microcarbo melanoleucos;
    Afrikaanse dwergaalscholver=Microcarbo africanus;
    Bonte aalscholver=Phalacrocorax varius;
    Japanse aalscholver=Phalacrocorax capillatus;
    Brandts aalscholver=Urile penicillatus;
    Pelagische aalscholver=Urile pelagicus;
    Roodmaskeraalscholver=Urile urile;
    Amerikaanse aalscholver=Nannopterum auritum;
    Neotropische aalscholver=Nannopterum brasilianum;
    Kaapse aalscholver=Phalacrocorax capensis;
    Kust aalscholver=Phalacrocorax neglectus;
    Socotraaalscholver=Phalacrocorax nigrogularis;
    Keizeraalscholver=Leucocarbo atriceps;
    Koningsaalscholver=Leucocarbo carunculatus;
    Slangenhalsvogel;
    Afrikaanse slangenhalsvogel=Anhinga rufa;
    Amerikaanse slangenhalsvogel=Anhinga anhinga;
    Australische slangenhalsvogel=Anhinga novaehollandiae;
    Aziatische slangenhalsvogel=Anhinga melanogaster
  `, [1, 2, 7, 14, 17, 18, 22, 50]);

  groep(`
    Galapagosaalscholver=Nannopterum harrisi
  `, [1, 7, 11, 14, 17, 18, 22, 50]);

  // PINGUÏNS

  groep(`
    Pinguïn=Penguin;
    Keizerspinguïn=Aptenodytes forsteri;
    Koningspinguïn=Aptenodytes patagonicus;
    Adéliepinguïn=Pygoscelis adeliae;
    Stormbandpinguïn=Pygoscelis antarcticus;
    Ezelspinguïn=Pygoscelis papua;
    Macaronipinguïn=Eudyptes chrysolophus;
    Schlegelpinguïn=Eudyptes schlegeli;
    Zuidelijke rotspinguïn=Eudyptes chrysocome;
    Noordelijke rotspinguïn=Eudyptes moseleyi;
    Grote kuifpinguïn=Eudyptes sclateri;
    Snareskuifpinguïn=Eudyptes robustus;
    Fjordlandpinguïn=Eudyptes pachyrhynchus;
    Geeloogpinguïn=Megadyptes antipodes;
    Dwergpinguïn=Eudyptula minor;
    Humboldtpinguïn=Spheniscus humboldti;
    Magelhaenpinguïn=Spheniscus magellanicus;
    Galapagospinguïn=Spheniscus mendiculus;
    Brilpinguïn=Spheniscus demersus
  `, [1, 7, 11, 14, 17, 18, 22, 50]);

  // ALKEN EN ZEEKOETEN

  groep(`
    Alk=Alca torda;
    Kleine alk=Alle alle;
    Zeekoet=Uria aalge;
    Kortbekzeekoet=Uria lomvia;
    Zwarte zeekoet=Cepphus grylle;
    Brilzeekoet=Cepphus carbo;
    Duifzeekoet=Cepphus columba;
    Papegaaiduiker=Fratercula arctica;
    Kuifpapegaaiduiker=Fratercula cirrhata;
    Hoornpapegaaiduiker=Fratercula corniculata;
    Neushoornalk=Cerorhinca monocerata;
    Marmeralk=Brachyramphus marmoratus;
    Kittlitz' alk=Brachyramphus brevirostris;
    Langsnavelalk=Brachyramphus perdix;
    Kuifalk=Aethia cristatella;
    Kleine kuifalk=Aethia pygmaea;
    Dwergalk=Aethia pusilla;
    Snoralk=Aethia psittacula;
    Cassins alk=Ptychoramphus aleuticus;
    Xantusalk;
    Japanse alk=Synthliboramphus wumizusume;
    Oude alk=Synthliboramphus antiquus
  `, [1, 2, 7, 11, 14, 17, 18, 22, 50]);

  // PELIKANEN

  groep(`
    Pelikaan;
    Roze pelikaan=Pelecanus onocrotalus;
    Kroeskoppelikaan=Pelecanus crispus;
    Bruine pelikaan=Pelecanus occidentalis;
    Peruaanse pelikaan=Pelecanus thagus;
    Australische pelikaan=Pelecanus conspicillatus;
    Amerikaanse witte pelikaan=Pelecanus erythrorhynchos;
    Kleine pelikaan=Pelecanus rufescens;
    Grijze pelikaan=Pelecanus philippensis
  `, [1, 2, 7, 14, 17, 18, 22, 50]);

  // MEERKOETEN EN WATERHOENDERS

  groep(`
    Meerkoet=Fulica atra;
    Amerikaanse meerkoet=Fulica americana;
    Caribische meerkoet;
    Roodknobbelmeerkoet=Fulica cristata;
    Andesmeerkoet=Fulica ardesiaca;
    Reuzenmeerkoet=Fulica gigantea;
    Hoornmeerkoet=Fulica cornuta;
    Roodvoorhoofdmeerkoet=Fulica rufifrons;
    Roodbandmeerkoet=Fulica armillata;
    Witvleugelmeerkoet=Fulica leucoptera;
    Waterhoen=Gallinula chloropus;
    Amerikaans waterhoen=Gallinula galeata;
    Australisch waterhoen=Gallinula tenebrosa;
    Hawaiiaans waterhoen;
    Purperkoet=Porphyrio porphyrio;
    Afrikaanse purperkoet=Porphyrio madagascariensis;
    Grijskoppurperkoet=Porphyrio poliocephalus;
    Australische purperkoet=Porphyrio melanotus;
    Amerikaans purperhoen=Porphyrio martinica;
    Azuurpurperhoen=Porphyrio flavirostris
  `, [1, 7, 14, 18, 22, 50]);

  // AANVULLENDE ZEEGARNALEN

  groep(`
    Gewone garnaal;
    Zwarte tijgergarnaal;
    Atlantische witte garnaal=Penaeus setiferus;
    Bruine garnaal=Farfantepenaeus aztecus;
    Roze Atlantische garnaal=Farfantepenaeus duorarum;
    Blauwe garnaal=Litopenaeus stylirostris;
    Koninklijke rode garnaal=Pleoticus robustus;
    Argentijnse rode garnaal=Pleoticus muelleri;
    Noorse diepzeegarnaal;
    Gestreepte steurgarnaal=Palaemon elegans;
    Langneussteurgarnaal;
    Rode gestreepte poetsgarnaal;
    Gele poetsgarnaal;
    Gevlekte anemoongarnaal=Periclimenes brevicarpalis;
    Doorzichtige anemoongarnaal;
    Prachtanemoongarnaal;
    Keizerspoetsgarnaal;
    Marmeren garnaal=Saron marmoratus;
    Nachtgarnaal=Saron neglectus;
    Hommelgarnaal=Gnathophyllum americanum;
    Dansgarnaal;
    Koraalgarnaal=Stenopus hispidus;
    Blauwe koraalgarnaal=Stenopus tenuirostris;
    Gouden koraalgarnaal=Stenopus scutellatus;
    Gestreepte koraalgarnaal;
    Rode pistoolgarnaal;
    Gevlekte pistoolgarnaal;
    Hawaiiaanse rode garnaal=Halocaridina rubra;
    Gewone aasgarnaal;
    Brakwateraasgarnaal=Neomysis integer;
    Reuzenmysis;
    Antarctische aasgarnaal
  `, [1, 50]);

  // AANVULLENDE KRABBEN

  groep(`
    Gewone zwemkrab=Liocarcinus holsatus;
    Gewimperde zwemkrab=Liocarcinus navigator;
    Grijze zwemkrab=Liocarcinus vernalis;
    Breedpootkrab=Portumnus latipes;
    Kleine heremietkrab;
    Gewone porseleinkrab=Pisidia longicornis;
    Harige porseleinkrab=Porcellana platycheles;
    Blauwe porseleinkrab;
    Anemoonporseleinkrab=Neopetrolisthes maculatus;
    Gevlekte porseleinkrab;
    Rode mangrovekrab;
    Paarse mangrovekrab;
    Rode scharenkrab=Parasesarma bidens;
    Zwarte landkrab=Gecarcinus ruricola;
    Blauwe landkrab=Cardisoma guanhumi;
    Regenboogkrab=Cardisoma armatum;
    Rode rotskrab uit de Middellandse Zee;
    Marmerkrab=Pachygrapsus marmoratus;
    Japanse penseelkrab=Hemigrapsus takanoi;
    Aziatische strandkrab=Hemigrapsus sanguineus;
    Amerikaanse brakwaterkrab=Rhithropanopeus harrisii;
    Gewone modderkrab;
    Rode mangrovemodderkrab;
    Reuzenmodderkrab;
    Harlekijnkrab;
    Aardbeikrab=Neoliomera pubescens;
    Gladde krab;
    Draakkrab;
    Koraalkrab;
    Koraalgal krab;
    Gele trapeziakrab;
    Gewone wenkrab;
    Rode wenkrab;
    Blauwe wenkrab;
    Gele spookkrab;
    Grote spookkrab=Ocypode ceratophthalmus;
    Stille Oceaan-zandkrab=Emerita analoga;
    Atlantische molkrab=Emerita talpoida
  `, [1, 50]);

  // EXTRA ZEEWEEKDIEREN

  groep(`
    Gele schaalhoren;
    Zwarte schaalhoren;
    Reuzenschaalhoren;
    Schildpadslak=Scutus;
    Sleutelgatslak=Fissurella;
    Sleutelgathoren;
    Vijfhoekige sleutelgathoren;
    Flamingotongslak=Cyphoma gibbosum;
    Eierschelpkauri=Ovula ovum;
    Tijgerolijfslak=Oliva;
    Letterolijfslak=Oliva sayana;
    Spookslak;
    Kroonhoren=Melongena corona;
    Paardenconch=Triplofusus giganteus;
    Reuzenwulk=Syrinx aruanus;
    Roze vleugelhoren;
    Harpslak=Harpa;
    Keizersharpslak=Harpa costata;
    Kroonharpslak;
    Textielvoluut;
    Meloenvoluut=Melo melo;
    Keizersvoluut;
    Bontgekleurd zeeoor;
    Zwarte kauri;
    Gouden kauri=Callistocypraea aurantium;
    Kaartkauri=Leporicypraea mappa;
    Slangenkopkauri=Monetaria caputserpentis;
    Chocoladekauri;
    Dwergkauri;
    Pantherkauri;
    Atlantische porseleinslak;
    Glanzende tolhoren;
    Knobbelige tolhoren;
    Asgrauwe tolhoren=Steromphala cineraria;
    Genavelde tolhoren=Steromphala umbilicalis;
    Gewone tolhoren=Steromphala magus;
    Gewone purperslak;
    Japanse stekelhoren=Rapana venosa;
    Gewone stekelhoren=Ocenebra erinaceus;
    Amerikaanse oesterboorder=Urosalpinx cinerea;
    Japanse oesterboorder=Ocinebrellus inornatus;
    Gewone chitonslak;
    Ruwe keverslak;
    Keverslak;
    Achtplater;
    Reuzenkeverslak=Cryptochiton stelleri;
    Gewone tandhoren;
    Olifantstandslak;
    Manteltjesschelp;
    Gele strandschelp;
    Zandschelp;
    Witte boormossel=Barnea candida;
    Amerikaanse boormossel;
    Ruwe boormossel;
    Gewone boormossel=Pholas dactylus;
    Rotsboorder=Hiatella arctica;
    Gewone arkschelp;
    Bloedkokkel=Tegillarca granosa;
    Harige arkschelp=Arca noae;
    Zwarte mantelschelp;
    Reuzenoester;
    Pacifische tapijtschelp;
    Amerikaanse venusschelp=Mercenaria mercenaria;
    Atlantische zwaardschede;
    Pacifische zwaardschede;
    Bonte zaagjesmossel;
    Mediterrane zaagjesmossel=Donax trunculus;
    Kleine hartschelp;
    Gevlamde tapijtschelp
  `, [1, 11, 50]);

  // AANVULLENDE ZEENAAKTSLAKKEN

  groep(`
    Doto coronata;
    Doto fragilis;
    Doto pinnatifida;
    Facelina bostoniensis;
    Facelina auriculata;
    Favorinus branchialis;
    Favorinus blianus;
    Janolus cristatus;
    Antiopella cristata;
    Aeolidiella alderi;
    Aeolidiella glauca;
    Cuthona nana;
    Trinchesia caerulea;
    Eubranchus tricolor;
    Eubranchus farrani;
    Eubranchus exiguus;
    Polycera faeroensis;
    Polycera quadrilineata;
    Thecacera pennigera;
    Limacia clavigera;
    Aegires punctilucens;
    Acanthodoris pilosa;
    Onchidoris muricata;
    Goniodoris nodosa;
    Goniodoris castanea;
    Okenia elegans;
    Okenia aspersa;
    Dendrodoris limbata;
    Dendrodoris grandiflora;
    Felimare picta;
    Felimare tricolor;
    Felimare orsinii;
    Felimida purpurea;
    Felimida luteorosea;
    Peltodoris atromaculata;
    Discodoris boholiensis;
    Halgerda batangas;
    Halgerda tessellata;
    Halgerda carlsoni;
    Risbecia pulchella;
    Ceratosoma trilobatum;
    Ceratosoma tenue;
    Ceratosoma gracillimum;
    Miamira sinuata;
    Miamira magnifica;
    Bornella anguilla;
    Bornella stellifer;
    Pteraeolidia ianthina;
    Phyllodesmium longicirrum;
    Phyllodesmium briareum;
    Phyllodesmium poindimiei;
    Flabellina rubrolineata;
    Flabellina exoptata;
    Tritonia hombergii;
    Tritonia plebeia;
    Melibe leonina;
    Melibe viridis;
    Melibe colemani;
    Melibe engeli;
    Cyerce nigricans;
    Cyerce elegans;
    Cyerce bourbonica;
    Costasiella ocellifera;
    Costasiella usagi;
    Elysia timida;
    Elysia ornata;
    Elysia marginata;
    Elysia leucolegnote;
    Elysia obtusa;
    Thuridilla hopei;
    Thuridilla gracilis;
    Thuridilla carlsoni
  `, [1, 11, 50]);

  // AANVULLENDE ZEE- EGELS

  groep(`
    Echinometra mathaei;
    Echinometra lucunter;
    Echinometra viridis;
    Echinostrephus aciculatus;
    Echinostrephus molaris;
    Eucidaris tribuloides;
    Eucidaris metularia;
    Eucidaris thouarsii;
    Prionocidaris baculosa;
    Cidaris cidaris;
    Stylocidaris affinis;
    Arbacia punctulata;
    Arbacia dufresnii;
    Tripneustes gratilla;
    Tripneustes ventricosus;
    Lytechinus variegatus;
    Lytechinus pictus;
    Salmacis bicolor;
    Salmacis sphaeroides;
    Mespilia globulus;
    Pseudoboletia maculata;
    Pseudoboletia indiana;
    Temnopleurus toreumaticus;
    Strongylocentrotus pallidus;
    Hemicentrotus pulcherrimus;
    Heliocidaris erythrogramma;
    Heliocidaris tuberculata;
    Centrostephanus rodgersii;
    Centrostephanus longispinus;
    Diadema savignyi;
    Diadema mexicanum;
    Diadema paucispinum;
    Astropyga radiata;
    Astropyga magnifica;
    Heterocentrotus trigonarius;
    Toxopneustes roseus;
    Brissus unicolor;
    Spatangus purpureus;
    Echinocardium flavescens;
    Echinocyamus pusillus;
    Clypeaster rosaceus;
    Clypeaster subdepressus;
    Mellita quinquiesperforata;
    Dendraster excentricus;
    Encope emarginata
  `, [1, 11, 50]);

  // AANVULLENDE ZEESTERREN

  groep(`
    Asterias forbesi;
    Asterias vulgaris;
    Pisaster ochraceus;
    Pisaster brevispinus;
    Pisaster giganteus;
    Evasterias troschelii;
    Leptasterias hexactis;
    Leptasterias polaris;
    Luidia sarsii;
    Luidia clathrata;
    Luidia maculata;
    Luidia senegalensis;
    Astropecten aranciacus;
    Astropecten bispinosus;
    Astropecten jonstoni;
    Astropecten polyacanthus;
    Astropecten articulatus;
    Patiria miniata;
    Patiria pectinifera;
    Asterina phylactica;
    Asterina stellifera;
    Henricia sanguinolenta;
    Henricia oculata;
    Henricia leviuscula;
    Echinaster spinulosus;
    Echinaster echinophorus;
    Linckia multifora;
    Linckia guildingi;
    Fromia monilis;
    Fromia milleporella;
    Fromia indica;
    Fromia elegans;
    Gomophia aegyptiaca;
    Ophidiaster ophidianus;
    Ophidiaster granifer;
    Choriaster granulatus;
    Culcita novaeguineae;
    Culcita schmideliana;
    Pentaceraster cumingi;
    Pentaceraster mammillatus;
    Protoreaster lincki;
    Oreaster reticulatus;
    Acanthaster planci;
    Acanthaster solaris;
    Solaster endeca;
    Solaster dawsoni;
    Solaster stimpsoni;
    Crossaster multispinus;
    Pteraster tesselatus;
    Pteraster militaris;
    Hippasteria phrygiana;
    Mediaster aequalis;
    Porania pulvillus
  `, [1, 11, 50]);

  // AANVULLENDE ZE E K O M K O M M E R S

  groep(`
    Holothuria edulis;
    Holothuria leucospilota;
    Holothuria scabra;
    Holothuria nobilis;
    Holothuria fuscogilva;
    Holothuria whitmaei;
    Holothuria tubulosa;
    Holothuria polii;
    Holothuria mammata;
    Holothuria arguinensis;
    Holothuria sanctori;
    Holothuria mexicana;
    Holothuria floridana;
    Holothuria impatiens;
    Holothuria pervicax;
    Holothuria hilla;
    Bohadschia argus;
    Bohadschia marmorata;
    Bohadschia vitiensis;
    Bohadschia graeffei;
    Actinopyga mauritiana;
    Actinopyga echinites;
    Actinopyga miliaris;
    Actinopyga lecanora;
    Stichopus chloronotus;
    Stichopus horrens;
    Stichopus vastus;
    Stichopus herrmanni;
    Stichopus monotuberculatus;
    Thelenota rubralineata;
    Pearsonothuria graeffei;
    Cucumaria frondosa;
    Cucumaria miniata;
    Ocnus planci;
    Ocnus lacteus;
    Aslia lefevrei;
    Psolus fabricii;
    Psolus phantapus;
    Synapta maculata;
    Euapta godeffroyi;
    Leptosynapta inhaerens
  `, [1, 11, 50]);

  // AANVULLENDE KWALLEN EN RIBKWALLEN

  groep(`
    Aurelia labiata;
    Aurelia limbata;
    Chrysaora fuscescens;
    Chrysaora quinquecirrha;
    Chrysaora melanaster;
    Chrysaora colorata;
    Chrysaora pacifica;
    Chrysaora achlyos;
    Cyanea nozakii;
    Cyanea versicolor;
    Rhizostoma luteum;
    Rhopilema esculentum;
    Rhopilema nomadica;
    Catostylus mosaicus;
    Cephea cephea;
    Cephea octostyla;
    Netrostoma setouchianum;
    Thysanostoma thysanura;
    Phyllorhiza punctata;
    Cassiopea xamachana;
    Cassiopea andromeda;
    Cassiopea frondosa;
    Mastigias papua;
    Sanderia malayensis;
    Diplulmaris antarctica;
    Desmonema glaciale;
    Periphylla periphylla;
    Atolla chuni;
    Atolla parva;
    Atolla vanhoeffeni;
    Solmissus;
    Solmissus incisa;
    Aequorea victoria;
    Aequorea forskalea;
    Aequorea macrodactyla;
    Turritopsis dohrnii=Onsterfelijke kwal;
    Gonionemus vertens;
    Olindias formosus;
    Olindias phosphorica;
    Sarsia tubulosa;
    Clytia hemisphaerica;
    Obelia geniculata;
    Eirene viridula;
    Bougainvillia muscus;
    Pleurobrachia bachei;
    Beroe cucumis;
    Beroe ovata;
    Beroe gracilis;
    Bolinopsis infundibulum;
    Bolinopsis vitrea;
    Leucothea multicornis;
    Bathocyroe fosteri;
    Lampocteis cruentiventer;
    Mertensia ovum;
    Euplokamis dunlapae
  `, [1, 11, 50]);

  // ============================================================
  // GERICHTE CORRECTIES
  // ============================================================

  function verwijderDier(naam) {
    database.delete(normaliseer(naam));
  }

  function verwijderKoppeling(naam, vraagnummers) {
    const record = database.get(normaliseer(naam));

    if (!record) return;

    vraagnummers.forEach(nummer => {
      record.vragen.delete(nummer);
    });
  }

  function samenvoegen(hoofdnaam, andereNaam) {
    const hoofdSleutel = normaliseer(hoofdnaam);
    const andereSleutel = normaliseer(andereNaam);

    if (hoofdSleutel === andereSleutel) return;

    const hoofd = database.get(hoofdSleutel);
    const ander = database.get(andereSleutel);

    if (!hoofd || !ander) return;

    ander.vragen.forEach(nummer => {
      hoofd.vragen.add(nummer);
    });

    hoofd.synoniemen.add(ander.naam);

    ander.synoniemen.forEach(synoniem => {
      hoofd.synoniemen.add(synoniem);
    });

    database.delete(andereSleutel);
  }

  // Zeevonk is een dinoflagellaat, geen dier.

  verwijderDier("Zeevonk");

  // Een siddermeerval is een zoetwatervis.

  verwijderKoppeling("Gewone siddermeerval", [11]);

  // Weekdieren en schaaldieren zijn brede groepen
  // waarvan ook landdieren bestaan.
  // De algemene namen blijven als categorieaanduiding
  // alleen beschikbaar voor vraag 50.

  verwijderKoppeling("Weekdier", [1]);
  verwijderKoppeling("Schaaldier", [1]);

  // Slangachtige salamanders hebben slechts twee
  // voorpoten of zeer kleine, afwijkende ledematen.

  verwijderKoppeling("Grote sirene", [4]);
  verwijderKoppeling("Kleine sirene", [4]);

  // Volwassen kikkers hebben geen staart.

  for (const naam of [
    "Groene kikker",
    "Bruine kikker",
    "Meerkikker",
    "Poelkikker",
    "Bastaardkikker",
    "Amerikaanse brulkikker",
    "Groene Amerikaanse kikker",
    "Luipaardkikker",
    "Noordelijke luipaardkikker",
    "Afrikaanse klauwkikker",
    "Dwergklauwkikker",
    "Surinaamse pad",
    "Titicacakikker",
    "Harige kikker",
    "Vuurbuikpad",
    "Geelbuikvuurpad",
    "Oosterse vuurbuikpad"
  ]) {
    verwijderKoppeling(naam, [18]);
  }

  // Synoniemen samenvoegen.

  samenvoegen("Kabeljauw", "Atlantische kabeljauw");
  samenvoegen("Goudbrasem", "Dorade");
  samenvoegen("Noordzeegarnaal", "Gewone garnaal");
  samenvoegen("Tijgergarnaal", "Zwarte tijgergarnaal");
  samenvoegen("Kuhli", "Indische modderkruiper");
  samenvoegen("Zeepaling", "Congeraal");
  samenvoegen("Gewone schaatsenrijder", "Gerris lacustris");
  samenvoegen("Groene wierslak", "Elysia viridis");
  samenvoegen("Grote vlokslak", "Aeolidia papillosa");
  samenvoegen("Harlekijnslak", "Polycera quadrilineata");
  samenvoegen("Gekroonde ringsprietslak", "Facelina auriculata");
  samenvoegen("Witte stippenkwal", "Phyllorhiza punctata");
  samenvoegen("Gouden kwal", "Mastigias papua");
  samenvoegen("Chinese wolhandkrab", "Eriocheir sinensis");
  samenvoegen("Reuzenoctopus", "Enteroctopus dofleini");
  samenvoegen("Bordeauxclownvis", "Premnas biaculeatus");
  samenvoegen("Tijgerbarbeel", "Sumatraan");
  samenvoegen("Zilvertiptetra", "Koperzalm");
  samenvoegen("Blauwe goerami", "Mozaïekgoerami");
  samenvoegen("Grottetra", "Blinde holenvis");
  samenvoegen("Amerikaanse reuzensalamander", "Modderduivel");
  samenvoegen("Gewone siddermeerval", "Siddermeerval");
  samenvoegen("Kleine heremietkreeft", "Kleine heremietkrab");
  samenvoegen("Eendenmossel", "Gewone eendenmossel");
  samenvoegen("Kamster", "Gewone kamster");
  samenvoegen("Witte haai", "Great white shark");
  samenvoegen("Makreelhaai", "Isurus oxyrinchus");

  // ============================================================
  // CONTROLE VAN HET HUIDIGE AANTAL WATERDIEREN
  // ============================================================

  function aantalAntwoorden(vraagnummer) {
    return [...database.values()].filter(
      record => record.vragen.has(vraagnummer)
    ).length;
  }

  function aantalRaketten(aantal) {
    if (aantal === 0) return 0;

    return Math.max(
      1,
      Math.ceil((aantal + 50) / 100)
    );
  }

  console.table(
    [1, 11, 14].map(nummer => ({
      vraag: nummer,
      tekst: vragen[nummer - 1],
      antwoorden: aantalAntwoorden(nummer),
      raketten: aantalRaketten(
        aantalAntwoorden(nummer)
      )
    }))
  );

  // ============================================================
  // EINDE DEEL 2
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 3
  // DUBBELEN, CORRECTIES EN VLIEGENDE DIEREN
  // ============================================================

  // AUTOMATISCH SAMENVOEGEN VAN WETENSCHAPPELIJKE NAMEN

  function wetenschappelijkeNaam(naam) {
    return /^[A-Z][a-z]+ [a-z]+(?: [a-z]+)?$/.test(
      String(naam).trim()
    );
  }

  function controleerDubbeleDieren() {
    const gevonden = new Map();
    let samengevoegd = 0;

    for (const record of [...database.values()]) {
      if (!database.has(normaliseer(record.naam))) {
        continue;
      }

      const namen = [
        record.naam,
        ...record.synoniemen
      ];

      for (const naam of namen) {
        if (!wetenschappelijkeNaam(naam)) continue;

        const sleutel = normaliseer(naam);

        if (gevonden.has(sleutel)) {
          const hoofdnaam = gevonden.get(sleutel);

          if (
            normaliseer(hoofdnaam) !==
            normaliseer(record.naam)
          ) {
            if (database.has(normaliseer(hoofdnaam))) {
              samenvoegen(hoofdnaam, record.naam);
              samengevoegd++;
              break;
            }
          }
        }

        gevonden.set(sleutel, record.naam);
      }
    }

    return samengevoegd;
  }

  // HULPFUNCTIE VOOR BESTAANDE DIEREN
  // Hiermee voegen we eigenschappen toe zonder
  // nieuwe dubbele dierrecords aan te maken.

  function koppelDieren(tekst, vraagnummers) {
    const namen = tekst.split(";")
      .map(x => x.trim())
      .filter(Boolean);

    for (const naam of namen) {
      const sleutel = normaliseer(naam);

      let record = database.get(sleutel);

      if (!record) {
        record = [...database.values()].find(d =>
          [...d.synoniemen].some(
            s => normaliseer(s) === sleutel
          )
        );
      }

      if (record) {
        vraagnummers.forEach(nummer => {
          record.vragen.add(nummer);
        });
      }
    }
  }

  // ============================================================
  // CORRECTIES OP DE WATERDIEREN
  // ============================================================

  samenvoegen("Kleine lantaarnhaai", "Dwerglantaarnhaai");
  samenvoegen("Oscarvis", "Pauwoogcichlide");
  samenvoegen("Zeekurk", "Dodemansduim");
  samenvoegen("Oorkwal", "Maankwal");
  samenvoegen("Atlantische menhaden", "Menhaden");
  samenvoegen("Mimic octopus", "Wonderoctopus");
  samenvoegen("Valentijnkogelvis", "Zwartzadelkogelvis");
  samenvoegen("Aalscholver", "Grote aalscholver");

  verwijderDier("Zandspieringbot");
  verwijderDier("Geweizwamp");
  verwijderDier("Gezaagde steurgarnaalkrab");
  verwijderDier("Australische garibaldi");
  verwijderDier("Zeecicade");
  verwijderDier("Koraalgal krab");

  // De naam nonnetje verwijst zowel naar een vogel
  // als naar een schelpdier. Beide zijn geldig bij
  // vraag 1, maar niet bij alle overige vragen.

  dier("Nonnetje", [1, 2, 7, 11, 14, 18, 22, 50], [
    "Mergellus albellus",
    "Limecola balthica"
  ]);

  // Een bleshoen is een andere naam voor een meerkoet.
  // Biziura lobata is de muskuseend uit Australië.

  verwijderDier("Bleshoen");

  dier("Australische muskuseend",
    [1, 2, 7, 14, 18, 22, 23, 50],
    ["Biziura lobata"]
  );

  // Vliegloze watervogels.

  verwijderKoppeling("Galapagosaalscholver", [2]);
  verwijderKoppeling("Titicacafuut", [2]);

  // Aalsalamanders hebben vier sterk verkleinde poten,
  // maar het aantal verschilt per soort.

  verwijderKoppeling("Aalsalamander", [4]);

  // Landkrabben zijn niet hoofdzakelijk waterdieren.

  for (const naam of [
    "Zwarte landkrab",
    "Blauwe landkrab",
    "Regenboogkrab"
  ]) {
    verwijderKoppeling(naam, [1]);
  }

  // EIERLEGGENDE WATERVOGELS

  for (const record of database.values()) {
    if (record.vragen.has(22)) {
      record.vragen.add(7);
    }
  }

  // BESTAANDE WATERVOGELS DIE KUNNEN VLIEGEN

  koppelDieren(`
    Fuut;
    Dodaars;
    Kuifduiker;
    Geoorde fuut;
    Roodhalsfuut;
    Grote fuut;
    Zilverfuut;
    Witwangfuut;
    Zwartkopfuut;
    Nieuw-Zeelandse fuut;
    Australische dodaars;
    Madagaskardodaars;
    Dikbekfuut;
    Zwanenhalsfuut;
    Clarks fuut;
    Roodkeelduiker;
    Parelduiker;
    IJsduiker;
    Geelsnavelduiker;
    Pacifische parelduiker;
    Meerkoet;
    Amerikaanse meerkoet;
    Caribische meerkoet;
    Roodknobbelmeerkoet;
    Andesmeerkoet;
    Roodvoorhoofdmeerkoet;
    Roodbandmeerkoet;
    Witvleugelmeerkoet;
    Waterhoen;
    Amerikaans waterhoen;
    Australisch waterhoen;
    Hawaiiaans waterhoen;
    Purperkoet;
    Afrikaanse purperkoet;
    Grijskoppurperkoet;
    Australische purperkoet;
    Amerikaans purperhoen;
    Azuurpurperhoen
  `, [2]);

  const samengevoegdeWaterdieren =
    controleerDubbeleDieren();

  console.log(
    "QuizBallon V9 - samengevoegde records:",
    samengevoegdeWaterdieren
  );

  console.table(
    [1, 11, 14].map(nummer => ({
      vraag: nummer,
      antwoorden: aantalAntwoorden(nummer),
      raketten: aantalRaketten(
        aantalAntwoorden(nummer)
      )
    }))
  );

  // ============================================================
  // VRAAG 2: NOEM EEN DIER DAT KAN VLIEGEN
  // ============================================================

  // Algemene vogelnamen.
  // Niet iedere vogelsoort kan vliegen, daarom
  // koppelen we het algemene antwoord vogel niet
  // automatisch aan alle vliegende dieren.

  groep(`
    Vogel=Bird
  `, [7, 18, 22, 50]);

  // Hulpfunctie voor vliegende vogels.

  function vliegendeVogels(tekst, extra = []) {
    groep(tekst, [
      2, 7, 18, 22, 50,
      ...extra
    ]);
  }

  // ============================================================
  // ARENDEN
  // ============================================================

  vliegendeVogels(`
    Arend=Adelaar=Eagle;
    Steenarend=Aquila chrysaetos;
    Keizerarend=Aquila heliaca;
    Spaanse keizerarend=Aquila adalberti;
    Steppearend=Aquila nipalensis;
    Savannearend=Aquila rapax;
    Wigstaartarend=Aquila audax;
    Verreauxs arend=Aquila verreauxii;
    Gurneys arend=Aquila gurneyi;
    Molukse arend=Aquila gurneyi;
    Bonelli-arend=Aquila fasciata;
    Afrikaanse havikarend=Aquila spilogaster;
    Kleine zwarte arend=Hieraaetus morphnoides;
    Dwergarend=Hieraaetus pennatus;
    Ayres' havikarend=Hieraaetus ayresii;
    Wahlbergs arend=Hieraaetus wahlbergi;
    Nieuw-Guinese dwergarend=Hieraaetus weiskei;
    Schreeuwarend=Clanga pomarina;
    Bastaardarend=Clanga clanga;
    Indische schreeuwarend=Clanga hastata;
    Kroonarend=Stephanoaetus coronatus;
    Vechtarend=Polemaetus bellicosus;
    Harpij=Harpia harpyja;
    Wurgarend=Morphnus guianensis;
    Papoea-arend=Harpyopsis novaeguineae;
    Filipijnse apenarend=Pithecophaga jefferyi;
    Zwarte arend=Ictinaetus malaiensis;
    Zwarte kuifarend=Spizaetus tyrannus;
    Bonte kuifarend=Spizaetus ornatus;
    Zwart-witte kuifarend=Spizaetus melanoleucus;
    Andeskuifarend=Spizaetus isidori;
    Indische kuifarend=Nisaetus cirrhatus;
    Javaanse kuifarend=Nisaetus bartelsi;
    Celebeskuifarend=Nisaetus lanceolatus;
    Bergkuifarend=Nisaetus nipalensis;
    Zeearend=Haliaeetus albicilla;
    Amerikaanse zeearend=Haliaeetus leucocephalus;
    Stellers zeearend=Haliaeetus pelagicus;
    Witbuikzeearend=Icthyophaga leucogaster;
    Afrikaanse zeearend=Icthyophaga vocifer;
    Madagaskarzeearend=Icthyophaga vociferoides;
    Witbandzeearend=Haliaeetus leucoryphus;
    Salomonszeearend=Icthyophaga sanfordi;
    Kleine visarend=Icthyophaga humilis;
    Grote visarend=Icthyophaga ichthyaetus;
    Visarend=Pandion haliaetus;
    Slangenarend=Circaetus gallicus;
    Zwartborstslangenarend=Circaetus pectoralis;
    Bruine slangenarend=Circaetus cinereus;
    Gebande slangenarend=Circaetus cinerascens;
    Bateleur=Terathopius ecaudatus
  `, [17]);

  // ============================================================
  // VALKEN
  // ============================================================

  vliegendeVogels(`
    Valk=Falcon;
    Slechtvalk=Falco peregrinus;
    Torenvalk=Falco tinnunculus;
    Kleine torenvalk=Falco naumanni;
    Boomvalk=Falco subbuteo;
    Smelleken=Falco columbarius;
    Giervalk=Falco rusticolus;
    Sakervalk=Falco cherrug;
    Lannervalk=Falco biarmicus;
    Barbarijse valk=Falco pelegrinoides;
    Roodpootvalk=Falco vespertinus;
    Amoerroodpootvalk=Falco amurensis;
    Eleonora's valk=Falco eleonorae;
    Roetvalk=Falco concolor;
    Amerikaanse torenvalk=Falco sparverius;
    Australische torenvalk=Falco cenchroides;
    Seychellentorenvalk=Falco araeus;
    Mauritiustorenvalk=Falco punctatus;
    Madagaskartorenvalk=Falco newtoni;
    Gestreepte torenvalk=Falco zoniventris;
    Grote torenvalk=Falco rupicoloides;
    Grijze torenvalk=Falco ardosiaceus;
    Dickinsons torenvalk=Falco dickinsoni;
    Vosvalk=Falco alopex;
    Rotsvalk=Falco rupicolus;
    Grijze valk=Falco hypoleucos;
    Zwarte valk=Falco subniger;
    Bruine valk=Falco berigora;
    Nieuw-Zeelandse valk=Falco novaeseelandiae;
    Vleermuisvalk=Falco rufigularis;
    Oranjeborstvalk=Falco deiroleucus;
    Aplomadovalk=Falco femoralis;
    Prarievalk=Falco mexicanus;
    Afrikaanse boomvalk=Falco cuvierii;
    Oosterse boomvalk=Falco severus;
    Australische boomvalk=Falco longipennis;
    Nieuw-Guinese boomvalk=Falco berigora;
    Amerikaanse bosvalk=Micrastur semitorquatus;
    Gestreepte bosvalk=Micrastur ruficollis;
    Lachdalk=Herpetotheres cachinnans;
    Kuifcaracara=Caracara plancus;
    Geelkopcaracara=Milvago chimachima;
    Chimangocaracara=Milvago chimango;
    Gestreepte caracara=Phalcoboenus australis;
    Bergcaracara=Phalcoboenus megalopterus
  `, [17]);

  // ============================================================
  // BUIZERDS
  // ============================================================

  vliegendeVogels(`
    Buizerd=Buteo buteo;
    Ruigpootbuizerd=Buteo lagopus;
    Arendbuizerd=Buteo rufinus;
    Roodstaartbuizerd=Buteo jamaicensis;
    Roodschouderbuizerd=Buteo lineatus;
    Breedvleugelbuizerd=Buteo platypterus;
    Swainsons buizerd=Buteo swainsoni;
    Koningsbuizerd=Buteo regalis;
    Grijze buizerd=Buteo plagiatus;
    Kortstaartbuizerd=Buteo brachyurus;
    Witstaartbuizerd=Geranoaetus albicaudatus;
    Witkeelbuizerd=Buteo albigula;
    Galapagosbuizerd=Buteo galapagoensis;
    Hawaiibuizerd=Buteo solitarius;
    Madagaskarbuizerd=Buteo brachypterus;
    Bergbuizerd=Buteo oreophilus;
    Bosbuizerd=Buteo trizonatus;
    Augurbuizerd=Buteo augur;
    Jakhalsbuizerd=Buteo rufofuscus;
    Himalayabuizerd=Buteo refectus;
    Japanse buizerd=Buteo japonicus;
    Oostelijke buizerd;
    Steppebuizerd;
    Afrikaanse wespendief=Pernis apivorus;
    Wespendief;
    Aziatische wespendief=Pernis ptilorhynchus;
    Filipijnse wespendief=Pernis steerei;
    Sulawesiwespendief=Pernis celebensis;
    Woestijnbuizerd=Parabuteo unicinctus
  `, [17]);

  // ============================================================
  // HAVIKEN, SPERWERS EN KIEKENDIEVEN
  // ============================================================

  vliegendeVogels(`
    Havik=Accipiter gentilis;
    Sperwer=Accipiter nisus;
    Amerikaanse havik=Accipiter atricapillus;
    Coopers sperwer=Accipiter cooperii;
    Amerikaanse sperwer=Accipiter striatus;
    Zwarte sperwer=Accipiter melanoleucus;
    Kleine sperwer=Accipiter minullus;
    Ovambosperwer=Accipiter ovampensis;
    Japanse sperwer=Accipiter gularis;
    Chinese sperwer=Accipiter soloensis;
    Shikra=Accipiter badius;
    Balkansperwer=Accipiter brevipes;
    Besrasperwer=Accipiter virgatus;
    Bonte sperwer=Accipiter albogularis;
    Madagaskarsperwer=Accipiter madagascariensis;
    Australische bruine havik=Accipiter fasciatus;
    Grijze havik=Accipiter novaehollandiae;
    Bonte havik=Accipiter poliocephalus;
    Nieuw-Caledonische havik=Accipiter haplochrous;
    Fiji-havik=Accipiter rufitorques;
    Roodborsthavik=Accipiter rufiventris;
    Afrikaanse havik=Accipiter tachiro;
    Bruine kiekendief=Circus aeruginosus;
    Blauwe kiekendief=Circus cyaneus;
    Grauwe kiekendief=Circus pygargus;
    Steppekiekendief=Circus macrourus;
    Amerikaanse blauwe kiekendief=Circus hudsonius;
    Zwarte kiekendief=Circus maurus;
    Afrikaanse bruine kiekendief=Circus ranivorus;
    Madagaskarkiekendief=Circus macrosceles;
    Bonte kiekendief=Circus melanoleucos;
    Oostelijke bruine kiekendief=Circus spilonotus;
    Australische kiekendief=Circus approximans;
    Gevlekte kiekendief=Circus assimilis;
    Langvleugelkiekendief=Circus buffoni;
    Grijze kiekendief=Circus cinereus
  `, [17]);

  // ============================================================
  // WOUWEN EN GIEREN
  // ============================================================

  vliegendeVogels(`
    Rode wouw=Milvus milvus;
    Zwarte wouw=Milvus migrans;
    Geelsnavelwouw=Milvus aegyptius;
    Grijze wouw=Elanus caeruleus;
    Australische grijze wouw=Elanus axillaris;
    Witstaartwouw=Elanus leucurus;
    Letterwouw=Elanus scriptus;
    Brahmaanse wouw=Haliastur indus;
    Fluitwouw=Haliastur sphenurus;
    Zwaluwstaartwouw=Elanoides forficatus;
    Slakkenwouw=Rostrhamus sociabilis;
    Mississippiwouw=Ictinia mississippiensis;
    Loodkleurige wouw=Ictinia plumbea;
    Gier=Vulture;
    Vale gier=Gyps fulvus;
    Monniksgier=Aegypius monachus;
    Aasgier=Neophron percnopterus;
    Lammergier=Gypaetus barbatus;
    Kaapse gier=Gyps coprotheres;
    Rüppells gier=Gyps rueppelli;
    Afrikaanse witruggier=Gyps africanus;
    Indische gier=Gyps indicus;
    Dunsnavelgier=Gyps tenuirostris;
    Bengaalse gier=Gyps bengalensis;
    Himalayagier=Gyps himalayensis;
    Oorgier=Torgos tracheliotos;
    Witkopgier=Trigonoceps occipitalis;
    Kapgier=Necrosyrtes monachus;
    Roodkopgier=Sarcogyps calvus;
    Kalkoengier=Cathartes aura;
    Zwarte gier=Coragyps atratus;
    Kleine geelkopgier=Cathartes burrovianus;
    Grote geelkopgier=Cathartes melambrotus;
    Koningsgier=Sarcoramphus papa;
    Andescondor=Vultur gryphus;
    Californische condor=Gymnogyps californianus;
    Condor
  `);

  // ============================================================
  // UILEN
  // ============================================================

  vliegendeVogels(`
    Uil=Owl;
    Kerkuil=Tyto alba;
    Amerikaanse kerkuil=Tyto furcata;
    Oostelijke kerkuil=Tyto javanica;
    Australische kerkuil;
    Zwarte kerkuil=Tyto tenebricosa;
    Kleine zwarte kerkuil=Tyto multipunctata;
    Australische grasuil=Tyto longimembris;
    Afrikaanse grasuil=Tyto capensis;
    Madagaskargrasuil=Tyto soumagnei;
    Bosuil=Strix aluco;
    Oeraluil=Strix uralensis;
    Laplanduil=Strix nebulosa;
    Gestreepte bosuil=Strix varia;
    Gevlekte bosuil=Strix occidentalis;
    Afrikaanse bosuil=Strix woodfordii;
    Bruine bosuil=Strix leptogrammica;
    Himalayabosuil=Strix nivicolum;
    Woestijnbosuil=Strix hadorami;
    Oehoe=Bubo bubo;
    Amerikaanse oehoe=Bubo virginianus;
    Magelhaenoehoe=Bubo magellanicus;
    Kaapse oehoe=Bubo capensis;
    Gevlekte oehoe=Bubo africanus;
    Verreauxs oehoe=Ketupa lactea;
    Bengaalse oehoe=Bubo bengalensis;
    Farao-oehoe=Bubo ascalaphus;
    Sneeuwuil=Bubo scandiacus;
    Ransuil=Asio otus;
    Velduil=Asio flammeus;
    Afrikaanse velduil=Asio capensis;
    Gestreepte ransuil=Asio clamator;
    Madagaskarransuil=Asio madagascariensis;
    Jamaicaanse uil=Asio grammicus;
    Steenuil=Athene noctua;
    Holenuil=Athene cunicularia;
    Brahmaanse steenuil=Athene brama;
    Bossteenuil=Athene blewitti;
    Ruigpootuil=Aegolius funereus;
    Zaaguil=Aegolius acadicus;
    Zwartkapzaaguil=Aegolius ridgwayi;
    Dwerguil=Glaucidium passerinum;
    Noord-Amerikaanse dwerguil=Glaucidium gnoma;
    Braziliaanse dwerguil=Glaucidium brasilianum;
    Afrikaanse dwerguil=Glaucidium perlatum;
    Kaapse dwerguil=Glaucidium capense;
    Aziatische dwerguil=Glaucidium cuculoides;
    Havikuil=Surnia ulula;
    Dwergooruil=Otus scops;
    Afrikaanse dwergooruil=Otus senegalensis;
    Indische dwergooruil=Otus bakkamoena;
    Japanse dwergooruil=Otus semitorques;
    Oosterse dwergooruil=Otus sunia;
    Sunda-dwergooruil=Otus lempiji;
    Witwangdwergooruil=Ptilopsis leucotis;
    Zuidelijke witwanguil=Ptilopsis granti;
    Westelijke schreeuwuil=Megascops kennicottii;
    Oostelijke schreeuwuil=Megascops asio;
    Briluil=Pulsatrix perspicillata;
    Witkeelbriluil=Pulsatrix koeniswaldiana;
    Visuil;
    Blakistons visuil=Ketupa blakistoni;
    Bruine visuil=Ketupa zeylonensis;
    Maleise visuil=Ketupa ketupu;
    Bruine boeboekuil=Ninox scutulata;
    Australische boeboekuil=Ninox boobook;
    Nieuw-Zeelandse boeboekuil=Ninox novaeseelandiae;
    Machtige boeboekuil=Ninox strenua;
    Blaffende boeboekuil=Ninox connivens;
    Roodbruine boeboekuil=Ninox rufa
  `, [17]);

  // ============================================================
  // KRAAIEN, RAVEN EN EKSTERS
  // ============================================================

  vliegendeVogels(`
    Kraai=Crow;
    Zwarte kraai=Corvus corone;
    Bonte kraai=Corvus cornix;
    Raaf=Corvus corax;
    Roek=Corvus frugilegus;
    Kauw=Coloeus monedula;
    Daurische kauw=Coloeus dauuricus;
    Amerikaanse kraai=Corvus brachyrhynchos;
    Viskraai=Corvus ossifragus;
    Noordwestelijke kraai;
    Australische raaf=Corvus coronoides;
    Kleine Australische raaf=Corvus mellori;
    Australische kraai=Corvus orru;
    Kleine kraai=Corvus bennetti;
    Tasmaanse raaf=Corvus tasmanicus;
    Witnekkraai=Corvus albicollis;
    Schildraaf=Corvus albus;
    Waaierstaartraaf=Corvus rhipidurus;
    Bruinnekraaf=Corvus ruficollis;
    Dikbekraaf=Corvus crassirostris;
    Huiskraai=Corvus splendens;
    Grootbekkraai=Corvus macrorhynchos;
    Indische junglekraai=Corvus culminatus;
    Oostelijke junglekraai=Corvus levaillantii;
    Floreskraai=Corvus florensis;
    Nieuw-Caledonische kraai=Corvus moneduloides;
    Hawaiikraai=Corvus hawaiiensis;
    Witnekkraai uit Haïti=Corvus leucognaphalus;
    Ekster=Pica pica;
    Zwartbekekster=Pica hudsonia;
    Geelsnavelekster=Pica nuttalli;
    Blauwe ekster=Cyanopica cyanus;
    Iberische blauwe ekster=Cyanopica cooki;
    Roodsnavelekster=Urocissa erythroryncha;
    Geelsnavelekster=Urocissa flavirostris;
    Taiwanese blauwe ekster=Urocissa caerulea;
    Groene ekster=Cissa chinensis;
    Javaanse groene ekster=Cissa thalassina;
    Borneose groene ekster=Cissa jefferyi;
    Indochinese groene ekster=Cissa hypoleuca;
    Gaai=Garrulus glandarius;
    Vlaamse gaai;
    Zwartkopgaai=Garrulus lanceolatus;
    Lidths gaai=Garrulus lidthi;
    Blauwe gaai=Cyanocitta cristata;
    Stellers gaai=Cyanocitta stelleri;
    Canadese gaai=Perisoreus canadensis;
    Siberische gaai=Perisoreus infaustus;
    Sichuangaai=Perisoreus internigrans;
    Floridastruikgaai=Aphelocoma coerulescens;
    Californische struikgaai=Aphelocoma californica;
    Mexicaanse gaai=Aphelocoma wollweberi;
    Groene gaai=Cyanocorax yncas;
    Pluchekapgaai=Cyanocorax chrysops;
    Wittekeelgaai=Cyanolyca mirabilis;
    Notenkraker=Nucifraga caryocatactes;
    Amerikaanse notenkraker=Nucifraga columbiana;
    Alpenkauw=Pyrrhocorax graculus;
    Alpenkraai=Pyrrhocorax pyrrhocorax;
    Taigaboomkraai
  `);

  // ============================================================
  // DUIVEN
  // ============================================================

  vliegendeVogels(`
    Duif=Pigeon;
    Rotsduif=Columba livia;
    Stadsduif;
    Houtduif=Columba palumbus;
    Holenduif=Columba oenas;
    Turkse tortel=Streptopelia decaocto;
    Zomertortel=Streptopelia turtur;
    Oosterse tortel=Streptopelia orientalis;
    Lachduif;
    Palmtortel=Spilopelia senegalensis;
    Parelhalstortel=Spilopelia chinensis;
    Roodoogtortel=Streptopelia semitorquata;
    Kaapse tortel=Streptopelia capicola;
    Zwartkeeltortel=Streptopelia lugens;
    Adamawatortel=Streptopelia hypopyrrha;
    Afrikaanse tortel=Streptopelia roseogrisea;
    Wijnrode tortel=Streptopelia vinacea;
    Treurduif=Zenaida macroura;
    Witvleugelduif=Zenaida asiatica;
    Zenaidaduif=Zenaida aurita;
    Galapagosduif=Zenaida galapagoensis;
    Earedove=Zenaida auriculata;
    Diamantduif=Geopelia cuneata;
    Zebraduif=Geopelia striata;
    Vreedzame duif=Geopelia placida;
    Gebande duif=Geopelia humeralis;
    Kapduif=Oena capensis;
    Musduif=Columbina passerina;
    Inca-duif=Columbina inca;
    Rode grondduif=Columbina talpacoti;
    Schubduif=Columbina squammata;
    Blauwe grondduif=Claravis pretiosa;
    Smaragdduif=Chalcophaps indica;
    Pacifische smaragdduif=Chalcophaps longirostris;
    Groenvleugelduif;
    Bronsvleugelduif=Phaps chalcoptera;
    Struikbronsvleugelduif=Phaps elegans;
    Kuifduif=Ocyphaps lophotes;
    Spinifexduif=Geophaps plumifera;
    Nicobarduif=Caloenas nicobarica;
    Kroonduif=Goura cristata;
    Victoria kroonduif=Goura victoria;
    Scheepmakers kroonduif=Goura scheepmakeri;
    Sclaters kroonduif=Goura sclaterii;
    Luzonbloeddruppelduif=Gallicolumba luzonica;
    Mindanaobloeddruppelduif=Gallicolumba crinigera;
    Negrosbloeddruppelduif=Gallicolumba keayi;
    Witborstgrondduif=Pampusana jobiensis;
    Madagaskartortel=Nesoenas picturatus;
    Roze duif=Nesoenas mayeri;
    Bolles laurierduif=Columba bollii;
    Laurierduif=Columba junoniae;
    Zilverduif=Columba argentina;
    Japanse houtduif=Columba janthina;
    Sneeuwduif=Columba leuconota;
    Heuvelduif=Columba rupestris;
    Olijfduif=Columba arquatrix;
    Afrikaanse rotsduif=Columba guinea;
    Bandstaartduif=Patagioenas fasciata;
    Geschubde duif=Patagioenas speciosa;
    Witkruinduif=Patagioenas leucocephala;
    Roodsnavelduif=Patagioenas flavirostris;
    Gewone vruchtenprachtduif=Ptilinopus regina;
    Prachtjufferduif=Ptilinopus superbus;
    Jambu-jufferduif=Ptilinopus jambu;
    Oranje jufferduif=Ptilinopus victor;
    Geelkopprachtduif=Ptilinopus luteovirens;
    Veelkleurige jufferduif=Ptilinopus perousii;
    Zwartnekjufferduif=Ptilinopus melanospilus;
    Rosekopprachtduif=Ptilinopus porphyreus;
    Groene keizerduif=Ducula aenea;
    Bonte keizerduif=Ducula bicolor;
    Australische keizerduif=Ducula spilorrhoa;
    Bergkeizerduif=Ducula badia;
    Grote groene duif=Treron capellei;
    Geelvoetpapegaaiduif=Treron phoenicopterus;
    Afrikaanse groene duif=Treron calvus;
    Rozehalspapegaaiduif=Treron vernans;
    Dikbekpapegaaiduif=Treron curvirostra;
    Witte buikpapegaaiduif=Treron sieboldii
  `);

  // ============================================================
  // PAPEGAAIEN EN ARA'S
  // ============================================================

  vliegendeVogels(`
    Papegaai=Parrot;
    Ara=Macaw;
    Blauwgele ara=Ara ararauna;
    Geelvleugelara=Ara macao;
    Groenvleugelara=Ara chloropterus;
    Soldatenara=Ara militaris;
    Buffons ara=Ara ambiguus;
    Roodoorara=Ara rubrogenys;
    Blauwkeelara=Ara glaucogularis;
    Dwergara=Diopsittaca nobilis;
    Roodbuikara=Orthopsittaca manilatus;
    Blauwkopara=Primolius couloni;
    Illigers ara=Primolius maracana;
    Goudnekara=Primolius auricollis;
    Hyacintara=Anodorhynchus hyacinthinus;
    Lears ara=Anodorhynchus leari;
    Spix' ara=Cyanopsitta spixii;
    Grijze roodstaartpapegaai=Psittacus erithacus;
    Timnehpapegaai=Psittacus timneh;
    Bonte boer=Poicephalus senegalus;
    Meyerpapegaai=Poicephalus meyeri;
    Jardinepapegaai=Poicephalus gulielmi;
    Kaapse papegaai=Poicephalus robustus;
    Roodbuikpapegaai=Poicephalus rufiventris;
    Bruinkoppapegaai=Poicephalus cryptoxanthus;
    Amazonepapegaai;
    Blauwvoorhoofdamazone=Amazona aestiva;
    Geelvoorhoofdamazone=Amazona ochrocephala;
    Dubbele geelkopamazone=Amazona oratrix;
    Geelnekamazone=Amazona auropalliata;
    Oranjevleugelamazone=Amazona amazonica;
    Witvoorhoofdamazone=Amazona albifrons;
    Roodvoorhoofdamazone=Amazona autumnalis;
    Meelamazone=Amazona farinosa;
    Cuba-amazone=Amazona leucocephala;
    Puerto-Ricoamazone=Amazona vittata;
    Sint-Lucia-amazone=Amazona versicolor;
    Keizeramazone=Amazona imperialis;
    Roodhalsamazone=Amazona arausiaca;
    Sint-Vincentamazone=Amazona guildingii;
    Lilakruinamazone=Amazona finschi;
    Groenwangamazone=Amazona viridigenalis;
    Blauwkopamazone=Amazona dufresniana;
    Geelschouderamazone=Amazona barbadensis;
    Roodstaartamazone=Amazona brasiliensis;
    Wijnborstamazone=Amazona vinacea;
    Roodbrilamazone=Amazona pretrei;
    Zwartoorpapegaai=Pionus menstruus;
    Maximiliaanpapegaai=Pionus maximiliani;
    Witkruinpapegaai=Pionus senilis;
    Bronsvleugelpapegaai=Pionus chalcopterus;
    Edelpapegaai=Eclectus roratus;
    Vosmaerpapegaai;
    Zwartkoppapegaai=Pionites melanocephalus;
    Witbuikpapegaai=Pionites leucogaster;
    Goudkapparkiet=Aratinga auricapillus;
    Zonparkiet=Aratinga solstitialis;
    Jandayaparkiet=Aratinga jandaya;
    Nandayparkiet=Aratinga nenday;
    Goudparkiet=Guaruba guarouba;
    Groenwangparkiet=Pyrrhura molinae;
    Bruinoorparkiet=Pyrrhura frontalis;
    Zwartkapparkiet=Pyrrhura rupicola;
    Parelparkiet=Pyrrhura lepida;
    Roodbuikparkiet=Pyrrhura perlata;
    Blauwkroonparkiet=Thectocercus acuticaudatus;
    Monniksparkiet=Myiopsitta monachus;
    Roodmaskerparkiet=Psittacara erythrogenys;
    Mitraparkiet=Psittacara mitratus;
    Wit oogparkiet=Psittacara leucophthalmus;
    Halsbandparkiet=Psittacula krameri;
    Grote alexanderparkiet=Psittacula eupatria;
    Pruimkopparkiet=Psittacula cyanocephala;
    Bloesemkopparkiet=Psittacula roseata;
    Grijskopparkiet=Psittacula finschii;
    Slaty-headed parkiet=Psittacula himalayana;
    Baardparkiet=Psittacula alexandri;
    Langstaartparkiet=Psittacula longicauda;
    Derbyparkiet=Psittacula derbiana;
    Mauritiusparkiet=Psittacula eques;
    Grasparkiet=Melopsittacus undulatus;
    Valkparkiet=Nymphicus hollandicus;
    Bourkeparkiet=Neopsephotus bourkii;
    Turkooisparkiet=Neophema pulchella;
    Splendidparkiet=Neophema splendida;
    Elegantparkiet=Neophema elegans;
    Blauwvleugelparkiet=Neophema chrysostoma;
    Oranjebuikparkiet=Neophema chrysogaster;
    Rotsparkiet=Neophema petrophila;
    Swiftparkiet=Lathamus discolor;
    Mulga-parkiet=Psephotellus varius;
    Roodrugparkiet=Psephotus haematonotus;
    Kapparkiet=Psephotellus dissimilis;
    Goudschouderparkiet=Psephotellus chrysopterygius;
    Pennantrosella=Platycercus elegans;
    Prachtrosella=Platycercus eximius;
    Bleekkoprosella=Platycercus adscitus;
    Strogele rosella;
    Groene rosella=Platycercus caledonicus;
    Stanleyrosella=Platycercus icterotis;
    Zwartkoprosella=Platycercus venustus;
    Australische koningsparkiet=Alisterus scapularis;
    Molukse koningsparkiet=Alisterus amboinensis;
    Papoeakoningsparkiet=Alisterus chloropterus;
    Bergparkiet=Polytelis anthopeplus;
    Prinsesparkiet=Polytelis alexandrae;
    Barrabandparkiet=Polytelis swainsonii;
    Roodvleugelparkiet=Aprosmictus erythropterus;
    Port Lincolnparkiet=Barnardius zonarius;
    Barnardparkiet;
    Kakariki;
    Roodvoorhoofdkakariki=Cyanoramphus novaezelandiae;
    Geelvoorhoofdkakariki=Cyanoramphus auriceps;
    Malherbes kakariki=Cyanoramphus malherbi;
    Kea=Nestor notabilis;
    Kaka=Nestor meridionalis
  `);

  // ============================================================
  // KAKETOES
  // ============================================================

  vliegendeVogels(`
    Kaketoe=Cockatoo;
    Grote geelkuifkaketoe=Cacatua galerita;
    Kleine geelkuifkaketoe=Cacatua sulphurea;
    Molukkenkaketoe=Cacatua moluccensis;
    Witkuifkaketoe=Cacatua alba;
    Goffins kaketoe=Cacatua goffiniana;
    Ducorpskaketoe=Cacatua ducorpsii;
    Roze kaketoe=Eolophus roseicapilla;
    Inka-kaketoe=Lophochroa leadbeateri;
    Neuskaketoe=Cacatua tenuirostris;
    Kleine naaktoogkaketoe=Cacatua sanguinea;
    Grote naaktoogkaketoe=Cacatua pastinator;
    Filipijnse kaketoe=Cacatua haematuropygia;
    Palmkaketoe=Probosciger aterrimus;
    Roodstaartkaketoe=Calyptorhynchus banksii;
    Glanszwarte kaketoe=Calyptorhynchus lathami;
    Geelstaartkaketoe=Zanda funerea;
    Witstaartkaketoe=Zanda latirostris;
    Langsnavelraafkaketoe=Zanda baudinii
  `);

  // ============================================================
  // LORI'S
  // ============================================================

  vliegendeVogels(`
    Lori;
    Regenbooglori=Trichoglossus moluccanus;
    Lori van de blauwe bergen=Trichoglossus haematodus;
    Roodneklori=Trichoglossus rubritorquis;
    Groenneklori=Trichoglossus forsteni;
    Schubbenlori=Trichoglossus chlorolepidotus;
    Ornatenlori=Trichoglossus ornatus;
    Geelgroene lori=Trichoglossus flavoviridis;
    Irislori=Saudareos iris;
    Zwartkaplori=Lorius lory;
    Geelruglori=Lorius garrulus;
    Purperbuiklori=Lorius hypoinochrous;
    Witneklori=Lorius albidinucha;
    Geelbeflori=Lorius chlorocercus;
    Rode lori=Eos bornea;
    Blauwoorlori=Eos reticulata;
    Zwartvleugellori=Eos cyanogenia;
    Blau wstrepenlori=Eos semilarvata;
    Violetneklori=Eos squamata;
    Kardinaallori=Pseudeos cardinalis;
    Duyvenbodes lori=Chalcopsitta duivenbodei;
    Zwarte lori=Chalcopsitta atra;
    Geelgestreepte lori=Chalcopsitta scintillata;
    Muskuslori=Glossopsitta concinna;
    Kleine lori=Parvipsitta pusilla;
    Purperkroonlori=Parvipsitta porphyrocephala;
    Prachtlori=Charmosynopsis pulchella;
    Roodflanklori=Hypocharmosyna placentis;
    Roodkinklori=Vini rubrigularis;
    Blauwe lori=Vini peruviana;
    Ultramarijnlori=Vini ultramarina;
    Tahitilori=Vini kuhlii;
    Stephens lori=Vini stepheni;
    Gebande lori=Vini australis
  `);

  // ============================================================
  // AGA P O R N I S S E N
  // ============================================================

  vliegendeVogels(`
    Agapornis=Lovebird;
    Perzikkopagapornis=Agapornis roseicollis;
    Fischeragapornis=Agapornis fischeri;
    Zwartmaskeragapornis=Agapornis personatus;
    Zwartwangagapornis=Agapornis nigrigenis;
    Lilianes agapornis=Agapornis lilianae;
    Grijskopagapornis=Agapornis canus;
    Zwartvleugelagapornis=Agapornis taranta;
    Roodkopagapornis=Agapornis pullarius;
    Zwartkraagagapornis=Agapornis swindernianus
  `);

  // ============================================================
  // SPECHTEN
  // ============================================================

  vliegendeVogels(`
    Specht=Woodpecker;
    Grote bonte specht=Dendrocopos major;
    Middelste bonte specht=Dendrocoptes medius;
    Kleine bonte specht=Dryobates minor;
    Syrische bonte specht=Dendrocopos syriacus;
    Witrugspecht=Dendrocopos leucotos;
    Groene specht=Picus viridis;
    Iberische groene specht=Picus sharpei;
    Grijskopspecht=Picus canus;
    Zwarte specht=Dryocopus martius;
    Drieteenspecht=Picoides tridactylus;
    Noord-Amerikaanse drieteenspecht=Picoides dorsalis;
    Zwart rugspecht=Picoides arcticus;
    Draaihals=Jynx torquilla;
    Afrikaanse draaihals=Jynx ruficollis;
    Haarspecht=Leuconotopicus villosus;
    Donsspecht=Dryobates pubescens;
    Roodkopspecht=Melanerpes erythrocephalus;
    Roodbuikspecht=Melanerpes carolinus;
    Eikelspecht=Melanerpes formicivorus;
    Gilaspecht=Melanerpes uropygialis;
    Goudvoorhoofdspecht=Melanerpes aurifrons;
    Jamaicaspecht=Melanerpes radiolatus;
    Hispaniolaspecht=Melanerpes striatus;
    Puerto-Ricospecht=Melanerpes portoricensis;
    Guadeloupespecht=Melanerpes herminieri;
    Geelbuiksapspecht=Sphyrapicus varius;
    Roodborstsapspecht=Sphyrapicus ruber;
    Roodneksapspecht=Sphyrapicus nuchalis;
    Williamsons sapspecht=Sphyrapicus thyroideus;
    Helmspecht=Dryocopus pileatus;
    Gestreepte specht=Dryocopus lineatus;
    Magelhaenspecht=Campephilus magellanicus;
    Roodnekspecht=Campephilus rubricollis;
    Robuuste specht=Campephilus robustus;
    Guayaquilspecht=Campephilus gayaquilensis;
    Goudspecht=Colaptes auratus;
    Goudvleugelspecht=Colaptes chrysoides;
    Andesgrondspecht=Colaptes rupicola;
    Chileense grondspecht=Colaptes pitius;
    Afrikaanse grondspecht=Geocolaptes olivaceus;
    Kardinaalspecht=Dendropicos fuscescens;
    Grijze specht=Dendropicos goertae;
    Nubische specht=Campethera nubica;
    Goudstaartspecht=Campethera abingoni;
    Bengaalse specht=Dinopium benghalense;
    Zwartnekspecht=Picus chlorolophus;
    Bamboespecht=Gecinulus grantia;
    Hartvlekspecht=Hemicircus canente;
    Olijfspecht=Picus rubiginosus
  `, [15]);

  // ============================================================
  // ZWALUWEN EN GIERZWALUWEN
  // ============================================================

  vliegendeVogels(`
    Zwaluw=Swallow;
    Boerenzwaluw=Hirundo rustica;
    Huiszwaluw=Delichon urbicum;
    Oeverzwaluw=Riparia riparia;
    Rotszwaluw=Ptyonoprogne rupestris;
    Roodstuitzwaluw=Cecropis daurica;
    Amerikaanse klifzwaluw=Petrochelidon pyrrhonota;
    Holenzwaluw=Petrochelidon fulva;
    Boomzwaluw=Tachycineta bicolor;
    Violetgroene zwaluw=Tachycineta thalassina;
    Mangrovezwaluw=Tachycineta albilinea;
    Witvleugelzwaluw=Tachycineta albiventer;
    Chileense zwaluw=Tachycineta leucopyga;
    Purperzwaluw=Progne subis;
    Grijsborstzwaluw=Progne chalybea;
    Blauwe zwaluw=Hirundo atrocaerulea;
    Ethiopische zwaluw=Hirundo aethiopica;
    Angola-zwaluw=Hirundo angolensis;
    Witkeelzwaluw=Hirundo albigularis;
    Pare lborstzwaluw=Hirundo dimidiata;
    Welkomzwaluw=Hirundo neoxena;
    Tahitizwaluw=Hirundo tahitica;
    Zuid-Afrikaanse klifzwaluw=Petrochelidon spilodera;
    Gestreepte zwaluw=Cecropis abyssinica;
    Kleine gestreepte zwaluw=Cecropis cucullata;
    Maskerzwaluw=Riparia cincta;
    Grijskopzwaluw=Pseudhirundo griseopyga;
    Gierzwaluw=Apus apus;
    Vale gierzwaluw=Apus pallidus;
    Alpengierzwaluw=Tachymarptis melba;
    Afrikaanse gierzwaluw=Apus barbatus;
    Kaapse gierzwaluw;
    Kleine gierzwaluw=Apus affinis;
    Huisgierzwaluw=Apus nipalensis;
    Pacifische gierzwaluw=Apus pacificus;
    Witstuitgierzwaluw=Apus caffer;
    Horusgierzwaluw=Apus horus;
    Schout edens gierzwaluw=Apus schoutedeni;
    Schoorsteengierzwaluw=Chaetura pelagica;
    Vaux' gierzwaluw=Chaetura vauxi;
    Zwarte gierzwaluw=Cypseloides niger;
    Witkeelstekelstaartgierzwaluw=Hirundapus caudacutus;
    Bruinrugstekelstaartgierzwaluw=Hirundapus giganteus;
    Palmgierzwaluw=Cypsiurus parvus;
    Aziatische palmgierzwaluw=Cypsiurus balasiensis;
    Eetbaar-nestsalangaan=Aerodramus fuciphagus;
    Zwartnestsalangaan=Aerodramus maximus;
    Glanssalangaan=Collocalia esculenta;
    Reuzensalangaan=Hydrochous gigas
  `, [15]);

  // ============================================================
  // MEZEN
  // ============================================================

  vliegendeVogels(`
    Mees;
    Koolmees=Parus major;
    Pimpelmees=Cyanistes caeruleus;
    Azuurmees=Cyanistes cyanus;
    Zwarte mees=Periparus ater;
    Kuifmees=Lophophanes cristatus;
    Bruine mees=Poecile rufescens;
    Glanskop=Poecile palustris;
    Matkop=Poecile montanus;
    Siberische mees=Poecile cinctus;
    Zwartkopmees=Poecile atricapillus;
    Carolinamees=Poecile carolinensis;
    Bergmees=Poecile gambeli;
    Boreale mees=Poecile hudsonicus;
    Mexicaanse mees=Poecile sclateri;
    Rouwmees=Poecile lugubris;
    Japanse mees=Parus minor;
    Groene mees=Parus monticolus;
    Geelwangmees=Machlolophus spilonotus;
    Himalayamees=Machlolophus xanthogenys;
    Indiase geelmees=Machlolophus aplonotus;
    Geelbuikmees=Periparus venustulus;
    Roestbuikmees=Periparus rubidiventris;
    Taiwanese mees=Machlolophus holsti;
    Grijze kuifmees=Lophophanes dichrous;
    Tweekleurige mees=Baeolophus bicolor;
    Zwartkuifmees=Baeolophus atricristatus;
    Eikenmees=Baeolophus inornatus;
    Jeneverbesmees=Baeolophus ridgwayi;
    Zwartkopkuifmees=Baeolophus wollweberi;
    Staartmees=Aegithalos caudatus;
    Zwartkeelstaartmees=Aegithalos concinnus;
    Witwangstaartmees=Aegithalos leucogenys;
    Zilverkeelstaartmees=Aegithalos glaucogularis;
    Buidelmees=Remiz pendulinus;
    Chinese buidelmees=Remiz consobrinus;
    Witkruinbuidelmees=Remiz coronatus;
    Amerikaanse buidelmees=Auriparus flaviceps
  `);

  // ============================================================
  // MUSSEN
  // ============================================================

  vliegendeVogels(`
    Mus=Sparrow;
    Huismus=Passer domesticus;
    Ringmus=Passer montanus;
    Spaanse mus=Passer hispaniolensis;
    Italiaanse mus=Passer italiae;
    Indische mus=Passer indicus;
    Kaapse mus=Passer melanurus;
    Grijskopmus=Passer griseus;
    Papegaaimus=Passer gongonensis;
    Swainsons mus=Passer swainsonii;
    Woestijnmus=Passer simplex;
    Saxaulmus=Passer ammodendri;
    Sindmus=Passer pyrrhonotus;
    Gele mus=Passer luteus;
    Arabische goudmus=Passer euchlorus;
    Roodbruine mus=Passer cinnamomeus;
    Somalische mus=Passer castanopterus;
    Roestmus=Passer motitensis;
    Steenm us=Petronia petronia;
    Sneeuwvink=Montifringilla nivalis;
    Amerikaanse boommus=Spizelloides arborea;
    Witkeelgors=Zonotrichia albicollis;
    Witkruingors=Zonotrichia leucophrys;
    Goudkroongors=Zonotrichia atricapilla;
    Roodkraaggors=Zonotrichia capensis;
    Zangmus=Melospiza melodia;
    Moerasmus=Melospiza georgiana;
    Lincolns mus=Melospiza lincolnii;
    Savannahmus=Passerculus sandwichensis;
    Sprinkhaanmus=Ammodramus savannarum;
    Vosmus=Passerella iliaca;
    Veldgors=Spizella pusilla;
    Chipping sparrow=Spizella passerina;
    Kleigekleurde gors=Spizella pallida;
    Zwartkeelgors=Amphispiza bilineata;
    Donkerogige junco=Junco hyemalis
  `);

  // ============================================================
  // VINKEN
  // ============================================================

  vliegendeVogels(`
    Vink=Fringilla coelebs;
    Keep=Fringilla montifringilla;
    Blauwe vink=Fringilla teydea;
    Putter=Distelvink=Carduelis carduelis;
    Groenling=Chloris chloris;
    Chinese groenling=Chloris sinica;
    Himalayagroenling=Chloris spinoides;
    Sijs=Spinus spinus;
    Amerikaanse goudsijs=Spinus tristis;
    Dennensijs=Spinus pinus;
    Zwartkopsijs=Spinus notatus;
    Roodsijs=Spinus cucullatus;
    Mexicaanse sijs=Spinus psaltria;
    Kapucijnensijs=Spinus magellanicus;
    Kneu=Linaria cannabina;
    Frater=Linaria flavirostris;
    Barmsijs=Acanthis flammea;
    Kleine barmsijs=Acanthis cabaret;
    Witstuitbarmsijs=Acanthis hornemanni;
    Goudvink=Pyrrhula pyrrhula;
    Azorengoudvink=Pyrrhula murina;
    Bruine goudvink=Pyrrhula nipalensis;
    Haakbek=Pinicola enucleator;
    Appelvink=Coccothraustes coccothraustes;
    Avondappelvink=Hesperiphona vespertina;
    Kruisbek=Loxia curvirostra;
    Grote kruisbek=Loxia pytyopsittacus;
    Witbandkruisbek=Loxia leucoptera;
    Schotse kruisbek=Loxia scotica;
    Europese kanarie=Serinus serinus;
    Kanarie=Serinus canaria;
    Geelbuikkanarie=Crithagra flaviventris;
    Mozambiquesijs=Crithagra mozambica;
    Edelzanger=Crithagra leucopygia;
    Roodvoorhoofdkanarie=Serinus pusillus;
    Citroensijs=Carduelis citrinella;
    Corsicaanse citroensijs=Carduelis corsicana;
    Roodmus=Carpodacus erythrinus;
    Pallas' roodmus=Carpodacus roseus;
    Langstaartroodmus=Carpodacus sibiricus;
    Grote roodmus=Carpodacus rubicilla;
    Amerikaanse roodmus=Haemorhous purpureus;
    Huisvink=Haemorhous mexicanus;
    Cassins roodmus=Haemorhous cassinii;
    Trompetvink=Bucanetes githagineus;
    Mongoolse woestijnvink=Bucanetes mongolicus;
    Woestijnvink=Rhodospiza obsoleta;
    Roodvleugelwoestijnvink=Rhodopechys sanguineus
  `);

  // ============================================================
  // LIJSTERS EN MERELS
  // ============================================================

  vliegendeVogels(`
    Merel=Turdus merula;
    Beflijster=Turdus torquatus;
    Zanglijster=Turdus philomelos;
    Grote lijster=Turdus viscivorus;
    Koperwiek=Turdus iliacus;
    Kramsvogel=Turdus pilaris;
    Zwartkeellijster=Turdus atrogularis;
    Roodkeellijster=Turdus ruficollis;
    Bruine lijster=Turdus eunomus;
    Naumanns lijster=Turdus naumanni;
    Vale lijster=Turdus pallidus;
    Bleke lijster=Turdus obscurus;
    Japanse lijster=Turdus cardis;
    Japanse merel=Turdus chrysolaus;
    Chinese merel=Turdus mandarinus;
    Tibetaanse merel=Turdus maximus;
    Indische merel=Turdus simillimus;
    Grijze lijster=Turdus grayi;
    Amerikaanse roodborstlijster=Turdus migratorius;
    Roodbuiklijster=Turdus rufiventris;
    Afrikaanse lijster=Turdus pelios;
    Olijflijster=Turdus olivaceus;
    Karoolijster=Turdus smithi;
    Madagaskarlijster=Turdus madagascariensis;
    Australische grondlijster=Zoothera lunulata;
    Goudlijster=Zoothera aurea;
    Siberische lijster=Geokichla sibirica;
    Oranjekoplijster=Geokichla citrina;
    Bonte lijster=Geokichla guttata;
    Zwartoorlijster=Geokichla camaronensis;
    Abessijnse grondlijster=Geokichla piaggiae;
    Dwerglijster=Catharus ustulatus;
    Heremietlijster=Catharus guttatus;
    Veery=Catharus fuscescens;
    Grijswanglijster=Catharus minimus;
    Bicknells lijster=Catharus bicknelli;
    Boslijster=Hylocichla mustelina;
    Blauwe rotslijster=Monticola solitarius;
    Rode rotslijster=Monticola saxatilis;
    Kaapse rotslijster=Monticola rupestris;
    Witkeelrotslijster=Monticola gularis
  `);

  // ============================================================
  // SPREEUWEN
  // ============================================================

  vliegendeVogels(`
    Spreeuw=Sturnus vulgaris;
    Zwarte spreeuw=Sturnus unicolor;
    Roze spreeuw=Pastor roseus;
    Brahmaanse spreeuw=Sturnia pagodarum;
    Daurische spreeuw=Agropsar sturninus;
    Grijze spreeuw=Spodiopsar cineraceus;
    Zwartkraagspreeuw=Gracupica nigricollis;
    Bonte spreeuw=Gracupica contra;
    Bali-spreeuw=Leucopsar rothschildi;
    Treurmaina=Acridotheres tristis;
    Kuifmaina=Acridotheres cristatellus;
    Javaanse maina=Acridotheres javanicus;
    Oevermaina=Acridotheres ginginianus;
    Grote maina=Acridotheres grandis;
    Bosmaina=Acridotheres fuscus;
    Beo=Gracula religiosa;
    Sri Lankabeo=Gracula ptilogenys;
    Roodvleugelspreeuw=Onychognathus morio;
    Dunbekspreeuw=Onychognathus tenuirostris;
    Tristrams spreeuw=Onychognathus tristramii;
    Somalische spreeuw=Onychognathus blythii;
    Witbekspreeuw=Onychognathus albirostris;
    Roodschouderspreeuw=Lamprotornis nitens;
    Glansspreeuw;
    Blauwoorglansspreeuw=Lamprotornis chalybaeus;
    Kleine blauwoorglansspreeuw=Lamprotornis chloropterus;
    Purperglansspreeuw=Lamprotornis purpureus;
    Bronsstaartglansspreeuw=Lamprotornis chalcurus;
    Driekleurglansspreeuw=Lamprotornis superbus;
    Goudborstglansspreeuw=Lamprotornis regius;
    Fischers glansspreeuw=Lamprotornis fischeri;
    Hildebrandts glansspreeuw=Lamprotornis hildebrandti;
    Shelleys glansspreeuw=Lamprotornis shelleyi;
    Langstaartglansspreeuw=Lamprotornis caudatus;
    Meves' glansspreeuw=Lamprotornis mevesii;
    Burchells glansspreeuw=Lamprotornis australis;
    Violetstaartspreeuw;
    Amethistspreeuw=Cinnyricinclus leucogaster
  `);

  // ============================================================
  // IJSVOGELS
  // ============================================================

  vliegendeVogels(`
    IJsvogel=Alcedo atthis;
    Blauwoorijsvogel=Alcedo meninting;
    Kobaltijsvogel=Alcedo semitorquata;
    Menintingijsvogel;
    Azuurijsvogel=Ceyx azureus;
    Afrikaanse dwergijsvogel=Ispidina picta;
    Afrikaanse malachietijsvogel=Corythornis cristatus;
    Madagaskarmalachietijsvogel=Corythornis vintsioides;
    Zwartbekijsvogel=Pelargopsis capensis;
    Ooievaarsbekijsvogel;
    Bruinvleugelijsvogel=Pelargopsis amauroptera;
    Witkeelijsvogel=Halcyon smyrnensis;
    Zwartkapijsvogel=Halcyon pileata;
    Grijskopijsvogel=Halcyon leucocephala;
    Senegalijsvogel=Halcyon senegalensis;
    Bruinkapijsvogel=Halcyon albiventris;
    Gestreepte ijsvogel=Halcyon chelicuti;
    Mangroveijsvogel=Halcyon senegaloides;
    Blauwwitijsvogel=Todiramphus sanctus;
    Halsbandijsvogel=Todiramphus chloris;
    Nieuw-Zeelandse ijsvogel;
    Micronesische ijsvogel=Todiramphus cinnamominus;
    Guamijsvogel;
    Vanuatu-ijsvogel=Todiramphus farquhari;
    Heilige ijsvogel;
    Kookaburra;
    Lachvogel=Dacelo novaeguineae;
    Blauwvleugelkookaburra=Dacelo leachii;
    Roodbuikkookaburra=Dacelo gaudichaud;
    Kuifijsvogel=Megaceryle lugubris;
    Reuzenijsvogel=Megaceryle maxima;
    Amerikaanse ijsvogel=Megaceryle alcyon;
    Ringijsvogel=Megaceryle torquata;
    Bonte ijsvogel=Ceryle rudis;
    Groene ijsvogel=Chloroceryle americana;
    Amazoneijsvogel=Chloroceryle amazona;
    Groene dwergijsvogel=Chloroceryle aenea;
    Groen-rosse ijsvogel=Chloroceryle inda
  `, [17]);

  // ============================================================
  // BIJENETERS EN SCHARRELAARS
  // ============================================================

  vliegendeVogels(`
    Bijeneter=Merops apiaster;
    Groene bijeneter=Merops orientalis;
    Afrikaanse groene bijeneter=Merops viridissimus;
    Arabische groene bijeneter=Merops cyanophrys;
    Blauwstaartbijeneter=Merops philippinus;
    Blauwkeelbijeneter=Merops viridis;
    Regenboogbijeneter=Merops ornatus;
    Kleine bijeneter=Merops pusillus;
    Witvoorhoofdbijeneter=Merops bullockoides;
    Roodkeelbijeneter=Merops bulocki;
    Witkeelbijeneter=Merops albicollis;
    Zwartkopbijeneter=Merops breweri;
    Zwarte bijeneter=Merops gularis;
    Blauwe bijeneter=Merops muelleri;
    Blauwkoppige bijeneter=Merops mentalis;
    Karmijnrode bijeneter=Merops nubicus;
    Zuidelijke karmijnrode bijeneter=Merops nubicoides;
    Dwergbijeneter=Merops variegatus;
    Kaneelbijeneter=Merops leschenaulti;
    Perzische bijeneter=Merops persicus;
    Madagaskarbijeneter=Merops superciliosus;
    Zwaluwstaartbijeneter=Merops hirundineus;
    Bonte bijeneter=Meropogon forsteni;
    Scharrelaar=Coracias garrulus;
    Vorkstaartscharrelaar=Coracias caudatus;
    Indische scharrelaar=Coracias benghalensis;
    Indochinese scharrelaar=Coracias affinis;
    Roodkruinscharrelaar=Coracias naevius;
    Blauwbuikscharrelaar=Coracias cyanogaster;
    Raketstaartscharrelaar=Coracias spatulatus;
    Abessijnse scharrelaar=Coracias abyssinicus;
    Dollarvogel=Eurystomus orientalis;
    Breedbekscharrelaar=Eurystomus glaucurus;
    Blauwe scharrelaar=Eurystomus azureus
  `, [15]);

  // ============================================================
  // TOEKANS EN NEUSHOORNVOGELS
  // ============================================================

  vliegendeVogels(`
    Toekan=Toucan;
    Reuzentoekan=Ramphastos toco;
    Zwavelborsttoekan=Ramphastos sulfuratus;
    Witkeeltoekan=Ramphastos tucanus;
    Groefsnaveltoekan=Ramphastos vitellinus;
    Geelkeeltoekan=Ramphastos ambiguus;
    Roodborsttoekan=Ramphastos dicolorus;
    Chocotoekan=Ramphastos brevis;
    Pepervreter;
    Halsbandarassari=Pteroglossus torquatus;
    Zwartnekarassari=Pteroglossus aracari;
    Krulkruinarassari=Pteroglossus beauharnaisii;
    Ivoorsnavelarassari=Pteroglossus azara;
    Groen arassari=Pteroglossus viridis;
    Vuur snavelarassari=Pteroglossus frantzii;
    Letterarassari=Pteroglossus inscriptus;
    Bergtoekan=Andigena laminirostris;
    Grijsborstbergtoekan=Andigena hypoglauca;
    Zwartbekbergtoekan=Andigena nigrirostris;
    Smaragdtoekanet=Aulacorhynchus prasinus;
    Roodsnaveltoekanet=Aulacorhynchus haematopygus;
    Blauwbandtoekanet=Aulacorhynchus coeruleicinctis;
    Neushoornvogel=Hornbill;
    Dubbelhoornige neushoornvogel=Buceros bicornis;
    Gewone neushoornvogel=Buceros rhinoceros;
    Rosse neushoornvogel=Buceros hydrocorax;
    Helmneushoornvogel=Rhinoplax vigil;
    Bonte neushoornvogel=Anthracoceros albirostris;
    Zwarte neushoornvogel=Anthracoceros malayanus;
    Palawanneushoornvogel=Anthracoceros marchei;
    Malabarneushoornvogel=Anthracoceros coronatus;
    Jaarvogel=Rhyticeros undulatus;
    Papoeajaarvogel=Rhyticeros plicatus;
    Sulawesijaarvogel=Rhyticeros cassidix;
    Sumatraanse jaarvogel=Rhyticeros everetti;
    Witkruinneushoornvogel=Berenicornis comatus;
    Roodhalsneushoornvogel=Aceros nipalensis;
    Grijze tok=Tockus nasutus;
    Roodsnaveltok=Tockus erythrorhynchus;
    Zuidelijke geelsnaveltok=Tockus leucomelas;
    Noordelijke geelsnaveltok=Tockus flavirostris;
    Von der Deckens tok=Tockus deckeni;
    Monteirotok=Tockus monteiri;
    Damara-tok=Tockus damarensis;
    Witkuifneushoornvogel=Horizocerus albocristatus;
    Zwarte dwergtok=Horizocerus hartlaubi;
    Trompetneushoornvogel=Bycanistes bucinator;
    Zilverwangneushoornvogel=Bycanistes brevis;
    Zwart-witte neushoornvogel=Bycanistes subcylindricus;
    Witdijneushoornvogel=Bycanistes albotibialis;
    Zuidelijke hoornraaf=Bucorvus leadbeateri;
    Noordelijke hoornraaf=Bucorvus abyssinicus
  `);

  // ============================================================
  // EXTRA KOPPELINGEN EN CORRECTIES
  // ============================================================

  samenvoegen("Gaai", "Vlaamse gaai");
  samenvoegen("Gurneys arend", "Molukse arend");
  samenvoegen("Australische kerkuil", "Oostelijke kerkuil");
  samenvoegen("Wespendief", "Afrikaanse wespendief");
  samenvoegen("Smaragdduif", "Groenvleugelduif");
  samenvoegen("Blauwoorijsvogel", "Menintingijsvogel");
  samenvoegen("Zwartbekijsvogel", "Ooievaarsbekijsvogel");
  samenvoegen("Micronesische ijsvogel", "Guamijsvogel");
  samenvoegen("Blauwwitijsvogel", "Heilige ijsvogel");
  samenvoegen("Blauwwitijsvogel", "Nieuw-Zeelandse ijsvogel");
  samenvoegen("Australische gierzwaluw", "Pacifische gierzwaluw");

  verwijderDier("Taigaboomkraai");
  verwijderDier("Violetstaartspreeuw");
  verwijderDier("Nieuw-Guinese boomvalk");

  // Bekende soorten die in Nederland in het wild leven.

  koppelDieren(`
    Wilde eend;
    Meerkoet;
    Waterhoen;
    Knobbelzwaan;
    Grauwe gans;
    Aalscholver;
    Fuut;
    Dodaars;
    Buizerd;
    Havik;
    Sperwer;
    Torenvalk;
    Slechtvalk;
    Boomvalk;
    Smelleken;
    Kerkuil;
    Bosuil;
    Steenuil;
    Ransuil;
    Velduil;
    Oehoe;
    Zwarte kraai;
    Roek;
    Raaf;
    Kauw;
    Ekster;
    Gaai;
    Houtduif;
    Holenduif;
    Turkse tortel;
    Halsbandparkiet;
    Grote bonte specht;
    Middelste bonte specht;
    Kleine bonte specht;
    Groene specht;
    Zwarte specht;
    Boerenzwaluw;
    Huiszwaluw;
    Oeverzwaluw;
    Gierzwaluw;
    Koolmees;
    Pimpelmees;
    Kuifmees;
    Zwarte mees;
    Glanskop;
    Matkop;
    Staartmees;
    Huismus;
    Ringmus;
    Vink;
    Keep;
    Putter;
    Groenling;
    Sijs;
    Kneu;
    Goudvink;
    Appelvink;
    Merel;
    Zanglijster;
    Grote lijster;
    Koperwiek;
    Kramsvogel;
    Spreeuw;
    IJsvogel
  `, [26]);

  // Bekende vogels die mensen als huisdier houden.

  koppelDieren(`
    Grasparkiet;
    Valkparkiet;
    Kanarie;
    Grijze roodstaartpapegaai;
    Timnehpapegaai;
    Bonte boer;
    Blauwgele ara;
    Geelvleugelara;
    Groenvleugelara;
    Edelpapegaai;
    Grote geelkuifkaketoe;
    Kleine geelkuifkaketoe;
    Witkuifkaketoe;
    Roze kaketoe;
    Goffins kaketoe;
    Perzikkopagapornis;
    Fischeragapornis;
    Zwartmaskeragapornis;
    Agapornis;
    Halsbandparkiet;
    Bourkeparkiet;
    Turkooisparkiet;
    Splendidparkiet;
    Prachtrosella;
    Pennantrosella;
    Zonparkiet;
    Groenwangparkiet;
    Monniksparkiet;
    Diamantduif;
    Lachduif
  `, [8]);

  // Nachtactieve uilen.

  koppelDieren(`
    Kerkuil;
    Amerikaanse kerkuil;
    Oostelijke kerkuil;
    Bosuil;
    Oeraluil;
    Oehoe;
    Amerikaanse oehoe;
    Kaapse oehoe;
    Farao-oehoe;
    Ransuil;
    Steenuil;
    Ruigpootuil;
    Zaaguil;
    Dwergooruil;
    Afrikaanse dwergooruil;
    Indische dwergooruil;
    Japanse dwergooruil;
    Oosterse dwergooruil;
    Briluil;
    Bruine visuil;
    Maleise visuil;
    Australische boeboekuil;
    Nieuw-Zeelandse boeboekuil;
    Machtige boeboekuil;
    Blaffende boeboekuil
  `, [27]);

  // Vogels met opvallende kleuren.

  koppelDieren(`
    Blauwgele ara;
    Geelvleugelara;
    Groenvleugelara;
    Hyacintara;
    Zonparkiet;
    Goudparkiet;
    Regenbooglori;
    Rode lori;
    Zwartkaplori;
    Edelpapegaai;
    Prachtrosella;
    Pennantrosella;
    Splendidparkiet;
    Roze kaketoe;
    Pimpelmees;
    Putter;
    Goudvink;
    IJsvogel;
    Azuurijsvogel;
    Bijeneter;
    Regenboogbijeneter;
    Karmijnrode bijeneter;
    Vorkstaartscharrelaar;
    Scharrelaar;
    Reuzentoekan;
    Zwavelborsttoekan;
    Driekleurglansspreeuw;
    Goudborstglansspreeuw;
    Blauwe gaai;
    Roodsnavelekster;
    Victoria kroonduif
  `, [47]);

  // Herkenbare vogels met strepen.

  koppelDieren(`
    Zeb raduif;
    Gestreepte bosuil;
    Gestreepte ransuil;
    Gestreepte caracara;
    Gestreepte zwaluw;
    Kleine gestreepte zwaluw;
    Gestreepte ijsvogel;
    Gestreepte specht;
    Grasparkiet;
    Zanglijster
  `, [48]);

  // Vogels met stippen of vlekken.

  koppelDieren(`
    Spreeuw;
    Zanglijster;
    Grote lijster;
    Koperwiek;
    Gevlekte bosuil;
    Gevlekte oehoe;
    Sneeuwuil;
    Kerkuil;
    Steenuil;
    Diamantduif;
    Grote bonte specht;
    Middelste bonte specht;
    Kleine bonte specht
  `, [49]);

  // ============================================================
  // TUSSENTIJDSE CONTROLE
  // ============================================================

  const samengevoegdeVogels =
    controleerDubbeleDieren();

  console.log(
    "QuizBallon V9 - extra samengevoegde dieren:",
    samengevoegdeVogels
  );

  console.table(
    vragen.map((tekst, index) => {
      const aantal = aantalAntwoorden(index + 1);

      return {
        nummer: index + 1,
        vraag: tekst,
        antwoorden: aantal,
        raketten: aantalRaketten(aantal),
        streefaantal: 1000,
        ontbrekend: Math.max(0, 1000 - aantal)
      };
    })
  );

  // ============================================================
  // EINDE DEEL 3
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 4
  // VLIEGENDE DIEREN - VERVOLG
  // ============================================================

  // ============================================================
  // ALGEMENE BEKENDE DIERNAMEN
  // ============================================================

  groep(`
    Vogel;
    Parkiet;
    Lijster;
    Roofvogel;
    Zangvogel;
    Meeuw;
    Vleermuis
  `, [2, 50]);

  // ============================================================
  // BEKENDE NEDERLANDSE ZANGVOGELS
  // ============================================================

  vliegendeVogels(`
    Roodborst=Erithacus rubecula;
    Winterkoning=Troglodytes troglodytes;
    Heggenmus=Prunella modularis;
    Boomklever=Sitta europaea;
    Boomkruiper=Certhia brachydactyla;
    Taigaboomkruiper=Certhia familiaris;
    Goudhaan=Regulus regulus;
    Vuurgoudhaan=Regulus ignicapilla;
    Tjiftjaf=Phylloscopus collybita;
    Fitis=Phylloscopus trochilus;
    Fluiter=Phylloscopus sibilatrix;
    Zwartkop=Sylvia atricapilla;
    Tuinfluiter=Sylvia borin;
    Grasmus=Curruca communis;
    Braamsluiper=Curruca curruca;
    Nachtegaal=Luscinia megarhynchos;
    Noordse nachtegaal=Luscinia luscinia;
    Blauwborst=Luscinia svecica;
    Zwarte roodstaart=Phoenicurus ochruros;
    Gekraagde roodstaart=Phoenicurus phoenicurus;
    Roodborsttapuit=Saxicola rubicola;
    Paapje=Saxicola rubetra;
    Tapuit=Oenanthe oenanthe;
    Bonte vliegenvanger=Ficedula hypoleuca;
    Grauwe vliegenvanger=Muscicapa striata;
    Kleine vliegenvanger=Ficedula parva;
    Withalsvliegenvanger=Ficedula albicollis;
    Gele kwikstaart=Motacilla flava;
    Witte kwikstaart=Motacilla alba;
    Grote gele kwikstaart=Motacilla cinerea;
    Graspieper=Anthus pratensis;
    Boompieper=Anthus trivialis;
    Waterpieper=Anthus spinoletta;
    Oeverpieper=Anthus petrosus;
    Duinpieper=Anthus campestris;
    Rietgors=Emberiza schoeniclus;
    Geelgors=Emberiza citrinella;
    Grauwe gors=Emberiza calandra;
    Ortolaan=Emberiza hortulana;
    Cirlgors=Emberiza cirlus;
    Buidelmees;
    Baardman=Panurus biarmicus;
    Wielewaal=Oriolus oriolus;
    Pestvogel=Bombycilla garrulus;
    Waterrietzanger=Acrocephalus paludicola;
    Rietzanger=Acrocephalus schoenobaenus;
    Kleine karekiet=Acrocephalus scirpaceus;
    Grote karekiet=Acrocephalus arundinaceus;
    Bosrietzanger=Acrocephalus palustris;
    Spotvogel=Hippolais icterina;
    Sprinkhaanzanger=Locustella naevia;
    Snor=Locustella luscinioides;
    Cettis zanger=Cettia cetti;
    Graszanger=Cisticola juncidis
  `);

  // ============================================================
  // LEEUWERIKEN
  // ============================================================

  vliegendeVogels(`
    Leeuwerik;
    Veldleeuwerik=Alauda arvensis;
    Boomleeuwerik=Lullula arborea;
    Kuifleeuwerik=Galerida cristata;
    Theklaleeuwerik=Galerida theklae;
    Strandleeuwerik=Eremophila alpestris;
    Kortteenleeuwerik=Calandrella brachydactyla;
    Kalanderleeuwerik=Melanocorypha calandra;
    Bergkalanderleeuwerik=Melanocorypha bimaculata;
    Zwarte leeuwerik=Melanocorypha yeltoniensis;
    Witvleugelleeuwerik=Alauda leucoptera;
    Woestijnleeuwerik=Ammomanes deserti;
    Roodstaartleeuwerik=Ammomanes phoenicura;
    Zwartstaartleeuwerik=Ammomanes cinctura;
    Javaanse leeuwerik=Mirafra javanica;
    Indische leeuwerik=Mirafra erythroptera;
    Bengaalse leeuwerik=Mirafra assamica;
    Zangleeuwerik=Mirafra cantillans;
    Kaapse langbekleeuwerik=Certhilauda curvirostris;
    Roodkapleeuwerik=Calandrella cinerea;
    Grijze leeuwerik=Spizocorys conirostris
  `);

  // ============================================================
  // KOLIBRIES
  // ============================================================

  vliegendeVogels(`
    Kolibrie=Hummingbird;
    Reuzenkolibrie=Patagona gigas;
    Bijkolibrie=Mellisuga helenae;
    Dwergkolibrie=Mellisuga minima;
    Robijnkeelkolibrie=Archilochus colubris;
    Zwartkinkolibrie=Archilochus alexandri;
    Annakolibrie=Calypte anna;
    Costakolibrie=Calypte costae;
    Rosse kolibrie=Selasphorus rufus;
    Allens kolibrie=Selasphorus sasin;
    Breedstaartkolibrie=Selasphorus platycercus;
    Calliopekolibrie=Selasphorus calliope;
    Breedbekkolibrie=Cynanthus latirostris;
    Witnekkolibrie=Florisuga mellivora;
    Zwarte jacobijn=Florisuga fusca;
    Zwaardbekkolibrie=Ensifera ensifera;
    Sabelvleugelkolibrie;
    Violette sabelvleugel=Campylopterus hemileucurus;
    Bruine sabelvleugel=Campylopterus largipennis;
    Witstaartkolibrie=Eupherusa poliocerca;
    Violette oorkolibrie=Colibri coruscans;
    Bruine oorkolibrie=Colibri delphinae;
    Groene oorkolibrie=Colibri thalassinus;
    Witbuiksmaragdkolibrie=Chlorestes candida;
    Blauwe smaragdkolibrie=Chlorestes notata;
    Koperstaartkolibrie=Saucerottia cupreicauda;
    Amazilia;
    Kaneelkolibrie=Amazilia rutila;
    Groene kroonkolibrie=Heliodoxa jacula;
    Briljantkolibrie=Heliodoxa;
    Zwartfluweelkolibrie;
    Robijntopkolibrie=Chrysolampis mosquitus;
    Zwartkuifkoketkolibrie=Lophornis helenae;
    Prachtkoketkolibrie=Lophornis magnificus;
    Roodkuifkoketkolibrie=Lophornis delattrei;
    Gehoornde kolibrie=Heliactin bilophus;
    Langstaartsylf=Aglaiocercus kingii;
    Violetstaartsylf=Aglaiocercus coelestis;
    Zwartstaarttreinkolibrie=Lesbia victoriae;
    Groenstaarttreinkolibrie=Lesbia nuna;
    Loddigeskolibrie=Loddigesia mirabilis;
    Vlagstaartkolibrie=Ocreatus underwoodii;
    Goudstaartsaffier=Chrysuronia oenone;
    Blauwsaffierkolibrie=Hylocharis cyanus;
    Robijnsaffier=Chrysuronia rubricauda;
    Topaaskolibrie=Topaza pella;
    Vuurstaarttopaaskolibrie=Topaza pyra;
    Zwartkeelmangokolibrie=Anthracothorax nigricollis;
    Groenkeelmangokolibrie=Anthracothorax viridigula;
    Jamaicamango=Anthracothorax mango;
    Purperkeelkolibrie=Eulampis jugularis;
    Groenkeelkolibrie=Eulampis holosericeus
  `);

  // ============================================================
  // REIGERS EN ROERDOMPEN
  // ============================================================

  vliegendeVogels(`
    Reiger;
    Blauwe reiger=Ardea cinerea;
    Purperreiger=Ardea purpurea;
    Grote zilverreiger=Ardea alba;
    Kleine zilverreiger=Egretta garzetta;
    Koereiger=Bubulcus ibis;
    Ralreiger=Ardeola ralloides;
    Kwak=Nycticorax nycticorax;
    Roerdomp=Botaurus stellaris;
    Woudaap=Ixobrychus minutus;
    Grote blauwe reiger=Ardea herodias;
    Zwarthalsreiger=Ardea melanocephala;
    Zwartkopreiger;
    Goliathreiger=Ardea goliath;
    Madagaskarreiger=Ardea humbloti;
    Wittebuikreiger=Ardea insignis;
    Australische reiger=Ardea pacifica;
    Grijze rifreiger=Egretta sacra;
    Westelijke rifreiger=Egretta gularis;
    Driekleurige reiger=Egretta tricolor;
    Kleine blauwe reiger=Egretta caerulea;
    Sneeuwreiger=Egretta thula;
    Roodhalsreiger=Egretta rufescens;
    Zwarte reiger=Egretta ardesiaca;
    Witwangreiger=Egretta novaehollandiae;
    Groene reiger=Butorides virescens;
    Mangrovereiger=Butorides striata;
    Geelkruinkwak=Nyctanassa violacea;
    Rosse kwak=Nycticorax caledonicus;
    Japanse kwak=Gorsachius goisagi;
    Maleise nachtreiger=Gorsachius melanolophus;
    Chinese ralreiger=Ardeola bacchus;
    Indische ralreiger=Ardeola grayii;
    Javaanse ralreiger=Ardeola speciosa;
    Madagaskarralreiger=Ardeola idae;
    Amerikaanse roerdomp=Botaurus lentiginosus;
    Australische roerdomp=Botaurus poiciloptilus;
    Zuid-Amerikaanse roerdomp=Botaurus pinnatus;
    Chinese woudaap=Ixobrychus sinensis;
    Kaneelwoudaap=Ixobrychus cinnamomeus;
    Zwarte woudaap=Ixobrychus flavicollis;
    Amerikaanse woudaap=Ixobrychus exilis;
    Afrikaanse woudaap=Ixobrychus sturmii;
    Agamireiger=Agamia agami;
    Schuitbekreiger=Cochlearius cochlearius;
    Tijgerreiger;
    Rosse tijgerreiger=Tigrisoma lineatum;
    Gestreepte tijgerreiger=Tigrisoma fasciatum
  `, [17]);

  // ============================================================
  // OOIEVAARS
  // ============================================================

  vliegendeVogels(`
    Ooievaar=Ciconia ciconia;
    Zwarte ooievaar=Ciconia nigra;
    Oosterse ooievaar=Ciconia boyciana;
    Zwarthalsooievaar=Ephippiorhynchus asiaticus;
    Zadelbekooievaar=Ephippiorhynchus senegalensis;
    Magoe ari-ooievaar=Ciconia maguari;
    Bisschopsooievaar=Ciconia episcopus;
    Abdimooievaar=Ciconia abdimii;
    Maleise ooievaar=Ciconia stormi;
    Maraboe=Leptoptilos crumenifer;
    Indische maraboe=Leptoptilos dubius;
    Kleine maraboe=Leptoptilos javanicus;
    Nimmerzat=Mycteria ibis;
    Amerikaanse nimmerzat=Mycteria americana;
    Indische nimmerzat=Mycteria leucocephala;
    Maleise nimmerzat=Mycteria cinerea;
    Afrikaanse gaper=Anastomus lamelligerus;
    Indische gaper=Anastomus oscitans;
    Jabiroe=Jabiru mycteria
  `, [17]);

  // ============================================================
  // IBISSEN EN LEPELAARS
  // ============================================================

  vliegendeVogels(`
    Ibis;
    Heilige ibis=Threskiornis aethiopicus;
    Australische witte ibis=Threskiornis molucca;
    Zwartkopibis=Threskiornis melanocephalus;
    Stro halsibis=Threskiornis spinicollis;
    Rode ibis=Eudocimus ruber;
    Witte ibis=Eudocimus albus;
    Zwarte ibis=Plegadis falcinellus;
    Witmaskeribis=Plegadis chihi;
    Puna-ibis=Plegadis ridgwayi;
    Hadada-ibis=Bostrychia hagedash;
    Kaapse ibis=Geronticus calvus;
    Heremietibis=Geronticus eremita;
    Japanse kuifibis=Nipponia nippon;
    Reuzenibis=Thaumatibis gigantea;
    Wit schouderibis=Pseudibis davisoni;
    Zwarte roodnekibis=Pseudibis papillosa;
    Groene ibis=Mesembrinibis cayennensis;
    Schreeuwibis=Theristicus caudatus;
    Zwartmaskeribis=Theristicus melanopis;
    Lepelaar=Platalea leucorodia;
    Afrikaanse lepelaar=Platalea alba;
    Kleine lepelaar=Platalea minor;
    Australische lepelaar=Platalea regia;
    Geelsnavellepelaar=Platalea flavipes;
    Roze lepelaar=Platalea ajaja
  `);

  // ============================================================
  // FLAMINGO'S
  // ============================================================

  vliegendeVogels(`
    Flamingo;
    Grote flamingo=Phoenicopterus roseus;
    Rode flamingo=Phoenicopterus ruber;
    Chileense flamingo=Phoenicopterus chilensis;
    Kleine flamingo=Phoeniconaias minor;
    Andesflamingo=Phoenicoparrus andinus;
    Jamesflamingo=Phoenicoparrus jamesi
  `, [36, 40, 47]);

  // ============================================================
  // KRAANVOGELS
  // ============================================================

  vliegendeVogels(`
    Kraanvogel=Grus grus;
    Canadese kraanvogel=Antigone canadensis;
    Saruskraanvogel=Antigone antigone;
    Brolgakraanvogel=Antigone rubicunda;
    Witnekkraanvogel=Antigone vipio;
    Siberische kraanvogel=Leucogeranus leucogeranus;
    Japanse kraanvogel=Grus japonensis;
    Zwart nekkraanvogel=Grus nigricollis;
    Monnikskraanvogel=Grus monacha;
    Trompetkraanvogel=Grus americana;
    Jufferkraanvogel=Anthropoides virgo;
    Paradijskraanvogel=Anthropoides paradiseus;
    Lelkraanvogel=Bugeranus carunculatus;
    Grijze kroonkraanvogel=Balearica regulorum;
    Zwarte kroonkraanvogel=Balearica pavonina
  `, [36]);

  // ============================================================
  // MEEUWEN
  // ============================================================

  vliegendeVogels(`
    Meeuw=Gull;
    Kokmeeuw=Chroicocephalus ridibundus;
    Zilvermeeuw=Larus argentatus;
    Stormmeeuw=Larus canus;
    Grote mantelmeeuw=Larus marinus;
    Kleine mantelmeeuw=Larus fuscus;
    Geelpootmeeuw=Larus michahellis;
    Pontische meeuw=Larus cachinnans;
    Zwartkopmeeuw=Ichthyaetus melanocephalus;
    Dwergmeeuw=Hydrocoloeus minutus;
    Drieteenmeeuw=Rissa tridactyla;
    Ivoormeeuw=Pagophila eburnea;
    Grote burgemeester=Larus hyperboreus;
    Kleine burgemeester=Larus glaucoides;
    Ringsnavelmeeuw=Larus delawarensis;
    Amerikaanse zilvermeeuw=Larus smithsonianus;
    Californische meeuw=Larus californicus;
    Pacifische meeuw=Larus pacificus;
    Australische zilvermeeuw=Chroicocephalus novaehollandiae;
    Reuzenzwartkopmeeuw=Ichthyaetus ichthyaetus;
    Audouins meeuw=Ichthyaetus audouinii;
    Dunbekmeeuw=Chroicocephalus genei;
    Bruinkopmeeuw=Chroicocephalus brunnicephalus;
    Grijskopmeeuw=Chroicocephalus cirrocephalus;
    Andeskokmeeuw=Chroicocephalus serranus;
    Bonapartes meeuw=Chroicocephalus philadelphia;
    Franklins meeuw=Leucophaeus pipixcan;
    Lachmeeuw=Leucophaeus atricilla;
    Dolfijnmeeuw=Leucophaeus scoresbii;
    Grijze meeuw=Leucophaeus modestus;
    Lava meeuw=Leucophaeus fuliginosus;
    Vorkstaartmeeuw=Xema sabini;
    Ross' meeuw=Rhodostethia rosea;
    Zwaluwstaartmeeuw=Creagrus furcatus;
    Roodpootdrieteenmeeuw=Rissa brevirostris;
    Kelpmeeuw=Larus dominicanus;
    Westelijke meeuw=Larus occidentalis;
    Beringmeeuw=Larus glaucescens;
    Heermanns meeuw=Larus heermanni;
    Olrogs meeuw=Larus atlanticus
  `);

  // ============================================================
  // STERNS
  // ============================================================

  vliegendeVogels(`
    Stern;
    Visdief=Sterna hirundo;
    Noordse stern=Sterna paradisaea;
    Grote stern=Thalasseus sandvicensis;
    Dwergstern=Sternula albifrons;
    Reuzenstern=Hydroprogne caspia;
    Zwarte stern=Chlidonias niger;
    Witvleugelstern=Chlidonias leucopterus;
    Witwangstern=Chlidonias hybrida;
    Lachstern=Gelochelidon nilotica;
    Dougalls stern=Sterna dougallii;
    Bonte stern=Onychoprion fuscatus;
    Brilstern=Onychoprion anaethetus;
    Zwartnekstern=Sterna sumatrana;
    Rivierstern=Sterna aurantia;
    Forsters stern=Sterna forsteri;
    Incastern=Larosterna inca;
    Koningsstern=Thalasseus maximus;
    Bengaalse stern=Thalasseus bengalensis;
    Grote kuifstern=Thalasseus bergii;
    Sierlijke stern=Thalasseus elegans;
    Antarctische stern=Sterna vittata;
    Zuid-Amerikaanse stern=Sterna hirundinacea;
    Australische dwergstern=Sternula nereis;
    Amerikaanse dwergstern=Sternula antillarum;
    Peru-stern=Sternula lorata;
    Bruine noddy=Anous stolidus;
    Zwarte noddy=Anous minutus;
    Witte stern=Gygis alba;
    Afrikaanse schaarbek=Rynchops flavirostris;
    Amerikaanse schaarbek=Rynchops niger;
    Indische schaarbek=Rynchops albicollis
  `, [17]);

  // ============================================================
  // ALBATROSSEN EN STORMVOGELS
  // ============================================================

  vliegendeVogels(`
    Albatros;
    Reuzenalbatros=Diomedea exulans;
    Koningsalbatros=Diomedea epomophora;
    Noordelijke koningsalbatros=Diomedea sanfordi;
    Zwart wenkbrauwalbatros=Thalassarche melanophris;
    Grijskopalbatros=Thalassarche chrysostoma;
    Wenkbrauwalbatros;
    Geelneusalbatros=Thalassarche chlororhynchos;
    Indische geelneusalbatros=Thalassarche carteri;
    Witkapalbatros=Thalassarche cauta;
    Chathamalbatros=Thalassarche eremita;
    Bullers albatros=Thalassarche bulleri;
    Roetalbatros=Phoebetria fusca;
    Lichtmantelalbatros=Phoebetria palpebrata;
    Laysanalbatros=Phoebastria immutabilis;
    Zwartvoetalbatros=Phoebastria nigripes;
    Kortstaartalbatros=Phoebastria albatrus;
    Galapagosalbatros=Phoebastria irrorata;
    Stormvogel;
    Noordse stormvogel=Fulmarus glacialis;
    Zuidelijke stormvogel=Fulmarus glacialoides;
    Zuidelijke reuzenstormvogel=Macronectes giganteus;
    Noordelijke reuzenstormvogel=Macronectes halli;
    Kaapse stormvogel=Daption capense;
    Sneeuwstormvogel=Pagodroma nivea;
    Antarctische stormvogel=Thalassoica antarctica;
    Blauwe stormvogel=Halobaena caerulea;
    Dunbekprion=Pachyptila belcheri;
    Antarctische prion=Pachyptila desolata;
    Breedbekprion=Pachyptila vittata;
    Kuhls pijlstormvogel=Calonectris borealis;
    Scopolis pijlstormvogel=Calonectris diomedea;
    Noordse pijlstormvogel=Puffinus puffinus;
    Grauwe pijlstormvogel=Ardenna grisea;
    Dunbekpijlstormvogel=Ardenna tenuirostris;
    Grote pijlstormvogel=Ardenna gravis;
    Wigstaartpijlstormvogel=Ardenna pacifica;
    Balearische pijlstormvogel=Puffinus mauretanicus;
    Yelkouanpijlstormvogel=Puffinus yelkouan;
    Kleine pijlstormvogel=Puffinus assimilis;
    Audubons pijlstormvogel=Puffinus lherminieri;
    Stormvogeltje=Hydrobates pelagicus;
    Vaalt stormvogeltje=Hydrobates leucorhous;
    Wilsons stormvogeltje=Oceanites oceanicus;
    Bont stormvogeltje=Pelagodroma marina;
    Zwartbuikstormvogeltje=Fregetta tropica;
    Witbuikstormvogeltje=Fregetta grallaria
  `);

  // ============================================================
  // JAN-VAN-GENTEN EN FREGATVOGELS
  // ============================================================

  vliegendeVogels(`
    Jan-van-gent=Morus bassanus;
    Kaapse jan-van-gent=Morus capensis;
    Australische jan-van-gent=Morus serrator;
    Blauwvoetgent=Sula nebouxii;
    Roodpootgent=Sula sula;
    Bruine gent=Sula leucogaster;
    Maskergent=Sula dactylatra;
    Nazcagent=Sula granti;
    Peruaanse gent=Sula variegata;
    Fregatvogel;
    Grote fregatvogel=Fregata minor;
    Prachtfregatvogel=Fregata magnificens;
    Kleine fregatvogel=Fregata ariel;
    Ascensionfregatvogel=Fregata aquila;
    Kerst eilandfregatvogel=Fregata andrewsi;
    Roodsnavelkeerkringvogel=Phaethon aethereus;
    Witstaartkeerkringvogel=Phaethon lepturus;
    Roodstaartkeerkringvogel=Phaethon rubricauda
  `, [17]);

  // ============================================================
  // STELTLOPERS
  // ============================================================

  vliegendeVogels(`
    Scholekster=Haematopus ostralegus;
    Amerikaanse scholekster=Haematopus palliatus;
    Zwarte scholekster=Haematopus bachmani;
    Afrikaanse scholekster=Haematopus moquini;
    Kluut=Recurvirostra avosetta;
    Amerikaanse kluut=Recurvirostra americana;
    Australische kluut=Recurvirostra novaehollandiae;
    Andeskluut=Recurvirostra andina;
    Steltkluut=Himantopus himantopus;
    Zwarte steltkluut=Himantopus novaezelandiae;
    Kievit=Vanellus vanellus;
    Zilverplevier=Pluvialis squatarola;
    Goudplevier=Pluvialis apricaria;
    Amerikaanse goudplevier=Pluvialis dominica;
    Aziatische goudplevier=Pluvialis fulva;
    Bontbekplevier=Charadrius hiaticula;
    Kleine plevier=Charadrius dubius;
    Strandplevier=Anarhynchus alexandrinus;
    Morinelplevier=Eudromias morinellus;
    Grutto=Limosa limosa;
    Rosse grutto=Limosa lapponica;
    Marmergrutto=Limosa fedoa;
    Hudsonse grutto=Limosa haemastica;
    Wulp=Numenius arquata;
    Regenwulp=Numenius phaeopus;
    Amerikaanse wulp=Numenius americanus;
    Siberische wulp=Numenius madagascariensis;
    Kleine wulp=Numenius minutus;
    Tureluur=Tringa totanus;
    Zwarte ruiter=Tringa erythropus;
    Groenpootruiter=Tringa nebularia;
    Poelruiter=Tringa stagnatilis;
    Bosruiter=Tringa glareola;
    Witgat=Tringa ochropus;
    Oeverloper=Actitis hypoleucos;
    Amerikaanse oeverloper=Actitis macularius;
    Grote geelpootruiter=Tringa melanoleuca;
    Kleine geelpootruiter=Tringa flavipes;
    Willet=Tringa semipalmata;
    Kanoet=Calidris canutus;
    Bonte strandloper=Calidris alpina;
    Drieteenstrandloper=Calidris alba;
    Kleine strandloper=Calidris minuta;
    Temmincks strandloper=Calidris temminckii;
    Krombekstrandloper=Calidris ferruginea;
    Paarse strandloper=Calidris maritima;
    Bairds strandloper=Calidris bairdii;
    Gestreepte strandloper=Calidris melanotos;
    Breedbekstrandloper=Calidris falcinellus;
    Steltstrandloper=Calidris himantopus;
    Alaskastrandloper=Calidris mauri;
    Kleinste strandloper=Calidris minutilla;
    Kemphaan=Calidris pugnax;
    Steenloper=Arenaria interpres;
    Zwarte steenloper=Arenaria melanocephala;
    Watersnip=Gallinago gallinago;
    Poelsnip=Gallinago media;
    Bokje=Lymnocryptes minimus;
    Houtsnip=Scolopax rusticola;
    Amerikaanse houtsnip=Scolopax minor;
    Franjepoot;
    Rosse franjepoot=Phalaropus fulicarius;
    Grauwe franjepoot=Phalaropus lobatus;
    Grote franjepoot=Phalaropus tricolor;
    Griel=Burhinus oedicnemus;
    Senegalese griel=Burhinus senegalensis;
    Australische griel=Burhinus grallarius
  `);

  // ============================================================
  // KOEKOEKEN
  // ============================================================

  vliegendeVogels(`
    Koekoek=Cuculus canorus;
    Oosterse koekoek=Cuculus optatus;
    Afrikaanse koekoek=Cuculus gularis;
    Kleine koekoek=Cuculus poliocephalus;
    Indische koekoek=Cuculus micropterus;
    Himalayakoekoek=Cuculus saturatus;
    Madagaskarkoekoek=Cuculus rochii;
    Kuifkoekoek=Clamator glandarius;
    Bonte kuifkoekoek=Clamator jacobinus;
    Levail lants koekoek=Clamator levaillantii;
    Gestreepte koekoek=Tapera naevia;
    Geelsnavelkoekoek=Coccyzus americanus;
    Zwartsnavelkoekoek=Coccyzus erythropthalmus;
    Mangrovekoekoek=Coccyzus minor;
    Eekhoornkoekoek=Piaya cayana;
    Guirakoekoek=Guira guira;
    Grote ani=Crotophaga major;
    Kleine ani=Crotophaga ani;
    Groefsnavelani=Crotophaga sulcirostris;
    Fazantkoekoek=Centropus phasianinus;
    Senegalese spoorkoekoek=Centropus senegalensis;
    Grote spoorkoekoek=Centropus sinensis;
    Kleine spoorkoekoek=Centropus bengalensis;
    Blauwe coua=Coua caerulea;
    Grote coua=Coua gigas;
    Kuifcoua=Coua cristata;
    Renkoekoek=Geococcyx californianus;
    Kleine renkoekoek=Geococcyx velox;
    Aziatische koel=Eudynamys scolopaceus;
    Pacifische koel=Eudynamys orientalis;
    Langstaartkoel=Urodynamis taitensis;
    Goudbronzen koekoek=Chrysococcyx caprius;
    Smaragdkoekoek=Chrysococcyx cupreus;
    Glanskoekoek=Chrysococcyx lucidus
  `, [15]);

  // ============================================================
  // FAZANTEN, PATRIJZEN EN KWARTELS
  // ============================================================

  vliegendeVogels(`
    Fazant=Phasianus colchicus;
    Goudfazant=Chrysolophus pictus;
    Diamantfazant=Chrysolophus amherstiae;
    Koningsfazant=Syrmaticus reevesii;
    Koperfazant=Syrmaticus soemmerringii;
    Mikadofazant=Syrmaticus mikado;
    Zilverfazant=Lophura nycthemera;
    Edwardsfazant=Lophura edwardsi;
    Swinhoefazant=Lophura swinhoii;
    Zwarte fazant=Lophura leucomelanos;
    Vuur rugfazant=Lophura ignita;
    Bloedfazant=Ithaginis cruentus;
    Koklasfazant=Pucrasia macrolopha;
    Himalayaglansfazant=Lophophorus impejanus;
    Chinese glansfazant=Lophophorus lhuysii;
    Sclaters glansfazant=Lophophorus sclateri;
    Satyrtragopan=Tragopan satyra;
    Temmincks tragopan=Tragopan temminckii;
    Cabots tragopan=Tragopan caboti;
    Patrijs=Perdix perdix;
    Aziatische patrijs=Perdix dauurica;
    Tibetaanse patrijs=Perdix hodgsoniae;
    Rode patrijs=Alectoris rufa;
    Steenpatrijs=Alectoris graeca;
    Aziatische steenpatrijs=Alectoris chukar;
    Barbarijse patrijs=Alectoris barbara;
    Arabische steenpatrijs=Alectoris melanocephala;
    Kwartel=Coturnix coturnix;
    Japanse kwartel=Coturnix japonica;
    Harlekijnkwartel=Coturnix delegorguei;
    Chinese dwergkwartel=Synoicus chinensis;
    Californische kuifkwartel=Callipepla californica;
    Gambels kwartel=Callipepla gambelii;
    Schubbenkwartel=Callipepla squamata;
    Bergkwartel=Oreortyx pictus;
    Boomkwartel=Colinus virginianus;
    Auerhoen=Tetrao urogallus;
    Korhoen=Lyrurus tetrix;
    Kaukasisch korhoen=Lyrurus mlokosiewiczi;
    Hazelhoen=Tetrastes bonasia;
    Witstaarthoen=Lagopus leucura;
    Moerassneeuwhoen=Lagopus lagopus;
    Alpensneeuwhoen=Lagopus muta;
    Prairiekip=Tympanuchus cupido;
    Spitshoen=Tympanuchus phasianellus;
    Waaierhoen=Centrocercus urophasianus;
    Kraaghoen=Bonasa umbellus;
    Helmparelhoen=Numida meleagris;
    Gierparelhoen=Acryllium vulturinum;
    Kuifparelhoen=Guttera pucherani;
    Pauw=Pavo cristatus;
    Groene pauw=Pavo muticus;
    Congopauw=Afropavo congensis;
    Wilde kalkoen=Meleagris gallopavo;
    Pauwkalkoen=Meleagris ocellata;
    Bankivahoen=Gallus gallus;
    Sonnerathoen=Gallus sonneratii;
    Ceylonhoen=Gallus lafayettii;
    Groen kamhoen=Gallus varius
  `);

  // ============================================================
  // NACHTZWALUWEN
  // ============================================================

  vliegendeVogels(`
    Nachtzwaluw=Caprimulgus europaeus;
    Moorse nachtzwaluw=Caprimulgus ruficollis;
    Egyptische nachtzwaluw=Caprimulgus aegyptius;
    Nubische nachtzwaluw=Caprimulgus nubicus;
    Savannenachtzwaluw=Caprimulgus affinis;
    Indische nachtzwaluw=Caprimulgus asiaticus;
    Grote nachtzwaluw=Caprimulgus macrurus;
    Zwaluwstaartnachtzwaluw=Uropsalis segmentata;
    Lierstaartnachtzwaluw=Uropsalis lyra;
    Vlagstaartnachtzwaluw=Caprimulgus longipennis;
    Amerikaanse nachtzwaluw=Chordeiles minor;
    Kleine Amerikaanse nachtzwaluw=Chordeiles acutipennis;
    Antillennachtzwaluw=Chordeiles gundlachii;
    Zweep arme nachtzwaluw=Antrostomus vociferus;
    Chuck-wills-widow=Antrostomus carolinensis;
    Vetvogel=Steatornis caripensis;
    Reuzennachtzwaluw=Nyctibius grandis;
    Gewone potoo=Nyctibius griseus;
    Witvleugelpotoo=Nyctibius leucopterus;
    Roodbruine potoo=Phyllaemulor bracteatus;
    Uilnachtzwaluw=Aegotheles cristatus;
    Kikkerbek;
    Tawny frogmouth=Podargus strigoides;
    Papoeakikkerbek=Podargus papuensis;
    Maleise kikkerbek=Batrachostomus javensis
  `, [27]);

  // ============================================================
  // PARADIJSVOGELS
  // ============================================================

  vliegendeVogels(`
    Paradijsvogel;
    Grote paradijsvogel=Paradisaea apoda;
    Kleine paradijsvogel=Paradisaea minor;
    Raggianaparadijsvogel=Paradisaea raggiana;
    Rode paradijsvogel=Paradisaea rubra;
    Blauwe paradijsvogel=Paradisaea rudolphi;
    Keizerparadijsvogel=Paradisaea guilielmi;
    Goldies paradijsvogel=Paradisaea decora;
    Koningsparadijsvogel=Cicinnurus regius;
    Wilsons paradijsvogel=Diphyllodes respublica;
    Prachtparadijsvogel=Diphyllodes magnificus;
    Twaalfdradige paradijsvogel=Seleucidis melanoleucus;
    Zesdradige paradijsvogel;
    Westelijke parotia=Parotia sefilata;
    Lawesparotia=Parotia lawesii;
    Carolaparotia=Parotia carolae;
    Wahnesparotia=Parotia wahnesi;
    Arfakparotia;
    Koning-van-Saksenparadijsvogel=Pteridophora alberti;
    Zwarte sikkelstaart=Epimachus fastosus;
    Bruine sikkelstaart=Epimachus meyeri;
    Prachtgeweervogel=Ptiloris magnificus;
    Victorias geweervogel=Ptiloris victoriae;
    Paradijsgeweervogel=Ptiloris paradiseus;
    Wimpeldrager=Semioptera wallacii;
    Trompetparadijsvogel=Phonygammus keraudrenii;
    Krul kuifparadijsvogel=Manucodia comrii
  `);

  // ============================================================
  // PRIEELVOGELS
  // ============================================================

  vliegendeVogels(`
    Prieelvogel;
    Satijnblauwe prieelvogel=Ptilonorhynchus violaceus;
    Grote prieelvogel=Chlamydera nuchalis;
    Gevlekte prieelvogel=Chlamydera maculata;
    Westelijke prieelvogel=Chlamydera guttata;
    Geelborstprieelvogel=Chlamydera lauterbachi;
    Gouden prieelvogel=Prionodura newtoniana;
    Regentprieelvogel=Sericulus chrysocephalus;
    Vuurprieelvogel=Sericulus aureus;
    Oranjekuifprieelvogel=Amblyornis macgregoriae;
    Vogelkopprieelvogel=Amblyornis inornata;
    Goudkuifprieelvogel=Amblyornis flavifrons;
    Groene katvogel=Ailuroedus crassirostris;
    Gevlekte katvogel=Ailuroedus maculosus
  `);

  // ============================================================
  // VLIEGENDE ZOOGDIEREN: VLEERMUIZEN
  //
  // Vliegende eekhoorns en suikereekhoorns worden
  // niet opgenomen bij vraag 2. Die zweven.
  // ============================================================

  function vleermuizen(tekst, extra = []) {
    groep(tekst, [2, 20, 50, ...extra]);
  }

  vleermuizen(`
    Vleermuis=Bat;
    Gewone dwergvleermuis=Pipistrellus pipistrellus;
    Ruige dwergvleermuis=Pipistrellus nathusii;
    Kleine dwergvleermuis=Pipistrellus pygmaeus;
    Kuhls dwergvleermuis=Pipistrellus kuhlii;
    Savis dwergvleermuis=Hypsugo savii;
    Gewone grootoorvleermuis=Plecotus auritus;
    Grijze grootoorvleermuis=Plecotus austriacus;
    Alpen grootoorvleermuis=Plecotus macrobullaris;
    Laatvlieger=Eptesicus serotinus;
    Noordse vleermuis=Eptesicus nilssonii;
    Tweekleurige vleermuis=Vespertilio murinus;
    Rosse vleermuis=Nyctalus noctula;
    Bosvleermuis=Nyctalus leisleri;
    Grote rosse vleermuis=Nyctalus lasiopterus;
    Watervleermuis=Myotis daubentonii;
    Meervleermuis=Myotis dasycneme;
    Baardvleermuis=Myotis mystacinus;
    Brandts vleermuis=Myotis brandtii;
    Franjestaart=Myotis nattereri;
    Bechsteins vleermuis=Myotis bechsteinii;
    Vale vleermuis=Myotis myotis;
    Kleine vale vleermuis=Myotis blythii;
    Ingekorven vleermuis=Myotis emarginatus;
    Nimfvleermuis=Myotis alcathoe;
    Mopsvleermuis=Barbastella barbastellus;
    Schreiber vleermuis=Miniopterus schreibersii;
    Grote hoefijzerneus=Rhinolophus ferrumequinum;
    Kleine hoefijzerneus=Rhinolophus hipposideros;
    Mediterrane hoefijzerneus=Rhinolophus euryale;
    Mehelyhoefijzerneus=Rhinolophus mehelyi;
    Blasiushoefijzerneus=Rhinolophus blasii;
    Europese bulvleermuis=Tadarida teniotis;
    Egyptische nijlroezet=Rousettus aegyptiacus;
    Nijlroezet;
    Vliegende hond;
    Grote vliegende hond=Pteropus vampyrus;
    Indische vliegende hond=Pteropus medius;
    Grijskopvleerhond=Pteropus poliocephalus;
    Zwarte vliegende hond=Pteropus alecto;
    Kleine rode vliegende hond=Pteropus scapulatus;
    Brilvleerhond=Pteropus conspicillatus;
    Rodriguesvleerhond=Pteropus rodricensis;
    Mauritiusvleerhond=Pteropus niger;
    Seychellenvleerhond=Pteropus seychellensis;
    Goudkruinvleerhond=Acerodon jubatus;
    Sulawesivleerhond=Acerodon celebensis;
    Hamerkopvleerhond=Hypsignathus monstrosus;
    Geelvleugelvleermuis=Lavia frons;
    Hondskopvleermuis;
    Strogele vleerhond=Eidolon helvum;
    Madagaskarvleerhond=Eidolon dupreanum;
    Dwergvleerhond=Cynopterus brachyotis;
    Kortneusvleerhond=Cynopterus sphinx;
    Langtongvleerhond=Macroglossus minimus;
    Vampiervleermuis;
    Gewone vampier=Desmodus rotundus;
    Witvleugelvampier=Diaemus youngi;
    Ruigpootvampier=Diphylla ecaudata;
    Witte vleermuis=Ectophylla alba;
    Grote speerneus=Phyllostomus hastatus;
    Kleine speerneus=Phyllostomus elongatus;
    Brilbladneusvleermuis=Carollia perspicillata;
    Jamaicaanse fruitvleermuis=Artibeus jamaicensis;
    Grote fruitvleermuis=Artibeus lituratus;
    Kleine fruitvleermuis=Artibeus cinereus;
    Geel schoudervleermuis=Sturnira lilium;
    Langtongbladneusvleermuis=Glossophaga soricina;
    Mexicaanse langtongvleermuis=Choeronycteris mexicana;
    Grote hazenlipvleermuis=Noctilio leporinus;
    Kleine hazenlipvleermuis=Noctilio albiventris;
    Grote bruine vleermuis=Eptesicus fuscus;
    Kleine bruine vleermuis=Myotis lucifugus;
    Noordelijke grootoorvleermuis=Myotis septentrionalis;
    Indianavleermuis=Myotis sodalis;
    Californische vleermuis=Myotis californicus;
    Yumavleermuis=Myotis yumanensis;
    Langoorvleermuis=Myotis evotis;
    Zilverhaarvleermuis=Lasionycteris noctivagans;
    Rode vleermuis=Lasiurus borealis;
    Westelijke rode vleermuis=Lasiurus blossevillii;
    Grijze vleermuis=Myotis grisescens;
    Hoary bat=Lasiurus cinereus;
    Gevlekte vleermuis=Euderma maculatum;
    Mexicaanse vrijstaartvleermuis=Tadarida brasiliensis;
    Cubaanse trechteroorvleermuis=Natalus primus;
    Hommelvleermuis=Craseonycteris thonglongyai;
    Australische spookvleermuis=Macroderma gigas;
    Grote valse vampier=Megaderma lyra;
    Kleine valse vampier=Megaderma spasma;
    Nieuw-Zeelandse kortstaartvleermuis=Mystacina tuberculata;
    Nieuw-Zeelandse langstaartvleermuis=Chalinolobus tuberculatus;
    Australische grote oorvleermuis=Nyctophilus major;
    Kleine oorvleermuis=Nyctophilus geoffroyi;
    Schijfvoetvleermuis=Thyroptera tricolor;
    Zuigschijfvleermuis=Myzopoda aurita;
    Zakvleugelvleermuis;
    Grote zakvleugelvleermuis=Saccopteryx bilineata;
    Kleine zakvleugelvleermuis=Saccopteryx leptura;
    Egyptische grafvleermuis=Taphozous perforatus;
    Naakte bulvleermuis=Cheiromeles torquatus;
    Bulldogvleermuis;
    Chapins bulvleermuis=Chaerephon chapini;
    Angolese bulvleermuis=Mops condylurus;
    Grote bladneusvleermuis=Hipposideros armiger;
    Kleine Aziatische bladneusvleermuis=Hipposideros pomona
  `);

  // ============================================================
  // VLINDERS
  // ============================================================

  function vliegendeInsecten(tekst, extra = []) {
    groep(tekst, [2, 7, 50, ...extra]);
  }

  vliegendeInsecten(`
    Vlinder=Butterfly;
    Dagvlinder;
    Dagpauwoog=Aglais io;
    Kleine vos=Aglais urticae;
    Grote vos=Nymphalis polychloros;
    Oostelijke vos=Nymphalis xanthomelas;
    Rouwmantel=Nymphalis antiopa;
    Atalanta=Vanessa atalanta;
    Distelvlinder=Vanessa cardui;
    Amerikaanse distelvlinder=Vanessa virginiensis;
    Gehakkelde aurelia=Polygonia c-album;
    Landkaartje=Araschnia levana;
    Keizersmantel=Argynnis paphia;
    Grote parelmoervlinder=Speyeria aglaja;
    Duinparelmoervlinder=Fabriciana niobe;
    Bosrandparelmoervlinder=Fabriciana adippe;
    Kleine parelmoervlinder=Issoria lathonia;
    Zilveren maan=Boloria selene;
    Zilvervlek=Boloria euphrosyne;
    Veenbesparelmoervlinder=Boloria aquilonaris;
    Violette vuurvlinder=Lycaena alciphron;
    Kleine vuurvlinder=Lycaena phlaeas;
    Grote vuurvlinder=Lycaena dispar;
    Bruine vuurvlinder=Lycaena tityrus;
    Morgenrood=Lycaena virgaureae;
    Icarusblauwtje=Polyommatus icarus;
    Adonisblauwtje=Lysandra bellargus;
    Bleek blauwtje=Lysandra coridon;
    Klaverblauwtje=Cyaniris semiargus;
    Heideblauwtje=Plebejus argus;
    Vals heideblauwtje=Plebejus idas;
    Boomblauwtje=Celastrina argiolus;
    Dwergblauwtje=Cupido minimus;
    Staartblauwtje=Cupido argiades;
    Bruin blauwtje=Aricia agestis;
    Veenbesblauwtje=Agriades optilete;
    Gentiaanblauwtje=Phengaris alcon;
    Pimpernelblauwtje=Phengaris teleius;
    Donker pimpernelblauwtje=Phengaris nausithous;
    Tijgerblauwtje=Lampides boeticus;
    Geraniumblauwtje=Cacyreus marshalli;
    Groentje=Callophrys rubi;
    Eikenpage=Favonius quercus;
    Bruine eikenpage=Satyrium ilicis;
    Iepenpage=Satyrium w-album;
    Sleedoornpage=Thecla betulae;
    Koninginnenpage=Papilio machaon;
    Koningspage=Iphiclides podalirius;
    Spaanse koningspage=Iphiclides feisthamelii;
    Apollovlinder=Parnassius apollo;
    Zwarte apollovlinder=Parnassius mnemosyne;
    Kleine apollovlinder=Parnassius phoebus;
    Groot koolwitje=Pieris brassicae;
    Klein koolwitje=Pieris rapae;
    Klein geaderd witje=Pieris napi;
    Groot geaderd witje=Aporia crataegi;
    Citroenvlinder=Gonepteryx rhamni;
    Cleopatra=Gonepteryx cleopatra;
    Oranjetipje=Anthocharis cardamines;
    Resedawitje=Pontia daplidice;
    Oostelijk resedawitje=Pontia edusa;
    Gele luzernevlinder=Colias hyale;
    Oranje luzernevlinder=Colias croceus;
    Zuidelijke luzernevlinder=Colias alfacariensis;
    Oranje zandoogje=Pyronia tithonus;
    Bruin zandoogje=Maniola jurtina;
    Bont zandoogje=Pararge aegeria;
    Koevinkje=Aphantopus hyperantus;
    Hooibeestje=Coenonympha pamphilus;
    Veenhooibeestje=Coenonympha tullia;
    Tweekleurig hooibeestje=Coenonympha arcania;
    Argusvlinder=Lasiommata megera;
    Rotsvlinder=Lasiommata maera;
    Heivlinder=Hipparchia semele;
    Kleine heivlinder=Hipparchia statilinus;
    Grote boswachter=Hipparchia fagi;
    Kleine boswachter=Hipparchia alcyone;
    Oranje steppevlinder;
    Dambordje=Melanargia galathea;
    Spaans dambordje=Melanargia lachesis;
    Bosparelmoervlinder=Melitaea athalia;
    Veldparelmoervlinder=Melitaea cinxia;
    Knoopkruidparelmoervlinder=Melitaea phoebe;
    Tweekleurige parelmoervlinder=Melitaea didyma;
    Moerasparelmoervlinder=Euphydryas aurinia;
    Grote weerschijnvlinder=Apatura iris;
    Kleine weerschijnvlinder=Apatura ilia;
    Kleine ijsvogelvlinder=Limenitis camilla;
    Grote ijsvogelvlinder=Limenitis populi;
    Blauwe ijsvogelvlinder=Limenitis reducta;
    Bont dikkopje=Carterocephalus palaemon;
    Groot dikkopje=Ochlodes sylvanus;
    Geelsprietdikkopje=Thymelicus sylvestris;
    Zwartsprietdikkopje=Thymelicus lineola;
    Dwergdikkopje=Thymelicus acteon;
    Kommadikkopje=Hesperia comma;
    Aardbeivlinder=Pyrgus malvae;
    Kaasjeskruiddikkopje=Carcharodus alceae
  `);

  // ============================================================
  // TROPISCHE VLINDERS
  // ============================================================

  vliegendeInsecten(`
    Monarchvlinder=Danaus plexippus;
    Kleine monarchvlinder=Danaus chrysippus;
    Koninginnenmonarch=Danaus gilippus;
    Tijgermonarch=Danaus genutia;
    Blauwe morpho=Morpho menelaus;
    Morpho peleides;
    Morpho helenor;
    Morpho didius;
    Morpho rhetenor;
    Morpho cypris;
    Morpho amathonte;
    Morpho achilles;
    Morpho deidamia;
    Morpho polyphemus;
    Uilvlinder=Caligo;
    Caligo eurilochus;
    Caligo memnon;
    Caligo illioneus;
    Glasvleugelvlinder=Greta oto;
    Zebravlinder=Heliconius charithonia;
    Heliconius erato;
    Heliconius melpomene;
    Heliconius cydno;
    Heliconius hecale;
    Heliconius numata;
    Heliconius sara;
    Heliconius doris;
    Heliconius ismenius;
    Heliconius sapho;
    Heliconius eleuchia;
    Heliconius wallacei;
    Passiebloemvlinder=Agraulis vanillae;
    Julia vlinder=Dryas iulia;
    Cethosia cyane;
    Cethosia biblis;
    Cethosia hypsea;
    Rode kantvlinder;
    Blauwe tijgervlinder=Tirumala limniace;
    Euploea core;
    Euploea mulciber;
    Papilio demoleus;
    Papilio polytes;
    Papilio memnon;
    Papilio lowi;
    Papilio rumanzovia;
    Papilio palinurus;
    Papilio blumei;
    Papilio paris;
    Papilio maackii;
    Papilio bianor;
    Papilio ulysses;
    Papilio troilus;
    Papilio glaucus;
    Papilio canadensis;
    Papilio rutulus;
    Papilio multicaudata;
    Papilio cresphontes;
    Papilio thoas;
    Papilio anchisiades;
    Papilio dardanus;
    Papilio nireus;
    Papilio phorcas;
    Papilio antimachus;
    Papilio zalmoxis;
    Papilio homerus;
    Ornithoptera alexandrae;
    Ornithoptera priamus;
    Ornithoptera goliath;
    Ornithoptera victoriae;
    Ornithoptera croesus;
    Ornithoptera paradisea;
    Troides helena;
    Troides aeacus;
    Troides hypolitus;
    Troides rhadamantus;
    Trogonoptera brookiana;
    Trogonoptera trojana;
    Graphium agamemnon;
    Graphium sarpedon;
    Graphium doson;
    Graphium antiphates;
    Graphium policenes;
    Graphium antheus;
    Kallima inachus;
    Kallima paralekta;
    Bladvlinder;
    Junonia coenia;
    Junonia almana;
    Junonia lemonias;
    Junonia orithya;
    Junonia atlites;
    Junonia iphita;
    Hypolimnas bolina;
    Hypolimnas misippus;
    Hypolimnas anthedon;
    Charaxes jasius;
    Charaxes brutus;
    Charaxes varanes;
    Charaxes eudoxus;
    Charaxes castor;
    Charaxes tiridates;
    Charaxes etesipe;
    Prepona demophon;
    Archaeoprepona demophon;
    Siproeta stelenes;
    Siproeta epaphus;
    Biblis hyperia;
    Hamadryas feronia;
    Hamadryas amphinome;
    Hamadryas februa;
    Diaethria clymena;
    Diaethria anna;
    Achtentachtigvlinder;
    Catonephele numilia;
    Catonephele orites
  `);

  // ============================================================
  // NACHTVLINDERS EN MOTTEN
  // ============================================================

  vliegendeInsecten(`
    Mot=Moth;
    Nachtvlinder;
    Atlasvlinder=Attacus atlas;
    Herculesvlinder=Coscinocera hercules;
    Grote nachtpauwoog=Saturnia pyri;
    Nachtpauwoog=Saturnia pavonia;
    Kleine nachtpauwoog;
    Japanse zijdevlinder=Antheraea yamamai;
    Chinese eikenzijdevlinder=Antheraea pernyi;
    Polyphemusvlinder=Antheraea polyphemus;
    Cecropi a vlinder=Hyalophora cecropia;
    Prometheavlinder=Callosamia promethea;
    Lunavlinder=Actias luna;
    Madagaskarmaanvlinder=Argema mittrei;
    Afrikaanse maanvlinder=Argema mimosae;
    Actias selene;
    Actias artemis;
    Actias dubernardi;
    Spaanse maanvlinder=Graellsia isabellae;
    Doodshoofdvlinder=Acherontia atropos;
    Acherontia lachesis;
    Acherontia styx;
    Windepijlstaart=Agrius convolvuli;
    Ligusterpijlstaart=Sphinx ligustri;
    Dennenpijlstaart=Sphinx pinastri;
    Lindepijlstaart=Mimas tiliae;
    Pauwoogpijlstaart=Smerinthus ocellata;
    Populierenpijlstaart=Laothoe populi;
    Groot avondrood=Deilephila elpenor;
    Klein avondrood=Deilephila porcellus;
    Kolibrievlinder=Macroglossum stellatarum;
    Walstropijlstaart=Hyles gallii;
    Wolfsmelkpijlstaart=Hyles euphorbiae;
    Gestreepte pijlstaart=Hyles livornica;
    Oleanderpijlstaart=Daphnis nerii;
    Glasvleugelpijlstaart=Hemaris fuciformis;
    Smalle glasvleugelpijlstaart=Hemaris tityus;
    Teunisbloempijlstaart=Proserpinus proserpina;
    Manduca sexta;
    Manduca quinquemaculata;
    Xanthopan morganii;
    Spaanse vlag=Euplagia quadripunctaria;
    Sint-jacobsvlinder=Tyria jacobaeae;
    Sint-jansvlinder=Zygaena filipendulae;
    Vijfvlek-sint-jansvlinder=Zygaena trifolii;
    Bloeddrupje;
    Gamma-uil=Autographa gamma;
    Huismoeder=Noctua pronuba;
    Volgeling=Noctua comes;
    Kleine huismoeder=Noctua interjecta;
    Grote beer=Arctia caja;
    Kleine beer=Phragmatobia fuliginosa;
    Gele tijger=Spilosoma lutea;
    Witte tijger=Spilosoma lubricipeda;
    Sneeuwbeer=Spilosoma urticae;
    Bruine beer;
    Zwart beertje=Atolmis rubricollis;
    Geel beertje=Eilema sororcula;
    Plat beertje=Eilema lurideola;
    Muisbeertje=Eilema griseola;
    Streepkokerbeertje=Eilema complana;
    Rozenblaadje=Miltochrista miniata;
    Plakker=Lymantria dispar;
    Nonvlinder=Lymantria monacha;
    Donsvlinder=Euproctis similis;
    Bastaardsatijnvlinder=Euproctis chrysorrhoea;
    Eikenprocessievlinder=Thaumetopoea processionea;
    Dennenprocessievlinder=Thaumetopoea pityocampa;
    Ringelrups=Malacosoma neustria;
    Hageheld=Lasiocampa quercus;
    Veelvraat=Macrothylacia rubi;
    Rietvink=Euthrix potatoria;
    Dennenspinner=Dendrolimus pini;
    Wilgenhoutrups=Cossus cossus;
    Gestippelde houtvlinder=Zeuzera pyrina;
    Buxusmot=Cydalima perspectalis;
    Klerenmot=Tineola bisselliella;
    Pelsmot=Tinea pellionella;
    Meelmot=Ephestia kuehniella;
    Indische meelmot=Plodia interpunctella;
    Cacaomot=Ephestia elutella;
    Grote wasmot=Galleria mellonella;
    Kleine wasmot=Achroia grisella;
    Appelbladroller=Cydia pomonella;
    Fruitmot;
    Koolmot=Plutella xylostella;
    Paardenkastanjemineermot=Cameraria ohridella;
    Stippelmot=Yponomeuta;
    Appelstippelmot=Yponomeuta malinellus;
    Spinselmot;
    Wilgenstippelmot=Yponomeuta rorrella;
    Berken spanner=Biston betularia;
    Peper-en-zoutvlinder;
    Grote wintervlinder=Erannis defoliaria;
    Kleine wintervlinder=Operophtera brumata;
    Lieveling=Timandra comae;
    Bloedvlekspanner;
    Bonte bessenvlinder=Abraxas grossulariata;
    Harlekijnvlinder;
    Zomervlinder=Geometra papilionaria;
    Grote groene spanner;
    Kleine groene spanner=Hemithea aestivaria;
    Gele tijgerspanner=Opisthograptis luteolata;
    Hagedoornvlinder=Ourapteryx sambucaria
  `);

  // ============================================================
  // BIJEN EN HOMMELS
  // ============================================================

  vliegendeInsecten(`
    Bij=Bee;
    Honingbij=Apis mellifera;
    Aziatische honingbij=Apis cerana;
    Reuzenhoningbij=Apis dorsata;
    Dwerg honingbij=Apis florea;
    Zwarte dwergbij=Apis andreniformis;
    Hommel=Bumblebee;
    Aardhommel=Bombus terrestris;
    Tuinhommel=Bombus hortorum;
    Akkerhommel=Bombus pascuorum;
    Steenhommel=Bombus lapidarius;
    Boomhommel=Bombus hypnorum;
    Weidehommel=Bombus pratorum;
    Veldhommel=Bombus lucorum;
    Grote veldhommel=Bombus magnus;
    Wilgenhommel=Bombus cryptarum;
    Heidehommel=Bombus humilis;
    Moshommel=Bombus muscorum;
    Grashommel=Bombus ruderarius;
    Boshommel=Bombus sylvarum;
    Zandhommel=Bombus veteranus;
    Donkere tuinhommel=Bombus ruderatus;
    Gele hommel=Bombus distinguendus;
    Veenhommel=Bombus jonellus;
    Waddenhommel=Bombus cullumanus;
    Vierkleurige koekoekshommel=Bombus sylvestris;
    Gewone koekoekshommel=Bombus campestris;
    Grote koekoekshommel=Bombus vestalis;
    Tweekleurige koekoekshommel=Bombus bohemicus;
    Rode koekoekshommel=Bombus rupestris;
    Gewone sachembij=Anthophora plumipes;
    Andoornbij=Anthophora furcata;
    Blauwe metselbij=Osmia caerulescens;
    Rosse metselbij=Osmia bicornis;
    Gehoornde metselbij=Osmia cornuta;
    Kauwende metselbij=Osmia leaiana;
    Grote wolbij=Anthidium manicatum;
    Kleine wolbij=Anthidium punctatum;
    Tuinbladsnijder=Megachile centuncularis;
    Grote bladsnijder=Megachile willughbiella;
    Gewone behangersbij;
    Blauwe houtbij=Xylocopa violacea;
    Oostelijke houtbij=Xylocopa virginica;
    Californische houtbij=Xylocopa californica;
    Reuzenhoutbij=Xylocopa latipes;
    Wallaces reuzenbij=Megachile pluto;
    Grijze zandbij=Andrena vaga;
    Viltvlekzandbij=Andrena nitida;
    Vosje=Andrena fulva;
    Roodgatje=Andrena haemorrhoa;
    Grasbij=Andrena flavipes;
    Meidoornzandbij=Andrena scotica;
    Asbij=Andrena cineraria;
    Gewone dwergzandbij=Andrena minutula;
    Fluitenkruidbij=Andrena proxima;
    Gewone roetbij=Panurgus calcaratus;
    Grote roetbij=Panurgus banksianus;
    Wormkruidbij=Colletes daviesanus;
    Klimopbij=Colletes hederae;
    Grote zijdebij=Colletes cunicularius;
    Gewone maskerbij=Hylaeus communis;
    Brilmaskerbij=Hylaeus dilatatus;
    Kleine harsbij=Anthidiellum strigatum;
    Grote bloedbij=Sphecodes albilabris;
    Gewone bloedbij;
    Roodzwarte dubbeltand=Nomada fabriciana;
    Gewone wespbij=Nomada flava;
    Geelzwarte wespbij;
    Knautiabij=Andrena hattorfiana;
    Klokjesdikpoot=Melitta haemorrhoidalis;
    Kattenstaartdikpoot=Melitta nigricans;
    Klaverdikpoot=Melitta leporina;
    Pluimvoetbij=Dasypoda hirtipes;
    Slobkousbij=Macropis europaea;
    Tronkenbij=Heriades truncorum;
    Gewone tubebij=Stelis breviuscula
  `);

  // ============================================================
  // WESPEN EN HORZELS
  // ============================================================

  vliegendeInsecten(`
    Wesp=Wasp;
    Gewone wesp=Vespula vulgaris;
    Duitse wesp=Vespula germanica;
    Rode wesp=Vespula rufa;
    Boswesp=Dolichovespula sylvestris;
    Saksische wesp=Dolichovespula saxonica;
    Middelste wesp=Dolichovespula media;
    Noorse wesp=Dolichovespula norwegica;
    Hoornaar=Vespa crabro;
    Europese hoornaar;
    Aziatische hoornaar=Vespa velutina;
    Aziatische reuzenhoornaar=Vespa mandarinia;
    Oosterse hoornaar=Vespa orientalis;
    Zwarte hoornaar=Vespa basalis;
    Grote bandhoornaar=Vespa tropica;
    Kleine bandhoornaar=Vespa affinis;
    Vespa simillima;
    Franse veldwesp=Polistes dominula;
    Bergveldwesp=Polistes biglumis;
    Polistes gallicus;
    Polistes fuscatus;
    Polistes annularis;
    Polistes exclamans;
    Papierwesp;
    Sluipwesp;
    Grote sluipwesp=Rhyssa persuasoria;
    Megarhyssa macrurus;
    Pimpla rufipes;
    Netelia testacea;
    Ophion luteus;
    Schildwesp;
    Galwesp;
    Eikengalwesp=Cynips quercusfolii;
    Aardappelgalwesp=Biorhiza pallida;
    Rozengalwesp=Diplolepis rosae;
    Vijgenwesp;
    Graafwesp;
    Bijenwolf=Philanthus triangulum;
    Rupsendoder=Ammophila sabulosa;
    Grote rupsendoder;
    Zandwesp;
    Spinnendoder;
    Grote spinnendoder=Cryptocheilus;
    Pompilus cinereus;
    Wegwesp;
    Pepsis grossa;
    Pepsis thisbe;
    Dolkwesp;
    Megascolia maculata;
    Scolia hirta;
    Scolia sexmaculata;
    Keverdoder;
    Goudwesp;
    Gewone goudwesp=Chrysis ignita;
    Houtwesp;
    Reuzenhoutwesp=Urocerus gigas;
    Sirex noctilio;
    Bladwesp;
    Rozenbladwesp=Arge pagana;
    Grote rozenbladwesp;
    Kruisbessenbladwesp=Euura ribesii
  `);

  // ============================================================
  // LIBELLEN EN WATERJUFFERS
  // ============================================================

  vliegendeInsecten(`
    Libel=Dragonfly;
    Waterjuffer=Damselfly;
    Grote keizerlibel=Anax imperator;
    Kleine keizerlibel=Anax parthenope;
    Zadellibel=Anax ephippiger;
    Amerikaanse keizerlibel=Anax junius;
    Blauwe glazenmaker=Aeshna cyanea;
    Bruine glazenmaker=Aeshna grandis;
    Groene glazenmaker=Aeshna viridis;
    Venglazenmaker=Aeshna juncea;
    Noordse glazenmaker=Aeshna subarctica;
    Paardenbijter=Aeshna mixta;
    Vroege glazenmaker=Aeshna isoceles;
    Glassnijder=Brachytron pratense;
    Zuidelijke glazenmaker=Aeshna affinis;
    Gewone bronlibel=Cordulegaster boltonii;
    Zuidelijke bronlibel=Cordulegaster bidentata;
    Beekrombout=Gomphus vulgatissimus;
    Rivierrombout=Stylurus flavipes;
    Plasrombout=Gomphus pulchellus;
    Gaffellibel=Ophiogomphus cecilia;
    Kleine tanglibel=Onychogomphus forcipatus;
    Grote tanglibel=Onychogomphus uncatus;
    Gewone oeverlibel=Orthetrum cancellatum;
    Zuidelijke oeverlibel=Orthetrum brunneum;
    Beekoeverlibel=Orthetrum coerulescens;
    Witpuntoeverlibel=Orthetrum albistylum;
    Platbuik=Libellula depressa;
    Viervlek=Libellula quadrimaculata;
    Bruine korenbout=Libellula fulva;
    Gewone pantserjuffer=Lestes sponsa;
    Tangpantserjuffer=Lestes dryas;
    Tengere pantserjuffer=Lestes virens;
    Zwervende pantserjuffer=Lestes barbarus;
    Houtpantserjuffer=Chalcolestes viridis;
    Bruine winterjuffer=Sympecma fusca;
    Noordse winterjuffer=Sympecma paedisca;
    Weidebeekjuffer=Calopteryx splendens;
    Bosbeekjuffer=Calopteryx virgo;
    Blauwe breedscheenjuffer=Platycnemis pennipes;
    Vuurjuffer=Pyrrhosoma nymphula;
    Koraaljuffer=Ceriagrion tenellum;
    Lantaarntje=Ischnura elegans;
    Tengere grasjuffer=Ischnura pumilio;
    Azuurwaterjuffer=Coenagrion puella;
    Variabele waterjuffer=Coenagrion pulchellum;
    Maanwaterjuffer=Coenagrion lunulatum;
    Speerwaterjuffer=Coenagrion hastulatum;
    Mercuurwaterjuffer=Coenagrion mercuriale;
    Vogelwaterjuffer=Coenagrion ornatum;
    Watersnuffel=Enallagma cyathigerum;
    Grote roodoogjuffer=Erythromma najas;
    Kleine roodoogjuffer=Erythromma viridulum;
    Kanaaljuffer=Erythromma lindenii;
    Dwergjuffer=Nehalennia speciosa;
    Bloedrode heidelibel=Sympetrum sanguineum;
    Bruinrode heidelibel=Sympetrum striolatum;
    Steenrode heidelibel=Sympetrum vulgatum;
    Geelvlekheidelibel=Sympetrum flaveolum;
    Zwarte heidelibel=Sympetrum danae;
    Bandheidelibel=Sympetrum pedemontanum;
    Kempense heidelibel=Sympetrum depressiusculum;
    Zuidelijke heidelibel=Sympetrum meridionale;
    Zwervende heidelibel=Sympetrum fonscolombii;
    Gevlekte witsnuitlibel=Leucorrhinia pectoralis;
    Noordse witsnuitlibel=Leucorrhinia rubicunda;
    Venwitsnuitlibel=Leucorrhinia dubia;
    Sierlijke witsnuitlibel=Leucorrhinia caudalis;
    Oostelijke witsnuitlibel=Leucorrhinia albifrons;
    Smaragdlibel=Cordulia aenea;
    Metaalglanslibel=Somatochlora metallica;
    Hoogveenglanslibel=Somatochlora arctica;
    Gevlekte glanslibel=Somatochlora flavomaculata;
    Tweevlek=Epitheca bimaculata;
    Vuurlibel=Crocothemis erythraea;
    Purperlibel=Trithemis annulata;
    Wereldzwerver=Pantala flavescens
  `, [15, 17]);

  // ============================================================
  // VLIEGEN EN MUGGEN
  // ============================================================

  vliegendeInsecten(`
    Vlieg=Fly;
    Huisvlieg=Musca domestica;
    Kleine kamervlieg=Fannia canicularis;
    Stalvlieg=Stomoxys calcitrans;
    Blauwe vleesvlieg=Calliphora vicina;
    Rode vleesvlieg=Calliphora vomitoria;
    Groene vleesvlieg=Lucilia sericata;
    Keizersvlieg=Lucilia caesar;
    Grauwe vleesvlieg=Sarcophaga carnaria;
    Klustervlieg=Pollenia rudis;
    Fruitvlieg=Drosophila melanogaster;
    Suzukifruitvlieg=Drosophila suzukii;
    Middellandse Zeevruchtvlieg=Ceratitis capitata;
    Kersenvlieg=Rhagoletis cerasi;
    Wortelvlieg=Chamaepsila rosae;
    Uienvlieg=Delia antiqua;
    Koolvlieg=Delia radicum;
    Bietenvlieg=Pegomya betae;
    Aspergevlieg=Plioreocepta poeciloptera;
    Tseetseevlieg=Glossina;
    Glossina morsitans;
    Glossina palpalis;
    Zweefvlieg=Hoverfly;
    Snorzweefvlieg=Episyrphus balteatus;
    Blinde bij=Eristalis tenax;
    Puntbijvlieg=Eristalis nemorum;
    Bosbijvlieg=Eristalis horticola;
    Kegelbijvlieg=Eristalis pertinax;
    Gewone pendelvlieg=Helophilus pendulus;
    Citroenpendelvlieg=Helophilus trivittatus;
    Witte halvemaanzweefvlieg=Scaeva pyrastri;
    Gele halvemaanzweefvlieg=Scaeva selenitica;
    Stadsreus=Volucella zonaria;
    Hommelreus=Volucella bombylans;
    Witte reus=Volucella pellucens;
    Ivoorzweefvlieg;
    Grote langlijf=Sphaerophoria scripta;
    Doodskopzweefvlieg=Myathropa florea;
    Gewone driehoekszweefvlieg=Melanostoma mellinum;
    Vliegende speld=Xanthogramma pedissequum;
    Roofvlieg;
    Gewone roofvlieg=Tolmerus atricapillus;
    Hoornaarroofvlieg=Asilus crabroniformis;
    Gele hommelroofvlieg=Laphria flava;
    Wolzwever;
    Gewone wolzwever=Bombylius major;
    Kleine wolzwever=Bombylius minor;
    Dambordvlieg;
    Daas;
    Paardendaas=Tabanus sudeticus;
    Runderdaas=Tabanus bovinus;
    Regendaas=Haematopota pluvialis;
    Goudoogdaas=Chrysops relictus;
    Horzel;
    Paardenhorzel=Gasterophilus intestinalis;
    Runderhorzel=Hypoderma bovis;
    Schapenhorzel=Oestrus ovis;
    Mug=Mosquito;
    Steekmug;
    Gewone steekmug=Culex pipiens;
    Gelekoortsmug=Aedes aegypti;
    Aziatische tijgermug=Aedes albopictus;
    Japanse bosmug=Aedes japonicus;
    Malariamug=Anopheles;
    Anopheles gambiae;
    Anopheles stephensi;
    Anopheles atroparvus;
    Langpootmug;
    Gewone langpootmug=Tipula paludosa;
    Koollangpootmug=Tipula oleracea;
    Reuzenlangpootmug=Tipula maxima;
    Tijgerlangpootmug=Nephrotoma appendiculata;
    Dansmug;
    Rode dansmug=Chironomus plumosus;
    Kriebelmug=Simulium;
    Knut=Culicoides;
    Zandvlieg=Phlebotomus;
    Rouwmug;
    Paddenstoelmug;
    Galmug;
    Motmug;
    Rioolvlieg=Clogmia albipunctata
  `);

  // ============================================================
  // VLIEGENDE KEVERS
  // ============================================================

  vliegendeInsecten(`
    Meikever=Melolontha melolontha;
    Bosmeikever=Melolontha hippocastani;
    Junikever=Amphimallon solstitiale;
    Julikever=Polyphylla fullo;
    Rozenkever=Phyllopertha horticola;
    Gouden tor=Cetonia aurata;
    Gouden rozenkever;
    Koperen tor=Protaetia cuprea;
    Penseelkever=Trichius fasciatus;
    Behaarde penseelkever=Trichius gallicus;
    Neushoornkever=Oryctes nasicornis;
    Herculeskever=Dynastes hercules;
    Oostelijke Herculeskever=Dynastes tityus;
    Westelijke Herculeskever=Dynastes grantii;
    Goliathkever=Goliathus goliatus;
    Goliathus regius;
    Goliathus orientalis;
    Olifantskever=Megasoma elephas;
    Megasoma actaeon;
    Atlaskever=Chalcosoma atlas;
    Chalcosoma caucasus;
    Japanse neushoornkever=Trypoxylus dichotomus;
    Vliegend hert=Lucanus cervus;
    Klein vliegend hert=Dorcus parallelipipedus;
    Lucanus elaphus;
    Lucanus maculifemoratus;
    Cyclommatus metallifer;
    Prosopocoilus giraffa;
    Regenboogvliegendhert=Phalacrognathus muelleri;
    Zevenstippelig lieveheersbeestje=Coccinella septempunctata;
    Tweestippelig lieveheersbeestje=Adalia bipunctata;
    Tienstippelig lieveheersbeestje=Adalia decempunctata;
    Veertienstippelig lieveheersbeestje=Propylea quatuordecimpunctata;
    Tweeëntwintigstippelig lieveheersbeestje=Psyllobora vigintiduopunctata;
    Aziatisch lieveheersbeestje=Harmonia axyridis;
    Oogvleklieveheersbeestje=Anatis ocellata;
    Roomvleklieveheersbeestje=Calvia quatuordecimguttata;
    Meeldauwlieveheersbeestje;
    Citroenlieveheersbeestje;
    Elfstippelig lieveheersbeestje=Coccinella undecimpunctata;
    Zestienpuntlieveheersbeestje=Tytthaspis sedecimpunctata;
    Coloradokever=Leptinotarsa decemlineata;
    Elzenhaantje=Agelastica alni;
    Leliehaantje=Lilioceris lilii;
    Muntgoudhaantje=Chrysolina herbacea;
    Rozemarijngoudhaantje=Chrysolina americana;
    Grote populierenhaan=Chrysomela populi;
    Kleine populierenhaan=Chrysomela tremula;
    Muskusboktor=Aromia moschata;
    Huisboktor=Hylotrupes bajulus;
    Grote eikenboktor=Cerambyx cerdo;
    Kleine heldenbok=Cerambyx scopolii;
    Gewone smalboktor=Stenurella melanura;
    Vierbandsmalboktor=Leptura quadrifasciata;
    Gele smalboktor=Rutpela maculata;
    Geringelde smalboktor;
    Lederboktor=Prionus coriarius;
    Grijze ribbelboktor=Rhagium inquisitor;
    Zwart gevlekte smalboktor;
    Aziatische boktor=Anoplophora glabripennis;
    Oost-Aziatische boktor=Anoplophora chinensis;
    Rosaliaboktor=Rosalia alpina;
    Titanenboktor=Titanus giganteus;
    Vuurkever;
    Zwartkopvuurkever=Pyrochroa coccinea;
    Roodkopvuurkever=Pyrochroa serraticornis;
    Gevlekte smalvuurkever=Schizotus pectinicornis;
    Gewone weekschildkever=Cantharis fusca;
    Rode weekschildkever=Rhagonycha fulva;
    Gewone doodgraver=Nicrophorus vespillo;
    Zwarte doodgraver=Nicrophorus humator;
    Krompootdoodgraver;
    Groene zandloopkever=Cicindela campestris;
    Bronzen zandloopkever=Cicindela hybrida;
    Geelgerande waterroofkever;
    Grote spinnende watertor;
    Schrijvertje;
    Mestkever;
    Gewone mestkever=Geotrupes stercorarius;
    Bosmestkever=Anoplotrupes stercorosus;
    Driehoornmestkever=Typhaeus typhoeus;
    Heilige scarabee=Scarabaeus sacer;
    Vuurvliegje;
    Grote glimworm=Lampyris noctiluca;
    Kleine glimworm=Lamprohiza splendidula;
    Photinus pyralis;
    Photinus carolinus;
    Luciola cruciata;
    Luciola lateralis
  `);

  // ============================================================
  // SPRINKHANEN EN KREKELS
  // ============================================================

  vliegendeInsecten(`
    Treksprinkhaan=Locusta migratoria;
    Woestijnsprinkhaan=Schistocerca gregaria;
    Egyptische sprinkhaan=Anacridium aegyptium;
    Rode treksprinkhaan=Nomadacris septemfasciata;
    Italiaanse sprinkhaan=Calliptamus italicus;
    Blauwvleugelsprinkhaan=Oedipoda caerulescens;
    Roodvleugelsprinkhaan=Oedipoda germanica;
    Kiezelsprinkhaan=Sphingonotus caerulans;
    Klappersprinkhaan=Psophus stridulus;
    Grote groene sabelsprinkhaan=Tettigonia viridissima;
    Kleine groene sabelsprinkhaan=Tettigonia cantans;
    Grote spitskop=Ruspolia nitidula;
    Gewoon spitskopje=Conocephalus dorsalis;
    Zuidelijk spitskopje=Conocephalus fuscus;
    Krasser=Pseudochorthippus parallelus;
    Bruine sprinkhaan=Chorthippus brunneus;
    Ratelaar=Chorthippus biguttulus;
    Snortikker=Chorthippus mollis;
    Locomotiefje=Chorthippus apricarius;
    Gouden sprinkhaan=Chrysochraon dispar;
    Moerassprinkhaan=Stethophyma grossum;
    Wekkertje=Omocestus viridulus;
    Negertje=Omocestus rufipes;
    Huiskrekel=Acheta domesticus;
    Steppekrekel=Gryllus assimilis;
    Veldkrekel=Gryllus campestris;
    Boomkrekel=Oecanthus pellucens;
    Grote boomkrekel;
    Veenmol=Gryllotalpa gryllotalpa
  `);

  // ============================================================
  // CICADEN EN OVERIGE VLIEGENDE INSECTEN
  // ============================================================

  vliegendeInsecten(`
    Cicade;
    Zangcicade;
    Periodieke cicade=Magicicada septendecim;
    Magicicada cassini;
    Magicicada septendecula;
    Gewone schuimcicade=Philaenus spumarius;
    Bloedcicade=Cercopis vulnerata;
    Groene cicade=Cicadella viridis;
    Rododendroncicade=Graphocephala fennahi;
    Rozencicade=Edwardsiana rosae;
    Lantaarncicade=Pyrops candelaria;
    Gevlekte lantaarncicade=Lycorma delicatula;
    Gaasvlieg;
    Groene gaasvlieg=Chrysoperla carnea;
    Goudoogje;
    Bruine gaasvlieg=Hemerobius;
    Mierenleeuw=Myrmeleon formicarius;
    Gevlekte mierenleeuw=Euroleon nostras;
    Vlinderhaft=Libelloides coccajus;
    Schorpioenvlieg;
    Gewone schorpioenvlieg=Panorpa communis;
    Duitse schorpioenvlieg=Panorpa germanica;
    Schietmot;
    Grote schietmot=Phryganea grandis;
    Limnephilus flavicornis;
    Eendagsvlieg;
    Haft;
    Gewone haft=Ephemera vulgata;
    Deense haft=Ephemera danica;
    Oeveraas=Palingenia longicauda;
    Steenvlieg;
    Grote steenvlieg=Perla marginata;
    Elzenvlieg=Sialis lutaria;
    Slangenkopvlieg;
    Kakkerlak;
    Amerikaanse kakkerlak=Periplaneta americana;
    Australische kakkerlak=Periplaneta australasiae;
    Duitse kakkerlak=Blattella germanica;
    Bruinbandkakkerlak=Supella longipalpa;
    Groene bananenkakkerlak=Panchlora nivea;
    Bidsprinkhaan=Mantis religiosa;
    Afrikaanse bidsprinkhaan=Sphodromantis lineola;
    Chinese bidsprinkhaan=Tenodera sinensis;
    Orchideebidsprinkhaan=Hymenopus coronatus;
    Spookbidsprinkhaan=Phyllocrania paradoxa;
    Duivelsbloembidsprinkhaan=Idolomantis diabolica;
    Indische bloembidsprinkhaan=Creobroter pictipennis;
    Wandelend blad;
    Vliegend wandelend blad=Phyllium;
    Gevleugelde mier;
    Vliegende mier;
    Vliegende termiet;
    Bladluis;
    Groene perzikluis=Myzus persicae;
    Zwarte bonenluis=Aphis fabae;
    Groene erwtenluis=Acyrthosiphon pisum;
    Rozenluis=Macrosiphum rosae;
    Witte vlieg;
    Kaswittevlieg=Trialeurodes vaporariorum;
    Tabakswittevlieg=Bemisia tabaci;
    Trips;
    Californische trips=Frankliniella occidentalis
  `);

  // ============================================================
  // CORRECTIES VAN TYPFOUTEN EN NAMEN
  // ============================================================

  function hernoemDier(oudeNaam, nieuweNaam) {
    const oud = normaliseer(oudeNaam);
    const nieuw = normaliseer(nieuweNaam);
    const record = database.get(oud);

    if (!record) return;

    if (oud === nieuw) {
      record.naam = nieuweNaam;
      return;
    }

    if (database.has(nieuw)) {
      samenvoegen(nieuweNaam, oudeNaam);
      return;
    }

    database.delete(oud);
    record.naam = nieuweNaam;
    database.set(nieuw, record);
  }

  hernoemDier("Vijlv is", "Vijlvis");
  hernoemDier("Kli mbaars", "Klimbaars");
  hernoemDier("Zonnecor aal", "Zonnekoraal");
  hernoemDier("Knalg arnaal", "Knalgarnaal");
  hernoemDier("Zevengestr aal de zeester", "Zevengestraalde zeester");
  hernoemDier("Zeelie lie", "Zeelelie");
  hernoemDier("Florid a-weekschildpad", "Florida-weekschildpad");
  hernoemDier("Fijn tandhaai", "Fijntandhaai");
  hernoemDier("Klein tandgitaarrog", "Kleintandgitaarrog");
  hernoemDier("Beenv is", "Beenvis");
  hernoemDier("Killi vis", "Killivis");
  hernoemDier("Vuurstaarta al", "Vuuraal");
  hernoemDier("Prarievalk", "Prairievalk");
  hernoemDier("Lachdalk", "Lachvalk");
  hernoemDier("Wit oogparkiet", "Witoogparkiet");
  hernoemDier("Blau wstrepenlori", "Blauwstrepenlori");
  hernoemDier("Zwart rugspecht", "Zwartrugspecht");
  hernoemDier("Pare lborstzwaluw", "Parelborstzwaluw");
  hernoemDier("Schout edens gierzwaluw", "Schoutedens gierzwaluw");
  hernoemDier("Steenm us", "Steenmus");
  hernoemDier("Vuur snavelarassari", "Vuursnavelarassari");
  hernoemDier("Magoe ari-ooievaar", "Maguari-ooievaar");
  hernoemDier("Stro halsibis", "Strohalsibis");
  hernoemDier("Wit schouderibis", "Witschouderibis");
  hernoemDier("Zwart nekkraanvogel", "Zwartnekkraanvogel");
  hernoemDier("Lava meeuw", "Lavameeuw");
  hernoemDier("Zwart wenkbrauwalbatros", "Zwartwenkbrauwalbatros");
  hernoemDier("Vaalt stormvogeltje", "Vaal stormvogeltje");
  hernoemDier("Kerst eilandfregatvogel", "Kersteilandfregatvogel");
  hernoemDier("Levail lants koekoek", "Levaillants koekoek");
  hernoemDier("Vuur rugfazant", "Vuurrugfazant");
  hernoemDier("Groen kamhoen", "Groenkamhoen");
  hernoemDier("Krul kuifparadijsvogel", "Krulkuifparadijsvogel");
  hernoemDier("Geel schoudervleermuis", "Geelschoudervleermuis");
  hernoemDier("Cecropi a vlinder", "Cecropiavlinder");
  hernoemDier("Berken spanner", "Berkenspanner");
  hernoemDier("Dwerg honingbij", "Dwerghoningbij");
  hernoemDier("Zwart gevlekte smalboktor", "Zwartgevlekte smalboktor");

  // ============================================================
  // SYNONIEMEN SAMENVOEGEN
  // ============================================================

  samenvoegen("Nachtpauwoog", "Kleine nachtpauwoog");
  samenvoegen("Sint-jansvlinder", "Bloeddrupje");
  samenvoegen("Berkenspanner", "Peper-en-zoutvlinder");
  samenvoegen("Zomervlinder", "Grote groene spanner");
  samenvoegen("Gouden tor", "Gouden rozenkever");
  samenvoegen("Hoornaar", "Europese hoornaar");
  samenvoegen("Gewone rupsendoder", "Grote rupsendoder");
  samenvoegen("Egyptische nijlroezet", "Nijlroezet");
  samenvoegen("Grote vliegende hond", "Pteropus vampyrus");
  samenvoegen("Groene gaasvlieg", "Goudoogje");
  samenvoegen("Spaanse vlag", "Euplagia quadripunctaria");
  samenvoegen("Kolibrievlinder", "Macroglossum stellatarum");
  samenvoegen("Appelbladroller", "Fruitmot");
  samenvoegen("Sluipwesp", "Ichneumonid");
  samenvoegen("Gewone doodgraver", "Krompootdoodgraver");
  samenvoegen("Citroenlieveheersbeestje", "Meeldauwlieveheersbeestje");
  samenvoegen(
    "Tweeëntwintigstippelig lieveheersbeestje",
    "Citroenlieveheersbeestje"
  );

  // ============================================================
  // AANVULLENDE CORRECTIES
  // ============================================================

  // Onvoldoende specifieke of twijfelachtige namen.

  verwijderDier("Oranje steppevlinder");
  verwijderDier("Zwartfluweelkolibrie");
  verwijderDier("Bloedvlekspanner");
  verwijderDier("Zweep arme nachtzwaluw");

  dier("Zweep arme nachtzwaluw".replace(" ", ""), [], []);
  verwijderDier("Zweeparmenachtzwaluw");

  dier("Zweepnachtzwaluw", [2, 7, 18, 22, 27, 50], [
    "Antrostomus vociferus"
  ]);

  // Vleermuizen zijn zoogdieren en leggen geen eieren.

  for (const record of database.values()) {
    if (
      record.vragen.has(2) &&
      record.vragen.has(20) &&
      !record.vragen.has(22)
    ) {
      record.vragen.delete(7);
    }
  }

  // De meeste volwassen vrouwelijke glimwormen
  // van deze soort kunnen niet vliegen.
  // Mannetjes kunnen dat wel. Het soortantwoord blijft geldig.

  dier("Grote glimworm", [2, 7, 50]);

  // Bij soorten met sterk verminderde vleugels
  // voorkomen we onterechte vliegkoppelingen.

  verwijderKoppeling("Krasser", [2]);
  verwijderKoppeling("Gewoon spitskopje", [2]);
  verwijderKoppeling("Zuidelijk spitskopje", [2]);
  verwijderKoppeling("Gouden sprinkhaan", [2]);
  verwijderKoppeling("Veldkrekel", [2]);
  verwijderKoppeling("Duitse kakkerlak", [2]);
  verwijderKoppeling("Wandelend blad", [2]);
  verwijderKoppeling("Fazantkoekoek", [15]);

  // ============================================================
  // HERGEBRUIK VAN WATERDIEREN UIT DEEL 1 EN 2
  // ============================================================

  koppelDieren(`
    Schrijvertje;
    Gewone schaatsenrijder;
    Geelgerande waterroofkever;
    Brede geelgerande waterroofkever;
    Grote spinnende watertor;
    Kleine spinnende watertor;
    Duikerwants;
    Bootsman;
    Waterschorpioen;
    Staafwants;
    Reuzenwaterwants
  `, [2]);

  // Libellenlarven kunnen nog niet vliegen.
  // Ze blijven beschikbaar als waterdieren.

  verwijderKoppeling("Libellenlarve", [2]);
  verwijderKoppeling("Waterjufferlarve", [2]);
  verwijderKoppeling("Muggenlarve", [2]);
  verwijderKoppeling("Dansmuglarve", [2]);
  verwijderKoppeling("Schietmotlarve", [2]);
  verwijderKoppeling("Eendagsvlieglarve", [2]);

  // ============================================================
  // VRAAG 15: DIEREN DIE INSECTEN ETEN
  // ============================================================

  koppelDieren(`
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Kleine dwergvleermuis;
    Gewone grootoorvleermuis;
    Grijze grootoorvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Bosvleermuis;
    Watervleermuis;
    Meervleermuis;
    Franjestaart;
    Baardvleermuis;
    Bechsteins vleermuis;
    Vale vleermuis;
    Ingekorven vleermuis;
    Mopsvleermuis;
    Grote hoefijzerneus;
    Kleine hoefijzerneus;
    Hommelvleermuis;
    Roodborst;
    Winterkoning;
    Heggenmus;
    Boomkruiper;
    Boomklever;
    Goudhaan;
    Vuurgoudhaan;
    Fitis;
    Tjiftjaf;
    Fluiter;
    Nachtegaal;
    Zwartkop;
    Grasmus;
    Spotvogel;
    Rietzanger;
    Kleine karekiet;
    Grote karekiet;
    Paapje;
    Tapuit;
    Bonte vliegenvanger;
    Grauwe vliegenvanger;
    Nachtzwaluw;
    Gewone schorpioenvlieg;
    Bidsprinkhaan;
    Orchideebidsprinkhaan;
    Gewone roofvlieg;
    Hoornaarroofvlieg;
    Groene zandloopkever;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Hoornaar;
    Aziatische hoornaar;
    Bijenwolf;
    Rupsendoder;
    Gewone wesp;
    Duitse wesp
  `, [15]);

  // ============================================================
  // VRAAG 26: DIEREN IN NEDERLAND
  // ============================================================

  koppelDieren(`
    Roodborst;
    Winterkoning;
    Heggenmus;
    Boomklever;
    Boomkruiper;
    Goudhaan;
    Vuurgoudhaan;
    Tjiftjaf;
    Fitis;
    Fluiter;
    Zwartkop;
    Tuinfluiter;
    Grasmus;
    Braamsluiper;
    Nachtegaal;
    Blauwborst;
    Gekraagde roodstaart;
    Zwarte roodstaart;
    Roodborsttapuit;
    Paapje;
    Tapuit;
    Witte kwikstaart;
    Gele kwikstaart;
    Grote gele kwikstaart;
    Graspieper;
    Boompieper;
    Rietgors;
    Geelgors;
    Veldleeuwerik;
    Boomleeuwerik;
    Wielewaal;
    Blauwe reiger;
    Purperreiger;
    Grote zilverreiger;
    Kleine zilverreiger;
    Roerdomp;
    Woudaap;
    Ooievaar;
    Lepelaar;
    Kokmeeuw;
    Zilvermeeuw;
    Stormmeeuw;
    Kleine mantelmeeuw;
    Grote mantelmeeuw;
    Visdief;
    Dwergstern;
    Grote stern;
    Noordse stern;
    Zwarte stern;
    Scholekster;
    Kluut;
    Kievit;
    Grutto;
    Wulp;
    Tureluur;
    Oeverloper;
    Steenloper;
    Bonte strandloper;
    Watersnip;
    Houtsnip;
    Koekoek;
    Fazant;
    Patrijs;
    Kwartel;
    Nachtzwaluw;
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Kleine dwergvleermuis;
    Gewone grootoorvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Watervleermuis;
    Meervleermuis;
    Franjestaart;
    Dagpauwoog;
    Kleine vos;
    Atalanta;
    Distelvlinder;
    Gehakkelde aurelia;
    Landkaartje;
    Citroenvlinder;
    Groot koolwitje;
    Klein koolwitje;
    Klein geaderd witje;
    Oranjetipje;
    Koninginnenpage;
    Icarusblauwtje;
    Boomblauwtje;
    Kleine vuurvlinder;
    Bruin zandoogje;
    Bont zandoogje;
    Oranje zandoogje;
    Koevinkje;
    Hooibeestje;
    Argusvlinder;
    Groot dikkopje;
    Kolibrievlinder;
    Gamma-uil;
    Grote beer;
    Buxusmot;
    Honingbij;
    Aardhommel;
    Akkerhommel;
    Steenhommel;
    Tuinhommel;
    Boomhommel;
    Weidehommel;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Aziatische hoornaar;
    Franse veldwesp;
    Grote keizerlibel;
    Blauwe glazenmaker;
    Bruine glazenmaker;
    Paardenbijter;
    Gewone oeverlibel;
    Platbuik;
    Viervlek;
    Weidebeekjuffer;
    Bosbeekjuffer;
    Lantaarntje;
    Azuurwaterjuffer;
    Vuurjuffer;
    Bloedrode heidelibel;
    Bruinrode heidelibel;
    Huisvlieg;
    Fruitvlieg;
    Gewone steekmug;
    Langpootmug;
    Stadsreus;
    Blinde bij;
    Meikever;
    Junikever;
    Neushoornkever;
    Vliegend hert;
    Gouden tor;
    Zevenstippelig lieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Coloradokever;
    Elzenhaantje;
    Grote groene sabelsprinkhaan;
    Ratelaar;
    Bruine sprinkhaan;
    Veenmol;
    Groene gaasvlieg;
    Gewone schorpioenvlieg
  `, [26]);

  // ============================================================
  // VRAAG 27: NACHTACTIEVE DIEREN
  // ============================================================

  koppelDieren(`
    Vleermuis;
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Kleine dwergvleermuis;
    Gewone grootoorvleermuis;
    Grijze grootoorvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Bosvleermuis;
    Watervleermuis;
    Meervleermuis;
    Franjestaart;
    Vale vleermuis;
    Baardvleermuis;
    Mopsvleermuis;
    Grote hoefijzerneus;
    Kleine hoefijzerneus;
    Gewone vampier;
    Vampiervleermuis;
    Nachtvlinder;
    Mot;
    Atlasvlinder;
    Herculesvlinder;
    Nachtpauwoog;
    Grote nachtpauwoog;
    Lunavlinder;
    Doodshoofdvlinder;
    Ligusterpijlstaart;
    Windepijlstaart;
    Pauwoogpijlstaart;
    Populierenpijlstaart;
    Groot avondrood;
    Klein avondrood;
    Huismoeder;
    Grote beer;
    Buxusmot;
    Klerenmot;
    Meelmot;
    Neushoornkever;
    Junikever;
    Vliegend hert;
    Grote glimworm;
    Vuurvliegje;
    Amerikaanse kakkerlak;
    Nachtzwaluw;
    Vetvogel;
    Gewone potoo
  `, [27]);

  // ============================================================
  // VRAAG 28: WINTERSLAAP
  // ============================================================

  koppelDieren(`
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Kleine dwergvleermuis;
    Gewone grootoorvleermuis;
    Grijze grootoorvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Bosvleermuis;
    Watervleermuis;
    Meervleermuis;
    Franjestaart;
    Vale vleermuis;
    Baardvleermuis;
    Bechsteins vleermuis;
    Mopsvleermuis;
    Grote hoefijzerneus;
    Kleine hoefijzerneus;
    Kleine bruine vleermuis;
    Grote bruine vleermuis;
    Indianavleermuis
  `, [28]);

  // ============================================================
  // VRAAG 10: KLEINER DAN EEN MUIS
  // ============================================================

  koppelDieren(`
    Bijkolibrie;
    Dwergkolibrie;
    Hommelvleermuis;
    Honingbij;
    Bij;
    Hommel;
    Aardhommel;
    Akkerhommel;
    Steenhommel;
    Wesp;
    Gewone wesp;
    Duitse wesp;
    Sluipwesp;
    Galwesp;
    Fruitvlieg;
    Huisvlieg;
    Steekmug;
    Mug;
    Dansmug;
    Knut;
    Kriebelmug;
    Zandvlieg;
    Witte vlieg;
    Bladluis;
    Trips;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Klerenmot;
    Meelmot;
    Koolmot;
    Buxusmot;
    Groene gaasvlieg;
    Vuurgarnaal;
    Watervlo;
    Grote watervlo;
    Kleine watervlo;
    Eenoogkreeftje;
    Mosselkreeftje
  `, [10]);

  // ============================================================
  // VRAAG 29: SNELLE DIEREN
  // ============================================================

  koppelDieren(`
    Slechtvalk;
    Giervalk;
    Steenarend;
    Gierzwaluw;
    Alpengierzwaluw;
    Witkeelstekelstaartgierzwaluw;
    Boomvalk;
    Mexicaanse vrijstaartvleermuis;
    Grote keizerlibel;
    Libel;
    Kolibrievlinder;
    Zeilvis;
    Zwaardvis;
    Makreelhaai;
    Blauwvintonijn;
    Geelvintonijn
  `, [29]);

  // ============================================================
  // VRAAG 36: DIEREN MET EEN LANGE NEK
  // ============================================================

  koppelDieren(`
    Flamingo;
    Grote flamingo;
    Rode flamingo;
    Kleine flamingo;
    Chileense flamingo;
    Andesflamingo;
    Jamesflamingo;
    Ooievaar;
    Zwarte ooievaar;
    Zadelbekooievaar;
    Blauwe reiger;
    Purperreiger;
    Grote zilverreiger;
    Goliathreiger;
    Kraanvogel;
    Japanse kraanvogel;
    Saruskraanvogel;
    Zwaan;
    Knobbelzwaan;
    Wilde zwaan;
    Zwarte zwaan;
    Zwarthalszwaan;
    Slangenhalsvogel;
    Afrikaanse slangenhalsvogel;
    Amerikaanse slangenhalsvogel
  `, [36]);

  // ============================================================
  // VRAAG 40: DIEREN DIE IN GROEPEN LEVEN
  // ============================================================

  koppelDieren(`
    Honingbij;
    Aziatische honingbij;
    Reuzenhoningbij;
    Dwerghoningbij;
    Aardhommel;
    Akkerhommel;
    Steenhommel;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Aziatische hoornaar;
    Treksprinkhaan;
    Woestijnsprinkhaan;
    Flamingo;
    Grote flamingo;
    Rode flamingo;
    Kleine flamingo;
    Chileense flamingo;
    Spreeuw;
    Huismus;
    Kauw;
    Roek;
    Stadsduif;
    Rotgans;
    Brandgans;
    Grauwe gans;
    Canadese gans;
    Pinguïn;
    Keizerspinguïn;
    Koningspinguïn;
    Brilpinguïn;
    Humboldtpinguïn;
    Gewone zeehond;
    Grijze zeehond;
    Walrus;
    Dolfijn;
    Tuimelaar;
    Orka;
    Griend;
    Haring;
    Sardine;
    Ansjovis;
    Makreel;
    Sprot;
    Krill
  `, [40]);

  // ============================================================
  // VRAAG 41: NESTEN BOUWEN
  // ============================================================

  koppelDieren(`
    Ooievaar;
    Zwarte ooievaar;
    Blauwe reiger;
    Grote zilverreiger;
    Merel;
    Zanglijster;
    Houtduif;
    Ekster;
    Zwarte kraai;
    Raaf;
    Gaai;
    Winterkoning;
    Roodborst;
    Vink;
    Huismus;
    Ringmus;
    Boerenzwaluw;
    Huiszwaluw;
    Buidelmees;
    Staartmees;
    Meerkoet;
    Waterhoen;
    Knobbelzwaan;
    Fuut;
    Steenarend;
    Zeearend;
    Visarend;
    Buizerd;
    Havik;
    Sperwer;
    Flamingo;
    Grote flamingo;
    Honingbij;
    Aardhommel;
    Akkerhommel;
    Boomhommel;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Aziatische hoornaar;
    Franse veldwesp;
    Rosse metselbij;
    Gehoornde metselbij;
    Grote wolbij;
    Blauwe houtbij;
    Bijenwolf
  `, [41]);

  // ============================================================
  // VRAAG 47: OPVALLENDE KLEUREN
  // ============================================================

  koppelDieren(`
    Dagpauwoog;
    Atalanta;
    Kleine vos;
    Distelvlinder;
    Koninginnenpage;
    Koningspage;
    Citroenvlinder;
    Oranjetipje;
    Icarusblauwtje;
    Adonisblauwtje;
    Boomblauwtje;
    Grote vuurvlinder;
    Kleine vuurvlinder;
    Monarchvlinder;
    Blauwe morpho;
    Zebravlinder;
    Spaanse vlag;
    Sint-jansvlinder;
    Sint-jacobsvlinder;
    Grote beer;
    Lunavlinder;
    Oleanderpijlstaart;
    Atlasvlinder;
    Madagaskarmaanvlinder;
    Blauwe houtbij;
    Gouden tor;
    Regenboogvliegendhert;
    Zevenstippelig lieveheersbeestje;
    Bloedrode heidelibel;
    Vuurlibel;
    Purperlibel;
    Weidebeekjuffer;
    Bosbeekjuffer;
    Grote keizerlibel;
    Orchideebidsprinkhaan;
    Flamingo;
    Rode flamingo;
    Rode ibis;
    Roze lepelaar;
    Goudfazant;
    Diamantfazant;
    Pauw;
    Groene pauw;
    Paradijsvogel;
    Rode paradijsvogel;
    Blauwe paradijsvogel;
    Wilsons paradijsvogel;
    Koningsparadijsvogel;
    Robijnkeelkolibrie;
    Annakolibrie;
    Goudstaartsaffier;
    Vuurstaarttopaaskolibrie;
    Regenbooglori
  `, [47]);

  // ============================================================
  // VRAAG 48: STREPEN
  // ============================================================

  koppelDieren(`
    Zebravlinder;
    Monarchvlinder;
    Koninginnenpage;
    Koningspage;
    Coloradokever;
    Honingbij;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Aziatische hoornaar;
    Aardhommel;
    Steenhommel;
    Tuinhommel;
    Weidehommel;
    Gelekoortsmug;
    Aziatische tijgermug;
    Gestreepte pijlstaart;
    Gestreepte koekoek;
    Gestreepte specht;
    Gestreepte ransuil;
    Gestreepte bosuil;
    Zebraduif;
    Grasparkiet
  `, [48]);

  // ============================================================
  // VRAAG 49: STIPPEN EN VLEKKEN
  // ============================================================

  koppelDieren(`
    Dagpauwoog;
    Kleine vos;
    Grote vos;
    Atalanta;
    Distelvlinder;
    Argusvlinder;
    Bont zandoogje;
    Oranje zandoogje;
    Bruin zandoogje;
    Heivlinder;
    Apollovlinder;
    Nachtpauwoog;
    Grote nachtpauwoog;
    Pauwoogpijlstaart;
    Sint-jansvlinder;
    Grote beer;
    Spaanse vlag;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Tienstippelig lieveheersbeestje;
    Elfstippelig lieveheersbeestje;
    Veertienstippelig lieveheersbeestje;
    Tweeëntwintigstippelig lieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Oogvleklieveheersbeestje;
    Roomvleklieveheersbeestje;
    Vierbandsmalboktor;
    Gevlekte lantaarncicade;
    Gevlekte vleermuis;
    Gevlekte prieelvogel;
    Parelhalstortel;
    Prachtparelmoervlinder
  `, [49]);

  // ============================================================
  // VRAAG 39: DIEREN OP HET STRAND
  // ============================================================

  koppelDieren(`
    Zilvermeeuw;
    Kokmeeuw;
    Stormmeeuw;
    Grote mantelmeeuw;
    Kleine mantelmeeuw;
    Scholekster;
    Strandplevier;
    Bontbekplevier;
    Drieteenstrandloper;
    Bonte strandloper;
    Steenloper;
    Wulp;
    Strandkrab;
    Noordzeekrab;
    Gewone zwemkrab;
    Fluwelen zwemkrab;
    Noordzeegarnaal;
    Gewone zeester;
    Gewone slangster;
    Zeeklit;
    Mossel;
    Japanse oester;
    Platte oester;
    Kokkel;
    Strandgaper;
    Nonnetje;
    Zaagje;
    Wulk;
    Alikruik;
    Schaalhoren;
    Zeepier;
    Zandworm;
    Zeepok;
    Eendenmossel;
    Gewone zeehond;
    Grijze zeehond;
    Oorkwal;
    Kompaskwal;
    Zeepaddenstoel
  `, [39]);

  // ============================================================
  // CONTROLE VAN ALLE TOT NU TOE TOEGEVOEGDE RECORDS
  // ============================================================

  const samengevoegdDeel4 =
    controleerDubbeleDieren();

  console.log(
    "QuizBallon V9 - deel 4 - dubbele records samengevoegd:",
    samengevoegdDeel4
  );

  console.log(
    "QuizBallon V9 - totaal opgeslagen dierrecords:",
    database.size
  );

  console.table(
    vragen.map((tekst, index) => {
      const aantal = aantalAntwoorden(index + 1);

      return {
        nummer: index + 1,
        vraag: tekst,
        antwoorden: aantal,
        raketten: aantalRaketten(aantal),
        streefaantal: 1000,
        ontbrekend: Math.max(0, 1000 - aantal),
        doelBereikt: aantal >= 1000
      };
    })
  );

  // ============================================================
  // EINDE DEEL 4
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 5
  // LANDZOOGDIEREN
  // ============================================================

  function zoogdieren(tekst, extra = []) {
    groep(tekst, [50, ...extra]);
  }

  function viervoeters(tekst, extra = []) {
    zoogdieren(tekst, [4, ...extra]);
  }

  // ============================================================
  // KATACHTIGEN
  // ============================================================

  viervoeters(`
    Leeuw=Panthera leo;
    Tijger=Panthera tigris;
    Luipaard=Panthera pardus;
    Jaguar=Panthera onca;
    Sneeuwluipaard=Panthera uncia;
    Jachtluipaard=Cheeta=Cheetah=Acinonyx jubatus;
    Poema=Cougar=Bergleeuw=Puma concolor;
    Europese lynx=Lynx lynx;
    Canadese lynx=Lynx canadensis;
    Iberische lynx=Lynx pardinus;
    Rode lynx=Bobcat=Lynx rufus;
    Lynx;
    Caracal=Caracal caracal;
    Serval=Leptailurus serval;
    Ocelot=Leopardus pardalis;
    Margay=Leopardus wiedii;
    Geoffroykat=Leopardus geoffroyi;
    Chileense kat=Kodkod=Leopardus guigna;
    Andeskat=Leopardus jacobita;
    Pampakat;
    Tijgerkat=Leopardus tigrinus;
    Zuidelijke tijgerkat=Leopardus guttulus;
    Nevelpanter=Neofelis nebulosa;
    Borneose nevelpanter=Neofelis diardi;
    Goudkat=Caracal aurata;
    Aziatische goudkat=Catopuma temminckii;
    Borneokat=Catopuma badia;
    Marmerkat=Pardofelis marmorata;
    Vissende kat=Prionailurus viverrinus;
    Bengaalse tijgerkat=Prionailurus bengalensis;
    Platkopkat=Prionailurus planiceps;
    Roestkat=Prionailurus rubiginosus;
    Manoel=Pallaskat=Otocolobus manul;
    Zandkat=Felis margarita;
    Zwartvoetkat=Felis nigripes;
    Europese wilde kat=Felis silvestris;
    Afrikaanse wilde kat=Felis lybica;
    Moeraskat=Felis chaus;
    Chinese bergkat=Felis bieti;
    Huiskat=Kat=Felis catus
  `, [17, 18, 20]);

  koppelDieren(`
    Leeuw;
    Tijger;
    Luipaard;
    Jaguar;
    Sneeuwluipaard;
    Jachtluipaard;
    Poema;
    Nevelpanter;
    Europese lynx;
    Serval;
    Caracal;
    Ocelot
  `, [3]);

  koppelDieren(`
    Leeuw;
    Luipaard;
    Jachtluipaard;
    Serval;
    Caracal;
    Goudkat;
    Zwartvoetkat;
    Afrikaanse wilde kat
  `, [5]);

  koppelDieren(`
    Tijger;
    Jaguar;
    Luipaard;
    Ocelot;
    Margay;
    Nevelpanter;
    Borneose nevelpanter;
    Marmerkat;
    Borneokat;
    Aziatische goudkat
  `, [12]);

  koppelDieren(`
    Jachtluipaard;
    Leeuw;
    Tijger;
    Poema;
    Luipaard;
    Caracal;
    Jaguar
  `, [29]);

  koppelDieren(`
    Luipaard;
    Jaguar;
    Margay;
    Marmerkat;
    Nevelpanter;
    Borneose nevelpanter;
    Poema;
    Huiskat;
    Ocelot
  `, [35]);

  koppelDieren(`
    Luipaard;
    Jaguar;
    Jachtluipaard;
    Serval;
    Ocelot;
    Margay;
    Roestkat;
    Bengaalse tijgerkat;
    Vissende kat;
    Nevelpanter;
    Borneose nevelpanter;
    Sneeuwluipaard
  `, [49]);

  koppelDieren("Tijger", [48]);
  koppelDieren("Huiskat", [8, 34, 35]);
  koppelDieren("Sneeuwluipaard; Canadese lynx; Manoel", [24]);
  koppelDieren("Zandkat; Caracal", [25]);

  // Tijgerondersoorten

  viervoeters(`
    Bengaalse tijger;
    Siberische tijger=Amoertijger;
    Sumatraanse tijger;
    Maleise tijger;
    Indochinese tijger;
    Zuid-Chinese tijger
  `, [17, 18, 20, 48]);

  // Uitgestorven tijgerpopulaties

  groep(`
    Javaanse tijger;
    Balinese tijger;
    Kaspische tijger
  `, [43, 50]);

  // Kattenrassen

  viervoeters(`
    Maine coon;
    Britse korthaar;
    Britse langhaar;
    Siamese kat;
    Perzische kat;
    Ragdoll;
    Bengaal;
    Noorse boskat;
    Siberische kat;
    Russische blauwe kat;
    Blauwe rus;
    Abessijn;
    Somali;
    Burmees;
    Heilige birmaan;
    Tonkanees;
    Bombaykat;
    Chartreux;
    Korat;
    Egyptische mau;
    Ocicat;
    Savannahkat;
    Toyger;
    Sphynx;
    Devon rex;
    Cornish rex;
    Selkirk rex;
    LaPerm;
    Scottish fold;
    American curl;
    Amerikaanse korthaar;
    Europese korthaar;
    Turkse angora;
    Turkse van;
    Japanse bobtail;
    Kurilenbobtail;
    Manx;
    Cymric;
    Singapura;
    Munchkin;
    Peterbald;
    Donskoy;
    Oosterse korthaar;
    Oosterse langhaar;
    Balinees;
    Snowshoe;
    Ragamuffin;
    Burmilla;
    Chausie;
    Pixiebob;
    Nebelung
  `, [8, 35]);

  samenvoegen("Russische blauwe kat", "Blauwe rus");

  // ============================================================
  // HONDACHTIGEN
  // ============================================================

  viervoeters(`
    Hond=Canis lupus familiaris;
    Wolf=Canis lupus;
    Rode wolf=Canis rufus;
    Ethiopische wolf=Canis simensis;
    Coyote=Canis latrans;
    Goudjakhals=Canis aureus;
    Afrikaanse goudwolf=Canis lupaster;
    Zadeljakhals=Lupulella mesomelas;
    Gestreepte jakhals=Lupulella adusta;
    Afrikaanse wilde hond=Lycaon pictus;
    Aziatische wilde hond=Dhole=Cuon alpinus;
    Dingo;
    Vos=Fox;
    Rode vos=Vulpes vulpes;
    Poolvos=Vulpes lagopus;
    Woestijnvos=Fennek=Vulpes zerda;
    Steppevos=Vulpes corsac;
    Bengaalse vos=Vulpes bengalensis;
    Kaapse vos=Vulpes chama;
    Tibetaanse vos=Vulpes ferrilata;
    Afghaanse vos=Vulpes cana;
    Bleke vos=Vulpes pallida;
    Rüppells vos=Vulpes rueppellii;
    Kitvos=Vulpes macrotis;
    Swiftvos=Vulpes velox;
    Grijze vos=Urocyon cinereoargenteus;
    Eilandvos=Urocyon littoralis;
    Grootoorvos=Otocyon megalotis;
    Manenwolf=Chrysocyon brachyurus;
    Boshond=Speothos venaticus;
    Wasbeerhond=Nyctereutes procyonoides;
    Kortoorvos=Atelocynus microtis;
    Krabbenetende vos=Cerdocyon thous;
    Darwinvos=Lycalopex fulvipes;
    Andesvos=Lycalopex culpaeus;
    Argentijnse grijze vos=Lycalopex griseus;
    Pampavos=Lycalopex gymnocercus;
    Sechuravos=Lycalopex sechurae;
    Braziliaanse grijze vos=Lycalopex vetulus
  `, [18, 20]);

  koppelDieren(`
    Wolf;
    Rode wolf;
    Ethiopische wolf;
    Coyote;
    Goudjakhals;
    Afrikaanse goudwolf;
    Zadeljakhals;
    Afrikaanse wilde hond;
    Aziatische wilde hond;
    Dingo;
    Rode vos;
    Poolvos;
    Woestijnvos;
    Boshond
  `, [17]);

  koppelDieren(`
    Ethiopische wolf;
    Afrikaanse goudwolf;
    Zadeljakhals;
    Gestreepte jakhals;
    Afrikaanse wilde hond;
    Woestijnvos;
    Kaapse vos;
    Grootoorvos;
    Bleke vos;
    Rüppells vos
  `, [5]);

  koppelDieren(`
    Wolf;
    Afrikaanse wilde hond;
    Aziatische wilde hond;
    Boshond
  `, [40]);

  koppelDieren(`
    Wolf;
    Rode vos;
    Wasbeerhond;
    Grijze vos
  `, [6]);

  koppelDieren(`
    Rode vos;
    Wolf;
    Wasbeerhond
  `, [26]);

  koppelDieren(`
    Poolvos;
    Wolf
  `, [24]);

  koppelDieren(`
    Woestijnvos;
    Kitvos;
    Rüppells vos;
    Bleke vos
  `, [25]);

  koppelDieren("Dingo", [23]);
  koppelDieren("Hond", [8, 14, 34]);

  // HONDENRASSEN

  viervoeters(`
    Labrador retriever=Labrador;
    Golden retriever;
    Duitse herder;
    Mechelse herder=Malinois;
    Hollandse herder;
    Belgische herder;
    Tervuerense herder;
    Groenendaeler;
    Laekense herder;
    Australische herder=Australian shepherd;
    Bordercollie=Border collie;
    Schotse collie;
    Shetland sheepdog=Sheltie;
    Bearded collie;
    Old English sheepdog=Bobtail;
    Welsh corgi pembroke;
    Welsh corgi cardigan;
    Corgi;
    Chihuahua;
    Franse buldog;
    Engelse buldog;
    Amerikaanse buldog;
    Bostonterriër;
    Mopshond=Pug;
    Boxer;
    Rottweiler;
    Dobermann;
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
    Tibetaanse mastiff;
    Engelse mastiff;
    Bullmastiff;
    Napolitaanse mastiff;
    Bordeauxdog;
    Cane corso;
    Dogo argentino;
    Fila brasileiro;
    Boerboel;
    Akita;
    Shiba inu;
    Amerikaanse akita;
    Kishu;
    Shikoku;
    Hokkaido;
    Kai ken;
    Chowchow;
    Shar-pei;
    Siberische husky;
    Alaskan malamute;
    Samojeed;
    Groenlandse hond;
    Canadese eskimohond;
    Finse spits;
    Finse lappenhond;
    Zweedse lappenhond;
    Noorse elandhond;
    Noorse lundehond;
    IJslandse hond;
    Keeshond;
    Dwergkees=Pomeranian;
    Japanse spits;
    Volpino italiano;
    Eurasier;
    Basenji;
    Beagle;
    Basset hound;
    Bloedhond;
    Dalmatiër;
    Rhodesian ridgeback;
    Foxhound;
    Amerikaanse foxhound;
    Harrier;
    Otterhound;
    Petit basset griffon vendéen;
    Grand basset griffon vendéen;
    Teckel=Dachshund;
    Jackrussellterriër;
    Parsonrussellterriër;
    Yorkshireterriër;
    West Highland white terrier=Westie;
    Schotse terriër;
    Cairnterriër;
    Norwichterriër;
    Norfolkterriër;
    Airedaleterriër;
    Welsh terrier;
    Borderterriër;
    Foxterriër;
    Ierse terriër;
    Kerry blue terrier;
    Bedlingtonterriër;
    Bullterriër;
    Miniatuurbullterriër;
    Staffordshire-bullterriër;
    American staffordshire terrier;
    Australische terriër;
    Australische silkyterriër;
    Poedel;
    Dwergpoedel;
    Toypoedel;
    Koningspoedel;
    Bichon frisé;
    Maltezer;
    Havanezer;
    Bolognezer;
    Coton de Tuléar;
    Löwchen;
    Shih tzu;
    Lhasa apso;
    Tibetaanse terriër;
    Tibetaanse spaniël;
    Pekinees;
    Japanse chin;
    Papillon;
    Phalène;
    Cavalier king charles spaniël;
    King charles spaniël;
    Engelse cockerspaniël;
    Amerikaanse cockerspaniël;
    Engelse springerspaniël;
    Welsh springerspaniël;
    Clumberspaniël;
    Sussexspaniël;
    Fieldspaniël;
    Ierse waterspaniël;
    Portugese waterhond;
    Spaanse waterhond;
    Lagotto romagnolo;
    Barbet;
    Curly coated retriever;
    Flatcoated retriever;
    Chesapeake bay retriever;
    Nova Scotia duck tolling retriever;
    Weimaraner;
    Vizsla;
    Duitse staande korthaar;
    Duitse staande draadhaar;
    Duitse staande langhaar;
    Engelse pointer;
    Engelse setter;
    Ierse setter;
    Gordonsetter;
    Bretonse spaniël;
    Drentsche patrijshond;
    Stabijhoun=Friese stabij;
    Wetterhoun;
    Kooikerhondje;
    Schapendoes;
    Markiesje;
    Nederlandse schipperke;
    Schnauzer;
    Dwergschnauzer;
    Riesenschnauzer;
    Duitse pinscher;
    Dwergpinscher;
    Affenpinscher;
    Greyhound;
    Whippet;
    Italiaanse windhond;
    Afghaanse windhond;
    Saluki;
    Sloughi;
    Azawakh;
    Barzoi;
    Ierse wolfshond;
    Schotse deerhound;
    Spaanse galgo;
    Pharaohond;
    Podenco ibicenco;
    Podenco canario;
    Mexicaanse naakthond=Xoloitzcuintle;
    Peruaanse naakthond;
    Chinese naakthond;
    Briard;
    Beauceron;
    Bouvier des Flandres;
    Bergamasco;
    Komondor;
    Kuvasz;
    Puli;
    Pumi;
    Mudi;
    Poolse laaglandherder;
    Tatraherder;
    Anatolische herder;
    Kangal;
    Kaukasische herder;
    Centraal-Aziatische herder;
    Tsjechoslowaakse wolfhond;
    Saarlooswolfhond;
    Australische cattle dog;
    Australische kelpie;
    Labradoodle;
    Goldendoodle;
    Cockapoo;
    Cavapoo;
    Maltipoo
  `, [8]);

  hernoemDier(
    "Nederlandse schipperke",
    "Schipperke"
  );

  // ============================================================
  // BEREN
  // ============================================================

  viervoeters(`
    Beer=Bear;
    Bruine beer=Ursus arctos;
    Grizzlybeer;
    Kodiakbeer;
    Europese bruine beer;
    Siberische bruine beer;
    Himalayabeer;
    Syrische bruine beer;
    IJsbeer=Ursus maritimus;
    Amerikaanse zwarte beer=Ursus americanus;
    Aziatische zwarte beer=Ursus thibetanus;
    Lippenbeer=Melursus ursinus;
    Maleise beer=Helarctos malayanus;
    Brilbeer=Tremarctos ornatus;
    Reuzenpanda=Panda=Ailuropoda melanoleuca
  `, [18, 20]);

  koppelDieren(`
    Bruine beer;
    Grizzlybeer;
    Kodiakbeer;
    IJsbeer;
    Amerikaanse zwarte beer;
    Aziatische zwarte beer;
    Lippenbeer;
    Maleise beer;
    Brilbeer;
    Reuzenpanda
  `, [3]);

  koppelDieren(`
    Bruine beer;
    Grizzlybeer;
    Kodiakbeer;
    Europese bruine beer;
    IJsbeer;
    Amerikaanse zwarte beer
  `, [9]);

  koppelDieren(`
    Bruine beer;
    Grizzlybeer;
    Kodiakbeer;
    Europese bruine beer;
    Amerikaanse zwarte beer;
    Aziatische zwarte beer
  `, [28]);

  koppelDieren(`
    IJsbeer;
    Bruine beer;
    Grizzlybeer;
    Kodiakbeer;
    Amerikaanse zwarte beer
  `, [14]);

  koppelDieren(`
    Amerikaanse zwarte beer;
    Aziatische zwarte beer;
    Maleise beer;
    Brilbeer;
    Reuzenpanda
  `, [35]);

  koppelDieren(`
    Bruine beer;
    Europese bruine beer;
    Amerikaanse zwarte beer;
    Aziatische zwarte beer;
    Brilbeer;
    Maleise beer;
    Reuzenpanda
  `, [6]);

  koppelDieren("IJsbeer", [17, 24]);
  koppelDieren("Reuzenpanda", [16, 49]);

  // ============================================================
  // HYENA'S
  // ============================================================

  viervoeters(`
    Hyena;
    Gevlekte hyena=Crocuta crocuta;
    Gestreepte hyena=Hyaena hyaena;
    Bruine hyena=Parahyaena brunnea;
    Aardwolf=Proteles cristata
  `, [5, 18, 20]);

  koppelDieren(`
    Hyena;
    Gevlekte hyena;
    Gestreepte hyena;
    Bruine hyena
  `, [17]);

  koppelDieren("Aardwolf", [15]);
  koppelDieren("Gevlekte hyena", [40, 49]);
  koppelDieren("Gestreepte hyena", [48]);

  // ============================================================
  // MARTERACHTIGEN
  // ============================================================

  viervoeters(`
    Marter;
    Boommarter=Martes martes;
    Steenmarter=Martes foina;
    Amerikaanse marter=Martes americana;
    Japanse marter=Martes melampus;
    Sabelmarter=Martes zibellina;
    Geelkeelmarter=Martes flavigula;
    Nilgirimarter=Martes gwatkinsii;
    Vissermarter=Pekania pennanti;
    Veelvraat=Gulo gulo;
    Wezel=Mustela nivalis;
    Hermelijn=Mustela erminea;
    Bunzing=Mustela putorius;
    Fret=Mustela furo;
    Siberische wezel=Mustela sibirica;
    Langstaartwezel=Neogale frenata;
    Bergwezel=Mustela altaica;
    Steppebunzing=Mustela eversmanii;
    Zwartvoetbunzing=Mustela nigripes;
    Europese nerts=Mustela lutreola;
    Amerikaanse nerts=Neogale vison;
    Gestreepte bunzing=Ictonyx striatus;
    Libische gestreepte bunzing=Ictonyx libycus;
    Gemarmerde bunzing=Vormela peregusna;
    Europese das=Das=Meles meles;
    Aziatische das=Meles leucurus;
    Japanse das=Meles anakuma;
    Kaukasische das=Meles canescens;
    Amerikaanse das=Taxidea taxus;
    Honingdas=Mellivora capensis;
    Varkensdas;
    Grote varkensdas=Arctonyx collaris;
    Birmaanse fretbadger=Melogale personata;
    Chinese fretdas=Melogale moschata;
    Javaanse fretdas=Melogale orientalis;
    Tayra=Eira barbara;
    Grote grison=Galictis vittata;
    Kleine grison=Galictis cuja;
    Patagonische wezel=Lyncodon patagonicus;
    Afrikaanse gestreepte wezel=Poecilogale albinucha
  `, [18, 20]);

  koppelDieren(`
    Boommarter;
    Steenmarter;
    Wezel;
    Hermelijn;
    Bunzing;
    Fret;
    Europese das;
    Amerikaanse nerts
  `, [26]);

  koppelDieren(`
    Boommarter;
    Steenmarter;
    Amerikaanse marter;
    Sabelmarter;
    Geelkeelmarter;
    Tayra
  `, [35]);

  koppelDieren(`
    Wezel;
    Hermelijn;
    Bunzing;
    Amerikaanse nerts;
    Europese nerts;
    Veelvraat
  `, [17]);

  koppelDieren(`
    Europese das;
    Amerikaanse das;
    Honingdas;
    Aziatische das
  `, [32]);

  koppelDieren("Fret", [8]);

  // ============================================================
  // WASBEREN EN KLEINE PANDA'S
  // ============================================================

  viervoeters(`
    Wasbeer=Procyon lotor;
    Krabbenetende wasbeer=Procyon cancrivorus;
    Cozumelwasbeer=Procyon pygmaeus;
    Neusbeer;
    Rode neusbeer=Nasua nasua;
    Witsnuitneusbeer=Nasua narica;
    Bergneusbeer=Nasuella olivacea;
    Rolstaartbeer=Kinkajoe=Potos flavus;
    Olingo;
    Olinguito=Bassaricyon neblina;
    Noordelijke olingo=Bassaricyon gabbii;
    Ringstaartkat=Bassariscus astutus;
    Midden-Amerikaanse ringstaartkat=Bassariscus sumichrasti;
    Rode panda=Kleine panda=Ailurus fulgens
  `, [18, 20]);

  koppelDieren(`
    Wasbeer;
    Rode neusbeer;
    Witsnuitneusbeer;
    Rolstaartbeer;
    Olinguito;
    Rode panda;
    Ringstaartkat
  `, [35]);

  koppelDieren(`
    Rode panda;
    Rolstaartbeer;
    Olinguito;
    Noordelijke olingo
  `, [31]);

  koppelDieren("Rode panda; Wasbeer; Neusbeer", [3]);

  // ============================================================
  // STINKDIEREN
  // ============================================================

  viervoeters(`
    Stinkdier=Skunk;
    Gestreept stinkdier=Mephitis mephitis;
    Kapstinkdier=Mephitis macroura;
    Oostelijk gevlekt stinkdier=Spilogale putorius;
    Westelijk gevlekt stinkdier=Spilogale gracilis;
    Dwergstinkdier=Spilogale pygmaea;
    Amerikaans varkenssnuitstinkdier=Conepatus leuconotus;
    Molina's stinkdier=Conepatus chinga;
    Patagonisch stinkdier=Conepatus humboldtii;
    Javaanse stinkdas=Mydaus javanensis;
    Palawan-stinkdas=Mydaus marchei
  `, [18, 20]);

  koppelDieren(`
    Stinkdier;
    Gestreept stinkdier;
    Kapstinkdier
  `, [48]);

  // ============================================================
  // CIVETKATTEN EN GENETKATTEN
  // ============================================================

  viervoeters(`
    Civetkat;
    Afrikaanse civetkat=Civettictis civetta;
    Indische civetkat=Viverra zibetha;
    Kleine Indische civetkat=Viverricula indica;
    Maleise civetkat=Viverra tangalunga;
    Grootgevlekte civetkat=Viverra megaspila;
    Loewak=Paradoxurus hermaphroditus;
    Maskerpalmroller=Paguma larvata;
    Gouden palmroller=Paradoxurus zeylonensis;
    Bintoerong=Arctictis binturong;
    Ottercivetkat=Cynogale bennettii;
    Afrikaanse palmroller=Nandinia binotata;
    Gestreepte palmroller=Arctogalidia trivirgata;
    Genetkat;
    Gewone genetkat=Genetta genetta;
    Tijgergenetkat=Genetta tigrina;
    Grootgevlekte genetkat=Genetta maculata;
    Servalgenetkat=Genetta servalina;
    Watergenetkat=Genetta piscivora;
    Johnston-genetkat=Genetta johnstoni;
    Pardelgenetkat=Genetta pardina;
    Afrikaanse linsang=Poiana richardsonii;
    Gestreepte linsang=Prionodon linsang;
    Gevlekte linsang=Prionodon pardicolor
  `, [18, 20]);

  koppelDieren(`
    Bintoerong;
    Loewak;
    Maskerpalmroller;
    Afrikaanse palmroller;
    Gewone genetkat
  `, [35]);

  koppelDieren(`
    Bintoerong;
    Afrikaanse palmroller;
    Gestreepte palmroller
  `, [31]);

  // ============================================================
  // MANGOESTEN EN MADAGASKISCHE ROOFDIEREN
  // ============================================================

  viervoeters(`
    Mangoest;
    Stokstaartje=Suricata suricatta;
    Zebramangoest=Mungos mungo;
    Gambiaanse mangoest=Mungos gambianus;
    Dwergmangoest=Helogale parvula;
    Ethiopische dwergmangoest=Helogale hirtula;
    Egyptische mangoest=Herpestes ichneumon;
    Indische grijze mangoest=Urva edwardsii;
    Kleine Indische mangoest=Urva auropunctata;
    Indische bruine mangoest=Urva fusca;
    Krabbenetende mangoest=Urva urva;
    Javaanse mangoest=Urva javanica;
    Halsbandmangoest=Urva semitorquata;
    Slanke mangoest=Herpestes sanguineus;
    Gele mangoest=Cynictis penicillata;
    Watermangoest=Atilax paludinosus;
    Witstaartmangoest=Ichneumia albicauda;
    Zwartvoetmangoest=Bdeogale nigripes;
    Bossige staartmangoest=Bdeogale crassicauda;
    Jacksonmangoest=Bdeogale jacksoni;
    Langneusmangoest=Herpestes naso;
    Pousarguesmangoest=Dologale dybowskii;
    Fossa=Cryptoprocta ferox;
    Fanaloka=Fossa fossana;
    Falanouc=Eupleres goudotii;
    Ringstaartmangoest=Galidia elegans;
    Breedgestreepte mangoest=Galidictis fasciata;
    Smalgestreepte mangoest=Mungotictis decemlineata;
    Bruinstaartmangoest=Salanoia concolor
  `, [18, 20]);

  koppelDieren(`
    Stokstaartje;
    Zebramangoest;
    Dwergmangoest;
    Gele mangoest
  `, [5, 15, 40]);

  koppelDieren("Stokstaartje", [3, 32]);
  koppelDieren("Fossa", [5, 6, 12, 17, 35]);

  // ============================================================
  // MENSAPEN
  // ============================================================

  zoogdieren(`
    Aap;
    Mensaap;
    Chimpansee=Pan troglodytes;
    Bonobo=Pan paniscus;
    Gorilla;
    Westelijke gorilla=Gorilla gorilla;
    Oostelijke gorilla=Gorilla beringei;
    Berggorilla;
    Westelijke laaglandgorilla;
    Oostelijke laaglandgorilla;
    Cross River-gorilla;
    Orang-oetan;
    Borneose orang-oetan=Pongo pygmaeus;
    Sumatraanse orang-oetan=Pongo abelii;
    Tapanuli-orang-oetan=Pongo tapanuliensis
  `, [20]);

  koppelDieren(`
    Chimpansee;
    Bonobo;
    Gorilla;
    Westelijke gorilla;
    Oostelijke gorilla;
    Berggorilla;
    Westelijke laaglandgorilla;
    Oostelijke laaglandgorilla;
    Cross River-gorilla
  `, [5, 6]);

  koppelDieren(`
    Orang-oetan;
    Borneose orang-oetan;
    Sumatraanse orang-oetan;
    Tapanuli-orang-oetan;
    Chimpansee;
    Bonobo
  `, [12, 35]);

  koppelDieren(`
    Orang-oetan;
    Borneose orang-oetan;
    Sumatraanse orang-oetan;
    Tapanuli-orang-oetan
  `, [31]);

  koppelDieren(`
    Chimpansee;
    Bonobo;
    Gorilla;
    Orang-oetan
  `, [3, 40]);

  // ============================================================
  // GIBBONS
  // ============================================================

  zoogdieren(`
    Gibbon;
    Lar gibbon=Wit handgibbon=Hylobates lar;
    Zwart handgibbon=Hylobates agilis;
    Javaanse gibbon=Hylobates moloch;
    Borneogibbon=Hylobates muelleri;
    Klossgibbon=Hylobates klossii;
    Kapgibbon=Hylobates pileatus;
    Oostelijke hoelok=Hoolock leuconedys;
    Westelijke hoelok=Hoolock hoolock;
    Siamang=Symphalangus syndactylus;
    Zwarte kuifgibbon=Nomascus concolor;
    Oostelijke zwarte kuifgibbon=Nomascus nasutus;
    Noordelijke witwanggibbon=Nomascus leucogenys;
    Zuidelijke witwanggibbon=Nomascus siki;
    Geelwanggibbon=Nomascus gabriellae;
    Hainangibbon=Nomascus hainanus
  `, [6, 12, 20, 31, 35]);

  hernoemDier("Lar gibbon", "Withandgibbon");
  hernoemDier("Zwart handgibbon", "Zwarthandgibbon");

  // ============================================================
  // MAKAKEN
  // ============================================================

  zoogdieren(`
    Makaak;
    Resusaap=Macaca mulatta;
    Java-aap=Macaca fascicularis;
    Japanse makaak=Sneeuwaap=Macaca fuscata;
    Berberaap=Macaca sylvanus;
    Beermakaak=Macaca arctoides;
    Leeuwenstaartmakaak=Macaca silenus;
    Lampongaap=Macaca nemestrina;
    Noordelijke varkensstaartmakaak=Macaca leonina;
    Bonnetmakaak=Macaca radiata;
    Ceylonmakaak=Macaca sinica;
    Assammakaak=Macaca assamensis;
    Tibetmakaak=Macaca thibetana;
    Arunachalmakaak=Macaca munzala;
    Formosamakaak=Macaca cyclopis;
    Kuifmakaak=Macaca nigra;
    Moor makaak=Macaca maura;
    Tonkeanmakaak=Macaca tonkeana;
    Heckmakaak=Macaca hecki;
    Gorontalomakaak=Macaca nigrescens;
    Booted macaque=Macaca ochreata;
    Butonmakaak=Macaca brunnescens;
    Pagaimakaak=Macaca pagensis
  `, [20]);

  koppelDieren(`
    Resusaap;
    Java-aap;
    Japanse makaak;
    Berberaap;
    Leeuwenstaartmakaak;
    Kuifmakaak
  `, [3, 40]);

  koppelDieren("Japanse makaak", [24]);
  koppelDieren("Berberaap", [5]);

  // ============================================================
  // BAVIANEN EN MEERKATTEN
  // ============================================================

  zoogdieren(`
    Baviaan;
    Mantelbaviaan=Papio hamadryas;
    Anubisbaviaan=Papio anubis;
    Gele baviaan=Papio cynocephalus;
    Chacmabaviaan=Papio ursinus;
    Guineabaviaan=Papio papio;
    Kindabaviaan=Papio kindae;
    Mandril=Mandrillus sphinx;
    Drill=Mandrillus leucophaeus;
    Gelada=Theropithecus gelada;
    Meerkat;
    Groene meerkat=Chlorocebus sabaeus;
    Vervet=Chlorocebus pygerythrus;
    Grijsgroene meerkat=Chlorocebus aethiops;
    Blauwe meerkat=Cercopithecus mitis;
    Diana-meerkat=Cercopithecus diana;
    Mona-meerkat=Cercopithecus mona;
    Brazzameerkat=Cercopithecus neglectus;
    Roodstaartmeerkat=Cercopithecus ascanius;
    Roodbuikmeerkat=Cercopithecus erythrogaster;
    Lhoëstmeerkat=Allochrocebus lhoesti;
    Preussmeerkat=Allochrocebus preussi;
    Zonne staartmeerkat=Allochrocebus solatus;
    Uilenkopmeerkat=Cercopithecus hamlyni;
    Grote witneusmeerkat=Cercopithecus nictitans;
    Kleine witneusmeerkat=Cercopithecus petaurista;
    Huzaaraap=Erythrocebus patas;
    Talapoïn;
    Noordelijke talapoïn=Miopithecus ogouensis;
    Zuidelijke talapoïn=Miopithecus talapoin;
    Roetmangabey=Cercocebus atys;
    Goudbuikmangabey=Cercocebus chrysogaster;
    Kuifmangabey;
    Grijswangmangabey=Lophocebus albigena;
    Zwarte kuifmangabey=Lophocebus aterrimus;
    Kipunji=Rungwecebus kipunji
  `, [5, 18, 20]);

  koppelDieren(`
    Baviaan;
    Mantelbaviaan;
    Anubisbaviaan;
    Gele baviaan;
    Chacmabaviaan;
    Mandril;
    Drill;
    Gelada;
    Groene meerkat;
    Vervet;
    Huzaaraap
  `, [40]);

  koppelDieren("Mandril; Gelada", [47]);

  // ============================================================
  // BLADAPEN
  // ============================================================

  zoogdieren(`
    Bladaap;
    Neusaap=Nasalis larvatus;
    Varkensstaartlang o er=Simias concolor;
    Hanumanlangoer;
    Grijze langoer=Semnopithecus entellus;
    Zwartvoetlangoer=Semnopithecus hypoleucos;
    Nilgirilangoer=Semnopithecus johnii;
    Purpergezichtenlangoer=Semnopithecus vetulus;
    Brillangoer=Trachypithecus obscurus;
    Zilverlangoer=Trachypithecus cristatus;
    Gouden langoer=Trachypithecus geei;
    Kuiflangoer=Trachypithecus pileatus;
    François' langoer=Trachypithecus francoisi;
    Cat Balangoer=Trachypithecus poliocephalus;
    Delacourlangoer=Trachypithecus delacouri;
    Tonkinlangoer;
    Javaanse langoer=Trachypithecus auratus;
    Roodpootdoek= Pygathrix nemaeus;
    Zwartpootdoek=Pygathrix nigripes;
    Grijspootdoek=Pygathrix cinerea;
    Gouden stompneusaap=Rhinopithecus roxellana;
    Zwarte stompneusaap=Rhinopithecus bieti;
    Grijze stompneusaap=Rhinopithecus brelichi;
    Tonkinstompneusaap=Rhinopithecus avunculus;
    Birmese stompneusaap=Rhinopithecus strykeri;
    Guereza=Colobus guereza;
    Angolacolobus=Colobus angolensis;
    Koningscolobus=Colobus polykomos;
    Zwarte colobus=Colobus satanas;
    Rode colobus;
    Zanzibarrodecolobus=Piliocolobus kirkii;
    Olijfgroene colobus=Procolobus verus
  `, [18, 20, 35]);

  hernoemDier("Varkensstaartlang o er", "Varkensstaartlangoer");
  hernoemDier("Cat Balangoer", "Cat Ba-langoer");

  koppelDieren(`
    Neusaap;
    Varkensstaartlangoer;
    Brillangoer;
    Zilverlangoer;
    Gouden langoer;
    Roodpootdoek;
    Zwartpootdoek;
    Grijspootdoek;
    Guereza;
    Angolacolobus;
    Koningscolobus
  `, [31]);

  // ============================================================
  // ZUID-AMERIKAANSE APEN
  // ============================================================

  zoogdieren(`
    Kapucijnaap;
    Bruine kapucijnaap=Sapajus apella;
    Witschouderkapucijnaap=Cebus capucinus;
    Witvoorhoofdkapucijnaap=Cebus albifrons;
    Goudbuikkapucijnaap=Sapajus xanthosternos;
    Zwarte kapucijnaap=Sapajus nigritus;
    Doodshoofdaapje;
    Gewoon doodshoofdaapje=Saimiri sciureus;
    Boliviaans doodshoofdaapje=Saimiri boliviensis;
    Midden-Amerikaans doodshoofdaapje=Saimiri oerstedii;
    Zwart doodshoofdaapje=Saimiri vanzolinii;
    Brulaap;
    Rode brulaap=Alouatta seniculus;
    Zwarte brulaap=Alouatta caraya;
    Mantelbrulaap=Alouatta palliata;
    Guatemalteekse brulaap=Alouatta pigra;
    Bruine brulaap=Alouatta guariba;
    Slingeraap;
    Zwarte slingeraap=Ateles paniscus;
    Bruine slingeraap=Ateles hybridus;
    Geoffroys slingeraap=Ateles geoffroyi;
    Witbuikslingeraap=Ateles belzebuth;
    Zwartkopslingeraap=Ateles fusciceps;
    Wolaap;
    Bruine wolaap=Lagothrix lagotricha;
    Grijze wolaap=Lagothrix cana;
    Geelstaartwolaap=Lagothrix flavicauda;
    Muriqui;
    Noordelijke muriqui=Brachyteles hypoxanthus;
    Zuidelijke muriqui=Brachyteles arachnoides;
    Klauwaapje;
    Gewoon penseelaapje=Callithrix jacchus;
    Zwartoorpenseelaapje=Callithrix penicillata;
    Witkoppenseelaapje=Callithrix geoffroyi;
    Geel koppenseelaapje=Callithrix flaviceps;
    Zilverpenseelaapje=Mico argentatus;
    Dwergzijdeaapje=Cebuella pygmaea;
    Tamarinaapje;
    Keizertamarin=Saguinus imperator;
    Roodhandtamarin=Saguinus midas;
    Katoentoptamarin=Saguinus oedipus;
    Manteltamarin=Leontocebus fuscicollis;
    Snortamarin=Saguinus mystax;
    Zwartkoptamarin=Leontocebus nigricollis;
    Gouden leeuwaapje=Leontopithecus rosalia;
    Goudkopleeuwaapje=Leontopithecus chrysomelas;
    Zwart leeuwaapje=Leontopithecus chrysopygus;
    Zwartkopleeuwaapje=Leontopithecus caissara;
    Goeldi-aapje=Callimico goeldii;
    Nachtaap;
    Noordelijke nachtaap=Aotus trivirgatus;
    Panamanachtaap=Aotus zonalis;
    Azaranachtaap=Aotus azarae;
    Springaap;
    Rode springaap=Plecturocebus cupreus;
    Zwarte springaap=Cheracebus lugens;
    Saki;
    Witgezichtsaki=Pithecia pithecia;
    Monnikssaki=Pithecia monachus;
    Baardsaki;
    Zwarte baardsaki=Chiropotes satanas;
    Oeakari;
    Rode oeakari=Cacajao calvus;
    Zwartkopoeakari=Cacajao melanocephalus
  `, [18, 20, 31, 35]);

  koppelDieren(`
    Kapucijnaap;
    Doodshoofdaapje;
    Brulaap;
    Slingeraap;
    Wolaap;
    Muriqui;
    Dwergzijdeaapje;
    Keizertamarin;
    Katoentoptamarin;
    Gouden leeuwaapje;
    Witgezichtsaki;
    Rode oeakari
  `, [12]);

  koppelDieren(`
    Doodshoofdaapje;
    Bruine kapucijnaap;
    Keizertamarin;
    Katoentoptamarin;
    Gouden leeuwaapje;
    Dwergzijdeaapje;
    Rode brulaap;
    Zwarte slingeraap
  `, [3]);

  // ============================================================
  // LEMUREN
  // ============================================================

  zoogdieren(`
    Lemuur;
    Maki;
    Ringstaartmaki=Lemur catta;
    Rode vari=Varecia rubra;
    Zwart-witte vari=Varecia variegata;
    Bruine maki=Eulemur fulvus;
    Zwarte maki=Eulemur macaco;
    Blauwoogmaki=Eulemur flavifrons;
    Kroonmaki=Eulemur coronatus;
    Roodbuikmaki=Eulemur rubriventer;
    Mongozmaki=Eulemur mongoz;
    Roodvoorhoofdmaki=Eulemur rufifrons;
    Sanfords maki=Eulemur sanfordi;
    Witkopmaki=Eulemur albifrons;
    Bamboemaki;
    Grote bamboemaki=Prolemur simus;
    Gouden bamboemaki=Hapalemur aureus;
    Grijze bamboemaki=Hapalemur griseus;
    Indri=Indri indri;
    Sifaka;
    Verreauxs sifaka=Propithecus verreauxi;
    Coquerels sifaka=Propithecus coquereli;
    Diadeemsifaka=Propithecus diadema;
    Zijdesifaka=Propithecus candidus;
    Goudkroonsifaka=Propithecus tattersalli;
    Perriers sifaka=Propithecus perrieri;
    Kroon sifaka=Propithecus coronatus;
    Vingerdier=Aye-aye=Daubentonia madagascariensis;
    Muismaki;
    Grijze muismaki=Microcebus murinus;
    Rode muismaki=Microcebus rufus;
    Madame Berthes muismaki=Microcebus berthae;
    Gouden muismaki=Microcebus ravelobensis;
    Dwergmaki;
    Vetstaartdwergmaki=Cheirogaleus medius;
    Grote dwergmaki=Cheirogaleus major;
    Vorkstreepmaki=Phaner;
    Wezelmaki;
    Roodstaartwezelmaki=Lepilemur ruficaudatus;
    Witvoetwezelmaki=Lepilemur leucopus;
    Noordelijke wezelmaki=Lepilemur septentrionalis
  `, [5, 20]);

  samenvoegen("Lemuur", "Maki");

  koppelDieren(`
    Ringstaartmaki;
    Rode vari;
    Zwart-witte vari;
    Bruine maki;
    Zwarte maki;
    Blauwoogmaki;
    Kroonmaki;
    Roodbuikmaki;
    Mongozmaki;
    Sifaka;
    Coquerels sifaka;
    Diadeemsifaka;
    Vingerdier;
    Grijze muismaki;
    Vetstaartdwergmaki
  `, [18, 35]);

  koppelDieren(`
    Rode vari;
    Zwart-witte vari;
    Bruine maki;
    Vingerdier;
    Muismaki;
    Grijze muismaki;
    Sifaka;
    Indri
  `, [31]);

  koppelDieren(`
    Vingerdier;
    Grijze muismaki;
    Rode muismaki;
    Dwergmaki;
    Vetstaartdwergmaki;
    Wezelmaki
  `, [27]);

  koppelDieren("Vetstaartdwergmaki", [28]);
  koppelDieren("Ringstaartmaki", [3, 40, 48]);

  // ============================================================
  // LORI'S, GALAGO'S EN SPOOKDIERTJES
  // ============================================================

  zoogdieren(`
    Loris;
    Slanke lori=Loris tardigradus;
    Grijze slanke lori=Loris lydekkerianus;
    Plompe lori;
    Bengaalse plompe lori=Nycticebus bengalensis;
    Grote plompe lori=Nycticebus coucang;
    Javaanse plompe lori=Nycticebus javanicus;
    Kleine plompe lori=Xanthonycticebus pygmaeus;
    Potto=Perodicticus potto;
    Angwantibo;
    Gouden angwantibo=Arctocebus aureus;
    Galago;
    Senegalgalago=Galago senegalensis;
    Zuid-Afrikaanse galago=Galago moholi;
    Somalische galago=Galago gallarum;
    Dikstaartgalago=Otolemur crassicaudatus;
    Zilvergalago=Otolemur monteiri;
    Grote galago;
    Dwerggalago;
    Spookdiertje;
    Filipijns spookdiertje=Carlito syrichta;
    Westelijk spookdiertje=Cephalopachus bancanus;
    Celebesspookdiertje=Tarsius tarsier;
    Dwergspookdiertje=Tarsius pumilus;
    Dianaspookdiertje=Tarsius dentatus;
    Lariangspookdiertje=Tarsius lariang
  `, [20, 27, 31, 35]);

  koppelDieren(`
    Galago;
    Senegalgalago;
    Zuid-Afrikaanse galago;
    Dikstaartgalago;
    Spookdiertje;
    Filipijns spookdiertje;
    Westelijk spookdiertje;
    Celebesspookdiertje
  `, [34]);

  koppelDieren(`
    Slanke lori;
    Plompe lori;
    Grote plompe lori;
    Kleine plompe lori;
    Potto
  `, [30]);

  // ============================================================
  // OLIFANTEN
  // ============================================================

  viervoeters(`
    Olifant=Elephant;
    Afrikaanse savanneolifant=Loxodonta africana;
    Afrikaanse bosolifant=Loxodonta cyclotis;
    Aziatische olifant=Elephas maximus;
    Indische olifant;
    Sumatraanse olifant;
    Sri Lankaanse olifant;
    Borneose olifant
  `, [9, 14, 16, 18, 40]);

  koppelDieren(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant
  `, [5]);

  koppelDieren(`
    Afrikaanse bosolifant;
    Aziatische olifant;
    Sumatraanse olifant;
    Borneose olifant
  `, [6, 12]);

  koppelDieren(`
    Olifant;
    Afrikaanse savanneolifant;
    Aziatische olifant
  `, [3, 44]);

  // ============================================================
  // NEUSHOORNS
  // ============================================================

  viervoeters(`
    Neushoorn=Rhinoceros=Rhino;
    Witte neushoorn=Ceratotherium simum;
    Zwarte neushoorn=Diceros bicornis;
    Indische neushoorn=Rhinoceros unicornis;
    Javaanse neushoorn=Rhinoceros sondaicus;
    Sumatraanse neushoorn=Dicerorhinus sumatrensis
  `, [9, 16, 18, 19]);

  koppelDieren(`
    Witte neushoorn;
    Zwarte neushoorn
  `, [5]);

  koppelDieren(`
    Javaanse neushoorn;
    Sumatraanse neushoorn
  `, [6, 12]);

  koppelDieren(`
    Neushoorn;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn
  `, [3]);

  // ============================================================
  // PAARDACHTIGEN
  // ============================================================

  viervoeters(`
    Paard=Horse;
    Ezel=Donkey;
    Muildier;
    Muilezel;
    Pony;
    Przewalskipaard;
    Zebra;
    Steppezebra=Equus quagga;
    Bergzebra=Equus zebra;
    Grévyzebra=Equus grevyi;
    Afrikaanse wilde ezel=Equus africanus;
    Aziatische wilde ezel=Equus hemionus;
    Onager;
    Kiang=Equus kiang;
    Kulan;
    Somalische wilde ezel;
    Nubische wilde ezel
  `, [16, 18, 20]);

  koppelDieren(`
    Zebra;
    Steppezebra;
    Bergzebra;
    Grévyzebra;
    Afrikaanse wilde ezel;
    Somalische wilde ezel;
    Nubische wilde ezel
  `, [5]);

  koppelDieren(`
    Zebra;
    Steppezebra;
    Bergzebra;
    Grévyzebra
  `, [48]);

  koppelDieren(`
    Paard;
    Pony;
    Ezel;
    Muildier;
    Muilezel
  `, [8, 13]);

  koppelDieren(`
    Paard;
    Przewalskipaard;
    Zebra;
    Steppezebra;
    Bergzebra;
    Grévyzebra
  `, [29, 40]);

  // PAARDEN- EN PONYRASSEN

  viervoeters(`
    Fries paard;
    Arabier;
    Engelse volbloed;
    Anglo-Arabier;
    Akhal-teke;
    Andalusiër;
    Lusitano;
    Lipizzaner;
    Haflinger;
    Fjordenpaard;
    IJslands paard;
    Shetlandpony;
    Welsh pony;
    Connemarapony;
    Dartmoorpony;
    Exmoorpony;
    New Forestpony;
    Highlandpony;
    Fellpony;
    Dalespony;
    Falabella;
    Amerikaanse miniatuurpaard;
    Shire;
    Clydesdale;
    Percheron;
    Belgisch trekpaard;
    Brabants trekpaard;
    Ardenner;
    Boulonnais;
    Breton;
    Suffolk punch;
    Comtois;
    Noriker;
    Jutlander;
    Nederlands trekpaard;
    Groninger paard;
    Gelderlander;
    Nederlands warmbloedpaard=KWPN;
    Hannoveraan;
    Holsteiner;
    Oldenburger;
    Trakehner;
    Westfaler;
    Selle français;
    Belgische warmbloed;
    Zweeds warmbloed;
    Deens warmbloed;
    Quarter horse;
    Paint horse;
    Appaloosa;
    Mustang;
    Tennessee walking horse;
    Morgan;
    American saddlebred;
    Missouri fox trotter;
    Paso fino;
    Peruaanse paso;
    Criollo;
    Marwari;
    Kathiawari;
    Mongools paard;
    Yakutpaard;
    Donpaard;
    Basjkiers paard;
    Camarguepaard;
    Mérens;
    Huzule;
    Konik;
    Sorraia;
    Knabstrupper;
    Tinker=Irish cob;
    Gypsy vanner;
    Freiberger;
    Rocky Mountain horse;
    Australisch stock horse;
    Australische brumby;
    Nieuw-Zeelandse kaimanawa
  `, [16, 18, 20]);

  samenvoegen("Tinker", "Gypsy vanner");

  koppelDieren(`
    Appaloosa;
    Knabstrupper
  `, [49]);

  // ============================================================
  // TAPIRS
  // ============================================================

  viervoeters(`
    Tapir;
    Laaglandtapir=Tapirus terrestris;
    Bergtapir=Tapirus pinchaque;
    Midden-Amerikaanse tapir=Tapirus bairdii;
    Indische tapir=Tapirus indicus
  `, [14, 16, 18, 20]);

  koppelDieren(`
    Laaglandtapir;
    Midden-Amerikaanse tapir;
    Indische tapir
  `, [6, 12]);

  koppelDieren("Tapir; Indische tapir; Laaglandtapir", [3]);

  // ============================================================
  // GIRAFFEN EN OKAPI'S
  // ============================================================

  viervoeters(`
    Giraf=Giraffe;
    Netgiraf=Netgiraffe;
    Masaigiraf;
    Noordelijke giraf;
    Zuidelijke giraf;
    Rothschildgiraf;
    Angolagiraf;
    West-Afrikaanse giraf;
    Kordofangiraf;
    Nubische giraf
  `, [5, 9, 16, 18, 19, 20, 36, 49]);

  viervoeters(`
    Okapi=Okapia johnstoni
  `, [5, 6, 12, 16, 18, 20, 48]);

  koppelDieren(`
    Giraf;
    Netgiraf;
    Masaigiraf;
    Rothschildgiraf;
    Okapi
  `, [3]);

  // ============================================================
  // HERTACHTIGEN
  // ============================================================

  viervoeters(`
    Hert;
    Edelhert=Cervus elaphus;
    Wapiti=Cervus canadensis;
    Sikahert=Cervus nippon;
    Damhert=Dama dama;
    Perzisch damhert=Dama mesopotamica;
    Ree=Capreolus capreolus;
    Siberisch ree=Capreolus pygargus;
    Eland=Alces alces;
    Rendier=Kariboe=Rangifer tarandus;
    Witstaarthert=Odocoileus virginianus;
    Muildierhert=Odocoileus hemionus;
    Zwartstaarthert;
    Axis hert=Axis axis;
    Varkenshert=Axis porcinus;
    Calamianhert=Axis calamianensis;
    Baweanhert=Axis kuhlii;
    Sambar=Rusa unicolor;
    Javaans hert=Rusa timorensis;
    Filipijns hert=Rusa marianna;
    Visayagevlekt hert=Rusa alfredi;
    Moerashert=Blastocerus dichotomus;
    Pampahert=Ozotoceros bezoarticus;
    Noordelijke poedoe;
    Zuidelijke poedoe=Pudu puda;
    Poedoe;
    Chinese muntjak=Muntiacus reevesi;
    Indische muntjak=Muntiacus muntjak;
    Zwarte muntjak=Muntiacus crinifrons;
    Reuzenmuntjak=Muntiacus vuquangensis;
    Feamuntjak=Muntiacus feae;
    Kuifhert=Elaphodus cephalophus;
    Waterhert=Hydropotes inermis;
    Pater-Davidshert=Elaphurus davidianus;
    Lierhert=Rucervus eldii;
    Barasinga=Rucervus duvaucelii;
    Tarimwapiti=Cervus hanglu;
    Witliphert=Cervus albirostris;
    Noordelijke huemul=Hippocamelus antisensis;
    Zuidelijke huemul=Hippocamelus bisulcus;
    Rood boshert=Mazama americana;
    Grijs boshert=Mazama gouazoubira
  `, [16, 18, 20]);

  hernoemDier("Axis hert", "Axishert");

  koppelDieren(`
    Edelhert;
    Damhert;
    Ree;
    Eland;
    Sikahert;
    Sambar;
    Chinese muntjak;
    Indische muntjak;
    Kuifhert;
    Witstaarthert
  `, [6]);

  koppelDieren(`
    Edelhert;
    Damhert;
    Ree
  `, [26]);

  koppelDieren(`
    Edelhert;
    Wapiti;
    Eland;
    Sambar
  `, [9]);

  koppelDieren(`
    Eland;
    Rendier;
    Siberisch ree
  `, [24]);

  koppelDieren(`
    Axishert;
    Sikahert;
    Damhert;
    Visayagevlekt hert
  `, [49]);

  // Hertengeweien zijn geen echte hoorns.
  // Daarom krijgen herten niet automatisch vraag 19.

  // ============================================================
  // RUNDEREN EN BIZONS
  // ============================================================

  viervoeters(`
    Rund;
    Koe;
    Stier;
    Os;
    Kalf;
    Zebu;
    Jakoet rund;
    Jak=Yak=Bos grunniens;
    Wilde jak=Bos mutus;
    Gaur=Bos gaurus;
    Gayal=Bos frontalis;
    Banteng=Bos javanicus;
    Amerikaanse bizon=Bison bison;
    Europese bizon=Wisent=Bison bonasus;
    Bosbizon;
    Steppebizon;
    Afrikaanse buffel=Syncerus caffer;
    Kaapse buffel;
    Bosbuffel;
    Waterbuffel=Bubalus bubalis;
    Wilde waterbuffel=Bubalus arnee;
    Laaglandanoa=Bubalus depressicornis;
    Berganoa=Bubalus quarlesi;
    Tamaroe=Bubalus mindorensis;
    Muskusos=Ovibos moschatus;
    Kouprey=Bos sauveli
  `, [16, 18, 20]);

  // De steppebizon is uitgestorven.

  verwijderDier("Steppebizon");
  dier("Steppebizon", [43, 50], ["Bison priscus"]);

  koppelDieren(`
    Rund;
    Koe;
    Stier;
    Os;
    Zebu;
    Jak;
    Wilde jak;
    Gaur;
    Gayal;
    Banteng;
    Amerikaanse bizon;
    Europese bizon;
    Bosbizon;
    Afrikaanse buffel;
    Kaapse buffel;
    Bosbuffel;
    Waterbuffel;
    Wilde waterbuffel;
    Laaglandanoa;
    Berganoa;
    Tamaroe;
    Muskusos
  `, [19]);

  koppelDieren(`
    Rund;
    Koe;
    Stier;
    Os;
    Kalf;
    Zebu;
    Jak;
    Waterbuffel
  `, [13, 46]);

  koppelDieren(`
    Afrikaanse buffel;
    Kaapse buffel;
    Bosbuffel
  `, [5]);

  koppelDieren(`
    Jak;
    Wilde jak;
    Muskusos;
    Bosbizon
  `, [24]);

  // RUNDER RASSEN

  viervoeters(`
    Holstein-friesian;
    Jerseykoe;
    Guernseykoe;
    Ayrshire;
    Brown Swiss;
    Schotse hooglander;
    Galloway;
    Belted Galloway;
    Aberdeen angus;
    Hereford;
    Charolais;
    Limousin;
    Blonde d'Aquitaine;
    Belgische witblauwe;
    Piemontese;
    Chianina;
    Marchigiana;
    Romagnola;
    Simmentaler;
    Fleckvieh;
    Shorthorn;
    Dexter;
    Longhorn;
    Texas longhorn;
    Watusi;
    Ankole;
    Brahman;
    Girrund;
    Sahiwal;
    Red Sindhi;
    Nelore;
    Guzerat;
    Indubrasil;
    Brangus;
    Beefmaster;
    Santa Gertrudis;
    Murray grey;
    Salers;
    Aubrac;
    Tarentaise;
    Normandisch rund;
    Montbéliarde;
    Groninger blaarkop;
    Lakenvelder;
    Brandrood rund;
    Maas-Rijn-IJssel;
    Fries roodbont;
    Fries-Hollands rund;
    Witrik;
    Angler rund;
    Pinzgauer;
    Rätisches grauvieh;
    Hinterwälder;
    Vorderwälder;
    Heckrund;
    Taurosrund;
    Kortharig rood rund
  `, [13, 16, 18, 20, 46]);

  verwijderDier("Kortharig rood rund");

  // ============================================================
  // SCHAPEN EN GEITEN
  // ============================================================

  viervoeters(`
    Schaap=Ovis aries;
    Geit=Capra hircus;
    Moeflon;
    Europese moeflon;
    Aziatische moeflon;
    Argalischaap=Ovis ammon;
    Oerial=Ovis vignei;
    Dikhoornschaap=Ovis canadensis;
    Dallschaap=Ovis dalli;
    Sneeuwschaap=Ovis nivicola;
    Steenbok;
    Alpensteenbok=Capra ibex;
    Nubische steenbok=Capra nubiana;
    Siberische steenbok=Capra sibirica;
    Spaanse steenbok=Capra pyrenaica;
    Ethiopische steenbok=Capra walie;
    Bezoargeit=Capra aegagrus;
    Schroefhoorngeit=Markhoor=Capra falconeri;
    Oost-Kaukasische toer=Capra cylindricornis;
    West-Kaukasische toer=Capra caucasica;
    Manenschaap=Ammotragus lervia;
    Blauwschaap=Pseudois nayaur;
    Dwergblauwschaap;
    Berggeit=Oreamnos americanus;
    Gems=Rupicapra rupicapra;
    Pyreneese gems=Rupicapra pyrenaica;
    Himalayatahr=Hemitragus jemlahicus;
    Arabische tahr=Arabitragus jayakari;
    Nilgiritahr=Nilgiritragus hylocrius;
    Takin=Budorcas taxicolor;
    Japanse bosgems=Capricornis crispus;
    Taiwanese bosgems=Capricornis swinhoei;
    Goral;
    Himalayagoral=Naemorhedus goral;
    Langstaartgoral=Naemorhedus caudatus
  `, [16, 18, 20]);

  koppelDieren(`
    Moeflon;
    Europese moeflon;
    Aziatische moeflon;
    Argalischaap;
    Oerial;
    Dikhoornschaap;
    Dallschaap;
    Sneeuwschaap;
    Steenbok;
    Alpensteenbok;
    Nubische steenbok;
    Siberische steenbok;
    Spaanse steenbok;
    Ethiopische steenbok;
    Bezoargeit;
    Schroefhoorngeit;
    Oost-Kaukasische toer;
    West-Kaukasische toer;
    Manenschaap;
    Blauwschaap;
    Berggeit;
    Gems;
    Pyreneese gems;
    Himalayatahr;
    Arabische tahr;
    Nilgiritahr;
    Takin
  `, [19]);

  koppelDieren(`
    Schaap;
    Geit
  `, [8, 13, 46]);

  koppelDieren(`
    Alpensteenbok;
    Nubische steenbok;
    Siberische steenbok;
    Spaanse steenbok;
    Berggeit;
    Gems;
    Pyreneese gems
  `, [34, 35]);

  // SCHAPENRASSEN

  viervoeters(`
    Texelaar;
    Suffolk;
    Merinoschaap;
    Dorper;
    Hampshire down;
    Southdown;
    Oxford down;
    Shropshire;
    Dorset horn;
    Poll Dorset;
    Romney;
    Leicester longwool;
    Border Leicester;
    Lincoln longwool;
    Jacobsschaap;
    Soayschaap;
    Ouessantschaap;
    Shetlandschaap;
    Hebrideanschaap;
    IJslands schaap;
    Gotlandschaap;
    Noors spelschaap;
    Rackaschaap;
    Karakulschaap;
    Awassischaap;
    Romanovschaap;
    Friese melkschaap;
    Zeeuws melkschaap;
    Drents heideschaap;
    Veluws heideschaap;
    Kempisch heideschaap;
    Schoonebeeker;
    Mergellandschaap;
    Zwartblesschaap;
    Blauwe texelaar;
    Swifter;
    Duitse zwartkop;
    Duitse merino;
    Heidschnucke;
    Walliser schwarznasenschaf
  `, [13, 16, 18, 20, 46]);

  // GEITENRASSEN

  viervoeters(`
    Nederlandse landgeit;
    Dwerggeit;
    Nubische geit;
    Boergeit;
    Saanengeit;
    Toggenburger geit;
    Alpinegeit;
    Angorageit;
    Kasjmiergeit;
    Damascener geit;
    LaMancha-geit;
    Oberhasli;
    Nigerian dwarf;
    Walliser zwarthalsgeit;
    Thüringer woudgeit;
    Girgentanageit;
    Maltese geit;
    Murcia-Granadageit;
    Appenzeller geit;
    Stiefelgeit
  `, [13, 16, 18, 20]);

  koppelDieren(`
    Boergeit;
    Saanengeit;
    Toggenburger geit;
    Alpinegeit;
    Nubische geit;
    Damascener geit
  `, [46]);

  // ============================================================
  // ANTILOPEN EN GAZELLEN
  // ============================================================

  viervoeters(`
    Antilope;
    Gazelle;
    Impala=Aepyceros melampus;
    Springbok=Antidorcas marsupialis;
    Thomson gazelle=Eudorcas thomsonii;
    Grantgazelle=Nanger granti;
    Damagazelle=Nanger dama;
    Soemmeringgazelle=Nanger soemmerringii;
    Dorcasgazelle=Gazella dorcas;
    Indische gazelle=Gazella bennettii;
    Berggazelle=Gazella gazella;
    Arabische gazelle=Gazella arabica;
    Kropgazelle=Gazella subgutturosa;
    Slankhoorngazelle=Gazella leptoceros;
    Cuviergazelle=Gazella cuvieri;
    Spekegazelle=Gazella spekei;
    Gerenoek=Litocranius walleri;
    Beir a=Beira=Dorcatragus megalotis;
    Dikdik;
    Kirks dikdik=Madoqua kirkii;
    Günthers dikdik=Madoqua guentheri;
    Zoutdikdik=Madoqua saltiana;
    Zilveren dikdik=Madoqua piacentinii;
    Klipspringer=Oreotragus oreotragus;
    Steenbokantilope=Raphicerus campestris;
    Kaapse grysbok=Raphicerus melanotis;
    Sharpegrysbok=Raphicerus sharpei;
    Oribi=Ourebia ourebi;
    Soeni=Neotragus moschatus;
    Koningsantilope=Neotragus pygmaeus;
    Dwergantilope;
    Duikerantilope;
    Blauwe duiker=Philantomba monticola;
    Maxwellduiker=Philantomba maxwellii;
    Gewone duiker=Sylvicapra grimmia;
    Geelrugduiker=Cephalophus silvicultor;
    Zebraduiker=Cephalophus zebra;
    Zwartfrontduiker=Cephalophus nigrifrons;
    Roodflankduiker=Cephalophus rufilatus;
    Natalduiker=Cephalophus natalensis;
    Petersduiker=Cephalophus callipygus;
    Jentinkduiker=Cephalophus jentinki;
    Ogilbyduiker=Cephalophus ogilbyi;
    Zwarte duiker=Cephalophus niger;
    Grote koedoe=Tragelaphus strepsiceros;
    Kleine koedoe=Tragelaphus imberbis;
    Nyala=Tragelaphus angasii;
    Bergnyala=Tragelaphus buxtoni;
    Bosbok=Tragelaphus scriptus;
    Sitat oenga=Tragelaphus spekii;
    Bongo=Tragelaphus eurycerus;
    Elandantilope=Taurotragus oryx;
    Reuzenelandantilope=Taurotragus derbianus;
    Waterbok=Kobus ellipsiprymnus;
    Kob=Kobus kob;
    Puku=Kobus vardonii;
    Lechwe=Kobus leche;
    Nijllechwe=Kobus megaceros;
    Rietbok=Redunca arundinum;
    Bergrietbok=Redunca fulvorufula;
    Bohorrietbok=Redunca redunca;
    Roanantilope=Hippotragus equinus;
    Sabelantilope=Hippotragus niger;
    Gemsbok=Oryx gazella;
    Beisaoryx=Oryx beisa;
    Arabische oryx=Oryx leucoryx;
    Algazel=Oryx dammah;
    Addax=Addax nasomaculatus;
    Blauwe gnoe=Connochaetes taurinus;
    Zwarte gnoe=Connochaetes gnou;
    Gnoe;
    Hartebeest=Alcelaphus buselaphus;
    Lichtensteinhartebeest=Alcelaphus lichtensteinii;
    Topi=Damaliscus lunatus;
    Blesbok=Damaliscus pygargus phillipsi;
    Bontebok=Damaliscus pygargus pygargus;
    Hirola=Beatragus hunteri;
    Saiga=Saiga tatarica;
    Tibetaanse antilope=Pantholops hodgsonii;
    Indische antilope=Antilope cervicapra;
    Nilgai=Boselaphus tragocamelus;
    Vierhoornantilope=Tetracerus quadricornis;
    Saola=Pseudoryx nghetinhensis;
    Japanse serow;
    Chinese serow=Capricornis milneedwardsii
  `, [16, 18, 20]);

  hernoemDier("Beir a", "Beira");
  hernoemDier("Sitat oenga", "Sitatoenga");
  samenvoegen("Japanse bosgems", "Japanse serow");

  koppelDieren(`
    Impala;
    Springbok;
    Thomson gazelle;
    Grantgazelle;
    Damagazelle;
    Soemmeringgazelle;
    Dorcasgazelle;
    Spekegazelle;
    Gerenoek;
    Beira;
    Dikdik;
    Kirks dikdik;
    Günthers dikdik;
    Klipspringer;
    Steenbokantilope;
    Kaapse grysbok;
    Sharpegrysbok;
    Oribi;
    Soeni;
    Koningsantilope;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Bergnyala;
    Bosbok;
    Sitatoenga;
    Bongo;
    Elandantilope;
    Reuzenelandantilope;
    Waterbok;
    Kob;
    Puku;
    Lechwe;
    Nijllechwe;
    Rietbok;
    Bergrietbok;
    Bohorrietbok;
    Roanantilope;
    Sabelantilope;
    Gemsbok;
    Beisaoryx;
    Algazel;
    Addax;
    Blauwe gnoe;
    Zwarte gnoe;
    Gnoe;
    Hartebeest;
    Topi;
    Blesbok;
    Bontebok;
    Hirola;
    Zebraduiker;
    Blauwe duiker;
    Geelrugduiker;
    Gewone duiker
  `, [5]);

  koppelDieren(`
    Impala;
    Springbok;
    Thomson gazelle;
    Grantgazelle;
    Damagazelle;
    Dorcasgazelle;
    Gerenoek;
    Dikdik;
    Klipspringer;
    Grote koedoe;
    Kleine koedoe;
    Elandantilope;
    Reuzenelandantilope;
    Waterbok;
    Roanantilope;
    Sabelantilope;
    Gemsbok;
    Beisaoryx;
    Arabische oryx;
    Algazel;
    Addax;
    Blauwe gnoe;
    Zwarte gnoe;
    Hartebeest;
    Topi;
    Blesbok;
    Bontebok;
    Saiga;
    Indische antilope;
    Vierhoornantilope;
    Saola
  `, [19]);

  koppelDieren(`
    Impala;
    Springbok;
    Thomson gazelle;
    Grantgazelle;
    Indische antilope;
    Gnoe;
    Blauwe gnoe;
    Zwarte gnoe
  `, [29, 40]);

  koppelDieren(`
    Springbok;
    Impala;
    Klipspringer;
    Grote koedoe;
    Kleine koedoe
  `, [34]);

  koppelDieren(`
    Dorcasgazelle;
    Damagazelle;
    Gemsbok;
    Arabische oryx;
    Algazel;
    Addax;
    Slankhoorngazelle
  `, [25]);

  koppelDieren(`
    Bongo;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Zebraduiker
  `, [48]);

  // ============================================================
  // KAMEELACHTIGEN
  // ============================================================

  viervoeters(`
    Kameel=Camelus bactrianus;
    Dromedaris=Camelus dromedarius;
    Wilde kameel=Camelus ferus;
    Lama=Lama glama;
    Alpaca=Vicugna pacos;
    Guanaco=Lama guanicoe;
    Vicuña=Vicugna vicugna
  `, [16, 18, 20, 36]);

  koppelDieren(`
    Kameel;
    Dromedaris;
    Wilde kameel
  `, [9, 25]);

  koppelDieren(`
    Kameel;
    Dromedaris;
    Lama;
    Alpaca
  `, [3, 13]);

  koppelDieren(`
    Lama;
    Alpaca;
    Guanaco;
    Vicuña
  `, [40]);

  koppelDieren(`
    Kameel;
    Dromedaris;
    Lama
  `, [46]);

  // ============================================================
  // VARKENS EN PEKARI'S
  // ============================================================

  viervoeters(`
    Varken;
    Wild zwijn=Sus scrofa;
    Everzwijn;
    Wrattenzwijn=Phacochoerus africanus;
    Woestijnwrattenzwijn=Phacochoerus aethiopicus;
    Boszwijn=Potamochoerus larvatus;
    Penseelzwijn=Potamochoerus porcus;
    Reuzenboszwijn=Hylochoerus meinertzhageni;
    Babiroesa;
    Noord-Sulawesibabiroesa=Babyrousa celebensis;
    Buru-babiroesa=Babyrousa babyrussa;
    Togianbabiroesa=Babyrousa togeanensis;
    Dwergzwijn=Porcula salvania;
    Baardzwijn=Sus barbatus;
    Palawanbaardzwijn=Sus ahoenobarbus;
    Javaans wrattenzwijn=Sus verrucosus;
    Visayawrattenzwijn=Sus cebifrons;
    Celebeswrattenzwijn=Sus celebensis;
    Filipijns wrattenzwijn=Sus philippensis;
    Pekari;
    Halsbandpekari=Dicotyles tajacu;
    Witlippekari=Tayassu pecari;
    Chacopekari=Catagonus wagneri
  `, [18, 20]);

  samenvoegen("Wild zwijn", "Everzwijn");

  koppelDieren(`
    Wrattenzwijn;
    Woestijnwrattenzwijn;
    Boszwijn;
    Penseelzwijn;
    Reuzenboszwijn
  `, [5]);

  koppelDieren(`
    Wild zwijn;
    Boszwijn;
    Penseelzwijn;
    Reuzenboszwijn;
    Baardzwijn;
    Halsbandpekari;
    Witlippekari
  `, [6]);

  koppelDieren(`
    Wild zwijn
  `, [26]);

  koppelDieren(`
    Varken;
    Wild zwijn;
    Wrattenzwijn;
    Penseelzwijn
  `, [16, 40]);

  koppelDieren("Varken", [13, 46]);

  // VARKENSRASSEN

  viervoeters(`
    Hangbuikzwijn;
    Minivarken;
    Göttinger minivarken;
    Kune kune;
    Mangalica;
    Tamworth;
    Berkshire;
    Duroc;
    Hampshirevarken;
    Pietrain;
    Large White;
    Landrasvarken;
    Nederlands landvarken;
    Belgisch landvarken;
    Yorkshirevarken;
    Gloucestershire old spot;
    Oxford sandy and black;
    British saddleback;
    Middle white;
    Large black;
    Iberisch varken;
    Meishan;
    Bama-minivarken;
    Turopoljevarken;
    Bentheimervarken
  `, [13, 18, 20]);

  koppelDieren(`
    Hangbuikzwijn;
    Minivarken;
    Göttinger minivarken;
    Kune kune
  `, [8]);

  koppelDieren(`
    Mangalica;
    Tamworth;
    Berkshire;
    Duroc;
    Hampshirevarken;
    Pietrain;
    Large White;
    Landrasvarken;
    Nederlands landvarken;
    Belgisch landvarken;
    Iberisch varken
  `, [46]);

  // ============================================================
  // KONIJNEN, HAZEN EN FLUITHAZEN
  // ============================================================

  viervoeters(`
    Konijn=Oryctolagus cuniculus;
    Haas;
    Europese haas=Lepus europaeus;
    Sneeuwhaas=Lepus timidus;
    Amerikaanse sneeuwhaas=Lepus americanus;
    Poolhaas=Lepus arcticus;
    Alaskahaas=Lepus othus;
    Witteflankhaas=Lepus callotis;
    Zwartstaarthaas=Lepus californicus;
    Witstaarthaas=Lepus townsendii;
    Antilopehaas=Lepus alleni;
    Kaapse haas=Lepus capensis;
    Savannehaas=Lepus victoriae;
    Ethiopische haas=Lepus fagani;
    Japanse haas=Lepus brachyurus;
    Chinese haas=Lepus sinensis;
    Koreaanse haas=Lepus coreanus;
    Indische haas=Lepus nigricollis;
    Woestijnhaas=Lepus tibetanus;
    Tolaihaas=Lepus tolai;
    Corsicaanse haas=Lepus corsicanus;
    Iberische haas=Lepus granatensis;
    Broomhaas=Lepus castroviejoi;
    Amami-konijn=Pentalagus furnessi;
    Vulkaankonijn=Romerolagus diazi;
    Gestreept konijn;
    Sumatraans gestreept konijn=Nesolagus netscheri;
    Annamitisch gestreept konijn=Nesolagus timminsi;
    Rivierkonijn=Bunolagus monticularis;
    Dwergkonijn;
    Amerikaans dwergkonijn=Brachylagus idahoensis;
    Oostelijk katoenstaartkonijn=Sylvilagus floridanus;
    Woestijnkatoenstaartkonijn=Sylvilagus audubonii;
    Bergkatoenstaartkonijn=Sylvilagus nuttallii;
    Moeraskonijn=Sylvilagus aquaticus;
    Marsh rabbit=Sylvilagus palustris;
    Braziliaans konijn=Sylvilagus brasiliensis;
    Dikstaartkonijn;
    Fluithaas=Pika;
    Amerikaanse fluithaas=Ochotona princeps;
    Kraagfluithaas=Ochotona collaris;
    Noordelijke fluithaas=Ochotona hyperborea;
    Alpenfluithaas=Ochotona alpina;
    Steppefluithaas=Ochotona pusilla;
    Plateaufluithaas=Ochotona curzoniae;
    Daurische fluithaas=Ochotona dauurica;
    Grote oorfluithaas=Ochotona macrotis;
    Ili-fluithaas=Ochotona iliensis;
    Afghaanse fluithaas=Ochotona rufescens
  `, [16, 20]);

  verwijderDier("Dikstaartkonijn");

  koppelDieren(`
    Konijn;
    Haas;
    Europese haas;
    Sneeuwhaas;
    Amerikaanse sneeuwhaas;
    Poolhaas;
    Zwartstaarthaas;
    Witstaarthaas;
    Antilopehaas;
    Kaapse haas;
    Savannehaas;
    Japanse haas;
    Indische haas;
    Woestijnhaas;
    Tolaihaas;
    Iberische haas;
    Oostelijk katoenstaartkonijn
  `, [18, 34]);

  koppelDieren("Konijn; Europese haas", [26]);
  koppelDieren("Konijn", [8, 13, 32, 46]);
  koppelDieren("Europese haas; Zwartstaarthaas", [29]);
  koppelDieren("Sneeuwhaas; Poolhaas; Alaskahaas", [24]);

  // KONIJNENRASSEN

  viervoeters(`
    Vlaamse reus;
    Franse hangoor;
    Engelse hangoor;
    Nederlandse hangoordwerg;
    Duitse hangoor;
    Meissner hangoor;
    Rexkonijn;
    Dwergrex;
    Angorakonijn;
    Satijnkonijn;
    Californian;
    Nieuw-Zeelanderkonijn;
    Hollanderkonijn;
    Poolkonijn;
    Kleurdwerg;
    Leeuwenkopkonijn;
    Teddy dwerg;
    Teddy hangoor;
    Duitse reus;
    Belgische haas;
    Lotharingerkonijn;
    Papillonkonijn;
    Wenerkonijn;
    Blauwe wener;
    Witte wener;
    Zwarte wener;
    Chinchillakonijn;
    Groot chinchillakonijn;
    Klein chinchillakonijn;
    Zilvervoskonijn;
    Alaska-konijn;
    Havannakonijn;
    Marterkonijn;
    Ruskonijn;
    Tan konijn;
    Thüringer konijn;
    Japannerkonijn;
    Rijnlander;
    Bourgondisch konijn;
    Engelse vlinder
  `, [8, 16, 18, 20, 34]);

  // ============================================================
  // EEKHOORNS
  // ============================================================

  viervoeters(`
    Eekhoorn;
    Rode eekhoorn=Sciurus vulgaris;
    Grijze eekhoorn=Sciurus carolinensis;
    Amerikaanse voseekhoorn=Sciurus niger;
    Japanse eekhoorn=Sciurus lis;
    Perzische eekhoorn=Sciurus anomalus;
    Arizona-eekhoorn=Sciurus arizonensis;
    Aberteekhoorn=Sciurus aberti;
    Mexicaanse rode eekhoorn=Sciurus aureogaster;
    Midden-Amerikaanse bonte eekhoorn=Sciurus variegatoides;
    Roodstaarteekhoorn=Sciurus granatensis;
    Amazone-eekhoorn;
    Japanse dwergvliegende eekhoorn=Pteromys momonga;
    Siberische vliegende eekhoorn=Pteromys volans;
    Noordelijke vliegende eekhoorn=Glaucomys sabrinus;
    Zuidelijke vliegende eekhoorn=Glaucomys volans;
    Rode reuzenvliegende eekhoorn=Petaurista petaurista;
    Bhutanese reuzenvliegende eekhoorn=Petaurista nobilis;
    Gevlekte reuzenvliegende eekhoorn=Petaurista elegans;
    Indische reuzeneekhoorn=Ratufa indica;
    Zwarte reuzeneekhoorn=Ratufa bicolor;
    Reuzeneekhoorn uit Sri Lanka=Ratufa macroura;
    Bleke reuzeneekhoorn=Ratufa affinis;
    Prevosts eekhoorn=Callosciurus prevostii;
    Pallas eekhoorn=Callosciurus erythraeus;
    Finlaysons eekhoorn=Callosciurus finlaysonii;
    Plantage-eekhoorn=Callosciurus notatus;
    Himalaya gestreepte eekhoorn=Tamiops macclellandii;
    Chinese gestreepte eekhoorn=Tamiops swinhoei;
    Afrikaanse dwerg eekhoorn=Myosciurus pumilio;
    Driegestreepte palmeekhoorn=Funambulus palmarum;
    Vijfgestreepte palmeekhoorn=Funambulus pennantii
  `, [18, 20, 35]);

  koppelDieren(`
    Rode eekhoorn;
    Grijze eekhoorn;
    Amerikaanse voseekhoorn;
    Japanse eekhoorn;
    Perzische eekhoorn;
    Aberteekhoorn;
    Indische reuzeneekhoorn;
    Zwarte reuzeneekhoorn;
    Prevosts eekhoorn;
    Pallas eekhoorn;
    Siberische vliegende eekhoorn;
    Japanse dwergvliegende eekhoorn
  `, [6, 31]);

  koppelDieren(`
    Eekhoorn;
    Rode eekhoorn;
    Grijze eekhoorn;
    Japanse eekhoorn
  `, [34]);

  koppelDieren("Rode eekhoorn", [26]);

  // Zwevende eekhoorns vliegen niet actief.

  verwijderKoppeling(
    "Siberische vliegende eekhoorn",
    [2]
  );

  // ============================================================
  // GRONDEEKHOORNS EN MARMOTTEN
  // ============================================================

  viervoeters(`
    Grondeekhoorn;
    Soeslik;
    Europese soeslik=Spermophilus citellus;
    Gele grondeekhoorn=Spermophilus fulvus;
    Gevlekte soeslik=Spermophilus suslicus;
    Arctische grondeekhoorn=Urocitellus parryii;
    Columbische grondeekhoorn=Urocitellus columbianus;
    Richardsons grondeekhoorn=Urocitellus richardsonii;
    Dertienstrepige grondeekhoorn=Ictidomys tridecemlineatus;
    Californische grondeekhoorn=Otospermophilus beecheyi;
    Rotseekhoorn=Otospermophilus variegatus;
    Goudmantelgrondeekhoorn=Callospermophilus lateralis;
    Kaapse grondeekhoorn=Xerus inauris;
    Gestreepte grondeekhoorn=Xerus erythropus;
    On gestreepte grondeekhoorn=Xerus rutilus;
    Damara-grondeekhoorn=Xerus princeps;
    Chipmunk;
    Oostelijke wangzakeekhoorn=Tamias striatus;
    Siberische grondeekhoorn=Eutamias sibiricus;
    Kleinste chipmunk=Neotamias minimus;
    Geelpijnboomchipmunk=Neotamias amoenus;
    Townsendchipmunk=Neotamias townsendii;
    Prairiedog=Prairiehond;
    Zwartstaartprairiehond=Cynomys ludovicianus;
    Witstaartprairiehond=Cynomys leucurus;
    Gunnisonprairiehond=Cynomys gunnisoni;
    Mexicaanse prairiehond=Cynomys mexicanus;
    Utahprairiehond=Cynomys parvidens;
    Marmot;
    Alpenmarmot=Marmota marmota;
    Bosmarmot=Marmota monax;
    Geelbuikmarmot=Marmota flaviventris;
    Grijze marmot=Marmota caligata;
    Vancouvermarmot=Marmota vancouverensis;
    Olympische marmot=Marmota olympus;
    Siberische marmot=Marmota sibirica;
    Bobakmarmot=Marmota bobak;
    Himalayamarmot=Marmota himalayana;
    Langstaartmarmot=Marmota caudata;
    Zwartkapmarmot=Marmota camtschatica;
    Menzbiermarmot=Marmota menzbieri
  `, [18, 20]);

  koppelDieren(`
    Marmot;
    Alpenmarmot;
    Bosmarmot;
    Geelbuikmarmot;
    Grijze marmot;
    Vancouvermarmot;
    Olympische marmot;
    Siberische marmot;
    Bobakmarmot;
    Himalayamarmot;
    Europese soeslik;
    Arctische grondeekhoorn;
    Columbische grondeekhoorn;
    Richardsons grondeekhoorn;
    Dertienstrepige grondeekhoorn
  `, [28, 32]);

  koppelDieren(`
    Prairiehond;
    Zwartstaartprairiehond;
    Witstaartprairiehond;
    Gunnisonprairiehond;
    Mexicaanse prairiehond;
    Utahprairiehond
  `, [32, 40]);

  koppelDieren(`
    Chipmunk;
    Oostelijke wangzakeekhoorn;
    Siberische grondeekhoorn;
    Dertienstrepige grondeekhoorn;
    Gestreepte grondeekhoorn
  `, [48]);

  // ============================================================
  // MUIZEN EN RATTEN
  // ============================================================

  viervoeters(`
    Muis;
    Rat;
    Huismuis=Mus musculus;
    Bosmuis=Apodemus sylvaticus;
    Grote bosmuis=Apodemus flavicollis;
    Dwergmuis=Micromys minutus;
    Brandmuis=Apodemus agrarius;
    Geelhalsmuis;
    Oogstmuis;
    Algerijnse muis=Mus spretus;
    Macedonische muis=Mus macedonicus;
    Steppemuis=Mus spicilegus;
    Bruine rat=Rattus norvegicus;
    Zwarte rat=Rattus rattus;
    Polynesische rat=Rattus exulans;
    Aziatische huisrat=Rattus tanezumi;
    Australische struikrat=Rattus fuscipes;
    Moerasrat=Rattus lutreolus;
    Rijstveldrat=Rattus argentiventer;
    Kleine bandicootrat=Bandicota bengalensis;
    Grote bandicootrat=Bandicota indica;
    Afrikaanse reuzenhamsterrat;
    Gambiaanse hamsterrat=Cricetomys gambianus;
    Emins hamsterrat=Cricetomys emini;
    Afrikaanse dwergmuis=Mus minutoides;
    Egyptische stekelmuis=Acomys cahirinus;
    Gouden stekelmuis=Acomys russatus;
    Kretenzische stekelmuis=Acomys minous;
    Kaapse stekelmuis=Acomys subspinosus;
    Afrikaanse gestreepte grasmuis=Rhabdomys pumilio;
    Vierstreepmuis;
    Afrikaanse multimammaatmuis=Mastomys natalensis;
    Afrikaanse zachtehaarmuis=Praomys;
    Afrikaanse boommuis=Dendromus;
    Australische springmuis;
    Spinifexspringmuis=Notomys alexis;
    Australische huppelmuis;
    Australische kastanjemuis=Pseudomys gracilicaudatus;
    Australische rotsrat=Zyzomys argurus;
    Gouden muis=Ochrotomys nuttalli;
    Amerikaanse witvoetmuis=Peromyscus leucopus;
    Amerikaanse hertmuis=Peromyscus maniculatus;
    Californische muis=Peromyscus californicus;
    Cactusmuis=Peromyscus eremicus;
    Katoenmuis=Peromyscus gossypinus;
    Katoenrat=Sigmodon hispidus;
    Amerikaanse grasmuis;
    Mexicaanse vulkaanmuis=Neotomodon alstoni;
    Oostelijke bosrat=Neotoma floridana;
    Woestijnbosrat=Neotoma lepida;
    Witkeelbosrat=Neotoma albigula;
    Amerikaanse rijstrat=Oryzomys palustris;
    Langstaartmuizen
  `, [18, 20]);

  samenvoegen("Grote bosmuis", "Geelhalsmuis");
  samenvoegen("Afrikaanse gestreepte grasmuis", "Vierstreepmuis");

  koppelDieren(`
    Huismuis;
    Bosmuis;
    Grote bosmuis;
    Dwergmuis;
    Bruine rat;
    Zwarte rat
  `, [26]);

  koppelDieren(`
    Huismuis;
    Bosmuis;
    Bruine rat;
    Zwarte rat;
    Afrikaanse reuzenhamsterrat;
    Gambiaanse hamsterrat;
    Egyptische stekelmuis;
    Australische struikrat;
    Amerikaanse hertmuis;
    Amerikaanse witvoetmuis
  `, [27]);

  koppelDieren(`
    Huismuis;
    Bruine rat;
    Egyptische stekelmuis
  `, [8]);

  koppelDieren(`
    Afrikaanse dwergmuis;
    Dwergmuis
  `, [10]);

  koppelDieren(`
    Spinifexspringmuis;
    Gouden stekelmuis
  `, [25]);

  // ============================================================
  // WOELMUIZEN EN LEMMINGEN
  // ============================================================

  viervoeters(`
    Woelmuis;
    Veldmuis=Microtus arvalis;
    Aardmuis=Microtus agrestis;
    Noordse woelmuis=Alexandromys oeconomus;
    Rosse woelmuis=Myodes glareolus;
    Ondergrondse woelmuis=Microtus subterraneus;
    Sneeuwmuis=Chionomys nivalis;
    Woelrat=Arvicola amphibius;
    Zuidwestelijke woelrat=Arvicola sapidus;
    Bergwoelrat=Arvicola scherman;
    Californische woelmuis=Microtus californicus;
    Prairie woelmuis=Microtus ochrogaster;
    Amerikaanse weidewoelmuis=Microtus pennsylvanicus;
    Boswoelmuis=Microtus pinetorum;
    Mongoolse woelmuis=Alexandromys mongolicus;
    Lemming;
    Noorse lemming=Lemmus lemmus;
    Siberische lemming=Lemmus sibiricus;
    Canadese bruine lemming=Lemmus trimucronatus;
    Halsbandlemming;
    Arctische halsbandlemming=Dicrostonyx torquatus;
    Groenlandse halsbandlemming=Dicrostonyx groenlandicus;
    Boslemming=Myopus schisticolor;
    Steppelemming=Lagurus lagurus
  `, [18, 20]);

  koppelDieren(`
    Veldmuis;
    Aardmuis;
    Noordse woelmuis;
    Rosse woelmuis;
    Ondergrondse woelmuis;
    Woelrat
  `, [26]);

  koppelDieren(`
    Noorse lemming;
    Siberische lemming;
    Canadese bruine lemming;
    Arctische halsbandlemming;
    Groenlandse halsbandlemming;
    Sneeuwmuis
  `, [24]);

  // ============================================================
  // HAMSTERS EN GERBILS
  // ============================================================

  viervoeters(`
    Hamster;
    Goudhamster=Syrische hamster=Mesocricetus auratus;
    Europese hamster=Cricetus cricetus=Korenwolf;
    Russische dwerghamster=Phodopus sungorus;
    Campbells dwerghamster=Phodopus campbelli;
    Roborovskihamster=Phodopus roborovskii;
    Chinese dwerghamster=Cricetulus griseus;
    Grijze dwerghamster=Cricetulus migratorius;
    Langstaartdwerghamster=Cricetulus longicaudatus;
    Armeense hamster=Cricetulus migratorius;
    Turkse hamster=Mesocricetus brandti;
    Roemeense hamster=Mesocricetus newtoni;
    Ciscaucasische hamster=Mesocricetus raddei;
    Mongoolse hamster=Allocricetulus curtatus;
    Kazachse hamster=Allocricetulus eversmanni;
    Gerbil;
    Mongoolse gerbil=Meriones unguiculatus;
    Perzische gerbil=Meriones persicus;
    Libische gerbil=Meriones libycus;
    Sundevalls gerbil=Meriones crassus;
    Grote gerbil=Rhombomys opimus;
    Dikstaartgerbil=Pachyuromys duprasi;
    Egyptische gerbil=Gerbillus pyramidum;
    Kleine Egyptische gerbil=Gerbillus gerbillus;
    Noord-Afrikaanse gerbil=Gerbillus campestris;
    Harigevoetgerbil;
    Indische gerbil=Tatera indica;
    Afrikaanse gerbil=Gerbilliscus;
    Kaapse gerbil=Gerbilliscus afra
  `, [18, 20]);

  samenvoegen("Grijze dwerghamster", "Armeense hamster");

  koppelDieren(`
    Hamster;
    Goudhamster;
    Russische dwerghamster;
    Campbells dwerghamster;
    Roborovskihamster;
    Chinese dwerghamster;
    Gerbil;
    Mongoolse gerbil;
    Dikstaartgerbil
  `, [8]);

  koppelDieren(`
    Europese hamster;
    Goudhamster;
    Mongoolse gerbil;
    Grote gerbil
  `, [32]);

  koppelDieren("Europese hamster", [26, 28]);

  koppelDieren(`
    Dikstaartgerbil;
    Egyptische gerbil;
    Kleine Egyptische gerbil;
    Libische gerbil;
    Roborovskihamster
  `, [25]);

  // ============================================================
  // CAVIA'S, CHINCHILLA'S EN VERWANTE KNAAGDIEREN
  // ============================================================

  viervoeters(`
    Cavia=Cavia porcellus;
    Wilde cavia=Cavia aperea;
    Grote cavia=Cavia magna;
    Bergcavia=Cavia tschudii;
    Braziliaanse rotscavia=Kerodon rupestris;
    Mara;
    Patagonische mara=Dolichotis patagonum;
    Chacomara=Dolichotis salinicola;
    Chinchilla;
    Langstaartchinchilla=Chinchilla lanigera;
    Kortstaartchinchilla=Chinchilla chinchilla;
    Viscacha;
    Gewone viscacha=Lagostomus maximus;
    Noordelijke bergviscacha=Lagidium peruanum;
    Zuidelijke bergviscacha=Lagidium viscacia;
    Degoe=Octodon degus;
    Brugdegoe=Octodon bridgesi;
    Maandegoe=Octodon lunatus;
    Cururo=Spalacopus cyanus;
    Agouti;
    Goudhaas=Dasyprocta leporina;
    Midden-Amerikaanse agouti=Dasyprocta punctata;
    Zwarte agouti=Dasyprocta fuliginosa;
    Azara-agouti=Dasyprocta azarae;
    Braziliaanse agouti=Dasyprocta aguti;
    Acouchy;
    Rode acouchy=Myoprocta acouchy;
    Groene acouchy=Myoprocta pratti;
    Paca=Cuniculus paca;
    Bergpaca=Cuniculus taczanowskii;
    Hutia;
    Cubaanse hutia=Capromys pilorides;
    Bahamahutia=Geocapromys ingrahami;
    Jamaicaanse hutia=Geocapromys brownii;
    Pacarana=Dinomys branickii;
    Bamboerat;
    Chinese bamboerat=Rhizomys sinensis;
    Grote bamboerat=Rhizomys sumatrensis;
    Kleine bamboerat=Cannomys badius
  `, [18, 20]);

  koppelDieren(`
    Cavia;
    Chinchilla;
    Langstaartchinchilla;
    Degoe
  `, [8]);

  koppelDieren(`
    Cavia;
    Wilde cavia;
    Grote cavia;
    Bergcavia;
    Patagonische mara;
    Chacomara;
    Chinchilla;
    Degoe;
    Agouti
  `, [16]);

  koppelDieren(`
    Chinchilla;
    Langstaartchinchilla;
    Kortstaartchinchilla;
    Noordelijke bergviscacha;
    Zuidelijke bergviscacha;
    Patagonische mara
  `, [34]);

  // ============================================================
  // STEKELVARKENS
  // ============================================================

  viervoeters(`
    Stekelvarken;
    Gewoon stekelvarken=Hystrix cristata;
    Zuid-Afrikaans stekelvarken=Hystrix africaeaustralis;
    Indisch stekelvarken=Hystrix indica;
    Maleis stekelvarken=Hystrix brachyura;
    Javaans stekelvarken=Hystrix javanica;
    Filipijns stekelvarken=Hystrix pumila;
    Borneostekelvarken=Hystrix crassispinis;
    Afrikaans kwaststaartstekelvarken=Atherurus africanus;
    Aziatisch kwaststaartstekelvarken=Atherurus macrourus;
    Langstaartstekelvarken=Trichys fasciculata;
    Noord-Amerikaans boomstekelvarken=Erethizon dorsatum;
    Braziliaans boomstekelvarken=Coendou prehensilis;
    Mexicaans boomstekelvarken=Coendou mexicanus;
    Dwergstekelvarken;
    Rood boomstekelvarken=Coendou spinosus
  `, [18]);

  koppelDieren(`
    Stekelvarken;
    Gewoon stekelvarken;
    Zuid-Afrikaans stekelvarken;
    Indisch stekelvarken;
    Noord-Amerikaans boomstekelvarken;
    Braziliaans boomstekelvarken
  `, [16]);

  koppelDieren(`
    Noord-Amerikaans boomstekelvarken;
    Braziliaans boomstekelvarken;
    Mexicaans boomstekelvarken;
    Rood boomstekelvarken
  `, [31, 35]);

  // ============================================================
  // EGELS, SPITSMUIZEN EN MOLLEN
  // ============================================================

  viervoeters(`
    Egel;
    Europese egel=Erinaceus europaeus;
    Oost-Europese egel=Erinaceus roumanicus;
    Zuidelijke witborstegel=Erinaceus concolor;
    Amoeregel=Erinaceus amurensis;
    Afrikaanse witbuikegel=Atelerix albiventris;
    Algerijnse egel=Atelerix algirus;
    Zuid-Afrikaanse egel=Atelerix frontalis;
    Somalische egel=Atelerix sclateri;
    Grootooregel=Hemiechinus auritus;
    Indische grootooregel=Hemiechinus collaris;
    Woestijnegel=Paraechinus aethiopicus;
    Indische egel=Paraechinus micropus;
    Daurische egel=Mesechinus dauuricus;
    Ha ar egel;
    Grote haaregel=Echinosorex gymnura;
    Kleine haaregel=Hylomys suillus;
    Spitsmuis;
    Gewone bosspitsmuis=Sorex araneus;
    Tweekleurige bosspitsmuis=Sorex coronatus;
    Dwergspitsmuis=Sorex minutus;
    Huisspitsmuis=Crocidura russula;
    Veldspitsmuis=Crocidura leucodon;
    Tuinspitsmuis=Crocidura suaveolens;
    Etruskische spitsmuis=Suncus etruscus;
    Aziatische huisspitsmuis=Suncus murinus;
    Afrikaanse reuzenspitsmuis=Crocidura olivieri;
    Noordelijke kortstaartspitsmuis=Blarina brevicauda;
    Zuidelijke kortstaartspitsmuis=Blarina carolinensis;
    Amerikaanse dwergspitsmuis=Cryptotis parvus;
    Amerikaanse gemaskerde spitsmuis=Sorex cinereus;
    Arctische spitsmuis=Sorex arcticus;
    Mol;
    Europese mol=Talpa europaea;
    Blinde mol=Talpa caeca;
    Iberische mol=Talpa occidentalis;
    Balkanmol=Talpa stankovici;
    Romeinse mol=Talpa romana;
    Kaukasische mol=Talpa caucasica;
    Siberische mol=Talpa altaica;
    Japanse mol=Mogera wogura;
    Kleine Japanse mol=Mogera imaizumii;
    Sterneusmol=Condylura cristata;
    Amerikaanse oostelijke mol=Scalopus aquaticus;
    Harige staartmol=Parascalops breweri;
    Breedvoetmol=Scapanus latimanus;
    Amerikaanse spitsmuismol=Neurotrichus gibbsii;
    Japanse spitsmuismol=Urotrichus talpoides;
    Goudmol;
    Kaapse goudmol=Chrysochloris asiatica;
    Reuzengoudmol=Chrysospalax trevelyani;
    Woestijngoudmol=Eremitalpa granti
  `);

  hernoemDier("Ha ar egel", "Haaregel");

  koppelDieren(`
    Egel;
    Europese egel;
    Oost-Europese egel;
    Afrikaanse witbuikegel;
    Algerijnse egel;
    Grootooregel;
    Spitsmuis;
    Gewone bosspitsmuis;
    Tweekleurige bosspitsmuis;
    Dwergspitsmuis;
    Huisspitsmuis;
    Veldspitsmuis;
    Tuinspitsmuis;
    Etruskische spitsmuis
  `, [15]);

  koppelDieren(`
    Europese egel;
    Gewone bosspitsmuis;
    Tweekleurige bosspitsmuis;
    Dwergspitsmuis;
    Huisspitsmuis;
    Veldspitsmuis;
    Europese mol
  `, [26]);

  koppelDieren(`
    Egel;
    Europese egel;
    Oost-Europese egel;
    Afrikaanse witbuikegel;
    Woestijnegel
  `, [27]);

  koppelDieren(`
    Egel;
    Europese egel;
    Oost-Europese egel
  `, [28]);

  koppelDieren(`
    Mol;
    Europese mol;
    Blinde mol;
    Iberische mol;
    Balkanmol;
    Romeinse mol;
    Siberische mol;
    Japanse mol;
    Sterneusmol;
    Amerikaanse oostelijke mol;
    Breedvoetmol;
    Goudmol;
    Kaapse goudmol;
    Reuzengoudmol;
    Woestijngoudmol
  `, [32]);

  koppelDieren(`
    Etruskische spitsmuis;
    Dwergspitsmuis;
    Amerikaanse dwergspitsmuis
  `, [10]);

  // ============================================================
  // NAAKTMOLRATTEN EN ANDERE GRAVENDE KNAAGDIEREN
  // ============================================================

  viervoeters(`
    Naakte molrat=Heterocephalus glaber;
    Damaralandmolrat=Fukomys damarensis;
    Gewone molrat=Cryptomys hottentotus;
    Kaapse molrat=Georychus capensis;
    Kaapse duinmolrat=Bathyergus suillus;
    Namaquaduinmolrat=Bathyergus janetta;
    Blindmuis;
    Grote blindmuis=Spalax microphthalmus;
    Balkanblindmuis=Nannospalax leucodon;
    Palestijnse blindmuis=Nannospalax ehrenbergi;
    Zokor;
    Chinese zokor=Eospalax fontanierii;
    Altaizokor=Myospalax myospalax;
    Zakgoffer;
    Oostelijke zakgoffer=Geomys bursarius;
    Botta-zakgoffer=Thomomys bottae;
    Noordelijke zakgoffer=Thomomys talpoides;
    Gele zakgoffer=Pappogeomys bulleri;
    Toekotoeko=Ctenomys;
    Springhaas=Pedetes capensis;
    Oost-Afrikaanse springhaas=Pedetes surdaster;
    Woestijnspringmuis=Jaculus jaculus;
    Grote Egyptische springmuis=Jaculus orientalis;
    Grootoorspr ingmuis=Euchoreutes naso;
    Vijfteen springmuis=Allactaga major;
    Dwergspringmuis;
    Kangoeroerat;
    Merriams kangoeroerat=Dipodomys merriami;
    Reuzenkangoeroerat=Dipodomys ingens;
    Vaantjesstaartkangoeroerat=Dipodomys spectabilis
  `);

  hernoemDier("Grootoorspr ingmuis", "Grootoorspringmuis");

  koppelDieren(`
    Naakte molrat;
    Damaralandmolrat;
    Gewone molrat;
    Kaapse molrat;
    Kaapse duinmolrat;
    Blindmuis;
    Grote blindmuis;
    Balkanblindmuis;
    Palestijnse blindmuis;
    Zokor;
    Chinese zokor;
    Altaizokor;
    Zakgoffer;
    Oostelijke zakgoffer;
    Botta-zakgoffer;
    Noordelijke zakgoffer;
    Toekotoeko
  `, [32]);

  koppelDieren(`
    Springhaas;
    Oost-Afrikaanse springhaas;
    Woestijnspringmuis;
    Grote Egyptische springmuis;
    Grootoorspringmuis;
    Kangoeroerat;
    Merriams kangoeroerat;
    Reuzenkangoeroerat
  `, [18, 20, 34]);

  koppelDieren(`
    Naakte molrat;
    Damaralandmolrat
  `, [5, 40]);

  // ============================================================
  // KANGOEROES EN WALLABY'S
  // ============================================================

  zoogdieren(`
    Kangoeroe=Kangaroo;
    Rode reuzenkangoeroe=Osphranter rufus;
    Oostelijke grijze reuzenkangoeroe=Macropus giganteus;
    Westelijke grijze reuzenkangoeroe=Macropus fuliginosus;
    Bergkangoeroe=Osphranter robustus;
    Zwarte wallaroe=Osphranter bernardus;
    Antilopekangoeroe=Osphranter antilopinus;
    Wallaby;
    Bennettwallaby=Notamacropus rufogriseus;
    Moeraswallaby=Wallabia bicolor;
    Tammarwallaby=Notamacropus eugenii;
    Agile wallaby=Notamacropus agilis;
    Parmawallaby=Notamacropus parma;
    Zwartgestreepte wallaby=Notamacropus dorsalis;
    Rotswallaby;
    Geelvoet rotswallaby=Petrogale xanthopus;
    Borstelstaartrotswallaby=Petrogale penicillata;
    Zwartvoetrotswallaby=Petrogale lateralis;
    Kortoorrotswallaby=Petrogale brachyotis;
    Monjon=Petrogale burbidgei;
    Proserpine-rotswallaby=Petrogale persephone;
    Quokka=Setonix brachyurus;
    Haaswallaby;
    Gestreepte haaswallaby=Lagostrophus fasciatus;
    Rode haaswallaby=Lagorchestes hirsutus;
    Bril haaswallaby=Lagorchestes conspicillatus;
    Boomkangoeroe;
    Goodfellowboomkangoeroe=Dendrolagus goodfellowi;
    Matschieboomkangoeroe=Dendrolagus matschiei;
    Lumholtzboomkangoeroe=Dendrolagus lumholtzi;
    Bennettboomkangoeroe=Dendrolagus bennettianus;
    Doriaboomkangoeroe=Dendrolagus dorianus;
    Grijze boomkangoeroe=Dendrolagus inustus;
    Goudmantelboomkangoeroe=Dendrolagus pulcherrimus;
    Wondiwoiboomkangoeroe=Dendrolagus mayri;
    Dingisoboomkangoeroe=Dendrolagus mbaiso;
    Ratkangoeroe;
    Langneuspotoro e=Potorous tridactylus;
    Gilbertpotoro e=Potorous gilbertii;
    Langvoetpotoro e=Potorous longipes;
    Borstelstaartbettong=Bettongia penicillata;
    Gravende bettong=Bettongia lesueur;
    Tasmaanse bettong=Bettongia gaimardi;
    Noordelijke bettong=Bettongia tropica;
    Muskuskangoeroerat=Hypsiprymnodon moschatus
  `, [18, 20]);

  hernoemDier("Langneuspotoro e", "Langneuspotoroe");
  hernoemDier("Gilbertpotoro e", "Gilbertpotoroe");
  hernoemDier("Langvoetpotoro e", "Langvoetpotoroe");

  koppelDieren(`
    Kangoeroe;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Bergkangoeroe;
    Zwarte wallaroe;
    Antilopekangoeroe;
    Wallaby;
    Bennettwallaby;
    Moeraswallaby;
    Tammarwallaby;
    Parmawallaby;
    Rotswallaby;
    Quokka;
    Rode haaswallaby;
    Gestreepte haaswallaby;
    Lumholtzboomkangoeroe;
    Bennettboomkangoeroe;
    Langneuspotoroe;
    Gilbertpotoroe;
    Langvoetpotoroe;
    Borstelstaartbettong;
    Gravende bettong;
    Tasmaanse bettong;
    Noordelijke bettong;
    Muskuskangoeroerat
  `, [23]);

  koppelDieren(`
    Kangoeroe;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Bergkangoeroe;
    Wallaby;
    Bennettwallaby;
    Moeraswallaby;
    Tammarwallaby;
    Rotswallaby;
    Quokka;
    Haaswallaby;
    Ratkangoeroe;
    Langneuspotoroe
  `, [34]);

  koppelDieren(`
    Boomkangoeroe;
    Goodfellowboomkangoeroe;
    Matschieboomkangoeroe;
    Lumholtzboomkangoeroe;
    Bennettboomkangoeroe;
    Doriaboomkangoeroe;
    Grijze boomkangoeroe;
    Goudmantelboomkangoeroe
  `, [31, 35]);

  // ============================================================
  // OVERIGE BUIDELDIEREN
  // ============================================================

  viervoeters(`
    Koala=Phascolarctos cinereus;
    Wombat;
    Gewone wombat=Vombatus ursinus;
    Noordelijke breedneuswombat=Lasiorhinus krefftii;
    Zuidelijke breedneuswombat=Lasiorhinus latifrons;
    Tasmaanse duivel=Sarcophilus harrisii;
    Buidelmarter;
    Gevlekte buidelmarter=Dasyurus maculatus;
    Oostelijke buidelmarter=Dasyurus viverrinus;
    Westelijke buidelmarter=Dasyurus geoffroii;
    Noordelijke buidelmarter=Dasyurus hallucatus;
    Nieuw-Guinese buidelmarter=Dasyurus albopunctatus;
    Bronzen buidelmarter=Dasyurus spartacus;
    Numbat=Buidelmiereneter=Myrmecobius fasciatus;
    Bandicoot;
    Langneusbandicoot=Perameles nasuta;
    Oostelijke gestreepte bandicoot=Perameles gunnii;
    Westelijke gestreepte bandicoot=Perameles bougainville;
    Gouden bandicoot=Isoodon auratus;
    Noordelijke bruine bandicoot=Isoodon macrourus;
    Zuidelijke bruine bandicoot=Isoodon obesulus;
    Bilby=Konijnenbuideldas=Macrotis lagotis;
    Suikereekhoorn=Suikerzweefbuideldier=Petaurus breviceps;
    Mahoniezweefbuideldier=Petaurus gracilis;
    Geelbuikzweefbuideldier=Petaurus australis;
    Eekhoornzweefbuideldier=Petaurus norfolcensis;
    Grote zweefbuidelrat=Petauroides volans;
    Vederstaartbuidelmuis=Acrobates pygmaeus;
    Voskoesoe=Trichosurus vulpecula;
    Bergvoskoesoe=Trichosurus caninus;
    Noordelijke voskoesoe=Trichosurus arnhemensis;
    Ringstaartbuidelrat=Pseudocheirus peregrinus;
    Groene ringstaartbuidelrat=Pseudochirops archeri;
    Gevlekte koeskoes=Spilocuscus maculatus;
    Zwarte koeskoes=Spilocuscus rufoniger;
    Gewone koeskoes=Phalanger orientalis;
    Beerkoeskoes=Ailurops ursinus;
    Dwergbuidelmuis;
    Tasmaanse dwergbuidelmuis=Cercartetus lepidus;
    Westelijke dwergbuidelmuis=Cercartetus concinnus;
    Oostelijke dwergbuidelmuis=Cercartetus nanus;
    Honingbuidelmuis=Tarsipes rostratus;
    Dunnart;
    Dikstaartdunnart=Sminthopsis crassicaudata;
    Smalvoetbuidelmuis;
    Antechinus;
    Bruine antechinus=Antechinus stuartii;
    Geelvoetantechinus=Antechinus flavipes;
    Kowari=Dasyuroides byrnei;
    Mulgara;
    Borstelstaartmulgara=Dasycercus blythi;
    Buidelmol;
    Zuidelijke buidelmol=Notoryctes typhlops;
    Noordelijke buidelmol=Notoryctes caurinus;
    Opossum;
    Virginia-opossum=Didelphis virginiana;
    Gewone opossum=Didelphis marsupialis;
    Witooropossum=Didelphis albiventris;
    Grote wolopossum=Caluromys lanatus;
    Grijze kortstaartopossum=Monodelphis domestica;
    Muisopossum;
    Zuidelijke muisopossum=Thylamys elegans;
    Monito del monte=Dromiciops gliroides
  `, [20]);

  koppelDieren(`
    Koala;
    Wombat;
    Gewone wombat;
    Noordelijke breedneuswombat;
    Zuidelijke breedneuswombat;
    Tasmaanse duivel;
    Gevlekte buidelmarter;
    Oostelijke buidelmarter;
    Westelijke buidelmarter;
    Noordelijke buidelmarter;
    Numbat;
    Langneusbandicoot;
    Oostelijke gestreepte bandicoot;
    Westelijke gestreepte bandicoot;
    Gouden bandicoot;
    Bilby;
    Suikereekhoorn;
    Mahoniezweefbuideldier;
    Geelbuikzweefbuideldier;
    Eekhoornzweefbuideldier;
    Grote zweefbuidelrat;
    Vederstaartbuidelmuis;
    Voskoesoe;
    Ringstaartbuidelrat;
    Groene ringstaartbuidelrat;
    Honingbuidelmuis;
    Kowari;
    Buidelmol;
    Zuidelijke buidelmol;
    Noordelijke buidelmol
  `, [23]);

  koppelDieren(`
    Koala;
    Suikereekhoorn;
    Mahoniezweefbuideldier;
    Geelbuikzweefbuideldier;
    Eekhoornzweefbuideldier;
    Grote zweefbuidelrat;
    Voskoesoe;
    Ringstaartbuidelrat;
    Groene ringstaartbuidelrat;
    Gevlekte koeskoes;
    Zwarte koeskoes;
    Beerkoeskoes;
    Monito del monte
  `, [31, 35]);

  koppelDieren(`
    Wombat;
    Gewone wombat;
    Noordelijke breedneuswombat;
    Zuidelijke breedneuswombat;
    Bilby;
    Buidelmol;
    Zuidelijke buidelmol;
    Noordelijke buidelmol
  `, [32]);

  koppelDieren(`
    Tasmaanse duivel;
    Buidelmarter;
    Gevlekte buidelmarter;
    Oostelijke buidelmarter
  `, [17]);

  koppelDieren("Numbat", [15, 48]);
  koppelDieren("Koala", [3, 16, 30]);
  koppelDieren("Gevlekte buidelmarter; Gevlekte koeskoes", [49]);

  // ============================================================
  // MIERENETERS EN LUIAARDS
  // ============================================================

  viervoeters(`
    Miereneter;
    Reuzenmiereneter=Myrmecophaga tridactyla;
    Noordelijke boommiereneter=Tamandua mexicana;
    Zuidelijke boommiereneter=Tamandua tetradactyla;
    Dwergmiereneter;
    Zijdeachtige miereneter=Cyclopes didactylus
  `, [15, 18, 20]);

  viervoeters(`
    Luiaard;
    Tweevingerige luiaard;
    Hoffmannluiaard=Choloepus hoffmanni;
    Linnaeusluiaard=Choloepus didactylus;
    Drievingerige luiaard;
    Bruinkeel luiaard=Bradypus variegatus;
    Bleekkeelluiaard=Bradypus tridactylus;
    Manenluiaard=Bradypus torquatus;
    Dwergluiaard=Bradypus pygmaeus
  `, [6, 12, 20, 30, 31, 35]);

  koppelDieren(`
    Noordelijke boommiereneter;
    Zuidelijke boommiereneter;
    Dwergmiereneter;
    Zijdeachtige miereneter
  `, [31, 35]);

  koppelDieren("Reuzenmiereneter; Luiaard", [3]);

  // ============================================================
  // GORDELDIEREN
  // ============================================================

  viervoeters(`
    Gordeldier;
    Negenbandgordeldier=Dasypus novemcinctus;
    Zevenbandgordeldier=Dasypus septemcinctus;
    Zuidelijk langsnuitgordeldier=Dasypus hybridus;
    Groot langsnuitgordeldier=Dasypus kappleri;
    Reuzengordeldier=Priodontes maximus;
    Zesbandgordeldier=Euphractus sexcinctus;
    Driebandgordeldier;
    Zuidelijk driebandgordeldier=Tolypeutes matacus;
    Braziliaans driebandgordeldier=Tolypeutes tricinctus;
    Groot behaard gordeldier=Chaetophractus villosus;
    Klein behaard gordeldier=Chaetophractus vellerosus;
    Andesgordeldier;
    Roze gordelmol=Chlamyphorus truncatus;
    Grote gordelmol=Calyptophractus retusus;
    Noordelijk naaktstaartgordeldier=Cabassous centralis;
    Zuidelijk naaktstaartgordeldier=Cabassous unicinctus;
    Groot naaktstaartgordeldier=Cabassous tatouay;
    Chacogordeldier=Cabassous chacoensis
  `, [18, 33]);

  koppelDieren(`
    Gordeldier;
    Negenbandgordeldier;
    Reuzengordeldier;
    Zesbandgordeldier;
    Driebandgordeldier;
    Roze gordelmol
  `, [15]);

  koppelDieren(`
    Negenbandgordeldier;
    Reuzengordeldier;
    Roze gordelmol;
    Grote gordelmol
  `, [32]);

  // ============================================================
  // SCHUBDIEREN
  // ============================================================

  viervoeters(`
    Schubdier=Pangolin;
    Chinees schubdier=Manis pentadactyla;
    Indisch schubdier=Manis crassicaudata;
    Maleis schubdier=Manis javanica;
    Filipijns schubdier=Manis culionensis;
    Reuzenschubdier=Smutsia gigantea;
    Kaaps schubdier=Smutsia temminckii;
    Witbuikschubdier=Phataginus tricuspis;
    Langstaartschubdier=Phataginus tetradactyla
  `, [15, 18, 21]);

  koppelDieren(`
    Reuzenschubdier;
    Kaaps schubdier;
    Witbuikschubdier;
    Langstaartschubdier
  `, [5]);

  koppelDieren(`
    Witbuikschubdier;
    Langstaartschubdier
  `, [31, 35]);

  // ============================================================
  // AARDVARKENS, KLIPDASSEN EN OLIFANTSSPITSMUIZEN
  // ============================================================

  viervoeters(`
    Aardvarken=Orycteropus afer
  `, [5, 15, 18, 20, 27, 32]);

  viervoeters(`
    Klipdas;
    Kaapse klipdas=Procavia capensis;
    Geelvlekklipdas=Heterohyrax brucei;
    Zuidelijke boomklipdas=Dendrohyrax arboreus;
    Westelijke boomklipdas=Dendrohyrax dorsalis;
    Oostelijke boomklipdas=Dendrohyrax validus
  `, [5, 16, 20]);

  viervoeters(`
    Olifantsspitsmuis;
    Sengi;
    Kortoorolifantsspitsmuis=Macroscelides proboscideus;
    Rotsolifantsspitsmuis=Elephantulus rupestris;
    Oostelijke rotsolifantsspitsmuis=Elephantulus myurus;
    Roodbruine olifantsspitsmuis=Elephantulus rufescens;
    Noord-Afrikaanse olifantsspitsmuis=Petrosaltator rozeti;
    Somalische olifantsspitsmuis=Galegeeska revoilii;
    Goudstuitolifantsspitsmuis=Rhynchocyon chrysopygus;
    Zwart-rode olifantsspitsmuis=Rhynchocyon petersi;
    Gevlekte olifantsspitsmuis=Rhynchocyon cirnei;
    Grijskopolifantsspitsmuis=Rhynchocyon udzungwensis
  `, [5, 15, 18, 20]);

  samenvoegen("Olifantsspitsmuis", "Sengi");

  // ============================================================
  // TENREKS
  // ============================================================

  viervoeters(`
    Tenrek;
    Gewone tenrek=Tenrec ecaudatus;
    Grote egeltenrek=Setifer setosus;
    Kleine egeltenrek=Echinops telfairi;
    Laaglandstreeptenrek=Hemicentetes semispinosus;
    Hooglandstreeptenrek=Hemicentetes nigriceps;
    Rijsttenrek;
    Watertenrek=Microgale mergulus;
    Langstaarttenrek;
    Dwergtenrek=Microgale parvula;
    Kortstaarttenrek=Microgale brevicaudata;
    Graciele tenrek=Microgale gracilis;
    Grote spitsmuistenrek=Microgale dobsoni;
    Afrikaanse otterspitsmuis=Potamogale velox;
    Dwergotterspitsmuis=Micropotamogale lamottei;
    Ruwenzori-otterspitsmuis=Micropotamogale ruwenzorii
  `, [5]);

  koppelDieren(`
    Laaglandstreeptenrek;
    Hooglandstreeptenrek
  `, [48]);

  koppelDieren("Watertenrek; Afrikaanse otterspitsmuis", [1, 14]);

  // ============================================================
  // EIERLEGGENDE ZOOGDIEREN
  // ============================================================

  viervoeters(`
    Mierenegel;
    Gewone mierenegel=Tachyglossus aculeatus;
    Westelijke langsnavelmierenegel=Zaglossus bruijnii;
    Oostelijke langsnavelmierenegel=Zaglossus bartoni;
    Attenboroughs mierenegel=Zaglossus attenboroughi
  `, [7, 15]);

  koppelDieren("Gewone mierenegel", [23]);
  koppelDieren("Vogelbekdier", [4, 7, 18, 20, 23]);

  // ============================================================
  // TOEPAI'S EN VLIEGENDE MAK I'S
  // ============================================================

  viervoeters(`
    Toepaja;
    Gewone toepaja=Tupaia glis;
    Noordelijke toepaja=Tupaia belangeri;
    Grote toepaja=Tupaia tana;
    Bergtoepaja=Tupaia montana;
    Kleine toepaja=Tupaia minor;
    Gestreepte toepaja=Tupaia dorsalis;
    Indische toepaja=Anathana ellioti;
    Vederstaarttoepaja=Ptilocercus lowii;
    Vliegende maki;
    Maleise vliegende maki=Galeopterus variegatus;
    Filipijnse vliegende maki=Cynocephalus volans
  `, [20]);

  koppelDieren(`
    Vliegende maki;
    Maleise vliegende maki;
    Filipijnse vliegende maki
  `, [12, 31, 35]);

  // Ook vliegende maki's zweven en krijgen daarom
  // geen koppeling aan vraag 2.

  // ============================================================
  // ALGEMENE CORRECTIES UIT EERDERE DELEN
  // ============================================================

  // Nonnetje kan zowel een vogel als een weekdier zijn.
  // Deze twee dieren mogen niet als dezelfde soort worden
  // behandeld. De wetenschappelijke namen worden gescheiden.

  verwijderDier("Nonnetje");

  dier("Nonnetje (vogel)", [
    1, 2, 7, 14, 17, 18, 22, 50
  ], [
    "Nonnetje",
    "Mergellus albellus"
  ]);

  dier("Nonnetje (schelpdier)", [
    1, 11, 39, 50
  ], [
    "Nonnetje",
    "Limecola balthica",
    "Macoma balthica"
  ]);

  // Een eierleggend zoogdier is mogelijk:
  // het vogelbekdier en de mierenegels.

  koppelDieren(`
    Vogelbekdier;
    Mierenegel;
    Gewone mierenegel;
    Westelijke langsnavelmierenegel;
    Oostelijke langsnavelmierenegel;
    Attenboroughs mierenegel
  `, [7]);

  // ============================================================
  // AANVULLENDE KOPPELINGEN VOOR BEKENDE ZOOGDIEREN
  // ============================================================

  // Vraag 3: dierentuin

  koppelDieren(`
    Leeuw;
    Tijger;
    Jachtluipaard;
    Luipaard;
    Jaguar;
    Poema;
    Sneeuwluipaard;
    Lynx;
    Caracal;
    Serval;
    Ocelot;
    Wolf;
    Poolvos;
    Woestijnvos;
    Afrikaanse wilde hond;
    Manenwolf;
    Bruine beer;
    IJsbeer;
    Maleise beer;
    Brilbeer;
    Reuzenpanda;
    Rode panda;
    Gevlekte hyena;
    Wasbeer;
    Neusbeer;
    Stokstaartje;
    Zebramangoest;
    Bintoerong;
    Fossa;
    Gorilla;
    Chimpansee;
    Bonobo;
    Orang-oetan;
    Siamang;
    Gibbon;
    Berberaap;
    Japanse makaak;
    Resusaap;
    Mandril;
    Gelada;
    Mantelbaviaan;
    Baviaan;
    Kapucijnaap;
    Doodshoofdaapje;
    Slingeraap;
    Ringstaartmaki;
    Rode vari;
    Zwart-witte vari;
    Dwergzijdeaapje;
    Gouden leeuwaapje;
    Keizertamarin;
    Katoentoptamarin;
    Olifant;
    Afrikaanse savanneolifant;
    Aziatische olifant;
    Neushoorn;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Zebra;
    Steppezebra;
    Grévyzebra;
    Przewalskipaard;
    Tapir;
    Laaglandtapir;
    Indische tapir;
    Giraf;
    Okapi;
    Nijlpaard;
    Dwergnijlpaard;
    Amerikaanse bizon;
    Europese bizon;
    Waterbuffel;
    Muskusos;
    Rendier;
    Eland;
    Edelhert;
    Damhert;
    Dromedaris;
    Kameel;
    Lama;
    Alpaca;
    Vicuña;
    Guanaco;
    Impala;
    Springbok;
    Grote koedoe;
    Kleine koedoe;
    Bongo;
    Sabelantilope;
    Gemsbok;
    Addax;
    Algazel;
    Blauwe gnoe;
    Wrattenzwijn;
    Penseelzwijn;
    Babiroesa;
    Halsbandpekari;
    Capibara;
    Kleine capibara;
    Bever;
    Europese otter;
    Reuzenotter;
    Zeeotter;
    Dwergotter;
    Californische zeeleeuw;
    Gewone zeehond;
    Grijze zeehond;
    Walrus;
    Rode reuzenkangoeroe;
    Bennettwallaby;
    Quokka;
    Koala;
    Wombat;
    Tasmaanse duivel;
    Reuzenmiereneter;
    Luiaard;
    Gordeldier;
    Aardvarken;
    Klipdas;
    Stekelvarken;
    Chinchilla;
    Degoe;
    Patagonische mara;
    Agouti;
    Naakte molrat;
    Konijn;
    Cavia
  `, [3]);

  // Vraag 8: huisdieren

  koppelDieren(`
    Hond;
    Huiskat;
    Konijn;
    Cavia;
    Hamster;
    Goudhamster;
    Russische dwerghamster;
    Campbells dwerghamster;
    Roborovskihamster;
    Chinese dwerghamster;
    Gerbil;
    Mongoolse gerbil;
    Chinchilla;
    Degoe;
    Fret;
    Huismuis;
    Bruine rat;
    Paard;
    Pony;
    Ezel;
    Dwerggeit;
    Hangbuikzwijn;
    Minivarken;
    Alpaca;
    Lama
  `, [8]);

  // Vraag 9: groter dan een mens

  koppelDieren(`
    Olifant;
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Giraf;
    Netgiraf;
    Masaigiraf;
    Neushoorn;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Nijlpaard;
    Paard;
    Shire;
    Clydesdale;
    Belgisch trekpaard;
    Amerikaanse bizon;
    Europese bizon;
    Afrikaanse buffel;
    Gaur;
    Jak;
    Wilde jak;
    Eland;
    Kameel;
    Dromedaris;
    IJsbeer;
    Kodiakbeer;
    Grizzlybeer;
    Bruine beer;
    Walrus;
    Zuidelijke zeeolifant;
    Noordelijke zeeolifant;
    Zeekrokodil;
    Nijlkrokodil;
    Blauwe vinvis;
    Gewone vinvis;
    Bultrug;
    Potvis;
    Orka;
    Walvishaai;
    Reuzenhaai;
    Witte haai;
    Tijgerhaai;
    Reuzenmanta
  `, [9]);

  // Vraag 13: boerderijdieren

  koppelDieren(`
    Koe;
    Schaap;
    Geit;
    Paard;
    Pony;
    Ezel;
    Muildier;
    Muilezel;
    Varken;
    Kalf;
    Stier;
    Os;
    Konijn;
    Waterbuffel;
    Jak;
    Lama;
    Alpaca;
    Wilde eend;
    Muskuseend;
    Gans;
    Grauwe gans;
    Wilde kalkoen;
    Helmparelhoen;
    Japanse kwartel;
    Honingbij
  `, [13]);

  // Vraag 14: dieren die kunnen zwemmen

  koppelDieren(`
    Hond;
    Paard;
    Eland;
    Rendier;
    IJsbeer;
    Bruine beer;
    Tijger;
    Jaguar;
    Wild zwijn;
    Varken;
    Wasbeer;
    Europese otter;
    Amerikaanse nerts;
    Waterbuffel;
    Laaglandtapir;
    Indische tapir;
    Olifant;
    Afrikaanse savanneolifant;
    Aziatische olifant;
    Bruine rat
  `, [14]);

  // Vraag 16: planteneters

  koppelDieren(`
    Reuzenpanda;
    Rode panda;
    Olifant;
    Neushoorn;
    Giraf;
    Okapi;
    Nijlpaard;
    Dwergnijlpaard;
    Paard;
    Ezel;
    Zebra;
    Tapir;
    Edelhert;
    Ree;
    Damhert;
    Rendier;
    Eland;
    Wapiti;
    Axishert;
    Rund;
    Koe;
    Jak;
    Amerikaanse bizon;
    Europese bizon;
    Waterbuffel;
    Muskusos;
    Schaap;
    Geit;
    Steenbok;
    Gems;
    Moeflon;
    Antilope;
    Gazelle;
    Impala;
    Springbok;
    Gnoe;
    Grote koedoe;
    Elandantilope;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Guanaco;
    Vicuña;
    Konijn;
    Haas;
    Fluithaas;
    Cavia;
    Chinchilla;
    Degoe;
    Patagonische mara;
    Capibara;
    Bever;
    Muskusrat;
    Beverrat;
    Kangoeroe;
    Rode reuzenkangoeroe;
    Wallaby;
    Quokka;
    Wombat;
    Koala;
    Luiaard;
    Klipdas;
    Zeekoe;
    Doegong;
    Lamantijn;
    Graskarper
  `, [16]);

  // Vraag 27: nachtdieren

  koppelDieren(`
    Rode vos;
    Wasbeerhond;
    Woestijnvos;
    Zandkat;
    Zwartvoetkat;
    Ocelot;
    Margay;
    Europese das;
    Steenmarter;
    Boommarter;
    Bunzing;
    Wasbeer;
    Ringstaartkat;
    Stinkdier;
    Afrikaanse civetkat;
    Gewone genetkat;
    Loewak;
    Bintoerong;
    Fossa;
    Galago;
    Potto;
    Plompe lori;
    Spookdiertje;
    Nachtaap;
    Vingerdier;
    Muismaki;
    Dwergmaki;
    Wild zwijn;
    Egel;
    Europese egel;
    Huismuis;
    Bruine rat;
    Zwarte rat;
    Bosmuis;
    Goudhamster;
    Europese hamster;
    Chinchilla;
    Aardvarken;
    Gordeldier;
    Schubdier;
    Tasmaanse duivel;
    Wombat;
    Bilby;
    Suikereekhoorn;
    Voskoesoe;
    Opossum;
    Bever
  `, [27]);

  // Vraag 29: snel bewegende dieren

  koppelDieren(`
    Jachtluipaard;
    Leeuw;
    Tijger;
    Luipaard;
    Poema;
    Wolf;
    Afrikaanse wilde hond;
    Coyote;
    Paard;
    Engelse volbloed;
    Quarter horse;
    Zebra;
    Grévyzebra;
    Gnoe;
    Blauwe gnoe;
    Springbok;
    Impala;
    Thomson gazelle;
    Grantgazelle;
    Indische antilope;
    Europese haas;
    Zwartstaarthaas;
    Rode reuzenkangoeroe;
    Greyhound;
    Whippet;
    Saluki
  `, [29]);

  // Vraag 30: langzame dieren

  koppelDieren(`
    Luiaard;
    Tweevingerige luiaard;
    Drievingerige luiaard;
    Hoffmannluiaard;
    Linnaeusluiaard;
    Dwergluiaard;
    Manenluiaard;
    Plompe lori;
    Slanke lori;
    Zeekomkommer;
    Zeester;
    Zee-egel;
    Zeeslak;
    Poelslak;
    Waterschildpad;
    Zeeschildpad
  `, [30]);

  // Vraag 36: lange nek

  koppelDieren(`
    Giraf;
    Netgiraf;
    Masaigiraf;
    Noordelijke giraf;
    Zuidelijke giraf;
    Gerenoek;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Guanaco;
    Vicuña;
    Australische slangenhalsschildpad;
    Nieuw-Guinese slangenhalsschildpad
  `, [36]);

  // Vraag 40: groepsdieren

  koppelDieren(`
    Leeuw;
    Wolf;
    Afrikaanse wilde hond;
    Aziatische wilde hond;
    Gevlekte hyena;
    Stokstaartje;
    Zebramangoest;
    Chimpansee;
    Bonobo;
    Gorilla;
    Berggorilla;
    Baviaan;
    Mantelbaviaan;
    Mandril;
    Gelada;
    Resusaap;
    Japanse makaak;
    Berberaap;
    Ringstaartmaki;
    Doodshoofdaapje;
    Kapucijnaap;
    Brulaap;
    Slingeraap;
    Olifant;
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Zebra;
    Steppezebra;
    Giraf;
    Gnoe;
    Blauwe gnoe;
    Zwarte gnoe;
    Impala;
    Springbok;
    Rendier;
    Edelhert;
    Damhert;
    Amerikaanse bizon;
    Europese bizon;
    Afrikaanse buffel;
    Muskusos;
    Schaap;
    Geit;
    Koe;
    Paard;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Vicuña;
    Guanaco;
    Wild zwijn;
    Halsbandpekari;
    Witlippekari;
    Capibara;
    Cavia;
    Degoe;
    Prairiehond;
    Naakte molrat;
    Damaralandmolrat;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe
  `, [40]);

  // Vraag 48: strepen

  koppelDieren(`
    Tijger;
    Bengaalse tijger;
    Siberische tijger;
    Sumatraanse tijger;
    Zebra;
    Steppezebra;
    Bergzebra;
    Grévyzebra;
    Okapi;
    Gestreepte hyena;
    Gestreept stinkdier;
    Zebramangoest;
    Zebraduiker;
    Bongo;
    Grote koedoe;
    Kleine koedoe;
    Ringstaartmaki;
    Numbat;
    Sumatraans gestreept konijn;
    Annamitisch gestreept konijn;
    Dertienstrepige grondeekhoorn;
    Chipmunk;
    Oostelijke wangzakeekhoorn;
    Afrikaanse gestreepte grasmuis;
    Laaglandstreeptenrek;
    Hooglandstreeptenrek;
    Gestreepte haaswallaby
  `, [48]);

  // Vraag 49: stippen en vlekken

  koppelDieren(`
    Jachtluipaard;
    Luipaard;
    Jaguar;
    Sneeuwluipaard;
    Serval;
    Ocelot;
    Margay;
    Marmerkat;
    Gevlekte hyena;
    Giraf;
    Netgiraf;
    Masaigiraf;
    Damhert;
    Axishert;
    Sikahert;
    Gevlekte buidelmarter;
    Gevlekte koeskoes;
    Gevlekte genetkat;
    Dalmatiër;
    Appaloosa;
    Knabstrupper;
    Egyptische mau;
    Ocicat;
    Bengaal
  `, [49]);

  // ============================================================
  // BEKENDE ALGEMENE ANTWOORDEN DIE NOG ONTBRAKEN
  // ============================================================

  dier("Kip", [
    4 === 2 ? 4 : 7,
    13, 18, 22, 46, 50
  ], ["Hoen"]);

  dier("Haan", [
    7, 13, 18, 22, 50
  ]);

  dier("Kalkoen", [
    7, 13, 18, 22, 46, 50
  ]);

  dier("Lieveheersbeestje", [
    2, 7, 10, 15, 26, 47, 49, 50
  ], ["Lieveheersbeest"]);

  dier("Sprinkhaan", [
    7, 16, 34, 50
  ]);

  dier("Krekel", [
    7, 27, 34, 50
  ]);

  dier("Paling", [
    1, 14, 17, 18, 37, 38, 50
  ]);

  dier("Kikker", [
    1, 4, 7, 14, 15, 17, 34, 50
  ]);

  dier("Pad", [
    4, 7, 15, 17, 27, 34, 50
  ]);

  dier("Salamander", [
    4, 7, 18, 50
  ]);

  dier("Schildpad", [
    4, 7, 18, 33, 50
  ]);

  dier("Slang", [
    18, 21, 17, 50
  ]);

  dier("Hagedis", [
    4, 18, 21, 50
  ]);

  dier("Leguaan", [
    4, 18, 21, 50
  ]);

  dier("Varaan", [
    4, 18, 21, 50
  ]);

  dier("Gekko", [
    4, 18, 21, 35, 50
  ]);

  dier("Kameleon", [
    4, 15, 18, 21, 35, 42, 50
  ]);

  dier("Spin", [
    7, 15, 17, 50
  ]);

  dier("Schorpioen", [
    15, 17, 27, 50
  ]);

  dier("Mier", [
    7, 40, 41, 50
  ]);

  dier("Regenworm", [
    7, 26, 32, 50
  ]);

  dier("Slak", [
    7, 30, 50
  ]);

  dier("Naaktslak", [
    7, 26, 30, 50
  ]);

  dier("Huisjesslak", [
    7, 26, 30, 50
  ]);

  // ============================================================
  // EXTRA NAAMCORRECTIES
  // ============================================================

  hernoemDier("Moor makaak", "Moormakaak");
  hernoemDier("Zonne staartmeerkat", "Zonnestaartmeerkat");
  hernoemDier("Geel koppenseelaapje", "Geelkoppenseelaapje");
  hernoemDier("Kroon sifaka", "Kroonsifaka");
  hernoemDier("Jakoet rund", "Jakoetrund");
  hernoemDier("Thomson gazelle", "Thomsongazelle");
  hernoemDier("Afrikaanse dwerg eekhoorn", "Afrikaanse dwergeekhoorn");
  hernoemDier("On gestreepte grondeekhoorn", "Ongestreepte grondeekhoorn");
  hernoemDier("Prairie woelmuis", "Prairiewoelmuis");
  hernoemDier("Grote oorfluithaas", "Grootoorfluithaas");
  hernoemDier("Geelvoet rotswallaby", "Geelvoetrotswallaby");
  hernoemDier("Bril haaswallaby", "Brilhaaswallaby");
  hernoemDier("Bruinkeel luiaard", "Bruinkeelluiaard");

  // Geen eieren bij de haan.
  verwijderKoppeling("Haan", [7]);

  // Een wilde kalkoen is geen regulier boerderijdier.
  verwijderKoppeling("Wilde kalkoen", [13]);

  // Afrikaanse wilde dieren zijn geen reguliere huisdieren.
  verwijderKoppeling("Afrikaanse wilde hond", [8]);
  verwijderKoppeling("Woestijnvos", [8]);

  // ============================================================
  // TUSSENTIJDSE CONTROLE DEEL 5
  // ============================================================

  const samengevoegdDeel5 =
    controleerDubbeleDieren();

  console.log(
    "QuizBallon V9 - deel 5 - samengevoegde dieren:",
    samengevoegdDeel5
  );

  console.log(
    "QuizBallon V9 - totaal aantal dierrecords:",
    database.size
  );

  console.table(
    vragen.map((tekst, index) => {
      const aantal = aantalAntwoorden(index + 1);

      return {
        nummer: index + 1,
        vraag: tekst,
        antwoorden: aantal,
        raketten: aantalRaketten(aantal),
        streefaantal: 1000,
        ontbrekend: Math.max(0, 1000 - aantal),
        doelBereikt: aantal >= 1000
      };
    })
  );

  // ============================================================
  // EINDE DEEL 5
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 6
  // REPTIELEN EN AMFIBIEËN
  // ============================================================

  function reptielen(tekst, extra = []) {
    groep(tekst, [21, 50, ...extra]);
  }

  function slangen(tekst, extra = []) {
    reptielen(tekst, [17, 18, ...extra]);
  }

  function hagedissen(tekst, extra = []) {
    reptielen(tekst, [4, 18, ...extra]);
  }

  function amfibieen(tekst, extra = []) {
    groep(tekst, [50, ...extra]);
  }

  // ============================================================
  // PYTHONS
  // ============================================================

  slangen(`
    Python;
    Koningspython=Balpython=Python regius;
    Tijgerpython=Python molurus;
    Birmese python=Python bivittatus;
    Netpython=Malayopython reticulatus;
    Timorpython=Malayopython timoriensis;
    Afrikaanse rotspython=Python sebae;
    Zuid-Afrikaanse rotspython=Python natalensis;
    Bloedpython=Python brongersmai;
    Kortstaartpython=Python curtus;
    Borneopython=Python breitensteini;
    Angolapython=Python anchietae;
    Woma-python=Aspidites ramsayi;
    Zwartkoppython=Aspidites melanocephalus;
    Groene boompython=Morelia viridis;
    Noordelijke groene boompython=Morelia azurea;
    Tapijtpython=Morelia spilota;
    Diamantpython;
    Bredls python=Morelia bredli;
    Ruwe schubpython=Morelia carinata;
    Amethistpython=Simalia amethistina;
    Australische amethistpython=Simalia kinghorni;
    Boelenpython=Simalia boeleni;
    Tanimbarpython=Simalia nauta;
    Oenpellipython=Nyctophilopython oenpelliensis;
    Waterpython=Liasis fuscus;
    Olijfpython=Liasis olivaceus;
    Savupython=Liasis mackloti savuensis;
    Macklotspython=Liasis mackloti;
    Gevlekte python=Antaresia maculosa;
    Kinderpython=Antaresia childreni;
    Stimsons python=Antaresia stimsoni;
    Dwergpython=Antaresia perthensis;
    Witlip python=Leiopython albertisii
  `, [7]);

  hernoemDier("Witlip python", "Witlippython");

  koppelDieren(`
    Koningspython;
    Tijgerpython;
    Birmese python;
    Netpython;
    Afrikaanse rotspython;
    Groene boompython;
    Tapijtpython
  `, [3]);

  koppelDieren(`
    Koningspython;
    Bloedpython;
    Tapijtpython;
    Kinderpython;
    Gevlekte python
  `, [8]);

  koppelDieren(`
    Koningspython;
    Afrikaanse rotspython;
    Zuid-Afrikaanse rotspython;
    Angolapython
  `, [5]);

  koppelDieren(`
    Woma-python;
    Zwartkoppython;
    Tapijtpython;
    Diamantpython;
    Bredls python;
    Ruwe schubpython;
    Australische amethistpython;
    Oenpellipython;
    Waterpython;
    Olijfpython;
    Gevlekte python;
    Kinderpython;
    Dwergpython
  `, [23]);

  koppelDieren(`
    Groene boompython;
    Noordelijke groene boompython;
    Tapijtpython;
    Diamantpython
  `, [31, 35]);

  koppelDieren(`
    Tijgerpython;
    Birmese python;
    Netpython;
    Afrikaanse rotspython;
    Zuid-Afrikaanse rotspython
  `, [9]);

  // ============================================================
  // BOA'S EN ANACONDA'S
  // ============================================================

  slangen(`
    Boa;
    Boa constrictor;
    Keizersboa=Boa imperator;
    Argentijnse boa=Boa occidentalis;
    Anaconda;
    Groene anaconda=Eunectes murinus;
    Gele anaconda=Eunectes notaeus;
    Donkergevlekte anaconda=Eunectes deschauenseei;
    Boliviaanse anaconda=Eunectes beniensis;
    Smaragdboa=Corallus caninus;
    Amazoneboomboa=Corallus hortulana;
    Regenboogboa=Epicrates cenchria;
    Colombiaanse regenboogboa=Epicrates maurus;
    Cubaanse boa=Chilabothrus angulifer;
    Jamaicaanse boa=Chilabothrus subflavus;
    Puerto-Ricoboa=Chilabothrus inornatus;
    Haïtiaanse boa=Chilabothrus striatus;
    Rosy boa=Lichanura trivirgata;
    Rubberboa=Charina bottae;
    Zuidelijke rubberboa=Charina umbratica;
    Keniaanse zandboa=Eryx colubrinus;
    Indische zandboa=Eryx johnii;
    Tartaarse zandboa=Eryx tataricus;
    Gewone zandboa=Eryx jaculus;
    Rode zandboa;
    Madagaskarboomboa=Sanzinia madagascariensis;
    Madagaskargrondboa=Acrantophis madagascariensis;
    Dumerils boa=Acrantophis dumerili;
    Viperboa=Candoia aspera;
    Pacifische boomboa=Candoia bibroni
  `);

  samenvoegen("Indische zandboa", "Rode zandboa");

  koppelDieren(`
    Groene anaconda;
    Gele anaconda;
    Donkergevlekte anaconda;
    Boliviaanse anaconda
  `, [1, 14]);

  koppelDieren(`
    Groene anaconda;
    Gele anaconda;
    Boa constrictor;
    Keizersboa
  `, [9]);

  koppelDieren(`
    Smaragdboa;
    Amazoneboomboa;
    Madagaskarboomboa;
    Pacifische boomboa
  `, [31, 35]);

  koppelDieren(`
    Boa constrictor;
    Groene anaconda;
    Smaragdboa;
    Amazoneboomboa;
    Regenboogboa
  `, [12]);

  koppelDieren(`
    Boa constrictor;
    Keizersboa;
    Regenboogboa;
    Keniaanse zandboa
  `, [8]);

  koppelDieren(`
    Keniaanse zandboa;
    Indische zandboa;
    Tartaarse zandboa;
    Gewone zandboa
  `, [25]);

  // ============================================================
  // COBRA'S
  // ============================================================

  slangen(`
    Cobra;
    Koningscobra=Ophiophagus hannah;
    Brilslang=Indische cobra=Naja naja;
    Monoclecobra=Naja kaouthia;
    Egyptische cobra=Naja haje;
    Kaapse cobra=Naja nivea;
    Zwartnekcobra=Naja nigricollis;
    Zwarte cobra=Naja melanoleuca;
    Mozambikaanse spugende cobra=Naja mossambica;
    Rode spugende cobra=Naja pallida;
    Zebrabrilslang=Naja nigricincta;
    Chinese cobra=Naja atra;
    Filippijnse cobra=Naja philippinensis;
    Samarcobra=Naja samarensis;
    Javaanse spugende cobra=Naja sputatrix;
    Equatoriale spugende cobra=Naja sumatrana;
    Indochinese spugende cobra=Naja siamensis;
    Arabische cobra=Naja arabica;
    Kaspische cobra=Naja oxiana;
    Nubische cobra=Naja nubiae;
    Senegalese cobra=Naja senegalensis;
    Watercobra;
    Gebande watercobra=Naja annulata;
    Rinkhals=Hemachatus haemachatus
  `, [45]);

  koppelDieren(`
    Koningscobra;
    Brilslang;
    Monoclecobra;
    Egyptische cobra;
    Kaapse cobra;
    Zwartnekcobra;
    Chinese cobra;
    Filippijnse cobra;
    Javaanse spugende cobra
  `, [7]);

  koppelDieren(`
    Egyptische cobra;
    Kaapse cobra;
    Zwartnekcobra;
    Zwarte cobra;
    Mozambikaanse spugende cobra;
    Rode spugende cobra;
    Zebrabrilslang;
    Nubische cobra;
    Senegalese cobra;
    Gebande watercobra;
    Rinkhals
  `, [5]);

  koppelDieren(`
    Koningscobra;
    Zwarte cobra;
    Monoclecobra;
    Javaanse spugende cobra
  `, [6, 12]);

  koppelDieren("Koningscobra", [9]);
  koppelDieren("Gebande watercobra", [1, 14]);

  // ============================================================
  // MAMBA'S EN KRAITS
  // ============================================================

  slangen(`
    Mamba;
    Zwarte mamba=Dendroaspis polylepis;
    Oostelijke groene mamba=Dendroaspis angusticeps;
    Westelijke groene mamba=Dendroaspis viridis;
    Jamesons mamba=Dendroaspis jamesoni
  `, [5, 7, 45]);

  koppelDieren(`
    Oostelijke groene mamba;
    Westelijke groene mamba;
    Jamesons mamba
  `, [31, 35]);

  koppelDieren("Zwarte mamba", [29]);

  slangen(`
    Krait;
    Gewone krait=Bungarus caeruleus;
    Gebande krait=Bungarus fasciatus;
    Veelbandkrait=Bungarus multicinctus;
    Maleise krait=Bungarus candidus;
    Rodekopkrait=Bungarus flaviceps;
    Zwarte krait=Bungarus niger;
    Andamanenkrait=Bungarus andamanensis
  `, [7, 45]);

  koppelDieren(`
    Gewone krait;
    Gebande krait;
    Veelbandkrait;
    Maleise krait
  `, [27]);

  koppelDieren(`
    Gebande krait;
    Veelbandkrait
  `, [48]);

  // ============================================================
  // AUSTRALISCHE GIFSLANGEN
  // ============================================================

  slangen(`
    Taipan;
    Inlandtaipan=Oxyuranus microlepidotus;
    Kusttaipan=Oxyuranus scutellatus;
    Centrale taipan=Oxyuranus temporalis;
    Oostelijke bruine slang=Pseudonaja textilis;
    Westelijke bruine slang=Pseudonaja mengdeni;
    Dugiet=Pseudonaja affinis;
    Gwardar;
    Mulgaslang=Pseudechis australis;
    Roodbuikzwarte slang=Pseudechis porphyriacus;
    Blauwbuikzwarte slang=Pseudechis guttatus;
    Tijgerslang=Notechis scutatus;
    Gewone doodsadder=Acanthophis antarcticus;
    Woestijndoodsadder=Acanthophis pyrrhus;
    Noordelijke doodsadder=Acanthophis praelongus;
    Hooglandkoperkop=Austrelaps ramsayi;
    Laaglandkoperkop=Austrelaps superbus;
    Dwergkoperkop=Austrelaps labialis;
    Kleineogige slang=Cryptophis nigrescens;
    Roodnekkeelbandgifslang=Furina diadema
  `, [23, 45]);

  koppelDieren(`
    Inlandtaipan;
    Centrale taipan;
    Mulgaslang;
    Woestijndoodsadder
  `, [25]);

  koppelDieren(`
    Tijgerslang;
    Roodbuikzwarte slang
  `, [14]);

  koppelDieren("Tijgerslang", [48]);

  // ============================================================
  // ADDERS
  // ============================================================

  slangen(`
    Adder;
    Gewone adder=Vipera berus;
    Aspisadder=Vipera aspis;
    Zandadder=Vipera ammodytes;
    Weideadder=Vipera ursinii;
    Latastes adder=Vipera latastei;
    Iberische adder=Vipera seoanei;
    Kaukasische adder=Vipera kaznakovi;
    Dinniks adder=Vipera dinniki;
    Armeense adder=Montivipera raddei;
    Ottomaanse adder=Montivipera xanthina;
    Klein-Aziatische adder;
    Levantadder=Macrovipera lebetinus;
    Milosadder=Macrovipera schweizeri;
    Perzische gehoornde adder=Pseudocerastes persicus;
    Valse hoornadder;
    Spinnenstaartadder=Pseudocerastes urarachnoides;
    Hoornadder=Cerastes cerastes;
    Sahara-zandadder=Cerastes vipera;
    Arabische hoornadder=Cerastes gasperettii;
    Pofadder=Bitis arietans;
    Gabonadder=Bitis gabonica;
    West-Afrikaanse gabonadder=Bitis rhinoceros;
    Neushoornadder=Bitis nasicornis;
    Bergadder=Bitis atropos;
    Dwergpofadder=Bitis peringueyi;
    Veelgehoornde adder=Bitis cornuta;
    Gehoornde dwergadder=Bitis caudalis;
    Ethiopische bergadder=Bitis parviocula;
    Tapijtadder;
    Indische zaagschubadder=Echis carinatus;
    West-Afrikaanse zaagschubadder=Echis ocellatus;
    Noord-Afrikaanse zaagschubadder=Echis pyramidum;
    Arabische zaagschubadder=Echis coloratus;
    Russells adder=Daboia russelii;
    Oostelijke russells adder=Daboia siamensis;
    Palestijnse adder=Daboia palaestinae;
    Groene bosadder=Atheris squamigera;
    Harige bosadder=Atheris hispida;
    Gehoornde bosadder=Atheris ceratophora;
    Afrikaanse boomadder;
    Usambara-bosadder=Atheris ceratophora
  `, [45]);

  samenvoegen(
    "Ottomaanse adder",
    "Klein-Aziatische adder"
  );

  samenvoegen(
    "Perzische gehoornde adder",
    "Valse hoornadder"
  );

  samenvoegen(
    "Gehoornde bosadder",
    "Usambara-bosadder"
  );

  koppelDieren("Gewone adder", [26, 28]);

  koppelDieren(`
    Pofadder;
    Gabonadder;
    West-Afrikaanse gabonadder;
    Neushoornadder;
    Bergadder;
    Dwergpofadder;
    Veelgehoornde adder;
    Gehoornde dwergadder;
    Ethiopische bergadder;
    Groene bosadder;
    Harige bosadder;
    Gehoornde bosadder
  `, [5]);

  koppelDieren(`
    Hoornadder;
    Sahara-zandadder;
    Arabische hoornadder;
    Dwergpofadder;
    Gehoornde dwergadder
  `, [25]);

  koppelDieren(`
    Groene bosadder;
    Harige bosadder;
    Gehoornde bosadder
  `, [31, 35]);

  // ============================================================
  // RATELSLANGEN
  // ============================================================

  slangen(`
    Ratelslang;
    Diamantratelslang=Crotalus adamanteus;
    Texaanse ratelslang=Crotalus atrox;
    Bosratelslang=Crotalus horridus;
    Mojaveratelslang=Crotalus scutulatus;
    Sidewinder=Crotalus cerastes;
    Rode diamantratelslang=Crotalus ruber;
    Zwarte ratelslang=Crotalus cerberus;
    Zwartstaartratelslang=Crotalus molossus;
    Tijgerratelslang=Crotalus tigris;
    Gevlekte ratelslang=Crotalus mitchellii;
    Rotsratelslang=Crotalus lepidus;
    Prairieratelslang=Crotalus viridis;
    Pacifische ratelslang=Crotalus oreganus;
    Zuid-Pacifische ratelslang=Crotalus helleri;
    Zuid-Amerikaanse ratelslang=Crotalus durissus;
    Mexicaanse lanspuntratelslang=Crotalus polystictus;
    Santa-Catalinaratelslang=Crotalus catalinensis;
    Dwerg ratelslang=Sistrurus miliarius;
    Massasauga=Sistrurus catenatus;
    Woestijnmassasauga=Sistrurus tergeminus
  `, [45]);

  hernoemDier("Dwerg ratelslang", "Dwergratelslang");

  koppelDieren(`
    Sidewinder;
    Mojaveratelslang;
    Tijgerratelslang;
    Texaanse ratelslang;
    Gevlekte ratelslang
  `, [25]);

  koppelDieren(`
    Diamantratelslang;
    Texaanse ratelslang;
    Bosratelslang;
    Tijgerratelslang
  `, [48]);

  // ============================================================
  // GROEFKOPADDERS
  // ============================================================

  slangen(`
    Groefkopadder;
    Koperkop=Agkistrodon contortrix;
    Breedbandkoperkop=Agkistrodon laticinctus;
    Watermoccasinslang=Agkistrodon piscivorus;
    Florida-watermoccasinslang=Agkistrodon conanti;
    Mexicaanse moccasinslang=Agkistrodon bilineatus;
    Lanspuntslang;
    Gewone lanspuntslang=Bothrops asper;
    Jararaca=Bothrops jararaca;
    Jararacussu=Bothrops jararacussu;
    Gouden lanspuntslang=Bothrops insularis;
    Braziliaanse lanspuntslang=Bothrops moojeni;
    Kruisadder=Bothrops alternatus;
    Regenwoudlanspuntslang=Bothrops atrox;
    Bosmeester=Lachesis muta;
    Zwartkopbosmeester=Lachesis melanocephala;
    Midden-Amerikaanse bosmeester=Lachesis stenophrys;
    Wimperadder=Bothriechis schlegelii;
    Groene palmadder=Bothriechis lateralis;
    Geelgevlekte palmadder=Bothriechis aurifer;
    Tempeladder=Tropidolaemus wagleri;
    Borneotempeladder=Tropidolaemus subannulatus;
    Witlipbamboeadder=Trimeresurus albolabris;
    Groene bamboeadder=Trimeresurus stejnegeri;
    Blauwe bamboeadder=Trimeresurus insularis;
    Rode bamboeadder=Trimeresurus;
    Habu=Protobothrops flavoviridis;
    Taiwanhabu=Protobothrops mucrosquamatus;
    Japanse mamushi=Gloydius blomhoffii;
    Siberische groefkopadder=Gloydius halys;
    Himalayagroefkopadder=Gloydius himalayanus
  `, [45]);

  verwijderDier("Rode bamboeadder");

  koppelDieren(`
    Wimperadder;
    Groene palmadder;
    Geelgevlekte palmadder;
    Tempeladder;
    Borneotempeladder;
    Witlipbamboeadder;
    Groene bamboeadder;
    Blauwe bamboeadder
  `, [31, 35]);

  koppelDieren(`
    Watermoccasinslang;
    Florida-watermoccasinslang
  `, [1, 14]);

  // ============================================================
  // KORAALSLANGEN
  // ============================================================

  slangen(`
    Koraalslang;
    Oostelijke koraalslang=Micrurus fulvius;
    Texaanse koraalslang=Micrurus tener;
    Arizonakoraalslang=Micruroides euryxanthus;
    Braziliaanse koraalslang=Micrurus corallinus;
    Zuid-Amerikaanse koraalslang=Micrurus frontalis;
    Reuzenkoraalslang=Micrurus surinamensis;
    Veelbandkoraalslang=Micrurus multifasciatus;
    Blauwe Maleise koraalslang=Calliophis bivirgatus;
    Gebande Maleise koraalslang=Calliophis intestinalis;
    Indische koraalslang=Calliophis melanurus
  `, [7, 45]);

  koppelDieren(`
    Oostelijke koraalslang;
    Texaanse koraalslang;
    Arizonakoraalslang;
    Braziliaanse koraalslang;
    Zuid-Amerikaanse koraalslang
  `, [47, 48]);

  // ============================================================
  // RINGSLANGEN EN WATERSLANGEN
  // ============================================================

  slangen(`
    Ringslang=Natrix natrix;
    Gevlekte ringslang=Natrix tessellata;
    Adderringslang=Natrix maura;
    Westelijke ringslang=Natrix helvetica;
    Iberische ringslang=Natrix astreptophora;
    Gewone kousenbandslang=Thamnophis sirtalis;
    Roodzijdige kousenbandslang;
    Westelijke kousenbandslang=Thamnophis elegans;
    Geruite kousenbandslang=Thamnophis marcianus;
    Oostelijke lintslang=Thamnophis saurita;
    Westelijke lintslang=Thamnophis proximus;
    Noordelijke waterslang=Nerodia sipedon;
    Gebande waterslang=Nerodia fasciata;
    Diamantwaterslang=Nerodia rhombifer;
    Groene waterslang=Nerodia cyclopion;
    Bruine waterslang=Nerodia taxispilota;
    Roodbuikwaterslang=Nerodia erythrogaster;
    Olijfwaterslang=Liodytes alleni;
    Tentakelslang=Erpeton tentaculatum;
    Slurfslang=Acrochordus javanicus;
    Kleine wrattenslang=Acrochordus granulatus;
    Australische wrattenslang=Acrochordus arafurae;
    Chinese waterslang=Myrrophis chinensis;
    Mangrovewaterslang=Cerberus rynchops
  `, [14]);

  koppelDieren(`
    Ringslang;
    Westelijke ringslang
  `, [26]);

  koppelDieren(`
    Ringslang;
    Gevlekte ringslang;
    Adderringslang;
    Westelijke ringslang;
    Iberische ringslang
  `, [7]);

  koppelDieren(`
    Gevlekte ringslang;
    Noordelijke waterslang;
    Gebande waterslang;
    Diamantwaterslang;
    Groene waterslang;
    Bruine waterslang;
    Tentakelslang;
    Slurfslang;
    Australische wrattenslang;
    Mangrovewaterslang
  `, [1]);

  koppelDieren("Kleine wrattenslang", [1, 11]);

  // ============================================================
  // RATTENSLANGEN EN KONINGSSLANGEN
  // ============================================================

  slangen(`
    Rattenslang;
    Korenslang=Pantherophis guttatus;
    Zwarte rattenslang=Pantherophis obsoletus;
    Oostelijke rattenslang=Pantherophis alleghaniensis;
    Grijze rattenslang=Pantherophis spiloides;
    Bairds rattenslang=Pantherophis bairdi;
    Japanse rattenslang=Elaphe climacophora;
    Vierstreepslang=Elaphe quatuorlineata;
    Russische rattenslang=Elaphe schrenckii;
    Dioneslang=Elaphe dione;
    Luipaardslang=Zamenis situla;
    Esculaapslang=Zamenis longissimus;
    Italiaanse esculaapslang=Zamenis lineatus;
    Gestreepte rattenslang=Coelognathus radiatus;
    Indonesische rattenslang=Coelognathus subradiatus;
    Rode rattenslang=Oreocryptophis porphyraceus;
    Taiwanese schoonheidsslang=Orthriophis taeniurus;
    Mandarijnrattenslang=Euprepiophis mandarinus;
    Japanse bosrattenslang=Euprepiophis conspicillatus;
    Groene rattenslang=Gonyosoma oxycephalum;
    Neushoornrattenslang=Gonyosoma boulengeri;
    Koningsslang;
    Californische koningsslang=Lampropeltis californiae;
    Oostelijke koningsslang=Lampropeltis getula;
    Zwarte koningsslang=Lampropeltis nigra;
    Mexicaanse zwarte koningsslang;
    Woestijnkoningsslang=Lampropeltis splendida;
    Gespikkelde koningsslang=Lampropeltis holbrooki;
    Bergkoningsslang=Lampropeltis zonata;
    Grijze koningsslang=Lampropeltis alterna;
    Melkslang=Lampropeltis triangulum;
    Hondurese melkslang=Lampropeltis abnorma;
    Pueblamelkslang=Lampropeltis polyzona;
    Stierenslang=Pituophis catenifer sayi;
    Gopherslang=Pituophis catenifer;
    Dennenslang=Pituophis melanoleucus;
    Mexicaanse dennenslang=Pituophis deppei
  `, [7]);

  koppelDieren(`
    Korenslang;
    Californische koningsslang;
    Mexicaanse zwarte koningsslang;
    Melkslang;
    Hondurese melkslang;
    Pueblamelkslang;
    Mandarijnrattenslang
  `, [8]);

  koppelDieren(`
    Melkslang;
    Hondurese melkslang;
    Pueblamelkslang;
    Bergkoningsslang;
    Californische koningsslang;
    Vierstreepslang;
    Mandarijnrattenslang
  `, [48]);

  // ============================================================
  // OVERIGE SLANGEN
  // ============================================================

  slangen(`
    Gladde slang=Coronella austriaca;
    Girondische gladde slang=Coronella girondica;
    Geelgroene toornslang=Hierophis viridiflavus;
    Balkantoornslang=Hierophis gemonensis;
    Kaspische toornslang=Dolichophis caspius;
    Grote toornslang=Dolichophis jugularis;
    Hoefijzerslang=Hemorrhois hippocrepis;
    Gevlekte toornslang=Hemorrhois ravergieri;
    Oostelijke hagedisslang=Malpolon insignitus;
    Westelijke hagedisslang=Malpolon monspessulanus;
    Katslang=Telescopus fallax;
    Egyptische katslang=Telescopus dhara;
    Mangroveslang=Boiga dendrophila;
    Bruine boomslang=Boiga irregularis;
    Groene katslang=Boiga cyanea;
    Indische katslang=Boiga trigonata;
    Boomslang=Dispholidus typus;
    Twig snake=Thelotornis capensis;
    Groene wijnslang=Ahaetulla prasina;
    Indische wijnslang=Ahaetulla nasuta;
    Langsnuitwijnslang=Ahaetulla oxyrhyncha;
    Bruine wijnslang=Oxybelis aeneus;
    Groene liaanslang=Oxybelis fulgidus;
    Vliegende slang;
    Paradijsslang=Chrysopelea paradisi;
    Gouden boomslang=Chrysopelea ornata;
    Gebande vliegende slang=Chrysopelea pelias;
    Oostelijke haakneusslang=Heterodon platirhinos;
    Westelijke haakneusslang=Heterodon nasicus;
    Zuidelijke haakneusslang=Heterodon simus;
    Madagaskarhaakneusslang=Leioheterodon madagascariensis;
    Zonnestraalslang=Xenopeltis unicolor;
    Regenboogslang=Farancia erytrogramma;
    Modderslang=Farancia abacura;
    Wormslang=Carphophis amoenus;
    Westelijke wormslang=Carphophis vermis;
    Brahmaanse blindslang=Indotyphlops braminus;
    Europese blindslang=Xerotyphlops vermicularis;
    Draadslang;
    Barbadosdraadslang=Tetracheilostoma carlae;
    Afrikaanse eierslang=Dasypeltis scabra;
    Rhombische eierslang;
    Groene eierslang=Dasypeltis atra;
    Ruwe groene slang=Opheodrys aestivus;
    Gladde groene slang=Opheodrys vernalis;
    Amerikaanse zwarte racer=Coluber constrictor;
    Coachwhip=Masticophis flagellum;
    Gestreepte zweepslang=Masticophis taeniatus
  `);

  samenvoegen("Afrikaanse eierslang", "Rhombische eierslang");

  koppelDieren("Gladde slang", [26]);

  koppelDieren(`
    Boomslang;
    Twig snake
  `, [5, 45]);

  koppelDieren(`
    Mangroveslang;
    Bruine boomslang;
    Groene katslang;
    Boomslang;
    Groene wijnslang;
    Indische wijnslang;
    Groene liaanslang;
    Paradijsslang;
    Gouden boomslang;
    Gebande vliegende slang
  `, [31, 35]);

  koppelDieren(`
    Brahmaanse blindslang;
    Europese blindslang;
    Draadslang;
    Barbadosdraadslang;
    Wormslang;
    Westelijke wormslang
  `, [32]);

  koppelDieren(`
    Barbadosdraadslang;
    Brahmaanse blindslang
  `, [10]);

  koppelDieren(`
    Westelijke haakneusslang;
    Afrikaanse eierslang;
    Ruwe groene slang
  `, [8]);

  // Vliegende slangen maken zweefvluchten.

  verwijderKoppeling("Vliegende slang", [2]);
  verwijderKoppeling("Paradijsslang", [2]);

  // ============================================================
  // KAMELEONS
  // ============================================================

  hagedissen(`
    Kameleon=Chameleon;
    Panterkameleon=Furcifer pardalis;
    Jemenkameleon=Chamaeleo calyptratus;
    Gewone kameleon=Chamaeleo chamaeleon;
    Afrikaanse kameleon=Chamaeleo africanus;
    Senegalese kameleon=Chamaeleo senegalensis;
    Flapnekkameleon=Chamaeleo dilepis;
    Indische kameleon=Chamaeleo zeylanicus;
    Graceful chameleon=Chamaeleo gracilis;
    Jacksonkameleon=Trioceros jacksonii;
    Driehoornkameleon;
    Vierhoornkameleon=Trioceros quadricornis;
    Mellers kameleon=Trioceros melleri;
    Bergkameleon=Trioceros montium;
    Helmkameleon=Trioceros hoehnelii;
    Usambarakameleon=Trioceros deremensis;
    Werners kameleon=Trioceros werneri;
    Johnstons kameleon=Trioceros johnstoni;
    Ruwschubbige kameleon=Trioceros rudis;
    Reuzenkameleon=Furcifer oustaleti;
    Tapijtkameleon=Furcifer lateralis;
    Wrattenkameleon=Furcifer verrucosus;
    Labordskameleon=Furcifer labordi;
    Neushoornkameleon=Furcifer rhinoceratus;
    Antimena-kameleon=Furcifer antimena;
    Campans kameleon=Furcifer campani;
    Parsonskameleon=Calumma parsonii;
    Olifantsoorkameleon=Calumma brevicorne;
    Neusuitsteekselkameleon=Calumma nasutum;
    Blauwpootkameleon=Calumma crypticum;
    Dwergkameleon;
    Kaapse dwergkameleon=Bradypodion pumilum;
    Knysnadwergkameleon=Bradypodion damaranum;
    Nataldwergkameleon=Bradypodion melanocephalum;
    Drakensbergdwergkameleon=Bradypodion dracomontanum;
    Smitss dwergkameleon=Bradypodion taeniabronchum;
    Bladkameleon;
    Brookesia micra;
    Brookesia nana;
    Brookesia minima;
    Brookesia superciliaris;
    Brookesia stumpffi;
    Brookesia thieli;
    Brookesia perarmata;
    Rhampholeon brevicaudatus;
    Rhampholeon spectrum;
    Rhampholeon temporalis;
    Rieppeleon kerstenii
  `, [15, 42]);

  samenvoegen("Jacksonkameleon", "Driehoornkameleon");

  hernoemDier(
    "Smitss dwergkameleon",
    "Smiths dwergkameleon"
  );

  koppelDieren(`
    Panterkameleon;
    Jemenkameleon;
    Gewone kameleon;
    Senegalese kameleon;
    Jacksonkameleon;
    Vierhoornkameleon;
    Mellers kameleon;
    Reuzenkameleon;
    Tapijtkameleon;
    Parsonskameleon;
    Kaapse dwergkameleon
  `, [31, 35]);

  koppelDieren(`
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Tapijtkameleon
  `, [8, 47]);

  koppelDieren(`
    Panterkameleon;
    Jemenkameleon;
    Gewone kameleon;
    Senegalese kameleon;
    Tapijtkameleon;
    Reuzenkameleon;
    Parsonskameleon;
    Brookesia micra;
    Brookesia nana;
    Brookesia minima
  `, [7]);

  koppelDieren(`
    Brookesia micra;
    Brookesia nana;
    Brookesia minima
  `, [10]);

  // ============================================================
  // GEKKO'S
  // ============================================================

  hagedissen(`
    Gekko;
    Luipaardgekko=Eublepharis macularius;
    Afrikaanse dikstaartgekko=Hemitheconyx caudicinctus;
    Chinese grotgekko=Goniurosaurus luii;
    Japanse grotgekko=Goniurosaurus kuroiwae;
    Bawanglinggrotgekko=Goniurosaurus bawanglingensis;
    Wimpergekko=Correlophus ciliatus;
    Gargoyle-gekko=Rhacodactylus auriculatus;
    Nieuw-Caledonische reuzengekko=Rhacodactylus leachianus;
    Mossige grijpstaartgekko=Mniarogekko chahoua;
    Tokkeh=Gekko gecko;
    Japanse gekko=Gekko japonicus;
    Gouden gekko=Gekko badenii;
    Smiths gekko=Gekko smithii;
    Vliegende gekko=Gekko kuhli;
    Aziatische huisgekko=Hemidactylus frenatus;
    Turkse gekko=Hemidactylus turcicus;
    Afrikaanse huisgekko=Hemidactylus mabouia;
    Platte huisgekko=Hemidactylus platyurus;
    Gele huisgekko=Hemidactylus flaviviridis;
    Muurgekko=Tarentola mauritanica;
    Canarische gekko=Tarentola delalandii;
    Egyptische gekko=Tarentola annularis;
    Kaapverdische reuzengekko=Tarentola gigas;
    Daggekko;
    Madagaskardaggekko=Phelsuma madagascariensis;
    Grote madagaskardaggekko=Phelsuma grandis;
    Goudstofdaggekko=Phelsuma laticauda;
    Pauwoogdaggekko=Phelsuma quadriocellata;
    Lijndaggekko=Phelsuma lineata;
    Blauwstaartdaggekko=Phelsuma cepediana;
    Mauritiusdaggekko=Phelsuma guimbeaui;
    Rodriguesdaggekko=Phelsuma edwardnewtoni;
    Neon daggekko=Phelsuma klemmeri;
    Standings daggekko=Phelsuma standingi;
    Dwergdaggekko;
    Williams dwerggekko=Lygodactylus williamsi;
    Geelkopdwerggekko=Lygodactylus luteopicturatus;
    Treurdwerggekko=Lepidodactylus lugubris;
    Bladstaartgekko;
    Reuzenbladstaartgekko=Uroplatus fimbriatus;
    Satanische bladstaartgekko=Uroplatus phantasticus;
    Mossige bladstaartgekko=Uroplatus sikorae;
    Henkelbladstaartgekko=Uroplatus henkeli;
    Uroplatus ebenaui;
    Uroplatus lineatus;
    Uroplatus guentheri;
    Knobbelstaartgekko;
    Gladde knobbelstaartgekko=Nephrurus levis;
    Ruwe knobbelstaartgekko=Nephrurus amyae;
    Nephrurus asper;
    Nephrurus wheeleri;
    Nephrurus vertebralis;
    Dikstaartgekko;
    Australische dikstaartgekko=Underwoodisaurus milii;
    Bynoes gekko=Heteronotia binoei;
    Fluweelgekko=Oedura;
    Marmerfluweelgekko=Oedura marmorata;
    Noordelijke fluweelgekko=Oedura castelnaui;
    Gouden staartgekko=Strophurus taenicauda;
    Stekelstaartgekko=Strophurus ciliaris;
    Webvoetgekko=Pachydactylus rangei;
    Bibrongekko=Chondrodactylus bibronii;
    Woestijngekko=Stenodactylus;
    Elegante gekko=Stenodactylus sthenodactylus;
    Vipergekko=Hemidactylus imbricatus;
    Gekko uit Namibië=Rhoptropus afer;
    Nieuw-Zeelandse groene gekko=Naultinus;
    Jewelled gecko=Naultinus gemmeus;
    Aucklandgroene gekko=Naultinus elegans;
    Duvaucelgekko=Hoplodactylus duvaucelii;
    Harlekijngekko=Tukutuku rakiurae;
    Dwerggekko=Sphaerodactylus;
    Sphaerodactylus ariasae;
    Sphaerodactylus parthenopion;
    Sphaerodactylus elegans;
    Gonatodes albogularis;
    Gonatodes vittatus
  `);

  hernoemDier("Neon daggekko", "Neondaggekko");

  // De Rodriguesdaggekko is uitgestorven.

  verwijderDier("Rodriguesdaggekko");

  dier("Rodriguesdaggekko", [43, 50], [
    "Phelsuma edwardnewtoni"
  ]);

  koppelDieren(`
    Luipaardgekko;
    Afrikaanse dikstaartgekko;
    Chinese grotgekko;
    Wimpergekko;
    Gargoyle-gekko;
    Nieuw-Caledonische reuzengekko;
    Tokkeh;
    Grote madagaskardaggekko;
    Goudstofdaggekko;
    Williams dwerggekko;
    Australische dikstaartgekko
  `, [8]);

  koppelDieren(`
    Wimpergekko;
    Gargoyle-gekko;
    Nieuw-Caledonische reuzengekko;
    Tokkeh;
    Aziatische huisgekko;
    Turkse gekko;
    Afrikaanse huisgekko;
    Muurgekko;
    Daggekko;
    Madagaskardaggekko;
    Grote madagaskardaggekko;
    Goudstofdaggekko;
    Bladstaartgekko;
    Satanische bladstaartgekko
  `, [35]);

  koppelDieren(`
    Luipaardgekko;
    Afrikaanse dikstaartgekko;
    Chinese grotgekko;
    Wimpergekko;
    Tokkeh;
    Aziatische huisgekko;
    Muurgekko;
    Bladstaartgekko;
    Satanische bladstaartgekko;
    Ruwe knobbelstaartgekko
  `, [27]);

  koppelDieren(`
    Luipaardgekko;
    Afrikaanse dikstaartgekko;
    Wimpergekko;
    Gargoyle-gekko;
    Tokkeh;
    Aziatische huisgekko;
    Muurgekko;
    Grote madagaskardaggekko;
    Goudstofdaggekko;
    Williams dwerggekko;
    Satanische bladstaartgekko
  `, [7, 15]);

  koppelDieren(`
    Luipaardgekko;
    Tokkeh;
    Gargoyle-gekko;
    Goudstofdaggekko;
    Pauwoogdaggekko
  `, [49]);

  koppelDieren(`
    Sphaerodactylus ariasae;
    Sphaerodactylus parthenopion
  `, [10]);

  // ============================================================
  // VARANEN
  // ============================================================

  hagedissen(`
    Varaan=Monitor lizard;
    Komodovaraan=Komododraak=Varanus komodoensis;
    Nijlvaraan=Varanus niloticus;
    Savannevaraan=Varanus exanthematicus;
    Steppevaraan;
    Witkeelvaraan=Varanus albigularis;
    Woestijnvaraan=Varanus griseus;
    Aziatische watervaraan=Varanus salvator;
    Bengaalse varaan=Varanus bengalensis;
    Gele varaan=Varanus flavescens;
    Ruwe nekvaraan=Varanus rudicollis;
    Dumerils varaan=Varanus dumerilii;
    Zwarte watervaraan;
    Krokodilvaraan=Varanus salvadorii;
    Mangrovevaraan=Varanus indicus;
    Blauwe boomvaraan=Varanus macraei;
    Groene boomvaraan=Varanus prasinus;
    Zwarte boomvaraan=Varanus beccarii;
    Gele boomvaraan=Varanus reisingeri;
    Smaragdvaraan;
    Perentie=Varanus giganteus;
    Australische reuzenvaraan;
    Zandvaraan=Varanus gouldii;
    Argusvaraan=Varanus panoptes;
    Bonte varaan=Varanus varius;
    Mertens watervaraan=Varanus mertensi;
    Mitchells watervaraan=Varanus mitchelli;
    Spencers varaan=Varanus spenceri;
    Roestvaraan=Varanus semiremex;
    Stekelstaartvaraan=Varanus acanthurus;
    Dwergvaraan=Varanus brevicauda;
    Kortstaartvaraan;
    Pilbaravaraan=Varanus pilbarensis;
    Kimberley-rotsvaraan=Varanus glauerti;
    Timorvaraan=Varanus timorensis;
    Gevlekte boomvaraan=Varanus scalaris;
    Pauwoogvaraan=Varanus auffenbergi;
    Varanus caudolineatus;
    Varanus gilleni;
    Varanus kingorum;
    Varanus storri;
    Varanus tristis;
    Varanus eremius;
    Varanus primordius;
    Varanus baritji;
    Varanus olivaceus;
    Varanus bitatawa
  `, [7]);

  samenvoegen("Savannevaraan", "Steppevaraan");
  samenvoegen("Groene boomvaraan", "Smaragdvaraan");
  samenvoegen("Perentie", "Australische reuzenvaraan");
  samenvoegen("Dwergvaraan", "Kortstaartvaraan");

  koppelDieren(`
    Komodovaraan;
    Nijlvaraan;
    Savannevaraan;
    Witkeelvaraan;
    Aziatische watervaraan;
    Krokodilvaraan;
    Mangrovevaraan;
    Perentie;
    Bonte varaan;
    Argusvaraan
  `, [17]);

  koppelDieren(`
    Komodovaraan;
    Aziatische watervaraan;
    Krokodilvaraan;
    Perentie;
    Nijlvaraan
  `, [9]);

  koppelDieren(`
    Nijlvaraan;
    Savannevaraan;
    Witkeelvaraan;
    Woestijnvaraan
  `, [5]);

  koppelDieren(`
    Nijlvaraan;
    Aziatische watervaraan;
    Mangrovevaraan;
    Mertens watervaraan;
    Mitchells watervaraan
  `, [1, 14]);

  koppelDieren(`
    Blauwe boomvaraan;
    Groene boomvaraan;
    Zwarte boomvaraan;
    Gele boomvaraan;
    Krokodilvaraan;
    Bonte varaan
  `, [31, 35]);

  koppelDieren(`
    Perentie;
    Zandvaraan;
    Argusvaraan;
    Bonte varaan;
    Mertens watervaraan;
    Mitchells watervaraan;
    Spencers varaan;
    Roestvaraan;
    Stekelstaartvaraan;
    Dwergvaraan;
    Pilbaravaraan;
    Kimberley-rotsvaraan
  `, [23]);

  // ============================================================
  // LEGUANEN
  // ============================================================

  hagedissen(`
    Leguaan;
    Groene leguaan=Iguana iguana;
    Antillenleguaan=Iguana delicatissima;
    Blauwe leguaan=Cyclura lewisi;
    Neushoornleguaan=Cyclura cornuta;
    Cubaanse rotsleguaan=Cyclura nubila;
    Jamaicaanse leguaan=Cyclura collei;
    Ricords leguaan=Cyclura ricordi;
    Anegadaleguaan=Cyclura pinguis;
    Bahamaleguaan=Cyclura cychlura;
    Turkse en Caicosleguaan=Cyclura carinata;
    Zwarte stekelstaartleguaan=Ctenosaura similis;
    Mexicaanse stekelstaartleguaan=Ctenosaura pectinata;
    Dwergstekelstaartleguaan=Ctenosaura quinquecarinata;
    Roatánleguaan=Ctenosaura oedirhina;
    Galapagoslandleguaan=Conolophus subcristatus;
    Santa-Fe-landleguaan=Conolophus pallidus;
    Roze landleguaan=Conolophus marthae;
    Woestijnleguaan=Dipsosaurus dorsalis;
    Chuckwalla=Sauromalus ater;
    Reuzenchuckwalla=Sauromalus hispidus;
    Fiji-bandleguaan=Brachylophus fasciatus;
    Fiji-kuifleguaan=Brachylophus vitiensis;
    Lau-bandleguaan=Brachylophus bulabula;
    Madagaskarleguaan=Oplurus cuvieri;
    Halsbandleguaan=Crotaphytus collaris;
    Luipaardhagedis=Gambelia wislizenii
  `, [7]);

  koppelDieren(`
    Groene leguaan;
    Blauwe leguaan;
    Neushoornleguaan;
    Cubaanse rotsleguaan;
    Galapagoslandleguaan;
    Santa-Fe-landleguaan;
    Roze landleguaan;
    Woestijnleguaan;
    Chuckwalla;
    Reuzenchuckwalla
  `, [16]);

  koppelDieren(`
    Groene leguaan;
    Fiji-bandleguaan;
    Fiji-kuifleguaan;
    Lau-bandleguaan
  `, [31, 35]);

  koppelDieren(`
    Woestijnleguaan;
    Chuckwalla;
    Reuzenchuckwalla
  `, [25]);

  koppelDieren(`
    Groene leguaan;
    Blauwe leguaan;
    Neushoornleguaan;
    Cubaanse rotsleguaan
  `, [3]);

  koppelDieren("Groene leguaan", [8, 14]);

  // ============================================================
  // AGAMEN
  // ============================================================

  hagedissen(`
    Agaam;
    Baardagaam=Pogona vitticeps;
    Oostelijke baardagaam=Pogona barbata;
    Dwergbaardagaam=Pogona henrylawsoni;
    Westelijke baardagaam=Pogona minor;
    Noordwestelijke baardagaam=Pogona mitchelli;
    Wateragaam=Physignathus cocincinus;
    Australische wateragaam=Intellagama lesueurii;
    Kraaghagedis=Chlamydosaurus kingii;
    Doorn duivel=Moloch horridus;
    Gewone agama=Agama agama;
    Regenboogagaam;
    Mwanza-agaam=Agama mwanzae;
    Kolonistenagaam;
    Blauwe rotsagaam=Agama atra;
    Egyptische rotsagaam=Laudakia stellio;
    Kaukasische agama=Paralaudakia caucasia;
    Himalaya-agama=Paralaudakia himalayana;
    Indische tuinagaam=Calotes versicolor;
    Groene kuifhagedis=Bronchocela cristatella;
    Groene tuinagaam=Calotes calotes;
    Blauwkopagaam=Calotes mystaceus;
    Neushoornagaam=Ceratophora stoddartii;
    Bladneusagaam=Ceratophora tennentii;
    Lyrehead lizard=Lyriocephalus scutatus;
    Stekelnekagaam=Acanthosaura;
    Bergstekelnekagaam=Acanthosaura capra;
    Ridderspooragaam=Acanthosaura armata;
    Vliegende draak=Draco volans;
    Draco maculatus;
    Draco cornutus;
    Draco dussumieri;
    Draco quinquefasciatus;
    Draco sumatranus;
    Draco melanopogon;
    Zeilhagedis=Hydrosaurus;
    Filipijnse zeilhagedis=Hydrosaurus pustulatus;
    Indonesische zeilhagedis=Hydrosaurus amboinensis;
    Soa-soa=Hydrosaurus weberi;
    Stekelstaartagaam=Uromastyx;
    Egyptische stekelstaartagaam=Uromastyx aegyptia;
    Marokkaanse stekelstaartagaam=Uromastyx nigriventris;
    Geyrs stekelstaartagaam=Uromastyx geyri;
    Bonte stekelstaartagaam=Uromastyx ornata;
    Mali-stekelstaartagaam=Uromastyx dispar;
    Somalische stekelstaartagaam=Uromastyx macfadyeni;
    Indische stekelstaartagaam=Saara hardwickii;
    Paddenkopagaam=Phrynocephalus;
    Gehoornde paddenkopagaam=Phrynocephalus mystaceus;
    Tibetaanse paddenkopagaam=Phrynocephalus theobaldi;
    Zonnelizard=Phrynocephalus helioscopus
  `, [7]);

  hernoemDier("Doorn duivel", "Doornduivel");

  samenvoegen("Gewone agama", "Regenboogagaam");
  samenvoegen("Gewone agama", "Kolonistenagaam");

  koppelDieren(`
    Baardagaam;
    Oostelijke baardagaam;
    Dwergbaardagaam;
    Westelijke baardagaam;
    Noordwestelijke baardagaam;
    Australische wateragaam;
    Kraaghagedis;
    Doornduivel
  `, [23]);

  koppelDieren(`
    Baardagaam;
    Dwergbaardagaam;
    Wateragaam;
    Stekelstaartagaam;
    Bonte stekelstaartagaam
  `, [8]);

  koppelDieren(`
    Doornduivel;
    Egyptische stekelstaartagaam;
    Marokkaanse stekelstaartagaam;
    Geyrs stekelstaartagaam;
    Somalische stekelstaartagaam;
    Gehoornde paddenkopagaam
  `, [25]);

  koppelDieren(`
    Doornduivel;
    Kraaghagedis;
    Indische tuinagaam;
    Gewone agama;
    Mwanza-agaam
  `, [15]);

  koppelDieren(`
    Wateragaam;
    Australische wateragaam;
    Filipijnse zeilhagedis;
    Indonesische zeilhagedis
  `, [14]);

  koppelDieren(`
    Vliegende draak;
    Draco maculatus;
    Draco cornutus;
    Draco dussumieri;
    Draco quinquefasciatus;
    Draco sumatranus;
    Draco melanopogon
  `, [31, 35]);

  verwijderKoppeling("Vliegende draak", [2]);

  // ============================================================
  // SKINKEN
  // ============================================================

  hagedissen(`
    Skink;
    Blauwtongskink;
    Oostelijke blauwtongskink=Tiliqua scincoides;
    Noordelijke blauwtongskink;
    Indonesische blauwtongskink=Tiliqua gigas;
    Gevlekte blauwtongskink=Tiliqua nigrolutea;
    Centrale blauwtongskink=Tiliqua multifasciata;
    Westelijke blauwtongskink=Tiliqua occipitalis;
    Dennenappelskink=Tiliqua rugosa;
    Dwergblauwtongskink=Tiliqua adelaidensis;
    Vuurskink=Lepidothyris fernandi;
    Schneider-skink=Eumeces schneideri;
    Berberskink;
    Zandvis=Scincus scincus;
    Oostelijke zandvis=Scincus mitranus;
    Algerijnse zandvis=Scincus albifasciatus;
    Drieband skink=Chalcides striatus;
    Gewone cilinderskink=Chalcides ocellatus;
    Italiaanse drievingerskink=Chalcides chalcides;
    Afrikaanse vijfstreepskink=Trachylepis quinquetaeniata;
    Regenboogskink=Trachylepis margaritifera;
    Gestreepte regenboogskink=Trachylepis striata;
    Goudskink=Eutropis multifasciata;
    Indische tuinskink=Eutropis carinata;
    Vijfstreepskink=Plestiodon fasciatus;
    Breedkopskink=Plestiodon laticeps;
    Zuidelijke vijfstreepskink=Plestiodon inexpectatus;
    Japanse skink=Plestiodon japonicus;
    Chinese skink=Plestiodon chinensis;
    Groene boomskink=Lamprolepis smaragdina;
    Smaragdboomskink;
    Krokodilskink=Tribolonotus gracilis;
    Wit oogkrokodilskink=Tribolonotus novaeguineae;
    Grijpstaartskink=Corucia zebrata;
    Apenstaartskink;
    Roze tongskink=Cyclodomorphus gerrardii;
    Landmul skink=Bellatorias major;
    Cunningham-skink=Egernia cunninghami;
    Grote woestijnskink=Liopholis kintorei;
    Gidgeeskink=Egernia stokesii;
    Koningsskink=Egernia kingii;
    Australische waterskink=Eulamprus quoyii;
    Sneeuwskink=Niveoscincus;
    Gewone tuinskink=Lampropholis guichenoti
  `);

  hernoemDier("Drieband skink", "Driebandskink");
  hernoemDier("Wit oogkrokodilskink", "Witoogkrokodilskink");
  hernoemDier("Roze tongskink", "Rozetongskink");
  hernoemDier("Landmul skink", "Landmulskink");

  samenvoegen("Schneider-skink", "Berberskink");
  samenvoegen("Groene boomskink", "Smaragdboomskink");
  samenvoegen("Grijpstaartskink", "Apenstaartskink");

  koppelDieren(`
    Blauwtongskink;
    Oostelijke blauwtongskink;
    Noordelijke blauwtongskink;
    Indonesische blauwtongskink;
    Vuurskink;
    Schneider-skink;
    Krokodilskink;
    Grijpstaartskink
  `, [8]);

  koppelDieren(`
    Zandvis;
    Oostelijke zandvis;
    Algerijnse zandvis;
    Grote woestijnskink
  `, [25, 32]);

  koppelDieren(`
    Groene boomskink;
    Grijpstaartskink
  `, [31, 35]);

  koppelDieren(`
    Oostelijke blauwtongskink;
    Noordelijke blauwtongskink;
    Gevlekte blauwtongskink;
    Centrale blauwtongskink;
    Westelijke blauwtongskink;
    Dennenappelskink;
    Dwergblauwtongskink;
    Rozetongskink;
    Landmulskink;
    Cunningham-skink;
    Grote woestijnskink;
    Gidgeeskink;
    Koningsskink;
    Australische waterskink;
    Gewone tuinskink
  `, [23]);

  koppelDieren(`
    Vuurskink;
    Vijfstreepskink;
    Groene boomskink;
    Krokodilskink;
    Witoogkrokodilskink
  `, [7]);

  // ============================================================
  // ECHTE HAGEDISSEN
  // ============================================================

  hagedissen(`
    Hagedis;
    Zandhagedis=Lacerta agilis;
    Levendbarende hagedis=Zootoca vivipara;
    Groene hagedis=Lacerta viridis;
    Westelijke groene hagedis=Lacerta bilineata;
    Reuzenhagedis=Timon lepidus;
    Parelhagedis;
    Noord-Afrikaanse parelhagedis=Timon tangitanus;
    Muurhagedis=Podarcis muralis;
    Italiaanse muurhagedis=Podarcis siculus;
    Spaanse muurhagedis=Podarcis hispanicus;
    Catalaanse muurhagedis=Podarcis liolepis;
    Griekse muurhagedis=Podarcis erhardii;
    Balkanmuurhagedis=Podarcis tauricus;
    Dalmatische muurhagedis=Podarcis melisellensis;
    Corsicaanse muurhagedis=Podarcis tiliguerta;
    Sardijnse muurhagedis=Podarcis sicula;
    Ibiza-hagedis=Podarcis pityusensis;
    Balearenmuurhagedis=Podarcis lilfordi;
    Madeira-hagedis=Teira dugesii;
    Algerijnse zandloper=Psammodromus algirus;
    Spaanse zandloper=Psammodromus hispanicus;
    Rots hagedis=Iberolacerta;
    Iberische rotshagedis=Iberolacerta monticola;
    Pyreneese rotshagedis=Iberolacerta bonnali;
    Armeense rotshagedis=Darevskia armeniaca;
    Georgische rotshagedis=Darevskia rudis;
    Kaukasische rotshagedis=Darevskia caucasica;
    Tenerifehagedis=Gallotia galloti;
    Gran Canaria-reuzenhagedis=Gallotia stehlini;
    El Hierro-reuzenhagedis=Gallotia simonyi;
    La Gomera-reuzenhagedis=Gallotia bravoana;
    Atlantische hagedis=Gallotia atlantica;
    Woestijnrenner=Acanthodactylus;
    Roodstaartfranjeteenhagedis=Acanthodactylus erythrurus;
    Egyptische franjeteenhagedis=Acanthodactylus boskianus;
    Langstaarthagedis=Takydromus sexlineatus;
    Japanse grashagedis=Takydromus tachydromoides;
    Amoergrashagedis=Takydromus amurensis;
    Slanke grashagedis=Takydromus smaragdinus;
    Zesstreepracerunner=Aspidoscelis sexlineatus;
    Tijgerzweepstaarthagedis=Aspidoscelis tigris
  `);

  hernoemDier("Rots hagedis", "Rotshagedis");

  samenvoegen("Reuzenhagedis", "Parelhagedis");

  // Podarcis sicula en Podarcis siculus
  // verwijzen hier naar dezelfde soort.

  samenvoegen(
    "Italiaanse muurhagedis",
    "Sardijnse muurhagedis"
  );

  koppelDieren(`
    Zandhagedis;
    Levendbarende hagedis;
    Muurhagedis
  `, [26]);

  koppelDieren(`
    Zandhagedis;
    Groene hagedis;
    Westelijke groene hagedis;
    Muurhagedis;
    Italiaanse muurhagedis;
    Reuzenhagedis;
    Langstaarthagedis;
    Japanse grashagedis
  `, [7, 15]);

  // ============================================================
  // TEGU'S EN ANDERE TEJUACHTIGEN
  // ============================================================

  hagedissen(`
    Tegu;
    Argentijnse zwart-witte tegu=Salvator merianae;
    Rode tegu=Salvator rufescens;
    Colombiaanse tegu=Tupinambis teguixin;
    Gouden tegu;
    Kaaimanhagedis=Dracaena guianensis;
    Paraguayaanse kaaimanhagedis=Dracaena paraguayensis;
    Ameiva=Ameiva ameiva;
    Reuzenameiva;
    Midden-Amerikaanse ameiva=Holcosus festivus;
    Renhagedis;
    Zesstreephagedis;
    Regenboogrenhagedis=Cnemidophorus lemniscatus;
    Blauwe renhagedis=Cnemidophorus arubensis
  `, [7]);

  samenvoegen("Colombiaanse tegu", "Gouden tegu");
  samenvoegen("Ameiva", "Reuzenameiva");

  koppelDieren(`
    Argentijnse zwart-witte tegu;
    Rode tegu;
    Colombiaanse tegu
  `, [8]);

  koppelDieren(`
    Kaaimanhagedis;
    Paraguayaanse kaaimanhagedis
  `, [1, 14]);

  // ============================================================
  // BASILISKEN EN ANOLISSEN
  // ============================================================

  hagedissen(`
    Basilisk;
    Groene basilisk=Basiliscus plumifrons;
    Gewone basilisk=Basiliscus basiliscus;
    Bruine basilisk=Basiliscus vittatus;
    Westelijke basilisk=Basiliscus galeritus;
    Anolis;
    Groene anolis=Anolis carolinensis;
    Bruine anolis=Anolis sagrei;
    Ridderanolis=Anolis equestris;
    Cubaanse groene anolis=Anolis porcatus;
    Puerto-Ricoanolis=Anolis cristatellus;
    Jamaicaanse anolis=Anolis grahami;
    Blauwe anolis=Anolis gorgonae;
    Gebande anolis=Anolis transversalis;
    Reuzenanolis=Anolis cuvieri;
    Neushoornanolis=Anolis proboscis;
    Anolis barbatus;
    Anolis vermiculatus;
    Anolis aquaticus;
    Anolis allisoni;
    Anolis bimaculatus;
    Anolis marmoratus;
    Anolis roquet;
    Anolis distichus;
    Anolis lineatopus;
    Anolis cybotes
  `, [7, 15]);

  koppelDieren(`
    Groene basilisk;
    Gewone basilisk;
    Bruine basilisk;
    Westelijke basilisk
  `, [14, 35]);

  koppelDieren(`
    Groene anolis;
    Ridderanolis;
    Cubaanse groene anolis;
    Jamaicaanse anolis;
    Blauwe anolis;
    Reuzenanolis
  `, [31, 35]);

  koppelDieren(`
    Groene anolis;
    Bruine anolis;
    Ridderanolis
  `, [42]);

  // ============================================================
  // HOORNHAGEDISSEN
  // ============================================================

  hagedissen(`
    Hoornhagedis;
    Texaanse hoornhagedis=Phrynosoma cornutum;
    Woestijnhoornhagedis=Phrynosoma platyrhinos;
    Koninklijke hoornhagedis=Phrynosoma solare;
    Korthoornhagedis=Phrynosoma hernandesi;
    Dwergkorthoornhagedis=Phrynosoma douglasii;
    Kusthoornhagedis=Phrynosoma coronatum;
    Reuzenhoornhagedis=Phrynosoma asio;
    Rondstaarthoornhagedis=Phrynosoma modestum;
    Platte hoornhagedis=Phrynosoma mcallii;
    Mexicaanse hoornhagedis=Phrynosoma orbiculare
  `, [15]);

  koppelDieren(`
    Texaanse hoornhagedis;
    Woestijnhoornhagedis;
    Koninklijke hoornhagedis;
    Platte hoornhagedis;
    Rondstaarthoornhagedis
  `, [25]);

  // ============================================================
  // PANTSERHAGEDISSEN
  // ============================================================

  hagedissen(`
    Gordelstaarthagedis;
    Gewone gordelstaarthagedis=Cordylus cordylus;
    Armadillohagedis=Ouroborus cataphractus;
    Reuzengordelstaarthagedis=Smaug giganteus;
    Zwarte gordelstaarthagedis=Cordylus niger;
    Tropische gordelstaarthagedis=Cordylus tropidosternum;
    Blauwe gordelstaarthagedis;
    Plaathagedis;
    Soedanese plaathagedis=Broadleysaurus major;
    Reuzenplaathagedis=Matobosaurus validus;
    Gerrhosaurus flavigularis;
    Gerrhosaurus nigrolineatus;
    Tracheloptychus petersi
  `, [5]);

  verwijderDier("Blauwe gordelstaarthagedis");

  koppelDieren(`
    Armadillohagedis;
    Reuzengordelstaarthagedis;
    Gewone gordelstaarthagedis
  `, [33]);

  // ============================================================
  // GILAMONSTERS EN KORSTHAGEDISSEN
  // ============================================================

  hagedissen(`
    Gilamonster=Heloderma suspectum;
    Mexicaanse korsthagedis=Heloderma horridum;
    Guatemalteekse korsthagedis=Heloderma charlesbogerti;
    Rio-Fuerte-korsthagedis=Heloderma exasperatum;
    Chiapaskorsthagedis=Heloderma alvarezi
  `, [7, 17, 45]);

  koppelDieren("Gilamonster", [25, 47, 49]);

  // ============================================================
  // POOTLOZE HAGEDISSEN EN WORMHAGEDISSEN
  // ============================================================

  reptielen(`
    Hazelworm=Anguis fragilis;
    Italiaanse hazelworm=Anguis veronensis;
    Oostelijke hazelworm=Anguis colchica;
    Griekse hazelworm=Anguis graeca;
    Peloponnesoshazelworm=Anguis cephallonica;
    Scheltopusik=Pseudopus apodus;
    Europese glashagedis;
    Oostelijke glashagedis=Ophisaurus ventralis;
    Slanke glashagedis=Ophisaurus attenuatus;
    Eilandglashagedis=Ophisaurus compressus;
    Marokkaanse glashagedis=Hyalosaurus koellikeri;
    Californische poothagedis=Anniella pulchra;
    Pootloze hagedis;
    Wormhagedis;
    Witte wormhagedis=Amphisbaena alba;
    Gevlekte wormhagedis=Amphisbaena fuliginosa;
    Iberische wormhagedis=Blanus cinereus;
    Turkse wormhagedis=Blanus strauchi;
    Mexicaanse molhagedis=Bipes biporus;
    Drievingerige molhagedis=Bipes tridactylus;
    Viervingerige molhagedis=Bipes canaliculatus;
    Australische poothagedis;
    Gewone schubpoothagedis=Pygopus lepidopodus;
    Westelijke schubpoothagedis=Pygopus nigriceps;
    Slanghagedis=Lialis burtonis;
    Nieuw-Guinese slanghagedis=Lialis jicari
  `, [17, 18]);

  samenvoegen("Scheltopusik", "Europese glashagedis");

  koppelDieren("Hazelworm", [26]);

  koppelDieren(`
    Witte wormhagedis;
    Gevlekte wormhagedis;
    Iberische wormhagedis;
    Turkse wormhagedis;
    Mexicaanse molhagedis;
    Drievingerige molhagedis;
    Viervingerige molhagedis
  `, [32]);

  koppelDieren(`
    Gewone schubpoothagedis;
    Westelijke schubpoothagedis;
    Slanghagedis
  `, [23]);

  // ============================================================
  // BRUGHAGEDISSEN
  // ============================================================

  reptielen(`
    Brughagedis=Tuatara=Sphenodon punctatus
  `, [4, 7, 15, 18, 27, 44]);

  // ============================================================
  // LANDSCHILDPADDEN
  // ============================================================

  function landschildpadden(tekst, extra = []) {
    groep(tekst, [
      4, 7, 18, 33, 50,
      ...extra
    ]);
  }

  landschildpadden(`
    Landschildpad;
    Griekse landschildpad=Testudo hermanni;
    Moorse landschildpad=Testudo graeca;
    Russische vierteenschildpad=Testudo horsfieldii;
    Breedrandschildpad=Testudo marginata;
    Egyptische landschildpad=Testudo kleinmanni;
    Luipaardschildpad=Stigmochelys pardalis;
    Sporenschildpad=Centrochelys sulcata;
    Afrikaanse sporenschildpad;
    Stralenschildpad=Astrochelys radiata;
    Madagaskarploegschaar schildpad=Astrochelys yniphora;
    Aldabra-reuzenschildpad=Aldabrachelys gigantea;
    Galapagosreuzenschildpad;
    Chelonoidis niger;
    Chelonoidis porteri;
    Chelonoidis becki;
    Chelonoidis hoodensis;
    Chelonoidis darwini;
    Chelonoidis chathamensis;
    Chelonoidis vandenburghi;
    Chelonoidis microphyes;
    Chelonoidis guntheri;
    Chelonoidis vicina;
    Roodvoetschildpad=Chelonoidis carbonarius;
    Geelvoetschildpad=Chelonoidis denticulatus;
    Chacoschildpad=Chelonoidis chilensis;
    Indische sterschildpad=Geochelone elegans;
    Birmese sterschildpad=Geochelone platynota;
    Pannenkoekschildpad=Malacochersus tornieri;
    Afrikaanse scharnierschildpad;
    Bells scharnierschildpad=Kinixys belliana;
    Homes scharnierschildpad=Kinixys homeana;
    Erosascharnierschildpad=Kinixys erosa;
    Bosc scharnierschildpad=Kinixys spekii;
    Spin schildpad=Pyxis arachnoides;
    Platstaartschildpad=Pyxis planicauda;
    Kaapse padloper=Homopus areolatus;
    Gespikkelde padloper=Chersobius signatus;
    Karoo-padloper=Chersobius boulengeri;
    Nama-padloper=Chersobius solus;
    Geometrische schildpad=Psammobates geometricus;
    Tent schildpad=Psammobates tentorius;
    Getande schildpad=Psammobates oculifer;
    Woestijnschildpad=Gopherus agassizii;
    Mojaveschildpad;
    Sonorawoestijnschildpad=Gopherus morafkai;
    Texaanse schildpad=Gopherus berlandieri;
    Gopherschildpad=Gopherus polyphemus;
    Mexicaanse reuzenschildpad=Gopherus flavomarginatus;
    Aziatische bosschildpad=Manouria emys;
    Zwarte bergschildpad=Manouria impressa;
    Langwerpige schildpad=Indotestudo elongata;
    Forstens schildpad=Indotestudo forstenii;
    Travancoreschildpad=Indotestudo travancorica
  `, [16, 30]);

  hernoemDier(
    "Madagaskarploegschaar schildpad",
    "Madagaskarploegschaarschildpad"
  );

  hernoemDier("Spin schildpad", "Spinschildpad");
  hernoemDier("Tent schildpad", "Tentschildpad");

  hernoemDier(
    "Bosc scharnierschildpad",
    "Spekes scharnierschildpad"
  );

  samenvoegen(
    "Sporenschildpad",
    "Afrikaanse sporenschildpad"
  );

  samenvoegen("Woestijnschildpad", "Mojaveschildpad");

  koppelDieren(`
    Griekse landschildpad;
    Moorse landschildpad;
    Russische vierteenschildpad;
    Breedrandschildpad;
    Roodvoetschildpad;
    Indische sterschildpad
  `, [8]);

  koppelDieren(`
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Sporenschildpad;
    Luipaardschildpad;
    Stralenschildpad
  `, [3]);

  koppelDieren(`
    Landschildpad;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Sporenschildpad;
    Chelonoidis porteri;
    Chelonoidis becki;
    Chelonoidis hoodensis;
    Chelonoidis darwini;
    Chelonoidis chathamensis;
    Chelonoidis vandenburghi
  `, [44]);

  koppelDieren(`
    Egyptische landschildpad;
    Sporenschildpad;
    Woestijnschildpad;
    Sonorawoestijnschildpad
  `, [25]);

  koppelDieren(`
    Egyptische landschildpad;
    Luipaardschildpad;
    Sporenschildpad;
    Stralenschildpad;
    Madagaskarploegschaarschildpad;
    Aldabra-reuzenschildpad;
    Pannenkoekschildpad;
    Bells scharnierschildpad;
    Homes scharnierschildpad;
    Erosascharnierschildpad;
    Spekes scharnierschildpad;
    Spinschildpad;
    Platstaartschildpad;
    Kaapse padloper;
    Gespikkelde padloper;
    Geometrische schildpad;
    Tentschildpad
  `, [5]);

  // ============================================================
  // EXTRA WATERSCHILDPADDEN
  // ============================================================

  groep(`
    Amerikaanse doosschildpad=Terrapene carolina;
    Oostelijke doosschildpad;
    Drieteendoosschildpad;
    Sierdoosschildpad=Terrapene ornata;
    Coahuila-doosschildpad=Terrapene coahuila;
    Mexicaanse doosschildpad=Terrapene mexicana;
    Maleise doosschildpad=Cuora amboinensis;
    Chinese doosschildpad=Cuora flavomarginata;
    Driebanddoosschildpad=Cuora trifasciata;
    Goudkopschildpad=Cuora aurocapitata;
    Vietnamese doosschildpad=Cuora galbinifrons;
    Indochinese doosschildpad;
    Indische dakschildpad=Pangshura tecta;
    Indische tent schildpad=Pangshura tentoria;
    Bruine dakschildpad=Pangshura smithii;
    Assam-dakschildpad=Pangshura sylhetensis;
    Rode dakschildpad=Batagur kachuga;
    Noordelijke rivierschildpad=Batagur baska;
    Zuidelijke rivierschildpad=Batagur affinis;
    Birmese dakschildpad=Batagur trivittata;
    Geschilderde rivierschildpad=Batagur borneoensis;
    Chinese streepschildpad=Mauremys sinensis;
    Japanse vijverschildpad=Mauremys japonica;
    Kaspische beekschildpad=Mauremys caspica;
    Balkanbeekschildpad=Mauremys rivulata;
    Spaanse beekschildpad=Mauremys leprosa;
    Reevesschildpad=Mauremys reevesii;
    Geelvijverschildpad=Mauremys mutica;
    Zwarte moerasschildpad=Siebenrockiella crassicollis;
    Zwarte vijverschildpad=Geoclemys hamiltonii;
    Spenglers schildpad=Geoemyda spengleri;
    Japanse bladschildpad=Geoemyda japonica;
    Vietnamese bladschildpad=Geoemyda;
    Roodkoprandschildpad=Rhinoclemmys pulcherrima;
    Midden-Amerikaanse houtschildpad;
    Bruine houtschildpad=Rhinoclemmys annulata;
    Zwarte houtschildpad=Rhinoclemmys funerea;
    Noord-Amerikaanse houtschildpad=Glyptemys insculpta;
    Moerasschildpad=Glyptemys muhlenbergii;
    Druppelschildpad=Clemmys guttata;
    Blanding schildpad=Emydoidea blandingii;
    Roodbuikschildpad=Pseudemys rubriventris;
    Florida-roodbuikschildpad=Pseudemys nelsoni;
    Riviercooter=Pseudemys concinna;
    Texaanse cooter=Pseudemys texana;
    Alabama-roodbuikschildpad=Pseudemys alabamensis;
    Zwartknobbellandkaartschildpad=Graptemys nigrinoda;
    Geelvleklandkaartschildpad=Graptemys flavimaculata;
    Gewone landkaartschildpad=Graptemys geographica;
    Texas-landkaartschildpad=Graptemys versa;
    Gezaagde landkaartschildpad=Graptemys ouachitensis;
    Barbours landkaartschildpad=Graptemys barbouri;
    Reuzenweekschildpad=Pelochelys cantorii;
    Nieuw-Guinese reuzenweekschildpad=Pelochelys bibroni;
    Aziatische reuzenweekschildpad=Rafetus swinhoei;
    Eufraatweekschildpad=Rafetus euphraticus;
    Pauwoogweekschildpad=Nilssonia hurum;
    Indische weekschildpad=Nilssonia gangetica;
    Birmese pauwoogweekschildpad=Nilssonia formosa;
    Zwarte weekschildpad=Nilssonia nigricans;
    Afrikaanse helmschildpad=Pelomedusa subrufa;
    Afrikaanse klepschildpad=Pelusios castaneus;
    Oost-Afrikaanse klepschildpad=Pelusios subniger;
    Getande klepschildpad=Pelusios sinuatus;
    Gele modderschildpad=Kinosternon flavescens;
    Gestreepte modderschildpad=Kinosternon baurii;
    Oostelijke modderschildpad=Kinosternon subrubrum;
    Schorpioenmodderschildpad=Kinosternon scorpioides;
    Grootkopmuskusschildpad=Sternotherus minor;
    Platte muskusschildpad=Sternotherus depressus
  `, [4, 7, 18, 33, 50]);

  hernoemDier(
    "Indische tent schildpad",
    "Indische tentschildpad"
  );

  hernoemDier(
    "Blanding schildpad",
    "Blandingschildpad"
  );

  samenvoegen(
    "Amerikaanse doosschildpad",
    "Oostelijke doosschildpad"
  );

  samenvoegen(
    "Vietnamese doosschildpad",
    "Indochinese doosschildpad"
  );

  samenvoegen(
    "Roodkoprandschildpad",
    "Midden-Amerikaanse houtschildpad"
  );

  samenvoegen(
    "Chinese gestreepte schildpad",
    "Chinese streepschildpad"
  );

  samenvoegen(
    "Chinese driekielschildpad",
    "Reevesschildpad"
  );

  verwijderDier("Vietnamese bladschildpad");

  koppelDieren(`
    Kaspische beekschildpad;
    Balkanbeekschildpad;
    Spaanse beekschildpad;
    Chinese gestreepte schildpad;
    Chinese driekielschildpad;
    Japanse vijverschildpad;
    Riviercooter;
    Texaanse cooter;
    Druppelschildpad;
    Blandingschildpad;
    Reuzenweekschildpad;
    Nieuw-Guinese reuzenweekschildpad;
    Aziatische reuzenweekschildpad;
    Eufraatweekschildpad;
    Afrikaanse helmschildpad;
    Afrikaanse klepschildpad;
    Indische weekschildpad;
    Pauwoogweekschildpad;
    Grootkopmuskusschildpad;
    Platte muskusschildpad
  `, [1, 14]);

  // ============================================================
  // BOOMKIKKERS
  // ============================================================

  function kikkers(tekst, extra = []) {
    amfibieen(tekst, [
      4, 7, 15, 17, 34,
      ...extra
    ]);
  }

  kikkers(`
    Boomkikker;
    Europese boomkikker=Hyla arborea;
    Oostelijke boomkikker=Hyla orientalis;
    Mediterrane boomkikker=Hyla meridionalis;
    Italiaanse boomkikker=Hyla intermedia;
    Sardijnse boomkikker=Hyla sarda;
    Iberische boomkikker=Hyla molleri;
    Japanse boomkikker=Dryophytes japonicus;
    Amerikaanse groene boomkikker=Dryophytes cinereus;
    Grijze boomkikker=Dryophytes versicolor;
    Copes grijze boomkikker=Dryophytes chrysoscelis;
    Eekhoornboomkikker=Dryophytes squirellus;
    Blaffende boomkikker=Dryophytes gratiosus;
    Dennenboomkikker=Dryophytes femoralis;
    Roodoogmakikikker=Agalychnis callidryas;
    Roodoogboomkikker;
    Mexicaanse makikikker=Agalychnis dacnicolor;
    Zwartoogboomkikker=Agalychnis moreletii;
    Blauwzijdige boomkikker=Agalychnis annae;
    Waskikker=Phyllomedusa sauvagii;
    Reuzenmakikikker=Phyllomedusa bicolor;
    Tijgerpootmakikikker=Pithecopus hypochondrialis;
    Australische groene boomkikker=Ranoidea caerulea;
    Koraalteenboomkikker;
    Australische reuzenboomkikker=Ranoidea infrafrenata;
    Rodeoogboomkikker uit Australië=Ranoidea chloris;
    Blauwe bergboomkikker=Litoria citropa;
    Gestreepte raketkikker=Litoria nasuta;
    Oranje dijboomkikker=Litoria xanthomera;
    Bruine boomkikker=Litoria ewingii;
    Perons boomkikker=Litoria peronii;
    Cubaanse boomkikker=Osteopilus septentrionalis;
    Jamaicaanse boomkikker=Osteopilus crucialis;
    Melkkikker=Trachycephalus resinifictrix;
    Amazoneboomkikker;
    Geelgevlekte boomkikker=Boana punctata;
    Reuzenboomkikker=Boana boans;
    Smidkikker=Boana faber;
    Gemarmerde boomkikker=Scinax marmoratus;
    Dwergboomkikker=Dendropsophus minutus;
    Gele boomkikker=Dendropsophus microcephalus;
    Gevlekte boomkikker;
    Trompetboomkikker=Boana raniceps
  `, [35]);

  samenvoegen("Roodoogmakikikker", "Roodoogboomkikker");

  samenvoegen(
    "Australische groene boomkikker",
    "Koraalteenboomkikker"
  );

  samenvoegen("Melkkikker", "Amazoneboomkikker");

  hernoemDier(
    "Oranje dijboomkikker",
    "Oranjedijboomkikker"
  );

  koppelDieren(`
    Europese boomkikker;
    Mediterrane boomkikker;
    Roodoogmakikikker;
    Mexicaanse makikikker;
    Zwartoogboomkikker;
    Blauwzijdige boomkikker;
    Waskikker;
    Reuzenmakikikker;
    Australische groene boomkikker;
    Australische reuzenboomkikker;
    Amerikaanse groene boomkikker;
    Grijze boomkikker;
    Melkkikker
  `, [31]);

  koppelDieren("Europese boomkikker", [26]);

  koppelDieren(`
    Roodoogmakikikker;
    Blauwzijdige boomkikker;
    Waskikker;
    Reuzenmakikikker;
    Melkkikker
  `, [12, 47]);

  koppelDieren(`
    Grijze boomkikker;
    Copes grijze boomkikker
  `, [42]);

  // ============================================================
  // GIFKIKKERS
  // ============================================================

  kikkers(`
    Gifkikker;
    Pijlgifkikker;
    Blauwe pijlgifkikker;
    Verf kikkertje=Dendrobates tinctorius;
    Gouden gifkikker=Phyllobates terribilis;
    Zwartbenige gifkikker=Phyllobates bicolor;
    Gestreepte gifkikker=Phyllobates vittatus;
    Phyllobates lugubris;
    Phyllobates aurotaenia;
    Aardbeigifkikker=Oophaga pumilio;
    Harlekijngifkikker=Oophaga histrionica;
    Oophaga lehmanni;
    Oophaga granulifera;
    Oophaga sylvatica;
    Oophaga vicentei;
    Oophaga speciosa;
    Geelbandgifkikker=Dendrobates leucomelas;
    Groen-zwarte gifkikker=Dendrobates auratus;
    Dendrobates truncatus;
    Ranitomeya imitator;
    Ranitomeya variabilis;
    Ranitomeya ventrimaculata;
    Ranitomeya reticulata;
    Ranitomeya fantastica;
    Ranitomeya amazonica;
    Ranitomeya benedicta;
    Ranitomeya summersi;
    Ranitomeya vanzolinii;
    Ranitomeya flavovittata;
    Ranitomeya uakarii;
    Ranitomeya sirensis;
    Ranitomeya lamasi;
    Ameerega trivittata;
    Ameerega bilinguis;
    Ameerega bassleri;
    Ameerega hahneli;
    Ameerega petersi;
    Ameerega pulchripecta;
    Ameerega silverstonei;
    Epipedobates anthonyi;
    Epipedobates tricolor;
    Epipedobates boulengeri;
    Adelphobates galactonotus;
    Adelphobates castaneoticus;
    Adelphobates quinquevittatus;
    Excidobates mysteriosus;
    Excidobates captivus
  `, [45]);

  hernoemDier("Verf kikkertje", "Verfkikkertje");

  samenvoegen("Gifkikker", "Pijlgifkikker");

  // De blauwe pijlgifkikker is een kleurvorm
  // van Dendrobates tinctorius.

  samenvoegen("Verfkikkertje", "Blauwe pijlgifkikker");

  koppelDieren(`
    Verfkikkertje;
    Gouden gifkikker;
    Zwartbenige gifkikker;
    Aardbeigifkikker;
    Harlekijngifkikker;
    Geelbandgifkikker;
    Groen-zwarte gifkikker;
    Ranitomeya imitator;
    Ranitomeya variabilis;
    Ranitomeya reticulata;
    Ranitomeya fantastica;
    Ranitomeya benedicta;
    Adelphobates galactonotus;
    Excidobates mysteriosus
  `, [47]);

  koppelDieren(`
    Verfkikkertje;
    Gouden gifkikker;
    Zwartbenige gifkikker;
    Aardbeigifkikker;
    Harlekijngifkikker;
    Geelbandgifkikker;
    Groen-zwarte gifkikker
  `, [12]);

  // ============================================================
  // MANTELLA'S
  // ============================================================

  kikkers(`
    Mantella;
    Gouden mantella=Mantella aurantiaca;
    Groene mantella=Mantella viridis;
    Blauwpootmantella=Mantella expectata;
    Geschilderde mantella=Mantella madagascariensis;
    Bruine mantella=Mantella betsileo;
    Mantella baroni;
    Mantella cowanii;
    Mantella crocea;
    Mantella ebenaui;
    Mantella haraldmeieri;
    Mantella laevigata;
    Mantella manery;
    Mantella milotympanum;
    Mantella nigricans;
    Mantella pulchra
  `, [5, 45]);

  koppelDieren(`
    Gouden mantella;
    Groene mantella;
    Blauwpootmantella;
    Geschilderde mantella;
    Mantella baroni;
    Mantella cowanii;
    Mantella crocea
  `, [47]);

  // ============================================================
  // GLA SKIKKERS
  // ============================================================

  kikkers(`
    Glaskikker;
    Hyalinobatrachium fleischmanni;
    Hyalinobatrachium valerioi;
    Hyalinobatrachium colymbiphyllum;
    Hyalinobatrachium aureoguttatum;
    Hyalinobatrachium yaku;
    Hyalinobatrachium pellucidum;
    Hyalinobatrachium fragile;
    Hyalinobatrachium bergeri;
    Hyalinobatrachium orientale;
    Hyalinobatrachium vireovittatum;
    Centrolene geckoideum;
    Centrolene buckleyi;
    Centrolene savagei;
    Centrolene notostictum;
    Espadarana prosoblepon;
    Espadarana andina;
    Cochranella granulosa;
    Cochranella euknemos;
    Nymphargus grandisonae;
    Nymphargus griffithsi;
    Sachatamia albomaculata;
    Sachatamia ilex;
    Teratohyla pulverata;
    Teratohyla spinosa
  `, [12, 31, 35]);

  // ============================================================
  // ECHTE KIKKERS
  // ============================================================

  kikkers(`
    Heikikker=Rana arvalis;
    Springkikker=Rana dalmatina;
    Italiaanse bruine kikker=Rana italica;
    Iberische kikker=Rana iberica;
    Griekse kikker=Rana graeca;
    Balkanbruine kikker;
    Pyreneese kikker=Rana pyrenaica;
    Latastes kikker=Rana latastei;
    Siberische kikker=Rana amurensis;
    Japanse bruine kikker=Rana japonica;
    Hokkaidokikker=Rana pirica;
    Noord-Amerikaanse boskikker=Lithobates sylvaticus;
    Zuidelijke luipaardkikker=Lithobates sphenocephalus;
    Rio-Grande-luipaardkikker=Lithobates berlandieri;
    Vlakte luipaardkikker=Lithobates blairi;
    Pickerelkikker=Lithobates palustris;
    Amerikaanse moeraskikker=Lithobates grylio;
    Rivierkikker=Lithobates heckscheri;
    Minkkikker=Lithobates septentrionalis;
    Californische roodpootkikker=Rana draytonii;
    Noordelijke roodpootkikker=Rana aurora;
    Berggeelpootkikker=Rana muscosa;
    Sierra Nevada-geelpootkikker=Rana sierrae;
    Kaskadekikker=Rana cascadae;
    Columbia-gevlekte kikker=Rana luteiventris;
    Oregon-gevlekte kikker=Rana pretiosa;
    Italiaanse poelkikker=Pelophylax bergeri;
    Iberische groene kikker=Pelophylax perezi;
    Balkanmeerkikker=Pelophylax kurtmuelleri;
    Cypriotische groene kikker=Pelophylax cypriensis;
    Levantijnse groene kikker=Pelophylax bedriagae;
    Zwartgevlekte kikker=Pelophylax nigromaculatus;
    Goudgevlekte vijverkikker=Pelophylax plancyi;
    Japanse vijverkikker=Pelophylax porosus
  `);

  hernoemDier(
    "Vlakte luipaardkikker",
    "Vlakteluipaardkikker"
  );

  verwijderDier("Balkanbruine kikker");

  koppelDieren(`
    Heikikker;
    Springkikker
  `, [26]);

  koppelDieren(`
    Heikikker;
    Springkikker;
    Italiaanse bruine kikker;
    Iberische kikker;
    Griekse kikker;
    Siberische kikker;
    Noord-Amerikaanse boskikker;
    Japanse bruine kikker
  `, [14]);

  koppelDieren(`
    Amerikaanse moeraskikker;
    Rivierkikker;
    Minkkikker;
    Italiaanse poelkikker;
    Iberische groene kikker;
    Balkanmeerkikker;
    Zwartgevlekte kikker;
    Japanse vijverkikker
  `, [1, 14]);

  // ============================================================
  // HOORNKIKKERS
  // ============================================================

  kikkers(`
    Hoornkikker;
    Pacmankikker;
    Argentijnse hoornkikker=Ceratophrys ornata;
    Cranwells hoornkikker=Ceratophrys cranwelli;
    Surinaamse hoornkikker=Ceratophrys cornuta;
    Braziliaanse hoornkikker=Ceratophrys aurita;
    Ceratophrys stolzmanni;
    Ceratophrys calcarata;
    Ceratophrys joazeirensis;
    Ceratophrys testudo;
    Budgettkikker=Lepidobatrachus laevis;
    Lepidobatrachus asper;
    Lepidobatrachus llanensis;
    Chacokikker=Chacophrys pierottii
  `);

  samenvoegen("Hoornkikker", "Pacmankikker");

  koppelDieren(`
    Argentijnse hoornkikker;
    Cranwells hoornkikker;
    Surinaamse hoornkikker;
    Budgettkikker
  `, [8]);

  // ============================================================
  // OVERIGE BIJZONDERE KIKKERS
  // ============================================================

  kikkers(`
    Goliathkikker=Conraua goliath;
    Afrikaanse brulkikker=Pyxicephalus adspersus;
    Dwergbrulkikker=Pyxicephalus edulis;
    Indische brulkikker=Hoplobatrachus tigerinus;
    Afrikaanse tijgerkikker=Hoplobatrachus occipitalis;
    Tomaatkikker=Dyscophus antongilii;
    Valse tomaatkikker=Dyscophus guineti;
    Dyscophus insularis;
    Paarse kikker=Nasikabatrachus sahyadrensis;
    Varkensneuskikker;
    Woestijnregenkikker=Breviceps macrops;
    Zwarte regenkikker=Breviceps fuscus;
    Gewone regenkikker=Breviceps adspersus;
    Kaapse regenkikker=Breviceps gibbosus;
    Bosregenkikker=Breviceps sylvestris;
    Malagassische regenboogkikker=Scaphiophryne gottlebei;
    Bontgekleurde regenkikker;
    Schildkikker=Myobatrachus gouldii;
    Australische waterhoudende kikker=Ranoidea platycephala;
    Kruis kikker=Notaden bennettii;
    Koraal kikkertje=Notaden nichollsi;
    Darwins kikker=Rhinoderma darwinii;
    Noordelijke darwinkikker=Rhinoderma rufum;
    Buidelkikker;
    Andesbuidelkikker=Gastrotheca riobambae;
    Hoornbuidelkikker=Gastrotheca cornuta;
    Reuzenbuidelkikker=Gastrotheca ovifera;
    Graskikker=Ptychadena;
    Gemaskerde graskikker=Ptychadena mascareniensis;
    Schuimnestkikker;
    Afrikaanse schuimnestkikker=Chiromantis xerampelina;
    Indische schuimnestkikker=Polypedates maculatus;
    Gewone schuimnestkikker=Polypedates leucomystax;
    Wallaces vliegende kikker=Rhacophorus nigropalmatus;
    Malabarse zweefkikker=Rhacophorus malabaricus;
    Javaanse vliegende kikker=Rhacophorus reinwardtii;
    Zwartvoetvliegende kikker;
    Moskikker=Theloderma corticale;
    Vietnamese moskikker;
    Vogeldrolkikker=Theloderma asperum;
    Spookkikker;
    Kaapse spookkikker=Heleophryne purcelli;
    Tafelbergspookkikker=Heleophryne rosei;
    Tailed frog=Ascaphus truei;
    Rocky Mountain-tailed frog=Ascaphus montanus;
    Varkenskikker=Rhinophrynus dorsalis;
    Smalmondkikker;
    Gebande smalmondkikker=Kaloula pulchra;
    Oostelijke smalmondkikker=Gastrophryne carolinensis;
    Westelijke smalmondkikker=Gastrophryne olivacea;
    Paedophryne amauensis;
    Paedophryne swiftorum;
    Paedophryne kathismaphlox;
    Paedophryne oyatabu;
    Brachycephalus ephippium;
    Brachycephalus didactylus;
    Brachycephalus pulex;
    Brachycephalus rotenbergae
  `);

  hernoemDier("Kruis kikker", "Kruiskikker");

  samenvoegen("Paarse kikker", "Varkensneuskikker");
  samenvoegen("Moskikker", "Vietnamese moskikker");

  samenvoegen(
    "Wallaces vliegende kikker",
    "Zwartvoetvliegende kikker"
  );

  verwijderDier("Bontgekleurde regenkikker");
  verwijderDier("Koraal kikkertje");

  koppelDieren(`
    Paedophryne amauensis;
    Paedophryne swiftorum;
    Paedophryne kathismaphlox;
    Paedophryne oyatabu;
    Brachycephalus ephippium;
    Brachycephalus didactylus;
    Brachycephalus pulex
  `, [10]);

  koppelDieren(`
    Paarse kikker;
    Woestijnregenkikker;
    Zwarte regenkikker;
    Schildkikker;
    Australische waterhoudende kikker;
    Varkenskikker
  `, [32]);

  koppelDieren(`
    Woestijnregenkikker;
    Australische waterhoudende kikker
  `, [25]);

  koppelDieren(`
    Tomaatkikker;
    Valse tomaatkikker;
    Malagassische regenboogkikker;
    Brachycephalus ephippium
  `, [47]);

  // ============================================================
  // PADDEN
  // ============================================================

  kikkers(`
    Pad;
    Gewone pad=Bufo bufo;
    Stekelpad=Bufo spinosus;
    Aziatische gewone pad=Bufo gargarizans;
    Japanse pad=Bufo japonicus;
    Kaukasische pad=Bufo verrucosissimus;
    Rugstreeppad=Epidalea calamita;
    Groene pad=Bufotes viridis;
    Siciliaanse groene pad=Bufotes boulengeri siculus;
    Balearengroene pad=Bufotes balearicus;
    Afrikaanse groene pad=Bufotes boulengeri;
    Mongoolse pad=Strauchbufo raddei;
    Amerikaanse pad=Anaxyrus americanus;
    Fowlers pad=Anaxyrus fowleri;
    Canadese pad=Anaxyrus hemiophrys;
    Westelijke pad=Anaxyrus boreas;
    Woodhouses pad=Anaxyrus woodhousii;
    Grotevlaktepad=Anaxyrus cognatus;
    Roodgevlekte pad=Anaxyrus punctatus;
    Coloradorivierpad=Incilius alvarius;
    Eikenpad=Anaxyrus quercicus;
    Houstonpad=Anaxyrus houstonensis;
    Wyomingpad=Anaxyrus baxteri;
    Gouden pad=Incilius periglenes;
    Reuzenpad=Aga-pad=Rhinella marina;
    Zuid-Amerikaanse reuzenpad=Rhinella diptycha;
    Snavelpad=Rhinella margaritifera;
    Rococopad;
    Crested toad=Rhinella cristata;
    Aziatische zwarte stekelpad=Duttaphrynus melanostictus;
    Indische gewone pad;
    Himalayapad=Duttaphrynus himalayanus;
    Birmese pad=Duttaphrynus parietalis;
    Egyptische pad=Sclerophrys regularis;
    Afrikaanse rode pad=Schismaderma carens;
    Panterpad=Sclerophrys pardalis;
    Westelijke luipaardpad=Sclerophrys pantherina;
    Gekielde pad=Sclerophrys pusilla;
    Afrikaanse dwergpad;
    Guttural toad=Sclerophrys gutturalis;
    Harlekijnpad;
    Panamese gouden kikker=Atelopus zeteki;
    Atelopus varius;
    Atelopus spumarius;
    Atelopus hoogmoedi;
    Atelopus balios;
    Atelopus pulcher;
    Atelopus flavescens;
    Atelopus limosus
  `);

  samenvoegen("Zuid-Amerikaanse reuzenpad", "Rococopad");

  samenvoegen(
    "Aziatische zwarte stekelpad",
    "Indische gewone pad"
  );

  verwijderDier("Birmese pad");

  // Uitgestorven gouden pad.

  verwijderDier("Gouden pad");

  dier("Gouden pad", [43, 50], [
    "Incilius periglenes"
  ]);

  koppelDieren(`
    Gewone pad;
    Rugstreeppad
  `, [26, 27, 28]);

  koppelDieren(`
    Reuzenpad;
    Zuid-Amerikaanse reuzenpad;
    Coloradorivierpad;
    Panamese gouden kikker;
    Atelopus varius;
    Atelopus spumarius;
    Atelopus hoogmoedi
  `, [45]);

  koppelDieren(`
    Panamese gouden kikker;
    Atelopus varius;
    Atelopus spumarius;
    Atelopus flavescens
  `, [47]);

  // ============================================================
  // KNOFLOOKPADDEN EN VROEDMEESTERPADDEN
  // ============================================================

  kikkers(`
    Knoflookpad=Pelobates fuscus;
    Spaanse knoflookpad=Pelobates cultripes;
    Syrische knoflookpad=Pelobates syriacus;
    Marokkaanse knoflookpad=Pelobates varaldii;
    Oostelijke knoflookpad=Pelobates vespertinus;
    Amerikaanse knoflookpad;
    Oostelijke spadefoot=Scaphiopus holbrookii;
    Woestijnspadefoot=Scaphiopus couchii;
    Plains spadefoot=Spea bombifrons;
    Mexicaanse spadefoot=Spea multiplicata;
    Grotebekspadefoot=Spea hammondii;
    Vroedmeesterpad=Alytes obstetricans;
    Iberische vroedmeesterpad=Alytes cisternasii;
    Betische vroedmeesterpad=Alytes dickhilleni;
    Mallorcavroedmeesterpad=Alytes muletensis;
    Marokkaanse vroedmeesterpad=Alytes maurus;
    Schijftongkikker;
    Spaanse schijftongkikker=Discoglossus galganoi;
    Geschilderde schijftongkikker=Discoglossus pictus;
    Corsicaanse schijftongkikker=Discoglossus montalentii;
    Sardijnse schijftongkikker=Discoglossus sardus;
    Hulaschijftongkikker=Latonia nigriventer
  `);

  koppelDieren(`
    Knoflookpad;
    Vroedmeesterpad
  `, [26]);

  koppelDieren(`
    Knoflookpad;
    Spaanse knoflookpad;
    Syrische knoflookpad;
    Oostelijke spadefoot;
    Woestijnspadefoot;
    Plains spadefoot;
    Mexicaanse spadefoot
  `, [32]);

  // ============================================================
  // SALAMANDERS
  // ============================================================

  function salamanders(tekst, extra = []) {
    amfibieen(tekst, [4, 18, ...extra]);
  }

  salamanders(`
    Salamander;
    Vuursalamander=Salamandra salamandra;
    Alpensalamander=Salamandra atra;
    Corsicaanse vuursalamander=Salamandra corsica;
    Noord-Afrikaanse vuursalamander=Salamandra algira;
    Klein-Aziatische vuursalamander=Salamandra infraimmaculata;
    Lanza's alpensalamander=Salamandra lanzai;
    Gouden alpensalamander;
    Kaukasische salamander=Mertensiella caucasica;
    Turkse landsalamander=Lyciasalamandra;
    Zwarte bergsalamander;
    Tijgersalamander=Ambystoma tigrinum;
    Gestreepte tijgersalamander=Ambystoma mavortium;
    Gevlekte salamander=Ambystoma maculatum;
    Blauwvleksalamander=Ambystoma laterale;
    Jeffersons salamander=Ambystoma jeffersonianum;
    Marmersalamander uit Amerika=Ambystoma opacum;
    Gemarmerde molsalamander;
    Ring salamander=Ambystoma annulatum;
    Kleinebekmolsalamander=Ambystoma texanum;
    Molsalamander=Ambystoma talpoideum;
    Langteensalamander=Ambystoma macrodactylum;
    Californische tijgersalamander=Ambystoma californiense;
    Mexicaanse molsalamander;
    Ambystoma andersoni;
    Ambystoma dumerilii;
    Ambystoma mexicanum;
    Ambystoma ordinarium;
    Rode salamander=Pseudotriton ruber;
    Moddersalamander=Pseudotriton montanus;
    Lentesalamander=Gyrinophilus porphyriticus;
    Grotsalamander=Eurycea lucifuga;
    Texasblindsalamander=Eurycea rathbuni;
    Dwer salamander=Eurycea quadridigitata;
    Tweestreepsalamander=Eurycea bislineata;
    Langstaartsalamander=Eurycea longicauda;
    Drievleksalamander=Eurycea guttolineata;
    Donkere salamander=Desmognathus fuscus;
    Noordelijke rode rugsalamander=Plethodon cinereus;
    Slanke salamander=Batrachoseps;
    Californische slanke salamander=Batrachoseps attenuatus;
    Ensatina=Ensatina eschscholtzii;
    Rode heuvelsalamander=Phaeognathus hubrichti;
    Groene salamander=Aneides aeneus;
    Boom salamander=Aneides lugubris;
    Zwarte salamander=Aneides flavipunctatus;
    Longloze salamander;
    Italiaanse grotsalamander=Speleomantes italicus;
    Franse grotsalamander=Speleomantes strinatii;
    Sardijnse grotsalamander=Speleomantes genei;
    Monte-Albosalamander=Speleomantes flavus;
    Amerikaanse reuzensalamander;
    Pacifische reuzensalamander=Dicamptodon tenebrosus;
    Idaho-reuzensalamander=Dicamptodon aterrimus;
    Californische reuzensalamander=Dicamptodon ensatus;
    Cope-reuzensalamander=Dicamptodon copei;
    Siberische salamander=Salamandrella keyserlingii;
    Aziatische klauwsalamander=Onychodactylus japonicus;
    Japanse klauwsalamander;
    Koreaanse salamander=Hynobius leechii;
    Tokyosalamander=Hynobius tokyoensis;
    Nevelsalamander=Hynobius nebulosus
  `);

  hernoemDier("Ring salamander", "Ringsalamander");
  hernoemDier("Dwer salamander", "Dwergsalamander");
  hernoemDier("Boom salamander", "Boomsalamander");

  samenvoegen(
    "Marmersalamander uit Amerika",
    "Gemarmerde molsalamander"
  );

  samenvoegen(
    "Japanse klauwsalamander",
    "Aziatische klauwsalamander"
  );

  samenvoegen("Axolotl", "Ambystoma mexicanum");
  samenvoegen("Alpensalamander", "Zwarte bergsalamander");

  koppelDieren(`
    Vuursalamander;
    Tijgersalamander;
    Gevlekte salamander;
    Blauwvleksalamander;
    Jeffersons salamander;
    Marmersalamander uit Amerika;
    Noordelijke rode rugsalamander;
    Ensatina;
    Italiaanse grotsalamander
  `, [6]);

  koppelDieren(`
    Vuursalamander;
    Rode salamander;
    Moddersalamander;
    Lentesalamander;
    Grotsalamander;
    Tweestreepsalamander;
    Langstaartsalamander;
    Groene salamander;
    Boomsalamander;
    Ensatina
  `, [15]);

  koppelDieren(`
    Tijgersalamander;
    Gestreepte tijgersalamander;
    Gevlekte salamander;
    Blauwvleksalamander;
    Jeffersons salamander;
    Ringsalamander;
    Kleinebekmolsalamander;
    Molsalamander;
    Axolotl;
    Siberische salamander
  `, [7]);

  koppelDieren(`
    Vuursalamander;
    Alpensalamander;
    Corsicaanse vuursalamander;
    Noord-Afrikaanse vuursalamander;
    Klein-Aziatische vuursalamander
  `, [45]);

  koppelDieren("Vuursalamander", [26, 27, 47, 49]);

  koppelDieren(`
    Texasblindsalamander;
    Ambystoma andersoni;
    Ambystoma dumerilii;
    Axolotl
  `, [1, 14]);

  // ============================================================
  // EXTRA WATERSALAMANDERS
  // ============================================================

  salamanders(`
    Watersalamander;
    Grote kamsalamander;
    Donaukamsalamander=Triturus dobrogicus;
    Balkan kamsalamander=Triturus ivanbureschi;
    Zuidelijke marmersalamander=Triturus pygmaeus;
    Macedonische kamsalamander=Triturus macedonicus;
    Karelin-kamsalamander=Triturus karelinii;
    Kaukasische watersalamander=Ommatotriton ophryticus;
    Gebande watersalamander;
    Zuidelijke bandwatersalamander=Ommatotriton vittatus;
    Iraanse watersalamander=Neurergus kaiseri;
    Koerdische watersalamander=Neurergus microspilotus;
    Gevlekte bergwatersalamander=Neurergus crocatus;
    Chinese krokodilsalamander=Tylototriton shanjing;
    Himalayakrokodilsalamander=Tylototriton verrucosus;
    Zwarte krokodilsalamander=Tylototriton asperrimus;
    Keizersalamander;
    Chinese wrattensalamander=Paramesotriton chinensis;
    Hongkongwatersalamander=Paramesotriton hongkongensis;
    Vietnamese wrattensalamander=Paramesotriton deloustali;
    Zwaardstaartsalamander=Cynops ensicauda;
    Amerikaanse oostelijke watersalamander=Notophthalmus viridescens;
    Zwartgevlekte watersalamander=Notophthalmus meridionalis;
    Gestreepte watersalamander=Notophthalmus perstriatus;
    Californische watersalamander=Taricha torosa;
    Ruwhuidwatersalamander=Taricha granulosa;
    Roodbuikwatersalamander=Taricha rivularis;
    Sierra-watersalamander=Taricha sierrae
  `, [7]);

  hernoemDier(
    "Balkan kamsalamander",
    "Balkankamsalamander"
  );

  samenvoegen("Kamsalamander", "Grote kamsalamander");

  samenvoegen(
    "Kaukasische watersalamander",
    "Gebande watersalamander"
  );

  samenvoegen(
    "Chinese krokodilsalamander",
    "Keizersalamander"
  );

  koppelDieren(`
    Californische watersalamander;
    Ruwhuidwatersalamander;
    Roodbuikwatersalamander;
    Sierra-watersalamander
  `, [45]);

  koppelDieren(`
    Kamsalamander;
    Kleine watersalamander;
    Vinpootsalamander;
    Alpenwatersalamander
  `, [26]);

  // ============================================================
  // WORMSALAMANDERS
  // ============================================================

  amfibieen(`
    Wormsalamander;
    Caecilia;
    Ringwormsalamander=Siphonops annulatus;
    Mexicaanse wormsalamander=Dermophis mexicanus;
    Aquatische wormsalamander=Typhlonectes natans;
    Typhlonectes compressicauda;
    Atretochoana eiselti;
    Caecilia tentaculata;
    Caecilia thompsoni;
    Caecilia gracilis;
    Caecilia orientalis;
    Ichthyophis glutinosus;
    Ichthyophis bannanicus;
    Ichthyophis kohtaoensis;
    Ichthyophis beddomei;
    Ichthyophis tricolor;
    Ichthyophis monochrous;
    Boulengerula taitana;
    Boulengerula boulengeri;
    Scolecomorphus vittatus;
    Scolecomorphus kirkii;
    Geotrypetes seraphini;
    Gegeneophis ramaswamii;
    Grandisonia alternans;
    Hypogeophis rostratus;
    Praslinia cooperi
  `);

  koppelDieren(`
    Wormsalamander;
    Ringwormsalamander;
    Mexicaanse wormsalamander;
    Caecilia tentaculata;
    Caecilia thompsoni;
    Ichthyophis glutinosus;
    Ichthyophis bannanicus;
    Ichthyophis beddomei;
    Boulengerula taitana;
    Boulengerula boulengeri
  `, [32]);

  koppelDieren(`
    Aquatische wormsalamander;
    Typhlonectes compressicauda;
    Atretochoana eiselti
  `, [1, 14]);

  // ============================================================
  // EXTRA KROKODILLEN
  // ============================================================

  reptielen(`
    Afrikaanse pantserkrokodil=Mecistops cataphractus;
    Centraal-Afrikaanse pantserkrokodil=Mecistops leptorhynchus;
    Nieuw-Guineakrokodil=Crocodylus novaeguineae;
    Borneokrokodil;
    Johnstons krokodil;
    Hallskrokodil=Crocodylus halli
  `, [4, 7, 14, 17, 18]);

  samenvoegen(
    "Australische zoetwaterkrokodil",
    "Johnstons krokodil"
  );

  verwijderDier("Borneokrokodil");

  koppelDieren(`
    Afrikaanse pantserkrokodil;
    Centraal-Afrikaanse pantserkrokodil
  `, [1, 5, 37]);

  koppelDieren(`
    Nieuw-Guineakrokodil;
    Hallskrokodil
  `, [1]);

  // ============================================================
  // VRAAG 1: EXTRA WATERDIEREN
  // ============================================================

  koppelDieren(`
    Groene anaconda;
    Gele anaconda;
    Donkergevlekte anaconda;
    Boliviaanse anaconda;
    Gebande watercobra;
    Slurfslang;
    Tentakelslang;
    Noordelijke waterslang;
    Gebande waterslang;
    Diamantwaterslang;
    Bruine waterslang;
    Watermoccasinslang;
    Aziatische watervaraan;
    Nijlvaraan;
    Mertens watervaraan;
    Kaaimanhagedis;
    Paraguayaanse kaaimanhagedis;
    Aquatische wormsalamander;
    Typhlonectes compressicauda;
    Atretochoana eiselti;
    Texasblindsalamander;
    Ambystoma andersoni;
    Ambystoma dumerilii;
    Nieuw-Guineakrokodil;
    Afrikaanse pantserkrokodil;
    Centraal-Afrikaanse pantserkrokodil
  `, [1, 14]);

  // ============================================================
  // VRAAG 3: DIERENTUINEN
  // ============================================================

  koppelDieren(`
    Komodovaraan;
    Nijlvaraan;
    Savannevaraan;
    Aziatische watervaraan;
    Krokodilvaraan;
    Groene boomvaraan;
    Blauwe boomvaraan;
    Groene leguaan;
    Blauwe leguaan;
    Neushoornleguaan;
    Cubaanse rotsleguaan;
    Zeeleguaan;
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Parsonskameleon;
    Luipaardgekko;
    Wimpergekko;
    Tokkeh;
    Grote madagaskardaggekko;
    Satanische bladstaartgekko;
    Baardagaam;
    Kraaghagedis;
    Blauwtongskink;
    Dennenappelskink;
    Krokodilskink;
    Groene basilisk;
    Gilamonster;
    Mexicaanse korsthagedis;
    Argentijnse zwart-witte tegu;
    Koningspython;
    Tijgerpython;
    Birmese python;
    Netpython;
    Groene boompython;
    Boa constrictor;
    Groene anaconda;
    Gele anaconda;
    Regenboogboa;
    Smaragdboa;
    Koningscobra;
    Brilslang;
    Zwarte mamba;
    Pofadder;
    Gabonadder;
    Neushoornadder;
    Texaanse ratelslang;
    Diamantratelslang;
    Nijlkrokodil;
    Zeekrokodil;
    Mississippialligator;
    Chinese alligator;
    Brilkaaiman;
    Zwarte kaaiman;
    Gaviaal;
    Onechte gaviaal;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Sporenschildpad;
    Luipaardschildpad;
    Stralenschildpad;
    Griekse landschildpad;
    Alligatorschildpad;
    Matamata;
    Varkensneusschildpad;
    Axolotl;
    Olm;
    Chinese reuzensalamander;
    Japanse reuzensalamander;
    Vuursalamander;
    Goliathkikker;
    Afrikaanse brulkikker;
    Roodoogmakikikker;
    Melkkikker;
    Verfkikkertje;
    Gouden gifkikker;
    Aardbeigifkikker;
    Geelbandgifkikker;
    Groen-zwarte gifkikker;
    Gouden mantella;
    Tomaatkikker;
    Surinaamse pad
  `, [3]);

  // ============================================================
  // VRAAG 5: AFRIKA
  // ============================================================

  koppelDieren(`
    Panterkameleon;
    Senegalese kameleon;
    Afrikaanse kameleon;
    Flapnekkameleon;
    Jacksonkameleon;
    Mellers kameleon;
    Reuzenkameleon;
    Tapijtkameleon;
    Parsonskameleon;
    Kaapse dwergkameleon;
    Brookesia micra;
    Brookesia nana;
    Brookesia minima;
    Afrikaanse dikstaartgekko;
    Madagaskardaggekko;
    Grote madagaskardaggekko;
    Goudstofdaggekko;
    Bladstaartgekko;
    Satanische bladstaartgekko;
    Afrikaanse huisgekko;
    Webvoetgekko;
    Nijlvaraan;
    Savannevaraan;
    Witkeelvaraan;
    Woestijnvaraan;
    Gewone agama;
    Mwanza-agaam;
    Vuurskink;
    Afrikaanse vijfstreepskink;
    Regenboogskink;
    Gordelstaarthagedis;
    Armadillohagedis;
    Reuzengordelstaarthagedis;
    Afrikaanse klauwkikker;
    Dwergklauwkikker;
    Afrikaanse brulkikker;
    Goliathkikker;
    Gouden mantella;
    Groene mantella;
    Tomaatkikker;
    Woestijnregenkikker;
    Zwarte regenkikker;
    Afrikaanse schuimnestkikker;
    Afrikaanse tijgerkikker;
    Egyptische pad;
    Afrikaanse rode pad;
    Nijlkrokodil;
    West-Afrikaanse krokodil;
    Dwergkrokodil
  `, [5]);

  // ============================================================
  // VRAAG 6 EN 12: BOS EN TROPISCH REGENWOUD
  // ============================================================

  koppelDieren(`
    Groene boompython;
    Regenboogboa;
    Smaragdboa;
    Amazoneboomboa;
    Koningscobra;
    Groene bosadder;
    Harige bosadder;
    Wimperadder;
    Groene palmadder;
    Mangroveslang;
    Groene wijnslang;
    Paradijsslang;
    Groene leguaan;
    Groene boomvaraan;
    Blauwe boomvaraan;
    Zwarte boomvaraan;
    Krokodilvaraan;
    Panterkameleon;
    Parsonskameleon;
    Bladstaartgekko;
    Satanische bladstaartgekko;
    Tokkeh;
    Vliegende draak;
    Groene anolis;
    Ridderanolis;
    Groene basilisk;
    Grijpstaartskink;
    Roodoogmakikikker;
    Melkkikker;
    Glaskikker;
    Waskikker;
    Reuzenmakikikker;
    Verfkikkertje;
    Gouden gifkikker;
    Aardbeigifkikker;
    Geelbandgifkikker;
    Groen-zwarte gifkikker;
    Wallaces vliegende kikker;
    Moskikker
  `, [12]);

  koppelDieren(`
    Groene boompython;
    Groene bosadder;
    Groene palmadder;
    Bosratelslang;
    Esculaapslang;
    Vuursalamander;
    Rode salamander;
    Gevlekte salamander;
    Noordelijke rode rugsalamander;
    Boomsalamander;
    Europese boomkikker;
    Noord-Amerikaanse boskikker;
    Bruine kikker;
    Groene hagedis;
    Hazelworm
  `, [6]);

  // ============================================================
  // VRAAG 16: PLANTENETERS
  // ============================================================

  koppelDieren(`
    Groene leguaan;
    Blauwe leguaan;
    Neushoornleguaan;
    Cubaanse rotsleguaan;
    Jamaicaanse leguaan;
    Galapagoslandleguaan;
    Santa-Fe-landleguaan;
    Roze landleguaan;
    Zeeleguaan;
    Woestijnleguaan;
    Chuckwalla;
    Reuzenchuckwalla;
    Stekelstaartagaam;
    Egyptische stekelstaartagaam;
    Marokkaanse stekelstaartagaam;
    Geyrs stekelstaartagaam;
    Bonte stekelstaartagaam;
    Grijpstaartskink;
    Varanus olivaceus;
    Varanus bitatawa;
    Groene zeeschildpad
  `, [16]);

  // ============================================================
  // VRAAG 23: AUSTRALIË
  // ============================================================

  koppelDieren(`
    Inlandtaipan;
    Kusttaipan;
    Centrale taipan;
    Oostelijke bruine slang;
    Westelijke bruine slang;
    Mulgaslang;
    Roodbuikzwarte slang;
    Blauwbuikzwarte slang;
    Tijgerslang;
    Gewone doodsadder;
    Woestijndoodsadder;
    Noordelijke doodsadder;
    Woma-python;
    Zwartkoppython;
    Tapijtpython;
    Diamantpython;
    Australische amethistpython;
    Olijfpython;
    Waterpython;
    Dwergpython;
    Kinderpython;
    Baardagaam;
    Dwergbaardagaam;
    Kraaghagedis;
    Doornduivel;
    Perentie;
    Zandvaraan;
    Bonte varaan;
    Oostelijke blauwtongskink;
    Dennenappelskink;
    Australische dikstaartgekko;
    Gladde knobbelstaartgekko;
    Ruwe knobbelstaartgekko;
    Bynoes gekko;
    Gouden staartgekko;
    Stekelstaartgekko;
    Australische groene boomkikker;
    Australische reuzenboomkikker;
    Bruine boomkikker;
    Perons boomkikker;
    Australische waterhoudende kikker;
    Schildkikker;
    Kruiskikker;
    Australische zoetwaterkrokodil;
    Zeekrokodil;
    Australische slangenhalsschildpad;
    Platrugzeeschildpad
  `, [23]);

  // ============================================================
  // VRAAG 25: WOESTIJNDIEREN
  // ============================================================

  koppelDieren(`
    Hoornadder;
    Sahara-zandadder;
    Arabische hoornadder;
    Dwergpofadder;
    Sidewinder;
    Mojaveratelslang;
    Texaanse ratelslang;
    Inlandtaipan;
    Woestijndoodsadder;
    Woma-python;
    Zwartkoppython;
    Keniaanse zandboa;
    Indische zandboa;
    Woestijnvaraan;
    Perentie;
    Zandvaraan;
    Doornduivel;
    Woestijnleguaan;
    Chuckwalla;
    Gilamonster;
    Egyptische stekelstaartagaam;
    Marokkaanse stekelstaartagaam;
    Geyrs stekelstaartagaam;
    Zandvis;
    Oostelijke zandvis;
    Webvoetgekko;
    Woestijngekko;
    Texaanse hoornhagedis;
    Woestijnhoornhagedis;
    Koninklijke hoornhagedis;
    Woestijnschildpad;
    Sonorawoestijnschildpad;
    Egyptische landschildpad;
    Woestijnregenkikker;
    Australische waterhoudende kikker
  `, [25]);

  // ============================================================
  // VRAAG 26: NEDERLAND
  // ============================================================

  koppelDieren(`
    Ringslang;
    Westelijke ringslang;
    Gladde slang;
    Gewone adder;
    Zandhagedis;
    Levendbarende hagedis;
    Muurhagedis;
    Hazelworm;
    Bruine kikker;
    Groene kikker;
    Meerkikker;
    Poelkikker;
    Bastaardkikker;
    Heikikker;
    Europese boomkikker;
    Gewone pad;
    Rugstreeppad;
    Knoflookpad;
    Vroedmeesterpad;
    Geelbuikvuurpad;
    Kleine watersalamander;
    Vinpootsalamander;
    Alpenwatersalamander;
    Kamsalamander;
    Vuursalamander
  `, [26]);

  // ============================================================
  // VRAAG 28: WINTERSLAAP EN WINTERRUST
  // ============================================================

  koppelDieren(`
    Ringslang;
    Westelijke ringslang;
    Gladde slang;
    Gewone adder;
    Zandhagedis;
    Levendbarende hagedis;
    Muurhagedis;
    Hazelworm;
    Griekse landschildpad;
    Russische vierteenschildpad;
    Moorse landschildpad;
    Europese moerasschildpad;
    Bruine kikker;
    Heikikker;
    Europese boomkikker;
    Gewone pad;
    Rugstreeppad;
    Knoflookpad;
    Vroedmeesterpad;
    Kleine watersalamander;
    Alpenwatersalamander;
    Kamsalamander;
    Vuursalamander
  `, [28]);

  // Bij reptielen heet deze toestand nauwkeuriger
  // winterrust of brumatie.
  // Voor QuizBallon accepteren we deze ook.

  // ============================================================
  // VRAAG 30: LANGZAME DIEREN
  // ============================================================

  koppelDieren(`
    Landschildpad;
    Griekse landschildpad;
    Moorse landschildpad;
    Russische vierteenschildpad;
    Breedrandschildpad;
    Luipaardschildpad;
    Sporenschildpad;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Roodvoetschildpad;
    Geelvoetschildpad;
    Kameleon;
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Parsonskameleon;
    Dwergkameleon
  `, [30]);

  // ============================================================
  // VRAAG 42: KLEURVERANDERING
  // ============================================================

  koppelDieren(`
    Kameleon;
    Panterkameleon;
    Jemenkameleon;
    Gewone kameleon;
    Afrikaanse kameleon;
    Jacksonkameleon;
    Mellers kameleon;
    Vierhoornkameleon;
    Parsonskameleon;
    Tapijtkameleon;
    Reuzenkameleon;
    Kaapse dwergkameleon;
    Groene anolis;
    Bruine anolis;
    Ridderanolis;
    Grijze boomkikker;
    Copes grijze boomkikker;
    Gewone octopus;
    Reuzenoctopus;
    Mimic octopus;
    Kokosnootoctopus;
    Zeekat;
    Reuzenzeekat;
    Flamboyante zeekat;
    Tarbot;
    Schol;
    Bot;
    Pauwbot;
    Luipaardbot
  `, [42]);

  // ============================================================
  // VRAAG 44: DIEREN DIE OUD KUNNEN WORDEN
  // ============================================================

  koppelDieren(`
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Sporenschildpad;
    Griekse landschildpad;
    Moorse landschildpad;
    Stralenschildpad;
    Brughagedis;
    Chinese reuzensalamander;
    Japanse reuzensalamander;
    Olm;
    Zeekrokodil;
    Nijlkrokodil;
    Groenlandse haai;
    Groenlandse walvis;
    Noordkromp;
    Reuzendoopvontschelp;
    Olifant;
    Afrikaanse savanneolifant;
    Aziatische olifant
  `, [44]);

  // ============================================================
  // VRAAG 45: GIFTIGE DIEREN
  // ============================================================

  koppelDieren(`
    Koraalduivel;
    Rode koraalduivel;
    Gewone koraalduivel;
    Steenvis;
    Rifsteenvis;
    Estuariumsteenvis;
    Pieterman;
    Kleine pieterman;
    Blauwringoctopus;
    Grote blauwringoctopus;
    Zuidelijke blauwringoctopus;
    Geografische kegelslak;
    Textielkegelslak;
    Marmerkegelslak;
    Zeewesp;
    Irukandjikwal;
    Portugees oorlogsschip;
    Dooskwal;
    Bloemzee-egel;
    Vuurzee-egel;
    Kogelvis;
    Japanse kogelvis;
    Sterrenkogelvis;
    Zeeslang;
    Geelbuikzeeslang;
    Olijfzeeslang;
    Gebande zeekrait;
    Duboiszeeslang;
    Vogelbekdier;
    Plompe lori;
    Grote plompe lori;
    Kleine plompe lori;
    Bij;
    Honingbij;
    Wesp;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Aziatische hoornaar;
    Aziatische reuzenhoornaar
  `, [45]);

  // ============================================================
  // VRAAG 47: OPVALLENDE KLEUREN
  // ============================================================

  koppelDieren(`
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Tapijtkameleon;
    Grote madagaskardaggekko;
    Goudstofdaggekko;
    Williams dwerggekko;
    Neondaggekko;
    Tokkeh;
    Luipaardgekko;
    Vuurskink;
    Regenboogskink;
    Groene boomvaraan;
    Blauwe boomvaraan;
    Gele boomvaraan;
    Blauwe leguaan;
    Groene leguaan;
    Fiji-bandleguaan;
    Groene basilisk;
    Mwanza-agaam;
    Bonte stekelstaartagaam;
    Smaragdboa;
    Groene boompython;
    Regenboogboa;
    Gouden lanspuntslang;
    Blauwe bamboeadder;
    Rode spugende cobra;
    Blauwe Maleise koraalslang;
    Verfkikkertje;
    Gouden gifkikker;
    Aardbeigifkikker;
    Harlekijngifkikker;
    Geelbandgifkikker;
    Groen-zwarte gifkikker;
    Gouden mantella;
    Groene mantella;
    Tomaatkikker;
    Roodoogmakikikker;
    Vuursalamander
  `, [47]);

  // ============================================================
  // VRAAG 48: STREPEN
  // ============================================================

  koppelDieren(`
    Gebande krait;
    Veelbandkrait;
    Zebrabrilslang;
    Gebande zeekrait;
    Tijgerratelslang;
    Tijgerslang;
    Vierstreepslang;
    Oostelijke koraalslang;
    Texaanse koraalslang;
    Arizonakoraalslang;
    Melkslang;
    Californische koningsslang;
    Mandarijnrattenslang;
    Gebande vliegende slang;
    Mangroveslang;
    Fiji-bandleguaan;
    Lau-bandleguaan;
    Vijfstreepskink;
    Afrikaanse vijfstreepskink;
    Gestreepte regenboogskink;
    Langstaarthagedis;
    Zesstreepracerunner;
    Geelbandgifkikker;
    Gestreepte gifkikker;
    Gestreepte tijgersalamander;
    Noordelijke rode rugsalamander
  `, [48]);

  // ============================================================
  // VRAAG 49: STIPPEN EN VLEKKEN
  // ============================================================

  koppelDieren(`
    Luipaardgekko;
    Tokkeh;
    Goudstofdaggekko;
    Pauwoogdaggekko;
    Gevlekte python;
    Gevlekte ringslang;
    Gevlekte ratelslang;
    Diamantratelslang;
    Texaanse ratelslang;
    Rattenslang;
    Korenslang;
    Luipaardslang;
    Gabonadder;
    Bonte varaan;
    Stekelstaartvaraan;
    Pauwoogvaraan;
    Luipaardhagedis;
    Halsbandleguaan;
    Gilamonster;
    Luipaardschildpad;
    Gespikkelde padloper;
    Druppelschildpad;
    Zwarte vijverschildpad;
    Geelgevlekte rivierschildpad;
    Groen-zwarte gifkikker;
    Verfkikkertje;
    Aardbeigifkikker;
    Excidobates mysteriosus;
    Luipaardkikker;
    Noordelijke luipaardkikker;
    Zuidelijke luipaardkikker;
    Pickerelkikker;
    Roodgevlekte pad;
    Vuursalamander;
    Gevlekte salamander;
    Blauwvleksalamander;
    Ringsalamander;
    Kamsalamander
  `, [49]);

  // De algemene rattenslang heeft niet noodzakelijk
  // een gevlekt patroon.

  verwijderKoppeling("Rattenslang", [49]);

  // ============================================================
  // CORRECTIES OP EERDERE DELEN
  // ============================================================

  // Een schorpioen baart levende jongen.

  verwijderKoppeling("Schorpioen", [7]);

  // Niet iedere reptielensoort legt eieren.
  // Daarom geen automatische koppeling van
  // alle reptielen aan vraag 7.

  verwijderKoppeling("Levendbarende hagedis", [7]);
  verwijderKoppeling("Gewone adder", [7]);
  verwijderKoppeling("Boa constrictor", [7]);
  verwijderKoppeling("Groene anaconda", [7]);
  verwijderKoppeling("Gele anaconda", [7]);
  verwijderKoppeling("Jacksonkameleon", [7]);
  verwijderKoppeling("Alpensalamander", [7]);

  // Volwassen kikkers en padden hebben geen staart.

  verwijderKoppeling("Kikker", [18]);
  verwijderKoppeling("Pad", [18]);

  // De staartkikkers hebben een afwijkende anatomie.
  // Hun zogenaamde staart is geen echte staart.

  verwijderKoppeling("Tailed frog", [18]);
  verwijderKoppeling("Rocky Mountain-tailed frog", [18]);

  // Een aantal eerder gebruikte synoniemen is dubbel.

  samenvoegen(
    "Oostelijke rattenslang",
    "Zwarte rattenslang"
  );

  samenvoegen(
    "Gouden gifkikker",
    "Phyllobates terribilis"
  );

  samenvoegen(
    "Roodoogmakikikker",
    "Agalychnis callidryas"
  );

  samenvoegen(
    "Vuursalamander",
    "Salamandra salamandra"
  );

  samenvoegen(
    "Reuzenpanda",
    "Panda"
  );

  // ============================================================
  // DUBBELZINNIGE DIERNAMEN HERSTELLEN
  // ============================================================

  // Bruine beer kan zowel een zoogdier als
  // een nachtvlinder aanduiden.
  // Deze records moeten gescheiden blijven.

  verwijderDier("Bruine beer");

  dier("Bruine beer (zoogdier)", [
    3, 4, 6, 9, 14, 17, 18,
    20, 24, 28, 50
  ], [
    "Bruine beer",
    "Ursus arctos"
  ]);

  dier("Bruine beer (nachtvlinder)", [
    2, 7, 27, 50
  ], [
    "Bruine beer",
    "Diaphora mendica"
  ]);

  // Wetenschappelijke namen van de nachtvlinder
  // worden niet aan het zoogdier gekoppeld.

  // Nonnetje heeft in deel 5 al twee afzonderlijke
  // records gekregen. Die blijven behouden.

  // ============================================================
  // TUSSENTIJDSE CONTROLE DEEL 6
  // ============================================================

  const samengevoegdDeel6 =
    controleerDubbeleDieren();

  console.log(
    "QuizBallon V9 - deel 6 - samengevoegde dieren:",
    samengevoegdDeel6
  );

  console.log(
    "QuizBallon V9 - totaal opgeslagen dierrecords:",
    database.size
  );

  console.table(
    vragen.map((tekst, index) => {
      const aantal = aantalAntwoorden(index + 1);

      return {
        nummer: index + 1,
        vraag: tekst,
        antwoorden: aantal,
        raketten: aantalRaketten(aantal),
        streefaantal: 1000,
        ontbrekend: Math.max(0, 1000 - aantal),
        doelBereikt: aantal >= 1000
      };
    })
  );

  // ============================================================
  // EINDE DEEL 6
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 7
  // ONGEWERVELDE LANDDIEREN
  // ============================================================

  function ongewervelden(tekst, extra = []) {
    groep(tekst, [50, ...extra]);
  }

  function spinnen(tekst, extra = []) {
    ongewervelden(tekst, [7, 17, ...extra]);
  }

  function landinsecten(tekst, extra = []) {
    ongewervelden(tekst, [7, ...extra]);
  }

  // ============================================================
  // VOGELSPINNEN
  // ============================================================

  spinnen(`
    Vogelspin=Tarantula;
    Chileense vogelspin=Grammostola rosea;
    Braziliaanse zwarte vogelspin=Grammostola pulchra;
    Chacovogelspin=Grammostola pulchripes;
    Grammostola iheringi;
    Grammostola actaeon;
    Mexicaanse roodknievogelspin=Brachypelma hamorii;
    Brachypelma smithi;
    Mexicaanse roodpootvogelspin=Brachypelma emilia;
    Mexicaanse vuurpootvogelspin=Brachypelma boehmei;
    Brachypelma auratum;
    Brachypelma klaasi;
    Brachypelma baumgarteni;
    Krulhaarvogelspin=Tliltocatl albopilosus;
    Mexicaanse roodbuikvogelspin=Tliltocatl vagans;
    Tliltocatl verdezi;
    Tliltocatl kahlenbergi;
    Tliltocatl schroederi;
    Goliathvogelspin=Theraphosa blondi;
    Theraphosa stirmi;
    Theraphosa apophysis;
    Braziliaanse zalmroze vogelspin=Lasiodora parahybana;
    Lasiodora klugi;
    Lasiodora difficilis;
    Acanthoscurria geniculata;
    Acanthoscurria juruenicola;
    Acanthoscurria musculosa;
    Acanthoscurria natalensis;
    Nhandu chromatus;
    Nhandu coloratovillosus;
    Nhandu tripepii;
    Nhandu carapoensis;
    Chromatopelma cyaneopubescens;
    Blauwe kobaltvogelspin=Cyriopagopus lividus;
    Cyriopagopus minax;
    Cyriopagopus schmidti;
    Cyriopagopus albostriatus;
    Cyriopagopus hainanus;
    Cyriopagopus longipes;
    Oranje bavianenspin=Pterinochilus murinus;
    Pterinochilus chordatus;
    Pterinochilus lugardi;
    Pterinochilus vorax;
    Harpactira pulchripes;
    Harpactira cafreriana;
    Harpactira atra;
    Harpactira dictator;
    Harpactira marksi;
    Koningsbavianenspin=Pelinobius muticus;
    Hysterocrates gigas;
    Hysterocrates hercules;
    Hysterocrates crassipes;
    Monocentropus balfouri;
    Ceratogyrus darlingi;
    Ceratogyrus marshalli;
    Ceratogyrus brachycephalus;
    Ceratogyrus meridionalis;
    Poecilotheria regalis;
    Poecilotheria metallica;
    Poecilotheria ornata;
    Poecilotheria fasciata;
    Poecilotheria rufilata;
    Poecilotheria striata;
    Poecilotheria miranda;
    Poecilotheria formosa;
    Poecilotheria subfusca;
    Poecilotheria tigrinawesseli;
    Poecilotheria vittata;
    Avicularia avicularia;
    Avicularia juruensis;
    Avicularia purpurea;
    Avicularia minatrix;
    Caribena versicolor;
    Caribena laeta;
    Ybyrapora diversipes;
    Ybyrapora sooretama;
    Ybyrapora gamba;
    Psalmopoeus irminia;
    Psalmopoeus cambridgei;
    Psalmopoeus pulcher;
    Psalmopoeus reduncus;
    Tapinauchenius violaceus;
    Tapinauchenius plumipes;
    Tapinauchenius rasti;
    Hapalopus formosus;
    Cyriocosmus elegans;
    Cyriocosmus leetzi;
    Cyriocosmus perezmilesi;
    Davus pentaloris;
    Davus fasciatus;
    Dolichothele diamantinensis;
    Dolichothele exilis;
    Kochiana brunnipes;
    Plesiopelma longisternale;
    Homoeomma chilensis;
    Eupalaestrus campestratus;
    Chilobrachys fimbriatus;
    Chilobrachys huahini;
    Chilobrachys dyscolus;
    Chilobrachys natanicharum;
    Omothymus violaceopes;
    Omothymus schioedtei;
    Lampropelma nigerrimum;
    Phormingochilus arboricola;
    Phormingochilus everetti;
    Selenocosmia crassipes;
    Selenocosmia javanensis;
    Selenocosmia stirlingi
  `, [15]);

  koppelDieren(`
    Oranje bavianenspin;
    Pterinochilus chordatus;
    Pterinochilus lugardi;
    Pterinochilus vorax;
    Harpactira pulchripes;
    Harpactira cafreriana;
    Harpactira atra;
    Koningsbavianenspin;
    Hysterocrates gigas;
    Ceratogyrus darlingi;
    Ceratogyrus marshalli
  `, [5]);

  koppelDieren(`
    Poecilotheria regalis;
    Poecilotheria metallica;
    Poecilotheria ornata;
    Poecilotheria fasciata;
    Avicularia avicularia;
    Avicularia purpurea;
    Caribena versicolor;
    Caribena laeta;
    Psalmopoeus irminia;
    Psalmopoeus cambridgei;
    Tapinauchenius violaceus;
    Omothymus violaceopes;
    Lampropelma nigerrimum
  `, [31, 35]);

  koppelDieren(`
    Koningsbavianenspin;
    Blauwe kobaltvogelspin;
    Hysterocrates gigas;
    Cyriopagopus minax;
    Chilobrachys fimbriatus;
    Chilobrachys huahini
  `, [32]);

  koppelDieren(`
    Mexicaanse roodknievogelspin;
    Mexicaanse roodpootvogelspin;
    Mexicaanse vuurpootvogelspin;
    Chromatopelma cyaneopubescens;
    Blauwe kobaltvogelspin;
    Caribena versicolor;
    Poecilotheria metallica;
    Harpactira pulchripes;
    Dolichothele diamantinensis
  `, [47]);

  // ============================================================
  // WIELWEBSPINNEN
  // ============================================================

  spinnen(`
    Wielwebspin;
    Kruisspin=Araneus diadematus;
    Viervlekwielwebspin=Araneus quadratus;
    Marmerspin=Araneus marmoreus;
    Bonte wielwebspin=Araneus alsine;
    Hoekige wielwebspin=Araneus angulatus;
    Araneus nordmanni;
    Araneus saevus;
    Araneus bicentenarius;
    Wespspin=Tijgerspin=Argiope bruennichi;
    Zilverargiope=Argiope argentata;
    Gele tuinspin=Argiope aurantia;
    Gebande argiope=Argiope trifasciata;
    Argiope lobata;
    Argiope aemula;
    Argiope appensa;
    Argiope anasuja;
    Argiope pulchella;
    Argiope keyserlingi;
    Argiope mascordi;
    Brugspin=Larinioides sclopetarius;
    Rietkruisspin=Larinioides cornutus;
    Larinioides patagiatus;
    Venstersectorspin=Zygiella x-notata;
    Strooiselsectorspin=Zygiella atrica;
    Platte wielwebspin=Nuctenea umbratica;
    Komkommerspin=Araniella cucurbitina;
    Araniella opisthographa;
    Araniella displicata;
    Araniella alpica;
    Mangora acalypha;
    Aculepeira ceropegia;
    Cyclosa conica;
    Cyclosa insulana;
    Cyclosa turbinata;
    Gibbaranea gibbosa;
    Gibbaranea bituberculata;
    Gibbaranea omoeda;
    Cercidia prominens;
    Singa hamata;
    Hypsosinga pygmaea;
    Hypsosinga sanguinea;
    Neoscona crucifera;
    Neoscona domiciliorum;
    Neoscona adianta;
    Neoscona nautica;
    Neoscona theisi;
    Gouden wielwebspin;
    Trichonephila clavipes;
    Trichonephila pilipes;
    Trichonephila edulis;
    Trichonephila plumipes;
    Trichonephila inaurata;
    Trichonephila fenestrata;
    Jorospin=Trichonephila clavata;
    Stekelspin;
    Gasteracantha cancriformis;
    Gasteracantha kuhli;
    Gasteracantha geminata;
    Gasteracantha hasselti;
    Gasteracantha mammosa;
    Macracantha arcuata;
    Micrathena gracilis;
    Micrathena sagittata;
    Micrathena schreibersi;
    Micrathena sexspinosa;
    Verrucosa arenata
  `, [15]);

  // ============================================================
  // LANGKAAKSPINNEN
  // ============================================================

  spinnen(`
    Strekspin;
    Gewone strekspin=Tetragnatha extensa;
    Tetragnatha montana;
    Tetragnatha nigrita;
    Tetragnatha obtusa;
    Tetragnatha pinicola;
    Tetragnatha striata;
    Tetragnatha laboriosa;
    Tetragnatha versicolor;
    Tetragnatha elongata;
    Herfstspin=Metellina segmentata;
    Zomerherfstspin=Metellina mengei;
    Metellina merianae;
    Holenwielwebspin=Meta menardi;
    Meta bourneti;
    Pachygnatha clercki;
    Pachygnatha degeeri;
    Pachygnatha listeri;
    Leucauge venusta;
    Leucauge argyra;
    Leucauge decorata;
    Leucauge blanda
  `, [15]);

  // ============================================================
  // SPRINGSPINNEN
  // ============================================================

  spinnen(`
    Springspin;
    Huiszebraspin=Salticus scenicus;
    Salticus cingulatus;
    Salticus zebraneus;
    Schorsmarpissa=Marpissa muscosa;
    Marpissa radiata;
    Marpissa nivoyi;
    Evarcha falcata;
    Evarcha arcuata;
    Evarcha laetabunda;
    Heliophanus cupreus;
    Heliophanus flavipes;
    Heliophanus auratus;
    Heliophanus dampfi;
    Heliophanus tribulosus;
    Euophrys frontalis;
    Euophrys herbigrada;
    Pseudeuophrys lanigera;
    Pseudeuophrys erratica;
    Sitticus terebratus;
    Attulus floricola;
    Attulus pubescens;
    Attulus saltator;
    Attulus distinguendus;
    Aelurillus v-insignitus;
    Phlegra fasciata;
    Asianellus festivus;
    Dendryphantes rudis;
    Dendryphantes hastatus;
    Bianor aurocinctus;
    Ballus chalybeius;
    Synageles venator;
    Mierenspringspin=Myrmarachne formicaria;
    Myrmaplata plataleoides;
    Myrmarachne melanocephala;
    Phidippus audax;
    Phidippus regius;
    Phidippus clarus;
    Phidippus johnsoni;
    Phidippus apacheanus;
    Phidippus cardinalis;
    Phidippus mystaceus;
    Phidippus putnami;
    Phidippus otiosus;
    Phidippus princeps;
    Phidippus purpuratus;
    Phidippus whitmani;
    Hyllus diardi;
    Hyllus giganteus;
    Hyllus semicupreus;
    Plexippus paykulli;
    Plexippus petersi;
    Menemerus semilimbatus;
    Menemerus bivittatus;
    Hasarius adansoni;
    Heteropoda venatoria;
    Portia fimbriata;
    Portia labiata;
    Portia africana;
    Portia schultzi;
    Spartaeus spinimanus;
    Cosmophasis umbratica;
    Siler semiglaucus;
    Siler cupreus;
    Siler collingwoodi;
    Thiania bhamoensis;
    Thiania suboppressa;
    Telamonia dimidiata;
    Pauwspin=Peacock spider;
    Maratus volans;
    Maratus speciosus;
    Maratus splendens;
    Maratus personatus;
    Maratus pardus;
    Maratus elephans;
    Maratus jactatus;
    Maratus sceletus;
    Maratus vespa;
    Maratus madelineae;
    Maratus sarahae;
    Maratus anomalus;
    Maratus mungaich;
    Maratus pavonis;
    Maratus nigromaculatus;
    Maratus chrysomelas;
    Maratus fimbriatus;
    Maratus harrisi;
    Maratus avibus;
    Maratus aquilus;
    Maratus caeruleus;
    Maratus karrie;
    Maratus linnaei;
    Maratus lobatus;
    Maratus nemo;
    Maratus tasmanicus;
    Maratus unicup;
    Maratus rainbowi
  `, [15, 34]);

  // Heteropoda venatoria is geen springspin.

  verwijderKoppeling(
    "Heteropoda venatoria",
    [34]
  );

  koppelDieren(`
    Pauwspin;
    Maratus volans;
    Maratus speciosus;
    Maratus splendens;
    Maratus personatus;
    Maratus pardus;
    Maratus elephans;
    Maratus jactatus;
    Maratus sceletus;
    Maratus vespa;
    Maratus madelineae;
    Maratus sarahae;
    Maratus anomalus;
    Maratus mungaich;
    Maratus pavonis;
    Maratus nigromaculatus;
    Maratus chrysomelas;
    Maratus fimbriatus;
    Maratus harrisi;
    Maratus avibus;
    Maratus aquilus;
    Maratus caeruleus;
    Maratus karrie;
    Maratus linnaei;
    Maratus lobatus;
    Maratus nemo;
    Maratus tasmanicus;
    Maratus unicup;
    Maratus rainbowi
  `, [10, 23, 47]);

  // ============================================================
  // WOLFSPINNEN
  // ============================================================

  spinnen(`
    Wolfspin;
    Gewone wolfspin=Pardosa amentata;
    Pardosa agrestis;
    Pardosa agricola;
    Pardosa lugubris;
    Pardosa palustris;
    Pardosa pullata;
    Pardosa prativaga;
    Pardosa monticola;
    Pardosa nigriceps;
    Pardosa hortensis;
    Pardosa saltans;
    Pardosa bifasciata;
    Pardosa riparia;
    Pardosa sphagnicola;
    Pardosa fulvipes;
    Pardosa proxima;
    Pardosa purbeckensis;
    Pardosa tenuipes;
    Alopecosa pulverulenta;
    Alopecosa cuneata;
    Alopecosa accentuata;
    Alopecosa fabrilis;
    Alopecosa trabalis;
    Alopecosa barbipes;
    Alopecosa inquilina;
    Alopecosa taeniata;
    Trochosa terricola;
    Trochosa ruricola;
    Trochosa robusta;
    Trochosa spinipalpis;
    Arctosa perita;
    Arctosa cinerea;
    Arctosa leopardus;
    Arctosa lutetiana;
    Arctosa figurata;
    Pirata piraticus;
    Pirata tenuitarsis;
    Piratula hygrophila;
    Piratula latitans;
    Piratula uliginosa;
    Xerolycosa nemoralis;
    Xerolycosa miniata;
    Lycosa tarantula;
    Lycosa singoriensis;
    Hogna radiata;
    Hogna carolinensis;
    Hogna lenta;
    Tigrosa helluo;
    Tigrosa aspersa;
    Rabidosa rabida;
    Rabidosa punctulata;
    Geolycosa missouriensis
  `, [15]);

  // ============================================================
  // KRABSPINNEN
  // ============================================================

  spinnen(`
    Krabspin;
    Gewone kameleonspin=Misumena vatia;
    Thomisus onustus;
    Thomisus spectabilis;
    Thomisus citrinellus;
    Synema globosum;
    Synema ornatum;
    Xysticus cristatus;
    Xysticus kochi;
    Xysticus audax;
    Xysticus ulmi;
    Xysticus lanio;
    Xysticus bifasciatus;
    Xysticus erraticus;
    Xysticus luctuosus;
    Xysticus sabulosus;
    Xysticus striatipes;
    Xysticus acerbus;
    Xysticus ninnii;
    Ozyptila praticola;
    Ozyptila trux;
    Ozyptila simplex;
    Ozyptila atomaria;
    Ozyptila brevipes;
    Ozyptila claveata;
    Ebrechtella tricuspidata;
    Heriaeus hirtus;
    Heriaeus melloteei;
    Diaea dorsata;
    Diaea livens;
    Runcinia grammica;
    Tmarus piger;
    Misumenoides formosipes;
    Mecaphesa asperata;
    Mecaphesa celer;
    Misumenops maculissparsus;
    Philodromus aureolus;
    Philodromus cespitum;
    Philodromus dispar;
    Philodromus rufus;
    Philodromus albidus;
    Philodromus margaritatus;
    Philodromus histrio;
    Thanatus formicinus;
    Thanatus striatus;
    Tibellus oblongus;
    Tibellus maritimus
  `, [15]);

  koppelDieren(`
    Gewone kameleonspin;
    Thomisus onustus
  `, [42]);

  // ============================================================
  // KOGELSPINNEN EN WEDUWESPINNEN
  // ============================================================

  spinnen(`
    Kogelspin;
    Zwarte weduwe;
    Zuidelijke zwarte weduwe=Latrodectus mactans;
    Noordelijke zwarte weduwe=Latrodectus variolus;
    Westelijke zwarte weduwe=Latrodectus hesperus;
    Europese zwarte weduwe=Latrodectus tredecimguttatus;
    Roodrugspin=Latrodectus hasselti;
    Bruine weduwe=Latrodectus geometricus;
    Rode weduwe=Latrodectus bishopi;
    Witte weduwe=Latrodectus pallidus;
    Latrodectus katipo;
    Latrodectus indistinctus;
    Latrodectus renivulvatus;
    Latrodectus mirabilis;
    Latrodectus curacaviensis;
    Latrodectus dahli;
    Valse weduwe=Steatoda nobilis;
    Grote steatoda=Steatoda grossa;
    Huissteatoda=Steatoda bipunctata;
    Steatoda triangulosa;
    Steatoda albomaculata;
    Steatoda paykulliana;
    Steatoda castanea;
    Steatoda capensis;
    Gewone huiskogelspin=Parasteatoda tepidariorum;
    Parasteatoda lunata;
    Parasteatoda simulans;
    Enoplognatha ovata;
    Enoplognatha latimana;
    Enoplognatha thoracica;
    Enoplognatha mordax;
    Theridion varians;
    Theridion mystaceum;
    Theridion pictum;
    Theridion melanurum;
    Theridion pinastri;
    Paidiscura pallens;
    Phylloneta impressa;
    Phylloneta sisyphia;
    Episinus angulatus;
    Episinus truncatus;
    Crustulina guttata;
    Euryopis flavomaculata;
    Dipoena melanogaster;
    Dipoena tristis;
    Argyrodes argyrodes
  `, [15]);

  koppelDieren(`
    Zwarte weduwe;
    Zuidelijke zwarte weduwe;
    Noordelijke zwarte weduwe;
    Westelijke zwarte weduwe;
    Europese zwarte weduwe;
    Roodrugspin;
    Bruine weduwe;
    Rode weduwe;
    Witte weduwe;
    Latrodectus katipo;
    Latrodectus indistinctus;
    Latrodectus renivulvatus;
    Latrodectus mirabilis;
    Latrodectus curacaviensis;
    Latrodectus dahli;
    Valse weduwe;
    Grote steatoda
  `, [45]);

  // ============================================================
  // TRECHTERSPINNEN EN HUISSPINNEN
  // ============================================================

  spinnen(`
    Huisspin;
    Grote huisspin=Eratigena atrica;
    Eratigena duellica;
    Eratigena saeva;
    Eratigena agrestis;
    Gewone huisspin=Tegenaria domestica;
    Tegenaria parietina;
    Tegenaria ferruginea;
    Tegenaria silvestris;
    Tegenaria campestris;
    Tegenaria pagana;
    Gewone doolhofspin=Agelena labyrinthica;
    Allagelena gracilens;
    Textrix denticulata;
    Textrix caudata;
    Agelenopsis aperta;
    Agelenopsis pennsylvanica;
    Agelenopsis naevia;
    Agelenopsis potteri;
    Australische trechterspin;
    Sydneytrechterspin=Atrax robustus;
    Atrax sutherlandi;
    Atrax yorkmainorum;
    Hadronyche formidabilis;
    Hadronyche cerberea;
    Hadronyche infensa;
    Hadronyche versuta;
    Hadronyche valida;
    Hadronyche macquariensis;
    Hadronyche venenata
  `, [15]);

  koppelDieren(`
    Australische trechterspin;
    Sydneytrechterspin;
    Atrax sutherlandi;
    Atrax yorkmainorum;
    Hadronyche formidabilis;
    Hadronyche cerberea;
    Hadronyche infensa;
    Hadronyche versuta;
    Hadronyche valida;
    Hadronyche macquariensis;
    Hadronyche venenata
  `, [23, 45]);

  // ============================================================
  // JACHTSPINNEN
  // ============================================================

  spinnen(`
    Jachtspin;
    Grote gerande oeverspin=Dolomedes plantarius;
    Kleine gerande oeverspin=Dolomedes fimbriatus;
    Dolomedes tenebrosus;
    Dolomedes triton;
    Dolomedes scriptus;
    Dolomedes vittatus;
    Dolomedes albineus;
    Kraamwebspin=Pisaura mirabilis;
    Pisaura novicia;
    Pisaurina mira;
    Pisaurina dubia;
    Heteropoda venatoria;
    Heteropoda maxima;
    Heteropoda davidbowie;
    Heteropoda boiei;
    Heteropoda jugulans;
    Heteropoda tetrica;
    Heteropoda lunula;
    Heteropoda natans;
    Sparassus;
    Olios argelasius;
    Olios giganteus;
    Eusparassus dufouri;
    Eusparassus walckenaeri;
    Micrommata virescens;
    Micrommata ligurina;
    Delena cancerides;
    Holconia immanis;
    Holconia insignis;
    Isopeda vasta;
    Isopedella victorialis;
    Neosparassus diana;
    Palystes superciliosus;
    Palystes castaneus
  `, [15]);

  koppelDieren(`
    Kleine gerande oeverspin;
    Grote gerande oeverspin;
    Dolomedes triton;
    Dolomedes tenebrosus;
    Dolomedes scriptus
  `, [14]);

  // ============================================================
  // ZESOGIGE SPINNEN EN KLUIZENAARSSPINNEN
  // ============================================================

  spinnen(`
    Vioolspin;
    Bruine kluizenaarsspin=Loxosceles reclusa;
    Chileense vioolspin=Loxosceles laeta;
    Mediterrane vioolspin=Loxosceles rufescens;
    Loxosceles intermedia;
    Loxosceles gaucho;
    Loxosceles deserta;
    Loxosceles arizonica;
    Loxosceles boneti;
    Loxosceles hirsuta;
    Zesogige zandspin;
    Sicarius thomisoides;
    Sicarius terrosus;
    Sicarius rugosus;
    Hexophthalma hahni;
    Hexophthalma albospinosa;
    Hexophthalma damarensis
  `, [15, 45]);

  // ============================================================
  // TRILSPINNEN
  // ============================================================

  spinnen(`
    Trilspin;
    Grote trilspin=Pholcus phalangioides;
    Kleine trilspin=Psilochorus simoni;
    Pholcus opilionoides;
    Pholcus manueli;
    Pholcus phalangioides;
    Holocnemus pluchei;
    Smeringopus pallidus;
    Crossopriza lyoni;
    Physocyclus globosus;
    Artema atlanta;
    Spermophora senoculata
  `, [15]);

  // ============================================================
  // OVERIGE SPINNEN
  // ============================================================

  spinnen(`
    Kaardespin;
    Gewone kaardespin=Amaurobius fenestralis;
    Amaurobius similis;
    Amaurobius ferox;
    Callobius claustrarius;
    Dictyna arundinacea;
    Dictyna uncinata;
    Nigma walckenaeri;
    Nigma flavescens;
    Lathys humilis;
    Cicurina cicur;
    Bodemspin;
    Drassodes lapidosus;
    Drassodes cupreus;
    Drassodes pubescens;
    Drassyllus pusillus;
    Drassyllus praeficus;
    Drassyllus lutetianus;
    Haplodrassus signifer;
    Haplodrassus silvestris;
    Haplodrassus dalmatensis;
    Gnaphosa lucifuga;
    Gnaphosa bicolor;
    Gnaphosa nigerrima;
    Zelotes subterraneus;
    Zelotes latreillei;
    Zelotes electus;
    Zelotes longipes;
    Trachyzelotes pedestris;
    Scotophaeus blackwalli;
    Scotophaeus scutulatus;
    Micaria pulicaria;
    Micaria fulgens;
    Micaria formicaria;
    Clubiona phragmitis;
    Clubiona pallidula;
    Clubiona terrestris;
    Clubiona lutescens;
    Clubiona neglecta;
    Clubiona reclusa;
    Clubiona corticalis;
    Clubiona compta;
    Clubiona stagnatilis;
    Spoorspin=Cheiracanthium punctorium;
    Cheiracanthium mildei;
    Cheiracanthium erraticum;
    Cheiracanthium virescens;
    Cheiracanthium campestre;
    Cheiracanthium inclusum;
    Pissebeddenjager=Dysdera crocata;
    Dysdera erythrina;
    Harpactea hombergi;
    Harpactea rubicunda;
    Segestria senoculata;
    Segestria florentina;
    Segestria bavarica;
    Lieveheersbeestjesspin=Eresus;
    Eresus kollari;
    Eresus sandaliatus;
    Eresus moravicus;
    Stegodyphus lineatus;
    Stegodyphus dumicola;
    Stegodyphus mimosarum;
    Oecobius navus;
    Oecobius maculatus;
    Scytodes thoracica;
    Scytodes globula;
    Scytodes fusca;
    Zodarion rubidum;
    Zodarion italicum;
    Zodarion germanicum;
    Uloborus plumipes;
    Uloborus walckenaerius;
    Hyptiotes paradoxus;
    Deinopis spinosa;
    Deinopis subrufa;
    Miagrammopes animotus;
    Trapdoorspin;
    Cteniza sauvagesi;
    Ummidia audouini;
    Ummidia carabivora;
    Idiops;
    Actinopus;
    Muisspin;
    Missulena occatoria;
    Missulena bradleyi;
    Missulena granulosa;
    Missulena dipsaca;
    Braziliaanse zwerfspin=Phoneutria nigriventer;
    Phoneutria fera;
    Phoneutria boliviensis;
    Phoneutria keyserlingi;
    Phoneutria reidyi;
    Ctenus;
    Cupiennius salei;
    Cupiennius getazi;
    Cupiennius coccineus
  `);

  koppelDieren(`
    Braziliaanse zwerfspin;
    Phoneutria fera;
    Phoneutria boliviensis;
    Phoneutria keyserlingi;
    Phoneutria reidyi;
    Missulena occatoria;
    Missulena bradleyi
  `, [45]);

  koppelDieren(`
    Trapdoorspin;
    Cteniza sauvagesi;
    Ummidia audouini;
    Ummidia carabivora;
    Idiops;
    Actinopus;
    Missulena occatoria;
    Missulena bradleyi
  `, [32]);

  // ============================================================
  // KLEINE HANGMATSPINNEN
  // ============================================================

  spinnen(`
    Hangmatspin;
    Linyphia triangularis;
    Linyphia hortensis;
    Neriene radiata;
    Neriene montana;
    Neriene clathrata;
    Neriene peltata;
    Neriene emphana;
    Microlinyphia pusilla;
    Microlinyphia impigra;
    Pityohyphantes phrygianus;
    Drapetisca socialis;
    Floronia bucculenta;
    Bathyphantes gracilis;
    Bathyphantes nigrinus;
    Bathyphantes parvulus;
    Tenuiphantes tenuis;
    Tenuiphantes flavipes;
    Tenuiphantes zimmermanni;
    Tenuiphantes mengei;
    Tenuiphantes alacris;
    Lepthyphantes minutus;
    Microneta viaria;
    Centromerus sylvaticus;
    Centromerus brevivulvatus;
    Centromerus dilutus;
    Gongylidium rufipes;
    Oedothorax fuscus;
    Oedothorax retusus;
    Oedothorax apicatus;
    Erigone atra;
    Erigone dentipalpis;
    Erigone arctica;
    Erigone longipalpis;
    Erigone promiscua;
    Ozyptila brevipes;
    Walckenaeria acuminata;
    Walckenaeria antica;
    Walckenaeria atrotibialis;
    Walckenaeria nudipalpis;
    Walckenaeria cuspidata;
    Dicymbium nigrum;
    Dicymbium tibiale;
    Gnathonarium dentatum;
    Hypomma bituberculatum;
    Hylyphantes graminicola;
    Pocadicnemis pumila;
    Pocadicnemis juncea;
    Savignia frontata;
    Araeoncus humilis;
    Diplocephalus cristatus;
    Diplocephalus picinus;
    Dismodicus bifrons;
    Entelecara acuminata;
    Maso sundevalli;
    Pelecopsis parallela;
    Tapinocyba praecox;
    Troxochrus scabriculus;
    Trichoncoides piscator;
    Tiso vagans
  `, [10]);

  // ============================================================
  // HO O I W A G E N S
  // ============================================================

  ongewervelden(`
    Hooiwagen=Harvestman;
    Gewone hooiwagen=Phalangium opilio;
    Opilio parietinus;
    Opilio canestrinii;
    Opilio saxatilis;
    Leiobunum rotundum;
    Leiobunum blackwalli;
    Leiobunum limbatum;
    Leiobunum rupestre;
    Leiobunum tisciae;
    Mitopus morio;
    Oligolophus tridens;
    Oligolophus hanseni;
    Paroligolophus agrestis;
    Lacinius ephippiatus;
    Lacinius horridus;
    Lophopilio palpinalis;
    Rilaena triangularis;
    Platybunus pinetorum;
    Dicranopalpus ramosus;
    Nelima sempronii;
    Nelima gothica;
    Trogulus tricarinatus;
    Trogulus nepaeformis;
    Nemastoma bimaculatum;
    Nemastoma lugubre;
    Mitostoma chrysomelas;
    Paranemastoma quadripunctatum;
    Ischyropsalis hellwigii;
    Sabacon;
    Sclerosoma;
    Holoscotolemon
  `, [7]);

  // ============================================================
  // SCHORPIOENEN
  // ============================================================

  ongewervelden(`
    Schorpioen=Scorpion;
    Keizerschorpioen=Pandinus imperator;
    Pandinus dictator;
    Pandinopsis dictator;
    Heterometrus spinifer;
    Heterometrus longimanus;
    Heterometrus laoticus;
    Heterometrus petersii;
    Heterometrus swammerdami;
    Heterometrus cyaneus;
    Heterometrus silenus;
    Heterometrus bengalensis;
    Hadrurus arizonensis;
    Hadrurus spadix;
    Hadruroides lunatus;
    Hoffmannihadrurus aztecus;
    Hadogenes troglodytes;
    Hadogenes paucidens;
    Hadogenes bicolor;
    Hadogenes gracilis;
    Opistophthalmus glabrifrons;
    Opistophthalmus carinatus;
    Opistophthalmus capensis;
    Opistophthalmus wahlbergii;
    Scorpio maurus;
    Scorpio palmatus;
    Euscorpius italicus;
    Euscorpius flavicaudis;
    Euscorpius tergestinus;
    Euscorpius carpathicus;
    Alpiscorpius germanus;
    Alpiscorpius alpha;
    Buthus occitanus;
    Buthus ibericus;
    Buthus tunetanus;
    Androctonus australis;
    Androctonus bicolor;
    Androctonus crassicauda;
    Androctonus amoreuxi;
    Androctonus mauritanicus;
    Androctonus liouvillei;
    Leiurus quinquestriatus;
    Leiurus hebraeus;
    Leiurus jordanensis;
    Leiurus arabicus;
    Parabuthus transvaalicus;
    Parabuthus granulatus;
    Parabuthus villosus;
    Parabuthus liosoma;
    Parabuthus raudus;
    Parabuthus pallidus;
    Parabuthus mossambicensis;
    Centruroides sculpturatus;
    Centruroides vittatus;
    Centruroides exilicauda;
    Centruroides gracilis;
    Centruroides hentzi;
    Centruroides limbatus;
    Centruroides margaritatus;
    Centruroides noxius;
    Centruroides suffusus;
    Centruroides infamatus;
    Tityus serrulatus;
    Tityus bahiensis;
    Tityus stigmurus;
    Tityus obscurus;
    Tityus trivittatus;
    Tityus confluens;
    Tityus pachyurus;
    Tityus discrepans;
    Tityus asthenes;
    Tityus fasciolatus;
    Mesobuthus eupeus;
    Mesobuthus gibbosus;
    Olivierus martensii;
    Hottentotta tamulus;
    Hottentotta hottentotta;
    Hottentotta jayakari;
    Hottentotta saulcyi;
    Hottentotta franzwerneri;
    Hottentotta judaicus;
    Grosphus ankarana;
    Grosphus madagascariensis;
    Isometrus maculatus;
    Lychas mucronatus;
    Lychas scutilus;
    Urodacus elongatus;
    Urodacus manicatus;
    Urodacus yaschenkoi;
    Urodacus armatus;
    Cercophonius squama;
    Bothriurus bonariensis;
    Bothriurus burmeisteri;
    Brachistosternus;
    Vaejovis;
    Paravaejovis;
    Smeringurus mesaensis;
    Superstitionia donensis
  `, [15, 17, 27, 45]);

  samenvoegen(
    "Pandinus dictator",
    "Pandinopsis dictator"
  );

  koppelDieren(`
    Hadrurus arizonensis;
    Hadrurus spadix;
    Androctonus australis;
    Androctonus crassicauda;
    Androctonus amoreuxi;
    Leiurus quinquestriatus;
    Leiurus arabicus;
    Parabuthus granulatus;
    Parabuthus villosus;
    Parabuthus raudus;
    Smeringurus mesaensis;
    Scorpio maurus
  `, [25]);

  koppelDieren(`
    Urodacus elongatus;
    Urodacus manicatus;
    Urodacus yaschenkoi;
    Urodacus armatus;
    Cercophonius squama
  `, [23]);

  // ============================================================
  // PSEUDOSCHORPIOENEN
  // ============================================================

  ongewervelden(`
    Pseudoschorpioen;
    Boekenschorpioen=Chelifer cancroides;
    Neobisium carcinoides;
    Neobisium simile;
    Neobisium muscorum;
    Chthonius ischnocheles;
    Chthonius orthodactylus;
    Chthonius tetrachelatus;
    Roncus lubricus;
    Roncus alpinus;
    Chernes cimicoides;
    Chernes hahnii;
    Chernes nigrimanus;
    Dendrochernes cyrneus;
    Dinocheirus panzeri;
    Allochernes wideri;
    Allochernes powelli;
    Lamprochernes nodosus;
    Lamprochernes chyzeri;
    Pselaphochernes scorpioides;
    Atemnus politus;
    Withius piger;
    Garypus beauvoisii;
    Microbisium;
    Mundochthonius
  `, [7, 10, 17]);

  // ============================================================
  // ZWEEPSPINNEN EN ZWEEPSCHORPIOENEN
  // ============================================================

  ongewervelden(`
    Zweepspin;
    Damon diadema;
    Damon variegatus;
    Damon medius;
    Damon annulatipes;
    Phrynus marginemaculatus;
    Phrynus longipes;
    Phrynus whitei;
    Phrynus barbadensis;
    Phrynus parvulus;
    Paraphrynus mexicanus;
    Paraphrynus robustus;
    Heterophrynus batesii;
    Heterophrynus longicornis;
    Charinus;
    Charon grayi;
    Zweepschorpioen;
    Mastigoproctus giganteus;
    Mastigoproctus floridanus;
    Mastigoproctus proscorpio;
    Thelyphonus caudatus;
    Thelyphonus indicus;
    Typopeltis;
    Hypoctonus;
    Schizomida;
    Stenochrus portoricensis
  `, [7, 15, 17, 27]);

  // ============================================================
  // ROLS PINNEN
  // ============================================================

  ongewervelden(`
    Rolspin;
    Kameelspin;
    Zonnespin;
    Galeodes arabs;
    Galeodes granti;
    Galeodes caspius;
    Galeodes dorsalis;
    Galeodes fatalis;
    Rhagodes nigrocinctus;
    Rhagodes;
    Gluvia dorsalis;
    Solpuga;
    Solpugema;
    Metasolpuga picta;
    Eremobates;
    Eremobates pallipes;
    Eremobates mormonus;
    Eremobates durangonus;
    Eremochelis;
    Ammotrecha;
    Ammotrechula;
    Daesiella;
    Gylippus;
    Karschia
  `, [7, 15, 17]);

  samenvoegen("Rolspin", "Kameelspin");
  samenvoegen("Rolspin", "Zonnespin");

  koppelDieren(`
    Galeodes arabs;
    Galeodes granti;
    Eremobates pallipes
  `, [25]);

  // ============================================================
  // TEKEN EN MIJTEN
  // ============================================================

  ongewervelden(`
    Teek=Tick;
    Schapenteek=Ixodes ricinus;
    Ixodes persulcatus;
    Ixodes scapularis;
    Ixodes pacificus;
    Ixodes hexagonus;
    Ixodes canisuga;
    Ixodes frontalis;
    Ixodes uriae;
    Ixodes holocyclus;
    Dermacentor reticulatus;
    Dermacentor marginatus;
    Dermacentor variabilis;
    Dermacentor andersoni;
    Dermacentor albipictus;
    Dermacentor occidentalis;
    Bruine hondenteek=Rhipicephalus sanguineus;
    Rhipicephalus appendiculatus;
    Rhipicephalus microplus;
    Rhipicephalus annulatus;
    Hyalomma marginatum;
    Hyalomma truncatum;
    Hyalomma anatolicum;
    Hyalomma rufipes;
    Amblyomma americanum;
    Amblyomma maculatum;
    Amblyomma variegatum;
    Amblyomma hebraeum;
    Amblyomma cajennense;
    Amblyomma sculptum;
    Haemaphysalis punctata;
    Haemaphysalis longicornis;
    Haemaphysalis concinna;
    Argas reflexus;
    Argas persicus;
    Ornithodoros moubata;
    Ornithodoros hermsi;
    Mijt=Mite;
    Huisstofmijt;
    Dermatophagoides pteronyssinus;
    Dermatophagoides farinae;
    Schurftmijt=Sarcoptes scabiei;
    Oormijt=Otodectes cynotis;
    Haarfollikelmijt=Demodex folliculorum;
    Demodex brevis;
    Demodex canis;
    Demodex cati;
    Meelmijt=Acarus siro;
    Kaasmijt=Tyrolichus casei;
    Tyrophagus putrescentiae;
    Glycyphagus domesticus;
    Vogelmijt=Dermanyssus gallinae;
    Ornithonyssus sylviarum;
    Ornithonyssus bacoti;
    Varroamijt=Varroa destructor;
    Varroa jacobsoni;
    Tropilaelaps mercedesae;
    Spintmijt=Tetranychus urticae;
    Tetranychus evansi;
    Tetranychus cinnabarinus;
    Panonychus ulmi;
    Panonychus citri;
    Eotetranychus;
    Roofmijt;
    Phytoseiulus persimilis;
    Neoseiulus californicus;
    Neoseiulus cucumeris;
    Amblyseius swirskii;
    Amblydromalus limonicus;
    Stratiolaelaps scimitus;
    Macrocheles robustulus;
    Fluweelmijt;
    Trombidium holosericeum;
    Trombidium;
    Trombicula autumnalis;
    Leptotrombidium deliense;
    Galmijt;
    Eriophyes;
    Aceria;
    Aculops lycopersici;
    Oribatida;
    Galumna;
    Oppiella nova;
    Platynothrus peltifer;
    Nothrus;
    Damaeus;
    Pergamasus;
    Parasitus;
    Uropoda;
    Holothyrus
  `, [7, 10]);

  // ============================================================
  // MIEREN
  // ============================================================

  function mieren(tekst, extra = []) {
    landinsecten(tekst, [10, 40, 41, ...extra]);
  }

  mieren(`
    Mier=Ant;
    Zwarte wegmier=Lasius niger;
    Lasius platythorax;
    Gele weidemier=Lasius flavus;
    Bruine wegmier=Lasius brunneus;
    Glanzende houtmier=Lasius fuliginosus;
    Lasius alienus;
    Lasius psammophilus;
    Lasius neglectus;
    Lasius emarginatus;
    Lasius umbratus;
    Lasius mixtus;
    Lasius sabularum;
    Lasius meridionalis;
    Lasius bicornis;
    Lasius citrinus;
    Rode bosmier=Formica rufa;
    Kale bosmier=Formica polyctena;
    Behaarde bosmier;
    Formica pratensis;
    Formica lugubris;
    Formica aquilonia;
    Formica truncorum;
    Formica exsecta;
    Formica pressilabris;
    Formica foreli;
    Formica sanguinea;
    Grauwzwarte mier=Formica fusca;
    Formica cunicularia;
    Formica rufibarbis;
    Formica clara;
    Formica cinerea;
    Formica lemani;
    Formica picea;
    Formica gagates;
    Formica gerardi;
    Formica subsericea;
    Formica glacialis;
    Formica obscuripes;
    Formica integra;
    Formica ulkei;
    Formica montana;
    Gewone steekmier=Myrmica rubra;
    Bossteekmier=Myrmica ruginodis;
    Zandsteekmier=Myrmica sabuleti;
    Myrmica scabrinodis;
    Myrmica schencki;
    Myrmica rugulosa;
    Myrmica specioides;
    Myrmica sulcinodis;
    Myrmica lobulicornis;
    Myrmica lonae;
    Myrmica vandeli;
    Myrmica gallienii;
    Myrmica karavajevi;
    Myrmica microrubra;
    Zwarte zaadmier=Tetramorium caespitum;
    Tetramorium immigrans;
    Tetramorium impurum;
    Tetramorium bicarinatum;
    Tetramorium simillimum;
    Tetramorium caldarium;
    Tetramorium semilaeve;
    Temnothorax nylanderi;
    Temnothorax unifasciatus;
    Temnothorax interruptus;
    Temnothorax albipennis;
    Temnothorax recedens;
    Temnothorax curvispinosus;
    Temnothorax longispinosus;
    Temnothorax rugatulus;
    Leptothorax acervorum;
    Leptothorax muscorum;
    Leptothorax gredleri;
    Gladde slankmier;
    Tapinoma erraticum;
    Tapinoma melanocephalum;
    Tapinoma sessile;
    Tapinoma nigerrimum;
    Tapinoma magnum;
    Tapinoma darioi;
    Argentijnse mier=Linepithema humile;
    Faraomier=Monomorium pharaonis;
    Monomorium minimum;
    Monomorium floricola;
    Monomorium monomorium;
    Monomorium subopacum;
    Monomorium salomonis;
    Solenopsis fugax;
    Rode vuurmier=Solenopsis invicta;
    Zwarte vuurmier=Solenopsis richteri;
    Solenopsis geminata;
    Solenopsis saevissima;
    Solenopsis molesta;
    Kleine vuurmier=Wasmannia auropunctata;
    Pheidole megacephala;
    Pheidole pallidula;
    Pheidole dentata;
    Pheidole noda;
    Pheidole sinica;
    Pheidole indica;
    Pheidole yeensis;
    Pheidole bicarinata;
    Pheidole morrisi;
    Pheidole fervens;
    Reuzenmier;
    Camponotus herculeanus;
    Camponotus ligniperda;
    Camponotus vagus;
    Camponotus fallax;
    Camponotus truncatus;
    Camponotus lateralis;
    Camponotus aethiops;
    Camponotus cruentatus;
    Camponotus piceus;
    Camponotus barbaricus;
    Camponotus sylvaticus;
    Camponotus nicobarensis;
    Camponotus japonicus;
    Camponotus fedtschenkoi;
    Camponotus maculatus;
    Camponotus fellah;
    Camponotus sericeus;
    Camponotus floridanus;
    Camponotus pennsylvanicus;
    Camponotus modoc;
    Camponotus chromaiodes;
    Camponotus castaneus;
    Camponotus discolor;
    Camponotus nearcticus;
    Camponotus vicinus;
    Camponotus americanus;
    Camponotus novogranadensis;
    Camponotus atriceps;
    Camponotus consobrinus;
    Camponotus nigriceps;
    Camponotus intrepidus;
    Camponotus aeneopilosus;
    Camponotus suffusus;
    Camponotus compressus;
    Camponotus singularis;
    Camponotus irritans;
    Camponotus parius;
    Camponotus rufifemur;
    Camponotus saundersi;
    Colobopsis explodens;
    Colobopsis truncata
  `);

  samenvoegen("Rode bosmier", "Behaarde bosmier");

  // ============================================================
  // BLADSNIJDERSMIEREN
  // ============================================================

  mieren(`
    Bladsnijdersmier;
    Atta cephalotes;
    Atta sexdens;
    Atta laevigata;
    Atta mexicana;
    Atta texana;
    Atta colombica;
    Atta capiguara;
    Atta bisphaerica;
    Atta vollenweideri;
    Atta robusta;
    Atta opaciceps;
    Atta insularis;
    Acromyrmex octospinosus;
    Acromyrmex echinatior;
    Acromyrmex subterraneus;
    Acromyrmex lundi;
    Acromyrmex rugosus;
    Acromyrmex crassispinus;
    Acromyrmex heyeri;
    Acromyrmex coronatus;
    Acromyrmex hispidus;
    Acromyrmex aspersus;
    Acromyrmex striatus;
    Trachymyrmex septentrionalis;
    Mycetomoellerius;
    Cyphomyrmex rimosus;
    Cyphomyrmex minutus;
    Apterostigma;
    Mycetarotes;
    Mycocepurus smithii
  `);

  koppelDieren(`
    Bladsnijdersmier;
    Atta cephalotes;
    Atta sexdens;
    Atta laevigata;
    Atta colombica;
    Acromyrmex octospinosus;
    Acromyrmex echinatior
  `, [12, 32]);

  // Bladsnijdersmieren eten voornamelijk
  // de schimmel die zij op bladeren kweken.
  // Geen automatische koppeling aan planteneters.

  // ============================================================
  // TREKMIEREN
  // ============================================================

  mieren(`
    Trekmier;
    Legermier;
    Eciton burchellii;
    Eciton hamatum;
    Eciton vagans;
    Eciton mexicanum;
    Eciton rapax;
    Eciton dulcium;
    Eciton lucanoides;
    Labidus praedator;
    Labidus coecus;
    Labidus spininodis;
    Neivamyrmex nigrescens;
    Neivamyrmex opacithorax;
    Neivamyrmex pilosus;
    Nomamyrmex esenbeckii;
    Nomamyrmex hartigii;
    Dorylus;
    Dorylus wilverthi;
    Dorylus molestus;
    Dorylus nigricans;
    Dorylus gribodoi;
    Dorylus helvolus;
    Aenictus;
    Aenictus laeviceps;
    Aenictus gracilis;
    Aenictus dentatus;
    Aenictus ceylonicus;
    Aenictus wroughtonii
  `, [15, 17]);

  samenvoegen("Trekmier", "Legermier");

  // ============================================================
  // BULLDOGMIEREN
  // ============================================================

  mieren(`
    Bulldogmier;
    Myrmecia gulosa;
    Myrmecia pyriformis;
    Myrmecia pilosula;
    Myrmecia brevinoda;
    Myrmecia nigriceps;
    Myrmecia tarsata;
    Myrmecia forficata;
    Myrmecia simillima;
    Myrmecia pavida;
    Myrmecia chasei;
    Myrmecia desertorum;
    Myrmecia cephalotes;
    Myrmecia fulvipes;
    Myrmecia urens;
    Myrmecia nigrocincta;
    Myrmecia mandibularis;
    Myrmecia tepperi;
    Myrmecia ludlowi;
    Myrmecia pulchra;
    Myrmecia rubripes;
    Myrmecia aberrans;
    Myrmecia inquilina;
    Nothomyrmecia macrops
  `, [15, 17, 23]);

  koppelDieren(`
    Bulldogmier;
    Myrmecia gulosa;
    Myrmecia pyriformis;
    Myrmecia pilosula;
    Myrmecia brevinoda;
    Myrmecia forficata
  `, [45]);

  // ============================================================
  // OVERIGE BIJZONDERE MIEREN
  // ============================================================

  mieren(`
    Kogelmier=Paraponera clavata;
    Dinoponera gigantea;
    Dinoponera quadriceps;
    Dinoponera australis;
    Pachycondyla crassinoda;
    Neoponera apicalis;
    Neoponera villosa;
    Neoponera verenae;
    Neoponera inversa;
    Neoponera crenata;
    Ectatomma tuberculatum;
    Ectatomma ruidum;
    Ectatomma brunneum;
    Ectatomma edentatum;
    Odontomachus bauri;
    Odontomachus monticola;
    Odontomachus haematodus;
    Odontomachus brunneus;
    Odontomachus rixosus;
    Odontomachus simillimus;
    Odontomachus chelifer;
    Odontomachus hastatus;
    Odontomachus laticeps;
    Anochetus;
    Anochetus emarginatus;
    Anochetus graeffei;
    Anochetus mayri;
    Leptogenys;
    Leptogenys diminuta;
    Leptogenys processionalis;
    Leptogenys chinensis;
    Leptogenys kitteli;
    Harpegnathos saltator;
    Harpegnathos venator;
    Buniapone amblyops;
    Diacamma rugosum;
    Diacamma scalpratum;
    Diacamma indicum;
    Pseudoneoponera rufipes;
    Pseudoneoponera tridentata;
    Pseudoneoponera bispinosa;
    Myopopone castanea;
    Platythyrea punctata;
    Platythyrea parallela;
    Platythyrea cribrinodis;
    Hypoponera punctatissima;
    Hypoponera ergatandria;
    Ponera coarctata;
    Ponera testacea;
    Ponera pennsylvanica;
    Wevermier;
    Oecophylla smaragdina;
    Oecophylla longinoda;
    Polyrhachis dives;
    Polyrhachis illaudata;
    Polyrhachis lamellidens;
    Polyrhachis bihamata;
    Polyrhachis armata;
    Polyrhachis ammon;
    Polyrhachis australis;
    Polyrhachis sokolova;
    Polyrhachis bicolor;
    Polyrhachis proxima;
    Polyrhachis rastellata;
    Polyrhachis thrinax;
    Crematogaster scutellaris;
    Crematogaster sordidula;
    Crematogaster auberti;
    Crematogaster lineolata;
    Crematogaster cerasi;
    Crematogaster ashmeadi;
    Crematogaster laeviuscula;
    Crematogaster rogenhoferi;
    Crematogaster inflata;
    Crematogaster biroi;
    Honingpotmier;
    Myrmecocystus mexicanus;
    Myrmecocystus mimicus;
    Myrmecocystus mendax;
    Myrmecocystus navajo;
    Myrmecocystus testaceus;
    Myrmecocystus placodops;
    Myrmecocystus romainei;
    Camponotus inflatus;
    Melophorus bagoti;
    Cataglyphis bombycina;
    Cataglyphis bicolor;
    Cataglyphis cursor;
    Cataglyphis hispanica;
    Cataglyphis nodus;
    Cataglyphis fortis;
    Cataglyphis velox;
    Cataglyphis savignyi;
    Cataglyphis viatica;
    Cataglyphis mauritanica;
    Messor barbarus;
    Messor structor;
    Messor capitatus;
    Messor minor;
    Messor wasmanni;
    Messor orientalis;
    Messor arenarius;
    Messor cephalotes;
    Messor aciculatus;
    Pogonomyrmex barbatus;
    Pogonomyrmex rugosus;
    Pogonomyrmex occidentalis;
    Pogonomyrmex californicus;
    Pogonomyrmex maricopa;
    Pogonomyrmex desertorum;
    Pogonomyrmex badius;
    Veromessor pergandei;
    Veromessor andrei;
    Aphaenogaster senilis;
    Aphaenogaster subterranea;
    Aphaenogaster gibbosa;
    Aphaenogaster fulva;
    Aphaenogaster rudis;
    Aphaenogaster picea;
    Aphaenogaster treatae;
    Aphaenogaster occidentalis;
    Aphaenogaster spinosa;
    Daceton armigerum;
    Cephalotes atratus;
    Cephalotes varians;
    Cephalotes pusillus;
    Cephalotes maculatus;
    Pseudomyrmex ferrugineus;
    Pseudomyrmex gracilis;
    Pseudomyrmex pallidus;
    Pseudomyrmex elongatus;
    Strumigenys;
    Strumigenys membranifera;
    Strumigenys rogeri;
    Strumigenys louisianae;
    Proceratium;
    Discothyrea;
    Prionopelta;
    Mystrium;
    Amblyopone;
    Stigmatomma;
    Pristomyrmex punctatus;
    Cerapachys;
    Ooceraea biroi;
    Tetraponera;
    Liometopum microcephalum;
    Liometopum occidentale;
    Dolichoderus quadripunctatus;
    Dolichoderus mariae;
    Dolichoderus taschenbergi;
    Iridomyrmex purpureus;
    Iridomyrmex rufoniger;
    Iridomyrmex bicknelli;
    Anoplolepis gracilipes;
    Paratrechina longicornis;
    Nylanderia fulva;
    Nylanderia vividula;
    Nylanderia bourbonica;
    Technomyrmex albipes;
    Technomyrmex difficilis;
    Prenolepis imparis;
    Brachymyrmex patagonicus;
    Brachymyrmex depilis
  `);

  koppelDieren(`
    Kogelmier;
    Dinoponera gigantea;
    Dinoponera quadriceps;
    Odontomachus bauri;
    Harpegnathos saltator;
    Pogonomyrmex maricopa
  `, [45]);

  koppelDieren(`
    Harpegnathos saltator;
    Harpegnathos venator
  `, [34]);

  koppelDieren(`
    Honingpotmier;
    Myrmecocystus mexicanus;
    Myrmecocystus mimicus;
    Myrmecocystus mendax;
    Myrmecocystus testaceus;
    Camponotus inflatus;
    Melophorus bagoti;
    Cataglyphis bombycina;
    Cataglyphis bicolor;
    Cataglyphis fortis;
    Cataglyphis savignyi;
    Messor arenarius
  `, [25]);

  koppelDieren(`
    Wevermier;
    Oecophylla smaragdina;
    Oecophylla longinoda;
    Daceton armigerum;
    Cephalotes atratus;
    Cephalotes varians;
    Pseudomyrmex ferrugineus
  `, [31, 35]);

  // ============================================================
  // TERMIETEN
  // ============================================================

  landinsecten(`
    Termiet=Termite;
    Macrotermes bellicosus;
    Macrotermes natalensis;
    Macrotermes subhyalinus;
    Macrotermes michaelseni;
    Macrotermes gilvus;
    Macrotermes carbonarius;
    Odontotermes obesus;
    Odontotermes formosanus;
    Odontotermes redemanni;
    Odontotermes montanus;
    Microtermes;
    Microtermes obesi;
    Amitermes;
    Amitermes meridionalis;
    Amitermes vitiosus;
    Amitermes hastatus;
    Nasutitermes corniger;
    Nasutitermes ephratae;
    Nasutitermes walkeri;
    Nasutitermes exitiosus;
    Nasutitermes triodiae;
    Nasutitermes graveolus;
    Trinervitermes;
    Trinervitermes trinervoides;
    Trinervitermes geminatus;
    Reticulitermes flavipes;
    Reticulitermes lucifugus;
    Reticulitermes santonensis;
    Reticulitermes grassei;
    Reticulitermes banyulensis;
    Reticulitermes hesperus;
    Reticulitermes virginicus;
    Reticulitermes tibialis;
    Reticulitermes speratus;
    Coptotermes formosanus;
    Coptotermes gestroi;
    Coptotermes acinaciformis;
    Coptotermes frenchi;
    Coptotermes lacteus;
    Heterotermes;
    Heterotermes aureus;
    Heterotermes tenuis;
    Cryptotermes brevis;
    Cryptotermes domesticus;
    Kalotermes flavicollis;
    Incisitermes minor;
    Incisitermes snyderi;
    Neotermes;
    Zootermopsis angusticollis;
    Zootermopsis nevadensis;
    Mastotermes darwiniensis;
    Hodotermes mossambicus;
    Microhodotermes viator;
    Anacanthotermes;
    Porotermes adamsoni;
    Psammotermes hybostoma;
    Termes;
    Cubitermes;
    Apicotermes;
    Globitermes sulphureus;
    Hospitalitermes;
    Longipeditermes longipes;
    Constrictotermes cyphergaster;
    Syntermes;
    Cornitermes cumulans;
    Procornitermes;
    Armitermes;
    Silvestritermes
  `, [40, 41]);

  samenvoegen(
    "Reticulitermes flavipes",
    "Reticulitermes santonensis"
  );

  koppelDieren(`
    Macrotermes bellicosus;
    Macrotermes natalensis;
    Macrotermes subhyalinus;
    Macrotermes michaelseni;
    Hodotermes mossambicus;
    Microhodotermes viator;
    Trinervitermes trinervoides;
    Cubitermes;
    Apicotermes
  `, [5]);

  koppelDieren(`
    Amitermes meridionalis;
    Nasutitermes walkeri;
    Nasutitermes exitiosus;
    Nasutitermes triodiae;
    Coptotermes acinaciformis;
    Coptotermes frenchi;
    Coptotermes lacteus;
    Mastotermes darwiniensis;
    Porotermes adamsoni
  `, [23]);

  // ============================================================
  // LOOPKEVERS
  // ============================================================

  landinsecten(`
    Loopkever;
    Schallebijter;
    Gouden loopkever=Carabus auratus;
    Paarse loopkever=Carabus violaceus;
    Tuinloopkever=Carabus nemoralis;
    Carabus granulatus;
    Carabus cancellatus;
    Carabus coriaceus;
    Carabus problematicus;
    Carabus arvensis;
    Carabus convexus;
    Carabus hortensis;
    Carabus glabratus;
    Carabus nitens;
    Carabus clathratus;
    Carabus monilis;
    Carabus intricatus;
    Carabus auronitens;
    Carabus linnei;
    Carabus irregularis;
    Carabus sylvestris;
    Carabus hispanus;
    Carabus splendens;
    Carabus rutilans;
    Carabus olympiae;
    Carabus hungaricus;
    Carabus scheidleri;
    Carabus ulrichii;
    Carabus scabrosus;
    Carabus smaragdinus;
    Carabus blaptoides;
    Carabus insulicola;
    Carabus maiyasanus;
    Carabus gehinii;
    Calosoma sycophanta;
    Calosoma inquisitor;
    Calosoma auropunctatum;
    Calosoma scrutator;
    Calosoma sayi;
    Calosoma frigidum;
    Calosoma calidum;
    Cychrus caraboides;
    Cychrus attenuatus;
    Cychrus italicus;
    Leistus ferrugineus;
    Leistus fulvibarbis;
    Leistus rufomarginatus;
    Leistus spinibarbis;
    Nebria brevicollis;
    Nebria salina;
    Nebria gyllenhali;
    Nebria livida;
    Notiophilus biguttatus;
    Notiophilus aquaticus;
    Notiophilus palustris;
    Notiophilus substriatus;
    Notiophilus germinyi;
    Elaphrus riparius;
    Elaphrus cupreus;
    Elaphrus uliginosus;
    Loricera pilicornis;
    Clivina fossor;
    Clivina collaris;
    Dyschirius globosus;
    Dyschirius thoracicus;
    Bembidion lampros;
    Bembidion properans;
    Bembidion tetracolum;
    Bembidion quadrimaculatum;
    Bembidion guttula;
    Bembidion assimile;
    Bembidion dentellum;
    Bembidion femoratum;
    Bembidion minimum;
    Bembidion aeneum;
    Bembidion lunulatum;
    Bembidion articulatum;
    Bembidion semipunctatum;
    Bembidion varium;
    Bembidion argenteolum;
    Bembidion litorale;
    Bembidion pallidipenne;
    Trechus quadristriatus;
    Trechus obtusus;
    Trechus rubens;
    Trechus secalis;
    Trechus micros;
    Patrobus atrorufus;
    Patrobus septentrionis;
    Pterostichus melanarius;
    Pterostichus niger;
    Pterostichus madidus;
    Pterostichus oblongopunctatus;
    Pterostichus strenuus;
    Pterostichus vernalis;
    Pterostichus minor;
    Pterostichus nigrita;
    Pterostichus rhaeticus;
    Pterostichus diligens;
    Pterostichus gracilis;
    Pterostichus anthracinus;
    Pterostichus cristatus;
    Pterostichus aethiops;
    Pterostichus burmeisteri;
    Poecilus cupreus;
    Poecilus versicolor;
    Poecilus lepidus;
    Abax parallelepipedus;
    Abax parallelus;
    Abax ovalis;
    Molops piceus;
    Molops elatus;
    Stomis pumicatus;
    Calathus fuscipes;
    Calathus melanocephalus;
    Calathus erratus;
    Calathus mollis;
    Calathus rotundicollis;
    Calathus micropterus;
    Synuchus vivalis;
    Agonum muelleri;
    Agonum fuliginosum;
    Agonum viduum;
    Agonum emarginatum;
    Agonum gracile;
    Agonum piceum;
    Agonum micans;
    Agonum marginatum;
    Agonum sexpunctatum;
    Anchomenus dorsalis;
    Platynus assimilis;
    Platynus livens;
    Olisthopus rotundatus;
    Oxypselaphus obscurus;
    Amara aenea;
    Amara familiaris;
    Amara communis;
    Amara lunicollis;
    Amara plebeja;
    Amara similata;
    Amara ovata;
    Amara convexior;
    Amara bifrons;
    Amara fulva;
    Amara municipalis;
    Amara apricaria;
    Amara aulica;
    Amara consularis;
    Amara spreta;
    Amara tibialis;
    Harpalus affinis;
    Harpalus rufipes;
    Harpalus tardus;
    Harpalus latus;
    Harpalus rubripes;
    Harpalus distinguendus;
    Harpalus serripes;
    Harpalus anxius;
    Harpalus neglectus;
    Harpalus pumilus;
    Harpalus smaragdinus;
    Harpalus honestus;
    Harpalus froelichii;
    Ophonus azureus;
    Ophonus rufibarbis;
    Ophonus puncticeps;
    Ophonus ardosiacus;
    Ophonus nitidulus;
    Bradycellus harpalinus;
    Bradycellus verbasci;
    Bradycellus ruficollis;
    Trichocellus placidus;
    Stenolophus mixtus;
    Stenolophus teutonus;
    Acupalpus meridianus;
    Acupalpus flavicollis;
    Acupalpus parvulus;
    Dicheirotrichus gustavii;
    Badister bullatus;
    Badister lacertosus;
    Badister sodalis;
    Badister unipustulatus;
    Licinus depressus;
    Panagaeus cruxmajor;
    Panagaeus bipustulatus;
    Chlaenius vestitus;
    Chlaenius nigricornis;
    Chlaenius nitidulus;
    Chlaenius tristis;
    Oodes helopioides;
    Lebia chlorocephala;
    Lebia cruxminor;
    Lebia cyanocephala;
    Dromius agilis;
    Dromius quadrimaculatus;
    Dromius meridionalis;
    Calodromius spilotus;
    Paradromius linearis;
    Microlestes minutulus;
    Microlestes maurus;
    Syntomus truncatellus;
    Syntomus foveatus;
    Syntomus obscuroguttatus;
    Brachinus crepitans;
    Brachinus explodens;
    Brachinus sclopeta;
    Bombardeerkever;
    Aptinus bombarda;
    Zabrus tenebrioides;
    Broscus cephalotes
  `);

  // Niet iedere loopkever eet insecten.
  // Sommige soorten eten voornamelijk zaden.

  koppelDieren(`
    Gouden loopkever;
    Paarse loopkever;
    Tuinloopkever;
    Carabus granulatus;
    Carabus cancellatus;
    Carabus coriaceus;
    Carabus problematicus;
    Carabus arvensis;
    Carabus convexus;
    Carabus hortensis;
    Carabus glabratus;
    Carabus auronitens;
    Calosoma sycophanta;
    Calosoma inquisitor;
    Calosoma scrutator;
    Calosoma sayi;
    Nebria brevicollis;
    Pterostichus melanarius;
    Pterostichus niger;
    Pterostichus madidus
  `, [17]);

  koppelDieren(`
    Calosoma sycophanta;
    Calosoma inquisitor;
    Calosoma scrutator;
    Calosoma sayi;
    Notiophilus biguttatus;
    Notiophilus aquaticus;
    Pterostichus melanarius
  `, [15]);

  // ============================================================
  // KORTSCHILDKEVERS
  // ============================================================

  landinsecten(`
    Kortschildkever;
    Stinkende kortschildkever=Ocypus olens;
    Ocypus aeneocephalus;
    Ocypus nitens;
    Ocypus ophthalmicus;
    Staphylinus caesareus;
    Staphylinus erythropterus;
    Staphylinus dimidiaticornis;
    Platydracus stercorarius;
    Platydracus fulvipes;
    Creophilus maxillosus;
    Emus hirtus;
    Ontholestes murinus;
    Ontholestes tessellatus;
    Philonthus decorus;
    Philonthus politus;
    Philonthus cognatus;
    Philonthus succicola;
    Philonthus varians;
    Philonthus carbonarius;
    Philonthus laminatus;
    Philonthus marginatus;
    Philonthus splendens;
    Philonthus fumarius;
    Quedius fuliginosus;
    Quedius curtipennis;
    Quedius mesomelinus;
    Quedius molochinus;
    Quedius cruentus;
    Quedius lateralis;
    Quedius xanthopus;
    Quedius cinctus;
    Quedius boops;
    Xantholinus linearis;
    Xantholinus longiventris;
    Xantholinus tricolor;
    Gyrohypnus fracticornis;
    Gyrohypnus angustatus;
    Othius punctulatus;
    Othius subuliformis;
    Paederus riparius;
    Paederus littoralis;
    Paederus fuscipes;
    Paederus melanurus;
    Rugilus rufipes;
    Rugilus orbiculatus;
    Lathrobium elongatum;
    Lathrobium brunnipes;
    Lathrobium fulvipenne;
    Lathrobium terminatum;
    Stenus;
    Stenus biguttatus;
    Stenus bimaculatus;
    Stenus comma;
    Stenus juno;
    Stenus clavicornis;
    Stenus fornicatus;
    Stenus cicindeloides;
    Stenus impressus;
    Stenus humilis;
    Tachyporus hypnorum;
    Tachyporus chrysomelinus;
    Tachyporus obtusus;
    Tachyporus nitidulus;
    Tachinus rufipes;
    Tachinus signatus;
    Tachinus subterraneus;
    Tachinus corticinus;
    Bolitobius;
    Lordithon lunulatus;
    Sepedophilus testaceus;
    Sepedophilus marshami;
    Aleochara;
    Aleochara bilineata;
    Aleochara bipustulata;
    Aleochara curtula;
    Aleochara lanuginosa;
    Aleochara sparsa;
    Atheta;
    Atheta fungi;
    Atheta nigritula;
    Atheta triangulum;
    Oxypoda;
    Ocalea;
    Dinaraea;
    Zyras;
    Lomechusa;
    Lomechusa emarginata;
    Lomechusoides strumosus;
    Pella;
    Falagria;
    Mycetoporus;
    Proteinus;
    Micropeplus;
    Omalium rivulare;
    Omalium caesum;
    Anthobium atrocephalum;
    Lesteva longelytrata;
    Acidota cruentata;
    Geodromicus;
    Olophrum;
    Eusphalerum;
    Scaphidium quadrimaculatum;
    Scaphisoma;
    Scydmaenus;
    Euconnus;
    Cephennium
  `);

  // ============================================================
  // SNUI T K E V E R S
  // ============================================================

  landinsecten(`
    Snuitkever;
    Taxuskever=Otiorhynchus sulcatus;
    Otiorhynchus ovatus;
    Otiorhynchus singularis;
    Otiorhynchus rugosostriatus;
    Otiorhynchus armadillo;
    Otiorhynchus salicicola;
    Otiorhynchus clavipes;
    Otiorhynchus niger;
    Otiorhynchus ligustici;
    Otiorhynchus desertus;
    Otiorhynchus raucus;
    Otiorhynchus atroapterus;
    Phyllobius argentatus;
    Phyllobius pomaceus;
    Phyllobius pyri;
    Phyllobius oblongus;
    Phyllobius maculicornis;
    Phyllobius viridicollis;
    Phyllobius calcaratus;
    Phyllobius glaucus;
    Polydrusus formosus;
    Polydrusus cervinus;
    Polydrusus tereticollis;
    Polydrusus pterygomalis;
    Polydrusus flavipes;
    Polydrusus mollis;
    Sitona lineatus;
    Sitona hispidulus;
    Sitona lepidus;
    Sitona sulcifrons;
    Sitona humeralis;
    Sitona macularius;
    Sitona crinitus;
    Sitona striatellus;
    Sitona cylindricollis;
    Barynotus obscurus;
    Barynotus moerens;
    Strophosoma melanogrammum;
    Strophosoma capitatum;
    Brachyderes incanus;
    Brachysomus echinatus;
    Sciaphilus asperatus;
    Cneorhinus plagiatus;
    Tropiphorus;
    Eikenboorder=Curculio glandium;
    Hazelnootboorder=Curculio nucum;
    Curculio venosus;
    Curculio villosus;
    Curculio elephas;
    Curculio pellitus;
    Curculio betulae;
    Appelbloesemkever=Anthonomus pomorum;
    Aardbeibloesemkever=Anthonomus rubi;
    Anthonomus pyri;
    Anthonomus rectirostris;
    Anthonomus grandis;
    Graanklander=Sitophilus granarius;
    Rijstklander=Sitophilus oryzae;
    Maisklander=Sitophilus zeamais;
    Sphenophorus;
    Hylobius abietis;
    Hylobius pinastri;
    Pissodes pini;
    Pissodes castaneus;
    Pissodes validirostris;
    Pissodes notatus;
    Hylastes ater;
    Hylastes cunicularius;
    Hylurgops palliatus;
    Tomicus piniperda;
    Tomicus minor;
    Letterzetter=Ips typographus;
    Ips sexdentatus;
    Ips acuminatus;
    Ips duplicatus;
    Ips cembrae;
    Ips amitinus;
    Pityogenes chalcographus;
    Pityogenes bidentatus;
    Pityogenes quadridens;
    Scolytus scolytus;
    Scolytus multistriatus;
    Scolytus rugulosus;
    Scolytus intricatus;
    Scolytus mali;
    Dendroctonus ponderosae;
    Dendroctonus frontalis;
    Dendroctonus rufipennis;
    Dendroctonus valens;
    Dendroctonus micans;
    Dendroctonus brevicomis;
    Xyleborus dispar;
    Xyleborus glabratus;
    Xylosandrus germanus;
    Xylosandrus compactus;
    Xylosandrus crassiusculus;
    Trypodendron lineatum;
    Trypodendron domesticum;
    Trypodendron signatum;
    Hypothenemus hampei;
    Rhynchophorus ferrugineus;
    Rhynchophorus palmarum;
    Rhynchophorus vulneratus;
    Rhynchophorus bilineatus;
    Rhynchophorus phoenicis;
    Bananensnuitkever=Cosmopolites sordidus;
    Lixus;
    Lixus iridis;
    Lixus junci;
    Lixus pulverulentus;
    Lixus angustatus;
    Larinus;
    Larinus planus;
    Larinus turbinatus;
    Larinus minutus;
    Cleonis pigra;
    Bothynoderes punctiventris;
    Rhinocyllus conicus;
    Hylobius transversovittatus;
    Hylobius warreni;
    Ceutorhynchus;
    Ceutorhynchus napi;
    Ceutorhynchus assimilis;
    Ceutorhynchus pallidactylus;
    Ceutorhynchus obstrictus;
    Ceutorhynchus erysimi;
    Ceutorhynchus contractus;
    Nedyus quadrimaculatus;
    Mogulones;
    Mogulones crucifer;
    Rhinoncus pericarpius;
    Rhinoncus castor;
    Trichosirocalus;
    Mononychus punctumalbum;
    Gymnetron;
    Rhinusa;
    Mecinus;
    Cionus;
    Cionus scrophulariae;
    Cionus tuberculosus;
    Cionus hortulanus;
    Cionus alauda;
    Rhamphus pulicarius;
    Orchestes fagi;
    Orchestes quercus;
    Orchestes alni;
    Orchestes testaceus;
    Tychius;
    Sibinia;
    Apion;
    Protapion;
    Exapion;
    Perapion;
    Oxystoma;
    Ischnopterapion;
    Nanophyes marmoratus;
    Attelabus nitens;
    Apoderus coryli;
    Byctiscus betulae;
    Byctiscus populi;
    Deporaus betulae;
    Rhynchites bacchus;
    Rhynchites auratus;
    Tatianaerhynchites aequatus
  `);

  koppelDieren(`
    Taxuskever;
    Phyllobius argentatus;
    Phyllobius pomaceus;
    Phyllobius pyri;
    Polydrusus formosus;
    Sitona lineatus;
    Eikenboorder;
    Hazelnootboorder;
    Appelbloesemkever;
    Aardbeibloesemkever;
    Graanklander;
    Rijstklander;
    Maisklander;
    Hylobius abietis;
    Bananensnuitkever
  `, [16]);

  // ============================================================
  // OVERIGE LANDKEVERS
  // ============================================================

  landinsecten(`
    Zwartlijfkever;
    Meelwormkever=Tenebrio molitor;
    Tenebrio obscurus;
    Zophobas morio;
    Alphitobius diaperinus;
    Alphitobius laevigatus;
    Tribolium castaneum;
    Tribolium confusum;
    Tribolium destructor;
    Blaps mortisaga;
    Blaps mucronata;
    Blaps lethifera;
    Blaps gigas;
    Asida;
    Pimelia;
    Akis;
    Eleodes;
    Eleodes obscura;
    Eleodes armata;
    Eleodes dentipes;
    Eleodes longicollis;
    Stenocara;
    Onymacris unguicularis;
    Onymacris plana;
    Adesmia;
    Erodius;
    Opatrum sabulosum;
    Crypticus quisquilius;
    Diaperis boleti;
    Bolitophagus reticulatus;
    Eledona agricola;
    Uloma culinaris;
    Uloma rufa;
    Nalassus laevioctostriatus;
    Helops caeruleus;
    Platydema violaceum;
    Palorus;
    Corticeus;
    Kever;
    Kniptor;
    Agriotes lineatus;
    Agriotes obscurus;
    Agriotes sputator;
    Agriotes ustulatus;
    Agriotes sordidus;
    Athous haemorrhoidalis;
    Athous vittatus;
    Athous subfuscus;
    Athous niger;
    Selatosomus aeneus;
    Selatosomus cruciatus;
    Ctenicera pectinicornis;
    Ctenicera cuprea;
    Melanotus villosus;
    Melanotus castanipes;
    Ampedus sanguineus;
    Ampedus pomorum;
    Ampedus balteatus;
    Ampedus cinnabarinus;
    Dalopius marginatus;
    Adrastus;
    Denticollis linearis;
    Limonius;
    Prosternon tessellatum;
    Hemicrepidius niger;
    Hemicrepidius hirtus;
    Elater ferrugineus;
    Pyrophorus;
    Prachtkever;
    Agrilus biguttatus;
    Agrilus viridis;
    Agrilus angustulus;
    Agrilus sulcicollis;
    Agrilus laticornis;
    Agrilus pannonicus;
    Agrilus planipennis;
    Agrilus anxius;
    Agrilus bilineatus;
    Anthaxia;
    Anthaxia nitidula;
    Anthaxia quadripunctata;
    Anthaxia manca;
    Anthaxia salicis;
    Buprestis aurulenta;
    Buprestis octoguttata;
    Buprestis rustica;
    Buprestis haemorrhoidalis;
    Chalcophora mariana;
    Chalcophora virginiensis;
    Chrysobothris affinis;
    Chrysobothris femorata;
    Dicerca;
    Julodis;
    Sternocera aequisignata;
    Sternocera ruficornis;
    Chrysochroa fulgidissima;
    Chrysochroa buqueti;
    Chrysochroa vittata;
    Euchroma gigantea;
    Ptinus fur;
    Ptinus tectus;
    Ptinus rufipes;
    Gibbium psylloides;
    Niptus hololeucus;
    Gewone houtwormkever=Anobium punctatum;
    Grote houtwormkever=Xestobium rufovillosum;
    Xyletinus;
    Ptilinus pectinicornis;
    Broodkever=Stegobium paniceum;
    Tabakskever=Lasioderma serricorne;
    Dermestes lardarius;
    Dermestes maculatus;
    Dermestes ater;
    Dermestes haemorrhoidalis;
    Dermestes frischii;
    Dermestes undulatus;
    Spekkever;
    Museumkever=Anthrenus museorum;
    Tapijtkever=Anthrenus verbasci;
    Anthrenus flavipes;
    Anthrenus scrophulariae;
    Anthrenus pimpinellae;
    Attagenus unicolor;
    Attagenus pellio;
    Attagenus smirnovi;
    Trogoderma granarium;
    Trogoderma variabile;
    Trogoderma inclusum;
    Globicornis;
    Megatoma undata;
    Reesa vespulae;
    Oryzaephilus surinamensis;
    Oryzaephilus mercator;
    Cryptolestes ferrugineus;
    Cryptolestes pusillus;
    Cryptolestes turcicus;
    Ahasverus advena;
    Silvanus unidentatus;
    Silvanus bidentatus;
    Cryptophagus;
    Atomaria;
    Latridius;
    Corticaria;
    Cortinicara gibbosa;
    Dienerella;
    Mycetaea subterranea;
    Typhaea stercorea;
    Mycetophagus;
    Endomychus coccineus;
    Lycoperdina;
    Dacne bipustulata;
    Triplax;
    Tritoma bipustulata;
    Erotylus;
    Phalacrus;
    Olibrus;
    Meligethes;
    Brassicogethes aeneus;
    Nitidula;
    Omosita;
    Carpophilus hemipterus;
    Carpophilus dimidiatus;
    Glischrochilus hortensis;
    Glischrochilus quadripunctatus;
    Rhizophagus;
    Monotoma;
    Cucujus cinnaberinus;
    Cucujus haematodes;
    Pycnomerus;
    Laemophloeus;
    Uleiota planata;
    Prostomis mandibularis;
    Lymexylon navale;
    Hylecoetus dermestoides;
    Omalisus fontisbellaquaei;
    Lycus;
    Dictyoptera aurora;
    Platycis minutus;
    Calopteron;
    Trichodes apiarius;
    Trichodes alvearius;
    Thanasimus formicarius;
    Thanasimus femoralis;
    Necrobia rufipes;
    Necrobia violacea;
    Tillus elongatus;
    Opilo mollis;
    Malachius bipustulatus;
    Anthocomus;
    Dasytes;
    Psilothrix;
    Oedemera nobilis;
    Oedemera lurida;
    Oedemera virescens;
    Oedemera femorata;
    Nacerdes melanura;
    Oedemera flavipes;
    Meloe proscarabaeus;
    Meloe violaceus;
    Meloe variegatus;
    Meloe autumnalis;
    Lytta vesicatoria;
    Mylabris;
    Epicauta;
    Hycleus;
    Spaanse vlieg;
    Oliekever;
    Notoxus monoceros;
    Anthicus;
    Omonadus floralis;
    Scraptia;
    Anaspis;
    Mordella;
    Mordellistena;
    Ripiphorus;
    Rhipidius;
    Lagri a= Lagria hirta;
    Lagria atripes;
    Allecula;
    Prionychus ater;
    Isomira;
    Mycetochara;
    Melandrya caraboides;
    Orchesia;
    Hallomenus;
    Serropalpus
  `);

  hernoemDier("Lagri a", "Lagria hirta");

  samenvoegen("Lytta vesicatoria", "Spaanse vlieg");

  koppelDieren(`
    Meloe proscarabaeus;
    Meloe violaceus;
    Meloe variegatus;
    Meloe autumnalis;
    Lytta vesicatoria;
    Mylabris;
    Epicauta;
    Oliekever
  `, [45]);

  // ============================================================
  // WANDELENDE TAKKEN
  // ============================================================

  landinsecten(`
    Wandelende tak=Stick insect;
    Indische wandelende tak=Carausius morosus;
    Vietnamese wandelende tak=Medauroidea extradentata;
    Australische wandelende tak=Extatosoma tiaratum;
    Sungaya inexpectata;
    Sipyloidea sipylus;
    Sipyloidea;
    Bacillus rossius;
    Bacillus grandii;
    Bacillus atticus;
    Clonopsis gallica;
    Leptynia hispanica;
    Pijnackeria hispanica;
    Pijnackeria masettii;
    Ramulus artemis;
    Ramulus nematodes;
    Ramulus;
    Phraortes;
    Phraortes elongatus;
    Phraortes illepidus;
    Parapachymorpha spinosa;
    Neohirasea maerens;
    Neohirasea japonica;
    Lonchodes;
    Lonchodes brevipes;
    Lonchodes haematomus;
    Necroscia annulipes;
    Necroscia affinis;
    Necroscia;
    Asceles;
    Asceles glaber;
    Asceles margaritatus;
    Calvisia;
    Orthonecroscia;
    Lopaphus;
    Dares validispinus;
    Dares verrucosus;
    Dares ulula;
    Heteropteryx dilatata;
    Haaniella dehaanii;
    Haaniella echinata;
    Haaniella grayii;
    Haaniella muelleri;
    Haaniella scabra;
    Haaniella gorochovi;
    Eurycantha calcarata;
    Eurycantha horrida;
    Eurycantha insularis;
    Eurycantha;
    Dryococelus australis;
    Tropidoderus childrenii;
    Tropidoderus rhodomus;
    Acrophylla titan;
    Acrophylla wuelfingi;
    Acrophylla;
    Ctenomorpha marginipennis;
    Ctenomorpha gargantua;
    Anchiale briareus;
    Anchiale maculata;
    Anchiale;
    Podacanthus;
    Didymuria violescens;
    Onchestus rentzi;
    Onchestus;
    Paronchestus cornutus;
    Pseudophasma subapterum;
    Pseudophasma acanthonotum;
    Pseudophasma;
    Peruphasma schultei;
    Anisomorpha buprestoides;
    Anisomorpha ferruginea;
    Oreophoetes peruana;
    Oreophoetes;
    Orestes;
    Orestes mouhotii;
    Orestes guangxiensis;
    Aretaon asperrimus;
    Aretaon muscosus;
    Trachyaretaon carmelae;
    Trachyaretaon brueckneri;
    Obrimus bicolanus;
    Obrimus bufo;
    Obrimus;
    Mearnsiana bullosa;
    Pharnacia;
    Pharnacia ponderosa;
    Phobaeticus;
    Phobaeticus chani;
    Phobaeticus serratipes;
    Phobaeticus kirbyi;
    Phryganistria;
    Phryganistria chinensis;
    Phryganistria heusii;
    Phryganistria tamdaoensis;
    Tirachoidea;
    Tirachoidea biceps;
    Sceptrophasma hispidulum;
    Sceptrophasma;
    Diapheromera femorata;
    Diapheromera velii;
    Diapheromera;
    Megaphasma denticrus;
    Bacteria;
    Cladomorphus phyllinus;
    Cladomorphus;
    Heteronemia mexicana;
    Pseudobacteria;
    Bostra;
    Lamponius guerini;
    Mnesilochus;
    Mnesilochus modestus;
    Hermarchus;
    Hermarchus leytensis;
    Hermarchus inermis;
    Pseudosermyle;
    Timema;
    Timema cristinae;
    Timema californicum;
    Timema podura;
    Timema poppense
  `, [16]);

  koppelDieren(`
    Wandelende tak;
    Indische wandelende tak;
    Vietnamese wandelende tak;
    Australische wandelende tak;
    Extatosoma tiaratum;
    Sungaya inexpectata;
    Sipyloidea sipylus;
    Heteropteryx dilatata;
    Eurycantha calcarata
  `, [35]);

  // ============================================================
  // WANDELENDE BLADEREN
  // ============================================================

  landinsecten(`
    Wandelend blad;
    Phyllium philippinicum;
    Phyllium mabantai;
    Phyllium jacobsoni;
    Phyllium elegans;
    Phyllium hausleithneri;
    Phyllium bilobatum;
    Phyllium ericoriai;
    Phyllium woodi;
    Phyllium gantungense;
    Phyllium palawanense;
    Phyllium rubrum;
    Phyllium mindorense;
    Cryptophyllium westwoodii;
    Cryptophyllium celebicum;
    Cryptophyllium limogesi;
    Cryptophyllium chrisangi;
    Cryptophyllium rarum;
    Cryptophyllium khmer;
    Cryptophyllium oyae;
    Cryptophyllium bollensi;
    Pulchriphyllium giganteum;
    Pulchriphyllium bioculatum;
    Pulchriphyllium pulchrifolium;
    Pulchriphyllium crurifolium;
    Pulchriphyllium agathyrsus;
    Pulchriphyllium brevipenne;
    Pulchriphyllium;
    Nanophyllium;
    Nanophyllium pygmaeum
  `, [16, 31, 35]);

  // ============================================================
  // EXTRA BIDSPRINKHANEN
  // ============================================================

  landinsecten(`
    Bidsprinkhaan;
    Mantis religiosa;
    Mantis religiosa major;
    Iris oratoria;
    Ameles spallanzania;
    Ameles decolor;
    Ameles picteti;
    Geomantis larvoides;
    Empusa pennata;
    Empusa fasciata;
    Empusa guttula;
    Gongylus gongylodes;
    Blepharopsis mendica;
    Idolomantis diabolica;
    Phyllocrania paradoxa;
    Hymenopus coronatus;
    Creobroter pictipennis;
    Creobroter gemmatus;
    Creobroter elongatus;
    Creobroter urbanus;
    Pseudocreobotra wahlbergii;
    Pseudocreobotra ocellata;
    Pseudocreobotra;
    Theopropus elegans;
    Theopropus;
    Odontomantis planiceps;
    Odontomantis;
    Acromantis;
    Acromantis japonica;
    Acromantis formosana;
    Hestiasula;
    Hestiasula brunneriana;
    Hestiasula major;
    Sibylla pretiosa;
    Sibylla dolosa;
    Ceratomantis saussurii;
    Ceratomantis;
    Deroplatys desiccata;
    Deroplatys lobata;
    Deroplatys truncata;
    Deroplatys trigonodera;
    Deroplatys;
    Popa spurca;
    Popa;
    Acanthops falcata;
    Acanthops;
    Pseudacanthops;
    Metallyticus splendidus;
    Metallyticus violaceus;
    Metallyticus;
    Tarachodula pantherina;
    Tarachodes;
    Tarachodula;
    Liturgusa;
    Gonatista grisea;
    Gonatista;
    Stagmomantis carolina;
    Stagmomantis limbata;
    Stagmomantis californica;
    Stagmomantis;
    Sphodromantis viridis;
    Sphodromantis gastrica;
    Sphodromantis centralis;
    Sphodromantis lineola;
    Sphodromantis;
    Hierodula membranacea;
    Hierodula patellifera;
    Hierodula tenuidentata;
    Hierodula transcaucasica;
    Hierodula majuscula;
    Hierodula venosa;
    Hierodula;
    Rhombodera basalis;
    Rhombodera extensicollis;
    Rhombodera megaera;
    Rhombodera;
    Tenodera sinensis;
    Tenodera angustipennis;
    Tenodera aridifolia;
    Tenodera australasiae;
    Tenodera;
    Archimantis latistyla;
    Archimantis monstrosa;
    Archimantis;
    Orthodera ministralis;
    Orthodera novaezealandiae;
    Orthodera;
    Miomantis caffra;
    Miomantis paykullii;
    Miomantis;
    Polyspilota aeruginosa;
    Polyspilota;
    Parasphendale affinis;
    Parasphendale agrionina;
    Parasphendale;
    Phyllothelys;
    Euchomenella;
    Euchomenella heteroptera;
    Toxodera;
    Toxodera denticulata;
    Paratoxodera;
    Brunneria borealis;
    Brunneria;
    Pseudomantis albofimbriata;
    Ciulfina;
    Paraoxypilus;
    Bolbe;
    Heterochaeta orientalis;
    Heterochaeta;
    Danuria;
    Danuria barbozae;
    Macromantis;
    Macromantis ovalifolia;
    Angela;
    Angela guianensis;
    Vates;
    Vates pectinata;
    Zoolea;
    Callibia diana;
    Oxyopsis;
    Photina;
    Acontista;
    Acontista multicolor
  `, [15, 17]);

  // ============================================================
  // OORWORMEN
  // ============================================================

  landinsecten(`
    Oorworm=Earwig;
    Gewone oorworm=Forficula auricularia;
    Kleine oorworm=Labia minor;
    Zandoorworm=Labidura riparia;
    Struikoorworm=Apterygida media;
    Lesne's oorworm=Forficula lesnei;
    Forficula pubescens;
    Forficula decipiens;
    Forficula smyrnensis;
    Forficula tomis;
    Chelidurella acanthopygia;
    Chelidura aptera;
    Euborellia annulipes;
    Euborellia femoralis;
    Euborellia;
    Anisolabis maritima;
    Anisolabis;
    Anisolabella;
    Doru luteipes;
    Doru taeniatum;
    Doru;
    Marava arachidis;
    Marava;
    Spongiphoridae;
    Arixenia esau;
    Hemimerus;
    Hemimerus talpoides;
    Diplatys;
    Pygidicrana;
    Tagalina
  `);

  koppelDieren(`
    Gewone oorworm;
    Kleine oorworm;
    Zandoorworm;
    Struikoorworm
  `, [10, 27]);

  // ============================================================
  // KAKKERLAKKEN
  // ============================================================

  landinsecten(`
    Oosterse kakkerlak=Blatta orientalis;
    Madagaskar-sissende kakkerlak=Gromphadorhina portentosa;
    Gromphadorhina oblongonota;
    Gromphadorhina grandidieri;
    Princisia vanwaerebeki;
    Aeluropoda insignis;
    Elliptorhina javanica;
    Elliptorhina chopardi;
    Elliptorhina davidi;
    Elliptorhina laevigata;
    Blaberus giganteus;
    Blaberus craniifer;
    Blaberus discoidalis;
    Blaberus atropos;
    Blaberus fusca;
    Blaberus boliviensis;
    Blaptica dubia;
    Eublaberus posticus;
    Eublaberus distanti;
    Eublaberus serranus;
    Archimandrita tessellata;
    Archimandrita;
    Byrsotria fumigata;
    Byrsotria;
    Lucihormetica subcincta;
    Lucihormetica verrucosa;
    Lucihormetica;
    Therea petiveriana;
    Therea olegrandjeani;
    Therea regularis;
    Therea;
    Polyphaga aegyptiaca;
    Polyphaga saussurei;
    Polyphaga;
    Arenivaga investigata;
    Arenivaga;
    Ergaula capucina;
    Ergaula;
    Macropanesthia rhinoceros;
    Panesthia australis;
    Panesthia angustipennis;
    Panesthia;
    Salganea;
    Salganea taiwanensis;
    Gyna lurida;
    Gyna caffrorum;
    Gyna centurio;
    Gyna;
    Panchlora nivea;
    Panchlora;
    Nauphoeta cinerea;
    Phoetalia pallida;
    Pycnoscelus surinamensis;
    Pycnoscelus indicus;
    Pycnoscelus;
    Rhyparobia maderae;
    Rhyparobia;
    Hemiblabera tenebricosa;
    Hemiblabera;
    Oxyhaloa deusta;
    Oxyhaloa;
    Shelfordella lateralis;
    Periplaneta fuliginosa;
    Periplaneta brunnea;
    Periplaneta japonica;
    Periplaneta;
    Ectobius lapponicus;
    Ectobius pallidus;
    Ectobius sylvestris;
    Ectobius vittiventris;
    Ectobius panzeri;
    Ectobius;
    Planuncus tingitanus;
    Planuncus;
    Parcoblatta pennsylvanica;
    Parcoblatta virginica;
    Parcoblatta;
    Cryptocercus punctulatus;
    Cryptocercus;
    Blatta;
    Blattella asahinai;
    Blattella vaga;
    Blattella;
    Loboptera decipiens;
    Loboptera;
    Supella;
    Simandoa conserfariam;
    Nocticola;
    Pseudoglomeris;
    Pseudoglomeris magnifica;
    Perisphaerus;
    Prosoplecta;
    Allacta;
    Balta;
    Pseudomops;
    Pseudomops septentrionalis
  `);

  koppelDieren(`
    Ectobius lapponicus;
    Ectobius pallidus;
    Ectobius sylvestris;
    Ectobius panzeri;
    Cryptocercus punctulatus;
    Parcoblatta pennsylvanica;
    Parcoblatta virginica
  `, [6]);

  koppelDieren(`
    Macropanesthia rhinoceros;
    Panesthia australis
  `, [23, 32]);

  // ============================================================
  // ZILVERVISJES EN PAPIERVISJES
  // ============================================================

  landinsecten(`
    Zilvervisje=Lepisma saccharinum;
    Papiervisje=Ctenolepisma longicaudatum;
    Ovenvisje=Thermobia domestica;
    Ctenolepisma lineatum;
    Ctenolepisma calvum;
    Ctenolepisma ciliatum;
    Ctenolepisma;
    Lepisma;
    Thermobia;
    Atelura formicaria;
    Atelura;
    Nicoletia;
    Tricholepidion gertschi;
    Rotsspringer;
    Machilis;
    Machilis germanica;
    Petrobius maritimus;
    Petrobius brevistylis;
    Dilta hibernica;
    Dilta;
    Lepismachilis;
    Trigoniophthalmus;
    Pedetontus
  `, [10]);

  // ============================================================
  // SPRINGSTAARTEN
  // ============================================================

  ongewervelden(`
    Springstaart=Springtail;
    Podura aquatica;
    Hypogastrura;
    Hypogastrura viatica;
    Hypogastrura socialis;
    Ceratophysella;
    Ceratophysella denticulata;
    Xenylla;
    Xenylla maritima;
    Friesea;
    Neanura muscorum;
    Neanura;
    Anurida maritima;
    Anurida;
    Pseudachorutes;
    Tetrodontophora bielanensis;
    Onychiurus;
    Protaphorura;
    Tullbergia;
    Mesaphorura;
    Folsomia candida;
    Folsomia fimetaria;
    Folsomia quadrioculata;
    Folsomia;
    Isotoma viridis;
    Isotoma;
    Isotomurus palustris;
    Isotomurus;
    Parisotoma notabilis;
    Desoria;
    Desoria trispinata;
    Vertagopus;
    Orchesella cincta;
    Orchesella flavescens;
    Orchesella villosa;
    Orchesella;
    Entomobrya nivalis;
    Entomobrya multifasciata;
    Entomobrya muscorum;
    Entomobrya;
    Lepidocyrtus cyaneus;
    Lepidocyrtus lanuginosus;
    Lepidocyrtus lignorum;
    Lepidocyrtus;
    Pseudosinella;
    Sinella;
    Seira;
    Tomocerus minor;
    Tomocerus vulgaris;
    Tomocerus;
    Pogonognathellus longicornis;
    Pogonognathellus flavescens;
    Heteromurus nitidus;
    Heteromurus;
    Willowsia;
    Dicyrtomina ornata;
    Dicyrtomina saundersi;
    Dicyrtomina minuta;
    Dicyrtomina;
    Sminthurus viridis;
    Sminthurus;
    Sminthurinus aureus;
    Sminthurinus;
    Sminthurides aquaticus;
    Sminthurides;
    Bourletiella;
    Deuterosminthurus;
    Allacma fusca;
    Allacma;
    Arrhopalites;
    Pygmarrhopalites;
    Megalothorax minimus;
    Megalothorax;
    Neelus murinus;
    Neelus
  `, [7, 10]);

  // ============================================================
  // VLOOIEN EN LUIZEN
  // ============================================================

  landinsecten(`
    Vlo=Flea;
    Kattenvlo=Ctenocephalides felis;
    Hondenvlo=Ctenocephalides canis;
    Mensenvlo=Pulex irritans;
    Rattenvlo=Xenopsylla cheopis;
    Noordelijke rattenvlo=Nosopsyllus fasciatus;
    Konijnenvlo=Spilopsyllus cuniculi;
    Egelvlo=Archaeopsylla erinacei;
    Vogelvlo=Ceratophyllus gallinae;
    Ceratophyllus;
    Leptopsylla segnis;
    Hystrichopsylla talpae;
    Hystrichopsylla;
    Tunga penetrans;
    Tunga;
    Echidnophaga gallinacea;
    Echidnophaga;
    Cediopsylla simplex;
    Cediopsylla;
    Oropsylla montana;
    Oropsylla;
    Malaraeus;
    Megabothris;
    Rhadinopsylla;
    Frontopsylla;
    Amphipsylla;
    Palaeopsylla;
    Ctenophthalmus;
    Ctenophthalmus agyrtes;
    Hoofdluis=Pediculus humanus capitis;
    Kleerluis=Pediculus humanus humanus;
    Lichaamsluis;
    Pediculus humanus;
    Schaamluis=Pthirus pubis;
    Hondsluis=Linognathus setosus;
    Linognathus vituli;
    Linognathus ovillus;
    Linognathus;
    Haematopinus suis;
    Haematopinus eurysternus;
    Haematopinus asini;
    Haematopinus;
    Solenopotes capillatus;
    Bovicola bovis;
    Bovicola ovis;
    Bovicola caprae;
    Bovicola;
    Trichodectes canis;
    Felicola subrostratus;
    Menacanthus stramineus;
    Menopon gallinae;
    Goniodes;
    Goniocotes;
    Columbicola columbae;
    Columbicola;
    Philopterus;
    Brueelia;
    Ricinus;
    Heterodoxus spiniger;
    Gyropus ovalis;
    Gliricola porcelli;
    Lipeurus caponis
  `, [10]);

  samenvoegen("Kleerluis", "Lichaamsluis");

  koppelDieren(`
    Vlo;
    Kattenvlo;
    Hondenvlo;
    Mensenvlo;
    Rattenvlo;
    Noordelijke rattenvlo;
    Konijnenvlo;
    Egelvlo;
    Vogelvlo;
    Ceratophyllus;
    Leptopsylla segnis
  `, [34]);

  // ============================================================
  // DUIZENDPOTEN
  // ============================================================

  ongewervelden(`
    Duizendpoot=Centipede;
    Gewone duizendpoot=Lithobius forficatus;
    Lithobius variegatus;
    Lithobius melanops;
    Lithobius microps;
    Lithobius crassipes;
    Lithobius mutabilis;
    Lithobius agilis;
    Lithobius curtipes;
    Lithobius dentatus;
    Lithobius tricuspis;
    Lithobius borealis;
    Lithobius lapidicola;
    Lithobius macilentus;
    Lithobius piceus;
    Lithobius nodulipes;
    Lithobius calcaratus;
    Lithobius erythrocephalus;
    Lithobius;
    Lamyctes emarginatus;
    Lamyctes;
    Geophilus flavus;
    Geophilus electricus;
    Geophilus truncorum;
    Geophilus carpophagus;
    Geophilus alpinus;
    Geophilus insculptus;
    Geophilus;
    Strigamia maritima;
    Strigamia crassipes;
    Strigamia acuminata;
    Strigamia;
    Stigmatogaster subterranea;
    Stigmatogaster gracilis;
    Stigmatogaster;
    Schendyla nemorensis;
    Schendyla;
    Pachymerium ferrugineum;
    Henia vesuviana;
    Henia;
    Cryptops hortensis;
    Cryptops parisi;
    Cryptops anomalans;
    Cryptops;
    Huisscolopender=Scutigera coleoptrata;
    Thereuopoda longicornis;
    Thereuopoda;
    Scolopendra gigantea;
    Scolopendra subspinipes;
    Scolopendra dehaani;
    Scolopendra morsitans;
    Scolopendra polymorpha;
    Scolopendra heros;
    Scolopendra viridis;
    Scolopendra cingulata;
    Scolopendra canidens;
    Scolopendra oraniensis;
    Scolopendra valida;
    Scolopendra mirabilis;
    Scolopendra angulata;
    Scolopendra alternans;
    Scolopendra galapagoensis;
    Scolopendra hardwickei;
    Scolopendra multidens;
    Scolopendra japonica;
    Scolopendra hainanum;
    Scolopendra cataracta;
    Scolopendra alcyona;
    Scolopendra paradoxa;
    Scolopendra;
    Ethmostigmus rubripes;
    Ethmostigmus trigonopodus;
    Ethmostigmus;
    Rhysida longipes;
    Rhysida;
    Otostigmus;
    Otostigmus scaber;
    Otostigmus politus;
    Alipes;
    Alipes grandidieri;
    Alipes multicostis;
    Cormocephalus;
    Cormocephalus aurantiipes;
    Cormocephalus rubriceps;
    Newportia;
    Plutonium zwierleini;
    Theatops;
    Henicops
  `, [7, 17]);

  koppelDieren(`
    Duizendpoot;
    Gewone duizendpoot;
    Lithobius forficatus;
    Lithobius variegatus;
    Huisscolopender;
    Scolopendra gigantea;
    Scolopendra subspinipes;
    Scolopendra morsitans;
    Scolopendra heros;
    Scolopendra cingulata;
    Ethmostigmus rubripes;
    Otostigmus;
    Cormocephalus
  `, [15]);

  koppelDieren(`
    Geophilus flavus;
    Geophilus electricus;
    Geophilus truncorum;
    Geophilus carpophagus;
    Geophilus;
    Strigamia;
    Stigmatogaster subterranea;
    Schendyla nemorensis;
    Pachymerium ferrugineum
  `, [32]);

  koppelDieren(`
    Scolopendra gigantea;
    Scolopendra subspinipes;
    Scolopendra dehaani;
    Scolopendra morsitans;
    Scolopendra polymorpha;
    Scolopendra heros;
    Scolopendra cingulata;
    Scolopendra hardwickei;
    Ethmostigmus rubripes
  `, [45]);

  // ============================================================
  // MILJOENPOTEN
  // ============================================================

  ongewervelden(`
    Miljoenpoot=Millipede;
    Oprolmiljoenpoot=Glomeris marginata;
    Glomeris conspersa;
    Glomeris hexasticha;
    Glomeris intermedia;
    Glomeris pustulata;
    Glomeris undulata;
    Glomeris;
    Trachysphaera;
    Hyleoglomeris;
    Sphaerotherium;
    Sphaerotherium giganteum;
    Arthrosphaera;
    Arthrosphaera magna;
    Arthrosphaera brandtii;
    Zoosphaerium;
    Zoosphaerium neptunus;
    Zoosphaerium alluaudi;
    Archispirostreptus gigas;
    Afrikaanse reuzenmiljoenpoot;
    Archispirostreptus syriacus;
    Archispirostreptus;
    Spirostreptus;
    Spirostreptus servatius;
    Spirostreptus gregorius;
    Telodeinopus aoutii;
    Telodeinopus;
    Mardonius parilis;
    Mardonius;
    Doratogonus;
    Doratogonus uncinatus;
    Doratogonus rubipodus;
    Harpagophora;
    Ophistreptus;
    Centrobolus splendidus;
    Centrobolus fulgidus;
    Centrobolus anulatus;
    Centrobolus;
    Epibolus pulchripes;
    Chicobolus spinigerus;
    Narceus americanus;
    Narceus annularis;
    Narceus gordanus;
    Narceus;
    Orthoporus ornatus;
    Orthoporus;
    Anadenobolus monilicornis;
    Anadenobolus;
    Rhinocricus;
    Rhinocricus parcus;
    Salpidobolus;
    Trigoniulus corallinus;
    Trigoniulus;
    Spirobolus;
    Floridobolus;
    Julus scandinavius;
    Julus terrestris;
    Julus;
    Cylindroiulus punctatus;
    Cylindroiulus caeruleocinctus;
    Cylindroiulus britannicus;
    Cylindroiulus latestriatus;
    Cylindroiulus truncorum;
    Cylindroiulus londinensis;
    Cylindroiulus nitidus;
    Cylindroiulus;
    Ommatoiulus sabulosus;
    Ommatoiulus moreleti;
    Ommatoiulus;
    Tachypodoiulus niger;
    Tachypodoiulus;
    Ophyiulus pilosus;
    Ophyiulus;
    Leptoiulus;
    Brachyiulus pusillus;
    Brachyiulus;
    Blaniulus guttulatus;
    Blaniulus;
    Boreoiulus tenuis;
    Boreoiulus;
    Proteroiulus fuscus;
    Nopoiulus kochii;
    Choneiulus palmatus;
    Nemasoma varicorne;
    Polydesmus angustus;
    Polydesmus complanatus;
    Polydesmus denticulatus;
    Polydesmus coriaceus;
    Polydesmus inconstans;
    Polydesmus;
    Brachydesmus superus;
    Brachydesmus;
    Macrosternodesmus palicola;
    Ophiodesmus albonanus;
    Oxidus gracilis;
    Oxidus;
    Orthomorpha coarctata;
    Orthomorpha;
    Asiomorpha coarctata;
    Desmoxytes purpurosea;
    Desmoxytes;
    Anoplodesmus;
    Anoplodesmus saussurii;
    Harpaphe haydeniana;
    Apheloria virginiensis;
    Apheloria;
    Pachydesmus;
    Pseudopolydesmus;
    Euryurus;
    Euryurus leachii;
    Brachycybe;
    Brachycybe lecontii;
    Platydesmus;
    Octoglena;
    Illacme plenipes;
    Eumillipes persephone;
    Siphonophora;
    Siphonorhinus;
    Polyxenus lagurus;
    Polyxenus;
    Lophoproctus;
    Penicillata
  `, [7]);

  samenvoegen(
    "Afrikaanse reuzenmiljoenpoot",
    "Archispirostreptus gigas"
  );

  samenvoegen(
    "Orthomorpha coarctata",
    "Asiomorpha coarctata"
  );

  koppelDieren(`
    Miljoenpoot;
    Oprolmiljoenpoot;
    Afrikaanse reuzenmiljoenpoot;
    Narceus americanus;
    Orthoporus ornatus;
    Cylindroiulus punctatus;
    Ommatoiulus sabulosus;
    Tachypodoiulus niger;
    Polydesmus angustus
  `, [30]);

  // ============================================================
  // PISSEBEDDEN
  // ============================================================

  ongewervelden(`
    Pissebed=Woodlouse;
    Gewone oprolpissebed=Armadillidium vulgare;
    Armadillidium nasatum;
    Armadillidium depressum;
    Armadillidium pictum;
    Armadillidium pulchellum;
    Armadillidium maculatum;
    Armadillidium gestroi;
    Armadillidium klugii;
    Armadillidium granulatum;
    Armadillidium peraccae;
    Armadillidium versicolor;
    Armadillidium vulgare;
    Armadillidium;
    Kelderpissebed=Oniscus asellus;
    Oniscus;
    Ruwe pissebed=Porcellio scaber;
    Porcellio laevis;
    Porcellio dilatatus;
    Porcellio spinicornis;
    Porcellio hoffmannseggi;
    Porcellio expansus;
    Porcellio magnificus;
    Porcellio bolivari;
    Porcellio werneri;
    Porcellio ornatus;
    Porcellio flavomarginatus;
    Porcellio echinatus;
    Porcellio;
    Porcellionides pruinosus;
    Porcellionides floria;
    Porcellionides;
    Philoscia muscorum;
    Philoscia affinis;
    Philoscia;
    Trachelipus rathkii;
    Trachelipus;
    Hyloniscus riparius;
    Hyloniscus;
    Trichoniscus pusillus;
    Trichoniscus provisorius;
    Trichoniscus pygmaeus;
    Trichoniscus;
    Haplophthalmus danicus;
    Haplophthalmus mengei;
    Haplophthalmus;
    Platyarthrus hoffmannseggii;
    Platyarthrus;
    Androniscus dentiger;
    Androniscus;
    Cylisticus convexus;
    Cylisticus;
    Eluma caelata;
    Eluma;
    Helleria brevicornis;
    Helleria;
    Cubaris murina;
    Cubaris;
    Nesodillo;
    Merulanella;
    Troglodillo;
    Armadillo officinalis;
    Armadillo;
    Venezillo;
    Laevicaulis;
    Scleropactes;
    Balloniscus;
    Atlantoscia;
    Alloniscus;
    Tylos;
    Tylos europaeus;
    Tylos punctatus;
    Ligia oceanica;
    Ligia exotica;
    Ligia pallasii;
    Ligia italica;
    Ligia
  `);

  // Laevicaulis is een slakkengeslacht,
  // geen pissebed.

  verwijderDier("Laevicaulis");

  koppelDieren(`
    Pissebed;
    Gewone oprolpissebed;
    Kelderpissebed;
    Ruwe pissebed;
    Philoscia muscorum;
    Trichoniscus pusillus
  `, [10, 26]);

  koppelDieren(`
    Ligia oceanica;
    Ligia exotica;
    Tylos europaeus;
    Tylos punctatus
  `, [39]);

  // ============================================================
  // LANDSLAKKEN
  // ============================================================

  function landslakken(tekst, extra = []) {
    ongewervelden(tekst, [30, ...extra]);
  }

  landslakken(`
    Landslak=Land snail;
    Huisjesslak;
    Wijngaardslak=Helix pomatia;
    Helix lucorum;
    Helix lutescens;
    Helix melanostoma;
    Helix aperta;
    Helix;
    Segrijnslak=Cornu aspersum;
    Cornu;
    Gewone tuinslak=Cepaea nemoralis;
    Witgerande tuinslak=Cepaea hortensis;
    Cepaea;
    Arianta arbustorum;
    Arianta;
    Theba pisana;
    Theba;
    Eobania vermiculata;
    Eobania;
    Otala lactea;
    Otala punctata;
    Otala;
    Iberus gualtieranus;
    Iberus alonensis;
    Iberus;
    Cernuella virgata;
    Cernuella neglecta;
    Cernuella;
    Xerolenta obvia;
    Xerolenta;
    Helicella itala;
    Helicella;
    Helicopsis striata;
    Helicopsis;
    Xeroplexa;
    Xerocrassa;
    Trochoidea elegans;
    Trochoidea;
    Cochlicella acuta;
    Cochlicella barbara;
    Cochlicella;
    Monacha cantiana;
    Monacha cartusiana;
    Monacha;
    Hygromia cinctella;
    Hygromia;
    Euomphalia strigella;
    Euomphalia;
    Fruticicola fruticum;
    Fruticicola;
    Bradybaena similaris;
    Bradybaena;
    Trichia hispida;
    Trochulus hispidus;
    Trochulus striolatus;
    Trochulus;
    Pseudotrichia rubiginosa;
    Perforatella;
    Urticicola umbrosus;
    Urticicola;
    Acanthinula aculeata;
    Acanthinula;
    Vallonia pulchella;
    Vallonia costata;
    Vallonia excentrica;
    Vallonia;
    Pupilla muscorum;
    Pupilla;
    Vertigo pygmaea;
    Vertigo antivertigo;
    Vertigo angustior;
    Vertigo moulinsiana;
    Vertigo pusilla;
    Vertigo substriata;
    Vertigo;
    Columella edentula;
    Columella;
    Truncatellina cylindrica;
    Truncatellina;
    Lauria cylindracea;
    Lauria;
    Orcula;
    Sphyradium doliolum;
    Abida secale;
    Abida;
    Chondrina avenacea;
    Chondrina;
    Granaria frumentum;
    Granaria;
    Ena montana;
    Ena;
    Merdigera obscura;
    Merdigera;
    Zebrina detrita;
    Zebrina;
    Jaminia quadridens;
    Jaminia;
    Chondrula tridens;
    Chondrula;
    Cochlodina laminata;
    Cochlodina;
    Clausilia bidentata;
    Clausilia dubia;
    Clausilia pumila;
    Clausilia;
    Balea perversa;
    Balea heydeni;
    Balea;
    Alinda biplicata;
    Alinda;
    Macrogastra ventricosa;
    Macrogastra plicatula;
    Macrogastra attenuata;
    Macrogastra;
    Iphigena;
    Laciniaria plicata;
    Laciniaria;
    Bulgarica;
    Cochlicopa lubrica;
    Cochlicopa lubricella;
    Cochlicopa;
    Azeca goodalli;
    Azeca;
    Punctum pygmaeum;
    Punctum;
    Discus rotundatus;
    Discus ruderatus;
    Discus;
    Aegopinella nitidula;
    Aegopinella pura;
    Aegopinella nitens;
    Aegopinella;
    Nesovitrea hammonis;
    Nesovitrea petronella;
    Nesovitrea;
    Oxychilus cellarius;
    Oxychilus draparnaudi;
    Oxychilus alliarius;
    Oxychilus;
    Zonitoides nitidus;
    Zonitoides arboreus;
    Zonitoides;
    Vitrina pellucida;
    Vitrina;
    Semilimax semilimax;
    Semilimax;
    Eucobresia diaphana;
    Eucobresia;
    Vitrea crystallina;
    Vitrea contracta;
    Vitrea;
    Euconulus fulvus;
    Euconulus trochiformis;
    Euconulus;
    Vriesea;
    Carychium minimum;
    Carychium tridentatum;
    Carychium;
    Barnsteenslak;
    Succinea putris;
    Succinea;
    Oxyloma elegans;
    Oxyloma;
    Succinella oblonga;
    Succinella
  `, [33]);

  verwijderDier("Vriesea");

  samenvoegen("Trochulus hispidus", "Trichia hispida");

  koppelDieren(`
    Wijngaardslak;
    Segrijnslak;
    Gewone tuinslak;
    Witgerande tuinslak;
    Arianta arbustorum;
    Theba pisana;
    Cernuella virgata;
    Monacha cantiana;
    Monacha cartusiana;
    Hygromia cinctella;
    Trochulus hispidus;
    Vallonia pulchella;
    Vallonia costata;
    Pupilla muscorum;
    Vertigo pygmaea;
    Cochlicopa lubrica;
    Discus rotundatus;
    Oxychilus cellarius;
    Oxychilus draparnaudi;
    Vitrina pellucida;
    Succinea putris;
    Oxyloma elegans
  `, [26]);

  // ============================================================
  // AFRIKAANSE REUZENSLAKKEN EN TROPISCHE SLAKKEN
  // ============================================================

  landslakken(`
    Afrikaanse reuzenslak=Lissachatina fulica;
    Lissachatina reticulata;
    Lissachatina immaculata;
    Lissachatina albopicta;
    Lissachatina zanzibarica;
    Lissachatina allisa;
    Lissachatina;
    Achatina achatina;
    Achatina;
    Archachatina marginata;
    Archachatina degneri;
    Archachatina papyracea;
    Archachatina;
    Limicolaria flammea;
    Limicolaria aurora;
    Limicolaria;
    Burtoa nilotica;
    Burtoa;
    Pseudachatina;
    Metachatina;
    Subulina octona;
    Subulina;
    Allopeas gracile;
    Allopeas;
    Rumina decollata;
    Rumina;
    Euglandina rosea;
    Euglandina;
    Gulella;
    Streptaxis;
    Gonaxis;
    Gonospira;
    Rhytida;
    Powelliphanta;
    Powelliphanta superba;
    Powelliphanta hochstetteri;
    Powelliphanta augusta;
    Wainuia;
    Paryphanta busbyi;
    Paryphanta;
    Schizoglossa;
    Placostylus;
    Placostylus ambagiosus;
    Placostylus bollonsi;
    Placostylus hongii;
    Papustyla pulcherrima;
    Papustyla;
    Papuina;
    Helicostyla;
    Calocochlia;
    Amphidromus;
    Amphidromus perversus;
    Amphidromus atricallosus;
    Amphidromus inversus;
    Amphidromus palaceus;
    Amphidromus poecilochrous;
    Amphidromus schepmani;
    Liguus fasciatus;
    Liguus;
    Polymita picta;
    Polymita muscarum;
    Polymita sulphurosa;
    Polymita versicolor;
    Polymita venusta;
    Polymita;
    Zachrysia provisoria;
    Zachrysia;
    Caracolus caracolla;
    Caracolus;
    Pleurodonte;
    Cepolis;
    Camaena;
    Camaena cicatricosa;
    Camaena xanthoderma;
    Cyclophorus;
    Cyclophorus volvulus;
    Cyclophorus fulguratus;
    Cyclophorus aurantiacus;
    Cyclophorus formosensis;
    Leptopoma;
    Leptopoma vitreum;
    Leptopoma perlucidum;
    Japonia;
    Pterocyclos;
    Opisthoporus;
    Alycaeus;
    Rhiostoma;
    Rhiostoma housei;
    Plectostoma;
    Diplommatina;
    Acicula;
    Pomatias elegans;
    Pomatias;
    Megalobulimus;
    Megalobulimus oblongus;
    Megalobulimus abbreviatus;
    Strophocheilus;
    Bulimulus;
    Drymaeus;
    Drymaeus multicolor;
    Drymaeus;
    Orthalicus;
    Orthalicus reses;
    Sultana;
    Corona;
    Achatinella;
    Achatinella mustelina;
    Achatinella apexfulva;
    Partula;
    Partula suturalis;
    Partula nodosa;
    Partula taeniata;
    Partula rosea;
    Partula varia;
    Samoana;
    Eua;
    Tornatellides;
    Succinea caduca
  `, [33]);

  koppelDieren(`
    Afrikaanse reuzenslak;
    Lissachatina reticulata;
    Lissachatina immaculata;
    Achatina achatina;
    Archachatina marginata;
    Limicolaria flammea;
    Burtoa nilotica
  `, [5]);

  koppelDieren(`
    Euglandina rosea;
    Powelliphanta superba;
    Powelliphanta hochstetteri;
    Powelliphanta augusta;
    Paryphanta busbyi
  `, [17]);

  koppelDieren(`
    Papustyla pulcherrima;
    Polymita picta;
    Polymita muscarum;
    Amphidromus perversus;
    Liguus fasciatus
  `, [47]);

  // Achatinella apexfulva is uitgestorven.

  verwijderDier("Achatinella apexfulva");

  dier("Achatinella apexfulva", [43, 50]);

  // ============================================================
  // NAAKTSLAKKEN
  // ============================================================

  landslakken(`
    Naaktslak=Slug;
    Grote wegslak=Arion rufus;
    Spaanse wegslak=Arion vulgaris;
    Zwarte wegslak=Arion ater;
    Arion hortensis;
    Arion distinctus;
    Arion owenii;
    Arion subfuscus;
    Arion fuscus;
    Arion circumscriptus;
    Arion silvaticus;
    Arion fasciatus;
    Arion intermedius;
    Arion flagellus;
    Arion;
    Tijgerslak=Limax maximus;
    Grote aardslak;
    Limax cinereoniger;
    Limax corsicus;
    Limax;
    Gele keldernaaktslak=Limacus flavus;
    Limacus maculatus;
    Limacus;
    Gevlekte akkerslak=Deroceras reticulatum;
    Deroceras laeve;
    Deroceras agreste;
    Deroceras invadens;
    Deroceras panormitanum;
    Deroceras sturanyi;
    Deroceras;
    Boettgerilla pallens;
    Boettgerilla;
    Lehmannia marginata;
    Lehmannia valentiana;
    Lehmannia;
    Ambigolimax;
    Ambigolimax valentianus;
    Malacolimax tenellus;
    Malacolimax;
    Tandonia budapestensis;
    Tandonia sowerbyi;
    Tandonia rustica;
    Tandonia;
    Milax gagates;
    Milax nigricans;
    Milax;
    Testacella haliotidea;
    Testacella scutulum;
    Testacella;
    Ariolimax columbianus;
    Bananenslak;
    Ariolimax dolichophallus;
    Ariolimax californicus;
    Ariolimax;
    Philomycus carolinianus;
    Philomycus;
    Pallifera;
    Megapallifera;
    Geomalacus maculosus;
    Geomalacus;
    Triboniophorus graeffei;
    Triboniophorus;
    Athoracophorus bitentaculatus;
    Athoracophorus;
    Laevicaulis alte;
    Laevicaulis;
    Sarasinula plebeia;
    Sarasinula;
    Veronicella cubensis;
    Veronicella;
    Semperula;
    Belocaulus;
    Diplosolenodes;
    Rathouisia;
    Atopos;
    Apera;
    Chlamydephorus;
    Schizoglossa;
    Selenochlamys ysbryda;
    Selenochlamys
  `);

  samenvoegen("Tijgerslak", "Grote aardslak");

  samenvoegen(
    "Ambigolimax valentianus",
    "Lehmannia valentiana"
  );

  koppelDieren(`
    Naaktslak;
    Grote wegslak;
    Spaanse wegslak;
    Zwarte wegslak;
    Arion hortensis;
    Arion distinctus;
    Arion subfuscus;
    Arion intermedius;
    Tijgerslak;
    Gele keldernaaktslak;
    Gevlekte akkerslak;
    Deroceras laeve;
    Deroceras invadens;
    Boettgerilla pallens;
    Lehmannia marginata;
    Ambigolimax valentianus;
    Malacolimax tenellus;
    Tandonia budapestensis;
    Milax gagates
  `, [26]);

  koppelDieren(`
    Testacella haliotidea;
    Testacella scutulum;
    Selenochlamys ysbryda
  `, [17]);

  koppelDieren(`
    Bananenslak;
    Ariolimax columbianus;
    Ariolimax dolichophallus;
    Ariolimax californicus;
    Triboniophorus graeffei
  `, [47]);

  // ============================================================
  // REGENWORMEN
  // ============================================================

  ongewervelden(`
    Regenworm=Earthworm;
    Gewone regenworm=Lumbricus terrestris;
    Rode regenworm=Lumbricus rubellus;
    Lumbricus castaneus;
    Lumbricus festivus;
    Lumbricus friendi;
    Lumbricus;
    Tijgerworm=Eisenia fetida;
    Eisenia andrei;
    Eisenia lucens;
    Eisenia;
    Dendrobaena veneta;
    Dendrobaena octaedra;
    Dendrobaena attemsi;
    Dendrobaena;
    Dendrodrilus rubidus;
    Dendrodrilus;
    Aporrectodea caliginosa;
    Aporrectodea longa;
    Aporrectodea rosea;
    Aporrectodea trapezoides;
    Aporrectodea nocturna;
    Aporrectodea;
    Allolobophora chlorotica;
    Allolobophora;
    Octolasion cyaneum;
    Octolasion lacteum;
    Octolasion;
    Eiseniella tetraedra;
    Eiseniella;
    Bimastos;
    Bimastos parvus;
    Bimastos rubidus;
    Bimastos eiseni;
    Helodrilus;
    Murchieona muldali;
    Murchieona;
    Microscolex phosphoreus;
    Microscolex;
    Amynthas agrestis;
    Amynthas corticis;
    Amynthas gracilis;
    Amynthas tokioensis;
    Amynthas;
    Metaphire californica;
    Metaphire hilgendorfi;
    Metaphire;
    Pheretima;
    Polypheretima;
    Perionyx excavatus;
    Perionyx;
    Eudrilus eugeniae;
    Eudrilus;
    Pontoscolex corethrurus;
    Pontoscolex;
    Megascolides australis;
    Megascolides;
    Microchaetus rappi;
    Microchaetus;
    Rhinodrilus;
    Rhinodrilus alatus;
    Glossoscolex;
    Glossoscolex giganteus;
    Martiodrilus;
    Hormogaster;
    Criodrilus lacuum;
    Criodrilus;
    Sparganophilus;
    Drawida;
    Moniligaster;
    Kynotus;
    Dichogaster;
    Dichogaster bolaui;
    Ocnerodrilus;
    Diplocardia;
    Acanthodrilus;
    Maoridrilus;
    Notoscolex;
    Terrisswalkerius;
    Octochaetona;
    Lampito mauritii;
    Lampito
  `, [7, 32]);

  koppelDieren(`
    Regenworm;
    Gewone regenworm;
    Rode regenworm;
    Lumbricus castaneus;
    Tijgerworm;
    Eisenia andrei;
    Dendrobaena veneta;
    Dendrobaena octaedra;
    Aporrectodea caliginosa;
    Aporrectodea longa;
    Aporrectodea rosea;
    Allolobophora chlorotica;
    Octolasion cyaneum;
    Octolasion lacteum;
    Eiseniella tetraedra
  `, [26]);

  // ============================================================
  // PLATWORMEN
  // ============================================================

  ongewervelden(`
    Platworm=Flatworm;
    Landplatworm;
    Hamerhoofdplatworm;
    Bipalium kewense;
    Bipalium adventitium;
    Bipalium vagum;
    Bipalium;
    Diversibipalium;
    Humbertium;
    Novibipalium;
    Obama nungara;
    Obama;
    Arthurdendyus triangulatus;
    Arthurdendyus;
    Caenoplana coerulea;
    Caenoplana variegata;
    Caenoplana;
    Australopacifica;
    Parakontikia ventrolineata;
    Parakontikia;
    Kontikia;
    Microplana terrestris;
    Microplana scharffi;
    Microplana;
    Rhynchodemus sylvaticus;
    Rhynchodemus;
    Geoplana;
    Geoplana vaginuloides;
    Geoplana quagga;
    Cephaloflexa;
    Choeradoplana;
    Luteostriata;
    Imbira;
    Cratera;
    Pasipha;
    Xerapoa;
    Notogynaphallia;
    Pseudogeoplana;
    Dolichoplana striata;
    Dolichoplana;
    Platydemus manokwari;
    Platydemus;
    Australoplana sanguinea;
    Australoplana;
    Planaria;
    Dugesia;
    Dugesia japonica;
    Dugesia gonocephala;
    Girardia tigrina;
    Girardia;
    Schmidtea mediterranea;
    Schmidtea polychroa;
    Schmidtea;
    Polycelis nigra;
    Polycelis tenuis;
    Polycelis felina;
    Polycelis;
    Dendrocoelum lacteum;
    Dendrocoelum;
    Crenobia alpina;
    Crenobia;
    Phagocata;
    Bdelloura;
    Lintworm;
    Runderlintworm=Taenia saginata;
    Varkenslintworm=Taenia solium;
    Taenia asiatica;
    Taenia;
    Echinococcus granulosus;
    Echinococcus multilocularis;
    Echinococcus;
    Hymenolepis nana;
    Hymenolepis diminuta;
    Hymenolepis;
    Dipylidium caninum;
    Dipylidium;
    Leverbot=Fasciola hepatica;
    Fasciola gigantica;
    Fasciola;
    Dicrocoelium dendriticum;
    Dicrocoelium;
    Schistosoma mansoni;
    Schistosoma haematobium;
    Schistosoma japonicum;
    Schistosoma;
    Clonorchis sinensis;
    Opisthorchis viverrini;
    Opisthorchis felineus;
    Paragonimus westermani
  `);

  koppelDieren(`
    Hamerhoofdplatworm;
    Bipalium kewense;
    Bipalium adventitium;
    Bipalium vagum;
    Obama nungara;
    Arthurdendyus triangulatus;
    Caenoplana coerulea;
    Platydemus manokwari
  `, [17, 30]);

  koppelDieren(`
    Planaria;
    Dugesia;
    Dugesia japonica;
    Dugesia gonocephala;
    Girardia tigrina;
    Schmidtea mediterranea;
    Schmidtea polychroa;
    Polycelis nigra;
    Polycelis tenuis;
    Polycelis felina;
    Dendrocoelum lacteum;
    Crenobia alpina
  `, [1, 10]);

  // ============================================================
  // RONDWORMEN
  // ============================================================

  ongewervelden(`
    Rondworm=Nematode;
    Aaltje;
    Caenorhabditis elegans;
    Caenorhabditis briggsae;
    Caenorhabditis remanei;
    Caenorhabditis;
    Pristionchus pacificus;
    Pristionchus;
    Panagrellus redivivus;
    Panagrellus;
    Azijnaaltje=Turbatrix aceti;
    Turbatrix;
    Meloidogyne incognita;
    Meloidogyne javanica;
    Meloidogyne arenaria;
    Meloidogyne hapla;
    Meloidogyne;
    Globodera rostochiensis;
    Globodera pallida;
    Globodera;
    Heterodera schachtii;
    Heterodera glycines;
    Heterodera;
    Ditylenchus dipsaci;
    Ditylenchus destructor;
    Ditylenchus;
    Pratylenchus penetrans;
    Pratylenchus;
    Radopholus similis;
    Radopholus;
    Bursaphelenchus xylophilus;
    Bursaphelenchus;
    Aphelenchoides;
    Aphelenchoides besseyi;
    Aphelenchoides fragariae;
    Trichodorus;
    Paratrichodorus;
    Xiphinema;
    Longidorus;
    Steinernema feltiae;
    Steinernema carpocapsae;
    Steinernema kraussei;
    Steinernema;
    Heterorhabditis bacteriophora;
    Heterorhabditis megidis;
    Heterorhabditis;
    Spoelworm=Ascaris lumbricoides;
    Ascaris suum;
    Ascaris;
    Aarsmade=Enterobius vermicularis;
    Enterobius;
    Toxocara canis;
    Toxocara cati;
    Toxocara;
    Zweepworm=Trichuris trichiura;
    Trichuris vulpis;
    Trichuris suis;
    Trichuris;
    Trichinella spiralis;
    Trichinella;
    Haakworm;
    Ancylostoma duodenale;
    Ancylostoma caninum;
    Ancylostoma braziliense;
    Ancylostoma;
    Necator americanus;
    Necator;
    Strongyloides stercoralis;
    Strongyloides;
    Haemonchus contortus;
    Haemonchus;
    Ostertagia ostertagi;
    Ostertagia;
    Cooperia;
    Nippostrongylus brasiliensis;
    Heligmosomoides polygyrus;
    Wuchereria bancrofti;
    Brugia malayi;
    Onchocerca volvulus;
    Loa loa;
    Dirofilaria immitis;
    Dirofilaria repens;
    Dracunculus medinensis;
    Anisakis simplex;
    Anisakis;
    Pseudoterranova;
    Angiostrongylus cantonensis;
    Angiostrongylus vasorum;
    Gnathostoma spinigerum
  `);

  koppelDieren(`
    Aaltje;
    Caenorhabditis elegans;
    Caenorhabditis briggsae;
    Caenorhabditis remanei;
    Pristionchus pacificus;
    Panagrellus redivivus;
    Azijnaaltje;
    Meloidogyne incognita;
    Meloidogyne javanica;
    Meloidogyne arenaria;
    Meloidogyne hapla;
    Globodera rostochiensis;
    Globodera pallida;
    Heterodera schachtii;
    Heterodera glycines;
    Ditylenchus dipsaci;
    Ditylenchus destructor;
    Pratylenchus penetrans;
    Radopholus similis;
    Steinernema feltiae;
    Steinernema carpocapsae;
    Steinernema kraussei;
    Heterorhabditis bacteriophora;
    Heterorhabditis megidis
  `, [10]);

  // ============================================================
  // BEERDIERTJES
  // ============================================================

  ongewervelden(`
    Beerdiertje=Tardigrade=Waterbeertje;
    Hypsibius exemplaris;
    Hypsibius dujardini;
    Hypsibius;
    Ramazzottius varieornatus;
    Ramazzottius oberhaeuseri;
    Ramazzottius;
    Milnesium tardigradum;
    Milnesium;
    Macrobiotus hufelandi;
    Macrobiotus;
    Richtersius coronifer;
    Richtersius;
    Paramacrobiotus richtersi;
    Paramacrobiotus;
    Dactylobiotus;
    Dactylobiotus dispar;
    Murrayon;
    Murrayon pullari;
    Isohypsibius;
    Isohypsibius prosostomus;
    Diphascon;
    Diphascon pingue;
    Adropion;
    Astatumen;
    Platicrista;
    Echiniscus;
    Echiniscus testudo;
    Echiniscus blumi;
    Echiniscus quadrispinosus;
    Echiniscus viridis;
    Echiniscus granulatus;
    Pseudechiniscus;
    Pseudechiniscus suillus;
    Cornechiniscus;
    Bryodelphax;
    Bryochoerus;
    Hypechiniscus;
    Testechiniscus;
    Proechiniscus;
    Heterotardigrada;
    Eutardigrada;
    Batillipes;
    Batillipes mirus;
    Batillipes pennaki;
    Echiniscoides;
    Echiniscoides sigismundi;
    Actinarctus;
    Halechiniscus;
    Florarctus;
    Styraconyx;
    Renaudarctus
  `, [7, 10]);

  koppelDieren(`
    Batillipes;
    Batillipes mirus;
    Batillipes pennaki;
    Echiniscoides;
    Echiniscoides sigismundi;
    Actinarctus;
    Halechiniscus;
    Florarctus;
    Styraconyx;
    Renaudarctus
  `, [1, 11]);

  // ============================================================
  // FLUWEELWORMEN
  // ============================================================

  ongewervelden(`
    Fluweelworm=Onychophora;
    Peripatus;
    Peripatus juliformis;
    Epiperipatus;
    Epiperipatus biolleyi;
    Epiperipatus isthmicola;
    Epiperipatus edwardsii;
    Epiperipatus broadwayi;
    Macroperipatus;
    Macroperipatus torquatus;
    Oroperipatus;
    Oroperipatus eisenii;
    Principapillatus hitoyensis;
    Principapillatus;
    Eoperipatus;
    Eoperipatus totoro;
    Typhloperipatus williamsoni;
    Mesoperipatus tholloni;
    Peripatopsis;
    Peripatopsis capensis;
    Peripatopsis moseleyi;
    Peripatopsis balfouri;
    Peripatopsis sedgwicki;
    Opisthopatus;
    Opisthopatus cinctipes;
    Peripatoides;
    Peripatoides novaezealandiae;
    Peripatoides sympatrica;
    Ooperipatellus;
    Ooperipatellus viridimaculatus;
    Euperipatoides;
    Euperipatoides rowelli;
    Euperipatoides kanangrensis;
    Euperipatoides leuckartii;
    Cephalofovea;
    Planipapillus;
    Phallocephale;
    Ruhbergia;
    Tasmanipatus barretti;
    Tasmanipatus anophthalmus;
    Tasmanipatus
  `, [17]);

  // ============================================================
  // EXTRA ONGEWERVELDEN
  // ============================================================

  ongewervelden(`
    Pauropode;
    Pauropus;
    Pauropus huxleyi;
    Allopauropus;
    Decapauropus;
    Eurypauropus;
    Symphyla;
    Tuinsymfyl=Scolopendrella;
    Scutigerella immaculata;
    Scutigerella;
    Hanseniella;
    Symphylella;
    Protura;
    Acerentomon;
    Acerentomon doderoi;
    Acerentulus;
    Eosentomon;
    Eosentomon transitorium;
    Sinentomon;
    Diplura;
    Campodea;
    Campodea staphylinus;
    Campodea fragilis;
    Campodea plusiochaeta;
    Japyx;
    Japyx solifugus;
    Metajapyx;
    Heterojapyx;
    Parajapyx;
    Projapyx;
    Octostigma;
    Nematomorpha;
    Paardenhaarworm;
    Gordius aquaticus;
    Gordius;
    Paragordius;
    Paragordius varius;
    Chordodes;
    Chordodes formosanus;
    Chordodes japonensis
  `);

  koppelDieren(`
    Pauropode;
    Pauropus;
    Pauropus huxleyi;
    Allopauropus;
    Decapauropus;
    Symphyla;
    Tuinsymfyl;
    Scutigerella immaculata;
    Scutigerella;
    Hanseniella;
    Symphylella;
    Protura;
    Acerentomon;
    Acerentulus;
    Eosentomon;
    Diplura;
    Campodea;
    Campodea staphylinus;
    Campodea fragilis;
    Japyx
  `, [10, 32]);

  // ============================================================
  // VRAAG 6 - DIEREN IN BOSSEN
  // ============================================================

  koppelDieren(`
    Kruisspin;
    Marmerspin;
    Hoekige wielwebspin;
    Platte wielwebspin;
    Gewone wolfspin;
    Pardosa lugubris;
    Pardosa saltans;
    Trochosa terricola;
    Schorsmarpissa;
    Dendryphantes rudis;
    Rode bosmier;
    Kale bosmier;
    Formica pratensis;
    Formica lugubris;
    Formica aquilonia;
    Formica truncorum;
    Grauwzwarte mier;
    Bossteekmier;
    Temnothorax nylanderi;
    Leptothorax acervorum;
    Camponotus herculeanus;
    Camponotus ligniperda;
    Gouden loopkever;
    Paarse loopkever;
    Tuinloopkever;
    Carabus coriaceus;
    Carabus hortensis;
    Carabus glabratus;
    Carabus intricatus;
    Carabus auronitens;
    Carabus linnei;
    Cychrus caraboides;
    Pterostichus oblongopunctatus;
    Abax parallelepipedus;
    Platynus assimilis;
    Stinkende kortschildkever;
    Vliegend hert;
    Klein vliegend hert;
    Muskusboktor;
    Grote eikenboktor;
    Rosaliaboktor;
    Lederboktor;
    Grijze ribbelboktor;
    Letterzetter;
    Tomicus piniperda;
    Hylobius abietis;
    Pissodes pini;
    Eikenboorder;
    Gewone duizendpoot;
    Lithobius variegatus;
    Lithobius mutabilis;
    Oprolmiljoenpoot;
    Cylindroiulus punctatus;
    Kelderpissebed;
    Ruwe pissebed;
    Philoscia muscorum;
    Wijngaardslak;
    Arianta arbustorum;
    Discus rotundatus;
    Aegopinella nitidula;
    Clausilia bidentata;
    Grote wegslak;
    Zwarte wegslak;
    Malacolimax tenellus;
    Lehmannia marginata;
    Rode regenworm;
    Dendrobaena octaedra
  `, [6]);

  // ============================================================
  // VRAAG 10 - KLEINER DAN EEN MUIS
  // ============================================================

  koppelDieren(`
    Kruisspin;
    Komkommerspin;
    Gewone wolfspin;
    Springspin;
    Huiszebraspin;
    Schorsmarpissa;
    Gewone kameleonspin;
    Krabspin;
    Herfstspin;
    Strekspin;
    Hangmatspin;
    Venstersectorspin;
    Kogelspin;
    Valse weduwe;
    Gewone huisspin;
    Kleine trilspin;
    Spoorspin;
    Pissebeddenjager;
    Lieveheersbeestjesspin;
    Gewone hooiwagen;
    Hooiwagen;
    Boekenschorpioen;
    Pseudoschorpioen;
    Teek;
    Mijt;
    Huisstofmijt;
    Schurftmijt;
    Oormijt;
    Haarfollikelmijt;
    Mier;
    Zwarte wegmier;
    Gele weidemier;
    Rode bosmier;
    Gewone steekmier;
    Faraomier;
    Argentijnse mier;
    Vuurmier;
    Bladsnijdersmier;
    Wevermier;
    Termiet;
    Loopkever;
    Gouden loopkever;
    Paarse loopkever;
    Tuinloopkever;
    Snuitkever;
    Taxuskever;
    Graanklander;
    Rijstklander;
    Maisklander;
    Eikenboorder;
    Hazelnootboorder;
    Letterzetter;
    Appelbloesemkever;
    Aardbeibloesemkever;
    Meelwormkever;
    Broodkever;
    Tabakskever;
    Museumkever;
    Tapijtkever;
    Kniptor;
    Oorworm;
    Gewone oorworm;
    Kleine oorworm;
    Zilvervisje;
    Papiervisje;
    Ovenvisje;
    Springstaart;
    Vlo;
    Hoofdluis;
    Kleerluis;
    Pissebed;
    Ruwe pissebed;
    Gewone oprolpissebed;
    Kelderpissebed;
    Trichoniscus pusillus;
    Oprolmiljoenpoot;
    Pupilla muscorum;
    Vertigo pygmaea;
    Vertigo angustior;
    Punctum pygmaeum;
    Vallonia pulchella;
    Vallonia costata;
    Carychium minimum;
    Beerdiertje;
    Aaltje;
    Caenorhabditis elegans;
    Azijnaaltje
  `, [10]);

  // ============================================================
  // VRAAG 26 - NEDERLAND
  // ============================================================

  koppelDieren(`
    Kruisspin;
    Viervlekwielwebspin;
    Marmerspin;
    Wespspin;
    Brugspin;
    Rietkruisspin;
    Venstersectorspin;
    Platte wielwebspin;
    Komkommerspin;
    Gewone strekspin;
    Herfstspin;
    Zomerherfstspin;
    Holenwielwebspin;
    Huiszebraspin;
    Schorsmarpissa;
    Evarcha falcata;
    Evarcha arcuata;
    Heliophanus cupreus;
    Heliophanus flavipes;
    Gewone wolfspin;
    Pardosa lugubris;
    Pardosa palustris;
    Pardosa pullata;
    Pardosa prativaga;
    Trochosa terricola;
    Trochosa ruricola;
    Arctosa perita;
    Arctosa cinerea;
    Pirata piraticus;
    Gewone kameleonspin;
    Xysticus cristatus;
    Xysticus kochi;
    Diaea dorsata;
    Philodromus aureolus;
    Grote steatoda;
    Huissteatoda;
    Valse weduwe;
    Gewone huiskogelspin;
    Enoplognatha ovata;
    Grote huisspin;
    Gewone huisspin;
    Gewone doolhofspin;
    Kraamwebspin;
    Grote gerande oeverspin;
    Kleine gerande oeverspin;
    Micrommata virescens;
    Grote trilspin;
    Kleine trilspin;
    Gewone kaardespin;
    Amaurobius similis;
    Amaurobius ferox;
    Nigma walckenaeri;
    Drassodes lapidosus;
    Zelotes subterraneus;
    Scotophaeus blackwalli;
    Pissebeddenjager;
    Segestria senoculata;
    Linyphia triangularis;
    Erigone atra;
    Erigone dentipalpis;
    Gewone hooiwagen;
    Opilio canestrinii;
    Leiobunum rotundum;
    Leiobunum blackwalli;
    Mitopus morio;
    Oligolophus tridens;
    Rilaena triangularis;
    Dicranopalpus ramosus;
    Boekenschorpioen;
    Neobisium carcinoides;
    Schapenteek;
    Ixodes hexagonus;
    Dermacentor reticulatus;
    Huisstofmijt;
    Varroamijt;
    Fluweelmijt;
    Trombidium holosericeum;
    Zwarte wegmier;
    Gele weidemier;
    Bruine wegmier;
    Glanzende houtmier;
    Rode bosmier;
    Kale bosmier;
    Formica pratensis;
    Grauwzwarte mier;
    Formica cunicularia;
    Formica rufibarbis;
    Formica sanguinea;
    Gewone steekmier;
    Bossteekmier;
    Zandsteekmier;
    Myrmica scabrinodis;
    Myrmica schencki;
    Myrmica rugulosa;
    Temnothorax nylanderi;
    Leptothorax acervorum;
    Zwarte zaadmier;
    Faraomier;
    Solenopsis fugax;
    Lasius neglectus;
    Gouden loopkever;
    Paarse loopkever;
    Tuinloopkever;
    Carabus granulatus;
    Carabus cancellatus;
    Carabus coriaceus;
    Carabus problematicus;
    Carabus arvensis;
    Carabus hortensis;
    Carabus glabratus;
    Carabus nitens;
    Carabus clathratus;
    Nebria brevicollis;
    Notiophilus biguttatus;
    Pterostichus melanarius;
    Pterostichus niger;
    Pterostichus madidus;
    Poecilus cupreus;
    Poecilus versicolor;
    Calathus fuscipes;
    Calathus melanocephalus;
    Anchomenus dorsalis;
    Amara aenea;
    Amara familiaris;
    Harpalus affinis;
    Harpalus rufipes;
    Brachinus crepitans;
    Broscus cephalotes;
    Stinkende kortschildkever;
    Creophilus maxillosus;
    Paederus riparius;
    Paederus littoralis;
    Tachyporus hypnorum;
    Taxuskever;
    Phyllobius argentatus;
    Phyllobius pomaceus;
    Polydrusus formosus;
    Sitona lineatus;
    Eikenboorder;
    Hazelnootboorder;
    Appelbloesemkever;
    Aardbeibloesemkever;
    Letterzetter;
    Tomicus piniperda;
    Hylobius abietis;
    Pissodes pini;
    Graanklander;
    Rijstklander;
    Meelwormkever;
    Opatrum sabulosum;
    Agriotes lineatus;
    Agriotes obscurus;
    Athous haemorrhoidalis;
    Broodkever;
    Tabakskever;
    Gewone houtwormkever;
    Grote houtwormkever;
    Museumkever;
    Tapijtkever;
    Dermestes lardarius;
    Oedemera nobilis;
    Meloe proscarabaeus;
    Meloe violaceus;
    Gewone oorworm;
    Kleine oorworm;
    Zandoorworm;
    Struikoorworm;
    Ectobius lapponicus;
    Ectobius pallidus;
    Ectobius sylvestris;
    Ectobius panzeri;
    Zilvervisje;
    Papiervisje;
    Ovenvisje;
    Orchesella cincta;
    Entomobrya nivalis;
    Tomocerus minor;
    Tomocerus vulgaris;
    Allacma fusca;
    Kattenvlo;
    Hondenvlo;
    Egelvlo;
    Hoofdluis;
    Gewone duizendpoot;
    Lithobius variegatus;
    Lithobius melanops;
    Lithobius microps;
    Lithobius crassipes;
    Geophilus flavus;
    Geophilus electricus;
    Geophilus truncorum;
    Cryptops hortensis;
    Cryptops parisi;
    Oprolmiljoenpoot;
    Julus scandinavius;
    Cylindroiulus punctatus;
    Cylindroiulus caeruleocinctus;
    Ommatoiulus sabulosus;
    Tachypodoiulus niger;
    Blaniulus guttulatus;
    Polydesmus angustus;
    Polydesmus denticulatus;
    Kelderpissebed;
    Ruwe pissebed;
    Gewone oprolpissebed;
    Armadillidium nasatum;
    Porcellio spinicornis;
    Philoscia muscorum;
    Trachelipus rathkii;
    Hyloniscus riparius;
    Trichoniscus pusillus;
    Platyarthrus hoffmannseggii;
    Ligia oceanica;
    Wijngaardslak;
    Segrijnslak;
    Gewone tuinslak;
    Witgerande tuinslak;
    Grote wegslak;
    Spaanse wegslak;
    Zwarte wegslak;
    Tijgerslak;
    Gevlekte akkerslak;
    Regenworm;
    Gewone regenworm;
    Rode regenworm;
    Tijgerworm;
    Obama nungara
  `, [26]);

  // ============================================================
  // VRAAG 27 - NACHTACTIEVE DIEREN
  // ============================================================

  koppelDieren(`
    Vogelspin;
    Chileense vogelspin;
    Braziliaanse zwarte vogelspin;
    Goliathvogelspin;
    Mexicaanse roodknievogelspin;
    Oranje bavianenspin;
    Blauwe kobaltvogelspin;
    Koningsbavianenspin;
    Schorpioen;
    Keizerschorpioen;
    Hadrurus arizonensis;
    Androctonus australis;
    Leiurus quinquestriatus;
    Zweepspin;
    Zweepschorpioen;
    Stinkende kortschildkever;
    Oorworm;
    Gewone oorworm;
    Oosterse kakkerlak;
    Madagaskar-sissende kakkerlak;
    Blaberus giganteus;
    Blaptica dubia;
    Zilvervisje;
    Papiervisje;
    Ovenvisje;
    Gewone duizendpoot;
    Huisscolopender;
    Regenworm;
    Gewone regenworm;
    Grote wegslak;
    Spaanse wegslak;
    Zwarte wegslak;
    Tijgerslak;
    Gevlekte akkerslak
  `, [27]);

  // ============================================================
  // VRAAG 32 - ONDERGRONDS LEVENDE DIEREN
  // ============================================================

  koppelDieren(`
    Regenworm;
    Gewone regenworm;
    Aporrectodea longa;
    Aporrectodea caliginosa;
    Aporrectodea rosea;
    Allolobophora chlorotica;
    Megascolides australis;
    Microchaetus rappi;
    Rhinodrilus alatus;
    Aaltje;
    Caenorhabditis elegans;
    Steinernema feltiae;
    Steinernema carpocapsae;
    Heterorhabditis bacteriophora;
    Geophilus flavus;
    Geophilus electricus;
    Geophilus truncorum;
    Stigmatogaster subterranea;
    Brachyiulus pusillus;
    Blaniulus guttulatus;
    Boreoiulus tenuis;
    Macrosternodesmus palicola;
    Platyarthrus hoffmannseggii;
    Symphyla;
    Scutigerella immaculata;
    Protura;
    Acerentomon;
    Diplura;
    Campodea;
    Solenopsis fugax;
    Gele weidemier;
    Zwarte wegmier;
    Formica fusca;
    Messor barbarus;
    Pogonomyrmex barbatus;
    Myrmecocystus mexicanus;
    Myrmecocystus mendax;
    Reticulitermes flavipes;
    Reticulitermes lucifugus;
    Coptotermes formosanus;
    Trapdoorspin;
    Koningsbavianenspin;
    Blauwe kobaltvogelspin
  `, [32]);

  // ============================================================
  // VRAAG 33 - DIEREN MET EEN SCHILD
  // ============================================================

  // Een slakkenhuis geldt niet automatisch als
  // een schild. De koppelingen worden verwijderd.

  koppelDieren(`
    Gordeldier;
    Negenbandgordeldier;
    Driebandgordeldier;
    Reuzengordeldier;
    Zesbandgordeldier;
    Landschildpad;
    Waterschildpad;
    Zeeschildpad;
    Schildpad;
    Gewone oprolpissebed;
    Armadillidium maculatum;
    Armadillidium klugii;
    Oprolmiljoenpoot
  `, [33]);

  for (const record of database.values()) {
    if (
      record.vragen.has(30) &&
      /slak|snail/i.test(record.naam)
    ) {
      record.vragen.delete(33);
    }
  }

  // Verwijder vraag 33 bij de eerder toegevoegde
  // wetenschappelijke landslaknamen.

  for (const record of database.values()) {
    if (
      record.vragen.has(30) &&
      record.vragen.has(33) &&
      !/schildpad|gordeldier|pissebed|miljoenpoot/i.test(
        record.naam
      )
    ) {
      record.vragen.delete(33);
    }
  }

  // ============================================================
  // VRAAG 35 - KLIMMENDE DIEREN
  // ============================================================

  koppelDieren(`
    Kruisspin;
    Wespspin;
    Huiszebraspin;
    Schorsmarpissa;
    Phidippus regius;
    Phidippus audax;
    Heteropoda venatoria;
    Avicularia avicularia;
    Caribena versicolor;
    Psalmopoeus irminia;
    Poecilotheria regalis;
    Poecilotheria metallica;
    Mier;
    Zwarte wegmier;
    Wevermier;
    Oecophylla smaragdina;
    Oecophylla longinoda;
    Camponotus ligniperda;
    Camponotus herculeanus;
    Cephalotes atratus;
    Wandelende tak;
    Indische wandelende tak;
    Vietnamese wandelende tak;
    Australische wandelende tak;
    Wandelend blad;
    Bidsprinkhaan;
    Orchideebidsprinkhaan;
    Gewone oorworm;
    Ruwe pissebed;
    Wijngaardslak;
    Segrijnslak;
    Gewone tuinslak;
    Witgerande tuinslak
  `, [35]);

  // ============================================================
  // VRAAG 40 - GROEPSDIEREN
  // ============================================================

  koppelDieren(`
    Mier;
    Zwarte wegmier;
    Gele weidemier;
    Rode bosmier;
    Kale bosmier;
    Bossteekmier;
    Gewone steekmier;
    Bladsnijdersmier;
    Atta cephalotes;
    Atta sexdens;
    Trekmier;
    Eciton burchellii;
    Dorylus;
    Argentijnse mier;
    Faraomier;
    Rode vuurmier;
    Zwarte vuurmier;
    Wevermier;
    Oecophylla smaragdina;
    Honingpotmier;
    Bulldogmier;
    Kogelmier;
    Termiet;
    Macrotermes bellicosus;
    Macrotermes natalensis;
    Nasutitermes corniger;
    Reticulitermes flavipes;
    Coptotermes formosanus;
    Stegodyphus dumicola;
    Stegodyphus mimosarum
  `, [40]);

  // ============================================================
  // VRAAG 41 - NESTEN BOUWEN
  // ============================================================

  koppelDieren(`
    Mier;
    Zwarte wegmier;
    Gele weidemier;
    Rode bosmier;
    Kale bosmier;
    Gewone steekmier;
    Bossteekmier;
    Zandsteekmier;
    Faraomier;
    Argentijnse mier;
    Rode vuurmier;
    Wevermier;
    Oecophylla smaragdina;
    Oecophylla longinoda;
    Bladsnijdersmier;
    Atta cephalotes;
    Atta sexdens;
    Atta laevigata;
    Acromyrmex octospinosus;
    Messor barbarus;
    Honingpotmier;
    Kogelmier;
    Bulldogmier;
    Termiet;
    Macrotermes bellicosus;
    Macrotermes natalensis;
    Macrotermes michaelseni;
    Amitermes meridionalis;
    Nasutitermes corniger;
    Reticulitermes flavipes;
    Coptotermes formosanus
  `, [41]);

  // Trekmieren bouwen doorgaans tijdelijke
  // verblijfplaatsen, niet altijd vaste nesten.
  // Geen algemene nestkoppeling voor alle soorten.

  verwijderKoppeling("Trekmier", [41]);
  verwijderKoppeling("Eciton burchellii", [41]);
  verwijderKoppeling("Eciton hamatum", [41]);

  // ============================================================
  // VRAAG 45 - GIFTIGE DIEREN
  // ============================================================

  koppelDieren(`
    Vogelspin;
    Goliathvogelspin;
    Oranje bavianenspin;
    Blauwe kobaltvogelspin;
    Mexicaanse roodknievogelspin;
    Poecilotheria regalis;
    Poecilotheria metallica;
    Kruisspin;
    Wespspin;
    Gewone wolfspin;
    Zwarte weduwe;
    Europese zwarte weduwe;
    Zuidelijke zwarte weduwe;
    Roodrugspin;
    Valse weduwe;
    Sydneytrechterspin;
    Bruine kluizenaarsspin;
    Chileense vioolspin;
    Braziliaanse zwerfspin;
    Schorpioen;
    Keizerschorpioen;
    Androctonus australis;
    Leiurus quinquestriatus;
    Parabuthus transvaalicus;
    Centruroides sculpturatus;
    Tityus serrulatus;
    Hottentotta tamulus;
    Kogelmier;
    Rode vuurmier;
    Zwarte vuurmier;
    Kleine vuurmier;
    Bulldogmier;
    Myrmecia pilosula;
    Pogonomyrmex maricopa;
    Duizendpoot;
    Scolopendra gigantea;
    Scolopendra subspinipes;
    Scolopendra heros;
    Scolopendra cingulata;
    Oliekever;
    Meloe proscarabaeus;
    Meloe violaceus;
    Lytta vesicatoria;
    Paederus fuscipes
  `, [45]);

  // ============================================================
  // VRAAG 47 - OPVALLENDE KLEUREN
  // ============================================================

  koppelDieren(`
    Wespspin;
    Gele tuinspin;
    Zilverargiope;
    Gasteracantha cancriformis;
    Gasteracantha kuhli;
    Micrathena sagittata;
    Pauwspin;
    Maratus volans;
    Maratus speciosus;
    Maratus splendens;
    Maratus personatus;
    Siler semiglaucus;
    Cosmophasis umbratica;
    Phidippus regius;
    Phidippus johnsoni;
    Phidippus cardinalis;
    Poecilotheria metallica;
    Chromatopelma cyaneopubescens;
    Blauwe kobaltvogelspin;
    Mexicaanse roodknievogelspin;
    Oranje bavianenspin;
    Caribena versicolor;
    Harpactira pulchripes;
    Lieveheersbeestjesspin;
    Eresus kollari;
    Eresus sandaliatus;
    Gouden loopkever;
    Carabus auronitens;
    Carabus splendens;
    Carabus rutilans;
    Calosoma sycophanta;
    Calosoma scrutator;
    Chrysochroa fulgidissima;
    Chrysochroa buqueti;
    Sternocera aequisignata;
    Sternocera ruficornis;
    Euchroma gigantea;
    Lytta vesicatoria;
    Oedemera nobilis;
    Orchideebidsprinkhaan;
    Duivelsbloembidsprinkhaan;
    Pseudocreobotra wahlbergii;
    Pseudocreobotra ocellata;
    Metallyticus splendidus;
    Metallyticus violaceus;
    Scolopendra hardwickei;
    Desmoxytes purpurosea;
    Centrobolus splendidus;
    Epibolus pulchripes;
    Polymita picta;
    Papustyla pulcherrima;
    Bananenslak
  `, [47]);

  // ============================================================
  // VRAAG 48 - DIEREN MET STREPEN
  // ============================================================

  koppelDieren(`
    Wespspin;
    Gebande argiope;
    Huiszebraspin;
    Salticus cingulatus;
    Salticus zebraneus;
    Phlegra fasciata;
    Schorsmarpissa;
    Scolopendra hardwickei;
    Centruroides vittatus;
    Coloradokever;
    Vierbandsmalboktor;
    Geringelde smalboktor;
    Therea olegrandjeani;
    Dorylus;
    Gewone tuinslak;
    Witgerande tuinslak;
    Liguus fasciatus;
    Polymita picta;
    Zebrina detrita;
    Amphidromus perversus;
    Bipalium kewense;
    Bipalium adventitium;
    Geoplana quagga
  `, [48]);

  // Een aantal soorten heeft wisselende patronen.
  // Alleen karakteristieke strepen accepteren.

  verwijderKoppeling("Dorylus", [48]);

  // ============================================================
  // VRAAG 49 - STIPPEN EN VLEKKEN
  // ============================================================

  koppelDieren(`
    Kruisspin;
    Viervlekwielwebspin;
    Marmerspin;
    Hoekige wielwebspin;
    Komkommerspin;
    Arctosa leopardus;
    Eresus kollari;
    Eresus sandaliatus;
    Europese zwarte weduwe;
    Phidippus audax;
    Phidippus regius;
    Phidippus mystaceus;
    Gasteracantha cancriformis;
    Neoscona crucifera;
    Parasteatoda tepidariorum;
    Lieveheersbeestje;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Tienstippelig lieveheersbeestje;
    Oogvleklieveheersbeestje;
    Roomvleklieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Calosoma auropunctatum;
    Buprestis octoguttata;
    Rosaliaboktor;
    Goliathkever;
    Julikever;
    Trichodes apiarius;
    Trichodes alvearius;
    Therea petiveriana;
    Therea regularis;
    Armadillidium maculatum;
    Armadillidium klugii;
    Armadillidium gestroi;
    Gevlekte akkerslak;
    Tijgerslak;
    Arianta arbustorum
  `, [49]);

  // ============================================================
  // EXTRA ALGEMENE ANTWOORDEN
  // ============================================================

  dier("Vuurmier", [
    7, 10, 40, 41, 45, 50
  ]);

  dier("Rups", [
    16, 34, 35, 50
  ]);

  // Rupsen kruipen vooral.
  // Springen is geen algemene eigenschap.

  verwijderKoppeling("Rups", [34]);

  dier("Engerling", [
    32, 50
  ]);

  dier("Made", [
    10, 50
  ]);

  dier("Meelworm", [
    10, 50
  ]);

  dier("Ritnaald", [
    10, 32, 50
  ]);

  dier("Bladroller", [
    7, 10, 50
  ]);

  dier("Houtworm", [
    10, 50
  ]);

  dier("Bloedzuiger", [
    1, 17, 50
  ]);

  dier("Worm", [
    50
  ]);

  dier("Insect", [
    50
  ]);

  dier("Spinachtige", [
    50
  ]);

  // ============================================================
  // CORRECTIES OP EERDERE DELEN
  // ============================================================

  // Verschillende rattenslangsoorten zijn in deel 6
  // ten onrechte samengevoegd. Herstel ze.

  verwijderDier("Oostelijke rattenslang");

  dier("Oostelijke rattenslang", [
    7, 17, 18, 21, 50
  ], [
    "Pantherophis alleghaniensis"
  ]);

  dier("Zwarte rattenslang", [
    7, 17, 18, 21, 50
  ], [
    "Pantherophis obsoletus"
  ]);

  // De grote beer is een nachtvlinder.
  // Diaphora mendica heet de witte hermelijnvlinder.

  verwijderDier("Bruine beer (nachtvlinder)");

  dier("Witte hermelijnvlinder", [
    2, 7, 10, 27, 50
  ], [
    "Diaphora mendica"
  ]);

  // Een kip kan korte stukken vliegen.

  koppelDieren("Kip; Haan", [2]);

  // Een haan legt geen eieren.

  verwijderKoppeling("Haan", [7]);

  // Een rups legt geen eieren.
  // Het volwassen insect doet dat.

  verwijderKoppeling("Rups", [7]);

  // Een hooiwagen is geen spin.

  // Een schorpioen heeft geen legsel van eieren.

  verwijderKoppeling("Schorpioen", [7]);

  // ============================================================
  // EXTRA CONTROLE OP NAAMCONFLICTEN
  // ============================================================

  function controleerNaamconflicten() {
    const index = new Map();

    for (const record of database.values()) {
      const namen = [
        record.naam,
        ...record.synoniemen
      ];

      for (const naam of namen) {
        const sleutel = normaliseer(naam);

        if (!index.has(sleutel)) {
          index.set(sleutel, new Set());
        }

        index.get(sleutel).add(record.naam);
      }
    }

    return [...index.entries()]
      .filter(([, records]) => records.size > 1)
      .map(([naam, records]) => ({
        naam,
        dieren: [...records].join(" | "),
        aantal: records.size
      }));
  }

  // Naamconflicten worden alleen gerapporteerd.
  // We voegen ze niet automatisch samen.
  //
  // Twee verschillende diersoorten kunnen namelijk
  // dezelfde Nederlandse naam hebben.

  // ============================================================
  // TUSSENTIJDSE CONTROLE DEEL 7
  // ============================================================

  const samengevoegdDeel7 =
    controleerDubbeleDieren();

  const naamconflictenDeel7 =
    controleerNaamconflicten();

  console.log(
    "QuizBallon V9 - deel 7 - samengevoegde dieren:",
    samengevoegdDeel7
  );

  console.log(
    "QuizBallon V9 - aantal naamconflicten:",
    naamconflictenDeel7.length
  );

  console.table(
    naamconflictenDeel7.slice(0, 100)
  );

  console.log(
    "QuizBallon V9 - totaal opgeslagen dierrecords:",
    database.size
  );

  console.table(
    vragen.map((tekst, index) => {
      const aantal = aantalAntwoorden(index + 1);

      return {
        nummer: index + 1,
        vraag: tekst,
        antwoorden: aantal,
        raketten: aantalRaketten(aantal),
        streefaantal: 1000,
        ontbrekend: Math.max(0, 1000 - aantal),
        doelBereikt: aantal >= 1000
      };
    })
  );

  // ============================================================
  // EINDE DEEL 7
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 8
  // UITGESTORVEN DIEREN
  // ============================================================

  function uitgestorvenDierenV9(tekst, extra = []) {
    groep(tekst, [43, ...extra]);
  }

  // ============================================================
  // GROTE VLEESETENDE DINOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Tyrannosaurus rex=T. rex=T-Rex;
    Tyrannosaurus;
    Tarbosaurus;
    Albertosaurus;
    Gorgosaurus;
    Daspletosaurus;
    Alioramus;
    Qianzhousaurus;
    Teratophoneus;
    Lythronax;
    Nanuqsaurus;
    Bistahieversor;
    Appalachiosaurus;
    Dryptosaurus;
    Alectrosaurus;
    Guanlong;
    Dilong;
    Proceratosaurus;
    Kileskus;
    Yutyrannus;
    Eotyrannus;
    Juratyrant;
    Stokesosaurus;
    Timurlengia;
    Moros;
    Suskityrannus;
    Xiongguanlong;
    Sinotyrannus;
    Eofringillirostrum;
    Allosaurus;
    Saurophaganax;
    Acrocanthosaurus;
    Carcharodontosaurus;
    Giganotosaurus;
    Mapusaurus;
    Tyrannotitan;
    Meraxes;
    Concavenator;
    Neovenator;
    Siamraptor;
    Shaochilong;
    Kelmayisaurus;
    Eocarcharia;
    Veterupristisaurus;
    Sinraptor;
    Yangchuanosaurus;
    Metriacanthosaurus;
    Monolophosaurus;
    Gasosaurus;
    Piatnitzkysaurus;
    Condorraptor;
    Marshosaurus;
    Megalosaurus;
    Torvosaurus;
    Afrovenator;
    Duriavenator;
    Dubreuillosaurus;
    Eustreptospondylus;
    Magnosaurus;
    Leshansaurus;
    Piveteausaurus;
    Wiehenvenator;
    Spinosaurus;
    Baryonyx;
    Suchomimus;
    Irritator;
    Ichthyovenator;
    Oxalaia;
    Riparovenator;
    Ceratosuchops;
    Vallibonavenatrix;
    Iberospinus;
    Ceratosaurus;
    Genyodectes;
    Carnotaurus;
    Majungasaurus;
    Abelisaurus;
    Aucasaurus;
    Rajasaurus;
    Skorpiovenator;
    Ekrixinatosaurus;
    Ilokelesia;
    Pycnonemosaurus;
    Quilmesaurus;
    Viavenator;
    Niebla;
    Llukalkan;
    Spectrovenator;
    Rugops;
    Kryptops;
    Chenanisaurus;
    Arcovenator;
    Tarascosaurus;
    Genusaurus;
    Masiakasaurus;
    Noasaurus;
    Velocisaurus;
    Elaphrosaurus;
    Limusaurus;
    Coelophysis;
    Megapnosaurus;
    Liliensternus;
    Zupaysaurus;
    Gojirasaurus;
    Dilophosaurus;
    Cryolophosaurus;
    Dracovenator;
    Sinosaurus;
    Tawa;
    Daemonosaurus;
    Eodromaeus;
    Herrerasaurus;
    Staurikosaurus;
    Sanjuansaurus;
    Gnathovorax
  `);

  // Eofringillirostrum is een uitgestorven vogel,
  // geen grote vleesetende dinosaurus.
  // Het blijft wel geldig voor vraag 43.

  // ============================================================
  // DROMAEOSAURIDEN EN ANDERE KLEINE THEROPODEN
  // ============================================================

  uitgestorvenDierenV9(`
    Velociraptor;
    Deinonychus;
    Utahraptor;
    Dromaeosaurus;
    Saurornitholestes;
    Atrociraptor;
    Bambiraptor;
    Acheroraptor;
    Boreonykus;
    Dakotaraptor;
    Adasaurus;
    Tsaagan;
    Kuru;
    Shri;
    Linheraptor;
    Achillobator;
    Austroraptor;
    Buitreraptor;
    Unenlagia;
    Neuquenraptor;
    Rahonavis;
    Microraptor;
    Sinornithosaurus;
    Changyuraptor;
    Graciliraptor;
    Hesperonychus;
    Tianyuraptor;
    Zhenyuanlong;
    Wulong;
    Halszkaraptor;
    Mahakala;
    Natovenator;
    Hulsanpes;
    Pyroraptor;
    Variraptor;
    Ypupiara;
    Troodon;
    Stenonychosaurus;
    Latenivenatrix;
    Saurornithoides;
    Zanabazar;
    Borogovia;
    Tochisaurus;
    Gobivenator;
    Linhevenator;
    Sinornithoides;
    Mei long;
    Sinovenator;
    Sinusonasus;
    Jinfengopteryx;
    Anchiornis;
    Xiaotingia;
    Eosinopteryx;
    Aurornis;
    Hesperornithoides;
    Daliansaurus;
    Jianianhualong;
    Almas;
    Talos;
    Geminiraptor;
    Pectinodon;
    Byronosaurus;
    Philovenator;
    Xixiasaurus;
    Urbacodon;
    Compsognathus;
    Sinosauropteryx;
    Huaxiagnathus;
    Sinocalliopteryx;
    Juravenator;
    Scipionyx;
    Mirischia;
    Aristosuchus;
    Ornitholestes;
    Coelurus;
    Tanycolagreus;
    Zuolong;
    Bicentenaria;
    Aorun;
    Haplocheirus;
    Alvarezsaurus;
    Patagonykus;
    Mononykus;
    Shuvuuia;
    Parvicursor;
    Ceratonykus;
    Linhenykus;
    Xixianykus;
    Albinykus;
    Albertonykus;
    Achillesaurus;
    Bannykus;
    Xiyunykus;
    Jaculinykus;
    Bonapartenykus
  `);

  // ============================================================
  // OVIRAPTOROSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Oviraptor;
    Citipati;
    Khaan;
    Conchoraptor;
    Ingenia;
    Ajancingenia;
    Heyuannia;
    Nemegtomaia;
    Rinchenia;
    Nomingia;
    Banji;
    Huanansaurus;
    Ganzhousaurus;
    Jiangxisaurus;
    Nankangia;
    Shixinggia;
    Tongtianlong;
    Corythoraptor;
    Yulong;
    Wulatelong;
    Machairasaurus;
    Gobiraptor;
    Oksoko;
    Huanan;
    Gigantoraptor;
    Anzu;
    Chirostenotes;
    Caenagnathus;
    Caenagnathasia;
    Elmisaurus;
    Leptorhynchos;
    Apatoraptor;
    Hagryphus;
    Epichirostenotes;
    Ojoraptorsaurus;
    Eoneophron;
    Microvenator;
    Caudipteryx;
    Protarchaeopteryx;
    Incisivosaurus;
    Avimimus;
    Similicaudipteryx;
    Ningyuansaurus
  `);

  verwijderDier("Huanan");

  samenvoegen("Ajancingenia", "Ingenia");

  // ============================================================
  // ORNITHOMIMOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Ornithomimus;
    Struthiomimus;
    Gallimimus;
    Dromiceiomimus;
    Archaeornithomimus;
    Anserimimus;
    Sinornithomimus;
    Beishanlong;
    Garudimimus;
    Harpymimus;
    Shenzhousaurus;
    Pelecanimimus;
    Nqwebasaurus;
    Deinocheirus;
    Rativates;
    Tototlmimus;
    Qiupalong;
    Aepyornithomimus;
    Arkansaurus;
    Nedcolbertia;
    Hexing;
    Kinnareemimus;
    Paraxenisaurus;
    Tyrannomimus
  `);

  // ============================================================
  // THERIZINOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Therizinosaurus;
    Segnosaurus;
    Erlikosaurus;
    Nothronychus;
    Falcarius;
    Beipiaosaurus;
    Jianchangosaurus;
    Alxasaurus;
    Enigmosaurus;
    Neimongosaurus;
    Erliansaurus;
    Suzhousaurus;
    Nanshiungosaurus;
    Martharaptor;
    Lingyuanosaurus;
    Paralitherizinosaurus
  `);

  // ============================================================
  // SAUROPODEN EN LANGNEKDINOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Sauropode;
    Brontosaurus;
    Apatosaurus;
    Diplodocus;
    Barosaurus;
    Supersaurus;
    Galeamopus;
    Kaatedocus;
    Tornieria;
    Dinheirosaurus;
    Leinkupal;
    Amphicoelias;
    Maraapunisaurus;
    Dicraeosaurus;
    Amargasaurus;
    Brachytrachelopan;
    Bajadasaurus;
    Pilmatueia;
    Lingwulong;
    Suuwassea;
    Smitanosaurus;
    Rebbachisaurus;
    Nigersaurus;
    Limaysaurus;
    Cathartesaura;
    Demandasaurus;
    Histriasaurus;
    Rayososaurus;
    Lavocatisaurus;
    Tataouinea;
    Katepensaurus;
    Comahuesaurus;
    Zapalasaurus;
    Amazonsaurus;
    Itapeuasaurus;
    Sidersaura;
    Brachiosaurus;
    Giraffatitan;
    Lusotitan;
    Cedarosaurus;
    Abydosaurus;
    Venenosaurus;
    Sonorasaurus;
    Europasaurus;
    Soriatitan;
    Vouivria;
    Padillasaurus;
    Camarasaurus;
    Cathetosaurus;
    Aragosaurus;
    Tehuelchesaurus;
    Galvesaurus;
    Jobaria;
    Haplocanthosaurus;
    Cetiosaurus;
    Patagosaurus;
    Volkheimeria;
    Bagualia;
    Spinophorosaurus;
    Tazoudasaurus;
    Vulcanodon;
    Gongxianosaurus;
    Barapasaurus;
    Kotasaurus;
    Shunosaurus;
    Omeisaurus;
    Mamenchisaurus;
    Chuanjiesaurus;
    Tienshanosaurus;
    Eomamenchisaurus;
    Xinjiangtitan;
    Qijianglong;
    Tonganosaurus;
    Hudiesaurus;
    Klamelisaurus;
    Dashanpusaurus;
    Nebulasaurus;
    Abrosaurus;
    Datousaurus;
    Bellusaurus;
    Atlasaurus;
    Turiasaurus;
    Losillasaurus;
    Zby;
    Mierasaurus;
    Moabosaurus;
    Tendaguria;
    Janenschia;
    Euhelopus;
    Erketu;
    Daxiatitan;
    Qiaowanlong;
    Yongjinglong;
    Huanghetitan;
    Ruyangosaurus;
    Dongbeititan;
    Phuwiangosaurus;
    Tangvayosaurus;
    Gobititan;
    Jiangshanosaurus;
    Fusuisaurus;
    Liubangosaurus;
    Baotianmansaurus;
    Yunmenglong;
    Zhuchengtitan;
    Choconsaurus;
    Andesaurus;
    Argentinosaurus;
    Patagotitan;
    Dreadnoughtus;
    Futalognkosaurus;
    Puertasaurus;
    Notocolossus;
    Mendozasaurus;
    Quetecsaurus;
    Drusilasaura;
    Argentinosaurus huinculensis;
    Saltasaurus;
    Neuquensaurus;
    Rocasaurus;
    Bonatitan;
    Bonitasaura;
    Antarctosaurus;
    Argyrosaurus;
    Epachthosaurus;
    Aeolosaurus;
    Gondwanatitan;
    Rinconsaurus;
    Muyelensaurus;
    Pitekunsaurus;
    Overosaurus;
    Panamericansaurus;
    Narambuenatitan;
    Ligabuesaurus;
    Malarguesaurus;
    Mnyamawamtuka;
    Shingopana;
    Rukwatitan;
    Malawisaurus;
    Paralititan;
    Aegyptosaurus;
    Mansourasaurus;
    Rapetosaurus;
    Vahiny;
    Isisaurus;
    Jainosaurus;
    Titanosaurus;
    Magyarosaurus;
    Paludititan;
    Ampelosaurus;
    Lirainosaurus;
    Atsinganosaurus;
    Lohuecotitan;
    Abditosaurus;
    Ibirania;
    Uberabatitan;
    Baurutitan;
    Trigonosaurus;
    Maxakalisaurus;
    Tapuiasaurus;
    Adamantisaurus;
    Austroposeidon;
    Brasilotitan;
    Austrosaurus;
    Diamantinasaurus;
    Wintonotitan;
    Savannasaurus;
    Australotitan;
    Sarmientosaurus;
    Alamosaurus;
    Sonidosaurus;
    Nemegtosaurus;
    Opisthocoelicaudia;
    Quaesitosaurus;
    Borealosaurus;
    Abdarainurus;
    Hamititan;
    Silutitan
  `);

  samenvoegen(
    "Argentinosaurus",
    "Argentinosaurus huinculensis"
  );

  // ============================================================
  // VROEGE SAUROPODOMORFEN
  // ============================================================

  uitgestorvenDierenV9(`
    Plateosaurus;
    Massospondylus;
    Riojasaurus;
    Coloradisaurus;
    Lufengosaurus;
    Yunnanosaurus;
    Jingshanosaurus;
    Yimenosaurus;
    Glacialisaurus;
    Sarahsaurus;
    Anchisaurus;
    Seitaad;
    Adeopapposaurus;
    Leyesaurus;
    Ngwevu;
    Ignavusaurus;
    Lythronax;
    Lessemsaurus;
    Antetonitrus;
    Ingentia;
    Ledumahadi;
    Melanorosaurus;
    Camelotia;
    Blikanasaurus;
    Mussaurus;
    Leonerasaurus;
    Aardonyx;
    Pulanesaura;
    Sefapanosaurus;
    Meroktenos;
    Eucnemesaurus;
    Ruehleia;
    Unaysaurus;
    Macrocollum;
    Jaklapallisaurus;
    Nambalia;
    Buriolestes;
    Saturnalia;
    Pampadromaeus;
    Panphagia;
    Chromogisaurus;
    Bagualosaurus;
    Eoraptor;
    Mbiresaurus;
    Asylosaurus;
    Thecodontosaurus;
    Pantydraco
  `);

  // Lythronax stond al bij de tyrannosauriërs.
  // De centrale database moet dit record hergebruiken.

  // ============================================================
  // GEHOORNDE DINOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Triceratops;
    Torosaurus;
    Eotriceratops;
    Nedoceratops;
    Tatankaceratops;
    Ojoceratops;
    Titanoceratops;
    Pentaceratops;
    Chasmosaurus;
    Vagaceratops;
    Kosmoceratops;
    Utahceratops;
    Coahuilaceratops;
    Bravoceratops;
    Anchiceratops;
    Arrhinoceratops;
    Agujaceratops;
    Terminocavus;
    Navajoceratops;
    Sierraceratops;
    Spiclypeus;
    Regaliceratops;
    Mercuriceratops;
    Judiceratops;
    Medusaceratops;
    Centrosaurus;
    Styracosaurus;
    Pachyrhinosaurus;
    Einiosaurus;
    Achelousaurus;
    Rubeosaurus;
    Coronosaurus;
    Spinops;
    Xenoceratops;
    Wendiceratops;
    Albertaceratops;
    Diabloceratops;
    Nasutoceratops;
    Avaceratops;
    Lokiceratops;
    Furcatoceratops;
    Menefeeceratops;
    Crittendenceratops;
    Machairoceratops;
    Sinoceratops;
    Yehuecauhceratops;
    Brachyceratops;
    Monoclonius;
    Protoceratops;
    Bagaceratops;
    Breviceratops;
    Udanoceratops;
    Leptoceratops;
    Montanoceratops;
    Prenoceratops;
    Cerasinops;
    Unescoceratops;
    Gryphoceratops;
    Zhuchengceratops;
    Asiaceratops;
    Koreaceratops;
    Yamaceratops;
    Auroraceratops;
    Archaeoceratops;
    Liaoceratops;
    Aquilops;
    Mosaiceratops;
    Helioceratops;
    Psittacosaurus;
    Yinlong;
    Chaoyangsaurus;
    Xuanhuaceratops;
    Hualianceratops;
    Stenopelix
  `);

  // ============================================================
  // GEPANTSERDE DINOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Ankylosaurus;
    Euoplocephalus;
    Scolosaurus;
    Dyoplosaurus;
    Anodontosaurus;
    Zuul;
    Ziapelta;
    Nodocephalosaurus;
    Akainacephalus;
    Talarurus;
    Pinacosaurus;
    Saichania;
    Tarchia;
    Minotaurasaurus;
    Zaraapelta;
    Shamosaurus;
    Gobisaurus;
    Chuanqilong;
    Liaoningosaurus;
    Crichtonpelta;
    Crichtonsaurus;
    Jinyunpelta;
    Tianzhenosaurus;
    Shanxia;
    Zhejiangosaurus;
    Zhongyuansaurus;
    Nodosaurus;
    Edmontonia;
    Panoplosaurus;
    Borealopelta;
    Sauropelta;
    Silvisaurus;
    Pawpawsaurus;
    Texasetes;
    Animantarx;
    Peloroplites;
    Cedarpelta;
    Niobrarasaurus;
    Aletopelta;
    Glyptodontopelta;
    Invictarx;
    Denversaurus;
    Hungarosaurus;
    Struthiosaurus;
    Europelta;
    Polacanthus;
    Hylaeosaurus;
    Gastonia;
    Gargoyleosaurus;
    Mymoorapelta;
    Hoplitosaurus;
    Stegopelta;
    Taohelong;
    Dongyangopelta;
    Antarctopelta;
    Stegouros;
    Kunbarrasaurus;
    Minmi;
    Jakapil;
    Scelidosaurus;
    Scutellosaurus;
    Emausaurus;
    Yuxisaurus;
    Lesothosaurus
  `);

  // ============================================================
  // STEGOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Stegosaurus;
    Kentrosaurus;
    Dacentrurus;
    Miragaia;
    Hesperosaurus;
    Wuerhosaurus;
    Tuojiangosaurus;
    Huayangosaurus;
    Chungkingosaurus;
    Gigantspinosaurus;
    Jiangjunosaurus;
    Paranthodon;
    Loricatosaurus;
    Lexovisaurus;
    Regnosaurus;
    Alcovasaurus;
    Bashanosaurus;
    Isaberrysaura;
    Adratiklit;
    Thyreosaurus;
    Monkonosaurus
  `);

  // ============================================================
  // HADROSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Hadrosaurus;
    Edmontosaurus;
    Shantungosaurus;
    Kerberosaurus;
    Kundurosaurus;
    Saurolophus;
    Prosaurolophus;
    Gryposaurus;
    Kritosaurus;
    Naashoibitosaurus;
    Brachylophosaurus;
    Maiasaura;
    Acristavus;
    Probrachylophosaurus;
    Ornatops;
    Wulagasaurus;
    Secernosaurus;
    Bonapartesaurus;
    Willinakaqe;
    Huallasaurus;
    Kelumapusaura;
    Lapampasaurus;
    Gonkoken;
    Tlatolophus;
    Latirhinus;
    Rhinorex;
    Aquilarhinus;
    Lophorhothon;
    Eotrachodon;
    Protohadros;
    Eolambia;
    Jeyawati;
    Levnesovia;
    Bactrosaurus;
    Gilmoreosaurus;
    Tethyshadros;
    Telmatosaurus;
    Fylax;
    Ajnabia;
    Minqaria;
    Yamatosaurus;
    Kamuysaurus;
    Amurosaurus;
    Olorotitan;
    Sahaliyania;
    Charonosaurus;
    Parasaurolophus;
    Channellingosaurus;
    Lambeosaurus;
    Corythosaurus;
    Hypacrosaurus;
    Velafrons;
    Magnapaulia;
    Angulomastacator;
    Nipponosaurus;
    Arenysaurus;
    Blasisaurus;
    Canardia;
    Pararhabdodon;
    Tsintaosaurus;
    Jaxartosaurus;
    Aralosaurus;
    Kazaklambia;
    Nanningosaurus;
    Lophorhothon;
    Plesiohadros;
    Gobihadros;
    Zhanghenglong;
    Zuoyunlong;
    Yunganglong;
    Datonglong;
    Bolong;
    Fukuisaurus;
    Koshisaurus
  `);

  verwijderDier("Channellingosaurus");

  // ============================================================
  // OVERIGE ORNITHOPODEN
  // ============================================================

  uitgestorvenDierenV9(`
    Iguanodon;
    Mantellisaurus;
    Ouranosaurus;
    Altirhinus;
    Jinzhousaurus;
    Lanzhousaurus;
    Lurdusaurus;
    Muttaburrasaurus;
    Barilium;
    Hypselospinus;
    Brighstoneus;
    Proa;
    Morelladon;
    Portellsaurus;
    Iguanacolossus;
    Hippodraco;
    Theiophytalia;
    Dakotadon;
    Cedrorestes;
    Planicoxa;
    Osmakasaurus;
    Uteodon;
    Camptosaurus;
    Cumnoria;
    Draconyx;
    Callovosaurus;
    Dryosaurus;
    Dysalotosaurus;
    Valdosaurus;
    Eousdryosaurus;
    Elrhazosaurus;
    Kangnasaurus;
    Rhabdodon;
    Zalmoxes;
    Mochlodon;
    Matheronodon;
    Transylvanosaurus;
    Tenontosaurus;
    Convolosaurus;
    Hypsilophodon;
    Parksosaurus;
    Thescelosaurus;
    Orodromeus;
    Oryctodromeus;
    Zephyrosaurus;
    Albertadromeus;
    Koreanosaurus;
    Haya;
    Changchunsaurus;
    Jeholosaurus;
    Yueosaurus;
    Hexinlusaurus;
    Agilisaurus;
    Yandusaurus;
    Kulindadromeus;
    Notohypsilophodon;
    Gasparinisaura;
    Anabisetia;
    Talenkauen;
    Macrogryphosaurus;
    Trinisaura;
    Morrosaurus;
    Diluvicursor;
    Leaellynasaura;
    Qantassaurus;
    Atlascopcosaurus;
    Galleonosaurus;
    Fostoria;
    Weewarrasaurus;
    Gideonmantellia;
    Burianosaurus;
    Eocursor;
    Heterodontosaurus;
    Abrictosaurus;
    Lycorhinus;
    Pegomastax;
    Manidens;
    Fruitadens;
    Tianyulong;
    Pisanosaurus;
    Laquintasaura;
    Chilesaurus
  `);

  // ============================================================
  // PACHYCEPHALOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Pachycephalosaurus;
    Stygimoloch;
    Dracorex;
    Stegoceras;
    Sphaerotholus;
    Prenocephale;
    Homalocephale;
    Goyocephale;
    Tylocephale;
    Acrotholus;
    Foraminacephale;
    Hanssuesia;
    Colepiocephale;
    Alaskacephale;
    Texacephale;
    Amtocephale;
    Sinocephale;
    Gravitholus;
    Platytholus;
    Wannanosaurus
  `);

  // De taxonomische status van Dracorex en
  // Stygimoloch is onderwerp van discussie.
  // Deze bekende namen blijven voorlopig toegestaan.

  // ============================================================
  // VLIEGENDE REPTIELEN - PTEROSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Pterosaurus;
    Pterodactylus;
    Pteranodon;
    Geosternbergia;
    Nyctosaurus;
    Muzquizopteryx;
    Alcione;
    Simurghia;
    Barbaridactylus;
    Quetzalcoatlus;
    Hatzegopteryx;
    Arambourgiania;
    Azhdarcho;
    Zhejiangopterus;
    Alanqa;
    Eurazhdarcho;
    Mistralazhdarcho;
    Phosphatodraco;
    Cryodrakon;
    Aerotitan;
    Montanazhdarcho;
    Bakonydraco;
    Volgadraco;
    Azhdarchidae;
    Tapejara;
    Tupandactylus;
    Caiuajara;
    Sinopterus;
    Huaxiapterus;
    Europejara;
    Eopteranodon;
    Afrotapejara;
    Wightia;
    Thalassodromeus;
    Tupuxuara;
    Caupedactylus;
    Torukjara;
    Dsungaripterus;
    Noripterus;
    Lonchognathosaurus;
    Germanodactylus;
    Diopecephalus;
    Cycnorhamphus;
    Ctenochasma;
    Gnathosaurus;
    Pterodaustro;
    Gegepterus;
    Beipiaopterus;
    Elanodactylus;
    Feilongus;
    Moganopterus;
    Forfexopterus;
    Gladocephaloideus;
    Liaodactylus;
    Aerodactylus;
    Aurorazhdarcho;
    Ardeadactylus;
    Gallodactylus;
    Normannognathus;
    Huanhepterus;
    Plataleorhynchus;
    Ornithocheirus;
    Coloborhynchus;
    Tropeognathus;
    Anhanguera;
    Cearadactylus;
    Brasileodactylus;
    Ludodactylus;
    Maaradactylus;
    Guidraco;
    Liaoningopterus;
    Boreopterus;
    Zhenyuanopterus;
    Haopterus;
    Hamipterus;
    Ikrandraco;
    Lonchodectes;
    Lonchodraco;
    Cimoliopterus;
    Aetodactylus;
    Camposipterus;
    Uktenadactylus;
    Caulkicephalus;
    Ferrodraco;
    Mythunga;
    Aussiedraco;
    Thapunngaka;
    Haliskia;
    Siroccopteryx;
    Targaryendraco;
    Tethydraco;
    Istiodactylus;
    Nurhachius;
    Liaoxipterus;
    Hongshanopterus;
    Luchibang;
    Rhamphorhynchus;
    Dorygnathus;
    Campylognathoides;
    Scaphognathus;
    Sordes;
    Harpactognathus;
    Sericipterus;
    Angustinaripterus;
    Qinglongopterus;
    Bellubrunnus;
    Nesodactylus;
    Cacibupteryx;
    Dearc;
    Klobiodon;
    Parapsicephalus;
    Orientognathus;
    Jianchangnathus;
    Fenghuangopterus;
    Dimorphodon;
    Preondactylus;
    Austriadactylus;
    Eudimorphodon;
    Carniadactylus;
    Peteinosaurus;
    Caviramus;
    Raeticodactylus;
    Arcticodactylus;
    Bergamodactylus;
    Seazzadactylus;
    Caelestiventus;
    Seitaad;
    Anurognathus;
    Jeholopterus;
    Batrachognathus;
    Dendrorhynchoides;
    Luopterus;
    Vesperopterylus;
    Sinomacrops;
    Cascocauda;
    Darwinopterus;
    Wukongopterus;
    Kunpengopterus;
    Douzhanopterus;
    Cuspicephalus;
    Allkaruen;
    Kryptodrakon;
    Skiphosoura
  `);

  // Seitaad is een sauropodomorf en geen pterosaurus.
  // Geen vliegeigenschap aan dit dier toevoegen.

  // ============================================================
  // ICHTHYOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Ichthyosaurus;
    Ichthyosaurier;
    Stenopterygius;
    Temnodontosaurus;
    Leptonectes;
    Eurhinosaurus;
    Excalibosaurus;
    Hauffiopteryx;
    Suevoleviathan;
    Protoichthyosaurus;
    Wahlisaurus;
    Thalassodraco;
    Ophthalmosaurus;
    Acamptonectes;
    Brachypterygius;
    Nannopterygius;
    Undorosaurus;
    Arthropterygius;
    Cryopterygius;
    Keilhauia;
    Palvennia;
    Janusaurus;
    Sveltonectes;
    Maiaspondylus;
    Platypterygius;
    Pervushovisaurus;
    Simbirskiasaurus;
    Leninia;
    Muiscasaurus;
    Kyhytysuka;
    Aegirosaurus;
    Caypullisaurus;
    Mollesaurus;
    Baptanodon;
    Paraophthalmosaurus;
    Grendelius;
    Gengasaurus;
    Jabalisaurus;
    Sisteronia;
    Shonisaurus;
    Shastasaurus;
    Cymbospondylus;
    Besanosaurus;
    Californosaurus;
    Toretocnemus;
    Qianichthyosaurus;
    Guanlingsaurus;
    Guizhouichthyosaurus;
    Himalayasaurus;
    Xinminosaurus;
    Thalattoarchon;
    Phalarodon;
    Mixosaurus;
    Contectopalatus;
    Omphalosaurus;
    Cartorhynchus;
    Sclerocormus;
    Chaohusaurus;
    Grippia;
    Utatsusaurus;
    Gulosaurus;
    Parvinatator;
    Thaisaurus;
    Ichthyosauromorpha;
    Ichthyotitan
  `);

  // ============================================================
  // PLESIOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Plesiosaurus;
    Elasmosaurus;
    Styxosaurus;
    Albertonectes;
    Thalassomedon;
    Hydrotherosaurus;
    Terminonatator;
    Libonectes;
    Tuarangisaurus;
    Mauisaurus;
    Aristonectes;
    Kaiwhekea;
    Morturneria;
    Alexandronectes;
    Kawanectes;
    Vegasaurus;
    Weddellonectes;
    Nakonanectes;
    Fluvionectes;
    Cardiocorax;
    Lagenanectes;
    Jucha;
    Callawayasaurus;
    Eromangasaurus;
    Futabasaurus;
    Zarafasaura;
    Eretmosaurus;
    Eoplesiosaurus;
    Seeleyosaurus;
    Microcleidus;
    Hydrorion;
    Occitanosaurus;
    Plesiopterys;
    Westphaliasaurus;
    Lusonectes;
    Franconiasaurus;
    Cryptoclidus;
    Muraenosaurus;
    Tricleidus;
    Kimmerosaurus;
    Tatenectes;
    Djupedalia;
    Spitrasaurus;
    Colymbosaurus;
    Abyssosaurus;
    Opallionectes;
    Kear;
    Leptocleidus;
    Umoonasaurus;
    Nichollssaura;
    Brancasaurus;
    Vectocleidus;
    Hastanectes;
    Luskhan;
    Acostasaurus;
    Anguanax;
    Bobosaurus;
    Pistosaurus;
    Augustasaurus;
    Yunguisaurus
  `);

  verwijderDier("Kear");

  // ============================================================
  // PLIOSAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Pliosaurus;
    Liopleurodon;
    Kronosaurus;
    Brachauchenius;
    Megacephalosaurus;
    Sachicasaurus;
    Monquirasaurus;
    Luskhan;
    Makhaira;
    Stenorhynchosaurus;
    Acostasaurus;
    Peloneustes;
    Simolestes;
    Pachycostasaurus;
    Marmornectes;
    Gallardosaurus;
    Hauffiosaurus;
    Attenborosaurus;
    Rhomaleosaurus;
    Meyerasaurus;
    Macroplata;
    Thaumatodracon;
    Atychodracon;
    Borealonectes;
    Yuzhoupliosaurus;
    Yunguisaurus;
    Cryonectes;
    Arminisaurus;
    Archaeonectrus;
    Thalassiodracon;
    Eardasaurus;
    Lorrainosaurus;
    Plesiopleurodon;
    Dolichorhynchops;
    Polycotylus;
    Trinacromerum;
    Edgarosaurus;
    Palmulasaurus;
    Pahasapasaurus;
    Serpentisuchops;
    Mauriciosaurus;
    Manemergus;
    Thililua;
    Sulcusuchus;
    Georgiasaurus;
    Piratosaurus
  `);

  // ============================================================
  // MOSASAURUSSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Mosasaurus;
    Maashagedis;
    Tylosaurus;
    Hainosaurus;
    Taniwhasaurus;
    Kaikaifilu;
    Tethysaurus;
    Russellosaurus;
    Yaguarasaurus;
    Romeosaurus;
    Pannoniasaurus;
    Dallasaurus;
    Aigialosaurus;
    Opetiosaurus;
    Halisaurus;
    Eonatator;
    Phosphorosaurus;
    Pluridens;
    Eremiasaurus;
    Prognathodon;
    Globidens;
    Carinodens;
    Igdamanosaurus;
    Plesiotylosaurus;
    Plotosaurus;
    Moanasaurus;
    Clidastes;
    Kourisodon;
    Latoplatecarpus;
    Platecarpus;
    Plioplatecarpus;
    Ectenosaurus;
    Selmasaurus;
    Gavialimimus;
    Goronyosaurus;
    Angolasaurus;
    Tethysaurus;
    Khinjaria;
    Xenodens;
    Stelladens;
    Thalassotitan;
    Megapterygius;
    Jormungandr walhallaensis
  `);

  samenvoegen("Mosasaurus", "Maashagedis");

  // ============================================================
  // OVERIGE PREHISTORISCHE REPTIELEN
  // ============================================================

  uitgestorvenDierenV9(`
    Nothosaurus;
    Lariosaurus;
    Ceresiosaurus;
    Simosaurus;
    Germanosaurus;
    Neusticosaurus;
    Keichousaurus;
    Serpianosaurus;
    Anarosaurus;
    Dactylosaurus;
    Pachypleurosaurus;
    Placodus;
    Cyamodus;
    Henodus;
    Placochelys;
    Psephoderma;
    Paraplacodus;
    Psephochelys;
    Sinosaurosphargis;
    Largocephalosaurus;
    Tanystropheus;
    Tanytrachelos;
    Macrocnemus;
    Langobardisaurus;
    Protorosaurus;
    Dinocephalosaurus;
    Sharovipteryx;
    Longisquama;
    Drepanosaurus;
    Megalancosaurus;
    Vallesaurus;
    Hypuronector;
    Avicranium;
    Kuehneosaurus;
    Icarosaurus;
    Coelurosauravus;
    Weigeltisaurus;
    Petrolacosaurus;
    Araeoscelis;
    Captorhinus;
    Labidosaurus;
    Paleothyris;
    Hylonomus;
    Mesosaurus;
    Stereosternum;
    Brazilosaurus;
    Scutosaurus;
    Pareiasaurus;
    Bradysaurus;
    Bunostegos;
    Elginia;
    Anthodon;
    Procolophon;
    Hypsognathus;
    Leptopleuron;
    Orobates;
    Diadectes;
    Limnoscelis;
    Seymouria;
    Gephyrostegus;
    Westlothiana;
    Proganochelys;
    Pappochelys;
    Odontochelys;
    Eorhynchochelys;
    Eunotosaurus;
    Archelon;
    Protostega;
    Desmatochelys;
    Santanachelys;
    Allopleuron;
    Carbonemys;
    Stupendemys;
    Meiolania;
    Ninjemys;
    Palaeochersis;
    Proterochersis;
    Henodus chelyops;
    Titanoboa;
    Gigantophis;
    Palaeophis;
    Madtsoia;
    Wonambi;
    Yurlunggur;
    Sanajeh;
    Najash;
    Dinilysia;
    Pachyrhachis;
    Haasiophis;
    Eupodophis;
    Megalania=Varanus priscus;
    Palaeovaranus;
    Saniwa;
    Estesia;
    Primaderma;
    Gobiderma;
    Polyglyphanodon;
    Borioteiioidea;
    Obamadon;
    Tiliqua frangens;
    Myrmecodaptria;
    Huehuecuetzpalli;
    Cryptolacerta;
    Sophineta;
    Bellairsia;
    Gephyrosaurus;
    Clevosaurus;
    Pleurosaurus;
    Palaeopleurosaurus;
    Kallimodon;
    Homoeosaurus;
    Sapheosaurus;
    Oenosaurus
  `);

  samenvoegen("Henodus", "Henodus chelyops");

  // ============================================================
  // PREHISTORISCHE KROKODILACHTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Sarcosuchus;
    Deinosuchus;
    Purussaurus;
    Rhamphosuchus;
    Mourasuchus;
    Gryposuchus;
    Piscogavialis;
    Thecachampsa;
    Gavialosuchus;
    Eogavialis;
    Aktiogavialis;
    Argochampsa;
    Crocodylus anthropophagus;
    Crocodylus thorbjarnarsoni;
    Voay robustus;
    Quinkana;
    Mekosuchus;
    Baru;
    Kambara;
    Australosuchus;
    Pallimnarchus;
    Paludirex;
    Trilophosuchus;
    Leidyosuchus;
    Borealosuchus;
    Diplocynodon;
    Brachychampsa;
    Allognathosuchus;
    Ceratosuchus;
    Wannaganosuchus;
    Albertochampsa;
    Stangerochampsa;
    Eocaiman;
    Necrosuchus;
    Orthogenysuchus;
    Culebrasuchus;
    Centenariosuchus;
    Tsoabichi;
    Bottosaurus;
    Bernissartia;
    Goniopholis;
    Amphicotylus;
    Sunosuchus;
    Eutretauranosuchus;
    Anteophthalmosuchus;
    Hulkepholis;
    Vectisuchus;
    Pholidosaurus;
    Elosuchus;
    Terminonaris;
    Stolokrosuchus;
    Dyrosaurus;
    Hyposaurus;
    Rhabdognathus;
    Congosaurus;
    Guarinisuchus;
    Acherontisuchus;
    Cerrejonisuchus;
    Anthracosuchus;
    Metriorhynchus;
    Dakosaurus;
    Geosaurus;
    Cricosaurus;
    Rhacheosaurus;
    Plesiosuchus;
    Torvoneustes;
    Tyrannoneustes;
    Suchodus;
    Teleosaurus;
    Steneosaurus;
    Machimosaurus;
    Mystriosaurus;
    Plagiophthalmosuchus;
    Pelagosaurus;
    Peipehsuchus;
    Sphenosuchus;
    Terrestrisuchus;
    Saltoposuchus;
    Hesperosuchus;
    Protosuchus;
    Orthosuchus;
    Hemiprotosuchus;
    Notosuchus;
    Mariliasuchus;
    Simosuchus;
    Pakasuchus;
    Malawisuchus;
    Yacarerani;
    Adamantinasuchus;
    Sphagesaurus;
    Caipirasuchus;
    Armadillosuchus;
    Baurusuchus;
    Stratiotosuchus;
    Pissarrachampsa;
    Campinasuchus;
    Sebecus;
    Barinasuchus;
    Iberosuchus;
    Bergisuchus;
    Kaprosuchus;
    Laganosuchus;
    Anatosuchus;
    Araripesuchus;
    Mahajangasuchus;
    Uberabasuchus;
    Montealtosuchus
  `);

  // ============================================================
  // PREHISTORISCHE AMFIBIEËN
  // ============================================================

  uitgestorvenDierenV9(`
    Eryops;
    Diplocaulus;
    Diploceraspis;
    Dissorophus;
    Cacops;
    Broiliellus;
    Platyhystrix;
    Aspidosaurus;
    Acheloma;
    Phonerpeton;
    Ecolsonia;
    Anconastes;
    Fedexia;
    Amphibamus;
    Doleserpeton;
    Gerobatrachus;
    Branchiosaurus;
    Apateon;
    Schoenfelderpeton;
    Micromelerpeton;
    Leptorophus;
    Sclerocephalus;
    Archegosaurus;
    Cheliderpeton;
    Glanochthon;
    Intasuchus;
    Prionosuchus;
    Platyoposaurus;
    Melosaurus;
    Konzhukovia;
    Rhinesuchus;
    Uranocentrodon;
    Laccosaurus;
    Broomistega;
    Australerpeton;
    Mastodonsaurus;
    Cyclotosaurus;
    Paracyclotosaurus;
    Eocyclotosaurus;
    Parotosuchus;
    Benthosuchus;
    Wetlugasaurus;
    Siderops;
    Koolasuchus;
    Pelorocephalus;
    Chigutisaurus;
    Brachyops;
    Bothriceps;
    Xenobrachyops;
    Gerrothorax;
    Plagiosaurus;
    Plagiosuchus;
    Dvinosaurus;
    Trimerorhachis;
    Neldasaurus;
    Tupilakosaurus;
    Thabanchuia;
    Metoposaurus;
    Koskinonodon;
    Apachesaurus;
    Dutuitosaurus;
    Panthasaurus;
    Buettnererpeton;
    Loxomma;
    Baphetes;
    Megalocephalus;
    Crassigyrinus;
    Greererpeton;
    Whatcheeria;
    Pederpes;
    Acanthostega;
    Ichthyostega;
    Tulerpeton;
    Ventastega;
    Hynerpeton;
    Densignathus;
    Ymeria;
    Parmastega;
    Ossinodus;
    Eogyrinus;
    Proterogyrinus;
    Archeria;
    Pholiderpeton;
    Anthracosaurus;
    Gephyrostegus;
    Microbrachis;
    Hyloplesion;
    Oestocephalus;
    Ophiderpeton;
    Phlegethontia;
    Lethiscus;
    Brachydectes;
    Rhynchonkos;
    Batropetes;
    Eocaecilia;
    Triadobatrachus;
    Czatkobatrachus;
    Prosalirus;
    Vieraella;
    Notobatrachus;
    Beelzebufo;
    Palaeobatrachus;
    Eopelobates;
    Karaurus;
    Kokartus;
    Marmorerpeton;
    Chunerpeton;
    Jeholotriton;
    Liaoxitriton;
    Beiyanerpeton;
    Pangerpeton
  `);

  // ============================================================
  // PREHISTORISCHE HAAIEN
  // ============================================================

  uitgestorvenDierenV9(`
    Megalodon=Otodus megalodon=Carcharocles megalodon;
    Otodus obliquus;
    Otodus angustidens;
    Otodus chubutensis;
    Otodus auriculatus;
    Cretalamna;
    Cretoxyrhina;
    Squalicorax;
    Scapanorhynchus;
    Carcharias samhammeri;
    Palaeocarcharodon;
    Carcharodon hastalis;
    Carcharodon hubbelli;
    Parotodus;
    Isurus planus;
    Cosmopolitodus;
    Ptychodus;
    Hybodus;
    Acrodus;
    Asteracanthus;
    Egertonodus;
    Tribodus;
    Lonchidion;
    Lissodus;
    Polyacrodus;
    Planohybodus;
    Parahybolus;
    Hamiltonichthys;
    Orthacanthus;
    Xenacanthus;
    Diplodoselache;
    Lebachacanthus;
    Triodus;
    Cladoselache;
    Stethacanthus;
    Falcatus;
    Damocles;
    Akmonistion;
    Symmorium;
    Denaea;
    Cobelodus;
    Ferromirum;
    Ozarcus;
    Gladbachus;
    Doliodus;
    Antarctilamna;
    Leonodus;
    Tamiobatis;
    Ctenacanthus;
    Saivodus;
    Glikmanius;
    Bandringa;
    Helicoprion;
    Edestus;
    Parahelicoprion;
    Sarcoprion;
    Agassizodus;
    Caseodus;
    Fadenia;
    Ornithoprion;
    Bobbodus;
    Campyloprion;
    Orodus;
    Petalodus;
    Janassa;
    Menaspis;
    Debeerius;
    Chondrenchelys;
    Iniopera;
    Iniopteryx;
    Sibyrhynchus;
    Promexyele;
    Sibirhynchus;
    Echinochimaera;
    Ischyodus;
    Edaphodon;
    Myriacanthus;
    Squaloraja;
    Acanthorhina
  `);

  // ============================================================
  // OVERIGE PREHISTORISCHE VISSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Dunkleosteus;
    Titanichthys;
    Dinichthys;
    Eastmanosteus;
    Gorgonichthys;
    Bungartius;
    Heintzichthys;
    Gymnotrachelus;
    Coccosteus;
    Plourdosteus;
    Incisoscutum;
    Compagopiscis;
    Materpiscis;
    Austroptyctodus;
    Rhamphodopsis;
    Campbellodus;
    Ptyctodus;
    Bothriolepis;
    Asterolepis;
    Pterichthyodes;
    Microbrachius;
    Remigolepis;
    Pambulaspis;
    Brindabellaspis;
    Romundina;
    Entelognathus;
    Qilinyu;
    Xiushanosteus;
    Silurolepis;
    Wangolepis;
    Stensioella;
    Palaeospondylus;
    Cephalaspis;
    Hemicyclaspis;
    Thyestes;
    Tremataspis;
    Boreaspis;
    Kiaeraspis;
    Dartmuthia;
    Osteostraci;
    Pteraspis;
    Drepanaspis;
    Doryaspis;
    Errivaspis;
    Anglaspis;
    Cyathaspis;
    Astraspis;
    Arandaspis;
    Sacabambaspis;
    Myllokunmingia;
    Haikouichthys;
    Jamoytius;
    Euphanerops;
    Birkenia;
    Lasanius;
    Ateleaspis;
    Thelodus;
    Loganellia;
    Furcacauda;
    Phlebolepis;
    Acanthodes;
    Climatius;
    Ischnacanthus;
    Diplacanthus;
    Cheiracanthus;
    Mesacanthus;
    Parexus;
    Brochoadmones;
    Nerepisacanthus;
    Rhadinacanthus;
    Eusthenopteron;
    Panderichthys;
    Tiktaalik;
    Elpistostege;
    Gogonasus;
    Osteolepis;
    Megalichthys;
    Gyroptychius;
    Medoevia;
    Rhizodus;
    Strepsodus;
    Sauripterus;
    Barameda;
    Gooloogongia;
    Holoptychius;
    Glyptolepis;
    Laccognathus;
    Onychodus;
    Strunius;
    Porolepis;
    Psarolepis;
    Guiyu;
    Achoania;
    Youngolepis;
    Diabolepis;
    Dipterus;
    Chirodipterus;
    Rhinodipterus;
    Griphognathus;
    Fleurantia;
    Phaneropleuron;
    Scaumenacia;
    Sagenodus;
    Ctenodus;
    Ceratodus;
    Gnathorhiza;
    Neoceratodus forsteri;
    Coelacanthus;
    Macropoma;
    Mawsonia;
    Axelrodichthys;
    Megalocoelacanthus;
    Undina;
    Holophagus;
    Whiteia;
    Piveteauia;
    Rebellatrix;
    Allenypterus;
    Hadronector;
    Rhabdoderma;
    Miguashaia;
    Diplurus;
    Chinlea;
    Laugia;
    Palaeoniscum;
    Cheirolepis;
    Moythomasia;
    Mimipiscis;
    Howqualepis;
    Mimia;
    Elonichthys;
    Amblypterus;
    Paramblypterus;
    Saurichthys;
    Birgeria;
    Boreosomus;
    Pteronisculus;
    Australosomus;
    Perleidus;
    Colobodus;
    Peltopleurus;
    Habroichthys;
    Thoracopterus;
    Potanichthys;
    Dapedium;
    Semionotus;
    Lepidotes;
    Scheenstia;
    Macrosemius;
    Propterus;
    Ophiopsis;
    Caturus;
    Furo;
    Amblysemius;
    Amiopsis;
    Pachycormus;
    Leedsichthys;
    Asthenocormus;
    Bonnerichthys;
    Martillichthys;
    Rhinconichthys;
    Protosphyraena;
    Xiphactinus;
    Gillicus;
    Ichthyodectes;
    Cladocyclus;
    Chirocentrites;
    Saurodon;
    Saurocephalus;
    Enchodus;
    Cimolichthys;
    Stratodus;
    Apsopelix;
    Crossognathus;
    Pachyrhizodus;
    Goulmimichthys;
    Araripichthys;
    Vinctifer;
    Aspidorhynchus;
    Belonostomus;
    Thrissops;
    Leptolepis;
    Anaethalion;
    Diplomystus;
    Knightia;
    Mioplosus;
    Priscacara;
    Cockerellites;
    Phareodus;
    Hiodon falcatus;
    Notogoneus;
    Amphiplaga;
    Erismatopterus;
    Eohiodon;
    Massamorichthys;
    Eosalmo;
    Prolebias;
    Mene rhombea;
    Bolcaichthys
  `);

  samenvoegen("Mimipiscis", "Mimia");

  // Australische longvis is niet uitgestorven.

  verwijderKoppeling(
    "Neoceratodus forsteri",
    [43]
  );

  // ============================================================
  // MAMMOETEN EN PREHISTORISCHE OLIFANTACHTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Mammoet;
    Wolharige mammoet=Mammuthus primigenius;
    Steppemammoet=Mammuthus trogontherii;
    Zuidelijke mammoet=Mammuthus meridionalis;
    Colombiaanse mammoet=Mammuthus columbi;
    Dwergmammoet=Mammuthus exilis;
    Kretenzische dwergmammoet=Mammuthus creticus;
    Afrikaanse mammoet=Mammuthus africanavus;
    Mammuthus subplanifrons;
    Mastodont;
    Amerikaanse mastodont=Mammut americanum;
    Pacifische mastodont=Mammut pacificus;
    Mammut borsoni;
    Zygolophodon;
    Gomphotherium;
    Amebelodon;
    Platybelodon;
    Archaeobelodon;
    Serbelodon;
    Torynobelodon;
    Aphanobelodon;
    Gnathabelodon;
    Tetralophodon;
    Anancus;
    Cuvieronius;
    Notiomastodon;
    Stegomastodon;
    Haplomastodon;
    Sinomastodon;
    Eubelodon;
    Rhynchotherium;
    Blancotherium;
    Choerolophodon;
    Konobelodon;
    Stegodon;
    Stegolophodon;
    Primelephas;
    Palaeoloxodon;
    Europese bosolifant=Palaeoloxodon antiquus;
    Palaeoloxodon namadicus;
    Palaeoloxodon falconeri;
    Palaeoloxodon mnaidriensis;
    Palaeoloxodon cypriotes;
    Palaeoloxodon tiliensis;
    Palaeoloxodon naumanni;
    Deinotherium;
    Prodeinotherium;
    Chilgatherium;
    Moeritherium;
    Barytherium;
    Numidotherium;
    Phosphatherium;
    Daouitherium;
    Eritherium;
    Palaeomastodon;
    Phiomia;
    Eritreum;
    Hemimastodon
  `);

  // ============================================================
  // SAB E L T A N D K A T T E N
  // ============================================================

  uitgestorvenDierenV9(`
    Sabeltandtijger;
    Smilodon;
    Smilodon fatalis;
    Smilodon populator;
    Smilodon gracilis;
    Homotherium;
    Homotherium serum;
    Homotherium latidens;
    Homotherium crenatidens;
    Machairodus;
    Amphimachairodus;
    Lokotunjailurus;
    Nimravides;
    Xenosmilus;
    Megantereon;
    Paramachairodus;
    Promegantereon;
    Rhizosmilodon;
    Dinofelis;
    Metailurus;
    Yoshi;
    Adelphailurus;
    Stenailurus;
    Taowu;
    Longchuansmilus;
    Nimravus;
    Eusmilus;
    Hoplophoneus;
    Dinictis;
    Nanosmilus;
    Pogonodon;
    Quercylurus;
    Eofelis;
    Barbourofelis;
    Sansanosmilus;
    Prosansanosmilus;
    Afrosmilus;
    Ginsburgsmilus;
    Vampyrictis
  `);

  samenvoegen("Smilodon", "Sabeltandtijger");

  // ============================================================
  // OVERIGE UITGESTORVEN ROOFDIEREN
  // ============================================================

  uitgestorvenDierenV9(`
    Grottenleeuw=Panthera spelaea;
    Amerikaanse leeuw=Panthera atrox;
    Beringische leeuw;
    Europese jaguar=Panthera gombaszoegensis;
    Panthera blytheae;
    Panthera palaeosinensis;
    Panthera zdanskyi;
    Pseudaelurus;
    Proailurus;
    Styriofelis;
    Pristifelis;
    Hyperailurictis;
    Miracinonyx;
    Amerikaanse cheeta;
    Acinonyx pardinensis;
    Puma pardoides;
    Reuzenwolf=Aenocyon dirus=Dire wolf;
    Canis armbrusteri;
    Canis edwardii;
    Canis etruscus;
    Canis mosbachensis;
    Canis lepophagus;
    Canis arnensis;
    Canis falconeri;
    Canis nehringi;
    Xenocyon;
    Epicyon;
    Borophagus;
    Aelurodon;
    Osteoborus;
    Tomarctus;
    Cynarctus;
    Phlaocyon;
    Archaeocyon;
    Desmocyon;
    Cormocyon;
    Hesperocyon;
    Mesocyon;
    Enhydrocyon;
    Paraenhydrocyon;
    Osbornodon;
    Cynodesmus;
    Leptocyon;
    Eucyon;
    Prohesperocyon;
    Grottenbeer=Ursus spelaeus;
    Ursus deningeri;
    Ursus etruscus;
    Ursus minimus;
    Ursus ingressus;
    Ursus arctos priscus;
    Kortsnuitbeer=Arctodus simus;
    Arctodus pristinus;
    Arctotherium angustidens;
    Arctotherium bonariense;
    Arctotherium tarijense;
    Arctotherium vetustum;
    Arctotherium wingei;
    Agriotherium;
    Indarctos;
    Hemicyon;
    Plithocyon;
    Cephalogale;
    Ursavus;
    Kretzoiarctos;
    Ailurarctos;
    Amphicynodon;
    Amphicyon;
    Daphoenodon;
    Daphoenus;
    Daphoenictis;
    Ischyrocyon;
    Cynelos;
    Pseudocyon;
    Magericyon;
    Ysengrinia;
    Thaumastocyon;
    Megamphicyon;
    Pliocyon;
    Pseudarctos;
    Temnocyon;
    Mammacyon;
    Haplocyon;
    Hyaenodon;
    Megistotherium;
    Hyainailouros;
    Simbakubwa;
    Kerberos;
    Pterodon;
    Apterodon;
    Dissopsalis;
    Metapterodon;
    Leakitherium;
    Sinopa;
    Tritemnodon;
    Prototomus;
    Arfia;
    Proviverra;
    Oxyaena;
    Patriofelis;
    Machaeroides;
    Apataelurus;
    Sarkastodon;
    Dipsalidictis;
    Tytthaena;
    Mesonyx;
    Andrewsarchus;
    Harpagolestes;
    Pachyaena;
    Dissacus;
    Sinonyx;
    Ankalagon;
    Hapalodectes;
    Mongolonyx;
    Mongolestes;
    Palaeonictis;
    Dinocrocuta;
    Percrocuta;
    Adcrocuta;
    Chasmaporthetes;
    Pachycrocuta;
    Pliocrocuta;
    Ictitherium;
    Hyaenotherium;
    Thalassictis;
    Protictitherium;
    Plioviverrops;
    Plesiogulo;
    Megalictis;
    Ekorus;
    Enhydriodon;
    Siamogale;
    Sivaonyx;
    Vishnuonyx;
    Potamotherium;
    Megalenhydris;
    Enhydra macrodonta;
    Leptarctus;
    Palaeomeles;
    Taxodon;
    Eomellivora;
    Simocyon;
    Pristinailurus;
    Parailurus;
    Siamictis;
    Magerictis;
    Procyon rexroadensis;
    Chapalmalania;
    Cyonasua
  `);

  samenvoegen(
    "Miracinonyx",
    "Amerikaanse cheeta"
  );

  // ============================================================
  // PREHISTORISCHE NEUSHOORNS
  // ============================================================

  uitgestorvenDierenV9(`
    Wolharige neushoorn=Coelodonta antiquitatis;
    Coelodonta thibetana;
    Coelodonta nihowanensis;
    Coelodonta tologoijensis;
    Elasmotherium;
    Stephanorhinus;
    Stephanorhinus kirchbergensis;
    Stephanorhinus hemitoechus;
    Stephanorhinus etruscus;
    Stephanorhinus hundsheimensis;
    Dicerorhinus megarhinus;
    Dihoplus;
    Pliorhinus;
    Lartetotherium;
    Brachypotherium;
    Teleoceras;
    Aphelops;
    Menoceras;
    Diceratherium;
    Subhyracodon;
    Trigonias;
    Epiaceratherium;
    Ronzotherium;
    Protaceratherium;
    Aceratherium;
    Chilotherium;
    Alicornops;
    Aprotodon;
    Plesiaceratherium;
    Hoploaceratherium;
    Hispanotherium;
    Iranotherium;
    Sinotherium;
    Ningxiatherium;
    Parelasmotherium;
    Bugtirhinus;
    Kenyatherium;
    Paraceratherium=Indricotherium=Baluchitherium;
    Juxia;
    Urtinotherium;
    Dzungariotherium;
    Aralotherium;
    Turpanotherium;
    Forstercooperia;
    Pappaceras;
    Hyracodon;
    Triplopus;
    Amynodon;
    Metamynodon;
    Cadurcodon;
    Zaisanamynodon
  `);

  // ============================================================
  // PREHISTORISCHE PAARDACHTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Oerpaard;
    Eohippus;
    Hyracotherium;
    Orohippus;
    Epihippus;
    Mesohippus;
    Miohippus;
    Kalobatippus;
    Archaeohippus;
    Parahippus;
    Merychippus;
    Acritohippus;
    Scaphohippus;
    Parapliohippus;
    Pliohippus;
    Dinohippus;
    Astrohippus;
    Hipparion;
    Cormohipparion;
    Neohipparion;
    Nannippus;
    Pseudhipparion;
    Eurygnathohippus;
    Sivalhippus;
    Cremohipparion;
    Hippotherium;
    Proboscidipparion;
    Plesiohipparion;
    Baryhipparion;
    Hypohippus;
    Megahippus;
    Anchitherium;
    Sinohippus;
    Hippidion;
    Equus giganteus;
    Equus scotti;
    Equus simplicidens;
    Equus stenonis;
    Equus sivalensis;
    Equus koobiforensis;
    Equus capensis;
    Equus hydruntinus;
    Equus conversidens;
    Equus occidentalis;
    Equus neogeus;
    Quagga=Equus quagga quagga;
    Tarpan
  `);

  // ============================================================
  // PREHISTORISCHE HOEFDIEREN
  // ============================================================

  uitgestorvenDierenV9(`
    Oeros=Bos primigenius;
    Steppebizon=Bison priscus;
    Bison latifrons;
    Bison antiquus;
    Bison occidentalis;
    Bison palaeosinensis;
    Leptobos;
    Pelorovis;
    Syncerus antiquus;
    Bubalus palaeokerabau;
    Bos acutifrons;
    Epileptobos;
    Hemibos;
    Proleptobos;
    Megalotragus;
    Rusingoryx;
    Sivacobus;
    Ugandax;
    Eotragus;
    Tethytragus;
    Gentrytragus;
    Turcocerus;
    Miotragocerus;
    Tragoportax;
    Protragocerus;
    Pseudotragus;
    Selenoportax;
    Pachyportax;
    Sivat ragus;
    Myotragus balearicus;
    Nesogoral;
    Maremmia;
    Criotherium;
    Tsaidamotherium;
    Qurliqnoria;
    Budorcas taxicolor;
    Reuzenhert=Megaloceros giganteus;
    Megaloceros;
    Megaceroides;
    Sinomegaceros;
    Praemegaceros;
    Eucladoceros;
    Arvernoceros;
    Dama celiae;
    Cervalces;
    Cervalces scotti;
    Alces latifrons;
    Candiacervus;
    Hoplitomeryx;
    Protoceras;
    Syndyoceras;
    Synthetoceras;
    Kyptoceras;
    Paratoceras;
    Leptotragulus;
    Heteromeryx;
    Prosynthetoceras;
    Dromomeryx;
    Cranioceras;
    Aletomeryx;
    Rakomeryx;
    Sinclairomeryx;
    Palaeomeryx;
    Ampelomeryx;
    Triceromeryx;
    Xenokeryx;
    Dremotherium;
    Amphitragulus;
    Gelocus;
    Lophiomeryx;
    Bachitherium;
    Leptomeryx;
    Hypertragulus;
    Hypisodus;
    Archaeomeryx;
    Sivatherium;
    Bramatherium;
    Samotherium;
    Palaeotragus;
    Giraffokeryx;
    Canthumeryx;
    Climacoceras;
    Decennatherium;
    Birgerbohlinia;
    Bohlinia;
    Honanotherium;
    Shansitherium;
    Helladotherium;
    Hydaspitherium;
    Schansitherium;
    Prolibytherium;
    Camelops;
    Titanotylopus;
    Gigantocamelus;
    Megatylopus;
    Aepycamelus;
    Stenomylus;
    Oxydactylus;
    Poebrotherium;
    Protylopus;
    Procamelus;
    Miolabis;
    Michenia;
    Pseudolabis;
    Paramiolabis;
    Paracamelus;
    Alforjas;
    Hemiauchenia;
    Palaeolama;
    Blancocamelus;
    Lama castelnaudi;
    Toxodon;
    Mixotoxodon;
    Trigodon;
    Adinotherium;
    Nesodon;
    Homalodotherium;
    Leontinia;
    Scarrittia;
    Pyrotherium;
    Baguatherium;
    Carodnia;
    Xenungulata;
    Macrauchenia;
    Xenorhinotherium;
    Theosodon;
    Diadiaphorus;
    Thoatherium;
    Proterotherium;
    Eoauchenia;
    Neolicaphrium;
    Tetramerorhinus;
    Megadolodus;
    Didolodus;
    Escribania;
    Ernestokokenia;
    Phenacodus;
    Ectocion;
    Meniscotherium;
    Hyopsodus;
    Periptychus;
    Ectoconus;
    Carsioptychus;
    Pantolambda;
    Coryphodon;
    Barylambda;
    Titanoides;
    Caenolambda;
    Alcidedorbignya;
    Uintatherium;
    Eobasileus;
    Gobiatherium;
    Prodinoceras;
    Bathyopsis;
    Arsinoitherium;
    Palaeoamasia;
    Crivadiatherium;
    Embolotherium;
    Megacerops;
    Brontotherium;
    Brontops;
    Titanotherium;
    Metamynodon;
    Dolichorhinus;
    Telmatherium;
    Palaeosyops;
    Eotitanops;
    Eubrontotherium;
    Parabrontops;
    Chalicotherium;
    Anisodon;
    Moropus;
    Tylocephalonyx;
    Ancylotherium;
    Metaschizotherium;
    Schizotherium;
    Borissiakia
  `);

  hernoemDier("Sivat ragus", "Sivatragus");

  // Takin leeft nog.

  verwijderKoppeling(
    "Budorcas taxicolor",
    [43]
  );

  // ============================================================
  // PREHISTORISCHE VARKENS EN NIJLPAARDEN
  // ============================================================

  uitgestorvenDierenV9(`
    Daeodon=Dinohyus;
    Entelodon;
    Archaeotherium;
    Paraentelodon;
    Brachyhyops;
    Eoentelodon;
    Cypretherium;
    Barytherium;
    Kubanochoerus;
    Megalochoerus;
    Listriodon;
    Bunolistriodon;
    Hyotherium;
    Aureliachoerus;
    Palaeochoerus;
    Propalaeochoerus;
    Doliochoerus;
    Xenohyus;
    Cainochoerus;
    Microstonyx;
    Propotamochoerus;
    Hippopotamodon;
    Tetraconodon;
    Sivachoerus;
    Metridiochoerus;
    Notochoerus;
    Kolpochoerus;
    Nyanzachoerus;
    Potamochoeroides;
    Platygonus;
    Mylohyus;
    Prosthennops;
    Dyseohyus;
    Hesperhys;
    Perchoerus;
    Desmathyus;
    Catagonus stenocephalus;
    Europees nijlpaard=Hippopotamus antiquus;
    Hippopotamus gorgops;
    Hippopotamus major;
    Hippopotamus pentlandi;
    Hippopotamus melitensis;
    Hippopotamus minor;
    Hippopotamus lemerlei;
    Hippopotamus madagascariensis;
    Hippopotamus laloumena;
    Hexaprotodon;
    Archaeopotamus;
    Kenyapotamus;
    Saotherium;
    Morotochoerus;
    Anthracotherium;
    Bothriodon;
    Elomeryx;
    Merycopotamus;
    Libycosaurus;
    Brachyodus;
    Microbunodon;
    Siamotherium;
    Anthracokeryx;
    Heptacodon;
    Aepinacodon
  `);

  // ============================================================
  // PREHISTORISCHE LUIAARDS EN GORDELDIEREN
  // ============================================================

  uitgestorvenDierenV9(`
    Reuzenluiaard;
    Megatherium;
    Eremotherium;
    Pyramiodontherium;
    Megathericulus;
    Plesiomegatherium;
    Promegatherium;
    Urumaquia;
    Mylodon;
    Glossotherium;
    Paramylodon;
    Lestodon;
    Scelidotherium;
    Catonyx;
    Valgipes;
    Scelidodon;
    Octomylodon;
    Nematherium;
    Hapalops;
    Analcimorphus;
    Schismotherium;
    Pelecyodon;
    Eucholoeops;
    Nothrotherium;
    Nothrotheriops;
    Thalassocnus;
    Mionothropus;
    Pronothrotherium;
    Hiskatherium;
    Megalonyx;
    Megalocnus;
    Acratocnus;
    Parocnus;
    Neocnus;
    Imagocnus;
    Pliometanastes;
    Pseudoprepotherium;
    Diabolotherium;
    Oreomylodon;
    Xibalbaonyx;
    Meizonyx;
    Nohochichak;
    Glyptodon;
    Doedicurus;
    Panochthus;
    Neosclerocalyptus;
    Glyptotherium;
    Glyptatelus;
    Propalaehoplophorus;
    Eucinepeltus;
    Cochlops;
    Asterostemma;
    Parapropalaehoplophorus;
    Plohophorus;
    Pseudoplohophorus;
    Hoplophorus;
    Lomaphorus;
    Urotherium;
    Eleutherocercus;
    Plaxhaplous;
    Pampatherium;
    Holmesina;
    Vassallia;
    Kraglievichia;
    Scirrotherium;
    Plaina;
    Machlydotherium;
    Proeutatus;
    Eutatus;
    Peltephilus;
    Stegotherium;
    Macroeuphractus;
    Prozaedyus;
    Stenotatus;
    Utaetus;
    Astegotherium;
    Riostegotherium;
    Kuntinaru;
    Palaeopeltis;
    Meteutatus;
    Palaeodadylus
  `);

  verwijderDier("Palaeodadylus");

  // ============================================================
  // PREHISTORISCHE BUIDELDIEREN
  // ============================================================

  uitgestorvenDierenV9(`
    Diprotodon;
    Zygomaturus;
    Palorchestes;
    Euryzygoma;
    Euowenia;
    Nototherium;
    Kolopsis;
    Kolopsoides;
    Neohelos;
    Nimbadon;
    Ngapakaldia;
    Pyramios;
    Raemeotherium;
    Silvabestius;
    Hulitherium;
    Maokopia;
    Thylacoleo carnifex;
    Buidelleeuw;
    Wakaleo;
    Priscileo;
    Microleo;
    Procoptodon;
    Sthenurus;
    Simosthenurus;
    Protemnodon;
    Congruus;
    Troposodon;
    Hadronomas;
    Kurrabi;
    Dorcopsoides;
    Baringa;
    Bohra;
    Ekaltadeta;
    Propleopus;
    Jackmahoneya;
    Hypsiprymnodon bartholomaii;
    Purtia;
    Balbaroo;
    Nambaroo;
    Ganawamaya;
    Wabularoo;
    Namilamadeta;
    Wynyardia;
    Muramura;
    Warendja;
    Rhizophascolonus;
    Phascolonus;
    Ramsayia;
    Sedophascolomys;
    Phascolarctos stirtoni;
    Nimiokoala;
    Litokoala;
    Madakoala;
    Perikoala;
    Invictokoala;
    Thylacinus cynocephalus;
    Tasmaanse tijger=Tasmaanse wolf=Thylacine;
    Thylacinus potens;
    Thylacinus megiriani;
    Nimbacinus;
    Mutpuracinus;
    Badjcinus;
    Muribacinus;
    Ngamalacinus;
    Wabulacinus;
    Maximucinus;
    Dasyurus dunmalli;
    Sarcophilus harrisii;
    Sarcophilus laniarius;
    Malleodectes;
    Yalkaparidon;
    Yalkaparidon coheni;
    Yalkaparidon jonesi;
    Thylacosmilus;
    Borhyaena;
    Prothylacynus;
    Arctodictis;
    Australohyaena;
    Lycopsis;
    Cladosictis;
    Sipalocyon;
    Hathliacynus;
    Pseudonotictis;
    Acyon;
    Perathereutes;
    Patagosmilus;
    Anachlysictis;
    Callistoe;
    Allqokirus;
    Mayulestes;
    Pucadelphys;
    Andinodelphys;
    Szalinia;
    Tiupampa;
    Didelphodon;
    Alphadon;
    Pediomys;
    Turgidodon;
    Deltatheridium;
    Deltatheroides;
    Lotheridium;
    Sulestes;
    Asiatherium;
    Sinodelphys
  `);

  samenvoegen(
    "Buidelleeuw",
    "Thylacoleo carnifex"
  );

  samenvoegen(
    "Tasmaanse tijger",
    "Thylacinus cynocephalus"
  );

  // De Tasmaanse duivel leeft nog.

  verwijderKoppeling(
    "Sarcophilus harrisii",
    [43]
  );

  verwijderDier("Tiupampa");

  // ============================================================
  // PREHISTORISCHE WALVISSEN EN DOLFIJNEN
  // ============================================================

  uitgestorvenDierenV9(`
    Pakicetus;
    Ambulocetus;
    Himalayacetus;
    Ichthyolestes;
    Nalacetus;
    Gandakasia;
    Attockicetus;
    Remingtonocetus;
    Dalanistes;
    Andrewsiphius;
    Kutchicetus;
    Rayanistes;
    Rodhocetus;
    Protocetus;
    Maiacetus;
    Georgiacetus;
    Peregocetus;
    Aegicetus;
    Takracetus;
    Artiocetus;
    Qaisracetus;
    Makaracetus;
    Gaviacetus;
    Babiacetus;
    Indocetus;
    Eocetus;
    Carolinacetus;
    Natchitochia;
    Cynthiacetus;
    Dorudon;
    Basilosaurus;
    Basiloterus;
    Zygorhiza;
    Saghacetus;
    Stromerius;
    Chrysocetus;
    Supayacetus;
    Ocucajea;
    Pachycetus;
    Tutcetus;
    Perucetus;
    Llanocetus;
    Mystacodon;
    Coronodon;
    Mammalodon;
    Janjucetus;
    Aetiocetus;
    Chonecetus;
    Fucaia;
    Morawanocetus;
    Ashorocetus;
    Willungacetus;
    Yamatocetus;
    Eomysticetus;
    Micromysticetus;
    Tohoraata;
    Tokarahia;
    Waharoa;
    Matapanui;
    Tohorata;
    Whakakai;
    Mauicetus;
    Horopeta;
    Whakatu;
    Cetotherium;
    Herpetocetus;
    Piscobalaena;
    Metopocetus;
    Nannocetus;
    Mithridatocetus;
    Kurdalagonus;
    Brandtocetus;
    Zygiocetus;
    Vampalus;
    Joumocetus;
    Titanocetus;
    Diorocetus;
    Parietobalaena;
    Pelocetus;
    Aglaocetus;
    Isanacetus;
    Pinocetus;
    Thinocetus;
    Uranocetus;
    Cophocetus;
    Incakujira;
    Plesiobalaenoptera;
    Archaebalaenoptera;
    Protororqual;
    Norrisanima;
    Fragilicetus;
    Megapteropsis;
    Balaenella;
    Balaenula;
    Balaenotus;
    Balaenoptera ryani;
    Eubalaena ianitrix;
    Morenocetus;
    Peripolocetus;
    Archaeobalaena;
    Livyatan=Livyatan melvillei;
    Brygmophyseter;
    Acrophyseter;
    Zygophyseter;
    Aulophyseter;
    Orycterocetus;
    Diaphorocetus;
    Idiorophus;
    Placoziphius;
    Rhaphicetus;
    Scaphokogia;
    Nanokogia;
    Kogia pusilla;
    Praekogia;
    Physeterula;
    Albicetus;
    Eudelphis;
    Ferecetotherium;
    Squalodon;
    Squaloziphius;
    Waipatia;
    Otekaikea;
    Papahu;
    Awamokoa;
    Urkudelphis;
    Ankylorhiza;
    Cotylocara;
    Echovenator;
    Xenorophus;
    Albertocetus;
    Archaeodelphis;
    Agorophius;
    Simocetus;
    Prosqualodon;
    Notocetus;
    Phoberodon;
    Inticetus;
    Squalodelphis;
    Medocinia;
    Huaridelphis;
    Macrosqualodelphis;
    Zarhinocetus;
    Allodelphis;
    Ninjadelphis;
    Goedertius;
    Arktocara;
    Platanista gangetica;
    Pomatodelphis;
    Zarhachis;
    Xiphiacetus;
    Eurhinodelphis;
    Schizodelphis;
    Ziphiodelphis;
    Argyrocetus;
    Chilcacetus;
    Macrodelphinus;
    Eoplatanista;
    Kentriodon;
    Liolithax;
    Delphinodon;
    Lophocetus;
    Atocetus;
    Pithanodelphis;
    Sophianacetus;
    Kampholophos;
    Rudicetus;
    Hadrodelphis;
    Tagicetus;
    Wimahl;
    Albireo;
    Eodelphis;
    Numataphocoena;
    Haborophocoena;
    Miophocaena;
    Pterophocaena;
    Piscolithax;
    Salumiphocaena;
    Australithax;
    Lomacetus;
    Semirostrum;
    Septemtriocetus;
    Brabocetus;
    Archaeoziphius;
    Ninoziphius;
    Nazcacetus;
    Messapicetus;
    Ziphirostrum;
    Choneziphius;
    Globicetus;
    Tusciziphius;
    Beneziphius;
    Aporotus;
    Berardius kobayashii;
    Africanacetus;
    Ihlengesi;
    Imocetus;
    Xhosacetus;
    Khoikhoicetus;
    Notoziphius;
    Chimuziphius;
    Chavinziphius;
    Bianucci;
    Bohaskaia;
    Denebola;
    Casatia;
    Haborodelphis;
    Protoglobicephala;
    Etruridelphis;
    Astadelphis;
    Hemisyntrachelus;
    Orcinus citoniensis
  `);

  verwijderDier("Bianucci");
  verwijderDier("Tohorata");

  // De Gangesdolfijn is bedreigd, maar niet uitgestorven.

  verwijderKoppeling(
    "Platanista gangetica",
    [43]
  );

  // ============================================================
  // UITGESTORVEN ZEEKOEIEN EN ZEEHONDACHTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Stellers zeekoe=Hydrodamalis gigas;
    Hydrodamalis cuestae;
    Dusisiren;
    Pezosiren;
    Prorastomus;
    Protosiren;
    Ashokia;
    Libysiren;
    Eotheroides;
    Eosiren;
    Halitherium;
    Kaupitherium;
    Metaxytherium;
    Rytiodus;
    Caribosiren;
    Crenatosiren;
    Dioplotherium;
    Nanosiren;
    Callistosiren;
    Culebratherium;
    Corystosiren;
    Xenosiren;
    Bharatisiren;
    Domningia;
    Kutchisiren;
    Indosiren;
    Miosiren;
    Anomotherium;
    Potamosiren;
    Ribodon;
    Proneotherium;
    Prototaria;
    Neotherium;
    Imagotaria;
    Pontolis;
    Dusignathus;
    Gomphotaria;
    Aivukus;
    Pliopedia;
    Valenictus;
    Ontocetus;
    Protodobenia;
    Archaeodobenus;
    Titanotaria;
    Pelagiarctos;
    Enaliarctos;
    Pteronarctos;
    Pacificotaria;
    Pinnarctidion;
    Allodesmus;
    Desmatophoca;
    Atopotarus;
    Eotaria;
    Thalassoleon;
    Pithanotaria;
    Proterozetes;
    Callorhinus gilmorei;
    Callorhinus ursinus;
    Acrophoca;
    Piscophoca;
    Hadrokirus;
    Homiphoca;
    Properiptychus;
    Leptophoca;
    Praepusa;
    Cryptophoca;
    Devinophoca;
    Nanophoca;
    Afrophoca;
    Noriphoca;
    Monachopsis;
    Pontophoca;
    Phocanella;
    Pliophoca;
    Kawas benegasorum;
    Australophoca;
    Caribische monniksrob=Neomonachus tropicalis;
    Japanse zeeleeuw=Zalophus japonicus
  `);

  // De noordelijke pelsrob leeft nog.

  verwijderKoppeling(
    "Callorhinus ursinus",
    [43]
  );

  // ============================================================
  // PREHISTORISCHE PRIMATEN
  // ============================================================

  uitgestorvenDierenV9(`
    Gigantopithecus;
    Gigantopithecus blacki;
    Sivapithecus;
    Ramapithecus;
    Lufengpithecus;
    Khoratpithecus;
    Ankarapithecus;
    Dryopithecus;
    Hispanopithecus;
    Rudapithecus;
    Pierolapithecus;
    Anoiapithecus;
    Danuvius;
    Oreopithecus;
    Ouranopithecus;
    Graecopithecus;
    Nakalipithecus;
    Samburupithecus;
    Kenyapithecus;
    Equatorius;
    Griphopithecus;
    Afropithecus;
    Heliopithecus;
    Morotopithecus;
    Nacholapithecus;
    Proconsul;
    Ekembo;
    Ugandapithecus;
    Rangwapithecus;
    Nyanzapithecus;
    Turkanapithecus;
    Mabokopithecus;
    Kalepithecus;
    Limnopithecus;
    Dendropithecus;
    Micropithecus;
    Simiolus;
    Pliopithecus;
    Anapithecus;
    Epipliopithecus;
    Crouzelia;
    Laccopithecus;
    Dionysopithecus;
    Platodontopithecus;
    Aegyptopithecus;
    Propliopithecus;
    Catopithecus;
    Oligopithecus;
    Proteopithecus;
    Serapia;
    Apidium;
    Parapithecus;
    Qatrania;
    Biretia;
    Arsinoea;
    Algeripithecus;
    Afrotarsius;
    Eosimias;
    Bahinia;
    Phenacopithecus;
    Myanmarpithecus;
    Pondaungia;
    Amphipithecus;
    Ganlea;
    Siamopithecus;
    Bugtipithecus;
    Anthrasimias;
    Archicebus;
    Teilhardina;
    Tetonius;
    Shoshonius;
    Omomys;
    Necrolemur;
    Microchoerus;
    Pseudoloris;
    Rooneyia;
    Nannopithex;
    Anaptomorphus;
    Absarokius;
    Hemiacodon;
    Macrotarsius;
    Washakius;
    Ourayia;
    Utahia;
    Adapis;
    Leptadapis;
    Notharctus;
    Cantius;
    Smilodectes;
    Darwinius;
    Europolemur;
    Godinotia;
    Caenopithecus;
    Aframonius;
    Afradapis;
    Masradapis;
    Mahgarita;
    Asiadapis;
    Marcgodinotius;
    Sivaladapis;
    Indraloris;
    Purgatorius;
    Plesiadapis;
    Carpolestes;
    Ignacius;
    Phenacolemur;
    Paromomys;
    Megaladapis;
    Archaeoindris;
    Palaeopropithecus;
    Babakotia;
    Mesopropithecus;
    Archaeolemur;
    Hadropithecus;
    Pachylemur;
    Daubentonia robusta;
    Protopithecus;
    Caipora;
    Cartelles;
    Paralouatta;
    Xenothrix;
    Antillothrix;
    Insulacebus;
    Branisella;
    Perupithecus;
    Canaanimico;
    Panamacebus;
    Dolichocebus;
    Homunculus;
    Tremacebus;
    Chilecebus;
    Soriacebus;
    Mazzonicebus;
    Carlocebus;
    Neosaimiri;
    Stirtonia;
    Cebupithecia;
    Lagonimico;
    Nuciruptor;
    Proteropithecia;
    Mohanamico;
    Aotus dindensis;
    Pithecia monachus;
    Victoriapithecus;
    Noropithecus;
    Prohylobates;
    Nsungwepithecus;
    Mesopithecus;
    Dolichopithecus;
    Paracolobus;
    Rhinocolobus;
    Libypithecus;
    Cercopithecoides;
    Theropithecus oswaldi;
    Dinopithecus;
    Gorgopithecus;
    Paradolichopithecus;
    Procynocephalus;
    Macaca majori;
    Macaca libyca;
    Macaca prisca;
    Papio angusticeps
  `);

  // Monnikssaki leeft nog.

  verwijderKoppeling(
    "Pithecia monachus",
    [43]
  );

  // ============================================================
  // PREHISTORISCHE MENSACHTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Neanderthaler=Homo neanderthalensis;
    Homo erectus;
    Homo habilis;
    Homo rudolfensis;
    Homo ergaster;
    Homo heidelbergensis;
    Homo antecessor;
    Homo floresiensis;
    Homo luzonensis;
    Homo naledi;
    Denisovamens=Denisovan;
    Australopithecus;
    Australopithecus afarensis;
    Australopithecus africanus;
    Australopithecus anamensis;
    Australopithecus sediba;
    Australopithecus garhi;
    Australopithecus bahrelghazali;
    Australopithecus deyiremeda;
    Paranthropus;
    Paranthropus boisei;
    Paranthropus robustus;
    Paranthropus aethiopicus;
    Ardipithecus ramidus;
    Ardipithecus kadabba;
    Sahelanthropus tchadensis;
    Orrorin tugenensis;
    Kenyanthropus platyops
  `);

  // ============================================================
  // PREHISTORISCHE VOGELS
  // ============================================================

  uitgestorvenDierenV9(`
    Archaeopteryx;
    Confuciusornis;
    Changchengornis;
    Eoconfuciusornis;
    Yangavis;
    Sapeornis;
    Jeholornis;
    Jixiangornis;
    Shenzhouraptor;
    Zhongjianornis;
    Chongmingia;
    Balaur bondoc;
    Protopteryx;
    Eopengornis;
    Pengornis;
    Parapengornis;
    Chiappeavis;
    Yuanchuavis;
    Cruralispennia;
    Eoalulavis;
    Iberomesornis;
    Concornis;
    Noguerornis;
    Elsornis;
    Gobipteryx;
    Gobipipus;
    Halimornis;
    Neuquenornis;
    Soroavisaurus;
    Avisaurus;
    Mirarce;
    Gettyia;
    Intiornis;
    Enantiornis;
    Nanantius;
    Alexornis;
    Martinavis;
    Lectavis;
    Yungavolucris;
    Bauxitornis;
    Cratoavis;
    Cratoavis cearensis;
    Falcatakely;
    Mirusavis;
    Rapaxavis;
    Longirostravis;
    Shanweiniao;
    Longipteryx;
    Boluochia;
    Bohaiornis;
    Sulcavis;
    Zhouornis;
    Parabohaiornis;
    Longusunguis;
    Shenqiornis;
    Fortunguavis;
    Eocathayornis;
    Cathayornis;
    Sinornis;
    Eoenantiornis;
    Vescornis;
    Dapingfangornis;
    Dunhuangia;
    Qiliania;
    Qibingornis;
    Piscivorenantiornis;
    Eogranivora;
    Archaeorhynchus;
    Schizooura;
    Jianchangornis;
    Hongshanornis;
    Longicrusavis;
    Parahongshanornis;
    Tianyuornis;
    Gansus;
    Iteravis;
    Ambiortus;
    Apsaravis;
    Patagopteryx;
    Vorona;
    Hollanda;
    Yanornis;
    Yixianornis;
    Songlingornis;
    Piscivoravis;
    Dingavis;
    Juehuaornis;
    Mengciusornis;
    Bellulornis;
    Yumenornis;
    Changzuiornis;
    Abitusavis;
    Hesperornis;
    Parahesperornis;
    Baptornis;
    Enaliornis;
    Brodavis;
    Canadaga;
    Pasquiaornis;
    Potamornis;
    Chupkaornis;
    Fumicollis;
    Asiahesperornis;
    Judinornis;
    Ichthyornis;
    Janavis;
    Iaceornis;
    Asteriornis;
    Vegavis;
    Polarornis;
    Teviornis;
    Neogaeornis;
    Gallornis;
    Austinornis;
    Palintropus;
    Ceramornis;
    Cimolopteryx;
    Graculavus
  `);

  samenvoegen("Cratoavis", "Cratoavis cearensis");

  // ============================================================
  // SCHRIKVOGELS EN GROTE LOOPVOGELS
  // ============================================================

  uitgestorvenDierenV9(`
    Schrikvogel=Terreurvogel;
    Phorusrhacos;
    Kelenken;
    Titanis;
    Devincenzia;
    Brontornis;
    Paraphysornis;
    Physornis;
    Patagornis;
    Andalgalornis;
    Andrewsornis;
    Psilopterus;
    Procariama;
    Mesembriornis;
    Llallawavis;
    Paleopsilopterus;
    Lavocatavis;
    Eleutherornis;
    Gastornis=Diatryma;
    Gastornis gigantea;
    Gastornis parisiensis;
    Gastornis sarasini;
    Gastornis russelli;
    Gastornis xichuanensis;
    Dromornis;
    Dromornis stirtoni;
    Dromornis planei;
    Dromornis murrayi;
    Ilbandornis;
    Barawertornis;
    Bullockornis;
    Genyornis;
    Progura;
    Latagallina;
    Sylviornis;
    Megavitiornis;
    Olifantsvogel=Aepyornis;
    Aepyornis maximus;
    Aepyornis hildebrandti;
    Mullerornis;
    Vorombe titan;
    Moa;
    Dinornis robustus;
    Dinornis novaezealandiae;
    Pachyornis elephantopus;
    Pachyornis australis;
    Pachyornis geranoides;
    Emeus crassus;
    Euryapteryx curtus;
    Anomalopteryx didiformis;
    Megalapteryx didinus;
    Palaeotis;
    Remiornis;
    Diogenornis;
    Eremopezus;
    Struthio camelus syriacus;
    Struthio anderssoni;
    Struthio oldawayi;
    Struthio asiaticus;
    Struthio chersonensis;
    Struthio karatheodoris;
    Pachystruthio dmanisensis;
    Pachystruthio pannonicus
  `);

  // ============================================================
  // PREHISTORISCHE ROOFVOGELS EN ZEEVOGELS
  // ============================================================

  uitgestorvenDierenV9(`
    Haasts arend=Hieraaetus moorei=Harpagornis moorei;
    Argentavis magnificens;
    Teratornis;
    Aiolornis;
    Cathartornis;
    Taubatornis;
    Oscaravis;
    Pelagornis;
    Pelagornis sandersi;
    Pelagornis chilensis;
    Pelagornis miocaenus;
    Osteodontornis;
    Dasornis;
    Pseudodontornis;
    Odontopteryx;
    Gigantornis;
    Macrodontopteryx;
    Protodontopteryx;
    Lutetodontopteryx;
    Cyphornis;
    Palaeochenoides;
    Tympanonesiotes;
    Waimanu;
    Muriwaimanu;
    Sequiwaimanu;
    Kupoupou;
    Crossvallia;
    Kumimanu;
    Kumimanu biceae;
    Kumimanu fordycei;
    Petradyptes;
    Kaiika;
    Kairuku;
    Palaeeudyptes;
    Pachydyptes;
    Anthropornis;
    Icadyptes;
    Inkayacu;
    Perudyptes;
    Archaeospheniscus;
    Duntroonornis;
    Marambiornis;
    Mesetaornis;
    Delphinornis;
    Tonniornis;
    Aprosdokitos;
    Palaeospheniscus;
    Eretiscus;
    Paraptenodytes;
    Arthrodytes;
    Platydyptes;
    Marplesornis;
    Madrynornis;
    Spheniscus megaramphus;
    Spheniscus urbinai;
    Spheniscus muizoni;
    Spheniscus chilensis;
    Inguza;
    Nucleornis;
    Dege hendeyi;
    Tasidyptes;
    Tereingaornis;
    Eudyptes atatu;
    Eudyptes warhami;
    Mancalla;
    Miomancalla;
    Praemancalla;
    Alcodes;
    Australca;
    Petralca;
    Hesperalca;
    Pinguinus alfrednewtoni;
    Copepteryx;
    Hokkaidornis;
    Plotopterum;
    Tonsala;
    Phocavis;
    Stemec;
    Phalacrocorax perspicillatus;
    Kenyalang;
    Prophaethon;
    Lithoptila;
    Zhylgaia;
    Limnofregata;
    Fregata aquila;
    Protoplotus;
    Borvocarbo;
    Nectornis;
    Meganhinga;
    Macranhinga;
    Giganhinga;
    Anhinga grandis;
    Anhinga pannonica;
    Leucocarbo;
    Palaelodus;
    Megapaloelodus;
    Juncitarsus;
    Scaniornis;
    Elornis
  `);

  // Deze geslachten en soorten bestaan nog.

  verwijderKoppeling("Leucocarbo", [43]);
  verwijderKoppeling("Fregata aquila", [43]);

  // ============================================================
  // RECENT UITGESTORVEN VOGELS
  // ============================================================

  uitgestorvenDierenV9(`
    Dodo=Raphus cucullatus;
    Rodrigues solitaire=Pezophaps solitaria;
    Reuzenalk=Pinguinus impennis;
    Trekduif=Ectopistes migratorius;
    Carolinaparkiet=Conuropsis carolinensis;
    Huia=Heteralocha acutirostris;
    Labrador eend=Camptorhynchus labradorius;
    Roze kopeend=Rhodonessa caryophyllacea;
    Mauritiusblauwe duif=Alectroenas nitidissimus;
    Rodriguesduif=Nesoenas rodericanus;
    Réunionduif=Nesoenas duboisi;
    Choiseulduif=Microgoura meeki;
    Boninduif=Columba versicolor;
    Zilverduif=Columba argentina;
    Tannagrondduif=Pampusana ferruginea;
    Salomonsgrondduif=Pampusana salamonis;
    Polynesische grondduif;
    Norfolkgrondduif;
    Norfolkduif=Hemiphaga novaeseelandiae spadicea;
    Madeiraduif=Columba palumbus maderensis;
    Mauritiuspapegaai=Lophopsittacus mauritianus;
    Rodriguespapegaai=Necropsittacus rodericanus;
    Mascarene papegaai=Mascarinus mascarin;
    Seychellenparkiet=Psittacula wardi;
    Newtons parkiet=Psittacula exsul;
    Mauritiusgrijze parkiet=Psittacula bensoni;
    Réunionparkiet=Psittacula eques eques;
    Paradijsparkiet=Psephotellus pulcherrimus;
    Norfolk kaka=Nestor productus;
    Chathamkaka=Nestor chathamensis;
    Cubaanse ara=Ara tricolor;
    Guadeloupeara=Ara guadeloupensis;
    Rode ara=Ara macao;
    Stephens eilandwinterkoning=Traversia lyalli;
    Boswinterkoning=Xenicus longipes;
    Struikwinterkoning;
    Nieuw-Zeelandse kwartel=Coturnix novaezelandiae;
    Himalayakwartel=Ophrysia superciliosa;
    Canarische kwartel=Coturnix gomerae;
    Azorenkwartel=Coturnix centensis;
    Rodriguesral=Erythromachus leguati;
    Rode ral=Aphanapteryx bonasia;
    Chathamral=Cabalus modestus;
    Chathamkoet=Fulica chathamensis;
    Nieuw-Zeelandse koet=Fulica prisca;
    Nieuw-Zeelandse adzebill=Aptornis;
    Aptornis otidiformis;
    Aptornis defossor;
    Tahitiral=Hypotaenidia pacifica;
    Wake-eilandral=Hypotaenidia wakensis;
    Laysanral=Zapornia palmeri;
    Hawaïral=Zapornia sandwichensis;
    Kosraeral=Zapornia monasa;
    Tristanwaterhoen=Gallinula nesiotis;
    Samoans waterhoen=Gallinula pacifica;
    Lord Howe-waterhoen=Hypotaenidia sylvestris;
    Lord Howe-witoog=Zosterops strenuus;
    Lord Howe-merel=Turdus poliocephalus vinitinctus;
    Boninlijster=Zoothera terrestris;
    Boninwit oog=Apalopteron familiare;
    Oahu-moho=Moho apicalis;
    Kauai-moho=Moho braccatus;
    Molokai-moho=Moho bishopi;
    Hawaï-moho=Moho nobilis;
    Kioea=Chaetoptila angustipluma;
    Poouli=Melamprosops phaeosoma;
    Kamao=Myadestes myadestinus;
    Amaui=Myadestes woahensis;
    Olomao=Myadestes lanaiensis;
    Oahu-akialoa=Akialoa ellisiana;
    Kauai-akialoa=Akialoa stejnegeri;
    Hawaï-akialoa=Akialoa obscura;
    Hawaïmamo=Drepanis pacifica;
    Zwarte mamo=Drepanis funerea;
    Ula-ai-hawane=Ciridops anna;
    Grotere koa-vink=Rhodacanthis palmeri;
    Kleinere koa-vink=Rhodacanthis flaviceps;
    Kona-vink=Chloridops kona;
    Kakawahie=Paroreomyza flammea;
    Oahu-alauahio=Paroreomyza maculata;
    Maui-nukupuu=Hemignathus affinis;
    Kauai-nukupuu=Hemignathus hanapepe;
    Oahu-nukupuu=Hemignathus lucidus;
    Laysan-honingeter=Himatione fraithii;
    Laysan-millervogel=Acrocephalus familiaris familiaris;
    Guamvliegenvanger=Myiagra freycineti;
    Guamral=Hypotaenidia owstoni;
    Guamijsvogel=Todiramphus cinnamominus;
    Micronesische ijsvogel;
    Marquesan-ijsvogel=Todiramphus godeffroyi;
    Mangaia-ijsvogel=Todiramphus ruficollaris;
    Tahitisnip=Prosobonia leucoptera;
    Kiritimatisnip=Prosobonia cancellata;
    Noordereilandsnip=Coenocorypha barrierensis;
    Zuidereilandsnip=Coenocorypha iredalei;
    Chathamklokvogel=Anthornis melanocephala;
    Piopio=Turnagra capensis;
    Noordereilandpiopio=Turnagra tanagra;
    Laughing owl=Lachuilende uil=Sceloglaux albifacies;
    Mauritiusuil=Otus sauzieri;
    Rodriguesuil=Otus murivorus;
    Réunionuil=Otus grucheti;
    Cubaanse reuzenuil=Ornimegalonyx;
    Ornimegalonyx oteroi;
    Grallistrix;
    Grallistrix auceps;
    Grallistrix erdmani;
    Grallistrix geleches;
    Grallistrix orion;
    Bermuda nacht reiger=Nyctanassa carcinocatactes;
    Rodriguesreiger=Nycticorax megacephalus;
    Mauritiusreiger=Nycticorax mauritianus;
    Réunionreiger=Nycticorax duboisi;
    Ascension-nachtreiger=Nycticorax olsoni;
    Réunionibis=Threskiornis solitarius;
    Zwartvoorhoofddikbekvogel;
    Guadalupe-caracara=Caracara lutosa;
    Guadalupe-stormvogel=Hydrobates macrodactylus;
    Spectacled cormorant;
    Ogasawara-kernbijter=Chaunoproctus ferreorostris;
    Thick-billed ground dove;
    Marianne-witoog=Zosterops semiflavus;
    Seychellenbrilvogel=Zosterops modestus;
    Norfolkbrilvogel=Zosterops albogularis;
    Zwartoorbrilvogel;
    Réunion spreeuw=Fregilupus varius;
    Rodrigues spreeuw=Necropsar rodericanus;
    Kosraispreeuw=Aplonis corvina;
    Norfolkspreeuw=Aplonis fusca;
    Raiateaspreeuw=Aplonis ulietensis;
    Mauke spreeuw=Aplonis mavornata;
    Zwartbandfrankolijn;
    Ivoorsnavelspecht=Campephilus principalis;
    Keizerspecht=Campephilus imperialis;
    Bachmans zanger=Vermivora bachmanii;
    Dusky seaside sparrow=Ammospiza maritima nigrescens;
    San Clemente-bewickwinterkoning;
    Santa Barbara-zangmus;
    Heath hen=Tympanuchus cupido cupido;
    Atitlánfuut=Podilymbus gigas;
    Alaotrafuut=Tachybaptus rufolavatus;
    Colombiaanse fuut=Podiceps andinus;
    Roze duif=Nesoenas mayeri
  `);

  // ============================================================
  // BESCHERMING TEGEN ONJUISTE UITSTERFSTATUSSEN
  // ============================================================

  // Onderstaande soorten zijn niet wereldwijd uitgestorven,
  // of hun uitsterven is onvoldoende zeker.
  //
  // Uitsterven in het wild is bovendien niet hetzelfde
  // als volledig uitsterven.

  verwijderKoppeling("Roze kopeend", [43]);
  verwijderKoppeling("Zilverduif", [43]);
  verwijderKoppeling("Rode ara", [43]);
  verwijderKoppeling("Himalayakwartel", [43]);
  verwijderKoppeling("Samoans waterhoen", [43]);
  verwijderKoppeling("Lord Howe-waterhoen", [43]);
  verwijderKoppeling("Apalopteron familiare", [43]);
  verwijderKoppeling("Guamral", [43]);
  verwijderKoppeling("Guamijsvogel", [43]);
  verwijderKoppeling("Micronesische ijsvogel", [43]);
  verwijderKoppeling("Marquesan-ijsvogel", [43]);
  verwijderKoppeling("Mangaia-ijsvogel", [43]);
  verwijderKoppeling("Kiritimatisnip", [43]);
  verwijderKoppeling("Seychellenbrilvogel", [43]);
  verwijderKoppeling("Ivoorsnavelspecht", [43]);
  verwijderKoppeling("Keizerspecht", [43]);
  verwijderKoppeling("Roze duif", [43]);

  verwijderDier("Polynesische grondduif");
  verwijderDier("Norfolkgrondduif");
  verwijderDier("Zwartvoorhoofddikbekvogel");
  verwijderDier("Zwartoorbrilvogel");
  verwijderDier("Zwartbandfrankolijn");

  samenvoegen(
    "Boswinterkoning",
    "Struikwinterkoning"
  );

  samenvoegen(
    "Phalacrocorax perspicillatus",
    "Spectacled cormorant"
  );

  hernoemDier(
    "Bermuda nacht reiger",
    "Bermudakwak"
  );

  hernoemDier(
    "Réunion spreeuw",
    "Réunionspreeuw"
  );

  hernoemDier(
    "Rodrigues spreeuw",
    "Rodriguesspreeuw"
  );

  hernoemDier(
    "Mauke spreeuw",
    "Maukespreeuw"
  );

  // ============================================================
  // RECENT UITGESTORVEN ZOOGDIEREN
  // ============================================================

  uitgestorvenDierenV9(`
    Falklandwolf=Dusicyon australis=Warrah;
    Dusicyon avus;
    Blauwbok=Hippotragus leucophaeus;
    Schomburgks hert=Rucervus schomburgki;
    Bubalhartebeest=Alcelaphus buselaphus buselaphus;
    Pyreneese steenbok=Capra pyrenaica pyrenaica;
    Portugese steenbok=Capra pyrenaica lusitanica;
    Oostelijke eland=Cervus canadensis canadensis;
    Merriams wapiti=Cervus canadensis merriami;
    Syrische wilde ezel=Equus hemionus hemippus;
    Noord-Afrikaanse olifant;
    Atlasbeer=Ursus arctos crowtheri;
    Mexicaanse grizzlybeer=Ursus arctos nelsoni;
    Japanse wolf=Canis lupus hodophilax;
    Hokkaidowolf=Canis lupus hattai;
    Newfoundlandwolf=Canis lupus beothucus;
    Falklandeilandwolf;
    Balinese tijger=Panthera tigris balica;
    Javaanse tijger=Panthera tigris sondaica;
    Kaspische tijger=Panthera tigris virgata;
    Berberleeuw=Panthera leo leo;
    Kaapse leeuw;
    Caraïbische monniksrob;
    Japanse zeeleeuw;
    Stellers zeekoe;
    Caribische reuzenhutia;
    Heptaxodon;
    Elasmodontomys;
    Amblyrhiza;
    Clidomys;
    Xaymaca;
    Quemisia;
    Isolobodon portoricensis;
    Isolobodon montanus;
    Hexolobodon phenax;
    Brotomys;
    Brotomys voratus;
    Boromys;
    Boromys offella;
    Boromys torrei;
    Geocapromys columbianus;
    Geocapromys thoracatus;
    Mesocapromys nanus;
    Nesophontes;
    Nesophontes edithae;
    Nesophontes micrus;
    Nesophontes major;
    Nesophontes longirostris;
    Nesophontes hypomicrus;
    Nesophontes paramicrus;
    Nesophontes zamicrus;
    Marcano-solenodon=Solenodon marcanoi;
    Reuzensolenodon=Solenodon arredondoi;
    Bulldograt=Rattus nativitatis;
    Maclears rat=Rattus macleari;
    Bunyiprat;
    Witvoetkonijnrat=Conilurus albipes;
    Kleinere stoknestrat=Leporillus apicalis;
    Kortstaartspringmuis=Notomys amplus;
    Grootorspringmuis=Notomys macrotis;
    Langstaartspringmuis=Notomys longicaudatus;
    Big-eared hopping mouse;
    Darling Downs-springmuis=Notomys mordax;
    Blauwe grijze muis=Pseudomys glaucus;
    Goulds muis=Pseudomys gouldii;
    Broad-faced potoroe=Potorous platyops;
    Woestijnratkangoeroe=Caloprymnus campestris;
    Woestijnbandicoot=Perameles eremiana;
    Kleine bilby=Macrotis leucura;
    Varkenspootbuideldas=Chaeropus ecaudatus;
    Chaeropus yirratji;
    Oostelijke haaswallaby=Lagorchestes leporides;
    Toolachewallaby=Notamacropus greyi;
    Crescent nail-tail wallaby=Onychogalea lunata;
    Tasmaanse tijger;
    Bramble Cay-melomys=Melomys rubicola;
    Melomys spechti;
    Reuzenrat van Flores=Papagomys theodorverhoeveni;
    Spelaeomys florensis;
    Coryphomys buehleri;
    Coryphomys musseri;
    Floresomys;
    Tenerife-reuzenrat=Canariomys bravoi;
    Gran Canaria-reuzenrat=Canariomys tamarani;
    Malpaisomys insularis;
    Reuzenspitsmuis van Sardinië=Asoriculus similis;
    Sardijnse fluithaas=Prolagus sardus;
    Prolagus corsicanus;
    Hypnomys morpheus;
    Hypnomys onicensis;
    Nesiotites;
    Nesiotites hidalgo;
    Mikrotia;
    Mikrotia magna;
    Leithia melitensis;
    Maltamys;
    Elephas falconeri;
    Reuzenmaki;
    Malagassisch nijlpaard;
    Malagassisch aardvarken=Plesiorycteropus;
    Plesiorycteropus madagascariensis;
    Plesiorycteropus germainepetterae;
    Bisschops ooievaar;
    Kleine Mauritiaanse vleermuis=Pteropus subniger;
    Guamvleerhond=Pteropus tokudae;
    Grote Palauvleermuis=Pteropus pilosus;
    Pteropus brunneus;
    Pteropus allenorum;
    Pteropus coxi;
    Desmodus draculae;
    Desmodus stocki;
    Desmodus archaeodaptes;
    Mormoops magna;
    Mystacina robusta;
    Kerivoula lenis;
    Pipistrellus murrayi;
    Pipistrellus sturdeei;
    Nyctophilus howensis;
    Christmas Island-spitsmuis=Crocidura trichura;
    Schuimrat;
    Gecarcinus lagostoma
  `);

  // Correcties van onduidelijke of nog levende dieren.

  verwijderDier("Bunyiprat");
  verwijderDier("Bisschops ooievaar");
  verwijderDier("Schuimrat");

  verwijderKoppeling("Goulds muis", [43]);
  verwijderKoppeling("Kerivoula lenis", [43]);
  verwijderKoppeling("Gecarcinus lagostoma", [43]);
  verwijderKoppeling("Berberleeuw", [43]);
  verwijderKoppeling("Mystacina robusta", [43]);

  // Berberleeuwen zijn in het wild verdwenen,
  // maar de ondersoort Panthera leo leo bestaat nog.

  samenvoegen(
    "Falklandwolf",
    "Falklandeilandwolf"
  );

  samenvoegen(
    "Grootorspringmuis",
    "Big-eared hopping mouse"
  );

  samenvoegen(
    "Caribische monniksrob",
    "Caraïbische monniksrob"
  );

  samenvoegen(
    "Palaeoloxodon falconeri",
    "Elephas falconeri"
  );

  // ============================================================
  // UITGESTORVEN REPTIELEN EN AMFIBIEËN
  // ============================================================

  uitgestorvenDierenV9(`
    Pinta-reuzenschildpad=Chelonoidis abingdonii;
    Floreana-reuzenschildpad=Chelonoidis niger;
    Chelonoidis phantasticus;
    Mauritiusreuzenschildpad=Cylindraspis inepta;
    Cylindraspis triserrata;
    Rodriguesreuzenschildpad=Cylindraspis peltastes;
    Cylindraspis vosmaeri;
    Réunionreuzenschildpad=Cylindraspis indica;
    Bahama-reuzenschildpad=Chelonoidis alburyorum;
    Testudo atlas;
    Meiolania platyceps;
    Meiolania mackayi;
    Meiolania brevicollis;
    Ninjemys oweni;
    Asian giant softshell turtle;
    Kawekaweau=Hoplodactylus delcourti;
    Rodriguesdaggekko=Phelsuma edwardnewtoni;
    Réuniondaggekko=Phelsuma gigas;
    Phelsuma gigas;
    Phelsuma newtoni;
    Telfairs skink=Leiolopisma telfairii;
    Rodriguesreuzenskink=Leiolopisma rodriguesii;
    Réunionreuzenskink=Leiolopisma ceciliae;
    Macroscincus coctei;
    Kaapverdische reuzenskink;
    Chioninia coctei;
    Christmas Island-bosskink=Emoia nativitatis;
    Emoia slevini;
    Cryptoblepharus egeriae;
    Alinea luciae;
    Celestus occiduus;
    Diploglossus delasagra;
    Celestus duquesneyi;
    Bolyeria multocarinata;
    Round Island-boa;
    Gouden pad=Incilius periglenes;
    Zuidelijke maagbroedkikker=Rheobatrachus silus;
    Noordelijke maagbroedkikker=Rheobatrachus vitellinus;
    Rheobatrachus;
    Taudactylus diurnus;
    Taudactylus acutirostris;
    Taudactylus rheophilus;
    Craugastor chrysozetetes;
    Craugastor milesi;
    Craugastor omoaensis;
    Craugastor myllomyllon;
    Atelopus longirostris;
    Atelopus ignescens;
    Atelopus vogli;
    Atelopus senex;
    Atelopus chiriquiensis;
    Atelopus zeteki;
    Oophaga speciosa;
    Pseudophilautus;
    Pseudophilautus adspersus;
    Pseudophilautus dimbullae;
    Pseudophilautus eximius;
    Pseudophilautus extirpo;
    Pseudophilautus halyi;
    Pseudophilautus leucorhinus;
    Pseudophilautus maia;
    Pseudophilautus malcolmsmithi;
    Pseudophilautus nanus;
    Pseudophilautus oxyrhynchus;
    Pseudophilautus pardus;
    Pseudophilautus rugatus;
    Pseudophilautus stellatus;
    Pseudophilautus temporalis;
    Pseudophilautus variabilis;
    Pseudophilautus zal;
    Nannophrys guentheri;
    Adenomus kandianus;
    Discoglossus nigriventer;
    Hula-schijftongkikker;
    Plethodon ainsworthi;
    Cynops wolterstorffi;
    Eurycea robusta
  `);

  // Soorten die nog leven of herontdekt zijn.

  verwijderKoppeling("Chelonoidis phantasticus", [43]);
  verwijderKoppeling("Telfairs skink", [43]);
  verwijderKoppeling("Emoia slevini", [43]);
  verwijderKoppeling("Cryptoblepharus egeriae", [43]);
  verwijderKoppeling("Alinea luciae", [43]);
  verwijderKoppeling("Diploglossus delasagra", [43]);
  verwijderKoppeling("Taudactylus rheophilus", [43]);
  verwijderKoppeling("Craugastor milesi", [43]);
  verwijderKoppeling("Atelopus longirostris", [43]);
  verwijderKoppeling("Atelopus ignescens", [43]);
  verwijderKoppeling("Atelopus zeteki", [43]);
  verwijderKoppeling("Pseudophilautus", [43]);
  verwijderKoppeling("Pseudophilautus stellatus", [43]);
  verwijderKoppeling("Adenomus kandianus", [43]);
  verwijderKoppeling("Discoglossus nigriventer", [43]);
  verwijderKoppeling("Hula-schijftongkikker", [43]);
  verwijderKoppeling("Eurycea robusta", [43]);
  verwijderKoppeling("Asian giant softshell turtle", [43]);

  samenvoegen(
    "Macroscincus coctei",
    "Kaapverdische reuzenskink"
  );

  samenvoegen(
    "Macroscincus coctei",
    "Chioninia coctei"
  );

  // ============================================================
  // UITGESTORVEN VISSEN
  // ============================================================

  uitgestorvenDierenV9(`
    Chinese lepelsteur=Psephurus gladius;
    Zwarte cisco=Coregonus nigripinnis;
    Diepwatercisco=Coregonus johannae;
    Coregonus alpenae;
    Coregonus reighardi;
    Coregonus fera;
    Coregonus hiemalis;
    Coregonus gutturosus;
    Coregonus bezola;
    Coregonus restrictus;
    Coregonus extinctus;
    Coregonus oxyrinchus;
    Salvelinus profundus;
    Salvelinus neocomensis;
    Salvelinus agassizii;
    Salvelinus grayi;
    Salmo pallaryi;
    Salmo schiefermuelleri;
    Salmo stomachicus;
    Salmo ferox;
    Salmo peristericus;
    Oncorhynchus kawamurae;
    Oncorhynchus rastrosus;
    Oncorhynchus lacustris;
    Cyprinodon alvarezi;
    Cyprinodon arcuatus;
    Cyprinodon ceciliae;
    Cyprinodon inmemoriam;
    Cyprinodon latifasciatus;
    Cyprinodon longidorsalis;
    Cyprinodon pachycephalus;
    Megupsilon aporus;
    Empetrichthys merriami;
    Evarra bustamantei;
    Evarra eigenmanni;
    Evarra tlahuacensis;
    Alburnus akili;
    Alburnus nicaeensis;
    Acanthobrama hulensis;
    Tristramella sacra;
    Tristramella simonis;
    Tristramella magdelainae;
    Gasterosteus crenobiontus;
    Gasterosteus aculeatus;
    Pantanodon madagascariensis;
    Aphanius splendens;
    Aphanius apodus;
    Barbus microbarbis;
    Labeobarbus microbarbis;
    Labeo worthingtoni;
    Labeo victorianus;
    Haplochromis ishmaeli;
    Haplochromis lividus;
    Haplochromis sphex;
    Haplochromis vonlinnei;
    Haplochromis pachysoma;
    Haplochromis brownae;
    Haplochromis teegelaari;
    Haplochromis longirostris;
    Ptychochromis onilahy;
    Ptychochromis insolitus;
    Rheocles alaotrensis;
    Paretroplus menarambo;
    Galaxias pedderensis;
    Prototroctes oxyrhynchus;
    Percina antesella;
    Etheostoma sellare;
    Etheostoma percnurum;
    Etheostoma chienense;
    Noturus trautmani;
    Notropis aulidion;
    Notropis orca;
    Notropis simus simus;
    Moxostoma lacerum;
    Moxostoma mascotae;
    Moxostoma austrinum;
    Acantharchus pomotis;
    Stypodon signifer;
    Pantodon buchholzi;
    Sympterichthys unipennis
  `);

  // Nog levende, herontdekte of alleen in het wild
  // uitgestorven vissen niet aan vraag 43 koppelen.

  verwijderKoppeling("Salvelinus profundus", [43]);
  verwijderKoppeling("Salvelinus grayi", [43]);
  verwijderKoppeling("Salmo ferox", [43]);
  verwijderKoppeling("Salmo peristericus", [43]);
  verwijderKoppeling("Oncorhynchus kawamurae", [43]);
  verwijderKoppeling("Cyprinodon alvarezi", [43]);
  verwijderKoppeling("Cyprinodon longidorsalis", [43]);
  verwijderKoppeling("Cyprinodon pachycephalus", [43]);
  verwijderKoppeling("Acanthobrama hulensis", [43]);
  verwijderKoppeling("Tristramella simonis", [43]);
  verwijderKoppeling("Gasterosteus aculeatus", [43]);
  verwijderKoppeling("Aphanius apodus", [43]);
  verwijderKoppeling("Labeo victorianus", [43]);
  verwijderKoppeling("Haplochromis ishmaeli", [43]);
  verwijderKoppeling("Ptychochromis insolitus", [43]);
  verwijderKoppeling("Paretroplus menarambo", [43]);
  verwijderKoppeling("Galaxias pedderensis", [43]);
  verwijderKoppeling("Percina antesella", [43]);
  verwijderKoppeling("Etheostoma sellare", [43]);
  verwijderKoppeling("Etheostoma percnurum", [43]);
  verwijderKoppeling("Etheostoma chienense", [43]);
  verwijderKoppeling("Moxostoma mascotae", [43]);
  verwijderKoppeling("Moxostoma austrinum", [43]);
  verwijderKoppeling("Acantharchus pomotis", [43]);
  verwijderKoppeling("Pantodon buchholzi", [43]);

  // De status van de gladde handvis is onzeker.

  verwijderKoppeling(
    "Sympterichthys unipennis",
    [43]
  );

  // ============================================================
  // TRILOBIETEN
  // ============================================================

  uitgestorvenDierenV9(`
    Trilobiet=Trilobita;
    Olenellus;
    Redlichia;
    Paradoxides;
    Acadoparadoxides;
    Hydrocephalus;
    Eccaparadoxides;
    Ellipsocephalus;
    Sao hirsuta;
    Conocoryphe;
    Ptychoparia;
    Elrathia;
    Elrathia kingii;
    Asaphiscus;
    Modocia;
    Bolaspidella;
    Ehmaniella;
    Glossopleura;
    Bathyuriscus;
    Ogygopsis;
    Kootenia;
    Olenoides;
    Zacanthoides;
    Nevadia;
    Nevadella;
    Fallotaspis;
    Eofallotaspis;
    Holmia;
    Schmidtiellus;
    Callavia;
    Wanneria;
    Mesonacis;
    Bristolia;
    Fremontella;
    Judomia;
    Yunnanocephalus;
    Eoredlichia;
    Kuanyangia;
    Estaingia;
    Emuella;
    Balcoracania;
    Dolerolenus;
    Kjerulfia;
    Agnostus;
    Peronopsis;
    Ptychagnostus;
    Hypagnostus;
    Lejopyge;
    Trinodus;
    Geragnostus;
    Asaphus;
    Asaphus kowalewskii;
    Asaphus expansus;
    Isotelus;
    Isotelus rex;
    Ogyginus;
    Megistaspis;
    Nileus;
    Symphysurus;
    Illaenus;
    Bumastus;
    Stenopareia;
    Dysplanus;
    Panderia;
    Ectillaenus;
    Platillaenus;
    Pseudogygites;
    Basilicus;
    Homotelus;
    Anataphrus;
    Megalaspides;
    Carolinites;
    Telephina;
    Remopleurides;
    Hypodicranotus;
    Harpes;
    Eoharpes;
    Scotoharpes;
    Bohemoharpes;
    Trinucleidae;
    Trinucleus;
    Cryptolithus;
    Deanaspis;
    Marrolithus;
    Onnia;
    Tretaspis;
    Ampyx;
    Raphiophorus;
    Lonchodomas;
    Raymondella;
    Dionide;
    Selenopeltis;
    Lichas;
    Dicranopeltis;
    Arctinurus;
    Terataspis;
    Trochurus;
    Homolichas;
    Acanthopyge;
    Dicranurus;
    Ceratarges;
    Leonaspis;
    Kettneraspis;
    Odontopleura;
    Sinespinaspis;
    Primaspis;
    Acidaspis;
    Acanthalomina;
    Miraspis;
    Ceratocephala;
    Seleneceme;
    Phacops;
    Eldredgeops;
    Drotops;
    Reedops;
    Geesops;
    Barrandeops;
    Morocops;
    Austerops;
    Chotecops;
    Greenops;
    Acastoides;
    Acastella;
    Dalmanites;
    Odontocephalus;
    Synphoria;
    Zlichovaspis;
    Hollardops;
    Metacanthina;
    Coltraneia;
    Treveropyge;
    Psychopyge;
    Comura;
    Quadrops;
    Walliserops;
    Asteropyge;
    Rhenops;
    Phaetonellus;
    Erbenochile;
    Calymene;
    Flexicalymene;
    Gravicalymene;
    Diacalymene;
    Colpocoryphe;
    Neseuretus;
    Salterocoryphe;
    Homalonotus;
    Trimerus;
    Dipleura;
    Brongniartella;
    Burmeisteria;
    Parahomalonotus;
    Digonus;
    Crotalocephalus;
    Cheirurus;
    Ceraurus;
    Ceraurinus;
    Encrinurus;
    Cybeloides;
    Pliomera;
    Pliomerops;
    Sphaerexochus;
    Pseudocheirurus;
    Eccoptochile;
    Paraceraurus;
    Nieszkowskia;
    Placoparia;
    Raphiophorus;
    Cyphaspis;
    Otarion;
    Maurotarion;
    Harpidella;
    Aulacopleura;
    Otarionella;
    Proetus;
    Gerastos;
    Cornuproetus;
    Cyphoproetus;
    Dechenella;
    Tropidocoryphe;
    Warburgella;
    Eremiproetus;
    Basidechenella;
    Phillipsia;
    Griffithides;
    Bollandia;
    Cummingella;
    Ditomopyge;
    Ameura;
    Paladin;
    Pseudophillipsia;
    Neoproetus;
    Acropyge;
    Anisopyge;
    Kathwaia;
    Weania
  `);

  // ============================================================
  // ZEESCHORPIOENEN
  // ============================================================

  uitgestorvenDierenV9(`
    Zeeschorpioen=Eurypterida;
    Eurypterus;
    Eurypterus remipes;
    Eurypterus lacustris;
    Pterygotus;
    Jaekelopterus;
    Acutiramus;
    Erettopterus;
    Slimonia;
    Salteropterus;
    Hughmilleria;
    Herefordopterus;
    Nanahughmilleria;
    Parahughmilleria;
    Pittsfordipterus;
    Erieopterus;
    Dolichopterus;
    Strobilopterus;
    Rhenopterus;
    Brachyopterus;
    Brachyopterella;
    Kiaeropterus;
    Alkenopterus;
    Onychopterella;
    Moselopterus;
    Megalograptus;
    Pentecopterus;
    Echinognathus;
    Mixopterus;
    Lanarkopterus;
    Carcinosoma;
    Rhinocarcinosoma;
    Paracarcinosoma;
    Eusarcana;
    Stylonurus;
    Pagea;
    Ctenopterus;
    Laurieipterus;
    Tarsopterella;
    Brachyopterus;
    Hardieopterus;
    Tylopterella;
    Dunsopterus;
    Hibbertopterus;
    Cyrtoctenus;
    Dunsopterus;
    Campylocephalus;
    Hastimima;
    Woodwardopterus;
    Megarachne;
    Mycterops;
    Drepanopterus;
    Adelophthalmus;
    Unionopterus;
    Bassipterus;
    Borchgrevinkium;
    Grossopterus;
    Clarkeipterus;
    Holmipterus;
    Ruedemannipterus
  `);

  // ============================================================
  // CAMBRISCHE EN VROEGE ZEEDIEREN
  // ============================================================

  uitgestorvenDierenV9(`
    Anomalocaris;
    Radiodonta;
    Amplectobelua;
    Lyrarapax;
    Ramskoeldia;
    Laminacaris;
    Guanshancaris;
    Innovatiocaris;
    Houcaris;
    Paranomalocaris;
    Lenisicaris;
    Hurdia;
    Peytoia;
    Laggania;
    Stanleycaris;
    Cambroraster;
    Titanokorys;
    Pahvantia;
    Aegirocassis;
    Tamisiocaris;
    Caryosyntrips;
    Cucumericrus;
    Kerygmachela;
    Pambdelurion;
    Opabinia;
    Utaurora;
    Hallucigenia;
    Microdictyon;
    Onychodictyon;
    Cardiodictyon;
    Luolishania;
    Collinsium;
    Ovatiovermis;
    Acinocricus;
    Facivermis;
    Diania;
    Aysheaia;
    Antennacanthopodia;
    Jianshanopodia;
    Megadictyon;
    Siberion;
    Tritonychus;
    Xenusion;
    Wiwaxia;
    Orthrozanclus;
    Halkieria;
    Siphogonuchites;
    Maikhanella;
    Oikozetetes;
    Sachites;
    Calvapilosa;
    Tannuolina;
    Micrina;
    Odontogriphus;
    Kimberella;
    Dickinsonia;
    Yorgia;
    Spriggina;
    Parvancorina;
    Tribrachidium;
    Arkarua;
    Ernietta;
    Pteridinium;
    Swartpuntia;
    Rangea;
    Charnia;
    Charniodiscus;
    Fractofusus;
    Beothukis;
    Bradgatia;
    Avalofractus;
    Hapsidophyllas;
    Primocandelabrum;
    Pectinifrons;
    Vinlandia;
    Haootia;
    Auroralumina;
    Cloudina;
    Namacalathus;
    Namapoikia;
    Corumbella;
    Funisia;
    Ikaria;
    Yilingia;
    Metaspriggina;
    Pikaia;
    Cathaymyrus;
    Zhongxiniscus;
    Vetulicola;
    Didazoon;
    Xidazoon;
    Pomatrum;
    Ooedigera;
    Banffia;
    Skeemella;
    Heteromorphus;
    Yuyuanozoon;
    Nesonektris;
    Yunnanozoon;
    Haikouella;
    Fuxianhuia;
    Chengjiangocaris;
    Liangwangshania;
    Shankouia;
    Guangweicaris;
    Alacaris;
    Xiaocaris;
    Surusicaris;
    Canadaspis;
    Perspicaris;
    Waptia;
    Chuandianella;
    Pauloterminus;
    Isoxys;
    Tuzoia;
    Pectocaris;
    Clypecaris;
    Nereocaris;
    Tokummia;
    Branchiocaris;
    Odaraia;
    Fibulacaris;
    Pakucaris;
    Balhuticaris;
    Aquilonifer;
    Marrella;
    Furca;
    Vachonisia;
    Mimetaster;
    Xylokorys;
    Tomlinsonus;
    Leanchoilia;
    Alalcomenaeus;
    Yohoia;
    Fortiforceps;
    Jianfengia;
    Sklerolibyon;
    Tanglangia;
    Haikoucaris;
    Habelia;
    Sanctacaris;
    Mollisonia;
    Thelxiope;
    Corcorania;
    Emeraldella;
    Sidneyia;
    Tegopelte;
    Saperion;
    Helmetia;
    Kuamaia;
    Squamacula;
    Retifacies;
    Naraoia;
    Misszhouia;
    Liwia;
    Tariccoia;
    Xandarella;
    Cindarella;
    Sinoburius;
    Phytophilaspis;
    Acanthomeridion
  `);

  // ============================================================
  // AMMONIETEN
  // ============================================================

  uitgestorvenDierenV9(`
    Ammoniet=Ammonoidea;
    Goniatiet=Goniatites;
    Ceratiet=Ceratites;
    Ammonites;
    Acanthoceras;
    Acanthoceras rhotomagense;
    Calycoceras;
    Euomphaloceras;
    Mantelliceras;
    Sharpeiceras;
    Schloenbachia;
    Turrilites;
    Mariella;
    Hypoturrilites;
    Mesoturrilites;
    Scaphites;
    Hoploscaphites;
    Discoscaphites;
    Yezoites;
    Worthoceras;
    Baculites;
    Baculites compressus;
    Baculites ovatus;
    Boehmoceras;
    Sciponoceras;
    Diplomoceras;
    Diplomoceras maximum;
    Glyptoxoceras;
    Neoglyptoxoceras;
    Polyptychoceras;
    Didymoceras;
    Nostoceras;
    Bostrychoceras;
    Eubostrychoceras;
    Madagascarites;
    Hyphantoceras;
    Ainoceras;
    Anaklinoceras;
    Nipponites;
    Nipponites mirabilis;
    Nipponites bacchus;
    Pravitoceras;
    Pseudoxybeloceras;
    Solenoceras;
    Oxybeloceras;
    Anisoceras;
    Hamites;
    Hamulina;
    Anahamulina;
    Ptychoceras;
    Macroscaphites;
    Costidiscus;
    Leptoceras;
    Crioceratites;
    Acrioceras;
    Ancyloceras;
    Australiceras;
    Tropaeum;
    Toxoceras;
    Toxoceratoides;
    Heteroceras;
    Colchidites;
    Imerites;
    Pseudocrioceratites;
    Aegocrioceras;
    Pseudothurmannia;
    Pseudohaploceras;
    Desmoceras;
    Puzosia;
    Parapuzosia;
    Parapuzosia seppenradensis;
    Parapuzosia leptophylla;
    Pachydesmoceras;
    Austiniceras;
    Mesopuzosia;
    Hauericeras;
    Kossmaticeras;
    Maorites;
    Grossouvrites;
    Brahmaites;
    Gunnarites;
    Jacobites;
    Anagaudryceras;
    Gaudryceras;
    Tetragonites;
    Saghalinites;
    Zelandites;
    Lytoceras;
    Lobolytoceras;
    Analytoceras;
    Ectocentrites;
    Trachylytoceras;
    Protetragonites;
    Eulytoceras;
    Phylloceras;
    Hypophylloceras;
    Calliphylloceras;
    Holcophylloceras;
    Sowerbyceras;
    Partschiceras;
    Ptychophylloceras;
    Juraphyllites;
    Tragophylloceras;
    Rhacophyllites;
    Harpoceras;
    Hildoceras;
    Hildaites;
    Hildoceras bifrons;
    Hildoceras semipolitum;
    Cleviceras;
    Eleganticeras;
    Harpoceratoides;
    Grammoceras;
    Pseudogrammoceras;
    Esericeras;
    Dumortieria;
    Pleydellia;
    Hammatoceras;
    Erycites;
    Podagrosites;
    Dactylioceras;
    Dactylioceras commune;
    Zugodactylites;
    Nodicoeloceras;
    Peronoceras;
    Catacoeloceras;
    Mucrodactylites;
    Porpoceras;
    Collina;
    Reynesocoeloceras;
    Prodactylioceras;
    Amaltheus;
    Pleuroceras;
    Arieticeras;
    Canavaria;
    Fuciniceras;
    Protogrammoceras;
    Paltarpites;
    Leptaleoceras;
    Lioceratoides;
    Asteroceras;
    Epophioceras;
    Eparietites;
    Arnioceras;
    Coroniceras;
    Arietites;
    Paracoroniceras;
    Vermiceras;
    Metophioceras;
    Schlotheimia;
    Psiloceras;
    Waehneroceras;
    Alsatites;
    Caloceras;
    Discamphiceras;
    Kammerkaroceras;
    Badouxia;
    Sunrisites;
    Eopsiloceras;
    Liasiceras;
    Eoderoceras;
    Oxynoticeras;
    Gleviceras;
    Radstockiceras;
    Paroxynoticeras;
    Cheltonia;
    Bifericeras;
    Echioceras;
    Leptechioceras;
    Paltechioceras;
    Orthechioceras;
    Acanthopleuroceras;
    Tropidoceras;
    Uptonia;
    Dayiceras;
    Liparoceras;
    Becheiceras;
    Androgynoceras;
    Aegoceras;
    Oistoceras;
    Phricodoceras;
    Apoderoceras;
    Tragophylloceras;
    Xipheroceras;
    Promicroceras;
    Microderoceras;
    Crucilobiceras;
    Tetraspidoceras;
    Deroceras;
    Ludwigia;
    Brasilia;
    Graphoceras;
    Leioceras;
    Ancolioceras;
    Staufenia;
    Tmetoceras;
    Eudmetoceras;
    Haplopleuroceras;
    Euhoploceras;
    Sonninia;
    Witchellia;
    Dorsetensia;
    Pelekodites;
    Otoites;
    Emileia;
    Chondroceras;
    Stephanoceras;
    Stemmatoceras;
    Normannites;
    Teloceras;
    Skirroceras;
    Cadomites;
    Polyplectites;
    Garantiana;
    Orthogarantiana;
    Strenoceras;
    Parkinsonia;
    Gonolkites;
    Durotrigensia;
    Bigotites;
    Zigzagiceras;
    Procerites;
    Siemiradzkia;
    Wagnericeras;
    Morphoceras;
    Ebrayiceras;
    Asphinctites;
    Tulites;
    Rugiferites;
    Bullatimorphites;
    Kheraiceras;
    Oxycerites;
    Paroecotraustes;
    Oecotraustes;
    Oppelia;
    Hecticoceras;
    Brightia;
    Lunuloceras;
    Sublunuloceras;
    Putealiceras;
    Reineckeia;
    Reineckeites;
    Neuqueniceras;
    Choffatia;
    Grossouvria;
    Homoeoplanulites;
    Indosphinctes;
    Elatmites;
    Macrocephalites;
    Kamptokephalites;
    Pleurocephalites;
    Dolikephalites;
    Cadoceras;
    Rondiceras;
    Longaeviceras;
    Quenstedtoceras;
    Kosmoceras;
    Kepplerites;
    Sigaloceras;
    Gulielmiceras;
    Erymnoceras;
    Pachyceras;
    Tornquistes;
    Peltoceras;
    Peltoceratoides;
    Euaspidoceras;
    Aspidoceras;
    Physodoceras;
    Orthaspidoceras;
    Laevaptychus;
    Perisphinctes;
    Dichotomosphinctes;
    Arisphinctes;
    Kranaosphinctes;
    Liosphinctes;
    Otosphinctes;
    Subdiscosphinctes;
    Orthosphinctes;
    Ataxioceras;
    Lithacoceras;
    Progeronia;
    Idoceras;
    Nebrodites;
    Sutneria;
    Hybonoticeras;
    Aulacostephanus;
    Aulacostephanoides;
    Rasenia;
    Pictonia;
    Ringsteadia;
    Prorasenia;
    Katroliceras;
    Torquatisphinctes;
    Virgatosphinctes;
    Pseudovirgatites;
    Pavlovia;
    Dorsoplanites;
    Virgatites;
    Craspedites;
    Kachpurites;
    Garniericeras;
    Berriasella;
    Dalmasiceras;
    Fauriella;
    Tirnovella;
    Spiticeras;
    Negreliceras;
    Himalayites;
    Micracanthoceras;
    Corongoceras;
    Protacanthodiscus;
    Neocosmoceras;
    Kilianella;
    Thurmanniceras;
    Busnardoites;
    Neocomites;
    Olcostephanus;
    Valanginites;
    Saynoceras;
    Bochianites;
    Oosterella;
    Lyticoceras;
    Acanthodiscus;
    Leopoldia;
    Jeannoticeras;
    Crioceratites;
    Plesiospitidiscus;
    Spitidiscus;
    Subsaynella;
    Barremites;
    Melchiorites;
    Silesites;
    Pulchellia;
    Nicklesia;
    Heinzia;
    Gerhardtia;
    Kotetishvilia;
    Holcodiscus;
    Astieridiscus;
    Maurelidiscus;
    Gassendiceras;
    Imerites;
    Hemihoplites;
    Cheloniceras;
    Epicheloniceras;
    Deshayesites;
    Dufrenoyia;
    Paradeshayesites;
    Tropaeum;
    Colombiceras;
    Acanthohoplites;
    Hypacanthoplites;
    Nolaniceras;
    Uhligella;
    Beudanticeras;
    Douvilleiceras;
    Mammillites;
    Lyelliceras;
    Oxytropidoceras;
    Venezoliceras;
    Dipoloceras;
    Hysteroceras;
    Mortoniceras;
    Pervinquieria;
    Stoliczkaia;
    Anisoceras;
    Hamites;
    Lechites;
    Idiohamites;
    Ostlingoceras;
    Mortoniceras;
    Arrhaphoceras;
    Hypengonoceras;
    Engonoceras;
    Knemiceras;
    Platiknemiceras;
    Neolobites;
    Forbesiceras;
    Eucalycoceras;
    Protacanthoceras;
    Cunningtoniceras;
    Pseudocalycoceras;
    Neocardioceras;
    Metoicoceras;
    Mammites;
    Morrowites;
    Fagesia;
    Vascoceras;
    Thomasites;
    Pseudaspidoceras;
    Neoptychites;
    Choffaticeras;
    Coilopoceras;
    Hoplitoides;
    Romaniceras;
    Collignoniceras;
    Subprionocyclus;
    Prionocyclus;
    Barroisiceras;
    Forresteria;
    Peroniceras;
    Gauthiericeras;
    Protexanites;
    Texanites;
    Paratexanites;
    Menabites;
    Bererella;
    Submortoniceras;
    Mortoniceras;
    Placenticeras;
    Metaplacenticeras;
    Hoplitoplacenticeras;
    Pachydiscus;
    Canadoceras;
    Eupachydiscus;
    Anapachydiscus;
    Menuites;
    Pseudopachydiscus;
    Nowakites;
    Polyptychoceras;
    Kitchinites;
    Diplomoceras;
    Nostoceras;
    Pachydiscus neubergicus;
    Pachydiscus jacquoti;
    Sphenodiscus;
    Coahuilites;
    Libycoceras
  `);

  // Laevaptychus is een fossiele aptychusvorm.
  // Geen zelfstandig dierrecord nodig.

  verwijderDier("Laevaptychus");

  // ============================================================
  // BELEMNIETEN EN OVERIGE UITGESTORVEN KOPPOTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Belemniet=Belemnitida;
    Belemnites;
    Belemnitella;
    Belemnella;
    Gonioteuthis;
    Praeactinocamax;
    Actinocamax;
    Neohibolites;
    Hibolithes;
    Mesohibolites;
    Duvalia;
    Pseudoduvalia;
    Berriasibelus;
    Pseudobelus;
    Conobelus;
    Curtohibolites;
    Castellanibelus;
    Acrocoelites;
    Passaloteuthis;
    Parapassaloteuthis;
    Dactyloteuthis;
    Acrocoelites;
    Megateuthis;
    Megateuthis gigantea;
    Holcobelus;
    Pachybelemnopsis;
    Belemnopsis;
    Dicoelites;
    Conodicoelites;
    Hastites;
    Nannobelus;
    Coeloteuthis;
    Brachybelus;
    Brevibelus;
    Salpingoteuthis;
    Youngibelus;
    Bairstowius;
    Oxyteuthis;
    Aulacoteuthis;
    Praeoxyteuthis;
    Doryteuthis;
    Diplobelus;
    Chondroteuthis;
    Clarkeiteuthis;
    Acanthoteuthis;
    Phragmoteuthis;
    Belemnotheutis;
    Plesioteuthis;
    Trachyteuthis;
    Teudopsis;
    Loligosepia;
    Geopeltis;
    Proteroctopus;
    Palaeoctopus;
    Keuppia;
    Styletoctopus;
    Syllipsimopodi;
    Jeletzkyteuthis;
    Donovaniteuthis;
    Gordoniconus;
    Hematites;
    Shimanskya;
    Orthoceras;
    Orthocerida;
    Endoceras;
    Cameroceras;
    Vaginoceras;
    Proterocameroceras;
    Dideroceras;
    Suecoceras;
    Nanno;
    Piloceras;
    Chihlioceras;
    Ellesmeroceras;
    Plectronoceras;
    Ectenolites;
    Bassleroceras;
    Clarkoceras;
    Balkoceras;
    Cyrtoceras;
    Ascoceras;
    Choanoceras;
    Billingsites;
    Discosorus;
    Westonoceras;
    Phragmoceras;
    Gomphoceras;
    Oncoceras;
    Oonoceras;
    Oxygonioceras;
    Hexameroceras;
    Trimeroceras;
    Apsidoceras;
    Uranoceras;
    Trocholites;
    Tarphyceras;
    Estonioceras;
    Lituites;
    Cyclolituites;
    Ancistroceras;
    Discoceras;
    Schroederoceras;
    Lechritrochoceras;
    Bactrites;
    Lobobactrites;
    Cyrtobactrites;
    Mimoceras;
    Erbenoceras;
    Anetoceras;
    Mimagoniatites;
    Agoniatites;
    Tornoceras;
    Cheiloceras;
    Clymenia;
    Wocklumeria;
    Gattendorfia;
    Imitoceras;
    Pericyclus;
    Muensteroceras;
    Beyrichoceras;
    Cravenoceras;
    Eumorphoceras;
    Homoceras;
    Reticuloceras;
    Gastrioceras;
    Schistoceras;
    Paralegoceras;
    Shumardites;
    Vidrioceras;
    Medlicottia;
    Popanoceras;
    Perrinites;
    Waagenoceras;
    Cyclolobus;
    Xenodiscus;
    Otoceras;
    Ophiceras;
    Claraia;
    Meekoceras;
    Flemingites;
    Gyronites;
    Tirolites;
    Columbites;
    Prohungarites;
    Paraceratites;
    Balatonites;
    Acrochordiceras;
    Ptychites;
    Gymnites;
    Monophyllites;
    Arcestes;
    Pinacoceras;
    Cladiscites;
    Trachyceras;
    Protrachyceras;
    Sirenites;
    Tropites;
    Discotropites;
    Anatropites;
    Halorites;
    Juvavites;
    Himavatites;
    Mojsisovicsites;
    Placites;
    Cochloceras;
    Rhabdoceras;
    Choristoceras
  `);

  // Doryteuthis is een nog bestaand geslacht.
  // Claraia is een fossiel tweekleppig weekdier.

  verwijderKoppeling("Doryteuthis", [43]);

  // ============================================================
  // UITGESTORVEN INSECTEN EN ANDERE GELEEDPOTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Meganeura;
    Meganeura monyi;
    Meganeuropsis;
    Meganeuropsis permiana;
    Meganeurites;
    Meganeurula;
    Typus;
    Namurotypus;
    Nannothemis;
    Erasipteron;
    Geropteron;
    Zygophlebia;
    Protagrion;
    Protolindenia;
    Liassophlebia;
    Heterophlebia;
    Tarsophlebia;
    Aeschnogomphus;
    Cymatophlebia;
    Stenophlebia;
    Isophlebia;
    Urogomphus;
    Palaeodictyoptera;
    Homoioptera;
    Mazothairos;
    Dunbaria;
    Eugereon;
    Lithomantis;
    Stenodictya;
    Dictyoneura;
    Homaloneura;
    Delitzschala;
    Scepasma;
    Lycocercus;
    Breyeriidae;
    Breyeria;
    Eubleptus;
    Fouquea;
    Megasecoptera;
    Brodioptera;
    Aspidothorax;
    Mischoptera;
    Protohymen;
    Pseudohymen;
    Corydaloides;
    Diaphanopterodea;
    Diaphanoptera;
    Martynovia;
    Alexrasnitsynia;
    Asthenohymen;
    Biarmohymen;
    Protereismatidae;
    Protereisma;
    Misthodotes;
    Triplosoba;
    Lithoneura;
    Bojophlebia;
    Carbotriplura;
    Gerarus;
    Cnemidolestes;
    Narkemina;
    Narkemocacurgus;
    Piesbergopterum;
    Sthenaropoda;
    Oedischia;
    Tcholmanvissia;
    Cacurgus;
    Ampeliptera;
    Archimylacris;
    Etoblattina;
    Mylacris;
    Phyloblatta;
    Anthracoblattina;
    Necymylacris;
    Sooblatta;
    Poroblattina;
    Mesoblattina;
    Rhipidoblatta;
    Manipulator;
    Alienopterus;
    Alienopterella;
    Grant;
    Aethiocarenus;
    Aethiocarenus burmanicus;
    Kalligramma;
    Oregramma;
    Sophogramma;
    Kalligrammula;
    Makarkinia;
    Labandeiraia;
    Meioneurites;
    Angarogramma;
    Aetheogramma;
    Cretanallachius;
    Lichenipolystoechotes;
    Palaeoleontidae;
    Babinskaiidae;
    Cratosmylus;
    Araripeneuridae;
    Paradoxosisyra;
    Saurophthirus;
    Pseudopulex;
    Tarwinia;
    Strashila;
    Vosila;
    Rhamphophorus;
    Haidomyrmex;
    Haidomyrmodes;
    Ceratomyrmex;
    Linguamyrmex;
    Helladomyrmex;
    Dhagnathos;
    Sphecomyrma;
    Gerontoformica;
    Zigrasimecia;
    Camelomecia;
    Brownimecia;
    Burmomyrma;
    Myanmyrma;
    Armaniidae;
    Formicium;
    Titanomyrma;
    Titanomyrma gigantea;
    Titanomyrma simillima;
    Titanomyrma lubei;
    Eotitanomyrma;
    Archibaldia;
    Cretomelitta;
    Melittosphex;
    Discoscapa;
    Palaeohabropoda;
    Paleorhiza;
    Electrapis;
    Cretotrigona;
    Proplebeia;
    Boreallodape;
    Protobombus;
    Palaeovespa;
    Priorvespa;
    Curiosivespa;
    Architiphia;
    Cretavus;
    Praeaulacus;
    Ephialtitidae;
    Karatavitidae;
    Xyelotomidae;
    Sepulcidae;
    Jurassoxyela;
    Triassoxyela;
    Archaeolepis;
    Eocorona;
    Mesokristensenia;
    Ascololepidopterix;
    Agathiphaga;
    Acanthopsyche;
    Palaeontinidae;
    Palaeontina;
    Cicadomorpha;
    Dunstania;
    Qibinlina;
    Fulgoridium;
    Eofulgoridium;
    Triassonepa;
    Karataviella;
    Belostomatidae;
    Chresmoda;
    Cretophotina;
    Santanmantis;
    Burmantis;
    Jersimantis;
    Ambermantis;
    Arvernineura;
    Cretomantis;
    Cretophasmomima;
    Susumania;
    Hagiphasma;
    Cretophasma;
    Aeroplana;
    Triadophlebiomorpha;
    Permothemis;
    Permocupes;
    Tshekardocoleus;
    Coleopsis;
    Moravocoleus;
    Kaltanicupes;
    Uralocoleus;
    Taldycupes;
    Ademosyne;
    Permosyne;
    Tetraphalerus;
    Ommatidae;
    Cretomma;
    Brochocoleus;
    Ponomarenkoia;
    Cretorabus;
    Cretocarabus;
    Protorabus;
    Palaeocarabus;
    Nebriorites;
    Yixianocoleus;
    Mesosolva;
    Prosolva;
    Archizelmiridae;
    Archizelmira;
    Burmazelmira;
    Zhangsolvidae;
    Palaeoplatyura;
    Protopleciidae;
    Protoplasa;
    Tanyderophryne;
    Grauvogelia;
    Triassopsychoda;
    Strashilidae;
    Nakridletia
  `);

  verwijderDier("Grant");

  // Levende geslachten en gemengde taxonomische
  // groepen niet als volledig uitgestorven aanmerken.

  verwijderKoppeling("Nannothemis", [43]);
  verwijderKoppeling("Paleorhiza", [43]);
  verwijderKoppeling("Agathiphaga", [43]);
  verwijderKoppeling("Acanthopsyche", [43]);
  verwijderKoppeling("Cicadomorpha", [43]);
  verwijderKoppeling("Belostomatidae", [43]);
  verwijderKoppeling("Tetraphalerus", [43]);
  verwijderKoppeling("Ommatidae", [43]);
  verwijderKoppeling("Protoplasa", [43]);

  // ============================================================
  // PREHISTORISCHE SPINACHTIGEN EN VEELPOTIGEN
  // ============================================================

  uitgestorvenDierenV9(`
    Arthropleura;
    Microdecemplex;
    Eoarthropleura;
    Pneumodesmus;
    Cowiedesmus;
    Albadesmus;
    Archipolypoda;
    Archidesmus;
    Palaeosoma;
    Amynilyspes;
    Gaspestria;
    Diploaspis;
    Devonobius;
    Crussolum;
    Mazoscolopendra;
    Palaeoscorpius;
    Proscorpius;
    Palaeophonus;
    Dolichophonus;
    Allopalaeophonus;
    Eramoscorpius;
    Waeringoscorpio;
    Praearcturus;
    Brontoscorpio;
    Gigantoscorpio;
    Pulmonoscorpius;
    Mazonia;
    Compsoscorpius;
    Palaeopisthacanthus;
    Typhloscorpius;
    Garnettius;
    Eoscorpius;
    Cyclophthalmus;
    Geralinura;
    Proschizomus;
    Trigonotarbida;
    Palaeocharinus;
    Palaeotarbus;
    Anthracomartus;
    Eophrynus;
    Kreischeria;
    Aphantomartus;
    Cryptomartus;
    Lissomartus;
    Archaeomartus;
    Alkenia;
    Permotarbus;
    Haptopoda;
    Plesiosiro;
    Phalangiotarbi;
    Opiliotarbus;
    Goniotarbus;
    Architarbus;
    Mesotarbus;
    Uraraneida;
    Attercopus;
    Permarachne;
    Chimerarachne;
    Idmonarachne;
    Palaeothele;
    Eocteniza;
    Arthrolycosa;
    Protolycosa;
    Palaeoplectreurys;
    Mongolarachne;
    Juraraneus;
    Eoplectreurys;
    Cretamygale;
    Rosamygale;
    Triassaraneus;
    Palaeohersilia;
    Friularachne;
    Mesozygiella;
    Geratonephila;
    Nephila jurassica;
    Halitherses;
    Mesobunus;
    Eophalangium;
    Hastocularis;
    Macrogyion;
    Ameticos;
    Prothelyphonus;
    Parageralinura;
    Protoschizomus;
    Cratosolpuga;
    Palaeoblossia;
    Prosolpuga;
    Haplocheirus
  `);

  // ============================================================
  // RECENT UITGESTORVEN ONGEWERVELDEN
  // ============================================================

  uitgestorvenDierenV9(`
    Rocky Mountain-locust=Melanoplus spretus;
    Xercesblauwtje=Glaucopsyche xerces;
    Madeiragrootwitje=Pieris wollastoni;
    Schaus swallowtail=Heraclides aristodemus ponceanus;
    Hawaiian blue;
    Levuana iridescens;
    Urania sloanus;
    Morpho theseus;
    Deloneura immaculata;
    Dactylotum;
    St Helena-reuzenoorworm=Labidura herculeana;
    Sint-Helena-oorworm;
    Dryococelus australis;
    Conozoa hyalina;
    Neduba extincta;
    Rhachicreagra;
    Oryctes;
    Aplothorax burchelli;
    Calathus extensicollis;
    Calathus gomerensis;
    Pentarthrum blackburni;
    Rhantus orbignyi;
    Rhantus papuanus;
    Rhantus gutticollis;
    Rhantus novacaledoniae;
    Mecodema punctellum;
    Leptogryllus deceptor;
    Leptogryllus howarthi;
    Leptogryllus;
    Kauai-grotwolfspin=Adelocosa anops;
    Myrmecia inquilina;
    Oecophylla longinoda;
    Partula turgida;
    Partula faba;
    Partula aurantia;
    Partula varia;
    Partula suturalis;
    Partula taeniata;
    Partula rosea;
    Partula nodosa;
    Partula affinis;
    Partula labrusca;
    Partula mirabilis;
    Partula planilabrum;
    Partula navigatoria;
    Partula tristis;
    Partula castanea;
    Partula crassilabris;
    Partula producta;
    Partula radiolata;
    Achatinella apexfulva;
    Achatinella abbreviata;
    Achatinella bellula;
    Achatinella buddii;
    Achatinella caesia;
    Achatinella decipiens;
    Achatinella elegans;
    Achatinella juncea;
    Achatinella leucorraphe;
    Achatinella livida;
    Achatinella lila;
    Achatinella mighelsiana;
    Achatinella pulcherrima;
    Achatinella sowerbyana;
    Achatinella stewartii;
    Achatinella valida;
    Achatinella vittata;
    Carelia;
    Carelia bicolor;
    Carelia cochlea;
    Carelia cumingiana;
    Carelia dolei;
    Carelia glutinosa;
    Carelia olivacea;
    Carelia paradoxa;
    Carelia sinclairi;
    Carelia turricula;
    Amastra;
    Amastra subrostrata;
    Amastra viridis;
    Amastra cylindrica;
    Amastra crassilabrum;
    Amastra flavescens;
    Amastra pellucida;
    Amastra porphyrea;
    Amastra rubens;
    Amastra rugulosa;
    Amastra turritella;
    Amastra umbrosa;
    Amastra violacea;
    Pleurobema curtum;
    Epioblasma arcaeformis;
    Epioblasma biemarginata;
    Epioblasma flexuosa;
    Epioblasma lenior;
    Epioblasma lewisii;
    Epioblasma nigra;
    Epioblasma obliquata;
    Epioblasma personata;
    Epioblasma propinqua;
    Epioblasma sampsonii;
    Epioblasma stewardsonii;
    Epioblasma torulosa;
    Epioblasma turgidula;
    Epioblasma walkeri;
    Epioblasma florentina;
    Epioblasma haysiana;
    Epioblasma othcaloogensis;
    Epioblasma brevidens;
    Leptoxis compacta;
    Leptoxis crassa;
    Leptoxis foremani;
    Leptoxis lirata;
    Leptoxis torrefacta;
    Leptoxis umbilicata;
    Gyrotoma excisa;
    Gyrotoma lewisii;
    Gyrotoma pagoda;
    Gyrotoma pumila;
    Gyrotoma pyramidata;
    Gyrotoma walkeri;
    Pleurocera showalteri;
    Athearnia crassa;
    Athearnia anthonyi;
    Io fluvialis;
    Cambarellus alvarezi;
    Cambarellus chihuahuae;
    Cambarellus prolixus;
    Pacifastacus nigrescens;
    Pacifastacus fortis;
    Procambarus angustatus;
    Procambarus pecki;
    Procambarus simulans;
    Procambarus clarkii;
    Astacus pachypus;
    Astacus astacus
  `);

  // ============================================================
  // CORRECTIES UITSTERFSTATUS ONGEWERVELDEN
  // ============================================================

  verwijderKoppeling("Schaus swallowtail", [43]);
  verwijderKoppeling("Morpho theseus", [43]);
  verwijderKoppeling("Dactylotum", [43]);
  verwijderKoppeling("Dryococelus australis", [43]);
  verwijderKoppeling("Rhachicreagra", [43]);
  verwijderKoppeling("Oryctes", [43]);
  verwijderKoppeling("Leptogryllus", [43]);
  verwijderKoppeling("Kauai-grotwolfspin", [43]);
  verwijderKoppeling("Myrmecia inquilina", [43]);
  verwijderKoppeling("Oecophylla longinoda", [43]);
  verwijderKoppeling("Partula varia", [43]);
  verwijderKoppeling("Partula suturalis", [43]);
  verwijderKoppeling("Partula taeniata", [43]);
  verwijderKoppeling("Partula rosea", [43]);
  verwijderKoppeling("Partula nodosa", [43]);
  verwijderKoppeling("Achatinella pulcherrima", [43]);
  verwijderKoppeling("Amastra", [43]);
  verwijderKoppeling("Epioblasma walkeri", [43]);
  verwijderKoppeling("Epioblasma brevidens", [43]);
  verwijderKoppeling("Leptoxis compacta", [43]);
  verwijderKoppeling("Leptoxis foremani", [43]);
  verwijderKoppeling("Athearnia anthonyi", [43]);
  verwijderKoppeling("Io fluvialis", [43]);
  verwijderKoppeling("Cambarellus prolixus", [43]);
  verwijderKoppeling("Pacifastacus fortis", [43]);
  verwijderKoppeling("Procambarus angustatus", [43]);
  verwijderKoppeling("Procambarus pecki", [43]);
  verwijderKoppeling("Procambarus simulans", [43]);
  verwijderKoppeling("Procambarus clarkii", [43]);
  verwijderKoppeling("Astacus pachypus", [43]);
  verwijderKoppeling("Astacus astacus", [43]);

  verwijderDier("Hawaiian blue");

  samenvoegen(
    "St Helena-reuzenoorworm",
    "Sint-Helena-oorworm"
  );

  // ============================================================
  // BEKENDE ALGEMENE ANTWOORDEN
  // ============================================================

  uitgestorvenDierenV9(`
    Dinosaurus;
    Vliegende dinosaurus;
    Langnekdinosaurus;
    Hoorn dinosaurus;
    Pantserdinosaurus;
    Oerreptiel;
    Sabeltandkat;
    Reuzenalk;
    Dodo;
    Mammoet;
    Wolharige neushoorn;
    Reuzenhert;
    Tasmaanse tijger;
    Oeros;
    Quagga;
    Megalodon;
    Mosasaurus;
    Plesiosaurus;
    Ichthyosaurus;
    Trilobiet;
    Ammoniet;
    Belemniet;
    Zeeschorpioen;
    Olifantsvogel;
    Moa
  `);

  // Algemene woorden die te breed zijn verwijderen
  // uit vraag 43.

  verwijderKoppeling("Oerreptiel", [43]);
  verwijderKoppeling("Vliegende dinosaurus", [43]);

  hernoemDier(
    "Hoorn dinosaurus",
    "Hoorndinosaurus"
  );

  // ============================================================
  // EXTRA KOPPELINGEN: PREHISTORISCHE DIEREN
  // ============================================================

  // Vraag 4: dieren met vier poten.
  //
  // Anatomische eigenschappen gelden ook voor
  // uitgestorven dieren.

  koppelDieren(`
    Mammoet;
    Wolharige mammoet;
    Steppemammoet;
    Zuidelijke mammoet;
    Colombiaanse mammoet;
    Mastodont;
    Amerikaanse mastodont;
    Deinotherium;
    Gomphotherium;
    Platybelodon;
    Wolharige neushoorn;
    Elasmotherium;
    Paraceratherium;
    Smilodon;
    Homotherium;
    Grottenleeuw;
    Grottenbeer;
    Kortsnuitbeer;
    Reuzenwolf;
    Tasmaanse tijger;
    Falklandwolf;
    Oeros;
    Quagga;
    Steppebizon;
    Reuzenhert;
    Megatherium;
    Eremotherium;
    Mylodon;
    Glyptodon;
    Doedicurus;
    Panochthus;
    Diprotodon;
    Buidelleeuw;
    Thylacosmilus;
    Triceratops;
    Torosaurus;
    Styracosaurus;
    Centrosaurus;
    Pachyrhinosaurus;
    Pentaceratops;
    Ankylosaurus;
    Euoplocephalus;
    Stegosaurus;
    Kentrosaurus;
    Diplodocus;
    Brontosaurus;
    Apatosaurus;
    Brachiosaurus;
    Giraffatitan;
    Argentinosaurus;
    Patagotitan;
    Supersaurus
  `, [4]);

  // ============================================================
  // VRAAG 7 - EIERLEGGENDE DIEREN
  // ============================================================

  koppelDieren(`
    Tyrannosaurus;
    Tyrannosaurus rex;
    Velociraptor;
    Deinonychus;
    Oviraptor;
    Citipati;
    Troodon;
    Maiasaura;
    Protoceratops;
    Triceratops;
    Stegosaurus;
    Ankylosaurus;
    Diplodocus;
    Brontosaurus;
    Apatosaurus;
    Brachiosaurus;
    Argentinosaurus;
    Pteranodon;
    Pterodactylus;
    Quetzalcoatlus;
    Dodo;
    Reuzenalk;
    Trekduif;
    Moa;
    Olifantsvogel;
    Haasts arend;
    Archaeopteryx;
    Confuciusornis;
    Hesperornis;
    Archelon;
    Protostega
  `, [7]);

  // ============================================================
  // VRAAG 9 - GROTER DAN EEN MENS
  // ============================================================

  koppelDieren(`
    Tyrannosaurus rex;
    Tyrannosaurus;
    Tarbosaurus;
    Albertosaurus;
    Gorgosaurus;
    Daspletosaurus;
    Allosaurus;
    Spinosaurus;
    Giganotosaurus;
    Carcharodontosaurus;
    Mapusaurus;
    Tyrannotitan;
    Meraxes;
    Acrocanthosaurus;
    Ceratosaurus;
    Carnotaurus;
    Megalosaurus;
    Torvosaurus;
    Baryonyx;
    Suchomimus;
    Yutyrannus;
    Utahraptor;
    Therizinosaurus;
    Deinocheirus;
    Gigantoraptor;
    Plateosaurus;
    Iguanodon;
    Ouranosaurus;
    Edmontosaurus;
    Shantungosaurus;
    Parasaurolophus;
    Lambeosaurus;
    Corythosaurus;
    Maiasaura;
    Triceratops;
    Torosaurus;
    Styracosaurus;
    Pentaceratops;
    Ankylosaurus;
    Euoplocephalus;
    Stegosaurus;
    Kentrosaurus;
    Diplodocus;
    Brontosaurus;
    Apatosaurus;
    Brachiosaurus;
    Giraffatitan;
    Supersaurus;
    Argentinosaurus;
    Patagotitan;
    Dreadnoughtus;
    Futalognkosaurus;
    Puertasaurus;
    Mamenchisaurus;
    Turiasaurus;
    Camarasaurus;
    Sauroposeidon;
    Quetzalcoatlus;
    Hatzegopteryx;
    Mosasaurus;
    Tylosaurus;
    Liopleurodon;
    Kronosaurus;
    Pliosaurus;
    Elasmosaurus;
    Shonisaurus;
    Shastasaurus;
    Megalodon;
    Dunkleosteus;
    Leedsichthys;
    Titanoboa;
    Sarcosuchus;
    Deinosuchus;
    Purussaurus;
    Mammoet;
    Wolharige mammoet;
    Steppemammoet;
    Amerikaanse mastodont;
    Deinotherium;
    Paraceratherium;
    Elasmotherium;
    Wolharige neushoorn;
    Sivatherium;
    Megatherium;
    Eremotherium;
    Glyptodon;
    Doedicurus;
    Diprotodon;
    Procoptodon;
    Gigantopithecus;
    Basilosaurus;
    Perucetus;
    Livyatan;
    Stellers zeekoe;
    Dromornis stirtoni;
    Vorombe titan;
    Dinornis robustus;
    Kelenken
  `, [9]);

  // ============================================================
  // VRAAG 16 - PLANTENETERS
  // ============================================================

  koppelDieren(`
    Triceratops;
    Torosaurus;
    Styracosaurus;
    Centrosaurus;
    Pachyrhinosaurus;
    Pentaceratops;
    Protoceratops;
    Psittacosaurus;
    Ankylosaurus;
    Euoplocephalus;
    Nodosaurus;
    Stegosaurus;
    Kentrosaurus;
    Dacentrurus;
    Diplodocus;
    Apatosaurus;
    Brontosaurus;
    Brachiosaurus;
    Giraffatitan;
    Argentinosaurus;
    Patagotitan;
    Supersaurus;
    Camarasaurus;
    Mamenchisaurus;
    Nigersaurus;
    Saltasaurus;
    Edmontosaurus;
    Iguanodon;
    Parasaurolophus;
    Lambeosaurus;
    Corythosaurus;
    Maiasaura;
    Ouranosaurus;
    Shantungosaurus;
    Gryposaurus;
    Mammoet;
    Wolharige mammoet;
    Steppemammoet;
    Amerikaanse mastodont;
    Gomphotherium;
    Deinotherium;
    Platybelodon;
    Paraceratherium;
    Wolharige neushoorn;
    Elasmotherium;
    Oeros;
    Quagga;
    Steppebizon;
    Reuzenhert;
    Sivatherium;
    Camelops;
    Macrauchenia;
    Toxodon;
    Megatherium;
    Eremotherium;
    Mylodon;
    Glossotherium;
    Glyptodon;
    Doedicurus;
    Diprotodon;
    Procoptodon;
    Stellers zeekoe
  `, [16]);

  // ============================================================
  // VRAAG 17 - VLEESETERS
  // ============================================================

  koppelDieren(`
    Tyrannosaurus rex;
    Tyrannosaurus;
    Tarbosaurus;
    Albertosaurus;
    Gorgosaurus;
    Daspletosaurus;
    Allosaurus;
    Giganotosaurus;
    Carcharodontosaurus;
    Mapusaurus;
    Tyrannotitan;
    Meraxes;
    Acrocanthosaurus;
    Ceratosaurus;
    Carnotaurus;
    Majungasaurus;
    Abelisaurus;
    Aucasaurus;
    Megalosaurus;
    Torvosaurus;
    Spinosaurus;
    Baryonyx;
    Suchomimus;
    Velociraptor;
    Deinonychus;
    Utahraptor;
    Dromaeosaurus;
    Saurornitholestes;
    Achillobator;
    Compsognathus;
    Dilophosaurus;
    Cryolophosaurus;
    Coelophysis;
    Herrerasaurus;
    Smilodon;
    Homotherium;
    Machairodus;
    Megantereon;
    Dinofelis;
    Grottenleeuw;
    Amerikaanse leeuw;
    Reuzenwolf;
    Tasmaanse tijger;
    Buidelleeuw;
    Thylacosmilus;
    Borhyaena;
    Hyaenodon;
    Megistotherium;
    Simbakubwa;
    Mosasaurus;
    Tylosaurus;
    Pliosaurus;
    Liopleurodon;
    Kronosaurus;
    Ichthyosaurus;
    Elasmosaurus;
    Megalodon;
    Dunkleosteus;
    Xiphactinus;
    Titanoboa;
    Deinosuchus;
    Sarcosuchus;
    Purussaurus;
    Basilosaurus;
    Livyatan;
    Dorudon;
    Phorusrhacos;
    Titanis;
    Kelenken;
    Haasts arend;
    Argentavis magnificens;
    Anomalocaris
  `, [17]);

  // ============================================================
  // VRAAG 18 - DIEREN MET EEN STAART
  // ============================================================

  koppelDieren(`
    Tyrannosaurus rex;
    Tarbosaurus;
    Allosaurus;
    Spinosaurus;
    Carnotaurus;
    Velociraptor;
    Deinonychus;
    Utahraptor;
    Dilophosaurus;
    Triceratops;
    Styracosaurus;
    Ankylosaurus;
    Euoplocephalus;
    Stegosaurus;
    Kentrosaurus;
    Diplodocus;
    Brontosaurus;
    Apatosaurus;
    Brachiosaurus;
    Argentinosaurus;
    Patagotitan;
    Iguanodon;
    Parasaurolophus;
    Edmontosaurus;
    Rhamphorhynchus;
    Dimorphodon;
    Archaeopteryx;
    Mosasaurus;
    Ichthyosaurus;
    Plesiosaurus;
    Megalodon;
    Mammoet;
    Mastodont;
    Oeros;
    Quagga;
    Tasmaanse tijger;
    Smilodon;
    Grottenleeuw;
    Grottenbeer;
    Reuzenwolf;
    Falklandwolf;
    Glyptodon;
    Doedicurus;
    Megatherium;
    Diprotodon
  `, [18]);

  // ============================================================
  // VRAAG 19 - DIEREN MET HOORNS
  // ============================================================

  koppelDieren(`
    Triceratops;
    Torosaurus;
    Styracosaurus;
    Centrosaurus;
    Pentaceratops;
    Chasmosaurus;
    Kosmoceratops;
    Utahceratops;
    Regaliceratops;
    Diabloceratops;
    Nasutoceratops;
    Einiosaurus;
    Lokiceratops;
    Carnotaurus;
    Ceratosaurus;
    Oeros;
    Steppebizon;
    Wolharige neushoorn;
    Elasmotherium;
    Blauwbok
  `, [19]);

  // Geweien worden niet automatisch als hoorns gezien.

  verwijderKoppeling("Reuzenhert", [19]);

  // ============================================================
  // VRAAG 20 - DIEREN MET EEN VACHT
  // ============================================================

  koppelDieren(`
    Wolharige mammoet;
    Steppemammoet;
    Wolharige neushoorn;
    Grottenbeer;
    Kortsnuitbeer;
    Grottenleeuw;
    Amerikaanse leeuw;
    Smilodon;
    Homotherium;
    Reuzenwolf;
    Falklandwolf;
    Tasmaanse tijger;
    Oeros;
    Quagga;
    Steppebizon;
    Reuzenhert;
    Megatherium;
    Mylodon;
    Eremotherium;
    Diprotodon;
    Procoptodon;
    Buidelleeuw;
    Gigantopithecus;
    Japanse wolf;
    Hokkaidowolf;
    Blauwbok;
    Schomburgks hert;
    Tarpan
  `, [20]);

  // ============================================================
  // VRAAG 22 - DIEREN MET VEREN
  // ============================================================

  koppelDieren(`
    Archaeopteryx;
    Microraptor;
    Anchiornis;
    Xiaotingia;
    Aurornis;
    Sinosauropteryx;
    Caudipteryx;
    Protarchaeopteryx;
    Similicaudipteryx;
    Yutyrannus;
    Velociraptor;
    Zhenyuanlong;
    Sinornithosaurus;
    Changyuraptor;
    Wulong;
    Beipiaosaurus;
    Shuvuuia;
    Confuciusornis;
    Jeholornis;
    Sapeornis;
    Dodo;
    Reuzenalk;
    Trekduif;
    Carolinaparkiet;
    Moa;
    Olifantsvogel;
    Haasts arend;
    Phorusrhacos;
    Kelenken;
    Titanis;
    Gastornis;
    Argentavis magnificens;
    Pelagornis;
    Hesperornis;
    Ichthyornis;
    Huia;
    Paradijsparkiet;
    Cubaanse ara;
    Gouden mamo;
    Kauai-moho
  `, [22]);

  // ============================================================
  // VRAAG 33 - DIEREN MET EEN SCHILD
  // ============================================================

  koppelDieren(`
    Glyptodon;
    Doedicurus;
    Panochthus;
    Glyptotherium;
    Neosclerocalyptus;
    Pampatherium;
    Holmesina;
    Ankylosaurus;
    Euoplocephalus;
    Borealopelta;
    Nodosaurus;
    Sauropelta;
    Edmontonia;
    Archelon;
    Protostega;
    Meiolania;
    Pinta-reuzenschildpad;
    Rodriguesreuzenschildpad;
    Mauritiusreuzenschildpad
  `, [33]);

  // ============================================================
  // VRAAG 36 - DIEREN MET EEN LANGE NEK
  // ============================================================

  koppelDieren(`
    Diplodocus;
    Brontosaurus;
    Apatosaurus;
    Barosaurus;
    Supersaurus;
    Brachiosaurus;
    Giraffatitan;
    Sauroposeidon;
    Mamenchisaurus;
    Xinjiangtitan;
    Omeisaurus;
    Shunosaurus;
    Camarasaurus;
    Argentinosaurus;
    Patagotitan;
    Dreadnoughtus;
    Futalognkosaurus;
    Puertasaurus;
    Turiasaurus;
    Erketu;
    Euhelopus;
    Nigersaurus;
    Saltasaurus;
    Amargasaurus;
    Bajadasaurus;
    Plateosaurus;
    Elasmosaurus;
    Albertonectes;
    Styxosaurus;
    Thalassomedon;
    Hydrotherosaurus;
    Libonectes;
    Plesiosaurus;
    Muraenosaurus;
    Cryptoclidus;
    Tanystropheus;
    Dinocephalosaurus;
    Paraceratherium;
    Sivatherium;
    Samotherium;
    Aepycamelus;
    Camelops;
    Moa;
    Olifantsvogel;
    Gastornis;
    Dromornis;
    Genyornis
  `, [36]);

  // ============================================================
  // VRAAG 48 - DIEREN MET STREPEN
  // ============================================================

  koppelDieren(`
    Quagga;
    Tasmaanse tijger;
    Balinese tijger;
    Javaanse tijger;
    Kaspische tijger
  `, [48]);

  // Geen verzonnen kleuren en patronen van dinosaurussen.

  // ============================================================
  // VRAAG 50 - NATUURDOCUMENTAIRES
  // ============================================================

  koppelDieren(`
    Dinosaurus;
    Tyrannosaurus rex;
    Velociraptor;
    Deinonychus;
    Utahraptor;
    Spinosaurus;
    Allosaurus;
    Giganotosaurus;
    Carcharodontosaurus;
    Carnotaurus;
    Baryonyx;
    Therizinosaurus;
    Deinocheirus;
    Oviraptor;
    Microraptor;
    Yutyrannus;
    Triceratops;
    Styracosaurus;
    Protoceratops;
    Ankylosaurus;
    Stegosaurus;
    Kentrosaurus;
    Diplodocus;
    Brontosaurus;
    Apatosaurus;
    Brachiosaurus;
    Argentinosaurus;
    Patagotitan;
    Supersaurus;
    Mamenchisaurus;
    Iguanodon;
    Parasaurolophus;
    Edmontosaurus;
    Maiasaura;
    Pachycephalosaurus;
    Pteranodon;
    Pterodactylus;
    Quetzalcoatlus;
    Hatzegopteryx;
    Rhamphorhynchus;
    Mosasaurus;
    Tylosaurus;
    Plesiosaurus;
    Elasmosaurus;
    Liopleurodon;
    Kronosaurus;
    Ichthyosaurus;
    Shonisaurus;
    Megalodon;
    Dunkleosteus;
    Helicoprion;
    Leedsichthys;
    Titanoboa;
    Deinosuchus;
    Sarcosuchus;
    Purussaurus;
    Archelon;
    Megalania;
    Diplocaulus;
    Eryops;
    Mammoet;
    Wolharige mammoet;
    Mastodont;
    Deinotherium;
    Platybelodon;
    Wolharige neushoorn;
    Elasmotherium;
    Paraceratherium;
    Smilodon;
    Homotherium;
    Grottenleeuw;
    Grottenbeer;
    Reuzenwolf;
    Kortsnuitbeer;
    Glyptodon;
    Doedicurus;
    Megatherium;
    Diprotodon;
    Procoptodon;
    Buidelleeuw;
    Thylacosmilus;
    Reuzenhert;
    Oeros;
    Quagga;
    Tasmaanse tijger;
    Falklandwolf;
    Blauwbok;
    Gigantopithecus;
    Basilosaurus;
    Pakicetus;
    Ambulocetus;
    Livyatan;
    Stellers zeekoe;
    Dodo;
    Reuzenalk;
    Trekduif;
    Moa;
    Olifantsvogel;
    Haasts arend;
    Phorusrhacos;
    Kelenken;
    Gastornis;
    Argentavis magnificens;
    Pelagornis;
    Archaeopteryx;
    Trilobiet;
    Ammoniet;
    Belemniet;
    Zeeschorpioen;
    Anomalocaris;
    Opabinia;
    Hallucigenia;
    Dickinsonia;
    Arthropleura;
    Meganeura
  `, [50]);

  // ============================================================
  // EXTRA SYNONIEMEN
  // ============================================================

  samenvoegen("Reuzenwolf", "Aenocyon dirus");
  samenvoegen("Megalodon", "Otodus megalodon");
  samenvoegen("Dodo", "Raphus cucullatus");
  samenvoegen("Reuzenalk", "Pinguinus impennis");
  samenvoegen("Trekduif", "Ectopistes migratorius");
  samenvoegen("Oeros", "Bos primigenius");
  samenvoegen("Quagga", "Equus quagga quagga");

  samenvoegen(
    "Wolharige mammoet",
    "Mammuthus primigenius"
  );

  samenvoegen(
    "Wolharige neushoorn",
    "Coelodonta antiquitatis"
  );

  samenvoegen(
    "Amerikaanse mastodont",
    "Mammut americanum"
  );

  samenvoegen(
    "Grottenbeer",
    "Ursus spelaeus"
  );

  samenvoegen(
    "Grottenleeuw",
    "Panthera spelaea"
  );

  samenvoegen(
    "Stellers zeekoe",
    "Hydrodamalis gigas"
  );

  samenvoegen(
    "Chinese lepelsteur",
    "Psephurus gladius"
  );

  samenvoegen(
    "Tasmaanse tijger",
    "Thylacinus cynocephalus"
  );

  samenvoegen(
    "Falklandwolf",
    "Dusicyon australis"
  );

  // ============================================================
  // CONTROLE OP BEKENDE LEVENDE DIEREN
  // ============================================================

  const levendeDierenControleV9Deel8 = `
    Hond;
    Huiskat;
    Leeuw;
    Tijger;
    Luipaard;
    Jaguar;
    Poema;
    Jachtluipaard;
    Europese lynx;
    Wolf;
    Rode vos;
    Poolvos;
    IJsbeer;
    Bruine beer;
    Reuzenpanda;
    Rode panda;
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
    Giraf;
    Okapi;
    Zebra;
    Steppezebra;
    Bergzebra;
    Grévyzebra;
    Przewalskipaard;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Amerikaanse bizon;
    Europese bizon;
    Kouprey;
    Takin;
    Tasmaanse duivel;
    Koala;
    Wombat;
    Kangoeroe;
    Quokka;
    Vogelbekdier;
    Mierenegel;
    Walvishaai;
    Witte haai;
    Tijgerhaai;
    Groenlandse haai;
    Blauwe vinvis;
    Potvis;
    Orka;
    Doegong;
    Lamantijn;
    Baiji;
    Axolotl;
    Olm;
    Chinese reuzensalamander;
    Komodovaraan;
    Brughagedis;
    Aldabra-reuzenschildpad;
    Groene zeeschildpad;
    Lederschildpad;
    Kakapo;
    Kiwi;
    Kasuaris;
    Emoe;
    Struisvogel;
    Andescondor;
    Californische condor;
    Filipijnse arend;
    Blauwe ara;
    Spix' ara;
    Guamral;
    Guamijsvogel;
    Japanse kuifibis;
    Chinese alligator;
    Gaviaal;
    Saola;
    Vaquita
  `;

  // Sommige dieren zijn ernstig bedreigd of mogelijk
  // uitgestorven, maar worden voorlopig niet geaccepteerd
  // bij vraag 43 zonder bevestigde status.

  for (
    const naam of
    levendeDierenControleV9Deel8.split(";")
  ) {
    const schoon = naam.trim();

    if (schoon) {
      verwijderKoppeling(schoon, [43]);
    }
  }

  // ============================================================
  // RAPPORTAGE VRAAG 43
  // ============================================================

  const aantalUitgestorvenV9Deel8 =
    aantalAntwoorden(43);

  console.log(
    "QuizBallon V9 - uitgestorven dieren:",
    aantalUitgestorvenV9Deel8
  );

  console.log(
    "QuizBallon V9 - raketten vraag 43:",
    aantalRaketten(aantalUitgestorvenV9Deel8)
  );

  console.log(
    "QuizBallon V9 - resterend tot 1000:",
    Math.max(
      0,
      1000 - aantalUitgestorvenV9Deel8
    )
  );

  // ============================================================
  // TUSSENTIJDSE CONTROLE DEEL 8
  // ============================================================

  const samengevoegdDeel8 =
    controleerDubbeleDieren();

  const naamconflictenDeel8 =
    controleerNaamconflicten();

  console.log(
    "QuizBallon V9 - deel 8 - samengevoegde dieren:",
    samengevoegdDeel8
  );

  console.log(
    "QuizBallon V9 - totaal opgeslagen dierrecords:",
    database.size
  );

  console.log(
    "QuizBallon V9 - aantal naamconflicten:",
    naamconflictenDeel8.length
  );

  console.table(
    naamconflictenDeel8.slice(0, 100)
  );

  const voortgangDierenDeel8 =
    vragen.map((tekst, index) => {
      const nummer = index + 1;
      const aantal = aantalAntwoorden(nummer);

      return {
        nummer,
        vraag: tekst,
        antwoorden: aantal,
        raketten: aantalRaketten(aantal),
        streefaantal: 1000,
        ontbrekend: Math.max(0, 1000 - aantal),
        doelBereikt: aantal >= 1000
      };
    });

  console.table(voortgangDierenDeel8);

  console.log(
    "QuizBallon V9 - vragen met minimaal 1000 antwoorden:",
    voortgangDierenDeel8.filter(
      vraag => vraag.doelBereikt
    ).length
  );

  console.log(
    "QuizBallon V9 - totale vraag-antwoordkoppelingen:",
    voortgangDierenDeel8.reduce(
      (totaal, vraag) =>
        totaal + vraag.antwoorden,
      0
    )
  );

  console.table(
    [...voortgangDierenDeel8].sort(
      (a, b) => a.antwoorden - b.antwoorden
    )
  );

  // ============================================================
  // EINDE DEEL 8
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 9
  // VRAAGKOPPELINGEN, SYNONIEMEN EN KWALITEITSCONTROLE
  // ============================================================

  // Een dier wordt centraal opgeslagen.
  // Hetzelfde dier kan aan meerdere vragen gekoppeld zijn.
  // Synoniemen tellen niet als afzonderlijke antwoorden.

  // ============================================================
  // HULPFUNCTIES DEEL 9
  // ============================================================

  function zoekDierenDeel9(naam) {
    const sleutel = normaliseer(naam);
    const gevonden = [];

    for (const record of database.values()) {
      if (
        normaliseer(record.naam) === sleutel ||
        [...record.synoniemen].some(
          synoniem => normaliseer(synoniem) === sleutel
        )
      ) {
        gevonden.push(record);
      }
    }

    return gevonden;
  }

  const ontbrekendeNamenDeel9 = new Set();
  const dubbelzinnigeNamenDeel9 = new Set();

  function veiligKoppelenDeel9(tekst, nummers) {
    for (const onderdeel of tekst.split(";")) {
      const naam = onderdeel.trim();

      if (!naam) continue;

      const gevonden = zoekDierenDeel9(naam);

      if (gevonden.length === 0) {
        ontbrekendeNamenDeel9.add(naam);
        continue;
      }

      if (gevonden.length > 1) {
        dubbelzinnigeNamenDeel9.add(naam);
        continue;
      }

      for (const nummer of nummers) {
        if (
          Number.isInteger(nummer) &&
          nummer >= 1 &&
          nummer <= 50
        ) {
          gevonden[0].vragen.add(nummer);
        }
      }
    }
  }

  function veiligVerwijderenDeel9(tekst, nummers) {
    for (const onderdeel of tekst.split(";")) {
      const naam = onderdeel.trim();

      if (!naam) continue;

      const gevonden = zoekDierenDeel9(naam);

      if (gevonden.length !== 1) continue;

      for (const nummer of nummers) {
        gevonden[0].vragen.delete(nummer);
      }
    }
  }

  function synoniemenDeel9(naam, alternatieven) {
    const gevonden = zoekDierenDeel9(naam);

    if (gevonden.length !== 1) return;

    const record = gevonden[0];

    for (const alternatief of alternatieven) {
      const schoon = alternatief.trim();

      if (!schoon) continue;

      const conflicten = zoekDierenDeel9(schoon)
        .filter(ander => ander !== record);

      if (conflicten.length > 0) {
        dubbelzinnigeNamenDeel9.add(schoon);
        continue;
      }

      record.synoniemen.add(schoon);
    }
  }

  // ============================================================
  // VRAAG 1 - DIEREN DIE IN HET WATER LEVEN
  // ============================================================

  veiligKoppelenDeel9(`
    Blauwe vinvis;
    Gewone vinvis;
    Noordse vinvis;
    Dwergvinvis;
    Bultrug;
    Potvis;
    Dwergpotvis;
    Kleine potvis;
    Orka;
    Kleine orka;
    Griend;
    Tuimelaar;
    Gewone dolfijn;
    Witsnuitdolfijn;
    Witflankdolfijn;
    Spinnerdolfijn;
    Gestreepte dolfijn;
    Grijze dolfijn;
    Spitssnuitdolfijn;
    Narwal;
    Beloega;
    Bruinvis;
    Vaquita;
    Amazone-rivierdolfijn;
    Gangesdolfijn;
    Irrawaddydolfijn;
    Doegong;
    Lamantijn;
    Afrikaanse lamantijn;
    Amazonezeekoe;
    Caribische lamantijn;
    Zeeotter;
    Walrus;
    Gewone zeehond;
    Grijze zeehond;
    Ringelrob;
    Baardrob;
    Klapmuts;
    Zadelrob;
    Weddellzeehond;
    Krabbeneter;
    Zeeluipaard;
    Californische zeeleeuw;
    Stellerzeeleeuw;
    Noordelijke zeeolifant;
    Zuidelijke zeeolifant;
    Vogelbekdier;
    Nijlpaard;
    Europese bever;
    Canadese bever;
    Europese otter;
    Reuzenotter;
    Muskusrat;
    Beverrat;
    Waterspitsmuis;
    Groene zeeschildpad;
    Lederschildpad;
    Karetschildpad;
    Dikkopschildpad;
    Warana;
    Kemps zeeschildpad;
    Platrugzeeschildpad;
    Zeeleguaan;
    Nijlkrokodil;
    Zeekrokodil;
    Gaviaal;
    Brilkaaiman;
    Zwarte kaaiman;
    Chinese alligator;
    Mississippialligator;
    Axolotl;
    Olm;
    Chinese reuzensalamander;
    Japanse reuzensalamander;
    Afrikaanse klauwkikker;
    Dwergklauwkikker;
    Surinaamse pad;
    Kleine wrattenslang;
    Geelbuikzeeslang;
    Olijfzeeslang;
    Gebande zeekrait;
    Waterspin;
    Waterkever;
    Geelgerande watertor;
    Schaatsenrijder;
    Waterschorpioen;
    Rugzwemmer;
    Duikerwants;
    Zoetwaterpissebed;
    Watervlo;
    Pekelkreeftje;
    Cyclops;
    Tubifex;
    Bloedzuiger
  `, [1]);

  // ============================================================
  // VRAAG 2 - DIEREN DIE KUNNEN VLIEGEN
  // ============================================================

  veiligKoppelenDeel9(`
    Huismus;
    Ringmus;
    Koolmees;
    Pimpelmees;
    Zwarte mees;
    Kuifmees;
    Glanskop;
    Matkop;
    Staartmees;
    Merel;
    Zanglijster;
    Grote lijster;
    Koperwiek;
    Kramsvogel;
    Roodborst;
    Winterkoning;
    Heggenmus;
    Vink;
    Keep;
    Groenling;
    Putter;
    Sijs;
    Kneu;
    Goudvink;
    Appelvink;
    Geelgors;
    Rietgors;
    Spreeuw;
    Ekster;
    Gaai;
    Kauw;
    Roek;
    Raaf;
    Zwarte kraai;
    Bonte kraai;
    Boomklever;
    Boomkruiper;
    Grote bonte specht;
    Kleine bonte specht;
    Groene specht;
    Zwarte specht;
    Draaihals;
    Boerenzwaluw;
    Huiszwaluw;
    Oeverzwaluw;
    Gierzwaluw;
    IJsvogel;
    Bijeneter;
    Hop;
    Koekoek;
    Zomertortel;
    Turkse tortel;
    Houtduif;
    Holenduif;
    Stadsduif;
    Buizerd;
    Havik;
    Sperwer;
    Wespendief;
    Zeearend;
    Steenarend;
    Visarend;
    Torenvalk;
    Slechtvalk;
    Boomvalk;
    Smelleken;
    Kerkuil;
    Bosuil;
    Ransuil;
    Velduil;
    Steenuil;
    Oehoe;
    Sneeuwuil;
    Blauwe reiger;
    Purperreiger;
    Grote zilverreiger;
    Kleine zilverreiger;
    Lepelaar;
    Ooievaar;
    Zwarte ooievaar;
    Flamingo;
    Kraanvogel;
    Wilde eend;
    Krakeend;
    Smient;
    Slobeend;
    Wintertaling;
    Zomertaling;
    Pijlstaart;
    Kuifeend;
    Tafeleend;
    Bergeend;
    Eidereend;
    Grote zaagbek;
    Middelste zaagbek;
    Nonnetje;
    Grauwe gans;
    Brandgans;
    Rotgans;
    Kolgans;
    Canadese gans;
    Knobbelzwaan;
    Wilde zwaan;
    Kleine zwaan;
    Zilvermeeuw;
    Kokmeeuw;
    Stormmeeuw;
    Grote mantelmeeuw;
    Kleine mantelmeeuw;
    Visdief;
    Noordse stern;
    Grote stern;
    Dwergstern;
    Zwarte stern;
    Jan-van-gent;
    Aalscholver;
    Kuifaalscholver;
    Papegaaiduiker;
    Zeekoet;
    Alk;
    Noordse stormvogel;
    Grote jager;
    Kleine jager;
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Watervleermuis;
    Meervleermuis;
    Baardvleermuis;
    Franjestaart;
    Grootoorvleermuis;
    Kleine hoefijzerneus;
    Grote hoefijzerneus;
    Vleerhond;
    Vampiervleermuis;
    Honingbij;
    Aardhommel;
    Steenhommel;
    Akkerhommel;
    Boomhommel;
    Tuinhommel;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Aziatische hoornaar;
    Huisvlieg;
    Bromvlieg;
    Groene vleesvlieg;
    Zweefvlieg;
    Daas;
    Steekmug;
    Langpootmug;
    Lieveheersbeestje;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Meikever;
    Junikever;
    Julikever;
    Vliegend hert;
    Rozenkever;
    Gouden tor;
    Muskusboktor;
    Dagpauwoog;
    Atalanta;
    Kleine vos;
    Gehakkelde aurelia;
    Citroenvlinder;
    Oranjetipje;
    Groot koolwitje;
    Klein koolwitje;
    Klein geaderd witje;
    Koninginnenpage;
    Koningspage;
    Distelvlinder;
    Landkaartje;
    Bont zandoogje;
    Bruin zandoogje;
    Oranje zandoogje;
    Hooibeestje;
    Icarusblauwtje;
    Boomblauwtje;
    Kleine vuurvlinder;
    Sint-jansvlinder;
    Kolibrievlinder;
    Doodshoofdvlinder;
    Ligusterpijlstaart;
    Pauwoogpijlstaart;
    Grote keizerlibel;
    Blauwe glazenmaker;
    Bruine glazenmaker;
    Paardenbijter;
    Platbuik;
    Viervlek;
    Gewone oeverlibel;
    Bloedrode heidelibel;
    Steenrode heidelibel;
    Watersnuffel;
    Lantaarntje;
    Azuurwaterjuffer;
    Vuurjuffer;
    Weidebeekjuffer;
    Bosbeekjuffer
  `, [2]);

  // Dieren die alleen kunnen zweven, zijn
  // geen echte vliegende dieren.

  veiligVerwijderenDeel9(`
    Struisvogel;
    Emoe;
    Kasuaris;
    Kiwi;
    Kakapo;
    Pinguïn;
    Keizerspinguïn;
    Koningspinguïn;
    Galapagospinguïn;
    Dodo;
    Moa;
    Olifantsvogel;
    Reuzenalk;
    Vliegende vis;
    Vliegende eekhoorn;
    Suikereekhoorn;
    Vliegende maki;
    Vliegende slang;
    Paradijsslang;
    Vliegende draak;
    Vliegende gekko;
    Wallaces vliegende kikker
  `, [2]);

  // ============================================================
  // VRAAG 3 - DIERENTUINDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Leeuw;
    Afrikaanse leeuw;
    Aziatische leeuw;
    Tijger;
    Siberische tijger;
    Bengaalse tijger;
    Sumatraanse tijger;
    Luipaard;
    Amoerluipaard;
    Sneeuwluipaard;
    Jaguar;
    Poema;
    Jachtluipaard;
    Serval;
    Caracal;
    Ocelot;
    Europese lynx;
    Rode lynx;
    Binturong;
    Fossa;
    Stokstaartje;
    Zebramangoeste;
    Dwergmangoeste;
    Afrikaanse wilde hond;
    Hyenahond;
    Gevlekte hyena;
    Gestreepte hyena;
    Grijze wolf;
    Manenwolf;
    Poolvos;
    Woestijnvos;
    Grootoorvos;
    IJsbeer;
    Bruine beer;
    Lippenbeer;
    Maleise beer;
    Brilbeer;
    Reuzenpanda;
    Rode panda;
    Wasbeer;
    Neusbeer;
    Rolstaartbeer;
    Afrikaanse savanneolifant;
    Aziatische olifant;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Nijlpaard;
    Dwergnijlpaard;
    Giraf;
    Okapi;
    Steppezebra;
    Grévyzebra;
    Bergzebra;
    Przewalskipaard;
    Onager;
    Afrikaanse wilde ezel;
    Dromedaris;
    Kameel;
    Lama;
    Alpaca;
    Vicuna;
    Guanaco;
    Europese bizon;
    Amerikaanse bizon;
    Muskusos;
    Takin;
    Gaur;
    Banteng;
    Waterbuffel;
    Kaapse buffel;
    Eland;
    Rendier;
    Edelhert;
    Damhert;
    Pater-Davidshert;
    Sikahert;
    Axishert;
    Muntjak;
    Wapiti;
    Wrattenzwijn;
    Penseelzwijn;
    Babiroesa;
    Halsbandpekari;
    Witlippekari;
    Laaglandtapir;
    Maleise tapir;
    Bergtapir;
    Midden-Amerikaanse tapir;
    Gorilla;
    Westelijke laaglandgorilla;
    Chimpansee;
    Bonobo;
    Borneose orang-oetan;
    Sumatraanse orang-oetan;
    Siamang;
    Witwanggibbon;
    Withandgibbon;
    Ringstaartmaki;
    Vari;
    Rode vari;
    Bruine maki;
    Katta;
    Sifaka;
    Mandril;
    Drill;
    Mantelbaviaan;
    Groene meerkat;
    Diana-meerkat;
    Brulaap;
    Slingeraap;
    Kapucijnaap;
    Doodshoofdaapje;
    Gouden leeuwaapje;
    Gewoon penseelaapje;
    Keizertamarin;
    Pinchéaapje;
    Reuzenmiereneter;
    Tamandoea;
    Aardvarken;
    Tweevingerige luiaard;
    Drievingerige luiaard;
    Negenbandgordeldier;
    Driebandgordeldier;
    Capibara;
    Mara;
    Agoeti;
    Paka;
    Stekelvarken;
    Prairiehond;
    Marmot;
    Rode reuzenkangoeroe;
    Bennettwallaby;
    Moeraswallaby;
    Boomkangoeroe;
    Koala;
    Wombat;
    Tasmaanse duivel;
    Quokka;
    Struisvogel;
    Emoe;
    Kasuaris;
    Nandoe;
    Helmparelhoen;
    Pauw;
    Flamingo;
    Roze pelikaan;
    Kroeskoppelikaan;
    Schoenbekooievaar;
    Maraboe;
    Secretarisvogel;
    Kookaburra;
    Toekan;
    Neushoornvogel;
    Grijze roodstaartpapegaai;
    Blauwe ara;
    Rode ara;
    Geelvleugelara;
    Hyacintara;
    Molukkenkaketoe;
    Geelkuifkaketoe;
    Lori van de blauwe bergen;
    Humboldt pinguïn;
    Brilpinguïn;
    Ezelspinguïn;
    Koningspinguïn;
    Californische zeeleeuw;
    Grijze zeehond;
    Gewone zeehond;
    Europese otter;
    Reuzenotter;
    Dwergotter;
    Walrus
  `, [3]);

  // ============================================================
  // VRAAG 4 - DIEREN MET VIER POTEN
  // ============================================================

  veiligKoppelenDeel9(`
    Hond;
    Kat;
    Huiskat;
    Konijn;
    Haas;
    Cavia;
    Hamster;
    Goudhamster;
    Roborovskihamster;
    Russische dwerghamster;
    Chinese dwerghamster;
    Gerbil;
    Chinchilla;
    Dego e;
    Degoe;
    Rat;
    Muis;
    Huismuis;
    Bosmuis;
    Veldmuis;
    Woelmuis;
    Eekhoorn;
    Rode eekhoorn;
    Grijze eekhoorn;
    Siberische grondeekhoorn;
    Marmot;
    Prairiehond;
    Bever;
    Muskusrat;
    Beverrat;
    Capibara;
    Mara;
    Paka;
    Agoeti;
    Egel;
    Mol;
    Spitsmuis;
    Waterspitsmuis;
    Olifant;
    Neushoorn;
    Nijlpaard;
    Tapir;
    Paard;
    Pony;
    Ezel;
    Zebra;
    Koe;
    Stier;
    Kalf;
    Geit;
    Schaap;
    Lam;
    Varken;
    Wild zwijn;
    Wrattenzwijn;
    Babiroesa;
    Giraf;
    Okapi;
    Eland;
    Rendier;
    Edelhert;
    Damhert;
    Ree;
    Muntjak;
    Wapiti;
    Antilope;
    Gazelle;
    Impala;
    Koedoe;
    Elandantilope;
    Gnoe;
    Springbok;
    Gems;
    Steenbok;
    Moeflon;
    Bizon;
    Wisent;
    Buffel;
    Jak;
    Takin;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Guanaco;
    Vicuna;
    Leeuw;
    Tijger;
    Jaguar;
    Luipaard;
    Sneeuwluipaard;
    Jachtluipaard;
    Poema;
    Lynx;
    Caracal;
    Serval;
    Ocelot;
    Wolf;
    Coyote;
    Jakhals;
    Vos;
    Poolvos;
    Woestijnvos;
    Grootoorvos;
    Manenwolf;
    Wasbeerhond;
    Hyena;
    Beer;
    IJsbeer;
    Bruine beer;
    Zwarte beer;
    Brilbeer;
    Lippenbeer;
    Maleise beer;
    Reuzenpanda;
    Rode panda;
    Das;
    Otter;
    Wezel;
    Hermelijn;
    Bunzing;
    Fret;
    Boommarter;
    Steenmarter;
    Veelvraat;
    Wasbeer;
    Neusbeer;
    Stokstaartje;
    Mangoeste;
    Wombat;
    Tasmaanse duivel;
    Koala;
    Mierenegel;
    Vogelbekdier;
    Aardvarken;
    Gordeldier;
    Reuzenmiereneter;
    Luiaard;
    Schubdier;
    Krokodil;
    Alligator;
    Kaaiman;
    Gaviaal;
    Hagedis;
    Leguaan;
    Gekko;
    Varaan;
    Kameleon;
    Baardagaam;
    Skink;
    Komodovaraan;
    Groene leguaan;
    Luipaardgekko;
    Wimpergekko;
    Tokkeh;
    Doornduivel;
    Kraaghagedis;
    Gilamonster;
    Brughagedis;
    Landschildpad;
    Waterschildpad;
    Griekse landschildpad;
    Sporenschildpad;
    Kikker;
    Pad;
    Boomkikker;
    Gifkikker;
    Bruine kikker;
    Groene kikker;
    Heikikker;
    Poelkikker;
    Meerkikker;
    Gewone pad;
    Rugstreeppad;
    Salamander;
    Vuursalamander;
    Axolotl;
    Olm;
    Kamsalamander;
    Kleine watersalamander;
    Alpenwatersalamander
  `, [4]);

  veiligVerwijderenDeel9(`
    Hazelworm;
    Slang;
    Python;
    Cobra;
    Adder;
    Wormhagedis;
    Wormsalamander;
    Pootloze hagedis;
    Scheltopusik;
    Brahmaanse blindslang
  `, [4]);

  // ============================================================
  // VRAAG 5 - DIEREN IN AFRIKA
  // ============================================================

  veiligKoppelenDeel9(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Witte neushoorn;
    Zwarte neushoorn;
    Nijlpaard;
    Dwergnijlpaard;
    Giraf;
    Okapi;
    Steppezebra;
    Grévyzebra;
    Bergzebra;
    Afrikaanse wilde ezel;
    Afrikaanse leeuw;
    Jachtluipaard;
    Luipaard;
    Serval;
    Caracal;
    Afrikaanse wilde kat;
    Zwartvoetkat;
    Afrikaanse wilde hond;
    Gevlekte hyena;
    Gestreepte hyena;
    Bruine hyena;
    Aardwolf;
    Fennek;
    Grootoorvos;
    Zadeljakhals;
    Gestreepte jakhals;
    Ethiopische wolf;
    Stokstaartje;
    Dwergmangoeste;
    Zebramangoeste;
    Egyptische mangoeste;
    Civetkat;
    Afrikaanse civetkat;
    Genetkat;
    Honingdas;
    Kaapse buffel;
    Gnoe;
    Blauwe gnoe;
    Zwarte gnoe;
    Impala;
    Springbok;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Bongo;
    Bosbok;
    Elandantilope;
    Reuzenelandantilope;
    Sabelantilope;
    Paardantilope;
    Gemsbok;
    Arabische oryx;
    Addax;
    Dama gazelle;
    Dorcasgazelle;
    Thomson gazelle;
    Grantgazelle;
    Gerenoek;
    Dikdik;
    Steenbokantilope;
    Waterbok;
    Kob;
    Puku;
    Lechwe;
    Sitatoenga;
    Hartebeest;
    Topi;
    Bontebok;
    Blesbok;
    Wrattenzwijn;
    Penseelzwijn;
    Reuzenboszwijn;
    Aardvarken;
    Aardvarken;
    Kaaps stekelvarken;
    Gambiahamsterrat;
    Naakte molrat;
    Kaapse grondeekhoorn;
    Klipdas;
    Olifantspitsmuis;
    Gorilla;
    Chimpansee;
    Bonobo;
    Mandril;
    Drill;
    Mantelbaviaan;
    Gele baviaan;
    Groene baviaan;
    Gelada;
    Groene meerkat;
    Diana-meerkat;
    Huzaaraap;
    Franjeaap;
    Rode franjeaap;
    Ringstaartmaki;
    Vari;
    Rode vari;
    Indri;
    Sifaka;
    Vingerdier;
    Fossa;
    Struisvogel;
    Secretarisvogel;
    Maraboe;
    Schoenbekooievaar;
    Hamerkop;
    Heilige ibis;
    Afrikaanse lepelaar;
    Afrikaanse zeearend;
    Vechtarend;
    Kroonarend;
    Bateleur;
    Kapgier;
    Rüppells gier;
    Oorgier;
    Witkopgier;
    Helmparelhoen;
    Gierparelhoen;
    Kori-trap;
    Hoornraaf;
    Grijze roodstaartpapegaai;
    Senegalpapegaai;
    Perzikkopagapornis;
    Zwartmaskeragapornis;
    Fischeragapornis;
    Brilpinguïn;
    Nijlkrokodil;
    Dwergkrokodil;
    West-Afrikaanse krokodil;
    Nijlvaraan;
    Savannevaraan;
    Witkeelvaraan;
    Pofadder;
    Gabonadder;
    Zwarte mamba;
    Oostelijke groene mamba;
    Westelijke groene mamba;
    Egyptische cobra;
    Kaapse cobra;
    Afrikaanse rotspython;
    Koningspython;
    Panterkameleon;
    Parsonskameleon;
    Jacksonkameleon;
    Afrikaanse klauwkikker;
    Afrikaanse brulkikker;
    Goliathkikker;
    Gouden mantella;
    Woestijnregenkikker;
    Afrikaanse reuzenslak;
    Keizerschorpioen;
    Koningsbavianenspin;
    Oranje bavianenspin
  `, [5]);

  // De Arabische oryx leeft van nature
  // op het Arabisch Schiereiland.

  veiligVerwijderenDeel9(
    "Arabische oryx",
    [5]
  );

  // ============================================================
  // VRAAG 6 - BOSDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Edelhert;
    Ree;
    Damhert;
    Wild zwijn;
    Eland;
    Wisent;
    Rode eekhoorn;
    Grijze eekhoorn;
    Boommarter;
    Das;
    Rode vos;
    Wolf;
    Europese lynx;
    Bruine beer;
    Zwarte beer;
    Veelvraat;
    Bosmuis;
    Rosse woelmuis;
    Hazelmuis;
    Eikelmuis;
    Relmuis;
    Bosspitsmuis;
    Egel;
    Mol;
    Tapir;
    Okapi;
    Bosolifant;
    Afrikaanse bosolifant;
    Gorilla;
    Chimpansee;
    Bonobo;
    Orang-oetan;
    Gibbon;
    Siamang;
    Brulaap;
    Slingeraap;
    Kapucijnaap;
    Luiaard;
    Reuzenpanda;
    Rode panda;
    Binturong;
    Fossa;
    Jaguar;
    Ocelot;
    Poema;
    Tijger;
    Luipaard;
    Nevelpanter;
    Maleise beer;
    Brilbeer;
    Bosuil;
    Ransuil;
    Oehoe;
    Havik;
    Sperwer;
    Wespendief;
    Buizerd;
    Gaai;
    Raaf;
    Zwarte specht;
    Groene specht;
    Grote bonte specht;
    Kleine bonte specht;
    Middelste bonte specht;
    Boomklever;
    Boomkruiper;
    Taigaboomkruiper;
    Koolmees;
    Pimpelmees;
    Zwarte mees;
    Kuifmees;
    Glanskop;
    Matkop;
    Goudhaan;
    Vuurgoudhaan;
    Roodborst;
    Winterkoning;
    Zanglijster;
    Grote lijster;
    Merel;
    Zwartkop;
    Tuinfluiter;
    Fitis;
    Tjiftjaf;
    Fluiter;
    Bonte vliegenvanger;
    Grauwe vliegenvanger;
    Boompieper;
    Houtsnip;
    Fazant;
    Auerhoen;
    Korhoen;
    Hazelhoen;
    Vuursalamander;
    Hazelworm;
    Bruine kikker;
    Gewone pad;
    Gladde slang;
    Zandhagedis;
    Bosmier;
    Rode bosmier;
    Kale bosmier;
    Bossteekmier;
    Schapenteek;
    Vliegend hert;
    Grote eikenboktor;
    Muskusboktor;
    Letterzetter;
    Grote houtwormkever;
    Paarse loopkever;
    Tuinloopkever;
    Oprolmiljoenpoot;
    Kelderpissebed;
    Ruwe pissebed;
    Rode regenworm;
    Wijngaardslak;
    Grote wegslak;
    Tijgerslak
  `, [6]);

  // ============================================================
  // VRAAG 7 - EIERLEGGENDE DIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Vogelbekdier;
    Mierenegel;
    Gewone mierenegel;
    Langsnuitmierenegel;
    Kip;
    Hen;
    Eend;
    Gans;
    Zwaan;
    Kalkoen;
    Kwartel;
    Fazant;
    Parelhoen;
    Pauw;
    Struisvogel;
    Emoe;
    Kasuaris;
    Nandoe;
    Kiwi;
    Papegaai;
    Parkiet;
    Kanarie;
    Zebravink;
    Duif;
    Huismus;
    Merel;
    Koolmees;
    Pimpelmees;
    Roodborst;
    Uil;
    Arend;
    Valk;
    Havik;
    Sperwer;
    Buizerd;
    Kraanvogel;
    Flamingo;
    Pelikaan;
    Pinguïn;
    Aalscholver;
    Zeekoet;
    Papegaaiduiker;
    Krokodil;
    Alligator;
    Kaaiman;
    Gaviaal;
    Schildpad;
    Landschildpad;
    Zeeschildpad;
    Waterschildpad;
    Komodovaraan;
    Nijlvaraan;
    Savannevaraan;
    Groene leguaan;
    Zeeleguaan;
    Baardagaam;
    Luipaardgekko;
    Wimpergekko;
    Tokkeh;
    Panterkameleon;
    Jemenkameleon;
    Korenslang;
    Koningspython;
    Netpython;
    Birmese python;
    Koningscobra;
    Brilslang;
    Zwarte mamba;
    Ringslang;
    Westelijke ringslang;
    Brughagedis;
    Kikker;
    Bruine kikker;
    Groene kikker;
    Boomkikker;
    Heikikker;
    Gewone pad;
    Rugstreeppad;
    Knoflookpad;
    Axolotl;
    Kleine watersalamander;
    Kamsalamander;
    Alpenwatersalamander;
    Kabeljauw;
    Schelvis;
    Koolvis;
    Haring;
    Sardine;
    Ansjovis;
    Makreel;
    Tonijn;
    Zalm;
    Forel;
    Snoek;
    Snoekbaars;
    Baars;
    Karper;
    Goudvis;
    Brasem;
    Voorn;
    Zeelt;
    Steur;
    Schol;
    Tarbot;
    Tong;
    Bot;
    Hondshaai;
    Zebrahaai;
    Bamboehaai;
    Kathaai;
    Octopus;
    Zeekat;
    Inktvis;
    Nautilus;
    Zeeslak;
    Wijngaardslak;
    Segrijnslak;
    Naaktslak;
    Honingbij;
    Hommel;
    Wesp;
    Mier;
    Termiet;
    Vlinder;
    Nachtvlinder;
    Libel;
    Waterjuffer;
    Sprinkhaan;
    Krekel;
    Bidsprinkhaan;
    Wandelende tak;
    Wandelend blad;
    Lieveheersbeestje;
    Meikever;
    Vliegend hert;
    Huisvlieg;
    Steekmug;
    Vlo;
    Hoofdluis;
    Oorworm;
    Zilvervisje;
    Kruisspin;
    Wespspin;
    Vogelspin;
    Wolfspin;
    Springspin;
    Teek;
    Hooiwagen;
    Duizendpoot;
    Miljoenpoot
  `, [7]);

  // Levendbarende dieren niet als eierleggend tellen.

  veiligVerwijderenDeel9(`
    Haan;
    Schorpioen;
    Keizerschorpioen;
    Gewone adder;
    Gladde slang;
    Boa constrictor;
    Groene anaconda;
    Gele anaconda;
    Jacksonkameleon;
    Hazelworm;
    Alpensalamander;
    Guppy;
    Molly;
    Platy;
    Zwaarddrager;
    Witte haai;
    Tijgerhaai;
    Walvishaai;
    Stierhaai;
    Citroenhaai;
    Hamerhaai;
    Dolfijn;
    Orka;
    Walvis;
    Rups
  `, [7]);

  // ============================================================
  // VRAAG 8 - HUISDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Hond;
    Huiskat;
    Konijn;
    Dwergkonijn;
    Cavia;
    Hamster;
    Goudhamster;
    Russische dwerghamster;
    Roborovskihamster;
    Chinese dwerghamster;
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
    Diamantduif;
    Agapornis;
    Fischeragapornis;
    Perzikkopagapornis;
    Zwartmaskeragapornis;
    Bourkeparkiet;
    Catharinaparkiet;
    Turquoisineparkiet;
    Splendidparkiet;
    Neophema;
    Rosella;
    Halsbandparkiet;
    Grijze roodstaartpapegaai;
    Goudvis;
    Sluierstaart;
    Koi;
    Guppy;
    Endlerguppy;
    Molly;
    Platy;
    Zwaarddrager;
    Neon tetra;
    Kardinaaltetra;
    Zwarte neon;
    Roodkopzalm;
    Rouwtetra;
    Citroentetra;
    Kongozalm;
    Keizertetra;
    Vuurneon;
    Zebravis;
    Luipaarddanio;
    Chinese danio;
    Kegelvlekbarbeel;
    Sumatraan;
    Prachtbarbeel;
    Purperkopbarbeel;
    Schuberti;
    Kersenbuikcichlide;
    Maanvis;
    Discusvis;
    Apistogramma;
    Ramirezi;
    Siamese kempvis;
    Dwerggoerami;
    Honinggoerami;
    Diamantgoerami;
    Blauwe goerami;
    Paradijsvis;
    Pantsermeerval;
    Corydoras;
    Ancistrus;
    Otocinclus;
    Kuhli;
    Clownbotia;
    Zebrabotia;
    Axolotl;
    Luipaardgekko;
    Wimpergekko;
    Baardagaam;
    Blauwtongskink;
    Griekse landschildpad;
    Russische vierteenschildpad;
    Korenslang;
    Koningspython;
    Indische wandelende tak;
    Vietnamese wandelende tak;
    Wandelend blad;
    Vuurgarnaal;
    Amanogarnaal;
    Neocaridina;
    Crystal Red-garnaal;
    Appelslak;
    Posthoornslak;
    Poelslak
  `, [8]);

  // ============================================================
  // VRAAG 9 - GROTER DAN EEN MENS
  // ============================================================

  veiligKoppelenDeel9(`
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Giraf;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Nijlpaard;
    Gaur;
    Amerikaanse bizon;
    Europese bizon;
    Kaapse buffel;
    Waterbuffel;
    Jak;
    Eland;
    Kameel;
    Dromedaris;
    IJsbeer;
    Bruine beer;
    Kodiakbeer;
    Walrus;
    Zuidelijke zeeolifant;
    Noordelijke zeeolifant;
    Blauwe vinvis;
    Gewone vinvis;
    Noordse vinvis;
    Bultrug;
    Potvis;
    Groenlandse walvis;
    Noordkaper;
    Zuidkaper;
    Orka;
    Griend;
    Beloega;
    Narwal;
    Tuimelaar;
    Walvishaai;
    Reuzenhaai;
    Witte haai;
    Tijgerhaai;
    Groenlandse haai;
    Grote hamerhaai;
    Reuzenmanta;
    Reuzenoctopus;
    Reuzeninktvis;
    Kolossale inktvis;
    Zeekrokodil;
    Nijlkrokodil;
    Gaviaal;
    Zwarte kaaiman;
    Mississippialligator;
    Komodovaraan;
    Netpython;
    Birmese python;
    Afrikaanse rotspython;
    Groene anaconda;
    Struisvogel;
    Kasuaris
  `, [9]);

  // ============================================================
  // VRAAG 10 - KLEINER DAN EEN MUIS
  // ============================================================

  veiligKoppelenDeel9(`
    Mier;
    Zwarte wegmier;
    Gele weidemier;
    Rode bosmier;
    Kale bosmier;
    Faraomier;
    Argentijnse mier;
    Gewone steekmier;
    Bossteekmier;
    Zandsteekmier;
    Termiet;
    Honingbij;
    Aardhommel;
    Steenhommel;
    Akkerhommel;
    Tuinhommel;
    Boomhommel;
    Gewone wesp;
    Duitse wesp;
    Huisvlieg;
    Fruitvlieg;
    Bromvlieg;
    Zweefvlieg;
    Steekmug;
    Dansmug;
    Motmug;
    Rouwmug;
    Langpootmug;
    Lieveheersbeestje;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Tienstippelig lieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Roomvleklieveheersbeestje;
    Meelworm;
    Graanklander;
    Rijstklander;
    Maisklander;
    Broodkever;
    Tabakskever;
    Museumkever;
    Tapijtkever;
    Taxuskever;
    Appelbloesemkever;
    Aardbeibloesemkever;
    Hazelnootboorder;
    Letterzetter;
    Zilvervisje;
    Papiervisje;
    Ovenvisje;
    Kleine oorworm;
    Gewone oorworm;
    Vlo;
    Kattenvlo;
    Hondenvlo;
    Mensenvlo;
    Hoofdluis;
    Bladluis;
    Groene perzikluis;
    Zwarte bonenluis;
    Witte vlieg;
    Trips;
    Springstaart;
    Teek;
    Schapenteek;
    Huisstofmijt;
    Varroamijt;
    Schurftmijt;
    Oormijt;
    Spintmijt;
    Fluweelmijt;
    Roofmijt;
    Boekenschorpioen;
    Pseudoschorpioen;
    Kruisspin;
    Huiszebraspin;
    Springspin;
    Komkommerspin;
    Krabspin;
    Hangmatspin;
    Kleine trilspin;
    Kogelspin;
    Pissebed;
    Kelderpissebed;
    Ruwe pissebed;
    Gewone oprolpissebed;
    Watervlo;
    Pekelkreeftje;
    Cyclops;
    Beerdiertje;
    Aaltje;
    Azijnaaltje;
    Dwergspitsmuis;
    Etruskische spitsmuis;
    Hommelvleermuis;
    Bijenkolibrie
  `, [10]);

  // ============================================================
  // VRAAG 11 - ZEEDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Walvishaai;
    Reuzenhaai;
    Witte haai;
    Tijgerhaai;
    Blauwe haai;
    Groenlandse haai;
    Hondshaai;
    Verpleegsterhaai;
    Zebrahaai;
    Citroenhaai;
    Makreelhaai;
    Zandhaai;
    Stierhaai;
    Hamerhaai;
    Grote hamerhaai;
    Voshaai;
    Koboldhaai;
    Reuzenbekhaai;
    Franjehaai;
    Wobbegong;
    Engelhaai;
    Doornhaai;
    Zee-engel;
    Reuzenmanta;
    Pijlstaartrog;
    Stekelrog;
    Sterrog;
    Vleet;
    Sidderrog;
    Zaagvis;
    Gitaarrog;
    Kabeljauw;
    Schelvis;
    Wijting;
    Koolvis;
    Pollak;
    Leng;
    Lom;
    Haring;
    Sardine;
    Sprot;
    Ansjovis;
    Makreel;
    Horsmakreel;
    Tonijn;
    Blauwvintonijn;
    Geelvintonijn;
    Zwaardvis;
    Zeilvis;
    Marlijn;
    Barracuda;
    Zeebaars;
    Zeebrasem;
    Dorade;
    Rode poon;
    Grauwe poon;
    Schol;
    Schar;
    Bot;
    Tong;
    Tarbot;
    Griet;
    Heilbot;
    Tongschar;
    Zeeduivel;
    Zeewolf;
    Zeepaardje;
    Zeenaald;
    Zeedraak;
    Clownvis;
    Anemoonvis;
    Doktersvis;
    Blauwe doktersvis;
    Gele doktersvis;
    Keizersvis;
    Koraalvlindervis;
    Koraalduivel;
    Steenvis;
    Pieterman;
    Kogelvis;
    Egelvis;
    Maanvis;
    Mola mola;
    Murene;
    Zeepaling;
    Kongeraal;
    Octopus;
    Reuzenoctopus;
    Blauwringoctopus;
    Kokosnootoctopus;
    Mimic octopus;
    Zeekat;
    Reuzenzeekat;
    Inktvis;
    Reuzeninktvis;
    Kolossale inktvis;
    Nautilus;
    Kwal;
    Oorkwal;
    Kompaskwal;
    Zeepaddenstoel;
    Gele haarkwal;
    Blauwe haarkwal;
    Zeewesp;
    Portugees oorlogsschip;
    Zeeanemoon;
    Paardenanemoon;
    Zeeanjelier;
    Wasroos;
    Zeester;
    Gewone zeester;
    Zonnester;
    Slangster;
    Brokkelster;
    Zee-egel;
    Zeeklit;
    Zanddollar;
    Zeekomkommer;
    Zeelelie;
    Zeespons;
    Mossel;
    Oester;
    Japanse oester;
    Platte oester;
    Kokkel;
    Venusschelp;
    Sint-jakobsschelp;
    Mesheft;
    Noordkromp;
    Strandgaper;
    Nonnetje;
    Wulk;
    Alikruik;
    Patella;
    Kegelslak;
    Zeenaaktslak;
    Zeehaas;
    Krab;
    Noordzeekrab;
    Strandkrab;
    Blauwe zwemkrab;
    Spinkrab;
    Koningskrab;
    Heremietkreeft;
    Europese zeekreeft;
    Amerikaanse zeekreeft;
    Langoest;
    Langoustine;
    Garnaal;
    Noordzeegarnaal;
    Tijgergarnaal;
    Krill;
    Zeepok;
    Eendenmossel;
    Zeepissebed;
    Blauwe vinvis;
    Bultrug;
    Potvis;
    Orka;
    Beloega;
    Narwal;
    Bruinvis;
    Tuimelaar;
    Gewone dolfijn;
    Zeeotter;
    Walrus;
    Zeeluipaard;
    Zeeolifant;
    Grijze zeehond;
    Gewone zeehond;
    Groene zeeschildpad;
    Lederschildpad;
    Karetschildpad;
    Dikkopschildpad;
    Warana;
    Platrugzeeschildpad;
    Zeeslang;
    Geelbuikzeeslang;
    Olijfzeeslang
  `, [11]);

  // Zeedieren kunnen niet allemaal actief zwemmen.
  // Mosselen, koralen en zeepokken krijgen
  // daarom niet automatisch vraag 14.

  // ============================================================
  // VRAAG 12 - JUNGLEDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Jaguar;
    Ocelot;
    Margay;
    Jaguarundi;
    Nevelpanter;
    Tijger;
    Sumatraanse tijger;
    Luipaard;
    Binturong;
    Maleise beer;
    Brilbeer;
    Fossa;
    Gorilla;
    Chimpansee;
    Bonobo;
    Orang-oetan;
    Siamang;
    Gibbon;
    Neusaap;
    Brulaap;
    Slingeraap;
    Kapucijnaap;
    Doodshoofdaapje;
    Tamarin;
    Penseelaapje;
    Gouden leeuwaapje;
    Luiaard;
    Tamandoea;
    Reuzenmiereneter;
    Laaglandtapir;
    Maleise tapir;
    Midden-Amerikaanse tapir;
    Bosolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Dwergnijlpaard;
    Okapi;
    Bongo;
    Babiroesa;
    Agoeti;
    Paka;
    Capibara;
    Toekan;
    Reuzentoekan;
    Arassari;
    Rode ara;
    Blauwe ara;
    Hyacintara;
    Geelvleugelara;
    Grijze roodstaartpapegaai;
    Neushoornvogel;
    Helmneushoornvogel;
    Harpij;
    Filipijnse arend;
    Kasuaris;
    Koningscobra;
    Groene boompython;
    Netpython;
    Boa constrictor;
    Groene anaconda;
    Smaragdboa;
    Regenboogboa;
    Amazoneboomboa;
    Wimperadder;
    Groene palmadder;
    Gabonadder;
    Neushoornadder;
    Groene leguaan;
    Groene boomvaraan;
    Krokodilvaraan;
    Tokkeh;
    Panterkameleon;
    Parsonskameleon;
    Bladstaartgekko;
    Groene basilisk;
    Roodoogmakikikker;
    Melkkikker;
    Glaskikker;
    Gifkikker;
    Verfkikkertje;
    Gouden gifkikker;
    Aardbeigifkikker;
    Geelbandgifkikker;
    Groen-zwarte gifkikker;
    Goliathkikker;
    Gouden mantella;
    Surinaamse pad;
    Goliathvogelspin;
    Bladsnijdersmier;
    Kogelmier;
    Trekmier;
    Wevermier;
    Wandelend blad;
    Orchideebidsprinkhaan
  `, [12]);

  // ============================================================
  // VRAAG 13 - BOERDERIJDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Koe;
    Stier;
    Kalf;
    Melkkoe;
    Vleeskoe;
    Rund;
    Holstein-Friesian;
    Jersey;
    Brown Swiss;
    Ayrshire;
    Guernsey;
    Fries-Hollands;
    Blaarkop;
    Lakenvelder;
    Brandrood rund;
    Maas-Rijn-IJssel;
    Schotse hooglander;
    Galloway;
    Aberdeen Angus;
    Hereford;
    Limousin;
    Charolais;
    Belgisch witblauw;
    Piemontese;
    Blonde d'Aquitaine;
    Dexter;
    Simmentaler;
    Varken;
    Big;
    Zeug;
    Beer;
    Duroc;
    Pietrain;
    Berkshire;
    Tamworth;
    Hampshire;
    Mangalica;
    Kune kune;
    Schaap;
    Ram;
    Lam;
    Texelaar;
    Suffolk;
    Merino;
    Hampshire Down;
    Swifter;
    Zwartbles;
    Drents heideschaap;
    Veluws heideschaap;
    Schoonebeeker;
    Ouessantschaap;
    Soayschaap;
    Geit;
    Bok;
    Dwerggeit;
    Toggenburger;
    Saanengeit;
    Nubische geit;
    Boergeit;
    Angorageit;
    Nederlandse landgeit;
    Paard;
    Pony;
    Veulen;
    Fries paard;
    Groninger paard;
    Haflinger;
    Fjord;
    Shetlandpony;
    Welshpony;
    Tinker;
    Belgisch trekpaard;
    Shire;
    Clydesdale;
    Percheron;
    Ezel;
    Muilezel;
    Muildier;
    Lama;
    Alpaca;
    Waterbuffel;
    Jak;
    Kip;
    Hen;
    Haan;
    Kuiken;
    Leghorn;
    Brahma;
    Sussex;
    Orpington;
    Wyandotte;
    Barnevelder;
    Welsumer;
    Marans;
    Zijdehoen;
    Cochin;
    Hollandse kuifhoen;
    Rhode Island Red;
    Plymouth Rock;
    Eend;
    Pekingeend;
    Muskuseend;
    Indische loopeend;
    Roueneend;
    Cayuga;
    Kwakereend;
    Gans;
    Toulousegans;
    Embdener gans;
    Chinese knobbelgans;
    Pommerse gans;
    Kalkoen;
    Parelhoen;
    Kwartel;
    Japanse kwartel;
    Struisvogel;
    Emoe;
    Konijn;
    Vlaamse reus;
    Franse hangoor;
    Nederlandse hangoordwerg;
    Rexkonijn;
    Angorakonijn;
    Boerenzwaluw;
    Huismus;
    Kerkuil;
    Steenuil;
    Huiszwaluw;
    Witte kwikstaart;
    Spreeuw;
    Boerenkat;
    Bordercollie;
    Australische herder;
    Honingbij
  `, [13]);

  // "Beer" is dubbelzinnig:
  // het kan een mannelijk varken of een
  // beerachtig zoogdier betekenen.
  //
  // De veilige koppelfunctie voorkomt dat
  // twee bestaande records worden vermengd.

  // ============================================================
  // VRAAG 14 - ZWEMMENDE DIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Hond;
    Labrador;
    Golden retriever;
    Newfoundlander;
    Portugese waterhond;
    Spaanse waterhond;
    Poedel;
    Otter;
    Europese otter;
    Reuzenotter;
    Dwergotter;
    Zeeotter;
    Bever;
    Europese bever;
    Canadese bever;
    Muskusrat;
    Beverrat;
    Capibara;
    Vogelbekdier;
    Waterspitsmuis;
    IJsbeer;
    Bruine beer;
    Tijger;
    Jaguar;
    Olifant;
    Aziatische olifant;
    Afrikaanse savanneolifant;
    Wild zwijn;
    Eland;
    Rendier;
    Tapir;
    Eend;
    Gans;
    Zwaan;
    Meerkoet;
    Waterhoen;
    Fuut;
    Dodaars;
    Geoorde fuut;
    Roodhalsfuut;
    Aalscholver;
    Kuifaalscholver;
    Pelikaan;
    Papegaaiduiker;
    Alk;
    Zeekoet;
    Pinguïn;
    Keizerspinguïn;
    Koningspinguïn;
    Brilpinguïn;
    Humboldt pinguïn;
    Ezelspinguïn;
    Krokodil;
    Alligator;
    Kaaiman;
    Gaviaal;
    Zeeleguaan;
    Nijlvaraan;
    Aziatische watervaraan;
    Mertens watervaraan;
    Groene anaconda;
    Gele anaconda;
    Ringslang;
    Gevlekte ringslang;
    Westelijke ringslang;
    Zeeslang;
    Waterschildpad;
    Zeeschildpad;
    Groene zeeschildpad;
    Lederschildpad;
    Karetschildpad;
    Dikkopschildpad;
    Europese moerasschildpad;
    Roodwangschildpad;
    Geelwangschildpad;
    Geelbuikschildpad;
    Muskusschildpad;
    Matamata;
    Varkensneusschildpad;
    Kikker;
    Bruine kikker;
    Groene kikker;
    Meerkikker;
    Poelkikker;
    Bastaardkikker;
    Afrikaanse klauwkikker;
    Axolotl;
    Olm;
    Kleine watersalamander;
    Kamsalamander;
    Alpenwatersalamander;
    Vinpootsalamander;
    Walrus;
    Zeehond;
    Zeeleeuw;
    Zeeolifant;
    Zeeluipaard;
    Walvis;
    Dolfijn;
    Orka;
    Bruinvis;
    Narwal;
    Beloega;
    Doegong;
    Lamantijn;
    Octopus;
    Zeekat;
    Inktvis;
    Nautilus;
    Garnaal;
    Krill;
    Watervlo;
    Rugzwemmer;
    Geelgerande watertor;
    Duikerwants;
    Zwemkrab;
    Blauwe zwemkrab
  `, [14]);

  // ============================================================
  // VRAAG 15 - INSECTENETERS
  // ============================================================

  veiligKoppelenDeel9(`
    Reuzenmiereneter;
    Tamandoea;
    Dwergmiereneter;
    Aardvarken;
    Schubdier;
    Mierenegel;
    Aardwolf;
    Stokstaartje;
    Fennek;
    Grootoorvos;
    Egel;
    Mol;
    Spitsmuis;
    Dwergspitsmuis;
    Bosspitsmuis;
    Huisspitsmuis;
    Waterspitsmuis;
    Olifantspitsmuis;
    Tenrek;
    Goudmol;
    Gordeldier;
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Rosse vleermuis;
    Laatvlieger;
    Watervleermuis;
    Meervleermuis;
    Franjestaart;
    Grootoorvleermuis;
    Baardvleermuis;
    Grote hoefijzerneus;
    Kleine hoefijzerneus;
    Boerenzwaluw;
    Huiszwaluw;
    Oeverzwaluw;
    Gierzwaluw;
    Nachtzwaluw;
    Bijeneter;
    Hop;
    Koekoek;
    Roodborst;
    Winterkoning;
    Heggenmus;
    Koolmees;
    Pimpelmees;
    Kuifmees;
    Zwarte mees;
    Matkop;
    Glanskop;
    Staartmees;
    Goudhaan;
    Vuurgoudhaan;
    Boomklever;
    Boomkruiper;
    Zwarte specht;
    Groene specht;
    Grote bonte specht;
    Kleine bonte specht;
    Draaihals;
    Zwartkop;
    Tuinfluiter;
    Grasmus;
    Braamsluiper;
    Fitis;
    Tjiftjaf;
    Fluiter;
    Bonte vliegenvanger;
    Grauwe vliegenvanger;
    Kleine vliegenvanger;
    Rietzanger;
    Bosrietzanger;
    Kleine karekiet;
    Grote karekiet;
    Snor;
    Sprinkhaanzanger;
    Cetti's zanger;
    Blauwborst;
    Nachtegaal;
    Gekraagde roodstaart;
    Zwarte roodstaart;
    Witte kwikstaart;
    Gele kwikstaart;
    Grote gele kwikstaart;
    Boompieper;
    Graspieper;
    Roodborsttapuit;
    Paapje;
    Tapuit;
    Kameleon;
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Gekko;
    Luipaardgekko;
    Tokkeh;
    Muurgekko;
    Baardagaam;
    Doornduivel;
    Zandhagedis;
    Muurhagedis;
    Levendbarende hagedis;
    Groene hagedis;
    Hazelworm;
    Kikker;
    Bruine kikker;
    Heikikker;
    Boomkikker;
    Roodoogmakikikker;
    Gifkikker;
    Gewone pad;
    Rugstreeppad;
    Vuursalamander;
    Kamsalamander;
    Kleine watersalamander;
    Lieveheersbeestje;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Bidsprinkhaan;
    Orchideebidsprinkhaan;
    Libel;
    Waterjuffer;
    Grote keizerlibel;
    Blauwe glazenmaker;
    Kruisspin;
    Wespspin;
    Wolfspin;
    Springspin;
    Vogelspin;
    Schorpioen;
    Duizendpoot;
    Huisscolopender
  `, [15]);

  // ============================================================
  // VRAAG 16 - PLANTENETERS
  // ============================================================

  veiligKoppelenDeel9(`
    Koe;
    Rund;
    Schaap;
    Geit;
    Paard;
    Pony;
    Ezel;
    Zebra;
    Giraf;
    Okapi;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Guanaco;
    Vicuna;
    Olifant;
    Neushoorn;
    Nijlpaard;
    Tapir;
    Bizon;
    Wisent;
    Buffel;
    Jak;
    Gaur;
    Banteng;
    Takin;
    Muskusos;
    Eland;
    Rendier;
    Edelhert;
    Damhert;
    Ree;
    Wapiti;
    Sikahert;
    Axishert;
    Muntjak;
    Gnoe;
    Impala;
    Springbok;
    Gazelle;
    Koedoe;
    Oryx;
    Gemsbok;
    Elandantilope;
    Sabelantilope;
    Paardantilope;
    Bongo;
    Nyala;
    Bosbok;
    Waterbok;
    Lechwe;
    Sitatoenga;
    Puku;
    Hartebeest;
    Topi;
    Dikdik;
    Steenbok;
    Gems;
    Moeflon;
    Konijn;
    Haas;
    Sneeuwhaas;
    Cavia;
    Capibara;
    Chinchilla;
    Degoe;
    Mara;
    Agoeti;
    Paka;
    Bever;
    Beverrat;
    Muskusrat;
    Stekelvarken;
    Prairiehond;
    Marmot;
    Koala;
    Wombat;
    Kangoeroe;
    Wallaby;
    Quokka;
    Boomkangoeroe;
    Reuzenpanda;
    Rode panda;
    Drievingerige luiaard;
    Tweevingerige luiaard;
    Doegong;
    Lamantijn;
    Groene leguaan;
    Zeeleguaan;
    Blauwe leguaan;
    Neushoornleguaan;
    Woestijnleguaan;
    Chuckwalla;
    Stekelstaartagaam;
    Landschildpad;
    Griekse landschildpad;
    Russische vierteenschildpad;
    Sporenschildpad;
    Luipaardschildpad;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Sprinkhaan;
    Wandelende tak;
    Wandelend blad;
    Bladluis;
    Taxuskever;
    Coloradokever;
    Rups;
    Zeekoe;
    Graskarper
  `, [16]);

  // ============================================================
  // VRAAG 17 - DIEREN DIE ANDERE DIEREN ETEN
  // ============================================================

  veiligKoppelenDeel9(`
    Leeuw;
    Tijger;
    Luipaard;
    Jaguar;
    Poema;
    Jachtluipaard;
    Lynx;
    Caracal;
    Serval;
    Ocelot;
    Margay;
    Nevelpanter;
    Sneeuwluipaard;
    Wolf;
    Coyote;
    Jakhals;
    Afrikaanse wilde hond;
    Dingo;
    Vos;
    Poolvos;
    Hyena;
    IJsbeer;
    Bruine beer;
    Zwarte beer;
    Das;
    Wezel;
    Hermelijn;
    Bunzing;
    Fret;
    Otter;
    Zeeotter;
    Veelvraat;
    Boommarter;
    Steenmarter;
    Honingdas;
    Stokstaartje;
    Mangoeste;
    Tasmaanse duivel;
    Fossa;
    Arend;
    Havik;
    Sperwer;
    Buizerd;
    Valk;
    Torenvalk;
    Slechtvalk;
    Uil;
    Kerkuil;
    Bosuil;
    Steenuil;
    Oehoe;
    Ransuil;
    Sneeuwuil;
    Visarend;
    Zeearend;
    IJsvogel;
    Blauwe reiger;
    Purperreiger;
    Zilverreiger;
    Ooievaar;
    Lepelaar;
    Aalscholver;
    Pelikaan;
    Jan-van-gent;
    Pinguïn;
    Papegaaiduiker;
    Zeekoet;
    Alk;
    Visdief;
    Stern;
    Krokodil;
    Alligator;
    Kaaiman;
    Gaviaal;
    Komodovaraan;
    Nijlvaraan;
    Slang;
    Python;
    Boa;
    Anaconda;
    Cobra;
    Mamba;
    Adder;
    Ratelslang;
    Koraalslang;
    Ringslang;
    Kikker;
    Pad;
    Salamander;
    Witte haai;
    Tijgerhaai;
    Stierhaai;
    Hamerhaai;
    Groenlandse haai;
    Hondshaai;
    Makreelhaai;
    Snoek;
    Snoekbaars;
    Baars;
    Piranha;
    Barracuda;
    Tonijn;
    Makreel;
    Zwaardvis;
    Marlijn;
    Zeeduivel;
    Murene;
    Orka;
    Potvis;
    Dolfijn;
    Bruinvis;
    Zeehond;
    Zeeleeuw;
    Zeeluipaard;
    Walrus;
    Octopus;
    Zeekat;
    Inktvis;
    Zeester;
    Kwal;
    Zeeanemoon;
    Spin;
    Schorpioen;
    Duizendpoot;
    Bidsprinkhaan;
    Libel;
    Lieveheersbeestje
  `, [17]);

  // Insecten zijn ook dieren.
  // Insecteneters mogen daarom eveneens
  // bij vraag 17 worden geaccepteerd.

  for (const record of database.values()) {
    if (record.vragen.has(15)) {
      record.vragen.add(17);
    }
  }

  // ============================================================
  // VRAAG 18 - DIEREN MET EEN STAART
  // ============================================================

  veiligKoppelenDeel9(`
    Hond;
    Kat;
    Leeuw;
    Tijger;
    Jaguar;
    Luipaard;
    Jachtluipaard;
    Poema;
    Lynx;
    Serval;
    Caracal;
    Ocelot;
    Wolf;
    Vos;
    Poolvos;
    Woestijnvos;
    Coyote;
    Jakhals;
    Hyena;
    Wasbeer;
    Neusbeer;
    Rode panda;
    Reuzenpanda;
    Eekhoorn;
    Muis;
    Rat;
    Gerbil;
    Chinchilla;
    Degoe;
    Hamster;
    Konijn;
    Haas;
    Bever;
    Beverrat;
    Muskusrat;
    Capibara;
    Stekelvarken;
    Mol;
    Spitsmuis;
    Otter;
    Wezel;
    Hermelijn;
    Fret;
    Bunzing;
    Das;
    Boommarter;
    Steenmarter;
    Veelvraat;
    Stokstaartje;
    Mangoeste;
    Paard;
    Ezel;
    Zebra;
    Koe;
    Buffel;
    Bizon;
    Schaap;
    Geit;
    Varken;
    Wild zwijn;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Giraf;
    Okapi;
    Olifant;
    Neushoorn;
    Nijlpaard;
    Tapir;
    Rendier;
    Eland;
    Ree;
    Edelhert;
    Kangoeroe;
    Wallaby;
    Quokka;
    Tasmaanse duivel;
    Vogelbekdier;
    Reuzenmiereneter;
    Gordeldier;
    Schubdier;
    Ringstaartmaki;
    Vari;
    Brulaap;
    Slingeraap;
    Kapucijnaap;
    Doodshoofdaapje;
    Baviaan;
    Mandril;
    Neusaap;
    Krokodil;
    Alligator;
    Kaaiman;
    Gaviaal;
    Slang;
    Varaan;
    Leguaan;
    Gekko;
    Kameleon;
    Skink;
    Hagedis;
    Hazelworm;
    Salamander;
    Axolotl;
    Olm;
    Schildpad;
    Walvis;
    Dolfijn;
    Orka;
    Haai;
    Rog;
    Zeepaardje;
    Kabeljauw;
    Karper;
    Goudvis;
    Zalm;
    Forel
  `, [18]);

  veiligVerwijderenDeel9(`
    Gorilla;
    Chimpansee;
    Bonobo;
    Orang-oetan;
    Gibbon;
    Siamang;
    Kikker;
    Pad;
    Boomkikker;
    Gifkikker;
    Gewone pad;
    Bruine kikker;
    Groene kikker
  `, [18]);

  // ============================================================
  // VRAAG 19 - DIEREN MET HOORNS
  // ============================================================

  veiligKoppelenDeel9(`
    Koe;
    Rund;
    Stier;
    Schotse hooglander;
    Lakenvelder;
    Watusirund;
    Longhorn;
    Buffel;
    Kaapse buffel;
    Waterbuffel;
    Anoa;
    Laaglandanoa;
    Berganoa;
    Gaur;
    Banteng;
    Jak;
    Bizon;
    Wisent;
    Muskusos;
    Schaap;
    Moeflon;
    Argali;
    Dikhoornschaap;
    Dalls schaap;
    Sneeuwschaap;
    Oerial;
    Geit;
    Steenbok;
    Alpensteenbok;
    Nubische steenbok;
    Siberische steenbok;
    Spaanse steenbok;
    Markhoor;
    Bezoargeit;
    Gems;
    Takin;
    Goral;
    Serow;
    Japanse serow;
    Antilope;
    Impala;
    Springbok;
    Gnoe;
    Blauwe gnoe;
    Zwarte gnoe;
    Grote koedoe;
    Kleine koedoe;
    Nyala;
    Bongo;
    Bosbok;
    Elandantilope;
    Reuzenelandantilope;
    Oryx;
    Gemsbok;
    Addax;
    Arabische oryx;
    Sabelantilope;
    Paardantilope;
    Hartebeest;
    Topi;
    Bontebok;
    Blesbok;
    Waterbok;
    Kob;
    Puku;
    Lechwe;
    Sitatoenga;
    Dikdik;
    Duiker;
    Klipspringer;
    Gerenoek;
    Saiga;
    Tibetaanse antilope;
    Zwartbok;
    Thomson gazelle;
    Grantgazelle;
    Dorcasgazelle;
    Damagazelle;
    Kropgazelle;
    Neushoorn;
    Witte neushoorn;
    Zwarte neushoorn;
    Indische neushoorn;
    Javaanse neushoorn;
    Sumatraanse neushoorn
  `, [19]);

  // Hoorns en geweien zijn verschillende structuren.
  // Daarom geen automatische koppeling van herten.

  veiligVerwijderenDeel9(`
    Edelhert;
    Damhert;
    Ree;
    Eland;
    Rendier;
    Wapiti;
    Sikahert;
    Axishert;
    Reuzenhert
  `, [19]);

  // ============================================================
  // VRAAG 20 - DIEREN MET EEN VACHT
  // ============================================================

  veiligKoppelenDeel9(`
    Hond;
    Kat;
    Konijn;
    Haas;
    Cavia;
    Hamster;
    Gerbil;
    Muis;
    Rat;
    Chinchilla;
    Degoe;
    Eekhoorn;
    Marmot;
    Prairiehond;
    Bever;
    Beverrat;
    Muskusrat;
    Mol;
    Spitsmuis;
    Leeuw;
    Tijger;
    Luipaard;
    Jaguar;
    Poema;
    Jachtluipaard;
    Lynx;
    Sneeuwluipaard;
    Serval;
    Caracal;
    Ocelot;
    Wolf;
    Vos;
    Poolvos;
    Fennek;
    Coyote;
    Jakhals;
    Manenwolf;
    Dingo;
    Hyena;
    IJsbeer;
    Bruine beer;
    Zwarte beer;
    Brilbeer;
    Lippenbeer;
    Maleise beer;
    Reuzenpanda;
    Rode panda;
    Wasbeer;
    Neusbeer;
    Rolstaartbeer;
    Binturong;
    Wezel;
    Hermelijn;
    Bunzing;
    Fret;
    Das;
    Otter;
    Zeeotter;
    Boommarter;
    Steenmarter;
    Veelvraat;
    Stokstaartje;
    Mangoeste;
    Paard;
    Pony;
    Ezel;
    Zebra;
    Koe;
    Schaap;
    Geit;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Guanaco;
    Vicuna;
    Jak;
    Bizon;
    Wisent;
    Muskusos;
    Rendier;
    Eland;
    Edelhert;
    Damhert;
    Ree;
    Giraf;
    Okapi;
    Tapir;
    Kangoeroe;
    Wallaby;
    Quokka;
    Wombat;
    Koala;
    Tasmaanse duivel;
    Gorilla;
    Chimpansee;
    Bonobo;
    Orang-oetan;
    Gibbon;
    Siamang;
    Maki;
    Ringstaartmaki;
    Vari;
    Sifaka;
    Baviaan;
    Mandril;
    Brulaap;
    Slingeraap;
    Kapucijnaap;
    Doodshoofdaapje;
    Tamarin;
    Penseelaapje;
    Reuzenmiereneter;
    Luiaard;
    Vogelbekdier;
    Gewone zeehond;
    Grijze zeehond;
    Noordelijke pelsrob;
    Vleerhond;
    Vleermuis
  `, [20]);

  veiligVerwijderenDeel9(`
    Naakte molrat;
    Nijlpaard;
    Walvis;
    Dolfijn;
    Orka;
    Schubdier
  `, [20]);

  // ============================================================
  // VRAAG 21 - DIEREN MET SCHUBBEN
  // ============================================================

  veiligKoppelenDeel9(`
    Slang;
    Adder;
    Cobra;
    Python;
    Boa;
    Anaconda;
    Ratelslang;
    Ringslang;
    Gladde slang;
    Mamba;
    Koraalslang;
    Zeeslang;
    Hagedis;
    Hazelworm;
    Varaan;
    Komodovaraan;
    Leguaan;
    Groene leguaan;
    Zeeleguaan;
    Gekko;
    Luipaardgekko;
    Wimpergekko;
    Tokkeh;
    Kameleon;
    Baardagaam;
    Skink;
    Doornduivel;
    Kraaghagedis;
    Gilamonster;
    Krokodil;
    Alligator;
    Kaaiman;
    Gaviaal;
    Schubdier;
    Chinees schubdier;
    Indisch schubdier;
    Reuzenschubdier;
    Boomschubdier;
    Karper;
    Goudvis;
    Koi;
    Brasem;
    Voorn;
    Ruisvoorn;
    Zeelt;
    Graskarper;
    Snoek;
    Baars;
    Snoekbaars;
    Zalm;
    Forel;
    Haring;
    Sardine;
    Ansjovis;
    Makreel;
    Tonijn;
    Kabeljauw;
    Schelvis;
    Wijting;
    Koolvis;
    Zeebaars;
    Dorade;
    Barracuda;
    Clownvis;
    Anemoonvis;
    Doktersvis;
    Guppy;
    Molly;
    Platy;
    Zwaarddrager;
    Siamese kempvis;
    Maanvis;
    Discusvis;
    Zebravis;
    Piranha;
    Arowana
  `, [21]);

  // De lederschildpad heeft geen normaal
  // hard schild met hoornplaten.

  // ============================================================
  // VRAAG 22 - DIEREN MET VEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Vogel;
    Huismus;
    Ringmus;
    Koolmees;
    Pimpelmees;
    Merel;
    Spreeuw;
    Roodborst;
    Winterkoning;
    Vink;
    Groenling;
    Putter;
    Goudvink;
    Kraai;
    Raaf;
    Ekster;
    Gaai;
    Kauw;
    Roek;
    Specht;
    Duif;
    Houtduif;
    Tortelduif;
    Zw aluw;
    Zwaluw;
    Gierzwaluw;
    Uil;
    Bosuil;
    Kerkuil;
    Steenuil;
    Ransuil;
    Sneeuwuil;
    Oehoe;
    Arend;
    Havik;
    Sperwer;
    Buizerd;
    Valk;
    Torenvalk;
    Slechtvalk;
    Eend;
    Gans;
    Zwaan;
    Fuut;
    Dodaars;
    Meerkoet;
    Waterhoen;
    Reiger;
    Ooievaar;
    Lepelaar;
    Flamingo;
    Pelikaan;
    Aalscholver;
    Jan-van-gent;
    Meeuw;
    Stern;
    Papegaaiduiker;
    Zeekoet;
    Alk;
    Pinguïn;
    Keizerspinguïn;
    Koningspinguïn;
    Brilpinguïn;
    Ezelspinguïn;
    Struisvogel;
    Emoe;
    Nandoe;
    Kasuaris;
    Kiwi;
    Kakapo;
    Kip;
    Haan;
    Hen;
    Kuiken;
    Kalkoen;
    Kwartel;
    Fazant;
    Pauw;
    Parelhoen;
    Papegaai;
    Ara;
    Kaketoe;
    Grasparkiet;
    Valkparkiet;
    Kanarie;
    Zebravink;
    Kolibrie;
    Toekan;
    Neushoornvogel;
    IJsvogel;
    Bijeneter;
    Hop;
    Koekoek;
    Secretarisvogel;
    Maraboe;
    Schoenbekooievaar
  `, [22]);

  // ============================================================
  // VRAAG 23 - DIEREN IN AUSTRALIË
  // ============================================================

  veiligKoppelenDeel9(`
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Wallaroe;
    Bennettwallaby;
    Moeraswallaby;
    Parmawallaby;
    Tammarwallaby;
    Quokka;
    Boomkangoeroe;
    Koala;
    Gewone wombat;
    Zuidelijke breedneuswombat;
    Noordelijke breedneuswombat;
    Tasmaanse duivel;
    Gevlekte buidelmarter;
    Oostelijke buidelmarter;
    Noordelijke buidelmarter;
    Numbat;
    Bilby;
    Grote bilby;
    Bandicoot;
    Langneusbandicoot;
    Suikereekhoorn;
    Grote suikereekhoorn;
    Vederstaartbuidelmuis;
    Buidelmuis;
    Ringstaartbuidelrat;
    Voskoesoe;
    Vogelbekdier;
    Gewone mierenegel;
    Dingo;
    Australische water rat;
    Australische waterrat;
    Emoe;
    Helmkasuaris;
    Kookaburra;
    Blauwvleugelkookaburra;
    Liervogel;
    Prachtliervogel;
    Grasparkiet;
    Valkparkiet;
    Roze kaketoe;
    Geelkuifkaketoe;
    Palm kaketoe;
    Palmkaketoe;
    Inkapapegaai;
    Regenbooglori;
    Prachtrosella;
    Pennantrosella;
    Bourkeparkiet;
    Splendidparkiet;
    Turquoisineparkiet;
    Zebravink;
    Gouldamadine;
    Diamantvink;
    Diamantduif;
    Australische pelikaan;
    Zwarte zwaan;
    Australische ibis;
    Australische slangenhalsvogel;
    Wigstaartarend;
    Australische boomvalk;
    Australische ekster;
    Zwarte currawong;
    Bonte kraaivogel;
    Prieelvogel;
    Satijnblauwe prieelvogel;
    Australische witte ibis;
    Zeekrokodil;
    Australische zoetwaterkrokodil;
    Inlandtaipan;
    Kusttaipan;
    Centrale taipan;
    Oostelijke bruine slang;
    Tijgerslang;
    Mulgaslang;
    Roodbuikzwarte slang;
    Woma-python;
    Zwartkoppython;
    Tapijtpython;
    Diamantpython;
    Kinderpython;
    Dwergpython;
    Olijfpython;
    Waterpython;
    Perentie;
    Zandvaraan;
    Bonte varaan;
    Argusvaraan;
    Stekelstaartvaraan;
    Doornduivel;
    Kraaghagedis;
    Baardagaam;
    Dwergbaardagaam;
    Australische wateragaam;
    Dennenappelskink;
    Oostelijke blauwtongskink;
    Westelijke blauwtongskink;
    Australische dikstaartgekko;
    Gladde knobbelstaartgekko;
    Ruwe knobbelstaartgekko;
    Australische groene boomkikker;
    Australische reuzenboomkikker;
    Bruine boomkikker;
    Perons boomkikker;
    Schildkikker;
    Kruiskikker;
    Australische waterhoudende kikker;
    Platrugzeeschildpad;
    Sydneytrechterspin;
    Roodrugspin;
    Pauwspin;
    Maratus volans;
    Maratus speciosus;
    Bulldogmier;
    Myrmecia pilosula;
    Australische wandelende tak;
    Dryococelus australis;
    Macropanesthia rhinoceros;
    Megascolides australis
  `, [23]);

  // ============================================================
  // VRAAG 24 - DIEREN IN KOUDE GEBIEDEN
  // ============================================================

  veiligKoppelenDeel9(`
    IJsbeer;
    Poolvos;
    Poolwolf;
    Rendier;
    Kariboe;
    Muskusos;
    Sneeuwhaas;
    Poolhaas;
    Lemming;
    Halsbandlemming;
    Siberische lemming;
    Veelvraat;
    Eland;
    Sneeuwluipaard;
    Siberische tijger;
    Siberische wezel;
    Hermelijn;
    Canadese lynx;
    Europese lynx;
    Bruine beer;
    Kodiakbeer;
    Jak;
    Wilde jak;
    Tibetaanse antilope;
    Tibetaanse gazelle;
    Alpensteenbok;
    Siberische steenbok;
    Gems;
    Alpenmarmot;
    Pika;
    Amerikaanse fluithaas;
    Walrus;
    Narwal;
    Beloega;
    Groenlandse walvis;
    Groenlandse haai;
    Ringelrob;
    Baardrob;
    Zadelrob;
    Klapmuts;
    Weddellzeehond;
    Krabbeneter;
    Zeeluipaard;
    Zuidelijke zeeolifant;
    Keizerspinguïn;
    Adéliepinguïn;
    Kinbandpinguïn;
    Ezelspinguïn;
    Koningspinguïn;
    Sneeuwuil;
    Alpensneeuwhoen;
    Moerassneeuwhoen;
    Sneeuwgors;
    IJsgors;
    Poolstern;
    Ivoormeeuw;
    Burgemeester;
    Grote burgemeester;
    Kleine burgemeester;
    Drieteenmeeuw;
    Kleine alk;
    Zeekoet;
    Dikbekzeekoet;
    Papegaaiduiker;
    Eidereend;
    Koningseider;
    IJseend;
    Sneeuwgans;
    Brandgans;
    Rotgans;
    Wilde zwaan;
    Kleine zwaan;
    Raaf;
    Taigagaai;
    Notenkraker;
    Witbandkruisbek;
    Siberische salamander
  `, [24]);

  // ============================================================
  // VRAAG 25 - WOESTIJNDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Dromedaris;
    Wilde kameel;
    Fennek;
    Woestijnvos;
    Rüppells vos;
    Kitvos;
    Grootoorvos;
    Zandkat;
    Caracal;
    Gestreepte hyena;
    Dorcasgazelle;
    Damagazelle;
    Addax;
    Arabische oryx;
    Gemsbok;
    Gerenoek;
    Nubische steenbok;
    Afrikaanse wilde ezel;
    Onager;
    Kulan;
    Kangoeroerat;
    Springmuis;
    Grote springmuis;
    Kleine springmuis;
    Gerbil;
    Mongoolse gerbil;
    Woestijnhamster;
    Naakte molrat;
    Woestijnegel;
    Grootooregel;
    Grote bilby;
    Numbat;
    Rode reuzenkangoeroe;
    Struisvogel;
    Kraagtrap;
    Houbara;
    Renkoekoek;
    Woestijntapuit;
    Woestijnleeuwerik;
    Renvogel;
    Zandhoen;
    Kroon-zandhoen;
    Hoornadder;
    Sahara-zandadder;
    Arabische hoornadder;
    Sidewinder;
    Mojaveratelslang;
    Dwergpofadder;
    Inlandtaipan;
    Woestijndoodsadder;
    Woma-python;
    Zwartkoppython;
    Keniaanse zandboa;
    Indische zandboa;
    Woestijnvaraan;
    Perentie;
    Zandvaraan;
    Doornduivel;
    Woestijnleguaan;
    Chuckwalla;
    Gilamonster;
    Egyptische stekelstaartagaam;
    Marokkaanse stekelstaartagaam;
    Geyrs stekelstaartagaam;
    Zandvis;
    Webvoetgekko;
    Woestijngekko;
    Woestijnhoornhagedis;
    Texaanse hoornhagedis;
    Koninklijke hoornhagedis;
    Woestijnschildpad;
    Sonorawoestijnschildpad;
    Egyptische landschildpad;
    Woestijnregenkikker;
    Hadrurus arizonensis;
    Androctonus australis;
    Leiurus quinquestriatus;
    Galeodes arabs;
    Kameelspin;
    Cataglyphis bombycina;
    Honingpotmier;
    Myrmecocystus mexicanus;
    Onymacris unguicularis;
    Onymacris plana
  `, [25]);

  // ============================================================
  // VRAAG 26 - WILDE DIEREN IN NEDERLAND
  // ============================================================

  veiligKoppelenDeel9(`
    Ree;
    Edelhert;
    Damhert;
    Wild zwijn;
    Vos;
    Wolf;
    Goudjakhals;
    Das;
    Otter;
    Bever;
    Boommarter;
    Steenmarter;
    Wezel;
    Hermelijn;
    Bunzing;
    Egel;
    Mol;
    Konijn;
    Haas;
    Rode eekhoorn;
    Bosmuis;
    Huismuis;
    Dwergmuis;
    Veldmuis;
    Aardmuis;
    Rosse woelmuis;
    Noordse woelmuis;
    Woelrat;
    Ondergrondse woelmuis;
    Bruine rat;
    Zwarte rat;
    Muskusrat;
    Beverrat;
    Bosspitsmuis;
    Dwergspitsmuis;
    Huisspitsmuis;
    Waterspitsmuis;
    Veldspitsmuis;
    Tweekleurige bosspitsmuis;
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Kleine dwergvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Bosvleermuis;
    Watervleermuis;
    Meervleermuis;
    Franjestaart;
    Baardvleermuis;
    Brandts vleermuis;
    Gewone grootoorvleermuis;
    Grijze grootoorvleermuis;
    Ingekorven vleermuis;
    Bechsteins vleermuis;
    Huismus;
    Ringmus;
    Koolmees;
    Pimpelmees;
    Staartmees;
    Kuifmees;
    Zwarte mees;
    Glanskop;
    Matkop;
    Merel;
    Zanglijster;
    Koperwiek;
    Kramsvogel;
    Grote lijster;
    Spreeuw;
    Roodborst;
    Winterkoning;
    Heggenmus;
    Vink;
    Keep;
    Groenling;
    Putter;
    Kneu;
    Sijs;
    Goudvink;
    Appelvink;
    Geelgors;
    Rietgors;
    Roodborsttapuit;
    Paapje;
    Tapuit;
    Graspieper;
    Boompieper;
    Veldleeuwerik;
    Boomleeuwerik;
    Gele kwikstaart;
    Witte kwikstaart;
    Grote gele kwikstaart;
    Fitis;
    Tjiftjaf;
    Fluiter;
    Zwartkop;
    Tuinfluiter;
    Grasmus;
    Braamsluiper;
    Kleine karekiet;
    Grote karekiet;
    Bosrietzanger;
    Rietzanger;
    Sprinkhaanzanger;
    Nachtegaal;
    Blauwborst;
    Gekraagde roodstaart;
    Zwarte roodstaart;
    Bonte vliegenvanger;
    Grauwe vliegenvanger;
    Goudhaan;
    Vuurgoudhaan;
    Boomklever;
    Boomkruiper;
    Gaai;
    Ekster;
    Kauw;
    Roek;
    Raaf;
    Zwarte kraai;
    Grote bonte specht;
    Kleine bonte specht;
    Middelste bonte specht;
    Groene specht;
    Zwarte specht;
    Boerenzwaluw;
    Huiszwaluw;
    Oeverzwaluw;
    Gierzwaluw;
    IJsvogel;
    Koekoek;
    Houtduif;
    Holenduif;
    Turkse tortel;
    Zomertortel;
    Buizerd;
    Havik;
    Sperwer;
    Wespendief;
    Zeearend;
    Torenvalk;
    Slechtvalk;
    Boomvalk;
    Kerkuil;
    Bosuil;
    Steenuil;
    Ransuil;
    Velduil;
    Oehoe;
    Blauwe reiger;
    Purperreiger;
    Grote zilverreiger;
    Kleine zilverreiger;
    Lepelaar;
    Ooievaar;
    Roerdomp;
    Woudaap;
    Wilde eend;
    Krakeend;
    Smient;
    Slobeend;
    Wintertaling;
    Zomertaling;
    Pijlstaart;
    Kuifeend;
    Tafeleend;
    Bergeend;
    Eidereend;
    Grauwe gans;
    Brandgans;
    Rotgans;
    Kolgans;
    Canadese gans;
    Nijlgans;
    Knobbelzwaan;
    Wilde zwaan;
    Kleine zwaan;
    Meerkoet;
    Waterhoen;
    Waterral;
    Fuut;
    Dodaars;
    Geoorde fuut;
    Aalscholver;
    Zilvermeeuw;
    Kokmeeuw;
    Stormmeeuw;
    Kleine mantelmeeuw;
    Grote mantelmeeuw;
    Visdief;
    Grote stern;
    Dwergstern;
    Scholekster;
    Kievit;
    Grutto;
    Tureluur;
    Wulp;
    Regenwulp;
    Watersnip;
    Houtsnip;
    Kluut;
    Bontbekplevier;
    Kleine plevier;
    Strandplevier;
    Goudplevier;
    Zilverplevier;
    Kanoet;
    Bonte strandloper;
    Drieteenstrandloper;
    Steenloper;
    Kemphaan;
    Fazant;
    Patrijs;
    Kwartel;
    Adder;
    Gladde slang;
    Westelijke ringslang;
    Hazelworm;
    Zandhagedis;
    Levendbarende hagedis;
    Muurhagedis;
    Bruine kikker;
    Heikikker;
    Poelkikker;
    Meerkikker;
    Bastaardkikker;
    Boomkikker;
    Gewone pad;
    Rugstreeppad;
    Knoflookpad;
    Vroedmeesterpad;
    Geelbuikvuurpad;
    Vuursalamander;
    Kleine watersalamander;
    Kamsalamander;
    Vinpootsalamander;
    Alpenwatersalamander;
    Snoek;
    Snoekbaars;
    Baars;
    Pos;
    Karper;
    Brasem;
    Kolblei;
    Blankvoorn;
    Ruisvoorn;
    Zeelt;
    Winde;
    Alver;
    Bittervoorn;
    Riviergrondel;
    Kleine modderkruiper;
    Grote modderkruiper;
    Bermpje;
    Driedoornige stekelbaars;
    Tiendoornige stekelbaars;
    Paling;
    Europese meerval;
    Rivierprik;
    Beekprik;
    Zeeprik;
    Atlantische zalm;
    Beekforel;
    Zeeforel;
    Spiering;
    Bot;
    Schol;
    Schar;
    Tong;
    Tarbot;
    Griet;
    Kabeljauw;
    Wijting;
    Haring;
    Sprot;
    Makreel;
    Zeebaars;
    Rode poon;
    Kleine pieterman;
    Hondshaai;
    Stekelrog;
    Bruinvis;
    Grijze zeehond;
    Gewone zeehond;
    Noordzeekrab;
    Strandkrab;
    Noordzeegarnaal;
    Europese zeekreeft;
    Mossel;
    Kokkel;
    Japanse oester;
    Platte oester;
    Wulk;
    Alikruik;
    Gewone zeester;
    Zeeklit;
    Oorkwal;
    Kompaskwal;
    Zeepaddenstoel
  `, [26]);

  // ============================================================
  // VRAAG 27 - DIEREN DIE JE 'S NACHTS KUNT TEGENKOMEN
  // ============================================================

  veiligKoppelenDeel9(`
    Egel;
    Das;
    Vos;
    Wolf;
    Wild zwijn;
    Ree;
    Edelhert;
    Boommarter;
    Steenmarter;
    Bunzing;
    Wezel;
    Hermelijn;
    Otter;
    Bever;
    Wasbeer;
    Wasbeerhond;
    Bosmuis;
    Huismuis;
    Bruine rat;
    Zwarte rat;
    Hamster;
    Goudhamster;
    Hazelmuis;
    Relmuis;
    Eikelmuis;
    Chinchilla;
    Vleermuis;
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Watervleermuis;
    Meervleermuis;
    Grootoorvleermuis;
    Vampiervleermuis;
    Vleerhond;
    Aardvarken;
    Schubdier;
    Fennek;
    Zandkat;
    Ocelot;
    Margay;
    Luipaard;
    Jaguar;
    Tijger;
    Hyena;
    Aardwolf;
    Galago;
    Lori;
    Plompe lori;
    Spookdiertje;
    Vingerdier;
    Tasmaanse duivel;
    Wombat;
    Koala;
    Kiwi;
    Kakapo;
    Kerkuil;
    Bosuil;
    Ransuil;
    Steenuil;
    Oehoe;
    Nachtzwaluw;
    Roerdomp;
    Houtsnip;
    Luipaardgekko;
    Wimpergekko;
    Tokkeh;
    Muurgekko;
    Koningspython;
    Regenboogboa;
    Groene boompython;
    Gewone krait;
    Gebande krait;
    Vuursalamander;
    Gewone pad;
    Rugstreeppad;
    Knoflookpad;
    Roodoogmakikikker;
    Goliathvogelspin;
    Vogelspin;
    Schorpioen;
    Keizerschorpioen;
    Zweepspin;
    Zweepschorpioen;
    Oorworm;
    Kakkerlak;
    Zilvervisje;
    Papiervisje;
    Ovenvisje;
    Nachtvlinder;
    Doodshoofdvlinder;
    Grote beer;
    Witte hermelijnvlinder;
    Ligusterpijlstaart;
    Pauwoogpijlstaart;
    Avondrood;
    Grote wegslak;
    Spaanse wegslak;
    Tijgerslak;
    Regenworm;
    Gewone regenworm
  `, [27]);

  // ============================================================
  // VRAAG 28 - WINTERSLAAP EN WINTERRUST
  // ============================================================

  veiligKoppelenDeel9(`
    Egel;
    Europese egel;
    Noordelijke witborstegel;
    Zuidelijke witborstegel;
    Alpenmarmot;
    Bosmarmot;
    Geelbuikmarmot;
    Hoary marmot;
    Olympische marmot;
    Siberische marmot;
    Zwartkopmarmot;
    Langstaartmarmot;
    Vancouvermarmot;
    Hazelmuis;
    Relmuis;
    Eikelmuis;
    Bosrelmuis;
    Europese hamster;
    Siberische grondeekhoorn;
    Europese grondeekhoorn;
    Arctische grondeekhoorn;
    Dertienstrepige grondeekhoorn;
    Goudmantelgrondeekhoorn;
    Gewone dwergvleermuis;
    Ruige dwergvleermuis;
    Laatvlieger;
    Rosse vleermuis;
    Watervleermuis;
    Meervleermuis;
    Franjestaart;
    Baardvleermuis;
    Gewone grootoorvleermuis;
    Grijze grootoorvleermuis;
    Grote hoefijzerneus;
    Kleine hoefijzerneus;
    Bruine beer;
    Amerikaanse zwarte beer;
    Ringslang;
    Westelijke ringslang;
    Gewone adder;
    Gladde slang;
    Hazelworm;
    Zandhagedis;
    Levendbarende hagedis;
    Muurhagedis;
    Griekse landschildpad;
    Moorse landschildpad;
    Russische vierteenschildpad;
    Europese moerasschildpad;
    Bruine kikker;
    Heikikker;
    Boomkikker;
    Gewone pad;
    Rugstreeppad;
    Knoflookpad;
    Vuursalamander;
    Kleine watersalamander;
    Kamsalamander;
    Alpenwatersalamander;
    Vinpootsalamander
  `, [28]);

  // Niet kunstmatig tot 1000 uitbreiden.
  // Winterslaap is een specifieke biologische
  // eigenschap en geldt niet voor elk dier
  // dat tijdens de winter minder actief is.

  // ============================================================
  // VRAAG 29 - SNELLE DIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Jachtluipaard;
    Gaffelbok;
    Springbok;
    Thomson gazelle;
    Grantgazelle;
    Impala;
    Gnoe;
    Blauwe gnoe;
    Leeuw;
    Zebra;
    Paard;
    Arabisch volbloed;
    Engels volbloed;
    Quarter horse;
    Struisvogel;
    Emoe;
    Nandoe;
    Rode reuzenkangoeroe;
    Grijze reuzenkangoeroe;
    Haas;
    Europese haas;
    Sneeuwhaas;
    Windhond;
    Greyhound;
    Whippet;
    Saluki;
    Afghaanse windhond;
    Wolf;
    Afrikaanse wilde hond;
    Coyote;
    Poema;
    Jaguar;
    Slechtvalk;
    Gierzwaluw;
    Boomvalk;
    Steenarend;
    Giervalk;
    Zeilvis;
    Zwaardvis;
    Marlijn;
    Blauwvintonijn;
    Geelvintonijn;
    Makreelhaai;
    Witte haai;
    Barracuda;
    Orka;
    Tuimelaar;
    Gewone dolfijn;
    Spinnerdolfijn;
    Grote keizerlibel;
    Blauwe glazenmaker;
    Zwarte mamba;
    Perentie;
    Zesstreepracerunner;
    Tijgerzandloopkever
  `, [29]);

  // ============================================================
  // VRAAG 30 - LANGZAME DIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Luiaard;
    Tweevingerige luiaard;
    Drievingerige luiaard;
    Bradypus variegatus;
    Bradypus tridactylus;
    Bradypus torquatus;
    Bradypus pygmaeus;
    Choloepus didactylus;
    Choloepus hoffmanni;
    Koala;
    Plompe lori;
    Grote plompe lori;
    Kleine plompe lori;
    Landschildpad;
    Griekse landschildpad;
    Moorse landschildpad;
    Russische vierteenschildpad;
    Luipaardschildpad;
    Sporenschildpad;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Kameleon;
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Parsonskameleon;
    Slak;
    Huisjesslak;
    Wijngaardslak;
    Segrijnslak;
    Afrikaanse reuzenslak;
    Gewone tuinslak;
    Witgerande tuinslak;
    Naaktslak;
    Grote wegslak;
    Spaanse wegslak;
    Tijgerslak;
    Bananenslak;
    Zeenaaktslak;
    Zeehaas;
    Zeester;
    Gewone zeester;
    Zonnester;
    Zee-egel;
    Zeekomkommer;
    Zeepaardje;
    Miljoenpoot;
    Oprolmiljoenpoot
  `, [30]);

  // ============================================================
  // VRAAG 31 - DIEREN DIE IN BOMEN LEVEN
  // ============================================================

  veiligKoppelenDeel9(`
    Rode eekhoorn;
    Grijze eekhoorn;
    Vliegende eekhoorn;
    Grote vliegende eekhoorn;
    Suikereekhoorn;
    Vederstaartbuidelmuis;
    Voskoesoe;
    Ringstaartbuidelrat;
    Boomkangoeroe;
    Koala;
    Luiaard;
    Tweevingerige luiaard;
    Drievingerige luiaard;
    Boommarter;
    Rode panda;
    Binturong;
    Rolstaartbeer;
    Vliegende maki;
    Orang-oetan;
    Gibbon;
    Siamang;
    Brulaap;
    Slingeraap;
    Kapucijnaap;
    Doodshoofdaapje;
    Gouden leeuwaapje;
    Penseelaapje;
    Tamarin;
    Keizertamarin;
    Neusaap;
    Franjeaap;
    Colobus;
    Maki;
    Vari;
    Rode vari;
    Indri;
    Sifaka;
    Vingerdier;
    Galago;
    Plompe lori;
    Spookdiertje;
    Groene boompython;
    Smaragdboa;
    Amazoneboomboa;
    Groene wijnslang;
    Groene liaanslang;
    Boomslang;
    Groene bosadder;
    Wimperadder;
    Groene palmadder;
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Parsonskameleon;
    Groene boomvaraan;
    Blauwe boomvaraan;
    Zwarte boomvaraan;
    Krokodilvaraan;
    Groene leguaan;
    Groene boomskink;
    Grijpstaartskink;
    Wimpergekko;
    Bladstaartgekko;
    Satanische bladstaartgekko;
    Grote madagaskardaggekko;
    Goudstofdaggekko;
    Tokkeh;
    Groene anolis;
    Ridderanolis;
    Vliegende draak;
    Boomkikker;
    Roodoogmakikikker;
    Melkkikker;
    Glaskikker;
    Waskikker;
    Reuzenmakikikker;
    Australische groene boomkikker;
    Australische reuzenboomkikker;
    Wevermier;
    Oecophylla smaragdina;
    Oecophylla longinoda;
    Cephalotes atratus;
    Wandelend blad
  `, [31]);

  // ============================================================
  // VRAAG 32 - DIEREN DIE ONDER DE GROND LEVEN
  // ============================================================

  veiligKoppelenDeel9(`
    Mol;
    Europese mol;
    Stermol;
    Goudmol;
    Buidelmol;
    Naakte molrat;
    Damaralandmolrat;
    Kaapse molrat;
    Blindmuis;
    Ondergrondse woelmuis;
    Woelrat;
    Veldmuis;
    Aardmuis;
    Europese hamster;
    Prairiehond;
    Zwartstaartprairiehond;
    Witstaartprairiehond;
    Gunnisonprairiehond;
    Utahprairiehond;
    Mexicaanse prairiehond;
    Europese grondeekhoorn;
    Siberische grondeekhoorn;
    Arctische grondeekhoorn;
    Dertienstrepige grondeekhoorn;
    Alpenmarmot;
    Bosmarmot;
    Konijn;
    Das;
    Wombat;
    Gewone wombat;
    Grote bilby;
    Aardvarken;
    Stokstaartje;
    Gordeldier;
    Negenbandgordeldier;
    Reuzengordeldier;
    Holenuil;
    Papegaaiduiker;
    Brahmaanse blindslang;
    Europese blindslang;
    Wormslang;
    Wormhagedis;
    Witte wormhagedis;
    Iberische wormhagedis;
    Mexicaanse molhagedis;
    Wormsalamander;
    Ringwormsalamander;
    Mexicaanse wormsalamander;
    Paarse kikker;
    Woestijnregenkikker;
    Zwarte regenkikker;
    Schildkikker;
    Knoflookpad;
    Spaanse knoflookpad;
    Syrische knoflookpad;
    Regenworm;
    Gewone regenworm;
    Rode regenworm;
    Tijgerworm;
    Aporrectodea longa;
    Aporrectodea caliginosa;
    Aporrectodea rosea;
    Allolobophora chlorotica;
    Megascolides australis;
    Microchaetus rappi;
    Rhinodrilus alatus;
    Aaltje;
    Geophilus flavus;
    Geophilus electricus;
    Geophilus truncorum;
    Stigmatogaster subterranea;
    Blaniulus guttulatus;
    Protura;
    Diplura;
    Symphyla;
    Engerling;
    Ritnaald;
    Veenmol;
    Gele weidemier;
    Zwarte wegmier;
    Messor barbarus;
    Honingpotmier;
    Bladsnijdersmier;
    Reticulitermes flavipes;
    Reticulitermes lucifugus;
    Trapdoorspin;
    Blauwe kobaltvogelspin;
    Koningsbavianenspin
  `, [32]);

  // ============================================================
  // VRAAG 33 - DIEREN MET EEN SCHILD
  // ============================================================

  veiligKoppelenDeel9(`
    Schildpad;
    Landschildpad;
    Waterschildpad;
    Zeeschildpad;
    Griekse landschildpad;
    Moorse landschildpad;
    Russische vierteenschildpad;
    Breedrandschildpad;
    Egyptische landschildpad;
    Luipaardschildpad;
    Sporenschildpad;
    Stralenschildpad;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Roodvoetschildpad;
    Geelvoetschildpad;
    Indische sterschildpad;
    Birmese sterschildpad;
    Pannenkoekschildpad;
    Spinschildpad;
    Platstaartschildpad;
    Woestijnschildpad;
    Gopherschildpad;
    Texaanse schildpad;
    Europese moerasschildpad;
    Roodwangschildpad;
    Geelwangschildpad;
    Geelbuikschildpad;
    Muskusschildpad;
    Alligatorschildpad;
    Bijtschildpad;
    Matamata;
    Chinese driekielschildpad;
    Chinese gestreepte schildpad;
    Japanse vijverschildpad;
    Spaanse beekschildpad;
    Balkanbeekschildpad;
    Kaspische beekschildpad;
    Druppelschildpad;
    Blandingschildpad;
    Maleise doosschildpad;
    Amerikaanse doosschildpad;
    Chinese doosschildpad;
    Driebanddoosschildpad;
    Groene zeeschildpad;
    Karetschildpad;
    Dikkopschildpad;
    Warana;
    Kemps zeeschildpad;
    Platrugzeeschildpad;
    Gordeldier;
    Negenbandgordeldier;
    Driebandgordeldier;
    Zesbandgordeldier;
    Reuzengordeldier;
    Roze gordeldier;
    Armadillohagedis;
    Gordelstaarthagedis;
    Reuzengordelstaarthagedis;
    Gewone oprolpissebed;
    Oprolmiljoenpoot;
    Glyptodon;
    Doedicurus;
    Panochthus
  `, [33]);

  // Herstel koppelingen die door de brede
  // slakkencorrectie in deel 7 verloren
  // kunnen zijn gegaan.

  veiligKoppelenDeel9(`
    Chelonoidis porteri;
    Chelonoidis becki;
    Chelonoidis hoodensis;
    Chelonoidis darwini;
    Chelonoidis chathamensis;
    Chelonoidis vandenburghi;
    Chelonoidis microphyes;
    Chelonoidis guntheri;
    Chelonoidis vicina
  `, [33]);

  // ============================================================
  // VRAAG 34 - SPRINGENDE DIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Kangoeroe;
    Rode reuzenkangoeroe;
    Oostelijke grijze reuzenkangoeroe;
    Westelijke grijze reuzenkangoeroe;
    Wallaby;
    Bennettwallaby;
    Moeraswallaby;
    Tammarwallaby;
    Quokka;
    Boomkangoeroe;
    Konijn;
    Haas;
    Sneeuwhaas;
    Poolhaas;
    Springmuis;
    Kangoeroerat;
    Gerbil;
    Eekhoorn;
    Rode eekhoorn;
    Grijze eekhoorn;
    Siberische grondeekhoorn;
    Impala;
    Springbok;
    Gazelle;
    Gems;
    Steenbok;
    Paard;
    Pony;
    Kat;
    Huiskat;
    Leeuw;
    Tijger;
    Jaguar;
    Luipaard;
    Jachtluipaard;
    Poema;
    Lynx;
    Caracal;
    Serval;
    Vos;
    Hond;
    Wolf;
    Ringstaartmaki;
    Sifaka;
    Galago;
    Spookdiertje;
    Kapucijnaap;
    Slingeraap;
    Gibbon;
    Siamang;
    Kikker;
    Boomkikker;
    Bruine kikker;
    Groene kikker;
    Heikikker;
    Meerkikker;
    Poelkikker;
    Bastaardkikker;
    Goliathkikker;
    Afrikaanse brulkikker;
    Roodoogmakikikker;
    Gifkikker;
    Gouden gifkikker;
    Verfkikkertje;
    Aardbeigifkikker;
    Sprinkhaan;
    Treksprinkhaan;
    Woestijnsprinkhaan;
    Krekel;
    Huiskrekel;
    Veldkrekel;
    Sabelsprinkhaan;
    Grote groene sabelsprinkhaan;
    Wrattenbijter;
    Vlo;
    Kattenvlo;
    Hondenvlo;
    Mensenvlo;
    Springstaart;
    Springspin;
    Huiszebraspin;
    Pauwspin;
    Phidippus regius;
    Phidippus audax;
    Harpegnathos saltator
  `, [34]);

  // ============================================================
  // VRAAG 35 - KLIMMENDE DIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Kat;
    Huiskat;
    Luipaard;
    Jaguar;
    Poema;
    Lynx;
    Ocelot;
    Margay;
    Nevelpanter;
    Rode panda;
    Reuzenpanda;
    Bruine beer;
    Zwarte beer;
    Maleise beer;
    Brilbeer;
    Wasbeer;
    Neusbeer;
    Rolstaartbeer;
    Binturong;
    Boommarter;
    Steenmarter;
    Veelvraat;
    Eekhoorn;
    Rode eekhoorn;
    Grijze eekhoorn;
    Vliegende eekhoorn;
    Suikereekhoorn;
    Koala;
    Boomkangoeroe;
    Luiaard;
    Orang-oetan;
    Gorilla;
    Chimpansee;
    Bonobo;
    Gibbon;
    Siamang;
    Brulaap;
    Slingeraap;
    Kapucijnaap;
    Doodshoofdaapje;
    Ringstaartmaki;
    Sifaka;
    Galago;
    Spookdiertje;
    Vingerdier;
    Steenbok;
    Alpensteenbok;
    Gems;
    Markhoor;
    Berggeit;
    Sneeuwgeit;
    Takin;
    Goral;
    Serow;
    Groene boompython;
    Smaragdboa;
    Amazoneboomboa;
    Boomslang;
    Esculaapslang;
    Korenslang;
    Rattenslang;
    Groene leguaan;
    Groene boomvaraan;
    Blauwe boomvaraan;
    Kameleon;
    Gekko;
    Wimpergekko;
    Tokkeh;
    Muurgekko;
    Daggekko;
    Bladstaartgekko;
    Groene anolis;
    Groene basilisk;
    Boomkikker;
    Roodoogmakikikker;
    Melkkikker;
    Europese boomkikker;
    Australische groene boomkikker;
    Mier;
    Wevermier;
    Wandelende tak;
    Wandelend blad;
    Bidsprinkhaan;
    Kruisspin;
    Springspin;
    Huiszebraspin;
    Wijngaardslak;
    Segrijnslak;
    Gewone tuinslak
  `, [35]);

  // ============================================================
  // VRAAG 36 - DIEREN MET EEN LANGE NEK
  // ============================================================

  veiligKoppelenDeel9(`
    Giraf;
    Noordelijke giraf;
    Zuidelijke giraf;
    Netgiraf;
    Masaigiraf;
    Rothschildgiraf;
    Angolagiraf;
    Kordofangiraf;
    Nubische giraf;
    West-Afrikaanse giraf;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Guanaco;
    Vicuna;
    Struisvogel;
    Emoe;
    Nandoe;
    Kasuaris;
    Flamingo;
    Grote flamingo;
    Chileense flamingo;
    Kleine flamingo;
    Andesflamingo;
    Jamesflamingo;
    Kraanvogel;
    Grijze kraanvogel;
    Japanse kraanvogel;
    Siberische kraanvogel;
    Paradijskraanvogel;
    Jufferkraanvogel;
    Kroonkraanvogel;
    Blauwe reiger;
    Purperreiger;
    Grote zilverreiger;
    Kleine zilverreiger;
    Koereiger;
    Goliathreiger;
    Grote blauwe reiger;
    Ooievaar;
    Zwarte ooievaar;
    Maraboe;
    Zadelbekooievaar;
    Schoenbekooievaar;
    Lepelaar;
    Afrikaanse lepelaar;
    Roze lepelaar;
    Zwarte zwaan;
    Knobbelzwaan;
    Wilde zwaan;
    Kleine zwaan;
    Zwarthalszwaan;
    Trompetzwaan;
    Aalscholver;
    Slangenhalsvogel;
    Australische slangenhalsvogel;
    Afrikaanse slangenhalsvogel;
    Australische slangenhalsschildpad;
    Slangenhalsschildpad;
    Diplodocus;
    Brontosaurus;
    Apatosaurus;
    Brachiosaurus;
    Giraffatitan;
    Sauroposeidon;
    Mamenchisaurus;
    Argentinosaurus;
    Patagotitan;
    Supersaurus;
    Barosaurus;
    Erketu;
    Elasmosaurus;
    Plesiosaurus;
    Tanystropheus;
    Paraceratherium
  `, [36]);

  // ============================================================
  // VRAAG 37 - RIVIERDIEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Snoek;
    Snoekbaars;
    Baars;
    Pos;
    Karper;
    Brasem;
    Kolblei;
    Blankvoorn;
    Ruisvoorn;
    Winde;
    Alver;
    Barbeel;
    Kopvoorn;
    Serpeling;
    Sneep;
    Riviergrondel;
    Witvingrondel;
    Roofblei;
    Bittervoorn;
    Bermpje;
    Kleine modderkruiper;
    Grote modderkruiper;
    Europese meerval;
    Paling;
    Atlantische zalm;
    Beekforel;
    Regenboogforel;
    Zeeprik;
    Rivierprik;
    Beekprik;
    Europese steur;
    Sterlet;
    Belugasteur;
    Siberische steur;
    Atlantische steur;
    Arapaima;
    Arowana;
    Piranha;
    Rode piranha;
    Pacu;
    Sidderaal;
    Tijgervis;
    Goliathtijgervis;
    Nijlbaars;
    Afrikaanse longvis;
    Australische longvis;
    Zuid-Amerikaanse longvis;
    Mekongreuzenmeerval;
    Panga;
    Redtail catfish;
    Tijgershovelnosemeerval;
    Olifantsvis;
    Congo zalm;
    Kongozalm;
    Clownbotia;
    Amazone-rivierdolfijn;
    Gangesdolfijn;
    Indusdolfijn;
    Irrawaddydolfijn;
    Afrikaanse lamantijn;
    Amazonezeekoe;
    Nijlpaard;
    Capibara;
    Europese otter;
    Reuzenotter;
    Dwergotter;
    Europese bever;
    Canadese bever;
    Vogelbekdier;
    Waterspitsmuis;
    Nijlkrokodil;
    Gaviaal;
    Brilkaaiman;
    Zwarte kaaiman;
    Mississippialligator;
    Australische zoetwaterkrokodil;
    Afrikaanse pantserkrokodil;
    Chinese reuzensalamander;
    Japanse reuzensalamander;
    Groene anaconda;
    Gevlekte ringslang;
    Nijlvaraan;
    Aziatische watervaraan;
    Rivierkreeft;
    Europese rivierkreeft;
    Amerikaanse rivierkreeft;
    Gevlekte Amerikaanse rivierkreeft;
    Rode Amerikaanse rivierkreeft;
    Signaalkreeft;
    Chinese wolhandkrab;
    Zoetwaterpissebed;
    Zoetwatergarnaal;
    Riviermossel;
    Driehoeksmossel;
    Quaggamossel;
    Zwanenmossel;
    Schildersmossel
  `, [37]);

  // ============================================================
  // VRAAG 38 - DIEREN IN MEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Snoek;
    Snoekbaars;
    Baars;
    Pos;
    Karper;
    Brasem;
    Kolblei;
    Blankvoorn;
    Ruisvoorn;
    Zeelt;
    Winde;
    Alver;
    Bittervoorn;
    Kleine modderkruiper;
    Grote modderkruiper;
    Europese meerval;
    Paling;
    Spiering;
    Houting;
    Marene;
    Kleine marene;
    Meerforel;
    Regenboogforel;
    Bronforel;
    Meerzalm;
    Driedoornige stekelbaars;
    Tiendoornige stekelbaars;
    Nijlbaars;
    Nijltilapia;
    Mozambiquetilapia;
    Kaaiman;
    Mississippialligator;
    Chinese alligator;
    Nijlkrokodil;
    Nijlpaard;
    Capibara;
    Otter;
    Europese bever;
    Canadese bever;
    Muskusrat;
    Beverrat;
    Baikalrob;
    Kaspische rob;
    Saimaa-ringelrob;
    Meerkikker;
    Groene kikker;
    Afrikaanse klauwkikker;
    Axolotl;
    Europese moerasschildpad;
    Roodwangschildpad;
    Geelbuikschildpad;
    Muskusschildpad;
    Bijtschildpad;
    Watervlo;
    Cyclops;
    Zoetwaterpissebed;
    Europese rivierkreeft;
    Signaalkreeft;
    Rode Amerikaanse rivierkreeft;
    Driehoeksmossel;
    Quaggamossel;
    Zwanenmossel;
    Schildersmossel;
    Poelslak;
    Posthoornslak;
    Moerasslak
  `, [38]);

  // ============================================================
  // VRAAG 39 - DIEREN OP HET STRAND
  // ============================================================

  veiligKoppelenDeel9(`
    Zilvermeeuw;
    Kokmeeuw;
    Stormmeeuw;
    Grote mantelmeeuw;
    Kleine mantelmeeuw;
    Drieteenmeeuw;
    Scholekster;
    Drieteenstrandloper;
    Bonte strandloper;
    Kanoet;
    Steenloper;
    Strandplevier;
    Bontbekplevier;
    Zilverplevier;
    Wulp;
    Regenwulp;
    Rosse grutto;
    Tureluur;
    Kluut;
    Grote stern;
    Visdief;
    Dwergstern;
    Gewone zeehond;
    Grijze zeehond;
    Walrus;
    Zeeleeuw;
    Zeeolifant;
    Zeeluipaard;
    Brilpinguïn;
    Humboldt pinguïn;
    Galapagospinguïn;
    Groene zeeschildpad;
    Lederschildpad;
    Karetschildpad;
    Dikkopschildpad;
    Warana;
    Kemps zeeschildpad;
    Platrugzeeschildpad;
    Zeeleguaan;
    Strandkrab;
    Noordzeekrab;
    Heremietkreeft;
    Blauwe zwemkrab;
    Wenkerkrab;
    Spookkrab;
    Kokoskrab;
    Zandkrab;
    Strandvlo;
    Zeepissebed;
    Ligia oceanica;
    Tylos europaeus;
    Wadpier;
    Zeeduizendpoot;
    Schelpkokerworm;
    Mossel;
    Kokkel;
    Oester;
    Japanse oester;
    Platte oester;
    Strandgaper;
    Mesheft;
    Amerikaanse zwaardschede;
    Nonnetje;
    Wulk;
    Alikruik;
    Purperslak;
    Patella;
    Gewone zeester;
    Slangster;
    Zee-egel;
    Zeeklit;
    Zanddollar;
    Oorkwal;
    Kompaskwal;
    Zeepaddenstoel;
    Blauwe haarkwal;
    Gele haarkwal
  `, [39]);

  // ============================================================
  // VRAAG 40 - DIEREN DIE IN GROEPEN LEVEN
  // ============================================================

  veiligKoppelenDeel9(`
    Leeuw;
    Afrikaanse leeuw;
    Aziatische leeuw;
    Wolf;
    Grijze wolf;
    Afrikaanse wilde hond;
    Gevlekte hyena;
    Stokstaartje;
    Zebramangoeste;
    Dwergmangoeste;
    Prairiehond;
    Capibara;
    Olifant;
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Zebra;
    Steppezebra;
    Gnoe;
    Impala;
    Springbok;
    Gazelle;
    Rendier;
    Kariboe;
    Bizon;
    Wisent;
    Waterbuffel;
    Kaapse buffel;
    Muskusos;
    Schaap;
    Geit;
    Paard;
    Koe;
    Dromedaris;
    Lama;
    Alpaca;
    Kangoeroe;
    Rode reuzenkangoeroe;
    Gorilla;
    Chimpansee;
    Bonobo;
    Baviaan;
    Mandril;
    Gelada;
    Franjeaap;
    Ringstaartmaki;
    Sifaka;
    Kapucijnaap;
    Doodshoofdaapje;
    Brulaap;
    Slingeraap;
    Orka;
    Tuimelaar;
    Gewone dolfijn;
    Spinnerdolfijn;
    Griend;
    Beloega;
    Narwal;
    Potvis;
    Walrus;
    Zeeleeuw;
    Pelsrob;
    Zeeolifant;
    Pinguïn;
    Keizerspinguïn;
    Koningspinguïn;
    Brilpinguïn;
    Flamingo;
    Grote flamingo;
    Kleine flamingo;
    Spreeuw;
    Kauw;
    Roek;
    Huismus;
    Ringmus;
    Zebravink;
    Grasparkiet;
    Valkparkiet;
    Grauwe gans;
    Brandgans;
    Rotgans;
    Kolgans;
    Sneeuwgans;
    Kraanvogel;
    Aalscholver;
    Pelikaan;
    Papegaaiduiker;
    Jan-van-gent;
    Zeekoet;
    Alk;
    Haring;
    Sardine;
    Ansjovis;
    Sprot;
    Makreel;
    Horsmakreel;
    Tonijn;
    Neon tetra;
    Kardinaaltetra;
    Zebravis;
    Piranha;
    Honingbij;
    Aardhommel;
    Steenhommel;
    Akkerhommel;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Mier;
    Termiet;
    Trekmier;
    Bladsnijdersmier;
    Wevermier;
    Rode bosmier;
    Kale bosmier;
    Zwarte wegmier;
    Gele weidemier;
    Faraomier;
    Argentijnse mier;
    Rode vuurmier;
    Kogelmier;
    Bulldogmier;
    Honingpotmier
  `, [40]);

  // ============================================================
  // VRAAG 41 - DIEREN DIE NESTEN BOUWEN
  // ============================================================

  veiligKoppelenDeel9(`
    Huismus;
    Ringmus;
    Koolmees;
    Pimpelmees;
    Zwarte mees;
    Kuifmees;
    Staartmees;
    Merel;
    Zanglijster;
    Grote lijster;
    Roodborst;
    Winterkoning;
    Heggenmus;
    Vink;
    Groenling;
    Putter;
    Sijs;
    Kneu;
    Goudvink;
    Appelvink;
    Geelgors;
    Rietgors;
    Spreeuw;
    Ekster;
    Gaai;
    Kauw;
    Roek;
    Raaf;
    Zwarte kraai;
    Boomklever;
    Boomkruiper;
    Boerenzwaluw;
    Huiszwaluw;
    Gierzwaluw;
    Fitis;
    Tjiftjaf;
    Fluiter;
    Zwartkop;
    Tuinfluiter;
    Grasmus;
    Kleine karekiet;
    Grote karekiet;
    Bosrietzanger;
    Rietzanger;
    Nachtegaal;
    Blauwborst;
    Gekraagde roodstaart;
    Bonte vliegenvanger;
    Grauwe vliegenvanger;
    Goudhaan;
    Vuurgoudhaan;
    Ooievaar;
    Zwarte ooievaar;
    Blauwe reiger;
    Purperreiger;
    Grote zilverreiger;
    Kleine zilverreiger;
    Lepelaar;
    Flamingo;
    Roze pelikaan;
    Kroeskoppelikaan;
    Fuut;
    Dodaars;
    Meerkoet;
    Waterhoen;
    Wilde eend;
    Grauwe gans;
    Brandgans;
    Knobbelzwaan;
    Zwarte zwaan;
    Kraanvogel;
    Buizerd;
    Havik;
    Sperwer;
    Steenarend;
    Zeearend;
    Visarend;
    Harpij;
    Houtduif;
    Turkse tortel;
    Zomertortel;
    Wevervogel;
    Maskerwever;
    Bayawever;
    Republikeinwever;
    Roodbekwever;
    Buidelmees;
    Timalia;
    Kleermakersvogel;
    Ovenvogel;
    Prieelvogel;
    Satijnblauwe prieelvogel;
    Kolibrie;
    Bijenkolibrie;
    Zebravink;
    Kanarie;
    Gouldamadine;
    Gorilla;
    Chimpansee;
    Bonobo;
    Orang-oetan;
    Rode eekhoorn;
    Grijze eekhoorn;
    Hazelmuis;
    Dwergmuis;
    Honingbij;
    Hommel;
    Aardhommel;
    Steenhommel;
    Akkerhommel;
    Gewone wesp;
    Duitse wesp;
    Hoornaar;
    Mier;
    Rode bosmier;
    Kale bosmier;
    Zwarte wegmier;
    Gele weidemier;
    Bladsnijdersmier;
    Wevermier;
    Termiet;
    Macrotermes bellicosus;
    Macrotermes natalensis;
    Amitermes meridionalis;
    Nasutitermes corniger;
    Nijlkrokodil;
    Zeekrokodil;
    Mississippialligator;
    Driedoornige stekelbaars;
    Siamese kempvis;
    Honinggoerami;
    Dwerggoerami;
    Paradijsvis;
    Afrikaanse schuimnestkikker;
    Indische schuimnestkikker
  `, [41]);

  // Een prieel is een baltsconstructie,
  // maar prieelvogels bouwen daarnaast
  // ook afzonderlijke broednesten.

  // Koekoeken bouwen meestal geen eigen broednest.

  veiligVerwijderenDeel9(`
    Gewone koekoek;
    Koekoek;
    Keizerspinguïn
  `, [41]);

  // ============================================================
  // VRAAG 42 - DIEREN DIE VAN KLEUR KUNNEN VERANDEREN
  // ============================================================

  veiligKoppelenDeel9(`
    Kameleon;
    Panterkameleon;
    Jemenkameleon;
    Gewone kameleon;
    Afrikaanse kameleon;
    Senegalese kameleon;
    Jacksonkameleon;
    Vierhoornkameleon;
    Mellers kameleon;
    Parsonskameleon;
    Reuzenkameleon;
    Tapijtkameleon;
    Kaapse dwergkameleon;
    Flapnekkameleon;
    Groene anolis;
    Bruine anolis;
    Ridderanolis;
    Grijze boomkikker;
    Copes grijze boomkikker;
    Octopus;
    Gewone octopus;
    Reuzenoctopus;
    Mimic octopus;
    Kokosnootoctopus;
    Zeekat;
    Gewone zeekat;
    Reuzenzeekat;
    Flamboyante zeekat;
    Inktvis;
    Schol;
    Bot;
    Tarbot;
    Pauwbot;
    Luipaardbot;
    Gewone kameleonspin;
    Thomisus onustus
  `, [42]);

  // Voor deze vraag bedoelen we actieve,
  // fysiologische kleurverandering.
  //
  // Seizoensgebonden ruien en het veranderen
  // van vacht tijdens het opgroeien tellen
  // voorlopig niet mee.

  // ============================================================
  // VRAAG 44 - DIEREN DIE HEEL OUD KUNNEN WORDEN
  // ============================================================

  veiligKoppelenDeel9(`
    Groenlandse haai;
    Groenlandse walvis;
    Noordkromp;
    Aldabra-reuzenschildpad;
    Galapagosreuzenschildpad;
    Sporenschildpad;
    Griekse landschildpad;
    Moorse landschildpad;
    Stralenschildpad;
    Brughagedis;
    Olm;
    Chinese reuzensalamander;
    Japanse reuzensalamander;
    Afrikaanse savanneolifant;
    Afrikaanse bosolifant;
    Aziatische olifant;
    Zeekrokodil;
    Nijlkrokodil;
    Mississippialligator;
    Blauwe vinvis;
    Gewone vinvis;
    Bultrug;
    Potvis;
    Orka;
    Noordkaper;
    Zuidkaper;
    Europese steur;
    Belugasteur;
    Siberische steur;
    Koi;
    Karper;
    Australische longvis;
    Reuzendoopvontschelp;
    Rode zee-egel;
    Grijze roodstaartpapegaai;
    Hyacintara;
    Geelvleugelara;
    Rode ara;
    Blauwgele ara;
    Geelkuifkaketoe;
    Molukkenkaketoe;
    Palmkaketoe;
    Kakapo
  `, [44]);

  // ============================================================
  // VRAAG 46 - DIEREN DIE MENSEN VOOR VOEDSEL HOUDEN
  // ============================================================

  veiligKoppelenDeel9(`
    Koe;
    Rund;
    Melkkoe;
    Vleeskoe;
    Holstein-Friesian;
    Jersey;
    Ayrshire;
    Guernsey;
    Brown Swiss;
    Fries-Hollands;
    Blaarkop;
    Lakenvelder;
    Aberdeen Angus;
    Hereford;
    Limousin;
    Charolais;
    Belgisch witblauw;
    Piemontese;
    Blonde d'Aquitaine;
    Simmentaler;
    Dexter;
    Schotse hooglander;
    Galloway;
    Varken;
    Zeug;
    Big;
    Duroc;
    Pietrain;
    Berkshire;
    Hampshire;
    Tamworth;
    Mangalica;
    Schaap;
    Texelaar;
    Suffolk;
    Merino;
    Swifter;
    Zwartbles;
    Geit;
    Boergeit;
    Saanengeit;
    Toggenburger;
    Nubische geit;
    Waterbuffel;
    Jak;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Rendier;
    Edelhert;
    Damhert;
    Konijn;
    Vlaamse reus;
    Cavia;
    Kip;
    Hen;
    Haan;
    Leghorn;
    Sussex;
    Orpington;
    Barnevelder;
    Welsumer;
    Marans;
    Rhode Island Red;
    Plymouth Rock;
    Brahma;
    Eend;
    Pekingeend;
    Muskuseend;
    Indische loopeend;
    Roueneend;
    Gans;
    Toulousegans;
    Embdener gans;
    Kalkoen;
    Kwartel;
    Japanse kwartel;
    Parelhoen;
    Fazant;
    Struisvogel;
    Emoe;
    Duif;
    Atlantische zalm;
    Regenboogforel;
    Beekforel;
    Bronforel;
    Karper;
    Graskarper;
    Zilverkarper;
    Grootkopkarper;
    Nijltilapia;
    Mozambiquetilapia;
    Pangasius;
    Afrikaanse meerval;
    Europese meerval;
    Europese zeebaars;
    Dorade;
    Tarbot;
    Heilbot;
    Europese steur;
    Siberische steur;
    Belugasteur;
    Mossel;
    Japanse oester;
    Platte oester;
    Sint-jakobsschelp;
    Tijgergarnaal;
    Witpootgarnaal;
    Amerikaanse rivierkreeft;
    Wijngaardslak;
    Segrijnslak;
    Afrikaanse reuzenslak;
    Huiskrekel;
    Treksprinkhaan;
    Meelworm;
    Honingbij
  `, [46]);

  // Melk, eieren en honing worden als
  // voedselproductie meegerekend.

  // ============================================================
  // VRAAG 47 - DIEREN MET OPVALLENDE KLEUREN
  // ============================================================

  veiligKoppelenDeel9(`
    Pauw;
    Blauwe pauw;
    Groene pauw;
    Goudfazant;
    Lady Amherstfazant;
    Mandarijneend;
    Carolina-eend;
    IJsvogel;
    Bijeneter;
    Scharrelaar;
    Europese scharrelaar;
    Vorkstaartscharrelaar;
    Hop;
    Flamingo;
    Grote flamingo;
    Rode ara;
    Geelvleugelara;
    Blauwgele ara;
    Hyacintara;
    Regenbooglori;
    Lori van de blauwe bergen;
    Rosella;
    Prachtrosella;
    Pennantrosella;
    Gouldamadine;
    Perzikkopagapornis;
    Fischeragapornis;
    Zwartmaskeragapornis;
    Kolibrie;
    Paradijsvogel;
    Grote paradijsvogel;
    Rode paradijsvogel;
    Prachtparadijsvogel;
    Toekan;
    Reuzentoekan;
    Mandril;
    Gouden leeuwaapje;
    Rode vari;
    Rode panda;
    Panterkameleon;
    Jemenkameleon;
    Jacksonkameleon;
    Groene leguaan;
    Blauwe leguaan;
    Blauwe boomvaraan;
    Groene boomvaraan;
    Gele boomvaraan;
    Vuurskink;
    Regenboogskink;
    Goudstofdaggekko;
    Grote madagaskardaggekko;
    Williams dwerggekko;
    Neondaggekko;
    Smaragdboa;
    Groene boompython;
    Koraalslang;
    Melkslang;
    Gouden gifkikker;
    Aardbeigifkikker;
    Verfkikkertje;
    Blauwe pijlgifkikker;
    Geelbandgifkikker;
    Groen-zwarte gifkikker;
    Gouden mantella;
    Groene mantella;
    Tomaatkikker;
    Roodoogmakikikker;
    Vuursalamander;
    Clownvis;
    Blauwe doktersvis;
    Gele doktersvis;
    Mandarijnpitvis;
    Keizersvis;
    Koraalduivel;
    Siamese kempvis;
    Discusvis;
    Kardinaaltetra;
    Neon tetra;
    Guppy;
    Koi;
    Flamboyante zeekat;
    Blauwringoctopus;
    Zeenaaktslak;
    Dagpauwoog;
    Atalanta;
    Citroenvlinder;
    Koninginnenpage;
    Koningspage;
    Morpho;
    Kleine vuurvlinder;
    Icarusblauwtje;
    Sint-jansvlinder;
    Lieveheersbeestje;
    Gouden loopkever;
    Gouden tor;
    Pauwspin;
    Maratus volans;
    Poecilotheria metallica;
    Oranje bavianenspin;
    Blauwe kobaltvogelspin;
    Orchideebidsprinkhaan
  `, [47]);

  // ============================================================
  // VRAAG 48 - DIEREN MET STREPEN
  // ============================================================

  veiligKoppelenDeel9(`
    Zebra;
    Steppezebra;
    Bergzebra;
    Grévyzebra;
    Tijger;
    Bengaalse tijger;
    Siberische tijger;
    Sumatraanse tijger;
    Maleise tijger;
    Indochinese tijger;
    Gestreepte hyena;
    Aardwolf;
    Ringstaartmaki;
    Gestreepte jakhals;
    Gestreept stinkdier;
    Siberische grondeekhoorn;
    Dertienstrepige grondeekhoorn;
    Gestreepte boomeekhoorn;
    Numbat;
    Tasmaanse tijger;
    Quagga;
    Okapi;
    Zebramangoeste;
    Zebravink;
    Zebravis;
    Zebrabarbeel;
    Zebrabotia;
    Clownbotia;
    Clownvis;
    Driebandanemoonvis;
    Koraalduivel;
    Tijgerhaai;
    Gestreepte dolfijn;
    Maanvis;
    Sumatraan;
    Keizersvis;
    Zebrameerval;
    Tijgershovelnosemeerval;
    Zebraneonhaai;
    Gestreepte zeepaardje;
    Tijgerslang;
    Tijgerratelslang;
    Gebande krait;
    Veelbandkrait;
    Gebande zeekrait;
    Zebrabrilslang;
    Vierstreepslang;
    Melkslang;
    Koraalslang;
    Californische koningsslang;
    Mandarijnrattenslang;
    Mangroveslang;
    Fiji-bandleguaan;
    Vijfstreepskink;
    Afrikaanse vijfstreepskink;
    Gestreepte regenboogskink;
    Langstaarthagedis;
    Zesstreepracerunner;
    Geelbandgifkikker;
    Gestreepte gifkikker;
    Gestreepte tijgersalamander;
    Wespspin;
    Huiszebraspin;
    Coloradokever;
    Vierbandsmalboktor;
    Geringelde smalboktor;
    Gestreepte pyjamawants;
    Pyjamawants;
    Scolopendra hardwickei;
    Centruroides vittatus;
    Liguus fasciatus
  `, [48]);

  // ============================================================
  // VRAAG 49 - DIEREN MET STIPPEN OF VLEKKEN
  // ============================================================

  veiligKoppelenDeel9(`
    Jachtluipaard;
    Luipaard;
    Jaguar;
    Sneeuwluipaard;
    Ocelot;
    Margay;
    Serval;
    Europese lynx;
    Rode lynx;
    Nevelpanter;
    Gevlekte hyena;
    Afrikaanse wilde hond;
    Dalmatier;
    Dalmatiër;
    Duitse staande korthaar;
    Engelse setter;
    Appaloosa;
    Knabstrupper;
    Giraf;
    Masaigiraf;
    Netgiraf;
    Damhert;
    Axishert;
    Sikahert;
    Gevlekte buidelmarter;
    Quoll;
    Gevlekte zeearend;
    Parelhoen;
    Helmparelhoen;
    Gierparelhoen;
    Spreeuw;
    Zanglijster;
    Grote lijster;
    Pauw;
    Argusfazant;
    Walvishaai;
    Zebrahaai;
    Luipaardhaai;
    Gevlekte adelaarsrog;
    Blauwgevlekte pijlstaartrog;
    Stekelrog;
    Sterrog;
    Beekforel;
    Regenboogforel;
    Bronforel;
    Luipaarddanio;
    Luipaardgekko;
    Tokkeh;
    Goudstofdaggekko;
    Pauwoogdaggekko;
    Gevlekte python;
    Gevlekte ringslang;
    Gevlekte ratelslang;
    Luipaardslang;
    Korenslang;
    Gabonadder;
    Bonte varaan;
    Pauwoogvaraan;
    Luipaardhagedis;
    Gilamonster;
    Luipaardschildpad;
    Druppelschildpad;
    Verfkikkertje;
    Groen-zwarte gifkikker;
    Luipaardkikker;
    Pickerelkikker;
    Roodgevlekte pad;
    Vuursalamander;
    Gevlekte salamander;
    Blauwvleksalamander;
    Lieveheersbeestje;
    Zevenstippelig lieveheersbeestje;
    Tweestippelig lieveheersbeestje;
    Tienstippelig lieveheersbeestje;
    Veertienstippelig lieveheersbeestje;
    Tweeëntwintigstippelig lieveheersbeestje;
    Oogvleklieveheersbeestje;
    Roomvleklieveheersbeestje;
    Aziatisch lieveheersbeestje;
    Dagpauwoog;
    Bont zandoogje;
    Sint-jansvlinder;
    Viervlekwielwebspin;
    Marmerspin;
    Lieveheersbeestjesspin;
    Rosaliaboktor;
    Goliathkever;
    Julikever;
    Gevlekte akkerslak;
    Tijgerslak;
    Armadillidium maculatum
  `, [49]);

  // ============================================================
  // EXTRA NEDERLANDSE NAMEN EN SYNONIEMEN
  // ============================================================

  synoniemenDeel9("Jachtluipaard", [
    "Cheeta",
    "Cheetah",
    "Acinonyx jubatus"
  ]);

  synoniemenDeel9("Poema", [
    "Puma",
    "Cougar",
    "Bergleeuw",
    "Puma concolor"
  ]);

  synoniemenDeel9("Sneeuwluipaard", [
    "Sneeuwpanter",
    "Irbis",
    "Panthera uncia"
  ]);

  synoniemenDeel9("Fennek", [
    "Woestijnvos",
    "Fennec",
    "Vulpes zerda"
  ]);

  synoniemenDeel9("Reuzenpanda", [
    "Grote panda",
    "Bamboebeer",
    "Ailuropoda melanoleuca"
  ]);

  synoniemenDeel9("Rode panda", [
    "Kleine panda",
    "Katbeer",
    "Red panda"
  ]);

  synoniemenDeel9("Stokstaartje", [
    "Meerkat",
    "Suricata suricatta"
  ]);

  synoniemenDeel9("Capibara", [
    "Capybara",
    "Waterzwijn",
    "Hydrochoerus hydrochaeris"
  ]);

  synoniemenDeel9("Mara", [
    "Patagonische mara",
    "Patagonische haas",
    "Dolichotis patagonum"
  ]);

  synoniemenDeel9("Degoe", [
    "Degu",
    "Octodon degus"
  ]);

  synoniemenDeel9("Vogelbekdier", [
    "Platypus",
    "Ornithorhynchus anatinus"
  ]);

  synoniemenDeel9("Gewone mierenegel", [
    "Kortsnuitmierenegel",
    "Tachyglossus aculeatus"
  ]);

  synoniemenDeel9("Tasmaanse tijger", [
    "Tasmaanse wolf",
    "Buidelwolf",
    "Thylacine",
    "Thylacinus cynocephalus"
  ]);

  synoniemenDeel9("Tasmaanse duivel", [
    "Tasmanian devil",
    "Sarcophilus harrisii"
  ]);

  synoniemenDeel9("Europese bizon", [
    "Wisent",
    "Bison bonasus"
  ]);

  synoniemenDeel9("Amerikaanse bizon", [
    "Amerikaanse bison",
    "Bison bison"
  ]);

  synoniemenDeel9("Gaffelbok", [
    "Pronghorn",
    "Antilocapra americana"
  ]);

  synoniemenDeel9("Gnoe", [
    "Wildebeest"
  ]);

  synoniemenDeel9("Orka", [
    "Orca",
    "Zwaardwalvis",
    "Orcinus orca"
  ]);

  synoniemenDeel9("Beloega", [
    "Beluga",
    "Witte walvis",
    "Delphinapterus leucas"
  ]);

  synoniemenDeel9("Blauwe vinvis", [
    "Blauwe walvis",
    "Balaenoptera musculus"
  ]);

  synoniemenDeel9("Bultrug", [
    "Bultrugwalvis",
    "Megaptera novaeangliae"
  ]);

  synoniemenDeel9("Witte haai", [
    "Mensenhaai",
    "Great white shark",
    "Carcharodon carcharias"
  ]);

  synoniemenDeel9("Walvishaai", [
    "Whale shark",
    "Rhincodon typus"
  ]);

  synoniemenDeel9("Groenlandse haai", [
    "Groenlandhaai",
    "Somniosus microcephalus"
  ]);

  synoniemenDeel9("Koi", [
    "Koikarper",
    "Nishikigoi"
  ]);

  synoniemenDeel9("Siamese kempvis", [
    "Betta",
    "Betta splendens"
  ]);

  synoniemenDeel9("Neon tetra", [
    "Neontetra",
    "Paracheirodon innesi"
  ]);

  synoniemenDeel9("Kardinaaltetra", [
    "Kardinaal tetra",
    "Paracheirodon axelrodi"
  ]);

  synoniemenDeel9("Zebravis", [
    "Zebradanio",
    "Danio rerio"
  ]);

  synoniemenDeel9("Maanvis", [
    "Pterophyllum scalare"
  ]);

  synoniemenDeel9("Komodovaraan", [
    "Komododraak",
    "Komodo draak",
    "Varanus komodoensis"
  ]);

  synoniemenDeel9("Brughagedis", [
    "Tuatara",
    "Sphenodon punctatus"
  ]);

  synoniemenDeel9("Koningspython", [
    "Balpython",
    "Python regius"
  ]);

  synoniemenDeel9("Axolotl", [
    "Mexicaanse axolotl",
    "Ambystoma mexicanum"
  ]);

  synoniemenDeel9("Olm", [
    "Grottenolm",
    "Proteus anguinus"
  ]);

  synoniemenDeel9("Wespspin", [
    "Tijgerspin",
    "Argiope bruennichi"
  ]);

  synoniemenDeel9("Huiszebraspin", [
    "Zebraspin",
    "Salticus scenicus"
  ]);

  synoniemenDeel9("Gewone kameleonspin", [
    "Misumena vatia"
  ]);

  synoniemenDeel9("Segrijnslak", [
    "Cornu aspersum",
    "Helix aspersa"
  ]);

  synoniemenDeel9("Afrikaanse reuzenslak", [
    "Lissachatina fulica",
    "Achatina fulica"
  ]);

  synoniemenDeel9("Beerdiertje", [
    "Waterbeertje",
    "Tardigrade",
    "Tardigrada"
  ]);

  // ============================================================
  // NAAMCORRECTIES
  // ============================================================

  synoniemenDeel9("Dalmatiër", [
    "Dalmatier",
    "Dalmatische hond",
    "Dalmatian"
  ]);

  synoniemenDeel9("Grote madagaskardaggekko", [
    "Phelsuma grandis"
  ]);

  synoniemenDeel9("Gewone oprolpissebed", [
    "Armadillidium vulgare"
  ]);

  synoniemenDeel9("Indische wandelende tak", [
    "Carausius morosus"
  ]);

  synoniemenDeel9("Vietnamese wandelende tak", [
    "Medauroidea extradentata"
  ]);

  synoniemenDeel9("Gouden gifkikker", [
    "Phyllobates terribilis"
  ]);

  synoniemenDeel9("Roodoogmakikikker", [
    "Roodoogboomkikker",
    "Agalychnis callidryas"
  ]);

  // ============================================================
  // LOGISCHE VRAAGKOPPELINGEN
  // ============================================================

  // Een dier dat in zee, in een rivier of in
  // een meer leeft, leeft ook in het water.
  //
  // Een waterdier hoeft echter niet actief
  // te kunnen zwemmen.

  let automatischeKoppelingenDeel9 = 0;

  for (const record of database.values()) {
    const heeftWater =
      record.vragen.has(11) ||
      record.vragen.has(37) ||
      record.vragen.has(38);

    if (
      heeftWater &&
      !record.vragen.has(1)
    ) {
      record.vragen.add(1);
      automatischeKoppelingenDeel9++;
    }

    if (
      record.vragen.has(15) &&
      !record.vragen.has(17)
    ) {
      record.vragen.add(17);
      automatischeKoppelingenDeel9++;
    }
  }

  // Geen automatische koppelingen zoals:
  //
  // Vier poten = kan springen
  // Vacht = leeft in een koud gebied
  // Veren = kan vliegen
  // Schubben = legt eieren
  // Woestijn = Afrika
  // Waterdier = kan zwemmen
  // Uitgestorven = vroeger in Nederland
  //
  // Deze aannames zijn niet altijd juist.

  // ============================================================
  // UITGESTORVEN DIEREN
  // ============================================================

  // Uitgestorven dieren kunnen bij vragen
  // over anatomie geldig zijn.
  //
  // Voor vragen over huidige verspreiding,
  // huisdieren en dierentuinen worden ze
  // niet geaccepteerd.
  //
  // Alleen records die momenteel vraag 43
  // hebben, worden hieronder behandeld.

  const actueleVragenDeel9 = [
    3, 5, 6, 8, 12, 13,
    23, 24, 25, 26, 27,
    31, 32, 37, 38, 39,
    46
  ];

  let verwijderdeHistorischeKoppelingenDeel9 = 0;

  for (const record of database.values()) {
    if (!record.vragen.has(43)) continue;

    for (const nummer of actueleVragenDeel9) {
      if (record.vragen.delete(nummer)) {
        verwijderdeHistorischeKoppelingenDeel9++;
      }
    }
  }

  // ============================================================
  // CORRECTIES DUBBELZINNIGE DIERNAMEN
  // ============================================================

  // "Maanvis" kan een aquariumvis of een
  // grote zeevis betekenen.
  //
  // Daarom niet automatisch samenvoegen.

  // "Nonnetje" kan een vogel of een
  // schelpdier betekenen.
  //
  // Ook deze records blijven afzonderlijk.

  const bekendeNaamconflictenDeel9 = [
    "Maanvis",
    "Nonnetje",
    "Beer",
    "Grote beer",
    "Meerkat",
    "Zeekat",
    "Tijgerslak",
    "Koraalslang",
    "Kameleonspin"
  ];

  // ============================================================
  // STRUCTURELE CONTROLE
  // ============================================================

  const structuurFoutenDeel9 = [];
  const legeRecordsDeel9 = [];
  const wetenschappelijkeNamenDeel9 = [];

  for (const [sleutel, record] of database.entries()) {
    if (
      typeof record.naam !== "string" ||
      !record.naam.trim()
    ) {
      structuurFoutenDeel9.push({
        sleutel,
        fout: "Ontbrekende diernaam"
      });

      continue;
    }

    if (!(record.vragen instanceof Set)) {
      structuurFoutenDeel9.push({
        naam: record.naam,
        fout: "Vraagkoppelingen zijn geen Set"
      });

      continue;
    }

    if (!(record.synoniemen instanceof Set)) {
      structuurFoutenDeel9.push({
        naam: record.naam,
        fout: "Synoniemen zijn geen Set"
      });
    }

    for (const nummer of record.vragen) {
      if (
        !Number.isInteger(nummer) ||
        nummer < 1 ||
        nummer > 50
      ) {
        structuurFoutenDeel9.push({
          naam: record.naam,
          fout: "Ongeldig vraagnummer: " + nummer
        });
      }
    }

    if (record.vragen.size === 0) {
      legeRecordsDeel9.push(record.naam);
    }

    if (
      /^[A-Z][a-z]+ [a-z]+(?: [a-z]+)?$/
        .test(record.naam)
    ) {
      wetenschappelijkeNamenDeel9.push(
        record.naam
      );
    }
  }

  // Lege records worden nog niet verwijderd.
  // Mogelijk ontbreken alleen vraagkoppelingen.

  // ============================================================
  // CONTROLE VAN ALLE INGEVOERDE NAMEN
  // ============================================================

  const naamIndexDeel9 = new Map();

  for (const record of database.values()) {
    const namen = [
      record.naam,
      ...record.synoniemen
    ];

    for (const naam of namen) {
      const sleutel = normaliseer(naam);

      if (!sleutel) continue;

      if (!naamIndexDeel9.has(sleutel)) {
        naamIndexDeel9.set(sleutel, new Set());
      }

      naamIndexDeel9.get(sleutel).add(record);
    }
  }

  const naamconflictenVolledigDeel9 =
    [...naamIndexDeel9.entries()]
      .filter(
        ([naam, records]) => records.size > 1
      )
      .map(([naam, records]) => ({
        naam,
        aantal: records.size,
        dieren: [...records]
          .map(record => record.naam)
          .join(" | ")
      }));

  // ============================================================
  // ANTWOORDTELLING PER VRAAG
  // ============================================================

  function telUniekeDierenDeel9(nummer) {
    const uniek = new Set();

    for (const record of database.values()) {
      if (record.vragen.has(nummer)) {
        uniek.add(normaliseer(record.naam));
      }
    }

    return uniek.size;
  }

  function berekenRakettenDeel9(aantal) {
    if (aantal <= 0) return 0;

    return Math.max(
      1,
      Math.ceil((aantal + 50) / 100)
    );
  }

  // 1 t/m 50 antwoorden       = 1 raket
  // 51 t/m 150 antwoorden     = 2 raketten
  // 151 t/m 250 antwoorden    = 3 raketten
  // 251 t/m 350 antwoorden    = 4 raketten
  // 351 t/m 450 antwoorden    = 5 raketten
  // 451 t/m 550 antwoorden    = 6 raketten
  // 551 t/m 650 antwoorden    = 7 raketten
  // 651 t/m 750 antwoorden    = 8 raketten
  // 751 t/m 850 antwoorden    = 9 raketten
  // 851 t/m 950 antwoorden    = 10 raketten
  // 951 t/m 1050 antwoorden   = 11 raketten
  //
  // Er geldt geen kunstmatig maximum.

  // ============================================================
  // VOORTGANG VAN ALLE 50 VRAGEN
  // ============================================================

  const voortgangDierenDeel9 =
    vragen.map((tekst, index) => {
      const nummer = index + 1;
      const aantal = telUniekeDierenDeel9(nummer);

      const eerder =
        voortgangDierenDeel8.find(
          vraag => vraag.nummer === nummer
        );

      const vorigAantal =
        eerder ? eerder.antwoorden : 0;

      return {
        nummer,
        vraag: tekst,
        antwoorden: aantal,
        eerder: vorigAantal,
        verschil: aantal - vorigAantal,
        raketten: berekenRakettenDeel9(aantal),
        streefaantal: 1000,
        ontbrekend: Math.max(0, 1000 - aantal),
        voortgang: Math.min(
          100,
          Math.round(aantal / 10)
        ) + "%",
        doelBereikt: aantal >= 1000
      };
    });

  // ============================================================
  // VRAGEN MET DE GROOTSTE TEKORTEN
  // ============================================================

  const prioriteitenDierenDeel9 =
    [...voortgangDierenDeel9]
      .filter(vraag => vraag.ontbrekend > 0)
      .sort(
        (a, b) => b.ontbrekend - a.ontbrekend
      );

  // ============================================================
  // DEBUGFUNCTIES
  // ============================================================

  window.QB_V9_DIeren_CONTROLE = {

    totaalDieren() {
      return database.size;
    },

    totaalUniekeNamen() {
      return naamIndexDeel9.size;
    },

    totaalKoppelingen() {
      return voortgangDierenDeel9.reduce(
        (totaal, vraag) =>
          totaal + vraag.antwoorden,
        0
      );
    },

    voortgang() {
      console.table(voortgangDierenDeel9);
      return voortgangDierenDeel9;
    },

    prioriteiten() {
      console.table(prioriteitenDierenDeel9);
      return prioriteitenDierenDeel9;
    },

    controleerAntwoord(nummer, antwoord) {
      if (
        !Number.isInteger(nummer) ||
        nummer < 1 ||
        nummer > 50
      ) {
        return {
          geldig: false,
          fout: "Vraagnummer moet 1 t/m 50 zijn"
        };
      }

      const gevonden =
        zoekDierenDeel9(antwoord);

      const geldig = gevonden.some(
        record => record.vragen.has(nummer)
      );

      return {
        vraagnummer: nummer,
        vraag: vragen[nummer - 1],
        invoer: antwoord,
        geldig,
        gevonden: gevonden.map(record => ({
          naam: record.naam,
          vragen: [...record.vragen]
            .sort((a, b) => a - b),
          geldigVoorDezeVraag:
            record.vragen.has(nummer)
        }))
      };
    },

    antwoorden(nummer) {
      if (
        !Number.isInteger(nummer) ||
        nummer < 1 ||
        nummer > 50
      ) {
        return [];
      }

      return [...database.values()]
        .filter(
          record => record.vragen.has(nummer)
        )
        .map(record => ({
          naam: record.naam,
          synoniemen: [...record.synoniemen]
        }))
        .sort(
          (a, b) =>
            a.naam.localeCompare(b.naam, "nl")
        );
    },

    dier(naam) {
      return zoekDierenDeel9(naam)
        .map(record => ({
          naam: record.naam,
          synoniemen: [...record.synoniemen],
          vragen: [...record.vragen]
            .sort((a, b) => a - b)
        }));
    },

    naamconflicten() {
      console.table(
        naamconflictenVolledigDeel9
      );

      return naamconflictenVolledigDeel9;
    },

    ontbrekendeNamen() {
      const lijst =
        [...ontbrekendeNamenDeel9].sort();

      console.table(lijst);

      return lijst;
    },

    dubbelzinnigeNamen() {
      return [...dubbelzinnigeNamenDeel9]
        .sort();
    },

    structuurFouten() {
      console.table(structuurFoutenDeel9);
      return structuurFoutenDeel9;
    },

    legeRecords() {
      return legeRecordsDeel9;
    }

  };

  // ============================================================
  // TESTGEVALLEN
  // ============================================================

  const testgevallenDierenDeel9 = [
    [1, "Goudvis", true],
    [1, "Dolfijn", true],
    [1, "Leeuw", false],

    [2, "Huismus", true],
    [2, "Vleermuis", true],
    [2, "Struisvogel", false],
    [2, "Pinguïn", false],
    [2, "Vliegende eekhoorn", false],

    [4, "Hond", true],
    [4, "Kat", true],
    [4, "Hazelworm", false],
    [4, "Slang", false],

    [7, "Kip", true],
    [7, "Vogelbekdier", true],
    [7, "Haan", false],
    [7, "Schorpioen", false],
    [7, "Hond", false],

    [8, "Hamster", true],
    [8, "Goudvis", true],

    [11, "Walvishaai", true],
    [11, "Mossel", true],
    [11, "Goudvis", false],

    [14, "Dolfijn", true],
    [14, "Otter", true],
    [14, "Mossel", false],

    [15, "Reuzenmiereneter", true],
    [15, "Kameleon", true],

    [16, "Giraf", true],
    [16, "Koe", true],
    [16, "Leeuw", false],

    [17, "Leeuw", true],
    [17, "Miereneter", true],

    [18, "Kat", true],
    [18, "Gorilla", false],
    [18, "Kikker", false],

    [19, "Geit", true],
    [19, "Neushoorn", true],
    [19, "Edelhert", false],

    [20, "Reuzenpanda", true],
    [20, "Kat", true],
    [20, "Slang", false],

    [21, "Slang", true],
    [21, "Schubdier", true],

    [22, "Pinguïn", true],
    [22, "Struisvogel", true],
    [22, "Vleermuis", false],

    [23, "Koala", true],
    [23, "Kangoeroe", true],
    [23, "IJsbeer", false],

    [24, "IJsbeer", true],
    [24, "Poolvos", true],

    [25, "Dromedaris", true],
    [25, "Doornduivel", true],
    [25, "IJsbeer", false],

    [26, "Ree", true],
    [26, "Huismus", true],
    [26, "Dodo", false],

    [28, "Egel", true],

    [29, "Jachtluipaard", true],
    [29, "Cheeta", true],

    [30, "Luiaard", true],
    [30, "Landschildpad", true],

    [31, "Koala", true],
    [31, "Orang-oetan", true],

    [32, "Mol", true],
    [32, "Regenworm", true],

    [33, "Schildpad", true],
    [33, "Gordeldier", true],

    [34, "Kangoeroe", true],
    [34, "Kikker", true],

    [35, "Kat", true],
    [35, "Steenbok", true],

    [36, "Giraf", true],
    [36, "Diplodocus", true],

    [37, "Snoek", true],
    [37, "Nijlpaard", true],

    [38, "Karper", true],
    [38, "Baars", true],

    [39, "Strandkrab", true],

    [40, "Mier", true],
    [40, "Wolf", true],

    [41, "Ooievaar", true],
    [41, "Ekster", true],
    [41, "Keizerspinguïn", false],

    [42, "Kameleon", true],
    [42, "Octopus", true],

    [43, "Dodo", true],
    [43, "Mammoet", true],
    [43, "Megalodon", true],
    [43, "Tasmaanse tijger", true],
    [43, "Tasmaanse duivel", false],
    [43, "Axolotl", false],
    [43, "Reuzenpanda", false],

    [44, "Groenlandse haai", true],
    [44, "Groenlandse walvis", true],

    [45, "Schorpioen", true],
    [45, "Zwarte mamba", true],

    [46, "Koe", true],
    [46, "Kip", true],

    [47, "Pauw", true],
    [47, "Panterkameleon", true],

    [48, "Zebra", true],
    [48, "Tijger", true],

    [49, "Jachtluipaard", true],
    [49, "Lieveheersbeestje", true],

    [50, "Leeuw", true],
    [50, "Olifant", true]
  ];

  const testresultatenDierenDeel9 =
    testgevallenDierenDeel9.map(
      ([nummer, antwoord, verwacht]) => {

        const resultaat =
          window.QB_V9_DIeren_CONTROLE
            .controleerAntwoord(
              nummer,
              antwoord
            );

        return {
          nummer,
          antwoord,
          verwacht,
          resultaat: resultaat.geldig,
          geslaagd:
            resultaat.geldig === verwacht
        };
      }
    );

  const mislukteTestsDierenDeel9 =
    testresultatenDierenDeel9.filter(
      test => !test.geslaagd
    );

  // ============================================================
  // TUSSENTIJDSE EINDRAPPORTAGE DEEL 9
  // ============================================================

  console.group("QuizBallon V9 - Dieren - deel 9");

  console.log(
    "Totaal dierrecords:",
    database.size
  );

  console.log(
    "Totaal unieke invoernamen:",
    naamIndexDeel9.size
  );

  console.log(
    "Automatische logische koppelingen:",
    automatischeKoppelingenDeel9
  );

  console.log(
    "Verwijderde historische koppelingen:",
    verwijderdeHistorischeKoppelingenDeel9
  );

  console.log(
    "Ontbrekende diernamen:",
    ontbrekendeNamenDeel9.size
  );

  console.log(
    "Naamconflicten:",
    naamconflictenVolledigDeel9.length
  );

  console.log(
    "Lege dierrecords:",
    legeRecordsDeel9.length
  );

  console.log(
    "Structuurfouten:",
    structuurFoutenDeel9.length
  );

  console.log(
    "Geslaagde tests:",
    testresultatenDierenDeel9.length -
      mislukteTestsDierenDeel9.length,
    "/",
    testresultatenDierenDeel9.length
  );

  console.log(
    "Vragen met minimaal 1000 antwoorden:",
    voortgangDierenDeel9.filter(
      vraag => vraag.doelBereikt
    ).length,
    "/ 50"
  );

  console.table(voortgangDierenDeel9);

  console.log(
    "Vragen die de meeste uitbreiding nodig hebben:"
  );

  console.table(prioriteitenDierenDeel9);

  if (mislukteTestsDierenDeel9.length > 0) {
    console.warn(
      "De volgende testgevallen moeten worden hersteld:"
    );

    console.table(mislukteTestsDierenDeel9);
  }

  if (structuurFoutenDeel9.length > 0) {
    console.error(
      "Er zijn structuurfouten gevonden:"
    );

    console.table(structuurFoutenDeel9);
  }

  console.groupEnd();

  // ============================================================
  // EINDE DEEL 9
  // HET BESTAND NOG NIET AFSLUITEN
  // ============================================================
   // ============================================================
  // QUIZBALLON V9 - DIEREN - DEEL 10
  // DEFINITIEVE VERWERKING EN EXPORT
  // ============================================================

  const DIEREN_V9_VERSIE = "9.0.0";
  const DIEREN_V9_STREEFAANTAL = 1000;

  // ============================================================
  // LAATSTE CORRECTIES
  // ============================================================

  veiligVerwijderenDeel9(`
    Dinosaurus;
    Huanan;
    Grant;
    Kear;
    Bianucci;
    Channellingosaurus;
    Neoceratodus forsteri;
    Budorcas taxicolor;
    Sarcophilus harrisii;
    Platanista gangetica;
    Callorhinus ursinus;
    Pithecia monachus;
    Fregata aquila;
    Leucocarbo;
    Pseudophilautus;
    Pteropus allenorum
  `, [43]);

  veiligKoppelenDeel9(`
    Dinosaurus;
    Dodo;
    Mammoet;
    Wolharige mammoet;
    Megalodon;
    Reuzenalk;
    Trekduif;
    Tasmaanse tijger;
    Quagga;
    Oeros;
    Tyrannosaurus rex;
    Triceratops;
    Stegosaurus;
    Velociraptor;
    Brachiosaurus;
    Diplodocus;
    Spinosaurus;
    Mosasaurus;
    Plesiosaurus;
    Trilobiet;
    Ammoniet
  `, [43]);

  // Dinosaurus is hier de gebruikelijke
  // benaming voor niet-vogeldinosaurussen.

  veiligVerwijderenDeel9(`
    Walvishaai
  `, [7]);

  veiligVerwijderenDeel9(`
    Zeekoe;
    Doegong;
    Lamantijn
  `, [7]);

  veiligVerwijderenDeel9(`
    Struisvogel;
    Emoe;
    Kasuaris;
    Kiwi;
    Kakapo;
    Pinguïn;
    Dodo;
    Moa;
    Olifantsvogel;
    Reuzenalk
  `, [2]);

  // ============================================================
  // VEILIGE NORMALISATIE VAN ANTWOORDEN
  // ============================================================

  function normaliseerAntwoordV9Dieren(invoer) {
    return String(invoer ?? "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ß/g, "ss")
      .replace(/æ/g, "ae")
      .replace(/œ/g, "oe")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  // Voorbeelden:
  //
  // Dalmatiër = dalmatier
  // IJsbeer = ijsbeer
  // T-Rex = trex
  // Rode panda = rodepanda
  // RODE PANDA = rodepanda
  // Rode-panda = rodepanda

  // ============================================================
  // BEKENDE, ALGEMENE ANTWOORDEN
  // ============================================================

  // Deze dieren zijn naar verwachting
  // relatief gemakkelijk te bedenken.
  //
  // Dit is een schatting en geen
  // daadwerkelijk gemeten spelersstatistiek.

  const algemeneDierenV9 = new Set(
    `
      Hond;
      Kat;
      Huiskat;
      Muis;
      Rat;
      Konijn;
      Haas;
      Cavia;
      Hamster;
      Paard;
      Pony;
      Ezel;
      Koe;
      Stier;
      Schaap;
      Geit;
      Varken;
      Kip;
      Haan;
      Eend;
      Gans;
      Zwaan;
      Leeuw;
      Tijger;
      Olifant;
      Giraf;
      Zebra;
      Neushoorn;
      Nijlpaard;
      Aap;
      Gorilla;
      Chimpansee;
      Orang-oetan;
      Beer;
      IJsbeer;
      Bruine beer;
      Panda;
      Reuzenpanda;
      Vos;
      Wolf;
      Hert;
      Ree;
      Egel;
      Mol;
      Eekhoorn;
      Kangoeroe;
      Koala;
      Luiaard;
      Kameel;
      Dromedaris;
      Krokodil;
      Alligator;
      Slang;
      Hagedis;
      Schildpad;
      Kikker;
      Pad;
      Salamander;
      Haai;
      Walvis;
      Dolfijn;
      Orka;
      Goudvis;
      Zalm;
      Tonijn;
      Haring;
      Karper;
      Paling;
      Snoek;
      Octopus;
      Inktvis;
      Kwal;
      Zeester;
      Krab;
      Kreeft;
      Garnaal;
      Mossel;
      Oester;
      Zeehond;
      Walrus;
      Pinguïn;
      Struisvogel;
      Papegaai;
      Parkiet;
      Uil;
      Arend;
      Valk;
      Mus;
      Merel;
      Duif;
      Meeuw;
      Kraai;
      Ekster;
      Roodborst;
      Koolmees;
      Pimpelmees;
      Flamingo;
      Pauw;
      Specht;
      Toekan;
      Vleermuis;
      Vlinder;
      Mier;
      Bij;
      Wesp;
      Hommel;
      Mug;
      Vlieg;
      Libel;
      Sprinkhaan;
      Krekel;
      Kever;
      Lieveheersbeestje;
      Spin;
      Vogelspin;
      Schorpioen;
      Slak;
      Naaktslak;
      Regenworm;
      Duizendpoot;
      Pissebed;
      Dinosaurus;
      Tyrannosaurus rex;
      Triceratops;
      Stegosaurus;
      Mammoet;
      Dodo;
      Megalodon
    `
      .split(";")
      .map(normaliseerAntwoordV9Dieren)
      .filter(Boolean)
  );

  // ============================================================
  // MIDDELMATIG BEKENDE DIEREN
  // ============================================================

  const middelBekendeDierenV9 = new Set(
    `
      Jachtluipaard;
      Luipaard;
      Jaguar;
      Poema;
      Lynx;
      Sneeuwluipaard;
      Serval;
      Caracal;
      Ocelot;
      Fennek;
      Coyote;
      Jakhals;
      Hyena;
      Stokstaartje;
      Wasbeer;
      Neusbeer;
      Rode panda;
      Veelvraat;
      Das;
      Otter;
      Bever;
      Bunzing;
      Hermelijn;
      Wezel;
      Boommarter;
      Steenmarter;
      Fret;
      Capibara;
      Chinchilla;
      Degoe;
      Gerbil;
      Muskusrat;
      Beverrat;
      Marmot;
      Prairiehond;
      Stekelvarken;
      Wombat;
      Quokka;
      Wallaby;
      Tasmaanse duivel;
      Vogelbekdier;
      Mierenegel;
      Aardvarken;
      Miereneter;
      Reuzenmiereneter;
      Schubdier;
      Gordeldier;
      Okapi;
      Tapir;
      Bizon;
      Wisent;
      Jak;
      Muskusos;
      Buffel;
      Eland;
      Rendier;
      Gazelle;
      Antilope;
      Impala;
      Springbok;
      Gnoe;
      Koedoe;
      Lama;
      Alpaca;
      Guanaco;
      Vicuna;
      Wrattenzwijn;
      Mandril;
      Baviaan;
      Ringstaartmaki;
      Gibbon;
      Siamang;
      Bonobo;
      Neusaap;
      Brulaap;
      Slingeraap;
      Kapucijnaap;
      Spookdiertje;
      Galago;
      Vleerhond;
      Potvis;
      Narwal;
      Beloega;
      Bultrug;
      Blauwe vinvis;
      Bruinvis;
      Griend;
      Doegong;
      Lamantijn;
      Zeeotter;
      Zeeolifant;
      Zeeluipaard;
      Zeeleeuw;
      Witte haai;
      Tijgerhaai;
      Walvishaai;
      Hamerhaai;
      Groenlandse haai;
      Reuzenhaai;
      Manta;
      Pijlstaartrog;
      Zwaardvis;
      Zeilvis;
      Barracuda;
      Piranha;
      Kogelvis;
      Clownvis;
      Zeepaardje;
      Murene;
      Zeeduivel;
      Zeewolf;
      Zeekomkommer;
      Zee-egel;
      Zeespons;
      Zeeanemoon;
      Zeekat;
      Nautilus;
      Reuzeninktvis;
      Blauwringoctopus;
      Heremietkreeft;
      Langoest;
      Koningskrab;
      Zeepok;
      Krill;
      Komodovaraan;
      Leguaan;
      Gekko;
      Kameleon;
      Baardagaam;
      Hazelworm;
      Python;
      Cobra;
      Ratelslang;
      Anaconda;
      Zwarte mamba;
      Boa constrictor;
      Axolotl;
      Olm;
      Gifkikker;
      Boomkikker;
      Vuursalamander;
      Brughagedis;
      Kasuaris;
      Emoe;
      Nandoe;
      Kiwi;
      Kakapo;
      Pelikaan;
      Aalscholver;
      Papegaaiduiker;
      IJsvogel;
      Lepelaar;
      Ooievaar;
      Reiger;
      Kraanvogel;
      Gier;
      Condor;
      Secretarisvogel;
      Neushoornvogel;
      Kookaburra;
      Kolibrie;
      Valkparkiet;
      Grasparkiet;
      Kaketoe;
      Ara;
      Paradijsvogel;
      Kerkuil;
      Bosuil;
      Oehoe;
      Sneeuwuil;
      Buizerd;
      Havik;
      Sperwer;
      Slechtvalk;
      Torenvalk;
      Wandelende tak;
      Wandelend blad;
      Bidsprinkhaan;
      Hoornaar;
      Meikever;
      Vliegend hert;
      Kruisspin;
      Wespspin;
      Springspin;
      Hooiwagen;
      Zilvervisje;
      Oorworm;
      Termiet;
      Bladluis;
      Teek;
      Vlo;
      Hoofdluis;
      Miljoenpoot;
      Beerdiertje;
      Velociraptor;
      Brachiosaurus;
      Diplodocus;
      Brontosaurus;
      Spinosaurus;
      Allosaurus;
      Ankylosaurus;
      Pteranodon;
      Pterodactylus;
      Mosasaurus;
      Plesiosaurus;
      Ichthyosaurus;
      Sabeltandtijger;
      Wolharige neushoorn;
      Tasmaanse tijger;
      Reuzenalk;
      Trekduif;
      Quagga;
      Oeros;
      Trilobiet;
      Ammoniet
    `
      .split(";")
      .map(normaliseerAntwoordV9Dieren)
      .filter(Boolean)
  );

  // ============================================================
  // BEKENDE HONDENRASSEN
  // ============================================================

  const bekendeRassenV9Dieren = new Set(
    `
      Labrador;
      Labrador retriever;
      Golden retriever;
      Duitse herder;
      Mechelse herder;
      Bordercollie;
      Australische herder;
      Dalmatiër;
      Chihuahua;
      Franse bulldog;
      Engelse bulldog;
      Mopshond;
      Beagle;
      Teckel;
      Poedel;
      Dwergpoedel;
      Rottweiler;
      Dobermann;
      Boxer;
      Husky;
      Siberische husky;
      Shiba inu;
      Akita;
      Berner sennenhond;
      Sint-bernard;
      Newfoundlander;
      Duitse dog;
      Jack russell;
      Yorkshireterriër;
      Maltezer;
      Shih tzu;
      Cocker spaniel;
      Cavalier king charles spaniel;
      Maine coon;
      Britse korthaar;
      Pers;
      Siamese kat;
      Bengaal;
      Ragdoll;
      Sphynx;
      Noorse boskat;
      Siberische kat;
      Fries paard;
      Haflinger;
      Shetlandpony;
      Arabisch volbloed;
      Engels volbloed;
      Tinker;
      Fjord
    `
      .split(";")
      .map(normaliseerAntwoordV9Dieren)
      .filter(Boolean)
  );

  // ============================================================
  // DETERMINISTISCHE HASHFUNCTIE
  // ============================================================

  // De punten moeten niet bij iedere
  // nieuwe paginaweergave veranderen.

  function hashV9Dieren(tekst) {
    let hash = 2166136261;

    const invoer = String(tekst);

    for (let i = 0; i < invoer.length; i++) {
      hash ^= invoer.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  // ============================================================
  // BEKENDHEID VAN EEN DIER INSCHATTEN
  // ============================================================

  function bekendheidV9Dieren(record) {
    const namen = [
      record.naam,
      ...record.synoniemen
    ].map(normaliseerAntwoordV9Dieren);

    if (
      namen.some(
        naam => algemeneDierenV9.has(naam)
      )
    ) {
      return 0;
    }

    if (
      namen.some(
        naam => bekendeRassenV9Dieren.has(naam)
      )
    ) {
      return 1;
    }

    if (
      namen.some(
        naam => middelBekendeDierenV9.has(naam)
      )
    ) {
      return 2;
    }

    const lijktWetenschappelijk =
      /^[A-Z][a-z]+ [a-z]+(?: [a-z]+)?$/
        .test(record.naam);

    if (lijktWetenschappelijk) {
      return 4;
    }

    return 3;
  }

  // Bekendheidsniveaus:
  //
  // 0 = zeer bekend
  // 1 = bekend dierenras
  // 2 = redelijk bekend
  // 3 = minder bekend
  // 4 = vermoedelijk specialistisch
  //
  // Deze niveaus zijn voorlopige schattingen.

  // ============================================================
  // VRAAGSPECIFIEKE BEKENDHEID
  // ============================================================

  // Een giraf is bijvoorbeeld een veel
  // logischer antwoord bij een lange nek
  // dan bij een dier dat kan klimmen.
  //
  // De bekendheid hangt dus ook af van de vraag.

  const typischeAntwoordenV9Dieren = {

    1: `
      Vis;Goudvis;Haai;Walvis;Dolfijn;
      Krab;Kreeft;Octopus;Kwal;Zeehond
    `,

    2: `
      Vogel;Duif;Mus;Meeuw;Arend;
      Vleermuis;Vlinder;Bij;Wesp;Vlieg
    `,

    3: `
      Leeuw;Tijger;Olifant;Giraf;
      Zebra;Gorilla;Aap;Neushoorn;
      Nijlpaard;Pinguïn;Stokstaartje
    `,

    4: `
      Hond;Kat;Paard;Koe;Schaap;
      Geit;Leeuw;Tijger;Olifant
    `,

    5: `
      Leeuw;Olifant;Giraf;Zebra;
      Neushoorn;Nijlpaard;Jachtluipaard
    `,

    6: `
      Hert;Ree;Vos;Wolf;Eekhoorn;
      Wild zwijn;Das;Uil
    `,

    7: `
      Kip;Eend;Vogel;Schildpad;
      Krokodil;Slang;Kikker
    `,

    8: `
      Hond;Kat;Konijn;Cavia;
      Hamster;Goudvis;Parkiet
    `,

    9: `
      Olifant;Giraf;Walvis;
      Neushoorn;Nijlpaard
    `,

    10: `
      Mier;Vlieg;Mug;Bij;
      Wesp;Vlo;Hoofdluis
    `,

    11: `
      Haai;Walvis;Dolfijn;Kwal;
      Octopus;Zeester;Krab
    `,

    12: `
      Aap;Gorilla;Jaguar;Tijger;
      Papegaai;Toekan;Slang
    `,

    13: `
      Koe;Varken;Schaap;Geit;
      Paard;Kip;Eend
    `,

    14: `
      Vis;Dolfijn;Walvis;Haai;
      Eend;Pinguïn;Otter
    `,

    15: `
      Miereneter;Kikker;Spin;
      Kameleon;Vleermuis
    `,

    16: `
      Koe;Schaap;Geit;Paard;
      Konijn;Giraf;Olifant
    `,

    17: `
      Leeuw;Tijger;Haai;Wolf;
      Krokodil;Slang;Orka
    `,

    18: `
      Hond;Kat;Muis;Paard;
      Aap;Kangoeroe;Leeuw
    `,

    19: `
      Koe;Geit;Neushoorn;
      Stier;Buffel;Schaap
    `,

    20: `
      Hond;Kat;Beer;Konijn;
      Schaap;Vos;Wolf
    `,

    21: `
      Slang;Vis;Krokodil;
      Hagedis;Schubdier
    `,

    22: `
      Vogel;Kip;Eend;Duif;
      Papegaai;Pinguïn;Pauw
    `,

    23: `
      Kangoeroe;Koala;Wombat;
      Emoe;Vogelbekdier
    `,

    24: `
      IJsbeer;Pinguïn;Poolvos;
      Rendier;Walrus
    `,

    25: `
      Kameel;Dromedaris;
      Schorpioen;Fennek;Slang
    `,

    26: `
      Vos;Ree;Egel;Mol;
      Merel;Huismus;Eekhoorn
    `,

    27: `
      Uil;Vleermuis;Egel;
      Das;Vos;Nachtvlinder
    `,

    28: `
      Egel;Marmot;Vleermuis;
      Bruine beer
    `,

    29: `
      Jachtluipaard;Paard;
      Leeuw;Slechtvalk
    `,

    30: `
      Luiaard;Slak;Schildpad;
      Naaktslak
    `,

    31: `
      Aap;Eekhoorn;Koala;
      Luiaard;Orang-oetan
    `,

    32: `
      Mol;Regenworm;Mier;
      Konijn;Das
    `,

    33: `
      Schildpad;Gordeldier;
      Landschildpad;Waterschildpad
    `,

    34: `
      Kangoeroe;Kikker;
      Konijn;Sprinkhaan;Vlo
    `,

    35: `
      Aap;Kat;Eekhoorn;
      Koala;Geit
    `,

    36: `
      Giraf;Struisvogel;
      Zwaan;Flamingo;Kameel
    `,

    37: `
      Vis;Otter;Bever;
      Krokodil;Nijlpaard
    `,

    38: `
      Vis;Karper;Snoek;
      Baars;Kikker
    `,

    39: `
      Krab;Meeuw;Kwal;
      Zeehond;Zeester
    `,

    40: `
      Wolf;Leeuw;Olifant;
      Mier;Bij;Dolfijn
    `,

    41: `
      Vogel;Duif;Mus;
      Ooievaar;Mier;Wesp
    `,

    42: `
      Kameleon;Octopus;
      Zeekat;Inktvis
    `,

    43: `
      Dinosaurus;Dodo;Mammoet;
      Tyrannosaurus rex;Megalodon
    `,

    44: `
      Schildpad;Olifant;
      Groenlandse haai
    `,

    45: `
      Slang;Cobra;Schorpioen;
      Zwarte mamba;Ratelslang
    `,

    46: `
      Koe;Varken;Kip;
      Schaap;Geit
    `,

    47: `
      Pauw;Papegaai;Flamingo;
      Vlinder;Kameleon
    `,

    48: `
      Zebra;Tijger;
      Clownvis;Okapi
    `,

    49: `
      Jachtluipaard;Luipaard;
      Dalmatiër;Lieveheersbeestje
    `,

    50: `
      Leeuw;Olifant;Giraf;
      Zebra;Tijger;Haai;Aap
    `

  };

  const typischeIndexV9Dieren =
    Object.fromEntries(
      Object.entries(
        typischeAntwoordenV9Dieren
      ).map(([nummer, tekst]) => [
        Number(nummer),

        new Set(
          tekst
            .split(";")
            .map(normaliseerAntwoordV9Dieren)
            .filter(Boolean)
        )
      ])
    );

  // ============================================================
  // ZELDZAAMHEIDSRANGSCHIKKING
  // ============================================================

  function zeldzaamheidV9Dieren(
    record,
    vraagnummer
  ) {
    const bekendheid =
      bekendheidV9Dieren(record);

    const namen = [
      record.naam,
      ...record.synoniemen
    ].map(normaliseerAntwoordV9Dieren);

    const typisch =
      typischeIndexV9Dieren[vraagnummer];

    if (
      typisch &&
      namen.some(
        naam => typisch.has(naam)
      )
    ) {
      return (
        hashV9Dieren(
          vraagnummer + ":" + record.naam
        ) % 1000
      );
    }

    const variatie =
      hashV9Dieren(
        vraagnummer +
        ":" +
        normaliseerAntwoordV9Dieren(
          record.naam
        )
      ) % 1000;

    return (
      1000 +
      bekendheid * 1000 +
      variatie
    );
  }

  // ============================================================
  // OPSCHONEN VAN DIERRECORDS
  // ============================================================

  const definitieveDierenV9 = [];

  const ongeldigeRecordsV9Dieren = [];

  for (const record of database.values()) {

    if (
      typeof record.naam !== "string" ||
      !record.naam.trim()
    ) {
      ongeldigeRecordsV9Dieren.push(
        record
      );

      continue;
    }

    if (
      !(record.vragen instanceof Set)
    ) {
      ongeldigeRecordsV9Dieren.push(
        record
      );

      continue;
    }

    const naam = record.naam
      .trim()
      .replace(/\s+/g, " ");

    const canoniekeSleutel =
      normaliseerAntwoordV9Dieren(naam);

    if (!canoniekeSleutel) {
      continue;
    }

    const synoniemen = [
      ...new Set(
        Array.from(
          record.synoniemen || []
        )
          .filter(
            waarde =>
              typeof waarde === "string"
          )
          .map(
            waarde =>
              waarde.trim()
          )
          .filter(Boolean)
      )
    ].filter(
      synoniem =>
        normaliseerAntwoordV9Dieren(
          synoniem
        ) !== canoniekeSleutel
    );

    const geldigeVragen =
      [...record.vragen]
        .filter(
          nummer =>
            Number.isInteger(nummer) &&
            nummer >= 1 &&
            nummer <= 50
        )
        .sort(
          (a, b) => a - b
        );

    if (!geldigeVragen.length) {
      continue;
    }

    definitieveDierenV9.push({
      naam,
      sleutel: canoniekeSleutel,
      synoniemen,
      vragen: geldigeVragen
    });
  }

  // ============================================================
  // DUBBELE CANONIEKE NAMEN
  // ============================================================

  // Exact dezelfde genormaliseerde naam
  // wordt binnen een vraag maar één keer
  // als invoermogelijkheid meegeteld.
  //
  // Verschillende diersoorten met dezelfde
  // Nederlandse naam worden niet automatisch
  // biologisch samengevoegd.

  function uniekeAntwoordenV9Dieren(
    vraagnummer
  ) {
    const uniekeNamen = new Map();

    for (
      const record of definitieveDierenV9
    ) {

      if (
        !record.vragen.includes(
          vraagnummer
        )
      ) {
        continue;
      }

      if (
        !uniekeNamen.has(
          record.sleutel
        )
      ) {

        uniekeNamen.set(
          record.sleutel,
          {
            naam: record.naam,
            sleutel: record.sleutel,
            synoniemen: new Set(
              record.synoniemen
            )
          }
        );

      } else {

        const bestaand =
          uniekeNamen.get(
            record.sleutel
          );

        for (
          const synoniem of
          record.synoniemen
        ) {
          bestaand.synoniemen.add(
            synoniem
          );
        }
      }
    }

    return [...uniekeNamen.values()]
      .map(record => ({
        naam: record.naam,
        sleutel: record.sleutel,
        synoniemen: [
          ...record.synoniemen
        ]
      }));
  }

  // ============================================================
  // RAKETVERDELING
  // ============================================================

  function rakettenV9Dieren(aantal) {

    if (
      !Number.isInteger(aantal) ||
      aantal <= 0
    ) {
      return 0;
    }

    return Math.min(
      aantal,
      Math.max(
        1,
        Math.ceil(
          (aantal + 50) / 100
        )
      )
    );
  }

  // ============================================================
  // ANTWOORDPUNTEN EN RAKETTEN
  // ============================================================

  function maakAntwoordenV9Dieren(
    vraagnummer
  ) {

    const records =
      uniekeAntwoordenV9Dieren(
        vraagnummer
      );

    if (!records.length) {
      return [];
    }

    // Sorteer van bekend naar zeldzaam.

    const gerangschikt =
      records
        .map(record => ({
          ...record,

          zeldzaamheid:
            zeldzaamheidV9Dieren(
              record,
              vraagnummer
            )
        }))
        .sort(
          (a, b) =>
            a.zeldzaamheid -
              b.zeldzaamheid ||
            a.naam.localeCompare(
              b.naam,
              "nl"
            )
        );

    const aantal =
      gerangschikt.length;

    const aantalRaketten =
      rakettenV9Dieren(aantal);

    const normaleAntwoorden =
      aantal - aantalRaketten;

    const exportAntwoorden =
      gerangschikt.map(
        (record, index) => {

          const isRocket =
            index >= normaleAntwoorden;

          let points;

          if (isRocket) {

            points = 100;

          } else if (
            normaleAntwoorden <= 1
          ) {

            points = 10;

          } else {

            points =
              10 +
              Math.round(
                (
                  index /
                  (normaleAntwoorden - 1)
                ) * 89
              );

            points = Math.max(
              10,
              Math.min(
                99,
                points
              )
            );
          }

          return {
            answer: record.naam,
            aliases: record.synoniemen,
            points,
            isRocket
          };
        }
      );

    // Alfabetische volgorde voor de
    // uiteindelijke gegevens.
    //
    // Punten blijven ongewijzigd.

    return exportAntwoorden.sort(
      (a, b) =>
        a.answer.localeCompare(
          b.answer,
          "nl"
        )
    );
  }

  // ============================================================
  // DEFINITIEVE 50 DIERENVRAGEN
  // ============================================================

  const definitieveVragenV9Dieren =
    vragen.map(
      (vraagtekst, index) => {

        const nummer = index + 1;

        const id =
          "qb650-dieren-" +
          String(nummer)
            .padStart(2, "0");

        const answers =
          maakAntwoordenV9Dieren(
            nummer
          );

        return {
          id,

          baseQuestionId: id,

          topicId: id,

          qb650Category: "Dieren",

          category: "🐾 DIEREN",

          question: vraagtekst,

          questionNumber: nummer,

          hint:
            "Noem een dier dat bij " +
            "de omschrijving past.",

          answers,

          answerCount:
            answers.length,

          rocketCount:
            answers.filter(
              antwoord =>
                antwoord.isRocket
            ).length,

          qb650: true,

          qb650v9: true,

          dataVersion:
            DIEREN_V9_VERSIE
        };
      }
    );

  // ============================================================
  // SNELLE LOKALE ANTWOORDINDEX
  // ============================================================

  // Alle geldige namen en synoniemen
  // worden vooraf geïndexeerd.
  //
  // Tijdens het spelen hoeft niet de
  // volledige dierendatabase doorzocht
  // te worden.

  const antwoordIndexV9Dieren =
    new Map();

  const indexConflictenV9Dieren = [];

  for (
    const vraag of
    definitieveVragenV9Dieren
  ) {

    const index = new Map();

    for (
      const antwoord of vraag.answers
    ) {

      const namen = [
        antwoord.answer,
        ...antwoord.aliases
      ];

      for (
        const naam of namen
      ) {

        const sleutel =
          normaliseerAntwoordV9Dieren(
            naam
          );

        if (!sleutel) continue;

        if (
          !index.has(sleutel)
        ) {
          index.set(
            sleutel,
            []
          );
        }

        const opties =
          index.get(sleutel);

        if (
          !opties.includes(
            antwoord
          )
        ) {
          opties.push(
            antwoord
          );
        }
      }
    }

    // Bij meerdere mogelijke dieren
    // wordt de naam geaccepteerd.
    //
    // Het laagste puntenaantal krijgt
    // voorrang, zodat een algemene
    // dubbelzinnige naam niet automatisch
    // een zeldzame raket oplevert.

    for (
      const [naam, opties] of
      index.entries()
    ) {

      opties.sort(
        (a, b) =>
          a.points - b.points ||
          a.answer.localeCompare(
            b.answer,
            "nl"
          )
      );

      if (opties.length > 1) {

        indexConflictenV9Dieren.push({
          vraagnummer:
            vraag.questionNumber,

          invoer: naam,

          mogelijkeDieren:
            opties.map(
              optie =>
                optie.answer
            )
        });
      }
    }

    antwoordIndexV9Dieren.set(
      vraag.questionNumber,
      index
    );
  }

  // ============================================================
  // DIRECT EEN ANTWOORD CONTROLEREN
  // ============================================================

  function controleerV9Dieren(
    vraagnummer,
    invoer
  ) {

    const nummer =
      Number(vraagnummer);

    const index =
      antwoordIndexV9Dieren.get(
        nummer
      );

    if (!index) {
      return {
        valid: false,
        reason: "unknown-question"
      };
    }

    const sleutel =
      normaliseerAntwoordV9Dieren(
        invoer
      );

    if (!sleutel) {
      return {
        valid: false,
        reason: "empty-answer"
      };
    }

    const opties =
      index.get(sleutel);

    if (
      !opties ||
      !opties.length
    ) {
      return {
        valid: false,
        reason: "unknown-answer"
      };
    }

    const antwoord =
      opties[0];

    return {
      valid: true,

      answer:
        antwoord.answer,

      aliases: [
        ...antwoord.aliases
      ],

      points:
        antwoord.points,

      isRocket:
        antwoord.isRocket,

      ambiguous:
        opties.length > 1,

      alternatives:
        opties.map(
          optie =>
            optie.answer
        )
    };
  }

  // ============================================================
  // ANTWOORDEN MET EEN BEPAALDE LETTER
  // ============================================================

  function antwoordenMetLetterV9Dieren(
    vraagnummer,
    letter
  ) {

    const vraag =
      definitieveVragenV9Dieren.find(
        item =>
          item.questionNumber ===
          Number(vraagnummer)
      );

    if (!vraag) {
      return [];
    }

    const beginletter =
      normaliseerAntwoordV9Dieren(
        letter
      );

    if (
      !/^[a-z]$/.test(beginletter)
    ) {
      return [];
    }

    const resultaten = [];

    for (
      const antwoord of vraag.answers
    ) {

      const namen = [
        antwoord.answer,
        ...antwoord.aliases
      ].filter(
        naam =>
          normaliseerAntwoordV9Dieren(
            naam
          ).startsWith(beginletter)
      );

      if (!namen.length) {
        continue;
      }

      const uniekeNamen =
        [...new Set(namen)];

      resultaten.push({
        answer:
          uniekeNamen[0],

        aliases:
          uniekeNamen.slice(1),

        originalAnswer:
          antwoord.answer,

        points:
          antwoord.points,

        isRocket:
          antwoord.isRocket
      });
    }

    // Binnen de lettervariant
    // worden de raketten opnieuw verdeeld.

    resultaten.sort(
      (a, b) =>
        a.points - b.points ||
        hashV9Dieren(a.answer) -
          hashV9Dieren(b.answer)
    );

    const totaal =
      resultaten.length;

    const raketten =
      rakettenV9Dieren(totaal);

    const normaal =
      totaal - raketten;

    return resultaten.map(
      (antwoord, index) => {

        const isRocket =
          index >= normaal;

        const points =
          isRocket
            ? 100
            : normaal <= 1
              ? 10
              : 10 +
                Math.round(
                  index /
                    (normaal - 1) *
                    89
                );

        return {
          ...antwoord,
          points,
          isRocket
        };
      }
    );
  }

  // ============================================================
  // BESCHIKBARE LETTERS
  // ============================================================

  function beschikbareLettersV9Dieren(
    vraagnummer,
    minimum = 5
  ) {

    const alfabet =
      "abcdefghijklmnopqrstuvwxyz";

    const resultaten = [];

    for (
      const letter of alfabet
    ) {

      const antwoorden =
        antwoordenMetLetterV9Dieren(
          vraagnummer,
          letter
        );

      if (
        antwoorden.length >= minimum
      ) {

        resultaten.push({
          letter:
            letter.toUpperCase(),

          aantal:
            antwoorden.length,

          raketten:
            rakettenV9Dieren(
              antwoorden.length
            )
        });
      }
    }

    return resultaten;
  }

  // ============================================================
  // DEFINITIEF VOORTGANGSRAPPORT
  // ============================================================

  const eindrapportV9Dieren =
    definitieveVragenV9Dieren.map(
      vraag => {

        const totaal =
          vraag.answers.length;

        const raketten =
          vraag.answers.filter(
            antwoord =>
              antwoord.isRocket
          ).length;

        const gewoneAntwoorden =
          totaal - raketten;

        return {
          nummer:
            vraag.questionNumber,

          vraag:
            vraag.question,

          antwoorden:
            totaal,

          normaal:
            gewoneAntwoorden,

          raketten,

          ontbrekend:
            Math.max(
              0,
              DIEREN_V9_STREEFAANTAL -
                totaal
            ),

          doelBereikt:
            totaal >=
            DIEREN_V9_STREEFAANTAL,

          voortgang:
            Math.min(
              100,
              Math.round(
                totaal /
                  DIEREN_V9_STREEFAANTAL *
                  100
              )
            ) + "%"
        };
      }
    );

  // ============================================================
  // CONTROLE VAN DE DEFINITIEVE PUNTEN
  // ============================================================

  const exportFoutenV9Dieren = [];

  if (
    definitieveVragenV9Dieren.length !== 50
  ) {
    exportFoutenV9Dieren.push({
      fout:
        "De categorie moet 50 vragen bevatten."
    });
  }

  const gebruikteVraagIdsV9Dieren =
    new Set();

  for (
    const vraag of
    definitieveVragenV9Dieren
  ) {

    if (
      gebruikteVraagIdsV9Dieren.has(
        vraag.id
      )
    ) {
      exportFoutenV9Dieren.push({
        vraag: vraag.id,
        fout: "Dubbel vraag-ID"
      });
    }

    gebruikteVraagIdsV9Dieren.add(
      vraag.id
    );

    if (
      !vraag.answers.length
    ) {
      exportFoutenV9Dieren.push({
        vraag: vraag.id,
        fout: "Geen antwoorden beschikbaar"
      });

      continue;
    }

    const verwachtAantalRaketten =
      rakettenV9Dieren(
        vraag.answers.length
      );

    const werkelijkAantalRaketten =
      vraag.answers.filter(
        antwoord =>
          antwoord.isRocket
      ).length;

    if (
      verwachtAantalRaketten !==
      werkelijkAantalRaketten
    ) {
      exportFoutenV9Dieren.push({
        vraag: vraag.id,

        fout:
          "Onjuist aantal raketten",

        verwacht:
          verwachtAantalRaketten,

        werkelijk:
          werkelijkAantalRaketten
      });
    }

    const gebruikteNamen =
      new Set();

    for (
      const antwoord of
      vraag.answers
    ) {

      const sleutel =
        normaliseerAntwoordV9Dieren(
          antwoord.answer
        );

      if (
        gebruikteNamen.has(
          sleutel
        )
      ) {
        exportFoutenV9Dieren.push({
          vraag: vraag.id,

          antwoord:
            antwoord.answer,

          fout:
            "Dubbel canoniek antwoord"
        });
      }

      gebruikteNamen.add(
        sleutel
      );

      if (
        !Number.isInteger(
          antwoord.points
        ) ||
        antwoord.points < 10 ||
        antwoord.points > 100
      ) {
        exportFoutenV9Dieren.push({
          vraag: vraag.id,

          antwoord:
            antwoord.answer,

          fout:
            "Ongeldige puntenwaarde"
        });
      }

      if (
        antwoord.isRocket &&
        antwoord.points !== 100
      ) {
        exportFoutenV9Dieren.push({
          vraag: vraag.id,

          antwoord:
            antwoord.answer,

          fout:
            "Raket moet 100 punten zijn"
        });
      }

      if (
        !antwoord.isRocket &&
        antwoord.points === 100
      ) {
        exportFoutenV9Dieren.push({
          vraag: vraag.id,

          antwoord:
            antwoord.answer,

          fout:
            "Normaal antwoord heeft 100 punten"
        });
      }

      const controle =
        controleerV9Dieren(
          vraag.questionNumber,
          antwoord.answer
        );

      if (!controle.valid) {
        exportFoutenV9Dieren.push({
          vraag: vraag.id,

          antwoord:
            antwoord.answer,

          fout:
            "Antwoord ontbreekt in zoekindex"
        });
      }
    }
  }

  // ============================================================
  // RAKETFORMULE TESTEN
  // ============================================================

  const raketTestsV9Dieren = [

    [0, 0],
    [1, 1],
    [25, 1],
    [50, 1],
    [51, 2],
    [100, 2],
    [150, 2],
    [151, 3],
    [250, 3],
    [251, 4],
    [350, 4],
    [351, 5],
    [450, 5],
    [451, 6],
    [550, 6],
    [551, 7],
    [650, 7],
    [651, 8],
    [750, 8],
    [751, 9],
    [850, 9],
    [851, 10],
    [950, 10],
    [951, 11],
    [1000, 11],
    [1050, 11],
    [1051, 12],
    [1500, 16],
    [2000, 21],
    [5000, 51]

  ].map(
    ([aantal, verwacht]) => {

      const resultaat =
        rakettenV9Dieren(aantal);

      return {
        antwoorden: aantal,
        verwacht,
        resultaat,
        geslaagd:
          verwacht === resultaat
      };
    }
  );

  // ============================================================
  // DEFINITIEVE ANTWOORDTESTEN
  // ============================================================

  const definitieveTestsV9Dieren =
    testgevallenDierenDeel9.map(
      ([nummer, invoer, verwacht]) => {

        const resultaat =
          controleerV9Dieren(
            nummer,
            invoer
          );

        return {
          nummer,
          invoer,
          verwacht,

          resultaat:
            resultaat.valid,

          geslaagd:
            verwacht ===
            resultaat.valid
        };
      }
    );

  const mislukteEindtestsV9Dieren =
    definitieveTestsV9Dieren.filter(
      test => !test.geslaagd
    );

  // ============================================================
  // SAMENVATTING
  // ============================================================

  const samenvattingV9Dieren = {

    versie:
      DIEREN_V9_VERSIE,

    categorie:
      "Dieren",

    vragen:
      definitieveVragenV9Dieren.length,

    opgeslagenDierrecords:
      database.size,

    bruikbareDierrecords:
      definitieveDierenV9.length,

    totaalVraagAntwoorden:
      eindrapportV9Dieren.reduce(
        (totaal, vraag) =>
          totaal + vraag.antwoorden,
        0
      ),

    totaalRaketten:
      eindrapportV9Dieren.reduce(
        (totaal, vraag) =>
          totaal + vraag.raketten,
        0
      ),

    gemiddeldAantalAntwoorden:
      Math.round(
        eindrapportV9Dieren.reduce(
          (totaal, vraag) =>
            totaal + vraag.antwoorden,
          0
        ) /
        Math.max(
          1,
          eindrapportV9Dieren.length
        )
      ),

    vragenMet1000Antwoorden:
      eindrapportV9Dieren.filter(
        vraag => vraag.doelBereikt
      ).length,

    vragenOnder1000:
      eindrapportV9Dieren.filter(
        vraag => !vraag.doelBereikt
      ).length,

    geslaagdeAntwoordtests:
      definitieveTestsV9Dieren.filter(
        test => test.geslaagd
      ).length,

    mislukteAntwoordtests:
      mislukteEindtestsV9Dieren.length,

    raketTestsGeslaagd:
      raketTestsV9Dieren.every(
        test => test.geslaagd
      ),

    exportFouten:
      exportFoutenV9Dieren.length,

    naamconflicten:
      indexConflictenV9Dieren.length,

    ongeldigeRecords:
      ongeldigeRecordsV9Dieren.length,

    inhoudOnafhankelijkGecontroleerd:
      false,

    puntenGebaseerdOpSpelersdata:
      false

  };

  // ============================================================
  // TECHNISCHE GEREEDHEID
  // ============================================================

  const technischGereedV9Dieren =
    exportFoutenV9Dieren.length === 0 &&
    mislukteEindtestsV9Dieren.length === 0 &&
    ongeldigeRecordsV9Dieren.length === 0 &&
    structuurFoutenDeel9.length === 0 &&
    raketTestsV9Dieren.every(
      test => test.geslaagd
    );

  // Technisch gereed betekent niet
  // automatisch biologisch gecontroleerd.
  //
  // De gegevens blijven voorlopig
  // een conceptdatabase.

  // ============================================================
  // CENTRALE V9 CATEGORIE-EXPORT
  // ============================================================

  window.QB_V9_CATEGORIEEN =
    window.QB_V9_CATEGORIEEN ||
    Object.create(null);

  window.QB_V9_CATEGORIEEN["Dieren"] = {

    version:
      DIEREN_V9_VERSIE,

    category:
      "Dieren",

    status:
      "concept",

    technicallyReady:
      technischGereedV9Dieren,

    contentVerified:
      false,

    questions:
      definitieveVragenV9Dieren,

    summary:
      samenvattingV9Dieren,

    report:
      eindrapportV9Dieren,

    check:
      controleerV9Dieren,

    letterAnswers:
      antwoordenMetLetterV9Dieren,

    availableLetters:
      beschikbareLettersV9Dieren

  };

  // ============================================================
  // EXTRA DIRECTE EXPORT
  // ============================================================

  window.QB_V9_DIeren = {

    version:
      DIEREN_V9_VERSIE,

    questions:
      definitieveVragenV9Dieren,

    summary:
      samenvattingV9Dieren,

    check:
      controleerV9Dieren,

    letterAnswers:
      antwoordenMetLetterV9Dieren,

    availableLetters:
      beschikbareLettersV9Dieren

  };

  // ============================================================
  // DEBUG EN CONTROLE
  // ============================================================

  window.QB_V9_DIeren_DEBUG = {

    samenvatting() {

      console.table(
        samenvattingV9Dieren
      );

      return {
        ...samenvattingV9Dieren
      };
    },

    rapport() {

      console.table(
        eindrapportV9Dieren
      );

      return eindrapportV9Dieren;
    },

    tekorten() {

      const resultaten =
        [...eindrapportV9Dieren]
          .filter(
            vraag =>
              vraag.ontbrekend > 0
          )
          .sort(
            (a, b) =>
              b.ontbrekend -
              a.ontbrekend
          );

      console.table(resultaten);

      return resultaten;
    },

    grootsteVragen() {

      const resultaten =
        [...eindrapportV9Dieren]
          .sort(
            (a, b) =>
              b.antwoorden -
              a.antwoorden
          );

      console.table(resultaten);

      return resultaten;
    },

    kleinsteVragen() {

      const resultaten =
        [...eindrapportV9Dieren]
          .sort(
            (a, b) =>
              a.antwoorden -
              b.antwoorden
          );

      console.table(resultaten);

      return resultaten;
    },

    vraag(nummer) {

      return definitieveVragenV9Dieren.find(
        vraag =>
          vraag.questionNumber ===
          Number(nummer)
      ) || null;
    },

    antwoorden(nummer) {

      const vraag =
        this.vraag(nummer);

      if (!vraag) {
        return [];
      }

      console.table(
        vraag.answers
      );

      return vraag.answers;
    },

    raketten(nummer) {

      const vraag =
        this.vraag(nummer);

      if (!vraag) {
        return [];
      }

      const resultaten =
        vraag.answers.filter(
          antwoord =>
            antwoord.isRocket
        );

      console.table(resultaten);

      return resultaten;
    },

    punten(nummer) {

      const vraag =
        this.vraag(nummer);

      if (!vraag) {
        return [];
      }

      const resultaten =
        [...vraag.answers]
          .sort(
            (a, b) =>
              a.points -
              b.points
          );

      console.table(resultaten);

      return resultaten;
    },

    check(nummer, invoer) {

      const resultaat =
        controleerV9Dieren(
          nummer,
          invoer
        );

      console.log(resultaat);

      return resultaat;
    },

    letters(nummer) {

      const resultaten =
        beschikbareLettersV9Dieren(
          nummer
        );

      console.table(resultaten);

      return resultaten;
    },

    letter(nummer, letter) {

      const resultaten =
        antwoordenMetLetterV9Dieren(
          nummer,
          letter
        );

      console.table(resultaten);

      return resultaten;
    },

    tests() {

      console.table(
        definitieveTestsV9Dieren
      );

      return definitieveTestsV9Dieren;
    },

    mislukteTests() {

      console.table(
        mislukteEindtestsV9Dieren
      );

      return mislukteEindtestsV9Dieren;
    },

    raketTests() {

      console.table(
        raketTestsV9Dieren
      );

      return raketTestsV9Dieren;
    },

    fouten() {

      console.table(
        exportFoutenV9Dieren
      );

      return exportFoutenV9Dieren;
    },

    naamconflicten() {

      console.table(
        indexConflictenV9Dieren
      );

      return indexConflictenV9Dieren;
    },

    ontbrekendeNamen() {

      return [
        ...ontbrekendeNamenDeel9
      ].sort();
    },

    technischGereed() {

      return technischGereedV9Dieren;
    },

    snelheid(
      nummer = 1,
      invoer = "Goudvis",
      herhalingen = 1000
    ) {

      const aantal =
        Math.max(
          1,
          Math.min(
            10000,
            Math.floor(
              Number(herhalingen) || 1000
            )
          )
        );

      const start =
        performance.now();

      for (
        let i = 0;
        i < aantal;
        i++
      ) {
        controleerV9Dieren(
          nummer,
          invoer
        );
      }

      const duur =
        performance.now() -
        start;

      const resultaat = {

        aantal,

        totaleMilliseconden:
          Number(
            duur.toFixed(4)
          ),

        gemiddeldPerControle:
          Number(
            (duur / aantal)
              .toFixed(6)
          )

      };

      console.table(resultaat);

      return resultaat;
    }

  };

  // ============================================================
  // EINDRAPPORT IN DE BROWSERCONSOLE
  // ============================================================

  console.group(
    "🎈 QuizBallon V9 - Dieren"
  );

  console.log(
    "Versie:",
    DIEREN_V9_VERSIE
  );

  console.table(
    samenvattingV9Dieren
  );

  console.log(
    "Overzicht van alle 50 vragen:"
  );

  console.table(
    eindrapportV9Dieren
  );

  console.log(
    "Vragen met de grootste tekorten:"
  );

  console.table(
    [...eindrapportV9Dieren]
      .sort(
        (a, b) =>
          b.ontbrekend -
          a.ontbrekend
      )
      .slice(0, 15)
  );

  if (
    mislukteEindtestsV9Dieren.length
  ) {

    console.warn(
      "Mislukte antwoordtests:"
    );

    console.table(
      mislukteEindtestsV9Dieren
    );
  }

  if (
    exportFoutenV9Dieren.length
  ) {

    console.error(
      "Exportfouten:"
    );

    console.table(
      exportFoutenV9Dieren
    );
  }

  if (
    technischGereedV9Dieren
  ) {

    console.log(
      "✅ Technische exportcontroles geslaagd."
    );

  } else {

    console.warn(
      "⚠️ Technische controles vereisen aandacht."
    );
  }

  console.warn(
    "V9 Dieren is nog een conceptdatabase. " +
    "De biologische inhoud moet nog worden " +
    "gecontroleerd voordat V9 actief wordt."
  );

  console.log(
    "V8 is niet vervangen."
  );

  console.groupEnd();

  // ============================================================
  // EINDE QUIZBALLON V9 - DIEREN
  // ============================================================

})();
