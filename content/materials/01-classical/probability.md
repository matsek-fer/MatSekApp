---
id: probability
title: Probability (with measure)
category: classical
tagline: Reasoning precisely about uncertainty — and discovering that "probability" needs measure theory to even be defined.
prerequisites: [real-analysis, combinatorics]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Probability is the field where human intuition is most reliably wrong. Monty
Hall, the birthday paradox, Simpson's paradox: smart people argue about these
for hours, and the mathematics settles each in a line. Learning probability is
partly learning a calculus — linearity of expectation, conditioning,
independence — that replaces intuition with something that works.

Then comes the surprise. As soon as you want to talk about infinitely many
coin flips, or a point chosen "uniformly" from an interval, the naive theory
breaks: the probability of every individual outcome is zero, yet some outcome
always happens. Fixing this requires measure theory, and the fix is not a
technicality — it is what makes the laws of large numbers, the central limit
theorem, martingales and Brownian motion into *theorems*. Measure-theoretic
probability is where analysis and combinatorics meet, and it is the language
of statistics, statistical physics, information theory, finance and machine
learning.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Monty Hall.** Three doors, one car, two goats. You pick a door; the host,
   who knows where the car is, opens a different door showing a goat and
   offers you a switch. Switching wins ⅔ of the time. When this was published
   in 1990, thousands of readers — including mathematicians with PhDs — wrote
   in to say it was wrong. It isn't. Why does extra information you "already
   knew" change the odds?
2. **Zero plus zero plus zero equals one.** Pick a real number uniformly at
   random from [0, 1]. The probability of getting exactly 0.5 is 0. So is the
   probability of any other specific number. Yet you always get *some*
   number, so the probabilities should add up to 1. What is wrong with the
   addition? (Nothing — but "adding up" has to be redefined, and that
   redefinition is measure theory.)
3. **In what sense does a coin land heads half the time?** Flip a fair coin
   forever. "The fraction of heads tends to ½" — but the sequence
   HHHHHH… is a perfectly possible outcome and its fraction tends to 1. So the
   statement is false for some outcomes. There are three different ways to
   make it true (three laws of large numbers), and they say genuinely
   different things.

## Prerequisites

- **Combinatorics** (`combinatorics`): counting is the engine of discrete
  probability. Needed from day one.
- **Real analysis** (`real-analysis`): limits, series, Riemann integral for
  the first half; for the measure-theoretic half you need either Tao's
  *Introduction to Measure Theory* or an equivalent, and the material can be
  learned alongside Williams/Durrett.
- Calculus only is enough for Blitzstein–Hwang.

## From the general materials

- **Napkin** — Part on probability: measure spaces built for probabilists,
  random variables, expectation, the laws of large numbers, characteristic
  functions and the central limit theorem.
- **3Blue1Brown** — videos on Bayes' theorem, the binomial distribution and
  the central limit theorem; good motivation for the first half.
- **Princeton Companion** — essays "Probability distributions",
  "Probabilistic models of critical phenomena", "The central limit
  theorem".
- **Real Not Complex** — Probability page.

## Materials

### Blitzstein & Hwang — Introduction to Probability (with Harvard Stat 110)
- **Link:** https://projects.iq.harvard.edu/stat110
- **Type:** book + course
- **Difficulty:** 1-2
- **Free:** yes (full PDF of the book, all lecture videos, and solved
  "strategic practice" problem sets on the linked site)
- **Strengths:** The best first course in probability, period. Stories
  instead of formulas: every distribution comes with the situation that
  produces it, every theorem with the picture that makes it obvious.
  Conditioning is treated as *the* central idea. Hundreds of exercises, many
  solved; Blitzstein's lectures are excellent.
- **Weaknesses:** Entirely non-measure-theoretic; stops before martingales
  and before any serious limit theory.

### Grimmett & Stirzaker — Probability and Random Processes
- **Link:** https://global.oup.com/academic/product/probability-and-random-processes-9780198847595
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The bridge book: starts with events and random variables at
  Blitzstein's level, then convergence of random variables, generating and
  characteristic functions, Markov chains, renewal theory, queues, martingales
  and Brownian motion — all before full measure theory is required. Huge
  exercise sets. The one book that covers the whole undergraduate syllabus.
- **Weaknesses:** Terse; proofs sometimes gloss over the measure-theoretic
  subtleties the book is trying to postpone.

