import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/intensity-year`;

export default function AreaChart() {
  const containerRef = useRef();
  const modalRef = useRef();

  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then(res => {
      const formatted = res.data.map(d => ({
        year: +d._id,
        value: +d.value
      }));
      setData(formatted);
    });
  }, []);

  useEffect(() => {
    if (width && height && data.length) {
      draw(containerRef, width, height);
    }
  }, [width, height, data]);

  useEffect(() => {
    if (modalSize.width && modalSize.height && open) {
      draw(modalRef, modalSize.width, modalSize.height - 50);
    }
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

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

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#38bdf8")
      .attr("stop-opacity", 0.9);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0ea5e9")
      .attr("stop-opacity", 0.1);

    // Area
    const area = d3.area()
      .x(d => x(d.year))
      .y0(y(0))
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area)
      .attr("opacity", 0)
      .transition()
      .duration(1200)
      .attr("opacity", 1);

    // Line
    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Axis
    svg.append("g")
      .attr("transform", `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Tooltip
    const tooltip = d3.select(ref.current)
      .append("div")
      .style("position", "absolute")
      .style("background", "#020617")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const focus = svg.append("g").style("display", "none");

    focus.append("circle")
      .attr("r", 6)
      .attr("fill", "#38bdf8")
      .attr("stroke", "#0ea5e9")
      .attr("stroke-width", 2);

    svg.append("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "transparent")
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => {
        focus.style("display", "none");
        tooltip.style("opacity", 0);
      })
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event);
        const x0 = x.invert(mx);
        const i = d3.bisector(d => d.year).left(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = !d1 ? d0 : x0 - d0.year > d1.year - x0 ? d1 : d0;

        focus.attr("transform", `translate(${x(d.year)},${y(d.value)})`);

        tooltip
          .style("opacity", 1)
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 30 + "px")
          .html(`<b>Year:</b> ${d.year}<br/><b>Value:</b> ${d.value}`);
      });
  };

  return (
    <>
      <ChartCard
        title="📈 Intensity Trend (Area Chart)"
        action={
          <ArrowsPointingOutIcon
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400"
          />
        }
      >
        <div ref={containerRef} className="w-full h-[420px] relative">
          <svg className="w-full h-full" />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-[80vh] relative">
          <svg className="w-full h-full" />
        </div>
      </ChartModal>
    </>
  );
}
