import * as React from 'react';

interface MoonIconProps {
  moonPhase: number;
  latitude: number;
}

export class MoonIcon extends React.Component<MoonIconProps, any> {
  render() {
    const moonPhase = Math.round((this.props.moonPhase * 100) / 3.57);
    if (this.props.latitude > 0) {
      if (Math.floor(moonPhase / 7) === 0) {
        if (moonPhase === 0) {
          return <i className='wi wi-moon-alt-new' />;
        } else {
          const className = `wi wi-moon-alt-waxing-crescent-${moonPhase % 7}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhase / 7) === 1) {
        if (moonPhase === 7) {
          return <i className='wi wi-moon-alt-first-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waxing-gibbous-${moonPhase % 7}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhase / 7) === 2) {
        if (moonPhase === 14) {
          return <i className='wi wi-moon-alt-full' />;
        } else {
          const className = `wi wi-moon-alt-waning-gibbous-${moonPhase % 7}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhase / 7) === 3) {
        if (moonPhase === 21) {
          return <i className='wi wi-moon-alt-third-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waning-crescent-${moonPhase % 7}`;
          return <i className={className} />;
        }
      } else if (moonPhase / 7 === 4) {
        return <i className='wi wi-moon-alt-new' />;
      }
    } else {
      if (Math.floor(moonPhase / 7) === 0) {
        if (moonPhase === 0) {
          return <i className='wi wi-moon-alt-new' />;
        } else {
          const className = `wi wi-moon-alt-waning-crescent-${7 - (moonPhase % 7)}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhase / 7) === 1) {
        if (moonPhase === 7) {
          return <i className='wi wi-moon-alt-third-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waning-gibbous-${7 - (moonPhase % 7)}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhase / 7) === 2) {
        if (moonPhase === 14) {
          return <i className='wi wi-moon-alt-full' />;
        } else {
          const className = `wi wi-moon-alt-waxing-gibbous-${7 - (moonPhase % 7)}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhase / 7) === 3) {
        if (moonPhase === 21) {
          return <i className='wi wi-moon-alt-first-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waxing-crescent-${7 - (moonPhase % 7)}`;
          return <i className={className} />;
        }
      } else if (moonPhase / 7 === 4) {
        return <i className='wi wi-moon-alt-new' />;
      }
    }
    return null;
  }
}
