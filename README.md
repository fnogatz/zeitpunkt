# ZeitPunkt [ˈʦaɪ̯tˌpʊŋkt]

Tools to work with GeoJSON linestrings with given time components.

## GeoJSON Format

A standard LineString is used to represent the coordinates. Besides that the time for each point is stored in a `time` array as property of the GeoJSON Feature.

A minimal GeoJSON instance looks like this:

```
{
  "type": "Feature",
  "geometry": {
    "type": "LineString",  // or: "MultiPoint"
    "coordinates": [
      // array of [lng,lat] coordinates
    ]
  },
  "properties": {
    "time": [
      // array of UNIX timestamps
    ]
  }
}
```

## Installation

```shell
npm install -g zeitpunkt
```

## Usage

zeitpunkt provides several command line tools to work with GeoJSON linestrings with time components. In general it consumes GeoJSON data from `stdin` and prints the result to `stdout`. Use the `--help` flag on each command to get a list of all possible options.

### Transform (No-op by default)

```shell
zeitpunkt transform [options]
```

Reads GeoJSON from `stdin` and transforms it according to the options, e.g. return as [Geobuf](https://github.com/mapbox/geobuf).

### Simplify Linestring

```shell
zeitpunkt simplify [options]
```

Simplifies a given GeoJSON linestring using [simplify-js](https://github.com/mourner/simplify-js).

### Import CSV

```shell
zeitpunkt from csv [options]
```

Creates a GeoJSON linestring from a given CSV file.

## Compatible Tools

A short list of tools that produce or consume GeoJSON linestrings with time components:

* [transportation](https://github.com/fnogatz/transportation): Generates vehicles' positions as GeoJSON linestrings by GTFS transport data
* [LeafletPlayback](https://github.com/hallahan/LeafletPlayback): Interactive display of GeoJSON multipoints with time components
* [timetraveller](https://github.com/fnogatz/timetraveller): Interactive display of GeoJSON linestrings with time components
* [ObsJSON](https://code.google.com/p/xenia/wiki/ObsJSON): GeoJSON based observations/data-centric minimal schema

Please open an issue to add more compatible tools.
