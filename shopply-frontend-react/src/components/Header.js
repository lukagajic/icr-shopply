import { Badge, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../contexts/CartContext";
import CartMenuItem from "./CartMenuItem";

export default function Header() {
  const { email, isLoggedIn, userRole } = useContext(AuthContext);

  return (
    <Navbar
      collapseOnSelect
      className="custom-bg-color"
      expand="lg"
      variant="dark"
    >
      <Navbar.Brand>
        <img
          alt="logo"
          className="logo-image"
          src="https://i.ibb.co/j6bGZS7/logo.png"
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            Početna strana
          </Nav.Link>
          <Nav.Link as={Link} to="/categories">
            Kategorije
          </Nav.Link>
        </Nav>
        {isLoggedIn ? (
          <>
            <CartMenuItem />

            <NavDropdown
              alignRight="true"
              title={email}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/user/profile">
                Profil
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/user/orders">
                Moje porudžbine
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">
                Odjavite se
              </NavDropdown.Item>
            </NavDropdown>

            {userRole === "admin" && (
              <Nav.Link as={Link} to="/admin/dashboard">
                Administrativni panel
              </Nav.Link>
            )}
          </>
        ) : (
          <Nav>
            <Nav.Link as={Link} to="/login">
              Prijavite se
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Registrujte se
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
