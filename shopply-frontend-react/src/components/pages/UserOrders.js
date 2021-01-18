import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Modal,
  Table,
  Toast,
} from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import constants from "../../configuration/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faShoppingCart,
  faPause,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function UserOrders() {
  const [orders, setOrders] = useState([
    {
      orderId: 0,
      createdAt: "",
      status: "",
      cartId: 0,
      rating: 0,
      cart: {
        cartId: 0,
        createdAt: "",
        userId: 0,
        cartProducts: [
          {
            cartProductId: 0,
            cartId: 0,
            productId: 0,
            quantity: 0,
            product: {
              productId: 0,
              title: "",
              shortDescription: "",
              description: "",
              photoPath: "",
              categoryId: 0,
              price: 0,
              isFeatured: false,
              createdAt: "",
            },
          },
        ],
      },
    },
  ]);

  const { token } = useContext(AuthContext);

  const [activeModal, setActiveModal] = useState(null);

  const [showNotification, setShowNotification] = useState(false);

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const [ratingMessage, setRatingMessage] = useState("");

  const handleRateAnOrder = (e, orderId) => {
    e.preventDefault();
    const rating = e.target[0].value * 1;
    axios
      .patch(
        `${constants.API_URL_PREFIX}/users/orders/rate`,
        {
          orderId: orderId,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        setRatingMessage(serverData.data.message);
        setShowNotification(true);
        getAllOrdersForUser();
      });
  };

  function handleShow(e, index) {
    setActiveModal(index);
  }

  function handleClose() {
    setActiveModal(null);
  }

  const getAllOrdersForUser = () => {
    axios
      .get(`${constants.API_URL_PREFIX}/users/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((serverData) => {
        setOrders(serverData.data);
        console.log(serverData.data);
        console.log(orders);
      })
      .catch((err) => console.log(`Doslo je do greske ${err}`));
  };

  useEffect(getAllOrdersForUser, []);

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
      <Toast.Body>Porudžbina je ocenjena!</Toast.Body>
    </Toast>
  );

  return (
    <Container className="mt-2" md={{ span: 8, offset: 2 }}>
      <Card>
        <Card.Body>
          <Card.Title>Moje porudžbine</Card.Title>

          {orders.length === 0 ? (
            <p>Nemate nijednu porudžbinu!</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Porudžbina kreirana</th>
                  <th>Sadržaj korpe</th>
                  <th colSpan="2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr>
                    <td>{order.orderId}</td>
                    <td>
                      {`${order.createdAt
                        .toString()
                        .substring(
                          8,
                          10
                        )}.${order.createdAt
                        .toString()
                        .substring(
                          5,
                          7
                        )}.${order.createdAt.toString().substring(0, 4)}.`}
                    </td>
                    <td>
                      <>
                        <Button
                          variant="primary"
                          onClick={(e) => handleShow(e, index)}
                        >
                          <FontAwesomeIcon icon={faShoppingCart} />
                          &nbsp; Pogledaj sadržaj korpe
                        </Button>

                        <Modal
                          dialogClassName="modal-90w"
                          show={activeModal === index}
                          onHide={handleClose}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Sadržaj korpe</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>Proizvod</th>
                                  <th>Količina</th>
                                  <th>Ukupna cena proizvoda</th>
                                </tr>
                              </thead>

                              <tbody>
                                {order.cart.cartProducts.map((item, index) => (
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
                                      <Link
                                        to={`/products/${item.product.productId}`}
                                      >
                                        {item.product.title}
                                      </Link>
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>
                                      {item.product.price * item.quantity} RSD
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Izađi
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </>
                    </td>
                    {order.status === "accepted" && (
                      <td>
                        <span className="greenText">
                          <FontAwesomeIcon icon={faCheck} />
                          &nbsp;Prihvaćena
                        </span>
                      </td>
                    )}
                    {order.status === "rejected" && (
                      <td colspan="2">
                        <span className="redText">
                          <FontAwesomeIcon icon={faTimes} />
                          &nbsp;Odbijena
                        </span>
                      </td>
                    )}
                    {order.status === "pending" && (
                      <td colSpan="2">
                        <span>
                          <FontAwesomeIcon icon={faPause} />
                          &nbsp;Na čekanju
                        </span>
                      </td>
                    )}

                    {order.status === "accepted" &&
                      (order.rating === 0 ? (
                        <td>
                          <Form
                            onSubmit={(e) =>
                              handleRateAnOrder(e, order.orderId)
                            }
                          >
                            <Form.Group>
                              <Form.Label>Ocenite porudžbinu</Form.Label>
                              <Form.Control
                                defaultValue="1"
                                step="1"
                                min="1"
                                max="5"
                                type="number"
                                placeholder="Ocena"
                              />
                              <Button type="submit" className="mt-2">
                                Ocenite
                              </Button>
                            </Form.Group>
                          </Form>
                        </td>
                      ) : (
                        <td>
                          <strong>Ocena: </strong>
                          {order.rating}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {toast}
        </Card.Body>
      </Card>
    </Container>
  );
}
