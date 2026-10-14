---
id: dynamical-systems
title: Dynamical systems & differential equations
category: classical
tagline: Rules that say how things change, and the surprising question of what they do in the long run.
prerequisites: [real-analysis, linear-algebra]
status: draft
---

## Pitch

Almost every law in science is a differential equation: it tells you the rate
of change now, and asks you to work out the whole future. For two centuries
the subject meant *solving* these equations with formulas. Then Poincaré
noticed that most equations have no formula solution, and asked a better
question — not "what is x(t)?" but "what does the system *do*?" Does it
settle down, cycle, or wander forever? Which behaviours are stable under
small changes? That shift created dynamical systems, and in the 1960s–70s it
produced one of the great scientific surprises: deterministic chaos. Simple,
fully known rules can generate behaviour that is unpredictable in practice
and yet highly structured — strange attractors, period doubling, universal
constants.

The subject is where analysis, linear algebra, topology and geometry are
put to work together, and where you first see mathematics explain *qualitative*
phenomena: why hearts beat, why populations cycle, why weather forecasts have a
horizon.

## Pitch problems

1. **The double pendulum.** Two rigid rods, a hinge, gravity: Newton's laws
   give you the exact equations of motion. Start two copies with initial
   angles differing in the tenth decimal place; within seconds they are doing
   completely different things. The laws are fully known and deterministic.
   So in what sense can we not predict it — and can we quantify how fast
   prediction fails?
2. **One knob, infinite complexity.** Let xₙ₊₁ = r·xₙ(1 − xₙ), a toy model of
   a population with limited food. For r = 2.5 it settles to a fixed value.
   At r ≈ 3 it starts oscillating between two values, then four, then eight …
   and past r ≈ 3.57 it becomes chaotic. The ratios of the gaps between these
   doublings converge to 4.6692… — the same number that appears in dripping
   taps, electronic circuits and fluid convection. Why would a number from
   this formula show up in a tap?
3. **Foxes and rabbits.** Rabbits breed; foxes eat rabbits; foxes starve
   without them. Write this down as two equations and the populations
   oscillate forever without settling. Now cull some foxes: at the next peak
   there are *more* foxes than before. The model is 100 years old, two lines
   long, and still explains real fishery and pest-control failures.

## Prerequisites

- **Real analysis** (`real-analysis`): limits, continuity, the contraction
  mapping principle (for existence and uniqueness of solutions), uniform
  convergence.
- **Linear algebra** (`linear-algebra`): eigenvalues and eigenvectors, matrix
  exponentials, Jordan form — linearisation near equilibria is the first and
  most-used tool.
- Computational calculus and a nodding acquaintance with Newtonian mechanics
  for motivation.

## From the general materials

- **3Blue1Brown** — *Differential equations* series: the pendulum, phase
  space, the heat equation (listed again below as the recommended first
  watch).
- **Michael Penn** — Differential Equations playlist: a computational first
  course on video.
- **Princeton Companion** — essays "Dynamics", "Chaos", "The Lorenz
  equations".
- **Real Not Complex** — Differential Equations page.
- The Napkin has no dynamics part.

## Materials

### Steven Strogatz — Nonlinear Dynamics and Chaos (+ Cornell lectures)
- **Link:** https://www.stevenstrogatz.com/books/nonlinear-dynamics-and-chaos-with-applications-to-physics-biology-chemistry-and-engineering ·
  lectures: https://www.youtube.com/playlist?list=PLbN57C5Zdl6j_qJA-pARJnKsmROzPnO9V
- **Type:** book + course
- **Difficulty:** 2
- **Free:** book no, lectures yes (full Cornell MAE 5790 course on YouTube)
- **Strengths:** The best-loved introduction in applied mathematics: flows on
  the line, bifurcations, phase plane, limit cycles, Lorenz equations,
  one-dimensional maps, fractals, strange attractors — every idea introduced
  through a physical or biological example and a picture. Exercises are
  plentiful and genuinely fun. Resolves all three pitch problems.
- **Weaknesses:** Almost no proofs; existence/uniqueness, stable manifold
  theorem etc. are stated and used. You will need Hirsch–Smale–Devaney or
  Teschl for rigour.

### Jiří Lebl — Notes on Diffy Qs
- **Link:** https://www.jirka.org/diffyqs/
- **Type:** book
- **Difficulty:** 1-2
- **Free:** yes (CC licence; PDF and web)
- **Strengths:** The free, standard first ODE/PDE course: first-order and
  linear equations, systems, Laplace transforms, power series, Fourier
  series and the heat/wave equations, a chapter on nonlinear systems. Good
  exercises with answers to odd-numbered ones. Read it if you have never
  solved a differential equation.
