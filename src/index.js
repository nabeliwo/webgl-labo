import React from 'react';
import { render } from 'react-dom';
import App from './components/app';

render(
  <App route={location.hash.slice(2)} />,
  document.getElementById('app')
);
