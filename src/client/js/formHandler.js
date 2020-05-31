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

function mapRelevantCityDetails(json) {
    // latitude, longitude, country

    const { lat, lng, countryName } = json.geonames[0];

    return {
        lat, 
        lng, 
        countryName
    }
}

async function fetchCityDetails(city) {
    const BASE_API_PATH = `http://api.geonames.org/searchJSON`;
    const query = `?q=${city}&username=marshall159`;
    const url = BASE_API_PATH + query;

    const response = await fetch(url);

    try {
        const json = await response.json();
        return mapRelevantCityDetails(json);
        // return json;
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch('http://localhost:8082', {
        method: 'POST',
        mode: 'cors', 
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ "data": 123 })}
    );

    const res = await response.json();

    document.getElementById('results').innerHTML = JSON.stringify(res);

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
    fetchCityDetails
}
