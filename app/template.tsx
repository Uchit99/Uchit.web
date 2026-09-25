"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="page-transition-content"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
    >
      {children}
      {!reduceMotion && (
        <div className="site-tear-transition" aria-hidden="true">
          <motion.div
            className="site-tear-panel site-tear-panel-left"
            initial={{ x: "0%" }}
            animate={{ x: "-105%" }}
            transition={{ duration: 0.92, delay: 0.22, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="site-tear-word">UCHIT</span>
          </motion.div>
          <motion.div
            className="site-tear-panel site-tear-panel-right"
            initial={{ x: "0%" }}
            animate={{ x: "105%" }}
            transition={{ duration: 0.92, delay: 0.22, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="site-tear-word site-tear-word-web">WEB</span>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
