import $ from 'jquery';
import whatInput from 'what-input';
import Foundation from 'foundation-sites';


// ------------------------------------------------------------------------------------------
//                           Init
// ------------------------------------------------------------------------------------------

window.$ = $;
window.onload = init;
$(document).foundation();

function init() {
  populateTables()
}

//  periodically update cluster + charts without having to refresh the page
// TODO - also update map periodically
function updateUI() {
  updateClusterTable()
  updateReleasesTable()
}


// ------------------------------------------------------------------------------------------
//                          Tables
// ------------------------------------------------------------------------------------------

// Do an initial GEt clusters
function populateTables() {
  updateClusterTable()
  updateReleasesTable()
}

var AllClusters  = "";


function updateClusterTable()  {
  $.get("http://172.16.7.101:30900/v0/clusters",
    function(data) {
      data.forEach(function(c) {
        AllClusters += "  " + c.metadata.name
        var newrow = '<tr><td>' + c.metadata.name + '</td><td>' + JSON.stringify(c.metadata.labels) + '</td><td>' + '<span class="badge success">✔</span>' + '</td><td>' + c.metadata.annotations.NumPods +  '</td></tr>'
        $('#clustable tr:last').after(newrow);
      });
    })
}

function updateReleasesTable() {
  $.get("http://172.16.7.101:30900/v0/releases",
    function(data) {
      data.forEach(function(r) {
        var newrow = '<tr><td>' + r.Name + '</td><td>' + r.Version + '</td><td>'  + r.Chart.Metadata.Name + '</td><td>' + r.OnCluster +  '</td></tr>'
        $('#releaseTable tr:last').after(newrow);
      });
    })
}


// ------------------------------------------------------------------------------------------
//                          Helm Chart Button Handlers
// ------------------------------------------------------------------------------------------

$("#postRelease").click(function() {
  var data = new FormData();
    data.append("name", $('#chartName').val());
    data.append("chartTar", document.getElementById("chartLoc").files[0]);      data.append("namespace", $('chartNamespace').val());


    var labels = $('#chartLabels').val();
    var append = "";
    if (labels != "") {
      append = "?labels="+labels;
    }

    console.log('http://172.16.7.101:30900/v0/releases'+append)

  jQuery.ajax({
      url: 'http://172.16.7.101:30900/v0/releases'+append,
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
      data.append("namespace", $('chartNamespace').val());

  jQuery.ajax({
      url: 'http://172.16.7.101:30900/v0/releases/'+name,
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'PUT',
      type: 'PUT'
  });
});
