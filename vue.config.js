module.exports = {
	baseUrl: process.NODE_ENV == "production" ? "/DWF/DWF2/" : "/",
	devServer: {
		proxy: "http://120.76.59.33"
	}
};
