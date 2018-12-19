const path = require("path");

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  baseUrl: process.env.NODE_ENV == "production" ? "/DWF/DWF2/" : "/",
  devServer: {
    proxy: "http://120.76.59.33"
  },
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set("@utils", resolve("src/utils"))
      .set("@components", resolve("src/components"))
      .set("@assets", resolve("src/assets"));
  },
  productionSourceMap: false
};
