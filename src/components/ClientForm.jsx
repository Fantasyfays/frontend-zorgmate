import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import ClientService from '../services/ClientService';
import { lookupAddress } from '../services/addressLookup';

const ClientForm = () => {
    const [client, setClient] = useState({
        name: '',
        email: '',
        phone: '',
        postcode: '',
        houseNumber: '',
        street: '',
        city: ''
    });
    const [message, setMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchAddress = async () => {
            const postcodeRegex = /^[1-9][0-9]{3}[A-Z]{2}$/;
            if (postcodeRegex.test(client.postcode) && client.houseNumber) {
                try {
                    const result = await lookupAddress(client.postcode, client.houseNumber);
                    setClient(prev => ({
                        ...prev,
                        street: result.street,
                        city: result.city
                    }));
                    setMessage('');
                } catch (err) {
                    setMessage('⚠️ Adres niet gevonden (alleen testadressen werken in sandbox).');
                    setClient(prev => ({
                        ...prev,
                        street: '',
                        city: ''
                    }));
                }
            }
        };
        fetchAddress();
    }, [client.postcode, client.houseNumber]);


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
                setMessage('✅ Klant succesvol aangemaakt!');
                setClient({
                    name: '',
                    email: '',
                    phone: '',
                    postcode: '',
                    houseNumber: '',
                    street: '',
                    city: ''
                });
                setValidated(false);
            })
            .catch(() => setMessage('❌ Fout bij aanmaken klant.'));
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
                            required
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
                            Voer een geldig mobiel nummer in.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control
                            name="postcode"
                            value={client.postcode}
                            onChange={handleChange}
                            pattern="^[1-9][0-9]{3}[A-Z]{2}$"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Voer een geldige postcode in (bijv. 1234AB).
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Huisnummer</Form.Label>
                        <Form.Control
                            name="houseNumber"
                            value={client.houseNumber}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Huisnummer is verplicht.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Straat</Form.Label>
                        <Form.Control
                            name="street"
                            value={client.street}
                            readOnly
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Straat is verplicht.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Woonplaats</Form.Label>
                        <Form.Control
                            name="city"
                            value={client.city}
                            readOnly
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Woonplaats is verplicht.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit">Opslaan</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ClientForm;
