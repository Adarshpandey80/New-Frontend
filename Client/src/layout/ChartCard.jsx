import { motion } from "framer-motion";

export default function ChartCard({ title, action, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="relative bg-gray-900 rounded-xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 shrink-0">
        <h3 className="text-cyan-300 font-semibold tracking-wide text-sm">
          {title}
        </h3>
        {action}
      </div>

      {/* Chart container */}
      <div className="flex-1 min-h-0 p-3">
        {children}
      </div>
    </motion.div>
  );
}
