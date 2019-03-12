import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import Layout from 'antd/lib/layout';
import Menu, { ClickParam } from 'antd/lib/menu';
import Row from 'antd/lib/row';
import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { fetchingData, setTimestamp, setUnits } from '../redux/actions';
import { WeatherSearch } from './weather-search';

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
          <Col span={1}>
            <img src='assets/favicon.ico' width='35' height='30' alt=''/>
          </Col>
          <Col xs={13} sm={13} md={13} lg={13} xl={14} xxl={16}>
            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={[ '1' ]}
              className='nav-bar-menu'
            >
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
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={5}>
            <div>
              <WeatherSearch onSearch={this.handleSearch} isDisabled={this.props.isLoading}/>
            </div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1}>
            <Dropdown overlay={menu} trigger={[ 'click' ]} disabled={this.props.isLoading}>
              <Button className='units-dropdown'>Units<Icon type='down'/></Button>
            </Dropdown>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={1} xxl={1} className='nav-bar-icon'>
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
    isLoading: state.isLoading,
    units: state.units,
    location: state.location,
    timestamp: state.timestamp
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    setUnits,
    setTimestamp,
    fetchingData
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
