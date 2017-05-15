const request = require('request-promise')
const { movie, showtime, cinema, theater } = require('../../html')

class MockThaiwareService {
  static nowShowing() {
    return Promise.resolve({ text: movie })
  }

  static showtime(movie) {
    return Promise.resolve({ text: cinema })
  }

  static theater(movie) {
    return Promise.resolve({ text: theater })
  }
}

module.exports = MockThaiwareService
