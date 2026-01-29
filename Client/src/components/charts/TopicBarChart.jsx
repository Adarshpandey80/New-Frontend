import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/topic-distribution`;

export default function TopicBarChart() {
  const ref = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(api).then(res => setData(res.data));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 900;
    const height = 360;
    const margin = { top: 20, right: 30, bottom: 30, left: 160 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.top, height - margin.bottom])
      .padding(0.25);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([margin.left, width - margin.right]);

    svg.append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.label))
      .attr("height", y.bandwidth())
      .attr("rx", 6)
      .attr("width", 0)
      .attr("fill", "#6366f1")
      .transition()
      .duration(1200)
      .attr("width", d => x(d.value) - margin.left);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

  }, [data]);

  return (
    <ChartCard title="📌 Topic Distribution (Horizontal Bar)">
      <div className="w-full h-full overflow-hidden">
        <svg ref={ref} className="w-full h-full max-w-full block" />
      </div>
    </ChartCard>
  );
}
