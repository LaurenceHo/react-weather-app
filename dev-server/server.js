const express = require('express');
const app = express();
const port = 3000;
const location = require('./location');
const weatherSi = require('./weather-si');
const weatherUs = require('./weather-us');
const weatherSiByDate = require('./weather-si-by-date');
const weatherUsByDate = require('./weather-us-by-date');

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
app.get('/getWeather', (req, res) => {
  if (req.query.time && req.query.time > 0) {
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
});

app.listen(port, () => console.log(`Mock server listening on port ${port}!`));
