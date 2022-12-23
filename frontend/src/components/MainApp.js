import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import LotteryQPForm from "./LotteryQPForm";
import QuickPickList from "./QuickPickList";

import "./MainApp.css";

function MainApp({ tokenVerified, setErrMsg, quickPicks, setQuickPicks }) {
  const [allowMedia, setAllowMedia] = useState(false);

  const getLotteryInfo = async (game, number) => {
    try {
      const reqData = {
        game,
        number,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/getquickpicks`,
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

      setErrMsg("");
      setQuickPicks(responseData.qp);
    } catch (error) {
      setErrMsg(error.message || "Something went wrong!");
      setQuickPicks(null);
    }
  };

  const clearApp = () => {
    setQuickPicks(null);
    setErrMsg("");
  };
  const reloadPage = () => window.location.reload(true);

  return (
    <React.Fragment>
      {quickPicks && (
        <>
          <QuickPickList allowMedia={allowMedia} qp={quickPicks} />
          <Link to="/send" className="btn btn-primary mb-5">
            Email Results
          </Link>
        </>
      )}
      <LotteryQPForm
        tokenVerified={tokenVerified}
        onFormSubmitter={getLotteryInfo}
        onFormReset={clearApp}
        onError={setErrMsg}
        allowMedia={allowMedia}
        setAllowMedia={setAllowMedia}
      />
      {tokenVerified === false ? (
        <Button variant="info" className="mt-5" onClick={reloadPage}>
          Reload Page
        </Button>
      ) : null}
    </React.Fragment>
  );
}

export default MainApp;
