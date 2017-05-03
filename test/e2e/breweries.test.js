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

    let fakeBrewery1 = {
        name: 'Breakside',
        neighborhood: 'Woodlawn',
        specialties: ['pilsner', 'ipa', 'seasonal'],
    };
    // let fakeBrewery2 = {
    //     name: 'Cascade',
    //     neighborhood: 'Buckman',
    //     specialties: ['sours', 'seasonal'],
    // };
    // let fakeBrewery3 = {
    //     name: 'Commons',
    //     neighborhood: 'Central SE',
    //     specialties: ['farmhouse', 'saizon'],
    // };

    function saveBrewery(brewery) {
        return request
            .post('/api/breweries')
            .send(brewery)
            .then(res => res.body);
    }

    it('roundtrips a new brewery', () => {
        return saveBrewery(fakeBrewery1)
            .then(savedBrewery => {
                assert.ok(savedBrewery._id, 'saved brewery has an id');
                fakeBrewery1 = savedBrewery;
            })
            .then(() => {
                return request.get(`/api/breweries/${fakeBrewery1._id}`);
            })
            .then(res => res.body)
            .then(gotBrewery => {
                assert.deepEqual(gotBrewery, fakeBrewery1);
            });
    });




});