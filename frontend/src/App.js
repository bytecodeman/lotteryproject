import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ReCaptcha, loadReCaptcha } from "react-recaptcha-v3";
import { Container, Row, Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import JumboTron from "./components/JumboTron";
import MainApp from "./components/MainApp";
import SendResults from "./components/SendResults";

function App() {
  const [quickPicks, setQuickPicks] = useState(null);
  const [tokenVerified, setTokenVerified] = useState();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    loadReCaptcha(`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`);
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
      setErrMsg(error.message || "Something went wrong!");
      setTokenVerified(false);
    }
  };

  let appState;
  let appStateClass;

  if (tokenVerified === undefined) {
    appState = <span>Validating Recaptcha . . .</span>;
  } else if (tokenVerified === false) {
    appState = <span>Captcha Not Validated. Try Reloading the Page.</span>;
    appStateClass = "error";
  }
  if (errMsg) {
    appState = (
      <React.Fragment>
        {appState} <br /> {errMsg}
      </React.Fragment>
    );
    appStateClass = "error";
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
              {appState ? <h2 className={appStateClass}>{appState}</h2> : null}
              <Switch>
                <Route
                  path="/"
                  exact
                  render={(props) => (
                    <MainApp
                      quickPicks={quickPicks}
                      setQuickPicks={setQuickPicks}
                      setErrMsg={setErrMsg}
                      tokenVerified={tokenVerified}
                      {...props}
                    />
                  )}
                />
                {quickPicks && (
                  <Route
                    path="/send"
                    render={(props) => (
                      <SendResults
                        quickPicks={quickPicks}
                        setQuickPicks={setQuickPicks}
                        setErrMsg={setErrMsg}
                        {...props}
                      />
                    )}
                  />
                )}
                <Redirect from="/*" to="/" />
              </Switch>
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
