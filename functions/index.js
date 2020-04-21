const _ = require('lodash');
const functions = require('firebase-functions');
const request = require('request');
const apiKey = require('./apikey');

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/';
const GEOCODE_API_URL = GOOGLE_MAPS_API_URL + 'geocode/json?';
const DARK_SKY_API_URL = 'https://api.darksky.net/forecast/' + apiKey.darkSky;
const whitelist = ['https://reactjs-weather.firebaseapp.com', 'https://reactjs-weather.web.app'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
const cors = require('cors')(corsOptions);

exports.getGeocode = functions.https.onRequest((req, res) => {
  let params = '';
  if (req.query.lat !== 'null' && req.query.lon !== 'null') {
    params = `latlng=${req.query.lat},${req.query.lon}`;
  } else {
    params = `address=${req.query.address}`;
  }
  let requestUrl = `${GEOCODE_API_URL}${params}&key=${apiKey.googleGeocoding}`;
  requestUrl = encodeURI(requestUrl);
  console.log('requestUrl:', requestUrl);
  cors(req, res, () => {
    return request.get(requestUrl, (error, response, body) => {
      if (error) {
        return res.send(error);
      }
      console.log('response:', body);
      const geocode = JSON.parse(body);
      if (geocode.status === 'OK') {
        const results = geocode.results;

        let geocodeResponse = {
          status: 'OK',
          address: results[0].formatted_address,
          latitude: results[0].geometry.location.lat,
          longitude: results[0].geometry.location.lng,
        };
        return res.status(200).send(geocodeResponse);
      } else if (geocode.status === 'ZERO_RESULTS') {
        return res.status(404).send({ error: 'ERROR' });
      } else {
        return res.status(500).send({ error: 'ERROR' });
      }
    });
  });
});

exports.getWeather = functions.https.onRequest((req, res) => {
  let params = `${req.query.lat},${req.query.lon}`;
  if (req.query.time && req.query.time > 0) {
    params = `${params},${req.query.time}`;
  }
  let requestUrl = `${DARK_SKY_API_URL}/${params}`;

  if (req.query.exclude) {
    requestUrl = `${requestUrl}?exclude=${req.query.exclude}`;
  }
  if (req.query.units) {
    requestUrl = `${requestUrl}&units=${req.query.units}`;
  }
  console.log('requestUrl:', requestUrl);
  cors(req, res, () => {
    return request.get(requestUrl, (error, response, body) => {
      console.log('response:', body);
      if (error) {
        console.log('error:', error);
        return res.status(response.statusCode).send(JSON.parse(body));
      }
      return res.status(response.statusCode).send(JSON.parse(body));
    });
  });
});
