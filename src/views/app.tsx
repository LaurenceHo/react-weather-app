import Layout from 'antd/lib/layout';
import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar } from '../components/nav-bar';
import { D3DemoApp } from '../d3-demo/d3-demo-app';
import { D3DemoNetwork } from '../d3-demo/d3-demo-network';
import store, { history } from '../store';
import { About } from './about';
import { WeatherMain } from './weather-main';
import WeatherMap from './weather-map';

const { Footer, Content } = Layout;

export const App: React.FC<any> = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Router>
          <div>
            <NavBar />
            <Content className='content'>
              <Switch>
                <Route exact={true} path='/' component={WeatherMain} />
                <Route path='/map' component={WeatherMap} />
                <Route path='/about' component={About} />
                <Route path='/d3_demo_app' component={D3DemoApp} />
                <Route path='/d3_demo_network' component={D3DemoNetwork} />
                <Route render={() => <div>Page not found!</div>} />
              </Switch>
            </Content>
            <Footer className='footer'>©2019 Developed by Laurence Ho, v3.4.0</Footer>
          </div>
        </Router>
      </ConnectedRouter>
    </Provider>
  );
};
