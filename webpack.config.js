'use strict';

module.exports = {
    entry: {
        bundle: './app/scripts/main',
        phaser: './node_modules/phaser/build/phaser'
    },

    output: {
        filename: '[name].js',
        path: './app/dist',
        pathinfo: true
    },

    module: {
        loaders: [
            {
                test: /phaser\.js$/,
                loader: 'script-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    }
};
