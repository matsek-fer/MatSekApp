---
id: cs-foundations
title: Computer science — algorithms, complexity, distributed systems, applied mathematics
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

1. **Sorting a million numbers.** The obvious method — repeatedly find the
   smallest and move it to the front — takes about 10¹² steps. A better idea
   takes about 2·10⁷, fifty thousand times fewer, on the same hardware. Now
   the real question: how can you *prove* that no method, however clever, can
   do fundamentally better than that?
2. **Counting a billion visitors in a kilobyte.** A website gets a billion
   visits and wants to know how many *distinct* people came. The obvious
   method — remember everyone you have seen — needs gigabytes of memory.
   There is a method that uses about one kilobyte, is off by only a couple of
   percent, and rests on a party trick: ask everyone in a room to flip a coin
   until they get tails and report their longest run of heads; from the
   longest run in the room you can estimate how many people were flipping.
   Why does the longest streak know how many people there were — and how do
   you turn that into an algorithm every large database now runs?
3. **The two generals.** Two armies on opposite hills must attack at the same
   moment or lose. They can only communicate by messengers who might be
   captured. Can they ever be *certain* they agree? Provably not — no
   protocol works. Every database that runs on more than one computer lives
   with the consequences of that proof.

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

- **Why n log n?** — the comparison-sort lower bound by decision trees.
  Resolves pitch problem 1.
- **Counting without counting** — from the coin-flip trick to
  HyperLogLog: hashing, the longest-run estimator, averaging buckets, with
  a thirty-line implementation. Resolves pitch problem 2; joint with
  `probability`.
- **P vs NP in one hour** — the question, reductions, why sudoku is SAT,
  what a proof would and would not change.
- **Impossibility results** — two generals, FLP, CAP: statements,
  proof sketches, what engineers do about them. Resolves pitch problem 3.
- **Algorithms as recursion** — Erickson's method applied to five classic
  problems, live.
