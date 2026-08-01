/**
 * Procedural ASCII trees.
 *
 * Structure follows PyBonsai-style fractal branching, but growth is simulated
 * step by step so gravity and "temperature" (directional instability) can bend
 * a branch as it extends. docs/ascii-tree.md walks through the whole thing.
 *
 * Everything derives from the seed through a small PRNG, so the same seed
 * always yields the same tree. That is what makes printing the seed useful.
 */

// ── Deterministic PRNG (mulberry32) ────────────────────────────────────────

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;

const range = (rng: Rng, lo: number, hi: number) => lo + rng() * (hi - lo);
const pick = <T,>(rng: Rng, xs: readonly T[]): T =>
  xs[Math.min(xs.length - 1, Math.floor(rng() * xs.length))];

// ── Species ────────────────────────────────────────────────────────────────

interface Species {
  id: string;
  /** Shown in the UI, Croatian. */
  label: string;
  trunkLength: [number, number];
  trunkThickness: [number, number];
  maxDepth: [number, number];
  children: [number, number];
  /** Half-angle, radians, that children fan out from their parent. */
  spread: [number, number];
  /**
   * How far from straight up a branch may point, in radians. PI/2 is
   * horizontal; anything beyond that is a branch heading for the ground.
   * Without this, gravity flattens every tree into a sideways sprawl.
   */
  maxAngle: number;
  /**
   * Radians the `maxAngle` limit opens per level of depth. The trunk and its
   * first limbs are held near the sky; the finer the branch, the further it is
   * allowed to fall, so gravity carries the outer ends out past horizontal and
   * points them at the ground. That arch is most of what reads as a mature
   * broadleaf rather than an upturned broom.
   */
  droopPerDepth: number;
  /**
   * Radians the reach opens per level of depth, before the droop takes over.
   * This is what sets how quickly limbs get out from the trunk, and so how
   * wide the tree is: at 0.5 a first limb is still only 40 degrees off
   * vertical, at 1.2 it is out near horizontal by the time it leaves the fork.
   */
  reachRate: number;
  /** Per-step droop. Negative curls the branch back upward. */
  gravity: [number, number];
  /** Resistance to gravity — higher keeps a branch straight. */
  hardness: [number, number];
  /** Directional noise; high values give gnarled, wandering branches. */
  temperature: [number, number];
  lengthDecay: [number, number];
  leaves: readonly string[];
  /** Leaf characters scattered per terminal tip. */
  leafDensity: [number, number];
  leafSpread: [number, number];
  /**
   * Roughly how many side shoots grow along the trunk and its first children.
   * Zero for species whose structure comes entirely from forking.
   */
  laterals: number;
  /** Extra length a side shoot gains at the base, tapering to none at the tip. */
  lateralLength: number;
  /**
   * How far a side shoot points from straight up. Past PI/2 it slopes
   * downward, which is what hangs a twig off the underside of a limb rather
   * than standing it on top.
   */
  lateralAngle: [number, number];
  /** Deepest branch that still puts out side shoots. */
  lateralDepth: number;
  /** Fraction along a branch before side shoots start, so a limb keeps a bare
   * stretch at its base instead of sprouting from the fork. */
  lateralStart: number;
  /** Shallowest branch that puts out side shoots. A willow hangs its strands
   * off the outer limbs, never straight off the trunk. */
  lateralMinDepth?: number;
  /**
   * Range the per-tree leader depth is drawn from — how far up the trunk keeps
   * a dominant leader instead of forking evenly. A willow wants [0, 0]: it has
   * no stem above the first fork, and a leader would carry the trunk up through
   * the crown collecting strands on the way.
   */
  leaderDepth: [number, number];
  /**
   * Half-range, radians, of the lean the whole tree starts with. Small values
   * stand a tree up straight; large ones let the trunk set off well off
   * vertical, and the crown follows it over.
   */
  trunkLean: number;
  /** Character used once a branch is thick enough to read as a trunk. */
  trunkChar: string;
}

