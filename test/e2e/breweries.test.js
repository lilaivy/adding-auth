const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('breweries api', () => {

    before(db.drop);

    it('initial /GET returns empty list', () => {
        return request
            .get('/api/breweries')
            .then(res => {
                const breweries = res.body;
                assert.deepEqual(breweries, []);
            });
    });


});