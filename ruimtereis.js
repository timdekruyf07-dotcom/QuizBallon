/* =====================================================
   QUIZBALLON - RUIMTEREIS V2

   NIEUW:
   - PLANETEN KOMEN VAN BOVEN
   - PLANETEN BEWEGEN NAAR BENEDEN
   - DE VOLGENDE PLANEET VOLGT AUTOMATISCH
   - VLOEIENDE OVERGANGEN
   - STERRENHEMEL EN MELKWEG
   - REIS TOT 2000 KM

   De afstanden zijn fantasieafstanden
   speciaal voor QuizBallon.
===================================================== */

(function () {
  "use strict";

  const world =
    document.getElementById("world");

  const heightDisplay =
    document.getElementById("height-display");

  if (!world || !heightDisplay) {
    console.error(
      "QuizBallon Ruimtereis: vereiste elementen ontbreken."
    );
    return;
  }

  if (
    document.getElementById("qb-space-layer")
  ) {
    return;
  }

  /* ========================================
     INSTELLINGEN

     De milestone geeft aan bij welke
     hoogte het object ongeveer in het
     midden van de reis zichtbaar is.

     Door de verticale snelheid schuift
     elk object omlaag als de hoogte stijgt.
  ======================================== */

  const MAX_HEIGHT = 2000;

  const SCROLL_SPEED = 1.65;

  const OBJECTS = [
    {
      name: "maan",
      className: "qb-moon",
      milestone: 210,
      x: "75%"
    },
    {
      name: "mars",
      className: "qb-mars",
      milestone: 460,
      x: "70%"
    },
    {
      name: "zon",
      className: "qb-sun",
      milestone: 700,
      x: "77%"
    },
    {
      name: "melkweg",
      className: "qb-galaxy",
      milestone: 1080,
      x: "55%"
    },
    {
      name: "jupiter",
      className: "qb-jupiter",
      milestone: 1390,
      x: "74%"
    },
    {
      name: "saturnus",
      className: "qb-saturn",
      milestone: 1660,
      x: "74%"
    },
    {
      name: "nevel",
      className: "qb-nebula",
      milestone: 1940,
      x: "55%"
    }
  ];

  /* ========================================
     HULPFUNCTIES
  ======================================== */

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function mix(a, b, amount) {
    return a + (b - a) * amount;
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function create(
    tag,
    className,
    parent
  ) {
    const element = document.createElement(tag);

    element.className = className;

    if (parent) {
      parent.appendChild(element);
    }

    return element;
  }

  /* ========================================
     RUIMTELAAG
  ======================================== */

  const layer = create(
    "div",
    "qb-space-layer",
    world
  );

  layer.id = "qb-space-layer";

  layer.setAttribute("aria-hidden", "true");

  /* ========================================
     AARDGLOED
  ======================================== */

  create(
    "div",
    "qb-earth-glow",
    layer
  );

  /* ========================================
     STERRENVELD
  ======================================== */

  const starfield = create(
    "div",
    "qb-starfield",
    layer
  );

  /*
   * Vaste willekeurige sterren,
   * zodat het beeld niet iedere
   * keer anders verspringt.
   */

  let randomSeed = 789456123;

  function random() {
    randomSeed =
      (
        Math.imul(randomSeed, 1664525) +
        1013904223
      ) >>> 0;

    return randomSeed / 4294967296;
  }

  for (let i = 0; i < 130; i++) {
    const star = create(
      "span",
      "qb-star",
      starfield
    );

    star.style.left =
      (random() * 100).toFixed(2) + "%";

    star.style.top =
      (random() * 100).toFixed(2) + "%";

    star.style.setProperty(
      "--star-size",
      (1 + random() * 2.8).toFixed(2) + "px"
    );

    star.style.setProperty(
      "--star-opacity",
      (.4 + random() * .6).toFixed(2)
    );

    star.style.setProperty(
      "--star-speed",
      (2.5 + random() * 4).toFixed(2) + "s"
    );

    star.style.animationDelay =
      (-random() * 8).toFixed(2) + "s";
  }

  /* ========================================
     PLANETEN MAKEN
  ======================================== */

  const travellingObjects = [];

  OBJECTS.forEach(function (config) {
    const element = create(
      "div",
      "qb-travelling-object " + config.className,
      layer
    );

    element.style.setProperty(
      "--object-x",
      config.x
    );

    if (config.name === "maan") {
      ["one", "two", "three", "four"].forEach(
        function (name) {
          create(
            "span",
            "qb-moon-crater " + name,
            element
          );
        }
      );
    }

    if (config.name === "saturnus") {
      create(
        "div",
        "qb-saturn-ring",
        element
      );

      create(
        "div",
        "qb-saturn-planet",
        element
      );
    }

    travellingObjects.push({
      ...config,
      element
    });
  });

  /* ========================================
     HEMELKLEUREN

     De lucht wordt geleidelijk donker.
  ======================================== */

  const skyStages = [
    {
      height: 0,
      top: [91, 187, 255],
      bottom: [198, 235, 255]
    },
    {
      height: 80,
      top: [43, 120, 206],
      bottom: [118, 188, 247]
    },
    {
      height: 180,
      top: [21, 52, 126],
      bottom: [69, 113, 197]
    },
    {
      height: 350,
      top: [12, 27, 77],
      bottom: [31, 65, 131]
    },
    {
      height: 550,
      top: [7, 17, 53],
      bottom: [21, 40, 100]
    },
    {
      height: 850,
      top: [5, 11, 35],
      bottom: [13, 26, 73]
    },
    {
      height: 1150,
      top: [8, 9, 36],
      bottom: [23, 19, 68]
    },
    {
      height: 1500,
      top: [5, 8, 28],
      bottom: [22, 23, 58]
    },
    {
      height: 1800,
      top: [7, 6, 28],
      bottom: [35, 18, 68]
    },
    {
      height: 2000,
      top: [10, 5, 35],
      bottom: [53, 18, 79]
    }
  ];

  function mixColor(start, end, amount) {
    return start.map(function (value, index) {
      return Math.round(
        mix(value, end[index], amount)
      );
    });
  }

  function rgb(values) {
    return "rgb(" + values.join(",") + ")";
  }

  function getSky(height) {
    let first = skyStages[0];
    let second = skyStages[skyStages.length - 1];

    for (let i = 0; i < skyStages.length - 1; i++) {
      if (
        height >= skyStages[i].height &&
        height <= skyStages[i + 1].height
      ) {
        first = skyStages[i];
        second = skyStages[i + 1];
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
      rgb(top) +
      " 0%, " +
      rgb(bottom) +
      " 100%)"
    );
  }

  /* ========================================
     HOOGTE UITLEZEN

     Zowel "500 km" als "1.500 km"
     wordt correct gelezen.
  ======================================== */

  function getHeight() {
    const text =
      heightDisplay.textContent || "0";

    const digits =
      text.replace(/[^\d]/g, "");

    return clamp(
      Number(digits) || 0,
      0,
      MAX_HEIGHT
    );
  }

  /* ========================================
     POSITIE VAN EEN OBJECT

     Dit is het belangrijkste deel.

     Bij een lagere hoogte staat een
     object verder BOVEN het scherm.

     Wanneer de speler stijgt, neemt
     de Y-positie toe.

     Het object schuift dus
     NAAR BENEDEN.

     Daarna volgt automatisch het
     volgende object van boven.
  ======================================== */

  function getObjectPosition(
    height,
    milestone,
    viewportHeight
  ) {
    const centerY = viewportHeight * .35;

    return (
      centerY +
      (height - milestone) * SCROLL_SPEED
    );
  }

  /* ========================================
     ZICHTBAARHEID

     Objecten worden alleen getoond
     wanneer ze in of dicht bij het
     scherm zijn.

     Ze verschijnen niet plotseling
     midden in beeld.
  ======================================== */

  function getObjectOpacity(
    position,
    objectHeight,
    viewportHeight
  ) {
    /*
     * Een object is buiten beeld als
     * het te ver boven of onder het
     * scherm staat.
     */

    const topBoundary = -objectHeight - 80;
    const bottomBoundary = viewportHeight + 80;

    const fadeInEnd = -objectHeight * .15;
    const fadeOutStart = viewportHeight - 50;

    if (
      position <= topBoundary ||
      position >= bottomBoundary
    ) {
      return 0;
    }

    if (position < fadeInEnd) {
      return smoothstep(
        (position - topBoundary) /
        (fadeInEnd - topBoundary)
      );
    }

    if (position > fadeOutStart) {
      return 1 - smoothstep(
        (position - fadeOutStart) /
        (bottomBoundary - fadeOutStart)
      );
    }

    return 1;
  }

  /* ========================================
     ALLE OBJECTEN VERPLAATSEN
  ======================================== */

  function updateObjects(height) {
    const viewportHeight =
      Math.max(
        window.innerHeight,
        world.clientHeight || 0
      );

    travellingObjects.forEach(function (object) {
      const position = getObjectPosition(
        height,
        object.milestone,
        viewportHeight
      );

      const objectHeight =
        object.element.getBoundingClientRect().height ||
        200;

      const opacity = getObjectOpacity(
        position,
        objectHeight,
        viewportHeight
      );

      object.element.style.transform =
        "translate3d(-50%, " +
        position.toFixed(1) +
        "px, 0)";

      object.element.style.opacity =
        opacity.toFixed(3);
    });
  }

  /* ========================================
     COMPLETE RUIMTEREIS BIJWERKEN
  ======================================== */

  let lastHeight = -1;

  function updateSpace(force = false) {
    const height = getHeight();

    if (!force && height === lastHeight) {
      return;
    }

    lastHeight = height;

    /*
     * Achtergrondkleur.
     */

    world.style.setProperty(
      "--qb-sky-background",
      getSky(height)
    );

    /*
     * De aardgloed verdwijnt.
     */

    world.style.setProperty(
      "--qb-earth-opacity",
      (
        1 - smoothstep(height / 630)
      ).toFixed(3)
    );

    /*
     * Wolken verdwijnen wanneer
     * de ruimte dichterbij komt.
     */

    world.style.setProperty(
      "--qb-cloud-opacity",
      (
        1 - smoothstep((height - 50) / 270)
      ).toFixed(3)
    );

    /*
     * Sterren verschijnen al vroeg.
     */

    world.style.setProperty(
      "--qb-stars-opacity",
      smoothstep(
        (height - 45) / 320
      ).toFixed(3)
    );

    /*
     * Het sterrenveld schuift ook
     * een beetje mee.
     */

    starfield.style.transform =
      "translate3d(0, " +
      (height * .12).toFixed(1) +
      "px, 0)";

    /*
     * Planeten, Melkweg en nevel.
     */

    updateObjects(height);
  }

  /* ========================================
     HOOGTEVERANDERINGEN OBSERVEREN
  ======================================== */

  const observer = new MutationObserver(
    function () {
      updateSpace();
    }
  );

  observer.observe(heightDisplay, {
    childList: true,
    characterData: true,
    subtree: true
  });

  /* ========================================
     SCHERMGROOTTE VERANDERT
  ======================================== */

  window.addEventListener(
    "resize",
    function () {
      updateSpace(true);
    }
  );

  /* ========================================
     OPSTARTEN
  ======================================== */

  world.classList.add("qb-space-on");

  /*
   * Eerst de laag opbouwen.
   * Daarna de objecten positioneren.
   */

  requestAnimationFrame(function () {
    updateSpace(true);
  });

  console.log(
    "🌌 QuizBallon Ruimtereis V2 geladen!"
  );

})();
