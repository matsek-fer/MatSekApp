---
between: [complex-analysis, probability]
tagline: Probability hands its laws to complex analysis as characteristic functions and Stieltjes transforms and gets limit theorems back; Brownian motion repays with harmonic measure.
strength: 2
status: draft
ai_generated: true
---

A law μ on ℝ is read through its transforms: the characteristic function
φ(t) = E[e^(itX)] = ∫ e^(itx) dμ(x), the Fourier transform of μ, and the
moment generating function M(s) = E[e^(sX)]. Independence turns the transform
of a sum into a product, so a theorem about a sum of i.i.d. variables is a
theorem about the power φⁿ, and the rigidity of holomorphic functions does
the rest.

## What each side lends

Complex analysis gives probability its limit theory. Lévy's inversion formula
recovers μ from φ; Lévy's continuity theorem makes φₙ → φ pointwise, with φ
continuous at 0, the same as Xₙ → X in distribution. If
E[e^(a|X|)] < ∞ for some a > 0, then M is holomorphic on the strip |Re s| < a
with φ(t) = M(it) and E[Xᵏ] = M⁽ᵏ⁾(0), so by the identity theorem the moments
determine the law; the lognormal, with no strip, shares its moments with other
laws. Random matrices enter through the Stieltjes transform
s(z) = ∫ dμ(λ)/(λ − z) of the eigenvalue distribution, holomorphic off ℝ:
for a Wigner matrix the resolvent identity forces s² + zs + 1 → 0, and
Stieltjes inversion reads Wigner's semicircle √(4 − x²)/(2π) off the root.

Probability repays through planar Brownian motion. Lévy: for f holomorphic and
non-constant, f(B_t) is a Brownian motion on a different clock. Kakutani:
the exit distribution of B from a domain is harmonic measure, so
u(z) = E_z[f(B_τ)] solves the Dirichlet problem and the maximum principle is
optional stopping for the martingale u(B_t); Davis proved Picard's little
theorem this way in 1975.

## The central limit theorem in three lines

Let X₁, X₂, … be i.i.d. with E[X] = 0, E[X²] = 1 and Sₙ = X₁ + ⋯ + Xₙ. The
characteristic function of Sₙ/√n is φ(t/√n)ⁿ.
The bound |e^(ix) − 1 − ix + x²/2| ≤ min(|x|³/6, x²), integrated against μ,
gives φ(s) = 1 − s²/2 + o(s²), so φ(t/√n)ⁿ = (1 − t²/2n + o(1/n))ⁿ → e^(−t²/2).
That is N(0, 1)'s characteristic function: completing the square in
∫ e^(itx) e^(−x²/2) dx/√(2π) leaves e^(−t²/2) times ∫ e^(−w²/2) dw/√(2π)
along the line Im w = −t, and Cauchy's theorem slides that line onto ℝ,
where the integral is 1. Lévy continuity finishes. For a fair
coin X = ±1, φ(s) = cos s and n log cos(t/√n) = n(−t²/2n + O(n⁻²)) → −t²/2:
de Moivre–Laplace in one line.

## Where to see it

On `probability`, Durrett's third chapter is this page at book length, from
Lévy inversion to stable laws, and Williams's last chapter proves the CLT the
same way; on `complex-analysis`, Stein & Shakarchi do the Gaussian integral
above over a rectangle in their Cauchy's-theorem chapter.

| Probability | Complex analysis |
|---|---|
| law μ of X | characteristic function φ(t) = ∫ e^(itx) dμ(x), the Fourier transform of μ |
| E[e^(a\|X\|)] < ∞ for some a > 0 | M(s) = E[e^(sX)] holomorphic on the strip \|Re s\| < a; φ(t) = M(it) |
| moments E[Xᵏ] | M⁽ᵏ⁾(0); they determine the law by the identity theorem |
| sum of independent variables | product of transforms |
| convergence in distribution | pointwise convergence of φₙ to a φ continuous at 0 (Lévy) |
| X with values in ℕ | G(z) = E[z^X] holomorphic on the unit disc; P(X = k) = G⁽ᵏ⁾(0)/k! |
| extinction probability of a branching process | smallest fixed point of G in [0, 1] |
| infinitely divisible law | zero-free φ = e^ψ (Lévy–Khintchine) |
| eigenvalue distribution of a Hermitian random matrix | Stieltjes transform s(z) = ∫ dμ(λ)/(λ − z); density (1/π) lim Im s(x + iε) |
| eigenvalues of a non-Hermitian random matrix | zeros of a random polynomial; logarithmic potential ∫ log\|λ − z\| dμ(λ) |
| planar Brownian motion B | conformal invariance: f(B) is a time-changed Brownian motion |
| exit distribution of B from a domain | harmonic measure; u(z) = E_z[f(B_τ)] solves the Dirichlet problem |
| u(B_t) is a martingale | u is harmonic; maximum principle by optional stopping |
| random signs on a power series of radius 1 | natural boundary on the unit circle, almost surely |
| Brownian motion driving Loewner's equation | Schramm–Loewner evolution |
