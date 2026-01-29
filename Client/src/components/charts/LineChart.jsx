import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/intensity-year`;

export default function LineChart() {
  const containerRef = useRef();
  const modalRef = useRef();

  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then(res => {
      setData(res.data.map(d => ({ year: +d._id, value: +d.value })));
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
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const svg = d3.select(ref.current).select("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("*").remove();

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([margin.left, w - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([h - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 3)
      .attr("d", line);

    const length = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    const focus = svg.append("g").style("display", "none");

    focus.append("circle")
      .attr("r", 6)
      .attr("fill", "#22c55e");

    focus.append("rect")
      .attr("x", 8)
      .attr("y", -22)
      .attr("width", 120)
      .attr("height", 28)
      .attr("rx", 6)
      .attr("fill", "#020617");

    focus.append("text")
      .attr("x", 14)
      .attr("y", -4)
      .attr("fill", "#fff")
      .attr("font-size", 12);

    svg.append("rect")
      .attr("fill", "transparent")
      .attr("width", w)
      .attr("height", h)
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => focus.style("display", "none"))
      .on("mousemove", (e) => {
        const bisect = d3.bisector(d => d.year).left;
        const x0 = x.invert(d3.pointer(e)[0]);
        const i = bisect(data, x0, 1);
        const d = data[i - 1];

        focus.attr("transform", `translate(${x(d.year)},${y(d.value)})`);
        focus.select("text").text(`${d.year}: ${d.value}`);
      });

    svg.append("g")
      .attr("transform", `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  return (
    <>
      <ChartCard title="📈 Intensity Trend" action={
        <ArrowsPointingOutIcon onClick={() => setOpen(true)}
          className="w-5 h-5 cursor-pointer hover:text-cyan-400" />
      }>
        <div ref={containerRef} className="w-full h-full relative overflow-hidden">
          <svg className="w-full h-full max-w-full block" />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-[80vh]">
          <svg className="w-full h-full" />
        </div>
      </ChartModal>
    </>
  );
}
