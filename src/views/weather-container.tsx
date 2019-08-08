import * as React from 'react';
import CurrentWeather from '../components/current-weather';
import DailyForecast from '../components/daily-forecast';
import HourlyForecast from '../components/hourly-forecast';

export class WeatherContainer extends React.Component<any, any> {
  render() {
    return (
      <div>
        <CurrentWeather />
        <HourlyForecast />
        <DailyForecast />
      </div>
    );
  }
}
