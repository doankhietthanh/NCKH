const endPoint = "http://127.0.0.1:3000/";
// const endPoint = "https://iot-system-h3-server.herokuapp.com/";

const socket = io(endPoint);

const LIST_SENSOR = ["co", "humi", "noise", "shine", "temp", "uv"];

const TableRowElementCreated = (time, location, nodes, sensors) => {
  const tableRowLi = document.createElement("li");
  tableRowLi.classList.add("table-row");

  const col1Div = document.createElement("div");
  col1Div.classList.add("col");
  col1Div.classList.add("col-1");
  col1Div.setAttribute("data-label", "time");
  col1Div.innerText = time;

  const col2Div = document.createElement("div");
  col2Div.classList.add("col");
  col2Div.classList.add("col-2");
  col2Div.setAttribute("data-label", "location");
  col2Div.innerText = location;

  const col3Div = document.createElement("div");
  col3Div.classList.add("col");
  col3Div.classList.add("col-3");
  col3Div.setAttribute("data-label", "node");

  const col4Div = document.createElement("div");
  col4Div.classList.add("col");
  col4Div.classList.add("col-4");
  col4Div.setAttribute("data-label", "sensor");

  tableRowLi.appendChild(col1Div);
  tableRowLi.appendChild(col2Div);
  tableRowLi.appendChild(col3Div);
  tableRowLi.appendChild(col4Div);

  nodes.forEach((node, index) => {
    col3Div.appendChild(NodeItemElementCreated(node));

    col4Div.appendChild(SensorItemElementCreated(node, sensors[index]));
  });

  return tableRowLi;
};

const NodeItemElementCreated = (node) => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  rowDiv.innerText = node;

  return rowDiv;
};

const SensorItemElementCreated = (node, sensors) => {
  const nameSensorList = Object.keys(sensors);
  const valueSensorList = Object.values(sensors);

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  LIST_SENSOR.forEach((e, index) => {
    const colDiv = document.createElement("div");
    colDiv.classList.add("col");
    // colDiv.innerText = valueSensorList[nameSensorList.indexOf(e)];
    nameSensorList.forEach((e1, index1) => {
      if (e === e1) {
        colDiv.innerText = valueSensorList[index1];
      }
    });
    rowDiv.appendChild(colDiv);
  });

  return rowDiv;
};

const getDayAndTime = (time) => {
  const date = new Date(time);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

const renderHistory = (data) => {
  const timestamp = Object.keys(data);
  const locationList = Object.values(data);

  tableMain.innerHTML = "";
  timestamp.forEach((time, index) => {
    const location = Object.keys(locationList[index]);
    const nodeList = Object.values(locationList[index]);

    nodeList.forEach((node, index) => {
      const nodeName = Object.keys(node);
      const sensorList = Object.values(node);

      tableMain.insertAdjacentElement(
        "afterbegin",
        TableRowElementCreated(
          getDayAndTime(Number(time)),
          location[index],
          nodeName,
          sensorList
        )
      );
    });
  });
};

const tableMain = document.querySelector(".table-main");
fetch(endPoint + "history")
  .then((response) => response.json())
  .then((data) => {
    renderHistory(data);
  });

socket.on("history", (data) => {
  renderHistory(data);
});
