---
between: [algebra-intro, combinatorics]
tagline: Algebra lends combinatorics group actions and finite fields for counting up to symmetry; combinatorics repays with the counting arguments that prove the group theorems.
strength: 3
status: draft
ai_generated: true
---

A group acting on a finite set cuts it into orbits, and "how many different
necklaces" means "how many orbits". The same cut on the group itself proves
its theorems: Lagrange's theorem is that cosets partition a group into equal
blocks. Both fields count orbits; one calls them objects up to symmetry, the
other cosets and conjugacy classes.

## What each side lends

`algebra-intro` supplies the machinery. Orbit–stabiliser,
|G| = |G·x|·|G_x| (Artin's counting formula), makes an orbit's size a quotient
of group orders; Burnside's lemma averages fixed points over the group;
Pólya's cycle index refines it to count orbits by weight, necklaces with k
black beads. Finite fields give designs and codes: the 1- and 2-dimensional
subspaces of 𝔽_q³ are the points and lines of a projective plane, q² + q + 1
of each, any two lines meeting once; q = 2 is the Fano plane. A Reed–Solomon
codeword evaluates a polynomial of degree below k at n points of 𝔽_q; a
non-zero polynomial has fewer than k roots, so two codewords agree in fewer
than k places: distance n − k + 1.

Combinatorics repays with proofs. Cauchy's theorem, McKay's way: there are
|G|ᵖ⁻¹ p-tuples in G with product e, rotation acts with orbits of size 1 or
p, so when p divides |G| the fixed tuples (g, …, g) with gᵖ = e
number a multiple of p, and (e, …, e) is not alone. Fermat's little theorem,
under the shuffle problem on `algebra-intro`, is the same move on strings of
p beads in a colours: the a monochrome strings are fixed, every other has
trivial stabiliser (ℤ/p has no proper non-trivial subgroup), so p divides
aᵖ − a.

## Burnside on six beads

For a finite group G acting on a finite set X the number of orbits is
(1/|G|)∑_{g∈G} |Fix(g)|: count pairs (g, x) with g·x = x by g and by x,
then apply orbit–stabiliser. Pitch problem 2 of `algebra-intro`:
X is the 2⁶ colourings of a hexagon, G the dihedral group of order 12, and a
symmetry with c cycles on the beads fixes 2ᶜ colourings. The identity fixes
64; rotations by ±60° fix 2 each, by ±120° fix 4 each, by 180° fixes 8; the
three reflections through opposite beads fix 16 each, the three through
opposite gaps fix 8 each. The sum is 156 and 156/12 = 13, the hand count on
the topic page. Rotations alone give 84/6 = 14; flipping merges BBWBWW with
its mirror.

## Where to see it

Judson's Abstract Algebra, on `algebra-intro`, proves Burnside's counting
theorem in its group actions chapter and builds codes in its coding theory and
finite fields chapters; Artin calls orbit–stabiliser the counting formula. On
`combinatorics`, adamant's follow-up post derives Pólya enumeration from
species, and Jukna has chapters on designs and codes. `galois-theory` takes
finite fields further. The table is a phrasebook.

| Algebra | Combinatorics |
|---|---|
| group G acting on a finite set X | symmetries of a configuration |
| orbit G·x | one necklace, one unlabelled graph: "the same up to symmetry" |
| stabiliser G_x | the symmetries a particular configuration has |
| orbit–stabiliser, \|G\| = \|G·x\|·\|G_x\| | the counting formula |
| cosets of H partition G (Lagrange) | partition into equal blocks |
| Burnside's lemma | average number of fixed points |
| cycle type of a permutation with c cycles | kᶜ colourings fixed; Pólya's cycle index |
| element of order p (Cauchy) | fixed point of ℤ/p rotating p-tuples |
| 𝔽_q | alphabet of size q |
| 1- and 2-dimensional subspaces of 𝔽_q³ | points and lines of the projective plane of order q |
| polynomial of degree below k over 𝔽_q | Reed–Solomon codeword, distance n − k + 1 |
| monic irreducible polynomials of degree n over 𝔽_q | aperiodic necklaces of length n in q colours |
