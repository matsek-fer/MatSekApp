---
id: galois-theory
title: Galois theory
category: advanced
tagline: Turn a polynomial equation into a finite group, and read off which equations can be solved, which numbers can be constructed, and why.
prerequisites: [algebra-intro, linear-algebra, complex-analysis]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

For three centuries the central problem of algebra was to solve polynomial
equations by formulas. Quadratics had one since Babylon, cubics and quartics
since the 1540s, and the quintic resisted everyone. In 1832, the night before
a duel he did not survive, the twenty-year-old Galois wrote down why. His idea
was not about formulas at all: attach to each equation the group of
symmetries of its roots, and the equation is solvable by radicals exactly when
that group can be built up from abelian pieces. The group of the general
quintic cannot, so no formula exists. The same group explains which regular
polygons can be drawn with ruler and compass, why the cube cannot be doubled,
and why the real roots of some cubics can only be written using complex
numbers.

Galois theory is where `algebra-intro` pays off: fields, groups, quotients and
homomorphisms are all used at once, and the fundamental theorem — a
dictionary between subfields and subgroups that reverses inclusions — is the
first example most people meet of the correspondences that
`category-theory-intro` later calls Galois connections. It is also still
alive: the absolute Galois group of ℚ is the central object of modern number
theory, and the Langlands programme is an attempt to understand it.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **The 17-gon.** Gauss, aged 19, showed that the regular 17-gon can be
   drawn with ruler and compass, and the 7-gon cannot. Prove both. For the
   17-gon, give the explicit tower of quadratic equations whose solution is
   cos(2π/17).

   <details><summary>Hint 1</summary>
   Let ζ = e^{2πi/17}. The symmetry group of the field ℚ(ζ) is cyclic of
   order 16, so there is a chain of subfields of degrees 1, 2, 4, 8, 16.
   </details>
   <details><summary>Hint 2</summary>
   Order the sixteen roots ζ, ζ³, ζ⁹, ζ²⁷, … by powers of a generator
   (3 generates the units mod 17) and sum them in halves, quarters, eighths:
   Gauss's periods. Each half-sum satisfies a quadratic over the previous
   level.
   </details>
   <details><summary>Hint 3</summary>
   For the 7-gon, the degree is 6 = 2 · 3, and a constructible number has
   degree a power of 2 over ℚ.
   </details>

2. **Real roots that need complex numbers.** The cubic x³ − 3x + 1 has three
   real roots. Prove that none of them can be written using only rational
   numbers, +, −, ×, ÷ and real n-th roots — every radical formula for them
   must pass through complex numbers.

   <details><summary>Hint 1</summary>
   The roots are 2cos(2π/9), 2cos(4π/9), 2cos(8π/9); the polynomial is
   irreducible over ℚ with cyclic Galois group of order 3.
   </details>
   <details><summary>Hint 2</summary>
   Suppose a root lies in a tower ℚ = K₀ ⊂ K₁ ⊂ ⋯ ⊂ Kₙ ⊂ ℝ with each step
   a real radical of prime degree. Look at the first step where the cubic
   becomes reducible and show the degree of that step must be 3 and must
   adjoin a non-real number.
   </details>
   <details><summary>Hint 3</summary>
   This is the <em>casus irreducibilis</em>: for an irreducible cubic with
   three real roots, no real-radical formula exists. The same argument
   generalises to any polynomial whose splitting field is real and whose
   Galois group has odd order.
   </details>

3. **An unsolvable quintic, and a solvable one.** (a) Prove that the roots
   of x⁵ − x − 1 cannot be expressed by radicals. (b) Find a quintic with
   rational coefficients that is irreducible and *is* solvable by radicals,
   and solve it.

   <details><summary>Hint 1</summary>
   (a) Reduce modulo 2 and modulo 5: the factorisation patterns give a
   transposition and a 5-cycle in the Galois group.
   </details>
   <details><summary>Hint 2</summary>
   A transposition and a 5-cycle generate S₅, which is not solvable since
   A₅ is simple.
   </details>
   <details><summary>Hint 3</summary>
   (b) x⁵ − 2 works; so does any irreducible quintic with cyclic Galois
   group, such as the minimal polynomial of 2cos(2π/11).
   </details>

## Prerequisites

- **Introduction to algebra** (`algebra-intro`): groups (including
  quotients, Sylow for the harder cases, solvable groups), rings, fields,
  irreducible polynomials, finite fields.
- **Linear algebra** (`linear-algebra`): field extensions as vector spaces;
  degree is dimension.
- **Complex analysis** (`complex-analysis`), lightly: roots of unity and
  the geometry of ζₙ.

## From the general materials

- **Napkin** — the Galois theory part, which covers the fundamental theorem
  and the examples in a few pages.
