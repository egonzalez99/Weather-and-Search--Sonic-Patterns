// src/dataProcessing.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function parseWeatherData(weatherData) {
    return weatherData.map(d => ({
        date: new Date(d.DATE),
        AWND: d.AWND,
        SNOW: d.SNOW,
        PRCP: d.PRCP,
        TAVG: d.TAVG
    }));
}

export function parseSearchData(searchData) {
    const parseDate = d3.timeParse("%Y-%m");
    searchData.forEach(d => d.DATE = parseDate(d.DATE));
    return searchData;
}
