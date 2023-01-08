import React, { useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import QuickPickList from "./QuickPickList";

import "react-toastify/dist/ReactToastify.css";
import "./SendResults.css";

function SendResults({ formData, setQuickPicks, setErrMsg, history }) {
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState(null);

  const cancel = () => {
    history.replace(`{$process.env.PUBLIC_URL}`);
  };

  const emailResults = async () => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    if (!pattern.test(email)) {
      setFormErrors("Please enter valid email address.");
    } else {
      try {
        setFormErrors(null);
        const response = await fetch(`${process.env.REACT_APP_BASEURL}/send`, {
          method: "POST",
          body: JSON.stringify({ email, quickPicks: formData.quickPicks }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const message = await response.json();

        if (!response.ok) {
          throw new Error(response.status + " " + JSON.stringify(message));
        }

        setErrMsg("");
        setQuickPicks(null);
        toast("Email sent");
      } catch (error) {
        setErrMsg(error.message || "Something went wrong!");
      }
      history.replace(`{$process.env.PUBLIC_URL}`);
    }
  };

  return (
    <React.Fragment>
      <QuickPickList formData={formData} />
      <Form>
        <Form.Group controlId="email" className="mb-4">
          <Form.Label>Enter Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {formErrors && <div className="text-danger">{formErrors}</div>}
        </Form.Group>
        <ButtonGroup className="float-lg-end">
          <Button variant="primary" onClick={emailResults}>
            Send Results
          </Button>
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </React.Fragment>
  );
}

export default SendResults;
