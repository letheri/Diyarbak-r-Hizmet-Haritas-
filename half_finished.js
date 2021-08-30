// http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/GeoJSON?QueryName=geoproje_sinirlari.etut_proje_hizmet_harita&sessionid=
// http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/geojson?queryname=geoilceler.ilceler_hizmet&sessionid=
// http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/geojson?queryname=geoiller.Geoiller_Hizmet&sessionid=
const netigmaReportNames = {
  egitim: "egitim_hizmet_detay",
  fen_isleri: "fen_is_hizmet_detay",
  etut_proje: "etut_proje_hizmet_detay",
  park_bahce: "park_is_hizmet_detay",
  sosyal: "sosyal_hizmetler_detay",
  kulturel: "kulturel_hizmetler_detay",
};
const netigmaGeoJson = {
  egitim: "egitim_hizmet_harita",
  fen_isleri: "fen_is_hizmet_harita",
  etut_proje: "etut_proje_hizmet_harita",
  park_bahce: "park_is_hizmet_harita",
  sosyal: "sosyal_hizmetler_harita",
  kulturel: "kulturel_hizmetler_harita",
};

const size = 200;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
const pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  // Call once before every frame where the icon will be used.
  render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;

    const radius = (size / 2) * 0.3;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;

    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
    context.fill();

    // Draw the inner circle.
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 100, 100, 1)";
    context.strokeStyle = "white";
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // Update this image's data with data from the canvas.
    this.data = context.getImageData(0, 0, this.width, this.height).data;

    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();

    // Return `true` to let the map know that the image was updated.
    return true;
  },
};
function pulse_search_result(coordinates) {

  map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

  map.addSource("dot-point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coordinates, // icon position [lng, lat]
          },
        },
      ],
    },
  });
  map.addLayer({
    'id': 'layer-with-pulsing-dot',
    'type': 'symbol',
    'source': 'dot-point',
    'layout': {
    'icon-image': 'pulsing-dot'
    }
    });

}
// point groups have 'layer_' added their name while decleration
// this creates an array
// sources.forEach((ele) => {
//   el = added_layers.push("layer_" + ele);
//   map.on("load", el, (e) => {
//     console.log(e);
//   });
// });

// const popups = {}
// map.on("moveend", () => {
//   for (i in popups) {popups[i].remove();console.log("ö")}    // delete old popups
//   c = 0
//   const features = map.queryRenderedFeatures({ layers: added_layers });
//   console.log(features);
//   features.forEach((feature) => {
//     if (!feature.id) {feature.id=c}
//     console.log(feature);
//     popups[c] = new mapboxgl.Popup({
//       closeButton: false,
//       closeOnClick: false,
//     })
//       .setLngLat(feature.geometry.coordinates)
//       .setHTML(`<div id=${feature.id}><img src="https://picsum.photos/id/${Math.floor(feature.id*3.415)}/120/90">${feature.id}
//       </div>`)
//       .addTo(map);
//     c++
//   });
// })
