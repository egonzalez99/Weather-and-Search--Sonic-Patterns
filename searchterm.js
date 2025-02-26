const searchKey = 'AIzaSyBVoUsBH-9kjhNFwNiyH9w0wICvU3sL_YA';
const engineId = '41332f9237c50459d';
const query = 'boots' // the search term

export async function searchterm() {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${searchKey}&cx=${engineId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.searchInformation) {
            const totalSearchResults = Number(data.searchInformation.totalResults);
            console.log(`Total search results for "${query}": ${totalSearchResults}`);
            return totalSearchResults;
        }
    } catch (error) {
        console.error("Search data fetch failed", error);
    }
    return null;
}

//<script async src="https://cse.google.com/cse.js?cx=41332f9237c50459d">
//</script>
//<div class="gcse-search"></div>
