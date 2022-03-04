const path = require('path')
const webpack = require('webpack')
module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname),
    filename: './lib/cli.js'
  },
  node: {
    __dirname: true,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    }]
  },
  resolve: {
    extensions: ['.js', '.json', '.ts']
  },
  externals: ['term.js', 'pty.js', ],
  optimization: {
    minimize: true
  }
}