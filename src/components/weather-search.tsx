import Input from 'antd/lib/input';
import * as React from 'react';
import { ChangeEvent } from 'react';

const Search = Input.Search;

interface WeatherSearchProps {
  onSearch: any;
  isDisabled: boolean;
}

interface WeatherSearchState {
  location: string;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = (props: WeatherSearchProps) => {
  const [location, setLocation] = React.useState<WeatherSearchState | null>({ location: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setLocation({ location: value });
  };

  const handleSubmit = () => {
    props.onSearch(location.location);
  };

  return (
    <Search
      type='text'
      value={location.location}
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
