const request = require('supertest');
const server = require('../server/server');
 
describe('GET /', () => {
    it('returns 200', done => {
        request(server)
            .get('/')
            .expect(200, done);
    });
});
