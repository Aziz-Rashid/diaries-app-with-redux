import React from "react";
import ReactDOM from "react-dom";
import App from "./App/App";
import { setupServer } from "./Services/Mirage/server";
import { Provider } from "react-redux";
import store from "./store";

if (process.env.NODE_ENV === "development") {
  setupServer();
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);