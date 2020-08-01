const webpack = require("webpack");
const path = require("path");
const config = {
  entry: {
    index: path.resolve(__dirname, "src/index.ts"),
    dev: path.resolve(__dirname, "src/dev.ts"),
  },
  devtool: "source-map",
  mode: "development",
  watch: true,
  output: {
    filename: "[name].js",
    library: "lego-component",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: /^(react|react-dom|antd\/.*|@lego\/core|@lego\/dev)$/,
  optimization: {
    usedExports: true,
  },
};
webpack(config, (err, stats) => {
  if (err) console.log(err);
  else console.log(stats.toString());
});
