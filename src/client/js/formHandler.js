function countdown(dateString) {
    // dateString format: '2021-10-31'
    const tripDate = new Date(dateString);
    const currentTime = Date.now();
    const timeInMs = tripDate - currentTime;

    const daysAway = Math.round(timeInMs / (1000 * 60 * 60 * 24));

    return daysAway;
}

function mapRelevantCityDetails(json) {
    const { lat, lng, countryName } = json.geonames[0];

    return {
        lat, 
        lng, 
        countryName
    }
}

async function fetchImageUrl(cityName) {
    const param = encodeURIComponent(cityName);
    const url = `http://localhost:8082`;
    const query = `/image/${param}`;

    try {
        const response = await fetch(url + query);
        const json = await response.json();
        const imageUrl = json.hits[0].largeImageURL;
  
        // imageUrl format: "https://pixabay.com/get/52e5d2444b55ae14f6da8c7dda7936781d3ed7e253506c4870267ad4974fc35bba_1280.jpg"
        return imageUrl;
      
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function fetchWeatherBitData(latitude, longitude, numDays) {
    if (numDays > 15) return { "description": "Forecast date is too far away" }
    // TODO: Have number of days calculation done server side instead of client side
    const url = `http://localhost:8082`;
    const query = `/weather/${latitude}/${longitude}`;

    try {
        const response = await fetch(url + query);
        const json = await response.json();

        // return example format: {"city_name":"London","description":"Overcast clouds","icon":"c04d","high_temp":16.3,"low_temp":10.3}
        return {
            city_name: json.city_name,
            description: json.data[numDays].weather.description,
            icon: json.data[numDays].weather.icon,
            high_temp: json.data[numDays].high_temp,
            low_temp: json.data[numDays].low_temp,
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function fetchCityDetails(city) {
    const BASE_API_PATH = `http://api.geonames.org/searchJSON`;
    const query = `?q=${city}&username=marshall159`;
    const url = BASE_API_PATH + query;

    try {
        const response = await fetch(url);
        const json = await response.json();
        return mapRelevantCityDetails(json);
        // return value Object London: {countryName: "United Kingdom", lat: "51.50853", lng: "-0.12574"}
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const city = document.getElementById('location').value;

    const dateString = document.querySelector('input[type="date"]').value;
    const daysAway = countdown(dateString);

   try {
        // Wrap non-dependent calls in Promise.all to run in parallel?
        const latitudeLongitudeDetails = await fetchCityDetails(city);
        // return example format: {"city_name":"London","description":"Overcast clouds","icon":"c04d","high_temp":16.3,"low_temp":10.3}
        const weatherDetails = await fetchWeatherBitData(latitudeLongitudeDetails.lat, latitudeLongitudeDetails.lng, daysAway);
        const cityImageUrl = await fetchImageUrl(weatherDetails.city_name);

        document.getElementById('date-result').innerHTML = `<h3>${weatherDetails.city_name} is ${daysAway} days away</h3>`;
        // document.getElementById('results').innerHTML = JSON.stringify(weatherDetails);
        // Icon URL example: https://www.weatherbit.io/static/img/icons/{icon_code}.png
        document.getElementById('results').innerHTML = `
            <h3>Typical weather for then is:</h3>
            <p>High: ${weatherDetails.high_temp}, Low: ${weatherDetails.low_temp}</p>
            <p>${weatherDetails.description}</p>
            <div><img src=https://www.weatherbit.io/static/img/icons/${weatherDetails.icon}.png></div>
        `;
        document.getElementById('image').innerHTML = `<img src=${cityImageUrl}>`;
   } catch (error) {
       console.error('Fetch failed', error);
   }
}

export { 
    handleSubmit
}
