---
id: analysis
title: Analysis
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
  functions. This is non-negotiable — analysis is where quantifier juggling
  becomes serious.
- **Computational calculus** (high school / first semester): you should be
  able to differentiate and integrate mechanically so that the rigour has
  something to attach to. Not strictly needed, but it makes the motivation
  land.
- No linear algebra needed for single-variable analysis; it becomes necessary
  for the multivariable part (`linear-algebra`).

## Materials

### 3Blue1Brown — Essence of Calculus
- **Link:** https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr
- **Type:** video
- **Difficulty:** 1
- **Free:** yes
- **Strengths:** Best visual intuition for derivatives, integrals, limits and
  Taylor series anywhere. Twelve short videos; zero prerequisites. Ideal for
  someone who has never seen calculus or has only memorised it.
- **Weaknesses:** Not analysis — no proofs, no ε–δ, no construction of ℝ. A
  motivation layer only.

### Jay Cummings — Real Analysis: A Long-Form Mathematics Textbook
- **Link:** https://longformmath.com/
- **Type:** book
- **Difficulty:** 1-2
- **Free:** no (cheap, ~$16; selected solutions free on the site)
- **Strengths:** The gentlest serious introduction. Every proof comes with
  scratch work and commentary showing *how you would find it*. Explicitly
  written for self-study; funny; excellent appendix of pathological examples.
- **Weaknesses:** Slow; stops at single-variable. A reader who already knows
  how to prove things will find it verbose.

### Stephen Abbott — Understanding Analysis
- **Link:** https://link.springer.com/book/10.1007/978-1-4939-2712-8
- **Type:** book
- **Difficulty:** 2
- **Free:** no (often available via university Springer access)
- **Strengths:** The standard "first analysis book" recommendation for good
  reason: every chapter opens with a motivating problem (the rearrangement
  paradox, the Cantor set, a nowhere-differentiable function), then develops
  exactly the theory needed. Exercises are well chosen and doable.
- **Weaknesses:** Single-variable only; no metric spaces beyond a taste;
  stops before Lebesgue integration. You will need a second book.

### Jiří Lebl — Basic Analysis: Introduction to Real Analysis (Vol. I & II)
- **Link:** https://www.jirka.org/ra/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (CC BY-NC-SA, PDF + web)
- **Strengths:** Free, actively maintained, clean. Volume I is a complete
  one-semester real analysis course including metric spaces; Volume II does
  multivariable analysis (differentiation, inverse/implicit function theorems,
  Riemann integral in ℝⁿ, path integrals). Good exercise sets.
- **Weaknesses:** Less motivation and fewer "why" discussions than Abbott or
  Cummings; a bit dry for a first encounter.

### Francis Su — Real Analysis lectures (Harvey Mudd, 2010)
- **Link:** https://www.youtube.com/playlist?list=PL0E754696F72137EC
- **Type:** video
- **Difficulty:** 2
- **Free:** yes
- **Strengths:** 26 full lectures by one of the best expositors in the US,
  following Rudin's chapters 1–3 but with far more intuition. Starts from
  constructing ℚ and ℝ. Great companion to Rudin or Abbott.
- **Weaknesses:** Blackboard video from 2010 — low resolution, hard to read.
  Ends at series; no differentiation or integration.

### MIT OCW 18.100A — Real Analysis (Casey Rodriguez, Fall 2020)
- **Link:** https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/
- **Type:** course
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** A complete modern course — videos, notes, problem sets, exams
  — covering sequences, series, continuity, derivative, Riemann integral,
  sequences of functions, interchange of limits. Follows Lebl's book, so the
  two pair perfectly.
- **Weaknesses:** Lecture-paced; some find Rodriguez's delivery terse. No
  solutions to problem sets.

### The Bright Side of Mathematics — Real Analysis series
- **Link:** https://www.classcentral.com/course/youtube-real-analysis-91894
- **Type:** video
- **Difficulty:** 2
- **Free:** yes (YouTube; the Class Central page indexes the 64 parts)
- **Strengths:** Short (10-minute) focused videos, one concept each, with
  clean handwritten slides. Good for reviewing a single definition or theorem
  (Bolzano–Weierstrass, Heine–Borel, uniform continuity) without committing
  to an hour-long lecture.
