/* ============================================================
   QUIZBALLON DUEL - VERSIE 2
   LICHT DESIGN + LIVE TYPEN + KARAKTERS

   SPELREGELS:
   - 2 spelers
   - ieder begint met 2 levens
   - maximaal 3 levens
   - extra leven bij 250 punten
   - 12 seconden per beurt
   - maximaal 12 antwoorden per vraag
   - geen dubbele antwoorden
   - bij tijdverlies: 1 leven kwijt
   - tegenstander krijgt nog één beurt
   - daarna automatisch volgende vraag

   NIEUWE FUNCTIES:
   - 6 ZELFGETEKENDE SVG-KARAKTERS
   - LIVE ZIEN WAT DE TEGENSTANDER TYPT
   - TWEE ANTWOORDVAKKEN
   - BRANDENDE QB-BALLON ALS TIMER
   - HARTJESANIMATIES
   - VISUELE VOORTGANG NAAR EXTRA LEVEN

   LET OP:
   Deze testversie gebruikt client-side
   antwoordcontrole en is nog niet
   volledig beveiligd tegen valsspelen.
============================================================ */


/* ============================================================
   FIREBASE IMPORTS
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
   FIREBASE CONFIGURATIE
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
   INSTELLINGEN
============================================================ */

const TURN_SECONDS = 12;
const TURN_DURATION = TURN_SECONDS * 1000;

const MAX_ANSWERS = 12;

const START_LIVES = 2;
const MAX_LIVES = 3;

const EXTRA_LIFE_POINTS = 250;

const TYPING_DELAY = 220;

const ROOM_ALPHABET =
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

  avatarPicker: byId("avatar-picker"),

  roomInput: byId("room-input"),

  createButton: byId("create-button"),
  joinButton: byId("join-button"),

  roomPanel: byId("room-panel"),

  roomCode: byId("room-code"),
  copyButton: byId("copy-button"),

  hostCard: byId("host-card"),
  guestCard: byId("guest-card"),

  hostAvatar: byId("host-avatar"),
  guestAvatar: byId("guest-avatar"),

  hostName: byId("host-name"),
  guestName: byId("guest-name"),

  hostHearts: byId("host-hearts"),
  guestHearts: byId("guest-hearts"),

  hostScore: byId("host-score"),
  guestScore: byId("guest-score"),

  hostProgressTrack: byId("host-progress-track"),
  guestProgressTrack: byId("guest-progress-track"),

  hostProgressFill: byId("host-progress-fill"),
  guestProgressFill: byId("guest-progress-fill"),

  hostProgressLabel: byId("host-progress-label"),
  guestProgressLabel: byId("guest-progress-label"),

  hostStatus: byId("host-status"),
  guestStatus: byId("guest-status"),

  hostHeartEffects: byId("host-heart-effects"),
  guestHeartEffects: byId("guest-heart-effects"),

  roomStatus: byId("room-status"),

  startDuelButton: byId("start-duel-button"),

  gameSection: byId("game-section"),

  roundDisplay: byId("round-display"),
  turnTimer: byId("turn-timer"),

  timerBalloon: byId("timer-balloon"),

  questionCategory: byId("question-category"),
  questionText: byId("question-text"),

  hostAnswerLane: byId("host-answer-lane"),
  guestAnswerLane: byId("guest-answer-lane"),

  hostTurnLabel: byId("host-turn-label"),
  guestTurnLabel: byId("guest-turn-label"),

  hostTurnStatus: byId("host-turn-status"),
  guestTurnStatus: byId("guest-turn-status"),

  hostAnswerInput: byId("host-answer-input"),
  guestAnswerInput: byId("guest-answer-input"),

  turnMessage: byId("turn-message"),

  answerForm: byId("answer-form"),
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
   STATUS
============================================================ */

let currentUser = null;

let currentRoomCode = null;
let currentRoom = null;

let myRole = null;

let selectedAvatar = "astro";

let stopRoomListener = null;

let serverTimeOffset = 0;

let busy = false;

let sendingAnswer = false;
let processingTimeout = false;

let typingTimer = null;

let previousTurnId = null;
let previousQuestionKey = "";

let previousEventNumber = null;

let burnTimeout = null;


/* ============================================================
   KARAKTERS

   Alle figuren zijn getekend als SVG.
   Er zijn geen externe afbeeldingen
   of betaalde bestanden nodig.

   De speler kiest uit:
   - Astronaut
   - Robot
   - Alien
   - Piraat
   - Tovenaar
   - Vos
============================================================ */

const AVATARS = [
  {
    id: "astro",
    name: "Astronaut",
    color: "#b9e8ff"
  },
  {
    id: "robot",
    name: "Robot",
    color: "#d7d0ff"
  },
  {
    id: "alien",
    name: "Alien",
    color: "#d4f7bd"
  },
  {
    id: "piraat",
    name: "Piraat",
    color: "#ffe2ac"
  },
  {
    id: "tovenaar",
    name: "Tovenaar",
    color: "#eacaff"
  },
  {
    id: "vos",
    name: "Vos",
    color: "#ffddb7"
  }
];


