---
id: game-theory-compositional
title: Open-source & compositional game theory
category: advanced
tagline: Games whose players can read each other's code, and games built from smaller games — strategic reasoning rebuilt with logic and category theory.
prerequisites: [probability, cs-foundations, compositionality, advanced-logic]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Classical game theory assumes players who choose actions. Two recent lines
of work change what a player is. In *open-source game theory* a player is a
program whose source code the other players can read. This sounds like it
should make cooperation impossible — your opponent can predict you — but
the opposite happens: programs that cooperate with whoever provably
cooperates with them cooperate with each other, and the proof that they do
is Löb's theorem from `advanced-logic`. Self-reference, which in logic is a
source of paradox, is in game theory a source of trust.

In *compositional game theory* a game is an open system: it has inputs
(what the players observe), outputs (what they do), and a notion of how a
continuation of the game feeds back as payoff. Games compose in sequence and
in parallel, like the processes of `compositionality`, and the Nash
equilibria of a composite can be computed from the parts. This gives a
string-diagram language for strategic situations — markets, auctions,
voting, learning agents — and software that compiles diagrams to
equilibrium computations. It is also the first mathematics that treats
"what I do depends on what I expect the future to do" as a compositional
primitive, which is why the same framework now describes gradient descent,
reinforcement learning and Bayesian updating as instances of one structure.

Both lines start from classical game theory, which is itself a beautiful
subject built on `probability` and `linear-algebra`, and both are young
enough that a motivated student can reach the open questions.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Cooperation by proof.** Two programs play the prisoner's dilemma, each
   given the other's source code as input. (a) Show that the program
   "cooperate if and only if the opponent's source code is identical to
   mine" cooperates with its copies but defects against a program that
   differs only by a comment. (b) Design a program that cooperates with
   *any* opponent for which it can prove "the opponent cooperates with me",
   and defects otherwise. Show that two such programs — even with different
   source codes — cooperate with each other. (c) Explain why this does not
   lead to an infinite regress of each program reasoning about the other
   reasoning about it.

   <details><summary>Hint 1</summary>
   (b) Search for a proof, in a fixed formal system, of the statement
   "opponent(me) = Cooperate", up to some bound.
   </details>
   <details><summary>Hint 2</summary>
   Let C be "both cooperate". Each program's behaviour gives
   ⊢ □C → C. Apply Löb's theorem from <code>advanced-logic</code>.
   </details>
   <details><summary>Hint 3</summary>
   This is FairBot (LaVictoire et al., 2014). The regress is cut because
   Löb's theorem turns "if provably cooperates then cooperates" into
   "cooperates" without ever running the opponent.
   </details>

2. **Braess's paradox and the price of anarchy.** 4000 drivers travel from
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
   equilibrium condition "no driver can improve", and the inequality
   x(a y + b) ≤ … for the single-road cost.
   </details>
   <details><summary>Hint 3</summary>
   Roughgarden–Tardos (2002). The bound 4/3 is tight — the Braess network
   with suitable costs achieves it.
   </details>

3. **Games that compose.** A *sequential game* has Alice choose x ∈ X, then
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
   continuation. Open games compose in sequence and in parallel, and the
   string diagrams of <code>compositionality</code> describe them.
   </details>

## Prerequisites

- **Probability** (`probability`): expectation, mixed strategies,
  Bayesian updating.
- **Computer science** (`cs-foundations`): programs as data, the halting
  problem, proof search.
- **Compositionality** (`compositionality`): monoidal categories and
  string diagrams, for the open-games side.
- **Advanced logic** (`advanced-logic`): Löb's theorem, for problem 1.
- Classical game theory itself is introduced by the first two materials.

## From the general materials

- **Princeton Companion** — essays "Game theory", "Mathematics and
  economic reasoning", "Social choice".
- **Sheafification of G** — occasional videos on applied monoidal
  categories.
- **Real Not Complex** — Game Theory and Economics pages.
- The Napkin has no game theory part.

## Materials

