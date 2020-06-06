import * as React from 'react';
import * as Condition from '../../constants/weather-condition';

interface WindIconProps {
  degree: number;
  size?: string;
}

export const WindIcon: React.FC<WindIconProps> = ({ degree, size }: WindIconProps) => {
  const defaultSize = !size ? '1rem' : size;

  const windCode = Math.round(degree / 22.5);

  const windIcon = () => {
    if (windCode === Condition.WIND_N) {
      return <i className='wi wi-wind wi-towards-s' />;
    } else if (windCode === Condition.WIND_NNE) {
      return <i className='wi wi-wind wi-towards-ssw' />;
    } else if (windCode === Condition.WIND_NE) {
      return <i className='wi wi-wind wi-towards-sw' />;
    } else if (windCode === Condition.WIND_ENE) {
      return <i className='wi wi-wind wi-towards-wsw' />;
    } else if (windCode === Condition.WIND_E) {
      return <i className='wi wi-wind wi-towards-w' />;
    } else if (windCode === Condition.WIND_ESE) {
      return <i className='wi wi-wind wi-towards-wnw' />;
    } else if (windCode === Condition.WIND_SE) {
      return <i className='wi wi-wind wi-towards-nw' />;
    } else if (windCode === Condition.WIND_SSE) {
      return <i className='wi wi-wind wi-towards-nnw' />;
    } else if (windCode === Condition.WIND_S) {
      return <i className='wi wi-wind wi-towards-n' />;
    } else if (windCode === Condition.WIND_SSW) {
      return <i className='wi wi-wind wi-towards-nne' />;
    } else if (windCode === Condition.WIND_SW) {
      return <i className='wi wi-wind wi-towards-ne' />;
    } else if (windCode === Condition.WIND_WSW) {
      return <i className='wi wi-wind wi-towards-ene' />;
    } else if (windCode === Condition.WIND_W) {
      return <i className='wi wi-wind wi-towards-e' />;
    } else if (windCode === Condition.WIND_WNW) {
      return <i className='wi wi-wind wi-towards-ese' />;
    } else if (windCode === Condition.WIND_NW) {
      return <i className='wi wi-wind wi-towards-se' />;
    } else if (windCode === Condition.WIND_NNW) {
      return <i className='wi wi-wind wi-towards-sse' />;
    } else {
      return null;
    }
  };

  return <span style={{ fontSize: defaultSize }}>{windIcon()}</span>;
};
