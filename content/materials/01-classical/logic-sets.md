---
id: logic-sets
title: Formal systems, set theory, logic
category: classical
tagline: What a proof is, what a set is, and what happens when mathematics turns around and studies itself.
prerequisites: []
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Every other topic here assumes you can read and write a proof. This is where
you learn that — and discover that the question "what counts as a proof?"
is itself a piece of mathematics, with its own theorems and its own
surprises.

Around 1900 mathematicians tried to put everything on a single foundation:
sets, and rules of inference precise enough for a machine to check. The
attempt half-succeeded. Set theory became the common language of mathematics
(and infinity became something you could calculate with — there are different
sizes of it). Formal logic became precise enough that Gödel could prove, in
1931, that any such system strong enough to do arithmetic cannot prove its own
consistency and must leave some true statements unprovable. Out of the same
project came the idea of a computable function, and with it computer science.

Practically: you will leave this topic able to negate a quantified statement,
run an induction, build a bijection, and spot the gap in an argument. That is
the toolkit for everything else. Conceptually: you will have seen mathematics
study its own limits, which no other subject gets to do.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **The barber.** In a village the barber shaves exactly those men who do not
   shave themselves. Who shaves the barber? A joke — until Russell phrased it
   as "the set of all sets that do not contain themselves," at which point it
   destroyed the foundations Frege had just spent twenty years building. What
   went wrong, and how do the axioms we use today avoid it?
2. **Hilbert's hotel.** A hotel with infinitely many rooms, all full. One more
   guest arrives: move everyone up a room, done. Infinitely many guests
   arrive: move everyone to double their room number, done. Now infinitely
   many *buses* arrive, each with infinitely many passengers. Can you still
   fit everyone? (Yes — and finding the scheme with pen and paper is the first
   real exercise in the subject.)
3. **Are there more real numbers than whole numbers?** Both are infinite, so
   the question sounds meaningless. It is not: Cantor's two-paragraph
   argument, which anyone can follow, shows that no list can contain all the
   reals. There are different sizes of infinity. And the natural follow-up —
   is there a size strictly between the two? — has an answer that is more
   shocking than either yes or no.

## Prerequisites

None. This is the entry point. Comfort with high-school algebra is enough.

## From the general materials

- **Napkin** — the set theory part (ZFC axioms, ordinals and cardinals, a
  taste of forcing) and the introductory remarks on reading and writing
  proofs.
- **The Joy of Abstraction** (Cheng) — the first half is about what a proof
  is and why abstraction is worth it; a gentle companion to Hammack.
- **Princeton Companion** — essays "Logic and model theory", "Set theory",
  "Gödel's theorem", "Countable and uncountable sets".
- **Real Not Complex** — Logic and Set Theory pages.

## Materials

### Richard Hammack — Book of Proof
- **Link:** https://www.people.vcu.edu/~rhammack/BookOfProof/
- **Type:** book
- **Difficulty:** 1
- **Free:** yes (CC licence; PDF, cheap print)
- **Strengths:** The free "how to write proofs" course: sets, logic,
  counting, direct/contrapositive/contradiction proofs, induction, relations,
  functions, cardinality. Short chapters, many exercises, solutions to
  odd-numbered ones. The right first book for most people.
- **Weaknesses:** Does not go beyond proof technique; no formal logic, no
  axiomatic set theory.

### Daniel Velleman — How to Prove It
- **Link:** https://www.cambridge.org/core/books/how-to-prove-it/6D2965D625C6836CD4A785A2C843B3DA
- **Type:** book
- **Difficulty:** 1
- **Free:** no
- **Strengths:** Same ground as Hammack, but more systematic: a proof is
  built as a structured response to the logical form of the statement, and
  the book drills that correspondence until it is automatic. Excellent for
  anyone who finds proofs mysterious. Third edition adds a chapter on
  number theory.
- **Weaknesses:** Mechanical at times; paid.

### Lean — Natural Number Game · Mathematics in Lean
- **Link:** https://adam.math.hhu.de/ (Natural Number Game) ·
  https://leanprover-community.github.io/mathematics_in_lean/
