import { Alert, Col, Row, Spin } from 'antd';
import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getGeocode, getWeather } from '../api';
import {
  fetchingData,
  fetchingDataFailure,
  fetchingDataSuccess,
  setAllWeatherDataIntoStore,
  setUnits
} from '../redux/actions';
import { Forecast, Timezone } from './DataModel';
import WeatherForecast from './WeatherForecast';

class WeatherMain extends React.Component<any, any> {
  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    // When user search weather by city name
    if (prevProps.filter && (this.props.filter !== prevProps.filter)) {
      this.getWeatherData(0, 0, this.props.filter);
    }
    
    if (this.props.units !== prevProps.units) {
      if (this.props.timezone.latitude && this.props.timezone.longitude) {
        this.props.fetchingData(this.props.filter);
        this.getWeatherData(this.props.timezone.latitude, this.props.timezone.longitude, this.props.filter);
      } else {
        this.props.fetchingData(this.props.filter);
        this.getWeatherData(0, 0, this.props.filter);
      }
    }
  }
  
  componentDidMount() {
    if (this.props.location.length === 0 && _.isEmpty(this.props.weather) && _.isEmpty(this.props.forecast)) {
      this.props.fetchingData('');
      // Get user's coordinates when user access the web app, it will ask user's location permission
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      const handleLocation = (location: any) => {
        getGeocode(location.coords.latitude, location.coords.longitude, '').then((geocode: any) => {
          if (geocode.status === 'OK') {
            this.props.fetchingData(geocode.address);
            this.getWeatherData(geocode.latitude, geocode.longitude, geocode.address);
          }
        }).catch(error => {
          this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
        });
      };
      
      const handleError = (error: any) => {
        this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
      };
      
      navigator.geolocation.getCurrentPosition(handleLocation, handleError, options);
    }
  }
  
  /**
   * Only be called when error occurs
   * @param {string} message
   */
  private searchByDefaultLocation(message: string) {
    this.props.fetchingDataFailure(message);
    setTimeout(this.delayFetchWeatherData.bind(this), 5000);
  }
  
  private delayFetchWeatherData() {
    this.props.fetchingData('Auckland');
    this.getWeatherData(0, 0, 'Auckland');
  }
  
  /**
   * If you set lat along with lon, then you must set city name as well, otherwise set (0, 0, city)
   * @param {number} lat
   * @param {number} lon
   * @param {string} city
   */
  private getWeatherData(lat: number, lon: number, city: string) {
    if (lat !== 0 && lon !== 0) {
      // get weather and forecast info by latitude and longitude
      getWeather(lat, lon, null, this.props.units).then((results: Forecast) => {
        const timezone: Timezone = {
          timezone: results.timezone,
          offset: results.offset,
          latitude: results.latitude,
          longitude: results.longitude
        };
        const forecast = {
          minutely: results.minutely,
          hourly: results.hourly,
          daily: results.daily
        };
        
        this.setDataToStore(city, results.currently, timezone, forecast);
      }).catch(error => {
        this.props.fetchingDataFailure(error);
      });
    } else {
      // Get coordinates by city at first, after that get the weather and forecast info by coordinates
      getGeocode(null, null, city).then((geocode: any) => {
        if (geocode.status === 'OK') {
          this.getWeatherData(geocode.latitude, geocode.longitude, geocode.city);
        }
      }).catch(error => {
        this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
      });
    }
  }
  
  /**
   * @param {string} city name
   * @param weather, the current weather info from the fetched weather result
   * @param timezone, the timezone info from the fetched weather result
   * @param forecast, the forecast info from the fetched weather result, which is including minutely, hourly and daily info
   */
  private setDataToStore(city: string, weather: any, timezone: any, forecast: any) {
    this.props.fetchingDataSuccess();
    this.props.setAllWeatherDataIntoStore({
      units: this.props.units,
      filter: this.props.filter,
      location: city,
      weather: weather,
      timezone: timezone,
      forecast: forecast,
      isLoading: false
    });
  }
  
  render() {
    const {weather, location, isLoading, error} = this.props;
    
    const renderWeatherAndForecast = () => {
      if (error) {
        return (
          <div>
            <Row type="flex" justify="center" className='fetching-weather-content'>
              <Col xs={24} sm={24} md={18} lg={16} xl={16}>
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                />
              </Col>
            </Row>
          </div>
        );
      } else if (weather && location) {
        return (<WeatherForecast/>);
      }
    };
    
    return (
      <div>
        {isLoading ?
          <Row type="flex" justify="center" className='fetching-weather-content'>
            <h2>Fetching weather</h2>
            <Spin className='fetching-weather-spinner' size="large"/>
          </Row>
          : renderWeatherAndForecast()}
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

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    setUnits,
    fetchingData,
    fetchingDataSuccess,
    fetchingDataFailure,
    setAllWeatherDataIntoStore
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(WeatherMain);
