'use strict';
(function (factory, window) {
    /*globals define, module, require*/

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);


        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        factory(window.L);
    }

}(function (L) {
    // Loads a given number of markers visible in the frame
    // Inspired on the work of Ishmael Smyrnow

    L.MassMarkers = L.FeatureGroup.extend({

        options: {
            DisplaySort: function (a, b) {
                return b._leaflet_id - a._leaflet_id;
            }
        },
        initialize: function (layers, options) {
            L.setOptions(this, options);

            this._layers = {};

            var i, len;

            if (layers) {
                for (i = 0, len = layers.length; i < len; i++) {
                    this.addLayer(layers[i]);
                }
            }

            this._markers = [];
            this.onMap = false;
        },

        addLayer: function (layer) {
            this._markers.push(layer);
            if (this._map != undefined) {
                this._update();
            }
        },

        removeLayer: function (layer) {
            var markerIndex;

            for (var i = 0; i < this._markers.length; i++) {
                if (this._markers[i] == layer) {
                    markerIndex = i;
                    break;
                }
            }

            if (typeof markerIndex !== 'undefined') {
                this._markers.splice(markerIndex, 1);
                this._layer.removeLayer(layer);
            }
        },

        onAdd: function (map) {
            this._map = map;
            var self = this;
            this.onMap = true;
            if (map != null) {
                map.on("moveend", this._update, this);
            }

            // Add layer to the map
            this._layer = new L.FeatureGroup();
            this._map.addLayer(this._layer);
            this._addMarkers();
            this._cleanupMarkers();

            L.FeatureGroup.prototype.onAdd.call(this, map);
        },

        onRemove: function () {
            this._removeMarkers();
            this.onMap = false;
            map.off("moveend", this._update);
        },

        _update: function (e) {
            // Perform updates to markers on map
            if (this.onMap == true) {
                this._removeMarkers();
                this._addMarkers();
                this._cleanupMarkers();
            }
        },

        _addMarkers: function () {
            // Add select markers to layer; skips existing ones automatically
            var i, marker,
                options = this.options;

            var markers = this._getMarkersInViewport(this._map);
            markers.sort(options.DisplaySort);

            for (i = 0; i < markers.length; i++) {
                marker = markers[i];
                this._layer.addLayer(marker);
            }
        },

        _removeMarkers: function () {
            this._layer.clearLayers();
        },

        _cleanupMarkers: function () {
            // Remove out-of-bounds markers
            // Also keep those with popups or in expanded clusters
            var bounds = this._map.getBounds();

            this._layer.eachLayer(function (marker) {
                if (!bounds.contains(marker.getLatLng()) && (!marker._popup || !marker._popup._container)) {
                    this._layer.removeLayer(marker);
                }
            }, this);
        },

        _getMarkersInViewport: function (map) {
            var markers = [],
                bounds = map.getBounds(),
                i,
                marker;

            for (i = 0; i < this._markers.length; i++) {
                marker = this._markers[i];
                if (bounds.contains(marker.getLatLng())) {
                    markers.push(marker);
                }
            }

            return markers;
        }
    });

    L.massMarkers = function (markers, options) {
        var layer = new L.MassMarkers(null, options), i;
        for (i in markers) {
            layer._markers[i] = markers[i];
        }
        return layer;
    };
}, window));
