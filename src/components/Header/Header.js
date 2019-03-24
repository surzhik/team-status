import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';

function Header({ title }) {
  return (
    <div className={s.headerHolder}>
      <h3>{title}</h3>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withStyles(s)(Header);
