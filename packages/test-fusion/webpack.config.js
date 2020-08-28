const webpack = require("webpack");
const path = require("path");
const WebpackDevServer = require("webpack-dev-server");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const EasyProxyPlugin = require("@mi/easy-proxy-webpack-plugin");
const antdConfig = require("./antdConfig.js");
const config = {
  mode: "development",
  devtool: "source-map",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
    publicPath:
      "https://cdn.cnbj1.fds.api.mi-img.com/fusion-cloud-website/react/",
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
                modifyVars: antdConfig,
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
    new EasyProxyPlugin({
      badge: "lego",
      forceProxyHttps: true,
      port: 6667,
      webInterface: {
        webPort: 7778,
      },
      homepages: [
        "https://cloud-staging.d.xiaomi.net/react/",
        "https://cloud-staging.d.xiaomi.net/",
        "https://cloud.d.xiaomi.net/react/",
        "https://cloud.d.xiaomi.net/",
        // 'https://cloud.mioffice.cn/react/',
      ],
      localHomePage: "http://127.0.0.1:3001/",
      rewriteMapList: [
        {
          from: /https:\/\/cdn.cnbj1.fds.api.mi-img.com\/fusion-cloud-website\/react\/(.*?)(\.css.map)/,
          excludePath: "/fusion-cloud-website/react/",
          to: "http://127.0.0.1:3001/",
        },
        {
          from: function (url) {
            if (url.indexOf("/api/v1") > -1) return true;
            return false;
          },
          to: "http://test.acl.sys.srv/",
        },
      ],
    }),
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
  public: "https://cloud-staging.d.xiaomi.net/",
  disableHostCheck: true,
});
webpackdev.listen(3001);

// const compiler = webpack(config, (err, stats) => {
//   if (err) console.log(err);
//   else console.log(stats.toString());
// });
