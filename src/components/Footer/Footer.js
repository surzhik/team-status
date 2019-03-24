import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';

function Footer() {
  /* eslint-disable react/jsx-no-target-blank */
  return (
    <div className={s.footerHolder}>
      <div className="container">
        © 2019
        <a
          className={s.link}
          target="_blank"
          href="https://github.com/surzhik/team-status"
        >
          Ivan Turuk
        </a>
      </div>
    </div>
  );
}

export default withStyles(s)(Footer);
