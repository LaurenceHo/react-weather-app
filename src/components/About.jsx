import React from 'react';

export const About = () => {
	return (
		<div className="row">
			<div className="columns medium-8 large-6 medium-centered">
				<h1 className="text-center">About</h1>
				<p>
					This is a weather web application using React, Webpack2, Babel, ES2015, foundation and D3.
				</p>
				<p>
					Here are some of the tools I used:
				</p>
				<ul>
					<li>
						<a href="https://facebook.github.io/react">React</a>
						- This was the JavaScript library used.
					</li>
					<li>
						<a href="http://openweathermap.org">Open Weather Map</a>
						- I used Open Weather Map to search for weather data by city name.
					</li>
					<li>
						<a href='https://developers.google.com/maps/documentation/geocoding/start'>Google Maps Geocoding API</a>
						- I used this API to search user's location based on latitude and longitude.
					</li>
					<li>
						<a href='https://developers.google.com/maps/documentation/timezone/start'>Google Maps Time Zone API</a>
						- I used this API to get the time zone based on location.
					</li>
					<li>
						<a href='https://d3js.org/'>D3</a>
						- I used this Javascript library to render the chart.
					</li>
				</ul>
			</div>
		</div>
	)
};