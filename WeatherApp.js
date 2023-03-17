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
  "https://api.openweathermap.org/data/2.5/weather?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=Roma,It";

let urlHour =
  "https://api.openweathermap.org/data/2.5/forecast?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=Roma,It&_=" +
  Date.now();
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
createDate();

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
      getHourFetch();
    }
  };
  getDataFetch();

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
    changeIconWeahter(currentWeather, descriptionWeather);
    kelvinTocelsius(kelvin);
    updatesWindAndHumidityValues(wind, humidity);
    getHourFetch();
  }

  let wHourArray = [];

  let listArray = [];

  const getHourlyWeather = (weatherHour) => {
    let wHour;

    for (let i = 0; i < 8; i++) {
      listArray.push(weatherHour[i]);
      listArray.sort((a, b) => {
        let dateA = new Date(a.dt * 1000);
        let dateB = new Date(b.dt * 1000);
        let hourA = dateA.getHours();
        let hourB = dateB.getHours();
        return hourA - hourB;
      });
    }
    for (let i = 0; i < listArray.length; i++) {
      let weatherObject = listArray[i];
      for (let property in weatherObject) {
        if (property === "weather") {
          for (let i = 0; i < weatherObject[property].length; i++) {
            wHour = weatherObject[property][i].main;
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
    let itemHourArray = [];

    for (let i = 0; i < wHourThreeArray.length; i++) {
      itemHourArray.push(wHourThreeArray[i]);
    }
    //ORDINA DA 00:00 A 21:00
    itemHourArray.sort((a, b) => {
      let [aHours, aMinutes] = a.split(":");
      let [bHours, bMinutes] = b.split(":");
      if (aHours === 0) {
        aHours = "24";
      } // considera mezzanotte come 24:00
      if (bHours === 0) {
        bHours = "24";
      }
      let aTotalMinutes = aHours * 60 + aMinutes;
      let bTotalMinutes = bHours * 60 + bMinutes;
      return aTotalMinutes - bTotalMinutes;
    });
    //posizione ora/meteo
    let positionWeatherHour = wHourArray.map((value, index) => {
      return { time: itemHourArray[index], wt: value };
    });
    // confronto orario con ora html
    for (let i = 0; i < itemHourArray.length; i++) {
      itemHour = itemHourArray[i];
      //21:00
      if (itemHour === hour[5].textContent) {
        if (positionWeatherHour[7].wt === "Clouds") {
          smallIcon[5].style.backgroundImage =
            "url('./Images/icons8-night-96.png')";
        }
        if (positionWeatherHour[7].wt === "Clear") {
          smallIcon[5].style.backgroundImage =
            "url('./Images/icons8-moon-and-stars-96.png')";
        }
        if (positionWeatherHour[7].wt === "Rain") {
          smallIcon[5].style.backgroundImage =
            "url('./Images/icons8-rainy-night-96.png')";
        }
        if (positionWeatherHour[7].wt === "Snow") {
          smallIcon[5].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
        }
      }
      // 18:00
      if (itemHour === hour[4].textContent) {
        if (positionWeatherHour[6].wt === "Clouds") {
          smallIcon[4].style.backgroundImage =
            "url('./Images/icons8-sunCloudy.png')";
        }
        if (positionWeatherHour[6].wt === "Clear") {
          smallIcon[4].style.backgroundImage =
            "url('./Images/icons8-sun-96.png')";
        }
        if (positionWeatherHour[6].wt === "Rain") {
          smallIcon[4].style.backgroundImage =
            "url('./Images/icons8-rain-96.png')";
        }
        if (positionWeatherHour[6].wt === "Snow") {
          smallIcon[4].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
        }
      }
      // 15:00
      if (itemHour === hour[3].textContent) {
        if (positionWeatherHour[5].wt === "Clouds") {
          smallIcon[3].style.backgroundImage =
            "url('./Images/icons8-sunCloudy.png')";
        }
        if (positionWeatherHour[5].wt === "Clear") {
          smallIcon[3].style.backgroundImage =
            "url('./Images/icons8-sun-96.png')";
        }
        if (positionWeatherHour[5].wt === "Rain") {
          smallIcon[3].style.backgroundImage =
            "url('./Images/icons8-rain-96.png')";
        }
        if (positionWeatherHour[5].wt === "Snow") {
          smallIcon[3].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
        }
      }
      // 12:00
      if (itemHour === hour[2].textContent) {
        if (positionWeatherHour[4].wt === "Clouds") {
          smallIcon[2].style.backgroundImage =
            "url('./Images/icons8-sunCloudy.png')";
        }
        if (positionWeatherHour[4].wt === "Clear") {
          smallIcon[2].style.backgroundImage =
            "url('./Images/icons8-sun-96.png')";
        }
        if (positionWeatherHour[4].wt === "Rain") {
          smallIcon[2].style.backgroundImage =
            "url('./Images/icons8-rain-96.png')";
        }
        if (positionWeatherHour[4].wt === "Snow") {
          smallIcon[2].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
        }
      }
      // 09:00
      if (itemHour === hour[1].textContent) {
        if (positionWeatherHour[3].wt === "Clouds") {
          smallIcon[1].style.backgroundImage =
            "url('./Images/icons8-sunCloudy.png')";
        }
        if (positionWeatherHour[3].wt === "Clear") {
          smallIcon[1].style.backgroundImage =
            "url('./Images/icons8-sun-96.png')";
        }
        if (positionWeatherHour[3].wt === "Rain") {
          smallIcon[1].style.backgroundImage =
            "url('./Images/icons8-rain-96.png')";
        }
        if (positionWeatherHour[3].wt === "Snow") {
          smallIcon[1].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
        }
      }
      // 06:00
      if (itemHour === hour[0].textContent) {
        if (positionWeatherHour[2].wt === "Clouds") {
          smallIcon[0].style.backgroundImage =
            "url('./Images/icons8-sunCloudy.png')";
        }
        if (positionWeatherHour[2].wt === "Clear") {
          smallIcon[0].style.backgroundImage =
            "url('./Images/icons8-sun-96.png')";
        }
        if (positionWeatherHour[2].wt === "Rain") {
          smallIcon[0].style.backgroundImage =
            "url('./Images/icons8-rain-96.png')";
        }
        if (positionWeatherHour[2].wt === "Snow") {
          smallIcon[0].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
        }
      }
      //03:00
      if (itemHour === hour[7].textContent) {
        if (positionWeatherHour[1].wt === "Clouds") {
          smallIcon[7].style.backgroundImage =
            "url('./Images/icons8-night-96.png')";
        }
        if (positionWeatherHour[1].wt === "Clear") {
          smallIcon[7].style.backgroundImage =
            "url('./Images/icons8-moon-and-stars-96.png')";
        }
        if (positionWeatherHour[1].wt === "Rain") {
          smallIcon[7].style.backgroundImage =
            "url('./Images/icons8-rainy-night-96.png')";
        }
        if (positionWeatherHour[1].wt === "Snow") {
          smallIcon[7].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
        }
      }
      //00:00
      if (itemHour === hour[6].textContent) {
        if (positionWeatherHour[0].wt === "Clouds") {
          smallIcon[6].style.backgroundImage =
            "url('./Images/icons8-night-96.png')";
        }
        if (positionWeatherHour[0].wt === "Clear") {
          smallIcon[6].style.backgroundImage =
            "url('./Images/icons8-moon-and-stars-96.png')";
        }
        if (positionWeatherHour[0].wt === "Rain") {
          smallIcon[6].style.backgroundImage =
            "url('./Images/icons8-rainy-night-96.png')";
        }
        if (positionWeatherHour[0].wt === "Snow") {
          smallIcon[6].style.backgroundImage =
            "url('./Images/icons8-snow-96.png')";
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
