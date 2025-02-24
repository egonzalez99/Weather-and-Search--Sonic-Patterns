export function scalerGraph(data, width, height, marginTop, marginRight, marginBottom, marginLeft) {

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))  // the date field from filtered data
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.TAVG)])  //average temp
        .range([height - marginBottom, marginTop]);

    return { x, y };
}