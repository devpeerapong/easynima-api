const KoaRouter = require('koa-router')

const MovieRouter = require('./routers/MovieRouter')

const Router = new KoaRouter()

Router
  .use('/movies', MovieRouter.routes(), MovieRouter.allowedMethods())

module.exports = Router
