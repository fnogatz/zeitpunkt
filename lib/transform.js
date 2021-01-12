module.exports = transform

function transform (options, geojson) {
  if (!geojson) {
    geojson = options
    options = null
  }

  options = options || {}
  options.time = options.time || id
  options.coordinates = options.coordinates || id

  for (let i = 0; i < geojson.geometry.coordinates.length; i++) {
    geojson.geometry.coordinates[i] = options.coordinates(geojson.geometry.coordinates[i], i)
    geojson.properties.time[i] = options.time(geojson.properties.time[i], i)
  }

  return geojson
}

function id (e) {
  return e
}
