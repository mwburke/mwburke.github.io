---
layout: post
title: 'Slopegraph vs Barchart'
subtitle: 'Pros and Cons Each Method'
date: 2017-12-28
author: Matthew
cover: 'https://raw.githubusercontent.com/mwburke/ds-tools-2017-slopegraph/master/preview.png'
tags: data-viz d3
---

## Slopegraphs are great (...sometimes)

A slopegraph is a relatively underused chart with two sets of values on the left and right hand side, connected by lines. I know this sounds like a line chart with two values... and it kind of is... but trust me it has its uses.

Slopegraphs were first developed by the illustrious Edward Tufte, and you can see an example of one in his book [*The Visual Display of Quantitative Information*](https://www.edwardtufte.com/tufte/books_vdqi) below:

![https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0003nk](https://www.edwardtufte.com/bboard/images/0003nk-10289.gif)

The slopegraph is successful in accomplishing the following communication goals:

* Showing relative rankings of items
* Identifying magnitude of changes
* Allowing comparison of changes among items

### Slopegraph vs bar chart

Although these tasks could be accomplished by reading a bar chart, I believe a slopegraph is a more appropriate visualization in some cases.

One example is taken from [KDnuggets poll](https://www.kdnuggets.com/2017/05/poll-analytics-data-science-machine-learning-software-leaders.html) of data science software usage in recent years. From their bar chart below, you can get see trends by looking at each piece of software individually, but it's difficult to compare across all of them.

![](https://www.kdnuggets.com/images/top-analytics-data-science-machine-learning-software-2015-2017.jpg)

To illustrate how this could be improved, I created a slopegraph for the some of the top items in D3 and embedded it below:

> Data Science Tools % Usage: **2016** to **2017**


<div id="chart"></div>

### Slopegraph pros

The slopegraph makes better use of color to draw the reader's eyes to significant changes, and immediately informs them of the increase or decrease. In the previous chart, the colors held no inherent meaning, and therefore added visual complexity for no additional benefit to the reader.

Additionally, I think the sloepgraph gives a better sense of the overall average trends through the line angles.

### Slopegraph cons

One of the primary shortcomings of the chart is the overlap of items with similar values. I had to add some extra logic in order to avoid this and still ended up with the SQL/Excel abomination, whereas if I used a bar chart, I would never have this problem.

The human brain is more suited to make comparisons between values based on length rather than angle, and I wouldn't be able to determine whether a line reprsented a 7% or 8% increase innately, which is why you need to add in each of the percents on both sides of the chart.

### Summary

Every visualization tool has bar chart capabilities and every powerpoint will inevitably have at least one bar chart mainly because you won't have to explain to your boss how to read a bar chart. They just work.

That being said, they don't always work as well as they could, and I think putting in a little extra time coding up a custom slopegraph visualization in something like [D3](https://d3js.org/) can make a significant difference in guiding people to the insights you've dug up.

---

The code for the above slopegraph made with D3.js can be found [in this github repo](https://github.com/mwburke/ds-tools-2017-slopegraph)

You can view a live version [in this block](http://bl.ocks.org/mwburke/9873c09ac6c21d6ac9153e54892cf5ec)


<style>

line {
	stroke-width: 3px;
	stroke-opacity: 0.7;
}


line.positive {
	stroke: #1b4fa3;
	stroke-width: 5px;
	stroke-opacity: 0.8;
}

line.negative {
	stroke: #991616;
	stroke-width: 5px;
	stroke-opacity: 0.8;
}

line.neutral {
	stroke: grey;
}


text.positive {
	fill: #1b4fa3;
	font-weight: 600;
}

text.negative {
	fill: #991616;
	font-weight: 600;
}

text.neutral {
	fill: grey;
}

.label {
	font-weight: 600;
}

circle.positive {
	fill: #1b4fa3;
}

circle.negative {
	fill: #991616;
}

circle.neutral {
	fill: grey;
}
</style>
<script src="http://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script>

d3.json('/data/slopegraph-data.json', function(error, data) {
	if (error) throw error;

	// Label each point as increasing/decreasing above thresholds
	// or just little to no change
	var arrayLength = data.length;
	for (var i = 0; i < arrayLength; i++) {
	    change = data[i]['After'] - data[i]['Before'];
	    if (change < -3) {
	    	data[i]['Change'] = 'negative';
	    } else if (change > 5) {
	    	data[i]['Change'] = 'positive';
	    } else {
	    	data[i]['Change'] = 'neutral';
	    }
	}

	var opts = {
		width: 600,
		height: 500,
		margin: {top: 20, right: 100, bottom: 30, left: 150}
	};

	// Calculate area chart takes up out of entire svg
	var chartHeight = opts.height - opts.margin.top - opts.margin.bottom;
	var chartWidth = opts.width - opts.margin.left - opts.margin.right;


	var svg = d3.select('#chart')
		.append('svg')
		.attr('width', opts.width)
		.attr('height', opts.height);

	// Create scale for positioning data correctly in chart
	var vertScale = d3.scaleLinear().domain([6, 53]).range([opts.margin.bottom, chartHeight]);

	// Labels overlap, need to precompute chart height placement
	// and adjust to avoid label overlap

	// First, calculate the right and left side chart placements
	for (var i = 0; i < arrayLength; i++) {
		data[i]['AfterY'] = vertScale(data[i]['After']);
		data[i]['BeforeY'] = vertScale(data[i]['Before']);
	}

	// Next, use a basic heuristic to pull labels up or down
	// If next item is too close to next one, move label up
	// If next item is too close and item above has been moved up, keep the same value,
	// and move next value down

	data.sort(function(a, b) {
		return b.Before-a.Before;
	})



	for (var i = 1; i < (arrayLength - 1); i++) {
		if ((data[i]['BeforeY']-data[i+1]['BeforeY']) < 15) {
			if ((data[i-1]['BeforeY']-data[i]['BeforeY']) < 15) {
				data[i+1]['BeforeY'] = data[i+1]['BeforeY'] - 10;
			} else {
				data[i]['BeforeY'] = data[i]['BeforeY'] + 10;
			}
		}
	}

	data.sort(function(a, b) {
		return b.After-a.After;
	})

	console.log(data);

	for (var i = 1; i < (arrayLength - 1); i++) {

		if ((data[i]['AfterY']-data[i+1]['AfterY']) < 15) {
			if ((data[i-1]['AfterY']-data[i]['AfterY']) < 15) {
				data[i+1]['AfterY'] = data[i+1]['AfterY'] - 10;
			} else {
				data[i]['AfterY'] = data[i]['AfterY'] + 10;
			}
		} else if ((data[i-1]['AfterY']-data[i]['AfterY']) < 15) {
			data[i]['AfterY'] = data[i]['AfterY'] - 10;
		}
	}

	data.sort(function(a, b) {
		return b.Before-a.Before;
	})

	// Create slopegraph labels
	svg.selectAll('text.labels')
		.data(data)
		.enter()
		.append('text')
		.text(function(d) {
			return d.Tool
		})
		.attr('class', function(d) {
			return 'label ' + d.Change;
		})
		.attr('text-anchor', 'end')
		.attr('x', opts.margin.left * .6)
		.attr('y', function(d) {
			return opts.margin.top + chartHeight - d.BeforeY;
		})
		.attr('dy', '.35em');

	// Create slopegraph left value labels
	svg.selectAll('text.leftvalues')
		.data(data)
		.enter()
		.append('text')
		.attr('class', function(d) {
			return d.Change;
		})
		.text(function(d) {
			return Math.round(d.Before) + '%'
		})
		.attr('text-anchor', 'end')
		.attr('x', opts.margin.left * .85)
		.attr('y', function(d) {
			return opts.margin.top + chartHeight - d.BeforeY;
		})
		.attr('dy', '.35em');

	// Create slopegraph left value labels
	svg.selectAll('text.rightvalues')
		.data(data)
		.enter()
		.append('text')
		.attr('class', function(d) {
			return d.Change;
		})
		.text(function(d) {
			return Math.round(d.After) + '%'
		})
		.attr('text-anchor', 'start')
		.attr('x', chartWidth + opts.margin.right)
		.attr('y', function(d) {
			return opts.margin.top + chartHeight - d.AfterY;
		})
		.attr('dy', '.35em');

	// Create slopegraph lines
	svg.selectAll('line.slope-line')
		.data(data)
		.enter()
		.append('line')
		.attr('class', function(d) {
			return 'slope-line ' + d.Change;
		})
		.attr('x1', opts.margin.left)
		.attr('x2', chartWidth + opts.margin.right * 0.75)
		.attr('y1', function(d) {
			return opts.margin.top + chartHeight - vertScale(d.Before);
		})
		.attr('y2', function(d) {
			return opts.margin.top + chartHeight - vertScale(d.After);
		});

	// Create slopegraph left circles
	svg.selectAll('line.left-circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('class', function(d) {
			return d.Change;
		})
		.attr('cx', opts.margin.left)
		.attr('cy', function(d) {
			return opts.margin.top + chartHeight - vertScale(d.Before);
		})
		.attr('r', 6);

	// Create slopegraph right circles
	svg.selectAll('line.left-circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('class', function(d) {
			return d.Change;
		})
		.attr('cx',chartWidth + opts.margin.right * 0.75)
		.attr('cy', function(d) {
			return opts.margin.top + chartHeight - vertScale(d.After);
		})
		.attr('r', 6);

	// Create bottom area denoting years
	svg.append("line")
		.attr('x1', opts.margin.left)
		.attr('x2', opts.margin.left)
		.attr('y1', opts.height - opts.margin.bottom)
		.attr('y2', opts.height - opts.margin.bottom * 0.7)
		.attr('stroke', 'grey')
		.attr('stroke-width', '2px');

	svg.append("line")
		.attr('x1', chartWidth + opts.margin.right * 0.75)
		.attr('x2', chartWidth + opts.margin.right * 0.75)
		.attr('y1', opts.height - opts.margin.bottom)
		.attr('y2', opts.height - opts.margin.bottom * 0.7)
		.attr('stroke', 'grey')
		.attr('stroke-width', '2px');

	svg.append("line")
		.attr('x1', opts.margin.left)
		.attr('x2', chartWidth + opts.margin.right * 0.75)
		.attr('y1', opts.height - opts.margin.bottom * 0.7)
		.attr('y2', opts.height - opts.margin.bottom * 0.7)
		.attr('stroke', 'grey')
		.attr('stroke-width', '2px');

	svg.append('text')
		.text('2016')
		.attr('class', 'neutral')
		.attr('x', opts.margin.left)
		.attr('y', opts.height - opts.margin.bottom * 0.05)
		.attr('text-anchor', 'start');

	svg.append('text')
		.text('2017')
		.attr('class', 'neutral')
		.attr('x', chartWidth + opts.margin.right * 0.75)
		.attr('y', opts.height - opts.margin.bottom * 0.05)
		.attr('text-anchor', 'end');

	// Get y values of notes and add notes to viz
	var pythonY = data.filter(function (ind) {
		return ind.Tool == 'Python';
	});

	var rapidMinerY = data.filter(function (ind) {
		return ind.Tool == 'RapidMiner';
	});

	var tensorflowY = data.filter(function (ind) {
		return ind.Tool == 'Tensorflow';
	});

	svg.selectAll('text-comments')
		.data(data)
		.enter()
		.append('text')
		.text(function(d) {
			return d.Comments;
		})
		.attr('class', 'neutral')
		.attr('text-anchor', 'start')
		.attr('x', chartWidth + opts.margin.right)
		.attr('y', function(d) {
			return opts.margin.top + chartHeight - d.AfterY;
		})
		.attr('dy', '.25em')
		.call(wrap, opts.margin.right);

	function wrap(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.1, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", chartWidth + opts.margin.left).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", chartWidth + opts.margin.left).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}
});

</script>
