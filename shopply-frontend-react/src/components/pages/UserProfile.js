import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Button, Form, Alert } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

import constants from "../../configuration/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faCity,
  faEdit,
  faEnvelope,
  faHome,
  faMapMarked,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";

export default function UserProfile() {
  const { userId, token, isLoggedIn } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({
    forename: "",
    surname: "",
    email: "",
    bornAt: "",
    gender: "",
    address: "",
    cityId: 0,
    postalCode: "",
    city: {
      id: 0,
      name: "",
    },
  });

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);

  const [showEditProfileError, setShowEditProfileError] = useState(false);
  const [editProfileErrorMessage, setEditProfileErrorMessage] = useState("");

  const [showEditPasswordSuccess, setShowEditPasswordSuccess] = useState(false);
  const [showEditPasswordError, setShowEditPasswordError] = useState(false);

  const [editPasswordSuccessMessage, setEditPasswordSuccessMessage] = useState(
    ""
  );
  const [editPasswordErrorMessage, setEditPasswordErrorMessage] = useState("");

  const [editPasswordData, setEditPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleShowEditProfileModal = () => {
    setShowEditProfileModal(true);
  };

  const handleCloseEditProfileModal = () => {
    getCurrentUser();
    setShowEditProfileModal(false);
  };

  const handleShowEditPasswordModal = () => {
    setShowEditPasswordModal(true);
  };

  const handleCloseEditPasswordModal = () => {
    setShowEditPasswordModal(false);
  };

  const [cities, setCities] = useState([]);

  function isFormValid() {
    let areInputsValid = true;
    if (
      currentUser.forename.length === 0 ||
      currentUser.surname.length === 0 ||
      currentUser.email.length === 0 ||
      currentUser.bornAt.length === 0 ||
      currentUser.gender.length === 0 ||
      currentUser.address.length === 0 ||
      currentUser.cityId < 1 ||
      currentUser.postalCode.length === 0
    ) {
      areInputsValid = false;
    }
    return areInputsValid;
  }

  const handleEditProfile = (e) => {
    e.preventDefault();

    setEditProfileErrorMessage("");
    setShowEditProfileError(false);

    if (!isFormValid()) return;

    axios
      .put(
        `${constants.API_URL_PREFIX}/users/profile`,
        {
          forename: currentUser.forename,
          surname: currentUser.surname,
          email: currentUser.email,
          bornAt: currentUser.bornAt,
          gender: currentUser.gender,
          address: currentUser.address,
          cityId: currentUser.cityId,
          postalCode: currentUser.postalCode * 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        if (serverData.data.success) {
          getCurrentUser();
          handleCloseEditProfileModal();
        } else {
          setEditProfileErrorMessage(serverData.data.message);
          setShowEditProfileError(true);
        }
      });
  };

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

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.id]: e.target.value });
  };

  const allCities = cities.map((city) => (
    <option key={city.cityId} value={city.cityId}>
      {city.name}
    </option>
  ));

  const handleChangePassword = (e) => {
    if (
      editPasswordData.oldPassword.length < 6 ||
      editPasswordData.newPassword.length < 6
    ) {
      return;
    }

    setEditPasswordErrorMessage("");
    setEditPasswordSuccessMessage("");
    setShowEditPasswordError(false);
    setShowEditPasswordSuccess(false);

    axios
      .patch(
        `${constants.API_URL_PREFIX}/users/password`,
        {
          ...editPasswordData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        if (!serverData.data.success) {
          setEditPasswordErrorMessage(serverData.data.message);
          setShowEditPasswordError(true);
        }
        if (serverData.data.success) {
          setEditPasswordSuccessMessage(serverData.data.message);
          setShowEditPasswordSuccess(true);
          handleCloseEditPasswordModal();
        }
      })
      .catch((err) => console.log(`Doslo je do greske :${err}`));
  };

  const getCurrentUser = () => {
    axios
      .get(`${constants.API_URL_PREFIX}/users/profile`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      })
      .then((serverData) => {
        console.log(serverData.data);

        setCurrentUser({
          ...serverData.data,
          birthday: `${serverData.data.bornAt
            .toString()
            .substring(8, 10)}.${serverData.data.bornAt
            .toString()
            .substring(5, 7)}.${serverData.data.bornAt
            .toString()
            .substring(0, 4)}.`,
          postalCode: serverData.data.postalCode.toString(),
        });

        console.log(currentUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(getCurrentUser, []);

  const editUserProfileModal = (
    <Modal show={showEditProfileModal} onHide={handleShowEditProfileModal}>
      <Modal.Header>
        <Modal.Title>Izmenite profil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showEditProfileError && (
          <Alert variant="danger">{editProfileErrorMessage}</Alert>
        )}
        <Form onSubmit={handleEditProfile}>
          <Form.Row>
            <Form.Group as={Col} controlId="forename">
              <Form.Label>Ime</Form.Label>
              <Form.Control
                value={currentUser.forename}
                type="text"
                placeholder="Unesite Vaše ime"
                onChange={handleChange}
              />
              {currentUser.forename.length === 0 && (
                <Form.Text className="text-danger">
                  Polje za ime ne sme biti prazno.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group as={Col} controlId="surname">
              <Form.Label>Prezime</Form.Label>
              <Form.Control
                value={currentUser.surname}
                type="text"
                placeholder="Unesite Vaše prezime"
                onChange={handleChange}
              />
              {currentUser.surname.length === 0 && (
                <Form.Text className="text-danger">
                  Polje za prezime ne sme biti prazno.
                </Form.Text>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Group controlId="email">
            <Form.Label>Email adresa</Form.Label>
            <Form.Control
              value={currentUser.email}
              type="email"
              placeholder="Unesite Vašu E-mail adresu"
              onChange={handleChange}
            />
            {currentUser.email.length === 0 && (
              <Form.Text className="text-danger">
                Polje za e-mail adresu ne sme biti prazno.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Row>
            <Form.Group controlId="bornAt" as={Col}>
              <Form.Label>Datum rođenja</Form.Label>
              <Form.Control
                value={currentUser.bornAt}
                type="date"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="gender" as={Col}>
              <Form.Label>Pol</Form.Label>
              <Form.Control
                value={currentUser.gender}
                as="select"
                onChange={handleChange}
              >
                <option value="Male">Muški</option>
                <option value="Female">Ženski</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="address">
            <Form.Label>Adresa</Form.Label>
            <Form.Control
              value={currentUser.address}
              type="text"
              placeholder="Unesite Vašu adresu"
              onChange={handleChange}
            />
            {currentUser.address.length === 0 && (
              <Form.Text className="text-danger">
                Polje za adresu ne sme biti prazno.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Row>
            <Form.Group controlId="cityId" as={Col}>
              <Form.Label>Izaberite grad</Form.Label>
              <Form.Control
                value={currentUser.cityId}
                as="select"
                onChange={handleChange}
              >
                {allCities}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="postalCode" as={Col}>
              <Form.Label>Poštanski broj</Form.Label>
              <Form.Control
                value={currentUser.postalCode}
                type="number"
                placeholder="Unesite poštanski broj"
                onChange={handleChange}
              />
              {currentUser.postalCode.length === 0 && (
                <Form.Text className="text-danger">
                  Polje za poštanski broj ne sme biti prazno.
                </Form.Text>
              )}
            </Form.Group>
          </Form.Row>

          <Button variant="secondary" className="custom-bg-color" type="submit">
            <FontAwesomeIcon icon={faEdit} /> Izmenite profil
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEditProfileModal}>
          Odustani
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const editPasswordModal = (
    <Modal show={showEditPasswordModal} onHide={handleCloseEditPasswordModal}>
      <Modal.Header>
        <Modal.Title>Izmenite lozinku</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showEditPasswordError && (
          <Alert variant="danger">{editPasswordErrorMessage}</Alert>
        )}
        <Form.Group controlId="oldPassword" as={Col}>
          <Form.Label>Unesite staru lozinku</Form.Label>
          <Form.Control
            value={editPasswordData.oldPassword}
            type="password"
            onChange={(e) =>
              setEditPasswordData({
                ...editPasswordData,
                [e.target.id]: e.target.value,
              })
            }
          />
          {editPasswordData.oldPassword.length < 6 && (
            <Form.Text className="text-danger">
              Lozinka mora imati najmanje 6 znakova
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="newPassword" as={Col}>
          <Form.Label>Unesite novu lozinku</Form.Label>
          <Form.Control
            value={editPasswordData.newPassword}
            type="password"
            onChange={(e) =>
              setEditPasswordData({
                ...editPasswordData,
                [e.target.id]: e.target.value,
              })
            }
          />
          {editPasswordData.newPassword.length < 6 && (
            <Form.Text className="text-danger">
              Nova lozinka mora imati najmanje 6 znakova
            </Form.Text>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEditPasswordModal}>
          Odustani
        </Button>
        <Button variant="primary" onClick={handleChangePassword}>
          Promeni lozinku
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return !isLoggedIn ? (
    <Redirect to="/login" />
  ) : (
    <Col className="mt-2" md={{ span: 6, offset: 3 }}>
      <Card>
        <Card.Body>
          {showEditPasswordSuccess && (
            <Alert variant="success">{editPasswordSuccessMessage}</Alert>
          )}
          <Card.Title>Korisnički profil</Card.Title>
          <>
            <Button className="mr-2" onClick={handleShowEditProfileModal}>
              Izmenite profil
            </Button>
            {editUserProfileModal}
          </>
          <>
            <Button onClick={handleShowEditPasswordModal}>
              Izmenite lozinku
            </Button>
            {editPasswordModal}
          </>
          <hr />
          <Row className="mt-3">
            <Col>
              <p>
                <FontAwesomeIcon icon={faUser} />
                &nbsp;Ime i prezime
              </p>
              <h4>{`${currentUser.forename} ${currentUser.surname}`}</h4>
            </Col>
            <Col>
              <p>
                <FontAwesomeIcon icon={faEnvelope} />
                &nbsp;E-mail adresa
              </p>
              <h4>{currentUser.email}</h4>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <p>
                <FontAwesomeIcon icon={faCalendarDay} />
                &nbsp;Datum rođenja
              </p>
              <h4>{currentUser.birthday}</h4>
            </Col>
            <Col>
              <p>
                <FontAwesomeIcon icon={faVenusMars} />
                &nbsp;Pol
              </p>
              <h4>{currentUser.gender === "Male" ? "Muški" : "Ženski"}</h4>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <p>
                <FontAwesomeIcon icon={faMapMarked} />
                &nbsp;Grad
              </p>
              <h4>{currentUser.city.name}</h4>
            </Col>
            <Col>
              <p>
                <FontAwesomeIcon icon={faCity} />
                &nbsp;Poštanski broj
              </p>
              <h4>{currentUser.postalCode}</h4>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <p>
                <FontAwesomeIcon icon={faHome} />
                &nbsp;Adresa
              </p>
              <h4>{currentUser.address}</h4>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}
