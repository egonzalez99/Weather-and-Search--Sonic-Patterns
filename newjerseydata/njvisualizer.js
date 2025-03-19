import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as Tone from "https://cdn.jsdelivr.net/npm/tone@14/+esm";

// Define an async function to load and visualize data
async function visualizeData() {
    // Load both datasets
    const weatherData = await d3.json("newjerseydata/njsweather.json");
    const searchData1 = await d3.json("newjerseydata/berries_trends_nj.json");
    const searchData2 = await d3.json("newjerseydata/yogamats_trends_nj.json");
    const searchData3 = await d3.json("newjerseydata/greentea_trends_nj.json");

    // Parse and process weather data
    const filterData = weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: d.AWND,
        SNOW: d.SNOW || 0, //if no snow than default to zero
        PRCP: d.PRCP,
        TAVG: d.TAVG !== "" ? d.TAVG : (d.TMAX + d.TMIN) / 2 //theres no tavg in json so we calculate
    }));

    // Parse and process berries data
    // Fix date format
    const parseDate = d3.timeParse("%Y-%m-%d");
    searchData1.forEach(d => {
        d.DATE = parseDate(d.DATE);
        if (d.results !== undefined) {
            d.RESULTS = d.results;
            delete d.results;
        }
    });

    searchData2.forEach(d => {
        d.DATE = parseDate(d.DATE);
        if (d.results !== undefined) {
            d.RESULTS = d.results;
            delete d.results;
        }
    });

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
    const ySearch1 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const ySearch2 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const ySearch3 = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    // Create SVG
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "black");

    // Add X-axis
    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .style("color", "#fff");

    // Add Y-axis (weather data)
    const yAxisWeatherGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis-weather")
        .style("color", "#fff");

    // Add Y-axis (berrues data)
    const yAxisSearch1 = svg.append("g")
    .attr("transform", `translate(${width - margin.right},0)`)
    .attr("class", "y-axis-berries")
    .style("color", "#fff");

    // Add Y-axis (yoga mats data)
    const yAxisSearch2 = svg.append("g")
    .attr("transform", `translate(${width - margin.right},0)`)
    .attr("class", "y-axis-berries")
    .style("color", "#fff");

    // Add Y-axis (green tea data)
    const yAxisSearch3 = svg.append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .attr("class", "y-axis-berries")
        .style("color", "#fff");

    // Line generators
    const lineTAVG = d3.line().x(d => x(d.date)).y(d => yWeather(d.TAVG));

    // line graph for wind/gust speed
    const lineAWND = d3.line().x(d => x(d.date)).y(d => yWeather(d.AWND));

    // line graph for wind/gust speed
    const linePRCP = d3.line().x(d => x(d.date)).y(d => yWeather(d.PRCP));

    // line graph for wind/gust speed
    const lineSNOW = d3.line().x(d => x(d.date)).y(d => yWeather(d.SNOW));

    //search line graph
    const lineSearch1 = d3.line().x(d => x(d.DATE)).y(d => ySearch1(d.RESULTS));

    const lineSearch2 = d3.line().x(d => x(d.DATE)).y(d => ySearch2(d.RESULTS));

    const lineSearch3 = d3.line().x(d => x(d.DATE)).y(d => ySearch3(d.RESULTS));

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

    // Append paths for lines and Creates graph paths inside graphGroup
    const tavgPath = svg.append("path").attr("fill", "none").attr("stroke", "#36648b").attr("stroke-width", 1);
    const awndPath = svg.append("path").attr("fill", "none").attr("stroke", "#00ab66").attr("stroke-width", 1);
    const prcpPath = svg.append("path").attr("fill", "none").attr("stroke", "#ceff00").attr("stroke-width", 1);
    const snowPath = svg.append("path").attr("fill", "none").attr("stroke", "#e2062c").attr("stroke-width", 1);
    const search1Path = svg.append("path").attr("fill", "none").attr("stroke", "#ed872d").attr("stroke-width", 1);
    const search2Path = svg.append("path").attr("fill", "none").attr("stroke", "#ff69b4").attr("stroke-width", 1);
    const search3Path = svg.append("path").attr("fill", "none").attr("stroke", "#40e0d0").attr("stroke-width", 1);

    const playHead = svg.append("circle").attr("r", 5).attr("fill", "red");
    const synth = new Tone.Synth().toDestination();
    synth.volume.value = 0; // starting volume at 0 dB

    // Get the volume slider element
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeValueDisplay = document.getElementById("volumeValue");

    // Update the volume when the slider is adjusted by user
    volumeSlider.addEventListener("input", (event) => {
        const volume = event.target.value; // value from the slider
        synth.volume.value = volume; // Set the volume 
        volumeValueDisplay.textContent = `${volume} Decibel (dB)`; // Display the volume 
    });

    function playSound(value) {
        synth.triggerAttackRelease(10 + value * 10, "8n");
    }

    // Listen for Spacebar to trigger animation
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {  // "Space" plays the sound
            event.preventDefault(); // Prevents page scrolling when space is pressed
            animatePath(tavgPath, filterData, lineTAVG, yWeather);
        }
    });

    // Reset function
    function resetAnimation() {
        tavgPath.attr("stroke-dasharray", "none"); // Remove dash effect
        playHead.attr("cx", x(filterData[0].date)).attr("cy", yWeather(filterData[0].TAVG));
    }

    // press "R" key to reset animation
    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "r") {
            resetAnimation();
        }
    });
        
    function animatePath(path, data, line, yScale) {
        const length = path.node().getTotalLength();
        playHead.attr("cx", x(data[0].date || data[0].DATE)).attr("cy", yScale(data[0].TAVG || data[0].RESULTS));
        path.attr("stroke-dasharray", length + " " + length).attr("stroke-dashoffset", length);
        path.transition().duration(5000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
        data.forEach((d, i) => {
            setTimeout(() => {
                playHead.attr("cx", x(d.date || d.DATE)).attr("cy", yScale(d.TAVG || d.RESULTS));
                playSound(d.TAVG || d.RESULTS);
            }, (i / data.length) * 5000);
        });
    }

    // Function to update the graph with transitions
    function update(data, dataType) {
        hideDataSelected();  // Hide berries and baby birth data first

        x.domain(d3.extent(data, d => d.DATE || d.date));

        // Interrupt any ongoing transitions for the axes before starting a new one
        yAxisWeatherGroup.interrupt().transition().duration(3000).call(d3.axisLeft(yWeather));
        yAxisSearch1.interrupt().transition().duration(3000).call(d3.axisRight(ySearch1));
        yAxisSearch2.interrupt().transition().duration(3000).call(d3.axisRight(ySearch2));
        yAxisSearch3.interrupt().transition().duration(3000).call(d3.axisRight(ySearch3));

        if (dataType === "weather") {
            yWeather.domain([0, d3.max(data, d => Math.max(d.TAVG, d.AWND, d.PRCP, d.SNOW))]);
    
            // Transition for Y-axis (weather data)
            yAxisWeatherGroup.transition().duration(3000).call(d3.axisLeft(yWeather));
    
            // Transition for lines (weather data)
            tavgPath.datum(data).transition().duration(3000).attr("d", lineTAVG);
            awndPath.datum(data).transition().duration(3000).attr("d", lineAWND);
            prcpPath.datum(data).transition().duration(3000).attr("d", linePRCP);
            snowPath.datum(data).transition().duration(3000).attr("d", lineSNOW);

            animatePath(tavgPath, data, lineTAVG, yWeather);


        } else if (dataType === "search1") {
            showBerries();
            ySearch1.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (berries data)
            yAxisSearch1.transition().duration(3000).call(d3.axisRight(ySearch1));
    
            // Transition for the berries line
            search1Path.datum(data).transition().duration(3000).attr("d", lineSearch1);
            animatePath(search1Path, data, lineSearch1, ySearch1);

        } else if (dataType === "search2") {
            showYogaMats();
            ySearch2.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (baby birth data)
            yAxisSearch2.transition().duration(3000).call(d3.axisRight(ySearch2));
    
            // Transition for the baby birth line
            search2Path.datum(data).transition().duration(3000).attr("d", lineSearch2);
            animatePath(search2Path, data, lineSearch2, ySearch2);

        } else if (dataType === "search3"){
            showGreenTea();
            ySearch3.domain([0, d3.max(data, d => d.RESULTS)]);
            
            // Transition for Y-axis (baby birth data)
            yAxisSearch3.transition().duration(3000).call(d3.axisRight(ySearch3));

            // Transition for the baby birth line
            search3Path.datum(data).transition().duration(3000).attr("d", lineSearch3);
            animatePath(search3Path, data, lineSearch3, ySearch3);
        }

        // Update X-axis with transition for all datasets
        xAxisGroup.transition().duration(3000).call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y-%m")));    }

    // Initial update with weather data
    update(filterData, "weather");

    // Add buttons to switch datasets
    d3.select("body").append("button")
    .text("Switch to Berries Data")
    .on("click", () => update(searchData1, "search1"));

    d3.select("body").append("button")
        .text("Switch to Yoga Mats Data")
        .on("click", () => update(searchData2, "search2"));

    // Add a button to switch datasets
    d3.select("body").append("button")
        .text("Switch to Green tea Data")
        .on("click", () => update(searchData3, "search3"));

    return svg.node();
}

// Calling the function to visualize data
visualizeData().then(svg => document.body.appendChild(svg));