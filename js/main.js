
// Will be used to the save the loaded JSON data
var allData = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;

// Set ordinal color scale
var colorScale = d3.scale.category20();

// Variables for the visualization instances
var choropleth, timeline;


// Start application by loading the data
loadData();

function loadData() {
	d3.json("data/choropleth.json", function(error, jsonData){
		if(!error){
			allData = jsonData;


			createVis();
		}
	});
}

function createVis() {

	//timeline = new Timeline("timeline", allData.years)

}


