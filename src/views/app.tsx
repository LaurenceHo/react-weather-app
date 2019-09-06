import Layout from 'antd/lib/layout';
import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { D3DemoApp } from '../d3-demo/d3-demo-app';
import { D3DemoNetwork } from '../d3-demo/d3-demo-network';
import NavBar from '../components/nav-bar';
import store, { history } from '../store';
import { About } from './about';
import Weather from './weather-main';
import WeatherMap from './weather-map';

const { Footer, Content } = Layout;

export class App extends React.Component<any, any> {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router>
            <div>
              <NavBar />
              <Content className='content'>
                <Switch>
                  <Route exact={true} path='/' component={Weather as any} />
                  <Route path='/map' component={WeatherMap as any} />
                  <Route path='/about' component={About as any} />
                  <Route path='/d3_demo_app' component={D3DemoApp as any} />
                  <Route path='/d3_demo_network' component={D3DemoNetwork as any} />
                  <Route render={() => <div>Page not found!</div>} />
                </Switch>
              </Content>
              <Footer className='footer'>©2019 Developed by Laurence Ho, v3.3.4</Footer>
            </div>
          </Router>
        </ConnectedRouter>
      </Provider>
    );
  }
}
