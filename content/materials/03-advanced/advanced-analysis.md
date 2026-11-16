---
id: advanced-analysis
title: Advanced analysis & functional analysis
category: advanced
tagline: Analysis in infinitely many dimensions — where functions become points, operators become the objects of study, and existence is proved by abstract principle.
prerequisites: [real-analysis, linear-algebra, topology]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Linear algebra works because finite-dimensional spaces are tame: every
bounded sequence has a convergent subsequence, every linear map is a
matrix, every operator has eigenvalues. Functional analysis asks what
survives when the vectors are functions and the dimension is infinite. The
answer is: less than you hope, and more than you fear — and the gap between
the two is where most of twentieth-century analysis lives.

Three ideas organise the subject. *Completeness* — Banach and Hilbert spaces
— replaces compactness as the source of existence theorems, through the
Baire category principle and its children (uniform boundedness, open
mapping, closed graph). *Duality* — the Hahn–Banach theorem and weak
topologies — lets you prove something exists by showing nothing contradicts
it. *Spectral theory* — compact and self-adjoint operators, then unbounded
ones — turns differential equations into eigenvalue problems and is the
mathematical skeleton of quantum mechanics.

The payoff is everywhere: Fourier analysis, partial differential equations
(Sobolev spaces, weak solutions), probability (Lᵖ spaces, martingales),
numerical analysis, signal processing, and the Hilbert-space formalism that
`physics-symmetry` and the categorification of physics assume. This is also the field
where the existence of a counterexample is often proved before anyone can
write one down — a style of argument worth learning for its own sake.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **No room to converge.** In ℝⁿ every bounded sequence has a convergent
   subsequence. Show that in the space C[0, 1] of continuous functions with
   the sup norm, the closed unit ball contains a sequence with no convergent
   subsequence. Then prove that *no* infinite-dimensional normed space has a
   compact closed unit ball. Which extra condition on a bounded set of
   continuous functions restores compactness?

   <details><summary>Hint 1</summary>
   Try fₙ(x) = xⁿ, or a sequence of bumps with disjoint supports.
   </details>
   <details><summary>Hint 2</summary>
   Riesz's lemma: in a normed space, for any proper closed subspace there
   is a unit vector at distance at least ½ from it.
   </details>
   <details><summary>Hint 3</summary>
   Arzelà–Ascoli: bounded and equicontinuous.
   </details>

2. **A divergent Fourier series that nobody has to write down.** Prove that
   there exists a continuous function on the circle whose Fourier series
   diverges at 0 — without constructing one.

   <details><summary>Hint 1</summary>
   The n-th partial sum at 0 is a linear functional Sₙ on C(𝕋), and its
   norm is the L¹ norm of the Dirichlet kernel Dₙ.
   </details>
   <details><summary>Hint 2</summary>
   ‖Dₙ‖₁ grows like (4/π²) log n, so the norms are unbounded.
   </details>
   <details><summary>Hint 3</summary>
   The uniform boundedness principle (Banach–Steinhaus) turns unbounded
   norms into a single f on which Sₙf is unbounded. Existence from Baire
   category is the signature move of the subject.
   </details>

3. **ζ(2) from an integral operator.** On L²[0, 1] let
   (Tf)(x) = ∫₀¹ K(x, y) f(y) dy with K(x, y) = min(x, y) − xy.
   (a) Show that T is self-adjoint and compact. (b) Find all eigenvalues and
   eigenfunctions. (c) Using the fact that for a continuous symmetric
   positive kernel ∫₀¹ K(x, x) dx equals the sum of the eigenvalues, compute
   Σ 1/n².

   <details><summary>Hint 1</summary>
   K is the Green's function of −u″ with u(0) = u(1) = 0, so u = Tf solves
   −u″ = f.
   </details>
   <details><summary>Hint 2</summary>
   Eigenfunctions sin(nπx), eigenvalues 1/(n²π²).
   </details>
   <details><summary>Hint 3</summary>
   ∫₀¹ (x − x²) dx = 1/6. The trace identity is Mercer's theorem.
   </details>

## Prerequisites

- **Real analysis** (`real-analysis`) in full, including Lebesgue measure
  and Lᵖ spaces: this topic starts where Tao's *Measure Theory* ends.
- **Linear algebra** (`linear-algebra`): inner products, adjoints, the
  spectral theorem for symmetric matrices — the finite-dimensional case
  that everything here generalises.
- **Topology** (`topology`): metric spaces, compactness, Baire's theorem.
- `complex-analysis` is needed for spectral theory of general operators.

## From the general materials

- **Napkin** — Hilbert spaces appear in the quantum mechanics part; no
  functional analysis as such.
- **Princeton Companion** — essays "Banach spaces", "Hilbert spaces", "The
  spectral theorem", "Operator algebras", "Distributions".
- **Real Not Complex** — Analysis page (functional analysis section).
- 3Blue1Brown, Michael Penn and Mathemaniac have little here.

## Materials

### Erwin Kreyszig — Introductory Functional Analysis with Applications
- **Link:** https://www.wiley.com/en-us/Introductory+Functional+Analysis+with+Applications-p-9780471504597
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The gentlest serious introduction: metric, normed, Banach
  and Hilbert spaces, bounded operators, the fundamental theorems, spectral
  theory of compact and self-adjoint operators, with applications and many
  worked examples. Needs no measure theory. The right first book for a
  reader coming straight from `real-analysis`.
