---
layout: post
title: 'Working with Jekyll and D3'
subtitle: 'Integration for Data-Oriented Blogging'
date: 2017-12-29
author: Matthew
tags: jekyll d3
---

### Getting tools to play nice

Jekyll is a fantastic framework to get up and running quickly with a blog website, and adding posts through markdown files abstracts a lot of the complexity for me, leaving more time to spend writing.

However, since it relies heavily on [YAML](http://yaml.org/) configuration files and [Markdown](https://en.wikipedia.org/wiki/Markdown) rather than HTML and JSON, it doesn't have many nice plug-n-play features with D3.

Luckily there are smart people out there like the [API Evangelist](http://apievangelist.com/) (who you should seriously check out sometime), who help us plebeians out. He had a [super helpful post](https://apievangelist.com/2016/09/20/d3js-visualizations-using-yaml-and-jekyll/) about getting D3 visualizations working with Jekyll. The strategy is basically to generate two separate files: a yaml file and instructions on how to compile that yaml file into JSON, so that when you build your site, you end up with the original JSON file you were working with when prototyping in D3.

### Slopegraph example

In a [previous post](http://worksofchart.com/2017/12/28/slopegraph-vs-barchart.html), I created a slopegraph in D3, which utilized a JSON file (excerpt below):

```json
[
	{"Tool":"Python",
	 "Users":1516,
	 "After":52.6,
	 "Before":45.8,
	 "Comments": "Python is growing in popularity"
	},
	{"Tool":"R",
	"Users":1502,
	"After":52.1,
	"Before":49.0
	}
...
```

#### YAML File

The initial way I generated the yaml file from JSON was using the [json2yaml](https://github.com/drbild/json2yaml) command line tool. It's basically just JSON except instead of curly brackets and quotations, it has indents and dashes. Here's what the above JSON looked like after its transformation into yaml:

```yaml
- Tool: Python
  Users: 1516
  After: 52.6
  Before: 45.8
  Comments: Python is growing in popularity
- Tool: R
  Users: 1502
  After: 52.1
  Before: 49.0
```

#### Conversion Definition File

The last step is to create a [Liquid](http://shopify.github.io/liquid/) template definition on how to regenerate JSON line by line as it iterates through the YAML, and the cycle is complete. The script looks like the following:

```liquid
{% raw %}---
layout: none
---
[{% for chart in site.data.slopegraph-data %}
  {
    "Tool": "{{ chart.Tool }}",
    "Users": "{{ chart.Users }}",
    "After": "{{ chart.After }}",
    "Before": "{{ chart.Before }}",
    "Comments": "{{ chart.Comments }}"
  }{% if forloop.last == false %},{% endif %}
{% endfor %}]{% endraw %}
```

### Putting it together

Since I ~~am good at~~ like using D3, I knew I would probably be repeating this process later. Rather than re-look up how to do this every time, I thought I would just create a quick python script to take a JSON file, auto generate the two files and place them in the appropriate folders.  The end result will be the JSON file receated in the `/data` folder of the generated site, ready for use.

The script I wrote is pretty basic, relies on the [`pyaml`](https://pypi.python.org/pypi/PyYAML) package, and does have assumptions on how the file is structured, but if you want to start your own data viz blog and take the few readers I have, then you might find the script helpful. You can grab it [in the github repo](https://github.com/mwburke/mwburke.github.io/blob/master/create_yaml_json.py) for this site or below if you don't want an extra click:

```python
{% raw %}
import sys
import json, pyaml

def read_json(json_file):
    with open(json_file, 'r') as f:
    	return json.load(f)

def write_yaml(data, output_file):
	with open('_data/' + output_file + '.yaml', 'w') as output:
		pyaml.dump(data, output)

def write_json_instructions(columns, output_file):
	with open('data/' + output_file + '.json', 'w') as output:
		output.write('---\nlayout: none\n---\n')
		output.write('[{{% for chart in site.data.{} %}}'.format(output_file))
		output.write('\t{{\n')
		count = 0
		for column in columns:
			output.write('"{0}": {{{{ chart.{1} }}}}"'.format(column, column))
			if count != len(columns) - 1:
				output.write(',')
			output.write('\n')
			count += 1
		output.write('\t}{% if forloop.last == false %},{% endif %}\n{{% endfor %}]')


if __name__ == '__main__':
	input_file = sys.argv[1]
	output_file = sys.argv[2]

	data = read_json(input_file)
	write_yaml(data, output_file)
	write_json_instructions(list(data[0].keys()), output_file){% endraw %}
```
