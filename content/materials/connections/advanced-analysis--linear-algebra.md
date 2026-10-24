---
between: [advanced-analysis, linear-algebra]
tagline: Functional analysis is linear algebra on function spaces, trading lost compactness for completeness; linear algebra gets back the reasons its theorems hold.
strength: 3
status: draft
ai_generated: true
---

A Hilbert space is an inner-product space in which Cauchy sequences
converge, and functional analysis is `linear-algebra` carried out there:
vectors are functions, matrices are integral operators, and the question is
which finite-dimensional theorems survive. None does for free: whatever
silently used the compact unit ball must be bought back with completeness
of the space or compactness of the operator.

## What each side lends

Linear algebra supplies the vocabulary and the proofs. Gram–Schmidt,
orthogonal projection, adjoint and the spectral theorem for symmetric
matrices transfer, as does Axler's proof pattern: extract one eigenvector,
pass to its orthogonal complement. It also sets the targets: the Riesz
representation theorem is "every functional is a dot product", a Fourier
series is "coordinates in an orthonormal basis", Parseval is Pythagoras
with infinitely many legs.

Analysis repays with estimates, such as the operator norm and the Neumann
series (I − A)⁻¹ = Σ Aᵏ for ‖A‖ < 1, and with reasons. Bolzano–Weierstrass
is the hidden hypothesis behind "all norms on ℝⁿ are equivalent" and "every
linear map is continuous"; Riesz's lemma (pitch problem 1 on
`advanced-analysis`) removes it in infinite dimensions and both fail. The
right shift S(x₁, x₂, …) = (0, x₁, x₂, …) on ℓ² is injective, not
surjective, and has no eigenvalue: rank–nullity and the existence of
eigenvalues are facts about finite dimension. What remains is the Fredholm
alternative: for K compact, I − K is injective if and only if surjective.

## The spectral theorem, with ζ(2)

Let H be a Hilbert space and T: H → H compact and self-adjoint,
⟨Tx, y⟩ = ⟨x, Ty⟩. Then H has an orthonormal basis of eigenvectors of T;
each non-zero eigenvalue is real with finite-dimensional eigenspace, and
they accumulate only at 0. Compactness of T replaces the compact unit
sphere: the supremum of |⟨Tx, x⟩| over unit vectors is attained, giving the
first eigenvector; the rest is the matrix proof.

Take T on L²[0, 1] with kernel min(x, y) − xy, pitch problem 3 on
`advanced-analysis`. Since u = Tf solves −u″ = f with u(0) = u(1) = 0, the
eigenfunctions are exactly sin(nπx), eigenvalues 1/(n²π²), and T is
injective, so eₙ = √2 sin(nπx) is an orthonormal basis of L²[0, 1], which
proves the Fourier sine series converges in L². For f(x) = x, one
integration by parts gives ⟨f, eₙ⟩ = √2 (−1)ⁿ⁺¹/(nπ), and Parseval reads
1/3 = ∫₀¹ x² dx = Σ 2/(n²π²), so Σ 1/n² = π²/6.

## Where to see it

Axler's chapter on operators on inner product spaces (`linear-algebra`) is
the finite-dimensional half. On `advanced-analysis`, Kreyszig proves the
compact self-adjoint spectral theorem without measure theory, Hunter &
Nachtergaele work the Green's operator and Fourier series as an orthonormal
basis, and Brezis has the Fredholm alternative. The table is a dictionary.

| Linear algebra (dimension n) | Functional analysis |
|---|---|
| ℝⁿ or ℂⁿ with the dot product | Hilbert space: ℓ², L²[0, 1] |
| orthonormal basis, x = Σ ⟨x, eᵢ⟩ eᵢ | orthonormal basis (eₙ), the series converging in norm; Fourier series |
| Pythagoras, ‖x‖² = Σ ⟨x, eᵢ⟩² | Parseval's identity; Bessel's inequality as the one-sided version |
| every subspace gives V = W ⊕ W^⊥ | only closed subspaces do; the projection theorem |
| functional ↦ its coefficient vector | Riesz representation theorem |
| every linear map is a matrix and is continuous | bounded operator; unbounded ones such as d/dx need a domain |
| symmetric matrix, diagonalised in an orthonormal basis | compact self-adjoint operator; eigenvalues λₙ → 0 |
| singular value decomposition | Schmidt decomposition of a compact operator |
| injective ⇔ surjective (rank–nullity) | false (right shift); true for I − K with K compact (Fredholm alternative) |
| spectrum = eigenvalues, non-empty over ℂ | spectrum ⊇ eigenvalues, non-empty and compact; the shift has none |
| closed unit ball compact | never compact (Riesz's lemma); weak compactness (Banach–Alaoglu) instead |
| all norms equivalent | sup norm and L¹ norm on C[0, 1] are not |
