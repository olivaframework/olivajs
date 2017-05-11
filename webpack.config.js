'use strict';

const ENV = process.env.npm_lifecycle_event;
const isProd = ENV === 'build';
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = function makeWebpackConfig () {

	let config = {};

	config.cache = true;

	config.devtool = isProd ? 'cheap-module-source-map': 'eval';

	config.entry = { olivajs: './app/entry.ts' };

	config.output = {
		filename: 'js/[name].js',
		path: __dirname + '/dist',
		publicPath: '/',
		library: 'olivajs',
    libraryTarget: 'umd'
	};

	config.resolve = { extensions: ['.ts', '.js'] };

	config.module = {};

	config.module.loaders = [];

	config.module.loaders.push({
		test: /\.scss$/,
		use: ExtractTextPlugin.extract({
      use: [{
        loader: 'css-loader',
        options: {
          sourceMap: true,
					minimize: true,
					discardComments: {
          	removeAll: true
        	}
        }
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
						autoprefixer({ browsers: ['last 3 versions', '> 1%'] })
					]
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }]
    })
	});

	config.module.loaders.push({
    test: /\.ts$/,
    use: [{
			loader: 'ts-loader'
		}, {
			loader: 'eslint-loader',
			options: {
				configFile: '.eslintrc'
			}
		}]
  });

	config.module.loaders.push({
    test: /\.js$/,
    use: [{
			loader: 'babel-loader'
		}, {
			loader: 'eslint-loader',
			options: {
				configFile: '.eslintrc'
			}
		}]
  });

	config.plugins = [];

  config.plugins.push(
		new ExtractTextPlugin({
			filename: 'css/[name].css'
		}),
		new StyleLintPlugin({
			configFile: '.stylelintrc',
			context: './app/styles',
			failOnError: false,
			files: ['*.s?(a|c)ss'],
			ignorePlugins: ['extract-text-webpack-plugin'],
			quiet: true,
		})
  );

	if (isProd) {
    config.plugins.push(
      new webpack.NoEmitOnErrorsPlugin(),
			new webpack.optimize.UglifyJsPlugin({
				mangle: false,
				comments: false,
 				compress: { warnings: false },
				beautify: false
 			})
    );
	}

	config.devServer = {
    contentBase: __dirname + '/app',
    stats: {
	    hash: false,
	    version: false,
	    timings: true,
	    assets: false,
	    chunks: false,
	    modules: false,
	    reasons: true,
	    children: false,
	    source: false,
	    errors: true,
	    errorDetails: false,
	    warnings: true,
	    publicPath: false
		},
		host: '0.0.0.0',
		inline: true,
		port: 3000,
    open: true
  };

  return config;
}();
