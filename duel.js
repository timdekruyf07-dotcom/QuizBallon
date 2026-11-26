/* ============================================================
   QUIZBALLON DUEL - SPEELBARE TESTVERSIE

   SPELREGELS:
   - 2 spelers
   - 2 levens bij start
   - maximaal 3 levens
   - 250 punten voor een extra leven
   - 12 seconden per beurt
   - maximaal 12 goede antwoorden per vraag
   - dubbele antwoorden verboden
   - bij mislukking 1 leven verliezen
   - tegenstander krijgt nog één beurt
   - daarna automatisch nieuwe vraag

   Firebase Realtime Database synchroniseert
   de spelstatus tussen beide spelers.

   LET OP:
   Antwoordcontrole gebeurt in de browser.
   Deze versie is nog niet fraudebestendig.
============================================================ */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";


/* ============================================================
   FIREBASE-CONFIGURATIE
============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyB7eejfy_9B3ibVguN6AORzP8BRe5XG43g",
  authDomain: "quizballon.firebaseapp.com",
  databaseURL: "https://quizballon-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "quizballon",
  storageBucket: "quizballon.firebasestorage.app",
  messagingSenderId: "883055960100",
  appId: "1:883055960100:web:98a48a205954471d6fb8b1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


/* ============================================================
   SPELINSTELLINGEN
============================================================ */

const TURN_SECONDS = 12;
const TURN_DURATION = TURN_SECONDS * 1000;

const MAX_ANSWERS_PER_QUESTION = 12;

const START_LIVES = 2;
const MAX_LIVES = 3;

const POINTS_FOR_EXTRA_LIFE = 250;

const ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const NAME_PATTERN =
  /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 ._-]{1,17}$/;


/* ============================================================
   HTML-ELEMENTEN
============================================================ */

const byId = id => document.getElementById(id);

const ui = {
  connectionStatus: byId("connection-status"),
  lobbyStart: byId("lobby-start"),

  playerName: byId("player-name"),
  roomInput: byId("room-input"),

  createButton: byId("create-button"),
  joinButton: byId("join-button"),

  roomPanel: byId("room-panel"),
  roomCode: byId("room-code"),
  copyButton: byId("copy-button"),

  hostCard: byId("host-card"),
  guestCard: byId("guest-card"),

  hostName: byId("host-name"),
  guestName: byId("guest-name"),

  hostHearts: byId("host-hearts"),
  guestHearts: byId("guest-hearts"),

  hostScore: byId("host-score"),
  guestScore: byId("guest-score"),

  hostProgress: byId("host-progress"),
  guestProgress: byId("guest-progress"),

  hostStatus: byId("host-status"),
  guestStatus: byId("guest-status"),

  roomStatus: byId("room-status"),

  startDuelButton: byId("start-duel-button"),

  gameSection: byId("game-section"),

  roundDisplay: byId("round-display"),
  turnTimer: byId("turn-timer"),

  questionCategory: byId("question-category"),
  questionText: byId("question-text"),

  turnMessage: byId("turn-message"),

  answerForm: byId("answer-form"),
  answerInput: byId("answer-input"),
  answerButton: byId("answer-button"),

  answerFeedback: byId("answer-feedback"),

  usedCount: byId("used-count"),
  usedList: byId("used-list"),

  lastEvent: byId("last-event"),

  winnerSection: byId("winner-section"),
  winnerTitle: byId("winner-title"),
  winnerDescription: byId("winner-description"),

  newRoomButton: byId("new-room-button")
};


/* ============================================================
   VRAGENBANK

   De vragen komen uit vragen-uitbreiding.js.

   We gebruiken een eigen selectie voor Duel,
   zodat deze modus onafhankelijk blijft van
   de dagelijkse vraagselectie.

   Twee categorieën uit de eerste uitbreiding
   worden voorlopig niet gebruikt:
   - historische vrouwen
   - sterrenbeelden

   Die antwoordlijsten bevatten nog enkele
   eerder gesignaleerde dataproblemen.
============================================================ */

function loadDuelQuestions() {
  const bank =
    window.QUIZBALLON_EXPANDED_QUESTIONS || [];

  return bank.filter(question => {
    if (
      !question ||
      typeof question.question !== "string" ||
      !Array.isArray(question.answers)
    ) {
      return false;
    }

    const text = question.question.toLowerCase();

    if (text.includes("historische vrouw")) {
      return false;
    }

    if (
      text.includes("bekende vrouw") &&
      text.includes("geschiedenis")
    ) {
      return false;
    }

    if (text.includes("sterrenbeeld")) {
      return false;
    }

    return question.answers.length >= 50;
  });
}

