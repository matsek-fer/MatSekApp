---
id: compositional-game-theory
title: Compositional game theory
category: advanced
tagline: Games built from smaller games — strategic reasoning rebuilt as an open system, with string diagrams for markets, auctions and learning agents.
prerequisites: [probability, compositionality, category-theory-intro]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

A game in the classical sense is a closed object: players, strategies,
payoffs, and an equilibrium concept applied to the whole. Real strategic
situations are not closed. An auction sits inside a market, a market inside
an economy; a negotiation has a before and an after; the payoff of a move
depends on how the rest of the world responds. Compositional game theory
makes this precise. A game becomes an *open* system: it has inputs (what the
players observe), outputs (what they do), and — the key idea — a backwards
channel carrying the payoff information from the continuation back into the
game. Games compose in sequence and in parallel exactly like the processes
of `compositionality`, and the Nash equilibria of a composite are computed
from those of the parts.

The pay-off is a string-diagram language for strategic situations and
software that compiles diagrams into equilibrium computations. It is also a
discovery: the forwards-and-backwards structure of an open game (a *lens*)
turns out to be the same structure as gradient descent, Bayesian updating and
control loops, so games, learners and controllers are instances of one
mathematics — categorical cybernetics.

The topic rests on classical game theory, which it does not replace: the
first job is to know what a Nash equilibrium is and why the price of anarchy
can exceed one. The second is to see why equilibria, unlike payoffs, do not
compose naively — and what does.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Braess's paradox and the price of anarchy.** 4000 drivers travel from
   S to E. Road S→A takes T/100 minutes when T drivers use it; A→E takes
   45 minutes always; S→B takes 45 minutes; B→E takes T/100. (a) Find the
   split at which no driver gains by switching, and the travel time. (b) A
   new road A→B taking 0 minutes opens. Find the new equilibrium and show
   that every driver is slower. (c) Prove that in any network whose roads
   have delays of the form aT + b, the total travel time at a selfish
   equilibrium is at most 4/3 of the total time a central planner could
   achieve.

   <details><summary>Hint 1</summary>
   (a) 2000 each way, 65 minutes. (b) Everyone takes S→A→B→E: 80 minutes.
   </details>
   <details><summary>Hint 2</summary>
   (c) Compare the equilibrium flow f with the optimal flow f* using the
   equilibrium condition "no driver can improve" and the inequality
   x·(ay + b) ≤ x·(ax + b) + y·(ay + b)/4 for a single road.
   </details>
   <details><summary>Hint 3</summary>
   Roughgarden–Tardos (2002). The bound 4/3 is tight — the Braess network
   with suitable costs achieves it.
   </details>

2. **Games that compose.** A *sequential game* has Alice choose x ∈ X, then
   Bob, seeing x, choose y ∈ Y, with payoffs u_A(x, y), u_B(x, y).
   (a) Prove that backward induction (Bob best-responds; Alice optimises
   against that) yields a Nash equilibrium. (b) Wire two sequential games
   so that the outcome (x, y) of the first is the input to the second.
   Give an example where the equilibria of the composite are *not*
   determined by the equilibria of the two parts. (c) Find a summary of a
   game — more than its set of equilibria — from which the summary of a
   sequential composite *can* be computed, and prove that it composes.

   <details><summary>Hint 1</summary>
   (b) Let the second game reward Bob for having chosen a particular y in
   the first; Bob's first-stage best response now depends on the
   continuation.
   </details>
   <details><summary>Hint 2</summary>
   (c) Record, for each possible continuation (a function from outcomes
   to payoffs), the set of strategy profiles that are equilibria against
   it.
   </details>
   <details><summary>Hint 3</summary>
   This is the "open game" of Ghani–Hedges–Winschel–Zahn: play forwards,
   coutility backwards, and an equilibrium predicate relative to the
   continuation.
   </details>

3. **An auction as a wiring diagram.** Two bidders have private values
   drawn independently and uniformly from [0, 1]; each submits a bid; the
   higher bid wins and pays its own bid. (a) Find the symmetric equilibrium
   bidding function. (b) Describe the auction as a composite of three open
   systems — two "bidder" boxes and one "allocation" box — and say what
   information flows forwards and what flows backwards on each wire.
   (c) Replace the allocation box by a second-price rule without touching
   the bidder boxes; find the new equilibrium and compare the seller's
   expected revenue in the two cases.

   <details><summary>Hint 1</summary>
   (a) Bid half your value: b(v) = v/2.
   </details>
   <details><summary>Hint 2</summary>
   (b) Forwards: values in, bids out, winner and price out. Backwards: each
   bidder's utility, computed from the allocation and sent back along the
   wire that carried the bid.
   </details>
   <details><summary>Hint 3</summary>
   (c) Truthful bidding; the expected revenue is 1/3 in both cases —
   revenue equivalence, here as a statement that two different allocation
   boxes induce the same backwards flow in expectation.
   </details>

## Prerequisites

