export function createIcon(svg, width, graphGroup) {

    // Hide graphGroup initially
    graphGroup.style("opacity", 0);  // Set graph initially hidden

    // Define icons
    const icons = [
        { name: "sun", xOffset: 1750, height: 200 },
        { name: "rain", xOffset: 1350, height: 260 },
        { name: "wind", xOffset: 850, height: 230 },
        { name: "snow", xOffset: 350, height: 230 }
    ];

    // Create a group for the icons
    const iconGroup = svg.append("g").attr("id", "iconGroup");

    // Set initial opacity of the icons to 1 (visible)
    iconGroup.style("opacity", 1);

    // Function to toggle between showing/hiding icons and graph
    function toggleGraph() {
        const isGraphVisible = graphGroup.style("opacity") == 1;

        if (isGraphVisible) {
            // Hide graph, show icons
            graphGroup.transition().duration(10000).style("opacity", 0);
            iconGroup.transition().duration(500).style("opacity", 1);
        } else {
            // Show graph, hide icons
            iconGroup.transition().duration(500).style("opacity", 0);
            graphGroup.transition().duration(500).style("opacity", 1);
        }
    }

    // Append icons to the icon group
    icons.forEach(({ name, xOffset, height }) => {
        iconGroup.append("image")
            .attr("width", 200)
            .attr("height", height)
            .attr("x", width - xOffset)
            .attr("y", 80)
            .attr("href", `${name}.svg`)
            .style("cursor", "pointer")
            .on("click", toggleGraph);
    });

    // Click on the graph itself should toggle back to icons
    graphGroup.on("click", toggleGraph);
}
