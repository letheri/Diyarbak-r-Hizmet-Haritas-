// http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/GeoJSON?
// QueryName=geoproje_sinirlari.etut_proje_hizmet_harita&sessionid=7bd9b5fc67d646b5b8859a6110ac39b7
// http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/geojson?queryname=geoilceler.ilceler_hizmet&sessionid=e5be987ac4794c968c4dce869168f4b0
// http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/geojson?queryname=geoiller.Geoiller_Hizmet&sessionid=e5be987ac4794c968c4dce869168f4b0
const netigmaReportNames = {
  "egitim":"egitim_hizmet_detay",
  "fen_isleri":"fen_is_hizmet_detay",
  "etut_proje":"etut_proje_hizmet_detay",
  "park_bahce":"park_is_hizmet_detay",
  "sosyal":"sosyal_hizmetler_detay",
  "kulturel":"kulturel_hizmetler_detay"
}
const netigmaGeoJson = {
  "egitim":"egitim_hizmet_harita",
  "fen_isleri":"fen_is_hizmet_harita",
  "etut_proje":"etut_proje_hizmet_harita",
  "park_bahce":"park_is_hizmet_harita",
  "sosyal":"sosyal_hizmetler_harita",
  "kulturel":"kulturel_hizmetler_harita"
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
//