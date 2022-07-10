const express = require('express');
const router = express.Router();
const axios = require('axios');

const weeklyWeather = [];

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/', async (req, res) => {
  try {
    let image,
      name,
      icon,
      temperature,
      airDescription,
      summary,
      latitude,
      longitude,
      data,
      weatherText,
      airData;

    const { city } = req.body;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;

    // Get data from the OpenWeatherMap API using the city as the query parameter
    await axios.get(weatherUrl).then((result) => {
      /* Get the latitude and longitude from the OpenWeatherMap API */
      latitude = result.data.coord.lat;
      longitude = result.data.coord.lon;
      name = result.data.name;
      icon = result.data.weather[0].icon;
      image = `http://openweathermap.org/img/wn/${icon}.png`;
      temperature = Math.floor(result.data.main.temp);
    });
    /* Render the HTML on the page including the text for the marker used for
      the leaflet map. */
    weatherText = `The weather in ${name} is ${description} Current temperature is ${temperature} degrees ${airDescription}`;
    res.render('index', {
      weather: weatherText,
      cityName: name,
      image: image,
      weatherTemperature: temperature,
      weatherDescription: summary,
      airReading: airData,
      weekly: weeklyWeather,
      lat: latitude,
      lon: longitude,
    });
  } catch (error) {
    console.error(error);
    /* Render the error HTML if the city entered by the user
       doesn't contain any data for any of the APIs */
    return res.render('index', {
      weather: 'Oh no, Something went wrong! Please try again',
      image: defaultLocation.image,
      cityName: 'An Error Occured',
      weatherTemperature: ':',
      weatherDescription: 'Please Try Again',
      weekly: defaultLocation.week,
      lat: defaultLocation.latitude,
      lon: defaultLocation.longitude,
    });
  }
});

module.exports = router;
