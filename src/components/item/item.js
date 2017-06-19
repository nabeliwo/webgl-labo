import React from 'react';
import styles from './item.css';

export default ({ href }) => (
  <a className={styles.wrapper} href={href}>
    article
  </a>
);
