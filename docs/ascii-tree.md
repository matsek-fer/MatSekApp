# The ASCII tree generator

How `src/lib/ascii-tree.ts` turns a number into a tree, and how
`src/components/landing/ContentPanel.tsx` puts it on the landing page.

Written so you can check the thing rather than take its word for it. Every
constant named here is in the source under the same name.

---

## 1. The one-paragraph version

A seed goes into a small PRNG. The PRNG picks a species and draws a set of
parameters for this particular tree. A single shoot is placed at the bottom
centre of a 285 × 72 character grid pointing along the tree's own lean, and
then grown one step at a time: each step nudges its direction (gravity down, noise sideways),
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

`SPECIES` is a table of four entries — `oak` (Hrast), `bonsai` (Bonsai),
`birch` (Breza) and `willow` (Vrba). The species is chosen with `pick`, so it
is a uniform draw per tree.

Most fields are a `[min, max]` pair rather than a single number — the species
defines a *range*, and each tree draws its own value from it. That is where
variety between two oaks comes from.

| Field | Meaning |
| --- | --- |
| `trunkLength`, `trunkThickness` | Size of the first shoot. Thickness decides which character is drawn and how wide the stroke is |
| `maxDepth` | How many generations of forking before everything leafs out |
| `children` | Children per fork (2 for all four, occasionally ±1 — see §5.4) |
| `spread` | Half-angle, radians, that children fan away from their parent |
| `maxAngle` | The species' ceiling on how far from vertical a branch may point |
| `droopPerDepth` | How fast that ceiling opens as branches get finer — this is the arch |
| `reachRate` | How fast a branch is allowed out from the trunk per level. The main control on width: at 0.5 a first limb is still 40° off vertical, at 1.0 it is out near horizontal by the time it leaves the fork |
| `leaderDepth` | Range the per-tree leader depth is drawn from — see §5.4 |
| `charScale` | How finely this species is drawn relative to the others at the same physical size — see §5.0 |
| `tipTaper` | Fraction of its thickness a branch loses between base and tip. Near 1 a limb that leaves the fork as a `#` band comes to a single-character point |
| `tipDrop` | Extra droop ramped in over a branch's last quarter, so the end hooks down whether or not gravity had the length to do it |
| `droopCeiling` | Per-species override of the shared limit on how far past vertical a branch may point |
| `strandsToGround` | Side shoots are cut to the drop beneath them instead of being given a length — the willow's curtain |
| `minFanOffset` | Smallest angle a child may leave its parent at, so no limb comes off a wide fork pointing straight up |
| `gravity`, `hardness` | Downward pull per step, and resistance to it |
| `temperature` | Directional noise. High values wander and gnarl |
| `lengthDecay` | How much shorter each generation is than its parent |
| `leaves`, `leafDensity`, `leafSpread` | The characters scattered at each tip, how many, how far |
| `laterals`, `lateralLength`, `lateralAngle`, `lateralDepth`, `lateralStart`, `lateralMinDepth` | Side twigs along a branch, rather than at a fork. `lateralMinDepth` is the willow's: its strands hang off the limbs, never straight off the trunk |
| `trunkLean` | Half-range of the lean the whole tree starts with — see §4.1 |
| `trunkChar` | Character used once a branch is thick enough to read as trunk |

What separates them:

- **Oak** — stiff and fairly smooth (`hardness` 2.2–3.0, `temperature` 0.10–0.20),
  wide spread, strong droop. A broad low crown arching over and down.
- **Bonsai** — soft and gnarled (0.8–1.4 / 0.24–0.42) with the largest
  `droopPerDepth`. Short, twisted, wider than it is tall.
- **Birch** — the stiffest and smoothest (3.5–5.0 / 0.06–0.14) with a narrow
  spread and six levels of depth: tall, fine and twiggy.
