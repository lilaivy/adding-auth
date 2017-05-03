/* eslint no-console: "off" */
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbUri = process.env.MONGODB_URI || 'mongodb://localhouse:27017/authentication-lab';

mongoose.connect(dbUri);

mongoose.connection.on('connected', function () {
    console.log('Mongoose default bonnection open to ' + dbUri);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function (err) {
    console.log('Mongoose default connection disconnected: ' + err);
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

