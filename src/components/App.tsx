import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { Details } from './Details';
import { Timeline } from './Timeline';
import './App.css';
import { NavBar } from './NavBar';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
    const { isAuthenticated, user, isLoading } = useAuth0();
    console.log(isAuthenticated, user, isLoading);
    return (
        <Router>
            <NavBar />
            {!isLoading ? (
                <main>
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <PrivateRoute
                            path="/details/:id"
                            component={Details}
                        ></PrivateRoute>
                        <PrivateRoute
                            path="/"
                            component={Timeline}
                        ></PrivateRoute>
                    </Switch>
                </main>
            ) : null}
        </Router>
    );
}

// type PrivateRouteProps = {
//     component: any;
//     authed: boolean;
// } & {
//     [prop: string]: string;
// };

function PrivateRoute({ component: Component, ...rest }: any) {
    const { isAuthenticated: authed } = useAuth0();
    return (
        <Route
            {...rest}
            render={(props) =>
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
