const KoaRouter = require('koa-router')
const MovieController = require('../controllers/MovieController')

const MovieRouter = new KoaRouter()

MovieRouter
  .get('/:id/cinemas/:cinema_id/theaters', MovieController.getCinemasTheaters)
  .get('/:id/cinemas/available', MovieController.getAvailableCinemas)
  .get('/:id/cinemas', MovieController.getCinemas)
  .get('/', MovieController.list)

module.exports = MovieRouter