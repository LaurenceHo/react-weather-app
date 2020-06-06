import * as React from 'react';
import * as Condition from '../../constants/weather-condition';

interface WeatherIconProps {
  icon: string;
  size?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, size }: WeatherIconProps) => {
  const defaultSize = !size ? '1rem' : size;

  const renderIcon = () => {
    if (icon === Condition.CLEAR_DAY) {
      return <i className='wi wi-day-sunny' />;
    } else if (icon === Condition.CLEAR_NIGHT) {
      return <i className='wi wi-night-clear' />;
    } else if (icon === Condition.RAIN) {
      return <i className='wi wi-rain' />;
    } else if (icon === Condition.SNOW) {
      return <i className='wi wi-snow' />;
    } else if (icon === Condition.SLEET) {
      return <i className='wi wi-sleet' />;
    } else if (icon === Condition.WIND) {
      return <i className='wi wi-windy' />;
    } else if (icon === Condition.FOG) {
      return <i className='wi wi-fog' />;
    } else if (icon === Condition.CLOUDY) {
      return <i className='wi wi-cloudy' />;
    } else if (icon === Condition.PARTLY_CLOUDY_DAY) {
      return <i className='wi wi-day-cloudy' />;
    } else if (icon === Condition.PARTLY_CLOUDY_NIGHT) {
      return <i className='wi wi-night-alt-cloudy' />;
    } else {
      return null;
    }
  };

  return <span style={{ fontSize: defaultSize }}>{renderIcon()}</span>;
};
