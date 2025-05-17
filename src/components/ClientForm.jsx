import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import ClientService from '../services/ClientService';

const ClientForm = () => {
    const [client, setClient] = useState({ name: '', email: '', phone: '' });
    const [message, setMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        ClientService.create(client)
            .then(() => {
                setMessage('Klant succesvol aangemaakt!');
                setClient({ name: '', email: '', phone: '' });
                setValidated(false);
            })
            .catch(() => setMessage('Fout bij aanmaken klant.'));
    };

    return (
        <Container className="my-5">
            <Card className="shadow p-4">
                <h2>Nieuwe Klant</h2>
                {message && <Alert variant="info">{message}</Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Naam</Form.Label>
                        <Form.Control
                            name="name"
                            value={client.name}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Naam is verplicht.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            type="email"
                            value={client.email}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Voer een geldig e-mailadres in.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Telefoon</Form.Label>
                        <Form.Control
                            name="phone"
                            value={client.phone}
                            onChange={handleChange}
                            pattern="^(\+31|0)6[0-9]{8}$"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Voer een geldig mobiel nummer in (zoals 0612345678 of +31612345678).
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit">Opslaan</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ClientForm;
