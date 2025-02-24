export function svgBg() {
    const width = 1980, height = 1080;
    const marginTop = 50, marginRight = 50, marginBottom = 50, marginLeft = 50;

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "black");

    return { svg, width, height, marginTop, marginRight, marginBottom, marginLeft };
}