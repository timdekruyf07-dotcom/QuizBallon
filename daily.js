/* =====================================================
   QUIZBALLON - DAILY CHALLENGE V6

   - 10 VRAGEN PER DAG
   - 10 VOLLEDIGE DAGEN GEEN HERHALING
   - LETTERVARIANT = DEZELFDE BASISVRAAG
   - 9 GEWONE VRAGEN + 1 LETTERVRAAG
   - WILLEKEURIGE, VASTE ROULATIE
   - GEEN VERPLICHTE CATEGORIEËN
   - DEZELFDE VRAGEN PER DATUM
   - NEDERLANDSE TIJDZONE
   - EEN VOLTOOIDE DAILY PER DAG
   - BESTAANDE RESULTATEN BEHOUDEN
===================================================== */

(function () {
  "use strict";

  const TZ = "Europe/Amsterdam";

  const PER_DAY = 10;

  const BLOCK_DAYS = 10;

  const REQUIRED =
    PER_DAY * (BLOCK_DAYS + 1);

  const SALT =
    "quizballon-v6-vaste-roulatie-2026-11";

  const STORAGE =
    "quizballon-daily-result-v1";


  /* ========================================
     HTML
  ======================================== */

  function el(id) {
    return document.getElementById(id);
  }

  const ui = {

    start: el("start-button"),

    restart: el("restart-button"),

    home: el("home-button"),

    quit: el("quit-button"),

    startScreen: el("start-screen"),

    end: el("end-screen"),

    date: el("daily-date"),

    desc: el("daily-description"),

    status: el("daily-status"),

    countdown: el("daily-countdown"),

    endMessage: el("daily-end-message"),

    score: el("end-score"),

    height: el("end-height"),

    correct: el("end-correct")

  };


  /* ========================================
     COMPLETE VRAGENBANK BEWAREN
  ======================================== */

  const original = Array.isArray(
    window.QUIZBALLON_EXPANDED_QUESTIONS
  )
    ? [
        ...window.QUIZBALLON_EXPANDED_QUESTIONS
      ]
    : [];


  /* ========================================
     NORMALISEREN
  ======================================== */

  function norm(value) {

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
     BASISVRAAG HERKENNEN

     Een lettervariant krijgt
     dezelfde basisvraag als
     de gewone vraag.
  ======================================== */

  function baseText(question) {

    return String(
      question.question || ""
    )
      .split(/extra eis\s*:/i)[0]
      .trim();

  }


  function topicKey(question) {

    const explicit =
      question.baseQuestionId ||
      question.topicId ||
      question.topic;

    if (explicit) {
      return norm(explicit);
    }

    const text = norm(
      baseText(question)
    );

    /*
     * Bekende dubbele onderwerpen
     * uit de bestaande vragenbank.
     */

    if (
      /stad in japan/.test(text)
    ) {
      return "japanse steden";
    }

    if (
      /hondenras/.test(text)
    ) {
      return "hondenrassen";
    }

    return text;

  }


  /* ========================================
     NEDERLANDSE DATUM
  ======================================== */

  function keyOfDate(
    date = new Date()
  ) {

    return new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: TZ,

        year: "numeric",

        month: "2-digit",

        day: "2-digit"
      }
    ).format(date);

  }


  function dayIndex(key) {

    const parts = key
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


  function nextDate(
    key,
    numberOfDays
  ) {

    const date = new Date(
      key + "T12:00:00Z"
    );

    date.setUTCDate(
      date.getUTCDate() +
      numberOfDays
    );

    return date
      .toISOString()
      .slice(0, 10);

  }


  /* ========================================
     VASTE WILLEKEURIGE SEED
  ======================================== */

  function hash(value) {

    let result = 2166136261;

    for (
      let i = 0;
      i < value.length;
      i++
    ) {

      result ^= value.charCodeAt(i);

      result = Math.imul(
        result,
        16777619
      );

    }

    return result >>> 0;

  }


  function random(seed) {

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

    const rnd = random(seed);

    for (
      let i = result.length - 1;
      i > 0;
      i--
    ) {

      const j = Math.floor(
        rnd() * (i + 1)
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
     LETTERVARIANT HERKENNEN
  ======================================== */

  function hasLetterVariant(question) {

    return /extra eis\s*:/i.test(
      question.question || ""
    );

  }


  /* ========================================
     BASISVRAGEN GROEPEREN

     Alle varianten van dezelfde
     vraag komen in één groep.

     Die groep kan maar één keer
     voorkomen binnen de roulatie.
  ======================================== */

  const grouped = new Map();

  original.forEach(
    function (question) {

      if (
        !question ||
        !Array.isArray(
          question.answers
        ) ||
        !question.answers.length
      ) {
        return;
      }

      const key = topicKey(
        question
      );

      if (!key) {
        return;
      }

      if (!grouped.has(key)) {

        grouped.set(key, {

          key: key,

          regular: [],

          variants: []

        });

      }

      const group =
        grouped.get(key);

      if (
        hasLetterVariant(question)
      ) {

        group.variants.push(
          question
        );

      } else {

        group.regular.push(
          question
        );

      }

    }
  );


  const bases = [
    ...grouped.values()
  ].filter(
    function (group) {

      return group.regular.length > 0;

    }
  );


  /* ========================================
     VASTE ROULATIE

     Sorteer eerst de basisvragen
     zodat de bronvolgorde geen
     invloed heeft.

     Daarna schudden we ze één keer
     met een vaste seed.
  ======================================== */

  const ordered = shuffle(

    bases.sort(
      function (a, b) {

        return a.key.localeCompare(
          b.key,
          "nl"
        );

      }
    ),

    hash(SALT)

  );


  const sufficient =
    ordered.length >= REQUIRED;


  /* ========================================
     DAGSTATUS
  ======================================== */

  let current = keyOfDate();

  let completed = null;

  let startedDay = null;

  let lastEnd = false;


  /* ========================================
     GEWONE VRAAG KIEZEN
  ======================================== */

  function baseFor(
    group,
    key
  ) {

    return shuffle(

      group.regular,

      hash(
        SALT +
        "|basis|" +
        key +
        "|" +
        group.key
      )

    )[0];

  }


  /* ========================================
     ANTWOORDEN HELPERS
  ======================================== */

  function answersFor(question) {

    return Array.isArray(
      question.answers
    )
      ? question.answers
      : [];

  }


  function nameOf(answer) {

    if (
      typeof answer === "string"
    ) {

      return answer.split("|")[0];

    }

    return answer.answer;

  }


  function letters(value) {

    return norm(value)
      .replace(/[^a-z]/g, "");

  }


  /* ========================================
     VERSCHILLENDE LETTERREGELS

     Ook de lettervraag zelf
     wisselt per datum.
  ======================================== */

  const LETTER_RULES = [

    {
      label:
        "de naam heeft minstens 5 letters",

      test: function (name) {

        return letters(name).length >= 5;

      }
    },

    {
      label:
        "de naam heeft minstens 6 letters",

      test: function (name) {

        return letters(name).length >= 6;

      }
    },

    {
      label:
        "de naam bevat de letter A of E",

      test: function (name) {

        return /[ae]/.test(
          letters(name)
        );

      }
    },

    {
      label:
        "de naam heeft minstens 2 klinkers",

      test: function (name) {

        return (
          letters(name).match(
            /[aeiou]/g
          ) || []
        ).length >= 2;

      }
    },

    {
      label:
        "de naam bevat een N, R of S",

      test: function (name) {

        return /[nrs]/.test(
          letters(name)
        );

      }
    },

    {
      label:
        "de naam begint met een medeklinker",

      test: function (name) {

        return /^[bcdfghjklmnpqrstvwxyz]/.test(
          letters(name)
        );

      }
    },

    {
      label:
        "de naam bevat minstens 3 medeklinkers",

      test: function (name) {

        return (
          letters(name).match(
            /[bcdfghjklmnpqrstvwxyz]/g
          ) || []
        ).length >= 3;

      }
    },

    {
      label:
        "de naam eindigt op een medeklinker",

      test: function (name) {

        return /[bcdfghjklmnpqrstvwxyz]$/.test(
          letters(name)
        );

      }
    }

  ];


  /* ========================================
     LETTERVRAAG MAKEN

     Belangrijk:
     - Alleen passende antwoorden
     - Alternatieve namen moeten
       zelf ook aan de eis voldoen
     - Precies één raketantwoord
  ======================================== */

  function makeLetterQuestion(
    question,
    key
  ) {

    const availableRules = shuffle(

      LETTER_RULES,

      hash(
        SALT +
        "|eis|" +
        key +
        "|" +
        question.question
      )

    );


    for (
      const rule of availableRules
    ) {

      const matches =
        answersFor(question).filter(
          function (answer) {

            return rule.test(
              nameOf(answer)
            );

          }
        );


      if (matches.length < 8) {
        continue;
      }


      const copied = matches.map(
        function (answer) {

          if (
            typeof answer === "string"
          ) {

            const parts =
              answer.split("|");

            return {

              answer: parts[0],

              points: Math.max(
                10,
                Math.min(
                  99,
                  Number(parts[1]) || 10
                )
              ),

              aliases:
                parts.slice(2).filter(
                  rule.test
                ),

              isRocket: false

            };

          }


          return {

            ...answer,

            aliases: (
              answer.aliases || []
            ).filter(
              rule.test
            ),

            isRocket:
              answer.isRocket === true

          };

        }
      );


      /*
       * Bestaand raketantwoord
       * behouden wanneer het
       * aan de letterregel voldoet.
       */

      const rockets = copied.filter(
        function (answer) {

          return (
            answer.isRocket ||
            Number(answer.points) === 100
          );

        }
      );


      /*
       * Anders het hoogst
       * gewaardeerde geldige
       * antwoord selecteren.
       */

      const rocket =
        rockets[0] ||

        copied.reduce(
          function (best, answer) {

            return Number(
              answer.points
            ) > Number(
              best.points
            )
              ? answer
              : best;

          },
          copied[0]
        );


      copied.forEach(
        function (answer) {

          answer.isRocket =
            answer === rocket;

          answer.points =
            answer === rocket

              ? 100

              : Math.max(
                  10,
                  Math.min(
                    99,
                    Number(
                      answer.points
                    ) || 10
                  )
                );

        }
      );


      return {

        ...question,

        question:
          baseText(question)
            .replace(
              /[.!?\s]+$/,
              ""
            ) +
          ". Extra eis: " +
          rule.label +
          ".",

        hint:
          "Alleen antwoorden die aan " +
          "de extra lettereis voldoen " +
          "tellen mee.",

        answers:
          copied

      };

    }


    return null;

  }


  /* ========================================
     10 VRAGEN VOOR ÉÉN DAG

     De wiskunde achter de blokkade:

     Minstens 110 unieke basisvragen.

     Iedere dag verschuiven we
     10 posities door de geschudde
     lijst.

     Een vraag komt dus pas terug
     nadat alle andere posities
     zijn gepasseerd.

     Dat duurt minstens 11 dagen.
  ======================================== */

  function select(key) {

    if (!sufficient) {
      return [];
    }

    const start = (

      (
        dayIndex(key) * PER_DAY
      ) % ordered.length +

      ordered.length

    ) % ordered.length;


    const selectedGroups =
      Array.from(
        {
          length: PER_DAY
        },
        function (_, index) {

          return ordered[
            (
              start + index
            ) % ordered.length
          ];

        }
      );


    const output =
      selectedGroups.map(
        function (group) {

          return {

            key: group.key,

            question:
              baseFor(
                group,
                key
              )

          };

        }
      );


    /*
     * Iedere dag precies
     * één lettervraag maken.
     */

    const eligible =
      output.map(
        function (item, index) {

          return {

            index: index,

            variant:
              makeLetterQuestion(
                item.question,
                key
              )

          };

        }
      ).filter(
        function (item) {

          return Boolean(
            item.variant
          );

        }
      );


    if (!eligible.length) {
      return [];
    }


    const picked = shuffle(

      eligible,

      hash(
        SALT +
        "|letter|" +
        key
      )

    )[0];


    output[
      picked.index
    ].question = picked.variant;


    /*
     * De volgorde ook
     * dagelijks schudden.
     */

    return shuffle(

      output,

      hash(
        SALT +
        "|volgorde|" +
        key
      )

    );

  }


  /* ========================================
     LAATSTE 10 DAGEN CONTROLEREN

     Dit is een echte controle,
     niet alleen een logbericht.
  ======================================== */

  function checkHistory(key) {

    const today =
      select(key);

    const todayKeys =
      new Set(
        today.map(
          function (item) {

            return item.key;

          }
        )
      );


    for (
      let difference = 1;
      difference <= BLOCK_DAYS;
      difference++
    ) {

      const previous =
        select(
          nextDate(
            key,
            -difference
          )
        );


      const repeated =
        previous.some(
          function (item) {

            return todayKeys.has(
              item.key
            );

          }
        );


      if (repeated) {
        return false;
      }

    }


    return today.length === PER_DAY;

  }


  /* ========================================
     NEDERLANDSE KLOK
  ======================================== */

  function getClock() {

    const data = {

      hour: 0,

      minute: 0,

      second: 0

    };


    const parts =
      new Intl.DateTimeFormat(
        "nl-NL",
        {
          timeZone: TZ,

          hour: "2-digit",

          minute: "2-digit",

          second: "2-digit",

          hourCycle: "h23"
        }
      ).formatToParts(
        new Date()
      );


    parts.forEach(
      function (part) {

        if (
          part.type in data
        ) {

          data[part.type] =
            Number(
              part.value
            );

        }

      }
    );


    return data;

  }


  /* ========================================
     AFTELLER
  ======================================== */

  function countdown() {

    const clock =
      getClock();

    let seconds =
      86400 -

      (
        clock.hour * 3600 +
        clock.minute * 60 +
        clock.second
      );


    const hours =
      Math.floor(
        seconds / 3600
      );

    seconds %= 3600;

    const minutes =
      Math.floor(
        seconds / 60
      );

    const rest =
      seconds % 60;


    return [
      hours,
      minutes,
      rest
    ]
      .map(
        function (number) {

          return String(number)
            .padStart(
              2,
              "0"
            );

        }
      )
      .join(":");

  }


  /* ========================================
     RESULTAAT LADEN
  ======================================== */

  function getResult() {

    try {

      const result =
        JSON.parse(
          localStorage.getItem(
            STORAGE
          )
        );


      if (
        result &&
        result.date === current &&
        typeof result.score === "number" &&
        typeof result.height === "string"
      ) {

        return result;

      }


      return null;

    } catch (error) {

      return null;

    }

  }


  function isDone() {

    return Boolean(
      completed &&
      completed.date === current
    );

  }


  /* ========================================
     KNOPTEKST
  ======================================== */

  function setButton(
    button,
    title
  ) {

    if (!button) {
      return;
    }


    const text =
      document.createElement(
        "span"
      );

    text.textContent =
      title;


    const arrow =
      document.createElement(
        "span"
      );

    arrow.textContent =
      "↗";


    button.replaceChildren(
      text,
      arrow
    );

  }


  /* ========================================
     STARTSCHERM BIJWERKEN
  ======================================== */

  function updateHome() {

    if (ui.date) {

      ui.date.textContent =
        new Intl.DateTimeFormat(
          "nl-NL",
          {
            timeZone: TZ,

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric"
          }
        ).format(
          new Date()
        );

    }


    if (ui.countdown) {

      ui.countdown.textContent =
        countdown();

    }


    if (ui.status) {

      ui.status.textContent =
        isDone()
          ? "VOLTOOID ✓"
          : "BESCHIKBAAR";


      ui.status.classList.toggle(
        "completed",
        isDone()
      );

    }


    if (ui.desc) {

      if (isDone()) {

        ui.desc.textContent =
          "Je hebt vandaag " +
          completed.score +
          " punten gehaald en bereikte " +
          completed.height +
          ". Morgen een nieuwe vlucht!";

      } else {

        ui.desc.textContent =
          "Tien willekeurig gerouleerde " +
          "vragen. Dezelfde basisvraag " +
          "blijft tien dagen weg: " +
          "9 gewone vragen en " +
          "1 lettervraag.";

      }

    }


    ui.start.disabled =
      isDone() || !sufficient;


    setButton(

      ui.start,

      isDone()
        ? "MORGEN WEER VLIEGEN"
        : "START DE DAGELIJKSE VLUCHT"

    );


    if (ui.restart) {

      ui.restart.disabled =
        isDone() || !sufficient;


      setButton(

        ui.restart,

        isDone()
          ? "MORGEN WEER SPELEN"
          : "OPNIEUW VLIEGEN"

      );

    }

  }


  /* ========================================
     VOLTOOIING HERKENNEN
  ======================================== */

  function endCheck() {

    const visible =
      ui.end.classList.contains(
        "active"
      );


    if (!visible) {

      lastEnd = false;

      return;

    }


    if (lastEnd) {
      return;
    }


    lastEnd = true;


    if (
      startedDay !== current ||
      isDone()
    ) {
      return;
    }


    const score =
      Number(
        (
          ui.score?.textContent ||
          ""
        ).replace(
          /[^\d]/g,
          ""
        )
      );


    if (
      !Number.isFinite(
        score
      )
    ) {
      return;
    }


    completed = {

      date: current,

      score: score,

      height:
        (
          ui.height?.textContent ||
          ""
        ).trim(),

      correct:
        (
          ui.correct?.textContent ||
          ""
        ).trim(),

      completedAt:
        new Date().toISOString()

    };


    try {

      localStorage.setItem(

        STORAGE,

        JSON.stringify(
          completed
        )

      );

    } catch (error) {

      console.warn(
        "Daily resultaat kon " +
        "niet worden opgeslagen.",
        error
      );

    }


    startedDay = null;

    updateHome();


    if (ui.endMessage) {

      ui.endMessage.textContent =
        "📅 Daily Challenge voltooid! " +
        "Morgen om 00.00 uur " +
        "Nederlandse tijd verschijnen " +
        "nieuwe vragen.";

    }

  }


  /* ========================================
     KLOK BIJWERKEN
  ======================================== */

  function tick() {

    if (
      keyOfDate() !== current
    ) {

      window.location.reload();

      return;

    }


    if (ui.countdown) {

      ui.countdown.textContent =
        countdown();

    }

  }


  /* ========================================
     SPELSTART REGISTREREN
  ======================================== */

  function register() {

    if (
      !isDone() &&
      sufficient
    ) {

      startedDay = current;

      lastEnd = false;

    }

  }


  /* ========================================
     INITIALISEREN
  ======================================== */

  function initialize() {

    if (
      !ui.start ||
      !ui.end ||
      !ui.score
    ) {

      console.error(
        "Daily V6: vereiste " +
        "HTML-elementen ontbreken."
      );

      return;

    }


    /*
     * Nooit stiekem oude
     * vragen opnieuw gebruiken.
     */

    if (!sufficient) {

      console.error(

        "Daily V6: slechts " +
        ordered.length +
        " unieke basisvragen. " +
        "Minimaal " +
        REQUIRED +
        " nodig."

      );


      if (ui.desc) {

        ui.desc.textContent =
          "De vragenbank bevat " +
          ordered.length +
          " basisvragen. Er zijn " +
          REQUIRED +
          " nodig voor tien " +
          "dagen zonder herhaling.";

      }


      ui.start.disabled = true;

      return;

    }


    /*
     * Selectie én blokkade
     * controleren.
     */

    const today =
      select(current);


    if (
      today.length !== PER_DAY ||
      !checkHistory(current)
    ) {

      console.error(
        "Daily V6: controle van " +
        "de tien-dagenroulatie mislukt."
      );


      ui.start.disabled = true;

      return;

    }


    /*
     * Exact de 10 vragen
     * van vandaag beschikbaar
     * maken voor het spel.
     */

    window.QUIZBALLON_EXPANDED_QUESTIONS =
      today.map(
        function (item) {

          return item.question;

        }
      );


    window.QUIZBALLON_DAILY_INFO = {

      date:
        current,

      questionCount:
        PER_DAY,

      topics:
        today.map(
          function (item) {

            return item.key;

          }
        ),

      questions:
        today.map(
          function (item) {

            return item.question.question;

          }
        ),

      letterQuestionCount:
        today.filter(
          function (item) {

            return hasLetterVariant(
              item.question
            );

          }
        ).length,

      uniqueBaseQuestions:
        ordered.length

    };


    completed =
      getResult();


    updateHome();


    if (
      isDone() &&
      ui.endMessage
    ) {

      ui.endMessage.textContent =
        "📅 Daily Challenge voltooid! " +
        "Morgen verschijnen nieuwe vragen.";

    }


    /* START */

    ui.start.addEventListener(
      "click",
      register,
      true
    );


    /* OPNIEUW */

    if (ui.restart) {

      ui.restart.addEventListener(
        "click",
        register,
        true
      );

    }


    /* HOME */

    if (ui.home) {

      ui.home.addEventListener(
        "click",
        updateHome
      );

    }


    /* STOPPEN */

    if (ui.quit) {

      ui.quit.addEventListener(
        "click",
        function () {

          setTimeout(
            function () {

              if (
                ui.startScreen &&
                ui.startScreen.classList.contains(
                  "active"
                )
              ) {

                startedDay = null;

              }

            },
            0
          );

        }
      );

    }


    /* EINDSCHERM */

    const observer =
      new MutationObserver(
        endCheck
      );

    observer.observe(
      ui.end,
      {
        attributes: true,

        attributeFilter: [
          "class"
        ]
      }
    );


    /* TABBLAD */

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState ===
          "visible"
        ) {

          tick();

        }

      }
    );


    /* KLOK */

    setInterval(
      tick,
      1000
    );


    console.log(
      "✅ QuizBallon Daily V6 — " +
      "10 dagen zonder herhaling"
    );


    console.log(

      "Unieke basisvragen:",
      ordered.length,

      "Lettervragen vandaag:",
      window.QUIZBALLON_DAILY_INFO
        .letterQuestionCount

    );


    console.table(
      today.map(
        function (item, index) {

          return {

            nummer:
              index + 1,

            basis:
              item.key,

            vraag:
              item.question.question

          };

        }
      )
    );

  }


  /* ========================================
     TESTFUNCTIES

     Hiermee kun je ook zelf
     andere datums controleren.
  ======================================== */

  window.QUIZBALLON_DAILY_DEBUG = {

    topicKey: topicKey,

    totalUnique:
      ordered.length,

    required:
      REQUIRED,

    selectDate:
      function (key) {

        return select(key).map(
          function (item) {

            return {

              topic:
                item.key,

              vraag:
                item.question.question

            };

          }
        );

      },

    compare:
      function (
        firstDate,
        secondDate
      ) {

        const first =
          new Set(
            select(firstDate).map(
              function (item) {

                return item.key;

              }
            )
          );


        return select(secondDate)
          .filter(
            function (item) {

              return first.has(
                item.key
              );

            }
          )
          .map(
            function (item) {

              return item.key;

            }
          );

      },

    historyOK:
      checkHistory

  };


  initialize();

})();
