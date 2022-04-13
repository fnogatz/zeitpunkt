module.exports = fromCSV

const combine = require('stream-combiner')
const through = require('through')
const { parse: csvParse } = require('csv-parse')
const utm2latlon = require('utmgeoconv').utmToLatLon
const turf = {
  linestring: require('turf-linestring')
}

function fromCSV (options) {
  options = options || {}
  let cols
  if (options.projUtm) {
    cols = 'id,date,x,y'
  } else {
    cols = 'id,date,lon,lat'
  }
  cols = options.columns || cols

  options.columns = cols.split(/[,;]/)
  options.ignore = options.ignore || 0

  let row = -1
  const rows = {
    withoutId: []
  }

  function write (data) {
    row++

    if (row < options.ignore) {
      return
    }

    if (data.id) {
      if (!rows[data.id]) {
        rows[data.id] = []
      }
      rows[data.id].push(data)
    } else {
      rows.withoutId.push(data)
    }
  }

  function end () {
    let rowsLength, linestring, row, lon, lat, time, i, coords, times
    let zoneNumber, zoneLetter, converted

    for (const id in rows) {
      rowsLength = rows[id].length

      if (rowsLength === 0) {
        continue
      }

      coords = []
      times = []

      for (i = 0; i < rowsLength; i++) {
        row = rows[id][i]

        if (typeof row.date === 'undefined' && typeof row.time !== 'undefined') {
          row.date = row.time
        }

        if (options.projUtm) {
          zoneLetter = options.projUtm.slice(-1)
          zoneNumber = parseInt(options.projUtm, 10)
          converted = utm2latlon(zoneNumber, zoneLetter, row.x, row.y)
          lat = converted.lat
          lon = converted.lon
        } else {
          lon = parseFloat(row.lon, 10)
          lat = parseFloat(row.lat, 10)
        }

        coords.push([lon, lat])

        // is already a number
        if (!isNaN(row.date)) {
          time = parseFloat(row.date)
        } else {
          time = new Date(row.date).getTime()
        }

        times.push(time)
      }

      linestring = turf.linestring(coords, {
        time: times,
        id: id
      })

      this.queue(linestring)
    }

    this.queue(null)
  }

  const streams = [
    csvParse(options),
    through(write, end)
  ]

  return combine(streams)
}
