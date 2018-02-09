const merge = require ('webpack-merge');
const common = require ('./webpack.common.js');
const HotModuleReplacementPlugin = require ('webpack/lib/HotModuleReplacementPlugin');

module.exports = merge (common, {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		historyApiFallback: true,
		hot: true,
		inline: true
	},
	plugins: [
		new HotModuleReplacementPlugin ()
	]
});