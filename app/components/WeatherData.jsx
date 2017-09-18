import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import * as d3 from 'd3';

export class WeatherData extends React.Component {
	constructor (props) {
		super (props);
	}

	render () {
		const renderDots = (x, y) => {
			let data = this.props.forecast.list.splice (1);
			data.pop ();

			return (
				<g>
					{data.map ((d, i) => (
						<circle className="dot"
						        r="7"
						        cx={x (d.date)}
						        cy={y (d.main.temp)}
						        fill="#7dc7f4"
						        stroke="#3f5175"
						        strokeWidth="4px"
						        key={i}>
						</circle>
					))}
				</g>
			);
		};

		const renderForecast = (widthTemp, heightTemp) => {
			const data = this.props.forecast.list;

			let margin = { top: 10, right: 0, bottom: 10, left: 10 };
			let width = widthTemp - margin.left - margin.right;
			let height = heightTemp - margin.top - margin.bottom;
			let parseTime = d3.utcParse ("%Y-%m-%d %H:%M:%S");

			data.forEach (d => {
				d.date = parseTime (d.dt_txt);
			});

			let x = d3.scaleTime ().domain (d3.extent (data, (d) => {
				return d.date;
			})).rangeRound ([ 0, width ]);
			let y = d3.scaleLinear ().domain (d3.extent (data, (d) => {
				return d.main.temp;
			})).rangeRound ([ height, 0 ]);

			let line = d3.line ()
				.x ((d) => {
					return x (d.date);
				})
				.y ((d) => {
					return y (d.main.temp);
				});

			return (
				<svg width={widthTemp} height={heightTemp}>
					<g transform='translate(10,10)'>
						<path className="line shadow"
						      strokeLinecap='round'
						      d={line (data)}>
						</path>
						{renderDots (x, y)}
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
						{renderForecast (800, 480)}
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