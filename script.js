/* ==========================================
   QUIZBALLON
   COMPLETE SPELLOGICA

   - 10 VRAGEN PER POTJE
   - 25 SECONDEN PER VRAAG
   - ANTWOORDCONTROLE
   - ZELDZAAMHEIDSPUNTEN
   - STIJGENDE LUCHTBALLON
   - VERSCHILLENDE LUCHTZONES
   - PLANETEN
   - PERSOONLIJK RECORD
========================================== */

(function () {
  "use strict";


  /* ========================================
     INSTELLINGEN
  ======================================== */

  const QUESTIONS_PER_GAME = 10;
  const SECONDS_PER_QUESTION = 25;

  /*
   * Iedere punt levert 2 spelkilometers op.
   *
   * Dit zijn fantasieafstanden.
   * Ze zijn niet astronomisch correct.
   */

  const KM_PER_POINT = 2;

  const MAX_POSSIBLE_HEIGHT =
    QUESTIONS_PER_GAME * 100 * KM_PER_POINT;

  const RECORD_KEY = "quizballon-record-v1";


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
     HULPFUNCTIES
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

     Bijvoorbeeld:

     "Kākāpō" wordt "kakapo"
     "Zuid-Afrika" wordt "zuid afrika"
     "  FLAMINGO " wordt "flamingo"
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
     SPELSCHERM TONEN
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
      behavior: "instant"
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

      /*
       * Sommige browsers blokkeren
       * localStorage.
       *
       * Het spel blijft gewoon werken.
       */

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

     De hoogtes zijn onderdeel van het spel.
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

     De ballon blijft goed zichtbaar,
     terwijl de omgeving verandert.
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
     PUNTEN EN HOOGTE TONEN
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

    if (secondsLeft <= 10 && secondsLeft > 5) {

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

     Met een echte eindtijd, zodat de timer
     ook correct blijft als je tabblad
     even op de achtergrond staat.
  ======================================== */

  function startTimer() {

    stopTimer();

    secondsLeft = SECONDS_PER_QUESTION;

    timerDeadline =
      Date.now() + SECONDS_PER_QUESTION * 1000;

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
     START VAN EEN NIEUW SPEL
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

    elements.balloonContainer.style.bottom = "";

    elements.balloonContainer.classList.remove(
      "rising"
    );

    showScreen("game");

    updateStats();

    showQuestion();

  }


  /* ========================================
     NIEUWE VRAAG TONEN
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

    elements.nextButton.textContent = "";

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
     ANTWOORD INDIENEN
  ======================================== */

  function submitAnswer(event) {

    event.preventDefault();

    if (!gameActive || answerLocked) {
      return;
    }

    /*
     * Controle op verlopen tijd.
     *
     * Zo kan een antwoord niet alsnog
     * goedgekeurd worden nadat de
     * 25 seconden voorbij zijn.
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

      handleCorrectAnswer(answer);

    } else {

      handleIncorrectAnswer();

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
     FOUT ANTWOORD
  ======================================== */

  function handleIncorrectAnswer() {

    if (answerLocked || !gameActive) {
      return;
    }

    answerLocked = true;

    stopTimer();

    showAnswerResult({
      correct: false,

      icon: "☁️",

      title: "NIET GOEDGEKEURD",

      description:
        "Dit antwoord staat niet in onze huidige " +
        "vragenlijst. Je krijgt deze ronde geen punten.",

      points: 0
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

    showAnswerResult({
      correct: false,

      icon: "⏱️",

      title: "DE TIJD IS OP!",

      description:
        "Je 25 seconden zijn voorbij. " +
        "Bij de volgende vraag krijg je een nieuwe kans.",

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
      result.correct ? "correct" : "incorrect"
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
      submitAnswer
    );

    elements.nextButton.addEventListener(
      "click",
      nextQuestion
    );

    window.addEventListener(
      "resize",
      updateBalloonPosition
    );

    /*
     * Als een speler terugkeert
     * naar het tabblad, controleren
     * we direct of de tijd om is.
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
     WEBSITE STARTEN
  ======================================== */

  function initializeQuizBallon() {

    loadRecord();

    initializeEvents();

    elements.world.className =
      "world zone-earth";

    updateWorld();

    showScreen("start");

    console.log(
      "🎈 QuizBallon is gestart!"
    );

  }


  initializeQuizBallon();

})();
