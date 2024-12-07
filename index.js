import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const API_KEY = "789e511e2f355df6117224d8101331b3";
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
app.use(bodyParser.urlencoded({ extended: true }));

async function getCoordinates(city) {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
    );
    return [response.data[0].lat, response.data[0].lon];
  } catch (error) {
    console.error(error);
  }
}

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
  const city = req.body.city;
  const [lad, lon] = await getCoordinates(city);
  const today = new Date();

  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: lad,
        longitude: lon,
        current: [
          "temperature_2m",
          "apparent_temperature",
          "weather_code",
          "relative_humidity_2m",
          "windspeed_10m",
        ],
        temperature_unit: "celsius",
        start_date: today.toISOString().split("T")[0],
        end_date: today.toISOString().split("T")[0],
        timezone: "Asia/Ho_Chi_Minh",
      },
    });

    console.log(response.data.current);

    const forecast = {
      city: city,
      temperature: response.data.current.temperature_2m,
      feels_like: response.data.current.apparent_temperature,
      wind: response.data.current.windspeed_10m,
      humidity: response.data.current.relative_humidity_2m,
      icon: icon(response.data.current.temperature_2m),
    };

    forecasts.push(forecast);
    res.render("index.ejs", { forecasts: forecasts });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
