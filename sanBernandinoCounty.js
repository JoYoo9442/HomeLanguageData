var maptype = 'topojson';

var width = 960,
    height = 600;


var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);


var path = d3.geo.path()
    .projection(projection);


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


queue()
    .defer(d3.json, "us.geojson")
    .defer(d3.json, "us.topojson")
    .await(ready);


function ready(error, us_geojson,us_topojson) {
  
// GEOJSON  
  if (maptype === 'geojson') {
    var us = us_geojson;


    svg.append("g")
        .attr("class", "states")
      .selectAll("path")
        .data(us.features)
      .enter().append("path")
        .attr("d", path)
        // the three commented lines below are a longer version of the line above
        /*
         .attr("d", function(d) {
          return path(d);
         })
        */
        .classed('make-it-red', function(d) {
          if (d.properties.name === "Mississippi" || d.properties.name === "Oregon") {
            return true;
          }
          else {
            return false;
          }
        })


  }
  

// TOPOJSON
  else if (maptype === 'topojson') {
    var us = us_topojson;

    svg.append("g")
        .attr("class", "counties")
      .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
        .attr("d", path)
        .classed('make-it-red', function(d) {
          if (d.id == '06069') {
            return true;
          }
          else {
            return false;
          }
        })

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", path);
  
  }

  
}
