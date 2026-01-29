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
    <div className="flex h-screen bg-[#f5f7fb] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-auto space-y-8 overflow-x-hidden">

          {/* KPI SECTION */}
          <section className="min-h-[20vh]">
            <KPISection />
          </section>

          {/* CHART SECTIONS */}

          <section className="h-[500px] xl:h-[600px]">
            <LineChart />
          </section>

          <section className="h-[500px] xl:h-[600px]">
            <AreaChart />
          </section>

          <section className="h-[500px] xl:h-[600px]">
            <BarChart />
          </section>

          <section className="h-[500px] xl:h-[600px]">
            <RegionTreemap />
          </section>

          {/* 2 Charts Row */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[500px] xl:h-[600px]">
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
