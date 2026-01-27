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
      setData(res.data.map(d => ({
        year: +d._id,
        value: +d.value
      })));
    });
  }, []);

  useEffect(() => {
    if (width && height && data.length) {
      draw(containerRef, width, 520);
    }
  }, [width, height, data]);

  useEffect(() => {
    if (modalSize.width && modalSize.height && open) {
      draw(modalRef, modalSize.width, modalSize.height);
    }
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };

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

    const area = d3.area()
      .x(d => x(d.year))
      .y0(y(0))
      .y1(d => y(d.value))
      .curve(d3.curveCatmullRom);

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#grad)")
      .attr("d", area)
      .attr("opacity", 0.9);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 3)
      .attr("d", line);

    svg.append("g")
      .attr("transform", `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Tooltip + hover effects
    const tooltip = d3.select(ref.current)
      .append("div")
      .style("position", "absolute")
      .style("background", "#020617")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const focus = svg.append("g").style("display", "none");

    focus.append("line")
      .attr("y1", margin.top)
      .attr("y2", h - margin.bottom)
      .attr("stroke", "#38bdf8")
      .attr("stroke-dasharray", "3,3");

    focus.append("circle")
      .attr("r", 6)
      .attr("fill", "#38bdf8");

    const bisect = d3.bisector(d => d.year).left;

    svg.append("rect")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", w)
      .attr("height", h)
      .on("mouseover", () => {
        focus.style("display", null);
        tooltip.style("opacity", 1);
      })
      .on("mouseout", () => {
        focus.style("display", "none");
        tooltip.style("opacity", 0);
      })
      .on("mousemove", event => {
        const [mx] = d3.pointer(event);
        const year = x.invert(mx);
        const i = bisect(data, year);
        const d = data[i];

        if (!d) return;

        focus.attr("transform", `translate(${x(d.year)},0)`);
        focus.select("circle")
          .attr("cy", y(d.value));

        tooltip
          .html(`Year: ${d.year}<br/>Value: ${d.value}`)
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 30 + "px");
      });
  };

  return (
    <>
      <ChartCard
        title="Intensity Trend"
        action={
          <ArrowsPointingOutIcon
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400"
          />
        }
      >
        <div ref={containerRef} className="w-full h-full relative">
          <svg className="w-full h-full" />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full relative">
          <svg className="w-full h-full" />
        </div>
      </ChartModal>
    </>
  );
}
