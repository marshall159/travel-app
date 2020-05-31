var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 8082;
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const WEATHERBIT_API = process.env.WEATHERBIT_API || '';

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});

app.post('/', function (req, res) {
    console.log('Request to POST /');
    res.json(mockAPIResponse);
});

app.get('/weather/:lat/:lon', async (req, res) => {
    const { lon, lat } = req.params;
    
    const BASE_API_PATH = `https://api.weatherbit.io/v2.0/forecast/daily`;
    const query = `?&lat=${lat}&lon=${lon}`;
    const url = BASE_API_PATH + query + `&key=${WEATHERBIT_API}`;

    try {
        const response = await fetch(url);
        const json = await response.json();
        return res.json(json);
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
});

app.listen(PORT, function () {
    console.log(`Travel app listening on port ${PORT}!`);
});
