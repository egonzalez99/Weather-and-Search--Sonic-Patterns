export function createIcon(svg, width, graphGroup) {
    //sun svg here
    const sun = svg.append("image") 
        .attr("width", 200)
        .attr("height", 200)
        .attr("x", width - 1750)
        .attr("y", 80)
        .attr("font-size", "80px")
        .attr("fill", "yellow")
        .attr("font-family", "Arial")
        .attr("href", "sun.svg")
        .style("cursor", "pointer")
        .on("click", function () {
            // toggle visibility with click on logo
            graphGroup.transition()
                .duration(1000)
                .style("opacity", graphGroup.style("opacity") == 0 ? 1 : 0);
        });

        //rain svg here
        const rain = svg.append("image") 
        .attr("width", 200)
        .attr("height", 260)
        .attr("x", width - 1350)
        .attr("y", 80)
        .attr("font-size", "80px")
        .attr("fill", "yellow")
        .attr("font-family", "Arial")
        .attr("href", "rain.svg")
        .style("cursor", "pointer")
        .on("click", function () {
            // toggle visibility with click on logo
            graphGroup.transition()
                .duration(1000)
                .style("opacity", graphGroup.style("opacity") == 0 ? 1 : 0);
        });

        //wind svg here
        const wind = svg.append("image") 
        .attr("width", 200)
        .attr("height", 230)
        .attr("x", width - 850)
        .attr("y", 80)
        .attr("font-size", "80px")
        .attr("fill", "yellow")
        .attr("font-family", "Arial")
        .attr("href", "wind.svg")
        .style("cursor", "pointer")
        .on("click", function () {
            // toggle visibility with click on logo
            graphGroup.transition()
                .duration(1000)
                .style("opacity", graphGroup.style("opacity") == 0 ? 1 : 0);
        });

        //wind svg here
        const snow = svg.append("image") 
        .attr("width", 200)
        .attr("height", 230)
        .attr("x", width - 350)
        .attr("y", 80)
        .attr("font-size", "80px")
        .attr("fill", "yellow")
        .attr("font-family", "Arial")
        .attr("href", "snow.svg")
        .style("cursor", "pointer")
        .on("click", function () {
            // toggle visibility with click on logo
            graphGroup.transition()
                .duration(1000)
                .style("opacity", graphGroup.style("opacity") == 0 ? 1 : 0);
        });
}