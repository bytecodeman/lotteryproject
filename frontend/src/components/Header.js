import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import "./Header.css";
import bsLogo from "../img/bslogo.svg";

const Header = (props) => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="https://bytecodeman.com/specialapps/">
          <img
            src={bsLogo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap App"
            title="A React Bootstrap App"
          />{" "}
          Special Apps
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            <NavDropdown title="Other Apps" id="basic-nav-dropdown">
              <NavDropdown.Item href="#" disabled className="text-center">
                Math Apps
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://bytecodeman.com/specialapps/factoring/">
                Number Factoring
              </NavDropdown.Item>
              <NavDropdown.Item href="https://bytecodeman.com/specialapps/gcflcm/">
                GCF/LCM Calculator
              </NavDropdown.Item>
              <NavDropdown.Item href="https://bytecodeman.com/specialapps/lcm/">
                Algebraic LCM Solver
              </NavDropdown.Item>
              <NavDropdown.Item href="https://bytecodeman.com/specialapps/baseconverter/">
                Number Base Converter
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#" disabled className="text-center">
                Fun Apps
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="https://lotteryquickpick.herokuapp.com/"
                className="active"
              >
                Lottery Quick Picks
              </NavDropdown.Item>
              <NavDropdown.Item href="https://bytecodeman.com/specialapps/alphametics/">
                Alphametics Solver
              </NavDropdown.Item>
              <NavDropdown.Item href="https://bytecodeman.com/specialapps/wordscape/">
                Wordscape Assistant
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="https://bytecodeman.com/" target="_blank">
              bytecodeman.com
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
