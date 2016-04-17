
// Will be used to the save the loaded JSON data
var allData = [];
var household_income_dataset = [];
var average_wealth_dataset = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;
var parseYear = d3.time.format("%Y").parse;

// Set ordinal color scale
var colorScale = d3.scale.category10();

// Variables for the visualization instances
var choropleth, timeline, areaChart, lineChart, smallMultiples;

var formatCurrency = d3.format("$s");

// Start application by loading the data
// Start application by loading the data
queue()
	.defer(d3.csv,  "data/wid_world_income_distribution.csv")
	.defer(d3.json, "data/us-states.json")
	.defer(d3.csv,  "data/average_wealth.csv")
    .defer(d3.csv,  "data/census_median_household_income.csv")
	.await(loadData);


function loadData(error, dataCSV, statesJson, average_wealth_data, household_income_data){
	if(!error){
        allData.data = crossfilter(dataCSV);

        //f1 = stateDim.filterExact("AZ").top(Infinity)
        //f2 = yearDim.filterRange([minYear, maxYear]).top(Infinity)

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
        // Create visualization
        // ***********************************************************************
        createVis();
    } else {
        throw error;
    }
}


function createVis() {

	// TO-DO: Instantiate visualization objects here
	// areachart = new ...
	//areachart = new StackedAreaChart("stacked-area-chart", allData.layers)
	timeline = new Timeline("timeline", allData);
	areaChart = new AreaChart("area-chart", average_wealth_dataset);
    smallMultiples = new SmallMultiples("small-multiples", household_income_dataset);


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