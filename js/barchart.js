BarChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = []; // see data wrangling

	// DEBUG RAW DATA
	console.log(this.data);

	this.initVis();
}

BarChart.prototype.initVis = function(){

	var vis = this;
    // SVG drawing area
    vis.margin = {top: 40, right: 10, bottom: 60, left: 60};

    vis.width = 1200 - vis.margin.left - vis.margin.right,
    vis.height = 600 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#bar-chart").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Our X scale
    vis.x = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .1);

    // Our Y scale
    vis.y = d3.scale.linear()
        .rangeRound([vis.height, 0]);


    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom")
        .ticks(10);

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left")
        .ticks(25, "s");


    vis.color = d3.scale.ordinal()
        .range(["yellow", "white", "#8a89a6", "#7b6888", "#6b486b", "red",  "green", "blue"]);




    vis.labelVar = 'year';
    vis.varNames = d3.keys(vis.data[0])
        .filter(function (key) { return key !== vis.labelVar;});

    vis.color.domain(vis.varNames);
    console.log(vis.varNames);

    vis.data.forEach(function (d) {
        var y0 = 0;
        d.mapping = vis.varNames.map(function (name) {
            return {
                name: name,
                label: d[vis.labelVar],
                y0: y0,
                y1: y0 += +d[name]
            };
        });
        d.total = d.mapping[d.mapping.length - 1].y1;
    });

    vis.data.sort(function(a, b) { return b.total - a.total; });

    vis.x.domain(vis.data.map(function (d) { return d.year; }));
    vis.y.domain([0, d3.max(vis.data, function (d) { return d.total; })]);


    vis.selection = vis.svg.selectAll(".series")
        .data(vis.data)
        .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) {
            return "translate(" + vis.x(d.year) + ",0)";
        });

    vis.selection.selectAll("rect")
        .data(function (d) { return d.mapping; })
        .enter().append("rect")
        .attr("width", vis.x.rangeBand())
        .attr("y", function (d) { return vis.y(d.y1); })
        .attr("height", function (d) { return vis.y(d.y0) - vis.y(d.y1); })
        .style("fill", function (d) { return vis.color(d.name); })
        .style("stroke", "grey");

    vis.legend = vis.svg.selectAll(".legend")
        .data(vis.varNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(2," + i * 20 + ")";
        });

    vis.legend.append("rect")
        .attr("x", vis.width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", vis.color)
        .style("stroke", "grey");

    vis.legend.append("text")
        .attr("x", vis.width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    vis.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "y axis")
        .call(vis.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Wealth in Millions");



}

/*
 * Data wrangling
 */
BarChart.prototype.wrangleData = function(){
	var vis = this;


	// Update the visualization
	vis.updateVis();
}

/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */
BarChart.prototype.updateVis = function(){
	var vis = this;


}
