import { motion } from "framer-motion";
import { useRef } from "react";

export default function ChartCard({ title, children, action }) {
  const ref = useRef();

  return (
    <motion.div
      ref={ref}
      className="relative w-full min-h-[280px] overflow-hidden
                 rounded-2xl p-4 bg-gradient-to-br from-[#0f172a] to-[#020617]
                 border border-white/10 shadow-xl"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {action}
      </div>

      <div className="w-full h-[220px] flex justify-center items-center overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
