'use strict';

let path = require('path');

module.exports = {
    entry: {
        bundle: path.resolve('./app/main')
    },

    output: {
        filename: '[name].js',
        path: path.resolve('./public/dist'),
        pathinfo: true
    },

    devtool: '#source-map',

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};
