import * as moment from 'moment';

export class Utils {
  /**
   * @param {number} timestamp
   * @param {number} offset
   * @param {string} format
   * @returns {string}
   */
  static getLocalTime = (timestamp: number, offset: number, format: string): string => {
    return `${moment.unix(timestamp).utcOffset(offset).format(format)}`;
  };

  /**
   * @param {number} value
   * @param {string} units
   * @returns {string}
   */
  static getPressure = (value: number, units: string): string => {
    if (units === 'us') {
      return `${Math.round(value)} mb`;
    } else if (units === 'si') {
      return `${Math.round(value)} hPa`;
    }
  };

  /**
   * @param {number} value
   * @param {string} units
   * @returns {string}
   */
  static getTemperature = (value: number, units: string): string => {
    if (units === 'us') {
      return `${Math.round(value)} ℉`;
    } else if (units === 'si') {
      return `${Math.round(value)} ℃`;
    }
  };

  /**
   * @param {number} value
   * @param {string} units
   * @returns {string}
   */
  static getWindSpeed = (value: number, units: string): string => {
    if (units === 'us') {
      return `${Math.round(value)} mph`;
    } else if (units === 'si') {
      return `${Math.round(value * 3.6)} kph`;
    }
  };

  /**
   * @param {number} intensity
   * @param {number} chance
   * @param {string} units
   * @returns {string}
   */
  static getRain = (intensity: number, chance: number, units: string): string => {
    if (units === 'us') {
      return `${intensity.toFixed(3)} in / ${Math.round(chance * 100)} %`;
    } else if (units === 'si') {
      return `${intensity.toFixed(2)} mm / ${Math.round(chance * 100)} %`;
    }
  };

  static getDistance = (value: number, units: string): string => {
    if (units === 'us') {
      return `${Math.round(value)} mi`;
    } else if (units === 'si') {
      return `${Math.round(value)} km`;
    }
  };

  static isMobile = (): boolean => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
}
