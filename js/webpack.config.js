const config = require('flarum-webpack-config')();

// Add postcss-loader to handle CSS with Tailwind
config.module.rules.push({
  test: /\.css$/,
  use: [
    'style-loader', 
    'css-loader', 
    'postcss-loader'
  ],
});

module.exports = config;
