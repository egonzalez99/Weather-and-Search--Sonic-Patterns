import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as Tone from "https://cdn.jsdelivr.net/npm/tone@14/+esm";

// Define an async function to load and visualize data
async function visualizeData() {
    // Load both datasets
    const weatherData = await d3.json("newjerseydata/njsweather.json");
    const searchData1 = await d3.json("newjerseydata/pedialytenj.json");
    const searchData2 = await d3.json("newjerseydata/automotivebatterynj.json");
    const searchData3 = await d3.json("newjerseydata/lampsnj.json");
    const searches1 = await d3.json("test.json");

    function groupBy5DayMedian(data) {
        const grouped = d3.groups(data, d => {
            const year = d.date.getFullYear();
            const jan1 = new Date(year, 0, 1);
            const dayOfYear = Math.floor((d.date - jan1) / (1000 * 60 * 60 * 24)); //1 ms, 60s * 60s = 1hr, 24 hrs
            const bin = Math.floor(dayOfYear / 3); // divide by how many days, 0 to num of days
            return `${year}-B${bin}`;
        });
    
        return grouped.map(([key, values]) => {
            const dates = values.map(d => d.date);
            return {
                date: new Date(d3.median(dates)),
                AWND: d3.median(values, d => d.AWND),
                TAVG: d3.median(values, d => d.TAVG),
                SNOW: d3.median(values, d => d.SNOW),
                PRCP: d3.median(values, d => d.PRCP)
            };
        });
    }

    // Parse and process weather data
    const parsedWeather  = weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: Math.pow(d.AWND, 1.56) ?? 0,
        SNOW: d.SNOW * 55 || 0, //if no snow than default to zero
        PRCP: d.PRCP * 70 ?? 0, 
        TAVG: d.TAVG !== "" ? d.TAVG : (d.TMAX + d.TMIN) / 2 //theres no tavg in json so we calculate
    }));

    const filterData = groupBy5DayMedian(parsedWeather);

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

    searches1.forEach(d => {
        d.DATE = parseDate(d.DATE);
        if (d.sresults !== undefined) {
            d.RESULTS = d.sresults;
            delete d.sresults;
        }
    });
    searches1.sort((a, b) => a.DATE - b.DATE); // sort it based on date

    // Set dimensions
    const width = window.innerWidth;
    const height = 800;
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
    const xAxisGroup = svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).attr("class", "x-axis").style("color", "#fff").style("font-size", "16px");

    // Add Y-axis (weather data)
    const yAxisWeatherGroup = svg.append("g").attr("transform", `translate(${margin.left},0)`).attr("class", "y-axis-weather").style("color", "#fff").style("font-size", "16px");

    // Add Y-axis (Pedialyte data)
    const yAxisSearch1 = svg.append("g").attr("transform", `translate(${width - margin.right},0)`).attr("class", "y-axis-berries").style("color", "#fff").style("font-size", "16px");

    // Add Y-axis (Automotive Battery data)
    const yAxisSearch2 = svg.append("g").attr("transform", `translate(${width - margin.right},0)`).attr("class", "y-axis-berries").style("color", "#fff").style("font-size", "16px");

    // Add Y-axis (lamps data)
    const yAxisSearch3 = svg.append("g").attr("transform", `translate(${width - margin.right},0)`).attr("class", "y-axis-berries").style("color", "#fff").style("font-size", "16px");

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
    function showData1() {
        yAxisSearch1.style("display", "block");
        search1Path.style("display", "block");
    }

    function showData2() {
        yAxisSearch2.style("display", "block");
        search2Path.style("display", "block");
    }

    function showData3() {
        yAxisSearch3.style("display", "block");
        search3Path.style("display", "block");
    }

    const defs = svg.append("defs");

    const gradient1 = defs.append("linearGradient").attr("id", "line-gradient1").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%") .attr("y2", "0%");
    gradient1.append("stop").attr("offset", "0%").attr("stop-color", "blue"); // Start color
    gradient1.append("stop").attr("offset", "100%").attr("stop-color", "red"); // End color

    // Gradient for awndPath
    const gradient2 = defs.append("linearGradient").attr("id", "line-gradient2").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%") .attr("y2", "0%");
    gradient2.append("stop").attr("offset", "0%").attr("stop-color", "#00ab66"); // Start color
    gradient2.append("stop").attr("offset", "100%").attr("stop-color", "#87CEEB"); // End color

    // Gradient for prcpPath
    const gradient3 = defs.append("linearGradient").attr("id", "line-gradient3").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%") .attr("y2", "0%");
    gradient3.append("stop").attr("offset", "0%").attr("stop-color", "#ceff00"); // Start color
    gradient3.append("stop").attr("offset", "100%").attr("stop-color", "#ceff00"); // End color

    // Gradient for snowPath
    const gradient4 = defs.append("linearGradient").attr("id", "line-gradient4").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%") .attr("y2", "0%");
    gradient4.append("stop").attr("offset", "0%").attr("stop-color", "#E5E1FF"); // Start color
    gradient4.append("stop").attr("offset", "100%").attr("stop-color", "#E5E1FF"); // End color

    // Gradient for search1Path
    const gradient5 = defs.append("linearGradient").attr("id", "line-gradient5").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%") .attr("y2", "0%");
    gradient5.append("stop").attr("offset", "25%").attr("stop-color", "#ed872d"); // Start color
    gradient5.append("stop").attr("offset", "100%").attr("stop-color", "#2D93ED"); // End color

    // Gradient for search2Path
    const gradient6 = defs.append("linearGradient").attr("id", "line-gradient6").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%") .attr("y2", "0%");
    gradient6.append("stop").attr("offset", "25%").attr("stop-color", "#ff69b4"); // Start color
    gradient6.append("stop").attr("offset", "100%").attr("stop-color", "#69FFB4"); // End color

    // Gradient for search3Path
    const gradient7 = defs.append("linearGradient").attr("id", "line-gradient7").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%") .attr("y2", "0%");
    gradient7.append("stop").attr("offset", "25%").attr("stop-color", "#40e0d0"); // Start color
    gradient7.append("stop").attr("offset", "100%").attr("stop-color", "#E30B5C"); // End color

    // Append paths for lines and Creates graph paths inside graphGroup
    const tavgPath = svg.append("path").attr("fill", "none").attr("stroke", "url(#line-gradient1)") .attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("x1", x(0)).attr("x2", x(yWeather)).attr("stroke-width", 1);
    const awndPath = svg.append("path").attr("fill", "none").attr("stroke", "url(#line-gradient2)").attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("stroke-width", 1);
    const prcpPath = svg.append("path").attr("fill", "none").attr("stroke", "url(#line-gradient3)").attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("stroke-width", 1);
    const snowPath = svg.append("path").attr("fill", "none").attr("stroke", "url(#line-gradient4)").attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("stroke-width", 1);
    const search1Path = svg.append("path").attr("fill", "none").attr("stroke", "url(#line-gradient5)").attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("stroke-width", 1);
    const search2Path = svg.append("path").attr("fill", "none").attr("stroke", "url(#line-gradient6)").attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("stroke-width", 1);
    const search3Path = svg.append("path").attr("fill", "none").attr("stroke", "url(#line-gradient7)").attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("stroke-width", 1);

    //legend box for the line graphs
    const legend = svg.append("g").attr("transform", "translate(10, 10)");
    
    //temperature legend
    legend.append("rect").attr("width", 20).attr("height", 20).attr("x", 120).attr("y", 0).attr("fill", "red");

    legend.append("text").attr("x", 150).attr("y", 16).text(": TEMPERATURE").attr("fill", "white");

    //wind legend
    legend.append("rect").attr("width", 20).attr("height", 20).attr("x", 360).attr("y", 0).attr("fill", "#00ab66")

    legend.append("text").attr("x", 390).attr("y", 16).attr("fill", "white").text(": WIND");
    //rain legend
    legend.append("rect").attr("width", 20).attr("height", 20).attr("x", 550).attr("y", 0).attr("fill", "#ceff00")

    legend.append("text").attr("x", 580).attr("y", 16).attr("fill", "white").text(": RAIN");
    //snow legend
    legend.append("rect").attr("width", 20).attr("height", 20).attr("x", 720).attr("y", 0).attr("fill", "#E5E1FF")

    legend.append("text").attr("x", 750).attr("y", 16).attr("fill", "white").text(": SNOW");


