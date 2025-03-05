const searchKey = 'search_here';
const engineId = 'engine_id_here';
const query = 'boots' // the search term

export async function fetchSearchTrends(weatherData) {
    const dateRanges = weatherData.map(d => d.DATE);  // Extract dates from weather data
    const results = [];

    for (let date of dateRanges) {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${searchKey}&cx=${engineId}&dateRestrict=${date}`;  // Use actual weather date

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.searchInformation) {
                const totalSearchResults = Number(data.searchInformation.totalResults);
                console.log(`Total search results for "${query}" on ${date}: ${totalSearchResults}`);
                results.push({ date: new Date(date), value: totalSearchResults });
            }
        } catch (error) {
            console.error("Search data fetch failed", error);
        }
        await delay(1000);
    }

    return results; // Array of { date, value } for plotting
}


//<script async src="https://cse.google.com/cse.js?cx=41332f9237c50459d">
//</script>
//<div class="gcse-search"></div>
