import * as React from 'react';
import * as Condition from '../constants/WeatherConditionCode';

interface WindIconProps {
	degree: number
}

export class WindIcon extends React.Component<WindIconProps, any> {
	render() {
		let windCode = Math.round(this.props.degree / 22.5);

		if (windCode === Condition.WIND_N) {
			return (<i className="wi wi-wind wi-towards-n"></i>);
		} else if (windCode === Condition.WIND_NNE) {
			return (<i className="wi wi-wind wi-towards-nne"></i>);
		} else if (windCode === Condition.WIND_NE) {
			return (<i className="wi wi-wind wi-towards-ne"></i>);
		} else if (windCode === Condition.WIND_ENE) {
			return (<i className="wi wi-wind wi-towards-ene"></i>);
		} else if (windCode === Condition.WIND_E) {
			return (<i className="wi wi-wind wi-towards-e"></i>);
		} else if (windCode === Condition.WIND_ESE) {
			return (<i className="wi wi-wind wi-towards-ese"></i>);
		} else if (windCode === Condition.WIND_SE) {
			return (<i className="wi wi-wind wi-towards-se"></i>);
		} else if (windCode === Condition.WIND_SSE) {
			return (<i className="wi wi-wind wi-towards-sse"></i>);
		} else if (windCode === Condition.WIND_S) {
			return (<i className="wi wi-wind wi-towards-s"></i>);
		} else if (windCode === Condition.WIND_SSW) {
			return (<i className="wi wi-wind wi-towards-ssw"></i>);
		} else if (windCode === Condition.WIND_SW) {
			return (<i className="wi wi-wind wi-towards-sw"></i>);
		} else if (windCode === Condition.WIND_WSW) {
			return (<i className="wi wi-wind wi-towards-wsw"></i>);
		} else if (windCode === Condition.WIND_W) {
			return (<i className="wi wi-wind wi-towards-w"></i>);
		} else if (windCode === Condition.WIND_WNW) {
			return (<i className="wi wi-wind wi-towards-wnw"></i>);
		} else if (windCode === Condition.WIND_NW) {
			return (<i className="wi wi-wind wi-towards-nw"></i>);
		} else if (windCode === Condition.WIND_NNW) {
			return (<i className="wi wi-wind wi-towards-nnw"></i>);
		} else {
			return (null);
		}
	}
}