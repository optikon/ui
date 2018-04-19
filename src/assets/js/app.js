import $ from 'jquery';
import whatInput from 'what-input';
import Foundation from 'foundation-sites';


// ------------------------------------------------------------------------------------------
//                           Init
// ------------------------------------------------------------------------------------------

window.$ = $;
window.onload = init;
$(document).foundation();
setInterval(updateUI, 500); // update every 500 ms

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



// inline updates on refresh

function updateClusterTable()  {
  $.get("http://172.16.7.101:30900/v0/clusters",
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
  $.get("http://172.16.7.101:30900/v0/releases",
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
      data.append("namespace", $('#chartNamespace').val());

    var labels = $('#chartLabels').val();
    var append = "";
    if (labels != "") {
      append = "?labels="+labels;
    }

    var updateUrl = 'http://172.16.7.101:30900/v0/releases/'+name+append;
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

  var deleteUrl = 'http://172.16.7.101:30900/v0/releases/'+name+append
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
