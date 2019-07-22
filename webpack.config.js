const path = require("path");

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "src/main.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: ["html-loader"]
            }
        ]
    },
    externals: {
        jquery: "jQuery"
    },
    optimization: {
        minimize: false
    }
};
