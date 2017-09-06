import React from 'react';
import PropTypes from 'prop-types';

export const WeatherMessage = (props) => {
	const temperature = Math.round (((props.temp - 32) * 5 / 9) * 10) / 10;

	return (
		<h3 className="text-center">It's {temperature} ℃ in {props.location}.</h3>
	)
};

WeatherMessage.PropTypes = {
	temp: PropTypes.string.isRequired,
	location: PropTypes.string.isRequired
};
