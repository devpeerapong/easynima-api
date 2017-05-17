class CinemaPresenter {
  constructor({ id, name, theaters }) {
    this.id = id
    this.name = name
    this.showtimes = theaters
      .reduce((prev, curr) => [...prev, ...curr.showtimes], [])
      .filter(showtime => showtime.isBooking)
      .map(showtime => showtime.time)
      .sort()
      .slice(0, 3)
  }

  static apply(json) {
    return new CinemaPresenter(json)
  }
}

module.exports = CinemaPresenter
