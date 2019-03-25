const h3 = require('h3-js');
const geohash = require('ngeohash');


var resolution = 3

var map = L.map('mapid').setView([0.0, 0.0], resolution);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    draw: {
      circlemarker: false,
      marker: false
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

var hexStyle = {
  "color": "#000000",
  "fillColor": "#ff4756",
  "opacity": 0.8
}

function calcBounds (coords) {
  var xvals = []
  var yvals = []
  coords.map(x => xvals.push(x[0]))
  coords.map(y => yvals.push(y[1]))
  const xmin = Math.min(...xvals)
  const xmax = Math.max(...xvals)
  const ymin = Math.min(...yvals)
  const ymax = Math.max(...yvals)
  return [ymin, xmin, ymax, xmax]
}

function h3Polyfill (layer) {
  var hexagons = h3.polyfill(layer.toGeoJSON().geometry.coordinates[0], resolution)
  console.log("Number of hexagons: " + hexagons.length)
  if (document.getElementById("togBtn").checked === true) {
    var compacted = h3.compact(hexagons)
    var hexagons = compacted
    console.log("Number of compacted hexagons: " + hexagons.length)

  };
  for (i=0; i<hexagons.length; i++) {
    var index = hexagons[i]
    var geometry = h3.h3SetToMultiPolygon([index], true)
    var polygon = L.polygon(geometry, {'color': 'red'}).addTo(drawnItems)
  }
}

function geohashPolyfill (layer) {
  var coords = layer.toGeoJSON().geometry.coordinates[0]
  var bounds = calcBounds(coords)
  var hashes = geohash.bboxes(...bounds, resolution)

  for (i=0; i<hashes.length; i++) {
    var hashBounds = geohash.decode_bbox(hashes[i]);
    var extentCoords = [[hashBounds[2], hashBounds[1]], [hashBounds[2], hashBounds[3]], [hashBounds[0], hashBounds[3]], [hashBounds[0], hashBounds[1]], [hashBounds[2], hashBounds[1]]];
    var gHashPoly = L.polygon(extentCoords).addTo(drawnItems);
    gHashPoly.setStyle({'color': 'green'})
  }
}

function checkToggle () {
  if (document.getElementById('GeohashToggle').checked) {
    return geohashPolyfill
  } else if (document.getElementById('H3Toggle').checked) {
    return h3Polyfill
  }
}

// Draw handler
map.on(L.Draw.Event.CREATED, function (e) {
  var polyfill = checkToggle()
  polyfill(e.layer)
  drawnItems.addLayer(e.layer)
})


// NoUI Slider
var slider = document.getElementById('slider')

noUiSlider.create(slider, {
    start: resolution,
    step: 1,
    connect: [true, false],
    range: {
        'min': 0,
        'max': 15
    },
    pips: {
      mode: 'count',
      values: 16,
      stepped: true,
    }
});

// Handler to update resolution value
slider.noUiSlider.on('update', function(values, handle) {
  resolution = Number(values[0])
})
