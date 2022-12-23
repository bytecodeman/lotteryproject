import React from "react";

import "./QuickPick.css";

const QuickPick = props => {
  const pad = (number, size) => {
    let s = String(number);
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  };

  const { padding, numbers, pball } = props;
  let listItemStyle = "quick-pick";
  if (props.allowMedia) {
    listItemStyle += " fancy";
  }

  return (
    <li className={listItemStyle}>
      {numbers.map((e, i) => (
        <span key={i}>{padding ? pad(e, 2) : e}</span>
      ))}
      {pball ? (
        <span className='pball'>{padding ? pad(pball, 2) : pball}</span>
      ) : null}
    </li>
  );
};

export default QuickPick;
