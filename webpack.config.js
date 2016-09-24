'use strict';

let WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js', '']
    },

    devServer: {
        outputPath: './app/dist'
    },

    entry: {
        bundle: './app/scripts/main',
        phaser: './node_modules/phaser/build/phaser'
    },

    output: {
        filename: '[name].js',
        path: './app/dist',
        // pathinfo: true
    },

    // devtool: '#inline-source-map',

    module: {
        loaders: [
            {
                test: /phaser\.js$/,
                loader: 'script-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },

    plugins: [
        new WriteFilePlugin()
    ]
};
