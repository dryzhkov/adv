import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from './Timeline';
import './App.css';

function App() {
    return (
        <Router>
            <main>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/details/:id">
                        <Details />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </main>
        </Router>
    );
}

function Login() {
    return <h2>Login</h2>;
}

function Details() {
    return <h2>Trip Details</h2>;
}

export default App;
