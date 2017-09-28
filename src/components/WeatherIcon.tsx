import * as React from 'react';
import * as Condition from '../constants/WeatherConditionCode';

interface WeatherIconProps {
	code: number
}

export class WeatherIcon extends React.Component<WeatherIconProps, any> {
	render() {
		if (this.props.code === Condition.CLEAR_SKY) {
			return (<i className="wi wi-day-sunny"></i>);
		} else {
			return (null);
		}
	}
}