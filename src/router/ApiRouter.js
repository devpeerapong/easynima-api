const KoaRouter = require('koa-router')
const MovieRouter = require('./MovieRouter')
const CinemaRouter = require('./CinemaRouter')

const ApiRouter = new KoaRouter({
  prefix: '/api'
})

ApiRouter
  .use('/cinemas', CinemaRouter.routes(), CinemaRouter.allowedMethods())
  .use('/movies', MovieRouter.routes(), MovieRouter.allowedMethods())

module.exports = ApiRouter
