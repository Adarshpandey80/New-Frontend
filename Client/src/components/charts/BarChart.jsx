import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";

const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

export default function BarChart() {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${api}/likelihood-country`).then(res => {
      setData(res.data.map(d => ({ name: d._id, value: d.value })));
    });
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current)
                  .attr("width", width)
                  .attr("height", height);

    svg.selectAll("*").remove();

    const x = d3.scaleBand()
                .domain(data.map(d => d.name))
                .range([margin.left, width - margin.right])
                .padding(0.3);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]).nice()
                .range([height - margin.bottom, margin.top]);

    svg.append("g")
       .selectAll("rect")
       .data(data)
       .join("rect")
       .attr("x", d => x(d.name))
       .attr("y", d => y(d.value))
       .attr("height", d => y(0) - y(d.value))
       .attr("width", x.bandwidth())
       .attr("fill", "#facc15")
       .attr("rx", 6);

    svg.append("g")
       .attr("transform", `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "rotate(-40)")
       .style("text-anchor", "end");

    svg.append("g")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y));

  }, [data]);

  return (
    <ChartCard title="Top Countries by Likelihood">
      <svg ref={svgRef}></svg>
    </ChartCard>
  );
}
