import { clone, cloneDeep, rearg } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DrawableBody,
  Body,
  radiusFromMass,
  calculateStep,
} from "../../simulation";
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

export const BODY_LINE_WIDTH = 2;
export const INITIAL_VELOCITY_COEFF = 0.05;
export const UI_BAR_THICKNESS = 10;
export const UI_BAR_LINE_WIDTH = 2;

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

function clamp(n: number, min: number, max: number): number {
  if (n < min) {
    return min;
  } else if (n > max) {
    return max;
  } else {
    return n;
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
    };

export default function index({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [stepsPerFrame, setStepsPerFrame] = useState(1);
  const [targetMass, setTargetMass] = useState(10);
  const [mass, setMass] = useState(10);
  const [randomizeMass, setRandomizeMass] = useState(true);
  const [targetG, setTargetG] = useState(0.1);
  const [g, setG] = useState(0.1);

  const [activeMode, setActiveMode] = useState<ActiveMode>({
    mode: "intro",
  });

  const [bodies, setBodies] = useState<Body[]>([]);

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const newMouse = positionFromMouseEvent(e);

      if (activeMode.mode === "simulate" || activeMode.mode === "intro") {
        setActiveMode({
          mode: "createBody",
          dragStart: newMouse,
          dragEnd: newMouse,
        });
      }
    },
    [activeMode, mass]
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
          mass,
          velocity: targetVelocity,
        };

        newBodies.push(newBody);

        setBodies(newBodies);
        setActiveMode({ mode: "simulate" });
        if (randomizeMass) {
          setTargetMass(Math.pow(1000, Math.random()));
        }
      }
    },
    [bodies, activeMode, mass, randomizeMass]
  );

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    onResize();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setStepsPerFrame(10);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    const onKeyUp = (e: KeyboardEvent) => {
      console.log(e.code);
      if (e.code === "Space") {
        setStepsPerFrame(1);
      } else if (e.code === "ArrowDown") {
        setTargetG(targetG - 0.1);
      } else if (e.code === "ArrowUp") {
        setTargetG(targetG + 0.1);
      } else if (e.code === "BracketRight") {
        setTargetMass(clamp(targetMass + 30, 10, 10000));
      } else if (e.code === "BracketLeft") {
        setTargetMass(clamp(targetMass - 30, 10, 10000));
      } else if (e.shiftKey && e.code === "KeyR") {
        setRandomizeMass(!randomizeMass);
      } else if (e.code === "KeyR") {
        setTargetMass(Math.pow(1000, Math.random()));
      }
    };

    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [targetG, targetMass, randomizeMass]);

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

      if (width > 600 && height > 800) {
        ctx.fillText("Space → Increase Speed", width / 2, (height / 4) * 3);
        ctx.fillText("R → Randomize Mass", width / 2, (height / 4) * 3 + 40);
        ctx.fillText(
          "Shift + R → Automatically Randomize Mass",
          width / 2,
          (height / 4) * 3 + 80
        );
        ctx.fillText("[ / ] → Adjust Mass", width / 2, (height / 4) * 3 + 120);
        ctx.fillText(
          "Up / Down → Adjust Gravity",
          width / 2,
          (height / 4) * 3 + 160
        );
      }
    }

    if (activeMode.mode === "simulate") {
      window.requestAnimationFrame(() => {
        let computedBodies = bodies;
        for (let i = 0; i < stepsPerFrame; i++) {
          computedBodies = calculateStep(computedBodies, g, width, height);
        }

        setMass(mass + 0.25 * (targetMass - mass));
        setG(g + 0.25 * (targetG - g));
        setBodies(computedBodies);
      });
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
          mass,
        },
        dark
      );
    }

    // Draw UI Bars
    ctx.fillStyle = secondaryColor(dark);
    ctx.fillRect(
      width / 2,
      height - UI_BAR_THICKNESS - UI_BAR_LINE_WIDTH,
      g * 100,
      UI_BAR_THICKNESS
    );
    ctx.fillStyle = randomizeMass ? primaryColor(dark) : secondaryColor(dark);
    ctx.strokeStyle = randomizeMass ? secondaryColor(dark) : primaryColor(dark);
    ctx.lineWidth = 2;
    ctx.fillRect(UI_BAR_LINE_WIDTH, height / 2, UI_BAR_THICKNESS, mass);
    ctx.strokeRect(UI_BAR_LINE_WIDTH, height / 2, UI_BAR_THICKNESS, mass);
  }, [
    canvasRef,
    width,
    height,
    bodies,
    activeMode,
    dark,
    stepsPerFrame,
    g,
    targetG,
    mass,
    randomizeMass,
  ]);

  return (
    <div>
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
    </div>
  );
}
