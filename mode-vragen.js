/* ============================================================
   QUIZBALLON - 50 MODEVRAGEN V1

   50 verschillende vragen over:
   - Kleding
   - Schoenen
   - Accessoires
   - Stoffen
   - Modegeschiedenis
   - Ontwerpen en naaien
   - Modestijlen
   - Kledingverzorging

   IEDERE VRAAG HEEFT:
   - Een eigen topicId
   - De categorie "Mode"
   - Meerdere geldige antwoorden

   WERKT MET:
   window.QUIZBALLON_EXPANDED_QUESTIONS

   BELANGRIJK:
   Laad dit bestand NADAT de basisvragen
   zijn geladen, maar VOORDAT daily.js
   de tien dagvragen selecteert.
============================================================ */

(function () {
  "use strict";

  /* ========================================
     ANTWOORDEN MAKEN
  ======================================== */

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['’`]/g, "")
      .replace(/[-_]/g, " ")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hash(text) {
    let value = 2166136261;

    for (let i = 0; i < text.length; i++) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }

    return value >>> 0;
  }

  function makeAnswers(text) {
    const seen = new Set();

    return text
      .split("|")
      .map(answer => answer.trim())
      .filter(Boolean)
      .filter(answer => {
        const key = normalize(answer);

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .map(answer => ({
        answer: answer,

        /*
         * Voorlopige spelpunten.
         * Dit zijn geen gemeten
         * zeldzaamheidsscores.
         */

        points: 10 + (
          hash(answer) % 70
        ),

        aliases: []
      }));
  }

  /* ========================================
     DE 50 MODEVRAGEN
  ======================================== */

  const questionData = [

    /* ======================================
       1. KLEDINGSTUKKEN
    ====================================== */

    {
      topicId: "mode-kledingstukken",

      question:
        "Noem een kledingstuk dat je kunt dragen.",

      answers: `
        shirt|T-shirt|broek|spijkerbroek|trui|
        vest|jas|jurk|rok|blouse|overhemd|
        hoodie|sweater|poloshirt|top|
        tanktop|hemd|coltrui|cardigan|
        blazer|kostuum|pak|overall|
        jumpsuit|short|bermuda|legging|
        joggingbroek|trainingspak|
        winterjas|regenjas|mantel|
        bodywarmer|kimono|tuniek|
        gilet|poncho|cape|badjas|
        pyjama|nachtjapon|badpak|
        bikini|zwembroek|sportshirt|
        sportbroek|onderbroek|boxershort|
        sok|maillot|panty|kous|
        colbert|spencer|salopette|
        tuinbroek|fleecevest
      `
    },

    /* ======================================
       2. SOORTEN BROEKEN
    ====================================== */

    {
      topicId: "mode-broeksoorten",

      question:
        "Noem een soort broek.",

      answers: `
        spijkerbroek|jeans|skinny jeans|
        straight jeans|wide leg jeans|
        mom jeans|boyfriend jeans|
        bootcut jeans|flared jeans|
        cargobroek|chino|joggingbroek|
        trainingsbroek|pantalon|
        ribbroek|corduroy broek|
        linnen broek|leren broek|
        leggings|legging|capribroek|
        bermuda|short|fietsbroek|
        skibroek|regenbroek|werkbroek|
        tuinbroek|salopette|
        harembroek|palazzo broek|
        culotte|afritsbroek|
        wandelbroek|jodhpur|
        baggy jeans|slim fit broek|
        tapered broek|stretchbroek|
        thermobroek|pyjamabroek
      `
    },

    /* ======================================
       3. SOORTEN JASSEN
    ====================================== */

    {
      topicId: "mode-jassoorten",

      question:
        "Noem een soort jas.",

      answers: `
        winterjas|regenjas|spijkerjas|
        leren jas|bomberjack|blazer|
        trenchcoat|parka|duffelcoat|
        pufferjas|donsjas|fleecejas|
        softshelljas|hardshelljas|
        windjack|ski-jas|anorak|
        mantel|overjas|caban|
        peacoat|bikerjack|motorjas|
        baseballjack|varsity jacket|
        bodywarmer|gewatteerde jas|
        teddyjas|sherpajas|cape|
        poncho|colbert|smokingjasje|
        denimjack|field jacket|
        safari-jack|regenponcho|
        gewatteerd jack|wollen jas|
        quilted jacket
      `
    },

    /* ======================================
       4. SOORTEN ROKKEN
    ====================================== */

    {
      topicId: "mode-roksoorten",

      question:
        "Noem een soort rok.",

      answers: `
        minirok|midirok|maxirok|
        kokerrok|plooirok|plissérok|
        A-lijnrok|cirkelrok|wikkelrok|
        spijkerrok|leren rok|tulerok|
        tennisrok|ballonrok|klokrok|
        skaterrok|pareorok|
        cargorok|ribrok|satijnen rok|
        asymmetrische rok|
        tulemaxirok|faltenrok|
        gebreide rok|geruite rok|
        wollen rok|linnen rok|
        overslagrok|trapezerok|
        volantenrok|rimpelrok
      `
    },

    /* ======================================
       5. SOORTEN JURKEN
    ====================================== */

    {
      topicId: "mode-jurksoorten",

      question:
        "Noem een soort jurk.",

      answers: `
        avondjurk|zomerjurk|winterjurk|
        trouwjurk|cocktailjurk|
        maxi-jurk|mini-jurk|midi-jurk|
        wikkeljurk|A-lijnjurk|
        overhemdjurk|blousejurk|
        sweaterjurk|trui-jurk|
        baljurk|galajurk|tuniekjurk|
        slipdress|babydolljurk|
        empirejurk|halterjurk|
        strapless jurk|jurk met mouwen|
        zomeravondjurk|satijnen jurk|
        gebreide jurk|kokerjurk|
        schortjurk|denimjurk|
        plisséjurk|kaftanjurk
      `
    },

    /* ======================================
       6. SHIRTS EN TOPS
    ====================================== */

    {
      topicId: "mode-shirts-tops",

      question:
        "Noem een soort shirt of top.",

      answers: `
        T-shirt|poloshirt|tanktop|
        crop top|haltertop|spaghettitop|
        longsleeve|sporttop|hemd|
        blouse|overhemd|tuniek|
        camisole|singlet|body|
        wikkelblouse|peplumtop|
        bandeautop|off-shouldertop|
        schouderloze top|
        colshirt|mesh top|
        kanten top|flanellen overhemd|
        denimoverhemd|linnen blouse|
        mouwloze blouse|pofmouwblouse|
        baseballshirt|rugbyshirt|
        voetbalshirt|thermoshirt
      `
    },

    /* ======================================
       7. TRUIEN EN VESTEN
    ====================================== */

    {
      topicId: "mode-truien-vesten",

      question:
        "Noem een soort trui of vest.",

      answers: `
        hoodie|sweater|coltrui|
        kabeltrui|fleecevest|
        cardigan|spencer|pullover|
        kasjmiertrui|wollen trui|
        gebreid vest|ritsvest|
        oversized trui|croptrui|
        V-halstrui|rondehalstrui|
        schipperstrui|sweatvest|
        alpaca trui|merinotrui|
        jacquardtrui|kersttrui|
        sporttrui|thermotrui|
        open vest|lang vest|
        mouwloos vest|button-up vest|
        ribtrui|overslagvest
      `
    },

    /* ======================================
       8. SCHOENEN
    ====================================== */

    {
      topicId: "mode-schoensoorten",

      question:
        "Noem een soort schoen.",

      answers: `
        sneaker|gymp|sportschoen|
        hardloopschoen|wandelschoen|
        nette schoen|veterschoen|
        instapper|loafer|mocassin|
        ballerina|pumps|hakken|
        stiletto|sleehak|plateauschoen|
        sandaal|slipper|espadrille|
        bootschoen|klomp|pantoffel|
        muiltje|derby|oxford|
        brogue|monkstrap|
        chelsea boot|enkellaars|
        cowboylaars|regenlaars|
        snowboot|slip-on|tennisschoen|
        basketbalschoen|voetbalschoen|
        fietsschoen|skateschoen|
        waterschoen|bergschoen
      `
    },

    /* ======================================
       9. LAARZEN
    ====================================== */

    {
      topicId: "mode-laarssoorten",

      question:
        "Noem een soort laars.",

      answers: `
        regenlaars|winterlaars|
        cowboylaars|enkellaars|
        knielaars|overknee laars|
        chelsea boot|bikerboot|
        veterlaars|snowboot|
        rijlaars|rubberlaars|
        werklaars|veiligheidslaars|
        wandellaars|berglaars|
        motorlaars|combat boot|
        platformlaars|leren laars|
        suède laars|waterdichte laars|
        hoge laars|lage laars|
        laars met hak|laars met rits|
        kuitlaars|rubberen laars|
        après-skilaars|rubberboot
      `
    },

    /* ======================================
       10. SPORTIEVE SCHOENEN
    ====================================== */

    {
      topicId: "mode-sportschoenen",

      question:
        "Noem een schoen die voor een sport wordt gebruikt.",

      answers: `
        hardloopschoen|voetbalschoen|
        tennisschoen|basketbalschoen|
        golfschoen|hockeyschoen|
        fietsschoen|bergschoen|
        wandelschoen|klimschoen|
        balletschoen|dansschoen|
        bowlingschoen|worstelschoen|
        boksschoen|atletiekschoen|
        spikes|rugbylaars|
        zaalsportschoen|
        volleybalschoen|
        handbalschoen|squashschoen|
        badmintonschoen|
        skateschoen|waterschoen|
        zeilschoen|trailschoen|
        gewichthefschoen|
        fitnessschoen|turnschoen
      `
    },

    /* ======================================
       11. HOOFDDEKSELS
    ====================================== */

    {
      topicId: "mode-hoofddeksels",

      question:
        "Noem een soort hoofddeksel.",

      answers: `
        pet|baseballpet|muts|beanie|
        hoed|zonnehoed|strohoed|
        cowboyhoed|bolhoed|
        hoge hoed|fedora|panamahoed|
        vissershoed|bucket hat|
        baret|barethoed|flatcap|
        schipperspet|snapback|
        truckerpet|vizier|zonneklep|
        tulband|hoofddoek|hijab|
        bandana|balaclava|
        bivakmuts|oorwarmer|
        koksmuts|schapenvachtmuts|
        cowboypet|clochehoed|
        trilby|sombrero|helmhoed
      `
    },

    /* ======================================
       12. TASSEN
    ====================================== */

    {
      topicId: "mode-tassen",

      question:
        "Noem een soort tas.",

      answers: `
        rugzak|handtas|schoudertas|
        heuptas|belt bag|crossbodytas|
        clutch|shopper|tote bag|
        weekendtas|reistas|
        strandtas|sporttas|
        laptoptas|schooltas|
        aktetas|boodschappentas|
        toilettas|make-uptas|
        etui|buideltas|bucket bag|
        messenger bag|satchel|
        zadeltas|duffeltas|
        gymtas|rolkoffer|
        portemonnee|camera tas|
        telefoonhoes met koord
      `
    },

    /* ======================================
       13. SIERADEN
    ====================================== */

    {
      topicId: "mode-sieraden",

      question:
        "Noem een soort sieraad.",

      answers: `
        ring|ketting|armband|
        oorbel|oorring|oorsteker|
        hanger|bedel|broche|
        enkelbandje|teenring|
        zegelring|verlovingsring|
        trouwring|parelketting|
        kralenketting|choker|
        schakelarmband|bedelarmband|
        manchetarmband|neuspiercing|
        navelpiercing|diadeem|
        haarspeld met steen|
        tiara|medaillon|collier|
        kralenarmband|pareloorbel|
        juwelenhanger
      `
    },

    /* ======================================
       14. MODEACCESSOIRES
    ====================================== */

    {
      topicId: "mode-accessoires",

      question:
        "Noem een accessoire dat bij een outfit past.",

      answers: `
        riem|sjaal|handschoenen|
        hoed|pet|muts|zonnebril|
        bril|horloge|tas|handtas|
        rugzak|ketting|armband|
        oorbellen|ring|broche|
        stropdas|vlinderdas|
        pochet|haarband|diadeem|
        haarclip|haarspeld|
        manchetknopen|bretels|
        bandana|hoofddoek|
        beenwarmers|paraplu|
        waaiertje|sleutelhanger|
        portemonnee|kraagspeld
      `
    },

    /* ======================================
       15. BRILLENMONTUREN
    ====================================== */

    {
      topicId: "mode-brillen",

      question:
        "Noem een model of vorm van een brillenmontuur.",

      answers: `
        rond montuur|ovaal montuur|
        vierkant montuur|
        rechthoekig montuur|
        cat-eye montuur|pilotenmontuur|
        aviator|wayfarer|
        vlindermontuur|
        zeshoekig montuur|
        achthoekig montuur|
        half montuur|randloos montuur|
        metalen montuur|
        kunststof montuur|
        acetaat montuur|
        browline|clubmaster|
        oversized montuur|
        smal montuur|
        transparant montuur|
        sportmontuur|
        retro montuur|
        schildpadmotief montuur
      `
    },

    /* ======================================
       16. HAARACCESSOIRES
    ====================================== */

    {
      topicId: "mode-haaraccessoires",

      question:
        "Noem iets waarmee je je haar kunt versieren of vastmaken.",

      answers: `
        haarelastiek|scrunchie|
        haarclip|haarspeld|
        haarband|diadeem|
        haarlint|strik|haarstrik|
        bananenklem|haarklem|
        schuifspeld|bobby pin|
        haarstok|haarvork|
        haarpin|haarketting|
        bloemenkrans|haarbloem|
        haarparel|haarjuweel|
        bandana|hoofddoek|
        tulband|vlechtelastiek|
        haarspiraal|haarbeugel|
        haarmagneet
      `
    },

    /* ======================================
       17. RIEMEN
    ====================================== */

    {
      topicId: "mode-riemen",

      question:
        "Noem een soort riem.",

      answers: `
        leren riem|stoffen riem|
        gevlochten riem|
        elastische riem|
        kettingriem|tailleriem|
        heupriem|smalle riem|
        brede riem|gespriem|
        knoopriem|veteriem|
        westernriem|
        dubbele riem|
        canvasriem|suèderiem|
        gevlochten leren riem|
        statementriem|
        metalen riem|
        ceintuur|sjerp|
        kimonoceintuur|
        geweven riem|
        bretelriem
      `
    },

    /* ======================================
       18. HANDSCHOENEN
    ====================================== */

    {
      topicId: "mode-handschoenen",

      question:
        "Noem een soort handschoen.",

      answers: `
        leren handschoen|
        wollen handschoen|
        gebreide handschoen|
        skihandschoen|
        fietshandschoen|
        motorhandschoen|
        werkhandschoen|
        tuinhandschoen|
        bokshandschoen|
        ovenhandschoen|
        vingerloze handschoen|
        want|duimwant|
        touchscreenhandschoen|
        regenbestendige handschoen|
        fleecehandschoen|
        thermohandschoen|
        kanten handschoen|
        avondhandschoen|
        lange handschoen|
        korte handschoen|
        neopreenhandschoen|
        hardloophandschoen
      `
    },

    /* ======================================
       19. SJAALS
    ====================================== */

    {
      topicId: "mode-sjaals",

      question:
        "Noem een soort sjaal of omslagdoek.",

      answers: `
        wollen sjaal|gebreide sjaal|
        zijden sjaal|katoenen sjaal|
        linnen sjaal|fleece sjaal|
        colsjaal|loopsjaal|
        wintersjaal|zomersjaal|
        pashmina|kasjmier sjaal|
        omslagdoek|stola|shawl|
        driehoekssjaal|
        bandana|nekwarmer|
        buff|sportsjaal|
        supporterssjaal|
        satijnen sjaal|
        gehaakte sjaal|
        geruite sjaal|
        lange sjaal|korte sjaal
      `
    },

    /* ======================================
       20. STOFFEN
    ====================================== */

    {
      topicId: "mode-stoffen",

      question:
        "Noem een stof die voor kleding wordt gebruikt.",

      answers: `
        katoen|linnen|wol|zijde|
        satijn|fluweel|denim|
        polyester|nylon|viscose|
        modal|lyocell|tencel|
        fleece|jersey|tweed|
        corduroy|ribfluweel|
        chiffon|organza|tule|
        kant|flanel|poplin|
        canvas|gabardine|crepe|
        crêpe|neopreen|velours|
        tricot|jacquard|damast|
        mousseline|kasjmier|
        alpaca|bouclé|bamboestof|
        suède|leer|kunstleer
      `
    },

    /* ======================================
       21. NATUURLIJKE TEXTIELVEZELS
    ====================================== */

    {
      topicId: "mode-natuurlijke-vezels",

      question:
        "Noem een natuurlijke textielvezel.",

      answers: `
        katoen|wol|zijde|linnen|
        hennep|jute|ramie|
        kapok|kasjmier|mohair|
        alpaca|angora|merinowol|
        yakwol|kameelhaar|
        lamswol|schapewol|
        zijde van zijderups|
        qiviut|muskusoswol|
        vicuñawol|pashmina|
        sisal|abaca|kokosvezel|
        brandnetelvezel|
        bananenvezel|lotusvezel|
        raffia|paardenhaar
      `
    },

    /* ======================================
       22. KUNSTMATIGE TEXTIELVEZELS
    ====================================== */

    {
      topicId: "mode-kunstmatige-vezels",

      question:
        "Noem een kunstmatige of synthetische textielvezel.",

      answers: `
        polyester|polyamide|nylon|
        acryl|elastaan|spandex|
        lycra|polypropyleen|
        polyethyleen|aramide|
        kevlar|nomex|viscose|
        rayon|modal|lyocell|
        cupro|acetaat|
        triacetaat|tencel|
        elastomultiester|
        polyurethaanvezel|
        microvezel|
        gerecycled polyester|
        gerecycled nylon|
        polyvinylchloridevezel
      `
    },

    /* ======================================
       23. PATRONEN EN PRINTS
    ====================================== */

    {
      topicId: "mode-kledingprints",

      question:
        "Noem een patroon of print op kleding.",

      answers: `
        strepen|stippen|polkadots|
        ruiten|tartan|ruitjes|
        bloemenprint|dierenprint|
        luipaardprint|zebraprint|
        slangenprint|tijgerprint|
        camouflage|paisley|
        tie-dye|batik|hondenprint|
        kattenprint|sterrenprint|
        hartjesprint|geometrische print|
        abstracte print|marmerprint|
        grafische print|letterprint|
        logoprint|ruitpatroon|
        chevron|zigzag|
        visgraat|houndstooth|
        pied-de-poule|argyle|
        camouflageprint|fruitprint|
        tropische print|bladprint
      `
    },

    /* ======================================
       24. TEXTIELTECHNIEKEN
    ====================================== */

    {
      topicId: "mode-textieltechnieken",

      question:
        "Noem een techniek om textiel te maken of te versieren.",

      answers: `
        weven|breien|haken|
        borduren|vilten|knopen|
        macramé|tuften|quilten|
        appliqueren|patchwork|
        zeefdrukken|sublimatiedruk|
        transferdruk|blockprint|
        batikken|tie-dye|
        plisseren|smocken|
        kralen borduren|
        handweven|machinebreien|
        kantklossen|naaien|
        doorstikken|rimpelen|
        fronsen|punchen|
        verven|textieldrukken
      `
    },

    /* ======================================
       25. KLEDINGSLUITINGEN
    ====================================== */

    {
      topicId: "mode-kledingsluitingen",

      question:
        "Noem een manier om kleding te sluiten.",

      answers: `
        knoop|rits|drukknop|
        klittenband|haakje|
        oogje|haak-en-oogsluiting|
        gesp|veter|strik|
        koord|trekkoord|
        magneetsluiting|
        karabijnsluiting|
        klikgesp|toggle|
        houtje-touwtje sluiting|
        overslag|wikkelsluiting|
        verborgen rits|
        blinde rits|haaksluiting|
        knoopsluiting|
        dubbele knoopsluiting|
        sluitspeld|brochesluiting
      `
    },

    /* ======================================
       26. KRAGEN
    ====================================== */

    {
      topicId: "mode-kraagsoorten",

      question:
        "Noem een soort kraag aan een kledingstuk.",

      answers: `
        overhemdkraag|polokraag|
        opstaande kraag|col|
        rolkraag|matrozenkraag|
        peterpankraag|
        reverskraag|sjaalkraag|
        mao-kraag|mandarijnkraag|
        bandkraag|puntkraag|
        button-downkraag|
        clubkraag|wide spread kraag|
        cutaway kraag|
        vlinderkraag|bontkraag|
        bontimitatiekraag|
        rucheskraag|waterfallkraag|
        dubbele kraag|
        afneembare kraag
      `
    },

    /* ======================================
       27. MOUWEN
    ====================================== */

    {
      topicId: "mode-mouwsoorten",

      question:
        "Noem een soort mouw aan kleding.",

      answers: `
        korte mouw|lange mouw|
        driekwartmouw|kapmouw|
        pofmouw|ballonmouw|
        trompetmouw|klokmouw|
        vlindermouw|raglanmouw|
        kimonomouw|vleermuismouw|
        splitmouw|transparante mouw|
        kanten mouw|gerimpelde mouw|
        ballonpofmouw|
        afneembare mouw|
        wijde mouw|smalle mouw|
        manchetmouw|
        geplooide mouw|
        open schoudermouw|
        opgerolde mouw
      `
    },

    /* ======================================
       28. ZAKKEN AAN KLEDING
    ====================================== */

    {
      topicId: "mode-zaksoorten",

      question:
        "Noem een soort zak die aan kleding kan zitten.",

      answers: `
        steekzak|kontzak|borstzak|
        cargozak|klepzak|
        opgestikte zak|binnenzak|
        broekzak|jaszak|
        ritszak|zijzak|
        heupzak|achterzak|
        voorzak|kangoeroezak|
        telefoonzak|muntzakje|
        paspelzak|naadzak|
        verborgen zak|
        veiligheidszak|
        borstzak met klep|
        dubbele zak|
        zak met knoop|
        zak met drukknoop
      `
    },

    /* ======================================
       29. BORDUURSTEKEN
    ====================================== */

    {
      topicId: "mode-borduursteken",

      question:
        "Noem een borduursteek.",

      answers: `
        kruissteek|kettingsteek|
        steelsteek|festonsteek|
        satijnsteek|stiksteek|
        rijgsteek|knoopsteek|
        Franse knoop|
        bouillonsteek|
        visgraatsteek|
        bladsteek|taksteek|
        veersteek|lazy daisy|
        margrietsteek|
        graansteek|spinnenwebsteek|
        rozetsteek|koraalsteek|
        rijstek|schaduwsteek|
        kabelsteek|
        dubbele kruissteek
      `
    },

    /* ======================================
       30. NAAIGEREEDSCHAP
    ====================================== */

    {
      topicId: "mode-naaigereedschap",

      question:
        "Noem gereedschap dat je bij naaien gebruikt.",

      answers: `
        naald|naaimachine|schaar|
        stoffenschaar|draadschaartje|
        meetlint|spelden|
        speldenkussen|
        tornmesje|vingerhoed|
        kleermakerskrijt|
        patroonpapier|
        stofklem|liniaal|
        zoommaatje|rolmes|
        snijmat|strijkijzer|
        strijkplank|rijgdraad|
        naaldinrijger|lockmachine|
        coverlockmachine|
        paspop|schneiderliniaal|
        krijtpotlood|magnetisch speldenkussen|
        naaimachinenaald|
        pincet
      `
    },

    /* ======================================
       31. NAAITECHNIEKEN
    ====================================== */

    {
      topicId: "mode-naaitechnieken",

      question:
        "Noem een handeling of techniek die je bij naaien gebruikt.",

      answers: `
        knippen|meten|spelden|
        rijgen|stikken|doorstikken|
        zomen|afwerken|locken|
        omzomen|rimpelen|
        plisseren|fronsen|
        plooien|inzetten|
        strijken|passen|patronen tekenen|
        patroon overnemen|
        stof markeren|naad openstrijken|
        ritssluiting inzetten|
        knoopsgat maken|
        knoop aannaaien|
        biaisband aanzetten|
        biaisband verwerken|
        verstevigen|voering inzetten|
        draad afhechten|stof keren
      `
    },

    /* ======================================
       32. ONDERDELEN VAN KLEDING
    ====================================== */

    {
      topicId: "mode-kledingonderdelen",

      question:
        "Noem een onderdeel van een kledingstuk.",

      answers: `
        kraag|mouw|manchet|
        knoop|rits|zak|zoom|
        naad|voering|capuchon|
        boord|revers|schouderstuk|
        tailleband|riemlus|
        bretel|schouderband|
        schoudervulling|
        knoopsgat|ritstrekker|
        trekkoord|elastiek|
        plooi|sluiting|pasje|
        split|label|waslabel|
        borstzak|mouwboord|
        binnenvoering
      `
    },

    /* ======================================
       33. REGENKLEDING
    ====================================== */

    {
      topicId: "mode-regenkleding",

      question:
        "Noem iets dat je kunt dragen om droog te blijven in de regen.",

      answers: `
        regenjas|regenbroek|
        regenponcho|regenlaarzen|
        waterdichte jas|
        hardshelljas|
        regenpak|waterdichte broek|
        regenhoed|zuidwester|
        regencape|waterdichte schoenen|
        waterdichte laarzen|
        waterdichte handschoenen|
        waterdichte pet|
        waterdichte overall|
        fietsregenjas|
        fietsregenbroek|
        regenoverschoenen|
        regenrok|
        waterdicht windjack|
        regenmantel|
        waterdichte overbroek
      `
    },

    /* ======================================
       34. WINTERKLEDING
    ====================================== */

    {
      topicId: "mode-winterkleding",

      question:
        "Noem iets dat je in de winter kunt dragen.",

      answers: `
        winterjas|donsjas|
        dikke trui|wollen trui|
        sjaal|handschoenen|
        wanten|muts|beanie|
        thermoshirt|thermobroek|
        snowboots|winterlaarzen|
        dikke sokken|wollen sokken|
        fleecevest|coltrui|
        skibroek|ski-jas|
        oorwarmers|gebreid vest|
        lange jas|wollen mantel|
        beenwarmers|nekwarmer|
        skipak|thermo-ondergoed|
        warme pantoffels|
        warme pyjama
      `
    },

    /* ======================================
       35. ZOMERKLEDING
    ====================================== */

    {
      topicId: "mode-zomerkleding",

      question:
        "Noem iets dat je op een warme zomerdag kunt dragen.",

      answers: `
        T-shirt|short|korte broek|
        zomerjurk|zomerrok|
        luchtige blouse|
        linnen broek|linnen shirt|
        tanktop|hemd|
        crop top|sandaal|
        slipper|espadrille|
        zonnehoed|strohoed|
        pet|zonnebril|
        bermuda|poloshirt|
        katoenen jurk|
        mouwloze top|
        zwemshort|badpak|
        bikini|pareo|
        zomerse jumpsuit|
        dunne blouse|kaftan
      `
    },

    /* ======================================
       36. SPORTKLEDING
    ====================================== */

    {
      topicId: "mode-sportkleding",

      question:
        "Noem een kledingstuk dat bij sport wordt gedragen.",

      answers: `
        sportshirt|sportbroek|
        voetbalshirt|voetbalshort|
        trainingsbroek|trainingsjack|
        legging|hardloopbroek|
        hardloopshirt|
        sportlegging|tennisrok|
        fietsshirt|fietsbroek|
        zwembroek|badpak|
        gympak|turnpak|
        trainingspak|
        sporthoodie|sportvest|
        compressieshirt|
        sportbeha|thermoshirt|
        skibroek|ski-jas|
        hockeyshirt|basketbalshirt|
        wielerpak|judopak|
        karatepak|yogabroek
      `
    },

    /* ======================================
       37. ZWEMKLEDING
    ====================================== */

    {
      topicId: "mode-zwemkleding",

      question:
        "Noem een soort zwemkleding.",

      answers: `
        badpak|bikini|zwembroek|
        zwemshort|zwemslip|
        tankini|monokini|
        zwemjurk|zwemshirt|
        rashguard|surfshirt|
        zwemlegging|zwempak|
        wedstrijdzwempak|
        triatlonpak|burkini|
        badshort|zwemtop|
        surfshort|boardshort|
        zwemrok|zwemshort met voering|
        zwemshirt met lange mouwen|
        tweedelig badpak
      `
    },

    /* ======================================
       38. NETTE EN FEESTELIJKE KLEDING
    ====================================== */

    {
      topicId: "mode-formele-kleding",

      question:
        "Noem een kledingstuk dat bij een formele gelegenheid gedragen kan worden.",

      answers: `
        pak|kostuum|smoking|
        colbert|blazer|overhemd|
        pantalon|vest|gilet|
        avondjurk|galajurk|
        cocktailjurk|baljurk|
        trouwjurk|nette blouse|
        nette rok|kokerrok|
        satijnen jurk|jumpsuit|
        smokingjasje|rokpak|
        mantelpak|tailleur|
        jacquet|rokkostuum|
        nette broek|coltrui|
        nette schoenen|
        blouse met kraag
      `
    },

    /* ======================================
       39. NACHTKLEDING
    ====================================== */

    {
      topicId: "mode-nachtkleding",

      question:
        "Noem iets dat je als nachtkleding kunt dragen.",

      answers: `
        pyjama|pyjamabroek|
        pyjamashirt|nachtjapon|
        nachthemd|slaapshirt|
        slaapbroek|nachtjurk|
        slaapshort|badjas|
        ochtendjas|slaaponesie|
        onesie|flanellen pyjama|
        katoenen pyjama|
        satijnen pyjama|
        zijden pyjama|
        fleecepyjama|
        thermopyjama|
        slaapsokken|
        slaaphemd|
        slaaptrui|
        nachtset|pyjamaset
      `
    },

    /* ======================================
       40. ONDERKLEDING
    ====================================== */

    {
      topicId: "mode-onderkleding",

      question:
        "Noem een soort onderkleding.",

      answers: `
        onderbroek|boxershort|
        slip|hipster|shorty|
        onderhemd|hemd|
        singlet|ondershirt|
        thermo-ondergoed|
        thermoshirt|
        thermobroek|
        lange onderbroek|
        sportondergoed|
        corrigerend ondergoed|
        onderrok|onderjurk|
        onderbroek met pijpjes|
        naadloos ondergoed|
        katoenen ondergoed|
        wollen ondergoed|
        sportbeha|
        beha|bralette
      `
    },

    /* ======================================
       41. TRADITIONELE KLEDING
    ====================================== */

    {
      topicId: "mode-traditionele-kleding",

      question:
        "Noem een traditioneel kledingstuk uit een land of cultuur.",

      answers: `
        kimono|yukata|hanbok|
        sari|saree|salwar kameez|
        kurta|dhoti|kaftan|
        djellaba|abaya|kilt|
        lederhose|dirndl|
        poncho|huipil|
        cheongsam|qipao|
        ao dai|sarong|batikshirt|
        dashiki|agbada|
        boubou|thobe|
        kandura|keffiyeh|
        sombrero|fez|
        barong tagalog|
        kebaya|chador|
        happi|haori|hakama|
        traje de flamenca
      `
    },

    /* ======================================
       42. MODE UIT DE JAREN 60
    ====================================== */

    {
      topicId: "mode-jaren-60",

      question:
        "Noem een kledingstuk of accessoire dat kenmerkend was voor mode uit de jaren 60.",

      answers: `
        minirok|A-lijnjurk|
        shift dress|mod dress|
        go-go boots|knielaarzen|
        coltrui|polojurk|
        geometrische jurk|
        kleurrijke maillot|
        hoofdband|brede haarband|
        ronde zonnebril|
        oversized zonnebril|
        boxy jas|korte jas|
        babydolljurk|
        smalle stropdas|
        slim fit pak|
        peacoat|
        Beatles-pak|
        paisleyshirt|
        tuniek|hippievest|
        gebloemde blouse|
        hoge laarzen
      `
    },

    /* ======================================
       43. MODE UIT DE JAREN 80
    ====================================== */

    {
      topicId: "mode-jaren-80",

      question:
        "Noem een kledingstuk of accessoire dat kenmerkend was voor mode uit de jaren 80.",

      answers: `
        schoudervulling|
        oversized blazer|
        beenwarmers|legwarmers|
        felgekleurde legging|
        neonshirt|trainingspak|
        windjack|bomberjack|
        spijkerjas|denimjack|
        stonewashed jeans|
        hoge taille broek|
        cropped sweater|
        oversized sweater|
        scrunchie|zweetband|
        sporthoofdband|
        leren bikerjack|
        nettop|mesh top|
        wijde riem|
        grote oorbellen|
        schoudertas|
        witte sneakers|
        felgekleurde sneakers|
        gebreide trui|
        gekleurde maillot
      `
    },

    /* ======================================
       44. MODESTEDEN
    ====================================== */

    {
      topicId: "mode-modesteden",

      question:
        "Noem een stad die bekendstaat om mode, ontwerpers of mode-evenementen.",

      answers: `
        Parijs|Milaan|Londen|
        New York|Tokio|Seoul|
        Berlijn|Antwerpen|
        Amsterdam|Kopenhagen|
        Stockholm|Florence|
        Rome|Madrid|Barcelona|
        Los Angeles|Shanghai|
        Hongkong|Singapore|
        Mumbai|Delhi|Dubai|
        Istanbul|São Paulo|
        Sydney|Melbourne|
        Brussel|Wenen|
        Lissabon|Mexico-Stad|
        Lagos|Johannesburg
      `
    },

    /* ======================================
       45. MODEBEROEPEN
    ====================================== */

    {
      topicId: "mode-beroepen",

      question:
        "Noem een beroep dat met mode of kleding te maken heeft.",

      answers: `
        modeontwerper|kleermaker|
        coupeur|coupeuse|
        stylist|modestylist|
        personal shopper|
        kledingverkoper|
        etaleur|patroonmaker|
        naaister|textielontwerper|
        stoffenontwerper|
        kostuumontwerper|
        kostuumassistent|
        modefotograaf|
        modejournalist|
        moderedacteur|
        mode-illustrator|
        modeinkoper|
        productontwikkelaar|
        modeproducent|
        schoenontwerper|
        tassenontwerper|
        sieradenontwerper|
        kledingreparateur|
        borduurder|
        breier|wever|
        hoedenmaker|
        schoenmaker
      `
    },

    /* ======================================
       46. KLEDINGVERZORGING
    ====================================== */

    {
      topicId: "mode-kledingverzorging",

      question:
        "Noem iets waarmee je kleding kunt verzorgen of schoonmaken.",

      answers: `
        wasmachine|wasmiddel|
        wasverzachter|vlekverwijderaar|
        waszak|wasnet|
        wasmand|droogrek|
        waslijn|wasknijper|
        droogtrommel|droger|
        strijkijzer|strijkplank|
        kledingstomer|
        stoomapparaat|
        kledingborstel|
        pluizenroller|
        ontpluizer|
        textielspray|
        kledinghanger|
        kledinghoes|
        schoenborstel|
        handwasmiddel|
        wolwasmiddel|
        fijnewasmiddel|
        wascapsule|
        kledingreparatieset
      `
    },

    /* ======================================
       47. ONDERDELEN VAN EEN SCHOEN
    ====================================== */

    {
      topicId: "mode-schoenonderdelen",

      question:
        "Noem een onderdeel van een schoen.",

      answers: `
        zool|binnenzool|
        buitenzool|tussenzool|
        hak|neus|teenstuk|
        hiel|hielkap|
        veters|veteroog|
        tong|schoentong|
        schacht|voering|
        voetbed|zoolrand|
        sluiting|gesp|rits|
        klittenband|enkelbandje|
        treklus|neuskap|
        hielversteviging|
        loopzool|inlegzool|
        sierstiksel|zijpaneel
      `
    },

    /* ======================================
       48. MATERIALEN VOOR SCHOENEN
    ====================================== */

    {
      topicId: "mode-schoenmaterialen",

      question:
        "Noem een materiaal waarvan schoenen gemaakt kunnen worden.",

      answers: `
        leer|kunstleer|suède|
        nubuck|canvas|katoen|
        linnen|denim|wol|
        vilt|rubber|kurk|
        hout|kunststof|
        polyester|nylon|
        neopreen|mesh|
        microvezel|textiel|
        satijn|zijde|fluweel|
        PVC|EVA|polyurethaan|
        thermoplastisch rubber|
        gerecycled polyester|
        schuim|viltstof
      `
    },

    /* ======================================
       49. MODESTIJLEN
    ====================================== */

    {
      topicId: "mode-stijlen",

      question:
        "Noem een kledingstijl.",

      answers: `
        casual|sportief|klassiek|
        chic|minimalistisch|
        streetwear|vintage|
        retro|bohemian|boho|
        preppy|punk|gothic|
        grunge|hippie|
        romantisch|urban|
        skater|academia|
        dark academia|
        cottagecore|
        old money|normcore|
        techwear|gorpcore|
        workwear|western|
        rockabilly|
        avant-garde|
        futuristisch|
        formeel|smart casual|
        business casual|
        Y2K|military|
        nautisch|sporty chic
      `
    },

    /* ======================================
       50. FEESTACCESSOIRES
    ====================================== */

    {
      topicId: "mode-feestaccessoires",

      question:
        "Noem een accessoire dat je bij een feestelijke outfit kunt dragen.",

      answers: `
        strikje|vlinderdas|
        stropdas|pochet|
        broche|manchetknopen|
        ketting|parelketting|
        choker|armband|ring|
        oorbellen|hanger|
        diadeem|tiara|
        haarstrik|haarclip|
        haarspeld|haarketting|
        avondtas|clutch|
        glinsterende riem|
        satijnen sjaal|
        zijden sjaal|
        lange handschoenen|
        feesthoed|fascinator|
        corsage|haarband|
        glittertas|
        sieradenbroche
      `
    }

  ];


  /* ========================================
     VRAGEN OMZETTEN
  ======================================== */

  const modeQuestions = questionData.map(
    function (entry, index) {

      return {
        id: "mode-" + String(
          index + 1
        ).padStart(2, "0"),

        topicId: entry.topicId,

        category: "Mode",

        question: entry.question,

        answers: makeAnswers(
          entry.answers
        )
      };

    }
  );


  /* ========================================
     BESTAANDE VRAGENBANK VINDEN
  ======================================== */

  if (
    !Array.isArray(
      window.QUIZBALLON_EXPANDED_QUESTIONS
    )
  ) {

    console.error(
      "❌ QuizBallon Mode: de basisvragenbank " +
      "is nog niet geladen. " +
      "Plaats mode-vragen.js na " +
      "vragen-uitbreiding.js."
    );

    return;
  }


  /* ========================================
     DUBBELE VRAGEN VOORKOMEN
  ======================================== */

  const existingQuestions =
    window.QUIZBALLON_EXPANDED_QUESTIONS;

  const existingIds = new Set(
    existingQuestions.map(
      function (question) {
        return question.id;
      }
    )
  );

  const existingTopics = new Set(
    existingQuestions.map(
      function (question) {
        return question.topicId;
      }
    ).filter(Boolean)
  );


  /* ========================================
     MODEVRAGEN TOEVOEGEN

     De vragen worden toegevoegd
     aan de bestaande vragenbank.

     De Daily Challenge kiest later
     uit de gecombineerde lijst.
  ======================================== */

  let added = 0;

  modeQuestions.forEach(
    function (question) {

      if (
        existingIds.has(question.id) ||
        existingTopics.has(question.topicId)
      ) {
        return;
      }

      existingQuestions.push(question);

      existingIds.add(question.id);

      existingTopics.add(
        question.topicId
      );

      added++;
    }
  );


  /* ========================================
     CONTROLE
  ======================================== */

  window.QUIZBALLON_MODE_INFO = {
    version: "1.0",

    totalQuestions:
      modeQuestions.length,

    addedQuestions:
      added,

    questions:
      modeQuestions,

    topics:
      modeQuestions.map(
        function (question) {
          return question.topicId;
        }
      )
  };

  console.log(
    "👗 QuizBallon Mode geladen!"
  );

  console.log(
    "✅ Nieuwe modevragen:",
    added
  );

  console.log(
    "📚 Totaal aantal vragen:",
    existingQuestions.length
  );

  console.table(
    modeQuestions.map(
      function (question, index) {
        return {
          nummer: index + 1,

          onderwerp:
            question.topicId,

          vraag:
            question.question,

          antwoorden:
            question.answers.length
        };
      }
    )
  );

})();
