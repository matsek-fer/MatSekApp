---
between: [dynamical-systems, real-analysis]
tagline: Analysis decides whether an iteration converges and how fast; dynamics supplies the iterations and the examples that test every hypothesis.
strength: 2
status: draft
ai_generated: true
---

A dynamical system is a limit process left to run: a map applied again and
again, or a vector field followed for all time. Real analysis is the theory
of limit processes, so whether an orbit settles, where, how fast, and whether
a nudge at the start changes the answer are questions about convergence.

## What each side lends

Analysis gives dynamics its existence theorems. C[a, b] with the sup norm is
complete, so Banach's fixed point theorem applies and Picard–Lindelöf
(below) follows. Grönwall's inequality turns a Lipschitz bound on f into
continuous dependence on initial data, |x(t) − y(t)| ≤ |x(0) − y(0)|·exp(Lt):
ε–δ continuity with δ = ε·exp(−Lt), and the double pendulum of pitch problem
1 on `dynamical-systems` lives in that exponent. For xₙ₊₁ = f(xₙ), the
simplest dynamics, the mean value theorem decides stability: if f(x*) = x* and
|f′| ≤ k < 1 near x*, then |f(x) − x*| = |f′(ξ)|·|x − x*| ≤ k·|x − x*|, so
nearby orbits converge like kⁿ. For f(x) = r·x(1 − x) the fixed point 1 − 1/r
has slope 2 − r, stable exactly for 1 < r < 3: pitch problem 2's first
doubling is the slope reaching −1.

Dynamics repays with iterations and counterexamples. The contraction
principle is itself a dynamical statement, and analysis spends it on the
inverse and implicit function theorems; Newton's method and the recursive
sequences in the problem books are one-dimensional maps. Dynamics also shows
where the hypotheses are sharp: x′ = 2√|x|, x(0) = 0 is solved by both x ≡ 0
and x = t², since √ is not Lipschitz at 0, and x′ = x², x(0) = 1 reaches
infinity at t = 1, so solutions are only promised locally.

<svg viewBox="0 0 560 360" width="100%" style="max-width:560px" role="img" aria-label="Cobweb diagram of the logistic map at r = 2.9: the staircase drawn between the parabola y = f(x) and the diagonal y = x spirals into the fixed point x*, because the slope of f there has modulus 0.9, less than 1">
<path d="M 60,30 V 330 H 360 M 90,326 V 334 M 256.6,326 V 334" fill="none" stroke="currentColor" stroke-width="1"/>
<path d="M 60,330 L 360,30" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3"/>
<path d="M 60,330 Q 210,-105 360,330" fill="none" stroke="currentColor" stroke-width="1.5"/>
<polyline points="90,330 90,251.7 138.3,251.7 138.3,162.2 227.8,162.2 227.8,115.6 274.4,115.6 274.4,152.6 237.4,152.6 237.4,119.7 270.3,119.7 270.3,147.6 242.4,147.6 242.4,122.6 267.4,122.6" fill="none" stroke="currentColor" stroke-width="1"/>
<circle cx="256.6" cy="133.4" r="3" fill="none" stroke="currentColor"/>
<text x="84" y="348" font-size="13" fill="currentColor">x₀</text>
<text x="251" y="348" font-size="13" fill="currentColor">x*</text>
<text x="336" y="82" font-size="13" fill="currentColor">y = x</text>
<text x="188" y="100" font-size="13" fill="currentColor">y = f(x)</text>
<text x="384" y="150" font-size="13" fill="currentColor">f(x) = 2.9·x(1 − x)</text>
<text x="384" y="172" font-size="13" fill="currentColor">f′(x*) = 2 − r = −0.9</text>
<text x="384" y="194" font-size="13" fill="currentColor">|f′(x*)| &lt; 1, so the cobweb</text>
<text x="384" y="216" font-size="13" fill="currentColor">spirals into x* like 0.9ⁿ</text>
</svg>

## Picard–Lindelöf

Let f be continuous on |t| ≤ a, |x − x₀| ≤ b, bounded by M, with
|f(t, x) − f(t, y)| ≤ L·|x − y|. Then for h < min(a, b/M, 1/L) the problem
x′ = f(t, x), x(0) = x₀ has exactly one solution on [−h, h]. Proof: on the
closed ball of radius b about the constant x₀ in C[−h, h],
(Tx)(t) = x₀ + ∫₀ᵗ f(s, x(s)) ds satisfies ‖Tx − Ty‖ ≤ Lh·‖x − y‖, a
contraction on a complete space; its fixed point is the solution and Tⁿx₀
converges to it uniformly. For x′ = x, x(0) = 1 the iterates are 1, 1 + t,
1 + t + t²/2, 1 + t + t²/2 + t³/6: the partial sums of eᵗ.

## Where to see it

Lebl's Basic Analysis I (on `real-analysis`) proves Picard's theorem twice,
by uniform convergence and again by the fixed point theorem for metric
spaces; Tao's Analysis II spends the contraction mapping theorem on the
inverse function theorem. On `dynamical-systems`, Teschl proves
Picard–Lindelöf, Grönwall and dependence on initial conditions in full, and
Strogatz's chapter on one-dimensional maps draws the cobwebs.
