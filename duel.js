/* ============================================================
   QUIZBALLON DUEL V3

   - 14 seconden per beurt
   - Automatische focus op je antwoordvak
   - Opnieuw spelen in dezelfde room
   - Live typen
   - Karakterkeuze
   - Extra antwoordlijsten
   - Brandende QB-ballon
   - Extra levens bij 250 punten

   LET OP:
   Antwoordcontrole gebeurt nog in de browser.
============================================================ */

import "./quizballon-antwoorden-extra.js";

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
   FIREBASE
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

const TURN_DURATION = 14000;
const MAX_ANSWERS = 12;

const MAX_LIVES = 3;
const EXTRA_LIFE_POINTS = 250;

const ROOM_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const NAME_PATTERN =
  /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 ._-]{1,17}$/;


/* ============================================================
   HTML-ELEMENTEN
============================================================ */

const byId = id => document.getElementById(id);

const ui = {};

const elementIds = [
  "connection-status",
  "lobby-start",
  "player-name",
  "avatar-picker",
  "room-input",
  "create-button",
  "join-button",
  "room-panel",
  "room-code",
  "copy-button",
  "host-card",
  "guest-card",
  "host-avatar",
  "guest-avatar",
  "host-name",
  "guest-name",
  "host-hearts",
  "guest-hearts",
  "host-score",
  "guest-score",
  "host-progress-track",
  "guest-progress-track",
  "host-progress-fill",
  "guest-progress-fill",
  "host-progress-label",
  "guest-progress-label",
  "host-status",
  "guest-status",
  "host-heart-effects",
  "guest-heart-effects",
  "room-status",
  "start-duel-button",
  "game-section",
  "round-display",
  "turn-timer",
  "timer-balloon",
  "question-category",
  "question-text",
  "host-answer-lane",
  "guest-answer-lane",
  "host-turn-label",
  "guest-turn-label",
  "host-turn-status",
  "guest-turn-status",
  "host-answer-input",
  "guest-answer-input",
  "turn-message",
  "answer-form",
  "answer-button",
  "answer-feedback",
  "used-count",
  "used-list",
  "last-event",
  "winner-section",
  "winner-title",
  "winner-description",
  "new-room-button"
];

for (const id of elementIds) {
  ui[id] = byId(id);
}


/* ============================================================
   KARAKTERS
============================================================ */

const avatars = [
  ["astro", "Astronaut", "#b9e8ff"],
  ["robot", "Robot", "#d7d0ff"],
  ["alien", "Alien", "#d4f7bd"],
  ["piraat", "Piraat", "#ffe2ac"],
  ["tovenaar", "Tovenaar", "#eacaff"],
  ["vos", "Vos", "#ffddb7"]
];


/* ============================================================
   LOKALE STATUS
============================================================ */

let currentUserId = null;

let roomCode = "";
let room = null;
let myRole = "";

let selectedAvatar = "astro";

let stopRoomListener = null;

let serverOffset = 0;

let busy = false;
let sendingAnswer = false;
let processingTimeout = false;

let typingTimer = null;

let previousTurn = "";
let previousEvent = "";

let burnTimer = null;
let hasFocused = false;

let rematchBusy = false;


/* ============================================================
   VRAGENBANK

   Het nieuwe antwoordbestand is bovenaan
   geïmporteerd en heeft de bestaande
   vragenbanken al aangevuld.
============================================================ */

const questions = (
  window.QUIZBALLON_EXPANDED_QUESTIONS || []
).filter(question => {
  if (
    !question ||
    typeof question.question !== "string" ||
    !Array.isArray(question.answers)
  ) {
    return false;
  }

  const title = question.question.toLowerCase();

  if (
    /sterrenbeeld|historische vrouw/.test(title)
  ) {
    return false;
  }

  return question.answers.length >= 50;
});


/* ============================================================
   SERVERKLOK
============================================================ */

function serverNow() {
  return Date.now() + serverOffset;
}

onValue(
  ref(database, ".info/serverTimeOffset"),
  snapshot => {
    serverOffset = Number(snapshot.val()) || 0;
  }
);


/* ============================================================
   MELDINGEN
============================================================ */

function connectionNotice(message, type = "") {
  ui["connection-status"].textContent = message;

  ui["connection-status"].className =
    "duel-notice " + type;
}

function roomNotice(message, type = "") {
  ui["room-status"].textContent = message;

  ui["room-status"].className =
    "duel-notice room-notice " + type;
}

function answerFeedback(message, type = "") {
  ui["answer-feedback"].textContent = message;

  ui["answer-feedback"].className =
    "answer-feedback " + type;
}

function updateLobbyControls() {
  const enabled =
    Boolean(currentUserId) &&
    questions.length > 0 &&
    !busy;

  ui["create-button"].disabled = !enabled;
  ui["join-button"].disabled = !enabled;
}


/* ============================================================
   GETEKENDE KARAKTERS
============================================================ */

