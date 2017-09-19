import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import * as d3 from 'd3';

export class WeatherData extends React.Component {
	constructor (props) {
		super (props);
	}

	render () {
		const renderCurrentWeatherTable = () => {
			const sunriseTime = moment.unix (this.props.weather.sys.sunrise);
			const sunsetTime = moment.unix (this.props.weather.sys.sunset);

			return (
				<div className='columns medium-6 large-4' style={{ paddingTop: 30 }}>
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
			);
		}

		const renderDots = (x, y) => {
			const data = this.props.forecast.list.slice (0, 9).splice (1);
			data.pop ();

			return (
				<g>
					{data.map ((d, i) => (
						<circle className='dot'
						        r='7'
						        cx={x (d.date)}
						        cy={y (d.main.temp)}
						        fill='#7dc7f4'
						        stroke='#3f5175'
						        strokeWidth='4px'
						        key={i}>
						</circle>
					))}
				</g>
			);
		};

		const renderForecast = (width, height) => {
			// ================= data setup =================
			const data = this.props.forecast.list.slice (0, 9);

			const margin = { top: 20, right: 50, bottom: 20, left: 50 };
			const w = width - margin.left - margin.right;
			const h = height - margin.top - margin.bottom;
			const parseTime = d3.utcParse ('%Y-%m-%d %H:%M:%S');

			data.forEach (d => {
				d.date = parseTime (d.dt_txt);
				if ( !d.rain[ '3h' ] )
					d.rain[ '3h' ] = 0;
				else
					d.rain[ '3h' ] = Math.round (d.rain[ '3h' ] * 1000) / 1000;
			});

			// ================= line chart for temperature =================
			const x = d3.scaleTime ().domain (d3.extent (data, d => {
				return d.date;
			})).rangeRound ([ 0, w ]);
			const y = d3.scaleLinear ().domain (d3.extent (data, d => {
				return d.main.temp;
			})).rangeRound ([ h, 0 ]);

			const line = d3.line ()
				.x (d => {
					return x (d.date);
				})
				.y (d => {
					return y (d.main.temp);
				}).curve (d3.curveCardinal);

			// ================= axis for temperature =================
			const xAxis = d3.axisBottom ()
				.scale (x)
				.tickValues (data.map ((d, i) => {
					if ( i > 0 )
						return d.date;
				}).splice (1))
				.ticks (4);

			const yAxis = d3.axisRight ()
				.scale (y)
				.ticks (5)
				.tickSize (w)
				.tickFormat (d => {
					return d;
				});

			// ================= bar chart for Precipitation =================
			const xBar = d3.scaleBand ().domain (data.map (d => {
				return d.date;
			})).rangeRound ([ 0, w ]).padding (0.3);

			const yBar = d3.scaleLinear ().domain ([ 0, d3.max (data, (d) => {
				return d.rain[ '3h' ];
			}) ]).rangeRound ([ h, 0 ]);

			const yBarAxis = d3.axisLeft ()
				.scale (yBar)
				.ticks (5);

			const renderBarChart = data.map ((d, i) => {
				return (
					<rect fill='#58657f'
					      rx='3'
					      ry='3'
					      key={i}
					      x={xBar (d.date)}
					      y={yBar (d.rain[ '3h' ])}
					      height={h - yBar (d.rain[ '3h' ])}
					      width={xBar.bandwidth ()}/>
				);
			});

			const translate = 'translate(' + (margin.left) + ',' + (margin.top) + ')';
			return (
				<svg width={width} height={height}>
					<g transform={translate}>
						<Axis h={h} axis={yBarAxis} axisType='y-p'/>
						{renderBarChart}

						<Axis h={h} axis={xAxis} axisType='x'/>
						<Axis h={h} axis={yAxis} axisType='y-t'/>
						<path className='shadow'
						      strokeLinecap='round'
						      fill='none'
						      stroke='#7dc7f4'
						      strokeWidth='5px'
						      d={line (data)}>
						</path>
						{renderDots (x, y)}
					</g>
				</svg>
			);
		}

		return (
			<div style={{ paddingTop: 20 }}>
				<h4 className='text-center'>Current weather and forecasts in your city</h4>
				{renderCurrentWeatherTable ()}
				<div className='columns medium-10 large-8' style={{ paddingTop: 10 }}>
					<h5 className='text-center'>Weather and forecasts in {this.props.location}</h5>
					<div>
						{renderForecast (800, 400)}
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

class Axis extends React.Component {
	constructor (props) {
		super (props);
	}

	componentDidUpdate () {
		this.renderAxis ();
	}

	componentDidMount () {
		this.renderAxis ();
	}

	renderAxis () {
		let node = ReactDOM.findDOMNode (this);
		d3.select (node).call (this.props.axis);
	};

	render () {
		const translate = 'translate(0,' + (this.props.h) + ')';

		return (
			<g transform={this.props.axisType == 'x' ? translate : ''}
			   shapeRendering='crispEdges'
			   fill='#bbc7d9'
			   strokeDasharray={this.props.axisType == 'y-t' ? '2,2' : ''}
			   opacity='1'
			   className="axis">
				{this.props.axisType == 'y-p'
					? <text fill='#000' y='6' dy='0.71em' textAnchor='end' transform='rotate(-90)'>Precipitation, mm</text>
					: ''}
				{this.props.axisType == 'y-t'
					? <text fill='#000' y='725' dy='0.71em' textAnchor='end' transform='rotate(-90)'>Temperature, °C</text>
					: ''}
			</g>
		);
	}
}

Axis.PropTypes = {
	h: PropTypes.number.isRequired,
	axis: PropTypes.func.isRequired,
	axisType: PropTypes.oneOf ([ 'x', 'y-p', 'y-t' ]).isRequired
};