const SPECIES: readonly Species[] = [
  {
    id: "oak",
    // A broad, low crown: limbs leave the trunk at a wide angle and the outer
    // ones arch over and down, which is the silhouette an oak is recognised by.
    label: "Hrast",
    trunkLength: [6, 11],
    trunkThickness: [3.4, 4.8],
    maxDepth: [4, 6],
    children: [2, 2],
    spread: [0.5, 0.9],
    maxAngle: 1.0,
    droopPerDepth: 0.34,
    reachRate: 0.5,
    gravity: [0.05, 0.085],
    hardness: [2.2, 3.0],
    temperature: [0.1, 0.2],
    lengthDecay: [0.6, 0.7],
    leaves: ["&", "%", "@", "*"],
    leafDensity: [7, 11],
    leafSpread: [2.2, 3.0],
    laterals: 1.5,
    lateralLength: 3,
    lateralAngle: [0.9, 1.35],
    lateralDepth: 1,
    lateralStart: 0.2,
    leaderDepth: [0, 2],
    trunkLean: 0.16,
    trunkChar: "#",
  },
  {
    id: "bonsai",
    // Short, gnarled and wider than it is tall, with soft limbs that fall away
    // into flat pads — hence the low hardness and the earlier, larger droop.
    label: "Bonsai",
    trunkLength: [4, 8],
    trunkThickness: [2.8, 4.2],
    maxDepth: [4, 6],
    children: [2, 2],
    spread: [0.6, 1.05],
    maxAngle: 1.08,
    droopPerDepth: 0.4,
    reachRate: 0.5,
    gravity: [0.05, 0.08],
    hardness: [0.8, 1.4],
    temperature: [0.24, 0.42],
    lengthDecay: [0.72, 0.82],
    leaves: ["&", "*", "o", "@"],
    leafDensity: [7, 11],
    leafSpread: [1.9, 2.7],
    laterals: 1,
    lateralLength: 2.5,
    lateralAngle: [1.0, 1.45],
    lateralDepth: 1,
    lateralStart: 0.2,
    leaderDepth: [0, 2],
    trunkLean: 0.2,
    trunkChar: "#",
  },
  {
    id: "birch",
    // Tall, fine and whippy. It leans off vertical from the ground — a stand of
    // birches never stands to attention — and the crown follows the trunk over.
    label: "Breza",
    trunkLength: [6, 9],
    trunkThickness: [2.2, 3.0],
    maxDepth: [5, 6],
    children: [2, 2],
    spread: [0.42, 0.62],
    maxAngle: 1.12,
    droopPerDepth: 0.22,
    reachRate: 0.5,
    gravity: [0.02, 0.05],
    hardness: [3.5, 5],
    temperature: [0.06, 0.14],
    lengthDecay: [0.52, 0.64],
    leaves: ["'", "`", "*", "."],
    leafDensity: [5, 9],
    leafSpread: [1.6, 2.4],
    laterals: 3,
    lateralLength: 2,
    lateralAngle: [0.7, 1.0],
    lateralDepth: 1,
    lateralStart: 0.2,
    leaderDepth: [0, 2],
    trunkLean: 0.5,
    trunkChar: "|",
  },
  {
    id: "willow",
    // The widest of the four, and deliberately the shortest: a stout leaning
    // trunk that forks low into long, near-horizontal limbs, with the curtain
    // hanging off them. Everything here is in service of width — a willow read
    // as tall is a willow that has become a generic tree with strands on it.
    label: "Vrba",
    trunkLength: [5, 6.5],
    trunkThickness: [3.8, 4.8],
    // One generation of limbs and no more. A second one starts where the first
    // finished — already past horizontal and heading down — and simply drives
    // into the ground, which is what a "willow" full of limbs plunging to the
    // floor was. The curtain, not more forking, is the tree.
    maxDepth: [1, 1],
    children: [4, 6],
    spread: [1.0, 1.3],
    maxAngle: 1.5,
    // The limbs themselves have to finish pointing at the ground, not just the
    // strands hanging off them, so this runs well above the other species.
    droopPerDepth: 0.52,
    reachRate: 1.0,
    gravity: [0.1, 0.16],
    hardness: [1.6, 2.2],
    temperature: [0.03, 0.07],
    // Limbs as long as the trunk or longer. With the trunk this short that is
    // what carries the width.
    // Limbs far longer than the trunk. With only one generation of them, their
    // length is the entire width of the tree.
    lengthDecay: [2.0, 2.5],
    leaves: [",", "'", ".", ":"],
    leafDensity: [2, 3],
    leafSpread: [0.6, 1.0],
    laterals: 11,
    lateralLength: 3.4,
    lateralAngle: [3.06, 3.22], // straight down, give or take a few degrees
    lateralDepth: 1,
    lateralStart: 0.25,
    lateralMinDepth: 1,
    leaderDepth: [0, 0],
    trunkLean: 0.4,
    // Same glyph as the oak, and for the same reason: it separates the parts
    // that hold the tree up from the strands, which stay thin single lines.
    trunkChar: "#",
  },
];

