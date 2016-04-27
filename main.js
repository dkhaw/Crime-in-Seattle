var dat;
var vis;
var projection;

$(function() {
	$.get('offense.txt', function(data) {
        var lines = data.split("\n");
        var options = $("#dropdown");
        $.each(lines, function(n, elem) {
            $('#dropdown').append('<option value=\'' + elem + '\'>' + elem + '</option>');
        });
    });

	d3.csv('2015.csv', function(error, data){
		dat = data;
		var width = 800;
		var height = 500;
		this.data = data;
		vis = d3.select("#vis").append("svg")
		    .attr("width", width).attr("height", height);

		d3.json("spdbeat_WGS84.json", function(map) {
			projection = d3.geo.mercator().scale(1).translate([0,0]).precision(0);
			var path = d3.geo.path().projection(projection);
			var bounds = path.bounds(map);

			var scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / width,
			  (bounds[1][1] - bounds[0][1]) / height);
			var transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2,
			  (height - scale * (bounds[1][1] + bounds[0][1])) / 2];
			projection.scale(scale).translate(transl);

			vis.selectAll("path").data(map.features).enter().append("path")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke", "black");
		});
	});
});

function updateLabel() {
	var month = $('#month').val();
  	document.getElementById('past').innerHTML = month + '/2015';
  	update();
}

function update() {
	var draw = function(data) {
	    var circles = vis.selectAll("circle").data(filteredData);

	    circles.enter().append("circle");

		circles.attr("cx", function (d) { return projection([d.Longitude, d.Latitude])[0]; })
		.attr("cy", function (d) { return projection([d.Longitude, d.Latitude])[1]; })
		.attr("r", "2px")
		.attr("fill", "red")
		.attr('opacity', .25)

		circles.exit().remove();
  	}

	var dropdown = document.getElementById('dropdown');
	var offense = dropdown.options[dropdown.selectedIndex].value;
	var filteredData = dat.filter(function(d) { 
		var month = $('#month').val();
	    if( d['Summarized Offense Description'] == offense && d['Month'] == month) { 
	        return d;
	    } 
    });
	draw(filteredData);
};