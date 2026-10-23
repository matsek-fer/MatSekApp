---
id: topology
title: Topology
category: classical
tagline: Geometry with the distances removed — what stays true when you can stretch and bend but not cut or glue.
prerequisites: [real-analysis, logic-sets]
status: draft
ai_generated: [pitch, pitch_problems]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

In analysis you learn about open sets, convergence and continuity on the real
line. Topology notices that every one of those definitions can be phrased
using only the notion of "open set", throws away the numbers, and asks what
survives. The answer is: a surprising amount. Compactness, connectedness and
continuity make sense on any space; so do theorems like "a continuous function
on a compact set attains its maximum" — and now they apply to spaces of
functions, to curves, to configuration spaces of robots, to the shapes of
data.

Then the subject turns geometric. Which shapes are "the same" if you can
deform but not tear? A mug and a doughnut are; a sphere and a doughnut are
not — and proving the *not* requires inventing invariants, numbers or groups
attached to a space that do not change under deformation. That idea, the
invariant, is the single most productive idea in 20th-century mathematics,
and topology is where it was born and where it is easiest to see.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **The seven bridges of Königsberg.** A river, two islands, seven bridges.
   Can you take a walk that crosses every bridge exactly once? Euler proved
   you cannot — and his proof uses no distances, no angles, no shapes, only
   what is connected to what. It was the first topological argument, and the
   same reasoning now routes your network traffic.
2. **Same weather on opposite sides of the Earth.** At this moment there are
   two points exactly opposite each other on the Earth's surface with the
   same temperature *and* the same air pressure. Not approximately — exactly.
   Start with the easy version: walk around the equator and show there are
   two opposite points with the same temperature (think about the difference
   between a point and its opposite as you walk halfway round). Then ask why
   adding pressure — a second quantity to match — still works on a sphere but
   would fail on a circle. The answer uses no meteorology, only the shape of
   the sphere.
3. **Cutting a Möbius strip.** Take a paper strip, give it a half twist and
   tape the ends. Predict, then cut along the centre line: you do not get two
   strips but one long one with two twists. Now cut a fresh strip one third
   of the way from the edge: two linked loops of different lengths. Predict
   what happens with a full twist, with three half twists, with cutting the
   result again. Every prediction is a theorem about one-sided surfaces, and
   you can check each with scissors.

## Prerequisites

- **Real analysis** (`real-analysis`): open and closed sets, sequences,
  continuity and compactness in ℝ. Topology abstracts exactly these; without
  the concrete case the definitions look arbitrary.
- **Sets and logic** (`logic-sets`): set operations, images and preimages,
  equivalence relations (quotient spaces are built from them).
- **Algebra** (`algebra-intro`): groups, for the fundamental group and
  anything after it.

## From the general materials

- **Napkin** — Part on topology: metric spaces, topological spaces,
  compactness, then the fundamental group, covering spaces and a tour of
  homology.
- **Mathemaniac** — videos on the fundamental group, the classification of
  surfaces and the Euler characteristic.
- **Princeton Companion** — essays "Topological spaces", "Compactness",
  "Algebraic topology", "Differential topology".
- **Real Not Complex** — Topology page.

## Materials

