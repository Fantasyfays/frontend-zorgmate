import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InvoiceService from '../services/InvoiceService';
import { jwtDecode } from 'jwt-decode';

const InvoicesList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (typeof token === 'string' && token.trim() !== '') {
            try {
                const decoded = jwtDecode(token);
                console.log('Ingelogde gebruiker via token:', decoded.sub);
            } catch (err) {
                console.error('Ongeldig token:', err.message);
            }
        } else {
            console.warn('Ongeldig of ontbrekend token:', token);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Geen JWT gevonden in localStorage.');
            return;
        }

        const socket = new WebSocket(`ws://localhost:8080/ws/invoices?token=${token}`);

        socket.onopen = () => {
            console.log('WebSocket verbonden');
        };

        socket.onmessage = (event) => {
            console.log('WebSocket bericht ontvangen:', event.data);
            if (event.data.startsWith('factuur_')) {
                loadInvoices();
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket fout:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket verbinding gesloten');
        };

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = () => {
        setLoading(true);
        InvoiceService.getAll()
            .then((res) => {
                setInvoices(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Fout bij laden van facturen.');
                setLoading(false);
            });
    };

    const deleteInvoice = (id) => {
        if (window.confirm('Weet je zeker dat je deze factuur wilt verwijderen?')) {
            InvoiceService.delete(id)
                .then(() => {
                    console.log('Factuur succesvol verwijderd.');
                    loadInvoices();
                })
                .catch((err) => {
                    if (err.response?.status === 403) {
                        setError('Je hebt geen rechten om deze factuur te verwijderen.');
                    } else {
                        setError('Verwijderen mislukt.');
                    }
                });
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Facturen Overzicht</h2>
                <Button className="btn-custom" onClick={() => navigate('/invoice/auto')}>
                    + Nieuwe Factuur
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {invoices.length === 0 ? (
                <div data-testid="empty-invoices" className="text-center text-muted">
                    Geen facturen gevonden
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {invoices.map((inv) => (
                        <Col key={inv.id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>{inv.invoiceNumber}</span>
                                        <Badge
                                            bg={
                                                inv.status === 'PAID'
                                                    ? 'success'
                                                    : inv.status === 'OVERDUE'
                                                        ? 'danger'
                                                        : 'warning'
                                            }
                                        >
                                            {inv.status}
                                        </Badge>
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {inv.senderName} → {inv.receiverName}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        <strong>Bedrag:</strong> €{inv.totalAmount.toFixed(2)}
                                        <br />
                                        <strong>Uitgiftedatum:</strong> {inv.issueDate}
                                        <br />
                                        <strong>Vervaldatum:</strong> {inv.dueDate}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-between">
                                    <Button
                                        size="sm"
                                        variant="outline-info"
                                        onClick={() => navigate(`/invoice/details/${inv.id}`)}
                                    >
                                        Bekijken
                                    </Button>
                                    <div className="d-flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => navigate(`/invoice/edit/${inv.id}`)}
                                        >
                                            Bewerken
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => deleteInvoice(inv.id)}
                                            data-testid="invoice-delete-button"
                                        >
                                            Verwijderen
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default InvoicesList;
