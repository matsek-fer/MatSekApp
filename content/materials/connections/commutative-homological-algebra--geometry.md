---
between: [commutative-homological-algebra, geometry]
tagline: Algebra makes points, dimension and singularities properties of a ring; geometry gives the ring its names, its pictures and the theorems worth proving.
strength: 3
status: draft
ai_generated: true
---

The Nullstellensatz says the maximal ideals of ℂ[x₁, …, xₙ] are exactly (x₁ −
a₁, …, xₙ − aₙ), one per point of ℂⁿ, so a variety's points are the maximal
ideals of its coordinate ring. Grothendieck's Spec makes this the definition:
Spec A is the prime ideals of any commutative ring A, and a ring map A → B
becomes a map Spec B → Spec A, the ring turned inside out. Pitch problem 3 on
`geometry` does this three times.

## What each side lends

Algebra lends the theorems. Hilbert's basis theorem makes ℂ[x₁, …, xₙ]
Noetherian, so every variety is cut out by finitely many equations; the
twisted cubic of pitch problem 2 on `commutative-homological-algebra` needs
two. Krull dimension, the longest chain of primes p₀ ⊂ ⋯ ⊂ p_d, is the
variety's dimension. Homological algebra lends the measurements: a local ring
is regular exactly when every finitely generated module has a finite free
resolution (Auslander–Buchsbaum–Serre), and sheaf cohomology measures the
failure of local functions to patch, so by Serre's criterion a variety is
affine, is a ring, exactly when every coherent sheaf has H¹ = 0.

Geometry lends the words and the questions. Dimension, tangent space, singular
and generic point are borrowed, and each became a definition that works for ℤ,
which has no picture. Noether normalisation projects a d-dimensional variety
finitely onto ℂᵈ, and the Nullstellensatz falls out. Serre asked whether
vector bundles on ℂⁿ are trivial; Quillen and Suslin answered that projective
modules over ℂ[x₁, …, xₙ] are free.

## Singular points are non-regular local rings

Let A be the local ring of a variety at a point p, with maximal ideal m. Then
m/m² is the cotangent space at p, and dim(m/m²) ≥ dim A, with equality exactly
when p is non-singular; A is then regular. For a plane curve f = 0 through the
origin, m/m² is ℂ² modulo the linear part of f, since they differ by an
element of (x, y)². The parabola y − x² = 0 has linear part y, so m/m² ≅ ℂ,
dimension 1 = dim A: regular, smooth. The cusp y² − x³ = 0 has linear part 0,
so m/m² ≅ ℂ², dimension 2 > 1: not regular, a singular point. This is the
gradient test from calculus, recovered from the ring alone.

## Where to see it

Reid's *Undergraduate Commutative Algebra*, on
`commutative-homological-algebra`, states each theorem's geometric meaning
before proving it; Atiyah and Macdonald's chapter 11 is dimension theory;
Eisenbud the homological half. Vakil's *Rising Sea*, on both pages, builds
Spec and sheaf cohomology from this dictionary. The table is the phrasebook.

| Commutative algebra | Geometry |
|---|---|
| finitely generated reduced ℂ-algebra A | affine variety X, with A its ring of polynomial functions |
| maximal ideal m | point of X (Nullstellensatz) |
| prime ideal p | irreducible subvariety, or its generic point |
| ideal I with √I = I | subvariety V(I); I(V(I)) = √I is the strong Nullstellensatz |
| I ⊂ J | V(J) ⊂ V(I); more equations, fewer points |
| quotient A/I | the closed subvariety V(I) |
| nilpotent ε with ε² = 0 | a point that remembers one tangent direction |
| localisation A_m | the local ring at a point; functions defined near it |
| localisation A[1/f] | the open set f ≠ 0; ℂ[x, 1/x] is the hyperbola xy = 1 |
| ring homomorphism A → B | morphism Spec B → Spec A, the direction reversed |
| A ⊗ B over ℂ | the product X × Y |
| A/(I + J), and Torᵢ(A/I, A/J) | the intersection V(I) ∩ V(J), with Serre's multiplicity corrections |
| Krull dimension of A | dimension of X |
| m/m² | cotangent space at p; its dual is the tangent space |
| regular local ring | non-singular point |
| Noether normalisation ℂ[y₁, …, y_d] ⊂ A, finite | finite surjective projection X → ℂᵈ |
| primary decomposition of I | irreducible components of V(I), plus embedded points |
| Hⁱ(X, F) = 0 for i > 0 and every coherent F | X is affine (Serre's criterion) |
| Spec ℤ | one closed point per prime, one dense generic point (0) |
