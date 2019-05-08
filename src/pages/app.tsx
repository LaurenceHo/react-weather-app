import Layout from 'antd/lib/layout';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { About } from './about';
import { D3DemoApp } from '../components/d3-demo/d3-demo-app';
import { D3DemoNetwork } from '../components/d3-demo/d3-demo-network';
import NavBar from '../components/nav-bar';
import Weather from './weather-main';

const { Footer, Content } = Layout;

export class App extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Content className='content'>
            <Switch>
              <Route exact={true} path='/' component={Weather as any} />
              <Route path='/about' component={About as any} />
              <Route path='/d3_demo_app' component={D3DemoApp as any} />
              <Route path='/d3_demo_network' component={D3DemoNetwork as any} />
            </Switch>
          </Content>
          <Footer className='footer'>©2019 Developed by Laurence Ho, v1.1.1</Footer>
        </div>
      </Router>
    );
  }
}
