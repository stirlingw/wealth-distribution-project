var numberFormat = d3.format(".2f");

var degreeYearChart = dc.barChart("#degree-year-chart");

// Use the Queue.js library to read three files
queue()
	.defer(d3.csv, "data/wid_world_income_distribution.csv")
    .defer(d3.json, "data/us-states.json")
    .await(createVisualization);


/*
Year,
State,
Income distribution (bottom 90, top 10, top 5, top 1, top 0.01)
Income
*/

function createVisualization(error, dataCSV, statesJson){
	var cf = crossfilter(dataCSV);
	var all = cf.groupAll();

    //f1 = stateDim.filterExact("AZ").top(Infinity)
    //f2 = yearDim.filterRange([minYear, maxYear]).top(Infinity)

    var parseDate = d3.time.format("%Y").parse;
    var stateDim = cf.dimension(function (d) { return parseDate(d["state_abv"])});
    stateDim.filterExact("US").top(Infinity)

    console.log(stateDim)

    var yearDim = cf.dimension(function (d) { return d["year"]});
    var yearCount = yearDim.group().reduceSum(function(d) { return +d["top_10%_income_share_including_capital_gains"]; });
    cf.top_10 = cf.dimension(function (d) { return d["top_10%_income_share_including_capital_gains"]});

    var ymtotal = yearDim.group().reduceSum(function(d) {return d.value;});
    var minYear = yearDim.bottom(1)[0].year;
    var maxYear = yearDim.top(1)[0].year;
    var yearsArray = [];
    ymtotal.top(Infinity).forEach(function(d){
        yearsArray.push(+d.key)
    });
    var yearRange = yearsArray.sort(function(a,b){return a - b; })


    degreeYearChart.width(800)
                .height(190)
                .margins({top: 10, right: 50, bottom: 20, left: 40})
                .transitionDuration(750)
                .dimension(yearDim)
                .group(yearCount)
                .elasticY(false)
                .centerBar(true)
                .gap(2)
                .ordinalColors(["#dd3497"])
                .x(d3.time.scale().domain([new Date(1913, 01, 01), new Date(2014, 12, 31)]))
                .xUnits(d3.time.years)
                .renderHorizontalGridLines(true)
                .filterPrinter(function (filters) {
                    console.log(filters);
                    var filter = filters[0], s = "";
                    var dateObj = new Date(filter[0]);
                    s += (dateObj.getFullYear() + 1) + " - " + parseDate(filter[1]);
                    return s;
                })
                .yAxis().ticks(5);

    console.log(yearRange);

    dc.renderAll();

//    cf.year = cf.dimension(function (d) { return d["year"]});
//    console.log("Total # of presidents: " + cf.year.top(Infinity).length);
//    // filter to presidents starting after 1900.
//    cf.year.filter([new Date(1900, 1, 1), Infinity]);
//    console.log("# of presidents starting after 1900: " + cf.year.top(Infinity).length);
//    groupByParty.top(Infinity).forEach(function(p, i) {
//    console.log(p.key + ": " + p.value);
//    });
//
//        byTookOffice.filterAll();
//
//    byTookOffice.filterAll();
//    console.log(cf);
//    var statesGroup          =   statesDim.group().all();



//stateYearGroup = speciesDim.group().reduceSum(function(d) {return +d.year;})

//    statesGroup         =   statesDim.group().reduceSum(function(d) {return +d.state_abv;})
//    bottom90IncomeGroup =   bottom90IncomeDim.group().reduceSum(function(d) {return +d["bottom_90%_average_income"] == ;})

    //states = statesGroup.filterExact(1971);

//    console.log(statesDim );

//	var stateRaisedSum = states.group().reduceSum(function (d) {
//		return d["Raised"];
//	});


//	var income_share = data.dimension(function (d) {
//	    console.log(d["top_5%_income_share_including_capital_gains"]);
//		return d["top_5%_income_share_including_capital_gains"];
//	});
//
//	var statsByIncome_Share = income_share.group().reduce(
//			function (p, v) {
//				p.amountRaised += +v["Raised"];
//				p.deals += +v["Deals"];
//				return p;
//			},
//			function (p, v) {
//				p.amountRaised -= +v["Raised"];
//				if (p.amountRaised < 0.001) p.amountRaised = 0; // do some clean up
//				p.deals -= +v["Deals"];
//				return p;
//			},
//			function () {
//				return {amountRaised: 0, deals: 0}
//			}
//	);
//
//	var rounds = data.dimension(function (d) {
//		return d["RoundClassDescr"];
//	});
//	var statsByRounds = rounds.group().reduce(
//			function (p, v) {
//				p.amountRaised += +v["Raised"];
//				p.deals += +v["Deals"];
//				return p;
//			},
//			function (p, v) {
//				p.amountRaised -= +v["Raised"];
//				if (p.amountRaised < 0.001) p.amountRaised = 0; // do some clean up
//				p.deals -= +v["Deals"];
//				return p;
//			},
//			function () {
//				return {amountRaised: 0, deals: 0}
//			}
//	);
//
//	usChart.width(990)
//					.height(500)
//					.dimension(states)
//					.group(stateRaisedSum)
//					.colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
//					.colorDomain([0, 200])
//					.colorCalculator(function (d) { return d ? usChart.colors()(d) : '#ccc'; })
//					.overlayGeoJson(statesJson.features, "state", function (d) {
//						return d.properties.name;
//					})
//					.title(function (d) {
//						return "State: " + d.key + "\nTotal Amount Raised: " + numberFormat(d.value ? d.value : 0) + "M";
//					});
////
//	industryChart.width(990)
//			.height(200)
//			.margins({top: 10, right: 50, bottom: 30, left: 60})
//			.dimension(industries)
//			.group(statsByIndustries)
//			.colors(d3.scale.category10())
//			.keyAccessor(function (p) {
//				return p.value.amountRaised;
//			})
//			.valueAccessor(function (p) {
//				return p.value.deals;
//			})
//			.radiusValueAccessor(function (p) {
//				return p.value.amountRaised;
//			})
//			.x(d3.scale.linear().domain([0, 5000]))
//			.r(d3.scale.linear().domain([0, 4000]))
//			.minRadiusWithLabel(15)
//			.elasticY(true)
//			.yAxisPadding(100)
//			.elasticX(true)
//			.xAxisPadding(200)
//			.maxBubbleRelativeSize(0.07)
//			.renderHorizontalGridLines(true)
//			.renderVerticalGridLines(true)
//			.renderLabel(true)
//			.renderTitle(true)
//			.title(function (p) {
//				return p.key
//						+ "\n"
//						+ "Amount Raised: " + numberFormat(p.value.amountRaised) + "M\n"
//						+ "Number of Deals: " + numberFormat(p.value.deals);
//			});
//	industryChart.yAxis().tickFormat(function (s) {
//		return s + " deals";
//	});
//	industryChart.xAxis().tickFormat(function (s) {
//		return s + "M";
//	});
//
//	roundChart.width(990)
//			.height(200)
//			.margins({top: 10, right: 50, bottom: 30, left: 60})
//			.dimension(rounds)
//			.group(statsByRounds)
//			.colors(d3.scale.category10())
//			.keyAccessor(function (p) {
//				return p.value.amountRaised;
//			})
//			.valueAccessor(function (p) {
//				return p.value.deals;
//			})
//			.radiusValueAccessor(function (p) {
//				return p.value.amountRaised;
//			})
//			.x(d3.scale.linear().domain([0, 5000]))
//			.r(d3.scale.linear().domain([0, 9000]))
//			.minRadiusWithLabel(15)
//			.elasticY(true)
//			.yAxisPadding(150)
//			.elasticX(true)
//			.xAxisPadding(300)
//			.maxBubbleRelativeSize(0.07)
//			.renderHorizontalGridLines(true)
//			.renderVerticalGridLines(true)
//			.renderLabel(true)
//			.renderTitle(true)
//			.title(function (p) {
//				return p.key
//						+ "\n"
//						+ "Amount Raised: " + numberFormat(p.value.amountRaised) + "M\n"
//						+ "Number of Deals: " + numberFormat(p.value.deals);
//			});
//	roundChart.yAxis().tickFormat(function (s) {
//		return s + " deals";
//	});
//	roundChart.xAxis().tickFormat(function (s) {
//		return s + "M";
//	});
//
//	dc.renderAll();
}
