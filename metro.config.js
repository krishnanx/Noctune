// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);
config.resolver.unstable_conditionNames = [ 'browser', 'require', 'react-native', ]
// Custom resolver for missing assets
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, "png", "jpg", "jpeg", "gif"],
  extraNodeModules: {
    "missing-asset-registry-path": path.resolve(__dirname, "assets"),
  },
 
};

// Force Metro to resolve specific asset paths
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  assetPlugins: ["expo-asset/tools/hashAssetFiles"],
};

module.exports = config;

// const { getDefaultConfig } = require("metro-config");

// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig();

//   return {
//     transformer: {
//       babelTransformerPath: require.resolve("react-native-svg-transformer"),
//     },
//     resolver: {
//       assetExts: ["png", "jpg", "jpeg", "gif", "bmp", "ttf", "otf"],
//       sourceExts: [...sourceExts, "svg"],
//     },
//   };
// })();
