import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import * as moment from 'moment';
import * as d3 from 'd3';

import { CurrentWeatherTable } from './CurrentWeatherTable';

interface WeatherDataState {
	tooltip: any
}

class WeatherData extends React.Component<any, WeatherDataState> {
	constructor() {
		super();

		this.state = {
			tooltip: {
				display: false,
				data: {
					key: '',
					temperature: '',
					precipitation: '',
					description: ''
				}
			}
		}

		this.showToolTip = this.showToolTip.bind(this);
		this.hideToolTip = this.hideToolTip.bind(this);
	}

	showToolTip(e: any) {
		e.target.setAttribute('fill', '#FFFFFF');
		this.setState({
			tooltip: {
				display: true,
				data: {
					key: e.target.getAttribute('data-key'),
					temperature: e.target.getAttribute('data-temperature'),
					precipitation: e.target.getAttribute('data-precipitation'),
					description: e.target.getAttribute('data-description')
				},
				pos: {
					x: e.target.getAttribute('cx'),
					y: e.target.getAttribute('cy')
				}
			}
		});
	}

	hideToolTip(e: any) {
		e.target.setAttribute('fill', '#7dc7f4');
		this.setState({
			tooltip: {
				display: false,
				data: {
					key: '',
					temperature: '',
					precipitation: '',
					description: ''
				}
			}
		});
	}

	render() {
		const {weather, location, forecast, timezone, error} = this.props;

		const renderForecast = (index: number, width: number, height: number) => {
			// ================= data setup =================
			const utcOffset = timezone.rawOffset / 3600;
			const data = forecast.list.slice(index, index + 8);

			const margin = {top: 20, right: 50, bottom: 20, left: 50};
			const w = width - margin.left - margin.right;
			const h = height - margin.top - margin.bottom;

			data.forEach((d: any) => {
				d.time = moment.unix(d.dt).utcOffset(utcOffset).format('HH:mm');
				d.main.temp = Math.round(d.main.temp * 10) / 10;

				if (!d.rain)
					d.rain = {};
				if (!d.rain['3h'])
					d.rain['3h'] = 0;
				else
					d.rain['3h'] = Math.round(d.rain['3h'] * 100) / 100;
			});

			const x = d3.scaleBand().domain(data.map((d: any) => {
				return d.time;
			})).rangeRound([0, w]).padding(0.3);

			const yBar = d3.scaleLinear().domain([0, d3.max(data, (d: any) => {
				let rain: number = d.rain['3h']
				return rain;
			})]).rangeRound([h, 0]);

			const yLine = d3.scaleLinear().domain(d3.extent(data, (d: any) => {
				let temp: number = d.main.temp;
				return temp;
			})).rangeRound([h, 0]);

			const line = d3.line()
				.x((d: any) => {
					return x(d.time);
				})
				.y((d: any) => {
					return yLine(d.main.temp);
				}).curve(d3.curveCardinal);

			const renderBarChart = data.map((d: any, i: number) => {
				return (
					<rect fill='#58657f'
					      rx='3'
					      ry='3'
					      key={i}
					      x={x(d.time)}
					      y={yBar(d.rain['3h'])}
					      height={h - yBar(d.rain['3h'])}
					      width={x.bandwidth()}/>
				);
			});

			// ================= axis =================
			const xAxis = d3.axisBottom(x)
			// .scale(x)
				.tickValues(data.map((d: any) => {
					return d.time;
				}))
				.ticks(4);

			const yAxis = d3.axisRight(yLine)
			// .scale(yLine)
				.ticks(5)
				.tickSize(w)
				.tickFormat((d: any) => {
					return d;
				});

			const yBarAxis = d3.axisLeft(yBar)
			// .scale(yBar)
				.ticks(5);

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
						      d={line(data)}
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
			<div style={{paddingTop: 30}}>
				<CurrentWeatherTable location={location}
				                     weather={weather}
				                     timezone={timezone}/>
				<div className='columns medium-10 large-8'>
					<h5 className='text-center'>Weather and forecasts in {location}</h5>
					<Tabs>
						<TabList>
							<Tab>Today</Tab>
							<Tab>Tomorrow</Tab>
							<Tab>After Tomorrow</Tab>
						</TabList>
						<TabPanel>
							{renderForecast(0, 800, 400)}
						</TabPanel>
						<TabPanel>
							{renderForecast(8, 800, 400)}
						</TabPanel>
						<TabPanel>
							{renderForecast(16, 800, 400)}
						</TabPanel>
					</Tabs>
					<div>
					</div>
				</div>
			</div>
		)
	};
}

