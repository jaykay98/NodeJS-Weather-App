const express = require('express');
const router = express.Router();
const axios = require('axios');
const { displayWeatherIcon } = require('../utility/displayIcons');

const { MAPBOX_ACCESS_TOKEN } = process.env;

const DEFAULT_LOCATION = {
  lat: -27.4679,
  lon: 153.0281,
  markerDescription: 'Please enter a city to get started...',
};

router.get('/', function (req, res, next) {
  res.render('index', {
    lat: DEFAULT_LOCATION.lat,
    lon: DEFAULT_LOCATION.lon,
    MAPBOX_ACCESS_TOKEN,
    image: DEFAULT_LOCATION.image,
    markerDescription: DEFAULT_LOCATION.markerDescription,
  });
});

router.post('/', async (req, res) => {
  try {
    const { city } = req.body;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;

    await axios.get(weatherUrl).then((results) => {
      const { name } = results.data;
      const { lat, lon } = results.data.coord;
      const { icon, description, main } = results.data.weather[0];
      const { feels_like, temp_min, temp_max, humidity } = results.data.main;
      const { sunrise, sunset } = results.data.sys;

      const minTemp = `${temp_min}${'\u2103'}`;
      const maxTemp = `${temp_max}${'\u2103'}`;

      const sunriseMilliseconds = sunrise * 1000;
      const sunsetMilliseconds = sunset * 1000;

      const sunsetTime = new Date(sunsetMilliseconds).toLocaleTimeString();
      const sunriseTime = new Date(sunriseMilliseconds).toLocaleTimeString();

      const temperature = `${Math.round(results.data.main.temp)}${'\u2103'}`;
      const markerDescription = `The weather in ${name} is ${description}. It feels like ${feels_like} degrees celsius`;
      res.render('index', {
        lat,
        lon,
        image: displayWeatherIcon(icon),
        MAPBOX_ACCESS_TOKEN,
        markerDescription,
        temperature,
        minTemp,
        maxTemp,
        humidity,
        sunriseTime,
        sunsetTime,
        cityName: name,
        weatherConditions: main,
      });
    });
  } catch (error) {
    DEFAULT_LOCATION.markerDescription =
      'City not found! Please try another city.';
    return res.render('index', {
      lat: DEFAULT_LOCATION.lat,
      lon: DEFAULT_LOCATION.lon,
      MAPBOX_ACCESS_TOKEN,
      markerDescription: DEFAULT_LOCATION.markerDescription,
    });
  }
});

module.exports = router;
