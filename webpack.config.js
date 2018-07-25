'use strict';

let path = require('path');

function resolve(dir) {
    return path.resolve(__dirname, dir);
}

module.exports = {
    entry: {
        bundle: resolve('src/app/main')
    },

    output: {
        filename: '[name].js',
        path: resolve('src/public/dist')
    },

    devtool: '#source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
