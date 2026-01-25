import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";

const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

export default function PieChart() {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${api}/region`).then(res => {
      setData(res.data.map(d => ({ name: d._id, value: d.value })));
    });
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", `translate(${width/2},${height/2})`);

    const pie = d3.pie().value(d => d.value)(data);
    const arc = d3.arc().innerRadius(50).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll("path")
       .data(pie)
       .join("path")
       .attr("d", arc)
       .attr("fill", (d,i) => color(i))
       .attr("stroke", "#1e293b")
       .attr("stroke-width", 2);

  }, [data]);

  return (
    <ChartCard title="Region Distribution">
      <svg ref={svgRef}></svg>
    </ChartCard>
  );
}
