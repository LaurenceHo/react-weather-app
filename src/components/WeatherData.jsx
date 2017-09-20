import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import * as d3 from 'd3';
import { CurrentWeatherTable } from './CurrentWeatherTable';

export class WeatherData extends React.Component {
	constructor (props) {
		super (props);

		this.state = {
			tooltip: {
				display: false,
				data: {
					key: '',
					temperature: '',
					precipitation: ''
				}
			}
		}

		this.showToolTip = this.showToolTip.bind (this);
		this.hideToolTip = this.hideToolTip.bind (this);
	}

	showToolTip (e) {
		e.target.setAttribute ('fill', '#FFFFFF');
		this.setState ({
			tooltip: {
				display: true,
				data: {
					key: e.target.getAttribute ('data-key'),
					temperature: e.target.getAttribute ('data-temperature'),
					precipitation: e.target.getAttribute ('data-precipitation')
				},
				pos: {
					x: e.target.getAttribute ('cx'),
					y: e.target.getAttribute ('cy')
				}
			}
		});
	}

	hideToolTip (e) {
		e.target.setAttribute ('fill', '#7dc7f4');
		this.setState ({
			tooltip: {
				display: false,
				data: {
					key: '',
					temperature: '',
					precipitation: ''
				}
			}
		});
	}

