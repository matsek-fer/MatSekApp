---
id: open-source-game-theory
title: Open-source game theory
category: advanced
tagline: Games whose players can read each other's code — where self-reference, the source of paradox in logic, becomes a source of trust.
prerequisites: [probability, cs-foundations, advanced-logic]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Classical game theory assumes players who choose actions and know only each
other's payoffs. Replace the players by programs, and hand each program the
other's source code before it moves. This sounds like it should make
cooperation hopeless — your opponent can simulate you — but the opposite
happens. A program that cooperates with whoever it can *prove* will
cooperate with it ends up cooperating with any other such program, even one
written differently, and the proof that it does is Löb's theorem from
`advanced-logic`. Programs that reason about each other's reasoning do not
fall into infinite regress; they fall into a fixed point.

The subject began with Tennenholtz's program equilibria (2004), which showed
that source-code access lets one-shot games sustain outcomes that classically
need repetition, and became a small field when provability logic was brought
in: modal agents, bounded versions of Löb's theorem for agents with finite
proof search, and the question of which "robust" cooperation is possible
between agents who are not copies of each other. It matters beyond puzzles:
automated negotiators, smart contracts and AI systems that can inspect each
other are exactly players with source-code access.

Mathematically it is a meeting of `probability` (expected payoffs, mixed
strategies), `cs-foundations` (programs as data, proof search, the halting
problem) and `advanced-logic` (provability, Löb), and it is young enough that
the open questions are within reach.

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
   Let C be "both cooperate". Each program's behaviour gives ⊢ □C → C.
   Apply Löb's theorem.
   </details>
   <details><summary>Hint 3</summary>
   This is FairBot (LaVictoire et al., 2014). The regress is cut because
   Löb's theorem turns "if provably cooperates then cooperates" into
   "cooperates" without ever running the opponent.
   </details>

2. **Cooperate with the fair, exploit the naive.** FairBot from problem 1
   cooperates with CooperateBot (the program that always cooperates) and so
   leaves money on the table. Design a program that (i) cooperates with
   FairBot, (ii) cooperates with copies of itself, and (iii) defects against
   CooperateBot — and prove all three. What goes wrong if you try to do it
   with a single proof system?

   <details><summary>Hint 1</summary>
   Defect against X if you can prove X would cooperate with DefectBot;
   otherwise behave like FairBot.
   </details>
   <details><summary>Hint 2</summary>
   The two proof searches must be in systems of different strength (PA and
   PA + Con(PA)), or the program can prove things about itself that make
   it defect against FairBot.
   </details>
   <details><summary>Hint 3</summary>
   This is PrudentBot; the general theory of such "modal agents" and their
   fixed points is in Barasz et al.
   </details>

3. **Everything is an equilibrium.** In a one-shot game, the classical
   theory allows only Nash equilibria; cooperation in the prisoner's
   dilemma is not one. Prove that when both players submit programs that
   can read each other's code, *every* payoff pair in which each player
   gets at least their security level (the most they can guarantee alone)
   can be sustained as an equilibrium of programs. Then explain why this
   "folk theorem" is less reassuring than it sounds.

   <details><summary>Hint 1</summary>
   Submit "play the agreed action if the opponent's code is this exact
   text, otherwise punish".
   </details>
   <details><summary>Hint 2</summary>
   Neither player gains by deviating: any other program triggers the
   punishment, which holds them to their security level.
   </details>
   <details><summary>Hint 3</summary>
   Tennenholtz (2004). The equilibrium is fragile — it needs exact
   syntactic agreement — which is exactly what the Löbian agents of
   problems 1 and 2 repair.
   </details>

## Prerequisites

- **Probability** (`probability`): expected payoff, mixed strategies.
- **Computer science** (`cs-foundations`): programs as data, the halting
  problem, enumerating proofs.
- **Advanced logic** (`advanced-logic`): Löb's theorem and the modal logic
  of provability, for problems 1 and 2.
- Classical game theory is introduced by Osborne & Rubinstein below.

## From the general materials

- **Gödel, Escher, Bach** (Hofstadter) — self-reference as a theme; this
  topic is self-reference made cooperative.
- **Princeton Companion** — essays "Game theory", "Gödel's theorem".
- **Real Not Complex** — Game Theory and Logic pages.
- The Napkin has no game theory part.

## Materials

