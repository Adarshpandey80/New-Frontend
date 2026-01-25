import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";

const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

export default function LineChart() {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${api}/intensity-year`).then(res => {
      console.log("Raw data:", res.data);
      const filteredData = res.data
        .map(d => ({ year: parseInt(d._id), value: Number(d.value) }))
        .filter(d => !isNaN(d.year) && d.year > 1900 && d.year < 2100 && d.value > 0);
      console.log("Filtered data:", filteredData);
      setData(filteredData);
    }).catch(err => console.error("API Error:", err));
  }, []);

  useEffect(() => {
    console.log("LineChart data:", data);
    if (!data.length) return;

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current)
                  .attr("width", width)
                  .attr("height", height)
                  .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("*").remove(); // clear previous

    const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.year))
                .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]).nice()
                .range([height - margin.bottom, margin.top]);

    const line = d3.line()
                   .x(d => x(d.year))
                   .y(d => y(d.value));

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#38bdf8")
       .attr("stroke-width", 3)
       .attr("d", line);

    svg.append("g")
       .attr("transform", `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format("d")));

    svg.append("g")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y));

  }, [data]);

  return (
    <ChartCard title="Intensity Trend (Year)">
      <svg ref={svgRef} />
    </ChartCard>
  );
}
