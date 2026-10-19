# MatSek Materials

A curated map of mathematics for MatSek members: what topics exist, why they are
worth your time, where to learn them, and what we plan to produce ourselves.

This directory is the single source of truth for the **Materials** page in the
app. Every topic is one Markdown file with YAML frontmatter, so the UI can parse
it without a database.

## Layout

```
content/materials/
  README.md                       # this file: schema + master topic list
  general.md                      # atlases & channels referenced from many topics
  01-classical/<topic>.md         # introductions to classical fields
  02-language/<topic>.md          # category theory, type theory, "better language"
  03-advanced/<topic>.md          # advanced / specialized / cross-field
```

## Topic file schema

```markdown
---
id: analysis                      # unique slug, used in URLs and in `prerequisites`
title: Analysis
category: classical               # classical | language | advanced
tagline: one sentence shown on the topic card
prerequisites: [proofs-logic]     # ids of other topics (may be empty)
status: draft                     # draft | reviewed
ai_generated: [pitch, pitch_problems, matsek_materials]
                                  # sections still AI-drafted; remove an entry
                                  # once a member has rewritten/signed it off.
                                  # The UI renders these with a translucent band.
---

## Pitch
> _AI-generated draft — not yet reviewed by a MatSek member._   ← while flagged

A few paragraphs. Goal: make a reader who has never heard of the topic want it.

## Pitch problems
Three problems a newcomer can *understand* and start attacking. Rules:
- No vocabulary from the field itself (no "type", "functor", "measure") —
  only school mathematics and everyday language.
- Genuine problems, olympiad-flavoured where possible, not restated
  definitions or famous open problems nobody will solve.
- At least one should be attackable with pen and paper (or scissors) before
  knowing any theory.
- State the problem briefly and never include the solution route in the
  statement. Put graded hints in collapsible blocks after each problem:
  `<details><summary>Hint 1</summary> … </details>`, first hint pointing the
  direction only, later hints more specific.

## Prerequisites
Prose version of the frontmatter list + what exactly is needed from each.

## From the general materials
Every entry of `general.md` that covers this topic, with the relevant part
named (e.g. "Napkin — Part on …", "3Blue1Brown — Essence of …"). If the
Napkin has no part on the topic, say so.

## Materials
Keep it short: a handful of core items. Where a core item is paid, name a
free alternative. Optional subsections (`## Problem books`, `## Lectures`)
may follow; every entry uses the same fields.

### <Material name>
- **Link:** <url>
- **Type:** book | notes | video | course | paper | blog | repo | site | problems
- **Difficulty:** 1 | 2 | 3 | 4 | 5 | or a range like 2-3 / 1-5
- **Free:** yes | no | partial
- **Strengths:** ...
- **Weaknesses:** ...

## Matsek materials
Materials produced by MatSek members (scripts, problem sheets, session plans),
with links once they exist. Until then the section holds AI-generated TODO
recommendations, marked by the blockquote note.
```

## Difficulty scale

| Level | Who it is for |
|---|---|
| 1 | Curious high-schooler / anyone; no proofs assumed |
| 2 | First-year undergraduate; comfortable with proofs, learning the field |
| 3 | Upper undergraduate; standard rigorous course level |
| 4 | Graduate / research-adjacent; assumes the standard course |
| 5 | Research level; papers, monographs, frontier topics |

A material can span levels (e.g. `2-4`) when it grows with the reader.

## Categories

### 01 · Introductions into classical fields of mathematics
Analysis · Linear algebra · Combinatorics · Probability (with measure) ·
Dynamical systems & differential equations · Introduction to algebra (groups,
rings, fields) · Formal systems, set theory, logic · Metric spaces & topology ·
Computer science (DSA, distributed systems, applied math, complexity theory)

### 02 · Motivation for better language
Category theory & type theory: what makes them powerful; compositionality;
categorification of classical subjects; applied category theory; category
theory applied to every field in 01 from a higher vantage point; higher
category theory; comparison with natural language and complexity of language.

### 03 · Advanced / specialized
Advanced topics in every field of 01; connecting fields; applications in
physics (Noether, topological groups, Lie algebras, gauge theory); advanced
logic (Gödel, Löb); functional analysis; geometry (Erlangen program,
categorification of geometry); CS (computability, open-source game theory,
compositional game theory, geometric & categorical deep learning); modelling
and categorification of physics.

## Master topic list

Status: ☐ not started · ◐ draft · ● reviewed

### general
- ◐ `general` — General materials (atlases, indices, YouTube channels)

### 01-classical
- ◐ `real-analysis` — Real analysis
- ◐ `complex-analysis` — Complex analysis
- ◐ `linear-algebra` — Linear algebra
- ◐ `combinatorics` — Combinatorics
- ◐ `probability` — Probability (with measure)
- ◐ `dynamical-systems` — Dynamical systems & differential equations
- ◐ `algebra-intro` — Introduction to algebra (groups, rings, fields)
- ◐ `logic-sets` — Formal systems, set theory, logic
- ◐ `topology` — Metric spaces & topology (club script PDF pending)
- ◐ `cs-foundations` — CS: DSA, distributed systems, applied math, complexity

### 02-language
- ◐ `category-theory-intro` — Category theory: motivation and first concepts
- ◐ `type-theory` — Type theory & the Curry–Howard–Lambek correspondence
- ◐ `compositionality` — Compositionality & what makes the language powerful
- ◐ `applied-category-theory` — Applied category theory
- ◐ `categorical-classical` — Classical fields seen categorically
- ◐ `higher-category-theory` — Higher category theory

### 03-advanced
- ◐ `advanced-analysis` — Advanced analysis & functional analysis
- ☐ `advanced-algebra` — Advanced algebra & representation theory
- ☐ `physics-symmetry` — Noether, topological groups, Lie algebras, gauge theory
- ☐ `advanced-logic` — Gödel, Löb, provability, reverse mathematics
- ☐ `geometry` — Erlangen program, categorification of geometry
- ☐ `computability` — Computability & complexity, advanced
- ☐ `game-theory-compositional` — Open-source & compositional game theory
- ☐ `geometric-deep-learning` — Geometric & categorical deep learning
- ☐ `categorical-physics` — Modelling & categorification of physics
- ☐ `connections` — Bridges between fields

### Deferred
- `language-and-complexity` — Natural vs formal language, complexity of
  language (removed for now; last draft is in git history, commit
  "Add language and complexity topic").

## Maintenance notes

- Links were collected without live verification from the authoring
  environment. Run a link check before the page ships.
- Prefer free, legally available sources; mark paid books honestly.
- Lists are deliberately short. Breadth lives in `general.md` (Real Not
  Complex, the Napkin, the Princeton Companion), not in topic files.
- Strengths/weaknesses are opinions — sign heavy edits in the git log.

## TODO

- UI: render sections listed in `ai_generated` with a translucent band and
  the note; drop the band when the flag is removed.
- `compositionality`: pitch problems still not final (several attempts);
  revisit with a member who knows the field.
