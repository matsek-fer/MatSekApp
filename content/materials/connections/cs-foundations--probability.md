---
between: [cs-foundations, probability]
tagline: Probability lends computer science the expectation and tail bounds that measure coin-tossing algorithms; computer science repays by making entropy and existence proofs run.
strength: 2
status: draft
ai_generated: true
---

An algorithm that tosses coins is a random variable: running time, output and
mistakes are functions of coins and input, so the questions
`cs-foundations` asks — how long, how often wrong, how many bits — become an
expectation, a tail probability and an entropy. In return `probability`
gets algorithms that run its theorems.

## What each side lends

Probability lends the calculus. Independence amplifies: an odd composite
passes one round of Miller–Rabin with probability at most ¼, so twenty
rounds err with probability below 4⁻²⁰ < 10⁻¹². Universal hashing
(Carter–Wegman, 1979) makes two distinct keys collide with probability at
most 1/m, so a chained search among n keys in m slots examines on average at
most 1 + n/m keys, whatever they are.

Computer science repays with meaning. Shannon's source coding theorem gives
entropy its unit: for independent symbols with distribution p, no uniquely
decodable code averages below H(p) = −∑ pᵢ log₂ pᵢ bits per symbol (Kraft's
inequality plus Gibbs'), Huffman's is within one bit, and blocks of n
symbols approach H: by the weak law of large numbers for −log₂ p(Xᵢ), only
about 2^(nH) strings are typical, so nH bits name them. The probabilistic
method becomes an algorithm: a random two-colouring cuts half a graph's
edges on average using only pairwise independence, which ⌈log₂(n+1)⌉ fair
bits supply as parities of their non-empty subsets, so trying every seed
finds one deterministically.

## Randomised quicksort

Choose a pivot uniformly at random, split, recurse. Theorem: for every input
order of n distinct keys the expected number of comparisons is
2(n+1)Hₙ − 4n ≈ 1.39 n log₂ n, Hₙ = 1 + ½ + … + 1/n. In sorted order
z₁ < … < zₙ, zᵢ and zⱼ are compared exactly when the first pivot drawn
from {zᵢ, …, zⱼ} is one of them — a pivot strictly between separates them —
and each of the j − i + 1 keys is equally likely, so the probability is
2/(j − i + 1). Linearity of expectation, indifferent to dependence, gives
E[C] = ∑_{k=1}^{n−1} 2(n − k)/(k + 1) = 2(n+1)Hₙ − 4n. For n = 4: three pairs
at distance 1 contribute 1 each, two at distance 2 contribute ⅔, one at
distance 3 contributes ½: 29/6 ≈ 4.83 against 6 in the worst case.
Randomising the pivot moves the randomness from the input, which an
adversary controls, to the algorithm.

## Where to see it

CLRS proves this bound and universal hashing in its quicksort and hashing
chapters; Erickson's extra notes do hashing and treaps, Arora–Barak
randomised computation and derandomisation. On `probability`, Blitzstein
and Hwang's birthday problem is a hash collision and Errichto's
"contribution to the sum" is the pair argument above.

| Computer science | Probability |
|---|---|
| coin flip, random bit | Bernoulli(½) |
| average case: input drawn at random | the input is the random variable |
| randomised algorithm, worst-case input | the coins are the random variable |
| expected running time | E[T] by linearity, over dependent indicators |
| Las Vegas algorithm | always correct, T random |
| Monte Carlo algorithm | T bounded, P(wrong) ≤ ¼ |
| run k independent rounds | P(all wrong) ≤ 4⁻ᵏ |
| "with high probability" | P(bad) ≤ n^(−c); Chernoff bound |
| hash collision | birthday problem |
| universal hash family | P(h(x) = h(y)) ≤ 1/m for x ≠ y |
| fullest hash bucket | maximum of n balls in n bins, ≈ ln n/ln ln n |
| seed of a pseudorandom generator | small sample space; pairwise independence |
| compressed length per symbol | entropy H(p) = −∑ pᵢ log₂ pᵢ |
| Huffman code | prefix code; Kraft inequality ∑ 2^(−ℓᵢ) ≤ 1 |
| comparison-sort lower bound log₂ n! | entropy of a uniform permutation |
| randomised consensus (Ben-Or) escapes FLP | terminates with probability 1, not surely |
