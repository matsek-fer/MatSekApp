---
id: category-theory-intro
title: Category theory
category: language
tagline: The language in which the fields you just learned turn out to be saying the same things.
prerequisites: [algebra-intro, logic-sets]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Having learned several fields of mathematics, you will have noticed
repetition. The product of two sets, two groups, two spaces: same
construction, same uniqueness proof. "Forget the structure" and "freely add
structure" appear everywhere as a matched pair. Theorems in topology look
like theorems in algebra with the nouns changed. Category theory is the
subject that takes this repetition seriously and asks: what is actually being
said, if not about sets or groups or spaces, then about *what*?

The answer is: about objects and the arrows between them, and about how arrows
compose. That is all a category is. The surprise is how much follows. Products,
quotients, free objects, limits — every construction you have met can be
defined by how it relates to everything else (a *universal property*), once
and for all categories at the same time. Functors carry structure between
categories; natural transformations compare functors; adjunctions make
"forget" and "free" into two halves of one concept — and that one concept
turns out to cover logic (quantifiers are adjoints), topology (Stone–Čech),
algebra (tensor–hom), and the `map` function in your programming language.

This is why the category is called "motivation for better language". The
fields in part 01 are the content; category theory is the grammar that
makes the content shorter, clearer and portable. Everything in parts 02 and
03 builds on it.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **Basis-free rules.** To every finite-dimensional real vector space V you
   assign a linear map t_V : V → V, and the assignment is compatible with
   every linear map f : V → W, meaning f ∘ t_V = t_W ∘ f. Describe all such
   assignments. Then do the same for assignments V ⊗ V → V ⊗ V.

   <details><summary>Hint 1</summary>
   First let f range only over maps V → V. What does commuting with every
   linear map on V force t_V to be?
   </details>
   <details><summary>Hint 2</summary>
   Two assignments V ⊗ V → V ⊗ V are obvious: the identity and swapping the
   factors. To rule out anything else, test compatibility against f = c·id
   and against projections onto a one-dimensional subspace.
   </details>

2. **The disk has a fixed point.** Prove that every continuous map from a
   closed disk to itself fixes some point. In one dimension this is the
   intermediate value theorem; in two, something new is needed.

   <details><summary>Hint 1</summary>
   Suppose f has no fixed point. For each p, follow the ray from f(p)
   through p until it hits the boundary circle. What kind of map from the
   disk to the circle does this give, and why should it be impossible?
   </details>
   <details><summary>Hint 2</summary>
   Attach to every closed loop in the plane that avoids the origin an
   integer: how many times it winds around. How does this integer behave
   when the loop is deformed continuously, and when a continuous map is
   applied to it?
   </details>

3. **Cancellation.** Let A, B, C be finite groups with A × C ≅ B × C. Prove
   that A ≅ B. Then show the statement fails for infinite groups.

   <details><summary>Hint 1</summary>
   For a group X, how many homomorphisms X → A × C are there, in terms of
   A and C separately?
   </details>
   <details><summary>Hint 2</summary>
   Every homomorphism X → A factors through its kernel. Use this to count
   the <em>injective</em> homomorphisms X → A by subtraction, inducting on
   |X|; then take X = A and X = B.
   </details>
   <details><summary>Hint 3</summary>
   For the infinite case, try C an infinite direct sum of copies of ℤ/2.
   </details>

## Prerequisites

- **Introduction to algebra** (`algebra-intro`): groups, homomorphisms,
  quotients, free groups — the first and best source of examples.
- **Sets and logic** (`logic-sets`): functions, composition, injective and
  surjective, equivalence relations.
- At least one of `topology`, `linear-algebra`, `real-analysis` for a
  second source of examples. Category theory without examples is empty;
  with two different fields in hand it is illuminating.
- Programmers can enter through Milewski with less mathematics, but should
  pick up `algebra-intro` alongside.

## From the general materials

- **The Joy of Abstraction** (Cheng) — the recommended first book for this
  topic: category theory from zero, for a reader who has never written a
  proof; slow, careful, and honest about *why* the abstraction pays.
- **Napkin** — Part on category theory: categories, functors, natural
  transformations, limits, adjoints, with examples drawn from every other
  part of the Napkin.
- **Sheafification of G** — rigorous video treatments of categories,
  functors, Yoneda and adjunctions, plus sheaves for later.
- **Mathematics: Form and Function** (Mac Lane) — the founder's view of why
  categories organise mathematics, written for mathematicians.
- **Princeton Companion** — essays "Categories", "The Yoneda lemma" (in
  "Some fundamental mathematical definitions").
- **Real Not Complex** — Category Theory page.

## Materials

