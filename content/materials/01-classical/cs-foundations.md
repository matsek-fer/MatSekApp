---
id: cs-foundations
title: Computer science
category: classical
tagline: What can be computed, how fast, on how many machines — and the mathematics that answers each question.
prerequisites: [logic-sets, combinatorics]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Computer science is the mathematics of *procedure*: not whether an answer
exists, but whether you can get it, how many steps it takes, and what you can
still guarantee when the steps run on a thousand machines that can fail. Each
of those questions has grown into a field with its own theorems.

Algorithms and data structures are where mathematics becomes physical: an
idea about recursion or about hashing turns a day-long computation into a
second. Complexity theory asks which problems are *inherently* hard, and
contains the most famous open question in the subject — P vs NP — which a
first-year student can state and nobody can answer. Distributed systems is
the study of agreement under uncertainty, and its central results are
impossibility theorems: things no protocol can ever do. And applied
mathematics — optimisation, numerical linear algebra — is what actually runs
inside every model that has ever been fit to data.

For a mathematician, CS is where abstractions get tested against reality. For
a programmer, it is where "it works" becomes "it works, and here is why, and
here is what it costs."

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **A hundred prisoners and a hundred boxes.** A room holds 100 closed
   boxes, each containing one of the numbers 1 to 100, shuffled at random.
   Prisoners numbered 1 to 100 enter one at a time; each may open at most
   50 boxes looking for their own number, then must leave the room exactly
   as it was, without communicating. If *every* prisoner finds their number,
   all go free; if even one fails, all die. Opening boxes at random gives
   each prisoner a ½ chance, so the group survives with probability 2^{−100}.
   Find a strategy, agreed in advance, under which the group survives with
   probability above 30 %.

   <details><summary>Hint 1</summary>
   A number inside a box is also the label of a box. The prisoners cannot
   share information, but the boxes themselves can tell each prisoner
   where to look next.
   </details>
   <details><summary>Hint 2</summary>
   Open the box with your own number; whatever it contains, open the box
   with that number next. The boxes define a permutation, and everyone
   succeeds exactly when no cycle is longer than 50.
   </details>
   <details><summary>Hint 3</summary>
   The probability that a random permutation of 100 has a cycle longer
   than 50 is Σ_{k=51}^{100} 1/k ≈ ln 2, so the group survives with
   probability about 31 %. Why the strategy works is a question about the
   structure of the data, not about luck.
   </details>

2. **Find the repeated number without a notebook.** A long sheet of paper
   lists n + 1 whole numbers, each between 1 and n, so some value appears
   at least twice. You may look at any position on the sheet as often as
   you like, but you cannot write anything down and can hold only a fixed
   handful of numbers in your head, however large n is. Find a repeated
   value with a number of looks proportional to n. (Remembering which
   numbers you have seen is out — that takes n slots. So is reordering the
   sheet.)

   <details><summary>Hint 1</summary>
   Every number on the sheet is also a position on the sheet. Use that to
   turn the list into a path you can walk.
   </details>
   <details><summary>Hint 2</summary>
   Read the sheet as a rule i → (the number at position i), from
   {1, …, n+1} to {1, …, n}, and follow it from position n + 1. The walk
   must eventually enter a cycle, and the value at the cycle's entry is a
   duplicate. Find the entry with two walkers moving at different speeds.
   </details>
   <details><summary>Hint 3</summary>
   Floyd's tortoise-and-hare. The same idea finds the period of a
   pseudo-random generator and factors integers in Pollard's rho method.
   </details>

3. **Attack at dawn, or not at all.** n generals must agree whether to
   attack, by exchanging messengers; some of them are traitors who may
   send anything to anyone. The loyal generals must all reach the same decision, and if
   the commander is loyal, that decision must be the commander's order.
   (a) Prove that with 3 generals, one of them a traitor, no protocol can
   work — however many rounds of messages are exchanged. (b) Design a
   protocol for 4 generals with one traitor, and prove it works.

   <details><summary>Hint 1</summary>
   (a) Consider three scenarios in which the lieutenants see the same
   messages but a different general is the traitor.
   </details>
   <details><summary>Hint 2</summary>
   (b) Two rounds: the commander sends an order; each lieutenant relays what
   it received to the others; each lieutenant decides by majority of the
   three values it holds.
   </details>
   <details><summary>Hint 3</summary>
   Lamport–Shostak–Pease (1982): agreement is possible exactly when more
   than two thirds of the generals are loyal. The argument is why
   blockchains and replicated databases need 3f + 1 nodes to survive f
   faulty ones.
   </details>

## Prerequisites

- **Sets, logic** (`logic-sets`): induction is the engine of algorithm
  correctness proofs.
- **Combinatorics** (`combinatorics`): counting, recurrences and generating
  functions for running-time analysis.
- **Linear algebra** and **real analysis** (`linear-algebra`,
  `real-analysis`) for convex optimisation.
- Working knowledge of one programming language.

## From the general materials

- **Princeton Companion** — essays "Computational complexity",
  "Algorithms", "Computability", "The P versus NP problem".
- **3Blue1Brown** — videos on hashing and Bloom filters, Hamming codes, and
  the Fourier transform; good single-topic motivation.
- **Real Not Complex** — Computer Science pages (algorithms, theory of
  computation).
- The Napkin has no computer science part.

## Materials

### Jeff Erickson — Algorithms
- **Link:** https://jeffe.cs.illinois.edu/teaching/algorithms/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (CC licence; PDF, plus extensive extra lecture notes)
- **Strengths:** The best-written undergraduate algorithms text: recursion,
  backtracking, dynamic programming, greedy, graphs, shortest paths,
  flows, NP-hardness, with proofs that are actually proofs and exercises
  that are actually interesting. Erickson's rants on how to *think* about
  recursion are worth the download alone.
