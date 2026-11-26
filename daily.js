/* =====================================================
   QUIZBALLON - DAILY CHALLENGE V5

   NIEUW:
   - ECHT ANDERE ONDERWERPEN DAN GISTEREN
   - TWEE AFWISSELENDE ONDERWERPGROEPEN
   - GEEN HERHALING TUSSEN OPEENVOLGENDE
     DAGEN ALS DE VRAGENBANK GROOT GENOEG IS
   - DUIDELIJKE CONTROLE IN DE CONSOLE

   BEHOUDEN:
   - 10 VRAGEN PER DAG
   - PRECIES 1 LETTERVRAAG
   - 9 GEWONE KENNISVRAGEN
   - MAXIMAAL 1 VRAAG PER ONDERWERP
   - MAXIMAAL 2 PER CATEGORIE INDIEN MOGELIJK
   - DEZELFDE SELECTIE VOOR ALLE SPELERS
   - NIEUWE UITDAGING OM 00.00 UUR
   - NEDERLANDSE TIJDZONE
   - DAGELIJKSE AFTELLER
   - 1 VOLTOOIDE UITDAGING PER DAG
   - ANTWOORDENOVERZICHT
   - BESTAANDE PUNTENSCORES
   - RAKETANTWOORDEN

   LET OP:
   DEZE CODE VERANDERT DE VRAGENSELECTIE.

   DE TIJD VAN 25 NAAR 20 SECONDEN
   MOET NOG IN DE HUIDIGE script.js
   WORDEN AANGEPAST.
===================================================== */

