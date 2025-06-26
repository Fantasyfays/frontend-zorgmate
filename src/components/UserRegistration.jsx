import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const UserRegistration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const registerUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8080/api/users/register', {
                username,
                password,
                role
            });
            setSuccess(`Gebruiker ${response.data.username} geregistreerd!`);
            setUsername('');
            setPassword('');
        } catch (err) {
            if (err.response?.data) {
                const errorData = err.response.data;
                const msg = Object.entries(errorData)
                    .map(([field, message]) => {
                        if (field === 'username') return 'Gebruikersnaam is verplicht';
                        if (field === 'password') return 'Wachtwoord is verplicht';
                        return message;
                    })
                    .join('\n');
                setError(msg);
            } else {
                setError('Er ging iets mis!');
            }
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-primary">Registratie</h2>
            {error && (
                <Alert variant="danger" className="white-space-pre-line" data-testid="register-error">
                    {error}
                </Alert>
            )}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={registerUser} data-testid="register-form">
                <Form.Group className="mb-3">
                    <Form.Label>Gebruikersnaam</Form.Label>
                    <Form.Control
                        name="username"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        data-testid="username"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Wachtwoord</Form.Label>
                    <Form.Control
                        name="password"
                        type="password"
                        value={password || ''}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        data-testid="password"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        data-testid="role"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEDEWERKER">MEDEWERKER</option>
                        <option value="BEDRIJF">BEDRIJF</option>
                        <option value="CLIENT">CLIENT</option>
                    </Form.Select>
                </Form.Group>
                <Button className="btn-custom" type="submit">Registreer</Button>
            </Form>
        </Container>
    );
};

export default UserRegistration;
