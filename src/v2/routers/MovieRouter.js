const KoaRouter = require('koa-router')
const MovieController = require('../controllers/MovieController')

const MovieRouter = new KoaRouter()

MovieRouter.get('/feed', MovieController.feed)
MovieRouter.get('/coming-soon', MovieController.comingSoon)
MovieRouter.get('/:id/cinemas', MovieController.cinemas)
MovieRouter.get('/:id/cinemas/:cinema_id/theaters', MovieController.theaters)
MovieRouter.get('/tickets/:id', MovieController.tickets)

module.exports = MovieRouter
