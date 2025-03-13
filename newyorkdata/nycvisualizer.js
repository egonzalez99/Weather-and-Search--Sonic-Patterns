import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Define an async function to load and visualize data
async function visualizeData() {
    // Load both datasets
    const weatherData = await d3.json("newyorkdata/nysweather.json");
    const searchData3 = await d3.json("newyorkdata/greentea_trends_ny.json");

    // Parse and process weather data
    const filterData = weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: d.AWND,
        SNOW: d.SNOW,
        PRCP: d.PRCP,
        TAVG: d.TAVG
    }));

    // Parse and process berries data
    // Fix date format
    const parseDate = d3.timeParse("%Y-%m-%d");
    searchData3.forEach(d => {
        d.DATE = parseDate(d.DATE);
        if (d.results !== undefined) {
            d.RESULTS = d.results;
            delete d.results;
        }
    });

    // Set dimensions
    const width = 1000;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Define scales
    const x = d3.scaleTime().range([margin.left, width - margin.right]);

    const yWeather = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    const ySearch3 = d3.scaleLinear().range([height - margin.bottom, margin.top]);

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
    const yAxisSearch3 = svg.append("g")
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

    const lineSearch3 = d3.line()
        .x(d => x(d.DATE))
        .y(d => ySearch3(d.RESULTS));

    function hideDataSelected() {
        yAxisSearch1.style("display", "none");
        yAxisSearch2.style("display", "none");
        yAxisSearch3.style("display", "none");

        search1Path.style("display", "none");
        search2Path.style("display", "none");
        search3Path.style("display", "none");

    }

    function showGreenTea() {
        yAxisSearch3.style("display", "block");
        search3Path.style("display", "block");
    }

    // Append paths for lines
    const tavgPath = svg.append("path").attr("fill", "none").attr("stroke", "#36648b").attr("stroke-width", 2);

    const search3Path = svg.append("path").attr("fill", "none").attr("stroke", "#ed872d").attr("stroke-width", 2);

    // Function to update the graph with transitions
    function update(data, isWeather = true) {
        x.domain(d3.extent(data, d => isWeather ? d.date : d.DATE));

        // Interrupt any ongoing transitions for the axes before starting a new one
        yAxisWeatherGroup.interrupt().transition().duration(3000).call(d3.axisLeft(yWeather));
        yAxisSearch3.interrupt().transition().duration(3000).call(d3.axisRight(ySearch3));

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
            svg.append("path").datum(filterData).attr("fill", "none").attr("stroke", " #36648b").attr("stroke-width", 2).attr("d", lineTAVG);

            // draw wind/gust line
            svg.append("path").datum(filterData).attr("fill", "none").attr("stroke", "	#00ab66").attr("stroke-width", 2).attr("d", lineAWND);

            // draw rain line
            svg.append("path").datum(filterData).attr("fill", "none").attr("stroke", " #ceff00").attr("stroke-width", 2).attr("d", linePRCP);

            // draw rain line
            svg.append("path").datum(filterData).attr("fill", "none").attr("stroke", " #e2062c").attr("stroke-width", 2).attr("d", lineSNOW);

        } else {
            ySearch3.domain([0, d3.max(data, d => d.RESULTS)]);
            svg.select(".y-axis-berries").transition().duration(3000).call(d3.axisRight(ySearch3));

            search3Path.datum(data).transition().duration(3000).attr("d", lineSearch3);
        }

        // Update X-axis with transition for all datasets
        xAxisGroup.transition().duration(3000).call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y-%m")));    }

    // Initial update with weather data
    update(filterData, true);

    // Add a button to switch datasets
    d3.select("body").append("button")
        .text("Switch to Berries Data")
        .on("click", function() {
            update(searchData3, false);
        });

    return svg.node();
}

// Calling the function to visualize data
visualizeData().then(svg => document.body.appendChild(svg));