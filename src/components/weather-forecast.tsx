import * as React from 'react';
import { connect } from 'react-redux';
import CurrentWeather from './current-weather';
import DailyForecast from './daily-forecast';
import HourlyForecast from './hourly-forecast';

class WeatherForecast extends React.Component<any, any> {
  render() {
    return (
      <div>
        <CurrentWeather/>
        <HourlyForecast/>
        <DailyForecast/>
      </div>
    );
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
  };
};

export default connect(mapStateToProps)(WeatherForecast);