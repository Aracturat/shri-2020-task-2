const path = require('path');

module.exports = {
	entry: './index.js',
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: 'linter.js',
		path: path.resolve(__dirname, 'build')
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
			},
		],
	},
};
