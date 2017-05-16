const cheerio = require('cheerio')
const request = require('request-promise')
const ThaiwareService = require('../services/ThaiwareService')
const MockThaiwareService = require('../services/MockThaiwareService')

class MovieFacade {
  static get DEFAULT_CINEMA() {
    return '196,195,197,351,210,217,212,222'
  }

  static async findAll() {
    // const response = await MockThaiwareService.nowShowing()
    const response = await ThaiwareService.nowShowing()
    const $ = parseHTML(response.text)
    const movieDOMs = $.find('.movie-row > .m_show')
    const movieMetas = movieDOMs
      .map((_, el) => {
        const DOM = cheerio(el)
        const id = DOM.children()
          .first()
          .attr('href')
          .split('-')[0]
          .replace('../', '')
        const name = DOM.children().first().attr('title')

        const poster_url = DOM.children()
          .first()
          .find('.m_img')
          .first()
          .attr('src')

        return {
          id: id,
          name: normalizeName(name),
          poster_url: poster_url
        }
      })
      .get()

    return movieMetas
  }

  static async findCinemas(id) {
    const params = { movie: id, cinema: this.DEFAULT_CINEMA }
    // const response = await MockThaiwareService.showtime(params)
    const response = await ThaiwareService.showtime(params)
    const $ = parseHTML(response.text)

    const majorCineplexDOM = findCinemaDOM($, '#showTime-content-major')
    const sfCinemaDOM = findCinemaDOM($, '#showTime-content-sf')

    const majorCineplexBranch = getBranchWithShowtime(majorCineplexDOM)
    const sfCinemaBranch = getBranchWithShowtime(sfCinemaDOM)

    return [
      { name: 'Major Cineplex', branchs: majorCineplexBranch },
      { name: 'SF Cinema', branchs: sfCinemaBranch }
    ]

    function findCinemaDOM(DOM, id) {
      return DOM.find(id).find('a[data-cinema]')
    }

    function getBranchWithShowtime(cinemaDOM) {
      return cinemaDOM
        .map(getBranchMeta)
        .get()
        .filter(hasShowtime)
        .map(branch =>
          Object.assign({}, branch, { showtime: branch.showtimes[0] })
        )
    }

    function getBranchMeta(_, el) {
      const DOM = cheerio(el)

      return {
        id: DOM.data('cinema'),
        name: DOM.find('h2').text(),
        showtimes: DOM.nextUntil('a')
          .find('.link_showtime')
          .map((index, el) => cheerio(el).text())
          .get()
          .sort()
          .slice(0, 1)
      }
    }
  }

  static async findAvailableCinemas(id) {
    // const response = await MockThaiwareService.showtime(id)
    const response = await ThaiwareService.showtime(id)
    const $ = parseHTML(response.text)

    const cinemaHeaderDOM = $.find('#showTime-header-block')
    return cinemaHeaderDOM
      .children('a')
      .not('.disabled')
      .map((index, el) => cheerio(el).data('type'))
      .get()
      .reduce((p, c) => {
        return Object.assign(p, { [c]: true })
      }, {})
  }

  static async findTheaters(id, cinemaId) {
    const params = { movie: id, cinema: cinemaId }
    // const response = await MockThaiwareService.theater(params)
    const response = await ThaiwareService.showtime(params)
    const $ = parseHTML(response.text)

    const majorCineplexDOM = $.find('#showTime-content-major')
      .find('a[data-cinema]')
      .nextAll()
    const sfCinemaDOM = $.find('#showTime-content-sf')
      .find('a[data-cinema]')
      .nextAll()

    let branchDOMs

    if (majorCineplexDOM.length) {
      branchDOMs = majorCineplexDOM
    } else {
      branchDOMs = sfCinemaDOM
    }

    return branchDOMs.map(getTheaterMeta).get().filter(hasShowtime)

    function getTheaterMeta(_, el) {
      const DOM = cheerio(el)

      return {
        movie: normalizeName(DOM.find('span').children().first().text()),
        name: DOM.children()
          .first()
          .text()
          .replace(/[\s|\n]/g, '')
          .split(/(\d+)/)
          .join(' ')
          .trim(),
        language: DOM.find('span').children().eq(1).text(),
        showtimes: DOM.children()
          .last()
          .find('a.link_showtime')
          .map((i, el) => cheerio(el).text())
          .get()
      }
    }
  }
}

module.exports = MovieFacade

function parseHTML(html) {
  return cheerio.load(html)('body')
}

function hasShowtime(branch) {
  return branch.showtimes.length !== 0
}

function normalizeName(name) {
  let [en, th] = name.split(' - ')
  if (typeof th === 'undefined') {
    th = en
  }
  return { en, th }
}
