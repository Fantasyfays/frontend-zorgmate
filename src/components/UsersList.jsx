import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        UserService.getAll()
            .then(res => setUsers(res.data))
            .catch(console.error);
    };

    return (
        <Container className="my-5">
            <h2 className="text-primary mb-4">Gebruikerslijst</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {users.map(user => (
                    <Col key={user.id}>
                        <Card
                            className="h-100 shadow-sm border-0"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/users/edit/${user.id}`)}
                        >
                            <Card.Body>
                                <Card.Title className="text-capitalize">{user.username}</Card.Title>
                                <Badge bg="info">{user.role}</Badge>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UsersList;
