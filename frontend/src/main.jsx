import React from "react";
import ReactDOM from "react-dom/client"; // ✅ correct import
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ use createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
