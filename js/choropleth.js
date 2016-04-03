

/*
 * Choropleth - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data			    -- the
 */

Choropleth = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = []; // see data wrangling

	// DEBUG RAW DATA
	console.log(this.data);
	//this.initVis();
}


Choropleth.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.width = 800 - vis.margin.left - vis.margin.right,
	vis.height = 400 - vis.margin.top - vis.margin.bottom;


	// Update the visualization
	//vis.wrangleData();
}

/*
 * Data wrangling
 */

Choropleth.prototype.wrangleData = function(){
	var vis = this;


	//vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

Choropleth.prototype.updateVis = function(){
	var vis = this;

}


