const sessionID = "954c3bce153e4ba9bd868b7feb7e375b"
// Katman isimleri
const sources = ["park_bahce", "fen_isleri", "egitim", "etut_proje", "sosyal","kulturel"];
const allServicesPath = `http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/GeoJSON?QueryName=geoproje_sinirlari.${"Tum_Hizmetler_Harita"}&sessionid=${sessionID}`;
const allServices = $.getJSON(allServicesPath);

const added_layers = [];
// Harita üzeri hizmet katmanları, nokta formatında
map.on("load", async function () {
  for (const source of sources) {
    await icon_loader(source); // resim yüklerken async fonksiyon kullanılıyor
    added_layers.push("layer_" + source); // layers named after their source
  }
});

function icon_loader(layer) {
  map.loadImage(`./data/icons/${layer}.png`, (error, image) => {
    if (error) throw error;
    map.addImage(`${layer}_icon`, image);
    map.addSource(layer, {
      type: "geojson",
      data: `http://cbs.diyarbakir.bel.tr/BELNET/gisapi/query/GeoJSON?QueryName=geoproje_sinirlari.${netigmaGeoJson[layer]}&sessionid=${sessionID}`,
      // data: `./data/${layer}.geojson`,
    });
    map.addLayer({
      id: "layer_" + layer,
      type: "symbol",
      source: layer,
      // minzoom: 9,
      layout: {
        "icon-image": `${layer}_icon`,
        "icon-size": 0.2,
        "visibility": "visible",
      },
    });
  });
}

// Sidebar hover events
const sidebar = document.getElementById("sidebar");
const sidebarNames = document.getElementById("sidebarNames")
sidebar.addEventListener("mouseenter", () => {
  if (sidebarNames.style.display !== "none") {
    toggleSidebarHandler();
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebarNames.style.display !== "none") {
    toggleSidebarHandler();
  }
});

// Sidebar hover function
var mini = true;  // tracks the current position
function toggleSidebarHandler() {
  if (mini) {
    console.log("opening sidebar");
    document.getElementById("sidebar").style.width = "12em";    
    this.mini = false;
  } else {
    console.log("closing sidebar");
    document.getElementById("sidebar").style.width = "4em"; 
    this.mini = true;
  }
}

// Sidebar 
const layerSwitch = document.getElementById("layerIcons")
layerHandler = function () {
  console.log("you clicked layers!")
  sidebarNames.classList.toggle("invisible")
  layerSwitch.classList.toggle("invisible")
}
filterHandler = function () {
  console.log("you clicked filter!")

}
searchHandler = function () {
  console.log("you clicked search!")

}
const sidebarBtns = document.getElementById("sidebarButtons").children
const sidebarNameElements = document.getElementById("sidebarNames").children
for (const i of sidebarBtns) {
    const classOfBtn = i.querySelector("i").className

    if (classOfBtn.includes("layer")){
      i.addEventListener("click", layerHandler)
      sidebarNameElements[0].addEventListener("click", layerHandler)
    } else if (classOfBtn.includes("funnel")) {
      i.addEventListener("click", filterHandler)
      sidebarNameElements[1].addEventListener("click", filterHandler)

    } else if (classOfBtn.includes("search")) {
      i.addEventListener("click", searchHandler)
      sidebarNameElements[2].addEventListener("click", searchHandler)

    } 
}



// Layer Switch functionality for icons
map.on("load", ()=>{
  const sidebarLayerIcons = document.getElementById("layerIcons").children
  for (const i of sidebarLayerIcons) {
    if(i.children[0].src.includes("park")) {
      i.addEventListener("click",(e)=>{
        iconClickHandler(i,e)
      })
    } else if(i.children[0].src.includes("fen")) {
      i.addEventListener("click",(e)=>{
        iconClickHandler(i,e)
      })
    } else if(i.children[0].src.includes("egitim")) {
      i.addEventListener("click",(e)=>{
        iconClickHandler(i,e)
      })
    } else if(i.children[0].src.includes("etut")) {
      i.addEventListener("click",(e)=>{
        iconClickHandler(i,e)
      })
    } else if(i.children[0].src.includes("sosyal")) {
      i.addEventListener("click",(e)=>{
        iconClickHandler(i,e)
      })
    } else if(i.children[0].src.includes("kulturel")) {
      i.addEventListener("click",(e)=>{
        iconClickHandler(i,e)
      })
    }
  }
})
function iconClickHandler(iconElement,e) {
  e.preventDefault();
  e.stopPropagation();
  const iconName = iconElement.children[0].src.match(/\w+/gm)
  const iconLayerName = "layer_" + iconName[iconName.length -2]
  var visibility = map.getLayoutProperty(iconLayerName, "visibility");
  console.log(visibility)
  if ( visibility === "visible") {
    map.setLayoutProperty(iconLayerName, "visibility", "none");
  } else if ( visibility === "none") {
    map.setLayoutProperty(iconLayerName, "visibility", "visible");
  }
}

// info screen opens when a point is clicked
const infoModal = document.getElementById("infoModal")
var myModal = new bootstrap.Modal(infoModal)  // bootstrap modal
// Event listener for clicked service point
map.on("click", (e) => {
  document.querySelector("#serviceDetails").innerHTML = ""  // clear project details section
  const features = map.queryRenderedFeatures(e.point, {   // query visible points to find details about them
    layers: added_layers,
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];
  // random image for info modal
  infoModal.querySelector("#serviceImage").src = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/1920/1080`;
  const pointID = feature.properties.Poly;
  const reportName = netigmaReportNames[feature.source];
  // Netigma report gotten with parameters that are coming from clicked points features
  // returns HTML code
  link = `http://cbs.diyarbakir.bel.tr/BELNET/gisapi/report/get?reportName=geoproje_sinirlari.${reportName}&sessionid=e5be987ac4794c968c4dce869168f4b0&filter=objectid=${pointID}&key=${pointID}`
  $.get(link   
  ).then((data) => {
    const extraInfo = document.querySelector(".extra-info");  // HTML netigma code put into invisible div
    extraInfo.innerHTML = data["Content"];
    document.querySelector(".hizmet-report-close").innerHTML = ""   // gives error for not loading a close image
  });
  const serviceName = document.querySelector(".baslik").textContent;  // more queries from invisible div
  const reportDetails = document.querySelector(".icerik").children;

  document.querySelector("#modalLabel").innerHTML = serviceName;    // writing service name to modal
  document.querySelector("#description").textContent = reportDetails[reportDetails.length-2].textContent;
  // writing service details to modal's detail subdivision
  for (let i=0; i<reportDetails.length; i++) {
    if (i == 3) {
      const text = reportDetails[i].textContent.replace("Projeye Başlama Ve Bitiş Tarihi", "Proje Tarihleri") // too long
      document.querySelector("#serviceDetails").innerHTML += `<p> ${text} </p>`;
    }
    else if (i != 4) {  // 4th element is Description, which goes under modal image
      document.querySelector("#serviceDetails").innerHTML += `<p> ${reportDetails[i].textContent} </p>`;
    }
  }
  myModal.toggle()  // show the modal
});
