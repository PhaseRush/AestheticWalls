module.exports = {
    entry: './src/doublependulum/sketch.ts', // Point this to the file you want to build!

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
    }
};