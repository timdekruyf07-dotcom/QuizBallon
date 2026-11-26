/* ============================================================
   QUIZBALLON - DAILY ONDERWERPEN V1

   DOEL
   ------------------------------------------------------------
   Iedere dag 10 vragen over andere onderwerpen.

   Voorbeelden:
   - "Noem een zoogdier"
   - "Noem een zoogdier met de letter A"

   Deze vragen worden als hetzelfde onderwerp behandeld.

   BELANGRIJK
   ------------------------------------------------------------
   Voor 10 volledig andere onderwerpen dan gisteren
   zijn minimaal 20 verschillende onderwerpen nodig.

   De selectie is deterministisch:
   dezelfde datum + dezelfde vragenbank
   geeft dezelfde vragen.

   Dit bestand levert de selectiefunctie.
   De bestaande daily.js moet deze functie nog aanroepen.
============================================================ */

(function () {
  "use strict";

  const QUESTIONS_PER_DAY = 10;

  const TIME_ZONE = "Europe/Amsterdam";

  /* ==========================================================
     DATUM IN NEDERLAND
  ========================================================== */

  function getDutchDate(date = new Date()) {
    const parts = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    ).formatToParts(date);

    const values = {};

    for (const part of parts) {
      if (part.type !== "literal") {
        values[part.type] = part.value;
      }
    }

    return (
      values.year +
      "-" +
      values.month +
      "-" +
      values.day
    );
  }

  /* ==========================================================
     DATUM OMZETTEN NAAR DAGNUMMER

     We gebruiken een vast dagnummer.
     Daardoor schuift de onderwerpselectie
     iedere kalenderdag precies 10 plekken op.
  ========================================================== */

  function dayNumber(dateKey) {
    const parts = dateKey.split("-").map(Number);

    if (parts.length !== 3) {
      throw new Error(
        "Ongeldige datum: " + dateKey
      );
    }

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return Math.floor(
      Date.UTC(year, month - 1, day) /
      86400000
    );
  }

  /* ==========================================================
     VRAAGTEKST LEZEN
  ========================================================== */

  function questionText(question) {
    if (!question || typeof question !== "object") {
      return "";
    }

    return String(
      question.question ||
      question.vraag ||
      question.text ||
      question.title ||
      ""
    ).trim();
  }

  /* ==========================================================
     CATEGORIE LEZEN
  ========================================================== */

  function questionCategory(question) {
    return String(
      question.category ||
      question.categorie ||
      "Overig"
    ).trim();
  }

  /* ==========================================================
     NORMALISEREN
  ========================================================== */

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’'`]/g, "")
      .replace(/[?!.,:;()]/g, " ")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ==========================================================
     ONDERWERP HERKENNEN

     De beste manier is om vragen zelf
     een vaste "topic" of "topicId"
     te geven.

     Als die ontbreekt, proberen we
     het onderwerp uit de tekst te halen.
  ========================================================== */

  function getTopic(question) {
    if (question.topicId != null) {
      return normalize(question.topicId);
    }

    if (question.topic != null) {
      return normalize(question.topic);
    }

    if (question.onderwerp != null) {
      return normalize(question.onderwerp);
    }

    if (question.baseQuestionId != null) {
      return normalize(question.baseQuestionId);
    }

    let text = questionText(question);

    /* 
       De gegenereerde QuizBallon-vragen
       gebruiken vaak "Extra eis:".
       Alles daarna hoort bij dezelfde
       basisvraag.
    */

    text = text.split(
      /\bextra\s+eis\s*:/i
    )[0];

    /*
       Herken veelgebruikte toevoegingen
       over letters.
    */

    text = text.replace(
      /\s+(?:met|waarvan)\s+(?:de\s+)?(?:naam\s+)?(?:de\s+)?letter\s+[a-z]\b.*$/i,
      ""
    );

    text = text.replace(
      /\s+die\s+begint\s+met\s+(?:de\s+letter\s+)?[a-z]\b.*$/i,
      ""
    );

    text = text.replace(
      /\s+die\s+eindigt\s+op\s+(?:de\s+letter\s+)?[a-z]\b.*$/i,
      ""
    );

    text = text.replace(
      /\s+zonder\s+de\s+letter\s+[a-z]\b.*$/i,
      ""
    );

    return normalize(text);
  }

  /* ==========================================================
     STABIELE HASH

     De hash zorgt voor een vaste
     volgorde van onderwerpen.

     Daardoor hangt de selectie niet
     direct af van de oorspronkelijke
     volgorde van de vragen.
  ========================================================== */

  function hashString(text) {
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

  /* ==========================================================
     VRAGEN GROEPEREN PER ONDERWERP
  ========================================================== */

  function groupByTopic(questions) {
    const map = new Map();

    for (const question of questions) {
      const text = questionText(question);

      if (!text) {
        continue;
      }

      const topic = getTopic(question);

      if (!topic) {
        continue;
      }

      if (!map.has(topic)) {
        map.set(topic, {
          topic,
          category: normalize(
            questionCategory(question)
          ),
          questions: []
        });
      }

      map.get(topic).questions.push(question);
    }

    return [...map.values()];
  }

  /* ==========================================================
     ONDERWERPEN STABIEL SORTEREN
  ========================================================== */

  function sortTopics(groups) {
    return groups.slice().sort((a, b) => {
      const hashA = hashString(a.topic);
      const hashB = hashString(b.topic);

      if (hashA !== hashB) {
        return hashA - hashB;
      }

      return a.topic.localeCompare(b.topic);
    });
  }

  /* ==========================================================
     DAGELIJKSE SELECTIE

     Bij minimaal 20 verschillende
     onderwerpen schuift de selectie
     iedere dag 10 onderwerpen door.

     Voorbeeld met 30 onderwerpen:

     Dag 1: onderwerpen 1 t/m 10
     Dag 2: onderwerpen 11 t/m 20
     Dag 3: onderwerpen 21 t/m 30
     Dag 4: onderwerpen 1 t/m 10

     Zo is iedere opeenvolgende dag
     gegarandeerd anders.

     Let op:
     De garantie geldt voor herkende,
     unieke topicgroepen binnen één
     ongewijzigde vragenbank.
  ========================================================== */

  function chooseDailyQuestions(
    questions,
    dateKey = getDutchDate()
  ) {
    if (!Array.isArray(questions)) {
      throw new Error(
        "De vragenbank moet een array zijn."
      );
    }

    const groups = sortTopics(
      groupByTopic(questions)
    );

    const topicCount = groups.length;

    if (topicCount < QUESTIONS_PER_DAY) {
      throw new Error(
        "QuizBallon heeft minimaal 10 " +
        "verschillende onderwerpen nodig. " +
        "Er zijn er nu " +
        topicCount +
        "."
      );
    }

    if (
      topicCount <
      QUESTIONS_PER_DAY * 2
    ) {
      console.warn(
        "QuizBallon: er zijn " +
        topicCount +
        " onderwerpen. " +
        "Voor gegarandeerd 10 andere " +
        "onderwerpen dan gisteren " +
        "zijn minstens 20 nodig."
      );
    }

    const number = dayNumber(dateKey);

    /*
       Startpositie schuift
       iedere dag 10 plekken op.
    */

    const startIndex = (
      (number * QUESTIONS_PER_DAY) %
      topicCount +
      topicCount
    ) % topicCount;

    const selected = [];

    for (
      let position = 0;
      position < QUESTIONS_PER_DAY;
      position++
    ) {
      const groupIndex = (
        startIndex + position
      ) % topicCount;

      const group = groups[groupIndex];

      /*
         Een onderwerp kan meerdere
         vraagvarianten hebben.

         Bijvoorbeeld:
         - Noem een zoogdier
         - Noem een zoogdier met de letter A

         We kiezen per dag één variant.
      */

      const variants = group.questions
        .slice()
        .sort((a, b) => {
          return questionText(a).localeCompare(
            questionText(b)
          );
        });

      const variantSeed = hashString(
        dateKey + "|" + group.topic
      );

      const variantIndex =
        variantSeed % variants.length;

      selected.push(
        variants[variantIndex]
      );
    }

    return selected;
  }

  /* ==========================================================
     OVERZICHT VAN GEKOZEN ONDERWERPEN
  ========================================================== */

  function getDailyTopicNames(
    questions,
    dateKey = getDutchDate()
  ) {
    const selected = chooseDailyQuestions(
      questions,
      dateKey
    );

    return selected.map(getTopic);
  }

  /* ==========================================================
     CONTROLEREN OP HERHALINGEN

     Hiermee kun je nakijken welke
     onderwerpen zowel vandaag
     als gisteren voorkomen.
  ========================================================== */

  function compareDays(
    questions,
    firstDate,
    secondDate
  ) {
    const first = new Set(
      getDailyTopicNames(
        questions,
        firstDate
      )
    );

    const second = new Set(
      getDailyTopicNames(
        questions,
        secondDate
      )
    );

    return [...first].filter(
      topic => second.has(topic)
    );
  }

  /* ==========================================================
     FUNCTIES BESCHIKBAAR STELLEN

     De huidige daily.js kan later
     chooseDailyQuestions aanroepen.
  ========================================================== */

  window.QB_DAILY_UNIQUE_TOPICS = {
    version: "1.0",

    questionsPerDay: QUESTIONS_PER_DAY,

    getDutchDate,

    getTopic,

    chooseDailyQuestions,

    getDailyTopicNames,

    compareDays
  };

  console.log(
    "🎈 QuizBallon: selectie op unieke " +
    "dagelijkse onderwerpen beschikbaar."
  );

})();