// ── Grid ───────────────────────────────────────────────────────────────────

/** Paint order — a trunk must never be erased by foliage drawn later. */
const LAYER = { leaf: 1, branch: 2, trunk: 3 } as const;
type Layer = (typeof LAYER)[keyof typeof LAYER];

class Grid {
  readonly cells: string[];
  readonly layers: number[];
  /**
   * Simulation time at which each cell first appeared. Keeping it lets the
   * finished tree be replayed as growth instead of only drawn complete.
   */
  readonly times: number[];

  constructor(readonly cols: number, readonly rows: number) {
    this.cells = new Array(cols * rows).fill(" ");
    this.layers = new Array(cols * rows).fill(0);
    this.times = new Array(cols * rows).fill(Infinity);
  }

  put(x: number, y: number, ch: string, layer: Layer, time: number) {
    const cx = Math.round(x);
    const cy = Math.round(y);
    if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return;
    const i = cy * this.cols + cx;

    // Earliest appearance wins, so a cell never blinks back out when a later
    // branch happens to cross it.
    if (time < this.times[i]) this.times[i] = time;

    if (this.layers[i] > layer) return;
    this.cells[i] = ch;
    this.layers[i] = layer;
  }

  /** Tight box around everything drawn — frames must not drift as it grows. */
  bounds(): Bounds {
    let top = this.rows;
    let bottom = -1;
    let left = this.cols;
    let right = -1;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.cells[y * this.cols + x] === " ") continue;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }

    if (bottom < 0) return { top: 0, bottom: 0, left: 0, right: 0 };
    return { top, bottom, left, right };
  }
}

// Character cells are about twice as tall as they are wide, so a horizontal
// step has to cover twice the distance to keep angles looking correct.
const X_SCALE = 1.8;

const UP = -Math.PI / 2;

/**
 * Keeps a direction within `limit` radians of the tree's own up.
 *
 * Gravity and noise otherwise accumulate until branches run sideways or dive
 * into the ground, which reads as scribble rather than as a tree.
 *
 * `axis` is that up: straight up plus the tree's lean. Measuring from the lean
 * rather than from vertical is what lets a birch set off at 30 degrees and
 * carry its crown over with it — clamped against true vertical, the trunk would
 * simply be bent back upright on its first step.
 */
function clampToSky(angle: number, limit: number, axis: number = UP): number {
  const off = angle - axis;
  return axis + Math.max(-limit, Math.min(limit, off));
}

/**
 * Past this the branch is heading back down towards its own trunk, which draws
 * a hook rather than an arch. It bounds the limit the depth droop opens up.
 */
const DROOP_CEILING = 1.95;

/**
 * Depth at which the droop starts to open the limit. The trunk and the limbs
 * that come straight off it hold their reach; letting those fall flattens the
 * whole tree into a sprawl before the outer branches ever get their arch.
 */
const DROOP_ONSET = 1.2;

/** Radians per level of depth that children are fanned away from the trunk. */
const OUTWARD_BIAS = 0.05;

/** Cells of stroke width per unit of branch thickness, before the resolution
 * factor. Chosen so 2.3 thickness still draws two cells and 3.6 draws three. */
const WIDTH_PER_THICKNESS = 0.62;

/** No branch is drawn wider than this, whatever the canvas. */
const MAX_STROKE = 4;

