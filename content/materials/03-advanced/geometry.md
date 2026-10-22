---
id: geometry
title: Geometry — the Erlangen program and the categorification of geometry
category: advanced
tagline: A geometry is a space together with the transformations you are allowed to use — and, one level up, a space is whatever its ring of functions says it is.
prerequisites: [linear-algebra, algebra-intro, topology, complex-analysis, category-theory-intro]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

By 1870 there were too many geometries — Euclidean, affine, projective,
hyperbolic, spherical — each with its own theorems, and no account of how
they related. Felix Klein's Erlangen program gave one: a geometry is a space
together with a group of transformations, and the theorems of that geometry
are exactly the statements invariant under the group. Euclidean geometry is
the geometry of distances because its group preserves distances; projective
geometry has the biggest group and the fewest, most general theorems; every
other geometry sits inside projective geometry as a subgroup. The program
turned geometry into group theory, predicted the hyperbolic plane's
properties from its symmetry group, and is the reason "symmetry" became the
organising idea of physics (`physics-symmetry`).

The twentieth century made the next move. Cartan generalised Klein to spaces
that are only locally a Klein geometry (a curved space-time is locally
Minkowski), which is the modern framework for differential geometry and
general relativity. And Grothendieck inverted the relation between a space
and its functions: a space is determined by the algebra of functions on it,
so any commutative ring can be regarded as a space — the prime numbers become
points, number theory becomes geometry, and the sheaf-theoretic language that
results is the model for `categorical-classical` and `higher-category-theory`.
That inversion is the categorification of geometry.

This topic covers both moves: geometry as the study of transformation
groups, and geometry as the study of rings and the sheaves on them.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Which geometry is this theorem in?** Three facts about a triangle:
   (i) the three medians meet at a point; (ii) the three angle bisectors
   meet at a point; (iii) Pappus's theorem: if A, B, C lie on one line and
   A′, B′, C′ on another, the three points AB′ ∩ A′B, AC′ ∩ A′C, BC′ ∩ B′C
   are collinear. For each fact, determine the largest group of
   transformations of the plane under which it remains true (similarities,
   affine maps, projective maps), and prove your answer. Then prove (i) by
   transforming the triangle into an equilateral one, and explain why the
   same trick fails for (ii).

   <details><summary>Hint 1</summary>
   Affine maps preserve midpoints and lines; they do not preserve angles.
   Projective maps preserve lines and incidences only.
   </details>
   <details><summary>Hint 2</summary>
   Any triangle is affinely equivalent to any other, so an affine theorem
   needs checking on one triangle.
   </details>
   <details><summary>Hint 3</summary>
   (i) affine, (ii) similarity, (iii) projective. This sorting is the
   Erlangen program in miniature: a theorem belongs to the geometry of the
   largest group that preserves it.
   </details>

2. **Triangles that are too small.** The Möbius transformations
   z ↦ (az + b)/(c z + d) that map the unit disc to itself form a group G.
   (a) Show that G acts transitively on the disc and find the subgroup
   fixing 0. (b) Find a formula for the distance d(z, w) that is invariant
   under G and makes straight lines (geodesics) out of circular arcs
   perpendicular to the boundary. (c) Prove that in this geometry the angles
   of every triangle sum to less than π, and that the area of a triangle
   with angles α, β, γ is π − α − β − γ.

   <details><summary>Hint 1</summary>
   (a) The maps z ↦ e^{iθ}(z − a)/(1 − āz) with |a| &lt; 1.
   </details>
   <details><summary>Hint 2</summary>
   (b) d(0, r) = 2 artanh r for real r; move everything to 0 with G.
   </details>
   <details><summary>Hint 3</summary>
   (c) Use the area form 4 dx dy/(1 − |z|²)² and compute the area of a
   triangle with one vertex at 0 and one on the boundary, then subtract.
   This is the hyperbolic plane: Klein's geometry for the group PSU(1,1).
   </details>

3. **Points are maximal ideals.** (a) Let X be a compact Hausdorff space and
   C(X) the ring of continuous real functions on it. Show that the maximal
   ideals of C(X) are exactly the sets {f : f(p) = 0} for points p ∈ X — so
   X can be rebuilt from the ring. (b) For the ring ℂ[x, y]/(xy − 1), find
   all maximal ideals and describe the geometric object they form.
   (c) For the ring ℤ, list the maximal ideals and the one prime ideal that
   is not maximal. Draw the resulting "space", and explain why algebraic
   geometers insist on calling it one.

   <details><summary>Hint 1</summary>
   (a) If an ideal is contained in no {f : f(p) = 0}, use compactness to
   build a nowhere-zero function in it.
   </details>
   <details><summary>Hint 2</summary>
   (b) The maximal ideals are (x − a, y − 1/a) for a ≠ 0: the hyperbola
   minus nothing, or ℂ minus a point.
   </details>
   <details><summary>Hint 3</summary>
   (c) The primes p and the ideal (0), whose "point" is dense. This is
   Spec ℤ; the sheaf of functions on it is the start of Vakil's
   <em>Rising Sea</em>, and the dictionary rings ↔ spaces is the
   categorification of geometry.
   </details>

## Prerequisites

- **Linear algebra** (`linear-algebra`): projective space as lines through
  the origin; matrix groups.
- **Algebra** (`algebra-intro`): groups acting on sets, rings and ideals,
  maximal and prime ideals.
- **Topology** (`topology`): compactness, Hausdorff spaces, manifolds in
  outline.
- **Complex analysis** (`complex-analysis`): Möbius transformations, for
  problem 2.
- **Category theory** (`category-theory-intro`): functors and
  equivalences, for the duality of problem 3; `categorical-classical` is
  the natural companion.

## From the general materials

