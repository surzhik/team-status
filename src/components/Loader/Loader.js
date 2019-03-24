/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Icon } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Loader.css';

class Loader extends React.PureComponent {
  render() {
    return (
      <div className={s.loader}>
        <Icon type="loading" className={s.icon} />
      </div>
    );
  }
}

export default withStyles(s)(Loader);
