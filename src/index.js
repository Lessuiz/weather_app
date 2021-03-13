import './style.css';
const Converter = require('node-temperature-converter');

const apiKey = '3e4dc239c8e9a8d5b29e4967d9c25ade';
let search = 'New York';
let apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}`;

const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const nameDisplay = document.getElementById('name');
const tempDisplay = document.getElementById('temp');
const feelsLikeDisplay = document.getElementById('feels-like');
const weatherDisplay = document.getElementById('weather');
const positionDisplay = document.getElementById('position');


async function getData(url) {
  try {
    const data = await fetch(url, { mode: 'cors' })
    const weatherData = await data.json()
    return Promise.resolve({
      name: weatherData.name,
      coord: weatherData.coord,
      main: weatherData.main,
      sys: weatherData.sys,
      weather: weatherData.weather
    });
  } catch(error) {
      throw new Error(error)
  }
};

function showLoading() {
  tempDisplay.textContent = '';
  nameDisplay.textContent = 'Loading'
  positionDisplay.textContent = ''
  weatherDisplay.textContent = ''
  feelsLikeDisplay.textContent = ''
};

function showWeatherData() {
  apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}`;
  let weatherData = getData(apiURL);
  weatherData.then((data) => {
    const temperature = Math.round(new Converter.Kelvin(data.main.temp)
      .toCelsius());
    const feelsLike = Math.round(new Converter.Kelvin(data.main.feels_like)
      .toCelsius());
    tempDisplay.textContent = `${temperature}°C`;
    nameDisplay.textContent = `${data.name}, ${data.sys.country}`
    positionDisplay.textContent = `Position: ${data.coord.lat}, ${data.coord.lon}`
    weatherDisplay.textContent = `Weather: ${data.weather[0].main}`;
    feelsLikeDisplay.textContent = `Feels like: ${feelsLike}°C`;
  })
    .catch((error) => {
      nameDisplay.textContent = `${search} not found.`;
      throw new Error(error);
    });

  weatherData.then((data) => {
    console.log(data);
  });
};

showWeatherData();

searchButton.addEventListener('click', () => {
  showLoading();
  search = searchBar.value;
  showWeatherData();
});
