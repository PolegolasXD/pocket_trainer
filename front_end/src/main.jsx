import React from 'react';
import ReactDOM from 'react-dom';
import CadastroHTML from './pages/cadastro/cadastro';
import './index.css';
import LoginHTML from './pages/login/login';
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
