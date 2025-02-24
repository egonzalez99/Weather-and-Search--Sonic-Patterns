export async function loadData() {
    const data = await d3.json("nysweather.json");

    // extract chosen data here
    const filteredData = data.map(d => ({
        date: new Date(d.DATE),  // convert DATE string to Date object
        TAVG: d.TAVG
    }));

    return filteredData;  // return the data
}