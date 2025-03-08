// dataProcessing.js
export async function loadData() {
    // Load weather data and search data (berries, yoga mats, green tea)
    const weatherData = await d3.json("nysweather.json");
    const searchData1 = await d3.json("berries.json");
    const searchData2 = await d3.json("yogamats.json");
    const searchData3 = await d3.json("greentea.json");

    // Filter weather data to have specific fields for the graph
    const filterData = weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: d.AWND,
        SNOW: d.SNOW,
        PRCP: d.PRCP,
        TAVG: d.TAVG
    }));

    // Parse date fields in the search data
    const parseDate = d3.timeParse("%Y-%m");
    searchData1.forEach(d => d.DATE = parseDate(d.DATE));
    searchData2.forEach(d => d.DATE = parseDate(d.DATE));
    searchData3.forEach(d => d.DATE = parseDate(d.DATE));

    // Return processed data for further use
    return { filterData, searchData1, searchData2, searchData3 };
}
