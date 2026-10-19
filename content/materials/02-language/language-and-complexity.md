---
id: language-and-complexity
title: Natural vs formal language, complexity of language
category: language
tagline: What grammars can and cannot express, how meaning composes, and how much information a sentence carries — natural language measured against formal ones.
prerequisites: [logic-sets, cs-foundations, probability, compositionality]
status: draft
ai_generated: [pitch, pitch_problems, matsek_materials]
---

## Pitch

> _AI-generated draft — not yet reviewed by a MatSek member._

Part 02 has argued that mathematics benefits from a better language. Natural
language is the language we already have, and it is a remarkable object: a
child learns it from a few million words of noisy input; it expresses
anything expressible; it is compositional enough that you understand
sentences you have never heard, yet riddled with context and ambiguity. How
does it compare with the formal languages of logic, programming and category
theory — and what can the mathematics of language say about either?

Three kinds of answer exist. *Grammar*: Chomsky's hierarchy ranks languages
by the machines needed to recognise them, and the pumping lemmas prove that
some patterns are beyond a given grammar; natural languages turn out to sit
just above context-free, and Lambek's pregroup grammars make parsing into
cancellation. *Meaning*: compositional semantics asks how word meanings
combine, from Montague's typed logic to the categorical DisCoCat models in
which grammar is a wiring diagram and meanings are tensors. *Information*:
Shannon measured the entropy of English at about one bit per letter;
Kolmogorov complexity defines the information in a single string, and makes
"random" precise as "incompressible" — with an incompleteness theorem as a
corollary.

The topic sits between logic, computer science, linguistics and category
theory, and it is where the claims of part 02 — that compositionality is
what makes a language powerful — can be tested against the one language
everybody speaks.

## Pitch problems

> _AI-generated draft — not yet reviewed by a MatSek member._

