class TheaterPresenter {
  constructor({ no, language, system, showtimes }) {
    this.no = no
    this.language = language
    this.system = system
    this.showtimes = showtimes
      .filter(showtime => showtime.isBooking)
      .map(({ id, time }) => ({ id, time }))
  }

  static apply(json) {
    return new TheaterPresenter(json)
  }
}

module.exports = TheaterPresenter
