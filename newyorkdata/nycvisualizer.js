import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Define an async function to load and visualize data
async function visualizeData() {

    // Set dimensions
    const width = 1000, height = 500;
    const margin = { top: 0, right: 50, bottom: 50, left: 50 };  // Adjust margin for right-side axes
    
    // Create SVG
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "black");
    
    // Load both datasets
    const weatherData = await d3.json("newyorkdata/nysweather.json");
    const searchData1 = await d3.json("berries.json");
    const searchData2 = await d3.json("yogamats.json");
    const searchData3 = await d3.json("greentea.json");

    // Parse and process weather data
    const filterData = weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: d.AWND,
        SNOW: d.SNOW || 0, //if no snow than default to zero
        PRCP: d.PRCP,
        TAVG: d.TAVG !== "" ? d.TAVG : (d.TMAX + d.TMIN) / 2 //theres no tavg in json so we calculate
    }));

    // Parse and process berries data
    const parseDate = d3.timeParse("%Y-%m");
    searchData1.forEach(d => d.DATE = parseDate(d.DATE));

    // Parse and process baby birth data
    searchData2.forEach(d => d.DATE = parseDate(d.DATE));

    // Parse and process baby birth data
    searchData3.forEach(d => d.DATE = parseDate(d.DATE));

    // Define scales
    const x = d3.scaleTime().range([margin.left, width - margin.right]);

    const yWeather = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const ySearch1 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const ySearch2 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const yDSearch3 = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    // Add X-axis
    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .style("color", "#fff");

    // Add Y-axis (weather data) and keep it visible always
    const yAxisWeatherGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis-weather")
        .style("color", "#fff");

    // Add Y-axis (berries data) on the right side
    const yAxisSearch1 = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-search1")
        .style("color", "#fff");

    // Add Y-axis (yoga mats data) on the right side
    const yAxisSearch2 = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-search2")
        .style("color", "#fff");

    // Add Y-axis (yoga mats data) on the right side
    const yAxisSearch3 = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-search3")
        .style("color", "#fff");

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
    // Create graph paths inside graphGroup
    const tavgPath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#36648b")
        .attr("stroke-width", 1);

    const awndPath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#00ab66")
        .attr("stroke-width", 1);

    const prcpPath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ceff00")
        .attr("stroke-width", 1);

    const snowPath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#e2062c")
        .attr("stroke-width", 1);

    const search1Path = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ed872d")
        .attr("stroke-width", 1);

    const search2Path = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ff69b4")
        .attr("stroke-width", 1);

    const search3Path = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#40e0d0")
        .attr("stroke-width", 1);

    // Create a tooltip div to show values
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "black")
    .style("color", "#fff")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("pointer-events", "none");

    //legend box for the line graphs
    const legend = svg.append("g")
    .attr("transform", "translate(10, 10)");
    //temp legend
    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", 50)
        .attr("y", 468)
        .attr("fill", "#36648b");

    legend.append("text")
        .attr("x", 80)
        .attr("y", 483)
        .text(": TAVG")
        .attr("fill", "white");
    //wind legend
    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", 200)
        .attr("y", 468)
        .attr("fill", "#00ab66")

    legend.append("text")
        .attr("x", 230)
        .attr("y", 483)
        .attr("fill", "white")
        .text(": WIND");
    //rain legend
    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", 350)
        .attr("y", 468)
        .attr("fill", "#ceff00")

    legend.append("text")
        .attr("x", 380)
        .attr("y", 483)
        .attr("fill", "white")
        .text(": RAIN");
    //snow legend
    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", 470)
        .attr("y", 468)
        .attr("fill", "#e2062c")

    legend.append("text")
        .attr("x", 500)
        .attr("y", 483)
        .attr("fill", "white")
        .text(": RAIN");


    // Add mouse events for each line
    const addHoverEffect = (line, data, yScale, label) => {
    line.on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (event, d) {
        const mouse = d3.pointer(event);
        const xPos = mouse[0];
        const xValue = x.invert(xPos);
        const bisectDate = d3.bisector(d => d.date || d.DATE).left;
        const index = bisectDate(data, xValue, 1);
        const closestData = data[index];

        // Position tooltip and set its text
        tooltip.style("left", `${xPos + 10}px`)
            .style("top", `${yScale(closestData[label]) - 30}px`)
            .html(`
                Date: ${d3.timeFormat("%Y-%m-%d")(closestData.date || closestData.DATE)}<br>
                TAVG: ${closestData.TAVG}<br>
                AWND: ${closestData.AWND}<br>
                PRCP: ${closestData.PRCP}<br>
                SNOW: ${closestData.SNOW}
            `);
    })
    .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
    });
    };

    // Update the lines to add hover effect
    addHoverEffect(tavgPath, filterData, yWeather, 'TAVG');
    addHoverEffect(awndPath, filterData, yWeather, 'AWND');
    addHoverEffect(prcpPath, filterData, yWeather, 'PRCP');
    addHoverEffect(snowPath, filterData, yWeather, 'SNOW');
    addHoverEffect(search1Path, searchData1, ySearch1, 'RESULTS'); // Update for searchData1
    addHoverEffect(search2Path, searchData2, ySearch2, 'RESULTS'); // Update for searchData2
    addHoverEffect(search3Path, searchData3, yDSearch3, 'RESULTS'); // Update for searchData3
    
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