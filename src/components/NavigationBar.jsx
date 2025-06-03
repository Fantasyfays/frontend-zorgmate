import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => (e) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <Navbar className="navbar-custom" expand="lg">
            <Container>
                <Navbar.Brand href="/" onClick={handleNavigate('/')}>ZorgMate</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/" onClick={handleNavigate('/')}>Home</Nav.Link>
                        <Nav.Link href="/register" onClick={handleNavigate('/register')}>Registreren</Nav.Link>
                        <Nav.Link href="/users" onClick={handleNavigate('/users')}>Gebruikers</Nav.Link>
                        <Nav.Link href="/invoice/auto" onClick={handleNavigate('/invoice/auto')}>Nieuwe Factuur</Nav.Link>
                        <Nav.Link href="/invoices" onClick={handleNavigate('/invoices')}>Facturen Overzicht</Nav.Link>
                        <Nav.Link href="/clients" onClick={handleNavigate('/clients')}>Klanten</Nav.Link>
                        <Nav.Link href="/clients/new" onClick={handleNavigate('/clients/new')}>Nieuwe Klant</Nav.Link>
                        <Nav.Link href="/time-entry" onClick={handleNavigate('/time-entry')}>Uren registreren</Nav.Link>
                        <Nav.Link onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}>Uitloggen</Nav.Link>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
