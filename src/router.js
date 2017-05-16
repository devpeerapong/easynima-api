const KoaRouter = require('koa-router')
const V1Router = require('./v1')

const ApiRouter = new KoaRouter({
  prefix: '/api'
})

ApiRouter
  .use('/v1', V1Router.routes(), V1Router.allowedMethods())

module.exports = ApiRouter
