import { useContext, useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Logout() {
  const { doLogout } = useContext(AuthContext);

  useEffect(doLogout, []);

  return (
    <Col className="mt-2" md={{ span: 6, offset: 3 }}>
      <Card>
        <Card.Body>
          <Card.Title>Uspešno ste se odjavili!</Card.Title>
          <ul>
            <li>
              <Link to="/">Povratak na početnu stranu</Link>
            </li>
            <li>
              <Link to="/login">Povratak na stranu za prijavljivanje</Link>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Col>
  );
}
