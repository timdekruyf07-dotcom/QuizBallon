/* =====================================================
   QUIZBALLON
   RESULTATENOVERZICHT - VERSIE 2

   VERBETERD:
   - EIGEN ANTWOORDEN BETROUWBAAR OPSLAAN
   - PUNTEN PER VRAAG ONTHOUDEN
   - OPSLAAN VOORDAT DE VOLGENDE VRAAG START
   - RESULTATEN BEWAREN NA VERNIEUWEN
   - OOK TIME-OUTS REGISTREREN
   - ANTWOORDEN NA AFLOOP BEKIJKEN

   BEHOUDEN:
   - UITKLAPBARE VRAGEN
   - ZOEKFUNCTIE
   - SCORES VAN HOOG NAAR LAAG
   - RAKETANTWOORDEN
   - DAILY CHALLENGE
   - ALLE BESTAANDE VRAGEN

   ANDERE BESTANDEN HOEVEN NIET
   AANGEPAST TE WORDEN.
===================================================== */

(function () {
  "use strict";


  /* ========================================
     INSTELLINGEN
  ======================================== */

  const TIME_ZONE = "Europe/Amsterdam";

  const DAILY_RESULT_KEY =
    "quizballon-daily-result-v1";

  const REVIEW_STORAGE_PREFIX =
    "quizballon-review-v2-";

  const QUESTIONS_PER_GAME = 10;


  /* ========================================
     HTML-ELEMENTEN
  ======================================== */

  function byId(id) {
    return document.getElementById(id);
  }

  const elements = {

    startButton: byId("start-button"),

    nextButton: byId("next-button"),

    startScreen: byId("start-screen"),

    gameScreen: byId("game-screen"),

    endScreen: byId("end-screen"),

    homeSlot: byId("results-home-slot"),

    endSlot: byId("results-end-slot"),

    answerResult: byId("answer-result"),

    answerInput: byId("answer-input"),

    questionText: byId("question-text"),

    questionNumber: byId("question-number"),

    resultPoints: byId("result-points"),

    resultDescription: byId("result-description")

  };


  /* ========================================
     SPELSTATUS
  ======================================== */

  let roundAnswers = [];

  let gameStarted = false;

  let completedThisSession = false;

  let lastRecordedQuestion = 0;


  /* ========================================
     NEDERLANDSE DATUM
  ======================================== */

  function getTodayKey() {

    return new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: TIME_ZONE,

        year: "numeric",

        month: "2-digit",

        day: "2-digit"
      }
    ).format(new Date());

  }


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
     HTML-ELEMENT MAKEN
  ======================================== */

  function makeElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;

  }


  /* ========================================
     VRAGEN VAN VANDAAG OPHALEN
  ======================================== */

  function getDailyQuestions() {

    const questions =
      window.QUIZBALLON_EXPANDED_QUESTIONS;

    return Array.isArray(questions)
      ? questions
      : [];

  }


  /* ========================================
     DAILY CHALLENGE STATUS
  ======================================== */

  function getDailyCompletion() {

    try {

      const saved = localStorage.getItem(
        DAILY_RESULT_KEY
      );

      if (!saved) {
        return null;
      }

      const result = JSON.parse(saved);

      if (
        !result ||
        result.date !== getTodayKey()
      ) {
        return null;
      }

      return result;

    } catch (error) {

      return null;

    }

  }


  function isChallengeCompleted() {

    return Boolean(
      completedThisSession ||
      getDailyCompletion()
    );

  }


  /* ========================================
     OPSLAGLOCATIE
  ======================================== */

  function getReviewStorageKey() {

    return REVIEW_STORAGE_PREFIX +
      getTodayKey();

  }


  /* ========================================
     ANTWOORDEN OPSLAAN

     BELANGRIJKE VERBETERING:

     We slaan voortaan IEDERE vraag
     meteen op zodra de speler klaar is.

     Daardoor kunnen antwoorden niet
     zomaar verdwijnen wanneer de
     volgende vraag wordt geopend.
  ======================================== */

  function saveRoundAnswers() {

    const data = {

      date: getTodayKey(),

      version: 2,

      answers: roundAnswers.map(
        function (item) {

          return {

            number: item.number,

            question: item.question,

            answer: item.answer,

            points: item.points,

            correct: item.correct

          };

        }
      )

    };

    try {

      localStorage.setItem(
        getReviewStorageKey(),
        JSON.stringify(data)
      );

    } catch (error) {

      console.warn(
        "QuizBallon: antwoorden konden niet worden opgeslagen."
      );

    }

  }


  /* ========================================
     OPGESLAGEN ANTWOORDEN LADEN
  ======================================== */

  function loadSavedAnswers() {

    try {

      const saved = localStorage.getItem(
        getReviewStorageKey()
      );

      if (!saved) {
        return null;
      }

      const data = JSON.parse(saved);

      if (
        !data ||
        data.date !== getTodayKey() ||
        !Array.isArray(data.answers)
      ) {
        return null;
      }

      return data.answers;

    } catch (error) {

      return null;

    }

  }


  /* ========================================
     REGISTREREN DAT EEN NIEUW
     SPEL WORDT GESTART
  ======================================== */

  function registerGameStart() {

    /*
     * Een voltooide Daily Challenge
     * wordt niet opnieuw gestart.
     */

    if (isChallengeCompleted()) {
      return;
    }

    gameStarted = true;

    completedThisSession = false;

    roundAnswers = [];

    lastRecordedQuestion = 0;

    /*
     * Eventuele oude, onvoltooide
     * gegevens vervangen we door
     * de nieuwe speelsessie.
     */

    saveRoundAnswers();

  }


  /* ========================================
     PUNTEN VAN HET RESULTAAT LEZEN
  ======================================== */

  function getDisplayedPoints() {

    const text =
      elements.resultPoints.textContent.trim();

    const number = Number(
      text.replace(/[^\d]/g, "")
    );

    return Number.isFinite(number)
      ? number
      : 0;

  }


  /* ========================================
     EIGEN ANTWOORD REGISTREREN

     We lezen:
     - Vraagnummer
     - Vraagtekst
     - Ingevuld antwoord
     - Behaalde punten
     - Goed / fout

     Het antwoord wordt opgeslagen
     terwijl het nog in het invoerveld
     aanwezig is.
  ======================================== */

  function captureQuestionResult() {

    if (!gameStarted) {
      return;
    }

    if (
      !elements.gameScreen.classList.contains(
        "active"
      )
    ) {
      return;
    }

    if (elements.answerResult.hidden) {
      return;
    }

    const number = Number(
      elements.questionNumber.textContent
    );

    if (
      !Number.isInteger(number) ||
      number < 1 ||
      number > QUESTIONS_PER_GAME
    ) {
      return;
    }

    /*
     * Dezelfde vraag niet twee
     * keer registreren.
     */

    if (number === lastRecordedQuestion) {
      return;
    }

    const question =
      elements.questionText.textContent.trim();

    const answer =
      elements.answerInput.value.trim();

    const points =
      getDisplayedPoints();

    const correct =
      elements.answerResult.classList.contains(
        "correct"
      );

    const result = {

      number: number,

      question: question,

      answer: answer,

      points: points,

      correct: correct

    };

    /*
     * Als een vraag al bestaat,
     * vervangen we de gegevens.
     */

    const existingIndex =
      roundAnswers.findIndex(
        function (item) {

          return item.number === number;

        }
      );

    if (existingIndex >= 0) {

      roundAnswers[existingIndex] = result;

    } else {

      roundAnswers.push(result);

    }

    lastRecordedQuestion = number;

    /*
     * Meteen opslaan.
     *
     * We wachten dus niet meer
     * tot het eindscherm.
     */

    saveRoundAnswers();

    console.log(
      "🎈 Antwoord opgeslagen:",
      result
    );

  }


  /* ========================================
     EXTRA VEILIGHEID:

     ANTWOORD OPSLAAN WANNEER
     DE SPELER OP VOLGENDE KLIKT

     Dit gebeurt voordat script.js
     de volgende vraag opent.
  ======================================== */

  function captureBeforeNextQuestion() {

    captureQuestionResult();

  }


  /* ========================================
     RESULTAATKAART OBSERVEREN

     Zodra de resultaatkaart verschijnt,
     proberen we het antwoord op te slaan.

     We gebruiken daarnaast de knop
     'Volgende vraag' als extra controle.
  ======================================== */

  function observeQuestionResults() {

    const observer = new MutationObserver(
      function () {

        captureQuestionResult();

      }
    );

    observer.observe(
      elements.answerResult,
      {
        attributes: true,

        attributeFilter: [
          "hidden"
        ]
      }
    );

  }


  /* ========================================
     ANTWOORDEN VAN DE SPELER
     KOPPELEN AAN DE VRAGEN

     We zoeken op de exacte vraagtekst,
     zodat de volgorde ook klopt
     wanneer vragen geschud worden.
  ======================================== */

  function getReviewQuestions() {

    const available =
      getDailyQuestions();

    let recorded =
      loadSavedAnswers();

    /*
     * Als lokale opslag niet werkt,
     * kunnen we de antwoorden van
     * deze speelsessie nog gebruiken.
     */

    if (
      (!recorded || recorded.length === 0) &&
      roundAnswers.length > 0
    ) {

      recorded = roundAnswers;

    }

    if (
      !Array.isArray(recorded) ||
      recorded.length === 0
    ) {

      return available.map(
        function (question) {

          return {
            question: question,
            player: null
          };

        }
      );

    }

    const ordered = [...recorded].sort(
      function (a, b) {

        return a.number - b.number;

      }
    );

    const result = [];

    const usedQuestions = new Set();

    ordered.forEach(function (item) {

      const question = available.find(
        function (candidate) {

          return (
            candidate.question === item.question
          );

        }
      );

      if (!question) {
        return;
      }

      if (usedQuestions.has(question.question)) {
        return;
      }

      usedQuestions.add(question.question);

      result.push({

        question: question,

        player: item

      });

    });

    /*
     * Mochten er vragen ontbreken,
     * dan tonen we die alsnog.
     */

    available.forEach(function (question) {

      if (usedQuestions.has(question.question)) {
        return;
      }

      result.push({

        question: question,

        player: null

      });

    });

    return result;

  }


  /* ========================================
     ANTWOORDEN SORTEREN

     Hoogste punten eerst.
  ======================================== */

  function getSortedAnswers(question) {

    return [...question.answers].sort(
      function (a, b) {

        const pointsA =
          Number(a.points) || 0;

        const pointsB =
          Number(b.points) || 0;

        if (pointsB !== pointsA) {

          return pointsB - pointsA;

        }

        return a.answer.localeCompare(
          b.answer,
          "nl"
        );

      }
    );

  }


  /* ========================================
     EIGEN ANTWOORD TONEN

     NIEUW:
     Het daadwerkelijke ingevulde
     antwoord wordt getoond.

     Bijvoorbeeld:
     Zeeleeuw          +55 punten

     Bij tijd op:
     Geen antwoord     +0 punten
  ======================================== */

  function makeYourAnswer(player) {

    const isCorrect = Boolean(
      player && player.correct
    );

    const wrapper = makeElement(
      "div",
      "results-your-answer" +
      (isCorrect ? "" : " failed")
    );

    const label = makeElement(
      "span",
      "results-your-label",
      "JOUW ANTWOORD"
    );

    const row = makeElement(
      "div",
      "results-your-row"
    );

    let answerText = "Niet beschikbaar";

    let pointsText = "—";

    if (player) {

      pointsText =
        "+" + player.points + " punten";

      if (isCorrect) {

        answerText =
          player.answer || "Goed antwoord";

      } else if (player.answer) {

        answerText =
          player.answer + " (niet goedgekeurd)";

      } else {

        answerText = "Geen antwoord";

      }

    }

    const answerName = makeElement(
      "span",
      "results-your-name",
      answerText
    );

    const points = makeElement(
      "strong",
      "results-your-score",
      pointsText
    );

    row.append(
      answerName,
      points
    );

    wrapper.append(
      label,
      row
    );

    return wrapper;

  }


  /* ========================================
     ANTWOORDRIJ MAKEN
  ======================================== */

  function makeAnswerRow(answer, player) {

    const isRocket =
      answer.isRocket === true ||
      Number(answer.points) === 100;

    const isYourAnswer = Boolean(
      player &&
      player.correct &&
      (
        normalize(player.answer) ===
        normalize(answer.answer) ||

        (answer.aliases || []).some(
          function (alias) {

            return normalize(alias) ===
              normalize(player.answer);

          }
        )
      )
    );

    const row = makeElement(
      "div",
      "results-answer-row" +
      (isRocket ? " is-rocket" : "") +
      (isYourAnswer ? " is-your-answer" : "")
    );

    const name = makeElement(
      "span",
      "results-answer-name",
      (isRocket ? "🚀 " : "") +
      answer.answer +
      (isYourAnswer ? " · jouw antwoord" : "")
    );

    const points = makeElement(
      "span",
      "results-answer-points",
      Number(answer.points) + " punten"
    );

    row.append(
      name,
      points
    );

    return row;

  }


  /* ========================================
     ANTWOORDEN DOORZOEKEN
  ======================================== */

  function updateAnswerList(
    question,
    player,
    searchInput,
    answerList,
    countElement
  ) {

    const search =
      normalize(searchInput.value);

    const answers =
      getSortedAnswers(question);

    const matching = answers.filter(
      function (answer) {

        if (!search) {
          return true;
        }

        const names = [
          answer.answer,
          ...(answer.aliases || [])
        ];

        return names.some(
          function (name) {

            return normalize(name).includes(
              search
            );

          }
        );

      }
    );

    countElement.textContent =
      matching.length +
      " van " +
      answers.length +
      " antwoorden";

    answerList.replaceChildren();

    if (matching.length === 0) {

      answerList.appendChild(
        makeElement(
          "p",
          "results-no-matches",
          "🔍 Geen antwoorden gevonden."
        )
      );

      return;

    }

    const fragment =
      document.createDocumentFragment();

    matching.forEach(
      function (answer) {

        fragment.appendChild(
          makeAnswerRow(
            answer,
            player
          )
        );

      }
    );

    answerList.appendChild(fragment);

  }


  /* ========================================
     UITKLAPBARE VRAAG
  ======================================== */

  function makeQuestionAccordion(entry, number) {

    const question = entry.question;

    const player = entry.player;

    const details = makeElement(
      "details",
      "results-question"
    );

    const summary = makeElement(
      "summary",
      "results-question-summary"
    );

    const numberElement = makeElement(
      "span",
      "results-question-number",
      String(number)
    );

    const textWrapper = makeElement(
      "span",
      "results-question-summary-text"
    );

    const category = makeElement(
      "span",
      "results-question-category",
      question.category
    );

    const title = makeElement(
      "span",
      "results-question-title",
      question.question
    );

    textWrapper.append(
      category,
      title
    );

    const chevron = makeElement(
      "span",
      "results-question-chevron",
      "⌄"
    );

    chevron.setAttribute(
      "aria-hidden",
      "true"
    );

    summary.append(
      numberElement,
      textWrapper,
      chevron
    );

    const body = makeElement(
      "div",
      "results-question-body"
    );

    /*
     * HIER KOMT HET EIGEN ANTWOORD
     * MET DE BIJBEHORENDE PUNTEN.
     */

    body.appendChild(
      makeYourAnswer(player)
    );

    const searchLabel = makeElement(
      "label",
      "results-search-label",
      "🔍 ZOEK EEN ANTWOORD"
    );

    const searchInput = makeElement(
      "input",
      "results-search"
    );

    const inputId =
      "results-search-" +
      number +
      "-" +
      Math.random().toString(36).slice(2, 8);

    searchInput.id = inputId;

    searchInput.type = "search";

    searchInput.placeholder =
      "Zoek een antwoord...";

    searchInput.autocomplete = "off";

    searchInput.setAttribute(
      "aria-label",
      "Zoek bij vraag " + number
    );

    searchLabel.htmlFor = inputId;

    const countElement = makeElement(
      "p",
      "results-search-count"
    );

    countElement.setAttribute(
      "aria-live",
      "polite"
    );

    const answerList = makeElement(
      "div",
      "results-answer-list"
    );

    body.append(
      searchLabel,
      searchInput,
      countElement,
      answerList
    );

    details.append(
      summary,
      body
    );

    /*
     * Pas antwoorden tonen als
     * de vraag wordt uitgeklapt.
     */

    let loaded = false;

    details.addEventListener(
      "toggle",
      function () {

        if (!details.open || loaded) {
          return;
        }

        loaded = true;

        updateAnswerList(
          question,
          player,
          searchInput,
          answerList,
          countElement
        );

      }
    );

    searchInput.addEventListener(
      "input",
      function () {

        updateAnswerList(
          question,
          player,
          searchInput,
          answerList,
          countElement
        );

      }
    );

    return details;

  }


  /* ========================================
     COMPLEET OVERZICHT
  ======================================== */

  function createResultsPanel() {

    const panel = makeElement(
      "section",
      "results-panel"
    );

    const heading = makeElement(
      "div",
      "results-panel-heading"
    );

    const eyebrow = makeElement(
      "span",
      "results-panel-eyebrow",
      "🏆 JOUW DAGELIJKSE VLUCHT"
    );

    const title = makeElement(
      "h3",
      "",
      "Alle antwoorden bekijken"
    );

    const description = makeElement(
      "p",
      "",
      "Bekijk jouw antwoorden en punten. " +
      "Klap een vraag open om alle bekende " +
      "geldige antwoorden te bekijken, " +
      "van hoog naar laag."
    );

    heading.append(
      eyebrow,
      title,
      description
    );

    panel.appendChild(heading);

    const list = makeElement(
      "div",
      "results-questions"
    );

    const questions =
      getReviewQuestions();

    questions.forEach(
      function (entry, index) {

        list.appendChild(
          makeQuestionAccordion(
            entry,
            index + 1
          )
        );

      }
    );

    panel.appendChild(list);

    return panel;

  }


  /* ========================================
     KNOP OP STARTSCHERM
  ======================================== */

  function updateHomeResults() {

    if (!elements.homeSlot) {
      return;
    }

    if (!isChallengeCompleted()) {

      elements.homeSlot.hidden = true;

      elements.homeSlot.replaceChildren();

      return;

    }

    elements.homeSlot.hidden = false;

    if (
      elements.homeSlot.querySelector(
        ".results-home-button"
      )
    ) {
      return;
    }

    const button = makeElement(
      "button",
      "results-home-button"
    );

    button.type = "button";

    const label = makeElement(
      "span",
      "",
      "🏆 BEKIJK DE ANTWOORDEN VAN VANDAAG"
    );

    const arrow = makeElement(
      "span",
      "",
      "↓"
    );

    button.append(
      label,
      arrow
    );

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.addEventListener(
      "click",
      function () {

        const existingPanel =
          elements.homeSlot.querySelector(
            ".results-panel"
          );

        if (existingPanel) {

          existingPanel.remove();

          arrow.textContent = "↓";

          button.setAttribute(
            "aria-expanded",
            "false"
          );

          return;

        }

        if (!isChallengeCompleted()) {
          return;
        }

        const panel = createResultsPanel();

        elements.homeSlot.appendChild(panel);

        arrow.textContent = "↑";

        button.setAttribute(
          "aria-expanded",
          "true"
        );

        panel.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

      }
    );

    elements.homeSlot.appendChild(button);

  }


  /* ========================================
     KNOP OP EINDSCHERM
  ======================================== */

  function updateEndResults() {

    if (!elements.endSlot) {
      return;
    }

    if (!isChallengeCompleted()) {

      elements.endSlot.hidden = true;

      elements.endSlot.replaceChildren();

      return;

    }

    elements.endSlot.hidden = false;

    if (
      elements.endSlot.querySelector(
        ".results-toggle-button"
      )
    ) {
      return;
    }

    const button = makeElement(
      "button",
      "results-toggle-button"
    );

    button.type = "button";

    const label = makeElement(
      "span",
      "",
      "🔍 BEKIJK ALLE ANTWOORDEN"
    );

    const arrow = makeElement(
      "span",
      "results-toggle-arrow",
      "↓"
    );

    button.append(
      label,
      arrow
    );

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.addEventListener(
      "click",
      function () {

        const existingPanel =
          elements.endSlot.querySelector(
            ".results-panel"
          );

        if (existingPanel) {

          existingPanel.remove();

          arrow.textContent = "↓";

          button.setAttribute(
            "aria-expanded",
            "false"
          );

          return;

        }

        if (!isChallengeCompleted()) {
          return;
        }

        const panel = createResultsPanel();

        elements.endSlot.appendChild(panel);

        arrow.textContent = "↑";

        button.setAttribute(
          "aria-expanded",
          "true"
        );

        panel.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

    elements.endSlot.appendChild(button);

  }


  /* ========================================
     SPEL IS VOLTOOID

     Controleer of alle tien
     antwoorden zijn opgeslagen.

     De Daily Challenge blijft
     verantwoordelijk voor de
     officiële dagscore.
  ======================================== */

  function handleEndScreenVisible() {

    if (
      !elements.endScreen.classList.contains(
        "active"
      )
    ) {
      return;
    }

    /*
     * Extra zekerheid:
     * probeer de laatste vraag
     * nog vast te leggen.
     */

    captureQuestionResult();

    setTimeout(
      function () {

        if (
          !elements.endScreen.classList.contains(
            "active"
          )
        ) {
          return;
        }

        const completion =
          getDailyCompletion();

        if (!completion) {
          return;
        }

        if (gameStarted) {

          completedThisSession = true;

          saveRoundAnswers();

          gameStarted = false;

        }

        updateHomeResults();

        updateEndResults();

      },
      0
    );

  }


  /* ========================================
     EINDSCHERM OBSERVEREN
  ======================================== */

  function observeEndScreen() {

    const observer = new MutationObserver(
      function () {

        handleEndScreenVisible();

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


  /* ========================================
     STARTSCHERM OBSERVEREN
  ======================================== */

  function observeStartScreen() {

    const observer = new MutationObserver(
      function () {

        if (
          elements.startScreen.classList.contains(
            "active"
          )
        ) {

          updateHomeResults();

        }

      }
    );

    observer.observe(
      elements.startScreen,
      {
        attributes: true,

        attributeFilter: ["class"]
      }
    );

  }


  /* ========================================
     EVENEMENTEN
  ======================================== */

  function initializeEvents() {

    /*
     * Nieuwe vlucht registreren.
     */

    elements.startButton.addEventListener(
      "click",
      registerGameStart,
      true
    );

    /*
     * Antwoord opslaan zodra
     * de resultaatkaart verschijnt.
     */

    observeQuestionResults();

    /*
     * Extra controle voordat de
     * speler naar de volgende
     * vraag gaat.
     *
     * capture: true zorgt ervoor
     * dat dit vóór de normale
     * spelcode gebeurt.
     */

    elements.nextButton.addEventListener(
      "click",
      captureBeforeNextQuestion,
      true
    );

    observeEndScreen();

    observeStartScreen();

    /*
     * Als de speler terugkomt
     * naar het tabblad:
     * controleer de resultaten.
     */

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState === "visible"
        ) {

          updateHomeResults();

          updateEndResults();

        }

      }
    );

  }


  /* ========================================
     QUIZBALLON RESULTATEN STARTEN
  ======================================== */

  function initializeResults() {

    if (
      !elements.homeSlot ||
      !elements.endSlot ||
      !elements.answerResult ||
      !elements.nextButton
    ) {

      console.error(
        "QuizBallon: vereiste HTML-elementen ontbreken."
      );

      return;

    }

    roundAnswers = [];

    gameStarted = false;

    completedThisSession = false;

    lastRecordedQuestion = 0;

    initializeEvents();

    updateHomeResults();

    updateEndResults();

    console.log(
      "🏆 QuizBallon resultaten versie 2 geladen!"
    );

  }


  initializeResults();

})();
