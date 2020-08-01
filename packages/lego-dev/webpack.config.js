const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = {
  entry: path.resolve(__dirname, "src/index.ts"),
  devtool: "source-map",
  mode: "development",
  output: {
    filename: "bundle.js",
    library: "lego",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.less/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      { test: /\.svg$/, loader: "file-loader" },
    ],
  },
  externals: /^(react|react-dom|@ant\-design\/icons|antd\/.*|@lego\/core)$/,
  optimization: {
    usedExports: true,
  },
  plugins: [new MiniCssExtractPlugin()],
};
webpack(config, (err, stats) => {
  if (err) console.log(err);
  else console.log(stats.toString());
});
