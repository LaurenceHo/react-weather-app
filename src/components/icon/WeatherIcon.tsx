import * as React from 'react';
import * as Condition from '../../constants/WeatherCondition';

interface WeatherIconProps {
	icon: string
}

export class WeatherIcon extends React.Component<WeatherIconProps, any> {
	render() {
		const { icon } = this.props;

		if (icon === Condition.CLEAR_DAY) {
			return (<i className="wi wi-day-sunny">{/*EMPTY*/}</i>);
		} else if (icon === Condition.CLEAR_NIGHT) {
			return (<i className="wi wi-night-clear">{/*EMPTY*/}</i>);
		} else if (icon === Condition.RAIN) {
			return (<i className="wi wi-rain">{/*EMPTY*/}</i>);
		} else if (icon === Condition.SNOW) {
			return (<i className="wi wi-snow">{/*EMPTY*/}</i>);
		} else if (icon === Condition.SLEET) {
			return (<i className="wi wi-sleet">{/*EMPTY*/}</i>);
		} else if (icon === Condition.WIND) {
			return (<i className="wi wi-windy">{/*EMPTY*/}</i>);
		} else if (icon === Condition.FOG) {
			return (<i className="wi wi-fog">{/*EMPTY*/}</i>);
		} else if (icon === Condition.CLOUDY) {
			return (<i className="wi wi-cloudy">{/*EMPTY*/}</i>);
		} else if (icon === Condition.PARTLY_CLOUDY_DAY) {
			return (<i className="wi wi-day-cloudy">{/*EMPTY*/}</i>);
		} else if (icon === Condition.PARTLY_CLOUDY_NIGHT) {
			return (<i className="wi wi-night-alt-cloudy">{/*EMPTY*/}</i>);
		} else {
			return null;
		}
	}
}
