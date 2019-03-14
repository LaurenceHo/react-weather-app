import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import DatePicker from 'antd/lib/date-picker';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Row from 'antd/lib/row';
import Select from 'antd/lib/select';
import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { fetchingData, setTimestamp, setUnits } from '../redux/actions';
import { WeatherSearch } from './weather-search';

const Option = Select.Option;
const {Header} = Layout;

interface NavBarState {
  previousLocation: string;
}

class NavBar extends React.Component<any, NavBarState> {
  state = {
    previousLocation: ''
  };
  
  datePickerOnChange = (date: moment.Moment) => {
    this.props.setTimestamp(date.format('X'));
  }
  
  handleSearch = (location: string) => {
    if (this.state.previousLocation.toLowerCase() !== location.toLowerCase() && location) {
      this.setState({previousLocation: location});
      this.props.fetchingData(location);
    }
  }
  
  handleUnitsChange = (value: any) => {
    this.props.setUnits(value);
  }
  
  render() {
    return (
      <Header className='nav-bar'>
        <Row>
          <Col span={1}>
            <img src='assets/favicon.ico' width='35' height='30' alt=''/>
          </Col>
          <Col xs={10} sm={10} md={10} lg={10} xl={11} xxl={14}>
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
          <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={2}>
            <DatePicker
              onChange={this.datePickerOnChange}
              disabled={this.props.isLoading}
              style={{verticalAlign: 'middle'}}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={5}>
            <div style={{padding: '0 0.5rem'}}>
              <WeatherSearch onSearch={this.handleSearch} isDisabled={this.props.isLoading}/>
            </div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1}>
            <Select
              defaultValue='si'
              onChange={this.handleUnitsChange}
              disabled={this.props.isLoading}
              style={{verticalAlign: 'middle'}}
            >
              <Option value='si'>℃, kph</Option>
              <Option value='us'>℉, mph</Option>
            </Select>
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
