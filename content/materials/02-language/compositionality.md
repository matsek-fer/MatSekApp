---
id: compositionality
title: Compositionality — what makes the language powerful
category: language
tagline: Understand the parts and how they are wired, and you understand the whole — the principle, when it holds, and the algebra of wiring.
prerequisites: [category-theory-intro, linear-algebra]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

The reason mathematics, engineering and language work at all is
*compositionality*: the meaning of a whole is determined by the meanings of
its parts and the way they are put together. You understand a sentence you
have never heard because you know the words and the grammar. An engineer
designs a circuit from sub-circuits without opening them. A programmer calls
a function without reading it. Whenever this principle holds, complexity
becomes manageable: analyse the pieces once, then combine the *summaries*.

Category theory is the mathematics of this principle. Composition of arrows
is its only operation, and the question "what can be glued, and what survives
gluing?" is its whole subject. Monoidal categories add side-by-side
composition to sequential composition, and with that two operations you can
draw any wiring diagram — of circuits, of quantum processes, of proofs, of
chemical reactions, of database queries — and *calculate* with the pictures.
String diagrams are rigorous: sliding boxes along wires is a theorem, and the
same diagrammatic laws hold in physics, logic, topology and computation (the
"Rosetta Stone").

The topic also asks when compositionality *fails* — when the whole has
behaviour the parts' summaries cannot predict (emergence, context-dependence
in language, entanglement) — and what extra structure fixes it. Knowing the
boundary is what makes the language powerful rather than merely tidy.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member. TODO: revisit; these are the best of several attempts and still not final._

1. **Braess's paradox.** 4000 drivers travel from S to E. Road S→A takes
   T/100 minutes when T drivers use it; A→E takes 45 minutes always; S→B
   takes 45 minutes; B→E takes T/100. (a) Find the split of drivers at which
   nobody gains by switching routes, and the travel time. (b) A new road
   A→B taking 0 minutes is opened. Find the new such split and show that
   every driver is now slower. (c) Would a central planner assigning routes
   have been hurt by the new road?

   <details><summary>Hint 1</summary>
   By symmetry, 2000 drivers each way and 65 minutes.
   </details>
   <details><summary>Hint 2</summary>
   Afterwards every driver takes S→A→B→E and needs 80 minutes; check that
   no single driver gains by deviating.
   </details>
   <details><summary>Hint 3</summary>
   The behaviour of a network of self-interested parts is not a monotone
   function of the parts' behaviours. Compositional game theory
   (`compositional-game-theory`) is the language built to repair this.
   </details>

2. **The Bell game.** Alice and Bob sit in separate rooms. The referee gives
   Alice a random bit x and Bob an independent random bit y. Alice answers
   with a bit a, Bob with a bit b. They win if a ⊕ b = x·y. (a) Prove that
   no pre-agreed strategy, even with shared random notes, wins more than ¾
   of the time. (b) Show that sharing the vector (e₀⊗e₀ + e₁⊗e₁)/√2 and
   measuring in suitably rotated bases wins ≈ 85 %. (c) Design a
   hypothetical pair of boxes that wins every time, yet lets neither player
   learn anything about the other's input from their own output.

   <details><summary>Hint 1</summary>
   With shared notes, a strategy is a mixture of deterministic ones, and a
   deterministic strategy is four bits. Check them.
   </details>
   <details><summary>Hint 2</summary>
   For that vector, if Alice measures in the basis rotated by θ and Bob by
   φ, then P(a = b) = cos²(θ − φ). Try θ ∈ {0, π/4} and φ ∈ {π/8, −π/8}.
   </details>
   <details><summary>Hint 3</summary>
   Make a uniformly random and b = a ⊕ x·y (the Popescu–Rohrlich box). The
   lesson: two boxes side by side can have a joint behaviour that no pair
   of individual behaviours produces, so "side by side" is not the
   cartesian product — the starting point of process theories
   (Coecke–Kissinger).
   </details>

3. **Teleportation.** Alice holds a unit vector v ∈ ℝ² that she does not
   know. She and Bob share ψ = (e₀⊗e₀ + e₁⊗e₁)/√2, Alice holding the first
   factor. Rule: if Alice measures her two factors in an orthonormal basis
   f₁, …, f₄ of ℝ²⊗ℝ², then writing v⊗ψ = Σₖ fₖ⊗wₖ, outcome k occurs with
   probability |wₖ|² and Bob is left holding wₖ/|wₖ|. Find a basis
   f₁, …, f₄ and four rotations or reflections U₁, …, U₄, none depending on
   v, such that Bob, told only k, can apply Uₖ and hold exactly v.

   <details><summary>Hint 1</summary>
   Try (e₀⊗e₀ ± e₁⊗e₁)/√2 and (e₀⊗e₁ ± e₁⊗e₀)/√2.
   </details>
   <details><summary>Hint 2</summary>
   Draw ψ as a bent wire joining Alice to Bob; the whole computation is the
   wire being pulled straight.
   </details>
   <details><summary>Hint 3</summary>
   Coecke & Kissinger do exactly this in pictures in chapter 4.
   </details>

## Prerequisites

- **Category theory** (`category-theory-intro`): categories, functors,
  natural transformations; monoidal categories are introduced within the
  materials below.
- **Linear algebra** (`linear-algebra`): tensor products and orthonormal
  bases for pitch problems 2 and 3, and the Rosetta Stone's Hilbert-space
  column.
- `cs-foundations` or any programming helps with the "systems" examples but
  is not required.

## From the general materials

- **The Joy of Abstraction** (Cheng) — the chapters on composition and
  on "sameness"; Cheng's running theme is that category theory is the
  study of how things compose.
