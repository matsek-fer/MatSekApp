---
between: [real-analysis, topology]
tagline: Analysis supplies ℝ, its compact sets and its function spaces; topology returns the open-set definitions that make the theorems hold anywhere.
strength: 3
status: draft
ai_generated: true
---

The limit definitions of `real-analysis` are statements about open sets
wearing a distance: xₙ → x means every open interval around x contains all but
finitely many xₙ, continuity means preimages of open intervals are open,
compactness means every cover by open intervals has a finite subcover.
`topology` keeps the open sets, discards the numbers, and asks which theorems
survive.

## What each side lends

Analysis gives topology its test space, ℝ: Urysohn's lemma separates disjoint
closed sets of a normal space by a continuous map to [0, 1] and Tietze extends
continuous real-valued functions from closed subsets, so the normality of the
topology script's first lectures is about the supply of continuous functions
into ℝ. Completeness of ℝ becomes the complete metric space, Cantor's
intersection theorem and Baire's theorem, lectures 4 and 5.

Topology repays with generality and names. The intermediate value theorem is
"continuous images of connected sets are connected"; the extreme value theorem
is "continuous images of compact sets are compact", true on any compact space.
Uniform convergence is convergence in the complete metric d(f, g) = sup |f − g|
on C([a, b]), so "a uniform limit of continuous functions is continuous" says
C([a, b]) is closed in the bounded functions. Pointwise convergence is the
product topology on ℝ^[a, b], where sequences stop describing closure: no
sequence of indicators of finite subsets of [a, b] converges pointwise to the
constant 1 (countably many finite sets miss some x), yet 1 is in their
closure, since basic open sets constrain finitely many coordinates. So
topology defines closure and compactness by open sets; the sequential versions
are theorems about metric spaces.

## Heine–Borel, generalised and broken

In ℝⁿ compact means closed and bounded. In a metric space, K is compact ⇔ K is
complete and totally bounded (finitely many ε-balls cover K for every ε > 0)
⇔ every sequence in K has a convergent subsequence. Bounded implies totally
bounded in ℝⁿ, not in infinite dimensions: the closed unit ball of C([0, 1])
in the sup metric is closed and bounded, yet fₙ(x) = xⁿ has no uniformly
convergent subsequence, because its pointwise limit, 0 on [0, 1) and 1 at 1,
is discontinuous, and a uniform limit of continuous functions is continuous.
Arzelà–Ascoli names the missing hypothesis, equicontinuity, and underlies
Peano's existence theorem for ODEs in `dynamical-systems`.

## Where to see it

Sutherland does metric spaces first with this motivation; Tao's Analysis II
opens with metric spaces and uniform convergence; Lebl has metric spaces in
Volume I and Arzelà–Ascoli in Volume II; the topology script covers
completeness and Baire in lectures 4 and 5. The table is a phrasebook between
`real-analysis` and `topology`.

| Real analysis on ℝ | Topology |
|---|---|
| open interval (a, b); union of open intervals | basic open set; open set |
| \|x − a\| < ε | x lies in the ball B(a, ε), a basic open neighbourhood of a |
| xₙ → x: eventually within every ε of x | eventually inside every open set containing x |
| ε–δ continuity at every point | preimage of every open set is open |
| closed set: contains the limits of its sequences | complement of an open set; equals its closure — sequences suffice in metric spaces, not in general |
| Bolzano–Weierstrass: bounded sequences have convergent subsequences | sequential compactness; equivalent to compactness in metric spaces, not in general |
| Heine–Borel: closed and bounded | compact: every open cover has a finite subcover; in a metric space, complete and totally bounded |
| intermediate value theorem | intervals are connected; continuous images of connected sets are connected |
| extreme value theorem | continuous images of compact sets are compact |
| Cauchy sequence; completeness of ℝ | complete metric space; Cantor's intersection theorem; Baire category theorem |
| uniform convergence fₙ → f on [a, b] | convergence in the sup metric on C([a, b]), a complete metric space |
| pointwise convergence | product topology on ℝ^[a, b]; not given by any metric |
| uniform continuity; Lipschitz condition | not topological: needs the metric |
| ℝ and the bounded interval (0, 1) | homeomorphic; boundedness and completeness belong to the metric, not the topology |
