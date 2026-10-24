---
between: [category-theory-intro, topology]
tagline: Topology lends the homotopy category, Stone duality and sheaves; category theory returns functoriality, which turns a topological invariant into an impossibility proof.
strength: 3
status: draft
ai_generated: true
---

An invariant of spaces is a functor. The fundamental group sends a based
space X to a group π₁(X) and a continuous map f: X → Y to a homomorphism
f₊: π₁(X) → π₁(Y), with (g ∘ f)₊ = g₊ ∘ f₊ and id₊ = id. The invariant
the `topology` pitch promises, a group that does not change under
deformation, rests on those two equations.

## What each side lends

`category-theory-intro` gives topology functoriality as a proof technique.
Functors preserve isomorphisms, so homeomorphic spaces have isomorphic π₁;
homotopy invariance is the sharper fact that π₁ factors through hTop₊, whose
arrows are homotopy classes of maps, so a mug and a doughnut share π₁ ≅ ℤ.
Universal properties restate the constructions on the `topology` syllabus by
their maps alone — product, quotient and gluing are product, coequaliser and
pushout — and Seifert–van Kampen says π₁ carries a pushout of two open
path-connected sets with path-connected intersection to a pushout in Grp.

`topology` repays with categories whose arrows are not functions. The
fundamental groupoid Π₁(X), whose arrows are homotopy classes of paths, is
the first such category a student meets, and the ladder paths, homotopies,
homotopies between homotopies is where
`higher-category-theory` comes from. Stone duality, Bool ≃ Stoneᵒᵖ, sends a
Boolean algebra B to its space of homomorphisms B → 2 and a Stone space to
its clopen sets; a finite B has one point per atom, so B ≅ P(X) for a finite
set X. The open sets of X form a poset category O(X), a sheaf is a functor
O(X)ᵒᵖ → Set whose values glue along covers, and Grothendieck's
generalisation of covers made topology the template for the topos.

## No retraction, so a fixed point

There is no continuous r: D² → S¹ with r ∘ i = id, where i: S¹ → D² is the
inclusion. Apply π₁: functors preserve composites and identities, so
r₊ ∘ i₊ = id on π₁(S¹) ≅ ℤ, yet i₊ lands in π₁(D²) = 0, and the identity of
ℤ cannot factor through the trivial group. Brouwer follows: if f: D² → D²
had no fixed point, sending p to the point where the ray from f(p) through p
leaves the disc would be continuous and the identity on S¹, a retraction.
This is pitch problem 2 on `category-theory-intro`: the ray is topology, the
two equations are category theory.

## Where to see it

Riehl's Category Theory in Context opens with this proof and has Π₁(X)
among its first examples; Leinster treats discrete ⊣ forgetful ⊣ indiscrete
for Top → Set among the first adjunctions. On `topology`, Armstrong's Basic
Topology computes π₁(S¹) and proves Brouwer from it, and the Napkin states
the functor outright; Sheafification of G covers sheaves. The table is a
phrasebook between the two.

| Topology | Category theory |
|---|---|
| spaces and continuous maps | the category Top |
| homeomorphism | isomorphism in Top |
| homotopy classes of maps; homotopy equivalence | arrows and isomorphisms of the homotopy category hTop |
| product topology, the coarsest making both projections continuous | product X × Y in Top |
| disjoint union | coproduct X ⊔ Y |
| quotient X/∼, the finest topology making X → X/∼ continuous | coequaliser |
| subspace {x : f(x) = g(x)} | equaliser of f and g |
| X and Y glued along a common subspace A | pushout of X ← A → Y; Seifert–van Kampen says π₁ preserves it |
| discrete and indiscrete topologies on a set | left and right adjoints of the forgetful functor Top → Set |
| Stone–Čech compactification βX | left adjoint of the inclusion CompHaus → Top |
| compact-open topology on C(Y, Z), Y locally compact Hausdorff | exponential Z^Y, Hom(X × Y, Z) ≅ Hom(X, Z^Y) |
| fundamental group π₁(X, x₀) | functor Top₊ → Grp |
| paths up to homotopy, concatenated | fundamental groupoid Π₁(X), every arrow invertible |
| homotopy invariant | functor out of Top that factors through hTop |
| covering spaces of a connected, locally path-connected X with a universal cover | Cov(X) ≃ π₁(X)-Set, an equivalence of categories |
| Stone space: compact, Hausdorff, totally disconnected | dual of a Boolean algebra, Bool ≃ Stoneᵒᵖ |
| n-point discrete space · the Cantor set | Boolean algebra with 2ⁿ elements · free Boolean algebra on countably many generators |
| open sets of X ordered by inclusion | poset category O(X) |
| continuous functions, restricted and glued along covers | sheaf: functor O(X)ᵒᵖ → Set with unique gluing; Sh(X) a topos |
