const webpack = require("webpack");
const path = require("path");
const WebpackDevServer = require("webpack-dev-server");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = {
  mode: "development",
  devtool: "source-map",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
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
  resolve: {
    symlinks: false,
    alias: {
      "@lego/core": path.resolve(__dirname, "node_modules/@lego/core"),
      "@lego/dev": path.resolve(__dirname, "node_modules/@lego/dev"),
      react: path.resolve(__dirname, "node_modules/react"),
      antd: path.resolve(__dirname, "node_modules/antd"),
      "react-router-dom": path.resolve(
        __dirname,
        "node_modules/react-router-dom"
      ),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      axios: path.resolve(__dirname, "node_modules/axios"),
    },
  },
  plugins: [
    new HtmlPlugin({ template: "src/index.html" }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        lego: {
          test: /(lego\-core|lego\-dev)/,
          enforce: true,
        },
      },
    },
  },
};
const compiler = webpack(config);
const webpackdev = new WebpackDevServer(compiler, {
  hot: true,
  open: true,
});
webpackdev.listen(3008);

// const compiler = webpack(config, (err, stats) => {
//   if (err) console.log(err);
//   else console.log(stats.toString());
// });
