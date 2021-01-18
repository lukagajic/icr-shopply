import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Table,
  Modal,
  Toast,
} from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import constants from "../../configuration/constants";
import { AuthContext } from "../../contexts/AuthContext";

export default function CartDetails() {
  const { userId, token, isLoggedIn } = useContext(AuthContext);

  const [showNotification, setShowNotification] = useState(false);

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const [cart, setCart] = useState({
    cartId: 0,
    userId: 0,
    createdAt: "",
    cartProducts: [],
  });

  const [activeModal, setActiveModal] = useState(null);

  function handleShow(e, index) {
    setActiveModal(index);
  }

  function handleClose() {
    setActiveModal(null);
  }

  function getCartDetails() {
    axios
      .get(`${constants.API_URL_PREFIX}/users/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((serverData) => {
        setCart(serverData.data);
        console.log(cart);
        window.addEventListener("onCartUpdate", () => getCartDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(getCartDetails, []);

  const handleChange = (e, cartId, productId) => {
    if (e.target.value < 0) {
      return;
    }
    console.log(e.target.value);
    axios
      .patch(
        `${constants.API_URL_PREFIX}/users/cart`,
        {
          cartId,
          productId,
          quantity: e.target.value * 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        getCartDetails();
      })
      .catch((err) => console.log(`Doslo je do greske ${err}`));
  };

  const handleRemoveFromCart = (e, cartId, productId) => {
    console.log(cartId);
    console.log(productId);

    axios
      .patch(
        `${constants.API_URL_PREFIX}/users/cart`,
        {
          cartId,
          productId,
          quantity: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        window.dispatchEvent(new CustomEvent("updatedcart"));
        getCartDetails();
      })
      .catch((err) => console.log(`Doslo je do greske ${err}`));
  };

  const handleMakeAnOrder = () => {
    console.log("KLIK");
    axios
      .post(
        `${constants.API_URL_PREFIX}/users/orders`,
        {
          cartId: cart.cartId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        window.dispatchEvent(new CustomEvent("updatedcart"));
        getCartDetails();
        setShowNotification(true);
      })
      .catch((err) => console.log(`Doslo je do greske ${err}`));
  };

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
      <Toast.Body>Uspešno ste izvršili porudžbinu!</Toast.Body>
    </Toast>
  );

  return !isLoggedIn ? (
    <Redirect to="/login" />
  ) : (
    <Container className="mt-2">
      <Card>
        <Card.Body>
          <Card.Title>Moja korpa</Card.Title>

          {cart === null ||
          !cart.cartProducts ||
          cart.cartProducts.length === 0 ? (
            <p>Vaša korpa je prazna!</p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Proizvod</th>
                    <th>Količina</th>
                    <th>Ukupna cena proizvoda</th>
                    <th colspan="2">Akcije</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Ukupna cena korpe</th>
                    <td colspan="4">
                      {cart.cartProducts.reduce((accumulator, current) => {
                        return (
                          accumulator + current.quantity * current.product.price
                        );
                      }, 0)}{" "}
                      RSD
                    </td>
                  </tr>
                </tfoot>
                <tbody>
                  {cart.cartProducts.map((item, index) => (
                    <tr>
                      <td>
                        <img
                          src={item.product.photoPath}
                          alt={item.product.title}
                          style={{
                            width: "100px",
                            paddingRight: "5px",
                          }}
                        />
                        <Link to={`/products/${item.product.productId}`}>
                          {item.product.title}
                        </Link>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{item.product.price * item.quantity} RSD</td>
                      <td className="w-25">
                        <Form.Label>Izmeni količinu</Form.Label>
                        <Form.Control
                          step="1"
                          min="1"
                          value={item.quantity}
                          type="number"
                          placeholder="Količina"
                          onChange={(e) =>
                            handleChange(e, cart.cartId, item.product.productId)
                          }
                        />
                      </td>
                      <td>
                        <>
                          <Button
                            variant="danger"
                            onClick={(e) => handleShow(e, index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            &nbsp; Ukloni iz korpe
                          </Button>

                          <Modal
                            show={activeModal === index}
                            onHide={handleClose}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Uklanjanje iz korpe</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Da li ste sigurni da želite da uklonite ovaj
                              proizvod iz korpe:&nbsp;
                              <strong>{item.product.title}</strong>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Ne
                              </Button>
                              <Button
                                variant="primary"
                                onClick={(e) =>
                                  handleRemoveFromCart(
                                    e,
                                    cart.cartId,
                                    item.product.productId
                                  )
                                }
                              >
                                Da
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <hr />
              <Button
                onClick={() => handleMakeAnOrder()}
                variant="success"
                className="mb-2"
              >
                Izvrši porudžbinu
              </Button>
              <br />
            </>
          )}

          {toast}
        </Card.Body>
      </Card>
    </Container>
  );
}
