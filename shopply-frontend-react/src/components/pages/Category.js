import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";

import { Link, useHistory, useParams } from "react-router-dom";
import constants from "../../configuration/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

export default function Category() {
  const history = useHistory();
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [subCategories, setSubcategories] = useState([]);
  const { categoryId } = useParams();

  const [categoryFeatures, setCategoryFeatures] = useState([]);

  const [searchData, setSearchData] = useState({
    startingPrice: 0,
    endingPrice: 0,
  });

  useEffect(() => {
    axios
      .get(`${constants.API_URL_PREFIX}/categories/${categoryId}`)
      .then((serverData) => {
        setCategory(serverData.data);
        return axios.get(
          `${constants.API_URL_PREFIX}/categories/${categoryId}/products`
        );
      })
      .then((newData) => {
        setProducts(newData.data);
        return axios.get(
          `${constants.API_URL_PREFIX}/categories/${categoryId}/subcategories`
        );
      })
      .then((subcategoryData) => {
        setSubcategories(subcategoryData.data);
        return axios.get(
          `${constants.API_URL_PREFIX}/categories/${categoryId}/features`
        );
      })
      .then((categoryFeaturesData) => {
        setCategoryFeatures(categoryFeaturesData.data);
        console.log(categoryFeaturesData.data);
      })
      .catch((err) => {
        console.log("Doslo je do greske!");
      });
  }, [categoryId]);

  const allProducts = products.map((product) => (
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    let searchObject = {};

    if ([e.target[0].value] * 1 > 0 && [e.target[1].value] * 1 > 0) {
      searchObject = {
        [e.target[0].id]: e.target[0].value * 1,
        [e.target[1].id]: e.target[1].value * 1,
      };
    } else if ([e.target[0].value] * 1 > 0) {
      searchObject = {
        [e.target[0].id]: e.target[0].value * 1,
      };
    } else if ([e.target[1].value] * 1 > 0) {
      searchObject = {
        [e.target[1].id]: e.target[1].value * 1,
      };
    }

    searchObject.categoryFeatures = [];

    for (let i = 2; i < e.target.length - 1; i++) {
      if (e.target[i].value !== "Izaberite...") {
        searchObject.categoryFeatures.push({
          id: e.target[i].id * 1,
          value: e.target[i].value,
        });
      }
    }

    searchObject.categoryId = categoryId * 1;

    axios
      .post(`${constants.API_URL_PREFIX}/products/search`, searchObject)
      .then((serverData) => {
        console.log(serverData.data);
        setProducts(serverData.data);
      })
      .catch((err) => console.log(`Doslo je do greske: ${err}`));
  };

  return (
    <Row>
      <Col className="mt-2" md={{ span: 3 }}>
        <Card>
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon icon={faList} />
              &nbsp; Potkategorije
            </Card.Title>
            {subCategories.length > 0 ? (
              <ListGroup>
                {subCategories.map((subcategory) => (
                  <ListGroup.Item
                    key={subcategory.categoryId}
                    action
                    onClick={() =>
                      history.push(`/categories/${subcategory.categoryId}`)
                    }
                  >
                    {subcategory.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>Za ovu kategoriju nema potkategorija.</p>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col className="mt-2" md={{ span: 9 }}>
        <Card>
          <Card.Body>
            <Card.Title>{category.title}</Card.Title>
            <p>
              <em>{category.description}</em>
            </p>

            {products.length > 0 && (
              <>
                <hr />
                <h5>Pretraga proizvoda</h5>
                <Row className="mx-1">
                  <Form onSubmit={handleSearchSubmit}>
                    <Form.Row>
                      <Form.Group controlId="minPrice" className="mr-2">
                        <Form.Label>Početna cena</Form.Label>
                        <Form.Control min="0" type="number" defaultValue="0" />
                      </Form.Group>
                      <Form.Group controlId="maxPrice">
                        <Form.Label>Krajnja cena</Form.Label>
                        <Form.Control min="0" type="number" defaultValue="0" />
                      </Form.Group>
                    </Form.Row>
                    {categoryFeatures.length > 0 && (
                      <Form.Row>
                        {categoryFeatures.map((categoryFeature) => (
                          <Form.Group
                            controlId={categoryFeature.featureId}
                            className="m-2"
                          >
                            <Form.Label>{categoryFeature.title}</Form.Label>
                            <Form.Control as="select">
                              <option>Izaberite...</option>
                              {categoryFeature.values.map((value) => (
                                <option>{value}</option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                        ))}
                      </Form.Row>
                    )}
                    <Button type="submit">Izvrši pretragu</Button>
                  </Form>
                </Row>
              </>
            )}

            <hr />

            {products.length > 0 ? (
              <>
                <Row className="mx-1 mt-3">
                  <h4>Proizvodi</h4>
                </Row>
                <Row>{allProducts}</Row>
              </>
            ) : (
              <p>Ne postoje proizvodi u ovoj kategoriji.</p>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
