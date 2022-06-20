import { app, database } from "./firebase.js";
import {
  getDatabase,
  get,
  child,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

const containerElement = document.querySelector(".container");
let maxLength = 0;

// onValue(ref(database, "location"), (snapshot) => {
//   const values = snapshot.val();
//   const docs = Object.keys(values).map((key) => {
//     return [key, values[key]];
//   });

//   let ids = [];
//   let names = [];
//   let gateway = [];
//   let colors = [];

//   docs.forEach((doc, index) => {
//     ids.push(doc[0]);
//     names.push(doc[1].name);
//     gateway.push(doc[1].gateway);
//     colors.push(doc[1].color);
//   });

//   names.forEach((name, index) => {
//     if (
//       document.querySelector(`.filter-item[name="${names[index]}"]`) !== null
//     ) {
//       console.log(names[index]);
//       document
//         .querySelector(".filter-control")
//         .removeChild(
//           document.querySelector(`.filter-item[name="${names[index]}"]`)
//         );
//     }
//   });

//   checkboxElementCreated("all");
//   names.forEach((name) => {
//     const divFilterItem = checkboxElementCreated(name);
//     document.querySelector(".filter-control").appendChild(divFilterItem);
//   });

//   const checkboxAll = document.querySelector("#option-all");
//   const checkboxes = document.querySelectorAll(
//     ".filter-control input[type=checkbox]"
//   );

//   let checkboxItems = [];
//   checkboxes.forEach((checkbox) => {
//     checkboxAll.checked = true;
//     ids.forEach((id, index) => {
//       if (names[index] === checkbox.id) {
//         containerElement.appendChild(
//           cardElementCreated(colors[index], names[index], gateway[index])
//         );
//       }
//     });
//     if (checkbox !== checkboxAll) {
//       checkboxItems.push(checkbox);
//     }
//   });

//   checkboxItems.forEach((checkbox) => {
//     checkbox.addEventListener("change", (e) => {
//       const checkboxItemChecked = document.querySelectorAll(
//         ".filter-control input[type=checkbox]:checked"
//       );
//       if (checkboxItemChecked.length === checkboxItems.length) {
//         checkboxAll.checked = true;
//       } else {
//         checkboxAll.checked = false;
//       }
//     });
//   });

//   checkboxAll.addEventListener("change", () => {
//     checkAll(checkboxAll);
//   });

//   checkboxes.forEach((checkbox) => {
//     checkbox.checked = true;
//     checkbox.addEventListener("change", () => {
//       unCheckAll(checkbox);

//       if (checkbox.checked === true) {
//         if (checkbox === checkboxAll) {
//           containerElement.innerHTML = "";
//           ids.forEach((id, index) => {
//             containerElement.appendChild(
//               cardElementCreated(colors[index], names[index], gateway[index])
//             );
//           });
//         } else {
//           ids.forEach((id, index) => {
//             if (names[index] === checkbox.id) {
//               containerElement.appendChild(
//                 cardElementCreated(colors[index], names[index], gateway[index])
//               );
//             }
//           });
//         }
//       } else {
//         if (checkbox === checkboxAll) {
//           ids.forEach((id, index) => {
//             containerElement.removeChild(
//               containerElement.querySelector(`.card[name="${names[index]}"]`)
//             );
//           });
//         } else {
//           ids.forEach((id, index) => {
//             if (names[index] === checkbox.id) {
//               containerElement.removeChild(
//                 containerElement.querySelector(`.card[name="${names[index]}"]`)
//               );
//             }
//           });
//         }
//       }
//     });
//   });

//   const checkAll = (myCheckBox) => {
//     if (myCheckBox.checked === true) {
//       checkboxes.forEach((checkbox) => {
//         checkbox.checked = true;
//       });
//     } else {
//       checkboxes.forEach((checkbox) => {
//         checkbox.checked = false;
//       });
//     }
//   };

//   const unCheckAll = (myCheckBox) => {
//     if (myCheckBox.checked === false) {
//       checkboxAll.checked = false;
//     }
//   };
// });

// Load filter and load gateway ;
get(child(ref(database), "location")).then((snapshot) => {
  const values = snapshot.val();
  const docs = Object.keys(values).map((key) => {
    return [key, values[key]];
  });

  let ids = [];
  let idTemps = [];
  let names = [];
  let gateway = [];
  let colors = [];

  docs.forEach((doc, index) => {
    ids.push(doc[0]);
    names.push(doc[1].name);
    gateway.push(doc[1].gateway);
    colors.push(doc[1].color);
  });

  // Create checkbox
  checkboxElementCreated("all");
  names.forEach((name) => {
    const divFilterItem = checkboxElementCreated(name);
    document.querySelector(".filter-control").appendChild(divFilterItem);
  });

  const checkboxAll = document.querySelector("#option-all");
  const checkboxes = document.querySelectorAll(
    ".filter-control input[type=checkbox]:not(#option-all)"
  );

  checkboxAll.addEventListener("change", () => {
    if (checkboxAll.checked === true) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
      containerElement.innerHTML = "";
      ids.forEach((id, index) => {
        containerElement.appendChild(
          cardElementCreated(colors[index], names[index], gateway[index])
        );
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      ids.forEach((id, index) => {
        containerElement.removeChild(
          containerElement.querySelector(`.card[name="${names[index]}"]`)
        );
      });
    }
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked === true) {
        ids.forEach((id, index) => {
          if (names[index] === checkbox.id) {
            containerElement.appendChild(
              cardElementCreated(colors[index], names[index], gateway[index])
            );
          }
        });
      } else {
        checkboxAll.checked = false;
        ids.forEach((id, index) => {
          if (names[index] === checkbox.id) {
            containerElement.removeChild(
              containerElement.querySelector(`.card[name="${names[index]}"]`)
            );
          }
        });
      }
    });
  });

  // If all items checked, then check all
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const checkboxItemChecked = document.querySelectorAll(
        ".filter-control input[type=checkbox]:checked"
      );
      if (checkboxItemChecked.length === checkboxes.length) {
        checkboxAll.checked = true;
      } else {
        checkboxAll.checked = false;
      }
    });
  });

  // Tick all filter when load page
  checkboxAll.checked = true;
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
    ids.forEach((id, index) => {
      if (names[index] === checkbox.id) {
        containerElement.appendChild(
          cardElementCreated(colors[index], names[index], gateway[index])
        );
      }
    });
  });
});

