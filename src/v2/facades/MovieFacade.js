const MajorCineplexService = require('../services/MajorCineplexService')
const CinemaPresenter = require('../presenters/CinemaPresenter')
const TheaterPresenter = require('../presenters/TheaterPresenter')

const PARAGON_CINEPLEX = 1
const ESPLANADE_CINEPLEX_RATCHADAPISEK = 23
const EASTVILLE_CINEPLEX = 119
const EGV_LADPHRAO = 24

const DEFAULT_CINEMA = [
  PARAGON_CINEPLEX,
  ESPLANADE_CINEPLEX_RATCHADAPISEK,
  EASTVILLE_CINEPLEX,
  EGV_LADPHRAO
].join('+')

class MovieFacade {
  static async feed() {
    const [{ nowShowing, advanceBooking }, comingSoonAll] = await Promise.all([
      MajorCineplexService.movieShowing(),
      MajorCineplexService.comingSoon()
    ])

    const [comingSoon, ..._] = comingSoonAll

    return {
      nowShowing,
      advanceBooking,
      comingSoon: comingSoon.movies
    }
  }

  static async findComingSoon() {
    const movies = await MajorCineplexService.comingSoon()

    return movies
  }

  static async findCinema(movieId, cinemaId = DEFAULT_CINEMA) {
    const cinemas = await MajorCineplexService.showtime(movieId, cinemaId)

    return cinemas
      .map(CinemaPresenter.apply)
      .filter(cinema => cinema.showtimes.length)
  }

  static async findTheaters(movieId, cinemaId) {
    const cinemas = await MajorCineplexService.showtime(movieId, cinemaId)

    return {
      duration: cinemas.length === 0 ? '' : cinemas[0].duration,
      theaters: Array.prototype.concat
        .apply(
          [],
          cinemas.map(cinema => cinema.theaters.map(TheaterPresenter.apply))
        )
        .filter(theater => theater.showtimes.length)
    }
  }

  static async findSeats(id) {
    const seats = await MajorCineplexService.seat(id)

    return seats
  }
}

module.exports = MovieFacade
