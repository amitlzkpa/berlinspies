require('dotenv').config(); // read .env files
const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');
const favicon = require('serve-favicon');


const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(favicon(__dirname + '/public/favicon.ico'));


// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Redirect all traffic to index.html
app.all('/', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
	console.log('listening on %d', port);
});




// Setup support fahrplan json files
const fahrFile = './support_data/fahrplan/sample.json';
app.use('/fahr', jsonServer.router(fahrFile));


// Setup support stations json files
const stnFile = './support_data/stada/stada_stations(cleaned).json';
app.use('/stn', jsonServer.router(stnFile));