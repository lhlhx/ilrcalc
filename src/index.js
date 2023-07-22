import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const DATA = [
    { id: "abs-0", description: "Trip 1", start_date: "2021-07-01", end_date: "2021-07-02" , counted: true },
    { id: "abs-1", description: "Trip 2", start_date: "2021-07-01", end_date: "2021-07-03", counted: false },
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
    <App periods={DATA} />
    </React.StrictMode>
);
