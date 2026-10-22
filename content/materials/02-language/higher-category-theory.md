---
id: higher-category-theory
title: Higher category theory
category: language
tagline: Arrows between arrows — 2-categories, categorification, the periodic table, and the ∞-categories that modern topology and geometry are written in.
prerequisites: [category-theory-intro, compositionality, topology]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

A category has objects and arrows. But the category of categories has more:
between two functors there are natural transformations — arrows between
arrows. Between natural transformations there is nothing, which is already a
fact worth explaining: why does the tower stop at level two for categories,
and when does it not?

Topology forces the tower open. Paths in a space are arrows; homotopies
between paths are arrows between arrows; homotopies between homotopies go on
forever. Taking this seriously gives ∞-groupoids, and Grothendieck's
hypothesis that ∞-groupoids simply *are* spaces. Algebra forces it too:
replacing a set by a category — numbers by finite sets, equations by
isomorphisms — is *categorification*, and it explains why so many identities
have bijective proofs and why certain structures (braidings, Frobenius
algebras, the Jones polynomial) exist at all. The periodic table of n-fold
monoidal n-categories predicts that a monoid-in-monoids is commutative, that
braids live two levels up, and that every column stabilises.

Higher category theory is where the language of part 02 reaches its current
frontier. It is also the working language of modern algebraic topology,
algebraic geometry, and the mathematical side of quantum field theory
(part 03), so it is the one piece of part 02 that is a prerequisite rather
than a perspective.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Two products that must agree.** A set carries two binary operations ∘
   and ∗, each with a two-sided unit, satisfying
   (a ∗ b) ∘ (c ∗ d) = (a ∘ c) ∗ (b ∘ d) for all a, b, c, d. Prove that the
   two units coincide, that ∘ = ∗, and that this one operation is
   commutative and associative. Then explain why this shows that the second
   homotopy group of any space is abelian.

   <details><summary>Hint 1</summary>
   Compute a ∗ b after writing a = a ∘ 1 and b = 1 ∘ b.
   </details>
   <details><summary>Hint 2</summary>
   Then compute a ∘ b with the units placed on the other diagonal.
   </details>
   <details><summary>Hint 3</summary>
   This is the Eckmann–Hilton argument. In a 2-category with one object and
   one 1-cell, the two compositions of 2-cells satisfy the interchange law,
   which is why the periodic table's first column is "commutative monoid"
   and why π₂ is abelian.
   </details>

