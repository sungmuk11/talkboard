const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("Proxy setup loaded");
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
