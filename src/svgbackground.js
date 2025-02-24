export function svgBg() {
    const width = window.innerWidth, height = window.innerHeight;
    const marginTop = 0, marginRight = 0, marginBottom = 0, marginLeft = 0;

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "black");

    return { svg, width, height, marginTop, marginRight, marginBottom, marginLeft };
}