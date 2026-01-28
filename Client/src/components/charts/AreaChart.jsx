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

  const { width } = useChartDimensions(containerRef);
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
    if (width && data.length) draw(containerRef, width, 520);
  }, [width, data]);

  useEffect(() => {
    if (modalSize.width && open) {
      draw(modalRef, modalSize.width, modalSize.height - 40);
    }
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const margin = { top: 40, right: 40, bottom: 50, left: 60 };

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

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#38bdf8")
      .attr("stop-opacity", 0.7);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0ea5e9")
      .attr("stop-opacity", 0.1);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area)
      .attr("opacity", 0)
      .transition().duration(1200).attr("opacity", 1);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 3)
      .attr("d", line);

    const focus = svg.append("g").style("display", "none");

    focus.append("circle")
      .attr("r", 6)
      .attr("fill", "#22c55e");

    focus.append("rect")
      .attr("x", 10)
      .attr("y", -20)
      .attr("width", 120)
      .attr("height", 30)
      .attr("rx", 6)
      .attr("fill", "#020617");

    const tooltipText = focus.append("text")
      .attr("x", 18)
      .attr("y", 0)
      .attr("fill", "#fff")
      .style("font-size", "12px");

    const bisect = d3.bisector(d => d.year).center;

    svg.append("rect")
      .attr("fill", "transparent")
      .attr("width", w)
      .attr("height", h)
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => focus.style("display", "none"))
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        const x0 = x.invert(mx);
        const d = data[bisect(data, x0)];
        if (!d) return;

        focus.attr("transform", `translate(${x(d.year)},${y(d.value)})`);
        tooltipText.text(`${d.year} → ${d.value}`);
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
      <ChartCard
        title="Intensity Trend (Area)"
        action={
          <ArrowsPointingOutIcon
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400"
          />
        }
      >
        <div ref={containerRef} className="w-full h-full">
          <svg className="w-full h-full" />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full">
          <svg className="w-full h-full" />
        </div>
      </ChartModal>
    </>
  );
}
