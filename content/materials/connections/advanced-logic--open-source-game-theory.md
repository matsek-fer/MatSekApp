---
between: [advanced-logic, open-source-game-theory]
tagline: Provability logic supplies the Löbian fixed point that lets code-reading agents cooperate; the agents give GL a scoreboard and a reason to bound proofs.
strength: 3
status: draft
ai_generated: true
---

A program given its opponent's source is a theory reasoning about
another theory; "my opponent cooperates with me" says a proof search halts.
The self-reference that gives `advanced-logic` the Gödel sentence gives
`open-source-game-theory` the fixed point two agents settle into when each
reasons about the other, and Löb's theorem says it is cooperation, not
regress.

`advanced-logic` supplies the proof apparatus. The diagonal lemma lets an
agent quote its own source; Löb's theorem collapses "if the opponent
provably cooperates, cooperate" into cooperation; GL, K plus
□(□A → A) → □A, makes the collapse mechanical. By the de Jongh–Sambin
theorem every formula with p only inside boxes has a unique fixed point, so
each pair of modal agents has a determined outcome, and by Solovay's theorem
what GL derives, PA proves and the programs enact. The second
incompleteness theorem is the obstacle: "FairBot defects against DefectBot"
is PA-equivalent to Con(PA), so an agent needing it must search a stronger
theory.

`open-source-game-theory` returns a scoreboard. CooperateBot is ⊤,
DefectBot ⊥, FairBot □p; the Barasz et al. algorithm is GL's Kripke
semantics run as a tournament; PrudentBot, searching PA for "X cooperates
with me" and PA + Con(PA) for "X defects against DefectBot", pays for
climbing the hierarchy of theories. Running agents check proofs only up to
length n, so the field needed, and Critch proved, a bounded Löb's theorem
for □ₙ under which the cooperation below survives.

## FairBot cooperates with FairBot

Theorem (LaVictoire et al.). Let A and B be programs, each searching PA for
a proof that the other cooperates with it and cooperating iff one is found;
their source codes may differ. Then A and B cooperate.

Proof. Let S be "A(B) = C ∧ B(A) = C". A's construction gives
PA ⊢ □(B(A) = C) → A(B) = C, B's the mirror image; since □S implies both
antecedents, PA ⊢ □S → S, and Löb gives PA ⊢ S. So a proof of B(A) = C
exists, A finds it and cooperates; likewise B. ∎

Against DefectBot the search fails, as PA ⊢ DefectBot(A) = D and PA is
consistent; against CooperateBot it succeeds and A is exploited, pitch
problem 2 on `open-source-game-theory`. In GL, p ↔ □q and q ↔ □p give
p ↔ □□p; from □p → □□p → p Löb's rule gives p = ⊤.

## Where to see it

Smith's *Gödel Without (Too Many) Tears*, on `advanced-logic`, proves Löb's
theorem; the Stanford Encyclopedia entry on provability logic covers fixed
points and Solovay. LaVictoire et al., on `open-source-game-theory`, needs
nothing beyond Löb; Barasz et al. has the modal agents, Critch the bounded
theorem.

| Advanced logic | Open-source game theory |
|---|---|
| theory T, usually PA | the proof system an agent searches |
| □A, "T proves A" | the agent's search for a proof of A halts |
| diagonal lemma: a sentence quoting its own code | an agent whose definition reads its own source |
| ⊤ · ⊥ | CooperateBot · DefectBot |
| □p | FairBot: cooperate iff the opponent provably cooperates with me |
| Löb: T ⊢ □S → S gives T ⊢ S | "if provably cooperated with, cooperate" becomes cooperation |
| fixed point of p ↔ □p is ⊤ | two FairBots cooperate, whatever their source |
| de Jongh–Sambin fixed-point theorem | every pair of modal agents has one determined outcome |
| Kripke semantics for GL; decidability | the Barasz et al. evaluation algorithm; modal combat |
| Solovay: GL is what PA proves about □ | what the modal calculus predicts is what the programs do |
| second incompleteness, PA ⊬ Con(PA) | the Löbian obstacle: PA cannot prove FairBot defects against DefectBot |
| PA ⊂ PA + Con(PA) ⊂ … | PrudentBot's two proof searches; agents of higher proof strength |
| bounded provability □ₙ, proofs of length ≤ n | agents with finite proof search |
| parametric bounded Löb (Critch) | robust cooperation of bounded agents |
