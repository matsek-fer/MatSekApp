---
between: [compositional-game-theory, probability]
tagline: Probability supplies mixed strategies, priors and expected utility; open games treat each chance move as a Markov kernel wired into the diagram.
strength: 2
status: draft
ai_generated: true
---

A mixed strategy is a distribution over moves, a chance move a
distribution nobody controls, a private type a distribution drawn before
play. Compositional game theory makes them one kind of arrow, a Markov
kernel x ↦ k(· | x), composed with the rest of the game by the same rules.
Forwards flows a kernel; backwards flows a conditional expectation.

Probability supplies the working parts. Expected utility makes payoff
linear in a player's own mixture, u(p, q) = Σₓ,ᵧ p(x) q(y) u(x, y); that
linearity makes best responses convex-valued, so Kakutani's fixed-point
theorem gives Nash's theorem: every finite game has a mixed equilibrium.
Harsanyi's Bayesian games add a common prior over types; a strategy maps
types to moves, and a Bayesian Nash equilibrium maximises conditional
expected utility given one's own type, the route to b(v) = v/2 in pitch
problem 3 of `compositional-game-theory`. Chance moves in sequence compose
by the Chapman–Kolmogorov equation,
(k₂∘k₁)(z | x) = Σᵧ k₂(z | y) k₁(y | x), a product of stochastic matrices.

The return traffic is lighter. Open games draw a probabilistic model as a
string diagram: independence is parallel composition, marginalisation a
discarded wire, Chapman–Kolmogorov two boxes in a row. The lens picture
puts Bayes' rule and expected utility on one footing, both backward maps
along a kernel; Bolt, Hedges & Zahn run Bayesian updating down the
coutility wire. Revenue equivalence becomes a diagram equation between
allocation boxes with the same expected backward flow.

## Matching pennies as an open game

Nash's theorem: a game with finitely many players and moves has an
equilibrium in mixed strategies; in open-game terms, each strategy a
kernel from a point, the predicate "every kernel maximises expected
coutility against the others" is satisfiable for a closed game. Alice and
Bob each show heads or tails; Alice wins 1 on a match, loses 1 otherwise.
No pure profile is stable, since the loser always switches. If Alice
shows heads with probability p and Bob with q, her expected payoff is
(2p − 1)(2q − 1). At q = ½ every p earns 0,
symmetrically for Bob, so (½, ½) is an equilibrium, the only one, since
q ≠ ½ gives Alice a strict preference and Bob a reason to move. The
computation is one kernel composition, p ⊗ q then u, and one expectation.

## Where to see it

Osborne & Rubinstein, on `compositional-game-theory`, define Bayesian
games in the strategic-games chapter and prove Nash's theorem in the
next; Roughgarden's auction lectures carry the probability behind revenue
equivalence; Bolt, Hedges & Zahn's *Bayesian Open Games* puts kernels on
the wires. On `probability`, Blitzstein & Hwang make conditioning the
central idea and Grimmett & Stirzaker's Markov-chains chapter has
Chapman–Kolmogorov.

| Compositional game theory | Probability |
|---|---|
| mixed strategy | distribution on moves, a kernel from a point |
| chance move (nature) | Markov kernel no player controls |
| private type with a common prior (Harsanyi) | random variable drawn before play |
| strategy in a Bayesian game | kernel from types to moves |
| payoff of a mixed profile | expected utility Σ p(x) q(y) u(x, y) |
| coutility flowing backwards | conditional expectation given what the player saw |
| best response | argmax of conditional expected utility |
| Nash equilibrium | fixed point of the best-response correspondence, via Kakutani |
| chance moves in sequence | Chapman–Kolmogorov, product of stochastic matrices |
| parallel composition ⊗ | independence, product measure |
| discarding a wire | marginalisation |
| Bayesian updating down the backward wire | Bayes' rule, inversion of a kernel against a prior |
| revenue equivalence as a diagram equation | equal expected revenue over the prior |
