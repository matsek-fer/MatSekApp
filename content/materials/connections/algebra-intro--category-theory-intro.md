---
between: [algebra-intro, category-theory-intro]
tagline: Algebra supplies the first objects and arrows; category theory returns universal properties that pin down quotients, products and free groups by their maps alone.
strength: 3
status: draft
ai_generated: true
---

Algebra works the way category theory asks everything to work: a group is
known through its homomorphisms, a quotient through the maps that kill a
normal subgroup. Category theory makes that habit the definition: objects and
arrows are all there is, so a construction is whatever has the right maps in
and out, proved unique once for every category.

## What each side lends

`algebra-intro` supplies the examples: Grp, groups with homomorphisms, and
each group G as a category with one object, its arrows the elements composed
by multiplication. A G-set is a functor from that category to
Set, and Cayley's theorem, G ↪ Sym(G), is its Yoneda embedding. The
cancellation problem on `category-theory-intro` falls to counting
homomorphisms into each side, Yoneda's principle that an object is known by
the maps into it.

In return, universal properties replace constructions. G × H is the group
through which every pair of homomorphisms into G and H factors uniquely; the
dual demand, maps out of both, gives the coproduct — the free product G ∗ H in
Grp, the direct sum in Ab. The free group F(S) is no longer reduced words but
the left adjoint of the forgetful functor Grp → Set,
Hom_Grp(F(S), G) ≅ Hom_Set(S, G). And the isomorphism theorems become one
factorisation.

## One factorisation

Let N ⊴ G with projection π: G → G/N. For every homomorphism φ: G → H with
N ⊆ ker φ there is exactly one φ̄: G/N → H with φ = φ̄ ∘ π. Cosets prove
existence; the property makes anything else with it isomorphic to G/N over
π. For N = ker φ the map φ̄ is injective, so φ factors as G ↠ G/ker φ ↪ H:
the first isomorphism theorem. The second and third are the same
factorisation for π restricted to a subgroup K ≤ G, giving
KN/N ≅ K/(K ∩ N), and for the composite G → G/N → (G/N)/(M/N) with
N ⊆ M ⊴ G, giving G/M.

Reduction n ↦ (n mod 2, n mod 3) is a homomorphism ℤ → ℤ/2 × ℤ/3 killing 6ℤ,
so it factors uniquely through ℤ/6; the induced map is injective, as 2 | n
and 3 | n force 6 | n, and both sides have six elements, so
ℤ/6 ≅ ℤ/2 × ℤ/3: the Chinese remainder theorem with no coset written down.

## Where to see it

Aluffi's Algebra: Chapter 0, listed on `algebra-intro`, defines products,
quotients and free groups by universal properties before constructing them.
On `category-theory-intro`, Leinster's Basic Category Theory does
free ⊣ forgetful and Yoneda; Riehl's Category Theory in Context draws its
examples from Grp and Ab. The table is a phrasebook.

| Algebra | Category theory |
|---|---|
| groups and homomorphisms, rings and ring homomorphisms | the categories Grp and Ring; morphisms, composed by ∘ |
| a group G | a category with one object, every arrow invertible |
| a monoid | a category with one object |
| isomorphism, a homomorphism with a two-sided inverse | invertible arrow, the same definition in every category |
| G-set, action G × X → X | functor from the one-object category of G to Set |
| equivariant map between G-sets | natural transformation |
| Cayley's theorem, G ↪ Sym(G) | Yoneda embedding of the one-object category |
| direct product G × H with its projections | product |
| free product G ∗ H, direct sum in Ab | coproduct — one property, two answers |
| trivial group | zero object, initial and terminal in Grp |
| ring ℤ, the unique homomorphism ℤ → R | initial object in Ring |
| quotient G/N, cosets gN | universal arrow out of G killing N, a coequaliser |
| kernel of φ | equaliser of φ and the trivial homomorphism |
| first isomorphism theorem | every arrow factors as a surjection followed by an injection |
| free group F(S), reduced words | left adjoint F ⊣ U of the forgetful functor Grp → Set |
| Hom(ℤ, G) ≅ G | ℤ = F(∗) represents the forgetful functor |
