---
between: [advanced-logic, computability]
tagline: Provable means a proof search halts, so logic lends computability its independence results and computability lends logic the recursion theorem and Turing degrees.
strength: 3
status: draft
ai_generated: true
---

A theory whose axioms a program can list is itself a program: list the
proofs, print their last lines. "T proves A" then says that a search halts,
a Σ₁ sentence; every true Σ₁ sentence is provable in any T ⊇ Q, so
unprovability begins with Π₁, "never halts". `advanced-logic` asks what that
search can establish about itself; `computability` asks which searches halt,
and with which oracle.

## What each side lends

`computability` supplies the engine and the yardstick. The engine is
Kleene's recursion theorem: for every total computable f there is a program
e with φ_e = φ_{f(e)}, so a program may use its own code. The diagonal lemma
of `advanced-logic` is the same construction with sentences for programs
and representable substitution for s-m-n. The yardstick is the Turing jump:
RCA₀ is the computable world and ACA₀ is closure under the jump, so a
theorem at the Bolzano–Weierstrass level is one that hands over the halting
set, and Specker's limit (pitch problem 3 on `advanced-logic`) is the
halting set in binary.

`advanced-logic` repays with the laws of provability, which are facts about
proof search. Necessitation is running the proof checker; □A → □□A is
formalised Σ₁-completeness, a search that halts is a proof that it halts;
Löb's theorem, as the axiom □(□A → A) → □A, completes GL, the decidable
modal logic that Solovay showed is exactly what arithmetic proves about its
own provability. The second incompleteness theorem is also what puts BB(748)
beyond ZFC (pitch problem 3 on `computability`).

## Löb's theorem by a program

Theorem (Löb). If T ⊢ □S → S then T ⊢ S.

Proof. By the recursion theorem build P: search T's proofs for one of "if P
halts then S"; halt on finding it. Inside T: if P halts, then □(P halts → S)
by construction and □(P halts) by Σ₁-completeness, so □S, so S by
hypothesis. Thus T ⊢ P halts → S; P finds that proof and halts; T proves it
halts, and concludes S. ∎

Example. For S = ⊥, P searches for a proof that P never halts. If T is
consistent, P never halts — a halting P would make T prove "P halts" too —
so "P never halts" is true and unprovable: the first incompleteness theorem,
with the recursion theorem doing the diagonal lemma's work. Had T proved its
own consistency, the proof above would give T ⊢ ⊥; that is the second.

## Where to see it

Smith's *Gödel Without (Too Many) Tears*, on `advanced-logic`, proves the
diagonal lemma and Löb's theorem; Cutland, on `computability`, proves s-m-n
and the recursion theorem and introduces degrees; Open Logic's
*Incompleteness and Computability*, on both pages, does the two together.

| Advanced logic | Computability |
|---|---|
| theory T with listable axioms | the program that enumerates T's theorems |
| □A, "A is provable in T" | the search for a proof of A halts; a Σ₁ sentence |
| necessitation: T ⊢ A gives T ⊢ □A | run the proof checker on the proof found |
| □A → □□A | formalised Σ₁-completeness: a halting run proves it halts |
| true Σ₁ sentence, provable in any T ⊇ Q | "M halts on x": enumerable, so provable by running M |
| true Π₁ sentence, where unprovability begins | "M never halts on x": the complement of the halting set, not enumerable |
| diagonal lemma, T ⊢ ψ ↔ φ(⌜ψ⌝) | Kleene's recursion theorem, φ_e = φ_{f(e)}; a quine |
| Gödel sentence "I am unprovable" | program that halts iff T proves it never halts |
| Löb: T ⊢ □S → S gives T ⊢ S | program that searches for a proof of "if I halt then S" |
| second incompleteness, T ⊬ Con(T) | ZFC cannot determine BB(748) |
| Σₙ sentence of arithmetic | set enumerable from the (n−1)th Turing jump (Post) |
| RCA₀ | computable sets, no oracle |
| ACA₀; Bolzano–Weierstrass; monotone convergence | the Turing jump; the halting set 0′; Specker's limit |
| WKL₀; Heine–Borel for [0, 1] | Π⁰₁ classes; the low basis theorem |
| Goodstein unprovable in PA (Kirby–Paris) | Goodstein's step count outgrows every PA-provably total function |