- **Weaknesses:** Fewer data structures than CLRS; no code, only pseudocode;
  the extra notes are in draft.

### Cormen, Leiserson, Rivest & Stein — Introduction to Algorithms (CLRS)
- **Link:** https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The reference: every standard algorithm and data structure,
  with analysis, in one place. The 4th edition adds machine-learning
  algorithms and online algorithms. Exercise sets are vast.
- **Weaknesses:** 1300 pages of uniform tone; not a book to read, a book to
  look things up in. Use Erickson to learn, CLRS to check.

### cp-algorithms
- **Link:** https://cp-algorithms.com/
- **Type:** site
- **Difficulty:** 1-3
- **Free:** yes
- **Strengths:** Concise articles on hundreds of algorithms — number theory,
  string algorithms, segment trees, flows, geometry — each with explanation,
  complexity, working C++ and a list of practice problems. The fastest way
  from "I have heard of X" to "I can implement X".
- **Weaknesses:** Terse; assumes competitive-programming context; correctness
  arguments are sketched, not proved.

### Michael Sipser — Introduction to the Theory of Computation
- **Link:** https://www.cengage.com/c/introduction-to-the-theory-of-computation-3e-sipser/9781133187790/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The standard theory-of-computation course: automata and
  regular languages, context-free grammars, Turing machines, decidability,
  reducibility, time and space complexity, P vs NP, NP-completeness. Proofs
  are preceded by "proof ideas"; every chapter is a model of exposition.
- **Weaknesses:** Stops at the classical results; paid; exercises have
  selected solutions only.

### Arora & Barak — Computational Complexity: A Modern Approach
- **Link:** https://theory.cs.princeton.edu/complexity/
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (authors' draft PDF; Cambridge in print)
- **Strengths:** Graduate complexity theory: the polynomial hierarchy,
  randomised computation, interactive proofs, PCP theorem, circuit lower
  bounds, derandomisation, quantum computation. Where to go when Sipser
  leaves you wanting to know *why* P vs NP is hard.
- **Weaknesses:** Dense; the free draft has errors fixed in print; requires
  comfort with probability and algebra.

### MIT 6.5840 — Distributed Systems
- **Link:** https://pdos.csail.mit.edu/6.824/
- **Type:** course
- **Difficulty:** 3
- **Free:** yes (lecture videos, notes, papers and labs)
- **Strengths:** The canonical distributed-systems course: MapReduce, GFS,
  Raft, linearisability, transactions, Spanner, with labs in which you
  implement Raft and a sharded fault-tolerant key-value store yourself. The
  readings are the original papers.
- **Weaknesses:** Serious time commitment (the labs are weeks of work); Go
  required.

### Martin Kleppmann — Designing Data-Intensive Applications
- **Link:** https://dataintensive.net/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The readable distributed-systems book: replication,
  partitioning, transactions, consistency and consensus, batch and stream
  processing, with the impossibility results (two generals, FLP, CAP)
  explained honestly and connected to real systems. Extensive references
  to the literature.
- **Weaknesses:** Engineering-oriented; proofs are cited, not given. Pair
  with 6.5840 for depth.

### Boyd & Vandenberghe — Convex Optimization
- **Link:** https://web.stanford.edu/~boyd/cvxbook/
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (authors' PDF, Stanford EE364A lectures and solved
  additional exercises)
- **Strengths:** The applied-mathematics anchor: convex sets and functions,
  duality, KKT conditions, interior-point methods, with applications in
  statistics, signal processing and control. Hundreds of exercises, many
  solved; the lectures are excellent. Makes `linear-algebra` and
  `real-analysis` suddenly useful.
- **Weaknesses:** Convex only; little on non-convex or stochastic
  optimisation (machine learning's actual regime).

## Problems

### Codeforces · AtCoder
- **Link:** https://codeforces.com/problemset · https://atcoder.jp/contests/
- **Type:** problems
- **Difficulty:** 1-4
- **Free:** yes
- **Strengths:** Thousands of judged problems sorted by difficulty, with
  editorials; the best way to find out whether you can actually implement
  what you have read.
- **Weaknesses:** Competitive-programming style rewards speed and tricks
  over design; no systems or complexity-theory content.

### USACO Guide
- **Link:** https://usaco.guide/
- **Type:** site
- **Difficulty:** 1-3
- **Free:** yes
- **Strengths:** A structured, free curriculum from first programs to
  advanced algorithms, each module with explanation, resources and curated
  problems in difficulty order. The on-ramp to Codeforces.
- **Weaknesses:** Olympiad-shaped; stops at algorithms.

Erickson's and Sipser's exercises cover the theory side.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Prisoners and permutations** — the strategy, the cycle structure of
  random permutations, the 31 % computed. Resolves pitch problem 1; joint
  with `probability`.
- **Cycle finding** — the duplicate, Floyd's and Brent's algorithms,
  Pollard's rho. Resolves pitch problem 2.
- **Byzantine agreement** — the 3-general impossibility, the 4-general
  protocol, then FLP and CAP: what engineers do about them. Resolves pitch
  problem 3.
- **Why n log n?** — the comparison-sort lower bound by decision trees.
- **Counting without counting** — HyperLogLog from the coin-flip trick,
  with a thirty-line implementation; joint with `probability`.
- **Algorithms as recursion** — Erickson's method applied to five classic
  problems, live.
