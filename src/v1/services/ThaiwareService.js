const request = require('request-promise')
const superagent = require('superagent')
const agent = superagent.agent()

class ThaiwareService {
  static get BASE_API_URL() {
    return 'https://movie.thaiware.com'
  }

  static nowShowing() {
    return agent.get(this.path('now-showing'))
  }

  static showtime(form) {
    return agent
      .post(this.path('showtime') + '/')
      .withCredentials()
      .type('form')
      .send(form)
  }

  static path(...paths) {
    return this.BASE_API_URL + '/' + paths.join('/')
  }
}

module.exports = ThaiwareService