const questions = loadDuelQuestions();


/* ============================================================
   LOKALE STATUS
============================================================ */

let currentUser = null;

let currentRoomCode = null;
let currentRoom = null;

let myRole = null;

let stopRoomListener = null;

let serverTimeOffset = 0;

let busy = false;
let sendingAnswer = false;
let processingTimeout = false;

let previousQuestionKey = "";
let previousEventNumber = -1;


/* ============================================================
   STATUSBERICHTEN
============================================================ */

function setConnectionStatus(message, type = "") {
  ui.connectionStatus.textContent = message;
  ui.connectionStatus.className =
    "status " + type;
}

function setRoomStatus(message, type = "") {
  ui.roomStatus.textContent = message;
  ui.roomStatus.className =
    "status " + type;
}

function setFeedback(message, type = "") {
  ui.answerFeedback.textContent = message;
  ui.answerFeedback.className =
    "feedback " + type;
}

function updateLobbyButtons() {
  const enabled =
    Boolean(currentUser) &&
    questions.length > 0 &&
    !busy;

  ui.createButton.disabled = !enabled;
  ui.joinButton.disabled = !enabled;
}


/* ============================================================
   TEKST NORMALISEREN

   Bijvoorbeeld:
   "São Paulo" -> "sao paulo"
============================================================ */

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


/* ============================================================
   ANTWOORDGEGEVENS LEZEN
============================================================ */

function getAnswerName(answer) {
  if (typeof answer === "string") {
    return answer;
  }

  return String(
    answer.answer ||
    answer.name ||
    ""
  );
}

function getAnswerAliases(answer) {
  if (!answer || typeof answer !== "object") {
    return [];
  }

  if (Array.isArray(answer.aliases)) {
    return answer.aliases;
  }

  if (typeof answer.aliases === "string") {
    return answer.aliases.split("|");
  }

  return [];
}

function getAnswerPoints(answer) {
  if (!answer || typeof answer !== "object") {
    return 10;
  }

  if (answer.isRocket === true) {
    return 100;
  }

  const points = Number(answer.points);

  if (Number.isFinite(points) && points > 0) {
    return Math.max(
      10,
      Math.min(100, Math.round(points))
    );
  }

  const rarity = Number(answer.rarity);

  if (Number.isFinite(rarity)) {
    return Math.max(
      10,
      Math.min(99, Math.round(9 + rarity * .86))
    );
  }

  return 10;
}


/* ============================================================
   ANTWOORD ZOEKEN

   Een alias telt als hetzelfde antwoord
   als de officiële naam.

   Daardoor kun je niet opnieuw punten
   krijgen door alleen een synoniem
   van hetzelfde antwoord te gebruiken.
============================================================ */

function findAnswer(question, typedAnswer) {
  const wanted = normalize(typedAnswer);

  if (!wanted) {
    return null;
  }

  for (let i = 0; i < question.answers.length; i++) {
    const answer = question.answers[i];

    const names = [
      getAnswerName(answer),
      ...getAnswerAliases(answer)
    ];

    if (
      names.some(name => normalize(name) === wanted)
    ) {
      return {
        index: i,
        key: "a" + i,
        name: getAnswerName(answer),
        points: getAnswerPoints(answer)
      };
    }
  }

  return null;
}


/* ============================================================
   ROOMCODE GENEREREN
============================================================ */

function generateRoomCode() {
  const bytes = new Uint8Array(6);

  crypto.getRandomValues(bytes);

  let code = "";

  for (const byte of bytes) {
    code += ALPHABET[
      byte % ALPHABET.length
    ];
  }

  return code;
}

function cleanRoomCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

function getPlayerName() {
  const name = ui.playerName.value.trim();

  if (!NAME_PATTERN.test(name)) {
    setConnectionStatus(
      "❌ Kies een spelersnaam van 2 tot 18 tekens.",
      "error"
    );

    ui.playerName.focus();
    return null;
  }

  return name;
}


/* ============================================================
   SERVERKLOK

   Firebase geeft het geschatte
   tijdsverschil met de server door.

   Beide spelers gebruiken daardoor
   ongeveer dezelfde tijd.
============================================================ */

function serverNow() {
  return Date.now() + serverTimeOffset;
}

