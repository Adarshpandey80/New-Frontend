import { motion } from "framer-motion";

export default function ChartCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="relative bg-gray-900 from-[#0f172a] to-[#020617] rounded-xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-white">
        <h3 className="text-cyan-300 font-semibold tracking-wide text-sm">
          {title}
        </h3>
      </div>

      {/* Chart container */}
      <div className="h-150  ">
        {children}
      </div>
    </motion.div>
  );
}
