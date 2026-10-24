---
between: [computability, open-source-game-theory]
tagline: Computability lends the recursion theorem and the halting problem; open-source game theory repays with self-reference that builds trust instead of paradox.
strength: 2
status: draft
ai_generated: true
---

A player that is a program and reads the opponent's source before moving is
a program computing on programs, the object `computability` studies.
Kleene's recursion theorem says such a program may quote its own code, so
"will X cooperate with me?" is a sentence a program can write about itself.
`open-source-game-theory` is that self-reference put to work for trust
rather than for paradox.

## What each side lends

`computability` supplies the premises and the prohibitions. A universal
machine makes a strategy a finite string the opponent can read; the
recursion theorem makes it a string that can name itself. Rice's theorem
then says what no player can do: "X cooperates with me" is a non-trivial
property of X's behaviour, so no program decides it for every X, nor whether
an arbitrary pair of programs is an equilibrium, since even its outcome is a
halting question. What remains is semi-decision — provability is Σ₁ — and
retreat to decidable fragments: Tennenholtz's equilibria compare source
texts, which is decidable and fragile; Barasz et al.'s modal agents are
formulas of GL, a decidable modal logic, so any match between them is
computable from finite Kripke models.

`open-source-game-theory` repays with a constructive use of the recursion
theorem, which in Cutland mostly serves to prove undecidability, and with
resource-bounded provability: Critch's parametric bounded Löb's theorem asks
how long a proof must be before a bot with a proof budget finds it, which is
complexity theory applied to proofs.

## The regress and its cure

The naive player simulates: SimBot(X) := X(SimBot). It cooperates with
CooperateBot, but SimBot(SimBot) calls SimBot(SimBot) and never returns — a
program that runs its opponent on itself has diagonalised against itself.
FairBot replaces simulation by proof search: given X, search Peano
arithmetic for a proof of "X(FairBot) = C"; cooperate if one is found,
otherwise defect. By the recursion theorem FairBot may name itself in that
sentence.

Theorem (LaVictoire et al.). FairBot(FairBot) = C.

Proof. Let S be "FairBot(FairBot) = C". PA ⊢ □S → S: if a proof of S
exists, the search finds it and FairBot outputs C, and PA can check this,
since the search is a program it can reason about. Löb's theorem gives
PA ⊢ S. The search finds that proof and both cooperate. ∎

Against DefectBot no proof exists, so FairBot defects — provided the search
is bounded, since an unbounded search halts only on success. Whether Löb's
proof fits under the bound is Critch's question.

## Where to see it

LaVictoire et al. on `open-source-game-theory` proves the theorem; Barasz et
al. gives the decision procedure for modal agents. Cutland on
`computability` proves the s-m-n and recursion theorems and Rice's theorem;
`advanced-logic` has Löb. The table is a dictionary.

| Computability | Open-source game theory |
|---|---|
| program as data; the code of a machine | source code handed to the opponent |
| universal machine U(e, x) | simulating the opponent on your own code |
| recursion theorem, φ_e = φ_{f(e)} | a bot that writes "X(me) = C" about itself |
| halting problem | SimBot(SimBot) never returns |
| Rice's theorem | no bot decides "X cooperates with me" for every X |
| Σ₁ set, semi-decidable | "X(me) = C is provable"; the search halts on success |
| Löb's theorem via the recursion theorem | FairBot(FairBot) = C |
| decidable fragment (GL, finite Kripke models) | modal agents; Barasz et al.'s algorithm |
| syntactic equality of codes | CliqueBot and Tennenholtz's folk theorem |
| bounded computation; complexity | proof search with a length budget; Critch |
