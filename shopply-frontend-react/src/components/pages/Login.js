import { useContext, useState } from "react";
import { Alert, Button, Card, Col, Form } from "react-bootstrap";
import axios from "axios";
import constants from "../../configuration/constants";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const { doLogin, isLoggedIn } = useContext(AuthContext);

  const history = useHistory();
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryParams = new URLSearchParams(useLocation().search);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoginErrorMessage("");

    if (formData.email.length === 0 && formData.password.length === 0) {
      return;
    }

    axios
      .post(`${constants.API_URL_PREFIX}/auth/login`, formData)
      .then((serverData) => {
        const { token, email, userId, userRole } = serverData.data;

        doLogin(token, email, userId, userRole);
        history.push("/");
      })
      .catch((err) => {
        setLoginErrorMessage(
          "Traženi korisnik ne postoji ili su uneti parametri pogrešni. Molimo Vas da probate ponovo."
        );
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return isLoggedIn ? (
    <Redirect to="/" />
  ) : (
    <Col className="mt-2" md={{ span: 6, offset: 3 }}>
      <Card>
        <Card.Body>
          {queryParams.get("registerSuccess") === "1" && (
            <Alert variant="success">Uspešno ste se registrovali</Alert>
          )}

          <Card.Title>Prijavite se</Card.Title>
          {loginErrorMessage.length > 0 && (
            <Alert variant="warning">{loginErrorMessage}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email adresa</Form.Label>
              <Form.Control
                onChange={handleChange}
                id="email"
                type="email"
                placeholder="Unesite email adresu"
              />
              {formData.email.length === 0 && (
                <Form.Text className="text-danger">
                  Polje za e-mail ne sme biti prazno.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control
                onChange={handleChange}
                id="password"
                type="password"
                placeholder="Unesite lozinku"
              />
              {formData.password.length === 0 && (
                <Form.Text className="text-danger">
                  Polje za lozinku ne sme biti prazno.
                </Form.Text>
              )}
            </Form.Group>
            <Button
              variant="secondary"
              className="custom-bg-color"
              type="submit"
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Prijavite se
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
}
