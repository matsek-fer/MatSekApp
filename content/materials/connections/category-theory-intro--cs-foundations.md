---
between: [category-theory-intro, cs-foundations]
tagline: Computer science borrows functors, monads and schemas-as-categories; category theory gets back categories whose arrows are not functions, and laws that run as tests.
strength: 2
status: draft
ai_generated: true
---

A typed programming language is, for its terminating programs, a category:
types are objects, a program from A to B is an arrow A → B, running one
program after another is composition, and the program that returns its
input is the identity. Plugging programs together is a statement about
this category.

## What each side lends

`category-theory-intro` names recurring structure. List is a
functor on types, and its laws, map id = id and
map (g ∘ f) = map g ∘ map f, run as property tests; the second is a compiler
rewrite rule saving a pass. Wadler's theorems for free (1989): a
function that never inspects X, such as reverse : List X → List X, is a
natural transformation, so reverse ∘ map f = map f ∘ reverse is free.
Moggi (1991) made effects monads — Maybe for failure, List for
nondeterminism, State for a store — and Spivak made a database schema a
category — tables objects, foreign keys arrows, constraints equations — an
instance a functor into Set, a migration a functor between schemas.

`cs-foundations` repays with categories whose arrows are not functions. A
partial program is an arrow A → B + 1, a nondeterministic one A → List B;
neither is a function, yet both compose, in Kleisli categories whose axioms
are not inherited from Set; programmers supplied the monad examples
introductions now open with. And code asks what category theory
cannot: map g ∘ map f and map (g ∘ f) are one arrow; one runs twice as long.

## Kleisli composition

A monad on C is a functor T with η : 1 ⇒ T and μ : TT ⇒ T obeying
μ ∘ Tμ = μ ∘ μT and μ ∘ Tη = μ ∘ ηT = id. Its Kleisli category has the
objects of C, as arrows A ⇝ B the arrows f : A → TB, composition
g ∘_T f = μ ∘ Tg ∘ f and identity η_A; the monad laws are exactly
associativity and units for ∘_T.

Let TX = X + {⊥}, η(x) = x, μ sending both copies of ⊥ in TTX to ⊥. Put
root(x) = √x for x ≥ 0, recip(y) = 1/y for y ≠ 0, and ⊥ otherwise. For
x > 0, T recip turns √x into 1/√x; for x = 0, recip(0) = ⊥; for x < 0, root
gives ⊥, which T recip and μ pass on. So (recip ∘_T root)(x) = 1/√x for
x > 0, else ⊥: the failure check is written once, in μ, and twenty partial
steps chain without brackets.

## Where to see it

Milewski's Category Theory for Programmers, on `category-theory-intro`,
pairs functors, monads and the Kleisli category with code; Fong & Spivak's
Seven Sketches, Chapter 3, does databases as functors. On `cs-foundations`,
Kleppmann's Designing Data-Intensive Applications reaches CRDT merges in its
replication chapter. The table is a phrasebook.

| Computer science | Category theory |
|---|---|
| type A | object A |
| program f : A → B | arrow f : A → B |
| run f, then g | composition g ∘ f |
| the program that returns its input | identity id_A |
| pair or record (A, B) | product A × B |
| tagged union Either A B, case split | coproduct A + B |
| function type A → B, higher-order function | exponential B^A |
| List, Maybe, Tree with their map | functors Type → Type |
| map id = id and map (g ∘ f) = map g ∘ map f, as property tests | functor laws |
| polymorphic function ∀X. F X → G X, such as reverse | natural transformation; Wadler's free theorem |
| Maybe, List, State; do-notation, `;` under effects | monad (T, η, μ); Kleisli composition μ ∘ Tg ∘ f |
| partial function | arrow A → B + 1 in Kl(Maybe) |
| nondeterministic program, relation | arrow A → List B or A → P(B) |
| program with a mutable store S | arrow A → (B × S)^S in Kl(State) |
| fold or reduce over a list | the unique map out of the initial algebra of X ↦ 1 + A × X |
| database schema — tables, foreign keys, constraints | finitely presented category — objects, arrows, equations between paths |
| database instance, the tables filled | functor schema → Set |
| schema migration | functor F between schemas; Δ_F pulls instances back, with adjoints Σ_F ⊣ Δ_F ⊣ Π_F |
| CRDT merge in a replicated store | join in a semilattice, a coproduct in a poset |
| deterministic automaton over Σ | functor from the one-object category Σ* to FinSet |
| two equal programs with different running times | one arrow; cost is not a categorical notion |
