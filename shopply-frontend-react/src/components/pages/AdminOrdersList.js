import { useContext, useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Table,
  Form,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import constants from "../../configuration/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPause,
  faShoppingCart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminOrdersList() {
  const { userRole, token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  function handleShow(e, index) {
    setActiveModal(index);
  }

  function handleClose() {
    setActiveModal(null);
  }

  const getAllOrders = () => {
    axios
      .get(`${constants.API_URL_PREFIX}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((serverData) => {
        console.log(serverData.data);
        setOrders(
          serverData.data.map((orderData) => {
            return {
              ...orderData,
              orderPrice: calculateCartPrice(orderData),
            };
          })
        );
      })
      .catch((err) => console.log(`Doslo je do greske ${err}`));
  };

  const calculateCartPrice = (order) =>
    order.cart.cartProducts.reduce(
      (accumulator, current) =>
        accumulator + current.quantity * current.product.price,
      0
    );

  useEffect(getAllOrders, []);

  const handleChangeOrderStatus = (e, orderId) => {
    e.preventDefault();
    const newStatus = e.target[0].value;

    axios
      .patch(
        `${constants.API_URL_PREFIX}/orders/${orderId}/updateStatus`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((serverData) => {
        if (serverData.data.success) {
          getAllOrders();
        }
      })
      .catch((err) => console.log(`Doslo je do greske ${err}`));
  };

  return userRole !== "admin" ? (
    <Redirect to="/" />
  ) : (
    <Container className="mt-2">
      <Card>
        <Card.Body>
          <Card.Title>Administrativni panel</Card.Title>
          {orders.length === 0 ? (
            <p>Ne postoji nijedna zavedena porudžbina!</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Porudžbina kreirana</th>
                  <th>Sadržaj korpe</th>
                  <th>Ukupna cena korpe</th>
                  <th>Korisnik</th>
                  <th>Status</th>
                  <th>Akcije</th>
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
                          &nbsp; Sadržaj korpe
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
                    <td>{order.orderPrice} RSD</td>
                    <td>
                      {`${order.cart.user.forename} ${order.cart.user.surname}`}
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
                      <td>
                        <span className="redText">
                          <FontAwesomeIcon icon={faTimes} />
                          &nbsp;Odbijena
                        </span>
                      </td>
                    )}
                    {order.status === "pending" && (
                      <td>
                        <span>
                          <FontAwesomeIcon icon={faPause} />
                          &nbsp;Na čekanju
                        </span>
                      </td>
                    )}
                    <td>
                      <Form
                        onSubmit={(e) =>
                          handleChangeOrderStatus(e, order.orderId)
                        }
                      >
                        <Form.Group>
                          <Form.Label>Izmenite status</Form.Label>
                          <Form.Control defaultValue={order.status} as="select">
                            <option value="accepted">Prihvaćena</option>
                            <option value="rejected">Odbijena</option>
                            <option value="pending">Na čekanju</option>
                          </Form.Control>
                          <Button className="mt-2" type="submit">
                            Izmenite status
                          </Button>
                        </Form.Group>
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
