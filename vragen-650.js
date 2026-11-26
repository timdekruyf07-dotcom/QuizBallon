/* =============================================================
   QuizBallon V7 - 650 AFZONDERLIJKE VRAGEN / 13 CATEGORIEEN
   13 x 50 vragen, eigen antwoorden per vraag, 1 raketantwoord.

   Dit bestand is volledig: plak het als vragen-650.js.
   Laad het NA script.js en VOOR daily.js.

   LET OP: 650 vragen zijn inhoudelijk samengesteld, maar
   antwoordlijsten zijn NIET uitputtend of extern geverifieerd.
   De punten zijn SPELPUNTEN, geen gemeten zeldzaamheid.
============================================================= */
(function () {
  "use strict";
  const RAW = `# Dieren
Noem een soort grote katachtige.|Leeuw;Tijger;Luipaard;Jaguar;Sneeuwluipaard;Nevelpanter;Jachtluipaard
Noem een berensoort.|IJsbeer;Bruine beer;Zwarte beer;Aziatische zwarte beer;Lippenbeer;Maleise beer;Brilbeer;Reuzenpanda
Noem een walvisachtige.|Blauwe vinvis;Bultrug;Potvis;Orka;Narwal;Beluga;Bruinvis;Tuimelaar;Gewone dolfijn;Grijze walvis;Noordkaper
Noem een haaiensoort.|Witte haai;Tijgerhaai;Walvishaai;Hamerhaai;Stierhaai;Blauwe haai;Makohaai;Reuzenhaai;Zwartpunthaai;Citroenhaai
Noem een soort pinguïn.|Keizerspinguïn;Koningspinguïn;Adéliepinguïn;Ezelspinguïn;Kinbandpinguïn;Afrikaanse pinguïn;Humboldtpinguïn;Magelhaenpinguïn;Dwergpinguïn;Macaronipinguïn
Noem een arendsoort.|Steenarend;Zeearend;Amerikaanse zeearend;Keizerarend;Steppenarend;Harpij;Slangenarend;Visarend;Dwergarend;Filipijnse arend
Noem een uilensoort.|Kerkuil;Bosuil;Oehoe;Steenuil;Ransuil;Velduil;Sneeuwuil;Sperweruil;Briluil;Dwergooruil
Noem een soort papegaai.|Grijze roodstaart;Ara;Kaketoe;Parkiet;Agapornis;Amazonepapegaai;Eclectuspapegaai;Lori;Kea;Kakapo
Noem een slangensoort.|Koningscobra;Brilcobra;Groene mamba;Zwarte mamba;Ratelslang;Boa constrictor;Netpython;Anaconda;Adder;Korenslang
Noem een schildpadsoort.|Groene zeeschildpad;Lederschildpad;Karetschildpad;Onechte karetschildpad;Soepschildpad;Hermannsschildpad;Moorse landschildpad;Galapagosschildpad;Roodwangschildpad
Noem een dier met een slurf.|Afrikaanse savanneolifant;Afrikaanse bosolifant;Aziatische olifant;Maleise tapir;Braziliaanse tapir;Bergtapir;Laaglandtapir
Noem een soort hert.|Edelhert;Damhert;Ree;Eland;Rendier;Sikahert;Wapiti;Muntjak;Witstaarthert;Paterdavidhert
Noem een antilopesoort.|Impala;Gazelle;Springbok;Koedoe;Oryx;Gemsbok;Elandantilope;Waterbok;Sabelantilope;Gnoe;Dikdik
Noem een knaagdiersoort.|Bever;Marmot;Hamster;Cavia;Capibara;Eekhoorn;Rat;Muis;Chinchilla;Stekelvarken;Lemming
Noem een soort aap.|Chimpansee;Bonobo;Gorilla;Orang-oetan;Baviaan;Makaak;Mandril;Kapucijnaap;Brulaap;Langoer;Gibbon
Noem een buideldier.|Kangoeroe;Koala;Wombat;Wallaby;Buidelduivel;Possum;Quokka;Buidelmuis;Buidelmol;Buidelmarter
Noem een insect dat kan vliegen.|Bijen;Wespen;Libellen;Muggen;Vliegen;Vlinders;Nachtvlinders;Lieveheersbeestjes;Meikevers;Hoornaars;Schildwantsen
Noem een keversoort.|Meikever;Mestkever;Neushoornkever;Hertkever;Boktor;Lieveheersbeestje;Vuurkever;Loopkever;Snuitkever;Coloradokever
Noem een vlindersoort.|Dagpauwoog;Atalanta;Koninginnenpage;Citroenvlinder;Koolwitje;Distelvlinder;Gehakkelde aurelia;Monarchvlinder;Morfovlinder;Icarusblauwtje
Noem een mierensoort.|Rode bosmier;Zwarte wegmier;Gele weidemier;Faraomier;Bladsnijmier;Legermier;Wevermier;Vuurmier;Reuzenmier;Zilvermier
Noem een spinachtige die geen spin is.|Schorpioen;Hooiwagen;Teek;Mijt;Pseudoschorpioen;Zweepstaartschorpioen;Zonnespin;Zweepstaarthooier
Noem een soort kikker.|Boomkikker;Bruine kikker;Groene kikker;Stierkikker;Pijlgifkikker;Glaskikker;Klauwkikker;Roodoogmakikikker;Vliegende kikker;Tomatenkikker
Noem een soort salamander.|Vuursalamander;Kamsalamander;Alpenwatersalamander;Kleine watersalamander;Axolotl;Olm;Marmersalamander;Tijgersalamander;Japanse reuzensalamander;Chinese reuzensalamander
Noem een dier uit de diepzee.|Reuzeninktvis;Kolossale inktvis;Diepzeehengelvis;Dumbo-octopus;Vampierinktvis;Viperfish;Gulperaal;Lantaarnvis;Diepzeekreeft;Kokerworm
Noem een soort rog.|Manta;Pijlstaartrog;Adelaarsrog;Stekelrog;Zandrog;Gevlekte rog;Sidderrog;Doornhaairog;Blauwe rog;Ronde pijlstaartrog
Noem een dier met een stekelige huid.|Egel;Stekelvarken;Echidna;Zee-egel;Zeester;Doornenkroonzeester;Stekelrog;Egelvis
Noem een zeesterrensoort.|Gewone zeester;Zonnester;Doornenkroonzeester;Slangster;Kussenster;Kamster;Zandster;Zeekruis
Noem een koraalrifbewoner.|Anemoonvis;Papegaaivis;Doktersvis;Koraalduivel;Murene;Zeepaardje;Manta;Egelvis;Koraalkrab;Zeeschildpad;Juffer
Noem een dier uit het regenwoud.|Jaguar;Luiaard;Toekan;Ara;Orang-oetan;Tapir;Gorilla;Okapi;Boomkikker;Miereneter;Bladsnijmier
Noem een dier uit de Sahara.|Fennek;Dromedaris;Addax;Dorcasgazelle;Woestijnvaraan;Hoornadder;Schorpioen;Springmuis;Zandkat;Woestijnegel
Noem een dier dat een winterslaap houdt.|Egel;Marmot;Vleermuis;Hazelmuis;Zevenslaper;Hamster;Eikelmuis;Grondeekhoorn
Noem een dier dat eieren legt maar een zoogdier is.|Vogelbekdier;Kortsnuitmierenegel;Langsnavelmierenegel;Westelijke langsnavelmierenegel;Oostelijke langsnavelmierenegel
Noem een loopvogel.|Struisvogel;Emoe;Nandoe;Kasuaris;Kiwi;Tinamoe;Reuzenalk;Moa;Dodo
Noem een spechtensoort.|Grote bonte specht;Kleine bonte specht;Middelste bonte specht;Groene specht;Zwarte specht;Drieteenspecht;Grijskopspecht;Witrugspecht;Noordse flikkerspecht
Noem een soort kraaiachtige.|Raaf;Zwarte kraai;Bonte kraai;Roek;Kauw;Ekster;Gaai;Notenkraker;Alpenkauw;Blauwe gaai
Noem een trekvogel die Nederland aandoet.|Boerenzwaluw;Gierzwaluw;Kievit;Grutto;Tureluur;Lepelaar;Kleine karekiet;Visdief;Koekoek;Gele kwikstaart;Kraanvogel
Noem een vis die in zoet water leeft.|Snoek;Baars;Karper;Voorn;Brasem;Meerval;Snoekbaars;Paling;Forel;Zalm;Zeelt;Steur
Noem een inktvissoort.|Octopus;Gewone pijlinktvis;Zeekat;Reuzeninktvis;Kolossale inktvis;Vampierinktvis;Dwerginktvis;Dumbo-octopus;Blauwringoctopus
Noem een soort krab.|Noordzeekrab;Strandkrab;Spinkrab;Heremietkreeft;Koningskrab;Wenkkrab;Degenkrab;Blauwe zwemkrab;Kokoskrab
Noem een bijensoort.|Honingbij;Aardhommel;Steenhommel;Akkerhommel;Rosse metselbij;Gehoornde metselbij;Pluimvoetbij;Groefbij;Behangersbij;Zandbij
Noem een dinosauriër met hoorns of een nekschild.|Triceratops;Styracosaurus;Centrosaurus;Pachyrhinosaurus;Protoceratops;Pentaceratops;Torosaurus;Chasmosaurus;Diabloceratops
Noem een langnekdinosauriër.|Brachiosaurus;Diplodocus;Apatosaurus;Brontosaurus;Argentinosaurus;Patagotitan;Mamenchisaurus;Camarasaurus;Dreadnoughtus;Alamosaurus
Noem een vleesetende dinosauriër.|Tyrannosaurus;Allosaurus;Spinosaurus;Velociraptor;Deinonychus;Giganotosaurus;Carnotaurus;Ceratosaurus;Baryonyx;Dilophosaurus
Noem een uitgestorven vliegend reptiel.|Pteranodon;Pterodactylus;Quetzalcoatlus;Rhamphorhynchus;Dimorphodon;Anhanguera;Tapejara;Hatzegopteryx;Dsungaripterus
Noem een dier dat in kolonies leeft.|Mier;Honingbij;Termiet;Stokstaartje;Naakte molrat;Pinguïn;Zeehond;Koraalpoliep;Vleermuis;Papegaaiduiker
Noem een soort vleermuis.|Gewone dwergvleermuis;Laatvlieger;Rosse vleermuis;Watervleermuis;Meervleermuis;Grootoorvleermuis;Vale vleermuis;Hoefijzerneus;Vleerhond
Noem een dier dat zijn kleur kan veranderen.|Kameleon;Octopus;Zeekat;Pijlinktvis;Platvis;Anolis;Bidsprinkhaangarnaal;Boomkikker
Noem een vis die op de oceaanbodem leeft.|Schol;Tong;Tarbot;Heilbot;Rog;Zeewolf;Zeepuit;Zeeduivel;Schar;Bot
Noem een bedreigde neushoornsoort.|Javaanse neushoorn;Sumatraanse neushoorn;Zwarte neushoorn;Indische neushoorn;Witte neushoorn
Noem een hondachtige uit het wild.|Wolf;Vos;Poolvos;Fennek;Coyote;Jakhals;Dingo;Afrikaanse wilde hond;Manenwolf;Wasbeerhond;Dhool

# Aardrijkskunde
Noem een hoofdstad in Scandinavië.|Oslo;Stockholm;Kopenhagen
Noem een land aan de Middellandse Zee.|Spanje;Frankrijk;Monaco;Italië;Slovenië;Kroatië;Bosnië en Herzegovina;Montenegro;Albanië;Griekenland;Turkije;Cyprus;Syrië;Libanon;Israël;Egypte;Libië;Tunesië;Algerije;Marokko;Malta
Noem een land aan de Oostzee.|Denemarken;Duitsland;Polen;Litouwen;Letland;Estland;Rusland;Finland;Zweden
Noem een eiland dat geografisch bij Afrika hoort.|Madagaskar;Mauritius;Réunion;Zanzibar;Pemba;Bioko;São Tomé;Príncipe;Socotra;Mohéli;Anjouan;Grande Comore;Djerba
Noem een land zonder zeekust in Europa.|Oostenrijk;Zwitserland;Tsjechië;Slowakije;Hongarije;Servië;Noord-Macedonië;Kosovo;Luxemburg;Liechtenstein;Andorra;San Marino;Vaticaanstad;Belarus;Moldavië
Noem een land dat aan Brazilië grenst.|Argentinië;Bolivia;Colombia;Frans-Guyana;Guyana;Paraguay;Peru;Suriname;Uruguay;Venezuela
Noem een land dat aan Duitsland grenst.|Nederland;België;Luxemburg;Frankrijk;Zwitserland;Oostenrijk;Tsjechië;Polen;Denemarken
Noem een eiland in het Caribisch gebied.|Cuba;Hispaniola;Jamaica;Puerto Rico;Aruba;Curaçao;Bonaire;Barbados;Martinique;Guadeloupe;Dominica;Saint Lucia;Grenada;Trinidad;Tobago
Noem een eiland in Indonesië.|Java;Sumatra;Borneo;Sulawesi;Bali;Lombok;Flores;Sumbawa;Timor;Komodo;Rinca;Nias;Bangka;Belitung;Halmahera
Noem een eiland in Japan.|Honshu;Hokkaido;Kyushu;Shikoku;Okinawa;Sado;Tsushima;Yakushima;Ishigaki;Miyako;Amami Oshima;Iriomote
Noem een Nederlands Waddeneiland.|Texel;Vlieland;Terschelling;Ameland;Schiermonnikoog;Rottumeroog;Rottumerplaat;Griend
Noem een rivier in Zuid-Amerika.|Amazone;Orinoco;Paraná;Paraguay;Uruguay;São Francisco;Magdalena;Tocantins;Xingu;Madeira;Negro;Tapajós;Mamoré
Noem een beroemde hoge berg in Azië.|Mount Everest;K2;Kangchenjunga;Lhotse;Makalu;Cho Oyu;Dhaulagiri;Manaslu;Nanga Parbat;Annapurna;Gasherbrum I;Broad Peak
Noem een gebergte in Europa.|Alpen;Pyreneeën;Karpaten;Apennijnen;Kaukasus;Oeral;Dolomieten;Vogezen;Sierra Nevada;Dinarische Alpen;Balkangebergte;Schotse Hooglanden
Noem een groot hoogland of plateau.|Tibetaans Plateau;Altiplano;Ethiopisch Hoogland;Deccanplateau;Anatolisch Plateau;Colorado Plateau;Mongools Plateau;Armeens Hoogland;Iraans Hoogland
Noem een woestijn in Afrika.|Sahara;Kalahari;Namib;Libische woestijn;Nubische woestijn;Danakilwoestijn;Karoo
Noem een bekende oase.|Siwa;Bahariya;Dakhla;Kharga;Al-Ahsa;Liwa;Turpan;Tozeur;Ghardaïa;Kufra
Noem een vulkaan in Italië.|Etna;Vesuvius;Stromboli;Vulcano;Campi Flegrei;Ischia;Pantelleria;Monte Amiata
Noem een gebied waar geisers voorkomen.|Yellowstone;Haukadalur;El Tatio;Whakarewarewa;Kamtsjatka;Rotorua;Valley of Geysers;Geysir;Norris Geyser Basin
Noem een meer in Afrika.|Victoriameer;Tanganyikameer;Malawimeer;Tsjaadmeer;Turkanameer;Kivumeer;Albertmeer;Edwardmeer;Tana;Kyogameer
Noem een zoutmeer.|Dode Zee;Great Salt Lake;Urmiameer;Assalmeer;Vanmeer;Natronmeer;Lake Eyre;Salton Sea;Don Juan Pond;Kaspische Zee
Noem een deelstaat van Duitsland.|Beieren;Baden-Württemberg;Berlijn;Brandenburg;Bremen;Hamburg;Hessen;Mecklenburg-Voor-Pommeren;Nedersaksen;Noordrijn-Westfalen;Rijnland-Palts;Saarland;Saksen;Saksen-Anhalt;Sleeswijk-Holstein;Thüringen
Noem een provincie van Nederland.|Groningen;Friesland;Drenthe;Overijssel;Flevoland;Gelderland;Utrecht;Noord-Holland;Zuid-Holland;Zeeland;Noord-Brabant;Limburg
Noem een provincie van België.|Antwerpen;Limburg;Oost-Vlaanderen;West-Vlaanderen;Vlaams-Brabant;Waals-Brabant;Henegouwen;Luik;Luxemburg;Namen
Noem een kanton van Zwitserland.|Zürich;Bern;Luzern;Uri;Schwyz;Obwalden;Nidwalden;Glarus;Zug;Fribourg;Solothurn;Basel-Stadt;Basel-Landschaft;Schaffhausen;Appenzell Ausserrhoden;Appenzell Innerrhoden;Sankt Gallen;Graubünden;Aargau;Thurgau;Ticino;Vaud;Valais;Neuchâtel;Genève;Jura
Noem een stad in Canada.|Toronto;Montréal;Vancouver;Ottawa;Calgary;Edmonton;Québec;Winnipeg;Halifax;Victoria;Saskatoon;Regina;Hamilton;London
Noem een eiland waarop een vulkaan ligt.|IJsland;Hawaï;La Palma;Lanzarote;Stromboli;Vulcano;Java;Sumatra;Sumbawa;Flores;Bali;Montserrat;Réunion
Noem een archeologische vindplaats in Azië.|Petra;Angkor Wat;Mohenjo-daro;Harappa;Borobudur;Hampi;Persepolis;Göbekli Tepe;Xi’an;Ayutthaya;Bagan;Taxila
Noem een land met een ster op de nationale vlag.|Verenigde Staten;Brazilië;China;Australië;Nieuw-Zeeland;Pakistan;Turkije;Vietnam;Somalië;Marokko;Ghana;Kameroen;Senegal;Israël
Noem een groot schiereiland in de wereld.|Arabisch Schiereiland;Iberisch Schiereiland;Scandinavisch Schiereiland;Apennijns Schiereiland;Koreaans Schiereiland;Kamtsjatka;Jutland;Yucatán;Florida;Baja California;Sinai;Maleisisch Schiereiland
Noem een grote rivierdelta.|Nijldelta;Rijndelta;Donaudelta;Mekongdelta;Ganges-Brahmaputradelta;Mississippidelta;Po-delta;Nigerdelta;Orinocodelta;Wolgadelta;Indusdelta
Noem een hoofdstad in Zuid-Amerika.|Buenos Aires;Sucre;La Paz;Brasília;Santiago;Bogotá;Quito;Georgetown;Asunción;Lima;Paramaribo;Montevideo;Caracas
Noem een bekende stad aan een rivier.|Londen;Parijs;Caïro;Rome;Boedapest;Wenen;Praag;Keulen;New York;Shanghai;Amsterdam;Rotterdam
Noem een hoofdstad in het Midden-Oosten.|Ankara;Teheran;Bagdad;Damascus;Beiroet;Amman;Jeruzalem;Riyad;Sanaa;Muscat;Abu Dhabi;Doha;Manama;Koeweitstad
Noem een schiereiland in Europa.|Iberisch Schiereiland;Balkanschiereiland;Scandinavisch Schiereiland;Italiaans Schiereiland;Jutland;Bretagne;Krim;Peloponnesos;Kola;Istrië
Noem een schiereiland in Azië.|Arabisch Schiereiland;Indisch Schiereiland;Koreaans Schiereiland;Maleisisch Schiereiland;Kamtsjatka;Anatolië;Sinai;Indochina;Taimyr;Tsjoektsjenschiereiland
Noem een zeestraat.|Straat van Gibraltar;Beringstraat;Straat van Hormuz;Bosporus;Dardanellen;Straat van Malakka;Straat van Magellaan;Straat van Dover;Straat van Messina;Straat van Taiwan;Cookstraat;Torresstraat
Noem een waterval.|Niagarawatervallen;Victoriawatervallen;Iguazúwatervallen;Angel Falls;Dettifoss;Gullfoss;Yosemite Falls;Kaieteur Falls;Tugela Falls;Sutherland Falls;Plitvice-watervallen
Noem een baai of golf.|Golf van Mexico;Golf van Biskaje;Golf van Bengalen;Perzische Golf;Golf van Aden;Golf van Guinee;Hudsonbaai;Baffinbaai;Baai van Fundy;Golf van Alaska;Golf van Thailand
Noem een atol.|Bikini-atol;Kwajalein;Majuro-atol;Rangiroa;Bora Bora;Aldabra;Tarawa;Funafuti;Malé-atol;Ari-atol;Tikehau;Aitutaki
Noem een land dat de evenaar kruist.|Ecuador;Colombia;Brazilië;São Tomé en Principe;Gabon;Congo-Brazzaville;Democratische Republiek Congo;Oeganda;Kenia;Somalië;Indonesië;Kiribati
Noem een land op het Arabisch Schiereiland.|Saoedi-Arabië;Jemen;Oman;Verenigde Arabische Emiraten;Qatar;Bahrein;Koeweit
Noem een land in de Kaukasus.|Georgië;Armenië;Azerbeidzjan;Rusland
Noem een zee die aan Europa grenst.|Noordzee;Oostzee;Middellandse Zee;Adriatische Zee;Egeïsche Zee;Ionische Zee;Tyrreense Zee;Zwarte Zee;Noorse Zee;Barentszzee;Ierse Zee;Keltische Zee
Noem een eilandengroep in de Stille Oceaan.|Hawaï;Fiji;Samoa;Tonga;Marshalleilanden;Salomonseilanden;Gilberteilanden;Carolinen;Marianen;Cookeilanden;Genootschapseilanden;Tuamotu;Vanuatu
Noem een historische handelsstad in Europa.|Amsterdam;Rotterdam;Brugge;Gent;Lübeck;Hamburg;Venetië;Genua;Antwerpen;Keulen;Bremen;Danzig
Noem een land met meer dan 100 miljoen inwoners.|India;China;Verenigde Staten;Indonesië;Pakistan;Nigeria;Brazilië;Bangladesh;Rusland;Mexico;Japan;Ethiopië;Filipijnen;Egypte;Vietnam;Democratische Republiek Congo
Noem een geografische regio in Nederland.|Veluwe;Achterhoek;Twente;Betuwe;Zaanstreek;Bollenstreek;Westland;Salland;Drenthe;Friese Wouden;Gooi;Heuvelland;Peel;Kempen;Waddengebied
Noem een hooggebergte buiten Europa.|Himalaya;Andes;Rocky Mountains;Karakoram;Tien Shan;Hindoekoesj;Alaska Range;Atlasgebergte;Rwenzori;Drakensbergen
# Sport
Noem een discipline binnen de gymnastiek.|Turnen;Ritmische gymnastiek;Trampolinespringen;Acrogym;Aerobics;Rhönradturnen;Parkour;Tumbling
Noem een toestel in het turnen.|Ringen;Rekstok;Brug met gelijke leggers;Brug met ongelijke leggers;Evenwichtsbalk;Voltigepaard;Paard met bogen;Sprongtafel;Vloer
Noem een discipline binnen het wielrennen.|Wegwielrennen;Baanwielrennen;Mountainbiken;BMX-racen;BMX-freestyle;Veldrijden;Gravelracen;Tijdrit;Puntenkoers;Keirin
Noem een discipline binnen de motorsport.|Formule 1;MotoGP;Rally;Rallycross;Motocross;Superbike;Endurance;Drag racing;Karting;Speedway;Trial
Noem een sport waarbij een racket wordt gebruikt.|Tennis;Badminton;Squash;Tafeltennis;Padel;Racquetball;Pickleball;Speedminton;Strandtennis
Noem een sport waarbij een bal met de voet wordt gespeeld.|Voetbal;Futsal;Zaalvoetbal;Footvolley;Sepak takraw;Beach soccer;Rugby;Australian football;Gaelic football
Noem een teamsport waarin een bal of puck in een doel moet.|Voetbal;Handbal;IJshockey;Hockey;Waterpolo;Lacrosse;Floorball;Basketbal;Korfbal;Futsal
Noem een sport die op ijs wordt beoefend.|IJshockey;Kunstschaatsen;Langebaanschaatsen;Shorttrack;Curling;Bandy;Schoonrijden;IJszeilen;IJsstockschieten
Noem een discipline binnen het skiën.|Slalom;Reuzenslalom;Super-G;Afdaling;Langlaufen;Schansspringen;Moguls;Skicross;Halfpipe;Big air;Noordse combinatie
Noem een discipline binnen het snowboarden.|Snowboardcross;Slopestyle;Big air;Halfpipe;Parallelreuzenslalom;Parallelslalom;Freeride;Boardercross
Noem een soort vechtsport uit Japan.|Judo;Karate;Aikido;Kendo;Sumo;Jujutsu;Kyudo;Naginata;Iaido;Shorinji kempo
Noem een discipline binnen de paardensport.|Dressuur;Springen;Eventing;Endurance;Voltige;Mennen;Reining;Polo;Paardenrennen;Working equitation
Noem een atletiekonderdeel met springen.|Hoogspringen;Verspringen;Hink-stap-springen;Polsstokhoogspringen
Noem een atletiekonderdeel met werpen of stoten.|Speerwerpen;Discuswerpen;Kogelslingeren;Kogelstoten
Noem een estafetteonderdeel in de atletiek.|4 x 100 meter;4 x 400 meter;Gemengde 4 x 400 meter;4 x 200 meter;4 x 800 meter;4 x 1500 meter
Noem een sprintafstand in de atletiek.|60 meter;100 meter;200 meter;400 meter;60 meter horden;100 meter horden;110 meter horden;400 meter horden
Noem een olympische zwemslag.|Vrije slag;Schoolslag;Rugslag;Vlinderslag;Wisselslag
Noem een discipline binnen het duiken.|Schoonspringen;Platformspringen;Springplankspringen;Synchroonspringen;Vrijduiken;Scubaduiken;Wrakduiken;Grotduiken
Noem een discipline binnen het roeien.|Skiff;Dubbeltwee;Dubbelvier;Twee zonder stuurman;Vier zonder stuurman;Acht;Coastal rowing;Indoor rowing
Noem een discipline binnen het kanoën.|Kanovaren;Kanusprint;Kanuslalom;Wildwaterkanoën;Kajakcross;Marathonkanoën;Zeekajakken;Kanopolo
Noem een variant van basketbal.|3x3 basketbal;5-tegen-5 basketbal;Rolstoelbasketbal;Streetball;Minibasketbal;Eenwielerbasketbal;Slamball
Noem een beroemde wielerklassieker.|Ronde van Vlaanderen;Parijs-Roubaix;Milaan-San Remo;Luik-Bastenaken-Luik;Ronde van Lombardije;Amstel Gold Race;Strade Bianche;Gent-Wevelgem;Waalse Pijl;Omloop Het Nieuwsblad
Noem een bekend internationaal sportstadion.|Wembley;Camp Nou;Santiago Bernabéu;Maracanã;Johan Cruijff ArenA;San Siro;Old Trafford;Anfield;Estadio Azteca;Allianz Arena;Stade de France
Noem een internationale sportbond.|FIFA;UEFA;FIBA;World Athletics;FIVB;World Aquatics;UCI;ITF;World Rugby;IOC;IJF;FIS
Noem een onderdeel van de Paralympische Spelen.|Rolstoelbasketbal;Goalball;Para-atletiek;Para-zwemmen;Boccia;Zitvolleybal;Para-badminton;Para-taekwondo;Rolstoeltennis;Paracycling;Pararoeien
Noem een bekende Nederlandse sportclub.|Ajax;PSV;Feyenoord;AZ;FC Utrecht;FC Twente;SC Heerenveen;FC Groningen;HC Bloemendaal;Kampong;ZZ Leiden;Landstede Hammers
Noem een tennistoernooi van de Grand Slam.|Australian Open;Roland Garros;Wimbledon;US Open
Noem een professionele sportcompetitie uit Noord-Amerika.|NBA;NFL;MLB;NHL;MLS;WNBA;CFL;NWSL;NASCAR Cup Series;IndyCar Series
Noem een olympische balsport.|Voetbal;Basketbal;Handbal;Hockey;Volleybal;Waterpolo;Rugby sevens;Tafeltennis;Tennis;Badminton
Noem een sport waarbij men een pijl afschiet.|Boogschieten;Veldboogschieten;3D-boogschieten;Kyudo;Handboogschieten;Kruisboogschieten
Noem een precisiesport met mikken op een doel.|Darts;Boogschieten;Schietsport;Petanque;Bowlen;Golf;Curling;Biljarten;Sjoelen;Boccia
Noem een sport met een fiets.|Wegwielrennen;Mountainbiken;BMX;Baanwielrennen;Cyclocross;Gravelracen;Fietsbal;Triatlon;Fietspolo
Noem een sport waarbij een boot wordt gebruikt.|Zeilen;Roeien;Kanoën;Kajakken;Raften;Drakenbootracen;Motorbootracen;Offshore zeilen;Sloepenroeien
Noem een sport waarbij men klimt.|Sportklimmen;Boulderen;Leadklimmen;Speedklimmen;Alpinisme;IJsklimmen;Tradklimmen;Via ferrata
Noem een sport met een paard.|Dressuur;Springen;Eventing;Polo;Endurance;Voltige;Mennen;Paardenrennen;Reining
Noem een sport met gewichtsklassen.|Boksen;Judo;Worstelen;Taekwondo;Gewichtheffen;Powerlifting;MMA;Kickboksen;Karate;Muay Thai
Noem een balsport zonder racket.|Voetbal;Basketbal;Volleybal;Handbal;Rugby;Hockey;Waterpolo;Korfbal;American football;Softbal;Honkbal
Noem een sport uit de moderne vijfkamp.|Schermen;Zwemmen;Hindernisparcours;Hardlopen;Laserschieten
Noem een discipline binnen het schermen.|Floret;Degen;Sabel
Noem een sport waarbij een helm vaak verplicht is.|IJshockey;Wielrennen;BMX;Honkbal;American football;Rugby sevens;Motocross;Skiën;Paardensport;Skateboarden
Noem een discipline binnen het triatlon.|Zwemmen;Wielrennen;Hardlopen;Sprinttriatlon;Olympische triatlon;Halve triatlon;Ironman;Crosstriatlon;Aquatlon;Duatlon
Noem een sport op een trampoline.|Trampolinespringen;Dubbele minitrampoline;Tumbling;Synchroontrampoline;Freestyle trampoline
Noem een Aziatische vechtsport.|Judo;Karate;Taekwondo;Aikido;Kendo;Sumo;Muay Thai;Wushu;Sambo;Pencak silat;Hapkido
Noem een behendigheidssport met een hond.|Agility;Flyball;Dogfrisbee;Obedience;Hoopers;Dogdance;Speurwerk;Canicross
Noem een sport die op het strand wordt gespeeld.|Beachvolleybal;Beach soccer;Beach handball;Beach tennis;Footvolley;Strandkorfbal;Ultimate frisbee;Beach rugby
Noem een bekende sporttrofee.|Wereldbeker voetbal;Stanley Cup;Vince Lombardi Trophy;Larry O'Brien Trophy;Davis Cup;Ryder Cup;Calcutta Cup;FA Cup;KNVB-beker
Noem een discipline binnen het schaatsen.|500 meter;1000 meter;1500 meter;3000 meter;5000 meter;10000 meter;Ploegenachtervolging;Massastart;Shorttrack;Kunstschaatsen
Noem een sport waarbij een bal of shuttle over een net moet.|Volleybal;Beachvolleybal;Tennis;Badminton;Tafeltennis;Sepak takraw;Bossaball;Footvolley;Padel;Pickleball
Noem een sport waarbij men een bat of knuppel gebruikt.|Honkbal;Softbal;Cricket;Rounders;Slagbal;Pesäpallo;Hurling
Noem een wintersport met een slee.|Bobsleeën;Rodelen;Skeleton;Hondensleeën;Naturbahnrodeln;Sleeplooien

# Muziek
Noem een houten blaasinstrument.|Klarinet;Hobo;Fagot;Dwarsfluit;Blokfluit;Piccolo;Saxofoon;Basklarinet;Althobo;Contrafagot
Noem een koperblaasinstrument.|Trompet;Trombone;Hoorn;Tuba;Cornet;Bugel;Eufonium;Sousafoon;Bastrombone;Piccolotrompet
Noem een strijkinstrument.|Viool;Altviool;Cello;Contrabas;Viola da gamba;Erhu;Morin khuur;Sarangi;Nyckelharpa
Noem een toetsinstrument.|Piano;Orgel;Klavecimbel;Keyboard;Accordeon;Harmonium;Celesta;Synthesizer;Vleugel;Melodica
Noem een instrument dat je tokkelt.|Gitaar;Harp;Luit;Ukelele;Mandoline;Banjo;Sitar;Koto;Shamisen;Balalaika;Oed
Noem een Afrikaans muziekinstrument.|Djembé;Kora;Kalimba;Balafon;Talking drum;Ngoni;Mbira;Shekere;Udu;Dunun
Noem een Aziatisch muziekinstrument.|Sitar;Tabla;Erhu;Koto;Shamisen;Shakuhachi;Guzheng;Pipa;Duduk;Gamelan;Oed
Noem een Latijns-Amerikaans muziekinstrument.|Maracas;Conga;Bongo;Claves;Guiro;Cuíca;Charango;Bandoneon;Berimbau;Agogo;Timbales
Noem een instrument uit een symfonieorkest.|Viool;Altviool;Cello;Contrabas;Dwarsfluit;Hobo;Klarinet;Fagot;Hoorn;Trompet;Trombone;Tuba;Pauken;Harp
Noem een instrument dat met lucht uit een balg werkt.|Accordeon;Bandoneon;Harmonium;Concertina;Trekharmonica;Melodeon
Noem een muziekgenre dat ontstond in Jamaica.|Reggae;Ska;Rocksteady;Dancehall;Dub;Ragga;Mento;Lovers rock
Noem een muziekgenre dat wortels heeft in de Verenigde Staten.|Jazz;Blues;Rock-'n-roll;Hip-hop;Country;Gospel;Soul;Funk;House;Techno;Bluegrass;Ragtime
Noem een stijl binnen de jazz.|Bebop;Swing;Cool jazz;Free jazz;Hard bop;Fusion;Dixieland;Smooth jazz;Modal jazz;Ragtime
Noem een stijl binnen de elektronische dansmuziek.|House;Techno;Trance;Drum and bass;Dubstep;Hardstyle;Gabber;Electro;UK garage;Breakbeat;Ambient;Psytrance
Noem een stijl binnen de rockmuziek.|Hardrock;Punkrock;Progressieve rock;Indierock;Alternatieve rock;Grunge;Glamrock;Psychedelische rock;Garagerock;Postrock
Noem een stijl binnen de metalmuziek.|Heavy metal;Thrashmetal;Deathmetal;Blackmetal;Powermetal;Doommetal;Symfonische metal;Nu metal;Folkmetal;Progressieve metal
Noem een stijl binnen hiphop.|Boom bap;Trap;Drill;G-funk;Cloud rap;Conscious hiphop;Gangstarap;Lo-fi hiphop;Jazzrap;Alternative hiphop
Noem een muziekgenre uit Brazilië.|Samba;Bossa nova;Forró;Choro;Axé;Sertanejo;Frevo;Pagode;Maracatu;Música popular brasileira
Noem een klassieke muziekvorm.|Symfonie;Sonate;Concerto;Fuga;Suite;Cantate;Oratorium;Opera;Ouverture;Etude;Prelude;Scherzo
Noem een soort zangstem.|Sopraan;Mezzosopraan;Alt;Countertenor;Tenor;Bariton;Bas;Basso profundo;Contralto
Noem een aanduiding voor het tempo in klassieke muziek.|Largo;Adagio;Andante;Moderato;Allegro;Vivace;Presto;Prestissimo;Lento;Grave
Noem een dynamische aanduiding uit de muziek.|Pianissimo;Piano;Mezzopiano;Mezzoforte;Forte;Fortissimo;Crescendo;Diminuendo;Sforzando;Decrescendo
Noem een maatsoort in muziek.|Twee vierde;Drie vierde;Vier vierde;Zes achtste;Vijf vierde;Zeven achtste;Twaalf achtste;Drie achtste
Noem een muzieknoot.|Do;Re;Mi;Fa;Sol;La;Si;C;D;E;F;G;A;B
Noem een componist uit de barok.|Bach;Vivaldi;Händel;Corelli;Telemann;Purcell;Lully;Rameau;Scarlatti;Buxtehude
Noem een componist uit de romantiek.|Chopin;Schumann;Brahms;Liszt;Wagner;Verdi;Tchaikovsky;Mendelssohn;Berlioz;Dvořák;Mahler
Noem een techniek voor het bespelen van een gitaar.|Fingerpicking;Barré;Arpeggio;Bending;Vibrato;Slide;Hammer-on;Pull-off;Palm muting;Tapping;Strummen
Noem een bekend platenlabel.|Sony Music;Universal Music;Warner Music;Sub Pop;Motown;Def Jam;EMI;Atlantic;Blue Note;Domino;XL Recordings;Island Records
Noem een bekende opera.|Carmen;La Traviata;La Bohème;Die Zauberflöte;Don Giovanni;Tosca;Aida;Rigoletto;Madama Butterfly;Le nozze di Figaro
Noem een bekende musical.|Les Misérables;The Phantom of the Opera;Hamilton;Cats;Wicked;The Lion King;Chicago;West Side Story;Mamma Mia!;Rent
Noem een beroemd jazzmuzikant.|Louis Armstrong;Duke Ellington;Miles Davis;John Coltrane;Ella Fitzgerald;Billie Holiday;Charlie Parker;Thelonious Monk;Nina Simone;Herbie Hancock
Noem een bekende bluesmuzikant.|B.B. King;Muddy Waters;Robert Johnson;Howlin' Wolf;John Lee Hooker;Etta James;Buddy Guy;Koko Taylor;Stevie Ray Vaughan
Noem een bekende reggaemuzikant.|Bob Marley;Peter Tosh;Bunny Wailer;Jimmy Cliff;Toots Hibbert;Burning Spear;Dennis Brown;Gregory Isaacs;Sean Paul
Noem een rockband uit het Verenigd Koninkrijk.|The Beatles;The Rolling Stones;Queen;Led Zeppelin;Pink Floyd;The Who;Oasis;Radiohead;Coldplay;Muse;Arctic Monkeys
Noem een bekend internationaal muziekfestival.|Glastonbury;Coachella;Tomorrowland;Rock Werchter;Lowlands;Pinkpop;Sziget;Montreux Jazz Festival;North Sea Jazz;Roskilde;Wacken Open Air
Noem een beroemd concertgebouw.|Concertgebouw Amsterdam;Royal Albert Hall;Carnegie Hall;Elbphilharmonie;Sydney Opera House;Musikverein;Philharmonie de Paris;Berliner Philharmonie;Walt Disney Concert Hall
Noem een klassieke muziekperiode.|Middeleeuwen;Renaissance;Barok;Classicisme;Romantiek;Impressionisme;Modernisme;Hedendaagse muziek
Noem een digitaal audioformaat.|MP3;WAV;FLAC;AAC;OGG;AIFF;ALAC;WMA;Opus;MIDI
Noem een fysieke geluidsdrager.|Vinylplaat;Cassettebandje;Cd;Schellakplaat;Minidisc;Dvd-audio;SACD;Bandrecorderband;Muziekrol
Noem een studioapparaat voor muziekproductie.|Mengpaneel;Microfoon;Audio-interface;Compressor;Equalizer;Synthesizer;Sampler;Drummachine;MIDI-controller;Monitorspeaker
Noem een onderdeel van een drumstel.|Snaredrum;Bassdrum;Tomtom;Floortom;Hi-hat;Ridebekken;Crashbekken;Splashbekken;Pedaal;Drumkruk
Noem een gitaarsoort.|Klassieke gitaar;Akoestische gitaar;Elektrische gitaar;Basgitaar;Twaalfsnarige gitaar;Resonatorgitaar;Lapsteelgitaar;Baritongitaar;Flamencogitaar
Noem een soort koor.|Mannenkoor;Vrouwenkoor;Gemengd koor;Kinderkoor;Kamerkoor;Gospelkoor;Mannenensemble;Vocaal ensemble;Jongenskoor
Noem een dansmuziekstijl uit Latijns-Amerika.|Salsa;Merengue;Bachata;Cumbia;Reggaeton;Samba;Tango;Forró;Cha-cha-cha;Mambo
Noem een snaarinstrument uit India.|Sitar;Sarod;Veena;Tanpura;Santoor;Sarangi;Esraj;Dilruba
Noem een ritmisch slaginstrument.|Bongo;Conga;Djembé;Cajón;Tamboerijn;Maracas;Claves;Castagnetten;Agogo;Shaker
Noem een snaarinstrument zonder toetsen.|Gitaar;Viool;Altviool;Cello;Contrabas;Harp;Luit;Mandoline;Banjo;Ukelele;Sitar;Koto
Noem een muziekeffect voor elektrische gitaar.|Distortion;Overdrive;Fuzz;Chorus;Flanger;Phaser;Delay;Reverb;Wah-wah;Tremolo
Noem een type microfoon.|Dynamische microfoon;Condensatormicrofoon;Lintmicrofoon;USB-microfoon;Shotgunmicrofoon;Lavaliermicrofoon;Grensvlakmicrofoon;Meetmicrofoon
Noem een manier om een lied live uit te voeren.|Akoestisch;A capella;Met orkest;Met band;Solo;Met koor;Met backingtrack;Met loopstation;Geïmproviseerd
# Mode
Noem een soort jas.|Trenchcoat;Regenjas;Parka;Bomberjack;Blazer;Spijkerjack;Leren jack;Donsjas;Peacoat;Mantel;Windjack;Pufferjack
Noem een soort broek.|Jeans;Chino;Cargo broek;Culotte;Legging;Joggingbroek;Pantalon;Short;Bermuda;Palazzobroek;Flared broek;Capribroek
Noem een soort rok.|Kokerrok;Plooirok;Maxirok;Minirok;Midi-rok;A-lijnrok;Tulerok;Wikkelrok;Ballonrok;Spijkerrok;Cirkelrok
Noem een soort jurk.|Cocktailjurk;Avondjurk;Zomerjurk;Overhemdjurk;Wikkeljurk;Maxijurk;Mini-jurk;Midi-jurk;Galajurk;Trouwjurk;Tricotjurk
Noem een soort overhemdkraag.|Kentkraag;Button-downkraag;Haifaaikraag;Cutawaykraag;Mao-kraag;Opstaande kraag;Clubkraag;Spread collar;Wing collar
Noem een soort trui.|Coltrui;V-halstrui;Rondehalstrui;Kabeltrui;Gebreide trui;Sweater;Hoodie;Slipover;Kasjmiertrui;Spencer
Noem een schoen met hak.|Pumps;Stiletto;Slingback;Wedge;Kitten heel;Block heel;Plateauschoen;Enkellaars met hak;Mary Jane;Mule met hak
Noem een soort sneaker.|Low-top sneaker;High-top sneaker;Skateschoen;Hardloopsneaker;Basketbalsneaker;Tennissneaker;Retro sneaker;Chunky sneaker;Slip-on sneaker
Noem een soort laars.|Enkellaars;Veterlaars;Chelsea boot;Cowboylaars;Regenlaars;Snowboot;Wandellaars;Overkneelaarzen;Rijlaars;Moonboot
Noem een hoedtype.|Fedora;Panamahoed;Bolhoed;Hoge hoed;Zonnehoed;Strohoed;Bucket hat;Cowboyhoed;Cloche;Baret
Noem een soort tas.|Rugzak;Handtas;Schoudertas;Crossbodytas;Shopper;Clutch;Heuptas;Laptoptas;Duffeltas;Weekendtas;Boodschappentas
Noem een soort horloge.|Analoog horloge;Digitaal horloge;Smartwatch;Chronograaf;Duikhorloge;Zakhorloge;Pilotenhorloge;Dress watch;Sporthorloge
Noem een soort ring.|Trouwring;Verlovingsring;Zegelring;Solitaire ring;Cocktailring;Stacking ring;Vriendschapsring;Statementring;Eternity ring
Noem een type oorbel.|Oorknopje;Oorring;Hangoorbel;Creool;Ear cuff;Oorstekertje;Chandelier oorbel;Doortrekoorbel;Clip-on oorbel
Noem een type ketting.|Choker;Halsketting;Parelsnoer;Medailleketting;Statementketting;Lange ketting;Schakelketting;Tennisnecklace;Hangerketting
Noem een type armband.|Bedelarmband;Bangle;Tennisarmband;Schakelarmband;Leren armband;Kralenarmband;Manchetarmband;Vriendschapsarmband
Noem een soort sjaal.|Wintersjaal;Zijden sjaal;Pashmina;Omslagdoek;Bandana;Colsjaal;Stola;Dunne sjaal;Buis sjaal
Noem een soort handschoen.|Wanten;Vingerhandschoen;Leren handschoen;Skihandschoen;Fietshandschoen;Bokshandschoen;Avondhandschoen;Werkhandschoen
Noem een soort ceintuur.|Leren riem;Gevlochten riem;Elastische riem;Touwceintuur;Kettingriem;Brede tailleceintuur;Stoffen riem
Noem een soort bril.|Zonnebril;Leesbril;Pilotenbril;Cat-eye bril;Ronde bril;Rechthoekige bril;Sportbril;Veiligheidsbril;Zwembril
Noem een stof van plantaardige oorsprong.|Katoen;Linnen;Hennep;Ramie;Jute;Bamboeviscose;Kapok;Piña;Sisal;Raffia
Noem een stof van dierlijke oorsprong.|Wol;Zijde;Kasjmier;Mohair;Alpaca;Angora;Yakwol;Kameelhaar;Leer;Suède
Noem een synthetische textielvezel.|Polyester;Polyamide;Nylon;Acryl;Elastaan;Polypropyleen;Aramide;Polyurethaanvezel;Modacryl
Noem een bekende weefbinding.|Platbinding;Keperbinding;Satijnbinding;Panamabinding;Ripsbinding;Dobbybinding;Jacquardbinding
Noem een soort gebreide stof.|Jersey;Ribtricot;Interlock;Piqué;French terry;Sweatstof;Fleece;Boordstof;Kabelbreisel
Noem een kledingprint.|Streep;Ruit;Polkadot;Bloemenprint;Paisley;Dierenprint;Camouflage;Tie-dye;Geometrische print;Abstracte print
Noem een type sluiting voor kleding.|Ritssluiting;Knoop;Drukknoop;Klittenband;Haak-en-oogsluiting;Gesp;Veter;Touwtje;Magneetsluiting;Toggle
Noem een soort knoop.|Houten knoop;Metalen knoop;Parelmoerknoop;Kokosknoop;Stoffen knoop;Drukknoop;Jeansknoop;Toggleknoop
Noem een borduurtechniek.|Kruissteek;Satijnsteek;Kettingsteek;Stiksteek;Franse knoop;Steelsteek;Rijgsteek;Festonneersteek;Richelieuwerk
Noem een soort naad.|Rechte naad;Franse naad;Overlocknaad;Platte naad;Kappnaad;Engelse naad;Zigzagnaad;Siernaad
Noem een kledingstuk uit de trouwmode.|Trouwjurk;Trouwpak;Sluier;Bolero;Trouwvest;Bruidsmantel;Smoking;Bruidsrok;Petticoat
Noem een kledingstuk uit de wintermode.|Donsjas;Wollen mantel;Coltrui;Thermo-ondergoed;Wanten;Sjaal;Muts;Fleecevest;Sneeuwbroek;Winterlaarzen
Noem een kledingstuk voor regenweer.|Regenjas;Regenbroek;Poncho;Regenlaarzen;Waterdichte parka;Regenhoed;Waterdichte overbroek;Regenpak
Noem een kledingstuk dat typisch is voor formele gelegenheden.|Smoking;Avondjurk;Galajurk;Rokpak;Mantelpak;Jacquet;Driedelig pak;Cocktailjurk;Gilet;Overhemd
Noem een soort badkleding.|Badpak;Bikini;Tankini;Zwembroek;Boardshort;Monokini;Burkini;Rashguard;Zwemshort;Zwemshirt
Noem een traditionele hoofdbedekking.|Tulband;Hijab;Fez;Kippa;Sombrero;Ghutra;Taqiyah;Kalpak;Keffiyeh;Bunad-hoofddoek
Noem een traditioneel kledingstuk uit Azië.|Kimono;Hanbok;Sari;Salwar kameez;Cheongsam;Ao dai;Yukata;Kurta;Dhoti;Barong Tagalog
Noem een traditioneel kledingstuk uit Europa.|Kilt;Lederhose;Dirndl;Klederdrachtmuts;Bunad;Flamencojurk;Bretonse trui;Sarafan;Trachtenjacke
Noem een modehuis uit Frankrijk.|Chanel;Dior;Louis Vuitton;Givenchy;Saint Laurent;Hermès;Balmain;Lanvin;Celine;Chloé
Noem een modehuis uit Italië.|Gucci;Prada;Versace;Armani;Fendi;Valentino;Dolce & Gabbana;Bottega Veneta;Missoni;Etro
Noem een Nederlands modemerk.|G-Star RAW;Scotch & Soda;MEXX;WE Fashion;State of Art;Viktor & Rolf;Hunkemöller;Vanilia;Studio Anneloes;Daily Paper
Noem een stijl uit de twintigste-eeuwse mode.|Flapperstijl;New Look;Mod;Hippiestijl;Punkstijl;Discofashion;Grunge;Power dressing;New Wave;Minimalisme
Noem een element van een kledingpatroon.|Voorpand;Achterpand;Mouw;Kraag;Manchet;Beleg;Zak;Knoopsgat;Tailleband;Zoom
Noem een gereedschap voor naaien.|Naald;Schaar;Tornmesje;Spelden;Meetlint;Naaimachine;Vingerhoed;Paspop;Patroonpapier;Krijt
Noem een manier om stof te verven.|Tie-dye;Batik;Indigo verven;Dip dye;Stofdruk;Zeefdruk;Reactief verven;Natuurlijk verven;Piece dye
Noem een soort kledingzak.|Steekzak;Opgestikte zak;Borstzak;Kangoeroezak;Binnenzak;Klepzak;Paspelzak;Cargo zak
Noem een soort mouw.|Pofmouw;Raglanmouw;Kapmouw;Vlindermouw;Korte mouw;Lange mouw;Driekwartmouw;Ballonmouw;Kimonomouw
Noem een schoenonderdeel.|Zool;Hak;Neus;Tong;Binnenzool;Buitenzool;Veter;Oogje;Hielkap;Schacht
Noem een soort tas die je tijdens het reizen gebruikt.|Koffer;Cabinekoffer;Weekendtas;Duffeltas;Reistas;Rugzak;Toilettas;Garment bag;Laptoptas
Noem een accessoire dat in het haar wordt gedragen.|Haarspeld;Haarband;Diadeem;Haarklem;Scrunchie;Haarlint;Haarelastiek;Haarkam;Fascinator

# Geschiedenis
Noem een Egyptische farao.|Toetanchamon;Ramses II;Cheops;Chefren;Achnaton;Toetmosis III;Hatsjepsoet;Seti I;Amenhotep III;Cleopatra VII
Noem een Romeinse keizer.|Augustus;Tiberius;Caligula;Claudius;Nero;Vespasianus;Titus;Domitianus;Trajanus;Hadrianus;Marcus Aurelius;Constantijn
Noem een Griekse filosoof uit de oudheid.|Socrates;Plato;Aristoteles;Diogenes;Epicurus;Zeno van Citium;Heraclitus;Democritus;Pythagoras;Parmenides
Noem een historische koning van Engeland.|Willem de Veroveraar;Hendrik II;Richard Leeuwenhart;Jan zonder Land;Hendrik VIII;Eduard VI;Karel I;Karel II;George III;George V
Noem een historische koningin van Engeland of Groot-Brittannië.|Elizabeth I;Maria I;Anna;Victoria;Elizabeth II;Maria II;Catharina van Aragon;Anna Boleyn
Noem een vorst uit het Franse koningshuis.|Lodewijk IX;Filips IV;Karel VII;Lodewijk XI;Frans I;Hendrik IV;Lodewijk XIII;Lodewijk XIV;Lodewijk XV;Lodewijk XVI
Noem een Nederlandse stadhouder.|Willem van Oranje;Maurits van Oranje;Frederik Hendrik;Willem II;Willem III;Willem IV;Willem V
Noem een Nederlandse koning of koningin.|Willem I;Willem II;Willem III;Wilhelmina;Juliana;Beatrix;Willem-Alexander
Noem een president van de Verenigde Staten vóór 1950.|George Washington;John Adams;Thomas Jefferson;James Madison;Abraham Lincoln;Ulysses S. Grant;Theodore Roosevelt;Woodrow Wilson;Franklin D. Roosevelt;Harry Truman
Noem een veldslag uit de oudheid.|Marathon;Thermopylae;Salamis;Plataea;Gaugamela;Issos;Cannae;Zama;Actium;Carrhae
Noem een veldslag uit de middeleeuwen.|Hastings;Agincourt;Crécy;Poitiers;Bosworth;Guldensporenslag;Bouvines;Nicopolis;Grunwald
Noem een veldslag uit de napoleontische tijd.|Waterloo;Austerlitz;Jena;Eylau;Wagram;Borodino;Leipzig;Trafalgar;Ligny;Quatre-Bras
Noem een belangrijke gebeurtenis uit de Franse Revolutie.|Bestorming van de Bastille;Eed op de Kaatsbaan;Verklaring van de Rechten van de Mens;Executie van Lodewijk XVI;Terreur;Staatsgreep van 18 Brumaire;Mars op Versailles
Noem een middeleeuwse Europese handelsstad.|Brugge;Gent;Lübeck;Hamburg;Venetië;Genua;Florence;Keulen;Danzig;Antwerpen;Novgorod
Noem een lidstad van de Hanze.|Lübeck;Hamburg;Bremen;Kampen;Deventer;Zwolle;Zutphen;Doesburg;Rostock;Danzig;Bergen;Visby
Noem een leider uit het oude Mongoolse rijk.|Dzjengis Khan;Ögedei Khan;Koeblai Khan;Möngke Khan;Tolui;Batu Khan;Hülegü Khan;Güyük Khan
Noem een historische dynastie uit China.|Qin;Han;Sui;Tang;Song;Yuan;Ming;Qing;Zhou;Jin;Liao;Xia
Noem een historisch rijk in Zuid-Amerika.|Incarijk;Wari;Tiwanaku;Chimú;Moche;Nazca;Chavín;Tawantinsuyu
Noem een precolumbiaanse beschaving in Midden-Amerika.|Maya;Olmeken;Azteken;Tolteken;Zapotheken;Mixteken;Teotihuacan;Totonaken
Noem een oud schrift.|Spijkerschrift;Hiërogliefen;Lineair A;Lineair B;Fenicisch alfabet;Runenschrift;Ogham;Brahmi;Aramees schrift
Noem een historische ontdekkingsreiziger naar Azië.|Marco Polo;Ibn Battuta;Vasco da Gama;Zheng He;Xuanzang;Fa Xian;Niccolò de' Conti;Ferdinand Magellaan
Noem een ontdekkingsreiziger naar de poolgebieden.|Roald Amundsen;Robert Scott;Ernest Shackleton;Fridtjof Nansen;Willem Barentsz;Frederick Cook;Robert Peary;James Clark Ross
Noem een vrouwelijke wetenschapper uit de geschiedenis.|Marie Curie;Ada Lovelace;Lise Meitner;Rosalind Franklin;Emmy Noether;Caroline Herschel;Mary Anning;Sofia Kovalevskaja;Maria Sibylla Merian
Noem een historisch verzetspersoon uit de Tweede Wereldoorlog.|Hannie Schaft;Corrie ten Boom;Wim Schermerhorn;Johannes Post;George Maduro;Willem Arondeus;Truus Menger-Oversteegen;Freddie Oversteegen
Noem een historisch vredesverdrag.|Vrede van Münster;Vrede van Westfalen;Verdrag van Versailles;Vrede van Utrecht;Vrede van Parijs;Vrede van Brest-Litovsk;Verdrag van Tordesillas;Vrede van Augsburg
Noem een oude handelsroute.|Zijderoute;Wierookroute;Barnsteenroute;Trans-Saharaanse handelsroute;Koningsweg;Vikingroute;Specerijenroute;Theeroute
Noem een historische uitvinding uit China.|Papier;Kompas;Buskruit;Boekdrukkunst;Porselein;Zijde;Papiergeld;Kruiwagen;Seismograaf
Noem een uitvinder uit de achttiende of negentiende eeuw.|James Watt;Eli Whitney;Samuel Morse;Alexander Graham Bell;Thomas Edison;Nikola Tesla;Michael Faraday;Joseph Swan;George Stephenson;Alessandro Volta
Noem een beroemde historische revolutie.|Franse Revolutie;Amerikaanse Revolutie;Russische Revolutie;Haïtiaanse Revolutie;Industriële Revolutie;Mexicaanse Revolutie;Cubaanse Revolutie;Glorious Revolution
Noem een eiland waar Napoleon verbleef.|Corsica;Elba;Sint-Helena
Noem een oude Griekse stadstaat.|Athene;Sparta;Korinthe;Thebe;Argos;Megara;Milete;Efeze;Chalcis;Rhodos
Noem een historisch Europees kasteel.|Windsor Castle;Slot Neuschwanstein;Kasteel de Haar;Edinburgh Castle;Castel Sant'Angelo;Bodiam Castle;Alcázar van Segovia;Château de Chambord;Kasteel van Bran
Noem een gotische kathedraal.|Notre-Dame van Parijs;Kathedraal van Chartres;Dom van Keulen;Kathedraal van Reims;Kathedraal van Amiens;Dom van Utrecht;Kathedraal van Salisbury;Kathedraal van Burgos
Noem een historische admiraal.|Michiel de Ruyter;Maarten Tromp;Horatio Nelson;Francis Drake;Yi Sun-sin;Zheng He;Piet Hein;John Paul Jones
Noem een leider van een onafhankelijkheidsbeweging.|Mahatma Gandhi;Simón Bolívar;José de San Martín;Sukarno;Kwame Nkrumah;Jomo Kenyatta;Ho Chi Minh;Nelson Mandela
Noem een historische keizerin.|Wu Zetian;Theodora;Maria Theresia;Catharina de Grote;Cixi;Zita van Bourbon-Parma;Joséphine de Beauharnais;Eugénie de Montijo
Noem een vrouwelijke heerser uit de oudheid.|Cleopatra VII;Hatsjepsoet;Nefertiti;Boudicca;Zenobia;Artemisia I;Olympias;Tomyris
Noem een historische wereldtentoonstelling.|Londen 1851;Parijs 1889;Chicago 1893;Parijs 1900;Brussel 1958;Seattle 1962;Montreal 1967;Osaka 1970
Noem een land dat in 1945 lid werd van de Verenigde Naties.|Verenigde Staten;Verenigd Koninkrijk;Sovjet-Unie;China;Frankrijk;Nederland;België;Canada;Brazilië;Australië;India;Mexico
Noem een historisch schip.|Mayflower;Titanic;HMS Victory;Batavia;Endeavour;Santa María;Niña;Pinta;Beagle;Vasa
Noem een historische pestepidemie.|Zwarte Dood;Pest van Justinianus;Grote Pest van Londen;Pest van Marseille;Pestepidemie van Milaan;Pest van Hongkong
Noem een beroemd historisch document.|Magna Carta;Amerikaanse Onafhankelijkheidsverklaring;Verklaring van de Rechten van de Mens;Grondwet van de Verenigde Staten;Vrede van Münster;Plakkaat van Verlatinghe;Edict van Nantes
Noem een historisch rijk in Afrika.|Oude Egypte;Rijk van Mali;Songhairijk;Ghanarijk;Aksum;Koninkrijk Kongo;Beninrijk;Ethiopische Rijk;Rijk van Kush
Noem een historische leider van het Romeinse rijk.|Julius Caesar;Augustus;Trajanus;Hadrianus;Diocletianus;Constantijn;Marcus Aurelius;Nero;Vespasianus
Noem een historische figuur uit de Nederlandse Gouden Eeuw.|Rembrandt;Johannes Vermeer;Michiel de Ruyter;Piet Hein;Christiaan Huygens;Antoni van Leeuwenhoek;Hugo de Groot;Johan de Witt
Noem een oorlog uit de negentiende eeuw.|Napoleontische oorlogen;Krimoorlog;Amerikaanse Burgeroorlog;Frans-Duitse Oorlog;Boerenoorlog;Opiumoorlogen;Taiping-opstand;Russisch-Turkse Oorlog
Noem een historische handelscompagnie.|VOC;WIC;Britse Oost-Indische Compagnie;Franse Oost-Indische Compagnie;Deense Oost-Indische Compagnie;Zweedse Oost-Indische Compagnie
Noem een middeleeuwse religieuze orde.|Benedictijnen;Franciscanen;Dominicanen;Cisterciënzers;Kartuizers;Augustijnen;Karmelieten;Cluniacenzers
Noem een oude meeteenheid.|El;Voet;Duim;Mijl;Ons;Pond;Vadem;Roede;Morgen;Schepel
Noem een bekende historische archeologische vindplaats.|Pompeï;Troje;Machu Picchu;Çatalhöyük;Stonehenge;Knossos;Ur;Petra;Göbekli Tepe;Lascaux
Noem een land in de Hoorn van Afrika.|Somalië;Ethiopië;Eritrea;Djibouti
# Ruimte
Noem een maan van Jupiter.|Io;Europa;Ganymedes;Callisto;Amalthea;Himalia;Elara;Pasiphae;Sinope;Lysithea;Carme;Ananke
Noem een maan van Saturnus.|Titan;Enceladus;Rhea;Iapetus;Dione;Tethys;Mimas;Hyperion;Phoebe;Janus;Epimetheus;Pan;Atlas
Noem een maan van Uranus.|Titania;Oberon;Umbriel;Ariel;Miranda;Puck;Portia;Juliet;Desdemona;Rosalind;Belinda;Cordelia
Noem een maan van Neptunus.|Triton;Nereïde;Proteus;Larissa;Despina;Galatea;Thalassa;Naiad;Halimede;Sao;Laomedeia
Noem een dwergplaneet van het zonnestelsel.|Ceres;Pluto;Haumea;Makemake;Eris
Noem een kandidaat-dwergplaneet.|Orcus;Quaoar;Sedna;Gonggong;Varuna;Salacia;Ixion;2002 MS4;Vesta;Hygiea
Noem een krater op de maan.|Tycho;Copernicus;Kepler;Aristarchus;Plato;Clavius;Ptolemaeus;Alphonsus;Eratosthenes;Langrenus
Noem een maanlandingsmissie van Apollo.|Apollo 11;Apollo 12;Apollo 14;Apollo 15;Apollo 16;Apollo 17
Noem een onbemande maanverkenner.|Luna 2;Luna 9;Luna 16;Lunokhod 1;Lunokhod 2;Chang'e 3;Chang'e 4;Chang'e 5;Chandrayaan-3;SLIM
Noem een ruimtevaartuig dat Mars bereikte.|Viking 1;Viking 2;Pathfinder;Spirit;Opportunity;Curiosity;Perseverance;InSight;Phoenix;Mars Express;Tianwen-1
Noem een rover die op Mars reed.|Sojourner;Spirit;Opportunity;Curiosity;Perseverance;Zhurong
Noem een sonde die naar Jupiter reisde.|Pioneer 10;Pioneer 11;Voyager 1;Voyager 2;Galileo;Cassini;Juno;New Horizons;JUICE;Europa Clipper
Noem een sonde die Saturnus onderzocht.|Pioneer 11;Voyager 1;Voyager 2;Cassini;Huygens
Noem een ruimtevaartuig dat de zon bestudeert.|SOHO;Parker Solar Probe;Solar Orbiter;SDO;STEREO;Ulysses;Hinode;Aditya-L1
Noem een beroemd ruimteobservatorium.|Hubble;James Webb;Chandra;Spitzer;Kepler;TESS;Gaia;Herschel;Planck;Euclid;Fermi
Noem een ster uit het sterrenbeeld Orion.|Betelgeuze;Rigel;Bellatrix;Saiph;Alnitak;Alnilam;Mintaka;Meissa
Noem een ster uit de Grote Beer.|Dubhe;Merak;Phecda;Megrez;Alioth;Mizar;Alkaid;Talitha
Noem een heldere ster aan de nachtelijke hemel.|Sirius;Canopus;Arcturus;Vega;Capella;Rigel;Procyon;Achernar;Betelgeuze;Altair;Aldebaran;Spica
Noem een planeet die met het blote oog zichtbaar kan zijn.|Mercurius;Venus;Mars;Jupiter;Saturnus;Uranus
Noem een planeet met ringen.|Jupiter;Saturnus;Uranus;Neptunus
Noem een planeet met een vaste oppervlakte.|Mercurius;Venus;Aarde;Mars
Noem een gasreus of ijsreus in het zonnestelsel.|Jupiter;Saturnus;Uranus;Neptunus
Noem een meteorenzwerm.|Perseïden;Geminiden;Leoniden;Quadrantiden;Orioniden;Lyriden;Eta-Aquariden;Delta-Aquariden;Draconiden;Tauriden
Noem een periodieke komeet.|Komeet Halley;Encke;Tempel 1;67P/Churyumov-Gerasimenko;Swift-Tuttle;Giacobini-Zinner;Borrelly;Wild 2
Noem een bekend sterrenstelsel.|Melkweg;Andromedastelsel;Driehoekstelsel;Sombrerostelsel;Draaikolkstelsel;Draaistelsel;Centaurus A;Sigaarstelsel;Magelhaense Wolken
Noem een sterrenstelsel uit de Lokale Groep.|Melkweg;Andromedastelsel;Driehoekstelsel;Grote Magelhaense Wolk;Kleine Magelhaense Wolk;M32;M110;Dwergstelsel in Boötes
Noem een nevel in de ruimte.|Orionnevel;Krabnevel;Adelaarsnevel;Lagunenevel;Ringnevel;Paardenkopnevel;Helixnevel;Halternevel;Carinanevel;Trifidnevel
Noem een soort ster.|Rode dwerg;Witte dwerg;Blauwe reus;Rode reus;Superreus;Neutronenster;Wolf-Rayetster;Protoster;T Tauri-ster;Bruine dwerg
Noem een fase in de levensloop van een ster.|Protoster;Hoofdreeksster;Rode reus;Rode superreus;Planetaire nevel;Witte dwerg;Supernova;Neutronenster;Zwart gat
Noem een object uit de Kuipergordel.|Pluto;Haumea;Makemake;Quaoar;Orcus;Arrokoth;Ixion;Varuna;Salacia;Huya
Noem een bekend object uit de Messiercatalogus.|M1 Krabnevel;M13 Herculescluster;M31 Andromedastelsel;M42 Orionnevel;M45 Plejaden;M51 Draaikolkstelsel;M57 Ringnevel;M81 Bode's Galaxy;M87
Noem een kosmonaut van de Sovjet-Unie.|Joeri Gagarin;Valentina Teresjkova;Aleksej Leonov;German Titov;Valeri Bykovski;Pavel Popovitsj;Vladimir Komarov;Svetlana Savitskaja
Noem een astronaut die op de maan liep.|Neil Armstrong;Buzz Aldrin;Pete Conrad;Alan Bean;Alan Shepard;Edgar Mitchell;David Scott;James Irwin;John Young;Charles Duke;Eugene Cernan;Harrison Schmitt
Noem een vrouwelijke astronaut.|Valentina Teresjkova;Sally Ride;Mae Jemison;Eileen Collins;Peggy Whitson;Christina Koch;Jessica Meir;Samantha Cristoforetti;Sunita Williams;Liu Yang
Noem een ruimteagentschap.|NASA;ESA;JAXA;ISRO;CNSA;Roscosmos;CSA;CNES;DLR;KARI;ASI;UK Space Agency
Noem een lanceerbasis voor raketten.|Kennedy Space Center;Cape Canaveral;Baikonoer;Vandenberg;Kourou;Tanegashima;Jiuquan;Wenchang;Satish Dhawan Space Centre;Rocket Lab Launch Complex 1
Noem een bekende draagraket.|Saturn V;Falcon 9;Falcon Heavy;Ariane 5;Ariane 6;Soyuz;Proton;Atlas V;Delta IV Heavy;Electron;Long March 5;SLS
Noem een ruimtestation.|ISS;Mir;Skylab;Saljoet 1;Saljoet 6;Saljoet 7;Tiangong;Tianhe;Almaz
Noem een Europese astronaut.|André Kuipers;Samantha Cristoforetti;Thomas Pesquet;Matthias Maurer;Alexander Gerst;Tim Peake;Luca Parmitano;Frank De Winne;Christer Fuglesang
Noem een exoplaneet die een naam heeft.|Proxima Centauri b;51 Pegasi b;TRAPPIST-1e;TRAPPIST-1f;Kepler-186f;Kepler-452b;WASP-12b;HD 209458 b;Gliese 581 c
Noem een planeet in het TRAPPIST-1-stelsel.|TRAPPIST-1b;TRAPPIST-1c;TRAPPIST-1d;TRAPPIST-1e;TRAPPIST-1f;TRAPPIST-1g;TRAPPIST-1h
Noem een hemelobject met een staart.|Komeet;Meteoor;Grote komeet;Periodieke komeet;Komeet Halley;Komeet NEOWISE
Noem een soort ruimtepuin.|Defecte satelliet;Rakettrap;Verloren gereedschap;Losgeraakt paneel;Verfvlok;Botsingsfragment;Afgedankte raketadapter
Noem een manier om afstanden in de ruimte te meten.|Astronomische eenheid;Lichtjaar;Parsec;Kiloparsec;Megaparsec;Gigaparsec;Kilometer;Meter
Noem een elektromagnetische straling die telescopen kunnen waarnemen.|Radiogolven;Microgolven;Infrarood;Zichtbaar licht;Ultraviolet;Röntgenstraling;Gammastraling
Noem een astronomische gebeurtenis die met verduistering te maken heeft.|Totale zonsverduistering;Gedeeltelijke zonsverduistering;Ringvormige zonsverduistering;Totale maansverduistering;Gedeeltelijke maansverduistering;Halfschaduwmaansverduistering
Noem een sterrenbeeld aan de dierenriem.|Ram;Stier;Tweelingen;Kreeft;Leeuw;Maagd;Weegschaal;Schorpioen;Boogschutter;Steenbok;Waterman;Vissen
Noem een hemellichaam waarop een sonde is geland.|Maan;Mars;Venus;Titan;Komeet 67P;Eros;Ryugu;Bennu;Itokawa
Noem een planeet of maan met een atmosfeer.|Aarde;Venus;Mars;Jupiter;Saturnus;Uranus;Neptunus;Titan;Triton;Pluto;Io
Noem een plek waar vloeibaar water in ons zonnestelsel voorkomt of wordt vermoed.|Aarde;Europa;Enceladus;Ganymedes;Callisto;Titan;Ceres;Mars

# Wetenschap
Noem een natuurkundige grootheid.|Massa;Lengte;Tijd;Temperatuur;Stroomsterkte;Snelheid;Versnelling;Kracht;Energie;Vermogen;Druk;Spanning
Noem een SI-basiseenheid.|Meter;Kilogram;Seconde;Ampère;Kelvin;Mol;Candela
Noem een afgeleide SI-eenheid.|Newton;Pascal;Joule;Watt;Coulomb;Volt;Ohm;Farad;Tesla;Weber;Henry;Hertz;Lumen;Lux
Noem een chemisch edelgas.|Helium;Neon;Argon;Krypton;Xenon;Radon;Oganesson
Noem een alkalimetaal.|Lithium;Natrium;Kalium;Rubidium;Cesium;Francium
Noem een aardalkalimetaal.|Beryllium;Magnesium;Calcium;Strontium;Barium;Radium
Noem een halogeen.|Fluor;Chloor;Broom;Jodium;Astaat;Tennessine
Noem een bekend overgangsmetaal.|IJzer;Koper;Nikkel;Kobalt;Goud;Zilver;Chroom;Mangaan;Titanium;Vanadium;Platina;Molybdeen
Noem een zuur in de scheikunde.|Zoutzuur;Zwavelzuur;Salpeterzuur;Azijnzuur;Citroenzuur;Koolzuur;Fosforzuur;Melkzuur;Mierenzuur;Ascorbinezuur
Noem een base in de scheikunde.|Natriumhydroxide;Kaliumhydroxide;Calciumhydroxide;Ammoniak;Magnesiumhydroxide;Lithiumhydroxide;Bariumhydroxide
Noem een chemische verbinding met koolstof.|Koolstofdioxide;Methaan;Ethanol;Glucose;Azijnzuur;Aceton;Benzeen;Propaan;Butaan;Ethaan;Koolmonoxide
Noem een fase van materie.|Vast;Vloeibaar;Gas;Plasma;Bose-Einsteincondensaat;Superkritische vloeistof
Noem een manier waarop warmte zich verplaatst.|Geleiding;Convectie;Straling
Noem een soort elektromagnetische straling.|Radiogolven;Microgolven;Infrarood;Zichtbaar licht;Ultraviolet;Röntgenstraling;Gammastraling
Noem een onderdeel van een cel.|Celmembraan;Celkern;Cytoplasma;Mitochondrion;Ribosoom;Golgiapparaat;Endoplasmatisch reticulum;Lysosoom;Vacuole;Chloroplast
Noem een soort lichaamscel.|Zenuwcel;Spiercel;Rode bloedcel;Witte bloedcel;Huidcel;Botcel;Vetcel;Levercel;Eicel;Zaadcel
Noem een menselijk orgaan.|Hart;Long;Lever;Nier;Maag;Dunne darm;Dikke darm;Hersenen;Milt;Alvleesklier;Blaas;Huid
Noem een bot in het menselijk skelet.|Schedel;Onderkaak;Sleutelbeen;Schouderblad;Opperarmbeen;Spaakbeen;Ellepijp;Dijbeen;Scheenbeen;Kuitbeen;Rib;Wervel
Noem een spier in het menselijk lichaam.|Biceps;Triceps;Quadriceps;Hamstrings;Kuitspier;Bilspier;Buikspier;Deltaspier;Borstspier;Trapezius;Brede rugspier
Noem een hormoon.|Insuline;Adrenaline;Cortisol;Melatonine;Testosteron;Oestrogeen;Progesteron;Thyroxine;Groeihormoon;Oxytocine
Noem een vitamine.|Vitamine A;Vitamine B1;Vitamine B2;Vitamine B3;Vitamine B5;Vitamine B6;Vitamine B7;Vitamine B9;Vitamine B12;Vitamine C;Vitamine D;Vitamine E;Vitamine K
Noem een mineraal dat het menselijk lichaam nodig heeft.|Calcium;Magnesium;IJzer;Zink;Jodium;Selenium;Fosfor;Kalium;Natrium;Koper;Mangaan
Noem een tak van de biologie.|Botanie;Zoölogie;Genetica;Ecologie;Microbiologie;Virologie;Mycologie;Anatomie;Fysiologie;Evolutiebiologie
Noem een tak van de natuurkunde.|Mechanica;Thermodynamica;Optica;Akoestiek;Elektromagnetisme;Kwantummechanica;Relativiteitstheorie;Kernfysica;Astrofysica
Noem een tak van de scheikunde.|Organische chemie;Anorganische chemie;Analytische chemie;Fysische chemie;Biochemie;Elektrochemie;Polymeerchemie;Kernchemie
Noem een wetenschappelijke meetmethode.|Thermometrie;Spectroscopie;Chromatografie;Titratie;Microscopie;Massaspectrometrie;Calorimetrie;Elektroforese
Noem een microscooptype.|Lichtmicroscoop;Elektronenmicroscoop;Scanning-elektronenmicroscoop;Transmissie-elektronenmicroscoop;Fluorescentiemicroscoop;Confocale microscoop;Stereomicroscoop
Noem een type telescoop.|Optische telescoop;Radiotelescoop;Infraroodtelescoop;Röntgentelescoop;Zonnetelescoop;Reflectortelescoop;Refractortelescoop;Ruimtetelescoop
Noem een schaal voor temperatuur.|Celsius;Kelvin;Fahrenheit;Rankine;Réaumur;Delisle
Noem een natuurkundige kracht.|Zwaartekracht;Elektromagnetische kracht;Sterke kernkracht;Zwakke kernkracht;Normaalkracht;Wrijvingskracht;Spankracht;Opwaartse kracht
Noem een energiebron.|Zon;Wind;Waterkracht;Aardwarmte;Steenkool;Aardgas;Aardolie;Uranium;Biomassa;Getijdenenergie;Golfenergie
Noem een hernieuwbare energiebron.|Zonne-energie;Windenergie;Waterkracht;Geothermie;Biomassa;Getijdenenergie;Golfenergie
Noem een laboratoriuminstrument.|Reageerbuis;Pipet;Buret;Erlenmeyer;Bekerglas;Centrifuge;Balans;Microscoop;Brander;Spectrometer;Maatkolf
Noem een type elektromotor.|Gelijkstroommotor;Wisselstroommotor;Synchrone motor;Asynchrone motor;Stappenmotor;Servomotor;Borstelloze motor;Universeelmotor
Noem een elektrisch onderdeel.|Weerstand;Condensator;Spoel;Diode;Transistor;LED;Schakelaar;Relais;Transformator;Zekering;Batterij
Noem een logische poort in elektronica.|AND;OR;NOT;NAND;NOR;XOR;XNOR
Noem een soort programmeertaal.|Python;JavaScript;Java;C;C++;C#;Rust;Go;Ruby;PHP;Swift;Kotlin;TypeScript
Noem een gegevensstructuur uit informatica.|Array;Lijst;Stack;Queue;Boom;Graaf;Hashmap;Set;Heap;Trie;Gelinkte lijst
Noem een soort computergeheugen.|RAM;ROM;Cache;Flashgeheugen;SRAM;DRAM;EEPROM;VRAM;Registers
Noem een soort computernetwerk.|LAN;WAN;WLAN;MAN;PAN;VPN;Intranet;Internet;Meshnetwerk
Noem een netwerkprotocol.|HTTP;HTTPS;TCP;UDP;IP;FTP;SSH;DNS;SMTP;IMAP;POP3;WebSocket
Noem een meetinstrument voor het weer.|Thermometer;Barometer;Anemometer;Regenmeter;Hygrometer;Pyranometer;Windvaan;Ceilometer;Radiosonde
Noem een wolkenhoogtecategorie.|Hoge bewolking;Middelhoge bewolking;Lage bewolking;Verticaal ontwikkelde bewolking
Noem een geologisch gesteentetype.|Stollingsgesteente;Sedimentgesteente;Metamorf gesteente;Graniet;Basalt;Zandsteen;Kalksteen;Marmer;Schist;Gneis
Noem een soort plaatgrens.|Divergente plaatgrens;Convergente plaatgrens;Transforme plaatgrens;Subductiezone;Continentale botsing
Noem een type aardbevingsgolf.|P-golf;S-golf;Love-golf;Rayleigh-golf;Oppervlaktegolf;Lichaamsgolf
Noem een soort fossiel.|Afdrukfossiel;Versteningsfossiel;Insluitingsfossiel;Spoorfossiel;Amberfossiel;Koprolith;Voetafdrukfossiel
Noem een manier van gegevens visualiseren.|Staafdiagram;Lijndiagram;Cirkeldiagram;Histogram;Spreidingsdiagram;Boxplot;Heatmap;Kaartdiagram;Boomdiagram
Noem een statistische centrummaat.|Gemiddelde;Mediaan;Modus;Geometrisch gemiddelde;Harmonisch gemiddelde;Gewogen gemiddelde
Noem een wetenschappelijke onderzoeksmethode.|Experiment;Observatie;Enquête;Interview;Literatuuronderzoek;Casestudy;Veldonderzoek;Meta-analyse;Longitudinaal onderzoek
# Eten
Noem een soort Italiaanse pasta.|Spaghetti;Penne;Fusilli;Farfalle;Rigatoni;Tagliatelle;Linguine;Orecchiette;Bucatini;Pappardelle;Conchiglie
Noem een soort pizza.|Margherita;Marinara;Quattro formaggi;Quattro stagioni;Capricciosa;Diavola;Funghi;Prosciutto;Napoli;Calzone
Noem een Italiaans nagerecht.|Tiramisu;Panna cotta;Cannoli;Gelato;Zabaglione;Semifreddo;Affogato;Panettone;Sfogliatella;Granita
Noem een Frans gebak.|Croissant;Éclair;Macaron;Madeleine;Millefeuille;Tarte tatin;Financier;Canelé;Paris-Brest;Clafoutis
Noem een soort brood uit het Midden-Oosten.|Pita;Lavash;Saj;Khobz;Manakish;Barbari;Sangak;Taftan;Markouk;Samoon
Noem een broodsoort uit India.|Naan;Roti;Chapati;Paratha;Puri;Kulcha;Bhatura;Thepla;Roomali roti;Dosa
Noem een rijstgerecht.|Risotto;Paella;Pilav;Biryani;Nasi goreng;Jambalaya;Arroz con pollo;Bibimbap;Onigiri;Jollof rice
Noem een noedelgerecht uit Azië.|Ramen;Udon;Soba;Pho;Pad thai;Chow mein;Laksa;Japchae;Yakisoba;Dan dan noodles
Noem een soort soep.|Tomatensoep;Erwtensoep;Uiensoep;Pompoensoep;Kippensoep;Minestrone;Gazpacho;Miso;Bouillabaisse;Ramen;Pho
Noem een soort bonen.|Bruine boon;Witte boon;Kidneyboon;Zwarte boon;Limaboon;Sojaboon;Mungboon;Adzukiboon;Tuinboon;Kievitsboon
Noem een soort linze.|Rode linze;Groene linze;Bruine linze;Zwarte belugalinze;Puy-linze;Gele linze;Franse groene linze
Noem een soort eetbare paddenstoel.|Champignon;Oesterzwam;Shiitake;Eekhoorntjesbrood;Cantharel;Enoki;Maitake;Morielje;Koningsoesterzwam;Nameko
Noem een eetbare koolsoort.|Witte kool;Rode kool;Savooiekool;Boerenkool;Spitskool;Chinese kool;Paksoi;Bloemkool;Broccoli;Spruitjes
Noem een bladgroente.|Spinazie;Andijvie;Sla;Veldsla;Rucola;Snijbiet;Paksoi;Boerenkool;Waterkers;Postelein
Noem een wortelgroente.|Wortel;Pastinaak;Knolselderij;Rode biet;Rammenas;Rettich;Raap;Meiraap;Schorseneer;Peterseliewortel
Noem een soort ui.|Gele ui;Rode ui;Witte ui;Bosui;Lente-ui;Sjalot;Zilverui;Parelui;Zoete ui
Noem een soort peper die als groente wordt gegeten.|Paprika;Jalapeño;Habanero;Cayennepeper;Poblano;Serrano;Anaheim;Bird's eye chili;Shishito;Padron
Noem een citrusvrucht.|Sinaasappel;Mandarijn;Citroen;Limoen;Grapefruit;Pomelo;Kumquat;Bergamot;Yuzu;Clementine;Buddha's hand
Noem een steenvrucht.|Perzik;Nectarine;Abrikoos;Pruim;Kers;Mango;Lychee;Olijf;Dadel;Kokosnoot
Noem een tropische vrucht.|Mango;Papaja;Ananas;Guave;Passievrucht;Lychee;Ramboetan;Durian;Mangosteen;Jackfruit;Carambola
Noem een soort bes die eetbaar is.|Aardbei;Blauwe bes;Framboos;Braam;Rode bes;Zwarte bes;Kruisbes;Veenbes;Goji-bes;Moerbei
Noem een soort noot.|Amandel;Walnoot;Hazelnoot;Cashewnoot;Pistache;Pecannoot;Macadamianoot;Paranoot;Kastanje;Pijnboompit
Noem een soort graan.|Tarwe;Rogge;Gerst;Haver;Rijst;Maïs;Sorghum;Gierst;Spelt;Emmer;Eenkoren
Noem een kruid dat vers in gerechten wordt gebruikt.|Basilicum;Peterselie;Koriander;Bieslook;Dille;Munt;Tijm;Rozemarijn;Oregano;Salie;Dragon
Noem een specerij afkomstig van schors, wortel of zaad.|Kaneel;Kurkuma;Gember;Komijn;Korianderzaad;Kardemom;Nootmuskaat;Mosterdzaad;Fenegriek;Steranijs
Noem een kaas uit Frankrijk.|Brie;Camembert;Roquefort;Comté;Emmental de Savoie;Reblochon;Munster;Cantal;Bleu d'Auvergne;Chèvre
Noem een kaas uit Italië.|Parmezaan;Mozzarella;Gorgonzola;Pecorino;Ricotta;Mascarpone;Burrata;Provolone;Taleggio;Asiago
Noem een kaas uit Nederland.|Goudse kaas;Edammer;Leidse kaas;Maasdammer;Boerenkaas;Beemster;Old Amsterdam;Friese nagelkaas;Texelse schapenkaas
Noem een soort vis die vaak wordt gegeten.|Zalm;Kabeljauw;Tonijn;Haring;Makreel;Sardine;Forel;Heilbot;Schol;Tong;Tilapia
Noem een soort schaal- of schelpdier dat gegeten wordt.|Garnaal;Kreeft;Krab;Mossel;Oester;Sint-jakobsschelp;Kokkel;Vongole;Langoustine;Rivierkreeft
Noem een eetbaar zeewier.|Nori;Wakame;Kombu;Dulse;Zeelat;Zeesla;Hijiki;Arame;Mozuku;Aonori
Noem een soort sushi.|Nigiri;Maki;Uramaki;Temaki;Futomaki;Hosomaki;Gunkan;Inari-zushi;Chirashi;Oshi-zushi
Noem een gerecht uit Japan.|Sushi;Ramen;Udon;Tempura;Okonomiyaki;Takoyaki;Yakitori;Katsu curry;Onigiri;Sukiyaki
Noem een gerecht uit Mexico.|Taco;Burrito;Enchilada;Quesadilla;Tamale;Pozole;Mole;Tostada;Chilaquiles;Fajita
Noem een gerecht uit Thailand.|Pad thai;Tom yum;Tom kha gai;Groene curry;Rode curry;Massaman curry;Som tam;Pad kra pao;Khao soi;Mango sticky rice
Noem een gerecht uit India.|Biryani;Tandoori chicken;Butter chicken;Dal;Palak paneer;Samosa;Chana masala;Dosa;Korma;Vindaloo
Noem een traditioneel gerecht uit Nederland.|Stamppot;Erwtensoep;Hutspot;Haring;Poffertjes;Pannenkoeken;Hachee;Bitterballen;Kroket;Zuurkoolstamppot
Noem een soort pannenkoek uit de wereld.|Crêpe;Pancake;Blini;Poffertje;Dosa;Injera;Okonomiyaki;Latke;Hotteok;Scotch pancake
Noem een soort dessert met ijs.|IJscoupe;Banana split;Affogato;Sorbet;Sundae;Milkshake;Softijs;IJsparfait;Granita;Gelato
Noem een soort chocoladeproduct.|Pure chocolade;Melkchocolade;Witte chocolade;Bonbon;Truffel;Praline;Chocoladereep;Chocolademousse;Cacaopoeder;Chocoladepasta
Noem een manier om voedsel te conserveren.|Drogen;Invriezen;Inmaken;Wecken;Pekelen;Fermenteren;Roken;Pasteuriseren;Steriliseren;Vacuümverpakken
Noem een kooktechniek.|Koken;Bakken;Braden;Grillen;Stomen;Pocheren;Stoven;Frituren;Roerbakken;Blancheren;Sous-vide
Noem een manier om aardappelen te bereiden.|Koken;Bakken;Frituren;Pureren;Roosteren;Stomen;Gratineren;Poffen;Stoven;Stampen
Noem een soort thee.|Groene thee;Zwarte thee;Witte thee;Oolong;Pu-erh;Rooibos;Kruidenthee;Jasmijnthee;Matcha;Earl Grey
Noem een soort koffie.|Espresso;Cappuccino;Latte macchiato;Caffè latte;Americano;Flat white;Ristretto;Lungo;Mocha;Filterkoffie
Noem een frisdranksoort.|Cola;Sinas;Citroenlimonade;Ginger ale;Tonic;IJsthee;Energiedrank;Bitter lemon;Sportdrank;Rivella
Noem een soort ontbijtgranenproduct.|Havermout;Cornflakes;Muesli;Granola;Weetabix;Brinta;Puffed rice;Rijstvlokken;Speltvlokken;Tarwevlokken
Noem een saus bij hartige gerechten.|Tomatensaus;Bechamelsaus;Hollandaisesaus;Mayonaise;Ketchup;Mosterdsaus;Pesto;Salsa;Tzatziki;Chimichurri
Noem een soort peulvrucht.|Erwt;Linze;Kikkererwt;Sojaboon;Bruine boon;Kidneyboon;Tuinboon;Lupine;Mungboon;Pinda
Noem een soort taart.|Appeltaart;Slagroomtaart;Cheesecake;Worteltaart;Chocoladetaart;Citroentaart;Tarte tatin;Vlaai;Kersentaart;Aardbeientaart

# Natuur
Noem een loofboom uit Europa.|Eik;Beuk;Es;Iep;Esdoorn;Berk;Linde;Populier;Wilg;Haagbeuk;Els
Noem een naaldboom.|Den;Spar;Lariks;Ceder;Taxus;Jeneverbes;Cipres;Sequoia;Dennenboom;Zilverspar
Noem een boom met eetbare vruchten.|Appelboom;Perenboom;Kersenboom;Pruimenboom;Perzikboom;Vijgenboom;Olijfboom;Citroenboom;Sinaasappelboom;Mangoboom
Noem een plant die in moerassen groeit.|Riet;Lisdodde;Gele lis;Watermunt;Moerasvergeet-mij-nietje;Zegge;Kalmoes;Waterdrieblad;Moerasandoorn
Noem een vleesetende plant.|Venusvliegenvanger;Zonnedauw;Bekerplant;Blazenkruid;Vetblad;Heliamphora;Sarracenia;Cephalotus;Drosera
Noem een soort mos.|Veenmos;Haarmos;Slaapmos;Sterrenmos;Kussentjesmos;Klauwtjesmos;Gaffeltandmos;Levermos;Bladmos
Noem een soort varen.|Adelaarsvaren;Mannetjesvaren;Wijfjesvaren;Tongvaren;Koningsvaren;Stekelvaren;Eikvaren;Dubbelloof;Struisvaren
Noem een soort orchidee.|Phalaenopsis;Cattleya;Dendrobium;Vanda;Cymbidium;Paphiopedilum;Vanilla;Orchis;Bijenorchis
Noem een veldbloem uit Nederland.|Klaproos;Korenbloem;Madeliefje;Paardenbloem;Boterbloem;Pinksterbloem;Duizendblad;Margriet;Akkerdistel;Kamille
Noem een bloem die uit een bol groeit.|Tulp;Narcis;Hyacint;Krokus;Sneeuwklokje;Druifhyacint;Amaryllis;Lelie;Allium;Boshyacint
Noem een plant die in de woestijn groeit.|Saguaro;Vijgcactus;Aloë vera;Agave;Joshua tree;Welwitschia;Dadelpalm;Tamarisk;Creosootstruik;Woestijnroos
Noem een boom die in het tropisch regenwoud groeit.|Kapokboom;Mahonie;Ebbenhout;Rubberboom;Teak;Balsa;Braziliaanse notenboom;Banyan;Cecropia
Noem een soort gras.|Engels raaigras;Rietzwenkgras;Veldbeemdgras;Timoteegras;Kropaar;Rood zwenkgras;Buntgras;Pijpenstrootje;Zwenkgras
Noem een invasieve plant in Nederland.|Japanse duizendknoop;Reuzenberenklauw;Reuzenbalsemien;Watercrassula;Grote waternavel;Amerikaanse vogelkers;Hemelboom
Noem een eetbare wilde plant.|Brandnetel;Daslook;Zevenblad;Paardenbloem;Waterkers;Veldzuring;Look-zonder-look;Melde;Postelein
Noem een soort paddenstoel die niet gegeten moet worden.|Groene knolamaniet;Vliegenzwam;Panteramaniet;Voorjaarsknolamaniet;Kleverige knolamaniet;Gordijnzwam;Satansboleet
Noem een korstmos.|Bekermos;Rendiermos;Baardmos;Dooiermos;Landschapsmos;Schriftmos;Schildmos;Eikenmos
Noem een soort bodem.|Zandgrond;Kleigrond;Veengrond;Leemgrond;Lössgrond;Kalkgrond;Zavelgrond;Humusgrond
Noem een gesteente dat uit gesmolten materiaal is ontstaan.|Graniet;Basalt;Obsidiaan;Puimsteen;Gabbro;Andesiet;Ryoliet;Dioriet;Peridotiet
Noem een sedimentgesteente.|Zandsteen;Kalksteen;Schalie;Conglomeraat;Breccie;Steenzout;Krijt;Dolomiet
Noem een metamorfe gesteentesoort.|Marmer;Leisteen;Gneis;Kwartsiet;Schist;Amfiboliet;Fylliet;Eklogiet
Noem een mineraal.|Kwarts;Veldspaat;Mica;Calciet;Gips;Haliet;Pyriet;Magnetiet;Hematiet;Fluoriet;Olivijn
Noem een edelsteen die blauw kan zijn.|Saffier;Aquamarijn;Turkoois;Lapis lazuli;Tanzaniet;Topaas;Ioliet;Spinel;Toermalijn
Noem een plant met doornen of stekels.|Cactus;Roos;Distel;Hulst;Braam;Agave;Vuurdoorn;Meidoorn;Sleedoorn;Acacia
Noem een natuurlijk kristal.|Kwarts;Amethist;Bergkristal;Calciet;Gipskristal;Haliet;Pyriet;Fluoriet;Topaas;Diamant
Noem een fossiel van een uitgestorven zeedier.|Ammoniet;Trilobiet;Belemniet;Megalodontand;Nummuliet;Baculites;Orthoceras;Crinoïde;Graptoliet
Noem een natuurgebied in Nederland.|De Hoge Veluwe;Oostvaardersplassen;Biesbosch;Waddenzee;Veluwezoom;De Groote Peel;Loonse en Drunense Duinen;Weerribben-Wieden;Drents-Friese Wold
Noem een nationaal park in Afrika.|Serengeti;Krugerpark;Etosha;Masai Mara;Amboseli;Chobe;Virunga;Ngorongoro;Hwange;Kafue
Noem een nationaal park in de Verenigde Staten.|Yellowstone;Yosemite;Grand Canyon;Zion;Bryce Canyon;Everglades;Glacier;Denali;Olympic;Joshua Tree
Noem een type bos.|Loofbos;Naaldbos;Gemengd bos;Tropisch regenwoud;Mangrovebos;Nevelwoud;Boreaal bos;Gematigd regenwoud;Vloedbos
Noem een type grasland.|Savanne;Steppe;Prairie;Pampa;Alpenweide;Hooggrasland;Laaggrasland;Veld;Heide;Toendra
Noem een soort wetlands.|Moeras;Veenmoeras;Mangrove;Rietland;Kwelder;Vloedbos;Getijdenmoeras;Veenland;Lagune
Noem een ecosysteem met zout water.|Oceaan;Zee;Koraalrif;Mangrove;Estuarium;Zoutmoeras;Getijdenpoel;Lagune;Kustzee
Noem een soort zoetwaterecosysteem.|Rivier;Beek;Meer;Vijver;Moeras;Veenplas;Bron;Rietland;Overstromingsvlakte
Noem een natuurverschijnsel waarbij ijs een rol speelt.|Gletsjer;IJsberg;IJzel;Hagel;Sneeuw;Rijp;Vorst;IJsschots;Gletsjerkalving;Sneeuwstorm
Noem een verschijnsel dat bij onweer voorkomt.|Bliksem;Donder;Regen;Hagel;Windstoot;Rolwolk;Shelf cloud;Supercel;Windhoos
Noem een windsoort.|Passaat;Moesson;Mistral;Föhn;Bora;Sirocco;Chinook;Pampero;Harmattan;Zeewind
Noem een wolkentype uit de hoge wolkenlaag.|Cirrus;Cirrostratus;Cirrocumulus;Cirrus fibratus;Cirrus uncinus
Noem een soort getijdengebied.|Wad;Kwelder;Mangrove;Estuarium;Slik;Schor;Zoutmoeras;Getijdenrivier;Getijdenvlakte
Noem een soort neerslag.|Regen;Motregen;Sneeuw;Hagel;IJzel;Korrelhagel;Sneeuwkorrels;IJsregen;Natte sneeuw
Noem een soort kustlandschap.|Duinen;Strand;Klifkust;Mangrovekust;Waddenkust;Delta;Estuarium;Fjord;Lagune;Koraalkust
Noem een type vulkaan.|Schildvulkaan;Stratovulkaan;Sintelkegel;Lavakoepel;Caldera;Spleetvulkaan;Onderzeese vulkaan
Noem een natuurlijk zoetwaterlichaam.|Meer;Rivier;Beek;Bron;Moeras;Vijver;Gletsjermeer;Oxbowmeer;Veenplas;Waterval
Noem een verschijnsel dat door erosie ontstaat.|Ravijn;Canyon;Kloof;Zeecliff;Zandduin;Rivierdal;Meander;Boogrots;Zeegrot
Noem een beschermd dier in Nederland.|Otter;Bever;Das;Hazelmuis;Boommarter;Vleermuis;Eekhoorn;Kerkuil;Ringslang;Zandhagedis
Noem een stuifmeelverspreider uit de natuur.|Bij;Hommel;Vlinder;Nachtvlinder;Vlieg;Kever;Kolibrie;Vleermuis;Wesp
Noem een soort symbiose.|Mutualisme;Commensalisme;Parasitisme;Mycorrhiza;Korstmos;Endosymbiose;Reinigingssymbiose
Noem een natuurlijk verschijnsel met gekleurd licht.|Regenboog;Noorderlicht;Zuiderlicht;Halo;Bijzon;Groene flits;Lichtzuil;Irisatie
Noem een type bloemstand.|Tros;Aar;Scherm;Hoofdje;Pluim;Katje;Kolf;Tuil;Bloemkrans
Noem een soort hout uit de natuur.|Eikenhout;Beukenhout;Teakhout;Mahonie;Grenenhout;Vurenhout;Berkenhout;Esdoornhout;Bamboe;Cederhout
# Cultuur
Noem een schilder uit de Nederlandse Gouden Eeuw.|Rembrandt;Vermeer;Frans Hals;Jan Steen;Pieter de Hooch;Gerard ter Borch;Jacob van Ruisdael;Judith Leyster;Aelbert Cuyp
Noem een schilder uit het impressionisme.|Claude Monet;Pierre-Auguste Renoir;Edgar Degas;Camille Pissarro;Berthe Morisot;Mary Cassatt;Alfred Sisley;Gustave Caillebotte
Noem een soort keramiek.|Porselein;Aardewerk;Steengoed;Faience;Majolica;Raku;Celadon;Terracotta;Bone china;Delfts blauw
Noem een vorm van kalligrafie.|Arabische kalligrafie;Chinese kalligrafie;Japanse shodō;Westerse kalligrafie;Gotische kalligrafie;Unciaalschrift;Kufisch schrift;Diwani;Nastaʿlīq
Noem een type mozaïek.|Glasmozaïek;Steenmozaïek;Keramisch mozaïek;Romeins mozaïek;Byzantijns mozaïek;Florentijns mozaïek;Pebble mosaic;Trencadís
Noem een beroemde beeldhouwer.|Michelangelo;Auguste Rodin;Donatello;Bernini;Henry Moore;Barbara Hepworth;Constantin Brancusi;Louise Bourgeois;Camille Claudel
Noem een wereldberoemd schilderij.|Mona Lisa;De Nachtwacht;Het meisje met de parel;De sterrennacht;De schreeuw;Guernica;Het laatste avondmaal;De geboorte van Venus;De kus
Noem een wereldberoemd beeldhouwwerk.|David;De denker;Venus van Milo;Nike van Samothrake;Discobolus;Pietà;De kus van Rodin;Het Vrijheidsbeeld
Noem een kunstmuseum in Europa.|Rijksmuseum;Louvre;Prado;Uffizi;Tate Modern;Musée d'Orsay;National Gallery;Stedelijk Museum;Vaticaanse Musea
Noem een kunstmuseum buiten Europa.|MoMA;Metropolitan Museum of Art;Guggenheim Museum New York;National Gallery of Art;Art Institute of Chicago;Mori Art Museum;National Gallery Singapore;Tokyo National Museum
Noem een kunststroming.|Renaissance;Barok;Rococo;Impressionisme;Expressionisme;Kubisme;Surrealisme;Dadaïsme;Futurisme;Popart;Minimalisme
Noem een grafische kunsttechniek.|Houtsnede;Ets;Lithografie;Zeefdruk;Linoleumsnede;Droge naald;Monotype;Mezzotint;Aquatint
Noem een dansstijl uit Latijns-Amerika.|Salsa;Tango;Samba;Rumba;Cha-cha-cha;Bachata;Merengue;Cumbia;Mambo;Zouk
Noem een klassieke dansstijl.|Ballet;Hofdans;Menuet;Wals;Polonaise;Mazurka;Gavotte;Sarabande;Pavane
Noem een moderne dansstijl.|Hiphop;Breakdance;House dance;Krumping;Popping;Locking;Contemporary dance;Jazzdance;Voguing;Waacking
Noem een instrument dat bij flamenco wordt gebruikt.|Flamencogitaar;Cajón;Castagnetten;Palmas;Bandurria;Laúd;Viool;Palillos
Noem een toneelgenre.|Tragedie;Komedie;Tragikomedie;Farce;Melodrama;Absurd toneel;Straattheater;Poppentheater;Improvisatietheater
Noem een bekende toneelschrijver.|William Shakespeare;Molière;Henrik Ibsen;Anton Tsjechov;Samuel Beckett;Tennessee Williams;Bertolt Brecht;Euripides;Sophocles
Noem een tragedie van Shakespeare.|Hamlet;Macbeth;Othello;King Lear;Romeo and Juliet;Julius Caesar;Antony and Cleopatra;Coriolanus
Noem een komedie van Shakespeare.|A Midsummer Night's Dream;Much Ado About Nothing;Twelfth Night;As You Like It;The Comedy of Errors;The Taming of the Shrew;The Merchant of Venice
Noem een boek van Charles Dickens.|Oliver Twist;David Copperfield;Great Expectations;A Tale of Two Cities;A Christmas Carol;Bleak House;Little Dorrit;Hard Times
Noem een roman van Jane Austen.|Pride and Prejudice;Sense and Sensibility;Emma;Mansfield Park;Northanger Abbey;Persuasion;Lady Susan
Noem een roman van Jules Verne.|Reis om de wereld in tachtig dagen;Twintigduizend mijlen onder zee;Reis naar het middelpunt der aarde;De geheimzinnige eiland;Van de aarde naar de maan;Vijf weken in een luchtballon;Kapitein Grant
Noem een werk van J.R.R. Tolkien.|De Hobbit;In de ban van de ring;De Silmarillion;De kinderen van Húrin;Beren en Lúthien;De val van Gondolin;Onvoltooide vertellingen
Noem een roman uit de Nederlandse literatuur.|Max Havelaar;De ontdekking van de hemel;Het diner;De avonden;Turks fruit;De donkere kamer van Damokles;Het bittere kruid;Joe Speedboot
Noem een Nederlandse schrijver.|Multatuli;Harry Mulisch;W.F. Hermans;Gerard Reve;Hella Haasse;Anna Enquist;Tommy Wieringa;Arnon Grunberg;Connie Palmen
Noem een Nederlandse dichter.|Joost van den Vondel;P.C. Hooft;Gerrit Achterberg;Herman Gorter;J.C. Bloem;M. Vasalis;Lucebert;Remco Campert;Rutger Kopland
Noem een mythologisch personage uit Griekenland.|Zeus;Hera;Athena;Apollo;Artemis;Poseidon;Hades;Hermes;Aphrodite;Ares;Demeter;Dionysos
Noem een figuur uit de Noordse mythologie.|Odin;Thor;Loki;Freya;Frey;Frigg;Baldr;Tyr;Heimdall;Hel;Jörmungandr;Fenrir
Noem een god uit het oude Egypte.|Ra;Osiris;Isis;Horus;Anubis;Thoth;Hathor;Sekhmet;Bastet;Seth;Ptah
Noem een figuur uit de Romeinse mythologie.|Jupiter;Juno;Minerva;Mars;Venus;Mercurius;Neptunus;Pluto;Diana;Apollo;Vesta
Noem een wereldwijd bekende sprookjesschrijver.|Hans Christian Andersen;Gebroeders Grimm;Charles Perrault;Wilhelm Hauff;Oscar Wilde;Madame d'Aulnoy;Joseph Jacobs;Giambattista Basile
Noem een bekend sprookje.|Roodkapje;Assepoester;Sneeuwwitje;Doornroosje;Hans en Grietje;De kleine zeemeermin;De nieuwe kleren van de keizer;Rapunzel;De gelaarsde kat
Noem een traditionele muziekvorm uit de wereld.|Gamelan;Fado;Flamenco;Qawwali;Raga;Griotmuziek;Klezmer;Gnawa;Morna;Tuvan keelzang
Noem een filmgenre.|Actie;Avontuur;Drama;Komedie;Horror;Sciencefiction;Fantasy;Thriller;Western;Romantiek;Documentaire;Animatie
Noem een bekende filmregisseur.|Steven Spielberg;Alfred Hitchcock;Martin Scorsese;Christopher Nolan;Stanley Kubrick;Akira Kurosawa;Greta Gerwig;Quentin Tarantino;Jane Campion
Noem een beroemde animatiestudio.|Pixar;Walt Disney Animation Studios;Studio Ghibli;DreamWorks Animation;Aardman;Laika;Cartoon Saloon;Illumination;Sony Pictures Animation
Noem een bekende animatiefilm.|Toy Story;Shrek;Frozen;Spirited Away;Finding Nemo;The Lion King;WALL-E;Inside Out;The Incredibles;Coco
Noem een filmprijs.|Oscar;Gouden Palm;Golden Globe;BAFTA;Gouden Beer;Gouden Leeuw;César;European Film Award;Gouden Kalf
Noem een groot internationaal filmfestival.|Cannes;Berlinale;Venetië;Toronto;Sundance;Rotterdam;Locarno;San Sebastián;Karlovy Vary
Noem een literaire prijs.|Nobelprijs voor Literatuur;Booker Prize;Pulitzerprijs;Prix Goncourt;AKO Literatuurprijs;Libris Literatuur Prijs;P.C. Hooft-prijs;International Booker Prize
Noem een boekvorm of literair genre.|Roman;Novelle;Kort verhaal;Poëzie;Essay;Biografie;Autobiografie;Toneeltekst;Graphic novel;Reisverhaal
Noem een traditionele dans uit Europa.|Wals;Polka;Flamenco;Jig;Reel;Mazurka;Sirtaki;Fandango;Tarantella;Csárdás
Noem een architectuurstijl.|Romaans;Gotiek;Renaissance;Barok;Neoclassicisme;Art nouveau;Art deco;Bauhaus;Brutalisme;Modernisme
Noem een beroemde architect.|Antoni Gaudí;Frank Lloyd Wright;Le Corbusier;Zaha Hadid;Rem Koolhaas;Mies van der Rohe;Frank Gehry;Norman Foster;Oscar Niemeyer
Noem een type theaterpodium.|Lijsttoneel;Amfitheater;Arena;Black box;Openluchtpodium;Traversepodium;Rondtoneel;Thrust stage
Noem een bekende bibliotheek.|Bibliotheek van Alexandrië;British Library;Library of Congress;New York Public Library;Koninklijke Bibliotheek;Bibliothèque nationale de France;Vaticaanse Bibliotheek;Trinity College Library
Noem een soort volkskunst.|Houtsnijwerk;Pottenbakken;Weven;Borduren;Kantklossen;Batikkunst;Mozaïek;Volksmuziek;Kalligrafie
Noem een jaarlijks cultureel feest.|Carnaval;Holi;Diwali;Lunar New Year;Oktoberfest;Mardi Gras;Día de Muertos;Hanami;Songkran;Midherfstfestival
Noem een soort dansvoorstelling.|Ballet;Modern dance;Contemporary dance;Flamencovoorstelling;Folkloredans;Tapdans;Streetdance;Dansopera;Dansconcert

# Vervoer
Noem een soort personenauto.|Sedan;Hatchback;Stationwagen;SUV;Coupé;Cabriolet;MPV;Crossover;Roadster;Limousine
Noem een automerk.|Toyota;Honda;Nissan;Mazda;Subaru;Mitsubishi;Suzuki;Lexus;Volkswagen;Audi;BMW;Mercedes-Benz;Porsche;Opel;Ferrari;Lamborghini;Fiat;Alfa Romeo;Renault;Peugeot;Citroën;Bugatti;Jaguar;Land Rover;Mini;Rolls-Royce;Bentley;Aston Martin;Hyundai;Kia;Genesis;Ford;Chevrolet;Tesla;Jeep;Dodge;Cadillac
Noem een beroemd automodel uit de twintigste eeuw.|Volkswagen Kever;Ford Model T;Citroën 2CV;Fiat 500;Mini Cooper;Porsche 911;Toyota Corolla;Peugeot 205;Renault 4;Chevrolet Corvette;Jaguar E-Type;DeLorean DMC-12
Noem een historische treinverbinding.|Orient Express;Trans-Siberische spoorlijn;Flying Scotsman;Rheingold;Blue Train;Venice Simplon-Orient-Express;California Zephyr;Indian Pacific;Transcontinental Railroad
Noem een type verkeersknooppunt.|Klaverbladknooppunt;Turbineknooppunt;Trompetknooppunt;Sterknooppunt;Diamantknooppunt;Halfklaverblad;Vlinderknooppunt;Stack interchange
Noem een navigatiehulpmiddel.|GPS;Kompas;Sextant;Zeekaart;Radar;AIS;Peilkompas;Luchtvaartkaart;VOR;ILS;GLONASS
Noem een type voertuigrem.|Schijfrem;Trommelrem;Regeneratieve rem;Handrem;Elektromagnetische rem;Luchtrem;Motorrem;Terugtraprem;Velgrem;Hydraulische rem
Noem een soort fiets.|Stadsfiets;Racefiets;Mountainbike;Gravelbike;BMX;Bakfiets;Vouwfiets;Ligfiets;Tandem;Transportfiets;Fatbike
Noem een fietsonderdeel.|Stuur;Zadel;Pedaal;Ketting;Cassette;Crank;Voorvork;Wiel;Spaak;Band;Derailleur;Rem
Noem een motortype.|Cruiser;Naked bike;Sportmotor;Tourmotor;Adventure bike;Crossmotor;Enduromotor;Scooter;Chopper;Café racer
Noem een soort vrachtwagen.|Trekker-oplegger;Bakwagen;Kiepwagen;Tankwagen;Vuilniswagen;Autotransporter;Koelwagen;Containerwagen;Betonmixer;Brandweerwagen
Noem een soort bus.|Stadsbus;Touringcar;Schoolbus;Minibus;Dubbeldekker;Gelede bus;Trolleybus;Elektrische bus;Intercitybus
Noem een soort trein.|Intercity;Sprinter;Hogesnelheidstrein;Nachttrein;Stoomtrein;Goederentrein;Metro;Monorail;Tandradtrein;Maglev
Noem een hogesnelheidstrein.|TGV;ICE;Eurostar;Shinkansen;AVE;Frecciarossa;Thalys;KTX;CRH;Al Boraq
Noem een metronetwerk in een wereldstad.|London Underground;New York Subway;Metro van Parijs;Metro van Tokio;Metro van Moskou;Metro van Madrid;Metro van Berlijn;Metro van Hongkong
Noem een spoorwegmaatschappij.|NS;NMBS;Deutsche Bahn;SNCF;ÖBB;SBB;Trenitalia;Renfe;Amtrak;JR East;Eurostar
Noem een type spoorbrug.|Vakwerkbrug;Boogbrug;Liggerbrug;Hangbrug;Tuibrug;Hefbrug;Draaibrug;Basculebrug;Viaduct
Noem een tunnel die voor verkeer wordt gebruikt.|Kanaaltunnel;Gotthard-basistunnel;Mont Blanctunnel;Westerscheldetunnel;Coentunnel;Maastunnel;Lærdalstunnel;Seikantunnel
Noem een type vrachtschip.|Containerschip;Bulkcarrier;Olietanker;Gastanker;Koelschip;Autocarrier;Chemicaliëntanker;General cargo schip;Ro-ro-schip
Noem een soort zeilboot.|Optimist;Laser;Catamaran;Sloep;Kielboot;Jol;Schouw;Schoener;Ketch;Yawl;Trimaran
Noem een traditioneel vaartuig.|Gondel;Dhow;Jonk;Vikinglangschip;Prauw;Kano;Coracle;Rietboot;Felucca;Tjalk
Noem een soort veerboot.|Autoveerboot;Passagiersveerboot;Sneldienst;Katamaranveerboot;Ro-ro-veerboot;Kabelpont;Voetveer;Waterbus
Noem een type onderzeeër.|Nucleaire onderzeeër;Dieselelektrische onderzeeër;Aanvalsonderzeeër;Ballistische-raketonderzeeër;Onderzoeksonderzeeër;Mini-onderzeeër
Noem een passagiersvliegtuigmodel.|Airbus A320;Airbus A330;Airbus A350;Airbus A380;Boeing 737;Boeing 747;Boeing 777;Boeing 787;Embraer E190;ATR 72
Noem een vliegtuigbouwer.|Airbus;Boeing;Embraer;Bombardier;ATR;Cessna;Dassault;Gulfstream;Lockheed Martin;Pilatus;Antonov
Noem een soort helikopter.|Transporthelikopter;Reddingshelikopter;Politiehelikopter;Aanvalshelikopter;Luchttaxihelikopter;Marinehelikopter;Medische helikopter;Brandweerhelikopter
Noem een luchtvaartmaatschappij uit Europa.|KLM;Lufthansa;Air France;British Airways;Iberia;Ryanair;easyJet;Swiss;Austrian Airlines;Finnair;SAS;ITA Airways
Noem een internationale luchthaven.|Schiphol;Heathrow;Charles de Gaulle;Frankfurt Airport;Dubai International;Changi;Hamad International;JFK;LAX;Narita;Haneda
Noem een wereldberoemde haven.|Rotterdam;Antwerpen;Shanghai;Singapore;Hamburg;Los Angeles;Long Beach;Busan;Shenzhen;Ningbo-Zhoushan
Noem een bekend scheepvaartkanaal.|Suezkanaal;Panamakanaal;Noordzeekanaal;Kielerkanaal;Corinthkanaal;Eriekanaal;Wellandkanaal;Grand Canal van China
Noem een vaartuig dat geen motor nodig heeft.|Roeiboot;Kano;Kajak;Zeilboot;Vlot;Gondel;Peddelboot;Optimist;SUP-board;Korfboot
Noem een vervoermiddel met een elektrische aandrijving.|Elektrische auto;Elektrische fiets;Tram;Metro;Trolleybus;Elektrische scooter;Elektrische bus;Elektrische trein;Elektrische step;Monorail
Noem een vervoermiddel dat door spierkracht wordt aangedreven.|Fiets;Step;Roeiboot;Kano;Kajak;Skateboard;Skates;Rolstoel;SUP-board;Velomobiel
Noem een vervoerwijze over kabels.|Kabelbaan;Gondellift;Stoeltjeslift;Kabeltrein;Funiculaire;Zipline;Skilift;Pendelbaan
Noem een soort brug die kan openen.|Ophaalbrug;Basculebrug;Draaibrug;Hefbrug;Vlotbrug;Rolbrug;Klapbrug;Tafelbrug
Noem een verkeersbordcategorie.|Waarschuwingsbord;Voorrangsbord;Verbodsbord;Gebodsbord;Informatiebord;Onderbord;Aanwijzingsbord
Noem een wegtype.|Snelweg;Autoweg;Provinciale weg;Gemeenteweg;Fietsstraat;Erftoegangsweg;Ringweg;Dijkweg;Landweg
Noem een type kruispunt.|Rotonde;T-kruising;Vierarmig kruispunt;Turborotonde;Ongelijkvloerse kruising;Voorrangskruispunt;Klein verkeersplein
Noem een techniek die een auto helpt remmen of sturen.|ABS;ESP;Traction control;Stuurbekrachtiging;Rijstrookassistent;Noodremassistent;Adaptieve cruisecontrol;Hill hold
Noem een autobrandstof of energiebron.|Benzine;Diesel;LPG;CNG;Waterstof;Elektriciteit;Biogas;Bio-ethanol;Biodiesel;HVO
Noem een type motor in een voertuig.|Benzinemotor;Dieselmotor;Elektromotor;Wankelmotor;Stoommachine;Gasturbine;Waterstofbrandstofcel;Hybride aandrijving
Noem een soort transportcontainer.|Standaardcontainer;High cube container;Koelcontainer;Tankcontainer;Open-topcontainer;Flat rack;Bulkcontainer;Platformcontainer
Noem een historisch vervoermiddel.|Postkoets;Paardentram;Stoomlocomotief;Zeilschip;Diligence;Trekvaartschuit;Paardenwagen;Raderboot;Hondenkar
Noem een openbaar vervoermiddel.|Bus;Tram;Trein;Metro;Trolleybus;Veerboot;Waterbus;Kabelbaan;Buurtbus;Fietstaxi
Noem een type landingsbaanoppervlak.|Asfalt;Beton;Gras;Grind;Sneeuw;IJs;Zand;Aarde
Noem een soort voertuig voor hulpdiensten.|Ambulance;Brandweerwagen;Politieauto;Reddingshelikopter;Ladderwagen;Traumahelikopter;Reddingsboot;Commandowagen
Noem een hulpmiddel voor vrachtvervoer.|Pallet;Vorkheftruck;Container;Palletwagen;Laadklep;Spanband;Containerkraan;Stapelaar;Rolcontainer;Reachstacker;Steekwagen
Noem een type raceauto.|Formule 1-auto;IndyCar;Rallyauto;GT3-auto;Prototype;Touringcar;Stockcar;Kart;Dragracer;Formule E-auto
Noem een type aanhanger.|Caravan;Bagagewagen;Paardentrailer;Boottrailer;Autotrailer;Kipper;Gesloten aanhanger;Fietstrailer;Dieplader
Noem een vervoermiddel met twee wielen.|Fiets;Motorfiets;Scooter;Bromfiets;E-bike;Bakfiets met twee wielen;Vouwfiets;Step;Segway
# Algemene kennis
Noem een menselijke taal met meer dan 50 miljoen sprekers.|Mandarijn;Spaans;Engels;Hindi;Arabisch;Portugees;Russisch;Bengaals;Frans;Duits;Japans;Punjabi;Indonesisch
Noem een officiële taal van de Europese Unie.|Nederlands;Duits;Frans;Engels;Spaans;Portugees;Italiaans;Pools;Grieks;Zweeds;Fins;Deens;Tsjechisch;Slowaaks;Hongaars;Roemeens;Bulgaars;Kroatisch;Sloveens;Ests;Lets;Litouws;Maltees;Iers
Noem een schriftsysteem.|Latijns alfabet;Cyrillisch alfabet;Grieks alfabet;Arabisch schrift;Hebreeuws schrift;Devanagari;Hangul;Hiragana;Katakana;Kanji;Chinees schrift;Brahmi
Noem een leesteken.|Punt;Komma;Puntkomma;Dubbele punt;Vraagteken;Uitroepteken;Apostrof;Aanhalingsteken;Haakje;Koppelteken;Gedachtestreep
Noem een woordsoort.|Zelfstandig naamwoord;Werkwoord;Bijvoeglijk naamwoord;Bijwoord;Voornaamwoord;Voorzetsel;Voegwoord;Lidwoord;Telwoord;Tussenwerpsel
Noem een synoniem voor het woord 'mooi'.|Prachtig;Fraai;Schitterend;Beeldschoon;Sierlijk;Aantrekkelijk;Elegant;Fijn;Adembenemend;Knap
Noem een soort kalender.|Gregoriaanse kalender;Juliaanse kalender;Islamitische kalender;Hebreeuwse kalender;Chinese kalender;Perzische kalender;Hindoeïstische kalender;Ethiopische kalender
Noem een maand in het jaar.|Januari;Februari;Maart;April;Mei;Juni;Juli;Augustus;September;Oktober;November;December
Noem een dag van de week.|Maandag;Dinsdag;Woensdag;Donderdag;Vrijdag;Zaterdag;Zondag
Noem een nationale feestdag in Nederland.|Koningsdag;Bevrijdingsdag;Nieuwjaarsdag;Eerste kerstdag;Tweede kerstdag;Hemelvaartsdag;Eerste paasdag;Tweede paasdag;Eerste pinksterdag;Tweede pinksterdag
Noem een wereldreligie.|Christendom;Islam;Hindoeïsme;Boeddhisme;Jodendom;Sikhisme;Jaïnisme;Bahá'í;Taoïsme;Shinto
Noem een religieus gebouw.|Kerk;Moskee;Synagoge;Tempel;Klooster;Kathedraal;Basiliek;Pagode;Stupa;Gurdwara
Noem een beroemd wereldwonder uit de oudheid.|Piramide van Cheops;Hangende tuinen van Babylon;Zeusbeeld te Olympia;Tempel van Artemis;Mausoleum van Halicarnassus;Kolossus van Rhodos;Vuurtoren van Alexandrië
Noem een onderdeel van een computer.|Processor;Moederbord;Werkgeheugen;Videokaart;SSD;Harde schijf;Voeding;Koeler;Behuizing;Netwerkkaart;Geluidskaart
Noem een besturingssysteem.|Windows;macOS;Linux;Android;iOS;ChromeOS;FreeBSD;Ubuntu;Debian;Fedora
Noem een webbrow ser.|Chrome;Firefox;Safari;Edge;Opera;Brave;Vivaldi;Tor Browser;Chromium;DuckDuckGo Browser
Noem een zoekmachine.|Google;Bing;DuckDuckGo;Yahoo;Startpage;Ecosia;Brave Search;Qwant;Mojeek;Yandex
Noem een bestandstype voor een afbeelding.|JPEG;PNG;GIF;WebP;SVG;BMP;TIFF;HEIF;AVIF;ICO
Noem een manier om gegevens veilig te bewaren.|Externe back-up;Cloudback-up;Offline back-up;Versiebeheer;Momentopname;Versleutelde back-up;Lokale back-up;Redundante opslag;Archivering
Noem een soort cyberaanval.|Phishing;Ransomware;DDoS;Brute-forceaanval;SQL-injectie;Cross-site scripting;Man-in-the-middleaanval;Malware;Spyware;Social engineering
Noem een soort opslagmedium.|USB-stick;SSD;Harde schijf;SD-kaart;Cd;Dvd;Blu-ray;Magnettape;Diskette;Cloudopslag
Noem een soort smartphonefunctie.|Bellen;Sms'en;Fotograferen;Navigeren;Internet;Betalen;Videobellen;Muziek afspelen;QR-code scannen
Noem een type computermuis.|Optische muis;Lasermuis;Trackball;Draadloze muis;Gamingmuis;Verticale muis;Bluetoothmuis;Bedrade muis
Noem een soort toetsenbordindeling.|QWERTY;AZERTY;QWERTZ;Dvorak;Colemak;Workman;Neo;Bépo
Noem een bordspel zonder dobbelstenen.|Schaken;Dammen;Go;Stratego;Scrabble;Catan;Carcassonne;Ticket to Ride;Azul;Codenames
Noem een klassiek kaartspel.|Bridge;Poker;Klaverjassen;Pesten;Hartenjagen;Patience;Canasta;Rummy;Toepen;Eenendertigen
Noem een soort schaakstuk.|Koning;Dame;Toren;Loper;Paard;Pion
Noem een symbool of rang op een speelkaart.|Harten;Ruiten;Schoppen;Klaveren;Aas;Koning;Vrouw;Boer;Joker
Noem een dobbelsteentype met meer dan zes vlakken.|D8;D10;D12;D20;D30;D100;D24
Noem een type puzzel.|Kruiswoordraadsel;Sudoku;Legpuzzel;Woordzoeker;Nonogram;Kakuro;Rebus;Cryptogram;Schaakprobleem
Noem een type raadsel.|Rebus;Logisch raadsel;Woordraadsel;Rekenraadsel;Cryptogram;Doolhof;Mysteriepuzzel;Rijmraadsel
Noem een schoolvak dat over natuurwetenschappen gaat.|Natuurkunde;Scheikunde;Biologie;NaSk;Wetenschap en techniek;Algemene natuurwetenschappen;Natuur en gezondheid
Noem een soort bibliotheekmateriaal.|Boek;E-book;Audioboek;Tijdschrift;Krant;Stripboek;Atlas;Naslagwerk;Partituur;Dvd
Noem een soort openbaar gebouw.|Stadhuis;Bibliotheek;Museum;Ziekenhuis;School;Station;Rechtbank;Postkantoor;Theater;Zwembad
Noem een beroep in de gezondheidszorg.|Arts;Verpleegkundige;Tandarts;Apotheker;Fysiotherapeut;Verloskundige;Psycholoog;Diëtist;Radioloog;Paramedicus
Noem een ruimte of voorziening in een schoolgebouw.|Klaslokaal;Aula;Gymzaal;Bibliotheek;Laboratorium;Mediatheek;Kantine;Speelplein;Lerarenkamer;Schoolplein;Administratie
Noem een bouwmateriaal.|Baksteen;Beton;Staal;Hout;Glas;Kalkzandsteen;Gips;Leem;Natuursteen;Kunststof;Isolatiemateriaal
Noem een apparaat in een keuken.|Fornuis;Oven;Magnetron;Blender;Koelkast;Vriezer;Broodrooster;Koffiezetapparaat;Vaatwasser;Waterkoker;Staafmixer
Noem een draadloze communicatietechnologie.|Bluetooth;Wifi;NFC;RFID;Infrarood;Zigbee;LoRa;Mobiel netwerk;Satellietcommunicatie;Z-Wave
Noem een beroep in de wetenschap.|Bioloog;Natuurkundige;Scheikundige;Astronoom;Geoloog;Wiskundige;Ecoloog;Epidemioloog;Archeoloog;Meteoroloog
Noem een internationaal symbool voor een eenheid.|m;kg;s;A;K;mol;cd;Hz;N;Pa;J;W;V;Ω
Noem een soort driehoek.|Gelijkzijdige driehoek;Gelijkbenige driehoek;Ongelijkzijdige driehoek;Rechthoekige driehoek;Scherphoekige driehoek;Stomphoekige driehoek
Noem een meetkundige figuur met vier zijden.|Vierkant;Rechthoek;Ruit;Parallellogram;Trapezium;Vlieger;Vierhoek
Noem een veelvlak.|Kubus;Balk;Tetraëder;Octaëder;Dodecaëder;Icosaëder;Prisma;Piramide
Noem een priemgetal kleiner dan vijftig.|2;3;5;7;11;13;17;19;23;29;31;37;41;43;47
Noem een symbool uit de wiskunde.|Plus;Min;Keer;Gedeeld door;Is gelijk aan;Groter dan;Kleiner dan;Pi;Wortel;Oneindigheid;Procent
Noem een soort grafiek.|Lijngrafiek;Staafdiagram;Cirkeldiagram;Histogram;Spreidingsdiagram;Boxplot;Heatmap;Vlakdiagram;Radarplot
Noem een algemeen type verzekering.|Zorgverzekering;Autoverzekering;Inboedelverzekering;Opstalverzekering;Aansprakelijkheidsverzekering;Reisverzekering;Levensverzekering;Rechtsbijstandsverzekering
Noem een soort identiteitsdocument.|Paspoort;Identiteitskaart;Rijbewijs;Verblijfsvergunning;Diplomatiek paspoort;Vreemdelingendocument
Noem een manier om een bericht te versturen.|E-mail;Sms;Brief;Chatbericht;Postkaart;Fax;Telegram;Spraakbericht;Pushmelding;Direct message
`;
  const LABELS = {
    "Dieren": "🐾 DIEREN",
    "Aardrijkskunde": "🌍 AARDRIJKSKUNDE",
    "Sport": "⚽ SPORT",
    "Muziek": "🎵 MUZIEK",
    "Mode": "👗 MODE",
    "Geschiedenis": "🏛️ GESCHIEDENIS",
    "Ruimte": "🪐 RUIMTE",
    "Wetenschap": "🔬 WETENSCHAP",
    "Eten": "🍽️ ETEN",
    "Natuur": "🌿 NATUUR",
    "Cultuur": "🎨 CULTUUR",
    "Vervoer": "🚗 VERVOER",
    "Algemene kennis": "🧩 ALGEMENE KENNIS"
  };
  function norm(x) {
    return String(x).normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/\+/g, "plus").replace(/#/g, "sharp")
      .replace(/[^a-z0-9Ͱ-Ͽ]/g, "");
  }
  function hash(x) {
    let h = 2166136261;
    for (let i = 0; i < x.length; i++) {
      h ^= x.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  // Alleen gecontroleerde alternatieve namen voor hetzelfde antwoord.
  const SYNONYMS = {
    "tchaikovsky": ["Tsjaikovski", "Tsjajkovski"],
    "tsjaikovski": ["Tchaikovsky"],
    "jangtsekiang": ["Yangtze", "Chang Jiang"],
    "gelerivier": ["Huang He", "Huanghe"],
    "sovjetunie": ["USSR", "Soviet Union"],
    "verenigdestaten": ["VS", "USA", "United States"],
    "verenigdkoninkrijk": ["VK", "UK", "United Kingdom"],
    "nederland": ["The Netherlands"],
    "nieuwzeeland": ["New Zealand"],
    "duitsland": ["Germany", "Deutschland"],
    "frankrijk": ["France"],
    "spanje": ["España", "Spain"],
    "italie": ["Italia", "Italy"],
    "monalisa": ["La Gioconda", "Gioconda"],
    "denachtwacht": ["The Night Watch"],
    "roscosmos": ["Roskosmos"],
    "moskou": ["Moscow"],
    "beijing": ["Peking"],
    "mumbai": ["Bombay"],
    "kolkata": ["Calcutta"],
    "chennai": ["Madras"],
    "bengaluru": ["Bangalore"]
  };
  const questions = [];
  const byCategory = {};
  let category = "";
  let index = 0;
  const duplicates = new Set();
  RAW.split("\n").forEach(function (rawLine) {
    const line = rawLine.trim();
    if (!line) return;
    if (line.startsWith("# ")) {
      category = line.slice(2).trim();
      index = 0;
      if (!LABELS[category]) throw Error("Onbekende categorie " + category);
      byCategory[category] = [];
      return;
    }
    const sep = line.indexOf("|");
    if (sep < 1) throw Error("Ongeldige vraagregel: " + line);
    const text = line.slice(0, sep).trim();
    const names = line.slice(sep + 1).split(";")
      .map(function (x) { return x.trim(); }).filter(Boolean);
    if (names.length < 3) throw Error("Te weinig antwoorden: " + text);
    if (duplicates.has(norm(text))) throw Error("Dubbele vraag: " + text);
    duplicates.add(norm(text));
    const id = "qb650-" + norm(category) + "-" + String(index + 1).padStart(2, "0");
    const seen = new Set();
    const accepted = names.filter(function (name) {
      const key = norm(name);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const rocketName = accepted[accepted.length - 1];
    const answers = accepted.map(function (name) {
      const rocket = name === rocketName;
      return {
        answer: name,
        points: rocket ? 100 : 10 + (hash(id + "|" + name) % 80),
        aliases: (SYNONYMS[norm(name)] || []).slice(),
        isRocket: rocket
      };
    });
    const item = {
      id: id,
      baseQuestionId: id,
      topicId: id,
      qb650Category: category,
      category: LABELS[category],
      question: text,
      hint: "Denk aan een minder bekend maar correct antwoord!",
      answers: answers,
      qb650: true
    };
    questions.push(item);
    byCategory[category].push(item);
    index++;
  });
  if (questions.length !== 650 ||
      Object.keys(byCategory).length !== 13 ||
      Object.values(byCategory).some(function (a) { return a.length !== 50; })) {
    throw Error("QuizBallon 650 is niet compleet: " + questions.length + " vragen.");
  }
  window.QB650_QUESTIONS = questions;
  window.QB650_BY_CATEGORY = byCategory;
  window.QB650_VERSION = "QB650-2026-11-27-1";
  // Daily V7 leest uitsluitend deze 650 gevalideerde basisvragen.
  // De oudere QuizBallon-vragenbestanden blijven beschikbaar voor Duel.
  console.log("✅ QuizBallon 650 geladen: 13 categorieën × 50 vragen = 650 vragen.");
  console.log("🧠 Geldige antwoordnamen:", questions.reduce(function (a, q) {
    return a + q.answers.length;
  }, 0));
})();