function avatarSvg(id) {
  const avatar =
    avatars.find(item => item[0] === id) ||
    avatars[0];

  const background = `
    <circle
      cx="60"
      cy="60"
      r="55"
      fill="${avatar[2]}"
    />

    <ellipse
      cx="60"
      cy="103"
      rx="33"
      ry="9"
      fill="#24466b"
      opacity=".1"
    />
  `;

  const drawings = {

    astro: `
      <path
        d="M25 105 Q30 76 60 76 Q90 76 95 105"
        fill="#fff"
        stroke="#447cbd"
        stroke-width="4"
      />

      <circle
        cx="60"
        cy="52"
        r="37"
        fill="#fff"
        stroke="#4b88c9"
        stroke-width="5"
      />

      <circle
        cx="60"
        cy="53"
        r="27"
        fill="#a8e7ff"
      />

      <ellipse
        cx="60"
        cy="58"
        rx="21"
        ry="23"
        fill="#f2bc93"
      />

      <path
        d="M39 52 Q43 29 60 33 Q77 30 81 53"
        fill="#593b38"
      />

      <circle cx="50" cy="58" r="3" fill="#263e61"/>
      <circle cx="70" cy="58" r="3" fill="#263e61"/>

      <path
        d="M53 69 Q60 75 67 69"
        stroke="#a75b5b"
        stroke-width="3"
        fill="none"
      />

      <rect
        x="50"
        y="86"
        width="20"
        height="12"
        rx="4"
        fill="#ff6379"
      />
    `,

    robot: `
      <rect
        x="30"
        y="79"
        width="60"
        height="30"
        rx="14"
        fill="#526ec4"
      />

      <rect
        x="29"
        y="29"
        width="62"
        height="58"
        rx="15"
        fill="#f4f6ff"
        stroke="#536fbe"
        stroke-width="5"
      />

      <rect
        x="37"
        y="42"
        width="46"
        height="26"
        rx="9"
        fill="#283b80"
      />

      <circle cx="49" cy="55" r="7" fill="#85f5ff"/>
      <circle cx="71" cy="55" r="7" fill="#85f5ff"/>

      <path
        d="M50 76 H70"
        stroke="#536fbe"
        stroke-width="4"
      />

      <path
        d="M60 28 V15"
        stroke="#536fbe"
        stroke-width="5"
      />

      <circle
        cx="60"
        cy="13"
        r="7"
        fill="#ff7187"
      />
    `,

    alien: `
      <path
        d="M30 108 Q36 78 60 78 Q84 78 90 108"
        fill="#6fbf83"
      />

      <path
        d="M36 40 Q20 16 24 11 Q40 17 45 34
           M84 40 Q100 16 96 11 Q80 17 75 34"
        fill="#84d878"
      />

      <ellipse
        cx="60"
        cy="53"
        rx="37"
        ry="38"
        fill="#a3e98d"
        stroke="#5bae73"
        stroke-width="4"
      />

      <ellipse
        cx="45"
        cy="56"
        rx="11"
        ry="15"
        fill="#263d5a"
      />

      <ellipse
        cx="75"
        cy="56"
        rx="11"
        ry="15"
        fill="#263d5a"
      />

      <circle cx="41" cy="51" r="3" fill="#fff"/>
      <circle cx="71" cy="51" r="3" fill="#fff"/>

      <path
        d="M52 77 Q60 84 68 77"
        stroke="#39855f"
        stroke-width="3"
        fill="none"
      />
    `,

    piraat: `
      <path
        d="M24 109 Q30 81 60 81 Q90 81 96 109"
        fill="#e24f63"
      />

      <ellipse
        cx="60"
        cy="58"
        rx="29"
        ry="34"
        fill="#edb98e"
      />

      <path
        d="M26 50 Q21 15 60 15 Q99 15 94 50"
        fill="#233d5b"
      />

      <path
        d="M18 45 Q60 55 102 45"
        stroke="#233d5b"
        stroke-width="10"
      />

      <circle
        cx="60"
        cy="29"
        r="10"
        fill="#fff"
      />

      <circle
        cx="60"
        cy="29"
        r="5"
        fill="#233d5b"
      />

      <circle
        cx="43"
        cy="55"
        r="7"
        fill="#273d5b"
      />

      <path
        d="M43 55 L73 50"
        stroke="#273d5b"
        stroke-width="3"
      />

      <circle cx="75" cy="57" r="3" fill="#273d5b"/>

      <path
        d="M53 72 Q62 79 70 72"
        stroke="#a35b52"
        stroke-width="3"
        fill="none"
      />
    `,

    tovenaar: `
      <path
        d="M22 109 Q27 80 60 80 Q93 80 98 109"
        fill="#7958ba"
      />

      <ellipse
        cx="60"
        cy="59"
        rx="28"
        ry="33"
        fill="#f3c6a9"
      />

      <path
        d="M60 4 L95 49 H25 Z"
        fill="#6950b9"
        stroke="#4a3999"
        stroke-width="3"
      />

      <path
        d="M21 47 Q60 37 99 47"
        stroke="#5540a2"
        stroke-width="9"
      />

      <path
        d="M43 69 Q60 109 77 69"
        fill="#fff"
      />

      <circle cx="49" cy="57" r="3" fill="#33456d"/>
      <circle cx="71" cy="57" r="3" fill="#33456d"/>

      <path
        d="M58 15 L62 24 L72 24 L64 30
           L67 40 L58 34 L49 40 L52 30
           L44 24 L55 24 Z"
        fill="#ffe36a"
      />
    `,

    vos: `
      <path
        d="M22 100 Q37 75 60 80 Q83 75 98 100"
        fill="#ec874a"
      />

      <path
        d="M26 49 L22 13 L49 31
           M94 49 L98 13 L71 31"
        fill="#e7813c"
        stroke="#9e4b2d"
        stroke-width="4"
      />

      <ellipse
        cx="60"
        cy="58"
        rx="37"
        ry="35"
        fill="#f69c4e"
      />

      <path
        d="M25 62 Q38 72 60 67 Q82 72
           95 62 Q83 95 60 96 Q37 95 25 62"
        fill="#fff5e3"
      />

      <circle cx="47" cy="56" r="4" fill="#3c3540"/>
      <circle cx="73" cy="56" r="4" fill="#3c3540"/>

      <path
        d="M54 70 Q60 65 66 70 L60 77 Z"
        fill="#3c3540"
      />
    `
  };

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      role="img"
      aria-label="${avatar[1]}"
    >
      ${background}
      ${drawings[avatar[0]]}
    </svg>
  `;
}


/* ============================================================
   KARAKTERKIEZER
============================================================ */

function renderAvatarPicker() {
  ui["avatar-picker"].replaceChildren();

  for (const avatar of avatars) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "avatar-option";
    button.dataset.avatar = avatar[0];

    button.setAttribute(
      "aria-label",
      "Kies " + avatar[1]
    );

    button.innerHTML =
      avatarSvg(avatar[0]) +
      "<span>" +
      avatar[1] +
      "</span>";

    button.addEventListener("click", () => {
      selectedAvatar = avatar[0];
      updateAvatarPicker();
    });

    ui["avatar-picker"].appendChild(button);
  }

  updateAvatarPicker();
}

function updateAvatarPicker() {
  const buttons =
    ui["avatar-picker"].querySelectorAll("button");

  buttons.forEach(button => {
    const selected =
      button.dataset.avatar === selectedAvatar;

    button.classList.toggle(
      "selected",
      selected
    );

    button.setAttribute(
      "aria-pressed",
      String(selected)
    );
  });
}


/* ============================================================
   ANTWOORDEN NORMALISEREN EN ZOEKEN
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

function findAnswer(question, typed) {
  const wanted = normalize(typed);

  if (!wanted) {
    return null;
  }

  for (
    let index = 0;
    index < question.answers.length;
    index++
  ) {
    const entry = question.answers[index];

    const name =
      typeof entry === "string"
        ? entry
        : String(
            entry.answer ||
            entry.name ||
            ""
          );

    const aliases =
      Array.isArray(entry.aliases)
        ? entry.aliases
        : typeof entry.aliases === "string"
          ? entry.aliases.split("|")
          : [];

    const possibleNames = [
      name,
      ...aliases
    ];

    const matches = possibleNames.some(
      candidate =>
        normalize(candidate) === wanted
    );

    if (!matches) {
      continue;
    }

    const points = Number(entry.points);
    const rarity = Number(entry.rarity);

    let awardedPoints = 10;

    if (entry.isRocket === true) {
      awardedPoints = 100;
    } else if (
      Number.isFinite(points) &&
      points > 0
    ) {
      awardedPoints = Math.max(
        10,
        Math.min(
          100,
          Math.round(points)
        )
      );
    } else if (Number.isFinite(rarity)) {
      awardedPoints = Math.max(
        10,
        Math.min(
          99,
          Math.round(9 + rarity * 0.86)
        )
      );
    }

    return {
      key: "a" + index,
      name,
      points: awardedPoints
    };
  }

  return null;
}


/* ============================================================
   SPELERS EN ROOMCODES
============================================================ */

function otherRole(role) {
  return role === "host" ? "guest" : "host";
}

function playerNameFor(role) {
  if (role === "host") {
    return room?.hostName || "Speler 1";
  }

  return room?.guest?.name || "Speler 2";
}

function myAnswerInput() {
  return ui[myRole + "-answer-input"];
}

function cleanRoomCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

function getPlayerName() {
  const name =
    ui["player-name"].value.trim();

  if (!NAME_PATTERN.test(name)) {
    connectionNotice(
      "❌ Kies een spelersnaam van 2 tot 18 tekens.",
      "error"
    );

    ui["player-name"].focus();

    return "";
  }

  return name;
}

function generateRoomCode() {
  const randomBytes = new Uint8Array(6);

  crypto.getRandomValues(randomBytes);

  return [...randomBytes]
    .map(byte =>
      ROOM_ALPHABET[
        byte % ROOM_ALPHABET.length
      ]
    )
    .join("");
}

function hashCode(text) {
  let hash = 0;

  for (const character of text) {
    hash = (
      Math.imul(hash, 31) +
      character.charCodeAt(0)
    ) >>> 0;
  }

  return hash;
}

function questionFor(game) {
  return questions[game.questionIndex] || null;
}


/* ============================================================
   STARTGEGEVENS

   matchNumber telt hoe vaak er in
   dezelfde room een duel wordt gespeeld.
============================================================ */

function initialGame(matchNumber = 1) {
  return {
    status: "playing",

    matchNumber,

    questionIndex:
      (hashCode(roomCode) + matchNumber - 1) %
      questions.length,

    round: 1,

    turn: "host",
    turnId: 1,
    turnCount: 0,

    deadline: Math.round(
      serverNow() + TURN_DURATION
    ),

    hostLives: 2,
    guestLives: 2,

    hostScore: 0,
    guestScore: 0,

    hostProgress: 0,
    guestProgress: 0,

    bonusTurn: false,
    resetStarter: "host",

    winner: "",

    lastEvent: "⚔️ Het duel is begonnen!",
    lastType: "start",
    lastLoser: "",

    eventNumber: 1
  };
}


/* ============================================================
   ROOM TONEN EN VOLGEN
============================================================ */

function showRoom(code) {
  roomCode = code;

  ui["lobby-start"].hidden = true;
  ui["room-panel"].hidden = false;

  ui["room-code"].textContent = code;
}

function watchRoom() {
  if (stopRoomListener) {
    stopRoomListener();
  }

  const roomReference = ref(
    database,
    "duelRooms/" + roomCode
  );

  stopRoomListener = onValue(
    roomReference,

    snapshot => {
      if (!snapshot.exists()) {
        roomNotice(
          "❌ De room bestaat niet meer.",
          "error"
        );

        return;
      }

      room = snapshot.val();

      if (room.hostUid === currentUserId) {
        myRole = "host";
      } else if (
        room.guest?.uid === currentUserId
      ) {
        myRole = "guest";
      } else {
        myRole = "";
      }

      if (!myRole) {
        roomNotice(
          "❌ Je bent geen speler in deze room.",
          "error"
        );

        return;
      }

      renderRoom();
    },

    error => {
      console.error(error);

      roomNotice(
        "❌ Database lezen mislukt. " +
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
  if (!currentUserId || busy) {
    return;
  }

  const name = getPlayerName();

  if (!name) {
    return;
  }

  busy = true;
  updateLobbyControls();

  connectionNotice("🏠 Room aanmaken...");

  try {
    let lastError;

    for (
      let attempt = 0;
      attempt < 5;
      attempt++
    ) {
      const code = generateRoomCode();

      try {
        await set(
          ref(
            database,
            "duelRooms/" + code
          ),
          {
            hostUid: currentUserId,
            hostName: name,
            hostAvatar: selectedAvatar,
            createdAt: serverTimestamp()
          }
        );

        showRoom(code);
        watchRoom();

        connectionNotice(
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

    throw lastError ||
      new Error(
        "Room aanmaken mislukt."
      );

  } catch (error) {
    console.error(error);

    connectionNotice(
      "❌ Room aanmaken mislukt. " +
      "Controleer de nieuwe Firebase Rules.",
      "error"
    );

  } finally {
    busy = false;
    updateLobbyControls();
  }
}


/* ============================================================
   DEELNEMEN
============================================================ */

async function joinRoom() {
  if (!currentUserId || busy) {
    return;
  }

  const name = getPlayerName();

  const code = cleanRoomCode(
    ui["room-input"].value
  );

  if (!name) {
    return;
  }

  if (code.length !== 6) {
    connectionNotice(
      "❌ Vul een code van 6 tekens in.",
      "error"
    );

    return;
  }

  busy = true;
  updateLobbyControls();

  connectionNotice(
    "🔄 Deelnemen..."
  );

  try {
    await set(
      ref(
        database,
        "duelRooms/" + code + "/guest"
      ),
      {
        uid: currentUserId,
        name,
        avatar: selectedAvatar
      }
    );

    showRoom(code);
    watchRoom();

    connectionNotice(
      "✅ Je bent lid van de room!",
      "success"
    );

  } catch (error) {
    console.error(error);

    connectionNotice(
      "❌ Deelnemen mislukt. " +
      "Controleer de roomcode.",
      "error"
    );

  } finally {
    busy = false;
    updateLobbyControls();
  }
}


/* ============================================================
   EERSTE DUEL STARTEN
============================================================ */

async function startDuel() {
  if (
    myRole !== "host" ||
    !room?.guest
  ) {
    return;
  }

  ui["start-duel-button"].disabled = true;

  try {
    await runTransaction(
      ref(
        database,
        "duelRooms/" + roomCode + "/game"
      ),

      game => {
        if (game !== null) {
          return;
        }

        return initialGame();
      },

      {
        applyLocally: false
      }
    );

  } catch (error) {
    console.error(error);

    roomNotice(
      "❌ Duel starten mislukt.",
      "error"
    );

  } finally {
    ui["start-duel-button"].disabled = false;
  }
}


/* ============================================================
   VOLGENDE VRAAG
============================================================ */

function nextQuestion(
  game,
  starter,
  time
) {
  game.questionIndex =
    (game.questionIndex + 1) %
    questions.length;

  game.round += 1;

  game.turn = starter;
  game.turnCount = 0;

  game.turnId += 1;

  game.deadline = Math.round(
    time + TURN_DURATION
  );

  game.bonusTurn = false;
  game.resetStarter = starter;

  delete game.used;
}


/* ============================================================
   PUNTEN EN EXTRA LEVENS
============================================================ */

function addPoints(
  game,
  role,
  points
) {
  game[role + "Score"] += points;

  if (
    game[role + "Lives"] >= MAX_LIVES
  ) {
    game[role + "Progress"] = 0;
    return false;
  }

  game[role + "Progress"] += points;

  if (
    game[role + "Progress"] >=
    EXTRA_LIFE_POINTS
  ) {
    game[role + "Progress"] -=
      EXTRA_LIFE_POINTS;

    game[role + "Lives"] += 1;

    if (
      game[role + "Lives"] >= MAX_LIVES
    ) {
      game[role + "Progress"] = 0;
    }

    return true;
  }

  return false;
}


/* ============================================================
   LIVE TYPEN
============================================================ */

function canType() {
  const game = room?.game;

  return Boolean(
    game &&
    game.status === "playing" &&
    game.turn === myRole &&
    serverNow() < game.deadline &&
    !sendingAnswer
  );
}

function cancelTyping() {
  clearTimeout(typingTimer);
  typingTimer = null;
}

function scheduleTyping() {
  cancelTyping();

  if (!canType()) {
    return;
  }

  typingTimer = setTimeout(
    sendTyping,
    160
  );
}

async function sendTyping() {
  if (!canType() || !roomCode) {
    return;
  }

  const game = room.game;

  const turnId = game.turnId;

  const text =
    myAnswerInput().value.slice(0, 100);

  try {
    await set(
      ref(
        database,
        "duelRooms/" +
        roomCode +
        "/typing/" +
        myRole
      ),
      {
        turnId,
        text
      }
    );

  } catch (error) {
    /*
     * Een typupdate kan mislukken
     * wanneer de beurt intussen
     * is afgelopen. Dat is normaal.
     */
  }
}


/* ============================================================
   ANTWOORD VERSTUREN
============================================================ */

async function submitAnswer(event) {
  event.preventDefault();

  if (!canType()) {
    return;
  }

  const game = room.game;

  const input = myAnswerInput();

  const typed = input.value.trim();

  const question = questionFor(game);

  if (!question) {
    answerFeedback(
      "❌ De vraag kon niet worden geladen.",
      "bad"
    );

    return;
  }

  const answer = findAnswer(
    question,
    typed
  );

  if (!answer) {
    answerFeedback(
      "❌ Dit antwoord staat nog niet " +
      "in onze lijst. Probeer opnieuw.",
      "bad"
    );

    return;
  }

  if (
    game.used &&
    game.used[answer.key]
  ) {
    answerFeedback(
      "🚫 Dit antwoord is al gebruikt.",
      "bad"
    );

    return;
  }

  sendingAnswer = true;

  cancelTyping();
  updateAnswerControls();

  const submittedRole = myRole;
  const submittedTurnId = game.turnId;

  try {
    const gameReference = ref(
      database,
      "duelRooms/" +
      roomCode +
      "/game"
    );

    const result = await runTransaction(
      gameReference,

      currentGame => {
        if (
          !currentGame ||
          currentGame.status !== "playing" ||
          currentGame.turn !== submittedRole ||
          currentGame.turnId !== submittedTurnId ||
          serverNow() >= currentGame.deadline
        ) {
          return;
        }

        if (
          currentGame.used &&
          currentGame.used[answer.key]
        ) {
          return;
        }

        const next =
          structuredClone(currentGame);

        if (!next.used) {
          next.used = {};
        }

        next.used[answer.key] = {
          name: answer.name,
          by: submittedRole,
          points: answer.points,
          order: next.turnCount + 1
        };

        next.turnCount += 1;

        const earnedExtraLife = addPoints(
          next,
          submittedRole,
          answer.points
        );

        next.lastEvent =
          "✅ " +
          playerNameFor(submittedRole) +
          ": " +
          answer.name +
          " (+" +
          answer.points +
          " punten)" +
          (
            earnedExtraLife
              ? " 💖 EXTRA LEVEN!"
              : ""
          );

        next.lastType =
          earnedExtraLife
            ? "extraLife"
            : "answer";

        next.lastLoser = submittedRole;
        next.eventNumber += 1;

        const time = serverNow();

        /*
         * Na de laatste beurt op
         * een vraag start een nieuwe.
         */

        if (next.bonusTurn) {
          nextQuestion(
            next,
            next.resetStarter,
            time
          );

        } else if (
          next.turnCount >= MAX_ANSWERS
        ) {
          nextQuestion(
            next,
            otherRole(submittedRole),
            time
          );

        } else {
          next.turn = otherRole(
            submittedRole
          );

          next.turnId += 1;

          next.deadline = Math.round(
            time + TURN_DURATION
          );
        }

        return next;
      },

      {
        applyLocally: false
      }
    );

    if (result.committed) {
      input.value = "";

      answerFeedback(
        "✅ Goed! +" +
        answer.points +
        " punten.",
        "good"
      );

    } else {
      answerFeedback(
        "⏱️ De beurt is intussen veranderd.",
        "bad"
      );
    }

  } catch (error) {
    console.error(error);

    answerFeedback(
      "❌ Verzenden mislukt.",
      "bad"
    );

  } finally {
    sendingAnswer = false;
    updateAnswerControls();
  }
}


/* ============================================================
   TIMER VERWERKEN
============================================================ */

async function processTimeout() {
  const game = room?.game;

  if (
    processingTimeout ||
    !roomCode ||
    !game ||
    game.status !== "playing" ||
    serverNow() < game.deadline
  ) {
    return;
  }

  processingTimeout = true;

  try {
    const gameReference = ref(
      database,
      "duelRooms/" +
      roomCode +
      "/game"
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

        const next =
          structuredClone(currentGame);

        const loser = next.turn;
        const winner = otherRole(loser);

        next[loser + "Lives"] = Math.max(
          0,
          next[loser + "Lives"] - 1
        );

        next.lastType = "timeout";
        next.lastLoser = loser;

        next.eventNumber += 1;

        const time = serverNow();

        /*
         * De speler heeft geen
         * levens meer.
         */

        if (
          next[loser + "Lives"] === 0
        ) {
          next.status = "finished";
          next.winner = winner;
          next.deadline = 0;

          next.lastEvent =
            "💔 " +
            playerNameFor(loser) +
            " heeft geen levens meer!";

          return next;
        }

        /*
         * De bonusbeurt is voorbij:
         * ga naar een nieuwe vraag.
         */

        if (next.bonusTurn) {
          next.lastEvent =
            "💔 " +
            playerNameFor(loser) +
            " verloor een leven. " +
            "Nieuwe vraag!";

          nextQuestion(
            next,
            next.resetStarter,
            time
          );

          return next;
        }

        /*
         * De tegenstander krijgt
         * nog één beurt.
         */

        next.bonusTurn = true;
        next.resetStarter = loser;

        next.turn = winner;
        next.turnId += 1;

        next.deadline = Math.round(
          time + TURN_DURATION
        );

        next.lastEvent =
          "💔 " +
          playerNameFor(loser) +
          " verloor een leven! " +
          "Laatste beurt op deze vraag.";

        return next;
      },

      {
        applyLocally: false
      }
    );

  } catch (error) {
    console.error(error);

  } finally {
    processingTimeout = false;
  }
}


/* ============================================================
   HARTJES EN VOORTGANG
============================================================ */

function heartText(lives) {
  return (
    "❤️".repeat(
      Math.max(0, lives)
    ) +
    "🖤".repeat(
      Math.max(0, 3 - lives)
    )
  );
}

function updateLifeProgress(
  playerRole,
  game
) {
  const full =
    game[playerRole + "Lives"] === 3;

  const progress =
    game[playerRole + "Progress"];

  const percentage = full
    ? 100
    : Math.round(
        progress /
        EXTRA_LIFE_POINTS *
        100
      );

  ui[playerRole + "-progress-fill"].style.width =
    percentage + "%";

  ui[playerRole + "-progress-label"].textContent =
    full
      ? "MAX LEVENS ❤️"
      : percentage + "%";

  ui[playerRole + "-progress-track"].setAttribute(
    "aria-valuenow",
    String(percentage)
  );
}


/* ============================================================
   SPELERSKAARTEN TEKENEN
============================================================ */

function drawPlayers() {
  ui["host-name"].textContent =
    room.hostName || "Speler 1";

  ui["guest-name"].textContent =
    room.guest?.name || "Nog niemand";

  ui["host-avatar"].innerHTML =
    avatarSvg(
      room.hostAvatar || "astro"
    );

  ui["guest-avatar"].innerHTML =
    avatarSvg(
      room.guest?.avatar || "robot"
    );

  ui["host-turn-label"].textContent =
    "🔴 " +
    (room.hostName || "Speler 1");

  ui["guest-turn-label"].textContent =
    "🔵 " +
    (room.guest?.name || "Speler 2");

  ui["host-status"].textContent =
    myRole === "host"
      ? "Jij bent speler 1 ✅"
      : "Speler 1 verbonden";

  ui["guest-status"].textContent =
    !room.guest
      ? "Wachten..."
      : myRole === "guest"
        ? "Jij bent speler 2 ✅"
        : "Speler 2 verbonden";

  const game = room.game;

  for (const playerRole of [
    "host",
    "guest"
  ]) {
    ui[playerRole + "-hearts"].textContent =
      heartText(
        game
          ? game[playerRole + "Lives"]
          : 2
      );

    ui[playerRole + "-score"].textContent =
      String(
        game
          ? game[playerRole + "Score"]
          : 0
      );

    if (game) {
      updateLifeProgress(
        playerRole,
        game
      );

    } else {
      ui[playerRole + "-progress-fill"].style.width =
        "0%";

      ui[playerRole + "-progress-label"].textContent =
        "0%";
    }

    ui[playerRole + "-card"].classList.toggle(
      "active",
      Boolean(
        game &&
        game.status === "playing" &&
        game.turn === playerRole
      )
    );
  }
}


/* ============================================================
   ANTWOORDVAKKEN AAN- OF UITZETTEN
============================================================ */

function updateAnswerControls() {
  const game = room?.game;

  for (const playerRole of [
    "host",
    "guest"
  ]) {
    const active =
      game?.status === "playing" &&
      game.turn === playerRole;

    ui[
      playerRole + "-answer-lane"
    ].classList.toggle(
      "active",
      Boolean(active)
    );

    ui[
      playerRole + "-turn-status"
    ].textContent =
      active
        ? "🎯 AAN DE BEURT"
        : "Wachten...";

    ui[
      playerRole + "-answer-input"
    ].disabled = !(
      playerRole === myRole &&
      canType()
    );

    ui[
      playerRole + "-answer-input"
    ].placeholder =
      active
        ? (
            playerRole === myRole
              ? "Typ jouw antwoord..."
              : "Tegenstander typt..."
          )
        : "Wachten op beurt...";
  }

  ui["answer-button"].disabled =
    !canType();
}


/* ============================================================
   TEGENSTANDER LIVE TONEN
============================================================ */

function renderTyping() {
  const game = room.game;

  if (
    !game ||
    game.status !== "playing"
  ) {
    return;
  }

  for (const playerRole of [
    "host",
    "guest"
  ]) {
    /*
     * Het eigen invoervak wordt
     * niet overschreven.
     */

    if (playerRole === myRole) {
      continue;
    }

    const entry =
      room.typing?.[playerRole];

    ui[
      playerRole + "-answer-input"
    ].value =
      game.turn === playerRole &&
      entry?.turnId === game.turnId
        ? entry.text || ""
        : "";
  }
}


/* ============================================================
   HARTJESANIMATIES
============================================================ */

function animateHeart(
  playerRole,
  gained
) {
  const particle =
    document.createElement("span");

  particle.className =
    "heart-particle" +
    (gained ? " gained" : "");

  particle.textContent =
    gained ? "💖" : "💔";

  ui[
    playerRole + "-heart-effects"
  ].appendChild(particle);

  setTimeout(
    () => particle.remove(),
    1400
  );
}


/* ============================================================
   BALLON LATEN BRANDEN
============================================================ */

function animateBalloonBurn() {
  clearTimeout(burnTimer);

  ui["timer-balloon"].classList.remove(
    "burning"
  );

  /*
   * De animatie opnieuw beginnen.
   */

  void ui["timer-balloon"].offsetWidth;

  ui["timer-balloon"].classList.add(
    "burning"
  );

  burnTimer = setTimeout(
    () => {
      ui["timer-balloon"].classList.remove(
        "burning"
      );
    },
    1100
  );
}


/* ============================================================
   NIEUWE GEBEURTENISSEN HERKENNEN
============================================================ */

function handleGameEvent(game) {
  const eventKey =
    game.matchNumber +
    ":" +
    game.eventNumber;

  /*
   * Bij het openen van een room
   * geen oude animatie afspelen.
   */

  if (previousEvent === "") {
    previousEvent = eventKey;
    return;
  }

  if (previousEvent === eventKey) {
    return;
  }

  previousEvent = eventKey;

  if (game.lastType === "timeout") {
    animateBalloonBurn();

    if (
      ["host", "guest"].includes(
        game.lastLoser
      )
    ) {
      animateHeart(
        game.lastLoser,
        false
      );
    }

  } else if (
    game.lastType === "extraLife" &&
    ["host", "guest"].includes(
      game.lastLoser
    )
  ) {
    animateHeart(
      game.lastLoser,
      true
    );
  }
}


/* ============================================================
   GEBRUIKTE ANTWOORDEN TONEN
============================================================ */

function renderUsedAnswers(game) {
  const answers = Object.values(
    game.used || {}
  );

  answers.sort(
    (a, b) => a.order - b.order
  );

  ui["used-count"].textContent =
    String(answers.length);

  ui["used-list"].replaceChildren();

  if (answers.length === 0) {
    ui["used-list"].textContent =
      "Nog geen antwoorden.";

    return;
  }

  for (const answer of answers) {
    const element =
      document.createElement("span");

    element.className = "used-answer";

    element.textContent =
      answer.name +
      " (+" +
      answer.points +
      ")";

    ui["used-list"].appendChild(element);
  }
}


/* ============================================================
   AUTOMATISCH BEGINNEN MET TYPEN

   Zodra het jouw beurt is, wordt
   jouw invoervak automatisch actief.
============================================================ */

function focusMyAnswer() {
  if (
    !canType() ||
    document.hidden
  ) {
    return;
  }

  const input = myAnswerInput();

  if (input.disabled) {
    return;
  }

  input.focus({
    preventScroll: true
  });
}


/* ============================================================
   SPELSCHERM BIJWERKEN
============================================================ */

function renderGame(game) {
  const question = questionFor(game);

  if (!question) {
    roomNotice(
      "❌ Vraag ontbreekt in de lokale vragenbank.",
      "error"
    );

    return;
  }

  /*
   * Een nieuw duel of nieuwe beurt
   * heeft altijd een andere sleutel.
   */

  const turnKey =
    game.matchNumber +
    ":" +
    game.turnId;

  if (turnKey !== previousTurn) {
    previousTurn = turnKey;

    cancelTyping();

    ui["host-answer-input"].value = "";
    ui["guest-answer-input"].value = "";

    answerFeedback("");

    hasFocused = false;
  }

  ui["round-display"].textContent =
    "VRAAG " +
    game.round +
    " · " +
    game.turnCount +
    "/12 ANTWOORDEN";

  ui["question-category"].textContent =
    question.category ||
    "KENNISVRAAG";

  ui["question-text"].textContent =
    question.question;

  if (game.turn === myRole) {
    ui["turn-message"].textContent =
      "🎯 JIJ BENT AAN DE BEURT! " +
      "Je hebt 14 seconden.";

  } else {
    ui["turn-message"].textContent =
      "👀 " +
      playerNameFor(game.turn) +
      " typt een antwoord...";
  }

  if (game.bonusTurn) {
    ui["turn-message"].textContent +=
      " Laatste beurt op deze vraag.";
  }

  ui["last-event"].textContent =
    game.lastEvent;

  renderUsedAnswers(game);

  updateAnswerControls();
  renderTyping();

  handleGameEvent(game);

  /*
   * Autofocus bij jouw beurt.
   * We proberen het direct en nog
   * één keer nadat de DOM is bijgewerkt.
   */

  if (
    game.turn === myRole &&
    !hasFocused
  ) {
    hasFocused = true;

    requestAnimationFrame(
      focusMyAnswer
    );

    setTimeout(
      focusMyAnswer,
      70
    );
  }
}


/* ============================================================
   WINNAAR + OPNIEUW SPELEN
============================================================ */

function renderWinner(game) {
  ui["winner-title"].textContent =
    "🏆 " +
    playerNameFor(game.winner) +
    " WINT!";

  ui["winner-description"].textContent =
    playerNameFor("host") +
    ": " +
    game.hostScore +
    " punten · " +
    playerNameFor("guest") +
    ": " +
    game.guestScore +
    " punten";

  const myVote =
    room.rematch?.[myRole] ===
    game.matchNumber;

  const opponentVote =
    room.rematch?.[otherRole(myRole)] ===
    game.matchNumber;

  if (!myVote) {
    ui["new-room-button"].textContent =
      "🔄 OPNIEUW SPELEN IN DEZELFDE ROOM";

    ui["new-room-button"].disabled = false;

  } else if (opponentVote) {
    ui["new-room-button"].textContent =
      "✅ Nieuw duel wordt gestart...";

    ui["new-room-button"].disabled = true;

  } else {
    ui["new-room-button"].textContent =
      "✅ Klaar! Wachten op tegenstander...";

    ui["new-room-button"].disabled = true;
  }
}


/* ============================================================
   COMPLETE ROOM TONEN
============================================================ */

function renderRoom() {
  drawPlayers();

  const game = room.game;

  ui["start-duel-button"].hidden = !(
    myRole === "host" &&
    Boolean(room.guest) &&
    !game
  );

  /*
   * Wachtkamer.
   */

  if (!game) {
    ui["game-section"].hidden = true;
    ui["winner-section"].hidden = true;

    if (room.guest) {
      roomNotice(
        "✅ Beide spelers zijn verbonden! " +
        (
          myRole === "host"
            ? "Start het duel."
            : "Wacht op de maker."
        ),
        "success"
      );

    } else {
      roomNotice(
        "⏳ Deel de roomcode met een vriend."
      );
    }

    return;
  }

  /*
   * Eindscherm.
   */

  if (game.status === "finished") {
    handleGameEvent(game);

    ui["game-section"].hidden = true;
    ui["winner-section"].hidden = false;

    renderWinner(game);

    roomNotice(
      "🏆 Het duel is afgelopen!",
      "success"
    );

    if (myRole === "host") {
      tryStartRematch();
    }

    return;
  }

  /*
   * Actief duel.
   */

  ui["game-section"].hidden = false;
  ui["winner-section"].hidden = true;

  roomNotice(
    "⚔️ Het duel is bezig!",
    "success"
  );

  renderGame(game);
}


/* ============================================================
   OPNIEUW SPELEN: STEM UITBRENGEN

   Beide spelers moeten op
   OPNIEUW SPELEN klikken.

   De roomcode, namen en
   karakters blijven behouden.
============================================================ */

async function voteForRematch() {
  const game = room?.game;

  if (
    !game ||
    game.status !== "finished" ||
    !myRole
  ) {
    return;
  }

  try {
    await set(
      ref(
        database,
        "duelRooms/" +
        roomCode +
        "/rematch/" +
        myRole
      ),

      game.matchNumber
    );

  } catch (error) {
    console.error(error);

    roomNotice(
      "❌ Opnieuw spelen kon niet " +
      "worden bevestigd.",
      "error"
    );
  }
}


/* ============================================================
   OPNIEUW SPELEN: NIEUW POTJE STARTEN

   Zodra beide spelers akkoord zijn,
   start de host een nieuwe wedstrijd.

   Een Firebase-transactie zorgt ervoor
   dat het duel maar één keer herstart.
============================================================ */

async function tryStartRematch() {
  const game = room?.game;

  if (
    rematchBusy ||
    myRole !== "host" ||
    game?.status !== "finished"
  ) {
    return;
  }

  const hostReady =
    room.rematch?.host ===
    game.matchNumber;

  const guestReady =
    room.rematch?.guest ===
    game.matchNumber;

  if (
    !hostReady ||
    !guestReady
  ) {
    return;
  }

  rematchBusy = true;

  try {
    const nextMatchNumber =
      game.matchNumber + 1;

    await runTransaction(
      ref(
        database,
        "duelRooms/" +
        roomCode +
        "/game"
      ),

      currentGame => {
        if (
          !currentGame ||
          currentGame.status !== "finished" ||
          currentGame.matchNumber !==
            game.matchNumber
        ) {
          return;
        }

        return initialGame(
          nextMatchNumber
        );
      },

      {
        applyLocally: false
      }
    );

  } catch (error) {
    console.error(error);

    roomNotice(
      "❌ Opnieuw starten mislukt.",
      "error"
    );

  } finally {
    rematchBusy = false;
  }
}


/* ============================================================
   DE TIMER EN DE GROEIENDE VLAM

   Een beurt duurt nu 14 seconden.
============================================================ */

function updateTimer() {
  const game = room?.game;

  if (
    !game ||
    game.status !== "playing"
  ) {
    return;
  }

  const timeLeft =
    game.deadline - serverNow();

  const secondsLeft = Math.max(
    0,
    Math.ceil(
      timeLeft / 1000
    )
  );

  const progress = Math.max(
    0,
    Math.min(
      1,
      1 - timeLeft / TURN_DURATION
    )
  );

  ui["turn-timer"].textContent =
    String(secondsLeft);

  const urgent = secondsLeft <= 4;

  ui["turn-timer"].classList.toggle(
    "urgent",
    urgent
  );

  ui["timer-balloon"].classList.toggle(
    "danger",
    urgent
  );

  /*
   * De vlam groeit gedurende
   * de volledige 14 seconden.
   */

  const flameScale =
    0.15 + progress * 2.3;

  const flameOpacity =
    0.2 + progress * 0.8;

  ui["timer-balloon"].style.setProperty(
    "--flame-scale",
    flameScale.toFixed(2)
  );

  ui["timer-balloon"].style.setProperty(
    "--flame-opacity",
    flameOpacity.toFixed(2)
  );

  updateAnswerControls();

  if (timeLeft <= 0) {
    processTimeout();
  }
}

setInterval(
  updateTimer,
  150
);


/* ============================================================
   ROOMCODE KOPIËREN
============================================================ */

async function copyCode() {
  try {
    await navigator.clipboard.writeText(
      roomCode
    );

    ui["copy-button"].textContent =
      "✅ Gekopieerd";

    setTimeout(() => {
      ui["copy-button"].textContent =
        "📋 Kopieer code";
    }, 2000);

  } catch (error) {
    roomNotice(
      "Selecteer de code om te kopiëren."
    );
  }
}


/* ============================================================
   KNOPPEN VERBINDEN
============================================================ */

ui["create-button"].addEventListener(
  "click",
  createRoom
);

ui["join-button"].addEventListener(
  "click",
  joinRoom
);

ui["start-duel-button"].addEventListener(
  "click",
  startDuel
);

ui["answer-form"].addEventListener(
  "submit",
  submitAnswer
);

ui["new-room-button"].addEventListener(
  "click",
  voteForRematch
);

ui["copy-button"].addEventListener(
  "click",
  copyCode
);


/* ============================================================
   ROOMCODE INVOEREN
============================================================ */

ui["room-input"].addEventListener(
  "input",
  () => {
    ui["room-input"].value =
      cleanRoomCode(
        ui["room-input"].value
      );
  }
);

ui["room-input"].addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      event.preventDefault();
      joinRoom();
    }
  }
);


/* ============================================================
   LIVE TYPEN EN ENTER
============================================================ */

for (const playerRole of [
  "host",
  "guest"
]) {
  const input =
    ui[playerRole + "-answer-input"];

  input.addEventListener(
    "input",
    scheduleTyping
  );

  input.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        event.preventDefault();

        ui["answer-form"].requestSubmit();
      }
    }
  );
}


/* ============================================================
   AUTOMATISCHE FOCUS BIJ TERUGKEREN
============================================================ */

document.addEventListener(
  "visibilitychange",
  () => {
    if (!document.hidden) {
      focusMyAnswer();
    }
  }
);


/* ============================================================
   FIREBASE INITIALISEREN
============================================================ */

async function initialize() {
  renderAvatarPicker();

  ui["turn-timer"].textContent = "14";

  /*
   * De oude footer kan nog
   * "12 seconden" vermelden.
   * Die passen we automatisch aan.
   */

  const footer =
    document.querySelector(
      ".duel-footer-note"
    );

  if (footer) {
    footer.textContent =
      footer.textContent.replace(
        "12 seconden",
        "14 seconden"
      );
  }

  try {
    if (questions.length === 0) {
      throw new Error(
        "Geen vragen gevonden. " +
        "Controleer vragen-uitbreiding.js " +
        "en het nieuwe antwoordenbestand."
      );
    }

    const result =
      await signInAnonymously(auth);

    currentUserId = result.user.uid;

    connectionNotice(
      "✅ Verbonden! Kies je naam en karakter.",
      "success"
    );

    updateLobbyControls();

    console.log(
      "🎈 QuizBallon Duel gestart!"
    );

    console.log(
      "📚 Aantal duelvragen:",
      questions.length
    );

  } catch (error) {
    console.error(error);

    connectionNotice(
      "❌ Kon QuizBallon niet starten: " +
      error.message,
      "error"
    );
  }
}

initialize();
