---
id: applied-category-theory
title: Applied category theory
category: language
tagline: Category theory as a modelling language — for chemistry, databases, probability, systems and knowledge.
prerequisites: [category-theory-intro, compositionality, probability]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

For most of its history category theory organised mathematics. Since about
2010 a community has been using it to organise *everything else*: chemical
reaction networks, relational databases, probabilistic reasoning, electrical
and control systems, natural language, resource accounting, knowledge
representation. The bet is that the two things category theory is best at —
saying precisely how parts compose, and translating faithfully between
different descriptions of the same thing (functors) — are exactly what applied
modelling lacks.

The results so far are real. Database schemas are categories and data
migration is a triple of adjoint functors, which told database theorists
things they did not know. Reaction networks are Petri nets, and gluing them
along shared species is a pushout, which gives compositional simulators.
Probability theory can be developed without measure theory from the axioms of
a Markov category, in which conditional independence is a statement about
diagrams. Quantum non-locality is the failure of local probability tables to
glue into a global one — a sheaf condition.

This topic is where the language of parts 02 meets the fields of part 01 and
the world outside mathematics. It is also young: the open problems are
accessible, and a student with one semester of category theory can read the
current papers.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Chameleons.** On an island live 13 red, 15 green and 17 blue chameleons.
   Whenever two of different colours meet, both turn into the third colour.
   Can all chameleons end up the same colour? What if there were 13, 15 and
   18? Find and prove the exact criterion for which triples it is possible.

   <details><summary>Hint 1</summary>
   Look at the differences between the colour counts modulo 3.
   </details>
   <details><summary>Hint 2</summary>
   For a possible triple, first make two counts equal, then annihilate them.
   </details>
   <details><summary>Hint 3</summary>
   This is a reaction network. Conserved quantities and reachability are
   what open Petri nets (Baez–Master) make compositional.
   </details>

2. **Round trips between databases.** School A keeps one table with columns
   Student, Course, Grade. School B keeps three tables: Students, Courses,
   and Enrolments (student, course, grade). (a) Give a translation A → B and
   a translation B → A. (b) Show that A → B → A always returns the original
   table. (c) Find exactly which B-databases are returned unchanged by
   B → A → B.

   <details><summary>Hint 1</summary>
   B separates things from relationships between them; A is their join.
   </details>
   <details><summary>Hint 2</summary>
   B → A → B forgets every student and every course that has no enrolment.
   </details>
   <details><summary>Hint 3</summary>
   The two translations are the Σ and Δ of functorial data migration
   (Spivak); the round-trip conditions are the unit and counit of an
   adjunction.
   </details>

