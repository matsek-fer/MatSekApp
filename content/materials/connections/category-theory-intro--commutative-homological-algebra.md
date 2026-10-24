---
between: [category-theory-intro, commutative-homological-algebra]
tagline: Homological algebra gives category theory the abelian category; category theory returns the universal properties that define Ext and Tor once for every ring.
strength: 3
status: draft
ai_generated: true
---

An abelian category is a module category with the ring forgotten: every arrow
has a kernel and a cokernel, every monomorphism is a kernel and every
epimorphism a cokernel, exactly enough to say "exact sequence". Homological
algebra is what those axioms alone can prove, and where
`category-theory-intro` stops being a phrasebook: Ext and Tor have no
definition that avoids a universal property.

## What each side lends

Category theory lends adjunctions. The tensor–hom adjunction
Hom(M ⊗ N, P) ≅ Hom(M, Hom(N, P)) makes − ⊗ N a left adjoint and Hom(N, −) a
right adjoint on R-Mod. Left adjoints preserve colimits, so ⊗ keeps cokernels
and is right exact; right adjoints preserve limits, so Hom keeps kernels and
is left exact, as does Hom(−, M), which turns cokernels into kernels. So which
half each functor loses is settled before any module is written down. Ext is
then pinned down by a universal property, the unique extension of Hom(−, M)
to long exact sequences vanishing on free modules, and independence of the
resolution is the usual uniqueness of a universal object.

Homological algebra lends the axioms themselves: Buchsbaum and Grothendieck
distilled abelian categories from R-Mod in the 1950s so that sheaf cohomology
could run on the same rails as Ext of modules. It lends the snake lemma, the
first theorem proved by diagram chase, and the licence to chase elements
anywhere: Freyd–Mitchell embeds every small abelian category fully,
faithfully and exactly into some R-Mod, so element-chasing proofs in modules
hold in every abelian category.

## Ext and Tor from one sequence

Fix 0 → ℤ →(·n) ℤ → ℤ/n → 0, an abelian group ℤ/m, and d = gcd(m, n).
Hom(−, ℤ/m) gives 0 → Hom(ℤ/n, ℤ/m) → ℤ/m →(·n) ℤ/m, exact, with the
right-hand zero gone: multiplication by n on ℤ/m has cokernel ℤ/d, and that
cokernel is Ext¹(ℤ/n, ℤ/m) ≅ ℤ/d, the answer to pitch problem 3 on
`commutative-homological-algebra`. Tensoring with ℤ/m gives
ℤ/m →(·n) ℤ/m → ℤ/d → 0, exact, with the left-hand zero gone: the kernel of
multiplication by n has order d, and that kernel is Tor₁(ℤ/n, ℤ/m) ≅ ℤ/d.
Each derived functor is the group that failed to be zero. The snake lemma
splices such failures into the long exact sequence
0 → Hom(C, M) → Hom(B, M) → Hom(A, M) → Ext¹(C, M) → ⋯ for every short exact
0 → A → B → C → 0.

## Where to see it

Mac Lane's Categories for the Working Mathematician, on
`category-theory-intro`, has a chapter on abelian categories, and Leinster's
Basic Category Theory proves that right adjoints preserve limits. On
`commutative-homological-algebra`, Aluffi's Algebra: Chapter 0, chapters
VIII–IX, builds Ext and Tor in exactly this language, and Rotman's
Introduction to Homological Algebra proves the snake lemma in full. The table
is a phrasebook.

| Modules over a ring | Category theory |
|---|---|
| R-Mod, Ab, sheaves of abelian groups | abelian categories; one axiom list, every theorem proved once |
| Hom(M, N) is an abelian group, composition bilinear | additive (Ab-enriched) category |
| kernel of f, the solutions of f(x) = 0 | equaliser of f and 0 |
| cokernel N / im f | coequaliser of f and 0 |
| image of f | kernel of the cokernel of f |
| M ⊕ N | biproduct: product and coproduct coincide |
| 0 → A → B → C → 0 exact | A is the kernel of B → C, C the cokernel of A → B |
| exact functor | preserves finite limits and finite colimits |
| Hom(N, −) left exact | right adjoint, so it preserves kernels |
| − ⊗ N right exact | left adjoint to Hom(N, −), so it preserves cokernels |
| free module, direct summand of a free module | projective object: maps out of it lift along epimorphisms |
| projective resolution ⋯ → P₁ → P₀ → M → 0 | replacing an object by a complex of good ones, unique up to homotopy |
| Ext, Tor | derived functors, pinned down by a universal property |
| the snake lemma by chasing elements | Freyd–Mitchell: every small abelian category embeds exactly in some R-Mod |
| Ext¹(C, A) classifies 0 → A → E → C → 0 | a set of arrows A → C of degree one; the Yoneda extension |