onValue(
  ref(database, ".info/serverTimeOffset"),
  snapshot => {
    serverTimeOffset = Number(snapshot.val()) || 0;
  }
);


/* ============================================================
   VRAAGINDEX BEPALEN

   De roomcode bepaalt de eerste vraag.

   De index wordt opgeslagen in Firebase,
   zodat beide spelers dezelfde vraag zien.
============================================================ */

function firstQuestionIndex(code) {
  let hash = 0;

  for (const character of code) {
    hash = (
      Math.imul(hash, 31) +
      character.charCodeAt(0)
    ) >>> 0;
  }

  return hash % questions.length;
}

function getQuestion(game) {
  if (!game) {
    return null;
  }

  return questions[game.questionIndex] || null;
}


/* ============================================================
   SPELERSROL
============================================================ */

function otherRole(role) {
  return role === "host" ? "guest" : "host";
}

function getRoleName(role) {
  if (!currentRoom) {
    return role === "host" ? "Speler 1" : "Speler 2";
  }

  if (role === "host") {
    return currentRoom.hostName || "Speler 1";
  }

  return currentRoom.guest?.name || "Speler 2";
}


/* ============================================================
   LEVENS WEERGEVEN
============================================================ */

function hearts(lives) {
  const count = Math.max(
    0,
    Math.min(MAX_LIVES, Number(lives) || 0)
  );

  return (
    "❤️".repeat(count) +
    "🖤".repeat(MAX_LIVES - count)
  );
}


/* ============================================================
   ROOM TONEN
============================================================ */

function showRoom(code) {
  currentRoomCode = code;

  ui.lobbyStart.hidden = true;
  ui.roomPanel.hidden = false;

  ui.roomCode.textContent = code;

  setRoomStatus(
    "⏳ Verbinding maken met de room..."
  );
}


/* ============================================================
   ROOM LIVE VOLGEN
============================================================ */

function listenToRoom(code) {
  if (stopRoomListener) {
    stopRoomListener();
  }

  const roomReference = ref(
    database,
    "duelRooms/" + code
  );

  stopRoomListener = onValue(
    roomReference,

    snapshot => {
      if (!snapshot.exists()) {
        setRoomStatus(
          "❌ Deze room bestaat niet meer.",
          "error"
        );

        return;
      }

      const room = snapshot.val();

      currentRoom = room;

      if (room.hostUid === currentUser.uid) {
        myRole = "host";
      } else if (
        room.guest?.uid === currentUser.uid
      ) {
        myRole = "guest";
      } else {
        myRole = null;
      }

      if (!myRole) {
        setRoomStatus(
          "❌ Je bent geen speler in deze room.",
          "error"
        );

        return;
      }

      updateRoomInterface(room);
    },

    error => {
      console.error(error);

      setRoomStatus(
        "❌ De room kon niet worden gelezen. " +
        "Controleer je Firebase Rules.",
        "error"
      );
    }
  );
}


/* ============================================================
   ROOM AANMAKEN
============================================================ */

async function createRoom() {
  if (!currentUser || busy) {
    return;
  }

  const name = getPlayerName();

  if (!name) {
    return;
  }

  busy = true;
  updateLobbyButtons();

  setConnectionStatus(
    "🏠 Room aanmaken..."
  );

  try {
    let lastError = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateRoomCode();

      const roomReference = ref(
        database,
        "duelRooms/" + code
      );

      try {
        await set(roomReference, {
          hostUid: currentUser.uid,
          hostName: name,
          createdAt: serverTimestamp()
        });

        showRoom(code);
        listenToRoom(code);

        setConnectionStatus(
          "✅ Room aangemaakt!",
          "success"
        );

        return;

      } catch (error) {
        lastError = error;

        if (
          error.code !== "PERMISSION_DENIED" &&
          error.code !== "permission-denied"
        ) {
          throw error;
        }
      }
    }

    throw lastError || new Error(
      "Kon geen vrije roomcode vinden."
    );

  } catch (error) {
    console.error(error);

    setConnectionStatus(
      "❌ Room aanmaken mislukt. " +
      "Controleer de Firebase Rules.",
      "error"
    );

  } finally {
    busy = false;
    updateLobbyButtons();
  }
}


/* ============================================================
   DEELNEMEN AAN ROOM
============================================================ */