3. **Marginals without a joint.** A *joint distribution* for (X, Y) is a
   table of probabilities for every combination of values; its *marginal*
   for X is obtained by summing over Y. (a) Given a distribution for X and
   one for Y, construct a joint distribution for (X, Y) with those
   marginals. (b) Now you are given joint distributions for each pair
   (X, Y), (Y, Z), (Z, X), *consistent on overlaps*: the two tables that
   involve X have the same marginal for X, and likewise for Y and Z. Find an
   example where no distribution for (X, Y, Z) has all three as its
   marginals. (c) Draw a graph with one vertex per variable and one edge per
   given pairwise distribution. For which graphs does a consistent family of
   pairwise distributions *always* extend to a joint?

   <details><summary>Hint 1</summary>
   (a) Independence works.
   </details>
   <details><summary>Hint 2</summary>
   (b) Three coins, each pair always showing opposite faces.
   </details>
   <details><summary>Hint 3</summary>
   (c) Exactly the graphs without cycles (Vorob'ev). Local data that
   cannot be glued into global data is the sheaf-theoretic definition of
   contextuality (Abramsky–Brandenburger); the Bell game in
   `compositionality` is its quantum instance.
   </details>

## Prerequisites

- **Category theory** (`category-theory-intro`) and **compositionality**
  (`compositionality`): categories, functors, adjunctions, monoidal
  categories and string diagrams.
- **Probability** (`probability`), discrete part: joint distributions,
  marginals, independence — for Markov categories and problem 3.
- **Linear algebra** (`linear-algebra`) for the systems and quantum
  examples.
- A little `cs-foundations` helps with the database material.

## From the general materials

- **The Joy of Abstraction** (Cheng) — the applied and everyday examples
  scattered through the book are a gentle on-ramp to the mindset.
- **Sheafification of G** — occasional videos on sheaves and on applied
  topics.
- **Real Not Complex** — Category Theory page.
- Neither the Napkin nor the Princeton Companion covers applied category
  theory.

## Materials

### David Spivak — Category Theory for the Sciences
- **Link:** https://arxiv.org/abs/1302.6946
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (arXiv draft of the MIT Press book)
- **Strengths:** Category theory taught from scratch to scientists, with
  databases as the running example: sets and functions, ologs (knowledge
  representation as categories), categories and functors, databases as
  functors, limits and colimits as queries, a chapter on monoidal
  categories and operads. Hundreds of exercises with solutions.
- **Weaknesses:** Slow for mathematicians; the database framing is not to
  everyone's taste; stops short of the current literature.

### Fong & Spivak — Seven Sketches in Compositionality
- **Link:** https://arxiv.org/abs/1803.05316
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** See `compositionality`. Listed here because chapters 3
  (databases), 5 (signal flow) and 6 (electric circuits via decorated
  cospans) are applied category theory proper.
- **Weaknesses:** Sketches; each application is developed only as far as
  the categorical structure it motivates.

### John Baez — Network Theory · Baez & Master — Open Petri Nets
- **Link:** https://math.ucr.edu/home/baez/networks/ ·
  https://arxiv.org/abs/1808.05415
- **Type:** notes + paper
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** The programme that made "open systems" a mathematical
  object: Petri nets, Markov processes, electrical circuits and reaction
  networks as morphisms in categories of cospans, with gluing as
  composition. The network theory pages collect a decade of expository
  blog posts; the Petri nets paper is the cleanest single entry. Problem 1
  lives here.
- **Weaknesses:** Spread over many posts and papers; notation varies
  between them.

### David Spivak — Functorial Data Migration
- **Link:** https://arxiv.org/abs/1009.1166
- **Type:** paper
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** A database schema is a category, an instance is a functor
  to Set, and a schema mapping induces three data-migration functors
  Σ ⊣ Δ ⊣ Π. Short, concrete, and the source of problem 2; the CQL
  software implements it.
- **Weaknesses:** Assumes Kan extensions; the examples are small.

### Tobias Fritz — A synthetic approach to Markov kernels, conditional independence and theorems on sufficient statistics
- **Link:** https://arxiv.org/abs/1908.07021
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** The founding paper of Markov categories: probability
  theory developed from the string-diagram axioms of copying and
  discarding, with conditional independence, Bayesian inversion and
  classical theorems of statistics proved diagrammatically. The cleanest
  example of "categorical" meaning "clearer, not more abstract".
- **Weaknesses:** Long; assumes comfort with monoidal categories; the
  measure-theoretic examples need `probability` in full.

### Abramsky & Brandenburger — The Sheaf-Theoretic Structure of Non-Locality and Contextuality
- **Link:** https://arxiv.org/abs/1102.0264
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** Bell non-locality and quantum contextuality as the failure
  of local probability tables to glue into a global one — the sheaf
  condition — with a hierarchy of strengths and a clean separation of the
  logic from the physics. Problem 3 is its first section; it connects to
  the Bell game in `compositionality`.
- **Weaknesses:** Uses presheaf language from the start; the later
  cohomological sections are specialised.

### Topos Institute · Applied Category Theory conference & Adjoint School
- **Link:** https://topos.site/ · https://www.appliedcategorytheory.org/
- **Type:** site + video
- **Difficulty:** 3-5
- **Free:** yes
- **Strengths:** The field's research institute (blog, weekly colloquium
  recordings, software such as CatColab) and its annual conference and
  summer school, whose lecture videos and reading lists are the best map of
  what is currently being done.
- **Weaknesses:** Research level; no curriculum.

## Problems

- **Spivak, CT for the Sciences** — exercises with solutions throughout;
  chapters 4–5 are a complete problem course on databases as functors.
- **Fong & Spivak** — chapter 3 (databases) and chapter 6 (circuits).
- **The pitch problems** continue: chameleons → general Petri-net
  reachability and its invariants; round trips → the third functor Π and
  when Δ has both adjoints; marginals → the Bell game and the CHSH
  inequality as a failure to glue.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Reaction networks as Petri nets** — chameleons, conserved quantities,
  reachability, then gluing two networks along a shared species.
  Resolves pitch problem 1; joint with `combinatorics`.
- **Databases are functors** — schemas as categories, instances as
  functors, Σ ⊣ Δ ⊣ Π on the school example, with CQL live. Resolves
  pitch problem 2.
- **Gluing probability tables** — the marginal problem, Vorob'ev's theorem,
  and contextuality as a sheaf condition; the Bell game revisited. Resolves
  pitch problem 3; joint with `probability`.
- **Probability without measure theory** — the axioms of a Markov category
  and three classical theorems proved with pictures (Fritz).
- **What is ACT doing now?** — a reading-group tour of one recent ACT
  conference programme.
