---
between: [galois-theory, geometry]
tagline: Galois theory gives geometry its ruler-and-compass impossibility proofs; geometry repays with a picture in which Galois groups are deck groups and monodromy.
strength: 2
status: draft
ai_generated: true
---

Klein's dictum on `geometry` — a geometry is a space with a group, its
theorems the group's invariants — is also the fundamental theorem of
`galois-theory`: the base field is exactly what Gal(L/K) fixes, so a Galois
group is the transformation group of a geometry of algebraic numbers. Read a
field as the functions on a space, as Grothendieck does, and the slogan is a
theorem: extensions are coverings, Galois groups deck groups, the
correspondence the classification of covers.

## What each side lends

Galois theory gives Euclidean geometry its impossibility proofs: a
ruler-and-compass step meets lines and circles over the field so far, so
adjoins a root of a linear or quadratic equation, and a constructible
length has degree 2ʲ over ℚ. The converse needs the correspondence:
Gal(ℚ(ζ₁₇)/ℚ) is cyclic of order 16, its chain of index-2 subgroups a chain
of quadratic extensions, so the 17-gon is constructible — the regular n-gon
exactly when φ(n) is a power of 2 (Gauss–Wantzel).

Geometry gives Galois theory pictures. Over ℂ(z), Riemann existence makes
every finite extension a branched cover of the sphere, its Galois group the
monodromy of π₁ of the sphere minus the branch points; that π₁ is free, so
every finite group is a Galois group over ℂ(z). Over Spec ℤ (pitch problem 3
on `geometry`) a number field is a cover branched at the primes dividing its
discriminant, Frobenius at p is the monodromy around p, and Dedekind's
theorem — the factors of f mod p have the cycle lengths of that Frobenius as
degrees — is why reducing mod 5 and mod 2 in pitch problem 3 on
`galois-theory` gives a 5-cycle and an element of type (2, 3).

## √z as a covering

Riemann existence: finite extensions L of ℂ(z) correspond to connected
finite branched covers Y → Ĉ with ℂ(Y) = L; the degree counts sheets and,
for Galois L, Gal(L/ℂ(z)) is the deck group of Y acting on functions by
pullback. Take w² = z: the cover w ↦ w² has two sheets, ℂ(z)
sits in ℂ(w) as z = w², and the deck transformation w ↦ −w is the
automorphism σ(w) = −w, so Gal(ℂ(w)/ℂ(z)) = {id, σ} ≅ ℤ/2. Monodromy
realises σ: the loop z = e^{it}, 0 ≤ t ≤ 2π, lifts from w = 1 to
w = e^{it/2}, ending at −1; one turn around the branch point 0 is the Galois
automorphism.

## Where to see it

On `galois-theory`, Keith Conrad's 17-gon note and Cox's chapters on
cyclotomic fields and geometric constructions build the tower. On
`geometry`, Stillwell's *Four Pillars* opens with straightedge-and-compass
constructions; Vakil's *Rising Sea* starts from Spec ℤ and matches finite
maps of curves with extensions of function fields. The table is a
phrasebook.

| Galois theory | Geometry |
|---|---|
| field K | space X whose functions are K (Grothendieck) |
| finite extension L/K | finite branched cover Y → X |
| degree [L:K] | number of sheets |
| Gal(L/K) | deck transformation group |
| fixed field L^G = K | the invariants of the group: Klein's theorems |
| intermediate field; normal extension | intermediate cover; regular cover |
| zeros of the discriminant | branch points |
| Frobenius at p | monodromy around the point p of Spec ℤ |
| factorisation of f mod p (Dedekind) | cycle type of that monodromy |
| set of points defined over K | figure stable under Gal(K̄/K) |
| quadratic extension | one ruler-and-compass step: a line meets a circle |
| Gal(ℚ(ζ₁₇)/ℚ) ≅ ℤ/16, a 2-group | the regular 17-gon, drawn |
| every finite group is a Galois group over ℂ(z) | π₁ of a punctured sphere is free (Riemann existence) |
