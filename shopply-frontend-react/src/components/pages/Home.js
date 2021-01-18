import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import constants from "../../configuration/constants";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${constants.API_URL_PREFIX}/products/featured`)
      .then((featuredProductsData) => {
        setFeaturedProducts(featuredProductsData.data);
        return axios.get(`${constants.API_URL_PREFIX}/products/latest`);
      })
      .then((latestProductsData) => {
        setLatestProducts(latestProductsData.data);
      })
      .catch((err) => console.log(`Doslo je do greske ${err}`));
  }, []);

  const allFeaturedProducts = featuredProducts.map((product) => (
    <Col md="4" className="mb-2">
      <Card>
        <Card.Img variant="top" src={product.photoPath} />
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <p>
            <em>{product.shortDescription}</em>
          </p>
          <Button
            variant="secondary"
            className="custom-bg-color"
            as={Link}
            to={`/products/${product.productId}`}
          >
            Pogledaj proizvod
          </Button>
        </Card.Body>
      </Card>
    </Col>
  ));

  const allLatestProducts = latestProducts.map((product) => (
    <Col md="4" className="mb-2">
      <Card>
        <Card.Img variant="top" src={product.photoPath} />
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <p>
            <em>{product.shortDescription}</em>
          </p>
          <Button
            variant="secondary"
            className="custom-bg-color"
            as={Link}
            to={`/products/${product.productId}`}
          >
            Pogledaj proizvod
          </Button>
        </Card.Body>
      </Card>
    </Col>
  ));

  return (
    <Container className="mt-2">
      <Card>
        <Card.Body>
          <Card.Title>Početna strana</Card.Title>
        </Card.Body>
        <h3 className="mx-3 my-3">Izdvajamo iz ponude</h3>
        <Row className="mx-1">{allFeaturedProducts}</Row>
        <hr />
        <h3 className="mx-3 my-3">Najnoviji proizvodi</h3>
        <Row className="mx-1">{allLatestProducts}</Row>
      </Card>
    </Container>
  );
}