/* ============================================================
   SVG-KARAKTER TEKENEN

   Alleen vooraf gedefinieerde
   onderdelen worden als SVG gebruikt.
   Spelersnamen worden nooit als HTML
   in de pagina geplaatst.
============================================================ */

function avatarSvg(id) {
  const avatar =
    AVATARS.find(item => item.id === id) ||
    AVATARS[0];

  const background = `
    <circle
      cx="60"
      cy="60"
      r="55"
      fill="${avatar.color}"
    />
    <ellipse
      cx="60"
      cy="103"
      rx="34"
      ry="10"
      fill="#24466b"
      opacity=".10"
    />
  `;

  let drawing = "";

  if (id === "astro") {
    drawing = `
      <path
        d="M25 105 Q30 76 60 76 Q90 76 95 105"
        fill="#ffffff"
        stroke="#447cbd"
        stroke-width="4"
      />
      <circle
        cx="60"
        cy="52"
        r="37"
        fill="#ffffff"
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
        stroke-linecap="round"
      />
      <rect
        x="50"
        y="86"
        width="20"
        height="12"
        rx="4"
        fill="#ff6379"
      />
    `;
  }

  if (id === "robot") {
    drawing = `
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
        stroke-linecap="round"
      />
      <path
        d="M60 28 V15"
        stroke="#536fbe"
        stroke-width="5"
      />
      <circle cx="60" cy="13" r="7" fill="#ff7187"/>
      <rect
        x="19"
        y="47"
        width="10"
        height="22"
        rx="4"
        fill="#536fbe"
      />
      <rect
        x="91"
        y="47"
        width="10"
        height="22"
        rx="4"
        fill="#536fbe"
      />
    `;
  }

  if (id === "alien") {
    drawing = `
      <path
        d="M30 108 Q36 78 60 78 Q84 78 90 108"
        fill="#6fbf83"
      />
      <path
        d="M36 40 Q20 16 24 11 Q40 17 45 34"
        fill="#84d878"
      />
      <path
        d="M84 40 Q100 16 96 11 Q80 17 75 34"
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
        transform="rotate(-20 45 56)"
      />
      <ellipse
        cx="75"
        cy="56"
        rx="11"
        ry="15"
        fill="#263d5a"
        transform="rotate(20 75 56)"
      />
      <circle cx="41" cy="51" r="3" fill="#ffffff"/>
      <circle cx="71" cy="51" r="3" fill="#ffffff"/>
      <path
        d="M52 77 Q60 84 68 77"
        stroke="#39855f"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
      />
      <circle cx="60" cy="96" r="7" fill="#f8e98f"/>
    `;
  }

  if (id === "piraat") {
    drawing = `
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
        stroke-linecap="round"
      />
      <circle cx="60" cy="29" r="10" fill="#ffffff"/>
      <circle cx="60" cy="29" r="5" fill="#233d5b"/>
      <path
        d="M39 56 H58"
        stroke="#273d5b"
        stroke-width="6"
      />
      <circle cx="43" cy="55" r="7" fill="#273d5b"/>
      <path
        d="M58 56 L73 50"
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
      <path
        d="M60 95 L50 110 H70 Z"
        fill="#f5d992"
      />
    `;
  }

  if (id === "tovenaar") {
    drawing = `
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
        stroke-linecap="round"
      />
      <path
        d="M43 69 Q60 109 77 69"
        fill="#ffffff"
      />
      <circle cx="49" cy="57" r="3" fill="#33456d"/>
      <circle cx="71" cy="57" r="3" fill="#33456d"/>
      <path
        d="M54 68 Q60 73 66 68"
        stroke="#b8777a"
        stroke-width="3"
        fill="none"
      />
      <path
        d="M58 15 L62 24 L72 24 L64 30 L67 40 L58 34 L49 40 L52 30 L44 24 L55 24 Z"
        fill="#ffe36a"
      />
    `;
  }

  if (id === "vos") {
    drawing = `
      <path
        d="M22 100 Q37 75 60 80 Q83 75 98 100"
        fill="#ec874a"
      />
      <path
        d="M26 49 L22 13 L49 31"
        fill="#e7813c"
        stroke="#9e4b2d"
        stroke-width="4"
      />
      <path
        d="M94 49 L98 13 L71 31"
        fill="#e7813c"
        stroke="#9e4b2d"
        stroke-width="4"
      />
      <path
        d="M32 43 L29 23 L44 37"
        fill="#ffcfba"
      />
      <path
        d="M88 43 L91 23 L76 37"
        fill="#ffcfba"
      />
      <ellipse
        cx="60"
        cy="58"
        rx="37"
        ry="35"
        fill="#f69c4e"
      />
      <path
        d="M25 62 Q38 72 60 67 Q82 72 95 62 Q83 95 60 96 Q37 95 25 62"
        fill="#fff5e3"
      />
      <circle cx="47" cy="56" r="4" fill="#3c3540"/>
      <circle cx="73" cy="56" r="4" fill="#3c3540"/>
      <path
        d="M54 70 Q60 65 66 70 L60 77 Z"
        fill="#3c3540"
      />
      <path
        d="M60 77 Q54 83 48 78 M60 77 Q66 83 72 78"
        stroke="#765447"
        stroke-width="2.5"
        fill="none"
        stroke-linecap="round"
      />
    `;
  }

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      role="img"
      aria-label="${avatar.name}"
    >
      ${background}
      ${drawing}
    </svg>
  `;
}


/* ============================================================
   KARAKTERKEUZE OPBOUWEN
============================================================ */

function initializeAvatarPicker() {
  ui.avatarPicker.replaceChildren();

  AVATARS.forEach(avatar => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "avatar-option";

    button.dataset.avatar = avatar.id;

    button.setAttribute(
      "aria-label",
      "Kies " + avatar.name
    );

    button.setAttribute(
      "aria-pressed",
      String(avatar.id === selectedAvatar)
    );

    button.innerHTML =
      avatarSvg(avatar.id) +
      "<span>" + avatar.name + "</span>";

    button.addEventListener("click", () => {
      selectedAvatar = avatar.id;

      updateAvatarSelection();
    });

    ui.avatarPicker.appendChild(button);
  });

  updateAvatarSelection();
}

function updateAvatarSelection() {
  ui.avatarPicker
    .querySelectorAll(".avatar-option")
    .forEach(button => {
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

function updateDisplayedAvatars(room) {
  ui.hostAvatar.innerHTML =
    avatarSvg(room.hostAvatar || "astro");

  ui.guestAvatar.innerHTML =
    avatarSvg(room.guest?.avatar || "robot");
}


/* ============================================================
   VRAGENBANK

   Voorlopig dezelfde Duel-kennisvragen
   die in de vorige werkende versie
   werden gebruikt.

   Later koppelen we duel-vragen.js
   met een eigen uitgebreide vragenbank.
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

    const text =
      question.question.toLowerCase();

    if (text.includes("sterrenbeeld")) {
      return false;
    }

    if (
      text.includes("bekende vrouw") &&
      text.includes("geschiedenis")
    ) {
      return false;
    }

    return question.answers.length >= 50;
  });
}

const questions = loadDuelQuestions();


/* ============================================================
   STATUSBERICHTEN
============================================================ */

function showConnectionStatus(
  message,
  type = ""
) {
  ui.connectionStatus.textContent = message;

  ui.connectionStatus.className =
    "duel-notice " + type;
}

function showRoomStatus(
  message,
  type = ""
) {
  ui.roomStatus.textContent = message;

  ui.roomStatus.className =
    "duel-notice room-notice " + type;
}

function showFeedback(
  message,
  type = ""
) {
  ui.answerFeedback.textContent = message;

  ui.answerFeedback.className =
    "answer-feedback " + type;
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
   NORMALISEREN
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
   ANTWOORDEN LEZEN
============================================================ */

function answerName(answer) {
  if (typeof answer === "string") {
    return answer;
  }

  return String(
    answer.answer ||
    answer.name ||
    ""
  );
}

function answerAliases(answer) {
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

function answerPoints(answer) {
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
      Math.min(
        99,
        Math.round(9 + rarity * .86)
      )
    );
  }

  return 10;
}

function findAnswer(question, typed) {
  const wanted = normalize(typed);

  if (!wanted) {
    return null;
  }

  for (let i = 0; i < question.answers.length; i++) {
    const entry = question.answers[i];

    const possibleNames = [
      answerName(entry),
      ...answerAliases(entry)
    ];

    if (
      possibleNames.some(
        name => normalize(name) === wanted
      )
    ) {
      return {
        key: "a" + i,
        name: answerName(entry),
        points: answerPoints(entry)
      };
    }
  }

  return null;
}


/* ============================================================
   ROOMCODE EN SPELERSNAAM
============================================================ */

function generateRoomCode() {
  const bytes = new Uint8Array(6);

  crypto.getRandomValues(bytes);

  let code = "";

  for (const byte of bytes) {
    code += ROOM_ALPHABET[
      byte % ROOM_ALPHABET.length
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
    showConnectionStatus(
      "❌ Kies een naam van 2 tot 18 tekens.",
      "error"
    );

    ui.playerName.focus();
    return null;
  }

  return name;
}


/* ============================================================
   SERVERKLOK
============================================================ */

function serverNow() {
  return Date.now() + serverTimeOffset;
}

onValue(
  ref(database, ".info/serverTimeOffset"),
  snapshot => {
    serverTimeOffset =
      Number(snapshot.val()) || 0;
  }
);


/* ============================================================
   VRAGEN EN SPELERS
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
  return questions[game.questionIndex] || null;
}

function otherRole(role) {
  return role === "host" ? "guest" : "host";
}

function getRoleName(role) {
  if (!currentRoom) {
    return role === "host"
      ? "Speler 1"
      : "Speler 2";
  }

  return role === "host"
    ? currentRoom.hostName
    : currentRoom.guest?.name || "Speler 2";
}

function hearts(lives) {
  const count = Math.max(
    0,
    Math.min(
      MAX_LIVES,
      Number(lives) || 0
    )
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

  showRoomStatus(
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

  stopRoomListener = onValue(
    ref(database, "duelRooms/" + code),

    snapshot => {
      if (!snapshot.exists()) {
        showRoomStatus(
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
        showRoomStatus(
          "❌ Je bent geen speler in deze room.",
          "error"
        );

        return;
      }

      updateRoomInterface(room);
    },

    error => {
      console.error(error);

      showRoomStatus(
        "❌ Room lezen mislukt. " +
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

  showConnectionStatus(
    "🏠 Room aanmaken..."
  );

  try {
    let lastError = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateRoomCode();

      try {
        await set(
          ref(database, "duelRooms/" + code),
          {
            hostUid: currentUser.uid,
            hostName: name,
            hostAvatar: selectedAvatar,
            createdAt: serverTimestamp()
          }
        );

        showRoom(code);
        listenToRoom(code);

        showConnectionStatus(
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
      new Error("Room aanmaken mislukt.");

  } catch (error) {
    console.error(error);

    showConnectionStatus(
      "❌ Room aanmaken mislukt. " +
      "Controleer of de nieuwste Firebase Rules " +
      "zijn gepubliceerd.",
      "error"
    );

  } finally {
    busy = false;
    updateLobbyButtons();
  }
}


/* ============================================================
   DEELNEMEN
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
    showConnectionStatus(
      "❌ Vul een roomcode van 6 tekens in.",
      "error"
    );

    return;
  }

  busy = true;
  updateLobbyButtons();

  showConnectionStatus(
    "🔄 Deelnemen aan " + code + "..."
  );

  try {
    await set(
      ref(
        database,
        "duelRooms/" + code + "/guest"
      ),
      {
        uid: currentUser.uid,
        name,
        avatar: selectedAvatar
      }
    );

    showRoom(code);
    listenToRoom(code);

    showConnectionStatus(
      "✅ Je bent lid van de room!",
      "success"
    );

  } catch (error) {
    console.error(error);

    showConnectionStatus(
      "❌ Deelnemen mislukt. " +
      "Controleer de roomcode of maak een nieuwe room.",
      "error"
    );

  } finally {
    busy = false;
    updateLobbyButtons();
  }
}


/* ============================================================
   BEGINSTATUS DUEL
============================================================ */

function makeInitialGame(code) {
  return {
    status: "playing",

    questionIndex: firstQuestionIndex(code),
    round: 1,

    turn: "host",
    turnId: 1,
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
    lastType: "start",
    lastLoser: "",

    eventNumber: 1
  };
}


/* ============================================================
   DUEL STARTEN
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
    const result = await runTransaction(
      ref(
        database,
        "duelRooms/" +
        currentRoomCode +
        "/game"
      ),

      existing => {
        if (existing !== null) {
          return;
        }

        return makeInitialGame(
          currentRoomCode
        );
      },

      {
        applyLocally: false
      }
    );

    if (!result.committed) {
      showRoomStatus(
        "Het duel is al gestart."
      );
    }

  } catch (error) {
    console.error(error);

    showRoomStatus(
      "❌ Duel starten mislukt. " +
      "Controleer Firebase Rules.",
      "error"
    );

  } finally {
    ui.startDuelButton.disabled = false;
  }
}


/* ============================================================
   VOLGENDE VRAAG
============================================================ */

function advanceQuestion(
  game,
  nextStarter,
  time
) {
  game.questionIndex =
    (game.questionIndex + 1) %
    questions.length;

  game.round += 1;

  game.turn = nextStarter;
  game.turnCount = 0;

  game.turnId += 1;

  game.deadline = Math.round(
    time + TURN_DURATION
  );

  game.bonusTurn = false;
  game.resetStarter = nextStarter;

  delete game.used;
}


/* ============================================================
   PUNTEN EN EXTRA LEVENS

   Als een speler al 3 levens heeft,
   blijft de extra-levensbalk leeg.

   Na het verliezen van een leven
   kan die opnieuw punten sparen.
============================================================ */

function addPoints(game, role, points) {
  const scoreKey = role + "Score";
  const progressKey = role + "Progress";
  const livesKey = role + "Lives";

  game[scoreKey] += points;

  if (game[livesKey] >= MAX_LIVES) {
    game[progressKey] = 0;
    return false;
  }

  game[progressKey] += points;

  if (
    game[progressKey] >= EXTRA_LIFE_POINTS
  ) {
    game[progressKey] -= EXTRA_LIFE_POINTS;
    game[livesKey] += 1;

    if (game[livesKey] >= MAX_LIVES) {
      game[progressKey] = 0;
    }

    return true;
  }

  return false;
}


/* ============================================================
   ANTWOORD AL GEBRUIKT?
============================================================ */

function answerUsed(game, key) {
  return Boolean(
    game.used &&
    game.used[key]
  );
}


/* ============================================================
   EIGEN ANTWOORDVELD
============================================================ */

function myAnswerInput() {
  return myRole === "host"
    ? ui.hostAnswerInput
    : ui.guestAnswerInput;
}


/* ============================================================
   LIVE TYPEN

   Bij het typen sturen we de
   tekst naar Firebase.

   Elke 220 milliseconden wordt
   hoogstens één update geprobeerd.

   turnId zorgt ervoor dat een oude
   tekst niet zichtbaar blijft bij
   de volgende beurt.
============================================================ */

function canTypeNow() {
  const game = currentRoom?.game;

  return Boolean(
    game &&
    game.status === "playing" &&
    game.turn === myRole &&
    serverNow() < game.deadline &&
    !sendingAnswer
  );
}

async function sendTypingText() {
  if (
    !currentRoomCode ||
    !myRole ||
    !canTypeNow()
  ) {
    return;
  }

  const turnId = currentRoom.game.turnId;

  const text = myAnswerInput().value.slice(
    0,
    100
  );

  try {
    await set(
      ref(
        database,
        "duelRooms/" +
        currentRoomCode +
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
     * De beurt kan ondertussen
     * afgelopen zijn.

     * Dat is geen ernstige fout:
     * de tekst van de nieuwe beurt
     * blijft dan gewoon leeg.
     */
  }
}

function scheduleTypingUpdate() {
  clearTimeout(typingTimer);

  if (!canTypeNow()) {
    return;
  }

  typingTimer = setTimeout(
    sendTypingText,
    TYPING_DELAY
  );
}

function cancelTypingUpdate() {
  clearTimeout(typingTimer);
  typingTimer = null;
}


/* ============================================================
   LIVE TEKST VAN TEGENSTANDER TONEN

   Een antwoord wordt pas gebruikt
   wanneer het daadwerkelijk correct
   is ingediend.

   Alleen typen reserveert dus niets.
============================================================ */

function updateLiveTyping(room) {
  const game = room.game;

  if (
    !game ||
    game.status !== "playing"
  ) {
    return;
  }

  const hostText =
    room.typing?.host?.turnId === game.turnId
      ? room.typing.host.text || ""
      : "";

  const guestText =
    room.typing?.guest?.turnId === game.turnId
      ? room.typing.guest.text || ""
      : "";

  /*
   * De speler ziet in het eigen
   * antwoordvak de eigen tekst.
   *
   * Alleen het vak van de tegenstander
   * wordt vanuit Firebase ingevuld.
   */

  if (myRole !== "host") {
    ui.hostAnswerInput.value =
      game.turn === "host" ? hostText : "";
  }

  if (myRole !== "guest") {
    ui.guestAnswerInput.value =
      game.turn === "guest" ? guestText : "";
  }
}


/* ============================================================
   ANTWOORD INSTUREN
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

  if (!canTypeNow()) {
    showFeedback(
      "⏳ Je bent nog niet aan de beurt.",
      "bad"
    );

    return;
  }

  const input = myAnswerInput();

  const typed = input.value.trim();

  if (!typed) {
    showFeedback(
      "Vul eerst een antwoord in.",
      "bad"
    );

    return;
  }

  const question = getQuestion(game);

  if (!question) {
    showFeedback(
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
    showFeedback(
      "❌ Dit antwoord staat niet in de antwoordenbank. " +
      "Je mag opnieuw proberen zolang je tijd hebt.",
      "bad"
    );

    return;
  }

  if (answerUsed(game, answer.key)) {
    showFeedback(
      "🚫 Dat antwoord is al gebruikt!",
      "bad"
    );

    return;
  }

  sendingAnswer = true;

  cancelTypingUpdate();

  updateAnswerControls();

  const submittedRole = myRole;
  const submittedTurnId = game.turnId;

  try {
    const result = await runTransaction(
      ref(
        database,
        "duelRooms/" +
        currentRoomCode +
        "/game"
      ),

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
          answerUsed(currentGame, answer.key)
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

        const earnedLife = addPoints(
          next,
          submittedRole,
          answer.points
        );

        next.lastEvent =
          "✅ " +
          getRoleName(submittedRole) +
          ": " +
          answer.name +
          " (+" +
          answer.points +
          " punten)" +
          (earnedLife
            ? " 💖 EXTRA LEVEN!"
            : "");

        next.lastType = earnedLife
          ? "extraLife"
          : "answer";

        next.lastLoser = submittedRole;

        next.eventNumber += 1;

        const now = serverNow();

        /*
         * Dit was de laatste beurt
         * van de tegenstander na
         * een verloren leven.
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
         * Na 12 goede antwoorden:
         * nieuwe vraag.
         */

        if (
          next.turnCount >= MAX_ANSWERS
        ) {
          advanceQuestion(
            next,
            otherRole(submittedRole),
            now
          );

          return next;
        }

        /*
         * Gewone beurtwisseling.
         */

        next.turn = otherRole(
          submittedRole
        );

        next.turnId += 1;

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
      input.value = "";

      showFeedback(
        "✅ Goed antwoord! +" +
        answer.points +
        " punten.",
        "good"
      );

    } else {
      showFeedback(
        "⏱️ De beurt is intussen veranderd " +
        "of het antwoord is al gebruikt.",
        "bad"
      );
    }

  } catch (error) {
    console.error(error);

    showFeedback(
      "❌ Verzenden mislukt. " +
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

   Wanneer de tijd op is, verliest
   de actieve speler één leven.

   De tegenstander krijgt nog één
   beurt op dezelfde vraag.

   Daarna volgt de volgende vraag.
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
    await runTransaction(
      ref(
        database,
        "duelRooms/" +
        currentRoomCode +
        "/game"
      ),

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
        const opponent = otherRole(loser);

        const livesKey = loser + "Lives";

        next[livesKey] = Math.max(
          0,
          next[livesKey] - 1
        );

        next.eventNumber += 1;

        next.lastType = "timeout";
        next.lastLoser = loser;

        const now = serverNow();

        /*
         * Geen levens meer:
         * duel afgelopen.
         */

        if (next[livesKey] <= 0) {
          next.status = "finished";
          next.winner = opponent;
          next.deadline = 0;

          next.lastEvent =
            "💔 " +
            getRoleName(loser) +
            " heeft geen levens meer!";

          return next;
        }

        /*
         * Ook de laatste beurt
         * van de tegenstander
         * is verlopen.

         * Dan direct verder met
         * een nieuwe vraag.
         */

        if (next.bonusTurn) {
          next.lastEvent =
            "💔 " +
            getRoleName(loser) +
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
         * Eerste mislukte beurt.
         */

        next.bonusTurn = true;
        next.resetStarter = loser;

        next.turn = opponent;
        next.turnId += 1;

        next.deadline = Math.round(
          now + TURN_DURATION
        );

        next.lastEvent =
          "💔 " +
          getRoleName(loser) +
          " verloor een leven! " +
          "De tegenstander mag nog één keer.";

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
   LEVENS EN PROGRESSIE TONEN
============================================================ */

function updateLifeProgress(
  role,
  game
) {
  const lives = game[role + "Lives"];
  const progress = game[role + "Progress"];

  const fill = role === "host"
    ? ui.hostProgressFill
    : ui.guestProgressFill;

  const label = role === "host"
    ? ui.hostProgressLabel
    : ui.guestProgressLabel;

  const track = role === "host"
    ? ui.hostProgressTrack
    : ui.guestProgressTrack;

  if (lives >= MAX_LIVES) {
    fill.style.width = "100%";
    label.textContent = "MAX LEVENS ❤️";

    track.setAttribute(
      "aria-valuenow",
      "100"
    );

    return;
  }

  const percentage = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (progress / EXTRA_LIFE_POINTS) * 100
      )
    )
  );

  fill.style.width = percentage + "%";

  label.textContent =
    percentage + "%";

  track.setAttribute(
    "aria-valuenow",
    String(percentage)
  );
}


/* ============================================================
   SPELERSKAARTEN BIJWERKEN
============================================================ */

function updatePlayers(room) {
  ui.hostName.textContent =
    room.hostName || "Speler 1";

  ui.guestName.textContent =
    room.guest?.name || "Nog niemand";

  updateDisplayedAvatars(room);

  ui.hostTurnLabel.textContent =
    "🔴 " + (room.hostName || "Speler 1");

  ui.guestTurnLabel.textContent =
    "🔵 " +
    (room.guest?.name || "Speler 2");

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

    ui.hostScore.textContent = "0";
    ui.guestScore.textContent = "0";

    ui.hostProgressFill.style.width = "0%";
    ui.guestProgressFill.style.width = "0%";

    ui.hostProgressLabel.textContent = "0%";
    ui.guestProgressLabel.textContent = "0%";

    ui.hostCard.classList.remove("active");
    ui.guestCard.classList.remove("active");

    return;
  }

  ui.hostHearts.textContent =
    hearts(game.hostLives);

  ui.guestHearts.textContent =
    hearts(game.guestLives);

  ui.hostScore.textContent =
    String(game.hostScore);

  ui.guestScore.textContent =
    String(game.guestScore);

  updateLifeProgress("host", game);
  updateLifeProgress("guest", game);

  const playing =
    game.status === "playing";

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
   HARTJESANIMATIE

   Bij tijdverlies:
   een hartje vliegt weg.

   Bij een extra leven:
   een nieuw hartje verschijnt.
============================================================ */

function animateHeart(role, gained = false) {
  const container = role === "host"
    ? ui.hostHeartEffects
    : ui.guestHeartEffects;

  const particle =
    document.createElement("span");

  particle.className =
    "heart-particle" +
    (gained ? " gained" : "");

  particle.textContent = gained
    ? "💖"
    : "💔";

  container.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 1400);
}


/* ============================================================
   BALLONANIMATIE BIJ TIJDVERLIES
============================================================ */

function animateBalloonBurn() {
  clearTimeout(burnTimeout);

  ui.timerBalloon.classList.remove(
    "burning"
  );

  /*
   * Animatie opnieuw laten beginnen.
   */

  void ui.timerBalloon.offsetWidth;

  ui.timerBalloon.classList.add(
    "burning"
  );

  burnTimeout = setTimeout(() => {
    ui.timerBalloon.classList.remove(
      "burning"
    );
  }, 1100);
}


/* ============================================================
   NIEUWE GEBEURTENIS CONTROLEREN

   Bij live typupdates verandert
   de room ook, maar het eventnummer
   blijft gelijk.

   Daardoor starten animaties niet
   opnieuw bij elke letter.
============================================================ */

function handleGameEvent(game) {
  if (
    previousEventNumber === null
  ) {
    previousEventNumber = game.eventNumber;
    return;
  }

  if (
    previousEventNumber ===
    game.eventNumber
  ) {
    return;
  }

  previousEventNumber = game.eventNumber;

  if (game.lastType === "timeout") {
    animateBalloonBurn();

    if (
      game.lastLoser === "host" ||
      game.lastLoser === "guest"
    ) {
      animateHeart(
        game.lastLoser,
        false
      );
    }
  }

  if (game.lastType === "extraLife") {
    if (
      game.lastLoser === "host" ||
      game.lastLoser === "guest"
    ) {
      animateHeart(
        game.lastLoser,
        true
      );
    }
  }
}


/* ============================================================
   AL GEBRUIKTE ANTWOORDEN
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
    ui.usedList.textContent =
      "Nog geen antwoorden.";
    return;
  }

  entries.forEach(answer => {
    const element =
      document.createElement("span");

    element.className =
      "used-answer";

    element.textContent =
      answer.name +
      " (+" +
      answer.points +
      ")";

    ui.usedList.appendChild(element);
  });
}


/* ============================================================
   ANTWOORDVAKKEN BIJWERKEN
============================================================ */

function updateAnswerControls() {
  const game = currentRoom?.game;

  const playing = Boolean(
    game &&
    game.status === "playing"
  );

  const hostActive =
    playing &&
    game.turn === "host";

  const guestActive =
    playing &&
    game.turn === "guest";

  ui.hostAnswerLane.classList.toggle(
    "active",
    hostActive
  );

  ui.guestAnswerLane.classList.toggle(
    "active",
    guestActive
  );

  ui.hostTurnStatus.textContent =
    hostActive
      ? "🎯 AAN DE BEURT"
      : "Wachten...";

  ui.guestTurnStatus.textContent =
    guestActive
      ? "🎯 AAN DE BEURT"
      : "Wachten...";

  const canAnswer = canTypeNow();

  ui.hostAnswerInput.disabled =
    !(canAnswer && myRole === "host");

  ui.guestAnswerInput.disabled =
    !(canAnswer && myRole === "guest");

  ui.answerButton.disabled = !canAnswer;

  /*
   * De niet-actieve speler kan
   * het antwoordveld niet bewerken,
   * maar ziet daarin wel live
   * de tekst van de tegenstander.
   */

  ui.hostAnswerInput.placeholder =
    hostActive
      ? myRole === "host"
        ? "Typ jouw antwoord..."
        : "Tegenstander typt..."
      : "Wachten op beurt...";

  ui.guestAnswerInput.placeholder =
    guestActive
      ? myRole === "guest"
        ? "Typ jouw antwoord..."
        : "Tegenstander typt..."
      : "Wachten op beurt...";
}


/* ============================================================
   SPELSCHERM BIJWERKEN
============================================================ */

function updateGame(game) {
  const question = getQuestion(game);

  if (!question) {
    showRoomStatus(
      "❌ Deze vraag ontbreekt in de vragenbank.",
      "error"
    );

    return;
  }

  const questionKey =
    game.round + "|" + game.questionIndex;

  /*
   * Nieuwe vraag:
   * invoervakken leegmaken.
   */

  if (questionKey !== previousQuestionKey) {
    previousQuestionKey = questionKey;

    ui.hostAnswerInput.value = "";
    ui.guestAnswerInput.value = "";

    showFeedback("");
  }

  /*
   * Nieuwe beurt:
   * vorige typtekst verwijderen.
   */

  if (game.turnId !== previousTurnId) {
    previousTurnId = game.turnId;

    cancelTypingUpdate();

    ui.hostAnswerInput.value = "";
    ui.guestAnswerInput.value = "";

    showFeedback("");
  }

  ui.roundDisplay.textContent =
    "VRAAG " +
    game.round +
    " · " +
    game.turnCount +
    "/12 ANTWOORDEN";

  ui.questionCategory.textContent =
    String(
      question.category || "KENNISVRAAG"
    );

  ui.questionText.textContent =
    question.question;

  if (game.turn === myRole) {
    ui.turnMessage.textContent =
      "🎯 JIJ BENT AAN DE BEURT! " +
      "Geef binnen 12 seconden een antwoord.";

  } else {
    ui.turnMessage.textContent =
      "👀 " +
      getRoleName(game.turn) +
      " is aan de beurt. " +
      "Je kunt live meekijken.";
  }

  if (game.bonusTurn) {
    ui.turnMessage.textContent +=
      " Dit is de laatste beurt " +
      "op deze vraag.";
  }

  ui.lastEvent.textContent =
    game.lastEvent || "";

  updateUsedAnswers(game);

  updateAnswerControls();

  updateLiveTyping(currentRoom);

  handleGameEvent(game);
}


/* ============================================================
   WINNAAR
============================================================ */

function updateWinner(game) {
  const winnerName =
    getRoleName(game.winner);

  ui.winnerTitle.textContent =
    "🏆 " + winnerName + " WINT!";

  ui.winnerDescription.textContent =
    getRoleName("host") +
    " behaalde " +
    game.hostScore +
    " punten. " +
    getRoleName("guest") +
    " behaalde " +
    game.guestScore +
    " punten. " +
    "Wat een duel!";

  showRoomStatus(
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
      showRoomStatus(
        "✅ " +
        room.hostName +
        " en " +
        room.guest.name +
        " zijn verbonden! " +
        (myRole === "host"
          ? "Je kunt het duel starten."
          : "Wachten totdat de maker start."),
        "success"
      );

    } else {
      showRoomStatus(
        "⏳ Deel de roomcode met een vriend. " +
        "We wachten op speler 2."
      );
    }

    return;
  }

  const game = room.game;

  if (game.status === "finished") {
    handleGameEvent(game);

    ui.gameSection.hidden = true;
    ui.winnerSection.hidden = false;

    updateWinner(game);
    return;
  }

  ui.gameSection.hidden = false;
  ui.winnerSection.hidden = true;

  showRoomStatus(
    "⚔️ Het duel is begonnen!",
    "success"
  );

  updateGame(game);
}


/* ============================================================
   LIVE TIMER + BRANDENDE BALLON

   Naarmate de tijd verstrijkt:
   - wordt de vlam groter;
   - gaat de ballon gevaarlijker gloeien;
   - kleurt de timer rood.

   Bij 0 seconden wordt de
   verloren beurt verwerkt.
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

  const fraction = Math.max(
    0,
    Math.min(
      1,
      1 - millisecondsLeft / TURN_DURATION
    )
  );

  /*
   * De vlam begint klein
   * en groeit steeds verder.
   */

  const flameScale =
    .15 + fraction * 2.3;

  const flameOpacity =
    .2 + fraction * .8;

  ui.timerBalloon.style.setProperty(
    "--flame-scale",
    flameScale.toFixed(2)
  );

  ui.timerBalloon.style.setProperty(
    "--flame-opacity",
    flameOpacity.toFixed(2)
  );

  const danger = secondsLeft <= 4;

  ui.timerBalloon.classList.toggle(
    "danger",
    danger
  );

  ui.turnTimer.classList.toggle(
    "urgent",
    danger
  );

  updateAnswerControls();

  if (millisecondsLeft <= 0) {
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
  if (!currentRoomCode) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      currentRoomCode
    );

    ui.copyButton.textContent =
      "✅ GEKOPIEERD!";

    setTimeout(() => {
      ui.copyButton.textContent =
        "📋 Kopieer code";
    }, 2000);

  } catch (error) {
    showRoomStatus(
      "Selecteer de code hierboven " +
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
   BEIDE ANTWOORDVAKKEN

   Alleen het antwoordvak van de
   huidige speler kan echt typen.
============================================================ */

ui.hostAnswerInput.addEventListener(
  "input",
  scheduleTypingUpdate
);

ui.guestAnswerInput.addEventListener(
  "input",
  scheduleTypingUpdate
);

ui.hostAnswerInput.addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      event.preventDefault();
      ui.answerForm.requestSubmit();
    }
  }
);

ui.guestAnswerInput.addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      event.preventDefault();
      ui.answerForm.requestSubmit();
    }
  }
);


/* ============================================================
   FIREBASE INITIALISEREN
============================================================ */

async function initialize() {
  initializeAvatarPicker();

  try {
    if (questions.length === 0) {
      throw new Error(
        "Geen Duel-vragen gevonden. " +
        "Controleer vragen-uitbreiding.js."
      );
    }

    const result =
      await signInAnonymously(auth);

    currentUser = result.user;

    showConnectionStatus(
      "✅ Verbonden met Firebase! " +
      "Kies je naam en karakter.",
      "success"
    );

    updateLobbyButtons();

    console.log(
      "🎈⚔️ QuizBallon Duel V2 geladen!"
    );

    console.log(
      "📚 Duel-vragen:",
      questions.length
    );

  } catch (error) {
    console.error(error);

    showConnectionStatus(
      "❌ Verbinden mislukt. " +
      "Controleer Firebase en de vragenbank.",
      "error"
    );
  }
}

initialize();
