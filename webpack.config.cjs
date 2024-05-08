const path = require('path');

module.exports = {
  // entry: './src/index.ts',  // Entry point (adjust as needed)
  output: {
    filename: 'bundle.js',  // Output file
    path: path.resolve(__dirname, 'dist'),  // Output directory
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,  // Compile .ts files
        use: 'ts-loader',  // Use ts-loader to handle TypeScript
        exclude: /node_modules/  // Exclude node_modules
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Resolve these file extensions
  },
  target: 'node',  // Compile for Node.js
};