- **Weaknesses:** Breadth over depth — not enough exercises; you cannot learn
  analysis from this alone.

### Terence Tao — Analysis I & II
- **Link:** https://terrytao.wordpress.com/books/analysis-i/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no (Springer/Hindustan Book Agency; errata and sample chapters on
  Tao's site)
- **Strengths:** Builds everything — the natural numbers, integers, rationals,
  reals — from scratch, with every step as an exercise. The most honest book
  about *what is being assumed*. Volume II covers metric spaces, uniform
  convergence, power series, Fourier series, multivariable differentiation,
  Lebesgue measure and integration.
- **Weaknesses:** Very slow start (a hundred pages before you get to ℝ). Some
  readers find the foundational chapters tedious; others find them the point.

### Michael Spivak — Calculus
- **Link:** https://en.wikipedia.org/wiki/Calculus_(book)
- **Type:** book
- **Difficulty:** 2
- **Free:** no
- **Strengths:** "Calculus" in name only — it is a rigorous single-variable
  analysis book with legendary problems, many of which are small theorems. The
  best bridge from high-school calculus to proof-based mathematics. Ends with
  the construction of ℝ and a chapter on complex power series.
- **Weaknesses:** Expensive; dated typography. No metric spaces, no
  multivariable. The problems can be brutal without the (separate) answer book.

### Vladimir Zorich — Mathematical Analysis I & II
- **Link:** https://link.springer.com/book/10.1007/978-3-662-48792-1
- **Type:** book
- **Difficulty:** 2-4
- **Free:** no (Springer Universitext)
- **Strengths:** The great Russian-school text: rigorous, physics-aware, rich
  in ideas. Volume I is a full first course; Volume II goes to differential
  forms on manifolds, Fourier/Laplace transforms, asymptotics, distributions.
  Many worked examples from mechanics. Arnold called it "unusually rich in
  ideas."
- **Weaknesses:** Long (1200+ pages across both volumes). Occasional
  translation awkwardness. Not a book to finish; a book to live in.

### Walter Rudin — Principles of Mathematical Analysis ("Baby Rudin")
- **Link:** https://en.wikipedia.org/wiki/Principles_of_Mathematical_Analysis
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** The canonical reference; terse, elegant, complete. Chapters
  2 (topology of metric spaces), 7 (uniform convergence) and 9 (functions of
  several variables) are classics. The exercises are superb and define what
  "knowing analysis" means for a generation of mathematicians.
- **Weaknesses:** Teaches nothing about how to *find* proofs; zero motivation.
  Terrible as a first book, excellent as a second. Chapters 10–11 (forms,
  Lebesgue) are widely considered weak.

### Charles Pugh — Real Mathematical Analysis
- **Link:** https://link.springer.com/book/10.1007/978-3-319-17771-7
- **Type:** book
- **Difficulty:** 3
- **Free:** no (Springer UTM)
- **Strengths:** Rudin's coverage with Rudin's rigour but with pictures,
  intuition and 500+ exercises ranging from routine to very hard. Excellent
  chapters on multivariable calculus and on Lebesgue theory via the geometric
  (undergraph) approach. The best single book for someone who finds Rudin
  cold but wants the same destination.
- **Weaknesses:** Idiosyncratic notation in places; the Lebesgue chapter's
  approach is non-standard and will not match graduate courses.

### Hubbard & Hubbard — Vector Calculus, Linear Algebra, and Differential Forms
- **Link:** https://matrixeditions.com/UnifiedApproach5thEd.html
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The best way to learn multivariable analysis properly:
  unifies linear algebra and calculus, proves the inverse function theorem
  via Newton's method and Kantorovich, builds differential forms honestly,
  and ends with the generalised Stokes theorem. Full of worked examples.
- **Weaknesses:** Huge; pace uneven; the hardest proofs are moved to an
  appendix which some readers skip to their detriment.

