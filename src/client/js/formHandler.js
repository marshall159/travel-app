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
        body: JSON.stringify(event.target)}
    );

    document.getElementById('results').innerHTML = response;

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

export { handleSubmit }
