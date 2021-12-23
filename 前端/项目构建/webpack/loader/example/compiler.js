import webpack from 'webpack'
import path from 'path'
import { createFsFromVolume, Volume } from 'memfs';
import { FileListPlugin } from '../src/fileListPlugin.js'

export default (fixture, options = {}) => {
    const compiler = webpack({
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.txt$/,
                    use: {
                        loader: path.resolve(__dirname, '../src/loader.js'),
                        options
                    }
                }
            ]
        },
        plugins: [
            new FileListPlugin(),
        ]
    })

    compiler.outputFileSystem = createFsFromVolume(new Volume());
    compiler.outputFileSystem.join = path.join.bind(path);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) reject(err);
            if (stats.hasErrors()) reject(stats.toJson().errors);

            resolve(stats);
        });
    });
}