---
id: complex-analysis
title: Complex analysis
category: classical
tagline: Calculus over the complex numbers, where differentiability is so strong that everything becomes rigid, beautiful and computable.
prerequisites: [real-analysis]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Take the ordinary definition of a derivative and apply it to functions of a
complex variable. Nothing in the definition changes — and yet everything
changes. A function that is complex-differentiable once is automatically
differentiable infinitely often, equals its power series everywhere, is
determined by its values on any tiny arc, and cannot have a maximum inside
its domain. Real functions do none of these things. This rigidity is what
makes the subject so productive: because holomorphic functions are so
constrained, you can prove things about them with almost no work, and then
cash out the results on the real line.

The cash-out is spectacular. Real integrals that have no antiderivative are
evaluated exactly by walking around a loop in the plane. Infinite sums
collapse to residues. Every polynomial is guaranteed a root. Fluid flow
around an aircraft wing is the flow around a circle, bent by a conformal
map. And Fourier analysis, number theory, and quantum field theory all
reach for the complex plane when the real line runs out of room.

It is also the most *visual* of the analysis courses: functions become maps
of the plane to itself, and many theorems are things you can see.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Every polynomial has a root.** x⁵ − x + 1 = 0 has no rational
   solution, and there is no formula for the roots of a quintic. Yet you can
   be certain it has a complex root — and so does every polynomial of every
   degree. Gauss's first proofs ran for pages. The complex-analytic proof is
   three lines: if there were no root, 1/p(z) would be a bounded function
   on the whole plane, and such a function must be constant. Why is that one
   fact — bounded means constant — true, when it is spectacularly false for
   real functions?
2. **A real integral with no antiderivative.** ∫₀^∞ (sin x / x) dx = π/2
   exactly. No elementary antiderivative of sin x / x exists, so the
   fundamental theorem of calculus is useless. Instead you leave the real
   line, integrate around a loop in the complex plane where the function is
   nicer, and let the loop shrink back onto the real axis. Why does a detour
   through numbers that "don't exist" compute a real area?
3. **One derivative buys infinitely many.** A real function can be
   differentiable once and not twice (x|x|). A complex function that is
   differentiable once in a region is differentiable infinitely often there,
   equals its Taylor series, and is completely determined by its values on
   any short arc — change it on an arc and you change it everywhere. What is
   so special about the complex definition of a derivative?

## Prerequisites

- **Real analysis** (`real-analysis`): sequences and series, uniform
  convergence, power series, the Riemann integral along curves. Essential.
- Complex numbers from school: arithmetic, polar form, Euler's formula.
- A little topology of the plane (open sets, connectedness, simple closed
  curves) — `topology` helps but the books supply what is needed.

## From the general materials

- **Napkin** — Part on complex analysis: holomorphic functions, Cauchy's
  theorem, Laurent series and residues, with a tour of Riemann surfaces.
- **Mathemaniac** — complex analysis series: the geometry of complex
  differentiation, Cauchy's theorem and residues, visually.
- **3Blue1Brown** — videos on Euler's formula, the Riemann zeta function
  and winding numbers.
- **Princeton Companion** — essays "Holomorphic functions", "The Riemann
  mapping theorem", "The Riemann zeta function".
- **Real Not Complex** — Complex Analysis page.

## Materials

### Beck, Marchesi, Pixton & Sabalka — A First Course in Complex Analysis
- **Link:** https://matthbeck.github.io/complex.html
- **Type:** book
- **Difficulty:** 2
- **Free:** yes (CC licence; PDF)
- **Strengths:** The free standard first course: complex numbers,
  holomorphic functions, Cauchy's theorem, power series, Laurent series,
  residues and real integrals, harmonic functions. Short, clear, with
  plenty of exercises (and hints) and a sensible pace for self-study.
- **Weaknesses:** Does not reach conformal mapping in depth or the Riemann
  mapping theorem; little motivation beyond the mathematics itself.

