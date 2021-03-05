const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addDecoratorsLegacy,
  addPostcssPlugins,
} = require("customize-cra");
const path = require("path");
const rewirePostcss = require("react-app-rewire-postcss");
const px2rem = require("postcss-px2rem-exclude");
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: "css",
  }),
  //配置src路径别名
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  addLessLoader({
    //less
    javascriptEnabled: true,
  }),
  addDecoratorsLegacy(),
  (config, env) => {
    // 重写postcss
    rewirePostcss(config, {
      plugins: () => [
        require("postcss-flexbugs-fixes"),
        require("postcss-preset-env")({
          autoprefixer: {
            flexbox: "no-2009",
          },
          stage: 3,
        }),
        //关键:设置px2rem
        px2rem({
          remUnit: 75,
          exclude: /node-modules/i,
        }),
      ],
    });

    return config;
  }
);
