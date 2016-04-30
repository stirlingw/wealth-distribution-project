var rateById = d3.map();

// var color = d3.scale.ordinal().domain([1,2,3,4,5]).range(["#009ed8","#80e28e","#e9ec32","#f6a023","#f37124"])

var color = d3.scale.ordinal().domain([25000,40000,50000,62500,75000]).range(['rgb(254,229,217)','rgb(252,174,145)','rgb(251,106,74)','rgb(222,45,38)','rgb(165,15,21)'])

rates.forEach(function(d) { rateById.set(d.id, color(+d.cuts[50])); });

us.objects.states.geometries.forEach(function(d){
    d.properties = rates.filter(function(v){ return +v.id == +d.id; })[0];
});

var usData = rates.filter(function(v){ return +v.id == 0; })[0]

$("#income-line-chart").html("United States");
$("#per-99").html("<span><strong>$"+d3.format(",g")(usData.cuts[99])+"<strong></span>");
$("#per-95").html("<span><strong>$"+d3.format(",g")(usData.cuts[95])+"<strong></span>");
$("#per-75").html("<span><strong>$"+d3.format(",g")(usData.cuts[75])+"<strong></span>");
$("#per-50").html("<span><strong>$"+d3.format(",g")(usData.cuts[50])+"<strong></span>");
$("#per-25").html("<span><strong>$"+d3.format(",g")(usData.cuts[25])+"<strong></span>");
$("#per-10").html("<span><strong>$"+d3.format(",g")(usData.cuts[10])+"<strong></span>");

var blah = usData.cuts.push(100000)
blah = usData.cuts.sort(function(a, b){return a-b})

function arraySearch(arr,val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i] === val)
            return i;
    return false;
}

$("#per-user").html("<span><strong>TOP "+arraySearch(blah, 100000)) + escape("%") + "</strong></span>"

console.log(blah);
console.log(arraySearch(blah, 100000));


var width = 700, height = 600;

var projection = d3.geo.albersUsa()
                        .scale(750)
                        .translate([width / 2, height / 2 -45]);

var path = d3.geo.path()
    .projection(projection);

var margin = {top: 0, left: 50, right: 10, bottom: 10};

var svg = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


svg.append("rect")
    .attr("class", "background")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .on("click", function(d){
    console.log(d);
    var p = {
      abbr: "US",
      rate: ".025"
    }
    pieAdjust(p);
  })
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* Initialize tooltip */
var tip = d3.tip().html(function(d) { return d; });

/* Invoke the tip in the context of your visualization */
g.call(tip);

tip.attr("class","d3-tip");

g.append("g")
    .attr("id", "states")
  .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
  .enter().append("path")
    .attr("class","state-area")
    .attr("fill", function(d) { return rateById.get(d.id); })
    .attr("d", path)
    .attr("stroke","black")
    .attr("stroke-width","2px")
    .attr("stroke-opacity",0.2)
    .on('mouseover', function(d){
          var p = d.properties;
          //pieAdjust(p);
          return tip.show( '<span>' + p.state + '</span><p>' + "Median Household Income: <br>" + d3.format(",g")(p.cuts[50]))
          console.log(d)
    })
    .on('mouseout', function(d){
          tip.hide()
    })
    .on('click', function(d){
        var p = d.properties;
        $("#income-line-chart").html("<div class='line-chart'>"+p.state+"</div>");
        $("#per-99").html("<span><strong>$"+d3.format(",g")(p.cuts[99])+"<strong></span>");
        $("#per-95").html("<span><strong>$"+d3.format(",g")(p.cuts[95])+"<strong></span>");
        $("#per-75").html("<span><strong>$"+d3.format(",g")(p.cuts[75])+"<strong></span>");
        $("#per-50").html("<span><strong>$"+d3.format(",g")(p.cuts[50])+"<strong></span>");
        $("#per-25").html("<span><strong>$"+d3.format(",g")(p.cuts[25])+"<strong></span>");
        $("#per-10").html("<span><strong>$"+d3.format(",g")(p.cuts[10])+"<strong></span>");
    })

g.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("id", "state-borders")
    .attr("d", path);

var pieWidth = 120,
    pieHeight = 120,
    radius = Math.min(pieWidth, pieHeight) / 2;

var pie = d3.layout.pie();

var arc = d3.svg.arc()
    .innerRadius(radius - 40)
    .outerRadius(radius - 20);


var arcT = d3.svg.arc()
    .innerRadius(radius - 10)
    .outerRadius(radius);

var pieChart = g.append("g")
    .attr("transform", "translate(" + [20, height - 165] + ")");

pieChart.append("line")
  .attr("y1",0)
  .attr("y2", 140)
  .attr("x1",185)
  .attr("x2",185)
  .attr("stroke","black")
  .attr("stroke-width","1.5px")
  .style("opacity",0.4)

var arcG = pieChart.selectAll(".arc")
  .data(pie([.025,.975]))
.enter().append("g")
  .attr("class", "arc")
  .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")")

arcG.append("path")
  .attr("fill", function(d, i) { return (i==0) ? "#a50f15" : "#fcae91"; })
  .attr("stroke","white")
  .attr("d", arc)
  .each(function(d) { this._current = d; }); // store the initial angles

var sliceLabel = d3.select(arcG[0][0]).append("text")
  .attr("transform", function(d) { return "translate(" + arcT.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .style("text-anchor", "middle")
  .text(function(d) { return d3.format(".1%")(d.value); });

pieChart.append("g")
.attr("transform","translate(" + [pieWidth/2,pieHeight] + ")")
.append("text")
.text("Percent of Voting Age")
.attr("text-anchor","middle")
.style("font-weight","bold")

pieChart.append("g")
.attr("transform","translate(" + [pieWidth/2,pieHeight + 20] + ")")
.append("text")
.text("Population Disenfranchised")
.attr("text-anchor","middle")
.style("font-weight","bold")


var stateLabel = pieChart.append("g")
.attr("transform","translate(" + [pieWidth/2 -1,pieHeight/2 + 5] + ")")
.append("text")
.attr("class","littlelabel")
.text("US")
.attr("text-anchor","middle");

var legend = g.append("g")
.attr("transform","translate(" + [width, height] + ")")

legend.append("text")
.attr("class","legendTitle")
.text("Who can't vote?")
.attr("y", -140)
.attr("x",-18)
.style("text-anchor","end")

var lSquares = legend.selectAll(".legend")
  .data(['No voting restrictions','Inmates','Inmates & Parolees', 'Inmates, Parolees, & Probationers', 'Inmates, Parolees, Probationers, & Ex-felons'].reverse())
.enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + (- 40 - i * 23) + ")"; });


lSquares.append("rect")
  .attr("x",  "-18px")
  .attr("width", 18)
  .attr("height", 18)
  .attr("stroke", "#444")
  .style("fill", function(d,i){ return color(5-i);});

lSquares.append("text")
  .attr("x", "-24px")
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d; });

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function pieAdjust(p){

  // if(p.rate==0) p.rate = .00001;

  var path = d3.selectAll(".arc > path").data(pie([p.rate, 1-p.rate]))

  path.transition("cubic").duration(400).attrTween("d", arcTween);

  sliceLabel.data(pie([p.rate, 1-p.rate]))
      .transition().duration(300)
      .attr("transform", function(d) { return "translate(" + arcT.centroid(d) + ")"; })
      .text(function(d) { return d3.format(".1%")(d.value); });

  d3.selectAll(".littlelabel").text(p.abbr)

}