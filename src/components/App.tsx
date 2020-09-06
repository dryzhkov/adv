import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Details } from './Details';
import { Timeline } from './Timeline';
import './App.css';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
            </nav>
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
