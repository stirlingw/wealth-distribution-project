
/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

Timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;

	// No data wrangling, no update sequence
	this.displayData = this.data;
	this.initVis();
}


/*
 * Initialize area chart with brushing component
 */

Timeline.prototype.initVis = function(){


}
