const KoaRouter = require('koa-router')
const CinemaController = require('../controllers/CinemaController')

const CinemaRouter = new KoaRouter()

CinemaRouter
  .get('/', CinemaController.list)
  .get('/:id/movies', CinemaController.getMovies)

module.exports = CinemaRouter
