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
    if (!buttonClicked) {
      toggleSidebarHandler();
    }
  }
});

// Sidebar hover function
var mini = true;  // tracks the current position
function toggleSidebarHandler() {
  let dontCloseTheNames =""
  if (!buttonClicked) {
    if (mini) {
      console.log("opening sidebar");
      document.getElementById("sidebar").style.width = "12em";  
      this.mini = false;
      dontCloseTheNames = "sidebarNames"
    } else {
      console.log("closing sidebar");
      document.getElementById("sidebar").style.width = "4em"; 
      this.mini = true;
    }
    sidebarLayerInvisibility(dontCloseTheNames)
  }
}
// all sidebar div IDs as an array
const sidebarContentDivIDs = [];
for (i of sidebar.children) {
  sidebarContentDivIDs.push(i.id);
}
sidebarContentDivIDs.shift();    // Deletes the first element in sidebar element IDs which is div that holds sidebar buttons
function sidebarLayerInvisibility(clickedLayer) {
  for (const i of sidebarContentDivIDs) {
    const element = document.getElementById(i)
    if(i===clickedLayer) {
      element.classList.toggle("invisible")
    } else if (element.className.includes("invisible")) {

    } else {
      element.classList.toggle("invisible")
    }
  }
}

function buttonClickCheck(btnID,sidebarWidth) {
  if (buttonClicked && btnID === clickedButtonID) {
    buttonClicked = false
  } else {
    buttonClicked = true
    document.getElementById("sidebar").style.width = `${sidebarWidth}em`;  
  }
}

// Sidebar
let buttonClicked = false
let clickedButtonID = -1
const layerHandler = function () {
  sidebarLayerInvisibility("layerIcons")
  buttonClickCheck(1,12)
  clickedButtonID = 1
}
const filterHandler = function () {
  sidebarLayerInvisibility("sideFilter")
  buttonClickCheck(2,24)
  clickedButtonID = 2

}
const searchHandler = function () {
  sidebarLayerInvisibility("sideSearch")
  buttonClickCheck(3,24)
  clickedButtonID = 3
  
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
  const iconName = iconElement.children[0].src.match(/\w+/gm) // Regex match to extract clicked icon's name
  const iconLayerName = "layer_" + iconName[iconName.length -2]
  var visibility = map.getLayoutProperty(iconLayerName, "visibility");
  console.log(visibility)
  if ( visibility === "visible") {
    map.setLayoutProperty(iconLayerName, "visibility", "none");
  } else if ( visibility === "none") {
    map.setLayoutProperty(iconLayerName, "visibility", "visible");
  }
}

// Sidebar Search screen
const sideSearchBtn = document.getElementById("sideSearchBtn");
sideSearchBtn.addEventListener("click", () => {
  allServices.done(function (data, status) {
    const searchField = document.getElementById("form1").value;
    console.log(searchField);
    document.querySelector("ul").innerHTML = "";
    const matchedPointData = {};
    for (const i of data.features) {
      const projName = i.properties["Proje Adı"];
      if (projName.toUpperCase().includes(searchField.toUpperCase())) {
        document.querySelector(
          "ul"
        ).innerHTML += `<li id="${i.properties["Objectid"]}">${projName}</li>`;
        matchedPointData[i.properties["Objectid"]] = i.geometry.coordinates;
      }
    }
    const resultsList = document.querySelectorAll("li");
    if (resultsList) {
      for (const result of resultsList) {
        result.addEventListener("click", (e) => {
          map.flyTo({
            center: matchedPointData[result.id],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          });
        });
      }
    }
  });
});



// info screen opens when a point is clicked
const infoModal = document.getElementById("infoModal")
var myModal = new bootstrap.Modal(infoModal)  // bootstrap modal
// Event listener for clicked service point
map.on("click", (e) => {
  if (buttonClicked) {  // check if the sidebar is expanded
    buttonClicked = false
    toggleSidebarHandler();
  }
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
  ).done((data) => {
    const extraInfo = document.querySelector(".extra-info");  // HTML netigma code put into invisible div
    extraInfo.innerHTML = data["Content"];
    document.querySelector(".hizmet-report-close").innerHTML = ""   // gives error for not loading a close image
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
  }).fail(()=>{
    console.log(":(")
  });
  myModal.toggle()  // show the modal
});
