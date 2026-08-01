# The ASCII tree generator

How `src/lib/ascii-tree.ts` turns a number into a tree, and how
`src/components/landing/ContentPanel.tsx` puts it on the landing page.

Written so you can check the thing rather than take its word for it. Every
constant named here is in the source under the same name.

---

## 1. The one-paragraph version

A seed goes into a small PRNG. The PRNG picks a species and draws a set of
parameters for this particular tree. A single shoot is placed at the bottom
centre of a 110 × 34 character grid pointing straight up, and then grown one
step at a time: each step nudges its direction (gravity down, noise sideways),
draws a character, and occasionally sprouts a twig. When a shoot runs out of
length it either forks into children — which go back in the queue — or stops
and scatters leaf characters. Every character written also records **when** it
was written, which is what lets the finished tree be replayed as growth. The
grid is then cropped to what was actually drawn and returned as an array of
strings.

Same seed in, same tree out, always. That is why the seed is printed under it.

---

## 2. Randomness

```ts
function mulberry32(seed: number)   // ascii-tree.ts
```

`mulberry32` is a 32-bit PRNG: given a seed it returns a function that yields a
new number in `[0, 1)` each call. It has no global state, so two trees never
interfere, and it is fully deterministic.

Two helpers wrap it:

| Helper | What it does |
| --- | --- |
| `range(rng, lo, hi)` | A uniform number between `lo` and `hi` |
| `pick(rng, xs)` | A uniform element of `xs` |

**Every** decision in the generator goes through this one `rng`. Nothing calls
`Math.random`, and nothing reads the clock. `randomSeed()` — which does use
`Math.random` — is only used to choose the *next* seed, never inside a tree.

A consequence worth knowing when you experiment: the draws are a *sequence*.
Adding one extra `rng()` call anywhere shifts every later draw, so a change that
should be cosmetic will produce a completely different tree for the same seed.
That is expected, not a bug.

---

## 3. Species

`SPECIES` is a table of two entries, `oak` (Hrast) and `bonsai` (Bonsai). The
species is chosen with `pick`, so it is a coin flip per tree.

Most fields are a `[min, max]` pair rather than a single number — the species
defines a *range*, and each tree draws its own value from it. That is where
variety between two oaks comes from.

| Field | Meaning |
| --- | --- |
| `trunkLength`, `trunkThickness` | Size of the first shoot. Thickness decides which character is drawn and how wide the stroke is |
| `maxDepth` | How many generations of forking before everything leafs out |
| `children` | Children per fork (2 for both species, occasionally ±1 — see §5.4) |
| `spread` | Half-angle, radians, that children fan away from their parent |
| `maxAngle` | The species' ceiling on how far from vertical a branch may point |
| `droopPerDepth` | How fast that ceiling opens as branches get finer — this is the arch |
| `gravity`, `hardness` | Downward pull per step, and resistance to it |
| `temperature` | Directional noise. High values wander and gnarl |
| `lengthDecay` | How much shorter each generation is than its parent |
| `leaves`, `leafDensity`, `leafSpread` | The characters scattered at each tip, how many, how far |
| `laterals`, `lateralLength`, `lateralAngle`, `lateralDepth`, `lateralStart` | Side twigs along a branch, rather than at a fork |
| `trunkChar` | Character used once a branch is thick enough to read as trunk |

The two species differ mostly in `hardness` and `temperature`: an oak is stiff
and fairly smooth (2.2–3.0 / 0.10–0.20), a bonsai is soft and gnarled
(0.8–1.4 / 0.24–0.42), which is what makes one read as a big tree and the other
as a twisted small one.

---

## 4. Geometry conventions

- **Angles** are radians in screen space. `UP = -π/2` is straight up. Adding to
  an angle rotates *clockwise*, i.e. to the right.
- **`X_SCALE = 1.8`.** A character cell is roughly twice as tall as it is wide,
  so a horizontal step has to cover 1.8 columns to look like the same distance
  as one row vertically. Without it every tree looks vertically stretched.
