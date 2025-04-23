module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["transform-remove-console", { exclude: ["error", "warn"] }],
      "react-native-reanimated/plugin", // MUST be last
    ],
  };
};
