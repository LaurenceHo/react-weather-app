import Col from 'antd/es/col';
import Row from 'antd/es/row';
import * as React from 'react';

export const About: React.FC = () => (
  <Row justify='center' className='about-content'>
    <Col xs={23} sm={20} md={16} lg={14} xl={14} xxl={14}>
      <h1 className='text-center'>About</h1>
      <p>
        This is an open source weather web application using React, Redux, Typescript, Webpack4, Ant Design and D3v5.
      </p>
      <p>
        Source code:
        <a href='https://github.com/LaurenceHo/react-weather-app' target='_blank' rel='noopener noreferrer'>
          GitHub
        </a>{' '}
        and
        <a href='https://bitbucket.org/LaurenceHo/react-weather-app' target='_blank' rel='noopener noreferrer'>
          BitBucket
        </a>
      </p>
      <p>Here are most important libraries (dependencies) I used:</p>
      <ul>
        <li>
          <a href='https://facebook.github.io/react' target='_blank' rel='noopener noreferrer'>
            React
          </a>
          - A JavaScript library for building user interfaces.
        </li>
        <li>
          <a href='http://redux.js.org/' target='_blank' rel='noopener noreferrer'>
            Redux
          </a>
          - Redux is a predictable state container for JavaScript apps.
        </li>
        <li>
          <a href='https://webpack.js.org/concepts/' target='_blank' rel='noopener noreferrer'>
            Webpack
          </a>
          - Webpack is a module bundler.
        </li>
        <li>
          <a href='https://ant.design/docs/react/introduce' target='_blank' rel='noopener noreferrer'>
            Ant Design of React
          </a>
          - A design system with values of Nature and Determinacy for better user experience of enterprise applications.
        </li>
        <li>
          <a href='https://d3js.org/' target='_blank' rel='noopener noreferrer'>
            D3
          </a>
          - D3.js is a JavaScript library for manipulating documents based on data.
        </li>
        <li>
          <a href='https://www.echartsjs.com/en/index.html' target='_blank' rel='noopener noreferrer'>
            ECharts
          </a>
          - ECharts is a free, powerful charting and visualization Javascript library offering an easy way of adding
          intuitive, interactive, and highly customizable charts to your products.
        </li>
        <li>
          <a href='https://www.mapbox.com/' target='_blank' rel='noopener noreferrer'>
            Mapbox
          </a>
          - Mapbox is the location data platform for mobile and web applications.
        </li>
        <li>
          <a href='https://erikflowers.github.io/weather-icons/' target='_blank' rel='noopener noreferrer'>
            Weather Icon
          </a>
          - Weather Icons is the only icon font and CSS with 222 weather themed icons, ready to be dropped right into
          Bootstrap, or any project that needs high quality weather, maritime, and meteorological based icons.
        </li>
      </ul>
      <p>API:</p>
      <ul>
        <li>
          <a href='https://darksky.net/dev/docs' target='_blank' rel='noopener noreferrer'>
            Dark Sky
          </a>
        </li>
        <li>
          <a href='https://api4.windy.com/' target='_blank' rel='noopener noreferrer'>
            Windy
          </a>
          - Windy API v4, also known as as Windy Leaflet Plugin, is simple to use javascript API based on Leaflet and
          technology, that powers Windy.com.
        </li>
        <li>
          <a
            href='https://developers.google.com/maps/documentation/geocoding/start'
            target='_blank'
            rel='noopener noreferrer'>
            Google Maps Geocoding API
          </a>
        </li>
      </ul>
    </Col>
  </Row>
);
