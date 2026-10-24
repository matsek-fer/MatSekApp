---
between: [cs-foundations, linear-algebra]
tagline: Computer science borrows eigenvectors, projections and subspaces over 𝔽₂; linear algebra gets back the cost of its algorithms in steps and lost digits.
strength: 2
status: draft
ai_generated: true
---

A vector is an array of numbers and a linear map is a double loop over a
matrix, so linear algebra is the mathematics whose objects are already data
structures. Every question `cs-foundations` asks of a procedure — how many
steps, how many correct digits, what survives a flipped bit — becomes, for a
linear map, a theorem.

## What each side lends

Linear algebra lends the tools. Least squares: the x̂ minimising ‖Ax − b‖
makes Ax̂ the projection of b onto the column space of A, so AᵀA x̂ = Aᵀb;
every model fit in Boyd & Vandenberghe starts there. PageRank, the
`linear-algebra` pitch problem, is the eigenvector for eigenvalue 1 of the
Google matrix G = 0.85P + 0.15J/n, link matrix plus uniform jump, unique by
Perron–Frobenius. Over 𝔽₂ a subspace is a code, and kernel, rank and
dimension become decoding, redundancy and rate.

Computer science repays by counting. Gaussian elimination costs about ⅔n³
flops; Strassen (1969) multiplied 2×2 block matrices with seven products
instead of eight, giving O(n^{log₂ 7}) ≈ O(n^{2.81}); the exponent ω, with
2 ≤ ω < 2.372 all that is known, also governs inversion, determinants and
solving systems. PageRank is found by power iteration, one sparse product per
step, each shrinking the error by a factor 0.85. Floating point adds the
condition number κ(A) = ‖A‖‖A⁻¹‖: solving Ax = b can lose log₁₀ κ of double
precision's sixteen digits, which is why elimination pivots and why the
normal equations, with κ(AᵀA) = κ(A)², give way to QR.

## The Hamming [7,4] code

Let H be the 3×7 matrix over 𝔽₂ whose jth column is j in binary. The code is
C = ker H ⊂ 𝔽₂⁷; rank H = 3, so dim C = 4: sixteen codewords, four data bits
each. No column is zero and no two agree, so every non-zero codeword has at
least three ones, and if one bit of a codeword x flips, y = x + eⱼ, then
Hy = Heⱼ = column j: the syndrome is the error's position in binary.

x = 0110011 is a codeword (each row of H meets an even number of its ones).
Flip bit 6: y = 0110001, and Hy = (1, 1, 0) = 110₂ = 6, so the receiver
flips bit 6 back. Decoding is one 3×7 matrix–vector product; the theory
behind it is rank–nullity over 𝔽₂.

## Where to see it

CLRS covers Strassen in its divide-and-conquer chapter and LUP decomposition,
inversion and least squares in its matrix-operations chapter; Strang's 18.06
lectures on elimination, projections, least squares and the SVD add the
geometry; 3Blue1Brown's Hamming-code videos derive H from the binary
positions. The table is a phrasebook between `cs-foundations` and
`linear-algebra`.

| Computer science | Linear algebra |
|---|---|
| array of n numbers | vector in ℝⁿ or 𝔽₂ⁿ |
| double loop over a matrix | linear map, applied |
| cost of solving Ax = b | about ⅔n³ flops by elimination |
| matrix multiplication exponent ω | 2 ≤ ω < 2.372; Strassen's log₂ 7 |
| digits lost in floating point | log₁₀ κ(A), κ = ‖A‖‖A⁻¹‖ |
| fitting a model to data | least squares; projection onto the column space |
| ranking pages by links | eigenvector for eigenvalue 1 of a stochastic matrix |
| one step of power iteration | one sparse matrix–vector product |
| error-correcting code | subspace of 𝔽₂ⁿ, the kernel of a parity-check matrix H |
| detecting and locating a bit flip | syndrome Hy ≠ 0, and which column of H it equals |
| exponentiation by squaring | Aⁿ in O(log n) multiplications |
| FFT | the n×n DFT matrix factored into log₂ n sparse matrices |
| compression, recommendation | low-rank approximation by the SVD |
