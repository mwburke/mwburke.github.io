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
	write_json_instructions(list(data[0].keys()), output_file)

