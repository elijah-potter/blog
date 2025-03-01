export type Vector = [number, number];

export function distanceSquared(
  [ax, ay]: [number, number],
  [bx, by]: [number, number]
): number {
  const a = ax - bx;
  const b = ay - by;

  return a * a + b * b;
}

export function distance(a: Vector, b: Vector): number {
  return Math.sqrt(distanceSquared(a, b));
}

export function normalize(v: Vector): [number, number] {
  const d = distance([0, 0], v);
  return [v[0] / d, v[1] / d];
}

export function length(a: Vector): number {
  return distance([0, 0], a);
}

export function addV(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1]];
}

export function subV(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1]];
}

export function subS(vector: Vector, scalar: number): Vector {
  return [vector[0] - scalar, vector[1] - scalar];
}

export function mulV(a: Vector, b: Vector): Vector {
  return [a[0] * b[0], a[1] * b[1]];
}

export function addS(a: Vector, s: number): Vector {
  return [a[0] + s, a[1] + s];
}

export function mulS(a: Vector, s: number): Vector {
  return [a[0] * s, a[1] * s];
}

export function divS(a: Vector, s: number): Vector {
  return [a[0] / s, a[1] / s];
}

export function splat(scalar: number): Vector {
  return [scalar, scalar];
}
