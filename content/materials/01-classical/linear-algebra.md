---
id: linear-algebra
title: Linear algebra
category: classical
tagline: Vector spaces and the maps between them — the one piece of mathematics everything else is built on top of.
prerequisites: [logic-sets]
status: draft
---

## Pitch

Linear algebra is the study of the simplest possible kind of function — one
that respects addition and scaling — and it turns out that almost everything
we can actually compute is either linear or approximated by something linear.
Derivatives are linear maps. Quantum mechanics is linear algebra on infinite-
dimensional spaces. Every neural network is a stack of linear maps with
non-linearities in between. Google was an eigenvector.

Taught badly, it is a pile of matrix recipes. Taught well, it is the first
place you meet the modern mathematical style: define a structure (vector
space), define the maps that respect it (linear maps), and discover that the
structure is so rigid that you can classify *everything* — every finite-
dimensional space is ℝⁿ, every linear map is a matrix, every matrix has a
canonical form. That classification is what makes the subject computable, and
the attitude behind it is what you'll reuse in every abstract field after.

## Pitch problems

1. **Why was Google an eigenvector?** Model the web as "a page is important
   if important pages link to it." That sentence is circular — and the
   circularity is exactly an eigenvector equation. Why does a solution exist,
   why is it unique, and why does repeatedly clicking random links find it?
2. **Fibonacci in logarithmic time.** F(n) = F(n−1) + F(n−2). Computing
   F(10⁹) by the recurrence takes a billion steps. Write the step as a 2×2
   matrix, diagonalise it, and you get both an O(log n) algorithm and the
   closed formula with the golden ratio — for free.
3. **Rotation or reflection?** Someone hands you a 3×3 matrix and says it's a
   rigid motion of space. Without drawing anything, can you tell whether it's
   a rotation or involves a mirror flip? One number answers it — and figuring
   out what that number *means* is the whole theory of determinants.

## Prerequisites

- **Proofs, sets, logic** (`logic-sets`), lightly: functions, injective /
  surjective, basic induction. Linear algebra is a good *second* place to
  practise proofs.
- High-school vectors and matrix multiplication help but are not required;
  the recommended books introduce them.

## From the general materials

- **Napkin** — Part on linear algebra (vector spaces, eigenvalues, dual
  space, trace and determinant via tensors): the "what is this really"
  version, best read alongside a textbook.

## Materials

### Sheldon Axler — Linear Algebra Done Right (4th ed.)
- **Link:** https://linear.axler.net/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (4th edition is Springer Open Access)
- **Strengths:** The standard abstract treatment: vector spaces and linear
  maps first, determinants last and almost as an afterthought. The proof of
  the existence of eigenvalues without determinants is the book's thesis.
  Clean, short, well-chosen exercises; 4th edition adds multilinear algebra.
- **Weaknesses:** Deliberately avoids computation — no Gaussian elimination
  worth the name, no applications. Readers who have never seen matrices
  should start with Hefferon or Strang.

### Sergei Treil — Linear Algebra Done Wrong
- **Link:** https://www.math.brown.edu/streil/papers/LADW/LADW.html
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes
- **Strengths:** The counterpart to Axler (the title is a joke): same level of
  rigour but matrices and determinants are embraced from the start, with a
  proper treatment of determinants as multilinear alternating forms, then
  spectral theory, Jordan form, and dual spaces. Good for people who like to
  compute while they prove.
- **Weaknesses:** Fewer exercises than Axler; occasional typos; dry.

### Jim Hefferon — Linear Algebra
- **Link:** https://hefferon.net/linearalgebra/
- **Type:** book
- **Difficulty:** 1-2
- **Free:** yes (CC licence; full solutions manual and lecture slides also free)
- **Strengths:** A complete first course that starts from solving systems and
  works up to vector spaces, maps, determinants and eigenvalues, with every
  exercise solved. The friendliest entry for someone with no prior exposure.
- **Weaknesses:** Slow and computational; does not reach the abstract view of
  Axler/Treil. Finish it and then read one of those.

### Gilbert Strang — MIT 18.06 Linear Algebra
- **Link:** https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/
- **Type:** course
- **Difficulty:** 1-2
- **Free:** yes
- **Strengths:** The most-watched linear algebra lectures in existence.
  Strang's "four fundamental subspaces" picture and his intuition for
  elimination, projections, least squares and the SVD are unmatched; the
  applied slant (data, networks, differential equations) shows why anyone
  cares.
- **Weaknesses:** Proofs are hand-wavy or absent; the view is ℝⁿ-only. Pairs
  well with Axler, which has the opposite strengths.

## Problem books

### Paul Halmos — Linear Algebra Problem Book
- **Link:** https://bookstore.ams.org/dol-16
- **Type:** problems
- **Difficulty:** 2-3
- **Free:** no (MAA Dolciani Mathematical Expositions 16)
- **Strengths:** 164 problems with hints and full solutions, arranged so that
  working through them *is* a course in abstract linear algebra. Halmos's
  prose is a model of how to think about the subject.
- **Weaknesses:** No computation at all; some problems are really small
  theorems and need the hint. Pairs with Axler.

### Victor Prasolov — Problems and Theorems in Linear Algebra
- **Link:** https://bookstore.ams.org/mmono-134
- **Type:** problems
- **Difficulty:** 3-4
- **Free:** yes (an updated translation by the author circulates freely
  online; AMS edition in print)
- **Strengths:** Hundreds of problems *with solutions* on determinants,
  canonical forms, bilinear forms, multilinear algebra and matrix
  inequalities, many of them named theorems. The place to go when a standard
  course feels too easy.
- **Weaknesses:** Hard; terse solutions; assumes a full first course.

## Matsek originals (to design)

- **"What is a determinant?"** — four answers (volume scaling, alternating
  multilinear form, product of eigenvalues, Leibniz formula) and why they
  agree. Resolves pitch problem 3.
- **PageRank from scratch** — Perron–Frobenius in one session, ending with a
  20-line implementation. Resolves pitch problem 1.
- **Change of basis without tears** — the one diagram that fixes the
  "which way do the matrices go" confusion for good.
- **Linear algebra reading path** — Hefferon/Strang → Axler or Treil →
  Halmos/Prasolov, with "you are ready for the next one when…" checks.
