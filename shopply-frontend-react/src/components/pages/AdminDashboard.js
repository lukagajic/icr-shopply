import { useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

export default function AdminDashboard() {
  const { userRole } = useContext(AuthContext);

  return userRole !== "admin" ? (
    <Redirect to="/" />
  ) : (
    <Container className="mt-2">
      <Card>
        <Card.Body>
          <Card.Title>Administrativni panel</Card.Title>
          <Row>
            <Col md="4" className="mb-2">
              <Card>
                <Card.Body>
                  <Card.Title>Spisak porudžbina</Card.Title>
                  <p>
                    <em>Pregled porudžbina svih korisnika</em>
                  </p>
                  <Button
                    variant="secondary"
                    className="custom-bg-color"
                    as={Link}
                    to="/admin/orders"
                  >
                    Otvori
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
