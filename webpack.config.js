module.exports = {
    entry: './app/scripts/main.es6.js',

    output: {
        filename: 'bundle.js',
        path: './app/dist'
    },

    module: {
        loaders: [
            {
                test: /\.es6\.js/,
                loader: 'babel',
                exclude: 'node_modules'
            }
        ]
    }
};
