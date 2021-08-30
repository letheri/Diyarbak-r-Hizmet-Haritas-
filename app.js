// Loading screen
let initialized = false
map.on("idle",()=>{
  if (initialized==false) {
    const loadScreen = document.getElementById("loadingScreen")
    loadScreen.remove()
    initialized = true;
  }
})

// Sidebar hover events
const sidebar = document.getElementById("sidebar");
const sidebarNames = document.getElementById("sidebarNames");
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
var mini = true; // tracks the current position
function toggleSidebarHandler() {
  let dontCloseTheNames = "";
  if (!buttonClicked) {
    if (mini) {
      document.getElementById("sidebar").style.width = "12em";
      this.mini = false;
      dontCloseTheNames = "sidebarNames";

    } else {
      document.getElementById("sidebar").style.width = "4em";
      this.mini = true;
    }
    sidebarLayerInvisibility(dontCloseTheNames);
  }
}

// all sidebar div IDs as an array
const sidebarContentDivIDs = [];
for (i of sidebar.children) {
  sidebarContentDivIDs.push(i.id);
}
sidebarContentDivIDs.shift(); // Deletes the first element's ID which is sidebar buttons
function sidebarLayerInvisibility(clickedLayer) {
  for (const i of sidebarContentDivIDs) {
    const element = document.getElementById(i);
    if (i === clickedLayer) {
      element.classList.toggle("invisible");
    } else if (element.className.includes("invisible")) {
    } else {
      element.classList.toggle("invisible");
    }
  }
}

function buttonClickCheck(btnID, sidebarWidth) {
  if (buttonClicked && btnID === clickedButtonID) {
    buttonClicked = false;
    // toggleSidebarHandler();
  } else {
    buttonClicked = true;
    document.getElementById("sidebar").style.width = `${sidebarWidth}em`;
  }
}

// Sidebar
let buttonClicked = false;
let clickedButtonID = -1;
const layerHandler = function () {
  sidebarLayerInvisibility("layerIcons");
  buttonClickCheck(1, 12);
  clickedButtonID = 1;
};
const filterHandler = function () {
  sidebarLayerInvisibility("sideFilter");
  buttonClickCheck(2, 24);
  clickedButtonID = 2;
};
const searchHandler = function () {
  sidebarLayerInvisibility("sideSearch");
  buttonClickCheck(3, 24);
  clickedButtonID = 3;
};
const sidebarBtns = document.getElementById("sidebarButtons").children;
const sidebarNameElements = sidebarNames.children;
for (const i of sidebarBtns) {
  const classOfBtn = i.querySelector("i").className;
  if (classOfBtn.includes("layer")) {
    i.addEventListener("click", layerHandler);
    sidebarNameElements[0].addEventListener("click", layerHandler);
  } else if (classOfBtn.includes("funnel")) {
    i.addEventListener("click", filterHandler);
    sidebarNameElements[1].addEventListener("click", filterHandler);
  } else if (classOfBtn.includes("search")) {
    i.addEventListener("click", searchHandler);
    sidebarNameElements[2].addEventListener("click", searchHandler);
  }
}

// Sidebar Layer Switch
map.on("load", () => {
  const sidebarLayerIcons = document.getElementById("layerIcons").querySelectorAll("a");
  for (const i of sidebarLayerIcons) {
    if (i.children[0].src.includes("park")) {
      i.addEventListener("click", (e) => {
        iconClickHandler(i, e);
      });
    } else if (i.children[0].src.includes("fen")) {
      i.addEventListener("click", (e) => {
        iconClickHandler(i, e);
      });
    } else if (i.children[0].src.includes("egitim")) {
      i.addEventListener("click", (e) => {
        iconClickHandler(i, e);
      });
    } else if (i.children[0].src.includes("etut")) {
      i.addEventListener("click", (e) => {
        iconClickHandler(i, e);
      });
    } else if (i.children[0].src.includes("sosyal")) {
      i.addEventListener("click", (e) => {
        iconClickHandler(i, e);
      });
    } else if (i.children[0].src.includes("kulturel")) {
      i.addEventListener("click", (e) => {
        iconClickHandler(i, e);
      });
    }
  }
});
// Icon visiblity function
function iconClickHandler(iconElement, e) {
  e.preventDefault();
  e.stopPropagation();
  const iconName = iconElement.children[0].src.match(/\w+/gm); // Regex match to extract clicked icon's name
  const iconLayerName = "layer_" + iconName[iconName.length - 2];     // Service icons
  const iconLayerNameF = "layerC_" + iconName[iconName.length - 2];   // Service icons in province capital

  var visibility = map.getLayoutProperty(iconLayerName, "visibility");
  var visibility = map.getLayoutProperty(iconLayerNameF, "visibility");

  if (visibility === "visible") {
    map.setLayoutProperty(iconLayerName, "visibility", "none");
    map.setLayoutProperty(iconLayerNameF, "visibility", "none");

  } else if (visibility === "none") {
    map.setLayoutProperty(iconLayerName, "visibility", "visible");
    map.setLayoutProperty(iconLayerNameF, "visibility", "visible");

  }
}


