const Cinema = require('../data/Cinema')

const ThaiwareService = require('../services/ThaiwareService')
const MockThaiwareService = require('../services/MockThaiwareService')
const MovieFacade = require('./MovieFacade')

class CinemaFacade {
  static findAll() {
    return Promise.resolve(Cinema)
  }

  static findMovies(id) {
    return MovieFacade.findTheaters('', id)
  }
}

module.exports = CinemaFacade
