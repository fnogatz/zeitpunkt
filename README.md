# ZeitPunkt [ˈʦaɪ̯tˌpʊŋkt]

Tools to work with GeoJSON LineStrings with given time components.

## GeoJSON Format

A standard LineString is used to represent the coordinates. Besides that, the time for each point is stored in a `time` array as property of the GeoJSON Feature.

A minimal GeoJSON instance looks like this:

```
{
  "type": "Feature",
  "geometry": {
    "type": "LineString",  // or: "MultiPoint"
    "coordinates": [       // array of [lng,lat] coordinates
      [ 10.0304153141,      48.4343540454     ],
      [ 10.030424406259081, 48.43435113062047 ],
      ...
    ]
  },
  "properties": {
    "time": [              // array of timestamps
      1433907300000,
      1433907300088,
      ...
    ]
  }
}
```

## Usage

```javascript
var zeitpunkt = require('zeitpunkt')

fs.createReadStream('data.csv')
  .pipe(zeitpunkt.csv()) // read in CSV
  .on('data', function(geojson) {
    // remove invalid points
    geojson = zeitpunkt.clean({
      lat: [30,40] // only points with latitude between 30 and 40
    }, geojson)

    // simplify the given linestring
    geojson = zeitpunkt.simplify({
      tolerance: 0.01
    }, geojson)

    // split at 500 points
    geojson = zeitpunkt.split({
      points: 500
    }, geojson)

    console.log(geojson)
  })
```

## Command Line

zeitpunkt provides a command line tool to work with GeoJSON linestrings with time components. You can easily use the `zeitpunkt` executable after installing it as global module:

```shell
npm install -g zeitpunkt
```

It consumes geo data from `stdin` and prints the result to `stdout`. Call `zeitpunkt --help` to get a list of all options.

## Compatible Tools

A short list of tools that produce or consume GeoJSON linestrings with time components:

* [LeafletPlayback](https://github.com/hallahan/LeafletPlayback): Interactive display of GeoJSON multipoints with time components
* [transportation](https://github.com/fnogatz/transportation): Generates vehicles' positions as GeoJSON linestrings by GTFS public transportation data
* [timetraveller](https://github.com/fnogatz/timetraveller): Interactive display of GeoJSON linestrings with time components
* [timetraveller-mongodb](https://github.com/fnogatz/timetraveller-mongodb): Store GeoJSON linestrings with time components in MongoDB
* [csv2geojson](https://github.com/mapbox/csv2geojson): Convert CSV files to GeoJSON files
* [ObsJSON](https://code.google.com/p/xenia/wiki/ObsJSON): GeoJSON based observations/data-centric minimal schema

Please open an issue to add more compatible tools.
