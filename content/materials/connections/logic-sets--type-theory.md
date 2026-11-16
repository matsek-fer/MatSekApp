---
between: [logic-sets, type-theory]
tagline: Logic lends type theory its deduction rules and set-theoretic models; type theory returns proofs that compute, so existence means a witness in hand.
strength: 3
status: draft
ai_generated: true
---

A proposition is the type of its proofs. "A and B" is the pair type A × B,
"A implies B" the function type A → B, "some x in A satisfies P" the type
Σ x:A. P(x) of pairs (witness, proof), "every x" the dependent function type
Π, falsity the empty type. Under this reading, Curry and Howard's, a proof of
A is a program of type A, set theory's relation a ∈ b becomes the
judgement a : A, and "is 3 ∈ π?" no longer parses.

## What each side lends

`logic-sets` supplies the rules and the yardstick. Gentzen's natural
deduction is the type system: each connective's introduction and elimination
rules are the term formers of the matching type, and Prawitz's normalisation
of proofs is β-reduction. Consistency follows: a closed normal proof ends in
an introduction rule, ⊥ has none, so the empty type has no closed term. Set
theory supplies the models: a type as a set, a universe as the sets
below an inaccessible cardinal, one inaccessible per universe (Werner, 1997).

`type-theory` returns proof relevance. A proof of ∃ is a pair, so the axiom
of choice in Σ-form is a theorem (Martin-Löf): a proof of ∀x ∃y R(x, y)
already contains the function. Diaconescu's theorem shows choice for ∃ with
the witness hidden implies excluded middle: ZFC's one axiom splits into a
triviality and the classical principle. Russell's paradox returns as
Girard's, Type : Type is inconsistent, so universes are stratified like the
cumulative hierarchy; Aczel's V, well-founded trees over a universe,
interprets constructive set theory in type theory.

## Having a witness versus computing one

Existence property: if Heyting arithmetic, Peano's axioms over intuitionistic
logic, proves ∃x φ(x), it proves φ(n) for some numeral n: a closed normal
proof ends in ∃-introduction, which names n. Peano arithmetic fails it: by
excluded middle PA ⊢ ∃x (x = 0 ↔ Con(PA)), yet by Gödel it proves no
instance.

First-year version: are there irrationals a, b with aᵇ rational?
Classically, either √2^√2 is rational, done, or not, and then
(√2^√2)^√2 = 2; the proof names no pair. Constructively take a = √2,
b = log₂ 9: aᵇ = 2^(½ log₂ 9) = 3, and log₂ 9 = p/q would force 2^p = 9^q,
even against odd. Griffin's call/cc typing of Peirce's law makes even the
classical proof a program, one allowed to retract an answer.

## Where to see it

Wadler's Propositions as Types, on `type-theory`, is the correspondence
itself; the Open Logic Project, on `logic-sets`, has natural deduction
and the Gödel used above; the Natural Number Game hands over to Theorem
Proving in Lean 4. The table is a phrasebook between the two foundations.

| Set theory and logic | Type theory |
|---|---|
| a ∈ b, a relation between any two sets | a : A, a judgement; a mismatch is ungrammatical |
| proposition, true or false | type whose elements are its proofs |
| A ∧ B, A → B, ⊥ | pair type A × B, function type A → B, empty type |
| ∃x ∈ A. P(x) | Σ x:A. P(x), a witness paired with a proof |
| ∀x ∈ A. P(x) | Π x:A. P(x), a function from elements to proofs |
| A ∨ B, settled by excluded middle | A + B, a proof says which; A + ¬A is a decision procedure |
| function as a set of pairs | function as primitive, computed by application |
| subset {x ∈ A : P(x)} | Σ x:A. P(x), the proof carried along |
| power set P(A) | A → Prop |
| cumulative hierarchy V₀ ⊂ V₁ ⊂ … | universes U₀ : U₁ : … |
| Russell's paradox, no set of all sets | Girard's paradox, Type : Type is inconsistent |
| axiom of choice | theorem in Σ-form; for hidden witnesses, excluded middle (Diaconescu) |
| equality a = b, by extensionality | identity type Id_A(a, b), with proofs of its own |
| Gentzen's cut elimination | normalisation, β-reduction |
| consistency, no proof of ⊥ | no closed term of the empty type |
| inaccessible cardinal | universe, in the set model |