- **Mathemaniac** — the Erlangen program and hyperbolic geometry episodes.
- **3Blue1Brown** — the videos on hyperbolic geometry and on projective
  transformations.
- **Napkin** — the algebraic geometry part (affine varieties, Spec, sheaves)
  for problem 3.
- **Princeton Companion** — essays "Geometry", "Projective geometry",
  "Hyperbolic geometry", "Algebraic geometry", "Schemes".
- **Real Not Complex** — Geometry and Algebraic Geometry pages.

## Materials

### John Stillwell — The Four Pillars of Geometry
- **Link:** https://link.springer.com/book/10.1007/0-387-29052-4
- **Type:** book
- **Difficulty:** 2
- **Free:** no (Springer UTM)
- **Strengths:** Four approaches to geometry — Euclid's axioms, coordinates,
  projective geometry, transformation groups — in a short book that ends
  with the Erlangen program and the hyperbolic plane. The right first
  book, and problem 1 is drawn from its last chapters.
- **Weaknesses:** Elementary by design; no differential or algebraic
  geometry.

### Felix Klein — A Comparative Review of Recent Researches in Geometry (the Erlangen Program, 1872)
- **Link:** https://arxiv.org/abs/0807.3161
- **Type:** paper
- **Difficulty:** 3
- **Free:** yes (Haskell's 1893 translation)
- **Strengths:** The original manifesto, readable in an afternoon: the
  definition of a geometry as a space with a group, the hierarchy of
  geometries, and the programme for unifying them. Worth reading as a
  primary source after Stillwell.
- **Weaknesses:** Nineteenth-century prose; no proofs; the notation is
  dated.

### Nigel Hitchin — Projective Geometry (lecture notes)
- **Link:** https://people.maths.ox.ac.uk/hitchin/hitchinnotes/hitchinnotes.html
- **Type:** notes
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** Oxford lecture notes on projective geometry done properly:
  projective spaces, duality, conics, the cross-ratio, the Klein quadric,
  with the group-theoretic viewpoint throughout. The same page has
  Hitchin's *Differentiable Manifolds* notes as the next step.
- **Weaknesses:** Lecture-note terseness; few exercises.

### Tristan Needham — Visual Differential Geometry and Forms
- **Link:** https://press.princeton.edu/books/hardcover/9780691203690/visual-differential-geometry-and-forms
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** Curvature, geodesics, Gauss–Bonnet, parallel transport and
  differential forms, all through pictures and Newtonian-style geometric
  arguments; the hyperbolic plane (problem 2) is treated at length, and
  the final part builds the forms needed for `physics-symmetry`.
- **Weaknesses:** Long and leisurely; proofs are geometric rather than
  formal; pair with Lee.

### John M. Lee — Introduction to Smooth Manifolds
- **Link:** https://link.springer.com/book/10.1007/978-1-4419-9982-5
- **Type:** book
- **Difficulty:** 4
- **Free:** no (Springer GTM 218)
- **Strengths:** The standard rigorous text on manifolds: smooth maps,
  tangent bundles, vector fields, Lie groups and their actions, differential
  forms, integration, de Rham cohomology. Everything in `physics-symmetry`
  and in Sharpe assumes it.
- **Weaknesses:** 700 pages; exercises without solutions.

### R. W. Sharpe — Differential Geometry: Cartan's Generalization of Klein's Erlangen Program
- **Link:** https://link.springer.com/book/9780387947327
- **Type:** book
- **Difficulty:** 5
- **Free:** no (Springer GTM 166)
- **Strengths:** The book whose title is this topic: Klein geometries as
  homogeneous spaces G/H, then Cartan geometries as their curved
  versions, with Riemannian, conformal and projective geometry recovered as
  special cases. The conceptual completion of the Erlangen program.
- **Weaknesses:** Graduate level; assumes Lie groups and manifolds.

### Ravi Vakil — The Rising Sea: Foundations of Algebraic Geometry
- **Link:** https://math.stanford.edu/~vakil/216blog/
- **Type:** book
- **Difficulty:** 4-5
- **Free:** yes (author's notes, updated yearly)
- **Strengths:** Algebraic geometry built from category theory and sheaves:
  the first two chapters are the best available introduction to categorical
  language for geometers, then Spec, schemes, morphisms, and on to
  cohomology. Problem 3 is its opening motivation. Exercises are the text.
- **Weaknesses:** 800 pages and growing; demands commutative algebra
  (`commutative-homological-algebra`) from the start.

## Problems

- **Stillwell** — exercises throughout; the transformation-group chapters
  are the drill for problem 1.
- **Hitchin** — exercise sheets on the same page.
- **Vakil** — the exercises are the book; chapters 1–4 for this topic.
- **The pitch problems** continue: Erlangen → the nine Cayley–Klein
  geometries of the plane; the hyperbolic disc → Gauss–Bonnet and the
  classification of surfaces by curvature; Spec → sheaves, schemes and
  Gelfand duality for C*-algebras.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Sort the theorems** — twenty plane theorems sorted into Euclidean,
  similarity, affine and projective, with proofs by transformation.
  Resolves pitch problem 1.
- **The hyperbolic disc** — Möbius group, invariant metric, geodesics,
  angle sums, and a tiling drawn live. Resolves pitch problem 2; joint
  with `complex-analysis`.
- **Points are ideals** — C(X), affine varieties, Spec ℤ, and the
  dictionary rings ↔ spaces. Resolves pitch problem 3; joint with
  `commutative-homological-algebra` and `categorical-classical`.
- **From Klein to Cartan** — homogeneous spaces, then what it means to be
  locally one; general relativity as a Cartan geometry, stated.
- **Reading path** — Stillwell → Hitchin and Needham → Lee → Sharpe or
  Vakil, depending on taste.
