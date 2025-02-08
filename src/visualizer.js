import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


async function nyweatherdata(params) {

     // loading the json data
    const data = await d3.json("nyweather.json");

    data.json(weatherdata).then(data => {

        weatherdata() = {
            temperature : data.main.temp,
            humidity : data.main.humidity,
            windSpeed : data.main.windSpeed,
            weatherDescription : data.weather[1].description
        }
        
    }) 
    // Append an SVG dynamically to the body
    const svg = d3.select("body")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);

    svg.append("circle")
        .attr("cx", 250)   // Center X position
        .attr("cy", 250)   // Center Y position
        .attr("r", 100)    // Radius
        .attr("fill", "blue");  // Fill color
    
}

nyweatherdata();