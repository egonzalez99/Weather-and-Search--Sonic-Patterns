import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Define an async function to load and visualize data
async function visualizeData() {
    // Load both datasets
    const weatherData = await d3.json("nysweather.json");
    const berriesData = await d3.json("berries.json");
    const babybirthData = await d3.json("babybirth.json");

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
    berriesData.forEach(d => d.DATE = parseDate(d.DATE));

    // Parse and process baby birth data
    babybirthData.forEach(d => d.DATE = parseDate(d.DATE));

    // Set dimensions
    const width = 1000;
    const height = 500;
    const margin = { top: 0, right: 50, bottom: 50, left: 50 };  // Adjust margin for right-side axes

    // Define scales
    const x = d3.scaleTime().range([margin.left, width - margin.right]);

    const yWeather = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const yBerries = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const yBabyBirth = d3.scaleLinear().range([height - margin.bottom, margin.top]);

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
    const yAxisBerriesGroup = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-berries");

    // Add Y-axis (baby birth data) on the right side
    const yAxisBabyGroup = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-babybirth");

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

    const lineBerries = d3.line()
        .x(d => x(d.DATE))
        .y(d => yBerries(d.RESULTS));

    const lineBaby = d3.line()
        .x(d => x(d.DATE))
        .y(d => yBabyBirth(d.RESULTS));

        // Function to hide all paths and axes related to berries and baby birth
    function hideDataSelected() {
        yAxisBerriesGroup.style("display", "none");
        yAxisBabyGroup.style("display", "none");

        berriesPath.style("display", "none");
        babyPath.style("display", "none");
    }

    // Function to show specific data
    function showBerries() {
        yAxisBerriesGroup.style("display", "block");
        berriesPath.style("display", "block");
    }

    function showBabyBirth() {
        yAxisBabyGroup.style("display", "block");
        babyPath.style("display", "block");
    }

    // Append paths for lines
    const tavgPath = svg.append("path").attr("fill", "none").attr("stroke", "#36648b").attr("stroke-width", 2);
    const awndPath = svg.append("path").attr("fill", "none").attr("stroke", "#00ab66").attr("stroke-width", 2);
    const prcpPath = svg.append("path").attr("fill", "none").attr("stroke", "#ceff00").attr("stroke-width", 2);
    const snowPath = svg.append("path").attr("fill", "none").attr("stroke", "#e2062c").attr("stroke-width", 2);
    const berriesPath = svg.append("path").attr("fill", "none").attr("stroke", "#ed872d").attr("stroke-width", 2);
    const babyPath = svg.append("path").attr("fill", "none").attr("stroke", "#ff69b4").attr("stroke-width", 2);


    // Function to update the graph
    function update(data, dataType) {
        hideDataSelected();  // Hide berries and baby birth data first

        x.domain(d3.extent(data, d => d.DATE || d.date));

        // Interrupt any ongoing transitions for the axes before starting a new one
        yAxisWeatherGroup.interrupt().transition().duration(3000).call(d3.axisLeft(yWeather));
        yAxisBerriesGroup.interrupt().transition().duration(3000).call(d3.axisRight(yBerries));
        yAxisBabyGroup.interrupt().transition().duration(3000).call(d3.axisRight(yBabyBirth));
        
    
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
        else if (dataType === "berries") {
            showBerries();
            yBerries.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (berries data)
            yAxisBerriesGroup.transition().duration(3000).call(d3.axisRight(yBerries));
    
            // Transition for the berries line
            berriesPath.datum(data).transition().duration(3000).attr("d", lineBerries);
        } 
        else if (dataType === "babybirth") {
            showBabyBirth();
            yBabyBirth.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (baby birth data)
            yAxisBabyGroup.transition().duration(3000).call(d3.axisRight(yBabyBirth));
    
            // Transition for the baby birth line
            babyPath.datum(data).transition().duration(3000).attr("d", lineBaby);
        }
    
        // Update X-axis with transition for all datasets
        xAxisGroup.transition().duration(3000)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y-%m")));

        // Update Y-axis (berries data) with transition
        yAxisBerriesGroup.transition().duration(3000)
            .call(d3.axisRight(yBerries));
        
        // Update Transition for the berries line
        berriesPath.datum(data).transition().duration(3000).attr("d", lineBerries);
        
        // Update Y-axis (baby birth data) with transition
        yAxisBabyGroup.transition().duration(3000)
            .call(d3.axisRight(yBabyBirth));
        
        // Update Transition for the baby birth line
        babyPath.datum(data).transition().duration(3000).attr("d", lineBaby);
    }

    // Initial update with weather data
    update(filterData, "weather");

    // Add buttons to switch datasets
    d3.select("body").append("button")
        .text("Switch to Berries Data")
        .on("click", () => update(berriesData, "berries"));

    d3.select("body").append("button")
        .text("Switch to Baby Birth Data")
        .on("click", () => update(babybirthData, "babybirth"));

    return svg.node();
}

// Calling the function to visualize data
visualizeData().then(svg => document.body.appendChild(svg));
