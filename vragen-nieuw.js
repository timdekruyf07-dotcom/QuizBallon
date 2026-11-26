/* =====================================================
   QUIZBALLON - 56 NIEUWE KENNISVRAGEN

   - ECHT VERSCHILLENDE VRAGEN
   - MEERDERE GELDIGE ANTWOORDEN
   - EEN EIGEN BASISVRAAG-ID
   - EEN RAKETANTWOORD PER VRAAG
   - GESCHIKT VOOR DAILY V6

   Laden NA mode-vragen.js
   Laden VOOR vragen-100.js en daily.js
===================================================== */

(function () {
  "use strict";

  const bank =
    window.QUIZBALLON_EXPANDED_QUESTIONS;

  if (!Array.isArray(bank)) {
    console.error(
      "Nieuwe vragen: hoofdvragenbank ontbreekt."
    );
    return;
  }

  /*
   * Iedere regel bevat:
   *
   * 1. Categorie
   * 2. Vraag
   * 3. Geldige antwoorden
   *
   * Antwoorden zijn gescheiden met |
   *
   * Een alternatieve naam voor
   * hetzelfde antwoord gebruik je
   * met ~
   */

  const data = [

    [
      "🐾 DIEREN",
      "Noem een uitgestorven diersoort.",
      `Dodo|Mammoet|Wolharige mammoet|Tasmaanse tijger~Buidelwolf|Moa|Reuzenalk|Quagga|Sabeltandtijger|Megalodon|Mastodont|Reuzenluiaard|Stellers zeekoe|Passagiersduif|Trekduif|Oeros|Grottenbeer|Wolharige neushoorn|Ierse eland|Haasts arend|Reuzenbever|Glyptodon|Diprotodon|Smilodon|Megatherium|Elasmotherium`
    ],

    [
      "🐾 DIEREN",
      "Noem een bedreigde diersoort.",
      `Javaanse neushoorn|Sumatraanse neushoorn|Amoerpanter|Orang-oetan|Berggorilla|Vaquita|Kakapo|Saola|Schubdier|Sumatraanse tijger|Rode panda|Aziatische olifant|Afrikaanse bosolifant|Zwarte neushoorn|Reuzenpanda|Bonobo|Gangesdolfijn|Borneodwergolifant|Karetschildpad|Axolotl|Iberische lynx|Sneeuwluipaard|Filipijnse arend|Californische condor`
    ],

    [
      "🐾 DIEREN",
      "Noem een insect.",
      `Mier|Bij|Wesp|Hoornaar|Vlinder|Mot|Kever|Lieveheersbeestje|Vlieg|Mug|Libel|Waterjuffer|Sprinkhaan|Krekel|Cicade|Bidsprinkhaan|Wandelende tak|Wandelend blad|Oorworm|Zilvervisje|Vuurvliegje|Vlo|Luis|Houtwormkever|Meikever|Neushoornkever|Mestkever`
    ],

    [
      "🐾 DIEREN",
      "Noem een reptiel.",
      `Krokodil|Alligator|Kaaiman|Gaviaal|Groene leguaan|Baardagaam|Komodovaraan|Nijlvaraan|Schildpad|Landschildpad|Zeeschildpad|Python|Boa constrictor|Koningscobra|Adder|Ratelslang|Mamba|Koraalslang|Anaconda|Kameleon|Gekko|Skink|Hazelworm|Hagedis|Anolis|Tuatara`
    ],

    [
      "🐾 DIEREN",
      "Noem een amfibie.",
      `Kikker|Pad|Boomkikker|Bruine kikker|Groene kikker|Pijlgifkikker|Klauwkikker|Stierkikker|Glaskikker|Vroedmeesterpad|Knoflookpad|Rugstreeppad|Gewone pad|Salamander|Vuursalamander|Kamsalamander|Alpenwatersalamander|Kleine watersalamander|Axolotl|Olm|Marmersalamander|Reuzensalamander|Japanse reuzensalamander|Chinese reuzensalamander`
    ],

    [
      "🐾 DIEREN",
      "Noem een dier dat op de savanne leeft.",
      `Leeuw|Olifant|Giraffe|Zebra|Gnoe|Gazelle|Impala|Springbok|Hyena|Jachtluipaard|Luipaard|Neushoorn|Struisvogel|Baviaan|Buffel|Wrattenzwijn|Stokstaartje|Nijlpaard|Afrikaanse wilde hond|Secretarisvogel|Gier|Maraboe|Elandantilope|Koedoe|Topi`
    ],

    [
      "🐾 DIEREN",
      "Noem een dier dat in een poolgebied leeft.",
      `IJsbeer|Poolvos|Poolhaas|Rendier|Muskusos|Narwal|Beluga|Walrus|Ringelrob|Zadelrob|Baardrob|Groenlandse haai|Sneeuwuil|Sneeuwhoen|Keizerspinguïn|Adéliepinguïn|Ezelspinguïn|Zuidpooljager|Poolstern|IJsmeeuw|Noordse stormvogel|Orka|Zeeolifant|Krill`
    ],

    [
      "🌍 AARDRIJKSKUNDE",
      "Noem een rivier in Europa.",
      `Rijn|Maas|Schelde|Donau|Seine|Theems|Elbe|Weser|Oder|Weichsel|Wolga|Dnjepr|Don|Po|Tiber|Arno|Rhône|Loire|Garonne|Douro|Taag|Ebro|Guadalquivir|Glomma|Kemijoki|Sava|Drava|Inn|Moezel`
    ],

    [
      "🌍 AARDRIJKSKUNDE",
      "Noem een gebergte.",
      `Alpen|Pyreneeën|Karpaten|Apennijnen|Himalaya|Andes|Rocky Mountains|Atlasgebergte|Oeral|Kaukasus|Hindoekoesj|Karakoram|Tian Shan|Alborz|Zagros|Drakensbergen|Sierra Nevada|Dolomieten|Schotse Hooglanden|Ardennen|Vogezen|Zwarte Woud|Dinarische Alpen|Balkangebergte|Alaska Range`
    ],

    [
      "🌍 AARDRIJKSKUNDE",
      "Noem een woestijn.",
      `Sahara|Gobi|Kalahari|Namib|Atacama|Arabische woestijn|Mojave|Sonorawoestijn|Chihuahuawoestijn|Taklamakan|Thar|Great Victoria Desert|Great Sandy Desert|Gibsonwoestijn|Simpsonwoestijn|Kyzylkum|Karakum|Dasht-e Lut|Dasht-e Kavir|Patagonische woestijn|Antarctische woestijn|Arctische woestijn|Negev|Syrische woestijn`
    ],

    [
      "🌍 AARDRIJKSKUNDE",
      "Noem een zee.",
      `Noordzee|Oostzee|Middellandse Zee|Zwarte Zee|Rode Zee|Arabische Zee|Caribische Zee|Koraalzee|Tasmanzee|Beringzee|Waddenzee|Adriatische Zee|Egeïsche Zee|Ionische Zee|Tyrreense Zee|Keltische Zee|Noorse Zee|Groenlandzee|Barentszzee|Witte Zee|Japanse Zee|Oost-Chinese Zee|Zuid-Chinese Zee|Filipijnse Zee|Sargassozee`
    ],

    [
      "🌍 AARDRIJKSKUNDE",
      "Noem een vulkaan.",
      `Etna|Vesuvius|Stromboli|Krakatau|Tambora|Merapi|Semeru|Bromo|Rinjani|Agung|Kilauea|Mauna Loa|Mauna Kea|Fuji|Sakurajima|Aso|Pinatubo|Mayon|Taal|Popocatépetl|Cotopaxi|Chimborazo|Eyjafjallajökull|Hekla|Katla|Teide|Mount St. Helens|Rainier|Erebus`
    ],

    [
      "🌍 AARDRIJKSKUNDE",
      "Noem een meer in de wereld.",
      `IJsselmeer|Markermeer|Victoriameer|Tanganyikameer|Malawimeer|Baikalmeer|Kaspische Zee|Aralmeer|Titicacameer|Comomeer|Gardameer|Lago Maggiore|Meer van Genève|Bodenmeer|Balatonmeer|Loch Ness|Loch Lomond|Great Salt Lake|Michiganmeer|Superiormeer|Huronmeer|Erie|Ontariomeer|Ladogameer|Onegameer|Kivumeer`
    ],

    [
      "🌍 AARDRIJKSKUNDE",
      "Noem een land in Midden-Amerika of Zuid-Amerika.",
      `Argentinië|Bolivia|Brazilië|Chili|Colombia|Ecuador|Guyana|Paraguay|Peru|Suriname|Uruguay|Venezuela|Belize|Costa Rica|El Salvador|Guatemala|Honduras|Nicaragua|Panama|Mexico`
    ],

    [
      "⚽ SPORT",
      "Noem een wintersport.",
      `Skiën|Langlaufen|Snowboarden|Schaatsen|Kunstschaatsen|IJshockey|Curling|Bobsleeën|Rodelen|Skeleton|Biatlon|Noordse combinatie|Schansspringen|Freestyleskiën|Skicross|Snowboardcross|Shorttrack|Langebaanschaatsen|Schaatssprint|Toerschaatsen|Telemark|Toerskiën|IJsklimmen|Sneeuwschoenwandelen|Skimountaineering`
    ],

    [
      "⚽ SPORT",
      "Noem een vechtsport.",
      `Judo|Karate|Taekwondo|Boksen|Kickboksen|Muay Thai|Braziliaans jiujitsu|Jiu jitsu|Worstelen|Sambo|Aikido|Kendo|Kungfu|Wushu|Capoeira|Savate|Sumo|Schermen|Hapkido|Pencak silat|Krav maga|MMA|Lethwei|Ninjutsu|Tang soo do`
    ],

    [
      "⚽ SPORT",
      "Noem een watersport.",
      `Zwemmen|Waterpolo|Surfen|Windsurfen|Kitesurfen|Zeilen|Roeien|Kajakken|Kanoën|Raften|Duiken|Snorkelen|Waterskiën|Wakeboarden|Suppen|Stand-up paddleboarden|Bodyboarden|Golfsurfen|Schoonspringen|Synchroonzwemmen|Openwaterzwemmen|Drakenbootracen|Skimboarden|Jetskiën|Freediving`
    ],

    [
      "⚽ SPORT",
      "Noem een onderdeel van de atletiek.",
      `100 meter|200 meter|400 meter|800 meter|1500 meter|3000 meter|5000 meter|10000 meter|Marathon|Halve marathon|110 meter horden|100 meter horden|400 meter horden|Steeplechase|Hoogspringen|Verspringen|Hink-stap-springen|Polsstokhoogspringen|Kogelstoten|Discuswerpen|Speerwerpen|Kogelslingeren|Tienkamp|Zevenkamp|Estafette`
    ],

    [
      "🎵 MUZIEK",
      "Noem een beroemde componist uit de klassieke muziek.",
      `Mozart|Beethoven|Bach|Vivaldi|Chopin|Schubert|Haydn|Händel|Brahms|Tchaikovsky~Tsjaikovski|Debussy|Ravel|Wagner|Verdi|Puccini|Rossini|Saint-Saëns|Satie|Grieg|Dvořák|Smetana|Mahler|Bruckner|Prokofjev|Stravinsky|Rachmaninov|Mendelssohn|Clara Schumann`
    ],

    [
      "🎵 MUZIEK",
      "Noem een muziekinstrument met snaren.",
      `Gitaar|Elektrische gitaar|Basgitaar|Viool|Altviool|Cello|Contrabas|Harp|Luit|Mandoline|Banjo|Ukelele|Sitar|Koto|Shamisen|Erhu|Piano|Klavecimbel|Citer|Dulcimer|Oed~Oud|Balalaika|Bouzouki|Kora|Nyckelharpa|Sarangi`
    ],

    [
      "🎵 MUZIEK",
      "Noem een slaginstrument.",
      `Trommel|Drumstel|Snaredrum|Bassdrum|Bongo|Conga|Djembé|Cajón|Tamboerijn|Triangel|Xylofoon|Marimba|Vibrafoon|Pauken|Cymbalen|Bekken|Gong|Agogo|Claves|Castagnetten|Guiro|Woodblock|Kalimba|Steelpan|Maracas|Shaker`
    ],

    [
      "🎵 MUZIEK",
      "Noem een blaasinstrument.",
      `Fluit|Dwarsfluit|Blokfluit|Piccolo|Klarinet|Basklarinet|Saxofoon|Hobo|Fagot|Contrafagot|Trompet|Trombone|Hoorn|Franse hoorn|Tuba|Eufonium|Bugel|Cornet|Sousafoon|Mondharmonica|Doedelzak|Panfluit|Ocarina|Shakuhachi|Duduk|Didgeridoo`
    ],

    [
      "🧪 WETENSCHAP",
      "Noem een planeet, dwergplaneet of kandidaat-dwergplaneet van ons zonnestelsel.",
      `Mercurius|Venus|Aarde|Mars|Jupiter|Saturnus|Uranus|Neptunus|Pluto|Ceres|Eris|Haumea|Makemake|Orcus|Quaoar|Sedna|Gonggong|Varuna|Salacia|Ixion|Vesta|Pallas|Hygiea|2002 MS4`
    ],

    [
      "🧪 WETENSCHAP",
      "Noem een wetenschappelijke eenheid.",
      `Meter|Kilometer|Centimeter|Millimeter|Kilogram|Gram|Milligram|Seconde|Minuut|Uur|Kelvin|Celsius|Ampère|Volt|Watt|Joule|Newton|Pascal|Hertz|Ohm|Coulomb|Farad|Tesla|Weber|Henry|Mol|Candela|Lumen|Lux|Becquerel|Gray|Sievert`
    ],

    [
      "🧪 WETENSCHAP",
      "Noem een uitvinding waarmee mensen informatie kunnen vastleggen of delen.",
      `Boekdrukkunst|Schrift|Papier|Drukpers|Fotografie|Camera|Telefoon|Telegraaf|Radio|Televisie|Internet|Computer|E-mail|Fax|Typemachine|Grammofoon|Fonograaf|Microfoon|Satelliet|Mobiele telefoon|Smartphone|Videocamera|USB-stick|Cd-rom|Film|Podcast|Morsecode`
    ],

    [
      "🧪 WETENSCHAP",
      "Noem een soort natuurverschijnsel.",
      `Regen|Sneeuw|Hagel|Mist|Regenboog|Onweer|Bliksem|Donder|Tornado|Orkaan|Aardbeving|Tsunami|Vulkaanuitbarsting|Aurora|Noorderlicht|Zonsverduistering|Maansverduistering|Getijden|Waterval|Geiser|IJsregen|Vorst|Dauw|Rijp|Halo|Fata morgana`
    ],

    [
      "🧪 WETENSCHAP",
      "Noem een meetinstrument.",
      `Thermometer|Barometer|Hygrometer|Snelheidsmeter|Kilometerteller|Weegschaal|Meetlint|Liniaal|Schuifmaat|Micrometer|Multimeter|Voltmeter|Ampèremeter|Ohmmeter|Oscilloscoop|Stopwatch|Klok|Chronometer|Seismograaf|Anemometer|Regenmeter|Kompas|Gradenboog|Geigerteller|Spectrometer|pH-meter|Luxmeter`
    ],

    [
      "📜 GESCHIEDENIS",
      "Noem een beschaving uit de oudheid.",
      `Oude Egyptenaren|Sumeriërs|Babyloniërs|Assyriërs|Hettieten|Feniciërs|Grieken|Romeinen|Perzen|Minoërs|Myceners|Etrusken|Nubiërs|Aksum|Indusbeschaving|Olmeken|Maya|Zapotheken|Teotihuacan|Daciërs|Scythen|Galliërs|Kelten|Nabateeërs|Karthagers`
    ],

    [
      "📜 GESCHIEDENIS",
      "Noem een historisch bouwwerk van voor 1800.",
      `Colosseum|Pantheon|Piramiden van Gizeh|Sfinx van Gizeh|Chinese Muur|Stonehenge|Parthenon|Akropolis|Taj Mahal|Machu Picchu|Angkor Wat|Petra|Chichén Itzá|Hagia Sophia|Notre-Dame|Sint-Pietersbasiliek|Alhambra|Verboden Stad|Borobudur|Paleis van Versailles|Toren van Pisa|El Castillo|Karnaktempel|Abu Simbel`
    ],

    [
      "📜 GESCHIEDENIS",
      "Noem een beroemde ontdekkingsreiziger.",
      `Marco Polo|Christoffel Columbus|Ferdinand Magellaan|Vasco da Gama|James Cook|Abel Tasman|Roald Amundsen|Robert Scott|Ernest Shackleton|David Livingstone|Henry Morton Stanley|Ibn Battuta|Zheng He|Willem Barentsz|Hendrik de Zeevaarder|Amerigo Vespucci|Francis Drake|Jacques Cartier|Henry Hudson|Samuel de Champlain|Hernán Cortés|Francisco Pizarro|Alexander von Humboldt`
    ],

    [
      "📜 GESCHIEDENIS",
      "Noem een historische koning of koningin.",
      `Cleopatra|Toetanchamon|Ramses II|Alexander de Grote|Karel de Grote|Lodewijk XIV|Elizabeth I|Elizabeth II|Victoria|Wilhelmina|Juliana|Beatrix|Willem-Alexander|Napoleon|Hendrik VIII|Maria Theresia|Catharina de Grote|Peter de Grote|Willem III|Willem I|Lodewijk XVI|Salomo|David|Filips II`
    ],

    [
      "🍽️ ETEN",
      "Noem een soort pasta.",
      `Spaghetti|Macaroni|Penne|Fusilli|Farfalle|Tagliatelle|Fettuccine|Linguine|Rigatoni|Cannelloni|Lasagne|Ravioli|Tortellini|Orzo|Orecchiette|Conchiglie|Pappardelle|Bucatini|Vermicelli|Cavatappi|Strozzapreti|Mafaldine|Gemelli|Rotini|Ziti|Radiatori`
    ],

    [
      "🍽️ ETEN",
      "Noem een specerij.",
      `Peper|Zwarte peper|Witte peper|Paprikapoeder|Komijn|Kurkuma|Kaneel|Kruidnagel|Nootmuskaat|Kardemom|Steranijs|Anijs|Venkelzaad|Korianderzaad|Mosterdzaad|Saffraan|Gember|Chilipoeder|Cayennepeper|Piment|Sumak|Fenegriek|Maanzaad|Sesamzaad|Jeneverbes`
    ],

    [
      "🍽️ ETEN",
      "Noem een soort brood.",
      `Witbrood|Bruinbrood|Volkorenbrood|Speltbrood|Zuurdesembrood|Stokbrood|Baguette|Ciabatta|Focaccia|Pitabrood|Naan|Roti|Tortilla|Bagel|Brioche|Croissant|Roggebrood|Krentenbrood|Mueslibrood|Maisbrood|Tijgerbrood|Desembrood|Sodabrood|Pumpernickel|Flatbread|Knäckebröd`
    ],

    [
      "🍽️ ETEN",
      "Noem een soort noot of eetbaar zaad.",
      `Amandel|Cashewnoot|Walnoot|Hazelnoot|Pistache|Pecannoot|Macadamianoot|Paranoot|Pinda|Pijnboompit|Zonnebloempit|Pompoenpit|Sesamzaad|Chiazaad|Lijnzaad|Hennepzaad|Maanzaad|Watermeloenzaad|Kokos|Kastanje|Tijgernoot|Pili-noot|Kola-noot|Lotuszaad`
    ],

    [
      "🍽️ ETEN",
      "Noem een Italiaans gerecht.",
      `Pizza|Lasagne|Risotto|Gnocchi|Ravioli|Tortellini|Spaghetti carbonara|Bolognese|Pesto|Bruschetta|Caprese|Minestrone|Osso buco|Polenta|Focaccia|Arancini|Tiramisu|Panna cotta|Cannoli|Gelato|Calzone|Parmigiana|Saltimbocca|Cacio e pepe|Amatriciana|Vitello tonnato`
    ],

    [
      "👗 MODE",
      "Noem een modeontwerper.",
      `Coco Chanel|Christian Dior|Yves Saint Laurent|Giorgio Armani|Gianni Versace|Donatella Versace|Miuccia Prada|Ralph Lauren|Tom Ford|Calvin Klein|Karl Lagerfeld|Alexander McQueen|Vivienne Westwood|Jean Paul Gaultier|Valentino Garavani|Hubert de Givenchy|Cristóbal Balenciaga|Rei Kawakubo|Issey Miyake|Stella McCartney|Marc Jacobs|Virgil Abloh|Dries Van Noten|Iris van Herpen|Viktor & Rolf|Paco Rabanne`
    ],

    [
      "👗 MODE",
      "Noem een bekend modetijdschrift.",
      `Vogue|Elle|Harper’s Bazaar|Marie Claire|Glamour|Cosmopolitan|InStyle|GQ|Esquire|Vanity Fair|W Magazine|Dazed|i-D|Numéro|L’Officiel|Tatler|The Gentlewoman|Fantastic Man|AnOther Magazine|Fashion|Allure|Nylon|V Magazine|Purple Fashion`
    ],

    [
      "👗 MODE",
      "Noem een kledingmerk dat sportkleding verkoopt.",
      `Nike|Adidas|Puma|Under Armour|Reebok|Fila|New Balance|Asics|Mizuno|Umbro|Kappa|Hummel|Lotto|Diadora|Champion|Ellesse|Lululemon|Gymshark|The North Face|Columbia|Patagonia|Salomon|Oakley|Decathlon|Skechers|Converse`
    ],

    [
      "👗 MODE",
      "Noem een schoenmerk.",
      `Nike|Adidas|Puma|Converse|Vans|New Balance|Asics|Reebok|Skechers|Dr. Martens|Timberland|Birkenstock|Clarks|Ecco|UGG|Crocs|Salomon|Merrell|On Running|Hoka|Fila|Mizuno|Lacoste|Geox|Veja|Camper|Kickers`
    ],

    [
      "🏛️ CULTUUR",
      "Noem een kunstmuseum.",
      `Rijksmuseum|Van Gogh Museum|Mauritshuis|Stedelijk Museum|Louvre|Musée d’Orsay|Prado|Uffizi|Tate Modern|National Gallery|British Museum|Metropolitan Museum of Art|MoMA|Guggenheim Museum|Vaticaanse Musea|Hermitage|Pergamonmuseum|Kunsthistorisches Museum|Centre Pompidou|Kröller-Müller Museum|Museum Boijmans Van Beuningen|Moco Museum|Kunstmuseum Den Haag|Museo Reina Sofía`
    ],

    [
      "🏛️ CULTUUR",
      "Noem een schilder die vóór 1900 geboren is.",
      `Rembrandt|Vincent van Gogh|Johannes Vermeer|Claude Monet|Edgar Degas|Pierre-Auguste Renoir|Paul Cézanne|Pablo Picasso|Henri Matisse|Salvador Dalí|Frida Kahlo|Jan van Eyck|Jheronimus Bosch|Pieter Bruegel|Rubens|Caravaggio|Leonardo da Vinci|Michelangelo|Raphael|Goya|Turner|Kandinsky|Mondriaan|Hokusai|Hiroshige|Artemisia Gentileschi`
    ],

    [
      "🏛️ CULTUUR",
      "Noem een beroemde schrijver uit de wereldliteratuur.",
      `William Shakespeare|Charles Dickens|Jane Austen|J.R.R. Tolkien|George Orwell|Agatha Christie|Jules Verne|Victor Hugo|Leo Tolstoj|Dostojevski|Franz Kafka|Virginia Woolf|Mary Shelley|Hans Christian Andersen|Homerus|Dante|Goethe|Miguel de Cervantes|Herman Melville|Mark Twain|Oscar Wilde|Anton Tsjechov|Gabriel García Márquez|Chinua Achebe|Haruki Murakami`
    ],

    [
      "🌿 NATUUR",
      "Noem een bloemsoort.",
      `Roos|Tulp|Zonnebloem|Madeliefje|Paardenbloem|Lelie|Orchidee|Narcis|Hyacint|Krokus|Anjer|Gerbera|Chrysant|Dahlia|Viooltje|Lavendel|Klaproos|Iris|Hortensia|Pioenroos|Begonia|Fuchsia|Ranonkel|Anemoon|Goudsbloem|Vergeet-mij-nietje`
    ],

    [
      "🌿 NATUUR",
      "Noem een paddenstoelensoort.",
      `Champignon|Oesterzwam|Shiitake|Eekhoorntjesbrood|Cantharel|Morielje|Trompet de la mort|Vliegenzwam|Grote parasolzwam|Inktzwam|Elfenbankje|Reuzenbovist|Truffel|Boleet|Koningsoesterzwam|Enoki|Nameko|Maitake|Beukenzwam|Judasoor|Gele knolamaniet|Groene knolamaniet|Geschubde inktzwam`
    ],

    [
      "🌿 NATUUR",
      "Noem een edelsteen.",
      `Diamant|Robijn|Saffier|Smaragd|Amethist|Opaal|Topaas|Aquamarijn|Granaat|Turkoois|Jade|Onyx|Agaat|Citrien|Peridoot|Tanzaniet|Lapis lazuli|Maansteen|Rozenkwarts|Bergkristal|Jaspis|Spinel|Toermalijn|Alexandriet|Zirkoon|Morganiet`
    ],

    [
      "🌿 NATUUR",
      "Noem een wolkensoort of een herkenbare wolkenvorm.",
      `Cirrus|Cirrocumulus|Cirrostratus|Altocumulus|Altostratus|Nimbostratus|Stratocumulus|Stratus|Cumulus|Cumulonimbus|Lenticularis|Mammatus|Pileus|Arcus|Undulatus|Fibratus|Castellanus|Floccus|Humilis|Mediocris|Congestus|Calvus|Capillatus|Virga`
    ],

    [
      "🚗 VERVOER",
      "Noem een vervoermiddel dat over rails rijdt.",
      `Trein|Metro|Tram|Hogesnelheidstrein|Stoomtrein|Dieseltrein|Elektrische trein|Monorail|Lightrail|Sneltram|Goederentrein|Passagierstrein|Intercity|Sprinter|Nightjet|Slaaptrein|Bergtrein|Tandradbaan|Kabeltrein|Funiculaire|TGV|ICE|Eurostar|Shinkansen|Maglev`
    ],

    [
      "🚗 VERVOER",
      "Noem een soort boot of schip.",
      `Zeilboot|Motorboot|Roeiboot|Kano|Kajak|Veerboot|Cruiseschip|Vrachtschip|Containerschip|Tankerschip|Sleepboot|Vissersboot|Onderzeeboot|Jacht|Catamaran|Trimaran|Gondel|Sloep|Reddingsboot|Fregat|Korvet|IJsbreker|Hovercraft|Pont`
    ],

    [
      "🚗 VERVOER",
      "Noem een soort luchtvaartuig.",
      `Passagiersvliegtuig|Straalvliegtuig|Propellervliegtuig|Zweefvliegtuig|Gevechtsvliegtuig|Transportvliegtuig|Watervliegtuig|Amfibievliegtuig|Bommenwerper|Jachtvliegtuig|Verkenningsvliegtuig|Sportvliegtuig|Lesvliegtuig|Ultralight|Tweedekker|Driedekker|Zakenvliegtuig|Luchtballon|Deltavlieger|Helikopter|Autogiro|Drone|Airbus A320|Boeing 747`
    ],

    [
      "🧩 ALGEMENE KENNIS",
      "Noem een bordspel.",
      `Schaken|Dammen|Monopoly|Scrabble|Risk|Catan|Carcassonne|Ticket to Ride|Cluedo|Stratego|Rummikub|Mens-erger-je-niet|Go|Backgammon|Halma|Ganzenbord|Triviant|Pictionary|Codenames|Pandemic|Azul|Wingspan|Terraforming Mars|Agricola|Puerto Rico|7 Wonders|Dominion`
    ],

    [
      "🧩 ALGEMENE KENNIS",
      "Noem een kaartspel.",
      `Poker|Bridge|Klaverjassen|Pesten|Hartenjagen|Patience|Solitaire|Uno|Zwarte Pieten|Toepen|Rikken|Wiezen|Canasta|Rummy|Gin rummy|Ezelen|Kwartetten|Eenendertigen|Duizenden|Hearts|Spades|Baccarat|Texas Holdem|Skip-Bo`
    ],

    [
      "🧩 ALGEMENE KENNIS",
      "Noem een schoolvak.",
      `Nederlands|Engels|Duits|Frans|Spaans|Wiskunde|Rekenen|Geschiedenis|Aardrijkskunde|Biologie|Natuurkunde|Scheikunde|Maatschappijleer|Economie|Bedrijfseconomie|Informatica|Techniek|Muziek|Tekenen|Beeldende vorming|Lichamelijke opvoeding|Gym|Filosofie|Kunstgeschiedenis|Latijn|Grieks`
    ],

    [
      "🧩 ALGEMENE KENNIS",
      "Noem een soort muziekevenement.",
      `Concert|Festival|Popconcert|Rockconcert|Jazzfestival|Klassiek concert|Operavoorstelling|Musical|Openluchtconcert|Muziekwedstrijd|Talentenshow|Koorconcert|Orgelconcert|DJ-set|Rave|Dancefestival|Bluesfestival|Hiphopfestival|Kamermuziekconcert|Pianorecital|Symfonieconcert|Orkestconcert|Straatmuziekfestival|Benefietconcert`
    ],

    [
      "🧩 ALGEMENE KENNIS",
      "Noem een ruimtevaartorganisatie.",
      `NASA|ESA|JAXA|ISRO|CNSA|Roscosmos|CSA|CNES|DLR|ASI|KARI|UK Space Agency|AEB|CONAE|ISA|UAE Space Agency|NASA Goddard|ESA ESTEC`
    ],

    [
      "🧩 ALGEMENE KENNIS",
      "Noem een soort brug.",
      `Hangbrug|Tuibrug|Boogbrug|Liggerbrug|Vakwerkbrug|Ophaalbrug|Draaibrug|Klapbrug|Hefbrug|Pontbrug|Spoorbrug|Verkeersbrug|Voetgangersbrug|Fietsbrug|Viaduct|Aquaduct|Vlotbrug|Basculebrug|Baileybrug|Cantileverbrug|Stenen brug|Houten brug|Touwbrug`
    ]

  ];


  /* ========================================
     ANTWOORDEN NORMALISEREN
  ======================================== */

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* ========================================
     BESTAANDE VRAGEN CONTROLEREN
  ======================================== */

  const present = new Set(
    bank.map(function (question) {
      return normalize(
        String(question.question || "")
          .split(/extra eis\s*:/i)[0]
      );
    })
  );


  /* ========================================
     NIEUWE VRAGEN TOEVOEGEN
  ======================================== */

  let added = 0;

  data.forEach(function (item, index) {

    const category = item[0];
    const questionText = item[1];
    const rawAnswers = item[2];

    const questionKey =
      normalize(questionText);

    if (present.has(questionKey)) {
      return;
    }

    const seen = new Set();
    const answers = [];

    rawAnswers.split("|").forEach(function (text) {

      const names = text
        .split("~")
        .map(function (name) {
          return name.trim();
        })
        .filter(Boolean);

      if (!names.length) {
        return;
      }

      const key = normalize(names[0]);

      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);

      answers.push({
        answer: names[0],
        aliases: names.slice(1),
        points: 10,
        isRocket: false
      });

    });

    if (answers.length < 15) {
      console.warn(
        "Te weinig antwoorden voor:",
        questionText
      );
      return;
    }

    /*
     * Bestaande vragen behouden
     * hun eigen puntenscores.
     *
     * Nieuwe vragen krijgen een
     * voorlopige spelwaardering.
     */

    answers.forEach(function (answer, i) {

      const last =
        i === answers.length - 1;

      answer.points = last
        ? 100
        : Math.min(
            99,
            10 + Math.round(
              i * 85 / answers.length
            )
          );

      answer.isRocket = last;

    });

    bank.push({

      id:
        "qb-nieuw-" +
        String(index + 1).padStart(2, "0"),

      topicId:
        "qb-nieuw-" +
        String(index + 1).padStart(2, "0"),

      category: category,

      question: questionText,

      hint:
        "Ook minder bekende antwoorden tellen mee. " +
        "Probeer iets origineels!",

      answers: answers

    });

    present.add(questionKey);

    added++;

  });


  window.QB_NIEUWE_VRAGEN_AANTAL =
    added;

  console.log(
    "✅ QuizBallon: " +
    added +
    " nieuwe kennisvragen toegevoegd."
  );

})();
