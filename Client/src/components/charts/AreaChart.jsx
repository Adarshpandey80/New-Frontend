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





import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import useResizeObserver from "../../hooks/useResizeObserver";

const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

export default function AreaChart() {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [data, setData] = useState([]);
  const [full, setFull] = useState(false);

  useEffect(() => {
    axios.get(`${api}/intensity-year`).then(res => {
      const cleaned = res.data
        .map(d => ({ year: +d._id, value: +d.value }))
        .filter(d => d.year > 1900 && d.value > 0);

      setData(cleaned);
    });
  }, []);

  useEffect(() => {
    if (!dimensions || !data.length) return;
    drawChart();
  }, [data, dimensions, full]);

  const drawChart = () => {
    const width = full ? 900 : dimensions.width;
    const height = full ? 450 : 220;
    const margin = { top: 30, right: 25, bottom: 40, left: 45 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const area = d3.area()
      .x(d => x(d.year))
      .y0(y(0))
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#gradient)")
      .attr("d", area)
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value))
      );

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  return (
    <ChartCard
      title="Intensity Trend"
      action={
        <ArrowsPointingOutIcon
          onClick={() => setFull(true)}
          className="w-5 h-5 cursor-pointer hover:text-cyan-400"
        />
      }
    >
      <div ref={wrapperRef} className="w-full h-full">
        <svg ref={svgRef}></svg>
      </div>

      {/* FULLSCREEN */}
      {full && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#020617] p-6 rounded-xl relative w-[95%] max-w-6xl">
            <button
              onClick={() => setFull(false)}
              className="absolute top-4 right-5 text-white text-xl"
            >✕</button>

            <div className="w-full h-[480px]">
              <svg ref={svgRef}></svg>
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
