from pytrends.request import TrendReq
import pandas as pd
import json

pd.set_option('future.no_silent_downcasting', True)

pytrends = TrendReq(hl='en-US', tz=300)  # timezone offset is done by multiplying 60 by the timezone UTC. No negative values.
kw_list = ["green tea"]  # put search terms here

# get Google Trends data for search term above
def get_interest():
    try:
        # create a list of geos for New York only
        geos = ['US-NY']
        all_data = []

        # iterate over each geo location to pull data
        for geo in geos:
            pytrends.build_payload(kw_list, cat=0, timeframe='now 5-y', geo=geo, gprop='')
            data = pytrends.interest_over_time()

            if not data.empty:
                # add the geo column to identify data by region
                data['geo'] = geo
                all_data.append(data)
            else:
                print(f"No data available for {geo}.")

        # Only proceed if we have data to combine
        if all_data:
            # combine all data frames
            combined_data = pd.concat(all_data, axis=0)

            # reset index to flatten the DataFrame
            combined_data.reset_index(inplace=True)

            # convert pandas.Timestamp to string values
            combined_data['date'] = combined_data['date'].astype(str)

            # saving data into a JSON file
            with open('greenteatrends_ny.json', 'w') as f:
                json.dump(combined_data.to_dict(orient='records'), f, indent=4)
                print("Data saved to greenteatrends_ny.json")
        else:
            print("No data available for the given query in any location.")

    except Exception as e:
        print(f"An error occurred: {e}")

get_interest()
