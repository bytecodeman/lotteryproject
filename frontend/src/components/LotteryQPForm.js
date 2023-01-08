import React from "react";
import { Row, Col, Form, ButtonGroup, Button } from "react-bootstrap";

const audio = new Audio(`${process.env.PUBLIC_URL}/media/success.mp3`);

const LotteryQPForm = ({
  supportedGames,
  formData,
  setFormData,
  onFormSubmitter,
  onFormReset,
}) => {
  console.log(supportedGames);

  const textChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const gameClickHandler = (event) => {
    setFormData({ ...formData, game: event.target.value });
  };

  const effectsClickHandler = (event) => {
    setFormData({ ...formData, allowMedia: event.target.checked });
  };

  const submitClicker = async (event) => {
    if (formData.allowMedia) {
      await audio.play();
    }
  };

  const submitQPHandler = (event) => {
    event.preventDefault();
    onFormSubmitter(formData);
  };

  const resetForm = (event) => {
    onFormReset();
  };

  return (
    <React.Fragment>
      <section id="quickpickform">
        <Row>
          <Col>
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
                        defaultChecked={formData.game === e.shortname}
                        onClick={gameClickHandler}
                      />
                    </div>
                  ))}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Numbers to Include in Result</Form.Label>
                <Form.Control
                  type="text"
                  name="mustIncludeNumbers"
                  placeholder="Enter numbers separated by spaces"
                  value={formData.mustIncludeNumbers}
                  pattern="\s*|\s*\d+(\s+\d+)*\s*"
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Separate numbers with spaces")
                  }
                  onChange={textChangeHandler}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Force Power Ball to this value</Form.Label>
                <Form.Control
                  type="number"
                  name="desiredPowerBall"
                  min="1"
                  step="1"
                  placeholder="Enter an optional number"
                  value={formData.desiredPowerBall}
                  pattern="\s*(\d+)?\s*"
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Power Ball must be a number")
                  }
                  onChange={textChangeHandler}
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
              <ButtonGroup>
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
