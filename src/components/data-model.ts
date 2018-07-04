export interface Timezone {
  timezone: string;
  offset: number;
  latitude: number;
  longitude: number;
}

export interface Weather {
  time: number;
  summary: string;
  icon: string;
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;
  nearestStormDistance: number;
  precipIntensity: number;
  precipIntensityMax: number;
  precipIntensityMaxTime: number;
  precipProbability: number;
  precipType: string;
  temperature: number;
  apparentTemperature: number;
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  apparentTemperatureHigh: number;
  apparentTemperatureHighTime: number;
  apparentTemperatureLow: number;
  apparentTemperatureLowTime: number;
  apparentTemperatureMin: number;
  apparentTemperatureMinTime: number;
  apparentTemperatureMax: number;
  apparentTemperatureMaxTime: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
}

export interface Forecast {
  latitude: number;
  longitude: number;
  timezone: string;
  currently: Weather;
  minutely: {
    summary: string,
    icon: string,
    data: Weather[],
  };
  hourly: {
    summary: string,
    icon: string,
    data: Weather[]
  };
  daily: {
    summary: string,
    icon: string,
    data: Weather[]
  };
  flags: any;
  offset: number;
}
