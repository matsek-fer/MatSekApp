---
between: [linear-algebra, representation-theory]
tagline: Representation theory borrows the trace, the inner product and block-diagonalisation; linear algebra gets back a reason its commuting matrices share eigenvectors.
strength: 3
status: draft
ai_generated: true
---

A representation of a group G is a homomorphism ρ: G → GL(V), one invertible
matrix per group element, multiplying as they do. Representation
theory is then `linear-algebra` asked of a family of matrices at once — which
subspaces they all preserve, which basis block-diagonalises them all — and its
theorems are linear algebra with a group watching.

## What each side lends

Linear algebra supplies the material. A change of basis P turns ρ into
PρP⁻¹, and conjugation is equivalence of representations. Since
tr(AB) = tr(BA), χ(g) = tr ρ(g) is basis-independent and constant on
conjugacy classes: characters are traces. Inner products give Maschke
(below); Axler's thesis that every operator on a finite-dimensional
complex space has an eigenvalue is the whole of Schur's lemma: if T commutes
with an irreducible ρ, the kernel of T − λI for an eigenvalue λ is a non-zero
invariant subspace, hence all of V, and T = λI.

Representation theory repays with reasons. Decomposing V into irreducibles is
simultaneous block-diagonalisation of the family {ρ(g)}, and for abelian G
Schur makes every block 1×1, so commuting matrices of finite order share an
eigenbasis for a structural reason. The hypercube problem on
`representation-theory` is this in action: its adjacency matrix commutes with
translation by (ℤ/2)ⁿ, so the characters are eigenvectors. And a matrix
theorem linear algebra cannot reach alone: homomorphisms G → GLₙ(ℂ) agreeing
in trace on every g are conjugate.

## Maschke, with S₃

For G finite and V complex and finite-dimensional, every invariant subspace W
has an invariant complement W′, V = W ⊕ W′. Proof: average any inner product
over G, ⟨u, v⟩ = (1/|G|) Σ_g ⟨ρ(g)u, ρ(g)v⟩₀; each ρ(g) is then unitary, so
⟨ρ(g)w′, w⟩ = ⟨w′, ρ(g⁻¹)w⟩ = 0 for w′ ∈ W^⊥, w ∈ W, and W^⊥ works.

Take S₃ permuting the coordinates of ℂ³. Permutation matrices are already
orthogonal; span(1, 1, 1) is invariant, hence so is {x + y + z = 0}, and in
the basis (1, 1, 1), (1, −1, 0), (1, 1, −2) every permutation matrix is
1 ⊕ (2×2 block). A permutation matrix's trace is its number of fixed points,
so the block has character 2, 0, −1 on the identity, transpositions and
3-cycles, and (1/6)(2² + 3·0² + 2·1²) = 1 says it is irreducible.

## Where to see it

Axler's chapters on eigenvalues and inner product spaces hold everything the
proofs used; Serre's Part I proves Maschke by this averaging in its first
pages, Steinberg assumes only that and a first group course, and James &
Liebeck compute S₃ by hand. The table is a phrasebook between
`linear-algebra` and `representation-theory`.

| Linear algebra | Representation theory |
|---|---|
| invertible matrix A ∈ GLₙ(ℂ) | ρ(g), one group element's action |
| conjugation A ↦ PAP⁻¹ | equivalence of representations |
| subspace preserved by every matrix in a family | subrepresentation |
| block-diagonal form, no block splits further | decomposition into irreducibles |
| trace, tr(AB) = tr(BA) | character χ(g) = tr ρ(g), a class function |
| matrix of finite order, roots of unity as eigenvalues | ρ(g) for finite G |
| averaged inner product, unitary matrices | Weyl's unitary trick |
| orthogonal complement W^⊥ | invariant complement (Maschke) |
| every operator has an eigenvalue | Schur: End(V) = ℂ for V irreducible |
| commuting family with a common eigenbasis | representation of an abelian group |
| discrete Fourier matrix diagonalising circulants | irreducible characters of ℤ/n |
| V ⊗ W, V* | ρ ⊗ σ with character χ_ρ χ_σ, dual with character χ̄ |
