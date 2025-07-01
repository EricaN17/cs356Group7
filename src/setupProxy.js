// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/v1',                      // catch calls to /api/v1/*
        createProxyMiddleware({
            target:      'http://localhost:8000',
            changeOrigin: true,
            pathRewrite: { '^/api/v1': '' } // strip the prefix so backend sees /experiments
        })
    );
};
