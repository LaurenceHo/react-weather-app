/**
 * Created by laurence-ho on 02/09/17.
 */
const path = require ('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const ProvidePlugin = require ('webpack/lib/ProvidePlugin');
const CleanWebpackPlugin = require ('clean-webpack-plugin');

module.exports = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve (__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	resolve: {
		modules: [
			path.join (__dirname, "dist"),
			"node_modules"
		],
		extensions: [ '.js', '.jsx', '.json' ]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					query: {
						presets: [ "es2015" ]
					}
				}
			},
			{
				test: /\.(jsx)$/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin ([ 'dist' ]),
		new HtmlWebpackPlugin ({
			template: 'src/index.html'
		}),
		// the plugin for jQuery
		new ProvidePlugin ({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
};

