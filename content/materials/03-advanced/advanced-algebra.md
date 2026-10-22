---
id: advanced-algebra
title: Advanced algebra — representation theory, Galois theory, commutative & homological algebra
category: advanced
tagline: Symmetry made linear, equations made groups, and the algebra of holes — the three directions in which a first algebra course opens out.
prerequisites: [algebra-intro, linear-algebra, complex-analysis, topology]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

A first algebra course ends with three doors ajar. *Representation theory*
asks what a group looks like when it acts on a vector space, and discovers
that every finite group is encoded by a square table of complex numbers (its
character table) from which almost everything about it can be read; for
continuous groups the same idea produces the spherical harmonics, the
periodic table's orbital shapes, and the classification of elementary
particles. *Galois theory* turns a polynomial equation into a finite group and
answers, with that group, which equations can be solved by radicals, which
regular polygons can be drawn, and which numbers are constructible. *Commutative
and homological algebra* take rings and modules as the basic objects and build
the machinery — exact sequences, Ext and Tor, derived functors — that measures
"what fails to be exact", which is how holes in spaces, obstructions in
geometry and extensions of groups are all counted by the same device.

These three are the algebra that the rest of mathematics actually uses:
`physics-symmetry` is representation theory, `geometry` is commutative algebra
with pictures, and the homological language is the one in which the deepest
connections of part 03 are stated. Each is also a field where a single
well-chosen computation — a character table, a Galois group, a homology group
— answers a question that looked hopeless.

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

2. **Why orbitals come in 1, 3, 5, 7.** Rotations of ℝ³ act on polynomials
   in x, y, z by substitution. (a) Decompose the six-dimensional space of
   quadratic forms into pieces that rotations cannot mix: find the
   one-dimensional invariant piece and the five-dimensional one. (b) Show
   that the *harmonic* polynomials of degree ℓ (those with Δp = 0) form a
   space of dimension 2ℓ + 1 that rotations cannot decompose further.
   (c) Explain what this has to do with the shapes and counts of atomic
   orbitals.

   <details><summary>Hint 1</summary>
   (a) The invariant is x² + y² + z²; the trace-zero quadratics form the
   rest.
   </details>
   <details><summary>Hint 2</summary>
   (b) Harmonic polynomials of degree ℓ are the kernel of Δ from degree ℓ
   to degree ℓ − 2, and Δ is onto; count dimensions. Irreducibility: look
   at the eigenvalues of rotation about the z-axis.
   </details>
   <details><summary>Hint 3</summary>
   (c) The irreducible representations of SO(3) have dimensions 2ℓ + 1.
   The hydrogen Schrödinger operator commutes with rotations, so each energy
   level decomposes into these: s, p, d, f.
   </details>

3. **Two surfaces that look alike mod 2.** Triangulate the torus and the
   Klein bottle. Define the groups of 0-, 1- and 2-chains with integer
   coefficients and the boundary maps, and compute H₁ = ker ∂₁ / im ∂₂ for
   both. Then repeat with coefficients in ℤ/2. Explain why the two surfaces
   are indistinguishable by the second computation but not by the first, and
   what general principle governs the difference.

   <details><summary>Hint 1</summary>
   The torus has H₁ ≅ ℤ²; the Klein bottle has H₁ ≅ ℤ ⊕ ℤ/2.
   </details>
   <details><summary>Hint 2</summary>
   With ℤ/2 coefficients both have H₁ ≅ (ℤ/2)².
   </details>
   <details><summary>Hint 3</summary>
   The universal coefficient theorem:
   H₁(X; ℤ/2) ≅ H₁(X) ⊗ ℤ/2 ⊕ Tor(H₀(X), ℤ/2). Torsion in H₁ is exactly
   what ℤ/2 coefficients cannot see; Tor is the homological-algebra device
   that measures it.
   </details>

## Prerequisites

- **Introduction to algebra** (`algebra-intro`) in full: groups, rings,
  fields, quotients, the structure of finite abelian groups.
- **Linear algebra** (`linear-algebra`): eigenvalues, inner products, tensor
  products, change of basis — representation theory is linear algebra with
  a group acting.
- **Complex analysis** (`complex-analysis`), lightly: roots of unity and
  characters take complex values.
- **Topology** (`topology`): triangulated surfaces, for the homological
  examples.

## From the general materials

- **Napkin** — parts on representation theory of finite groups, Galois
  theory and algebraic number theory; the categorical viewpoint on modules.
- **Michael Penn** — the later abstract-algebra videos (field extensions,
  Galois theory).
- **Mathemaniac** — group theory series, including the representation-
  theoretic episodes.
- **Princeton Companion** — essays "Representation theory", "Galois
  theory", "Commutative algebra", "Homological algebra".
- **Real Not Complex** — Abstract Algebra page.

## Materials

### Etingof et al. — Introduction to Representation Theory
- **Link:** https://arxiv.org/abs/0901.0827
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes (arXiv; AMS Student Mathematical Library in print)
- **Strengths:** Grown from an MIT undergraduate course: representations of
  associative algebras first, then finite groups, characters, induced
  representations, the symmetric group, quivers, and a taste of Lie
  algebras. Compact, modern, with many exercises and historical notes.
