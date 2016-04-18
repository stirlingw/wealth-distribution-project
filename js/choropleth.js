
/*
Year,
State,
Income distribution (bottom 90, top 10, top 5, top 1, top 0.01)
Income
*/

var numberFormat = d3.format(".2f");

//http://www.epi.org/publication/income-inequality-by-state-1917-to-2012/


var usChart = dc.geoChoroplethChart("#us-chart");
var yearLineChart = dc.lineChart("#year-line-chart");
//var industryChart = dc.bubbleChart("#industry-chart");
//var roundChart = dc.bubbleChart("#round-chart");

queue()
	.defer(d3.csv,  "data/vc.csv")
	.defer(d3.csv,  "data/wid_world_income_distribution.csv")
    .defer(d3.json, "data/us-states.json")
    .await(createVisualization);

function createVisualization(error, dataCSV, wwiData, statesJson){
    var data = crossfilter(dataCSV);
    var wd = crossfilter(wwiData);

    var yearDim = wd.dimension(function (d) { return d["year"]});
    //var yearFilterData = yearDim.filterExact(2012).top(Infinity)

    var states = wd.dimension(function (d) {
        return d["state_abv"];
    });

    // (d["top_0.01%_income_share_including_capital_gains"] / 5.81) * 1000;
    var stateRaisedSum = states.group().reduceSum(function (d) {
        return d["top_0.01%_income_share_including_capital_gains"]
    });

    //    var ymtotal = yearDim.group().reduceSum(function(d) {return d.value;});
    //    var stateDim = vis.dimension(function (d) { return parseDate(d["state_abv"])});
    //    var stateFilter = stateDim.filterExact("US").top(Infinity)
    //    var parseDate = d3.time.format("%Y").parse;


    var yearGroup = yearDim.group().reduce(
        function reduceAdd(p, v) {
            p.top001 = v["top_0.01%_income_share_including_capital_gains"]++;
            return p;
        },
        function reduceRemove(p, v) {
            p.top001 = v["top_0.01%_income_share_including_capital_gains"]--;
            return p;
        },
        function reduceInitial() {
            return {
                top001: 0
            }

        }
    );

    usChart.width(990)
            .height(500)
            .dimension(states)
            .group(stateRaisedSum)
            .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
            .colorDomain([0, 500])
            .colorCalculator(function (d) { return d ? usChart.colors()(d) : '#ccc'; })
            .overlayGeoJson(statesJson.features, "state", function (d) {
                return d.properties.name;
            })
            .title(function (d) {
                return "State: " + d.key + "\nTop 0.01% Percentage: " + numberFormat(d.value ? d.value : 0) + "%";
            });

    yearLineChart
        .width(360)
        .height(150)
        .margins({top: 10, right: 50, bottom: 30, left: 60})
        .dimension(yearDim)
        .group(yearGroup)
        .valueAccessor(function(d) {
            return d.value.top001;
        })
        .x(d3.scale.linear().domain([1913, 2012]))
        .renderHorizontalGridLines(true)
        .elasticY(true)
        .brushOn(true)
        .title(function(d){
            return d.key + "\nTop 0.01% Percentage: " + Math.round(d.value.top001);
        })
        .xAxis().ticks(5).tickFormat(d3.format("d"));


    dc.renderAll();
}
