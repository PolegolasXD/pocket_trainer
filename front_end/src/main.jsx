import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RoutesComponents from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <RoutesComponents />
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);
