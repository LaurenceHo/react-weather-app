import * as React from 'react';

interface MoonIconProps {
  moonPhase: number;
  latitude: number;
  size: string;
}

export const MoonIcon: React.FC<MoonIconProps> = ({ moonPhase, latitude, size }: MoonIconProps) => {
  const moonPhaseCalculated = Math.round((moonPhase * 100) / 3.57);

  const renderMoonIcon = () => {
    if (latitude > 0) {
      if (Math.floor(moonPhaseCalculated / 7) === 0) {
        if (moonPhaseCalculated === 0) {
          return <i className='wi wi-moon-alt-new' />;
        } else {
          const className = `wi wi-moon-alt-waxing-crescent-${moonPhaseCalculated % 7}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhaseCalculated / 7) === 1) {
        if (moonPhaseCalculated === 7) {
          return <i className='wi wi-moon-alt-first-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waxing-gibbous-${moonPhaseCalculated % 7}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhaseCalculated / 7) === 2) {
        if (moonPhaseCalculated === 14) {
          return <i className='wi wi-moon-alt-full' />;
        } else {
          const className = `wi wi-moon-alt-waning-gibbous-${moonPhaseCalculated % 7}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhaseCalculated / 7) === 3) {
        if (moonPhaseCalculated === 21) {
          return <i className='wi wi-moon-alt-third-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waning-crescent-${moonPhaseCalculated % 7}`;
          return <i className={className} />;
        }
      } else if (moonPhaseCalculated / 7 === 4) {
        return <i className='wi wi-moon-alt-new' />;
      }
    } else {
      if (Math.floor(moonPhaseCalculated / 7) === 0) {
        if (moonPhaseCalculated === 0) {
          return <i className='wi wi-moon-alt-new' />;
        } else {
          const className = `wi wi-moon-alt-waning-crescent-${7 - (moonPhaseCalculated % 7)}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhaseCalculated / 7) === 1) {
        if (moonPhaseCalculated === 7) {
          return <i className='wi wi-moon-alt-third-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waning-gibbous-${7 - (moonPhaseCalculated % 7)}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhaseCalculated / 7) === 2) {
        if (moonPhaseCalculated === 14) {
          return <i className='wi wi-moon-alt-full' />;
        } else {
          const className = `wi wi-moon-alt-waxing-gibbous-${7 - (moonPhaseCalculated % 7)}`;
          return <i className={className} />;
        }
      } else if (Math.floor(moonPhaseCalculated / 7) === 3) {
        if (moonPhaseCalculated === 21) {
          return <i className='wi wi-moon-alt-first-quarter' />;
        } else {
          const className = `wi wi-moon-alt-waxing-crescent-${7 - (moonPhaseCalculated % 7)}`;
          return <i className={className} />;
        }
      } else if (moonPhaseCalculated / 7 === 4) {
        return <i className='wi wi-moon-alt-new' />;
      }
    }
  };

  return <div style={{ fontSize: size }}>{renderMoonIcon()}</div>;
};