/** How far from vertical the trunk itself may wander, in radians. */
const TRUNK_LIMIT = 0.22;

/**
 * How far a branch may swing from straight up, given how deep it is and how
 * far along its own length it has grown. Both loosen it: the trunk stands, each
 * generation is allowed further over than the last, and every branch opens up
 * as it extends. The second term is what puts the bend at the ends — a limb
 * leaves the trunk reaching outward and only falls away once it is out there,
 * instead of running flat from the fork.
 */
function skyLimit(species: Species, depth: number, progress = 0): number {
  const d = depth + progress;
  // The trunk is held close to vertical and each level out is freer than the
  // last, up to the species' own limit. Without the tight start, gravity walks
  // the trunk sideways across the canvas and the crown ends up beside its own
  // base rather than over it.
  const reach = Math.min(species.maxAngle, TRUNK_LIMIT + d * species.reachRate);
  const beyondOnset = Math.max(0, d - DROOP_ONSET);
  return Math.min(DROOP_CEILING, reach + beyondOnset * species.droopPerDepth);
}

function branchChar(dx: number, dy: number): string {
  if (Math.abs(dy) * 2 >= Math.abs(dx)) return "|";
  // Reserved for genuinely flat runs; used loosely it fills the canopy with
  // dashes that read as noise rather than as branches.
  if (Math.abs(dy) * 12 < Math.abs(dx)) return "-";
  return dx * dy > 0 ? "\\" : "/";
}

/**
 * Fills every cell between two points.
 *
 * Plotting only the endpoint of each growth step leaves gaps, because one step
 * can cross two columns horizontally — which is what turns a near-horizontal
 * branch into a dotted "- - -" line.
 */
function stroke(
  grid: Grid,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  ch: string,
  layer: Layer,
  width: number,
  wideChar: string,
  timeFrom: number,
  timeTo: number
) {
  const span = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  const steps = Math.max(1, Math.ceil(span));

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    // Interpolated so a single growth step still extends smoothly cell by cell.
    const time = timeFrom + (timeTo - timeFrom) * t;
    grid.put(x, y, ch, layer, time);

    // Widened to the left first, then alternating, which is how the original
    // two- and three-cell trunks were drawn; the loop only generalises it so a
    // finer canvas can carry a proportionally wider one.
    for (let w = 1; w < width; w++) {
      const offset = w % 2 === 1 ? -Math.ceil(w / 2) : Math.ceil(w / 2);
      grid.put(x + offset, y, wideChar, layer, time);
    }
  }
}

// ── Growth ─────────────────────────────────────────────────────────────────

interface Shoot {
  x: number;
  y: number;
  angle: number;
  length: number;
  thickness: number;
  depth: number;
  /** Simulation time at which this shoot starts extending. */
  t0: number;
  /** A side shoot: it leafs out at its tip and never forks or branches again. */
  terminal?: boolean;
}

interface Params {
  maxDepth: number;
  children: number;
  spread: number;
  gravity: number;
  hardness: number;
  temperature: number;
  lengthDecay: number;
  leafDensity: number;
  leafSpread: number;
  /**
   * Deepest fork that still keeps a leader, drawn per tree from the species'
   * own range. At 0 the trunk forks in two almost immediately and the tree is
   * all crown; at 2 a clear stem runs most of the way up with limbs off it.
   * Holding it constant was most of the reason every tree read the same.
   */
  leaderDepth: number;
}

// A depth-5 binary tree is 63 branches; this only catches pathological seeds.
const MAX_SHOOTS = 260;

/** Soft ceiling on canopy density — past this, shoots stop forking. */
const SOFT_CAP = 52;

interface Bounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface AsciiTree {
  seed: number;
  species: string;
  cols: number;
  rows: number;
  /** Flat grid of characters, row-major. */
  cells: string[];
  /** Per-cell appearance time, aligned with `cells`. */
  times: number[];
  bounds: Bounds;
  /** Simulation time at which the last cell appears. */
  duration: number;
  width: number;
  height: number;
  branches: number;
}

/**
 * Renders the tree as it stood at simulation time `upTo`.
 *
 * Always crops to the finished tree's bounding box, so a growing tree stays
 * anchored instead of shifting under itself frame by frame.
 */
