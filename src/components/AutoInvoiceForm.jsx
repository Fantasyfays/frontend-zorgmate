import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InvoiceService from '../services/InvoiceService';
import ClientService from '../services/ClientService';

const AutoInvoiceForm = () => {
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loadingClients, setLoadingClients] = useState(true);
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate(); // 👈 Voeg navigate toe

    useEffect(() => {
        ClientService.getAll()
            .then(res => {
                setClients(res.data);
                setLoadingClients(false);
            })
            .catch(() => {
                setMessage('Fout bij ophalen van klanten.');
                setSuccess(false);
                setLoadingClients(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        InvoiceService.autoGenerate({ clientId: Number(selectedClientId) })
            .then(res => {
                setMessage(`Factuur gegenereerd (#${res.data.invoiceNumber}) voor klant: ${res.data.receiverName}`);
                setSuccess(true);
                setValidated(false);
                setSelectedClientId('');

                // ➤ Redirect na korte delay (optioneel: laat succesmelding kort zien)
                setTimeout(() => {
                    navigate('/invoices');
                }, 1500);
            })
            .catch(err => {
                console.error(err);
                setMessage('Fout bij genereren van factuur. Misschien geen ongefactureerde uren?');
                setSuccess(false);
            });
    };

    return (
        <Container className="my-5">
            <Card className="shadow p-4">
                <h2>Factuur Automatisch Genereren</h2>

                {message && (
                    <Alert
                        variant={success ? 'success' : 'danger'}
                        className="mt-3"
                        data-testid="auto-message"
                    >
                        {message}
                    </Alert>
                )}

                {loadingClients ? (
                    <div className="text-center my-4" data-testid="auto-loading">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                        className="mt-4"
                        data-testid="auto-form"
                    >
                        <Form.Group>
                            <Form.Label>Selecteer Klant</Form.Label>
                            <Form.Select
                                name="clientId"
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                required
                                isInvalid={!selectedClientId}
                                data-testid="auto-client-select"
                            >
                                <option value="">-- Kies een klant --</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} ({client.email})
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Kies een klant.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            type="submit"
                            className="mt-3"
                            data-testid="auto-submit"
                        >
                            Genereer Factuur
                        </Button>
                    </Form>
                )}
            </Card>
        </Container>
    );
};

export default AutoInvoiceForm;
