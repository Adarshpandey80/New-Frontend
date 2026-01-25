import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/kpi`;

export default function KPISection() {
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    axios.get(api).then(res => setKpi(res.data));
  }, []);

  if (!kpi) return null;

  const cards = [
    { title: "Total Records", value: kpi.totalRecords },
    { title: "Avg Intensity", value: kpi.avgIntensity.toFixed(2) },
    { title: "Avg Likelihood", value: kpi.avgLikelihood.toFixed(2) },
    { title: "Avg Relevance", value: kpi.avgRelevance.toFixed(2) },
    { title: "Top Sector", value: kpi.topSector },
    { title: "Top Country", value: kpi.topCountry },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-6">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          whileHover={{ scale: 1.08 }}
          className="relative bg-gray-900 from-[#0f172a] to-[#020617]
                     border border-white/10 rounded-xl p-4 shadow-xl
                     hover:shadow-[0_25px_60px_rgba(56,189,248,0.45)]"
        >
          <p className="text-xs text-gray-400 tracking-wide">{c.title}</p>
          <h2 className="text-2xl font-bold mt-1 text-cyan-300">{c.value}</h2>
        </motion.div>
      ))}
    </div>
  );
}
