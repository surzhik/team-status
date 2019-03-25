import React from 'react';

import { message, Button, Icon, Table, Divider, Modal } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

/* eslint-disable css-modules/no-unused-class */
import s from './Home.css';

class Home extends React.Component {
  render() {
    return <div className={s.overHolder}>1</div>;
  }
}

export default withStyles(s)(Home);
