export function graphVisual(graphGroup, x, y, width, height, data, marginTop, marginBottom, marginLeft) {
    // x-axis.
    graphGroup.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(10).tickSize(-height + marginTop + marginBottom));

    // y-axis.
    graphGroup.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    // lines of graph
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.TAVG));

    graphGroup.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

}