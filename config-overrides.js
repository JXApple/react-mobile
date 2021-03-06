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
// 移动端适配添加 - 插入
const postcssAspectRatioMini = require("postcss-aspect-ratio-mini");
const postcssPxToViewport = require("postcss-px-to-viewport-opt");
const postcssWriteSvg = require("postcss-write-svg");
const postcssPresetEnv = require("postcss-preset-env"); //这个插件已经更新 postcss-preset-env 所以请使用 "postcss-preset-env": "6.0.6",
const postcssViewportUnits = require("postcss-viewport-units");
const cssnano = require("cssnano");
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
        // px2rem({
        //   remUnit: 75,
        //   exclude: /node-modules/i,
        // }),
        postcssAspectRatioMini({}),
        postcssPxToViewport({
          viewportWidth: 750, // (Number) The width of the viewport.
          viewportHeight: 1334, // (Number) The height of the viewport.
          unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
          viewportUnit: "vw", // (String) Expected units.
          selectorBlackList: [".ignore", ".hairlines", ".antd"], // (Array) The selectors to ignore and leave as px.
          minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
          mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
          exclude: /(\/|\\)(node_modules)(\/|\\)/,
        }),
        postcssWriteSvg({
          utf8: false,
        }),
        postcssPresetEnv({}),
        postcssViewportUnits({}),
        cssnano({
          "cssnano-preset-advanced": {
            zindex: false,
            autoprefixer: false,
          },
        }),
      ],
    });

    return config;
  }
);
