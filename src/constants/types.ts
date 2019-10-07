export interface GeoCode {
  status: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Filter {
  units: 'si' | 'us';
  searchedLocation: string;
  timestamp: number;
}

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
    summary: string;
    icon: string;
    data: Weather[];
  };
  hourly: {
    summary: string;
    icon: string;
    data: Weather[];
  };
  daily: {
    summary: string;
    icon: string;
    data: Weather[];
  };
  flags: any;
  offset: number;
}

export interface NavBarState {
  location: string;
  timestamp: number;
}

export interface WeatherMapState {
  latitude: number;
  longitude: number;
  location: string;
  error: string;
  isLoading: boolean;
}

export interface ForecastState {
  isLoading: boolean;
  filter: Filter;
  location: string;
  timezone: Timezone;
  currentWeather: Weather;
  hourlyForecast: {
    summary: string;
    icon: string;
    data: Weather[];
  };
  dailyForecast: {
    summary: string;
    icon: string;
    data: Weather[];
  };
  error: string;
}

export interface RootState {
  weather: ForecastState;
}

export interface ToolTipType {
  display: boolean;
  data: {
    key: string;
    group: string;
    description?: string;
  };
  type: 'network' | 'app';
  pos?: {
    x: number;
    y: number;
  };
}
