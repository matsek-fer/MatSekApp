---
id: real-analysis
title: Real analysis
category: classical
tagline: The mathematics of limits — what "infinitely close" actually means, and why calculus works.
prerequisites: [logic-sets]
status: draft
---

## Pitch

You already know calculus works: derivatives give slopes, integrals give areas,
infinite series give π. Analysis asks the uncomfortable question — *why?* What
is a real number, really? What does it mean for an infinite process to
"converge"? When is it legal to swap two limits, differentiate under an
integral, or rearrange an infinite sum?

The answers are not pedantry. Getting them wrong produces real paradoxes
(series that sum to any number you like, curves that are continuous everywhere
and smooth nowhere), and getting them right gives you a toolkit — ε–δ,
compactness, uniform convergence, completeness — that reappears in every field
of mathematics and in every serious piece of physics, probability, numerics and
machine learning.

Analysis is where most people learn to *prove* things for the first time. It is
hard in a specific way: the definitions are short, but using them requires you
to hold several quantifiers in your head at once. Once that clicks, nothing in
mathematics looks the same.

## Pitch problems

1. **Is 0.999… really equal to 1?** Most people have an opinion. Few can say
   what an infinite decimal *is*. Analysis gives a definition, and then the
   answer (yes) is a two-line proof — and the question "what is a real number"
   turns out to have several non-obvious answers.
2. **The rearranged series.** Take 1 − 1/2 + 1/3 − 1/4 + ⋯. It sums to ln 2.
   Now shuffle the terms: use the same numbers, each exactly once, in a
   different order. You can make the sum equal 7. Or 0. Or −1000. Or make it
   diverge. Why does addition stop being commutative?
3. **The staircase that never becomes a line.** Approximate the diagonal of a
   unit square by a staircase of n steps. Each staircase has length 2. As
   n → ∞ the staircase visibly becomes the diagonal, which has length √2. So
   2 = √2? The resolution — which kinds of convergence preserve which
   quantities — is the whole subject in miniature.

## Prerequisites

- **Proofs, sets, logic** (`logic-sets`): quantifiers (∀, ∃ and their
  negation), proof by contradiction, induction, basic set notation and
  functions. Non-negotiable — analysis is where quantifier juggling becomes
  serious.
- **Computational calculus** (high school / first semester): being able to
  differentiate and integrate mechanically gives the rigour something to
  attach to. Not strictly needed, but it makes the motivation land.
- Linear algebra is not needed for single-variable analysis; it becomes
  necessary for the multivariable part (`linear-algebra`).

## From the general materials

- **3Blue1Brown — Essence of Calculus** (diff 1): watch first if calculus is
  new or only memorised; pure motivation, no proofs.
- **Michael Penn — Real Analysis playlist** (diff 2): a full lecture course
  following a standard syllabus; good for seeing proofs done live.
- **Napkin** (diff 2-3): chapters on metric and topological spaces,
  compactness, and the measure-theory tour — read for the shape of the
  subject before or after a course.
- **Princeton Companion** (diff 2-3): essays "The Riemann integral",
  "Measures", "Limits", and the "Analysis" branch overview.
- **Real Not Complex → Analysis**: free alternatives to everything below.

## Materials

### Terence Tao — Analysis I
- **Link:** https://terrytao.wordpress.com/books/analysis-i/
- **Type:** book
- **Difficulty:** 2
- **Free:** no (Springer / Hindustan Book Agency; errata on the linked page)
- **Strengths:** Builds everything — ℕ, ℤ, ℚ, ℝ — from scratch, then
  sequences, series, continuity, differentiation and the Riemann integral,
  with every step an exercise. The most honest book about *what is being
  assumed*, and the best place to learn how a definition is actually used.
- **Weaknesses:** Very slow start (a hundred pages before ℝ exists). Few
  pictures, little historical motivation.

### Terence Tao — Analysis II
- **Link:** https://terrytao.wordpress.com/books/analysis-ii/
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** Continues seamlessly: metric spaces, uniform convergence,
  power and Fourier series, several-variable differentiation, and a
  self-contained introduction to Lebesgue measure and integration. Same
  exercise-driven style.
- **Weaknesses:** The multivariable and Lebesgue chapters are brief; you will
  want the measure theory book (below) or Lebl II for depth.

### Terence Tao — An Introduction to Measure Theory
- **Link:** https://terrytao.wordpress.com/books/an-introduction-to-measure-theory/
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (author's PDF draft on the linked page; AMS GSM 126 in print)
- **Strengths:** Starts with Jordan measure and shows exactly what goes wrong,
  motivates every construction, integrates the exercises into the text. The
  Lebesgue differentiation theorem chapter is a model of exposition. Natural
  bridge to `probability`.
- **Weaknesses:** Assumes a strong undergraduate course; moves fast after the
  first chapter.

### Jiří Lebl — Basic Analysis: Introduction to Real Analysis (Vol. I & II)
- **Link:** https://www.jirka.org/ra/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (CC BY-NC-SA; PDF and web versions)
- **Strengths:** The free alternative to Tao I/II. Volume I is a complete
  one-semester course including metric spaces; Volume II does multivariable
  analysis properly (inverse/implicit function theorems, Riemann integral in
  ℝⁿ, path integrals). Clean, actively maintained, good exercise sets. MIT's
  OCW 18.100A course follows it.
- **Weaknesses:** Drier than Tao — fewer "why" discussions; no solutions to
  exercises.

## Problem books

### Kaczor & Nowak — Problems in Mathematical Analysis I–III
- **Link:** https://bookstore.ams.org/stml-4
- **Type:** problems
- **Difficulty:** 2-4
- **Free:** no (AMS Student Mathematical Library 4, 12, 21)
- **Strengths:** ~1500 proof-based problems *with full solutions*: I sequences
  and series, II continuity and differentiation, III integration. The best
  way to become fluent after reading a textbook.
- **Weaknesses:** Pure drill, no theory; the hardest problems lean olympiad
  rather than research.

### Demidovich — Problems in Mathematical Analysis
- **Link:** https://mirtitles.org/2013/03/15/problems-in-mathematical-analysis-demidovich/
- **Type:** problems
- **Difficulty:** 2-3
- **Free:** yes (Mir Publishers, legally archived)
- **Strengths:** ~3000 problems with answers covering the whole first-year
  syllabus; the classic Soviet drill book. Excellent for building raw skill
  with limits, series, integrals and series of functions.
- **Weaknesses:** Mostly computational, not proof-based; answers without
  solutions; dated notation.

## Matsek originals (to design)

- **"What is a real number?"** — four constructions (Dedekind cuts, Cauchy
  sequences, decimals, axioms) and why they are "the same". Resolves pitch
  problem 1.
- **ε–δ bootcamp** — a graded sheet that trains quantifier juggling: write
  the definition, negate it, prove it, break it.
- **Which limits commute?** — one-page cheat sheet of interchange theorems
  with the minimal counterexample for each failure. Resolves pitch problem 3.
- **Riemann → Lebesgue: why change the integral?** — the three failures of
  the Riemann integral and how measure fixes each; bridge to `probability`.
