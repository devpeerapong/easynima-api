const CinemaFacade = require('../facades/CinemaFacade')

class CinemaController {
  static async list(ctx) {
    ctx.body = await CinemaFacade.findAll()
  }

  static async getMovies(ctx) {
    const { id } = ctx.params

    ctx.body = await CinemaFacade.findMovies(id)
  }
}

module.exports = CinemaController
