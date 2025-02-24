import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadData } from './weatherdata.js';
import { svgBg } from './svgbackground.js';
import { scalerGraph } from './scaler.js';
import { graphVisual } from './gtaph.js';
import { createIcon } from './icons.js';

async function visualizeWeather() {
    // Load the data from the states weather JSON
    const data = await loadData();  // where filteredData is hold

    // creating SVG on screen
    const { svg, width, height, marginTop, marginRight, marginBottom, marginLeft } = svgBg();

    // creating Scaler on screen
    const { x, y } = scalerGraph(data, width, height, marginTop, marginRight, marginBottom, marginLeft);  // Passing the filtered data here

    // Add a group for the graph elements, initially hidden
    const graphGroup = svg.append("g")
        .style("opacity", 0); // Hidden initially

    // creating the graph on screen
    graphVisual(graphGroup, x, y, width, height, data, marginTop, marginBottom, marginLeft);

    // creating the icon on screen
    createIcon(svg, width, graphGroup);

    return svg.node();
}

// function call
visualizeWeather().then(svg => document.body.appendChild(svg));