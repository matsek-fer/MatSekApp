---
between: [higher-category-theory, topology]
tagline: Topology supplies the ∞-groupoids and the test any definition of weak n-category must pass; higher categories give topology homotopy types as algebraic objects.
strength: 3
status: draft
ai_generated: true
---

A space up to deformation is an ∞-groupoid: points are objects, paths are
arrows, homotopies between paths are arrows between arrows, and the ladder
never stops. Every arrow is invertible, a path run backwards, though only
up to a cell one level higher. Grothendieck's homotopy hypothesis says this
is the whole story: Π∞ identifies homotopy types with ∞-groupoids, so
`topology` and `higher-category-theory` study one object with two sets of
tools.

## What each side lends

Higher categories give topology one object in place of a list of
invariants: π₀(X) is the set of isomorphism classes of Π∞(X), π₁(X, x) the
group of automorphisms of x in Π₁(X). The interchange law for 2-cells is the
Eckmann–Hilton argument of the `higher-category-theory` pitch, so π₂ is
abelian, and the braiding one level up is the Whitehead product
π₂ × π₂ → π₃. Pushouts of groupoids let Seifert–van Kampen compute π₁(S¹)
from two arcs whose intersection is disconnected (Brown).

Topology gives higher categories definitions and tests. Kan complexes,
simplicial sets in which every horn fills, model ∞-groupoids because the
singular complex Sing(X) is one, and Quillen's equivalence of simplicial
sets with spaces proves the hypothesis for that model; dropping the outer
horn fillers gives Joyal's quasi-categories, Lurie's ∞-categories. It is
also an acceptance test: strict n-groupoids model every 1-type and, as
crossed modules (Mac Lane–Whitehead), every 2-type, but Simpson proved that
no strict 3-groupoid has the 3-type of S². Strictness makes the braiding an
identity, killing the Whitehead product, while on S² the Whitehead product
of the generator of π₂ with itself is twice the Hopf map η, nonzero in
π₃(S²) ≅ ℤ. Spaces force weakness, hence Cheng & Lauda's book of competing
definitions.

## The hypothesis at level one

For 1-types, spaces with πₙ = 0 for n ≥ 2, the hypothesis is a theorem: Π₁
and the classifying space B are inverse equivalences between 1-types up to
homotopy and groupoids up to equivalence, and homotopy classes of maps
X → Y are functors Π₁X → Π₁Y up to natural isomorphism. Every loop in S¹
at 1 is homotopic to t ↦ e^{2πint} for exactly one n ∈ ℤ, so Π₁(S¹) is
equivalent to the one-object groupoid ℤ, and maps S¹ → S¹ up to homotopy
are the homomorphisms ℤ → ℤ, one per degree. S² has trivial Π₁ but
π₂(S²) ≅ ℤ; Π₂, whose 2-cells are homotopies of paths, is the smallest
thing that sees it.

## Where to see it

Baez's An Introduction to n-Categories draws the fundamental n-groupoid and
Eckmann–Hilton on `higher-category-theory`; Lurie's Higher Topos Theory
opens with Kan complexes against quasi-categories. On `topology`,
Armstrong's Basic Topology computes π₁(S¹) ≅ ℤ. The table is a phrasebook.

| Topology | Higher category theory |
|---|---|
| space X up to homotopy | ∞-groupoid Π∞(X) |
| point · path · homotopy of paths · homotopy of homotopies | object · 1-cell · 2-cell · 3-cell |
| reversed path; constant path | inverse, up to a cell one level higher; identity |
| π₀(X) | set of isomorphism classes of objects |
| π₁(X, x) | automorphism group of the object x in Π₁(X) |
| πₙ(X, x) | n-cells on the identity (n − 1)-cell at x, up to (n + 1)-cells |
| homotopy equivalence | equivalence of ∞-groupoids |
| Postnikov truncation PₙX | n-truncation, collapsing the cells above level n |
| 1-type; K(G, 1) = BG | groupoid; the one-object groupoid G |
| Eilenberg–Mac Lane space K(A, n) | one object, one cell in each dimension below n, A in dimension n |
| 2-type | strict 2-groupoid, equivalently a crossed module (Mac Lane–Whitehead) |
| 3-type of S² | not any strict 3-groupoid (Simpson); weakness is forced |
| π₂ abelian | interchange law for 2-cells (Eckmann–Hilton) |
| Whitehead product π₂ × π₂ → π₃ | braiding of 2-cells, itself a 3-cell |
| singular simplicial set Sing(X) | Kan complex: every horn fills |
| Quillen's equivalence of simplicial sets with spaces | the homotopy hypothesis, proved for the Kan model |
| no counterpart | quasi-category: inner horns fill; the ∞-categories of Higher Topos Theory |
| Seifert–van Kampen for X = U ∪ V | pushout of groupoids Π₁(U) ← Π₁(U ∩ V) → Π₁(V) |
| covering space of X | functor Π₁(X) → Set |
| loop space ΩX at x | the ∞-group of automorphisms of x |
