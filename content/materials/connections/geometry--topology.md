---
between: [geometry, topology]
tagline: Topology hands geometry its manifolds and the invariants that constrain every metric; geometry repays with curvature and calculus that compute those invariants.
strength: 3
status: draft
ai_generated: true
---

A manifold is a space from the `topology` syllabus, Hausdorff, second
countable and locally homeomorphic to ℝⁿ, on which the calculus of `geometry`
runs chart by chart. Topology says what the space is up to stretching,
geometry how to measure on it. Both prize theorems where measurements summed
over the whole space are fixed by its shape.

## What each side lends

Topology supplies stage and obstructions. Lee's *Introduction to
Topological Manifolds* builds the manifold with the script's point-set tools,
and the script's Urysohn's lemma gives the ring C(X) of pitch problem 3 on
`geometry` enough functions to recover a compact Hausdorff X from its
maximal ideals. The classification of surfaces, every compact orientable
surface a sphere with g handles and χ = 2 − 2g, lists the spaces a metric
must live on, and χ obstructs: χ(S²) ≠ 0 forbids a nowhere-zero tangent
field on S² (Poincaré–Hopf).

Geometry repays with calculus that counts holes. De Rham cohomology is
closed k-forms (dω = 0) modulo exact ones (ω = dη); on ℝ² ∖ {0} the form
(x dy − y dx)/(x² + y²) is closed but integrates to 2π round the unit circle,
so it is not exact; H¹ records the hole, the winding number of
`complex-analysis` made linear. De Rham's theorem makes these dimensions the
Betti numbers, so differentiation computes a homeomorphism invariant; the
Poincaré lemma, closed implies exact on a star-shaped domain, is the
converse.

## Gauss–Bonnet

Theorem: for a compact orientable surface M with any metric and Gaussian
curvature K, ∫_M K dA = 2πχ(M), χ = V − E + F for any triangulation. On the
unit sphere K = 1, area 4π, and 2πχ = 4π. The torus has χ = 0: the positive
curvature of its outer rim exactly cancels the negative curvature inside the
hole, and no metric on a torus is positively curved everywhere. For g ≥ 2 the
total is 2π(2 − 2g) < 0; uniformisation makes K = −1 throughout, area
4π(g − 1), and the surface is the hyperbolic disc of pitch problem 2 on
`geometry` modulo a group of Möbius maps. Part (c) there, area
π − α − β − γ, is Gauss–Bonnet for one triangle with K = −1. Klein's three
plane geometries are those of the three kinds of surface.

## Where to see it

Armstrong's *Basic Topology*, on `topology`, runs from Euler's formula for
polyhedra to the classification of surfaces; Lee's *Topological Manifolds*
proves it. On `geometry`, Needham's *Visual Differential Geometry and Forms*
draws curvature and Gauss–Bonnet; Lee's *Introduction to Smooth Manifolds*
closes with de Rham cohomology. The table is a phrasebook.

| Topology | Geometry |
|---|---|
| topological manifold: Hausdorff, second countable, locally ℝⁿ | smooth manifold: charts with smooth transition maps, then a Riemannian metric |
| homeomorphism | diffeomorphism; isometry once the metric is kept |
| compact Hausdorff X; Urysohn's lemma | C(X) separates points; X is rebuilt as the maximal ideals of C(X) |
| compact orientable surface of genus g | admits a metric of constant curvature +1, 0 or −1 as g = 0, 1 or ≥ 2 |
| Euler characteristic χ = V − E + F | total curvature ∫K dA = 2πχ (Gauss–Bonnet) |
| sphere · torus · genus ≥ 2 | spherical · Euclidean · hyperbolic geometry |
| universal cover and fundamental group | a Klein geometry divided by a discrete group of its motions; the torus is ℝ²/ℤ² |
| χ(S²) ≠ 0 | no nowhere-zero vector field on S² (Poincaré–Hopf) |
| k-th Betti number | dimension of H^k_dR: closed k-forms modulo exact ones (de Rham) |
| contractible, e.g. star-shaped, domain | Poincaré lemma: every closed form is exact |
| the hole in ℝ² ∖ {0}; winding number | (x dy − y dx)/(x² + y²), closed, not exact, ∮ = 2π |
| critical points of a Morse function | Morse inequalities: at least b_k critical points of index k |
| Poincaré conjecture: S³ is the only simply connected closed 3-manifold | Perelman's proof by Ricci flow, an evolution of the metric |
