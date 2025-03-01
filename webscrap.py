import requests
import json

# Google Custom Search API Key and Custom Search Engine ID
api_key = 'AIzaSyBVoUsBH-9kjhNFwNiyH9w0wICvU3sL_YA'
cx = '41332f9237c50459d'

# Search query
query = 'berries'

# URL for Custom Search API
url = f'https://www.googleapis.com/customsearch/v1?q={query}&key={api_key}&cx={cx}'

# Send the request and get the response
response = requests.get(url)

# Parse the JSON response
search_results = response.json()

# Extract the search items (URLs, titles, snippets)
items = search_results.get("items", [])

# Save the search results to a file
with open('berries.json', 'w') as json_file:
    json.dump(items, json_file, indent=4)

print(items)
