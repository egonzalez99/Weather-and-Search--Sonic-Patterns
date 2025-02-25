const searchKey = 'AIzaSyBVoUsBH-9kjhNFwNiyH9w0wICvU3sL_YA';
const engineId = '41332f9237c50459d';
const query = 'boots' // the search term

async function searchterm() {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${searchKey}&cx=${engineId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.items);

        if (data.searchInformation) { //an estimated value but not exact vaule since it would breach Google's TOS
            console.log(`Here is total search results for "${query}": ${data.searchInformation.totalResults}` );// ` ` symbol use for quotes
            
            document.getElementById('Output').textContent = `Here is the amount of search results: "${data.searchInformation.totalResults}", for this search term: "${query}"`;

            //the api to be graph on the d3 visual
            const totalSearchResults = data.searchInformation.totalResults;
            return totalSearchResults;
        }

        else {
            console.log('No search results were found for this search term!');
            return null;
        }

    }
    catch (error) {
        console.error("No data searched", error);
        return null;
    }
}

searchterm();


//<script async src="https://cse.google.com/cse.js?cx=41332f9237c50459d">
//</script>
//<div class="gcse-search"></div>
