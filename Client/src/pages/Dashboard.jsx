import React from "react";
import Sidebar from "../layout/Sidebar";

import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import AreaChart from "../components/charts/AreaChart";
import RadarChart from "../components/charts/RadarChart";
import KPISection from "../pages/KPISection";
import RegionTreemap from "../components/charts/RegionTreeMap";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#f5f7fb]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="p-6 flex-1 overflow-y-auto space-y-8">

          {/* KPI SECTION */}
          <section className="min-h-[20vh]">
            <KPISection />
          </section>

          {/* CHART SECTIONS */}

          <section className="min-h-[85vh]">
            <LineChart />
          </section>

          <section className="min-h-[85vh]">
            <AreaChart />
          </section>

          <section className="min-h-[85vh]">
            <BarChart />
          </section>

          <section className="min-h-[85vh]">
            <RegionTreemap />
          </section>

          {/* 2 Charts Row */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[85vh]">
            <RadarChart />
            <div className="bg-white rounded-xl shadow-md flex items-center justify-center">
              <h1 className="text-xl font-semibold text-gray-400">
                Heatmap Coming Soon
              </h1>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
