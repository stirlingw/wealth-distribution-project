
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


var current_classname, original_menu_item;

window.$menu_items = $('.menu-item');

window.$window = $(window);

current_classname = '-current';

original_menu_item = window.$menu_items.find("a[href='" + window.location.hash + "']").get(0);

window.skrollr_instance = skrollr.init({
  forceHeight: false,
  render: $.throttle(100, function(skrollr_data) {
    var $active_menu_items, $current_menu_item, href;
    $active_menu_items = $menu_items.filter('.skrollable-between');
    $current_menu_item = skrollr_data.curTop < $window.height() / 2 ? $menu_items.first() : $active_menu_items.length === 1 ? $active_menu_items : $active_menu_items.length > 1 ? $active_menu_items.eq(1) : $menu_items.last();
    if ($current_menu_item.get(0) === $menu_items.get(0)) {
      return typeof history !== "undefined" && history !== null ? typeof history.pushState === "function" ? history.pushState(null, null, window.location.pathname + window.location.search) : void 0 : void 0;
    } else {
      href = $current_menu_item.find('a').attr('href') || '#';
      return typeof history !== "undefined" && history !== null ? typeof history.pushState === "function" ? history.pushState(null, null, href) : void 0 : void 0;
    }
  })
});

skrollr.menu.init(window.skrollr_instance);

if (original_menu_item) {
  $.delay(1000, function() {
    return skrollr.menu.click(original_menu_item);
  });
}