const sessionID = "3a442a1049474ff4bafd35637ef44389";
const gApiLink = "http://cbs.diyarbakir.bel.tr/BELNET/gisapi" // shortens the link length
////
// const bordersLink = borderName => `${gApiLink}/query/geojson?queryname=${borderName}&sessionid=${sessionID}`
// const ilceSınır = $.getJSON(bordersLink("geoilceler.ilceler_hizmet"));
// const ilSınır = $.getJSON(bordersLink("geoiller.Geoiller_Hizmet"));
const ilceSınır = $.getJSON("data/json/ilce_sinir2.geojson");
const ilSınır = $.getJSON("data/json/diyarbakir_il.geojson");
// City Service Names
const sources = [
  "park_bahce",
  "fen_isleri",
  "egitim",
  "etut_proje",
  "sosyal",
  "kulturel",
];

// All services combined
// const allServicesPath = `${gApiLink}/query/GeoJSON?QueryName=geoproje_sinirlari.${"Tum_Hizmetler_Harita"}&sessionid=${sessionID}`; // Netigma Api Query
const allServicesPath = `data/json/tum_hizmetler.geojson`; // Netigma Api Query
const ALL_SERVICES = $.getJSON(allServicesPath);
let province_capital_center= []
// Province and its subdivision borders
map.on("load", () => {
  ilSınır.then((bdata) => {
    console.log(bdata)
    const provinceBorder = bdata.features[1];
    province_capital_center = provinceBorder["centroid"]
    map.addSource("province_border", {
      type: "geojson",
      data: bdata,
    });

    map.addLayer({
      id: "border",
      type: "line",
      source: "province_border",
      layout: {
        // Make the layer visible for toggling later.
        "visibility": "visible",
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-width": 3,
        "line-color": "rgb(0, 255, 55)",
      },
    });

    const provinceCatiptal = bdata.features[1]; // Capital's borders
    map.addSource("provinceCapital_border", {
      type: "geojson",
      data: provinceCatiptal,
    });

    map.addLayer({
      id: "border_province_capital",
      type: "line",
      source: "provinceCapital_border",
      layout: {
        "visibility": "visible",
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-width": 3,
        "line-color": "rgb(0, 255, 55)",
      },
    });
    map.addLayer({
      id: "border_province_capital_fill",
      type: "fill",
      source: "provinceCapital_border",
      maxzoom:11,
      layout: {
        "visibility": "visible",      
      },
      paint: {
        "fill-color": "rgb(0, 255, 55)",
        "fill-opacity": 0.5,
      },
    });
    let serviceCountinCapital = 0
    ALL_SERVICES.done((all_data, status) => {
      // turf.polygon([[[39.05, 38.03], [37.05, 37.39], [37.52, 42.45], [39.14, 42.5], [39.05, 38.03]]], { name: 'mapLimit' });
      const capitalBorder =turf.polygon([bdata.features[1]["geometry"]["coordinates"][0]], { name: 'capitalBorder' });
      for (feature of all_data.features) {
        if (turf.booleanIntersects(capitalBorder, feature)) {
          serviceCountinCapital++
        }
      }
      console.log("data",all_data)
      console.log("features",all_data.features)
      console.log(serviceCountinCapital)
      map.addLayer({
        id: "province_capital",
        type: "symbol",
        source: "provinceCapital_border",
        maxzoom: 9,
        layout: {
          "text-field": serviceCountinCapital+"\nHizmet",
          "text-anchor": "center",
          "text-size": 18,
          "icon-optional": true,
          "text-allow-overlap": true,
          "text-justify": "auto",
        },
        paint: {
          "text-color": "white",
        }
      });
    })
  });
  ilceSınır.then((b2data, error) => {
    map.addSource("subdivision_borders", {
      type: "geojson",
      data: b2data,
    });
    map.addLayer({
      id: "city_borders",
      type: "line",
      source: "subdivision_borders",
      // minzoom:9,
      layout: {
        // Make the layer visible by default.
        "visibility": "visible",
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "rgb(0, 255, 55)",
        "line-width": 0.5,
        "line-opacity": 0.5,
      },
    });
    map.addLayer({
      id: "poi-labels",
      type: "symbol",
      source: "subdivision_borders",
      minzoom:8,
      layout: {
        "visibility": "visible",
        "text-field": ["get", "İlce Adı"],
        "text-variable-anchor": ["center"],
        "text-radial-offset": 0.3,
        "text-justify": "auto",
        "text-size": 12,
        // 'icon-image': ['get', 'icon']
      },
      paint: {
        "text-color": "white",
      }
    });
  });
});


// Harita üzeri hizmet katmanları, nokta formatında
map.on("load", async function () {
  for (const source of sources) {
    await icon_loader(source); // resim yüklerken async fonksiyon kullanılıyor
  }
});

function icon_loader(layer) {
  map.loadImage(`./data/icons/${layer}.png`, (error, image) => {
    if (error) throw error;
    map.addImage(`${layer}_icon`, image);
    map.addSource(layer, {
      type: "geojson",
      data: `data/json/${layer}.geojson`, // Netigma Api Query
      // data: `./data/${layer}.geojson`,
    });
    ilSınır.then((bdata) => {
      const capitalBorder = bdata.features[1]
      map.addLayer({
        id: "layerC_" + layer,
        type: "symbol",
        source: layer,
        filter: ["within",capitalBorder],
        minzoom: 11,
        layout: {
          "icon-image": `${layer}_icon`,
          "icon-size": 0.10,
          "icon-allow-overlap": true,
          // [
          //   'interpolate',
          //   ['linear'],
          //   ['zoom'],
          //   0,0.01,
          //   24,0.15
          // ],
          "visibility": "visible",
        },
      });
      map.addLayer({
        id: "layer_" + layer,
        type: "symbol",
        source: layer,
        filter: ["!",["within",capitalBorder]],
        // minzoom: 9,
        layout: {
          "icon-image": `${layer}_icon`,
          "icon-allow-overlap": true,
          "icon-size": [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,0.05,
            24,0.15
          ],
          "visibility": "visible",
        },
      });
    })
  });

  // map.moveLayer("layer_" + layer, 'country-label');
}
