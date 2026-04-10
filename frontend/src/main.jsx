import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  //here <BrowserRouter> is used to navigate between the pages of the website without loading as react dom is loaded inside this variable.
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
