/* =====================================================
   QUIZBALLON - DAILY CHALLENGE V3

   - 10 VRAGEN PER NEDERLANDSE DAG
   - DEZELFDE SELECTIE VOOR ALLE SPELERS
   - MAXIMAAL 1 VRAAG PER ONDERWERP
   - LIEFST MAXIMAAL 2 PER HOOFDCATEGORIE
   - ONDERWERPEN VAN GISTEREN VERMIJDEN
   - NIEUWE UITDAGING OM 00.00 UUR
   - 1 VOLTOOIDE UITDAGING PER DAG
   - BESTAAND ANTWOORDENOVERZICHT BEHOUDEN
===================================================== */

(function () {
  "use strict";

  const TIME_ZONE = "Europe/Amsterdam";

  const QUESTIONS_PER_DAY = 10;
  const MAX_PER_CATEGORY = 2;

  const DAILY_STORAGE_KEY =
    "quizballon-daily-result-v1";

  const SELECTION_SALT =
    "quizballon-daily-v3";

  const elements = {
    startScreen: document.getElementById("start-screen"),
    endScreen: document.getElementById("end-screen"),
    startButton: document.getElementById("start-button"),
    restartButton: document.getElementById("restart-button"),
    homeButton: document.getElementById("home-button"),
    quitButton: document.getElementById("quit-button"),

    dailyDate: document.getElementById("daily-date"),
    dailyDescription: document.getElementById("daily-description"),
    dailyStatus: document.getElementById("daily-status"),
    dailyCountdown: document.getElementById("daily-countdown"),
    dailyEndMessage: document.getElementById("daily-end-message"),

    endScore: document.getElementById("end-score"),
    endHeight: document.getElementById("end-height"),
    endCorrect: document.getElementById("end-correct")
  };

  let currentDay = "";
  let activeDay = null;
  let completedResult = null;
  let lastEndVisible = false;

  const allQuestions =
    Array.isArray(window.QUIZBALLON_EXPANDED_QUESTIONS)
      ? [...window.QUIZBALLON_EXPANDED_QUESTIONS]
      : [];

  /* ========================================
     DATUM EN TIJD
  ======================================== */

  function getDayKey(date = new Date()) {
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function previousDayKey(dayKey) {
    const date = new Date(dayKey + "T12:00:00Z");
    date.setUTCDate(date.getUTCDate() - 1);

    return date.toISOString().slice(0, 10);
  }

  function getDisplayDate() {
    return new Intl.DateTimeFormat("nl-NL", {
      timeZone: TIME_ZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());
  }

  function getClock() {
    const clock = {
      hour: 0,
      minute: 0,
      second: 0
    };

    const parts = new Intl.DateTimeFormat("nl-NL", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());

    parts.forEach(function (part) {
      if (part.type in clock) {
        clock[part.type] = Number(part.value);
      }
    });

    return clock;
  }

  function getCountdown() {
    const clock = getClock();

    const elapsed =
      clock.hour * 3600 +
      clock.minute * 60 +
      clock.second;

    let remaining = 86400 - elapsed;

    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return [hours, minutes, seconds]
      .map(value => String(value).padStart(2, "0"))
      .join(":");
  }

  /* ========================================
     VRAGEN HERKENNEN
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

  function getBaseText(question) {
    let text = String(question.question || "");

    const position = text
      .toLowerCase()
      .indexOf("extra eis:");

    if (position !== -1) {
      text = text.slice(0, position);
    }

    return normalize(text);
  }

  function getTopic(question) {
    const text = getBaseText(question);

    if (text.includes("japan") &&
        /stad|steden/.test(text)) {
      return "japanse-steden";
    }

    if (text.includes("hondenras") ||
        text.includes("hondenkruising")) {
      return "honden";
    }

    if (text.includes("hoofdstad")) {
      return "hoofdsteden";
    }

    if (text.includes("muziekinstrument")) {
      return "muziekinstrumenten";
    }

    if (text.includes("vogelsoort")) {
      return "vogels";
    }

    if (text.includes("maan") &&
        text.includes("zonnestelsel")) {
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

  function getCategory(question) {
    const category = normalize(question.category);
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
     VASTE RANDOMSELECTIE
  ======================================== */

  function seedFromString(value) {
    let hash = 2166136261;

    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

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

  function shuffle(items, seed) {
    const result = [...items];
    const random = seededRandom(seed);

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));

      [result[i], result[j]] = [
        result[j], result[i]
      ];
    }

    return result;
  }

  /* ========================================
     ONDERWERPEN GROEPEREN
  ======================================== */

  function createTopicGroups() {
    const groups = new Map();

    allQuestions.forEach(function (question) {
      const key = getTopic(question);

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key).push(question);
    });

    return groups;
  }

  const topicGroups = createTopicGroups();

  /* ========================================
     SELECTIE VOOR EEN BEPAALDE DAG

     We kiezen per onderwerp één variant.

     Gisteren gebruikte onderwerpen
     krijgen de laagste prioriteit.
  ======================================== */

  function makeSelection(dayKey, avoidedTopics = new Set()) {
    const candidates = [];

    topicGroups.forEach(function (variants, topic) {
      const variantSeed = seedFromString(
        SELECTION_SALT +
        "|" + dayKey +
        "|" + topic
      );

      const chosen = shuffle(
        variants,
        variantSeed
      )[0];

      candidates.push({
        topic,
        category: getCategory(chosen),
        question: chosen
      });
    });

    const shuffled = shuffle(
      candidates,
      seedFromString(SELECTION_SALT + "|" + dayKey)
    );

    const preferred = shuffled.filter(
      item => !avoidedTopics.has(item.topic)
    );

    const fallback = shuffled.filter(
      item => avoidedTopics.has(item.topic)
    );

    const selected = [];
    const selectedTopics = new Set();
    const categoryCounts = new Map();

    function addFrom(list, enforceCategoryLimit) {
      for (const item of list) {
        if (selected.length >= QUESTIONS_PER_DAY) {
          break;
        }

        if (selectedTopics.has(item.topic)) {
          continue;
        }

        const count =
          categoryCounts.get(item.category) || 0;

        if (
          enforceCategoryLimit &&
          count >= MAX_PER_CATEGORY
        ) {
          continue;
        }

        selected.push(item);

        selectedTopics.add(item.topic);

        categoryCounts.set(
          item.category,
          count + 1
        );
      }
    }

    /*
     * Eerst nieuwe onderwerpen,
     * daarna eventueel oude.
     */

    addFrom(preferred, true);
    addFrom(preferred, false);

    if (selected.length < QUESTIONS_PER_DAY) {
      addFrom(fallback, true);
      addFrom(fallback, false);
    }

    return shuffle(
      selected.slice(0, QUESTIONS_PER_DAY),
      seedFromString(
        SELECTION_SALT + "|volgorde|" + dayKey
      )
    );
  }

  /* ========================================
     VANDAAG EN GISTEREN VERGELIJKEN
  ======================================== */

  function chooseDailyQuestions(dayKey) {
    const yesterday = previousDayKey(dayKey);

    const previousSelection = makeSelection(yesterday);

    const yesterdayTopics = new Set(
      previousSelection.map(item => item.topic)
    );

    const todaySelection = makeSelection(
      dayKey,
      yesterdayTopics
    );

    return todaySelection.map(
      item => item.question
    );
  }

  /* ========================================
     DAGRESULTAAT
  ======================================== */

  function loadResult() {
    try {
      const value = localStorage.getItem(
        DAILY_STORAGE_KEY
      );

      if (!value) {
        return null;
      }

      const result = JSON.parse(value);

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

  function saveResult(result) {
    completedResult = result;

    try {
      localStorage.setItem(
        DAILY_STORAGE_KEY,
        JSON.stringify(result)
      );
    } catch (error) {
      console.warn("Dagresultaat kon niet worden opgeslagen.");
    }
  }

  function isCompleted() {
    return Boolean(
      completedResult &&
      completedResult.date === currentDay
    );
  }

  /* ========================================
     EXTRA STYLING VOOR DAILY-KAART
  ======================================== */

  function addDailyStyles() {
    if (
      document.getElementById(
        "quizballon-daily-styles"
      )
    ) {
      return;
    }

    const style = document.createElement("style");

    style.id = "quizballon-daily-styles";

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
     KNOPTEKST
  ======================================== */

  function setButton(button, label) {
    if (!button) {
      return;
    }

    const text = document.createElement("span");
    text.textContent = label;

    const arrow = document.createElement("span");
    arrow.textContent = "↗";

    button.replaceChildren(text, arrow);
  }

  /* ========================================
     STARTSCHERM
  ======================================== */

  function updateHome() {
    if (elements.dailyDate) {
      elements.dailyDate.textContent = getDisplayDate();
    }

    if (elements.dailyCountdown) {
      elements.dailyCountdown.textContent = getCountdown();
    }

    if (isCompleted()) {
      if (elements.dailyStatus) {
        elements.dailyStatus.textContent = "VOLTOOID ✓";
        elements.dailyStatus.classList.add("completed");
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
        elements.dailyStatus.textContent = "BESCHIKBAAR";
        elements.dailyStatus.classList.remove("completed");
      }

      if (elements.dailyDescription) {
        elements.dailyDescription.textContent =
          "De 10 vragen van vandaag staan klaar. " +
          "Je hebt 25 seconden per vraag.";
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
     EINDSCHERM
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
    const selected = chooseDailyQuestions(currentDay);

    if (selected.length !== QUESTIONS_PER_DAY) {
      console.error(
        "QuizBallon: onvoldoende verschillende onderwerpen."
      );

      elements.startButton.disabled = true;
      return false;
    }

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      selected;

    window.QUIZBALLON_DAILY_INFO = {
      date: currentDay,
      questionCount: selected.length,
      questions: selected.map(q => q.question)
    };

    console.log(
      "📅 QuizBallon Daily Challenge:",
      currentDay
    );

    console.table(
      selected.map((q, index) => ({
        nummer: index + 1,
        categorie: getCategory(q),
        onderwerp: getTopic(q),
        vraag: q.question
      }))
    );

    return true;
  }

  /* ========================================
     START REGISTREREN
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
      elements.endScreen.classList.contains("active");

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
      elements.endScore.textContent.replace(/[^\d]/g, "")
    );

    if (!Number.isFinite(score)) {
      return;
    }

    const result = {
      date: currentDay,
      score,
      height: elements.endHeight.textContent.trim(),
      correct: elements.endCorrect.textContent.trim(),
      completedAt: new Date().toISOString()
    };

    saveResult(result);

    activeDay = null;

    updateHome();
    updateEnd();

    console.log("🏆 Daily Challenge voltooid:", result);
  }

  /* ========================================
     DAGWISSELING
  ======================================== */

  function checkClock() {
    if (getDayKey() !== currentDay) {
      window.location.reload();
      return;
    }

    if (elements.dailyCountdown) {
      elements.dailyCountdown.textContent = getCountdown();
    }
  }

  /* ========================================
     START
  ======================================== */

  function initialize() {
    if (
      !elements.startButton ||
      !elements.endScreen ||
      !elements.endScore
    ) {
      console.error("QuizBallon: vereiste HTML ontbreekt.");
      return;
    }

    if (allQuestions.length < QUESTIONS_PER_DAY) {
      console.error("QuizBallon: te weinig vragen.");
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

    elements.startButton.addEventListener(
      "click",
      registerStart,
      true
    );

    if (elements.restartButton) {
      elements.restartButton.addEventListener(
        "click",
        registerStart,
        true
      );
    }

    if (elements.homeButton) {
      elements.homeButton.addEventListener(
        "click",
        updateHome
      );
    }

    if (elements.quitButton) {
      elements.quitButton.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            if (
              elements.startScreen.classList.contains(
                "active"
              )
            ) {
              activeDay = null;
              updateHome();
            }
          }, 0);
        }
      );
    }

    const observer = new MutationObserver(
      checkEndScreen
    );

    observer.observe(elements.endScreen, {
      attributes: true,
      attributeFilter: ["class"]
    });

    document.addEventListener(
      "visibilitychange",
      function () {
        if (document.visibilityState === "visible") {
          checkClock();
        }
      }
    );

    setInterval(checkClock, 1000);

    console.log(
      "✅ Daily Challenge v3 actief!",
      allQuestions.length,
      "vragen beschikbaar."
    );
  }

  initialize();

})();