setTimeout(() => {
  onValue(ref(database, "location"), (snapshot) => {
    const data = snapshot.val();
    const keys = Object.keys(data);
    const values = Object.values(data);

    keys.forEach((id, index) => {
      updateValueSensor(values[index]);
    });
  });
}, 2000);

const cardElementCreated = (color, name, listNode) => {
  const divCard = document.createElement("div");
  const divFront = document.createElement("div");
  const divStrip = document.createElement("div");
  const divStripTop = document.createElement("div");
  const divLogo = document.createElement("div");

  const divGatewayTitle = document.createElement("div");
  const divGatewayIcon = document.createElement("div");
  const divGatewayContainer = document.createElement("div");

  divCard.classList.add("card");
  divFront.classList.add("front");
  divStrip.classList.add("strip");
  divStripTop.classList.add("strip-top");

  divLogo.classList.add("logo");
  divGatewayTitle.classList.add("gateway-title");
  divGatewayIcon.classList.add("gateway-icon");
  divGatewayContainer.classList.add("gateway-container");

  divCard.appendChild(divFront);
  divFront.appendChild(divStrip);
  divFront.appendChild(divLogo);
  divFront.appendChild(divGatewayTitle);
  divFront.appendChild(divGatewayIcon);
  divFront.appendChild(divGatewayContainer);
  divStrip.appendChild(divStripTop);

  divCard.setAttribute("name", name);

  divStripTop.style.backgroundColor = color;

  divLogo.innerHTML = `
    <svg width="40" height="40" viewbox="0 0 17.5 16.2">
      <path d="M3.2 0l5.4 5.6L14.3 0l3.2 3v9L13 16.2V7.8l-4.4 4.1L4.5 8v8.2L0 12V3l3.2-3z" fill="white"></path>
    </svg>
  `;

  divGatewayIcon.innerHTML = `
    <div class="master">
      <div class="circle master-red"></div>
      <div class="circle master-yellow"></div>
      <div class="circle master-green"></div>
      <div class="circle master-purple"></div>
    </div>
  `;

  divGatewayTitle.textContent = name;

  const listNodeName = Object.keys(listNode);
  const listNodeSensor = Object.values(listNode);

  listNodeName.forEach((node, index) => {
    const divNode = nodeElementCreate(
      name,
      listNodeName[index],
      listNodeSensor[index]
    );
    divGatewayContainer.appendChild(divNode);
  });

  return divCard;
};

