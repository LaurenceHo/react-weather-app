import * as React from 'react';

interface WeatherFormProps {
	onSearch: any
	isDisabled: boolean
}

interface WeatherFormState {
	location: string
}

export class WeatherForm extends React.Component<WeatherFormProps, WeatherFormState> {
	constructor(props: WeatherFormProps) {
		super(props);

		this.state = {
			location: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event: any) {
		const value = event.target.value;

		this.setState({location: value});
	}

	handleSubmit(event: any) {
		event.preventDefault();

		this.props.onSearch(this.state.location);
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit} className="form-inline my-2 my-lg-0">
				<input
					type='text'
					value={this.state.location}
					onChange={this.handleChange}
					placeholder='Search weather by city'
					className="form-control mr-sm-2"
					required
					disabled={this.props.isDisabled}
				/>
				<button className='btn btn-outline-primary my-2 my-sm-0'>Search</button>
			</form>
		);
	}
}