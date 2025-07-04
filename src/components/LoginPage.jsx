import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            const token = response.data.token;
            localStorage.removeItem('token');
            localStorage.setItem('token', token);
            navigate('/invoices');

        } catch (err) {
            setError(err.response?.data?.error || 'Fout bij inloggen');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="text-center text-primary mb-4">Inloggen</h2>
            {error && <Alert variant="danger" data-testid="login-error">{error}</Alert>}
            <Form onSubmit={handleLogin} data-testid="login-form">
                <Form.Group className="mb-3">
                    <Form.Label>Gebruikersnaam</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        data-testid="login-username"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Wachtwoord</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        data-testid="login-password"
                    />
                </Form.Group>
                <Button type="submit" className="btn-custom w-100">Login</Button>
            </Form>
        </Container>
    );
};

export default LoginPage;
