/* eslint no-console: "off"*/
const app = require('./lib/app');
const http = require('http');

const connect = require('./lib/connect');
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/breweries';
connect(dbUri);

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('server running on', server.address());

});

