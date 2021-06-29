/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function proxy(app) {
  app.use(
    '/tones',
    createProxyMiddleware({
      target: process.env.API_HOST,
      changeOrigin: true,
    })
  )
}
