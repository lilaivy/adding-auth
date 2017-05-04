const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe.only('user model', () => {

    it('new user generates hash', () => {
        const user = new User({
            email: 'me@me.com'
        });
        const password = 'whatevs';
        user.generateHash(password);

        assert.notEqual(user.hash, password);
        
        assert.isOk(user.comparePassword('whatevs'));
        assert.isNotOk(user.comparePassword('bad password'));
        
    });
    
});