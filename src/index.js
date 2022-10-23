function nowTime(now) {
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

function nowDate(now, days, months) {
  return `
    ${days[now.getDay()]} 
    ${months[now.getMonth()]} 
    ${now.getDate()}, 
    ${now.getFullYear()}`;
}

function searching(event) {
  event.preventDefault();
  let searchField = document.querySelector("#search-field");
  let city = document.querySelector("#city");
  city.innerHTML = searchField.value;
  weatherAPI();
}

function celsius(tempC, c, f) {
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(tempC);
  if (c.classList.length === 0) {
    c.classList.add("selected-temp");
    f.classList.remove("selected-temp");
  }
}

function fahrenheit(tempF, c, f) {
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(tempF);
  if (f.classList.length === 0) {
    f.classList.add("selected-temp");
    c.classList.remove("selected-temp");
  }
}

function weatherAPI() {
  let apiKey = "1ee4264117b73d2263eecd562f31ef5c";
  let city = document.querySelector("#city").innerHTML;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(callAllFunctionsForSimultaneousLoading);
  // axios.get(url).then(showCurrentTemp);
  // axios.get(url).then(changeCelsiusFahrenheit);
  // axios.get(url).then(showCurrentMinMax);
  // axios.get(url).then(showCurrentHumidityWind);
}

function callAllFunctionsForSimultaneousLoading(response){
  showCurrentTemp(response);
  changeCelsiusFahrenheit(response);
  showCurrentMinMax(response);
  showCurrentHumidityWind(response);
  
}

function showCurrentTemp(response) {
  console.log(response.data);
  let tempC = document.querySelector("#current-temp");
  let tempApiC = response.data.main.temp;
  tempC.innerHTML = Math.round(tempApiC);
}

function changeCelsiusFahrenheit(response) {
  let tempAPI = response.data.main.temp;
  let c = document.querySelector("#c");
  let f = document.querySelector("#f");
  let tempF = tempAPI * 1.8 + 32;
  c.addEventListener("click", function () {
      celsius(tempAPI, c, f);
    });
    f.addEventListener("click", function () {
      fahrenheit(tempF, c, f);
    });

}

function showCurrentMinMax(response) {
  let currentMaxTemp = document.querySelector("#current-max-temp");
  let currentMinTemp = document.querySelector("#current-min-temp");
  let currentMaxTempAPI = response.data.main.temp_max;
  let currentMinTempAPI = response.data.main.temp_min;
  if(currentMaxTempAPI > 0) {
    currentMaxTemp.innerHTML = `+${Math.round(currentMaxTempAPI)}`;
  } else {
    currentMaxTemp.innerHTML = Math.round(currentMaxTempAPI);
  }
  if(currentMinTempAPI > 0) {
    currentMinTemp.innerHTML = `+${Math.round(currentMinTempAPI)}`;
  } else {
    currentMinTemp.innerHTML = Math.round(currentMinTempAPI);
  }
}

function showCurrentHumidityWind(response) {
  let currentHumidity = document.querySelector("#current-humidity");
  let currentWind = document.querySelector("#current-wind");
  let currentHumidityAPI = response.data.main.humidity;
  let currentWindAPI = response.data.wind.speed;
  currentHumidity.innerHTML = currentHumidityAPI;
  currentWind.innerHTML = currentWindAPI;
}

function getCurrentLocation(position) {
  let apiKey = "1ee4264117b73d2263eecd562f31ef5c";
  let url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`;
  axios.get(url).then(showCurrentCity);
}

function showCurrentCity(response) {
  console.log(response.data[0].name);
  let city = document.querySelector("#city");
  city.innerHTML = response.data[0].name;
  weatherAPI();
}
//current date and time
let lastUpdateTime = document.querySelector("#last-update-time");
let lastUpdateDate = document.querySelector("#last-update-date");
let now = new Date();
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
lastUpdateTime.innerHTML = `Last update: ${nowTime(now)}`;
lastUpdateDate.innerHTML = nowDate(now, days, months);
//search engine
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searching);
//weather API and Celsius and Fahrenheit
weatherAPI();
//current location
let currentButton = document.querySelector("#current-but");
currentButton.addEventListener("click", function (){
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
});