(function () {
  "use strict";


  /* ========================================
     INSTELLINGEN
  ======================================== */

  const TIME_ZONE = "Europe/Amsterdam";

  const QUESTIONS_PER_DAY = 10;

  const LETTER_QUESTIONS_PER_DAY = 1;

  const MAX_PER_CATEGORY = 2;

  const DAILY_STORAGE_KEY =
    "quizballon-daily-result-v1";

  const SELECTION_SALT =
    "quizballon-daily-v5-onderwerpen";

  const CLOCK_INTERVAL = 1000;

  /*
   * Voor twee volledig verschillende
   * dagen hebben we minstens
   * 20 onderwerpen nodig.
   */

  const MIN_TOPICS_FOR_GUARANTEE =
    QUESTIONS_PER_DAY * 2;


  /* ========================================
     HTML-ELEMENTEN
  ======================================== */

  function byId(id) {
    return document.getElementById(id);
  }

  const elements = {
    startScreen: byId("start-screen"),

    endScreen: byId("end-screen"),

    startButton: byId("start-button"),

    restartButton: byId("restart-button"),

    homeButton: byId("home-button"),

    quitButton: byId("quit-button"),

    dailyDate: byId("daily-date"),

    dailyDescription: byId("daily-description"),

    dailyStatus: byId("daily-status"),

    dailyCountdown: byId("daily-countdown"),

    dailyEndMessage: byId("daily-end-message"),

    endScore: byId("end-score"),

    endHeight: byId("end-height"),

    endCorrect: byId("end-correct")
  };


  /* ========================================
     SPELSTATUS
  ======================================== */

  let currentDay = "";

  let activeDay = null;

  let completedResult = null;

  let lastEndVisible = false;

  /*
   * Bewaar de volledige vragenbank.
   */

  const allQuestions =
    Array.isArray(
      window.QUIZBALLON_EXPANDED_QUESTIONS
    )
      ? [
          ...window.QUIZBALLON_EXPANDED_QUESTIONS
        ]
      : [];


  /* ========================================
     NEDERLANDSE DATUM
  ======================================== */

  function getDayKey(date = new Date()) {
    return new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: TIME_ZONE,

        year: "numeric",

        month: "2-digit",

        day: "2-digit"
      }
    ).format(date);
  }


  /* ========================================
     VORIGE DAG
  ======================================== */

  function previousDayKey(dayKey) {
    const date = new Date(
      dayKey + "T12:00:00Z"
    );

    date.setUTCDate(
      date.getUTCDate() - 1
    );

    return date
      .toISOString()
      .slice(0, 10);
  }


  /* ========================================
     DATUM OMZETTEN NAAR DAGNUMMER

     Dit dagnummer bepaalt welke
     onderwerpgroep vandaag speelt.

     Even dagnummer: groep A
     Oneven dagnummer: groep B
  ======================================== */

  function dayNumber(dayKey) {
    const parts = dayKey
      .split("-")
      .map(Number);

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return Math.floor(
      Date.UTC(
        year,
        month - 1,
        day
      ) / 86400000
    );
  }


  /* ========================================
     DATUM TONEN
  ======================================== */

  function getDisplayDate() {
    return new Intl.DateTimeFormat(
      "nl-NL",
      {
        timeZone: TIME_ZONE,

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"
      }
    ).format(new Date());
  }


  /* ========================================
     NEDERLANDSE KLOK
  ======================================== */

  function getClock() {
    const clock = {
      hour: 0,
      minute: 0,
      second: 0
    };

    const parts =
      new Intl.DateTimeFormat(
        "nl-NL",
        {
          timeZone: TIME_ZONE,

          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",

          hourCycle: "h23"
        }
      ).formatToParts(new Date());

    parts.forEach(function (part) {
      if (part.type in clock) {
        clock[part.type] =
          Number(part.value);
      }
    });

    return clock;
  }


  /* ========================================
     AFTELLER TOT 00.00 UUR
  ======================================== */

  function getCountdown() {
    const clock = getClock();

    const elapsed =
      clock.hour * 3600 +
      clock.minute * 60 +
      clock.second;

    let remaining =
      86400 - elapsed;

    const hours =
      Math.floor(remaining / 3600);

    remaining %= 3600;

    const minutes =
      Math.floor(remaining / 60);

    const seconds =
      remaining % 60;

    return [
      hours,
      minutes,
      seconds
    ]
      .map(function (value) {
        return String(value)
          .padStart(2, "0");
      })
      .join(":");
  }


  /* ========================================
     TEKST NORMALISEREN
  ======================================== */

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['’`]/g, "")
      .replace(/[-–—_]/g, " ")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* ========================================
     LETTERVRAGEN HERKENNEN

     De gegenereerde varianten
     bevatten "Extra eis:".
  ======================================== */

  function isLetterQuestion(question) {
    return String(
      question.question || ""
    )
      .toLowerCase()
      .includes("extra eis:");
  }


  /* ========================================
     BASISVRAAG HERKENNEN
  ======================================== */

  function getBaseText(question) {
    let text = String(
      question.question || ""
    );

    const position = text
      .toLowerCase()
      .indexOf("extra eis:");

    if (position !== -1) {
      text = text.slice(
        0,
        position
      );
    }

    return normalize(text);
  }


  /* ========================================
     ONDERWERP BEPALEN

     We behouden de onderwerpregels
     van Daily Challenge V4.

     Daarnaast ondersteunen we
     expliciete topicId's.

     Dat is handig als we later
     een grotere vragenbank maken.
  ======================================== */

  function getTopic(question) {

    /*
     * Een expliciet topicId is
     * het betrouwbaarst.
     */

    if (question.topicId != null) {
      return normalize(question.topicId);
    }

    if (question.baseQuestionId != null) {
      return normalize(
        question.baseQuestionId
      );
    }

    const text = getBaseText(question);

    if (
      text.includes("japan") &&
      /stad|steden/.test(text)
    ) {
      return "japanse-steden";
    }

    if (
      text.includes("hondenras") ||
      text.includes("hondenkruising")
    ) {
      return "honden";
    }

    if (
      text.includes("hoofdstad")
    ) {
      return "hoofdsteden";
    }

    if (
      text.includes("muziekinstrument")
    ) {
      return "muziekinstrumenten";
    }

    if (
      text.includes("vogelsoort") ||
      text.includes("vogel die")
    ) {
      return "vogels";
    }

    if (
      text.includes("maan") &&
      text.includes("zonnestelsel")
    ) {
      return "manen";
    }

    if (
      text.includes("voetbalclub")
    ) {
      return "voetbalclubs";
    }

    if (
      text.includes("sterrenbeeld")
    ) {
      return "sterrenbeelden";
    }

    if (
      text.includes("scheikundig element")
    ) {
      return "scheikundige-elementen";
    }

    if (
      text.includes("zoogdier")
    ) {
      return "zoogdieren";
    }

    if (
      text.includes("kaassoort")
    ) {
      return "kazen";
    }

    if (
      text.includes("groente")
    ) {
      return "groenten";
    }

    if (
      text.includes("boomsoort")
    ) {
      return "bomen";
    }

    if (
      text.includes("muziekgenre")
    ) {
      return "muziekgenres";
    }

    if (
      text.includes("grieks eiland")
    ) {
      return "griekse-eilanden";
    }

    return text;
  }


  /* ========================================
     HOOFDCATEGORIE BEPALEN
  ======================================== */

  function getCategory(question) {
    const category = normalize(
      question.category
    );

    const topic = getTopic(question);

    if (
      category.includes("aardrijkskunde") ||
      category.includes("wereld") ||
      /land|stad|steden|hoofdstad|eiland|taal/.test(
        topic
      )
    ) {
      return "aardrijkskunde";
    }

    if (
      category.includes("dier") ||
      category.includes("natuur") ||
      /vogel|honden|zoogdier|zeedier|bomen/.test(
        topic
      )
    ) {
      return "natuur";
    }

    if (
      category.includes("eten") ||
      category.includes("fruit")
    ) {
      return "eten";
    }

    if (
      category.includes("sport")
    ) {
      return "sport";
    }

    if (
      category.includes("muziek")
    ) {
      return "muziek";
    }

    if (
      category.includes("geschiedenis")
    ) {
      return "geschiedenis";
    }

    if (
      category.includes("ruimte") ||
      category.includes("wetenschap")
    ) {
      return "ruimte-en-wetenschap";
    }

    return category || "overig";
  }


  /* ========================================
     VASTE SEED

     Alle spelers gebruiken dezelfde
     berekening bij dezelfde datum
     en dezelfde vragenbank.
  ======================================== */

  function seedFromString(value) {
    let hash = 2166136261;

    for (
      let i = 0;
      i < value.length;
      i++
    ) {
      hash ^= value.charCodeAt(i);

      hash = Math.imul(
        hash,
        16777619
      );
    }

    return hash >>> 0;
  }


  /* ========================================
     VASTE RANDOMFUNCTIE
  ======================================== */

  function seededRandom(seed) {
    let state = seed >>> 0;

    return function () {
      state += 0x6D2B79F5;

      let value = state;

      value = Math.imul(
        value ^ (value >>> 15),
        value | 1
      );

      value ^= value + Math.imul(
        value ^ (value >>> 7),
        value | 61
      );

      return (
        ((value ^ (value >>> 14)) >>> 0) /
        4294967296
      );
    };
  }


  /* ========================================
     VAST SCHUDDEN
  ======================================== */

  function shuffle(items, seed) {
    const result = [...items];

    const random =
      seededRandom(seed);

    for (
      let i = result.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        random() * (i + 1)
      );

      [
        result[i],
        result[j]
      ] = [
        result[j],
        result[i]
      ];
    }

    return result;
  }


  /* ========================================
     VRAGEN GROEPEREN PER ONDERWERP
  ======================================== */

  function createTopicGroups() {
    const groups = new Map();

    allQuestions.forEach(
      function (question) {
        const topic = getTopic(question);

        if (!topic) {
          return;
        }

        if (!groups.has(topic)) {
          groups.set(topic, {
            topic: topic,

            regular: [],
            letter: [],

            category: getCategory(question)
          });
        }

        const group =
          groups.get(topic);

        if (isLetterQuestion(question)) {
          group.letter.push(question);
        } else {
          group.regular.push(question);
        }
      }
    );

    /*
     * Een onderwerp zonder gewone
     * vraag kan niet in de Daily
     * worden gebruikt.
     */

    return [...groups.values()].filter(
      function (group) {
        return group.regular.length > 0;
      }
    );
  }


  const topicGroups =
    createTopicGroups();


  /* ========================================
     ONDERWERPEN STABIEL SORTEREN

     We gebruiken een vaste hash
     zodat de bronvolgorde niet
     bepaalt welk onderwerp eerst komt.
  ======================================== */

  function stableTopicSort(groups) {
    return [...groups].sort(
      function (a, b) {
        const hashA = seedFromString(
          SELECTION_SALT +
          "|groep|" +
          a.topic
        );

        const hashB = seedFromString(
          SELECTION_SALT +
          "|groep|" +
          b.topic
        );

        if (hashA !== hashB) {
          return hashA - hashB;
        }

        return a.topic.localeCompare(
          b.topic
        );
      }
    );
  }


  /* ========================================
     TWEE AFWISSELENDE GROEPEN MAKEN

     Dit is de belangrijkste wijziging.

     We verdelen de onderwerpen
     één keer op een vaste manier
     over groep A en groep B.

     Voorbeeld:

     GROEP A:
     - honden
     - sterrenbeelden
     - groenten
     - muziekgenres
     - enzovoort

     GROEP B:
     - zoogdieren
     - hoofdsteden
     - bomen
     - voetbalclubs
     - enzovoort

     Vandaag gebruiken we A.
     Morgen gebruiken we B.

     Daardoor kunnen onderwerpen
     niet op opeenvolgende dagen
     terugkomen.

     Wel moet iedere groep minstens
     10 onderwerpen bevatten.
  ======================================== */

  function createAlternatingPools() {

    const ordered =
      stableTopicSort(topicGroups);

    const poolA = [];
    const poolB = [];

    /*
     * Bewaar het aantal onderwerpen
     * per categorie in iedere groep.
     */

    const categoryA = new Map();
    const categoryB = new Map();

    function categoryCount(map, category) {
      return map.get(category) || 0;
    }

    function addToPool(group, pool, counts) {
      pool.push(group);

      counts.set(
        group.category,
        categoryCount(
          counts,
          group.category
        ) + 1
      );
    }

    /*
     * Zoek onderwerpen met
     * beschikbare lettervarianten.
     *
     * Iedere groep moet minstens
     * één onderwerp met een
     * lettervariant krijgen.
     */

    const letterTopics = ordered.filter(
      function (group) {
        return group.letter.length > 0;
      }
    );

    if (letterTopics.length >= 2) {
      addToPool(
        letterTopics[0],
        poolA,
        categoryA
      );

      addToPool(
        letterTopics[1],
        poolB,
        categoryB
      );
    }

    const alreadyAdded = new Set(
      [
        ...poolA,
        ...poolB
      ].map(function (group) {
        return group.topic;
      })
    );

    const remaining = ordered.filter(
      function (group) {
        return !alreadyAdded.has(
          group.topic
        );
      }
    );

    /*
     * Sorteer categorieën met veel
     * onderwerpen eerst.

     * Zo kunnen we brede categorieën
     * beter verdelen over A en B.
     */

    const categoryTotals = new Map();

    remaining.forEach(
      function (group) {
        categoryTotals.set(
          group.category,
          (categoryTotals.get(
            group.category
          ) || 0) + 1
        );
      }
    );

    remaining.sort(
      function (a, b) {
        const totalA =
          categoryTotals.get(
            a.category
          ) || 0;

        const totalB =
          categoryTotals.get(
            b.category
          ) || 0;

        if (totalA !== totalB) {
          return totalB - totalA;
        }

        return seedFromString(
          a.topic
        ) - seedFromString(
          b.topic
        );
      }
    );

    /*
     * Plaats iedere overige groep
     * bij voorkeur in de groep met
     * minder onderwerpen uit
     * dezelfde categorie.

     * Houd ook beide groepsgroottes
     * zoveel mogelijk gelijk.
     */

    remaining.forEach(
      function (group) {
        const countA = categoryCount(
          categoryA,
          group.category
        );

        const countB = categoryCount(
          categoryB,
          group.category
        );

        /*
         * Voorkom dat één groep
         * veel groter wordt.
         */

        if (
          poolA.length >
          poolB.length + 1
        ) {
          addToPool(
            group,
            poolB,
            categoryB
          );

          return;
        }

        if (
          poolB.length >
          poolA.length + 1
        ) {
          addToPool(
            group,
            poolA,
            categoryA
          );

          return;
        }

        /*
         * Verdeel categorieën.
         */

        if (countA < countB) {
          addToPool(
            group,
            poolA,
            categoryA
          );

        } else if (countB < countA) {
          addToPool(
            group,
            poolB,
            categoryB
          );

        } else if (
          poolA.length <= poolB.length
        ) {
          addToPool(
            group,
            poolA,
            categoryA
          );

        } else {
          addToPool(
            group,
            poolB,
            categoryB
          );
        }
      }
    );

    return {
      A: poolA,
      B: poolB
    };
  }


  const alternatingPools =
    createAlternatingPools();


  /* ========================================
     CONTROLEREN OF DE GARANTIE
     MOGELIJK IS

     Voor 10 onderwerpen vandaag
     én 10 andere onderwerpen morgen
     hebben we minstens 20 nodig.

     Iedere groep moet ook minstens
     één onderwerp met een
     lettervariant bevatten.
  ======================================== */

  function canGuaranteeUniqueTopics() {

    if (
      topicGroups.length <
      MIN_TOPICS_FOR_GUARANTEE
    ) {
      return false;
    }

    if (
      alternatingPools.A.length <
      QUESTIONS_PER_DAY
    ) {
      return false;
    }

    if (
      alternatingPools.B.length <
      QUESTIONS_PER_DAY
    ) {
      return false;
    }

    const letterA =
      alternatingPools.A.some(
        function (group) {
          return group.letter.length > 0;
        }
      );

    const letterB =
      alternatingPools.B.some(
        function (group) {
          return group.letter.length > 0;
        }
      );

    return letterA && letterB;
  }


  const uniqueTopicsGuaranteed =
    canGuaranteeUniqueTopics();


  /* ========================================
     EEN GEWONE VRAAG KIEZEN
  ======================================== */

  function chooseRegularQuestion(
    group,
    dayKey
  ) {
    if (
      !group ||
      group.regular.length === 0
    ) {
      return null;
    }

    const seed = seedFromString(
      SELECTION_SALT +
      "|" +
      dayKey +
      "|" +
      group.topic +
      "|gewoon"
    );

    return shuffle(
      group.regular,
      seed
    )[0];
  }


  /* ========================================
     EEN LETTERVRAAG KIEZEN
  ======================================== */

  function chooseLetterQuestion(
    group,
    dayKey
  ) {
    if (
      !group ||
      group.letter.length === 0
    ) {
      return null;
    }

    const seed = seedFromString(
      SELECTION_SALT +
      "|" +
      dayKey +
      "|" +
      group.topic +
      "|letters"
    );

    return shuffle(
      group.letter,
      seed
    )[0];
  }


  /* ========================================
     UIT EEN GROEP 10 ONDERWERPEN
     SELECTEREN

     We selecteren eerst precies
     één onderwerp met een
     lettervariant.

     Daarna vullen we de andere
     negen plekken met gewone
     onderwerpen.

     We proberen maximaal twee
     onderwerpen uit dezelfde
     categorie te kiezen.
  ======================================== */

  function selectTenTopics(
    availableGroups,
    dayKey
  ) {

    if (
      availableGroups.length <
      QUESTIONS_PER_DAY
    ) {
      return [];
    }

    const shuffled = shuffle(
      availableGroups,
      seedFromString(
        SELECTION_SALT +
        "|selecteer|" +
        dayKey
      )
    );

    const letterCandidates =
      shuffled.filter(
        function (group) {
          return group.letter.length > 0;
        }
      );

    /*
     * Zonder letterkandidaat is
     * precies één lettervraag
     * niet mogelijk.
     */

    if (
      letterCandidates.length === 0
    ) {
      return [];
    }

    /*
     * Probeer verschillende
     * letteronderwerpen.

     * Neem de combinatie die
     * de beste categorieafwisseling
     * oplevert.
     */

    let bestSelection = null;

    let bestPenalty = Infinity;

    for (
      const letterGroup of letterCandidates
    ) {

      const selected = [letterGroup];

      const selectedTopics = new Set([
        letterGroup.topic
      ]);

      const counts = new Map();

      counts.set(
        letterGroup.category,
        1
      );

      /*
       * Vul de overige negen
       * plekken aan.
       */

      function addGroups(
        enforceCategoryLimit
      ) {

        for (const group of shuffled) {

          if (
            selected.length >=
            QUESTIONS_PER_DAY
          ) {
            break;
          }

          if (
            selectedTopics.has(
              group.topic
            )
          ) {
            continue;
          }

          const count =
            counts.get(
              group.category
            ) || 0;

          if (
            enforceCategoryLimit &&
            count >= MAX_PER_CATEGORY
          ) {
            continue;
          }

          selected.push(group);

          selectedTopics.add(
            group.topic
          );

          counts.set(
            group.category,
            count + 1
          );
        }
      }

      /*
       * Eerst maximaal twee
       * per categorie.
       */

      addGroups(true);

      /*
       * Alleen indien nodig
       * categoriegrens versoepelen.
       */

      if (
        selected.length <
        QUESTIONS_PER_DAY
      ) {
        addGroups(false);
      }

      if (
        selected.length !==
        QUESTIONS_PER_DAY
      ) {
        continue;
      }

      /*
       * Strafpunten wanneer een
       * categorie vaker dan twee
       * keer voorkomt.
       */

      let penalty = 0;

      counts.forEach(
        function (count) {
          penalty += Math.max(
            0,
            count - MAX_PER_CATEGORY
          );
        }
      );

      if (
        penalty < bestPenalty
      ) {
        bestPenalty = penalty;

        bestSelection = selected;
      }

      /*
       * Perfecte categorieafwisseling
       * gevonden.
       */

      if (penalty === 0) {
        break;
      }
    }

    return bestSelection || [];
  }


  /* ========================================
     DE DAGELIJKSE ONDERWERPGROEP

     Op even dagen: A.
     Op oneven dagen: B.

     Ook als we later meer
     onderwerpen toevoegen, blijft
     de selectie dagelijks wisselen.
  ======================================== */

  function getPoolForDay(dayKey) {
    const number =
      dayNumber(dayKey);

    return number % 2 === 0
      ? alternatingPools.A
      : alternatingPools.B;
  }


  /* ========================================
     SELECTIE VOOR EEN DAG MAKEN

     1. Kies de onderwerpgroep.
     2. Kies tien onderwerpen.
     3. Gebruik één lettervariant.
     4. Gebruik negen gewone vragen.
     5. Schud de volgorde met
        een vaste dagelijkse seed.
  ======================================== */

  function makeDailySelection(dayKey) {

    let selectedGroups = [];

    if (uniqueTopicsGuaranteed) {

      /*
       * Gegarandeerd gescheiden
       * groepen voor opeenvolgende
       * kalenderdagen.
       */

      selectedGroups =
        selectTenTopics(
          getPoolForDay(dayKey),
          dayKey
        );

    } else {

      /*
       * Als de vragenbank te klein
       * is, gebruiken we alle
       * beschikbare onderwerpen.

       * We proberen nog steeds
       * elke dag een nieuwe selectie
       * te maken.
       */

      selectedGroups =
        selectTenTopics(
          topicGroups,
          dayKey
        );

    }

    if (
      selectedGroups.length !==
      QUESTIONS_PER_DAY
    ) {
      return [];
    }

    /*
     * Kies één letteronderwerp
     * uit de geselecteerde groepen.
     */

    const letterCandidates =
      selectedGroups.filter(
        function (group) {
          return group.letter.length > 0;
        }
      );

    if (
      letterCandidates.length === 0
    ) {
      return [];
    }

    const chosenLetterGroup = shuffle(
      letterCandidates,
      seedFromString(
        SELECTION_SALT +
        "|letteronderwerp|" +
        dayKey
      )
    )[0];

    /*
     * Maak de uiteindelijke
     * tien vragen.
     */

    const result = selectedGroups.map(
      function (group) {

        const isLetter =
          group.topic ===
          chosenLetterGroup.topic;

        const question = isLetter
          ? chooseLetterQuestion(
              group,
              dayKey
            )
          : chooseRegularQuestion(
              group,
              dayKey
            );

        return {
          topic: group.topic,

          category: group.category,

          letter: isLetter,

          question: question
        };
      }
    );

    /*
     * Vaste volgorde voor
     * dezelfde datum.
     */

    return shuffle(
      result,
      seedFromString(
        SELECTION_SALT +
        "|volgorde|" +
        dayKey
      )
    );
  }


  /* ========================================
     GISTEREN VERMIJDEN WANNEER
     DE GARANTIE NIET MOGELIJK IS

     Met minder dan 20 onderwerpen
     is volledige afwisseling
     onmogelijk.

     In dat geval proberen we
     toch zo veel mogelijk
     andere onderwerpen te tonen.
  ======================================== */

  function makeFallbackSelection(dayKey) {

    const yesterday =
      previousDayKey(dayKey);

    const yesterdaySelection =
      makeDailySelection(yesterday);

    const usedYesterday = new Set(
      yesterdaySelection.map(
        function (item) {
          return item.topic;
        }
      )
    );

    const unused = topicGroups.filter(
      function (group) {
        return !usedYesterday.has(
          group.topic
        );
      }
    );

    const repeated = topicGroups.filter(
      function (group) {
        return usedYesterday.has(
          group.topic
        );
      }
    );

    /*
     * Nieuwe onderwerpen staan
     * vooraan.

     * Omdat er mogelijk minder
     * dan 10 zijn, moeten we soms
     * onderwerpen herhalen.
     */

    const ordered = [
      ...shuffle(
        unused,
        seedFromString(
          SELECTION_SALT +
          "|nieuw|" +
          dayKey
        )
      ),

      ...shuffle(
        repeated,
        seedFromString(
          SELECTION_SALT +
          "|herhaling|" +
          dayKey
        )
      )
    ];

    /*
     * Kies eerst één onderwerp
     * dat een lettervariant heeft.

     * Geef een nieuw onderwerp
     * daarbij voorrang.
     */

    const letterGroup =
      ordered.find(
        function (group) {
          return (
            !usedYesterday.has(
              group.topic
            ) &&
            group.letter.length > 0
          );
        }
      ) ||
      ordered.find(
        function (group) {
          return group.letter.length > 0;
        }
      );

    if (!letterGroup) {
      return [];
    }

    const selected = [
      letterGroup
    ];

    const selectedTopics = new Set([
      letterGroup.topic
    ]);

    const counts = new Map();

    counts.set(
      letterGroup.category,
      1
    );

    /*
     * Eerst nieuwe onderwerpen
     * met categoriebeperking.
     *
     * Daarna vullen we aan
     * indien dat nodig is.
     */

    function addFrom(
      items,
      enforceCategoryLimit
    ) {

      for (const group of items) {

        if (
          selected.length >=
          QUESTIONS_PER_DAY
        ) {
          break;
        }

        if (
          selectedTopics.has(
            group.topic
          )
        ) {
          continue;
        }

        const count =
          counts.get(
            group.category
          ) || 0;

        if (
          enforceCategoryLimit &&
          count >= MAX_PER_CATEGORY
        ) {
          continue;
        }

        selected.push(group);

        selectedTopics.add(
          group.topic
        );

        counts.set(
          group.category,
          count + 1
        );
      }
    }

    addFrom(unused, true);
    addFrom(unused, false);

    addFrom(repeated, true);
    addFrom(repeated, false);

    if (
      selected.length !==
      QUESTIONS_PER_DAY
    ) {
      return [];
    }

    const result = selected.map(
      function (group) {

        const letter =
          group.topic ===
          letterGroup.topic;

        return {
          topic: group.topic,

          category: group.category,

          letter: letter,

          question: letter
            ? chooseLetterQuestion(
                group,
                dayKey
              )
            : chooseRegularQuestion(
                group,
                dayKey
              )
        };
      }
    );

    return shuffle(
      result,
      seedFromString(
        SELECTION_SALT +
        "|fallbackvolgorde|" +
        dayKey
      )
    );
  }


  /* ========================================
     VRAGEN VAN VANDAAG KIEZEN
  ======================================== */

  function chooseDailyQuestions(dayKey) {

    let selection;

    if (uniqueTopicsGuaranteed) {
      selection =
        makeDailySelection(dayKey);

    } else {
      selection =
        makeFallbackSelection(dayKey);
    }

    return selection.map(
      function (item) {
        return item.question;
      }
    );
  }


  /* ========================================
     ONDERWERPEN VAN ÉÉN DAG TONEN

     Handig om de selectie te
     controleren in de console.
  ======================================== */

  function getTopicsForDay(dayKey) {
    return chooseDailyQuestions(
      dayKey
    ).map(getTopic);
  }


  /* ========================================
     TWEE DAGEN VERGELIJKEN

     Hiermee controleren we hoeveel
     onderwerpen beide dagen delen.
  ======================================== */

  function compareDays(
    firstDay,
    secondDay
  ) {

    const firstTopics = new Set(
      getTopicsForDay(firstDay)
    );

    const secondTopics = new Set(
      getTopicsForDay(secondDay)
    );

    return [...firstTopics].filter(
      function (topic) {
        return secondTopics.has(
          topic
        );
      }
    );
  }


  /* ========================================
     CONTROLE VAN VANDAAG EN MORGEN
  ======================================== */

  function nextDayKey(dayKey) {

    const date = new Date(
      dayKey + "T12:00:00Z"
    );

    date.setUTCDate(
      date.getUTCDate() + 1
    );

    return date
      .toISOString()
      .slice(0, 10);
  }


  function validateUpcomingDays() {

    const tomorrow =
      nextDayKey(currentDay);

    const todayTopics =
      getTopicsForDay(currentDay);

    const tomorrowTopics =
      getTopicsForDay(tomorrow);

    const overlap =
      compareDays(
        currentDay,
        tomorrow
      );

    console.log(
      "📅 Onderwerpen vandaag:",
      todayTopics
    );

    console.log(
      "📅 Onderwerpen morgen:",
      tomorrowTopics
    );

    if (
      overlap.length === 0 &&
      todayTopics.length === 10 &&
      tomorrowTopics.length === 10
    ) {

      console.log(
        "✅ Morgen zijn alle 10 " +
        "onderwerpen anders dan vandaag!"
      );

    } else {

      console.warn(
        "⚠️ Onderwerpen die terugkomen:",
        overlap
      );

    }

  }


  /* ========================================
     DAGRESULTAAT LADEN
  ======================================== */

  function loadResult() {

    try {

      const saved = localStorage.getItem(
        DAILY_STORAGE_KEY
      );

      if (!saved) {
        return null;
      }

      const result =
        JSON.parse(saved);

      if (
        !result ||
        result.date !== currentDay ||
        typeof result.score !== "number" ||
        typeof result.height !== "string"
      ) {
        return null;
      }

      return result;

    } catch (error) {
      return null;
    }

  }


  /* ========================================
     DAGRESULTAAT OPSLAAN
  ======================================== */

  function saveResult(result) {

    completedResult = result;

    try {

      localStorage.setItem(
        DAILY_STORAGE_KEY,
        JSON.stringify(result)
      );

    } catch (error) {

      console.warn(
        "QuizBallon: resultaat kon " +
        "niet worden opgeslagen."
      );

    }

  }


  /* ========================================
     VOLTOOID?
  ======================================== */

  function isCompleted() {

    return Boolean(
      completedResult &&
      completedResult.date === currentDay
    );

  }


  /* ========================================
     DAGELIJKSE KAART STYLING

     Behouden uit V4.
  ======================================== */

  function addDailyStyles() {

    if (
      byId("quizballon-daily-styles")
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "quizballon-daily-styles";

    style.textContent = `

      .daily-card {
        width: min(100%, 560px);
        margin: 0 0 30px;
        padding: 23px;

        border: 1px solid rgba(255,255,255,.9);
        border-radius: 20px;

        background: rgba(255,255,255,.87);

        box-shadow:
          0 16px 40px rgba(36,82,143,.10);

        backdrop-filter: blur(15px);
      }

      .daily-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 15px;
      }

      .daily-label {
        color: #477dff;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .12em;
      }

      .daily-status {
        display: inline-block;
        padding: 8px 11px;
        border-radius: 100px;

        background: #e6f8ee;
        color: #209a5c;

        font-size: 10px;
        font-weight: 900;
      }

      .daily-status.completed {
        background: #edf0ff;
        color: #5559c9;
      }

      .daily-card h2 {
        margin: 0 0 10px;
        color: #17213d;

        font-family:
          'Outfit', Arial, sans-serif;

        font-size: clamp(23px, 4vw, 29px);
        font-weight: 900;
        line-height: 1.2;
      }

      .daily-card p {
        margin: 0;
        color: #64728d;
        font-size: 13px;
        line-height: 1.7;
      }

      .daily-countdown-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;

        margin-top: 20px;
        padding-top: 18px;

        border-top:
          1px solid rgba(32,53,99,.1);
      }

      .daily-countdown-row span {
        color: #62728f;
        font-size: 12px;
        font-weight: 700;
      }

      .daily-countdown-row strong {
        color: #315ce0;

        font-family:
          'Outfit', Arial, sans-serif;

        font-size: 19px;
        font-weight: 900;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .daily-end-message {
        margin: 0 0 20px;
        padding: 16px;

        border: 1px solid #d7e3ff;
        border-radius: 13px;

        background: #eef4ff;
        color: #3157a9;

        font-size: 13px;
        font-weight: 800;
        line-height: 1.65;
      }

      .start-button:disabled,
      .restart-button:disabled {
        opacity: .7;
        cursor: not-allowed;
        background: #667ca5;
        box-shadow: none;
      }

      @media (max-width: 760px) {

        .daily-card {
          padding: 20px;
        }

      }

      @media (max-width: 480px) {

        .daily-countdown-row {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }

      }

    `;

    document.head.appendChild(style);

  }


  /* ========================================
     KNOPTEKST INSTELLEN
  ======================================== */

  function setButton(button, label) {

    if (!button) {
      return;
    }

    const text =
      document.createElement("span");

    text.textContent = label;

    const arrow =
      document.createElement("span");

    arrow.textContent = "↗";

    button.replaceChildren(
      text,
      arrow
    );

  }


  /* ========================================
     STARTSCHERM BIJWERKEN
  ======================================== */

  function updateHome() {

    if (elements.dailyDate) {
      elements.dailyDate.textContent =
        getDisplayDate();
    }

    if (elements.dailyCountdown) {
      elements.dailyCountdown.textContent =
        getCountdown();
    }

    if (isCompleted()) {

      if (elements.dailyStatus) {

        elements.dailyStatus.textContent =
          "VOLTOOID ✓";

        elements.dailyStatus.classList.add(
          "completed"
        );

      }

      if (elements.dailyDescription) {

        elements.dailyDescription.textContent =
          "Je hebt de uitdaging voltooid! " +
          "Je behaalde " +
          completedResult.score +
          " punten en bereikte " +
          completedResult.height +
          ". Morgen kun je opnieuw vliegen.";

      }

      elements.startButton.disabled = true;

      setButton(
        elements.startButton,
        "MORGEN WEER VLIEGEN"
      );

      if (elements.restartButton) {

        elements.restartButton.disabled = true;

        setButton(
          elements.restartButton,
          "MORGEN WEER SPELEN"
        );

      }

    } else {

      if (elements.dailyStatus) {

        elements.dailyStatus.textContent =
          "BESCHIKBAAR";

        elements.dailyStatus.classList.remove(
          "completed"
        );

      }

      if (elements.dailyDescription) {

        elements.dailyDescription.textContent =
          "De 10 vragen van vandaag staan klaar. " +
          "Je krijgt 9 gewone kennisvragen " +
          "en 1 vraag met een extra uitdaging.";

      }

      elements.startButton.disabled = false;

      setButton(
        elements.startButton,
        "START DE DAGELIJKSE VLUCHT"
      );

      if (elements.restartButton) {

        elements.restartButton.disabled = false;

        setButton(
          elements.restartButton,
          "OPNIEUW VLIEGEN"
        );

      }

    }

  }


  /* ========================================
     EINDSCHERM BIJWERKEN
  ======================================== */

  function updateEnd() {

    if (!isCompleted()) {
      return;
    }

    if (elements.dailyEndMessage) {

      elements.dailyEndMessage.textContent =
        "📅 Dagelijkse uitdaging voltooid! " +
        "Morgen om 00.00 uur Nederlandse tijd " +
        "verschijnen nieuwe vragen.";

    }

    if (elements.restartButton) {

      elements.restartButton.disabled = true;

      setButton(
        elements.restartButton,
        "MORGEN WEER SPELEN"
      );

    }

  }


  /* ========================================
     DAGSELECTIE INSTELLEN
  ======================================== */

  function applySelection() {

    const selected =
      chooseDailyQuestions(
        currentDay
      );

    if (
      selected.length !==
      QUESTIONS_PER_DAY
    ) {

      console.error(
        "QuizBallon: onvoldoende " +
        "verschillende onderwerpen."
      );

      elements.startButton.disabled = true;

      return false;

    }

    /*
     * Controleer dat de onderwerpen
     * binnen de dag uniek zijn.
     */

    const topics =
      selected.map(getTopic);

    const uniqueTopics =
      new Set(topics);

    if (
      uniqueTopics.size !==
      QUESTIONS_PER_DAY
    ) {

      console.error(
        "QuizBallon: een onderwerp " +
        "komt dubbel voor."
      );

      elements.startButton.disabled = true;

      return false;

    }

    /*
     * Controleer de lettervragen.
     */

    const letterCount =
      selected.filter(
        isLetterQuestion
      ).length;

    if (
      letterCount !==
      LETTER_QUESTIONS_PER_DAY
    ) {

      console.error(
        "QuizBallon: verwacht precies " +
        "1 lettervraag, gevonden:",
        letterCount
      );

      elements.startButton.disabled = true;

      return false;

    }

    /*
     * Geef de spelcode alleen
     * de tien vragen van vandaag.
     */

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      selected;

    window.QUIZBALLON_DAILY_INFO = {

      date: currentDay,

      questionCount:
        selected.length,

      letterQuestionCount:
        letterCount,

      uniqueTopics:
        uniqueTopics.size,

      differentFromYesterday:
        uniqueTopicsGuaranteed,

      questions:
        selected.map(
          function (question) {
            return question.question;
          }
        ),

      topics:
        topics

    };

    console.log(
      "📅 QuizBallon Daily Challenge:",
      currentDay
    );

    console.log(
      "📚 Totale vragenbank:",
      allQuestions.length
    );

    console.log(
      "🧠 Verschillende onderwerpen:",
      topicGroups.length
    );

    console.log(
      "🔤 Lettervragen vandaag:",
      letterCount
    );

    console.log(
      "🎈 Groep A:",
      alternatingPools.A.length,
      "onderwerpen"
    );

    console.log(
      "🎈 Groep B:",
      alternatingPools.B.length,
      "onderwerpen"
    );

    if (uniqueTopicsGuaranteed) {

      console.log(
        "✅ Afwisselende onderwerpgroepen " +
        "zijn beschikbaar."
      );

    } else {

      console.warn(
        "⚠️ De vragenbank heeft " +
        "nog niet genoeg geschikte " +
        "onderwerpen om volledige " +
        "dagelijkse afwisseling " +
        "te garanderen."
      );

    }

    console.table(
      selected.map(
        function (question, index) {

          return {
            nummer: index + 1,

            categorie:
              getCategory(question),

            onderwerp:
              getTopic(question),

            lettervraag:
              isLetterQuestion(question),

            vraag:
              question.question
          };

        }
      )
    );

    /*
     * Controleer welke onderwerpen
     * morgen geselecteerd worden.
     */

    validateUpcomingDays();

    return true;

  }


  /* ========================================
     SPELSTART REGISTREREN
  ======================================== */

  function registerStart() {

    if (isCompleted()) {
      return;
    }

    activeDay = currentDay;

    lastEndVisible = false;

  }


  /* ========================================
     VOLTOOIING REGISTREREN
  ======================================== */

  function checkEndScreen() {

    const visible =
      elements.endScreen.classList.contains(
        "active"
      );

    if (!visible) {

      lastEndVisible = false;

      return;

    }

    if (lastEndVisible) {
      return;
    }

    lastEndVisible = true;

    if (
      !activeDay ||
      activeDay !== currentDay ||
      isCompleted()
    ) {
      return;
    }

    const score = Number(
      elements.endScore.textContent.replace(
        /[^\d]/g,
        ""
      )
    );

    if (!Number.isFinite(score)) {
      return;
    }

    const result = {

      date: currentDay,

      score: score,

      height:
        elements.endHeight.textContent.trim(),

      correct:
        elements.endCorrect.textContent.trim(),

      completedAt:
        new Date().toISOString()

    };

    saveResult(result);

    activeDay = null;

    updateHome();

    updateEnd();

    console.log(
      "🏆 Daily Challenge voltooid:",
      result
    );

  }


  /* ========================================
     NIEUWE DAG HERKENNEN
  ======================================== */

  function checkClock() {

    if (
      getDayKey() !== currentDay
    ) {

      window.location.reload();

      return;

    }

    if (
      elements.dailyCountdown
    ) {

      elements.dailyCountdown.textContent =
        getCountdown();

    }

  }


  /* ========================================
     INITIALISEREN
  ======================================== */

  function initialize() {

    if (
      !elements.startButton ||
      !elements.endScreen ||
      !elements.endScore
    ) {

      console.error(
        "QuizBallon: vereiste HTML ontbreekt."
      );

      return;

    }

    if (
      allQuestions.length <
      QUESTIONS_PER_DAY
    ) {

      console.error(
        "QuizBallon: te weinig vragen."
      );

      elements.startButton.disabled = true;

      return;

    }

    currentDay = getDayKey();

    completedResult =
      loadResult();

    addDailyStyles();

    if (!applySelection()) {
      return;
    }

    updateHome();

    updateEnd();

    /*
     * STARTKNOP
     */

    elements.startButton.addEventListener(
      "click",
      registerStart,
      true
    );

    /*
     * OPNIEUW SPELEN
     */

    if (elements.restartButton) {

      elements.restartButton.addEventListener(
        "click",
        registerStart,
        true
      );

    }

    /*
     * TERUG NAAR BEGIN
     */

    if (elements.homeButton) {

      elements.homeButton.addEventListener(
        "click",
        updateHome
      );

    }

    /*
     * STOPPEN MET SPELEN
     */

    if (elements.quitButton) {

      elements.quitButton.addEventListener(
        "click",
        function () {

          setTimeout(
            function () {

              if (
                elements.startScreen.classList.contains(
                  "active"
                )
              ) {

                activeDay = null;

                updateHome();

              }

            },
            0
          );

        }
      );

    }

    /*
     * EINDSCHERM OBSERVEREN
     */

    const observer =
      new MutationObserver(
        checkEndScreen
      );

    observer.observe(
      elements.endScreen,
      {
        attributes: true,

        attributeFilter: [
          "class"
        ]
      }
    );

    /*
     * CONTROLE BIJ TERUGKEREN
     * NAAR HET TABBLAD
     */

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState ===
          "visible"
        ) {

          checkClock();

        }

      }
    );

    /*
     * KLOK IEDERE SECONDE
     * BIJWERKEN
     */

    setInterval(
      checkClock,
      CLOCK_INTERVAL
    );

    console.log(
      "✅ QuizBallon Daily Challenge V5 actief!"
    );

  }


  /* ========================================
     CONTROLEFUNCTIES BESCHIKBAAR MAKEN

     Hiermee kun je eventueel in
     de browserconsole controleren
     welke onderwerpen vandaag en
     morgen geselecteerd worden.
  ======================================== */

  window.QUIZBALLON_DAILY_TOPICS = {

    getTopic: getTopic,

    getDayKey: getDayKey,

    getTopicsForDay:
      getTopicsForDay,

    compareDays:
      compareDays,

    hasGuaranteedRotation:
      uniqueTopicsGuaranteed,

    totalTopics:
      topicGroups.length,

    poolA:
      alternatingPools.A.map(
        function (group) {
          return group.topic;
        }
      ),

    poolB:
      alternatingPools.B.map(
        function (group) {
          return group.topic;
        }
      )

  };


  initialize();

})();
