---
id: type-theory
title: Type theory & the Curry–Howard–Lambek correspondence
category: language
tagline: Propositions are types, proofs are programs, and both are arrows in a category — one structure seen three ways.
prerequisites: [logic-sets, category-theory-intro]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

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

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Balls in a bag.** A bag holds finitely many balls, each labelled with a
   positive integer. A move removes one ball labelled k and adds any finite
   number of balls with labels smaller than k. Prove the bag always empties,
   however the moves are chosen. Harder: prove that the Kirby–Paris hydra
   always dies.

   <details><summary>Hint 1</summary>
   Find a quantity that strictly decreases with every move.
   </details>
   <details><summary>Hint 2</summary>
   Compare two bags by their largest label first, then by how many balls
   carry it, and so on down. Why can this comparison not decrease forever?
   </details>
   <details><summary>Hint 3</summary>
   For the hydra, assign to each tree an ordinal below ε₀ and show every cut
   lowers it.
   </details>

2. **Numbers as repetition machines.** A number n is given to you only as a
   sealed machine: handed any operation f and a starting value x, it returns
   f applied n times to x. From the machines for n and m, build machines for
   n + m, n · m and nᵐ — and for n − 1.

   <details><summary>Hint 1</summary>
   For n + m, feed the result of one machine to the other.
   </details>
   <details><summary>Hint 2</summary>
   The operation you hand to a machine may itself be "run a machine".
   </details>
   <details><summary>Hint 3</summary>
   For n − 1, iterate on pairs: start from (0, 0) and apply
   (a, b) ↦ (b, b + 1).
   </details>

3. **Seven trees in one.** A binary tree is either a single leaf, or a node
   with a left and a right binary tree. Find an explicit bijection between
   the set of all binary trees and the set of all 7-tuples of binary trees —
   described by finitely many case distinctions on the shapes involved, not
   by enumeration. Then explain why the same method cannot produce one for
   pairs, triples, …, or 6-tuples.

   <details><summary>Hint 1</summary>
   Pretend T is a number satisfying T = 1 + T². What is T⁷?
   </details>
   <details><summary>Hint 2</summary>
   Each use of T = 1 + T², in either direction, and each regrouping of a
   product or sum, is a bijection on tuples of trees. You may never cancel
   or subtract.
   </details>
   <details><summary>Hint 3</summary>
   Solve T² − T + 1 = 0 over ℂ to see why 7 works and 2, …, 6 cannot.
   </details>

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
  the logic of constructive proof, all built up from nothing. The
  termination arguments of pitch problem 1 are what its induction
  principles make precise.
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
  progress, preservation, normalisation — proved in full. The repetition
  machines of pitch problem 2 are the Church numerals of the System F
  chapter. Solutions to most
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
- **TAPL** — exercises with solutions; the λ-calculus and System F
  chapters' exercises continue pitch problem 2.
- **The pitch problems** continue: after the hydra, Goodstein sequences;
  after the predecessor, subtraction and "is zero?"; after seven trees, the
  one-hole contexts ("derivative") of a tree type.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Why does it stop?** — the bag of balls, multiset orderings, the hydra
  and Goodstein, and termination as the price of "every proof is a
  procedure". Resolves pitch problem 1; joint with `logic-sets` (ordinals).
- **Numbers without numerals** — Church numerals by hand: plus, times,
  power, the predecessor trick with pairs, and why this is a number system.
  Resolves pitch problem 2.
- **Seven trees in one** — data types as equations, isomorphisms read off
  the algebra, Blass's bijection, and Fiore–Leinster's complex-number
  explanation. Resolves pitch problem 3; joint with `combinatorics`.
- **Existence means construction** — the irrational-to-an-irrational proof
  dissected, explicit witnesses, excluded middle as the culprit, and what
  constructive mathematics gives up and gains.
- **Curry–Howard–Lambek in one table** — propositions / types / objects,
  proofs / programs / arrows, ∧ / × / product, → / function / exponential,
  worked example by example; joint with `category-theory-intro`.
- **Lean night II** — formalise a theorem from `algebra-intro` in Lean,
  live.
