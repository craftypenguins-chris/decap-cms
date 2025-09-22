// packages/decap-server/webpack.config.js
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { NODE_ENV = 'production' } = process.env;

// Anything here will be bundled even if it's in node_modules
// (we need this for internal workspace libs like decap-cms-lib-util)
const allowlist = [/^decap-cms-lib-util/];

module.exports = {
  entry: {
    index: path.join('src', 'index.ts'),
    middlewares: path.join('src', 'middlewares.ts'),
  },
  mode: NODE_ENV,
  target: 'node',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  externals: [
    // Exclude node_modules from bundle except allowlisted packages
    nodeExternals({ allowlist }),
    // Also consider the repo root node_modules (monorepo)
    nodeExternals({
      allowlist,
      modulesDir: path.resolve(__dirname, path.join('..', '..', 'node_modules')),
    }),
  ],
  plugins: [
    // Ensure the CLI entry stays executable
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),

    // Create a minimal, deploy-ready package.json in dist/ on every build
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'package.json'),
          to: path.resolve(__dirname, 'dist'),
          transform(content) {
            const src = JSON.parse(content.toString());
            const out = {
              name: src.name,
              version: src.version, // stays in sync automatically
              private: true,
              type: 'commonjs',
              main: './index.js',
              bin: { 'decap-server': './index.js' },
              scripts: {
                // IMPORTANT: no build step on target host
                start: 'node ./index.js',
              },
              // Only runtime deps — devDependencies are intentionally dropped
              dependencies: src.dependencies || {},
              // Recommend modern Node; adjust if you need older
              engines: { node: '>=18' },
            };
            return Buffer.from(JSON.stringify(out, null, 2));
          },
        },

        // Optional runtime assets (won't fail if missing)
        { from: path.resolve(__dirname, 'config'), to: path.resolve(__dirname, 'dist/config'), noErrorOnMissing: true },
        { from: path.resolve(__dirname, 'public'), to: path.resolve(__dirname, 'dist/public'), noErrorOnMissing: true },
        { from: path.resolve(__dirname, 'migrations'), to: path.resolve(__dirname, 'dist/migrations'), noErrorOnMissing: true },
        { from: path.resolve(__dirname, 'views'), to: path.resolve(__dirname, 'dist/views'), noErrorOnMissing: true },
        { from: path.resolve(__dirname, 'README.md'), to: path.resolve(__dirname, 'dist/README.md'), noErrorOnMissing: true },
      ],
    }),
  ],
};