//----------------------TOOGLE ZOOM AND RESET LINES/HOVER EFFECT--------------------------------------------------

// Global transform state
let currentTransform = { scaleX: 1, translateX: 0 };

// Tooltip setup (assumes you have this div in your HTML or create it here)
const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "8px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("visibility", "hidden");

// Hover effect function
const addHoverEffect = (line, data, yScale, label) => {
    line.style("pointer-events", "visibleStroke");

    line.on("mouseover", function (event) {
        tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (event) {
        const [xPos] = d3.pointer(event);

        // Adjust for zoom transform
        const transformedX = (xPos - currentTransform.translateX) / currentTransform.scaleX;
        const xValue = x.invert(transformedX);

        const bisectDate = d3.bisector(d => d.date || d.DATE).left;
        const index = bisectDate(data, xValue, 1);
        const closestData = data[index];

        tooltip.style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 30}px`)
            .html(`
                Date: ${d3.timeFormat("%Y-%m-%d")(closestData.date || closestData.DATE)}<br>
                TEMPERATURE: ${closestData.TAVG ?? "N/A"}<br>
                WIND: ${closestData.AWND ?? "N/A"}<br>
                RAIN: ${closestData.PRCP ?? "N/A"}<br>
                SNOW: ${closestData.SNOW ?? "N/A"}<br>
                SEARCH TERM RESULTS: ${closestData.SRESULTS ?? "N/A"}<br>
            `);
    })
    .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
    });
};

// Add hover effect to all paths
addHoverEffect(tavgPath, filterData, yWeather, 'TAVG');
addHoverEffect(awndPath, filterData, yWeather, 'AWND');
addHoverEffect(prcpPath, filterData, yWeather, 'PRCP');
addHoverEffect(snowPath, filterData, yWeather, 'SNOW');
addHoverEffect(search1Path, searches1, ySearch1, 'RESULTS');
addHoverEffect(search2Path, searchData2, ySearch2, 'RESULTS');
addHoverEffect(search3Path, searchData3, ySearch3, 'RESULTS');

// Zoom toggle button
d3.select("body").append("button")
    .attr("id", "toggleZoomBtn")
    .text("Enable Zoom")
    .style("font-size", "18px")
    .style("margin", "10px");

let zoomActive = false;

// Clip path for brush area
const clip = svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

// Define brush behavior
const brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("end", updateChart);

// Brush group (hidden by default)
const brushGroup = svg.append("g")
    .attr("class", "brush")
    .style("display", "none")
    .call(brush);

// Toggle brush/zoom visibility
d3.select("#toggleZoomBtn").on("click", () => {
    zoomActive = !zoomActive;

    brushGroup.style("display", zoomActive ? "block" : "none");

    d3.select("#toggleZoomBtn")
        .text(zoomActive ? "Disable Zoom" : "Enable Zoom");

    if (!zoomActive) {
        [tavgPath, awndPath, prcpPath, snowPath, search1Path, search2Path, search3Path].forEach(path =>
            path.transition()
                .duration(1000)
                .attr("transform", `translate(0, 0) scale(1, 1)`)
        );
        currentTransform = { scaleX: 1, translateX: 0 };
    }
});

let idleTimeout;
function idled() { idleTimeout = null; }

function updateChart(event) {
    if (!zoomActive) return;

    const extent = event.selection;

    if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
        return;
    }

    const [x0, x1] = extent;
    const scaleX = width / (x1 - x0);
    const translateX = -x0;

    currentTransform = { scaleX, translateX };

    [tavgPath, awndPath, prcpPath, snowPath, search1Path, search2Path, search3Path].forEach(path =>
        path.transition()
            .duration(1000)
            .attr("transform", `translate(${translateX}, 0) scale(${scaleX}, 1)`)
    );

    // Clear brush selection
    svg.select(".brush").call(brush.move, null);
}

// Reset zoom on double-click
svg.on("dblclick", function () {
    [tavgPath, awndPath, prcpPath, snowPath, search1Path, search2Path, search3Path].forEach(path =>
        path.transition()
            .duration(1000)
            .attr("transform", `translate(0, 0) scale(1, 1)`)
    );
    currentTransform = { scaleX: 1, translateX: 0 };
});

//-----------------------------------------------------------------------------------------------------------
    //AUDIO SECTION
    const playHead = svg.append("circle").attr("r", 5).attr("fill", "red");
    const synth = new Tone.Synth().toDestination();
    const reverb = new Tone.Reverb(2).toDestination(); // 2-second reverb
    const delay = new Tone.FeedbackDelay(0.5, 0.5).toDestination(); // 0.5s delay
    
    synth.connect(reverb);
    synth.connect(delay);

    // Load MP3 files for different datasets
    const audioFiles = {
        weather: new Audio("audio/thankyoudrums.wav"),  // Replace with actual file paths
    };
        
    // Get the volume slider element
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeValueDisplay = document.getElementById("volumeValue");
    
    // Update the volume when the slider is adjusted
    volumeSlider.addEventListener("input", (event) => {
        // Get the current slider value
        const sliderValue = event.target.value;

        // Convert the slider value (-30 dB to 30 dB) to a linear volume value (0 to 1)
        // 10 ^ (dB / 20) converts dB to a linear scale (0 to 1)
        let volume = Math.pow(10, sliderValue / 20);
    
        // Ensure volume stays within the valid range [0, 1]
        volume = Math.max(0, Math.min(1, volume));
    
        // Update the volume of each audio element
        Object.values(audioFiles).forEach(audio => audio.volume = volume);
    
        // Display the current dB value next to the slider
        volumeValueDisplay.textContent = `${sliderValue} dB`;
    });
    
    function playSound(value, dataType) {
        let audioList = [];
    
        if (dataType === "weather") {
            let weatherAudio = audioFiles.weather; 
            weatherAudio.volume = Math.min(1, value / 100); // scaling the volume dynamically (from 0 - 1)
            weatherAudio.playbackRate = Math.max(0.5, Math.min(2, value / 50)); // controls speed (higher temp = faster)
            audioList.push(audioFiles.weather);
        } 
        if (dataType === "search1") {
            let search1Audio = synth.triggerAttackRelease(100 + value * 10, "8n").search1;
            search1Audio.volume = Math.min(1, value / 100); 
            search1Audio.playbackRate = Math.max(0.5, Math.min(2, value / 50));
            audioList.push(audioFiles.search1);
        } 
        if (dataType === "search2") {
            let search2Audio = synth.triggerAttackRelease(100 + value * 10, "8n").search2;
            search2Audio.volume = Math.min(1, value / 100); 
            search2Audio.playbackRate = Math.max(0.5, Math.min(2, value / 50));
            audioList.push(audioFiles.search2);
        } 
        if (dataType === "search3") {
            let search3Audio = synth.triggerAttackRelease(100 + value * 10, "8n").search3;
            search3Audio.volume = Math.min(1, value / 100); 
            search3Audio.playbackRate = Math.max(0.5, Math.min(2, value / 50));
            audioList.push(audioFiles.search3);
        }
    
        audioList.forEach(audio => {
            audio.play();
        });
    }
    
    // Listen for Spacebar to trigger animation
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault(); // Prevent page scrolling
            animatePath(tavgPath, filterData, lineTAVG, yWeather, "weather");
        }
    });
    
    // Reset function
    function resetAnimation() {
        tavgPath.attr("stroke-dasharray", "none");
        playHead.attr("cx", x(filterData[0].date)).attr("cy", yWeather(filterData[0].TAVG));
    }
    
    // Press "R" key to reset animation
    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "r") {
            resetAnimation();
        }
    });
    
    function animatePath(path, data, line, yScale, dataType) {
        const length = path.node().getTotalLength();
        playHead.attr("cx", x(data[0].date || data[0].DATE)).attr("cy", yScale(data[0].TAVG || data[0].RESULTS));
        path.attr("stroke-dasharray", length + " " + length).attr("stroke-dashoffset", length);
        path.transition().duration(5000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
        data.forEach((d, i) => {
            setTimeout(() => {
                playHead.attr("cx", x(d.date || d.DATE)).attr("cy", yScale(d.TAVG || d.RESULTS));
                playSound(d.TAVG || d.RESULTS, dataType);
            }, (i / data.length) * 5000);
        });

    }

    function updateSynthVolume(event) {
        const sliderValue = parseFloat(event.target.value);
        synth.volume.value = sliderValue;
        document.getElementById("synthVolumeValue").textContent = `${sliderValue} dB`;
        console.log(`Synth volume set to: ${synth.volume.value} dB`);
    }
    document.getElementById("synthVolumeSlider").addEventListener("input", updateSynthVolume);


    // Function to update the graph with transitions
    function update(data, dataType) {
        hideDataSelected();  // Hide berries and baby birth data first

        x.domain(d3.extent(filterData, d => d.date));
        
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

            animatePath(tavgPath, data, lineTAVG, yWeather, "weather");


        } else if (dataType === "search1") {
            showData1();
            ySearch1.domain([0, d3.max(data, d => d.RESULTS)]);

            // Transition for Y-axis (berries data)
            yAxisSearch1.transition().duration(3000).call(d3.axisRight(ySearch1));
    
            // Transition for the berries line
            search1Path.datum(searchData1).transition().duration(3000).attr("d", lineSearch1);
            animatePath(search1Path, searchData1, lineSearch1, ySearch1, "search1");

        } else if (dataType === "search2") {
            showData2();
            ySearch2.domain([0, d3.max(data, d => d.RESULTS)]);
    
            // Transition for Y-axis (baby birth data)
            yAxisSearch2.transition().duration(3000).call(d3.axisRight(ySearch2));
    
            // Transition for the baby birth line
            search2Path.datum(data).transition().duration(3000).attr("d", lineSearch2);
            animatePath(search2Path, data, lineSearch2, ySearch2, "search2");

        } else if (dataType === "search3"){
            showData3();
            ySearch3.domain([0, d3.max(data, d => d.RESULTS)]);
            
            // Transition for Y-axis (baby birth data)
            yAxisSearch3.transition().duration(3000).call(d3.axisRight(ySearch3));

            // Transition for the baby birth line
            search3Path.datum(data).transition().duration(3000).attr("d", lineSearch3);
            animatePath(search3Path, data, lineSearch3, ySearch3, "search3");
        }

        // Update X-axis with transition for all datasets
        xAxisGroup.transition().duration(3000).call(d3.axisBottom(x).ticks(20).tickFormat(d3.timeFormat("%Y-%m")));    }

    // Initial update with weather data
    update(filterData, "weather");

    // Add buttons to switch datasets
    d3.select("body").append("button")
        .text("Switch to Sun Tan Data")
        .on("click", () => update(searchData1, "search1"))
        .style("background", "#ed872d")
        .style("color", "white")
        .style("font-size", "20px");

    d3.select("body").append("button")
        .text("Switch to Automotive Battery Data")
        .on("click", () => update(searchData2, "search2"))
        .style("background", "#ff69b4")
        .style("color", "white")
        .style("font-size", "20px");

    // Add a button to switch datasets
    d3.select("body").append("button")
        .text("Switch to Lamps Data")
        .on("click", () => update(searchData3, "search3"))
        .style("background", "#40e0d0")
        .style("color", "black")
        .style("font-size", "20px");

    return svg.node();
}

// Calling the function to visualize data
visualizeData().then(svg => document.body.appendChild(svg));