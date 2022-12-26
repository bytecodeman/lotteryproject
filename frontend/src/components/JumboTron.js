import React, { useState } from "react";
import { Container, Row, Col, Button, Modal, Figure } from "react-bootstrap";
import ImgWithFallback from "./ImgWithFallback";
import logoPng from "../img/logo512.png";
import logoWebP from "../img/logo512.webp";
import tony from "../img/TonySilvestri.jpg";

function JumboTron() {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <Container className="py-5">
        <Row>
          <Col className="mb-4">
            <h1 className="display-5 fw-bold text-center text-md-start">
              Generate Quick Picks!
            </h1>
          </Col>
        </Row>
        <Row>
          <Col md="3" className="text-center mb-4">
            <ImgWithFallback
              src={logoWebP}
              fallback={logoPng}
              alt="Generate Quick Picks"
              title="Generate Quick Picks"
              className="img-fluid rounded"
            />
          </Col>
          <Col md="9">
            <p>
              This app generates quick picks for popular lotteries. If you see a
              number combination that strikes you, you know what to do!
            </p>
            <p>You can now email the quickpicks!!!</p>
            <p>For amusement only!!!</p>
            <p>
              <a
                href="https://github.com/bytecodeman/lotteryproject"
                target="_blank"
                rel="noreferrer"
              >
                Source Code for Both FrontEnd and BackEnd
              </a>
            </p>
            <p>
              <Button variant="primary" onClick={handleShowModal}>
                About
              </Button>
            </p>
          </Col>
        </Row>
      </Container>
      {showModal ? (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          dialogClassName="modal-90w"
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Generate Quick Picks!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              This app generates quick picks for popular lotteries. If you see a
              number combination that strikes you, you know what to do!
            </p>
            <p>For amusement only!!!</p>
            <Figure>
              <Figure.Image
                width={139}
                height={140}
                alt="Tony Silvestri"
                src={tony}
              />
              <Figure.Caption>
                Designed and Coded by:{" "}
                <a href="mailto:tonysilvestri@bytecodeman.com">
                  Antonio C. Silvestri
                </a>
              </Figure.Caption>
            </Figure>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
}

export default JumboTron;
