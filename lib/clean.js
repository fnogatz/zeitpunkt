module.exports = clean

function clean (options, geojson) {
  if (!geojson) {
    geojson = options
    options = null
  }

  options = options || {}
  options.eps = options.eps || 0.001
  options.lat = options.lat || [-90, 90]
  options.lon = options.lon || [-180, 180]
  options.time = options.time || [null, null]

  var coords = []
  var times = []

  var point, time, lon, lat, prevLon, prevLat, prevTime
  for (var i = 0; i < geojson.properties.time.length && i < geojson.geometry.coordinates.length; i++) {
    point = geojson.geometry.coordinates[i]
    time = geojson.properties.time[i]
    lon = point[0]
    lat = point[1]

    if (lon < options.lon[0] || lon > options.lon[1]) {
      continue
    }
    if (lat < options.lat[0] || lat > options.lat[1]) {
      continue
    }

    if (options.time && options.time[0] && time < options.time[0]) {
      continue
    }
    if (options.time && options.time[1] && time > options.time[1]) {
      continue
    }

    if (time === prevTime) {
      continue
    }

    if (epsNear(lon, prevLon, options.eps) && epsNear(lat, prevLat, options.eps)) {
      continue
    }

    coords.push(point)
    times.push(time)

    prevLon = lon
    prevLat = lat
    prevTime = time
  }

  geojson.properties.time = times
  geojson.geometry.coordinates = coords

  return geojson
}

function epsNear (a, b, eps) {
  return Math.abs(a - b) <= eps
}
