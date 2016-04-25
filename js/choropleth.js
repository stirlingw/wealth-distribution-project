/*
Year,
State,
Income distribution (bottom 90, top 10, top 5, top 1, top 0.01)
Income
*/


/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

Choropleth = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	// No data wrangling, no update sequence
	this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */
Choropleth.prototype.initVis = function(){
    var vis = this;
    var numberFormat = d3.format(".2f");

    $( "#slider-range-max" ).slider({
        range: "max",
        min: 1,
        max: 1200000,
        value: 36000,
        slide: function( event, ui ) {
            console.log(ui.value);
          $( "#amount" ).val( ui.value );
        }
    });
    $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );

    vis.usChart = dc.geoChoroplethChart("#us-chart");
    //vis.yearLineChart = dc.lineChart("#year-line-chart");

    //http://www.epi.org/publication/income-inequality-by-state-1917-to-2012/
    this.wrangleData();
}


Choropleth.prototype.wrangleData = function(){
    var vis = this;
    vis.data.nyStatesDim = vis.data.ny_times_data.dimension(function (d) { return d["state_abv"]});
    vis.data.stateCutsGroup = vis.data.ny_times_data.dimension(function (d) {
        return d["cuts"]
    });

    vis.data.stateGroup = vis.data.nyStatesDim.group().reduceSum(function(d) {
        return d["cuts"][50];
    });


//    console.log(vis.data.nyCutsDim.top(Infinity))
//    vis.data.yearDim = vis.data.top_incomes.dimension(function (d) { return d["Year"]});
//    vis.data.statesDim = vis.data.top_incomes.dimension(function (d) { return d["State Abv"]});
//    vis.data.yearFilter = vis.data.yearDim.filterExact(2012).top(Infinity)


//    var ymtotal = yearDim.group().reduceSum(function(d) {return d.value;});
//    var minYear = yearDim.bottom(1)[0].year;
//    var maxYear = yearDim.top(1)[0].year;
//    console.log(vis.data.yearFilter);

    // allData.statesFilter = allData.statesDim.filterExact("AZ").top(Infinity)
    // console.log(allData.statesFilter);
    // var yearFilterData = yearDim.filterExact(2012).top(Infinity)

    // (d["top_0.01%_income_share_including_capital_gains"] / 5.81) * 1000;
//    vis.data.stateRaisedSum = vis.data.statesDim.group().reduceSum(function (d) {
//        return d["0-90th percentiles"]
//    });

    // var ymtotal = yearDim.group().reduceSum(function(d) {return d.value;});
    // var stateDim = vis.dimension(function (d) { return parseDate(d["state_abv"])});
    // var stateFilter = stateDim.filterExact("US").top(Infinity)
    // var parseDate = d3.time.format("%Y").parse;

//    vis.data.yearGroup = vis.data.yearDim.group().reduce(
//        function reduceAdd(p, v) {
//            p.top001 = v["0-90th percentiles"]++;
//            return p;
//        },
//        function reduceRemove(p, v) {
//            p.top001 = v["0-90th percentiles"]--;
//            return p;
//        },
//        function reduceInitial() {
//            return {
//                top001: 0
//            }
//
//        }
//    );
    this.updateVis();
}

Choropleth.prototype.updateVis = function(){
    var vis = this;
    vis.data.numberFormat = function(num){
        format = d3.format("0,000");
        formattedX = "$" + format(num) + ".00";
        return formattedX;
    }

//    var wyoming = vis.data.yearDim.top(Infinity)[5]
//    console.log(vis.data.yearDim.top(Infinity)[5]);
//    //console.log((wyoming["Total income (1000s)"] * 1000) / wyoming["Number of tax units"]);
    vis.usChart.width(990)
                .height(500)
                .dimension(vis.data.nyStatesDim)
                .group(vis.data.stateGroup)
                .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                .colorDomain([25000, 65000])
                .colorCalculator(function (d) { return d ? vis.usChart.colors()(d) : '#ccc'; })
                .overlayGeoJson(vis.data.statesJson.features, "state", function (d) {
                    return d.properties.name;
                })
                .title(function (d) {
                    return "State: " + d.key + "\nMedian Household Income: " + vis.data.numberFormat(d.value ? d.value : 0);
                });

    //console.log(vis.usChart.filter());

//    vis.yearLineChart
//        .width(380)
//        .height(200)
//        .margins({top: 10, right: 70, bottom: 30, left: 100})
//        .dimension(vis.data.yearDim)
//        .group(vis.data.yearGroup)
//        .valueAccessor(function(d) {
//            return d.value.top001;
//        })
//        .x(d3.scale.linear().domain([1913, 2012]))
//        .renderHorizontalGridLines(true)
//        .elasticY(true)
//        .brushOn(true)
//        .title(function(d){
//            return d.key + "\nTop 0.01% (99.99th-100th percentiles) " + Math.round(d.value.top001);
//        })
//        .xAxis().ticks(5).tickFormat(d3.format("d"));


    dc.renderAll();
}

