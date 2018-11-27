import * as React from 'react';
import { Input } from 'antd';

const Search = Input.Search;

interface WeatherSearchProps {
  onSearch: any
  isDisabled: boolean
}

interface WeatherSearchState {
  location: string
}

export class WeatherSearch extends React.Component<WeatherSearchProps, WeatherSearchState> {
  state = {
    location: ''
  };
  
  handleChange = (event: any) => {
    const value = event.target.value;
    this.setState({location: value});
  };
  
  handleSubmit = () => {
    this.props.onSearch(this.state.location);
  };
  
  render() {
    return (
      <Search
        type='text'
        value={this.state.location}
        onChange={this.handleChange}
        onSearch={this.handleSubmit}
        onPressEnter={this.handleSubmit}
        placeholder='Search weather by city'
        disabled={this.props.isDisabled}
        enterButton/>
    );
  }
}
