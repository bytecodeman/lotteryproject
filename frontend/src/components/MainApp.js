import React from "react";
import { Link } from "react-router-dom";
import LotteryQPForm from "./LotteryQPForm";
import QuickPickList from "./QuickPickList";

function MainApp({ supportedGames, formData, setFormData, setErrMsg }) {
  const getLotteryInfo = async ({
    number,
    game,
    mustIncludeNumbers,
    desiredPowerBall,
  }) => {
    try {
      const reqData = { number, game, mustIncludeNumbers, desiredPowerBall };
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

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setErrMsg("");
      setFormData({ ...formData, quickPicks: responseData.qp });
    } catch (error) {
      setErrMsg("GetQuickPicks went wrong: " + error.message);
      setFormData({ ...formData, quickPicks: null });
    }
  };

  const clearApp = () => {
    setErrMsg("");
    setFormData({
      quickPicks: null,
      number: 1,
      game: "",
      mustIncludeNumbers: "",
      desiredPowerBall: "",
      allowMedia: false,
    });
  };

  return (
    <React.Fragment>
      {formData.quickPicks && (
        <>
          <QuickPickList formData={formData} />
          <Link to="/send" className="btn btn-primary mb-5">
            Email Results
          </Link>
        </>
      )}
      <LotteryQPForm
        supportedGames={supportedGames}
        formData={formData}
        setFormData={setFormData}
        onFormSubmitter={getLotteryInfo}
        onFormReset={clearApp}
      />
    </React.Fragment>
  );
}

export default MainApp;
