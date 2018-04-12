import $ from 'jquery';
import whatInput from 'what-input';
import Foundation from 'foundation-sites';


// ------------------------------------------------------------------------------------------
//                           Init
// ------------------------------------------------------------------------------------------



window.$ = $;
window.onload = init;
window.setInterval(function() {
  // updateUI()
}, 2000);
$(document).foundation();

function init() {
  populateTables()
}

//  periodically update cluster + charts without having to refresh the page
// TODO - also update map periodically
function updateUI() {
  // updateClusterTable()
  // updateChartsTable()
}


// ------------------------------------------------------------------------------------------
//                          Tables
// ------------------------------------------------------------------------------------------


// Do an initial GEt clusters
function populateTables() {
  updateClusterTable()
  updateChartsTable()
}


function updateClusterTable() {
  $.get("http://127.0.0.1:30900/v0/clusters",
    function(data) {
      data.forEach(function(c) {
        var newrow = '<tr><td>' + c.metadata.name + '</td><td>' + JSON.stringify(c.metadata.labels) + '</td><td>' + '<span class="badge success">✔</span>' + '</td><td>' + c.metadata.annotations.NumPods +  '</td></tr>'
        $('#clustable tr:last').after(newrow);
      });
    })
}

function updateChartsTable() {
  $.get("http://127.0.0.1:30900/v0/releases",
    function(data) {
      data.forEach(function(x) {
        var newrow = '<tr><td>' + x.Metadata.Name + '</td><td>' + "cluster A, cluster B" + '</td><td>' + "great" + '</td></tr>'
        $('#chartable tr:last').after(newrow);
      });
    })
}


// ------------------------------------------------------------------------------------------
//                          Helm Chart Button Handlers
// ------------------------------------------------------------------------------------------

// TODO - determine the right data format (other than an empty object)
$("#installChart").click(function() {
  var content = $('input#postInput').val();
  var chart = {
    Metadata: {
      Name: content
    }
  }

  // TODO
  // When I pass any kind of payload  / stringified version of chart, I get a "415 - Unsupported media type"
  $.post(
    "http://127.0.0.1:30900/v0/charts", {},
    function(data) {
      alert(data)
    },
    "json"
  );
});


// TODO: button handler for delete/chart
