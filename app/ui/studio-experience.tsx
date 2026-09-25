"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

export function StudioExperience() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [showIntro, setShowIntro] = useState(false);
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const x = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.45 });
  const y = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.45 });

  useEffect(() => {
    const introKey = "uchit-intro-seen";
    try {
      if (window.sessionStorage.getItem(introKey)) return;
      window.sessionStorage.setItem(introKey, "true");
    } catch {
      // Keep the intro available when browser storage is restricted.
    }
    let timer = 0;
    const frame = window.requestAnimationFrame(() => {
      setShowIntro(true);
      timer = window.setTimeout(() => setShowIntro(false), 540);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

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
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest<HTMLElement>("[data-cursor], a, button");
      if (!interactive) {
        setCursorLabel("");
        return;
      }
      setCursorLabel(interactive.dataset.cursor || (interactive.tagName === "BUTTON" ? "OPEN" : "VIEW"));
    };
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) setCursorLabel("");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    return () => {
      pointerQuery.removeEventListener("change", updateEnabled);
      motionQuery.removeEventListener("change", updateEnabled);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, [pointerX, pointerY]);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="studio-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-4%", transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
            aria-hidden="true"
          >
            <motion.span
              className="studio-intro-brand"
              initial={{ opacity: 0, y: 12, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.24em" }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              UCHIT<span>.WEB</span>
            </motion.span>
            <div className="studio-intro-track"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }} /></div>
            <span className="studio-intro-caption">DIGITAL EXPERIENCES, BUILT WITH PURPOSE</span>
          </motion.div>
        )}
      </AnimatePresence>
      {cursorEnabled && (
        <motion.div
          className={`studio-cursor${cursorLabel ? " studio-cursor-active" : ""}`}
          style={{ x, y }}
          aria-hidden="true"
        >
          <span className="studio-cursor-point" />
        </motion.div>
      )}
    </>
  );
}
