const MovieFacade = require('../facades/MovieFacade')

class MovieController {
  static async feed (ctx) {
    const movieFeed = await MovieFacade.feed()

    ctx.body = movieFeed
  }

  static async comingSoon (ctx) {
    const movies =  await MovieFacade.findComingSoon()

    ctx.body = movies
  }

  static async cinemas (ctx) {
    const { id } = ctx.params

    const cinemas = await MovieFacade.findCinema(id)

    ctx.body = cinemas
  }

  static async theaters (ctx) {
    const { id, cinema_id } = ctx.params

    const theaters = await MovieFacade.findTheaters(id, cinema_id)

    ctx.body = theaters
  }

  static async tickets (ctx) {
    const { id } = ctx.params

    const seats = await MovieFacade.findTickets(id)

    ctx.body = seats
  }
}

module.exports = MovieController
