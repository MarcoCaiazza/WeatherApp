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

  // funzione asincrona che unisce la ricerca all'Url
  async function getDataFetch() {
    // metodo fetch per ottenere i dati API
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    console.log(weatherData);
    loc.innerHTML = weatherData.name;
    let kelvin = weatherData.main.temp;
    let humidity = weatherData.main.humidity;
    let wind = weatherData.wind.speed;
    let currentWeather = weatherData.weather[0].main;
    changeIconWeahter(currentWeather);
    kelvinTocelsius(kelvin);
    updatesWindAndHumidityValues(wind, humidity);
    // kelvinTofahrenheit(kelvin);
  }
  const updatesWindAndHumidityValues = (wind, humidity) => {
    windData.innerHTML = `Wind Speed : ${wind} km/h`;
    humidityData.innerHTML = `Humidity : ${humidity} %`;
  };

  const kelvinTocelsius = (kelvin) => {
    let celsius = kelvin - 273.15;
    celsius = Math.ceil(celsius);
    degrees.innerHTML = `${celsius}°C`;
  };
  const kelvinTofahrenheit = (kelvin) => {
    let fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
    fahrenheit = Math.floor(fahrenheit);
    degrees.innerHTML = fahrenheit;
    console.log(fahrenheit);
  };

  const changeIconWeahter = (currentWeather) => {
    if (currentWeather === "Clouds") {
      iconApp.style.backgroundImage = "url('./Images/icons8-clouds-96.png')";
      body.style.background =
        "url('./Images/1410436706000-Mostly-cloudy.webp')";
    } else if (currentWeather === "Clear") {
      iconApp.style.backgroundImage = "url('./Images/icons8-sun-96.png')";
      body.style.background = "url('./Images/background-sun.jpg')";
    } else if (currentWeather === "Rain") {
      iconApp.style.backgroundImage = "url('./Images/icons8-rain-96.png')";
      body.style.background = "url('./Images/background-rain.jpg')";
    } else if (currentWeather === "Snow") {
      iconApp.style.backgroundImage = "url('./Images/icons8-snow-96.png')";
      body.style.background = "url('./Images/background-snow.jpg')";
    }
  };

  const changeFahrenheit = () => {
    console.log("ciao");
  };
  degrees.addEventListener("click", changeFahrenheit);

  btnSearch.addEventListener("click", (e) => searchLocation(e));
};
document.addEventListener("DOMContentLoaded", weatherApp);
