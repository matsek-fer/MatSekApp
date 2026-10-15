---
id: compositionality
title: Compositionality — what makes the language powerful
category: language
tagline: Understand the parts and how they are wired, and you understand the whole — the principle, when it holds, and the algebra of wiring.
prerequisites: [category-theory-intro, linear-algebra]
status: draft
---

## Pitch

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

1. **Border crossings.** A country is a chain of provinces, and each pair of
   neighbouring provinces is joined by k border crossings. Inside each
   province the roads are a tangle you would rather not look at. A traveller
   enters at some crossing on the far-west border and wants to know which
   crossings on the far-east border they can reach. Show that for each
   province you only need to record *which pairs of its border crossings are
   connected to each other by roads inside that province* — nothing about
   the cities, nothing about distances — and that two such records combine
   into a single record for the two provinces together. Prove that no
   smaller record works. Then count: how many different records can a
   province with k crossings on each side have?
2. **Counting paths across a cut.** In a grid city, count the routes from
   the south-west corner to the north-east corner that only go north or
   east. Now cut the city along a vertical street that crosses k horizontal
   streets. Show that the total count is a sum of k products of "left-half
   counts" and "right-half counts" — so each half is summarised by a table,
   and the halves are combined by multiplying tables. How big must the
   tables be if you cut twice, or if the cut is not straight? What is the
   smallest summary of a half that still lets you recover every count?
3. **Sorting networks.** A gadget takes two numbers and outputs the smaller
   on top and the larger below. Wire many gadgets into a fixed network with
   n inputs and n outputs. Prove: if the network correctly sorts every input
   consisting only of 0s and 1s, then it sorts *every* input of numbers. So
   2ⁿ checks replace infinitely many. The proof is a statement about how
   "replace every value by whether it exceeds t" passes through each gadget
   unchanged — the whole inherits a property because each part has it.

## Prerequisites

- **Category theory** (`category-theory-intro`): categories, functors,
  natural transformations; monoidal categories are introduced within the
  materials below.
- **Linear algebra** (`linear-algebra`): matrices as the first example of
  composable summaries (pitch problem 2), and for the Rosetta Stone's
  Hilbert-space column.
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
- **The three pitch problems** generalise: border records to corelations
  and to resistor networks (where the record becomes a matrix), path tables
  to transfer matrices, the 0–1 principle to other "monotone" properties.

## Matsek originals (to design)

- **Provinces as arrows** — connectivity records, how they compose, Bell
  numbers, then the same picture for resistor networks where the record
  becomes a matrix. Resolves pitch problem 1; joint with `combinatorics`.
- **Transfer matrices** — counting paths and tilings by cutting and
  multiplying tables; the same trick in statistical mechanics. Resolves
  pitch problem 2; joint with `combinatorics`.
- **The 0–1 principle and friends** — properties that pass through gadgets;
  why "the whole inherits from the parts" is a statement about functors.
  Resolves pitch problem 3; joint with `cs-foundations`.
- **String diagrams workshop** — the sliding rules, the yanking rule,
  teleportation as a deformation, with paper and pencil.
- **When composition fails** — generative effects from Fong–Spivak ch. 1,
  context in language, entanglement; what structure restores
  compositionality in each case. Bridge to `language-and-complexity`.
