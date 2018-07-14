import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Weather from './WeatherMain';
import NavBar from './NavBar';
import { About } from './About';
import { D3DemoApp } from './demo/D3DemoApp';
import { D3DemoNetwork } from './demo/D3DemoNetwork';

const { Footer, Content } = Layout;

export class App extends React.Component<any, any> {
	render() {
		return (
			<Router>
				<div>
					<NavBar/>
					<Content className='content'>
						<Switch>
							<Route exact path='/' component={Weather as any}/>
							<Route path='/about' component={About as any}/>
							<Route path='/d3_demo_app' component={D3DemoApp as any}/>
							<Route path='/d3_demo_network' component={D3DemoNetwork as any}/>
							<Route render={() => {
								return <p> Not found!!</p>
							}}/>
						</Switch>
					</Content>
					<Footer className='footer'>
						©2018 Developed by Laurence Ho, v1.0.2
					</Footer>
				</div>
			</Router>
		);
	}
}
