import React from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Layout, Menu, Icon } from 'antd';
import antd from 'antd/dist/antd.css';
import history from '../../history';
// external-global styles must be imported in your JS.

import HeaderIn from '../Header';
import FooterIn from '../Footer';
import s from './Layout.css';

const { Header, Content, Footer, Sider } = Layout;

class LayoutOver extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  };

  state = {
    collapsed: false,
  };

  componentDidMount() {
    /* eslint-disable react/no-did-mount-set-state */
    if (localStorage.getItem('collapsed') === 'true') {
      this.setState({ collapsed: true });
    }
  }

  onCollapse = collapsed => {
    localStorage.setItem('collapsed', collapsed);
    this.setState({ collapsed });
  };

  handleMenuClick = ({ key }) => {
    history.push(key);
  };

  render() {
    console.log(this.props);
    const {
      title,
      route: { path },
    } = this.props;

    const defaultSelectedKeys = [path || '/'];

    return (
      <Layout style={{ minHeight: '100vh' }} className="ant-layout-has-sider">
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          style={{ background: '#fff' }}
        >
          <div className={s.logoHolder}><Icon type="contacts" /></div>
          <Menu
            defaultSelectedKeys={defaultSelectedKeys}
            mode="inline"
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="/">
              <Icon type="team" />
              <span>Team</span>
            </Menu.Item>
            <Menu.Item key="/managers">
              <Icon type="fund" />
              <span>Managers</span>
            </Menu.Item>
            <Menu.Item key="/skills">
              <Icon type="star" />
              <span>Skills</span>
            </Menu.Item>
            <Menu.Item key="/projects">
              <Icon type="code" />
              <span>Projects</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: '0 30px' }}>
            <HeaderIn title={title} />
          </Header>
          <Content style={{ backgroundColor: '#fff', padding: '30px' }}>
            {this.props.children}
          </Content>
          <Footer
            style={{ backgroundColor: '#fff', padding: '5px 30px 15px 30px' }}
          >
            <FooterIn />
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withStyles(s, antd)(LayoutOver);
