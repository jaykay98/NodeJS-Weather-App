var express = require("express");
var router = express.Router();
const axios = require("axios");

let defaultLocation = {
  latitude: -27.47,
  longitude: 153.02,
  image: 'http://openweathermap.org/img/wn/01d.png',
  text: "Please enter a city to get started.",
  week: [{
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
    {
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
    {
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
    {
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
    {
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
    {
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
    {
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
    {
      summary: "Waiting...",
      temperatureMin: "Waiting...",
      temperatureMax: "Waiting..."
    },
  ]
};

let weeklyWeather = [];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    weather: defaultLocation.text,
    image: defaultLocation.image,
    cityName: "Let's Begin",
    weatherTemperature: "Enter A City",
    weatherDescription: "To Find The Weather",
    weekly: defaultLocation.week,
    lat: defaultLocation.latitude,
    lon: defaultLocation.longitude
  });
});

router.post("/", async (req, res) => {
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
      airData

    let city = req.body.city;

    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

    // Get data from the OpenWeatherMap API using the city as the query parameter
    await axios
      .get(weatherUrl)
      .then(result => {
        /* Get the latitude and longitude from the OpenWeatherMap API and store it
          in the latitude and longitude variables */
        latitude = result.data.coord.lat;
        longitude = result.data.coord.lon;
        name = result.data.name;
        icon = result.data.weather[0].icon;
        image = `http://openweathermap.org/img/wn/${icon}.png`;
        temperature = Math.floor(result.data.main.temp);

        /* Use the latitude and longitude from before to get
           the Air Quality Reading from the OpenAQ API */
        let openAirUrl = `https://api.openaq.org/v1/latest?coordinates=${latitude},${longitude}`;
        axios.get(openAirUrl).then(response => {
          if (response.data.results.length === 0) {
            airData = "No Air Quality Available";
            airDescription = "with no air quality reading available";
          } else {
            data = response.data.results[0].measurements[0];
            airData = `${data.value}${data.unit}`;
            airDescription = `with an air quality reading of ${data.value}${data.unit}`;
          }
        })

        /* Get more weather data from the Dark Sky API
           using the latitude and longitude from the OpenWeatherMap API
           as the query parameters */
        let darkSkyUrl = `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${latitude},${longitude}?units=ca`;
        return axios.get(darkSkyUrl)
          .then(result => {
            weeklyWeather = [];
            description = result.data.daily.summary;
            summary = result.data.hourly.summary;
            result.data.daily.data.forEach(item => {
              item.temperatureMin = "MIN: " + Math.floor(item.temperatureMin);
              item.temperatureMax = "MAX: " + Math.floor(item.temperatureMax);
              weeklyWeather.push(item);
            })
          })
      })
    /* Render the HTML on the page including the text for the marker used for
      the leaflet map. */
    weatherText = `The weather in ${name} is ${description} Current temperature is ${temperature} degrees ${airDescription}`
    res.render("index", {
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
    return res.render("index", {
      weather: "Oh no, Something went wrong! Please try again",
      image: defaultLocation.image,
      cityName: "An Error Occured",
      weatherTemperature: ":",
      weatherDescription: "Please Try Again",
      weekly: defaultLocation.week,
      lat: defaultLocation.latitude,
      lon: defaultLocation.longitude
    });
  }
});

module.exports = router;