async function joinRoom() {
  if (!currentUser || busy) {
    return;
  }

  const name = getPlayerName();

  if (!name) {
    return;
  }

  const code = cleanRoomCode(
    ui.roomInput.value
  );

  if (code.length !== 6) {
    setConnectionStatus(
      "❌ Vul een code van 6 tekens in.",
      "error"
    );

    return;
  }

  busy = true;
  updateLobbyButtons();

  setConnectionStatus(
    "🔄 Deelnemen aan room " + code + "..."
  );

  try {
    await set(
      ref(database, "duelRooms/" + code + "/guest"),
      {
        uid: currentUser.uid,
        name
      }
    );

    showRoom(code);
    listenToRoom(code);

    setConnectionStatus(
      "✅ Je bent lid van de room!",
      "success"
    );

  } catch (error) {
    console.error(error);

    setConnectionStatus(
      "❌ Deelnemen mislukt. " +
      "Controleer de code of probeer een nieuwe room.",
      "error"
    );

  } finally {
    busy = false;
    updateLobbyButtons();
  }
}


/* ============================================================
   BEGINSTATUS VAN EEN DUEL
============================================================ */

function makeInitialGame(code) {
  return {
    status: "playing",

    questionIndex: firstQuestionIndex(code),
    round: 1,

    turn: "host",
    turnCount: 0,

    deadline: Math.round(
      serverNow() + TURN_DURATION
    ),

    hostLives: START_LIVES,
    guestLives: START_LIVES,

    hostScore: 0,
    guestScore: 0,

    hostProgress: 0,
    guestProgress: 0,

    bonusTurn: false,
    resetStarter: "host",

    winner: "",

    lastEvent: "⚔️ Het duel is begonnen!",
    eventNumber: 1
  };
}


/* ============================================================
   DUEL STARTEN

   Alleen de host kan het eerste
   spelobject aanmaken.

   Firebase zorgt dat dit slechts
   één keer kan gebeuren.
============================================================ */

async function startDuel() {
  if (
    !currentRoomCode ||
    !currentRoom?.guest ||
    myRole !== "host"
  ) {
    return;
  }

  ui.startDuelButton.disabled = true;

  try {
    const gameReference = ref(
      database,
      "duelRooms/" + currentRoomCode + "/game"
    );

    const result = await runTransaction(
      gameReference,
      existingGame => {
        if (existingGame !== null) {
          return;
        }

        return makeInitialGame(currentRoomCode);
      },
      {
        applyLocally: false
      }
    );

    if (!result.committed) {
      setRoomStatus(
        "Het duel is al gestart."
      );
    }

  } catch (error) {
    console.error(error);

    setRoomStatus(
      "❌ Het duel kon niet starten. " +
      "Controleer de Firebase Rules.",
      "error"
    );

  } finally {
    ui.startDuelButton.disabled = false;
  }
}


/* ============================================================
   VOLGENDE VRAAG

   Wordt gebruikt:
   - na 12 goede antwoorden;
   - na de laatste beurt die volgt
     op een verloren leven.

   Alle gebruikte antwoorden worden
   voor de nieuwe vraag gewist.
============================================================ */

function advanceQuestion(
  game,
  nextStarter,
  time
) {
  game.questionIndex =
    (game.questionIndex + 1) % questions.length;

  game.round += 1;

  game.turn = nextStarter;
  game.turnCount = 0;

  game.deadline = Math.round(
    time + TURN_DURATION
  );

  game.bonusTurn = false;
  game.resetStarter = nextStarter;

  delete game.used;
}


/* ============================================================
   PUNTEN EN EXTRA LEVENS

   Iedere speler houdt:
   - totale score;
   - voortgang tot extra leven.

   De totale score wordt niet gereset
   wanneer een extra leven verdiend is.
============================================================ */

function addPoints(game, role, points) {
  const scoreKey = role + "Score";
  const progressKey = role + "Progress";
  const livesKey = role + "Lives";

  game[scoreKey] += points;
  game[progressKey] += points;

  let extraLife = false;

  if (
    game[progressKey] >= POINTS_FOR_EXTRA_LIFE &&
    game[livesKey] < MAX_LIVES
  ) {
    game[progressKey] -= POINTS_FOR_EXTRA_LIFE;
    game[livesKey] += 1;

    extraLife = true;
  }

  /*
   * Bij maximaal 3 levens wordt de
   * voortgang vastgehouden op 249.

   * Na het verliezen van een leven
   * kan de speler opnieuw punten
   * verdienen voor herstel.
   */

  if (
    game[progressKey] >= POINTS_FOR_EXTRA_LIFE
  ) {
    game[progressKey] =
      POINTS_FOR_EXTRA_LIFE - 1;
  }

  return extraLife;
}


