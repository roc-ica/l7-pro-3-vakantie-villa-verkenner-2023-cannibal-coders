import path from 'path';
import { Configuration as WebpackConfig } from 'webpack';
import { Configuration as WebpackDevServerConfig } from 'webpack-dev-server';

interface Configuration extends WebpackConfig {
  devServer?: WebpackDevServerConfig;
}

const config: Configuration = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
  },
};

export default config;
