---
between: [combinatorics, cs-foundations]
tagline: Combinatorics counts the trees, paths and permutations an algorithm leaves behind; computer science decides which counts are answers and turns existence proofs into programs.
strength: 3
status: draft
ai_generated: true
---

An algorithm run on an input of size n leaves behind a finite structure — a
tree of recursive calls, a path of comparisons, a graph of visited states —
whose size is its cost. Analysing it means counting that structure, and
combinatorics counts those anyway. The traffic runs back because a
construction that can be carried out is a program, and its running time is a
theorem about the objects.

## What each side lends

Combinatorics supplies the counting kit. Mergesort's T(n) = 2T(n/2) + n
unrolls to n log₂ n; quicksort's average C(n) = n − 1 + (2/n)∑_{k<n} C(k)
becomes, through C(z) = ∑ C(n)zⁿ, a first-order differential equation solved
by 2(n+1)Hₙ − 4n ≈ 1.39 n log₂ n. The ln 2 behind the hundred prisoners on
the `cs-foundations` page is the cycle structure of permutations, the
exponential formula's first example in Wilf. And graphs are the data
structure of computer science: Hall's marriage theorem and max-flow min-cut
are one chapter in both subjects.

Computer science repays with a definition of difficulty. Wilf's test (1982)
says a formula is an answer only if evaluating it beats listing the objects,
and #P-completeness (Valiant, 1979) marks the counts for which none is
expected. Counting perfect matchings is #P-complete though deciding whether
one exists is polynomial; domino tilings of an m×n board, the 2×n strip of
the `combinatorics` pitch problem included, yield to Kasteleyn's Pfaffian
(1961) because a grid is planar. And the probabilistic method is a randomised
algorithm read as a proof: a random partition cuts each edge of a graph with
probability ½, so some cut has half the edges, and placing vertices one by one
on the side with fewer of their placed neighbours — conditional expectations —
finds one deterministically.

## Sorting needs n log₂ n comparisons

A comparison sort on n distinct keys must finish differently for each of the
n! input orders. Draw it as a binary tree: each node asks "aᵢ < aⱼ?", each
leaf is an output order. A tree with fewer than n! leaves sends two orders to
the same leaf and sorts one wrongly — pigeonhole — and height h allows at
most 2ʰ leaves, so h ≥ log₂ n! ≥ n log₂ n − 1.44n by Stirling. For n = 5,
log₂ 120 ≈ 6.9, so seven comparisons are needed, and Ford–Johnson merge
insertion uses exactly seven; for n = 12 the bound gives 29 and the truth is
30. One count of leaves bounds every algorithm at once.

## Where to see it

*Concrete Mathematics* solves the quicksort recurrence in its chapter on
sums, and Part A of Flajolet–Sedgewick is the dictionary from constructions
to generating functions; CLRS proves the decision-tree bound in its sorting
chapters, Arora–Barak has a chapter on the complexity of counting. The table
is a phrasebook between `combinatorics` and `cs-foundations`.

| Combinatorics | Computer science |
|---|---|
| recurrence aₙ = 2a_{n/2} + n | running time of divide and conquer |
| ordinary generating function | average cost over all inputs of size n |
| permutation as a set of cycles | pointer chasing; the prisoners' strategy |
| binary tree with L leaves has height ≥ log₂ L | decision tree; comparison lower bound |
| pigeonhole principle | two inputs the algorithm cannot tell apart |
| graph, path, matching | data structure; BFS; bipartite matching by flows |
| Hall's marriage theorem | max-flow min-cut on a bipartite network |
| "how many?" | #P; "is there one?" is NP |
| closed formula | polynomial-time algorithm (Wilf's test) |
| E[X] ≥ m/2 ⇒ some X ≥ m/2 | randomised algorithm with a guarantee |
| method of conditional expectations | greedy derandomisation |
