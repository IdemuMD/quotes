#!/usr/bin/env node
/**
 * generateHeroes.js
 * Generate a dataset of silly heroes with consistent nemesis/associates
 * relationships and coherent background stories.
 *
 * Output: seed/heroes.json (pretty-printed)
 *
 * CLI:
 *   node generateHeroes.js                -> 150 heroes, random seed
 *   node generateHeroes.js --count 200    -> custom count
 *   node generateHeroes.js --seed 42      -> deterministic output
 *   node generateHeroes.js --out data.json
 */

const fs = require("fs");
const path = require("path");

// ---------- Config ----------
const CURRENT_YEAR = 2025;
const DEFAULT_COUNT = parseInt(getArg("--count", "150"), 10) || 150;
const OUTFILE = getArg("--out", path.join("seed", "heroes.json"));
const SEED = getArg("--seed", String(Math.floor(Math.random() * 1e9)));

// Powers: keep consistent casing for search/filter
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

// Name parts for alterEgo fun
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
  "Courier","Clerk","Scribe","Artist","Composer","Archivist","Poet","Farmer","Smith",
];

const ALIEN_NOUNS = [
  "Blob","Warden","Overmind","Unit","Drone","Emissary","Oracle","Seer","Warmind",
  "Chancellor","Harvester","Construct","Sentinel","Node","Spindle","Lattice"
];

const HUMAN_FIRST_NAMES = [
  "Hilda","Haggar","Felicia","Silas","Jan","Ingrid","Ola","Kari","Lars","Mona",
  "Nils","Oda","Pål","Rita","Stein","Anna","Bjørn","Marius","Siv","Eirik",
  "Sofia","Ahmed","Li","Mina","Diego","Marco","Yuki","Aisha","Noah","Emma"
];

const HUMAN_LAST_NAMES = [
  "Fox","Vulpes","Nordvik","Berg","Lund","Hansen","Johansen","Olsen","Solberg",
  "Iversen","Strand","Dahl","Holm","Haugen","Sørensen","Ngo","Garcia","Khan","Singh","Kim"
];

const EVENT_KEYWORDS = [
  "the Midnight Incident","the Broken Gate","the Tractor Glow","the Harbor Blackout",
  "the Library Fire","the Neon Fog","the Titan Rains","the Quiet Uprising",
  "the Frozen Dawn","the Red Market","the Glass Bridge","the Latch Puzzle",
  "the Hivemind Murmur","the Rusted Siren","the Echo Fault"
];

