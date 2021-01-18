import { Button, Card, Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import constants from "../../configuration/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${constants.API_URL_PREFIX}/categories`)
      .then((serverData) => {
        setCategories(
          serverData.data.filter((item) => item.parentCategory == null)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const allCategories = categories.map((category) => (
    <Col md="4" className="mb-2">
      <Card>
        <Card.Img variant="top" src={category.photoPath} />
        <Card.Body>
          <Card.Title>{category.title}</Card.Title>
          <p>
            <em>{category.description}</em>
          </p>
          <Button
            variant="secondary"
            className="custom-bg-color"
            as={Link}
            to={`/categories/${category.categoryId}`}
          >
            Pogledaj više
          </Button>
        </Card.Body>
      </Card>
    </Col>
  ));

  return (
    <Row>
      <Col className="mt-2" md={{ span: 8, offset: 2 }}>
        <Card>
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon icon={faList} />
              &nbsp; Kategorije
            </Card.Title>
            <Row>{allCategories}</Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
