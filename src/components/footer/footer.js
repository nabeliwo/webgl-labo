import React from 'react';
import Graph from '../graph/graph';
import Icon from '../svg/icon';
import FacebookIcon from '../svg/facebook';
import TwitterIcon from '../svg/twitter';
import GithubIcon from '../svg/github';
import styles from './footer.css';

export default () => (
  <Graph>
    <footer className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.box}>
          <div className={styles.octagon}>
            <div className={styles.octagon__inner}>
              <span className={styles.icon}><Icon /></span>
            </div>
          </div>

          <ul className={styles.list}>
            <li><a className={styles.link} href="https://www.facebook.com/hirokiwatanabe19"><FacebookIcon /></a></li>
            <li><a className={styles.link} href="https://twitter.com/nabeliwo"><TwitterIcon /></a></li>
            <li><a className={styles.link} href="https://github.com/nabeliwo"><GithubIcon /></a></li>
          </ul>
        </div>
      </div>

      <p className={styles.copy}>&copy; {new Date().getFullYear()} nabeliwo.me</p>
    </footer>
  </Graph>
);
