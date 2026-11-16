---
between: [category-theory-intro, logic-sets]
tagline: Set theory hands over the first category and the diagonal argument; category theory returns quantifiers as adjoints and sets axiomatised by their functions.
strength: 2
status: draft
ai_generated: true
---

Set theory and category theory describe one universe from opposite ends. ZFC
builds everything from one relation, ∈, with functions as sets of pairs;
category theory starts from functions and composition and recovers elements,
subsets and truth values as arrows. Logic sits between them: each connective
and quantifier is a universal property.

## What each side lends

`logic-sets` supplies the first category, Set, in which injective, surjective
and bijective become monomorphism, epimorphism and isomorphism; the
discipline of size, since Russell's paradox is why Set has no set of objects;
and Cantor's diagonal argument, generalised below.

`category-theory-intro` returns a reading of logic. In the poset Sub(X) of
subsets of X, ∩ is the product, ∪ the coproduct and A ⇒ B the exponential.
For f: X → Y the preimage f*: Sub(Y) → Sub(X) has adjoints on both sides,
f(A) ⊆ B iff A ⊆ f⁻¹(B) and f⁻¹(B) ⊆ A iff B ⊆ {y : f⁻¹(y) ⊆ A}; for the
projection X × Y → Y these are ∃x and ∀x (Lawvere, 1969). A topos has finite
limits, exponentials and an object Ω of truth values classifying every
subobject. In Set, Ω = {0, 1}; in general Sub(X) is only a Heyting algebra
and the logic intuitionistic: for sets varying over two instants, Ω has three
truth values, false, true from tomorrow, true. Lawvere's ETCS axiomatises Set
itself as a well-pointed topos with a natural numbers object and choice:
elements are arrows 1 → X and there is no global ∈.

## One diagonal

Lawvere's fixed-point theorem: in a cartesian closed category, if
φ: A → Y^A is surjective on points, every t: Y → Y has a fixed point. Proof:
put q(a) = t(φ(a)(a)); then q = φ(a₀) for some a₀, and
q(a₀) = t(φ(a₀)(a₀)) = t(q(a₀)).

Take Y = {0, 1} and t = negation, which has no fixed point: no set A surjects
onto 2^A ≅ P(A), Cantor's theorem, pitch problem 3 on `logic-sets` for
A = ℕ. Take A the class of all sets and φ(a) = (x ↦ [x ∈ a]): unrestricted
comprehension makes φ surjective, q is {a : a ∉ a}, and q(a₀) = ¬q(a₀) is
Russell, pitch problem 1. With Y the sentences of arithmetic up to provable
equivalence, A the formulas in one variable, φ(a)(b) = a(⌜b⌝) and t = ¬Prov,
the same lines give Gödel's sentence; q is hit because substitution is
representable.

## Where to see it

Conceptual Mathematics, on `category-theory-intro`, proves the fixed-point
theorem in its session on diagonal arguments; Seven Sketches ends with logic
in a topos. On `logic-sets`, the Open Logic Project has Cantor, Russell, the
diagonal lemma and incompleteness.

| Set theory and logic | Category theory |
|---|---|
| set, function, composition | object of Set, arrow, ∘ |
| injective, surjective, bijective | monomorphism, epimorphism, isomorphism |
| element x ∈ X | arrow x: 1 → X |
| empty set, singleton | initial object 0, terminal object 1 |
| X × Y, disjoint union, function set Y^X | product, coproduct, exponential |
| subset A ⊆ X and its characteristic function | monomorphism A ↪ X and its classifying arrow X → Ω |
| truth values {0, 1}, power set P(X) | subobject classifier Ω, exponential Ω^X |
| ∩, ∪, ⇒ on subsets of X | product, coproduct, exponential in the poset Sub(X) |
| preimage f⁻¹(B) | pullback f*: Sub(Y) → Sub(X) |
| image f(A), the quantifier ∃x | left adjoint ∃_f ⊣ f* |
| {y : f⁻¹(y) ⊆ A}, the quantifier ∀x | right adjoint f* ⊣ ∀_f |
| law of excluded middle | Ω Boolean, every Sub(X) a Boolean algebra |
| intuitionistic logic | Sub(X) a Heyting algebra, as in a general topos |
| Peano's 0 and successor, the recursion theorem | natural numbers object 1 → ℕ → ℕ |
| axiom of choice | every epimorphism has a section |
| ZFC with its global ∈ | ETCS, a well-pointed topos with ℕ and choice; bounded Zermelo strength until replacement is added |
| Cantor's theorem, Russell's paradox, the diagonal lemma | Lawvere's fixed-point theorem |
| no set of all sets | Set is not small; "locally small" categories |
