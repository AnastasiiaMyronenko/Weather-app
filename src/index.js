function currentDateAndTime() {
  let lastUpdateTime = document.querySelector("#last-update-time");
  let lastUpdateDate = document.querySelector("#last-update-date");
  let now = new Date();
  lastUpdateTime.innerHTML = `Last update: ${currentTime(now)}`;
  lastUpdateDate.innerHTML = currentDate(now);
}
function currentTime(now) {
  let nowHours = now.getHours();
  let nowMinutes = now.getMinutes();
  if (nowHours < 10) {
    nowHours = `0${nowHours}`;
  }
  if (nowMinutes < 10) {
    nowMinutes = `0${nowMinutes}`;
  }
  return `${nowHours}:${nowMinutes}`;
}

function currentDate(now) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `
    ${days[now.getDay()]} 
    ${months[now.getMonth()]} 
    ${now.getDate()}, 
    ${now.getFullYear()}`;
}

function searchResult(event) {
  event.preventDefault();
  let searchField = document.querySelector("#search-field");
  weatherAPI(searchField.value);
}

function weatherAPI(city) {
  let apiKey = "1ee4264117b73d2263eecd562f31ef5c";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(function (response) {
    showCity(response);
    showTemp(response);
    changeCelsiusFahrenheit(response);
    showMinMaxTemp(response);
    showHumidityWind(response);
    showWeatherIcon(response);
    getForecast(response.data.coord)
  });
}

function showCity(response) {
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  //if a search is performed during the selected fahrenheit
  let c = document.querySelector("#c");
  let f = document.querySelector("#f");
  if (c.classList.length === 0) {
    c.classList.add("selected-temp");
    f.classList.remove("selected-temp");
  }
  
}

function showTemp(response) {
  let tempC = document.querySelector("#temp");
  tempC.innerHTML = Math.round(response.data.main.temp);
}

function changeCelsiusFahrenheit(response) {
  let c = document.querySelector("#c");
  let f = document.querySelector("#f");
  let tempF = response.data.main.temp * 1.8 + 32;
  c.addEventListener("click", function () {
      celsius(response.data.main.temp, c, f);
    });
  f.addEventListener("click", function () {
    fahrenheit(tempF, c, f);
  });

}

function celsius(tempC, c, f) {
  let temp = document.querySelector("#temp");
  temp.innerHTML = Math.round(tempC);
  if (c.classList.length === 0) {
    c.classList.add("selected-temp");
    f.classList.remove("selected-temp");
  }
}

function fahrenheit(tempF, c, f) {
  let temp = document.querySelector("#temp");
  temp.innerHTML = Math.round(tempF);
  if (f.classList.length === 0) {
    f.classList.add("selected-temp");
    c.classList.remove("selected-temp");
  }
}

function showMinMaxTemp(response) {
  let maxTemp = document.querySelector("#max-temp");
  let minTemp = document.querySelector("#min-temp");
  if(response.data.main.temp_max > 0) {
    maxTemp.innerHTML = `+${Math.round(response.data.main.temp_max)}`;
  } else {
    maxTemp.innerHTML = Math.round(response.data.main.temp_max);
  }
  if(response.data.main.temp_min > 0) {
    minTemp.innerHTML = `+${Math.round(response.data.main.temp_min)}`;
  } else {
    minTemp.innerHTML = Math.round(response.data.main.temp_min);
  }
}

function showHumidityWind(response) {
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = response.data.wind.speed;
}

function showWeatherIcon(response) {
  let weatherIcon = document.querySelector("#weater-icon");
  weatherIcon.setAttribute("src", `photos/${response.data.weather[0].icon}.png`)
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;
}

function getCurrentLocation(position) {
  let apiKey = "1ee4264117b73d2263eecd562f31ef5c";
  let url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`;
  axios.get(url).then(showCurrentCity);
}

function showCurrentCity(response) {
  let city = document.querySelector("#city");
  city.innerHTML = response.data[0].name;
  weatherAPI(response.data[0].name);
}

function getForecast(coords) {
  let apiKey = "1ee4264117b73d2263eecd562f31ef5c";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayForecast);
}

function displayForecast(response) {
  let forecast = document.querySelector("#forecast");
  let forecastHTML = "";
  for(let i = 0; i < 5; i++){
    forecastHTML = forecastHTML + `
    <div class="all_forecast_card">
      <div class="all_forecast_card_day">
        <span>Wed</span>
        <span>5/10</span>
      </div>
      <div class="all_forecast_card_icon">
        <i class="fa-solid fa-bolt"></i>
      </div>
      <div class="all_forecast_card_temp">17°/19°</div>
    </div>`
  }
  forecast.innerHTML = forecastHTML;
  console.log(response.data);
}

currentDateAndTime();

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchResult);

let defaulCity = document.querySelector("#city");
weatherAPI(defaulCity.innerHTML);

let currentButton = document.querySelector("#current-but");
currentButton.addEventListener("click", function (){
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
});


