import { useEffect, useState } from "react";

/** Whether the window is currently "mobile" size.
 * Automatically updates when the window is resized.*/
export default function useMobile(): boolean {
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    const update = () => setMobile(isMobile());

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return mobile;
}

function isMobile(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < 768;
}
