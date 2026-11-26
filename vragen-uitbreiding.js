/* =====================================================
   QUIZBALLON - VRAGEN-UITBREIDING
   EERSTE PAKKET: 13 NIEUWE VRAGEN

   Iedere vraag heeft:
   - Een duidelijke categorie
   - Een vraag en een hint
   - Minimaal 50 vooraf ingevoerde antwoorden
   - Een zeldzaamheidsscore per antwoord
   - Precies 1 raketantwoord van 100 punten

   Scores zijn schattingen, geen
   gemeten percentages van spelers.

   Dit bestand moet geladen worden:
   NA geschiedenis.js
   VOOR daily.js
===================================================== */

(function () {
  "use strict";

  const questions =
    window.QUIZBALLON_EXPANDED_QUESTIONS;

  if (!Array.isArray(questions)) {
    console.error(
      "QuizBallon: de bestaande vragenbank ontbreekt."
    );
    return;
  }

  /* ========================================
     HELPFUNCTIES
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

  /*
   * De antwoorden staan ongeveer van
   * bekend naar minder voor de hand liggend.
   *
   * De eerste antwoorden krijgen weinig
   * punten; de laatste meer.
   *
   * Het allerlaatste antwoord is het
   * unieke raketantwoord.
   */

  function parseAnswers(text) {
    const entries = text
      .split(";")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    const seen = new Set();
    const answers = [];

    entries.forEach(function (entry) {
      const parts = entry.split("|");

      const name = parts[0].trim();

      const aliases = parts
        .slice(1)
        .map(function (value) {
          return value.trim();
        })
        .filter(Boolean);

      const key = normalize(name);

      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);

      answers.push({
        answer: name,
        aliases: aliases,
        points: 10,
        isRocket: false
      });
    });

    const lastIndex = answers.length - 1;

    answers.forEach(function (answer, index) {
      if (index === lastIndex) {
        answer.points = 100;
        answer.isRocket = true;
        return;
      }

      const progress =
        lastIndex > 0
          ? index / lastIndex
          : 0;

      /*
       * Score van 10 tot maximaal 99.
       * Dit is een voorlopige inschatting
       * van hoe onverwacht het antwoord is.
       */

      answer.points = Math.min(
        99,
        Math.max(
          10,
          Math.round(10 + 87 * progress)
        )
      );
    });

    return answers;
  }

  function addQuestion(category, question, hint, text) {
    const answers = parseAnswers(text);

    if (answers.length < 50) {
      console.error(
        "Vraag niet toegevoegd: minder dan 50 antwoorden.",
        question,
        answers.length
      );
      return;
    }

    const rocketCount = answers.filter(
      function (answer) {
        return answer.isRocket;
      }
    ).length;

    if (rocketCount !== 1) {
      console.error(
        "Vraag niet toegevoegd: onjuist aantal raketantwoorden.",
        question
      );
      return;
    }

    questions.push({
      category: category,
      question: question,
      hint: hint,
      answers: answers
    });
  }


  /* ========================================
     1. AARDRIJKSKUNDE
     AMERIKAANSE STATEN
  ======================================== */

  addQuestion(
    "🌍 AARDRIJKSKUNDE",

    "Noem een van de 50 staten van de Verenigde Staten.",

    "Alle 50 Amerikaanse staten tellen mee. Gebruik de Engelse of Nederlandse naam.",

    `
    California|Californië;
    Texas;
    Florida;
    New York;
    Hawaii|Hawaï;
    Alaska;
    Nevada;
    Washington;
    Arizona;
    Colorado;
    Georgia;
    Illinois;
    Michigan;
    Ohio;
    Pennsylvania;
    New Jersey;
    Massachusetts;
    Virginia;
    North Carolina;
    South Carolina;
    Tennessee;
    Louisiana;
    Alabama;
    Mississippi;
    Kentucky;
    Indiana;
    Wisconsin;
    Minnesota;
    Oregon;
    Oklahoma;
    Kansas;
    Missouri;
    Arkansas;
    Utah;
    New Mexico;
    Iowa;
    Nebraska;
    Idaho;
    Montana;
    Wyoming;
    North Dakota;
    South Dakota;
    Connecticut;
    Rhode Island;
    Maine;
    Vermont;
    New Hampshire;
    Maryland;
    Delaware;
    West Virginia
    `
  );


  /* ========================================
     2. RUIMTE
     STERRENBEELDEN
  ======================================== */

  addQuestion(
    "🪐 RUIMTE",

    "Noem een officieel sterrenbeeld.",

    "Het gaat om een van de 88 sterrenbeelden die officieel door astronomen worden gebruikt.",

    `
    Orion;
    Grote Beer|Ursa Major;
    Kleine Beer|Ursa Minor;
    Leeuw|Leo;
    Schorpioen|Scorpius;
    Stier|Taurus;
    Tweelingen|Gemini;
    Kreeft|Cancer;
    Maagd|Virgo;
    Weegschaal|Libra;
    Boogschutter|Sagittarius;
    Steenbok|Capricornus;
    Waterman|Aquarius;
    Vissen|Pisces;
    Ram|Aries;
    Cassiopeia;
    Andromeda;
    Pegasus;
    Zwaan|Cygnus;
    Arend|Aquila;
    Lier|Lyra;
    Draak|Draco;
    Perseus;
    Hercules;
    Walvis|Cetus;
    Grote Hond|Canis Major;
    Kleine Hond|Canis Minor;
    Voerman|Auriga;
    Jager|Orion;
    Noorderkroon|Corona Borealis;
    Zuiderkroon|Corona Australis;
    Zuiderkruis|Crux;
    Centaur|Centaurus;
    Eridanus;
    Hydra|Waterslang;
    Waterslangetje|Hydrus;
    Dolfijn|Delphinus;
    Pijl|Sagitta;
    Vosje|Vulpecula;
    Hagedis|Lacerta;
    Giraf|Camelopardalis;
    Lynx;
    Kleine Leeuw|Leo Minor;
    Jachthonden|Canes Venatici;
    Haar van Berenice|Coma Berenices;
    Beker|Crater;
    Raaf|Corvus;
    Sextant|Sextans;
    Schild|Scutum;
    Slang|Serpens;
    Slangendrager|Ophiuchus;
    Altaar|Ara;
    Wolf|Lupus;
    Winkelhaak|Norma;
    Passer|Circinus;
    Driehoek|Triangulum;
    Zuiderdriehoek|Triangulum Australe;
    Telescoop|Telescopium;
    Microscoop|Microscopium;
    Slingeruurwerk|Horologium;
    Oven|Fornax;
    Beeldhouwer|Sculptor;
    Schilder|Pictor;
    Goudvis|Dorado;
    Vliegende Vis|Volans;
    Vlieg|Musca;
    Kameleon|Chamaeleon;
    Paradijsvogel|Apus;
    Pauw|Pavo;
    Toekan|Tucana;
    Kraanvogel|Grus;
    Phoenix|Feniks;
    Indiaan|Indus;
    Zuidervis|Piscis Austrinus;
    Kompas|Pyxis;
    Achtersteven|Puppis;
    Kiel|Carina;
    Zeilen|Vela;
    Luchtpomp|Antlia;
    Net|Reticulum;
    Tafelberg|Mensa;
    Octant|Octans;
    Kleine Waterslang|Hydrus;
    Haas|Lepus;
    Eenhoorn|Monoceros;
    Duif|Columba
    `
  );


  /* ========================================
     3. WETENSCHAP
     SCHEIKUNDIGE ELEMENTEN
  ======================================== */

  addQuestion(
    "🔬 WETENSCHAP",

    "Noem een scheikundig element uit het periodiek systeem.",

    "Er bestaan 118 erkende elementen. Ook de Nederlandse namen van minder bekende elementen tellen mee.",

    `
    Zuurstof;
    Waterstof;
    Koolstof;
    IJzer;
    Goud;
    Zilver;
    Koper;
    Aluminium;
    Helium;
    Stikstof;
    Calcium;
    Natrium;
    Kalium;
    Magnesium;
    Chloor;
    Zwavel;
    Fosfor;
    Silicium;
    Zink;
    Lood;
    Tin;
    Nikkel;
    Kobalt;
    Chroom;
    Mangaan;
    Fluor;
    Jodium|Jood;
    Broom;
    Neon;
    Argon;
    Krypton;
    Xenon;
    Radon;
    Lithium;
    Beryllium;
    Boor;
    Scandium;
    Titanium;
    Vanadium;
    Gallium;
    Germanium;
    Arseen;
    Seleen;
    Rubidium;
    Strontium;
    Yttrium;
    Zirkonium;
    Niobium;
    Molybdeen;
    Technetium;
    Ruthenium;
    Rodium;
    Palladium;
    Cadmium;
    Indium;
    Antimoon;
    Telluur;
    Cesium|Caesium;
    Barium;
    Lanthaan;
    Cerium;
    Praseodymium;
    Neodymium;
    Promethium;
    Samarium;
    Europium;
    Gadolinium;
    Terbium;
    Dysprosium;
    Holmium;
    Erbium;
    Thulium;
    Ytterbium;
    Lutetium;
    Hafnium;
    Tantaal;
    Wolfraam;
    Renium;
    Osmium;
    Iridium;
    Platina;
    Kwik;
    Thallium;
    Bismut;
    Polonium;
    Astatium;
    Francium;
    Radium;
    Actinium;
    Thorium;
    Protactinium;
    Uranium;
    Neptunium;
    Plutonium;
    Americium;
    Curium;
    Berkelium;
    Californium;
    Einsteinium;
    Fermium;
    Mendelevium;
    Nobelium;
    Lawrencium;
    Rutherfordium;
    Dubnium;
    Seaborgium;
    Bohrium;
    Hassium;
    Meitnerium;
    Darmstadtium;
    Röntgenium;
    Copernicium;
    Nihonium;
    Flerovium;
    Moscovium;
    Livermorium;
    Tennessine;
    Oganesson
    `
  );


  /* ========================================
     4. DIEREN
     ZOOGDIEREN
  ======================================== */

  addQuestion(
    "🐾 DIEREN",

    "Noem een zoogdier.",

    "Van huisdieren tot wilde zoogdieren: een correcte diersoort telt mee.",

    `
    Hond;
    Kat;
    Paard;
    Koe|Rund;
    Schaap;
    Geit;
    Varken;
    Konijn;
    Haas;
    Muis;
    Rat;
    Eekhoorn;
    Egel;
    Mol;
    Vleermuis;
    Vos;
    Wolf;
    Beer;
    IJsbeer;
    Bruine beer;
    Panda|Reuzenpanda;
    Leeuw;
    Tijger;
    Luipaard;
    Jachtluipaard|Cheeta;
    Jaguar;
    Poema;
    Lynx;
    Olifant;
    Afrikaanse olifant;
    Aziatische olifant;
    Neushoorn;
    Nijlpaard;
    Giraffe;
    Zebra;
    Ezel;
    Kameel;
    Dromedaris;
    Lama;
    Alpaca;
    Hert;
    Edelhert;
    Ree;
    Eland;
    Rendier;
    Bizon;
    Wisent;
    Buffel;
    Antilope;
    Gazelle;
    Gnoe;
    Kangoeroe;
    Wallaby;
    Koala;
    Wombat;
    Luiaard;
    Miereneter;
    Gordeldier;
    Wasbeer;
    Stokstaartje;
    Mangoest;
    Otter;
    Bever;
    Das;
    Bunzing;
    Hermelijn;
    Wezel;
    Veelvraat;
    Tapir;
    Okapi;
    Capibara|Waterzwijn;
    Chinchilla;
    Cavia;
    Hamster;
    Fret;
    Zeehond;
    Walrus;
    Orka;
    Potvis;
    Narwal;
    Doejong;
    Manatee|Lamantijn;
    Vogelbekdier;
    Mierenegel;
    Tasmaanse duivel;
    Quokka;
    Fossa;
    Aardvarken;
    Schubdier|Pangolin
    `
  );


  /* ========================================
     5. ETEN
     GROENTES
  ======================================== */

  addQuestion(
    "🥕 ETEN",

    "Noem een groente die in de keuken wordt gebruikt.",

    "Het gaat om groenten in culinaire zin. Ook minder bekende groentesoorten tellen mee.",

    `
    Wortel;
    Broccoli;
    Bloemkool;
    Spinazie;
    Sla;
    IJsbergsla;
    Romaine sla|Romeinse sla;
    Rucola;
    Andijvie;
    Witlof;
    Boerenkool;
    Spruitjes;
    Rodekool;
    Wittekool;
    Groenekool;
    Savooiekool;
    Chinese kool;
    Paksoi;
    Spitskool;
    Knolselderij;
    Bleekselderij;
    Koolraap;
    Knolraap;
    Raapsteel;
    Radijs;
    Rettich;
    Rode biet;
    Snijbiet;
    Prei;
    Ui;
    Rode ui;
    Sjalot;
    Knoflook;
    Bosui;
    Lente-ui;
    Asperge;
    Groene asperge;
    Witte asperge;
    Artisjok;
    Aubergine;
    Courgette;
    Komkommer;
    Paprika;
    Tomaat;
    Pompoen;
    Flespompoen;
    Butternutpompoen|Butternut squash;
    Maïs;
    Doperwt;
    Sugar snap;
    Peultje;
    Sperzieboon;
    Snijboon;
    Tuinboon;
    Edamame;
    Okra;
    Venkel;
    Pastinaak;
    Schorseneer;
    Aardpeer;
    Rammenas;
    Waterkers;
    Postelein;
    Zeekraal;
    Lamsoor;
    Kardoen;
    Cime di rapa;
    Komatsuna;
    Mizuna;
    Tatsoi
    `
  );


  /* ========================================
     6. ETEN
     KAASSOORTEN
  ======================================== */

  addQuestion(
    "🧀 ETEN",

    "Noem een kaassoort.",

    "Denk aan kazen uit Nederland, Frankrijk, Italië en andere landen.",

    `
    Gouda|Goudse kaas;
    Edam|Edammer;
    Cheddar;
    Mozzarella;
    Parmezaan|Parmigiano Reggiano;
    Brie;
    Camembert;
    Feta;
    Gorgonzola;
    Roquefort;
    Emmentaler|Emmental;
    Gruyère|Gruyere;
    Manchego;
    Ricotta;
    Mascarpone;
    Pecorino Romano;
    Provolone;
    Burrata;
    Halloumi;
    Paneer;
    Stilton;
    Cheshire;
    Wensleydale;
    Red Leicester;
    Colby;
    Monterey Jack;
    Pepper Jack;
    Havarti;
    Jarlsberg;
    Raclette;
    Appenzeller;
    Tilsiter;
    Maasdammer;
    Leerdammer;
    Boerenkaas;
    Leidse kaas;
    Friese nagelkaas;
    Comté|Comte;
    Reblochon;
    Munster;
    Époisses|Epoisses;
    Morbier;
    Beaufort;
    Cantal;
    Saint-Nectaire;
    Fourme d'Ambert;
    Bleu d'Auvergne;
    Valençay|Valencay;
    Crottin de Chavignol;
    Sainte-Maure de Touraine;
    Ossau-Iraty;
    Tomme de Savoie;
    Taleggio;
    Fontina;
    Asiago;
    Montasio;
    Scamorza;
    Caciocavallo;
    Grana Padano;
    Fiore Sardo;
    Castelmagno;
    Cabrales;
    Idiazabal;
    Mahón|Mahon;
    Tête de Moine|Tete de Moine
    `
  );


  /* ========================================
     7. WERELD
     TALEN
  ======================================== */

  addQuestion(
    "🗣️ WERELD",

    "Noem een bestaande menselijke taal.",

    "Zowel grote wereldtalen als regionale talen tellen mee.",

    `
    Nederlands;
    Engels;
    Duits;
    Frans;
    Spaans;
    Italiaans;
    Portugees;
    Chinees|Mandarijn;
    Japans;
    Koreaans;
    Arabisch;
    Russisch;
    Hindi;
    Turks;
    Grieks;
    Pools;
    Zweeds;
    Noors;
    Deens;
    Fins;
    IJslands;
    Oekraïens;
    Tsjechisch;
    Slowaaks;
    Hongaars;
    Roemeens;
    Bulgaars;
    Servisch;
    Kroatisch;
    Sloveens;
    Bosnisch;
    Albanees;
    Macedonisch;
    Litouws;
    Lets;
    Ests;
    Iers;
    Welsh;
    Schots-Gaelisch;
    Bretons;
    Baskisch;
    Catalaans;
    Galicisch;
    Fries;
    Limburgs;
    Afrikaans;
    Swahili;
    Zoeloe;
    Xhosa;
    Amhaars;
    Somalisch;
    Hausa;
    Yoruba;
    Igbo;
    Wolof;
    Berbers|Tamazight;
    Perzisch|Farsi;
    Koerdisch;
    Hebreeuws;
    Armeens;
    Georgisch;
    Azerbeidzjaans;
    Kazachs;
    Oezbeeks;
    Mongools;
    Nepalees;
    Bengaals;
    Punjabi;
    Urdu;
    Tamil;
    Telugu;
    Kannada;
    Malayalam;
    Marathi;
    Gujarati;
    Sinhala;
    Thai;
    Vietnamees;
    Khmer;
    Lao;
    Birmaans;
    Indonesisch;
    Maleis;
    Tagalog;
    Cebuano;
    Javaans;
    Soendanees;
    Maori;
    Samoaans;
    Tongaans;
    Hawaïaans;
    Quechua;
    Aymara;
    Guarani;
    Nahuatl;
    Inuktitut
    `
  );


  /* ========================================
     8. SPORT
     EUROPESE VOETBALCLUBS
  ======================================== */

  addQuestion(
    "⚽ SPORT",

    "Noem een voetbalclub uit Europa.",

    "Een bestaande club uit een Europees land telt mee. Ook clubs buiten de grootste competities.",

    `
    Ajax;
    PSV;
    Feyenoord;
    AZ;
    FC Utrecht;
    FC Twente;
    FC Groningen;
    sc Heerenveen;
    NEC;
    Sparta Rotterdam;
    Go Ahead Eagles;
    Willem II;
    NAC Breda;
    Vitesse;
    FC Volendam;
    Heracles Almelo;
    PEC Zwolle;
    Fortuna Sittard;
    Roda JC;
    FC Den Bosch;
    Real Madrid;
    FC Barcelona;
    Atlético Madrid;
    Sevilla FC;
    Valencia CF;
    Villarreal CF;
    Real Betis;
    Athletic Club;
    Real Sociedad;
    Manchester United;
    Manchester City;
    Liverpool;
    Arsenal;
    Chelsea;
    Tottenham Hotspur;
    Newcastle United;
    Aston Villa;
    Everton;
    West Ham United;
    Leicester City;
    Bayern München;
    Borussia Dortmund;
    Bayer Leverkusen;
    RB Leipzig;
    Schalke 04;
    Werder Bremen;
    VfB Stuttgart;
    Eintracht Frankfurt;
    Borussia Mönchengladbach;
    Hamburger SV;
    Juventus;
    AC Milan;
    Inter Milan|Internazionale;
    Napoli;
    AS Roma;
    Lazio;
    Atalanta;
    Fiorentina;
    Bologna;
    Torino;
    Paris Saint-Germain|PSG;
    Olympique Marseille;
    Olympique Lyon;
    AS Monaco;
    Lille OSC;
    Celtic;
    Rangers;
    Aberdeen;
    Benfica;
    FC Porto;
    Sporting CP;
    SC Braga;
    Galatasaray;
    Fenerbahçe;
    Beşiktaş|Besiktas;
    Trabzonspor;
    Club Brugge;
    Anderlecht;
    KRC Genk;
    Royal Antwerp;
    Union Saint-Gilloise;
    Dinamo Zagreb;
    Hajduk Split;
    Rode Ster Belgrado;
    Partizan Belgrado;
    Olympiakos;
    Panathinaikos;
    PAOK;
    Shakhtar Donetsk;
    Dynamo Kyiv;
    Sparta Praag;
    Slavia Praag;
    Viktoria Plzeň;
    Ferencváros;
    Legia Warschau;
    Lech Poznań;
    FC Kopenhagen;
    Brøndby IF;
    Malmö FF;
    IFK Göteborg;
    Rosenborg BK;
    Molde FK;
    HJK Helsinki
    `
  );


  /* ========================================
     9. GESCHIEDENIS
     HISTORISCHE VROUWEN
  ======================================== */

  addQuestion(
    "🏛️ GESCHIEDENIS",

    "Noem een bekende vrouw uit de geschiedenis die vóór 1900 is geboren.",

    "Denk aan kunstenaars, wetenschappers, vorstinnen, schrijvers en andere historische personen.",

    `
    Cleopatra;
    Marie Curie;
    Anne Frank;
    Jeanne d'Arc;
    Koningin Victoria;
    Koningin Wilhelmina;
    Florence Nightingale;
    Ada Lovelace;
    Rosa Luxemburg;
    Harriet Tubman;
    Marie Antoinette;
    Catharina de Grote;
    Elisabeth I van Engeland;
    Maria Stuart;
    Hatshepsut;
    Nefertiti;
    Boudica;
    Sappho;
    Hypatia;
    Hildegard van Bingen;
    Eleonora van Aquitanië;
    Isabella van Castilië;
    Maria Theresia;
    Christina van Zweden;
    Elizabeth Blackwell;
    Susan B. Anthony;
    Emmeline Pankhurst;
    Mary Wollstonecraft;
    Mary Shelley;
    Jane Austen;
    Charlotte Brontë;
    Emily Brontë;
    Anne Brontë;
    George Eliot;
    Virginia Woolf;
    Agatha Christie;
    Edith Wharton;
    Louisa May Alcott;
    Emily Dickinson;
    Sylvia Pankhurst;
    Aletta Jacobs;
    Anna Maria van Schurman;
    Etty Hillesum;
    Mata Hari;
    Frida Kahlo;
    Georgia O'Keeffe;
    Artemisia Gentileschi;
    Judith Leyster;
    Berthe Morisot;
    Mary Cassatt;
    Camille Claudel;
    Clara Schumann;
    Fanny Mendelssohn;
    Émilie du Châtelet;
    Caroline Herschel;
    Henrietta Swan Leavitt;
    Lise Meitner;
    Emmy Noether;
    Sophie Germain;
    Mary Anning;
    Rachel Carson;
    Hedy Lamarr;
    Sojourner Truth;
    Ida B. Wells;
    Nellie Bly;
    Amelia Earhart;
    Bessie Coleman;
    Sacagawea;
    Pocahontas;
    Rani Lakshmibai;
    Murasaki Shikibu;
    Sei Shōnagon;
    Wu Zetian;
    Cixi;
    Noor Inayat Khan;
    Josephine Baker;
    Sarah Bernhardt;
    Isadora Duncan
    `
  );


  /* ========================================
     10. AARDRIJKSKUNDE
     GRIEKSE EILANDEN
  ======================================== */

  addQuestion(
    "🏝️ AARDRIJKSKUNDE",

    "Noem een Grieks eiland.",

    "Grote én kleine eilanden van Griekenland tellen mee.",

    `
    Kreta;
    Rhodos;
    Kos;
    Corfu|Korfoe|Kerkyra;
    Zakynthos;
    Santorini|Thira;
    Mykonos;
    Lesbos|Lesvos;
    Samos;
    Chios;
    Naxos;
    Paros;
    Milos;
    Kefalonia;
    Lefkada;
    Ithaka|Ithaca;
    Skiathos;
    Skopelos;
    Alonissos;
    Euboea|Evia;
    Thasos;
    Samothraki;
    Limnos|Lemnos;
    Ikaria;
    Patmos;
    Kalymnos;
    Leros;
    Symi;
    Tilos;
    Nisyros;
    Karpathos;
    Kasos;
    Astypalaia;
    Amorgos;
    Folegandros;
    Sikinos;
    Ios;
    Serifos;
    Sifnos;
    Kythnos;
    Kea;
    Andros;
    Tinos;
    Syros;
    Delos;
    Antiparos;
    Koufonisia;
    Schinoussa;
    Iraklia;
    Donoussa;
    Anafi;
    Kimolos;
    Polyaigos;
    Antikythera;
    Kythira;
    Paxos;
    Antipaxos;
    Meganisi;
    Kalamos;
    Kastos;
    Othonoi;
    Erikousa;
    Mathraki;
    Hydra;
    Spetses;
    Poros;
    Aegina|Egina;
    Agistri;
    Salamina;
    Skyros;
    Psara;
    Oinousses;
    Fournoi;
    Lipsi;
    Arki;
    Agathonisi;
    Telendos;
    Pserimos;
    Halki;
    Kastellorizo|Megisti
    `
  );


  /* ========================================
     11. MUZIEK
     MUZIEKGENRES
  ======================================== */

  addQuestion(
    "🎵 MUZIEK",

    "Noem een muziekgenre of een herkenbaar subgenre.",

    "Van pop tot nichegenres: bestaande muziekstijlen tellen mee.",

    `
    Pop;
    Rock;
    Hip-hop|Hiphop;
    Rap;
    Jazz;
    Blues;
    Klassieke muziek;
    Country;
    Reggae;
    Soul;
    Funk;
    Disco;
    House;
    Techno;
    Trance;
    Dubstep;
    Drum and bass;
    Hardstyle;
    Hardcore;
    Metal;
    Heavy metal;
    Punkrock;
    Indie rock;
    Alternatieve rock;
    Grunge;
    Britpop;
    Shoegaze;
    Postrock;
    Progressieve rock;
    Psychedelische rock;
    Glamrock;
    Rockabilly;
    Ska;
    Folk;
    Bluegrass;
    Gospel;
    R&B;
    Neo-soul;
    Motown;
    Afrobeat;
    Afrobeats;
    Amapiano;
    Dancehall;
    Reggaeton;
    Salsa;
    Merengue;
    Bachata;
    Cumbia;
    Tango;
    Bossa nova;
    Samba;
    Fado;
    Flamenco;
    K-pop;
    J-pop;
    City pop;
    Synthpop;
    Electropop;
    Dream pop;
    Hyperpop;
    Vaporwave;
    Synthwave;
    Ambient;
    Downtempo;
    Triphop;
    Breakbeat;
    UK garage;
    Jungle;
    Liquid funk;
    Psytrance;
    Goa trance;
    Minimal techno;
    Acid house;
    Deep house;
    Progressive house;
    Electro swing;
    Chiptune;
    Noise rock;
    Mathrock;
    Postpunk;
    New wave;
    Darkwave;
    Black metal;
    Death metal;
    Doom metal;
    Power metal;
    Symfonische metal;
    Folkmetal;
    Nu metal;
    Sludge metal;
    Grindcore;
    Bluegrass gospel;
    Zydeco;
    Cajun;
    Highlife;
    Rai;
    Gnawa;
    Taarab;
    Gqom
    `
  );


  /* ========================================
     12. NATUUR
     BOMEN
  ======================================== */

  addQuestion(
    "🌳 NATUUR",

    "Noem een boomsoort.",

    "Bomen van over de hele wereld tellen mee.",

    `
    Eik;
    Zomereik;
    Wintereik;
    Beuk;
    Haagbeuk;
    Berk;
    Ruwe berk;
    Zachte berk;
    Es;
    Esdoorn;
    Gewone esdoorn;
    Noorse esdoorn;
    Veldesdoorn;
    Linde;
    Zomerlinde;
    Winterlinde;
    Iep|Olm;
    Gladde iep;
    Ruwe iep;
    Wilg;
    Treurwilg;
    Schietwilg;
    Knotwilg;
    Populier;
    Zwarte populier;
    Ratelpopulier;
    Abeel;
    Els;
    Zwarte els;
    Grauwe els;
    Kastanje;
    Tamme kastanje;
    Paardenkastanje;
    Walnoot;
    Hazelaar;
    Plataan;
    Gewone plataan;
    Amerikaanse plataan;
    Acacia;
    Robinia;
    Ginkgo;
    Magnolia;
    Tulpenboom;
    Sequoia;
    Kustmammoetboom;
    Reuzenmammoetboom;
    Spar;
    Fijnspar;
    Blauwe spar;
    Zilverspar;
    Douglasspar;
    Den;
    Grove den;
    Zeeden;
    Parasolden;
    Lariks;
    Europese lariks;
    Ceder;
    Libanonceder;
    Atlasceder;
    Himalayaceder;
    Cipres;
    Italiaanse cipres;
    Moerascipres;
    Taxus;
    Jeneverbes;
    Thuja;
    Hulst;
    Laurierboom;
    Olijfboom;
    Vijgenboom;
    Appelboom;
    Perenboom;
    Kersenboom;
    Pruimenboom;
    Abrikozenboom;
    Perzikboom;
    Amandelboom;
    Citroenboom;
    Sinaasappelboom;
    Grapefruitboom;
    Mangoboom;
    Avocadoboom;
    Kokospalm;
    Dadelpalm;
    Baobab;
    Kapokboom;
    Rubberboom;
    Broodboom;
    Banyan
    `
  );


  /* ========================================
     13. WERELD
     JAPANSE STEDEN
  ======================================== */

  addQuestion(
    "🏙️ WERELD",

    "Noem een stad in Japan.",

    "Zowel grote als minder bekende Japanse steden tellen mee.",

    `
    Tokio|Tokyo;
    Osaka;
    Kyoto|Kioto;
    Yokohama;
    Nagoya;
    Sapporo;
    Kobe;
    Fukuoka;
    Hiroshima;
    Nagasaki;
    Nara;
    Sendai;
    Kawasaki;
    Saitama;
    Chiba;
    Kitakyushu;
    Sakai;
    Niigata;
    Hamamatsu;
    Shizuoka;
    Okayama;
    Kumamoto;
    Kagoshima;
    Kanazawa;
    Utsunomiya;
    Matsuyama;
    Oita;
    Nagano;
    Toyama;
    Fukui;
    Gifu;
    Tsu;
    Wakayama;
    Tottori;
    Matsue;
    Tokushima;
    Takamatsu;
    Kochi;
    Saga;
    Miyazaki;
    Naha;
    Akita;
    Morioka;
    Aomori;
    Yamagata;
    Fukushima;
    Mito;
    Maebashi;
    Kofu;
    Otsu;
    Himeji;
    Kurashiki;
    Fukuyama;
    Kure;
    Iwakuni;
    Shimonoseki;
    Ube;
    Onomichi;
    Imabari;
    Beppu;
    Yufuin;
    Hakodate;
    Otaru;
    Asahikawa;
    Obihiro;
    Kushiro;
    Tomakomai;
    Wakkanai;
    Abashiri;
    Kitami;
    Muroran;
    Iwamizawa;
    Chitose;
    Furano;
    Noboribetsu;
    Yubari
    `
  );


  /* ========================================
     CONTROLE NA HET LADEN
  ======================================== */

  console.log(
    "🎈 QuizBallon: extra vragenbank geladen."
  );

  console.log(
    "Totaal aantal actieve vragen:",
    questions.length
  );

})();