1. **The typing monkey.** A monkey hits one of 26 letter keys or the space
   bar, each with probability 1/27, independently and forever. A *word* is a
   maximal run of letters. (a) Find the probability that a given word of
   length k appears at a given word position. (b) Rank all possible words by
   probability. Show that the probability of the word of rank r is
   approximately C·r^(−α), and find α. (c) Word frequencies in English
   follow the same law with α ≈ 1 (Zipf's law). What does that tell you
   about English?

   <details><summary>Hint 1</summary>
   (b) A word of length k has rank about 26ᵏ and probability about
   27^(−k−1).
   </details>
   <details><summary>Hint 2</summary>
   α = log 27 / log 26 ≈ 1.01.
   </details>
   <details><summary>Hint 3</summary>
   Miller (1957): Zipf's law follows from having a space bar. It carries no
   information about meaning or grammar — a warning about reading structure
   into statistics.
   </details>

2. **Grammar by cancellation.** Types are strings built from the basic
   symbols n (noun phrase) and s (sentence) and their adjoints xˡ and xʳ;
   the only rules are xˡ x → 1 and x xʳ → 1. Each word is assigned a type; a
   sequence of words is grammatical if the concatenation of their types
   reduces to s. (a) With Alice, Bob : n and likes : nʳ s nˡ, check that
   "Alice likes Bob" is grammatical and "likes Alice Bob" is not. (b) Assign
   a type to "who" so that "Bob who likes Alice" reduces to n, and show that
   the type needed for "Bob who Alice likes" is different. (c) Prove that
   every reduction can be drawn with non-crossing links, and find a
   dependency pattern in some natural language that this forbids.

   <details><summary>Hint 1</summary>
   (b) who : nʳ n sˡ n for the subject relative; for the object relative the
   final n must sit on the other side of s.
   </details>
   <details><summary>Hint 2</summary>
   (c) Reductions nest like brackets.
   </details>
   <details><summary>Hint 3</summary>
   Cross-serial dependencies (Swiss German verb clusters; English
   "respectively") are not context-free (Shieber 1985), and pregroup
   grammars are weakly equivalent to context-free grammars.
   </details>

3. **Random means incompressible.** Fix a programming language. The
   *complexity* K(x) of a string x is the length of the shortest program
   that prints x. (a) Show that for every n some string of length n has
   K(x) ≥ n, and that at most a fraction 2^(−c) of the strings of length n
   have K(x) < n − c. (b) Show that there is a constant C, depending only on
   your proof system, such that no specific string x can be *proved* to
   satisfy K(x) > C. (c) Explain what (b) does to the sentence "the smallest
   number not definable in fewer than twenty words".

   <details><summary>Hint 1</summary>
   (a) Count programs shorter than n.
   </details>
   <details><summary>Hint 2</summary>
   (b) If proofs of statements "K(x) > C" exist, write a short program
   that searches through all proofs for the first one and prints its x.
   </details>
   <details><summary>Hint 3</summary>
   This is Chaitin's incompleteness theorem: the Berry paradox made
   rigorous. Compare Gödel in <code>logic-sets</code> and
   <code>advanced-logic</code>.
   </details>

## Prerequisites

- **Sets and logic** (`logic-sets`): formal proofs and what a proof system
  is, for problem 3.
- **Computer science** (`cs-foundations`): finite automata, context-free
  grammars, Turing machines — Sipser's first half.
- **Probability** (`probability`), discrete: for Zipf and Shannon.
- **Compositionality** (`compositionality`) and `linear-algebra` for the
  categorical and vector models of meaning.

## From the general materials

- **Gödel, Escher, Bach** (Hofstadter) — the long meditation on formal
  systems, self-reference and meaning that this topic makes precise.
- **3Blue1Brown** — the series on neural networks and transformers ("But
  what is a GPT?"): how current language models represent words and
  sentences.
- **Real Not Complex** — Logic and Computer Science pages.
- Neither the Napkin nor the Princeton Companion covers linguistics.

## Materials

### Jurafsky & Martin — Speech and Language Processing
- **Link:** https://web.stanford.edu/~jurafsky/slp3/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** yes (authors' draft of the 3rd edition)
- **Strengths:** The standard text on natural language processing: n-gram
  models and entropy, word vectors, parsing with context-free and
  dependency grammars, semantics, and the neural and transformer models
  that now dominate. Problems 1 and 2 have a chapter each behind them.
  Clear, current, and free.
- **Weaknesses:** Engineering-oriented; the mathematics is used rather than
  developed; 600 pages.

### Michael Sipser — Introduction to the Theory of Computation
- **Link:** https://www.cengage.com/c/introduction-to-the-theory-of-computation-3e-sipser/9781133187790/
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** See `cs-foundations`. Listed here for Part I: regular and
  context-free languages, the pumping lemmas, and the Chomsky hierarchy —
  the formal side of problem 2.
- **Weaknesses:** Nothing on natural language as such.

### Joachim Lambek — From Word to Sentence
- **Link:** https://www.math.mcgill.ca/barr/lambek/pdffiles/2008lambek.pdf
- **Type:** book
- **Difficulty:** 3
- **Free:** yes
- **Strengths:** Pregroup grammars by their inventor: the cancellation
  calculus of problem 2 applied to English, French, German, Arabic and
  more, with the type assignments worked out word class by word class.
  Short and concrete; also the algebraic root of the DisCoCat model.
- **Weaknesses:** Linguistic coverage over mathematical depth; the
  connection to category theory is left to the reader.

### Coecke, Sadrzadeh & Clark — Mathematical Foundations for a Compositional Distributional Model of Meaning
- **Link:** https://arxiv.org/abs/1003.4394
- **Type:** paper
- **Difficulty:** 3-4
- **Free:** yes
- **Strengths:** The DisCoCat model: word meanings are vectors (nouns) and
  tensors (verbs, adjectives), a pregroup parse is a string diagram, and
  the meaning of a sentence is computed by contracting the diagram — so
  "dogs chase cats" and "cats chase dogs" differ, and grammar literally is
  the wiring. The paper that joined `compositionality` to linguistics.
- **Weaknesses:** Assumes monoidal categories; the empirical side has moved
  on to neural models.

### Bradley, Terilla & Vlassopoulos — An Enriched Category Theory of Language
- **Link:** https://arxiv.org/abs/2106.07890
- **Type:** paper
- **Difficulty:** 4
- **Free:** yes
- **Strengths:** A language model's next-word probabilities turned into a
  category enriched over [0, 1], with meaning recovered as a Yoneda-style
  object; a bridge between the statistical and the categorical pictures of
  language, written clearly for a mixed audience.
- **Weaknesses:** Programmatic; requires enriched categories (Lawvere's
  paper in `categorical-classical`).

### Shen, Uspensky & Vereshchagin — Kolmogorov Complexity and Algorithmic Randomness
- **Link:** https://www.lirmm.fr/~ashen/kolmbook-eng-scan.pdf
- **Type:** book
- **Difficulty:** 4
- **Free:** yes (authors' draft; AMS in print)
- **Strengths:** The modern text on Kolmogorov complexity: plain, prefix and
  conditional complexity, incompressibility and randomness, Chaitin's
  theorem, the relation to Shannon entropy. Problem 3 is chapter 1. Many
  exercises.
- **Weaknesses:** Long; the second half (Martin-Löf randomness, effective
  Hausdorff dimension) is specialised.

### Claude Shannon — Prediction and Entropy of Printed English
- **Link:** https://www.princeton.edu/~wbialek/rome/refs/shannon_51.pdf
- **Type:** paper
- **Difficulty:** 2
- **Free:** yes
- **Strengths:** Shannon's 1951 estimate of about one bit per letter for
  English, via n-gram statistics and the guessing game in which a human
  predicts the next letter. Eleven pages, no prerequisites beyond the
  definition of entropy, and still the cleanest statement of "how much
  information is in a sentence".
- **Weaknesses:** Historical; the modern estimates come from language
  models.

## Problems

- **Jurafsky & Martin** — exercises per chapter; the n-gram and parsing
  chapters are the drill for problems 1 and 2.
- **Sipser** — pumping-lemma exercises for the formal side.
- **Shen–Uspensky–Vereshchagin** — chapter 1 exercises continue problem 3.
- **The pitch problems** continue: the monkey → Shannon's guessing game run
  on a real text; cancellation → the DisCoCat computation of "dogs chase
  cats" vs "cats chase dogs"; incompressibility → the relation between K
  and Shannon entropy for random sources.

## Matsek materials

> _AI-generated TODO recommendations — none of these exist yet. Replace with real MatSek materials as they are produced._

- **Zipf, Shannon and the monkey** — the typing monkey, Zipf's law from a
  corpus, the guessing game played live. Resolves pitch problem 1; joint
  with `probability`.
- **Parsing by cancellation** — pregroup types for a fragment of English
  (or Croatian), planarity, and what cross-serial dependencies break.
  Resolves pitch problem 2; joint with `cs-foundations`.
- **Random means incompressible** — Kolmogorov complexity from scratch,
  counting arguments, Chaitin's theorem. Resolves pitch problem 3; joint
  with `logic-sets`.
- **Grammar as wiring** — the DisCoCat computation by hand, then with a
  small corpus; joint with `compositionality`.
- **What does a language model know?** — a reading of
  Bradley–Terilla–Vlassopoulos with a toy model.
