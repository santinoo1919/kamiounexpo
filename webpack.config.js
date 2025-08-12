const { createExpoWebpackConfigAsync } = require("@expo/metro-runtime")

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)

  // That's it! Expo SDK 53 handles everything automatically
  return config
}
