import React from 'react';
import styles from './item.css';

export default ({ href, img }) => (
  <a className={styles.wrapper} href={href}>
    <img className={styles.img} src={img} alt="" width="100%" height="auto" />
  </a>
);
