var margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right:10
},
    width = parseInt(d3.select('.viz').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = 0.5,
    height = width * mapRatio,
    activeState = d3.select(null);
    activeCounty = d3.select(null);

var svg = d3.select('.viz').append('svg')
    .attr('class', 'center-container')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right);

svg.append('rect')
    .attr('class', 'background center-container')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .on('click', zoomState);

var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var filePathList = [
    './CensusData/2010Data.json', 
    './CensusData/2011Data.json', 
    './CensusData/2012Data.json', 
    './CensusData/2013Data.json', 
    './CensusData/2014Data.json', 
    './CensusData/2015Data.json', 
    './CensusData/2016Data.json', 
    './CensusData/2017Data.json', 
    './CensusData/2018Data.json', 
    './CensusData/2019Data.json', 
    './CensusData/2020Data.json', 
    './us-counties.json' 
];

var promises = [];

filePathList.forEach(filePath => {
    promises.push(d3.json(filePath))
});

Promise.all(promises).then(ready);

var projection = d3.geoAlbersUsa()
    .translate([width /2 , height / 2])
    .scale(width)

var path = d3.geoPath()
    .projection(projection);

var g = svg.append("g")
    .attr('class', 'center-container center-items us-state')
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

function ready(languageDatas) {
    console.log(languageDatas);

    var us = languageDatas.pop();

    var currentData = languageDatas[10];

    console.log(currentData);

    pairLanguageToId = {};

    pairNumbersToId = {};
    
    let currentStateId = currentData["GEO_ID"][1].substr(0,2);

    let stateLanguageList = {
        "spanish": 0,
        "indoEuropean": 0,
        "asianPacific": 0,
        "other": 0
    }

    for (index in currentData["GEO_ID"]) {
        if (index == 0) {
            continue;
        }

        if (currentStateId == currentData["GEO_ID"][index].substr(0,2)) {
            stateLanguageList['spanish'] += currentData['S1601_C01_004E'][index];
            stateLanguageList['indoEuropean'] += currentData['S1601_C01_008E'][index];
            stateLanguageList['asianPacific'] += currentData['S1601_C01_012E'][index];
            stateLanguageList['other'] += currentData['S1601_C01_016E'][index];
        }
        else {
            let result = getKeyByValue(stateLanguageList, Math.max(...Object.values(stateLanguageList)))

            if (result == "spanish") {
                pairLanguageToId[currentStateId] =  "Spanish";
            }
            else if (result == "indoEuropean") {
                pairLanguageToId[currentStateId] =  "Other Indo-European Languages";
            }
            else if (result == "asianPacific") {
                pairLanguageToId[currentStateId] =  "Asian and Pacific Island Languages";
            }
            else {
                pairLanguageToId[currentStateId] =  "Other Languages";
            }

            pairNumbersToId[currentStateId] = stateLanguageList;

            currentStateId = currentData["GEO_ID"][index].substr(0,2);

            stateLanguageList = {
                "spanish": 0,
                "indoEuropean": 0,
                "asianPacific": 0,
                "other": 0
            }

            stateLanguageList['spanish'] += currentData['S1601_C01_004E'][index];
            stateLanguageList['indoEuropean'] += currentData['S1601_C01_008E'][index];
            stateLanguageList['asianPacific'] += currentData['S1601_C01_012E'][index];
            stateLanguageList['other'] += currentData['S1601_C01_016E'][index];
        }
    }

    for (index in currentData["GEO_ID"]) {
        if (index == 0) {
            continue;
        }
        let language_list = {
            "spanish": 0,
            "indoEuropean": 0,
            "asianPacific": 0,
            "other": 0
        }

        language_list['spanish'] += currentData['S1601_C01_004E'][index];
        language_list['indoEuropean'] += currentData['S1601_C01_008E'][index];
        language_list['asianPacific'] += currentData['S1601_C01_012E'][index];
        language_list['other'] += currentData['S1601_C01_016E'][index];

        let result = getKeyByValue(language_list, Math.max(...Object.values(language_list)))

        if (result == "spanish") {
            pairLanguageToId[currentData["GEO_ID"][index]] =  "Spanish";
        }
        else if (result == "indoEuropean") {
            pairLanguageToId[currentData["GEO_ID"][index]] =  "Other Indo-European Languages";
        }
        else if (result == "asianPacific") {
            pairLanguageToId[currentData["GEO_ID"][index]] =  "Asian and Pacific Island Languages";
        }
        else {
            pairLanguageToId[currentData["GEO_ID"][index]] =  "Other Languages";
        }

        pairNumbersToId[currentData["GEO_ID"][index]] = language_list;
    }

    d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
            this.parentNode.appendChild(this);
            });
        }; 

    //Moves selction to back
    d3.selection.prototype.moveToBack = function() { 
        return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
        }); 
    };

    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "county-boundary")
        .on("click", zoomCounty)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "state")
        .on("click", zoomState)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);


    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);

}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function showTooltip(d) {
    console.log(d.id);
    div.transition().duration(300)
        .style("opacity", 1)
    div.text(d.properties.name + ": " + pairLanguageToId[d.id])
        .style("left", (event.clientX) + "px")
        .style("top", (event.clientY -30) + "px");
//    div.text("Spanish: " + pairNumbersToId[d.id]["spanish"])
//        .style("left", (event.clientX) + "px")
//        .style("top", (event.clientY -30) + "px");
//    div.text("Other Indo-European Languages: " + pairNumbersToId[d.id]["indoEuropean"])
//        .style("left", (event.clientX) + "px")
//        .style("top", (event.clientY -30) + "px");
//    div.text("Asian and Pacific Island Languages: " + pairNumbersToId[d.id]["asianPacific"])
//        .style("left", (event.clientX) + "px")
//        .style("top", (event.clientY -30) + "px");
//    div.text("Other Languages: " + pairNumbersToId[d.id]["other"])
//        .style("left", (event.clientX) + "px")
//        .style("top", (event.clientY -30) + "px");

}

function hideTooltip(d) {
    var sel = d3.select(this);
    sel.moveToBack();
    div.transition().duration(300)
        .style("opacity", 0);
}

function zoomState(d) {
    if (d3.select('.background').node() === this) return reset();

    if (activeState.node() === this) return reset();

    activeState.classed("active", false);
    activeState = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function zoomCounty(d) {
    if (activeCounty.node() === this) return reset();
    if (d3.select('.background').node() === this) return reset();

    activeCounty.classed("active", false);
    activeCounty = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}


function reset() {
    activeState.classed("active", false);
    activeCounty.classed("active", false);
    activeState = d3.select(null);
    activeCounty = d3.select(null);

    g.transition()
        .delay(100)
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr('transform', 'translate('+margin.left+','+margin.top+')');

}
