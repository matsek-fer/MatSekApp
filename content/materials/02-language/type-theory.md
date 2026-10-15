---
id: type-theory
title: Type theory & the Curry–Howard–Lambek correspondence
category: language
tagline: Propositions are types, proofs are programs, and both are arrows in a category — one structure seen three ways.
prerequisites: [logic-sets, category-theory-intro]
status: draft
---

## Pitch

Set theory says a mathematical object is a set, and asks of any two things
"is this an element of that?" Type theory says every object comes with a
*type* — a natural number, a function from ℝ to ℝ, a proof of Fermat's last
theorem — and that the question "is this an element of that?" is not even
grammatical unless the types match. This sounds like bookkeeping. It turns
out to be a different foundation for mathematics, with three remarkable
properties.

First, proofs become objects. A proof of "A implies B" is a function that
turns proofs of A into proofs of B; a proof of "A and B" is a pair; a proof
of "there exists x such that P(x)" is an x together with a proof of P(x). This
is the Curry–Howard correspondence, and it means logic and computation are
the same subject: writing a proof *is* writing a program, and checking a proof
is running a type checker. Second, the whole structure is a category — Lambek's
observation — so the fields of part 01 sit inside the same framework as the
logic used to reason about them. Third, in homotopy type theory, "a = b" is
itself a type whose elements are *paths*, and types behave like spaces: the
foundations of mathematics and algebraic topology turn out to be one thing.

Practically: type theory is the language of every modern proof assistant
(Lean, Coq, Agda), and the reason it is possible to formalise and
machine-check real mathematics. It is also the tradition in which "exists"
means "I can hand you one", which changes how you think about proof.

## Pitch problems

1. **Count the programs.** Consider functions that must work for *every*
   type A without being allowed to inspect what A is. How many such
   functions are there of type A → A? One — the identity. Of type
   A → A → A? Two. Of type (A → A) → A → A? Infinitely many, and you can
   list them exactly: apply the given function 0 times, 1 time, 2 times, …
   so this type *is* the natural numbers. Now the hard part: prove that any
   such function f from lists of A to lists of A satisfies
   f(map g xs) = map g (f xs) for every function g — a theorem you get for
   free from the type alone, knowing nothing about how f is defined.
2. **Produce the witness.** The classic proof that an irrational to an
   irrational power can be rational: either √2^√2 is rational, and we are
   done, or it is not, in which case (√2^√2)^√2 = 2 is. This proves a pair
   *exists* and gives no idea which pair. Type theory takes "there exists" to
   mean "here it is". Find explicit irrationals a and b with aᵇ rational,
   with proof. Then say exactly which step of the first proof fails to
   compute an answer, and which rule of reasoning you would have to give up
   to forbid such proofs.
3. **The game of implications.** You may use only these rules: from A and
   A → B conclude B; if assuming A lets you derive B, conclude A → B; ¬A
   abbreviates A → ⊥, where ⊥ is a proposition with no proof. For an
   arbitrary proposition A, decide which of the following you can prove:
   A → ¬¬A; ¬¬¬A → ¬A; ¬¬(A ∨ ¬A); A ∨ ¬A; ¬¬A → A. Three are
   provable (one of them is genuinely tricky) and two are not. For the two
   you need to argue that *no* proof exists under these rules — and that
   argument turns out to be a statement about what can be computed.

## Prerequisites

- **Sets and logic** (`logic-sets`): propositional and first-order logic,
  what a formal proof is. Finishing the Natural Number Game is ideal
  preparation.
- **Category theory** (`category-theory-intro`): for the Lambek side —
  cartesian closed categories, adjunctions; not needed for the first half.
- Some functional programming (Haskell, OCaml, or just comfort with
  functions as values) helps a great deal but can be picked up on the way.

## From the general materials

- **Sheafification of G** — videos on dependent types, homotopy type theory
  and univalence: the only general channel that covers this topic at depth.
- **Princeton Companion** — essays "Proof theory", "Computability", "The
  axiom of choice", "Set theory" (for contrast with type-theoretic
  foundations).
- **Real Not Complex** — Logic page.
- The Napkin has no type theory part; *The Joy of Abstraction* touches the
  idea of proofs as objects only in passing.

## Materials

### Philip Wadler — Propositions as Types
- **Link:** https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf ·
  talk: https://www.youtube.com/watch?v=IOiZatlZtGU
- **Type:** paper + video
- **Difficulty:** 2
- **Free:** yes
- **Strengths:** The best 15-page introduction to Curry–Howard: the history
  (Gentzen, Church, Curry, Howard), the correspondence table, natural
  deduction and the λ-calculus side by side, and why it keeps being
  rediscovered. The Strange Loop talk is the same content as a performance.
  Read this first.
- **Weaknesses:** A survey; no exercises; dependent types only sketched.

