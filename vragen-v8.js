/* =============================================================
  QUIZBALLON V8 — 650 NIEUWE TOEGANKELIJKE VRAGEN

  Dit bestand is de V8-uitbreiding voor vragen-650.js (V7).
  Laat het bestaande vragen-650.js staan en laad DIT bestand
  onmiddellijk erna, vóór daily.js.

  13 categorieën × 50 verschillende vragen.
  1 raket t/m 50 antwoorden; 2 raketten bij 51-150;
  daarna één extra raket per 100 antwoorden.
  Raket = 100 punten. De rest krijgt een SCHATTING
  van zeldzaamheid, géén gemeten spelersstatistiek.

  Belangrijk: geen offline vragenbank kent vanzelf IEDER
  mogelijk correct antwoord. Voeg ontbrekende geldige
  antwoorden toe aan BANKEN hieronder. NOOIT zomaar elk
  onbekend antwoord automatisch goedkeuren.
============================================================= */
(function () {
  "use strict";
  const OLD = window.QB650_BY_CATEGORY;
  if (!OLD || Object.keys(OLD).length !== 13 ||
      Object.values(OLD).some(a => !Array.isArray(a) || a.length !== 50)) {
    throw Error("V8 verwacht de werkende V7-vragen-650.js vóór dit bestand.");
  }

  // De vraagtekst heeft een lijst met bronindices en @extra-antwoordbanken.
  // 0 is de eerste V7-vraag van die categorie. D0 verwijst naar Dieren-vraag 0.

  const V8_VRAGEN = `# Dieren
Noem een dier dat in het water leeft.|2,3,9,21-27,36-38,47,@water
Noem een dier dat kan vliegen.|5-7,16-18,33-35,43,45,@vliegen,!Kakapo
Noem een dier dat je in een dierentuin kunt zien.|0-15,21,22,24,28,29,32,41,48,49
Noem een dier dat vier poten heeft.|0,1,10-15,21,22,29,30,31,48,49,@vierpoten
Noem een dier dat in Afrika leeft.|12,29,48,@afrika
Noem een dier dat in een bos leeft.|11,13,30,33,34,45,@bos
Noem een dier dat eieren legt.|4-9,16-22,24,26,31-39,43
Noem een dier dat mensen als huisdier houden.|@huisdieren
Noem een dier dat groter is dan een mens.|1,2,10,12,24,41,48
Noem een dier dat kleiner is dan een muis.|16-20,39
Noem een dier dat in de zee leeft.|2-4,9,23-27,37,38,47,@zee
Noem een dier dat in de jungle leeft.|28,@jungle
Noem een dier dat op een boerderij voorkomt.|@boerderij
Noem een dier dat kan zwemmen.|2-4,9,23-27,36-38,47
Noem een dier dat insecten eet.|@insecteneters
Noem een dier dat planten eet.|11-13,15
Noem een dier dat andere dieren eet.|0,3,5,6,8,23,42,49
Noem een dier met een staart.|0,8,10-15,21,22,32-36,40-43,48,49
Noem een dier met hoorns.|12,40
Noem een dier met een vacht.|0,1,10-15,30,45,48,49
Noem een dier met schubben.|3,8,9,24,36,47
Noem een dier met veren.|4-7,32-35
Noem een dier dat in Australië leeft.|15
Noem een dier dat in koude gebieden leeft.|1,4,11,30,@koud
Noem een dier dat in de woestijn leeft.|29
Noem een dier dat in Nederland in het wild voorkomt.|30,33-36,39,45
Noem een dier dat je 's nachts kunt tegenkomen.|6,20,30,45,@nacht
Noem een dier dat een winterslaap houdt.|30,@winterslaap
Noem een dier dat heel snel kan bewegen.|0,5,11,12,35,42,49
Noem een dier dat bijzonder langzaam beweegt.|@langzaam
Noem een dier dat in een boom leeft.|7,14,15,18,28,33,34
Noem een dier dat onder de grond leeft.|13,19
Noem een dier dat een schild heeft.|9,17,38
Noem een dier dat kan springen.|12,13,15,21
Noem een dier dat kan klimmen.|0,1,14,15,28,49
Noem een dier dat een lange nek heeft.|41,@langennek
Noem een dier dat in een rivier leeft.|21,22,36
Noem een dier dat in een meer leeft.|21,22,36
Noem een dier dat je op het strand kunt vinden.|24-27,38,47
Noem een dier dat in groepen leeft.|12,14,19,44
Noem een dier dat nesten bouwt.|5-7,16,33-35
Noem een dier dat zijn kleur kan veranderen.|46,@kleurwissel
Noem een dier dat uitgestorven is.|40-43
Noem een dier dat heel oud kan worden.|2,9,48
Noem een dier dat giftig is.|8,20,21,23
Noem een dier dat mensen voor voedsel houden.|@voedsel
Noem een dier dat een opvallende kleur heeft.|7,18,21,27
Noem een dier met strepen.|@strepen
Noem een dier met stippen of vlekken.|@vlekken
Noem een dier dat je in een natuurdocumentaire kunt zien.|0-49,@huisdieren,@water,@boerderij
# Aardrijkskunde
Noem een land in Europa.|@europa
Noem een land in Afrika.|49,@afrikaLand
Noem een land in Azië.|@azieLand
Noem een land in Noord- of Zuid-Amerika.|5,31,@amerikaLand
Noem een land waar je op vakantie kunt gaan.|1,2,4-6,28,40-42,46,49,@europa,@azieLand,@afrikaLand,@amerikaLand
Noem een land dat aan zee ligt.|1,2,@kustLand
Noem een land waar je bergen kunt vinden.|@bergLand
Noem een land dat groter is dan Nederland.|46
Noem een Europees land waar je met de auto naartoe kunt.|@rijdbareLanden
Noem een land met een beroemde hoofdstad.|@landen
Noem een stad in Nederland.|@nederlandSteden
Noem een stad in België.|@belgieSteden
Noem een Europese hoofdstad.|0,31,33
Noem een hoofdstad buiten Europa.|31,33,@wereldHoofdsteden
Noem een stad waar veel toeristen naartoe gaan.|25,32,45
Noem een stad die aan een rivier ligt.|32,@rivierSteden
Noem een plaats aan de kust.|10,@kustSteden
Noem een bekende wereldstad.|25,32,45,@wereldSteden
Noem een plaats in Duitsland.|21
Noem een plaats in Frankrijk.|@frankrijkSteden
Noem een eiland.|3,7-10,26,39,44
Noem een eiland waar mensen wonen.|3,7-10,26,39,44
Noem een eiland dat bekendstaat als vakantiebestemming.|7-10,26
Noem een plek waar je op het strand kunt liggen.|7-10,26
Noem een eilandengroep.|44
Noem een rivier.|11,@rivieren
Noem een rivier in Europa.|@europaRivieren
Noem een rivier buiten Europa.|11,@wereldRivieren
Noem een meer.|19,20,@meren
Noem een zee of oceaan.|43,@zeeenn
Noem een berg.|12,@bergen
Noem een gebergte.|13,48
Noem een gebied met veel zand.|15
Noem een woestijn.|15,@woestijnen
Noem een vulkaan.|17,26,@vulkanen
Noem een natuurgebied dat op een kaart staat.|18,48,N26-28
Noem een provincie in Nederland.|22
Noem een provincie in België.|23
Noem een streek in Nederland.|47
Noem een land dat aan Duitsland grenst.|6
Noem een land dat aan de Middellandse Zee ligt.|1
Noem een geografische plek met veel water.|19,20,30,36-39,43
Noem iets wat je op een wereldkaart kunt aanwijzen.|1-49,@wereldSteden
Noem een beroemd natuurwonder dat je op reis kunt bezoeken.|12,17,18,37,48
Noem een beroemde plek in Azië.|8,9,12,14,27,35
Noem een beroemde plek in Amerika.|11,25,31
Noem een plek die boven de poolcirkel ligt.|@poolPlekken
Noem een plaats waar je kunt skiën.|13,@skiPlekken
Noem een land waar een bekende voetbalcompetitie wordt gespeeld.|@voetbalLanden
Noem een plek die je in een reisgids kunt tegenkomen.|0-49,@wereldSteden
# Sport
Noem een sport die je met een bal speelt.|5,6,20,28,36,48,@balSporten
Noem een sport die je buiten kunt doen.|2-6,11-13,15,18,19,28,31-34,44,47,48
Noem een sport die je binnen kunt doen.|0,4,6,10,20,28,30,35,38,41,42,47
Noem een sport die je op televisie kunt zien.|0,2-11,17-20,24,28,31-36,38-42,44,46-49,@bekendeSporten
Noem een sport waar je moet rennen.|5,6,14,15,28,36,44,@rennen
Noem een sport waarbij je moet springen.|0,12,34,41,@springenSport
Noem een sport die je op of in het water doet.|16-19,32,@waterSporten
Noem een sport waarbij je wielen gebruikt.|2,3,31
Noem een sport die je in de winter kunt doen.|7-9,46,49,@winterSporten
Noem een sport die je op het strand kunt doen.|44,@strandSporten
Noem een sport waarbij je een racket of bat vasthoudt.|4,48
Noem een sport waarbij je een helm draagt.|3,39,49
Noem een sport waar je een doelpunt kunt maken.|5,6,20
Noem een teamsport.|5,6,20,36,44,48
Noem een sport die je alleen kunt beoefenen.|0,2,4,8-10,12,13,15-17,30,33,38,41
Noem een sport waarvoor je veel moet bewegen.|0-11,15-20,28-36,38-44,46-49,@bekendeSporten
Noem een sport die op de Olympische Spelen voorkomt.|28,@olympisch
Noem een sport met een dier.|11,34,43
Noem een vechtsport.|10,42
Noem een sport met een fiets.|2,31
Noem een sport die je op ijs kunt doen.|7,46
Noem een sport waarvoor je een boot gebruikt.|18,19,32
Noem een atletiekonderdeel.|12-15
Noem een sport die kinderen op school spelen.|5,6,20,28,36,44,47
Noem een sport die je met vrienden kunt spelen.|4-6,20,28,30,36,44,47,48
Noem een bekende voetbalclub.|25,@voetbalclubs
Noem een beroemde voetballer of voetbalster.|@voetballers
Noem een bekende sporter.|@sporters
Noem een tennisser of tennisster.|@tennissers
Noem een bekende sportwedstrijd of competitie.|21,26,27,45,@competities
Noem een bekende sporttrofee.|45
Noem een plek waar je kunt sporten.|22,@sportPlekken
Noem een voorwerp dat bij sport wordt gebruikt.|1,29,30,38,39,@sportSpullen
Noem een sport waarbij je iets moet gooien.|13,@gooienSport
Noem een sport waarbij snelheid belangrijk is.|2,3,8,9,15,31,40,46,49
Noem een sport waar evenwicht belangrijk is.|0,7,9,11,33,41
Noem een sport waar je lenig voor moet zijn.|0,33,41
Noem een sport die op gras gespeeld kan worden.|5,6,11,28,36,47,48
Noem een sport die op een baan wordt beoefend.|2,3,15,31,46
Noem een sport waarbij je een net gebruikt.|47,@netSport
Noem een sport waarbij je handschoenen draagt.|@handschoenSport
Noem een sport met een paard.|11,34
Noem een sport die je in de bergen kunt doen.|8,9,33
Noem een sport die je op een trampoline kunt doen.|0,41
Noem een sport waarbij je moet mikken.|29,30,38
Noem een sport die je met een partner kunt doen.|0,4,11,20,28,38,41,47
Noem een sport die je in een zwembad kunt beoefenen.|16,17
Noem een sport die bij de Paralympische Spelen hoort.|24
Noem een sport die een scheidsrechter heeft.|5,6,10,20,28,35,36,42,47,48,@scheidsrechterSport
Noem iets wat je tijdens een sportwedstrijd kunt winnen.|21,26,45
# Muziek
Noem een muziekinstrument.|0-9,40,41,44-46,@instrumenten
Noem een instrument met snaren.|2,4,41,44,46
Noem een instrument waarop je kunt slaan.|40,45
Noem een instrument waar je op blaast.|0,1
Noem een instrument met toetsen.|3
Noem een instrument dat in een band kan zitten.|0-4,8,40,41,45
Noem een instrument dat in een orkest gebruikt wordt.|0-3,8
Noem een instrument dat makkelijk mee te nemen is.|0-2,4,5-7,40,41,45
Noem een muziekinstrument dat je op straat kunt zien.|0-2,4-7,45
Noem iets waarmee je muziek kunt maken.|0-9,37-41,44-48
Noem een muziekstijl.|10-17,36,43
Noem muziek waar je op kunt dansen.|10-17,43
Noem een muziekstijl met gitaren.|11,14,15
Noem een muziekstijl met veel elektronische geluiden.|13
Noem een stijl die je op een festival kunt horen.|10-17,43
Noem een artiest die veel mensen kennen.|30-33,@popArtiesten
Noem een bekende zanger of zangeres.|30-33,@zangers
Noem een muziekband of groep.|33,@bands
Noem een artiest uit Nederland.|@nlArtiesten
Noem een zanger of zangeres uit de Verenigde Staten.|@amerikaanseArtiesten
Noem een artiest uit het Verenigd Koninkrijk.|33,@britseArtiesten
Noem een beroemde rapper.|@rappers
Noem een bekende dj.|@djs
Noem een bekende popster.|@popArtiesten
Noem een componist uit de geschiedenis.|24,25
Noem een bekend liedje.|@liedjes
Noem een liedje dat vaak op een feestje wordt gedraaid.|@feestLiedjes
Noem een lied dat bij Kerstmis past.|@kerstLiedjes
Noem een bekende musical.|29
Noem een bekende opera of klassiek muziekstuk.|28,@klassiek
Noem een muziekfestival.|34
Noem een plek waar je een concert kunt bezoeken.|35,@concertPlekken
Noem een manier om naar muziek te luisteren.|38
Noem iets dat bij een drumstel hoort.|40
Noem een soort gitaar.|41
Noem een woord dat een muzikant vaak gebruikt.|18-23,26,47
Noem een onderdeel van een muziekstudio.|39,47,48
Noem een muzieknoot.|23
Noem een soort zangstem.|19
Noem een manier om samen te zingen.|42,49
Noem een manier om geluid te versterken.|@versterken
Noem iets dat op een podium tijdens een optreden staat.|3,40,41,48
Noem een muziekinstrument uit een ander werelddeel.|5-7,44,45
Noem een genre waar vroeger veel naar geluisterd werd.|10-12,14,17
Noem muziek die in een film kan klinken.|@filmMuziek
Noem een instrument dat in jazzmuziek gebruikt wordt.|0-3,8,40,41,45
Noem een lied dat bij een sportwedstrijd gezongen wordt.|@sportLiedjes
Noem een bekende muziekprijs.|@muziekPrijzen
Noem een bekend platenlabel.|27
Noem een manier om zelf muziek op te nemen.|37-39,48
# Mode
Noem iets wat je kunt aantrekken.|0-3,5-9,16,17,30-37,@kleding
Noem iets wat je in de winter draagt.|0,5,8,16,17,31,@winterKleding
Noem iets wat je in de zomer draagt.|1-3,6,7,19,34,@zomerKleding
Noem iets wat je bij regenachtig weer draagt.|0,8,17,32
Noem een kledingstuk voor een feestje.|2,3,6,30,33
Noem een kledingstuk voor op school.|0,1,5,7,9
Noem iets wat je tijdens het sporten kunt dragen.|1,5,7,17,19,34
Noem iets wat je op je hoofd kunt dragen.|9,35,49
Noem iets wat je aan je voeten draagt.|6-8,@schoenen
Noem iets wat je om je nek draagt.|4,15,16,33
Noem iets wat je om je pols draagt.|11,15
Noem iets wat je aan je vingers draagt.|12,17
Noem iets wat je in je haar kunt dragen.|49,@haar
Noem iets wat je in je hand kunt meenemen.|10,48
Noem een soort jas.|0,31,32,@jassen
Noem een soort broek.|1,31,32,@broeken
Noem een kledingstuk met mouwen.|0,5,@mouwen
Noem een kledingstuk zonder mouwen.|@zonderMouwen
Noem een soort schoen.|6-8,@schoenen
Noem een soort tas.|10,48
Noem een soort hoed of muts.|9,35,49
Noem een sieraad.|12-15
Noem een modeaccessoire.|9-19,35,49,@accessoires
Noem een kledingstuk dat van wol kan zijn.|0,5,16,17,31
Noem een kledingstuk dat vaak van katoen is.|1-3,5
Noem een materiaal waarvan kleding gemaakt wordt.|20-22,24
Noem een kleur die je op kleding kunt zien.|@kleuren
Noem een patroon dat op kleding kan staan.|25
Noem iets dat aan een schoen zit.|47
Noem iets wat je bij het naaien gebruikt.|26-29,42,43
Noem een kledingstuk dat je in een winkel kunt passen.|0-3,5-9,30-34,@kleding
Noem iets wat mensen op een bruiloft dragen.|3,6,12-15,30,33,@bruiloft
Noem een traditioneel kledingstuk.|35-37
Noem een kledingmerk.|38-40
Noem een bekend modemerk uit Europa.|38-40
Noem iets wat je op een modeshow kunt zien.|0-3,6-15,33,38-41
Noem een soort jurk.|3,30,33
Noem een soort rok.|2
Noem een soort trui.|5,31
Noem een kledingstuk dat je in het water draagt.|34
Noem een kledingstuk dat je op vakantie meeneemt.|0-3,5-10,16,19,32,34
Noem iets dat je kleding bij elkaar houdt.|18,26,27
Noem een soort bril.|19
Noem iets dat in een kledingkast kan hangen.|0-3,5,16,17,30-34,@kleding
Noem een schoen die je buiten kunt dragen.|6-8,@schoenen
Noem een tas die je op reis gebruikt.|10,48
Noem een kledingstuk met een capuchon.|@capuchon
Noem iets wat je kunt dragen als het koud is.|0,5,8,9,16,17,31,@winterKleding
Noem een kledingstuk dat je bij een nette gelegenheid draagt.|3,4,6,30,33
Noem iets dat je in een kledingwinkel kunt kopen.|0-3,5-19,30-40,48,49,@kleding
# Geschiedenis
Noem een beroemd persoon uit de geschiedenis.|0-8,15,21-23,27,34-36,43-44,@geschiedenisPersonen
Noem een koning of koningin uit het verleden.|0,3-7,35,36,@koningen
Noem een historische leider.|0,1,3-8,15,34,35,36,43
Noem een beroemde uitvinder.|26,27,@uitvinders
Noem iemand die vroeger een ontdekking deed.|20-22,27
Noem een bekende persoon uit de Nederlandse geschiedenis.|6,7,23,44
Noem een bekende vrouw uit de geschiedenis.|4,7,22,23,35,36
Noem een beroemde oude beschaving.|0,1,16-19,42
Noem een oud rijk of koninkrijk.|16-19,42,43,@oudeRijken
Noem een land waar veel oude ruïnes te vinden zijn.|@oudeLanden
Noem een oud bouwwerk.|31,32,49
Noem een beroemd kasteel.|31
Noem een plek met eeuwenoude overblijfselen.|31,32,49
Noem iets dat je in een historisch museum kunt zien.|19,26,39,41,46,48
Noem een voorwerp dat mensen vroeger gebruikten.|26,39,@oudeVoorwerpen
Noem een historisch vervoermiddel.|39,V42
Noem iets dat vóór de computer werd gebruikt om te schrijven.|@schrijvenVroeger
Noem een beroemde veldslag.|9-11
Noem een bekende oorlog.|11,28,45
Noem een historische revolutie.|12,28
Noem een gebeurtenis uit de Tweede Wereldoorlog.|23,24,@wo2
Noem iemand die belangrijk was in de Tweede Wereldoorlog.|23,34,@wo2Personen
Noem een oud handelsproduct.|25,26
Noem iets dat vroeger als geld werd gebruikt.|@geldVroeger
Noem een oude handelsroute.|25
Noem een uitvinding die ons leven veranderde.|26,27,@uitvindingen
Noem een bekende ontdekking uit de wetenschapsgeschiedenis.|@ontdekkingen
Noem een beroemde ontdekkingsreiziger.|20,21
Noem een historische stad.|13,14,30,@historischeSteden
Noem iets wat bij de oude Romeinen hoort.|1,43,@romeinen
Noem iets wat bij het oude Egypte hoort.|0,@egypte
Noem iets wat bij de Vikingen hoort.|@vikingen
Noem een gebouw uit de middeleeuwen.|31,32
Noem iets wat je in een oud kasteel kunt vinden.|31,@kasteelSpullen
Noem een oud schrift of een oude taal.|19
Noem een beroemd historisch document.|24,41
Noem iets dat met Napoleon te maken heeft.|11,29
Noem een bekende keizer.|1,15,35,43
Noem een beroemde vrouw die over een land regeerde.|4,7,35,36
Noem iets dat bij de Industriële Revolutie hoort.|26,27,28
Noem een bekende historische ontdekkingsreis.|@reizen
Noem een historische persoon naar wie een straat genoemd kan zijn.|0-8,15,20-23,27,34-36,43-44,@geschiedenisPersonen
Noem een historisch schip.|39
Noem een oud beroep.|25,46,@oudeBeroepen
Noem iets dat je op een oude foto zou kunnen zien.|39,V42
Noem een bekende gebeurtenis uit de Nederlandse geschiedenis.|@nlGebeurtenissen
Noem een beroemd vredesverdrag.|24,41
Noem een plaats die belangrijk was in de geschiedenis.|13,14,30,31,32,49,@historischeSteden
Noem een tijdperk uit de geschiedenis.|@tijdperken
Noem iets dat mensen vroeger maakten of bouwden.|26,31,32,39
# Ruimte
Noem iets dat je in de ruimte kunt vinden.|0-6,15-29,39-42,44,46-49,@ruimteObjecten
Noem een planeet.|18-21,39,40,@planeten
Noem een maan in ons zonnestelsel.|0-3,@manen
Noem een ster.|15-17,@sterren
Noem een sterrenbeeld.|46,@sterrenbeelden
Noem een bekend sterrenstelsel.|24,25
Noem iets dat om een planeet draait.|0-3,@satellieten
Noem iets dat bij de zon hoort.|13,23,45,@zon
Noem iets dat aan de nachtelijke hemel zichtbaar is.|15-19,22-25,40,46
Noem iets dat je met een telescoop kunt bekijken.|0-3,15-29,38,45-49,@ruimteObjecten
Noem een object uit ons zonnestelsel.|0-5,18-21,23,29,47-49,@zonnestelsel
Noem een planeet waar ruimtevaartuigen naartoe zijn gestuurd.|18-21,@planetenBezocht
Noem iets dat met de maan te maken heeft.|6-8,32,@maanDingen
Noem een beroemd ruimtevaartuig.|7-14,36,@ruimteVoertuigen
Noem een ruimtemissie.|7-14
Noem een astronaut.|31-33,38,@astronauten
Noem een astronaut die op de maan liep.|32
Noem een land dat mensen of robots de ruimte in stuurt.|@ruimteLanden
Noem een ruimtevaartorganisatie.|34
Noem iets dat bij de lancering van een raket hoort.|35,36
Noem een raket.|36,@raketten
Noem een plek waar raketten worden gelanceerd.|35
Noem een ruimtestation.|37
Noem iets wat astronauten in de ruimte gebruiken.|37,@astronautSpullen
Noem een voorwerp dat in een ruimtepak kan zitten.|@ruimtepak
Noem een robot die een andere planeet onderzoekt.|10
Noem iets dat op Mars te vinden is.|@marsDingen
Noem iets dat op de maan te vinden is.|6,@maanOppervlak
Noem een hemellichaam waarop een sonde is geland.|47
Noem een voorwerp dat in de ruimte zweeft.|0-4,12,14,29,37,40,41,47,@ruimteObjecten
Noem een meteorenzwerm of komeet.|22,23,@kometen
Noem een soort hemellichaam.|0-5,15-29,39-41,47-49,@hemellichamen
Noem iets wat licht geeft in de ruimte.|15-17,27
Noem een bekende telescoop.|14
Noem een wetenschapper die de ruimte bestudeerde.|@astronomen
Noem een woord dat je vaak over ruimtevaart hoort.|34-39,42,@ruimteWoorden
Noem een ontdekking die met sterren of planeten te maken heeft.|@ontdekkingenRuimte
Noem een maan van een grote planeet.|0-3
Noem een planeet of maan met een atmosfeer.|48
Noem iets dat op aarde vanuit de ruimte te zien is.|@aardeVanuitRuimte
Noem een object dat in een baan om de aarde beweegt.|37,@aardbaan
Noem een bekende naam uit de geschiedenis van de ruimtevaart.|31-33,38
Noem iets dat ruimteafval kan zijn.|42
Noem iets dat met zwaartekracht te maken heeft.|21,28,42,@zwaartekracht
Noem een plek waar mogelijk buitenaards leven wordt gezocht.|@levenZoeken
Noem een soort licht dat een ruimtetelescoop kan waarnemen.|44
Noem een onderdeel van een zonnestelsel.|0-5,18-23,29,40,48,49,@planeten
Noem een voorwerp op een ruimtemissie.|8-14,36,37,@ruimteVoertuigen
Noem iets dat je over de ruimte op school leert.|0-49,@ruimteObjecten
Noem een naam die bij het heelal hoort.|0-49,@ruimteObjecten
# Wetenschap
Noem iets dat met wetenschap te maken heeft.|0-49,@wetenschap
Noem een lichaamsdeel.|16-18,@lichaamsdelen
Noem een orgaan in het menselijk lichaam.|16
Noem een bot in je lichaam.|17
Noem een spier in je lichaam.|18
Noem iets wat in je bloed zit.|19-21
Noem iets wat je lichaam nodig heeft om gezond te blijven.|19-22,@gezondheid
Noem iets dat je met een microscoop kunt bekijken.|14,15,@microKlein
Noem een levend organisme dat uit één cel kan bestaan.|@microben
Noem een dier of plant die wetenschappers onderzoeken.|D0-49,N0-14
Noem iets dat een natuurkundige kan meten.|0,29
Noem een meetinstrument.|26,27,32,41,@meetinstrumenten
Noem een eenheid waarmee je iets kunt meten.|1,2,28
Noem een vorm van energie.|@energie
Noem een energiebron.|30,31,@energiebronnen
Noem een materiaal dat elektriciteit kan geleiden.|7,@geleiders
Noem een onderdeel van een elektrisch apparaat.|33-35,38
Noem iets dat werkt op elektriciteit.|33-35,38
Noem een soort batterij of accu.|@batterijen
Noem een manier om elektriciteit op te wekken.|30,31
Noem een scheikundig element.|3-7
Noem een metaal.|4,5,7,@metalen
Noem een ingrediënt dat je in de keuken kunt vinden.|E9-27,E39,@keukenStoffen
Noem iets dat gasvormig kan zijn.|3,@gassen
Noem iets dat vloeibaar kan zijn.|@vloeistoffen
Noem een verandering van temperatuur.|@temperatuur
Noem iets dat warmte produceert.|30,31,@warmte
Noem een soort licht.|@licht
Noem iets dat geluid kan maken.|M0-9,M40-42,M44-46
Noem een natuurkracht.|29
Noem een planeet of sterrenkundige term.|27,R0-29
Noem iets dat bij een computer hoort.|35-40,K13-23
Noem een programmeertaal.|36
Noem iets dat je bij een proefje gebruikt.|32,@proefjes
Noem iets dat in een laboratorium staat.|26,32,@lab
Noem een soort steen of mineraal.|18-22,24
Noem een weersverschijnsel.|42,N34-39,@weer
Noem iets dat op een weerkaart kan staan.|42,N34-37,N39
Noem iets dat je over de aarde kunt onderzoeken.|43-46,N17-25
Noem een bekende wetenschapper.|@wetenschappers
Noem een ontdekking of uitvinding uit de wetenschap.|27,36-40
Noem een tak van wetenschap.|22-24
Noem iets dat met ruimteonderzoek te maken heeft.|27,R0-49
Noem een vitamine of mineraal.|20,21
Noem iets dat kan bewegen.|33,@bewegen
Noem een soort grafiek.|47,K46
Noem iets dat met wiskunde te maken heeft.|47,48,K40-46
Noem iets dat met het internet te maken heeft.|39,40,K14-16,K18-21,K38
Noem iets dat met robots te maken heeft.|33-40
Noem een onderwerp dat je bij biologie leert.|14-22
# Eten
Noem iets wat je kunt eten.|0-39,46-49,@basisEten
Noem een fruitsoort.|17-20,@fruit
Noem een groente.|12-16,@groente
Noem iets dat je op een pizza kunt doen.|12-16,23,25-29,47,@pizzaToppings
Noem iets wat je op brood kunt doen.|25-27,@broodbeleg
Noem iets dat je als ontbijt kunt eten.|3-6,22,39,43,44,46,49,@ontbijt
Noem iets dat je als lunch kunt eten.|0-8,36,37,46,47
Noem iets dat je als avondeten kunt eten.|0,1,6-8,28-37,47
Noem iets dat je als tussendoortje eet.|2,3,20,21,38,39,49,@snacks
Noem een dessert.|2,3,19,20,38,49
Noem een soort ijs.|2,38
Noem een soort snoep.|@snoep
Noem een soort koekje.|@koekjes
Noem een soort taart.|49
Noem een gerecht met aardappelen.|@aardappelGerechten
Noem een gerecht met rijst.|6,@rijstGerechten
Noem een gerecht met pasta of noedels.|7,@pastaGerechten
Noem een gerecht uit Italië.|0-2
Noem een gerecht uit Azië.|7,31,32,34,35
Noem een gerecht uit Nederland.|36
Noem iets dat je bij de bakker koopt.|3-5,49,@bakker
Noem iets dat je bij de groenteboer koopt.|12-20,@fruit,@groente
Noem iets dat in de supermarkt ligt.|0-39,43-49,@basisEten,@drank
Noem een soort brood.|4,5,37,@brood
Noem een soort kaas.|25-27
Noem een soort vis om te eten.|28,29
Noem een soort vlees of vleesvervanger.|29,48
Noem een kruid dat je in de keuken gebruikt.|23,24
Noem een saus.|39,47,@sauzen
Noem iets wat pittig kan smaken.|16,23,24,34,35,47
Noem iets dat zoet smaakt.|2,3,17-21,38,39,49
Noem iets wat zuur kan smaken.|17,18,20,24
Noem een soort noot of zaad.|21-24
Noem een peulvrucht.|9,10,48
Noem een ingrediënt voor soep.|8,12-16,23,24,47
Noem een drankje zonder alcohol.|43-45,@drank
Noem een soort frisdrank.|45,@frisdrank
Noem een koffiedrank.|44,@koffie
Noem een theesoort.|43
Noem een soort sap.|@sap
Noem iets wat je in een salade kunt doen.|12-16,20,21,23,29,@salade
Noem iets wat je kunt bakken in een pan.|29,37,@bakken
Noem iets dat op de barbecue kan.|16,28,29,@bbq
Noem iets dat je in een lunchbox stopt.|3,4,20,21,37
Noem een gerecht dat je warm eet.|1,6-8,33,35,37
Noem een gerecht dat je koud kunt eten.|2,3,31,37,38
Noem iets dat je bij een feest kunt serveren.|1-3,20,21,29,31,37-39,49
Noem een ingrediënt dat van planten komt.|9,10,12-24,48
Noem iets wat in een restaurant op de kaart kan staan.|1-8,31-39,43-45,49
Noem een soort eten dat je met je handen kunt pakken.|1,3-5,20,21,31,37,49,@fingerfood
# Natuur
Noem iets dat in de natuur groeit.|0-16,23,@planten
Noem een boom.|0-2,11,@bomen
Noem een bloem.|7-9,@bloemen
Noem een plant in een tuin.|0-2,7-10,23
Noem een plant in een bos.|0,1,5-7,11,12,14,16
Noem een plant die je in Nederland kunt zien.|0,1,3,5,6,8,9,12-14,@nlPlanten
Noem een plant die in een huis kan staan.|7,@kamerplanten
Noem een boom met eetbare vruchten.|2
Noem een plant die in de lente bloeit.|@lenteBloemen
Noem een plant die in de zomer bloeit.|8,@zomerBloemen
Noem iets met bladeren.|0-3,5-14
Noem iets dat van hout gemaakt kan worden.|0-2,11,49
Noem een paddenstoel.|15,E11,@paddenstoelen
Noem een soort gras of bodembedekker.|5,6,12,16
Noem een plek waar veel bomen staan.|29
Noem een plek waar veel water is.|31-33,38,40,42
Noem iets dat in een bos op de grond ligt.|5,6,12,15,17,18,19
Noem een steensoort.|18-25
Noem een mineraal.|21,22,24
Noem iets dat uit de aarde wordt gehaald.|17-22,24
Noem een natuurgebied in Nederland.|26
Noem een bekend natuurgebied in de wereld.|27,28,A18
Noem een soort landschap.|29-33,38,40,42,43,@landschappen
Noem een plek waar dieren leven.|26-33,38,40,42
Noem iets dat je op het strand vindt.|@strandNatuur
Noem iets dat je aan een rivier ziet.|31,33,38,42,43
Noem een soort weer.|34-37,39,@weer
Noem iets dat uit de lucht kan vallen.|39
Noem iets dat bij onweer hoort.|35
Noem een soort wolk.|37,@wolken
Noem een natuurverschijnsel met water.|@waterVerschijnselen
Noem een natuurverschijnsel met ijs of sneeuw.|34
Noem een natuurverschijnsel met wind.|36
Noem een natuurverschijnsel met licht.|47
Noem een natuurramp.|@rampen
Noem een plek met bergen.|A12,A13,A48
Noem een plek waar het droog is.|A15
Noem iets dat je in een woestijn kunt vinden.|10
Noem een plant met doornen.|23
Noem iets wat in een moestuin kan groeien.|2,8,14,E12-16
Noem een dier dat je in de Nederlandse natuur ziet.|44,D35,@nlDieren
Noem een insect dat bloemen bezoekt.|D16,D18,D39
Noem een vrucht die aan een boom groeit.|E18
Noem iets wat onder de grond groeit.|E14,E15
Noem een boom die zijn bladeren verliest.|0
Noem iets dat je in een natuurdocumentaire kunt zien.|0-49,D0-49,@planten
Noem een bekend natuurwonder.|27,28,34,41,43,47,A37
Noem iets dat in een vijver kan leven.|3,D21,D22,D36
Noem een soort watergebied.|31-33,38,40,42
Noem iets dat je tijdens een boswandeling kunt tegenkomen.|0,1,5,6,8,12-15,44,45,@bosWandeling
# Cultuur
Noem een beroemd schilderij.|6,@schilderijen
Noem een beroemde schilder.|0,1
Noem een kunstvorm.|2-4,11,47,@kunstvormen
Noem iets dat je in een museum kunt zien.|2,4,6,7
Noem een bekend museum.|8,9
Noem een soort beeldhouwwerk.|7
Noem een kleur die een schilder gebruikt.|@kleuren
Noem iets waarmee je een schilderij maakt.|11,@schilderSpullen
Noem een beroemde kunstenaar.|0,1,5,44
Noem een bekende kunststijl.|10,43
Noem een dansstijl.|12-14,42,49
Noem een dans die je op een feestje kunt doen.|12-14,42
Noem een dans die je in een film kunt zien.|12-14,42,49
Noem iets dat bij ballet hoort.|@ballet
Noem een beroemd theaterstuk.|18,19
Noem een bekende schrijver.|17,25,26,31
Noem een bekend boek.|20-24,32,@boeken
Noem een boek dat op school gelezen kan worden.|20-24,@boeken
Noem een beroemd sprookje.|32,@sprookjes
Noem een sprookjesfiguur.|@sprookjesfiguren
Noem een personage uit een boek.|27-30,@boekPersonages
Noem een beroemde mythische figuur.|27-30
Noem een legendarisch wezen.|27-30,@mythischeWezens
Noem een bekende film.|37,@films
Noem een animatiefilm.|37,@animatiefilms
Noem een film met dieren.|@dierenFilms
Noem een film die kinderen kunnen kijken.|37
Noem een beroemde filmregisseur.|35
Noem een filmgenre.|34
Noem een acteur of actrice.|@acteurs
Noem een bekende filmprijs.|38
Noem een filmfestival.|39
Noem een beroemd kunstwerk.|6,7,@schilderijen
Noem een beroemd standbeeld.|7
Noem een bekende architect.|44
Noem een gebouw met bijzondere architectuur.|46,@beroemdeGebouwen
Noem iets wat je in een theater ziet.|16,45,49
Noem een cultureel feest.|48
Noem een feestdag die mensen vieren.|48,@feestdagen
Noem een traditioneel dans- of muziekfestival.|@cultureleFestivals
Noem een traditionele kunstvorm.|2-4,11,47
Noem iets dat bij carnaval hoort.|48
Noem een beroemd tekenfilmfiguur.|@tekenfilmfiguren
Noem een bekende stripfiguur.|@stripfiguren
Noem een plek waar je naar kunst kunt kijken.|8,9
Noem een bekende bibliotheek.|46
Noem iets wat in een boek kan staan.|18-24,27-32
Noem een vorm van optreden.|12-16,33,42,49
Noem een cultureel evenement.|38,39,48
Noem iets dat mensen als hobby kunstzinnig doen.|2-4,11-16,47
# Vervoer
Noem een vervoermiddel.|0,2,7,9-13,18-23,25,30-33,42,43,45,47-49,@voertuigen
Noem iets waarmee je naar school kunt reizen.|0,7,11-13,31-33,43,49,@naarSchool
Noem iets waarmee je op vakantie kunt gaan.|0,2,7,11-13,18-21,23,30-33,42,43
Noem een vervoermiddel met wielen.|0,2,7,9-13,47-49
Noem een vervoermiddel zonder wielen.|18-22,25,30,33
Noem iets dat op de weg rijdt.|0,2,7,9-11,47-49
Noem een vervoermiddel op het water.|18-22,30
Noem iets dat kan vliegen.|23,25
Noem een openbaar vervoermiddel.|11-13,33,43,@ov
Noem een soort auto.|0,2,47
Noem een automerk.|1
Noem een automodel.|2
Noem een soort fiets.|7,@fietsen
Noem iets wat op een fiets zit.|8
Noem een soort bus.|11
Noem een soort trein.|12,13
Noem een plek waar een trein stopt.|@stations
Noem een vervoermiddel dat op rails rijdt.|12,13
Noem een type vliegtuig.|23,@vliegtuigen
Noem een luchtvaartmaatschappij.|26
Noem een bekende luchthaven.|27
Noem een soort boot.|18-22,30
Noem een bekend schip.|18-22,30,G39
Noem een havenstad.|28
Noem een kanaal waar schepen varen.|29
Noem een beroemde brug.|@bruggen
Noem iets dat je langs de weg ziet.|4,35-37
Noem een verkeersbord.|35
Noem een soort weg.|36,@wegen
Noem iets dat een automobilist gebruikt.|5,6,38,39
Noem iets onder de motorkap van een auto.|40
Noem een autobrandstof of energiebron.|39
Noem iets wat een auto veilig maakt.|6,38
Noem iets dat je in een auto kunt vinden.|6,38-40,@inAuto
Noem iets wat een buschauffeur of treinmachinist gebruikt.|@chauffeur
Noem een voertuig voor hulpdiensten.|45,@hulpdiensten
Noem een vrachtvoertuig.|10,18,48
Noem iets waarmee je een zware lading vervoert.|10,18,41,46,48
Noem een voertuig uit het verleden.|2,20,42,G39
Noem iets dat elektrisch kan rijden.|13,31
Noem iets wat je moet parkeren.|0,7,9-11,47-49
Noem een vervoermiddel met twee wielen.|7,9,49
Noem een plek waar je vervoer kunt vinden.|27,28
Noem een bekend treinstation.|@stations
Noem een voorwerp dat je meeneemt op reis.|@reisSpullen
Noem een vervoermiddel dat door mensen zelf wordt aangedreven.|32
Noem een type aanhanger.|48
Noem iets wat bij een luchthaven hoort.|23,25,44
Noem iets wat in een garage kan staan.|0,6-10,38-40,47-49
Noem een vervoermiddel dat je op straat kunt tegenkomen.|0,7,9-11,49
# Algemene kennis
Noem een beroep.|34,39,@beroepen
Noem iets dat je op school kunt vinden.|31,32,35,@school
Noem een schoolvak.|31,@schoolvakken
Noem iets dat je in een klaslokaal ziet.|35,@klaslokaal
Noem iets wat in een rugzak kan zitten.|32,35,@rugzak
Noem een taal.|0,1
Noem een land.|@landen
Noem een kleur.|@kleuren
Noem een maand van het jaar.|7
Noem een dag van de week.|8
Noem een feestdag.|9,10,@feestdagen
Noem een woord dat met de computer te maken heeft.|13-23,38
Noem een apparaat dat in huis kan staan.|37
Noem iets dat je op internet kunt doen.|21,49,@internetDingen
Noem een bekende website of app.|15,16,@apps
Noem een spel dat je met vrienden kunt spelen.|24,25,29,30,@spellen
Noem een bordspel.|24
Noem een kaartspel.|25
Noem een puzzel.|29,30
Noem iets dat bij schaken hoort.|26,@schaken
Noem een getal onder de honderd.|44,@getallen
Noem een wiskundig symbool.|40,45
Noem een meetkundige vorm.|41-43
Noem een grafiek die je op school kunt tegenkomen.|46
Noem iets dat je in een keuken kunt vinden.|37,E9-27,@keuken
Noem iets dat in een badkamer staat.|@badkamer
Noem een meubel.|@meubels
Noem iets dat je in een woonkamer ziet.|@woonkamer
Noem een voorwerp dat je dagelijks gebruikt.|20,22,37
Noem een voorwerp dat op batterijen werkt.|22,@batterijSpullen
Noem een communicatiemiddel.|@communicatie
Noem een soort telefoonfunctie.|21,49
Noem een type computerbestand.|17,@bestanden
Noem een onderdeel van een computer.|13,22
Noem een bekend besturingssysteem.|14
Noem een internetbrowser.|15
Noem een zoekmachine.|16
Noem een voorwerp om mee te schrijven.|@schrijven
Noem een boeksoort.|@boeken
Noem een plaats waar veel mensen komen.|33,35,@publiekePlekken
Noem een plek waar je iets kunt kopen.|@winkels
Noem een sport of vrijetijdshobby.|24,25,29,30
Noem een dier dat iedereen kent.|D0-49
Noem iets dat je tijdens een picknick kunt eten.|@eten
Noem een vervoermiddel dat je in Nederland ziet.|@vervoer
Noem iets dat je op vakantie meeneemt.|@vakantieSpullen
Noem iets dat je in een winkel kunt kopen.|13,20,22,24,25,28,29,32,36,37
Noem een manier om een bericht te versturen.|49
Noem een beroemd gebouw.|12,C8,C9,C46
Noem een uitvinding die het leven makkelijker maakt.|13-16,20,22,23,37,38,@uitvindingen`;
  const BANKEN = `water|Vis;Haai;Dolfijn;Walvis;Orka;Zeehond;Zeeleeuw;Pinguïn;Kwal;Octopus;Inktvis;Krab;Kreeft;Garnaal;Mossel;Oester;Krokodil;Alligator;Nijlpaard;Otter;Bever;Zeeschildpad;Zeester;Zee-egel;Zeekomkommer;Zeepaardje;Zeeslang;Murene;Zeeduivel;Goudvis;Koi;Forel;Snoek;Piranha;Zalm;Karpers;Schaaldier;Kikker;Watersalamander;Eend;Gans;Zwaan;Flamingo;Fuut;Meerkoet;Aalscholver;Pelikaan;Albatros;Zeehond;Manatee;Doegong;Walrus
zee|Haring;Kabeljauw;Tonijn;Zalm;Zwaardvis;Makreel;Sardine;Ansjovis;Garnaal;Kreeft;Krab;Mossel;Oester;Octopus;Inktvis;Zeekat;Kwal;Zee-egel;Zeester;Zeeanemoon;Zeehond;Zeeleeuw;Walrus;Dolfijn;Walvis;Orka;Haai;Pijlstaartrog;Manta;Zeepaardje;Zeekomkommer;Murene;Clownvis;Koraalvis
vliegen|Mus;Merel;Duif;Kraai;Ekster;Kauw;Spreeuw;Roodborstje;Vink;Koolmees;Pimpelmees;Zwaluw;Meeuw;Arend;Valk;Buizerd;Uil;Papegaai;Toekan;Kolibrie;Flamingo;Reiger;Ooievaar;Lepelaar;Gans;Eend;Zwaan;Kraanvogel;Vleermuis;Bij;Hommel;Wesp;Vlinder;Nachtvlinder;Libel;Vlieg;Mug;Mier met vleugels;Sprinkhaan;Lieveheersbeestje
huisdieren|Hond;Kat;Konijn;Cavia;Hamster;Muis;Rat;Gerbil;Chinchilla;Fret;Papegaai;Parkiet;Kanarie;Vink;Goudvis;Koi;Guppy;Neontetra;Molly;Platy;Betta;Schildpad;Landschildpad;Gekko;Baardagame;Leguaan;Korenslang;Python;Kikker;Axolotl;Tarantula;Zebravink;Diamantduif;Dwergkonijn;Agapornis;Valkparkiet;Chinese dwerghamster;Russische dwerghamster
boerderij|Koe;Kalf;Stier;Paard;Pony;Veulen;Varken;Big;Schaap;Lam;Geit;Bok;Kip;Haan;Kuiken;Eend;Gans;Kalkoen;Konijn;Hond;Kat;Ezel;Muildier;Alpaca;Lama;Hert;Honingbij;Duif;Fazant;Pauw;Goudfazant;Buffel;Ossen;Struisvogel;Emoe
insecteneters|Egel;Miereneter;Vleermuis;Mol;Spitsmuis;Kikker;Pad;Salamander;Hagedis;Kameleon;Gekko;Spin;Schorpioen;Bidsprinkhaan;Libel;Mees;Roodborstje;Zwaluw;Specht;Merel;Mus;Spreeuw;Mierenleeuw;Toekan;Pangolin;Aardvarken;Neushoornvogel
langzaam|Luiaard;Schildpad;Landschildpad;Slak;Naaktslak;Zeester;Zee-egel;Zeekomkommer;Koala;Kameleon;Regenworm;Zeeschildpad;Loris;Rups;Mossel;Oester;Koraalpoliep;Kwal;Panda;Nijlpaard
voedsel|Koe;Varken;Kip;Schaap;Geit;Eend;Kalkoen;Konijn;Vis;Zalm;Tonijn;Kabeljauw;Haring;Forel;Paling;Garnaal;Kreeft;Krab;Mossel;Oester;Struisvogel;Buffel;Hert;Kwartel;Gans;Parelhoen;Alpaca;Lama;Rivierkreeft;Meerval
strepen|Zebra;Tijger;Okapi;Wasbeer;Stinkdier;Nemo;Clownvis;Gestreepte hyena;Tijgerhaai;Gestreepte eekhoorn;Grondeekhoorn;Tijgerpython;Koraalslang;Ringstaartmaki;Bengaalse tijger;Siberische tijger;Beverrat;Zebraduif;Gestreepte mangoest;Gestreepte marlijn
vlekken|Luipaard;Cheetah;Jachtluipaard;Jaguar;Giraf;Giraffe;Dalmatier;Lieveheersbeestje;Sneeuwluipaard;Hyena;Gevlekte hyena;Pauw;Zalmforel;Koe;Aardbei-kikker;Koraalduivel;Roodwangschildpad;Salamander;Gevlekte adelaarsrog;Gevlekte zeehond;Appaloosa;Ocelot;Serval;Gevlekte buidelmarter
afrika|Leeuw;Olifant;Giraf;Giraffe;Zebra;Nijlpaard;Neushoorn;Krokodil;Hyena;Gorilla;Chimpansee;Baviaan;Aap;Luipaard;Jachtluipaard;Cheetah;Struisvogel;Flamingo;Afrikaanse buffel;Wrattenzwijn;Gnoe;Impala;Gazelle;Gemsbok;Stokstaartje;Miereneter;Pangolin;Okapi;Afrikaanse wilde hond;Nijlvaraan;Kameleon;Aardvarken;Fennek;Dromedaris;Kudu;Koedoe;Maraboe
bos|Eekhoorn;Hert;Ree;Vos;Wolf;Das;Wild zwijn;Beer;Uil;Specht;Mees;Merel;Egeltje;Egel;Muis;Konijn;Haas;Boommarter;Wasbeer;Roodborstje;Kever;Honingbij;Mier;Vlinder;Vleermuis;Kikker;Salamander;Ringslang;Sperwer;Buizerd;Eland;Lynx;Everzwijn
jungle|Aap;Gorilla;Chimpansee;Orang-oetan;Jaguar;Luipaard;Tijger;Luiaard;Toekan;Papegaai;Ara;Slang;Boa;Anaconda;Krokodil;Kameleon;Boomkikker;Gifkikker;Miereneter;Tapir;Okapi;Kolibrie;Tarantula;Leguaan;Piranha;Ocelot;Gibbon;Bonobo
vierpoten|Hond;Kat;Paard;Koe;Varken;Schaap;Geit;Konijn;Hert;Ree;Beer;Wolf;Vos;Leeuw;Tijger;Luipaard;Giraf;Giraffe;Olifant;Neushoorn;Nijlpaard;Zebra;Kangoeroe;Koala;Schildpad;Krokodil;Salamander;Hagedis;Egel;Eekhoorn;Bever;Das;Wasbeer;Muis;Rat
koud|IJsbeer;Poolvos;Poolhaas;Pinguïn;Walrus;Zeehond;Orka;Beluga;Narwal;Sneeuwuil;Sneeuwluipaard;Rendier;Eland;Muskusos;Poolwolf;Lemming;Hermelijn;Witte walvis;Keizerspinguïn;Koningspinguïn;Papegaaiduiker
nacht|Uil;Vleermuis;Egel;Das;Vos;Steenmarter;Boommarter;Muis;Rat;Nachtvlinder;Mot;Krekel;Kikker;Pad;Schorpioen;Gekko;Wasbeer;Nachtegaal;Kat;Kerkuil;Nachtzwaluw;Hamster
langennek|Giraf;Giraffe;Struisvogel;Zwaan;Flamingo;Reiger;Ooievaar;Kraanvogel;Alpaca;Lama;Brachiosaurus;Diplodocus;Brontosaurus;Apatosaurus;Dromedaris;Kameel
winterslaap|Egel;Beer;Marmot;Vleermuis;Hazelmuis;Zevenslaper;Eikelmuis;Hamster;Grondeekhoorn;Schildpad;Kikker;Pad;Eekhoorn
kleurwissel|Kameleon;Octopus;Inktvis;Zeekat;Pijlinktvis;Anolis;Boomkikker;Platvis;Tong;Schol;Reuzenkameleon;Pijlstaartrog
europa|Nederland;België;Luxemburg;Duitsland;Frankrijk;Spanje;Portugal;Italië;Zwitserland;Oostenrijk;Denemarken;Zweden;Noorwegen;Finland;IJsland;Ierland;Verenigd Koninkrijk;Polen;Tsjechië;Slowakije;Hongarije;Roemenië;Bulgarije;Griekenland;Kroatië;Slovenië;Servië;Montenegro;Albanië;Noord-Macedonië;Bosnië en Herzegovina;Kosovo;Malta;Cyprus;Estland;Letland;Litouwen;Oekraïne;Moldavië;Belarus;San Marino;Andorra;Monaco;Liechtenstein;Vaticaanstad
azieLand|China;India;Japan;Zuid-Korea;Noord-Korea;Indonesië;Thailand;Vietnam;Cambodja;Laos;Myanmar;Maleisië;Singapore;Filipijnen;Brunei;Oost-Timor;Nepal;Bhutan;Bangladesh;Pakistan;Sri Lanka;Malediven;Afghanistan;Iran;Irak;Saoedi-Arabië;Jemen;Oman;Qatar;Koeweit;Bahrein;Verenigde Arabische Emiraten;Israël;Jordanië;Libanon;Syrië;Turkije;Georgië;Armenië;Azerbeidzjan;Mongolië;Kazachstan;Oezbekistan;Kirgizië;Tadzjikistan;Turkmenistan
afrikaLand|Marokko;Algerije;Tunesië;Libië;Egypte;Soedan;Zuid-Soedan;Ethiopië;Eritrea;Djibouti;Somalië;Kenia;Oeganda;Tanzania;Rwanda;Burundi;Democratische Republiek Congo;Congo-Brazzaville;Gabon;Kameroen;Nigeria;Ghana;Ivoorkust;Senegal;Mali;Niger;Tsjaad;Centraal-Afrikaanse Republiek;Angola;Namibië;Botswana;Zuid-Afrika;Lesotho;Eswatini;Zimbabwe;Zambia;Mozambique;Malawi;Madagaskar;Mauritius;Seychellen;Kaapverdië;Gambia;Guinee;Liberia;Sierra Leone;Benin;Togo;Burkina Faso;Mauritanië;Guinee-Bissau;Equatoriaal-Guinea;Comoren;São Tomé en Principe
amerikaLand|Canada;Verenigde Staten;Mexico;Guatemala;Honduras;El Salvador;Nicaragua;Costa Rica;Panama;Cuba;Jamaica;Haïti;Dominicaanse Republiek;Bahama's;Barbados;Belize;Trinidad en Tobago;Grenada;Antigua en Barbuda;Saint Lucia;Dominica;Saint Kitts en Nevis;Saint Vincent en de Grenadines;Colombia;Venezuela;Guyana;Suriname;Ecuador;Peru;Bolivia;Brazilië;Paraguay;Uruguay;Argentinië;Chili
nederlandSteden|Amsterdam;Rotterdam;Den Haag;Utrecht;Eindhoven;Groningen;Tilburg;Almere;Breda;Nijmegen;Enschede;Apeldoorn;Haarlem;Arnhem;Amersfoort;Zaanstad;Haarlemmermeer;Den Bosch;Zwolle;Leiden;Leeuwarden;Maastricht;Delft;Deventer;Alkmaar;Hilversum;Heerlen;Venlo;Emmen;Assen;Lelystad;Middelburg;Vlissingen;Dordrecht;Gouda;Hoorn;Hengelo;Roosendaal;Ede;Helmond;Zoetermeer;Amstelveen;Veenendaal;Purmerend;Schiedam;Leidschendam;Katwijk;Bergen op Zoom;Harderwijk;Zutphen
belgieSteden|Brussel;Antwerpen;Gent;Brugge;Leuven;Mechelen;Hasselt;Kortrijk;Aalst;Oostende;Roeselare;Sint-Niklaas;Turnhout;Genk;Luik;Namen;Charleroi;Bergen;Doornik;Verviers;Dinant;Spa;Arlon;Ieper;Dendermonde;Knokke;Blankenberge
frankrijkSteden|Parijs;Marseille;Lyon;Toulouse;Nice;Nantes;Montpellier;Straatsburg;Bordeaux;Lille;Rennes;Reims;Le Havre;Dijon;Grenoble;Brest;Toulon;Cannes;Antibes;Avignon;Arles;Nîmes;Rouen;Orléans;Tours;Nancy;Metz;Amiens;Limoges;Biarritz;Bayonne;Annecy;Chamonix;Saint-Étienne;Colmar;Perpignan;Aix-en-Provence;Saint-Malo;Le Mans
wereldSteden|New York;Los Angeles;San Francisco;Chicago;Boston;Miami;Washington D.C.;Las Vegas;Mexico-Stad;Rio de Janeiro;São Paulo;Buenos Aires;Lima;Santiago;Bogotá;Londen;Parijs;Berlijn;Rome;Milaan;Madrid;Barcelona;Lissabon;Amsterdam;Brussel;Wenen;Praag;Boedapest;Athene;Istanbul;Moskou;Dubai;Caïro;Kaapstad;Tokio;Seoul;Beijing;Shanghai;Hongkong;Singapore;Bangkok;Mumbai;Delhi;Sydney;Melbourne;Auckland;Toronto;Vancouver
wereldHoofdsteden|Tokio;Beijing;Seoul;Bangkok;Hanoi;New Delhi;Jakarta;Manilla;Singapore;Kuala Lumpur;Riyad;Teheran;Bagdad;Canberra;Wellington;Ottawa;Washington D.C.;Mexico-Stad;Brasília;Buenos Aires;Lima;Bogotá;Santiago;Caïro;Nairobi;Pretoria;Rabat;Tunis;Algiers;Abuja;Accra;Addis Abeba;Dakar
wereldRivieren|Nijl;Amazone;Mississippi;Missouri;Yangtze;Gele Rivier;Mekong;Ganges;Indus;Donau;Rijn;Wolga;Niger;Congo;Zambezi;Orinoco;Paraná;Eufraat;Tigris;Murray;Darling;Mackenzie;Yukon;Colorado;Rio Grande
meren|IJsselmeer;Markermeer;Gardermeer;Veluwemeer;Lauwersmeer;Tjeukemeer;Sneekermeer;Bodenmeer;Genfermeer;Comomeer;Gardameer;Lago Maggiore;Balatonmeer;Baikalmeer;Titicacameer;Victoriameer;Tanganyikameer;Malawimeer;Tsjaadmeer;Great Lakes;Lake Superior;Michiganmeer;Huronmeer;Eriemeer;Ontariomeer
zeeenn|Noordzee;Middellandse Zee;Oostzee;Zwarte Zee;Rode Zee;Arabische Zee;Koraalzee;Caribische Zee;Waddenzee;Adriatische Zee;Egeïsche Zee;Japanse Zee;Kaspische Zee;Barentszzee;Ierse Zee;Atlantische Oceaan;Stille Oceaan;Indische Oceaan;Noordelijke IJszee;Zuidelijke Oceaan
bergen|Mount Everest;K2;Kilimanjaro;Mont Blanc;Matterhorn;Ben Nevis;Fuji;Etna;Vesuvius;Denali;Aconcagua;Puncak Jaya;Olympus;Elbroes;Dufourspitze;Annapurna;Eiger;Jungfrau;Mount Rainier;Mount Whitney
vulkanen|Etna;Vesuvius;Stromboli;Vulcano;Fuji;Krakatau;Tambora;Merapi;Pinatubo;Mauna Loa;Kilauea;Mount St. Helens;Eyjafjallajökull;Hekla;Fagradalsfjall;Cotopaxi;Popocatépetl;Nevado del Ruiz
woestijnen|Sahara;Kalahari;Namib;Gobi;Atacama;Mojave;Sonorawoestijn;Arabische woestijn;Tharwoestijn;Karakum;Kyzylkum;Taklamakan;Patagonische woestijn;Great Victoria Desert;Great Sandy Desert
poolPlekken|Groenland;Spitsbergen;Svalbard;Noordpool;Lapland;Tromsø;Longyearbyen;Moermansk;IJsland;Barentszburg;Nova Zembla;Noord-Canada;Alaska;Noord-Siberië;Frans Jozefland;Baffineiland;Ellesmere-eiland;Lofoten;Kiruna;Rovaniemi
voetbalLanden|Nederland;België;Duitsland;Frankrijk;Engeland;Spanje;Italië;Portugal;Schotland;Turkije;Griekenland;Brazilië;Argentinië;Mexico;Verenigde Staten;Japan;Zuid-Korea;Saudi-Arabië;Australië;Oostenrijk;Zwitserland;Polen;Denemarken;Noorwegen;Zweden
voetballers|Lionel Messi;Cristiano Ronaldo;Kylian Mbappé;Erling Haaland;Neymar;Mohamed Salah;Kevin De Bruyne;Virgil van Dijk;Frenkie de Jong;Memphis Depay;Arjen Robben;Robin van Persie;Wesley Sneijder;Johan Cruijff;Marco van Basten;Dennis Bergkamp;Ruud Gullit;Ronaldo Nazário;Ronaldinho;Pelé;Diego Maradona;Zinedine Zidane;David Beckham;Wayne Rooney;Thierry Henry;Andrés Iniesta;Xavi;Luka Modrić;Karim Benzema;Robert Lewandowski;Marta;Alexia Putellas;Vivianne Miedema;Lieke Martens;Sherida Spitse;Sarina Wiegman;Jude Bellingham;Harry Kane;Gareth Bale;Sergio Ramos;Zlatan Ibrahimović
sporters|Usain Bolt;Michael Phelps;Simone Biles;Serena Williams;Roger Federer;Rafael Nadal;Novak Djokovic;Lewis Hamilton;Max Verstappen;Michael Schumacher;Tiger Woods;Tom Brady;LeBron James;Michael Jordan;Kobe Bryant;Stephen Curry;Anna van der Breggen;Mathieu van der Poel;Max Verstappen;Femke Bol;Sifan Hassan;Ireen Wüst;Sven Kramer;Epke Zonderland;Ranomi Kromowidjojo;Dafne Schippers;Iris Slappendel
bekendeSporten|Voetbal;Basketbal;Tennis;Wielrennen;Atletiek;Zwemmen;Volleybal;Handbal;Hockey;IJshockey;Rugby;Cricket;Honkbal;Softbal;American football;Badminton;Tafeltennis;Golf;Formule 1;Skiën;Schaatsen;Snowboarden;Turnen;Boksen;Judo;Karate;Taekwondo;Worstelen;Klimmen;Roeien;Zeilen;Kanoën;Triatlon;Darts;Biljarten;Padel;Squash;MMA;Kickboksen;Paardrijden;Motocross;BMX;Skateboarden
balSporten|Voetbal;Basketbal;Volleybal;Handbal;Waterpolo;Tennis;Tafeltennis;Golf;Hockey;Korfbal;Rugby;Honkbal;Softbal;Cricket;Squash;Padel;American football;Dodgeball;Trefbal;Beachvolleybal;Zaalvoetbal;Futsal;Lacrosse;Floorball;Netbal;Petanque
waterSporten|Zwemmen;Waterpolo;Duiken;Snorkelen;Surfen;Windsurfen;Kitesurfen;Zeilen;Roeien;Kanoën;Kajakken;Raften;SUP;Wakeboarden;Waterskiën;Schoonspringen;Vrijduiken;Synchroonzwemmen;Openwaterzwemmen;Triatlon;Bodyboarden
winterSporten|Skiën;Snowboarden;Schaatsen;Shorttrack;Kunstschaatsen;IJshockey;Curling;Bobsleeën;Rodelen;Skeleton;Langlaufen;Schansspringen;Biathlon;Hondensleeën;Sneeuwschoenwandelen;Freeriden
voetbalclubs|Ajax;PSV;Feyenoord;AZ;FC Utrecht;FC Twente;SC Heerenveen;FC Groningen;Real Madrid;FC Barcelona;Atlético Madrid;Manchester United;Manchester City;Liverpool;Arsenal;Chelsea;Tottenham Hotspur;Bayern München;Borussia Dortmund;Juventus;AC Milan;Inter Milan;Napoli;Paris Saint-Germain;Olympique Marseille;Benfica;FC Porto;Sporting CP;Celtic;Rangers;Boca Juniors;River Plate;Flamengo;Santos;LA Galaxy;Inter Miami;Galatasaray;Fenerbahçe;Besiktas
competities|Eredivisie;Champions League;Europa League;Premier League;La Liga;Serie A;Bundesliga;Ligue 1;WK voetbal;EK voetbal;Olympische Spelen;Tour de France;Giro d'Italia;Vuelta a España;Wimbledon;Roland Garros;US Open;Australian Open;NBA;NFL;Super Bowl;World Series;Stanley Cup;Formule 1;MotoGP;Dakar Rally
sportSpullen|Bal;Voetbal;Basketbal;Tennisbal;Racket;Tennisracket;Badmintonracket;Stick;Hockeystick;Handschoenen;Bokshandschoenen;Schoenen;Sportschoenen;Helm;Scheenbeschermers;Doel;Net;Fluit;Stopwatch;Fiets;Ski's;Snowboard;Skateboard;Zwembril;Badmuts;Tafeltennisbatje;Honkbalknuppel;Golfclub;Golfbal;Dumbbell;Halters;Sportmat;Springtouw
sportPlekken|Sporthal;Voetbalveld;Gymzaal;Stadion;Zwembad;Tennisbaan;Basketbalveld;Atletiekbaan;Schaatsbaan;Skatepark;Golfbaan;Fitnessruimte;Sportschool;Crossfitbox;Boksring;Manege;Klimhal;Klimmuur;Wielerbaan;Hockeyveld;Rugbyveld;IJsbaan;Sportpark;Squashbaan
springenSport|Hoogspringen;Verspringen;Hink-stap-springen;Polsstokhoogspringen;Trampolinespringen;Turnen;Schansspringen;BMX;Skateboarden;Paardenspringen;Basketbal;Volleybal;Touwtjespringen;Freerunning
rennen|Hardlopen;Voetbal;Basketbal;Handbal;Hockey;Rugby;Tennis;Honkbal;Softbal;Atletiek;Triatlon;Veldlopen;Estafette;Sprinten;Marathon
strandSporten|Beachvolleybal;Beach soccer;Beach handball;Beach tennis;Footvolley;Ultimate frisbee;Beach rugby;Surfen;Kitesurfen;Bodyboarden;Strandzeilen;Strandvoetbal;Frisbee;Hardlopen;Zwemmen
scheidsrechterSport|Voetbal;Basketbal;Handbal;Hockey;Tennis;Rugby;Volleybal;IJshockey;Honkbal;Softbal;Cricket;Boksen;Judo;Karate;Taekwondo;Badminton;Tafeltennis;Waterpolo;Padel;Squash
nlArtiesten|Marco Borsato;Anouk;Davina Michelle;Maan;Snelle;Suzan & Freek;Racoon;BLØF;Kensington;Goldband;Froukje;S10;Joost Klein;Duncan Laurence;Douwe Bob;Ilse DeLange;Guus Meeuwis;André Hazes;André Hazes jr.;Jan Smit;Nick & Simon;Nielson;Roxy Dekker;Claude;Kris Kross Amsterdam;Martin Garrix;Tiësto;Armin van Buuren;Afrojack;Hardwell;Nicky Romero;Don Diablo;Sunnery James & Ryan Marciano;Ferry Corsten;Chef'Special;De Jeugd van Tegenwoordig;Johan;Krezip
rappers|Eminem;Drake;Kendrick Lamar;Travis Scott;Snoop Dogg;Dr. Dre;Jay-Z;Kanye West;50 Cent;Lil Wayne;Nicki Minaj;Cardi B;Missy Elliott;Tyler the Creator;J. Cole;Nas;Tupac;The Notorious B.I.G.;Ice Cube;Future;Central Cee;Stormzy;Dave;Post Malone;Boef;Lil Kleine;Ronnie Flex;Frenna;Broederliefde;Jonna Fraser;Ali B;Typhoon;Opgezwolle
popArtiesten|Taylor Swift;Ed Sheeran;Ariana Grande;Billie Eilish;Dua Lipa;Beyoncé;Rihanna;Lady Gaga;Bruno Mars;Justin Bieber;Harry Styles;Olivia Rodrigo;The Weeknd;Adele;Katy Perry;Shakira;Miley Cyrus;Sabrina Carpenter;Selena Gomez;Britney Spears;Madonna;Michael Jackson;Prince;Elton John;George Michael;Whitney Houston;Céline Dion;Coldplay;BTS;BLACKPINK;ABBA;The Beatles;Queen;Imagine Dragons
zangers|Taylor Swift;Ed Sheeran;Adele;Beyoncé;Rihanna;Billie Eilish;Dua Lipa;Bruno Mars;Justin Bieber;Harry Styles;The Weeknd;Shakira;Miley Cyrus;Olivia Rodrigo;Ariana Grande;Céline Dion;Whitney Houston;Elton John;Michael Jackson;Stevie Wonder;Freddie Mercury;John Lennon;Paul McCartney;Bob Marley;Anouk;Davina Michelle;Maan;S10;Claude
bands|The Beatles;Queen;Coldplay;ABBA;U2;Imagine Dragons;One Direction;BTS;BLACKPINK;The Rolling Stones;Metallica;Nirvana;Red Hot Chili Peppers;Green Day;Foo Fighters;Maroon 5;Linkin Park;Oasis;Arctic Monkeys;Muse;Radiohead;Kensington;BLØF;Racoon;Chef'Special;Krezip;De Jeugd van Tegenwoordig
amerikaanseArtiesten|Taylor Swift;Beyoncé;Bruno Mars;Billie Eilish;Ariana Grande;Olivia Rodrigo;Katy Perry;Lady Gaga;Miley Cyrus;Michael Jackson;Prince;Madonna;Whitney Houston;Elvis Presley;Eminem;Snoop Dogg;Kendrick Lamar;Jay-Z;Britney Spears;Justin Timberlake
britseArtiesten|Adele;Ed Sheeran;Harry Styles;Elton John;Dua Lipa;Coldplay;Queen;The Beatles;The Rolling Stones;Sam Smith;George Michael;David Bowie;Freddie Mercury;Amy Winehouse;Lewis Capaldi;Stormzy;One Direction;Little Mix;Pink Floyd;Oasis;Arctic Monkeys
liedjes|Happy Birthday;Imagine;Bohemian Rhapsody;Shape of You;Bad Romance;Shake It Off;Rolling in the Deep;Billie Jean;Thriller;Let It Be;Yesterday;We Will Rock You;We Are the Champions;Dancing Queen;Mamma Mia;Someone Like You;Perfect;Despacito;Baby Shark;Let It Go;Hakuna Matata;All I Want for Christmas Is You;Last Christmas;Blinding Lights;Uptown Funk;Flowers;Dance Monkey;Waka Waka;Gangnam Style;Poker Face;Viva la Vida;Yellow;Wonderwall;Smells Like Teen Spirit;Seven Nation Army;Hey Jude;Sweet Caroline;Can't Stop the Feeling!;Happy;I Will Survive
feestLiedjes|Dancing Queen;Macarena;YMCA;We Will Rock You;Sweet Caroline;Uptown Funk;Happy;Can't Stop the Feeling!;I Will Survive;Gangnam Style;Despacito;Cha Cha Slide;Cotton Eye Joe;Mamma Mia;Party Rock Anthem;Single Ladies;Shape of You;Billie Jean;Take on Me;Summer of '69;Freed From Desire
kerstLiedjes|Jingle Bells;Last Christmas;All I Want for Christmas Is You;Silent Night;Stille Nacht;O Holy Night;White Christmas;Let It Snow;Feliz Navidad;Santa Claus Is Coming to Town;Rudolph the Red-Nosed Reindeer;Rockin' Around the Christmas Tree;Driving Home for Christmas;Do They Know It's Christmas?;Winter Wonderland;The Christmas Song;Merry Christmas Everyone;Deck the Halls
sportLiedjes|We Are the Champions;We Will Rock You;Seven Nation Army;Sweet Caroline;Freed From Desire;Waka Waka;You'll Never Walk Alone;Eye of the Tiger;The Final Countdown;Three Lions;Shakira Waka Waka;Go West;Ole Ole Ole;Viva Hollandia;Het Wilhelmus;Europapa;I Gotta Feeling
muziekPrijzen|Grammy Award;MTV Video Music Award;Billboard Music Award;Brit Award;Edison;3FM Award;American Music Award;Eurovision Song Contest;Mobo Award;BET Award;Echo Award;Polar Music Prize;Latin Grammy;Juno Award
instrumenten|Gitaar;Piano;Drumstel;Viool;Fluit;Blokfluit;Dwarsfluit;Trompet;Saxofoon;Klarinet;Hobo;Cello;Contrabas;Harp;Ukelele;Banjo;Mandoline;Mondharmonica;Accordeon;Orgel;Keyboard;Synthesizer;Trombone;Tuba;Bongo;Conga;Djembé;Maracas;Triangel;Tamboerijn;Xylofoon;Vibrafoon;Pauken;Klapper;Cajón;Basgitaar
concertPlekken|Concertgebouw;Ziggo Dome;AFAS Live;GelreDome;Ahoy;Johan Cruijff ArenA;Paradiso;Melkweg;TivoliVredenburg;013;Effenaar;Paard;De Oosterpoort;Grote Markt;Koninklijk Theater Carré;Royal Albert Hall;Madison Square Garden;Carnegie Hall;Wembley Stadium
kleuren|Rood;Blauw;Geel;Groen;Oranje;Paars;Roze;Zwart;Wit;Grijs;Bruin;Beige;Turkoois;Lila;Violet;Bordeaux;Marineblauw;Lichtblauw;Donkerblauw;Olijfgroen;Mintgroen;Goud;Zilver;Crème;Khaki;Oker;Koraalrood;Fuchsia;Magenta;Lavendel;Indigo;Perzik;Terracotta;Zalmroze
kleding|T-shirt;Trui;Hoodie;Vest;Jas;Winterjas;Regenjas;Spijkerbroek;Jeans;Joggingbroek;Short;Broek;Rok;Jurk;Blouse;Overhemd;Polo;Hemd;Top;Crop top;Blazer;Pak;Pyjama;Onderbroek;Sokken;Panty;Legging;Sjaal;Muts;Handschoenen;Bikini;Badpak;Zwembroek;Sneakers;Sportschoenen;Laars;Sandalen;Slippers;Trenchcoat;Spijkerjack;Sweater;Pet;Hoed;Baret;Kimono;Tuniek;Overall
schoenen|Sneaker;Sportschoen;Gymp;Laars;Regenlaars;Winterlaars;Sandalen;Slippers;Pantoffels;Pumps;Hakken;Instappers;Mocassins;Loafers;Ballerina's;Veterschoenen;Wandelschoenen;Bergschoenen;Klompen;Espadrilles;Chelsea boots;Cowboylaarzen;Enkellaarsjes
jassen|Winterjas;Regenjas;Spijkerjack;Leren jas;Bomberjack;Parka;Mantel;Trenchcoat;Blazer;Donsjas;Windjack;Pufferjack;Poncho;Softshelljas;Fleecejas;Waterdichte jas
broeken|Spijkerbroek;Jeans;Joggingbroek;Trainingsbroek;Short;Sportbroek;Pantalon;Chino;Legging;Cargo broek;Cargobroek;Bermuda;Culotte;Capribroek;Tuinbroek;Zwemshort;Fietsbroek;Skibroek;Regenbroek;Pyjamabroek
accessoires|Pet;Hoed;Muts;Zonnebril;Bril;Riem;Sjaal;Handschoenen;Armband;Ketting;Ring;Oorbellen;Horloge;Tas;Rugzak;Handtas;Haarband;Diadeem;Haarspeld;Scrunchie;Stropdas;Vlinderdas;Broche;Manchetknopen;Paraplu;Bandana
bruiloft|Trouwjurk;Pak;Smoking;Blazer;Overhemd;Gilet;Rok;Galajurk;Cocktailjurk;Hoge hakken;Pumps;Stropdas;Vlinderdas;Manchetknopen;Sieraden;Sluier;Bruidsjurk;Trouwpak;Trouwschoenen;Bruidssluier
winterKleding|Muts;Sjaal;Wanten;Handschoenen;Winterjas;Donsjas;Pufferjack;Thermokleding;Snowboots;Winterlaarzen;Dikke trui;Wollen sokken;Coltrui;Vest;Fleece;Skipak;Skibroek
zomerKleding|T-shirt;Short;Korte broek;Rok;Zomerjurk;Tanktop;Hemd;Zonnehoed;Pet;Sandalen;Slippers;Bikini;Badpak;Zwembroek;Linnegordel;Linnen broek;Luchtige blouse
haar|Haarband;Haarspeld;Haarklem;Scrunchie;Diadeem;Haarlint;Elastiekje;Haarelastiek;Haarstrik;Haarpin;Haarclip;Haaraccessoire;Fascinator;Haarkam;Bloem
geschiedenisPersonen|Julius Caesar;Napoleon;Cleopatra;Alexander de Grote;Karel de Grote;Willem van Oranje;Johan de Witt;Rembrandt;Leonardo da Vinci;Michelangelo;Galileo Galilei;Isaac Newton;Albert Einstein;Marie Curie;Christoffel Columbus;Vasco da Gama;Marco Polo;Dzjengis Khan;Cleopatra VII;Abraham Lincoln;George Washington;Mahatma Gandhi;Nelson Mandela;Martin Luther King;Rosa Parks;Anne Frank;Vincent van Gogh;Ludwig van Beethoven;Mozart;Winston Churchill;Joan of Arc;Johanna van Arc;William Shakespeare;Aristoteles;Plato;Socrates;Toetanchamon;Augustus;Nero
oudeVoorwerpen|Zwaard;Schild;Speer;Pijl;Boog;Kruisboog;Harnas;Helm;Zandloper;Zonnewijzer;Olielamp;Kandelaar;Ganzenveer;Inktpot;Perkament;Papyrus;Typemachine;Grammofoon;Telefoon met draaischijf;Koets;Kar;Kruik;Amfoor;Aardewerk;Klei-tablet;Kaars;Spinnewiel;Weefgetouw;Handmolen;Munt;Schelp;Klomp;Houten kom;Kaart;Kompas;Sextant
uitvinders|Thomas Edison;Alexander Graham Bell;James Watt;Nikola Tesla;Graham Bell;Johannes Gutenberg;Eli Whitney;Samuel Morse;Louis Braille;Alessandro Volta;Michael Faraday;Benjamin Franklin;Wright Brothers;Gebroeders Wright;Ada Lovelace;Tim Berners-Lee;Steve Jobs;Guglielmo Marconi;Rudolf Diesel;Karl Benz;Henry Ford;Louis Pasteur
koningen|Willem I;Willem II;Willem III;Willem-Alexander;Wilhelmina;Juliana;Beatrix;Elizabeth I;Elizabeth II;Victoria;Lodewijk XIV;Lodewijk XVI;Hendrik VIII;Richard Leeuwenhart;Karel de Grote;Karel V;Koning Arthur;Filips II;George VI;Napoleon;Cleopatra
wo2|Bevrijding van Nederland;D-Day;Landing in Normandië;Slag om Engeland;Slag om Stalingrad;Slag om Arnhem;Operatie Market Garden;Pearl Harbor;Slag om Midway;Slag om Berlijn;Bevrijding van Parijs;Einde Tweede Wereldoorlog;Hongerwinter;Slag om de Ardennen
wo2Personen|Anne Frank;Winston Churchill;Franklin D. Roosevelt;Dwight Eisenhower;George Patton;Charles de Gaulle;Hannie Schaft;Corrie ten Boom;George Maduro;Willem Arondeus;Oskar Schindler;Sophie Scholl;Alan Turing;Wilhelmina;Miep Gies;Prins Bernhard
uitvindingen|Wiel;Papier;Boekdrukkunst;Kompas;Buskruit;Stoommachine;Trein;Auto;Vliegtuig;Telefoon;Radio;Televisie;Fotocamera;Elektrische lamp;Gloeilamp;Computer;Internet;Penicilline;Drukpers;Schrijfmachine;Fiets;Naaimachine;Koelkast;Elektrische motor;Röntgenfoto
oudeBeroepen|Smid;Boer;Visser;Herder;Baksteenbakker;Kleermaker;Koper;Schout;Bakker;Molenaar;Zadelmaker;Koetsier;Stalknecht;Schoenmaker;Kleermaker;Kramer;Rondreizende handelaar;Veldwachter;Bode;Schipper;Timmerman;Wever;Pottenbakker;Zilversmid;Klerk;Koning;Ridder;Soldaat
kasteelSpullen|Troon;Zwaard;Schild;Harnas;Helm;Toorts;Kaars;Fakkel;Kerkbank;Tafel;Stoel;Wapenschild;Schilderij;Kandelaar;Open haard;Burchtmuur;Gracht;Ophaalbrug;Toren;Ridderzaal;Valk;Stal;Put;Kanon;Katapult;Beker;Sleutel;Hek
oudeRijken|Romeinse Rijk;Griekse Rijk;Oude Egypte;Perzische Rijk;Ottomaanse Rijk;Britse Rijk;Spaanse Rijk;Incarijk;Azteekse Rijk;Mongoolse Rijk;Byzantijnse Rijk;Heilige Roomse Rijk;Frankische Rijk;Mali-rijk
ruimteObjecten|Zon;Maan;Aarde;Mars;Venus;Mercurius;Jupiter;Saturnus;Uranus;Neptunus;Pluto;Ster;Planeet;Komeet;Meteoor;Meteoroïde;Asteroïde;Planetoïde;Meteoriet;Zwart gat;Supernova;Nevel;Sterrenstelsel;Melkweg;Maansteen;Stofwolk;Ruimtestof;Ruimteschip;Raket;Satelliet;Ruimtestation;Ruimtepuin;Ruimtetelescoop;Kuipergordel;Asteroïdengordel;Ringen van Saturnus
planeten|Mercurius;Venus;Aarde;Mars;Jupiter;Saturnus;Uranus;Neptunus
manen|Maan;Io;Europa;Ganymedes;Callisto;Titan;Enceladus;Triton;Miranda;Rhea;Dione;Iapetus;Phobos;Deimos;Charon;Oberon;Titania;Ariel;Umbriel
sterren|Zon;Sirius;Poolster;Betelgeuze;Rigel;Vega;Proxima Centauri;Alpha Centauri A;Alpha Centauri B;Arcturus;Altair;Deneb;Capella;Antares;Spica;Aldebaran;Procyon;Canopus;Achernar;Polaris
sterrenbeelden|Orion;Grote Beer;Kleine Beer;Cassiopeia;Zwaan;Lier;Draak;Schorpioen;Leeuw;Stier;Tweelingen;Kreeft;Ram;Maagd;Weegschaal;Boogschutter;Steenbok;Waterman;Vissen;Adelaar;Andromeda;Pegasus;Hercules
raketten|Saturn V;Falcon 9;Falcon Heavy;Starship;Soyuz;Ariane 5;Ariane 6;Atlas V;Electron;New Shepard;Space Launch System;Delta IV;Proton;Long March 5;Vega;Vega-C;H-IIA;H3
ruimtepak|Helm;Vizier;Handschoen;Zuurstoftank;Zuurstofslang;Luchtfilter;Radio;Microfoon;Communicatiesysteem;Rugzak;Koelsysteem;Temperatuurregeling;Veiligheidslijn;Drukpak;Vizieren;Verlichting;Vlag
astronomen|Galileo Galilei;Johannes Kepler;Nicolaus Copernicus;Isaac Newton;Edwin Hubble;Carl Sagan;Stephen Hawking;Albert Einstein;William Herschel;Caroline Herschel;Henrietta Leavitt;Vera Rubin;Tycho Brahe;Hipparchus;Aristarchus;Christiaan Huygens;Giovanni Cassini;Cecilia Payne-Gaposchkin;Jocelyn Bell Burnell;Annie Jump Cannon
astronauten|Neil Armstrong;Buzz Aldrin;Yuri Gagarin;Joeri Gagarin;Sally Ride;André Kuipers;Chris Hadfield;Christina Koch;Jessica Meir;Valentina Teresjkova;Tim Peake;Peggy Whitson;Mae Jemison;Sunita Williams;Samantha Cristoforetti
ruimteLanden|Verenigde Staten;Rusland;China;India;Japan;Frankrijk;Duitsland;Verenigd Koninkrijk;Nederland;Canada;Italië;Zuid-Korea;Israël;Verenigde Arabische Emiraten;Nieuw-Zeeland
ruimteVoertuigen|Apollo 11;Space Shuttle;Spaceshuttle;Soyuz;Dragon;Starliner;Orion;Viking 1;Viking 2;Curiosity;Perseverance;Opportunity;Spirit;Hubble;James Webb;Voyager 1;Voyager 2;New Horizons;Juno;Cassini;Parker Solar Probe;Chang'e 5;Tianwen-1
maanDingen|Maankrater;Maanzee;Maankorst;Regoliet;Maandust;Maansteen;Vlag;Maanlander;Maanrover;Apollo 11;Astronaut;Voetafdruk;Maanbasis;Maanlicht;Maankrater Tycho;Maanzee Tranquillitatis
marsDingen|Rode stof;Zand;Rots;Kiezel;Ijskap;Poolkap;Olympus Mons;Valles Marineris;Dunne atmosfeer;Koolstofdioxide;Waterijs;Marsrover;Curiosity;Perseverance;Phobos;Deimos
ruimteWoorden|Raket;Lancering;Astronaut;Kosmonaut;Satelliet;Ruimteschip;Orbit;Baan;Zwaartekracht;Gewichtloosheid;Ruimtepak;Ruimtewandeling;Missie;Ruimtestation;Lanceerplatform;Lanceerbasis;Stuwkracht;Motor;Hitteschild;Terugkeer;Landingsmodule
kometen|Halley;Komeet Halley;Komeet NEOWISE;Komeet Hale-Bopp;Komeet Hyakutake;Komeet Encke;Swift-Tuttle;Tempel 1;67P;67P/Churyumov-Gerasimenko;Perseïden;Geminiden;Leoniden
zon|Zonnevlek;Zonnevlam;Zonne-uitbarsting;Zonnewind;Zonnestraling;Zonne-energie;Zonlicht;Zonnekern;Fotosfeer;Chromosfeer;Corona;Zonsverduistering;Noorderlicht;Zuidpoollicht
aardeVanuitRuimte|Oceaan;Zee;Wolk;Woestijn;Bergketen;Sahara;Himalaya;Alpen;Amazoneregenwoud;Nijl;Grote Meren;IJsplaat;Poolkap;Groenland;Rivierdelta;Kustlijn;Eiland;Koraalrif;Stad;Stadslicht;Storm;Orkaan;Wolkendek
wetenschappers|Albert Einstein;Isaac Newton;Marie Curie;Charles Darwin;Galileo Galilei;Nikola Tesla;Stephen Hawking;Louis Pasteur;Ada Lovelace;Alan Turing;Rosalind Franklin;Gregor Mendel;Antonie van Leeuwenhoek;Christiaan Huygens;Michael Faraday;Dmitri Mendelejev;Niels Bohr;Max Planck;Jane Goodall;Carl Sagan;Edwin Hubble;Johannes Kepler;James Watson;Francis Crick;Lise Meitner;Emmy Noether;Rachel Carson;Robert Hooke
lichaamsdelen|Hoofd;Haar;Oog;Oor;Neus;Mond;Tong;Tand;Hals;Nek;Schouder;Arm;Elleboog;Pols;Hand;Vinger;Duim;Borst;Rug;Buik;Heup;Been;Knie;Enkel;Voet;Teen;Huid;Hart;Long;Hersenen;Maag;Lever;Darm;Nier
gezondheid|Water;Zuurstof;Voeding;Eiwit;Vetten;Koolhydraten;Vitamine;Mineralen;Calcium;IJzer;Vitamine C;Vitamine D;Slaap;Beweging;Rust;Frisse lucht;Vezels;Energie
energiebronnen|Zon;Zonlicht;Wind;Water;Waterkracht;Aardwarmte;Geothermie;Biomassa;Aardgas;Aardolie;Steenkool;Uranium;Waterstof;Getijden;Golfenergie;Elektriciteit;Brandhout
meetinstrumenten|Liniaal;Meetlint;Meetlat;Thermometer;Weegschaal;Stopwatch;Klok;Meter;Voltmeter;Amperemeter;Multimeter;Barometer;Anemometer;Regenmeter;Hygrometer;Microscoop;Telescoop;Schuifmaat;Gradenboog;Kompas;Bloeddrukmeter;Snelheidsmeter;Odometer;Geodriehoek
metalen|IJzer;Koper;Aluminium;Zink;Goud;Zilver;Platina;Nikkel;Lood;Tin;Titanium;Chroom;Magnesium;Lithium;Natrium;Kobalt;Kwik;Wolfram;Mangaan;Bismut
keukenStoffen|Water;Zout;Suiker;Bloem;Meel;Olie;Azijn;Soda;Baksoda;Koolstofdioxide;Zuurstof;Waterdamp;Citroenzuur;Boter;Melk;Zetmeel
wetenschap|Proefje;Experiment;Onderzoek;Observatie;Hypothese;Theorie;Microscoop;Telescoop;Laboratorium;Natuurkunde;Scheikunde;Biologie;Genetica;Astronomie;Wiskunde;Geneeskunde;Robotica;Computer;Robot;Meting;Grafiek;Formule;Monster;DNA;Cel;Atoom;Molecuul;Element;Kracht;Zwaartekracht;Licht;Geluid;Elektriciteit;Energie
basisEten|Brood;Boter;Kaas;Melk;Ei;Eieren;Yoghurt;Kwark;Rijst;Pasta;Aardappel;Patat;Friet;Pizza;Hamburger;Hotdog;Pannenkoek;Wafel;Havermout;Cornflakes;Appel;Banaan;Peer;Sinaasappel;Mandarijn;Druif;Aardbei;Ananas;Mango;Wortel;Komkommer;Tomaat;Paprika;Sla;Broccoli;Bloemkool;Kip;Rundvlees;Varkensvlees;Vis;Zalm;Tonijn;Haring;Biefstuk;Tofu;Bonen;Erwten;Linzen;Pindakaas;Jam;Chocolade;Snoep;Chips;Nootjes;Popcorn;IJs;Koek;Taart;Soep;Salade;Lasagne;Spaghetti;Sushi;Nasi;Bami
fruit|Appel;Peer;Banaan;Sinaasappel;Mandarijn;Citroen;Limoen;Grapefruit;Druif;Aardbei;Framboos;Braam;Blauwe bes;Rode bes;Kers;Pruim;Perzik;Nectarine;Abrikoos;Ananas;Mango;Papaja;Kiwi;Passievrucht;Lychee;Ramboetan;Watermeloen;Meloen;Honingmeloen;Galia;Vijg;Dadel;Granaatappel;Avocado;Kokosnoot;Guave;Carambola;Kaki;Kumquat;Litchi
groente|Wortel;Komkommer;Tomaat;Paprika;Broccoli;Bloemkool;Sla;Spinazie;Andijvie;Boerenkool;Spruitjes;Rode kool;Witte kool;Paksoi;Prei;Ui;Knoflook;Champignon;Courgette;Aubergine;Pompoen;Radijs;Rode biet;Knolselderij;Pastinaak;Mais;Doperwt;Peultje;Sperzieboon;Snijboon;Asperge;Venkel;Artisjok;Rucola;Waterkers;Zuurkool
pizzaToppings|Kaas;Mozzarella;Tomaat;Tomatensaus;Salami;Ham;Pepperoni;Champignon;Paprika;Ui;Rode ui;Olijf;Ananas;Tonijn;Kip;Bacon;Spek;Gehakt;Rucola;Basilicum;Oregano;Pesto;Gorgonzola;Parmezaan;Feta;Spinazie;Aubergine;Courgette;Artisjok;Mais;Knoflook;Jalapeño;Ansjovis;Garnaal;Zalm;Truffel;Rode peper;Groene peper;BBQ-saus;Kersen-tomaat
broodbeleg|Kaas;Ham;Salami;Kipfilet;Leverworst;Rosbief;Hagelslag;Pindakaas;Jam;Appelstroop;Hazelnootpasta;Chocopasta;Boter;Margarine;Hummus;Avocado;Ei;Tomaat;Komkommer;Sla;Brie;Geitenkaas;Hüttenkäse;Tonijnsalade;Eiersalade;Kipkerrie;Speculoospasta;Vruchtenhagel;Muisjes;Rookvlees;Zalm
ontbijt|Brood;Boterham;Croissant;Beschuit;Cracker;Havermout;Muesli;Granola;Cornflakes;Yoghurt;Kwark;Melk;Banaan;Appel;Aardbei;Ei;Roerei;Gekookt ei;Spiegelei;Pannenkoek;Wafel;Smoothie;Toast;Bagel;Brioche;Pap;Ontbijtkoek;Pindakaas;Jam;Kaas
snacks|Chips;Popcorn;Nootjes;Pinda;Snoep;Chocolade;Koekje;Appel;Banaan;Druiven;Aardbei;Wortel;Komkommer;Cracker;Notenreep;Mueslireep;Rijstwafel;Rozijnen;Kroket;Bitterbal;Frikandel;Kaassoufflé;Mini-loempia;Nacho's;Tosti;Boterham;IJs;Drop
snoep|Drop;Gummibeer;Winegum;Spekje;Marshmallow;Lolly;Zuurtje;Toffee;Karamel;Chocolade;Bonbon;Pepermunt;Kauwgom;Zure mat;Colaflesje;Fruitgom;Skittles;M&M's;Smarties;Jellybean;Trekdrop;Salmiakdrop;Noga
koekjes|Stroopwafel;Speculaas;Biscuit;Chocolate chip cookie;Boterkoekje;Kletskop;Macaron;Digestive;Oreo;Maria biscuit;Bokkenpootje;Kokosmakroon;Kaneelkoekje;Gemberkoekje;Kerstkransje;Lange vinger;Sprits;Zandkoekje
bakker|Brood;Witbrood;Volkorenbrood;Bruinbrood;Stokbrood;Croissant;Gebak;Taart;Appeltaart;Slagroomtaart;Donut;Muffin;Bagel;Brioche;Kaiserbroodje;Pistolet;Bolletje;Rozijnenbol;Krentenbol;Suikerbrood;Koffiebroodje;Speculaas;Stroopwafel;Vlaai;Tompouce;Boterkoek;Kaneelbroodje
sauzen|Ketchup;Mayonaise;Mosterd;Curry;Sambal;Pindasaus;Knoflooksaus;BBQ-saus;Chilisaus;Sweet chilisaus;Tomatensaus;Pesto;Tzatziki;Hummus;Hollandaisesaus;Béchamelsaus;Salsasaus;Sojasaus;Teriyakisaus;Chimichurri;Yoghurtsaus;Cocktailsaus
koffie|Espresso;Cappuccino;Latte;Caffè latte;Latte macchiato;Flat white;Americano;Mocha;Ristretto;Lungo;Filterkoffie;IJskoffie;Cold brew;Dubbele espresso;Macchiato
frisdrank|Cola;Sinas;Sprite;7UP;Fanta;Cassis;Tonic;Ginger ale;Bitter lemon;IJsthee;Ice tea;Energiedrank;Rivella;Fristi;Appelsap;Jus d'orange;Limonade
drank|Water;Bruiswater;Melk;Chocolademelk;Karnemelk;Thee;Koffie;Cola;Sinas;Limonade;Appelsap;Sinaasappelsap;Druivensap;IJsthee;Smoothie;Milkshake;Fristi;Roosvicee;Tonic;Ginger ale;Kokoswater
salade|Sla;Rucola;Veldsla;Spinazie;Tomaat;Komkommer;Paprika;Mais;Ui;Rode ui;Wortel;Radijs;Olijf;Feta;Mozzarella;Kaas;Kip;Tonijn;Zalm;Ei;Avocado;Appel;Druif;Walnoot;Pijnboompit;Crouton;Dressing;Balsamico;Kikkererwt;Pasta;Linzen
fingerfood|Friet;Chips;Popcorn;Nootjes;Bitterballen;Kroket;Frikandel;Loempia;Mini-pizza;Pizza;Hamburger;Hotdog;Taco;Wrap;Sushi;Onigiri;Saté;Kipnuggets;Kippenvleugel;Kaasblokje;Druif;Aardbei;Komkommer;Wortel;Toastje;Cracker;Koekje;Donut;Muffin;Boterham
bomen|Eik;Beuk;Berk;Linde;Esdoorn;Es;Iep;Populier;Wilg;Els;Den;Spar;Ceder;Lariks;Jeneverbes;Cipres;Sequoia;Appelboom;Perenboom;Kersenboom;Pruimenboom;Citroenboom;Sinaasappelboom;Olijfboom;Palmboom;Kokospalm;Kastanjeboom;Walnotenboom;Hazelaar;Plataan;Acacia;Eucalyptus;Magnolia;Taxus;Hulst
bloemen|Roos;Tulp;Zonnebloem;Narcis;Krokus;Hyacint;Sneeuwklokje;Madeliefje;Paardenbloem;Klaproos;Korenbloem;Lelie;Orchidee;Margriet;Anjer;Dahlia;Pioenroos;Iris;Lavendel;Viooltje;Hortensia;Gerbera;Chrysant;Lupine;Anemoon;Boterbloem;Sleutelbloem;Vergeet-mij-nietje;Kamille;Hibiscus;Petunia
kamerplanten|Monstera;Varen;Orchidee;Cactus;Aloë vera;Sansevieria;Pannenkoekenplant;Ficus;Viooltje;Lepelplant;Graslelie;Yucca;Drakenbloedboom;Gatenplant;Pothos;Klimop;Rubberplant;Philodendron;Zamioculcas;Palmpje;Vetplant;Begonia;Anthurium;Kalanchoë;Calathea
planten|Boom;Bloem;Gras;Struik;Mos;Varen;Bamboe;Riet;Klimop;Klimplant;Cactus;Roos;Tulp;Zonnebloem;Eik;Beuk;Berk;Paddenstoel;Klaproos;Paardenbloem;Narcis;Boterbloem;Madeliefje;Dennenboom;Waterlelie;Iris
nlPlanten|Eik;Beuk;Berk;Wilg;Populier;Linde;Es;Bramenstruik;Brandnetel;Madeliefje;Paardenbloem;Boterbloem;Klaproos;Korenbloem;Munt;Braam;Vlier;Roos;Narcis;Tulp;Krokus;Hyacint;Hortensia;Klimop;Riet;Heide;Dovenetel;Muur;Kleefkruid;Vingerhoedskruid
paddenstoelen|Champignon;Vliegenzwam;Oesterzwam;Shiitake;Eekhoorntjesbrood;Cantharel;Morielje;Eekhoorntjesbrood;Inktzwam;Elfenbankje;Truffel;Boleet;Aardappelbovist;Zwavelzwam;Eekhoorntjesbrood;Pruikzwam;Parelamaniet;Koningsoesterzwam
landschappen|Bos;Strand;Duin;Heide;Polder;Rivier;Meer;Moeras;Berg;Heuvel;Dal;Woestijn;Steppe;Savanne;Toendra;Gletsjer;Kloof;Vulkaan;Kust;Eiland;Koraalrif;Mangrove;Regenwoud;Grasland;Weide;Akker;Pampa;Kwelder
weer|Zon;Regen;Sneeuw;Hagel;Onweer;Mist;Wind;Storm;Bewolking;IJzel;Vrieskou;Hitte;Motregen;Natte sneeuw;Regenboog;Hagelbui;Tornado;Orkaan;Dauw;Rijp;Vriezende mist
wolken|Cumulus;Stratus;Cirrus;Cirrostratus;Cirrocumulus;Stratocumulus;Altocumulus;Altostratus;Nimbostratus;Cumulonimbus;Stapelwolk;Sluierwolk;Schaapjeswolk;Onweerswolk;Regenwolk;Mistwolk;Rolwolk
rampen|Aardbeving;Tsunami;Vulkaanuitbarsting;Orkaan;Tornado;Overstroming;Droogte;Bosbrand;Lawine;Modderstroom;Aardverschuiving;Stormvloed;Hagelstorm;Sneeuwstorm;Hittestress;Stortregen;Zandstorm;Meteorietinslag
bosWandeling|Boom;Blad;Bladeren;Tak;Twijg;Mos;Paddenstoel;Pinecone;Dennenappel;Eikel;Kastanje;Bramen;Brandnetel;Varens;Vogelnest;Vogel;Eekhoorn;Ree;Hert;Vos;Das;Egel;Konijn;Haas;Mier;Kever;Vlinder;Bij;Honingbij;Spin;Regenworm;Sporen;Pootafdruk;Boomstronk
films|The Lion King;Frozen;Toy Story;Shrek;Finding Nemo;Inside Out;Coco;Cars;The Incredibles;Monsters, Inc.;Up;Ratatouille;Kung Fu Panda;Madagascar;Despicable Me;Minions;Harry Potter;Star Wars;Avatar;Titanic;Jurassic Park;Home Alone;The Avengers;Spider-Man;Batman;Superman;The Matrix;E.T.;The Lord of the Rings;Indiana Jones;Back to the Future;Jumanji;Wonka;Matilda;Barbie;Oppenheimer;The Sound of Music;Mary Poppins;Paddington;Moana
animatiefilms|Toy Story;Finding Nemo;Frozen;The Lion King;Coco;Cars;Up;Inside Out;Shrek;Kung Fu Panda;Madagascar;Minions;Despicable Me;Ratatouille;WALL-E;The Incredibles;Zootopia;Moana;Encanto;Spirited Away;How to Train Your Dragon;The Lego Movie;The Super Mario Bros. Movie
acteurs|Tom Hanks;Leonardo DiCaprio;Brad Pitt;Johnny Depp;Robert Downey Jr.;Chris Hemsworth;Chris Evans;Scarlett Johansson;Emma Watson;Daniel Radcliffe;Rupert Grint;Jennifer Lawrence;Dwayne Johnson;Will Smith;Morgan Freeman;Samuel L. Jackson;Meryl Streep;Julia Roberts;Sandra Bullock;Margot Robbie;Ryan Gosling;Ryan Reynolds;Hugh Jackman;Keanu Reeves;Jim Carrey;Adam Sandler;Zendaya;Timothée Chalamet;Florence Pugh;Jenna Ortega;Jack Black;Eddie Murphy;Angelina Jolie;Nicole Kidman;Kate Winslet;Cillian Murphy;Tom Holland;Benedict Cumberbatch;Idris Elba;Michael B. Jordan
stripfiguren|Donald Duck;Mickey Mouse;Goofy;Pluto;Dagobert Duck;Kwik;Kwek;Kwak;Asterix;Obelix;Lucky Luke;Kuifje;Bollie;Billie;Suske;Wiske;Lambik;Jerom;Nero;Garfield;Snoopy;Charlie Brown;Spider-Man;Batman;Superman;Wonder Woman;Iron Man;Captain America;Hulk;Thor;Deadpool;De Smurfen;Grote Smurf;Popeye;Bugs Bunny;Daffy Duck;Tom;Jerry
tekenfilmfiguren|Mickey Mouse;Donald Duck;Goofy;Pluto;Elsa;Anna;Olaf;Simba;Nala;Timon;Pumbaa;Shrek;Fiona;Ezel;Woody;Buzz Lightyear;Nemo;Dory;Lightning McQueen;SpongeBob;Patrick;Peppa Pig;Pikachu;Ash Ketchum;Mario;Luigi;Minion;Gru;Gru's dochters;Gromit;Wallace;Homer Simpson;Bart Simpson
sprookjes|Roodkapje;Assepoester;Doornroosje;Sneeuwwitje;Hans en Grietje;Rapunzel;De kleine zeemeermin;De gelaarsde kat;De kikkerkoning;De wolf en de zeven geitjes;Pinokkio;De drie biggetjes;Het lelijke eendje;De keizer zijn nieuwe kleren;De prinses op de erwt;Vrouw Holle;Het meisje met de zwavelstokjes;De Bremer stadsmuzikanten
schilderSpullen|Kwast;Penseel;Verf;Acrylverf;Olieverf;Aquarel;Waterverf;Kleurpotlood;Houtskool;Canvas;Doek;Schildersdoek;Ezel;Palet;Spatel;Verfbakje;Papier;Potlood;Gum;Krijt;Verfstift;Vernis;Inkt;Pastelkrijt
kunstvormen|Schilderen;Tekenen;Beeldhouwen;Fotografie;Film;Dans;Ballet;Muziek;Theater;Pottenbakken;Mozaïek;Graffiti;Striptekenen;Animatie;Kalligrafie;Borduren;Weven;Illustratie;Design;Architectuur;Keramiek
voertuigen|Auto;Fiets;Bus;Trein;Tram;Metro;Vliegtuig;Helikopter;Boot;Schip;Veerboot;Kano;Kajak;Roeiboot;Zeilboot;Motor;Motorfiets;Scooter;Brommer;Step;Elektrische step;Skateboard;Rolstoel;Bakfiets;Vrachtwagen;Bestelbus;Taxi;Ambulance;Brandweerwagen;Politieauto;Trolleybus;Gondel;Kabelbaan;Paard en wagen;Koets;Stoomtrein;Draagraket;Onderzeeër;Hovercraft;Quad
naarSchool|Fiets;Elektrische fiets;Bakfiets;Bus;Trein;Tram;Metro;Auto;Lopen;Step;Elektrische step;Scooter;Bromfiets;Skateboard;Inline skates;Schoolbus;Tandem;Wandelen
fietsen|Stadsfiets;Racefiets;Mountainbike;E-bike;Elektrische fiets;Bakfiets;Vouwfiets;Ligfiets;Tandem;Gravelbike;BMX;Kinderfiets;Omafiets;Transportfiets;Fatbike;Hybride fiets;Wielrenfiets;Fietstaxi;Driewieler;Eenwieler;Loopfiets
ov|Bus;Trein;Tram;Metro;Trolleybus;Veerboot;Waterbus;Buurtbus;Schoolbus;Intercity;Sprinter;Hogesnelheidstrein;Kabelbaan;Gondellift;Taxi;Deelfiets;Regiotaxi
stations|Amsterdam Centraal;Rotterdam Centraal;Den Haag Centraal;Utrecht Centraal;Eindhoven Centraal;Groningen;Zwolle;Arnhem Centraal;Apeldoorn;Nijmegen;Leiden Centraal;Haarlem;Amersfoort Centraal;Leeuwarden;Maastricht;Schiphol Airport;Antwerpen-Centraal;Brussel-Zuid;Gare du Nord;London King's Cross;St Pancras International;Berlin Hauptbahnhof;Gare de Lyon
inAuto|Stuur;Stoel;Stoelriem;Veiligheidsgordel;Spiegel;Achteruitkijkspiegel;Dashboard;Richtingaanwijzer;Radio;Navigatiesysteem;Airco;Kofferbak;Benzinetank;Motorkap;Versnellingspook;Handrem;Rempedaal;Gaspedaal;Koppeling;Autogordel;Ruitenwisser;Ruit;Portier;Deur;Reservewiel;EHBO-set
reisSpullen|Koffer;Rugzak;Reistas;Handbagage;Paspoort;ID-kaart;Portemonnee;Telefoon;Oplader;Kleding;Tandenborstel;Tandpasta;Zonnebril;Zonnebrand;Pet;Boek;Kaart;Treinkaartje;Vliegticket;Waterfles;Snack;Powerbank;Oordopjes;Koptelefoon;Kussen;Reisadapter;Handdoek
hulpdiensten|Ambulance;Brandweerwagen;Politieauto;Politiemotor;Reddingsboot;Traumahelikopter;Reddingshelikopter;Ladderwagen;Bluswagen;Commandowagen;Politiehelikopter;Reddingsvliegtuig;Waterkanon;Takelwagen;Berger
wegen|Snelweg;Autoweg;Fietspad;Fietsstraat;Landweg;Provinciale weg;Gemeenteweg;Ringweg;Dijkweg;Woonerf;Voetpad;Zebrapad;Rotonde;Kruispunt;Tolweg;Oprit;Afrit;Bospad;Zandweg;Bergweg;Tunnel
landen|Nederland;België;Duitsland;Frankrijk;Spanje;Portugal;Italië;Verenigd Koninkrijk;Ierland;Denemarken;Noorwegen;Zweden;Finland;IJsland;Polen;Oostenrijk;Zwitserland;Griekenland;Turkije;Verenigde Staten;Canada;Mexico;Brazilië;Argentinië;Chili;Peru;Colombia;China;Japan;India;Pakistan;Indonesië;Thailand;Vietnam;Zuid-Korea;Australië;Nieuw-Zeeland;Zuid-Afrika;Egypte;Marokko;Kenia;Nigeria;Ghana;Ethiopië;Saudi-Arabië;Israël;Iran;Irak;Oekraïne;Rusland;Nederland;België;Luxemburg;Duitsland;Frankrijk;Spanje;Portugal;Italië;Verenigd Koninkrijk;Ierland;Denemarken;Zweden;Noorwegen;Finland;IJsland;Oostenrijk;Zwitserland;Polen;Tsjechië;Hongarije;Griekenland;Turkije;Oekraïne;Rusland;Verenigde Staten;Canada;Mexico;Brazilië;Argentinië;Chili;Colombia;Peru;India;China;Japan;Thailand;Indonesië;Vietnam;Australië;Nieuw-Zeeland;Zuid-Afrika;Kenia;Nigeria;Egypte;Marokko;Algerije;Tunesië;Ethiopië
beroepen|Arts;Verpleegkundige;Tandarts;Apotheker;Leraar;Docent;Politieagent;Brandweerman;Brandweervrouw;Piloot;Steward;Stewardess;Buschauffeur;Treinmachinist;Bakker;Kok;Ober;Serveerster;Kassamedewerker;Winkelmedewerker;Programmeur;Timmerman;Loodgieter;Elektricien;Schilder;Hovenier;Boer;Dierenarts;Rechter;Advocaat;Journalist;Fotograaf;Kunstenaar;Muzikant;Zanger;Acteur;Voetballer;Sporter;Wetenschapper;Astronaut;Monteur;Schoonmaker;Postbezorger;Bezorger;Kapper;Architect;Boekhouder;Accountant;Vrachtwagenchauffeur;Fietsenmaker;Designer;Webdesigner;Vertaler;Bibliothecaris
school|Schoolbord;Whiteboard;Krijtbord;Tafel;Stoel;Kast;Lokaal;Deur;Raam;Boek;Schrift;Pen;Potlood;Gum;Etui;Rugzak;Laptop;Chromebook;Digibord;Computer;Liniaal;Geodriehoek;Rekenmachine;Kaart;Atlas;Poster;Prullenbak;Gymzaal;Kantine;Aula;Bibliotheek;Mediatheek;Speelplein;Klas;Leraar;Docent;Leerling
klaslokaal|Tafel;Stoel;Bureau;Whiteboard;Digibord;Schoolbord;Krijtbord;Kast;Boek;Schrift;Pen;Potlood;Gum;Liniaal;Geodriehoek;Poster;Klok;Computer;Laptop;Chromebook;Beamer;Projector;Prullenbak;Kaart;Atlas;Rugzak;Etui;Rekenmachine;Waterfles
schoolvakken|Nederlands;Engels;Frans;Duits;Spaans;Wiskunde;Rekenen;Biologie;Natuurkunde;Scheikunde;Geschiedenis;Aardrijkskunde;Maatschappijleer;Economie;Muziek;Tekenen;Kunst;Gym;Lichamelijke opvoeding;Techniek;Informatica;Filosofie;Latijn;Grieks;Godsdienst;Burgerschap
badkamer|Toilet;Wc;Wastafel;Kraan;Douche;Bad;Badkuip;Spiegel;Tandenborstel;Tandpasta;Handdoek;Badmat;Zeep;Shampoo;Conditioner;Deodorant;Scheermes;Kam;Haarborstel;Föhn;Toiletpapier;Prullenbak;Wc-borstel;Crème;Washandje;Wasbak;Tegels;Badkamerkast;Douchescherm
meubels|Tafel;Stoel;Bank;Sofa;Fauteuil;Kruk;Bureau;Bed;Kast;Boekenkast;Kledingkast;Dressoir;Nachtkastje;Salontafel;Eettafel;Barkruk;Ladekast;Schoenenkast;Vitrinekast;Commode;Kapstok;Tv-meubel;Sidetable;Bijzettafel;Zitzak;Schommelstoel;Tuinstoel;Tuinbank;Tuinset;Stellingkast
apps|WhatsApp;Instagram;TikTok;YouTube;Snapchat;Facebook;Spotify;Netflix;Disney+;Google;Gmail;Google Maps;Apple Music;ChatGPT;Discord;Reddit;Pinterest;X;Telegram;Signal;BeReal;Duolingo;Teams;Zoom;Roblox;Minecraft;Twitch;LinkedIn;Bol.com;Marktplaats;Amazon
spellen|Schaken;Dammen;Monopoly;Scrabble;Catan;Carcassonne;Ticket to Ride;Uno;Pesten;Memory;Ganzenbord;Mens erger je niet;Stratego;Cluedo;Risk;Twister;Jenga;Rummikub;Yahtzee;Qwirkle;Azul;Codenames;Exploding Kittens;Trivial Pursuit;Wie ben ik?;Vier op een rij;Bingo;Pictionary;Party & Co
schaken|Koning;Dame;Toren;Loper;Paard;Pion;Schaakbord;Schaakklok;Schaakmat;Schaak;Rokade;Promotie;Opening;Schaakzet;Remise;Pat;Schaakstelling;Grootmeester
rugzak|Boek;Schrift;Pen;Potlood;Gum;Etui;Laptop;Chromebook;Telefoon;Portemonnee;Sleutel;Lunchbox;Boterham;Appel;Banaan;Drinkfles;Waterfles;Oplader;Koptelefoon;Oordopjes;Gymkleren;Rekenmachine;Agenda;Huiswerk;Liniaal;Geodriehoek;Zakdoek
vakantieSpullen|Koffer;Rugzak;Kleding;Zwemkleding;Bikini;Zwembroek;Badpak;Slippers;Sandalen;Zonnebril;Zonnebrand;Pet;Paspoort;ID-kaart;Treinkaartje;Vliegticket;Telefoon;Oplader;Powerbank;Handdoek;Tandenborstel;Tandpasta;Koptelefoon;Boek;Camera;Drinkfles;Snack;Paraplu;Reisgids
keuken|Koelkast;Vriezer;Oven;Magnetron;Fornuis;Kookplaat;Gootsteen;Kraan;Pan;Koekenpan;Steelpan;Bord;Kom;Schaal;Mok;Beker;Glas;Mes;Vork;Lepel;Snijplank;Spatel;Garde;Mixer;Blender;Staafmixer;Broodrooster;Waterkoker;Vaatwasser;Koffiezetapparaat;Rasp;Zeef;Vergiet;Theedoek;Handdoek;Afwasmiddel;Bestek
bergLand|Zwitserland;Oostenrijk;Frankrijk;Italië;Duitsland;Spanje;Portugal;Noorwegen;Zweden;Polen;Tsjechië;Slowakije;Roemenië;Bulgarije;Griekenland;Slovenië;Kroatië;Turkije;Rusland;Georgië;Armenië;Nepal;India;Pakistan;China;Bhutan;Iran;Afghanistan;Tadzjikistan;Kirgizië;Kazachstan;Mongolië;Japan;Indonesië;Nieuw-Zeeland;Australië;Verenigde Staten;Canada;Mexico;Brazilië;Argentinië;Chili;Peru;Bolivia;Colombia;Venezuela;Ecuador;Marokko;Algerije;Zuid-Afrika;Tanzania;Kenia;Ethiopië
rijdbareLanden|België;Luxemburg;Duitsland;Frankrijk;Denemarken;Polen;Tsjechië;Oostenrijk;Zwitserland;Italië;Spanje;Portugal;Zweden;Noorwegen;Finland;Slovenië;Kroatië;Hongarije;Slowakije;Roemenië;Bulgarije;Griekenland;Servië;Montenegro;Albanië;Noord-Macedonië;Bosnië en Herzegovina;Belarus;Oekraïne;Liechtenstein;Andorra;Monaco;San Marino;Turkije
kustLand|Nederland;België;Duitsland;Frankrijk;Spanje;Portugal;Italië;Verenigd Koninkrijk;Ierland;Denemarken;Noorwegen;Zweden;Finland;IJsland;Polen;Estland;Letland;Litouwen;Griekenland;Kroatië;Slovenië;Albanië;Montenegro;Bulgarije;Roemenië;Oekraïne;Turkije;Marokko;Algerije;Tunesië;Egypte;Libanon;Israël;China;Japan;India;Pakistan;Bangladesh;Sri Lanka;Indonesië;Thailand;Vietnam;Australië;Nieuw-Zeeland;Verenigde Staten;Canada;Mexico;Brazilië;Argentinië;Chili;Peru;Zuid-Afrika
rivieren|Rijn;Maas;Waal;IJssel;Schelde;Donau;Seine;Theems;Loire;Elbe;Oder;Rhône;Po;Tiber;Wolga;Nijl;Amazone;Mississippi;Missouri;Mekong;Ganges;Indus;Yukon;Colorado;Rio Grande;Congo;Zambezi;Niger;Yangtze;Orinoco;Paraná;Tigris;Eufraat
europaRivieren|Rijn;Maas;Waal;IJssel;Vecht;Amstel;Schelde;Eems;Donau;Seine;Theems;Loire;Garonne;Rhône;Po;Tiber;Elbe;Oder;Weser;Wolga;Dnjepr;Dnje­str;Vistula;Wisła;Morava;Sava;Drava;Tisza;Neckar;Main;Moezel;Arno;Guadalquivir;Ebro;Taag;Douro;Spree;Inn;Isar
kustSteden|Rotterdam;Den Haag;Scheveningen;Zandvoort;IJmuiden;Vlissingen;Den Helder;Oostende;Knokke;Zeebrugge;Barcelona;Valencia;Malaga;Nice;Cannes;Marseille;Biarritz;Lissabon;Porto;Venetië;Genua;Napels;Athene;Piraeus;Istanbul;Dubrovnik;Split;Hamburg;Bremen;Kopenhagen;Stockholm;Oslo;Bergen;Helsinki;Tallinn;Riga;Gdansk;Londen;Brighton;Liverpool;Edinburgh;Dublin;Belfast;New York;Los Angeles;Miami;San Francisco;Rio de Janeiro;Kaapstad;Sydney;Tokyo;Tokio;Shanghai
rivierSteden|Amsterdam;Rotterdam;Utrecht;Arnhem;Nijmegen;Deventer;Zwolle;Maastricht;Venlo;Dordrecht;Londen;Parijs;Rome;Berlijn;Keulen;Düsseldorf;Frankfurt;Wenen;Boedapest;Praag;Bratislava;Belgrado;Budapest;Moskou;Sint-Petersburg;Caïro;Luxor;Lyon;Bordeaux;Toulouse;New York;Washington D.C.;Shanghai;Bangkok;Kolkata;Varanasi
skiPlekken|Alpen;Zwitserland;Oostenrijk;Frankrijk;Italië;Duitsland;Noorwegen;Zweden;Finland;Japan;Canada;Verenigde Staten;Chamonix;Zermatt;Sölden;Ischgl;St. Anton;Kitzbühel;Val Thorens;Tignes;Val d'Isère;Les Trois Vallées;Dolomieten;Saalbach;Serfaus;Mayrhofen;Laax;Verbier;Aspen;Whistler;Vail;Niseko;Sapporo;Tirol;Pyreneeën
strandNatuur|Zand;Schelp;Schelpen;Zeeschelp;Schelpdier;Krab;Kreeft;Garnaal;Meeuw;Zeehond;Oester;Mossel;Zeester;Zee-egel;Kwal;Zeewier;Drijfwood;Drijfhout;Kiezel;Steen;Koraal;Zandduin;Duinroos;Aangespoeld hout;Veer;Vogelspoor;Pootafdruk;Zeegras;Zeeschuim;Zeeslak;Zandworm;Krabbenschild;Strandloper;Zandloper;Blikje;Fles;Pluisje
vliegtuigen|Boeing 737;Boeing 747;Boeing 777;Boeing 787;Airbus A320;Airbus A330;Airbus A350;Airbus A380;Cessna 172;Concorde;Embraer E190;ATR 72;Fokker 70;Fokker 100;Boeing 767;Boeing 757;Airbus A220;Airbus A321;Airbus A319;Airbus A340;Bombardier CRJ;Pilatus PC-12;DHC-8;Dash 8;Airbus Beluga;Jumbojet
bruggen|Golden Gate Bridge;Tower Bridge;Brooklyn Bridge;Erasmusbrug;Zeelandbrug;Brug van Millau;Vasco da Gamabrug;Sydney Harbour Bridge;London Bridge;Rialtobrug;Pont Neuf;Pont Alexandre III;Karelsbrug;Forth Bridge;Øresundbrug;Öresundbrug;Waalbrug;Magere Brug;Tafelbrug;Galatabrug;Bosphorusbrug;Hangbrug van Clifton;Akashi-Kaikyobrug;Danyang-Kunshan Grand Bridge
tennissers|Roger Federer;Rafael Nadal;Novak Djokovic;Serena Williams;Venus Williams;Carlos Alcaraz;Jannik Sinner;Iga Świątek;Coco Gauff;Aryna Sabalenka;Naomi Osaka;Maria Sharapova;Steffi Graf;Martina Navratilova;Chris Evert;Andy Murray;Alexander Zverev;Daniil Medvedev;Nick Kyrgios;Stanislas Wawrinka;Alexander Bublik;Holger Rune;Casper Ruud;Kiki Bertens;Robin Haase;Richard Krajicek;Michaëlla Krajicek;Demi Schuurs;Wesley Koolhof;Tallon Griekspoor;Botic van de Zandschulp;Tim van Rijthoven;Elina Svitolina;Ons Jabeur;Emma Raducanu;Frances Tiafoe
handschoenSport|Boksen;Kickboksen;MMA;Honkbal;Softbal;American football;IJshockey;Skiën;Snowboarden;Rodelen;Bobsleeën;Curling;Wielrennen;Motocross;Formule 1;Klimmen;Windsurfen;Hockey;Paardensport;Karate;Taekwondo;Golf;Boogschieten;Schaatsen
gooienSport|Speerwerpen;Discuswerpen;Kogelstoten;Kogelslingeren;Darts;Bowlen;Honkbal;Softbal;Handbal;Basketbal;Trefbal;Dodgeball;Korfbal;Petanque;Frisbee;Ultimate frisbee;Werpnummers;Vortexwerpen
olympisch|Atletiek;Zwemmen;Voetbal;Basketbal;Handbal;Hockey;Rugby sevens;Volleybal;Beachvolleybal;Tennis;Tafeltennis;Badminton;Golf;Roeien;Kanoën;Zeilen;Triatlon;Schermen;Turnen;Trampolinespringen;Judo;Taekwondo;Worstelen;Boksen;Gewichtheffen;Boogschieten;Schietsport;Wielrennen;BMX;Skateboarden;Klimmen;Surfen;Paardensport;Schaatsen;Skiën;Snowboarden;Shorttrack;Kunstschaatsen;Curling;IJshockey
netSport|Tennis;Tafeltennis;Badminton;Volleybal;Beachvolleybal;Padel;Pickleball;Sepak takraw;Footvolley;Beach tennis;Zitvolleybal;Strandtennis;Tennisdubbel;Korfbal
djs|Tiësto;Armin van Buuren;Martin Garrix;David Guetta;Calvin Harris;Avicii;Afrojack;Hardwell;Nicky Romero;Don Diablo;Oliver Heldens;Steve Aoki;Marshmello;Skrillex;Diplo;Alan Walker;Kygo;Zedd;Robin Schulz;Alesso;Swedish House Mafia;Dimitri Vegas;Like Mike;Lost Frequencies;Netsky;Charlotte de Witte;Amelie Lens;Peggy Gou;Paul van Dyk;Ferry Corsten;Axwell;Sebastian Ingrosso;Eric Prydz;deadmau5;Kris Kross Amsterdam
versterken|Versterker;Gitaarversterker;PA-installatie;Luidspreker;Speaker;Microfoon;Mengpaneel;Voorversterker;Eindversterker;Volume;Compressie;Compressor;Koptelefoonversterker;Megafon;Audio-interface;Monitorluidspreker
filmMuziek|Soundtrack;Filmmuziek;Orkestmuziek;Pianomuziek;Spannende muziek;Themalied;Openingslied;Achtergrondmuziek;Instrumentale muziek;The Imperial March;My Heart Will Go On;Let It Go;Hakuna Matata;Circle of Life;You've Got a Friend in Me;A Whole New World;Part of Your World;He’s a Pirate;Hedwig's Theme;The Avengers Theme;Star Wars Theme;James Bond Theme;Jurassic Park Theme;Interstellar Theme;Coco Remember Me;We Don't Talk About Bruno;Can You Feel the Love Tonight;Shallow;Skyfall
klassiek|Für Elise;De Vier Jaargetijden;De Negende Symfonie;Ode an die Freude;Eine kleine Nachtmusik;Maanlichtsonate;Zwanenmeer;De Notenkraker;Peer Gynt;Boléro;Carmen;La Traviata;Aida;Tosca;De Toverfluit;Don Giovanni;De barbier van Sevilla;De Matthäus-Passion;Canon in D;Danse macabre
zonderMouwen|T-shirt zonder mouwen;Tanktop;Hemd;Top;Crop top;Mouwloze blouse;Spencer;Slipover;Haltertop;Bandjesjurk;Mouwloze jurk;Zomerjurk zonder mouwen;Badpak;Bikinitop;Singlet;Sporthemd;Basketbalshirt;Volleybalshirt;Vest zonder mouwen;Gilet;Giletje;Tuinbroek;Schort;Rok;Minirok;Maxirok;Corset;mouwloze trui
capuchon|Hoodie;Capuchontrui;Vest met capuchon;Regenjas;Parka;Winterjas met capuchon;Windjack met capuchon;Softshelljas;Donsjas met capuchon;Hooded sweater;Trainingsjack met capuchon;Poncho met capuchon;Fleecevest met capuchon;Anorak;Regenponcho;Skijas met capuchon;Waterdichte jas
mouwen|Jas;Regenjas;Spijkerjack;Blazer;Overhemd;Blouse;Trui;Hoodie;Vest;Sweater;T-shirt;Polo;Coltrui;Winterjas;Fleecejack;Kimono;Longsleeve;Jurk met lange mouwen;Shirt met korte mouwen;Sportjack;Bomberjack;Regenponcho
oudeLanden|Egypte;Griekenland;Italië;Turkije;China;India;Mexico;Peru;Bolivia;Cambodja;Irak;Iran;Syrië;Jordanië;Israël;Libanon;Tunesië;Marokko;Spanje;Frankrijk;Verenigd Koninkrijk;Duitsland;Japan;Indonesië;Guatemala;Honduras;Ethiopië;Sudan;Soedan;Pakistan
schrijvenVroeger|Ganzenveer;Veer;Inktpot;Rietpen;Kroontjespen;Vulpen;Potlood;Griffel;Lei;Kleitablet;Papyrus;Perkament;Papier;Typemachine;Schrijfmachine;Drukpers;Stempel;Krijt;Schrijfplankje;Boekdrukkunst;Handschrift;Wasplankje;Wastablet;Rijstpapier;Kalligrafiepen
geldVroeger|Munten;Gouden munt;Zilveren munt;Koperen munt;Papiergeld;Bankbiljet;Schelp;Kaurischelp;Zout;Graan;Ruilhandel;Ruilmiddel;Vee;Kralen;Cacaoboon;Thee;Tabak;Zilver;Goud;Staafzilver;Goudstaaf;Bronzen munt;Florijn;Dukaat;Gulden;Penning;Denarius
ontdekkingen|Zwaartekracht;Elektriciteit;Magnetisme;Röntgenstraling;Penicilline;DNA;DNA-structuur;Bacteriën;Virus;Radioactiviteit;Evolutie;Microscopische cellen;Atoom;Elektron;Proton;Neutron;Planeet Neptunus;Uranus;Heliocentrisch wereldbeeld;De beweging van de aarde rond de zon;Bloedcirculatie;Continentendrift;Amerika;Elektronenmicroscoop;Natuurlijke selectie;Fotosynthese
vikingen|Vikingschip;Langschip;Bijl;Schild;Zwaard;Helm;Noorwegen;Zweden;Denemarken;IJsland;Groenland;Leif Erikson;Erik de Rode;Viking;Roeiboot;Runen;Runenschrift;Thor;Odin;Valhalla;Walhalla;Drakkar;Schildmuur;Plundertocht;Vikingnederzetting;Handel;Ragnar Lodbrok;Berserker
reizen|Reis van Columbus naar Amerika;Ontdekking van Amerika;Eerste wereldomzeiling;Reis van Marco Polo;Reis van Vasco da Gama naar India;Eerste reis naar de Zuidpool;Eerste reis naar de Noordpool;Ontdekking van Australië door Europeanen;Reis van James Cook;Reis van de Beagle;Reis van Abel Tasman;Zijderoute;Expeditie van Roald Amundsen;Expeditie van Ernest Shackleton;Missie van Zheng He;Reis om Kaap de Goede Hoop;Vikingreizen naar Amerika
nlGebeurtenissen|Tachtigjarige Oorlog;Nederlandse Opstand;Slag bij Nieuwpoort;Vrede van Münster;Oprichting van de VOC;Oprichting van de WIC;Beeldenstorm;Moord op Willem van Oranje;Akte van Verlatinghe;Gouden Eeuw;Rampjaar 1672;Franse Tijd;Invoering van de Grondwet van 1848;Onafhankelijkheid van België;Eerste Wereldoorlog;Tweede Wereldoorlog;Bezetting van Nederland;Hongerwinter;Bevrijding op 5 mei 1945;Watersnoodramp 1953;Zuiderzeewerken;Deltawerken;Invoering van de euro;Kroning van Beatrix;Inhuldiging van Willem-Alexander
tijdperken|Prehistorie;Steentijd;Bronstijd;IJzertijd;Oudheid;Klassieke oudheid;Romeinse tijd;Middeleeuwen;Vroege middeleeuwen;Late middeleeuwen;Renaissance;Gouden Eeuw;Nieuwe Tijd;Moderne Tijd;Industriële Revolutie;Verlichting;Barok;Romantiek;Twintigste eeuw;Negentiende eeuw;Koude Oorlog;Tijd van jagers en boeren;Tijd van Grieken en Romeinen;Tijd van steden en staten;Tijd van televisie en computer
historischeSteden|Rome;Athene;Sparta;Alexandrië;Carthago;Babylon;Persepolis;Pompeï;Florence;Venetië;Genua;Brugge;Gent;Amsterdam;Londen;Parijs;Istanbul;Constantinopel;Jeruzalem;Beijing;Xi'an;Kyoto;Cuzco;Tenochtitlan;Trier;Keulen;Antwerpen;Novgorod;Toledo
romeinen|Julius Caesar;Augustus;Nero;Trajanus;Hadrianus;Rome;Romeinse Rijk;Legioen;Romeins soldaat;Gladiator;Colosseum;Aqueduct;Aquaduct;Romeinse weg;Romeinse baden;Toga;Senaat;Forum Romanum;Latijn;Amfitheater;Limes;Vesta;Jupiter;Mars;Pompeï;Vesuvius
egypte|Piramide;Piramides;Sfinx;Toetanchamon;Cleopatra;Ramses II;Cheops;Nijl;Gizeh;Caïro;Luxor;Karnak;Hiërogliefen;Mummie;Sarcofaag;Farao;Toetmosis;Hatsjepsoet;Anubis;Horus;Isis;Osiris;Ra;Papyrus;Dodenboek;Tempel;Graf;Obelisk
satellieten|Maan;Titan;Io;Europa;Ganymedes;Callisto;Enceladus;Rhea;Dione;Iapetus;Triton;Miranda;Ariel;Titania;Oberon;Phobos;Deimos;Charon;ISS;Kunstmaan;Ruimtesatelliet;Communicatiesatelliet;Weersatelliet;Navigatiesatelliet;GPS-satelliet
planetenBezocht|Mercurius;Venus;Aarde;Mars;Jupiter;Saturnus;Uranus;Neptunus
zonnestelsel|Zon;Maan;Aarde;Mars;Venus;Mercurius;Jupiter;Saturnus;Uranus;Neptunus;Pluto;Ceres;Komeet;Komeet Halley;Asteroïde;Planetoïde;Meteoriet;Kuipergordel;Ringen van Saturnus;Zonnestelsel;Asteroïdengordel;Io;Europa;Titan;Enceladus;Phobos;Deimos;Ganymedes;Callisto;Triton
hemellichamen|Zon;Ster;Planeet;Dwergplaneet;Maan;Natuurlijke satelliet;Asteroïde;Komeet;Planetoïde;Meteoroïde;Neutronenster;Witte dwerg;Bruine dwerg;Zwarte dwerg;Zwart gat;Protoster;Rode reus;Blauwe reus;Sterrenstelsel;Melkweg;Nevel;Sterrenhoop;Bolhoop;Open sterrenhoop;Exoplaneet;Quasar
maanOppervlak|Maankrater;Maansteen;Maandust;Regoliet;Berg;Rots;Kiezel;Maandepressie;Maanzee;Lavavlakte;Stof;Maankorst;Apollo-lander;Maansonde;Maanrover;Amerikaanse vlag;Voetafdruk;Sporen van astronauten;Maankraters
levenZoeken|Mars;Europa;Enceladus;Titan;Ganymedes;Callisto;Venus;Triton;Pluto;Ceres;Proxima Centauri b;TRAPPIST-1e;TRAPPIST-1f;TRAPPIST-1g;Kepler-186f;Kepler-452b;Enceladus-oceaan;Europa-oceaan;Ondergronds Marsijs;Oceanen onder ijs
ontdekkingenRuimte|Ontdekking van Pluto;Ontdekking van Uranus;Ontdekking van Neptunus;Ontdekking van exoplaneten;Ontdekking van zwaartekrachtgolven;Ontdekking van zwarte gaten;Ontdekking van de ringen van Saturnus;Ontdekking van water op Mars;Ontdekking van de manen van Jupiter;Ontdekking van de uitdijing van het heelal;Ontdekking van de kosmische achtergrondstraling;Ontdekking van de Melkweg;Ontdekking van verre sterrenstelsels;Ontdekking van het Higgsboson;Ontdekking van Pluto's maan Charon;Ontdekking van een oceaan onder Enceladus;Ontdekking van een oceaan onder Europa
astronautSpullen|Ruimtepak;Helm;Handschoenen;Ruimtehandschoenen;Zuurstoftank;Radio;Microfoon;Tablet;Camera;Computer;Laptop;Voedselpakket;Waterzak;Drinkzak;Gereedschap;Schroevendraaier;Sleutel;Veiligheidslijn;Toilet;Ruimtetoilet;Slaapzak;Wetenschappelijk meetinstrument;Zonnescherm;Rugzak;Stofzuiger;Luchtfilter
aardbaan|ISS;Tiangong;Hubble;Hubble Space Telescope;Chandra;Landsat;Sentinel;GPS-satelliet;Weersatelliet;Communicatiesatelliet;Televisiesatelliet;Ruimtestation;Maan;Starlink-satelliet;GOES;NOAA-satelliet;CubeSat;Ruimtepuin;Defecte satelliet;Rakettrap
zwaartekracht|Zwaartekracht;Zwaarteveld;Massa;Gewicht;Gewichtloosheid;Valversnelling;Planeet;Maan;Zon;Ster;Zwart gat;Baan;Orbit;Aantrekkingskracht;Getijden;Vrije val;Ontsnappingssnelheid;Newton;Einstein
microben|Bacterie;Gist;Amoebe;Paramecium;Pantoffeldiertje;Euglena;Eencellige alg;Chlorella;Biergist;Bakkersgist;Bacterie Escherichia coli;Escherichia coli;Lactobacillus;Cyanobacterie;Salmonella-bacterie;Bacil;Stafylokok;Streptokok;Gistcel;Diatomee
energie|Bewegingsenergie;Potentiële energie;Zwaarte-energie;Warmte;Warmte-energie;Elektrische energie;Chemische energie;Lichtenergie;Stralingsenergie;Geluidsenergie;Kernenergie;Elastische energie;Windenergie;Zonne-energie;Waterkrachtenergie;Geothermische energie;Kinetische energie;batterij-energie
batterijen|AA-batterij;AAA-batterij;C-batterij;D-batterij;Knoopcel;Lithium-ionaccu;Loodaccu;Nikkel-metaalhydride-accu;NiMH-accu;Autobatterij;Powerbank;Oplaadbare batterij;Alkalinebatterij;Knoopbatterij;Laptopaccu;Telefoonaccu;Batterijpack;Zink-koolstofbatterij;Zilveroxidebatterij;CR2032
vloeistoffen|Water;Melk;Olie;Olijfolie;Zonnebloemolie;Azijn;Sap;Appelsap;Sinaasappelsap;Limonade;Koffie;Thee;Cola;Benzine;Diesel;Alcohol;Ethanol;Glycerine;Kwik;Bloed;Honing;Siroop;Afwasmiddel;Shampoo;Inkt;Vloeibare zeep;Smeltwater;Saus;Smeerolie
temperatuur|Opwarmen;Afkoelen;Verwarmen;Koelen;Bevriezen;Smelten;Verdampen;Condenseren;Koken;Verhitten;Afkoeling;Temperatuurstijging;Temperatuurdaling;Temperatuurverschil;Vrieskou;Hitte
licht|Wit licht;Rood licht;Oranje licht;Geel licht;Groen licht;Blauw licht;Paars licht;Violet licht;Zonlicht;Maanlicht;Lamplicht;Kaarslicht;Laserlicht;UV-licht;Infrarood licht;Zichtbaar licht;Ultraviolet licht;Verstrooid licht;Gereflecteerd licht
gassen|Zuurstof;Stikstof;Koolstofdioxide;Koolmonoxide;Waterstof;Helium;Neon;Argon;Methaan;Ethaan;Propaan;Butaan;Waterdamp;Lucht;Aardgas;Ammoniak;Chloor;Ozon;Krypton;Xenon;Radon
microKlein|Bacterie;Cel;Huidcel;Bloedcel;Rode bloedcel;Witte bloedcel;Gistcel;Amoebe;Pantoffeldiertje;Virus;Stofmijt;Stuifmeel;Pollen;Druppel;Waterdruppel;Kristal;Zandkorrel;Schimmelspoor;Mier;Haar;Wimper;Bloemblad;Plantencel;Celwand;Celkern
warmte|Zon;Vuur;Kampvuur;Kaars;Lamp;Gloeilamp;Fornuis;Oven;Magnetron;Radiator;Verwarming;Warmtepomp;Open haard;Houtkachel;Zonnepaneel;Elektrische kachel;Terrasverwarmer;Motor;Benzinemotor;Lichaam;Wrijving
proefjes|Reageerbuis;Erlenmeyer;Bekerglas;Pipet;Maatbeker;Trechter;Brander;Spiritusbrander;Microscoop;Thermometer;Weegschaal;Liniaal;Stopwatch;Water;Zout;Azijn;Baking soda;Baksoda;Kleurstof;Ballon;Magneet;Elektrische draad;Batterij;Lampje;Spiegel;Vergrootglas;Handschoenen;Veiligheidsbril
lab|Microscoop;Reageerbuis;Buis;Pipet;Erlenmeyer;Bekerglas;Maatkolf;Centrifuge;Vrieskast;Koelkast;Thermometer;Brander;Balans;Weegschaal;Handschoenen;Veiligheidsbril;Witte jas;Labjas;Computer;Tafel;Stoel;Spoelbak;Kraan;Maatcilinder;Kweekbakje;Petrischaal
geleiders|Koper;Aluminium;IJzer;Staal;Goud;Zilver;Zout water;Zoutoplossing;Messing;Brons;Tin;Nikkel;Grafiet;Koolstof;Platina;Lithium;Zink;Titanium;Lood
bewegen|Auto;Fiets;Trein;Bus;Motor;Vliegtuig;Boot;Vogel;Vis;Mens;Hond;Kat;Robot;Ventilator;Wiel;Draaimolen;Windmolen;Water;Wolk;Blad;Ballon;Bal;Aarde;Maan;Planeet;Zon;Ster;Rivier;Gletsjer
aardappelGerechten|Friet;Patat;Aardappelpuree;Gekookte aardappelen;Gebakken aardappelen;Gepofte aardappel;Aardappelgratin;Stamppot;Hutspot;Boerenkoolstamppot;Zuurkoolstamppot;Andijviestamppot;Hete bliksem;Rösti;Hash browns;Aardappelsalade;Aardappelkroket;Aardappelwedges;Aardappelpartjes;Chips;Tortilla de patatas;Aardappelomelet;Kartoffelsalat;Shepherd's pie;Gratin dauphinois;Hasselbackaardappel
rijstGerechten|Nasi;Nasi goreng;Biryani;Risotto;Paella;Pilav;Sushi;Onigiri;Bibimbap;Jambalaya;Rijsttafel;Rijst met curry;Kip met rijst;Rijst met bonen;Arroz con pollo;Jollof rice;Rijstpap;Congee;Kheer;Kedgeree;Rijstsalade;Fried rice
pastaGerechten|Spaghetti bolognese;Spaghetti carbonara;Lasagne;Macaroni;Macaroni met kaas;Pasta pesto;Pasta arrabbiata;Pasta alfredo;Penne all'arrabbiata;Tagliatelle met zalm;Ravioli;Tortellini;Cannelloni;Ramen;Udon;Soba;Pad thai;Yakisoba;Chow mein;Bami;Pho;Laksa;Japchae;Dan dan noodles
sap|Appelsap;Sinaasappelsap;Jus d'orange;Druivensap;Perensap;Bessensap;Bietensap;Wortelsap;Tomatensap;Ananassap;Mangosap;Perziksap;Abrikozensap;Kersensap;Veenbessensap;Granaatappelsap;Cranberrysap;Multivruchtensap;Fruitmix;Groentesap;Watermeloensap;Citroensap;Limoensap;Passievruchtsap
bakken|Ei;Spiegelei;Roerei;Pannenkoek;Crêpe;Omelet;Aardappel;Gebakken aardappelen;Hamburger;Biefstuk;Kipfilet;Spek;Bacon;Worst;Champignon;Ui;Paprika;Courgette;Aubergine;Zalm;Visfilet;Tofu;Falafel;Tosti;Wentelteefje;Gebakken rijst;Wokgroenten
bbq|Hamburger;Worst;Worsten;Saté;Sate;Kipfilet;Kipspies;Kippenvleugel;Biefstuk;Ribeye;Spare ribs;Maiskolf;Paprika;Courgette;Aubergine;Champignon;Halloumi;Tofu;Zalm;Garnaal;Vis;Tonijn;Aardappel;Groentespies;Kebab;Gepofte aardappel
brood|Witbrood;Volkorenbrood;Bruinbrood;Stokbrood;Baguette;Ciabatta;Naan;Pita;Roti;Tortilla;Bagel;Brioche;Kaiserbroodje;Pistolet;Meergranenbrood;Roggebrood;Speltbrood;Desembrood;Krentenbrood;Suikerbrood;Mueslibrood;Zuurdesembrood;Tijgerbrood;Rozijnenbrood
waterVerschijnselen|Waterval;Golf;Branding;Getij;Eb;Vloed;Zeevonk;Mist;Regen;Dauw;Sneeuw;Hagel;IJzel;IJsgang;Bevriezing;Smeltende sneeuw;Verdamping;Condensatie;Regenboog;Geyser;Geiser;Kolkgat;Draaikolk;Stroomversnelling;Overstroming;Tsunami;Riviererosie;Meander
lenteBloemen|Tulp;Narcis;Krokus;Sneeuwklokje;Hyacint;Blauwe druifjes;Madeliefje;Pinksterbloem;Sleutelbloem;Anemoon;Bosanemoon;Vergeet-mij-nietje;Viooltje;Muur;Paardenbloem;Gele lis;Magnolia;Kersenbloesem;Appelbloesem;Bloesem;Forsythia;Rhododendron;Rododendron;Longkruid;Winterakoniet;Lenteklokje
zomerBloemen|Roos;Zonnebloem;Lavendel;Dahlia;Hortensia;Gerbera;Klaproos;Korenbloem;Madeliefje;Margriet;Pioenroos;Lupine;Anjer;Kamille;Petunia;Begonia;Cosmea;Duizendblad;Duizendschoon;Vingerhoedskruid;Kaasjeskruid;Zinnia;Tuinhibiscus;Echinacea;Rudbeckia
schilderijen|Mona Lisa;De Nachtwacht;Meisje met de parel;De sterrennacht;Zonnebloemen;De schreeuw;Guernica;Het laatste avondmaal;De geboorte van Venus;Het melkmeisje;De kus;De volharding der herinnering;De aardappeleters;De anatomische les van Dr. Tulp;De dansklas;De tuin der lusten;De kus van Klimt;American Gothic;Whistler's Mother
ballet|Ballet;Pointe;Spitzen;Spitzen schoenen;Balletschoenen;Tutu;Balletrok;Balletdanser;Ballerina;Grand jeté;Pirouette;Plié;Arabesque;Demi-plié;Balletstang;Danszaal;Spitzen;Choreografie;Zwanenmeer;De Notenkraker;Doornroosje;Pas de deux;Corps de ballet
boekPersonages|Harry Potter;Hermelien Griffel;Ron Wemel;Dumbledore;Voldemort;Frodo;Sam;Gandalf;Aragorn;Bilbo Balings;Katniss Everdeen;Peeta Mellark;Percy Jackson;Annabeth Chase;Sherlock Holmes;Dr. Watson;Alice;Pippi Langkous;Matilda;Kruimeltje;Pluk van de Petteflet;Jip;Janneke;Minoes;De kleine prins;Roodkapje;Assepoester;Willy Wonka;Huckleberry Finn;Tom Sawyer;Kapitein Nemo;Oliver Twist;Hamlet;Romeo;Julia
sprookjesfiguren|Roodkapje;Assepoester;Sneeuwwitje;Doornroosje;Rapunzel;Hans;Grietje;Heks;Wolf;Grote boze wolf;Prins;Prinses;Koning;Koningin;Dwerg;Kabouter;Fee;Peetmoeder;Zeemeermin;Pinokkio;Gelaarsde kat;Kikkerkoning;Reus;Draak;Elf;Tovenaar;Hans en Grietje;Boze stiefmoeder
mythischeWezens|Draak;Eenhoorn;Feniks;Griffioen;Minotaurus;Centaur;Cycloop;Trol;Elf;Dwerg;Zeemeermin;Sirene;Nimf;Hydra;Cerberus;Pegasus;Leviathan;Kraken;Weerwolf;Vampier;Yeti;Sfinx;Loch Nessmonster;Tanin;Fee;Geest;Reus
dierenFilms|The Lion King;Finding Nemo;Finding Dory;Zootopia;Madagascar;Kung Fu Panda;Bambi;Dumbo;101 Dalmatians;The Jungle Book;Tarzan;The Aristocats;Lady and the Tramp;Bolt;Ratatouille;A Bug's Life;The Secret Life of Pets;Ice Age;Spirit: Stallion of the Cimarron;Shark Tale;Happy Feet;Chicken Run;The Angry Birds Movie;Rio;The Fox and the Hound;The Little Mermaid
beroemdeGebouwen|Eiffeltoren;Empire State Building;Burj Khalifa;Colosseum;Taj Mahal;Sagrada Família;Big Ben;Tower Bridge;Sydney Opera House;Opera van Sydney;Paleis op de Dam;Rijksmuseum;Louvre;Brandenburger Tor;Vaticaan;Sint-Pietersbasiliek;Notre-Dame;Witte Huis;Kremlin;Piramides van Gizeh;Piramide van Cheops;Palace of Westminster;Guggenheim Museum Bilbao
woonkamer|Bank;Sofa;Stoel;Fauteuil;Tafel;Salontafel;Televisie;Tv;Lamp;Vloerkleed;Gordijn;Raam;Boekenkast;Kast;Wandplank;Schilderij;Plant;Kamerplant;Bloem;Kaars;Sierkussen;Kussen;Deken;Afstandsbediening;Speaker;Luidspreker;Spelcomputer;Laptop;Boek;Klok;Spiegel;Vaas;Fotolijst;Hocker
schrijven|Pen;Balpen;Vulpen;Potlood;Kleurpotlood;Stift;Viltstift;Fineliner;Krijt;Kroontjespen;Rietpen;Ganzenveer;Griffel;Marker;Whiteboardmarker;Permanent marker;Typemachine;Computer;Laptop;Smartphone;Tablet;Toetsenbord;Touchpen;Stylus
boeken|Roman;Kinderboek;Prentenboek;Stripboek;Kookboek;Reisboek;Biografie;Autobiografie;Thriller;Detective;Fantasyboek;Sciencefictionboek;Poëziebundel;Dichtbundel;Verhalenbundel;Schoolboek;Studieboek;Leerboek;Woordenboek;Atlas;Encyclopedie;Handleiding;Naslagwerk;E-book;Luisterboek;Audioboek;Dagboek;Notitieboek;Roman;Kinderboek;Prentenboek;Stripboek;Kookboek;Reisboek;Biografie;Autobiografie;Thriller;Detective;Fantasyboek;Sciencefictionboek;Poëziebundel;Dichtbundel;Verhalenbundel;Schoolboek;Studieboek;Leerboek;Woordenboek;Atlas;Encyclopedie;Handleiding;Naslagwerk;E-book;Luisterboek;Audioboek;Dagboek;Notitieboek
winkels|Supermarkt;Bakker;Slager;Groenteboer;Fruitwinkel;Kledingwinkel;Schoenenwinkel;Boekhandel;Drogist;Apotheek;Speelgoedwinkel;Elektronicawinkel;Computerwinkel;Bloemist;Tuincentrum;Bouwmarkt;Warenhuis;Meubelwinkel;Fietsenwinkel;Dierenwinkel;Sportwinkel;Souvenirwinkel;Kringloopwinkel;Markt;Visboer;Kaaswinkel;Snoepwinkel;Juwelier;Opticien
eten|Boterham;Brood;Stokbrood;Bagel;Croissant;Cracker;Toastje;Kaasje;Kaas;Ham;Salami;Fruit;Appel;Banaan;Druif;Aardbei;Blauwe bes;Framboos;Wortel;Komkommer;Tomaat;Sandwich;Wrap;Tosti;Salade;Pastasalade;Rijstsalade;Pannenkoek;Muffin;Koekje;Donut;Chips;Popcorn;Nootjes;Pinda;Rijstwafel;Rozijnen;Bitterbal;Kroket;Mini-loempia;Wafel
vervoer|Fiets;E-bike;Elektrische fiets;Auto;Bus;Trein;Tram;Metro;Scooter;Bromfiets;Motor;Motorfiets;Step;Elektrische step;Taxi;Bakfiets;Vouwfiets;Racefiets;Mountainbike;OV-fiets;Fietstaxi;Kano;Boot;Veerboot;Waterbus;Roeiboot;Zeilboot;Vliegtuig;Helikopter;Skateboard;Skates;Rolstoel;Bestelbus;Vrachtwagen;Camper;Caravan;Buurtbus;Trolleybus;Gondel;Kabelbaan
communicatie|Telefoon;Smartphone;Mobiele telefoon;Vaste telefoon;Radio;Walkietalkie;Laptop;Computer;Tablet;Brief;Postkaart;Fax;E-mail;Sms;Chatbericht;Videobellen;Microfoon;Megafoon;Televisie;Postduif;Telegraaf;Morsecode;Boodschap;App;Bericht;Internet;Sociale media;Oordopjes
bestanden|PDF;TXT;DOCX;XLSX;PPTX;JPG;JPEG;PNG;GIF;WebP;SVG;MP3;MP4;MOV;WAV;FLAC;ZIP;RAR;HTML;CSS;JS;JSON;CSV;XML;EXE;APK;EPUB;MOBI;PSD;TIFF
batterijSpullen|Afstandsbediening;Horloge;Wandklok;Smartphone;Telefoon;Laptop;Tablet;Zaklamp;Fietslamp;Draadloze muis;Draadloos toetsenbord;Gamecontroller;Speelgoedauto;Elektrische tandenborstel;Elektrische fiets;Batterijradio;Draagbare speaker;Koptelefoon;Oordopjes;Fotocamera;Rekenmachine;Digitale thermometer;Rookmelder;Powerbank;Wekker
internetDingen|Zoeken;Google gebruiken;Mailen;E-mail sturen;Chatten;Appen;WhatsAppen;Videobellen;Video kijken;YouTube kijken;Muziek luisteren;Streamen;Film kijken;Gamen;Online winkelen;Bestellen;Betalen;Boeken;Reserveren;Nieuws lezen;Foto's delen;Foto uploaden;Berichten versturen;Leren;Huiswerk maken;Programmeren;Bloggen;Sociale media bekijken
publiekePlekken|Supermarkt;Winkelcentrum;Station;Vliegveld;School;Ziekenhuis;Bibliotheek;Museum;Stadhuis;Markt;Pretpark;Dierentuin;Zwembad;Sporthal;Stadion;Park;Strand;Bioscoop;Theater;Restaurant;Café;Plein;Winkelstraat;Kermis;Concertzaal;Treinstation;Busstation;Postkantoor;Gemeentehuis
cultureleFestivals|Carnaval;Holi;Diwali;Oktoberfest;Mardi Gras;Songkran;Hanami;Día de Muertos;Samba Parade;Rio Carnival;Carnaval van Rio;Notting Hill Carnival;North Sea Jazz Festival;Glastonbury;Tomorrowland;Lowlands;Pinkpop;Rock Werchter;Dance Valley;Amsterdam Dance Event;Oerol;Celtic Connections;Festival de Flamenco;WOMAD;Inti Raymi;Zomercarnaval Rotterdam;Chinese Nieuwjaar;Festival of Lights;Midherfstfestival;Wacken Open Air
chauffeur|Stuur;Stuurwiel;Gaspedaal;Rempedaal;Koppeling;Schakelpook;Versnellingspook;Snelheidsmeter;Spiegel;Buitenspiegel;Achteruitkijkspiegel;Dashboard;Navigatie;GPS;Radio;Microfoon;Fluit;Dienstregeling;Routekaart;Treincomputer;Remhendel;Rijregelaar;Rijbewijs;OV-kaartlezer;Deurknop;Rem;Gordel;Richtingaanwijzer;Hoorn;Claxon;Stoplicht;Ruitenwisser;Kaart;Handrem
nlDieren|Ree;Hert;Edelhert;Damhert;Wild zwijn;Vos;Wolf;Das;Egel;Eekhoorn;Haas;Konijn;Otter;Bever;Boommarter;Steenmarter;Wezel;Hermelijn;Bunzing;Muizensoort;Huismuis;Bosmuis;Bruine rat;Vleermuis;Kerkuil;Bosuil;Ransuil;Mus;Roodborstje;Merel;Ekster;Kraai;Kauw;Spreeuw;Zwaluw;Meeuw;Eend;Zwaan;Gans;Kievit;Grutto;Reiger;Ooievaar;Lepelaar;Buizerd;Torenvalk;Specht;Koolmees;Pimpelmees;Kikker;Pad;Ringslang;Hazelworm;Zandhagedis;Snoek;Baars;Karper;Brasem;Voorn
feestdagen|Nieuwjaar;Nieuwjaarsdag;Pasen;Eerste paasdag;Tweede paasdag;Hemelvaart;Pinksteren;Eerste pinksterdag;Tweede pinksterdag;Koningsdag;Bevrijdingsdag;Kerstmis;Eerste kerstdag;Tweede kerstdag;Sinterklaas;Kerstavond;Oudjaarsdag;Oudejaarsavond;Carnaval;Halloween;Valentijnsdag;Moederdag;Vaderdag;Suikerfeest;Offerfeest;Chanoeka;Diwali;Holi;Lunar New Year
getallen|0;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33;34;35;36;37;38;39;40;41;42;43;44;45;46;47;48;49;50;51;52;53;54;55;56;57;58;59;60;61;62;63;64;65;66;67;68;69;70;71;72;73;74;75;76;77;78;79;80;81;82;83;84;85;86;87;88;89;90;91;92;93;94;95;96;97;98;99;Nul;Een;Twee;Drie;Vier;Vijf;Zes;Zeven;Acht;Negen;Tien;Elf;Twaalf;Dertien;Veertien;Vijftien;Zestien;Zeventien;Achttien;Negentien;Twintig`;
  const CATS = [
    ["Dieren", "D", "🐾 DIEREN"],
    ["Aardrijkskunde", "A", "🌍 AARDRIJKSKUNDE"],
    ["Sport", "S", "⚽ SPORT"],
    ["Muziek", "M", "🎵 MUZIEK"],
    ["Mode", "O", "👗 MODE"],
    ["Geschiedenis", "G", "🏛️ GESCHIEDENIS"],
    ["Ruimte", "R", "🪐 RUIMTE"],
    ["Wetenschap", "W", "🔬 WETENSCHAP"],
    ["Eten", "E", "🍽️ ETEN"],
    ["Natuur", "N", "🌿 NATUUR"],
    ["Cultuur", "C", "🎨 CULTUUR"],
    ["Vervoer", "V", "🚗 VERVOER"],
    ["Algemene kennis", "K", "🧩 ALGEMENE KENNIS"]
  ];

  const BY_CODE = Object.fromEntries(
    CATS.map(x => [x[1], x[0]])
  );

  const LABEL = Object.fromEntries(
    CATS.map(x => [x[0], x[2]])
  );

  const clean = x => String(x).normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "en")
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/[^\p{L}\p{N}]/gu, "");

  // Gelijkwaardige antwoorden samenvoegen.
  // Synoniemen tellen niet dubbel mee voor raketten.

  const ALIASES = [
    ["Giraffe", "Giraf"],
    ["Jachtluipaard", "Cheetah"],
    ["Patat", "Friet"],
    ["Nederland", "Holland", "The Netherlands"],
    ["Verenigde Staten", "VS", "USA", "United States"],
    ["Verenigd Koninkrijk", "VK", "UK", "United Kingdom"],
    ["Groot-Brittannië", "Great Britain"],
    ["Saoedi-Arabië", "Saudi-Arabië", "Saudi-Arabia"],
    ["Maan", "De maan"],
    ["Zon", "De zon"],
    ["Joeri Gagarin", "Yuri Gagarin"],
    ["Djembé", "Djembe"],
    ["Ukelele", "Ukulele"],
    ["Spaghetti bolognese", "Pasta bolognese"],
    ["Goudvis", "Gouden vis"],
    ["Zuid-Korea", "Zuid Korea"],
    ["Noord-Korea", "Noord Korea"]
  ];

  const CANON = new Map();
  const ALIAS_BANK = new Map();

  ALIASES.forEach(group => {
    group.forEach(name => {
      CANON.set(clean(name), group[0]);

      ALIAS_BANK.set(
        clean(name),
        group.filter(x => x !== name)
      );
    });
  });

  const canon = name =>
    CANON.get(clean(name)) || name;

  // Veelvoorkomende antwoorden krijgen minder punten.

  const COMMON = new Set(`Hond;Kat;Koe;Kip;Paard;Vis;Haai;Dolfijn;Walvis;
    Leeuw;Tijger;Olifant;Zebra;Konijn;Varken;Schaap;Geit;Aap;
    Nederland;België;Duitsland;Frankrijk;Spanje;Italië;China;
    Amerika;Engeland;Amsterdam;Rotterdam;Parijs;Londen;
    Voetbal;Basketbal;Tennis;Zwemmen;Hardlopen;Fiets;
    Gitaar;Piano;Drumstel;Zanger;Taylor Swift;
    Broek;Jas;Schoen;T-shirt;Trui;Sneaker;Rood;Blauw;Geel;
    Napoleon;Rome;Piramide;Zon;Maan;Aarde;Mars;
    Water;Zout;Suiker;Elektriciteit;Bloem;Boom;Gras;
    Pizza;Pasta;Brood;Kaas;Melk;Banaan;Appel;Friet;
    Film;Boek;Schilderij;Auto;Bus;Trein;Vliegtuig;
    Computer;Telefoon;School;Pen;Stoel;Tafel`
    .split(";")
    .map(x => clean(x.trim()))
    .filter(Boolean));

  // Aanvullende antwoordbanken inlezen.

  const extra = Object.create(null);

  BANKEN.split("\n")
    .map(x => x.trim())
    .filter(Boolean)
    .forEach(line => {
      const at = line.indexOf("|");

      if (at < 1) {
        throw Error(
          "V8 bankregel ongeldig: " + line
        );
      }

      const tag = line.slice(0, at).trim();

      if (extra[tag]) {
        throw Error("V8 bank dubbel: " + tag);
      }

      extra[tag] = line.slice(at + 1)
        .split(";")
        .map(x => x.trim())
        .filter(Boolean);
    });

  // Stabiele berekening voor gelijke zeldzaamheidsscores.

  function hash(x) {
    let h = 2166136261;

    for (let i = 0; i < x.length; i++) {
      h ^= x.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }

    return h >>> 0;
  }

  // =====================================================
  // NIEUW RAKETSYSTEEM V8
  //
  // 1 - 50 antwoorden       = 1 raket
  // 51 - 150 antwoorden     = 2 raketten
  // 151 - 250 antwoorden    = 3 raketten
  // 251 - 350 antwoorden    = 4 raketten
  // Iedere volgende 100     = 1 extra raket
  // =====================================================

  const rocketCount = n =>
    n <= 50
      ? 1
      : 2 + Math.floor((n - 51) / 100);

  const newByCat = Object.fromEntries(
    CATS.map(c => [c[0], []])
  );

  const newQuestions = [];
  let cat = "";

  const titles = new Set();

  // Alle 650 nieuwe vragen verwerken.

  V8_VRAGEN.split("\n")
    .map(x => x.trim())
    .filter(Boolean)
    .forEach(line => {

      if (line.startsWith("# ")) {
        cat = line.slice(2).trim();

        if (!newByCat[cat]) {
          throw Error(
            "Onbekende V8-categorie: " + cat
          );
        }

        return;
      }

      const sep = line.indexOf("|");

      if (sep < 2 || !cat) {
        throw Error("Foute V8-vraag: " + line);
      }

      const questionText =
        line.slice(0, sep).trim();

      const titleKey = clean(questionText);

      if (titles.has(titleKey)) {
        throw Error(
          "Dubbele V8-vraag: " + questionText
        );
      }

      titles.add(titleKey);

      const idx = newByCat[cat].length + 1;

      const id =
        "qb650-" +
        clean(cat) +
        "-" +
        String(idx).padStart(2, "0");

      const sources = line.slice(sep + 1)
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);

      const candidates = new Map();

      const blocked = new Set(
        sources
          .filter(x => x[0] === "!")
          .map(x => clean(x.slice(1)))
      );

      // Geldige antwoorden toevoegen.
      // Dubbele namen worden samengevoegd.

      function add(name, rarity, inheritedAliases) {

        const normalized = clean(name);

        if (!normalized || blocked.has(normalized)) {
          return;
        }

        const preferred = canon(name);
        const key = clean(preferred);

        if (blocked.has(key)) {
          return;
        }

        const aliases = [
          ...(inheritedAliases || []),
          ...(ALIAS_BANK.get(normalized) || [])
        ].filter(x => clean(x) !== key);

        if (!candidates.has(key)) {
          candidates.set(key, {
            name: preferred,

            rarity: Math.max(
              0,
              Math.min(1, rarity)
            ),

            aliases: new Set(),
            appearances: 0
          });
        }

        const item = candidates.get(key);

        item.rarity = Math.min(
          item.rarity,
          rarity
        );

        item.appearances++;

        if (name !== item.name) {
          item.aliases.add(name);
        }

        aliases.forEach(x => item.aliases.add(x));
      }

      // Bestaande en nieuwe antwoordbanken combineren.

      sources.forEach(token => {

        if (token[0] === "!") {
          return;
        }

        if (token[0] === "@") {

          const bank = extra[token.slice(1)];

          if (!bank) {
            throw Error(
              "Onbekende antwoordbank " +
              token +
              " bij " +
              questionText
            );
          }

          bank.forEach((name, i) => {
            add(
              name,
              0.05 + 0.88 * i /
                Math.max(1, bank.length - 1),
              []
            );
          });

          return;
        }

        const match =
          /^([DASMOGRWENCVK])?(\d+)(?:-(\d+))?$/
          .exec(token);

        if (!match) {
          throw Error(
            "Onbekende bron " +
            token +
            " bij " +
            questionText
          );
        }

        const fromCat = match[1]
          ? BY_CODE[match[1]]
          : cat;

        const a = Number(match[2]);
        const b = Number(match[3] || a);

        if (b < a || b >= OLD[fromCat].length) {
          throw Error(
            "Bron buiten bereik " +
            token +
            " bij " +
            questionText
          );
        }

        for (let j = a; j <= b; j++) {

          const existing = OLD[fromCat][j];

          existing.answers.forEach((answer, k) => {
            add(
              answer.answer,
              0.08 + 0.82 * k /
                Math.max(
                  1,
                  existing.answers.length - 1
                ),
              answer.aliases || []
            );
          });
        }
      });

      // Iedere vraag moet voldoende antwoorden bevatten.

      if (candidates.size < 3) {
        throw Error(
          "V8 te weinig antwoorden bij " +
          questionText
        );
      }

      // =================================================
      // ZELDZAAMHEIDSSCORES
      //
      // Bekende antwoorden krijgen minder punten.
      // Bijzondere antwoorden krijgen meer punten.
      // Dit zijn geschatte scores, geen spelersstatistieken.
      // =================================================

      const ranked = [...candidates.values()]
        .map(item => {

          const base = item.name.length;

          const lengthBoost =
            0.10 * Math.min(base, 24) / 24;

          const frequencyBoost =
            0.08 / Math.max(1, item.appearances);

          let estimate = Math.min(
            0.99,
            0.78 * item.rarity +
            lengthBoost +
            frequencyBoost
          );

          if (COMMON.has(clean(item.name))) {
            estimate *= 0.15;
          }

          return {
            item,
            score: 10 + Math.round(89 * estimate)
          };
        })
        .sort((a, b) =>
          b.score - a.score ||
          b.item.name.length - a.item.name.length ||
          hash(id + b.item.name) -
          hash(id + a.item.name)
        );

      // De zeldzaamste antwoorden worden raketantwoorden.

      const rockets = new Set(
        ranked
          .slice(0, rocketCount(ranked.length))
          .map(x => clean(x.item.name))
      );

      const answers = ranked.map(({ item, score }) => {

        const isRocket =
          rockets.has(clean(item.name));

        return {
          answer: item.name,

          aliases: [...item.aliases].filter(
            x => clean(x) !== clean(item.name)
          ),

          points: isRocket
            ? 100
            : Math.min(99, score),

          isRocket
        };
      });

      // Nieuwe vraag opslaan.

      const entry = {
        id,
        baseQuestionId: id,
        topicId: id,
        qb650Category: cat,
        category: LABEL[cat],
        question: questionText,
        hint: "Denk aan een minder voor de hand liggend goed antwoord!",
        answers,
        qb650: true,
        qb650v8: true
      };

      newQuestions.push(entry);
      newByCat[cat].push(entry);
    });

  // =====================================================
  // AUTOMATISCHE CONTROLE VAN DE VRAGENBANK
  // =====================================================

  if (
    newQuestions.length !== 650 ||
    Object.keys(newByCat).length !== 13 ||
    Object.values(newByCat).some(
      items => items.length !== 50
    )
  ) {
    throw Error(
      "V8 is niet compleet: " +
      newQuestions.length +
      " vragen."
    );
  }

  const summary = Object.entries(newByCat)
    .map(([naam, items]) => ({
      categorie: naam,

      vragen: items.length,

      antwoorden: items.reduce(
        (n, q) => n + q.answers.length,
        0
      ),

      raketten: items.reduce(
        (n, q) =>
          n + q.answers.filter(a => a.isRocket).length,
        0
      )
    }));

  // De nieuwe vragenbank beschikbaar maken voor Daily.

  window.QB650_QUESTIONS = newQuestions;
  window.QB650_BY_CATEGORY = newByCat;
  window.QB650_VERSION = "QB650-V8-2026-11-27";

  // Hulpmiddelen om de vragenbank te controleren.

  window.QB650_V8_DEBUG = Object.freeze({

    summary: () => summary.map(x => ({ ...x })),

    rocketCount,

    check: (categorie, nummer, antwoord) => {

      const q =
        newByCat[categorie] &&
        newByCat[categorie][nummer - 1];

      if (!q) {
        return null;
      }

      const key = clean(antwoord);

      const found = q.answers.find(a =>
        clean(a.answer) === key ||
        a.aliases.some(x => clean(x) === key)
      );

      return found
        ? {
            antwoord: found.answer,
            punten: found.points,
            raket: found.isRocket
          }
        : null;
    }
  });

  console.log(
    "🎈 QuizBallon V8 actief: 650 nieuwe vragen, 13 × 50."
  );

  console.table(summary);

})();
