---
between: [combinatorics, probability]
tagline: Combinatorics supplies the finite sample space probability computes on; probability gives back the random object that proves things exist without constructing them.
strength: 3
status: draft
ai_generated: true
---

On a finite set Ω with the uniform measure, P(A) = |A|/|Ω| and E[X] is the
average of X over Ω: a probability is a count divided by a count, an
expectation a mean over all objects. A statement about a random object is
therefore a statement about a proportion of objects, and P(A) > 0 says exactly
that A is non-empty.

## What each side lends

Combinatorics hands probability its sample spaces and the means to count
them: the binomial distribution is C(n, k) with weights; the birthday and
matching problems in Blitzstein & Hwang are inclusion–exclusion, the
derangement count Dₙ ≈ n!/e becoming P(no fixed point) → 1/e; the generating
function ∑ aₙxⁿ returns as G(s) = ∑ P(X = n) sⁿ, so independent variables add
by multiplying series.

Probability repays with the probabilistic method, pigeonhole with weights: if
E[X] ≥ t, some ω has X(ω) ≥ t, and if a random object has fewer than one bad
configuration on average, some object has none. Linearity of expectation
computes the averages even when the pieces are dependent: split a graph's
vertices at random; each of its m edges crosses with probability ½, so some
cut has at least m/2 edges. The Erdős–Rényi random graph G(n, p) turns
"almost all graphs" into a limit with sharp thresholds (connectivity at
p = ln n/n), and concentration — Chebyshev, then Chernoff — upgrades "on
average" to "for almost every graph".

## Erdős's bound, stated

Erdős's 1947 bound, promised for pitch problem 3 of `combinatorics`: for
k ≥ 3, R(k, k) > 2^(k/2). Colour each edge of Kₙ red or blue with an
independent fair coin. A fixed k-set of vertices is monochromatic with
probability 2 · 2^(−C(k, 2)), so the expected number of monochromatic k-sets is
C(n, k) · 2^(1 − C(k, 2)). If this is below 1, some colouring has no
monochromatic Kₖ, and R(k, k) > n. With n = ⌊2^(k/2)⌋,
C(n, k) < nᵏ/k! ≤ 2^(k²/2)/k!, so the expectation is below 2^(1 + k/2)/k!,
less than 1 from k = 3 on. Take k = 10, n = 32: about 6.5 × 10⁷ ten-sets, each
monochromatic with probability 2⁻⁴⁴, expectation about 4 × 10⁻⁶, so some
colouring of K₃₂ has no monochromatic K₁₀. No explicit construction comes
close.

## Where to see it

Jukna's *Extremal Combinatorics* has a part on the probabilistic method,
Erdős's bound among its first examples; Bóna's chapter on the method is the
gentle version. On the `probability` side, Blitzstein & Hwang's first chapter
is pure counting, Errichto's *Expected Value* posts drill linearity on exactly
these indicator sums, and Grimmett & Stirzaker cover probability generating
functions and random walks. The table is a phrasebook between
`combinatorics` and `probability`.

| Combinatorics | Probability |
|---|---|
| finite set Ω of objects | sample space with the uniform measure |
| \|A\|/\|Ω\| | P(A) |
| at least one object lies in A | P(A) > 0 |
| average of f over all objects | E[X] for a uniformly random object |
| some object has f at least the average (pigeonhole) | some ω has X(ω) ≥ E[X] |
| double counting incidences | indicator variables and linearity of expectation |
| inclusion–exclusion | Bonferroni inequalities; the union bound is the first term |
| generating function ∑ aₙxⁿ | probability generating function ∑ P(X = n) sⁿ |
| binomial coefficient C(n, k) | binomial distribution |
| derangements, Dₙ/n! → 1/e | matching problem, P(no fixed point) → 1/e |
| lattice path, Dyck path | simple random walk, ballot theorem |
| graph on n vertices, each edge present or not | Erdős–Rényi G(n, p) |
| "almost all graphs have the property" | P(G(n, p) has it) → 1 as n → ∞ |
| expected number of bad configurations below 1 | an object with none exists |