- **`branchChar(dx, dy)`** picks the glyph from the direction of travel:
  `|` when mostly vertical, `-` only when genuinely flat, otherwise `\` or `/`.
- **`stroke(...)`** fills every cell between two points instead of just plotting
  the endpoint. One growth step can cross two columns, and plotting endpoints
  only leaves a dotted `- - -` line.

---

## 5. Growing a tree

`generateTree(seed, options)` is the whole of it. Canvas defaults to
110 columns × 34 rows, and species sizes are scaled by `rows / 26`, so a bigger
canvas grows a bigger tree rather than the same tree with more air around it.

### 5.1 The queue

Shoots are processed **breadth-first**: the trunk, then everything at depth 1,
then everything at depth 2. Siblings therefore extend during the same span of
simulation time, so the replay shows branches growing alongside each other
rather than one whole subtree at a time.

The first shoot is placed at `(cols / 2, rows - 1)` — bottom centre — pointing
`UP + lean`, where `lean` is drawn from ±0.16 rad.

### 5.2 Stepping a shoot

A shoot of length *L* takes `round(L)` steps. Each step:

1. **Gravity.** The droop applied is

   ```
   gravity × (depth + 1) × (i/steps + 0.35) × (0.3 + |sin(angle − UP)|) / hardness
   ```

   The last factor is the important one: it is the *lean*. A vertical branch
   feels almost nothing, a horizontal one feels the most — which is how a real
   limb is loaded, and it is what makes the ends curl instead of running flat.
   Terminal twigs are exempt; letting them droop sends the ones near the base
   into the ground.

2. **Noise.** `±temperature / thickness`, so thin branches wander and thick ones
   hold their course.

3. **Clamp** to `skyLimit(...)` — see §5.3.

4. **Draw.** Thickness tapers along the branch (`× (1 − 0.3 · i/steps)`), and
   decides both the glyph and the stroke width: ≥3.6 draws three cells wide,
   ≥2.3 two, otherwise one. Anything ≥2 is painted on the trunk layer.

5. **Time.** One unit of simulation time per step; the cell records it.

6. **Laterals.** With probability `laterals / steps`, and only within
   `lateralDepth` and past `lateralStart` of the way along, a side twig is
   pushed onto the queue with `terminal: true`. Those never fork again — they
   just leaf out at their tip. They exist because a long trunk is otherwise bare
   between forks.

7. **Escape check.** A shoot that wanders more than 2 cells off the canvas is
   abandoned rather than left to seed a subtree nobody will see.

### 5.3 How far a branch may lean — `skyLimit`

This is the heart of the current silhouette.

```ts
skyLimit(species, depth, progress):
  d      = depth + progress                                  // progress ∈ [0,1] along the branch
  reach  = min(species.maxAngle, TRUNK_LIMIT + d × 0.5)      // TRUNK_LIMIT = 0.22
  extra  = max(0, d − DROOP_ONSET) × species.droopPerDepth   // DROOP_ONSET  = 1.2
  return min(DROOP_CEILING, reach + extra)                   // DROOP_CEILING = 1.95
