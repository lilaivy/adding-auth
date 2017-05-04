const db = require('./db');
const request = require('./_request');
const assert = require('chai').assert;


describe('breweries api', () => {

    before(db.drop);

    let token = '';
    before(() => {
        return request.post('/api/auth/signup')
            .send({ email: 'ivy@me.com', password: 'now' })
            .then(res => {
                token = res.body.token;
            });

    });

    function seedData(url, data) {
        return request.post(url).send(data).set('Authorization', token);

    }

    let brewery;
    before(() => {
        seedData('/api/breweries', { name: 'Migration', neighborhood: 'Kerns' });
    })
        .then(results => results.map(res => res.body))
        .then(bodies => {
            brewery = bodies;
        });

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
    let fakeBrewery2 = {
        name: 'Cascade',
        neighborhood: 'Buckman',
        specialties: ['sours', 'seasonal'],
    };
    let fakeBrewery3 = {
        name: 'Commons',
        neighborhood: 'Central SE',
        specialties: ['farmhouse', 'saizon'],
    };

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

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/api/breweries/${fakeId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    it('returns list of all brweries', () => {
        return Promise.all([
            saveBrewery(fakeBrewery2),
            saveBrewery(fakeBrewery3)
        ])
            .then(savedBrewery => {
                fakeBrewery2 = savedBrewery[0];
                fakeBrewery3 = savedBrewery[1];
            })
            .then(() => request.get('/api/breweries'))
            .then(res => res.body)
            .then(breweries => {
                assert.equal(breweries.length, 3);
                function test(fakeBrewery) {
                    assert.include(breweries, {
                        name: fakeBrewery.name,
                        _id: fakeBrewery._id,
                        neighborhood: fakeBrewery.neighborhood,
                        specialties: fakeBrewery.specialties,
                    });
                }

                test(fakeBrewery1);
                test(fakeBrewery2);
                test(fakeBrewery3);
            });
    });

