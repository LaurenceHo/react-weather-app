import { mdiGithub, mdiMenu } from '@mdi/js';
import Icon from '@mdi/react';
import Button from 'antd/es/button';
import Col from 'antd/es/col';
import DatePicker from 'antd/es/date-picker';
import Layout from 'antd/es/layout';
import Menu from 'antd/es/menu';
import Popover from 'antd/es/popover';
import Row from 'antd/es/row';
import Select from 'antd/es/select';
import * as moment from 'moment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { NavBarState, RootState } from '../constants/types';
import { setFilter } from '../store/actions';
import { Utils } from '../utils';
import { WeatherSearch } from './weather-search';

const Option = Select.Option;
const { Header } = Layout;

export const NavBar: React.FC<any> = () => {
  const dispatch = useDispatch();
  const [navBarState, setNavBarState] = React.useState<NavBarState>({ location: '', timestamp: 0 });

  const isLoading = useSelector((state: RootState) => state.weather.isLoading);
  const filter = useSelector((state: RootState) => state.weather.filter);

  const datePickerOnChange = (date: moment.Moment, dateString: string) => {
    let timestamp = Number(moment(dateString, 'YYYY-MM-DD').format('X'));
    if (navBarState.timestamp !== timestamp) {
      const today = moment().format('YYYY-MM-DD');
      timestamp = dateString === today ? 0 : timestamp;

      setNavBarState({ ...navBarState, timestamp });
      dispatch(setFilter({ ...filter, timestamp }));
    }
  };

  const handleSearch = (location: string) => {
    if (location && navBarState.location.toLowerCase() !== location.toLowerCase()) {
      setNavBarState({ ...navBarState, location });
      dispatch(setFilter({ ...filter, searchedLocation: location }));
    }
  };

  const handleUnitsChange = (units: any) => {
    dispatch(setFilter({ ...filter, units }));
  };

  const WeatherLink = withRouter(({ history }) => (
    <Link to='/' onClick={() => history.push('/')}>
      Weather
    </Link>
  ));

  const AboutLink = withRouter(({ history }) => (
    <Link to='/about' onClick={() => history.push('/about')}>
      About
    </Link>
  ));

  const WeatherMapLink = withRouter(({ history }) => (
    <Link to='/map' onClick={() => history.push('/map')}>
      Map
    </Link>
  ));

  const MyDatePicker = withRouter(({ location }) => {
    const pathname = location.pathname;
    const urlPath = pathname.substring(1) === '' ? 'weather' : pathname.substring(1);

    return (
      <DatePicker
        defaultValue={moment()}
        onChange={datePickerOnChange}
        disabled={isLoading || urlPath !== 'weather'}
        style={{ verticalAlign: 'middle', width: '100%' }}
      />
    );
  });

  const Search = withRouter(({ location }) => {
    const pathname = location.pathname;
    const urlPath = pathname.substring(1) === '' ? 'weather' : pathname.substring(1);

    return (
      <WeatherSearch onSearch={handleSearch} isDisabled={isLoading || (urlPath !== 'weather' && urlPath !== 'map')} />
    );
  });

  const UnitOptions = withRouter(({ location }) => {
    const pathname = location.pathname;
    const urlPath = pathname.substring(1) === '' ? 'weather' : pathname.substring(1);

    return (
      <Select
        defaultValue='si'
        onChange={handleUnitsChange}
        disabled={isLoading || urlPath !== 'weather'}
        style={{ verticalAlign: 'middle', width: '100%' }}>
        <Option value='si'>℃, kph</Option>
        <Option value='us'>℉, mph</Option>
      </Select>
    );
  });

  const NavBar = withRouter(({ history, location }) => {
    const pathname = location.pathname;
    const urlPath = pathname.substring(1) === '' ? 'weather' : pathname.substring(1);

    return (
      <Header className='nav-bar'>
        <Row>
          <Col span={1}>
            <img src='../assets/favicon.ico' width='33' height='30' alt='' />
          </Col>
          <Col xs={10} sm={10} md={10} lg={10} xl={11} xxl={13}>
            <Menu theme='dark' mode='horizontal' defaultSelectedKeys={[`${urlPath}`]} className='nav-bar-menu'>
              <Menu.Item key='weather'>
                <WeatherLink />
              </Menu.Item>
              <Menu.Item key='map'>
                <WeatherMapLink />
              </Menu.Item>
              <Menu.Item key='d3_demo_app'>
                <Link to='/d3_demo_app' onClick={() => history.push('/d3_demo_app')}>
                  D3 Demo
                </Link>
              </Menu.Item>
              <Menu.Item key='covid-19'>
                <Link to='/covid-19' onClick={() => history.push('/covid-19')}>
                  Covid-19
                </Link>
              </Menu.Item>
              <Menu.Item key='about'>
                <AboutLink />
              </Menu.Item>
            </Menu>
          </Col>
          <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={2}>
            <MyDatePicker />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={5}>
            <div className='weather-search-outer'>
              <Search />
            </div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
            <UnitOptions />
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={1} xxl={1} className='nav-bar-icon'>
            <Button
              type='primary'
              shape='circle'
              icon={<Icon path={mdiGithub} title='Github' size={1} color='white' />}
              size='large'
              href='https://github.com/LaurenceHo/react-weather-app'
            />
          </Col>
        </Row>
      </Header>
    );
  });

  const MenuContent = withRouter(({ location }) => {
    const pathname = location.pathname;
    const urlPath = pathname.substring(1) === '' ? 'weather' : pathname.substring(1);

    return (
      <Menu style={{ width: '18rem' }} defaultSelectedKeys={[`${urlPath}`]} mode='inline'>
        <Menu.Item key='weather'>
          <WeatherLink />
        </Menu.Item>
        <Menu.Item key='map'>
          <WeatherMapLink />
        </Menu.Item>
        <Menu.Item key='about'>
          <AboutLink />
        </Menu.Item>
        <Menu.Item key='datePicker'>
          <MyDatePicker />
        </Menu.Item>
        <Menu.Item key='search'>
          <Search />
        </Menu.Item>
        <Menu.Item key='units'>
          <UnitOptions />
        </Menu.Item>
      </Menu>
    );
  });

  const NavBarMobile = (
    <Header className='nav-bar-mobile'>
      <Row justify='center' align='middle'>
        <Col span={23}>
          <img src='../assets/favicon.ico' width='33' height='30' alt='' />
        </Col>
        <Col span={1}>
          <Popover placement='bottomRight' content={<MenuContent />} trigger='click'>
            <Icon path={mdiMenu} title='Github' size={1} color='white' />
          </Popover>
        </Col>
      </Row>
    </Header>
  );
  return <div>{Utils.isMobile() ? NavBarMobile : <NavBar />}</div>;
};
