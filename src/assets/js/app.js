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
  updateChartsTable()
}


// ------------------------------------------------------------------------------------------
//                          Tables
// ------------------------------------------------------------------------------------------


// Do an initial GEt clusters
function populateTables() {
  updateClusterTable()
  updateChartsTable()
}

var AllClusters  = "";


function updateClusterTable()  {
  $.get("http://127.0.0.1:30900/v0/clusters",
    function(data) {
      data.forEach(function(c) {
        AllClusters += "  " + c.metadata.name
        var newrow = '<tr><td>' + c.metadata.name + '</td><td>' + JSON.stringify(c.metadata.labels) + '</td><td>' + '<span class="badge success">✔</span>' + '</td><td>' + c.metadata.annotations.NumPods +  '</td></tr>'
        $('#clustable tr:last').after(newrow);
      });
    })
}



function updateChartsTable() {
  $.get("http://127.0.0.1:30900/v0/releases",
    function(data) {
      data.forEach(function(r) {
        var newrow = '<tr><td>' + r.Name + '</td><td>' + r.Version + '</td><td>'  + r.Chart.Template[0].Name + '</td><td>' + AllClusters +  '</td></tr>'
        $('#releaseTable tr:last').after(newrow);
      });
    })
}


// ------------------------------------------------------------------------------------------
//                          Helm Chart Button Handlers
// ------------------------------------------------------------------------------------------

// TODO - determine the right data format (other than an empty object)
$("#postRelease").click(function() {
  var data = new FormData();
      data.append("name", $('#chartName').val());
      data.append("chartTar", document.getElementById("chartLoc").files[0]);
      data.append("namespace", $('chartNamespace').val());

  jQuery.ajax({
      url: 'http://127.0.0.1:30900/v0/releases',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      success: function(data){
          alert(data);
      }
  });
});
