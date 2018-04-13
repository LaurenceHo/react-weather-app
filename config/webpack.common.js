/**
 * Created by laurence-ho on 02/09/17.
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].bundle.js'
	},
	resolve: {
		modules: [
			path.join(__dirname, "../dist"),
			"node_modules"
		],
		extensions: [".ts", ".tsx", '.js', '.json']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
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
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(jpe?g|png|gif|ico)$/i,
				use: ['file-loader']
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: ["url-loader?limit=10000&mimetype=application/font-woff"]
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: ["file-loader"]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['../dist']),
		/*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		/*
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       * Copies project static assets.
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
		new CopyWebpackPlugin([{
			from: 'src/assets',
			to: 'assets'
		}])
	]
};