- **Sheafification of G** — videos on monoidal categories and string
  diagrams.
- **Princeton Companion** — essay "Categories"; the "Mathematics and
  computer science" and "Mathematics and physics" sections for the
  Rosetta Stone's other columns.
- **Real Not Complex** — Category Theory page.
- The Napkin has no part on monoidal categories or string diagrams.

## Materials

### Fong & Spivak — Seven Sketches in Compositionality
- **Link:** https://arxiv.org/abs/1803.05316
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (arXiv; MIT 18.S097 lecture videos free)
- **Strengths:** This topic's home text (listed in `category-theory-intro`
  as an entry point). Seven applied sketches — Galois connections and
  generative effects (when compositionality fails), resource theories,
  databases, co-design, signal-flow graphs, electric circuits via decorated
  cospans, logic in a topos — each introducing the categorical structure it
  needs. Every exercise is solved.
- **Weaknesses:** Sketches, not developments; the string-diagram calculus
  is used more than it is justified.

### Tai-Danae Bradley — What is Applied Category Theory? · Math3ma
- **Link:** https://arxiv.org/abs/1809.05923 · https://www.math3ma.com/
- **Type:** notes + blog
- **Difficulty:** 1-2
- **Free:** yes
- **Strengths:** A 50-page illustrated introduction to the two ideas of the
  field — functorial semantics and compositionality — written for someone
  who has heard of category theory and wants to know why people apply it.
  The Math3ma blog continues in the same style: short, visual posts on
  limits, the Yoneda lemma, monoidal categories, language and probability.
- **Weaknesses:** Motivation and overview; no exercises; stops before any
  theorem is proved.

### Baez & Stay — Physics, Topology, Logic and Computation: A Rosetta Stone
- **Link:** https://arxiv.org/abs/0903.0340
- **Type:** paper
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** The paper that shows the same monoidal-category structure
  running through Hilbert spaces (physics), cobordisms and tangles
  (topology), proofs (logic) and programs (computation), with a four-column
  dictionary and string diagrams throughout. The clearest argument for
  "one language, many fields"; 70 pages and self-contained.
- **Weaknesses:** A survey; each column assumes some acquaintance with its
  field; no exercises.

### Coecke & Kissinger — Picturing Quantum Processes
- **Link:** https://doi.org/10.1017/9781316219317
- **Type:** book
- **Difficulty:** 2-4
- **Free:** no
- **Strengths:** String diagrams taught from scratch as a first-class
  mathematical language, then used to rebuild quantum theory without
  Hilbert-space calculations: processes, wires, cups and caps, the
  teleportation protocol as a diagram deformation, the ZX-calculus.
  Hundreds of exercises; readable by a strong undergraduate.
- **Weaknesses:** 800 pages; the quantum focus is total, so readers wanting
  other applications must translate; the underlying category theory is
  kept deliberately implicit.

### Hinze & Marsden — Introducing String Diagrams: The Art of Category Theory
- **Link:** https://doi.org/10.1017/9781009317825
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** Category theory itself — functors, natural
  transformations, adjunctions, monads, Kan extensions — redone entirely
  in string diagrams, so that proofs become deformations of pictures. The
  book to read when ordinary commutative diagrams start to feel like the
  wrong notation.
- **Weaknesses:** Assumes Leinster-level category theory; concerned with the
  pure theory rather than applications.

### Peter Selinger — A survey of graphical languages for monoidal categories
- **Link:** https://arxiv.org/abs/0908.3347
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** The reference for *why string diagrams are rigorous*: for
  each kind of monoidal category (braided, symmetric, traced, compact
  closed, dagger, …) it states the diagrammatic language and the coherence
  theorem that makes "equal as pictures" equal "equal as morphisms". Each
  section is a self-contained definition–theorem pair.
- **Weaknesses:** A catalogue, not a textbook; proofs are cited rather than
  given; dense.

### Compositionality (journal) · The n-Category Café
- **Link:** https://compositionality-journal.org/ ·
  https://golem.ph.utexas.edu/category/
- **Type:** journal + blog
- **Difficulty:** 3-5
- **Free:** yes
- **Strengths:** The field's open-access journal, publishing exactly this
  topic's research (open systems, categorical semantics, applied
  monoidal categories); and the group blog where much of applied category
  theory was first discussed, with expository series (Baez's network
  theory posts) still worth reading.
- **Weaknesses:** Research level; the blog's archive is large and unindexed.

## Problems

- **Fong & Spivak** — all exercises solved; chapters 1, 4 and 6 are this
  topic's core.
- **Coecke & Kissinger** — exercises per chapter; the diagrammatic proofs of
  chapter 4 are the drill for string-diagram reasoning.
- **The pitch problems** continue: Braess → the price of anarchy; Bell →
  Tsirelson's bound 2√2; teleportation → entanglement swapping and the
  ZX-calculus (Coecke–Kissinger ch. 9).

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Whole from parts, and when not** — Braess's paradox worked out, then
  generative effects from Fong–Spivak ch. 1: what "compositional" means
  and the two ways it fails. Resolves pitch problem 1.
- **Processes side by side** — the Bell game, the ¾ bound, the quantum
  strategy, the PR box; why ⊗ is not ×. Resolves pitch problem 2; joint
  with `linear-algebra` and `probability`.
- **String diagrams workshop** — wires, boxes, cups and caps, the yanking
  rule; teleportation as a deformation, with paper and pencil. Resolves
  pitch problem 3.
- **Graphical linear algebra** — copy, add, scale and their mirror images;
  feedback and linear relations; a tour of Sobociński's blog.
- **The Rosetta Stone in one session** — the same diagram read in Vect, in
  tangles, in proofs and in programs.
