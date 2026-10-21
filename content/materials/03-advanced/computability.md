---
id: computability
title: Computability & complexity, advanced
category: advanced
tagline: The limits of computation — what no algorithm can do, what no fast algorithm can do, and the handful of ideas that prove it.
prerequisites: [cs-foundations, logic-sets, probability]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

`cs-foundations` introduces Turing machines, the halting problem and P vs
NP. This topic is the theory behind them, and it is one of the great
intellectual achievements of the twentieth century: a precise mathematics of
what can be computed at all, and of what can be computed with bounded
resources.

The computability half has a single engine — diagonalisation, the same trick
Cantor used to show the reals are uncountable — and uses it to prove that
specific, natural questions have no algorithm: whether a program halts,
whether two programs do the same thing, whether a polynomial equation has
integer solutions, whether a set of tiles covers the plane. It also produces
objects of startling character: the busy beaver function, which grows faster
than anything computable and whose values eventually become independent of
the axioms of mathematics.

The complexity half asks the same questions with a clock. Here the engine is
reduction — showing that one problem secretly contains another — and its
first great success was Cook and Levin's proof that a single problem, Boolean
satisfiability, contains every problem whose answers can be checked quickly.
Thousands of problems have since been shown to be the same problem. Whether
that problem is hard is P vs NP; around it has grown a landscape of
complexity classes, randomised and quantum computation, interactive proofs,
and a theory of why certain proof techniques cannot resolve the central
question.

The subject is also a bridge: to `advanced-logic`, of which it is the
other face; to `probability` via randomised algorithms; and to
`game-theory-compositional`, where agents are programs and their reasoning
is bounded.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Fast but not too fast.** Prove that there is a decision problem that
   can be solved in time O(n³) but not in time O(n²). (Fix any reasonable
   machine model; ignore constant factors.)

   <details><summary>Hint 1</summary>
   Diagonalise: on input the description of a machine M, run M on its own
   description for n^{2.5} steps and do the opposite of what it does.
   </details>
   <details><summary>Hint 2</summary>
   Simulating a machine with a clock costs a logarithmic factor, which is
   why the gap between n² and n³ is comfortable.
   </details>
   <details><summary>Hint 3</summary>
   This is the time hierarchy theorem. The same argument separates every
   pair of time bounds that differ by more than a logarithmic factor.
   </details>

2. **One problem to rule them all.** A problem is *checkable* if a proposed
   solution can be verified in polynomial time. Prove that if Boolean
   satisfiability — deciding whether a formula in ∧, ∨, ¬ has a satisfying
   assignment — can be solved in polynomial time, then so can every
   checkable problem.

   <details><summary>Hint 1</summary>
   Write down the whole computation of the verifier as a table of symbols,
   one row per time step.
   </details>
   <details><summary>Hint 2</summary>
   Each cell is determined by the three cells above it; express "the table
   is a valid, accepting computation on some certificate" as a formula of
   polynomial size.
   </details>
   <details><summary>Hint 3</summary>
   This is the Cook–Levin theorem. Every NP-completeness proof since has
   reduced from SAT rather than repeating the tableau.
   </details>

3. **The busy beaver.** Among Turing machines with n states and two
   symbols, let BB(n) be the largest number of steps any of them takes
   before halting when started on a blank tape. (a) Show that BB is a
   well-defined function but is not computable. (b) Show that BB grows
   faster than every computable function. (c) BB(5) = 47 176 870 was proved
   in 2024. Explain why there is an n for which the value of BB(n) cannot be
   determined from the axioms of set theory.

   <details><summary>Hint 1</summary>
   (a) If BB were computable, run a machine for BB(n) + 1 steps to decide
   whether it halts.
   </details>
   <details><summary>Hint 2</summary>
   (b) If f is computable and f(n) ≥ BB(n) infinitely often, build a
   machine that uses f to solve the halting problem.
   </details>
   <details><summary>Hint 3</summary>
   (c) Build a machine that searches for a contradiction in ZFC and halts
   if it finds one. If ZFC is consistent it never halts, but ZFC cannot
   prove that — so ZFC cannot prove the true value of BB(n) for its number
   of states (n = 748 suffices; Aaronson–Yedidia, Riebel).
   </details>

## Prerequisites

- **Computer science** (`cs-foundations`): Turing machines, decidability,
  the classes P and NP, Sipser's part II.
- **Logic** (`logic-sets`): first-order logic, Gödel's theorems as stated
  there; `advanced-logic` runs in parallel.
- **Probability** (`probability`), discrete, for randomised computation.
- `combinatorics` for counting arguments throughout.

