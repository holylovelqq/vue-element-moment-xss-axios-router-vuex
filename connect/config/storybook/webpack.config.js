// const path = require('path')

module.exports = (baseConfig, env, defaultConfig) => {
  // Extend defaultConfig as you need.

  // For example, add typescript loader:
  defaultConfig.module.rules.push({
    test: /\.vue$/,
    loader: 'storybook-addon-vue-info/loader',
    enforce: 'post'
  })
  return defaultConfig
}
