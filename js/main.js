
// Will be used to the save the loaded JSON data
var allData = [];
var average_wealth_dataset = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;
var parseYear = d3.time.format("%Y").parse;

// Set ordinal color scale
var colorScale = d3.scale.category10();

// Variables for the visualization instances
var choropleth, timeline, areaChart, lineChart;

// Start application by loading the data
//loadData();
loadAverageWealthData();

function loadData() {
	d3.json("data/choropleth.json", function(error, jsonData){
		if(!error){
			allData = jsonData;

			createVis();
		}
	});
}

function loadAverageWealthData() {
	d3.csv("data/average_wealth.csv", function(data) {
		console.log("Average Wealth's data loading complete.");
		//console.log(data);

		data.forEach(function(d) {
			d.Year = parseYear(d.Year);
		});

		// Filter out data before 1980
		//data = data.filter(function(d){
		//	return d.Year >= 1980;
		//});

		// Hand CSV data off to global var
		average_wealth_dataset = data;

		// Update color scale (all column headers except "Year")
		// Color scale will be used later for the stacked area chart
		colorScale.domain(d3.keys(average_wealth_dataset[0]).filter(function(key){ return key != "Year"; }));
		console.log(colorScale.domain());

		// Create visualization
		createVis();
	});
}

function createVis() {

	//timeline = new Timeline("timeline", allData.years)
	lineChart = new LineChart("line-chart", average_wealth_dataset);
	areaChart = new AreaChart("area-chart", average_wealth_dataset);
}