### Petra Bonfert-Taylor — Analysis of a Complex Kind (Coursera)
- **Link:** https://www.coursera.org/learn/complex-analysis
- **Type:** course
- **Difficulty:** 1-2
- **Free:** yes (audit)
- **Strengths:** A gentle eight-week video course from Wesleyan: complex
  numbers and the Mandelbrot set, holomorphic functions, conformal maps,
  Cauchy, Laurent series and residues, with quizzes. Good as a first look or
  alongside Beck et al.
- **Weaknesses:** Light on proofs; the pace is slow for those who know real
  analysis.

### Tristan Needham — Visual Complex Analysis
- **Link:** https://global.oup.com/academic/product/visual-complex-analysis-9780198534464
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** Complex analysis entirely through geometry — amplitwists
  (the derivative as a local rotation-and-scaling), Möbius transformations,
  the Riemann sphere, winding numbers, conformal maps, with hundreds of
  figures. Builds intuition no other book does and makes the rigidity in
  pitch problem 3 feel inevitable. The 25th-anniversary edition (2023) is
  updated.
- **Weaknesses:** Deliberately not rigorous enough to be the only book;
  long and discursive. Pair with Beck et al. or Stein–Shakarchi.

### Elias Wegert — Visual Complex Functions · Complex Beauties
- **Link:** https://link.springer.com/book/10.1007/978-3-0348-0180-5 ·
  gallery: https://www.mathe.tu-freiberg.de/~wegert/
- **Type:** book + site
- **Difficulty:** 2-3
- **Free:** partial (the book is paid; the phase-portrait calendars and
  software are free)
- **Strengths:** Phase portraits — colouring the plane by the argument of
  f(z) — make zeros, poles, branch cuts and essential singularities
  visible at a glance. The book redevelops the theory with this tool; the
  free calendars are the best pictures of complex functions in existence.
- **Weaknesses:** Idiosyncratic ordering; the book is more a companion than
  a course.

### Stein & Shakarchi — Complex Analysis (Princeton Lectures in Analysis II)
- **Link:** https://press.princeton.edu/books/hardcover/9780691113852/complex-analysis
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** The rigorous course: Cauchy's theorem, meromorphic
  functions, Fourier transform via contour integration, entire functions
  (Hadamard), the Gamma and zeta functions, conformal maps and the Riemann
  mapping theorem, elliptic functions and theta functions. The exercises
  and especially the end-of-chapter "problems" are superb.
- **Weaknesses:** Assumes a solid real analysis course; little geometric
  intuition (read Needham for that).

### Lars Ahlfors — Complex Analysis
- **Link:** https://www.mheducation.com/highered/product/complex-analysis-ahlfors/M9780070006577.html
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no
- **Strengths:** The classic by a Fields medallist: concise, elegant,
  and still the cleanest treatment of the homology version of Cauchy's
  theorem, harmonic functions, normal families, and the Riemann mapping
  theorem. For a second pass, when you want to see the theory as its
  masters saw it.
- **Weaknesses:** Terse; few exercises; expensive and dated typesetting.

## Problems

- **Beck et al.** — exercises with hints at the end of each chapter; do them
  all for a first course.
- **Stein & Shakarchi** — the chapter exercises are the main drill; the
  "problems" are small research projects with references.
- **Residue calculus drill** — the classic list of real integrals and sums
  evaluated by residues (∫ dx/(1+x⁴), ∫ sin x/x, ∑ 1/n²) is in every text
  above; set yourself twenty.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Fundamental theorem of algebra, three ways** — Liouville, the argument
  principle, and a topological winding-number proof. Resolves pitch
  problem 1.
- **Residues for real integrals** — the semicircle, the keyhole, the
  rectangle: one session, six integrals. Resolves pitch problem 2.
- **Why holomorphic means rigid** — Cauchy's integral formula → infinite
  differentiability → identity theorem, with the picture of each step.
  Resolves pitch problem 3.
- **Conformal maps and the wing** — the Joukowski transform from circle to
  airfoil, with lift as a residue; joint with `dynamical-systems`.
- **Phase portraits lab** — plot a dozen functions Wegert-style and read
  off their zeros, poles and branch cuts.
