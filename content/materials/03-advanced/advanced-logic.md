---
id: advanced-logic
title: Advanced logic
category: advanced
tagline: What a formal system can say about itself, which truths lie beyond it, and exactly which axioms each theorem needs.
prerequisites: [logic-sets, cs-foundations, type-theory]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

`logic-sets` ends with Gödel: any consistent formal system strong enough for
arithmetic leaves true statements unprovable, and cannot prove its own
consistency. That is usually where a first course stops, with a sense of
loss. This topic is what comes after, and it is constructive rather than
bleak.

First, the self-reference that Gödel used turns out to obey clean laws.
Löb's theorem says a system that proves "if I can prove S then S" already
proves S; the modal logic GL captures everything arithmetic can prove about
its own provability in four axioms, and it is decidable. Second, the
unprovable statements are not exotic: natural theorems about finite
sequences (Goodstein, the hydra) are unprovable in Peano arithmetic, and
their proofs tell you exactly which infinite principle is missing. Third,
reverse mathematics turns the question around — not "which theorems follow
from these axioms?" but "which axioms does this theorem need?" — and finds
that almost all of ordinary mathematics sorts into five levels, each with a
computational meaning: a theorem needs the Bolzano–Weierstrass level
precisely when it can compute something no algorithm can.

The topic connects `logic-sets` to `computability` (the two are one
subject viewed from two sides), to `type-theory` (termination proofs are
ordinal analyses), and — through Löb's theorem — to
`open-source-game-theory`, where agents who can read each other's source
code cooperate by exactly the reasoning Löb forbids them to doubt.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **The reasoner who believes in Santa.** Let T be a theory that can talk
   about its own proofs, and write □S for "S is provable in T". Suppose T
   proves □S → S for some sentence S. Prove that T proves S. Deduce that a
   consistent T cannot prove □⊥ → ⊥, that is, cannot prove its own
   consistency.

   <details><summary>Hint 1</summary>
   Use the fixed-point lemma to find a sentence ψ with
   T ⊢ ψ ↔ (□ψ → S).
   </details>
   <details><summary>Hint 2</summary>
   The only properties of □ you need: if T ⊢ A then T ⊢ □A;
   T ⊢ □(A → B) → (□A → □B); T ⊢ □A → □□A.
   </details>
   <details><summary>Hint 3</summary>
   This is Löb's theorem. For consistency take S = ⊥. Smullyan tells the
   same story with a reasoner on an island of knights and knaves in
   <em>Forever Undecided</em>.
   </details>

2. **Goodstein's sequence.** Write n in hereditary base-2 notation (every
   exponent also in base 2, recursively), change every 2 to a 3, subtract 1;
   write the result in hereditary base 3, change every 3 to a 4, subtract 1;
   and so on. (a) Compute the sequences starting from 3 and from 4; the
   second one reaches 0 only after about 10^{121 210 695} steps. (b) Prove
   that every Goodstein sequence reaches 0. (c) The statement in (b) cannot
   be proved in Peano arithmetic (Kirby–Paris). Identify the step in your
   proof that Peano arithmetic cannot carry out, and say what it is about.

   <details><summary>Hint 1</summary>
   (b) Replace every base by ω. The resulting ordinals strictly decrease.
   </details>
   <details><summary>Hint 2</summary>
   Ordinals below ε₀ are well-ordered, so the descent is finite.
   </details>
   <details><summary>Hint 3</summary>
   (c) Transfinite induction up to ε₀ is exactly what PA lacks (Gentzen).
   The hydra of <code>type-theory</code> is the same phenomenon.
   </details>

3. **A limit nobody can compute.** Construct a computable sequence of
   rationals q₀ < q₁ < q₂ < ⋯ < 1 whose limit is not a computable real
   number (one whose digits no algorithm produces). Conclude that the
   theorem "every bounded increasing sequence converges" cannot be proved
   using computable reasoning alone, and locate it in the hierarchy of
   reverse mathematics.

   <details><summary>Hint 1</summary>
   Fix an enumeration of all programs and let qₙ = Σ 2^{−(k+1)} over the
   programs k ≤ n that have halted within n steps.
   </details>
   <details><summary>Hint 2</summary>
   Computing the limit to within 2^{−(k+2)} would decide whether program k
   halts.
   </details>
   <details><summary>Hint 3</summary>
   This is a Specker sequence. The monotone convergence theorem is
   equivalent, over RCA₀, to arithmetical comprehension ACA₀ — the same
   level as Bolzano–Weierstrass and the existence of the range of every
   function.
   </details>

## Prerequisites

- **Logic and set theory** (`logic-sets`): first-order logic, Peano
  arithmetic, Gödel's theorems as stated there, ordinals.
- **Computer science** (`cs-foundations`): Turing machines and the halting
  problem; `computability` is the companion topic.
- **Type theory** (`type-theory`): the termination problems there are
  problem 2 from the other side.

## From the general materials

- **Gödel, Escher, Bach** (Hofstadter) — the long route into
  self-reference; this topic is the short one.
