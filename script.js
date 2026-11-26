/* ==========================================
   QUIZBALLON - VERSIE 3

   NIEUW:
   - GROTERE ANTWOORDENBANK
   - MINIMAAL 50 ANTWOORDEN PER VRAAG
   - 1 RAKETANTWOORD PER VRAAG
   - 7 STERRENANTWOORDEN
   - 10 WOLKENANTWOORDEN
   - 10 MOOIE VLUCHTEN
   - OVERIGE ANTWOORDEN 20 PUNTEN
   - TIJDELIJKE RAKETANIMATIE

   BEHOUDEN:
   - 10 VRAGEN
   - 25 SECONDEN
   - MEERDERE POGINGEN
   - SLIMME SUGGESTIES
   - LUCHTZONES
   - PLANETEN
   - PERSOONLIJK RECORD

   GEBRUIKT HET BESTAANDE vragen.js
========================================== */

(function () {
  "use strict";


  /* ========================================
     INSTELLINGEN
  ======================================== */

  const QUESTIONS_PER_GAME = 10;
  const SECONDS_PER_QUESTION = 25;

  const KM_PER_POINT = 2;

  const MAX_POSSIBLE_HEIGHT =
    QUESTIONS_PER_GAME * 100 * KM_PER_POINT;

  const RECORD_KEY = "quizballon-record-v1";

  const MAX_SUGGESTIONS = 3;

  const MIN_ANSWERS = 50;

  const ROCKET_DURATION = 2600;


  /* ========================================
     SCORECATEGORIEËN
  ======================================== */

  const TIERS = {

    rocket: {
      points: 100,
      title: "🚀 RAKETANTWOORD!",
      description: "Het zeldzaamste antwoord van deze vraag!",
      icon: "🚀"
    },

    stars: {
      points: 90,
      title: "🌟 TUSSEN DE STERREN!",
      description: "Een uitzonderlijk zeldzaam antwoord!",
      icon: "🌟"
    },

    clouds: {
      points: 70,
      title: "☁️ BOVEN DE WOLKEN!",
      description: "Een sterk en origineel antwoord!",
      icon: "☁️"
    },

    flight: {
      points: 45,
      title: "🎈 MOOIE VLUCHT!",
      description: "Goed bedacht!",
      icon: "🎈"
    },

    low: {
      points: 20,
      title: "🍃 ER ZIT MEER IN!",
      description: "Goed antwoord, maar er zijn zeldzamere mogelijkheden.",
      icon: "🍃"
    }

  };


  /* ========================================
     UITBREIDING ANTWOORDENBANK

     Deze antwoorden worden toegevoegd
     aan de bestaande vragen uit vragen.js.

     Formaat:
     "Antwoord|zeldzaamheidswaarde|alias"

     De zeldzaamheidswaarde bepaalt
     de rangorde van de antwoorden.

     Vervolgens worden de antwoorden
     ingedeeld in de scorecategorieën.
  ======================================== */

  const EXTRA_ANSWERS = {


    /* ======================================
       0. VOGELSOORTEN
    ====================================== */

    0: [
      "Groene ara|72",
      "Hyacintara|85",
      "Roodschouderara|78",
      "Blauwgele ara|54",
      "Geelvleugelara|60",
      "Vlagstaartkolibrie|89",
      "Zwaardkolibrie|93",
      "Bijkolibrie|96",
      "Robijnkeelkolibrie|66",
      "Andesrotshaan|90",
      "Helmneushoornvogel|97",
      "Dubbelhoornige neushoornvogel|85",
      "Neushoornvogel|52",
      "Toko|60",
      "Reuzentoekan|64",
      "Zwavelborsttoekan|82",
      "Groene kakelaar|92",
      "Roodbuikbuulbuul|80",
      "Japanse kraanvogel|86",
      "Kroonkraanvogel|66",
      "Jufferkraanvogel|79",
      "Mandarijneend|46",
      "Muskuseend|40",
      "Blauwgele tangare|88",
      "Scharrelaar|72",
      "Lilaborstroller|94",
      "Zwarte kaketoe|81",
      "Geelkuifkaketoe|59",
      "Galah|84",
      "Lori|53",
      "Regenbooglori|62",
      "Afrikaanse grijze roodstaart|61",
      "Roodmaskerparkiet|83",
      "Zuidelijke ijsvogel|78",
      "Goudfazant|54",
      "Lady Amherstfazant|87",
      "Amerikaanse flamingo|55",
      "Chileense flamingo|66",
      "Kleine flamingo|70",
      "Grote flamingo|38"
    ],


    /* ======================================
       1. AFRIKAANSE LANDEN

       De oorspronkelijke vragenbank
       bevat al ruim 50 landen.
    ====================================== */

    1: [],


    /* ======================================
       2. ZEEDIEREN
    ====================================== */

    2: [
      "Zwaardvis|32",
      "Zeilvis|43",
      "Tonijn|20",
      "Blauwvintonijn|52",
      "Makreel|23",
      "Haring|17",
      "Sardine|22",
      "Ansjovis|34",
      "Kabeljauw|25",
      "Heilbot|39",
      "Tarbot|49",
      "Zeedraakvis|82",
      "Steenvis|68",
      "Koraalduivelvis|64",
      "Koraalvlinder|58",
      "Doktersvis|45",
      "Blauwe doktersvis|52",
      "Papegaaivis|39",
      "Trekkervis|65",
      "Engelvis|38",
      "Koffervis|72",
      "Klipvis|74",
      "Barracuda|43",
      "Schorpioenvis|75",
      "Goblinhaai|91",
      "Franjehaai|93",
      "Groenlandse haai|88",
      "Reuzenhaai|60",
      "Zandhaai|63",
      "Tijgerhaai|42",
      "Citroenhaai|57",
      "Zwartpuntrifhaai|65",
      "Zilverpunthaai|78",
      "Haringhaai|73",
      "Blauwe haai|48",
      "Groene zeeschildpad|47",
      "Lederschildpad|57",
      "Caretschildpad|68",
      "Onechte karetschildpad|76",
      "Platvis|30"
    ],


    /* ======================================
       3. LANDEN WERELDWIJD

       De vraag wordt verbreed van
       Europese landen naar alle landen.
    ====================================== */

    3: [
      "Canada|9",
      "Verenigde Staten|8|Amerika|VS",
      "Mexico|13",
      "Brazilië|13|Brazilie",
      "Argentinië|17|Argentinie",
      "Chili|24",
      "Peru|27",
      "Colombia|24",
      "Venezuela|29",
      "Ecuador|41",
      "Bolivia|48",
      "Paraguay|61",
      "Uruguay|51",
      "Guyana|78",
      "Suriname|26",
      "Japan|9",
      "China|8",
      "India|9",
      "Pakistan|29",
      "Bangladesh|34",
      "Nepal|35",
      "Bhutan|81",
      "Sri Lanka|38",
      "Thailand|16",
      "Vietnam|20",
      "Cambodja|37",
      "Laos|54",
      "Myanmar|49",
      "Maleisië|29|Maleisie",
      "Singapore|19",
      "Indonesië|15|Indonesie",
      "Filipijnen|18",
      "Zuid-Korea|17|Zuid Korea",
      "Noord-Korea|30|Noord Korea",
      "Mongolië|52|Mongolie",
      "Australië|10|Australie",
      "Nieuw-Zeeland|17|Nieuw Zeeland",
      "Papoea-Nieuw-Guinea|76",
      "Vanuatu|82",
      "Salomonseilanden|83",
      "Kiribati|97",
      "Tuvalu|98",
      "Nauru|100",
      "Palau|95",
      "Micronesië|96|Micronesie",
      "Marshalleilanden|97"
    ],


    /* ======================================
       4. FRUIT
    ====================================== */

    4: [
      "Grapefruit|27",
      "Pomelo|42",
      "Rode bes|30",
      "Zwarte bes|37",
      "Kruisbes|51",
      "Veenbes|61",
      "Cranberry|43",
      "Moerbei|62",
      "Dadel|36",
      "Olijf|45",
      "Persimmon|65",
      "Nashi|74|Aziatische peer",
      "Rode pitaja|65",
      "Witte pitaja|73",
      "Buddha's hand|92",
      "Yuzu|79",
      "Sudachi|95",
      "Calamansi|89",
      "Makrutlimoen|94",
      "Kaffirlimoen|90",
      "Bergamot|81",
      "Finger lime|92|Vingerlimoen",
      "Jambolan|98",
      "Langsat|96",
      "Duku|95",
      "Santol|96",
      "Pulasan|98",
      "Ambarella|99",
      "Soursop|85|Zuurzak",
      "Noni|90",
      "Atemoya|94",
      "Cupuaçu|99|Cupuacu",
      "Camu camu|98",
      "Açaí|80|Acai",
      "Taybes|90"
    ],


    /* ======================================
       5. HOOFDSTEDEN WERELDWIJD

       De vraag wordt verbreed.
    ====================================== */

    5: [
      "Washington D.C.|11|Washington",
      "Ottawa|19",
      "Mexico-Stad|18|Mexico City",
      "Brasília|22|Brasilia",
      "Buenos Aires|16",
      "Santiago|25",
      "Lima|23",
      "Bogotá|28|Bogota",
      "Caracas|31",
      "Quito|42",
      "La Paz|39",
      "Sucre|72",
      "Asunción|75|Asuncion",
      "Montevideo|53",
      "Georgetown|87",
      "Paramaribo|42",
      "Tokio|10|Tokyo",
      "Peking|16|Beijing",
      "New Delhi|20",
      "Islamabad|50",
      "Dhaka|62",
      "Kathmandu|48",
      "Thimphu|93",
      "Sri Jayawardenapura Kotte|100",
      "Bangkok|17",
      "Hanoi|32",
      "Phnom Penh|47",
      "Vientiane|80",
      "Naypyidaw|91",
      "Kuala Lumpur|27",
      "Singapore|20",
      "Manilla|24|Manila",
      "Seoul|22",
      "Pyongyang|33",
      "Ulaanbaatar|77",
      "Canberra|28",
      "Wellington|36",
      "Port Moresby|90",
      "Port Vila|92",
      "Honiara|95",
      "Tarawa|98",
      "Funafuti|100"
    ],


    /* ======================================
       6. HONDENRASSEN
    ====================================== */

    6: [
      "Australische herder|36",
      "Australian cattle dog|55",
      "Belgische herder|29",
      "Mechelse herder|34",
      "Groenendaeler|71",
      "Tervuerense herder|83",
      "Laekense herder|94",
      "Bobtail|48",
      "Old English sheepdog|55",
      "Duitse dog|32",
      "Deense dog|35",
      "Ierse wolfshond|59",
      "Schotse deerhound|80",
      "Afghaanse windhond|63",
      "Italiaans windhondje|66",
      "Italiaanse mastiff|57",
      "Engelse mastiff|56",
      "Bullmastiff|46",
      "Bordeauxdog|55",
      "Dogo argentino|72",
      "Fila brasileiro|93",
      "Boerboel|85",
      "Rhodesian ridgeback|56",
      "Pharaohond|89",
      "Cirneco dell'Etna|96",
      "Podenco ibicenco|88",
      "Podenco canario|91",
      "Duitse staande korthaar|60",
      "Ierse setter|45",
      "Engelse setter|48",
      "Gordon setter|73",
      "Clumberspaniël|98|Clumber spaniel",
      "Sussexspaniël|100|Sussex spaniel",
      "Fieldspaniël|97|Field spaniel",
      "Welsh springerspaniël|75",
      "Lagotto romagnolo|80",
      "Kooikerhondje|49",
      "Markiesje|90",
      "Stabijhoun|74",
      "Wetterhoun|92"
    ],


    /* ======================================
       7. OLYMPISCHE DISCIPLINES

       De vraag wordt verduidelijkt:
       sporten én disciplines.
    ====================================== */

    7: [
      "100 meter sprint|12",
      "200 meter sprint|18",
      "400 meter sprint|21",
      "800 meter hardlopen|28",
      "1500 meter hardlopen|31",
      "5000 meter hardlopen|40",
      "10000 meter hardlopen|48",
      "Marathon|15",
      "110 meter horden|47",
      "400 meter horden|52",
      "3000 meter steeplechase|79",
      "Hoogspringen|30",
      "Verspringen|28",
      "Hink-stap-springen|66",
      "Polsstokhoogspringen|39",
      "Speerwerpen|31",
      "Discuswerpen|30",
      "Kogelstoten|34",
      "Kogelslingeren|57",
      "Tienkamp|45",
      "Zevenkamp|53",
      "Estafetteloop|25",
      "4x100 meter estafette|43",
      "4x400 meter estafette|56",
      "100 meter rugslag|40",
      "200 meter rugslag|45",
      "100 meter schoolslag|37",
      "200 meter schoolslag|49",
      "100 meter vlinderslag|46",
      "200 meter wisselslag|53",
      "Synchroonzwemmen|41|Artistiek zwemmen",
      "Schoonspringen|36",
      "10 meter platformduiken|67",
      "3 meter plankduiken|72",
      "BMX freestyle|58",
      "BMX racing|59",
      "Keirin|77",
      "Omnium|84",
      "Individuele tijdrit|48",
      "Klimonderdeel sportklimmen|65"
    ],


    /* ======================================
       8. STEDEN IN JAPAN
    ====================================== */

    8: [
      "Otaru|78",
      "Asahikawa|84",
      "Obihiro|93",
      "Kitami|94",
      "Muroran|95",
      "Tomakomai|92",
      "Hirosaki|88",
      "Hachinohe|92",
      "Ichinoseki|97",
      "Hanamaki|97",
      "Yokote|100",
      "Noshiro|98",
      "Sakata|97",
      "Tsuruoka|96",
      "Fukushima|73",
      "Koriyama|84",
      "Iwaki|87",
      "Mito|82",
      "Hitachi|91",
      "Tsuchiura|95",
      "Kawagoe|85",
      "Tokorozawa|89",
      "Saitama|66",
      "Funabashi|85",
      "Kashiwa|91",
      "Ichikawa|89",
      "Machida|88",
      "Hachioji|87",
      "Fujisawa|89",
      "Odawara|88",
      "Yokosuka|83",
      "Yamanashi|92",
      "Nagano|77",
      "Ueda|97",
      "Suwa|99",
      "Joetsu|97|Jōetsu",
      "Nagaoka|95",
      "Takaoka|97",
      "Komatsu|96",
      "Sabae|100"
    ],


    /* ======================================
       9. MANEN VAN HET ZONNESTELSEL
    ====================================== */

    9: [
      "Leda|96",
      "Lysithea|98",
      "Ananke|96",
      "Callirrhoe|99",
      "Taygete|100",
      "Chaldene|99",
      "Harpalyke|99",
      "Kalyke|98",
      "Iocaste|100",
      "Erinome|99",
      "Isonoe|99",
      "Praxidike|100",
      "Autonoe|99",
      "Thyone|99",
      "Hermippe|99",
      "Aitne|99",
      "Eurydome|100",
      "Euanthe|100",
      "Euporie|100",
      "Orthosie|100",
      "Sponde|100",
      "Kale|100",
      "Pasithee|100",
      "Hegemone|100",
      "Mneme|100",
      "Aoede|100",
      "Thelxinoe|100",
      "Arche|100",
      "Kallichore|100",
      "Helike|100",
      "Carpo|100",
      "Eukelade|100",
      "Cyllene|100",
      "Kore|100",
      "Herse|100"
    ],


    /* ======================================
       10. MUZIEKINSTRUMENTEN
    ====================================== */

    10: [
      "Piccolo|48",
      "Basklarinet|65",
      "Altklarinet|73",
      "Contrafagot|89",
      "Engelse hoorn|72",
      "Althobo|80",
      "Hoorn|42|Franse hoorn",
      "Eufonium|78",
      "Tuba|33",
      "Sousafoon|73",
      "Bastrombone|71",
      "Bugel|66",
      "Cornet|72",
      "Flügelhorn|83",
      "Altsaxofoon|37",
      "Tenorsaxofoon|43",
      "Baritonsaxofoon|62",
      "Sopraansaxofoon|57",
      "Basgitaar|13",
      "Elektrische gitaar|11",
      "Akoestische gitaar|13",
      "Steelgitaar|67",
      "Dobro|84",
      "Luit|55",
      "Theorbe|99",
      "Klavecimbel|56",
      "Clavichord|92",
      "Celesta|77",
      "Carillon|80",
      "Pijporgel|56",
      "Harmonium|82",
      "Bandoneon|86",
      "Concertina|89",
      "Shakuhachi|95",
      "Hulusi|100",
      "Dizi|95",
      "Morin khuur|99",
      "Sarangi|97",
      "Gayageum|99",
      "Guqin|100"
    ],


    /* ======================================
       11. DINOSAURIËRS
    ====================================== */

    11: [
      "Torosaurus|73",
      "Centrosaurus|76",
      "Chasmosaurus|79",
      "Diabloceratops|94",
      "Kosmoceratops|94",
      "Nasutoceratops|95",
      "Einiosaurus|93",
      "Achelousaurus|96",
      "Pentasaurus|97",
      "Pentaceratops|82",
      "Rubeosaurus|97",
      "Regaliceratops|98",
      "Sinoceratops|87",
      "Yutyrannus|92",
      "Dilong|99",
      "Daspletosaurus|83",
      "Tarbosaurus|76",
      "Alioramus|94",
      "Qianzhousaurus|98",
      "Lythronax|95",
      "Teratophoneus|97",
      "Raptorex|93",
      "Austroraptor|96",
      "Buitreraptor|98",
      "Bambiraptor|92",
      "Saurornitholestes|97",
      "Achillobator|96",
      "Dromaeosaurus|88",
      "Halszkaraptor|99",
      "Adasaurus|99",
      "Pyroraptor|87",
      "Tianyuraptor|100",
      "Zhenyuanlong|100",
      "Sinornithosaurus|94",
      "Changyuraptor|100"
    ],


    /* ======================================
       12. EILANDEN
    ====================================== */

    12: [
      "Hokkaido|40",
      "Honshu|32",
      "Shikoku|67",
      "Kyushu|49",
      "Okinawa|45",
      "Iriomote|95",
      "Ishigaki|86",
      "Yakushima|92",
      "Tsushima|89",
      "Sado|96",
      "Shodoshima|98",
      "Jeju|49",
      "Ulleungdo|96",
      "Taiwan|23",
      "Hainan|55",
      "Luzon|44",
      "Mindanao|52",
      "Palawan|45",
      "Boracay|30",
      "Cebu|34",
      "Bohol|58",
      "Negros|68",
      "Panay|74",
      "Samar|82",
      "Leyte|78",
      "Siargao|57",
      "Siargao-eiland|57",
      "Bantayan|84",
      "Camiguin|88",
      "Siquijor|87",
      "El Hierro|73",
      "La Gomera|64",
      "La Palma|58",
      "Formentera|55",
      "La Graciosa|86",
      "Pantelleria|93",
      "Lampedusa|75",
      "Elba|71",
      "Capri|48",
      "Ischia|59"
    ]

  };


  /* ========================================
     SPELSTATUS
  ======================================== */

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


  /* ========================================
     ELEMENTEN
  ======================================== */

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


  /* ========================================
     EXTRA ELEMENTEN
  ======================================== */

  let feedbackElement = null;
  let feedbackText = null;
  let suggestionsElement = null;


  /* ========================================
     HULPFUNCTIES
  ======================================== */

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


  /* ========================================
     ANTWOORDREGEL OMZETTEN
  ======================================== */

  function parseExtraAnswer(line) {

    const parts = line.split("|");

    return {
      answer: parts[0].trim(),

      points: Math.max(
        1,
        Math.min(100, Number(parts[1]) || 1)
      ),

      aliases: parts.slice(2).map(function (alias) {
        return alias.trim();
      })

    };

  }


  /* ========================================
     BESTAANDE VRAGEN UITBREIDEN
  ======================================== */

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
            points: answer.points,
            aliases: [...(answer.aliases || [])]
          };

        }
      );

      const seen = new Set();

      answers.forEach(function (answer) {

        [
          answer.answer,
          ...answer.aliases
        ].forEach(function (name) {

          seen.add(normalizeAnswer(name));

        });

      });

      const additions = EXTRA_ANSWERS[index] || [];

      additions.forEach(function (line) {

        const item = parseExtraAnswer(line);

        const key = normalizeAnswer(item.answer);

        if (!key || seen.has(key)) {
          return;
        }

        /*
         * Voorkom ook dubbele alternatieve
         * schrijfwijzen.
         */

        item.aliases = item.aliases.filter(
          function (alias) {

            const normalized = normalizeAnswer(alias);

            return normalized && !seen.has(normalized);

          }
        );

        answers.push(item);

        seen.add(key);

        item.aliases.forEach(function (alias) {
          seen.add(normalizeAnswer(alias));
        });

      });

      /*
       * Bepaal de scoregroepen.
       */

      assignTiers(answers);

      /*
       * Twee vragen worden verbreed
       * zodat extra landen en steden
       * ook logisch geldig zijn.
       */

      let questionText = question.question;
      let questionHint = question.hint;

      if (index === 3) {

        questionText =
          "Noem een land ergens ter wereld.";

        questionHint =
          "Er zijn bijna tweehonderd landen. " +
          "Denk aan kleine en minder bekende landen.";

      }

      if (index === 5) {

        questionText =
          "Noem een hoofdstad ergens ter wereld.";

        questionHint =
          "Van bekende wereldsteden tot " +
          "kleine en bijzondere hoofdsteden.";

      }

      if (index === 7) {

        questionText =
          "Noem een sport of discipline van de Olympische Zomerspelen.";

        questionHint =
          "Een sport of een specifieke " +
          "olympische discipline is geldig.";

      }

      if (answers.length < MIN_ANSWERS) {

        console.warn(
          "QuizBallon: vraag " +
          (index + 1) +
          " heeft " +
          answers.length +
          " antwoorden; doel is minimaal 50."
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


  /* ========================================
     SCOREGROEPEN TOEKENNEN

     Rangorde:
     1   = RAKET
     2-8 = STERREN
     9-18 = WOLKEN
     19-28 = MOOIE VLUCHT
     29+ = ER ZIT MEER IN

     Bij gelijke waarden wordt alfabetisch
     gesorteerd. Zo blijft de indeling
     voor dezelfde vragenbank gelijk.
  ======================================== */

  function assignTiers(answers) {

    const ranked = [...answers].sort(
      function (a, b) {

        if (b.points !== a.points) {
          return b.points - a.points;
        }

        return a.answer.localeCompare(
          b.answer,
          "nl"
        );

      }
    );

    ranked.forEach(function (answer, index) {

      let tier;

      if (index === 0) {

        tier = "rocket";

      } else if (index <= 7) {

        tier = "stars";

      } else if (index <= 17) {

        tier = "clouds";

      } else if (index <= 27) {

        tier = "flight";

      } else {

        tier = "low";

      }

      answer.tier = tier;

      answer.points = TIERS[tier].points;

    });

  }


  /* ========================================
     EXTRA CSS

     Wordt automatisch geladen.
     style.css hoeft niet te veranderen.
  ======================================== */

  function addExtraStyles() {

    if (byId("quizballon-v3-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "quizballon-v3-styles";

    style.textContent = `

      /* ===================================
         FOUT ANTWOORD
      =================================== */

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


      /* ===================================
         ANTWOORDSUGGESTIES
      =================================== */

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


      /* ===================================
         RAKETANIMATIE

         De ballon verandert tijdelijk
         in een raket bij 100 punten.
      =================================== */

      .balloon-container.rocket-mode {
        z-index: 20;
      }

      .balloon-container.rocket-mode
      .balloon {
        animation:
          qbRocketBlast .45s ease-in-out
          infinite alternate !important;
      }

      .balloon-container.rocket-mode
      .balloon-top,

      .balloon-container.rocket-mode
      .balloon-ropes,

      .balloon-container.rocket-mode
      .balloon-basket,

      .balloon-container.rocket-mode
      .balloon-name {
        opacity: 0 !important;
      }

      .balloon-container.rocket-mode
      .balloon::before {
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

      .balloon-container.rocket-mode
      .balloon::after {
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


      /* ===================================
         RAKETMELDING
      =================================== */

      .answer-result.rocket-result {
        background:
          linear-gradient(
            135deg,
            #fff1bd,
            #ffe0af
          );

        border: 2px solid #ffb347;
      }

      .answer-result.rocket-result
      .result-points {
        color: #d66b19;
      }

      .answer-result.rocket-result
      .result-icon {
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


      /* ===================================
         MOBIEL
      =================================== */

      @media (max-width: 480px) {

        .qb-feedback {
          padding: 15px;
        }

        .qb-suggestion-button {
          min-height: 48px;
        }

        .balloon-container.rocket-mode
        .balloon::before {
          font-size: 135px;
        }

      }


      /* ===================================
         MINDER BEWEGING
      =================================== */

      @media (prefers-reduced-motion: reduce) {

        .balloon-container.rocket-mode
        .balloon,

        .balloon-container.rocket-mode
        .balloon::after,

        .answer-result.rocket-result
        .result-icon {
          animation: none !important;
        }

      }

    `;

    document.head.appendChild(style);

  }


  /* ========================================
     FEEDBACK AANMAKEN
  ======================================== */

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


  /* ========================================
     FEEDBACK VERBERGEN
  ======================================== */

  function hideFeedback() {

    feedbackElement.hidden = true;

    feedbackText.textContent = "";

    suggestionsElement.replaceChildren();

  }


  /* ========================================
     LEVENSHTEIN-AFSTAND

     Herkent kleine typefouten.
  ======================================== */

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


  /* ========================================
     SUGGESTIES ZOEKEN
  ======================================== */

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

        const difference = Math.abs(
          candidate.length - input.length
        );

        /*
         * Een typefout van één letter.
         */

        if (
          input.length >= 4 &&
          difference <= 1
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
         * Een onvolledig antwoord.
         *
         * neushoorn -> neushoornvogel
         */

        if (
          input.length >= 5 &&
          candidate.startsWith(input) &&
          input.length >= candidate.length * .6
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


  /* ========================================
     SUGGESTIES TONEN
  ======================================== */

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


  /* ========================================
     FOUT ANTWOORD

     TIMER LOOPT DOOR.
     OPNIEUW PROBEREN MAG.
  ======================================== */

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
        ? "Dit antwoord is nog niet herkend. Probeer een suggestie of vul iets anders in!"
        : "❌ Dit antwoord wordt nog niet herkend. Probeer iets anders zolang de tijd loopt!";

    showSuggestions(suggestions);

  }


  /* ========================================
     ANTWOORD CONTROLEREN
  ======================================== */

  function checkAnswer(question, userAnswer) {

    const input = normalizeAnswer(userAnswer);

    if (!input) {
      return null;
    }

    for (const item of question.answers) {

      const names = [
        item.answer,
        ...(item.aliases || [])
      ];

      if (names.some(function (name) {

        return normalizeAnswer(name) === input;

      })) {

        return item;

      }

    }

    return null;

  }


  /* ========================================
     RECORD LADEN
  ======================================== */

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


  /* ========================================
     RECORD OPSLAAN
  ======================================== */

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

      // Het spel blijft gewoon werken.

    }

    updateRecordDisplay();

    return true;

  }


  /* ========================================
     RECORD TONEN
  ======================================== */

  function updateRecordDisplay() {

    elements.headerRecord.textContent =
      formatHeight(personalRecord);

  }


  /* ========================================
     LUCHTZONES
  ======================================== */

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


  /* ========================================
     HUIDIGE ZONE BEPALEN
  ======================================== */

  function getCurrentZone(height) {

    let selected = ZONES[0];

    ZONES.forEach(function (zone) {

      if (height >= zone.height) {

        selected = zone;

      }

    });

    return selected;

  }


  /* ========================================
     WERELD BIJWERKEN
  ======================================== */

  function updateWorld() {

    const zone = getCurrentZone(totalHeight);

    elements.world.className =
      "world " + zone.className;

    elements.zoneName.textContent =
      zone.name;

    updateBalloonPosition();

  }


  /* ========================================
     BALLONPOSITIE
  ======================================== */

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


  /* ========================================
     SCORE EN HOOGTE
  ======================================== */

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


  /* ========================================
     NORMALE STIJGANIMATIE
  ======================================== */

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
        rectangle.width * .5 +
        (Math.random() - .5) * 110 +
        "px";

      particle.style.top =
        rectangle.top +
        rectangle.height * .65 +
        (Math.random() - .5) * 90 +
        "px";

      elements.particles.appendChild(particle);

      setTimeout(function () {

        particle.remove();

      }, 1300);

    }

  }


  /* ========================================
     RAKET EN BALLONANIMATIE
  ======================================== */

  function animateBalloon(isRocket) {

    if (risingTimeout !== null) {

      clearTimeout(risingTimeout);

    }

    elements.balloonContainer.classList.remove(
      "rising",
      "rocket-mode"
    );

    /*
     * RAKETANTWOORD:
     * de ballon verandert tijdelijk
     * in een raket.
     */

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


  /* ========================================
     TIMER STOPPEN
  ======================================== */

  function stopTimer() {

    if (timerInterval !== null) {

      clearInterval(timerInterval);

      timerInterval = null;

    }

    timerDeadline = 0;

  }


  /* ========================================
     TIMER TONEN
  ======================================== */

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


  /* ========================================
     TIMER STARTEN
  ======================================== */

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


  /* ========================================
     SCHERM TONEN
  ======================================== */

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


  /* ========================================
     NIEUW SPEL STARTEN
  ======================================== */

  function startGame() {

    if (questions.length < QUESTIONS_PER_GAME) {

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
      window.QUIZBALLON_EXPANDED_QUESTIONS
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


  /* ========================================
     VRAAG TONEN
  ======================================== */

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


  /* ========================================
     ANTWOORD VERWERKEN
  ======================================== */

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
       * FOUT ANTWOORD:
       *
       * Timer blijft lopen.
       * De speler kan opnieuw proberen.
       */

      showIncorrectFeedback(userAnswer);

      elements.answerInput.focus();
      elements.answerInput.select();

    }

  }


  /* ========================================
     GOED ANTWOORD
  ======================================== */

  function handleCorrectAnswer(answer) {

    if (answerLocked || !gameActive) {
      return;
    }

    answerLocked = true;

    stopTimer();

    const tier = TIERS[answer.tier];

    const points = tier.points;

    const gainedHeight =
      points * KM_PER_POINT;

    const isRocket =
      answer.tier === "rocket";

    totalScore += points;
    totalHeight += gainedHeight;

    correctAnswers++;

    updateStats();

    animateBalloon(isRocket);

    showAnswerResult({

      correct: true,

      rocket: isRocket,

      icon: tier.icon,

      title: tier.title,

      description:
        tier.description +
        " Je antwoord was " +
        answer.answer +
        ". Je stijgt " +
        formatHeight(gainedHeight) +
        "!",

      points: points

    });

  }


  /* ========================================
     TIJD OP
  ======================================== */

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


  /* ========================================
     RESULTAAT
  ======================================== */

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


  /* ========================================
     VOLGENDE VRAAG
  ======================================== */

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


  /* ========================================
     SPEL AFRONDEN
  ======================================== */

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


  /* ========================================
     TERUG NAAR BEGIN
  ======================================== */

  function goHome() {

    stopTimer();

    gameActive = false;
    answerLocked = true;

    totalScore = 0;
    totalHeight = 0;
    correctAnswers = 0;

    hideFeedback();

    elements.balloonContainer.classList.remove(
      "rising",
      "rocket-mode"
    );

    elements.progressFill.style.width = "0%";

    updateWorld();

    showScreen("start");

  }


  /* ========================================
     STOPKNOP
  ======================================== */

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


  /* ========================================
     EVENEMENTEN
  ======================================== */

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


  /* ========================================
     QUIZBALLON STARTEN
  ======================================== */

  function initializeQuizBallon() {

    loadRecord();

    addExtraStyles();

    createFeedbackElements();

    initializeEvents();

    const expandedQuestions =
      buildExpandedQuestions();

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      expandedQuestions;

    /*
     * Bewaar een kopie om het aantal
     * vragen te controleren.
     */

    questions = expandedQuestions;

    elements.world.className =
      "world zone-earth";

    updateWorld();

    showScreen("start");

    console.log(
      "🎈 QuizBallon versie 3 gestart!"
    );

    console.table(
      expandedQuestions.map(function (question) {

        return {
          vraag: question.question,
          antwoorden: question.answers.length,
          raketantwoorden: question.answers.filter(
            function (answer) {
              return answer.tier === "rocket";
            }
          ).length
        };

      })
    );

  }


  initializeQuizBallon();

})();
