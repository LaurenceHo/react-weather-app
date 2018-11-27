import { Row } from 'antd';
import * as React from 'react';
import * as echarts from 'echarts/lib/echarts';
import { connect } from 'react-redux';

import { chartConfig } from './chartConfig';

export class HourlyForecast extends React.Component<any, any> {
  componentDidMount() {
    this.renderChart();
  }
  
  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    if (this.props.forecast.hourly !== prevProps.forecast.hourly) {
      this.renderChart();
    }
  }
  
  renderChart = () => {
    try {
      const weatherChart = document.getElementById('weather-chart');
      weatherChart.parentNode.removeChild(weatherChart);
    } catch (err) {
    }
    
    // Generate div element dynamically for ECharts
    const divElement: HTMLDivElement = document.createElement('div');
    divElement.setAttribute('id', 'weather-chart');
    divElement.setAttribute('class', 'weather-chart');
    document.getElementById('weather-chart-wrapper').appendChild(divElement);
    
    let chart = echarts.getInstanceByDom(divElement);
    if (!chart) {
      chart = echarts.init(divElement, null, {renderer: 'canvas'});
    }
    
    chart.setOption(
      chartConfig(this.props.units, this.props.timezone, this.props.forecast.hourly)
    );
  };
  
  render() {
    const {forecast} = this.props;
    return (
      <div>
        <Row type="flex" justify="center" className='forecast-summary'>
          {forecast.hourly.summary}
        </Row>
        <Row type="flex" justify="center" id='weather-chart-wrapper'/>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    units: state.units,
    filter: state.filter,
    location: state.location,
    weather: state.weather,
    forecast: state.forecast,
    timezone: state.timezone,
    isLoading: state.isLoading,
    error: state.error
  }
};

export default connect(mapStateToProps)(HourlyForecast);