### Evan Chen — An Infinitely Large Napkin (analysis chapters)
- **Link:** https://web.evanchen.cc/napkin.html
- **Type:** notes
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** The "what is this field *about*" view in 20-page chapters:
  metric and topological spaces, compactness, calculus in the abstract, a
  tour of measure theory and Lebesgue integration. Perfect for seeing the
  shape of the subject before (or after) a course drowns you in detail.
- **Weaknesses:** Deliberately incomplete — proofs are sketched or omitted,
  exercises few. A map, not the territory.

### Tristan Needham — Visual Complex Analysis
- **Link:** https://global.oup.com/academic/product/visual-complex-analysis-9780198534464
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** Complex analysis entirely through geometry — amplitwists,
  conformal maps, the Riemann sphere, winding numbers. Builds intuition no
  other book does and makes the "unreasonable niceness" of holomorphic
  functions feel inevitable.
- **Weaknesses:** Not rigorous enough to replace a standard course; long and
  discursive. Pair with Stein–Shakarchi Vol. II or Ahlfors.

### Stein & Shakarchi — Princeton Lectures in Analysis (I–IV)
- **Link:** https://press.princeton.edu/series/princeton-lectures-in-analysis
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no
- **Strengths:** Four volumes (Fourier, Complex, Real/Measure, Functional)
  that treat analysis as one subject rather than four. Strong on
  applications (Dirichlet's theorem on primes via Fourier analysis, the
  isoperimetric inequality, PDE). Excellent problems, including research-
  flavoured ones.
- **Weaknesses:** Assumes a solid first course (Abbott/Rudin level). Uneven:
  Vol. I is gentle, Vol. III is dense, Vol. IV is a grab bag.

### Sheldon Axler — Measure, Integration & Real Analysis
- **Link:** https://measure.axler.net/
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes (Springer Open Access, GTM 282)
- **Strengths:** Free, beautifully typeset, very carefully written first
  graduate text: Lebesgue measure, abstract measure, product measures,
  Banach/Hilbert/Lᵖ spaces, Fourier analysis, probability measures. Axler
  never skips a step. Comes with a free review of undergraduate analysis.
- **Weaknesses:** Slow and somewhat conservative; little on applications or
  on why measure theory is the right framework. Less material than Folland.

