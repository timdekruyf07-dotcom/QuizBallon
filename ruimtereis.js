/* =====================================================
   QUIZBALLON - RUIMTEREIS
   VERSIE 1

   - LEEST DE HOOGTE VAN DE LUCHTBALLON
   - LAAT PLANETEN SNELLER VERSCHIJNEN
   - VERANDERT DE ACHTERGRONDKLEUREN
   - VOEGT STERREN TOE
   - TOONT DE MELKWEG EN EEN RUIMTENEVEL
   - WERKT TOT 2000 KM

   Dit is een fantasieruimtereis.
   De spelhoogtes zijn geen echte
   astronomische afstanden.

   LAAD DIT BESTAND NA script.js,
   daily.js EN resultaten.js.
===================================================== */

(function () {
  "use strict";

  const world = document.getElementById("world");

  const heightDisplay =
    document.getElementById("height-display");

  const gameScreen =
    document.getElementById("game-screen");

  if (!world || !heightDisplay || !gameScreen) {
    console.error(
      "QuizBallon Ruimtereis: vereiste elementen ontbreken."
    );
    return;
  }

  /*
   * Voorkom dubbele ruimtelagen.
   */

  if (document.getElementById("qb-space-layer")) {
    return;
  }


  /* ========================================
     HELPFUNCTIES
  ======================================== */

  function createElement(tag, className, parent) {
    const element = document.createElement(tag);

    element.className = className;

    if (parent) {
      parent.appendChild(element);
    }

    return element;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);

    return t * t * (3 - 2 * t);
  }

  function interpolate(start, end, amount) {
    return start + (end - start) * amount;
  }


  /* ========================================
     RUIMTELAAG MAKEN
  ======================================== */

  const layer = createElement(
    "div",
    "qb-space-layer",
    world
  );

  layer.id = "qb-space-layer";

  layer.setAttribute("aria-hidden", "true");


  /* ========================================
     AARDGLOED
  ======================================== */

  createElement(
    "div",
    "qb-earth-glow",
    layer
  );


  /* ========================================
     STERRENVELD
  ======================================== */

  const starfield = createElement(
    "div",
    "qb-starfield",
    layer
  );


  /* ========================================
     VASTE RANDOMFUNCTIE

     De sterren staan op iedere
     pagina op dezelfde plekken.
  ======================================== */

  let randomSeed = 123456789;

  function random() {
    randomSeed =
      (Math.imul(randomSeed, 1664525) +
        1013904223) >>> 0;

    return randomSeed / 4294967296;
  }


  /* ========================================
     STERREN GENEREREN
  ======================================== */

  for (let i = 0; i < 95; i++) {
    const star = createElement(
      "span",
      "qb-star",
      starfield
    );

    star.style.left =
      (random() * 100).toFixed(2) + "%";

    star.style.top =
      (random() * 100).toFixed(2) + "%";

    const size = interpolate(
      1,
      3.8,
      random()
    );

    star.style.setProperty(
      "--qb-star-size",
      size.toFixed(2) + "px"
    );

    star.style.setProperty(
      "--qb-star-brightness",
      (0.4 + random() * 0.6).toFixed(2)
    );

    star.style.setProperty(
      "--qb-star-duration",
      (2.5 + random() * 4).toFixed(2) + "s"
    );

    star.style.setProperty(
      "--qb-star-delay",
      (-random() * 7).toFixed(2) + "s"
    );
  }


  /* ========================================
     MELKWEG
  ======================================== */

  const galaxy = createElement(
    "div",
    "qb-galaxy",
    layer
  );


  /* ========================================
     KLEURRIJKE RUIMTENEVEL
  ======================================== */

  const nebula = createElement(
    "div",
    "qb-nebula",
    layer
  );


  /* ========================================
     MAAN
  ======================================== */

  const moon = createElement(
    "div",
    "qb-space-object qb-moon",
    layer
  );

  ["one", "two", "three", "four"].forEach(
    function (name) {
      createElement(
        "span",
        "qb-moon-crater " + name,
        moon
      );
    }
  );


  /* ========================================
     MARS
  ======================================== */

  const mars = createElement(
    "div",
    "qb-space-object qb-mars",
    layer
  );


  /* ========================================
     ZON
  ======================================== */

  const sun = createElement(
    "div",
    "qb-space-object qb-sun",
    layer
  );


  /* ========================================
     JUPITER
  ======================================== */

  const jupiter = createElement(
    "div",
    "qb-space-object qb-jupiter",
    layer
  );


  /* ========================================
     SATURNUS
  ======================================== */

  const saturn = createElement(
    "div",
    "qb-space-object qb-saturn-wrap",
    layer
  );

  createElement(
    "div",
    "qb-saturn-ring",
    saturn
  );

  createElement(
    "div",
    "qb-saturn-planet",
    saturn
  );


  /* ========================================
     WANNEER ZIJN DE OBJECTEN ZICHTBAAR?

     start: begint te verschijnen
     full: volledig zichtbaar
     fade: begint te verdwijnen
     end: volledig verdwenen

     Objecten overlappen soms kort,
     zodat de overgang vloeiender is.
  ======================================== */

  const objects = [
    {
      element: moon,
      start: 95,
      full: 175,
      fade: 320,
      end: 425
    },
    {
      element: mars,
      start: 285,
      full: 365,
      fade: 510,
      end: 630
    },
    {
      element: sun,
      start: 485,
      full: 580,
      fade: 755,
      end: 900
    },
    {
      element: jupiter,
      start: 1200,
      full: 1330,
      fade: 1540,
      end: 1675
    },
    {
      element: saturn,
      start: 1490,
      full: 1600,
      fade: 1800,
      end: 1940
    }
  ];


  /* ========================================
     ZICHTBAARHEID BEREKENEN
  ======================================== */

  function getVisibility(height, config) {
    if (
      height <= config.start ||
      height >= config.end
    ) {
      return 0;
    }

    if (height < config.full) {
      return smoothstep(
        (height - config.start) /
        (config.full - config.start)
      );
    }

    if (height <= config.fade) {
      return 1;
    }

    return 1 - smoothstep(
      (height - config.fade) /
      (config.end - config.fade)
    );
  }


  /* ========================================
     PLANETEN BIJWERKEN
  ======================================== */

  function updatePlanets(height) {
    objects.forEach(function (config) {
      const visibility =
        getVisibility(height, config);

      config.element.style.opacity =
        visibility.toFixed(3);

      /*
       * De planeet lijkt iets dichterbij
       * te komen terwijl je stijgt.
       */

      const progress = clamp(
        (height - config.start) /
          (config.end - config.start),
        0,
        1
      );

      config.element.style.setProperty(
        "--qb-object-scale",
        (0.70 + progress * 0.42).toFixed(3)
      );

      config.element.style.setProperty(
        "--qb-object-y",
        (-progress * 24).toFixed(1) + "px"
      );
    });
  }


  /* ========================================
     KLEUREN VOOR DE HEMEL

     Iedere regel heeft:
     [hoogte, bovenkleur, onderkleur]

     Tussen deze punten worden kleuren
     geleidelijk berekend.
  ======================================== */

  const skyColors = [
    {
      height: 0,
      top: [80, 175, 248],
      bottom: [179, 226, 255]
    },
    {
      height: 80,
      top: [45, 122, 207],
      bottom: [118, 185, 241]
    },
    {
      height: 180,
      top: [23, 56, 121],
      bottom: [73, 118, 190]
    },
    {
      height: 320,
      top: [12, 27, 73],
      bottom: [40, 65, 123]
    },
    {
      height: 520,
      top: [8, 15, 49],
      bottom: [30, 43, 96]
    },
    {
      height: 760,
      top: [5, 10, 34],
      bottom: [14, 25, 67]
    },
    {
      height: 1050,
      top: [6, 8, 30],
      bottom: [17, 18, 59]
    },
    {
      height: 1450,
      top: [4, 7, 23],
      bottom: [19, 20, 52]
    },
    {
      height: 1800,
      top: [5, 5, 22],
      bottom: [23, 11, 55]
    },
    {
      height: 2000,
      top: [6, 5, 24],
      bottom: [40, 13, 69]
    }
  ];


  /* ========================================
     RGB KLEUREN MENGEN
  ======================================== */

  function mixColor(first, second, progress) {
    return first.map(function (value, index) {
      return Math.round(
        interpolate(
          value,
          second[index],
          progress
        )
      );
    });
  }

  function toRgb(values) {
    return "rgb(" + values.join(",") + ")";
  }


  /* ========================================
     HEMELKLEUR BEREKENEN
  ======================================== */

  function getSkyGradient(height) {
    let first = skyColors[0];
    let second = skyColors[skyColors.length - 1];

    for (let i = 0; i < skyColors.length - 1; i++) {
      if (
        height >= skyColors[i].height &&
        height <= skyColors[i + 1].height
      ) {
        first = skyColors[i];
        second = skyColors[i + 1];
        break;
      }
    }

    const distance =
      second.height - first.height;

    const progress =
      distance === 0
        ? 0
        : clamp(
            (height - first.height) / distance,
            0,
            1
          );

    const top = mixColor(
      first.top,
      second.top,
      progress
    );

    const bottom = mixColor(
      first.bottom,
      second.bottom,
      progress
    );

    return (
      "linear-gradient(180deg, " +
      toRgb(top) +
      " 0%, " +
      toRgb(bottom) +
      " 100%)"
    );
  }


  /* ========================================
     HOOFDUPDATE

     Wordt uitgevoerd zodra de hoogte
     van de luchtballon verandert.
  ======================================== */

  let lastHeight = -1;

  function updateSpaceJourney(force) {
    const raw = heightDisplay.textContent || "0";

    /*
     * "1.200 km" -> 1200
     */

    const height = clamp(
      Number(raw.replace(/[^\d]/g, "")) || 0,
      0,
      2000
    );

    if (!force && height === lastHeight) {
      return;
    }

    lastHeight = height;

    /*
     * Achtergrondkleur.
     */

    world.style.setProperty(
      "--qb-sky-background",
      getSkyGradient(height)
    );

    /*
     * Aardgloed wordt kleiner
     * naarmate je hoger vliegt.
     */

    world.style.setProperty(
      "--qb-earth-opacity",
      (
        1 - smoothstep(height / 650)
      ).toFixed(3)
    );

    /*
     * De eerste sterren verschijnen
     * al relatief vroeg.
     */

    const starOpacity = smoothstep(
      (height - 45) / 320
    );

    world.style.setProperty(
      "--qb-stars-opacity",
      starOpacity.toFixed(3)
    );

    /*
     * Planeten.
     */

    updatePlanets(height);

    /*
     * De Melkweg komt later
     * in de reis in beeld.
     */

    const galaxyVisibility = getVisibility(
      height,
      {
        start: 820,
        full: 1040,
        fade: 1340,
        end: 1570
      }
    );

    galaxy.style.opacity =
      galaxyVisibility.toFixed(3);

    galaxy.style.transform =
      "rotate(-25deg) scale(" +
      (
        0.85 +
        smoothstep(
          (height - 820) / 750
        ) * 0.25
      ).toFixed(3) +
      ")";

    /*
     * De nevel verschijnt
     * helemaal aan het einde.
     */

    const nebulaVisibility = smoothstep(
      (height - 1680) / 270
    );

    nebula.style.opacity =
      nebulaVisibility.toFixed(3);
  }


  /* ========================================
     HOOGTEMETER OBSERVEREN

     De bestaande script.js past de
     hoogtetekst aan als je punten krijgt.

     Wij reageren daarop zonder de
     bestaande spelcode te wijzigen.
  ======================================== */

  const heightObserver = new MutationObserver(
    function () {
      updateSpaceJourney(false);
    }
  );

  heightObserver.observe(
    heightDisplay,
    {
      childList: true,
      characterData: true,
      subtree: true
    }
  );


  /* ========================================
     OPSTARTEN
  ======================================== */

  world.classList.add("qb-space-on");

  updateSpaceJourney(true);

  console.log(
    "🌌 QuizBallon Ruimtereis geladen!"
  );

})();
