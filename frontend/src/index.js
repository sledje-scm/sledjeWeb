import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeaturePage from "./FeaturePage";
import LandingPage from "./LandingPage";
import App from "./App";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturePage />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);