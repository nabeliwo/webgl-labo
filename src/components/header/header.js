import React from 'react';
import Graph from '../graph/graph';
import styles from './header.css';

import BigW from '../svg/bigW';
import BigG from '../svg/bigG';
import BigL from '../svg/bigL';
import SmallE from '../svg/smallE';
import SmallB from '../svg/smallB';
import SmallA from '../svg/smallA';
import SmallO from '../svg/smallO';

export default () => (
  <Graph>
    <header className={styles.wrapper}>
      <h1 className={styles.title}>WebGL Labo</h1>
      <a className={styles.logo} href="#/">
        <span className={styles.icon}><BigW /></span>
        <span className={styles.icon}><SmallE /></span>
        <span className={styles.icon}><SmallB /></span>
        <span className={styles.icon}><BigG /></span>
        <span className={styles.icon}><BigL /></span>
        <span className={styles.icon__space}></span>
        <span className={styles.icon}><BigL /></span>
        <span className={styles.icon}><SmallA /></span>
        <span className={styles.icon}><SmallB /></span>
        <span className={styles.icon}><SmallO /></span>
      </a>
    </header>
  </Graph>
);
