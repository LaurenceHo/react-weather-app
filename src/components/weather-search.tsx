import Input from 'antd/es/input';
import * as React from 'react';
import { ChangeEvent } from 'react';

const Search = Input.Search;

interface WeatherSearchProps {
  onSearch: any;
  isDisabled: boolean;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = (props: WeatherSearchProps) => {
  const [location, setLocation] = React.useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setLocation(value);
  };

  const handleSubmit = () => {
    props.onSearch(location);
  };

  return (
    <Search
      type='text'
      value={location}
      onChange={handleChange}
      onSearch={handleSubmit}
      onPressEnter={handleSubmit}
      placeholder='Search weather by city'
      disabled={props.isDisabled}
      enterButton={true}
      style={{ verticalAlign: 'middle', width: '100%' }}
    />
  );
};
