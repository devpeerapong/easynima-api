const MovieFacade = require('../facades/MovieFacade')

class MovieController {
  static async list(ctx) {
    ctx.body = await MovieFacade.findAll()
  }

  static async getCinemas(ctx) {
    const { id } = ctx.params

    ctx.body = await MovieFacade.findCinemas(id)
  }

  static async getAvailableCinemas(ctx) {
    const { id } = ctx.params

    ctx.body = await MovieFacade.findAvailableCinemas(id)
  }

  static async getCinemasTheaters(ctx) {
    const { id, cinema_id } = ctx.params

    ctx.body = await MovieFacade.findTheaters(id, cinema_id)
  }
}

module.exports = MovieController
