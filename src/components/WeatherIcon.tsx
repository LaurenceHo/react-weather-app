import * as React from 'react';
import * as Condition from '../constants/WeatherConditionCode';

interface WeatherIconProps {
	code: number
}

export class WeatherIcon extends React.Component<WeatherIconProps, any> {
	render() {
		if (this.props.code === Condition.LIGHT_RAIN || this.props.code === Condition.SHOWER_RAIN) {
			return (<i className="wi wi-showers"></i>);
		} else if (this.props.code === Condition.MODERATE_RAIN) {
			return (<i className="wi wi-hail"></i>);
		} else if (this.props.code === Condition.CLEAR_SKY) {
			return (<i className="wi wi-day-sunny"></i>);
		} else if (this.props.code === Condition.FEW_CLOUDS || this.props.code === Condition.SCATTERED_CLOUDS) {
			return (<i className="wi wi-cloud"></i>);
		} else if (this.props.code === Condition.BROKEN_CLOUDS || this.props.code === Condition.OVERCAST_CLOUDS) {
			return (<i className="wi wi-cloudy"></i>);
		} else {
			return (null);
		}
	}
}