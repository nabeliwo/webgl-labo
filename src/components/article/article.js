import React from 'react';
import styles from './article.css';

export default ({ title, children }) => (
  <div className={styles.wrapper}>
    <p className={styles.title}>{title}</p>
    <div className={styles.box}>
      {children}
    </div>
    <a className={styles.back} href="#/">戻る</a>
  </div>
);
