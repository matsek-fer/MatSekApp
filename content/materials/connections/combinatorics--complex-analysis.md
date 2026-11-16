---
between: [combinatorics, complex-analysis]
tagline: Combinatorics supplies analytic functions whose singularities mean something; complex analysis reads the growth of the counts off the singularity nearest zero.
strength: 3
status: draft
ai_generated: true
---

A generating function ∑ aₙzⁿ is a formal object, but when the aₙ grow at
most exponentially — one reason labelled counts are divided by n! — it
converges on a disc and is holomorphic there. Its singularity nearest the
origin fixes how fast the aₙ grow: the radius of convergence ρ is the
reciprocal of the exponential growth rate (Cauchy–Hadamard), and since the
aₙ are non-negative Pringsheim's theorem puts it on the positive real axis at
z = ρ; the kind of singularity gives the rest.

## What each side lends

Analysis turns a generating function into an asymptotic formula. For a
rational function poles and partial fractions do everything: the tilings of
the `combinatorics` pitch have generating function 1/(1 − z − z²), whose
denominator vanishes nearest 0 at 1/φ, so the count grows like φⁿ; the two
residues are Binet's formula. For an entire function, Cauchy's coefficient
formula aₙ = (1/2πi)∮ f(z) z⁻ⁿ⁻¹ dz with the circle pushed through a saddle
point gives Stirling's formula from f = eᶻ; Hardy and Ramanujan's circle
method, the same integral hugging the unit circle, gives
p(n) ∼ e^(π√(2n/3))/(4n√3) for partitions.

Combinatorics repays with functions whose singularities are forced by what they
count: a sequence construction gives a pole, a labelled set exp f, a cycle
log 1/(1 − f). By Pólya–Carlson, a power series with integer coefficients and
radius 1 is rational or has the unit circle as a natural boundary, so
∏ 1/(1 − zᵏ) cannot be continued past |z| = 1. Coefficients are residues,
aₙ = Res₀ f(z)/zⁿ⁺¹, so Lagrange inversion, [zⁿ] w = (1/n)[wⁿ⁻¹] φ(w)ⁿ when
w = zφ(w), is a two-line change of variable in a contour integral.

## Catalan numbers from a square root

Transfer theorem (Flajolet–Odlyzko): if f is holomorphic in a disc of radius
larger than ρ minus a wedge opening outward from ρ, and f(z) ∼ c(1 − z/ρ)^(−α)
as z → ρ with α not a non-positive integer, then [zⁿ] f ∼ c ρ⁻ⁿ n^(α−1)/Γ(α).
C = 1 + zC² gives C(z) = (1 − √(1 − 4z))/(2z), holomorphic off [¼, ∞), so
ρ = ¼; near ¼, C(z) = 2 − 2(1 − 4z)^(1/2) + O(1 − 4z). The constant
contributes nothing for n ≥ 1; α = −½ and Γ(−½) = −2√π give
Cₙ ∼ 4ⁿ/(n^(3/2)√π). At n = 10 this is 18 708 against C₁₀ = 16 796; the
relative error is about 9/(8n).

## Where to see it

Part B of Flajolet & Sedgewick's *Analytic Combinatorics* is this page at
book length; Wilf's last chapter does Lagrange inversion, poles, algebraic
singularities and Hayman's saddle-point method. Beck et al. cover Laurent
series and residues; Stein & Shakarchi's Gamma-function chapter explains
Γ(α).

| Combinatorics | Complex analysis |
|---|---|
| sequence of counts a₀, a₁, a₂, … of at most exponential growth | power series f(z) = ∑ aₙzⁿ, holomorphic near 0 |
| exponential growth rate of aₙ | 1/ρ, with ρ the distance to the nearest singularity |
| aₙ ≥ 0 | a singularity on the positive real axis at z = ρ (Pringsheim) |
| polynomial factor n^(α−1) in aₙ | a singularity of type (1 − z/ρ)^(−α) |
| coefficient extraction [zⁿ] f | residue of f(z)/zⁿ⁺¹ at 0; Cauchy's formula |
| linear recurrence with constant coefficients | rational f; poles; partial fractions |
| recurrence like Catalan's, C = 1 + zC² | algebraic f; square-root branch point |
| convolution ∑ aₖ b₍ₙ₋ₖ₎ | product f·g |
| sequences, labelled sets, cycles of structures | 1/(1 − f), exp f, log 1/(1 − f) |
| exponential generating function of a labelled class | often entire; saddle-point method |
| partitions, ∏ 1/(1 − zᵏ) | natural boundary on the unit circle; z^(1/24)/η(τ), the inverse of a modular form |
| integer coefficients, radius 1 | rational, or a natural boundary (Pólya–Carlson) |
