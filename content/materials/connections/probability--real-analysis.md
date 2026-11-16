---
between: [probability, real-analysis]
tagline: Probability is measure theory with mass one; analysis lends it the Lebesgue integral and its limit theorems and gets back intuition and random constructions.
strength: 3
status: draft
ai_generated: true
---

A probability space (Ω, 𝓕, P) is a measure space whose total mass is one, and
everything else is renaming. An event is a measurable set, a random variable X:
Ω → ℝ is a measurable function, its expectation E[X] = ∫ X dP is the Lebesgue
integral of `real-analysis`, and "almost surely" means "outside a set of
measure zero".

## What each side lends

Analysis turns probabilistic sentences into theorems. Carathéodory's extension
theorem builds a measure on infinite coin-flip sequences from the probabilities
of finitely many flips, so "flip a fair coin forever" names an object. Monotone
and dominated convergence say when E and lim may be swapped; the strong law,
martingale convergence and the central limit theorem are statements about
integrals over Ω. Fubini on a product measure is E[XY] = E[X]E[Y] for
independent X, Y; Radon–Nikodym supplies densities and conditional
expectation; Hölder and Jensen are the inequalities of Lᵖ(Ω, P).

Probability repays in intuition and proofs. Bernstein's proof of the
Weierstrass approximation theorem is Chebyshev on a binomial variable: Σₖ
f(k/n) C(n, k) xᵏ(1 − x)ⁿ⁻ᵏ is E[f(Sₙ/n)] with Sₙ ~ Bin(n, x), and Var(Sₙ/n) ≤
1/4n for every x sends it to f(x) uniformly. Almost every Brownian path is
continuous and nowhere differentiable: the monster of the `real-analysis` pitch
is the typical function. Williams proves Radon–Nikodym by martingale
convergence; along dyadic intervals, the Lebesgue differentiation theorem is
the same martingale theorem.

## Why Riemann is not enough, in one bridge

The Riemann integral needs a box in ℝⁿ and is not closed under pointwise
limits: indicators of finite sets are integrable, their limit 1_ℚ is
not. Take Ω = [0, 1) with Lebesgue measure λ and let dₙ(x) be the n-th binary
digit of x. Then d₁, d₂, … are independent with P(dₙ = 1) = ½, because every
pattern of the first n digits is one interval of length 2⁻ⁿ: {d₁ = 1, d₂ = 0} =
[½, ¾) has length ¼ = ½ · ½. A uniform random number is an infinite sequence of
fair coin flips; pitch problems 2 and 3 of `probability` are one problem.
Borel's theorem (1909): for λ-almost every x, (d₁(x) + ⋯ + dₙ(x))/n → ½. The
exceptional set and its complement are both dense, so its indicator is
Riemann-integrable on no interval: "measure zero" is the only sense in which
the fraction of heads tends to ½.

## Where to see it

Tao's *An Introduction to Measure Theory*, on both pages, opens with what
Jordan measure, the Riemann side, cannot do; Williams builds (Ω, 𝓕, P) in sixty
pages and proves the strong law; Durrett's first chapter is the phrasebook
below made formal; Grimmett & Stirzaker's convergence chapter is the
measure-light version.

| Real analysis | Probability |
|---|---|
| measure space (Ω, 𝓕, μ) with μ(Ω) = 1 | probability space (Ω, 𝓕, P) |
| measurable set A | event |
| measurable function X: Ω → ℝ | random variable |
| Lebesgue integral ∫ X dμ | expectation E[X] |
| ∫ 1_A dμ = μ(A) | E[1_A] = P(A), the indicator trick |
| almost everywhere | almost surely |
| convergence in measure | convergence in probability |
| convergence in Lᵖ | convergence in p-th mean |
| dominated convergence theorem | when E[lim Xₙ] = lim E[Xₙ] |
| image measure μ∘X⁻¹ on ℝ | distribution (law) of X |
| product measure and Fubini | independence, E[XY] = E[X]E[Y] |
| Radon–Nikodym derivative dν/dμ | density f_X; conditional expectation E[X \| 𝒢] |
| Lebesgue measure on [0, 1) | a uniform random number; infinitely many fair coin flips |
| Fourier transform | characteristic function; the central limit theorem |
