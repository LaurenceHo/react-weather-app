import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as d3 from 'd3';
import { Col, Row, Tabs } from 'antd';
import { CurrentWeatherTable } from './CurrentWeatherTable';
import { ToolTip } from './ToolTip';

const TabPane = Tabs.TabPane;

interface WeatherDataState {
	tooltip: any
}

class WeatherData extends React.Component<any, WeatherDataState> {
	constructor(props: any) {
		super(props);

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
		};

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
		const {weather, location, forecast, timezone} = this.props;

		const renderForecast = (index: number, width: number, height: number) => {
			// ================= data setup =================
			const utcOffset = timezone.rawOffset / 3600;
			const data = forecast.list.slice(index, index + 8);

			const margin = {top: 20, right: 50, bottom: 20, left: 50};
			const w = width - margin.left - margin.right;
			const h = height - margin.top - margin.bottom;

			data.forEach((d: any) => {
				d.time = moment.unix(d.dt).utcOffset(utcOffset).format('MMM-DD HH:mm');
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
				let rain: number = d.rain['3h'];
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

			const renderBarChart = data.map((d: any, i: number) =>
				<rect fill='#A4A4A4'
				      rx='3'
				      ry='3'
				      key={i}
				      x={x(d.time)}
				      y={yBar(d.rain['3h'])}
				      height={h - yBar(d.rain['3h'])}
				      width={x.bandwidth()}/>
			);

			// ================= axis =================
			const xAxis = d3.axisBottom(x)
				.tickValues(data.map((d: any) => {
					return d.time;
				}))
				.ticks(4);

			const yAxis = d3.axisRight(yLine)
				.ticks(5)
				.tickSize(w)
				.tickFormat((d: any) => {
					return d;
				});

			const yBarAxis = d3.axisLeft(yBar)
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
		};

		return (
			<Row type="flex" justify="center">
				<CurrentWeatherTable location={location}
				                     weather={weather}
				                     timezone={timezone}/>
				<Col span={1}/>
				<Col span={12}>
					<h2 style={{paddingBottom: 10}}>Weather and forecasts in {location}</h2>
					<Tabs defaultActiveKey="1">
						<TabPane tab="Today" key="1">{renderForecast(0, 720, 360)}</TabPane>
						<TabPane tab="Tomorrow" key="2">{renderForecast(8, 720, 360)}</TabPane>
						<TabPane tab="After Tomorrow" key="3">{renderForecast(16, 720, 360)}</TabPane>
					</Tabs>
				</Col>
			</Row>
		);
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

interface AxisPropTypes {
	h: number,
	axis: any,
	axisType: string
}

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
					? <text fill='#000' y='645' dy='0.71em' textAnchor='end' transform='rotate(-90)'>Temperature, °C</text>
					: ''}
			</g>
		);
	}
}