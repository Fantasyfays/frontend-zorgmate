import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Home = () => {
    return (
        <Container className="text-center my-5 py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="display-4 text-primary fw-bold">Welkom bij ZorgMate!</h1>
                    <p className="lead my-4">
                        Beheer honden eenvoudig, efficiënt en veilig met ZorgMate.
                        Een moderne oplossing voor al je gebruikersbeheer.
                    </p>
                    <Button href="/users" className="btn-custom btn-lg">Bekijk Gebruikers</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