- **Napkin** — the set theory part (ordinals, ε₀) is used in problem 2.
- **Sheafification of G** — occasional videos on logic and type theory.
- **Princeton Companion** — essays "Gödel's theorem", "Logic and model
  theory", "Set theory", "Computational complexity".
- **Real Not Complex** — Logic page.

## Materials

### Peter Smith — Gödel Without (Too Many) Tears
- **Link:** https://www.logicmatters.net/igt/godel-without-tears/
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (PDF; the longer *An Introduction to Gödel's Theorems* is
  also on the site)
- **Strengths:** The clearest short route through both incompleteness
  theorems with every step actually proved: arithmetisation, the
  diagonal lemma, the first theorem, the second theorem, Löb's theorem.
  Written for readers with one logic course.
- **Weaknesses:** Covers Gödel only; no reverse mathematics or
  provability logic beyond Löb.

### Open Logic Project — Incompleteness and Computability
- **Link:** https://ic.openlogicproject.org/
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (CC BY)
- **Strengths:** See `logic-sets`. The volume that pairs computability
  theory with incompleteness: recursive functions, the halting problem,
  representability, the incompleteness theorems, with exercises. The free
  textbook companion to this topic and to `computability`.
- **Weaknesses:** Deliberate pace; no Löb, no reverse mathematics.

### Raymond Smullyan — Forever Undecided
- **Link:** https://openlibrary.org/search?q=forever+undecided+smullyan
- **Type:** book
- **Difficulty:** 2
- **Free:** no
- **Strengths:** Gödel's theorems and the modal logic of provability taught
  entirely through puzzles about reasoners on an island of knights and
  knaves. The reader derives Löb's theorem (problem 1) as a puzzle about a
  reasoner who believes in Santa before meeting the formal statement.
  Unique and genuinely fun.
- **Weaknesses:** Out of print in places; the puzzle format slows down
  anyone who already knows the logic.

### George Boolos — The Logic of Provability
- **Link:** https://doi.org/10.1017/CBO9780511625183
- **Type:** book
- **Difficulty:** 4-5
- **Free:** no
- **Strengths:** The definitive text on provability logic: the system GL,
  its completeness and decidability, Solovay's theorem that GL is exactly
  what arithmetic proves about its own provability, fixed points, and
  applications. The second half of problem 1 in full generality.
- **Weaknesses:** Demanding; assumes modal logic and Gödel's theorems.

### Stanford Encyclopedia of Philosophy — Provability Logic
- **Link:** https://plato.stanford.edu/entries/logic-provability/
- **Type:** site
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** A thirty-page survey of GL and its relatives with
  history, the main theorems stated precisely, and a current bibliography.
  The best first read before Boolos.
- **Weaknesses:** A survey; proofs are sketched.

### John Stillwell — Reverse Mathematics: Proofs from the Inside Out
- **Link:** https://press.princeton.edu/books/hardcover/9780691177175/reverse-mathematics
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** Reverse mathematics for a general mathematical reader:
  the five subsystems of second-order arithmetic, which classical theorems
  (intermediate value, Bolzano–Weierstrass, König's lemma) sit at which
  level, and why. Problem 3 is its central example. Historical and
  readable.
- **Weaknesses:** Light on proofs; for the real thing, Simpson's
  *Subsystems of Second Order Arithmetic* (difficulty 5).

### Torkel Franzén — Gödel's Theorem: An Incomplete Guide to Its Use and Abuse
- **Link:** https://www.routledge.com/Godels-Theorem-An-Incomplete-Guide-to-Its-Use-and-Abuse/Franzen/p/book/9781568812380
- **Type:** book
- **Difficulty:** 2
- **Free:** no
- **Strengths:** What the incompleteness theorems do and do not say, with
  the common misreadings (about minds, physics, postmodernism) taken apart
  carefully. Short, precise, and the best antidote to GEB-induced
  overreach.
- **Weaknesses:** Expository; no exercises.

## Problems

- **Smith** — exercises in the longer *Introduction*; the diagonal-lemma
  exercises are the drill for problem 1.
- **Open Logic** — problem sets per chapter.
- **The pitch problems** continue: Löb → the modal system GL and its
  arithmetical completeness (Solovay); Goodstein → Gentzen's consistency
  proof and ordinal analysis; Specker → the Big Five and which theorems
  of `real-analysis` live at which level.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Löb's theorem by puzzle** — Smullyan's island, then the formal proof,
  then the second incompleteness theorem as a corollary. Resolves pitch
  problem 1.
- **Goodstein and the hydra** — compute, prove with ordinals, say what PA
  cannot do. Resolves pitch problem 2; joint with `type-theory`.
- **Specker's sequence** — construct it, prove the limit is uncomputable,
  draw the Big Five. Resolves pitch problem 3; joint with `real-analysis`
  and `computability`.
- **GL in an afternoon** — the four axioms, Kripke semantics, decidability,
  and what Solovay's theorem says.
- **Gödel: use and abuse** — a reading of Franzén for the whole club.