- **Willow** — the widest and lowest of the four, and the only one built to be
  read as two materials at once. `maxDepth` 1 and `leaderDepth` [0, 0]: a short
  `#` trunk forks once, low, into four to six limbs that run out near
  horizontal (`reachRate` 1.0) and finish below it (`droopPerDepth` 0.52).
  `lengthDecay` above 2 makes those limbs far longer than the trunk, which is
  where all the width comes from. Everything else is the curtain — `laterals`
  11 at a `lateralAngle` near π, hanging straight down as thin single lines
  against the `#` of the limbs that carry them.

  Its curtain is built by `strandsToGround` and `strandLength`: a strand takes
  the share of the drop beneath it that its position along the limb earns —
  `STRAND_REACH_AT_FORK` (0.35) rising to 1.0 at the tip — but is never brought
  closer to the floor than `STRAND_GROUND_GAP`, one to four characters drawn per
  strand. So the ones near the trunk are short, the outermost run the whole way
  down, and the bottom edge is ragged rather than level, which would read as a
  hedge. Measured over the willow seeds in 400, the lowest strand stem finishes
  1–2 rows above the floor; leaf characters scatter a row or two below that.

  A limb that simply stopped was the remaining tell — a branch snapped off in
  mid air. Because `maxDepth` is 1, every limb *is* a tip, so it used to leaf
  out where it ended. It now spawns a tail instead: a terminal shoot from the
  limb's end, turned straight down, running to the ground with the strands. The
  tail inherits the thickness the limb had **tapered to**, not the one it
  started with — inheriting the base thickness sends a four-cell `#` column to
  the floor and the tree grows a second trunk at the end of every limb.

  `minFanOffset` 0.5 handles its fork. An even fan puts its middle child
  straight along the parent, which on a crown of four to six limbs is one limb
  going vertically up out of the middle of it. Every child is pushed onto one
  side or the other instead, and `leanOut` then holds each one no steeper than
  the parent it came from — the sky clamp can otherwise pull a child back
  upright, leaving a limb standing straighter than the one it grew out of.

  Its skeleton comes to a point: `tipTaper` 0.82 against 0.35–0.4 for the
  others, so a limb four cells wide at the fork is a single `|` by its tip, and
  the hard structure reads as a different material from the strands rather than
  the same texture at two weights. `tipDrop` then hooks that tip down —
  gravity alone only turns a branch down if it has length left to do it in, so
  short limbs used to finish as flat spurs trailing off sideways. `droopCeiling`
  2.45 lets those ends get well below horizontal, and its `temperature`, high
  for a tree this stiff, is aimed at the trunk: a willow's stem wanders rather
  than standing straight.

  `softCap` 240 against the shared 52. The density cap gates side shoots as
  well as forking, and on a willow every strand comes off limbs that are queued
  one after another — so a cap that low was spent by the first limb or two and
  every limb after them came out bare. A long horizontal branch with nothing
  hanging from it is the one thing a willow cannot have. Over the willow seeds
  in 400, cells on a horizontal limb with nothing beneath them went from 8.9 %
  to 4.6 %, and the longest unbroken bare stretch from 19 characters to 9; the
  rest of that came from `lateralStart`, dropped to 0.08 so strands begin
  almost at the fork.

  Three more settings are there to stop failure modes worth knowing about:
  `maxDepth` 1 because a second generation of limbs starts where the first
  finished — already past horizontal — and drives into the ground; `leaderDepth`
  [0, 0] because a leader keeps the trunk rising *through* the crown, and since
  strands hang from depth ≥ 1 the still-rising trunk collects them; and
  `lateralMinDepth` 1 so nothing hangs off the trunk itself.

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

### 4.1 The tree's own up

Each tree draws a `lean` from ±`species.trunkLean` and its **axis** is
`UP + lean`. The trunk sets off along the axis, and every angle clamp below is
measured from it rather than from true vertical. That is what lets a birch
(`trunkLean` 0.5, about 29°) or a willow (0.4) start off well away from
vertical and carry its crown over with it — clamped against true vertical, the
trunk would be bent back upright on its first step. Oak and bonsai keep the
old, near-upright range (0.16 and 0.2).

Gravity is not measured from the axis. It pulls towards the real ground, which
is why a leaning tree's downhill limbs fall away faster than its uphill ones.

---

## 5. Growing a tree

`generateTree(seed, options)` is the whole of it. Canvas defaults to
`CANVAS_COLS` × `CANVAS_ROWS` = 285 × 72, and species sizes are scaled by
`rows / SPECIES_ROWS` (38.5) times the species' own `charScale`, so a bigger canvas grows a bigger tree rather than
the same tree with more air around it. `SPECIES_ROWS` is deliberately smaller
than the canvas: at parity the nominal tree is exactly canvas height and every
taller-than-average one loses its crown to the top row.

### 5.0 Resolution, and why the canvas is this big

The page sizes glyphs so that the tree fills its band whatever its character
count (§7). Raising the canvas therefore does not make the tree bigger — it
draws the *same* tree in more, smaller characters. The current 285 × 72 is
about 1.9× the 110 × 34 it was tuned at, which is why the type on the page is
much smaller than it used to be at the same physical tree size.

**`charScale` does the same thing for one species.** Because every tree is
scaled to fill the band's *height*, the species with the fewest rows is drawn
in the biggest type — which was backwards for the willow, whose whole character
is fine, dense strands, and which is the shortest of the four. Its `charScale`
of 1.95 buys it a finer grid than the rest; bonsai and birch carry small ones
for the same reason. The four now land within about a pixel of each other, with
the willow finest:

| Species | Mean glyph |
| --- | --- |
| Vrba | 11.1 px |
| Hrast | 11.7 px |
| Breza | 11.9 px |
| Bonsai | 12.5 px |

`charScale` multiplies `scale`, so `detail` picks it up and every correction in
the table above follows automatically. One does not follow automatically:

