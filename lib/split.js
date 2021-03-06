module.exports = split

const turf = {
  linestring: require('turf-linestring')
}

function split (options, geojson) {
  if (!geojson) {
    geojson = options
    options = null
  }

  options = options || {}
  options.points = options.points || 1000

  const res = []
  let chunk, linestring

  const entities = geojson.geometry.coordinates.length
  for (let k = 0; k < entities; k += options.points) {
    chunk = {
      times: geojson.properties.time.slice(k, k + options.points),
      coords: geojson.geometry.coordinates.slice(k, k + options.points)
    }

    linestring = turf.linestring(chunk.coords, geojson.properties)
    linestring.properties.time = chunk.times
    linestring.properties._chunk = k

    res.push(linestring)
  }

  return res
}
