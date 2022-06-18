import { app, database } from "./firebase.js";
import { colorPicker } from "./color-picker.js";
import {
  set,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

const loader = document.querySelector(".loader-container");
const parent = document.querySelector("#rangeSlider");
const rangeS = parent.querySelectorAll("input[type=range]"),
  numberS = parent.querySelectorAll("input[type=number]");

loader.style.display = "none";

rangeS.forEach(function (el) {
  el.oninput = function () {
    const slide1 = parseFloat(rangeS[0].value),
      slide2 = parseFloat(rangeS[1].value);

    if (slide1 > slide2) {
      [slide1, slide2] = [slide2, slide1];
    }

    numberS[0].value = slide1;
    numberS[1].value = slide2;
  };
});

numberS.forEach(function (el) {
  el.oninput = function () {
    const number1 = parseFloat(numberS[0].value),
      number2 = parseFloat(numberS[1].value);

    if (number1 > number2) {
      const tmp = number1;
      numberS[0].value = number2;
      numberS[1].value = tmp;
    }

    rangeS[0].value = number1;
    rangeS[1].value = number2;
  };
});

colorPicker.init();

setTimeout(() => {
  document.querySelectorAll(".varied-colors > div").forEach((element) => {
    element.addEventListener("click", () => {
      setTimeout(() => {
        const color =
          document.querySelector(".color-circle").style.backgroundColor;
        document.querySelector(".color-code").textContent = color;
      }, 200);
    });
  });
}, 300);

let minColor = "",
  maxColor = "";
let nameSensor = "";

const colorSelect = document.querySelector(".color-selector select");
colorSelect.addEventListener("change", () => {
  document.querySelectorAll(".base-colors > div").forEach((el) => {
    el.addEventListener("click", () => {
      setTimeout(() => {
        document.querySelectorAll(".varied-colors > div").forEach((element) => {
          element.addEventListener("click", () => {
            setTimeout(() => {
              const color =
                document.querySelector(".color-circle").style.backgroundColor;
              document.querySelector(".color-code").textContent = color;

              if (colorSelect.value === "min") {
                minColor = color;
              } else if (colorSelect.value === "max") {
                maxColor = color;
              }
            }, 200);
          });
        });
      }, 300);
    });
  });
});

onValue(ref(database, "sensor"), (snapshot) => {
  const data = snapshot.val();
  const names = Object.keys(data);
  const values = Object.values(data);

  const optionSelects = document.querySelector(".sensor-selector select");
  names.forEach((name, index) => {
    document.querySelector(".sensor-selector select").innerHTML += `
    <option value="${name}">${name.toUpperCase()}</option>
    `;
  });

  optionSelects.addEventListener("change", () => {
    names.forEach((name, index) => {
      if (name === optionSelects.value) {
        nameSensor = optionSelects.value;

        numberS[0].value = values[index].threshold.min;
        numberS[1].value = values[index].threshold.max;

        rangeS[0].value = values[index].threshold.min;
        rangeS[1].value = values[index].threshold.max;
      }
    });
    console.log(optionSelects.value);
  });
});

document.querySelector(".btn-save").addEventListener("click", () => {
  set(ref(database, `sensor/${nameSensor}/threshold`), {
    min: numberS[0].value,
    max: numberS[1].value,
  });
  set(ref(database, `sensor/${nameSensor}/color`), {
    min: minColor,
    max: maxColor,
  });

  loader.style.display = "flex";
  setTimeout(() => {
    window.location.reload();
  }, 3000);
});
