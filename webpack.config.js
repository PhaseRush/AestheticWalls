module.exports = {
    entry: './src/Topography.ts',

    output: {
        filename: "bundle.js",
        path: __dirname + '/dist/'
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
}