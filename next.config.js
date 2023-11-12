/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config

    // if (isServer) {
    //   config.externals = config.externals || [];

    //   // Ignore all node_modules from the server build
    //   config.externals.push(
    //     new webpack.IgnorePlugin({ resourceRegExp: /node_modules/ })
    //   );

    //   // Set the target to Node.js since we're running in a Node environment on the server
    //   config.target = "node";
    // }

    // Add a rule for .node files
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    // Return the modified config
    return config;
  },
};
