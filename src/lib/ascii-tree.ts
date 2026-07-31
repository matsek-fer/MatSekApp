/**
 * Procedural ASCII trees.
 *
 * Structure follows PyBonsai-style fractal branching, but growth is simulated
 * step by step so gravity and "temperature" (directional instability) can bend
 * a branch as it extends — see copilot-instructions/ascii_physics_tree_system.md.
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
  /** Emit side shoots in mirrored pairs — the giveaway shape of a conifer. */
  symmetricLaterals?: boolean;
  /**
   * How far a side shoot points from straight up. Past PI/2 it slopes
   * downward, which is what draws a conifer's outline as a cone rather than
   * an upturned fan.
   */
  lateralAngle: [number, number];
  /** Deepest branch that still puts out side shoots. */
  lateralDepth: number;
  /** Shallowest branch that puts them out — keeps a willow's strands on the
   * outer limbs instead of hanging them straight off the trunk. */
  lateralMinDepth?: number;
  /** Character used once a branch is thick enough to read as a trunk. */
  trunkChar: string;
}

const SPECIES: readonly Species[] = [
  {
    id: "oak",
    label: "Hrast",
    trunkLength: [6, 8],
    trunkThickness: [3.8, 4.8],
    maxDepth: [4, 5],
    children: [2, 2],
    spread: [0.55, 0.8],
    maxAngle: 1.2,
    gravity: [0.012, 0.025],
    hardness: [2.2, 3.2],
    temperature: [0.1, 0.22],
    lengthDecay: [0.62, 0.72],
    leaves: ["&", "%", "@", "*"],
    leafDensity: [7, 11],
    leafSpread: [2.2, 3.0],
    laterals: 1.5,
    lateralLength: 3,
    lateralAngle: [0.7, 1.0],
    lateralDepth: 1,
    trunkChar: "#",
  },
  {
    id: "birch",
    label: "Breza",
    trunkLength: [8, 10],
    trunkThickness: [2.4, 3.0],
    maxDepth: [4, 5],
    children: [2, 2],
    spread: [0.4, 0.56],
    maxAngle: 1.12,
    gravity: [-0.02, 0.008],
    hardness: [3.5, 5],
    temperature: [0.06, 0.13],
    lengthDecay: [0.58, 0.68],
    leaves: ["'", "`", "*", "."],
    leafDensity: [5, 8],
    leafSpread: [1.6, 2.4],
    laterals: 1.5,
    lateralLength: 3,
    lateralAngle: [0.7, 1.0],
    lateralDepth: 1,
    trunkChar: "|",
  },
  {
    id: "conifer",
    label: "Crnogorica",
    trunkLength: [13, 16],
    trunkThickness: [2.2, 2.8],
    maxDepth: [0, 0],
    children: [2, 2],
    spread: [0.5, 0.7],
    maxAngle: 2.0,
    gravity: [0.05, 0.09],
    hardness: [2.5, 3.5],
    temperature: [0.02, 0.05],
    lengthDecay: [0.48, 0.58],
    leaves: ["^", "*", "'"],
    leafDensity: [3, 5],
    leafSpread: [0.9, 1.4],
    laterals: 15,
    lateralLength: 6,
    lateralAngle: [1.72, 1.95],
    lateralDepth: 0,
    symmetricLaterals: true,
    trunkChar: "|",
  },
  {
    id: "bonsai",
    label: "Bonsai",
    trunkLength: [4, 6],
    trunkThickness: [3.2, 4.2],
    maxDepth: [4, 5],
    children: [2, 2],
    spread: [0.6, 0.9],
    maxAngle: 1.3,
    gravity: [0.02, 0.05],
    hardness: [0.8, 1.4],
    temperature: [0.24, 0.42],
    lengthDecay: [0.68, 0.78],
    leaves: ["&", "*", "o", "@"],
    leafDensity: [7, 11],
    leafSpread: [1.9, 2.7],
    laterals: 1,
    lateralLength: 2.5,
    lateralAngle: [0.7, 1.0],
    lateralDepth: 1,
    trunkChar: "#",
  },
  {
    id: "shrub",
    label: "Grm",
    trunkLength: [3, 4],
    trunkThickness: [1.8, 2.4],
    maxDepth: [3, 4],
    children: [2, 3],
    spread: [0.6, 0.9],
    maxAngle: 1.4,
    gravity: [0.0, 0.03],
    hardness: [1.4, 2.2],
    temperature: [0.16, 0.3],
    lengthDecay: [0.74, 0.82],
    leaves: ["*", "o", "&", "."],
    leafDensity: [6, 10],
    leafSpread: [1.6, 2.4],
    laterals: 0,
    lateralLength: 2,
    lateralAngle: [0.7, 1.0],
    lateralDepth: 1,
    trunkChar: "|",
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
 * Keeps a direction within `limit` radians of straight up.
 *
 * Gravity and noise otherwise accumulate until branches run sideways or dive
 * into the ground, which reads as scribble rather than as a tree.
 */
function clampToSky(angle: number, limit: number): number {
  const off = angle - UP;
  return UP + Math.max(-limit, Math.min(limit, off));
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
    if (width >= 2) grid.put(x - 1, y, wideChar, layer, time);
    if (width >= 3) grid.put(x + 1, y, wideChar, layer, time);
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

export function generateTree(seed: number, options: TreeOptions = {}): AsciiTree {
  const cols = options.cols ?? 110;
  const rows = options.rows ?? 34;

  const rng = mulberry32(seed);
  const species = pick(rng, SPECIES);
  const grid = new Grid(cols, rows);

  // Species dimensions are authored against a 26-row canvas; scale them so a
  // taller panel grows a bigger tree rather than the same tree with more air.
  const scale = rows / 26;

  const p: Params = {
    maxDepth: Math.round(range(rng, ...species.maxDepth)),
    children: Math.round(range(rng, ...species.children)),
    spread: range(rng, ...species.spread),
    gravity: range(rng, ...species.gravity),
    hardness: range(rng, ...species.hardness),
    temperature: range(rng, ...species.temperature),
    lengthDecay: range(rng, ...species.lengthDecay),
    leafDensity: range(rng, ...species.leafDensity),
    leafSpread: range(rng, ...species.leafSpread) * scale,
  };

  // A slight lean keeps trees from all looking like the same mirror image.
  const lean = range(rng, -0.16, 0.16);
  let branches = 0;

  const queue: Shoot[] = [
    {
      x: cols / 2,
      y: rows - 1,
      angle: -Math.PI / 2 + lean,
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
        const droop =
          (p.gravity * (shoot.depth + 1) * (i / steps + 0.35)) / p.hardness;
        angle += droop * Math.sign(Math.cos(angle) || 1);
      }

      // Directional instability — thin branches wander, thick ones hold course.
      angle += (rng() - 0.5) * (p.temperature / Math.max(0.45, shoot.thickness));
      // A side shoot keeps the angle it was given; only the forking skeleton is
      // held toward the sky. That is what lets a willow hang strands straight
      // down while its branches still reach upward.
      if (!shoot.terminal) angle = clampToSky(angle, species.maxAngle);

      const nx = x + Math.cos(angle) * X_SCALE;
      const ny = y + Math.sin(angle);

      // A branch narrows along its own length, not just at each fork — without
      // the taper a thick trunk reads as an extruded pole.
      const t = shoot.thickness * (1 - 0.3 * (i / steps));
      const width = t >= 3.6 ? 3 : t >= 2.3 ? 2 : 1;
      const ch = width > 1 ? species.trunkChar : branchChar(nx - x, ny - y);

      // One unit of simulation time per growth step.
      const tFrom = shoot.t0 + i;
      const tTo = shoot.t0 + i + 1;
      stroke(grid, x, y, nx, ny, ch, layer, width, species.trunkChar, tFrom, tTo);
      if (tTo > duration) duration = tTo;

      x = nx;
      y = ny;

      // Side shoots along the length, not just at the fork. A conifer is
      // mostly one long trunk, so without these its lower half stays bare.
      if (
        species.laterals > 0 &&
        !shoot.terminal &&
        shoot.depth <= species.lateralDepth &&
        shoot.depth >= (species.lateralMinDepth ?? 0) &&
        i > steps * 0.12 &&
        i < steps - 1 &&
        queue.length + branches < SOFT_CAP &&
        rng() < species.laterals / steps
      ) {
        // Longest near the base, shortest near the tip — that taper is what
        // gives a conifer its cone rather than a column of even stubs.
        const taper = 1 - i / steps;
        const length =
          (range(rng, 1.2, 2) + taper * species.lateralLength) * scale;

        // A conifer's whorls come off both sides at the same height; the
        // symmetry is most of what makes the silhouette read as a conifer.
        // Broadleaves put out one shoot at a time instead.
        const sides = species.symmetricLaterals ? [-1, 1] : [rng() < 0.5 ? -1 : 1];

        for (const side of sides) {
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

    for (let c = 0; c < childCount; c++) {
      // Fan children evenly across the spread, then jitter so pairs are not
      // perfect mirrors of each other.
      const t = childCount === 1 ? 0 : (c / (childCount - 1)) * 2 - 1;
      const offset = t * p.spread + (rng() - 0.5) * p.spread * 0.45;

      queue.push({
        x,
        y,
        angle: clampToSky(angle + offset, species.maxAngle),
        length: shoot.length * p.lengthDecay * range(rng, 0.82, 1.18),
        thickness: shoot.thickness * range(rng, 0.58, 0.72),
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
