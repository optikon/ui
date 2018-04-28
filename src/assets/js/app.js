import $ from 'jquery';
import whatInput from 'what-input';
import Foundation from 'foundation-sites';


// ------------------------------------------------------------------------------------------
//                           Init
// ------------------------------------------------------------------------------------------

var map;

var GOOGLE_MAP_KEY;
var OPTIKON_API_URL;
getVars();

window.$ = $;
$(document).foundation();
window.onload = init;
setInterval(updateUI, 500); // update every 500 ms

function init() {
  initMap();
  populateTables();
}

//  periodically update cluster + charts without having to refresh the page
function updateUI() {
  populateTables()
}


function getVars() {
  $.getJSON( "env.json", function( data ) {
        GOOGLE_MAP_KEY = data["GOOGLE_MAP_KEY"];
        OPTIKON_API_URL = data["OPTIKON_API_URL"];
});
}


// ------------------------------------------------------------------------------------------
//                          Google maps API -- cluster map
// ------------------------------------------------------------------------------------------

function initMap() {
  var tag = document.createElement('script');
  tag.src =   "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAP_KEY + "&callback=createMap";
  tag.defer = true;
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// ------------------------------------------------------------------------------------------
//                          Tables
// ------------------------------------------------------------------------------------------

function populateTables() {
  updateClusterTable()
  updateReleasesTable()
}



// inline updates on refresh

function updateClusterTable()  {
  $.get(OPTIKON_API_URL + "/v0/clusters",
    function(data) {
      data.forEach(function(c) {
        // if new clusters, make a new row
        if($("#" + c.metadata.name ).length == 0) {
          //it doesn't exist
          var newrow = '<tr id="' + c.metadata.name + '"><td>' + c.metadata.name + '</td><td id="' + c.metadata.name + '-clusterLabels">' + JSON.stringify(c.metadata.labels) + '</td><td>' + '<span class="badge success">✔</span>' + '</td><td id="' + c.metadata.name + '-clusterNumPods">' + c.metadata.annotations.NumPods +  '</td></tr>'
          $('#clustable tr:last').after(newrow);
        } else {
          // exists -- do an inline update of num pods
          var pods = $('#' + c.metadata.name + "-clusterNumPods")
          pods.text(c.metadata.annotations.NumPods)
        }
      });
    })
}


function updateReleasesTable() {
  var dictionary = {};
  $.get(OPTIKON_API_URL + "/v0/releases",
    function(data) {
      data.forEach(function(r) {

        var rID = r.Name + r.OnCluster;
        dictionary[rID] = rID;

        if($("#" + rID).length == 0) {
        var newrow = '<tr class="releaseRow" id="' + rID + '"><td>' + r.Name + '</td><td id="' + rID + '-version">' + r.Version + '</td><td id="' + rID + '-chartName">'  + r.Chart.Metadata.Name + '</td><td id="' + rID + '-chartVersion">' + r.Chart.Metadata.Version + '</td><td>' + r.OnCluster +  '</td></tr>'
        $('#releaseTable tr:last').after(newrow);
    } else {
      var releaseV = $('#' + rID + "-version")
      releaseV.text(r.Version)

      var chartName = $('#' + rID + "-chartName")
      chartName.text(r.Chart.Metadata.Name)

      var chartV = $('#' + rID + "-chartVersion")
      chartV.text(r.Chart.Metadata.Version)
        }
      });
      // follow up by pruning the releases table with releases
      $('.releaseRow').each(function() {
        var id =  $(this).attr('id');
        if (!(id in dictionary)) {
          console.log("deleting #" + id)
          $('#' + id).remove()
        }
      });
    })
}


// ------------------------------------------------------------------------------------------
//                          Helm Chart Button Handlers
// ------------------------------------------------------------------------------------------

$("#postRelease").click(function() {
  var data = new FormData();
    data.append("name", $('#chartName').val());
    data.append("chartTar", document.getElementById("chartLoc").files[0]);
    data.append("namespace", $('#chartNamespace').val());

    var labels = $('#chartLabels').val();
    var append = "";
    if (labels != "") {
      append = "?labels="+labels;
    }

    console.log(OPTIKON_API_URL + '/v0/releases'+append)

  jQuery.ajax({
      url: OPTIKON_API_URL + '/v0/releases'+append,
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST'
  });
});


$("#updateRelease").click(function() {
  var data = new FormData();
  var name = $('#chartName').val()
      data.append("name", name);
      data.append("chartTar", document.getElementById("chartLoc").files[0]);
      data.append("namespace", $('#chartNamespace').val());

    var labels = $('#chartLabels').val();
    var append = "";
    if (labels != "") {
      append = "?labels="+labels;
    }

    var updateUrl = OPTIKON_API_URL + '/v0/releases/'+name+append;
    console.log("updating release: " + updateUrl)

  jQuery.ajax({
      url: updateUrl,
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'PUT',
      type: 'PUT'
  });
});

$("#deleteRelease").click(function() {
  var name = $('#delInput').val()

  var labels = $('#delChartLabels').val();
  var append = "";
  if (labels != "") {
    append = "?labels="+labels;
  }

  var deleteUrl = OPTIKON_API_URL + '/v0/releases/'+name+append
  console.log("deleting release: " + deleteUrl)

  jQuery.ajax({
      url: deleteUrl,
      cache: false,
      contentType: false,
      processData: false,
      method: 'DELETE',
      type: 'DELETE'
  });
});
