import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceService from '../services/InvoiceService';

const InvoiceEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const [invoice, setInvoice] = useState({
        invoiceNumber: '',
        senderName: '',
        receiverName: '',
        issueDate: '',
        dueDate: '',
        status: 'UNPAID',
        items: []
    });

    useEffect(() => {
        InvoiceService.getById(id)
            .then(res => {
                setInvoice(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setMessage('Fout bij ophalen van factuur.');
                setLoading(false);
            });
    }, [id]);

    const handleInvoiceChange = (e) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...invoice.items];

        const updatedItem = {
            ...updatedItems[index],
            [name]: name === 'hoursWorked' || name === 'hourlyRate' ? Number(value) : value,
        };

        if (updatedItem.hoursWorked && updatedItem.hourlyRate) {
            updatedItem.subTotal = (updatedItem.hoursWorked * updatedItem.hourlyRate).toFixed(2);
        }

        updatedItems[index] = updatedItem;
        setInvoice({ ...invoice, items: updatedItems });
    };

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { description: '', hoursWorked: 1, hourlyRate: 0.0 }]
        });
    };

    const removeItem = (index) => {
        const items = [...invoice.items];
        items.splice(index, 1);
        setInvoice({ ...invoice, items });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const cleanedInvoice = {
            ...invoice,
            items: invoice.items.map(item => ({
                description: item.description,
                hoursWorked: Number(item.hoursWorked),
                hourlyRate: Number(item.hourlyRate)
            }))
        };

        InvoiceService.update(id, cleanedInvoice)
            .then(() => {
                setMessage('Factuur succesvol bijgewerkt!');
                setTimeout(() => navigate('/invoices'), 1500);
            })
            .catch(err => {
                console.error(err);
                if (err.response?.data) {
                    const errorData = err.response.data;
                    const msg = Object.entries(errorData)
                        .map(([field, message]) => `${field}: ${message}`)
                        .join('\n');
                    setMessage(msg);
                } else {
                    setMessage('Fout bij bijwerken van factuur.');
                }
            });
    };

    const changeStatus = (newStatus) => {
        if (invoice.status === newStatus) return;

        InvoiceService.updateStatus(id, newStatus)
            .then(() => {
                setInvoice({ ...invoice, status: newStatus });
                setMessage(`Status succesvol gewijzigd naar ${newStatus}`);
            })
            .catch(err => {
                console.error(err);
                setMessage('Fout bij wijzigen van status.');
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
        <Container className="my-5">
            <Card className="shadow p-4">
                <h2 className="text-primary mb-4">Factuur Bewerken</h2>
                {message && <Alert variant="info" className="white-space-pre-line">{message}</Alert>}
                <Badge bg="info" className="mb-4">Huidige status: {invoice.status}</Badge>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Factuurnummer</Form.Label>
                                <Form.Control
                                    name="invoiceNumber"
                                    value={invoice.invoiceNumber}
                                    onChange={handleInvoiceChange}
                                    required
                                    isInvalid={!invoice.invoiceNumber}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Factuurnummer is verplicht.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Status wijzigen</Form.Label>
                                <div className="d-flex gap-2">
                                    {['UNPAID', 'PAID', 'OVERDUE'].map(status => (
                                        <Button
                                            key={status}
                                            data-testid={`status-${status.toLowerCase()}`}
                                            variant={invoice.status === status ? 'primary' : 'outline-secondary'}
                                            onClick={() => changeStatus(status)}
                                            type="button"
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Naam verzender</Form.Label>
                                <Form.Control
                                    name="senderName"
                                    value={invoice.senderName}
                                    onChange={handleInvoiceChange}
                                    required
                                    isInvalid={!invoice.senderName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Verzendersnaam is verplicht.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Naam ontvanger</Form.Label>
                                <Form.Control
                                    name="receiverName"
                                    value={invoice.receiverName}
                                    onChange={handleInvoiceChange}
                                    required
                                    isInvalid={!invoice.receiverName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Ontvangersnaam is verplicht.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Uitgiftedatum</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="issueDate"
                                    value={invoice.issueDate}
                                    onChange={handleInvoiceChange}
                                    required
                                    isInvalid={!invoice.issueDate}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Uitgiftedatum is verplicht.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Vervaldatum</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dueDate"
                                    value={invoice.dueDate}
                                    onChange={handleInvoiceChange}
                                    required
                                    isInvalid={!invoice.dueDate}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Vervaldatum is verplicht.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <h4 className="text-secondary mt-4 mb-3">Factuuritems</h4>
                    {invoice.items.map((item, index) => (
                        <Row key={index} className="align-items-end mb-3 bg-light p-3 rounded">
                            <Col md={5}>
                                <Form.Group>
                                    <Form.Label>Beschrijving</Form.Label>
                                    <Form.Control
                                        name="description"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, e)}
                                        required
                                        isInvalid={!item.description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Beschrijving is verplicht.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Uren</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="hoursWorked"
                                        min={1}
                                        value={item.hoursWorked}
                                        onChange={(e) => handleItemChange(index, e)}
                                        required
                                        isInvalid={!item.hoursWorked || item.hoursWorked < 1}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Minimaal 1 uur vereist.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Tarief (€)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="hourlyRate"
                                        value={item.hourlyRate}
                                        onChange={(e) => handleItemChange(index, e)}
                                        required
                                        isInvalid={item.hourlyRate === null || item.hourlyRate < 0}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Voer een geldig tarief in.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={2} className="d-flex justify-content-end">
                                <Button variant="danger" onClick={() => removeItem(index)} type="button">
                                    Verwijder
                                </Button>
                            </Col>
                        </Row>
                    ))}

                    <div className="d-flex gap-3 mt-4">
                        <Button variant="outline-primary" onClick={addItem} type="button">
                            Item Toevoegen
                        </Button>
                        <Button type="submit" className="btn-custom">
                            Factuur Opslaan
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default InvoiceEditForm;
