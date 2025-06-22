import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RoutesComponents from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { AdminProvider } from './context/AdminContext';
import { TreinoProvider } from './context/TreinoContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <ChatProvider>
          <TreinoProvider>
            <RoutesComponents />
          </TreinoProvider>
        </ChatProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);
