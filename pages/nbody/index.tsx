import NBodySimulation from "../../components/NBodySimulation";

export default function ({ dark }: { dark: boolean }) {
  return (
    <NBodySimulation
      dark={dark}
      initialBodies={[]}
      interactive={true}
      zIndex={-100}
    />
  );
}
