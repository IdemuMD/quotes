#!/usr/bin/env node
/**
 * seed.js
 * One-shot seeder:
 *  - generates 150 silly heroes
 *  - writes seed/heroes.json
 *  - drops and imports into MongoDB (assignment1.heroes)
 *
 * Usage:
 *   node seed.js
 */

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// ---- Fixed config (no flags) ----
const CURRENT_YEAR = 2025;
const COUNT = 150;
const OUTFILE = path.join("seed", "heroes.json");
const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "assignment1";
const COLLECTION = "heroes";

// ---- Data pools ----
const POWERS = [
  "flight","superStrength","immortality","teleportation","invisibility",
  "timeWarp","mindControl","pyrokinesis","telekinesis","sonicBoom",
  "healing","techWizard","shapeShift","cunning","speed","tactics","magnetism",
  "aquaBreath","stoneSkin","stormCaller","echoLocator","shadowStep"
];

const EARTH_COUNTRIES = [
  "Norway","Sweden","Denmark","Finland","Iceland","UK","Ireland","France","Germany",
  "Italy","Spain","Portugal","Netherlands","Belgium","Poland","Czechia","Austria",
  "Switzerland","Greece","Turkey","USA","Canada","Mexico","Brazil","Argentina",
  "Chile","Peru","Colombia","Japan","South Korea","China","India","Pakistan",
  "Bangladesh","Thailand","Vietnam","Australia","New Zealand","South Africa","Nigeria",
  "Kenya","Egypt","Morocco","Tunisia","Algeria","Ethiopia","Ghana"
];

const PLANETS = [
  "Mars","Venus","Europa","Titan","Ganymede","Io","Pluto","Ceres",
  "Xenthar-9","Andromeda-VII","Orion-Delta","Zephyra","Quallax","Nyx-12",
  "Vortexa","Krynn","Aethon","Umbra Prime","Altair-IV"
];

const ALIGNMENTS = ["hero","villain","neutral"];

const ADJECTIVES = [
  "Fuzzy","Crimson","Silver","Golden","Sneaky","Quantum","Velvet","Neon","Stormy",
  "Silent","Rusty","Rapid","Cosmic","Sly","Electric","Merry","Grumpy","Arcane",
  "Shadow","Solar","Lunar","Turbo","Lofty","Hollow","Bouncy","Keen","Brave","Odd",
];

const ANIMAL_NOUNS = [
  "Fox","Penguin","Otter","Badger","Falcon","Hawk","Mole","Carp","Bear","Cat",
  "Dog","Goat","Moose","Lynx","Eagle","Walrus","Seal","Shark","Whale","Raven",
  "Wolf","Hedgehog","Sparrow","Mouse","Viper"
];

const HUMAN_NOUNS = [
  "Janitor","Professor","Postman","Librarian","Baker","Gardener","Plumber","Pilot",
  "Nurse","Detective","Mechanic","Teacher","Chef","Barista","Courier","Ranger",
  "Clerk","Scribe","Artist","Composer","Archivist","Poet","Farmer","Smith"
];

const ALIEN_NOUNS = [
  "Blob","Warden","Overmind","Unit","Drone","Emissary","Oracle","Seer","Warmind",
  "Chancellor","Harvester","Construct","Sentinel","Node","Spindle","Lattice"
];

const HUMAN_FIRST_NAMES = [
  "Hilda","Haggar","Felicia","Silas","Jan","Ingrid","Ola","Kari","Lars","Mona",
  "Nils","Oda","Pal","Rita","Stein","Anna","Bjorn","Marius","Siv","Eirik",
  "Sofia","Ahmed","Li","Mina","Diego","Marco","Yuki","Aisha","Noah","Emma"
];

const HUMAN_LAST_NAMES = [
  "Fox","Vulpes","Nordvik","Berg","Lund","Hansen","Johansen","Olsen","Solberg",
  "Iversen","Strand","Dahl","Holm","Haugen","Sorensen","Ngo","Garcia","Khan","Singh","Kim"
];

const EVENT_KEYS = [
  "the Midnight Incident","the Broken Gate","the Tractor Glow","the Harbor Blackout",
  "the Library Fire","the Neon Fog","the Titan Rains","the Quiet Uprising",
  "the Frozen Dawn","the Red Market","the Glass Bridge","the Latch Puzzle",
  "the Hivemind Murmur","the Rusted Siren","the Echo Fault"
];

