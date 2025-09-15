module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    // Plugins are applied in order; reanimated must be last.
    plugins: [
      'react-native-paper/babel',
      'react-native-reanimated/plugin',
    ],
  }
}
