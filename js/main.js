import { app, database } from "./firebase.js";
import {
  getDatabase,
  get,
  child,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

const LIST_COLOR = {
  "--strip-red": "linear-gradient(to bottom, #ff6767, #ff4545)",
  "--strip-yellow": "linear-gradient(to bottom, #ffd800, #ffb300)",
  "--strip-green": "linear-gradient(to bottom, #66ffa2, #20c15d)",
  "--strip-purple": "linear-gradient(to bottom, #9b00ff, #4500b3)",
};

const containerElement = document.querySelector(".container");

let ids = [];
let names = [];
let gateway = [];

const randomColor = () => {
  const colors = Object.keys(LIST_COLOR);
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
};

onValue(ref(database, "location"), (snapshot) => {
  const values = snapshot.val();
  const docs = Object.keys(values).map((key) => {
    return [key, values[key]];
  });

  docs.forEach((doc, index) => {
    ids.push(doc[0]);
    names.push(doc[1].name);
    gateway.push(doc[1].gateway);
  });

  names.forEach((name) => {
    const divFilterItem = checkboxElementCreated(name);
    document.querySelector(".filter-control").appendChild(divFilterItem);
  });

  const checkboxes = document.querySelectorAll(
    ".filter-control input[type=checkbox]"
  );
  const checkboxAll = document.querySelector("#option-all");
  checkboxAll.checked = true;

  checkboxAll.addEventListener("change", () => {
    checkAll(checkboxAll);
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      unCheckAll(checkbox);
      console.log(checkbox.id, checkbox.checked);

      if (checkboxAll.checked === true) {
        containerElement.innerHTML = "";
        ids.forEach((id, index) => {
          containerElement.appendChild(
            cardElementCreated(
              LIST_COLOR[randomColor()],
              names[index],
              gateway[index]
            )
          );
        });
      } else if (checkbox.checked === true) {
        ids.forEach((id, index) => {
          if (names[index] === checkbox.id) {
            containerElement.appendChild(
              cardElementCreated(
                LIST_COLOR[randomColor()],
                names[index],
                gateway[index]
              )
            );
          }
        });
      } else if (checkbox.checked === false) {
        ids.forEach((id, index) => {
          if (names[index] === checkbox.id) {
            console.log(
              containerElement.querySelector(`.card[name="${names[index]}"]`)
            );
            containerElement.removeChild(
              containerElement.querySelector(`.card[name="${names[index]}"]`)
            );
          }
        });
      } else if (checkboxAll.checked === false) {
        ids.forEach((id, index) => {
          containerElement.removeChild(
            containerElement.querySelector(`.card[name=${names[index]}]`)
          );
        });
      }
    });
  });

  const checkAll = (myCheckBox) => {
    if (myCheckBox.checked === true) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  };

  const unCheckAll = (myCheckBox) => {
    if (myCheckBox.checked === false) {
      checkboxAll.checked = false;
    }
  };
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

  divStripTop.style.backgroundImage = color;

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
      listNodeName[index],
      listNodeSensor[index]
    );
    divGatewayContainer.appendChild(divNode);
  });

  return divCard;
};

const nodeElementCreate = (node, sensors) => {
  const sensorName = Object.keys(sensors);
  const sensorValue = Object.values(sensors);

  const divNode = document.createElement("div");
  const divNodeName = document.createElement("div");
  const divNodeSensors = document.createElement("div");

  divNode.classList.add("node");
  divNodeName.classList.add("node-name");
  divNodeSensors.classList.add("node-sensors");

  divNode.appendChild(divNodeName);
  divNode.appendChild(divNodeSensors);

  divNodeName.textContent = node;
  sensorName.forEach((sensor, index) => {
    const divSensor = sensorElementCreate(sensor, sensorValue[index]);
    divNodeSensors.appendChild(divSensor);
  });

  return divNode;
};

const sensorElementCreate = (sensorName, sensorValue) => {
  const divSensor = document.createElement("div");
  const divSensorName = document.createElement("div");
  const divSensorValue = document.createElement("div");

  divSensor.classList.add("sensor");
  divSensorName.classList.add("sensor-name");
  divSensorValue.classList.add("sensor-value");

  divSensor.appendChild(divSensorName);
  divSensor.appendChild(divSensorValue);

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
