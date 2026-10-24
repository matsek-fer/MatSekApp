---
between: [compositionality, cs-foundations]
tagline: Compositionality lends computer science denotational semantics and the frame rule; computer science returns global state, aliasing and full abstraction as the places composition breaks.
strength: 2
status: draft
ai_generated: true
---

A module is a part used through its interface and never opened. That rule
and `compositionality` — the meaning of a whole is a function of the meanings
of its parts and their wiring — are one statement; where programmers find it
false is the boundary the principle asks about.

## What each side lends

`compositionality` supplies the definition. Scott and Strachey's denotational
semantics is the principle as a recursion on syntax:
⟦c₁; c₂⟧ = ⟦c₂⟧ ∘ ⟦c₁⟧, ⟦while b do c⟧ a least fixed point. Hoare's rule of
composition, from {P} c₁ {Q} and {Q} c₂ {R} infer {P} c₁; c₂ {R}, makes
specifications compose. Monoidal categories add the side-by-side half:
sliding boxes along wires is the compiler's licence to reorder independent
instructions.

`cs-foundations` returns the failures. A procedure reading a global variable
has no meaning of its own, only as a transformer Store → Store, so its summary
names every variable in the program and goes stale whenever another part
changes. Aliasing, two names for one cell, makes two wires secretly one.
Milner's full abstraction problem (1977) asks whether denotational equality is
equality in every program context; Scott's model of PCF contains parallel-or,
which no program defines, and a junk-free model waited for game semantics
(1994). Herlihy and Wing (1990) proved linearisability local — a history is
linearisable iff each object's part is — and sequential consistency not.

## The frame rule

O'Hearn, Reynolds and Yang (2001): if {P} C {Q} and C modifies no variable
free in R, then {P ∗ R} C {Q ∗ R}. A heap satisfies P ∗ R when it splits into
disjoint parts satisfying P and R; x ↦ v is the single cell x holding v. So
∗ is a monoidal product on predicates, and a part's proof survives any
neighbour.

From {x ↦ 0} [x] := 1 {x ↦ 1} the rule gives
{x ↦ 0 ∗ y ↦ 5} [x] := 1 {x ↦ 1 ∗ y ↦ 5}. With ∧ for ∗ it is false:
x ↦ 0 ∧ y ↦ 0 forces x = y, one cell under two names, and after the write
y ↦ 0 fails. The disjointness ∗ carries is the rest of the heap being a
separate wire.

## Where to see it

On `compositionality`, Fong & Spivak's Seven Sketches names generative
effects in chapter 1 and builds the monoidal preorders ∗ belongs to in
chapter 2; Baez & Stay's Rosetta Stone has the computation column. On
`cs-foundations`, Erickson's Algorithms teaches recursion as the Recursion
Fairy — trust the smaller call's specification, never look inside — and
Kleppmann's consistency and consensus chapter cites Herlihy–Wing.

| Computer science | Compositionality |
|---|---|
| module behind an interface | box with its boundary wires |
| pure function f : A → B | arrow A → B |
| run c₁, then c₂ | composition ⟦c₂⟧ ∘ ⟦c₁⟧ |
| independent instructions or threads | parallel composition f ⊗ g |
| reordering independent instructions | sliding boxes along wires |
| denotational semantics ⟦−⟧ | functor from syntax to a semantic category |
| referential transparency | contextual equivalence is a congruence |
| full abstraction | model equality coincides with contextual equivalence |
| global variable | one wire every box must touch; arrows Store → Store |
| threading the store through the interface, the State monad | Kleisli arrow A → (B × S)^S |
| aliasing, two names for one cell | two wires that are secretly one |
| separating conjunction P ∗ R | monoidal product on predicates, a symmetric monoidal preorder |
| frame rule | a part's proof survives being wired beside anything |
| linearisability is local (Herlihy–Wing) | the correctness condition that composes over objects |
| sequential consistency is not local | generative effect; the whole exceeds the parts' summaries |
