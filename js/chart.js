import {
  child,
  get,
  ref,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import { database } from "./firebase.js";

// const endPoint = "http://localhost:3000/";
const endPoint = "https://iot-system-h3-server.herokuapp.com/";

const chartContainer = document.querySelector(".chart-container");
const optionMenus = document.querySelectorAll(".select-menu"),
  selectBtns = document.querySelectorAll(".select-btn"),
  sBtn_texts = document.querySelectorAll(".sBtn-text"),
  optionsSelects = document.querySelectorAll(".options");

selectBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    optionMenus[index].classList.toggle("active");
  });
});

const LIST_COLOR = [
  {
    co: "rgb(54, 162, 235)",
  },
  {
    humi: "rgb(255, 206, 86)",
  },
  {
    noise: "rgb(75, 192, 192)",
  },
  {
    shine: "rgb(153, 102, 255)",
  },
  {
    temp: "rgb(255, 159, 64)",
  },
  {
    uv: "rgb(255, 99, 132)",
  },
];

let chartSelect = {
  location: "",
  node: "",
  sensor: "",
};

const getColorSensor = (nameSensor) => {
  const color = LIST_COLOR.find((color) => {
    return color[nameSensor];
  })[nameSensor];
  return color;
};

const convertDateToTimestamp = (date, hms) => {
  const dateTime = date.split("-");
  const time = hms.split(":");

  const dateObj = new Date(
    +dateTime[0],
    +dateTime[1] - 1,
    +dateTime[2],
    +time[0],
    +time[1]
  );

  return dateObj.getTime();
};

const getRangeValueWithTime = (timeList, valueList, firstTime, lastTime) => {
  const timeRange = timeList.filter((time) => {
    if (firstTime === lastTime) {
      return time >= firstTime;
    } else {
      return time >= firstTime && time <= lastTime;
    }
  });

  return {
    timeRange: timeRange,
    valueRange: timeRange.map((time) => {
      return valueList[timeList.indexOf(time)];
    }),
  };
};

const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  const dateString = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return dateString;
};

const chartElementCreated = (
  event,
  nameLocation,
  nameNode,
  timeList,
  nameSensors,
  valueSensors
) => {
  const labels = timeList.map((time) => {
    return convertTimestampToDate(Number(time));
  });

  let datasetList = [];
  nameSensors.forEach((nameSensor, index) => {
    const values = valueSensors.map((value, i) => {
      return value[index];
    });

    if (event === "all") {
      const dataset = {
        label: nameSensor,
        backgroundColor: getColorSensor(nameSensor),
        borderColor: getColorSensor(nameSensor),
        data: values,
        tension: 0.1,
      };
      datasetList.push(dataset);
    } else {
      const dataset = {
        label: nameSensor,
        backgroundColor: getColorSensor(nameSensor),
        borderColor: getColorSensor(nameSensor),
        data: valueSensors,
        tension: 0.1,
      };
      datasetList.push(dataset);
    }
  });

  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: datasetList,
    },
    options: {
      responsive: true,
    },
  };

  const chartDiv = document.createElement("div");
  chartDiv.classList.add("chart");
  chartDiv.setAttribute("name", nameLocation);

  const chartTitleDiv = document.createElement("div");
  chartTitleDiv.classList.add("chart-title");
  chartTitleDiv.innerHTML = `<h2>${nameLocation}</h2><p>${nameNode}</p>`;

  const chartContainerDiv = document.createElement("div");
  chartContainerDiv.classList.add("chart-container");

  const canvas = document.createElement("canvas");
  canvas.id = "myChart";
  chartContainerDiv.appendChild(canvas);

  chartDiv.appendChild(chartTitleDiv);
  chartDiv.appendChild(chartContainerDiv);

  const myChart = new Chart(canvas, config);

  return chartDiv;
};

const optionElementCreated = (data) => {
  const liOption = document.createElement("li");
  liOption.classList.add("option");
  liOption.id = data;

  const spanOptionText = document.createElement("span");
  spanOptionText.classList.add("option-text");
  spanOptionText.textContent = data;

  liOption.appendChild(spanOptionText);

  return liOption;
};

