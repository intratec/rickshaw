Rickshaw.namespace('Rickshaw.Graph.Axis.Y');

Rickshaw.Graph.Axis.Y = Rickshaw.Class.create( {

	initialize: function(args) {

		this.args = args;
		this.graph = args.graph;
		this.orientation = args.orientation || 'right';

		this.pixelsPerTick = args.pixelsPerTick || 75;
		if (args.ticks) this.staticTicks = args.ticks;
		if (args.tickValues) this.tickValues = args.tickValues;

		this.tickSize = args.tickSize || 4;
		this.ticksTreatment = args.ticksTreatment || 'plain';

		this.tickFormat = args.tickFormat || function(y) { return y };

		this.berthRate = 0.10;

		if (args.element) {

			this.element = args.element;
			this.vis = d3.select(args.element)
				.append("svg:svg")
				.attr('class', 'rickshaw_graph y_axis '+ this.orientation);

			this.element = this.vis[0][0];
			this.element.style.position = 'relative';

			this.setSize({ width: args.width, height: args.height });

		} else {
			this.vis = this.graph.vis;
		}

		if (typeof (args.gridValues) === 'undefined') { //when true, display the axis-tick-values in the chart as part of the grid too
		    this.gridValues = true;
		} else {
		    this.gridValues = args.gridValues;
		}

		var self = this;
		this.graph.onUpdate( function() { self.render() } );
	},

	setSize: function(args) {

		args = args || {};

		if (!this.element) return;

		if (typeof window !== 'undefined') {

			var style = window.getComputedStyle(this.element.parentNode, null);
			var elementWidth = parseInt(style.getPropertyValue('width'), 10);

			if (!args.auto) {
				var elementHeight = parseInt(style.getPropertyValue('height'), 10);
			}
		}

		this.width = args.width || elementWidth || this.graph.width * this.berthRate;
		this.height = args.height || elementHeight || this.graph.height;

		var myHeight = this.height * (1 + this.berthRate);

		this.vis
			.attr('width', this.width)
			.attr('height', myHeight)
            .attr('style', 'width:' + this.width + 'px; height: ' + myHeight + 'px');  //set css width and hight too. required for css3-table layouts

		//var berth = this.height * this.berthRate; //do not change the top-position for left-axis, the bottom ticks gets invisible that way (tested Firefox, IE10, Google Chrome)

		//if (this.orientation == 'left') {
		//	this.element.style.top = -1 * berth + 'px';
		//}
	},

	render: function() {

		if (this._renderHeight !== undefined && this.graph.height !== this._renderHeight) this.setSize({ auto: true });

		this.ticks = this.staticTicks || Math.floor(this.graph.height / this.pixelsPerTick);

		var axis = this._drawAxis(this.graph.y);

		this._drawGrid(axis);

		this._renderHeight = this.graph.height;
	},

	_beforeDrawAxis: function (scale) {
	    /*override in subclass to adapt this axis before it draws the given scale*/
	},

	_drawAxis: function(scale) {
		this._beforeDrawAxis(scale);

		var axis = d3.svg.axis().scale(scale).orient(this.orientation);
		axis.tickFormat(this.tickFormat);
		if (this.tickValues) axis.tickValues(this.tickValues);

		var transform = '';
		var transform_label = '';

		if (this.orientation == 'left') {
		    var berth = this.height * this.berthRate;
		    berth = 0; //do not translate the height, the bottom ticks gets invisible
			var transform = 'translate(' + this.width + ', ' + berth + ')';
		}

		if (this.element) {
			this.vis.selectAll('*').remove();
		}

		this.vis
			.append("svg:g")
			.attr("class", ["y_ticks", this.ticksTreatment].join(" "))
			.attr("transform", transform)
			.call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(this.tickSize));

		// add label
		if (this.args.label && this.args.label.text) {
		    var label = this.args.label;

		    var labeltext;
		    if (typeof label.text === "function") {
		        labeltext = label.text();
		    }
		    else {
		        labeltext = label.text;
		    }

		    var fontsize = (label.fontSize || "10px");

		    if (this.orientation == 'left') {
		        var transform_label = 'translate(' + this.width + ',0)' + ' ';
		    }

		    var self = this;
		    
			this.vis.append("text")
				.attr("class", "axis-label")
				.attr("text-anchor", "end")
				.attr("y", function () {
				    var value = (label.offsetX || "1em");
				    if (self.orientation == "left") {
				        value = parseFloat(value) * -0.5 + "em";
				    }
				    return value;
				})
				.attr("x", label.offsetY || "1em")
                .attr("dy", function () {
                    var value;
                    if (self.orientation == "left") {
                        value = fontsize;
                    }
                    return value;
                })
				.style("color", label.color || "black")
				.style("opacity", label.opacity || "0.5")
				.style("font-size", fontsize)
				.attr("transform", transform_label + "rotate(-90)")
				.text(labeltext);
		}

		return axis;
	},

	_drawGrid: function(axis) {
		var gridSize = (this.orientation == 'right' ? 1 : -1) * this.graph.width;

		if (!this.gridValues) { //specify an empty format for the tickValues so that the values are not visible in the chart
		    axis.tickFormat(function (d) { return ""; }); 
		}

		this.graph.vis
			.append("svg:g")
			.attr("class", "y_grid")
			.call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(gridSize))
			.selectAll('text')
			.each(function() { this.parentNode.setAttribute('data-y-value', this.textContent) });
	}
} );
