import { Button, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { fetchingData, setUnits } from '../redux/actions';
import { WeatherSearch } from './WeatherSearch';

const {Header} = Layout;

interface NavBarState {
  previousLocation: string;
}

class NavBar extends React.Component<any, NavBarState> {
  state = {
    previousLocation: ''
  };
  
  handleSearch = (location: string) => {
    if (this.state.previousLocation.toLowerCase() !== location.toLowerCase() && location) {
      this.setState({previousLocation: location});
      this.props.fetchingData(location);
    }
  }
  
  handleMenuClick = (e: ClickParam) => {
    this.props.setUnits(e.key);
  }
  
  render() {
    const menu = (
      <Menu
        onClick={this.handleMenuClick}
        defaultSelectedKeys={[ this.props.units ]}
        selectedKeys={[ this.props.units ]}
      >
        <Menu.Item key='us'>℉,mph</Menu.Item>
        <Menu.Item key='si'>℃,kph</Menu.Item>
      </Menu>
    );
    
    return (
      <Header className='nav-bar'>
        <Row>
          <Col xs={1} sm={1} md={1} lg={1} xl={1}>
            <img src='assets/favicon.ico' width='35' height='30' alt=''/>
          </Col>
          <Col xs={14} sm={14} md={14} lg={14} xl={15}>
            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={[ '1' ]}
              className='nav-bar-menu'>
              <Menu.Item key='1'>
                <NavLink exact={true} activeClassName='active' to='/'>
                  Weather
                </NavLink>
              </Menu.Item>
              <Menu.Item key='2'>
                <NavLink activeClassName='active' to='/about'>
                  About
                </NavLink>
              </Menu.Item>
              <Menu.Item key='3'>
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
          <Col xs={2} sm={2} md={2} lg={2} xl={2}>
            <Dropdown overlay={menu} trigger={[ 'click' ]} disabled={this.props.isLoading}>
              <Button className='units-dropdown'>Units<Icon type='down'/></Button>
            </Dropdown>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} className='nav-bar-icon'>
            <Button
              type='primary'
              shape='circle'
              icon='github'
              size='large'
              href='https://github.com/LaurenceHo/reactjs-beautiful-weather'
            />
          </Col>
        </Row>
      </Header>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    units: state.units,
    filter: state.filter,
    location: state.location,
    weather: state.weather,
    forecast: state.forecast,
    timezone: state.timezone,
    isLoading: state.isLoading,
    error: state.error
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    setUnits,
    fetchingData
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
