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
vectors, distributions on a finite set and transition rules are vectors and
matrices, so the theorems of `linear-algebra` apply to them verbatim; in
return, some of those theorems only mean something once a random experiment
is attached.

## What each side lends

Linearity of expectation drives every problem in Errichto's *Expected Value*
posts. The covariance matrix Σ of a random vector X ∈ ℝⁿ, Σᵢⱼ = Cov(Xᵢ, Xⱼ),
is symmetric and positive semidefinite because vᵀΣv = Var(v·X) ≥ 0; the
spectral theorem gives it an orthonormal eigenbasis whose top eigenvector is
the direction of greatest variance — principal component analysis is that
theorem read as statistics. Conditional expectation E[X | 𝒢] is the orthogonal
projection of X onto the 𝒢-measurable random variables in L². A Markov chain
on n states is an n×n row-stochastic matrix P, with distribution μPᵏ after k
steps (`dynamical-systems`).

Probability repays in meaning and algorithms. The PageRank vector of the
`linear-algebra` pitch problem is the stationary distribution of a surfer
clicking random links, and the second-largest eigenvalue in modulus is how fast
it forgets the start. Freivalds' check verifies AB = C in O(n²) time by
comparing A(Bx) with Cx for a uniform x ∈ {0, 1}ⁿ; a wrong C survives with
probability at most ½.

## The bridge, stated

Perron–Frobenius for stochastic matrices: if P is an n×n matrix with
non-negative entries and row sums 1, and some power of P has all entries
positive, then every eigenvalue other than 1 has |λ| < 1, there is a unique
probability vector π with πP = π, and μPᵏ → π for every starting distribution
μ.

Take the weather chain P = [[0.9, 0.1], [0.5, 0.5]] on the states sun, rain.
From πP = π, 0.9a + 0.5b = a, so a = 5b and π = (5/6, 1/6).
The characteristic polynomial λ² − 1.4λ + 0.4 has roots 1 and 0.4, so any
forecast's gap from π shrinks by a factor 0.4 per day. Diagonalising, as in the
Fibonacci pitch problem, gives the k-day forecast in closed form.

## Where to see it

Strang's 18.06 has a lecture on Markov matrices; Grimmett & Stirzaker's Markov
chains chapter runs the argument for general n; Williams makes the
projection picture rigorous; Axler's chapter on operators on inner product
spaces proves the spectral theorem behind covariance. The table is a phrasebook
between `linear-algebra` and `probability`.

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