### David Williams — Probability with Martingales
- **Link:** https://www.cambridge.org/core/books/probability-with-martingales/B4CFCE0D5BC28ACD4FF6B5A1D8F6A2E5
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no
- **Strengths:** The classic route into rigorous probability: measure theory
  in the first 60 pages (exactly as much as needed), then independence,
  conditional expectation done right, martingales, the strong law and the
  CLT. Short, opinionated, witty, with excellent exercises. Resolves pitch
  problems 2 and 3 properly.
- **Weaknesses:** Fast; assumes real analysis fluency. The measure-theory
  chapters are a summary, not a course — pair with Tao.

### Rick Durrett — Probability: Theory and Examples
- **Link:** https://services.math.duke.edu/~rtd/PTE/pte.html
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (author's PDF of the 5th edition on the linked page)
- **Strengths:** The standard graduate text: measure-theoretic foundations,
  laws of large numbers, CLT and stable laws, random walks, martingales,
  Markov chains, ergodic theorems, Brownian motion. Hundreds of examples and
  exercises; broad enough to serve as a reference for years.
- **Weaknesses:** Dense; terse proofs; notorious for small errors in older
  editions (the free 5th edition is much improved).

### Terence Tao — An Introduction to Measure Theory
- **Link:** https://terrytao.wordpress.com/books/an-introduction-to-measure-theory/
- **Type:** book
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** See `real-analysis`. Listed here because it is the cleanest
  way to learn the measure theory that Williams and Durrett assume.
- **Weaknesses:** Not a probability book; no conditional expectation or
  martingales.

## Problems from competitive programming

Competitive programming has produced a large body of precise, well-tested
probability problems — mostly discrete, mostly about expected value and
linearity — with editorials. They are an excellent complement to the
textbook exercises above.

### Errichto — Expected Value, parts 1 & 2
- **Link:** https://codeforces.com/blog/entry/62690 (part 1),
  https://codeforces.com/blog/entry/62792 (part 2)
- **Type:** blog
- **Difficulty:** 1-2
- **Free:** yes
- **Strengths:** Expected value from zero, then the "contribution to the sum"
  technique and linearity of expectation, with Codeforces problems to
  practise each idea; accompanying YouTube lectures.
- **Weaknesses:** Discrete only; no probability spaces, no limit theorems.

### __AB__ — High Expectations from Expectations
- **Link:** https://codeforces.com/blog/entry/152586
- **Type:** blog
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** Linearity of expectation pushed hard: indicator variables,
  random processes on trees, non-independent sums, with worked problems. A
  follow-up on Wald's equation (https://codeforces.com/blog/entry/148187)
  shows a stopping-time argument beating a heavy combinatorial editorial.
- **Weaknesses:** Assumes competitive-programming fluency; terse.

### Codeforces problemset — `probabilities` tag
- **Link:** https://codeforces.com/problemset?tags=probabilities
- **Type:** problems
- **Difficulty:** 1-4
- **Free:** yes
- **Strengths:** Hundreds of problems sortable by rating, each with an
  editorial and a judge that tells you whether your answer is right. Filter
  to ratings 1200–1800 for a first pass.
- **Weaknesses:** Problems are about computing, not proving; measure theory
  never appears.

### Project Euler — probability problems
- **Link:** https://projecteuler.net/
- **Type:** problems
- **Difficulty:** 1-4
- **Free:** yes
- **Strengths:** Many problems (search the archive for "probability" or
  "expected") that require a genuine probabilistic insight before any
  programming; solutions are checked, and solvers' forum threads discuss
  the mathematics.
- **Weaknesses:** No editorials until solved; difficulty is unevenly
  labelled.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Paradox hour** — Monty Hall, two envelopes, Simpson's paradox, the
  birthday problem: each stated, voted on, then resolved. Resolves pitch
  problem 1.
- **Why measure?** — one session from "uniform on [0,1]" to σ-algebras,
  ending with the Vitali set. Resolves pitch problem 2; joint with
  `real-analysis`.
- **Three laws of large numbers** — weak, strong, and in Lᵖ: statement,
  what each one *means*, a sequence where one holds and another fails.
  Resolves pitch problem 3.
- **Linearity of expectation drill** — twelve CP-style problems from
  Errichto's posts, solved on the board.
