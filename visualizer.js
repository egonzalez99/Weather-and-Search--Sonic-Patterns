import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Define an async function to load and visualize data
async function visualizeData() {
    // Load both datasets
    const weatherData = await d3.json("nysweather.json");
    const searchData1 = await d3.json("berries.json");
    const searchData2 = await d3.json("yogamats.json");
    const searchData3 = await d3.json("greentea.json");

    // Parse and process weather data
    const filterData = weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: d.AWND,
        SNOW: d.SNOW,
        PRCP: d.PRCP,
        TAVG: d.TAVG
    }));

    // Parse and process berries data
    const parseDate = d3.timeParse("%Y-%m");
    searchData1.forEach(d => d.DATE = parseDate(d.DATE));

    // Parse and process baby birth data
    searchData2.forEach(d => d.DATE = parseDate(d.DATE));

    // Parse and process baby birth data
    searchData3.forEach(d => d.DATE = parseDate(d.DATE));

    // Set dimensions
    const width = 1000;
    const height = 500;
    const margin = { top: 0, right: 50, bottom: 50, left: 50 };  // Adjust margin for right-side axes

    // Define scales
    const x = d3.scaleTime().range([margin.left, width - margin.right]);

    const yWeather = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const ySearch1 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const ySearch2 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const yDSearch3 = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    // Create SVG
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add X-axis
    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis");

    // Add Y-axis (weather data) and keep it visible always
    const yAxisWeatherGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis-weather");

    // Add Y-axis (berries data) on the right side
    const yAxisSearch1 = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-search1");

    // Add Y-axis (yoga mats data) on the right side
    const yAxisSearch2 = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-search2");

    // Add Y-axis (yoga mats data) on the right side
    const yAxisSearch3 = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-search3");

    // Line generators
    const lineTAVG = d3.line()
        .x(d => x(d.date))
        .y(d => yWeather(d.TAVG));

    const lineAWND = d3.line()
        .x(d => x(d.date))
        .y(d => yWeather(d.AWND));

    const linePRCP = d3.line()
        .x(d => x(d.date))
        .y(d => yWeather(d.PRCP));

    const lineSNOW = d3.line()
        .x(d => x(d.date))
        .y(d => yWeather(d.SNOW));

    const lineSearch1 = d3.line()
        .x(d => x(d.DATE))
        .y(d => ySearch1(d.RESULTS));

    const lineSearch2 = d3.line()
        .x(d => x(d.DATE))
        .y(d => ySearch2(d.RESULTS));
    
    const lineSearch3 = d3.line()
        .x(d => x(d.DATE))
        .y(d => yDSearch3(d.RESULTS));

    // Function to hide all paths and axes related to berries and baby birth
    function hideDataSelected() {
        yAxisSearch1.style("display", "none");
        yAxisSearch2.style("display", "none");
        yAxisSearch3.style("display", "none");

        search1Path.style("display", "none");
        search2Path.style("display", "none");
        search3Path.style("display", "none");

    }

    // Function to show specific data
    function showBerries() {
        yAxisSearch1.style("display", "block");
        search1Path.style("display", "block");
    }

    function showYogaMats() {
        yAxisSearch2.style("display", "block");
        search2Path.style("display", "block");
    }

    function showGreenTea() {
        yAxisSearch3.style("display", "block");
        search3Path.style("display", "block");
    }

    // Append paths for lines
    const tavgPath = svg.append("path").attr("fill", "none").attr("stroke", "#36648b").attr("stroke-width", 2);
    const awndPath = svg.append("path").attr("fill", "none").attr("stroke", "#00ab66").attr("stroke-width", 2);
    const prcpPath = svg.append("path").attr("fill", "none").attr("stroke", "#ceff00").attr("stroke-width", 2);
    const snowPath = svg.append("path").attr("fill", "none").attr("stroke", "#e2062c").attr("stroke-width", 2);
    const search1Path = svg.append("path").attr("fill", "none").attr("stroke", "#ed872d").attr("stroke-width", 2);
    const search2Path = svg.append("path").attr("fill", "none").attr("stroke", "#ff69b4").attr("stroke-width", 2);
    const search3Path = svg.append("path").attr("fill", "none").attr("stroke", "#40e0d0").attr("stroke-width", 2);

    // Function to update the graph
    function update(data, dataType) {
        hideDataSelected();  // Hide berries and baby birth data first

        x.domain(d3.extent(data, d => d.DATE || d.date));

        // Interrupt any ongoing transitions for the axes before starting a new one
        yAxisWeatherGroup.interrupt().transition().duration(3000).call(d3.axisLeft(yWeather));
        yAxisSearch1.interrupt().transition().duration(3000).call(d3.axisRight(ySearch1));
        yAxisSearch2.interrupt().transition().duration(3000).call(d3.axisRight(ySearch2));
        yAxisSearch3.interrupt().transition().duration(3000).call(d3.axisRight(yDSearch3));
    
        if (dataType === "weather") {
            yWeather.domain([0, d3.max(data, d => Math.max(d.TAVG, d.AWND, d.PRCP, d.SNOW))]);
    
            // Transition for Y-axis (weather data)
            yAxisWeatherGroup.transition().duration(3000).call(d3.axisLeft(yWeather));
    
            // Transition for lines (weather data)
            tavgPath.datum(data).transition().duration(3000).attr("d", lineTAVG);
            awndPath.datum(data).transition().duration(3000).attr("d", lineAWND);
            prcpPath.datum(data).transition().duration(3000).attr("d", linePRCP);
            snowPath.datum(data).transition().duration(3000).attr("d", lineSNOW);

        } 
        else if (dataType === "search1") {
            showBerries();
            ySearch1.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (berries data)
            yAxisSearch1.transition().duration(3000).call(d3.axisRight(ySearch1));
    
            // Transition for the berries line
            search1Path.datum(data).transition().duration(3000).attr("d", lineSearch1);

        } 
        else if (dataType === "search2") {
            showYogaMats();
            ySearch2.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (baby birth data)
            yAxisSearch2.transition().duration(3000).call(d3.axisRight(ySearch2));
    
            // Transition for the baby birth line
            search2Path.datum(data).transition().duration(3000).attr("d", lineSearch2);

        }
        else if (dataType === "search3") {
            showGreenTea();
            yDSearch3.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (baby birth data)
            yAxisSearch3.transition().duration(3000).call(d3.axisRight(yDSearch3));
    
            // Transition for the baby birth line
            search3Path.datum(data).transition().duration(3000).attr("d", lineSearch3);

        }
    
        // Update X-axis with transition for all datasets
        xAxisGroup.transition().duration(3000)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y-%m")));

        // Update Y-axis (berries data) with transition
        yAxisSearch1.transition().duration(3000)
            .call(d3.axisRight(ySearch1));
        
        // Update Transition for the berries line
        search1Path.datum(data).transition().duration(3000).attr("d", lineSearch1);
        
        // Update Y-axis (baby birth data) with transition
        yAxisSearch2.transition().duration(3000)
            .call(d3.axisRight(ySearch2));
        
        // Update Transition for the baby birth line
        search2Path.datum(data).transition().duration(3000).attr("d", lineSearch2);

        // Update Transition for Y-axis (baby birth data)
        yAxisSearch3.transition().duration(3000)
            .call(d3.axisRight(yDSearch3));

        // Update Transition for the baby birth line
        search3Path.datum(data).transition().duration(3000).attr("d", lineSearch3);
    }

    // Initial update with weather data
    update(filterData, "weather");

    // Add buttons to switch datasets
    d3.select("body").append("button")
        .text("Switch to Berries Data")
        .on("click", () => update(searchData1, "search1"));

    d3.select("body").append("button")
        .text("Switch to Yoga Mats Data")
        .on("click", () => update(searchData2, "search2"));

    d3.select("body").append("button")
    .text("Switch to Green Tea Data")
    .on("click", () => update(searchData3, "search3"));

    return svg.node();
}

// Calling the function to visualize data
visualizeData().then(svg => document.body.appendChild(svg));
