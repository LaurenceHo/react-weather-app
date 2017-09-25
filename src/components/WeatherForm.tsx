import * as React from 'react';

interface WeatherFormProps {
	onSearch: any
}

interface WeatherFormState {
	location: string
}

export class WeatherForm extends React.Component<WeatherFormProps, WeatherFormState> {
	constructor() {
		super();

		this.state = {
			location: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event: any) {
		const value = event.target.value;

		this.setState(() => {
			return {
				location: value
			}
		})
	}

	handleSubmit(event: any) {
		event.preventDefault();

		this.props.onSearch(
			this.state.location
		)
	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input
						type='text'
						value={this.state.location}
						onChange={this.handleChange}
						placeholder='Search weather by city'
					/>
					<button className='button expanded hollow'>Get Weather</button>
				</form>
			</div>
		);
	}
}