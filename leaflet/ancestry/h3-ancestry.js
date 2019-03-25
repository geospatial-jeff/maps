const h3 = require('h3-js');
const geohash = require('ngeohash');
const drawS2 = require('s2-cell-draw');
const S2 = require('s2-geometry').S2;

var map = L.map('mapid').setView([0, 0], 4);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    draw: {
      polygon: false,
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

var h3Style = {
  "color": "#000000",
  "fillColor": "#ff4756",
  "opacity": 0.8
}

var s2Style = {
  "color": "#000000",
  "fillColor": "#4750ff",
  "opacity": 0.8
}

var geohashStyle = {
  "color": "#000000",
  "fillColor": "#5cff47",
  "opacity": 0.8
}

function generateGeohash (pt) {
  for (i=1; i<13; i++) {
    var geoHash = geohash.encode(pt.lat, pt.lng, i);
    var hashBounds = geohash.decode_bbox(geoHash); //[ymin, xmin, ymax, xmax]
    var extentCoords = [[hashBounds[2], hashBounds[1]], [hashBounds[2], hashBounds[3]], [hashBounds[0], hashBounds[3]], [hashBounds[0], hashBounds[1]], [hashBounds[2], hashBounds[1]]];
    var gHashPoly = L.polygon(extentCoords).addTo(drawnItems);
    gHashPoly.setStyle(geohashStyle);
  }
};

function generateH3 (pt) {
  for (i=0; i<16; i++) {
      var index = h3.geoToH3(pt.lat, pt.lng, i)
      var poly = {
        "type": "Polygon",
        "coordinates": h3.h3SetToMultiPolygon([index], true)[0]
      }
      var hexCell = L.geoJSON(poly).addTo(drawnItems)
      hexCell.setStyle(h3Style);
    }
}

function generateS2 (pt) {
  for (i=2; i<20; i++) {
    var key = S2.latLngToKey(pt.lat, pt.lng, i)
    var path = drawS2.deboxByKey(key)
    var extentCoords = path.path
    extentCoords.map(x => x.reverse())
    extentCoords.push(extentCoords[0])

    var s2Cell = L.polygon(extentCoords).addTo(drawnItems);
    s2Cell.setStyle(s2Style);
  }
}

function checkToggle () {
  if (document.getElementById('GeohashToggle').checked) {
    return generateGeohash
  } else if (document.getElementById('H3Toggle').checked) {
    return generateH3
  } else if (document.getElementById('S2Toggle').checked) {
    return generateS2
  }
}

map.on(L.Draw.Event.CREATED, function(e) {
  var pt = e.layer.getLatLng();
  var generator = checkToggle()
  generator(pt)

  drawnItems.addLayer(e.layer)
})
