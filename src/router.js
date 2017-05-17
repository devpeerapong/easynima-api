const KoaRouter = require('koa-router')
const V1Router = require('./v1')
const V2Router = require('./v2')

const ApiRouter = new KoaRouter({
  prefix: '/api'
})

ApiRouter
  .use('/v1', V1Router.routes())
  .use('/v2', V2Router.routes())

module.exports = ApiRouter
