import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { fetchSearchTrends } from "./searchterm.js";

// Define an async function to load the data and visualize it
async function visualizeWeather() {
    const data = await d3.json("nysweather.json"); // grab Weather data
    const searchData = await fetchSearchTrends(data); // grab search trend data to match weather data's dates
    
    if (data.searchInformation) {
        const totalSearchResults = Number(data.searchInformation.totalResults);
        console.log(`Total search results for "${query}" on ${date}: ${totalSearchResults}`);
        results.push({ date: new Date(date), value: totalSearchResults });
    }
    
    // Combine the weather data and search trend data
    const filterData = data.map(d => {
        const searchDataForDate = searchData.find(sd => sd.date.toISOString().split('T')[0] === d.DATE); // Match search date to weather date
        return {
            date: new Date(d.DATE),
            TAVG: d.TAVG,
            PRCP: d.PRCP,
            AWND: d.AWND,
            SNOW: d.SNOW,
            searchTermCount: searchDataForDate ? searchDataForDate.value : 0 // count the search term
        };
    });

    // Declare the chart dimensions and margins.
    const width = 1000;
    const height = 500;
    const marginTop = 50;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 50;

    // Declare the x and y axis scale weather data
    const x = d3.scaleUtc()
        .domain(d3.extent(filterData, d => d.date)) // Use data range
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(filterData, d => d.TAVG)]) // Use max TAVG for scale
        .range([height - marginBottom, marginTop]);

    // Declare the y scale for search data.
    const ySearch = d3.scaleLinear()
        .domain([0, d3.max(filterData, d => d.searchTermCount)])
        .nice()
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(10));

    // Add the y-axis for weather data.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    // Add the y-axis for search data (on the right).
    svg.append("g")
        .attr("transform", `translate(${width - marginRight},0)`)
        .call(d3.axisRight(ySearch))
        .attr("stroke", "black"); // Axis color for search data

    // Create line generator functions for each value
    const lineTAVG = d3.line() // Temp line
        .x(d => x(d.date))
        .y(d => y(d.TAVG));

    const linePRCP = d3.line() // Rain line
        .x(d => x(d.date))
        .y(d => y(d.PRCP));

    const lineAWND = d3.line() // Wind line
        .x(d => x(d.date))
        .y(d => y(d.AWND));

    const lineSNOW = d3.line() // Snow line
        .x(d => x(d.date))
        .y(d => y(d.SNOW));

    // Append line paths for each value
    svg.append("path")
        .datum(filterData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", lineTAVG);

    svg.append("path")
        .datum(filterData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", linePRCP);

    svg.append("path")
        .datum(filterData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineAWND);

    svg.append("path")
        .datum(filterData)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("d", lineSNOW);

    // Add circles for search data
    svg.selectAll(".searchCircle")
        .data(filterData)
        .enter().append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => ySearch(d.searchTermCount))
        .attr("r", 1)
        .attr("fill", "black");

    // Add text on axis for search data number results
    svg.selectAll(".searchText")
        .data(filterData)
        .enter().append("text")
        .attr("x", d => x(d.date) + 5)
        .attr("y", d => ySearch(d.searchTermCount))
        .attr("font-size", "2px")
        .text(d => d.searchTermCount);

    // Return the SVG element.
    return svg.node();
    
}

// Call the function and append the SVG to the document
visualizeWeather().then(svg => document.body.appendChild(svg));

