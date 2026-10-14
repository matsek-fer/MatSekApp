---
id: topology
title: Metric spaces & topology
category: classical
tagline: Geometry with the distances removed — what stays true when you can stretch and bend but not cut or glue.
prerequisites: [real-analysis, logic-sets]
status: draft
---

## Pitch

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

1. **The seven bridges of Königsberg.** A river, two islands, seven bridges.
   Can you take a walk that crosses every bridge exactly once? Euler proved
   you cannot — and his proof uses no distances, no angles, no shapes, only
   what is connected to what. It was the first topological argument, and the
   same reasoning now routes your network traffic.
2. **A mug is a doughnut.** You can deform a coffee mug into a doughnut
   (torus) without cutting or gluing. You cannot do that to a sphere. Everyone
   believes the second claim; nobody can prove it by trying deformations,
   because there are infinitely many. You need to find *something you can
   count* that deformation never changes. Finding it is the subject.
3. **The hairy ball.** Cover a sphere in hairs and try to comb them all flat;
   there is always a cowlick. Do the same on a doughnut and you succeed. One
   consequence: at any moment, somewhere on Earth the horizontal wind speed is
   exactly zero. Why does the shape of the surface force this, with no
   physics involved?

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
  simplicial homology and knots. The book that makes pitch problems 2 and 3
  into theorems you can follow.
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

### MatSek topology script
- **Link:** *(to be hosted — PDF pending)*
- **Type:** notes
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** The club's own lecture script for the topic; will be the
  primary reference for MatSek sessions.
- **Weaknesses:** —

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

## Matsek originals (to design)

- **Königsberg to graphs** — Euler's argument, then what "topological"
  means. Resolves pitch problem 1; joint with `combinatorics`.
- **Why a sphere is not a torus** — Euler characteristic by triangulation,
  invariance sketched, classification of surfaces stated. Resolves pitch
  problem 2.
- **Hairy ball and the wind** — vector fields, degree, Brouwer; the Earth
  consequence. Resolves pitch problem 3.
- **Compactness across topics** — the same concept in `real-analysis`,
  here, and in `advanced-analysis`; five equivalent forms and when each is
  used.
- **Topology script** — the PDF to be hosted, with session plan.
