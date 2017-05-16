const KoaRouter = require('koa-router')
const MovieRouter = require('./router/MovieRouter')
const CinemaRouter = require('./router/CinemaRouter')

const Router = new KoaRouter()

Router
  .use('/cinemas', CinemaRouter.routes(), CinemaRouter.allowedMethods())
  .use('/movies', MovieRouter.routes(), MovieRouter.allowedMethods())

module.exports = Router
