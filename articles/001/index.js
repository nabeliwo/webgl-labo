import React from 'react';
import Renderer from './renderer';

export default class Article001 extends React.Component {
  componentDidMount() {
    this.renderer = new Renderer();
    this.renderer.render();
  }

  componentWillUnmount() {
    this.renderer.stop();
  }

  render() {
    return <canvas id="canvas" />;
  }
}
