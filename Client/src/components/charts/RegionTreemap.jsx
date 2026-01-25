import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/topic-distribution`;

export default function TopicTrendChart() {
  const ref = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(api).then(res => setData(res.data));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 900;
    const height = 360;
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.label))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // GLOW FILTER
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // LINE PATH
    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 4)
      .attr("filter", "url(#glow)")
      .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1600)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // DOTS
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.label))
      .attr("cy", d => y(d.value))
      .attr("r", 0)
      .attr("fill", "#22c55e")
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr("r", 6);

    // AXIS
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-20)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

  }, [data]);

  return (
    <ChartCard title="📈 Topic Trend Analytics (Premium Line Chart)">
      <svg ref={ref} className="w-full h-[360px]" />
    </ChartCard>
  );
}