## From the general materials

- **Princeton Companion** — essays "Computational complexity",
  "Computability", "The P versus NP problem", "Quantum computation".
- **3Blue1Brown** — a few videos touch the ideas (hashing, the Collatz
  conjecture as undecidable-flavoured).
- **Real Not Complex** — Computer Science pages.
- The Napkin has no computability part.

## Materials

### Nigel Cutland — Computability: An Introduction to Recursive Function Theory
- **Link:** https://www.cambridge.org/9780521294652
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** The gentlest rigorous computability text: an unlimited
  register machine instead of Turing machines, Church's thesis discussed
  honestly, the s-m-n and recursion theorems, undecidability, Rice's
  theorem, degrees of unsolvability. Many exercises with the routine ones
  solved.
- **Weaknesses:** 1980; nothing on complexity.

### Avi Wigderson — Mathematics and Computation
- **Link:** https://www.math.ias.edu/avi/book
- **Type:** book
- **Difficulty:** 3-5
- **Free:** yes (author's PDF; Princeton in print)
- **Strengths:** The whole field surveyed by one of its leaders: P vs NP,
  randomness, cryptography, proof complexity, quantum computation, and
  the influence of computational ideas on the rest of mathematics and
  science. The book to read to see why the subject matters.
- **Weaknesses:** A survey — statements and intuitions, few proofs.

### Arora & Barak — Computational Complexity: A Modern Approach
- **Link:** https://theory.cs.princeton.edu/complexity/
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (authors' draft)
- **Strengths:** See `cs-foundations`. The graduate text: problems 1 and 2
  are its chapters 2–3, then the polynomial hierarchy, circuits,
  randomised and interactive computation, the PCP theorem, and the
  barriers to resolving P vs NP.
- **Weaknesses:** As there.

### Oded Goldreich — Computational Complexity: A Conceptual Perspective
- **Link:** https://www.wisdom.weizmann.ac.il/~oded/cc-book.html
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (author's drafts)
- **Strengths:** Complexity theory organised by concepts rather than
  classes: why each definition is the right one, what each theorem means,
  with extended discussions of P vs NP, pseudorandomness and probabilistic
  proof systems. The companion to Arora–Barak for readers who want the
  reasons.
- **Weaknesses:** Discursive; not a quick reference.

### Scott Aaronson — The Busy Beaver Frontier
- **Link:** https://www.scottaaronson.com/papers/bb.pdf
- **Type:** paper
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** A survey of the busy beaver function: history, the known
  values, the independence results of problem 3, the connection to
  Goldbach and Riemann (machines that halt iff the conjecture fails), and
  open problems a student could attack. Written with Aaronson's usual
  clarity and humour.
- **Weaknesses:** 2020; the BB(5) result of 2024 postdates it.

### Complexity Zoo
- **Link:** https://complexityzoo.net/
- **Type:** site
- **Difficulty:** 3-5
- **Free:** yes
- **Strengths:** A wiki of over five hundred complexity classes with
  definitions, known inclusions and references. The map of the landscape
  that Arora–Barak describes.
- **Weaknesses:** A reference only; assumes you know what you are looking
  for.

### Open Logic Project — Incompleteness and Computability
- **Link:** https://ic.openlogicproject.org/
- **Type:** book
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** See `advanced-logic`. The free textbook that does
  computability theory and incompleteness together — the natural companion
  to Cutland.
- **Weaknesses:** As there.

## Problems

- **Cutland** — exercises per chapter; the undecidability exercises of
  chapters 6–7 are the drill.
- **Arora & Barak** — exercises per chapter; chapter 2's reductions are the
  drill for problem 2.
- **The pitch problems** continue: the hierarchy theorem → space hierarchy
  and Savitch's theorem; Cook–Levin → Karp's 21 problems and the
  dichotomy results; busy beaver → Rice's theorem and the arithmetical
  hierarchy.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Diagonalisation, three ways** — Cantor, the halting problem, the time
  hierarchy theorem: one trick. Resolves pitch problem 1; joint with
  `logic-sets`.
- **Cook–Levin on the board** — the tableau, the formula, then two
  reductions from SAT (3-colouring, subset sum). Resolves pitch problem 2;
  joint with `cs-foundations`.
- **Busy beaver night** — compute BB(2) and BB(3) by hand, prove
  uncomputability, discuss independence. Resolves pitch problem 3; joint
  with `advanced-logic`.
- **Randomness as a resource** — primality testing, the class BPP, and
  why derandomisation is believed possible.
- **What would a proof of P ≠ NP look like?** — relativisation and natural
  proofs as barriers, in one session.
