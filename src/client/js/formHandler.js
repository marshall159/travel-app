// async function postData(url = '', data = {}) {
//     const response = await fetch(url, {
//         method: 'POST',
//         mode: 'cors', 
//         cache: 'no-cache',
//         credentials: 'same-origin',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         redirect: 'follow', 
//         referrerPolicy: 'no-referrer',
//         body: JSON.stringify(data)
//     });

//     return response.json();
// }

function countdown(dateString) {
    // 2021-10-31
    const tripDate = new Date(dateString);
    const currentTime = Date.now();
    const timeInMs = tripDate - currentTime;

    const daysAway = Math.round(timeInMs / (1000 * 60 * 60 * 24));

    return daysAway;
}

function mapRelevantCityDetails(json) {
    // latitude, longitude, country

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
  
        //  "https://pixabay.com/get/52e5d2444b55ae14f6da8c7dda7936781d3ed7e253506c4870267ad4974fc35bba_1280.jpg"
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
        // Response
        // {
        //     city_name: "Haywards Heath"
        //     country_code: "GB"
        //     data: (16) [{app_max_temp: 21.6
        //         app_min_temp: 12.1
        //         clouds: 5
        //         clouds_hi: 0
        //         clouds_low: 5
        //         clouds_mid: 0
        //         datetime: "2020-05-31"
        //         dewpt: 6.7
        //         high_temp: 20.7
        //         low_temp: 10.8
        //         max_dhi: null
        //         max_temp: 22.4
        //         min_temp: 12.1
        //         moon_phase: 0.718711
        //         moon_phase_lunation: 0.3
        //         moonrise_ts: 1590930161
        //         moonset_ts: 1590890553
        //         ozone: 339.744
        //         pop: 0
        //         precip: 0
        //         pres: 1014.52
        //         rh: 47
        //         slp: 1021.78
        //         snow: 0
        //         snow_depth: 0
        //         sunrise_ts: 1590897359
        //         sunset_ts: 1590955210
        //         temp: 18.9
        //         ts: 1590879660
        //         uv: 4.10625
        //         valid_date: "2020-05-31"
        //         vis: 0
        //         weather: {icon: "c02d", code: 801, description: "Few clouds"}
        //         wind_cdir: "ENE"
        //         wind_cdir_full: "east-northeast"
        //         wind_dir: 69
        //         wind_gust_spd: 12.1437
        //         wind_spd: 5.96689}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        //     lat: 51
        //     lon: -0.12
        //     state_code: "ENG"
        //     timezone: "Europe/London"
        // }
        return {
            city_name: json.city_name,
            description: json.data[numDays].weather.description,
            icon: json.data[numDays].weather.icon,
            high_temp: json.data[numDays].high_temp,
            low_temp: json.data[numDays].low_temp,
        }
        // {
        //     "city_name": "London", 
        //     "description": "Overcast clouds"
        // }
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
        // return value Object London:
        // {
        //     countryName: "United Kingdom"
        //     lat: "51.50853"
        //     lng: "-0.12574"
        // }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const city = document.getElementById('location').value;

    const dateString = document.querySelector('input[type="date"]').value;
    const daysAway = countdown(dateString);

    // Wrap non-dependent calls in Promise.all to run in parallel?
    const latitudeLongitudeDetails = await fetchCityDetails(city);
    const weatherDetails = await fetchWeatherBitData(latitudeLongitudeDetails.lat, latitudeLongitudeDetails.lng, daysAway);
    const cityImageUrl = await fetchImageUrl(weatherDetails.city_name);

    // const response = await fetch('http://localhost:8082', {
    //     method: 'POST',
    //     mode: 'cors', 
    //     cache: 'no-cache',
    //     credentials: 'same-origin',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     redirect: 'follow', 
    //     referrerPolicy: 'no-referrer',
    //     body: JSON.stringify({ "data": 123 })}
    // );

    // const res = await response.json();

    document.getElementById('results').innerHTML = JSON.stringify(weatherDetails);
    // https://www.weatherbit.io/static/img/icons/{icon_code}.png
    document.getElementById('icon').innerHTML = `<img src=https://www.weatherbit.io/static/img/icons/${weatherDetails.icon}.png>`;
    document.getElementById('date-result').innerHTML = `Trip is ${daysAway} days away`;
    document.getElementById('image').innerHTML = `<img src=${cityImageUrl}>`;

    // const response = await postData(
    //     'http://localhost:8082/aylien', { url }
    // );

    // let url = document.getElementById('name').value;

    // Validate URL
    // if (Client.isValidURL(url)) {
    //     const response = await postData(
    //         'http://localhost:8082/aylien', { url }
    //     );

    //     console.log('response.polarity', response.polarity, 'response.subjectivity', response.subjectivity);
    
    //     document.getElementById('results').innerHTML = response.polarity;
    //     document.getElementById('subjectivity').innerHTML = response.subjectivity;
    // } else {
    //     document.getElementById('results').innerHTML = 'Please input a valid URL';
    // }
}

export { 
    handleSubmit, 
    fetchCityDetails,
    fetchWeatherBitData
}
