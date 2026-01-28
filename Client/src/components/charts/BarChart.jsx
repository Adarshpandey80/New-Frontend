import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/likelihood-country`;

export default function BarChart() {
  const containerRef = useRef();
  const modalRef = useRef();

  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then(res => {
      setData(res.data.map(d => ({ label: d._id, value: +d.value })));
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
    const margin = { top: 40, right: 30, bottom: 80, left: 60 };
    const svg = d3.select(ref.current).select("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("*").remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, w - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([h - margin.bottom, margin.top]);

    const tooltip = d3.select(ref.current)
      .append("div")
      .attr("class", "absolute bg-black text-white text-xs px-3 py-1 rounded shadow")
      .style("opacity", 0);

    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.label))
      .attr("y", y(0))
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "#22c55e")
      .attr("rx", 6)
      .on("mousemove", (e, d) => {
        tooltip
          .style("opacity", 1)
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY - 25 + "px")
          .html(`<b>${d.label}</b>: ${d.value}`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .transition()
      .duration(1200)
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value));

    svg.append("g")
      .attr("transform", `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  return (
    <>
      <ChartCard title="🌍 Country Likelihood" action={
        <ArrowsPointingOutIcon onClick={() => setOpen(true)}
          className="w-5 h-5 cursor-pointer hover:text-cyan-400" />
      }>
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
