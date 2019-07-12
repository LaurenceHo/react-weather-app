import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import DatePicker from 'antd/lib/date-picker';
import Icon from 'antd/lib/icon';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Popover from 'antd/lib/popover';
import Row from 'antd/lib/row';
import Select from 'antd/lib/select';

import { push } from 'connected-react-router';
import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import store from '../store';
import { setFilter } from '../store/actions';
import { Utils } from '../utils';
import { WeatherSearch } from './weather-search';

const Option = Select.Option;
const { Header } = Layout;

interface NavBarState {
  location: string;
  timestamp: number;
}

class NavBar extends React.Component<any, NavBarState> {
  state = {
    location: '',
    timestamp: 0,
  };

  datePickerOnChange = (date: moment.Moment, dateString: string) => {
    let timestamp = Number(moment(dateString, 'YYYY-MM-DD').format('X'));
    if (this.state.timestamp !== timestamp) {
      const today = moment().format('YYYY-MM-DD');
      timestamp = dateString === today ? 0 : timestamp;

      this.setState({ timestamp });
      this.props.setFilter({ ...this.props.filter, timestamp });
    }
  };

  handleSearch = (location: string) => {
    if (this.state.location.toLowerCase() !== location.toLowerCase() && location) {
      this.setState({ location });
      this.props.setFilter({ ...this.props.filter, location });
    }
  };

  handleUnitsChange = (units: any) => {
    this.props.setFilter({ ...this.props.filter, units });
  };

  render() {
    let path = this.props.path.substring(1) === '' ? 'weather' : this.props.path.substring(1);

    const weatherLink = (
      <Link
        to='/'
        onClick={() => {
          store.dispatch(push('/'));
        }}>
        Weather
      </Link>
    );

    const aboutLink = (
      <Link
        to='/about'
        onClick={() => {
          store.dispatch(push('/about'));
        }}>
        About
      </Link>
    );

    const weatherMapLink = (
      <Link
        to='/map'
        onClick={() => {
          store.dispatch(push('/map'));
        }}>
        Map
      </Link>
    );

    const datePicker = (
      <DatePicker
        defaultValue={moment()}
        onChange={this.datePickerOnChange}
        disabled={this.props.isLoading || path !== 'weather'}
        style={{ verticalAlign: 'middle', width: '100%' }}
      />
    );

    const search = (
      <WeatherSearch
        onSearch={this.handleSearch}
        isDisabled={this.props.isLoading || (path !== 'weather' && path !== 'map')}
      />
    );

    const units = (
      <Select
        defaultValue='si'
        onChange={this.handleUnitsChange}
        disabled={this.props.isLoading || path !== 'weather'}
        style={{ verticalAlign: 'middle', width: '100%' }}>
        <Option value='si'>℃, kph</Option>
        <Option value='us'>℉, mph</Option>
      </Select>
    );

    const navBar = (
      <Header className='nav-bar'>
        <Row>
          <Col span={1}>
            <img src='../assets/favicon.ico' width='33' height='30' alt='' />
          </Col>
          <Col xs={10} sm={10} md={10} lg={10} xl={11} xxl={13}>
            <Menu theme='dark' mode='horizontal' defaultSelectedKeys={[`${path}`]} className='nav-bar-menu'>
              <Menu.Item key='weather'>{weatherLink}</Menu.Item>
              <Menu.Item key='map'>{weatherMapLink}</Menu.Item>
              <Menu.Item key='about'>{aboutLink}</Menu.Item>
              <Menu.Item key='d3_demo_app'>
                <Link
                  to='/d3_demo_app'
                  onClick={() => {
                    store.dispatch(push('/d3_demo_app'));
                  }}>
                  D3 Demo
                </Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={2}>
            {datePicker}
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={5}>
            <div className='weather-search-outer'>{search}</div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
            {units}
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={1} xxl={1} className='nav-bar-icon'>
            <Button
              type='primary'
              shape='circle'
              icon='github'
              size='large'
              href='https://github.com/LaurenceHo/react-weather-app'
            />
          </Col>
        </Row>
      </Header>
    );

    const content = (
      <Menu style={{ width: '18rem' }} defaultSelectedKeys={[`${path}`]} mode='inline'>
        <Menu.Item key='weather'>{weatherLink}</Menu.Item>
        <Menu.Item key='map'>{weatherMapLink}</Menu.Item>
        <Menu.Item key='about'>{aboutLink}</Menu.Item>
        <Menu.Item key='datePicker'>{datePicker}</Menu.Item>
        <Menu.Item key='search'>{search}</Menu.Item>
        <Menu.Item key='units'>{units}</Menu.Item>
      </Menu>
    );

    const navBarMobile = (
      <Header className='nav-bar-mobile'>
        <Row type='flex' justify='center' align='middle'>
          <Col span={23}>
            <img src='../assets/favicon.ico' width='33' height='30' alt='' />
          </Col>
          <Col span={1}>
            <Popover placement='bottomRight' content={content} trigger='click'>
              <Icon type='menu' className='nav-bar-mobile-menu-icon' />
            </Popover>
          </Col>
        </Row>
      </Header>
    );
    return <div>{Utils.isMobile() ? navBarMobile : navBar}</div>;
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.weather.isLoading,
    filter: state.weather.filter,
    path: state.router.location.pathname,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      setFilter,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
