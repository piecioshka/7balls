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
                exclude: /node_modules/,
                loader: 'babel-loader?stage=0'
            }
        ]
    }
};
