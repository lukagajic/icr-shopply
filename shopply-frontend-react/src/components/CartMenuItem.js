import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import constants from "../configuration/constants";
import { AuthContext } from "../contexts/AuthContext";

export default function CartMenuItem() {
  const { token } = useContext(AuthContext);

  const [productCount, setProductCount] = useState(0);

  const getCartDetails = () => {
    console.log(token);
    if (token) {
      axios
        .get(`${constants.API_URL_PREFIX}/users/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((serverData) => {
          window.addEventListener("updatedcart", getCartDetails);
          if (serverData.data !== null) {
            setProductCount(serverData.data.cartProducts.length);
          } else {
            setProductCount(0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(getCartDetails, []);

  return (
    <Button as={Link} to="/user/cart" variant="warning">
      <FontAwesomeIcon icon={faShoppingCart} /> Moja korpa{" "}
      <Badge variant="light">{productCount}</Badge>
    </Button>
  );
}
