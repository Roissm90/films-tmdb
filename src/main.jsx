import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './assets/scss/styles.scss';
import "@fontsource/inter/400.css"; // Normal
import "@fontsource/inter/600.css"; // Semi-bold
import "@fontsource/inter/700.css"; // Bold


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
