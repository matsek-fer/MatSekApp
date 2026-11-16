---
between: [category-theory-intro, geometry]
tagline: Geometry lends category theory its first dualities and the functor of points; category theory returns a grammar in which every commutative ring is a space.
strength: 2
status: draft
ai_generated: true
---

A space is known by its functions. Sending a space X to the ring of
functions on it is a contravariant functor — a map X → Y pulls functions
back from Y to X — and the second move of the `geometry` pitch is that for
the right rings this functor is an equivalence onto the opposite category.
Said in the language of `category-theory-intro`, any commutative ring is a
space, and the subject becomes a dictionary between the two.

## What each side lends

Category theory makes the inversion a theorem rather than a slogan. Gelfand
duality is an equivalence CompHaus ≃ (commutative unital C*-algebras)ᵒᵖ,
X ↦ C(X); the Nullstellensatz makes affine varieties over ℂ equivalent to
finitely generated reduced ℂ-algebras, arrows reversed; pitch problem 3 on
`geometry` is the object part of both. The reversed arrows are what make
Spec useful: Hom(Spec B, Spec A) ≅ Hom(A, B). Klein's groups come along:
GL_n is the functor R ↦ GL_n(R), represented by ℤ[x_ij][1/det], so the
Erlangen program makes sense over 𝔽₅ as well as ℝ.

Geometry repays with examples: Gelfand's duality predates the word functor,
and dualities like it are what opposite categories are for. The open sets
of X form a poset O(X), a sheaf is a functor O(X)ᵒᵖ → Set whose values glue
along covers, and a scheme is a space with a sheaf of rings 𝒪_X, locally
some Spec A. The Yoneda lemma, which on `category-theory-intro` says
Hom(−, X) determines X, is in geometry the functor of points: a scheme is
the functor R ↦ X(R) it represents, and can be defined as one.

## Points over every ring

Let A = ℤ[x, y]/(x² + y² − 1) and X = Spec A. By the Hom bijection,
X(R) = Hom(Spec R, X) ≅ Hom(A, R) = {(a, b) ∈ R² : a² + b² = 1}: the
R-points are the solutions in R. X(ℝ) is the unit circle. X(ℂ) is ℂ^× in
disguise: with u = x + iy, v = x − iy it reads uv = 1, the hyperbola of pitch
problem 3(b) on `geometry`. X(𝔽₅) has four points, (0, ±1) and (±1, 0),
because 2 is not a square mod 5. One ring, three spaces, each read off a
Hom set.

## Where to see it

Vakil's The Rising Sea is the dictionary at book length: chapters 1–2 teach
categories, Yoneda and sheaves, chapters 3–4 build Spec and schemes. The
Napkin's algebraic geometry part is the short version. On
`category-theory-intro`, Leinster's chapter on representables and the Yoneda
lemma is what Vakil assumes, and Sheafification of G covers sheaves. The
table is a phrasebook between the two.

| Geometry | Rings and categories |
|---|---|
| point of X | maximal ideal of the ring of functions; prime ideal, for Spec |
| function on X | element of the ring A |
| map of spaces X → Y | ring homomorphism in the other direction, functions on Y → functions on X |
| space ↔ ring | contravariant equivalence: Gelfand, Nullstellensatz, Spec |
| open set D(f) where f ≠ 0 | localisation A[1/f] |
| restriction and gluing of functions | sheaf 𝒪_X: a functor O(X)ᵒᵖ → Ring with unique gluing |
| space covered by affine pieces | colimit of representables over a Zariski cover |
| intersection, fibre, product X ×_S Y | pullback; on affine pieces Spec(A ⊗_C B) |
| disjoint union X ⊔ Y | product of rings A × B |
| solutions of the equations over R | R-points X(R) = Hom(Spec R, X) = Hom(A, R) |
| a space is its solution sets | Yoneda: X is determined by the functor Hom(−, X) |
| transformation group of a Klein geometry | group object in schemes, GL_n = Spec ℤ[x_ij][1/det] |
| invariant of the group | map X → Y constant on orbits: it equalises the action G × X → X and the projection |