const nodeElementCreate = (nameGateway, nameNode, sensors) => {
  const sensorName = Object.keys(sensors);
  const sensorValue = Object.values(sensors);

  if (maxLength < sensorName.length) {
    maxLength = sensorName.length;
  }

  const divNode = document.createElement("div");
  const divNodeName = document.createElement("div");
  const divNodeSensors = document.createElement("div");

  divNode.classList.add("node");
  divNodeName.classList.add("node-name");
  divNodeSensors.classList.add("node-sensors");
  divNodeSensors.style.height = `${maxLength * 50}px`;

  divNode.appendChild(divNodeName);
  divNode.appendChild(divNodeSensors);

  divNode.setAttribute("name", nameNode);
  divNodeName.textContent = nameNode;
  sensorName.forEach((sensor, index) => {
    const divSensor = sensorElementCreate(
      nameGateway,
      sensor,
      sensorValue[index]
    );
    divNodeSensors.appendChild(divSensor);
  });

  return divNode;
};

const sensorElementCreate = (nameGateway, sensorName, sensorValue) => {
  const divSensor = document.createElement("div");
  const divSensorName = document.createElement("div");
  const divSensorValue = document.createElement("div");

  divSensor.classList.add("sensor");
  divSensorName.classList.add("sensor-name");
  divSensorValue.classList.add("sensor-value");

  divSensor.setAttribute("name", sensorName);
  divSensor.appendChild(divSensorName);
  divSensor.appendChild(divSensorValue);

  const labelGateway = document.querySelector(
    `.filter label[for="${nameGateway}"]`
  );
  onValue(ref(database, "settings/sensor/" + sensorName), (snapshot) => {
    const data = snapshot.val();
    if (sensorValue < data.minT) {
      divSensorValue.style.color = "orange";
      labelGateway.style.color = "orange";
    } else if (sensorValue > data.maxT) {
      divSensorValue.style.color = "red";
      labelGateway.style.color = "red";
    }
  });

  divSensorName.textContent = sensorName.toUpperCase();
  divSensorValue.textContent = sensorValue;

  return divSensor;
};

// Checkbox
const checkboxElementCreated = (name) => {
  const divFilterItem = document.createElement("div");
  const labelCheckbox = document.createElement("label");
  const inputCheckbox = document.createElement("input");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const labelTitle = document.createElement("label");

  divFilterItem.classList.add("filter-item");
  divFilterItem.setAttribute("name", name);
  labelCheckbox.classList.add("checkbox");
  labelCheckbox.classList.add("path");
  inputCheckbox.type = "checkbox";
  inputCheckbox.id = `${name}`;
  svg.setAttribute("viewBox", "0 0 21 21");
  path.setAttributeNS(
    null,
    "d",
    "M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"
  );
  labelTitle.setAttribute("for", `${name}`);
  labelTitle.textContent = name;

  divFilterItem.appendChild(labelCheckbox);
  labelCheckbox.appendChild(inputCheckbox);
  labelCheckbox.appendChild(svg);
  svg.appendChild(path);
  divFilterItem.appendChild(labelTitle);

  return divFilterItem;
};

// Update value sensor
const updateValueSensor = (data) => {
  const nameLocation = data.name;
  const gateway = data.gateway;
  const nodes = Object.keys(gateway).map((gate) => {
    return [gate, gateway[gate]];
  });

  nodes.forEach((node) => {
    const nameNode = node[0];
    const sensors = node[1];

    const nameSensorList = Object.keys(sensors);
    const valueSensorList = Object.values(sensors);

    nameSensorList.forEach((sensor, index) => {
      const sensorValue = valueSensorList[index];
      const sensorName = nameSensorList[index];
      const sensorElement = document.querySelector(
        `.card[name="${nameLocation}"] .node[name="${nameNode}"] .sensor[name="${sensorName}"] .sensor-value`
      );
      if (sensorElement) sensorElement.textContent = sensorValue;
    });
  });
};
