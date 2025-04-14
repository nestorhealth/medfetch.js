const path = require("path");

module.exports = {
    mode: "production",
    target: "web",
    entry: "./src/browser/medfetch.vtab.ts",
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: "medfetch.vtab.js",
        library: {
            type: "module", // exports as ESM
        },
    },
    experiments: {
        outputModule: true, // required for `type: module`
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                },
            },
        ],
    },
};

