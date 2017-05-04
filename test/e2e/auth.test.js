const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('auth', () => {

    before(db.drop);

    const user = {
        email: 'me@me.com',
        password: 'now'
    };

    describe('user management', () => {

        const badRequest = (url, data, code, error) =>
            request
                .post(url)
                .send(data)
                .then(
                () => { throw new Error('status should not be okay'); },
                res => {
                    assert.equal(res.status, code);
                    assert.equal(res.response.body.error, error);
                }
                );

        it('signup requires email', () => {
            return badRequest('api/auth/signup', { password: 'now' }, 400, 'email and password must be supplied');
        });

        it('signup requires password', () => {
            return badRequest('api/auth/signup', { email: 'me@me.com' }, 400, 'email and password must be supplied');
        });

        let token = '';

        it('signup', () => {
            return request
                .post('api/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token));
        });

        it('can\'t use same email', () => {
            return badRequest('api/auth/signup', user, 400, 'email user already exists');
        });


        it('signin requires email', () => {
            return badRequest('api/auth/signin', { password: 'now' }, 400, 'email and password must be supplied');
        });

        it('signin requires password', () => {
            return badRequest('api/auth/signin', { email: 'me@me.com' }, 400, 'email and password must be supplied');
        });

        it('signin with wrong user', () => {
            return badRequest('api/auth/signin', { email: 'notme@me.com', password: user.password }, 401, 'invalid username or password');
        });

        it('signin with wrong password', () => {
            return badRequest('api/auth/signin', { email: user.email, password: 'notNow' }, 401, 'invalid username or password');
        });

        it('signin', () => {
            return request
                .post('api/auth/signin')
                .send(user)
                .then(res => assert.ok(res.body.token));
        });


        it('token is invalid', () => {
            return request
                .get('api/auth/verify')
                .set('Authorization', 'bad token')
                .then(
                () => { throw new Error('success response not expected'); },
                (res) => { assert.equal(res.status, 401); });
        });

        it('token is valid', () => {
            return request
                .get('api/auth/verify')
                .set('Authorization', token)
                .then(res => assert.ok(res.body));
        });


    });

    describe('unauthorized', () => {

        it('401 with no token', () => {
            return request
                .get('/breweries')
                .then(
                () => { throw new Error('status should not be 200'); },
                res => {
                    assert.equal(res.status, 401);
                    assert.equal(res.response.body.error, 'Unauthorized');
                }
                );
        });

        it('403 with invalid token', () => {
            return request
                .get('/breweries')
                .set('Authorization', 'badtoken')
                .then(
                () => { throw new Error('status should not be 200'); },
                res => {
                    assert.equal(res.status, 401);
                    assert.equal(res.response.body.error, 'Unauthorized');
                }
                );
        });

    });


});