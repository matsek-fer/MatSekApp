---
between: [linear-algebra, probability]
tagline: Probability borrows the vector space, the spectral theorem and the stochastic matrix; linear algebra gets back the random walk that explains its eigenvectors.
strength: 3
status: draft
ai_generated: true
---

The integrable random variables on a sample space Ω add and scale pointwise,
so they form a vector space, and expectation is a linear functional on it:
E[aX + bY] = aE[X] + bE[Y], independent or not. That is the hinge. Random
vectors, distributions on n states and transition rules are vectors and
matrices, so `linear-algebra` applies to them verbatim; in return,
`probability` reads them as long-run frequencies and best guesses, and pays
with randomised algorithms.

## What each side lends

Linearity of expectation is the "contribution to the sum" trick behind
Errichto's *Expected Value* posts. The covariance matrix Σ of a random vector
X ∈ ℝⁿ, Σᵢⱼ = Cov(Xᵢ, Xⱼ), is symmetric and positive semidefinite because
vᵀΣv = Var(v·X) ≥ 0; the spectral theorem gives it an orthonormal eigenbasis,
its top eigenvector the direction of greatest variance — principal component
analysis is that theorem read as statistics. For X ∈ L², conditional
expectation E[X | 𝒢] is its orthogonal projection onto the 𝒢-measurable random
variables. A Markov chain on n states is an n×n row-stochastic matrix P, with
distribution μPᵏ after k steps, a linear dynamical system
(`dynamical-systems`).

Probability repays in meaning and algorithms. The PageRank vector of the
`linear-algebra` pitch problem is the stationary distribution of a surfer
clicking random links; Google's occasional jump to a random page makes every
entry positive, the hypothesis below, and the second-largest eigenvalue in
modulus sets how fast it forgets the start. Freivalds' check verifies AB = C in
O(n²) time by comparing A(Bx) with Cx for uniform x ∈ {0, 1}ⁿ; a wrong C
survives with probability at most ½.

## The bridge, stated

Perron–Frobenius for stochastic matrices: if P has non-negative entries, row
sums 1 and some power with all entries positive, then every eigenvalue other
than 1 has |λ| < 1, exactly one probability vector π satisfies πP = π, and
μPᵏ → π for every starting distribution μ.

Take the weather chain P = [[0.9, 0.1], [0.5, 0.5]] on states sun, rain. From
πP = π, 0.9a + 0.5b = a, so a = 5b and π = (5/6, 1/6). The characteristic
polynomial λ² − 1.4λ + 0.4 has roots 1 and 0.4, with left eigenvector (1, −1)
for 0.4; μ − π is a multiple of (1, −1), so μPᵏ = π + 0.4ᵏ(μ − π), the
Fibonacci pitch problem's diagonalisation, and the gap from π shrinks by a
factor 0.4 per day.

## Where to see it

Strang's 18.06 has a lecture on Markov matrices; Grimmett & Stirzaker's Markov
chains chapter states the theorem for general n; Williams makes the projection
picture rigorous; Axler's chapter on operators on inner product spaces proves
the spectral theorem behind covariance.

| Linear algebra | Probability |
|---|---|
| vector in ℝⁿ | random vector (X₁, …, Xₙ), or a distribution on n states |
| linear functional | expectation E |
| inner product ⟨X, Y⟩ = E[XY] | covariance, after centring |
| symmetric positive semidefinite matrix | covariance matrix Σ |
| spectral theorem | principal component analysis |
| orthogonal projection onto a subspace | conditional expectation E[X \| 𝒢] |
| row-stochastic matrix P | transition rule of a Markov chain |
| eigenvector for eigenvalue 1 | stationary distribution π |
| second-largest eigenvalue in modulus | rate of forgetting the starting state |
