

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYjFkZDEyNS0xZTU4LTRmOTgtYTdiMi02MTkwZDhiOWIzMzQiLCJpZCI6ODAwMCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1MDk1NTk1Nn0.dbBbUGJzIR_LquV2h2fTWLrrYRHXEt3rMWVwTg3rzAQ';
var viewer = new Cesium.Viewer('cesiumContainer');

function params () {
  return {
    orbit_count: Number(document.getElementById("orbitcount").value),
    speed: Number(document.getElementById("speed").value),
  }
};

function clickHandler (event) {
  var endpoint = 'https://itmi11xp11.execute-api.us-east-1.amazonaws.com/dev/' + event.target.id;
  $.ajax({
    type: 'POST',
    url: endpoint,
    crossDomain: true,
    data: JSON.stringify(params()),
    dataType: 'json',
    success: function(responseData, textStatus, jqXHR) {
      console.log(responseData)
      for (var key in responseData) {
        var czmlSource = new Cesium.CzmlDataSource()
        czmlSource.load(responseData[key])
        viewer.dataSources.add(czmlSource)
      }
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log(errorThrown)
    }
  });
}

$(document).on('click', '.btn-group', clickHandler)
