import React from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return <div className={styles.bar}>{children}</div>;
}