### Sidney Morris — Topology Without Tears
- **Link:** https://www.topologywithouttears.net/
- **Type:** book
- **Difficulty:** 2
- **Free:** yes (author's PDF, regularly updated; companion videos)
- **Strengths:** The gentlest complete point-set topology course, and free:
  topological spaces, bases, continuity, metric spaces, compactness,
  connectedness, product and quotient spaces, Tychonoff, with a chapter
  constructing the reals. Many exercises; written explicitly for self-study,
  with the author answering reader questions.
- **Weaknesses:** Point-set only; no algebraic topology. Verbose for those
  with analysis experience.

### Wilson Sutherland — Introduction to Metric and Topological Spaces
- **Link:** https://global.oup.com/academic/product/introduction-to-metric-and-topological-spaces-9780199563081
- **Type:** book
- **Difficulty:** 2
- **Free:** no (OUP; companion website with solutions is free)
- **Strengths:** The Oxford second-year text: metric spaces first, with
  analysis motivation at every step, then topological spaces, compactness,
  connectedness, completeness and the contraction mapping theorem. Short,
  clear, and the exercises have solutions online.
- **Weaknesses:** Stops exactly where it gets geometric; no quotients beyond
  a sketch, no fundamental group.

### Mark Anthony Armstrong — Basic Topology
- **Link:** https://link.springer.com/book/10.1007/978-1-4757-1793-8
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no (Springer UTM)
- **Strengths:** Topology taught geometrically: starts with Euler's theorem
  on polyhedra and the classification of surfaces as the goal, does enough
  point-set theory to get there, then the fundamental group, triangulations,
  simplicial homology and knots. The book that turns the Möbius strip of
  pitch problem 3 into the classification of surfaces.
- **Weaknesses:** Point-set chapters are brisk; some proofs are
  pictures-plus-handwaving; dated typesetting.

### John M. Lee — Introduction to Topological Manifolds
- **Link:** https://link.springer.com/book/10.1007/978-1-4419-7940-7
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (Springer GTM 202)
- **Strengths:** The next step after the above: a thorough point-set
  foundation written with manifolds in mind, then CW complexes,
  classification of surfaces, the fundamental group, covering spaces and
  an introduction to homology. Exceptionally clear writing; the standard
  preparation for differential geometry (`geometry`).
- **Weaknesses:** Long; the first half repeats what Morris/Sutherland
  covered; exercises without solutions.

### Topology script (hosted by MatSek)
- **Link:** /materials/topology/predavanje-1.pdf (lecture 1; all five lectures are listed under MatSek materials below)
- **Type:** notes
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** A rigorous course script in Croatian, five lectures so far
  (37 pages): topological and metric spaces, the separation axioms, bases,
  continuity, subspaces, Urysohn's lemma, the Tietze extension theorem,
  complete metric spaces and the Baire category theorem, with full proofs
  and worked counterexamples (the Sierpiński space, the cofinite topology,
  the Niemytzki plane). The reference for MatSek sessions on the topic.
- **Weaknesses:** Assumes the metric-spaces course (open balls and
  completeness are quoted from it); no exercise sets beyond "prove this
  yourself" remarks; point-set only, and in Croatian.

## Problems

### Steen & Seebach — Counterexamples in Topology
- **Link:** https://store.doverpublications.com/products/9780486687353
- **Type:** book
- **Difficulty:** 3
- **Free:** no (cheap Dover)
- **Strengths:** 143 spaces, each checked against ~60 properties, with a
  reference chart. The fastest way to learn what the separation axioms,
  compactness variants and connectedness variants actually distinguish, and
  the source for "is there a space that is X but not Y?"
- **Weaknesses:** Pure reference; you need to know the definitions first.

### π-Base
- **Link:** https://topology.pi-base.org/
- **Type:** site
- **Difficulty:** 2-4
- **Free:** yes
- **Strengths:** The community-maintained successor to Steen & Seebach:
  search for spaces by combinations of properties, with proofs of every
  claim and the implications between properties. Excellent for
  generating and checking your own counterexamples.
- **Weaknesses:** Point-set only; a database, not a text.

Exercises in Morris (with hints) and Sutherland (with online solutions) are
the main problem sets for the point-set part; Armstrong's for the geometric
part.

## Matsek materials

**Topology script** — the lecture script MatSek hosts for this topic, in
Croatian, one PDF per lecture. Five lectures so far:

1. [1. predavanje](/materials/topology/predavanje-1.pdf) — topological
   spaces and the topology of a metric; the separation axioms T₀ to T₄ with
   the small spaces that tell them apart (indiscrete, Sierpiński, cofinite);
   bases of a topology; normal spaces.
2. [2. predavanje](/materials/topology/predavanje-2.pdf) — every metrizable
   space is normal; second countability and separable metrizable spaces;
   characterisations of T₄; continuity in metric and topological spaces,
   checked on a base or a subbase.
3. [3. predavanje](/materials/topology/predavanje-3.pdf) — subspaces and the
   relative topology; the Euclidean topology on subsets of ℝⁿ; Urysohn's
   lemma; sums, products and compositions of continuous functions; the
   lemmas behind Tietze.
4. [4. predavanje](/materials/topology/predavanje-4.pdf) — the Tietze
   extension theorem in both forms and an example where extension fails;
   complete metric spaces: Cauchy sequences, Cantor's intersection theorem,
   and Baire's theorem for countably many open dense sets.
5. [5. predavanje](/materials/topology/predavanje-5.pdf) — nowhere dense
   sets, first and second category and the Baire category theorem; closure,
   interior and boundary; the Niemytzki plane, a regular space that is not
   normal.

> _The session ideas below are an AI-generated draft — none of them exist yet. Replace them with real MatSek materials as they are produced._

- **Königsberg to graphs** — Euler's argument, then what "topological"
  means. Resolves pitch problem 1; joint with `combinatorics`.
- **Same weather, opposite points** — the equator version by the
  intermediate value theorem, then Borsuk–Ulam on the sphere via the
  winding number, with the ham-sandwich theorem as dessert. Resolves pitch
  problem 2.
- **Scissors night** — Möbius strips, Klein bottles from paper, Euler
  characteristic by counting, orientability, the classification of surfaces
  stated. Resolves pitch problem 3.
- **Why a sphere is not a torus** — Euler characteristic by triangulation
  and why it is invariant.
- **Compactness across topics** — the same concept in `real-analysis`,
  here, and in `advanced-analysis`; five equivalent forms and when each is
  used.
- **Script sessions** — a session plan over the five lectures above, with
  the pitch problems as warm-ups and the Niemytzki plane as the finale.
