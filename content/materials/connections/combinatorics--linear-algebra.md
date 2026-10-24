---
between: [combinatorics, linear-algebra]
tagline: Combinatorics turns sets and graphs into vectors and matrices to borrow rank and eigenvalues; linear algebra gets back the permutations inside its determinant.
strength: 2
status: draft
ai_generated: true
---

A subset of {1, …, n} is its indicator vector in 𝔽ⁿ; a graph on n vertices is
its adjacency matrix. Inside a vector space a finite structure acquires two
numbers combinatorics cannot see, a dimension and a spectrum, and both bound
or count things. The traffic back runs through the finite structure inside
every matrix: a determinant is a signed sum over permutations.

## What each side lends

Linear algebra's export is the linear-algebra method: bound a family of sets
by showing its indicator vectors are independent in a space of known
dimension. Fisher's inequality is the model: m blocks on n points, any two
sharing exactly λ points and each larger than λ, force m ≤ n, because the Gram
matrix NᵀN = λJ + D, D diagonal and positive, is positive definite and the
incidence matrix N has rank m. For a d-regular graph with adjacency
eigenvalues d = λ₁ ≥ … ≥ λₙ, Hoffman's bound caps an independent set at
n·(−λₙ)/(d − λₙ) vertices, and the gap d − λ₂ measures expansion (Cheeger's
inequality).

Combinatorics repays in structure. The Leibniz formula
det A = ∑_σ sgn(σ) ∏ᵢ a_{i,σ(i)} is a signed count over permutations;
unsigned, it is the permanent, which counts a bipartite graph's perfect
matchings via its biadjacency matrix. Elimination finds a determinant in O(n³)
steps; Valiant proved the permanent #P-complete: the signs' cancellation
is what elimination exploits. The transfer-matrix method joins the Fibonacci
problem on both topic pages: tilings of a 2×n strip are walks of length n in
a two-state graph, so their number is an entry of [[1, 1], [1, 0]]ⁿ and their
generating function has denominator det(I − xA) = 1 − x − x².

## Oddtown

If every club in a town of n people has an odd number of members and any two
clubs share an even number, there are at most n clubs. Proof: the indicator
vectors v₁, …, vₘ ∈ 𝔽₂ⁿ satisfy vᵢ·vⱼ = |Cᵢ ∩ Cⱼ| mod 2, which is 1 for i = j
and 0 otherwise. If ∑ aᵢvᵢ = 0, dotting with vⱼ leaves aⱼ = 0, so the vectors
are independent and m ≤ n. For n = 4 the clubs {1,2,3}, {1,2,4}, {1,3,4},
{2,3,4} have three members each and share two pairwise, so the bound is tight.
Change "odd" to "even" and the answer jumps to 2^⌊n/2⌋, which no counting
argument predicts.

## Where to see it

Jukna's *Extremal Combinatorics* has a part on the linear algebra method,
Fisher's inequality included, and a chapter on eigenvalues and expansion;
Stanley covers the transfer-matrix method under rational generating
functions; Strang's 18.06 has a lecture on graphs, networks and incidence
matrices. The table is a phrasebook between `combinatorics` and
`linear-algebra`.

| Combinatorics | Linear algebra |
|---|---|
| subset of {1, …, n} | indicator vector in 𝔽ⁿ, 𝔽 = ℝ or 𝔽₂ |
| family of m sets on n points | n×m incidence matrix N |
| size of an intersection Cᵢ ∩ Cⱼ | entry of the Gram matrix NᵀN |
| "at most n such sets" | linear independence in dimension n |
| graph on n vertices | adjacency matrix A; Laplacian L = D − A |
| walks of length k from i to j | (Aᵏ)ᵢⱼ |
| number of connected components | multiplicity of eigenvalue 0 of L |
| number of spanning trees | any cofactor of L (matrix-tree theorem) |
| largest independent set | Hoffman bound from the smallest eigenvalue λₙ |
| expander | spectral gap d − λ₂ |
| perfect matchings of a bipartite graph | permanent of the biadjacency matrix |
| permutation with its sign | one term of the Leibniz formula |
| tilings, words, walks of a fixed length | entry of a transfer-matrix power |
