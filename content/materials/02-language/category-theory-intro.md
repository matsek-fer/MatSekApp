---
id: category-theory-intro
title: Category theory — motivation and first concepts
category: language
tagline: The language in which the fields you just learned turn out to be saying the same things.
prerequisites: [algebra-intro, logic-sets]
status: draft
---

## Pitch

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

1. **Floors of floors.** For a real number x and a positive integer n,
   prove that ⌊⌊x⌋/n⌋ = ⌊x/n⌋. A standard olympiad lemma; the usual proof
   juggles inequalities for half a page. There is a one-line proof: "take the
   floor" is the right adjoint of "regard an integer as a real", and a
   composite of adjoints is an adjoint. Understanding why that sentence is a
   proof is a first encounter with the subject's most useful idea.
2. **Counting functions two ways.** How many functions are there from A × B
   to C? Directly, cᵃᵇ. Alternatively: a function of two arguments is a
   function of the first argument that returns a function of the second, so
   the count is (cᵇ)ᵃ. The exponent law is not just a numerical coincidence
   but a *bijection* between two sets of functions. In which other worlds —
   spaces, groups, logical propositions — does this law hold, and what does
   having it buy you? (Everything from currying in programming to the
   λ-calculus.)
3. **Chinese remainders.** Find every integer x with x ≡ 2 (mod 3),
   x ≡ 3 (mod 5) and x ≡ 2 (mod 7). You will find exactly one answer modulo
   105, and the construction ℤ/105 ≅ ℤ/3 × ℤ/5 × ℤ/7 will feel forced — as
   if there were no other way it could go. There is not: a product is
   pinned down by how everything else maps into it, so once the maps to the
   three factors are known the solution has no freedom left. The same
   "forcedness" explains why the product of sets, groups and spaces are all
   unique up to a unique isomorphism, by one proof.

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
  (and C++) code. The place to start if pitch problem 2 is the one that
  hooked you; the lecture series is friendly and thorough.
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

## Matsek originals (to design)

- **Adjunctions from floor and ceiling** — Galois connections on posets,
  the floor lemma in one line, then free ⊣ forgetful for groups and vector
  spaces, then ∃ ⊣ pullback ⊣ ∀. Resolves pitch problem 1; bridge to
  `type-theory`.
- **Exponentials everywhere** — the currying bijection in Set, in
  propositions (A ∧ B → C iff A → (B → C)), in spaces; cartesian closed
  categories and why `map` obeys its laws. Resolves pitch problem 2; joint
  with `cs-foundations`.
- **One proof, every category** — CRT as a product, the uniqueness of
  products proved once, then products in Set, Grp, Top, posets, and a
  category where they do not exist. Resolves pitch problem 3.
- **Yoneda in an afternoon** — the lemma, the embedding, "an object is
  determined by its relationships", and why it is the first real theorem of
  the subject.
- **Reading path** — Cheng → Fong–Spivak or Lawvere–Schanuel → Leinster →
  Riehl, with Milewski as the parallel track for programmers.