- **Weaknesses:** Avoids Lᵖ spaces beyond ℓᵖ, so the examples are thinner
  than in the others; slow for those who know some topology.

### Hunter & Nachtergaele — Applied Analysis
- **Link:** https://www.math.ucdavis.edu/~hunter/book/pdfbook.html
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (authors' PDF)
- **Strengths:** A complete course with applications in view: metric and
  Banach spaces, Hilbert spaces and Fourier series, bounded operators and
  the spectral theorem, Lebesgue integral, distributions, Sobolev spaces,
  and an introduction to PDE and the calculus of variations. Problem 1
  (Arzelà–Ascoli) and problem 3 (Green's functions as compact operators)
  are both worked.
- **Weaknesses:** Proofs are sometimes sketched; measure theory is a
  summary chapter rather than a treatment.

### Haïm Brezis — Functional Analysis, Sobolev Spaces and Partial Differential Equations
- **Link:** https://link.springer.com/book/10.1007/978-0-387-70914-7
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (Springer Universitext)
- **Strengths:** The standard graduate course: Hahn–Banach, the Baire
  theorems, weak topologies, reflexivity, Lᵖ spaces, Hilbert spaces, compact
  operators and spectral theory, then Sobolev spaces and the variational
  theory of elliptic PDE. Full solutions to a large set of problems. The
  book to work through after Kreyszig or Hunter–Nachtergaele.
- **Weaknesses:** Assumes measure theory; the PDE half is one-dimensional
  in detail and n-dimensional in outline.

### Bühler & Salamon — Functional Analysis
- **Link:** https://people.math.ethz.ch/~salamon/PREPRINTS/funcana.pdf
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (authors' PDF; AMS GSM 191 in print)
- **Strengths:** A careful second course: Banach spaces and their duals,
  the closed graph and open mapping theorems, spectral theory including
  unbounded operators, semigroups of operators, with complete proofs
  throughout. The free text to pair with Brezis.
- **Weaknesses:** Few applications; no exercises with solutions; dense.

### Terence Tao — 245B / 245C notes
- **Link:** https://terrytao.wordpress.com/category/teaching/245b-real-analysis/
- **Type:** notes
- **Difficulty:** 4-5
- **Free:** yes
- **Strengths:** See `real-analysis`. Listed here for the functional
  analysis half: Baire category and its consequences, duality and weak
  topologies, Hilbert spaces, Fourier analysis, distributions, Sobolev
  spaces — written with Tao's explanations of why each theorem has the
  shape it has. Problem 2 is worked out in the Baire category notes.
- **Weaknesses:** Blog format; assumes 245A.

### Lieb & Loss — Analysis
- **Link:** https://bookstore.ams.org/gsm-14
- **Type:** book
- **Difficulty:** 4-5
- **Free:** no (AMS GSM 14)
- **Strengths:** See `real-analysis`. Here as the analyst's working toolkit:
  Lᵖ inequalities, Fourier transform, distributions, Sobolev inequalities,
  potential theory, with the applications to mathematical physics that
  `physics-symmetry` draws on.
- **Weaknesses:** As there.

### Lawrence Evans — Partial Differential Equations
- **Link:** https://bookstore.ams.org/gsm-19
- **Type:** book
- **Difficulty:** 4
- **Free:** no (AMS GSM 19)
- **Strengths:** Where functional analysis earns its keep: Sobolev spaces,
  weak solutions, the Lax–Milgram theorem, elliptic regularity, the
  spectral theorem applied to boundary value problems, parabolic and
  hyperbolic equations, calculus of variations. The standard graduate PDE
  text, and the natural continuation of problem 3.
- **Weaknesses:** 700 pages; the functional analysis is used, not taught —
  read Brezis first.

## Problems

- **Brezis** — the problems with full solutions are the main drill.
- **Hunter & Nachtergaele** — exercises per chapter, many with hints.
- **The pitch problems** continue: compactness → the Rellich–Kondrachov
  theorem (compact embeddings of Sobolev spaces); Banach–Steinhaus → the
  open mapping and closed graph theorems as further Baire consequences;
  the Green's function → Sturm–Liouville theory and the spectral theorem
  for compact self-adjoint operators in full.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Compactness in infinite dimensions** — Riesz's lemma, the failure of
  Bolzano–Weierstrass, Arzelà–Ascoli, and why weak compactness is the
  replacement. Resolves pitch problem 1; joint with `topology`.
- **Existence by category** — Baire's theorem, uniform boundedness, the
  divergent Fourier series, and the open mapping theorem, in one session.
  Resolves pitch problem 2.
- **Green's functions as operators** — from −u″ = f to a compact
  self-adjoint operator, its spectrum, and ζ(2); then Sturm–Liouville.
  Resolves pitch problem 3; joint with `dynamical-systems`.
- **Hilbert space for quantum mechanics** — the minimum needed for
  `physics-symmetry`: self-adjoint operators, spectral theorem, Stone's
  theorem stated.
- **Reading path** — Kreyszig or Hunter–Nachtergaele → Brezis →
  Bühler–Salamon / Tao, with Evans as the destination.
