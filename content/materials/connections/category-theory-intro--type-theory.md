---
between: [category-theory-intro, type-theory]
tagline: Type theory borrows products, exponentials and adjunctions as the meaning of its rules; category theory gets back a language that computes equations between arrows.
strength: 3
status: draft
ai_generated: true
---

Lambek observed that a cartesian closed category, a simply typed λ-calculus
with pairs, and the ⊤, ∧, → fragment of intuitionistic logic are one
structure written three ways. Objects are types are propositions; an arrow
A → B is a term of type B with a free variable of type A is a proof of B from
A; composition is substitution is splicing proofs.

## What each side lends

`category-theory-intro` supplies the meaning of the rules. The pair rules say
a term of type A × B is a pair and nothing else: the universal property of
the product. The function rules — apply, abstract, β, η — are the bijection
Hom(A × B, C) ≅ Hom(A, C^B). Inductive types are initial algebras: ℕ is the
initial algebra of X ↦ 1 + X, the unique map out of it is iteration
n ↦ fⁿ(x), the repetition machine of the `type-theory` pitch, and Lambek's
lemma makes 1 + ℕ → ℕ an isomorphism — for trees, the T ≅ 1 + T² of seven
trees. Joyal's lemma, that a cartesian closed category with 0 and every
B ≅ 0^(0^B) is a preorder, says why the correspondence is intuitionistic:
classically, any two proofs of B are equal.

`type-theory` repays with a calculus, the internal language: an equation
between arrows holds in every cartesian closed category exactly when β and η
prove it, and since the simply typed λ-calculus normalises, this is
decidable. To see that a diagram commutes, write both sides as terms and
reduce.

## Currying, three ways

In a category with finite products, an exponential of B and C is an object
C^B with ev: C^B × B → C such that every f: A × B → C factors as
f = ev ∘ (λf × id_B) for exactly one λf: A → C^B.

In Set, C^B is the function set and λf(a) = (b ↦ f(a, b)). In the poset
0 ≤ 1, × is ∧ and the condition reads a ∧ b ≤ c iff a ≤ c^b, forcing
c^b = (b ⇒ c): implication, and the bijection is the deduction theorem. In
the λ-calculus, λf is λa.λb.f(a, b), the factorisation is β and uniqueness
is η. Right adjoints preserve products, so (B × C)^A ≅ B^A × C^A: a function
into a pair is a pair of functions, and A → (B ∧ C) is (A → B) ∧ (A → C).

## Where to see it

Wadler's Propositions as Types, on `type-theory`, fills the last two columns
of the table; on `category-theory-intro`, Leinster treats − × B ⊣ (−)^B
among the first adjunctions and Milewski writes products, exponentials and
initial algebras in Haskell.

| Category theory | Type theory | Logic |
|---|---|---|
| object A | type A | proposition A |
| arrow f: A → B | term x : A ⊢ f(x) : B | proof of B from A |
| composition g ∘ f | substitution g(f(x)) | cut, one proof spliced into another |
| identity id_A | the variable x : A | assumption A ⊢ A |
| terminal object 1 | unit type, one element | ⊤, true |
| product A × B, π₁, π₂ | pair type, projections | A ∧ B, ∧-elimination |
| exponential C^B, ev | function type B → C, application | B → C, modus ponens |
| λf: A → C^B from f: A × B → C | λb. f(a, b), currying | deduction theorem |
| β and η | β- and η-reduction | normalisation of proofs |
| initial object 0 | empty type | ⊥, false |
| coproduct A + B | sum type, case analysis | A ∨ B, proof by cases |
| initial algebra of X ↦ 1 + X | ℕ with its recursor | induction on ℕ |
| Σ_f ⊣ f* ⊣ Π_f | Σ and Π types | ∃ and ∀ |
| natural transformation F ⇒ G | polymorphic function ∀X. F X → G X | second-order ∀ |
| cartesian closed category | simply typed λ-calculus with pairs | intuitionistic ⊤, ∧, → logic |
| preorder (Joyal) | all terms of a type equal | classical logic |
