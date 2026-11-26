/* ============================================================
   QUIZBALLON - EXTRA ANTWOORDEN

   Aanvullende antwoorden voor:
   - Zoogdieren
   - Muziekinstrumenten
   - Zeedieren
   - Vogels

   Dit zijn uitbreidingen van bestaande lijsten,
   geen volledige wereldcatalogussen.

   De code voegt alleen antwoorden toe
   die nog niet in de betreffende lijst staan.
============================================================ */

(function () {
  "use strict";

  function split(text) {
    return text
      .split("|")
      .map(value => value.trim())
      .filter(Boolean);
  }

  /* ==========================================================
     ZOOGDIEREN
  ========================================================== */

  const mammal = split(`
hond|kat|paard|ezel|koe|rund|varken|schaap|geit|
konijn|haas|cavia|hamster|muis|rat|eekhoorn|egel|mol|
vleermuis|vos|wolf|beer|bruine beer|ijsbeer|panda|
reuzenpanda|rode panda|tijger|leeuw|luipaard|jaguar|
cheeta|poema|lynx|bobcat|serval|caracal|ocelot|
margay|sneeuwluipaard|nevelpanter|hyena|stokstaartje|
mangoest|otter|das|bever|marter|bunzing|hermelijn|
wezel|nerts|veelvraat|wasbeer|neusbeer|skunk|
stinkdier|olifant|Afrikaanse olifant|
Aziatische olifant|mammoet|neushoorn|
witte neushoorn|zwarte neushoorn|nijlpaard|
dwergnijlpaard|giraffe|okapi|zebra|steppezebra|
bergzebra|grevyzebra|kameel|dromedaris|lama|
alpaca|vicuña|guanaco|hert|edelhert|damhert|
ree|eland|rendier|kariboe|wisent|bizon|
buffel|waterbuffel|kafferbuffel|yak|gaur|
antilope|gazelle|impala|springbok|gnoe|
blauwe gnoe|oryx|gemsbok|koedoe|grote koedoe|
elandantilope|steenbok|ibex|muskusos|tapir|
Maleise tapir|laaglandtapir|pekari|wrattenzwijn|
aardvarken|miereneter|reuzenmiereneter|luiaard|
drievingerige luiaard|tweevingerige luiaard|
gordeldier|negenbandgordeldier|pangolin|schubdier|
egeltenrek|tenrek|klipdas|hyrax|olifantspitsmuis|
springspitsmuis|spitsmuis|boomspitsmuis|
tarsier|spookdiertje|lemuur|ringstaartmaki|
vari|indri|sifaka|ayeaye|vingerdier|
loris|plompe lori|galago|baviaan|mandril|
gelada|makak|resusaap|japanse makaak|brulaap|
spinaap|kapucijnaap|doodshoofdaap|zijdeaapje|
tamarin|keizertamarin|oeistiti|gibbon|siamang|
orang-oetan|gorilla|chimpansee|bonobo|mens|
kangoeroe|rode reuzenkangoeroe|wallaby|
boomkangoeroe|koala|wombat|quokka|buideldas|
bilby|buidelmol|buidelrat|opossum|tasmaanse duivel|
buidelmarter|mierenegel|vogelbekdier|dolfijn|
tuimelaar|orka|bruinvis|narwal|beloega|potvis|
bultrug|blauwe vinvis|gewone vinvis|dwergvinvis|
grijze walvis|noordkaper|groenlandse walvis|
walrus|zeehond|gewone zeehond|grijze zeehond|
ringelrob|zadelrob|zeeleeuw|pelsrob|zeeolifant|
zeekoe|doejong|lamantijn|capibara|beverrat|
mara|chinchilla|degoe|stekelvarken|
boomstekelvarken|agouti|paca|springhaas|
jerboa|springmuis|lemming|woelmuis|bosmuis|
huismuis|bosrat|muskusrat|prairiehond|
marmot|alpenmarmot|grondeekhoorn|
vliegende eekhoorn|slaapmuis|hazelmuis|
relmuis|zevenslaper|vliegende vos|
vruchtenvleermuis|grote hoefijzerneus|
laatvlieger|dwergvleermuis|watervleermuis|
meervleermuis|grootoorvleermuis|rosse vleermuis|
spitsneusdolfijn|gevlekte hyena|gestreepte hyena|
aardwolf|fennek|poolvos|jakhals|goudjakhals|
coyote|dingo|Afrikaanse wilde hond|dhole|
manenwolf|wasbeerhond|binturong|civetkat|
genetkat|fossa|honingdas|reuzenotter|zeeotter|
Europese otter|muskushert|waterhert|moeflon|
dikdik|duiker|klipspringer|saiga|takin|goral|
serow|markhoor|schroefhoorngeit|berggeit|
steenmarter|boommarter|otterspitsmuis|
gouden mol|solenodon|neushoornspitsmuis
  `);

  /* ==========================================================
     MUZIEKINSTRUMENTEN
  ========================================================== */

  const instruments = split(`
gitaar|akoestische gitaar|elektrische gitaar|
basgitaar|piano|vleugel|keyboard|orgel|
pijporgel|harmonium|accordeon|bandoneon|
harmonica|mondharmonica|melodica|viool|
altviool|cello|contrabas|harp|lier|luit|
mandoline|banjo|ukelele|ukulele|sitar|
sarod|tanpura|oed|oud|balalaika|
bouzouki|cittern|citer|autoharp|koto|
shamisen|biwa|erhu|guqin|yangqin|
qanun|santoor|cimbalom|nyckelharpa|
draailier|hardingfele|trompet|bugel|
kornet|trombone|bastrombone|tuba|
eufonium|hoorn|jachthoorn|posthoorn|
piccolotrompet|saxofoon|sopraansaxofoon|
altsaxofoon|tenorsaxofoon|baritonsaxofoon|
klarinet|basklarinet|hobo|althobo|
fagot|contrafagot|dwarsfluit|piccolo|
blokfluit|basblokfluit|panfluit|
ocarina|tinwhistle|doedelzak|
didgeridoo|shakuhachi|ney|duduk|
zurna|shawm|trommel|drumstel|
snaredrum|grote trom|pauken|bongo|
conga|djembé|tabla|darbuka|cajón|
tamboerijn|castagnetten|triangel|
bekkens|gong|tam tam|woodblock|
claves|maracas|shaker|cowbell|agogo|
xylofoon|marimba|vibrafoon|klokkenspel|
celesta|buisklokken|steelpan|hangdrum|
handpan|kalimba|mbira|muziekdoos|
theremin|synthesizer|moog|synthbas|
keytar|sampler|drummachine|sousafoon|
serpent|ophicleide|cornamuse|schalmei|
vedel|rebec|viola da gamba|viola d'amore|
barokviool|psalterium|monochord|
berimbau|kora|ngoni|oudi|surbahar|
tampura|ektara|sarangi|esraj|dilruba|
bansuri|pungi|shehnai|nadaswaram|
gamelan|bonang|gender|saron|kendang|
rebab|angklung|suling|kulintang|
guzheng|pipa|sheng|suona|dizi|
hulusi|morin khuur|igill|topshuur|
dombra|komuz|rubab|daf|frame drum|
bodhrán|uilleann pipes|bombarde|
crumhorn|rackett|sackbut|dulcimer|
hammered dulcimer
  `);

  /* ==========================================================
     ZEEDIEREN
  ========================================================== */

  const sea = split(`
haai|witte haai|tijgerhaai|hamerhaai|
walvishaai|reuzenhaai|voshaai|
citroenhaai|blauwe haai|zandhaai|
makreelhaai|rog|manta|pijlstaartrog|
sidderrog|zaagvis|dolfijn|tuimelaar|
orka|bruinvis|walvis|blauwe vinvis|
bultrug|potvis|grijze walvis|narwal|
beloega|zeeleeuw|zeehond|walrus|
zeeolifant|doejong|lamantijn|zeekoe|
zeeschildpad|soepschildpad|
lederschildpad|onechte karetschildpad|
karetschildpad|octopus|achtarm|
inktvis|pijlinktvis|zeekat|
reuzeninktvis|reuzepijlinktvis|
nautilus|zeester|brokkelster|
slangster|zee-egel|zanddollar|
zeekomkommer|zee-anemoon|koraal|
kwal|oorkwal|kompaskwal|
zeepaddenstoel|portugees oorlogsschip|
krab|strandkrab|noordzeekrab|
spinkrab|heremietkreeft|kreeft|
zeekreeft|langoustine|garnaal|
gamba|krill|bidsprinkhaankreeft|
mantisgarnaal|degenkrab|zeepok|
mossel|oester|kokkel|scheermes|
sint-jakobsschelp|doopvontschelp|
zeeslak|naaktslak|nudibranch|
zeepaardje|zeenaald|koraalduivel|
clownvis|anemoonvis|doktersvis|
keizersvis|vlindervis|papegaaivis|
tandbaars|zeebaars|kabeljauw|
schelvis|wijting|koolvis|heek|
makreel|haring|sardine|ansjovis|
tonijn|blauwvintonijn|zwaardvis|
marlin|zeilvis|vliegende vis|
maanvis|oceaanmaanvis|kogelvis|
egelvis|zeeduivel|hengelvis|
lantaarnvis|diepzeevis|gulperaal|
murene|congeraal|paling|platvis|
schol|tong|tarbot|griet|heilbot|
bot|steenbolk|zeewolf|steenvis|
grondel|lipvis|zeebrasem|rode poon|
rode mul|zandspiering|glasaal|
reuzensidderrog|reuzenmanta|
barracuda|trekkervis|koffervis|
zeestekelbaars|wimpelvis|
kardinaalbaars
  `);

  /* ==========================================================
     VOGELS
  ========================================================== */

  const birds = split(`
arend|steenarend|zeearend|visarend|
keizerarend|slangenarend|havik|sperwer|
buizerd|ruigpootbuizerd|wespendief|
valk|slechtvalk|torenvalk|smelleken|
boomvalk|giervalk|gier|lammergier|
aasgier|kalkoengier|condor|
Andescondor|flamingo|grote flamingo|
kleine flamingo|pelikaan|roze pelikaan|
bruine pelikaan|aalscholver|
fregatvogel|Jan-van-gent|albatros|
wenkbrauwalbatros|pinguïn|
keizerspinguïn|koningspinguïn|
adeliepinguïn|ezelspinguïn|
rotsspringer|struisvogel|emu|
nandoe|kasuaris|kiwi|kakapo|
kea|papegaai|ara|hyacintara|
kaketoe|geelkuifkaketoe|
grasparkiet|valkparkiet|agapornis|
toekan|neushoornvogel|hop|
bijeneter|scharrelaar|ijsvogel|
paradijsvogel|schoenbekooievaar|
secretarisvogel|maraboe|ooievaar|
lepelaar|ibis|rode ibis|heilige ibis|
kraanvogel|kroonkraanvogel|trap|
koritrap|fazant|pauw|parelhoen|
gierparelhoen|hoatzin|kolibrie|
robijnkeelkolibrie|zwaardbekkolibrie|
motmot|quetzal|troepiaal|wevervogel|
vink|kanarie|mus|spreeuw|merel|
lijster|roodborst|nachtegaal|
winterkoning|zwaluw|gierzwaluw|
koekoek|specht|groene specht|
zwarte specht|grote bonte specht|
uil|oehoe|kerkuil|bosuil|sneeuwuil|
ransuil|velduil|dwergooruil|
kuifmees|pimpelmees|koolmees|
staartmees|boomklever|boomkruiper|
ekster|kraai|raaf|kauw|gaai|roek|
stern|visdief|noordse stern|
meeuw|zilvermeeuw|kokmeeuw|
mantelmeeuw|papegaaiduiker|alk|
zeekoet|eidereend|ijsduiker|
parelduiker|fuut|dodaars|
zwaan|knobbelzwaan|kleine zwaan|
gans|grauwe gans|brandgans|
rotgans|eend|wilde eend|
slobeend|krakeend|smient|
pijlstaart|tafeleend|kuifeend|
bergeend
  `);

  /* ==========================================================
     TEKST NORMALISEREN
  ========================================================== */

  function normalize(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ==========================================================
     BEPALEN WELKE LIJST BIJ EEN VRAAG PAST
  ========================================================== */

  function chooseAnswers(question) {
    const title = String(
      question.question || question.vraag || ""
    ).toLowerCase();

    /*
     * Geen extra antwoorden toevoegen aan
     * vragen met speciale lettereisen.
     */

    if (
      /extra eis|moet de letter|bevat de letter|begint met|eindigt op|zonder de letter/.test(
        title
      )
    ) {
      return [];
    }

    if (/zoogdier/.test(title)) {
      return mammal;
    }

    if (/muziekinstrument/.test(title)) {
      return instruments;
    }

    if (
      /dier dat in zee|zeedier|zeeleven/.test(
        title
      )
    ) {
      return sea;
    }

    if (
      /vogelsoort|noem een vogel/.test(title) &&
      !/nederland/.test(title)
    ) {
      return birds;
    }

    return [];
  }

  /* ==========================================================
     VOORLOPIGE PUNTENSCORES

     Dit zijn geschatte spelwaardes,
     geen gemeten antwoordfrequenties.
  ========================================================== */

  function score(name, index) {
    if (index < 25) {
      return 10 + (index % 9);
    }

    if (index < 90) {
      return 22 + (index % 29);
    }

    return 48 + (index % 48);
  }

  /* ==========================================================
     ANTWOORDEN TOEVOEGEN
  ========================================================== */

  function applyToQuestion(question) {
    const entries = chooseAnswers(question);

    if (!entries.length) {
      return 0;
    }

    let added = 0;

    /*
     * Structuur:
     * answers: [{answer, points, aliases}]
     */

    if (Array.isArray(question.answers)) {
      const existing = new Set(
        question.answers.map(answer =>
          normalize(
            typeof answer === "string"
              ? answer
              : answer.answer || answer.name || ""
          )
        )
      );

      entries.forEach((name, index) => {
        const key = normalize(name);

        if (existing.has(key)) {
          return;
        }

        question.answers.push({
          answer: name,
          points: score(name, index),
          aliases: []
        });

        existing.add(key);
        added++;
      });
    }

    /*
     * Alternatieve structuur:
     * antwoorden: { "Hond": 10, "Kat": 10 }
     */

    else if (
      question.antwoorden &&
      typeof question.antwoorden === "object" &&
      !Array.isArray(question.antwoorden)
    ) {
      const existing = new Set(
        Object.keys(question.antwoorden).map(
          normalize
        )
      );

      entries.forEach((name, index) => {
        const key = normalize(name);

        if (existing.has(key)) {
          return;
        }

        question.antwoorden[name] = score(
          name,
          index
        );

        existing.add(key);
        added++;
      });
    }

    return added;
  }

  /* ==========================================================
     ALLE BEKENDE VRAGENBANKEN BIJWERKEN
  ========================================================== */

  function apply() {
    const arrays = [
      window.QUIZBALLON_EXPANDED_QUESTIONS,
      window.QUIZ_VRAGEN,
      window.QUIZ_QUESTIONS
    ];

    const seen = new Set();

    let added = 0;

    for (const array of arrays) {
      if (!Array.isArray(array)) {
        continue;
      }

      for (const question of array) {
        if (!question || seen.has(question)) {
          continue;
        }

        seen.add(question);

        added += applyToQuestion(question);
      }
    }

    return added;
  }

  /* ==========================================================
     BESCHIKBAAR STELLEN
  ========================================================== */

  window.QB_EXTRA_ANSWERS = {
    mammal,
    instruments,
    sea,
    birds,
    apply
  };

  const added = apply();

  console.log(
    "QuizBallon: " +
    added +
    " aanvullende antwoorden toegevoegd."
  );

})();
