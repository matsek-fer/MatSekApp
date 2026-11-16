---
between: [cs-foundations, logic-sets]
tagline: Logic gives computer science its circuits, its query language and the definition of a machine; computer science returns NP-completeness and halting as incompleteness.
strength: 3
status: draft
ai_generated: true
---

A proof and a computation are the same kind of object: a finite string of
symbols rewritten by rules so explicit that a machine can check every step.
Logic made proof that precise and invented the machine to do it — Turing's
1936 paper answers Hilbert's Entscheidungsproblem. Both fields study the same
formal systems, asking what they prove and what they compute.

## What each side lends

`logic-sets` supplies the languages. Propositional logic is the theory of
circuits (Shannon, 1938): every Boolean function f: {0,1}ⁿ → {0,1} is a
formula in ∧, ∨, ¬, read off its truth table as a disjunction of
conjunctions. First-order logic is SQL: Codd's theorem (1972) says relational
algebra — selection, projection, join, union, difference, the operations
behind SQL — expresses exactly the domain-independent first-order queries.
SQL has no ∀, so "students who take every course" is written
¬∃c ¬∃t (t.student = s ∧ t.course = c). Computability is definability:
computably enumerable means Σ₁, {n : ∃y φ(n, y)} with only bounded
quantifiers in φ (Kleene).

`cs-foundations` repays with a measure of difficulty and a second proof of
incompleteness. Cook (1971) and Levin (1973): satisfiability of a
propositional formula is NP-complete, because the accepting runs of a polynomial-time
nondeterministic machine are the satisfying assignments of a polynomial-size
formula. Fagin (1974) goes further: NP is exactly the properties of finite
structures of the form ∃R₁ … ∃Rₖ φ with φ first-order.

## Halting is incompleteness

Theorem. Let T be a consistent theory whose axioms a program can list and
which proves every true sentence "machine M halts on input x" (Peano
arithmetic does). Then some true sentence "M does not halt on x" is
unprovable in T.

Proof. Suppose T proves every true "M does not halt on x". Given (M, x),
simulate M on x while listing T's theorems, watching for "M does not halt
on x". If M halts, the simulation ends; if not, by assumption a proof
appears. A found proof is correct: if M halted, T would prove that too,
against consistency. So halting is decidable, which Turing (1936) refuted. ∎

Gödel's sentence says "I am not provable"; Turing's machine does the opposite
of what is predicted of it. Both are Cantor's diagonal from pitch problem 3
on `logic-sets`, and Gödel's diagonal lemma is Kleene's recursion theorem, a
program reading its own code.

## Where to see it

Sipser, on `cs-foundations`, has both halves: Cook–Levin in the chapter on
time complexity, and an incompleteness proof of the same shape under
decidability of logical theories. On `logic-sets`, the Open Logic
Project's *Incompleteness and Computability* volume takes the same road from
Turing machines to Gödel more slowly; `computability` and `advanced-logic`
continue it.

| Logic and set theory | Computer science |
|---|---|
| propositional formula in ∧, ∨, ¬ | Boolean circuit; AND, OR, NOT gates |
| truth assignment | input bits |
| satisfiable formula | SAT instance with a solution; the NP-complete problem |
| tautology | circuit outputting 1 on every input; co-NP |
| structure, model | database instance, the tables themselves |
| first-order formula over relations | relational-algebra expression; SQL query |
| ∃x, ∧, ¬ | projection, join, difference (SELECT columns, JOIN, EXCEPT) |
| ∀x | NOT EXISTS … NOT EXISTS |
| ∃R₁ … ∃Rₖ φ, φ first-order | NP (Fagin) |
| Σ₁-definable set, ∃y φ(n, y) with φ bounded | computably enumerable set |
| Δ₁ set: A and ℕ ∖ A both Σ₁ | decidable set |
| formal proof | certificate; trace of a computation; a Lean term |
| theory with listable axioms | enumerable set of theorems |
| diagonal lemma | Kleene's recursion theorem: a program reads its own code |
| Gödel sentence "I am unprovable" | machine that halts iff predicted not to |
| first incompleteness theorem | undecidability of the halting problem |
