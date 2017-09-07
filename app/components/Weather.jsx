import React from 'react';
import { WeatherMessage } from './WeatherMessage';
import { WeatherForm } from './WeatherForm';
import { getTemp } from '../api/openWeatherMap';

export class Weather extends React.Component {
	constructor (props) {
		super (props);

		this.state = {
			isLoading: false
		};

		this.handleSearch = this.handleSearch.bind (this);
	}

	handleSearch (location) {
		this.setState ({
			isLoading: true,
			location: undefined,
			temp: undefined
		});

		getTemp (location).then ((temp) => {
			this.setState ({
				location: location,
				temp: temp,
				isLoading: false
			});
		}, (errorMessage) => {
			this.setState ({ isLoading: false });
			alert (errorMessage);
		});
	}

	render () {
		const renderMessage = () => {
			if ( this.state.isLoading ) {
				return <h3 className="text-center">Fetching weather...</h3>;
			} else if ( this.state.temp && this.state.location ) {
				return <WeatherMessage temp={this.state.temp} location={this.state.location}/>;
			}
		};

		return (
			<div>
				<h1 className="text-center">Get Weather</h1>
				<WeatherForm onSearch={this.handleSearch}/>
				{renderMessage ()}
			</div>
		)
	}
}