// Sidebar Search screen
const sideSearch = document.getElementById("sideSearch");
const sideSearchBtn = document.getElementById("sideSearchBtn");
sideSearchBtn.addEventListener("click", () => {
  const searchField = document.getElementById("srvSearch").value;
  document.querySelector("ul").innerHTML = "";
  for (const i in ALL_SERVICES.services) {
    if (i.toUpperCase().includes(searchField.toUpperCase())) {
      sideSearch.querySelector("ul").innerHTML += 
        `<li>${i}</li>`;
    }
  }
  const resultsList = sideSearch.querySelectorAll("li");
  if (resultsList.length > 0) {
    for (const result of resultsList) {
      result.addEventListener("click", (e) => {
        map.flyTo({
          center: ALL_SERVICES.services[result.textContent],
          essential: true, // this animation is considered essential - prefers-reduced-motion
          zoom: 14,
        });
        pulse_search_result(ALL_SERVICES.services[result.textContent])
      });
    }
  } else {
    const resultsList = sideSearch.querySelector("ul");
    resultsList.innerHTML = "<li style='background:none;font-weight:bold'>Eşleşen herhangi bir hizmet bulunmamaktadır!</li>"
  }
});

// Sidebar Filter screen
map.on("load",()=>{
  const filterProvinces = document.getElementById("accordionProvinces");
  let c = 0;
  for (const i in ALL_SERVICES.subdivisions) {
    let listHtml = ""
    ALL_SERVICES.subdivisions[i].forEach(element => {
      listHtml += `<li style="color:black">${element}</li>`
    });
    filterProvinces.innerHTML += 
      `<div class="accordion-item">
        <h4 class="accordion-header" id="heading${c}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${c}" aria-expanded="false" aria-controls="collapse${c}">
            ${i}
          </button>
        </h4>
        <div id="collapse${c}" class="accordion-collapse collapse" aria-labelledby="heading${c}" data-bs-parent="#accordionProvinces" style="">
          <div class="accordion-body"><ul>
            ${listHtml}
          </ul></div>
        </div>
    </div>`;
    c++
  }
  for (const prov of filterProvinces.children) {
    const provServices = prov.querySelectorAll("li")
    for (const service of provServices) {
      service.addEventListener("click", (e) => {
        map.flyTo({
          center: ALL_SERVICES.services[service.textContent],
          essential: true, // this animation is considered essential - prefers-reduced-motion
          zoom: 14,
        });
        pulse_search_result(ALL_SERVICES.services[service.textContent])
      });
    }
  }
})

// info screen opens when a point is clicked
const infoModal = document.getElementById("infoModal");
var myModal = new bootstrap.Modal(infoModal); // bootstrap modal
const serviceLayers = []
for (const source of sources) {
  serviceLayers.push("layer_"+source)
  serviceLayers.push("layerC_"+source)
}

map.on("click", (e) => {  // Event listener for clicked service point
  if (buttonClicked) {
    // check if the sidebar is expanded
    buttonClicked = false;
    toggleSidebarHandler();
  }
  document.querySelector("#serviceDetails").innerHTML = ""; // clear project details section on opened modal
  const features = map.queryRenderedFeatures(e.point, {
    // query visible points to find details about them - returns array of features
    layers: serviceLayers,
  });
  if (!features.length) {
    return;
  }

  // random image for info modal
  infoModal.querySelector("#serviceImage").src =`https://picsum.photos/id/${Math.floor(Math.random()*100)}/1920/1080`;

  const feature = features[0];  
  const pointID = feature.properties.Poly;
  const reportName = netigmaReportNames[feature.source];

  // Netigma report fails to load, service details can not load
  ///////////////////////////////////////////////////////////////////////////////////////////
  // Netigma report gotten with parameters that are coming from clicked points features
  // returns HTML code
  // link = `${gApiLink}/report/get?reportName=geoproje_sinirlari.${reportName}&sessionid=e5be987ac4794c968c4dce869168f4b0&filter=objectid=${pointID}&key=${pointID}`;
  // $.get(link)
  //   .done((data) => {
  //     const extraInfo = document.querySelector(".extra-info"); // HTML netigma code put into invisible div
  //     extraInfo.innerHTML = data["Content"];
  //     document.querySelector(".hizmet-report-close").innerHTML = ""; // gives error for not loading a close image
  //     const serviceName = document.querySelector(".baslik").textContent; // more queries from invisible div
  //     const reportDetails = document.querySelector(".icerik").children;

  //     document.querySelector("#modalLabel").innerHTML = serviceName; // writing service name to modal
  //     document.querySelector("#serviceDescription").textContent = reportDetails[reportDetails.length - 2].textContent;

  //     // writing service details to modal's detail subdivision
  //     for (let i = 0; i < reportDetails.length; i++) {
  //       if (i == 3) {
  //         const text = reportDetails[i].textContent.replace(
  //           "Projeye Başlama Ve Bitiş Tarihi",
  //           "Proje Tarihleri"
  //         ); // shortens the text
  //         document.querySelector(
  //           "#serviceDetails"
  //         ).innerHTML += `<p> ${text} </p>`;
  //       } else if (i != 4) {
  //         // 4th element is Description, which goes under modal image
  //         document.querySelector(
  //           "#serviceDetails"
  //         ).innerHTML += `<p> ${reportDetails[i].textContent} </p>`;
  //       }
  //     }
  //   })
  //   .fail(() => {
  //     console.log("Hizmet detay raporu yüklenemedi!");
  //   });
  myModal.toggle(); // show the modal
});

// Dark mode for elements
const darkMode = document.getElementById("darkModeSwitch")
const header = document.getElementById("header")
let style = "light"
darkMode.addEventListener("click", ()=>{
  ["bg-light2", "bg-dark", "text-light", "text-dark"].forEach(c => {
    header.classList.toggle(c)
    sidebar.classList.toggle(c)
  })
})

