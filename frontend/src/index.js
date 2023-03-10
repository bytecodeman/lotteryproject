import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import App from "./App";

const myApp = (
  <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
    <App />
  </BrowserRouter>
);
ReactDOM.render(myApp, document.getElementById("root"));
