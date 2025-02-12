import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// Define an async function to load the data and visualize it
async function visualizeWeather() {
    // Load JSON data using await
    const data = await d3.json("nyweather.json");

    // Extract the relevant weather data
    const weatherData = {
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        weatherDescription: data.weather[0].description,
    };

    // display in the HTML
    d3.select("#weather-description")
        .append("h2")
        .text(`Weather: ${weatherData.weatherDescription}`); //needs to be in ' ' to avoid syntax error. idk why

    // SVG dimensions for the chart
    const width = 500;
    const height = 500;

    // Create SVG container
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // set up scales for the bars based on data values
    const xScale = d3.scaleBand()
        .domain(["Temperature", "Wind Speed"]) // the bar names
        .range([0, width])
        .padding(0.2); 

    const yScale = d3.scaleLinear()
        .domain([0, d3.max([weatherData.temperature, weatherData.windSpeed])]) 
        .range([height, 0]); // set 0 at the bottom

    // add chart bars for temperature and wind speed
    svg.selectAll("rect")
        .data([weatherData.temperature, weatherData.windSpeed]) // The data for the bars
        .enter()
        .append("rect")
        // x position and y position based on the data values
        .attr("x", (d, i) => xScale(["Temperature", "Wind Speed"][i])) 
        .attr("y", d => yScale(d)) 
        // width and height of the bars
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d)) 
        .attr("fill", "steelblue");

    // add x-axis to chart data
    svg.append("g")
        .attr("transform", `translate(0,${height})`) // needs to be in ' ' to avoid syntax error. idk why
        .call(d3.axisBottom(xScale));

    // add y-axis to chart data
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // outputs the json but i want the json to be updated daily until last year. so i need to modify the json
    console.log("Temperature" , weatherData.temperature);// current: decimal point is celcuius. updatet to fahrenheit  

    console.log("wind speed" , weatherData.windSpeed);// current: decimal point is m/s. updatet to mph
}

// calling the function to be visualized
visualizeWeather();
