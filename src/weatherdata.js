//this fie will be where the weather data is stored and called back to the front end (globe)

// fetch weather data for New York
export function fetchNewYorkData() {
    const apiKey = '35e137dcc022e717eb9aaefadfae9332'; // OpenWeatherMap API key
    const nyUrl = `http://api.openweathermap.org/data/2.5/weather?id=5128581&units=metric&appid=${apiKey}`; // New York city ID
  
    return fetch(nyUrl)
      .then(response => response.json())
      .then(data => {
        const nyTemp = data.main.temp; // temperature in Celsius
        console.log('New York Temperature:', nyTemp);
  
        // Coordinates for NY
        const nyLatitude = 40.7128;
        const nyLongitude = -74.0060;
  
        // Return data needed for adding the marker
        return { temp: nyTemp, latitude: nyLatitude, longitude: nyLongitude };
      } )
      .catch(error => console.error('Error fetching New York weather data:', error));
  }
