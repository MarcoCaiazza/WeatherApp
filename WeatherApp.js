const inputSearch = document.getElementById("search");
const myForm = document.getElementById("myForm");
// const btnSearch = document.getElementById("btnSearch");
const loc = document.getElementById("loc");
const degrees = document.getElementById("degrees");
const container = document.querySelector(".container");
const iconApp = document.getElementById("iconApp");
const body = document.querySelector("body");
const windData = document.querySelector("#windData");
const humidityData = document.querySelector("#humidityData");
const smallIcon = document.getElementsByClassName("icon");
const hour = document.querySelectorAll(".hour");

let kelvin;
let fahrenheitValue;
let url =
  "https://api.openweathermap.org/data/2.5/weather?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=Londra";

let urlHour =
  "https://api.openweathermap.org/data/2.5/forecast?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=Londra";
let datecurrent = new Date();
const createDate = () => {
  let date =
    `${datecurrent.getDate()}` +
    "/" +
    `${datecurrent.getMonth() + 1}` +
    "/" +
    `${datecurrent.getFullYear()}` +
    " " +
    `${datecurrent.getHours()}` +
    ":" +
    `${datecurrent.getMinutes()}`;

  let dataAndTime = document.createElement("dataAndTime");
  dataAndTime.classList = "dataAndTime";
  dataAndTime.innerHTML = date;
  container.appendChild(dataAndTime);
};
// createDate();

