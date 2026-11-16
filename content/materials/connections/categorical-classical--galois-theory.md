---
between: [categorical-classical, galois-theory]
tagline: Galois theory hands the categorical view its first adjunction and first equivalence; the categorical view hands back a fundamental theorem shaped like covering spaces.
strength: 2
status: draft
ai_generated: true
---

The fundamental theorem of `galois-theory` is usually a bijection between
intermediate fields of a finite Galois extension L/K and subgroups of
G = Gal(L/K). Grothendieck's version says what it is a shadow of:
A ↦ Hom_K(A, L) is an equivalence between the commutative K-algebras split
by L, those with A ⊗_K L ≅ Lⁿ, and finite G-sets with arrows reversed. The
classical dictionary is its restriction to connected objects; with a space
X for K and π₁(X) for G it classifies covering spaces.

## What each side lends

`categorical-classical` supplies the grammar. Fix and Gal form an antitone
adjunction between the posets of intermediate fields and of subgroups,
H ≤ Gal(L/M) ⟺ M ⊆ L^H, pitch problem 1 there with one poset inverted,
and the fundamental theorem says both closure operators,
M ↦ L^{Gal(L/M)} and H ↦ Gal(L/L^H), are identities. For infinite
extensions only the first is, and pitch problem 3's limit says why:
Gal(K^s/K) = lim Gal(L/K) over finite Galois L is profinite, and the
second closure is closure in the Krull topology. The tower of fields
ℚ(ζ_{pⁿ}) has Galois group lim (ℤ/pⁿ)^× = ℤ_p^×, the units of the clock
ring.

Galois theory repays with the examples behind the grammar's names: Galois
connections are named for Fix and Gal, and Gal(K^s/K) is the standard
profinite group. Hom_K(−, L) is a fibre functor, and Grothendieck's Galois
categories (SGA 1) axiomatise the categories with one, so fields, covering
spaces and étale covers of schemes fall under one theorem.

## Five fields, five transitive sets

Up to isomorphism, the algebras split by L are finite products of
intermediate fields, so a field M goes to the transitive set
Hom_K(M, L) ≅ G/Gal(L/M), a product to a disjoint union, an inclusion
M ⊆ M' to the restriction Hom(M', L) → Hom(M, L).

Let L = ℚ(√2, √3), G = {1, σ, τ, στ}, σ negating √2 and τ negating √3.
Hom_ℚ(ℚ(√2), L) = {√2 ↦ ±√2} is two points swapped by σ and fixed by τ,
the G-set G/⟨τ⟩. The five transitive G-sets G/1, G/⟨σ⟩, G/⟨τ⟩, G/⟨στ⟩,
G/G are L, ℚ(√3), ℚ(√2), ℚ(√6), ℚ, and ℚ ⊂ ℚ(√2) ⊂ L becomes
G/G ← G/⟨τ⟩ ← G/1: the classical theorem's inclusion reversal is the op.
The four-point set {±√2} ⊔ {±√3} is not transitive; it is
ℚ(√2) × ℚ(√3) ≅ ℚ[x]/((x² − 2)(x² − 3)), which the classical theorem
cannot see.

## Where to see it

Milne's Fields and Galois Theory, on `galois-theory`, proves the
anti-equivalence in its étale-algebras chapter, which ends by comparing it
with covering spaces; its infinite-Galois chapter does the Krull topology.
On `categorical-classical`, Riehl's Category Theory in Context supplies
equivalences and adjunctions, and Aluffi's Chapter 0 has the Galois
correspondence in chapter VII.

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
