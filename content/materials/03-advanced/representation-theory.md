---
id: representation-theory
title: Representation theory
category: advanced
tagline: Symmetry made linear — every group becomes a collection of matrices, and a square table of numbers tells you almost everything about it.
prerequisites: [algebra-intro, linear-algebra, complex-analysis]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

A group is an abstract thing; a matrix is something you can compute with.
Representation theory asks what a group looks like when it acts on a vector
space, and discovers that the answer is astonishingly rigid. Every
representation of a finite group breaks into irreducible pieces; there are
exactly as many pieces as conjugacy classes; the squares of their dimensions
add up to the order of the group; and the whole structure is encoded in the
character table — a square array of complex numbers from which you can read
off normal subgroups, count solutions of equations, and prove theorems (like
Burnside's p^a q^b) that nobody has proved without it.

For continuous groups the same ideas produce the spherical harmonics, and
with them the shapes and counts of atomic orbitals, the selection rules of
spectroscopy, and the classification of elementary particles by the
representations of the Lorentz group. Fourier analysis is representation
theory of the circle; the fast Fourier transform is representation theory of
ℤ/2ⁿ. Wherever there is symmetry and linearity together, this is the
language.

It is also the most computable of the advanced algebra topics: a character
table can be worked out by hand in an afternoon, and the exercises are
genuine calculations with genuine answers.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Why orbitals come in 1, 3, 5, 7.** Rotations of ℝ³ act on polynomials
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

2. **Same table, different groups.** The dihedral group D₄ (symmetries of a
   square) and the quaternion group Q₈ both have order 8 and five conjugacy
   classes. Compute both character tables and show they are identical. Then
   find a property that distinguishes the two groups — and explain what the
   character table therefore cannot see.

   <details><summary>Hint 1</summary>
   Both have four one-dimensional characters (from the abelianisation of
   order 4) and one two-dimensional one; the sum-of-squares formula forces
   this.
   </details>
   <details><summary>Hint 2</summary>
   Count elements of order 2: D₄ has five, Q₈ has one.
   </details>
   <details><summary>Hint 3</summary>
   The character table determines the lattice of normal subgroups and the
   orders of the centre and abelianisation, but not the number of elements
   of each order. The extra data that does distinguish them is the
   Frobenius–Schur indicator.
   </details>

3. **The spectrum of the hypercube.** The n-dimensional cube graph has
   vertices the binary strings of length n, with an edge between strings
   differing in one bit. Find all eigenvalues of its adjacency matrix, with
   multiplicities, for every n.

   <details><summary>Hint 1</summary>
   The vertex set is the group (ℤ/2)ⁿ and the adjacency matrix commutes
   with every translation.
   </details>
   <details><summary>Hint 2</summary>
   The characters χ_S(x) = (−1)^{Σ_{i∈S} xᵢ}, one per subset S, are
   simultaneous eigenvectors.
   </details>
   <details><summary>Hint 3</summary>
   Eigenvalue n − 2|S| with multiplicity C(n, |S|). This is Fourier
   analysis on a finite abelian group; the same method gives the spectra of
   all Cayley graphs of abelian groups.
   </details>

## Prerequisites

- **Introduction to algebra** (`algebra-intro`): groups, homomorphisms,
  conjugacy classes, the symmetric and dihedral groups.
- **Linear algebra** (`linear-algebra`): eigenvalues, inner products,
  diagonalisation, tensor products, change of basis — this topic is linear
  algebra with a group acting.
- **Complex analysis** (`complex-analysis`), lightly: characters take
  values in ℂ, and roots of unity are everywhere.

## From the general materials

- **Napkin** — the representation theory part: characters, orthogonality,
  the regular representation, with the categorical viewpoint.
- **Mathemaniac** — the group theory series, including the
  representation-theoretic episodes.
- **3Blue1Brown** — the Fourier series videos, which are problem 3 for the
  circle.
- **Princeton Companion** — essays "Representation theory", "Fourier
  analysis", "The Lie groups".
- **Real Not Complex** — Abstract Algebra page.

## Materials

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

### Benjamin Steinberg — Representation Theory of Finite Groups: An Introductory Approach
- **Link:** https://link.springer.com/book/10.1007/978-1-4614-0776-8
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no (Springer Universitext)
- **Strengths:** The gentlest route: assumes only linear algebra and a
  first group theory course, proves everything, and applies the theory to
  Fourier analysis on finite groups, random walks and Burnside's theorem.
  Problem 3 is one of its chapters. Many exercises.
- **Weaknesses:** Finite groups only; stops before Lie groups.

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

### James & Liebeck — Representations and Characters of Groups
- **Link:** https://www.cambridge.org/9780521003926
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The most example-driven text: character tables computed
  for every small group in sight (problem 2 is an exercise), with full
  solutions to all exercises and an application chapter on molecular
  vibrations. The book to work through with a pencil.
- **Weaknesses:** Finite groups only; proofs are sometimes replaced by
  computation.

### Constantin Teleman — Representation Theory (lecture notes)
- **Link:** https://math.berkeley.edu/~teleman/math/RepThry.pdf
- **Type:** notes
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** A free course from Cambridge: finite groups and
  characters, then compact groups, SU(2) and SO(3), the Peter–Weyl theorem,
  with problem 1 developed as the central example. Concise and complete.
- **Weaknesses:** Lecture-note terseness; exercises on separate sheets.

### Fulton & Harris — Representation Theory: A First Course
- **Link:** https://link.springer.com/book/10.1007/978-1-4612-0979-9
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (Springer GTM 129)
- **Strengths:** Representation theory by examples: finite groups briefly,
  then Lie algebras sl₂, sl₃, the classical groups, weights and roots,
  Weyl character formula — all discovered through explicit computation
  before being stated in general. The continuation of problem 1.
- **Weaknesses:** Long and example-heavy; the general theory arrives late.

### Peter Woit — Quantum Theory, Groups and Representations
- **Link:** https://www.math.columbia.edu/~woit/QM/qmbook.pdf
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** See `physics-symmetry`. Listed here as the physics
  continuation: representation theory as the organising principle of
  quantum mechanics.
- **Weaknesses:** As there.

## Problems

- **James & Liebeck** — every exercise solved; the character-table
  exercises are the drill.
- **Serre** — the exercises of Part I, especially S₄, A₅ and the dihedral
  groups.
- **Steinberg** — chapter exercises, including Fourier analysis on finite
  groups.
- **The pitch problems** continue: harmonic polynomials → the
  representations of SU(2) and spin; D₄ vs Q₈ → the Frobenius–Schur
  indicator and real representations; the hypercube → random walks on
  groups and the Diaconis–Shahshahani mixing-time method.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Character tables in an afternoon** — S₃, S₄, D₄, Q₈, A₅ from
  scratch, and what a table tells you. Resolves pitch problem 2.
- **Harmonic polynomials and orbitals** — SO(3) acting on polynomials,
  dimension count, the picture of s/p/d/f. Resolves pitch problem 1; joint
  with `physics-symmetry`.
- **Fourier on finite groups** — characters of abelian groups, the
  hypercube spectrum, the FFT as representation theory. Resolves pitch
  problem 3; joint with `cs-foundations`.
- **Burnside's p^a q^b theorem** — the proof via characters, as the
  showcase of what the theory can do that group theory alone cannot.
