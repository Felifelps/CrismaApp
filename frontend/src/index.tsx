import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import * as serviceWorker from './ServiceWorker';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);

serviceWorker.register();