### Terence Tao — An Introduction to Measure Theory
- **Link:** https://terrytao.wordpress.com/books/an-introduction-to-measure-theory/
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (author's PDF draft on the linked page; AMS GSM 126 in print)
- **Strengths:** The best *explanations* of measure theory: starts with
  Jordan measure and shows exactly what goes wrong, motivates every
  construction, and the exercises are an integrated part of the text. The
  Lebesgue differentiation theorem chapter is a model of exposition.
- **Weaknesses:** Assumes a strong undergraduate background; moves fast
  after the first chapter. Companion blog notes (245A) are needed for some
  topics.

### Terence Tao — 245A/245B/245C blog notes
- **Link:** https://terrytao.wordpress.com/category/teaching/245a-real-analysis/
- **Type:** notes
- **Difficulty:** 4-5
- **Free:** yes
- **Strengths:** UCLA graduate real analysis as taught by Tao: measure theory,
  functional analysis, distributions, Fourier analysis, Sobolev spaces, with
  extensive side remarks connecting to PDE and harmonic analysis. The comment
  threads contain corrections and expansions by readers.
- **Weaknesses:** Blog format — long, not linear, no index. For someone who
  already knows the subject and wants to see how a master thinks about it.

### Gerald Folland — Real Analysis: Modern Techniques and Their Applications
- **Link:** https://www.wiley.com/en-us/Real+Analysis%3A+Modern+Techniques+and+Their+Applications%2C+2nd+Edition-p-9780471317166
- **Type:** book
- **Difficulty:** 4
- **Free:** no
- **Strengths:** The standard graduate reference: measure and integration,
  point-set topology, elements of functional analysis, Lᵖ spaces, Radon
  measures, Fourier analysis, distributions, Hausdorff measure. Encyclopaedic
  yet readable; chapters 1–3 and 5–8 are a complete qualifying-exam syllabus.
- **Weaknesses:** Terse; exercises range from routine to unreasonably hard
  with no indication which is which. Not a book to learn from alone.

### Gelbaum & Olmsted — Counterexamples in Analysis
- **Link:** https://store.doverpublications.com/products/9780486428758
- **Type:** book
- **Difficulty:** 2-4
- **Free:** no (cheap Dover)
- **Strengths:** Hundreds of carefully explained pathological examples: a
  function continuous at exactly one point, a sequence converging in every
  Lᵖ but pointwise nowhere, a nowhere-differentiable continuous function,
  non-measurable sets. The fastest way to understand *why* every hypothesis
  in a theorem is there.
- **Weaknesses:** Reference, not narrative; dated notation. You need to
  already know the theorems the counterexamples are breaking.

### Kaczor & Nowak — Problems in Mathematical Analysis I–III
- **Link:** https://bookstore.ams.org/stml-4
- **Type:** problems
- **Difficulty:** 2-4
- **Free:** no (AMS Student Mathematical Library)
- **Strengths:** ~1500 problems *with full solutions*: Vol. I sequences and
  series, Vol. II continuity and differentiation, Vol. III integration. The
  best way to actually get fluent after reading a textbook.
- **Weaknesses:** Pure drill; no theory. The hardest problems are olympiad-
  style rather than "research-style."

### Pólya & Szegő — Problems and Theorems in Analysis I & II
- **Link:** https://link.springer.com/book/10.1007/978-3-642-61983-0
- **Type:** problems
- **Difficulty:** 4-5
- **Free:** no
- **Strengths:** The legendary 1925 problem collection. Problems are arranged
  so that solving them in order *teaches* you a theory (series, integration,
  complex analysis, zeros of polynomials, number theory). Still used by
  researchers.
- **Weaknesses:** Very hard; old-fashioned notation; solutions terse. For
  people who already love the subject.

### Elliott Lieb & Michael Loss — Analysis
- **Link:** https://bookstore.ams.org/gsm-14
- **Type:** book
- **Difficulty:** 4-5
- **Free:** no (AMS GSM 14)
- **Strengths:** Analysis as a physicist-mathematician actually uses it:
  measure theory in a chapter, then straight to Lᵖ spaces, Fourier transform,
  distributions, Sobolev inequalities, potential theory, and the calculus of
  variations, with real applications (Thomas–Fermi, stability of matter).
- **Weaknesses:** Fast and selective; not a first measure-theory book.
  Assumes comfort with inequalities and willingness to fill gaps.

### Real Not Complex — curated free analysis resources
- **Link:** https://realnotcomplex.com/
- **Type:** site
- **Difficulty:** 1-5
- **Free:** yes
- **Strengths:** A hand-curated index of legally free textbooks and lecture
  notes for every mathematical field, with short reviews. The analysis page
  alone lists dozens of options, including many excellent course notes not
  mentioned here.
- **Weaknesses:** An index, not a path; quality of the listed items varies and
  the reviews are brief.

## Matsek originals (to design)

- **"What is a real number?"** — one session, four constructions (Dedekind
  cuts, Cauchy sequences, decimal expansions, axiomatic), ending with why they
  are "the same." Resolves pitch problem 1.
- **ε–δ bootcamp** — a graded problem sheet that trains quantifier juggling:
  write the definition, negate it, prove it, break it. Ten problems, full
  solutions, common-mistake annotations.
- **Compactness: five definitions, one idea** — sequential, open-cover,
  closed-and-bounded, finite-intersection, complete-and-totally-bounded;
  when each is the right one to use.
- **Which limits commute?** — a one-page cheat sheet of interchange theorems
  (limit/integral, limit/derivative, sum/integral, double limits) with the
  minimal counterexample for each failure. Resolves pitch problem 3.
- **The pathological zoo** — a guided tour of 8 counterexamples (Weierstrass
  function, Cantor set, Thomae's function, Dirichlet's function, a space-
  filling curve, …) with pictures and what theorem each one breaks.
- **Riemann → Lebesgue: why change the integral?** — the three failures of the
  Riemann integral and how measure fixes each one. Bridge to `probability`.
- **Analysis reading path** — a flowchart over the materials above:
  "never seen proofs" → "know calculus" → "want graduate level," with time
  estimates.
