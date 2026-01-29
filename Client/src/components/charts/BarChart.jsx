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

  const { width } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then(res => {
      setData(res.data.map(d => ({ name: d._id, value: +d.value })));
    });
  }, []);

  const { height } = useChartDimensions(containerRef);

  useEffect(() => {
    if (width && height && data.length) draw(containerRef, width, height);
  }, [width, height, data]);

  useEffect(() => {
    if (modalSize.width && open) {
      draw(modalRef, modalSize.width, modalSize.height - 40);
    }
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const margin = { top: 30, right: 40, bottom: 80, left: 60 };

    const svg = d3.select(ref.current).select("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("*").remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, w - margin.right])
      .padding(0.35);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([h - margin.bottom, margin.top]);

    const tooltip = d3.select(ref.current)
      .append("div")
      .attr("class", "absolute bg-black text-white px-3 py-1 rounded-md text-xs pointer-events-none")
      .style("opacity", 0);

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", y(0))
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("rx", 6)
      .attr("fill", "#facc15")
      .on("mousemove", (e, d) => {
        tooltip.style("opacity", 1)
          .html(`${d.name} : ${d.value}`)
          .style("left", e.offsetX + 15 + "px")
          .style("top", e.offsetY - 20 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .transition()
      .duration(1000)
      .ease(d3.easeBounceOut)
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value));

    svg.append("g")
      .attr("transform", `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  return (
    <>
      <ChartCard
        title="Top Countries by Likelihood"
        action={
          <ArrowsPointingOutIcon
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400"
          />
        }
      >
        <div ref={containerRef} className="relative w-full h-full overflow-hidden">
          <svg className="w-full h-full max-w-full block" />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="relative w-full h-full">
          <svg className="w-full h-full" />
        </div>
      </ChartModal>
    </>
  );
}
