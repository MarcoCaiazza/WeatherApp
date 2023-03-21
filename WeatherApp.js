const inputSearch = document.getElementById("search");
const myForm = document.getElementById("myForm");
const loc = document.getElementById("loc");
const degrees = document.getElementById("degrees");
const container = document.querySelector(".container");
const iconApp = document.getElementById("iconApp");
const body = document.querySelector("body");
const windData = document.querySelector("#windData");
const humidityData = document.querySelector("#humidityData");
const smallIcon = document.getElementsByClassName("icon");
const hour = document.querySelectorAll(".hour");
const containerForm = document.getElementById("containerForm");
const degreesDay = document.getElementsByClassName("degrees_day");

let kelvin;
let fahrenheitValue;
let kelvinHour;
let fahrenheitHour;

let url =
  "https://api.openweathermap.org/data/2.5/weather?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=Roma,It";

let urlHour =
  "https://api.openweathermap.org/data/2.5/forecast?APPID=145746dae4f07b5e4c7d879a1b0431dd&q=Roma,It";

let datecurrent = new Date();
console.log(datecurrent);

// Crea data e orario

const createDate = () => {
  let minutes = `${datecurrent.getMinutes()}`.padStart(2, "0");
  let date =
    `${datecurrent.getDate()}` +
    "/" +
    `${datecurrent.getMonth() + 1}` +
    "/" +
    `${datecurrent.getFullYear()}` +
    " " +
    `${datecurrent.getHours()}` +
    ":" +
    `${minutes}`;

  console.log(date);

  let dataAndTime = document.createElement("dataAndTime");
  dataAndTime.classList = "dataAndTime";
  dataAndTime.innerHTML = date;
  container.appendChild(dataAndTime);
};
createDate();

const weatherApp = () => {
  // Funzione asincorna e inserimento dell'API

  const searchLocation = async (e) => {
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
      await getDataFetch();
      inputSearch.value = "";
    }
  };
  // Funzione asincrona che ottiene dati dall'API

  const getDataFetch = async () => {
    const response = await fetch(url, { mode: "cors" });
    if (response.status === 404) {
      return;
    }
    // attesa delle informazioni dall'API
    const weatherData = await response.json();

    console.log(weatherData);

    // Trascrizione dati Api in html
    loc.innerHTML = weatherData.name;
    kelvin = weatherData.main.temp;
    let humidity = weatherData.main.humidity;
    let wind = weatherData.wind.speed;
    let currentWeather = weatherData.weather[0].main;
    let descriptionWeather = weatherData.weather[0].description;
    changeIconWeahter(currentWeather, descriptionWeather);
    kelvinToCelsius(kelvin);
    updatesWindAndHumidityValues(wind, humidity);
    await getHourFetch();
  };

  //Ottieni meteo orario

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

  // Ottini meteo ogni 3 ore

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

  // Cambia le icone del meteo dei vari orari

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

  // funzione che imposta i gradi celsius di tre ore

  const changeDegreesThreeHourCel = () => {
    for (let i = 0; i < degreesDay.length; i++) {
      degreesDay[0].innerHTML = `${tempHourArrCels[0]}°C`;
      degreesDay[1].innerHTML = `${tempHourArrCels[1]}°C`;
      degreesDay[2].innerHTML = `${tempHourArrCels[2]}°C`;
      degreesDay[3].innerHTML = `${tempHourArrCels[3]}°C`;
      degreesDay[4].innerHTML = `${tempHourArrCels[4]}°C`;
      degreesDay[5].innerHTML = `${tempHourArrCels[5]}°C`;
      degreesDay[6].innerHTML = `${tempHourArrCels[6]}°C`;
      degreesDay[7].innerHTML = `${tempHourArrCels[7]}°C`;
    }
  };

  //funzione che imposta i gradi fahrenheit di tre ore

  const changeDegreesThreeHourFarh = () => {
    for (let i = 0; i < degreesDay.length; i++) {
      degreesDay[0].innerHTML = `${tempHourArrFarh[0]}°F`;
      degreesDay[1].innerHTML = `${tempHourArrFarh[1]}°F`;
      degreesDay[2].innerHTML = `${tempHourArrFarh[2]}°F`;
      degreesDay[3].innerHTML = `${tempHourArrFarh[3]}°F`;
      degreesDay[4].innerHTML = `${tempHourArrFarh[4]}°F`;
      degreesDay[5].innerHTML = `${tempHourArrFarh[5]}°F`;
      degreesDay[6].innerHTML = `${tempHourArrFarh[6]}°F`;
      degreesDay[7].innerHTML = `${tempHourArrFarh[7]}°F`;
    }
  };

  let tempHourArrCels = [];
  let tempHourArrFarh = [];
  let celsiusHour;

  const tempHourWeather = () => {
    for (let i = 0; i < listArray.length; i++) {
      for (let property in listArray[i]) {
        if (property === "main") {
          kelvinHour = listArray[i][property].temp;
          kelvinToCelsiusHour(kelvinHour);
          celsiusToFahrenheitHour(kelvinHour);
          tempHourArrCels.push(celsiusHour);
          tempHourArrFarh.push(fahrenheitHour);
          changeDegreesThreeHourCel();
        }
      }
    }
  };

  const kelvinToCelsiusHour = (kelvinHour) => {
    celsiusHour = kelvinHour - 273.15;
    celsiusHour = Math.ceil(celsiusHour);
    changeDegreesThreeHourCel();
  };

  const celsiusToFahrenheitHour = (kelvinHour) => {
    fahrenheitHour = ((kelvinHour - 273.15) * 9) / 5 + 32;
    fahrenheitHour = Math.floor(fahrenheitHour);
    changeDegreesThreeHourFarh();
  };

  const getHourFetch = async () => {
    const response = await fetch(urlHour, { mode: "cors" });
    const weatherHourData = await response.json();
    console.log(weatherHourData);
    wHourArray = [];
    listArray = [];
    tempHourArrCels = [];
    tempHourArrFarh = [];
    let weatherHour = weatherHourData.list;
    getHourlyWeather(weatherHour);
    getTimeEveryThreeHours(weatherHour);
    changeSmallIconWeather();
    tempHourWeather();
  };

  const changeDegrees = () => {
    if (fahrenheitValue === false) {
      celsiusToFahrenheit(kelvin);
      celsiusToFahrenheitHour(kelvinHour);
    } else if (fahrenheitValue === true) {
      kelvinToCelsius(kelvin);
      kelvinToCelsiusHour(kelvinHour);
    }
  };
  degrees.addEventListener("click", changeDegrees);

  const updatesWindAndHumidityValues = (wind, humidity) => {
    windData.innerHTML = `Wind Speed : ${wind} km/h`;
    humidityData.innerHTML = `Humidity : ${humidity} %`;
  };
  //funzione che imposta i gradi da kelvin a celsius del momento

  const kelvinToCelsius = (kelvin) => {
    let celsius = kelvin - 273.15;
    celsius = Math.ceil(celsius);
    degrees.innerHTML = `${celsius}°C`;
    fahrenheitValue = false;
  };
  //funzione che imposta i gradi celsius a fahrenheit del momento

  const celsiusToFahrenheit = (kelvin) => {
    let fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
    fahrenheit = Math.floor(fahrenheit);
    degrees.innerHTML = `${fahrenheit}°F`;
    fahrenheitValue = true;
  };

  //cambia icona del meteo del momento

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
  getDataFetch();
};
document.addEventListener("DOMContentLoaded", weatherApp);