- **Weaknesses:** Computational and recipe-oriented; little qualitative
  theory and no chaos.

### Hirsch, Smale & Devaney — Differential Equations, Dynamical Systems, and an Introduction to Chaos
- **Link:** https://www.sciencedirect.com/book/9780123820105/differential-equations-dynamical-systems-and-an-introduction-to-chaos
- **Type:** book
- **Difficulty:** 2-3
- **Free:** no
- **Strengths:** The rigorous counterpart to Strogatz at the same level:
  linear systems via linear algebra done properly, existence and uniqueness
  proved, stability, Poincaré–Bendixson, then the Lorenz system and discrete
  dynamics with actual theorems. Readable; many examples from biology and
  mechanics.
- **Weaknesses:** Fewer exercises than Strogatz; the chaos chapters are more
  an introduction than a treatment.

### Vladimir Arnold — Ordinary Differential Equations
- **Link:** https://link.springer.com/book/9783540345633
- **Type:** book
- **Difficulty:** 3
- **Free:** no (Springer Universitext; MIT Press edition also exists)
- **Strengths:** ODEs as geometry: phase flows, vector fields, one-parameter
  groups of diffeomorphisms, with the theorems that make the subject
  coordinate-free. Short, dense, full of pictures and of Arnold's opinions.
  Changes how you see the subject.
- **Weaknesses:** Demanding; few routine exercises; assumes multivariable
  analysis and some comfort with manifolds-lite.

### Gerald Teschl — Ordinary Differential Equations and Dynamical Systems
- **Link:** https://www.mat.univie.ac.at/~gerald/ftp/book-ode/
- **Type:** book
- **Difficulty:** 3-4
- **Free:** yes (author's PDF; AMS GSM 140 in print)
- **Strengths:** The free rigorous text: Picard–Lindelöf, dependence on
  initial conditions, linear systems and Floquet theory, Sturm–Liouville,
  stable/unstable manifolds, Poincaré–Bendixson, then discrete dynamics,
  chaos in one dimension, Smale horseshoe, Melnikov. Complete proofs.
- **Weaknesses:** Dry; exercises without solutions; motivation is assumed
  to come from elsewhere (read Strogatz first).

### Brin & Stuck — Introduction to Dynamical Systems
- **Link:** https://doi.org/10.1017/CBO9780511755316
- **Type:** book
- **Difficulty:** 3-4
- **Free:** no
- **Strengths:** The abstract side — topological dynamics, symbolic dynamics,
  ergodic theory, hyperbolic dynamics, low-dimensional dynamics — in a
  concise graduate introduction. Where to go when "dynamical systems" stops
  meaning ODEs and starts meaning iterating a map on a space.
- **Weaknesses:** Terse; assumes measure theory (`probability`) and topology
  (`topology`) for the later chapters.

## Lectures & interactive

### 3Blue1Brown — Differential equations series
- **Link:** https://www.youtube.com/playlist?list=PLZHQObOWTQDNPOjrT6KVlfJuKtYTftqH6
- **Type:** video
- **Difficulty:** 1
- **Free:** yes
- **Strengths:** The pendulum, phase space, the heat equation and Fourier
  series, with the usual visual clarity. Watch before Strogatz.
- **Weaknesses:** Four videos; motivation only.

### Complexity Explorables
- **Link:** https://www.complexity-explorables.org/
- **Type:** site
- **Difficulty:** 1
- **Free:** yes
- **Strengths:** Dozens of interactive browser models — logistic map,
  Lorenz attractor, predator–prey, synchronising fireflies, epidemics — each
  with sliders and a short explanation. The fastest way to *see* a
  bifurcation.
- **Weaknesses:** No mathematics beyond the explanation paragraph.

## Matsek originals (to design)

- **Chaos in one afternoon** — the logistic map by hand and by code:
  cobweb plots, bifurcation diagram, Feigenbaum's constant measured live.
  Resolves pitch problem 2.
- **Phase-plane bootcamp** — classify every 2×2 linear system, then
  linearise six nonlinear ones (including Lotka–Volterra). Resolves pitch
  problem 3.
- **Lyapunov exponents from the double pendulum** — simulate, perturb,
  measure the divergence rate; what "unpredictable" means quantitatively.
  Resolves pitch problem 1.
- **Why solutions exist** — the contraction mapping proof of
  Picard–Lindelöf and the one example where uniqueness fails; joint with
  `real-analysis`.
