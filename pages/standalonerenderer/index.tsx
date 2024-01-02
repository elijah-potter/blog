import { useEffect } from "react";

export default function index() {
  useEffect(() => {
    // @ts-expect-error Loaded from macroquad
    load("rast.wasm");
  }, []);

  return (
    <>
      <canvas
        id="glcanvas"
        tabIndex={1}
        className="absolute left-0 top-0 w-screen h-screen"
      ></canvas>
    </>
  );
}