/* ============================================================
   GEBRUIKT ANTWOORD CONTROLEREN
============================================================ */

function isAlreadyUsed(game, key) {
  return Boolean(
    game.used &&
    game.used[key]
  );
}


/* ============================================================
   ANTWOORD VERSTUREN

   1. Controleer of het jouw beurt is.
   2. Controleer of de timer nog loopt.
   3. Zoek het antwoord in de vragenbank.
   4. Controleer of het al gebruikt is.
   5. Sla punten en volgende beurt op.

   De Firebase-transactie voorkomt dat
   twee gelijktijdige updates elkaar
   zomaar overschrijven.
============================================================ */

async function submitAnswer(event) {
  event.preventDefault();

  if (
    !currentRoom?.game ||
    !myRole ||
    sendingAnswer
  ) {
    return;
  }

  const game = currentRoom.game;

  if (
    game.status !== "playing" ||
    game.turn !== myRole
  ) {
    setFeedback(
      "⏳ Je bent nog niet aan de beurt.",
      "bad"
    );

    return;
  }

  if (serverNow() >= game.deadline) {
    setFeedback(
      "⏱️ Je tijd is voorbij.",
      "bad"
    );

    return;
  }

  const typed = ui.answerInput.value.trim();

  const question = getQuestion(game);

  if (!question) {
    setFeedback(
      "❌ De vraag kon niet worden geladen.",
      "bad"
    );

    return;
  }

  const answer = findAnswer(question, typed);

  if (!answer) {
    setFeedback(
      "❌ Dit antwoord staat niet in de antwoordenbank. " +
      "Je mag opnieuw proberen zolang je tijd hebt.",
      "bad"
    );

    return;
  }

  if (isAlreadyUsed(game, answer.key)) {
    setFeedback(
      "🚫 Dit antwoord is al gegeven! " +
      "Probeer een ander antwoord.",
      "bad"
    );

    return;
  }

  sendingAnswer = true;
  ui.answerButton.disabled = true;

  try {
    const gameReference = ref(
      database,
      "duelRooms/" + currentRoomCode + "/game"
    );

    const result = await runTransaction(
      gameReference,

      currentGame => {
        if (
          !currentGame ||
          currentGame.status !== "playing" ||
          currentGame.turn !== myRole ||
          serverNow() >= currentGame.deadline
        ) {
          return;
        }

        /*
         * Controleer opnieuw, omdat
         * de tegenstander intussen
         * een update kan hebben gedaan.
         */

        if (
          isAlreadyUsed(currentGame, answer.key)
        ) {
          return;
        }

        const next = structuredClone(currentGame);

        if (!next.used) {
          next.used = {};
        }

        next.used[answer.key] = {
          name: answer.name,
          by: myRole,
          points: answer.points,
          order: next.turnCount + 1
        };

        next.turnCount += 1;

        const earnedLife = addPoints(
          next,
          myRole,
          answer.points
        );

        const playerLabel =
          getRoleName(myRole);

        next.lastEvent =
          "✅ " + playerLabel +
          ": " + answer.name +
          " (+" + answer.points + " punten)" +
          (earnedLife ? " 💖 EXTRA LEVEN!" : "");

        next.eventNumber += 1;

        const now = serverNow();

        /*
         * Was dit de laatste kans
         * van de tegenstander na
         * een verloren leven?
         */

        if (next.bonusTurn) {
          advanceQuestion(
            next,
            next.resetStarter,
            now
          );

          return next;
        }

        /*
         * Na 12 goede antwoorden
         * begint een nieuwe vraag.
         */

        if (
          next.turnCount >=
          MAX_ANSWERS_PER_QUESTION
        ) {
          advanceQuestion(
            next,
            otherRole(myRole),
            now
          );

          return next;
        }

        /*
         * Normale beurtwisseling.
         */

        next.turn = otherRole(myRole);

        next.deadline = Math.round(
          now + TURN_DURATION
        );

        return next;
      },

      {
        applyLocally: false
      }
    );

    if (result.committed) {
      ui.answerInput.value = "";

      setFeedback(
        "✅ Goed antwoord! +" +
        answer.points +
        " punten.",
        "good"
      );

    } else {
      setFeedback(
        "⏱️ De beurt is intussen veranderd " +
        "of het antwoord is al gebruikt.",
        "bad"
      );
    }

  } catch (error) {
    console.error(error);

    setFeedback(
      "❌ Verzenden is mislukt. " +
      "Controleer je verbinding.",
      "bad"
    );

  } finally {
    sendingAnswer = false;
    updateAnswerControls();
  }
}