### Osborne & Rubinstein — A Course in Game Theory
- **Link:** https://arielrubinstein.tau.ac.il/books/GT.pdf
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (authors' PDF)
- **Strengths:** The standard rigorous introduction to classical game
  theory: strategic and extensive games, Nash equilibrium, mixed
  strategies, repeated games, bargaining, with proofs and exercises.
  Everything below assumes it.
- **Weaknesses:** Economist's examples; no algorithms, no computation.

### Shoham & Leyton-Brown — Multiagent Systems
- **Link:** http://www.masfoundations.org/
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (authors' PDF)
- **Strengths:** Game theory as a computer scientist sees it: computing
  equilibria, mechanism design and auctions, social choice, learning in
  games, logics of knowledge. Problem 2's price of anarchy is in the
  chapter on congestion games.
- **Weaknesses:** Broad rather than deep; the logic chapters are brief.

### Ghani, Hedges, Winschel & Zahn — Compositional Game Theory
- **Link:** https://arxiv.org/abs/1603.04641
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** The founding paper of open games: games as morphisms in a
  symmetric monoidal category, sequential and parallel composition, Nash
  equilibrium as a compositional predicate, with the string-diagram
  notation and worked examples. Problem 3 is its first section.
- **Weaknesses:** Assumes monoidal categories; the original definitions
  have since been simplified (see Hedges's later work).

### Jules Hedges — blog and thesis
- **Link:** https://julesh.com/
- **Type:** blog + thesis
- **Difficulty:** 3-5
- **Free:** yes
- **Strengths:** The most readable account of compositional game theory
  and its later developments (lenses, open learners, categorical
  cybernetics), by one of its creators; the thesis *Towards Compositional
  Game Theory* is linked there, as is the literature review.
- **Weaknesses:** Blog form; research-level in places.

### LaVictoire et al. — Program Equilibrium in the Prisoner's Dilemma via Löb's Theorem
- **Link:** https://intelligence.org/files/ProgramEquilibrium.pdf
- **Type:** paper
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** The paper behind problem 1: FairBot, PrudentBot, and the
  proof that modal agents reasoning about each other's source code
  cooperate by Löb's theorem. Short and self-contained given Löb.
- **Weaknesses:** Workshop paper; the later theory (Critch's parametric
  bounded Löb, arXiv:1602.04184) is needed for bounded agents.

### Capucci, Gavranović, Hedges & Rischel — Towards Foundations of Categorical Cybernetics
- **Link:** https://arxiv.org/abs/2105.06332
- **Type:** paper
- **Difficulty:** 4-5
- **Free:** yes
- **Strengths:** The generalisation: open games, gradient-based learners,
  Bayesian updaters and control systems as instances of one categorical
  structure (parametrised lenses with a feedback). The paper that explains
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
  problem 3 concrete.
- **Weaknesses:** Haskell required; documentation is uneven.

## Problems

- **Osborne & Rubinstein** — exercises per chapter; the extensive-game
  exercises are the drill for problem 3(a).
- **Shoham & Leyton-Brown** — the congestion-game exercises continue
  problem 2.
- **The pitch problems** continue: FairBot → PrudentBot and bounded
  agents; Braess → the general price-of-anarchy theory and smoothness;
  open games → lenses, parallel composition, and the categorical
  cybernetics paper.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Prisoners who read code** — the dilemma, CliqueBot, FairBot, Löb's
  theorem applied. Resolves pitch problem 1; joint with `advanced-logic`.
- **Selfish routing** — Braess worked, equilibrium vs optimum, the 4/3
  bound proved. Resolves pitch problem 2; joint with `dynamical-systems`.
- **Open games by hand** — a sequential game as a lens, composition,
  equilibrium as a predicate, then the same in the engine. Resolves pitch
  problem 3; joint with `compositionality`.
- **One structure, many agents** — a reading of the categorical
  cybernetics paper: games, learners, controllers.
- **Classical game theory in four sessions** — Nash, mixed strategies,
  repeated games, mechanism design, from Osborne–Rubinstein.