- **Type:** site
- **Difficulty:** 1-3
- **Free:** yes
- **Strengths:** Formal systems you can touch. The Natural Number Game has
  you prove commutativity of addition and friends from the Peano axioms in a
  browser, with a proof assistant checking every step; *Mathematics in Lean*
  continues to sets, functions, real analysis and algebra. Nothing else makes
  "what is a proof, exactly" as concrete — and Lean is the language of the
  dependent type theory in `type-theory`.
- **Weaknesses:** The syntax has a learning curve; Lean's library sometimes
  does the mathematics differently from a textbook.

### Paul Halmos — Naive Set Theory
- **Link:** https://link.springer.com/book/10.1007/978-1-4757-1645-0
- **Type:** book
- **Difficulty:** 2
- **Free:** no (Springer UTM; Dover reprint)
- **Strengths:** The ZFC axioms, functions, order, the natural numbers,
  Zorn's lemma, ordinals and cardinals in a hundred elegant pages. "Naive"
  means informal in style, not in content — it is exactly the set theory a
  working mathematician uses.
- **Weaknesses:** Few exercises, no solutions; terse for a first contact
  with axiomatics.

### Open Logic Project — Sets, Logic, Computation
- **Link:** https://openlogicproject.org/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (CC BY; also *Intermediate Logic*, *Incompleteness and
  Computability* from the same project)
- **Strengths:** A free, modular, actively maintained logic textbook:
  propositional and first-order logic, soundness and completeness, the
  compactness and Löwenheim–Skolem theorems, Turing machines and
  undecidability, Gödel's incompleteness theorems. Problem sets included.
- **Weaknesses:** Written for philosophy as much as mathematics, so the pace
  is deliberate; the modular structure means some repetition.

### Herbert Enderton — A Mathematical Introduction to Logic
- **Link:** https://www.sciencedirect.com/book/9780122384523/a-mathematical-introduction-to-logic
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** The standard rigorous first logic course for mathematicians:
  sentential and first-order logic, completeness and compactness, models of
  arithmetic, undecidability, incompleteness, with a chapter on second-order
  logic. Careful, complete proofs; good exercises.
- **Weaknesses:** Dry; some notation is nonstandard; paid.

### Douglas Hofstadter — Gödel, Escher, Bach
- **Link:** https://www.basicbooks.com/titles/douglas-r-hofstadter/godel-escher-bach/9780465026562/
- **Type:** book
- **Difficulty:** 1
- **Free:** no
- **Strengths:** The popular-science classic on formal systems, self-reference
  and incompleteness: a toy formal system you work through yourself, Gödel's
  trick explained via puzzles, dialogues and Bach canons, and a long
  meditation on minds and machines. Has pulled more people into logic than
  any textbook.
- **Weaknesses:** 800 pages, digressive, and the cognitive-science half is
  dated and speculative; it motivates, it does not teach the theorems.

## Problems

- **Hammack** — odd-numbered exercises have full solutions; do all of
  chapters 4–13.
- **Natural Number Game** — the whole thing is problems; finishing it is the
  benchmark for "I can do induction."
- **Open Logic Project** — problem sets per chapter, free.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Proof bootcamp** — a two-session workshop: negating quantifiers, the
  four proof shapes, induction done right, with a dozen graded exercises and
  a marked-up "bad proof" clinic.
- **Hilbert's hotel to Cantor** — bijections, countability, the diagonal
  argument, and the continuum hypothesis in one afternoon. Resolves pitch
  problems 2 and 3.
- **Russell's paradox and what ZFC does about it** — the paradox, the
  separation axiom, and why "the set of all sets" cannot exist. Resolves
  pitch problem 1.
- **Gödel in sixty minutes** — the incompleteness theorem via the liar
  paradox, honestly stated, with what it does and does not imply. Bridge to
  `advanced-logic`.
- **Lean night** — a hands-on session through the first worlds of the
  Natural Number Game.
