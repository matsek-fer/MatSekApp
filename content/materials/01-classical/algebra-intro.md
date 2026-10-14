---
id: algebra-intro
title: Introduction to algebra (groups, rings, fields)
category: classical
tagline: Symmetry, arithmetic and equations, abstracted until the same theorem explains all three.
prerequisites: [logic-sets]
status: draft
---

## Pitch

You have done algebra since school: solving equations, manipulating symbols
that obey rules. Abstract algebra asks what happens if you take the *rules*
seriously and forget what the symbols are. Anything you can compose and undo
is a group — the symmetries of a cube, the shuffles of a deck, the moves of a
puzzle, the rotations of space. Anything you can add and multiply is a ring —
the integers, polynomials, matrices, clock arithmetic. Anything where you can
also divide is a field — the rationals, the reals, and the strange finite
fields that run every error-correcting code and most of cryptography.

The payoff is leverage. One theorem about groups (Lagrange's) tells you the
possible orders of a shuffle, the structure of the clock, and Fermat's little
theorem at once. One idea about fields (adjoining a root) explains why you can
double a cube in theory but not with ruler and compass. And the habit of mind
— find the structure, find the maps that preserve it, classify — is the one
every later field of mathematics runs on. It is also the direct road into
category theory (`category-theory-intro`), which is what you get when you
apply the habit to algebra itself.

## Pitch problems

1. **The shuffle that undoes itself.** Take 8 cards, split them into two
   halves and interleave them perfectly, one card from each half in turn. Do
   it again. After three shuffles the deck is back in its original order.
   With 52 cards it takes eight. You can verify this with a real deck — then
   ask: why does it *always* come back, what decides the number of shuffles,
   and why does the answer involve powers of 2 on a clock?
2. **Necklaces.** How many different necklaces can be made from 6 beads, each
   black or white? There are 2⁶ = 64 colourings, but rotating a necklace does
   not change it, and neither does flipping it over. Listing carefully by
   hand you find 13. For 20 beads and 3 colours listing is hopeless — yet a
   single formula about the symmetries (Burnside's lemma) gives the answer
   in one line, and the same formula counts molecules, graphs and Rubik's
   cube positions.
3. **Clock arithmetic and the internet.** On a 7-hour clock every non-zero
   number has a multiplicative "reciprocal": 3 · 5 = 15 = 1. On a 6-hour
   clock, 2 and 3 have none. That one difference — prime clocks are fields,
   composite clocks are not — is the whole reason RSA encryption works and
   your connection to the bank cannot be read in transit.

## Prerequisites

- **Proofs, sets, logic** (`logic-sets`): functions, injectivity and
  surjectivity, equivalence relations and partitions, induction. Equivalence
  relations in particular: quotient groups are nothing else.
- `linear-algebra` is not required for Judson or Pinter, but Artin and
  Aluffi lean on it and it is where many of the best examples come from.
- `combinatorics` helps with counting arguments (orbits, cosets, Burnside).

## From the general materials

- **Napkin** — Parts on groups (group actions, Sylow theorems), rings and
  ideals, and fields and Galois theory, each in the "what is this really"
  style with the categorical viewpoint already present.

## Materials

### Thomas Judson — Abstract Algebra: Theory and Applications
- **Link:** http://abstract.ups.edu/
- **Type:** book
- **Difficulty:** 2
- **Free:** yes (GFDL; HTML with embedded Sage cells, PDF, cheap print)
- **Strengths:** The free standard first course: groups, rings, fields, with
  applications chapters (cryptography, coding theory, Galois theory at the
  end). Every chapter has exercises, many with hints, plus Sage computations
  you can run in the browser. Actively maintained since 1994.
- **Weaknesses:** Plain; little motivation beyond the applications chapters;
  the Galois theory is brief.

### Charles Pinter — A Book of Abstract Algebra
- **Link:** https://store.doverpublications.com/products/9780486474175
- **Type:** book
- **Difficulty:** 1-2
- **Free:** no (cheap Dover)
- **Strengths:** The gentlest route into the subject. Short chapters of
  theory followed by long exercise sets in which the reader proves most of
  the theorems in small steps; this is the book that makes self-study
  actually work. Covers groups, rings, fields and a readable Galois theory.
- **Weaknesses:** Slow for anyone with proof experience; no answers in the
  book; stops short of modules and anything categorical.

### Michael Artin — Algebra
- **Link:** https://www.pearson.com/en-us/subject-catalog/p/algebra/P200000006203
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** Algebra with geometry in front: matrix groups, symmetry
  groups of the plane, group actions and orbits early, linear algebra used
  throughout, then rings, modules, fields and Galois theory, with a chapter
  on representations. The examples are concrete and the problems excellent.
- **Weaknesses:** Idiosyncratic order; some find the linear-algebra chapters
  a detour. Harder than Judson/Pinter as a first book.

### Dummit & Foote — Abstract Algebra
- **Link:** https://www.wiley.com/en-us/Abstract+Algebra%2C+3rd+Edition-p-9780471433347
- **Type:** book
- **Difficulty:** 3
- **Free:** no
- **Strengths:** The reference. Groups (through Sylow, free groups, solvable
  groups), rings, modules, fields and Galois theory, with introductions to
  commutative algebra, homological algebra and representation theory.
  Enormous exercise sets; everything is in here somewhere.
- **Weaknesses:** 900 pages with no narrative drive; not a book to read
  linearly. Buy it when you already know which chapter you need.

### Paolo Aluffi — Algebra: Chapter 0
- **Link:** https://bookstore.ams.org/gsm-104
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no (AMS GSM 104)
- **Strengths:** A full graduate algebra course written with categories from
  page one: universal properties define products, quotients and free
  objects; groups, rings and modules are developed as examples of the same
  patterns; homological algebra at the end. The best preparation for
  `category-theory-intro` that is still about algebra.
- **Weaknesses:** Demanding for a first exposure; the categorical framing can
  feel like overhead until it pays off (around chapter 3).

### J. S. Milne — Group Theory · Fields and Galois Theory
- **Link:** https://www.jmilne.org/math/CourseNotes/
- **Type:** notes
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** Polished, free lecture notes at honours level: *Group
  Theory* (through Sylow, solvable and nilpotent groups, free groups) and
  *Fields and Galois Theory* (complete, with infinite Galois theory and
  transcendental extensions). Dense but very clear, with exercises and
  answers.
- **Weaknesses:** Few examples relative to theorems; assume a first course
  has been done.

## Problems

### Judson & Pinter exercises
The exercise sets in both books are designed as the main vehicle for
learning; do them rather than reading past them.

### John Dixon — Problems in Group Theory
- **Link:** https://store.doverpublications.com/products/9780486459165
- **Type:** problems
- **Difficulty:** 3-4
- **Free:** no (cheap Dover)
- **Strengths:** 430 problems *with full solutions* on finite groups,
  permutation groups, Sylow theory, nilpotent and solvable groups,
  representations. Many problems are theorems from the literature.
- **Weaknesses:** Groups only; dated notation; hard.

### Codeforces problemset — `number theory` tag (modular arithmetic)
- **Link:** https://codeforces.com/problemset?tags=number%20theory
- **Type:** problems
- **Difficulty:** 1-3
- **Free:** yes
- **Strengths:** Hundreds of problems on modular inverses, orders, primitive
  roots, CRT and discrete logarithm — ring and field theory of ℤ/nℤ in
  disguise, with a judge. Good for making pitch problems 1 and 3 concrete.
- **Weaknesses:** Computation, not proof; nothing on abstract groups beyond
  cyclic ones.

## Matsek originals (to design)

- **Rubik's cube as a group** — commutators, why a single corner cannot be
  twisted, the order of the cube group, a solving method derived from the
  theory.
- **Burnside's lemma from necklaces** — orbits, stabilisers, the lemma, then
  colourings of a cube and of a bracelet. Resolves pitch problem 2; joint
  with `combinatorics`.
- **Shuffles and the clock** — perfect shuffles as permutations, their
  order, the connection to 2 mod (n−1), and Fermat's little theorem.
  Resolves pitch problem 1.
- **From clocks to RSA** — ℤ/nℤ as a ring, when it is a field, Euler's
  theorem, and a working RSA in twenty lines. Resolves pitch problem 3.
- **Universal properties in algebra** — products, quotients, free groups
  seen the Aluffi way; a bridge session to `category-theory-intro`.
