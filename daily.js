/* ==========================================================
   QUIZBALLON DAILY V7 - 650 VRAGEN

   - 10 vragen per dag
   - 6 t/m 9 verschillende categorieën per dag
   - maximaal 2 vragen uit dezelfde categorie
   - geen basisvraag uit de vorige 10 dagen
   - 1 lettervraag, 9 gewone vragen
   - dezelfde vaste dagselectie voor iedereen
   - Nederland: 00:00 tot 00:00
   - 1 afgeronde Daily per browser per dag
   - oude resultaten van Daily V6 blijven bewaard

   Vereist: vragen-650.js VOOR daily.js
   Daily gebruikt uitsluitend de 650 nieuwe basisvragen.
========================================================== */
(function () {
  "use strict";

  const TZ = "Europe/Amsterdam";
  const DAILY_COUNT = 10;
  const BLOCK_DAYS = 10;
  const MIN_CATEGORIES = 6;
  const MAX_CATEGORIES = 9;
  const EPOCH = Date.UTC(2026, 10, 27) / 86400000;
  const STORAGE = "quizballon-daily-result-v1";
  const VERSION = "QB650-2026-11-27-1";
  const QUESTIONS = window.QB650_QUESTIONS;
  const BY_CATEGORY = window.QB650_BY_CATEGORY;
  const ui = {
    start: document.getElementById("start-button"),
    restart: document.getElementById("restart-button"),
    home: document.getElementById("home-button"),
    quit: document.getElementById("quit-button"),
    startScreen: document.getElementById("start-screen"),
    end: document.getElementById("end-screen"),
    date: document.getElementById("daily-date"),
    description: document.getElementById("daily-description"),
    status: document.getElementById("daily-status"),
    countdown: document.getElementById("daily-countdown"),
    endMessage: document.getElementById("daily-end-message"),
    endScore: document.getElementById("end-score"),
    endHeight: document.getElementById("end-height"),
    endCorrect: document.getElementById("end-correct")
  };

  function fail(message) {
    console.error("QuizBallon Daily V7: " + message);
    if (ui.description) ui.description.textContent = "Daily tijdelijk niet beschikbaar: " + message;
    if (ui.start) ui.start.disabled = true;
  }

  if (!Array.isArray(QUESTIONS) || QUESTIONS.length !== 650 ||
      !BY_CATEGORY || Object.keys(BY_CATEGORY).length !== 13) {
    fail("Het bestand vragen-650.js is niet volledig geladen.");
    return;
  }

  if (!ui.start || !ui.end || !ui.endScore) {
    fail("Vereiste HTML-elementen ontbreken.");
    return;
  }

  function hash(value) {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let x = seed >>> 0;
    return function () {
      x += 0x6d2b79f5;
      let t = x;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, seed) {
    const result = list.slice();
    const rand = rng(seed);
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function dutchDate(date) {
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
    }).format(date || new Date());
  }

  function numberOfDay(key) {
    const [y, m, d] = key.split("-").map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  }

  function keyOfDay(number) {
    return new Date(number * 86400000).toISOString().slice(0, 10);
  }

  const categoryNames = Object.keys(BY_CATEGORY).sort();
  const pools = {};
  categoryNames.forEach(function (name) {
    if (BY_CATEGORY[name].length !== 50) throw Error("Geen 50 vragen in " + name);
    pools[name] = shuffle(
      BY_CATEGORY[name].slice().sort(function (a, b) { return a.id.localeCompare(b.id); }),
      hash(VERSION + "|pool|" + name)
    );
  });

  /*
   * Eerst willekeurig 6-9 verschillende categorieën kiezen.
   * Daarna extra categoriebeurten verdelen, maximaal 2 per
   * categorie. Er is GEEN categorie die verplicht iedere dag
   * aan bod komt.
   */
  function categorySlots(day) {
    const key = keyOfDay(day);
    const order = shuffle(categoryNames, hash(VERSION + "|cats|" + key));
    const count = MIN_CATEGORIES +
      (hash(VERSION + "|count|" + key) % (MAX_CATEGORIES - MIN_CATEGORIES + 1));
    const chosen = order.slice(0, count);
    const extras = shuffle(chosen, hash(VERSION + "|extra|" + key))
      .slice(0, DAILY_COUNT - count);
    return shuffle(chosen.concat(extras), hash(VERSION + "|slots|" + key));
  }

  /*
   * Permanente, voorspelbare reeks:
   * Iedere categorie heeft 50 unieke vragen in een geschudde
   * lijst. Bij een categoriebeurt nemen we de volgende vraag.
   * Per dag zijn er maximaal 2 beurten per categorie.
   * Eenzelfde vraag kan dus niet binnen 10 dagen terugkeren:
   * er kunnen maximaal 20 van de 50 posities passeren.
   *
   * De planning wordt deterministisch opgebouwd vanaf
   * 27 november 2026. Daardoor krijgen alle bezoekers met
   * dezelfde versie dezelfde vragen.
   */
  const used = {};
  categoryNames.forEach(function (name) { used[name] = 0; });
  const planCache = new Map();
  let highestBuilt = EPOCH - 1;

  function ensurePlan(day) {
    if (!Number.isInteger(day) || day < EPOCH) {
      throw Error("Daily V7 ondersteunt datums vanaf 2026-11-27.");
    }
    for (let d = highestBuilt + 1; d <= day; d++) {
      const slots = categorySlots(d);
      const entry = slots.map(function (category) {
        const pool = pools[category];
        const question = pool[used[category] % pool.length];
        used[category]++;
        return { category: category, id: question.id, question: question };
      });
      planCache.set(d, entry);
      highestBuilt = d;
    }
    return planCache.get(day);
  }

  function letters(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  }

  const RULES = [
    { name: "de naam heeft minstens 5 letters", test: function (n) { return letters(n).length >= 5; } },
    { name: "de naam heeft minstens 6 letters", test: function (n) { return letters(n).length >= 6; } },
    { name: "de naam bevat de letter A", test: function (n) { return letters(n).includes("a"); } },
    { name: "de naam bevat de letter E", test: function (n) { return letters(n).includes("e"); } },
    { name: "de naam bevat de letter O", test: function (n) { return letters(n).includes("o"); } },
    { name: "de naam bevat minstens 2 klinkers", test: function (n) {
      return (letters(n).match(/[aeiou]/g) || []).length >= 2;
    } },
    { name: "de naam begint met een medeklinker", test: function (n) {
      return /^[bcdfghjklmnpqrstvwxyz]/.test(letters(n));
    } },
    { name: "de naam eindigt op een medeklinker", test: function (n) {
      return /[bcdfghjklmnpqrstvwxyz]$/.test(letters(n));
    } }
  ];

  function makeLetterQuestion(question, dayKey) {
    const rules = shuffle(RULES, hash(VERSION + "|rules|" + dayKey + "|" + question.id));
    for (const rule of rules) {
      const accepted = question.answers.filter(function (a) {
        return rule.test(a.answer);
      });
      if (accepted.length < 4) continue;
      const copy = accepted.map(function (answer) {
        return {
          ...answer,
          aliases: (answer.aliases || []).filter(rule.test),
          isRocket: false,
          points: Math.min(99, Number(answer.points) || 10)
        };
      });
      const originalRocket = question.answers.find(function (a) {
        return a.isRocket && rule.test(a.answer);
      });
      const rocket = (originalRocket && copy.find(function (a) {
        return a.answer === originalRocket.answer;
      })) || copy.reduce(function (a, b) { return a.points >= b.points ? a : b; });
      rocket.points = 100;
      rocket.isRocket = true;
      return {
        ...question,
        isLetterQuestion: true,
        question: question.question.replace(/[.!?\s]+$/, "") +
          ". Extra eis: " + rule.name + ".",
        hint: "Alleen antwoorden die voldoen aan de extra lettereis tellen mee.",
        answers: copy
      };
    }
    return null;
  }

  function select(key) {
    const day = numberOfDay(key);
    const base = ensurePlan(day);
    const items = base.map(function (entry) {
      return {
        id: entry.id,
        category: entry.category,
        question: entry.question
      };
    });
    const eligible = shuffle(items.map(function (item, index) {
      return { index: index, question: makeLetterQuestion(item.question, key) };
    }).filter(function (x) { return x.question !== null; }), hash(VERSION + "|letter|" + key));
    if (!eligible.length) throw Error("Geen geschikte lettervraag op " + key);
    const winner = eligible[0];
    items[winner.index].question = winner.question;
    return items;
  }

  function verify(key) {
    const day = numberOfDay(key);
    const today = select(key);
    if (today.length !== DAILY_COUNT) return false;
    const ids = new Set(today.map(function (x) { return x.id; }));
    const counts = {};
    today.forEach(function (x) { counts[x.category] = (counts[x.category] || 0) + 1; });
    const categoryCount = Object.keys(counts).length;
    if (ids.size !== DAILY_COUNT || categoryCount < MIN_CATEGORIES ||
        categoryCount > MAX_CATEGORIES ||
        Object.values(counts).some(function (n) { return n > 2; })) return false;
    if (today.filter(function (x) { return x.question.isLetterQuestion; }).length !== 1) return false;
    for (let offset = 1; offset <= BLOCK_DAYS; offset++) {
      if (day - offset < EPOCH) break;
      const previous = ensurePlan(day - offset);
      if (previous.some(function (x) { return ids.has(x.id); })) return false;
    }
    return true;
  }

  const todayKey = dutchDate();
  let startedKey = null;
  let completed = null;
  let endWasActive = false;

  function readCompletion() {
    try {
      const r = JSON.parse(localStorage.getItem(STORAGE) || "null");
      return r && r.date === todayKey ? r : null;
    } catch (e) { return null; }
  }
  function isDone() { return Boolean(completed); }

  function clock() {
    const result = { hour: 0, minute: 0, second: 0 };
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, hour: "2-digit", minute: "2-digit",
      second: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).forEach(function (part) {
      if (part.type in result) result[part.type] = Number(part.value);
    });
    return result;
  }

  function timeRemaining() {
    const c = clock();
    let n = 86400 - c.hour * 3600 - c.minute * 60 - c.second;
    return [Math.floor(n / 3600), Math.floor(n % 3600 / 60), n % 60]
      .map(function (x) { return String(x).padStart(2, "0"); }).join(":");
  }

  function buttonText(button, value) {
    if (!button) return;
    button.replaceChildren(document.createTextNode(value + " "));
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    button.appendChild(arrow);
  }

  function updateHome() {
    if (ui.date) ui.date.textContent = new Intl.DateTimeFormat("nl-NL", {
      timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(new Date());
    if (ui.countdown) ui.countdown.textContent = timeRemaining();
    if (ui.status) {
      ui.status.textContent = isDone() ? "VOLTOOID ✓" : "BESCHIKBAAR";
      ui.status.classList.toggle("completed", isDone());
    }
    if (ui.description) ui.description.textContent = isDone()
      ? "Vandaag gespeeld: " + (completed.score || 0) + " punten. Morgen nieuwe vragen!"
      : "10 verrassende vragen uit 13 onderwerpen. Minstens 6 categorieën per dag en 10 dagen geen herhaling.";
    ui.start.disabled = isDone();
    if (ui.restart) ui.restart.disabled = isDone();
    buttonText(ui.start, isDone() ? "MORGEN WEER SPELEN" : "START DE DAGELIJKSE VLUCHT");
    buttonText(ui.restart, "MORGEN WEER SPELEN");
  }

  function recordEnd() {
    const active = ui.end.classList.contains("active");
    if (!active) { endWasActive = false; return; }
    if (endWasActive) return;
    endWasActive = true;
    if (startedKey !== todayKey || isDone()) return;
    const scoreText = (ui.endScore.textContent || "").replace(/[^0-9]/g, "");
    const score = Number(scoreText);
    if (!Number.isFinite(score)) return;
    completed = {
      date: todayKey,
      score: score,
      height: (ui.endHeight && ui.endHeight.textContent || "").trim(),
      correct: (ui.endCorrect && ui.endCorrect.textContent || "").trim(),
      completedAt: new Date().toISOString(),
      dailyVersion: VERSION
    };
    try {
      localStorage.setItem(STORAGE, JSON.stringify(completed));
    } catch (e) { console.warn("Daily kon niet worden opgeslagen.", e); }
    startedKey = null;
    if (ui.endMessage) ui.endMessage.textContent =
      "📅 Daily voltooid! Morgen om 00.00 uur Nederlandse tijd nieuwe vragen.";
    updateHome();
  }

  function startListener() {
    if (!isDone()) startedKey = todayKey;
  }

  function tick() {
    if (dutchDate() !== todayKey) {
      window.location.reload();
      return;
    }
    if (ui.countdown) ui.countdown.textContent = timeRemaining();
  }

  window.QUIZBALLON_DAILY_DEBUG = {
    version: VERSION,
    totalUnique: 650,
    categories: 13,
    selectDate: function (key) {
      return select(key).map(function (x) {
        return { category: x.category, id: x.id, question: x.question.question };
      });
    },
    historyOK: verify,
    compare: function (a, b) {
      const first = new Set(select(a).map(function (x) { return x.id; }));
      return select(b).filter(function (x) { return first.has(x.id); })
        .map(function (x) { return x.id; });
    },
    simulate: function (startKey, days) {
      const out = { tested: 0, errors: [] };
      const first = numberOfDay(startKey);
      for (let i = 0; i < days; i++) {
        const key = keyOfDay(first + i);
        if (!verify(key)) out.errors.push(key);
        out.tested++;
      }
      return out;
    }
  };

  try {
    if (!verify(todayKey)) {
      fail("Controle op verdeling of 10-dagenblokkade is mislukt.");
      return;
    }
    const selected = select(todayKey);
    window.QUIZBALLON_EXPANDED_QUESTIONS = selected.map(function (x) { return x.question; });
    window.QUIZBALLON_DAILY_INFO = {
      date: todayKey,
      version: VERSION,
      uniqueBaseQuestions: 650,
      topics: selected.map(function (x) { return x.id; }),
      questions: selected.map(function (x) { return x.question.question; }),
      letterQuestionCount: selected.filter(function (x) { return x.question.isLetterQuestion; }).length,
      categories: [...new Set(selected.map(function (x) { return x.category; }))]
    };
    completed = readCompletion();
    updateHome();
    ui.start.addEventListener("click", startListener, true);
    if (ui.restart) ui.restart.addEventListener("click", startListener, true);
    new MutationObserver(recordEnd).observe(ui.end, {
      attributes: true, attributeFilter: ["class"]
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") tick();
    });
    setInterval(tick, 1000);
    console.log("✅ QuizBallon Daily V7 actief: 650 vragen, 13 categorieën.");
    console.log("✅ 10 dagen vraagblokkade en maximaal 2 vragen per categorie.");
    console.table(window.QUIZBALLON_DAILY_DEBUG.selectDate(todayKey));
  } catch (error) {
    fail(error.message);
  }
})();
