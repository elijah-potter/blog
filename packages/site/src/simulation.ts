import { addV, distance, mulS, normalize, subV, Vector } from "./vector";

export type DrawableBody = {
  mass: number;
  position: Vector;
};

export type Body = DrawableBody & {
  velocity: Vector;
};

export function radiusFromMass(mass: number): number {
  return Math.sqrt(mass / Math.PI);
}

export function calculateStep(
  bodies: Body[],
  g: number,
  width: number,
  height: number
) {
  const computed = [];

  for (const body of bodies) {
    let force: Vector = [0, 0];

    for (const otherBody of bodies) {
      const d = distance(body.position, otherBody.position);

      if (d < radiusFromMass(body.mass) + radiusFromMass(otherBody.mass)) {
        continue;
      }

      const attraction = ((body.mass * otherBody.mass) / (d * d)) * g;

      const difference = subV(otherBody.position, body.position);

      const normalizedDifference = normalize(difference);

      force = addV(force, mulS(normalizedDifference, attraction));
    }

    const velocity = addV(body.velocity, mulS(force, 1 / body.mass));

    const radius = radiusFromMass(body.mass);

    const position = addV(body.position, velocity);

    if (body.position[0] < -radius) {
      position[0] = position[0] + radius + width;
    } else if (body.position[0] > width + radius) {
      position[0] = position[0] - radius - width;
    }

    if (body.position[1] < -radius) {
      position[1] = position[1] + radius + height;
    } else if (body.position[1] > height + radius) {
      position[1] = position[1] - radius - height;
    }

    computed.push({
      position,
      mass: body.mass,
      velocity,
    });
  }

  return computed;
}