/* ============================================================
   TIJD VERSTREKEN

   Elke client kan vaststellen dat
   de gedeelde deadline verlopen is.

   Een transactie voorkomt dat beide
   clients dezelfde verloren beurt
   tweemaal verwerken.
============================================================ */

async function processTimeout() {
  if (
    processingTimeout ||
    !currentRoomCode ||
    !currentRoom?.game
  ) {
    return;
  }

  const game = currentRoom.game;

  if (
    game.status !== "playing" ||
    serverNow() < game.deadline
  ) {
    return;
  }

  processingTimeout = true;

  try {
    const gameReference = ref(
      database,
      "duelRooms/" + currentRoomCode + "/game"
    );

    await runTransaction(
      gameReference,

      currentGame => {
        if (
          !currentGame ||
          currentGame.status !== "playing" ||
          serverNow() < currentGame.deadline
        ) {
          return;
        }

        const next = structuredClone(currentGame);

        const loser = next.turn;
        const opponent = otherRole(loser);

        const livesKey = loser + "Lives";

        next[livesKey] = Math.max(
          0,
          next[livesKey] - 1
        );

        next.eventNumber += 1;

        const lostPlayerName =
          getRoleName(loser);

        const now = serverNow();

        /*
         * GEEN LEVENS MEER:
         * DE TEGENSTANDER WINT.
         */

        if (next[livesKey] <= 0) {
          next.status = "finished";
          next.winner = opponent;
          next.deadline = 0;

          next.lastEvent =
            "💔 " + lostPlayerName +
            " heeft geen levens meer. " +
            "Het duel is afgelopen!";

          return next;
        }

        /*
         * De tegenstander had al
         * de extra laatste beurt.

         * Als die óók geen antwoord
         * geeft, beginnen we meteen
         * met een nieuwe vraag.
         */

        if (next.bonusTurn) {
          next.lastEvent =
            "💔 " + lostPlayerName +
            " verloor een leven. " +
            "Nieuwe vraag!";

          advanceQuestion(
            next,
            next.resetStarter,
            now
          );

          return next;
        }

        /*
         * Eerste mislukte beurt
         * op deze vraag.

         * De tegenstander krijgt
         * nog één beurt.

         * Daarna volgt een nieuwe
         * vraag voor de speler die
         * zojuist een leven verloor.
         */

        next.bonusTurn = true;
        next.resetStarter = loser;

        next.turn = opponent;

        next.deadline = Math.round(
          now + TURN_DURATION
        );

        next.lastEvent =
          "💔 " + lostPlayerName +
          " verloor een leven! " +
          "De tegenstander mag nog " +
          "één keer antwoorden.";

        return next;
      },

      {
        applyLocally: false
      }
    );

  } catch (error) {
    console.error(
      "Timer verwerken mislukt:",
      error
    );

  } finally {
    processingTimeout = false;
  }
}


/* ============================================================
   SPELERSKAARTEN BIJWERKEN
============================================================ */

function updatePlayers(room) {
  ui.hostName.textContent =
    room.hostName || "Speler 1";

  ui.guestName.textContent =
    room.guest?.name || "Nog niemand";

  ui.hostStatus.textContent =
    myRole === "host"
      ? "Jij bent speler 1 ✅"
      : "Speler 1 verbonden ✅";

  ui.guestStatus.textContent =
    !room.guest
      ? "Wachten op speler..."
      : myRole === "guest"
        ? "Jij bent speler 2 ✅"
        : "Speler 2 verbonden ✅";

  const game = room.game;

  if (!game) {
    ui.hostHearts.textContent =
      hearts(START_LIVES);

    ui.guestHearts.textContent =
      hearts(START_LIVES);

    ui.hostScore.textContent = "0 punten";
    ui.guestScore.textContent = "0 punten";

    ui.hostProgress.textContent =
      "0/250 naar extra leven";

    ui.guestProgress.textContent =
      "0/250 naar extra leven";

    ui.hostCard.classList.remove("active");
    ui.guestCard.classList.remove("active");

    return;
  }

  ui.hostHearts.textContent =
    hearts(game.hostLives);

  ui.guestHearts.textContent =
    hearts(game.guestLives);

  ui.hostScore.textContent =
    game.hostScore + " punten";

  ui.guestScore.textContent =
    game.guestScore + " punten";

  ui.hostProgress.textContent =
    game.hostProgress +
    "/" +
    POINTS_FOR_EXTRA_LIFE +
    " naar extra leven";

  ui.guestProgress.textContent =
    game.guestProgress +
    "/" +
    POINTS_FOR_EXTRA_LIFE +
    " naar extra leven";

  const playing = game.status === "playing";

  ui.hostCard.classList.toggle(
    "active",
    playing && game.turn === "host"
  );

  ui.guestCard.classList.toggle(
    "active",
    playing && game.turn === "guest"
  );
}


