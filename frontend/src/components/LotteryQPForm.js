import React, { useState, useEffect } from "react";
import { Row, Col, Form, ButtonGroup, Button } from "react-bootstrap";
import "./LotteryQPForm.css";

const audio = new Audio("media/success.mp3");
let saveSupportedGames;

const LotteryQPForm = (props) => {
  const [supportedGames, setSupportedGames] = useState();
  const [number, setNumber] = useState(1);
  const [game, setGame] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (saveSupportedGames) {
        setSupportedGames(saveSupportedGames);
      } else {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BASEURL}/supportedgames`
          );
          if (!response.ok) {
            throw new Error(response.status);
          }
          const responseData = await response.json();
          setSupportedGames(responseData.gs.gamesSupported);
          saveSupportedGames = responseData.gs.gamesSupported;
        } catch (error) {
          setErrMsg(error.message || "Something went wrong!");
        }
      }
    })();
  }, []);

  const numberChangeHandler = (event) => {
    setNumber(event.target.value);
  };

  const gameClickHandler = (event) => {
    setGame(event.target.value);
  };

  const effectsClickHandler = (event) => {
    props.setAllowMedia(event.target.checked);
  };

  const submitClicker = (event) => {
    if (props.allowMedia) {
      audio.play();
    }
    return true;
  };

  const submitQPHandler = (event) => {
    event.preventDefault();
    if (props.tokenVerified === true) {
      props.onFormSubmitter(game, number);
    }
  };

  const resetForm = (event) => {
    setNumber(1);
    setGame("");
    props.onFormReset();
    props.setAllowMedia(false);
  };

  let formLoadState;

  if (!errMsg && !supportedGames) {
    formLoadState = <h2>Loading Form . . .</h2>;
  } else if (errMsg) {
    props.onError("Error Retrieving Supported Games");
  }

  return (
    <React.Fragment>
      <section id="quickpickform">
        <Row>
          <Col>
            {formLoadState}
            <Form onReset={resetForm} onSubmit={submitQPHandler}>
              <Form.Group controlId="NoOfQuickPicks" className="mb-4">
                <Form.Label>No of QuickPicks</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="25"
                  step="1"
                  placeholder="Enter a number between 1 and 25"
                  value={number}
                  required
                  onChange={numberChangeHandler}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                {supportedGames &&
                  supportedGames.map((e) => (
                    <div key={e.shortname + "div"} className="mb-2">
                      <Form.Check
                        type="radio"
                        name="LotteryGame"
                        label={[
                          <strong key={e.shortname + "strong"}>
                            {e.longname}
                          </strong>,
                          ": ",
                          e.description,
                        ]}
                        value={e.shortname}
                        id={e.shortname}
                        key={e.shortname + "check"}
                        data-padding={e.padding}
                        required /* checked={game === e.shortname} */
                        onClick={gameClickHandler}
                      />
                    </div>
                  ))}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="allowEffects"
                  label="Allow Media Effects?"
                  onClick={effectsClickHandler}
                />
              </Form.Group>
              <ButtonGroup>
                <Button
                  type="submit"
                  variant="primary"
                  onClick={submitClicker}
                  disabled={!game}
                >
                  Generate Quick Picks
                </Button>
                <Button type="reset" variant="secondary">
                  Reset
                </Button>
              </ButtonGroup>
            </Form>
          </Col>
        </Row>
      </section>
    </React.Fragment>
  );
};

export default LotteryQPForm;
