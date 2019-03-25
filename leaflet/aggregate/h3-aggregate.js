const h3 = require('h3-js')

var map = L.map('mapid').setView([37, -96], 3);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var drawnItems = new L.FeatureGroup().addTo(map);

// color tables
function getColor2(d) {
    return d > 209 ? '#08306b' :
           d > 128  ? '#2879b9' :
           d > 82  ? '#73b3d8' :
           d > 35  ? '#c8ddf0' :
                    '#f7fbff' ;
}

function getColor3(d) {
    return d > 26 ? '#08306b' :
           d > 14  ? '#2879b9' :
           d > 8  ? '#73b3d8' :
           d > 3  ? '#c8ddf0' :
                    '#f7fbff' ;
}

function getColor4(d) {
    return d > 7 ? '#08306b' :
           d > 3  ? '#2879b9' :
           d > 1  ? '#73b3d8' :
           d > 0  ? '#c8ddf0' :
                    '#f7fbff' ;
}

function getColor5(d) {
    return d > 5.6 ? '#08306b' :
           d > 4.2  ? '#2879b9' :
           d > 2.8  ? '#73b3d8' :
           d > 1.4  ? '#c8ddf0' :
                    '#f7fbff' ;
}


function genTiles (res, color) {
  $.getJSON('usa-citycount-' + res + '-uncompact.geojson', function (data) {
    var tiles = L.vectorGrid.slicer(data, {
      vectorTileLayerStyles: {
        sliced: function (properties) {
          var hexCode = color(properties.citycount)
          return {
            fillColor: hexCode,
            color: 'black',
            fill: true,
            weight: 2,
            opcity: 1,
            fillOpacity: 0.7,
          }
        }
      }
    }).addTo(drawnItems);
    });
};

function clearLayers(group) {
  group.eachLayer(function (layer) {
    group.removeLayer(layer)
  })
}

genTiles(2, getColor2)

// zoom handler
map.on('zoomend', function() {
  var zoom = map.getZoom();
  if (zoom == 4) {
    clearLayers(drawnItems)
    genTiles(2, getColor2)
  } else if (zoom == 5) {
    clearLayers(drawnItems)
    genTiles(3, getColor3)
  } else if (zoom == 7) {
    clearLayers(drawnItems)
    genTiles(4, getColor4)
  } else if (zoom == 9) {
    clearLayers(drawnItems)
    genTiles(5, getColor5)
  }
})
