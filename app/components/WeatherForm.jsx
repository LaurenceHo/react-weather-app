import React from 'react';
import PropTypes from 'prop-types';

export class WeatherForm extends React.Component {
	constructor (props) {
		super (props);

		this.state = {
			location: ''
		};

		this.handleChange = this.handleChange.bind (this);
		this.handleSubmit = this.handleSubmit.bind (this);
	}

	handleChange (event) {
		const value = event.target.value;

		this.setState (() => {
			return {
				location: value
			}
		})
	}

	handleSubmit (event) {
		event.preventDefault ();

		this.props.onSearch (
			this.state.location
		)
	};

	render () {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input
						type='text'
						value={this.state.location}
						onChange={this.handleChange}
						placeholder="Search weather by city"
					/>
					<button className="button expanded hollow">Get Weather</button>
				</form>
			</div>
		);
	}
}

WeatherForm.PropTypes = {
	onSearch: PropTypes.func.isRequired
};