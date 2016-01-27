
$$quaintGoogleMapsList = [];

function $$quaintGoogleMapsEntry() {

    var geocoder = new google.maps.Geocoder();

    function listCoordinates(orig_config) {
        if (typeof(orig_config) === "string") {
            return [{address: orig_config}];
        }
        else if (Array.isArray(orig_config)) {
            var results = [];
            orig_config.forEach(function (c) {
                results = results.concat(listCoordinates(c));
            });
            return results;
        }
        else {
            var results = [];
            var hasAddress = false;
            for (var key in orig_config) {
                if (key[0] === "+") {
                    var others = listCoordinates(orig_config[key]);
                    others[0].label = key.slice(1);
                    results = results.concat(others);
                }
                else if (key === "lat" || key === "lng" || key === "address") {
                    hasAddress = true;
                }
            }
            if (hasAddress) {
                results.push(orig_config);
            }
            return results;
        }
    }

    function completeAllCoordinates(coords, resolved, cb) {
        if (coords.length === 0) {
            cb(resolved);
        }
        else {
            var c = coords.shift();
            completeCoordinates(c, function (result) {
                resolved.push(result);
                completeAllCoordinates(coords, resolved, cb);
            });
        }
    }

    function completeCoordinates(config, cb) {
        var a = config.address;
        if (a) {
            if (a.match(/^[0-9.-]+, *[0-9.-]+$/)) {
                var latlng = a.split(/, */);
                config.lat = latlng[0];
                config.lng = latlng[1];
                cb(config);
            }
            else {
                geocoder.geocode({address: a}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var loc = results[0].geometry.location;
                        config.lat = loc.lat();
                        config.lng = loc.lng();
                    } else {
                        config.error =
                            'Geocode for ' + a +
                            ' was not successful for the following reason: ' + status;
                    }
                    cb(config);
                });
            }
        }
        else {
            cb(config);
        }
    }

    $$quaintGoogleMapsList.forEach(function (config) {
        var elem = document.getElementById(config.divId);
        elem.style.height = config.height || "500px";
        if (config.width)
            elem.style.width = config.width

        var coords0 = listCoordinates(config);
        completeAllCoordinates(coords0, [], function (coords) {
            var map;
            var markers = coords.map(function (coord) {
                var marker = new google.maps.Marker({
                    position: {lat: Number(coord.lat), lng: Number(coord.lng)},
                    title: coord.label || coord.address || coord.lat + ", " + coord.lng
                });
                if (typeof(coord.marker) === "string") {
                    marker.setIcon(coord.marker);
                }
                return marker;
            });
            if (coords.length === 1) {
                map = new google.maps.Map(elem, {
                    center: markers[0].getPosition(),
                    zoom: Number(coords[0].zoom) || 15
                });
            }
            else {
                map = new google.maps.Map(elem, {
                    center: markers[0].getPosition(),
                    zoom: 15
                });
                var bounds = new google.maps.LatLngBounds();
                markers.forEach(function (marker) { bounds.extend(marker.getPosition()); });
                google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                    map.setZoom(map.getZoom()-1);
                    if (this.getZoom() > 15) {
                        this.setZoom(15);
                    }
                });
                map.fitBounds(bounds);
            }
            markers.forEach(function (marker, i) {
                if (coords[i].marker !== false) {
                    marker.setMap(map);
                    if (coords[i].info) {
                        var infowindow = new google.maps.InfoWindow({
                            content: document.getElementById(coords[i].info).innerHTML
                        });
                        marker.addListener('click', function() {
                            infowindow.open(map, marker);
                        });
                    }
                }
            });
        });
    });
}