- **Weaknesses:** Fast; the algebra-first approach delays the concrete
  group examples that make the subject vivid.

### Jean-Pierre Serre — Linear Representations of Finite Groups
- **Link:** https://link.springer.com/book/10.1007/978-1-4684-9458-7
- **Type:** book
- **Difficulty:** 3
- **Free:** no (Springer GTM 42)
- **Strengths:** Part I is the perfect 70-page first course: characters,
  orthogonality, induced representations, examples worked completely, with
  a chemist's eye (it was written for them). Parts II and III go on to
  Brauer theory and representations over rings.
- **Weaknesses:** Terse in Serre's way; the exercises carry much of the
  theory.

### Fulton & Harris — Representation Theory: A First Course
- **Link:** https://link.springer.com/book/10.1007/978-1-4612-0979-9
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (Springer GTM 129)
- **Strengths:** Representation theory by examples: finite groups briefly,
  then Lie algebras sl₂, sl₃, the classical groups, weights and roots,
  Weyl character formula — all discovered through explicit computation
  before being stated in general. Problem 2 is its first chapter on SO(3)
  in spirit.
- **Weaknesses:** Long and example-heavy; the general theory arrives late.

### Keith Conrad — expository notes
- **Link:** https://kconrad.math.uconn.edu/blurbs/
- **Type:** notes
- **Difficulty:** 2-4
- **Free:** yes
- **Strengths:** Dozens of short, polished notes on exactly the topics a
  course glosses over: Galois groups of cubics and quartics, the
  constructibility of the 17-gon, tensor products, characters of finite
  abelian groups, Zorn's lemma, and more. Each is self-contained and
  worked with examples. Problem 1 has its own note.
- **Weaknesses:** Not a course — a reference to be consulted when a
  specific topic needs clarifying.

### J. S. Milne — Fields and Galois Theory
- **Link:** https://www.jmilne.org/math/CourseNotes/ft.html
- **Type:** notes
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** See `algebra-intro`. Listed here as the complete Galois
  theory course: fundamental theorem, solvability by radicals, finite
  fields, cyclotomic fields, infinite Galois theory.
- **Weaknesses:** As there.

### Atiyah & Macdonald — Introduction to Commutative Algebra
- **Link:** https://www.taylorfrancis.com/books/mono/10.1201/9780429493626/introduction-commutative-algebra-michael-atiyah-ian-macdonald
- **Type:** book
- **Difficulty:** 4
- **Free:** no
- **Strengths:** The classic 128-page course: rings and ideals, modules,
  localisation, primary decomposition, integral dependence, Noetherian and
  Artinian rings, dimension theory. Everything needed for `geometry` and
  for the algebraic side of homological algebra. The exercises are the
  real content.
- **Weaknesses:** Terse to the point of austerity; no motivation from
  geometry (read alongside Vakil's *Rising Sea* chapters in `geometry`).

### Charles Weibel — An Introduction to Homological Algebra
- **Link:** https://www.cambridge.org/core/books/an-introduction-to-homological-algebra/0B9B8A24B2E6F1E3EA3C6E4F2B88DD53
- **Type:** book
- **Difficulty:** 4-5
- **Free:** no (Cambridge Studies 38)
- **Strengths:** The standard reference: chain complexes, derived functors,
  Tor and Ext, group homology and cohomology, Lie algebra cohomology,
  spectral sequences, derived categories. The universal coefficient
  theorem of problem 3 is chapter 3.
- **Weaknesses:** Dense; a reference rather than a first exposure — the
  homological chapters of Aluffi (`categorical-classical`) are a gentler
  entry.

## Problems

- **Etingof et al.** — exercises in every section, many of them computing
  character tables of specific groups.
- **Serre** — the exercises of Part I, especially the character tables of
  S₄, A₅ and the dihedral groups.
- **Keith Conrad** — each note ends with worked examples that double as
  exercises.
- **The pitch problems** continue: the 17-gon → Gauss's theorem on
  constructible polygons and the general solvability criterion; spherical
  harmonics → the representations of SU(2) and spin; torus vs Klein bottle
  → the Künneth and universal coefficient theorems in general.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Gauss's 17-gon** — the cyclotomic field, Gauss periods by hand, the
  construction drawn. Resolves pitch problem 1; joint with
  `complex-analysis`.
- **Character tables in an afternoon** — S₃, S₄, A₅ from scratch, and what
  the table tells you (normal subgroups, the Burnside theorem stated).
- **Harmonic polynomials and orbitals** — SO(3) acting on polynomials,
  dimension count, the picture of s/p/d/f. Resolves pitch problem 2; joint
  with `physics-symmetry`.
- **Homology by hand** — triangulate, write the boundary matrices, compute
  Smith normal form; torus, Klein bottle, projective plane, with ℤ and
  ℤ/2. Resolves pitch problem 3; joint with `topology`.
- **Why Tor?** — the universal coefficient theorem derived, and Tor as the
  measure of non-flatness.