// ---- Tiny RNG (deterministic but we don't expose a seed) ----
let seed = 1337;
function rand() {
  // mulberry32
  seed += 0x6D2B79F5;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const randint = (a,b)=>Math.floor(rand()*(b-a+1))+a;
const choice = (arr)=>arr[Math.floor(rand()*arr.length)];
function sample(arr, k){ const a=arr.slice(),o=[]; for(let i=0;i<k&&a.length;i++){o.push(a.splice(Math.floor(rand()*a.length),1)[0])} return o; }

// ---- Helpers ----
function buildAlterEgo(kind) {
  if (kind === "animal") return `${choice(ADJECTIVES)} ${choice(ANIMAL_NOUNS)}`;
  if (kind === "human")  return `${choice(ADJECTIVES)} ${choice(HUMAN_NOUNS)}`;
  const base = `${choice(ADJECTIVES)} ${choice(ALIEN_NOUNS)}`;
  return rand() < 0.3 ? `${base} ${randint(1, 99)}` : base;
}
function buildRealName(kind) {
  if (rand() < 0.2) return "unknown";
  if (rand() < 0.05) return "not applicable";
  if (kind === "animal") return `${choice(HUMAN_FIRST_NAMES)} ${choice(ANIMAL_NOUNS)}`;
  if (kind === "alien") {
    const syll = ["Zo","Glor","Xen","Nyx","Val","Or","Quo","Tha","Um","Ae","Ryl","Vor","Kry"];
    const s = () => choice(syll);
    return `${s()}${s()}${s()} ${choice(ALIEN_NOUNS)}`;
  }
  return `${choice(HUMAN_FIRST_NAMES)} ${choice(HUMAN_LAST_NAMES)}`;
}
function buildCitizenship(kind) {
  if (kind === "alien") return choice(PLANETS);
  return rand() < 0.08 ? choice(PLANETS) : choice(EARTH_COUNTRIES);
}
function buildAgeBirth(kind) {
  let age;
  if (kind === "alien") {
    const band = randint(1,3);
    age = band===1 ? randint(120,350) : band===2 ? randint(351,1200) : randint(1201,2200);
  } else if (kind === "animal") {
    age = randint(2,40);
  } else {
    age = randint(12,98);
  }
  return { age, birthYear: Math.max(0, CURRENT_YEAR - age) };
}
function pickPowers(){ return sample(POWERS, randint(1,4)); }
function makeEvent(){ return choice(EVENT_KEYS); }
function storyFor(h, nemesis, eventKey, associates){
  const intro = [
    `Raised far from the spotlight, ${h.alterEgo} learned odd tricks early.`,
    `${h.alterEgo} never aimed for fame; the world kept finding them.`,
    `Rumor says ${h.alterEgo} trained where maps fade and names blur.`,
    `${h.alterEgo} prefers the edges of things—alleys, archives, antenna arrays.`,
    `Every road bent a little when ${h.alterEgo} passed by.`
  ];
  const craft = [
    `A knack for ${h.powers[0]} became a habit; a habit became a legend.`,
    `People noticed the way tools behaved around them—especially under pressure.`,
    `They tuned their instincts until silence had seams to pull.`,
    `Practice made patterns; patterns made plans.`,
    `Old machines and older myths both answered when ${h.alterEgo} called.`
  ];
  const mid = nemesis ? [
    `Everything changed during ${eventKey}, when ${nemesis} crossed a bright line.`,
    `${eventKey} drew a circle; ${nemesis} stood just beyond it.`,
    `On the night of ${eventKey}, the feud with ${nemesis} began in earnest.`,
    `${eventKey} was the first time they read ${nemesis}'s rhythm.`,
    `It was ${eventKey} that made ${h.alterEgo} and ${nemesis} permanent in each other's plans.`
  ] : [];
  const tail = associates?.length ? [
    `Since then, ${choice(associates)} keeps pace, trading signals and patience.`,
    `${choice(associates)} reminds them that speed without sense is just noise.`,
    `When angles get tight, ${choice(associates)} lends a steadier line.`,
    `Maps change, but ${choice(associates)} still meets them at the quiet corners.`,
    `If the city holds its breath, ${choice(associates)} counts the beats with them.`
  ] : [];
  const close = [
    `The path ahead is narrow but lit enough for one more step.`,
    `They carry the night like a toolkit and walk on.`,
    `Plans fail; patterns don’t. That is enough.`,
    `No banners. No speeches. Just the work.`,
    `Tomorrow is a moving target; that’s fine.`
  ];
  const bits = [choice(intro), choice(craft)];
  if (mid.length) bits.push(choice(mid));
  if (tail.length) bits.push(choice(tail));
  bits.push(choice(close));
  return bits.join(" ").replace(/\s+/g," ").trim();
}

// ---- Generation ----
function generateHeroes() {
  const third = Math.floor(COUNT/3);
  const counts = { animal: third, human: third, alien: COUNT - 2*third };
  const used = new Set();
  const heroes = [];

  for (const kind of ["animal","human","alien"]) {
    for (let i=0; i<counts[kind]; i++){
      let alterEgo;
      for(let tries=0; tries<10000; tries++){
        alterEgo = buildAlterEgo(kind);
        if (!used.has(alterEgo)) { used.add(alterEgo); break; }
      }
      const realName = buildRealName(kind);
      const { age, birthYear } = buildAgeBirth(kind);
      heroes.push({
        realName,
        alterEgo,
        age,
        birthYear,
        fullTimeHero: rand()<0.5,
        alignment: choice(ALIGNMENTS),
        powers: pickPowers(),
        associates: [],
        enemies: [],
        nemesis: null,
        citizenship: buildCitizenship(kind),
        backgroundStory: ""
      });
    }
  }

  // Relations
  const byName = new Map(heroes.map(h=>[h.alterEgo,h]));
  const sameAlign = a => b => b.alterEgo!==a.alterEgo && b.alignment===a.alignment;
  const oppOrNeutral = a => b => b.alterEgo!==a.alterEgo && (a.alignment==="neutral" ? b.alignment!=="neutral" : b.alignment!==a.alignment);

  // Pair nemeses
  const shuffled = heroes.slice().sort(()=>rand()-0.5);
  const paired = new Set();
  const sharedEvent = new Map();
  for (const h of shuffled) {
    if (paired.has(h.alterEgo)) continue;
    const pool = heroes.filter(oppOrNeutral(h));
    if (!pool.length) continue;
    const cand = choice(pool);
    if (paired.has(cand.alterEgo)) continue;
    h.nemesis = cand.alterEgo;
    cand.nemesis = h.alterEgo;
    paired.add(h.alterEgo);
    paired.add(cand.alterEgo);
    const key = [h.alterEgo, cand.alterEgo].sort().join("|");
    sharedEvent.set(key, makeEvent());
  }

  // Associates (mirror ~80%)
  for (const h of heroes) {
    const howMany = randint(0,3);
    const pool = heroes.filter(sameAlign(h)).map(x=>x.alterEgo).filter(x=>x!==h.nemesis);
    h.associates = Array.from(new Set(sample(pool, howMany)));
    for (const aName of h.associates) {
      if (rand()<0.8) {
        const a = byName.get(aName);
        if (a && !a.associates.includes(h.alterEgo)) a.associates.push(h.alterEgo);
      }
    }
  }

  // Enemies (opp/neutral, exclude nemesis)
  for (const h of heroes) {
    const howMany = randint(0,3);
    const pool = heroes.filter(oppOrNeutral(h)).map(x=>x.alterEgo).filter(x=>x!==h.nemesis);
    h.enemies = Array.from(new Set(sample(pool, howMany)));
  }

  // Stories (consistent for nemesis pairs)
  for (const h of heroes) {
    let eventKey = null;
    if (h.nemesis) {
      const key = [h.alterEgo, h.nemesis].sort().join("|");
      eventKey = sharedEvent.get(key) || makeEvent();
    }
    h.backgroundStory = storyFor(h, h.nemesis, eventKey, h.associates);
  }

  return heroes;
}

// ---- Write + Import ----
async function run() {
  const heroes = generateHeroes();

  // write file
  ensureDir(path.dirname(OUTFILE));
  fs.writeFileSync(OUTFILE, JSON.stringify(heroes, null, 2), "utf-8");
  console.log(`[ok] Wrote ${heroes.length} heroes -> ${OUTFILE}`);

  // import
  const client = new MongoClient(MONGODB_URI, { ignoreUndefined: true });
  await client.connect();
  try {
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    // fresh start
    await col.drop().catch(()=>{});
    await col.createIndex({ alterEgo: 1 }, { unique: true });
    const res = await col.insertMany(heroes, { ordered: false });
    console.log(`[ok] Imported ${res.insertedCount} heroes into ${DB_NAME}.${COLLECTION}`);
  } finally {
    await client.close();
  }
}

function ensureDir(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true}); }

run().catch(err=>{
  console.error("[seed] Failed:", err?.message || err);
  process.exit(1);
});
