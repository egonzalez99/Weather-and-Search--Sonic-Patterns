import requests
import json
from datetime import datetime, timedelta

# Google Custom Search API Key and Custom Search Engine ID
api_key = 'api_here'
cx = 'cx_here'

# Search query
query = 'Yoga mats'  # Modify the search term if needed

# Function to fetch search trends for each month of the past year
def fetch_search_trends():
    search_trends = {}

    for months_ago in range(1, 13):  # Loop from 1 to 12 months ago
        date_restrict = f'm{months_ago}'  # Restrict search to that month

        url = f'https://www.googleapis.com/customsearch/v1?q={query}&key={api_key}&cx={cx}&dateRestrict={date_restrict}'

        try:
            response = requests.get(url)

            if response.status_code == 200:
                data = response.json()

                if 'searchInformation' in data:
                    total_results = int(data['searchInformation']['totalResults'])

                    # Get the month-year label
                    target_date = datetime.today() - timedelta(days=30 * months_ago)
                    month_label = target_date.strftime('%Y-%m')

                    search_trends[month_label] = total_results
                    print(f'{month_label}: {total_results} results')
                else:
                    print(f"No search information for {date_restrict}.")
            else:
                print(f"Error {response.status_code} for {date_restrict}.")
        except Exception as error:
            print(f"Failed to fetch data for {date_restrict}: {error}")

    # Save the search trends data to a JSON file
    with open('babybirth.json', 'w') as json_file:
        json.dump(search_trends, json_file, indent=4)

    print("Search trends saved to 'search_trends.json'.")

# Call the function to fetch search trends
fetch_search_trends()
