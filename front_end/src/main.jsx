import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RoutesComponents from './routes';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RoutesComponents />
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);
