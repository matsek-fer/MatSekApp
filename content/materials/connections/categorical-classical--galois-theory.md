---
between: [categorical-classical, galois-theory]
tagline: Galois theory hands the categorical view its first adjunction and first equivalence; the categorical view hands back a fundamental theorem shaped like covering spaces.
strength: 2
status: draft
ai_generated: true
---

The fundamental theorem of `galois-theory` is usually a bijection between
intermediate fields of L/K and subgroups of Gal(L/K). Grothendieck's
version says what it is a shadow of: for G = Gal(L/K), A ↦ Hom_K(A, L) is
an equivalence between finite-dimensional K-algebras split by L and the
opposite of the category of finite G-sets. The classical dictionary is its
restriction to connected objects; with a space X for K and π₁(X) for G,
the same statement classifies covering spaces.

## What each side lends

`categorical-classical` supplies the grammar. Fix and Gal form a
contravariant adjunction between the posets of intermediate fields and of
subgroups, H ≤ Gal(L/M) ⟺ M ⊆ L^H, the shape of pitch problem 1 there, and
the fundamental theorem says both closure operators, M ↦ L^{Gal(L/M)} and
H ↦ Gal(L/L^H), are identities. For infinite extensions only the first
is, and the limit of pitch problem 3 says why: Gal(K^s/K) = lim Gal(L/K)
over finite Galois L is profinite, and the second closure is Krull
closure. The cyclotomic tower ℚ(ζ_{pⁿ}), with groups (ℤ/pⁿ)^×, has Galois
group ℤ_p^×, the units of the clock ring.

Galois theory repays with the oldest worked instance of each pattern: the
first Galois connection, anti-equivalence and profinite group.
Hom_K(−, L) is a fibre functor, and Grothendieck's Galois
categories (SGA 1) axiomatise the categories that have one, so fields,
covering spaces and étale covers of schemes fall under one theorem.

## Five fields, five transitive sets

Theorem. For L/K finite Galois with group G, A ↦ Hom_K(A, L) is an
anti-equivalence from finite products of intermediate fields to finite
G-sets; a field goes to a transitive set G/H, a product to a disjoint
union, an inclusion M ⊆ M' to the restriction Hom(M', L) → Hom(M, L).

Let L = ℚ(√2, √3), G = {1, σ, τ, στ}, σ negating √2 and τ negating √3.
Hom_ℚ(ℚ(√2), L) = {√2 ↦ ±√2} is two points swapped by σ and fixed by τ,
the G-set G/⟨τ⟩. The five transitive G-sets G/1, G/⟨σ⟩, G/⟨τ⟩, G/⟨στ⟩,
G/G are L, ℚ(√3), ℚ(√2), ℚ(√6), ℚ, and ℚ ⊂ ℚ(√2) ⊂ L becomes
G/G ← G/⟨τ⟩ ← G/1: the inclusion reversal of the classical theorem is the
op. The four-point set {±√2} ⊔ {±√3} is not transitive; it is the algebra
ℚ(√2) × ℚ(√3) ≅ ℚ[x]/((x² − 2)(x² − 3)), which the classical theorem
cannot see.

## Where to see it

Milne's Fields and Galois Theory, on `galois-theory`, proves the
anti-equivalence in its chapter on étale algebras, which ends by comparing
it with covering spaces; the infinite-Galois chapter does the Krull
topology. On `categorical-classical`, Riehl's Category Theory in Context
supplies equivalences and adjunctions, Aluffi's Chapter 0 has the Galois
correspondence in chapter VII, and Bradley–Bryson–Terilla's fundamental
group as a functor is the table's middle column.

| Galois theory | Covering spaces | Categorical pattern |
|---|---|---|
| finite Galois extension L/K with group G | universal cover X̃ → X with group π₁(X) | Galois object; the group of the fibre functor |
| the embedding K ↪ L | base point x₀ ∈ X | choice of fibre functor |
| intermediate field M | connected cover Y → X | connected object; transitive G-set G/H |
| product of fields ℚ(√2) × ℚ(√3) | disconnected cover | non-transitive G-set, a disjoint union of orbits |
| degree [M:K] | number of sheets | size of the fibre Hom_K(M, L) |
| Fix and Gal, inclusion-reversing | subgroups of π₁ ↔ connected covers | antitone Galois connection, an adjunction between posets |
| Gal(K^s/K) = lim Gal(L/K), Krull topology | profinite completion of π₁, the limit over finite covers | limit of finite groups, as in pitch problem 3 |
| M ⊆ M' gives Hom(M', L) → Hom(M, L) | Y' → Y over X gives a map of fibres | contravariance; the op in the theorem |
| fundamental theorem | classification of coverings | equivalence of categories, SGA 1 |
