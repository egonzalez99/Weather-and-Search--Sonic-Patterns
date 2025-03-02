import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Define an async function to load and visualize data
async function visualizeData() {
    // Load both datasets
    const weatherData = await d3.json("nysweather.json");
    const berriesData = await d3.json("berries.json");
    
    // Parse and process weather data
    const filterData = weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: d.AWND,
        SNOW: d.SNOW,
        PRCP: d.PRCP,
        TAVG: d.TAVG
    }));
    
    // add berries data
    const searchDate = d3.timeParse("%Y-%m"); //needed so the strings can be js objects and match the weather dates
    berriesData.forEach(d => d.DATE = searchDate(d.DATE)); // adds the parse strng to object into the date 
    
    // Set dimensions
    const width = 1000;
    const height = 500;
    const marginTop = 50;
    const marginRight = 50;
    const marginBottom = 50;
    const marginLeft = 50;

    // Define scales
    const x = d3.scaleTime()
        .domain([d3.min(filterData, d => d.date), d3.max(filterData, d => d.date)])
        .range([marginLeft, width - marginRight]);

    //weather x and y axis data to be graph
    const yWeather = d3.scaleLinear()
        .domain([0, d3.max(filterData, d => d.TAVG)])
        .range([height - marginBottom, marginTop]);
    
    //search term: berries x and y axis data to be graph
    const yBerries = d3.scaleLinear()
        .domain([0, d3.max(berriesData, d => d.RESULTS)])
        .range([height - marginBottom, marginTop]);

    // Create SVG
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // add X-axis on graph
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y-%m")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    // add y - axis for weather data (left side)
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(yWeather));

    // add y - axis for berries data (right side)
    svg.append("g")
        .attr("transform", `translate(${width - marginRight},0)`)
        .call(d3.axisRight(yBerries));
    
    // line graph for weather temperature
    const lineTAVG = d3.line()
        .x(d => x(d.date))
        .y(d => yWeather(d.TAVG));
    
    // line graph for wind/gust speed
    const lineAWND = d3.line()
    .x(d => x(d.date))
    .y(d => yWeather(d.AWND));

    // line graph for wind/gust speed
    const linePRCP = d3.line()
    .x(d => x(d.date))
    .y(d => yWeather(d.PRCP));

    // line graph for wind/gust speed
    const lineSNOW = d3.line()
    .x(d => x(d.date))
    .y(d => yWeather(d.SNOW));
     
    // Line generator for berries data
    const lineBerries = d3.line()
        .x(d => x(d.DATE))
        .y(d => yBerries(d.RESULTS));

    // draw weather temperature line
    svg.append("path")
        .datum(filterData)
        .attr("fill", "none")
        .attr("stroke", " #36648b")
        .attr("stroke-width", 2)
        .attr("d", lineTAVG);

    // draw wind/gust line
    svg.append("path")
    .datum(filterData)
    .attr("fill", "none")
    .attr("stroke", "	#00ab66")
    .attr("stroke-width", 2)
    .attr("d", lineAWND);

    // draw rain line
    svg.append("path")
    .datum(filterData)
    .attr("fill", "none")
    .attr("stroke", " #ceff00")
    .attr("stroke-width", 2)
    .attr("d", linePRCP);

    // draw rain line
    svg.append("path")
    .datum(filterData)
    .attr("fill", "none")
    .attr("stroke", " #e2062c")
    .attr("stroke-width", 2)
    .attr("d", lineSNOW);
    
    // Draw berries interest line
    svg.append("path")
        .datum(berriesData)
        .attr("fill", "none")
        .attr("stroke", " #ed872d")
        .attr("stroke-width", 2)
        .attr("d", lineBerries);

    return svg.node();
}

// calling the function to do data visualization
visualizeData().then(svg => document.body.appendChild(svg));
