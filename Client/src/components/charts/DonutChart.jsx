import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function DonutChart() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const ref = useRef();

  const api = `${import.meta.env.VITE_BACKEND_URL}/data`;

  // Fetch backend data
  useEffect(() => {
    axios
      .get(`${api}/sector`)
      .then((res) => {
        // Transform data: map _id to label and value stays as is
        const transformed = res.data.map((item) => ({
          label: item._id,
          value: item.value,
        }));
        setData(transformed);
      })
      .catch((err) => console.error(err));
  }, []);

  // Render chart
  useEffect(() => {
    if (data.length === 0) return;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.8);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arcs = g.selectAll("arc").data(pie(data)).enter().append("g");

    // Animated slices
    arcs
      .append("path")
      .attr("fill", (d, i) => color(i))
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    // Labels
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .text((d) => d.data.label);
  }, [data]);

  return (
    <>
      {/* Chart Card */}
      <div className="bg-gray-900 rounded-xl p-4 flex flex-col items-center relative shadow-lg">
        <h3 className="text-white font-semibold mb-2">Intensity by Sector</h3>

        {/* Fullscreen icon */}
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          onClick={() => setModalOpen(true)}
        >
          <ArrowsPointingOutIcon className="w-6 h-6" />
        </button>

        <svg ref={ref}></svg>
      </div>

      {/* Modal for Fullscreen Chart */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">
          <div className="bg-gray-900 rounded-xl relative p-6 w-full max-w-3xl">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-white font-bold mb-4 text-lg text-center">
              Intensity by Sector (Fullscreen)
            </h3>
            <svg
              ref={(node) => {
                if (!node) return;
                const width = 600;
                const height = 600;
                const radius = Math.min(width, height) / 2;

                const svgModal = d3.select(node);
                svgModal.selectAll("*").remove();

                const color = d3.scaleOrdinal(d3.schemeCategory10);
                const pie = d3.pie().value((d) => d.value);
                const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.8);

                const g = svgModal
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", `translate(${width / 2}, ${height / 2})`);

                const arcs = g.selectAll("arc").data(pie(data)).enter().append("g");

                arcs
                  .append("path")
                  .attr("fill", (d, i) => color(i))
                  .transition()
                  .duration(1000)
                  .attrTween("d", function (d) {
                    const i = d3.interpolate(d.startAngle, d.endAngle);
                    return function (t) {
                      d.endAngle = i(t);
                      return arc(d);
                    };
                  });

                arcs
                  .append("text")
                  .attr("transform", (d) => `translate(${arc.centroid(d)})`)
                  .attr("text-anchor", "middle")
                  .attr("fill", "#fff")
                  .style("font-size", "14px")
                  .text((d) => d.data.label);
              }}
            ></svg>
          </div>
        </div>
      )}
    </>
  );
}