// ---------- Simple seeded RNG ----------
function getArg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && i < process.argv.length - 1) return process.argv[i + 1];
  return fallback;
}
function mulberry32(seed) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(Number(SEED) || 42);
function rand() { return rng(); }
function randint(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function choice(arr) { return arr[Math.floor(rand() * arr.length)] }
function sample(arr, k) {
  const copy = arr.slice();
  const out = [];
  for (let i = 0; i < k && copy.length; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}
function pickDistinctOther(arr, notName, predicate = () => true) {
  const filtered = arr.filter(h => h.alterEgo !== notName && predicate(h));
  if (!filtered.length) return null;
  return choice(filtered);
}

// ---------- Helper builders ----------
function buildAlterEgo(kind) {
  if (kind === "animal") return `${choice(ADJECTIVES)} ${choice(ANIMAL_NOUNS)}`;
  if (kind === "human")  return `${choice(ADJECTIVES)} ${choice(HUMAN_NOUNS)}`;
  // aliens/robots etc:
  const base = `${choice(ADJECTIVES)} ${choice(ALIEN_NOUNS)}`;
  // spice some with numeric units
  return rand() < 0.3 ? `${base} ${randint(1, 99)}` : base;
}

function uniqueAlterEgo(existing, kind) {
  let tries = 0;
  while (tries++ < 10000) {
    const cand = buildAlterEgo(kind);
    if (!existing.has(cand)) return cand;
  }
  // fallback extremely unlikely
  return `${buildAlterEgo(kind)}-${Date.now()}`;
}

function buildRealName(kind) {
  if (rand() < 0.2) return "unknown";
  if (rand() < 0.05) return "not applicable";
  if (kind === "animal") {
    // fun: firstname + species
    return `${choice(HUMAN_FIRST_NAMES)} ${choice(ANIMAL_NOUNS)}`;
  }
  if (kind === "alien") {
    // quirky alien-ish
    const syll = ["Zo","Glor","Xen","Nyx","Val","Or","Quo","Tha","Um","Ae","Ryl","Vor","Kry"];
    const s = () => choice(syll);
    return `${s()}${s()}${s()} ${choice(ALIEN_NOUNS)}`;
  }
  // human
  return `${choice(HUMAN_FIRST_NAMES)} ${choice(HUMAN_LAST_NAMES)}`;
}

function buildCitizenship(kind) {
  if (kind === "alien") return choice(PLANETS);
  // allow a few “space” citizens even for non-aliens
  return rand() < 0.08 ? choice(PLANETS) : choice(EARTH_COUNTRIES);
}

function buildAgeAndBirthYear(kind) {
  let age;
  if (kind === "alien") {
    // very old possible
    const band = randint(1, 3);
    if (band === 1) age = randint(120, 350);
    else if (band === 2) age = randint(351, 1200);
    else age = randint(1201, 2200);
  } else if (kind === "animal") {
    age = randint(2, 40);
  } else {
    // human
    age = randint(12, 98);
  }
  const birthYear = Math.max(0, CURRENT_YEAR - age);
  return { age, birthYear };
}

function pickPowers() {
  const n = randint(1, 4);
  return sample(POWERS, n);
}

// ---------- Story templates ----------
function makeEventKey() {
  return choice(EVENT_KEYWORDS);
}

function storyFor(hero, nemesisName, eventKey, associateNames) {
  // build short 40–60 words story referencing nemesis and maybe an associate
  const bits = [];
  const intro = [
    `Raised far from the spotlight, ${hero.alterEgo} learned odd tricks early.`,
    `${hero.alterEgo} never aimed for fame; the world kept finding them.`,
    `Rumor says ${hero.alterEgo} trained where maps fade and names blur.`,
    `${hero.alterEgo} prefers the edges of things—alleys, archives, antenna arrays.`,
    `Every road bent a little when ${hero.alterEgo} passed by.`
  ];
  bits.push(choice(intro));

  const craft = [
    `A knack for ${hero.powers[0]} became a habit; a habit became a legend.`,
    `People noticed the way tools behaved around them—especially under pressure.`,
    `They tuned their instincts until silence had seams to pull.`,
    `Practice made patterns; patterns made plans.`,
    `Old machines and older myths both answered when ${hero.alterEgo} called.`
  ];
  bits.push(choice(craft));

  if (nemesisName) {
    const mid = [
      `Everything changed during ${eventKey}, when ${nemesisName} stepped across the line.`,
      `${eventKey} drew a bright circle; ${nemesisName} stood on the far side of it.`,
      `On the night of ${eventKey}, the feud with ${nemesisName} began in earnest.`,
      `${eventKey} was the first time they read ${nemesisName}'s rhythm.`,
      `It was ${eventKey} that made ${hero.alterEgo} and ${nemesisName} permanent in each other's plans.`
    ];
    bits.push(choice(mid));
  }

  if (associateNames?.length) {
    const assoc = choice(associateNames);
    const tail = [
      `Since then, ${assoc} keeps pace, trading signals and patience.`,
      `${assoc} reminds them that speed without sense is just noise.`,
      `When angles get tight, ${assoc} lends a steadier line.`,
      `Maps change, but ${assoc} still meets them at the quiet corners.`,
      `If the city holds its breath, ${assoc} counts the beats with them.`
    ];
    bits.push(choice(tail));
  }

  const close = [
    `The path ahead is narrow but lit enough for one more step.`,
    `They carry the night like a toolkit and walk on.`,
    `Plans fail; patterns don’t. That is enough.`,
    `No banners. No speeches. Just the work.`,
    `Tomorrow is a moving target; that’s fine.`
  ];
  bits.push(choice(close));

  // Ensure ~50 words (roughly)
  let text = bits.join(" ");
  const w = text.split(/\s+/).length;
  if (w < 40) {
    text += " They kept notes in margins and messages in echoes until meaning held.";
  }
  return text;
}

// ---------- Generation pipeline ----------
function main() {
  // prepare count by categories
  const total = DEFAULT_COUNT;
  const third = Math.floor(total / 3);
  const counts = { animal: third, human: third, alien: total - 2 * third };

  // create unique pool
  const usedAlterEgos = new Set();
  /** @type {{alterEgo:string, realName:string, age:number, birthYear:number, fullTimeHero:boolean, alignment:string, powers:string[], associates:string[], enemies:string[], nemesis:string|null, citizenship:string, backgroundStory:string}[]} */
  const heroes = [];

  // 1) draft heroes without relations
  for (const kind of ["animal","human","alien"]) {
    for (let i = 0; i < counts[kind]; i++) {
      const alterEgo = uniqueAlterEgo(usedAlterEgos, kind);
      usedAlterEgos.add(alterEgo);

      const realName = buildRealName(kind);
      const { age, birthYear } = buildAgeAndBirthYear(kind);
      const fullTimeHero = rand() < 0.5;
      const alignment = choice(ALIGNMENTS);
      const powers = pickPowers();
      const citizenship = buildCitizenship(kind);

      heroes.push({
        alterEgo,
        realName,
        age,
        birthYear,
        fullTimeHero,
        alignment,
        powers,
        associates: [],
        enemies: [],
        nemesis: null,
        citizenship,
        backgroundStory: ""
      });
    }
  }

  // Helper maps
  const byName = new Map(heroes.map(h => [h.alterEgo, h]));
  const sameAlign = a => b => b.alignment === a.alignment && b.alterEgo !== a.alterEgo;
  const oppOrNeutral = a => b => (a.alignment === "neutral" ? b.alignment !== "neutral" : b.alignment !== a.alignment) && b.alterEgo !== a.alterEgo;

  // 2) pair nemeses (mutual), try to respect alignment rules
  const shuffled = heroes.slice().sort(() => rand() - 0.5);
  const usedNemesis = new Set();
  const eventForPair = new Map(); // key like "A|B" sorted -> eventKey

  for (const h of shuffled) {
    if (usedNemesis.has(h.alterEgo)) continue;
    const candidate = pickDistinctOther(
      heroes,
      h.alterEgo,
      oppOrNeutral(h)
    );
    if (!candidate || usedNemesis.has(candidate.alterEgo)) continue;

    // pair them
    h.nemesis = candidate.alterEgo;
    candidate.nemesis = h.alterEgo;
    usedNemesis.add(h.alterEgo);
    usedNemesis.add(candidate.alterEgo);

    // assign a shared event
    const key = [h.alterEgo, candidate.alterEgo].sort().join("|");
    eventForPair.set(key, makeEventKey());
  }

  // 3) associates (mostly same alignment), mirror ~80% of the time
  for (const h of heroes) {
    const howMany = randint(0, 3);
    const pool = heroes.filter(sameAlign(h)).map(x => x.alterEgo).filter(x => x !== h.nemesis);
    const picks = sample(pool, howMany);
    h.associates = Array.from(new Set(picks));

    for (const aName of h.associates) {
      if (rand() < 0.8) {
        const a = byName.get(aName);
        if (a && !a.associates.includes(h.alterEgo)) a.associates.push(h.alterEgo);
      }
    }
  }

  // 4) enemies (opposite alignment excluding nemesis)
  for (const h of heroes) {
    const howMany = randint(0, 3);
    const pool = heroes
      .filter(oppOrNeutral(h))
      .map(x => x.alterEgo)
      .filter(x => x !== h.nemesis);
    h.enemies = Array.from(new Set(sample(pool, howMany)));
  }

  // 5) background stories (coherent for nemesis pairs and mention an associate if any)
  for (const h of heroes) {
    let eventKey = null;
    if (h.nemesis) {
      const key = [h.alterEgo, h.nemesis].sort().join("|");
      eventKey = eventForPair.get(key) || makeEventKey();
    }
    h.backgroundStory = makeStorySafe(
      storyFor(h, h.nemesis, eventKey, h.associates)
    );
  }

  // 6) output
  ensureDir(path.dirname(OUTFILE));
  fs.writeFileSync(OUTFILE, JSON.stringify(heroes, null, 2), "utf-8");
  console.log(`[ok] Generated ${heroes.length} heroes -> ${OUTFILE}`);
  console.log(`[hint] Run with --seed <n> for reproducible output. Example: --seed 42`);
}

// small sanitizer to keep stories to ASCII-ish quotes and compact spaces
function makeStorySafe(s) {
  return s.replace(/\s+/g, " ").trim();
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

main();
