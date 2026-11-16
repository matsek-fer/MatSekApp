---
between: [complex-analysis, geometry]
tagline: Complex analysis hands geometry its conformal groups and the hyperbolic disc; geometry gives analysis the sphere, Riemann surfaces and a metric holomorphic maps contract.
strength: 2
status: draft
ai_generated: true
---

A holomorphic function's derivative at a point is a complex number
r·e^(iθ), and multiplying by it rotates through θ and scales by r. So
wherever f′ ≠ 0 a holomorphic map preserves angles and their sense: it is
conformal, and the converse holds too. In Klein's terms the model spaces of
`complex-analysis` — sphere, plane and disc — are geometries whose groups
are their conformal self-maps.

## What each side lends

Analysis finds the groups. On the Riemann sphere Ĉ = ℂ ∪ {∞} the conformal
automorphisms are the Möbius maps z ↦ (az + b)/(cz + d), the group
PSL(2, ℂ); on the unit disc they are z ↦ e^(iθ)(z − a)/(1 − āz), and
Schwarz's lemma proves there are no others. This is PSU(1, 1), the group of
pitch problem 2 on `geometry`: the hyperbolic plane is the disc with the
metric it leaves invariant. The Riemann mapping theorem makes every simply
connected proper subdomain of ℂ conformally the disc, so each carries a
hyperbolic geometry, and uniformisation extends this to all surfaces:
curvature +1, 0 or −1 as the universal cover is Ĉ, ℂ or 𝔻.

Geometry returns a stage and a vocabulary. The sphere makes ∞ an ordinary
point, so a pole is a value and a meromorphic function is a holomorphic map
into Ĉ; stereographic projection is conformal. A Riemann surface makes √z
and log z single-valued by replacing the slit plane with a covering surface,
where `topology` enters. And the cross-ratio, invariant under PSL(2, ℂ), is
Klein's invariant for the sphere's geometry; equating cross-ratios gives the
one Möbius map sending three points to three others.

## Schwarz's lemma as a contraction

Schwarz–Pick: a holomorphic f: 𝔻 → 𝔻 satisfies |f′(z)|/(1 − |f(z)|²) ≤
1/(1 − |z|²) everywhere, with equality anywhere only if f is a Möbius
automorphism. Proof: move z and f(z) to 0 by disc automorphisms and apply
Schwarz's lemma. Geometrically, holomorphic self-maps of the disc never
increase hyperbolic length, and those preserving it are the isometries.
For f(z) = z² at real z = r it reads 2r/(1 − r⁴) ≤ 1/(1 − r²),
that is 2r ≤ 1 + r², or (1 − r)² ≥ 0, strict for r < 1: squaring shrinks
every hyperbolic distance, as a two-to-one map must. Integrated along [0, r],
with d(0, r) = 2 artanh r (the geometry page's hint), this is
2 artanh r² < 2 artanh r.

## Where to see it

Needham's *Visual Complex Analysis* covers Möbius maps, the Riemann sphere
and the hyperbolic disc; Stein & Shakarchi's conformal-maps chapter proves
the Riemann mapping theorem; Stillwell's *Four Pillars* ends with the
hyperbolic plane and Needham's *Visual Differential Geometry and Forms*
dwells on it.

| Complex analysis | Geometry |
|---|---|
| f′(z₀) = r·e^(iθ) ≠ 0 | local similarity: rotate by θ, scale by r (Needham's amplitwist) |
| holomorphic with f′ ≠ 0 | conformal: angles and their sense preserved |
| Riemann sphere Ĉ = ℂ ∪ {∞} | the sphere S², by stereographic projection, itself conformal |
| pole of a meromorphic function | the ordinary value ∞ of a map to the sphere |
| Möbius map z ↦ (az + b)/(cz + d), PSL(2, ℂ) | conformal automorphism of the sphere |
| Möbius map with a unitary matrix, PSU(2) | rotation of the sphere, SO(3) |
| z ↦ e^(iθ)(z − a)/(1 − āz), a in the disc, PSU(1, 1) | orientation-preserving isometry of the hyperbolic plane |
| z ↦ az + b | orientation-preserving similarity of the Euclidean plane |
| circular arcs orthogonal to the unit circle | hyperbolic geodesics |
| cross-ratio of four points | Klein's invariant of the sphere's geometry; real exactly when the four points are concyclic |
| Schwarz's lemma | holomorphic self-maps of the disc contract hyperbolic length (Schwarz–Pick) |
| Riemann mapping theorem | every simply connected proper plane region carries a hyperbolic metric |
| uniformisation: Ĉ, ℂ or 𝔻 | constant curvature +1, 0 or −1 |
| multivalued √z, log z | single-valued functions on a Riemann surface covering the punctured plane |
| Picard's little theorem | ℂ minus two points has the disc as universal cover |
