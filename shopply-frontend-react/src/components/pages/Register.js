import { useState, useEffect, useContext } from "react";
import { Alert, Button, Card, Col, Form } from "react-bootstrap";
import axios from "axios";

import constants from "../../configuration/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Redirect, useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Register() {
  const { isLoggedIn } = useContext(AuthContext);

  const [cities, setCities] = useState([]);

  const [showRegisterError, setShowRegisterError] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");

  const history = useHistory();

  const [formValues, setFormValues] = useState({
    forename: "",
    surname: "",
    email: "",
    password: "",
    bornAt: "2000-01-01",
    gender: "male",
    address: "",
    cityId: 1,
    postalCode: "",
  });

  function handleChange(e) {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  }

  function isFormValid() {
    let areInputsValid = true;
    if (
      formValues.forename.length === 0 ||
      formValues.surname.length === 0 ||
      formValues.email.length === 0 ||
      formValues.password.length === 0 ||
      formValues.bornAt.length === 0 ||
      formValues.gender.length === 0 ||
      formValues.address.length === 0 ||
      formValues.cityId < 1 ||
      formValues.postalCode.length === 0
    ) {
      areInputsValid = false;
    }
    return areInputsValid;
  }

  function doRegister(e) {
    e.preventDefault();

    console.log(isFormValid());
    if (!isFormValid()) return;

    setShowRegisterError(false);
    setRegisterErrorMessage("");

    setFormValues({ ...formValues, postalCode: formValues.postalCode * 1 });

    axios
      .post(`${constants.API_URL_PREFIX}/auth/register`, formValues)
      .then((registeredUser) => {
        console.log(registeredUser.data);
        if (registeredUser.data.success) {
          history.push("/login?registerSuccess=1");
        } else {
          setShowRegisterError(true);
          setRegisterErrorMessage(registeredUser.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios
      .get(`${constants.API_URL_PREFIX}/cities`)
      .then((serverData) => {
        setCities(serverData.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const allCities = cities.map((city) => (
    <option value={city.cityId}>{city.name}</option>
  ));

  return isLoggedIn ? (
    <Redirect to="/" />
  ) : (
    <Col className="mt-2 mb-2" md={{ span: 6, offset: 3 }}>
      <Card>
        <Card.Body>
          <Card.Title>Registracija</Card.Title>
          {showRegisterError && (
            <Alert variant="danger">{registerErrorMessage}</Alert>
          )}
          <Form onSubmit={doRegister}>
            <Form.Row>
              <Form.Group as={Col} controlId="forename">
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  value={formValues.forename}
                  type="text"
                  placeholder="Unesite Vaše ime"
                  onChange={handleChange}
                />
                {formValues.forename.length === 0 && (
                  <Form.Text className="text-danger">
                    Polje za ime ne sme biti prazno.
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} controlId="surname">
                <Form.Label>Prezime</Form.Label>
                <Form.Control
                  value={formValues.surname}
                  type="text"
                  placeholder="Unesite Vaše prezime"
                  onChange={handleChange}
                />
                {formValues.surname.length === 0 && (
                  <Form.Text className="text-danger">
                    Polje za prezime ne sme biti prazno.
                  </Form.Text>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="email">
              <Form.Label>Email adresa</Form.Label>
              <Form.Control
                value={formValues.email}
                type="email"
                placeholder="Unesite Vašu E-mail adresu"
                onChange={handleChange}
              />
              {formValues.email.length === 0 && (
                <Form.Text className="text-danger">
                  Polje za e-mail adresu ne sme biti prazno.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control
                value={formValues.password}
                type="password"
                placeholder="Unesite lozinku"
                onChange={handleChange}
              />
              {formValues.password.length < 6 && (
                <Form.Text className="text-danger">
                  Lozinka mora imati najmanje 6 znakova.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Row>
              <Form.Group controlId="bornAt" as={Col}>
                <Form.Label>Datum rođenja</Form.Label>
                <Form.Control
                  value={formValues.bornAt}
                  type="date"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="gender" as={Col}>
                <Form.Label>Pol</Form.Label>
                <Form.Control
                  value={formValues.gender}
                  as="select"
                  onChange={handleChange}
                >
                  <option value="male">Muški</option>
                  <option value="female">Ženski</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="address">
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                value={formValues.address}
                type="text"
                placeholder="Unesite Vašu adresu"
                onChange={handleChange}
              />
              {formValues.address.length === 0 && (
                <Form.Text className="text-danger">
                  Polje za adresu ne sme biti prazno.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Row>
              <Form.Group controlId="cityId" as={Col}>
                <Form.Label>Izaberite grad</Form.Label>
                <Form.Control
                  value={formValues.cityId}
                  as="select"
                  onChange={handleChange}
                >
                  {allCities}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="postalCode" as={Col}>
                <Form.Label>Poštanski broj</Form.Label>
                <Form.Control
                  value={formValues.postalCode}
                  type="number"
                  placeholder="Unesite poštanski broj"
                  onChange={handleChange}
                />
                {formValues.postalCode.length === 0 && (
                  <Form.Text className="text-danger">
                    Polje za poštanski broj ne sme biti prazno.
                  </Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Button
              variant="secondary"
              className="custom-bg-color"
              type="submit"
            >
              <FontAwesomeIcon icon={faUserPlus} /> Registrujte se
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
}
