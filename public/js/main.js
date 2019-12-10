




/**
                    
                    
   __ _ _ __  _ __  
  / _` | '_ \| '_ \ 
 | (_| | |_) | |_) |
  \__,_| .__/| .__/ 
       |_|   |_|    


**/




mapboxgl.accessToken = 'pk.eyJ1IjoiYW1pdGx6a3BhIiwiYSI6ImNpZmN6ZW12ZzRvYTFzeG03ZDdkNzd5d2oifQ.FxgL_waU-ZRhhtQdeOvtcA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/amitlzkpa/ck3xuvxpf6hvm1dnrt3c7quth',
  center: [9.68, 50.8],
  zoom: 5.3,
  minZoom: 0,
  maxZoom: 18,
  // hash: true
});

let nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');




function Player(name, startLoc, type, startCash, data) {
  this.name = name;
  this.location = startLoc;
  this.type = type || 'cop';
  this.cash = startCash || 100;
  this.data = data || {};
}



let players = [
  new Player("The Spy from Lesotho 🕵️", [13.492286, 52.636162], 'spy', 10000),
  new Player("Allied Agent", [7.537458, 51.518768], 'cop', 1000),
  new Player("Axis Agent", [7.007252, 51.48437], 'cop', 1000)
];


let winner = null;


let currPIdx = 0;
let currTime = new Date(1942, 11, 9, 0, 0, 0, 0)
let turnIdx = 0;
let lastTurn = 100;
let noBlindGap = 17;

let currChoices = [];
let currPMrkr = null;
let choicePopups = [];

let copMrkrs = [];
let spyMrkrs = [];



async function moveHere(pos, price) {
  if (players[currPIdx].cash - price < 0) {
    players[currPIdx].cash = 0;
    $("#message").text(`Not enough cash. You are out, press skip.`);
    return;
  }
  players[currPIdx].location = pos;
  players[currPIdx].cash -= price;
  var j = JSON.stringify(players[currPIdx]);
  console.log(j);
  var options = {
    encrypt: false
  };
  var q = await session.putFile('test-file.json', j, options);
  console.log(q);
  await moveCounters();
  await step();
}


$("#skipBtn").on('click', async function(event) {
  await moveCounters();
  await step();
})


function moveCounters() {

  // check if caught
  if ((getDistance(players[0].location, players[1].location) < 0.02) ||
    (getDistance(players[0].location, players[2].location) < 0.02)) {
    winner = players[currPIdx];
  }

  // check out of turns
  if (turnIdx >= lastTurn - 1) {
    winner = players.filter(p => p.type === 'spy')[0];
  }

  if (winner !== null) {
    $("#message").text(`Game Over!! ${winner.name} wins`);
    return;
  }

  currTime = currTime.addDays(1);
  currTime = currTime.addHours(1);
  currPIdx++;
  currPIdx %= players.length;
  turnIdx++;
}


async function clear() {
  if (currPMrkr) currPMrkr.remove();
  currChoices.forEach(m => m.remove());
  currChoices = [];
  choicePopups.forEach(m => m.remove());
  choicePopups = [];
  copMrkrs.forEach(m => m.remove());
  copMrkrs = [];
  spyMrkrs.forEach(m => m.remove());
  spyMrkrs = [];
}


async function step() {

  // if (winner !== null) {
  //   $("#message").text(`Game Over!! ${winner.name} wins`);
  //   return;
  // }

  // clear board
  await clear();

  // console.log(turnIdx);
  // console.log(players[currPIdx]);

  // update board with current players details
  let currPMkEl = document.createElement('div');
  currPMkEl.className = 'currPMarker';
  currPMrkr = new mapboxgl.Marker(currPMkEl)
    .setLngLat(players[currPIdx].location)
    .addTo(map);
  $("#currPName").text(players[currPIdx].name);
  $("#currPCash").text(players[currPIdx].cash);
  $("#currTime").text(`${currTime.toDateString()}`);
  $("#turnIdx").text(`${turnIdx + 1}/${lastTurn}`);
  $("#noBlinds").text(`No blinds in: ${noBlindGap - (turnIdx % noBlindGap)} turns`);


  let playerPopup = `<h4>${players[currPIdx].name}</h4>
                      <br />
                      <p>Cash: ${players[currPIdx].cash}</p>`;
  new mapboxgl.Marker(currPMkEl)
    .setLngLat(players[currPIdx].location)
    .setPopup(new mapboxgl.Popup({
        offset: 25
      })
      .setHTML(playerPopup))
    .addTo(map);


  let isSpy = (players[currPIdx].type === 'spy');

  // show all cops
  let copPlayers = players.filter(p => p.type === 'cop');
  for (let i = 0; i < copPlayers.length; i++) {
    let p = copPlayers[i];
    let copMkEl = document.createElement('div');
    copMkEl.className = 'copMarker';
    let copMrkr = new mapboxgl.Marker(copMkEl)
      .setLngLat(p.location)
      .addTo(map);
    copMrkrs.push(copMrkr);
  }

  // if spy or noBlindGapth turn show spy
  if (isSpy || (turnIdx % noBlindGap === 0)) {

    let spyPlayers = players.filter(p => p.type === 'spy');
    for (let i = 0; i < spyPlayers.length; i++) {
      let p = spyPlayers[i];
      let spyMkEl = document.createElement('div');
      spyMkEl.className = 'spyMarker';
      let spyMrkr = new mapboxgl.Marker(spyMkEl)
        .setLngLat(p.location)
        .addTo(map);
      spyMrkrs.push(spyMrkr);
    }

  }


  // get list of departures available to current player
  let departures = (await $.get(`/fahr/DepartureBoard`)).Departure;
  let lim = [3, 8, 12][(Math.floor(Math.random() * 3))]; // number of trains out


  // update board with available options
  for (let i = 0; i < lim; i++) {
    let dep = departures[i];
    // console.log(dep);
    let dstName = dep.stop;
    dstName = dstName.replace('(', ' (').replace(')', ') ');
    while (dstName.indexOf('  ') != -1)
      dstName = dstName.replace('  ', ' ');
    let dstStnData = (await $.get(`/stn/stations?name=${dstName}`))[0];

    let loc = dstStnData.evaNumbers[0].geographicCoordinates;
    let price = dstStnData.priceCategory * 100;

    let chMarkerEl = document.createElement('div');
    chMarkerEl.className = 'choiceMarkers';
    let chMrkr = new mapboxgl.Marker(chMarkerEl)
      .setLngLat(loc.coordinates)
      .addTo(map);

    let choicePopupHtml = `<h4>${dstName}</h4>
                       <br />
                       <p>Price: ${price}</p>
                       <br />
                       <button class="btn btn-secondary"
                               onclick="moveHere([${loc.coordinates[0]}, ${loc.coordinates[1]}], ${price})">Move Here</button>`;
    let choicePopup = new mapboxgl.Popup({
        offset: 25
      })
      .setHTML(choicePopupHtml);
    choicePopups.push(choicePopup);

    new mapboxgl.Marker(chMarkerEl)
      .setLngLat(loc.coordinates)
      .setPopup(choicePopup)
      .addTo(map);

  }


}


step();