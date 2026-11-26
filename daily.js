/* =====================================================
   QUIZBALLON
   DAILY CHALLENGE - VERSIE 2

   NIEUW:
   - 10 VRAGEN PER DAG
   - BETERE AFWISSELING VAN ONDERWERPEN
   - MAXIMAAL 1 VRAAG PER ONDERWERP
   - MAXIMAAL 2 VRAGEN PER HOOFDCATEGORIE
     ZOLANG DAT MOGELIJK IS

   BEHOUDEN:
   - VASTE VRAGEN VOOR ALLE SPELERS
   - VERNIEUWING OM 00.00 UUR
   - NEDERLANDSE TIJDZONE
   - DAGELIJKSE AFTELLER
   - EEN VOLTOOIDE CHALLENGE PER DAG
   - LOKAAL OPGESLAGEN DAGRESULTAAT
   - COMPATIBEL MET ANTWOORDENOVERZICHT
===================================================== */

(function () {
  "use strict";

  /* ========================================
     INSTELLINGEN
  ======================================== */

  const TIME_ZONE = "Europe/Amsterdam";

  const QUESTIONS_PER_DAY = 10;

  const MAX_PER_CATEGORY = 2;

  const DAILY_STORAGE_KEY =
    "quizballon-daily-result-v1";

  const DAILY_SELECTION_SALT =
    "quizballon-afwisselende-daily-v2";

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

  let currentDayKey = "";

  let activeChallengeDay = null;

  let completedResult = null;

  let lastEndScreenVisible = false;

  let sourceQuestions = [];


  /* ========================================
     NEDERLANDSE DATUM
  ======================================== */

  function getDutchDayKey(date = new Date()) {
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
     DATUM WEERGEVEN
  ======================================== */

  function formatDutchDate(date = new Date()) {
    return new Intl.DateTimeFormat(
      "nl-NL",
      {
        timeZone: TIME_ZONE,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(date);
  }


  /* ========================================
     NEDERLANDSE KLOK
  ======================================== */

  function getDutchClock() {
    const parts = new Intl.DateTimeFormat(
      "nl-NL",
      {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
      }
    ).formatToParts(new Date());

    const clock = {
      hour: 0,
      minute: 0,
      second: 0
    };

    parts.forEach(function (part) {
      if (part.type in clock) {
        clock[part.type] = Number(part.value);
      }
    });

    return clock;
  }


  /* ========================================
     AFTELLER

     De teller toont de resterende
     Nederlandse kloktijd tot 00.00.

     Bij zomer-/wintertijd wordt de
     nieuwe kalenderdag afzonderlijk
     gecontroleerd.
  ======================================== */

  function getCountdown() {
    const clock = getDutchClock();

    const elapsed =
      clock.hour * 3600 +
      clock.minute * 60 +
      clock.second;

    const remaining = Math.max(
      0,
      86400 - elapsed
    );

    const hours = Math.floor(
      remaining / 3600
    );

    const minutes = Math.floor(
      (remaining % 3600) / 60
    );

    const seconds = remaining % 60;

    return [hours, minutes, seconds]
      .map(function (number) {
        return String(number).padStart(2, "0");
      })
      .join(":");
  }


  /* ========================================
     NAMEN NORMALISEREN
  ======================================== */

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’'`]/g, "")
      .replace(/[-–—_]/g, " ")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* ========================================
     VRAAGVARIANTEN HERKENNEN

     Bijvoorbeeld:

     "Noem een hondenras."
     "Noem een hondenras. Extra eis: ..."

     Beide krijgen dezelfde
     onderwerpcode.

     Daardoor kunnen ze niet allebei
     in dezelfde Daily Challenge komen.
  ======================================== */

  function getBaseQuestionText(question) {
    let text = String(
      question.question || ""
    );

    const extraRulePosition =
      text.toLowerCase().indexOf(
        "extra eis:"
      );

    if (extraRulePosition >= 0) {
      text = text.slice(
        0,
        extraRulePosition
      );
    }

    return normalize(text);
  }


  /* ========================================
     ONDERWERP HERKENNEN

     We herkennen ook enkele
     verschillende formuleringen
     van hetzelfde onderwerp.

     Bijvoorbeeld:
     "Noem een stad in Japan"
     "Noem een Japanse stad"
  ======================================== */

  function getTopicKey(question) {
    const base = getBaseQuestionText(question);

    if (
      base.includes("japan") &&
      (
        base.includes("stad") ||
        base.includes("steden")
      )
    ) {
      return "steden-japan";
    }

    if (
      base.includes("hondenras") ||
      base.includes("hondenkruising")
    ) {
      return "honden";
    }

    if (
      base.includes("muziekinstrument")
    ) {
      return "muziekinstrumenten";
    }

    if (
      base.includes("maan") &&
      base.includes("zonnestelsel")
    ) {
      return "manen-zonnestelsel";
    }

    if (
      base.includes("hoofdstad")
    ) {
      return "hoofdsteden";
    }

    if (
      base.includes("vogelsoort")
    ) {
      return "vogelsoorten";
    }

    return base;
  }


  /* ========================================
     HOOFDCATEGORIE HERKENNEN

     De bestaande vragenbank gebruikt
     emoji en categorienamen.

     Voor een betere verdeling worden
     verwante categorieën samengevoegd.
  ======================================== */

  function getCategoryKey(question) {
    const category = normalize(
      question.category
    );

    const topic = getTopicKey(question);

    if (
      category.includes("aardrijkskunde") ||
      category.includes("wereld") ||
      topic.includes("landen") ||
      topic.includes("hoofdsteden") ||
      topic.includes("steden") ||
      topic.includes("eilanden")
    ) {
      return "aardrijkskunde";
    }

    if (
      category.includes("dier") ||
      category.includes("natuur") ||
      category.includes("vogel") ||
      topic.includes("honden") ||
      topic.includes("zoogdier") ||
      topic.includes("zeedier")
    ) {
      return "dieren-en-natuur";
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
      return "wetenschap-en-ruimte";
    }

    return category || "overig";
  }


  /* ========================================
     VASTE SEED

     Dezelfde datum geeft dezelfde
     pseudo-willekeurige volgorde.
  ======================================== */

  function stringToSeed(text) {
    let hash = 2166136261;

    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);

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
     VRAGEN SCHUDDEN
  ======================================== */

  function seededShuffle(array, seed) {
    const result = [...array];

    const random = seededRandom(seed);

    for (
      let i = result.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        random() * (i + 1)
      );

      [result[i], result[j]] = [
        result[j], result[i]
      ];
    }

    return result;
  }


  /* ========================================
     VRAGEN PER ONDERWERP GROEPEREN

     Alle varianten van dezelfde
     basisvraag worden in één groep
     geplaatst.

     Per groep kiezen we maximaal
     één vraag voor vandaag.
  ======================================== */

  function groupQuestionsByTopic(questions) {
    const groups = new Map();

    questions.forEach(function (question) {
      const topic = getTopicKey(question);

      if (!topic) {
        return;
      }

      if (!groups.has(topic)) {
        groups.set(topic, []);
      }

      groups.get(topic).push(question);
    });

    return groups;
  }


  /* ========================================
     NIEUWE DAGELIJKSE SELECTIE

     STAP 1:
     Groepeer vergelijkbare vragen.

     STAP 2:
     Kies per onderwerp één variant.

     STAP 3:
     Schud de onderwerpen per dag.

     STAP 4:
     Kies 10 vragen met maximaal
     twee uit dezelfde hoofdcategorie.

     STAP 5:
     Als de verdeling anders geen
     10 vragen oplevert, vullen we
     aan uit andere onderwerpen.
  ======================================== */

  function selectDailyQuestions(
    allQuestions,
    dayKey
  ) {
    if (
      !Array.isArray(allQuestions) ||
      allQuestions.length < QUESTIONS_PER_DAY
    ) {
      return [];
    }

    const groups =
      groupQuestionsByTopic(allQuestions);

    const seed = stringToSeed(
      DAILY_SELECTION_SALT + "|" + dayKey
    );

    const topics = [];

    /*
     * Kies per onderwerp een variant.
     */

    groups.forEach(function (variants, key) {
      const topicSeed = stringToSeed(
        dayKey + "|" + key + "|variant-v2"
      );

      const shuffledVariants =
        seededShuffle(
          variants,
          topicSeed
        );

      const question =
        shuffledVariants[0];

      topics.push({
        key: key,
        category: getCategoryKey(question),
        question: question
      });
    });

    /*
     * Schud de onderwerpen.
     */

    const shuffledTopics =
      seededShuffle(topics, seed);

    const selected = [];

    const selectedKeys = new Set();

    const categoryCounts = new Map();

    /*
     * Eerste ronde:
     * maximaal twee vragen
     * per hoofdcategorie.
     */

    shuffledTopics.forEach(function (item) {
      if (
        selected.length >= QUESTIONS_PER_DAY
      ) {
        return;
      }

      const count =
        categoryCounts.get(
          item.category
        ) || 0;

      if (count >= MAX_PER_CATEGORY) {
        return;
      }

      selected.push(item.question);

      selectedKeys.add(item.key);

      categoryCounts.set(
        item.category,
        count + 1
      );
    });

    /*
     * Tweede ronde:
     * alleen als er nog geen
     * tien vragen geselecteerd zijn.

     * Ook hier blijft ieder onderwerp
     * uniek binnen de Daily Challenge.
     */

    if (
      selected.length < QUESTIONS_PER_DAY
    ) {
      shuffledTopics.forEach(function (item) {
        if (
          selected.length >= QUESTIONS_PER_DAY
        ) {
          return;
        }

        if (selectedKeys.has(item.key)) {
          return;
        }

        selected.push(item.question);

        selectedKeys.add(item.key);
      });
    }

    /*
     * Definitieve speelvolgorde.
     */

    return seededShuffle(
      selected.slice(
        0,
        QUESTIONS_PER_DAY
      ),
      stringToSeed(
        dayKey + "|speelvolgorde-v2"
      )
    );
  }


  /* ========================================
     DAGRESULTAAT LADEN
  ======================================== */

  function loadDailyResult() {
    try {
      const saved = localStorage.getItem(
        DAILY_STORAGE_KEY
      );

      if (!saved) {
        return null;
      }

      const result = JSON.parse(saved);

      if (
        !result ||
        result.date !== currentDayKey ||
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

  function saveDailyResult(result) {
    completedResult = result;

    try {
      localStorage.setItem(
        DAILY_STORAGE_KEY,
        JSON.stringify(result)
      );
    } catch (error) {
      console.warn(
        "QuizBallon: dagresultaat kon niet worden opgeslagen."
      );
    }
  }


  /* ========================================
     VOLTOOID?
  ======================================== */

  function isDailyCompleted() {
    return Boolean(
      completedResult &&
      completedResult.date === currentDayKey
    );
  }


  /* ========================================
     EXTRA DAGELIJKSE STYLING

     Je bestaande style.css en
     verbeteringen.css blijven staan.
  ======================================== */

  function addDailyStyles() {
    if (byId("quizballon-daily-styles")) {
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

        border: 1px solid
          rgba(255,255,255,.9);

        border-radius: 20px;

        background:
          rgba(255,255,255,.87);

        box-shadow:
          0 16px 40px
          rgba(36,82,143,.10);

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

        font-size: clamp(
          23px,
          4vw,
          29px
        );

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

        font-variant-numeric:
          tabular-nums;

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
          border-radius: 17px;
        }
      }

      @media (max-width: 480px) {
        .daily-countdown-row {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }

        .daily-countdown-row strong {
          font-size: 23px;
        }
      }

    `;

    document.head.appendChild(style);
  }


  /* ========================================
     KNOPTEKST NETJES BIJWERKEN

     We gebruiken tekst en een pijltje
     in aparte spans, zodat je
     bestaande knopstyling werkt.
  ======================================== */

  function setButtonContent(button, label) {
    if (!button) {
      return;
    }

    button.replaceChildren();

    const text = document.createElement(
      "span"
    );

    text.textContent = label;

    const arrow = document.createElement(
      "span"
    );

    arrow.textContent = "↗";

    button.append(text, arrow);
  }


  /* ========================================
     STARTSCHERM BIJWERKEN
  ======================================== */

  function updateDailyHome() {
    if (elements.dailyDate) {
      elements.dailyDate.textContent =
        formatDutchDate();
    }

    if (elements.dailyCountdown) {
      elements.dailyCountdown.textContent =
        getCountdown();
    }

    if (isDailyCompleted()) {
      if (elements.dailyStatus) {
        elements.dailyStatus.textContent =
          "VOLTOOID ✓";

        elements.dailyStatus.classList.add(
          "completed"
        );
      }

      if (elements.dailyDescription) {
        elements.dailyDescription.textContent =
          "Je hebt de uitdaging van vandaag " +
          "voltooid! Je behaalde " +
          completedResult.score +
          " punten en bereikte " +
          completedResult.height +
          ". Morgen kun je opnieuw vliegen.";
      }

      elements.startButton.disabled = true;

      setButtonContent(
        elements.startButton,
        "MORGEN WEER VLIEGEN"
      );

      if (elements.restartButton) {
        elements.restartButton.disabled = true;

        setButtonContent(
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
          "Je hebt 25 seconden per vraag. " +
          "Hoe hoog kun jij vliegen?";
      }

      elements.startButton.disabled = false;

      setButtonContent(
        elements.startButton,
        "START DE DAGELIJKSE VLUCHT"
      );

      if (elements.restartButton) {
        elements.restartButton.disabled = false;

        setButtonContent(
          elements.restartButton,
          "OPNIEUW VLIEGEN"
        );
      }
    }
  }


  /* ========================================
     EINDSCHERM BIJWERKEN
  ======================================== */

  function updateDailyEndScreen() {
    if (!elements.dailyEndMessage) {
      return;
    }

    if (isDailyCompleted()) {
      elements.dailyEndMessage.textContent =
        "📅 Dagelijkse uitdaging voltooid! " +
        "Je score is op dit apparaat bewaard. " +
        "Morgen om 00.00 uur Nederlandse tijd " +
        "verschijnt de nieuwe uitdaging.";

      if (elements.restartButton) {
        elements.restartButton.disabled = true;

        setButtonContent(
          elements.restartButton,
          "MORGEN WEER SPELEN"
        );
      }
    }
  }


  /* ========================================
     DAGVRAGEN INSTELLEN

     De bestaande script.js leest
     window.QUIZBALLON_EXPANDED_QUESTIONS.

     We vervangen die lijst door de
     10 geselecteerde vragen.

     De originele vragenbank blijft
     apart in sourceQuestions staan.
  ======================================== */

  function applyDailySelection() {
    const selected = selectDailyQuestions(
      sourceQuestions,
      currentDayKey
    );

    if (
      selected.length !== QUESTIONS_PER_DAY
    ) {
      console.error(
        "QuizBallon: er konden geen " +
        "10 verschillende onderwerpen " +
        "worden geselecteerd."
      );

      elements.startButton.disabled = true;

      return false;
    }

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      selected;

    console.log(
      "🎈 Daily Challenge:",
      currentDayKey
    );

    console.table(
      selected.map(function (question, index) {
        return {
          nummer: index + 1,
          categorie: getCategoryKey(question),
          onderwerp: getTopicKey(question),
          vraag: question.question
        };
      })
    );

    return true;
  }


  /* ========================================
     SPELSTART REGISTREREN
  ======================================== */

  function registerGameStart() {
    if (isDailyCompleted()) {
      return;
    }

    activeChallengeDay =
      currentDayKey;

    lastEndScreenVisible = false;
  }


  /* ========================================
     SPELRESULTAAT REGISTREREN

     Zodra het eindscherm verschijnt,
     wordt het dagresultaat opgeslagen.

     De sleutel blijft hetzelfde als
     in daily.js versie 1, zodat het
     antwoordenoverzicht blijft werken.
  ======================================== */

  function checkForCompletedGame() {
    const endVisible =
      elements.endScreen.classList.contains(
        "active"
      );

    if (!endVisible) {
      lastEndScreenVisible = false;
      return;
    }

    if (lastEndScreenVisible) {
      return;
    }

    lastEndScreenVisible = true;

    if (!activeChallengeDay) {
      return;
    }

    if (
      activeChallengeDay !== currentDayKey ||
      isDailyCompleted()
    ) {
      return;
    }

    const scoreText =
      elements.endScore.textContent.trim();

    const score = Number(
      scoreText.replace(/[^\d]/g, "")
    );

    const height =
      elements.endHeight.textContent.trim();

    const correct =
      elements.endCorrect.textContent.trim();

    if (!Number.isFinite(score)) {
      return;
    }

    const result = {
      date: currentDayKey,
      score: score,
      height: height,
      correct: correct,
      completedAt: new Date().toISOString()
    };

    saveDailyResult(result);

    activeChallengeDay = null;

    updateDailyHome();

    updateDailyEndScreen();

    console.log(
      "🏆 Daily Challenge voltooid:",
      result
    );
  }


  /* ========================================
     EINDSCHERM OBSERVEREN
  ======================================== */

  function observeEndScreen() {
    const observer = new MutationObserver(
      checkForCompletedGame
    );

    observer.observe(
      elements.endScreen,
      {
        attributes: true,
        attributeFilter: ["class"]
      }
    );
  }


  /* ========================================
     NIEUWE DAG HERKENNEN

     Zodra het in Nederland een nieuwe
     kalenderdag wordt, verversen we
     de pagina.

     Een spel dat precies om
     middernacht bezig is,
     wordt hierdoor afgebroken.
  ======================================== */

  function checkForNewDay() {
    const actualDay = getDutchDayKey();

    if (actualDay !== currentDayKey) {
      window.location.reload();
      return;
    }

    if (elements.dailyCountdown) {
      elements.dailyCountdown.textContent =
        getCountdown();
    }
  }


  /* ========================================
     EVENTS
  ======================================== */

  function initializeEvents() {
    elements.startButton.addEventListener(
      "click",
      registerGameStart,
      true
    );

    if (elements.restartButton) {
      elements.restartButton.addEventListener(
        "click",
        registerGameStart,
        true
      );
    }

    if (elements.homeButton) {
      elements.homeButton.addEventListener(
        "click",
        updateDailyHome
      );
    }

    const quitButton =
      byId("quit-button");

    if (quitButton) {
      quitButton.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            if (
              elements.startScreen.classList.contains(
                "active"
              )
            ) {
              activeChallengeDay = null;
              updateDailyHome();
            }
          }, 0);
        }
      );
    }

    document.addEventListener(
      "visibilitychange",
      function () {
        if (
          document.visibilityState === "visible"
        ) {
          checkForNewDay();
        }
      }
    );
  }


  /* ========================================
     START
  ======================================== */

  function initializeDailyChallenge() {
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

    const bank =
      window.QUIZBALLON_EXPANDED_QUESTIONS;

    if (!Array.isArray(bank)) {
      console.error(
        "QuizBallon: vragenbank ontbreekt."
      );

      elements.startButton.disabled = true;

      return;
    }

    /*
     * Bewaar alle beschikbare vragen.
     */

    sourceQuestions = [...bank];

    currentDayKey = getDutchDayKey();

    addDailyStyles();

    /*
     * Laad eerst het eventuele
     * dagresultaat van vandaag.
     */

    completedResult = loadDailyResult();

    /*
     * Kies vervolgens de afwisselende
     * dagelijkse vragen.
     */

    if (!applyDailySelection()) {
      return;
    }

    updateDailyHome();

    updateDailyEndScreen();

    initializeEvents();

    observeEndScreen();

    setInterval(
      checkForNewDay,
      CLOCK_INTERVAL
    );

    console.log(
      "✅ QuizBallon Daily Challenge v2 actief!"
    );

    console.log(
      "📚 Totale vragenbank:",
      sourceQuestions.length,
      "vragen"
    );
  }


  initializeDailyChallenge();

})();
