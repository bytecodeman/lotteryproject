import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import QuickPick from "./QuickPick";
import "./QuickPickList.css";

const QuickPickList = ({ formData }) => {
  const { qp, longName, padding } = formData.quickPicks;
  let content = null;
  let header = null;
  let onlyone = "";

  useEffect(() => {
    (() => {
      const element = document.querySelector("#results");
      element.scrollIntoView();
    })();
  }, [qp]);

  if (!qp) {
    content = <p>No QuickPicks Generated</p>;
  } else {
    if (qp.length === 0) {
      content = <p>No Quick Picks Generated</p>;
    } else if (qp.length === 1) {
      header = <h2>Your {longName} Quick Pick:</h2>;
      onlyone = "onlyone";
    } else {
      header = <h2>Your {longName} Quick Picks:</h2>;
    }
    content = (
      <ol className={`quickpick-list ${onlyone}`}>
        {qp.map((e, i) => (
          <QuickPick
            key={i}
            allowMedia={formData.allowMedia}
            numbers={e.numbers}
            pball={e.pball}
            padding={padding}
          />
        ))}
      </ol>
    );
  }

  return (
    <section id="results">
      <Row>
        <Col>
          {header}
          {content}
        </Col>
      </Row>
    </section>
  );
};

export default QuickPickList;
