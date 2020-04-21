const express = require('express');
const app = express();
const port = 3000;
const location = require('./mock/location');
const weatherSi = require('./mock/weather-si');
const weatherUs = require('./mock/weather-us');
const weatherSiByDate = require('./mock/weather-si-by-date');
const weatherUsByDate = require('./mock/weather-us-by-date');
const nyWeatherSi = require('./mock/ny-weather-si');
const nyWeatherUs = require('./mock/ny-weather-us');
const covidData = require('./mock/covid-19');

const corsHeader = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(corsHeader);

app.get('/getGeocode', (req, res) => setTimeout(() => res.send(location), 1000));
// app.get('/getGeocode', (req, res) =>
//   setTimeout(
//     () =>
//       res.status(404).json({
//         status: 'ERROR',
//       }),
//     1000
//   )
// );
app.get('/getWeather', (req, res) => {
  // res.status(403).send({ code: 403, error: 'daily usage limit exceeded' });
  if (req.query.lat === '40.7127753' && req.query.lon === '-74.0059728') {
    if (req.query.units.toLocaleLowerCase() === 'us') {
      setTimeout(() => res.send(nyWeatherUs), 1000);
    } else {
      setTimeout(() => res.send(nyWeatherSi), 1000);
    }
  } else {
    if (req.query.time && req.query.time !== '0') {
      if (req.query.units.toLocaleLowerCase() === 'us') {
        setTimeout(() => res.send(weatherUsByDate), 1000);
      } else {
        setTimeout(() => res.send(weatherSiByDate), 1000);
      }
    } else {
      if (req.query.units.toLocaleLowerCase() === 'us') {
        setTimeout(() => res.send(weatherUs), 1000);
      } else {
        setTimeout(() => res.send(weatherSi), 1000);
      }
    }
  }
});

app.get('/covidData', (req, res) => {
  setTimeout(() => res.send(covidData), 1000);
});

app.listen(port, () => console.log(`Mock server listening on port ${port}!`));
