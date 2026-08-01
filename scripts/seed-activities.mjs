/**
 * Seeds the activities table with enough approved events, before and after
 * today, to exercise the calendar's preview-and-expand behaviour.
 *
 *   node scripts/seed-activities.mjs           # insert
 *   node scripts/seed-activities.mjs --clean   # remove exactly what it inserted
 *
 * Every seeded row carries MARKER in its description, which is what --clean
 * matches on, so it can never take a real activity with it. Uses the service
 * role key: seeded rows are approved, and approving is an admin's to do.
 */
import { createClient } from "@supabase/supabase-js";
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

const db = createClient(
  env("NEXT_PUBLIC_SUPABASE_URL"),
  env("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);

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
      description: `Sintetički zapis za testiranje kalendara. ${MARKER}`,
      target_audience: "Svi zainteresirani",
      status: "approved",
      ...slot(i, direction),
    };
  });
}

if (process.argv.includes("--clean")) {
  const { data, error } = await db
    .from("activities")
    .delete()
    .like("description", `%${MARKER}%`)
    .select("id");
  if (error) throw error;
  console.log(`removed ${data.length} seeded activities`);
  process.exit(0);
}

const { data: profile, error: profileError } = await db
  .from("profiles")
  .select("id,email")
  .order("created_at", { ascending: true })
  .limit(1)
  .single();
if (profileError) throw profileError;

const { data, error } = await db
  .from("activities")
  .insert([
    ...rows(PAST, -1, profile.id),
    ...rows(UPCOMING, 1, profile.id),
  ])
  .select("id");
if (error) throw error;

console.log(
  `inserted ${data.length} approved activities (${PAST} past, ${UPCOMING} upcoming) as ${profile.email}`
);
console.log("remove them again with: node scripts/seed-activities.mjs --clean");
