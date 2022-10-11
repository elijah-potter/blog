import { BODY_LINE_WIDTH } from "./pages/nbody/index";
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

    if (body.position[0] < -radius - BODY_LINE_WIDTH) {
      position[0] = position[0] + radius + BODY_LINE_WIDTH + width;
    } else if (body.position[0] > width + radius + BODY_LINE_WIDTH) {
      position[0] = position[0] - radius - BODY_LINE_WIDTH - width;
    }

    if (body.position[1] < -radius - BODY_LINE_WIDTH) {
      position[1] = position[1] + radius + BODY_LINE_WIDTH + height;
    } else if (body.position[1] > height + radius + BODY_LINE_WIDTH) {
      position[1] = position[1] - radius - BODY_LINE_WIDTH - height;
    }

    computed.push({
      position,
      mass: body.mass,
      velocity,
    });
  }

  return computed;
}
