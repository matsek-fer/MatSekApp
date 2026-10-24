---
between: [physics-symmetry, representation-theory]
tagline: Physics hands representation theory its groups, its unitarity and its ladder operators; representation theory hands back the spectrum of what can exist.
strength: 3
status: draft
ai_generated: true
---

A quantum system with symmetry group G has a Hilbert space on which G acts
unitarily and a Hamiltonian H commuting with the action. By Schur's lemma H is
a scalar on each irreducible piece, so an energy level is an irreducible
representation and its degeneracy is the dimension. Wigner (1939) finished the
thought: an elementary particle is an irreducible unitary representation of
the Poincaré group, labelled by mass and spin.

## What each side lends

Physics chooses the groups: SO(3), SU(2), flavour SU(3), Poincaré. Wigner's
theorem — a symmetry preserves probabilities, so acts unitarily or
antiunitarily — is why `representation-theory` studies unitary
representations. The ladder operators L± = Lₓ ± iL_y are highest-weight theory
before the name. And since a state is a ray, physics needs projective
representations: spin ½ is one of SO(3), an honest one of its double cover
SU(2) — the belt trick on `physics-symmetry`.

Representation theory repays with what can exist. The irreducibles of so(3)
have dimensions 2ℓ + 1, so orbitals come in 1, 3, 5, 7 — the s, p, d, f blocks
of the periodic table, widths 2, 6, 10, 14 with spin — pitch problem 1 on
`representation-theory` as chemistry. In 1961 Gell-Mann and Ne'eman laid the
eight lightest baryons on the weight diagram of su(3)'s adjoint
representation, the spin-3/2 baryons on its ten-dimensional one, and the
decuplet's gap was the Ω⁻, found in 1964. Quarks are the 3; 3 ⊗ 3 ⊗ 3 = 1 ⊕ 8
⊕ 8 ⊕ 10 is why octets and a decuplet appear. (Flavour SU(3), not the colour
SU(3) of the gauge principle.)

## Clebsch–Gordan and a selection rule

Theorem: for V_j the irreducible of SU(2) of dimension 2j + 1, V_j ⊗ V_k ≅
V_{|j−k|} ⊕ V_{|j−k|+1} ⊕ … ⊕ V_{j+k}. Proof by counting: J_z has eigenvalues
−j, …, j on V_j, so eigenvalues m + m′ on V_j ⊗ V_k: j + k once, j + k − 1
twice, and so on — the eigenvalue list of the right-hand side, which
determines a representation of SU(2). Two spin-½ electrons: V_{1/2} ⊗ V_{1/2}
= V₀ ⊕ V₁, singlet plus triplet, 2 · 2 = 1 + 3.

The selection rule: light couples to an atom through the dipole operator (x,
y, z), which transforms as V₁, so a transition from level ℓ to ℓ′ needs V_{ℓ′}
inside V₁ ⊗ V_ℓ = V_{ℓ−1} ⊕ V_ℓ ⊕ V_{ℓ+1}. Parity removes the middle term,
leaving Δℓ = ±1: the spectroscopists' rule, derived without an integral.

## Where to see it

Woit, on both pages, is this page at book length: SU(2) and spin, addition of
angular momentum, the Poincaré group and Wigner's classification. Hall's SU(2)
and SU(3) chapters hold the computations behind the eightfold way;
Fulton–Harris draw the sl₃ weight diagrams that are the octet and decuplet.
The table is a phrasebook between `physics-symmetry` and
`representation-theory`.

| Physics | Representation theory |
|---|---|
| state of a quantum system | vector, up to scale, in a Hilbert space V |
| symmetry transformation | unitary operator ρ(g) (Wigner's theorem) |
| conserved quantity (Noether) | element of the Lie algebra, acting as a Hermitian operator |
| degenerate energy level | irreducible subrepresentation (Schur's lemma) |
| quantum numbers ℓ, m | highest weight and weight of an irreducible of su(2) |
| orbitals 1, 3, 5, 7 | dim V_ℓ = 2ℓ + 1, the harmonic polynomials of degree ℓ |
| L² = ℓ(ℓ + 1) | Casimir operator, a scalar on each irreducible |
| spin ½, the belt trick | projective representation of SO(3), honest one of SU(2) |
| ladder operators L± | root vectors raising and lowering the weight |
| adding angular momenta | tensor product V_j ⊗ V_k, Clebsch–Gordan |
| selection rule Δℓ = ±1 | V_{ℓ′} occurs in V₁ ⊗ V_ℓ |
| particle of mass m and spin j | irreducible unitary representation of the Poincaré group |
| baryon octet, decuplet, quarks | the 8, 10 and 3 of SU(3); 3 ⊗ 3 ⊗ 3 = 1 ⊕ 8 ⊕ 8 ⊕ 10 |
