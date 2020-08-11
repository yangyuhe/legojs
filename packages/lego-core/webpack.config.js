const webpack = require("webpack");
const path = require("path");
const config = {
  entry: path.resolve(__dirname, "src/index.ts"),
  devtool: "source-map",
  mode: "development",
  watch: true,
  output: {
    filename: "bundle.js",
    library: "lego",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
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
  externals: /^(react|react-dom|antd\/.*)$/,
  optimization: {
    usedExports: true,
  },
};
webpack(config, (err, stats) => {
  if (err) console.log(err);
  else console.log(stats.toString());
});
