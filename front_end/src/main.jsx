import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RoutesComponents from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { AdminProvider } from './context/AdminContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <ChatProvider>
          <RoutesComponents />
        </ChatProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);