const weatherApp = () => {
  const searchLocation = (e) => {
    if (inputSearch.value.trim() === "") {
      e.preventDefault();
      inputSearch.setAttribute("required", true);
    } else {
      e.preventDefault();
      url =
        "https://api.openweathermap.org/data/2.5/weather?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=";
      let inputValue = inputSearch.value;
      url = url.concat(inputValue).trim();
      urlHour =
        "https://api.openweathermap.org/data/2.5/forecast?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=";
      urlHour = urlHour.concat(inputValue).trim();
      getDataFetch();
    }
  };
  // getDataFetch();

  // funzione asincrona che unisce la ricerca all'Url
  // async function getDataFetch() {
  //   // metodo fetch per ottenere i dati API
  //   const response = await fetch(url, { mode: "cors" });
  //   const weatherData = await response.json();
  //   console.log(weatherData);
  //   loc.innerHTML = weatherData.name;
  //   kelvin = weatherData.main.temp;
  //   let humidity = weatherData.main.humidity;
  //   let wind = weatherData.wind.speed;
  //   let currentWeather = weatherData.weather[0].main;
  //   let descriptionWeather = weatherData.weather[0].description;
  //   changeIconWeahter(currentWeather, descriptionWeather);
  //   kelvinTocelsius(kelvin);
  //   updatesWindAndHumidityValues(wind, humidity);
  // }
  getHourFetch();

  let wHourArray = [];

  const getHourlyWeather = (weatherHour) => {
    let wHour;
    for (let i = 0; i < 8; i++) {
      let weatherObject = weatherHour[i];
      for (let property in weatherObject) {
        if (property === "weather") {
          for (let i = 0; i < weatherObject[property].length; i++) {
            wHour = weatherObject[property][i].main;
            // console.log(wHour);
            wHourArray.push(wHour);
          }
        }
      }
    }
  };

  let wHourThreeArray = [];
  const getTimeEveryThreeHours = (weatherHour) => {
    for (let i = 0; i < 8; i++) {
      let weatherObject = weatherHour[i];
      for (let property in weatherObject) {
        if (property === "dt_txt") {
          let wHourThree = weatherObject[property];
          wHourThree = wHourThree.slice(11).slice(0, 5);
          wHourThreeArray.push(wHourThree);
        }
      }
    }
  };

  const changeSmallIconWeather = () => {
    let itemHour;
    for (let i = 0; i < wHourThreeArray.length; i++) {
      itemHour = wHourThreeArray[i];
      if (itemHour === hour[0].textContent) {
        console.log(itemHour);
        // console.log(wHourArray);
        for (let i = 0; i < wHourArray.length; i++) {
          if (wHourArray[3] === "Clouds") {
            //sistemare orario per icona
            if (itemHour <= 21 && itemHour >= 6) {
              for (let j = 0; j < smallIcon.length; j++) {
                smallIcon[0].style.backgroundImage =
                  "url('./Images/icons8-sunCloudy.png')";
              }
            } else {
              for (let j = 0; j < smallIcon.length; j++) {
                smallIcon[0].style.backgroundImage =
                  "url('./Images/icons8-night-96.png')";
              }
            }
          }
          if (wHourArray[3] === "Clear") {
            if (itemHour <= 21 && itemHour >= 6) {
              for (let j = 0; j < smallIcon.length; j++) {
                smallIcon[0].style.backgroundImage =
                  "url('./Images/icons8-sun-96.png')";
              }
            } else {
              for (let j = 0; j < smallIcon.length; j++) {
                smallIcon[0].style.backgroundImage =
                  "url('./Images/icons8-moon-and-stars-96.png')";
              }
            }
          }
          // if (wHourArray[3] === "Rain") {
          //   if (itemHour >= 21) {
          //     for (let j = 0; j < smallIcon.length; j++) {
          //       smallIcon[0].style.backgroundImage =
          //         "url('./Images/icons8-rain-96.png')";
          //     }
          //   } else {
          //     for (let j = 0; j < smallIcon.length; j++) {
          //       smallIcon[0].style.backgroundImage =
          //         "url('./Images/icons8-rain-night-96.png')";
          //     }
          //   }
          // }
          // if (wHourArray[3] === "Snow") {
          //   for (let j = 0; j < smallIcon.length; j++) {
          //     smallIcon[0].style.backgroundImage =
          //       "url('./Images/icons8-snow-96.png')";
          //   }
          // }
        }
      }
    }
  };
  async function getHourFetch() {
    const responseHour = await fetch(urlHour, { mode: "cors" });
    const weatherHourData = await responseHour.json();
    console.log(weatherHourData);
    let weatherHour = weatherHourData.list;
    getHourlyWeather(weatherHour);
    getTimeEveryThreeHours(weatherHour);
    changeSmallIconWeather();
  }

  const changeDegrees = () => {
    if (fahrenheitValue === false) {
      celsiusTofahrenheit(kelvin);
    } else kelvinTocelsius(kelvin);
  };
  degrees.addEventListener("click", changeDegrees);

  const updatesWindAndHumidityValues = (wind, humidity) => {
    windData.innerHTML = `Wind Speed : ${wind} km/h`;
    humidityData.innerHTML = `Humidity : ${humidity} %`;
  };

  const kelvinTocelsius = (kelvin) => {
    let celsius = kelvin - 273.15;
    celsius = Math.ceil(celsius);
    degrees.innerHTML = `${celsius}°C`;
    fahrenheitValue = false;
  };
  const celsiusTofahrenheit = (kelvin) => {
    let fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
    fahrenheit = Math.floor(fahrenheit);
    degrees.innerHTML = `${fahrenheit}°F`;
    fahrenheitValue = true;
    console.log(fahrenheit);
  };

  const changeIconWeahter = (currentWeather, descriptionWeather) => {
    if (currentWeather === "Clouds") {
      if (descriptionWeather === "few clouds") {
        iconApp.style.backgroundImage = "url('./Images/icons8-sunCloudy.png')";
        body.style.backgroundImage = "url('./Images/6408e023093bd.hires.webp')";
      } else if (descriptionWeather === "scattered clouds") {
        iconApp.style.backgroundImage = "url('./Images/icons8-sunCloudy.png')";
        body.style.backgroundImage = "url('./Images/clouds.jpeg')";
      } else {
        body.style.background =
          "url('./Images/1410436706000-Mostly-cloudy.webp')";
        iconApp.style.backgroundImage = "url('./Images/icons8-clouds-96.png')";
      }
    }
    if (currentWeather === "Clear") {
      iconApp.style.backgroundImage = "url('./Images/icons8-sun-96.png')";
      body.style.background = "url('./Images/background-sun.jpg')";
    } else if (currentWeather === "Rain") {
      if (descriptionWeather === "shower rain") {
        iconApp.style.backgroundImage = "url('./Images/icons8-rain-96.png')";
        body.style.background =
          "url('./Images/rain-drops-on-window-1827098_1920.jpg.webp')";
      } else {
        iconApp.style.backgroundImage = "url('./Images/icons8-rain-96.png')";
        body.style.background = "url('./Images/GettyImages-503284599.webp')";
      }
    } else if (currentWeather === "Snow") {
      iconApp.style.backgroundImage = "url('./Images/icons8-snow-96.png')";
      body.style.background = "url('./Images/background-snow.jpg')";
    }
  };

  myForm.addEventListener("submit", (e) => searchLocation(e));
};
document.addEventListener("DOMContentLoaded", weatherApp);
