const express = require('express');
const app = express(); //calling express here is what creates the express app
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/status', (req, res) => { //Q: this tells us that server is up and running?
    res.send('ok');

});

const breweries = require('./routes/breweries');

app.use('/api/breweries', breweries);

module.exports = app;