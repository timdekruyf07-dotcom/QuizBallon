/* ==========================================
   QUIZBALLON
   GESCHIEDENIS

   VERVANGT:
   Vraag 12 - Dinosauriërs

   NIEUWE VRAAG:
   Noem een historische persoon
   die vóór 1900 is geboren.

   - MEER DAN 50 ANTWOORDEN
   - VERSCHILLENDE SCORES
   - ALTERNATIEVE NAMEN
   - PRECIES 1 RAKETANTWOORD
========================================== */

(function () {
  "use strict";

  /*
   * De bestaande QuizBallon-code moet
   * eerst geladen zijn.
   */

  const questions =
    window.QUIZBALLON_EXPANDED_QUESTIONS;

  if (!Array.isArray(questions) || !questions[11]) {

    console.error(
      "QuizBallon: geschiedenisvraag kon niet worden geladen."
    );

    return;
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
     GESCHIEDENISVRAGENBANK

     FORMAAT:
     Naam|punten|alternatieve naam

     Iedere regel is één geldig antwoord.

     De punten zijn voorlopig inschattingen
     van hoe snel spelers aan de persoon
     zouden denken.

     Alleen Hypatia krijgt 100 punten.
  ======================================== */

  const HISTORY_ANSWERS = `

Albert Einstein|10|Einstein
Napoleon Bonaparte|12|Napoleon
Julius Caesar|14|Caesar
Cleopatra VII|16|Cleopatra
Leonardo da Vinci|12|Da Vinci|Leonardo
Isaac Newton|15|Newton
Christoffel Columbus|13|Columbus
Vincent van Gogh|11|Van Gogh
Rembrandt van Rijn|17|Rembrandt
Willem van Oranje|22|Willem de Zwijger
Alexander de Grote|18|Alexander III van Macedonië
Karel de Grote|26|Charlemagne
Lodewijk XIV|29|Zonnekoning
Marie Antoinette|23
Johannes Gutenberg|34|Gutenberg
Galileo Galilei|21|Galileo
Charles Darwin|19|Darwin
Marie Curie|20
Nikola Tesla|18|Tesla
Thomas Edison|16|Edison
Mozart|14|Wolfgang Amadeus Mozart
Ludwig van Beethoven|16|Beethoven
Johann Sebastian Bach|21|Bach
William Shakespeare|13|Shakespeare
Michelangelo|25|Michelangelo Buonarroti
Pablo Picasso|24|Picasso
Marco Polo|31
Dzjengis Khan|27|Genghis Khan
Jeanne d'Arc|32|Johanna van Arc
Ramses II|29|Ramses de Tweede
Toetanchamon|25|Tutankhamun
Hatshepsut|43
Nefertiti|34
Aristoteles|27
Plato|25
Socrates|24|Sokrates
Pythagoras|28
Hippocrates|36
Archimedes|32
Homerus|43
Confucius|41
Sun Tzu|45|Sunzi
Laozi|62|Lao Tse
Boudica|55|Boadicea
Hannibal Barkas|53|Hannibal
Spartacus|34
Augustus|42|Octavianus
Nero|34|Keizer Nero
Marcus Aurelius|46
Trajanus|64
Constantijn de Grote|51
Attila de Hun|40|Attila
Saladin|54|Salah ad-Din
Richard Leeuwenhart|47|Richard I
Eleonora van Aquitanië|66
Johannes van Salisbury|84
Hildegard van Bingen|73
Thomas van Aquino|69
Dante Alighieri|48|Dante
Geoffrey Chaucer|73|Chaucer
Niccolò Machiavelli|55|Machiavelli
Erasmus|42|Desiderius Erasmus
Maarten Luther|37|Martin Luther
Johannes Calvijn|53|Calvijn
Elisabeth I van Engeland|43|Elizabeth I
Maria Stuart|54|Mary Stuart
Catharina de Grote|49
Peter de Grote|47
Oliver Cromwell|62
Isaac Barrow|88
René Descartes|53|Descartes
Blaise Pascal|55|Pascal
Baruch Spinoza|58|Spinoza
John Locke|63
Voltaire|47
Jean-Jacques Rousseau|56|Rousseau
Immanuel Kant|57|Kant
David Hume|69
Adam Smith|63
Antoine Lavoisier|73|Lavoisier
Carl Linnaeus|70|Linnaeus
Ada Lovelace|57
Charles Babbage|60
Michael Faraday|58|Faraday
James Clerk Maxwell|71|Maxwell
Louis Pasteur|46|Pasteur
Gregor Mendel|66|Mendel
Dmitri Mendelejev|68|Mendeleev
Alexander Fleming|51|Fleming
Florence Nightingale|43
Harriet Tubman|65
Frederick Douglass|69
Abraham Lincoln|25|Lincoln
George Washington|26|Washington
Benjamin Franklin|31|Franklin
Thomas Jefferson|39|Jefferson
John Adams|62
Ulysses S. Grant|74|Ulysses Grant
Queen Victoria|38|Koningin Victoria
Wilhelmina der Nederlanden|33|Koningin Wilhelmina
Aletta Jacobs|59
Anna Maria van Schurman|86
Christiaan Huygens|57|Huygens
Antonie van Leeuwenhoek|49|Van Leeuwenhoek
Hugo de Groot|64|Grotius
Michiel de Ruyter|36|De Ruyter
Piet Hein|46
Abel Tasman|62
Willem Barentsz|59|Willem Barents
James Cook|41|Captain Cook
Ferdinand Magellaan|42|Magellan
Vasco da Gama|45
Amerigo Vespucci|58
Roald Amundsen|53|Amundsen
Robert Falcon Scott|68|Robert Scott
Ernest Shackleton|58|Shackleton
David Livingstone|72
Ibn Battuta|76
Zheng He|81
Mansa Musa|67
Shaka Zulu|65|Shaka
Süleyman de Grote|72|Suleiman de Grote
Mehmed II|75|Mehmed de Veroveraar
Akbar de Grote|78
Ashoka|74|Asoka
Rani Lakshmibai|83
Oda Nobunaga|77
Toyotomi Hideyoshi|84
Tokugawa Ieyasu|77
Murasaki Shikibu|89
Sei Shonagon|93|Sei Shōnagon
Ibn Sina|81|Avicenna
Al-Khwarizmi|88|Al Chwarizmi
Omar Khayyam|82
Al-Biruni|92
Mary Anning|78
Caroline Herschel|80
William Herschel|73
Émilie du Châtelet|89|Emilie du Chatelet
Lise Meitner|83
Henrietta Swan Leavitt|91|Henrietta Leavitt
Srinivasa Ramanujan|84|Ramanujan
Emmy Noether|89
Sophie Germain|88
Évariste Galois|91|Evariste Galois
Hypatia van Alexandrië|100|Hypatia

`;


  /* ========================================
     ANTWOORDEN OMZETTEN
  ======================================== */

  function parseAnswers(text) {

    return text
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean)
      .map(function (line) {

        const parts = line.split("|");

        const name = parts[0].trim();

        const score = Math.max(
          10,
          Math.min(100, Number(parts[1]) || 10)
        );

        const aliases = parts
          .slice(2)
          .map(function (alias) {
            return alias.trim();
          })
          .filter(Boolean);

        return {

          answer: name,

          points: score,

          aliases: aliases,

          isRocket:
            normalize(name) ===
            normalize("Hypatia van Alexandrië")

        };

      });

  }


  /* ========================================
     DUBBELE NAMEN VOORKOMEN
  ======================================== */

  function removeDuplicates(answers) {

    const seen = new Set();

    const result = [];

    answers.forEach(function (answer) {

      const key = normalize(answer.answer);

      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);

      result.push(answer);

    });

    return result;

  }


  /* ========================================
     NIEUWE GESCHIEDENISVRAAG

     We vervangen de hele dinosauriërlijst.
     Daardoor kunnen dinosauriërs niet
     meer worden goedgekeurd bij deze vraag.
  ======================================== */

  const historyQuestion = {

    category: "🏛️ GESCHIEDENIS",

    question:
      "Noem een historische persoon die vóór 1900 is geboren.",

    hint:
      "Denk aan uitvinders, wetenschappers, kunstenaars, " +
      "heersers en andere belangrijke personen uit de geschiedenis.",

    answers: removeDuplicates(
      parseAnswers(HISTORY_ANSWERS)
    )

  };


  /* ========================================
     CONTROLE:
     PRECIES ÉÉN RAKETANTWOORD
  ======================================== */

  const rocketCount =
    historyQuestion.answers.filter(
      function (answer) {

        return answer.isRocket;

      }
    ).length;

  if (rocketCount !== 1) {

    console.error(
      "QuizBallon Geschiedenis: er moet precies één raketantwoord zijn."
    );

    return;

  }


  /* ========================================
     VRAAG 12 VERVANGEN
  ======================================== */

  questions[11] = historyQuestion;


  /* ========================================
     TESTINFORMATIE
  ======================================== */

  console.log(
    "🏛️ QuizBallon: Geschiedenis is toegevoegd!"
  );

  console.log(
    "Aantal geschiedenisantwoorden:",
    historyQuestion.answers.length
  );

  console.log(
    "🚀 Raketantwoord: Hypatia van Alexandrië"
  );

})();
