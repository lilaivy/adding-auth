const jwt = require('jsonwebtoken-promisified');
// This is our app secret that enables our tokens to be "untampered with"
const appSecret = process.env.APP_SECRET || 'change-me';

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            email: user.email, //QUESTION: do I need to include user password?  Or is it now deleted?
            hash: user.hash
        };
        
        // returns the token
        return jwt.signAsync(payload, appSecret);
    },
    verify(token) {
        // returns the payload
        return jwt.verifyAsync(token, appSecret);
    }
};