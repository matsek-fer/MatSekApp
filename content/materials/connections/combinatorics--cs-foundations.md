---
between: [combinatorics, cs-foundations]
tagline: Combinatorics counts the steps, leaves and random choices of an algorithm; computer science tells combinatorics which counts are answers and which proofs are programs.
strength: 3
status: draft
ai_generated: true
---

An algorithm run on an input of size n leaves behind a finite structure — a
tree of recursive calls, a path of comparisons, a graph of visited states —
and its cost is the size of that structure. Analysing the algorithm means
counting the structure, and the structures are the ones combinatorics counts
anyway: permutations, trees, subsets. Traffic runs the other way because a
construction that can be carried out is a program, and its running time is a
fact about the objects.

## What each side lends

Combinatorics lends the counting kit. Running times are recurrences:
mergesort's T(n) = 2T(n/2) + n unrolls to n log₂ n. Average cases are
generating functions: quicksort's expected comparisons satisfy
C(n) = n − 1 + (2/n)∑_{k<n} C(k), and C(z) = ∑ C(n)zⁿ turns this into a
first-order differential equation with solution 2(n+1)Hₙ − 4n ≈ 1.39 n log₂ n.
The hundred prisoners on the `cs-foundations` page survive because
permutations are sets of cycles — the exponential formula of the
`combinatorics` page — which is where the ln 2 in the hint comes from. And
graphs are the data structure of computer science: Hall's marriage theorem
and max-flow min-cut are one chapter in both fields.

Computer science repays with a notion of difficulty. Wilf's test (1982) says
a formula is an answer only if evaluating it beats listing the objects;
Valiant (1979) made the test a complexity class. Counting the perfect
matchings of a bipartite graph is #P-complete although deciding whether one
exists is polynomial, so the domino tilings of the `combinatorics` pitch
problem have Kasteleyn's product formula only because the grid is planar; for
an arbitrary graph no efficient count exists unless P = NP. In return the
probabilistic method is a randomised algorithm read as a proof: a uniformly
random partition of a graph cuts each edge with probability ½, so some cut has
at least half the edges — and placing vertices one at a time on the side with
fewer of their placed neighbours, the method of conditional expectations,
finds one deterministically.

## Sorting needs n log n comparisons

A comparison sort on n distinct keys must finish differently for each of the
n! orderings. Draw its comparisons as a binary tree: each node asks "aᵢ < aⱼ?",
each leaf is an output order. A tree with fewer than n! leaves sends two
orderings to the same leaf and sorts one wrongly (pigeonhole), and height h
allows at most 2ʰ leaves, so h ≥ log₂ n! ≥ n log₂ n − 1.44n by Stirling. For
n = 5, log₂ 120 ≈ 6.9: seven comparisons are necessary, and Ford–Johnson's
merge insertion uses exactly seven. For n = 12 the bound gives 29 but every
algorithm needs 30; counting leaves bounds all algorithms at once.

## Where to see it

*Concrete Mathematics* solves the quicksort recurrence in its chapter on sums;
Flajolet–Sedgewick's Part A is the dictionary from constructions to generating
functions that the analysis of algorithms runs on; CLRS proves the
decision-tree bound in its chapter on sorting in linear time; Jukna's
probabilistic-method part includes derandomisation; Arora–Barak has a chapter
on the complexity of counting. The table is a phrasebook between
`combinatorics` and `cs-foundations`.

| Combinatorics | Computer science |
|---|---|
| recurrence aₙ = 2aₙ/₂ + n | running time of a divide-and-conquer algorithm |
| ordinary generating function | average-case cost over all inputs of size n |
| permutation as a set of cycles | pointer chasing; the prisoners' strategy |
| binary tree with L leaves, height ≥ log₂ L | decision tree; lower bound on comparisons |
| pigeonhole principle | two inputs the algorithm cannot tell apart |
| graph, path, matching | data structure; BFS; bipartite matching by flows |
| Hall's marriage theorem | max-flow min-cut on a bipartite network |
| "how many?" | #P; "is there one?" is NP |
| closed formula | polynomial-time algorithm (Wilf's test) |
| expectation E[X] ≥ m/2 ⇒ some X ≥ m/2 | randomised algorithm with a guarantee |
| method of conditional expectations | greedy derandomisation |
| Erdős's R(k,k) > 2^{k/2} by random colouring | a colouring found by sampling, not construction |
