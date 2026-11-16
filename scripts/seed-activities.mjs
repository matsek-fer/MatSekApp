/**
 * Seeds the activities table with enough approved events, before and after
 * today, to exercise the calendar's preview-and-expand behaviour.
 *
 *   node scripts/seed-activities.mjs           # insert
 *   node scripts/seed-activities.mjs --clean   # remove exactly what it inserted
 *
 * Every seeded row carries MARKER in its description, which is what --clean
 * matches on, so it can never take a real activity with it. Connects as the
 * owning role from DATABASE_URL, which bypasses RLS: seeded rows are
 * approved, and approving is an admin's to do.
 */
import postgres from "postgres";
import { readFileSync } from "node:fs";

const MARKER = "[seed:calendar-demo]";
const PAST = 14;
const UPCOMING = 9;

function env(name) {
  if (process.env[name]) return process.env[name];
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      if (line.startsWith("#") || !line.includes("=")) continue;
      const at = line.indexOf("=");
      if (line.slice(0, at).trim() === name) return line.slice(at + 1).trim();
    }
  } catch {
    /* no .env.local — fall through to the error below */
  }
  throw new Error(`${name} is not set (env or .env.local)`);
}

// The owning role bypasses RLS on whatever database .env.local points at,
// and nothing distinguishes a development database from the real one except
// where it is. So it must be named explicitly, every run.
const url = new URL(env("DATABASE_URL"));
const target = `${url.host}${url.pathname}`;
const allowed = process.env.SEED_DATABASE;
if (!allowed || allowed !== target) {
  console.error(
    `Refusing to seed ${target}.\n` +
      `Set SEED_DATABASE=${target} to confirm this is the development database.`
  );
  process.exit(1);
}
console.log(`Seeding ${target}`);

const sql = postgres(url.href, { max: 1, onnotice: false });

const TITLES = [
  ["Uvod u teoriju grafova", "lecture", "A211"],
  ["Rješavanje natjecateljskih zadataka", "problem_solving_session", "A102"],
  ["Diskusija: Monty Hall i intuicija", "discussion", "D1"],
  ["Generatrise i njihove primjene", "lecture", "A211"],
  ["Kombinatorika na ploči", "problem_solving_session", "A102"],
  ["Što je zapravo dokaz?", "discussion", "D2"],
  ["Uvod u teoriju brojeva", "lecture", "A211"],
  ["Nejednakosti: AM-GM i dalje", "problem_solving_session", "A103"],
  ["Diskusija: beskonačnost", "discussion", "D1"],
  ["Linearna algebra iza grafike", "lecture", "A211"],
  ["Zadaci s prošlogodišnjeg natjecanja", "problem_solving_session", "A102"],
  ["Vjerojatnost i paradoksi", "discussion", "D2"],
  ["Uvod u kriptografiju", "lecture", "A211"],
  ["Geometrija bez koordinata", "problem_solving_session", "A103"],
  ["Druženje uz pizzu i zagonetke", "social", "Klub studenata"],
  ["Seminar: što je zapravo dokaz?", "seminar", "A201"],
];

/** Evening slots, every few days, walking away from today in one direction. */
function slot(index, direction) {
  const start = new Date();
  start.setDate(start.getDate() + direction * (2 + index * 3));
  start.setHours(18, 0, 0, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return { start_time: start.toISOString(), end_time: end.toISOString() };
}

function rows(count, direction, createdBy) {
  return Array.from({ length: count }, (_, i) => {
    const [title, activity_type, location] = TITLES[i % TITLES.length];
    return {
      created_by: createdBy,
      title,
      activity_type,
      location,
      // All three in turn, so the calendar shows every dot.
      reservation_status: ["confirmed", "pending", "not_sent"][i % 3],
      description: `Sintetički zapis za testiranje kalendara. ${MARKER}`,
      target_audience: "Svi zainteresirani",
      status: "approved",
      ...slot(i, direction),
    };
  });
}

if (process.argv.includes("--clean")) {
  const removed = await sql`
    DELETE FROM activities
    WHERE description LIKE ${`%${MARKER}%`}
    RETURNING id
  `;
  console.log(`removed ${removed.length} seeded activities`);
  await sql.end();
  process.exit(0);
}

const [profile] = await sql`
  SELECT id, email FROM profiles ORDER BY created_at ASC LIMIT 1
`;
if (!profile) {
  await sql.end();
  throw new Error("No profiles yet — register an account first.");
}

const data = await sql`
  INSERT INTO activities ${sql([
    ...rows(PAST, -1, profile.id),
    ...rows(UPCOMING, 1, profile.id),
  ])}
  RETURNING id
`;
await sql.end();

console.log(
  `inserted ${data.length} approved activities (${PAST} past, ${UPCOMING} upcoming) as ${profile.email}`
);
console.log("remove them again with: node scripts/seed-activities.mjs --clean");
