import Layout from 'antd/es/layout';
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NavBar } from '../components/nav-bar';
import { Covid19 } from '../covid-19/covid-19';
import { D3DemoApp } from '../d3-demo/d3-demo-app';
import { D3DemoNetwork } from '../d3-demo/d3-demo-network';
import { About } from './about';
import { WeatherMain } from './weather-main';
import { WeatherMap } from './weather-map';

const { Footer, Content } = Layout;

export const App: React.FC<any> = () => {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Content className='content'>
          <Routes>
            <Route path='/' element={<WeatherMain />} />
            <Route path='/map' element={<WeatherMap />} />
            <Route path='/about' element={<About />} />
            <Route path='/d3_demo_app' element={<D3DemoApp />} />
            <Route path='/d3_demo_network' element={<D3DemoNetwork />} />
            <Route path='/covid-19' element={<Covid19 />} />
            <Route
              path='*'
              element={
                <div className='not-found-content'>
                  <h1>Whoops...Page not found!</h1>
                </div>
              }
            />
          </Routes>
          <Footer className='footer'>©2022 Developed by Laurence Ho, v3.6.3</Footer>
        </Content>
      </div>
    </BrowserRouter>
  );
};
