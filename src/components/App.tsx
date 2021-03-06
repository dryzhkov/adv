import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { NavBar } from './NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Adventures from './Adventures';

function App() {
  const { isLoading } = useAuth0();
  const client = new ApolloClient({
    uri: '/.netlify/functions/graphql',
    cache: new InMemoryCache(),
  });
  return (
    <Router>
      <NavBar />
      {!isLoading ? (
        <ApolloProvider client={client}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/" component={Adventures}></PrivateRoute>
          </Switch>
        </ApolloProvider>
      ) : null}
    </Router>
  );
}

function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated: authed } = useAuth0();
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          )
      }
    />
  );
}

function Login() {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <Redirect to="/"></Redirect> : null;
}

export default App;
