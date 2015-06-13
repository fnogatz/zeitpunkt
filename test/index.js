var fs = require('fs')
var test = require('tap').test
var concat = require('concat-stream')
var map = require('map-stream')
var through = require('through')

var zeitpunkt = require('../index')

test('zeitpunkt.fromCSV()', function (t) {
  t.test('Import', function (t) {
    fs.createReadStream(__dirname + '/data/simple.csv')
      .pipe(zeitpunkt.fromCSV())
      .pipe(concat(function (geojsons) {
        t.equal(geojsons.length, 1, 'Single dataset')
        t.equal(geojsons[0].geometry.coordinates.length, 3, '3 Coordinates')
        t.equal(geojsons[0].properties.time.length, 3, '3 Times')

        t.end()
      }))
  })

  t.test('Multiple IDs', function (t) {
    fs.createReadStream(__dirname + '/data/multiple-ids.csv')
      .pipe(zeitpunkt.fromCSV())
      .pipe(concat(function (geojsons) {
        t.equal(geojsons.length, 2, 'Two datasets')
        t.equal(geojsons[0].geometry.coordinates.length, 2, '2 Coordinates')
        t.equal(geojsons[0].properties.time.length, 2, '2 Times')

        t.end()
      }))
  })

  t.test('UTM projection', function (t) {
    fs.createReadStream(__dirname + '/data/utm.csv')
      .pipe(zeitpunkt.fromCSV({
        projUtm: '32N'
      }))
      .pipe(concat(function (geojsons) {
        t.deepEqual(geojsons[0].geometry.coordinates,
          [ [ 11.031314, 49.573937 ] ],
          'Coordinates projected')

        t.end()
      }))
  })

  t.test('UNIX timestamp', function (t) {
    fs.createReadStream(__dirname + '/data/timestamp.csv')
      .pipe(zeitpunkt.fromCSV())
      .pipe(concat(function (geojsons) {
        t.equal(geojsons[0].properties.time[0], 1201955608000)

        t.end()
      }))
  })

  t.test('Logical time', function (t) {
    fs.createReadStream(__dirname + '/data/logical-time.csv')
      .pipe(zeitpunkt.fromCSV())
      .pipe(concat(function (geojsons) {
        t.equal(geojsons[0].properties.time[0], 1)
        t.equal(geojsons[0].properties.time[1], 1.1)
        t.equal(geojsons[0].properties.time[2], 3.1415)

        t.end()
      }))
  })

  t.test('Erlangen sample data', function (t) {
    fs.createReadStream(__dirname + '/data/erlangen.csv')
      .pipe(zeitpunkt.fromCSV({
        delimiter: ';',
        columns: 'id,x,y,time'
      }))
      .pipe(concat(function (geojsons) {
        t.equal(geojsons[0].properties.time.length, 2)
        t.equal(geojsons[1].properties.time.length, 1)

        t.end()
      }))
  })

  t.end()
})

test('zeitpunkt.simplify()', function (t) {
  fs.createReadStream(__dirname + '/data/simplify.csv')
    .pipe(zeitpunkt.fromCSV())
    .pipe(map(function (geojson, callback) {
      callback(null, zeitpunkt.simplify({
        tolerance: 0.5
      }, geojson))
    }))
    .pipe(concat(function (geojsons) {
      t.equal(geojsons[0].geometry.coordinates.length, 2)
      t.equal(geojsons[0].properties.time.length, 2)

      t.end()
    }))
})

test('zeitpunkt.clean()', function (t) {
  fs.createReadStream(__dirname + '/data/logical-time.csv')
    .pipe(zeitpunkt.fromCSV())
    .pipe(map(function (geojson, callback) {
      callback(null, zeitpunkt.clean({
        time: [1.1, null]
      }, geojson))
    }))
    .pipe(concat(function (geojsons) {
      t.equal(geojsons[0].geometry.coordinates.length, 2)
      t.equal(geojsons[0].properties.time.length, 2)

      t.end()
    }))
})

test('zeitpunkt.split()', function (t) {
  fs.createReadStream(__dirname + '/data/simplify.csv')
    .pipe(zeitpunkt.fromCSV())
    .pipe(through(function write (geojson) {
      var self = this
      zeitpunkt.split({
        points: 10
      }, geojson).forEach(function (chunk) {
        self.queue(chunk)
      })
    }, function end () {
      this.queue(null)
    }))
    .pipe(concat(function (geojsons) {
      t.equal(geojsons.length, 3, 'Split into 3 chunks')
      t.equal(geojsons[2].geometry.coordinates.length, 1, 'Last chunk with single point')

      t.end()
    }))
})

test('zeitpunkt.transform()', function (t) {
  t.test('Transform time', function (t) {
    fs.createReadStream(__dirname + '/data/logical-time.csv')
      .pipe(zeitpunkt.fromCSV())
      .pipe(map(function (geojson, callback) {
        callback(null, zeitpunkt.transform({
          time: function (time) {
            return time * 1000
          }
        }, geojson))
      }))
      .pipe(concat(function (geojsons) {
        t.equal(geojsons[0].properties.time[0], 1000)
        t.equal(geojsons[0].properties.time[1], 1100)
        t.equal(geojsons[0].properties.time[2], 3141.5)

        t.end()
      }))
  })

  t.end()
})
