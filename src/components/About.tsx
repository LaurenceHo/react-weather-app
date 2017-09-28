import * as React from 'react';

export const About = () => {
	return (
		<div className='container'>
			<div className='row justify-content-md-center'>
				<div className='col-8'>
					<h1 className='text-center'>About</h1>
					<p>
						This is a weather web application using React, Redux, Typescript, Webpack2, Bootstrap4 and D3.
					</p>
					<p>
						Here are some of the libraries I used:
					</p>
					<ul>
						<li>
							<a href='https://facebook.github.io/react'>React</a>
							- A JavaScript library for building user interfaces.
						</li>
						<li>
							<a href='http://redux.js.org/'>Redux</a>
							- Redux is a predictable state container for JavaScript apps.
						</li>
						<li>
							<a href='https://webpack.js.org/concepts/'>Webpack</a>
							- Webpack is a module bundler..
						</li>
						<li>
							<a href='https://d3js.org/'>D3</a>
							- D3.js is a JavaScript library for manipulating documents based on data.
						</li>
						<li>
							<a href='http://getbootstrap.com/'>Bootstrap4</a>
							- Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development.
							.
						</li>
					</ul>
					<p>
						API:
					</p>
					<ul>
						<li>
							<a href='http://openweathermap.org'>Open Weather Map</a>
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
					</ul>
				</div>
			</div>
		</div>
	)
};