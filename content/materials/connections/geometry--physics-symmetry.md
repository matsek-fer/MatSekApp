---
between: [geometry, physics-symmetry]
tagline: Geometry lends physics connections, curvature and holonomy; physics lends geometry Noether's theorem, the gauge principle and, through Yang–Mills, Donaldson's invariants of four-manifolds.
strength: 3
status: draft
ai_generated: true
---

A Klein geometry is a space with one group acting on it, the same
everywhere; the gauge principle on `physics-symmetry` lets the group act
independently at each point. Making Klein's group local is one
construction, Cartan's in geometry and the gauge field's in physics. Both
call it a connection on a bundle, and its curvature is the physicist's field
strength.

## What each side lends

Geometry supplies the stage: a principal G-bundle puts a copy of the Lie
group G over each point; a connection A carries elements from fibre to
fibre, and its curvature F = dA + A ∧ A measures how a small loop moves
them. For U(1) this is pitch problem 3 on `physics-symmetry`:
A ↦ A + dα is the gauge transformation, F = dA Maxwell's field. Cartan
geometry, Sharpe's subject, does the same for general relativity: a space-time
is locally Minkowski space, the Klein geometry Poincaré/Lorentz, and its
Riemann tensor is the curvature of the Lorentz connection.

Physics repays in groups and equations. Klein's groups are the Lie groups
of `physics-symmetry`: the Möbius group of the disc in pitch problem 2 on
`geometry` has Lie algebra sl(2, ℝ), and Noether's theorem turns each Killing
field into a first integral of the geodesics. The Yang–Mills equations gave
geometry a new tool: Donaldson (1983) used the moduli space of their
solutions to show that smooth four-manifolds obey restrictions topology
alone does not force.

## Local Gauss–Bonnet, in gauge language

Let A be a connection 1-form on a U(1)-bundle over a surface, F = dA its
curvature. Parallel transport round the boundary of a region S multiplies
the fibre by exp(i∫_S F), since by Stokes ∮_{∂S} A = ∫_S dA. On the tangent
bundle, U(1) ≅ SO(2) rotates tangent vectors and F is Gaussian curvature
times area: a vector carried round a loop returns rotated by the curvature
enclosed.

On the unit sphere take the triangle with vertices at the north pole,
(1, 0, 0) and (0, 1, 0), all three angles right. Carry a tangent vector
round the edges, keeping a fixed angle to each (they are geodesics): it
returns rotated by 3π/2 − π = π/2. The triangle is an eighth of the sphere,
area 4π/8 = π/2. With a wavefunction's phase for the tangent direction,
this is the Aharonov–Bohm effect.

## Where to see it

Needham's *Visual Differential Geometry and Forms*, on `geometry`, draws
parallel transport, holonomy and Gauss–Bonnet; Sharpe is the Klein-to-Cartan
half, and Lee's *Introduction to Smooth Manifolds* the prerequisite for Sharpe
and for the physics texts alike. On `physics-symmetry`, Baez and Muniain's
*Gauge Fields, Knots and Gravity* builds bundles, connections and curvature
for the physicist's reasons; Tong's *Gauge Theory* teaches the right-hand
column below.

| Geometry | Physics-symmetry |
|---|---|
| Klein geometry G/H | global symmetry group G; Minkowski space as Poincaré/Lorentz |
| Cartan geometry, locally G/H | general relativity, locally Minkowski |
| principal G-bundle | a field with internal symmetry G at every point |
| connection, parallel transport | gauge potential A_μ, covariant derivative ∂_μ − iA_μ |
| change of local frame | gauge transformation A ↦ A + dα |
| curvature F = dA + A ∧ A | field strength F_{μν}; Maxwell's F for U(1) |
| flat connection | pure gauge, no field |
| holonomy round a loop | phase exp(i∮A); the Aharonov–Bohm effect |
| Riemann tensor of the Levi-Civita connection | tidal gravity: the field strength of the Lorentz connection |
| Killing vector field | continuous symmetry; Noether's conserved quantity |
| geodesic | worldline of a free particle |
| Gauss–Bonnet ∫K dA = 2πχ; Chern–Weil ∫ tr(F ∧ F) ∈ 8π² ℤ | total curvature fixed by topology; instanton number |
| Yang–Mills equation d_A ⋆F = 0; Donaldson invariants | equation of motion of the gauge field |
