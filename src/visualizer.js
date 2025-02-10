import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


async function nyweatherdata(params) {

     // loading the json data
    const data = await d3.json("nyweather.json");

    //extracting the weather data 
    const weatherdata = {
        temperature : data.main.temp,
        humidity : data.main.humidity,
        windSpeed : data.main.windSpeed,
        weatherDescription : data.weather[0].description,
    }
    
    //to be shown in html
    d3.select("wweatherDescription")
        .append("h1")
        // .text(Weather: ${weatherData.weatherDescription});

    // Append an SVG dynamically to the body
    const width = 500;
    const height = 500;
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        const marginTop = 20;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

    //windspeed visual: this is for the x-axis and y-axis
    const x = d3.scaleBand()
        .domain(["Temperature", "WindSpeed"])
        .range([marginLeft, width - marginRight])
        .padding(0, 1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(weatherdata.temperature, weatherdata.windSpeed)]).nice()
        .range([height - marginBottom, marginTop]);
    
    //bars for temperature and wind speed
    svg.selectAll("rect")
        .data[weatherdata.temperature, weatherdata.windSpeed]
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(["Temperature", "Wind Speed"][i]))//x position
        .attr("y", d => yScale(d))//y position from data vals
        
}

nyweatherdata();