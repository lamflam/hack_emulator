var path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                presets: ['es2015']
              }
            }
        ]
    }
};