### Osborne & Rubinstein — A Course in Game Theory
- **Link:** https://arielrubinstein.tau.ac.il/books/GT.pdf
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (authors' PDF)
- **Strengths:** The standard rigorous introduction to classical game
  theory: strategic and extensive games, Nash equilibrium, mixed
  strategies, repeated games and the folk theorem, with proofs and
  exercises. The baseline that problem 3 departs from.
- **Weaknesses:** Economist's examples; no computation.

### Moshe Tennenholtz — Program Equilibrium
- **Link:** https://doi.org/10.1016/j.geb.2004.02.002
- **Type:** paper
- **Difficulty:** 3
- **Free:** no (Games and Economic Behavior, 2004; preprints circulate)
- **Strengths:** The founding paper: players submit programs with access to
  each other's code, and the folk theorem of problem 3 holds in one shot.
  Short and readable with Osborne–Rubinstein behind you.
- **Weaknesses:** Paywalled; the equilibria are the fragile syntactic ones.

### LaVictoire et al. — Program Equilibrium in the Prisoner's Dilemma via Löb's Theorem
- **Link:** https://intelligence.org/files/ProgramEquilibrium.pdf
- **Type:** paper
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** The paper behind problems 1 and 2: FairBot, PrudentBot,
  and the proof that agents reasoning about each other's source code
  cooperate by Löb's theorem. Short and self-contained given Löb.
- **Weaknesses:** Workshop paper; the bounded-agent theory came later.

### Barasz et al. — Robust Cooperation in the Prisoner's Dilemma: Program Equilibrium via Provability Logic
- **Link:** https://arxiv.org/abs/1401.5577
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** The full theory of modal agents: agents defined by
  formulas of provability logic, their behaviour computed by Kripke
  semantics, and the proofs that FairBot and PrudentBot behave as claimed
  against every modal opponent. Includes an algorithm for evaluating any
  such agent pair.
- **Weaknesses:** Assumes the modal logic GL (`advanced-logic`).

### Andrew Critch — Parametric Bounded Löb's Theorem and Robust Cooperation of Bounded Agents
- **Link:** https://arxiv.org/abs/1602.04184
- **Type:** paper
- **Difficulty:** 4-5
- **Free:** yes
- **Strengths:** Löb's theorem for agents with bounded proof search, so
  that the cooperation of problem 1 survives when the programs can actually
  be run. The bridge from the idealised theory to real computation.
- **Weaknesses:** Technical; the bounds are intricate.

### Caspar Oesterheld — Robust Program Equilibrium
- **Link:** https://doi.org/10.1007/s11238-018-9679-3
- **Type:** paper
- **Difficulty:** 3-4
- **Free:** partial (journal paywalled; author's preprint online)
- **Strengths:** Program equilibria that work without provability logic:
  programs that simulate each other with a small probability of stopping,
  giving robust cooperation in general games, not only the prisoner's
  dilemma. A different route to the same goal.
- **Weaknesses:** The simulation-based agents are harder to analyse than
  the modal ones.

### Raymond Smullyan — Forever Undecided
- **Link:** https://openlibrary.org/search?q=forever+undecided+smullyan
- **Type:** book
- **Difficulty:** 2
- **Free:** no
- **Strengths:** See `advanced-logic`. The puzzle route to Löb's theorem,
  which is the only logic this topic needs.
- **Weaknesses:** As there.

## Problems

- **Osborne & Rubinstein** — the repeated-games chapter, for the classical
  folk theorem that problem 3 echoes.
- **Barasz et al.** — contains the general decision procedure; implement it
  and test agents against each other.
- **The pitch problems** continue: FairBot → the full modal-agent theory;
  PrudentBot → agents of higher proof strength and the "Löbian obstacle";
  the folk theorem → Oesterheld's robust equilibria and program equilibria
  in general games.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Prisoners who read code** — the dilemma, CliqueBot, FairBot, Löb's
  theorem applied. Resolves pitch problem 1; joint with `advanced-logic`.
- **PrudentBot and the two proof systems** — why one system is not enough.
  Resolves pitch problem 2.
- **Program equilibria** — Tennenholtz's folk theorem, its fragility, and
  what robustness means. Resolves pitch problem 3.
- **Modal combat** — implement the Barasz et al. decision procedure and run
  a tournament of modal agents; joint with `cs-foundations`.
