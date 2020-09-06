import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Details } from './Details';
import { Timeline } from './Timeline';
import './App.css';
import { NavBar } from './NavBar';

function App() {
    return (
        <Router>
            <NavBar />
            <main>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/details/:id">
                        <Details />
                    </Route>
                    <Route path="/">
                        <Timeline />
                    </Route>
                </Switch>
            </main>
        </Router>
    );
}

function Login() {
    return <h2>Login</h2>;
}

export default App;
