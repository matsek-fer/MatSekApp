---
between: [algebra-intro, topology]
tagline: Algebra lends topology the group, so loops up to deformation become π₁; topology repays with spaces whose shape proves theorems about groups and polynomials.
strength: 2
status: draft
ai_generated: true
---

Loops at a basepoint can be run one after another and run backwards; up to
deformation those operations satisfy the group axioms. So every space
X has a fundamental group π₁(X) and every continuous map X → Y a
homomorphism π₁(X) → π₁(Y): `algebra-intro` is the language in which
`topology` records shape, and spaces are where group theory turns into
pictures.

## What each side lends

Algebra gives topology invariants. π₁(S¹) ≅ ℤ by winding number, π₁ of the
torus is ℤ × ℤ, π₁ of the figure-eight is the free group F₂; ℤ² is abelian
and F₂ is not, so the torus and the figure-eight differ. Seifert–van Kampen
turns gluing into free products with amalgamation, so any presentation
⟨generators | relations⟩ is π₁ of a space: a circle per generator, a disc
glued per relation.

Topology repays with proofs algebra finds hard. If a polynomial p of degree
n ≥ 1 had no root, θ ↦ p(re^{iθ})/|p(re^{iθ})| would be a loop in S¹ for
every r ≥ 0, constant at r = 0 and of winding number n for large r, where zⁿ
dominates; winding number survives deformation, so p has a root. Fₙ is π₁ of
a graph with n independent cycles, a cover of a graph is a graph, and π₁ of
a graph is free, so every subgroup of a free group is free: Nielsen–Schreier.

## Covers are subgroups

Let X be connected, locally path-connected and semi-locally simply
connected, as manifolds and graphs are. Pointed connected covers
p: (X̃, x̃) → (X, x), up to isomorphism over X, correspond bijectively to
subgroups H ≤ π₁(X, x) via H = p∗π₁(X̃, x̃); forget the basepoints and H is
determined only up to conjugacy. The number of sheets is the index
[π₁(X) : H]; H is normal exactly when deck transformations act transitively
on fibres, with deck group π₁(X)/H; the trivial subgroup gives the universal
cover. For X = S¹ the subgroups of ℤ are nℤ and 0: the cover for nℤ is
S¹ → S¹, z ↦ zⁿ, n sheets, deck group ℤ/n; the cover for 0 is ℝ → S¹,
t ↦ e^{2πit}, deck group ℤ; the circle has no other connected covers. It is
the Galois correspondence of `galois-theory` with the universal cover in
place of L: subgroups of Gal(L/K) ↔ intermediate fields, index ↔ degree,
normal subgroups ↔ normal extensions.

## Where to see it

On `topology`, Armstrong's Basic Topology computes π₁(S¹) ≅ ℤ and reaches
covering spaces in its last chapter; Lee's Introduction to Topological
Manifolds proves the classification in full. On
`algebra-intro`, Artin's Algebra and Milne's Group Theory cover free groups
and presentations; the Napkin has both halves. The table is a phrasebook.

| Algebra | Topology |
|---|---|
| group G | π₁(X): loops at a basepoint up to deformation |
| product gh; inverse g⁻¹ | one loop after another; a loop run backwards |
| homomorphism π₁(X) → π₁(Y) | continuous map X → Y |
| ℤ | circle S¹; the winding number |
| ℤ × ℤ | torus |
| free group F₂ on a, b | figure-eight, two circles joined at a point |
| free group Fₙ | connected graph with n independent cycles, χ = 1 − n |
| free product with amalgamation G ∗_K H | X glued to Y along a path-connected intersection (Seifert–van Kampen) |
| presentation ⟨generators \| relations⟩ | a circle per generator, a disc glued in per relation |
| subgroup H ≤ π₁(X) | connected covering space X̃ → X |
| index [π₁(X) : H] | number of sheets |
| normal subgroup; quotient π₁(X)/H | regular cover; its deck transformation group |
| trivial subgroup | universal cover: ℝ over S¹, ℝ² over the torus |
| group acting freely and properly discontinuously on Y | Y → Y/G is a cover; ℝ/ℤ = S¹, S²/{±1} = ℝP² |
| subgroups of free groups are free (Nielsen–Schreier) | covers of graphs are graphs |
| braid group Bₙ; Artin's relation σᵢσᵢ₊₁σᵢ = σᵢ₊₁σᵢσᵢ₊₁ | π₁ of the space of n unordered points in the plane; strands sliding past each other |
| symmetric group Sₙ | where each braid strand ends; kernel the pure braids |
| topological group S¹, SO(3), GLₙ(ℝ) | group with continuous multiplication and inversion; π₁(SO(3)) ≅ ℤ/2 |
| Galois group Gal(L/K); intermediate field | deck group of a cover; intermediate cover |
