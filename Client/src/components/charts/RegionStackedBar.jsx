import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/region-distribution`;

export default function RegionStackedBar() {
  const ref = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(api).then(res => setData(res.data));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 900;
    const height = 120;
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const total = d3.sum(data, d => d.value);

    let acc = 0;

    const x = d3.scaleLinear()
      .domain([0, total])
      .range([margin.left, width - margin.right]);

    const color = d3.scaleOrdinal(d3.schemeSet2);

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => {
        const pos = acc;
        acc += d.value;
        return x(pos);
      })
      .attr("y", margin.top)
      .attr("height", 45)
      .attr("rx", 10)
      .attr("width", 0)
      .attr("fill", (d, i) => color(i))
      .transition()
      .duration(1200)
      .attr("width", d => x(d.value) - x(0));

    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d, i) => x(d3.sum(data.slice(0, i), k => k.value) + d.value / 2))
      .attr("y", margin.top + 30)
      .attr("text-anchor", "middle")
      .text(d => d.label)
      .style("fill", "#111")
      .style("font-size", "12px")
      .style("font-weight", "600");

  }, [data]);

  return (
    <ChartCard title="🌍 Region Distribution (Stacked Bar)">
      <svg ref={ref} className="w-full h-50" />
    </ChartCard>
  );
}
