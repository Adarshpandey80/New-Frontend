import React from "react";
import Sidebar from "../layout/Sidebar";

import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import AreaChart from "../components/charts/AreaChart";
import PieChart from "../components/charts/PieChart";
import DonutChart from "../components/charts/DonutChart";
import RadarChart from "../components/charts/RadarChart";
import KPISection from "../pages/KPISection";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-800">
        <main className="p-5 flex-1 overflow-auto">

          {/* KPI CARDS */}
          <KPISection />

          {/* CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <LineChart />
            <BarChart />
            <AreaChart />
            <PieChart />
            <DonutChart />
            <RadarChart />
          </div>

        </main>
      </div>
    </div>
  );
}
