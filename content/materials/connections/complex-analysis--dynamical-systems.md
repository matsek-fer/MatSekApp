---
between: [complex-analysis, dynamical-systems]
tagline: Rigidity of holomorphic maps makes their iteration classifiable; dynamics repays analysis with Julia sets, the Mandelbrot set and Newton's method on the sphere.
strength: 2
status: draft
ai_generated: true
---

Iterate a rational map f of the Riemann sphere Ĉ and ask what
`dynamical-systems` always asks: which starting points behave stably and
which chaotically? For holomorphic f it has a clean answer. Ĉ splits into an
open Fatou set, where the iterates fⁿ form a normal family, and its closed
complement, the Julia set J(f), where they do not.

## What each side lends

`complex-analysis` supplies the rigidity. Montel's theorem — a family of
holomorphic functions omitting three values of Ĉ is normal — gives at once
that J(f) is non-empty when deg f ≥ 2, perfect, completely invariant and the
closure of the repelling periodic points. Since f_c(z) = z² + c has one
finite critical point, 0, and every attracting basin contains one (Fatou),
the orbit of 0 decides everything: c lies in the Mandelbrot set M exactly
when it stays bounded, and then J(f_c) is connected, otherwise a Cantor set
carrying the shift on two symbols. Montel rests on the Cauchy estimates —
bounded holomorphic families are equicontinuous — which real maps lack, so
the logistic map on an interval gets no Fatou–Julia split.

Dynamics supplies the objects: Newton's method, Cayley's 1879 question about
z³ − 1, period doubling. The logistic map x ↦ r·x(1 − x) is affinely
conjugate, via z = r(1/2 − x), to z² + c with c = r/2 − r²/4, so the
bifurcation diagram of pitch problem 2 on `dynamical-systems` is M ∩ ℝ =
[−2, 1/4]: r = 3 is c = −3/4, where the main cardioid meets the period-2
disc, and Feigenbaum's 4.669… is the rate the discs shrink.

## Newton's method on the sphere

For a polynomial p of degree d, N(z) = z − p(z)/p′(z) is a rational map of
Ĉ; a simple root is a superattracting fixed point, N′ = p·p″/(p′)² = 0,
hence quadratic convergence, and ∞ is repelling with multiplier d/(d − 1).
For p(z) = z² − 1, N(z) = (z² + 1)/(2z). With M(z) = (z − 1)/(z + 1),
sending the roots to 0 and ∞, M(N(z)) = (z − 1)²/(z + 1)² = M(z)², so N is
conjugate to w ↦ w². The Julia set is the preimage of the unit circle, the
imaginary axis, where Newton doubles angles and never converges; every other
start reaches the root on its side. For z³ − 1 every Julia point borders all
three basins.

## Where to see it

Bonfert-Taylor's Coursera course opens with the Mandelbrot set, Needham
draws the Riemann sphere and Möbius maps, Ahlfors proves Montel. On
`dynamical-systems`, Strogatz's chapters on one-dimensional maps and
fractals, Hirsch–Smale–Devaney's discrete-dynamics chapter and Brin &
Stuck's chapter on complex dynamics reach Julia sets.

| Complex analysis | Dynamical systems |
|---|---|
| rational map f: Ĉ → Ĉ of degree d | discrete-time system on a compact phase space; every point has d preimages |
| f′(z₀) at a fixed point z₀ | multiplier λ, the eigenvalue of the linearisation |
| λ of modulus below 1 · λ = 0 · modulus above 1 | attracting · superattracting · repelling fixed point |
| Koenigs coordinate (0 < modulus of λ < 1), Böttcher coordinate (λ = 0) | linearisation near a fixed point, f conjugate to z ↦ λz or to z ↦ zᵏ |
| normal family (Montel) on a neighbourhood | stability: nearby orbits stay nearby; the Fatou set |
| complement of the Fatou set | Julia set: the chaotic set, closure of the repelling periodic points |
| critical point, f′ = 0 | the one orbit that detects every attracting cycle (Fatou) |
| Möbius conjugacy M∘f∘M⁻¹ | change of coordinates; topologically conjugate systems |
| M ∩ ℝ = [−2, 1/4] | bifurcation diagram of r·x(1 − x), with c = r/2 − r²/4 |
| Cantor Julia set of z² + c, c outside M | full shift on two symbols, the Cantor set of Hirsch–Smale–Devaney |
| Newton map N = z − p/p′ on Ĉ | Newton's method as a dynamical system; roots are superattracting fixed points |