2. **Equal in number, different in kind.** For a finite set X, let L(X) be
   the set of linear orderings of X and S(X) the set of permutations of X.
   Both have |X|! elements. Prove that for |X| ≥ 2 there is no bijection
   f : L(X) → S(X) compatible with every relabelling of X — that is, with
   f(σ·ℓ) = σ·f(ℓ) for every permutation σ, where σ acts on orderings by
   relabelling and on permutations by conjugation.

   <details><summary>Hint 1</summary>
   Relabelling acts freely on orderings: no ordering is fixed by a
   non-identity σ.
   </details>
   <details><summary>Hint 2</summary>
   Find a permutation that is fixed by conjugation with some σ ≠ id.
   </details>
   <details><summary>Hint 3</summary>
   L and S are different <em>species</em> though equinumerous:
   categorification distinguishes what counting identifies (Joyal; see
   adamant's post in <code>combinatorics</code>).
   </details>

3. **The pentagon is enough.** Let Bₙ be the graph whose vertices are the
   ways to bracket a product x₁x₂⋯xₙ and whose edges are single applications
   of (ab)c ↔ a(bc). (a) Show that Bₙ is connected. (b) B₄ is a pentagon;
   show that B₅ has 14 vertices and 21 edges, and that every cycle in B₅ is
   a combination of pentagons and squares. (c) Explain why (b) is the
   precise reason you may drop brackets in a monoidal category, and what
   goes wrong for ⊗ in a structure where (b) fails.

   <details><summary>Hint 1</summary>
   (b) The vertices are counted by the Catalan number C₄; count edges by
   where the moved bracket sits.
   </details>
   <details><summary>Hint 2</summary>
   Squares come from two independent moves that commute; pentagons from
   three adjacent factors interacting.
   </details>
   <details><summary>Hint 3</summary>
   Mac Lane's coherence theorem: the pentagon and triangle axioms imply
   that every diagram built from associators and unitors commutes. The
   graphs Bₙ are the 1-skeleta of Stasheff's associahedra.
   </details>

## Prerequisites

- **Category theory** (`category-theory-intro`): functors, natural
  transformations, adjunctions, Yoneda; comfort with the category of
  categories.
- **Compositionality** (`compositionality`): monoidal categories and string
  diagrams — a monoidal category is a 2-category with one object, and the
  diagrams become surfaces one level up.
- **Topology** (`topology`): paths, homotopies and the fundamental group,
  for the groupoid side; `algebra-intro` for the categorification examples.

## From the general materials

- **Sheafification of G** — videos on ∞-categories, homotopy type theory
  and univalence; the most accessible video treatment of the top end of
  this topic.
- **Napkin** — the categorical parts stop at ordinary categories but set up
  the examples (fundamental groupoid, species) used here.
- **Real Not Complex** — Category Theory page.
- **nLab** — the reference wiki for everything in this topic; see
  `general.md`.
- The Princeton Companion has nothing beyond its "Categories" essay.

## Materials

### Baez & Dolan — Categorification
- **Link:** https://arxiv.org/abs/math/9802029
- **Type:** paper
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** The manifesto: replace equations by isomorphisms, sets by
  categories, numbers by finite sets; the periodic table of n-categories;
  why braided monoidal categories appear two levels up; the stabilisation
  hypothesis. Twenty pages that set the agenda for the field.
- **Weaknesses:** A programme paper — claims and conjectures, few proofs;
  some of its conjectures have since been proved and the language has
  shifted.

### John Baez — An Introduction to n-Categories
- **Link:** https://arxiv.org/abs/q-alg/9705009
- **Type:** paper
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** The gentlest written introduction: globular n-categories,
  weak versus strict, the fundamental n-groupoid of a space, the periodic
  table with pictures, the Eckmann–Hilton argument (problem 1) drawn out in
  full. Readable with Leinster-level category theory.
- **Weaknesses:** 1997; the definitions it uses are not the ones in current
  research, and ∞-categories in the quasi-categorical sense are absent.

### Cheng & Lauda — Higher-Dimensional Categories: An Illustrated Guide Book
- **Link:** https://eugeniacheng.com/wp-content/uploads/2017/02/cheng-lauda-guidebook.pdf
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** A survey of the many definitions of weak n-category
  (Batanin, Leinster, Street, Tamsamani, Simpson, Trimble, …) with the
  shapes drawn: globes, simplices, opetopes. The best place to see what the
  definitional problem actually is and why there is more than one answer.
- **Weaknesses:** A guide, not a textbook — definitions and pictures, few
  theorems and no exercises; written in 2004 and not updated.

### Johnson & Yau — 2-Dimensional Categories
- **Link:** https://arxiv.org/abs/2002.06055
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (arXiv; OUP in print)
- **Strengths:** The complete, careful text on bicategories: 2-categories
  and bicategories, pasting diagrams and their coherence, the Yoneda lemma
  for bicategories, adjunctions and monads inside them, the Grothendieck
  construction, tricategories. Every proof is given in full. Problem 3's
  coherence is chapters 3–4.
- **Weaknesses:** 600 pages; exhaustive rather than motivating; ∞-categories
  are out of scope.

### Tom Leinster — Higher Operads, Higher Categories
- **Link:** https://arxiv.org/abs/math/0305049
- **Type:** book
- **Difficulty:** 4-5
- **Free:** yes (arXiv; Cambridge in print)
- **Strengths:** Operads and multicategories built up carefully, then used
  to give one rigorous definition of weak n-category and to compare it with
  others. The first half is also the best introduction to operads in
  existence; the appendix proves the coherence results the text relies on.
- **Weaknesses:** Long and demanding; the specific definition of
  n-category it develops is not the one that became standard.

### Riehl & Verity — Elements of ∞-Category Theory
- **Link:** https://emilyriehl.github.io/books/
- **Type:** book
- **Difficulty:** 5
- **Free:** yes (authors' PDF; Cambridge in print)
- **Strengths:** ∞-category theory developed model-independently: an
  ∞-cosmos is an axiomatisation of "a universe of ∞-categories", and the
  theory of adjunctions, limits, fibrations and Kan extensions is developed
  once for all models (quasi-categories, complete Segal spaces, …) using
  2-categorical arguments. The cleanest statement of what ∞-category theory
  is, as opposed to how a particular model works.
- **Weaknesses:** Research monograph; assumes homotopy theory and model
  categories; not a first ∞-categories book.

### Jacob Lurie — Kerodon · Higher Topos Theory
- **Link:** https://kerodon.net/ · https://www.math.ias.edu/~lurie/papers/HTT.pdf
- **Type:** site + book
- **Difficulty:** 5
- **Free:** yes
- **Strengths:** *Higher Topos Theory* is the book that made quasi-categories
  the working definition of ∞-category and rebuilt category theory on top
  of them; Kerodon is Lurie's online, cross-referenced rewrite, growing,
  with every lemma linked. The reference for the field as it is practised.
- **Weaknesses:** HTT is 900 pages and assumes simplicial homotopy theory;
  Kerodon is a reference work, not a course.

## Problems

- **Johnson & Yau** — exercises at the end of each chapter; the pasting
  diagram exercises of chapter 3 are the drill for 2-categorical reasoning.
- **Leinster** — exercises throughout the operads half.
- **The pitch problems** continue: Eckmann–Hilton → the full periodic table
  and why braided monoidal categories appear at (n = 2, k = 2); species →
  Joyal's theory and the exponential formula categorified; associahedra →
  Mac Lane's coherence theorem in full and the Stasheff polytopes K₆, K₇.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Eckmann–Hilton and the periodic table** — the argument on the board,
  then the table, then why π₂ is abelian and π₁ need not be. Resolves pitch
  problem 1; joint with `topology`.
- **Counting versus categorifying** — orders vs permutations, species,
  and which combinatorial identities have natural bijective proofs.
  Resolves pitch problem 2; joint with `combinatorics`.
- **Coherence by hand** — bracketings, the associahedra K₄ and K₅,
  Mac Lane's theorem stated and the strategy of proof. Resolves pitch
  problem 3; joint with `compositionality`.
- **What is an ∞-category?** — a reading of Baez's introduction followed
  by one definition (quasi-categories) in enough detail to state the
  homotopy hypothesis.
- **A Kerodon reading group** — one chapter, one semester.
