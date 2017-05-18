Object.defineProperties(Array.prototype, {
  flatMap: {
    value: function(lambda) {
      return Array.prototype.concat.apply([], this.map(lambda))
    }
  }
})

Object.defineProperties(Array.prototype, {
  groupBy: {
    value: function(key) {
      return this.reduce(function(rv, x) {
        ;(rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    }
  }
})
