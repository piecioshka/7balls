'use strict';

module.exports = {
    entry: './app/scripts/main',

    output: {
        filename: 'bundle.js',
        path: './app/dist'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /wwww\.7balls\.game\/node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    }
};
