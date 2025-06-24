import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import ClientService from '../services/ClientService';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        ClientService.getAll()
            .then(res => {
                setClients(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('❌ Fout bij laden van klanten');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <h2>Klanten</h2>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Naam</th>
                    <th>Email</th>
                    <th>Telefoon</th>
                    <th>Straat</th>
                    <th>Postcode + Huisnummer</th>
                    <th>Woonplaats</th>
                </tr>
                </thead>
                <tbody>
                {clients.map(client => (
                    <tr key={client.id}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{client.street}</td>
                        <td>{client.postcode} {client.houseNumber}</td>
                        <td>{client.city}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ClientList;
