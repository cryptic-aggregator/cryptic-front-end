import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './store/index';
import toast, { Toaster } from 'react-hot-toast';
import RootWrapper from './RootWrapper';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <RootWrapper />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#313135',
              padding: '5px 10px',
              color: '#FFFFFFFF',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
