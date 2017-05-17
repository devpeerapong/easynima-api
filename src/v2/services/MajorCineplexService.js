const superagent = require('superagent')
const $ = require('cheerio')
const agent = superagent.agent()
const {
  majorMovie,
  majorMovieComingSoon,
  majorMovieShowtime
} = require('../../../html')
const seat = require('../../../seat')

const API_HOSTNAME = 'http://www.majorcineplex.com'

class MajorCineplexService {
  static async movieShowing() {
    // const response = await mock(majorMovie)
    const response = await agent.get(this.path('movie', 'ajax_movie_showing'))
    const html = response.text
    const $movieList = parseHTML(html)('.eachMoviequick')

    const nowShowing = findMovieByFilter($movieList, isShowing, getMovieMeta)
    const advanceBooking = findMovieByFilter(
      $movieList,
      isAdvanceBooking,
      getMovieMeta
    )

    return {
      nowShowing,
      advanceBooking
    }
  }

  static async comingSoon() {
    // const response = await mock(majorMovieComingSoon)
    const response = await agent.get(this.path('movies'))
    const html = response.text
    const $movieList = parseHTML(html)('.movie_coming_soon_panel')

    return $movieList.map(findMovieComingSoon).get()
  }

  static async showtime(movie_text, cinema_text) {
    // const response = await mock(majorMovieShowtime)
    const response = await agent
      .post(this.path('ajaxbooking', 'ajax_showtime'))
      .withCredentials()
      .type('form')
      .send({ movie_text, cinema_text })

    const html = `<body>${response.text}</body>`
    const $showtimeList = parseHTML(html)('body')

    return $showtimeList.find('.book_st_contain').map(getCinemaMeta).get()
  }

  static async seat(id) {
    // const response = await mockBody(seat)
    const path = this.path(
      'services',
      'booking',
      'GetSessionSeatData.php?sessionId=' + id
    )
    const response = await agent.get(path)

    const { result } = JSON.parse(response.text)
    const { seats, tickets } = result

    if (result.debug === 'ticket null' || typeof tickets.map !== 'function') {
      return { tickets: { prices: ['ไม่มีข้อมูลราคา'] } }
    }

    return {
      tickets: {
        prices: Array.prototype.concat
          .apply(
            [],
            tickets.map((ticket, i) => {
              if (i !== 0) return null

              return Object.keys(ticket).map(key => {
                return ticket[key].Price
              })
            })
          )
          .filter(t => t !== null)
          .sort()
      }
    }
  }

  static path(...args) {
    return [API_HOSTNAME, ...args].join('/')
  }
}

module.exports = MajorCineplexService

// private method.

function mock(html) {
  return new Promise(resolve => setTimeout(() => resolve({ text: html }), 200))
}

function mockBody(body) {
  return new Promise(resolve => setTimeout(() => resolve({ body }), 200))
}

function parseHTML(html) {
  return $.load(html, {
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: true
  })
}

function findMovieByFilter(DOMs, filter, map) {
  return DOMs.filter(filter).map(map).get()
}

function isShowing(_, el) {
  return !$(el).find('.poster').hasClass('adv_tic')
}

function isAdvanceBooking(_, el) {
  return $(el).find('.poster').hasClass('adv_tic')
}

function findMovieComingSoon(_, el) {
  const $el = $(el)

  return {
    date: $el.data('movie-date-panel'),
    movies: findMovieByFilter(
      $el.children('.eachMovie'),
      () => true,
      getMovieComingSoonMeta
    )
  }
}

function getCinemaMeta(_, el) {
  const $el = $(el)

  const [en, th] = $el.prev('.book_branch').text().trim().split(' | ')

  return {
    id: $el.data('cinema-id'),
    name: { en, th },
    duration: $el.find('.mvdesc').last().text(),
    rating: $el
      .find('.book_st_icon')
      .children()
      .find('img')
      .first()
      .attr('title'),
    theaters: $el.children('.book_st_row').map(getTheaterMeta).get()
  }
}

function getMovieComingSoonMeta(_, el) {
  const $el = $(el)

  return {
    name: {
      en: $el.find('.nameMovieEn').text().trim(),
      th: $el.find('.nameMovieTh').text().trim()
    },
    poster_url: $el
      .find('.btn-poster > img')
      .first()
      .attr('src')
      .replace('-large', ''),
    release_date: $el.find('.releaseDate').first().text().trim()
  }
}

function getMovieMeta(_, el) {
  const $el = $(el)

  return {
    id: $el.data('movie-id'),
    name: {
      en: $el.data('movie-name-en'),
      th: $el.data('movie-name-th')
    },
    poster_url: $el.find('.btn-poster > img').first().attr('src')
  }
}

function getTheaterMeta(_, el) {
  const $el = $(el)
  const $info = $el.find('.book_st_icon').children()

  return {
    no: $el.find('.book_st_theatre_no').text(),
    system: $info.find('img').last().attr('title'),
    language: $info.find('span').attr('title'),
    showtimes: $el.find('.book_st_time').children().map(getShowtimeMeta).get()
  }
}

function getShowtimeMeta(_, el) {
  const $el = $(el)
  return {
    id: $el.data('showtime'),
    isBooking: !$el.hasClass('pastst'),
    time: $el.text().trim()
  }
}

function arrayToObjectId(array) {
  return array.reduce((prev, curr) => {
    return Object.assign({}, prev, { [curr.id]: curr })
  }, {})
}
