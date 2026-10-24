---
between: [galois-theory, linear-algebra]
tagline: Galois theory borrows dimension counting for every degree and impossibility argument; linear algebra gets back a finite group of matrices whose eigenvectors are radicals.
strength: 2
status: draft
ai_generated: true
---

A field extension L/K is a vector space over K — closed under addition and
scaling by K — with a multiplication that linear algebra does not see. Its
degree [L:K] is dim_K L, Gal(L/K) is a finite subgroup of GL_K(L), and nearly
every finiteness statement in `galois-theory` is a dimension count.

## What each side lends

Linear algebra supplies the counting. If α is algebraic over K, the powers
1, α, α², … cannot stay independent in a finite-dimensional space; the first
dependence is the minimal polynomial, so [K(α):K] is its degree, and as it is
also the characteristic polynomial of multiplication by α, the norm and trace
of α are a determinant and a trace. The tower law [M:K] = [M:L][L:K] is a
basis count: products bᵢcⱼ of the two bases form a basis of M over K.
Dedekind's lemma — distinct field homomorphisms are linearly independent —
gives |Gal(L/K)| ≤ [L:K], and Artin's proof of the fundamental theorem gets
the reverse inequality from a homogeneous linear system with more unknowns
than equations.

Galois theory repays with structure on the matrices. If K contains the n-th
roots of unity and Gal(L/K) = ⟨σ⟩ is cyclic of order n, then σ is K-linear
with σⁿ = id, hence diagonalisable, and an eigenvector with σ(α) = ζα has
σ(αⁿ) = ζⁿαⁿ = αⁿ, so αⁿ ∈ K. Radicals are eigenvectors of the Galois group;
Lagrange's resolvent Σₖ ζ^{−k} σᵏ(x) is n times the projection onto the
ζ-eigenspace, and Gauss's periods for the 17-gon (pitch problem 1 on
`galois-theory`) project onto a subgroup's fixed space. And a rational matrix
has a rational characteristic polynomial, so its eigenvalues come in full
Gal(ℚ̄/ℚ)-orbits: with ∛2 come ω∛2 and ω²∛2.

## Doubling the cube

Theorem: if α ∈ ℝ is constructible by ruler and compass from 0 and 1, then
[ℚ(α):ℚ] is a power of 2. Each step intersects lines and circles with
coefficients in the field Kᵢ of coordinates so far, and solving a linear and
a quadratic equation gives new coordinates of degree 1 or 2 over Kᵢ; the
tower law makes [Kₙ:ℚ] = 2ʲ and, since ℚ(α) ⊂ Kₙ, [ℚ(α):ℚ] a divisor of 2ʲ.

Doubling the unit cube needs the length ∛2. Since x³ − 2 has no rational root
(the candidates are ±1, ±2), it is irreducible over ℚ and [ℚ(∛2):ℚ] = 3,
which divides no power of 2. No group was computed; the argument is
dimensions alone.

## Where to see it

Milne's first chapter does degree, the tower law and constructibility; Artin
builds the subject from the linear-algebra side, proving the fundamental
theorem through independence of characters; Stewart draws the constructions;
Axler's chapters on eigenvalues and the minimal polynomial cover what the
Galois action needs. The table is a phrasebook between `galois-theory` and
`linear-algebra`.

| Galois theory | Linear algebra |
|---|---|
| field extension L/K | vector space L over K, with a multiplication |
| degree [L:K] | dim_K L |
| tower law [M:K] = [M:L][L:K] | basis products bᵢcⱼ |
| minimal polynomial of α | characteristic polynomial of multiplication by α on K(α) |
| norm N(α), trace Tr(α) | det and tr of multiplication by α |
| element of Gal(L/K) | K-linear map of finite order, in GL_K(L) |
| \|Gal(L/K)\| ≤ [L:K] (Dedekind) | linear independence of characters |
| radical, αⁿ ∈ K | eigenvector of σ with a root of unity as eigenvalue (Kummer) |
| Lagrange resolvent, Gauss period | projection onto an eigenspace or fixed space |
| normal basis θ | regular representation K[G] ≅ L |
| discriminant of a polynomial | Vandermonde determinant, squared |
| conjugates of an algebraic number | eigenvalues of a rational matrix, in full Galois orbits |
