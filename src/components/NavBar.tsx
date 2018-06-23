import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Col, Layout, Menu, Row } from 'antd';
import { fetchingData } from '../redux/actions';
import { WeatherSearch } from './WeatherSearch';

const { Header } = Layout;

interface NavBarState {
	previousLocation: string
}

class NavBar extends React.Component<any, NavBarState> {
	constructor(props: any) {
		super(props);

		this.state = { previousLocation: '' };
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleSearch(location: string) {
		if (this.state.previousLocation !== location && location) {
			this.setState({ previousLocation: location });
			this.props.fetchingData(location);
		}
	};

	render() {
		return (
			<Header className='nav-bar'>
				<Row>
					<Col xs={1} sm={1} md={1} lg={1} xl={1}>
						<img src="assets/favicon.ico" width="35" height="30" alt=""/>
					</Col>
					<Col xs={16} sm={16} md={16} lg={16} xl={17}>
						<Menu
							theme="dark"
							mode="horizontal"
							defaultSelectedKeys={['1']}
							className='nav-bar-menu'>
							<Menu.Item key="1">
								<NavLink exact activeClassName='active' to='/'>
									Weather
								</NavLink>
							</Menu.Item>
							<Menu.Item key="2">
								<NavLink activeClassName='active' to='/about'>
									About
								</NavLink>
							</Menu.Item>
							<Menu.Item key="3">
								<NavLink activeClassName='active' to='/d3_demo_app'>
									D3 Demo
								</NavLink>
							</Menu.Item>
						</Menu>
					</Col>
					<Col xs={6} sm={6} md={6} lg={6} xl={5}>
						<div>
							<WeatherSearch onSearch={this.handleSearch} isDisabled={this.props.isLoading}/>
						</div>
					</Col>
					<Col xs={1} sm={1} md={1} lg={1} xl={1} className='nav-bar-icon'>
						<Button type="primary" shape="circle" icon='github' size='large'
						        href='https://github.com/bluegray1015/reactjs-beautiful-weather'/>
					</Col>
				</Row>
			</Header>
		);
	}
}

const mapStateToProps = (state: any) => {
	return {
		filter: state.filter,
		location: state.location,
		weather: state.weather,
		forecast: state.forecast,
		timezone: state.timezone,
		isLoading: state.isLoading,
		error: state.error
	}
};

const mapDispatchToProps = (dispatch: any) => {
	return bindActionCreators({
		fetchingData
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
