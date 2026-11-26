/* =============================================================
   QUIZBALLON - 100 EXTRA DAGELIJKSE VRAGEN

   Dit pakket bouwt 100 afzonderlijke vraagvarianten op basis
   van de bestaande 26 kennisvragen en hun antwoordbanken.

   LET OP: 100 NIEUWE VRAGEN IS NIET HETZELFDE ALS
   100 NIEUWE ONDERWERPEN. De nieuwe vragen bevatten
   duidelijke extra naameisen (letters / woordlengte).

   Elke toegevoegde vraag heeft:
   - minimaal 50 passende, reeds bekende antwoorden;
   - één raketantwoord van 100 punten;
   - dezelfde controle op aliassen als de basisvragen;
   - een eigen vraagtekst voor het antwoordenoverzicht.

   LAAD DIT BESTAND NA vragen-uitbreiding.js
   EN VOOR daily.js.
============================================================= */

(function () {
  "use strict";

  const bank = window.QUIZBALLON_EXPANDED_QUESTIONS;

  const REQUIRED = 100;
  const MIN_ANSWERS = 50;

  if (!Array.isArray(bank) || bank.length < 20) {
    console.error(
      "QuizBallon: de bestaande uitgebreide vragenbank ontbreekt."
    );
    return;
  }

  /*
   * Gebruik uitsluitend de oorspronkelijke vragen.
   * Anders zouden de nieuwe varianten zichzelf
   * bij een volgende uitbreiding dupliceren.
   */

  const baseQuestions = bank.slice();


  /* ========================================
     ANTWOORDEN NORMALISEREN
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

  function letters(value) {
    return normalize(value).replace(/[^a-z]/g, "");
  }

  function vowelCount(value) {
    return (
      letters(value).match(/[aeiou]/g) || []
    ).length;
  }

  function consonantCount(value) {
    return (
      letters(value).match(
        /[bcdfghjklmnpqrstvwxyz]/g
      ) || []
    ).length;
  }


  /* ========================================
     EXTRA VRAGENREGELS

     Elke regel maakt een andere vraag.

     Voorbeeld:
     Noem een hondenras.
     Extra eis: de naam heeft minstens
     5 letters.

     De regels zijn objectief te testen.
  ======================================== */

  const rules = [

    {
      label: "De naam heeft minstens 5 letters",
      test: name => letters(name).length >= 5
    },

    {
      label: "De naam bevat de letter A of E",
      test: name => /[ae]/.test(letters(name))
    },

    {
      label:
        "De naam begint met een letter van A tot en met R",
      test: name => /^[a-r]/.test(letters(name))
    },

    {
      label: "De naam heeft minstens 2 klinkers",
      test: name => vowelCount(name) >= 2
    },

    {
      label: "De naam bevat een N, R of S",
      test: name => /[nrs]/.test(letters(name))
    },

    {
      label: "De naam begint met een medeklinker",
      test: name =>
        /^[bcdfghjklmnpqrstvwxyz]/.test(
          letters(name)
        )
    },

    {
      label: "De naam heeft minstens 6 letters",
      test: name => letters(name).length >= 6
    },

    {
      label: "De naam bevat een I, O of U",
      test: name => /[iou]/.test(letters(name))
    },

    {
      label:
        "De naam begint met een letter van D tot en met Z",
      test: name => /^[d-z]/.test(letters(name))
    },

    {
      label: "De naam bevat een L, M of T",
      test: name => /[lmt]/.test(letters(name))
    },

    {
      label: "De naam bevat minstens 3 medeklinkers",
      test: name => consonantCount(name) >= 3
    },

    {
      label: "De naam bevat minstens 3 klinkers",
      test: name => vowelCount(name) >= 3
    },

    {
      label:
        "De naam begint met een letter van A tot en met T",
      test: name => /^[a-t]/.test(letters(name))
    },

    {
      label: "De naam eindigt op een medeklinker",
      test: name =>
        /[bcdfghjklmnpqrstvwxyz]$/.test(
          letters(name)
        )
    },

    {
      label:
        "De naam bevat minstens twee verschillende klinkers",

      test: name =>
        new Set(
          letters(name).match(/[aeiou]/g) || []
        ).size >= 2
    },

    {
      label: "De naam bevat een B, D, G of K",
      test: name => /[bdgk]/.test(letters(name))
    },

    {
      label:
        "De naam begint met een letter van B tot en met Z",
      test: name => /^[b-z]/.test(letters(name))
    },

    {
      label: "De naam heeft minstens 4 letters",
      test: name => letters(name).length >= 4
    },

    {
      label: "De naam bevat de letter E, I of O",
      test: name => /[eio]/.test(letters(name))
    },

    {
      label:
        "De naam begint met een letter van A tot en met U",
      test: name => /^[a-u]/.test(letters(name))
    },

    {
      label: "De naam heeft minstens 2 medeklinkers",
      test: name => consonantCount(name) >= 2
    },

    {
      label: "De naam bevat de letter A, O of U",
      test: name => /[aou]/.test(letters(name))
    },

    {
      label:
        "De naam begint niet met de letter Q, X of Z",

      test: name =>
        !/^[qxz]/.test(letters(name))
    },

    {
      label:
        "De naam bevat de letter A, E, I, O of U",

      test: name => vowelCount(name) >= 1
    }

  ];


  /* ========================================
     ANTWOORD KOPIËREN

     Bestaande punten blijven behouden,
     behalve het nieuwe raketantwoord.

     Alternatieve namen mogen alleen
     mee als ze ook aan de nieuwe
     vraagregel voldoen.
  ======================================== */

  function copyAnswer(answer, rule) {

    const validAliases = (answer.aliases || [])

      .filter(alias => rule.test(alias))

      .filter(
        alias =>
          normalize(alias) !==
          normalize(answer.answer)
      );

    return {

      answer: answer.answer,

      aliases: [
        ...new Set(validAliases)
      ],

      points: Math.min(
        99,

        Math.max(
          10,
          Math.round(Number(answer.points) || 10)
        )
      ),

      isRocket: false

    };

  }


  /* ========================================
     NIEUWE VRAAG MAKEN

     Een vraag wordt alleen gemaakt
     als minstens 50 bekende antwoorden
     aan de extra eis voldoen.
  ======================================== */

  function createQuestion(base, rule) {

    if (
      !base ||
      !Array.isArray(base.answers)
    ) {
      return null;
    }

    const seen = new Set();

    const matches = [];

    base.answers.forEach(answer => {

      if (
        !answer ||
        !rule.test(answer.answer)
      ) {
        return;
      }

      const key = normalize(answer.answer);

      if (
        !key ||
        seen.has(key)
      ) {
        return;
      }

      seen.add(key);

      matches.push(
        copyAnswer(answer, rule)
      );

    });


    /* MINIMAAL 50 ANTWOORDEN */

    if (matches.length < MIN_ANSWERS) {
      return null;
    }


    /* ======================================
       ÉÉN RAKETANTWOORD

       We kiezen het antwoord dat in
       de bestaande database het
       hoogste aantal punten had.
    ====================================== */

    matches.sort(
      (a, b) =>

        b.points - a.points ||

        a.answer.localeCompare(
          b.answer,
          "nl"
        )
    );

    matches[0].points = 100;

    matches[0].isRocket = true;


    /* ======================================
       VRAAGTEKST
    ====================================== */

    const original = String(
      base.question || ""
    ).trim();

    const sentence =
      /[.!?]$/.test(original)

        ? original

        : original + ".";


    /* ======================================
       COMPLETE NIEUWE VRAAG
    ====================================== */

    return {

      category: base.category,

      question:
        sentence +
        " Extra eis: " +
        rule.label +
        ".",

      hint:
        "Alleen namen die aan de extra eis " +
        "voldoen, tellen mee. " +
        "Er zijn minstens 50 geldige antwoorden. " +
        "Een alternatieve naam moet zelf ook " +
        "aan de eis voldoen.",

      answers: matches

    };

  }


  /* ========================================
     VRAGEN VERDELEN

     We maken niet eerst tientallen
     varianten van één onderwerp.

     In plaats daarvan krijgt ieder
     bestaand onderwerp om de beurt
     een nieuwe vraag.

     Dat zorgt voor een evenwichtigere
     verdeling over de categorieën.
  ======================================== */

  const candidates = baseQuestions.map(
    base => ({

      base: base,

      variants: rules
        .map(rule => createQuestion(base, rule))
        .filter(Boolean),

      used: 0

    })
  );


  /* ========================================
     DUBBELE VRAGEN VOORKOMEN
  ======================================== */

  const additions = [];

  const existingTexts = new Set(
    baseQuestions.map(
      question => normalize(question.question)
    )
  );


  /* ========================================
     PRECIES 100 EXTRA VRAGEN MAKEN
  ======================================== */

  let round = 0;

  while (
    additions.length < REQUIRED &&
    round < rules.length
  ) {

    for (const candidate of candidates) {

      if (additions.length >= REQUIRED) {
        break;
      }

      const next = candidate.variants[round];

      if (!next) {
        continue;
      }

      const key = normalize(next.question);

      if (existingTexts.has(key)) {
        continue;
      }

      existingTexts.add(key);

      additions.push(next);

      candidate.used += 1;

    }

    round += 1;

  }


  /* ========================================
     VEILIGHEIDSCONTROLE

     Als er niet genoeg geldige
     varianten zijn, voegen we
     geen onvolledig pakket toe.
  ======================================== */

  if (additions.length !== REQUIRED) {

    console.error(

      "QuizBallon: kon geen 100 nieuwe vragen samenstellen.",

      "Aantal geldige varianten:",

      additions.length,

      "Controleer of vragen-uitbreiding.js goed wordt geladen."

    );

    return;

  }


  /* ========================================
     TOEVOEGEN AAN QUIZBALLON

     Alle 100 vragen worden toegevoegd
     voordat daily.js de 10 vragen
     voor vandaag selecteert.
  ======================================== */

  bank.push(...additions);


  /* ========================================
     CONTROLE IN DE BROWSERCONSOLE
  ======================================== */

  window.QUIZBALLON_EXTRA_100_COUNT =
    additions.length;

  console.log(

    "🎈 QuizBallon: precies " +
    additions.length +
    " extra vragen geladen! " +
    "Totaal: " +
    bank.length +
    " vragen."

  );


  /* ========================================
     VERDELING PER CATEGORIE
  ======================================== */

  console.table(

    additions.reduce(
      (rows, question) => {

        const name =
          question.category || "Overig";

        const found = rows.find(
          row => row.categorie === name
        );

        if (found) {

          found.vragen++;

        } else {

          rows.push({

            categorie: name,

            vragen: 1

          });

        }

        return rows;

      },
      []
    )

  );

})();
