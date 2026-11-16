---
between: [dynamical-systems, physics-symmetry]
tagline: Dynamics gives physics the phase-space flow and its stability theory; Noether gives dynamics the conserved quantities that cut a flow down to tori.
strength: 3
status: draft
ai_generated: true
---

A mechanical system is a flow on phase space; a continuous symmetry is a
second flow on the same space. Noether's theorem says they are one object
seen twice: F is constant along the time flow exactly when H is
constant along the flow F generates, and then the flows commute. Dynamics
with symmetry has fewer dimensions.

## What each side lends

`dynamical-systems` supplies the language. Arnold's "one-parameter group of
diffeomorphisms" defines a flow and a continuous symmetry at once; the
exponential map of a matrix Lie group is exp(A), the time-one map of x′ = Ax.
Linearisation gives normal modes; energy as a Lyapunov function gives
Lagrange–Dirichlet: a strict potential minimum is stable.

`physics-symmetry` repays with structure a generic flow lacks. Hamilton's
equations preserve the symplectic form ω = Σ dpᵢ ∧ dqᵢ, hence phase volume
(Liouville): no attractors, and eigenvalues in pairs ±λ, so a stable
equilibrium is a centre, never a sink. Every conserved quantity is a first
integral confining orbits to a hypersurface; Lie invented continuous groups
to lower an ODE's order by one per symmetry. With n independent commuting
integrals in 2n dimensions, Liouville–Arnold puts bounded orbits on n-tori,
moving quasi-periodically — Kepler, for one. Kolmogorov, Arnold and
Moser showed a small perturbation deforms most tori but keeps them, with
chaos in the resonant gaps, where the double pendulum of pitch problem 1 on
`dynamical-systems` lives.

## Noether for a particle in the plane

Theorem. Let L(q, q̇) be a Lagrangian and K(q) a vector field leaving L
invariant to first order: d/dε L(q + εK, q̇ + ε DK(q) q̇) = 0 at ε = 0. Then
I = Σᵢ (∂L/∂q̇ᵢ) Kᵢ(q) is constant along solutions of the Euler–Lagrange
equations. Proof: differentiate I in t, replace d/dt(∂L/∂q̇ᵢ) by ∂L/∂qᵢ using
the equations of motion; what remains is the invariance condition.

Take L = ½m(ẋ² + ẏ²) − V(r), r = √(x² + y²), and the rotation field
K = (−y, x). L sees position only through r, so I = m(xẏ − yẋ) = ℓ, the
angular momentum, is conserved. With ℓ = mr²θ̇ the energy reads
½mṙ² + U(r) = E with U = V + ℓ²/(2mr²): four-dimensional phase space has
collapsed to the (r, ṙ) plane, where orbits are level curves of
½mṙ² + U(r). A third integral, the Runge–Lenz vector of pitch problem 2 on
`physics-symmetry`, is why for V = −k/r the orbit closes.

## Where to see it

Arnold's *Mathematical Methods of Classical Mechanics* (on
`physics-symmetry`) proves Noether and Liouville–Arnold and sketches KAM; his
*Ordinary Differential Equations* (on `dynamical-systems`) teaches flows
first. Tong's *Classical Dynamics* has Noether and Runge–Lenz;
Hirsch–Smale–Devaney's mechanics chapter does the central-force reduction
above, and Strogatz's conservative-systems section the no-attractor argument.

| Physics | Dynamical systems |
|---|---|
| Lagrangian L(q, q̇), Euler–Lagrange equations | second-order ODE; first-order system on phase space (q, p) |
| Hamiltonian H | generator of the time flow, the vector field (∂H/∂p, −∂H/∂q) |
| continuous symmetry, one-parameter group | a second flow on phase space, commuting with the time flow |
| conserved quantity (Noether) | first integral; orbits confined to a level set, one dimension fewer |
| Poisson bracket {F, H} = 0 | F constant on orbits ⟺ the flows of F and H commute |
| symplectic form ω preserved | phase volume preserved (Liouville); no attractors; eigenvalues in ±λ pairs |
| strict minimum of potential energy | stable equilibrium, energy as Lyapunov function (Lagrange–Dirichlet) |
| integrable system, n commuting integrals | orbits on n-tori, quasi-periodic motion (Liouville–Arnold) |
| small perturbation of an integrable system | most tori survive (KAM); chaos in the resonant gaps |
| exponential map of a matrix Lie group | time-one map of the linear flow x′ = Ax |
