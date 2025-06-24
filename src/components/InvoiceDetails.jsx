import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Table, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceService from '../services/InvoiceService';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        InvoiceService.getById(id)
            .then(res => {
                setInvoice(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Kon factuurgegevens niet ophalen.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <Container className="text-center my-5"><Spinner /></Container>;
    if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="my-5">
            <Card className="shadow p-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Factuur: {invoice.invoiceNumber}</h2>
                    <Badge bg={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'danger' : 'warning'}>
                        {invoice.status}
                    </Badge>
                </div>
                <p className="text-muted">Van: <strong>{invoice.senderName}</strong> → Naar: <strong>{invoice.receiverName}</strong></p>
                <p>
                    <strong>Datum:</strong> {invoice.issueDate} <br />
                    <strong>Vervaldatum:</strong> {invoice.dueDate}
                </p>

                <h5 className="mt-4">Gewerkte Uren</h5>
                <Table bordered responsive>
                    <thead>
                    <tr>
                        <th>Omschrijving</th>
                        <th>Datum</th>
                        <th>Uren</th>
                        <th>Tarief</th>
                        <th>Subtotaal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoice.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.description}</td>
                            <td>{item.date}</td>
                            <td>{item.hoursWorked}</td>
                            <td>€{item.hourlyRate}</td>
                            <td>€{item.subTotal}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <h5 className="text-end">Totaal: €{invoice.totalAmount.toFixed(2)}</h5>

                <div className="text-end mt-3">
                    <Button variant="outline-secondary" onClick={() => navigate('/invoices')}>
                        Terug naar overzicht
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default InvoiceDetails;
