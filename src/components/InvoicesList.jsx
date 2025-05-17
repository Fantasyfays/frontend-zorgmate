import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InvoiceService from '../services/InvoiceService';

const InvoicesList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = () => {
        setLoading(true);
        InvoiceService.getAll()
            .then(res => {
                setInvoices(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Fout bij laden van facturen.');
                setLoading(false);
            });
    };

    const deleteInvoice = (id) => {
        if (window.confirm("Weet je zeker dat je deze factuur wilt verwijderen?")) {
            InvoiceService.delete(id)
                .then(loadInvoices)
                .catch(() => setError('Verwijderen mislukt.'));
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

            <Row xs={1} md={2} lg={3} className="g-4">
                {invoices.map((inv) => (
                    <Col key={inv.id}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title className="d-flex justify-content-between align-items-center">
                                    <span>{inv.invoiceNumber}</span>
                                    <Badge bg={
                                        inv.status === 'PAID' ? 'success' :
                                            inv.status === 'OVERDUE' ? 'danger' :
                                                'warning'
                                    }>
                                        {inv.status}
                                    </Badge>
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {inv.senderName} → {inv.receiverName}
                                </Card.Subtitle>
                                <Card.Text>
                                    <strong>Bedrag:</strong> €{inv.totalAmount.toFixed(2)}<br />
                                    <strong>Uitgiftedatum:</strong> {inv.issueDate}<br />
                                    <strong>Vervaldatum:</strong> {inv.dueDate}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between">
                                <Button size="sm" variant="outline-info" onClick={() => navigate(`/invoice/details/${inv.id}`)}>
                                    Bekijken
                                </Button>
                                <div className="d-flex gap-2">
                                    <Button size="sm" variant="outline-primary" onClick={() => navigate(`/invoice/edit/${inv.id}`)}>
                                        Bewerken
                                    </Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => deleteInvoice(inv.id)}>
                                        Verwijderen
                                    </Button>
                                </div>
                            </Card.Footer>

                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default InvoicesList;
