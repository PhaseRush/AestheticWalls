module.exports = {
    entry: './src/Topography.ts',

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