---
between: [compositionality, probability]
tagline: Compositionality gives probability a category whose arrows are Markov kernels; probability gives back the first process theory where copying a wire is not free.
strength: 2
status: draft
ai_generated: true
---

Probability almost composes. An experiment whose outcome feeds the next is a
Markov kernel, and kernels compose like functions: run the first, then the
second. What refuses to compose — correlation, conditioning, the Bell
inequalities — fails at one diagram law, and the two fields trade across that
law.

## What each side lends

`compositionality` supplies the category. The Giry monad G on measurable
spaces has unit x ↦ δₓ and multiplication Π ↦ ∫ p dΠ(p). Its Kleisli arrows
X → G(Y) are the Markov kernels, and Kleisli composition is
Chapman–Kolmogorov, (l∘k)(A | x) = ∫ l(A | y) k(dy | x). Product measure is a
monoidal product and marginalisation discards a wire, so Fritz's Markov
categories make conditional independence and d-separation diagram rules. The
same monad is the semantics of probabilistic programming, bind being kernel
composition.

`probability` returns the counterexamples. Kl(G) has copy and discard yet is
not cartesian: a joint distribution is not a pair of marginals, which is
correlation. Conditioning is not an operation on kernels: the Bayesian inverse
of f depends on the prior, is unique only almost surely and on general
measurable spaces need not exist; Cho and Jacobs restore functoriality by
carrying the prior along. Meas has no measurable evaluation map, so
higher-order probabilistic programs needed quasi-Borel spaces. Bell's theorem
is the outer edge: one source λ copied into two boxes yields the behaviours
Σ_λ p(λ) f(a | x, λ) g(b | y, λ), so the ¾ bound in the Bell game on
`compositionality` is a theorem about that diagram shape; the quantum 85 % and
the PR box lie outside it.

## The law that fails

In Kl(D), D(X) the finitely supported distributions on a set X, let Δ send x
to the point mass at (x, x) and (f ⊗ g)(y, w | x, z) = f(y | x) g(w | z).
Theorem: a kernel f: X → Y satisfies Δ∘f = (f ⊗ f)∘Δ iff every f(· | x) is a
point mass. Proof: the left side puts mass f(y | x) on (y, y) and nothing off
the diagonal; the right puts f(y | x) f(y′ | x) on (y, y′); equality forces
f(y | x)² = f(y | x), so f(y | x) ∈ {0, 1}.

Take a fair coin c from a point. Δ∘c is ½ on (H, H) and ½ on (T, T): one
coin, read twice. (c ⊗ c)∘Δ is ¼ on each pair: two coins. The gap between
them is the whole content of the word random, and the one law separating
Markov categories from cartesian ones.

## Where to see it

On `probability`, Grimmett & Stirzaker's Markov-chains chapter proves
Chapman–Kolmogorov and Williams builds conditional expectation as an L²
projection. On `compositionality`, Coecke & Kissinger treat classical data as
the copyable wires and prove nonlocality in pictures, and Baez's
network-theory posts on the n-Category Café run Markov processes beside
quantum ones.

| Compositionality | Probability |
|---|---|
| object X | measurable space, or a finite set of outcomes |
| arrow X → Y in Kl(G) | Markov kernel k(· \| x); stochastic matrix when finite |
| sequential composition ∘ | Chapman–Kolmogorov, product of stochastic matrices |
| identity arrow | x ↦ δₓ, the unit of the Giry monad |
| state I → X | probability measure on X |
| parallel composition ⊗ | product measure, independence |
| discard X → I, natural | marginalisation; every kernel preserves total mass 1 |
| copy Δ: X → X ⊗ X, not natural | reading one random variable twice |
| arrow with Δ∘f = (f ⊗ f)∘Δ | deterministic kernel, an ordinary function |
| state on X ⊗ Y not of the form p ⊗ q | correlation |
| conditional ψ\|ₓ, Bayesian inverse f†ₚ | conditional distribution, Bayes' rule; needs a prior, unique a.s. |
| one source copied into two boxes | local hidden-variable model; CHSH ≤ 2, winning ≤ ¾ |
| non-signalling joint outside that shape | quantum strategy at cos²(π/8), PR box |
| bind in a probabilistic program | sample, then continue with the sample |
| cartesian closure, which Meas lacks | higher-order probabilistic programs need quasi-Borel spaces |