Four quantities are measured in whole cells or per step, and have to be told
about the change or the shape drifts with the resolution. `detail`
(= `scale / TUNED_SCALE`) carries it:

| Quantity | Correction | Why |
| --- | --- | --- |
| `gravity` | ÷ `detail` | Applied per step, and a branch of the same length now takes more steps. Left alone it would bend further |
| `temperature` | ÷ √`detail` | Same, but it is a random walk, so the total wander goes with the square root |
| `leafDensity` | × `detail²` | A leaf cluster's *area* grows with the square, so the same count would thin out |
| stroke width | × `detail` | A three-cell trunk on a coarse canvas is a four- or five-cell trunk on a fine one |

side-shoot *count*. `lateralRate` is `species.laterals × charScale`, so a finer
grid packs proportionally more strands into the same width. Held constant, the
finer grid would draw the same number of strands in thinner type — the same
curtain with more air in it, when the point was to make it denser.

Stroke width is `round(thickness × WIDTH_PER_THICKNESS × detail)`, capped at
`MAX_STROKE`. It used to be three fixed tiers; multiplied up for the finer
canvas those tiers jumped straight from one cell to three, so a limb either
vanished to a hairline or came out as a slab. `WIDTH_PER_THICKNESS` = 0.62 is
set so the old tier boundaries still land on the same widths.

### 5.1 The queue

Shoots are processed **breadth-first**: the trunk, then everything at depth 1,
then everything at depth 2. Siblings therefore extend during the same span of
simulation time, so the replay shows branches growing alongside each other
rather than one whole subtree at a time.

The first shoot is placed at `(cols / 2, rows - 1)` — bottom centre — pointing
along the axis of §4.1.

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

The limit is applied by `clampToSky(angle, limit, axis)`, and the axis is the
tree's lean, not vertical (§4.1).

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
shorter than 1.2, thinner than 0.3, or the canopy has hit the density cap —
`SOFT_CAP`, 52 live shoots, which a species may raise via `softCap`. Otherwise it forks.

- `childCount` is normally 2, +1 with probability 0.35 near the base, −1 with
  probability 0.18 far out.
- One child may be the **leader**: near the base (`depth ≤ p.leaderDepth`) a
  randomly chosen child carries on nearly in the parent's direction (a fifth of
  the usual fan), keeps 78–90 % of its parent's thickness where a side limb
  keeps 55–70 %, takes 75 % of its length rather than `lengthDecay`, and skips
  the outward bias. The others come off it as limbs. Without a leader every
  fork splits the trunk in half and the tree reads as two trees leaning apart.
  `p.leaderDepth` is drawn per tree from the species' own `leaderDepth` range:
  {0, 1, 2} for oak, bonsai and birch, so the habit varies; [0, 0] for the
  willow, which has no stem above its first fork.
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

In the browser, `/?seed=123` pins the first tree, so a particular one can be
looked at again instead of reloading until the species you want comes up. Only
the first is pinned — the panel replants a random one every few seconds after
that. Handy seeds: 1 is a Breza, 4 a Vrba, 7 a Hrast, 12 a Bonsai.

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
| Branch ends that hook down regardless of length | `tipDrop` up |
| Limbs that thin to a line at the tip | `tipTaper` up |
| Straighter, stiffer branches | `hardness` up, or `temperature` down |
| A clearer trunk | `leaderDepth` range up (in `generateTree`), or `TRUNK_LIMIT` down |
| Denser canopy | `SOFT_CAP` up, `leafDensity` up |
| Smaller type at the same tree size | `CANVAS_ROWS` and `CANVAS_COLS` up together, keeping their ratio |
| Smaller type for one species only | its `charScale` up — which also makes its side shoots denser |
| Trees that set off further from vertical | `trunkLean` up, per species |
| Fewer long flat runs | `DROOP_ONSET` up — branches spend less time pinned near horizontal |

Sizes are load-bearing against each other. Measured over 600 seeds, mean and
range of the bounding box each species lands in:

| Species | Width | Height | Mean width on a 1536 × 528 band |
| --- | --- | --- | --- |
| Hrast | 87 [51–155] | 44 [30–63] | 611 px |
| Bonsai | 108 [60–179] | 41 [28–60] | 818 px |
| Breza | 62 [40–91] | 43 [31–62] | 456 px |
| Vrba | 116 [63–175] | 44 [31–60] | 839 px |

The last column is the one that matters: every tree is scaled to fill the
band's *height*, so columns alone do not tell you how wide anything looks. The
willow is the widest on screen, and now also the finest-grained, because
`charScale` decouples the two. It also means a species that
runs much taller than the others is drawn in noticeably smaller type — keep
them in the same band.

No species touches the edge of the canvas on any of the 600 seeds measured.
That is the number to watch if you raise any size or `charScale`: the check is
`t.height >= CANVAS_ROWS - 1 || t.width >= CANVAS_COLS - 2`, and a hit shows up
as a crown clipped flat.
