const functions = require('firebase-functions');
const request = require('request');
const moment = require('moment');

const GOOGLE_TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json?location=';

exports.getTimeZone = functions.https.onRequest((req, res) => {
    const latitudeAndLongitude = req.query.lat + ',' + req.query.lon;

    const requestUrl = `${GOOGLE_TIMEZONE_API_URL}${latitudeAndLongitude}&timestamp=${moment().unix()}`;
    return request.get(requestUrl, (error, response, body) => {
        return res.json(body);
    });
});
