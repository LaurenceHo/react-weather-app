const merge = require('webpack-merge');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		},
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						warnings: false
					},
					sourceMap: true
				}
			})
		]
	}
});
