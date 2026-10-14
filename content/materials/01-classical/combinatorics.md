---
id: combinatorics
title: Combinatorics
category: classical
tagline: The art of counting without counting — and of proving things exist by showing there are too many to avoid.
prerequisites: [logic-sets]
status: draft
---

## Pitch

Combinatorics asks the questions a child would ask — how many? is it
possible? — about finite structures, and answers them with tools that are
startlingly deep for how elementary they look. A bijection turns a hopeless
count into a trivial one. The pigeonhole principle, which says nothing more
than "ten pigeons, nine holes, one hole has two," proves theorems nobody can
prove any other way. Generating functions let you do algebra on infinite
sequences and read off exact counts, asymptotics and recurrences in one
stroke.

It is also the field with the lowest barrier to entry and the highest ceiling.
You can start proving real theorems in your first week; the open problems
(Ramsey numbers, the sunflower conjecture) are stated in one sentence and
have resisted everyone for decades. And it underlies the rest of discrete
mathematics: algorithms, probability, coding theory, and much of modern
algebra and geometry speak combinatorics.

## Pitch problems

1. **The handshake theorem.** At any party where some people shake hands,
   there are two people who shook exactly the same number of hands. There is
   no way to arrange the handshakes to avoid it. Why? The proof is three
   lines and uses nothing but counting — and the same idea will later prove
   results that look impossibly hard.
2. **Dominoes and the golden ratio.** How many ways can you tile a 2×n strip
   with 1×2 dominoes? The answers go 1, 2, 3, 5, 8, 13 … — Fibonacci. Now
   encode the whole sequence as a single "polynomial" ∑ aₙxⁿ, do ordinary
   algebra on it, and the closed formula with √5 falls out. Why does
   algebra on a *formal* object know about tilings?
3. **Six people, three friends.** In any group of six people, there are
   either three mutual acquaintances or three mutual strangers. With five
   people this can fail. Now ask: how many people guarantee *five* mutual
   acquaintances or five mutual strangers? The answer is somewhere between
   43 and 48 — and nobody knows which.

## Prerequisites

- **Proofs, sets, logic** (`logic-sets`): induction, bijections, basic set
  operations. That is genuinely all. Combinatorics is arguably the best place
  to *learn* proof-writing.
- For generating functions: comfort with manipulating power series as formal
  objects (Wilf teaches this from scratch).

## Materials

### Graham, Knuth & Patashnik — Concrete Mathematics
- **Link:** https://www.pearson.com/en-us/subject-catalog/p/concrete-mathematics-a-foundation-for-computer-science/P200000003477
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** Sums, recurrences, binomial coefficients, generating
  functions, discrete probability and asymptotics, taught through hundreds of
  worked examples in Knuth's conversational style with the famous margin
  notes. The exercises are graded (warm-ups to research problems) and all
  have answers. The best book for learning to *manipulate* — to actually
  compute a nasty sum rather than admire it.
- **Weaknesses:** Not a survey of combinatorics: no graph theory, little
  extremal or design theory. Leisurely; some find the humour grating.

### Miklós Bóna — A Walk Through Combinatorics
- **Link:** https://www.worldscientific.com/worldscibooks/10.1142/10258
- **Type:** book
- **Difficulty:** 2
- **Free:** no
- **Strengths:** A gentle, complete first course: pigeonhole, induction,
  permutations and binomials, partitions, generating functions, graphs,
  matchings, Ramsey theory, with a taste of algebraic and probabilistic
  methods. Full solutions to all exercises. Excellent for self-study.
- **Weaknesses:** Does not go deep anywhere; a reader with olympiad
  experience will find the first half slow.

