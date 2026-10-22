---
id: physics-symmetry
title: Applications in physics — Noether, topological groups, Lie algebras, gauge theory
category: advanced
tagline: Every conservation law is a symmetry, every symmetry is a group, and the groups that act continuously are Lie groups — the mathematics behind why physics looks the way it does.
prerequisites: [linear-algebra, dynamical-systems, topology, algebra-intro, representation-theory]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Energy is conserved because the laws of physics are the same tomorrow as
today. Momentum is conserved because they are the same here as there.
Angular momentum, because they do not care which way you face. Noether's
theorem (1918) makes this exact: every continuous symmetry of a physical
system produces a conserved quantity, and the correspondence is a
computation you can do by hand. Once you believe it, the question "what is
conserved?" becomes "what is the symmetry group?" — and the groups that
matter are continuous ones: rotations, Lorentz transformations, the unitary
groups of quantum mechanics.

Continuous groups are Lie groups: groups that are also smooth spaces. Their
topology has physical consequences (a 360° rotation is not the same as no
rotation, which is why electrons have spin ½), and their infinitesimal
structure — the Lie algebra — is a finite table of commutators from which
the representation theory, and so the spectrum of possible particles, can be
read. The last step is the gauge principle: demand that a symmetry hold
*independently at each point of space-time* and you are forced to introduce
a field that mediates it. For the symmetry group U(1) that field is light;
for SU(2) × U(1) and SU(3) it is the weak and strong forces. The Standard
Model is the statement that nature chose particular Lie groups.

This topic is where `linear-algebra`, `dynamical-systems`, `topology` and
`representation-theory` are used at once, and where the categorical language of
part 02 begins to earn its keep in `categorical-physics`.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **The belt trick.** Fix one end of a belt; rotate the other end by 360°
   about the belt's axis. Prove that the twist cannot be removed by moving
   the free end around in space *without rotating it* — but that a 720°
   twist can. More precisely: (a) show that SU(2), the 2 × 2 unitary
   matrices of determinant 1, is a 3-sphere; (b) construct a two-to-one
   homomorphism SU(2) → SO(3); (c) deduce that the loop of rotations by
   θ ∈ [0, 2π] about a fixed axis cannot be contracted in SO(3), while the
   same loop traversed twice can. Then do the trick with a real belt.

   <details><summary>Hint 1</summary>
   (a) Write the matrix as [[a, −b̄], [b, ā]] with |a|² + |b|² = 1.
   </details>
   <details><summary>Hint 2</summary>
   (b) Let SU(2) act by conjugation on the traceless Hermitian 2 × 2
   matrices, which form a copy of ℝ³ with the determinant as (minus) the
   squared length.
   </details>
   <details><summary>Hint 3</summary>
   (c) The kernel is {±I}, so a loop in SO(3) lifts to a path in S³ from I
   to −I; S³ is simply connected. This is why π₁(SO(3)) = ℤ/2 and why
   spin-½ exists.
   </details>

2. **Why orbits close.** A planet under the inverse-square force −k r̂/r²
   traces a closed ellipse; under almost any other central force the orbit
   precesses and never closes. (a) Show that A = p × L − mk r̂ is conserved
   for the inverse-square law and is *not* conserved for the force
   −k r̂/r^{2+ε}. (b) Show that A points along the major axis and determines
   the eccentricity. (c) Compute the Poisson brackets among the components
   of L and A and identify the Lie algebra they generate — a symmetry larger
   than rotations, invisible in space but visible in phase space.

   <details><summary>Hint 1</summary>
   (a) Differentiate A along the motion using ṗ = −k r̂/r² and
   d r̂/dt = (L × r̂)/(m r²); the r̂ term is designed to cancel the rest.
   </details>
   <details><summary>Hint 2</summary>
   (c) {Lᵢ, Lⱼ} = εᵢⱼₖ Lₖ, {Lᵢ, Aⱼ} = εᵢⱼₖ Aₖ, {Aᵢ, Aⱼ} = −2mE εᵢⱼₖ Lₖ. For
   bound orbits (E &lt; 0) rescale A to make the last bracket look like the
   first.
   </details>
   <details><summary>Hint 3</summary>
   The algebra is so(4). Quantised, the same hidden symmetry is why the
   hydrogen atom's n-th level is n²-fold degenerate.
   </details>

