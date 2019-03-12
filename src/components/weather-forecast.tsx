import * as React from 'react';
import CurrentWeather from './current-weather';
import DailyForecast from './daily-forecast';
import HourlyForecast from './hourly-forecast';

export class WeatherForecast extends React.Component<any, any> {
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
