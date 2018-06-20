const _ = require('lodash');
const functions = require('firebase-functions');
const request = require('request');
const moment = require('moment');
const cors = require('cors')({ origin: true });

const apiKey = require('./apikey');

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/';
const GOOGLE_TIMEZONE_API_URL = GOOGLE_MAPS_API_URL + 'timezone/json?location=';
const GOOGLE_GETCODE_API_URL = GOOGLE_MAPS_API_URL + 'geocode/json?latlng=';

exports.getTimeZone = functions.https.onRequest((req, res) => {
	const latitudeAndLongitude = req.query.lat + ',' + req.query.lon;

	const requestUrl = `${GOOGLE_TIMEZONE_API_URL}${latitudeAndLongitude}&timestamp=${moment().unix()}&key=${apiKey.google}`;

	cors(req, res, () => {
		return request.get(requestUrl, (error, response, body) => {
			if (error) {
				return res.send(error);
			}
			return res.status(200).send(JSON.parse(body));
		});
	});
});

exports.getGeocode = functions.https.onRequest((req, res) => {
	const latitudeAndLongitude = req.query.lat + ',' + req.query.lon;

	const requestUrl = `${GOOGLE_GETCODE_API_URL}${latitudeAndLongitude}&sensor=true&key=${apiKey.google}`;
	cors(req, res, () => {
		return request.get(requestUrl, (error, response, body) => {
			if (error) {
				return res.send(error);
			}

			const geocode = JSON.parse(body);

			if (geocode.status === 'OK') {
				const results = geocode.results;

				let subLocalityLocation = _.findLast(results, { 'types': ['political', 'sublocality', 'sublocality_level_1'] });
				let location = _.findLast(results, { 'types': ['administrative_area_level_1', 'political'] });

				let city;
				if (subLocalityLocation) {
					city = subLocalityLocation.formatted_address;
				} else {
					city = location.formatted_address;
				}

				let geocodeResponse = {
					status: 'OK',
					address: results[0].formatted_address,
					latitude: results[0].geometry.location.lat,
					longitude: results[0].geometry.location.lng,
					city: city
				};
				return res.status(200).send(geocodeResponse);
			}
		});
	});
});
