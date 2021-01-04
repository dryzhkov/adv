import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dimaryz.auth0.com"
      clientId="Em52Z8gNdTzdIZAtRfDgzqZYSBDpUGQW"
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
