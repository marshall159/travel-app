var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 8082;
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});

app.post('/', function (req, res) {
    res.json(mockAPIResponse);
});

app.listen(PORT, function () {
    console.log(`Travel app listening on port ${PORT}!`);
});
