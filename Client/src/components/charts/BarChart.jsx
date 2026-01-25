import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

export default function BarChart() {
  const containerRef = useRef();
  const modalRef = useRef();
  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`${api}/likelihood-country`).then(res => {
      setData(res.data.map(d => ({ name: d._id, value: d.value })));
    });
  }, []);

  useEffect(() => {
    if (width && data.length) draw(containerRef, width, 220);
  }, [width, data]);

  useEffect(() => {
    if (modalSize.width && open)
      draw(modalRef, modalSize.width, modalSize.height - 40);
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(ref.current).select("svg")
                  .attr("width", w)
                  .attr("height", h);

    svg.selectAll("*").remove();

    const x = d3.scaleBand()
                .domain(data.map(d => d.name))
                .range([margin.left, w - margin.right])
                .padding(0.3);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]).nice()
                .range([h - margin.bottom, margin.top]);

    svg.append("g")
       .selectAll("rect")
       .data(data)
       .join("rect")
       .attr("x", d => x(d.name))
       .attr("y", d => y(d.value))
       .attr("height", d => y(0) - y(d.value))
       .attr("width", x.bandwidth())
       .attr("fill", "#facc15")
       .attr("rx", 6);

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
      <ChartCard
        title="Top Countries by Likelihood"
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