### Herbert Wilf — generatingfunctionology
- **Link:** https://www2.math.upenn.edu/~wilf/DownldGF.html
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (author's PDF of the 2nd edition)
- **Strengths:** The classic short book on one idea: a generating function is
  a clothesline on which we hang up a sequence of numbers for display. Covers
  ordinary and exponential GFs, the "exponential formula", asymptotics,
  with charm and many solved exercises. Read it right after Bóna.
- **Weaknesses:** Narrow by design; the analytic chapters are superseded by
  Flajolet–Sedgewick.

### adamant — Combinatorial species: an intuition behind generating functions
- **Link:** https://codeforces.com/blog/entry/126772
- **Type:** blog
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** Explains *why* GF operations work by interpreting each one —
  sum, product, exp, log, composition — as an operation on combinatorial
  species (Joyal's framework), then rederives the standard results
  (permutations as sets of cycles, labelled trees) with no magic. A follow-up
  post (https://codeforces.com/blog/entry/111889) extends this to Pólya
  enumeration. Also a first, concrete taste of the categorical view that the
  `category-theory-intro` topic develops.
- **Weaknesses:** Written for competitive programmers: assumes you already
  know GFs mechanically and want to understand them; terse in places.

### Stasys Jukna — Extremal Combinatorics: With Applications in Computer Science
- **Link:** https://link.springer.com/book/10.1007/978-3-642-17364-6
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no
- **Strengths:** The other half of combinatorics: not "how many" but "how
  large can a structure be before it is forced to contain something."
  Sunflowers, intersecting families, Ramsey theory, the probabilistic method,
  linear-algebra method, polynomial method, each in a short self-contained
  chapter with CS applications. Very well chosen exercises.
- **Weaknesses:** Chapters are independent, so there is no narrative; some
  proofs are too terse for a first encounter with the method.

### Richard Stanley — Enumerative Combinatorics, Vol. 1
- **Link:** https://math.mit.edu/~rstan/ec/
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (author's PDF of the 2nd edition on the linked page)
- **Strengths:** The definitive reference on enumeration: sieve methods,
  partially ordered sets and Möbius inversion, rational generating functions,
  with the legendary graded exercise sets (difficulty 1 to 5+) and full
  solutions. Volume 2 adds trees, symmetric functions, and the 66 ways to
  count Catalan numbers.
- **Weaknesses:** Dense and encyclopaedic; a graduate text. Not a book to
  learn generating functions from — use Wilf first.

### Flajolet & Sedgewick — Analytic Combinatorics
- **Link:** https://ac.cs.princeton.edu/home/
- **Type:** book
- **Difficulty:** 3-5
- **Free:** yes (authors' PDF on the linked page)
- **Strengths:** The "symbolic method": a dictionary from combinatorial
  constructions to GF equations, then complex analysis to extract precise
  asymptotics (singularity analysis, saddle point). The bridge from
  combinatorics to `complex-analysis` and to the analysis of algorithms.
  Beautifully produced, 800 pages, hundreds of worked examples.
- **Weaknesses:** Part B needs real complex analysis; the book is a
  monograph, so there are no exercise solutions and the pace is uneven.

## Problem books

### László Lovász — Combinatorial Problems and Exercises
- **Link:** https://bookstore.ams.org/chel-361
- **Type:** problems
- **Difficulty:** 3-5
- **Free:** no (AMS Chelsea)
- **Strengths:** ~650 problems that together constitute a graduate course in
  combinatorics — enumeration, graphs, matroids, extremal problems,
  spectra — in three sections: problems, hints, full solutions. Many
  "problems" are theorems from research papers.
- **Weaknesses:** Hard; the hints are often the whole idea. For after a first
  course.

### Evan Chen — olympiad combinatorics handouts
- **Link:** https://web.evanchen.cc/olympiad.html
- **Type:** problems
- **Free:** yes
- **Difficulty:** 2-3
- **Strengths:** Short handouts (invariants, extremal principle, double
  counting, algebraic methods) each with a dozen hand-picked problems and
  hints; trains exactly the proof instincts a first course needs.
- **Weaknesses:** Olympiad style — clever tricks over general theory; no
  generating functions or asymptotics.

## Matsek originals (to design)

- **Double counting & pigeonhole bootcamp** — twelve problems from
  handshakes to Erdős–Szekeres, with the common pattern made explicit.
  Resolves pitch problem 1.
- **Generating functions from tilings** — one session from the 2×n strip to
  the Fibonacci closed form to the "exponential formula," ending with the
  species viewpoint from adamant's post. Resolves pitch problem 2.
- **Ramsey in one hour** — R(3,3) = 6, why R(5,5) is open, and the
  probabilistic lower bound. Resolves pitch problem 3; bridge to
  `probability`.
