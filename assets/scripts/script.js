
/* GLOBAL VARIABLES */
/******************** */

let routeCost;
let originLat;
let originLon;
let destinationLat;
let destinationLon;
let routeDistance;
let routeDistanceMiles;
let mpg = 25;

/********************* */

$(document).ready(function() {
  let directionsURL =
    "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/";
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFnaWFtYTkiLCJhIjoiY2s1ZTQ5eTd0MDBmMjNsbm00dTQ4cWcydCJ9.Fsow7km2bw_bHw0r7jtPlw";
  let directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  });

  // CREATES A NEW MAPBOX MAP OBJECT AND ADDS IT TO THE GIVEN CONTAINER
  let map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: [-77.1, 38.9], // starting position [lng, lat]
    zoom: 13 // starting zoom
  });

  // HANDLES EVENTS FOR WHEN THE MAP FINISHES LOADING AND ADDS CONTROLS TO THE MAP USING MAPBOX DIRECTIONS GL PLUGIN
  map.on("load", function() {
    map.addControl(directions, "top-left");

    console.log(directions);
    console.log(this);
    $("#testButton").on("click", function() {
      let routeOrigin = directions.getOrigin();
      let routeDestination = directions.getDestination();
      originLon = routeOrigin.geometry.coordinates[0];
      originLat = routeOrigin.geometry.coordinates[1];
      destinationLat = routeDestination.geometry.coordinates[1];
      destinationLon = routeDestination.geometry.coordinates[0];
      console.log(
        "Origin Longitude is: " +
          destinationLon +
          " and Origin Latitude is: " +
          destinationLat
      );
      getDistance();
    });
  });

  // CALLS MAPBOX DIRECTIONS API AND FETCHES THE ROUTE OBJECT OF THE USER INPUTTED ROUTE
  function getDistance() {
    $.ajax({
      url:
        directionsURL +
        originLon +
        "%2C" +
        originLat +
        "%3B" +
        destinationLon +
        "%2C" +
        destinationLat +
        ".json?",
      method: "GET",
      data: {
        access_token: mapboxgl.accessToken
      },
      success: function(response) {
        console.log(response);

        // ROUTE DISTANCE IS RETURNED IN METERS
        routeDistance = response.routes[0].distance;
        metersToMiles(routeDistance);
        console.log(routeDistanceMiles);
        fuelCalc();
      },
      error: function() {
        console.log("ERROR");
      }
    });
  }

  function fuelCalc() {
    $.ajax({
      url: "https://api.collectapi.com/gasPrice/stateUsaPrice?state=",
      headers: {
        Authorization: "apikey 55SVU23jWoKSVlomDEpsDd:1QM5eehk7qfVyvGcT43zVo",
        method: "GET",
        data: {}
      }
    }).then(function(response) {
      
      var totalDistance = parseInt(routeDistanceMiles);
      console.log(response);
      routeCost = (
        (totalDistance / mpg) *
        response.result.state.gasoline
      ).toFixed(2);
    });
  }
  // CONVERTS A VALUE IN METERS TO THE EQUIVALENT VALUE IN MILES WITH TWO DECIMAL POINTS
  // N.B. THE VALUE RETURNED IS A __STRING__
  function metersToMiles(num) {
    routeDistanceMiles = (num / 1609.34).toFixed(2);
  }
});