3. **Electromagnetism is forced.** The energy density |∂ψ|² of a complex
   field ψ on ℝ⁴ is unchanged by ψ → e^{iα}ψ for constant α. (a) Show it is
   *not* unchanged when α depends on position. (b) Introduce a vector field
   A_μ, replace ∂_μ by ∂_μ − iA_μ, and find the transformation rule for A
   that restores the invariance. (c) Find the quantities built from A and
   its first derivatives that are invariant under this rule, and show they
   depend on A only through F_{μν} = ∂_μA_ν − ∂_νA_μ. Conclude that the
   simplest invariant dynamics for A is Maxwell's.

   <details><summary>Hint 1</summary>
   (a) The derivative of e^{iα(x)} ψ produces an extra i(∂_μ α) ψ.
   </details>
   <details><summary>Hint 2</summary>
   (b) A_μ → A_μ + ∂_μ α cancels it exactly.
   </details>
   <details><summary>Hint 3</summary>
   (c) F is antisymmetric and gauge invariant; F_{μν}F^{μν} is the only
   quadratic scalar up to a total derivative and the F∧F term. The gauge
   principle: repeat the argument with SU(2) or SU(3) in place of U(1) and
   you get Yang–Mills theory.
   </details>

## Prerequisites

- **Linear algebra** (`linear-algebra`): matrix groups, eigenvalues, inner
  products, the exponential of a matrix.
- **Dynamical systems** (`dynamical-systems`): Newtonian and Lagrangian
  mechanics as systems of ODEs; Hamilton's equations help.
- **Topology** (`topology`): the fundamental group, covering spaces.
- **Algebra** (`algebra-intro`, `representation-theory`): groups,
  homomorphisms, and the representation theory of finite groups as a model
  for the continuous case.
- Multivariable calculus from `real-analysis`; no physics beyond
  first-year mechanics is assumed.

## From the general materials

- **3Blue1Brown** — the quaternion videos ("Visualizing quaternions") are
  the geometric half of pitch problem 1.
- **Mathemaniac** — episodes on Lie groups, Lie algebras and the
  exponential map.
- **Napkin** — the quantum mechanics part (Hilbert spaces, observables),
  used in Woit.
- **Princeton Companion** — essays "Lie theory", "Symmetry", "General
  relativity and the Einstein equations", "Quantum field theory".
- **Real Not Complex** — Physics and Lie theory pages.

## Materials

### John Stillwell — Naive Lie Theory
- **Link:** https://link.springer.com/book/10.1007/978-0-387-78214-0
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no (Springer UTM)
- **Strengths:** Lie groups as matrix groups, with no manifolds: SO(3) via
  quaternions, SU(2), the exponential map, Lie algebras as tangent spaces,
  simple connectedness and the belt trick, all with pictures and
  undergraduate prerequisites. The right first book, and problem 1 is its
  chapters 1–2.
- **Weaknesses:** Deliberately stops short of representation theory and of
  general (non-matrix) Lie groups.

### Brian Hall — Lie Groups, Lie Algebras, and Representations
- **Link:** https://link.springer.com/book/10.1007/978-3-319-13467-3
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (Springer GTM 222)
- **Strengths:** The standard elementary text: matrix Lie groups, the Lie
  algebra, the exponential map, the Baker–Campbell–Hausdorff formula,
  representations of SU(2) and SU(3), roots and weights, with full proofs
  and no differential geometry required until the final chapter.
- **Weaknesses:** Long; the physics motivation is implicit; general Lie
  groups appear only at the end.

### David Tong — Lecture notes (Classical Dynamics · Gauge Theory · Quantum Field Theory)
- **Link:** https://www.damtp.cam.ac.uk/user/tong/teaching.html
- **Type:** notes
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** The Cambridge lecture notes that physicists learn from:
  *Classical Dynamics* has Noether's theorem and the Runge–Lenz vector
  (problem 2); *Gauge Theory* is the gauge principle (problem 3) and its
  consequences, written for mathematicians as much as physicists;
  *Quantum Field Theory* is the standard first course. Clear, honest about
  what is and is not rigorous, with exercises.
