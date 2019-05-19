import { isUndefined } from 'lodash';

import * as React from 'react';
import { connect } from 'react-redux';
import { getGeocode } from '../api';
import { USE_DEFAULT_LOCATION } from '../constants/message';

interface WeatherMapState {
  latitude: number;
  longitude: number;
  location: string;
  error: string;
  isLoading: boolean;
}

class WeatherMap extends React.Component<any, WeatherMapState> {
  state = {
    latitude: 0,
    longitude: 0,
    location: '',
    isLoading: false,
    error: '',
  };

  componentDidUpdate(prevProps: any) {
    if (this.props.filter.location !== prevProps.filter.location) {
      this.setState({ isLoading: true });
      this.fetchLatitudeAndLongitude(0, 0, this.props.filter.location);
    }
  }

  componentDidMount() {
    const { latitude, longitude } = this.props.timezone;

    if (isUndefined(latitude) || isUndefined(longitude)) {
      this.setState({ isLoading: true });
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
              this.setState({
                latitude: geocode.latitude,
                longitude: geocode.longitude,
                location: geocode.address,
                isLoading: false,
              });
            }
          })
          .catch(error => this.searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`));
      };

      const handleError = (error: any) => this.searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`);

      navigator.geolocation.getCurrentPosition(handleLocation, handleError, options);
    } else {
      this.setState({ latitude, longitude, location: this.props.location });
    }
    this.renderMap();
  }

  renderMap = () => {
    try {
      const weatherMap = document.getElementById('windy');
      weatherMap.parentNode.removeChild(weatherMap);
    } catch (err) {
      console.log('blahblah');
    }

    const options = {
      key: 'bynRmoQDuOR2i4CdtU3NqafiejxcTFbn',
      verbose: false,
      lat: this.state.latitude,
      lon: this.state.longitude,
      zoom: 5,
    };

    const divElement: HTMLDivElement = document.createElement('div');
    divElement.setAttribute('id', 'windy');
    divElement.setAttribute('class', 'windy');
    document.getElementById('weather-map-wrapper').appendChild(divElement);

    windyInit(options, (windyAPI: any) => {
      const { map } = windyAPI;
      L.popup()
        .setLatLng([this.state.latitude, this.state.longitude])
        .setContent(this.state.location)
        .openOn(map);
    });
  };

  private fetchLatitudeAndLongitude(lat: number, lon: number, city: string) {
    if (lat !== 0 && lon !== 0) {
      this.setState({
        latitude: lat,
        longitude: lon,
        location: city,
        isLoading: false,
        error: '',
      });
    } else {
      getGeocode(null, null, city)
        .then((geocode: any) => {
          if (geocode.status === 'OK') {
            this.setState({
              latitude: geocode.latitude,
              longitude: geocode.longitude,
              location: city,
              isLoading: false,
              error: '',
            });
            this.renderMap();
          }
        })
        .catch(error => this.setState({ error }));
    }
  }

  /**
   * Only be called when error occurs
   * @param {string} message
   */
  private searchByDefaultLocation(message: string) {
    this.setState({ error: message });
    setTimeout(() => {
      this.setState({ isLoading: true });
      this.fetchLatitudeAndLongitude(-36.8484597, 174.7633315, 'Auckland');
    }, 5000);
  }

  render() {
    return <div id='weather-map-wrapper' />;
  }
}

const mapStateToProps = (state: any) => {
  return {
    filter: state.weather.filter,
    location: state.weather.location,
    timezone: state.weather.timezone,
  };
};

export default connect(
  mapStateToProps,
  {}
)(WeatherMap);
