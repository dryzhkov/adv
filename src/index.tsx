import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Auth0Provider } from '@auth0/auth0-react';

// import { useHistory } from 'react-router-dom';
// import { AppState } from '@auth0/auth0-react/dist/auth0-provider';

// let history = useHistory();
// const onRedirectCallback = (appState: AppState) => {
//     history.push(
//         appState && appState.returnTo
//             ? appState.returnTo
//             : window.location.pathname
//     );
// };

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain="dimaryz.auth0.com"
            clientId="Em52Z8gNdTzdIZAtRfDgzqZYSBDpUGQW"
            redirectUri={window.location.origin}

            // onRedirectCallback={onRedirectCallback}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
