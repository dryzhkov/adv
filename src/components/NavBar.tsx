import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { Avatar } from './Avatar';
import { useAuth0 } from '@auth0/auth0-react';
import './NavBar.css';

export function NavBar() {
  const { isAuthenticated, user } = useAuth0();
  return (
    <Navbar bg="light" expand="lg" className="navbar">
      <Navbar.Brand href="/">Adventures</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        {!isAuthenticated && <LoginButton></LoginButton>}
        {isAuthenticated && (
          <>
            <LogoutButton></LogoutButton>
            <Navbar.Text>
              <Avatar user={user} />
            </Navbar.Text>
          </>)}
      </Navbar.Collapse>
    </Navbar>
  );
}
