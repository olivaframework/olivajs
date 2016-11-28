'use strict';

var webpack = require('webpack');
var sprite = require('sprite-webpack-plugin');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var sassLintPlugin = require('sasslint-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var distPath = '/dist/';

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {

	var config = {};

	config.cache = true;

	config.entry = {
		bundle: path.resolve(__dirname, 'app/scripts/app.js'),
  };

	config.output = {
		path: __dirname + distPath,
		publicPath: isProd ? '/' : 'http://127.0.0.1:8080/',
		filename: 'js/[name].[hash].js',
		chunkFilename: isProd ? '[name].[hash].js' : '[name].js'
	};

	if (isProd) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

	config.module = {
		loaders: [{
				exclude: [/node_modules/],
				loader: 'babel',
				test: /\.js$/,
			}, {
				exclude: [/node_modules/],
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader'),
				test: /\.scss$/,
			}, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
      }, {
    		test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
    		loader: 'file-loader?publicPath=/&name=fonts/[name].[ext]'
			}, {
			  test: /\.(png|jpg|jpeg|gif)$/,
			  loader:'file?publicPath=/&name=images/[hash]-[name].[ext]'
			}, {
				exclude: [/node_modules/],
				loader: 'raw',
				test: /\.html$/,
	    }
		],
		preLoaders: [{
	    test: /\s[a|c]ss$/,
	    exclude: [/node_modules/],
	    loader: 'sasslint'
		}],
	};

	config.postcss = [
		autoprefixer({
      browsers: ['last 3 versions', '> 1%']
    })
  ];

	config.devServer = {
    contentBase: './app/public',
    stats: 'minimal'
  };

	config.jscs = {
		validateIndentation: 2,
    emitErrors: false,
    failOnHint: false,
	};

	config.plugins = [];

  config.plugins.push(
		new HtmlWebpackPlugin({
			template: './app/public/index.html',
			inject: 'body'
		}),
		new sprite({
			'source': path.resolve(__dirname, 'app/images/'),
			'imgPath': path.resolve(__dirname, 'app/sprites/'),
			'format': 'png',
			'spriteName': 'sprite',
			'connector': '-',
			'baseName': 'base',
			'base': 'icon',
			'cssPath': path.resolve(__dirname, 'app/styles/'),
			'prefix': 'icon',
			'processor': 'scss',
			'bundleMode': 'one',
		}),
		new ExtractTextPlugin('css/[name].[hash].css'),
		new sassLintPlugin({
			context: ['app/styles/custom/'],
		})
  );

  if (isProd) {
    config.plugins.push(
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: true,
				}
			}),
			new CopyWebpackPlugin([{
				from: __dirname + '/app/public'
			}])
    );
  }

  return config;
}();
