---
between: [higher-category-theory, type-theory]
tagline: Higher category theory lends type theory the ∞-groupoid of paths as its model of equality; type theory returns a synthetic, machine-checked language for homotopy.
strength: 3
status: draft
ai_generated: true
---

Martin-Löf's identity type a = b has one rule, J: to prove something about
every p : a = b it is enough to prove it for refl_a. Nothing says two proofs
of a = b are equal, and iterating gives a tower — paths p = q between paths,
then paths between those, without end. Grothendieck's homotopy hypothesis
says an ∞-groupoid is a space; homotopy type theory reads the tower as
exactly that: a type is a space, a term a point, an equality a path.

## What each side lends

`higher-category-theory` supplies the models. Hofmann and Streicher's
groupoid model interprets a type as a groupoid and a = b as the hom-set, so
two distinct isomorphisms are two unequal proofs of one equation:
uniqueness of identity proofs does not follow from the rules. Voevodsky's
Kan complex model (2009) interprets a universe U as the space of small
spaces and makes univalence, (A =_U B) ≃ (A ≃ B), consistent; Shulman
(2019) extended this to every Grothendieck ∞-topos. Pitch problem 1 on
`higher-category-theory`, Eckmann–Hilton, returns as the HoTT book's
Theorem 2.1.6: concatenation on Ω²(A, a) is commutative.

`type-theory` repays with a synthetic language. Lumsdaine (2009) and van den
Berg and Garner (2011) proved that the identity tower of any type is a weak
ω-groupoid in the Batanin–Leinster sense, so every type is an example.
Constructions transport along paths automatically, so everything is
homotopy-invariant, and the proofs run in Agda or Coq — not Lean, whose
proof irrelevance collapses the tower. Since the models include every
∞-topos, a theorem proved once holds in all: the Blakers–Massey theorem,
proved in Agda by Hou, Finster, Licata and Lumsdaine (2016), gave Anel,
Biedermann, Finster and Joyal a generalisation new to higher category
theory.

## The circle, by transport

S¹ is the higher inductive type with one point base and one path
loop : base = base. Theorem (Licata and Shulman, 2013, in Agda):
(base = base) ≃ ℤ.

Define code : S¹ → U by code(base) = ℤ, sending loop to the path ℤ = ℤ that
univalence makes from succ : ℤ ≃ ℤ. Transport along p : base = base then
acts on ℤ, and the winding number of p is transport^code(p, 0): refl ↦ 0,
loop ↦ 1, loop · loop ↦ 2, loop⁻¹ ↦ −1. Decoding sends n to loopⁿ; the two
maps are inverse. The classical universal cover ℝ → S¹ has become a
function into the universe.

## Where to see it

The HoTT book on `type-theory` is the text: chapter 2 for paths and
univalence, chapter 6 for higher inductive types, chapter 8 for the circle.
On `higher-category-theory`, Baez's Introduction to n-Categories states the
homotopy hypothesis; Leinster's Higher Operads, Higher Categories defines
the weak ω-groupoids that types are. Sheafification of G, on both pages,
has videos on univalence. The table is a phrasebook.

| Higher category theory | Homotopy type theory |
|---|---|
| space, ∞-groupoid | type A |
| point | term a : A |
| path from a to b | p : a = b, an element of the identity type |
| homotopy between paths, and so on up | p = q, the iterated identity type |
| constant path, inverse, concatenation | refl, p⁻¹, p · q |
| fundamental ∞-groupoid Π_∞(X) | the identity tower of X (Lumsdaine; van den Berg–Garner) |
| fibration over B, path lifting | type family P : B → U, transport^P(p) : P(a) → P(b) |
| homotopy equivalence | equivalence A ≃ B |
| the ∞-groupoid of small spaces | universe U, with univalence (A =_U B) ≃ (A ≃ B) |
| CW complex, cells attached | higher inductive type, constructors for points and paths |
| n-truncated space | n-type: contractible, proposition, set, groupoid, … |
| homotopy group π_n(X, x) | ‖Ωⁿ(X, x)‖₀, the set-truncated n-fold loop space |
| Eckmann–Hilton, π₂ abelian | Theorem 2.1.6, Ω²(A, a) commutative |
| Grothendieck ∞-topos | model of HoTT with univalent universes (Shulman) |
