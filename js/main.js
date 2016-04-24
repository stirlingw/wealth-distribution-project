
// Will be used to the save the loaded JSON data
var allData = [];
var household_income_dataset = [];
var average_wealth_dataset = [];
var average_real_wealth_per_family_dataset = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;
var parseYear = d3.time.format("%Y").parse;

// Set ordinal color scale
var colorScale = d3.scale.category10();

// Variables for the visualization instances
var choropleth, timeline, areaChart, lineChart, smallMultiples, barChart;

var formatCurrency = d3.format("$s");

// Start application by loading the data
// Start application by loading the data
queue()
	.defer(d3.csv,  "data/wid_world_income_distribution.csv")
	.defer(d3.json, "data/us-states.json")
	.defer(d3.csv,  "data/average_wealth.csv")
    .defer(d3.csv,  "data/census_median_household_income.csv")
    .defer(d3.csv,  "data/berkeley-zuckman-average-real-wealth-per-family-data.csv")
    .defer(d3.csv,  "data/top-incomes-since-1917_vs2012.csv")
	.await(loadData);


function loadData(error, dataCSV, statesJson, average_wealth_data, household_income_data, average_real_wealth_per_family_data, top_incomes){
	if(!error){
        allData.data = crossfilter(dataCSV);
        allData.top_incomes = crossfilter(top_incomes);
        allData.statesJson = statesJson;

        // ***********************************************************************
        // Average Wealth
        // ***********************************************************************
        average_wealth_data.forEach(function (d) {
            d.Year = parseYear(d.Year);
        });

        // Filter out data before 1980
        //data = data.filter(function(d){
        //	return d.Year >= 1980;
        //});

        // Hand CSV data off to global var
        average_wealth_dataset = average_wealth_data;

        // ***********************************************************************
        // Median Household Income
        // ***********************************************************************
        household_income_data.forEach(function (d) {
            d.Year = parseYear(d.Year);
        });

        // Hand CSV data off to global var
        household_income_dataset = household_income_data;
        
        // ***********************************************************************
        // Average real wealth per family
        // ***********************************************************************
        var all = []
        average_real_wealth_per_family_data.forEach(function (d) {
            d.year = +d.year;
            d.bottom_90 = +d.bottom_90;
            d.top_10 = +d.top_10;
            d.top_05 = +d.top_05;
            d.top_01 = +d.top_01;
            d.top_005 = +d.top_005;
            d.top_001 = +d.top_001;
            d.top_0001 = +d.top_0001;
        });
        // Hand CSV data off to global var
        average_real_wealth_per_family_dataset = average_real_wealth_per_family_data;
        

        // ***********************************************************************
        // Create visualization
        // ***********************************************************************
        createVis();
    } else {
        throw error;
    }
}


function createVis() {

	// TO-DO: Instantiate visualization objects here
	//areachart = new StackedAreaChart("stacked-area-chart", allData.layers)
    //	timeline = new Timeline("timeline", allData);
	areaChart = new AreaChart("area-chart", average_wealth_dataset);
    smallMultiples = new SmallMultiples("small-multiples", household_income_dataset);
    barChart = new BarChart("bar-chart", average_real_wealth_per_family_dataset);
    choropleth = new Choropleth("choropleth", allData);

}


function brushed() {
	// Set new domain if brush (user selection) is not empty
	areachart.x.domain(
		timeline.brush.empty() ? timeline.x.domain() : timeline.brush.extent()
	);

	//console.log(areachart);
	//console.log(timeline);

	// Update focus chart (detailed information)
	areachart.wrangleData();

}

/*http://www.bootply.com/103783*/
var jumboHeight = $('.jumbotron').outerHeight();
function parallax(){
    var scrolled = $(window).scrollTop();
    $('.bg').css('height', (jumboHeight-scrolled) + 'px');
}

$(window).scroll(function(e){
    parallax();
});