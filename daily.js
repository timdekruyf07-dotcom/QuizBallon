/* =====================================================
   QUIZBALLON
   DAILY CHALLENGE - VERSIE 1

   FUNCTIES:
   - IEDERE DAG 10 VRAGEN
   - VASTE VRAGENSELECTIE PER DAG
   - WISSEL OM 00.00 UUR NEDERLANDSE TIJD
   - AFTELLER TOT MIDDERNACHT
   - EEN VOLTOOIDE UITDAGING PER DAG
   - DAGRESULTAAT OPSLAAN
   - AUTOMATISCH VERNIEUWEN BIJ NIEUWE DAG

   BELANGRIJK:
   - WERKT OP GITHUB PAGES
   - GEEN DATABASE NODIG
   - GEBRUIKT DE BESTAANDE VRAGENBANK
   - SPELERS HEBBEN DEZELFDE 10 VRAGEN
     OP DEZELFDE DAG
   - VOLTOOIING WORDT PER APPARAAT BEWAARD
===================================================== */

(function () {
  "use strict";


  /* ===================================================
     1. INSTELLINGEN
  =================================================== */

  const TIME_ZONE = "Europe/Amsterdam";

  const QUESTIONS_PER_DAY = 10;

  const DAILY_STORAGE_KEY =
    "quizballon-daily-result-v1";

  const DAILY_SELECTION_SALT =
    "quizballon-v1-dagelijkse-vragen";

  const CLOCK_UPDATE_INTERVAL = 1000;


  /* ===================================================
     2. ELEMENTEN
  =================================================== */

  function byId(id) {
    return document.getElementById(id);
  }

  const elements = {

    startScreen: byId("start-screen"),

    gameScreen: byId("game-screen"),

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


  /* ===================================================
     3. STATUS
  =================================================== */

  let currentDayKey = "";

  let activeChallengeDay = null;

  let currentSelection = [];

  let completedResult = null;

  let lastEndScreenVisible = false;

  let countdownInterval = null;


  /* ===================================================
     4. NEDERLANDSE DATUM

     We gebruiken bewust Europe/Amsterdam.

     Zomertijd en wintertijd worden
     hierdoor automatisch meegenomen
     bij het bepalen van de kalenderdag.
  =================================================== */

  function getDutchDayKey(date = new Date()) {

    const formatter = new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: TIME_ZONE,

        year: "numeric",

        month: "2-digit",

        day: "2-digit"
      }
    );

    return formatter.format(date);

  }


  /* ===================================================
     5. NEDERLANDSE TIJD
  =================================================== */

  function getDutchTimeParts(date = new Date()) {

    const formatter = new Intl.DateTimeFormat(
      "nl-NL",
      {
        timeZone: TIME_ZONE,

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit",

        hourCycle: "h23"
      }
    );

    const parts = formatter.formatToParts(date);

    const values = {};

    parts.forEach(function (part) {

      if (
        part.type === "hour" ||
        part.type === "minute" ||
        part.type === "second"
      ) {

        values[part.type] = Number(part.value);

      }

    });

    return {

      hour: values.hour || 0,

      minute: values.minute || 0,

      second: values.second || 0

    };

  }


  /* ===================================================
     6. DATUM NETJES TONEN
  =================================================== */

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


  /* ===================================================
     7. AFTELLER TOT MIDDERNACHT

     We rekenen met de Nederlandse
     kloktijd.

     De datumcontrole bepaalt wanneer
     de uitdaging daadwerkelijk wisselt.
  =================================================== */

  function getCountdownToMidnight() {

    const now = getDutchTimeParts();

    const secondsToday =
      now.hour * 3600 +
      now.minute * 60 +
      now.second;

    const remaining = Math.max(
      0,
      86400 - secondsToday
    );

    const hours = Math.floor(
      remaining / 3600
    );

    const minutes = Math.floor(
      (remaining % 3600) / 60
    );

    const seconds = remaining % 60;

    return [
      hours,
      minutes,
      seconds
    ]
      .map(function (value) {
        return String(value).padStart(2, "0");
      })
      .join(":");

  }


  /* ===================================================
     8. VASTE SEED MAKEN

     Voor iedere dag gebruiken we een
     vaste rekenwaarde.

     Daardoor krijgen alle bezoekers
     dezelfde selectie voor die dag.

     We gebruiken geen Math.random()
     voor de dagelijkse selectie.
  =================================================== */

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


  /* ===================================================
     9. VASTE RANDOMFUNCTIE

     Deze functie geeft steeds dezelfde
     getallen bij dezelfde beginwaarde.

     Daarmee kunnen we de vragen per
     dag op een vaste manier schudden.
  =================================================== */

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


  /* ===================================================
     10. VRAGEN VAST SCHUDDEN
  =================================================== */

  function seededShuffle(array, seed) {

    const result = [...array];

    const random = seededRandom(seed);

    for (let i = result.length - 1; i > 0; i--) {

      const j = Math.floor(
        random() * (i + 1)
      );

      const temp = result[i];

      result[i] = result[j];

      result[j] = temp;

    }

    return result;

  }


  /* ===================================================
     11. VRAGENSELECTIE PER DAG

     We pakken 10 vragen uit de
     complete beschikbare vragenbank.

     Dezelfde datum levert steeds
     dezelfde selectie op.
  =================================================== */

  function selectDailyQuestions(
    allQuestions,
    dayKey
  ) {

    if (!Array.isArray(allQuestions)) {
      return [];
    }

    if (allQuestions.length < QUESTIONS_PER_DAY) {

      console.error(
        "QuizBallon: er zijn niet genoeg vragen."
      );

      return [];
    }

    const seed = stringToSeed(
      DAILY_SELECTION_SALT + "|" + dayKey
    );

    const shuffled = seededShuffle(
      allQuestions,
      seed
    );

    return shuffled.slice(
      0,
      QUESTIONS_PER_DAY
    );

  }


  /* ===================================================
     12. RESULTAAT LADEN

     De uitslag wordt lokaal opgeslagen.

     Daarmee weet de browser of je
     vandaag al hebt gespeeld.
  =================================================== */

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
        typeof result !== "object"
      ) {

        return null;

      }

      if (result.date !== currentDayKey) {
        return null;
      }

      if (
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


  /* ===================================================
     13. RESULTAAT OPSLAAN
  =================================================== */

  function saveDailyResult(result) {

    completedResult = result;

    try {

      localStorage.setItem(
        DAILY_STORAGE_KEY,
        JSON.stringify(result)
      );

    } catch (error) {

      /*
       * Als lokale opslag niet werkt,
       * blijft de uitslag beschikbaar
       * zolang deze pagina openstaat.
       */

      console.warn(
        "QuizBallon: resultaat kon niet worden opgeslagen."
      );

    }

  }


  /* ===================================================
     14. CONTROLE: VANDAAG VOLTOOID?
  =================================================== */

  function isDailyCompleted() {

    return Boolean(
      completedResult &&
      completedResult.date === currentDayKey
    );

  }


  /* ===================================================
     15. EXTRA DAILY STYLING

     Wordt automatisch aan de pagina
     toegevoegd.

     Je hoeft style.css niet te wijzigen.
  =================================================== */

  function addDailyStyles() {

    if (byId("quizballon-daily-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "quizballon-daily-styles";

    style.textContent = `

      /* ===================================
         DAILY CHALLENGE-KAART
      =================================== */

      .daily-card {
        width: min(100%, 560px);

        margin: 0 0 30px;
        padding: 23px;

        border: 1px solid
          rgba(255, 255, 255, .9);

        border-radius: 20px;

        background:
          rgba(255, 255, 255, .87);

        box-shadow:
          0 16px 40px
          rgba(36, 82, 143, .10);

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
        letter-spacing: .06em;
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
        letter-spacing: -.035em;
      }

      .daily-card p {
        margin: 0;

        color: #64728d;

        font-size: 13px;
        line-height: 1.7;
      }


      /* ===================================
         AFTELLER
      =================================== */

      .daily-countdown-row {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 15px;

        margin-top: 20px;
        padding-top: 18px;

        border-top:
          1px solid rgba(32, 53, 99, .1);
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


      /* ===================================
         VOLTOOIDE UITDAGING
      =================================== */

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

        transform: none;
      }


      /* ===================================
         MOBIEL
      =================================== */

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


  /* ===================================================
     16. STARTSCHERM BIJWERKEN

     Als de uitdaging nog openstaat:
     - Startknop beschikbaar.

     Als de uitdaging is voltooid:
     - Startknop uitgeschakeld.
     - Dagscore zichtbaar.
     - Afteller blijft lopen.
  =================================================== */

  function updateDailyHome() {

    if (elements.dailyDate) {

      elements.dailyDate.textContent =
        formatDutchDate();

    }

    if (elements.dailyCountdown) {

      elements.dailyCountdown.textContent =
        getCountdownToMidnight();

    }

    if (isDailyCompleted()) {

      elements.dailyStatus.textContent =
        "VOLTOOID ✓";

      elements.dailyStatus.classList.add(
        "completed"
      );

      elements.dailyDescription.textContent =
        "Je hebt de uitdaging van vandaag voltooid! " +
        "Je behaalde " +
        completedResult.score +
        " punten en bereikte " +
        completedResult.height +
        ". Morgen krijg je een nieuwe uitdaging.";

      elements.startButton.disabled = true;

      elements.startButton.textContent =
        "🎈 MORGEN WEER VLIEGEN";

      elements.restartButton.disabled = true;

      elements.restartButton.textContent =
        "MORGEN WEER SPELEN";

    } else {

      elements.dailyStatus.textContent =
        "BESCHIKBAAR";

      elements.dailyStatus.classList.remove(
        "completed"
      );

      elements.dailyDescription.textContent =
        "De 10 vragen van vandaag staan klaar. " +
        "Je hebt 25 seconden per vraag. " +
        "Hoe hoog kun jij vliegen?";

      elements.startButton.disabled = false;

      elements.startButton.replaceChildren();

      const text = document.createTextNode(
        "START DAILY CHALLENGE "
      );

      const arrow = document.createElement("span");

      arrow.textContent = "↗";

      elements.startButton.append(text, arrow);

      elements.restartButton.disabled = false;

    }

  }


  /* ===================================================
     17. EINDSCHERM BIJWERKEN
  =================================================== */

  function updateDailyEndScreen() {

    if (!elements.dailyEndMessage) {
      return;
    }

    if (isDailyCompleted()) {

      elements.dailyEndMessage.textContent =
        "📅 Dagelijkse uitdaging voltooid! " +
        "Je score is bewaard op dit apparaat. " +
        "De volgende uitdaging verschijnt " +
        "om 00.00 uur Nederlandse tijd.";

      elements.restartButton.disabled = true;

      elements.restartButton.textContent =
        "MORGEN WEER SPELEN";

    } else {

      elements.dailyEndMessage.textContent =
        "🎈 Je dagelijkse uitdaging is klaar!";

    }

  }


  /* ===================================================
     18. DAGSELECTIE INSTELLEN

     De bestaande script.js leest de
     vragen uit deze globale variabele:

     window.QUIZBALLON_EXPANDED_QUESTIONS

     Wij vervangen de volledige lijst
     door de 10 vragen van vandaag.

     Daardoor kan script.js verder
     ongewijzigd blijven werken.
  =================================================== */

  function applyDailySelection() {

    const originalQuestions =
      window.QUIZBALLON_EXPANDED_QUESTIONS;

    if (!Array.isArray(originalQuestions)) {

      console.error(
        "QuizBallon Daily: vragenbank ontbreekt."
      );

      return false;

    }

    currentDayKey = getDutchDayKey();

    currentSelection = selectDailyQuestions(
      originalQuestions,
      currentDayKey
    );

    if (
      currentSelection.length !==
      QUESTIONS_PER_DAY
    ) {

      console.error(
        "QuizBallon Daily: niet genoeg vragen."
      );

      return false;

    }

    /*
     * De game krijgt nu alleen de
     * geselecteerde vragen van vandaag.
     */

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      currentSelection;

    completedResult = loadDailyResult();

    console.log(
      "🎈 QuizBallon Daily Challenge",
      currentDayKey
    );

    console.log(
      "Aantal vragen vandaag:",
      currentSelection.length
    );

    return true;

  }


  /* ===================================================
     19. SPELSTART REGISTREREN

     Als iemand vandaag begint,
     onthouden we voor welke dag
     deze speelsessie bedoeld is.

     We gebruiken capture: true zodat
     de datum wordt geregistreerd
     voordat script.js het spel start.
  =================================================== */

  function registerGameStart() {

    if (isDailyCompleted()) {
      return;
    }

    activeChallengeDay = currentDayKey;

    lastEndScreenVisible = false;

  }


  /* ===================================================
     20. UITSLAG BEWAREN

     We hoeven de bestaande
     spelcode niet aan te passen.

     Zodra script.js het eindscherm
     zichtbaar maakt, lezen we de
     behaalde score en hoogte uit.
  =================================================== */

  function checkForCompletedGame() {

    const isEndScreenVisible =
      elements.endScreen.classList.contains(
        "active"
      );

    if (!isEndScreenVisible) {

      lastEndScreenVisible = false;

      return;

    }

    /*
     * Voorkom dubbel verwerken
     * van hetzelfde eindscherm.
     */

    if (lastEndScreenVisible) {
      return;
    }

    lastEndScreenVisible = true;

    /*
     * Alleen een daadwerkelijk
     * gestarte Daily Challenge telt.
     */

    if (!activeChallengeDay) {
      return;
    }

    /*
     * Een oude uitdaging mag niet
     * meetellen voor de nieuwe dag.
     */

    if (activeChallengeDay !== currentDayKey) {
      return;
    }

    if (isDailyCompleted()) {
      return;
    }

    /*
     * Score uit het eindscherm halen.
     */

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


  /* ===================================================
     21. EINDSCHERM IN DE GATEN HOUDEN

     Wanneer script.js de klasse
     "active" aan het eindscherm
     toevoegt, slaan we het
     resultaat automatisch op.
  =================================================== */

  function observeEndScreen() {

    const observer = new MutationObserver(
      function () {

        checkForCompletedGame();

      }
    );

    observer.observe(
      elements.endScreen,
      {
        attributes: true,

        attributeFilter: ["class"]
      }
    );

  }


  /* ===================================================
     22. AUTOMATISCH NIEUWE DAG HERKENNEN

     Iedere seconde controleren we
     de Nederlandse kalenderdatum.

     Zodra die verandert, laden we
     de pagina opnieuw.

     Daardoor:
     - wordt de nieuwe selectie geladen;
     - wordt de daglimiet vernieuwd;
     - begint de nieuwe Daily Challenge.

     Een spel dat precies om middernacht
     nog bezig is, wordt hierbij afgebroken.
  =================================================== */

  function checkForNewDay() {

    const actualDay = getDutchDayKey();

    if (actualDay !== currentDayKey) {

      console.log(
        "🌅 Nieuwe dag! Nieuwe QuizBallon Challenge."
      );

      window.location.reload();

      return;

    }

    if (elements.dailyCountdown) {

      elements.dailyCountdown.textContent =
        getCountdownToMidnight();

    }

  }


  /* ===================================================
     23. EVENTS INSTELLEN
  =================================================== */

  function initializeEvents() {

    /*
     * Registreer de startdatum
     * voordat de gewone startknop
     * het spel opent.
     */

    elements.startButton.addEventListener(
      "click",
      registerGameStart,
      true
    );

    /*
     * Alleen nuttig als de speler
     * een onvoltooide uitdaging
     * opnieuw begint.
     */

    elements.restartButton.addEventListener(
      "click",
      registerGameStart,
      true
    );

    /*
     * Als iemand vanaf het
     * eindscherm teruggaat, moet
     * de startstatus bijgewerkt zijn.
     */

    elements.homeButton.addEventListener(
      "click",
      function () {

        updateDailyHome();

      }
    );

    /*
     * Als de speler stopt voordat
     * alle vragen voltooid zijn,
     * mag diezelfde dag nog
     * een nieuwe poging starten.
     */

    const quitButton = byId("quit-button");

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

    /*
     * Wanneer de gebruiker terugkomt
     * naar het tabblad, controleren
     * we direct of het al een nieuwe
     * dag is.
     */

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


  /* ===================================================
     24. INITIALISEREN
  =================================================== */

  function initializeDailyChallenge() {

    /*
     * Controleer eerst of de
     * bestaande QuizBallon-code
     * goed geladen is.
     */

    if (
      !elements.startButton ||
      !elements.endScreen ||
      !elements.endScore
    ) {

      console.error(
        "QuizBallon Daily: vereiste HTML ontbreekt."
      );

      return;

    }

    /*
     * Nieuwe CSS toevoegen.
     */

    addDailyStyles();

    /*
     * De 10 vragen van vandaag
     * klaarzetten.
     */

    const selectionReady =
      applyDailySelection();

    if (!selectionReady) {

      elements.startButton.disabled = true;

      return;

    }

    /*
     * Resultaat en datum tonen.
     */

    updateDailyHome();

    updateDailyEndScreen();

    /*
     * Knoppen en eindscherm koppelen.
     */

    initializeEvents();

    observeEndScreen();

    /*
     * Iedere seconde:
     * - afteller bijwerken;
     * - controleren of een nieuwe
     *   dag begonnen is.
     */

    countdownInterval = setInterval(
      checkForNewDay,
      CLOCK_UPDATE_INTERVAL
    );

    console.log(
      "📅 Daily Challenge actief!"
    );

  }


  /* ===================================================
     25. START
  =================================================== */

  initializeDailyChallenge();

})();
