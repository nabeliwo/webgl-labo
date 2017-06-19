import React from 'react';
import Header from './header/header';
import Footer from './footer/footer';
import Item from './item/item';
import Article from './article/article';
import styles from './app.css';
import articles from '../../articles/';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      route: this.props.route
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: location.hash.slice(2) });
    }, false);
  }

  _getContents() {
    const { route } = this.state;

    if (Object.keys(articles).find(key => key === route)) {
      const Children = articles[route].component;
      return <Article title={articles[route].title}><Children /></Article>;
    }

    return (
      <div className={styles.articles}>
        {Object.keys(articles).map(key => <Item key={key} href={`#/${key}`} />)}
      </div>
    );
  }

  render() {
    return (
      <div>
        <Header />
        {this._getContents()}
        <Footer />
      </div>
    );
  }
}
