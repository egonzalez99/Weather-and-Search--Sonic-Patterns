import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Define an async function to load the data and visualize it
async function visualizeWeather() {
    // Load JSON data
    const data = await d3.json("nysweather.json");

    // Extract relevant fields
    const filteredData = data.map(d => ({
        date: new Date(d.DATE),  // Convert DATE string to Date object
        TAVG: d.TAVG
    }));

    const width = 1920, height = 500;
    const marginTop = 50, marginRight = 50, marginBottom = 50, marginLeft = 50;

    // X scale (time)
    const x = d3.scaleUtc()
        .domain(d3.extent(filteredData, d => d.date))
        .range([marginLeft, width - marginRight]);

    // Y scale (temperature)
    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.TAVG)])
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "black");

    // Add a group for the graph elements, initially hidden
    const graphGroup = svg.append("g")
        .style("opacity", 0); // Hidden initially

    // Add the x-axis.
    graphGroup.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(10).tickSize(-height + marginTop + marginBottom));

    // Add the y-axis.
    graphGroup.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    // Line generator for TAVG
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.TAVG));

    // Append line path
    graphGroup.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Create a sun icon with click interaction
    const sun = svg.append("image")
        .attr("x", width - 1000)
        .attr("y", 80)
        .attr("font-size", "80px")
        .attr("fill", "yellow")
        .attr("font-family", "Arial")
        .attr("href", "sun.jpeg")
        .style("cursor", "pointer")
        .on("click", function () {
            // Toggle visibility with transition
            graphGroup.transition()
                .duration(1000)
                .style("opacity", graphGroup.style("opacity") == 0 ? 1 : 0);
        });

    return svg.node();
}

// Call the function
visualizeWeather().then(svg => document.body.appendChild(svg));