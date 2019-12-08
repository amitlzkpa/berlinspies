require('dotenv').config(); // read .env files
const express = require('express');
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




const jsonServer = require('json-server');
const middlewares = jsonServer.defaults()


const fahrFile = './support_data/fahrplan/sample.json';
const fahrServer = jsonServer.create();

fahrServer.use(middlewares);
fahrServer.use(jsonServer.router(fahrFile));
fahrServer.listen(5000, () => {
  console.log('JSON fahrServer is running')
});


const stnFile = './support_data/stada/local-server/stada_stations.json';
const stnServer = jsonServer.create();
 
stnServer.use(middlewares);
stnServer.use(jsonServer.router(stnFile));
stnServer.listen(4000, () => {
  console.log('JSON stnServer is running')
});