```

Read it as three rules:

- **The trunk stands up.** At `d = 0` the limit is 0.22 rad, about 13°. Without
  this the gravity term walks the trunk sideways and the crown ends up next to
  its own base instead of over it.
- **Each level out is freer than the last**, up to the species ceiling.
- **Past `DROOP_ONSET` the ceiling keeps opening**, so the outer generations may
  pass horizontal (π/2 ≈ 1.571) and point at the ground. `DROOP_CEILING = 1.95`
  ≈ 112°, i.e. about 22° below horizontal — beyond that a branch curls back
  towards its own trunk and draws a hook rather than an arch.

Because `progress` is in there, the limit opens *along* a branch as well as
between generations. A limb leaves the trunk reaching outward and only falls
away once it is out there, which is what puts the bend at the ends rather than
at the fork.

### 5.4 Forking

A shoot stops and becomes a tip if it is terminal, has reached `maxDepth`, is
shorter than 1.2, thinner than 0.3, or the canopy has hit `SOFT_CAP` (52 live
shoots). Otherwise it forks.

- `childCount` is normally 2, +1 with probability 0.35 near the base, −1 with
  probability 0.18 far out.
- One child may be the **leader**: near the base (`depth ≤ leaderDepth`) a
  randomly chosen child carries on nearly in the parent's direction (a fifth of
  the usual fan), keeps 78–90 % of its parent's thickness where a side limb
  keeps 55–70 %, takes 75 % of its length rather than `lengthDecay`, and skips
  the outward bias. The others come off it as limbs. Without a leader every
  fork splits the trunk in half and the tree reads as two trees leaning apart.
  `leaderDepth` is drawn per tree from {0, 1, 2}: 0 gives an all-crown tree that
  forks immediately, 2 a clear stem running most of the way up.
- **`OUTWARD_BIAS = 0.05` rad per level** nudges children on the left further
  left and on the right further right, in proportion to how far from the trunk
  they already are. It stops a wide fork from throwing half its children back
  across the trunk.
- The fan is `t × spread` for `t` spaced evenly over [−1, 1], plus a jitter of
  ±0.225 × spread so pairs are not perfect mirrors.

### 5.5 Handedness — why the trunk used to sit right of centre

Children were pushed onto the queue left-to-right, always. Combined with
`SOFT_CAP` — which turns whatever is still queued into leaves once the canopy is
full — the side enqueued first was the side that got to keep forking. Left-first
ordering therefore grew a heavier left crown, and against that crown the trunk
appeared to sit to the right.

The fix is one coin flip: `mirrored = rng() < 0.5` reverses the push order on
half of all forks. Measured over 400 consecutive seeds, mean trunk offset from
the crown's centre of mass, as a share of tree width:

| | before | after |
| --- | --- | --- |
| bounding box | +0.017 (169 right / 150 left) | 0.000 (155 / 177) |
| centre of mass | +0.018 (186 right / 156 left) | −0.002 (170 / 187) |

The residual is noise. Note the bias was always mild — roughly 54/46, never
"every tree" — so a handful of consecutive right-leaning trees was partly the
bias and partly small numbers.

### 5.6 Leaves

A tip scatters `leafDensity` characters around itself: uniform angle, radius
`√u × leafSpread` (the square root keeps the disc evenly filled rather than
clustered at the centre), squashed to 0.55 vertically and stretched by `X_SCALE`
horizontally so the cluster is round on screen rather than in grid units. Each
leaf's timestamp is staggered so foliage unfurls after its twig arrives.

### 5.7 Layers

Cells are painted with a layer: `leaf` 1, `branch` 2, `trunk` 3. A higher layer
may overwrite a lower one, never the reverse, so foliage drawn later cannot
erase the trunk. The **timestamp**, though, is always the earliest one written,
so a cell never blinks back out when a later branch crosses it.

---

## 6. Rendering, and the growth animation

`renderTree(tree, upTo)` walks the bounding box and emits one string per row,
taking each cell only if `times[i] <= upTo`. Rows are right-trimmed.

Two properties matter:

- It always crops to the **finished** tree's bounding box, so a growing tree
  stays anchored instead of shifting under itself frame by frame.
- `upTo = Infinity` gives the finished tree.

`ContentPanel` drives it: `growth` runs 0 → 1 over `GROW_MS` (2600 ms) at ~30 fps
and is multiplied by `tree.duration` to get `upTo`. When it reaches 1 the tree
holds for `HOLD_MS` (2400 ms) and a new seed is planted. `prefers-reduced-motion`
skips the growth phase and shows the finished tree for the whole cycle.

The component pads each row back out to `tree.width`, because the trimmed rows
would otherwise change the block's width every frame and the art would drift
sideways under the centring flex.

---

## 7. How it is sized on the page

The art is a fixed number of characters, so **the glyph size, not the layout,
decides how big the tree looks**. `ContentPanel` measures its band with a
`ResizeObserver` and sets

```
font-size: max(5px, min(bandWidth × 0.96 / (tree.width × 0.62),
                        bandHeight        / (tree.height × 1.05)))
```

where 0.62 em is roughly a monospace glyph's advance width and 1.05 is the line
height. Whichever of width or height runs out first sets the size, so each tree
fills the band on its own terms — a wide one is limited by the width, a tall one
by the height.

The band takes exactly the height the viewport has left below the header
(`flex-1 basis-0 min-h-0` inside an `h-[100dvh]` page) and never asks for more,
so the page fits one screen and the tree is scaled to suit rather than running
off the bottom. Before measurement — server render and first client render,
which must agree — it falls back to viewport units.

---

## 8. Inspecting it yourself

There is no test harness; the quickest loop is to compile the one file and print
trees:

```bash
npx tsc src/lib/ascii-tree.ts --outDir /tmp/tree --module commonjs \
        --target es2020 --skipLibCheck

node -e '
const { generateTree, renderTree } = require("/tmp/tree/ascii-tree.js");
for (const s of [1, 2, 3]) {
  const t = generateTree(s);
  console.log(`--- seed ${s}  ${t.species}  ${t.width}x${t.height} ---`);
  console.log(renderTree(t).join("\n"));
}'
```

`generateTree` also takes `{ cols, rows }` if you want to see how it behaves on
a different canvas.

To check a claim about bias or variety, generate a few hundred seeds and measure
rather than eyeballing — the numbers in §5.5 came from exactly that, and the
first impression ("always to the right") turned out to be a real but much
smaller effect than it looked.

---

## 9. Knobs worth turning first

| Want | Turn |
| --- | --- |
| Wider crowns | `spread` up, or `OUTWARD_BIAS` up |
| More arch, ends pointing further down | `droopPerDepth` up, or `DROOP_CEILING` up |
| Straighter, stiffer branches | `hardness` up, or `temperature` down |
| A clearer trunk | `leaderDepth` range up (in `generateTree`), or `TRUNK_LIMIT` down |
| Denser canopy | `SOFT_CAP` up, `leafDensity` up |
| Fewer long flat runs | `DROOP_ONSET` up — branches spend less time pinned near horizontal |

Sizes are load-bearing against each other: both species are tuned to land
roughly 30–90 columns by 15–33 rows, which is what the page's sizing assumes
will fit a wide, short band.
