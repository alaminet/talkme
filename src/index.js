import React from "react";
import ReactDOM from "react-dom/client";
// eslint-disable-next-line
import firebaseConfig from "./dbconnection/firebaseConfig";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Provider } from "react-redux";
import store from "./features/Store/Store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