- **Probability** (`probability`): expectation, mixed strategies,
  distributions of private values.
- **Compositionality** (`compositionality`): monoidal categories and
  string diagrams; open games are their strategic version.
- **Category theory** (`category-theory-intro`): functors and the idea of
  a lens (a pair of maps, one forwards and one backwards).
- Classical game theory itself is introduced by the first two materials.

## From the general materials

- **Princeton Companion** — essays "Game theory", "Mathematics and
  economic reasoning".
- **Sheafification of G** — occasional videos on applied monoidal
  categories and lenses.
- **Real Not Complex** — Game Theory and Economics pages.
- **nLab** — entries "open game", "lens (in computer science)".
- The Napkin has no game theory part.

## Materials

### Osborne & Rubinstein — A Course in Game Theory
- **Link:** https://arielrubinstein.tau.ac.il/books/GT.pdf
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (authors' PDF)
- **Strengths:** The standard rigorous introduction to classical game
  theory: strategic and extensive games, Nash equilibrium, mixed
  strategies, subgame perfection, with proofs and exercises. Problem 2(a)
  is its extensive-games chapter.
- **Weaknesses:** Economist's examples; no algorithms, no computation.

### Tim Roughgarden — Algorithmic Game Theory (lecture notes)
- **Link:** https://timroughgarden.org/f13/f13.html
- **Type:** notes
- **Difficulty:** 3
- **Free:** yes (Stanford CS364A; the *Twenty Lectures* book is the same
  material in print)
- **Strengths:** The computer scientist's game theory: mechanism design
  and auctions (problem 3), selfish routing and the price of anarchy
  (problem 1), learning in games, complexity of equilibria. Each lecture
  is self-contained with exercises.
- **Weaknesses:** Nothing categorical; the compositional viewpoint is
  absent.

### Ghani, Hedges, Winschel & Zahn — Compositional Game Theory
- **Link:** https://arxiv.org/abs/1603.04641
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** The founding paper of open games: games as morphisms in a
  symmetric monoidal category, sequential and parallel composition, Nash
  equilibrium as a compositional predicate, with the string-diagram
  notation and worked examples. Problem 2 is its first section.
- **Weaknesses:** Assumes monoidal categories; the original definitions
  have since been simplified.

### Jules Hedges — blog and thesis
- **Link:** https://julesh.com/
- **Type:** blog + thesis
- **Difficulty:** 3-5
- **Free:** yes
- **Strengths:** The most readable account of compositional game theory
  and its later developments (lenses, open learners, categorical
  cybernetics), by one of its creators; the thesis *Towards Compositional
  Game Theory* is linked there, as is a literature review.
- **Weaknesses:** Blog form; research-level in places.

### Bolt, Hedges & Zahn — Bayesian Open Games
- **Link:** https://arxiv.org/abs/1910.03656
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** Open games with incomplete information: private types,
  Bayesian updating as part of the backwards flow, and the auction of
  problem 3 as a worked example. The version of the theory that reaches
  real economics.
- **Weaknesses:** Builds on the original paper's machinery.

### Capucci, Gavranović, Hedges & Rischel — Towards Foundations of Categorical Cybernetics
- **Link:** https://arxiv.org/abs/2105.06332
- **Type:** paper
- **Difficulty:** 4-5
- **Free:** yes
- **Strengths:** The generalisation: open games, gradient-based learners,
  Bayesian updaters and control systems as instances of one categorical
  structure (parametrised lenses with feedback). The paper that explains
  why the open-games framework keeps appearing elsewhere.
- **Weaknesses:** Research level; terse.

### CyberCat Institute — Open Game Engine
- **Link:** https://github.com/CyberCat-Institute/open-game-engine
- **Type:** repo
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** A Haskell implementation of open games: write a game as a
  diagram, compose, and compute equilibria; comes with tutorials and worked
  examples (auctions, markets, Braess-type networks). The way to make
  problems 2 and 3 concrete.
- **Weaknesses:** Haskell required; documentation is uneven.

## Problems

- **Osborne & Rubinstein** — the extensive-games exercises for
  problem 2(a).
- **Roughgarden** — the exercises on selfish routing and auctions continue
  problems 1 and 3.
- **The pitch problems** continue: Braess → the general price-of-anarchy
  theory via smoothness; open games → parallel composition and lenses;
  auctions → Bayesian open games and revenue equivalence in general.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Selfish routing** — Braess worked, equilibrium vs optimum, the 4/3
  bound proved. Resolves pitch problem 1; joint with `dynamical-systems`.
- **Open games by hand** — a sequential game as a lens, composition,
  equilibrium as a predicate, then the same in the engine. Resolves pitch
  problem 2; joint with `compositionality`.
- **Auctions as diagrams** — first- and second-price auctions wired up,
  equilibria computed, revenue equivalence as a diagram equation.
  Resolves pitch problem 3; joint with `probability`.
- **One structure, many agents** — a reading of the categorical
  cybernetics paper: games, learners, controllers.
