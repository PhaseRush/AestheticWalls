module.exports = {
    entry: './src/eye/sketch.ts', // Point this to the file you want to build!

    output: {
        filename: "engine.js",
        path: __dirname + '/out/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    watch: true,
    stats: {
        warnings: false
    },
    optimization: {
        minimize: false // keep this on true to minimize src sizes (note: will increase compilation time by ~5x)
    }
};