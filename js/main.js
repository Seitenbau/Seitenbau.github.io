// map

var drawMap = function (targetId, name, x, y, zoom) {
    var bg = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner-background'
        }),
        opacity: 0.1
    });

    var labels = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner-hybrid'
        }),
        opacity: 0.5
    });

    labels.on('precompose', function (evt) {
        //evt.context.globalCompositeOperation = 'lighter';
    });
    labels.on('postcompose', function (evt) {
        evt.context.globalCompositeOperation = 'source-over';
    });




    var markers = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    name: name,
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([x, y]))
                })
            ]
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.95],
                opacity: 0.8,
                src: 'img/marker.png'
            })
        })
    });

    var map = new ol.Map({
        layers: [bg, labels, markers],
        target: document.getElementById(targetId),
        view: new ol.View({
            center: ol.proj.fromLonLat([x, y]),
            zoom: zoom
        })
    });


    var popupContent = $('#' + targetId + ' .popup')[0];

    var popup = new ol.Overlay({
        element: popupContent,
        positioning: 'bottom-center',
        stopEvent: false
    });
    map.addOverlay(popup);

    map.on('click', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature, layer) {
                return feature;
            });
        if (feature) {
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();
            popup.setPosition(coord);
            $(popupContent).popover({
                'placement': 'top',
                'html': true,
                'content': feature.get('name')
            });
            $(popupContent).popover('show');
        } else {
            $(popupContent).popover('destroy');
        }
    });

    map.on('pointermove', function (e) {
        if (e.dragging) {
            $(popupContent).popover('destroy');
            return;
        }
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    return map;

};

drawMap('map-constance', 'SEITENBAU Constance', 9.15571, 47.67034, 12);
drawMap('map-cologne', 'SEITENBAU Cologne', 6.93755, 50.93435, 12);




// scrolling
$(function () {
    var imgs = $('section img');
    $(window).scroll(function () {
        var windowHeight = $(window).height();
        imgs.each(function () {
            var rect = this.getBoundingClientRect();
            var y = rect.y || rect.top;
            if (y > 0 && y <= windowHeight) {
                $(this).parent().addClass('active');
            }
        });
    });
});
