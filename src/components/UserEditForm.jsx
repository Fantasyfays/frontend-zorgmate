import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const UserEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({ username: '', role: 'USER' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        UserService.getById(id)
            .then(res => {
                const { username, role } = res.data;
                setUser({ username: username || '', role: role || 'USER' });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setMessage('Fout bij ophalen gebruiker.');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {
            username: user.username,
            role: user.role
        };

        UserService.update(id, updatedUser)
            .then(() => {
                setMessage('Gebruiker succesvol bijgewerkt!');
                setTimeout(() => navigate('/users'), 1500);
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.data) {
                    const errors = err.response.data;
                    const errorMsg = Object.entries(errors)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join('\n');
                    setMessage(`Validatiefouten:\n${errorMsg}`);
                } else {
                    setMessage('Fout bij bijwerken gebruiker.');
                }
            });
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-primary">Gebruiker Bewerken</h2>
            {message && <Alert variant="info" className="white-space-pre-line">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Gebruikersnaam</Form.Label>
                    <Form.Control
                        value={user.username || ''}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                        value={user.role || 'USER'}
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEDEWERKER">MEDEWERKER</option>
                        <option value="BEDRIJF">BEDRIJF</option>
                    </Form.Select>
                </Form.Group>
                <Button type="submit" className="btn-custom">Opslaan</Button>
            </Form>
        </Container>
    );
};

export default UserEditForm;
