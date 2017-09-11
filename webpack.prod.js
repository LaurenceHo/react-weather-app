const merge = require ('webpack-merge');
const DefinePlugin = require ('webpack/lib/DefinePlugin');
const UglifyJsPlugin = require ('webpack/lib/optimize/UglifyJsPlugin');
const common = require ('./webpack.common.js');

module.exports = merge (common, {
	devtool: 'source-map',
	plugins: [
		new UglifyJsPlugin ({sourceMap: true}),
		new DefinePlugin ({
			'process.env': {
				'NODE_ENV': JSON.stringify ('production')
			}
		})
	]
});