- **Weaknesses:** Physicists' notation and standards of proof; the
  mathematics is used, not developed.

### V. I. Arnold — Mathematical Methods of Classical Mechanics
- **Link:** https://link.springer.com/book/10.1007/978-1-4757-2063-1
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (Springer GTM 60)
- **Strengths:** Mechanics as geometry: Lagrangian mechanics on manifolds,
  Noether's theorem, Hamiltonian mechanics and symplectic geometry, Lie
  groups acting on phase space, with the Kepler problem and rigid bodies
  worked in full. The book that shows what the mathematics of mechanics
  actually is.
- **Weaknesses:** Demanding; assumes manifolds; the problems are hard and
  unanswered.

### Peter Woit — Quantum Theory, Groups and Representations
- **Link:** https://www.math.columbia.edu/~woit/QM/qmbook.pdf
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes (author's PDF; Springer in print)
- **Strengths:** Quantum mechanics organised entirely around representation
  theory: Lie groups and algebras, SU(2) and spin, the Heisenberg group,
  the harmonic oscillator, the Poincaré group and its representations as
  particles, with a chapter on the hydrogen atom's SO(4) symmetry
  (problem 2 quantised). Written by a mathematician for mathematicians.
- **Weaknesses:** 600 pages; the physics is secondary to the structure;
  little on gauge theory.

### Baez & Muniain — Gauge Fields, Knots and Gravity
- **Link:** https://www.worldscientific.com/worldscibooks/10.1142/2324
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no
- **Strengths:** The mathematician's route into gauge theory: manifolds,
  differential forms and de Rham cohomology (Part I), bundles, connections,
  curvature and Yang–Mills (Part II), then Chern–Simons theory and
  gravity. Conversational, with exercises, and every piece of mathematics
  introduced for a physical reason. Problem 3 in its geometric form is the
  centre of Part II.
- **Weaknesses:** Part III (quantum gravity) is dated; the exercises have
  no solutions.

### Alexander Kirillov Jr. — An Introduction to Lie Groups and Lie Algebras
- **Link:** https://www.math.stonybrook.edu/~kirillov/mat552/liegroups.pdf
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (author's draft; Cambridge in print)
- **Strengths:** A concise graduate course: Lie groups as manifolds, the
  correspondence with Lie algebras, structure theory, root systems and the
  classification of semisimple Lie algebras, representations and the Weyl
  character formula, in 200 pages with exercises.
- **Weaknesses:** Assumes manifolds and some algebra; little physics.

## Problems

- **Stillwell** — exercises throughout, graded, with the belt trick worked.
- **Tong** — example sheets for each course on the same page.
- **Hall** — exercises per chapter; chapter 4 (SU(2), SU(3)) is the drill
  for the Lie-algebra computations.
- **The pitch problems** continue: the belt trick → Spin(n) and spinors;
  Runge–Lenz → the hydrogen spectrum from SO(4) (Woit ch. 21); the gauge
  principle → Yang–Mills for SU(2), and "why 8 gluons" (dim SU(3) = 8).

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Belt trick night** — SU(2) → SO(3) on the board, quaternions, and the
  trick with belts and coffee cups. Resolves pitch problem 1; joint with
  `topology`.
- **Noether in one session** — the theorem proved for Lagrangian systems,
  then energy, momentum, angular momentum and Runge–Lenz derived. Resolves
  pitch problem 2; joint with `dynamical-systems`.
- **The gauge principle** — from a global to a local U(1), Maxwell forced,
  then the words for SU(2) and SU(3). Resolves pitch problem 3.
- **Lie algebras from scratch** — so(3), su(2), sl(2) by hand; the
  exponential map; why they have the same algebra and different groups.
- **Reading path** — Stillwell → Hall or Woit → Tong's *Gauge Theory* →
  Baez–Muniain, with Arnold alongside for mechanics.
