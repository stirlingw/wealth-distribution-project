
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Our X scale
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// Our Y scale
var y = d3.scale.linear()
    .rangeRound([height, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(25, "s");


var color = d3.scale.ordinal()
    .range(["yellow", "white", "#8a89a6", "#7b6888", "#6b486b", "red",  "green", "blue"]);


// Initialize data
loadData();


// Load CSV file
function loadData() {
    d3.csv("data/berkeley-zuckman-average-real-wealth-per-family-data.csv", function(error, csv) {


        console.log(csv);

        csv.forEach(function(d){
           // d.year = +d.year;
            d.bottom_90 = +d.bottom_90;
            d.top_10 = +d.top_10;
            d.top_05 = +d.top_05;
            d.top_01 = +d.top_01;
            d.top_005 = +d.top_005;
            d.top_001 = +d.top_001;
            d.top_0001 = +d.top_0001;


        });



        // Store csv data in global variable
        data = csv;


        var labelVar = 'year';
        varNames = d3.keys(data[0])
            .filter(function (key) { return key !== labelVar;});

        color.domain(varNames);


        console.log(varNames);

        data.forEach(function (d) {
            var y0 = 0;
            d.mapping = varNames.map(function (name) {
                return {
                    name: name,
                    label: d[labelVar],
                    y0: y0,
                    y1: y0 += +d[name]
                };
            });
            d.total = d.mapping[d.mapping.length - 1].y1;
        });

        data.sort(function(a, b) { return b.total - a.total; });

        x.domain(data.map(function (d) { return d.year; }));
        y.domain([0, d3.max(data, function (d) { return d.total; })]);

        console.log("prepped data", data);

        // Draw the visualization for the first time
        updateVisualization();
    });
}


// Render visualization
function updateVisualization() {

    var selection = svg.selectAll(".series")
        .data(data)
        .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) {
            return "translate(" + x(d.year) + ",0)";
        });

    selection.selectAll("rect")
        .data(function (d) { return d.mapping; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.y1); })
        .attr("height", function (d) { return y(d.y0) - y(d.y1); })
        .style("fill", function (d) { return color(d.name); })
        .style("stroke", "grey");

    var legend = svg.selectAll(".legend")
        .data(varNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(2," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color)
        .style("stroke", "grey");

    legend.append("text")
        .attr("x", width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Wealth in Millions");


};

