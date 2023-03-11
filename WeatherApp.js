let inputSearch = document.getElementById("search");
let btnSearch = document.getElementById("btnSearch");
let loc = document.getElementById("loc");
let degrees = document.getElementById("degrees");
let container = document.querySelector(".container");

let url =
  "https://api.openweathermap.org/data/2.5/weather?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=";

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
    let inputValue = inputSearch.value;
    url = url.concat(inputValue).trim();
    console.log(url);
    getDataFetch();
  };

  // funzione asincrona che unisce la ricerca all'Url
  async function getDataFetch() {
    // metodo fetch per ottenere i dati API
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    console.log(weatherData);
    loc.innerHTML = weatherData.name;
    let kelvin = weatherData.main.temp;
    let humidity = weatherData.main.humidity;
    console.log(humidity);
    kelvinTocelsius(kelvin, humidity);
    // kelvinTofahrenheit(kelvin);
  }

  const kelvinTocelsius = (kelvin, humidity) => {
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

  btnSearch.addEventListener("click", (e) => searchLocation(e));
};
document.addEventListener("DOMContentLoaded", weatherApp);
