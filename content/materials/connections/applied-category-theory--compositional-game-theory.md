---
between: [applied-category-theory, compositional-game-theory]
tagline: Applied category theory lends open games its string diagrams and lenses; open games repay it with a flagship application and categorical cybernetics.
strength: 3
status: draft
ai_generated: true
---

An open game is an open system in the sense `applied-category-theory` gave to
Petri nets, circuits and databases: a morphism in a symmetric monoidal
category, composed by plugging and juxtaposing boxes. The box is a game
because the morphism is a lens: observations flow forwards into moves,
utility flows backwards, and one composition law handles both.

## What each side lends

From `applied-category-theory` come the tools. Joyal and Street's theorem on
string diagrams makes a wiring diagram a proof: diagrams that deform into each
other denote equal morphisms. The lens was Foster and Pierce's answer to the
view-update problem for databases before it was a game. Fritz's Markov
categories put kernels on the wires, so private types compose by
Chapman–Kolmogorov and Bayesian inversion rides the backward map; Bolt,
Hedges and Zahn's auctions live there.

`compositional-game-theory` repays twice. It is the ACT example in which
compositionality is a theorem, not a definition: payoffs compose, Nash
equilibria do not (pitch problem 2 there), so the invariant that does, "σ is
an equilibrium against the continuation k : Y → R", had to be found. Second,
the same lens is the shape of gradient descent, Bayesian updating and feedback
control, which Capucci, Gavranović, Hedges and Rischel unified as parametrised
lenses with feedback: categorical cybernetics, now an ACT subject.

## The lens law, on the auction

A lens (X, S) → (Y, R) is a pair v : X → Y, u : X × R → S. Its composite with
(v′, u′) : (Y, R) → (Z, Q) is v′ ∘ v forwards and (x, q) ↦ u(x, u′(v(x), q))
backwards; with componentwise ⊗, lenses form a symmetric monoidal category. An
open game is such a lens for each strategy σ ∈ Σ, plus the equilibrium
predicate.

A bidder with strategy β is the lens v ↦ β(v) forwards, (v, (w, p)) ↦ w·(v − p)
backwards, w ∈ {0, 1} a win and p the price; scoring needs v, which is why u
takes X × R, not R. The allocation box sends (b₁, b₂) forwards to the winner at
p = max(b₁, b₂) and (wᵢ, p) back along each bid wire; the law hands bidder i
the coutility wᵢ·(vᵢ − p). If Bob plays β(w) = w/2 on a uniform value, Alice
bidding b ≤ ½ wins with probability 2b and expects (v − b)·2b, maximal at
b = v/2: β is a best response to itself (pitch problem 3). Swap in
p = min(b₁, b₂) and the bidders stand: truthful bidding, expected price 1/3
either way.

<svg viewBox="0 0 560 225" width="100%" style="max-width:560px" role="img" aria-label="Two bidder boxes feed an allocation box; values and bids flow forwards on solid wires, win and price flow backwards on dashed wires">
  <rect x="110" y="20" width="110" height="50" fill="none" stroke="currentColor"/>
  <text x="165" y="50" font-size="13" text-anchor="middle" fill="currentColor">bidder β₁</text>
  <rect x="110" y="145" width="110" height="50" fill="none" stroke="currentColor"/>
  <text x="165" y="175" font-size="13" text-anchor="middle" fill="currentColor">bidder β₂</text>
  <rect x="370" y="50" width="130" height="115" fill="none" stroke="currentColor"/>
  <text x="435" y="103" font-size="13" text-anchor="middle" fill="currentColor">allocation</text>
  <text x="435" y="121" font-size="12" text-anchor="middle" fill="currentColor">p = max b</text>
  <line x1="30" y1="35" x2="110" y2="35" fill="none" stroke="currentColor"/>
  <text x="70" y="30" font-size="12" text-anchor="middle" fill="currentColor">v₁ →</text>
  <line x1="30" y1="180" x2="110" y2="180" fill="none" stroke="currentColor"/>
  <text x="70" y="175" font-size="12" text-anchor="middle" fill="currentColor">v₂ →</text>
  <line x1="220" y1="35" x2="370" y2="68" fill="none" stroke="currentColor"/>
  <text x="295" y="34" font-size="12" text-anchor="middle" fill="currentColor">b₁ = β₁(v₁) →</text>
  <line x1="370" y1="88" x2="220" y2="58" fill="none" stroke="currentColor" stroke-dasharray="4 3"/>
  <text x="295" y="100" font-size="12" text-anchor="middle" fill="currentColor">← (w₁, p)</text>
  <line x1="370" y1="127" x2="220" y2="157" fill="none" stroke="currentColor" stroke-dasharray="4 3"/>
  <text x="295" y="122" font-size="12" text-anchor="middle" fill="currentColor">← (w₂, p)</text>
  <line x1="220" y1="180" x2="370" y2="147" fill="none" stroke="currentColor"/>
  <text x="295" y="196" font-size="12" text-anchor="middle" fill="currentColor">b₂ = β₂(v₂) →</text>
  <line x1="500" y1="107" x2="545" y2="107" fill="none" stroke="currentColor"/>
  <text x="522" y="100" font-size="12" text-anchor="middle" fill="currentColor">(w, p) →</text>
  <text x="280" y="218" font-size="12" text-anchor="middle" fill="currentColor">solid wires play forwards · dashed wires carry utility backwards</text>
</svg>

## Where to see it

On `applied-category-theory`, Fong and Spivak's *Seven Sketches*, chapter 5,
draws open systems with feedback as string diagrams; Fritz's paper is the
probability on the wires. On `compositional-game-theory`, Ghani, Hedges,
Winschel and Zahn define lens and predicate; Bolt, Hedges and Zahn wire up
this auction.
