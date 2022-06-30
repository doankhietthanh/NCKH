import {
  onValue,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import { database } from "./firebase.js";

const containerElement = document.querySelector(".container");
let maxLength = localStorage.getItem("maxLength");

let docsValueSensorsThreshold = [];
onValue(ref(database, "settings/sensor"), (snapshot) => {
  docsValueSensorsThreshold = snapshot.val();
});

onValue(ref(database, "settings/color"), (snapshot) => {
  const data = snapshot.val();
  const nameLocation = Object.keys(data);
});

// Load filter and load gateway ;
get(child(ref(database), "location")).then((snapshot) => {
  const values = snapshot.val();
  const nameLocationList = Object.keys(values);
  const nodeList = Object.values(values);

  // Create checkbox
  checkboxElementCreated("all");
  nameLocationList.forEach((name) => {
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
      nameLocationList.forEach((name, index) => {
        containerElement.appendChild(
          cardElementCreated(getColorLocation(name), name, nodeList[index])
        );
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      nameLocationList.forEach((name, index) => {
        containerElement.removeChild(
          containerElement.querySelector(`.card[name="${name}"]`)
        );
      });
    }
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked === true) {
        nameLocationList.forEach((name, index) => {
          if (name === checkbox.id) {
            containerElement.appendChild(
              cardElementCreated(getColorLocation(name), name, nodeList[index])
            );
          }
        });
      } else {
        checkboxAll.checked = false;
        nameLocationList.forEach((name, index) => {
          if (name === checkbox.id) {
            containerElement.removeChild(
              containerElement.querySelector(`.card[name="${name}"]`)
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
    nameLocationList.forEach((name, index) => {
      if (name === checkbox.id) {
        containerElement.appendChild(
          cardElementCreated(getColorLocation(name), name, nodeList[index])
        );
      }
    });
  });
});

onValue(ref(database, "location"), (snapshot) => {
  const data = snapshot.val();
  const nameLocationList = Object.keys(data);
  const nodeList = Object.values(data);

  nameLocationList.forEach((name, index) => {
    updateValueSensor(name, nodeList[index]);
  });
});

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
      listNodeSensor[index].sensors
    );
    divGatewayContainer.appendChild(divNode);
  });

  return divCard;
};

const nodeElementCreate = (nameGateway, nameNode, sensors) => {
  const sensorName = Object.keys(sensors);
  const sensorValue = Object.values(sensors);

  if (maxLength <= sensorName.length) {
    maxLength = sensorName.length;
    localStorage.setItem("maxLength", maxLength);
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
const updateValueSensor = (nameLocation, nodeList) => {
  const nodes = Object.keys(nodeList).map((node) => {
    return [node, nodeList[node]];
  });

  let totalSensorOverloadThreshold = 0;
  const nameLocationElement = document.querySelector(
    `label[for="${nameLocation}"]`
  );

  nodes.forEach((node) => {
    const nameNode = node[0];
    const sensors = node[1].sensors;

    const nameSensorList = Object.keys(sensors);
    const valueSensorList = Object.values(sensors);

    let nameTempList = ["co", "humi", "temp", "noise", "shine", "uv"];
    let valueTempList = ["", "", "", "", "", ""];

    nameTempList.forEach((name, index) => {
      nameSensorList.forEach((sensor, indexSensor) => {
        if (name === sensor) {
          valueTempList[index] = valueSensorList[indexSensor];
        }
      });
    });

    nameSensorList.forEach((sensor, index) => {
      const sensorValue = valueSensorList[index];
      const sensorName = nameSensorList[index];

      const sensorValueElement = document.querySelector(
        `.card[name="${nameLocation}"] .node[name="${nameNode}"] .sensor[name="${sensorName}"] .sensor-value`
      );

      const sensorNameElement = document.querySelector(
        `.card[name="${nameLocation}"] .node[name="${nameNode}"] .sensor[name="${sensorName}"] .sensor-name`
      );
      if (sensorValueElement && sensorNameElement && nameLocationElement) {
        sensorValueElement.textContent = sensorValue;
        if (
          parseInt(sensorValue) <
          parseInt(docsValueSensorsThreshold[sensorName].minT)
        ) {
          sensorValueElement.style.color = "orange";
          sensorNameElement.style.color = "orange";
          nameLocationElement.style.color = "orange";
          totalSensorOverloadThreshold++;
        } else if (
          parseInt(sensorValue) >
          parseInt(docsValueSensorsThreshold[sensorName].maxT)
        ) {
          sensorValueElement.style.color = "red";
          sensorNameElement.style.color = "red";
          nameLocationElement.style.color = "red";
          totalSensorOverloadThreshold++;
        } else {
          sensorValueElement.style.color = "black";
          sensorNameElement.style.color = "black";
        }
      }
    });
  });
  if (totalSensorOverloadThreshold === 0) {
    if (nameLocationElement) nameLocationElement.style.color = "black";
  }
};

const getColorLocation = (nameLocation) => {
  let color = "";
  onValue(ref(database, "settings/color/" + nameLocation), (snapshot) => {
    color = snapshot.val();
  });
  return color;
};
