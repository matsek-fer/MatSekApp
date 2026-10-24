---
between: [geometry, linear-algebra]
tagline: Geometry takes its transformation groups from GL(n+1); linear algebra gets back the meaning of its determinants, eigenvectors and signatures.
strength: 2
status: draft
ai_generated: true
---

A geometry, for Klein, is a set with a group acting on it, and its theorems
are the group's invariants. In every classical case the set comes from a
vector space and the group is a matrix group, so the Erlangen hierarchy of
`geometry` — projective, affine, similarity, Euclidean — is a chain of
subgroups of GL(n+1), and its theorems are invariants of `linear-algebra`.

## What each side lends

Linear algebra supplies the spaces and the groups. ℙⁿ is the set of lines
through 0 in ℝⁿ⁺¹, a projective transformation an invertible (n+1)×(n+1)
matrix up to scale, the group PGL(n+1). Affine maps are the matrices
[[A, b], [0, 1]] fixing the hyperplane at infinity, similarities those with
AᵀA = λ²I, rigid motions those with AᵀA = I; pitch problem 1 on `geometry`
sorts its three theorems by these subgroups. A Möbius map
z ↦ (az + b)/(cz + d) is the matrix [[a, b], [c, d]] on ℂ² read in the
chart z = z₁/z₂, so Möbius maps form PSL(2, ℂ) and their fixed points are
eigenvectors; those preserving the unit disc form PSU(1, 1), the group of
pitch problem 2.

Geometry repays with meanings. An orthogonal 3×3 matrix has determinant ±1
and the sign decides rotation or reflection: the third pitch problem on
`linear-algebra` is about the two components of O(3). The dual space V* is
point–line duality in ℙ², so every incidence theorem, Pappus included, has
a dual theorem free.

## Conics by signature

A conic in ℙ² is {[x] : xᵀSx = 0} for a non-zero symmetric 3×3 matrix S. A
change of coordinates x ↦ Px replaces S by PᵀSP, and Sylvester's law of
inertia says the only invariant under congruence is the signature (p, q),
the numbers of positive and negative eigenvalues. As S and −S cut out the
same conic, every non-degenerate, non-empty real conic has signature (2, 1):
projectively it is the circle x² + y² = z².

The hyperbola xy = 1 homogenises to xy − z² = 0,
S = [[0, ½, 0], [½, 0, 0], [0, 0, −1]], eigenvalues ½, −½, −1, so −S
has signature (2, 1): a circle. The parabola y = x² becomes x² − yz = 0,
eigenvalues 1, ½, −½: the same circle. They differ only in where the line at
infinity z = 0 meets them — the asymptote directions [1:0:0], [0:1:0], or the
double point [0:1:0] — which is the signature of the top-left 2×2 block of S,
an affine but not a projective invariant.

## Where to see it

Hitchin's *Projective Geometry* notes do conics and duality this way,
Stillwell's *Four Pillars* has the transformation-group pillar, and Treil's
chapter on bilinear and quadratic forms proves Sylvester's law. The table is
a phrasebook between `geometry` and `linear-algebra`.

| Geometry | Linear algebra |
|---|---|
| point of ℙⁿ | line through 0 in ℝⁿ⁺¹; a non-zero vector up to scale |
| line in ℙ² | plane through 0 in ℝ³; a non-zero covector up to scale |
| point–line duality | V ↔ V* |
| projective transformation | invertible (n+1)×(n+1) matrix up to scale, PGL(n+1) |
| affine map | block matrix [[A, b], [0, 1]], fixing the hyperplane at infinity |
| similarity · rigid motion | A = λQ · A = Q with QᵀQ = I |
| rotation, not reflection | det Q = +1 |
| Möbius map z ↦ (az + b)/(cz + d) | [[a, b], [c, d]] ∈ SL(2, ℂ) on ℂ², in the chart z = z₁/z₂ |
| fixed points of a projective map | eigenvectors |
| conic or quadric | symmetric matrix S up to congruence PᵀSP |
| ellipse, parabola, hyperbola projectively alike | Sylvester's law of inertia: signature is the only invariant |
| ellipse, parabola, hyperbola affinely distinct | signature of the quadratic part, the top-left block of S |
| principal axes of an ellipsoid | spectral theorem for symmetric matrices |
| cross-ratio of four collinear points | the invariant of PGL(2) on ℙ¹, built from 2×2 determinants |
| lines of ℙ³ as the Klein quadric in ℙ⁵ | decomposable vectors in Λ²ℝ⁴ (Plücker coordinates) |
