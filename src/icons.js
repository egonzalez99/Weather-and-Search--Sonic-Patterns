export function createIcon(svg, width, graphGroup) {
    const sun = svg.append("image") 
        .attr("width", 200)
        .attr("height", 200)
        .attr("x", width - 1809)
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
}