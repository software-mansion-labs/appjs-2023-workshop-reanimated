module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          // cwd: 'babelrc',
          extensions: ['.ts', '.tsx', '.json', '.png'],
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@lessons': './src/lessons',
            '@lib': './src/lib',
            '@navigation': './src/navigation',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
