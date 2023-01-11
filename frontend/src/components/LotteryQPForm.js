import React, { useState, useRef } from "react";
import { Row, Col, Form, ButtonGroup, Button } from "react-bootstrap";

const audio = new Audio(`${process.env.PUBLIC_URL}/media/success.mp3`);

const LotteryQPForm = ({
  supportedGames,
  formData,
  setFormData,
  onFormSubmitter,
  onFormReset,
}) => {
  const [errMsg, setErrMsg] = useState();
  const mustIncludeNumbers = useRef();
  const pBall = useRef();

  const gameInfo = supportedGames.find((e) => e.shortname === formData.game);

  const textChangeHandler = (event) => {
    event.target.setCustomValidity("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const gameClickHandler = (event) => {
    event.persist();
    setFormData((prev) => {
      if (prev.game !== event.target.value) {
        return {
          ...formData,
          game: event.target.value,
          quickPicks: null,
          mustIncludeNumbers: "",
          desiredPowerBall: "",
        };
      }
      return { ...formData, game: event.target.value };
    });
  };

  const effectsClickHandler = (event) => {
    setFormData({ ...formData, allowMedia: event.target.checked });
  };

  const submitClicker = async (event) => {
    if (formData.allowMedia) {
      await audio.play();
    }
  };

  const includeNumbersState = (mustIncludeNumbers) => {
    const arrMustIncludeNumbers1 = mustIncludeNumbers
      .split(/[\s,]+/)
      .filter((e) => e.trim() !== "");
    const arrMustIncludeNumbers2 = arrMustIncludeNumbers1
      .map((e) => Number(e))
      .filter((e) => e >= gameInfo.minnumber && e <= gameInfo.maxnumber);
    if (arrMustIncludeNumbers1.length !== arrMustIncludeNumbers2.length) {
      return "Numbers to Include in Result have Values Found That Are Out of Range for this Game";
    }
    if (arrMustIncludeNumbers1.length > gameInfo.count) {
      return "Too many Must Include Values Encountered";
    }
    return "";
  };

  const desiredPowerBallState = (desiredPowerBall) => {
    const intDesiredPowerBall = Number(desiredPowerBall);
    if (gameInfo.pball) {
      if (intDesiredPowerBall !== 0) {
        if (
          intDesiredPowerBall < gameInfo.pball.minnumber ||
          intDesiredPowerBall > gameInfo.pball.maxnumber
        ) {
          return "Desired Power Ball Out of Range for this Game";
        }
      }
    } else {
      if (intDesiredPowerBall !== 0) {
        return "No Desired Power Ball Allowed for this Game";
      }
    }
    return "";
  };

  const submitQPHandler = (event) => {
    event.preventDefault();
    let errMsg = "";
    const strIncludeNumberState = includeNumbersState(
      formData.mustIncludeNumbers
    );
    if (strIncludeNumberState) {
      errMsg += strIncludeNumberState;
    }
    const strDesiredPowerBallState = desiredPowerBallState(
      formData.desiredPowerBall
    );
    if (strDesiredPowerBallState) {
      if (errMsg) {
        errMsg += "<br>";
      }
      errMsg += strDesiredPowerBallState;
    }
    if (errMsg) {
      setErrMsg(errMsg);
      setFormData({ ...formData, qp: null });
    } else {
      setErrMsg("");
      onFormSubmitter(formData);
    }
  };

  const resetForm = (event) => {
    onFormReset();
  };

  return (
    <React.Fragment>
      <section id="quickpickform">
        <Row>
          <Col>
            {errMsg && (
              <p
                className="alert alert-danger"
                dangerouslySetInnerHTML={{ __html: errMsg }}
              ></p>
            )}
            <Form onSubmit={submitQPHandler} onReset={resetForm}>
              <Form.Group controlId="NoOfQuickPicks" className="mb-4">
                <Form.Label>No of QuickPicks</Form.Label>
                <Form.Control
                  type="number"
                  name="number"
                  min="1"
                  max="25"
                  step="1"
                  placeholder="Enter a number between 1 and 25"
                  value={formData.number}
                  required
                  onChange={textChangeHandler}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                {supportedGames.map((e) => (
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
                      defaultChecked={formData.game === e.shortname}
                      onClick={gameClickHandler}
                    />
                  </div>
                ))}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Numbers to Include in Result</Form.Label>
                <Form.Control
                  ref={mustIncludeNumbers}
                  type="text"
                  name="mustIncludeNumbers"
                  placeholder={
                    !formData.game || gameInfo.type !== 0
                      ? "Option not allowed for this game"
                      : "Enter numbers separated by spaces or comma"
                  }
                  value={formData.mustIncludeNumbers}
                  pattern="\s*\d+((\s*,?\s*)\d+)*\s*"
                  onInvalid={(e) =>
                    e.target.setCustomValidity(
                      "Separate numbers with spaces or comma"
                    )
                  }
                  onChange={textChangeHandler}
                  disabled={!formData.game || gameInfo.type !== 0}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Force Power Ball to this value</Form.Label>
                <Form.Control
                  ref={pBall}
                  type="number"
                  name="desiredPowerBall"
                  min="1"
                  step="1"
                  placeholder={
                    !formData.game || !gameInfo.pball
                      ? "Option not allowed for this game"
                      : "Enter an optional number"
                  }
                  value={formData.desiredPowerBall}
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Power Ball must be a number")
                  }
                  onChange={textChangeHandler}
                  disabled={!formData.game || !gameInfo.pball}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="allowEffects"
                  label="Allow Media Effects?"
                  onClick={effectsClickHandler}
                />
              </Form.Group>
              <ButtonGroup className="mb-5">
                <Button
                  type="submit"
                  variant="primary"
                  onClick={submitClicker}
                  disabled={!formData.game}
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
