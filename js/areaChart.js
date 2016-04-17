/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */
AreaChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.areaData = _data;
	this.displayData = []; // see data wrangling

	// DEBUG RAW DATA
	console.log(this.areaData);

	this.initVis();
}

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */
AreaChart.prototype.initVis = function(){

	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 60, left: 100 };
	vis.width = 800 - vis.margin.left - vis.margin.right;
	vis.height = 800 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales and axes
	vis.xScale = d3.time.scale()
		.range([0, vis.width])
		.domain(d3.extent(vis.areaData, function(d) { return d.Year; }));

	vis.yScale = d3.scale.linear()
		.range([vis.height, 0]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.xScale)
		.orient("bottom");

	vis.yAxis = d3.svg.axis()
		.scale(vis.yScale)
		.tickFormat(formatCurrency)
		.orient("left");

	vis.svg.append("g")
		.attr("class", "x-axis axis")
		.attr("transform", "translate(0," + vis.height + ")");

	vis.svg.append("g")
		.attr("class", "y-axis axis");

	vis.svg.append("g")
		.append("text")
		.attr("class", "label-y-axis")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Average Wealth ($)");

	// Set ordinal color scale
	vis.colorScale = d3.scale.category10();

	// Update color scale (all column headers except "Year")
	// Color scale will be used later for the stacked area chart
	vis.colorScale.domain(d3.keys(vis.areaData[0]).filter(function (key) {
		return key != "Year";
	}));
	console.log(vis.colorScale.domain());

	// Get all categories
	var dataCategories = vis.colorScale.domain();

	// Transpose the data by rearranging data into layers
	vis.transposedData = dataCategories.map(function(name) {
		return {
			name: name,
			values: vis.areaData.map(function(d) {
				return {Year: d.Year, average_wealth: +d[name]};
			})
		};
	});
	console.log(vis.transposedData);

	// Area chart's layout
	vis.area = d3.svg.area()
		.interpolate("cardinal")
		.x(function(d) { return vis.xScale(d.Year); })
		.y0(vis.height)
		.y1(function(d) { return vis.yScale(d.average_wealth); });

	// Tooltip placeholder
	var tooltip_x_pos = 35;
	var tooltip_y_pos = 15;

	vis.svg.append("g")
		.append("text")
		.attr("class", "tooltip-placeholder")
		.attr("x", tooltip_x_pos)
		.attr("y", tooltip_y_pos);

	// Initialize to no filtering
	vis.filter = "";

	// Filter, aggregate, modify data
	vis.wrangleData();
}

/*
 * Data wrangling
 */
AreaChart.prototype.wrangleData = function(){
	var vis = this;

	//vis.displayData = vis.transposedData;
	//console.log(vis.displayData);

	if (vis.filter == "") {
		// In the first step no data wrangling/filtering needed
		vis.displayData = vis.transposedData;
	} else {
		// Filter
		vis.displayData = vis.transposedData.filter(function(d){
			return d.name == vis.filter;
		});
	}

	// Update the visualization
	vis.updateVis();
}

/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */
AreaChart.prototype.updateVis = function(){
	var vis = this;

	// Update domain
	vis.yScale.domain([
		0,
		d3.max(vis.displayData, function(d) { return d3.max(d.values, function(v) { return v.average_wealth; }); })
	]);

	// Draw the areas
	var categories = vis.svg.selectAll(".area")
		.data(vis.displayData);

	categories.enter().append("path")
		.attr("class", "area");

	categories
		.style("fill", function(d) {
			return vis.colorScale(d.name);
		})
		.attr("d", function(d) {
			return vis.area(d.values); });

	// Update tooltip text
	categories
		.on("mouseover", function(d) {
			vis.svg.selectAll(".tooltip-placeholder")
				.text(d.name)
				.style("fill", vis.colorScale(d.name));
		})
		.on("mouseout", function(d) {
			vis.svg.selectAll(".tooltip-placeholder")
				.text("");
		})
		.on("click", function(d) {
			vis.filter = (vis.filter == d.name) ? "" : d.name;
			console.log(vis.filter);
			vis.wrangleData();
		});

	categories.exit().remove();

	// Call axis functions with the new domain 
	vis.svg.select(".x-axis").call(vis.xAxis);
	vis.svg.select(".y-axis").call(vis.yAxis);
}