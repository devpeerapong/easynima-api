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
      theaters: cinemas
        .flatMap(cinema => cinema.theaters.map(TheaterPresenter.apply))
        .filter(theater => theater.showtimes.length)
    }
  }

  static async findTickets(id) {
    const { seats, tickets } = await MajorCineplexService.seat(id)

    const seatsRemaining = seats
      .filter(row => row.Name !== '')
      .flatMap(row => row.Columns)
      .filter(seat => !Array.isArray(seat))
      .filter(seat => seat.Status === 'Empty')
      .map(seat => seat.AreaCategoryCode)
      .reduce((seats, areaNo) => {
        if (!seats[areaNo]) {
          seats[areaNo] = 1
        } else {
          seats[areaNo]++
        }

        return seats
      }, {})

    return tickets
      .map(t => ({
        name: t.Ticket,
        member_type: t.Ticket.includes('M-Gen') ? 'mgen' : 'normal',
        type: t.SeatType || t.Ticket,
        price: t.Price,
        area: t.AreaCategoryCode,
        remaining: seatsRemaining[t.AreaCategoryCode]
      }))
      .sort((a, b) => Number(a.price) > Number(b.price))
      .groupBy('member_type')
  }
}

module.exports = MovieFacade
