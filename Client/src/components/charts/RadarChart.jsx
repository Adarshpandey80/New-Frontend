import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/topic`;

export default function RadarChart() {
  const containerRef = useRef();
  const modalRef = useRef();
  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then(res => {
      setData(res.data.map(d => ({ axis: d._id, value: +d.value })));
    });
  }, []);

  useEffect(() => {
    if (width && height && data.length) draw(containerRef, width, height);
  }, [width, height, data]);

  useEffect(() => {
    if (modalSize.width && modalSize.height && open)
      draw(modalRef, modalSize.width, modalSize.height - 50);
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const svg = d3.select(ref.current).select("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("*").remove();

    const radius = Math.min(w, h) / 2 - 80;
    const g = svg.append("g")
      .attr("transform", `translate(${w / 2},${h / 2})`);

    const angleSlice = (2 * Math.PI) / data.length;
    const rScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, radius]);

    // Grid
    for (let i = 1; i <= 5; i++) {
      g.append("circle")
        .attr("r", (radius / 5) * i)
        .attr("fill", "none")
        .attr("stroke", "#334155")
        .attr("stroke-dasharray", "3 3");
    }

    // Axes
    data.forEach((d, i) => {
      g.append("line")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", rScale(d3.max(data, d => d.value)) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", rScale(d3.max(data, d => d.value)) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("stroke", "#475569");
    });

    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed);

    const path = g.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", "#22c55e")
      .attr("fill-opacity", 0.35)
      .attr("stroke", "#4ade80")
      .attr("stroke-width", 2)
      .attr("transform", "scale(0)");

    path.transition().duration(1200).attr("transform", "scale(1)");

    // Points
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("fill", "#22c55e");

    // Labels
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d, i) => (rScale(d3.max(data, d => d.value)) + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => (rScale(d3.max(data, d => d.value)) + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d.axis)
      .style("fill", "#e5e7eb")
      .style("font-size", "11px")
      .style("text-anchor", "middle");
  };

  return (
    <>
      <ChartCard title="🧠 Topic Radar Intelligence"
        action={<ArrowsPointingOutIcon onClick={() => setOpen(true)}
          className="w-5 h-5 cursor-pointer hover:text-cyan-400" />}
      >
        <div ref={containerRef} className="relative w-full h-[420px]">
          <svg className="w-full h-full" />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="relative w-full h-[80vh]">
          <svg className="w-full h-full" />
        </div>
      </ChartModal>
    </>
  );
}
