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
      })
      .catch(error => console.error('Error fetching New York weather data:', error));
  }
  
  // fetch weather data for Florida
  export function fetchFloridaData() {
    const apiKey = '35e137dcc022e717eb9aaefadfae9332'; 
    const flUrl = `http://api.openweathermap.org/data/2.5/weather?id=4155751&units=metric&appid=${apiKey}`; // Florida city ID
  
    return fetch(flUrl)
      .then(response => response.json())
      .then(data => {
        const flTemp = data.main.temp;
        console.log('Florida Temperature:', flTemp);
  
        // coordinates for FL
        const flLatitude = 27.994402;
        const flLongitude = -81.760254;
  
        // return data for the marker
        return { temp: flTemp, latitude: flLatitude, longitude: flLongitude };
      })
      .catch(error => console.error('Error fetching Florida weather data:', error));
  }