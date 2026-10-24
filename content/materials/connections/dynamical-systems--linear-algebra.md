---
between: [dynamical-systems, linear-algebra]
tagline: Eigenvalues solve every linear system and, via linearisation, govern every smooth one near equilibrium; dynamics in return gives the spectrum its meaning.
strength: 3
status: draft
ai_generated: true
---

A differential equation x′ = f(x) is hard because f is arbitrary; a matrix is
easy because it is linear. Near an equilibrium x* the two agree to first
order, f(x) ≈ Df(x*)(x − x*), so "what do orbits near x* do?" becomes "what
does A = Df(x*) do to vectors?", which linear algebra answers completely
through the spectrum of A.

Linear algebra's gift is the solution of x′ = Ax. The flow is
x(t) = exp(tA)x₀, and with A = PJP⁻¹ in Jordan form,
exp(tA) = P exp(tJ) P⁻¹: every coordinate of every solution combines terms
tᵏ exp(λt), λ an eigenvalue, k smaller than λ's largest Jordan block.
Stability is the sign of Re λ; planar portraits follow from trace and
determinant alone. The tᵏ factors are resonance: adjoin the forcing's own
equation to x″ + ω²x = cos ωt and ±iω acquire Jordan blocks of size two, so
the amplitude grows like t.

Dynamics repays this with meaning. exp(tA) stops being a formal series and
becomes the time-t map of a flow, A its generator; a Jordan block is the
obstruction to decoupling; Floquet theory makes a periodic coefficient matrix
constant after a periodic change of variables. Two pitch problems on
`linear-algebra` are discrete dynamical systems: Fibonacci iterates a 2×2
matrix, and PageRank is the fixed point power iteration reaches because, by
Perron–Frobenius, the Google matrix has one eigenvalue of modulus one.

| Linear algebra | Dynamical systems |
|---|---|
| Matrix A | Vector field x′ = Ax, or the Jacobian Df(x*) at an equilibrium |
| exp(tA) | Time-t flow map, with A as its generator |
| Eigenvalue λ | Growth rate of a mode; Re λ in continuous time, modulus of λ for maps |
| Eigenvector | Invariant line through the equilibrium |
| All Re λ < 0 | Asymptotically stable equilibrium |
| Real parts of both signs | Saddle; stable and unstable manifolds tangent to the eigenspaces |
| Jordan block of size k | Solutions carrying tᵏ⁻¹ exp(λt); resonance |
| Eigenvalue on the imaginary axis | Non-hyperbolic equilibrium; linearisation decides nothing |
| Change of basis P | Coordinates in which the modes decouple |

## Hartman–Grobman

If x* is an equilibrium of x′ = f(x), f is C¹ and A = Df(x*) is hyperbolic
(no eigenvalue on the imaginary axis), then some homeomorphism between
neighbourhoods of x* and 0 sends orbits of f to orbits of x′ = Ax, preserving
time. Take the damped pendulum θ′ = v, v′ = −sin θ − γv, γ > 0.
At (0, 0) the Jacobian is [[0, 1], [−1, −γ]], eigenvalues
(−γ ± √(γ² − 4))/2, both of negative real part: the pendulum settles. At
(π, 0) it is [[0, 1], [1, −γ]], eigenvalues (−γ ± √(γ² + 4))/2, one of each
sign: a saddle whose stable eigenvector is tangent to the two orbits ending
balanced upright.

The hypothesis matters. For foxes and rabbits, x′ = x(a − by),
y′ = y(cx − d), the Jacobian at (d/c, a/b) has eigenvalues ±i√(ad):
Hartman–Grobman is silent, and whether orbits close or spiral is settled by a
conserved quantity, not the matrix.

## Where to see it

Hirsch, Smale & Devaney (on `dynamical-systems`) do the linear theory through
Jordan form and state the linearisation theorem; Teschl proves it. Strogatz's
phase-plane chapters have the trace–determinant plane and the centre that
linearisation gets wrong. On `linear-algebra`, Treil covers Jordan form and
Strang's 18.06 reaches exp(tA) directly.
