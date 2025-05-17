import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import TimeEntryService from '../services/TimeEntryService';
import ClientService from '../services/ClientService';

const TimeEntryForm = () => {
    const [entry, setEntry] = useState({
        description: '',
        hours: 1,
        hourlyRate: 50,
        date: '',
        clientId: ''
    });

    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        ClientService.getAll()
            .then(res => {
                setClients(res.data);
                setLoadingClients(false);
            })
            .catch(() => {
                setError('Fout bij laden van klanten.');
                setLoadingClients(false);
            });
    }, []);

    const handleChange = (e) => {
        setEntry({ ...entry, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const timeEntry = {
            ...entry,
            clientId: parseInt(entry.clientId),
            hours: parseInt(entry.hours),
            hourlyRate: parseFloat(entry.hourlyRate),
            projectId: entry.projectId ?? null
        };

        TimeEntryService.create(timeEntry)
            .then(() => {
                setMessage('Uur succesvol geregistreerd!');
                setEntry({
                    description: '',
                    hours: 1,
                    hourlyRate: 50,
                    date: '',
                    clientId: ''
                });
                setValidated(false);
            })
            .catch(() => {
                setError('Fout bij registratie van uur.');
            });
    };

    return (
        <Container className="my-5">
            <Card className="shadow p-4">
                <h2>Uren registreren</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}

                {loadingClients ? (
                    <div className="text-center"><Spinner animation="border" /></div>
                ) : (
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Klant</Form.Label>
                            <Form.Select
                                name="clientId"
                                value={entry.clientId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecteer een klant</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Selecteer een klant.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Omschrijving</Form.Label>
                            <Form.Control
                                name="description"
                                value={entry.description}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Omschrijving is verplicht.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Datum</Form.Label>
                            <Form.Control
                                name="date"
                                type="date"
                                value={entry.date}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Datum is verplicht.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Uren</Form.Label>
                            <Form.Control
                                name="hours"
                                type="number"
                                min="1"
                                value={entry.hours}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Voer een geldig aantal uren in (minimaal 1).
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tarief (€)</Form.Label>
                            <Form.Control
                                name="hourlyRate"
                                type="number"
                                step="0.01"
                                value={entry.hourlyRate}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Voer een geldig tarief in.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit">Opslaan</Button>
                    </Form>
                )}
            </Card>
        </Container>
    );
};

export default TimeEntryForm;
