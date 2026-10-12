import React from "react";
import ReactDOM from "react-dom/client";
import { TopBar } from "./topbar";

import "./index.module.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TopBar />
  </React.StrictMode>,
);
