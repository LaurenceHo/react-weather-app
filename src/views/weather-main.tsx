import Alert from 'antd/lib/alert';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Spin from 'antd/lib/spin';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getGeocode } from '../api';
import { CurrentWeather } from '../components/current-weather';
import { DailyForecast } from '../components/daily-forecast';
import { HourlyForecast } from '../components/hourly-forecast';
import { USE_DEFAULT_LOCATION } from '../constants/message';
import { RootState } from '../constants/types';
import { fetchingData, fetchingDataFailure, getWeatherData } from '../store/actions';

class WeatherMain extends React.Component<any, any> {
  componentDidUpdate(prevProps: any) {
    // When user search weather by city name
    if (this.props.filter.location !== prevProps.filter.location) {
      this.props.getWeatherData(0, 0, this.props.filter.location);
    }

    // When user change units
    if (this.props.filter.units !== prevProps.filter.units) {
      if (this.props.timezone.latitude && this.props.timezone.longitude) {
        this.props.getWeatherData(this.props.timezone.latitude, this.props.timezone.longitude, this.props.location);
      } else {
        this.props.getWeatherData(0, 0, this.props.location);
      }
    }

    // When user search weather by particular time
    if (this.props.filter.timestamp !== prevProps.filter.timestamp) {
      this.props.getWeatherData(this.props.timezone.latitude, this.props.timezone.longitude, this.props.location);
    }
  }

  componentDidMount() {
    if (isEmpty(this.props.location) && isEmpty(this.props.currentWeather) && isEmpty(this.props.forecast)) {
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
              this.props.getWeatherData(geocode.latitude, geocode.longitude, geocode.address);
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
    const { currentWeather, location, isLoading, error } = this.props;

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
      } else if (currentWeather && location) {
        return (
          <div>
            <CurrentWeather
              location={this.props.location}
              filter={this.props.filter}
              timezone={this.props.timezone}
              currentWeather={this.props.currentWeather}
            />
            <HourlyForecast
              filter={this.props.filter}
              timezone={this.props.timezone}
              hourlyForecast={this.props.hourlyForecast}
            />
            <DailyForecast
              filter={this.props.filter}
              timezone={this.props.timezone}
              dailyForecast={this.props.dailyForecast}
            />
          </div>
        );
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
      this.props.getWeatherData(-36.8484597, 174.7633315, 'Auckland');
    }, 5000);
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.weather.isLoading,
    filter: state.weather.filter,
    location: state.weather.location,
    timezone: state.weather.timezone,
    currentWeather: state.weather.currentWeather,
    hourlyForecast: state.weather.hourlyForecast,
    dailyForecast: state.weather.dailyForecast,
    error: state.weather.error,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getWeatherData,
      fetchingData,
      fetchingDataFailure,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeatherMain);