await fetch(endPoint + "location")
  .then((response) => response.json())
  .then((data) => {
    const nameLocationList = Object.keys(data);
    const nodeList = Object.values(data);

    nameLocationList.forEach((nameLocation, index) => {
      const nameNodeList = Object.keys(nodeList[index]);
      const valueNodeList = Object.values(nodeList[index]);

      nameNodeList.forEach((nameNode, index) => {
        const timeList = Object.keys(valueNodeList[index]);
        const sensorList = Object.values(valueNodeList[index]);

        let nameSensors = [];
        let valueSensorList = [];
        timeList.forEach((time, index) => {
          nameSensors = Object.keys(sensorList[index]);
          const valueSensor = Object.values(sensorList[index]);
          valueSensorList.push(valueSensor);
        });

        chartContainer.appendChild(
          chartElementCreated(
            "all",
            nameLocation,
            nameNode,
            timeList,
            nameSensors,
            valueSensorList
          )
        );
      });
    });
  });

get(child(ref(database), "location")).then((snapshot) => {
  const data = snapshot.val();
  const nameLocationList = Object.keys(data);
  const nodeList = Object.values(data);

  optionsSelects.forEach(() => {
    optionsSelects[0].innerHTML = "";

    // optionsSelects[0].appendChild(optionElementCreated("All"));
    nameLocationList.forEach((nameLocation) => {
      optionsSelects[0].appendChild(optionElementCreated(nameLocation));
    });

    optionMenus[0].querySelectorAll(".option").forEach((option, index) => {
      option.addEventListener("click", () => {
        const selectedOption = option.querySelector(".option-text").innerText;
        sBtn_texts[0].innerText = selectedOption;
        chartSelect.location = selectedOption;
        optionMenus[0].classList.remove("active");

        const nameNodeList = Object.keys(nodeList[index]);
        const valueNodeList = Object.values(nodeList[index]);

        optionsSelects[1].innerHTML = "";
        nameNodeList.forEach((nameNode) => {
          optionsSelects[1].appendChild(optionElementCreated(nameNode));
        });

        optionMenus[1].querySelectorAll(".option").forEach((op, j) => {
          op.addEventListener("click", () => {
            const selectedOption = op.querySelector(".option-text").innerText;
            sBtn_texts[1].innerText = selectedOption;
            chartSelect.node = selectedOption;
            optionMenus[1].classList.remove("active");

            const sensorNameList = Object.keys(valueNodeList[j].sensors);
            optionsSelects[2].innerHTML = "";
            sensorNameList.forEach((sensorName) => {
              optionsSelects[2].appendChild(optionElementCreated(sensorName));
            });

            optionMenus[2].querySelectorAll(".option").forEach((o) => {
              o.addEventListener("click", () => {
                const selectedOption =
                  o.querySelector(".option-text").innerText;
                sBtn_texts[2].innerText = selectedOption;
                chartSelect.sensor = selectedOption;
                optionMenus[2].classList.remove("active");

                fetch(endPoint + "location")
                  .then((response) => response.json())
                  .then((data) => {
                    const valueLocation = data[chartSelect.location];
                    const valueNodeList = valueLocation[chartSelect.node];

                    const timeList = Object.keys(valueNodeList);
                    const sensorList = Object.values(valueNodeList);

                    let valueSensorList = [];

                    sensorList.forEach((sensor) => {
                      valueSensorList.push(sensor[chartSelect.sensor]);
                    });

                    chartContainer.innerHTML = "";
                    chartContainer.appendChild(
                      chartElementCreated(
                        "sensor",
                        chartSelect.location,
                        [chartSelect.node],
                        timeList,
                        [chartSelect.sensor],
                        valueSensorList
                      )
                    );

                    document
                      .querySelector(".inp-wrapper")
                      .addEventListener("change", (e) => {
                        let date1 = convertDateToTimestamp(
                          document.getElementById("date-1-date").value,
                          document.getElementById("date-1-time").value
                        );

                        let date2 = convertDateToTimestamp(
                          document.getElementById("date-2-date").value,
                          document.getElementById("date-2-time").value
                        );

                        const dataRange = getRangeValueWithTime(
                          timeList,
                          valueSensorList,
                          date1,
                          date2
                        );

                        chartContainer.innerHTML = "";
                        chartContainer.appendChild(
                          chartElementCreated(
                            "sensor",
                            chartSelect.location,
                            [chartSelect.node],
                            dataRange.timeRange,
                            [chartSelect.sensor],
                            dataRange.valueRange
                          )
                        );
                      });
                  });
              });
            });
          });
        });
      });
    });
  });
});
