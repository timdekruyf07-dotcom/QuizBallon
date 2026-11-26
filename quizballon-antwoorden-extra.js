/* ============================================================
   QUIZBALLON - CENTRALE ANTWOORDENBANK V2

   DOEL:
   - Meer geldige antwoorden voor alle kennisvragen
   - Synoniemen en alternatieve schrijfwijzen
   - Geen dubbele antwoorden
   - Bestaande punten behouden
   - Raketantwoorden behouden
   - Lettervragen correct behandelen
   - Geschikt voor Daily en Duel

   GEBRUIK:
   window.QB_EXTRA_ANSWERS.apply()

   BELANGRIJK:
   Dit is een aanvullende, gecontroleerde woordenbank.
   Het is geen volledige wereldencyclopedie.
============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     1. NORMALISEREN
  ========================================================== */

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’'‘`]/g, "")
      .replace(/[-–—_]/g, " ")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function letters(value) {
    return normalize(value).replace(/[^a-z]/g, "");
  }

  function makeList(text) {
    return text
      .split("|")
      .map(value => value.trim())
      .filter(Boolean);
  }

  /* ==========================================================
     2. AANVULLENDE ANTWOORDEN PER ONDERWERP

     De bestaande lijsten blijven behouden.
     Hier voegen we vooral extra namen toe.

     Voeg later gerust nieuwe antwoorden toe
     met een | tussen de namen.
  ========================================================== */

  const BANK = {

    /* -------------------------
       DIEREN
    ------------------------- */

    vogels: makeList(`
      fregatvogel|koningsalbatros|reuzenalbatros|
      wanderalbatros|zwartbrauwalbatros|
      zwartvoetpinguïn|galapagospinguïn|
      magelhaenpinguïn|adéliepinguïn|
      ezelspinguïn|macaronipinguïn|
      rotsspringerpinguïn|geeloogpinguïn|
      dwergpinguïn|gentoo-pinguïn|
      roodborsttoekan|reuzentoekan|
      zwavelborsttoekan|arassari|
      groene aracari|regenboogtoekan|
      hyacintara|groenvleugelara|
      blauwgele ara|roodschouderara|
      blauwkeelara|militaire ara|
      blauwvoorhoofdamazone|
      geelvoorhoofdamazone|kraagpapegaai|
      eclectuspapegaai|grijze roodstaart|
      geelkuifkaketoe|palmpapegaai|
      zwarte kaketoe|roze kaketoe|
      regenbooglori|blauwe lori|
      goudfazant|zilverfazant|
      lady-amherstfazant|tragopaan|
      satyrtragopaan|blauwe pauw|
      groene pauw|Congopauw|
      hoornraaf|zuidelijke hoornraaf|
      helmkasuaris|dwergkasuaris|
      noordelijke kasuaris|
      emoe|nandoe|Darwins nandoe|
      kiwi|bruine kiwi|kleine gevlekte kiwi|
      kakapo|kea|takahe|weka|
      kookaburra|lachijsvogel|
      ijsvogel met blauwe vleugels|
      lilaborstscharrelaar|scharrelaar|
      bijeneter|karmijnrode bijeneter|
      blauwe bijeneter|groene bijeneter|
      paradijsvogel|koningsparadijsvogel|
      Wilsons paradijsvogel|
      reuzenparadijsvogel|
      Andesrotshaan|rode rotshaan|
      quetzal|resplendent quetzal|
      harpyarend|Filipijnse arend|
      steenarend|Amerikaanse zeearend|
      witbuikzeearend|zeearend|
      Andescondor|Californische condor|
      lammergier|monniksgier|
      kalkoengier|secretarisvogel|
      kroonkraanvogel|Japanse kraanvogel|
      paradijskraanvogel|jufferkraanvogel|
      schoenbekooievaar|maraboe|
      jabiroe|rode ibis|heilige ibis|
      flamingo|kleine flamingo|
      Chileense flamingo|Amerikaanse flamingo|
      roze pelikaan|bruine pelikaan|
      hoatzin|zonneroerdomp|
      fregatvogel|blauwvoetgent|roodpootgent
    `),

    zoogdieren: makeList(`
      aardvarken|aardwolf|agouti|alpaca|
      alpenmarmot|Amoerpanter|Andeskat|
      antilope|Aziatische olifant|
      Afrikaanse olifant|Afrikaanse wilde hond|
      ayeaye|baviaan|beermarter|binturong|
      beverrat|bilby|bonobo|boomkangoeroe|
      boomstekelvarken|bruine beer|
      buidelmarter|buidelrat|buideldas|
      capibara|caracal|cheeta|chinchilla|
      coyote|dassie|dingo|dikdik|doejong|
      dolfijn|dromedaris|dwergmangoest|
      dwergnijlpaard|dwergspitsmuis|
      dwergvleermuis|egeltenrek|eland|
      elandantilope|elefantenspitsmuis|
      fennek|fossa|galago|gaur|
      geelbuikmarmot|gelada|genetkat|
      gerbil|gibbon|giraffe|gnoe|
      goudjakhals|gouden mol|gorilla|
      grijze zeehond|grond eekhoorn|
      guanaco|hamster|hazelmuis|
      hermelijn|honingdas|hoefijzerneus|
      ijsbeer|impala|indri|jakhals|
      jaguar|Japanse makaak|jerboa|
      jachtluipaard|kafferbuffel|
      kameel|kangoeroe|kariboe|
      klipdas|koala|koedoe|konijn|
      langoorvleermuis|lamantijn|
      lemuur|lemur|luiaard|lynx|
      manenwolf|mandril|mangabe|
      mangoest|mara|margay|
      marmot|meervleermuis|mierene gel|
      miereneter|muskusos|muskusrat|
      nevelpanter|neushoorn|neusbeer|
      noordkaper|ocelot|okapi|olifant|
      olifantspitsmuis|opossum|orang-oetan|
      orka|otter|paca|panda|pangolin|
      pekari|pelsrob|pinguïneter|
      plompe lori|poolvos|potvis|
      prairiehond|poema|quokka|
      ratel|ree|rendier|reuzenmiereneter|
      reuzenotter|ringstaartmaki|
      ringelrob|rode panda|rode vos|
      saiga|sifaka|siamang|
      sneeuwluipaard|solenodon|
      springbok|springhaas|
      springspitsmuis|springmuis|
      steenbok|steenmarter|stokstaartje|
      stinkdier|tapir|takin|
      tamarinde|tamarin|tarsier|
      Tasmaanse duivel|tenrek|tijger|
      tuimelaar|vicuña|vingerdier|
      vliegende eekhoorn|vliegende vos|
      vogelbekdier|walrus|wallaby|
      waterbuffel|waterhert|waterzwijn|
      wasbeer|wasbeerhond|wezel|
      wisent|wombat|wolf|yak|
      zebra|zeeolifant|zeehond|
      zeeleeuw|zeekoe|zwarte beer|
      zwartvoetkat|zadelrob
    `),

    zeedieren: makeList(`
      ansjovis|aalscholver|anemoonvis|
      barracuda|beloega|bidsprinkhaankreeft|
      blauwe haai|blauwvintonijn|
      bruinvis|clownvis|congeraal|
      degenkrab|doejong|dolfijn|
      doopvontschelp|dwergvinvis|
      egelvis|engelvis|garnaal|
      gestreepte dolfijn|goblinhaai|
      grijze walvis|groene zeeschildpad|
      gulperaal|haai|hamerhaai|
      haring|haringhaai|heilbot|
      heremietkreeft|hoefijzerkrab|
      inktvis|Jan-van-gent|kabeljauw|
      karetschildpad|koraalduivel|
      koraalpoliep|koraalvlinder|
      kogelvis|koolvis|krab|
      kreeft|krill|kwal|langoustine|
      lantaarnvis|lederschildpad|
      makreel|manta|mantarog|
      mantisgarnaal|maanvis|mossel|
      murene|narwal|nautilus|
      noordkaper|oester|octopus|
      oceaanmaanvis|orka|paling|
      papegaaivis|pijlinktvis|
      pijlstaartrog|pistoolgarnaal|
      platvis|potvis|reuzenhaai|
      reuzeninktvis|ringelrob|
      rog|sardine|schelvis|
      scheermes|schol|sidderrog|
      sint-jakobsschelp|slangster|
      spinkrab|steenvis|stekelrog|
      tarbot|tijgerhaai|tong|
      tonijn|trekkervis|tuimelaar|
      walrus|walvishaai|witte haai|
      zeebaars|zeeduivel|zeee gel|
      zeeëgel|zeekat|zeekomkommer|
      zeekreeft|zeeleeuw|zeenaald|
      zeepaardje|zeepok|zeeschildpad|
      zeester|zeewolf|zwaardvis
    `),

    hondenrassen: makeList(`
      Affenpinscher|Airedaleterriër|
      Akita|Alaskan malamute|
      Amerikaanse bulldog|
      Australische herder|
      Australische kelpie|
      Australian cattle dog|
      Basenji|Basset hound|
      Bearded collie|Bedlingtonterriër|
      Belgische herder|Berger picard|
      Bichon havanais|Bloodhound|
      Boomer|Borderterriër|
      Bostonterriër|Briard|
      Bullterriër|Bullmastiff|
      Cairnterriër|Cane corso|
      Cavalier king charles spaniël|
      Chowchow|Clumber spaniel|
      Cockapoo|Cockerspaniël|
      Dalmatiër|Dandie dinmontterriër|
      Duitse dog|Duitse staande korthaar|
      Engelse setter|Engelse springerspaniël|
      Entlebucher sennenhond|
      Eurasier|Fieldspaniël|
      Flatcoated retriever|
      Foxterriër|Friese stabij|
      Gordon setter|Groenendaeler|
      Ierse setter|Ierse terriër|
      Ierse wolfshond|Italiaans windhondje|
      Jackrussellterriër|Keeshond|
      Kooikerhondje|Kuvasz|
      Labradoodle|Lagotto romagnolo|
      Lakelandterriër|Leonberger|
      Lhasa apso|Maltipoo|
      Mastiff|Mechelse herder|
      Newfoundlander|Noorse elandhond|
      Noorse lundehond|Old English sheepdog|
      Papillon|Pekingees|Pharaohond|
      Pitbull|Pointer|Pomeranian|
      Portugese waterhond|Puli|
      Rhodesian ridgeback|Schipperke|
      Schnauzer|Schotse collie|
      Schotse terriër|Sharpei|
      Sheltie|Shih tzu|
      Siberische husky|Staffordshire bullterriër|
      Tibetaanse terriër|Tibetaanse mastiff|
      Toypoedel|Vizsla|
      Weimaraner|Welsh corgi|
      West Highland white terrier|
      Whippet|Wetterhoun|Yorkshire terriër
    `),

    /* -------------------------
       AARDRIJKSKUNDE
    ------------------------- */

    wereldlanden: makeList(`
      Afghanistan|Albanië|Algerije|
      Andorra|Angola|Antigua en Barbuda|
      Argentinië|Armenië|Australië|
      Azerbeidzjan|Bahama's|Bahrein|
      Bangladesh|Barbados|Belarus|
      België|Belize|Benin|Bhutan|
      Bolivia|Bosnië en Herzegovina|
      Botswana|Brazilië|Brunei|
      Bulgarije|Burkina Faso|Burundi|
      Cambodja|Canada|Centraal-Afrikaanse Republiek|
      Chili|China|Colombia|Comoren|
      Congo-Brazzaville|Costa Rica|
      Cuba|Cyprus|Denemarken|
      Djibouti|Dominica|
      Dominicaanse Republiek|Duitsland|
      Ecuador|Egypte|El Salvador|
      Equatoriaal-Guinea|Eritrea|
      Estland|Eswatini|Ethiopië|
      Fiji|Filipijnen|Finland|Frankrijk|
      Gabon|Gambia|Georgië|Ghana|
      Grenada|Griekenland|Guatemala|
      Guinee|Guinee-Bissau|Guyana|
      Haïti|Honduras|Hongarije|
      Ierland|IJsland|India|Indonesië|
      Irak|Iran|Israël|Italië|
      Ivoorkust|Jamaica|Japan|Jemen|
      Jordanië|Kaapverdië|Kameroen|
      Kazachstan|Kenia|Kirgizië|
      Kiribati|Koeweit|Kroatië|
      Laos|Lesotho|Letland|Libanon|
      Liberia|Libië|Liechtenstein|
      Litouwen|Luxemburg|
      Madagaskar|Malawi|Maleisië|
      Maldiven|Mali|Malta|Marokko|
      Marshalleilanden|Mauritanië|
      Mauritius|Mexico|Micronesië|
      Moldavië|Monaco|Mongolië|
      Montenegro|Mozambique|Myanmar|
      Namibië|Nauru|Nepal|Nederland|
      Nicaragua|Nieuw-Zeeland|Niger|
      Nigeria|Noord-Korea|Noord-Macedonië|
      Noorwegen|Oeganda|Oekraïne|
      Oezbekistan|Oman|Oostenrijk|
      Oost-Timor|Pakistan|Palau|
      Panama|Papoea-Nieuw-Guinea|
      Paraguay|Peru|Polen|Portugal|
      Qatar|Roemenië|Rusland|Rwanda|
      Saint Kitts en Nevis|
      Saint Lucia|
      Saint Vincent en de Grenadines|
      Salomonseilanden|Samoa|San Marino|
      Sao Tomé en Principe|
      Saoedi-Arabië|Senegal|Servië|
      Seychellen|Sierra Leone|
      Singapore|Slovenië|Slowakije|
      Somalië|Spanje|Sri Lanka|
      Soedan|Suriname|Syrië|
      Tadzjikistan|Tanzania|Thailand|
      Togo|Tonga|Trinidad en Tobago|
      Tsjaad|Tsjechië|Tunesië|
      Turkije|Turkmenistan|Tuvalu|
      Uruguay|Vanuatu|Vaticaanstad|
      Venezuela|Verenigd Koninkrijk|
      Verenigde Arabische Emiraten|
      Verenigde Staten|Vietnam|
      Zambia|Zimbabwe|Zuid-Afrika|
      Zuid-Korea|Zuid-Soedan|
      Zweden|Zwitserland
    `),

    afrikalanden: makeList(`
      Algerije|Angola|Benin|Botswana|
      Burkina Faso|Burundi|Centraal-Afrikaanse Republiek|
      Comoren|Democratische Republiek Congo|
      Djibouti|Egypte|Equatoriaal-Guinea|
      Eritrea|Eswatini|Ethiopië|
      Gabon|Gambia|Ghana|Guinee|
      Guinee-Bissau|Ivoorkust|Kaapverdië|
      Kameroen|Kenia|Lesotho|Liberia|
      Libië|Madagaskar|Malawi|Mali|
      Marokko|Mauritanië|Mauritius|
      Mozambique|Namibië|Niger|
      Nigeria|Oeganda|Republiek Congo|
      Rwanda|Sao Tomé en Principe|
      Senegal|Seychellen|Sierra Leone|
      Somalië|Soedan|Tanzania|Togo|
      Tsjaad|Tunesië|Zambia|Zimbabwe|
      Zuid-Afrika|Zuid-Soedan
    `),

    europalanden: makeList(`
      Albanië|Andorra|Armenië|
      Azerbeidzjan|België|Bosnië en Herzegovina|
      Bulgarije|Cyprus|Denemarken|
      Duitsland|Estland|Finland|
      Frankrijk|Georgië|Griekenland|
      Hongarije|Ierland|IJsland|
      Italië|Kazachstan|Kroatië|
      Letland|Liechtenstein|Litouwen|
      Luxemburg|Malta|Moldavië|Monaco|
      Montenegro|Nederland|Noord-Macedonië|
      Noorwegen|Oekraïne|Oostenrijk|
      Polen|Portugal|Roemenië|Rusland|
      San Marino|Servië|Slovenië|
      Slowakije|Spanje|Tsjechië|
      Turkije|Vaticaanstad|
      Verenigd Koninkrijk|Wit-Rusland|
      Zweden|Zwitserland
    `),

    hoofdsteden: makeList(`
      Abu Dhabi|Abuja|Accra|Addis Abeba|
      Algiers|Amman|Amsterdam|Ankara|
      Antananarivo|Asunción|Athene|
      Bagdad|Bakoe|Bamako|Bangkok|
      Banjul|Basseterre|Beijing|
      Beiroet|Belgrado|Belmopan|
      Berlijn|Bern|Bishkek|Bissau|
      Bogotá|Boekarest|Boedapest|
      Brasília|Bratislava|Brazzaville|
      Bridgetown|Brussel|Buenos Aires|
      Caïro|Canberra|Caracas|Castries|
      Chisinau|Colombo|Conakry|
      Kopenhagen|Dakar|Damascus|
      Dhaka|Dili|Djibouti|Dodoma|
      Doha|Dublin|Dushanbe|Freetown|
      Funafuti|Gaborone|Georgetown|
      Gitega|Guatemala-Stad|Hanoi|
      Harare|Havana|Helsinki|
      Honiara|Islamabad|Jakarta|
      Jerevan|Jeruzalem|Juba|
      Kabul|Kampala|Kathmandu|
      Khartoem|Kigali|Kingston|
      Kingstown|Kinshasa|
      Kuala Lumpur|Koeweit-Stad|
      Kyiv|La Paz|Libreville|
      Lilongwe|Lima|Lissabon|
      Ljubljana|Lomé|Londen|
      Luanda|Lusaka|Luxemburg|
      Madrid|Majuro|Malabo|Malé|
      Manama|Manila|Maputo|
      Maseru|Mbabane|Mexico-Stad|
      Minsk|Mogadishu|Monaco|
      Monrovia|Montevideo|Moroni|
      Moskou|Nairobi|Nassau|
      Naypyidaw|New Delhi|Niamey|
      Nicosia|Nouakchott|
      Nuku'alofa|Oslo|Ottawa|
      Ouagadougou|Palikir|Panama-Stad|
      Paramaribo|Parijs|Phnom Penh|
      Podgorica|Port Louis|Port Moresby|
      Port of Spain|Port-au-Prince|
      Port Vila|Praag|Praia|
      Pretoria|Pyongyang|Quito|
      Rabat|Reykjavik|Riga|
      Riyad|Rome|Roseau|
      San José|San Marino|San Salvador|
      Santiago|Santo Domingo|
      Sarajevo|Seoul|Singapore|
      Skopje|Sofia|Stockholm|
      Sucre|Suva|Taipei|Tallinn|
      Tarawa|Tasjkent|Tbilisi|
      Teheran|Thimphu|Tirana|
      Tokio|Tripoli|Tunis|
      Ulaanbaatar|Vaduz|Valletta|
      Vaticaanstad|Victoria|
      Vientiane|Vilnius|Warschau|
      Washington|Wellington|Wenen|
      Windhoek|Yamoussoukro|
      Yaoundé|Zagreb
    `),

    japanseSteden: makeList(`
      Akashi|Akita|Amagasaki|
      Asahikawa|Aomori|Atami|
      Beppu|Chiba|Chitose|
      Fujisawa|Fukui|Fukuoka|
      Fukushima|Gifu|Hachinohe|
      Hachioji|Hakodate|Hamamatsu|
      Hanamaki|Himeji|Hiroshima|
      Hirosaki|Hitachi|Ibaraki|
      Ichikawa|Ichinomiya|Ichinoseki|
      Imabari|Iwakuni|Iwaki|
      Iwamizawa|Joetsu|Kagoshima|
      Kamakura|Kanazawa|Kashiwa|
      Kawasaki|Kawagoe|Kitakyushu|
      Kitami|Kobe|Kochi|Kofu|
      Komatsu|Koriyama|Kumamoto|
      Kurashiki|Kure|Kushiro|
      Kyoto|Machida|Maebashi|
      Matsue|Matsumoto|Matsuyama|
      Mito|Miyazaki|Morioka|
      Muroran|Nagano|Nagaoka|
      Nagasaki|Nagoya|Naha|
      Nara|Niigata|Nikko|
      Noboribetsu|Noshiro|
      Obihiro|Odawara|Oita|
      Okayama|Okinawa|Omuta|
      Onomichi|Osaka|Otaru|
      Otsu|Sabae|Saga|Saitama|
      Sakai|Sakata|Sapporo|
      Sendai|Shimonoseki|Shizuoka|
      Suwa|Takamatsu|Takaoka|
      Takayama|Tokio|Tokorozawa|
      Tokushima|Tottori|Toyama|
      Tsuchiura|Tsuruoka|Tsu|
      Ube|Ueda|Utsunomiya|
      Wakayama|Wakkanai|Yamagata|
      Yamaguchi|Yokohama|Yokosuka|
      Yokote|Yubari|Yufuin
    `),

    eilanden: makeList(`
      Ameland|Andros|Antigua|
      Aruba|Bali|Barbados|Bohol|
      Borneo|Bouvetøya|Bora Bora|
      Boracay|Capri|Cebu|Corfu|
      Corsica|Curaçao|Cyprus|
      Elba|El Hierro|Fiji|
      Flores|Formentera|
      Fuerteventura|Galapagos|
      Gran Canaria|Groenland|
      Hainan|Hawaï|Hokkaido|
      Honshu|Ibiza|Ierland|
      IJsland|Ishigaki|
      Ischia|Java|Jeju|
      Kauai|Kreta|Kauai|
      Komodo|Kos|Kyushu|
      La Gomera|La Palma|
      Lampedusa|Lanzarote|
      Lombok|Luzon|Madagaskar|
      Madeira|Mallorca|Malta|
      Maui|Mauritius|Menorca|
      Mindanao|Mykonos|Negros|
      Oahu|Okinawa|Palawan|
      Paaseiland|Panay|
      Pantelleria|Pitcairn|
      Réunion|Rhodos|Samoa|
      Santorini|Sardinië|
      Schiermonnikoog|Shikoku|
      Siargao|Sicilië|Sint-Maarten|
      Sint-Helena|Socotra|
      Sulawesi|Sumatra|
      Tahiti|Taiwan|
      Tenerife|Terschelling|
      Texel|Tonga|Tristan da Cunha|
      Tsushima|Vlieland|Yakushima|
      Zakynthos
    `),

    griekseEilanden: makeList(`
      Aegina|Agathonisi|Agistri|
      Alonissos|Amorgos|Anafi|
      Andros|Antiparos|Antipaxos|
      Astypalaia|Chios|Corfu|
      Delos|Donoussa|Euboea|
      Folegandros|Fournoi|Halki|
      Hydra|Ikaria|Ios|Iraklia|
      Ithaka|Kalamos|Kalymnos|
      Karpathos|Kasos|Kastellorizo|
      Kastos|Kefalonia|Kea|
      Kimolos|Kos|Koufonisia|
      Kreta|Kythira|Kythnos|
      Lefkada|Lemnos|Leros|
      Lesbos|Lipsi|Meganisi|
      Milos|Mykonos|Naxos|
      Nisyros|Othonoi|Paros|
      Patmos|Paxos|Polyaigos|
      Poros|Rhodos|Salamina|
      Samos|Samothraki|
      Santorini|Schinoussa|
      Serifos|Sifnos|Sikinos|
      Skiathos|Skopelos|Skyros|
      Spetses|Symi|Syros|
      Thasos|Tilos|Tinos|
      Zakynthos
    `),

    amerikaanseStaten: makeList(`
      Alabama|Alaska|Arizona|Arkansas|
      California|Colorado|Connecticut|
      Delaware|Florida|Georgia|
      Hawaii|Idaho|Illinois|Indiana|
      Iowa|Kansas|Kentucky|Louisiana|
      Maine|Maryland|Massachusetts|
      Michigan|Minnesota|Mississippi|
      Missouri|Montana|Nebraska|
      Nevada|New Hampshire|New Jersey|
      New Mexico|New York|North Carolina|
      North Dakota|Ohio|Oklahoma|
      Oregon|Pennsylvania|Rhode Island|
      South Carolina|South Dakota|
      Tennessee|Texas|Utah|Vermont|
      Virginia|Washington|West Virginia|
      Wisconsin|Wyoming
    `),

    /* -------------------------
       ETEN EN NATUUR
    ------------------------- */

    fruit: makeList(`
      acerola|açaí|aardbei|abrikoos|
      ananas|appel|atemoya|avocado|
      banaan|bergamot|blauwe bes|
      bloedsinaasappel|braam|
      broodvrucht|cactusvijg|
      calamansi|camu camu|cherimoya|
      citroen|cranberry|cupuaçu|
      dadel|doerian|druif|
      feijoa|framboos|gojibes|
      grapefruit|granaatappel|
      guave|jackfruit|jabuticaba|
      kaki|kers|kiwano|kiwi|
      kiwibes|kokosnoot|kumquat|
      kruisbes|kweepeer|limoen|
      longan|loquat|lychee|
      mandarijn|mango|mangosteen|
      maracuja|meloen|mirabel|
      moerbei|nashi|nectarine|
      noni|olijf|papaja|
      passievrucht|peer|perzik|
      physalis|pitaja|pomelo|
      pruim|pulasan|rambutan|
      ramboetan|rode bes|salak|
      santol|sinaasappel|sterfruit|
      stervrucht|tamarillo|taybes|
      veenbes|vijg|vingerlimoen|
      watermeloen|witte bes|
      yuzu|zwarte bes|zuurzak
    `),

    groenten: makeList(`
      andijvie|artisjok|asperge|
      aubergine|aardappel|aardpeer|
      bleekselderij|bloemkool|
      boerenkool|bosui|broccoli|
      broccolini|chayote|cime di rapa|
      courgette|daikon|doperwt|
      edamame|eikenbladsla|
      flespompoen|frisée|groene kool|
      ijsbergsla|kardoen|knoflook|
      knolraap|knolselderij|
      komatsuna|komkommer|koolraap|
      koolrabi|lamsoor|lente-ui|
      little gem|maïs|mangold|
      mizuna|okra|paksoi|
      paprika|pastinaak|peultjes|
      pompoen|postelein|prei|
      raapsteel|radicchio|radijs|
      rammenas|rettich|rode biet|
      rodekool|romanesco|rucola|
      savooiekool|schorseneer|
      sjalot|sla|snijbiet|
      snijboon|spinazie|spitskool|
      spruitjes|sperzieboon|
      sugar snap|tatsoi|tomaat|
      tuinboon|ui|veldsla|
      venkel|waterkers|witlof|
      wittekool|wortel|zeekraal
    `),

    kazen: makeList(`
      Appenzeller|Asiago|Beaufort|
      Bleu d'Auvergne|Boerenkaas|
      Brie|Burrata|Cabrales|
      Camembert|Cantal|Castelmagno|
      Cheddar|Cheshire|Colby|
      Comté|Crottin de Chavignol|
      Edammer|Emmentaler|Époisses|
      Feta|Fiore Sardo|Fontina|
      Fourme d'Ambert|Gorgonzola|
      Gouda|Grana Padano|Gruyère|
      Halloumi|Havarti|Idiazabal|
      Jarlsberg|Leerdammer|
      Leidse kaas|Limburger|
      Maasdammer|Mahón|Manchego|
      Mascarpone|Montasio|Monterey Jack|
      Morbier|Mozzarella|Munster|
      Neufchâtel|Paneer|
      Parmigiano Reggiano|
      Pecorino Romano|Pepper Jack|
      Provolone|Raclette|
      Reblochon|Red Leicester|
      Ricotta|Roquefort|
      Saint-Nectaire|
      Sainte-Maure de Touraine|
      Scamorza|Stilton|Taleggio|
      Tête de Moine|Tilsiter|
      Tomme de Savoie|Valençay|
      Wensleydale
    `),

    bomen: makeList(`
      acacia|abeel|acer|
      amandelboom|appelboom|
      araucaria|atlasceder|
      avocadoboom|baobab|
      banyan|berk|beuk|
      blauwspar|boeddhistische vijg|
      broodboom|ceder|cipres|
      citroenboom|dadelpalm|
      den|douglasspar|eik|
      els|es|esdoorn|
      fijnspar|ginkgo|grove den|
      haagbeuk|hazelaar|hulst|
      iep|jeneverbes|kastanje|
      kapokboom|kersenboom|
      kokospalm|kustmammoetboom|
      lariks|laurierboom|
      Libanonceder|linde|magnolia|
      mammoetboom|mangoboom|
      moerascipres|nootmuskaatboom|
      olijfboom|palm|parasolden|
      paardenkastanje|perenboom|
      plataan|populier|pruimenboom|
      redwood|reuzenmammoetboom|
      robinia|rubberboom|
      sequoia|spar|taxus|
      treurwilg|tulpenboom|
      walnoot|wilg|wintereik|
      zomereik|zilverberk|zwarte els
    `),

    /* -------------------------
       SPORT
    ------------------------- */

    olympischeSporten: makeList(`
      atletiek|badminton|basketbal|
      beachvolleybal|BMX|
      BMX freestyle|BMX racing|
      baanwielrennen|boksen|
      boogschieten|breaking|
      discuswerpen|gewichtheffen|
      golf|handbal|hink-stap-springen|
      hockey|hoogspringen|judo|
      kajakken|kanoslalom|
      kanosprint|keirin|
      kogelstoten|kogelslingeren|
      marathon|marathonzwemmen|
      moderne vijfkamp|mountainbike|
      omnium|paardensport|
      polsstokhoogspringen|
      ritmische gymnastiek|roeien|
      rugby sevens|schermen|
      schietsport|schoonspringen|
      skateboarden|sportklimmen|
      speerwerpen|surfen|
      synchroonzwemmen|
      tafeltennis|taekwondo|
      tennis|tienkamp|trampolinespringen|
      triatlon|turnen|verspringen|
      vijfkamp|voetbal|volleybal|
      waterpolo|wielrennen|
      worstelen|zeilen|zevenkamp|
      zwemmen
    `),

    voetbalclubs: makeList(`
      Aberdeen|AC Milan|Ajax|
      Alavés|Anderlecht|Arsenal|
      AS Monaco|AS Roma|Atalanta|
      Athletic Club|Atlético Madrid|
      Aston Villa|AZ|Bayer Leverkusen|
      Bayern München|Benfica|
      Beşiktaş|Bologna|
      Borussia Dortmund|
      Borussia Mönchengladbach|
      Brøndby|Celtic|Chelsea|
      Club Brugge|Crystal Palace|
      Dinamo Zagreb|Dynamo Kyiv|
      Eintracht Frankfurt|
      Everton|FC Barcelona|
      FC Groningen|FC Kopenhagen|
      FC Porto|FC Twente|
      FC Utrecht|FC Volendam|
      Fenerbahçe|Feyenoord|
      Fiorentina|Fortuna Sittard|
      Galatasaray|Genk|
      Go Ahead Eagles|
      Hamburger SV|Hajduk Split|
      HJK Helsinki|Inter Milan|
      Juventus|Lazio|Lech Poznań|
      Legia Warschau|Leicester City|
      Lille|Liverpool|Manchester City|
      Manchester United|Malmö FF|
      Marseille|Molde|
      Napoli|NEC|Newcastle United|
      Olympiakos|Olympique Lyon|
      Panathinaikos|Partizan|
      PAOK|PEC Zwolle|PSG|PSV|
      Rangers|RB Leipzig|Real Betis|
      Real Madrid|Real Sociedad|
      Rode Ster Belgrado|
      Rosenborg|Royal Antwerp|
      Schalke 04|Sevilla|
      Shakhtar Donetsk|
      Slavia Praag|Sparta Praag|
      Sparta Rotterdam|Sporting CP|
      Tottenham|Trabzonspor|
      Union Saint-Gilloise|
      Valencia|Villarreal|
      Werder Bremen|West Ham|
      Willem II|Vitesse
    `),

    /* -------------------------
       MUZIEK
    ------------------------- */

    instrumenten: makeList(`
      accordeon|agogo|altsaxofoon|
      altviool|angklung|balalaika|
      bandoneon|banjo|baritonsaxofoon|
      basklarinet|basgitaar|
      bastrombone|berimbau|biwa|
      blokfluit|bongo|bouzouki|
      bugel|cajón|carillon|
      castagnetten|cello|celesta|
      cimbalom|cittern|citer|
      claves|concertina|conga|
      contrabas|contrafagot|cornet|
      darbuka|didgeridoo|dizi|
      djembé|doedelzak|dombra|
      draailier|drummachine|
      drumstel|duduk|dwarsfluit|
      elektrische gitaar|
      Engelse hoorn|erhu|esraj|
      eufonium|fagot|fluit|
      gitaar|gong|guzheng|
      handpan|hangdrum|harp|
      harmonica|harmonium|hobo|
      hoorn|hulusi|kalimba|
      keyboard|klavecimbel|
      klarinet|klokkenspel|
      kora|koto|luit|lier|
      mandoline|maracas|marimba|
      melodica|mondharmonica|
      morin khuur|muziekdoos|
      ney|nyckelharpa|ocarina|
      orgel|oud|oed|piano|
      piccolo|pijlinkt?|
      pijporgel|pipa|psalterium|
      qanun|rebab|samboerijn|
      sampler|sarangi|sarod|
      saxofoon|schalmei|
      shamisen|shakuhachi|
      shehnai|sheng|sitar|
      snaredrum|sousafoon|
      steelpan|suling|suona|
      synthesizer|tabla|tambura|
      tamboerijn|tanpura|
      tenorsaxofoon|theremin|
      tinwhistle|trombone|
      trommel|trompet|tuba|
      ukulele|ukelele|vibrafoon|
      viola da gamba|viool|
      vleugel|xylofoon|yangqin|
      zurna
    `),

    muziekgenres: makeList(`
      acid house|afrobeat|afrobeats|
      ambient|amapiano|alternatieve rock|
      bachata|black metal|
      bluegrass|blues|bossa nova|
      breakbeat|Britpop|chiptune|
      klassieke muziek|country|
      cumbia|dance|dancehall|
      darkwave|death metal|
      deep house|disco|doom metal|
      downtempo|drum and bass|
      dub|dubstep|EDM|
      electro swing|electropop|
      fado|flamenco|folk|
      folkmetal|funk|garage|
      glamrock|gnawa|gospel|
      grindcore|grunge|gqom|
      hardstyle|hardcore|heavy metal|
      highlife|hiphop|house|
      hyperpop|indie pop|
      indie rock|jazz|J-pop|
      jungle|K-pop|liquid funk|
      mathrock|metal|
      merengue|minimal techno|
      Motown|neo-soul|new wave|
      noise rock|nu metal|
      pop|postpunk|postrock|
      power metal|progressieve rock|
      psytrance|punk|punkrock|
      R&B|rap|reggae|
      reggaeton|rock|rockabilly|
      salsa|samba|shoegaze|
      ska|sludge metal|soul|
      synthpop|synthwave|
      symfonische metal|techno|
      trance|triphop|UK garage|
      vaporwave|zydeco
    `),

    /* -------------------------
       WETENSCHAP EN RUIMTE
    ------------------------- */

    manen: makeList(`
      Adrastea|Aegaeon|Aitne|
      Amalthea|Ananke|Aoede|
      Arche|Ariel|Atlas|
      Autonoe|Callirrhoe|
      Callisto|Carme|Carpo|
      Chaldene|Charon|Cyllene|
      Deimos|Dione|Elara|
      Enceladus|Epimetheus|
      Erinome|Euanthe|Eukelade|
      Euporie|Europa|Eurydome|
      Ganymedes|Hegemone|
      Helene|Helike|Hermippe|
      Herse|Himalia|Hydra|
      Hyperion|Iapetus|Io|
      Iocaste|Isonoe|Janus|
      Kale|Kallichore|Kalyke|
      Kerberos|Kore|Leda|
      Lysithea|Maan|Metis|
      Mimas|Miranda|Mneme|
      Nereid|Nix|Oberon|
      Orthosie|Pandora|Pan|
      Pasiphae|Pasithee|
      Phoebe|Phobos|Praxidike|
      Prometheus|Proteus|
      Rhea|Sinope|Sponde|
      Styx|Taygete|Tethys|
      Thebe|Thelxinoe|Thyone|
      Titan|Titania|Triton|
      Umbriel
    `),

    elementen: makeList(`
      Actinium|Aluminium|Americium|
      Antimoon|Argon|Arseen|
      Astatium|Barium|Berkelium|
      Beryllium|Bismut|Bohrium|
      Boor|Broom|Cadmium|
      Calcium|Californium|Cerium|
      Cesium|Chloor|Chroom|
      Copernicium|Curium|
      Darmstadtium|Dubnium|
      Dysprosium|Einsteinium|
      Erbium|Europium|Fermium|
      Flerovium|Fluor|Fosfor|
      Francium|Gadolinium|Gallium|
      Germanium|Goud|Hafnium|
      Hassium|Helium|Holmium|
      Indium|Iridium|IJzer|
      Jodium|Kalium|Kobalt|
      Koolstof|Koper|Krypton|
      Kwik|Lanthaan|Lawrencium|
      Lithium|Livermorium|Lood|
      Lutetium|Magnesium|
      Mangaan|Meitnerium|
      Mendelevium|Molybdeen|
      Moscovium|Natrium|Neodymium|
      Neon|Neptunium|Nihonium|
      Nikkel|Niobium|Nobelium|
      Oganesson|Osmium|
      Palladium|Platina|Plutonium|
      Polonium|Praseodymium|
      Promethium|Protactinium|
      Radium|Radon|Renium|
      Rodium|Roentgenium|
      Rubidium|Rutherfordium|
      Ruthenium|Samarium|
      Scandium|Seaborgium|
      Seleen|Silicium|Strontium|
      Tantaal|Technetium|
      Telluur|Tennessine|
      Terbium|Thallium|
      Thorium|Thulium|Tin|
      Titanium|Uranium|Vanadium|
      Waterstof|Wolfraam|
      Xenon|Ytterbium|Yttrium|
      Zilver|Zink|Zirkonium|
      Zuurstof|Zwavel|Stikstof
    `),

    sterrenbeelden: makeList(`
      Andromeda|Antlia|Apus|Aquarius|
      Aquila|Ara|Aries|Auriga|
      Boötes|Caelum|Camelopardalis|
      Cancer|Canes Venatici|
      Canis Major|Canis Minor|
      Capricornus|Carina|Cassiopeia|
      Centaurus|Cepheus|Cetus|
      Chamaeleon|Circinus|Columba|
      Coma Berenices|Corona Australis|
      Corona Borealis|Corvus|Crater|
      Crux|Cygnus|Delphinus|
      Dorado|Draco|Equuleus|
      Eridanus|Fornax|Gemini|
      Grus|Hercules|Horologium|
      Hydra|Hydrus|Indus|
      Lacerta|Leo|Leo Minor|
      Lepus|Libra|Lupus|
      Lynx|Lyra|Mensa|
      Microscopium|Monoceros|
      Musca|Norma|Octans|
      Ophiuchus|Orion|Pavo|
      Pegasus|Perseus|Phoenix|
      Pictor|Pisces|Piscis Austrinus|
      Puppis|Pyxis|Reticulum|
      Sagitta|Sagittarius|
      Scorpius|Sculptor|
      Scutum|Serpens|Sextans|
      Taurus|Telescopium|
      Triangulum|Triangulum Australe|
      Tucana|Ursa Major|Ursa Minor|
      Vela|Virgo|Volans|Vulpecula
    `),

    dinosauriers: makeList(`
      Achelousaurus|Acrocanthosaurus|
      Adasaurus|Albertosaurus|
      Alioramus|Allosaurus|
      Amargasaurus|Ankylosaurus|
      Apatosaurus|Argentinosaurus|
      Austroraptor|Bambiraptor|
      Baryonyx|Brachiosaurus|
      Brontosaurus|Carnotaurus|
      Centrosaurus|Ceratosaurus|
      Chasmosaurus|Coelophysis|
      Compsognathus|Corythosaurus|
      Daspletosaurus|Deinonychus|
      Diabloceratops|Dilophosaurus|
      Diplodocus|Dromaeosaurus|
      Edmontosaurus|Einiosaurus|
      Eoraptor|Gallimimus|
      Giganotosaurus|Halszkaraptor|
      Herrerasaurus|Iguanodon|
      Kentrosaurus|Kosmoceratops|
      Lythronax|Maiasaura|
      Mamenchisaurus|Mapusaurus|
      Microraptor|Mononykus|
      Muttaburrasaurus|Nasutoceratops|
      Nigersaurus|Oviraptor|
      Pachycephalosaurus|
      Parasaurolophus|Pentaceratops|
      Plateosaurus|Protoceratops|
      Psittacosaurus|Pyroraptor|
      Qianzhousaurus|Regaliceratops|
      Saurornitholestes|Sauropelta|
      Sinoceratops|Sinornithosaurus|
      Sinosauropteryx|Spinosaurus|
      Stegosaurus|Styracosaurus|
      Suchomimus|Tarbosaurus|
      Teratophoneus|Therizinosaurus|
      Tianyuraptor|Torosaurus|
      Triceratops|Tyrannosaurus|
      Utahraptor|Velociraptor|
      Yutyrannus|Zhenyuanlong
    `),

    /* -------------------------
       WERELD EN GESCHIEDENIS
    ------------------------- */

    talen: makeList(`
      Afrikaans|Albanees|Amhaars|
      Arabisch|Armeens|Aymara|
      Azerbeidzjaans|Baskisch|
      Bengaals|Berbers|Bretons|
      Bulgaars|Catalaans|Cebuano|
      Chinees|Deens|Duits|
      Engels|Ests|Farsi|Fins|
      Frans|Fries|Galicisch|
      Georgisch|Grieks|Gujarati|
      Guarani|Hausa|Hebreeuws|
      Hindi|Hongaars|Iers|
      Igbo|IJslands|Indonesisch|
      Inuktitut|Italiaans|Japans|
      Javaans|Kannada|Kazachs|
      Khmer|Koerdisch|Koreaans|
      Kroatisch|Lao|Lets|
      Limburgs|Litouws|Maori|
      Macedonisch|Malayalam|
      Maleis|Mandarijn|Marathi|
      Mongools|Nahuatl|Nederlands|
      Nepalees|Noors|Oekraïens|
      Oezbeeks|Perzisch|Pools|
      Portugees|Punjabi|Quechua|
      Roemeens|Russisch|
      Samoaans|Schots-Gaelisch|
      Servisch|Sinhala|Slowaaks|
      Sloveens|Somalisch|
      Spaans|Soendanees|Swahili|
      Tagalog|Tamil|Telugu|
      Thai|Tongaans|Tsjechisch|
      Turks|Urdu|Vietnamees|
      Welsh|Wolof|Xhosa|
      Yoruba|Zoeloe|Zweeds
    `),

    historischeVrouwen: makeList(`
      Ada Lovelace|Agatha Christie|
      Aletta Jacobs|Amelia Earhart|
      Anna Maria van Schurman|
      Anne Brontë|Anne Frank|
      Artemisia Gentileschi|
      Bessie Coleman|Berthe Morisot|
      Boudica|Camille Claudel|
      Caroline Herschel|
      Catharina de Grote|
      Charlotte Brontë|
      Christina van Zweden|
      Clara Schumann|Cleopatra|
      Edith Wharton|Elisabeth I|
      Elizabeth Blackwell|
      Emily Brontë|Emily Dickinson|
      Emmy Noether|Emmeline Pankhurst|
      Etty Hillesum|Fanny Mendelssohn|
      Florence Nightingale|
      Frida Kahlo|George Eliot|
      Georgia O'Keeffe|
      Harriet Tubman|Hatshepsut|
      Hedy Lamarr|Henrietta Leavitt|
      Hildegard van Bingen|
      Hypatia|Ida B. Wells|
      Isabella van Castilië|
      Isadora Duncan|Jane Austen|
      Jeanne d'Arc|Josephine Baker|
      Judith Leyster|Koningin Victoria|
      Koningin Wilhelmina|
      Lise Meitner|Louisa May Alcott|
      Marie Antoinette|Marie Curie|
      Maria Stuart|Maria Theresia|
      Mary Anning|Mary Cassatt|
      Mary Shelley|Mary Wollstonecraft|
      Mata Hari|Murasaki Shikibu|
      Nefertiti|Nellie Bly|
      Noor Inayat Khan|Pocahontas|
      Rachel Carson|Rani Lakshmibai|
      Rosa Luxemburg|Sacagawea|
      Sappho|Sarah Bernhardt|
      Sei Shōnagon|Sophie Germain|
      Sojourner Truth|
      Susan B. Anthony|
      Sylvia Pankhurst|Virginia Woolf|
      Wu Zetian
    `)

  };


  /* ==========================================================
     3. VEILIGE ALTERNATIEVE NAMEN

     Synoniemen zijn geen extra antwoorden:
     twee namen voor hetzelfde ding
     leveren niet twee keer punten op.

     We voegen ze toe aan het
     bestaande antwoordobject.
  ========================================================== */

  const ALIASES = {

    "verenigde staten": [
      "VS", "USA", "United States",
      "United States of America"
    ],

    "verenigd koninkrijk": [
      "VK", "UK", "United Kingdom",
      "Groot-Brittannië"
    ],

    "wit rusland": [
      "Belarus"
    ],

    "eswatini": [
      "Swaziland"
    ],

    "kaapverdie": [
      "Cabo Verde"
    ],

    "ivoorkust": [
      "Côte d'Ivoire"
    ],

    "sao tome en principe": [
      "São Tomé en Príncipe",
      "Sao Tome and Principe"
    ],

    "zuid korea": [
      "Zuid-Korea", "South Korea"
    ],

    "noord korea": [
      "Noord-Korea", "North Korea"
    ],

    "tokio": [
      "Tokyo"
    ],

    "kyoto": [
      "Kioto"
    ],

    "peking": [
      "Beijing"
    ],

    "beijing": [
      "Peking"
    ],

    "kyiv": [
      "Kiev", "Kyiv"
    ],

    "chisinau": [
      "Chișinău", "Kisjinev"
    ],

    "reykjavik": [
      "Reykjavík"
    ],

    "kofu": [
      "Kōfu"
    ],

    "kochi": [
      "Kōchi"
    ],

    "oita": [
      "Ōita"
    ],

    "corfu": [
      "Korfoe", "Kerkyra"
    ],

    "santorini": [
      "Thira", "Thera"
    ],

    "euboea": [
      "Evia", "Euböa"
    ],

    "lesbos": [
      "Lesvos"
    ],

    "kreta": [
      "Crete"
    ],

    "rhodos": [
      "Rhodes"
    ],

    "paaseiland": [
      "Rapa Nui"
    ],

    "galapagoseilanden": [
      "Galápagoseilanden"
    ],

    "hawaï": [
      "Hawaii"
    ],

    "california": [
      "Californië"
    ],

    "hawaii": [
      "Hawaï"
    ],

    "new mexico": [
      "Nieuw-Mexico"
    ],

    "new york": [
      "New York State"
    ],

    "dugong": [
      "Doejong"
    ],

    "doejong": [
      "Dugong"
    ],

    "beloega": [
      "Beluga"
    ],

    "manta": [
      "Mantarog"
    ],

    "mantarog": [
      "Manta"
    ],

    "octopus": [
      "Achtarm"
    ],

    "zeekat": [
      "Sepia"
    ],

    "walvishaai": [
      "Walvishaai"
    ],

    "jachtluipaard": [
      "Cheeta", "Cheetah"
    ],

    "capibara": [
      "Waterzwijn", "Capybara"
    ],

    "reuz enpanda": [
      "Grote panda"
    ],

    "reuzenpanda": [
      "Panda", "Grote panda"
    ],

    "schubdier": [
      "Pangolin"
    ],

    "lamantijn": [
      "Manatee"
    ],

    "rode panda": [
      "Kleine panda"
    ],

    "ayeaye": [
      "Aye-aye", "Vingerdier"
    ],

    "orang oetan": [
      "Orangutan"
    ],

    "papaja": [
      "Papaya"
    ],

    "drakenvrucht": [
      "Pitaja", "Dragonfruit"
    ],

    "pitaja": [
      "Drakenvrucht", "Dragonfruit"
    ],

    "sterfruit": [
      "Stervrucht", "Carambola"
    ],

    "ster vrucht": [
      "Carambola"
    ],

    "ramboetan": [
      "Rambutan"
    ],

    "zuurzak": [
      "Soursop"
    ],

    "physalis": [
      "Goudbes", "Kaapse kruisbes"
    ],

    "nashi": [
      "Aziatische peer"
    ],

    "butternutpompoen": [
      "Flespompoen"
    ],

    "sugarsnap": [
      "Sugar snap", "Sugarsnaps"
    ],

    "edam": [
      "Edammer", "Edammer kaas"
    ],

    "gouda": [
      "Goudse kaas"
    ],

    "parmezaan": [
      "Parmigiano Reggiano"
    ],

    "gruyere": [
      "Gruyère"
    ],

    "comte": [
      "Comté"
    ],

    "blauwvin tonijn": [
      "Blauwvintonijn"
    ],

    "ukelele": [
      "Ukulele"
    ],

    "ukulele": [
      "Ukelele"
    ],

    "handpan": [
      "Hangdrum"
    ],

    "hangdrum": [
      "Handpan"
    ],

    "dj embe": [
      "Djembé"
    ],

    "djembe": [
      "Djembé"
    ],

    "hiphop": [
      "Hip-hop", "Hip hop"
    ],

    "drum and bass": [
      "Drum 'n bass", "DnB"
    ],

    "rhythm and blues": [
      "R&B"
    ],

    "afrobeat": [
      "Afrobeat"
    ],

    "keirin": [
      "Keirin"
    ],

    "moderne vijfkamp": [
      "Vijfkamp"
    ],

    "artistiek zwemmen": [
      "Synchroonzwemmen"
    ],

    "synchroonzwemmen": [
      "Artistiek zwemmen"
    ],

    "tyrannosaurus": [
      "Tyrannosaurus rex", "T-rex", "T rex"
    ],

    "velociraptor": [
      "Velociraptor"
    ],

    "merinowol": [
      "Merino wol"
    ],

    "corduroy": [
      "Ribfluweel"
    ],

    "corduroy broek": [
      "Ribbroek"
    ],

    "spijkerbroek": [
      "Jeans"
    ],

    "spijkerjas": [
      "Denimjack", "Denim jacket"
    ],

    "bomberjack": [
      "Bomber jacket"
    ],

    "sneaker": [
      "Sportsneaker"
    ],

    "zonnehoed": [
      "Sun hat"
    ],

    "heuptas": [
      "Fanny pack", "Belt bag"
    ],

    "schoudertas": [
      "Shoulder bag"
    ],

    "rugzak": [
      "Backpack"
    ],

    "haarelastiek": [
      "Haarelastiekje"
    ],

    "scrunchie": [
      "Stoffen haarelastiek"
    ],

    "pyjama": [
      "Pyjamaset"
    ],

    "coltrui": [
      "Turtleneck"
    ],

    "overslagrok": [
      "Wikkelrok"
    ],

    "pied de poule": [
      "Houndstooth"
    ]

  };


  /* ==========================================================
     4. VRAAG ONDERWERP HERKENNEN

     We kiezen nooit een lijst alleen
     omdat één woord toevallig voorkomt.

     Zo krijgt een Afrikaanse-landenvraag
     niet automatisch alle wereldlanden.
  ========================================================== */

  function getBankName(question) {
    const text = normalize(
      question.question || question.vraag
    ).split(" extra eis ")[0];

    const explicitTopic = normalize(
      question.topicId || question.topic || ""
    );

    /*
     * De 50 modevragen hebben al
     * eigen vragen en antwoordlijsten.
     * Hiervoor voegen we synoniemen toe,
     * maar niet zomaar lijsten van
     * een ander modeonderwerp.
     */

    if (
      explicitTopic.startsWith("mode ") ||
      explicitTopic.startsWith("mode-")
    ) {
      return null;
    }

    if (
      /vogelsoort|vogel die/.test(text)
    ) {
      return "vogels";
    }

    if (/zoogdier/.test(text)) {
      return "zoogdieren";
    }

    if (/hondenras/.test(text)) {
      return "hondenrassen";
    }

    if (
      /dier dat in zee leeft|zeedier/.test(text)
    ) {
      return "zeedieren";
    }

    if (/land in afrika/.test(text)) {
      return "afrikalanden";
    }

    if (
      /land dat geheel of gedeeltelijk in europa/.test(text)
    ) {
      return "europalanden";
    }

    if (
      /land ergens ter wereld/.test(text)
    ) {
      return "wereldlanden";
    }

    if (
      /hoofdstad van een europees land/.test(text)
    ) {
      /*
       * Bestaande Europese hoofdsteden
       * worden al door vragen.js geleverd.
       * Geen wereldsteden toevoegen.
       */
      return null;
    }

    if (
      /hoofdstad ergens ter wereld/.test(text)
    ) {
      return "hoofdsteden";
    }

    if (/stad in japan/.test(text)) {
      return "japanseSteden";
    }

    if (/grieks eiland/.test(text)) {
      return "griekseEilanden";
    }

    if (/eiland in de wereld/.test(text)) {
      return "eilanden";
    }

    if (
      /50 staten van de verenigde staten/.test(text)
    ) {
      return "amerikaanseStaten";
    }

    if (/fruitsoort/.test(text)) {
      return "fruit";
    }

    if (/groente die/.test(text)) {
      return "groenten";
    }

    if (/kaassoort/.test(text)) {
      return "kazen";
    }

    if (/boomsoort/.test(text)) {
      return "bomen";
    }

    if (
      /sport of discipline van de olympische zomerspelen/.test(text) ||
      /sport die op de olympische zomerspelen/.test(text)
    ) {
      return "olympischeSporten";
    }

    if (
      /voetbalclub uit europa/.test(text)
    ) {
      return "voetbalclubs";
    }

    if (/muziekinstrument/.test(text)) {
      return "instrumenten";
    }

    if (/muziekgenre/.test(text)) {
      return "muziekgenres";
    }

    if (
      /natuurlijke maan/.test(text)
    ) {
      return "manen";
    }

    if (
      /scheikundig element/.test(text)
    ) {
      return "elementen";
    }

    if (
      /officieel sterrenbeeld/.test(text)
    ) {
      return "sterrenbeelden";
    }

    if (
      /dinosauriergeslacht/.test(text)
    ) {
      return "dinosauriers";
    }

    if (
      /bestaande menselijke taal/.test(text)
    ) {
      return "talen";
    }

    if (
      /bekende vrouw uit de geschiedenis/.test(text)
    ) {
      return "historischeVrouwen";
    }

    return null;
  }


  /* ==========================================================
     5. EXTRA LETTERREGELS LEZEN

     De 100 gegenereerde vragen
     krijgen geen ongeldige antwoorden.

     Bijvoorbeeld:
     "Minstens 6 letters"

     Dan is "kat" niet geldig,
     ook niet wanneer het in de
     oorspronkelijke vraag goed was.
  ========================================================== */

  function checkExtraRequirement(question, name) {
    const fullText = String(
      question.question || ""
    );

    const match = fullText.match(
      /extra eis:\s*(.+)$/i
    );

    if (!match) {
      return true;
    }

    const rule = normalize(match[1]);
    const word = letters(name);

    if (!word) {
      return false;
    }

    const vowels = (
      word.match(/[aeiou]/g) || []
    );

    const consonants = (
      word.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
    );

    const minimumLetters = rule.match(
      /minstens (\d+) letters/
    );

    if (minimumLetters) {
      return word.length >= Number(
        minimumLetters[1]
      );
    }

    const minimumVowels = rule.match(
      /minstens (\d+) klinkers/
    );

    if (minimumVowels) {
      return vowels.length >= Number(
        minimumVowels[1]
      );
    }

    const minimumConsonants = rule.match(
      /minstens (\d+) medeklinkers/
    );

    if (minimumConsonants) {
      return consonants.length >= Number(
        minimumConsonants[1]
      );
    }

    if (
      rule.includes(
        "minstens twee verschillende klinkers"
      )
    ) {
      return new Set(vowels).size >= 2;
    }

    if (
      rule.includes(
        "begint met een medeklinker"
      )
    ) {
      return /^[bcdfghjklmnpqrstvwxyz]/.test(
        word
      );
    }

    if (
      rule.includes(
        "eindigt op een medeklinker"
      )
    ) {
      return /[bcdfghjklmnpqrstvwxyz]$/.test(
        word
      );
    }

    const between = rule.match(
      /begint met een letter van ([a-z]) tot en met ([a-z])/
    );

    if (between) {
      return (
        word[0] >= between[1] &&
        word[0] <= between[2]
      );
    }

    if (
      rule.includes(
        "begint niet met de letter q x of z"
      )
    ) {
      return !/^[qxz]/.test(word);
    }

    if (
      rule.includes(
        "bevat een a e i o of u"
      )
    ) {
      return vowels.length >= 1;
    }

    const containsGroups = [
      ["letter a of e", /[ae]/],
      ["letter i o of u", /[iou]/],
      ["letter e i of o", /[eio]/],
      ["letter a o of u", /[aou]/],
      ["een n r of s", /[nrs]/],
      ["een l m of t", /[lmt]/],
      ["een b d g of k", /[bdgk]/]
    ];

    for (const [phrase, pattern] of containsGroups) {
      if (rule.includes(phrase)) {
        return pattern.test(word);
      }
    }

    /*
     * Onbekende extra eis?
     * Dan GEEN nieuwe antwoorden toevoegen.
     * Zo maken we de controle niet te ruim.
     */

    return false;
  }


  /* ==========================================================
     6. PUNTEN VOOR NIEUWE ANTWOORDEN

     Bestaande scores veranderen niet.

     Nieuwe scores zijn voorlopige
     spelwaardes tussen 10 en 99.

     100 blijft uitsluitend bedoeld
     voor het bestaande raketantwoord.
  ========================================================== */

  function scoreForNewAnswer(
    question,
    name
  ) {
    const source =
      normalize(question.question) +
      "|" +
      normalize(name);

    let hash = 2166136261;

    for (let i = 0; i < source.length; i++) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(
        hash,
        16777619
      );
    }

    return 10 + ((hash >>> 0) % 80);
  }


  /* ==========================================================
     7. BESTAANDE ANTWOORDEN INDEXEREN

     We indexeren zowel de hoofdnaam
     als alle aliassen.
  ========================================================== */

  function getNames(entry) {
    if (typeof entry === "string") {
      return [entry];
    }

    const aliases =
      Array.isArray(entry.aliases)
        ? entry.aliases
        : typeof entry.aliases === "string"
          ? entry.aliases.split("|")
          : [];

    return [
      entry.answer || entry.name || "",
      ...aliases
    ];
  }

  function createNameIndex(question) {
    const index = new Map();

    question.answers.forEach(entry => {
      for (const name of getNames(entry)) {
        const key = normalize(name);

        if (key && !index.has(key)) {
          index.set(key, entry);
        }
      }
    });

    return index;
  }


  /* ==========================================================
     8. SYNONIEMEN TOEVOEGEN
  ========================================================== */

  function addAliases(question, index) {
    let count = 0;

    for (const entry of question.answers) {
      if (
        !entry ||
        typeof entry !== "object"
      ) {
        continue;
      }

      const key = normalize(
        entry.answer || entry.name
      );

      const possible =
        ALIASES[key] || [];

      if (!Array.isArray(entry.aliases)) {
        entry.aliases = [];
      }

      for (const alias of possible) {
        const aliasKey = normalize(alias);

        if (
          !aliasKey ||
          index.has(aliasKey) ||
          !checkExtraRequirement(
            question,
            alias
          )
        ) {
          continue;
        }

        entry.aliases.push(alias);
        index.set(aliasKey, entry);
        count++;
      }
    }

    return count;
  }


  /* ==========================================================
     9. NIEUW ANTWOORD TOEVOEGEN
  ========================================================== */

  function addAnswer(
    question,
    name,
    index
  ) {
    const key = normalize(name);

    if (
      !key ||
      index.has(key) ||
      !checkExtraRequirement(
        question,
        name
      )
    ) {
      return false;
    }

    const entry = {
      answer: name,

      aliases: [],

      points: scoreForNewAnswer(
        question,
        name
      ),

      isRocket: false
    };

    question.answers.push(entry);
    index.set(key, entry);

    return true;
  }


  /* ==========================================================
     10. ÉÉN VRAAG UITBREIDEN
  ========================================================== */

  function extendQuestion(question) {
    if (
      !question ||
      typeof question !== "object" ||
      !Array.isArray(question.answers)
    ) {
      return {
        answers: 0,
        aliases: 0
      };
    }

    const index =
      createNameIndex(question);

    const listName =
      getBankName(question);

    const list = listName
      ? BANK[listName] || []
      : [];

    let addedAnswers = 0;

    for (const name of list) {
      if (
        addAnswer(
          question,
          name,
          index
        )
      ) {
        addedAnswers++;
      }
    }

    const addedAliases =
      addAliases(question, index);

    return {
      answers: addedAnswers,
      aliases: addedAliases
    };
  }


  /* ==========================================================
     11. ALLE VRAGENBANKEN UITBREIDEN

     Deze functie is veilig meerdere
     keren uit te voeren.

     Er worden dan geen dubbele
     antwoorden toegevoegd.
  ========================================================== */

  function apply() {
    const sources = [
      window.QUIZBALLON_EXPANDED_QUESTIONS,
      window.QUIZ_QUESTIONS,
      window.QUIZ_QUESTIONS_MODE,
      window.QUIZBALLON_MODE_QUESTIONS
    ];

    const visited = new Set();

    let questionCount = 0;
    let answerCount = 0;
    let aliasCount = 0;

    for (const source of sources) {
      if (!Array.isArray(source)) {
        continue;
      }

      for (const question of source) {
        if (
          !question ||
          visited.has(question)
        ) {
          continue;
        }

        visited.add(question);

        const result =
          extendQuestion(question);

        questionCount++;

        answerCount +=
          result.answers;

        aliasCount +=
          result.aliases;
      }
    }

    const report = {
      checkedQuestions: questionCount,
      newAnswers: answerCount,
      newAliases: aliasCount
    };

    console.log(
      "📚 QuizBallon centrale antwoordenbank:",
      report
    );

    return report;
  }


  /* ==========================================================
     12. BESCHIKBAAR VOOR BEIDE SPELMODI
  ========================================================== */

  window.QB_EXTRA_ANSWERS = {
    version: "2.0",

    normalize,
    getBankName,
    checkExtraRequirement,
    extendQuestion,
    apply,

    banks: BANK
  };


  /* ==========================================================
     13. DIRECT TOEPASSEN
  ========================================================== */

  apply();

})();
