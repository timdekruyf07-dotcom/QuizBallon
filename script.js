/* ==========================================
   QUIZBALLON
   COMPLETE SPELLOGICA

   NIEUWE FUNCTIES:
   - ONBEPERKT OPNIEUW PROBEREN
   - TIMER LOOPT DOOR BIJ FOUT ANTWOORD
   - SLIMME TYPO-SUGGESTIES
   - SUGGESTIES BIJ ONVOLLEDIGE NAMEN
   - KLIKBARE ANTWOORDSUGGESTIES

   BESTAANDE FUNCTIES:
   - 10 VRAGEN PER POTJE
   - 25 SECONDEN PER VRAAG
   - ZELDZAAMHEIDSPUNTEN
   - STIJGENDE LUCHTBALLON
   - LUCHTZONES EN PLANETEN
   - PERSOONLIJK RECORD
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
     EXTRA ELEMENTEN VOOR SUGGESTIES

     Deze worden automatisch aangemaakt.
     Je hoeft index.html niet te veranderen.
  ======================================== */

  let feedbackElement = null;
  let feedbackText = null;
  let suggestionsElement = null;


  /* ========================================
     BASISFUNCTIES
  ======================================== */

  function formatNumber(number) {

    return new Intl.NumberFormat("nl-NL").format(number);

  }


  function formatHeight(height) {

    return formatNumber(Math.round(height)) + " km";

  }


  function randomNumber(max) {

    return Math.floor(Math.random() * max);

  }


  function prefersReducedMotion() {

    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  }


  /* ========================================
     ANTWOORDEN NORMALISEREN

     Voorbeelden:

     Kākāpō       -> kakapo
     FLAMINGO     -> flamingo
     Zuid-Afrika  -> zuid afrika
     "  Toekan "  -> toekan
  ======================================== */

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


  /* ========================================
     VRAGEN DOOR ELKAAR SCHUDDEN
  ======================================== */

  function shuffleArray(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

      const j = randomNumber(i + 1);

      const temp = result[i];

      result[i] = result[j];

      result[j] = temp;

    }

    return result;

  }


  /* ========================================
     SCHERM TONEN
  ======================================== */

  function showScreen(screenName) {

    const screens = [
      elements.startScreen,
      elements.gameScreen,
      elements.endScreen
    ];

    screens.forEach(function (screen) {

      screen.classList.remove("active");

    });

    if (screenName === "start") {

      elements.startScreen.classList.add("active");

    }

    if (screenName === "game") {

      elements.gameScreen.classList.add("active");

    }

    if (screenName === "end") {

      elements.endScreen.classList.add("active");

    }

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

  }


  /* ========================================
     RECORD LADEN
  ======================================== */

  function loadRecord() {

    try {

      const saved = localStorage.getItem(RECORD_KEY);

      const value = Number(saved);

      if (Number.isFinite(value) && value >= 0) {

        personalRecord = value;

      } else {

        personalRecord = 0;

      }

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

      // Het spel blijft werken zonder localStorage.

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
     HUIDIGE ZONE
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
     LUCHTBALLONPOSITIE
  ======================================== */

  function updateBalloonPosition() {

    const isMobile = window.innerWidth <= 760;

    const progress = Math.min(
      totalHeight / MAX_POSSIBLE_HEIGHT,
      1
    );

    let bottom;

    if (isMobile) {

      bottom = 12 + progress * 18;

    } else {

      bottom = 22 + progress * 25;

    }

    elements.balloonContainer.style.bottom =
      bottom + "%";

  }


  /* ========================================
     STATISTIEKEN
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
     STIJGANIMATIE
  ======================================== */

  function animateBalloon() {

    if (risingTimeout !== null) {

      clearTimeout(risingTimeout);

    }

    elements.balloonContainer.classList.add(
      "rising"
    );

    if (!prefersReducedMotion()) {

      createFlightParticles();

    }

    risingTimeout = setTimeout(function () {

      elements.balloonContainer.classList.remove(
        "rising"
      );

      risingTimeout = null;

    }, 1400);

  }


  /* ========================================
     VLIEGDEELTJES
  ======================================== */

  function createFlightParticles() {

    const balloonRect =
      elements.balloonContainer.getBoundingClientRect();

    for (let i = 0; i < 12; i++) {

      const particle = document.createElement("span");

      particle.className = "flight-particle";

      const x =
        balloonRect.left +
        balloonRect.width * .5 +
        (Math.random() - .5) * 110;

      const y =
        balloonRect.top +
        balloonRect.height * .65 +
        (Math.random() - .5) * 90;

      particle.style.left = x + "px";
      particle.style.top = y + "px";

      elements.particles.appendChild(particle);

      setTimeout(function () {

        particle.remove();

      }, 1300);

    }

  }


  /* ========================================
     SLIMME SUGGESTIES - CSS

     Wordt automatisch aan de pagina
     toegevoegd door JavaScript.
  ======================================== */

  function addSuggestionStyles() {

    if (byId("quizballon-suggestion-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "quizballon-suggestion-styles";

    style.textContent = `

      /* ===================================
         FOUT ANTWOORD MELDING
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
         SUGGESTIES
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
        line-height: 1.5;
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

        background: #ffffff;
        color: #315ce0;

        font-size: 13px;
        font-weight: 800;
        text-align: left;

        cursor: pointer;

        transition:
          background .2s ease,
          border-color .2s ease;
      }

      .qb-suggestion-button:hover {
        background: #edf2ff;
        border-color: #7e9ef3;
      }

      .qb-suggestion-button:focus-visible {
        outline: 3px solid #ffce52;
        outline-offset: 3px;
      }

      .qb-suggestion-arrow {
        flex-shrink: 0;
        font-size: 18px;
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

      }

    `;

    document.head.appendChild(style);

  }


  /* ========================================
     MELDINGEN AANMAKEN
  ======================================== */

  function createFeedbackElements() {

    addSuggestionStyles();

    feedbackElement = document.createElement("div");

    feedbackElement.className = "qb-feedback";

    feedbackElement.id = "qb-feedback";

    feedbackElement.hidden = true;

    feedbackElement.setAttribute(
      "role",
      "status"
    );

    feedbackText = document.createElement("p");

    feedbackText.className = "qb-feedback-text";

    suggestionsElement = document.createElement("div");

    suggestionsElement.className = "qb-suggestions";

    feedbackElement.appendChild(feedbackText);

    feedbackElement.appendChild(suggestionsElement);

    elements.answerForm.insertAdjacentElement(
      "afterend",
      feedbackElement
    );

  }


  /* ========================================
     MELDING VERBERGEN
  ======================================== */

  function hideFeedback() {

    if (!feedbackElement) {
      return;
    }

    feedbackElement.hidden = true;

    feedbackText.textContent = "";

    suggestionsElement.replaceChildren();

  }


  /* ========================================
     LETTERVERSCHIL BEREKENEN

     Voorbeeld:

     flamingp -> flamingo
     Verschil: 1

     We gebruiken Levenshtein-afstand.

     Daardoor herkennen we:
     - 1 verkeerde letter
     - 1 ontbrekende letter
     - 1 extra letter
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

    const previous = [];

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

      for (let j = 0; j <= second.length; j++) {

        previous[j] = current[j];

      }

    }

    return previous[second.length];

  }


  /* ========================================
     ONVOLLEDIGE NAAM HERKENNEN

     Voorbeeld:

     neushoorn
     neushoornvogel

     Omdat 'neushoorn' het begin vormt
     van 'neushoornvogel', kan het spel
     die vogel als suggestie geven.

     Om niet te snel antwoorden weg
     te geven, geldt dit alleen vanaf
     minimaal vijf letters.
  ======================================== */

  function getSuggestionDistance(input, candidate) {

    if (input === candidate) {
      return -1;
    }

    const difference =
      Math.abs(input.length - candidate.length);

    /*
     * Eén letter verschil:
     * typefout, extra letter of
     * ontbrekende letter.
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

        return 1;

      }

    }

    /*
     * Begin van een langer woord.
     *
     * Bijvoorbeeld:
     * neushoorn -> neushoornvogel
     */

    if (
      input.length >= 5 &&
      candidate.startsWith(input) &&
      input.length >= candidate.length * .6
    ) {

      return 2;

    }

    return -1;

  }


  /* ========================================
     SUGGESTIES ZOEKEN

     We doorzoeken alleen de antwoorden
     die geldig zijn bij de huidige vraag.

     Maximaal 3 suggesties.
  ======================================== */

  function findSuggestions(question, userAnswer) {

    const input = normalizeAnswer(userAnswer);

    if (input.length < 4) {
      return [];
    }

    const suggestions = [];

    const seenAnswers = new Set();

    question.answers.forEach(function (item) {

      const possibleNames = [
        item.answer,
        ...(item.aliases || [])
      ];

      let bestMatch = Infinity;

      possibleNames.forEach(function (name) {

        const candidate = normalizeAnswer(name);

        const match = getSuggestionDistance(
          input,
          candidate
        );

        if (
          match >= 0 &&
          match < bestMatch
        ) {

          bestMatch = match;

        }

      });

      if (bestMatch === Infinity) {
        return;
      }

      const key = normalizeAnswer(item.answer);

      if (seenAnswers.has(key)) {
        return;
      }

      seenAnswers.add(key);

      suggestions.push({

        answer: item.answer,

        matchScore: bestMatch,

        points: item.points

      });

    });

    /*
     * Eerst typefouten.
     * Daarna onvolledige namen.
     */

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

      button.setAttribute(
        "aria-label",
        "Probeer " + suggestion.answer
      );

      const name = document.createElement("span");

      name.textContent = suggestion.answer;

      const arrow = document.createElement("span");

      arrow.className = "qb-suggestion-arrow";

      arrow.textContent = "→";

      button.append(name, arrow);

      /*
       * Klik op een suggestie.
       *
       * Het antwoord wordt ingevuld
       * én direct gecontroleerd.
       */

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
     FOUT ANTWOORD MELDEN

     BELANGRIJK:

     - De vraag stopt NIET.
     - De timer stopt NIET.
     - Het antwoordveld blijft open.
     - De speler mag opnieuw proberen.
  ======================================== */

  function showIncorrectFeedback(userAnswer) {

    if (!feedbackElement) {
      return;
    }

    const question =
      questions[currentQuestionIndex];

    const suggestions = findSuggestions(
      question,
      userAnswer
    );

    feedbackElement.hidden = false;

    if (suggestions.length > 0) {

      feedbackText.textContent =
        "Dit antwoord is nog niet goedgekeurd. " +
        "Misschien heb je een andere naam bedoeld. " +
        "Je mag opnieuw proberen zolang de tijd loopt!";

    } else {

      feedbackText.textContent =
        "❌ Dit antwoord wordt niet herkend. " +
        "Probeer gerust iets anders! " +
        "De timer loopt gewoon door.";

    }

    showSuggestions(suggestions);

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
     TIMER WEERGEVEN
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

      if (secondsLeft <= 0) {

        handleTimeUp();

      }

    }, 100);

  }


  /* ========================================
     ANTWOORD CONTROLEREN

     Exacte schrijfwijze is niet nodig.

     Hoofdletters, accenten en kleine
     schrijfverschillen zoals streepjes
     worden automatisch genegeerd.

     Echte typefouten worden niet zomaar
     goedgekeurd; daarvoor geven we
     suggesties.
  ======================================== */

  function checkAnswer(question, userAnswer) {

    const normalizedInput =
      normalizeAnswer(userAnswer);

    if (!normalizedInput) {
      return null;
    }

    for (const item of question.answers) {

      const possibleAnswers = [
        item.answer,
        ...(item.aliases || [])
      ];

      const found = possibleAnswers.some(
        function (possibleAnswer) {

          return normalizeAnswer(possibleAnswer) ===
            normalizedInput;

        }
      );

      if (found) {
        return item;
      }

    }

    return null;

  }


  /* ========================================
     NIEUW SPEL STARTEN
  ======================================== */

  function startGame() {

    if (
      !Array.isArray(window.QUIZ_QUESTIONS) ||
      window.QUIZ_QUESTIONS.length < QUESTIONS_PER_GAME
    ) {

      alert(
        "De vragenbank kon niet worden geladen. " +
        "Controleer of vragen.js goed is opgeslagen."
      );

      return;

    }

    stopTimer();

    if (risingTimeout !== null) {

      clearTimeout(risingTimeout);

      risingTimeout = null;

    }

    questions = shuffleArray(
      window.QUIZ_QUESTIONS
    ).slice(0, QUESTIONS_PER_GAME);

    currentQuestionIndex = 0;

    totalScore = 0;
    totalHeight = 0;

    correctAnswers = 0;

    answerLocked = false;
    gameActive = true;

    elements.progressFill.style.width = "0%";

    elements.balloonContainer.classList.remove(
      "rising"
    );

    hideFeedback();

    showScreen("game");

    updateStats();

    showQuestion();

  }


  /* ========================================
     NIEUWE VRAAG
  ======================================== */

  function showQuestion() {

    if (!gameActive) {
      return;
    }

    if (
      currentQuestionIndex >=
      questions.length
    ) {

      endGame();
      return;

    }

    const question =
      questions[currentQuestionIndex];

    answerLocked = false;

    elements.questionNumber.textContent =
      String(currentQuestionIndex + 1);

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
      "incorrect"
    );

    hideFeedback();

    elements.nextButton.replaceChildren();

    const nextText = document.createTextNode(
      currentQuestionIndex === questions.length - 1
        ? "BEKIJK JE RESULTAAT "
        : "VOLGENDE VRAAG "
    );

    const arrow = document.createElement("span");

    arrow.textContent = "→";

    elements.nextButton.append(nextText, arrow);

    updateStats();

    startTimer();

  }


  /* ========================================
     ANTWOORD VERWERKEN

     Dit is de belangrijkste wijziging.

     Bij een fout antwoord wordt alleen
     een melding getoond.

     De speler blijft bij dezelfde vraag
     en kan opnieuw proberen.
  ======================================== */

  function processAnswer() {

    if (!gameActive || answerLocked) {
      return;
    }

    /*
     * Controleer eerst of de tijd
     * ondertussen voorbij is.
     */

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

      /*
       * Goed antwoord.
       *
       * De vraag is nu klaar.
       */

      hideFeedback();

      handleCorrectAnswer(answer);

    } else {

      /*
       * Fout of onbekend antwoord.
       *
       * NIET:
       * - Timer stoppen
       * - Vraag afsluiten
       * - Antwoordveld uitschakelen
       *
       * WEL:
       * - Melding tonen
       * - Suggesties zoeken
       * - Opnieuw proberen toestaan
       */

      showIncorrectFeedback(userAnswer);

      elements.answerInput.focus();

      elements.answerInput.select();

    }

  }


  /* ========================================
     FORMULIER INDIENEN
  ======================================== */

  function submitAnswer(event) {

    event.preventDefault();

    processAnswer();

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

    const points = answer.points;

    const gainedHeight =
      points * KM_PER_POINT;

    totalScore += points;

    totalHeight += gainedHeight;

    correctAnswers++;

    updateStats();

    animateBalloon();

    showAnswerResult({

      correct: true,

      icon: points >= 80
        ? "🚀"
        : points >= 50
          ? "🌟"
          : "🎈",

      title: points >= 80
        ? "ONGELOOFLIJK ZELDZAAM!"
        : points >= 50
          ? "HEEL STERK ANTWOORD!"
          : "GOED ANTWOORD!",

      description:
        answer.answer +
        " is goedgekeurd. Je stijgt " +
        formatHeight(gainedHeight) +
        "!",

      points: points

    });

  }


  /* ========================================
     TIJD OP

     Dit is het enige moment waarop
     een foutieve beurt definitief
     wordt afgesloten.
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

      icon: "⏱️",

      title: "DE TIJD IS OP!",

      description:
        "Je 25 seconden zijn voorbij. " +
        "Bij de volgende vraag krijg je " +
        "een nieuwe kans.",

      points: 0

    });

  }


  /* ========================================
     RESULTAAT TONEN
  ======================================== */

  function showAnswerResult(result) {

    elements.answerInput.disabled = true;

    elements.answerButton.disabled = true;

    elements.answerForm.hidden = true;

    elements.answerResult.hidden = false;

    elements.answerResult.classList.remove(
      "correct",
      "incorrect"
    );

    elements.answerResult.classList.add(
      result.correct
        ? "correct"
        : "incorrect"
    );

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

    if (
      currentQuestionIndex >=
      questions.length
    ) {

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

    currentQuestionIndex = 0;

    totalScore = 0;
    totalHeight = 0;

    correctAnswers = 0;

    hideFeedback();

    elements.progressFill.style.width = "0%";

    elements.balloonContainer.classList.remove(
      "rising"
    );

    updateWorld();

    elements.balloonContainer.style.bottom = "";

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
      "Weet je zeker dat je deze vlucht " +
      "wilt stoppen? Je huidige score " +
      "wordt niet opgeslagen."
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
      submitAnswer
    );

    elements.nextButton.addEventListener(
      "click",
      nextQuestion
    );

    /*
     * Zodra iemand opnieuw begint
     * te typen, verdwijnt de oude
     * foutmelding.
     */

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

    /*
     * Controleer de eindtijd opnieuw
     * wanneer iemand terugkomt naar
     * het tabblad.
     */

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

    createFeedbackElements();

    initializeEvents();

    elements.world.className =
      "world zone-earth";

    updateWorld();

    showScreen("start");

    console.log(
      "🎈 QuizBallon gestart met slimme suggesties!"
    );

  }


  initializeQuizBallon();

})();
