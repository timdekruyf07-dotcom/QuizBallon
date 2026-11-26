/* =====================================================
   QUIZBALLON - DAILY CHALLENGE V4

   NIEUW:
   - PRECIES 1 LETTERVRAAG PER 10 VRAGEN
   - 9 GEWONE KENNISVRAGEN
   - MAXIMAAL 1 VRAAG PER ONDERWERP
   - GOEDE AFWISSELING VAN CATEGORIEËN

   BEHOUDEN:
   - DEZELFDE VRAGEN VOOR ALLE SPELERS
   - NIEUWE UITDAGING OM 00.00 UUR
   - NEDERLANDSE TIJDZONE
   - DAGELIJKSE AFTELLER
   - 1 VOLTOOIDE UITDAGING PER DAG
   - ANTWOORDENOVERZICHT
   - BESTAANDE PUNTENSCORES
   - RAKETANTWOORDEN
===================================================== */

(function () {
  "use strict";

  /* ========================================
     INSTELLINGEN
  ======================================== */

  const TIME_ZONE = "Europe/Amsterdam";

  const QUESTIONS_PER_DAY = 10;

  /*
   * Precies één vraag met een
   * extra lettereis per dag.
   *
   * Dat is 10% van de vragen.
   */

  const LETTER_QUESTIONS_PER_DAY = 1;

  /*
   * We proberen maximaal 2 vragen
   * uit dezelfde hoofdcategorie
   * te selecteren.
   */

  const MAX_PER_CATEGORY = 2;

  const DAILY_STORAGE_KEY =
    "quizballon-daily-result-v1";

  const SELECTION_SALT =
    "quizballon-daily-v4";

  const CLOCK_INTERVAL = 1000;


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
   * Bewaar de volledige vragenbank
   * voordat we er 10 selecteren.
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
     AFTELLER TOT 00.00
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

     De 100 eerder toegevoegde
     vraagvarianten gebruiken:

     "Extra eis: ..."

     Daardoor kunnen we ze
     afzonderlijk herkennen.
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

     Bijvoorbeeld:

     "Noem een hondenras."

     En:

     "Noem een hondenras.
      Extra eis: minstens 6 letters."

     Hebben hetzelfde onderwerp.
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
  ======================================== */

  function getTopic(question) {

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

    if (text.includes("hoofdstad")) {
      return "hoofdsteden";
    }

    if (text.includes("muziekinstrument")) {
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

    if (text.includes("voetbalclub")) {
      return "voetbalclubs";
    }

    if (text.includes("sterrenbeeld")) {
      return "sterrenbeelden";
    }

    if (text.includes("scheikundig element")) {
      return "scheikundige-elementen";
    }

    if (text.includes("zoogdier")) {
      return "zoogdieren";
    }

    if (text.includes("kaassoort")) {
      return "kazen";
    }

    if (text.includes("groente")) {
      return "groenten";
    }

    if (text.includes("boomsoort")) {
      return "bomen";
    }

    if (text.includes("muziekgenre")) {
      return "muziekgenres";
    }

    if (text.includes("grieks eiland")) {
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
      /land|stad|steden|hoofdstad|eiland|taal/.test(topic)
    ) {
      return "aardrijkskunde";
    }

    if (
      category.includes("dier") ||
      category.includes("natuur") ||
      /vogel|honden|zoogdier|zeedier|bomen/.test(topic)
    ) {
      return "natuur";
    }

    if (
      category.includes("eten") ||
      category.includes("fruit")
    ) {
      return "eten";
    }

    if (category.includes("sport")) {
      return "sport";
    }

    if (category.includes("muziek")) {
      return "muziek";
    }

    if (category.includes("geschiedenis")) {
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

     Hiermee krijgen alle spelers
     met dezelfde vragenbank en datum
     dezelfde selectie.
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

     Ieder onderwerp heeft twee lijsten:

     1. Gewone vragen
     2. Vragen met extra lettereis
  ======================================== */

  function createTopicGroups() {

    const groups = new Map();

    allQuestions.forEach(
      function (question) {

        const topic =
          getTopic(question);

        if (!groups.has(topic)) {

          groups.set(topic, {

            topic: topic,

            regular: [],

            letter: []

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

    return groups;

  }


  const topicGroups =
    createTopicGroups();


  /* ========================================
     EEN GEWONE VRAAG PER ONDERWERP

     We kiezen uit de gewone vragen,
     zodat de lettervarianten niet
     voortdurend geselecteerd worden.
  ======================================== */

  function chooseRegularQuestion(
    group,
    dayKey
  ) {

    if (group.regular.length === 0) {
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

     Alleen gebruikt voor het ene
     speciale slot van de dag.
  ======================================== */

  function chooseLetterQuestion(
    group,
    dayKey
  ) {

    if (group.letter.length === 0) {
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
     10 VERSCHILLENDE ONDERWERPEN KIEZEN

     Eerst onderwerpen die gisteren
     niet gebruikt zijn.

     We proberen ook de categorieën
     eerlijk te verdelen.
  ======================================== */

  function chooseTopics(
    dayKey,
    avoidedTopics = new Set()
  ) {

    const candidates = [];

    topicGroups.forEach(
      function (group) {

        if (group.regular.length === 0) {
          return;
        }

        const regularQuestion =
          chooseRegularQuestion(
            group,
            dayKey
          );

        candidates.push({

          topic: group.topic,

          category: getCategory(
            regularQuestion
          ),

          regularQuestion: regularQuestion,

          group: group

        });

      }
    );

    const shuffled = shuffle(
      candidates,
      seedFromString(
        SELECTION_SALT +
        "|onderwerpen|" +
        dayKey
      )
    );

    /*
     * Nieuwe onderwerpen krijgen
     * voorrang op onderwerpen van
     * gisteren.
     */

    const preferred = shuffled.filter(
      function (item) {

        return !avoidedTopics.has(
          item.topic
        );

      }
    );

    const fallback = shuffled.filter(
      function (item) {

        return avoidedTopics.has(
          item.topic
        );

      }
    );

    const selected = [];

    const selectedTopics = new Set();

    const categoryCounts = new Map();


    function addFrom(
      items,
      enforceCategoryLimit
    ) {

      for (const item of items) {

        if (
          selected.length >=
          QUESTIONS_PER_DAY
        ) {
          break;
        }

        if (
          selectedTopics.has(
            item.topic
          )
        ) {
          continue;
        }

        const count =
          categoryCounts.get(
            item.category
          ) || 0;

        if (
          enforceCategoryLimit &&
          count >= MAX_PER_CATEGORY
        ) {
          continue;
        }

        selected.push(item);

        selectedTopics.add(
          item.topic
        );

        categoryCounts.set(
          item.category,
          count + 1
        );

      }

    }


    /*
     * Eerste ronde:
     * nieuwe onderwerpen,
     * maximaal twee per categorie.
     */

    addFrom(preferred, true);

    /*
     * Tweede ronde:
     * overige nieuwe onderwerpen.
     */

    addFrom(preferred, false);

    /*
     * Alleen indien nodig:
     * onderwerpen van gisteren.
     */

    if (
      selected.length <
      QUESTIONS_PER_DAY
    ) {

      addFrom(fallback, true);

      addFrom(fallback, false);

    }

    return selected.slice(
      0,
      QUESTIONS_PER_DAY
    );

  }


  /* ========================================
     LETTERVRAAG TOEVOEGEN

     We hebben nu 10 onderwerpen.

     Voor negen onderwerpen gebruiken
     we een normale kennisvraag.

     Bij precies één onderwerp kiezen
     we een lettervariant.

     De andere negen blijven gewoon.
  ======================================== */

  function applyLetterQuestion(
    selectedTopics,
    dayKey
  ) {

    const result = selectedTopics.map(
      function (item) {

        return {

          ...item,

          question: item.regularQuestion

        };

      }
    );

    const eligible = result.filter(
      function (item) {

        return item.group.letter.length > 0;

      }
    );

    if (eligible.length === 0) {

      console.warn(
        "QuizBallon: vandaag geen geschikte lettervariant beschikbaar."
      );

      return result;

    }

    /*
     * Kies iedere dag een ander
     * onderwerp voor de lettervraag.
     */

    const shuffledEligible = shuffle(
      eligible,
      seedFromString(
        SELECTION_SALT +
        "|letteronderwerp|" +
        dayKey
      )
    );

    const chosen = shuffledEligible[0];

    chosen.question =
      chooseLetterQuestion(
        chosen.group,
        dayKey
      );

    return result;

  }


  /* ========================================
     VRAGEN VOOR ÉÉN DAG MAKEN
  ======================================== */

  function makeDailySelection(
    dayKey,
    avoidedTopics = new Set()
  ) {

    const topics = chooseTopics(
      dayKey,
      avoidedTopics
    );

    const withLetterQuestion =
      applyLetterQuestion(
        topics,
        dayKey
      );

    /*
     * Vaste volgorde voor de selectie.
     */

    return shuffle(
      withLetterQuestion,
      seedFromString(
        SELECTION_SALT +
        "|volgorde|" +
        dayKey
      )
    );

  }


  /* ========================================
     GISTEREN ZO VEEL MOGELIJK VERMIJDEN
  ======================================== */

  function chooseDailyQuestions(dayKey) {

    const yesterday =
      previousDayKey(dayKey);

    /*
     * Bepaal de basisselectie van
     * gisteren op dezelfde manier.
     */

    const previousSelection =
      makeDailySelection(yesterday);

    const yesterdayTopics =
      new Set(
        previousSelection.map(
          function (item) {

            return item.topic;

          }
        )
      );

    /*
     * Geef vandaag voorrang aan
     * andere onderwerpen.
     */

    const todaySelection =
      makeDailySelection(
        dayKey,
        yesterdayTopics
      );

    return todaySelection.map(
      function (item) {

        return item.question;

      }
    );

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
        "QuizBallon: resultaat kon niet worden opgeslagen."
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

     Zelfde ontwerp als de vorige
     versie van QuizBallon.
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
      chooseDailyQuestions(currentDay);

    if (
      selected.length !==
      QUESTIONS_PER_DAY
    ) {

      console.error(
        "QuizBallon: onvoldoende verschillende onderwerpen."
      );

      elements.startButton.disabled = true;

      return false;

    }

    /*
     * Controleer hoeveel vragen
     * een extra lettereis hebben.
     */

    const letterCount = selected.filter(
      isLetterQuestion
    ).length;

    if (
      letterCount !==
      LETTER_QUESTIONS_PER_DAY
    ) {

      console.warn(
        "QuizBallon: verwacht 1 lettervraag, gevonden:",
        letterCount
      );

    }

    /*
     * De spelcode krijgt uitsluitend
     * de 10 vragen van vandaag.
     */

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      selected;

    window.QUIZBALLON_DAILY_INFO = {

      date: currentDay,

      questionCount: selected.length,

      letterQuestionCount: letterCount,

      questions: selected.map(
        function (question) {

          return question.question;

        }
      )

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
      "🔤 Lettervragen vandaag:",
      letterCount
    );

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

    if (getDayKey() !== currentDay) {

      window.location.reload();

      return;

    }

    if (elements.dailyCountdown) {

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

    completedResult = loadResult();

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

        attributeFilter: ["class"]
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
      "✅ QuizBallon Daily Challenge v4 actief!"
    );

  }


  initialize();

})();
