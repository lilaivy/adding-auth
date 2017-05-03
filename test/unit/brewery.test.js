const assert = require('assert');
const Brewery = require('../../lib/models/brewery');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Brewery validations', () => {

    it('validates brewery name', () => {
        const testBrewery = new Brewery({
            name: 'fakeBrewery',
            neighborhood: 'Kerns',
        });
        return testBrewery.validate();
    });

});

describe('validation failures', () => {

    it('requires film title and release year', () => {
        const brewery = new Brewery();
        return brewery.validate()
            .then(expectedValidation,
            err => {
                const errors = err.errors;
                assert.ok(errors.name && errors.name.kind === 'required');
                assert.ok(errors.neighborhood && errors.neighborhood.kind === 'required');

            });

    });

});