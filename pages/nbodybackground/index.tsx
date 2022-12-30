import { useMemo } from "react";
import NBodySimulation from "../../components/NBodySimulation";
import { Vector } from "../../src/vector";
import { Body } from "../../src/simulation";

export default function ({ dark }: { dark: boolean }) {
  const initialBodies = useMemo(() => {
    const bodies: Body[] = [];

    for (let i = 0; i < 100; i++) {
      const velocity: Vector = [0, 0];
      const position: Vector = [Math.random() * 1920, Math.random() * 1080];

      bodies.push({
        mass: Math.pow(1000, Math.random()),
        position,
        velocity,
      });
    }

    return bodies;
  }, []);

  return (
    <NBodySimulation
      dark={dark}
      initialBodies={initialBodies}
      interactive={false}
      zIndex={100}
    />
  );
}
