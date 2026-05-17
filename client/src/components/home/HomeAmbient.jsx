import { motion } from "motion/react";

/** Ultra-soft fixed wash — keeps hero readable without loud blobs. */
export default function HomeAmbient() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-14 z-0 h-[min(85vh,680px)] overflow-hidden lg:top-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-5%,rgba(255,255,255,0.9),transparent_55%)]" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_75%_15%,rgba(143,216,255,0.12),transparent_58%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_12%_30%,rgba(199,182,255,0.07),transparent_52%)]" />
    </motion.div>
  );
}
