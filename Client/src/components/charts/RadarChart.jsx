import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

export default function RadarChart() {
  const containerRef = useRef();
  const modalRef = useRef();
  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`${api}/topic`).then(res => {
      setData(res.data.map(d => ({ axis: d._id, value: d.value })));
    });
  }, []);

  useEffect(() => {
    if (width && data.length) draw(containerRef, width, 520);
  }, [width, data]);

  useEffect(() => {
    if (modalSize.width && open)
      draw(modalRef, modalSize.width, modalSize.height - 40);
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const levels = 5;
    const radius = Math.min(w, h) / 2 - 30;

    const svg = d3.select(ref.current).select("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .append("g")
                  .attr("transform", `translate(${w/2},${h/2})`);

    svg.selectAll("*").remove();

    const angleSlice = (2 * Math.PI) / data.length;
    const rScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.value)])
                     .range([0, radius]);

    // Draw concentric circles
    for (let i = 1; i <= levels; i++) {
      svg.append("circle")
         .attr("r", (radius / levels) * i)
         .attr("fill", "#94a3b8")
         .attr("stroke", "#475569")
         .attr("stroke-width", 0.5)
         .attr("fill-opacity", 0.05);
    }

    // Draw axis lines
    const axisGrid = svg.append("g").attr("class", "axisWrapper");
    axisGrid.selectAll(".axis")
      .data(data)
      .join("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", d => rScale(d3.max(data, d => d.value)) * Math.cos(angleSlice * data.indexOf(d) - Math.PI/2))
      .attr("y2", d => rScale(d3.max(data, d => d.value)) * Math.sin(angleSlice * data.indexOf(d) - Math.PI/2))
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1);

    // Draw radar area
    const radarLine = d3.lineRadial()
                        .radius(d => rScale(d.value))
                        .angle((d, i) => i * angleSlice)
                        .curve(d3.curveLinearClosed);

    svg.append("path")
       .datum(data)
       .attr("d", radarLine)
       .attr("fill", "#facc15")
       .attr("fill-opacity", 0.4)
       .attr("stroke", "#fbbf24")
       .attr("stroke-width", 2);

    // Axis labels
    svg.selectAll(".axisLabel")
       .data(data)
       .join("text")
       .attr("x", d => (rScale(d3.max(data, d => d.value)) + 10) * Math.cos(angleSlice * data.indexOf(d) - Math.PI/2))
       .attr("y", d => (rScale(d3.max(data, d => d.value)) + 10) * Math.sin(angleSlice * data.indexOf(d) - Math.PI/2))
       .text(d => d.axis)
       .attr("font-size", 10)
       .attr("fill", "#f1f5f9")
       .style("text-anchor", "middle");
  };

  return (
    <>
      <ChartCard
        title="Topic Radar Chart"
        action={
          <ArrowsPointingOutIcon
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400"
          />
        }
      >
        <div ref={containerRef} className="w-full h-full">
          <svg />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full">
          <svg />
        </div>
      </ChartModal>
    </>
  );
}