### Pierce et al. — Software Foundations, Volume 1: Logical Foundations
- **Link:** https://softwarefoundations.cis.upenn.edu/
- **Type:** book + site
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** Learn by doing: a textbook in which every definition and
  theorem is written in Coq and every exercise is a proof the machine
  checks. Inductive types, propositions as types, induction principles,
  the logic of constructive proof, all built up from nothing. Resolves
  pitch problem 3 by making you prove the provable ones.
- **Weaknesses:** Coq syntax is a hurdle; the pace is slow for those who
  already know logic; the later volumes turn toward programming languages.

### Theorem Proving in Lean 4
- **Link:** https://leanprover.github.io/theorem_proving_in_lean4/
- **Type:** site
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** Dependent type theory as implemented in Lean: types as
  objects, propositions as types, Π and Σ types, inductive types,
  tactics. Continues directly from the Natural Number Game in
  `logic-sets`; exercises throughout; and Lean's mathematical library
  means the examples are real mathematics.
- **Weaknesses:** Documentation-style rather than textbook-style; theory is
  explained only as far as needed to use Lean.

### Benjamin Pierce — Types and Programming Languages (TAPL)
- **Link:** https://www.cis.upenn.edu/~bcpierce/tapl/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The standard textbook on type systems: the untyped and
  simply typed λ-calculus, products and sums, references, subtyping,
  recursive types, polymorphism (System F), with the metatheory —
  progress, preservation, normalisation — proved in full. Pitch problem 1
  lives in the chapters on System F and parametricity. Solutions to most
  exercises included.
- **Weaknesses:** Written for programming-language theory, so the logical
  side of Curry–Howard is a remark rather than a theme; no dependent types.

### Nederpelt & Geuvers — Type Theory and Formal Proof
- **Link:** https://www.cambridge.org/core/books/type-theory-and-formal-proof/0472640AAD34E045C7F140B46A57A67C
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** The textbook that climbs the λ-cube step by step — untyped,
  simply typed, polymorphic, dependent, the calculus of constructions — with
  logic built in at each level, ending with a complete formalisation of a
  piece of real mathematics. Many exercises; written to be read linearly.
- **Weaknesses:** Slow and formal; the notation is heavy; nothing on
  homotopy type theory.

### Robert Harper — Practical Foundations for Programming Languages
- **Link:** https://www.cs.cmu.edu/~rwh/pfpl/
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes (author's draft of the 2nd edition)
- **Strengths:** Type theory as the organising principle for the whole of
  computation: a uniform treatment of dozens of language features as type
  constructors, each with its introduction and elimination rules and a
  proof of safety. The "type-theoretic style of thinking" — judgements,
  inversion, canonical forms — is the book's real content.
- **Weaknesses:** Encyclopaedic; terse; assumes comfort with inductive
  definitions and proofs about syntax.

### The Univalent Foundations Program — Homotopy Type Theory
- **Link:** https://homotopytypetheory.org/book/
- **Type:** book
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** The book that launched the field: dependent type theory
  from scratch (ch. 1), then the homotopical interpretation — identity
  types as paths, the univalence axiom, higher inductive types — and
  developments of logic, set theory, homotopy theory and real analysis
  inside it. Written collaboratively at the IAS in one year; remarkably
  readable for what it is.
- **Weaknesses:** Chapter 2 onward needs some topology intuition
  (`topology`); exercises are hard and unsolved; the field has moved since
  2013 (cubical type theory).

## Problems

- **Software Foundations** — every exercise is machine-checked; Volume 1
  in full is the best drill available.
- **Theorem Proving in Lean 4** — exercises per chapter; then try
  formalising a theorem you know from `algebra-intro`.
- **TAPL** — exercises with solutions; the System F chapter's exercises
  are pitch problem 1 in instalments.
- **Pitch problem 3** is itself a good problem set: do the five, then
  attempt the drinker paradox (in any non-empty pub there is someone such
  that if they drink, everyone drinks) under the same rules.

## Matsek originals (to design)

- **Theorems for free** — counting inhabitants of polymorphic types, Church
  numerals, and Wadler's parametricity theorem for lists. Resolves pitch
  problem 1.
- **Existence means construction** — the √2 proof dissected, explicit
  witnesses, excluded middle as the culprit, and what constructive
  mathematics gives up and gains. Resolves pitch problem 2.
- **The implication game** — a session of natural-deduction puzzles ending
  with ¬¬(A ∨ ¬A) and a Kripke counter-model for excluded middle. Resolves
  pitch problem 3.
- **Curry–Howard–Lambek in one table** — propositions / types / objects,
  proofs / programs / arrows, ∧ / × / product, → / function / exponential,
  worked example by example; joint with `category-theory-intro`.
- **Lean night II** — formalise a theorem from `algebra-intro` in Lean,
  live.
