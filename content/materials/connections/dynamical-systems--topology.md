---
between: [dynamical-systems, topology]
tagline: Topology supplies the fixed-point and separation theorems that force equilibria and cycles; dynamics repays with flows that compute and invent topological invariants.
strength: 3
status: draft
ai_generated: true
---

Poincaré created both subjects with one question: with no formula for
x′ = f(x), where do orbits go? Any answer must survive coordinate changes,
so the qualitative theory of `dynamical-systems` studies flows
up to topological conjugacy, a homeomorphism carrying orbits to orbits, and
sees what `topology` sees. The shape of phase space decides which behaviours
are available.

## What each side lends

Topology hands dynamics existence theorems. Brouwer: a flow carrying a
closed disc into itself gives each time-t map a fixed point, and t → 0 with
compactness an equilibrium. The index of a closed curve, the winding number
of f along it, is +1 round a node, spiral or centre, −1 round a saddle and +1
along a periodic orbit, so every cycle encloses equilibria of total index +1:
the Lotka–Volterra cycles (pitch problem 3) circle theirs. For chaos, Smale's
horseshoe has an invariant Cantor set Λ on which f is conjugate to the shift
σ on {0,1}^ℤ, whose dense orbit is explicit.

Dynamics repays with flows computing invariants. Poincaré–Hopf: the
indices of a vector field's zeros on a compact surface sum to χ, so every
flow on the sphere (χ = 2) stops somewhere, while the torus (χ = 0) carries
θ̇₁ = 1, θ̇₂ = √2, equilibrium-free, every orbit dense. Dynamics also
mints invariants: topological entropy, the growth rate of the number of
length-n orbit segments distinguishable at resolution ε, survives conjugacy
and is log 2 on the two-shift, so positive for the horseshoe.

## Poincaré–Bendixson

Theorem: if a trajectory of a C¹ planar flow stays for t ≥ 0 in a compact
set without equilibria, its ω-limit set is a periodic orbit. The topology is
one step: an orbit arc between two crossings of a transversal segment,
closed by the segment, is a Jordan curve, so later crossings are monotone
and the limit orbit must close. For ṙ = r(1 − r²), θ̇ = 1 on the annulus
1/2 ≤ r ≤ 2, ṙ > 0 on the inner circle, ṙ < 0 on the outer, so orbits never
leave, and the only equilibrium, the origin, is excluded. Hence a periodic
orbit, r = 1, round a spiral of index +1. On the torus a closed curve need
not separate, hence the dense flow above; in ℝ³ it separates nothing, and
Lorenz's bounded trajectories limit on a strange attractor. Chaos in a flow
needs three dimensions.

## Where to see it

Strogatz's phase-plane chapters draw index theory and Poincaré–Bendixson;
Hirsch–Smale–Devaney proves it and builds the shift on a Cantor set; Teschl
proves the horseshoe; Brin & Stuck covers topological entropy. On
`topology`, Armstrong proves Brouwer via the circle's fundamental group;
Morris builds the Cantor set as {0,1}^ℕ.

| Dynamical systems | Topology |
|---|---|
| phase space with a flow φ_t, or a map f iterated | space with an action of ℝ or ℤ by homeomorphisms |
| topological conjugacy h∘f = g∘h, h∘φ_t = ψ_t∘h | homeomorphism of phase spaces commuting with the dynamics |
| equilibrium of x′ = f(x) | zero of a vector field; fixed point of every time-t map (Brouwer) |
| index of an equilibrium or a periodic orbit | winding number of f round a small circle; degree of a map S¹ → S¹ |
| sum of indices of all equilibria on a compact surface | Euler characteristic χ (Poincaré–Hopf) |
| trapping region without equilibria in ℝ² | a closed orbit separates the plane (Jordan); Poincaré–Bendixson |
| flow without equilibria on a compact orientable surface | χ(M) = 0: only the torus |
| invariant set Λ of the horseshoe | Cantor set; {0,1}^ℤ with the product topology |
| chaos: dense orbit, dense periodic points, sensitivity | the shift σ on {0,1}^ℤ, up to conjugacy |
| topological entropy h(f) | conjugacy invariant; log 2 for the two-shift, 0 for a rotation |
| ω-limit set of a bounded orbit | non-empty, compact, connected, invariant |
| gradient flow of a height function | Morse theory: critical points as cells, χ = Σ(−1)ᵏ·cₖ |
