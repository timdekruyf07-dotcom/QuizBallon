/* ===================================================
   QUIZBALLON - VERSIE 4
   SLIMMER ZELDZAAMHEIDSSYSTEEM

   NIEUW:
   - SCORES VAN 10 TOT 100
   - BEKEND IS NIET AUTOMATISCH MAKKELIJK
   - PRECIES 1 RAKETANTWOORD PER VRAAG
   - SCORE OP BASIS VAN VERWACHTE ANTWOORDKANS
   - EXTRA ANTWOORDEN BIJ IEDERE VRAAG

   BEHOUDEN:
   - 10 VRAGEN PER POTJE
   - 25 SECONDEN PER VRAAG
   - ONBEPERKT OPNIEUW PROBEREN
   - SUGGESTIES BIJ TYPEFOUTEN
   - LUCHTBALLON
   - TIJDELIJKE RAKET
   - PLANETEN EN LUCHTZONES
   - PERSOONLIJK RECORD

   WERKT MET:
   index.html
   style.css
   vragen.js
   manifest.webmanifest
=================================================== */

(function () {
  "use strict";


  /* ===================================================
     1. SPELINSTELLINGEN
  =================================================== */

  const QUESTIONS_PER_GAME = 10;
  const SECONDS_PER_QUESTION = 25;

  const KM_PER_POINT = 2;

  const MAX_POSSIBLE_HEIGHT =
    QUESTIONS_PER_GAME * 100 * KM_PER_POINT;

  const RECORD_KEY = "quizballon-record-v1";

  const MAX_SUGGESTIONS = 3;

  const ROCKET_DURATION = 2600;


  /* ===================================================
     2. NIEUWE SCOREGROEPEN

     De namen zijn voor de presentatie.

     De punten zijn NIET meer beperkt
     tot vijf vaste getallen.

     Bijvoorbeeld:
     10, 13, 27, 38, 55, 68, 79, 94, 100.

     Zo krijgt ieder antwoord een
     veel nauwkeurigere waardering.
  =================================================== */

  const SCORE_LEVELS = [
    {
      minimum: 100,
      name: "🚀 RAKETANTWOORD!",
      icon: "🚀",
      description: "Het ultieme antwoord! Je schiet de ruimte in!"
    },
    {
      minimum: 90,
      name: "🌟 TUSSEN DE STERREN!",
      icon: "🌟",
      description: "Bijna niemand zou hier direct aan denken!"
    },
    {
      minimum: 75,
      name: "🪐 BIJNA IN DE RUIMTE!",
      icon: "🪐",
      description: "Een heel verrassend antwoord!"
    },
    {
      minimum: 55,
      name: "☁️ BOVEN DE WOLKEN!",
      icon: "☁️",
      description: "Slim bedacht, dit zeggen niet veel mensen!"
    },
    {
      minimum: 35,
      name: "🎈 MOOIE STIJGING!",
      icon: "🎈",
      description: "Een goed antwoord waar je mooi mee stijgt!"
    },
    {
      minimum: 20,
      name: "🌤️ JE GAAT OMHOOG!",
      icon: "🌤️",
      description: "Goed antwoord, maar het kan origineler!"
    },
    {
      minimum: 0,
      name: "🍃 KLEINE VLUCHT!",
      icon: "🍃",
      description: "Correct! Alleen denken veel mensen hier snel aan."
    }
  ];


  function getScoreLevel(points) {

    return SCORE_LEVELS.find(function (level) {
      return points >= level.minimum;
    });

  }


  /* ===================================================
     3. VASTE RAKETANTWOORDEN

     Precies één antwoord per vraag
     mag 100 punten opleveren.

     De volgorde komt overeen met
     vragen.js.

     Het antwoord kan ook uit de
     uitgebreide antwoordlijst komen.
  =================================================== */

  const ROCKET_ANSWERS = {

    0: "Hoatzin",

    1: "Sao Tomé en Principe",

    2: "Vampiervinktvis",

    3: "Nauru",

    4: "Jabuticaba",

    5: "Sri Jayawardenapura Kotte",

    6: "Xoloitzcuintle",

    7: "Keirin",

    8: "Yokote",

    9: "Kallichore",

    10: "Theorbe",

    11: "Muttaburrasaurus",

    12: "Bouvetøya"

  };


  /* ===================================================
     4. HANDMATIGE SCORECORRECTIES

     Dit is het belangrijkste nieuwe
     onderdeel.

     Een dier kan heel bekend zijn,
     maar toch niet snel worden genoemd.

     Daarom corrigeren we bepaalde
     scores op basis van de vraag.

     Vooral bij de zeedieren is dit
     nu duidelijker uitgewerkt.

     Deze scores worden altijd gebruikt
     in plaats van de oude score.
  =================================================== */

  const SCORE_OVERRIDES = {

    /* VOGELS */

    0: {
      "flamingo": 12,
      "pinguin": 10,
      "struisvogel": 11,
      "kolibrie": 19,
      "toekan": 26,
      "ara": 27,
      "kiwi": 36,
      "emoe": 41,
      "papegaaiduiker": 43,
      "kookaburra": 63,
      "kasuaris": 74,
      "secretarisvogel": 78,
      "schoenbekooievaar": 91,
      "kakapo": 95,
      "hoatzin": 100
    },

    /* AFRIKAANSE LANDEN */

    1: {
      "egypte": 10,
      "marokko": 10,
      "zuid afrika": 12,
      "kenia": 21,
      "nigeria": 23,
      "ghana": 32,
      "tanzania": 39,
      "oeganda": 45,
      "namibie": 56,
      "botswana": 61,
      "lesotho": 82,
      "djibouti": 91,
      "comoren": 96,
      "sao tome en principe": 100
    },

    /* ZEEDIEREN */

    2: {
      "haai": 10,
      "dolfijn": 12,
      "walvis": 18,
      "orka": 22,
      "zeester": 24,
      "kwal": 26,
      "octopus": 29,
      "zeepaardje": 33,
      "zeeschildpad": 38,
      "zeehond": 39,
      "inktvis": 25,
      "clownvis": 31,
      "rog": 44,
      "walrus": 49,
      "zeeleeuw": 55,
      "mantarog": 68,
      "maanvis": 64,
      "beluga": 72,
      "narwal": 79,
      "dugong": 85,
      "reuzeninktvis": 74,
      "kolossale inktvis": 91,
      "goblinhaai": 94,
      "vampiervinktvis": 100
    },

    /* LANDEN WERELDWIJD */

    3: {
      "nederland": 10,
      "belgie": 10,
      "duitsland": 10,
      "frankrijk": 10,
      "spanje": 11,
      "italie": 11,
      "verenigde staten": 10,
      "japan": 16,
      "canada": 18,
      "brazilie": 21,
      "mongolie": 54,
      "bhutan": 83,
      "tuvalu": 94,
      "kiribati": 96,
      "nauru": 100
    },

    /* FRUIT */

    4: {
      "appel": 10,
      "banaan": 10,
      "aardbei": 12,
      "peer": 14,
      "sinaasappel": 14,
      "mango": 19,
      "ananas": 18,
      "kiwi": 22,
      "kers": 27,
      "watermeloen": 28,
      "papaja": 41,
      "guave": 49,
      "lychee": 54,
      "kaki": 61,
      "ramb oetan": 74,
      "ramboetan": 74,
      "mangosteen": 83,
      "cherimoya": 89,
      "feijoa": 95,
      "jabuticaba": 100
    },

    /* HOOFDSTEDEN */

    5: {
      "amsterdam": 10,
      "parijs": 10,
      "londen": 10,
      "berlijn": 11,
      "rome": 12,
      "madrid": 12,
      "tokio": 14,
      "brussel": 17,
      "wenen": 22,
      "ottawa": 28,
      "canberra": 38,
      "bratislava": 49,
      "vaduz": 82,
      "thimphu": 92,
      "funafuti": 97,
      "sri jayawardenapura kotte": 100
    },

    /* HONDENRASSEN */

    6: {
      "labrador": 10,
      "labrador retriever": 10,
      "golden retriever": 11,
      "chihuahua": 12,
      "duitse herder": 13,
      "poedel": 17,
      "teckel": 22,
      "beagle": 28,
      "shiba inu": 35,
      "samoyeed": 49,
      "whippet": 56,
      "basenji": 77,
      "azawakh": 93,
      "noorse lundehond": 96,
      "xoloitzcuintle": 100
    },

    /* OLYMPISCHE SPORTEN */

    7: {
      "voetbal": 10,
      "zwemmen": 10,
      "atletiek": 11,
      "basketbal": 13,
      "tennis": 15,
      "volleybal": 17,
      "hockey": 18,
      "judo": 24,
      "badminton": 28,
      "roeien": 35,
      "schermen": 46,
      "boogschieten": 43,
      "trampolinespringen": 58,
      "synchroonzwemmen": 62,
      "hink stap springen": 75,
      "vijfkamp": 84,
      "omnium": 95,
      "keirin": 100
    },

    /* JAPANSE STEDEN */

    8: {
      "tokio": 10,
      "osaka": 13,
      "kyoto": 15,
      "hiroshima": 19,
      "nagasaki": 23,
      "sapporo": 31,
      "kobe": 28,
      "nara": 35,
      "kanazawa": 54,
      "takayama": 69,
      "tottori": 91,
      "kofu": 96,
      "yokote": 100
    },

    /* MANEN */

    9: {
      "maan": 10,
      "europa": 20,
      "io": 25,
      "titan": 28,
      "ganymedes": 32,
      "callisto": 39,
      "triton": 44,
      "enceladus": 51,
      "phobos": 47,
      "deimos": 53,
      "charon": 61,
      "mimas": 66,
      "nereid": 85,
      "arche": 95,
      "kallichore": 100
    },

    /* MUZIEKINSTRUMENTEN */

    10: {
      "piano": 10,
      "gitaar": 10,
      "drumstel": 12,
      "viool": 14,
      "trompet": 18,
      "fluit": 19,
      "saxofoon": 23,
      "cello": 30,
      "harp": 37,
      "banjo": 46,
      "doedelzak": 49,
      "didgeridoo": 61,
      "theremin": 82,
      "nyckelharpa": 93,
      "theorbe": 100
    },

    /* DINOSAURIËRS */

    11: {
      "tyrannosaurus": 10,
      "triceratops": 13,
      "velociraptor": 15,
      "stegosaurus": 18,
      "brachiosaurus": 21,
      "spinosaurus": 27,
      "diplodocus": 30,
      "ankylosaurus": 36,
      "parasaurolophus": 46,
      "therizinosaurus": 55,
      "microraptor": 74,
      "diabloceratops": 91,
      "halszkaraptor": 97,
      "muttaburrasaurus": 100
    },

    /* EILANDEN */

    12: {
      "ibiza": 10,
      "mallorca": 11,
      "bali": 13,
      "tenerife": 15,
      "kreta": 18,
      "sicilie": 24,
      "ijsland": 29,
      "madagaskar": 33,
      "groenland": 37,
      "corsica": 43,
      "paaseiland": 49,
      "komodo": 58,
      "palawan": 62,
      "socotra": 84,
      "tristan da cunha": 93,
      "pitcairn": 96,
      "bouvetoya": 100
    }

  };


  /* ===================================================
     5. EXTRA ANTWOORDENBANK

     Deze antwoorden worden toegevoegd
     aan de bestaande vragen uit vragen.js.

     Formaat:
       Antwoord|oude zeldzaamheidsinschatting

     De oude inschatting wordt daarna
     omgezet naar een nieuwe score.

     Ook bestaande antwoorden blijven geldig.
  =================================================== */

  const EXTRA_ANSWERS = {


    /* -----------------------------------------------
       VOGELS
    ----------------------------------------------- */

    0: `
Groene ara|72
Hyacintara|85
Roodschouderara|78
Blauwgele ara|54
Geelvleugelara|60
Vlagstaartkolibrie|89
Zwaardkolibrie|93
Bijkolibrie|96
Robijnkeelkolibrie|66
Andesrotshaan|90
Helmneushoornvogel|97
Dubbelhoornige neushoornvogel|85
Neushoornvogel|52
Toko|60
Reuzentoekan|64
Zwavelborsttoekan|82
Japanse kraanvogel|86
Kroonkraanvogel|66
Jufferkraanvogel|79
Mandarijneend|46
Muskuseend|40
Blauwgele tangare|88
Scharrelaar|72
Lilaborstroller|94
Zwarte kaketoe|81
Geelkuifkaketoe|59
Galah|84
Lori|53
Regenbooglori|62
Afrikaanse grijze roodstaart|61
Roodmaskerparkiet|83
Goudfazant|54
Lady Amherstfazant|87
Amerikaanse flamingo|55
Chileense flamingo|66
Kleine flamingo|70
Grote flamingo|38
Grote blauwe toerako|87
Zwarte zwaan|44
Witbuikzeearend|77
`,

    /* -----------------------------------------------
       AFRIKAANSE LANDEN

       De oorspronkelijke vragenbank
       bevat al ruim 50 landen.
    ----------------------------------------------- */

    1: ``,


    /* -----------------------------------------------
       ZEEDIEREN
    ----------------------------------------------- */

    2: `
Zwaardvis|32
Zeilvis|43
Tonijn|20
Blauwvintonijn|52
Makreel|23
Haring|17
Sardine|22
Ansjovis|34
Kabeljauw|25
Heilbot|39
Tarbot|49
Zeedraakvis|82
Steenvis|68
Koraalvlinder|58
Doktersvis|45
Blauwe doktersvis|52
Papegaaivis|39
Trekkervis|65
Engelvis|38
Koffervis|72
Klipvis|74
Barracuda|43
Schorpioenvis|75
Goblinhaai|91
Franjehaai|93
Groenlandse haai|88
Reuzenhaai|60
Zandhaai|63
Tijgerhaai|42
Citroenhaai|57
Zwartpuntrifhaai|65
Zilverpunthaai|78
Haringhaai|73
Blauwe haai|48
Groene zeeschildpad|47
Lederschildpad|57
Karetschildpad|68
Onechte karetschildpad|76
Platvis|30
Zeepok|56
Zeeanemoon|41
Zeeleeuw|55
`,

    /* -----------------------------------------------
       LANDEN WERELDWIJD
    ----------------------------------------------- */

    3: `
Canada|9
Verenigde Staten|8|Amerika|VS
Mexico|13
Brazilië|13
Argentinië|17
Chili|24
Peru|27
Colombia|24
Venezuela|29
Ecuador|41
Bolivia|48
Paraguay|61
Uruguay|51
Guyana|78
Suriname|26
Japan|9
China|8
India|9
Pakistan|29
Bangladesh|34
Nepal|35
Bhutan|81
Sri Lanka|38
Thailand|16
Vietnam|20
Cambodja|37
Laos|54
Myanmar|49
Maleisië|29
Singapore|19
Indonesië|15
Filipijnen|18
Zuid-Korea|17
Noord-Korea|30
Mongolië|52
Australië|10
Nieuw-Zeeland|17
Papoea-Nieuw-Guinea|76
Vanuatu|82
Salomonseilanden|83
Kiribati|97
Tuvalu|98
Nauru|100
Palau|95
Micronesië|96
Marshalleilanden|97
`,

    /* -----------------------------------------------
       FRUIT
    ----------------------------------------------- */

    4: `
Grapefruit|27
Pomelo|42
Rode bes|30
Zwarte bes|37
Kruisbes|51
Veenbes|61
Cranberry|43
Moerbei|62
Dadel|36
Olijf|45
Nashi|74|Aziatische peer
Rode pitaja|65
Witte pitaja|73
Yuzu|79
Sudachi|95
Calamansi|89
Makrutlimoen|94
Bergamot|81
Vingerlimoen|92|Finger lime
Jambolan|98
Langsat|96
Duku|95
Santol|96
Pulasan|98
Ambarella|99
Zuurzak|85|Soursop
Noni|90
Atemoya|94
Cupuaçu|99
Camu camu|98
Açaí|80
Taybes|90
Kiwibes|48
Kweepeer|58
Mirabel|64
Bloedsinaasappel|44
`,

    /* -----------------------------------------------
       HOOFDSTEDEN WERELDWIJD
    ----------------------------------------------- */

    5: `
Washington D.C.|11|Washington
Ottawa|19
Mexico-Stad|18|Mexico City
Brasília|22
Buenos Aires|16
Santiago|25
Lima|23
Bogotá|28
Caracas|31
Quito|42
Sucre|72
Asunción|75
Montevideo|53
Georgetown|87
Paramaribo|42
Tokio|10|Tokyo
Peking|16|Beijing
New Delhi|20
Islamabad|50
Dhaka|62
Kathmandu|48
Thimphu|93
Sri Jayawardenapura Kotte|100
Bangkok|17
Hanoi|32
Phnom Penh|47
Vientiane|80
Naypyidaw|91
Kuala Lumpur|27
Singapore|20
Manilla|24|Manila
Seoul|22
Pyongyang|33
Ulaanbaatar|77
Canberra|28
Wellington|36
Port Moresby|90
Port Vila|92
Honiara|95
Tarawa|98
Funafuti|100
`,

    /* -----------------------------------------------
       HONDENRASSEN
    ----------------------------------------------- */

    6: `
Australische herder|36
Australian cattle dog|55
Belgische herder|29
Mechelse herder|34
Groenendaeler|71
Tervuerense herder|83
Laekense herder|94
Bobtail|48
Old English sheepdog|55
Duitse dog|32
Ierse wolfshond|59
Schotse deerhound|80
Afghaanse windhond|63
Italiaans windhondje|66
Engelse mastiff|56
Bullmastiff|46
Bordeauxdog|55
Dogo argentino|72
Fila brasileiro|93
Boerboel|85
Rhodesian ridgeback|56
Pharaohond|89
Cirneco dell'Etna|96
Podenco ibicenco|88
Podenco canario|91
Duitse staande korthaar|60
Ierse setter|45
Engelse setter|48
Gordon setter|73
Clumberspaniël|98
Sussexspaniël|100
Fieldspaniël|97
Welsh springerspaniël|75
Lagotto romagnolo|80
Kooikerhondje|49
Markiesje|90
Stabijhoun|74
Wetterhoun|92
`,

    /* -----------------------------------------------
       OLYMPISCHE SPORTEN EN DISCIPLINES
    ----------------------------------------------- */

    7: `
100 meter sprint|12
200 meter sprint|18
400 meter sprint|21
800 meter hardlopen|28
1500 meter hardlopen|31
5000 meter hardlopen|40
10000 meter hardlopen|48
Marathon|15
110 meter horden|47
400 meter horden|52
3000 meter steeplechase|79
Hoogspringen|30
Verspringen|28
Hink-stap-springen|66
Polsstokhoogspringen|39
Speerwerpen|31
Discuswerpen|30
Kogelstoten|34
Kogelslingeren|57
Tienkamp|45
Zevenkamp|53
Estafetteloop|25
4x100 meter estafette|43
4x400 meter estafette|56
100 meter rugslag|40
200 meter rugslag|45
100 meter schoolslag|37
200 meter schoolslag|49
100 meter vlinderslag|46
200 meter wisselslag|53
Synchroonzwemmen|41|Artistiek zwemmen
Schoonspringen|36
10 meter platformduiken|67
3 meter plankduiken|72
BMX freestyle|58
BMX racing|59
Keirin|77
Omnium|84
Individuele tijdrit|48
`,

    /* -----------------------------------------------
       JAPANSE STEDEN
    ----------------------------------------------- */

    8: `
Otaru|78
Asahikawa|84
Obihiro|93
Kitami|94
Muroran|95
Tomakomai|92
Hirosaki|88
Hachinohe|92
Ichinoseki|97
Hanamaki|97
Yokote|100
Noshiro|98
Sakata|97
Tsuruoka|96
Fukushima|73
Koriyama|84
Iwaki|87
Mito|82
Hitachi|91
Tsuchiura|95
Kawagoe|85
Tokorozawa|89
Saitama|66
Funabashi|85
Kashiwa|91
Ichikawa|89
Machida|88
Hachioji|87
Fujisawa|89
Odawara|88
Yokosuka|83
Nagano|77
Ueda|97
Suwa|99
Joetsu|97
Nagaoka|95
Takaoka|97
Komatsu|96
Sabae|100
`,

    /* -----------------------------------------------
       MANEN
    ----------------------------------------------- */

    9: `
Leda|96
Lysithea|98
Ananke|96
Callirrhoe|99
Taygete|100
Chaldene|99
Harpalyke|99
Kalyke|98
Iocaste|100
Erinome|99
Isonoe|99
Praxidike|100
Autonoe|99
Thyone|99
Hermippe|99
Aitne|99
Eurydome|100
Euanthe|100
Euporie|100
Orthosie|100
Sponde|100
Kale|100
Pasithee|100
Hegemone|100
Mneme|100
Aoede|100
Thelxinoe|100
Arche|100
Kallichore|100
Helike|100
Carpo|100
Eukelade|100
Cyllene|100
Kore|100
Herse|100
`,

    /* -----------------------------------------------
       MUZIEKINSTRUMENTEN
    ----------------------------------------------- */

    10: `
Piccolo|48
Basklarinet|65
Altklarinet|73
Contrafagot|89
Engelse hoorn|72
Hoorn|42|Franse hoorn
Eufonium|78
Tuba|33
Sousafoon|73
Bastrombone|71
Bugel|66
Cornet|72
Altsaxofoon|37
Tenorsaxofoon|43
Baritonsaxofoon|62
Sopraansaxofoon|57
Basgitaar|13
Elektrische gitaar|11
Akoestische gitaar|13
Steelgitaar|67
Dobro|84
Luit|55
Theorbe|100
Klavecimbel|56
Clavichord|92
Celesta|77
Carillon|80
Pijporgel|56
Harmonium|82
Bandoneon|86
Concertina|89
Shakuhachi|95
Hulusi|100
Dizi|95
Morin khuur|99
Sarangi|97
Gayageum|99
Guqin|100
`,

    /* -----------------------------------------------
       DINOSAURIËRS
    ----------------------------------------------- */

    11: `
Torosaurus|73
Centrosaurus|76
Chasmosaurus|79
Diabloceratops|94
Kosmoceratops|94
Nasutoceratops|95
Einiosaurus|93
Achelousaurus|96
Pentaceratops|82
Regaliceratops|98
Sinoceratops|87
Yutyrannus|92
Dilong|99
Daspletosaurus|83
Tarbosaurus|76
Alioramus|94
Qianzhousaurus|98
Lythronax|95
Teratophoneus|97
Austroraptor|96
Buitreraptor|98
Bambiraptor|92
Saurornitholestes|97
Achillobator|96
Dromaeosaurus|88
Halszkaraptor|99
Adasaurus|99
Pyroraptor|87
Tianyuraptor|100
Zhenyuanlong|100
Sinornithosaurus|94
Changyuraptor|100
`,

    /* -----------------------------------------------
       EILANDEN
    ----------------------------------------------- */

    12: `
Hokkaido|40
Honshu|32
Shikoku|67
Kyushu|49
Okinawa|45
Iriomote|95
Ishigaki|86
Yakushima|92
Tsushima|89
Sado|96
Shodoshima|98
Jeju|49
Ulleungdo|96
Taiwan|23
Hainan|55
Luzon|44
Mindanao|52
Palawan|45
Boracay|30
Cebu|34
Bohol|58
Negros|68
Panay|74
Samar|82
Leyte|78
Siargao|57
Bantayan|84
Camiguin|88
Siquijor|87
El Hierro|73
La Gomera|64
La Palma|58
Formentera|55
La Graciosa|86
Pantelleria|93
Lampedusa|75
Elba|71
Capri|48
Ischia|59
`

  };


  /* ===================================================
     6. SPELSTATUS
  =================================================== */

  let questions = [];

  let currentQuestionIndex = 0;

  let totalScore = 0;
  let totalHeight = 0;
  let correctAnswers = 0;

  let secondsLeft = SECONDS_PER_QUESTION;

  let timerInterval = null;
  let timerDeadline = 0;

  let answerLocked = false;
  let gameActive = false;

  let personalRecord = 0;

  let risingTimeout = null;


  /* ===================================================
     7. HTML-ELEMENTEN
  =================================================== */

  function byId(id) {
    return document.getElementById(id);
  }

  const elements = {

    world: byId("world"),
    balloonContainer: byId("balloon-container"),
    particles: byId("flight-particles"),

    startScreen: byId("start-screen"),
    gameScreen: byId("game-screen"),
    endScreen: byId("end-screen"),

    startButton: byId("start-button"),
    restartButton: byId("restart-button"),
    homeButton: byId("home-button"),
    quitButton: byId("quit-button"),

    headerRecord: byId("header-record"),

    questionNumber: byId("question-number"),
    scoreDisplay: byId("score-display"),
    heightDisplay: byId("height-display"),

    progressFill: byId("progress-fill"),
    zoneName: byId("zone-name"),

    questionCategory: byId("question-category"),
    questionText: byId("question-text"),
    questionHint: byId("question-hint"),

    timer: byId("timer"),
    timerDisplay: byId("timer-display"),

    answerForm: byId("answer-form"),
    answerInput: byId("answer-input"),
    answerButton: byId("answer-button"),

    answerResult: byId("answer-result"),
    resultIcon: byId("result-icon"),
    resultTitle: byId("result-title"),
    resultDescription: byId("result-description"),
    resultPoints: byId("result-points"),

    nextButton: byId("next-button"),

    endHeight: byId("end-height"),
    endScore: byId("end-score"),
    endCorrect: byId("end-correct"),
    endDescription: byId("end-description"),
    endRecord: byId("end-record")

  };


  let feedbackElement = null;
  let feedbackText = null;
  let suggestionsElement = null;


  /* ===================================================
     8. HULPFUNCTIES
  =================================================== */

  function formatNumber(value) {

    return new Intl.NumberFormat("nl-NL").format(value);

  }


  function formatHeight(value) {

    return formatNumber(Math.round(value)) + " km";

  }


  function normalizeAnswer(value) {

    if (typeof value !== "string") {
      return "";
    }

    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['’‘`]/g, "")
      .replace(/[-–—_]/g, " ")
      .replace(/[.,!?;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  function shuffleArray(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [result[i], result[j]] = [result[j], result[i]];

    }

    return result;

  }


  function prefersReducedMotion() {

    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  }


  /* ===================================================
     9. SCORE BEREKENEN

     BELANGRIJKE VERANDERING:

     Oude versie:
     - 20
     - 45
     - 70
     - 90
     - 100

     Nieuwe versie:
     - Eigen score per antwoord
     - Alle waarden tussen 10 en 99
     - Alleen het raketantwoord krijgt 100

     Handmatige correcties hebben
     voorrang op de oude waarde.
  =================================================== */

  function calculateAnswerScore(
    questionIndex,
    answerName,
    oldScore
  ) {

    const normalized = normalizeAnswer(answerName);

    const rocket = normalizeAnswer(
      ROCKET_ANSWERS[questionIndex] || ""
    );

    /*
     * Het ene raketantwoord.
     */

    if (normalized === rocket) {
      return 100;
    }

    /*
     * Handmatig bepaalde score.
     */

    const overrides =
      SCORE_OVERRIDES[questionIndex] || {};

    if (
      Object.prototype.hasOwnProperty.call(
        overrides,
        normalized
      )
    ) {

      return Math.max(
        10,
        Math.min(99, overrides[normalized])
      );

    }

    /*
     * Overige antwoorden krijgen een
     * geleidelijke score op basis van
     * de eerdere zeldzaamheidsinschatting.

     * Een oude waarde van 50 wordt
     * dus niet zomaar 70 punten.
     */

    const rarity = Math.max(
      1,
      Math.min(100, Number(oldScore) || 1)
    );

    const calculated = Math.round(
      9 + rarity * 0.86
    );

    return Math.max(
      10,
      Math.min(99, calculated)
    );

  }


  /* ===================================================
     10. EXTRA ANTWOORDEN OMZETTEN
  =================================================== */

  function parseExtraAnswers(text) {

    if (!text || typeof text !== "string") {
      return [];
    }

    return text
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean)
      .map(function (line) {

        const parts = line.split("|");

        return {

          answer: parts[0].trim(),

          points: Number(parts[1]) || 1,

          aliases: parts
            .slice(2)
            .map(function (alias) {
              return alias.trim();
            })
            .filter(Boolean)

        };

      });

  }


  /* ===================================================
     11. ANTWOORDENBANK SAMENSTELLEN

     - Bestaande antwoorden bewaren
     - Extra antwoorden toevoegen
     - Dubbele namen voorkomen
     - Nieuwe scores toekennen
     - Eén raketantwoord behouden

     We slaan de oorspronkelijke score
     eerst apart op. Daardoor raken
     de waarden niet door elkaar.
  =================================================== */

  function buildExpandedQuestions() {

    const original = window.QUIZ_QUESTIONS;

    if (!Array.isArray(original)) {
      return [];
    }

    return original.map(function (question, index) {

      const answers = question.answers.map(
        function (answer) {

          return {
            answer: answer.answer,
            originalScore: answer.points,
            aliases: [...(answer.aliases || [])]
          };

        }
      );

      const usedNames = new Set();

      answers.forEach(function (answer) {

        [
          answer.answer,
          ...answer.aliases
        ].forEach(function (name) {

          usedNames.add(normalizeAnswer(name));

        });

      });

      /*
       * Voeg extra antwoorden toe.
       */

      const extra = parseExtraAnswers(
        EXTRA_ANSWERS[index] || ""
      );

      extra.forEach(function (item) {

        const key = normalizeAnswer(item.answer);

        if (!key || usedNames.has(key)) {
          return;
        }

        const aliases = item.aliases.filter(
          function (alias) {

            const normalized = normalizeAnswer(alias);

            return (
              normalized &&
              !usedNames.has(normalized)
            );

          }
        );

        answers.push({

          answer: item.answer,

          originalScore: item.points,

          aliases: aliases

        });

        usedNames.add(key);

        aliases.forEach(function (alias) {

          usedNames.add(normalizeAnswer(alias));

        });

      });

      /*
       * Bereken nieuwe scores.
       */

      answers.forEach(function (answer) {

        answer.points = calculateAnswerScore(
          index,
          answer.answer,
          answer.originalScore
        );

        answer.isRocket = (
          normalizeAnswer(answer.answer) ===
          normalizeAnswer(ROCKET_ANSWERS[index])
        );

      });

      /*
       * Eventuele raketantwoorden
       * controleren.
       */

      const rocketAnswers = answers.filter(
        function (answer) {
          return answer.isRocket;
        }
      );

      if (rocketAnswers.length !== 1) {

        console.warn(
          "QuizBallon: vraag " + (index + 1) +
          " heeft " + rocketAnswers.length +
          " raketantwoorden."
        );

      }

      /*
       * Verbredingen uit de vorige
       * versie blijven behouden.
       */

      let questionText = question.question;
      let questionHint = question.hint;

      if (index === 3) {

        questionText =
          "Noem een land ergens ter wereld.";

        questionHint =
          "Denk aan landen die andere spelers niet zo snel zullen noemen.";

      }

      if (index === 5) {

        questionText =
          "Noem een hoofdstad ergens ter wereld.";

        questionHint =
          "Ook minder bekende hoofdsteden zijn geldig.";

      }

      if (index === 7) {

        questionText =
          "Noem een sport of discipline van de Olympische Zomerspelen.";

        questionHint =
          "Denk aan zowel sporten als specifieke olympische disciplines.";

      }

      if (answers.length < 50) {

        console.warn(
          "QuizBallon: vraag " + (index + 1) +
          " heeft minder dan 50 antwoorden."
        );

      }

      return {

        category: question.category,

        question: questionText,

        hint: questionHint,

        answers: answers

      };

    });

  }


  /* ===================================================
     12. ANTWOORD CONTROLEREN

     Hoofdletters, accenten en
     schrijfvarianten worden herkend.
  =================================================== */

  function checkAnswer(question, userAnswer) {

    const input = normalizeAnswer(userAnswer);

    if (!input) {
      return null;
    }

    for (const item of question.answers) {

      const possibleNames = [
        item.answer,
        ...(item.aliases || [])
      ];

      const found = possibleNames.some(
        function (name) {

          return normalizeAnswer(name) === input;

        }
      );

      if (found) {
        return item;
      }

    }

    return null;

  }


  /* ===================================================
     13. TYPEFOUTEN HERKENNEN
  =================================================== */

  function levenshteinDistance(first, second) {

    if (first === second) {
      return 0;
    }

    if (!first.length) {
      return second.length;
    }

    if (!second.length) {
      return first.length;
    }

    let previous = [];

    for (let j = 0; j <= second.length; j++) {
      previous[j] = j;
    }

    for (let i = 1; i <= first.length; i++) {

      const current = [i];

      for (let j = 1; j <= second.length; j++) {

        const cost =
          first[i - 1] === second[j - 1]
            ? 0
            : 1;

        current[j] = Math.min(
          current[j - 1] + 1,
          previous[j] + 1,
          previous[j - 1] + cost
        );

      }

      previous = current;

    }

    return previous[second.length];

  }


  /* ===================================================
     14. SLIMME SUGGESTIES

     Bijvoorbeeld:

     flamingp -> flamingo

     neushoorn -> neushoornvogel

     Suggereren betekent NIET dat
     het antwoord automatisch goed is.
  =================================================== */

  function findSuggestions(question, userAnswer) {

    const input = normalizeAnswer(userAnswer);

    if (input.length < 4) {
      return [];
    }

    const suggestions = [];

    question.answers.forEach(function (item) {

      const names = [
        item.answer,
        ...(item.aliases || [])
      ];

      let bestMatch = Infinity;

      names.forEach(function (name) {

        const candidate = normalizeAnswer(name);

        if (candidate === input) {
          return;
        }

        const lengthDifference = Math.abs(
          candidate.length - input.length
        );

        /*
         * Eén letter verschil.
         */

        if (
          input.length >= 4 &&
          lengthDifference <= 1
        ) {

          const distance = levenshteinDistance(
            input,
            candidate
          );

          if (distance === 1) {

            bestMatch = Math.min(
              bestMatch,
              1
            );

          }

        }

        /*
         * Kortere naam die duidelijk
         * verwijst naar langer antwoord.
         */

        if (
          input.length >= 5 &&
          candidate.startsWith(input) &&
          input.length >= candidate.length * 0.6
        ) {

          bestMatch = Math.min(
            bestMatch,
            2
          );

        }

      });

      if (bestMatch === Infinity) {
        return;
      }

      suggestions.push({

        answer: item.answer,

        matchScore: bestMatch

      });

    });

    suggestions.sort(function (a, b) {

      if (a.matchScore !== b.matchScore) {

        return a.matchScore - b.matchScore;

      }

      return a.answer.localeCompare(
        b.answer,
        "nl"
      );

    });

    return suggestions.slice(
      0,
      MAX_SUGGESTIONS
    );

  }


  /* ===================================================
     15. EXTRA STYLING

     Hiermee blijven de suggesties,
     raketanimatie en scoremeldingen
     werken zonder style.css te wijzigen.
  =================================================== */

  function addExtraStyles() {

    if (byId("quizballon-v4-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "quizballon-v4-styles";

    style.textContent = `

      /* FOUTMELDING */

      .qb-feedback {
        margin-top: 16px;
        padding: 18px;

        border: 1px solid #ffccbb;
        border-radius: 14px;

        background: #fff3ef;
        color: #803c2e;
      }

      .qb-feedback-text {
        margin: 0;

        font-size: 13px;
        font-weight: 700;
        line-height: 1.7;
      }


      /* SUGGESTIES */

      .qb-suggestions {
        display: flex;
        flex-direction: column;
        gap: 9px;

        margin-top: 15px;
      }

      .qb-suggestions-title {
        margin: 0 0 3px;

        color: #4a5876;
        font-size: 12px;
        font-weight: 800;
      }

      .qb-suggestion-button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;

        width: 100%;
        min-height: 46px;

        padding: 11px 14px;

        border: 1px solid #c5d5ff;
        border-radius: 10px;

        background: white;
        color: #315ce0;

        font-size: 13px;
        font-weight: 800;
        text-align: left;
        cursor: pointer;
      }

      .qb-suggestion-button:hover {
        background: #edf2ff;
      }

      .qb-suggestion-button:focus-visible {
        outline: 3px solid #ffce52;
        outline-offset: 3px;
      }


      /* RAKETMODUS */

      .balloon-container.rocket-mode {
        z-index: 20;
      }

      .balloon-container.rocket-mode .balloon {
        animation:
          qbRocketBlast .45s ease-in-out
          infinite alternate !important;
      }

      .balloon-container.rocket-mode .balloon-top,
      .balloon-container.rocket-mode .balloon-ropes,
      .balloon-container.rocket-mode .balloon-basket,
      .balloon-container.rocket-mode .balloon-name {
        opacity: 0 !important;
      }

      .balloon-container.rocket-mode .balloon::before {
        content: "🚀";

        position: absolute;
        z-index: 10;

        top: 0;
        left: 3px;

        font-size: 135px;
        line-height: 1;

        transform: rotate(-35deg);

        filter:
          drop-shadow(
            0 15px 20px
            rgba(255, 115, 36, .35)
          );
      }

      .balloon-container.rocket-mode .balloon::after {
        content: "🔥";

        position: absolute;
        z-index: 9;

        top: 110px;
        left: 27px;

        font-size: 63px;
        line-height: 1;

        transform: rotate(-35deg);

        animation:
          qbFlame .18s ease-in-out
          infinite alternate;
      }

      @keyframes qbRocketBlast {

        from {
          transform:
            translateY(0)
            scale(1);
        }

        to {
          transform:
            translateY(-65px)
            scale(1.13);
        }

      }

      @keyframes qbFlame {

        from {
          opacity: .7;
          scale: .8;
        }

        to {
          opacity: 1;
          scale: 1.15;
        }

      }


      /* SPECIALE RAKETMELDING */

      .answer-result.rocket-result {
        background:
          linear-gradient(
            135deg,
            #fff1bd,
            #ffe0af
          );

        border: 2px solid #ffb347;
      }

      .answer-result.rocket-result .result-points {
        color: #d66b19;
      }

      .answer-result.rocket-result .result-icon {
        animation:
          qbRocketIcon .55s ease
          infinite alternate;
      }

      @keyframes qbRocketIcon {

        from {
          transform:
            translateY(0)
            rotate(-5deg);
        }

        to {
          transform:
            translateY(-12px)
            rotate(5deg);
        }

      }


      /* MOBIEL */

      @media (max-width: 480px) {

        .qb-feedback {
          padding: 15px;
        }

        .qb-suggestion-button {
          min-height: 48px;
        }

      }


      /* MINDER BEWEGING */

      @media (prefers-reduced-motion: reduce) {

        .balloon-container.rocket-mode .balloon,
        .balloon-container.rocket-mode .balloon::after,
        .answer-result.rocket-result .result-icon {
          animation: none !important;
        }

      }

    `;

    document.head.appendChild(style);

  }


  /* ===================================================
     16. FEEDBACK-ELEMENTEN MAKEN
  =================================================== */

  function createFeedbackElements() {

    feedbackElement = document.createElement("div");

    feedbackElement.className = "qb-feedback";
    feedbackElement.hidden = true;

    feedbackElement.setAttribute(
      "role",
      "status"
    );

    feedbackText = document.createElement("p");

    feedbackText.className = "qb-feedback-text";

    suggestionsElement = document.createElement("div");

    suggestionsElement.className = "qb-suggestions";

    feedbackElement.append(
      feedbackText,
      suggestionsElement
    );

    elements.answerForm.insertAdjacentElement(
      "afterend",
      feedbackElement
    );

  }


  /* ===================================================
     17. FEEDBACK VERBERGEN
  =================================================== */

  function hideFeedback() {

    feedbackElement.hidden = true;

    feedbackText.textContent = "";

    suggestionsElement.replaceChildren();

  }


  /* ===================================================
     18. SUGGESTIES TONEN
  =================================================== */

  function showSuggestions(suggestions) {

    suggestionsElement.replaceChildren();

    if (!suggestions.length) {
      return;
    }

    const title = document.createElement("p");

    title.className = "qb-suggestions-title";

    title.textContent =
      "💡 Bedoelde je misschien:";

    suggestionsElement.appendChild(title);

    suggestions.forEach(function (suggestion) {

      const button = document.createElement("button");

      button.type = "button";
      button.className = "qb-suggestion-button";

      const label = document.createElement("span");

      label.textContent = suggestion.answer;

      const arrow = document.createElement("span");

      arrow.textContent = "→";

      button.append(label, arrow);

      button.addEventListener("click", function () {

        if (!gameActive || answerLocked) {
          return;
        }

        if (Date.now() >= timerDeadline) {

          handleTimeUp();
          return;

        }

        elements.answerInput.value =
          suggestion.answer;

        hideFeedback();

        processAnswer();

      });

      suggestionsElement.appendChild(button);

    });

  }


  /* ===================================================
     19. FOUT ANTWOORD MELDEN

     De timer blijft doorlopen!
  =================================================== */

  function showIncorrectFeedback(userAnswer) {

    const question =
      questions[currentQuestionIndex];

    const suggestions = findSuggestions(
      question,
      userAnswer
    );

    feedbackElement.hidden = false;

    feedbackText.textContent =
      suggestions.length
        ? "Dit antwoord is nog niet herkend. Bedoelde je misschien een van deze antwoorden?"
        : "❌ Dit antwoord wordt nog niet herkend. Probeer gerust iets anders!";

    showSuggestions(suggestions);

  }


  /* ===================================================
     20. PERSOONLIJK RECORD
  =================================================== */

  function loadRecord() {

    try {

      const saved = Number(
        localStorage.getItem(RECORD_KEY)
      );

      personalRecord =
        Number.isFinite(saved) && saved >= 0
          ? saved
          : 0;

    } catch (error) {

      personalRecord = 0;

    }

    updateRecordDisplay();

  }


  function saveRecord(height) {

    if (height <= personalRecord) {
      return false;
    }

    personalRecord = height;

    try {

      localStorage.setItem(
        RECORD_KEY,
        String(personalRecord)
      );

    } catch (error) {

      // Spel blijft werken.

    }

    updateRecordDisplay();

    return true;

  }


  function updateRecordDisplay() {

    elements.headerRecord.textContent =
      formatHeight(personalRecord);

  }


  /* ===================================================
     21. LUCHTZONES
  =================================================== */

  const ZONES = [

    {
      height: 0,
      className: "zone-earth",
      name: "De aarde 🌍"
    },

    {
      height: 80,
      className: "zone-clouds",
      name: "Tussen de wolken ☁️"
    },

    {
      height: 250,
      className: "zone-high",
      name: "Hoge atmosfeer 🌤️"
    },

    {
      height: 500,
      className: "zone-space",
      name: "De ruimte 🚀"
    },

    {
      height: 850,
      className: "zone-moon",
      name: "Bij de maan 🌕"
    },

    {
      height: 1200,
      className: "zone-mars",
      name: "Bij Mars 🔴"
    },

    {
      height: 1600,
      className: "zone-jupiter",
      name: "Bij Jupiter 🪐"
    }

  ];


  function getCurrentZone(height) {

    let selected = ZONES[0];

    ZONES.forEach(function (zone) {

      if (height >= zone.height) {

        selected = zone;

      }

    });

    return selected;

  }


  /* ===================================================
     22. WERELD BIJWERKEN
  =================================================== */

  function updateWorld() {

    const zone = getCurrentZone(totalHeight);

    elements.world.className =
      "world " + zone.className;

    elements.zoneName.textContent =
      zone.name;

    updateBalloonPosition();

  }


  function updateBalloonPosition() {

    const isMobile = window.innerWidth <= 760;

    const progress = Math.min(
      totalHeight / MAX_POSSIBLE_HEIGHT,
      1
    );

    const bottom = isMobile
      ? 12 + progress * 18
      : 22 + progress * 25;

    elements.balloonContainer.style.bottom =
      bottom + "%";

  }


  /* ===================================================
     23. STATISTIEKEN BIJWERKEN
  =================================================== */

  function updateStats() {

    elements.scoreDisplay.textContent =
      formatNumber(totalScore);

    elements.heightDisplay.textContent =
      formatHeight(totalHeight);

    elements.questionNumber.textContent =
      String(currentQuestionIndex + 1);

    const progress = Math.min(
      (totalHeight / MAX_POSSIBLE_HEIGHT) * 100,
      100
    );

    elements.progressFill.style.width =
      progress + "%";

    updateWorld();

  }


  /* ===================================================
     24. VLIEGDEELTJES
  =================================================== */

  function createFlightParticles() {

    if (prefersReducedMotion()) {
      return;
    }

    const rectangle =
      elements.balloonContainer.getBoundingClientRect();

    for (let i = 0; i < 12; i++) {

      const particle = document.createElement("span");

      particle.className = "flight-particle";

      particle.style.left =
        rectangle.left +
        rectangle.width * 0.5 +
        (Math.random() - 0.5) * 110 +
        "px";

      particle.style.top =
        rectangle.top +
        rectangle.height * 0.65 +
        (Math.random() - 0.5) * 90 +
        "px";

      elements.particles.appendChild(particle);

      setTimeout(function () {

        particle.remove();

      }, 1300);

    }

  }


  /* ===================================================
     25. BALLON- EN RAKETANIMATIE
  =================================================== */

  function animateBalloon(isRocket) {

    if (risingTimeout !== null) {

      clearTimeout(risingTimeout);

    }

    elements.balloonContainer.classList.remove(
      "rising",
      "rocket-mode"
    );

    if (isRocket) {

      elements.balloonContainer.classList.add(
        "rocket-mode"
      );

    } else {

      elements.balloonContainer.classList.add(
        "rising"
      );

    }

    createFlightParticles();

    risingTimeout = setTimeout(function () {

      elements.balloonContainer.classList.remove(
        "rising",
        "rocket-mode"
      );

      risingTimeout = null;

    }, isRocket ? ROCKET_DURATION : 1400);

  }


  /* ===================================================
     26. TIMER
  =================================================== */

  function stopTimer() {

    if (timerInterval !== null) {

      clearInterval(timerInterval);

      timerInterval = null;

    }

    timerDeadline = 0;

  }


  function updateTimerDisplay() {

    elements.timerDisplay.textContent =
      String(secondsLeft);

    elements.timer.classList.remove(
      "warning",
      "danger"
    );

    if (
      secondsLeft <= 10 &&
      secondsLeft > 5
    ) {

      elements.timer.classList.add(
        "warning"
      );

    }

    if (secondsLeft <= 5) {

      elements.timer.classList.add(
        "danger"
      );

    }

  }


  function startTimer() {

    stopTimer();

    secondsLeft = SECONDS_PER_QUESTION;

    timerDeadline =
      Date.now() +
      SECONDS_PER_QUESTION * 1000;

    updateTimerDisplay();

    timerInterval = setInterval(function () {

      if (!gameActive || answerLocked) {

        stopTimer();
        return;

      }

      secondsLeft = Math.max(
        0,
        Math.ceil(
          (timerDeadline - Date.now()) / 1000
        )
      );

      updateTimerDisplay();

      if (secondsLeft === 0) {

        handleTimeUp();

      }

    }, 100);

  }


  /* ===================================================
     27. SCHERM TONEN
  =================================================== */

  function showScreen(name) {

    elements.startScreen.classList.remove("active");
    elements.gameScreen.classList.remove("active");
    elements.endScreen.classList.remove("active");

    if (name === "start") {

      elements.startScreen.classList.add("active");

    }

    if (name === "game") {

      elements.gameScreen.classList.add("active");

    }

    if (name === "end") {

      elements.endScreen.classList.add("active");

    }

    window.scrollTo(0, 0);

  }


  /* ===================================================
     28. NIEUW SPEL STARTEN
  =================================================== */

  function startGame() {

    const availableQuestions =
      window.QUIZBALLON_EXPANDED_QUESTIONS;

    if (
      !Array.isArray(availableQuestions) ||
      availableQuestions.length < QUESTIONS_PER_GAME
    ) {

      alert(
        "De vragenbank bevat nog niet genoeg vragen."
      );

      return;

    }

    stopTimer();

    if (risingTimeout !== null) {

      clearTimeout(risingTimeout);

      risingTimeout = null;

    }

    currentQuestionIndex = 0;

    totalScore = 0;
    totalHeight = 0;
    correctAnswers = 0;

    answerLocked = false;
    gameActive = true;

    questions = shuffleArray(
      availableQuestions
    ).slice(0, QUESTIONS_PER_GAME);

    elements.balloonContainer.classList.remove(
      "rising",
      "rocket-mode"
    );

    elements.progressFill.style.width = "0%";

    hideFeedback();

    showScreen("game");

    updateStats();

    showQuestion();

  }


  /* ===================================================
     29. VRAAG TONEN
  =================================================== */

  function showQuestion() {

    if (!gameActive) {
      return;
    }

    if (currentQuestionIndex >= questions.length) {

      endGame();
      return;

    }

    const question =
      questions[currentQuestionIndex];

    answerLocked = false;

    elements.questionCategory.textContent =
      question.category;

    elements.questionText.textContent =
      question.question;

    elements.questionHint.textContent =
      question.hint;

    elements.answerInput.value = "";

    elements.answerInput.disabled = false;
    elements.answerButton.disabled = false;

    elements.answerForm.hidden = false;
    elements.answerResult.hidden = true;

    elements.answerResult.classList.remove(
      "correct",
      "incorrect",
      "rocket-result"
    );

    hideFeedback();

    elements.nextButton.replaceChildren();

    elements.nextButton.appendChild(
      document.createTextNode(
        currentQuestionIndex === questions.length - 1
          ? "BEKIJK JE RESULTAAT "
          : "VOLGENDE VRAAG "
      )
    );

    const arrow = document.createElement("span");

    arrow.textContent = "→";

    elements.nextButton.appendChild(arrow);

    updateStats();

    startTimer();

  }


  /* ===================================================
     30. ANTWOORD VERWERKEN
  =================================================== */

  function processAnswer() {

    if (!gameActive || answerLocked) {
      return;
    }

    if (Date.now() >= timerDeadline) {

      handleTimeUp();
      return;

    }

    const userAnswer =
      elements.answerInput.value.trim();

    if (!userAnswer) {

      elements.answerInput.focus();
      return;

    }

    const question =
      questions[currentQuestionIndex];

    const answer =
      checkAnswer(question, userAnswer);

    if (answer) {

      hideFeedback();

      handleCorrectAnswer(answer);

    } else {

      /*
       * Fout of onbekend antwoord:
       * timer blijft lopen.
       */

      showIncorrectFeedback(userAnswer);

      elements.answerInput.focus();
      elements.answerInput.select();

    }

  }


  /* ===================================================
     31. GOED ANTWOORD

     Hier gebruiken we nu de ECHTE
     nieuwe spelpunten van het antwoord.

     Niet meer alleen vijf vaste waarden.
  =================================================== */

  function handleCorrectAnswer(answer) {

    if (answerLocked || !gameActive) {
      return;
    }

    answerLocked = true;

    stopTimer();

    const points = answer.points;

    const gainedHeight =
      points * KM_PER_POINT;

    const isRocket =
      answer.isRocket === true;

    const level =
      getScoreLevel(points);

    totalScore += points;
    totalHeight += gainedHeight;

    correctAnswers++;

    updateStats();

    animateBalloon(isRocket);

    showAnswerResult({

      correct: true,

      rocket: isRocket,

      icon: level.icon,

      title: level.name,

      description:
        level.description +
        " Je antwoord was " +
        answer.answer +
        ". Je stijgt " +
        formatHeight(gainedHeight) +
        "!",

      points: points

    });

  }


  /* ===================================================
     32. TIJD OP
  =================================================== */

  function handleTimeUp() {

    if (answerLocked || !gameActive) {
      return;
    }

    answerLocked = true;

    stopTimer();

    secondsLeft = 0;

    updateTimerDisplay();

    hideFeedback();

    showAnswerResult({

      correct: false,

      rocket: false,

      icon: "⏱️",

      title: "DE TIJD IS OP!",

      description:
        "Je 25 seconden zijn voorbij. " +
        "Bij de volgende vraag krijg je een nieuwe kans.",

      points: 0

    });

  }


  /* ===================================================
     33. RESULTAAT TONEN
  =================================================== */

  function showAnswerResult(result) {

    elements.answerInput.disabled = true;
    elements.answerButton.disabled = true;

    elements.answerForm.hidden = true;
    elements.answerResult.hidden = false;

    elements.answerResult.classList.remove(
      "correct",
      "incorrect",
      "rocket-result"
    );

    elements.answerResult.classList.add(
      result.correct
        ? "correct"
        : "incorrect"
    );

    if (result.rocket) {

      elements.answerResult.classList.add(
        "rocket-result"
      );

    }

    elements.resultIcon.textContent =
      result.icon;

    elements.resultTitle.textContent =
      result.title;

    elements.resultDescription.textContent =
      result.description;

    elements.resultPoints.textContent =
      "+" + result.points + " PUNTEN";

  }


  /* ===================================================
     34. VOLGENDE VRAAG
  =================================================== */

  function nextQuestion() {

    if (!gameActive || !answerLocked) {
      return;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {

      endGame();

    } else {

      showQuestion();

    }

  }


  /* ===================================================
     35. EINDSCHERM
  =================================================== */

  function endGame() {

    stopTimer();

    gameActive = false;
    answerLocked = true;

    hideFeedback();

    const newRecord =
      saveRecord(totalHeight);

    const zone =
      getCurrentZone(totalHeight);

    elements.endHeight.textContent =
      formatHeight(totalHeight);

    elements.endScore.textContent =
      formatNumber(totalScore);

    elements.endCorrect.textContent =
      correctAnswers + "/" + questions.length;

    elements.endDescription.textContent =
      "Je bent helemaal naar " +
      zone.name.toLowerCase() +
      " gevlogen. Hoe ver kom je de volgende keer?";

    if (newRecord) {

      elements.endRecord.textContent =
        "🏆 NIEUW PERSOONLIJK RECORD!";

    } else {

      elements.endRecord.textContent =
        "🎈 JOUW RECORD: " +
        formatHeight(personalRecord);

    }

    showScreen("end");

  }


  /* ===================================================
     36. TERUG NAAR BEGIN
  =================================================== */

  function goHome() {

    stopTimer();

    gameActive = false;
    answerLocked = true;

    currentQuestionIndex = 0;

    totalScore = 0;
    totalHeight = 0;
    correctAnswers = 0;

    if (risingTimeout !== null) {

      clearTimeout(risingTimeout);
      risingTimeout = null;

    }

    hideFeedback();

    elements.balloonContainer.classList.remove(
      "rising",
      "rocket-mode"
    );

    elements.progressFill.style.width = "0%";

    updateWorld();

    showScreen("start");

  }


  /* ===================================================
     37. SPEL STOPPEN
  =================================================== */

  function quitGame() {

    if (!gameActive) {

      goHome();
      return;

    }

    const confirmed = window.confirm(
      "Weet je zeker dat je deze vlucht wilt stoppen? " +
      "Je huidige score wordt niet opgeslagen."
    );

    if (confirmed) {

      goHome();

    }

  }


  /* ===================================================
     38. EVENEMENTEN
  =================================================== */

  function initializeEvents() {

    elements.startButton.addEventListener(
      "click",
      startGame
    );

    elements.restartButton.addEventListener(
      "click",
      startGame
    );

    elements.homeButton.addEventListener(
      "click",
      goHome
    );

    elements.quitButton.addEventListener(
      "click",
      quitGame
    );

    elements.answerForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        processAnswer();

      }
    );

    elements.nextButton.addEventListener(
      "click",
      nextQuestion
    );

    elements.answerInput.addEventListener(
      "input",
      function () {

        if (!answerLocked) {
          hideFeedback();
        }

      }
    );

    window.addEventListener(
      "resize",
      updateBalloonPosition
    );

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState === "visible" &&
          gameActive &&
          !answerLocked &&
          timerDeadline > 0 &&
          Date.now() >= timerDeadline
        ) {

          handleTimeUp();

        }

      }
    );

  }


  /* ===================================================
     39. SPEL INITIALISEREN
  =================================================== */

  function initializeQuizBallon() {

    loadRecord();

    addExtraStyles();

    createFeedbackElements();

    initializeEvents();

    const expandedQuestions =
      buildExpandedQuestions();

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      expandedQuestions;

    elements.world.className =
      "world zone-earth";

    updateWorld();

    showScreen("start");

    console.log(
      "🎈 QuizBallon versie 4 is gestart!"
    );

    /*
     * In de browserconsole kun je zien:
     *
     * - Hoeveel antwoorden iedere
     *   vraag heeft.
     *
     * - Of er precies één
     *   raketantwoord is.
     */

    console.table(
      expandedQuestions.map(function (question) {

        return {

          vraag: question.question,

          antwoorden: question.answers.length,

          raketantwoorden: question.answers.filter(
            function (answer) {
              return answer.isRocket;
            }
          ).length

        };

      })
    );

  }


  /* ===================================================
     40. QUIZBALLON STARTEN
  =================================================== */

  initializeQuizBallon();

})();
