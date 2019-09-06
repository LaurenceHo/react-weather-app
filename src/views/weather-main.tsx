import Alert from 'antd/lib/alert';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Spin from 'antd/lib/spin';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getForecast, getGeocode, getWeather } from '../api';
import { USE_DEFAULT_LOCATION } from '../constants/message';
import { Forecast, Timezone, Weather } from '../constants/types';
import {
  fetchingData,
  fetchingDataFailure,
  fetchingDataSuccess,
  setDailyForecast,
  setHourlyForecast,
  setLocation,
  setTimezone,
  setWeather,
} from '../store/actions';
import { WeatherContainer } from './weather-container';

const EXCLUDE = 'flags,minutely';

class WeatherMain extends React.Component<any, any> {
  componentDidUpdate(prevProps: any) {
    // When user search weather by city name
    if (this.props.filter.location !== prevProps.filter.location) {
      this.props.fetchingData();
      this.fetchWeather(0, 0, this.props.filter.location);
    }

    // When user change units
    if (this.props.filter.units !== prevProps.filter.units) {
      if (this.props.timezone.latitude && this.props.timezone.longitude) {
        this.props.fetchingData();
        this.fetchWeather(this.props.timezone.latitude, this.props.timezone.longitude, this.props.location);
      } else {
        this.props.fetchingData();
        this.fetchWeather(0, 0, this.props.location);
      }
    }

    // When user search weather by particular time
    if (this.props.filter.timestamp !== prevProps.filter.timestamp) {
      this.props.fetchingData();
      this.fetchWeather(this.props.timezone.latitude, this.props.timezone.longitude, this.props.location);
    }
  }

  componentDidMount() {
    if (isEmpty(this.props.location) && isEmpty(this.props.weather) && isEmpty(this.props.forecast)) {
      this.props.fetchingData();
      // Get user's coordinates when user access the web app, it will ask user's location permission
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      const handleLocation = (location: any) => {
        getGeocode(location.coords.latitude, location.coords.longitude, '')
          .then((geocode: any) => {
            if (geocode.status === 'OK') {
              this.props.fetchingData();
              this.fetchWeather(geocode.latitude, geocode.longitude, geocode.address);
            }
          })
          .catch(error => this.searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`));
      };

      const handleError = (error: any) => this.searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`);
      if (process.env.NODE_ENV === 'development') {
        this.searchByDefaultLocation(USE_DEFAULT_LOCATION);
      } else {
        navigator.geolocation.getCurrentPosition(handleLocation, handleError, options);
      }
    }
  }

  render() {
    const { weather, location, isLoading, error } = this.props;

    const renderWeatherAndForecast = () => {
      if (error) {
        return (
          <div>
            <Row type='flex' justify='center' className='fetching-weather-content'>
              <Col xs={24} sm={24} md={18} lg={16} xl={16}>
                <Alert message='Error' description={error} type='error' showIcon={true} />
              </Col>
            </Row>
          </div>
        );
      } else if (weather && location) {
        return <WeatherContainer />;
      }
    };

    return (
      <div>
        {isLoading ? (
          <Row type='flex' justify='center' className='fetching-weather-content'>
            <Spin className='fetching-weather-spinner' size='large' />
            <h2>Loading...</h2>
          </Row>
        ) : (
          renderWeatherAndForecast()
        )}
      </div>
    );
  }

  /**
   * Only be called when error occurs
   * @param {string} message
   */
  private searchByDefaultLocation(message: string) {
    this.props.fetchingDataFailure(message);
    setTimeout(() => {
      this.props.fetchingData();
      this.fetchWeather(-36.8484597, 174.7633315, 'Auckland');
    }, 5000);
  }

  /**
   * If you set lat along with lon, then you must set city name as well, otherwise set (0, 0, city)
   * @param {number} lat
   * @param {number} lon
   * @param {string} city
   */
  private fetchWeather(lat: number, lon: number, city: string) {
    if (lat !== 0 && lon !== 0) {
      // get weather and forecast info by latitude and longitude
      if (this.props.filter.timestamp !== 0) {
        getForecast(lat, lon, this.props.filter.timestamp, EXCLUDE, this.props.filter.units)
          .then((results: Forecast) =>
            this.setDataToStore(
              this.props.location,
              this.props.timezone,
              results.currently,
              results.hourly,
              results.daily
            )
          )
          .catch(error => this.props.fetchingDataFailure(error));
      } else {
        getWeather(lat, lon, EXCLUDE, this.props.filter.units)
          .then((results: Forecast) => {
            const timezone: Timezone = {
              timezone: results.timezone,
              offset: results.offset,
              latitude: results.latitude,
              longitude: results.longitude,
            };

            this.setDataToStore(city, timezone, results.currently, results.hourly, results.daily);
          })
          .catch(error => this.props.fetchingDataFailure(error));
      }
    } else {
      // Get coordinates by city at first, after that get the weather and forecast info by coordinates
      getGeocode(null, null, city)
        .then((geocode: any) => {
          if (geocode.status === 'OK') {
            this.fetchWeather(geocode.latitude, geocode.longitude, geocode.city);
          }
        })
        .catch(error => this.props.fetchingDataFailure(error));
    }
  }

  /**
   * @param {string} city name
   * @param timezone, the timezone info from the fetched weather result
   * @param weather, the current weather info from the fetched weather result
   * @param hourlyForecast, the hourly forecast info from the fetched weather result
   * @param dailyForecast, the daily forecast info from the fetched weather result
   */
  private setDataToStore(city: string, timezone: Timezone, weather: Weather, hourlyForecast: any, dailyForecast: any) {
    this.props.setLocation(city);
    this.props.setTimezone(timezone);
    this.props.setWeather(weather);
    this.props.setHourlyForecast(hourlyForecast);
    this.props.setDailyForecast(dailyForecast);
    this.props.fetchingDataSuccess();
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.weather.isLoading,
    filter: state.weather.filter,
    location: state.weather.location,
    timezone: state.weather.timezone,
    weather: state.weather.weather,
    hourlyForecast: state.weather.hourlyForecast,
    dailyForecast: state.weather.dailyForecast,
    error: state.weather.error,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      fetchingData,
      fetchingDataSuccess,
      fetchingDataFailure,
      setLocation,
      setTimezone,
      setWeather,
      setHourlyForecast,
      setDailyForecast,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeatherMain);
