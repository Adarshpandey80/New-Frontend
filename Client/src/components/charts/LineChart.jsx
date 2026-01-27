import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

export default function LineChart() {
  const containerRef = useRef();
  const modalRef = useRef();
  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

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
    if (width && data.length) draw(containerRef, width, 520);
  }, [width, data]);

  useEffect(() => {
    if (modalSize.width && open)
      draw(modalRef, modalSize.width, modalSize.height - 40);
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    console.log("Drawing LineChart:", w, h, data);
    if (!data.length) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
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
                   .y(d => y(d.value));

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#38bdf8")
       .attr("stroke-width", 3)
       .attr("d", line);

    svg.append("g")
       .attr("transform", `translate(0,${h - margin.bottom})`)
       .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format("d")));

    svg.append("g")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y));
  };

  return (
    <>
      <ChartCard
        title="Intensity Trend (Year)"
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
