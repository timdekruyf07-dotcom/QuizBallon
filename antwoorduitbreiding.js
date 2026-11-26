/* ==========================================
   QUIZBALLON
   ANTWOORDUITBREIDING - VERSIE 1

   NIEUW:
   - EXTRA GELDIGE ANTWOORDEN
   - BEKENDE HONDENKRUISINGEN
   - GOLDADOR / GOLDEN LABRADOR
   - EXTRA SYNONIEMEN
   - INDIVIDUELE ZELDZAAMHEIDSSCORES
   - BEHOUD VAN RAKETANTWOORDEN

   WERKT SAMEN MET:
   - vragen.js
   - script.js
   - daily.js

   BELANGRIJK:
   Dit bestand wordt geladen NA script.js
   maar VOOR daily.js.
========================================== */

(function () {
  "use strict";


  /* ========================================
     INSTELLINGEN
  ======================================== */

  const MIN_POINTS = 10;
  const MAX_NORMAL_POINTS = 99;


  /* ========================================
     ANTWOORDEN NORMALISEREN
  ======================================== */

  function normalize(value) {

    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['’‘`]/g, "")
      .replace(/[-–—_]/g, " ")
      .replace(/[.,!?;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  /* ========================================
     SCORES BEGRENZEN

     Nieuwe normale antwoorden krijgen
     maximaal 99 punten.

     Het bestaande raketantwoord van
     iedere vraag blijft dus speciaal.
  ======================================== */

  function safePoints(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return MIN_POINTS;
    }

    return Math.max(
      MIN_POINTS,
      Math.min(
        MAX_NORMAL_POINTS,
        Math.round(number)
      )
    );

  }


  /* ========================================
     EXTRA ANTWOORDEN

     Formaat:
     "Antwoord|punten|alias|alias"

     De index verwijst naar de vraag
     uit de bestaande vragenbank.
  ======================================== */

  const EXTRA_ANSWERS = {


    /* ======================================
       0. VOGELS
    ====================================== */

    0: [
      "Grote toekan|35",
      "Roodsnaveltoekan|62",
      "Groefsnaveltoekan|77",
      "Zwarte kaketoe|58",
      "Palmbekaketoe|88",
      "Geelkuifkaketoe|43",
      "Witkuifkaketoe|65",
      "Molukkenkaketoe|79",
      "Roze kaketoe|49",
      "Zwartkopcaique|87",
      "Witbuikcaique|90",
      "Blauwgele ara|35",
      "Groenvleugelara|64",
      "Hyacintara|82",
      "Halsbandparkiet|25",
      "Monniksparkiet|51",
      "Zonparkiet|46",
      "Roodmaskerparkiet|76",
      "Zwartkopamazone|91",
      "Geelvoorhoofdamazone|83"
    ],


    /* ======================================
       1. LANDEN IN AFRIKA

       De huidige vragenbank heeft hier
       al een uitgebreide landenlijst.
    ====================================== */

    1: [],


    /* ======================================
       2. ZEEDIEREN
    ====================================== */

    2: [
      "Zeeleeuw|55",
      "Californische zeeleeuw|63",
      "Stellerzeeleeuw|87",
      "Zuid-Amerikaanse zeeleeuw|78",
      "Pelsrob|59",
      "Zeeluipaard|69",
      "Weddellzeehond|86",
      "Krabbeneterzeehond|88",
      "Zeeolifant|65",
      "Noordelijke zeeolifant|81",
      "Zuidelijke zeeolifant|85",
      "Zeeslak|46",
      "Naaktslak in zee|61|Zeenaaktslak",
      "Blauwe draak|81|Blauwe zeedraak",
      "Zeeanemoon|44",
      "Heremietkreeft|51",
      "Koningkrab|55",
      "Japanse reuzenkrab|83",
      "Zee-engel|89",
      "Zeevlinder|92"
    ],


    /* ======================================
       3. LANDEN

       De bestaande landenlijst
       blijft geldig.
    ====================================== */

    3: [],


    /* ======================================
       4. FRUIT
    ====================================== */

    4: [
      "Rode grapefruit|32",
      "Witte grapefruit|46",
      "Mineola|59",
      "Clementine|25",
      "Satsuma|55",
      "Jostabes|73",
      "Loganbes|81",
      "Boysenbes|78",
      "Taybes|74",
      "Japanse wijnbes|66",
      "Zwarte moerbei|69",
      "Witte moerbei|75",
      "Gele kiwi|32",
      "Kiwibes|49",
      "Kweepeer|58",
      "Mirabel|64",
      "Bergamotpeer|89"
    ],


    /* ======================================
       5. HOOFDSTEDEN

       Extra veelvoorkomende namen
       lossen we op met aliassen.
    ====================================== */

    5: [],


    /* ======================================
       6. HONDENRASSEN EN KRUISINGEN

       HIER ZIT DE GROOTSTE VERBETERING.

       Omdat de vraag voortaan ook
       kruisingen toestaat, tellen
       bekende kruisingen mee.

       Golden labrador wordt hier
       geaccepteerd als informele
       benaming voor Goldador.
    ====================================== */

    6: [

      /* BEKENDE KRUISINGEN */

      "Goldador|58|Golden labrador|Golden Labrador Retriever",
      "Labradoodle|31|Labrador poedel kruising",
      "Goldendoodle|29|Golden doodle",
      "Cockapoo|42|Cockerpoo",
      "Cavapoo|36|Cavoodle",
      "Maltipoo|39",
      "Pomsky|50",
      "Puggle|52",
      "Schnoodle|64",
      "Yorkipoo|60|Yorkiepoo",
      "Bernedoodle|47",
      "Aussiedoodle|61",
      "Sheepadoodle|68",
      "Boxador|73",
      "Borador|67",
      "Labrakita|91",
      "Chorkie|66",
      "Chiweenie|70",
      "Jackapoo|71",
      "Sprocker|69",
      "Cavachon|75",
      "Shihpoo|57|Shih poo",
      "Morkie|63",
      "Peekapoo|83",
      "Bassador|86",
      "Huskador|82",
      "Gerberian Shepsky|88|Shepsky",
      "Chug|81",
      "Dorgi|84",
      "Beaglier|79",
      "Springador|76",
      "Corgipoo|89",
      "Cavapom|91",
      "Bullmatian|94",
      "Shollie|83",

      /* EXTRA OFFICIËLE RASSEN */

      "Australische kelpie|65",
      "Australische terriër|69",
      "Bedlingtonterriër|81",
      "Borderterriër|55",
      "Bullterriër|35",
      "Miniatuur bullterriër|68",
      "Tibetaanse terriër|62",
      "Tibetaanse spaniël|75",
      "Tibetaanse mastiff|57",
      "Japanse spits|66",
      "Finse spits|73",
      "Noorse elandhond|78",
      "IJslandse hond|82",
      "Eurasier|74",
      "Beauceron|79",
      "Briard|72",
      "Bouvier des Flandres|63",
      "Hovawart|77",
      "Appenzeller sennenhond|71",
      "Entlebucher sennenhond|85",
      "Grote Zwitserse sennenhond|66",
      "Pyrenese berghond|62",
      "Pyrenese herdershond|81",
      "Portugese waterhond|64",
      "Spaanse waterhond|68",
      "Ierse waterspaniël|86",
      "Amerikaanse waterspaniël|92",
      "Flatcoated retriever|56|Flat coated retriever",
      "Curlycoated retriever|83|Curly coated retriever",
      "Nova Scotia duck tolling retriever|74|Toller",
      "Chesapeake Bay retriever|87",
      "Clumber spaniël|90",
      "Tosa|91|Tosa inu",
      "Shar-pei|53|Shar pei",
      "Chowchow|38|Chow chow",
      "Lhasa apso|59",
      "Pekinees|40",
      "Japanse chin|78",
      "Papillon|44",
      "Phalène|81|Phalene",
      "Pomeriaan|25|Pomeranian",
      "Dwergkees|26",
      "Middelgrote keeshond|66",
      "Grote keeshond|72",
      "Kleinspitz|78",
      "Volpino italiano|89",
      "Bolognese|76",
      "Coton de Tuléar|83|Coton de Tulear",
      "Bichon havanais|62|Havanezer"

    ],


    /* ======================================
       7. OLYMPISCHE SPORTEN
    ====================================== */

    7: [
      "Wegwielrennen|23",
      "Tijdrit|41",
      "Teamsprint baanwielrennen|78",
      "Ploegenachtervolging|72",
      "Sprint baanwielrennen|58",
      "Madison baanwielrennen|89",
      "Scratch baanwielrennen|91",
      "Ringsport turnen|66",
      "Voltige turnen|65",
      "Balkturnen|52",
      "Brug ongelijk|64",
      "Paard voltige|59",
      "Vloeroefening|42",
      "Evenwichtsbalk|38",
      "Tafeltennis dubbelspel|47",
      "Badminton gemengd dubbel|51"
    ],


    /* ======================================
       8. STEDEN IN JAPAN
    ====================================== */

    8: [
      "Kawaguchi|80",
      "Koshigaya|84",
      "Kasukabe|89",
      "Ageo|91",
      "Niiza|92",
      "Mitaka|81",
      "Musashino|86",
      "Chofu|83",
      "Kokubunji|94",
      "Kunitachi|96",
      "Inagi|95",
      "Tama|88",
      "Kiyose|97",
      "Higashimurayama|96",
      "Koganei|93",
      "Akishima|95"
    ],


    /* ======================================
       9. MANEN

       Hier zijn er al veel beschikbaar.
    ====================================== */

    9: [],


    /* ======================================
       10. MUZIEKINSTRUMENTEN
    ====================================== */

    10: [
      "Bastuba|46",
      "Baritonhoorn|66",
      "Althoorn|74",
      "Kornet|62",
      "Alpenhoorn|68",
      "Tinwhistle|72|Tin whistle",
      "Panfluit|38",
      "Bansuri|79",
      "Quena|86",
      "Zurna|88",
      "Ney|82",
      "Oud|76",
      "Bouzouki|64",
      "Cister|91",
      "Cittern|92",
      "Autoharp|83",
      "Draailier|75",
      "Hardangerviool|87",
      "Viola da gamba|85"
    ],


    /* ======================================
       11. DINOSAURIËRS
    ====================================== */

    11: [
      "Ouranosaurus|72",
      "Shantungosaurus|85",
      "Lambeosaurus|65",
      "Saurolophus|77",
      "Gryposaurus|82",
      "Hypacrosaurus|83",
      "Tsintaosaurus|91",
      "Olorotitan|94",
      "Magnapaulia|95",
      "Hadrosaurus|64",
      "Aralosaurus|96",
      "Nipponosaurus|97",
      "Irritator|88",
      "Oxalaia|94",
      "Siamosaurus|98"
    ],


    /* ======================================
       12. EILANDEN
    ====================================== */

    12: [
      "Vancouver Island|40",
      "Tasmanië|29|Tasmanie",
      "Nieuw-Guinea|36|Nieuw Guinea",
      "Zuidereiland|51",
      "Noordereiland|48",
      "Stewart Island|79",
      "Chathameilanden|87",
      "Lord Howe-eiland|89",
      "Norfolk|82|Norfolkeiland",
      "Christmas Island|76|Christmaseiland",
      "Kokoseilanden|83",
      "Ascension|91|Ascensioneiland",
      "South Georgia|88|Zuid-Georgia",
      "Kerguelen|94",
      "Heardeiland|97"
    ]

  };


  /* ========================================
     EXTRA ALTERNATIEVE NAMEN

     Als een antwoord al bestaat,
     voegen we een alias toe.

     We maken dan GEEN tweede antwoord.

     Zo blijven scores eerlijk.
  ======================================== */

  const EXTRA_ALIASES = {

    0: {
      "kakapo": [
        "Kākāpō"
      ],
      "neushoornvogel": [
        "Neushoorn vogel"
      ]
    },

    2: {
      "orka": [
        "Zwaardwalvis"
      ],
      "potvis": [
        "Sperm whale"
      ],
      "zeeleeuw": [
        "Zee leeuw"
      ]
    },

    4: {
      "drakenvrucht": [
        "Dragonfruit",
        "Dragon fruit"
      ],
      "passievrucht": [
        "Passie fruit"
      ]
    },

    5: {
      "tokio": [
        "Tokyo"
      ],
      "peking": [
        "Beijing"
      ],
      "kyiv": [
        "Kiev",
        "Kiew"
      ]
    },

    6: {
      "labrador retriever": [
        "Labrador",
        "Gele labrador",
        "Zwarte labrador",
        "Bruine labrador"
      ],
      "golden retriever": [
        "Golden"
      ],
      "bordercollie": [
        "Border collie"
      ],
      "goldador": [
        "Golden labrador",
        "Golden Labrador kruising"
      ],
      "labradoodle": [
        "Labra doodle"
      ],
      "goldendoodle": [
        "Golden doodle"
      ],
      "cavapoo": [
        "Cavoodle"
      ]
    },

    8: {
      "tokio": [
        "Tokyo"
      ],
      "kyoto": [
        "Kioto"
      ]
    },

    10: {
      "ukelele": [
        "Ukulele"
      ],
      "trombone": [
        "Schuiftrombone"
      ]
    },

    11: {
      "tyrannosaurus": [
        "T-rex",
        "T rex",
        "Tyrannosaurus rex"
      ]
    }

  };


  /* ========================================
     VRAGENBANK OPHALEN

     script.js moet eerder geladen zijn.
  ======================================== */

  const questions =
    window.QUIZBALLON_EXPANDED_QUESTIONS;

  if (!Array.isArray(questions)) {

    console.error(
      "QuizBallon: de uitgebreide vragenbank ontbreekt. " +
      "Controleer de volgorde van de scripts."
    );

    return;

  }


  /* ========================================
     ANTWOORD ZOEKEN
  ======================================== */

  function findExistingAnswer(question, name) {

    const target = normalize(name);

    return question.answers.find(
      function (answer) {

        const names = [
          answer.answer,
          ...(answer.aliases || [])
        ];

        return names.some(
          function (candidate) {

            return normalize(candidate) === target;

          }
        );

      }
    );

  }


  /* ========================================
     NIEUW ANTWOORD TOEVOEGEN
  ======================================== */

  function addAnswer(question, line) {

    const parts = line.split("|");

    const name = (parts[0] || "").trim();

    const points = safePoints(parts[1]);

    const aliases = parts
      .slice(2)
      .map(function (alias) {
        return alias.trim();
      })
      .filter(Boolean);

    if (!name) {
      return;
    }

    /*
     * Staat dit antwoord al in de lijst?
     *
     * Dan voegen we geen duplicaat toe.
     */

    const existing = findExistingAnswer(
      question,
      name
    );

    if (existing) {

      /*
       * Bestaande raketantwoorden
       * houden altijd hun 100 punten.
       */

      if (!existing.isRocket) {

        existing.points = points;

      }

      addAliases(question, existing, aliases);

      return;

    }

    /*
     * Nieuw antwoord.
     */

    const newAnswer = {

      answer: name,

      points: points,

      aliases: [],

      isRocket: false

    };

    question.answers.push(newAnswer);

    addAliases(
      question,
      newAnswer,
      aliases
    );

  }


  /* ========================================
     ALTERNATIEVE NAMEN TOEVOEGEN
  ======================================== */

  function addAliases(question, answer, aliases) {

    if (!Array.isArray(answer.aliases)) {
      answer.aliases = [];
    }

    aliases.forEach(function (alias) {

      const normalized = normalize(alias);

      if (!normalized) {
        return;
      }

      /*
       * Dezelfde naam niet opnieuw
       * toevoegen.
       */

      const alreadyExists =
        findExistingAnswer(
          question,
          alias
        );

      if (alreadyExists) {
        return;
      }

      answer.aliases.push(alias);

    });

  }


  /* ========================================
     VRAAGTEKST VERBETEREN

     Kruisingen tellen nu ook mee.
  ======================================== */

  function updateQuestionTexts() {

    const dogQuestion = questions[6];

    if (dogQuestion) {

      dogQuestion.question =
        "Noem een hondenras of een bekende hondenkruising.";

      dogQuestion.hint =
        "Ook bekende kruisingen zoals Labradoodle " +
        "en Goldador tellen mee. " +
        "Probeer een antwoord dat anderen " +
        "niet direct bedenken.";

    }

  }


  /* ========================================
     ALLE ANTWOORDEN TOEVOEGEN
  ======================================== */

  function expandAnswers() {

    let addedCount = 0;

    Object.keys(EXTRA_ANSWERS).forEach(
      function (indexString) {

        const index = Number(indexString);

        const question = questions[index];

        if (!question) {
          return;
        }

        const before = question.answers.length;

        EXTRA_ANSWERS[index].forEach(
          function (line) {

            addAnswer(question, line);

          }
        );

        addedCount +=
          question.answers.length - before;

      }
    );

    return addedCount;

  }


  /* ========================================
     ALTERNATIEVE NAMEN TOEPASSEN
  ======================================== */

  function applyExtraAliases() {

    Object.keys(EXTRA_ALIASES).forEach(
      function (indexString) {

        const index = Number(indexString);

        const question = questions[index];

        if (!question) {
          return;
        }

        const mappings =
          EXTRA_ALIASES[index];

        Object.keys(mappings).forEach(
          function (name) {

            const answer = findExistingAnswer(
              question,
              name
            );

            if (!answer) {
              return;
            }

            addAliases(
              question,
              answer,
              mappings[name]
            );

          }
        );

      }
    );

  }


  /* ========================================
     DAGELIJKSE STARTKNOPTEKST

     daily.js werkt de knop soms bij.
     Daarom zorgen we dat onze nieuwe
     tekst behouden blijft.
  ======================================== */

  function updateStartButtonText() {

    const button = document.getElementById(
      "start-button"
    );

    if (!button || button.disabled) {
      return;
    }

    const desiredText =
      "START DE DAGELIJKSE VLUCHT";

    const currentText =
      button.textContent.trim();

    if (currentText.includes(desiredText)) {
      return;
    }

    button.replaceChildren();

    const text = document.createElement("span");

    text.textContent = desiredText;

    const arrow = document.createElement("span");

    arrow.textContent = "↗";

    button.append(text, arrow);

  }


  /* ========================================
     STARTKNOP IN DE GATEN HOUDEN

     Zorgt ervoor dat de tekst ook
     goed blijft als daily.js de
     knop opnieuw opbouwt.
  ======================================== */

  function observeStartButton() {

    const button = document.getElementById(
      "start-button"
    );

    if (!button) {
      return;
    }

    const observer = new MutationObserver(
      function () {

        updateStartButtonText();

      }
    );

    observer.observe(button, {

      childList: true,

      subtree: true,

      characterData: true,

      attributes: true,

      attributeFilter: ["disabled"]

    });

    updateStartButtonText();

  }


  /* ========================================
     CONTROLE VAN DE VRAGENBANK
  ======================================== */

  function validateQuestionBank() {

    const report = questions.map(
      function (question, index) {

        const rocketCount =
          question.answers.filter(
            function (answer) {

              return answer.isRocket === true;

            }
          ).length;

        return {

          vraag: index + 1,

          antwoorden: question.answers.length,

          raketantwoorden: rocketCount

        };

      }
    );

    console.table(report);

  }


  /* ========================================
     INITIALISEREN
  ======================================== */

  function initializeAnswerExpansion() {

    updateQuestionTexts();

    const amountAdded = expandAnswers();

    applyExtraAliases();

    observeStartButton();

    validateQuestionBank();

    console.log(
      "🎈 QuizBallon: " +
      amountAdded +
      " extra antwoorden toegevoegd."
    );

    console.log(
      "🐕 Golden labrador wordt herkend als Goldador."
    );

  }


  initializeAnswerExpansion();

})();
