// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import axios from "axios";
// import ChartCard from "../../layout/ChartCard";

// const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

// export default function AreaChart() {
//   const svgRef = useRef();
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios.get(`${api}/intensity-year`).then(res => {
//       console.log("Raw data:", res.data);
//       const filteredData = res.data
//         .map(d => ({ year: parseInt(d._id), value: Number(d.value) }))
//         .filter(d => !isNaN(d.year) && d.year > 1900 && d.year < 2100 && d.value > 0);
//       console.log("Filtered data:", filteredData);
//       setData(filteredData);
//     }).catch(err => console.error("API Error:", err));
//   }, []);

//   useEffect(() => {
//     console.log("AreaChart data:", data);
//     if (!data.length) return;

//     const width = 400;
//     const height = 250;
//     const margin = { top: 20, right: 30, bottom: 30, left: 40 };

//     const svg = d3.select(svgRef.current)
//                   .attr("width", width)
//                   .attr("height", height);

//     svg.selectAll("*").remove();

//     const x = d3.scaleLinear()
//                 .domain(d3.extent(data, d => d.year))
//                 .range([margin.left, width - margin.right]);

//     const y = d3.scaleLinear()
//                 .domain([0, d3.max(data, d => d.value)]).nice()
//                 .range([height - margin.bottom, margin.top]);

//     const area = d3.area()
//                    .x(d => x(d.year))
//                    .y0(y(0))
//                    .y1(d => y(d.value))
//                    .curve(d3.curveMonotoneX);

//     svg.append("path")
//        .datum(data)
//        .attr("fill", "#38bdf8")
//        .attr("fill-opacity", 0.4)
//        .attr("d", area);

//     svg.append("path")
//        .datum(data)
//        .attr("fill", "none")
//        .attr("stroke", "#0284c7")
//        .attr("stroke-width", 2)
//        .attr("d", d3.line()
//                     .x(d => x(d.year))
//                     .y(d => y(d.value))
//                     .curve(d3.curveMonotoneX));

//     svg.append("g")
//        .attr("transform", `translate(0,${height - margin.bottom})`)
//        .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format("d")));

//     svg.append("g")
//        .attr("transform", `translate(${margin.left},0)`)
//        .call(d3.axisLeft(y));
    
//   }, [data]);

//   return (
//     <ChartCard title="Intensity Trend Area Chart">
//       <svg ref={svgRef}></svg>
//     </ChartCard>
//   );
// }





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
  const svgRef = useRef(null);
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
    if (width && data.length) draw(containerRef, width, 520);
  }, [width, data]);

  useEffect(() => {
    if (modalSize.width && open)
      draw(modalRef, modalSize.width, modalSize.height - 40);
  }, [modalSize, open]);

  const draw = (ref, w, h) => {
    const margin = { top: 30, right: 20, bottom: 40, left: 50 };
    const svg = d3.select(ref.current).select("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("*").remove();

    // Define gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "grad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#38bdf8")
      .attr("stop-opacity", 0.8);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0ea5e9")
      .attr("stop-opacity", 0.2);

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

    const path = svg.append("path")
      .datum(data)
      .attr("fill", "url(#grad)")
      .attr("d", area)
      .attr("opacity", 0);

    path.transition().duration(1200).attr("opacity", 1);

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
        title="Intensity Trend"
        action={
          <ArrowsPointingOutIcon
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400"
          />
        }
      >
        <div ref={containerRef} className="w-full h-full">
          <svg  ref={svgRef} className="w-full h-full"  />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full">
          <svg ref={svgRef} className="w-full h-full"  />
        </div>
      </ChartModal>
    </>
  );
}
