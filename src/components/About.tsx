import * as React from 'react';
import { Col, Row } from 'antd';

export const About = () =>
	<div style={{paddingTop: 20}}>
		<Row type="flex" justify="center">
			<Col span={12}>
				<h1 className='text-center'>About</h1>
				<p>
					This is an open source weather web application using React, Redux, Typescript, Webpack4, Ant Design and D3v5.
				</p>
				<p>
					Source code:
					<a href="https://github.com/bluegray1015/reactjs-beautiful-weather">GitHub</a> and
					<a href="https://bitbucket.org/LaurenceHo/reactjs-beautiful-weather">BitBucket</a>
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
						- Webpack is a module bundler.
					</li>
					<li>
						<a href='http://beta.ant.design/'>Ant Design of React</a>
						- A design system with values of Nature and Determinacy for better user experience of enterprise
						applications.
					</li>
					<li>
						<a href='https://d3js.org/'>D3</a>
						- D3.js is a JavaScript library for manipulating documents based on data.
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
			</Col>
		</Row>
	</div>;