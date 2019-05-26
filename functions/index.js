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
  const requestUrl = `${GEOCODE_API_URL}${params}&key=${apiKey.googleGeocoding}`;
  console.log(requestUrl);
  cors(req, res, () => {
    return request.get(requestUrl, (error, response, body) => {
      if (error) {
        return res.send(error);
      }
      console.log(body);
      const geocode = JSON.parse(body);
      if (geocode.status === 'OK') {
        const results = geocode.results;

        let sublocality = _.findLast(results, { types: ['political', 'sublocality', 'sublocality_level_1'] });
        let administrative_area = _.findLast(results, { types: ['administrative_area_level_1', 'political'] });
        let locality = _.findLast(results, { types: ['locality', 'political'] });

        let city;
        if (sublocality) {
          city = sublocality.formatted_address;
        } else {
          if (administrative_area) {
            city = administrative_area.formatted_address;
          } else {
            city = locality.formatted_address;
          }
        }

        let geocodeResponse = {
          status: 'OK',
          address: results[0].formatted_address,
          latitude: results[0].geometry.location.lat,
          longitude: results[0].geometry.location.lng,
          city: city,
        };
        return res.status(200).send(geocodeResponse);
      } else {
        return res.status(response.statusCode).send(body);
      }
    });
  });
});

exports.getWeather = functions.https.onRequest((req, res) => {
  const params = req.query.lat + ',' + req.query.lon;
  let requestUrl = `${DARK_SKY_API_URL}/${params}`;

  if (req.query.exclude) {
    requestUrl = requestUrl + `?exclude=${req.query.exclude}`;
  }
  if (req.query.units) {
    requestUrl = requestUrl + `&units=${req.query.units}`;
  }
  console.log(requestUrl);
  cors(req, res, () => {
    return request.get(requestUrl, (error, response, body) => {
      if (error) {
        return res.status(response.statusCode).send(body);
      }
      console.log(body);
      return res.status(200).send(JSON.parse(body));
    });
  });
});

exports.getForecast = functions.https.onRequest((req, res) => {
  const params = req.query.lat + ',' + req.query.lon + ',' + req.query.time;
  let requestUrl = `${DARK_SKY_API_URL}/${params}`;

  if (req.query.exclude) {
    requestUrl = requestUrl + `?exclude=${req.query.exclude}`;
  }
  if (req.query.units) {
    requestUrl = requestUrl + `&units=${req.query.units}`;
  }
  console.log(requestUrl);
  cors(req, res, () => {
    return request.get(requestUrl, (error, response, body) => {
      if (error) {
        return res.status(response.statusCode).send(body);
      }
      console.log(body);
      return res.status(200).send(JSON.parse(body));
    });
  });
});
