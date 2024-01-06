/** @type {import('next').NextConfig} */

const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,

  // removed the destructuring of the webpack here beside isServer
  webpack: (config, { isServer }) => {
    try{
      // new test line I added while building
      // const webpack = require('webpack')
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve('crypto-browserify'),
        };
  
        config.plugins.push(
          new webpack.ProvidePlugin({
            process: 'process/browser',
          }),
          new webpack.NormalModuleReplacementPlugin(
            /node:crypto/,
            (resource) => {
              resource.request = resource.request.replace(/^node:/, '');
            }
          )
        );
      }
    } catch (error) {
      console.info('webpack error has been caught and dumped just because')
    }
    
    return config;
  },
};

module.exports = nextConfig;