/* ============================================================
   GEBRUIKTE ANTWOORDEN TONEN
============================================================ */

function updateUsedAnswers(game) {
  const entries = Object.values(
    game.used || {}
  );

  entries.sort(
    (a, b) => a.order - b.order
  );

  ui.usedCount.textContent =
    String(entries.length);

  ui.usedList.replaceChildren();

  if (entries.length === 0) {
    const empty = document.createElement("span");

    empty.className = "used-answer";
    empty.textContent = "Nog geen antwoorden";

    ui.usedList.appendChild(empty);
    return;
  }

  for (const answer of entries) {
    const chip = document.createElement("span");

    chip.className = "used-answer";

    chip.textContent =
      answer.name +
      " (+" +
      answer.points +
      ")";

    ui.usedList.appendChild(chip);
  }
}


/* ============================================================
   ANTWOORDVELD IN- OF UITSCHAKELEN
============================================================ */

function updateAnswerControls() {
  const game = currentRoom?.game;

  const canAnswer = Boolean(
    game &&
    game.status === "playing" &&
    game.turn === myRole &&
    serverNow() < game.deadline &&
    !sendingAnswer
  );

  ui.answerInput.disabled = !canAnswer;
  ui.answerButton.disabled = !canAnswer;
}


/* ============================================================
   SPELSCHERM BIJWERKEN
============================================================ */

function updateGame(game) {
  const question = getQuestion(game);

  if (!question) {
    setRoomStatus(
      "❌ De vraag ontbreekt in de vragenbank.",
      "error"
    );

    return;
  }

  const questionKey =
    game.round + "|" + game.questionIndex;

  /*
   * Bij een nieuwe vraag:
   * invoerveld leegmaken.
   */

  if (questionKey !== previousQuestionKey) {
    previousQuestionKey = questionKey;

    ui.answerInput.value = "";

    setFeedback("");
  }

  ui.roundDisplay.textContent =
    "VRAAG " +
    game.round +
    " · " +
    game.turnCount +
    "/12 ANTWOORDEN";

  ui.questionCategory.textContent =
    String(question.category || "KENNISVRAAG");

  ui.questionText.textContent =
    question.question;

  const currentPlayerName =
    getRoleName(game.turn);

  if (game.turn === myRole) {
    ui.turnMessage.textContent =
      "🎯 JIJ BENT AAN DE BEURT! " +
      "Je hebt 12 seconden.";
  } else {
    ui.turnMessage.textContent =
      "⏳ " + currentPlayerName +
      " is aan de beurt.";
  }

  if (game.bonusTurn) {
    ui.turnMessage.textContent +=
      " Dit is de laatste beurt " +
      "op deze vraag.";
  }

  ui.lastEvent.textContent =
    game.lastEvent || "";

  /*
   * Ruim oude feedback op wanneer
   * er een nieuwe gebeurtenis is.
   */

  if (
    game.eventNumber !== previousEventNumber
  ) {
    previousEventNumber = game.eventNumber;

    if (game.turn !== myRole) {
      setFeedback("");
    }
  }

  updateUsedAnswers(game);

  updateAnswerControls();
}


/* ============================================================
   WINNAAR TONEN
============================================================ */

function updateWinner(game) {
  const winnerName =
    getRoleName(game.winner);

  ui.winnerTitle.textContent =
    "🏆 " + winnerName + " WINT!";

  ui.winnerDescription.textContent =
    "Het duel is afgelopen na " +
    game.round +
    " vragen. " +
    getRoleName("host") +
    " behaalde " +
    game.hostScore +
    " punten en " +
    getRoleName("guest") +
    " behaalde " +
    game.guestScore +
    " punten.";

  ui.lastEvent.textContent =
    game.lastEvent || "";

  setRoomStatus(
    "🏆 Het duel is afgelopen!",
    "success"
  );
}


