const express = require('express');
const app = express(); //calling express here is what creates the express app
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handlers/error-handler');
const ensureAuth = require('./auth/ensure-auth')();



app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/status', (req, res) => { //QUESTION: this tells us that server is up and running?
    res.send('ok');

});

const breweries = require('./routes/breweries');
const auth = require('./routes/auth');

app.use('/api/auth', auth);
app.use('/api/breweries', ensureAuth, breweries);

app.use(errorHandler());

module.exports = app;