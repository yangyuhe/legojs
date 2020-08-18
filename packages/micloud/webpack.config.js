const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
    library: "micloud-lego",
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
    ],
  },
  externals: /^(axios|react|react-dom|react-router-dom|antd\/.*|@lego\/core|@lego\/dev)$/,
  optimization: {
    usedExports: true,
  },
  plugins: [new MiniCssExtractPlugin(), new CleanWebpackPlugin()],
};
webpack(config, (err, stats) => {
  if (err) console.log(err);
  else console.log(stats.toString());
});