- **Michael Penn** — the field-extension and Galois-theory videos in the
  abstract-algebra playlist.
- **Mathemaniac** — the episode on why the quintic has no formula.
- **Princeton Companion** — essays "Galois theory", "The insolubility of
  the quintic", "Algebraic numbers".
- **Real Not Complex** — Abstract Algebra page.

## Materials

### J. S. Milne — Fields and Galois Theory
- **Link:** https://www.jmilne.org/math/CourseNotes/ft.html
- **Type:** notes
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** A complete, free course: field extensions, splitting
  fields, separability, the fundamental theorem, finite fields, cyclotomic
  fields, solvability by radicals, infinite Galois theory, transcendental
  extensions. Exercises with answers.
- **Weaknesses:** Dense; motivation and history are minimal.

### Keith Conrad — Galois theory notes
- **Link:** https://kconrad.math.uconn.edu/blurbs/
- **Type:** notes
- **Difficulty:** 2-4
- **Free:** yes
- **Strengths:** A dozen short expository notes on exactly the questions a
  course leaves open: Galois groups of cubics and quartics, the
  constructibility of the 17-gon, the casus irreducibilis, Galois groups as
  permutation groups, cyclotomic fields. Problems 1 and 2 each have their
  own note.
- **Weaknesses:** Not a linear course — read them as a companion to Milne
  or Stewart.

### Ian Stewart — Galois Theory
- **Link:** https://www.routledge.com/search?kw=Galois+Theory+Stewart
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The friendliest textbook: historical introduction, the
  classical approach over ℂ before the abstract one, ruler-and-compass
  constructions, the quintic, with many examples and exercises. The right
  first book if Milne is too terse.
- **Weaknesses:** Later editions reorganise the material and some proofs
  are deferred; slow for readers who already know fields.

### Emil Artin — Galois Theory
- **Link:** https://store.doverpublications.com/products/9780486623429
- **Type:** book
- **Difficulty:** 3
- **Free:** no (cheap Dover)
- **Strengths:** The lectures (1942) that created the modern, linear-algebra
  formulation of the subject: the fundamental theorem proved through the
  independence of characters, in eighty pages. Reading it is seeing the
  theory the way it is now taught, from its source.
- **Weaknesses:** Terse; no exercises; the notation is dated.

### David Cox — Galois Theory
- **Link:** https://www.wiley.com/en-us/Galois+Theory%2C+2nd+Edition-p-9781118072059
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no
- **Strengths:** The comprehensive text: the fundamental theorem, then
  applications in depth — cyclotomic fields and Gauss's periods, geometric
  constructions, solvability, the casus irreducibilis, finite fields,
  computing Galois groups, the Lemniscate — with extensive historical
  notes and hundreds of exercises. Problems 1–3 are all worked in it.
- **Weaknesses:** 600 pages; a reference as much as a course.

### Harold Edwards — Galois Theory
- **Link:** https://link.springer.com/book/10.1007/978-1-4612-5290-0
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (Springer GTM 101)
- **Strengths:** Galois's own approach, developed from the original memoir
  (translated in an appendix): resolvents, the Galois group as a group of
  substitutions, the solvability criterion as Galois stated it. For readers
  who want to know what Galois actually did.
- **Weaknesses:** Deliberately non-modern; hard to use as a first course.

### Dummit & Foote — Abstract Algebra, chapters 13–14
- **Link:** https://www.wiley.com/en-us/Abstract+Algebra%2C+3rd+Edition-p-9780471433347
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** See `algebra-intro`. The two Galois theory chapters are a
  self-contained course with the standard examples computed in full and a
  very large exercise set.
- **Weaknesses:** As there.

## Problems

- **Milne** — exercises per chapter, with answers.
- **Keith Conrad** — every note ends with worked examples.
- **Cox** — the exercises are the most complete set in print.
- **The pitch problems** continue: the 17-gon → Gauss's theorem on
  constructible polygons and Fermat primes; casus irreducibilis → the
  general criterion for real-radical solvability; the quintic → computing
  Galois groups by reduction modulo primes (Chebotarev) and the inverse
  Galois problem.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Gauss's 17-gon** — the cyclotomic field, Gauss periods by hand, the
  construction drawn. Resolves pitch problem 1; joint with
  `complex-analysis`.
- **Three real roots, no real formula** — the cubic, the Galois group, the
  casus irreducibilis argument. Resolves pitch problem 2.
- **Galois groups by reduction mod p** — the factorisation trick, S₅ for
  x⁵ − x − 1, and a solvable quintic solved. Resolves pitch problem 3.
- **The fundamental theorem in one session** — subfields ↔ subgroups with
  ℚ(√2, √3) and ℚ(∛2, ω) computed completely; joint with
  `category-theory-intro` (Galois connections).
