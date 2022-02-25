const {
  override,
  addWebpackPlugin,
  addWebpackExternals,
} = require("customize-cra");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const isEnvProduction = process.env.NODE_ENV === "production";
const openAnalyzer = process.env.OPEN_ANALYZE_REPORT === "true";
const generatorGzip = process.env.GENERATE_GZIP === "true";

module.exports = override(
  isEnvProduction &&
    openAnalyzer &&
    addWebpackPlugin(new BundleAnalyzerPlugin()),
  isEnvProduction &&
    generatorGzip &&
    addWebpackPlugin(
      new CompressionWebpackPlugin({
        test: /\.(css|js)$/,
        // 只处理比1kb大的资源
        threshold: 1024,
        // 只处理压缩率低于90%的文件
        minRatio: 0.9,
      })
    ),
  addWebpackExternals({
    react: "React",
    "react-dom": "ReactDOM",
    antd: "antd",
    clipboard: "ClipboardJS",
    dayjs: "dayjs",
  })
);
