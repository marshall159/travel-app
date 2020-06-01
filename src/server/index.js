const server = require('./server');

const PORT = process.env.PORT || 8082;

server.listen(PORT, function () {
    console.log(`Travel app listening on port ${PORT}!`);
});