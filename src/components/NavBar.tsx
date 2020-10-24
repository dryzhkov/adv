import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
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
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/details/new">New</Nav.Link>

          {!isAuthenticated && <LoginButton></LoginButton>}
          {isAuthenticated && <LogoutButton></LogoutButton>}
        </Nav>
        {isAuthenticated && (
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Avatar user={user} />
            </Navbar.Text>
          </Navbar.Collapse>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