	render () {
		const renderForecast = (width, height) => {
			// ================= data setup =================
			const utcOffset = this.props.timezone.rawOffset / 3600;
			const data = this.props.forecast.list.slice (0, 8);

			const margin = { top: 20, right: 50, bottom: 20, left: 50 };
			const w = width - margin.left - margin.right;
			const h = height - margin.top - margin.bottom;

			data.forEach (d => {
				d.time = moment.unix (d.dt).utcOffset (utcOffset).format ('HH:mm');
				d.main.temp = Math.round (d.main.temp * 10) / 10;

				if ( !d.rain )
					d.rain = {};
				if ( !d.rain[ '3h' ] )
					d.rain[ '3h' ] = 0;
				else
					d.rain[ '3h' ] = Math.round (d.rain[ '3h' ] * 100) / 100;
			});

			const x = d3.scaleBand ().domain (data.map (d => {
				return d.time;
			})).rangeRound ([ 0, w ]).padding (0.3);

			const yBar = d3.scaleLinear ().domain ([ 0, d3.max (data, (d) => {
				return d.rain[ '3h' ];
			}) ]).rangeRound ([ h, 0 ]);

			const yLine = d3.scaleLinear ().domain (d3.extent (data, d => {
				return d.main.temp;
			})).rangeRound ([ h, 0 ]);

			const line = d3.line ()
				.x (d => {
					return x (d.time);
				})
				.y (d => {
					return yLine (d.main.temp);
				}).curve (d3.curveCardinal);

			const renderBarChart = data.map ((d, i) => {
				return (
					<rect fill='#58657f'
					      rx='3'
					      ry='3'
					      key={i}
					      x={x (d.time)}
					      y={yBar (d.rain[ '3h' ])}
					      height={h - yBar (d.rain[ '3h' ])}
					      width={x.bandwidth ()}/>
				);
			});

			// ================= axis =================
			const xAxis = d3.axisBottom ()
				.scale (x)
				.tickValues (data.map ((d) => {
					return d.time;
				}))
				.ticks (4);

			const yAxis = d3.axisRight ()
				.scale (yLine)
				.ticks (5)
				.tickSize (w)
				.tickFormat (d => {
					return d;
				});

			const yBarAxis = d3.axisLeft ()
				.scale (yBar)
				.ticks (5);

			const translate = 'translate(' + (margin.left) + ',' + (margin.top) + ')';
			return (
				<svg width={width} height={height}>
					<g transform={translate}>
						<Axis h={h} axis={xAxis} axisType='x'/>
						<Axis h={h} axis={yAxis} axisType='y-t'/>
						<Axis h={h} axis={yBarAxis} axisType='y-p'/>
						{renderBarChart}
						<path className='shadow'
						      strokeLinecap='round'
						      fill='none'
						      stroke='#7dc7f4'
						      strokeWidth='5px'
						      d={line (data)}
						      transform='translate(30,0)'>
						</path>
						<Dots data={data}
						      x={x}
						      y={yLine}
						      showToolTip={this.showToolTip}
						      hideToolTip={this.hideToolTip}
						      utcOffset={utcOffset}/>
						<ToolTip tooltip={this.state.tooltip}/>
					</g>
				</svg>
			);
		}

		return (
			<div style={{ paddingTop: 30 }}>
				<CurrentWeatherTable location={this.props.location}
				                     weather={this.props.weather}
				                     timezone={this.props.timezone}/>
				<div className='columns medium-10 large-8'>
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
	forecast: PropTypes.object.isRequired,
	timezone: PropTypes.object.isRequired
};

class Dots extends React.Component {
	constructor (props) {
		super (props);
	}

	render () {
		return (
			<g>
				{this.props.data.map ((d, i) => (
					<circle r='7'
					        cx={this.props.x (d.time)}
					        cy={this.props.y (d.main.temp)}
					        fill='#7dc7f4'
					        stroke='#3f5175'
					        strokeWidth='4px'
					        key={i}
					        transform='translate(30,0)'
					        onMouseOver={this.props.showToolTip}
					        onMouseOut={this.props.hideToolTip}
					        data-key={moment.unix (d.dt).utcOffset (this.props.utcOffset).format ('MMM. DD  HH:mm')}
					        data-temperature={d.main.temp}
					        data-precipitation={d.rain[ '3h' ]}>
					</circle>
				))}
			</g>
		);
	}
}

Dots.PropTypes = {
	data: PropTypes.object.isRequired,
	x: PropTypes.object.isRequired,
	y: PropTypes.object.isRequired,
	showToolTip: PropTypes.func.isRequired,
	hideToolTip: PropTypes.func.isRequired,
	utcOffset: PropTypes.number.isRequired
}

class ToolTip extends React.Component {
	constructor (props) {
		super (props);
	}

	render () {
		let visibility = "hidden";
		let transform = "";
		let x = 0;
		let y = 0;
		let width = 150, height = 70;
		let transformText = 'translate(' + width / 2 + ',' + (height / 2 - 5) + ')';
		let transformArrow = "";

		if ( this.props.tooltip.display == true ) {
			let position = this.props.tooltip.pos;

			x = position.x;
			y = position.y;
			visibility = "visible";

			if ( y > height ) {
				transform = 'translate(' + ((x - width / 2) + 30) + ',' + (y - height - 20) + ')';
				transformArrow = 'translate(' + (width / 2 - 20) + ',' + (height - 2) + ')';
			} else if ( y < height ) {
				transform = 'translate(' + ((x - width / 2) + 30) + ',' + (Math.round (y) + 20) + ')';
				transformArrow = 'translate(' + (width / 2 - 20) + ',' + 0 + ') rotate(180,20,0)';
			}
		} else {
			visibility = "hidden"
		}

		return (
			<g transform={transform}>
				<rect class="shadow"
				      is
				      width={width}
				      height={height}
				      rx="5"
				      ry="5"
				      visibility={visibility}
				      fill="#6391da"
				      opacity=".9"/>
				<polygon class="shadow"
				         is
				         points="10,0  30,0  20,10"
				         transform={transformArrow}
				         fill="#6391da"
				         opacity=".9"
				         visibility={visibility}/>
				<text is
				      visibility={visibility}
				      transform={transformText}>
					<tspan is
					       x="0"
					       text-anchor="middle"
					       font-size="12px"
					       fill="#ffffff">
						{this.props.tooltip.data.key}
					</tspan>
					<tspan is
					       x="0"
					       text-anchor="middle"
					       dy="25"
					       font-size="12px"
					       fill="#a9f3ff">
						{this.props.tooltip.data.temperature} °C / {this.props.tooltip.data.precipitation} mm
					</tspan>
				</text>
			</g>
		);
	}
}

ToolTip.PropTypes = {
	tooltip: PropTypes.object
}

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
			   opacity='1'>
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