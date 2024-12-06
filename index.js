import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import e from "express";

const app = express();
const PORT = 3000;
const API_KEY = "s7YSFSBvBJqHipYgcp8DYwA4rLkd1PGn";
var forecasts = [];

function icon(temperature) {
  if (temperature < 0) {
    return "❄️";
  } else if (temperature < 25) {
    return "☁️";
  } else {
    return "☀️";
  }
}

app.use(express.static("public")); // Serve static CSS and JS files
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  //     {
  //       city: "New York",
  //       temperature: 28,
  //       feels_like: 30,
  //       wind: 2,
  //       humidity: 23,
  //       icon: "☀️",
  //     },
  //     {
  //       city: "London",
  //       temperature: 14,
  //       feels_like: 14,
  //       wind: 3,
  //       humidity: 12,
  //       icon: "☁️",
  //     },
  //     {
  //       city: "Tokyo",
  //       temperature: 25,
  //       feels_like: 26,
  //       wind: 2,
  //       humidity: 4,
  //       icon: "🌤️",
  //     },
  //   ];
  res.render("index.ejs", { forecasts: [] });
});

app.post("/getCity", async (req, res) => {
  try {
    const cityResponse = await axios.get(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${req.body.city}`
    );
    const cityKey = cityResponse.data[0].Key;

    const forecastDailyResponse = await axios.get(
      `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${API_KEY}&details=true`
    );
    const forecastDaily = forecastDailyResponse.data.DailyForecasts[0];
    const currentConditionsResponse = await axios.get(
      `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${API_KEY}&details=true`
    );
    const currentConditions = currentConditionsResponse.data[0];
    const currentForecast = {
      city: req.body.city,
      temperature: currentConditions.Temperature.Metric.Value,
      feels_like: currentConditions.RealFeelTemperature.Maximum.Value,
      wind: currentConditions.Wind.Speed.Imperial.Value,
      humidity: currentConditions.RelativeHumidity,
      icon: currentConditions.WeatherIcon,
    };
    console.log(currentForecast);
    forecasts.push(currentForecast);
    res.render("index.ejs", { forecasts });

  } catch (error) {
    res.status(503).send(error.response.data.Message);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
