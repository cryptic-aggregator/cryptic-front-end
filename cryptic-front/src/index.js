import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import {Provider} from "react-redux"
import App from './App';
import store, { initializeAuth } from './store/index';


const root = ReactDOM.createRoot(document.getElementById('root'));
initializeAuth().then(() => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
});
