import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "@contexts/UserContext";
import "./index.css";
import { MainRoute } from "./routes/main-routes";

const Navigator = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <MainRoute />
      </BrowserRouter>
    </UserContextProvider>
  )
}
const rootDOM = ReactDOM.createRoot(document.getElementById("root"))

rootDOM.render(<Navigator />);
