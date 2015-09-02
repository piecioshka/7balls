module.exports = {
    resolve: {
        extensions: ['.es6.js', '.js', '']
    },

    entry: './app/scripts/main',

    output: {
        filename: 'bundle.js',
        path: './app/dist'
    },

    module: {
        loaders: [
            {
                test: /\.es6\.js/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    }
};
