const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    name: {
        type: String,
        required: true,
    },

    neighborhood: {
        type: String,
        required: true,
    },

    specialties:[{
        type: String
    }]

});

module.exports = mongoose.model('Brewery', schema);