/* ============================================================
   COMPLETE ROOMINTERFACE
============================================================ */

function updateRoomInterface(room) {
  updatePlayers(room);

  const hasGuest = Boolean(room.guest);
  const hasGame = Boolean(room.game);

  ui.startDuelButton.hidden = !(
    myRole === "host" &&
    hasGuest &&
    !hasGame
  );

  if (!hasGame) {
    ui.gameSection.hidden = true;
    ui.winnerSection.hidden = true;

    if (hasGuest) {
      setRoomStatus(
        "✅ " +
        room.hostName +
        " en " +
        room.guest.name +
        " zijn verbonden! " +
        (myRole === "host"
          ? "Je kunt het duel starten."
          : "Wachten tot de maker het duel start."),
        "success"
      );

    } else {
      setRoomStatus(
        "⏳ Deel de roomcode met een vriend. " +
        "We wachten op speler 2."
      );
    }

    return;
  }

  const game = room.game;

  if (game.status === "finished") {
    ui.gameSection.hidden = true;
    ui.winnerSection.hidden = false;

    updateWinner(game);
    return;
  }

  ui.gameSection.hidden = false;
  ui.winnerSection.hidden = true;

  setRoomStatus(
    "⚔️ Het duel is bezig!",
    "success"
  );

  updateGame(game);
}


/* ============================================================
   GEZAMENLIJKE TIMER

   Het scherm wordt iedere 150 ms
   bijgewerkt.

   Wanneer de tijd verstreken is,
   proberen beide clients de beurt
   af te sluiten. De transactie
   voorkomt dubbele verwerking.
============================================================ */

function updateTimer() {
  const game = currentRoom?.game;

  if (
    !game ||
    game.status !== "playing"
  ) {
    return;
  }

  const millisecondsLeft =
    game.deadline - serverNow();

  const secondsLeft = Math.max(
    0,
    Math.ceil(millisecondsLeft / 1000)
  );

  ui.turnTimer.textContent =
    String(secondsLeft);

  ui.turnTimer.classList.toggle(
    "urgent",
    secondsLeft <= 4
  );

  updateAnswerControls();

  if (millisecondsLeft <= 0) {
    processTimeout();
  }
}

setInterval(updateTimer, 150);


/* ============================================================
   ROOMCODE KOPIËREN
============================================================ */

async function copyCode() {
  if (!currentRoomCode) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      currentRoomCode
    );

    ui.copyButton.textContent =
      "✅ CODE GEKOPIEERD";

    setTimeout(() => {
      ui.copyButton.textContent =
        "📋 CODE KOPIËREN";
    }, 2000);

  } catch (error) {
    setRoomStatus(
      "Selecteer de roomcode hierboven " +
      "om hem handmatig te kopiëren."
    );
  }
}


/* ============================================================
   EVENTS
============================================================ */

ui.createButton.addEventListener(
  "click",
  createRoom
);

ui.joinButton.addEventListener(
  "click",
  joinRoom
);

ui.startDuelButton.addEventListener(
  "click",
  startDuel
);

ui.copyButton.addEventListener(
  "click",
  copyCode
);

ui.answerForm.addEventListener(
  "submit",
  submitAnswer
);

ui.newRoomButton.addEventListener(
  "click",
  () => window.location.reload()
);

ui.roomInput.addEventListener(
  "input",
  () => {
    ui.roomInput.value = cleanRoomCode(
      ui.roomInput.value
    );
  }
);

ui.roomInput.addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      event.preventDefault();
      joinRoom();
    }
  }
);


/* ============================================================
   FIREBASE INITIALISEREN
============================================================ */

async function initialize() {
  try {
    if (questions.length === 0) {
      throw new Error(
        "Er zijn geen duelvragen geladen. " +
        "Controleer vragen-uitbreiding.js."
      );
    }

    const result =
      await signInAnonymously(auth);

    currentUser = result.user;

    setConnectionStatus(
      "✅ Verbonden met Firebase! " +
      "Je kunt een room maken of deelnemen.",
      "success"
    );

    updateLobbyButtons();

    console.log(
      "⚔️ QuizBallon Duel geladen!"
    );

    console.log(
      "📚 Duelvragen beschikbaar:",
      questions.length
    );

  } catch (error) {
    console.error(error);

    setConnectionStatus(
      "❌ QuizBallon Duel kon niet starten. " +
      "Controleer Firebase en de vragenbank.",
      "error"
    );
  }
}

initialize();
