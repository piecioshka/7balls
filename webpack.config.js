'use strict';

module.exports = {
    entry: {
        bundle: './app/main'
    },

    output: {
        filename: '[name].js',
        path: './public/dist',
        pathinfo: true
    },

    // devtool: '#source-map',

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
