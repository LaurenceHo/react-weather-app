import Row from 'antd/lib/row';
import * as echarts from 'echarts/lib/echarts';
import * as React from 'react';
import { connect } from 'react-redux';

import { chartConfig } from './chart-config';

export class HourlyForecast extends React.Component<any, any> {
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.hourlyForecast !== prevProps.hourlyForecast) {
      this.renderChart();
    }
  }
  
  renderChart = () => {
    try {
      const weatherChart = document.getElementById('weather-chart');
      weatherChart.parentNode.removeChild(weatherChart);
    } catch (err) {
      console.log('blahblah');
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
      chartConfig(this.props.filter.units, this.props.timezone, this.props.hourlyForecast)
    );
  }
  
  render() {
    const {hourlyForecast} = this.props;
    return (
      <div>
        <Row type='flex' justify='center' className='forecast-summary'>
          {hourlyForecast.summary}
        </Row>
        <Row type='flex' justify='center' id='weather-chart-wrapper'/>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.isLoading,
    filter: state.filter,
    timezone: state.timezone,
    weather: state.weather,
    hourlyForecast: state.hourlyForecast
  };
};

export default connect(mapStateToProps)(HourlyForecast);
