---
between: [algebra-intro, geometry]
tagline: Algebra gives geometry group actions, cosets and quotients; geometry gives algebra its best groups, the symmetries of polygons, polyhedra and wallpaper.
strength: 3
status: draft
ai_generated: true
---

Klein's definition of a geometry comes from `algebra-intro`: a set X with a
group G acting transitively on it, its theorems the statements invariant
under G. Fix a point p with stabiliser H; g ↦ g·p identifies X with the coset
space G/H, so the points are cosets and the geometry is the pair (G, H). The
Euclidean plane is E(2)/O(2); the hyperbolic disc of pitch problem 2 on
`geometry` is its Möbius group modulo the rotations about 0.

## What each side lends

Algebra supplies the grammar. The space looks the same at every point because
stabilisers of different points are conjugate, gHg⁻¹. Subgroups order the
geometries: rigid motions inside affine maps inside projective maps is a
chain of subgroups, a smaller group leaves more invariants, and pitch
problem 1 on `geometry` sorts theorems by the largest subgroup keeping each
true. Normal subgroups describe wallpaper: the translations in a wallpaper
group G form a lattice T ≅ ℤ², normal in G, and the quotient G/T is the
finite point group.

Geometry repays with the groups themselves. Dₙ is the symmetries of a regular
n-gon; the rotations of a cube are S₄, acting on its four long diagonals; the
rotations of a dodecahedron are A₅, acting on five inscribed cubes, and A₅,
being simple, is why the quintic is insoluble in `galois-theory`. The finite
subgroups of SO(3) — cyclic, dihedral, A₄, S₄, A₅ — fall to the
orbit–stabiliser count of the necklace problem, applied to the poles of the
rotations.

## The crystallographic restriction

Theorem: a rotation in a wallpaper group has order 1, 2, 3, 4 or 6. Proof:
let r ∈ G be a rotation through θ and t ∈ T the translation by v. Then
r t r⁻¹ is the translation by r(v), so r maps the lattice T to itself and,
in a basis of T, is a 2×2 integer matrix. Its trace is 2cos θ, so
2cos θ ∈ ℤ, cos θ ∈ {1, −1, −½, 0, ½}, and θ is 360°, 180°, 120°, 90° or
60°. So no wallpaper or crystal has five-fold symmetry; the seventeen
wallpaper groups follow from listing the point groups each lattice admits.

## Where to see it

Artin's *Algebra*, on `algebra-intro`, is built on this traffic: its symmetry
chapters classify the discrete groups of plane motions and the finite
subgroups of SO(3); Judson proves the crystallographic restriction in his
chapter on matrix groups and symmetry. On `geometry`, Stillwell's *Four
Pillars* has the transformation-group pillar, Klein's 1872 paper is the
manifesto, and Sharpe's opening chapters make the pair (G, H) the definition.
The table is a phrasebook.

| Algebra | Geometry |
|---|---|
| group G acting transitively on a set X | a Klein geometry; its space is homogeneous |
| stabiliser H of a point; coset space G/H | the point itself; the space, with points as cosets |
| orbit of a configuration under G | congruence class: the figure up to motion |
| invariant of the action | theorem of the geometry |
| conjugate subgroups gHg⁻¹ | stabilisers of different points: the space looks alike everywhere |
| chain of subgroups E(2) < Aff(2) < PGL(3) | Euclidean ⊂ affine ⊂ projective; more maps, fewer theorems |
| dihedral group Dₙ | symmetries of the regular n-gon |
| A₄ · S₄ · A₅ | rotations of the tetrahedron · cube and octahedron · icosahedron and dodecahedron |
| finite subgroups of SO(3) | the Platonic solids, plus prisms and pyramids |
| normal subgroup T ≅ ℤ², quotient G/T | translation lattice of a wallpaper; its point group |
| trace of an integer matrix | crystallographic restriction: no five-fold wallpaper |
| maximal ideal of a ring | point of a space (pitch problem 3 on `geometry`) |
| ℂ[x, y]/(xy − 1) | the hyperbola, as a ring |
