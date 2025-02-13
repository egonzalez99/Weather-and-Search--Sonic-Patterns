import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// Define an async function to load the data and visualize it
async function visualizeWeather() {
    // Load JSON data
    const data = await d3.json("nysweather.json");
    
    // Extract relevant fields
    const filteredData = data.map(d => ({
        date: new Date(d.DATE),  // Convert DATE string to Date object
        AWND: d.AWND,
        SNOW: d.SNOW,
        PGTM: d.PGTM,
        PRCP: d.PRCP,
        TAVG: d.TAVG
    }));

    // Declare the chart dimensions and margins.
    const width = 1000;
    const height = 500;
    const marginTop = 50;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 50;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
        .domain(d3.extent(filteredData, d => d.date)) // Use data range
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.TAVG)]) // Use max TAVG for scale
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(10));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    // Line generator for TAVG
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.TAVG));

    // Append line path
    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
    
    data.forEach(d => console.log(d.AWND));
    
    // Return the SVG element.
    return svg.node();

    
}

// Call the function and append the SVG to the document
visualizeWeather().then(svg => document.body.appendChild(svg));
