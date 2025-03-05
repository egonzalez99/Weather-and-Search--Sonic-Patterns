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

    // Parse and process berries data
    const searchDate = d3.timeParse("%Y-%m");
    berriesData.forEach(d => d.DATE = searchDate(d.DATE));

    // Set dimensions
    const width = 1000;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Define scales
    const x = d3.scaleTime()
        .range([margin.left, width - margin.right]);

    const yWeather = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]);

    const yBerries = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]);

    // Create SVG
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add X-axis
    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis");

    // Add Y-axis (weather data)
    const yAxisWeatherGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis-weather");

    // Add Y-axis (berries data)
    const yAxisBerriesGroup = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-berries");

    // Line generators
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

    const lineBerries = d3.line()
        .x(d => x(d.DATE))
        .y(d => yBerries(d.RESULTS));

    // Append paths for lines
    const tavgPath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#36648b")
        .attr("stroke-width", 2);

    const berriesPath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ed872d")
        .attr("stroke-width", 2);

    // Function to update the graph with transitions
    function update(data, isWeather = true) {
        x.domain(d3.extent(data, d => isWeather ? d.date : d.DATE));

        if (isWeather) {
            yWeather.domain([0, d3.max(data, d => d.TAVG)]);
            svg.select(".y-axis-weather")
                .transition()
                .duration(3000)
                .call(d3.axisLeft(yWeather));

            tavgPath
                .datum(data)
                .transition()
                .duration(3000)
                .attr("d", lineTAVG);
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

        } else {
            yBerries.domain([0, d3.max(data, d => d.RESULTS)]);
            svg.select(".y-axis-berries")
                .transition()
                .duration(3000)
                .call(d3.axisRight(yBerries));

            berriesPath
                .datum(data)
                .transition()
                .duration(3000)
                .attr("d", lineBerries);
        }

        // Update x-axis
        svg.select(".x-axis")
            .transition()
            .duration(3000)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y-%m")));
    }

    // Initial update with weather data
    update(filterData, true);

    // Add a button to switch datasets
    d3.select("body").append("button")
        .text("Switch to Berries Data")
        .on("click", function() {
            update(berriesData, false);
        });

    return svg.node();
}

// Calling the function to visualize data
visualizeData().then(svg => document.body.appendChild(svg));