export function renderTree(tree: AsciiTree, upTo = Infinity): string[] {
  const { cols, cells, times, bounds } = tree;
  const lines: string[] = [];

  for (let y = bounds.top; y <= bounds.bottom; y++) {
    let line = "";
    for (let x = bounds.left; x <= bounds.right; x++) {
      const i = y * cols + x;
      line += times[i] <= upTo ? cells[i] : " ";
    }
    lines.push(line.trimEnd());
  }

  return lines;
}

export interface TreeOptions {
  cols?: number;
  rows?: number;
}

/**
 * Canvas the trees are drawn on. Bigger means the same tree in more, smaller
 * characters — the page scales the glyphs to whatever the character count is,
 * so raising this shrinks the type without shrinking the tree.
 */
const CANVAS_COLS = 215;
const CANVAS_ROWS = 58;

/**
 * Rows a species' authored size is measured against. Deliberately fewer than
 * the canvas has: at parity the nominal tree is exactly canvas height, and
 * every taller-than-average one loses its crown to the top row.
 */
const SPECIES_ROWS = 31;

/** Canvas-to-species ratio the stroke widths and leaf counts were tuned at. */
const TUNED_SCALE = 34 / 26;

export function generateTree(seed: number, options: TreeOptions = {}): AsciiTree {
  const cols = options.cols ?? CANVAS_COLS;
  const rows = options.rows ?? CANVAS_ROWS;

  const rng = mulberry32(seed);
  const species = pick(rng, SPECIES);
  const grid = new Grid(cols, rows);

  // Species dimensions are authored against SPECIES_ROWS; scale them so a taller
  // canvas grows a bigger tree rather than the same tree with more air.
  const scale = rows / SPECIES_ROWS;

  // Resolution relative to the canvas the look was tuned on. The page sizes
  // glyphs so the tree fills its band whatever the character count, so a finer
  // canvas is the same tree drawn in smaller type — but only if the things
  // measured in whole cells keep up: stroke widths, and the leaf count needed
  // to fill a cluster whose area grows with the square.
  const detail = scale / TUNED_SCALE;

  const p: Params = {
    maxDepth: Math.round(range(rng, ...species.maxDepth)),
    children: Math.round(range(rng, ...species.children)),
    spread: range(rng, ...species.spread),
    // Both are applied per growth step, and a finer canvas gives a branch of
    // the same length more steps. Left alone, the extra steps would bend and
    // rattle the branch further than the same tree on a coarse canvas — the
    // shape would drift with the resolution instead of holding.
    gravity: range(rng, ...species.gravity) / detail,
    hardness: range(rng, ...species.hardness),
    temperature: range(rng, ...species.temperature) / Math.sqrt(detail),
    lengthDecay: range(rng, ...species.lengthDecay),
    leafDensity: range(rng, ...species.leafDensity) * detail * detail,
    leafSpread: range(rng, ...species.leafSpread) * scale,
    leaderDepth: Math.round(range(rng, ...species.leaderDepth)),
  };

  // Which way the whole tree leans, and how far it may. A birch or a willow
  // gets a wide range here, so the trunk starts off well away from vertical
  // rather than every tree standing to attention.
  const lean = range(rng, -species.trunkLean, species.trunkLean);
  // The tree's own vertical. Every clamp below is measured from it.
  const axis = UP + lean;
  let branches = 0;

  const queue: Shoot[] = [
    {
      x: cols / 2,
      y: rows - 1,
      angle: axis,
      length: range(rng, ...species.trunkLength) * scale,
      thickness: range(rng, ...species.trunkThickness),
      depth: 0,
      t0: 0,
    },
  ];

  // Breadth-first, so siblings extend during the same span of simulation time
  // — branches grow alongside each other rather than one subtree at a time.
  let duration = 0;

  while (queue.length > 0 && branches < MAX_SHOOTS) {
    const shoot = queue.shift()!;
    branches++;

    let { x, y, angle } = shoot;
    const steps = Math.max(1, Math.round(shoot.length));
    const layer: Layer = shoot.thickness >= 2 ? LAYER.trunk : LAYER.branch;

    let escaped = false;

    for (let i = 0; i < steps; i++) {
      // Gravity drags a branch toward the ground in whichever direction it
      // already leans; the effect compounds with depth and resists hardness.
      // Side shoots are stiff twigs — letting them droop sends the ones near
      // the base straight into the ground, leaving the trunk bare.
      if (!shoot.terminal) {
        // Weighted by how far over the branch already leans, which is where
        // the load on a real limb comes from: nothing at vertical, most at
        // horizontal. It is also what stops the flat runs a constant droop
        // produced — a branch reaching sideways now keeps turning instead of
        // holding one angle for its whole length, so the end curls down.
        const tilt = Math.abs(Math.sin(angle - UP));
        const droop =
          (p.gravity * (shoot.depth + 1) * (i / steps + 0.35) * (0.3 + tilt)) /
          p.hardness;
        angle += droop * Math.sign(Math.cos(angle) || 1);
      }

      // Directional instability — thin branches wander, thick ones hold course.
      angle += (rng() - 0.5) * (p.temperature / Math.max(0.45, shoot.thickness));
      // A side shoot keeps the angle it was given; only the forking skeleton is
      // held toward the sky. That is what lets a willow hang strands straight
      // down while its branches still reach upward.
      if (!shoot.terminal) {
        angle = clampToSky(angle, skyLimit(species, shoot.depth, i / steps), axis);
      }

      const nx = x + Math.cos(angle) * X_SCALE;
      const ny = y + Math.sin(angle);

      // A branch narrows along its own length, not just at each fork — without
      // the taper a thick trunk reads as an extruded pole.
      const t = shoot.thickness * (1 - 0.3 * (i / steps));
      // Continuous rather than the three tiers this used to step through: the
      // tiers, once multiplied up for the finer canvas, jumped straight from
      // one cell to three and a limb either vanished to a hairline or came out
      // as a slab. WIDTH_PER_THICKNESS is set so the old tier boundaries still
      // land on the same widths.
      const width = Math.max(
        1,
        Math.min(MAX_STROKE, Math.round(t * WIDTH_PER_THICKNESS * detail))
      );
      const ch = width > 1 ? species.trunkChar : branchChar(nx - x, ny - y);

      // One unit of simulation time per growth step.
      const tFrom = shoot.t0 + i;
      const tTo = shoot.t0 + i + 1;
      stroke(grid, x, y, nx, ny, ch, layer, width, species.trunkChar, tFrom, tTo);
      if (tTo > duration) duration = tTo;

      x = nx;
      y = ny;

      // Side shoots along the length, not just at the fork — without them the
      // long lower stretches of the trunk and first limbs stay bare.
      if (
        species.laterals > 0 &&
        !shoot.terminal &&
        shoot.depth <= species.lateralDepth &&
        shoot.depth >= (species.lateralMinDepth ?? 0) &&
        i > steps * species.lateralStart &&
        i < steps - 1 &&
        queue.length + branches < SOFT_CAP &&
        rng() < species.laterals / steps
      ) {
        // Longest near the base, shortest near the tip, so the shoots follow
        // the taper of the limb they grow from.
        const taper = 1 - i / steps;
        const length =
          (range(rng, 1.2, 2) + taper * species.lateralLength) * scale;

        const side = rng() < 0.5 ? -1 : 1;
        queue.push({
          x,
          y,
          angle: UP + side * range(rng, ...species.lateralAngle),
          length,
          thickness: shoot.thickness * range(rng, 0.3, 0.45),
          depth: shoot.depth + 1,
          // Starts where and when the trunk reached this point.
          t0: shoot.t0 + i + 1,
          terminal: true,
        });
      }

      // Stop a branch that has wandered off the canvas rather than letting it
      // seed a whole subtree nobody will see.
      if (x < -2 || x > cols + 2 || y < -2 || y > rows + 2) {
        escaped = true;
        break;
      }
    }

    if (escaped) continue;

    // Once the canopy is dense enough, stop forking and let everything leaf
    // out — beyond this the crown turns into a solid block of characters.
    const isTip =
      shoot.terminal ||
      shoot.depth >= p.maxDepth ||
      shoot.length < 1.2 ||
      shoot.thickness < 0.3 ||
      branches + queue.length >= SOFT_CAP;

    if (isTip) {
      const count = Math.round(p.leafDensity);
      const tipTime = shoot.t0 + steps;

      for (let i = 0; i < count; i++) {
        const a = rng() * Math.PI * 2;
        const r = Math.sqrt(rng()); // sqrt keeps the cluster evenly filled
        // Staggered so foliage unfurls after its twig arrives rather than
        // popping into place all at once.
        const time = tipTime + 1 + r * 2 + i * 0.12;
        grid.put(
          x + Math.cos(a) * r * p.leafSpread * X_SCALE,
          y + Math.sin(a) * r * p.leafSpread * 0.55,
          pick(rng, species.leaves),
          LAYER.leaf,
          time
        );
        if (time > duration) duration = time;
      }
      continue;
    }

    // Two children is the structural default; an occasional third near the
    // base fills the canopy, and dropping to one further out keeps the branch
    // count from doubling all the way down.
    let childCount = p.children;
    if (shoot.depth <= 1 && rng() < 0.35) childCount += 1;
    if (shoot.depth >= 4 && rng() < 0.18) childCount -= 1;
    childCount = Math.max(1, Math.min(4, childCount));

    // Branches on the left of the trunk are nudged further left and those on
    // the right further right, in proportion to how far out they already are.
    // Without it a fork as wide as these species use throws half its children
    // back across the trunk, and the crown fills in as a tangle rather than
    // spreading. Zero at the trunk itself, so the first fork stays even.
    const fromTrunk = (x - cols / 2) / (cols * 0.25);
    const outward =
      Math.max(-1, Math.min(1, fromTrunk)) * OUTWARD_BIAS * shoot.depth;

    // Near the base one child carries on as the leader, roughly in the
    // direction its parent was already going, and the others come off it as
    // limbs. Forking evenly all the way down instead splits the trunk into a
    // symmetric Y and the crown reads as two trees leaning apart.
    const leader =
      shoot.depth <= p.leaderDepth ? Math.floor(rng() * childCount) : -1;

    // Children are fanned left to right, but a tree that always queues its
    // leftmost child first grows lopsided: the density cap below turns whatever
    // is still waiting in the queue into leaves, so the side that is enqueued
    // first is the side that gets to keep forking. Mirroring the order on half
    // the forks takes the handedness out of it — that bias is why the trunk
    // used to sit right of the crown more often than left.
    const mirrored = rng() < 0.5;

    for (let k = 0; k < childCount; k++) {
      const c = mirrored ? childCount - 1 - k : k;
      // Fan children evenly across the spread, then jitter so pairs are not
      // perfect mirrors of each other.
      const t = childCount === 1 ? 0 : (c / (childCount - 1)) * 2 - 1;
      const fan = c === leader ? t * p.spread * 0.2 : t * p.spread;
      const offset = fan + (rng() - 0.5) * p.spread * 0.45;

      queue.push({
        x,
        y,
        // Judged at the child's own depth, so each generation is allowed to
        // sit further out and further down than the one that produced it.
        angle: clampToSky(
          angle + offset + (c === leader ? 0 : outward),
          skyLimit(species, shoot.depth + 1),
          axis
        ),
        // The leader keeps its parent's vigour; limbs are the ones that taper.
        length:
          shoot.length *
          (c === leader ? 0.75 : p.lengthDecay) *
          range(rng, 0.82, 1.18),
        thickness:
          shoot.thickness * (c === leader ? range(rng, 0.78, 0.9) : range(rng, 0.55, 0.7)),
        depth: shoot.depth + 1,
        // Children pick up exactly where the parent stopped.
        t0: shoot.t0 + steps,
      });
    }
  }

  const bounds = grid.bounds();

  return {
    seed,
    species: species.label,
    cols,
    rows,
    cells: grid.cells,
    times: grid.times,
    bounds,
    duration,
    width: bounds.right - bounds.left + 1,
    height: bounds.bottom - bounds.top + 1,
    branches,
  };
}

/** A fresh seed for the next tree. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffff);
}
