const dotenv = require('dotenv');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
dotenv.config();

module.exports = {
	entry: './src/server.ts',
	mode: process.env.NODE_ENV || 'production', // 'none' | 'development' | 'production'
	target: 'node',
	externals: [nodeExternals()],
	optimization: {
		minimize: process.env.NODE_ENV === 'production'
	},
	devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
	module: {
		rules: [
			{
				// 'ts-loader'
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
