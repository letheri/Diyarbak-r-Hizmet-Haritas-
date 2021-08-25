const bordersLink = borderName => `http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/geojson?queryname=${borderName}&sessionid=${sessionID}`
const ilceSınır = $.getJSON(bordersLink("geoilceler.ilceler_hizmet"));
const ilSınır = $.getJSON(bordersLink("geoiller.Geoiller_Hizmet"));

// İl ve ilçe sınır katmanları
map.on("load", () => {
  ilSınır.then((bdata) => {
    const provinceBorder = bdata.features[1];
    map.addSource("province_border", {
      type: "geojson",
      data: provinceBorder,
    });

    map.addLayer({
      id: "border",
      type: "line",
      source: "province_border",
      layout: {
        // Make the layer visible by default.
        visibility: "visible",
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-width": 3,
        "line-color": "blue",
      },
    });

    // const provinceCatiptalCenter = bdata.features[1]["centroid"];
    const provinceCatiptal = bdata.features[1];
    const provinceCatiptalCenter = bdata.features[1]["centroid"];
    
    map.addSource("provinceCapital_border", {
      type: "geojson",
      data: provinceCatiptal,
    });

    map.addLayer({
      id: "border2",
      type: "line",
      source: "provinceCapital_border",
      layout: {
        // Make the layer visible by default.
        visibility: "visible",
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-width": 3,
        "line-color": "blue",
      },
    });


  });
  ilceSınır.then((bdata, error) => {
    map.addSource("subdivision_borders", {
      type: "geojson",
      data: bdata,
    });
    map.addLayer({
      id: "city_borders",
      type: "line",
      source: "subdivision_borders",
      layout: {
        // Make the layer visible by default.
        visibility: "visible",
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "blue",
        "line-width": 0.5,
      },
    });
    map.addLayer({
      id: "poi-labels",
      type: "symbol",
      source: "subdivision_borders",
      layout: {
        "text-field": ["get", "İlce Adı"],
        "text-variable-anchor": ["center"],
        "text-radial-offset": 0.3,
        "text-justify": "auto",
        // 'icon-image': ['get', 'icon']
      },
    });
  });
});
