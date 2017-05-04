const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        require: true
    }
});

//Middleware function to determine if something exists or not
schema.static('exists', function (query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

//middleware function to generate hash
//QUESTION: is 8 an arbitrary number representing how many character will be in hash?
schema.method('generateHash', function (password) {
    this.hash = bcrypt.hashSync(password, 8);
});

//middleware function to compare password with generated hash
schema.method('comparePassword', function (password) {
    return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('User', schema);