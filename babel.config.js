/*
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

*/

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["transform-remove-console", { exclude: ["error", "warn"] }],
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
      }],
      "react-native-reanimated/plugin", // MUST be last
    ],
  };
};

