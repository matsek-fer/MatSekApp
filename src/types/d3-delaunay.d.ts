declare module "d3-delaunay" {
  export class Delaunay {
    constructor(points: ArrayLike<number>);

    static from(
      points: ArrayLike<[number, number]>,
      fx?: (d: [number, number], i: number) => number,
      fy?: (d: [number, number], i: number) => number
    ): Delaunay;

    voronoi(bounds: [number, number, number, number]): Voronoi;
  }

  export class Voronoi {
    cellPolygon(i: number): Array<[number, number]> | null;
  }
}
