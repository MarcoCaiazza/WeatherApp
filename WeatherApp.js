const inputSearch = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const loc = document.getElementById("loc");
const degrees = document.getElementById("degrees");
const container = document.querySelector(".container");
const iconApp = document.getElementById("iconApp");
const body = document.querySelector("body");
const windData = document.querySelector("#windData");
const humidityData = document.querySelector("#humidityData");

let url =
  "https://api.openweathermap.org/data/2.5/weather?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=Roma,IT";

const createDate = () => {
  let datecurrent = new Date();
  let date =
    `${datecurrent.getDate()}` +
    "/" +
    `${datecurrent.getMonth() + 1}` +
    "/" +
    `${datecurrent.getFullYear()}` +
    " " +
    `${datecurrent.toLocaleTimeString()}`;
  let dataAndTime = document.createElement("dataAndTime");
  dataAndTime.classList = "dataAndTime";
  dataAndTime.innerHTML = date;
  container.appendChild(dataAndTime);
};
createDate();

const weatherApp = () => {
  const searchLocation = (e) => {
    e.preventDefault();
    url =
      "https://api.openweathermap.org/data/2.5/weather?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=";
    let inputValue = inputSearch.value;
    url = url.concat(inputValue).trim();
    console.log(url);
    getDataFetch();
  };
  getDataFetch();

  let kelvin;
  let fahrenheitValue;
  // funzione asincrona che unisce la ricerca all'Url
  async function getDataFetch() {
    // metodo fetch per ottenere i dati API
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    console.log(weatherData);
    loc.innerHTML = weatherData.name;
    kelvin = weatherData.main.temp;
    let humidity = weatherData.main.humidity;
    let wind = weatherData.wind.speed;
    let currentWeather = weatherData.weather[0].main;
    let descriptionWeather = weatherData.weather[0].description;
    console.log(descriptionWeather);
    changeIconWeahter(currentWeather, descriptionWeather);
    kelvinTocelsius(kelvin);
    updatesWindAndHumidityValues(wind, humidity);

    // kelvinTofahrenheit(kelvin);
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
        iconApp.style.backgroundImage =
          "url('./Images/icons8-partly-cloudy-day-96.png')";
        body.style.backgroundImage = "url('./Images/6408e023093bd.hires.webp')";
      } else if (descriptionWeather === "scattered clouds") {
        iconApp.style.backgroundImage =
          "url('./Images/icons8-partly-cloudy-day-96.png')";
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

  btnSearch.addEventListener("click", (e) => searchLocation(e));
};
document.addEventListener("DOMContentLoaded", weatherApp);
