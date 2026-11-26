/* ==========================================
   QUIZBALLON
   VRAGENBANK

   Alle vragen zijn Nederlandstalig.

   Antwoordformaat:
   "antwoord|punten|alternatieve naam"

   Punten: 1 t/m 100

   Deze eerste versie gebruikt een
   gecontroleerde, uitbreidbare lijst.
========================================== */

const QUIZ_QUESTIONS = [


  /* ========================================
     1. VOGELS
  ======================================== */

  {
    category: "🐦 DIEREN",
    question: "Noem een vogelsoort die in het wild buiten Nederland voorkomt.",
    hint: "Denk aan tropische vogels, bijzondere loopvogels en vogels uit verre landen.",

    answers: [
      "Flamingo|12",
      "Toekan|25",
      "Papegaaiduiker|30",
      "Ara|18|Macaw",
      "Kolibrie|20",
      "Pinguïn|10|Pinguin",
      "Struisvogel|12",
      "Emoe|33",
      "Kasuaris|78",
      "Kakapo|96|Kākāpō",
      "Kiwi|38",
      "Schoenbekooievaar|92|Schoenbekooievogel",
      "Hoatzin|100",
      "Kea|85",
      "Secretarisvogel|75",
      "Paradijsvogel|62",
      "Quetzal|85",
      "Harpyarend|84",
      "Andescondor|65",
      "Nandoe|65",
      "Kookaburra|70",
      "Zonneroerdomp|95",
      "Zuidelijke hoornraaf|94",
      "Bijeneter|45",
      "Neushoornvogel|55",
      "Wenkbrauwalbatros|92",
      "Koningspinguïn|45|Koningspinguin",
      "Keizerspinguïn|35|Keizerspinguin",
      "Blauwvoetgent|73",
      "Roodpootgent|81",
      "Grote fregatvogel|85",
      "Zwartvoetpinguïn|72|Zwartvoetpinguin",
      "Roodkuiftoerako|85",
      "Helmkasuaris|88",
      "Zuidelijke rotspinguïn|91|Zuidelijke rotspinguin",
      "Zuidelijke grondneushoornvogel|96",
      "Lammergier|63",
      "Zwarte wouw|54",
      "Amerikaanse zeearend|39|Witkopzeearend",
      "Monniksgier|71"
    ]
  },


  /* ========================================
     2. LANDEN
  ======================================== */

  {
    category: "🌍 AARDRIJKSKUNDE",
    question: "Noem een land in Afrika.",
    hint: "Er zijn meer dan vijftig internationaal erkende landen in Afrika.",

    answers: [
      "Egypte|8",
      "Marokko|8",
      "Zuid-Afrika|10|Zuid Afrika",
      "Nigeria|15",
      "Kenia|12",
      "Tanzania|22",
      "Ghana|25",
      "Ethiopië|30|Ethiopie",
      "Tunesië|15|Tunesie",
      "Algerije|25",
      "Libië|24|Libie",
      "Soedan|36",
      "Zuid-Soedan|68|Zuid Soedan",
      "Oeganda|35",
      "Rwanda|38",
      "Burundi|64",
      "Senegal|32",
      "Mali|48",
      "Niger|57",
      "Tsjaad|65",
      "Benin|67",
      "Togo|72",
      "Gabon|73",
      "Kameroen|34",
      "Angola|38",
      "Namibië|44|Namibie",
      "Botswana|51",
      "Zimbabwe|37",
      "Zambia|44",
      "Mozambique|52",
      "Malawi|62",
      "Madagaskar|34",
      "Mauritius|59",
      "Seychellen|73",
      "Comoren|94",
      "Djibouti|90",
      "Eritrea|76",
      "Somalië|57|Somalie",
      "Lesotho|86",
      "Eswatini|93|Swaziland",
      "Gambia|49",
      "Guinee|65",
      "Guinee-Bissau|96|Guinee Bissau",
      "Sierra Leone|66",
      "Liberia|62",
      "Ivoorkust|32|Côte d'Ivoire",
      "Burkina Faso|58",
      "Centraal-Afrikaanse Republiek|90",
      "Democratische Republiek Congo|51|DR Congo",
      "Republiek Congo|70|Congo-Brazzaville",
      "Equatoriaal-Guinea|92",
      "Sao Tomé en Principe|99|São Tomé en Príncipe",
      "Kaapverdië|71|Cabo Verde",
      "Mauritanië|68|Mauritanie"
    ]
  },


  /* ========================================
     3. OCEAANDIEREN
  ======================================== */

  {
    category: "🐠 NATUUR",
    question: "Noem een dier dat in zee leeft.",
    hint: "Van bekende vissen tot bijzondere diepzeedieren.",

    answers: [
      "Haai|8",
      "Dolfijn|7",
      "Walvis|8",
      "Orka|12",
      "Zeeschildpad|13",
      "Clownvis|15",
      "Octopus|17",
      "Inktvis|20",
      "Zeester|12",
      "Zeepaardje|17",
      "Kwal|11",
      "Rog|23",
      "Mantarog|30",
      "Hamerhaai|21",
      "Walvishaai|34",
      "Witte haai|18",
      "Zeeleeuw|17",
      "Zeehond|13",
      "Walrus|27",
      "Zeeduivel|57",
      "Lantaarnvis|76",
      "Zeedraak|64",
      "Spookhaai|87",
      "Blobvis|78",
      "Kogelvis|32",
      "Maanvis|44",
      "Narwal|54",
      "Beluga|47",
      "Potvis|40",
      "Blauwe vinvis|25",
      "Bultrug|30",
      "Reuzeninktvis|58",
      "Kolossale inktvis|89",
      "Vampiervinktvis|94",
      "Degenkrab|74",
      "Koraalduivel|51",
      "Koraalpoliep|65",
      "Zeekomkommer|68",
      "Zee-egel|38",
      "Anemoonvis|25",
      "Murene|55",
      "Napoleonvis|73",
      "Dugong|89",
      "Zeekoe|65",
      "Doopvontschelp|92",
      "Pijlstaartrog|43",
      "Vioolrog|83",
      "Kammossel|64",
      "Pistoolgarnaal|95",
      "Bidsprinkhaankreeft|97"
    ]
  },


  /* ========================================
     4. EUROPESE LANDEN
  ======================================== */

  {
    category: "🗺️ AARDRIJKSKUNDE",
    question: "Noem een land dat geheel of gedeeltelijk in Europa ligt.",
    hint: "Ook kleine Europese landen zijn geldig.",

    answers: [
      "Nederland|5",
      "België|5|Belgie",
      "Duitsland|5",
      "Frankrijk|5",
      "Spanje|6",
      "Italië|6|Italie",
      "Portugal|9",
      "Verenigd Koninkrijk|7|Engeland",
      "Ierland|11",
      "Denemarken|12",
      "Zweden|13",
      "Noorwegen|13",
      "Finland|18",
      "IJsland|21",
      "Zwitserland|11",
      "Oostenrijk|10",
      "Polen|15",
      "Tsjechië|23|Tsjechie",
      "Slowakije|29",
      "Hongarije|22",
      "Kroatië|24|Kroatie",
      "Slovenië|37|Slovenie",
      "Bosnië en Herzegovina|49|Bosnie en Herzegovina",
      "Servië|39|Servie",
      "Montenegro|62",
      "Albanië|38|Albanie",
      "Noord-Macedonië|67|Noord Macedonie",
      "Griekenland|15",
      "Bulgarije|28",
      "Roemenië|26|Roemenie",
      "Moldavië|71|Moldavie",
      "Oekraïne|26|Oekraine",
      "Wit-Rusland|59|Belarus",
      "Litouwen|46",
      "Letland|49",
      "Estland|51",
      "Luxemburg|25",
      "Malta|52",
      "Cyprus|47",
      "Andorra|75",
      "Monaco|62",
      "San Marino|84",
      "Vaticaanstad|72",
      "Liechtenstein|94",
      "Rusland|14",
      "Turkije|20",
      "Georgië|80|Georgie",
      "Armenië|82|Armenie",
      "Azerbeidzjan|90",
      "Kazachstan|92"
    ]
  },


  /* ========================================
     5. VRUCHTEN
  ======================================== */

  {
    category: "🍍 ETEN",
    question: "Noem een fruitsoort.",
    hint: "Denk ook aan exotisch fruit dat je niet overal kunt kopen.",

    answers: [
      "Appel|5",
      "Banaan|5",
      "Peer|9",
      "Aardbei|7",
      "Druif|8",
      "Sinaasappel|6",
      "Mandarijn|8",
      "Citroen|9",
      "Limoen|15",
      "Kiwi|11",
      "Mango|12",
      "Ananas|10",
      "Watermeloen|12",
      "Meloen|16",
      "Framboos|17",
      "Braam|18",
      "Blauwe bes|19",
      "Kers|16",
      "Perzik|19",
      "Nectarine|23",
      "Abrikoos|27",
      "Pruim|21",
      "Vijg|35",
      "Granaatappel|26",
      "Papaja|35|Papaya",
      "Passievrucht|28",
      "Kokosnoot|18",
      "Guave|44",
      "Lychee|43|Litchi",
      "Ramboetan|72",
      "Doerian|60|Durian",
      "Jackfruit|58",
      "Mangosteen|79",
      "Kaki|55|Sharonfruit",
      "Stervrucht|50|Carambola",
      "Drakenvrucht|42|Pitaja",
      "Kumquat|64",
      "Tamarillo|88",
      "Cherimoya|93",
      "Salak|94",
      "Longan|84",
      "Feijoa|96",
      "Loquat|95",
      "Jabuticaba|100",
      "Physalis|65|Goudbes",
      "Acerola|82",
      "Cactusvijg|62",
      "Broodvrucht|87"
    ]
  },


  /* ========================================
     6. HOOFDSTEDEN
  ======================================== */

  {
    category: "🏙️ AARDRIJKSKUNDE",
    question: "Noem een hoofdstad van een Europees land.",
    hint: "Bijvoorbeeld een bekende hoofdstad of die van een klein land.",

    answers: [
      "Amsterdam|5",
      "Brussel|6",
      "Berlijn|5",
      "Parijs|5",
      "Londen|5",
      "Madrid|6",
      "Rome|6",
      "Lissabon|11",
      "Dublin|13",
      "Kopenhagen|14",
      "Stockholm|15",
      "Oslo|15",
      "Helsinki|17",
      "Reykjavik|29|Reykjavík",
      "Bern|33",
      "Wenen|12",
      "Warschau|17",
      "Praag|20",
      "Bratislava|43",
      "Boedapest|16",
      "Zagreb|37",
      "Ljubljana|65",
      "Sarajevo|45",
      "Belgrado|39",
      "Podgorica|87",
      "Tirana|50",
      "Skopje|80",
      "Athene|15",
      "Sofia|39",
      "Boekarest|30",
      "Chisinau|87|Chișinău",
      "Kyiv|36|Kiev",
      "Minsk|52",
      "Vilnius|50",
      "Riga|50",
      "Tallinn|54",
      "Luxemburg|31",
      "Valletta|71",
      "Nicosia|62",
      "Andorra la Vella|91",
      "Monaco|66",
      "San Marino|85",
      "Vaticaanstad|78",
      "Vaduz|100"
    ]
  },


  /* ========================================
     7. HONDENRASSEN
  ======================================== */

  {
    category: "🐕 DIEREN",
    question: "Noem een hondenras.",
    hint: "Kleine honden, grote honden en bijzondere rassen zijn welkom.",

    answers: [
      "Labrador retriever|6|Labrador",
      "Golden retriever|7",
      "Duitse herder|8",
      "Chihuahua|8",
      "Poedel|9",
      "Teckel|12",
      "Beagle|13",
      "Bordercollie|16|Border collie",
      "Jackrussellterriër|17|Jack Russell",
      "Husky|18|Siberische husky",
      "Dalmatiër|15|Dalmatier",
      "Boxer|20",
      "Dobermann|23",
      "Rottweiler|19",
      "Buldog|18|Bulldog",
      "Franse bulldog|12|Franse buldog",
      "Engelse bulldog|21|Engelse buldog",
      "Shiba inu|25",
      "Akita|28|Akita inu",
      "Corgi|18|Welsh corgi",
      "Mopshond|17",
      "Maltezer|28",
      "Bichon frisé|49|Bichon frise",
      "Whippet|47",
      "Greyhound|43",
      "Weimaraner|52",
      "Berner sennenhond|26",
      "Newfoundlander|40",
      "Sint-bernard|32|Sint bernard",
      "Leonberger|58",
      "Samoyeed|51",
      "Basenji|79",
      "Azawakh|95",
      "Saluki|73",
      "Komondor|91",
      "Puli|87",
      "Xoloitzcuintle|100",
      "Chinese gekuifde naakthond|86",
      "Noorse lundehond|98",
      "Tibetaanse mastiff|67",
      "Keeshond|39",
      "Schipperke|71",
      "Barsoi|76",
      "Kuvasz|94",
      "Cane corso|39",
      "Vizsla|57"
    ]
  },


  /* ========================================
     8. SPORTEN
  ======================================== */

  {
    category: "⚽ SPORT",
    question: "Noem een sport die op de Olympische Zomerspelen wordt beoefend.",
    hint: "Denk aan teamsporten, individuele sporten en minder bekende disciplines.",

    answers: [
      "Atletiek|5",
      "Zwemmen|6",
      "Voetbal|7",
      "Basketbal|10",
      "Volleybal|11",
      "Beachvolleybal|24",
      "Tennis|9",
      "Tafeltennis|21",
      "Badminton|17",
      "Hockey|12",
      "Handbal|15",
      "Rugby sevens|33",
      "Waterpolo|20",
      "Wielrennen|13",
      "Baanwielrennen|27",
      "Mountainbiken|30",
      "BMX|22",
      "Turnen|12",
      "Ritmische gymnastiek|36",
      "Trampolinespringen|43",
      "Judo|17",
      "Boksen|15",
      "Worstelen|32",
      "Taekwondo|26",
      "Schermen|35",
      "Roeien|20",
      "Kanoën|28|Kanoen",
      "Zeilen|25",
      "Surfen|25",
      "Skateboarden|29",
      "Sportklimmen|39",
      "Boogschieten|30",
      "Schietsport|34",
      "Gewichtheffen|29",
      "Triatlon|24",
      "Golf|20",
      "Paardensport|19",
      "Vijfkamp|76|Moderne vijfkamp",
      "Breaking|72",
      "Marathonzwemmen|56"
    ]
  },


  /* ========================================
     9. WERELDSTEDEN
  ======================================== */

  {
    category: "🏙️ WERELD",
    question: "Noem een stad in Japan.",
    hint: "Japan heeft veel meer steden dan alleen Tokio en Osaka.",

    answers: [
      "Tokio|5|Tokyo",
      "Osaka|9",
      "Kyoto|11",
      "Hiroshima|15",
      "Nagasaki|22",
      "Yokohama|17",
      "Nagoya|22",
      "Sapporo|24",
      "Kobe|22",
      "Nara|23",
      "Fukuoka|29",
      "Kawasaki|35",
      "Sendai|39",
      "Chiba|45",
      "Kanazawa|52",
      "Nikko|53|Nikkō",
      "Kamakura|54",
      "Takayama|60",
      "Hakodate|63",
      "Okinawa|49",
      "Naha|70",
      "Niigata|73",
      "Shizuoka|65",
      "Matsumoto|74",
      "Himeji|67",
      "Kumamoto|69",
      "Okayama|74",
      "Takamatsu|82",
      "Matsuyama|87",
      "Kochi|79|Kōchi",
      "Oita|83|Ōita",
      "Beppu|80",
      "Aomori|82",
      "Akita|84",
      "Morioka|91",
      "Yamagata|94",
      "Toyama|89",
      "Tottori|96",
      "Fukui|95",
      "Utsunomiya|97",
      "Maebashi|98",
      "Kofu|99|Kōfu",
      "Yamaguchi|94",
      "Saga|91",
      "Miyazaki|83",
      "Kagoshima|76"
    ]
  },


  /* ========================================
     10. PLANETEN EN MANEN
  ======================================== */

  {
    category: "🪐 RUIMTE",
    question: "Noem een natuurlijke maan in ons zonnestelsel.",
    hint: "Niet alleen onze maan telt: ook andere planeten hebben manen.",

    answers: [
      "Maan|5|De maan|Luna",
      "Europa|20",
      "Io|21",
      "Ganymedes|25",
      "Callisto|30",
      "Titan|18",
      "Enceladus|32",
      "Triton|36",
      "Phobos|32",
      "Deimos|35",
      "Rhea|52",
      "Dione|56",
      "Tethys|61",
      "Mimas|58",
      "Iapetus|62",
      "Hyperion|69",
      "Phoebe|75",
      "Miranda|69",
      "Ariel|60",
      "Umbriel|74",
      "Titania|59",
      "Oberon|63",
      "Nereid|82",
      "Proteus|82",
      "Charon|46",
      "Nix|78",
      "Hydra|76",
      "Kerberos|91",
      "Styx|88",
      "Amalthea|81",
      "Himalia|85",
      "Elara|91",
      "Pasiphae|96",
      "Sinope|95",
      "Carme|95",
      "Metis|90",
      "Adrastea|97",
      "Thebe|88",
      "Janus|82",
      "Epimetheus|93",
      "Atlas|87",
      "Prometheus|84",
      "Pandora|85",
      "Pan|84"
    ]
  },


  /* ========================================
     11. MUZIEKINSTRUMENTEN
  ======================================== */

  {
    category: "🎵 MUZIEK",
    question: "Noem een muziekinstrument.",
    hint: "Ook traditionele instrumenten uit andere landen tellen mee.",

    answers: [
      "Piano|5",
      "Gitaar|5",
      "Viool|7",
      "Drumstel|8",
      "Fluit|10",
      "Blokfluit|12",
      "Dwarsfluit|14",
      "Trompet|9",
      "Trombone|14",
      "Saxofoon|11",
      "Klarinet|15",
      "Hobo|24",
      "Fagot|30",
      "Cello|14",
      "Contrabas|20",
      "Altviool|28",
      "Harp|17",
      "Accordeon|20",
      "Mondharmonica|23",
      "Orgel|17",
      "Keyboard|9",
      "Ukelele|20|Ukulele",
      "Banjo|27",
      "Mandoline|33",
      "Doedelzak|29",
      "Bongo|20",
      "Conga|27",
      "Xylofoon|22",
      "Marimba|38",
      "Vibrafoon|44",
      "Triangel|18",
      "Tamboerijn|20",
      "Castagnetten|38",
      "Klaroen|67",
      "Sitar|43",
      "Tabla|54",
      "Didgeridoo|49",
      "Djembe|33",
      "Kalimba|55",
      "Koto|70",
      "Shamisen|71",
      "Erhu|75",
      "Balalaika|62",
      "Ocarina|69",
      "Theremin|80",
      "Nyckelharpa|93",
      "Hang|64|Handpan",
      "Duduk|97",
      "Mbira|79"
    ]
  },


  /* ========================================
     12. DINOSAURIËRS
  ======================================== */

  {
    category: "🦖 PREHISTORIE",
    question: "Noem een dinosauriërgeslacht.",
    hint: "Van bekende roofdinosauriërs tot bijzondere planteneters.",

    answers: [
      "Tyrannosaurus|5|Tyrannosaurus rex|T-rex|T rex",
      "Triceratops|7",
      "Velociraptor|9",
      "Stegosaurus|10",
      "Brachiosaurus|12",
      "Diplodocus|15",
      "Spinosaurus|17",
      "Allosaurus|20",
      "Ankylosaurus|17",
      "Apatosaurus|19",
      "Brontosaurus|14",
      "Iguanodon|23",
      "Parasaurolophus|27",
      "Pachycephalosaurus|34",
      "Carnotaurus|27",
      "Giganotosaurus|32",
      "Compsognathus|42",
      "Gallimimus|44",
      "Oviraptor|42",
      "Deinonychus|48",
      "Therizinosaurus|35",
      "Utahraptor|46",
      "Albertosaurus|48",
      "Styracosaurus|50",
      "Kentrosaurus|53",
      "Corythosaurus|56",
      "Edmontosaurus|54",
      "Maiasaura|60",
      "Ceratosaurus|57",
      "Dilophosaurus|34",
      "Coelophysis|63",
      "Plateosaurus|64",
      "Protoceratops|63",
      "Psittacosaurus|65",
      "Mamenchisaurus|69",
      "Argentinosaurus|46",
      "Amargasaurus|77",
      "Microraptor|72",
      "Mononykus|84",
      "Sinosauropteryx|87",
      "Suchomimus|74",
      "Mapusaurus|89",
      "Acrocanthosaurus|80",
      "Herrerasaurus|83",
      "Eoraptor|85",
      "Nigersaurus|79",
      "Baryonyx|61",
      "Sauropelta|92",
      "Muttaburrasaurus|100"
    ]
  },


  /* ========================================
     13. EILANDEN
  ======================================== */

  {
    category: "🏝️ AARDRIJKSKUNDE",
    question: "Noem een eiland in de wereld.",
    hint: "Denk aan bekende vakantie-eilanden én afgelegen eilanden.",

    answers: [
      "Texel|10",
      "Terschelling|17",
      "Ameland|16",
      "Vlieland|24",
      "Schiermonnikoog|30",
      "Mallorca|7",
      "Ibiza|6",
      "Menorca|18",
      "Tenerife|8",
      "Gran Canaria|10",
      "Lanzarote|12",
      "Fuerteventura|15",
      "Madeira|16",
      "Sicilië|12|Sicilie",
      "Sardinië|15|Sardinie",
      "Corsica|19",
      "Kreta|12",
      "Rhodos|11",
      "Kos|13",
      "Corfu|15",
      "Santorini|11",
      "Mykonos|13",
      "Malta|15",
      "Cyprus|12",
      "IJsland|16",
      "Groenland|18",
      "Bali|7",
      "Java|12",
      "Sumatra|24",
      "Borneo|19",
      "Sulawesi|48",
      "Lombok|26",
      "Flores|40",
      "Komodo|44",
      "Madagaskar|15",
      "Mauritius|19",
      "Réunion|31|Reunion",
      "Hawaï|11|Hawaii",
      "Oahu|25|O'ahu",
      "Maui|16",
      "Kauai|38",
      "Tahiti|20",
      "Bora Bora|16",
      "Fiji|21",
      "Samoa|33",
      "Tonga|34",
      "Paaseiland|35|Rapa Nui",
      "Galapagoseilanden|31|Galápagoseilanden",
      "Socotra|84",
      "Tristan da Cunha|94",
      "Bouvetøya|100|Bouvet",
      "Sint-Helena|71|Sint Helena",
      "Pitcairn|92"
    ]
  }

];


/* ==========================================
   VRAGENBANK VOORBEREIDEN

   Zet alle antwoorden om in objecten.
   Daardoor blijft de lijst hierboven
   eenvoudig te onderhouden.
========================================== */

function prepareQuizQuestions() {

  return QUIZ_QUESTIONS.map(function (question) {

    const preparedAnswers = question.answers.map(
      function (answerLine) {

        const parts = answerLine.split("|");

        const mainAnswer = parts[0];

        const points = Math.max(
          1,
          Math.min(100, Number(parts[1]) || 1)
        );

        const aliases = parts.slice(2);

        return {
          answer: mainAnswer,
          points: points,
          aliases: aliases
        };

      }
    );

    return {
      category: question.category,
      question: question.question,
      hint: question.hint,
      answers: preparedAnswers
    };

  });

}


/* ==========================================
   VRAGEN BESCHIKBAAR MAKEN
========================================== */

window.QUIZ_QUESTIONS = prepareQuizQuestions();
