import { clone, cloneDeep, rearg } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addV,
  distance,
  distanceSquared,
  mulS,
  mulV,
  normalize,
  subV,
  Vector,
} from "../../vector";
import { MouseEvent } from "react";

const G = 0.1;
const BODY_LINE_WIDTH = 2;
const INITIAL_VELOCITY_COEFF = 0.05;

type DrawableBody = {
  mass: number;
  position: Vector;
};

type Body = DrawableBody & {
  velocity: Vector;
};

function radiusFromMass(mass: number): number {
  return Math.sqrt(mass / Math.PI);
}

function positionFromMouseEvent(e: MouseEvent<HTMLCanvasElement>): Vector {
  const rect = e.currentTarget.getBoundingClientRect();
  return [e.clientX - rect.left, e.clientY - rect.top];
}

function primaryColor(dark: boolean) {
  return dark ? "#262626" : "#fff";
}

function secondaryColor(dark: boolean) {
  return dark ? "#fff" : "#262626";
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  body: DrawableBody,
  dark: boolean
) {
  ctx.fillStyle = primaryColor(dark);
  ctx.strokeStyle = secondaryColor(dark);
  ctx.lineWidth = BODY_LINE_WIDTH;

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

function renderBodies(
  ctx: CanvasRenderingContext2D,
  bodies: DrawableBody[],
  dark: boolean
) {
  for (const body of bodies) {
    drawBody(ctx, body, dark);
  }
}

type ActiveMode =
  | { mode: "intro" }
  | {
      mode: "simulate";
    }
  | {
      mode: "createBody";
      dragStart: Vector;
      dragEnd: Vector;
      mass: number;
    };

export default function index({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const [activeMode, setActiveMode] = useState<ActiveMode>({
    mode: "intro",
  });

  const [bodies, setBodies] = useState<Body[]>([]);

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

    setBodies(computed);
  }, [bodies, width, height]);

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const newMouse = positionFromMouseEvent(e);

      if (activeMode.mode === "simulate" || activeMode.mode === "intro") {
        setActiveMode({
          mode: "createBody",
          dragStart: newMouse,
          dragEnd: newMouse,
          mass: Math.pow(1000, Math.random()),
        });
      }
    },
    [activeMode]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const newMouse = positionFromMouseEvent(e);

      if (activeMode.mode === "createBody") {
        setActiveMode({
          ...activeMode,
          dragEnd: newMouse,
        });
      }
    },
    [activeMode]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const newMouse = positionFromMouseEvent(e);
      if (activeMode.mode === "createBody") {
        const newBodies = clone(bodies);

        const targetVelocity = mulS(
          subV(activeMode.dragStart, activeMode.dragEnd),
          INITIAL_VELOCITY_COEFF
        );

        const newBody = {
          position: activeMode.dragEnd,
          mass: activeMode.mass,
          velocity: targetVelocity,
        };

        newBodies.push(newBody);

        setBodies(newBodies);
        setActiveMode({ mode: "simulate" });
      }
    },
    [bodies, activeMode]
  );

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
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

    renderBodies(ctx, bodies, dark);

    if (activeMode.mode === "intro") {
      ctx.fillStyle = secondaryColor(dark);
      ctx.textBaseline = "middle";
      ctx.font = "30px charter";
      ctx.textAlign = "center";
      ctx.fillText("Click and Drag", width / 2, height / 2);
    }
    if (activeMode.mode === "simulate") {
      window.requestAnimationFrame(calculateBodies);
    } else if (activeMode.mode === "createBody") {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(activeMode.dragStart[0], activeMode.dragStart[1]);
      ctx.lineTo(activeMode.dragEnd[0], activeMode.dragEnd[1]);
      ctx.stroke();

      drawBody(
        ctx,
        {
          position: activeMode.dragEnd,
          mass: activeMode.mass,
        },
        dark
      );
    }
  }, [canvasRef, width, height, bodies, activeMode, dark]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={onMouseDown}
      onPointerMove={onMouseMove}
      onPointerUp={onMouseUp}
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        zIndex: "-100",
      }}
    />
  );
}
