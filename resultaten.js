/* =====================================================
   QUIZBALLON
   RESULTATENOVERZICHT - VERSIE 1

   NIEUWE FUNCTIES:
   - ANTWOORDEN BEKIJKEN NA DE DAILY CHALLENGE
   - 10 UITKLAPBARE VRAGEN
   - ALLE BEKENDE GELDIGE ANTWOORDEN
   - ZOEKFUNCTIE PER VRAAG
   - SORTEREN VAN HOOG NAAR LAAG
   - RAKETANTWOORD MARKEREN
   - EIGEN ANTWOORD EN SCORE TONEN
   - RESULTATEN BEWAREN NA VERNIEUWEN

   COMPATIBEL MET:
   - script.js
   - vragen.js
   - antwoorduitbreiding.js
   - geschiedenis.js
   - daily.js

   BELANGRIJK:
   ANTWOORDEN WORDEN PAS ZICHTBAAR
   NADAT DE DAGELIJKSE UITDAGING
   VOLTOOID IS.
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
    "quizballon-review-v1-";


  /* ========================================
     ELEMENTEN
  ======================================== */

  function byId(id) {
    return document.getElementById(id);
  }

  const elements = {

    startButton: byId("start-button"),

    startScreen: byId("start-screen"),

    gameScreen: byId("game-screen"),

    endScreen: byId("end-screen"),

    homeSlot: byId("results-home-slot"),

    endSlot: byId("results-end-slot"),

    answerResult: byId("answer-result"),

    answerInput: byId("answer-input"),

    questionText: byId("question-text"),

    questionNumber: byId("question-number"),

    resultPoints: byId("result-points")

  };


  /* ========================================
     STATUS

     Hier slaan we tijdens het spel
     de antwoorden van de speler op.
  ======================================== */

  let roundAnswers = [];

  let completedThisSession = false;

  let lastRecordedQuestion = 0;

  let homePanelOpen = false;

  let endPanelOpen = false;


  /* ========================================
     NEDERLANDSE DATUM

     Dezelfde tijdzone als daily.js.
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
     NORMALISEREN

     Zo kun je zoeken zonder rekening
     te houden met hoofdletters,
     accenten of streepjes.
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
     VEILIG TEKST TOEVOEGEN

     We gebruiken textContent.
     Daardoor wordt ingevoerde tekst
     niet uitgevoerd als HTML.
  ======================================== */

  function makeElement(
    tag,
    className,
    text
  ) {

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
     HUIDIGE VRAGENBANK OPHALEN

     daily.js heeft de lijst teruggebracht
     tot de 10 vragen van vandaag.

     Dat is precies de lijst die
     we voor het overzicht nodig hebben.
  ======================================== */

  function getDailyQuestions() {

    const questions =
      window.QUIZBALLON_EXPANDED_QUESTIONS;

    if (!Array.isArray(questions)) {
      return [];
    }

    return questions;

  }


  /* ========================================
     DAGRESULTAAT LEZEN
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


  /* ========================================
     IS DE DAILY CHALLENGE AF?

     Zolang iemand speelt of nog niet
     heeft gespeeld, mag het antwoorden-
     overzicht niet verschijnen.
  ======================================== */

  function isChallengeCompleted() {

    return Boolean(
      completedThisSession ||
      getDailyCompletion()
    );

  }


  /* ========================================
     OPSLAGLOCATIE VAN VANDAAG
  ======================================== */

  function getReviewStorageKey() {

    return REVIEW_STORAGE_PREFIX +
      getTodayKey();

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
     ANTWOORDEN OPSLAAN

     We bewaren:
     - Nummer van de vraag
     - De vraag zelf
     - Het antwoord van de speler
     - Het behaalde aantal punten

     De geldige antwoorden hoeven niet
     dubbel te worden opgeslagen.
     Die staan al in de vragenbank.
  ======================================== */

  function saveRoundAnswers() {

    const data = {

      date: getTodayKey(),

      answers: roundAnswers.map(
        function (answer) {

          return {
            number: answer.number,
            question: answer.question,
            answer: answer.answer,
            points: answer.points,
            correct: answer.correct
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
        "QuizBallon: antwoorden konden niet worden bewaard."
      );

    }

  }


  /* ========================================
     NIEUWE VLUCHT REGISTREREN

     Zodra de speler daadwerkelijk
     een nieuwe Daily Challenge start,
     beginnen we opnieuw met bijhouden.
  ======================================== */

  function registerStart() {

    if (isChallengeCompleted()) {
      return;
    }

    roundAnswers = [];

    lastRecordedQuestion = 0;

    homePanelOpen = false;
    endPanelOpen = false;

  }


  /* ========================================
     BEHAALDE PUNTEN UITLEZEN
  ======================================== */

  function getDisplayedPoints() {

    const text =
      elements.resultPoints.textContent;

    const number = Number(
      text.replace(/[^\d]/g, "")
    );

    return Number.isFinite(number)
      ? number
      : 0;

  }


  /* ========================================
     RESULTAAT VAN EEN VRAAG BIJHOUDEN

     We wachten tot script.js het
     resultaat van een vraag laat zien.

     Daardoor werkt dit ook bij:
     - Suggesties
     - Normale antwoorden
     - Typefouten
     - Tijd die opraakt
  ======================================== */

  function captureQuestionResult() {

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
      number > 10
    ) {
      return;
    }

    /*
     * Dezelfde vraag niet twee
     * keer opslaan.
     */

    if (number === lastRecordedQuestion) {
      return;
    }

    const question =
      elements.questionText.textContent.trim();

    const points = getDisplayedPoints();

    const correct =
      elements.answerResult.classList.contains(
        "correct"
      );

    /*
     * Bij tijd op of geen goedgekeurd
     * antwoord tonen we geen geldig
     * antwoord voor de speler.
     */

    const answer = correct
      ? elements.answerInput.value.trim()
      : "";

    roundAnswers.push({

      number: number,

      question: question,

      answer: answer,

      points: points,

      correct: correct

    });

    lastRecordedQuestion = number;

  }


  /* ========================================
     RESULTAATKAART OBSERVEREN

     script.js verandert het attribuut
     hidden zodra een vraag afgelopen is.
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
     DE VRAGEN IN SPEELVOLGORDE

     Als de speler vandaag met deze
     versie heeft gespeeld, kennen
     we de echte speelvolgorde.

     Als de speler al vóór deze
     uitbreiding klaar was, tonen
     we de 10 vragen van vandaag
     zonder persoonlijke antwoorden.
  ======================================== */

  function getReviewQuestions() {

    const available =
      getDailyQuestions();

    let recorded = loadSavedAnswers();

    if (
      !recorded &&
      completedThisSession
    ) {

      recorded = roundAnswers;

    }

    if (
      Array.isArray(recorded) &&
      recorded.length > 0
    ) {

      const ordered = [...recorded].sort(
        function (a, b) {

          return a.number - b.number;

        }
      );

      const used = new Set();

      const result = [];

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

        if (used.has(question.question)) {
          return;
        }

        used.add(question.question);

        result.push({

          question: question,

          player: item

        });

      });

      /*
       * Mocht een vraag niet zijn
       * opgenomen, voeg hem alsnog
       * toe zonder persoonlijke score.
       */

      available.forEach(function (question) {

        if (used.has(question.question)) {
          return;
        }

        result.push({

          question: question,

          player: null

        });

      });

      return result;

    }

    return available.map(
      function (question) {

        return {

          question: question,

          player: null

        };

      }
    );

  }


  /* ========================================
     ANTWOORDEN SORTEREN

     Het raketantwoord bovenaan.
     Daarna van hoogste score
     naar laagste score.
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
     SCORE VAN DE SPELER MAKEN
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

    const answerName = makeElement(
      "span",
      "results-your-name",
      isCorrect
        ? player.answer
        : player
          ? "Geen geldig antwoord"
          : "Niet beschikbaar"
    );

    const points = makeElement(
      "strong",
      "results-your-score",
      player
        ? "+" + player.points + " punten"
        : "—"
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
     ÉÉN ANTWOORDRIJ MAKEN
  ======================================== */

  function makeAnswerRow(
    answer,
    player
  ) {

    const isRocket =
      answer.isRocket === true ||
      Number(answer.points) === 100;

    const isYourAnswer =
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
     ZOEKRESULTATEN TONEN

     Er wordt gezocht in:
     - Hoofdnaam
     - Alternatieve namen

     Voorbeeld:
     Zoeken naar "golden labrador"
     kan "Goldador" vinden.
  ======================================== */

  function updateAnswerList(
    question,
    player,
    searchInput,
    answerList,
    countElement
  ) {

    const search = normalize(
      searchInput.value
    );

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
          "🔍 Geen antwoorden gevonden. Probeer een andere zoekterm."
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
     UITKLAPBARE VRAAG MAKEN
  ======================================== */

  function makeQuestionAccordion(
    entry,
    number
  ) {

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
      "results-search-" + number + "-" +
      Math.random().toString(36).slice(2, 8);

    searchInput.id = inputId;

    searchInput.type = "search";

    searchInput.placeholder =
      "Bijvoorbeeld: zeeleeuw";

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
     * Bouw de antwoordlijst pas
     * wanneer de speler de
     * vraag daadwerkelijk opent.
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

    /*
     * Filter de antwoorden terwijl
     * de speler typt.
     */

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
     COMPLEET OVERZICHT MAKEN
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
      "🏆 JOUW DAILY CHALLENGE"
    );

    const title = makeElement(
      "h3",
      "",
      "Alle antwoorden bekijken"
    );

    const description = makeElement(
      "p",
      "",
      "Klap een vraag open om alle bekende geldige antwoorden te bekijken. " +
      "De hoogste scores staan bovenaan. " +
      "Gebruik de zoekfunctie om een specifiek antwoord te vinden."
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

     Alleen zichtbaar na voltooiing.
  ======================================== */

  function updateHomeResults() {

    if (!elements.homeSlot) {
      return;
    }

    if (!isChallengeCompleted()) {

      elements.homeSlot.hidden = true;

      elements.homeSlot.replaceChildren();

      homePanelOpen = false;

      return;

    }

    elements.homeSlot.hidden = false;

    /*
     * Als de knop al bestaat,
     * hoeven we hem niet
     * opnieuw te maken.
     */

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

          homePanelOpen = false;

          button.setAttribute(
            "aria-expanded",
            "false"
          );

          arrow.textContent = "↓";

          return;

        }

        if (!isChallengeCompleted()) {
          return;
        }

        const panel =
          createResultsPanel();

        elements.homeSlot.appendChild(panel);

        homePanelOpen = true;

        button.setAttribute(
          "aria-expanded",
          "true"
        );

        arrow.textContent = "↑";

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

     Hier verschijnt:
     BEKIJK ALLE ANTWOORDEN
  ======================================== */

  function updateEndResults() {

    if (!elements.endSlot) {
      return;
    }

    if (!isChallengeCompleted()) {

      elements.endSlot.hidden = true;

      elements.endSlot.replaceChildren();

      endPanelOpen = false;

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

          endPanelOpen = false;

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

        const panel =
          createResultsPanel();

        elements.endSlot.appendChild(panel);

        endPanelOpen = true;

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
     SPEL VOLTOOID

     Zodra het eindscherm verschijnt:
     - Dagresultaat controleren
     - Antwoorden opslaan
     - Antwoordenknop tonen

     We gebruiken een korte uitgestelde
     controle zodat daily.js eerst het
     dagresultaat kan opslaan.
  ======================================== */

  function handleEndScreenVisible() {

    if (
      !elements.endScreen.classList.contains(
        "active"
      )
    ) {
      return;
    }

    setTimeout(
      function () {

        if (
          !elements.endScreen.classList.contains(
            "active"
          )
        ) {
          return;
        }

        const dailyComplete =
          getDailyCompletion();

        if (!dailyComplete) {
          return;
        }

        /*
         * Dit was een nieuwe speelsessie
         * die we hebben bijgehouden.
         */

        if (
          roundAnswers.length === 10 &&
          !completedThisSession
        ) {

          completedThisSession = true;

          saveRoundAnswers();

        }

        updateEndResults();

        updateHomeResults();

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

     Als de speler na het spel
     teruggaat naar de homepage,
     blijft de antwoordenknop zichtbaar.
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
     UITDAGING VAN NIEUWE DAG

     De bestaande daily.js vernieuwt
     de pagina zodra het een nieuwe
     Nederlandse kalenderdag is.

     Daardoor verdwijnen de antwoorden
     van de vorige dag uit het huidige
     dagelijkse overzicht.

     De data van vandaag wordt apart
     opgeslagen met de datum als sleutel.
  ======================================== */

  function initializeDay() {

    completedThisSession = false;

    roundAnswers = [];

    lastRecordedQuestion = 0;

    updateHomeResults();

    updateEndResults();

  }


  /* ========================================
     EVENEMENTEN
  ======================================== */

  function initializeEvents() {

    elements.startButton.addEventListener(
      "click",
      registerStart,
      true
    );

    /*
     * Als de speler de vraag opnieuw
     * probeert na een ongeldig antwoord,
     * slaan we pas iets op nadat
     * de vraag daadwerkelijk klaar is.
     */

    observeQuestionResults();

    observeEndScreen();

    observeStartScreen();

    /*
     * Als het tabblad opnieuw zichtbaar
     * wordt, controleren we opnieuw of
     * de dag is voltooid.
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
      !elements.answerResult
    ) {

      console.error(
        "QuizBallon: de HTML voor het antwoordenoverzicht ontbreekt."
      );

      return;

    }

    initializeDay();

    initializeEvents();

    console.log(
      "🏆 QuizBallon antwoordenoverzicht geladen!"
    );

  }


  initializeResults();

})();
