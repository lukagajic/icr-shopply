import {
  faFrown,
  faInfoCircle,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Toast,
} from "react-bootstrap";
import { useParams } from "react-router-dom";

import constants from "../../configuration/constants";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProductDetails() {
  const { productId } = useParams();
  const { token, isLoggedIn, userId } = useContext(AuthContext);

  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSatisfactionOption, setSelectedSatisfactionOption] = useState(
    "positive"
  );
  const [productFeatures, setProductFeatures] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const [itemCount, setItemCount] = useState(1);

  const [userReviewString, setUserReviewString] = useState("");

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const handleAddReview = (e) => {
    if (userReviewString.length === 0) return;

    const data = {
      productId: parseInt(productId),
      satisfaction: selectedSatisfactionOption,
      content: userReviewString,
    };

    axios
      .post(`${constants.API_URL_PREFIX}/reviews`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getProductDetails();
        handleClose();
        setUserReviewString("");
      })
      .catch((err) => {
        console.log("Doslo je do greske!");
      });
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const addProductToCart = (e) => {
    axios
      .post(
        `${constants.API_URL_PREFIX}/users/cart`,
        {
          productId: product.productId,
          quantity: itemCount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        window.dispatchEvent(new CustomEvent("updatedcart"));
        setShowNotification(true);
      })
      .catch((err) => console.log(`Doslo je do greske: ${err}`));
  };

  const getProductDetails = () => {
    axios
      .get(`${constants.API_URL_PREFIX}/products/${productId}`)
      .then((serverData) => {
        setProduct(serverData.data);
        console.log(product);

        return axios.get(
          `${constants.API_URL_PREFIX}/products/${productId}/reviews`
        );
      })
      .then((reviewsData) => {
        setReviews(
          reviewsData.data.map((review) => {
            return {
              ...review,
              commentCreationDate: new Date(review.createdAt),
            };
          })
        );
        console.log(reviews);
        return axios.get(
          `${constants.API_URL_PREFIX}/products/${productId}/features`
        );
      })
      .then((productFeaturesData) => {
        setProductFeatures(productFeaturesData.data);
        console.log(productFeaturesData);
      })
      .catch((err) => console.log("Doslo je do greske!"));
  };

  useEffect(getProductDetails, []);

  const toast = (
    <Toast
      style={{
        position: "fixed",
        left: "50%",
        bottom: "10px",
        transform: "translate(-50%, -50%)",
      }}
      show={showNotification}
      onClose={handleNotificationClose}
      delay={3000}
      autohide
    >
      <Toast.Header>
        <strong className="mr-auto">Shopply</strong>
        <small>Upravo sada</small>
      </Toast.Header>
      <Toast.Body>Uspešno ste dodali proizvod u korpu!</Toast.Body>
    </Toast>
  );

  const allReviews = reviews.map((review) => (
    <Row>
      <Col>
        <Card className="my-2">
          <Card.Body>
            <Card.Title>
              {review.user.forename +
                " " +
                review.user.surname +
                " - " +
                review.user.email}
            </Card.Title>
            <small>
              Postavljeno{" "}
              {review.commentCreationDate.getDate() +
                "." +
                (review.commentCreationDate.getMonth() + 1) +
                "." +
                review.commentCreationDate.getFullYear() +
                ". u " +
                review.commentCreationDate.getHours() +
                ":" +
                (review.commentCreationDate.getMinutes() < 9
                  ? "0" + (review.commentCreationDate.getMinutes() + 1)
                  : review.commentCreationDate.getMinutes() + 1)}
            </small>
            <p
              className={
                review.satisfaction === "positive" ? "greenText" : "redText"
              }
            >
              <em>
                {review.satisfaction === "positive" ? (
                  <p>
                    <FontAwesomeIcon icon={faSmile} /> Korisnik je zadovoljan
                    proizvodom
                  </p>
                ) : (
                  <p>
                    <FontAwesomeIcon icon={faFrown} /> Korisnik nije zadovoljan
                    proizvodom
                  </p>
                )}
              </em>
            </p>
            <p>{review.content}</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  ));

  return (
    <Container className="mt-2">
      <Card>
        <Card.Body>
          <Card.Title>
            <FontAwesomeIcon icon={faInfoCircle} />
            &nbsp; Detalji o proizvodu
          </Card.Title>
          <Row>
            <Col md="4">
              <img src={product.photoPath} alt={product.title} />
            </Col>
            <Col md="8">
              <h4>{product.title}</h4>
              <p>
                <strong>Opis:</strong> {product.description}
              </p>
              <h5>Karakteristike proizvoda</h5>
              <ul>
                {productFeatures.map((productFeature) => (
                  <li>
                    {productFeature.feature.title + ": " + productFeature.value}
                  </li>
                ))}
              </ul>
              <Row>
                <Col>
                  <h3>Cena: {product.price} dinara</h3>
                </Col>
                {isLoggedIn && (
                  <Col>
                    <Form.Group>
                      <Form.Label>Izaberite količinu</Form.Label>
                      <Form.Control
                        value={itemCount}
                        onChange={(e) => setItemCount(e.target.value * 1)}
                        step="1"
                        min="1"
                        type="number"
                        placeholder="Količina"
                      />
                      <Button className="mt-2" onClick={addProductToCart}>
                        Dodaj u korpu
                      </Button>
                    </Form.Group>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
          <Row className="mx-1">
            <h4>Komentari &#40;{reviews.length}&#41;</h4>
            {isLoggedIn && (
              <>
                <Button className="ml-2" variant="primary" onClick={handleShow}>
                  Ostavite komentar
                </Button>

                <Modal size="lg" centered show={showModal} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Ostavite komentar</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group>
                      <Form.Label>Utisak o proizvodu</Form.Label>
                      <Form.Control
                        value={selectedSatisfactionOption}
                        onChange={(e) =>
                          setSelectedSatisfactionOption(e.target.value)
                        }
                        as="select"
                      >
                        <option value="positive">Pozitivan</option>
                        <option value="negative">Negativan</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Unesite tekst komentara</Form.Label>
                      <Form.Control
                        value={userReviewString}
                        as="textarea"
                        rows={3}
                        onChange={(e) => setUserReviewString(e.target.value)}
                      />
                      {userReviewString.length === 0 && (
                        <Form.Text className="text-danger">
                          Polje za komentar ne sme biti prazno.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Odustani
                    </Button>
                    <Button variant="primary" onClick={handleAddReview}>
                      Pošalji komentar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </Row>
          {allReviews}

          {toast}
        </Card.Body>
      </Card>
    </Container>
  );
}
