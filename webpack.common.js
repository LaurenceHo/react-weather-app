/**
 * Created by laurence-ho on 02/09/17.
 */
const path = require ('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const ProvidePlugin = require ('webpack/lib/ProvidePlugin');
const CleanWebpackPlugin = require ('clean-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve (__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	resolve: {
		modules: [
			path.join (__dirname, "dist"),
			"node_modules"
		],
		extensions: [ ".ts", ".tsx", '.js', '.json' ]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader"
			},
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: "pre",
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: "source-map-loader"
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(jpe?g|png|gif|ico)$/i,
				use: ['file-loader?name=[name].[ext]']
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin ([ 'dist' ]),
		new HtmlWebpackPlugin ({
			template: 'src/index.html',
			favicon: 'src/assets/favicon.ico'
		}),
		// the plugin for jQuery
		new ProvidePlugin ({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
};

