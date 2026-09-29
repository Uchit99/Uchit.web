"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function StudioExperience() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const x = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.45 });
  const y = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.45 });

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateEnabled = () => setCursorEnabled(pointerQuery.matches && !motionQuery.matches);
    updateEnabled();

    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest("a, button, [role='button']");
      setCursorLabel(interactive ? interactive.getAttribute("data-cursor") || "OPEN" : "");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    pointerQuery.addEventListener("change", updateEnabled);
    motionQuery.addEventListener("change", updateEnabled);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      pointerQuery.removeEventListener("change", updateEnabled);
      motionQuery.removeEventListener("change", updateEnabled);
    };
  }, [pointerX, pointerY]);

  return (
    <>
    {cursorEnabled && (
    <motion.div
      className={`studio-cursor${cursorLabel ? " studio-cursor-active" : ""}`}
      style={{ x, y }}
      aria-hidden="true"
    >
      {cursorLabel && <span className="studio-cursor-label">{cursorLabel}</span>}
    </motion.div>
    )}
    </>
  );
}
