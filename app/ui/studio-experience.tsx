"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorTrailMark = {
  id: number;
  x: number;
  y: number;
};

export function StudioExperience() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const [trail, setTrail] = useState<CursorTrailMark[]>([]);
  const nextTrailTime = useRef(0);
  const nextTrailId = useRef(0);
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const x = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.45 });
  const y = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.45 });

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateEnabled = () => setCursorEnabled(pointerQuery.matches && !motionQuery.matches);
    updateEnabled();
    pointerQuery.addEventListener("change", updateEnabled);
    motionQuery.addEventListener("change", updateEnabled);

    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);

      const now = performance.now();
      if (now < nextTrailTime.current) return;
      nextTrailTime.current = now + 100;
      setTrail((marks) => [
        ...marks.slice(-6),
        { id: nextTrailId.current++, x: event.clientX, y: event.clientY },
      ]);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      pointerQuery.removeEventListener("change", updateEnabled);
      motionQuery.removeEventListener("change", updateEnabled);
      window.removeEventListener("pointermove", onMove);
    };
  }, [pointerX, pointerY]);

  useEffect(() => {
    if (cursorEnabled) return;
    setTrail([]);
  }, [cursorEnabled]);

  return cursorEnabled ? (
    <>
      {trail.map((mark) => (
        <motion.span
          key={mark.id}
          className="studio-cursor-trail"
          style={{ left: mark.x, top: mark.y }}
          initial={{ opacity: 0.62, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 0.82, y: -15 }}
          transition={{ duration: 0.82, ease: "easeOut" }}
          onAnimationComplete={() => setTrail((marks) => marks.filter(({ id }) => id !== mark.id))}
          aria-hidden="true"
        >
          UCHIT<span>.WEB</span>
        </motion.span>
      ))}
      <motion.div className="studio-cursor" style={{ x, y }} aria-hidden="true">
        <span className="studio-cursor-glyph">U</span>
      </motion.div>
    </>
  ) : null;
}
