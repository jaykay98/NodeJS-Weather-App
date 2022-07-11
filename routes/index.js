const express = require('express');
const router = express.Router();
const axios = require('axios');

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
      const { feels_like } = results.data.main;
      const image = `http://openweathermap.org/img/wn/${icon}.png`;
      const temperature = `${Math.floor(results.data.main.temp)}${'\u2103'}`;
      const markerDescription = `The weather in ${name} is ${description}. It feels like ${feels_like} degrees celsius`;
      res.render('index', {
        lat,
        lon,
        image,
        MAPBOX_ACCESS_TOKEN,
        markerDescription,
        temperature,
        cityName: name,
        weatherConditions: main,
      });
    });
  } catch (error) {
    DEFAULT_LOCATION.markerDescription = 'City not found! Please try again.';
    return res.render('index', {
      lat: DEFAULT_LOCATION.lat,
      lon: DEFAULT_LOCATION.lon,
      MAPBOX_ACCESS_TOKEN,
      markerDescription: DEFAULT_LOCATION.markerDescription,
    });
  }
});

module.exports = router;
