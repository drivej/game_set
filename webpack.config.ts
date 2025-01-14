import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true // Cleans the output directory before building
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',
  devServer: {
    static: path.join(__dirname, 'public'),
    historyApiFallback: true, // Ensures React routing works
    hot: true, // Enables hot module replacement
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true // Speed up compilation in development
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
              sassOptions: {
                quietDeps: true, // Suppress warnings from imported files
                verbose: true
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: '@svgr/webpack'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean) // Remove false plugins when in production
};
