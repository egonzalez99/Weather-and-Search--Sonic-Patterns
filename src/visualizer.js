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

    // Create line generator functions for each variable
    const lineTAVG = d3.line()//temp
        .x(d => x(d.date))
        .y(d => y(d.TAVG));

    const linePRCP = d3.line()//rain
        .x(d => x(d.date))
        .y(d => y(d.PRCP));

    const lineAWND = d3.line()//wind
        .x(d => x(d.date))
        .y(d => y(d.AWND));

    const lineSNOW = d3.line()//snow
        .x(d => x(d.date))
        .y(d => y(d.SNOW));

    // Append line paths for each variable
    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", lineTAVG);

    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", linePRCP);

    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineAWND);

    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("d", lineSNOW);
    
    // Return the SVG element.
    return svg.node();
    
}

// Call the function and append the SVG to the document
visualizeWeather().then(svg => document.body.appendChild(svg));

