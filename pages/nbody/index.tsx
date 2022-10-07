import { cloneDeep } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { addV, distance, mulS, normalize, subV, Vector } from "../../vector";

const G = 0.01;

type Body = {
  mass: number;
  position: [number, number];
  velocity: [number, number];
};

function radiusFromMass(mass: number): number {
  return Math.sqrt(mass / Math.PI);
}

function renderBodies(ctx: CanvasRenderingContext2D, bodies: Body[]) {
  ctx.fillStyle = "#262626";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;

  for (const body of bodies) {
    ctx.beginPath();
    ctx.arc(
      body.position[0],
      body.position[1],
      radiusFromMass(body.mass),
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.stroke();
  }
}

export default function index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parent = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const [bodies, setBodies] = useState<Body[]>(() => {
    const bodies = new Array<Body>();

    for (let i = 0; i < 20; i++) {
      bodies.push({
        mass: Math.random() * 50,
        position: [Math.random() * 500, Math.random() * 500],
        velocity: [0, 0], //[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
      });
    }

    bodies.push({
      mass: 500,
      position: [500, 500],
      velocity: [0, 0],
    });

    return bodies;
  });

  const calculateBodies = useCallback(() => {
    const computed = [];

    for (const body of bodies) {
      let force: Vector = [0, 0];

      for (const otherBody of bodies) {
        const d = distance(body.position, otherBody.position);

        if (d < radiusFromMass(body.mass) + radiusFromMass(otherBody.mass)) {
          continue;
        }

        const attraction = ((body.mass * otherBody.mass) / (d * d)) * G;

        const difference = subV(otherBody.position, body.position);

        const normalizedDifference = normalize(difference);

        force = addV(force, mulS(normalizedDifference, attraction));

        if (d < radiusFromMass(body.mass) + radiusFromMass(otherBody.mass)) {
          console.log({
            attraction,
            normalizedDifference,
            position: body.position,
          });
        }
      }

      let velocity = addV(body.velocity, force);

      const radius = radiusFromMass(body.mass);

      if (body.position[0] < radius || body.position[0] > width - radius) {
        velocity = [velocity[0] * -1, velocity[1]];
      }

      if (body.position[1] < radius || body.position[1] > height - radius) {
        velocity = [velocity[0], velocity[1] * -1];
      }

      computed.push({
        position: addV(body.position, velocity),
        mass: body.mass,
        velocity,
      });
    }

    setBodies(computed);
  }, [bodies, width, height]);

  useEffect(() => {
    const onResize = () => {
      const parentDiv = parent.current;
      if (parentDiv != null) {
        setWidth(parentDiv.offsetWidth);
        setHeight(parentDiv.offsetHeight);
      }
    };

    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas == null) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (ctx == null) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    renderBodies(ctx, bodies);
    window.requestAnimationFrame(calculateBodies);
  }, [canvasRef, width, height, bodies]);

  return (
    <div ref={parent}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
}
