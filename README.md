
# quaint-google-maps

Embed Google Maps in Quaint documents

## Install

In your Quaint project directory, run the command:

    quaint --setup google-maps


## Sample usage

```quaint

map :: Eiffel Tower, Paris, France

map ::
  address = Louvre, Paris, France
  zoom = 16
  width = 500px
  height = 500px
  label = Louvre
  info = C'est le __LOUVRE

map ::
  +Home = 4000 Coloniale, Montreal, Quebec
  +Work =
    address = 1000 Rachel Ouest, Montreal, Quebec
    info = This is where I work

```


## Sample configuration

```json
"google-maps": {
  "apiKey": "YOUR-API-KEY"
}
```

## The `map` macro

The `map` macro is the main macro you will be using. It can be used in
multiple ways:

### Plain address or coordinates

You can use the macro with an address or latitude/longitude
coordinates. This will give the map a height of 500px and the zoom
level will be 15, centered on the given point.

```quaint
map :: Eiffel Tower, Paris, France
map :: -34.397, 150.644
```

### Map sizing

Set the map's size using `height` and `width`. The `address` field
contains the address or coordinates for the center.

```quaint
map ::
  address = Eiffel Tower, Paris, France
  width = 300px
  height = 300px
```

### Zoom

You can set the zoom level with the `zoom` attribute.

```quaint
map ::
  address = Paris, France
  zoom = 10
```

### Label

The `label` attribute will be shown when you hover on the marker. It
should be a plain string. By default, the label is the address.

```quaint
map ::
  address = Eiffel Tower, Paris, France
  label = Eiffel Tower
```

### Info

The `info` attribute will be shown in an info box when you click on
the marker. Quaint markup will be applied normally.

```quaint
map ::
  address = Eiffel Tower, Paris, France
  info = The __[Eiffel Tower] was completed on March 15th, 1889
```

### Marker icon

The `marker` attribute can be set to a path to an alternate image to use as
marker.

```quaint
map ::
  address = Eiffel Tower, Paris, France
  marker = images/eiffel-tower.png
```

### No marker

The `marker` attribute can be set to `false` in order to avoid
displaying a marker.

```quaint
map ::
  address = Eiffel Tower, Paris, France
  marker = false
```

### Multiple markers

It is possible to show multiple markers on the same map. Any attribute
that starts with `+` defines a new marker:

```quaint
map ::
  +Home = 4000 Coloniale, Montreal, Quebec
  +Work =
    address = 1000 Rachel Ouest, Montreal, Quebec
    info = This is where I work
```

For each marker, the attribute name will be the `label`. The map's
bounds will be adjusted to include all markers, then zoomed out one
step (maximum zoom level 15).

A marker can be a plain address, or a map. If it is a map, `label`,
`info` and `marker` can be defined for each.


## Options

### apiKey

Your api key for Google Maps. This is optional.

