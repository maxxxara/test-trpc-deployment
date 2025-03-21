const path = require('path');
const fs = require('fs');

// Create a list of external modules from package.json dependencies
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
const externals = Object.keys(pkg.dependencies).reduce((acc, dep) => {
  acc[dep] = `commonjs ${dep}`;
  return acc;
}, {});

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals, // Don't bundle node_modules
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}; 