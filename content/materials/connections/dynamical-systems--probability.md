---
between: [dynamical-systems, probability]
tagline: Dynamics hands probability stationary sequences and the ergodic theorem; probability gives chaotic maps the invariant measures that make their long-run statistics theorems.
strength: 2
status: draft
ai_generated: true
---

A map T preserving a measure μ, μ(T⁻¹A) = μ(A), is at once a dynamical
system and a probability space. An observable f along one orbit is the
sequence f(x), f(Tx), f(T²x), …; across the space it is a random variable
with mean ∫ f dμ. Birkhoff's theorem says the two agree, and the fields
trade through it.

Dynamics gives probability a model for dependence. A stationary sequence is
f, f∘T, f∘T², … for the shift T on sequence space, f the first coordinate
and the law of the process the measure T preserves; Birkhoff is then the
strong law of large numbers for every stationary ergodic sequence. A
Markov chain is a random dynamical system, each step an independently
chosen map, whose distribution follows the linear map μ ↦ μP on the
simplex; its fixed point π (`linear-algebra`) is the invariant measure, and
Kac's lemma reads the mean return time to a state as 1/πᵢ.

Probability gives chaos its statistics. An orbit of the logistic map at
r = 4 cannot be predicted, but its histogram can: the map preserves the
density 1/(π√(x(1 − x))), obtained from the tent map through
x = sin²(πθ/2), and Birkhoff sends almost every orbit's histogram to it.
Krylov–Bogolyubov guarantees such a measure for every continuous map on a
compact space.

## The doubling map is a fair coin

Birkhoff's ergodic theorem: if T preserves the probability measure μ and
f ∈ L¹(μ), then (1/n) Σₖ₌₀ⁿ⁻¹ f(Tᵏx) converges for μ-almost every x to a
T-invariant function with the same integral as f; if T is ergodic, every
invariant set having measure 0 or 1, the limit is the constant ∫ f dμ.

Take T(x) = 2x mod 1 on [0, 1) with Lebesgue measure λ; T⁻¹[a, b) is two
intervals of total length b − a, so λ is preserved. In binary,
x = 0.d₁d₂d₃…, T deletes the first digit, so f = 1_[½, 1) reads off
f(Tᵏx) = dₖ₊₁(x): step k of a deterministic map is toss k of a fair coin.
Invariant sets are tail events of the digits, trivial by Kolmogorov's 0–1
law, so T is ergodic and Birkhoff gives (d₁ + ⋯ + dₙ)/n → ½ for almost
every x: Borel's normal number theorem, pitch problem 3 of `probability`.
T doubles errors, Lyapunov exponent log 2, so each step spends one bit of
x, the entropy of a fair coin.

## Where to see it

Brin & Stuck's ergodic-theory chapter, on `dynamical-systems`, proves
Birkhoff and treats the doubling map; Hirsch–Smale–Devaney code the
doubling map by binary digits without measure. On `probability`, Durrett's
chapter on ergodic theorems proves Birkhoff and applies it to Markov
chains; Grimmett & Stirzaker's Markov-chains chapter has the ergodic
theorem for chains.

| Dynamical systems | Probability |
|---|---|
| phase space X with an invariant measure μ | probability space (Ω, 𝓕, P) |
| measure-preserving map T, μ(T⁻¹A) = μ(A) | stationary sequence Xₙ = f(Tⁿx) |
| orbit x, Tx, T²x, … | sample path |
| observable f: X → ℝ | random variable |
| time average (1/n) Σ f(Tᵏx) | empirical mean |
| space average ∫ f dμ | expectation E[f] |
| ergodic: invariant sets have measure 0 or 1 | trivial invariant σ-algebra; Kolmogorov's 0–1 law for the Bernoulli shift |
| Birkhoff's ergodic theorem | strong law of large numbers for stationary, dependent sequences |
| mixing: μ(A ∩ T⁻ⁿB) → μ(A)μ(B) | asymptotic independence; decay of correlations |
| doubling map 2x mod 1 with Lebesgue measure | fair coin flipped forever, the Bernoulli shift on {0, 1}^ℕ |
| Lyapunov exponent log 2 | entropy of a fair coin, one bit per step |
| Poincaré recurrence | Kac's lemma, mean return time 1/μ(A); recurrence time 1/πᵢ of a Markov chain |
| μ ↦ μP iterated on the simplex | Markov chain; stationary distribution π as invariant measure |
| logistic map at r = 4 | arcsine density 1/(π√(x(1 − x))) |
