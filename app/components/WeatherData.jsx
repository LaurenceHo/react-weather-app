import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import * as d3 from 'd3';

export class WeatherData extends React.Component {
	constructor (props) {
		super (props);
	}

	render () {
		const renderLineChart = (data) => {
			console.log (data);

			let margin = { top: 10, right: 0, bottom: 10, left: 10 };
			let width = 640 - margin.left - margin.right;
			let height = 480 - margin.top - margin.bottom;

			let x = d3.scaleTime ().rangeRound ([ 0, width ]);
			let y = d3.scaleLinear ().rangeRound ([ height, 0 ]);
			let line = d3.line ()
				.x ((d) => {
					return x (d.dt);
				})
				.y ((d) => {
					return y (d.main.temp);
				});

			x.domain (d3.extent (data, (d) => {
				return moment.unix (d.dt);
			}));
			y.domain (d3.extent (data, (d) => {
				return d.main.temp;
			}));

			return (
				<path fill='none'
				      stroke='steelblue'
				      strokeLinejoin='round'
				      strokeLinecap='round'
				      strokeWidth='1.5'
				      d={line}>
				</path>
			);
		}

		const renderForecast = () => {
			return (
				<svg width="640" height="480">
					<g transform='translate(10,10)'>
						<g transform='translate(0,450)' fill='none' fontSize='10' textAnchor='middle'>
							{
								this.props.forecast.list.map (data => {
									{
										renderLineChart (data)
									}
								})
							}
						</g>
					</g>
				</svg>
			);
		}

		const sunriseTime = moment.unix (this.props.weather.sys.sunrise);
		const sunsetTime = moment.unix (this.props.weather.sys.sunset);

		return (
			<div>
				<h4 className="text-center">Current weather and forecasts in your city</h4>
				<div className="columns medium-6 large-4">
					<table>
						<tbody>
						<tr>
							<td>Location</td>
							<td>{this.props.location}</td>
						</tr>
						<tr>
							<td>Temperature</td>
							<td>{this.props.weather.main.temp} °C</td>
						</tr>
						<tr>
							<td>Wind</td>
							<td>{this.props.weather.wind.speed} m/s</td>
						</tr>
						<tr>
							<td>Pressure</td>
							<td>{this.props.weather.main.pressure} hpa</td>
						</tr>
						<tr>
							<td>Humidity</td>
							<td>{this.props.weather.main.humidity} %</td>
						</tr>
						<tr>
							<td>Sunrise Time</td>
							<td>{sunriseTime.hours ()}:{sunriseTime.minutes ()}</td>
						</tr>
						<tr>
							<td>Sunset Time</td>
							<td>{sunsetTime.hours ()}:{sunsetTime.minutes ()}</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div className="columns medium-10 large-8">
					<h5 className="text-center">Weather and forecasts in {this.props.location}</h5>
					<div>
						{renderForecast ()}
					</div>
				</div>
			</div>
		)
	};
}

WeatherData.PropTypes = {
	weather: PropTypes.object.isRequired,
	location: PropTypes.string.isRequired,
	forecast: PropTypes.object.isRequired
};