module.exports = simplify

var simplifyJs = require('simplify-js')

function simplify (options, geojson) {
  if (!geojson) {
    geojson = options
    options = null
  }

  options = options || {}
  options.tolerance = options.tolerance || 0.0001
  options.highQuality = options.highQuality || false

  var points = []
  geojson.geometry.coordinates.forEach(function (pos, i) {
    points.push({
      x: pos[0],
      y: pos[1],
      t: geojson.properties.time[i]
    })
  })

  var simplified = simplifyJs(points, options.tolerance, options.highQuality)

  var coords = []
  var times = []
  simplified.forEach(function (point) {
    coords.push([point.x, point.y])
    times.push(point.t)
  })

  geojson.geometry.coordinates = coords
  geojson.properties.time = times

  return geojson
}
