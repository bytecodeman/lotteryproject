import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ReCaptcha, loadReCaptcha } from "react-recaptcha-v3";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import JumboTron from "./components/JumboTron";
import MainApp from "./components/MainApp";
import SendResults from "./components/SendResults";

function App() {
  const [supportedGames, setSupportedGames] = useState();
  const [tokenVerified, setTokenVerified] = useState();
  const [errMsg, setErrMsg] = useState("");
  const [formData, setFormData] = useState({
    quickPicks: null,
    number: 1,
    game: "",
    mustIncludeNumbers: "",
    desiredPowerBall: "",
    allowMedia: false,
  });

  useEffect(() => {
    loadReCaptcha(`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL}/supportedgames`
        );
        if (!response.ok) {
          throw new Error(response.status);
        }
        const responseData = await response.json();
        setSupportedGames(responseData.gs.gamesSupported);
      } catch (error) {
        setErrMsg("Supported Games went wrong! " + error);
      }
    })();
  }, []);

  const verifyToken = async (token) => {
    try {
      const reqData = {
        token,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/verifytoken`,
        {
          method: "POST",
          body: JSON.stringify(reqData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const responseData = await response.json();
      setTokenVerified(responseData.success);
    } catch (error) {
      setErrMsg("VerifyToken went wrong! " + error);
      setTokenVerified(false);
    }
  };

  const reloadPage = () => window.location.reload(true);

  let tokenStateDiv;
  let errMsgDiv;
  let mainAppDiv;

  if (tokenVerified === undefined) {
    tokenStateDiv = <div className="h3">Validating Recaptcha . . .</div>;
  } else if (tokenVerified === false) {
    tokenStateDiv = (
      <div className="h3 text-danger fw-bold">
        Captcha Not Validated. Try Reloading the Page.
      </div>
    );
  }

  if (errMsg) {
    errMsgDiv = <div className="h3 text-danger fw-bold">{errMsg}</div>;
  }

  if (tokenVerified) {
    mainAppDiv = (
      <Switch>
        {formData.quickPicks && (
          <Route
            path="/send"
            render={(props) => (
              <SendResults
                formData={formData}
                setFormData={setFormData}
                setErrMsg={setErrMsg}
                {...props}
              />
            )}
          />
        )}
        <Route
          path="/"
          render={(props) => (
            <MainApp
              supportedGames={supportedGames}
              formData={formData}
              setFormData={setFormData}
              setErrMsg={setErrMsg}
              {...props}
            />
          )}
        />
        <Redirect from="/*" to="/" />
      </Switch>
    );
  } else if (tokenVerified === false) {
    mainAppDiv = (
      <Button variant="info" className="mt-5" onClick={reloadPage}>
        Reload Page
      </Button>
    );
  }

  return (
    <React.Fragment>
      <header>
        <Header />
        <JumboTron />
      </header>
      <main>
        <Container>
          <Row>
            <Col>
              {tokenStateDiv}
              {errMsgDiv}
              {mainAppDiv}
            </Col>
          </Row>
        </Container>
      </main>
      <ToastContainer />
      <ReCaptcha
        sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
        action="getquickpicks"
        verifyCallback={verifyToken}
      />
    </React.Fragment>
  );
}

export default App;