### Tom Leinster — Basic Category Theory
- **Link:** https://arxiv.org/abs/1612.09375
- **Type:** book
- **Difficulty:** 3
- **Free:** yes (author's arXiv version of the Cambridge book)
- **Strengths:** The cleanest short introduction: categories, functors and
  natural transformations, adjoints, representables and the Yoneda lemma,
  limits, and the chapter that ties adjoints, representables and limits
  together. 180 pages, every definition motivated, exercises throughout.
  The book to read first if you already know some algebra.
- **Weaknesses:** Stops before monads, monoidal categories and anything
  applied; exercises without solutions.

### Emily Riehl — Category Theory in Context
- **Link:** https://emilyriehl.github.io/books/
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes (author's PDF of the Dover book)
- **Strengths:** "In context" means every concept is illustrated from the
  fields in part 01 — topology, algebra, analysis, logic — so the reader
  sees what the abstraction *does*. Covers Leinster's material plus monads,
  Kan extensions and more; Yoneda is treated in depth. Exercises are
  excellent.
- **Weaknesses:** Assumes you know the examples (that is the point); dense
  for a first contact.

### Fong & Spivak — Seven Sketches in Compositionality
- **Link:** https://arxiv.org/abs/1803.05316
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (arXiv; MIT course videos also free)
- **Strengths:** Category theory motivated by *applications*: posets and
  Galois connections, resource theories, databases as functors,
  co-design, signal flow graphs, electrical circuits, logic in a topos.
  Starts from nothing, every exercise solved in the back. The best answer
  to "why would anyone outside pure mathematics care". Bridge to
  `applied-category-theory` and `compositionality`.
- **Weaknesses:** Breadth over depth; the sketches are sketches, and the
  pure theory (Yoneda, limits) is thinner than in Leinster.

### Lawvere & Schanuel — Conceptual Mathematics
- **Link:** https://www.cambridge.org/core/books/conceptual-mathematics/00772F4CC3D4268200C5EC86B39D415A
- **Type:** book
- **Difficulty:** 1-2
- **Free:** no
- **Strengths:** Category theory from literally nothing — finite sets and
  maps — by one of the founders, in the form of lectures and dialogues with
  students. Composition, isomorphism, sections and retractions, products,
  the category of graphs, exponentials, all discovered slowly through
  examples. Changes how you think about what a *function* is.
- **Weaknesses:** Very slow; eccentric; a reader with algebra background
  will want Leinster instead and come back to this for the viewpoint.

### Bartosz Milewski — Category Theory for Programmers
- **Link:** https://github.com/hmemcpy/milewski-ctfp-pdf
- **Type:** book + video
- **Difficulty:** 2-3
- **Free:** yes (community-typeset PDF of the blog series; lecture videos on
  YouTube)
- **Strengths:** Categories, functors, natural transformations, adjunctions,
  monads, F-algebras, Kan extensions — every concept paired with Haskell
  (and C++) code. The place to start if you come from programming; the
  lecture series is friendly and thorough.
- **Weaknesses:** Mathematical rigour is secondary; some analogies strain;
  the Haskell may be a barrier for non-programmers.

### The Catsters (Cheng & Willerton) — YouTube lectures
- **Link:** https://www.youtube.com/user/TheCatsters
- **Type:** video
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** Seventy-odd ten-minute blackboard videos on one concept
  each — monads, adjunctions, Yoneda, string diagrams, 2-categories —
  by two excellent explainers. Ideal for a second look at a concept that
  did not click in a book.
- **Weaknesses:** 2007-era video quality; no exercises; not a course.

### Saunders Mac Lane — Categories for the Working Mathematician
- **Link:** https://link.springer.com/book/10.1007/978-1-4757-4721-8
- **Type:** book
- **Difficulty:** 4
- **Free:** no (Springer GTM 5)
- **Strengths:** The founding text and still the reference: adjoints
  ("adjoint functors arise everywhere"), limits, monads, monoidal
  categories, abelian categories, Kan extensions ("all concepts are Kan
  extensions"). Terse, authoritative, and the source of the subject's
  standard terminology.
- **Weaknesses:** Written for working mathematicians in 1971; motivation
  assumed, examples compressed. A second or third book.

### Bruno Gavranović — Category Theory Resources
- **Link:** https://github.com/bgavran/Category_Theory_Resources
- **Type:** repo
- **Difficulty:** 1-5
- **Free:** yes
- **Strengths:** A curated, maintained list of category theory books,
  lecture series, papers, blogs and software, grouped by level and by
  application area (machine learning, physics, programming, databases).
  Where to look for the next thing after the materials above.
- **Weaknesses:** A list, not a path; the applied sections assume you know
  what you are looking for.

## Problems

- **Fong & Spivak** — every exercise is solved in the book; work through
  all of chapters 1–3 before anything else.
- **Leinster** — exercises per section; a community solutions document
  circulates online.
- **Riehl** — exercises per section, many of them small theorems used later
  in the text.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Naturality as a constraint** — solving pitch problem 1 in full: the
  scalar case, the V ⊗ V case, and what "natural transformation" adds to
  "basis-independent". Joint with `linear-algebra`.
- **Functors prove impossibilities** — Brouwer's fixed point theorem via a
  functor from spaces to groups; the general pattern "transport the
  problem to where it is arithmetic". Resolves pitch problem 2; joint with
  `topology`.
- **Counting maps in** — homomorphism counting, products, Lovász's
  cancellation theorem, and the Yoneda lemma as what the proof was really
  using. Resolves pitch problem 3; joint with `algebra-intro`.
- **Adjunctions from floor and ceiling** — Galois connections on posets,
  then free ⊣ forgetful for groups and vector spaces, then
  ∃ ⊣ pullback ⊣ ∀. Bridge to `type-theory`.
- **Reading path** — Cheng → Fong–Spivak or Lawvere–Schanuel → Leinster →
  Riehl, with Milewski as the parallel track for programmers.