const mapStateToProps = (state: any) => {
	return {
		location: state.location,
		weather: state.weather,
		forecast: state.forecast,
		timezone: state.timezone,
		isLoading: state.isLoading,
		error: state.error
	}
};

export default connect(mapStateToProps)(WeatherData);

interface DotsPropTypes {
	data: any
	x: any
	y: any
	showToolTip: any
	hideToolTip: any
	utcOffset: number
}

class Dots extends React.Component<DotsPropTypes, any> {
	render() {
		return (
			<g>
				{this.props.data.map((d: any, i: number) => (
					<circle r='7'
					        cx={this.props.x(d.time)}
					        cy={this.props.y(d.main.temp)}
					        fill='#7dc7f4'
					        stroke='#3f5175'
					        strokeWidth='4px'
					        key={i}
					        transform='translate(30,0)'
					        onMouseOver={this.props.showToolTip}
					        onMouseOut={this.props.hideToolTip}
					        data-key={moment.unix(d.dt).utcOffset(this.props.utcOffset).format('MMM. DD  HH:mm')}
					        data-temperature={d.main.temp}
					        data-precipitation={d.rain['3h']}
					        data-description={d.weather[0].description}>
					</circle>
				))}
			</g>
		);
	}
}

interface ToolTipPropTypes {
	tooltip: any
}

class ToolTip extends React.Component<ToolTipPropTypes, any> {
	render() {
		let visibility = "hidden";
		let transform = "";
		let x = 0;
		let y = 0;
		let width = 150, height = 70;
		let transformText = 'translate(' + width / 2 + ',' + (height / 2 - 14) + ')';
		let transformArrow = "";

		if (this.props.tooltip.display == true) {
			let position = this.props.tooltip.pos;

			x = position.x;
			y = position.y;
			visibility = "visible";

			if (y > height) {
				transform = 'translate(' + ((x - width / 2) + 30) + ',' + (y - height - 20) + ')';
				transformArrow = 'translate(' + (width / 2 - 20) + ',' + (height - 2) + ')';
			} else if (y < height) {
				transform = 'translate(' + ((x - width / 2) + 30) + ',' + (Math.round(y) + 20) + ')';
				transformArrow = 'translate(' + (width / 2 - 20) + ',' + 0 + ') rotate(180,20,0)';
			}
		} else {
			visibility = "hidden"
		}

		return (
			<g transform={transform}>
				<rect className="shadow"
				      width={width}
				      height={height}
				      rx="5"
				      ry="5"
				      visibility={visibility}
				      fill="#6391da"
				      opacity=".9"/>
				<polygon className="shadow"
				         points="10,0  30,0  20,10"
				         transform={transformArrow}
				         fill="#6391da"
				         opacity=".9"
				         visibility={visibility}/>
				<text visibility={visibility}
				      transform={transformText}>
					<tspan x="0"
					       textAnchor="middle"
					       fontSize="14px"
					       fill="#ffffff">
						{this.props.tooltip.data.key}
					</tspan>
					<tspan x="0"
					       textAnchor="middle"
					       dy="20"
					       fontSize="13px"
					       fill="#a9f3ff">
						{this.props.tooltip.data.description}
					</tspan>
					<tspan x="0"
					       textAnchor="middle"
					       dy="20"
					       fontSize="12px"
					       fill="#a9f3ff">
						{this.props.tooltip.data.temperature} °C / {this.props.tooltip.data.precipitation} mm
					</tspan>
				</text>
			</g>
		);
	}
}

interface AxisPropTypes {
	h: number,
	axis: any,
	axisType: string
};

class Axis extends React.Component<AxisPropTypes, any> {
	componentDidUpdate() {
		this.renderAxis();
	}

	componentDidMount() {
		this.renderAxis();
	}

	renderAxis() {
		let node = ReactDOM.findDOMNode(this);
		d3.select(node).call(this.props.axis);
	};

	render() {
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